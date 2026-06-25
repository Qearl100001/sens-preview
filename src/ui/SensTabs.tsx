import type { CSSProperties, ReactNode } from "react";
import { useMemo, useState } from "react";
import { Input, Segmented, Tabs, Tooltip, theme, type TabsProps } from "antd";
import type { SegmentedValue } from "antd/es/segmented";
import { useTranslation } from "react-i18next";
import { buildAntdTheme } from "../design-system/theme";
import tokens from "../design-system/tokens.resolved.json";
import "./tabs.css";

const c = tokens.color as Record<string, string>;
const u = tokens.unit as Record<string, number>;
const I18N_NS = "组件库";

const themeComponents = (buildAntdTheme().components ?? {}) as Record<string, Record<string, unknown>>;
const tabsComponentToken = themeComponents.Tabs ?? {};
const segmentedComponentToken = themeComponents.Segmented ?? {};

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
  selectedShadow: string;
  iconHover: string;
  badgeBg: string;
  badgeText: string;
  badgeActiveBg: string;
  badgeActiveText: string;
  stripPanelBorder: string;
}

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  const full = normalized.length === 3 ? normalized.split("").map((ch) => ch + ch).join("") : normalized;
  const int = Number.parseInt(full, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function num(v: unknown, fallback: number): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

function str(v: unknown, fallback: string): string {
  return typeof v === "string" && v.length > 0 ? v : fallback;
}

function getPreviewStyleToken(antdToken: ReturnType<typeof theme.useToken>["token"]): PreviewStyleToken {
  return {
    primary: str(segmentedComponentToken.itemSelectedColor, antdToken.colorPrimary),
    primaryHover: str(segmentedComponentToken.itemHoverColor, antdToken.colorPrimaryHover),
    primaryActive: str(segmentedComponentToken.itemActiveColor, antdToken.colorPrimaryActive),
    text: str(segmentedComponentToken.itemColor, antdToken.colorText),
    textDisabled: str(segmentedComponentToken.itemDisabledColor, hexToRgba(c["text-color-transparent-disable"], 0.3)),
    textDisabledHover: str(
      segmentedComponentToken.itemDisabledHoverColor,
      hexToRgba(c["text-color-transparent-disable-hover"], 0.24),
    ),
    bgContainer: str(segmentedComponentToken.itemSelectedBg, c.white),
    selectedShadow: str(
      segmentedComponentToken.itemSelectedShadow,
      "0 0 1px 0 rgba(11, 12, 13, 0.2), 0 1px 2px 0 rgba(11, 12, 13, 0.1)",
    ),
    iconHover: antdToken.colorIconHover,
    badgeBg: str(segmentedComponentToken.badgeBg, hexToRgba(c["background-transparent-grey"], 0.08)),
    badgeText: str(segmentedComponentToken.badgeText, hexToRgba(c["text-color-transparent"], 0.58)),
    badgeActiveBg: str(segmentedComponentToken.badgeActiveBg, c["component-light-background"]),
    badgeActiveText: str(segmentedComponentToken.badgeActiveText, antdToken.colorPrimary),
    stripPanelBorder: hexToRgba(c["outline-color-transparent"], 0.35),
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
    "--sens-pill-track-padding": `${num(segmentedComponentToken.trackPadding, u["spacing/1x"])}px`,
    "--sens-pill-item-gap": `${num(segmentedComponentToken.itemGap, u["spacing/1x"])}px`,
    "--sens-pill-item-radius": `${num(
      isSmall ? segmentedComponentToken.itemBorderRadiusSM : segmentedComponentToken.itemBorderRadius,
      isSmall ? u["radius/s"] : u["radius/m"],
    )}px`,
    "--sens-pill-item-padding-inline": `${num(
      isSmall ? segmentedComponentToken.itemPaddingInlineSM : segmentedComponentToken.itemPaddingInline,
      isSmall ? u["spacing/horizontal/2․5x"] : u["spacing/horizontal/3x"],
    )}px`,
    "--sens-pill-item-font-size": `${num(
      isSmall ? segmentedComponentToken.itemFontSizeSM : segmentedComponentToken.itemFontSize,
      isSmall ? 12 : 14,
    )}px`,
    "--sens-pill-item-line-height": `${num(
      isSmall ? segmentedComponentToken.itemLineHeightSM : segmentedComponentToken.itemLineHeight,
      isSmall ? 18 : 22,
    )}px`,
    "--sens-pill-item-min-height": `${isSmall ? 24 : 28}px`,
    "--sens-tabs-badge-bg": str(segmentedComponentToken.badgeBg, hexToRgba(c["background-transparent-grey"], 0.08)),
    "--sens-tabs-badge-text": str(segmentedComponentToken.badgeText, hexToRgba(c["text-color-transparent"], 0.58)),
    "--sens-tabs-badge-active-bg": str(segmentedComponentToken.badgeActiveBg, c["component-light-background"]),
    "--sens-tabs-badge-active-text": str(segmentedComponentToken.badgeActiveText, c["component-primary"]),
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
  if (state === "disabled" || state === "disabledHover") {
    return { color: styleToken.textDisabled };
  }
  if (state === "hover") return { color: styleToken.primaryHover };
  if (state === "click") return { color: styleToken.primaryActive };
  if (state === "active") return { color: styleToken.primary };
  if (state === "activeHover") return { color: styleToken.primaryHover };
  return { color: isActive ? styleToken.primary : styleToken.text };
}

interface PillSnapshotStyle {
  itemStyle?: CSSProperties;
  labelStyle?: CSSProperties;
  badgeStyle?: CSSProperties;
  badgeTextStyle?: CSSProperties;
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
      : undefined,
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

/** 页签标签页：editable-card 增删。 */
export function SensEditableCardTabs() {
  const { t } = useTranslation();
  const [items, setItems] = useState<EditableTabItem[]>([
    { key: "1", title: t(`${I18N_NS}.sensd-tabs-demoLabel1`, { defaultValue: "标签一" }) },
    { key: "2", title: t(`${I18N_NS}.sensd-tabs-demoLabel2`, { defaultValue: "标签二" }) },
    { key: "3", title: t(`${I18N_NS}.sensd-tabs-demoLabel3`, { defaultValue: "标签三" }) },
  ]);
  const [activeKey, setActiveKey] = useState("1");

  const tabItems: TabsProps["items"] = items.map((item) => ({
    key: item.key,
    label: ellipsisLabel(item.title),
    children: item.title,
  }));

  return (
    <Tabs
      type="editable-card"
      hideAdd={false}
      activeKey={activeKey}
      onChange={setActiveKey}
      onEdit={(targetKey, action) => {
        if (action === "add") {
          const key = `${Date.now()}`;
          setItems((prev) => [...prev, { key, title: t(`${I18N_NS}.sensd-tabs-addTab`, { defaultValue: "添加页签" }) }]);
          setActiveKey(key);
          return;
        }
        if (action === "remove" && items.length > 1 && targetKey) {
          const next = items.filter((item) => item.key !== targetKey);
          setItems(next);
          if (activeKey === targetKey && next[0]) setActiveKey(next[0].key);
        }
      }}
      items={tabItems}
    />
  );
}

/** 真实胶囊标签：仅保留交互必需结构样式，不在组件层伪造状态视觉。 */
export function SensPillTabs({ size = "large", withBadge = false, itemCount = 10, disabledLastItem = false }: SensPillTabsProps) {
  const { t } = useTranslation();
  const baseLabel = t(`${I18N_NS}.sensd-tabs-pillTitle`, { defaultValue: "标题" });
  const labels = useMemo(() => Array.from({ length: itemCount }, () => baseLabel), [baseLabel, itemCount]);
  const [value, setValue] = useState<SegmentedValue>(0);
  return (
    <Segmented
      className={["sens-pill-tabs", "sens-pill-tabs-strip", size === "small" ? "sens-pill-tabs-small" : "sens-pill-tabs-large"].join(" ")}
      style={getPillStructureVars(size)}
      size={size === "small" ? "small" : "middle"}
      value={value}
      onChange={setValue}
      options={labels.map((text, index) => ({
        label: <span className="sens-tabs-pill-label">{withBadge ? withOptionalBadge(ellipsisLabel(text, 8), true) : ellipsisLabel(text, 8)}</span>,
        value: index,
        disabled: disabledLastItem && index === labels.length - 1,
      }))}
    />
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

  return (
    <div className="sens-tabs-matrix-row">
      <span className="sens-tabs-matrix-title">{title}</span>
      <div className="sens-tabs-matrix-states">
        {states.map((state) => {
          const snapshotStyle = getPillSnapshotStyle(state, styleToken);
          return (
            <div key={state} className="sens-tabs-matrix-cell">
              <span className="sens-tabs-matrix-label">{BASIC_PREVIEW_STATE_LABELS[state]}</span>
              <div className="sens-tabs-preview sens-tabs-preview-pill">
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
  return (
    <div className="sens-tabs-strip-row">
      <span className="sens-tabs-strip-control-label">{title}</span>
      <div className="sens-tabs-strip-track">
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

  return (
    <div className="sens-tabs-matrix-row">
      <span className="sens-tabs-matrix-title">{title}</span>
      <div className="sens-tabs-matrix-states">
        {states.map((state) => {
          const titleStyle: CSSProperties | undefined =
            state === "hoverTitle" ? { color: styleToken.primaryHover } : state === "beforeEdit" ? { color: styleToken.text } : undefined;
          const label = state === "editing" ? <Input size="small" defaultValue={tabLabel} /> : <span style={titleStyle}>{ellipsisLabel(tabLabel)}</span>;
          const previewClass = state === "hoverDelete" ? "sens-tabs-preview sens-tabs-preview-card-hover-delete" : "sens-tabs-preview";
          return (
            <div
              key={state}
              className="sens-tabs-matrix-cell"
              style={state === "hoverDelete" ? ({ "--sens-tabs-preview-remove-hover": styleToken.iconHover } as CSSProperties) : undefined}
            >
              <span className="sens-tabs-matrix-label">{CARD_PREVIEW_STATE_LABELS[state]}</span>
              <div className={previewClass}>
                <Tabs
                  type="editable-card"
                  hideAdd
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
  const { token } = theme.useToken();
  const { t } = useTranslation();
  const styleToken = getPreviewStyleToken(token);
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
