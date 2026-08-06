import { useState, type CSSProperties, type MouseEventHandler, type ReactNode } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { buildShadowD4 } from "../design-system/color-utils";
import tokens from "../design-system/tokens.resolved.json";
import { formatButtonText } from "./SensButton";
import { IconDefaultIcon } from "./FieldIcons";
import {
  FAB_GROUP_PADDING_INNER,
  FAB_GROUP_PADDING_OUTER,
  FAB_ICON_SIZE_PX,
  FAB_RADIUS,
  FAB_PREVIEW_STATE_COLOR,
  fabColorTokens as c,
  fabUnitTokens as u,
  getFabGroupSegmentBorderRadius,
  getFabGroupSegmentCrossAxisStyle,
  getFabGroupSegmentPaddingStyle,
  getFabGroupSegmentPosition,
  getFabGroupSegmentPreviewStyle,
  getFabCssVars,
  getFabPrimaryBorderStyle,
  getFabSecondaryCssVars,
  getFabSnapshotStyleForState,
  getFabVerticalGroupSegmentBaseStyle,
  getFabVerticalGroupSegmentPreviewStyle,
  getFabVerticalIconColor,
  getFabVerticalIconCssVars,
  type FabPreviewState,
  type FabStyleToken,
  type FabTone,
  type FabVerticalPreviewState,
} from "./fabShared";
import "./fab-group.css";
import { functionalCssVar } from "../design-system/functional-skin";

export interface SensFabGroupItem {
  label?: ReactNode;
  icon?: ReactNode;
  /** 纯图标段的可访问名称；未提供可见 label 时必须提供。 */
  ariaLabel?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  loading?: boolean;
}

export interface SensFabVerticalGroupItem {
  icon: ReactNode;
  /** 竖向纯图标段的可访问名称。 */
  ariaLabel?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export type SensFabGroupProps =
  | {
      direction?: "horizontal";
      tone: FabTone;
      items: SensFabGroupItem[];
      className?: string;
      style?: CSSProperties;
    }
  | {
      direction: "vertical";
      items: SensFabVerticalGroupItem[];
      className?: string;
      style?: CSSProperties;
    };

interface FabVerticalGroupSegmentProps {
  item: SensFabVerticalGroupItem;
  index: number;
  count: number;
}

function FabVerticalGroupSegment({ item, index, count }: FabVerticalGroupSegmentProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const position = getFabGroupSegmentPosition(index, count);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
  };

  const segmentStyle: CSSProperties = {
    ...getFabVerticalGroupSegmentBaseStyle(index, count),
    color: getFabVerticalIconColor(isHovered, isPressed),
  };

  return (
    <span
      className="sens-fab-group-segment-wrap"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseOver={() => setIsHovered(true)}
    >
      <button
        type="button"
        aria-label={item.ariaLabel}
        onClick={item.onClick}
        className={buildFabGroupSegmentClassName("secondary", position, "sens-fab-group-segment--vertical")}
        style={segmentStyle}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onBlur={() => setIsPressed(false)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") setIsPressed(true);
        }}
        onKeyUp={(event) => {
          if (event.key === "Enter" || event.key === " ") setIsPressed(false);
        }}
      >
        {renderFabGroupSegmentIcon(item.icon)}
      </button>
    </span>
  );
}

function buildFabGroupSegmentClassName(
  tone: FabTone,
  position: ReturnType<typeof getFabGroupSegmentPosition>,
  extraClassName?: string,
) {
  return [
    "sens-fab-group-segment",
    `sens-fab-group-segment--${tone}`,
    `sens-fab-group-segment--${position}`,
    extraClassName,
  ]
    .filter(Boolean)
    .join(" ");
}

function renderFabGroupSegmentIcon(icon?: ReactNode) {
  if (!icon) return null;
  return <span className="sens-fab-group-segment-icon">{icon}</span>;
}

function getFabLiveSegmentState(isLoading: boolean, isDisabled: boolean, isPressed: boolean, isHovered: boolean) {
  if (isLoading) return "loading";
  if (isDisabled) return "disabled";
  if (isPressed) return "active";
  if (isHovered) return "hover";
  return "default";
}

function renderFabGroupCountWarning(count: number) {
  if (count < 2 || count > 3) {
    if (import.meta.env.DEV) {
      console.warn(`[SensFabGroup] items.length must be 2 or 3, got ${count}`);
    }
    return true;
  }
  return false;
}

/** 组合悬浮按钮：横向 2~3 段胶囊 / 竖向 2~3 纯图标段；整组一层 D4，分段独立可点。 */
export function SensFabGroup(props: SensFabGroupProps) {
  const count = props.items.length;
  if (renderFabGroupCountWarning(count)) return null;

  if (props.direction === "vertical") {
    const { items, className, style } = props;
    const groupClassName = ["sens-fab-group", "sens-fab-group--vertical", className].filter(Boolean).join(" ");

    return (
      <div
        className={groupClassName}
        style={{
          borderRadius: FAB_RADIUS,
          boxShadow: buildShadowD4(),
          ...getFabCssVars(),
          ...getFabVerticalIconCssVars(),
          ...style,
        }}
      >
        {items.map((item, index) => (
          <FabVerticalGroupSegment key={index} item={item} index={index} count={count} />
        ))}
      </div>
    );
  }

  const { tone, items, className, style } = props;
  const groupClassName = ["sens-fab-group", "sens-fab-group--horizontal", `sens-fab-group--${tone}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={groupClassName}
      style={{
        borderRadius: FAB_RADIUS,
        boxShadow: buildShadowD4(),
        ...getFabCssVars(),
        ...style,
      }}
    >
      {items.map((item, index) => (
        <FabGroupSegment key={index} tone={tone} item={item} index={index} count={count} />
      ))}
    </div>
  );
}

function fabVerticalPreviewIcon() {
  return <IconDefaultIcon size={FAB_ICON_SIZE_PX} />;
}

interface FabGroupSegmentProps {
  tone: FabTone;
  item: SensFabGroupItem;
  index: number;
  count: number;
}

function FabGroupSegment({ tone, item, index, count }: FabGroupSegmentProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const isLoading = !!item.loading;
  const isDisabled = item.disabled || isLoading;
  const position = getFabGroupSegmentPosition(index, count);
  const borderRadius = getFabGroupSegmentBorderRadius("horizontal", index, count);
  const hasIcon = Boolean(item.icon) || isLoading;
  const cellContent = formatButtonText(item.label, { tone, hasIcon });
  const liveState = getFabLiveSegmentState(isLoading, !!item.disabled, isPressed, isHovered);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
  };

  const segmentStyle: CSSProperties = {
    boxShadow: "none",
    borderRadius,
    ...getFabSnapshotStyleForState(tone, liveState, toFabStyleToken()),
    ...getFabGroupSegmentCrossAxisStyle("horizontal", cellContent, item.icon, isLoading),
    ...getFabGroupSegmentPaddingStyle("horizontal", index, count, cellContent, item.icon, isLoading),
    ...(tone === "primary" ? getFabPrimaryBorderStyle() : {}),
    ...(tone === "secondary"
      ? {
          ...getFabSecondaryCssVars(),
          backgroundColor: c.white,
          color: FAB_PREVIEW_STATE_COLOR[liveState],
        }
      : {}),
  };

  const buttonNode = (
    <button
      type="button"
      aria-label={item.ariaLabel}
      disabled={isDisabled}
      aria-busy={isLoading ? true : undefined}
      onClick={item.onClick}
      className={buildFabGroupSegmentClassName(tone, position)}
      style={segmentStyle}
      onMouseEnter={tone === "secondary" ? undefined : handleMouseEnter}
      onMouseLeave={tone === "secondary" ? undefined : handleMouseLeave}
      onMouseDown={tone === "secondary" ? undefined : () => setIsPressed(true)}
      onMouseUp={tone === "secondary" ? undefined : () => setIsPressed(false)}
      onBlur={() => setIsPressed(false)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") setIsPressed(true);
      }}
      onKeyUp={(event) => {
        if (event.key === "Enter" || event.key === " ") setIsPressed(false);
      }}
    >
      {renderFabGroupSegmentIcon(isLoading ? <LoadingOutlined spin /> : item.icon)}
      {cellContent}
    </button>
  );

  if (tone === "secondary") {
    return (
      <span
        className="sens-fab-group-segment-wrap"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseOver={() => setIsHovered(true)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
      >
        {buttonNode}
      </span>
    );
  }

  return buttonNode;
}

function toFabStyleToken(): FabStyleToken {
  function hexToRgba(hex: string, alpha: number): string {
    const normalized = hex.replace("#", "");
    const full = normalized.length === 3 ? normalized.split("").map((ch) => ch + ch).join("") : normalized;
    const int = Number.parseInt(full, 16);
    const r = (int >> 16) & 255;
    const g = (int >> 8) & 255;
    const b = int & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return {
    primary: functionalCssVar("--sens-skin-primary", "component-primary"),
    primaryHover: functionalCssVar("--sens-skin-hover", "component-hover"),
    primaryActive: functionalCssVar("--sens-skin-active", "component-active"),
    bgContainer: c.white,
    disabledBg: hexToRgba(c["outline-color-transparent"], 0.06),
    disabledBorder: hexToRgba(c["outline-color-transparent"], 0.08),
    disabledText: hexToRgba(c["text-color-transparent-disable"], 0.3),
    disabledHoverBg: hexToRgba(c["background-transparent-grey"], 0.04),
    disabledHoverBorder: hexToRgba(c["outline-color-transparent"], 0.06),
    disabledHoverText: hexToRgba(c["text-color-transparent-disable"], 0.24),
  };
}

interface FabGroupPreviewSegmentProps {
  tone: FabTone;
  state: FabPreviewState;
  index: number;
  count: number;
  label: ReactNode;
  icon?: ReactNode;
  styleToken: FabStyleToken;
}

function FabGroupPreviewSegment({
  tone,
  state,
  index,
  count,
  label,
  icon,
  styleToken,
}: FabGroupPreviewSegmentProps) {
  const position = getFabGroupSegmentPosition(index, count);
  const hasIcon = Boolean(icon);
  const cellContent = formatButtonText(label, { tone, hasIcon });
  const isLoadingState = state === "loading" || state === "loadingHover";
  const previewContent = isLoadingState ? null : label;

  return (
    <button
      type="button"
      disabled={state === "disabled" || state === "disabledHover" || isLoadingState}
      aria-busy={isLoadingState ? true : undefined}
      aria-label={label == null ? `FAB ${tone === "primary" ? "一级" : "二级"} 第${index + 1}段` : undefined}
      className={buildFabGroupSegmentClassName(tone, position)}
      style={{
        ...(tone === "secondary" ? getFabSecondaryCssVars() : {}),
        ...getFabGroupSegmentPreviewStyle(
          tone,
          state,
          index,
          count,
          styleToken,
          previewContent,
          isLoadingState ? <LoadingOutlined spin /> : icon,
          isLoadingState,
        ),
        ...(tone === "secondary" ? { color: FAB_PREVIEW_STATE_COLOR[state] } : {}),
      }}
    >
      {renderFabGroupSegmentIcon(isLoadingState ? <LoadingOutlined spin /> : icon)}
      {cellContent}
    </button>
  );
}

interface FabGroupPreviewProps {
  tone: FabTone;
  count: 2 | 3;
  contentType: "text" | "iconText" | "icon";
  state?: FabPreviewState;
  segmentStates?: FabPreviewState[];
  buttonLabel: string;
}

function FabGroupPreview({
  tone,
  count,
  contentType,
  state = "default",
  segmentStates,
  buttonLabel,
}: FabGroupPreviewProps) {
  const styleToken = toFabStyleToken();
  const labels = Array.from({ length: count }, () => buttonLabel);
  const icons =
    contentType === "icon" || contentType === "iconText"
      ? Array.from({ length: count }, () => <IconDefaultIcon />)
      : undefined;

  return (
    <div
      className={["sens-fab-group", "sens-fab-group--horizontal", `sens-fab-group--${tone}`, "sens-fab-group--preview"].join(" ")}
      style={{ borderRadius: FAB_RADIUS, boxShadow: buildShadowD4(), ...getFabCssVars() }}
    >
      {labels.map((label, index) => {
        const segmentState = segmentStates?.[index] ?? state;
        const icon = icons?.[index];
        const resolvedLabel = contentType === "icon" ? null : label;
        return (
          <FabGroupPreviewSegment
            key={index}
            tone={tone}
            state={segmentState}
            index={index}
            count={count}
            label={resolvedLabel}
            icon={icon}
            styleToken={styleToken}
          />
        );
      })}
    </div>
  );
}

interface FabVerticalGroupPreviewSegmentProps {
  state: FabVerticalPreviewState;
  index: number;
  count: number;
}

function FabVerticalGroupPreviewSegment({ state, index, count }: FabVerticalGroupPreviewSegmentProps) {
  const position = getFabGroupSegmentPosition(index, count);

  return (
    <button
      type="button"
      aria-label={`竖向 FAB 第${index + 1}段`}
      className={buildFabGroupSegmentClassName("secondary", position, "sens-fab-group-segment--vertical")}
      style={getFabVerticalGroupSegmentPreviewStyle(state, index, count)}
    >
      {renderFabGroupSegmentIcon(fabVerticalPreviewIcon())}
    </button>
  );
}

interface FabVerticalGroupPreviewProps {
  count: 2 | 3;
  segmentStates?: FabVerticalPreviewState[];
}

function FabVerticalGroupPreview({ count, segmentStates }: FabVerticalGroupPreviewProps) {
  return (
    <div
      className={["sens-fab-group", "sens-fab-group--vertical", "sens-fab-group--preview"].join(" ")}
      style={{
        borderRadius: FAB_RADIUS,
        boxShadow: buildShadowD4(),
        ...getFabCssVars(),
        ...getFabVerticalIconCssVars(),
      }}
    >
      {Array.from({ length: count }, (_, index) => (
        <FabVerticalGroupPreviewSegment
          key={index}
          state={segmentStates?.[index] ?? "default"}
          index={index}
          count={count}
        />
      ))}
    </div>
  );
}

export interface FabVerticalGroupStatesPreviewProps {
  title?: ReactNode;
}

export function FabVerticalGroupStatesPreview({ title }: FabVerticalGroupStatesPreviewProps) {
  const { t } = useTranslation();
  const I18N_NS = "组件库";
  const label = (key: string, defaultValue: string) => t(`${I18N_NS}.${key}`, { defaultValue });

  return (
    <div
      id="sens-fab-vertical-group-preview"
      className="sens-fab-group-section sens-fab-vertical-group-section"
      style={
        {
          "--sens-fab-group-space-5x": `${u["spacing/5x"]}px`,
          "--sens-fab-group-space-6x": `${u["spacing/6x"]}px`,
          ...getFabCssVars(),
          ...getFabVerticalIconCssVars(),
        } as CSSProperties
      }
    >
      {title ? <div className="sens-fab-group-section-head">{title}</div> : null}
      <span className="sens-fab-group-section-title">
        {label("sensd-button-group-fab-vertical-group", "竖向组合 FAB")}
      </span>
      <div className="sens-fab-group-preview-row">
        <div className="sens-fab-group-preview-cells">
          <div className="sens-fab-group-preview-cell">
            <span className="sens-fab-group-preview-cell-label">
              {label("sensd-button-fab-group-count-2", "2个")}
            </span>
            <FabVerticalGroupPreview count={2} />
          </div>
          <div className="sens-fab-group-preview-cell">
            <span className="sens-fab-group-preview-cell-label">
              {label("sensd-button-fab-group-count-3", "3个")}
            </span>
            <FabVerticalGroupPreview count={3} />
          </div>
        </div>
      </div>
      <div className="sens-fab-group-preview-row">
        <span className="sens-fab-group-preview-row-title">
          {label("sensd-button-fab-vertical-hover-demo", "FAB组合 / 竖向 / 中段 hover（3个）")}
        </span>
        <div className="sens-fab-group-preview-cells">
          <div className="sens-fab-group-preview-cell">
            <FabVerticalGroupPreview count={3} segmentStates={["default", "hover", "default"]} />
          </div>
        </div>
      </div>
      <div className="sens-fab-group-preview-row">
        <span className="sens-fab-group-preview-row-title">
          {label("sensd-button-fab-vertical-active-demo", "FAB组合 / 竖向 / 中段 active（3个）")}
        </span>
        <div className="sens-fab-group-preview-cells">
          <div className="sens-fab-group-preview-cell">
            <FabVerticalGroupPreview count={3} segmentStates={["default", "active", "default"]} />
          </div>
        </div>
      </div>
    </div>
  );
}

export interface FabGroupStatesPreviewProps {
  title?: ReactNode;
}

export function FabGroupStatesPreview({ title }: FabGroupStatesPreviewProps) {
  const { t } = useTranslation();
  const I18N_NS = "组件库";

  const label = (key: string, defaultValue: string) => t(`${I18N_NS}.${key}`, { defaultValue });
  const buttonLabel = label("sensd-button-action-button", "按钮");

  const rows: {
    key: string;
    titleKey: string;
    titleDefault: string;
    tone: FabTone;
    contentType: "text" | "iconText" | "icon";
  }[] = [
    { key: "p-text", titleKey: "sensd-button-fab-group-primary-text", titleDefault: "FAB组合 / 一级 / 纯文字", tone: "primary", contentType: "text" },
    { key: "p-it", titleKey: "sensd-button-fab-group-primary-iconText", titleDefault: "FAB组合 / 一级 / 图标+文字", tone: "primary", contentType: "iconText" },
    { key: "p-icon", titleKey: "sensd-button-fab-group-primary-icon", titleDefault: "FAB组合 / 一级 / 纯图标", tone: "primary", contentType: "icon" },
    { key: "s-text", titleKey: "sensd-button-fab-group-secondary-text", titleDefault: "FAB组合 / 二级 / 纯文字", tone: "secondary", contentType: "text" },
    { key: "s-it", titleKey: "sensd-button-fab-group-secondary-iconText", titleDefault: "FAB组合 / 二级 / 图标+文字", tone: "secondary", contentType: "iconText" },
    { key: "s-icon", titleKey: "sensd-button-fab-group-secondary-icon", titleDefault: "FAB组合 / 二级 / 纯图标", tone: "secondary", contentType: "icon" },
  ];

  return (
    <div
      id="sens-fab-group-preview"
      className="sens-fab-group-section"
      style={
        {
          "--sens-fab-group-space-5x": `${u["spacing/5x"]}px`,
          "--sens-fab-group-space-6x": `${u["spacing/6x"]}px`,
          ...getFabCssVars(),
        } as CSSProperties
      }
    >
      {title ? <div className="sens-fab-group-section-head">{title}</div> : null}
      <span className="sens-fab-group-section-title">
        {label("sensd-button-group-fab-horizontal-group", "横向组合 FAB")}
      </span>
      {rows.map((row) => (
        <div key={row.key} className="sens-fab-group-preview-row">
          <span className="sens-fab-group-preview-row-title">{label(row.titleKey, row.titleDefault)}</span>
          <div className="sens-fab-group-preview-cells">
            <div className="sens-fab-group-preview-cell">
              <span className="sens-fab-group-preview-cell-label">
                {label("sensd-button-fab-group-count-2", "2个")}
              </span>
              <FabGroupPreview tone={row.tone} count={2} contentType={row.contentType} buttonLabel={buttonLabel} />
            </div>
            <div className="sens-fab-group-preview-cell">
              <span className="sens-fab-group-preview-cell-label">
                {label("sensd-button-fab-group-count-3", "3个")}
              </span>
              <FabGroupPreview tone={row.tone} count={3} contentType={row.contentType} buttonLabel={buttonLabel} />
            </div>
          </div>
        </div>
      ))}
      <div className="sens-fab-group-preview-row">
        <span className="sens-fab-group-preview-row-title">
          {label("sensd-button-fab-group-hover-demo", "FAB组合 / 一级 / 中段 hover（3个）")}
        </span>
        <div className="sens-fab-group-preview-cells">
          <div className="sens-fab-group-preview-cell">
            <FabGroupPreview
              tone="primary"
              count={3}
              contentType="text"
              buttonLabel={buttonLabel}
              segmentStates={["default", "hover", "default"]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export { FAB_GROUP_PADDING_OUTER, FAB_GROUP_PADDING_INNER };
