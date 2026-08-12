import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { getColorToken, buildShadowD4 } from "../design-system/color-utils";
import { sensCursorValue } from "../design-system/cursors";
import { SensIcon, type IconName, type IconVariant } from "../design-system/icons";
import { useNavigationTheme } from "../design-system/appearance";
import {
  getNavigationColorToken,
  getThemePageBackground,
  getThemeTopAtmosphere,
  getThemeTopBackground,
} from "../design-system/navigation-color";
import { getTypographyToken } from "../design-system/typography";
import tokens from "../design-system/tokens.resolved.json";
import {
  getProductShellDefaultNavMenuByLabel,
  getProductShellNavDropdownByLabel,
  getProductShellPrimaryNavItems,
} from "../design-system/product-shell-nav-catalog";
import { SearchInput } from "./SearchInput";
import { SensEmptyState } from "./SensEmptyState";
import { SensTag, type TagColor } from "./SensTag";
import { SensTips } from "./SensTips";
import { SensTopNavLogo } from "./SensTopNavLogo";
import "./top-navigation.css";

/** 角色 pill 圆角：Figma 12；仅顶导，不升 radius foundation（无通用 radius/12 档） */
const ACCOUNT_ROLE_PILL_RADIUS = 12;
/** 角色 pill 竖直内边距：Figma 3；仅顶导，不升 spacing foundation */
const ACCOUNT_ROLE_PILL_PAD_Y = 3;
/** 项目切换选项宽 / 高（Figma 262×36） */
const PROJECT_OPTION_WIDTH = 262;
const PROJECT_OPTION_HEIGHT = 36;
/** 项目切换浮层总高上限；超出后列表区滚动 */
const PROJECT_PANEL_MAX_HEIGHT = 296;
/** 搜索框高：对齐 SearchInput / size/component-height/m */
const PROJECT_SEARCH_HEIGHT = 32;
/** 首屏底遮罩高：盖住末可见项一行 */
const PROJECT_LIST_MASK_HEIGHT = PROJECT_OPTION_HEIGHT;
/** 底遮罩渐变（设计标注） */
const PROJECT_LIST_MASK_GRADIENT =
  "linear-gradient(180deg, rgba(255, 255, 255, 0.00) -20.69%, #FFF 77.43%)";
/** 右上工具图标：Figma 14505:36662 / 37060 / 37068 → 18px + pad 5 → 热区 28 */
const UTILITY_ICON_SIZE = 18;
const UTILITY_ICON_PAD = 5;
const UTILITY_ICON_HIT = UTILITY_ICON_SIZE + UTILITY_ICON_PAD * 2;
/** 触发器与浮层之间的鼠标移动缓冲，避免离开瞬间菜单闪退。 */
const NAV_DROPDOWN_CLOSE_DELAY = 120;

const u = tokens.unit as Record<string, number>;
/** 上栏左簇（Logo+项目）↔右簇（工具+账号）最小间距；到达后顶导不再继续变窄 */
const UPPER_CLUSTER_MIN_GAP = u["spacing/4x"] ?? 16;

function NavigationIcon({
  name,
  label,
  color,
  size = 16,
  variant = "linear",
}: {
  name: IconName;
  label: string;
  color: string;
  size?: number;
  variant?: IconVariant;
}) {
  return (
    <span
      role="img"
      aria-label={label}
      style={{
        width: size,
        height: size,
        display: "block",
        flexShrink: 0,
      }}
    >
      <SensIcon name={name} variant={variant} size={size} color={color} style={{ display: "block" }} />
    </span>
  );
}

type TopNavigationPanel = "project" | "account" | "function" | null;

/** 功能入口菜单：九宫格 64:9830；结构稿 226:29937 / 29938 / 29988 / 30041 / 30007 */
const FUNC_MENU_ITEM_HEIGHT = 36;
const FUNC_MENU_ITEMS_PER_COL = 6;
const FUNC_MENU_ITEM_INSET_X = 8;
/** 两层：单条信息（hover 底）宽；Figma 226:30007 */
const FUNC_MENU_GROUPED_ITEM_WIDTH = 193;
/** 两层：横向两列间距；仅顶导，不升 foundation spacing */
const FUNC_MENU_GROUPED_COLUMN_GAP = 7;
/** 两层列槽：左右 inset 8 + 底色 193 */
const FUNC_MENU_GROUPED_COLUMN_WIDTH = FUNC_MENU_ITEM_INSET_X * 2 + FUNC_MENU_GROUPED_ITEM_WIDTH;
/** 单层折行列宽（既有） */
const FUNC_MENU_FLAT_COLUMN_WIDTH = 200;
/** 单层自适应底色最小宽 */
const FUNC_MENU_FLAT_MIN_ITEM_WIDTH = 156;

type FunctionMenuItem = {
  label: string;
  /** Figma 彩色标签：hot→旭日红 / new→冰绽蓝（64:9830） */
  badge?: { text: string; color: TagColor };
};

export type FunctionMenuSection = {
  /** 有 title → 两层（二级分组 + 三级项）；无 title → 单层 */
  title?: string;
  items: Array<string | FunctionMenuItem>;
};

function normalizeFunctionMenuItem(item: string | FunctionMenuItem): FunctionMenuItem {
  return typeof item === "string" ? { label: item } : item;
}

const FUNCTION_MENU_BEHAVIOR_ITEMS = [
  "事件分析",
  "留存分析",
  "漏斗分析",
  "分布分析",
  "LTV 分析",
  "Session 分析",
  "用户路径分析",
  "网页热力分析",
  "App 点击分析",
  "间隔分析",
  "归因分析",
] as const;

/** 两层：多二级分区 + 竖分割线；三级 >6 同区内折列（226:29938）；矩阵示意；真实「分析」下拉以 catalog 为准 */
export const FUNCTION_MENU_TWO_LEVEL: FunctionMenuSection[] = [
  { title: "行为分析", items: [...FUNCTION_MENU_BEHAVIOR_ITEMS] },
  { title: "用户分析", items: ["用户群画像", "属性分析"] },
  { title: "其他", items: ["自定义查询", "书签"] },
];

/** 九宫格产品导航：最近浏览 / 热销产品（Figma 64:9830）；叶子须能映射到一级域下拉 */
export const FUNCTION_MENU_NINE_GRID: FunctionMenuSection[] = [
  {
    title: "最近浏览",
    items: [
      "事件分析",
      "漏斗分析",
      "留存分析",
      "分布分析",
      "LTV 分析",
      "用户路径分析",
    ],
  },
  {
    title: "热销产品",
    items: [
      { label: "用户群画像", badge: { text: "hot", color: "red" } },
      { label: "属性分析", badge: { text: "new", color: "blue" } },
      "书签",
      "自定义查询",
    ],
  },
];

/** 单层 ≤6：单列（226:30041）；示意叶子对齐智能运营域 */
export const FUNCTION_MENU_FLAT_SHORT: FunctionMenuSection[] = [
  { items: ["运营计划", "流程画布", "列表资源位"] },
];
/** 单层 >6：自动折列，区间无分割线（226:29988） */
export const FUNCTION_MENU_FLAT_WRAP: FunctionMenuSection[] = [
  { items: [...FUNCTION_MENU_BEHAVIOR_ITEMS] },
];

function chunkColumns(items: FunctionMenuItem[], size: number): FunctionMenuItem[][] {
  if (items.length === 0) return [[]];
  const columns: FunctionMenuItem[][] = [];
  for (let index = 0; index < items.length; index += size) {
    columns.push(items.slice(index, index + size));
  }
  return columns;
}

function isGroupedFunctionMenu(sections: FunctionMenuSection[]): boolean {
  return sections.some((section) => Boolean(section.title));
}

type FunctionEntryMenuPanelProps = {
  sections: FunctionMenuSection[];
  selectedLabel?: string | null;
  hoveredKey?: string | null;
  onHover?: (key: string | null) => void;
  onSelect?: (label: string) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  textColor: string;
  hoverText: string;
  activeText: string;
  hoverBg: string;
  activeBg: string;
  dividerColor: string;
  style?: CSSProperties;
};

/** 功能入口 / 主导航下拉面板：单层自适应或折列；两层分区竖线；三级每列最多 6 项 */
export function FunctionEntryMenuPanel({
  sections,
  selectedLabel = null,
  hoveredKey = null,
  onHover,
  onSelect,
  onMouseEnter,
  onMouseLeave,
  textColor,
  hoverText,
  activeText,
  hoverBg,
  activeBg,
  dividerColor,
  style,
}: FunctionEntryMenuPanelProps) {
  const grouped = isGroupedFunctionMenu(sections);
  const gap = u["spacing/1x"] ?? 4;
  /** 单层且未折列：宽度随内容；折列用固定列宽；两层用 193 底色 + 列间距 7 */
  const flatAdaptive =
    !grouped && sections.every((section) => section.items.length <= FUNC_MENU_ITEMS_PER_COL);
  const isFlat = !grouped;
  /** 单层 / 单层折行：容器左右 pad 8，底色块不再叠加一层 inset（Figma 226:29621） */
  const flatPadX = u["spacing/2x"] ?? 8;
  const columnWidth = isFlat ? FUNC_MENU_FLAT_COLUMN_WIDTH : FUNC_MENU_GROUPED_COLUMN_WIDTH;
  const columnGap = grouped ? FUNC_MENU_GROUPED_COLUMN_GAP : 0;
  const itemBgWidth = isFlat ? undefined : FUNC_MENU_GROUPED_ITEM_WIDTH;

  return (
    <div
      data-function-entry-menu
      data-function-entry-mode={grouped ? "grouped" : flatAdaptive ? "flat-adaptive" : "flat"}
      role="menu"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        boxSizing: "border-box",
        borderRadius: u["radius/m"],
        background: getColorToken("white"),
        boxShadow: buildShadowD4(),
        padding: grouped
          ? `${u["spacing/4x"]}px ${u["spacing/2x"]}px`
          : `${u["spacing/1․5x"]}px ${flatPadX}px ${u["spacing/2․5x"]}px`,
        display: "flex",
        alignItems: "stretch",
        ...style,
        // 放在 style 之后：绝对定位时必须用 max-content，避免被窄触发器 / 传入 style 卡成 100%
        width: "max-content",
        maxWidth: "none",
      }}
    >
      {sections.map((section, sectionIndex) => {
        const normalizedItems = section.items.map(normalizeFunctionMenuItem);
        const columns = chunkColumns(normalizedItems, FUNC_MENU_ITEMS_PER_COL);
        const sectionAdaptive = flatAdaptive && columns.length === 1;
        return (
          <div
            key={section.title ?? `flat-${sectionIndex}`}
            data-function-entry-section={section.title ?? "flat"}
            style={{ display: "flex", alignItems: "stretch" }}
          >
            {sectionIndex > 0 && grouped ? (
              <div
                data-function-entry-divider
                aria-hidden
                style={{
                  width: 1,
                  alignSelf: "stretch",
                  marginTop: u["spacing/4x"],
                  marginBottom: u["spacing/2x"],
                  background: dividerColor,
                  flexShrink: 0,
                }}
              />
            ) : null}
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              {section.title ? (
                <div
                  data-function-entry-section-title
                  style={{
                    width:
                      columns.length * columnWidth + Math.max(0, columns.length - 1) * columnGap,
                    boxSizing: "border-box",
                    padding: `${u["spacing/1․5x"]}px ${u["spacing/5x"]}px`,
                    color: textColor,
                    fontSize: getTypographyToken("font-size/l"),
                    lineHeight: `${getTypographyToken("line-height/l")}px`,
                    fontWeight: getTypographyToken("font-weight/semibold"),
                    whiteSpace: "nowrap",
                  }}
                >
                  {section.title}
                </div>
              ) : null}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: columnGap,
                }}
              >
                {columns.map((columnItems, columnIndex) => (
                  <div
                    key={`${section.title ?? "flat"}-col-${columnIndex}`}
                    data-function-entry-column
                    data-function-entry-column-adaptive={sectionAdaptive ? "" : undefined}
                    style={{
                      width: sectionAdaptive ? "max-content" : columnWidth,
                      minWidth: sectionAdaptive ? FUNC_MENU_FLAT_MIN_ITEM_WIDTH : undefined,
                      display: "flex",
                      flexDirection: "column",
                      gap,
                      flexShrink: 0,
                    }}
                  >
                    {columnItems.map((item) => {
                      const { label, badge } = item;
                      const itemKey = `func:${label}`;
                      const selected = selectedLabel === label;
                      const hovered = hoveredKey === itemKey;
                      const emphasized = selected || hovered;
                      return (
                        <button
                          key={label}
                          type="button"
                          role="menuitem"
                          data-function-entry-item={label}
                          data-function-entry-badge={badge?.text}
                          aria-current={selected ? "true" : undefined}
                          onMouseEnter={() => onHover?.(itemKey)}
                          onMouseLeave={() => onHover?.(null)}
                          onClick={() => onSelect?.(label)}
                          style={{
                            width: sectionAdaptive ? "100%" : columnWidth,
                            height: FUNC_MENU_ITEM_HEIGHT,
                            boxSizing: "border-box",
                            margin: 0,
                            // 单层：左右 8 由面板 padding 承担；两层行内 inset 8 + 底色 193
                            padding: isFlat ? 0 : `0 ${FUNC_MENU_ITEM_INSET_X}px`,
                            border: 0,
                            outline: "none",
                            background: "transparent",
                            display: "flex",
                            alignItems: "center",
                            cursor: sensCursorValue("pointer"),
                          }}
                        >
                          <span
                            data-function-entry-item-bg
                            style={{
                              width: isFlat ? "100%" : itemBgWidth,
                              minWidth: sectionAdaptive ? FUNC_MENU_FLAT_MIN_ITEM_WIDTH : undefined,
                              height: FUNC_MENU_ITEM_HEIGHT,
                              boxSizing: "border-box",
                              padding: `0 ${u["spacing/3x"]}px`,
                              borderRadius: u["radius/m"],
                              background: selected ? activeBg : hovered ? hoverBg : "transparent",
                              color: selected ? activeText : hovered ? hoverText : textColor,
                              display: "flex",
                              alignItems: "center",
                              gap: u["spacing/2x"],
                              overflow: "hidden",
                              fontSize: getTypographyToken("font-size/m"),
                              lineHeight: `${getTypographyToken("line-height/m")}px`,
                              fontWeight: emphasized
                                ? getTypographyToken("font-weight/medium")
                                : getTypographyToken("font-weight/regular"),
                            }}
                          >
                            <span
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                minWidth: 0,
                              }}
                            >
                              {label}
                            </span>
                            {badge ? (
                              <SensTag
                                variant="multicolor"
                                color={badge.color}
                                size="small"
                                style={{ flexShrink: 0 }}
                              >
                                {badge.text}
                              </SensTag>
                            ) : null}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const PROJECT_OPTIONS = [
  "正式项目",
  "测试项目",
  "双十一运营专用",
  "618 运营专用",
  "研发&产品&设计&测试&运维&企业效能专用",
  "销售专用",
  "零售增长项目",
  "品牌增长项目",
  "新零售实验项目",
];
const ACCOUNT_LANGUAGE_OPTIONS = ["中文-简体", "中文-繁體", "English", "日本語", "ไทย"];
/** 诊断工具子菜单（Figma 14523:37167，不可选中项） */
const ACCOUNT_DIAGNOSTIC_OPTIONS = [
  "查询诊断报告（不含查询结果）",
  "查询诊断报告（包含查询结果）",
  "开启前端诊断（不含查询结果）",
  "查询资源管理",
  "一次性口令",
] as const;

type AccountSubmenu = "language" | "diagnostic";

type AccountMenuRow =
  | {
      kind: "item";
      id: string;
      label: string;
      icon: IconName;
      trailing?: "chevron" | "switch";
      submenu?: AccountSubmenu;
      closesOnClick?: boolean;
    }
  | { kind: "divider"; id: string };

const ACCOUNT_MENU: AccountMenuRow[] = [
  { kind: "item", id: "profile", label: "个人中心", icon: "personal" },
  { kind: "divider", id: "div-1" },
  { kind: "item", id: "language", label: "系统语言", icon: "language", trailing: "chevron", submenu: "language" },
  { kind: "item", id: "query-queue", label: "查询队列明细", icon: "query-queue" },
  {
    kind: "item",
    id: "diagnostic",
    label: "诊断工具",
    icon: "diagnostic-tool",
    trailing: "chevron",
    submenu: "diagnostic",
  },
  { kind: "item", id: "password", label: "修改密码", icon: "unlock" },
  {
    kind: "item",
    id: "sensitive",
    label: "显示账号敏感信息",
    icon: "personal-sensitive-information",
    trailing: "switch",
  },
  { kind: "divider", id: "div-2" },
  { kind: "item", id: "logout", label: "退出", icon: "logout", closesOnClick: true },
];

const UTILITY_NAV_TARGETS: Partial<Record<IconName, { preferred: string; fallback: string }>> = {
  "nav-platform": { preferred: "项目设置", fallback: "项目设置" },
  "nav-workload-manager": { preferred: "素材库", fallback: "内容管理" },
  "nav-examine": { preferred: "审批中心", fallback: "用户管理" },
};

function getUtilityIconForNavLabel(label: string): IconName | null {
  const entry = (Object.entries(UTILITY_NAV_TARGETS) as Array<[
    IconName,
    { preferred: string; fallback: string },
  ]>).find(([, target]) => target.preferred === label || target.fallback === label);
  return entry?.[0] ?? null;
}
/** 主导航下拉：flat=单层（≤6 自适应宽 / >6 折列）；grouped=两层分区（Figma 5:2414 分析） */
export type NavDropdownConfig =
  | { kind: "flat"; items: string[] }
  | { kind: "grouped"; sections: FunctionMenuSection[] };

const DEFAULT_NAV_DROPDOWN_CONFIG: Record<string, NavDropdownConfig> =
  getProductShellNavDropdownByLabel() as Record<string, NavDropdownConfig>;

const DEFAULT_NAV_MENU_BY_LABEL = getProductShellDefaultNavMenuByLabel();

const DEFAULT_PRIMARY_NAV_ITEMS: SensTopNavigationItem[] = [
  ...getProductShellPrimaryNavItems(),
  { label: "更多", arrow: true },
];

export function navDropdownToSections(config: NavDropdownConfig): FunctionMenuSection[] {
  return config.kind === "grouped" ? config.sections : [{ items: config.items }];
}

function findPrimaryNavDestinationByMenuLabel(
  label: string,
  dropdownConfig: Record<string, NavDropdownConfig>,
): { navLabel: string; menuLabel: string } | null {
  for (const [navLabel, config] of Object.entries(dropdownConfig)) {
    if (config.kind === "flat" && config.items.includes(label)) {
      return { navLabel, menuLabel: label };
    }
    if (
      config.kind === "grouped" &&
      config.sections.some((section) =>
        section.items.some((item) => normalizeFunctionMenuItem(item).label === label),
      )
    ) {
      return { navLabel, menuLabel: label };
    }
  }
  return null;
}

const MORE_NAV_LABEL = "更多";
/** 更多级联面板宽（Figma 226:30662 / 12:6683） */
const MORE_MENU_PANEL_WIDTH = 200;
const MORE_MENU_ITEM_HEIGHT = 36;

type MoreMenuNode = {
  label: string;
  children?: MoreMenuNode[];
};

function moreItemOffsetTop(index: number, gap: number): number {
  return 6 + index * (MORE_MENU_ITEM_HEIGHT + gap);
}

export interface SensTopNavigationItem {
  label: string;
  arrow?: boolean;
}

function primaryItemToMoreNode(
  item: SensTopNavigationItem,
  dropdownConfigByLabel: Record<string, NavDropdownConfig>,
): MoreMenuNode {
  const config = dropdownConfigByLabel[item.label];
  if (config?.kind === "grouped") {
    return {
      label: item.label,
      children: config.sections.map((section) => ({
        label: section.title ?? item.label,
        children: section.items.map((entry) => ({ label: normalizeFunctionMenuItem(entry).label })),
      })),
    };
  }
  if (config?.kind === "flat") {
    return { label: item.label, children: config.items.map((entry) => ({ label: normalizeFunctionMenuItem(entry).label })) };
  }
  return { label: item.label };
}

/**
 * 更多固有树：与 `product-shell-nav-catalog` 同源（只换功能点，保留级联/回填/窄屏收纳规则）。
 * 窄屏时左侧溢出主导航会前置并入 L1，并按 label 去重。
 */
const MORE_MENU_TREE: MoreMenuNode[] = getProductShellPrimaryNavItems().map((item) =>
  primaryItemToMoreNode(item, DEFAULT_NAV_DROPDOWN_CONFIG),
);

export interface SensTopNavigationUtilityItem {
  label: string;
  icon: IconName;
  /** 仅平台、资源、审批等实际功能页入口保留持久选中态。 */
  selectable?: boolean;
}

/** 项目切换项：超长单行省略（Figma 37:8320）；悬停 SensTips 展示全名 */
function ProjectSwitcherOption({
  project,
  selected,
  itemStyle,
  onSelect,
  onHover,
}: {
  project: string;
  selected: boolean;
  itemStyle: CSSProperties;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
}) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = useState(false);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const sync = () => {
      // block+width:100% 时部分环境下 scrollWidth≈clientWidth，改用文字实测宽
      const style = window.getComputedStyle(el);
      const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} / ${style.lineHeight} ${style.fontFamily}`;
      const canvas = document.createElement("canvas").getContext("2d");
      let textWidth = el.scrollWidth;
      if (canvas) {
        canvas.font = font;
        textWidth = canvas.measureText(project).width;
      }
      const next = textWidth > el.clientWidth + 1;
      setTruncated((prev) => (prev === next ? prev : next));
    };
    sync();
    const raf = requestAnimationFrame(sync);
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(sync) : null;
    observer?.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [project]);

  const button = (
    <button
      type="button"
      role="menuitem"
      data-project-switcher-item={project}
      data-truncated={truncated ? "true" : "false"}
      aria-current={selected ? "true" : undefined}
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      style={{
        ...itemStyle,
        minWidth: 0,
      }}
    >
      <span
        ref={textRef}
        data-project-switcher-item-label
        style={{
          display: "block",
          flex: 1,
          width: "100%",
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          textAlign: "center",
        }}
      >
        {project}
      </span>
    </button>
  );

  if (!truncated) return button;

  return (
    <SensTips title={project} placement="top" align="center">
      {button}
    </SensTips>
  );
}

function OverflowTipsText({ text, style }: { text: string; style: CSSProperties }) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useLayoutEffect(() => {
    const syncOverflow = () => {
      const element = textRef.current;
      if (!element) return;
      setIsOverflowing(element.scrollWidth > element.clientWidth);
    };
    syncOverflow();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(syncOverflow) : null;
    observer?.observe(textRef.current!);
    return () => observer?.disconnect();
  }, [text]);

  const content = (
    <span ref={textRef} style={style}>
      {text}
    </span>
  );

  return isOverflowing ? (
    <SensTips title={text} placement="left" align="center">
      {content}
    </SensTips>
  ) : (
    content
  );
}

export interface SensTopNavigationProps {
  /** 业务页面嵌入时只渲染产品壳导航，不渲染组件说明和演示占位内容。 */
  embedded?: boolean;
  /** 是否在导航下方保留产品壳氛围渐变；嵌入页面默认关闭，由业务场景显式开启。 */
  atmosphere?: boolean;
  activeNavLabel?: string;
  items?: SensTopNavigationItem[];
  /**
   * 覆盖 / 合并主导航下拉 IA。Product Shell 应用域导航模型覆盖「智能运营」等与侧导同源的功能域。
   * 未覆盖的 label 仍使用组件内默认配置。
   */
  navDropdownByLabel?: Record<string, NavDropdownConfig>;
  /**
   * 受控：各一级功能域下拉当前选中叶子。与侧导 activeItem 应对齐同一业务节点。
   * 不传时组件内部维护演示态。
   */
  activeNavMenuByLabel?: Record<string, string>;
  /** 主导航下拉选中叶子时回调（含受控与非受控） */
  onNavMenuSelect?: (navLabel: string, menuLabel: string) => void;
  /** 当前所在工具功能页对应的图标（选中态）；不传时由组件内部演示态管理。 */
  activeUtilityIcon?: IconName | null;
  /** 工具入口点击：业务侧跳转功能页。未传时展示页本地切换选中以演示三态。 */
  onUtilityNavigate?: (item: SensTopNavigationUtilityItem) => void;
  /** 主导航业务域选中变化（含无下拉项的一级点击）；Product Shell 用于切换侧导域。 */
  onActiveNavLabelChange?: (navLabel: string) => void;
}

/**
 * 顶部导航的业务去向只能有一个选中来源：主导航、更多或右上工具。
 * 九宫格是快捷定位入口：选择后同步定位到对应主导航分类，不作为独立选中来源。
 * 项目切换和账号菜单属于独立上下文，不参与这里的互斥。
 */
type BusinessSelectionOwner = "primary" | "more" | "utility";

/** 顶部导航的真实实现；展示页与业务样板间共用同一产品壳。 */
export function SensTopNavigation({
  embedded = false,
  atmosphere = !embedded,
  activeNavLabel: initialActiveNavLabel = "分析",
  items,
  navDropdownByLabel,
  activeNavMenuByLabel: activeNavMenuByLabelProp,
  onNavMenuSelect,
  activeUtilityIcon: activeUtilityIconProp,
  onUtilityNavigate,
  onActiveNavLabelChange,
}: SensTopNavigationProps) {
  const [activeNavLabel, setActiveNavLabel] = useState(initialActiveNavLabel);
  const [activeProject, setActiveProject] = useState(PROJECT_OPTIONS[0]);
  const [projectSearchQuery, setProjectSearchQuery] = useState("");
  const [projectListScrolled, setProjectListScrolled] = useState(false);
  const [accountLanguage, setAccountLanguage] = useState(ACCOUNT_LANGUAGE_OPTIONS[0]);
  const [accountSubmenu, setAccountSubmenu] = useState<AccountSubmenu | null>(null);
  const [accountSubmenuTop, setAccountSubmenuTop] = useState(0);
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const accountLanguageItemRef = useRef<HTMLButtonElement>(null);
  const accountDiagnosticItemRef = useRef<HTMLButtonElement>(null);
  const [internalActiveNavMenuByLabel, setInternalActiveNavMenuByLabel] =
    useState<Record<string, string>>(DEFAULT_NAV_MENU_BY_LABEL);
  const isNavMenuControlled = activeNavMenuByLabelProp !== undefined;
  const activeNavMenuByLabel = isNavMenuControlled ? activeNavMenuByLabelProp : internalActiveNavMenuByLabel;
  const setActiveNavMenuByLabel = (
    updater: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>),
  ) => {
    if (isNavMenuControlled) return;
    setInternalActiveNavMenuByLabel(updater);
  };
  const navDropdownConfig = {
    ...DEFAULT_NAV_DROPDOWN_CONFIG,
    ...navDropdownByLabel,
  };
  /** 主导航下拉相对触发器：优先与文字左对齐；溢出则与箭头右对齐 */
  const [navDropdownPlacement, setNavDropdownPlacement] = useState<{
    mode: "left" | "right";
    offset: number;
  }>({ mode: "left", offset: u["spacing/4x"] ?? 16 });
  /** 「更多」下拉选中后回填到右侧触发文案；点左侧导航后清空恢复「更多」 */
  const [morePinnedLabel, setMorePinnedLabel] = useState<string | null>(null);
  /** 同步 ref：父级因更多选叶回调改 activeNavLabel 时，避免冲掉「更多」回填态 */
  const morePinnedLabelRef = useRef<string | null>(null);
  /** 更多级联路径：L1 / L2 当前展开项 label */
  const [moreCascadePath, setMoreCascadePath] = useState<string[]>([]);
  /** 左侧主导航被收进「更多」的数量（从右往左收） */
  const [primaryOverflowCount, setPrimaryOverflowCount] = useState(0);
  const [primaryItemWidths, setPrimaryItemWidths] = useState<number[] | null>(null);
  const navItemsRowRef = useRef<HTMLDivElement>(null);
  const moreSectionRef = useRef<HTMLDivElement>(null);
  const upperLeftRef = useRef<HTMLDivElement>(null);
  const upperRightRef = useRef<HTMLDivElement>(null);
  const [shellMinWidth, setShellMinWidth] = useState<number | undefined>(undefined);
  const [openPanel, setOpenPanel] = useState<TopNavigationPanel>(null);
  const [openNavDropdown, setOpenNavDropdown] = useState<string | null>(null);
  const navDropdownCloseTimerRef = useRef<number | null>(null);
  const shellPanelCloseTimerRef = useRef<number | null>(null);
  const [hoveredMenuItem, setHoveredMenuItem] = useState<string | null>(null);
  const [hoveredUtilityIcon, setHoveredUtilityIcon] = useState<IconName | null>(null);
  const [activeUtilityIconState, setActiveUtilityIconState] = useState<IconName | null>(null);
  const [activeBusinessSelectionOwner, setActiveBusinessSelectionOwner] = useState<BusinessSelectionOwner>(
    activeUtilityIconProp ? "utility" : "primary",
  );
  const activeUtilityIcon =
    activeUtilityIconProp !== undefined ? activeUtilityIconProp : activeUtilityIconState;

  useEffect(() => {
    if (activeUtilityIconProp) {
      morePinnedLabelRef.current = null;
      setMorePinnedLabel(null);
      setActiveBusinessSelectionOwner("utility");
      setActiveNavLabel("");
      return;
    }
    if (activeUtilityIconProp === undefined) setActiveUtilityIconState(null);
    /** 更多选叶会回调父级换域，父级再回传 activeNavLabel；此时须保留「更多」回填，不抢成一级选中 */
    if (morePinnedLabelRef.current) {
      setActiveBusinessSelectionOwner("more");
      setActiveNavLabel(MORE_NAV_LABEL);
      return;
    }
    setActiveBusinessSelectionOwner("primary");
    setActiveNavLabel(initialActiveNavLabel);
  }, [activeUtilityIconProp, initialActiveNavLabel]);
  const [isFunctionEntryHovered, setIsFunctionEntryHovered] = useState(false);
  const [isAccountHovered, setIsAccountHovered] = useState(false);
  const [hoveredNavLabel, setHoveredNavLabel] = useState<string | null>(null);
  /** 下导项间距：1280 紧凑 8；1440+ 默认 16（对齐 Figma 两帧） */
  const [navItemGap, setNavItemGap] = useState(u["spacing/2x"] ?? 8);
  const navigationTheme = useNavigationTheme();

  const clearNavDropdownCloseTimer = () => {
    if (navDropdownCloseTimerRef.current === null) return;
    window.clearTimeout(navDropdownCloseTimerRef.current);
    navDropdownCloseTimerRef.current = null;
  };

  const selectPrimaryBusinessDestination = (navLabel: string, menuLabel?: string) => {
    setActiveBusinessSelectionOwner("primary");
    setActiveNavLabel(navLabel);
    morePinnedLabelRef.current = null;
    setMorePinnedLabel(null);
    setActiveUtilityIconState(null);
    onActiveNavLabelChange?.(navLabel);
    if (menuLabel) {
      setActiveNavMenuByLabel((prev) => ({ ...prev, [navLabel]: menuLabel }));
      onNavMenuSelect?.(navLabel, menuLabel);
    }
  };

  const selectMoreBusinessDestination = (label: string) => {
    setActiveBusinessSelectionOwner("more");
    setActiveNavLabel(MORE_NAV_LABEL);
    morePinnedLabelRef.current = label;
    setMorePinnedLabel(label);
    setActiveUtilityIconState(null);

    /** 叶子若属于某一级域（含窄屏收纳项），同步 Product Shell 侧导；回填仍挂在「更多」 */
    const destination = findPrimaryNavDestinationByMenuLabel(label, navDropdownConfig);
    if (destination) {
      setActiveNavMenuByLabel((prev) => ({ ...prev, [destination.navLabel]: destination.menuLabel }));
      onNavMenuSelect?.(destination.navLabel, destination.menuLabel);
      return;
    }
    const primaryHit = (items ?? DEFAULT_PRIMARY_NAV_ITEMS).some(
      (item) => item.label === label && item.label !== MORE_NAV_LABEL,
    );
    if (primaryHit) {
      onActiveNavLabelChange?.(label);
    }
  };

  const selectUtilityBusinessDestination = (item: SensTopNavigationUtilityItem) => {
    setActiveBusinessSelectionOwner("utility");
    setActiveNavLabel("");
    setActiveNavMenuByLabel({});
    morePinnedLabelRef.current = null;
    setMorePinnedLabel(null);
    setActiveUtilityIconState(item.selectable ? item.icon : null);
  };

  const selectFunctionBusinessDestination = (label: string) => {
    const destination = findPrimaryNavDestinationByMenuLabel(label, navDropdownConfig);
    if (destination) {
      selectPrimaryBusinessDestination(destination.navLabel, destination.menuLabel);
    }
  };

  const scheduleNavDropdownClose = (label: string) => {
    clearNavDropdownCloseTimer();
    navDropdownCloseTimerRef.current = window.setTimeout(() => {
      setOpenNavDropdown((current) => (current === label ? null : current));
      setHoveredNavLabel((current) => (current === label ? null : current));
      if (label === MORE_NAV_LABEL) setMoreCascadePath([]);
      navDropdownCloseTimerRef.current = null;
    }, NAV_DROPDOWN_CLOSE_DELAY);
  };

  const clearShellPanelCloseTimer = () => {
    if (shellPanelCloseTimerRef.current === null) return;
    window.clearTimeout(shellPanelCloseTimerRef.current);
    shellPanelCloseTimerRef.current = null;
  };

  const scheduleShellPanelClose = (panel: Exclude<TopNavigationPanel, null>) => {
    clearShellPanelCloseTimer();
    shellPanelCloseTimerRef.current = window.setTimeout(() => {
      setOpenPanel((current) => (current === panel ? null : current));
      shellPanelCloseTimerRef.current = null;
    }, NAV_DROPDOWN_CLOSE_DELAY);
  };

  useEffect(() => {
    return () => {
      if (navDropdownCloseTimerRef.current !== null) {
        window.clearTimeout(navDropdownCloseTimerRef.current);
      }
      if (shellPanelCloseTimerRef.current !== null) {
        window.clearTimeout(shellPanelCloseTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1440px)");
    const sync = () => setNavItemGap(mq.matches ? (u["spacing/4x"] ?? 16) : (u["spacing/2x"] ?? 8));
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  /** 顶导下衬底：body-background（非标题栏 handle） */
  const pageBackground = getThemePageBackground(navigationTheme);
  const navRadius = u["radius/xl"] ?? u["radius/l"] ?? 6;
  const topText = getColorToken("theme-top-text");
  const panelText = getColorToken("theme-top-funcMenu-text");
  const panelStroke = getColorToken("theme-top-line-dack");
  const panelDivider = getColorToken("theme-top-line-light");
  const activeBg = getNavigationColorToken("theme-top-funcMenu-background-active", navigationTheme);
  const activeText = getNavigationColorToken("theme-top-funcMenu-text-active", navigationTheme);
  const functionMenuHoverText = getNavigationColorToken("theme-top-funcMenu-text-hover", navigationTheme);
  const menuLineOutlined = getColorToken("theme-top-menuLine-outlined");
  const menuLineActive = getNavigationColorToken("theme-top-menuLine-active", navigationTheme);
  const topTextActive = getColorToken("theme-top-text-active");
  const topTextHover = getColorToken("theme-top-text-hover");
  const topIconHover = getColorToken("theme-top-icon-hover");
  const topIconActive = getColorToken("theme-top-icon-active");
  const topIconColor = topText;
  const projectText = getColorToken("theme-top-proMenu-text");
  const projectTextHover = getColorToken("theme-top-proMenu-text-hover");
  const projectTextActive = getNavigationColorToken("theme-top-proMenu-text-active", navigationTheme);
  const projectHoverBg = getColorToken("theme-top-proMenu-background-hover");
  const projectActiveBg = getNavigationColorToken("theme-top-proMenu-background-active", navigationTheme);
  const functionMenuHoverBg = getNavigationColorToken("theme-top-funcMenu-background-hover", navigationTheme);
  const functionMenuIcon = getColorToken("theme-top-funcMenu-icon");
  const functionMenuIconHover = getNavigationColorToken("theme-top-funcMenu-icon-hover", navigationTheme);
  const menuLineDivide = getColorToken("theme-top-menuLine-divide");
  const switchTrackOff = getColorToken("switch-background");
  const switchTrackOn = getColorToken("component-active");
  const isAccountOpen = openPanel === "account";
  const isFunctionOpen = openPanel === "function";
  const isFunctionEntryEmphasis = isFunctionOpen || isFunctionEntryHovered;
  const isAccountEmphasis = isAccountOpen || isAccountHovered;
  const accountColor = isAccountEmphasis ? topTextHover : topText;
  const functionEntrySelectedLabel =
    activeBusinessSelectionOwner === "primary"
      ? activeNavMenuByLabel[activeNavLabel] ?? null
      : activeBusinessSelectionOwner === "more"
        ? morePinnedLabel
        : null;

  const navItems = items ?? DEFAULT_PRIMARY_NAV_ITEMS;
  const primaryNavItems = navItems.filter((item) => item.label !== MORE_NAV_LABEL);
  const moreNavItem = navItems.find((item) => item.label === MORE_NAV_LABEL);
  const overflowPrimaryItems = primaryNavItems.slice(primaryNavItems.length - primaryOverflowCount);
  const visiblePrimaryItems = primaryNavItems.slice(0, primaryNavItems.length - primaryOverflowCount);
  const primaryLabelsKey = primaryNavItems.map((item) => item.label).join("\0");
  const moreMenuRoots = (() => {
    const overflowNodes = overflowPrimaryItems.map((item) => primaryItemToMoreNode(item, navDropdownConfig));
    const overflowLabels = new Set(overflowNodes.map((node) => node.label));
    /** 固有树随 catalog 走；自定义下拉时用当前 config 重建，避免旧功能点残留 */
    const inherentTree = primaryNavItems.map((item) => primaryItemToMoreNode(item, navDropdownConfig));
    const rest = (inherentTree.length > 0 ? inherentTree : MORE_MENU_TREE).filter(
      (node) => !overflowLabels.has(node.label),
    );
    return [...overflowNodes, ...rest];
  })();

  /** 上栏量宽：左簇 + 最小间距 16 + 右簇 + 左右 padding → 顶导下限，禁止再缩 */
  useLayoutEffect(() => {
    const leftEl = upperLeftRef.current;
    const rightEl = upperRightRef.current;
    if (!leftEl || !rightEl) return;
    const padX = (u["spacing/4x"] ?? 16) * 2;
    const syncShellMin = () => {
      setShellMinWidth(leftEl.offsetWidth + UPPER_CLUSTER_MIN_GAP + rightEl.offsetWidth + padX);
    };
    syncShellMin();
    const observer = new ResizeObserver(syncShellMin);
    observer.observe(leftEl);
    observer.observe(rightEl);
    return () => observer.disconnect();
  }, [activeProject]);

  /** IA 变更：清空量宽并先全量渲染，再测宽（避免用旧宽度误算） */
  useLayoutEffect(() => {
    setPrimaryItemWidths(null);
    setPrimaryOverflowCount(0);
  }, [primaryLabelsKey]);

  /** 首屏量宽：必须在 overflow=0、全部 primary 在 DOM 时测量 */
  useLayoutEffect(() => {
    if (primaryItemWidths) return;
    if (primaryOverflowCount !== 0) {
      setPrimaryOverflowCount(0);
      return;
    }
    const row = navItemsRowRef.current;
    const widths = primaryNavItems.map((item) => {
      const el = row?.querySelector<HTMLElement>(`[data-top-nav-primary-item="${CSS.escape(item.label)}"]`);
      return el?.getBoundingClientRect().width ?? 0;
    });
    if (widths.length === primaryNavItems.length && widths.every((width) => width > 0)) {
      setPrimaryItemWidths(widths);
    }
  }, [primaryNavItems, primaryItemWidths, primaryOverflowCount, primaryLabelsKey]);

  /** 窄屏：从右往左把主导航收入「更多」；「更多」永远贴右；可用宽取主行区 clientWidth */
  useLayoutEffect(() => {
    const row = navItemsRowRef.current;
    const more = moreSectionRef.current;
    const primaryEl = row?.querySelector<HTMLElement>("[data-top-navigation-primary]");
    if (!row || !more || !primaryEl || !primaryItemWidths) return;

    const syncOverflow = () => {
      const available = Math.max(0, primaryEl.clientWidth);
      let used = 0;
      let fit = 0;
      for (let index = 0; index < primaryNavItems.length; index += 1) {
        const width = primaryItemWidths[index] ?? 96;
        const next = used + width + (fit > 0 ? navItemGap : 0);
        if (next > available + 0.5) break;
        used = next;
        fit += 1;
      }
      setPrimaryOverflowCount(Math.max(0, primaryNavItems.length - fit));
    };

    syncOverflow();
    const observer = new ResizeObserver(syncOverflow);
    observer.observe(row);
    observer.observe(primaryEl);
    observer.observe(more);
    return () => observer.disconnect();
  }, [primaryItemWidths, primaryNavItems, navItemGap, primaryLabelsKey]);
  useEffect(() => {
    if (openPanel !== "project") {
      setProjectSearchQuery("");
      setProjectListScrolled(false);
    }
    if (openPanel !== "account") setAccountSubmenu(null);
  }, [openPanel]);

  useEffect(() => {
    if (openNavDropdown !== MORE_NAV_LABEL) setMoreCascadePath([]);
  }, [openNavDropdown]);

  useLayoutEffect(() => {
    if (!openNavDropdown || openNavDropdown === MORE_NAV_LABEL) return;

    const syncNavDropdownPlacement = () => {
      const root = document.querySelector(`[data-top-nav-primary-item="${openNavDropdown}"]`);
      const labelEl = root?.querySelector("[data-nav-trigger-label]");
      const arrowEl = root?.querySelector("[data-nav-trigger-arrow]");
      const menuEl = root?.querySelector("[data-function-entry-menu]");
      if (!(root instanceof HTMLElement) || !(labelEl instanceof HTMLElement) || !(menuEl instanceof HTMLElement)) {
        return;
      }
      const rootRect = root.getBoundingClientRect();
      const labelRect = labelEl.getBoundingClientRect();
      const arrowRect = (arrowEl instanceof HTMLElement ? arrowEl : labelEl).getBoundingClientRect();
      const menuWidth = menuEl.getBoundingClientRect().width;
      const viewportPad = u["spacing/2x"] ?? 8;
      const overflowRight = labelRect.left + menuWidth > window.innerWidth - viewportPad;
      if (overflowRight) {
        setNavDropdownPlacement({
          mode: "right",
          offset: Math.max(0, Math.round(rootRect.right - arrowRect.right)),
        });
      } else {
        setNavDropdownPlacement({
          mode: "left",
          offset: Math.max(0, Math.round(labelRect.left - rootRect.left)),
        });
      }
    };

    syncNavDropdownPlacement();
    window.addEventListener("resize", syncNavDropdownPlacement);
    return () => window.removeEventListener("resize", syncNavDropdownPlacement);
  }, [openNavDropdown, activeNavMenuByLabel]);

  useEffect(() => {
    setProjectListScrolled(false);
  }, [projectSearchQuery]);

  /** 点击浮层与触发源之外任意位置，收起所有下拉 */
  useEffect(() => {
    if (!openPanel && !openNavDropdown) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-top-nav-overlay-root]")) return;
      setOpenPanel(null);
      setOpenNavDropdown(null);
      setAccountSubmenu(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openPanel, openNavDropdown]);

  useLayoutEffect(() => {
    if (!accountSubmenu) return;
    const menu = accountMenuRef.current;
    const item =
      accountSubmenu === "language"
        ? accountLanguageItemRef.current
        : accountDiagnosticItemRef.current;
    if (!menu || !item) return;
    setAccountSubmenuTop(item.getBoundingClientRect().top - menu.getBoundingClientRect().top);
  }, [accountSubmenu, isAccountOpen]);

  const filteredProjects = PROJECT_OPTIONS.filter((project) =>
    project.toLowerCase().includes(projectSearchQuery.trim().toLowerCase()),
  );
  const projectListGap = u["spacing/2x"] ?? 8;
  const projectPanelPad = u["spacing/4x"] ?? 16;
  const projectListMaxHeight =
    PROJECT_PANEL_MAX_HEIGHT - projectPanelPad * 2 - projectListGap - PROJECT_SEARCH_HEIGHT;
  const projectListContentHeight =
    filteredProjects.length * PROJECT_OPTION_HEIGHT +
    Math.max(0, filteredProjects.length - 1) * projectListGap;
  const showProjectListMask = projectListContentHeight > projectListMaxHeight && !projectListScrolled;

  /** tip 文案对齐导航设计稿 6:7458；仅审批/资源/平台可持久选中 */
  const utilityItems: Array<
    SensTopNavigationUtilityItem & { tip: string; nodeId: string; selectable?: boolean }
  > = [
    { label: "帮助中心", tip: "帮助中心", icon: "nav-helpcenter", nodeId: "803:199" },
    { label: "通知", tip: "消息通知", icon: "nav-notice", nodeId: "803:174" },
    { label: "平台", tip: "平台管理", icon: "nav-platform", nodeId: "803:177", selectable: true },
    {
      label: "资源管理",
      tip: "资源管理",
      icon: "nav-workload-manager",
      nodeId: "4934:15929",
      selectable: true,
    },
    { label: "审批", tip: "审批中心", icon: "nav-examine", nodeId: "4934:15931", selectable: true },
  ];

  const panelStyle = {
    position: "absolute" as const,
    top: `calc(100% + ${u["spacing/1․5x"]}px)`,
    borderRadius: u["radius/l"] ?? 6,
    background: getColorToken("white"),
    boxShadow: buildShadowD4(),
    zIndex: 3,
  };

  const functionMenuPanelStyle = {
    ...panelStyle,
    width: 220,
    padding: "6px 8px 10px",
    display: "flex",
    flexDirection: "column" as const,
    gap: u["spacing/1x"],
  };

  const accountMenuPanelStyle = {
    ...functionMenuPanelStyle,
    padding: "6px 0 10px",
    alignItems: "center" as const,
  };

  const moreMenuPanelStyle = {
    ...functionMenuPanelStyle,
    width: MORE_MENU_PANEL_WIDTH,
    padding: "6px 0 10px",
    alignItems: "center" as const,
  };

  const projectPanelStyle = {
    ...panelStyle,
    width: 294,
    maxHeight: PROJECT_PANEL_MAX_HEIGHT,
    padding: u["spacing/4x"],
    display: "flex",
    flexDirection: "column" as const,
    gap: u["spacing/2x"],
    boxSizing: "border-box" as const,
    overflow: "hidden" as const,
  };

  const getPanelItemStyle = ({
    key,
    selected,
    color,
    hoverColor = color,
    selectedColor,
    hoverBackground,
    selectedBackground,
    outlineColor,
    selectedOutlineColor,
    justifyContent = "flex-start",
  }: {
    key: string;
    selected: boolean;
    color: string;
    hoverColor?: string;
    selectedColor: string;
    hoverBackground: string;
    selectedBackground: string;
    outlineColor?: string;
    selectedOutlineColor?: string;
    justifyContent?: "flex-start" | "center";
  }) => ({
    width: "100%",
    height: 36,
    boxSizing: "border-box" as const,
    padding: `0 ${u["spacing/3x"]}px`,
    display: "flex",
    alignItems: "center",
    outline: "none",
    borderRadius: u["radius/l"] ?? 6,
    border: outlineColor ? `1px solid ${selected ? selectedOutlineColor ?? outlineColor : outlineColor}` : 0,
    background: selected ? selectedBackground : hoveredMenuItem === key ? hoverBackground : "transparent",
    color: selected ? selectedColor : hoveredMenuItem === key ? hoverColor : color,
    cursor: sensCursorValue("pointer"),
    fontWeight: selected ? 600 : 400,
    textAlign: "left" as const,
    justifyContent,
    whiteSpace: "nowrap" as const,
  });

  const renderMoreCascadePanel = (
    nodes: MoreMenuNode[],
    level: 0 | 1 | 2,
    panelTop = 0,
  ): ReactNode => {
    const pathLabel = moreCascadePath[level];
    const openNode = nodes.find((node) => node.label === pathLabel);
    const childNodes = openNode?.children;
    const openIndex = openNode ? nodes.findIndex((node) => node.label === pathLabel) : -1;
    const childTop = openIndex >= 0 ? moreItemOffsetTop(openIndex, u["spacing/1x"] ?? 4) : 0;
    const gap = u["spacing/1x"] ?? 4;

    return (
      <div
        role={level === 0 ? "menu" : "menu"}
        aria-label={level === 0 ? "更多菜单" : `${pathLabel ?? "子"}菜单`}
        data-top-nav-more-menu={level === 0 ? "" : undefined}
        data-more-menu-level={level + 1}
        style={{
          ...moreMenuPanelStyle,
          ...(level === 0
            ? { right: 0, left: "auto", transform: "none" }
            : {
                position: "absolute",
                top: panelTop,
                right: "100%",
                left: "auto",
                transform: "none",
                zIndex: 4 + level,
              }),
        }}
        onMouseEnter={() => {
          if (level === 0) {
            clearNavDropdownCloseTimer();
            setHoveredNavLabel(MORE_NAV_LABEL);
            setOpenNavDropdown(MORE_NAV_LABEL);
          }
        }}
        onMouseLeave={() => {
          if (level === 0) {
            scheduleNavDropdownClose(MORE_NAV_LABEL);
          }
        }}
      >
        {nodes.map((node) => {
          const itemKey = `more-L${level + 1}-${node.label}`;
          const hasChildren = Boolean(node.children?.length);
          const inPath = moreCascadePath[level] === node.label;
          const hovered = hoveredMenuItem === itemKey;
          const emphasized = hovered || inPath;
          const leafSelected =
            !hasChildren && activeBusinessSelectionOwner === "more" && morePinnedLabel === node.label;
          const textColor = emphasized || leafSelected ? activeText : panelText;
          const rowBg = emphasized || leafSelected ? activeBg : "transparent";
          const chevronColor = emphasized || leafSelected ? activeText : functionMenuIcon;

          return (
            <button
              key={node.label}
              type="button"
              role="menuitem"
              aria-haspopup={hasChildren ? "menu" : undefined}
              aria-expanded={hasChildren ? inPath : undefined}
              data-more-menu-item={node.label}
              onMouseEnter={() => {
                setHoveredMenuItem(itemKey);
                setMoreCascadePath((current) => {
                  const next = current.slice(0, level);
                  if (hasChildren) next[level] = node.label;
                  return next;
                });
              }}
              onClick={() => {
                if (hasChildren) return;
                clearNavDropdownCloseTimer();
                selectMoreBusinessDestination(node.label);
                setOpenNavDropdown(null);
                setMoreCascadePath([]);
              }}
              style={{
                width: MORE_MENU_PANEL_WIDTH,
                height: MORE_MENU_ITEM_HEIGHT,
                padding: `0 ${u["spacing/2x"]}px`,
                border: 0,
                outline: "none",
                background: "transparent",
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                flexShrink: 0,
                cursor: sensCursorValue("pointer"),
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: gap,
                  width: "100%",
                  padding: `7px ${u["spacing/3x"]}px`,
                  borderRadius: u["radius/m"],
                  background: rowBg,
                  color: textColor,
                  boxSizing: "border-box",
                }}
              >
                <span
                  style={{
                    flex: 1,
                    minWidth: 0,
                    textAlign: "left",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: getTypographyToken("font-size/m"),
                    lineHeight: `${getTypographyToken("line-height/m")}px`,
                    fontWeight:
                      emphasized || leafSelected
                        ? getTypographyToken("font-weight/medium")
                        : getTypographyToken("font-weight/regular"),
                    height: getTypographyToken("line-height/m"),
                  }}
                >
                  {node.label}
                </span>
                {hasChildren ? (
                  <NavigationIcon name="right" variant="filled" label="展开下级" color={chevronColor} />
                ) : null}
              </span>
            </button>
          );
        })}
        {childNodes?.length && level < 2
          ? renderMoreCascadePanel(childNodes, (level + 1) as 1 | 2, childTop)
          : null}
      </div>
    );
  };

  const renderNavItem = (item: SensTopNavigationItem, options?: { isMore?: boolean }) => {
    const isMore = Boolean(options?.isMore) || item.label === MORE_NAV_LABEL;
    const displayLabel = isMore ? morePinnedLabel ?? MORE_NAV_LABEL : item.label;
    const isActive = item.label === activeNavLabel;
    const isHovered = item.label === hoveredNavLabel;
    const dropdownConfig = !isMore && item.arrow ? navDropdownConfig[item.label] : undefined;
    const dropdownSections = dropdownConfig ? navDropdownToSections(dropdownConfig) : undefined;
    const hasDropdown = isMore ? true : Boolean(dropdownSections?.length);
    const isDropdownOpen = hasDropdown && openNavDropdown === item.label;
    const dropdownBridgeHeight = u["spacing/1․5x"] ?? 6;
    const itemColor = isActive ? topTextActive : isHovered ? topTextHover : topText;
    const activeMenuItem =
      activeBusinessSelectionOwner === "primary" && item.label === activeNavLabel
        ? activeNavMenuByLabel[item.label] ??
          (dropdownConfig?.kind === "flat"
            ? dropdownConfig.items[0]
            : dropdownConfig?.sections[0]?.items[0])
        : null;

    return (
      <div
        key={item.label}
        data-top-nav-overlay-root={hasDropdown || isMore ? "" : undefined}
        data-top-nav-more-trigger={isMore ? "" : undefined}
        data-top-nav-primary-item={isMore ? undefined : item.label}
        onMouseEnter={() => {
          clearNavDropdownCloseTimer();
          clearShellPanelCloseTimer();
          setHoveredNavLabel(item.label);
          /** 第二行业务浮层互斥：开主导航 / 更多时关闭九宫格（项目/账号可并存） */
          setOpenPanel((panel) => (panel === "function" ? null : panel));
          setOpenNavDropdown(hasDropdown ? item.label : null);
        }}
        onMouseLeave={() => {
          if (hasDropdown) {
            scheduleNavDropdownClose(item.label);
          } else {
            setHoveredNavLabel(null);
          }
        }}
        style={{ position: "relative", flexShrink: 0 }}
      >
        <button
          type="button"
          aria-label={isMore ? `${MORE_NAV_LABEL}${morePinnedLabel ? `：${morePinnedLabel}` : ""}` : item.label}
          aria-haspopup={hasDropdown ? "menu" : undefined}
          aria-expanded={hasDropdown ? isDropdownOpen : undefined}
          data-nav-display-label={displayLabel}
          onClick={() => {
            setOpenPanel(null);
            if (isMore) {
              setOpenNavDropdown(MORE_NAV_LABEL);
              return;
            }
            if (hasDropdown) {
              // 带下拉：切域时进入该域并恢复上次叶子；已在本域则只开菜单，不刷新落地页
              if (!isActive || activeBusinessSelectionOwner !== "primary") {
                selectPrimaryBusinessDestination(item.label);
              }
              setOpenNavDropdown(item.label);
            } else {
              selectPrimaryBusinessDestination(item.label);
              setOpenNavDropdown(null);
            }
          }}
          style={{
            position: "relative",
            height: 40,
            padding: isMore ? `8px 0 1px ${u["spacing/4x"]}px` : `8px ${u["spacing/4x"]}px 1px`,
            border: 0,
            outline: "none",
            borderRadius: u["radius/l"] ?? 6,
            display: "flex",
            alignItems: "flex-start",
            gap: u["spacing/1x"],
            color: itemColor,
            background: "transparent",
            cursor: sensCursorValue("pointer"),
            fontSize: getTypographyToken("font-size/l"),
            lineHeight: `${getTypographyToken("line-height/l")}px`,
            fontWeight: isActive
              ? getTypographyToken("font-weight/semibold")
              : getTypographyToken("font-weight/regular"),
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          <span
            data-nav-trigger-label=""
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: item.arrow || isMore ? 2 : 4,
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                height: getTypographyToken("line-height/l"),
                lineHeight: `${getTypographyToken("line-height/l")}px`,
              }}
            >
              {displayLabel}
            </span>
            <span
              aria-hidden
              style={{
                width: 16,
                height: 3,
                borderRadius: u["radius/m"],
                background: isActive ? topTextActive : "transparent",
              }}
            />
          </span>
          {item.arrow || isMore ? (
            <span
              data-nav-trigger-arrow=""
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: getTypographyToken("line-height/l"),
                width: 16,
                flexShrink: 0,
                transform: isDropdownOpen ? "rotate(180deg)" : undefined,
              }}
            >
              <NavigationIcon
                name="nav-down"
                label={isDropdownOpen ? `${displayLabel} 收起` : `${displayLabel} 展开`}
                color="currentColor"
              />
            </span>
          ) : null}
        </button>
        {isMore && isDropdownOpen ? (
          <div
            aria-hidden
            data-more-hover-bridge
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              height: dropdownBridgeHeight,
              zIndex: 2,
            }}
          />
        ) : null}
        {isMore && isDropdownOpen ? renderMoreCascadePanel(moreMenuRoots, 0) : null}
        {!isMore && hasDropdown && isDropdownOpen && dropdownSections ? (
          <FunctionEntryMenuPanel
            sections={dropdownSections}
            selectedLabel={activeMenuItem ?? null}
            hoveredKey={hoveredMenuItem}
            onHover={setHoveredMenuItem}
            onSelect={(label) => {
              clearNavDropdownCloseTimer();
              selectPrimaryBusinessDestination(item.label, label);
              setOpenNavDropdown(null);
            }}
            onMouseEnter={clearNavDropdownCloseTimer}
            onMouseLeave={() => scheduleNavDropdownClose(item.label)}
            textColor={panelText}
            hoverText={activeText}
            activeText={activeText}
            hoverBg={functionMenuHoverBg}
            activeBg={activeBg}
            dividerColor={panelDivider}
            style={{
              position: "absolute",
              top: `calc(100% + ${u["spacing/1․5x"]}px)`,
              zIndex: 3,
              ...(navDropdownPlacement.mode === "right"
                ? { right: navDropdownPlacement.offset, left: "auto" }
                : { left: navDropdownPlacement.offset, right: "auto" }),
            }}
          />
        ) : null}
      </div>
    );
  };

  return (
    <div
      data-top-navigation-shell
      style={{
        width: "100%",
        overflow: "visible",
      } as CSSProperties}
    >
        <div
          data-top-navigation-canvas
          data-shell-min-width={shellMinWidth ?? undefined}
          style={{
            width: "100%",
            minWidth: shellMinWidth,
            borderRadius: embedded ? 0 : navRadius,
            overflow: embedded ? "visible" : "hidden",
            background: getColorToken("white"),
            boxShadow: embedded ? "none" : buildShadowD4(),
            border: embedded ? 0 : `1px solid ${getColorToken("outline-color-transparent")}`,
          }}
        >
          <div
            style={{
              position: "relative",
              height: atmosphere ? 180 : 82,
              padding: 0,
              background: getThemeTopBackground(navigationTheme),
            }}
          >
            {atmosphere ? (
              <div
              style={{
                position: "absolute",
                inset: 0,
                background: getThemeTopAtmosphere(navigationTheme),
                pointerEvents: "none",
              }}
              />
            ) : null}

            <div style={{ position: "relative", zIndex: embedded ? 3 : 1 }}>
              <div
                data-top-navigation-upper
                style={{
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  padding: `0 ${u["spacing/4x"]}px`,
                  borderBottom: `1px solid ${panelDivider}`,
                  whiteSpace: "nowrap",
                }}
              >
                <div
                  ref={upperLeftRef}
                  data-top-navigation-upper-left
                  style={{ display: "flex", alignItems: "center", gap: u["spacing/6x"], flexShrink: 0 }}
                >
                  <SensTopNavLogo />

                  <div
                    data-top-nav-overlay-root
                    onMouseEnter={() => {
                      clearShellPanelCloseTimer();
                      setIsAccountHovered(false);
                      setOpenPanel("project");
                    }}
                    onMouseLeave={() => {
                      setIsAccountHovered(false);
                      scheduleShellPanelClose("project");
                    }}
                    style={{ position: "relative", flexShrink: 0 }}
                  >
                    <button
                      type="button"
                      aria-label={`项目切换：${activeProject}`}
                      aria-haspopup="menu"
                      aria-expanded={openPanel === "project"}
                      style={{
                        height: 24,
                        padding: 0,
                        border: 0,
                        outline: "none",
                        background: "transparent",
                        color: topText,
                        display: "flex",
                        alignItems: "center",
                        gap: u["spacing/1․5x"],
                        cursor: sensCursorValue("pointer"),
                        whiteSpace: "nowrap",
                        fontSize: getTypographyToken("font-size/m"),
                        lineHeight: `${getTypographyToken("line-height/m")}px`,
                        fontWeight: getTypographyToken("font-weight/regular"),
                      }}
                    >
                      <span>{activeProject}</span>
                      <span style={{ display: "inline-flex", transform: openPanel === "project" ? "rotate(180deg)" : undefined }}>
                        <NavigationIcon name="nav-down" label="展开项目切换" color={topIconColor} />
                      </span>
                    </button>
                    {openPanel === "project" ? (
                      <div
                        role="menu"
                        aria-label="项目切换菜单"
                        data-project-switcher-panel
                        style={{ ...projectPanelStyle, left: 0 }}
                        onMouseEnter={clearShellPanelCloseTimer}
                        onMouseLeave={() => {
                          setHoveredMenuItem(null);
                          scheduleShellPanelClose("project");
                        }}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <SearchInput
                          width={PROJECT_OPTION_WIDTH}
                          placeholder="搜索项目名称"
                          value={projectSearchQuery}
                          onChange={(event) => setProjectSearchQuery(event.target.value)}
                          aria-label="搜索项目名称"
                        />
                        <div style={{ position: "relative", width: PROJECT_OPTION_WIDTH }}>
                          {filteredProjects.length === 0 ? (
                            <div
                              data-project-switcher-empty
                              style={{
                                width: PROJECT_OPTION_WIDTH,
                                minHeight: projectListMaxHeight,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <SensEmptyState
                                scope="non-page"
                                type="noResult"
                                size="special"
                                title="无匹配项目"
                                description={null}
                              />
                            </div>
                          ) : (
                            <>
                              <div
                                data-project-switcher-list
                                onScroll={(event) => {
                                  setProjectListScrolled(event.currentTarget.scrollTop > 0);
                                }}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: projectListGap,
                                  maxHeight: projectListMaxHeight,
                                  overflowY: "auto",
                                  overflowX: "hidden",
                                  width: PROJECT_OPTION_WIDTH,
                                }}
                              >
                                {filteredProjects.map((project) => {
                                  const itemKey = `project-${project}`;
                                  const selected = project === activeProject;
                                  return (
                                    <ProjectSwitcherOption
                                      key={project}
                                      project={project}
                                      selected={selected}
                                      onSelect={() => {
                                        setActiveProject(project);
                                        setOpenPanel(null);
                                      }}
                                      onHover={(hovered) => setHoveredMenuItem(hovered ? itemKey : null)}
                                      itemStyle={{
                                        ...getPanelItemStyle({
                                          key: itemKey,
                                          selected,
                                          color: projectText,
                                          hoverColor: projectTextHover,
                                          selectedColor: projectTextActive,
                                          hoverBackground: projectHoverBg,
                                          selectedBackground: projectActiveBg,
                                          outlineColor: menuLineOutlined,
                                          selectedOutlineColor: menuLineActive,
                                          justifyContent: "center",
                                        }),
                                        width: PROJECT_OPTION_WIDTH,
                                        height: PROJECT_OPTION_HEIGHT,
                                        flexShrink: 0,
                                        padding: `7px ${u["spacing/3x"]}px`,
                                        fontSize: getTypographyToken("font-size/m"),
                                        lineHeight: `${getTypographyToken("line-height/m")}px`,
                                        fontWeight: selected
                                          ? getTypographyToken("font-weight/medium")
                                          : getTypographyToken("font-weight/regular"),
                                        overflow: "hidden",
                                      }}
                                    />
                                  );
                                })}
                              </div>
                              {showProjectListMask ? (
                                <div
                                  aria-hidden
                                  data-project-switcher-mask
                                  style={{
                                    position: "absolute",
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    height: PROJECT_LIST_MASK_HEIGHT,
                                    pointerEvents: "none",
                                    background: PROJECT_LIST_MASK_GRADIENT,
                                  }}
                                />
                              ) : null}
                            </>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div
                  data-top-navigation-upper-gap
                  aria-hidden
                  style={{
                    flex: 1,
                    minWidth: UPPER_CLUSTER_MIN_GAP,
                    alignSelf: "stretch",
                  }}
                />

                <div
                  ref={upperRightRef}
                  data-top-navigation-upper-right
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: u["spacing/4x"],
                    flexShrink: 0,
                  }}
                >
                  {utilityItems.map((item) => {
                    const isSelected =
                      Boolean(item.selectable) &&
                      activeBusinessSelectionOwner === "utility" &&
                      activeUtilityIcon === item.icon;
                    const isHovered = hoveredUtilityIcon === item.icon;
                    const iconColor = isSelected ? topTextActive : isHovered ? topTextHover : topIconColor;
                    const iconBackground = isSelected ? topIconActive : isHovered ? topIconHover : "transparent";

                    return (
                      <SensTips key={item.label} title={item.tip} placement="bottom" align="center">
                        <button
                          type="button"
                          aria-label={item.label}
                          aria-current={isSelected ? "page" : undefined}
                          data-utility-icon={item.icon}
                          data-utility-state={isSelected ? "active" : isHovered ? "hover" : "default"}
                          data-figma-node-id={item.nodeId}
                          onMouseEnter={() => setHoveredUtilityIcon(item.icon)}
                          onMouseLeave={() => setHoveredUtilityIcon(null)}
                          onClick={() => {
                            setOpenPanel(null);
                            setOpenNavDropdown(null);
                            selectUtilityBusinessDestination(item);
                            if (onUtilityNavigate) {
                              onUtilityNavigate({ label: item.label, icon: item.icon });
                              return;
                            }
                          }}
                          style={{
                            width: UTILITY_ICON_HIT,
                            height: UTILITY_ICON_HIT,
                            padding: UTILITY_ICON_PAD,
                            boxSizing: "border-box",
                            display: "grid",
                            placeItems: "center",
                            flexShrink: 0,
                            border: 0,
                            outline: "none",
                            borderRadius: u["radius/m"],
                            background: iconBackground,
                            color: iconColor,
                            cursor: sensCursorValue("pointer"),
                          }}
                        >
                          <NavigationIcon
                            name={item.icon}
                            label={item.label}
                            color="currentColor"
                            size={UTILITY_ICON_SIZE}
                          />
                        </button>
                      </SensTips>
                    );
                  })}
                  <div style={{ width: 1, height: 16, background: panelStroke, flexShrink: 0 }} />
                  <div
                    data-top-nav-overlay-root
                    style={{ position: "relative", flexShrink: 0 }}
                    onMouseEnter={() => {
                      clearShellPanelCloseTimer();
                      setIsAccountHovered(true);
                      setOpenPanel("account");
                    }}
                    onMouseLeave={() => {
                      setIsAccountHovered(false);
                      scheduleShellPanelClose("account");
                    }}
                  >
                    <button
                      type="button"
                      aria-label="卓越 分析师"
                      aria-haspopup="menu"
                      aria-expanded={isAccountOpen}
                      style={{
                        padding: `${u["spacing/1x"]}px 0`,
                        border: 0,
                        outline: "none",
                        background: "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: u["spacing/2x"],
                        color: accountColor,
                        cursor: sensCursorValue("pointer"),
                      }}
                    >
                      <span
                        style={{
                          color: "currentColor",
                          fontSize: getTypographyToken("font-size/l"),
                          lineHeight: `${getTypographyToken("line-height/l")}px`,
                          fontWeight: getTypographyToken("font-weight/semibold"),
                          whiteSpace: "nowrap",
                          textAlign: "right",
                        }}
                      >
                        卓越
                      </span>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: u["spacing/1x"],
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            color: "currentColor",
                            fontSize: getTypographyToken("font-size/s"),
                            lineHeight: `${getTypographyToken("line-height/s")}px`,
                            fontWeight: getTypographyToken("font-weight/regular"),
                            whiteSpace: "nowrap",
                            textAlign: "center",
                            background: getColorToken("theme-top-role-background"),
                            borderRadius: ACCOUNT_ROLE_PILL_RADIUS,
                            padding: `${ACCOUNT_ROLE_PILL_PAD_Y}px ${u["spacing/2x"]}px`,
                          }}
                        >
                          分析师
                        </span>
                        <span
                          style={{
                            display: "inline-flex",
                            width: 16,
                            height: 16,
                            alignItems: "center",
                            justifyContent: "center",
                            transform: isAccountOpen ? "rotate(180deg)" : undefined,
                          }}
                        >
                          <NavigationIcon
                            name="nav-down"
                            label={isAccountOpen ? "收起账号菜单" : "展开账号菜单"}
                            color="currentColor"
                          />
                        </span>
                      </span>
                    </button>
                    {isAccountOpen ? (
                      <div
                        role="menu"
                        aria-label="分析师账号菜单"
                        data-account-menu
                        ref={accountMenuRef}
                        style={{
                          ...accountMenuPanelStyle,
                          position: "absolute",
                          top: `calc(100% + ${u["spacing/1․5x"]}px)`,
                          right: 0,
                          zIndex: 3,
                        }}
                        onMouseEnter={clearShellPanelCloseTimer}
                        onMouseLeave={() => {
                          setHoveredMenuItem(null);
                          scheduleShellPanelClose("account");
                        }}
                      >
                          {ACCOUNT_MENU.map((row) => {
                            if (row.kind === "divider") {
                              return (
                                <div
                                  key={row.id}
                                  aria-hidden
                                  style={{
                                    width: 180,
                                    height: 1,
                                    background: menuLineDivide,
                                    flexShrink: 0,
                                  }}
                                />
                              );
                            }

                            const itemKey = `account-${row.id}`;
                            const hovered = hoveredMenuItem === itemKey;
                            const submenuOpen = Boolean(row.submenu && accountSubmenu === row.submenu);
                            const iconColor = hovered || submenuOpen ? functionMenuIconHover : functionMenuIcon;
                            const textColor = hovered || submenuOpen ? functionMenuHoverText : panelText;
                            const rowBg = hovered || submenuOpen ? functionMenuHoverBg : "transparent";
                            const submenuItemRef =
                              row.submenu === "language"
                                ? accountLanguageItemRef
                                : row.submenu === "diagnostic"
                                  ? accountDiagnosticItemRef
                                  : undefined;

                            return (
                              <button
                                key={row.id}
                                type="button"
                                role="menuitem"
                                ref={submenuItemRef}
                                aria-haspopup={row.submenu ? "menu" : undefined}
                                aria-expanded={row.submenu ? submenuOpen : undefined}
                                onClick={() => {
                                  if (row.trailing === "switch") return;
                                  if (row.submenu) {
                                    return;
                                  }
                                  setAccountSubmenu(null);
                                  if (row.closesOnClick) setOpenPanel(null);
                                }}
                                onMouseEnter={() => {
                                  setHoveredMenuItem(itemKey);
                                  setAccountSubmenu(row.submenu ?? null);
                                }}
                                onMouseLeave={() => setHoveredMenuItem(null)}
                                style={{
                                  width: 220,
                                  height: 36,
                                  padding: `0 ${u["spacing/2x"]}px`,
                                  border: 0,
                                  outline: "none",
                                  background: "transparent",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "stretch",
                                  flexShrink: 0,
                                  cursor: sensCursorValue("pointer"),
                                }}
                              >
                                <span
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: u["spacing/1x"],
                                    width: "100%",
                                    padding: `7px ${u["spacing/3x"]}px`,
                                    borderRadius: u["radius/m"],
                                    background: rowBg,
                                    color: textColor,
                                    boxSizing: "border-box",
                                  }}
                                >
                                  <NavigationIcon name={row.icon} label={row.label} color={iconColor} />
                                  <span
                                    style={{
                                      flex: 1,
                                      minWidth: 0,
                                      textAlign: "left",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      fontSize: getTypographyToken("font-size/m"),
                                      lineHeight: `${getTypographyToken("line-height/m")}px`,
                                      fontWeight: getTypographyToken("font-weight/regular"),
                                      height: getTypographyToken("line-height/m"),
                                    }}
                                  >
                                    {row.label}
                                  </span>
                                  {row.trailing === "chevron" ? (
                                    <NavigationIcon
                                      name="right"
                                      variant="filled"
                                      label="展开子菜单"
                                      color={iconColor}
                                    />
                                  ) : null}
                                  {row.trailing === "switch" ? (
                                    <span
                                      role="switch"
                                      aria-checked={showSensitiveInfo}
                                      aria-label={row.label}
                                      tabIndex={0}
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        setShowSensitiveInfo((current) => !current);
                                      }}
                                      onKeyDown={(event) => {
                                        if (event.key === "Enter" || event.key === " ") {
                                          event.preventDefault();
                                          event.stopPropagation();
                                          setShowSensitiveInfo((current) => !current);
                                        }
                                      }}
                                      style={{
                                        width: 26,
                                        height: 16,
                                        borderRadius: 8,
                                        background: showSensitiveInfo ? switchTrackOn : switchTrackOff,
                                        position: "relative",
                                        flexShrink: 0,
                                        display: "inline-block",
                                      }}
                                    >
                                      <span
                                        aria-hidden
                                        style={{
                                          position: "absolute",
                                          top: 2,
                                          left: showSensitiveInfo ? 12 : 2,
                                          width: 12,
                                          height: 12,
                                          borderRadius: "50%",
                                          background: getColorToken("white"),
                                          transition: "left 120ms ease",
                                        }}
                                      />
                                    </span>
                                  ) : null}
                                </span>
                              </button>
                            );
                          })}

                        {accountSubmenu === "language" ? (
                          <div
                            role="menu"
                            aria-label="系统语言菜单"
                            data-account-language-menu
                            style={{
                              ...accountMenuPanelStyle,
                              position: "absolute",
                              top: accountSubmenuTop,
                              right: "100%",
                              left: "auto",
                              zIndex: 4,
                            }}
                            onMouseLeave={() => setHoveredMenuItem(null)}
                          >
                            {ACCOUNT_LANGUAGE_OPTIONS.map((option) => {
                              const itemKey = `account-lang-${option}`;
                              const selected = option === accountLanguage;
                              const hovered = hoveredMenuItem === itemKey;
                              const emphasis = hovered;
                              const textColor = emphasis ? functionMenuHoverText : panelText;
                              const rowBg = emphasis ? functionMenuHoverBg : "transparent";
                              const checkColor = emphasis ? functionMenuIconHover : functionMenuIcon;

                              return (
                                <button
                                  key={option}
                                  type="button"
                                  role="menuitemradio"
                                  aria-checked={selected}
                                  onClick={() => {
                                    setAccountLanguage(option);
                                    setAccountSubmenu(null);
                                  }}
                                  onMouseEnter={() => setHoveredMenuItem(itemKey)}
                                  onMouseLeave={() => setHoveredMenuItem(null)}
                                  style={{
                                    width: 220,
                                    height: 36,
                                    padding: `0 ${u["spacing/2x"]}px`,
                                    border: 0,
                                    outline: "none",
                                    background: "transparent",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "stretch",
                                    flexShrink: 0,
                                    cursor: sensCursorValue("pointer"),
                                  }}
                                >
                                  <span
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: u["spacing/1x"],
                                      width: "100%",
                                      padding: `7px ${u["spacing/3x"]}px`,
                                      borderRadius: u["radius/m"],
                                      background: rowBg,
                                      color: textColor,
                                      boxSizing: "border-box",
                                    }}
                                  >
                                    <span
                                      style={{
                                        flex: 1,
                                        minWidth: 0,
                                        textAlign: "left",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        fontSize: getTypographyToken("font-size/m"),
                                        lineHeight: `${getTypographyToken("line-height/m")}px`,
                                        fontWeight: selected
                                          ? getTypographyToken("font-weight/medium")
                                          : getTypographyToken("font-weight/regular"),
                                        height: getTypographyToken("line-height/m"),
                                      }}
                                    >
                                      {option}
                                    </span>
                                    {selected ? <NavigationIcon name="check" label="已选中" color={checkColor} /> : null}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        ) : null}

                        {accountSubmenu === "diagnostic" ? (
                          <div
                            role="menu"
                            aria-label="诊断工具菜单"
                            data-account-diagnostic-menu
                            style={{
                              ...accountMenuPanelStyle,
                              position: "absolute",
                              top: accountSubmenuTop,
                              right: "100%",
                              left: "auto",
                              zIndex: 4,
                            }}
                            onMouseLeave={() => setHoveredMenuItem(null)}
                          >
                            {ACCOUNT_DIAGNOSTIC_OPTIONS.map((option) => {
                              const itemKey = `account-diagnostic-${option}`;
                              const hovered = hoveredMenuItem === itemKey;
                              const textColor = hovered ? functionMenuHoverText : panelText;
                              const rowBg = hovered ? functionMenuHoverBg : "transparent";

                              return (
                                <button
                                  key={option}
                                  type="button"
                                  role="menuitem"
                                  onClick={() => {
                                    setAccountSubmenu(null);
                                    setOpenPanel(null);
                                  }}
                                  onMouseEnter={() => setHoveredMenuItem(itemKey)}
                                  onMouseLeave={() => setHoveredMenuItem(null)}
                                  style={{
                                    width: 220,
                                    height: 36,
                                    padding: `0 ${u["spacing/2x"]}px`,
                                    border: 0,
                                    outline: "none",
                                    background: "transparent",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "stretch",
                                    flexShrink: 0,
                                    cursor: sensCursorValue("pointer"),
                                  }}
                                >
                                  <span
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      width: "100%",
                                      padding: `7px ${u["spacing/3x"]}px`,
                                      borderRadius: u["radius/m"],
                                      background: rowBg,
                                      color: textColor,
                                      boxSizing: "border-box",
                                    }}
                                  >
                                    <OverflowTipsText
                                      text={option}
                                      style={{
                                        flex: 1,
                                        minWidth: 0,
                                        textAlign: "left",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        fontSize: getTypographyToken("font-size/m"),
                                        lineHeight: `${getTypographyToken("line-height/m")}px`,
                                        fontWeight: getTypographyToken("font-weight/regular"),
                                        height: getTypographyToken("line-height/m"),
                                      }}
                                    />
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div
                data-top-navigation-lower
                style={{
                  height: 46,
                  display: "flex",
                  alignItems: "center",
                  padding: `0 ${u["spacing/4x"]}px`,
                  gap: u["spacing/4x"],
                  whiteSpace: "nowrap",
                }}
              >
                <div
                  data-top-nav-overlay-root=""
                  data-top-navigation-function-entry
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: u["spacing/2x"],
                    flexShrink: 0,
                  }}
                  onMouseEnter={() => {
                    clearShellPanelCloseTimer();
                    clearNavDropdownCloseTimer();
                    /** 第二行业务浮层互斥：开九宫格时关闭主导航 / 更多 */
                    setOpenNavDropdown(null);
                    setMoreCascadePath([]);
                    setOpenPanel("function");
                  }}
                  onMouseLeave={() => {
                    setIsFunctionEntryHovered(false);
                    scheduleShellPanelClose("function");
                  }}
                >
                  <button
                    type="button"
                    aria-label="产品导航"
                    data-top-nav-function-trigger=""
                    aria-haspopup="menu"
                    aria-expanded={isFunctionOpen}
                    onMouseEnter={() => setIsFunctionEntryHovered(true)}
                    onMouseLeave={() => setIsFunctionEntryHovered(false)}
                    style={{
                      width: 32,
                      height: 32,
                      padding: 7,
                      border: 0,
                      outline: "none",
                      borderRadius: u["radius/m"],
                      background: isFunctionEntryEmphasis ? topIconHover : "transparent",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                      color: isFunctionEntryEmphasis ? topTextHover : topIconColor,
                      cursor: sensCursorValue("pointer"),
                    }}
                  >
                    <NavigationIcon name="nav-product-navigation" label="产品导航" color="currentColor" size={18} />
                  </button>
                  <div style={{ width: 1, height: 16, background: panelStroke, flexShrink: 0 }} />
                  {isFunctionOpen ? (
                    <FunctionEntryMenuPanel
                      sections={FUNCTION_MENU_NINE_GRID}
                      selectedLabel={functionEntrySelectedLabel}
                      hoveredKey={hoveredMenuItem}
                      onHover={setHoveredMenuItem}
                      onSelect={(label) => {
                        selectFunctionBusinessDestination(label);
                        setOpenPanel(null);
                      }}
                      textColor={panelText}
                      hoverText={activeText}
                      activeText={activeText}
                      hoverBg={functionMenuHoverBg}
                      activeBg={activeBg}
                      dividerColor={panelDivider}
                      style={{
                        position: "absolute",
                        top: `calc(100% + ${u["spacing/1․5x"]}px)`,
                        left: 0,
                        zIndex: 3,
                      }}
                      onMouseEnter={clearShellPanelCloseTimer}
                      onMouseLeave={() => scheduleShellPanelClose("function")}
                    />
                  ) : null}
                </div>

                <div
                  ref={navItemsRowRef}
                  data-top-navigation-items
                  data-primary-overflow-count={primaryOverflowCount}
                  style={{
                    display: "flex",
                    flex: 1,
                    alignItems: "center",
                    gap: navItemGap,
                    flexWrap: "nowrap",
                    overflow: "visible",
                    minWidth: 0,
                  }}
                >
                  <div
                    data-top-navigation-primary
                    style={{
                      display: "flex",
                      flex: 1,
                      alignItems: "center",
                      gap: navItemGap,
                      flexWrap: "nowrap",
                      /** 仅量宽未完成时裁切，避免叠到「更多」；量完后 visible 以免裁切下拉 */
                      overflow: primaryItemWidths == null ? "hidden" : "visible",
                      minWidth: 0,
                    }}
                  >
                    {visiblePrimaryItems.map((item) => renderNavItem(item))}
                  </div>
                  {moreNavItem ? (
                    <div
                      ref={moreSectionRef}
                      data-top-navigation-more
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "auto",
                        flexShrink: 0,
                      }}
                    >
                      <div style={{ width: 1, height: 16, background: panelStroke, flexShrink: 0 }} />
                      {renderNavItem(moreNavItem, { isMore: true })}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {atmosphere ? (
              <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: 98,
                background: `linear-gradient(180deg, transparent 0%, ${pageBackground} 100%)`,
              }}
              />
            ) : null}

          </div>
      </div>
    </div>
  );
}
