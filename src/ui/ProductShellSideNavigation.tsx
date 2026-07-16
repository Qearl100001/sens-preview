import { useState } from "react";
import { Tooltip } from "antd";
import { buildShadow, getColorToken } from "../design-system/color-utils";
import { SensIcon, type IconName } from "../design-system/icons";
import { getThemeSideBackground } from "../design-system/navigation-color";
import { getTypographyToken } from "../design-system/typography";
import tokens from "../design-system/tokens.resolved.json";

const u = tokens.unit as Record<string, number>;

/** Figma 1777:111120 · 产品壳侧导航紧凑态固定宽度。 */
export const PRODUCT_SHELL_SIDE_NAV_COLLAPSED_WIDTH = 30;
/** Figma 1777:111114 · 产品壳侧导航展开态固定宽度。 */
export const PRODUCT_SHELL_SIDE_NAV_EXPANDED_WIDTH = 220;

const SIDE_NAV_HEADER_HEIGHT = 62;
const SIDE_NAV_GROUP_HEIGHT = 30;
const SIDE_NAV_ITEM_HEIGHT = 36;

export type ProductShellSideNavigationMode = "normal" | "overlay" | "docked";

export interface ProductShellSideNavigationGroup {
  key: string;
  label: string;
  items: string[];
  defaultExpanded?: boolean;
  recommended?: boolean;
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
  groups?: ProductShellSideNavigationGroup[];
  activeItem?: string;
  onActiveItemChange?: (item: string) => void;
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
    <Tooltip title={tooltip} placement="right">
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
          cursor: "pointer",
        }}
      >
        <SensIcon name={icon} size={icon === "side-nav-collapse" || icon === "side-nav-expand" ? 18 : 16} color="currentColor" />
      </button>
    </Tooltip>
  );
}

/**
 * 产品壳专属侧导航。它负责产品模块和菜单层级，不负责页面内锚点、目录等 Context Side Panel。
 */
export function ProductShellSideNavigation({
  mode: controlledMode,
  onModeChange,
  productName = "数据融合",
  groups = DEFAULT_GROUPS,
  activeItem: controlledActiveItem,
  onActiveItemChange,
}: ProductShellSideNavigationProps) {
  const [internalMode, setInternalMode] = useState<ProductShellSideNavigationMode>("normal");
  const [internalActiveItem, setInternalActiveItem] = useState("数据源管理");
  const [openGroupKeys, setOpenGroupKeys] = useState<string[]>(() =>
    groups.filter((group) => group.defaultExpanded).map((group) => group.key),
  );
  const [hoveredKey, setHoveredKey] = useState<string>();
  const [pressedKey, setPressedKey] = useState<string>();

  const mode = controlledMode ?? internalMode;
  const activeItem = controlledActiveItem ?? internalActiveItem;
  const isNormal = mode === "normal";
  const isOverlay = mode === "overlay";
  const sideText = getColorToken("theme-side-text");
  const sideSubText = getColorToken("theme-side-subText");
  const sideTextActive = getColorToken("theme-side-text-active");
  const sideIcon = getColorToken("theme-side-icon");
  const sideSubIcon = getColorToken("theme-side-subIcon");
  const sideIconActive = getColorToken("theme-side-icon-active");
  const sideHoverBackground = getColorToken("theme-side-background-hover");
  const sideClickBackground = getColorToken("theme-side-background-click");
  const sideActiveBackground = getColorToken("theme-side-background-active");

  const updateMode = (nextMode: ProductShellSideNavigationMode) => {
    if (controlledMode == null) setInternalMode(nextMode);
    onModeChange?.(nextMode);
  };

  const updateActiveItem = (item: string) => {
    if (controlledActiveItem == null) setInternalActiveItem(item);
    onActiveItemChange?.(item);
  };

  const toggleGroup = (key: string) => {
    setOpenGroupKeys((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]));
  };

  if (isNormal) {
    return (
      <aside
        aria-label="产品壳侧导航，紧凑态"
        data-side-navigation-mode="normal"
        style={{
          width: PRODUCT_SHELL_SIDE_NAV_COLLAPSED_WIDTH,
          flex: `0 0 ${PRODUCT_SHELL_SIDE_NAV_COLLAPSED_WIDTH}px`,
          alignSelf: "stretch",
          display: "flex",
          justifyContent: "center",
          paddingTop: u["spacing/3x"],
          background: getThemeSideBackground(),
          borderTopLeftRadius: u["radius/xl"],
          overflow: "hidden",
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
      </aside>
    );
  }

  return (
    <aside
      aria-label="产品壳侧导航"
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
        background: getThemeSideBackground(),
        borderTopLeftRadius: u["radius/xl"],
        // Only a floating side navigation owns a right-facing shadow.
        boxShadow: isOverlay ? buildShadow("D4", "right") : undefined,
        overflow: "hidden",
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

      <div style={{ display: "flex", flexDirection: "column", gap: u["spacing/4x"], overflowY: "auto", paddingBottom: u["spacing/6x"] }}>
        {groups.map((group) => {
          const isOpen = openGroupKeys.includes(group.key);
          const hasActiveChild = group.items.includes(activeItem);
          const groupInteractionKey = `group-${group.key}`;
          const groupBackground =
            pressedKey === groupInteractionKey
              ? sideClickBackground
              : hoveredKey === groupInteractionKey
                ? sideHoverBackground
                : "transparent";

          return (
            <div key={group.key} style={{ display: "flex", flexDirection: "column", gap: isOpen ? u["spacing/1x"] : 0 }}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggleGroup(group.key)}
                onMouseEnter={() => setHoveredKey(groupInteractionKey)}
                onMouseLeave={() => setHoveredKey(undefined)}
                onMouseDown={() => setPressedKey(groupInteractionKey)}
                onMouseUp={() => setPressedKey(undefined)}
                style={{
                  width: `calc(100% - ${u["spacing/4x"]}px)`,
                  height: SIDE_NAV_GROUP_HEIGHT,
                  marginInline: u["spacing/2x"],
                  padding: `6px ${u["spacing/2․5x"] ?? 10}px 6px ${u["spacing/3x"]}px`,
                  display: "flex",
                  alignItems: "center",
                  gap: u["spacing/2x"],
                  border: 0,
                  borderRadius: u["radius/m"],
                  background: groupBackground,
                  color: hasActiveChild ? sideTextActive : sideSubText,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span style={{ minWidth: 0, flex: 1, overflow: "hidden", fontSize: getTypographyToken("font-size/s"), lineHeight: `${getTypographyToken("line-height/s")}px`, whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                  {group.recommended ? <SensIcon name="side-nav-link" size={16} color={hasActiveChild ? sideIconActive : sideSubIcon} style={{ marginRight: u["spacing/1x"], verticalAlign: "text-bottom" }} /> : null}
                  {group.label}
                </span>
                <SensIcon name={isOpen ? "side-nav-up" : "side-nav-down"} size={14} color={hasActiveChild ? sideIconActive : sideSubIcon} />
              </button>

              {isOpen
                ? group.items.map((item) => {
                    const itemInteractionKey = `item-${group.key}-${item}`;
                    const isActive = item === activeItem;
                    const itemBackground = isActive
                      ? sideActiveBackground
                      : pressedKey === itemInteractionKey
                        ? sideClickBackground
                        : hoveredKey === itemInteractionKey
                          ? sideHoverBackground
                          : "transparent";

                    return (
                      <button
                        key={item}
                        type="button"
                        aria-current={isActive ? "page" : undefined}
                        onClick={() => updateActiveItem(item)}
                        onMouseEnter={() => setHoveredKey(itemInteractionKey)}
                        onMouseLeave={() => setHoveredKey(undefined)}
                        onMouseDown={() => setPressedKey(itemInteractionKey)}
                        onMouseUp={() => setPressedKey(undefined)}
                        style={{
                          width: `calc(100% - ${u["spacing/4x"]}px)`,
                          height: SIDE_NAV_ITEM_HEIGHT,
                          marginInline: u["spacing/2x"],
                          padding: `7px ${u["spacing/3x"]}px`,
                          display: "flex",
                          alignItems: "center",
                          border: 0,
                          borderRadius: u["radius/m"],
                          background: itemBackground,
                          color: isActive ? sideTextActive : sideText,
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        <span style={{ overflow: "hidden", fontSize: getTypographyToken("font-size/m"), lineHeight: `${getTypographyToken("line-height/m")}px`, fontWeight: isActive ? getTypographyToken("font-weight/medium") : getTypographyToken("font-weight/regular"), whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                          {item}
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
