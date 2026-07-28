import type {
  CSSProperties,
  Dispatch,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  SetStateAction,
} from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Tabs, Tooltip, type TabsProps } from "antd";
import { createPortal } from "react-dom";
import { SELECT_CHECK_ICON_SIZE, SelectCheckIcon } from "./FieldIcons";
import { SensBadge } from "./SensBadge";
import { useTranslation } from "react-i18next";
import { buildShadowD1, getColorToken, tokenRgba } from "../design-system/color-utils";
import { SensIcon } from "../design-system/icons";
import { getTypographyToken } from "../design-system/typography";
import tokens from "../design-system/tokens.resolved.json";
import { getUnitToken } from "../design-system/unit";
import { useSensDropdownMenuStyle } from "./SensDropdownMenu";
import { useAnchoredOverflowMenu } from "./useAnchoredOverflowMenu";
import "./cursors.css";
import "./tabs.css";

const u = tokens.unit as Record<string, number>;
const I18N_NS = "组件库";

export type SensTabSize = "large" | "small";

type BasicPreviewState =
  | "default"
  | "hover"
  | "click"
  | "active"
  | "activeHover"
  | "disabled"
  | "disabledHover";

type CardPreviewState = "default" | "hoverTitle" | "hoverDelete" | "beforeEdit" | "editing";

const BASIC_PREVIEW_STATE_LABELS: Record<BasicPreviewState, string> = {
  default: "默认",
  hover: "悬停",
  click: "点击",
  active: "选中",
  activeHover: "选中悬停",
  disabled: "禁用",
  disabledHover: "禁用悬停",
};

const CARD_PREVIEW_STATE_LABELS: Record<CardPreviewState, string> = {
  default: "默认",
  hoverTitle: "悬停标题",
  hoverDelete: "悬停删除",
  beforeEdit: "编辑前",
  editing: "编辑中",
};

interface PreviewStyleToken {
  primary: string;
  primaryHover: string;
  primaryActive: string;
  text: string;
  textDisabled: string;
  textDisabledHover: string;
  bgContainer: string;
  pillTrackBg: string;
  pillBg: string;
  pillHoverBg: string;
  pillClickBg: string;
  pillDisabledBg: string;
  pillDisabledHoverBg: string;
  selectedShadow: string;
  iconHover: string;
  badgeBg: string;
  badgeText: string;
  badgeActiveBg: string;
  badgeActiveText: string;
  stripPanelBorder: string;
}

/** 预览矩阵色：对齐 Figma 胶囊态色（直读 design token handle） */
function getPreviewStyleToken(): PreviewStyleToken {
  return {
    primary: getColorToken("component-primary"),
    primaryHover: getColorToken("component-hover"),
    primaryActive: getColorToken("component-active"),
    text: getColorToken("text-sub-color-transparent"),
    textDisabled: getColorToken("text-color-transparent-disable"),
    textDisabledHover: getColorToken("text-color-transparent-disable-hover"),
    bgContainer: getColorToken("white"),
    pillTrackBg: tokenRgba("background-01-transparent", 0.04),
    pillBg: "transparent",
    pillHoverBg: "transparent",
    pillClickBg: "transparent",
    pillDisabledBg: "transparent",
    pillDisabledHoverBg: "transparent",
    selectedShadow: buildShadowD1(),
    iconHover: getColorToken("text-color"),
    badgeBg: tokenRgba("background-transparent-grey", 0.08),
    badgeText: getColorToken("text-sub-color-transparent"),
    badgeActiveBg: getColorToken("component-light-background"),
    badgeActiveText: getColorToken("component-primary"),
    stripPanelBorder: tokenRgba("outline-color-transparent", 0.35),
  };
}

function useTabsPreviewVars(): CSSProperties {
  return {
    "--sens-tabs-space-2x": `${u["spacing/2x"]}px`,
    "--sens-tabs-space-5x": `${u["spacing/5x"]}px`,
    "--sens-tabs-space-6x": `${u["spacing/6x"]}px`,
    "--sens-tabs-pill-max-width": "112px",
  } as CSSProperties;
}

function getPillStructureVars(size: SensTabSize): CSSProperties {
  const isSmall = size === "small";
  return {
    "--sens-pill-track-bg": tokenRgba("background-01-transparent", 0.04),
    "--sens-pill-track-padding": `${getUnitToken("spacing/1x")}px`,
    "--sens-pill-item-gap": `${getUnitToken("spacing/1x")}px`,
    "--sens-pill-item-radius": `${getUnitToken(isSmall ? "radius/s" : "radius/m")}px`,
    /* 轨道圆角：Figma 小条 5px（无对应 unit token）；大条用 radius/l */
    "--sens-pill-track-radius": `${isSmall ? 5 : getUnitToken("radius/l")}px`,
    "--sens-pill-item-padding-inline": `${getUnitToken(
      isSmall ? "spacing/horizontal/2․5x" : "spacing/horizontal/3x",
    )}px`,
    "--sens-pill-item-font-size": `${getTypographyToken(isSmall ? "font-size/s" : "font-size/m")}px`,
    "--sens-pill-item-height": `${isSmall ? 24 : 28}px`,
    "--sens-pill-item-min-height": `${isSmall ? 24 : 28}px`,
    "--sens-pill-item-bg": "transparent",
    "--sens-pill-item-color": getColorToken("text-sub-color-transparent"),
    "--sens-pill-item-hover-bg": "transparent",
    "--sens-pill-item-click-bg": "transparent",
    "--sens-pill-item-hover-color": getColorToken("component-primary"),
    "--sens-pill-item-click-color": getColorToken("component-active"),
    "--sens-pill-item-selected-bg": getColorToken("white"),
    "--sens-pill-item-selected-color": getColorToken("component-primary"),
    "--sens-pill-item-selected-border-color": tokenRgba("outline-color-transparent", 0.06),
    "--sens-pill-item-disabled-bg": "transparent",
    "--sens-pill-item-disabled-hover-bg": "transparent",
    "--sens-pill-item-disabled-color": getColorToken("text-color-transparent-disable"),
    "--sens-pill-item-disabled-hover-color": getColorToken("text-color-transparent-disable-hover"),
    "--sens-pill-selected-hover-color": getColorToken("component-hover"),
    "--sens-pill-selected-shadow": buildShadowD1(),
    "--sens-tabs-badge-bg": tokenRgba("background-transparent-grey", 0.08),
    "--sens-tabs-badge-text": getColorToken("text-sub-color-transparent"),
    "--sens-tabs-badge-active-bg": getColorToken("component-light-background"),
    "--sens-tabs-badge-active-text": getColorToken("component-primary"),
  } as CSSProperties;
}

/** 页签（editable-card）结构 / 色：对齐 Figma 6354 / 4205 / 4420，直读 SensD token */
function getCardTabsVars(): CSSProperties {
  return {
    "--sens-card-tab-height": `${getUnitToken("size/component-height/m")}px`,
    "--sens-card-tab-padding-inline": `${getUnitToken("spacing/3x")}px`,
    "--sens-card-tab-padding-block": `${getUnitToken("spacing/1․5x")}px`,
    "--sens-card-tab-radius": `${getUnitToken("radius/m")}px`,
    "--sens-card-tab-gap": `${getUnitToken("spacing/1x")}px`,
    "--sens-card-tab-font-size": `${getTypographyToken("font-size/m")}px`,
    "--sens-card-tab-line-height": `${getTypographyToken("line-height/m")}px`,
    "--sens-card-tab-icon-size": `${getUnitToken("size/icon/m")}px`,
    "--sens-card-tab-bg-default": getColorToken("background-transparent-grey"),
    "--sens-card-tab-bg-active": getColorToken("white"),
    "--sens-card-tab-border": getColorToken("outline-color-transparent"),
    "--sens-card-tab-text-default": getColorToken("text-sub-color-transparent"),
    "--sens-card-tab-text-hover": getColorToken("component-primary"),
    "--sens-card-tab-text-active": getColorToken("component-primary"),
    "--sens-card-tab-text-active-hover": getColorToken("component-hover"),
    /* Figma 6354:27070 编辑前：选区绿底白字 */
    "--sens-card-tab-select-bg": getColorToken("component-primary"),
    "--sens-card-tab-select-text": getColorToken("white"),
    /* Figma 6354:27099 编辑中：大段正文色可输入 */
    "--sens-card-tab-edit-text": getColorToken("text-article-color"),
    "--sens-card-tab-remove": getColorToken("icon-color-transparent"),
    "--sens-card-tab-remove-hover": getColorToken("warning-color"),
    /* 加号 = 图标弱化链接按钮色链（对齐 SensButton tone=linkWeak） */
    "--sens-card-tab-add": getColorToken("text-sub-color"),
    "--sens-card-tab-add-hover": getColorToken("link-hover-color"),
    "--sens-card-tab-add-active": getColorToken("link-active-color"),
    "--sens-card-tab-add-gap": `${getUnitToken("spacing/2x")}px`,
    /* 内容区：Card Foundation 描边卡片（padding / 正文），外框仍与页签缝合 */
    "--sens-card-tab-panel-bg": getColorToken("white"),
    "--sens-card-tab-panel-border": getColorToken("outline-color-transparent"),
    "--sens-card-tab-panel-radius": `${getUnitToken("radius/l")}px`,
    "--sens-card-tab-panel-padding": `${getUnitToken("spacing/4x")}px`,
    "--sens-card-tab-panel-text": getColorToken("text-color-transparent"),
  } as CSSProperties;
}

function ellipsisLabel(text: string, maxChars = 8): ReactNode {
  if (text.length <= maxChars) return text;
  return (
    <Tooltip title={text}>
      <span>{`${text.slice(0, maxChars)}...`}</span>
    </Tooltip>
  );
}

function withOptionalBadge(label: ReactNode, showBadge: boolean): ReactNode {
  if (!showBadge) return label;
  return (
    <span className="sens-tabs-label-with-badge">
      <span>{label}</span>
      <span className="sens-tabs-counter-badge">6</span>
    </span>
  );
}

function getBasicTabLabelStyle(
  state: BasicPreviewState,
  isActive: boolean,
  styleToken: PreviewStyleToken,
): CSSProperties | undefined {
  const selected = state === "active" || state === "activeHover" || (state === "default" && isActive);
  const base: CSSProperties = {
    fontWeight: selected ? getTypographyToken("font-weight/semibold") : getTypographyToken("font-weight/regular"),
  };
  if (state === "disabled") return { ...base, color: styleToken.textDisabled };
  if (state === "disabledHover") return { ...base, color: styleToken.textDisabledHover };
  if (state === "hover") return { ...base, color: styleToken.primary };
  if (state === "click") return { ...base, color: styleToken.primaryActive };
  if (state === "active") return { ...base, color: styleToken.primary };
  if (state === "activeHover") return { ...base, color: styleToken.primaryHover };
  return { ...base, color: isActive ? styleToken.primary : styleToken.text };
}

/** 基础标签页结构 token：内容间距 / 选中字重 / 态色 */
function getBasicTabsVars(): CSSProperties {
  return {
    "--sens-basic-tabs-content-gap": `${getUnitToken("spacing/4x")}px`,
    "--sens-basic-tabs-active-weight": String(getTypographyToken("font-weight/semibold")),
    "--sens-basic-tabs-text-token": getColorToken("text-color"),
    "--sens-basic-tabs-hover-token": getColorToken("component-primary"),
    "--sens-basic-tabs-click-token": getColorToken("component-active"),
    "--sens-basic-tabs-selected-token": getColorToken("component-primary"),
    "--sens-tabs-badge-bg": tokenRgba("background-transparent-grey", 0.08),
    "--sens-tabs-badge-text": getColorToken("text-sub-color-transparent"),
    "--sens-tabs-badge-active-bg": getColorToken("component-light-background"),
    "--sens-tabs-badge-active-text": getColorToken("component-primary"),
  } as CSSProperties;
}

interface PillSnapshotStyle {
  itemStyle?: CSSProperties;
  labelStyle?: CSSProperties;
  badgeStyle?: CSSProperties;
  badgeTextStyle?: CSSProperties;
}

function getPillTrackSnapshotStyle(size: SensTabSize, styleToken: PreviewStyleToken): CSSProperties {
  return {
    backgroundColor: styleToken.pillTrackBg,
    padding: `${getUnitToken("spacing/1x")}px`,
    borderRadius: `${size === "small" ? 5 : getUnitToken("radius/l")}px`,
  };
}

function getPillSnapshotStyle(state: BasicPreviewState, styleToken: PreviewStyleToken): PillSnapshotStyle {
  const selected = state === "active" || state === "activeHover";
  const selectedOrInteractive = state === "hover" || state === "click" || selected;
  const disabled = state === "disabled";
  const disabledHover = state === "disabledHover";

  const labelStyle: CSSProperties = {
    color: styleToken.text,
    fontWeight: selected ? 500 : 400,
  };

  if (selected) {
    labelStyle.color = state === "activeHover" ? styleToken.primaryHover : styleToken.primary;
  } else if (state === "hover") {
    labelStyle.color = styleToken.primary;
  } else if (state === "click") {
    labelStyle.color = styleToken.primaryActive;
  } else if (disabled) {
    labelStyle.color = styleToken.textDisabled;
  } else if (disabledHover) {
    labelStyle.color = styleToken.textDisabledHover;
  }

  return {
    itemStyle: selected
      ? {
          backgroundColor: styleToken.bgContainer,
          boxShadow: styleToken.selectedShadow,
        }
      : {
          backgroundColor: disabled || disabledHover ? styleToken.pillDisabledBg : styleToken.pillBg,
        },
    labelStyle,
    badgeStyle: {
      backgroundColor: selectedOrInteractive ? styleToken.badgeActiveBg : styleToken.badgeBg,
    },
    badgeTextStyle: {
      color:
        disabled || disabledHover
          ? disabledHover
            ? styleToken.textDisabledHover
            : styleToken.textDisabled
          : selectedOrInteractive
            ? styleToken.badgeActiveText
            : styleToken.badgeText,
    },
  };
}

function useDemoTabLabels(): string[] {
  const { t } = useTranslation();
  return [
    t(`${I18N_NS}.sensd-tabs-demoLabel1`, { defaultValue: "标签一" }),
    t(`${I18N_NS}.sensd-tabs-demoLabel2`, { defaultValue: "标签二" }),
    t(`${I18N_NS}.sensd-tabs-demoLabel3`, { defaultValue: "标签三" }),
    t(`${I18N_NS}.sensd-tabs-demoLabel4`, { defaultValue: "标签四" }),
    t(`${I18N_NS}.sensd-tabs-demoLabelLong`, { defaultValue: "超长标签页名称演示" }),
  ];
}

interface BasicTabsProps {
  size?: SensTabSize;
  withBadge?: boolean;
}

export interface SensLineTabItem {
  key: string;
  label: ReactNode;
  badgeCount?: number;
  children?: ReactNode;
}

export interface SensLineTabsProps {
  items: SensLineTabItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
  size?: SensTabSize;
  /** 仅渲染标签栏，不展示 antd Tabs 内容区（页面自管内容时用） */
  barOnly?: boolean;
  className?: string;
}

function renderLineTabLabel(label: ReactNode, badgeCount: number | undefined, active: boolean): ReactNode {
  if (badgeCount == null) return label;
  return (
    <span className="sens-tabs-label-with-badge">
      <span>{label}</span>
      <SensBadge variant="weakCount" count={badgeCount} weakState={active ? "active" : "default"} />
    </span>
  );
}

/** 基础标签页（业务可配置）：antd Tabs(line) + 可选弱化数字徽标。 */
export function SensLineTabs({
  items,
  activeKey,
  defaultActiveKey,
  onChange,
  size = "large",
  barOnly = false,
  className,
}: SensLineTabsProps) {
  const [internalKey, setInternalKey] = useState(defaultActiveKey ?? items[0]?.key ?? "");
  const currentKey = activeKey ?? internalKey;

  const tabItems: TabsProps["items"] = useMemo(
    () =>
      items.map((item) => ({
        key: item.key,
        label: renderLineTabLabel(item.label, item.badgeCount, item.key === currentKey),
        children: item.children ?? null,
      })),
    [items, currentKey],
  );

  return (
    <Tabs
      className={[
        "sens-basic-tabs",
        size === "small" ? "sens-basic-tabs-small" : "sens-basic-tabs-large",
        barOnly ? "sens-line-tabs-bar-only" : null,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={getBasicTabsVars()}
      items={tabItems}
      activeKey={currentKey}
      onChange={(key) => {
        if (activeKey == null) setInternalKey(key);
        onChange?.(key);
      }}
      size={size === "small" ? "small" : "middle"}
    />
  );
}

export interface SensPillTabsProps {
  size?: SensTabSize;
  withBadge?: boolean;
  itemCount?: number;
  disabledLastItem?: boolean;
}

/** 基础标签页：antd Tabs(line)。 */
export function SensBasicTabs({ size = "large", withBadge = false }: BasicTabsProps) {
  const labels = useDemoTabLabels();
  const [activeKey, setActiveKey] = useState("1");
  const items: TabsProps["items"] = useMemo(
    () =>
      labels.map((label, idx) => ({
        key: String(idx + 1),
        label: withBadge && idx === 1 ? withOptionalBadge(ellipsisLabel(label), true) : ellipsisLabel(label),
        children: label,
      })),
    [labels, withBadge],
  );

  return (
    <Tabs
      className={["sens-basic-tabs", size === "small" ? "sens-basic-tabs-small" : "sens-basic-tabs-large"].join(" ")}
      style={getBasicTabsVars()}
      items={items}
      activeKey={activeKey}
      onChange={setActiveKey}
      size={size === "small" ? "small" : "middle"}
    />
  );
}

interface EditableTabItem {
  key: string;
  title: string;
}

export interface SensEditableCardTabsProps {
  initialItems?: EditableTabItem[];
  defaultActiveKey?: string;
  defaultMoreOpen?: boolean;
}

function commitTabTitle(
  key: string,
  nextTitle: string,
  fallback: string,
  setItems: Dispatch<SetStateAction<EditableTabItem[]>>,
  setEditingKey: Dispatch<SetStateAction<string | null>>,
) {
  const trimmed = nextTitle.trim() || fallback;
  setItems((prev) => prev.map((item) => (item.key === key ? { ...item, title: trimmed } : item)));
  setEditingKey(null);
}

function CardTabsMoreIcon({ open }: { open: boolean }) {
  return (
    <span
      className={["sens-card-tabs-more-icons", open ? "sens-card-tabs-more-icons--open" : ""].filter(Boolean).join(" ")}
      aria-hidden
    >
      {/* Figma 804:78 down · 804:79 up；开菜单必须朝上（不依赖 rc-tabs 内部 aria-expanded） */}
      <SensIcon
        name={open ? "chevron-up" : "chevron-down"}
        sizeToken="size/icon/m"
        colorRole="inherit"
        className={open ? "sens-card-tabs-more-up" : "sens-card-tabs-more-down"}
      />
    </span>
  );
}

const CARD_TAB_DRAG_THRESHOLD_PX = 8;
/** 指针越过邻页中线后再多走一点才换位，避免贴边抖动 */
const CARD_TAB_SWAP_HYSTERESIS_PX = 6;
const CARD_TAB_PRE_EDIT_DELAY_MS = 450;

function moveItemByKey(items: EditableTabItem[], key: string, toIndex: number): EditableTabItem[] {
  const from = items.findIndex((item) => item.key === key);
  if (from < 0 || toIndex < 0 || toIndex >= items.length || from === toIndex) return items;
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

function clearCardTabDragStyles(root: ParentNode | null) {
  root?.querySelectorAll<HTMLElement>(".ant-tabs-tab").forEach((tab) => {
    tab.style.transform = "";
    tab.style.zIndex = "";
    tab.style.transition = "";
    tab.classList.remove("sens-card-tab--dragging");
  });
}

function isTextEntryTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target.isContentEditable
  );
}

type CardTabDragSession = {
  key: string;
  pointerId: number;
  startX: number;
  started: boolean;
  tabEl: HTMLElement | null;
};

/** 页签标签页：editable-card 增删；双击标题进入编辑中；Pointer 拖拽排序（半宽换位）。 */
export function SensEditableCardTabs({
  initialItems,
  defaultActiveKey,
  defaultMoreOpen = false,
}: SensEditableCardTabsProps = {}) {
  const { t } = useTranslation();
  const dropdownMenuStyle = useSensDropdownMenuStyle();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const fallbackItems = useMemo<EditableTabItem[]>(
    () => [
      { key: "1", title: t(`${I18N_NS}.sensd-tabs-demoLabel1`, { defaultValue: "标签一" }) },
      { key: "2", title: t(`${I18N_NS}.sensd-tabs-demoLabel2`, { defaultValue: "标签二" }) },
      { key: "3", title: t(`${I18N_NS}.sensd-tabs-demoLabel3`, { defaultValue: "标签三" }) },
    ],
    [t],
  );
  const seededItems = useMemo(
    () => (initialItems && initialItems.length > 0 ? initialItems : fallbackItems),
    [fallbackItems, initialItems],
  );
  const [items, setItems] = useState<EditableTabItem[]>(() => seededItems);
  const [activeKey, setActiveKey] = useState(() => {
    if (defaultActiveKey && seededItems.some((item) => item.key === defaultActiveKey)) {
      return defaultActiveKey;
    }
    return seededItems[0]?.key ?? "";
  });
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [preEditKey, setPreEditKey] = useState<string | null>(null);
  const [draggingKey, setDraggingKey] = useState<string | null>(null);
  const [tipKey, setTipKey] = useState<string | null>(null);
  /** 进入编辑前锁住标题槽宽度，避免 input 把页签撑宽 */
  const [editSlotWidths, setEditSlotWidths] = useState<Record<string, number>>({});
  const labelRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const dragRef = useRef<CardTabDragSession | null>(null);
  const detachDragListenersRef = useRef<(() => void) | null>(null);
  const preEditTimerRef = useRef<number | null>(null);
  const {
    open: moreOpen,
    popupPosition: morePopupPos,
    setVisible: setMoreVisible,
    close: closeMoreMenu,
  } = useAnchoredOverflowMenu({
    rootRef,
    triggerSelector: ".ant-tabs-nav-more",
    defaultOpen: defaultMoreOpen,
    offset: 4,
    resyncKey: items.length,
    syncExpandedAria: true,
  });

  const tipCurrent = t(`${I18N_NS}.sensd-tabs-tipEditDrag`, {
    defaultValue: "双击编辑/按住拖动排序",
  });
  const tipOther = t(`${I18N_NS}.sensd-tabs-tipDrag`, { defaultValue: "按住拖拽排序" });

  const clearPreEdit = () => {
    if (preEditTimerRef.current != null) {
      window.clearTimeout(preEditTimerRef.current);
      preEditTimerRef.current = null;
    }
    setPreEditKey(null);
  };

  useEffect(() => {
    if (!moreOpen) return;

    const handleOutsidePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      const trigger = rootRef.current?.querySelector<HTMLElement>(".ant-tabs-nav-more");
      const popup = document.querySelector<HTMLElement>(".sens-card-tabs-dropdown");
      if (trigger?.contains(target) || popup?.contains(target)) return;
      closeMoreMenu();
    };

    document.addEventListener("pointerdown", handleOutsidePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointerDown);
    };
  }, [closeMoreMenu, moreOpen]);

  const beginEdit = (key: string) => {
    if (dragRef.current?.started) return;
    const labelEl = labelRefs.current[key];
    const width = labelEl?.getBoundingClientRect().width;
    if (width && width > 0) {
      setEditSlotWidths((prev) => ({ ...prev, [key]: Math.ceil(width) }));
    }
    clearPreEdit();
    closeMoreMenu();
    setTipKey(null);
    setActiveKey(key);
    setEditingKey(null);
    setPreEditKey(key);
    preEditTimerRef.current = window.setTimeout(() => {
      preEditTimerRef.current = null;
      setPreEditKey((prev) => (prev === key ? null : prev));
      setEditingKey(key);
    }, CARD_TAB_PRE_EDIT_DELAY_MS);
  };

  const endDrag = () => {
    detachDragListenersRef.current?.();
    detachDragListenersRef.current = null;
    clearCardTabDragStyles(rootRef.current);
    dragRef.current = null;
    setDraggingKey(null);
  };

  useEffect(() => () => {
    detachDragListenersRef.current?.();
    detachDragListenersRef.current = null;
    if (preEditTimerRef.current != null) {
      window.clearTimeout(preEditTimerRef.current);
      preEditTimerRef.current = null;
    }
  }, []);

  const resolveDragTab = (key: string): HTMLElement | null =>
    rootRef.current?.querySelector<HTMLElement>(`.ant-tabs-tab[data-node-key="${key}"]`) ?? null;

  /** 指针越过邻页中线才换位；换位后归零 transform 并对齐 startX，避免「突然跑掉」 */
  const trySwapByHalfWidth = (key: string, clientX: number): boolean => {
    const list = itemsRef.current;
    const index = list.findIndex((item) => item.key === key);
    if (index < 0) return false;

    if (index < list.length - 1) {
      const nextKey = list[index + 1]?.key;
      if (nextKey) {
        const nextTab = resolveDragTab(nextKey);
        const nextRect = nextTab?.getBoundingClientRect();
        if (nextRect && clientX >= nextRect.left + nextRect.width / 2 + CARD_TAB_SWAP_HYSTERESIS_PX) {
          const next = moveItemByKey(list, key, index + 1);
          itemsRef.current = next;
          setItems(next);
          if (dragRef.current) {
            dragRef.current.startX = clientX;
            dragRef.current.tabEl = null;
          }
          return true;
        }
      }
    }

    if (index > 0) {
      const prevKey = list[index - 1]?.key;
      if (prevKey) {
        const prevTab = resolveDragTab(prevKey);
        const prevRect = prevTab?.getBoundingClientRect();
        if (prevRect && clientX <= prevRect.left + prevRect.width / 2 - CARD_TAB_SWAP_HYSTERESIS_PX) {
          const next = moveItemByKey(list, key, index - 1);
          itemsRef.current = next;
          setItems(next);
          if (dragRef.current) {
            dragRef.current.startX = clientX;
            dragRef.current.tabEl = null;
          }
          return true;
        }
      }
    }

    return false;
  };

  const applyDragVisual = (session: CardTabDragSession, clientX: number) => {
    const swapped = trySwapByHalfWidth(session.key, clientX);
    const tabEl = session.tabEl?.isConnected ? session.tabEl : resolveDragTab(session.key);
    session.tabEl = tabEl;
    if (!tabEl) return;

    tabEl.classList.add("sens-card-tab--dragging");
    tabEl.style.zIndex = "5";
    tabEl.style.transition = "none";

    if (swapped) {
      /* 换序后 DOM 槽位已更新，清偏移对齐指针，防止整页签弹飞 */
      tabEl.style.transform = "";
      return;
    }

    const dx = clientX - session.startX;
    tabEl.style.transform = `translateX(${dx}px)`;
  };

  const onLabelPointerDown = (key: string, event: ReactPointerEvent<HTMLSpanElement>) => {
    if (editingKey || event.button !== 0) return;
    detachDragListenersRef.current?.();

    const tabEl = event.currentTarget.closest(".ant-tabs-tab") as HTMLElement | null;
    dragRef.current = {
      key,
      pointerId: event.pointerId,
      startX: event.clientX,
      started: false,
      tabEl,
    };

    const onMove = (e: PointerEvent) => {
      const session = dragRef.current;
      if (!session || session.pointerId !== e.pointerId) return;
      const dx = e.clientX - session.startX;

      if (!session.started) {
        if (Math.abs(dx) < CARD_TAB_DRAG_THRESHOLD_PX) return;
        session.started = true;
        clearPreEdit();
        setTipKey(null);
        setDraggingKey(session.key);
        setActiveKey(session.key);
        closeMoreMenu();
      }

      applyDragVisual(session, e.clientX);
    };

    const onUp = (e: PointerEvent) => {
      const session = dragRef.current;
      if (!session || session.pointerId !== e.pointerId) return;
      endDrag();
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    document.addEventListener("pointercancel", onUp);
    detachDragListenersRef.current = () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
    };
  };

  const tabItems: TabsProps["items"] = items.map((item) => {
    const slotWidth = editSlotWidths[item.key];
    const isEditing = editingKey === item.key;
    const isPreEdit = preEditKey === item.key;
    const isCurrent = item.key === activeKey;
    const truncated = item.title.length > 8;
    const tipTitle = truncated ? item.title : isCurrent ? tipCurrent : tipOther;
    const displayTitle = truncated ? `${item.title.slice(0, 8)}...` : item.title;
    return {
      key: item.key,
      label: (
        <span
          className="sens-card-tab-label-slot"
          style={isEditing || isPreEdit ? (slotWidth ? { width: slotWidth, minWidth: slotWidth } : undefined) : undefined}
        >
          {isEditing ? (
            <input
              className="sens-card-tab-edit-input"
              autoFocus
              defaultValue={item.title}
              aria-label={t(`${I18N_NS}.sensd-tabs-editTitle`, { defaultValue: "编辑页签标题" })}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onBlur={(e) => {
                const value = e.currentTarget.value;
                const key = item.key;
                const fallback = item.title;
                window.setTimeout(() => {
                  const active = document.activeElement as HTMLElement | null;
                  const tabEl = active?.closest?.(".ant-tabs-tab") as HTMLElement | null;
                  if (tabEl?.dataset.nodeKey === key) {
                    const input = tabEl.querySelector(".sens-card-tab-edit-input") as HTMLInputElement | null;
                    input?.focus();
                    return;
                  }
                  commitTabTitle(key, value, fallback, setItems, setEditingKey);
                }, 0);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitTabTitle(item.key, e.currentTarget.value, item.title, setItems, setEditingKey);
                }
                if (e.key === "Escape") {
                  e.preventDefault();
                  setEditingKey(null);
                }
              }}
            />
          ) : isPreEdit ? (
            <span className="sens-card-tab-title-select">{displayTitle}</span>
          ) : (
            <Tooltip
              title={tipTitle}
              open={draggingKey ? false : tipKey === item.key}
              onOpenChange={(open) => {
                if (draggingKey) return;
                setTipKey(open ? item.key : null);
              }}
            >
              <span
                ref={(node) => {
                  labelRefs.current[item.key] = node;
                }}
                className="sens-card-tab-label"
                onPointerDown={(e) => onLabelPointerDown(item.key, e)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  beginEdit(item.key);
                }}
              >
                {displayTitle}
              </span>
            </Tooltip>
          )}
        </span>
      ),
      children: <div className="sens-card-tabs-panel-body">{item.title}</div>,
    };
  });
  const overflowMenuItems = items.map((item) => ({
    key: item.key,
    label: item.title.length > 8 ? `${item.title.slice(0, 8)}...` : item.title,
  }));
  const selectOverflowItem = (key: string) => {
    clearPreEdit();
    setActiveKey(key);
    setEditingKey((prev) => (prev === key ? prev : null));
    closeMoreMenu();
  };
  const overflowMenu =
    moreOpen && morePopupPos && typeof document !== "undefined"
      ? createPortal(
          <div
            className="sens-dropdown-menu-overlay sens-card-tabs-dropdown"
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
            style={
              {
                ...dropdownMenuStyle,
                zIndex: 1100,
                position: "fixed",
                top: morePopupPos.top,
                right: morePopupPos.right,
                left: "auto",
                "--sens-card-tabs-dropdown-width": "188px",
                "--sens-card-tabs-dropdown-item-color-default": getColorToken("text-color"),
                "--sens-card-tabs-dropdown-item-hover-bg": tokenRgba("background-transparent-grey-hover", 0.06),
                "--sens-card-tabs-dropdown-item-active-bg": tokenRgba("background-01-transparent", 0.08),
                "--sens-card-tabs-dropdown-item-selected-bg": getColorToken("component-active-background"),
                "--sens-card-tabs-dropdown-item-selected-hover-bg": getColorToken("component-active-hover-background"),
                "--sens-card-tabs-dropdown-item-selected-active-bg": getColorToken("component-active-click-background"),
                "--sens-card-tabs-dropdown-item-check-color": getColorToken("icon-color-transparent"),
                "--sens-card-tabs-dropdown-item-selected-font-weight": String(getTypographyToken("font-weight/semibold")),
              } as CSSProperties
            }
          >
            <div className="sens-card-tabs-dropdown-list" role="menu" aria-label="隐藏页签">
              {overflowMenuItems.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  role="menuitemradio"
                  aria-checked={item.key === activeKey}
                  className={[
                    "sens-card-tabs-dropdown-item",
                    item.key === activeKey ? "sens-card-tabs-dropdown-item-selected" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => {
                    selectOverflowItem(item.key);
                  }}
                >
                  <span className="sens-card-tabs-dropdown-item-label">{item.label}</span>
                  {item.key === activeKey ? (
                    <span className="sens-card-tabs-dropdown-item-check" aria-hidden="true">
                      <SelectCheckIcon size={SELECT_CHECK_ICON_SIZE} color="currentColor" />
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>,
          document.body,
        )
      : null;

  const handleRootClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    const target = event.target as Element | null;
    if (!target?.closest(".ant-tabs-nav-more")) return;
    event.preventDefault();
    event.stopPropagation();
    setMoreVisible(!moreOpen);
  };

  const handleRootKeyDownCapture = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if ((event.key !== "Delete" && event.key !== "Backspace") || isTextEntryTarget(event.target)) return;
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div ref={rootRef} onClickCapture={handleRootClickCapture} onKeyDownCapture={handleRootKeyDownCapture}>
      <Tabs
        className={[
          "sens-card-tabs",
          draggingKey ? "sens-card-tabs--dragging" : "",
          moreOpen ? "sens-card-tabs--more-open" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={getCardTabsVars()}
        type="editable-card"
        hideAdd={false}
        addIcon={<SensIcon name="editor-add" sizeToken="size/icon/m" colorRole="inherit" />}
        removeIcon={<SensIcon name="close" sizeToken="size/icon/m" colorRole="inherit" />}
        more={{
          icon: <CardTabsMoreIcon open={moreOpen} />,
          trigger: ["click"],
          placement: "bottomRight",
          visible: false,
          onVisibleChange: () => {},
          getPopupContainer: () => document.body,
          overlayClassName: "sens-card-tabs-dropdown-proxy",
          overlayStyle: {
            display: "none",
          } as CSSProperties,
          mouseEnterDelay: 0,
          mouseLeaveDelay: 0.1,
          overlay: <span />,
        }}
        popupClassName="sens-card-tabs-dropdown-proxy"
        activeKey={activeKey}
        onChange={(key) => {
          clearPreEdit();
          closeMoreMenu();
          setActiveKey(key);
          setEditingKey((prev) => (prev === key ? prev : null));
        }}
        onEdit={(targetKey, action) => {
          if (action === "add") {
            const key = `${Date.now()}`;
            const title = t(`${I18N_NS}.sensd-tabs-newTab`, { defaultValue: "新页签" });
            setItems((prev) => [...prev, { key, title }]);
            clearPreEdit();
            setActiveKey(key);
            setEditingKey(null);
            closeMoreMenu();
            window.requestAnimationFrame(() => {
              (document.activeElement as HTMLElement | null)?.blur?.();
            });
            return;
          }
          if (action === "remove" && items.length > 1 && targetKey) {
            const key = String(targetKey);
            const removeIndex = items.findIndex((item) => item.key === key);
            const next = items.filter((item) => item.key !== key);
            setItems(next);
            clearPreEdit();
            if (editingKey === key) setEditingKey(null);
            closeMoreMenu();
            if (activeKey === key && next.length > 0) {
              const fallback = next[Math.max(0, removeIndex - 1)] ?? next[0];
              setActiveKey(fallback.key);
            }
          }
        }}
        items={tabItems}
      />
      {overflowMenu}
    </div>
  );
}

/** 真实胶囊标签：仅保留交互必需结构样式，不在组件层伪造状态视觉。 */
export function SensPillTabs({ size = "large", withBadge = false, itemCount = 10, disabledLastItem = false }: SensPillTabsProps) {
  const { t } = useTranslation();
  const baseLabel = t(`${I18N_NS}.sensd-tabs-pillTitle`, { defaultValue: "标题" });
  const labels = useMemo(() => Array.from({ length: itemCount }, () => baseLabel), [baseLabel, itemCount]);
  const [value, setValue] = useState(0);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const items = useMemo(
    () =>
      labels.map((text, index) => ({
        key: index,
        disabled: disabledLastItem && index === labels.length - 1,
        content: withBadge ? withOptionalBadge(ellipsisLabel(text, 8), true) : ellipsisLabel(text, 8),
      })),
    [disabledLastItem, labels, withBadge],
  );

  useEffect(() => {
    if (!items.length) return;
    if (value < items.length && !items[value]?.disabled) return;
    const fallback = items.find((item) => !item.disabled)?.key ?? 0;
    if (fallback !== value) setValue(fallback);
  }, [items, value]);

  const moveSelectionTo = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= items.length || items[nextIndex]?.disabled) return;
    setValue(nextIndex);
    window.requestAnimationFrame(() => {
      itemRefs.current[nextIndex]?.focus();
    });
  };

  const findNextEnabled = (startIndex: number, step: 1 | -1): number => {
    if (!items.length) return -1;
    let nextIndex = startIndex;
    for (let count = 0; count < items.length; count += 1) {
      nextIndex = (nextIndex + step + items.length) % items.length;
      if (!items[nextIndex]?.disabled) return nextIndex;
    }
    return -1;
  };

  const findBoundaryEnabled = (fromStart: boolean): number => {
    const ordered = fromStart ? items : [...items].reverse();
    const match = ordered.find((item) => !item.disabled);
    return match?.key ?? -1;
  };

  const handlePillKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = findNextEnabled(index, 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = findNextEnabled(index, -1);
    } else if (event.key === "Home") {
      nextIndex = findBoundaryEnabled(true);
    } else if (event.key === "End") {
      nextIndex = findBoundaryEnabled(false);
    }

    if (nextIndex < 0) return;
    event.preventDefault();
    moveSelectionTo(nextIndex);
  };

  return (
    <div
      className={["sens-pill-tabs", "sens-pill-tabs-strip", size === "small" ? "sens-pill-tabs-small" : "sens-pill-tabs-large"].join(" ")}
      style={getPillStructureVars(size)}
      role="radiogroup"
      aria-label={t(`${I18N_NS}.sensd-tabs-pillGroup`, { defaultValue: "胶囊标签页" })}
    >
      <div className="sens-pill-tabs-track">
        {items.map((item) => {
          const selected = item.key === value;
          return (
            <button
              key={item.key}
              ref={(node) => {
                itemRefs.current[item.key] = node;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={item.disabled}
              tabIndex={selected ? 0 : -1}
              className={["sens-pill-tab", selected ? "sens-pill-tab--active" : ""].filter(Boolean).join(" ")}
              onClick={() => moveSelectionTo(item.key)}
              onKeyDown={(event) => handlePillKeyDown(event, item.key)}
            >
              <span className="sens-tabs-pill-label">{item.content}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface BasicPreviewRowProps {
  title: string;
  size: SensTabSize;
  withBadge: boolean;
  styleToken: PreviewStyleToken;
  tabLabel: string;
}

function BasicPreviewRow({ title, size, withBadge, styleToken, tabLabel }: BasicPreviewRowProps) {
  const states: BasicPreviewState[] = ["default", "hover", "click", "active", "activeHover", "disabled", "disabledHover"];
  const tabSize = size === "small" ? "small" : "middle";

  return (
    <div className="sens-tabs-matrix-row">
      <span className="sens-tabs-matrix-title">{title}</span>
      <div className="sens-tabs-matrix-states">
        {states.map((state) => {
          const isTargetActive = state === "active" || state === "activeHover";
          const labelNode = withOptionalBadge(<span style={getBasicTabLabelStyle(state, isTargetActive, styleToken)}>{tabLabel}</span>, withBadge);
          return (
            <div key={state} className="sens-tabs-matrix-cell">
              <span className="sens-tabs-matrix-label">{BASIC_PREVIEW_STATE_LABELS[state]}</span>
              <div className="sens-tabs-preview">
                <Tabs
                  className={["sens-basic-tabs", size === "small" ? "sens-basic-tabs-small" : "sens-basic-tabs-large"].join(" ")}
                  style={getBasicTabsVars()}
                  size={tabSize}
                  activeKey={isTargetActive ? "target" : "other"}
                  items={[
                    { key: "other", label: ellipsisLabel("标签一"), children: null },
                    { key: "target", label: labelNode, children: null, disabled: state === "disabled" || state === "disabledHover" },
                  ]}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface PillPreviewRowProps {
  title: string;
  size: SensTabSize;
  withBadge: boolean;
  styleToken: PreviewStyleToken;
  tabLabel: string;
}

function PillPreviewRow({ title, size, withBadge, styleToken, tabLabel }: PillPreviewRowProps) {
  const states: BasicPreviewState[] = ["default", "hover", "click", "active", "activeHover", "disabled", "disabledHover"];
  const sizeClass = size === "small" ? "sens-pill-tab-snapshot-small" : "sens-pill-tab-snapshot-large";
  const trackStyle = getPillTrackSnapshotStyle(size, styleToken);

  return (
    <div className="sens-tabs-matrix-row">
      <span className="sens-tabs-matrix-title">{title}</span>
      <div className="sens-tabs-matrix-states">
        {states.map((state) => {
          const snapshotStyle = getPillSnapshotStyle(state, styleToken);
          return (
            <div key={state} className="sens-tabs-matrix-cell">
              <span className="sens-tabs-matrix-label">{BASIC_PREVIEW_STATE_LABELS[state]}</span>
              <div className="sens-tabs-preview sens-tabs-preview-pill" style={trackStyle}>
                <div className={["sens-pill-tab-snapshot", sizeClass].join(" ")} style={snapshotStyle.itemStyle}>
                  <span className="sens-tabs-pill-label" style={snapshotStyle.labelStyle}>
                    {ellipsisLabel(tabLabel, 8)}
                  </span>
                  {withBadge ? (
                    <span className="sens-tabs-counter-badge" style={snapshotStyle.badgeStyle}>
                      <span style={snapshotStyle.badgeTextStyle}>6</span>
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface PillStripFullRowProps {
  title: string;
  size: SensTabSize;
  withBadge: boolean;
  styleToken: PreviewStyleToken;
  itemCount?: number;
}

function PillStripFullRow({ title, size, withBadge, styleToken, itemCount = 10 }: PillStripFullRowProps) {
  const sizeClass = size === "small" ? "sens-pill-tab-snapshot-small" : "sens-pill-tab-snapshot-large";
  const rowSnapshot = getPillSnapshotStyle("default", styleToken);
  const activeSnapshot = getPillSnapshotStyle("active", styleToken);
  const trackStyle = getPillTrackSnapshotStyle(size, styleToken);
  return (
    <div className="sens-tabs-strip-row">
      <span className="sens-tabs-strip-control-label">{title}</span>
      <div className="sens-tabs-strip-track" style={trackStyle}>
        {Array.from({ length: itemCount }, (_, idx) => {
          const style = idx === 0 ? activeSnapshot : rowSnapshot;
          return (
            <div key={idx} className={["sens-pill-tab-snapshot", sizeClass].join(" ")} style={style.itemStyle}>
              <span className="sens-tabs-pill-label" style={style.labelStyle}>
                标题
              </span>
              {withBadge ? (
                <span className="sens-tabs-counter-badge" style={style.badgeStyle}>
                  <span style={style.badgeTextStyle}>6</span>
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface CardPreviewRowProps {
  title: string;
  isCurrent: boolean;
  styleToken: PreviewStyleToken;
  tabLabel: string;
}

function CardPreviewRow({ title, isCurrent, styleToken, tabLabel }: CardPreviewRowProps) {
  const states: CardPreviewState[] = ["default", "hoverTitle", "hoverDelete", "beforeEdit", "editing"];
  const activeKey = isCurrent ? "target" : "other";
  const cardVars = getCardTabsVars();
  const warningRemove = getColorToken("warning-color");

  return (
    <div className="sens-tabs-matrix-row">
      <span className="sens-tabs-matrix-title">{title}</span>
      <div className="sens-tabs-matrix-states">
        {states.map((state) => {
          let titleColor: string | undefined;
          if (isCurrent) {
            if (state === "hoverTitle") titleColor = styleToken.primaryHover;
            else titleColor = styleToken.primary;
          } else {
            if (state === "hoverTitle" || state === "hoverDelete") titleColor = styleToken.primary;
            else titleColor = styleToken.text;
          }
          const titleStyle: CSSProperties | undefined = titleColor ? { color: titleColor } : undefined;
          let label: ReactNode;
          if (state === "beforeEdit") {
            /* Figma 6354:27070 · 编辑前：标题选区 component-primary 底 + white 字 */
            label = <span className="sens-card-tab-title-select">{tabLabel}</span>;
          } else if (state === "editing") {
            /* Figma 6354:27099 · 编辑中：可输入，text-article-color；槽宽锁与文案同宽 */
            label = (
              <span className="sens-card-tab-label-slot" style={{ width: `${tabLabel.length}em` }}>
                <input
                  className="sens-card-tab-edit-input"
                  defaultValue={tabLabel}
                  aria-label={CARD_PREVIEW_STATE_LABELS.editing}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                />
              </span>
            );
          } else {
            label = <span style={titleStyle}>{ellipsisLabel(tabLabel)}</span>;
          }
          const previewClass = [
            "sens-tabs-preview",
            "sens-card-tabs",
            state === "hoverDelete" ? "sens-tabs-preview-card-hover-delete" : "",
            state === "hoverTitle" ? "sens-tabs-preview-card-hover-title" : "",
            state === "default" && !isCurrent ? "sens-tabs-preview-card-default-idle" : "",
            state === "beforeEdit" || state === "editing" ? "sens-tabs-preview-card-editing" : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <div
              key={state}
              className="sens-tabs-matrix-cell"
              style={
                state === "hoverDelete"
                  ? ({ ...cardVars, "--sens-tabs-preview-remove-hover": warningRemove } as CSSProperties)
                  : cardVars
              }
            >
              <span className="sens-tabs-matrix-label">{CARD_PREVIEW_STATE_LABELS[state]}</span>
              <div className={previewClass}>
                <Tabs
                  type="editable-card"
                  hideAdd
                  removeIcon={<SensIcon name="close" sizeToken="size/icon/m" colorRole="inherit" />}
                  more={{
                    icon: <CardTabsMoreIcon open={false} />,
                    trigger: ["click"],
                    placement: "bottomRight",
                    getPopupContainer: () => document.body,
                  }}
                  activeKey={activeKey}
                  items={[
                    { key: "other", label: ellipsisLabel("标签一"), children: null },
                    { key: "target", label, children: null, closable: true },
                  ]}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export interface TabsStatesPreviewProps {
  title?: ReactNode;
}

/** Figma 2220:10665 变体×状态矩阵：上下两区同源快照渲染。 */
export function TabsStatesPreview({ title }: TabsStatesPreviewProps) {
  const { t } = useTranslation();
  const styleToken = getPreviewStyleToken();
  const tabLabel = t(`${I18N_NS}.sensd-tabs-demoLabel2`, { defaultValue: "标签二" });

  const basicVariants = [
    { key: "basic-lg", title: "基础标签页 / 大尺寸 / 无徽标", size: "large" as const, withBadge: false },
    { key: "basic-lg-badge", title: "基础标签页 / 大尺寸 / 徽标", size: "large" as const, withBadge: true },
    { key: "basic-sm", title: "基础标签页 / 小尺寸 / 无徽标", size: "small" as const, withBadge: false },
    { key: "basic-sm-badge", title: "基础标签页 / 小尺寸 / 徽标", size: "small" as const, withBadge: true },
  ];
  const pillVariants = [
    { key: "pill-lg", title: "胶囊标签页 / 大尺寸 / 无徽标", size: "large" as const, withBadge: false },
    { key: "pill-lg-badge", title: "胶囊标签页 / 大尺寸 / 徽标", size: "large" as const, withBadge: true },
    { key: "pill-sm", title: "胶囊标签页 / 小尺寸 / 无徽标", size: "small" as const, withBadge: false },
    { key: "pill-sm-badge", title: "胶囊标签页 / 小尺寸 / 徽标", size: "small" as const, withBadge: true },
  ];
  const stripVariants = [
    { key: "strip-lg", title: "大尺寸 / 无徽标", size: "large" as const, withBadge: false },
    { key: "strip-lg-badge", title: "大尺寸 / 徽标", size: "large" as const, withBadge: true },
    { key: "strip-sm", title: "小尺寸 / 无徽标", size: "small" as const, withBadge: false },
    { key: "strip-sm-badge", title: "小尺寸 / 徽标", size: "small" as const, withBadge: true },
  ];

  return (
    <div className="sens-tabs-matrix" style={useTabsPreviewVars()}>
      {title ? <div className="sens-tabs-matrix-head">{title}</div> : null}

      {basicVariants.map((variant) => (
        <BasicPreviewRow key={variant.key} title={variant.title} size={variant.size} withBadge={variant.withBadge} styleToken={styleToken} tabLabel={tabLabel} />
      ))}

      <CardPreviewRow title="页签标签页 / 当前项=False" isCurrent={false} styleToken={styleToken} tabLabel={tabLabel} />
      <CardPreviewRow title="页签标签页 / 当前项=True" isCurrent styleToken={styleToken} tabLabel={tabLabel} />

      {pillVariants.map((variant) => (
        <PillPreviewRow key={variant.key} title={variant.title} size={variant.size} withBadge={variant.withBadge} styleToken={styleToken} tabLabel={tabLabel} />
      ))}

      <div className="sens-tabs-strip-section">
        <span className="sens-tabs-matrix-title">胶囊标签页（完整状态）</span>
        <div className="sens-tabs-strip-panel" style={{ borderColor: styleToken.stripPanelBorder }}>
          {stripVariants.map((variant) => (
            <PillStripFullRow
              key={variant.key}
              title={variant.title}
              size={variant.size}
              withBadge={variant.withBadge}
              styleToken={styleToken}
              itemCount={10}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
