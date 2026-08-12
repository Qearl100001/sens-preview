import { type CSSProperties, useEffect, useState } from "react";
import { useNavigationTheme } from "../design-system/appearance";
import { buildShadow, getColorToken } from "../design-system/color-utils";
import { sensCursorValue } from "../design-system/cursors";
import { SensIcon, type IconName, type IconVariant } from "../design-system/icons";
import { getNavigationColorToken, getThemeSideBackground } from "../design-system/navigation-color";
import { getTypographyToken } from "../design-system/typography";
import tokens from "../design-system/tokens.resolved.json";
import { SensTips } from "./SensTips";
import "./side-navigation.css";

const u = tokens.unit as Record<string, number>;

/** Figma 1777:111120 · 产品壳侧导航紧凑态固定宽度。 */
export const PRODUCT_SHELL_SIDE_NAV_COLLAPSED_WIDTH = 30;
/** Figma 18593:101946 · 单层带图标侧导航紧凑态固定宽度。 */
export const PRODUCT_SHELL_SIDE_NAV_ICON_COLLAPSED_WIDTH = 56;
/** Figma 1777:111114 · 产品壳侧导航展开态固定宽度。 */
export const PRODUCT_SHELL_SIDE_NAV_EXPANDED_WIDTH = 220;

const SIDE_NAV_HEADER_HEIGHT = 62;
const SIDE_NAV_HEADER_ICON_SIZE = 20;
const SIDE_NAV_ITEM_ICON_SIZE = 20;
const SIDE_NAV_GROUP_HEIGHT = 30;
const SIDE_NAV_ICON_GROUP_HEIGHT = 36;
const SIDE_NAV_ITEM_HEIGHT = 36;
const SIDE_NAV_ICON_ITEM_WIDTH = 40;
const SIDE_NAV_ITEM_MARGIN_INLINE = u["spacing/2x"];
const SIDE_NAV_VIRTUAL_GROUP_CONTENT_OFFSET = 12;
const SIDE_NAV_LANDING_ITEM_CONTENT_OFFSET = 34;

function getSideNavigationContentPaddingLeft(offsetFromPanelEdge: number) {
  return Math.max(0, offsetFromPanelEdge - SIDE_NAV_ITEM_MARGIN_INLINE);
}

const sideNavigationScrollStyle = {
  minHeight: 0,
  maxHeight: "100%",
  overflowX: "hidden",
  overflowY: "auto",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
} satisfies CSSProperties;

export type ProductShellSideNavigationMode = "normal" | "overlay" | "docked";

export interface ProductShellSideNavigationGroup {
  key: string;
  label: string;
  /** 二级虚拟分组图标；传入后进入「二级有图标 / 三级无图标」侧导场景。 */
  icon?: IconName;
  iconVariant?: IconVariant;
  /** 字符串项用于三级无图标场景；对象项用于「分析专属」二级落地功能带图标场景。 */
  items: Array<string | ProductShellSideNavigationItem>;
  defaultExpanded?: boolean;
  recommended?: boolean;
}

export interface ProductShellSideNavigationItem {
  key: string;
  label: string;
  icon?: IconName;
  iconVariant?: IconVariant;
}

const DEFAULT_GROUPS: ProductShellSideNavigationGroup[] = [
  { key: "data-access", label: "埋点数据接入", items: ["数据接入引导", "入库校验规则设置", "实时导入数据查询"], defaultExpanded: false },
  { key: "common-access", label: "通用数据接入", items: ["数据源管理", "数据表管理", "字段映射", "接入任务"], defaultExpanded: true },
  { key: "recommended", label: "更多推荐", items: ["分析模型", "智能预警", "归因分析"], defaultExpanded: false, recommended: true },
];

export interface ProductShellSideNavigationProps {
  mode?: ProductShellSideNavigationMode;
  onModeChange?: (mode: ProductShellSideNavigationMode) => void;
  productName?: string;
  /** 无层级的页面目录；传入后不渲染分组标题和展开控件。带 icon 时进入「单层带图标」侧导场景。 */
  items?: Array<string | ProductShellSideNavigationItem>;
  groups?: ProductShellSideNavigationGroup[];
  activeItem?: string;
  onActiveItemChange?: (item: string) => void;
  /**
   * 分组是否可收起。false 时全部展开且不展示开合箭头（样板间产品壳默认）。
   * 默认 true，保留 showcase 等可收起演示。
   */
  groupsCollapsible?: boolean;
}

function normalizeSideNavigationItem(item: string | ProductShellSideNavigationItem): ProductShellSideNavigationItem {
  return typeof item === "string" ? { key: item, label: item } : item;
}

function getSideNavigationItemLabel(item: string | ProductShellSideNavigationItem): string {
  return normalizeSideNavigationItem(item).label;
}

function groupHasActiveChild(group: ProductShellSideNavigationGroup, activeItem: string): boolean {
  return group.items.some((item) => getSideNavigationItemLabel(item) === activeItem);
}

function groupHasIconChildren(group: ProductShellSideNavigationGroup): boolean {
  return group.items.some((item) => typeof item !== "string" && item.icon != null);
}

function SideNavigationIconButton({
  label,
  tooltip,
  icon,
  defaultColor,
  activeColor,
  onClick,
}: {
  label: string;
  tooltip: string;
  icon: IconName;
  defaultColor: string;
  activeColor: string;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const color = isHovered || isPressed ? activeColor : defaultColor;

  return (
    <SensTips title={tooltip} placement="right">
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPressed(false);
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onBlur={() => setIsPressed(false)}
        style={{
          width: u["size/component-height/m"],
          height: u["size/component-height/m"],
          padding: 0,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          border: 0,
          borderRadius: u["radius/m"],
          background: "transparent",
          color,
          cursor: sensCursorValue("pointer"),
        }}
      >
        <SensIcon name={icon} size={SIDE_NAV_HEADER_ICON_SIZE} color="currentColor" />
      </button>
    </SensTips>
  );
}

/**
 * 产品壳专属侧导航。它负责产品模块和菜单层级，不负责页面内锚点、目录等 Context Side Panel。
 */
export function ProductShellSideNavigation({
  mode: controlledMode,
  onModeChange,
  productName = "数据融合",
  items,
  groups = DEFAULT_GROUPS,
  activeItem: controlledActiveItem,
  onActiveItemChange,
  groupsCollapsible = true,
}: ProductShellSideNavigationProps) {
  const [internalMode, setInternalMode] = useState<ProductShellSideNavigationMode>("normal");
  const [internalActiveItem, setInternalActiveItem] = useState("数据源管理");
  const allGroupKeys = groups.map((group) => group.key);
  const [openGroupKeys, setOpenGroupKeys] = useState<string[]>(() =>
    groupsCollapsible ? groups.filter((group) => group.defaultExpanded).map((group) => group.key) : allGroupKeys,
  );
  const [hoveredKey, setHoveredKey] = useState<string>();
  const [pressedKey, setPressedKey] = useState<string>();
  const normalizedItems = items?.map(normalizeSideNavigationItem);
  const hasIconItems = normalizedItems?.some((item) => item.icon != null) ?? false;
  const hasIconGroups = items == null && groups.some((group) => group.icon != null);
  const hasIconChildGroups = items == null && groups.some(groupHasIconChildren);
  const hasIconNavigation = hasIconItems || hasIconGroups || hasIconChildGroups;
  const collapsedWidth = hasIconNavigation ? PRODUCT_SHELL_SIDE_NAV_ICON_COLLAPSED_WIDTH : PRODUCT_SHELL_SIDE_NAV_COLLAPSED_WIDTH;

  const mode = controlledMode ?? internalMode;
  const activeItem = controlledActiveItem ?? internalActiveItem;
  const isNormal = mode === "normal";
  const isOverlay = mode === "overlay";
  const navigationTheme = useNavigationTheme();
  const sideText = getColorToken("theme-side-text");
  const sideSubText = getColorToken("theme-side-subText");
  const sideTextActive = getNavigationColorToken("theme-side-text-active", navigationTheme);
  const sideIcon = getColorToken("theme-side-icon");
  const sideSubIcon = getColorToken("theme-side-subIcon");
  const sideIconActive = getNavigationColorToken("theme-side-icon-active", navigationTheme);
  const sideHoverBackground = getColorToken("theme-side-background-hover");
  const sideClickBackground = getColorToken("theme-side-background-click");
  const sideActiveBackground = getNavigationColorToken("theme-side-background-active", navigationTheme);

  // 换域或关闭可收起时，同步展开态
  useEffect(() => {
    if (!groupsCollapsible) {
      setOpenGroupKeys(groups.map((group) => group.key));
      return;
    }
    setOpenGroupKeys(groups.filter((group) => group.defaultExpanded).map((group) => group.key));
  }, [groups, groupsCollapsible]);

  const updateMode = (nextMode: ProductShellSideNavigationMode) => {
    if (controlledMode == null) setInternalMode(nextMode);
    onModeChange?.(nextMode);
  };

  const updateActiveItem = (item: string) => {
    if (controlledActiveItem == null) setInternalActiveItem(item);
    onActiveItemChange?.(item);
  };

  const toggleGroup = (key: string) => {
    if (!groupsCollapsible) return;
    setOpenGroupKeys((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]));
  };

  if (isNormal) {
    return (
      <aside
        aria-label="产品壳侧导航，紧凑态"
        className="sens-product-shell-side-navigation"
        data-side-navigation-mode="normal"
        onMouseEnter={() => updateMode("overlay")}
        style={{
          width: collapsedWidth,
          flex: `0 0 ${collapsedWidth}px`,
          alignSelf: "stretch",
          display: "flex",
          flexDirection: "column",
          background: getThemeSideBackground(navigationTheme),
          borderTopLeftRadius: u["radius/xl"],
          ...sideNavigationScrollStyle,
        }}
      >
        <div
          style={{
            height: hasIconNavigation ? SIDE_NAV_HEADER_HEIGHT : undefined,
            flex: hasIconNavigation ? `0 0 ${SIDE_NAV_HEADER_HEIGHT}px` : undefined,
            display: "flex",
            alignItems: hasIconNavigation ? "center" : "flex-start",
            justifyContent: "center",
            paddingTop: hasIconNavigation ? 0 : u["spacing/3x"],
          }}
        >
          <SideNavigationIconButton
            label="展开侧边导航"
            tooltip="展开"
            icon="side-nav-expand"
            defaultColor={sideIcon}
            activeColor={sideIconActive}
            onClick={() => updateMode("overlay")}
          />
        </div>
        {hasIconNavigation ? (
          <div style={{ display: "flex", flexDirection: "column", gap: u["spacing/4x"], paddingBottom: u["spacing/6x"] }}>
            {normalizedItems?.map((item) => {
              const itemInteractionKey = `flat-item-${item.key}`;
              const isActive = item.label === activeItem;
              const itemBackground = isActive
                ? sideActiveBackground
                : pressedKey === itemInteractionKey
                  ? sideClickBackground
                  : hoveredKey === itemInteractionKey
                    ? sideHoverBackground
                    : "transparent";

              return (
                <button
                  key={item.key}
                  type="button"
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => updateActiveItem(item.label)}
                  onMouseEnter={() => setHoveredKey(itemInteractionKey)}
                  onMouseLeave={() => setHoveredKey(undefined)}
                  onMouseDown={() => setPressedKey(itemInteractionKey)}
                  onMouseUp={() => setPressedKey(undefined)}
                  style={{
                    width: SIDE_NAV_ICON_ITEM_WIDTH,
                    height: SIDE_NAV_ITEM_HEIGHT,
                    marginInline: SIDE_NAV_ITEM_MARGIN_INLINE,
                    padding: u["spacing/2x"],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: 0,
                    borderRadius: u["radius/m"],
                    background: itemBackground,
                    color: isActive ? sideIconActive : sideIcon,
                    cursor: sensCursorValue("pointer"),
                  }}
                >
                  {item.icon ? <SensIcon name={item.icon} variant={item.iconVariant} size={SIDE_NAV_ITEM_ICON_SIZE} color="currentColor" /> : null}
                </button>
              );
            })}
            {hasIconGroups || hasIconChildGroups ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: hasIconChildGroups ? u["spacing/6x"] : u["spacing/4x"],
                }}
              >
                {groups.map((group) => {
                  const collapsedItems = groupHasIconChildren(group)
                    ? group.items.map(normalizeSideNavigationItem).filter((item) => item.icon != null)
                    : group.icon != null
                      ? [{ key: group.key, label: group.label, icon: group.icon, iconVariant: group.iconVariant }]
                      : [];

                  if (collapsedItems.length === 0) return null;

                  return (
                    <div key={group.key} style={{ display: "flex", flexDirection: "column", gap: groupHasIconChildren(group) ? u["spacing/1x"] : 0 }}>
                      {collapsedItems.map((item) => {
                        const groupInteractionKey = `collapsed-group-${group.key}-${item.key}`;
                        const isActive = item.label === activeItem || (!groupHasIconChildren(group) && groupHasActiveChild(group, activeItem));
                        const itemBackground = isActive
                          ? sideActiveBackground
                          : pressedKey === groupInteractionKey
                            ? sideClickBackground
                            : hoveredKey === groupInteractionKey
                              ? sideHoverBackground
                              : "transparent";

                        return (
                          <button
                            key={item.key}
                            type="button"
                            aria-label={item.label}
                            aria-current={isActive ? "page" : undefined}
                            onClick={() => {
                              if (groupHasIconChildren(group)) {
                                updateActiveItem(item.label);
                              }
                              updateMode("overlay");
                            }}
                            onMouseEnter={() => setHoveredKey(groupInteractionKey)}
                            onMouseLeave={() => setHoveredKey(undefined)}
                            onMouseDown={() => setPressedKey(groupInteractionKey)}
                            onMouseUp={() => setPressedKey(undefined)}
                            style={{
                              width: SIDE_NAV_ICON_ITEM_WIDTH,
                              height: SIDE_NAV_ITEM_HEIGHT,
                              marginInline: SIDE_NAV_ITEM_MARGIN_INLINE,
                              padding: u["spacing/2x"],
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: 0,
                              borderRadius: u["radius/m"],
                              background: itemBackground,
                              color: isActive ? sideIconActive : groupHasIconChildren(group) ? sideIcon : sideSubIcon,
                              cursor: sensCursorValue("pointer"),
                            }}
                          >
                            {item.icon ? <SensIcon name={item.icon} variant={item.iconVariant} size={SIDE_NAV_ITEM_ICON_SIZE} color="currentColor" /> : null}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : null}
      </aside>
    );
  }

  return (
    <aside
      aria-label="产品壳侧导航"
      className="sens-product-shell-side-navigation"
      data-side-navigation-mode={mode}
      onMouseLeave={() => {
        if (isOverlay) updateMode("normal");
      }}
      style={{
        position: isOverlay ? "absolute" : "relative",
        insetBlock: isOverlay ? 0 : undefined,
        insetInlineStart: isOverlay ? 0 : undefined,
        zIndex: isOverlay ? 2 : undefined,
        width: PRODUCT_SHELL_SIDE_NAV_EXPANDED_WIDTH,
        flex: `0 0 ${PRODUCT_SHELL_SIDE_NAV_EXPANDED_WIDTH}px`,
        alignSelf: "stretch",
        display: "flex",
        flexDirection: "column",
        background: getThemeSideBackground(navigationTheme),
        borderTopLeftRadius: u["radius/xl"],
        // Only a floating side navigation owns a right-facing shadow.
        boxShadow: isOverlay ? buildShadow("D4", "right") : undefined,
        ...sideNavigationScrollStyle,
      }}
    >
      <div
        style={{
          height: SIDE_NAV_HEADER_HEIGHT,
          flex: `0 0 ${SIDE_NAV_HEADER_HEIGHT}px`,
          display: "flex",
          alignItems: "center",
          gap: u["spacing/2x"],
          paddingInline: u["spacing/4x"],
        }}
      >
        <span
          style={{
            flex: 1,
            overflow: "hidden",
            color: sideText,
            fontSize: getTypographyToken("font-size/xxl"),
            lineHeight: `${getTypographyToken("line-height/xxl")}px`,
            fontWeight: getTypographyToken("font-weight/semibold"),
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {productName}
        </span>
        <SideNavigationIconButton
          label={isOverlay ? "锁定侧边导航" : "收起侧边导航"}
          tooltip={isOverlay ? "锁定" : "收起"}
          icon={isOverlay ? "side-nav-unpin" : "side-nav-collapse"}
          defaultColor={sideIcon}
          activeColor={sideIconActive}
          onClick={() => updateMode(isOverlay ? "docked" : "normal")}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: hasIconItems ? u["spacing/1x"] : u["spacing/4x"], paddingBottom: u["spacing/6x"] }}>
        {normalizedItems != null
          ? normalizedItems.map((item) => {
              const itemInteractionKey = `flat-item-${item.key}`;
              const isActive = item.label === activeItem;
              const itemBackground = isActive
                ? sideActiveBackground
                : pressedKey === itemInteractionKey
                  ? sideClickBackground
                  : hoveredKey === itemInteractionKey
                    ? sideHoverBackground
                    : "transparent";

              return (
                <button
                  key={item.key}
                  type="button"
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => updateActiveItem(item.label)}
                  onMouseEnter={() => setHoveredKey(itemInteractionKey)}
                  onMouseLeave={() => setHoveredKey(undefined)}
                  onMouseDown={() => setPressedKey(itemInteractionKey)}
                  onMouseUp={() => setPressedKey(undefined)}
                  style={{
                    width: `calc(100% - ${u["spacing/4x"]}px)`,
                    height: SIDE_NAV_ITEM_HEIGHT,
                    marginInline: SIDE_NAV_ITEM_MARGIN_INLINE,
                    padding: `7px ${u["spacing/3x"]}px`,
                    display: "flex",
                    alignItems: "center",
                    gap: item.icon ? u["spacing/1x"] : 0,
                    border: 0,
                    borderRadius: u["radius/m"],
                    background: itemBackground,
                    color: isActive ? sideTextActive : sideText,
                    cursor: sensCursorValue("pointer"),
                    textAlign: "left",
                  }}
                >
                  {item.icon ? <SensIcon name={item.icon} variant={item.iconVariant} size={SIDE_NAV_ITEM_ICON_SIZE} color={isActive ? sideIconActive : sideIcon} /> : null}
                  <span style={{ overflow: "hidden", fontSize: getTypographyToken("font-size/m"), lineHeight: `${getTypographyToken("line-height/m")}px`, fontWeight: isActive ? getTypographyToken("font-weight/medium") : getTypographyToken("font-weight/regular"), whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                    {item.label}
                  </span>
                </button>
              );
            })
          : groups.map((group) => {
              const isOpen = groupsCollapsible ? openGroupKeys.includes(group.key) : true;
              const hasActiveChild = groupHasActiveChild(group, activeItem);
              const isIconGroup = group.icon != null;
              const hasIconChildren = groupHasIconChildren(group);
              const groupInteractionKey = `group-${group.key}`;
              const groupBackground =
                groupsCollapsible &&
                (pressedKey === groupInteractionKey
                  ? sideClickBackground
                  : hoveredKey === groupInteractionKey
                    ? sideHoverBackground
                    : "transparent");
              const resolvedGroupBackground = groupBackground || "transparent";

              return (
                <div key={group.key} style={{ display: "flex", flexDirection: "column", gap: isOpen ? u["spacing/1x"] : 0 }}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggleGroup(group.key)}
                    onMouseEnter={() => groupsCollapsible && setHoveredKey(groupInteractionKey)}
                    onMouseLeave={() => setHoveredKey(undefined)}
                    onMouseDown={() => groupsCollapsible && setPressedKey(groupInteractionKey)}
                    onMouseUp={() => setPressedKey(undefined)}
                    style={{
                      width: `calc(100% - ${u["spacing/4x"]}px)`,
                      height: isIconGroup ? SIDE_NAV_ICON_GROUP_HEIGHT : SIDE_NAV_GROUP_HEIGHT,
                      marginInline: SIDE_NAV_ITEM_MARGIN_INLINE,
                      padding: isIconGroup
                        ? `7px ${u["spacing/2․5x"] ?? 10}px 7px ${getSideNavigationContentPaddingLeft(SIDE_NAV_VIRTUAL_GROUP_CONTENT_OFFSET)}px`
                        : `6px ${u["spacing/2․5x"] ?? 10}px 6px ${u["spacing/3x"]}px`,
                      display: "flex",
                      alignItems: "center",
                      gap: u["spacing/2x"],
                      border: 0,
                      borderRadius: u["radius/m"],
                      background: resolvedGroupBackground,
                      color: hasActiveChild ? sideTextActive : sideSubText,
                      cursor: groupsCollapsible ? sensCursorValue("pointer") : "default",
                      textAlign: "left",
                    }}
                  >
                    <span style={{ minWidth: 0, flex: 1, display: "flex", alignItems: "center", gap: isIconGroup ? u["spacing/1x"] : 0, overflow: "hidden", fontSize: getTypographyToken(isIconGroup ? "font-size/m" : "font-size/s"), lineHeight: `${getTypographyToken(isIconGroup ? "line-height/m" : "line-height/s")}px`, whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                      {group.icon ? <SensIcon name={group.icon} variant={group.iconVariant} size={SIDE_NAV_ITEM_ICON_SIZE} color={hasActiveChild ? sideIconActive : sideSubIcon} /> : null}
                      {group.recommended ? <SensIcon name="side-nav-link" size={16} color={hasActiveChild ? sideIconActive : sideSubIcon} style={{ marginRight: u["spacing/1x"], verticalAlign: "text-bottom" }} /> : null}
                      <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>{group.label}</span>
                    </span>
                    {groupsCollapsible ? (
                      <SensIcon name={isOpen ? "side-nav-up" : "side-nav-down"} size={14} color={hasActiveChild ? sideIconActive : sideSubIcon} />
                    ) : null}
                  </button>

              {isOpen
                ? group.items.map((rawItem) => {
                    const item = normalizeSideNavigationItem(rawItem);
                    const itemInteractionKey = `item-${group.key}-${item.key}`;
                    const isActive = item.label === activeItem;
                    const itemBackground = isActive
                      ? sideActiveBackground
                      : pressedKey === itemInteractionKey
                        ? sideClickBackground
                        : hoveredKey === itemInteractionKey
                          ? sideHoverBackground
                          : "transparent";

                    return (
                      <button
                        key={item.key}
                        type="button"
                        aria-current={isActive ? "page" : undefined}
                        onClick={() => updateActiveItem(item.label)}
                        onMouseEnter={() => setHoveredKey(itemInteractionKey)}
                        onMouseLeave={() => setHoveredKey(undefined)}
                        onMouseDown={() => setPressedKey(itemInteractionKey)}
                        onMouseUp={() => setPressedKey(undefined)}
                        style={{
                          width: `calc(100% - ${u["spacing/4x"]}px)`,
                          height: SIDE_NAV_ITEM_HEIGHT,
                          marginInline: SIDE_NAV_ITEM_MARGIN_INLINE,
                          padding: isIconGroup
                            ? `7px ${u["spacing/3x"]}px 7px ${getSideNavigationContentPaddingLeft(SIDE_NAV_LANDING_ITEM_CONTENT_OFFSET)}px`
                            : `7px ${u["spacing/3x"]}px`,
                          display: "flex",
                          alignItems: "center",
                          gap: item.icon ? u["spacing/1x"] : 0,
                          border: 0,
                          borderRadius: u["radius/m"],
                          background: itemBackground,
                          color: isActive ? sideTextActive : sideText,
                          cursor: sensCursorValue("pointer"),
                          textAlign: "left",
                        }}
                      >
                        {item.icon ? <SensIcon name={item.icon} variant={item.iconVariant} size={SIDE_NAV_ITEM_ICON_SIZE} color={isActive ? sideIconActive : sideIcon} /> : null}
                        <span style={{ overflow: "hidden", fontSize: getTypographyToken("font-size/m"), lineHeight: `${getTypographyToken("line-height/m")}px`, fontWeight: isActive ? getTypographyToken("font-weight/medium") : getTypographyToken("font-weight/regular"), whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                          {item.label}
                        </span>
                      </button>
                    );
                  })
                : null}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
