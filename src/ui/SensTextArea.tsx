import { Input, theme, type InputProps } from "antd";
import type { TextAreaProps } from "antd/es/input";
import type { CSSProperties, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { tokenRgba } from "../design-system/color-utils";
import tokens from "../design-system/tokens.resolved.json";
import {
  INPUT_ERROR_ICON_SIZE_M,
  INPUT_ERROR_ICON_SIZE_S,
} from "./FieldIcons";
import "./input.css";
import {
  InsideErrorSuffix,
  InputHelpRow,
  useSensInputHeightStyle,
  type SensInputReadOnlyVariant,
  type SensInputWarningPlacement,
} from "./SensInput";
import "./textarea.css";
import "./textarea-preview.css";
import "./input-preview.css";

const { TextArea } = Input;
const typography = tokens.typography as Record<string, number>;
const u = tokens.unit as Record<string, number>;
const I18N_NS = "组件库";

/** §3.2 稿面值；尚无 spacing token */
const TEXTAREA_PADDING_BLOCK = 5;
const TEXTAREA_VISIBLE_ROWS = 4.5;
const TEXTAREA_BORDER_SIZE = 1;
const INPUT_LINE_HEIGHT = 22;
const INPUT_LINE_HEIGHT_SM = typography["line-height/s"] ?? 18;

function isTextAreaEmpty(value: TextAreaProps["value"], defaultValue: TextAreaProps["defaultValue"]): boolean {
  const current = value ?? defaultValue;
  return current === undefined || current === null || current === "";
}

function resolveReadOnlyText(
  showUnset: boolean,
  unsetLabel: string,
  value: TextAreaProps["value"],
  defaultValue: TextAreaProps["defaultValue"],
): string {
  if (showUnset) return unsetLabel;
  const current = value ?? defaultValue;
  return current == null ? "" : String(current);
}

function computeTextAreaMinHeight(lineHeight: number): number {
  return Math.round(
    TEXTAREA_VISIBLE_ROWS * lineHeight + TEXTAREA_PADDING_BLOCK * 2 + TEXTAREA_BORDER_SIZE * 2,
  );
}

/** 文本域专有：4.5 行 minHeight + padding；颜色变量与 SensInput 同源 */
export function useSensTextAreaStyle(size?: InputProps["size"]): CSSProperties {
  const fieldVars = useSensInputHeightStyle();
  const isSmall = size === "small";
  const lineHeight = isSmall ? INPUT_LINE_HEIGHT_SM : INPUT_LINE_HEIGHT;
  const paddingInline = isSmall ? (u["spacing/horizontal/2․5x"] ?? 10) : (u["spacing/horizontal/3x"] ?? 12);
  const iconSize = isSmall ? INPUT_ERROR_ICON_SIZE_S : INPUT_ERROR_ICON_SIZE_M;
  const iconGap = u["spacing/horizontal/1x"] ?? 4;
  const minHeight = computeTextAreaMinHeight(lineHeight);
  const minHeightSm = computeTextAreaMinHeight(INPUT_LINE_HEIGHT_SM);

  return {
    ...fieldVars,
    "--sens-textarea-line-height": `${INPUT_LINE_HEIGHT}px`,
    "--sens-textarea-line-height-sm": `${INPUT_LINE_HEIGHT_SM}px`,
    "--sens-textarea-padding-block": `${TEXTAREA_PADDING_BLOCK}px`,
    "--sens-textarea-padding-inline": `${paddingInline}px`,
    "--sens-textarea-border-size": `${TEXTAREA_BORDER_SIZE}px`,
    "--sens-textarea-min-height": `${minHeight}px`,
    "--sens-textarea-min-height-sm": `${minHeightSm}px`,
    "--sens-textarea-inside-warning-icon-size": `${iconSize}px`,
    "--sens-textarea-inside-warning-reserve": `${iconSize + iconGap + paddingInline}px`,
    "--sens-textarea-active-shadow": `0 0 0 2px ${tokenRgba("component-active-shadow", 0.2)}`,
  } as CSSProperties;
}

export type SensTextAreaWarningPlacement = SensInputWarningPlacement;
export type SensTextAreaReadOnlyVariant = SensInputReadOnlyVariant;

export interface SensTextAreaProps extends TextAreaProps {
  warningPlacement?: SensTextAreaWarningPlacement;
  help?: ReactNode;
  warningMessage?: ReactNode;
  readOnlyVariant?: SensTextAreaReadOnlyVariant;
}

function InsideWarningIcon({
  size,
  message,
  className,
}: {
  size: InputProps["size"];
  message?: ReactNode;
  className?: string;
}) {
  return (
    <span className={className}>
      <InsideErrorSuffix size={size} message={message} />
    </span>
  );
}

/** 多行文本输入框：4.5 行默认高度 + 框内/框外警告 + 只读态 */
export function SensTextArea({
  className,
  style,
  size,
  status: statusProp,
  variant: variantProp,
  warningPlacement,
  help,
  warningMessage,
  readOnly: readOnlyProp,
  readOnlyVariant,
  value,
  defaultValue,
  placeholder,
  ...props
}: SensTextAreaProps) {
  const { t } = useTranslation();
  const textAreaStyle = useSensTextAreaStyle(size);
  const readOnly = readOnlyProp ?? Boolean(readOnlyVariant);
  const unsetLabel = t(`${I18N_NS}.sensd-input-unset`, { defaultValue: "未设置" });
  const showUnset = Boolean(readOnly && readOnlyVariant && isTextAreaEmpty(value, defaultValue));
  const resolvedValue = showUnset ? unsetLabel : value;
  const resolvedDefaultValue = showUnset ? undefined : defaultValue;
  const resolvedPlaceholder = readOnlyVariant ? undefined : placeholder;
  const readOnlyText = resolveReadOnlyText(showUnset, unsetLabel, value, defaultValue);

  const isWarning = warningPlacement === "inside" || warningPlacement === "outside";
  const isReadOnlyWarning = Boolean(readOnlyVariant && isWarning);
  const status = isReadOnlyWarning ? statusProp : isWarning ? "error" : statusProp;
  const tooltipMessage = warningMessage ?? help;

  const readOnlyClass =
    readOnlyVariant === "filled"
      ? "sens-textarea-readonly-filled"
      : readOnlyVariant === "plain"
        ? "sens-textarea-readonly-plain"
        : "";

  const warningClass = isReadOnlyWarning ? "sens-textarea-readonly-warning" : "";
  const mergedStyle = { ...textAreaStyle, ...style };
  const plainTextClass =
    size === "small"
      ? "sens-textarea-readonly-plain-text sens-textarea-readonly-plain-text-sm"
      : "sens-textarea-readonly-plain-text";

  if (readOnlyVariant === "plain" && isWarning) {
    const fieldClassName = ["sens-textarea-field", className].filter(Boolean).join(" ");

    if (warningPlacement === "inside") {
      return (
        <div className={fieldClassName} style={mergedStyle}>
          <div
            className={[
              "sens-textarea-readonly-plain-block",
              size === "small" ? "sens-textarea-sm" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <span className={plainTextClass}>{readOnlyText}</span>
            <InsideWarningIcon
              size={size}
              message={tooltipMessage}
              className="sens-textarea-inside-warning-icon"
            />
          </div>
        </div>
      );
    }

    if (help != null && help !== "") {
      return (
        <div className={fieldClassName} style={mergedStyle}>
          <span className={plainTextClass}>{readOnlyText}</span>
          <InputHelpRow help={help} />
        </div>
      );
    }
  }

  const mergedClassName = ["sens-textarea", readOnlyClass, warningClass, className].filter(Boolean).join(" ");
  const variant = readOnlyVariant === "plain" ? "borderless" : variantProp;
  /* 与 SensInput 一致：只读+框内仍显示菱形图标（无红框，有背景走浅红底） */
  const hasInsideWarning = warningPlacement === "inside";

  const textArea = (
    <TextArea
      className={mergedClassName}
      style={mergedStyle}
      size={size}
      status={status}
      variant={variant}
      readOnly={readOnly}
      value={resolvedValue}
      defaultValue={resolvedDefaultValue}
      placeholder={resolvedPlaceholder}
      {...props}
    />
  );

  const wrappedTextArea =
    hasInsideWarning ? (
      <div
        className={[
          "sens-textarea-inside-warning-wrap",
          "sens-textarea-has-inside-warning",
          size === "small" ? "sens-textarea-sm" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={mergedStyle}
      >
        {textArea}
        <InsideWarningIcon
          size={size}
          message={tooltipMessage}
          className="sens-textarea-inside-warning-icon"
        />
      </div>
    ) : (
      textArea
    );

  if (warningPlacement !== "outside" || help == null || help === "") {
    return wrappedTextArea;
  }

  return (
    <div className={["sens-textarea-field", className].filter(Boolean).join(" ")} style={mergedStyle}>
      {wrappedTextArea}
      <InputHelpRow help={help} />
    </div>
  );
}

export type TextAreaPreviewState =
  | "default"
  | "hover"
  | "focus"
  | "disabled"
  | "disabledHover"
  | "readOnlyFilled"
  | "readOnlyPlain";

type TextAreaPreviewWarning = "none" | "inside" | "outside";
type TextAreaPreviewContent = "empty" | "filled";

const TEXTAREA_MATRIX_FIELD_WIDTH = 280;
const TEXTAREA_MATRIX_CELL_WIDTH = 280;
const TEXTAREA_PREVIEW_FILLED_VALUE = "已输入\n第二行";
const TEXTAREA_PREVIEW_WARNING_HELP = "警告文案";

const TEXTAREA_STATE_I18N: Record<TextAreaPreviewState, string> = {
  default: "sensd-input-state-default",
  hover: "sensd-input-state-hover",
  focus: "sensd-input-state-focus",
  disabled: "sensd-input-state-disabled",
  disabledHover: "sensd-input-state-disabledHover",
  readOnlyFilled: "sensd-input-state-readOnlyFilled",
  readOnlyPlain: "sensd-input-state-readOnlyPlain",
};

const TEXTAREA_STATE_DEFAULT: Record<TextAreaPreviewState, string> = {
  default: "默认",
  hover: "悬停",
  focus: "聚焦",
  disabled: "禁用",
  disabledHover: "禁用悬停",
  readOnlyFilled: "只读有背景",
  readOnlyPlain: "只读无背景",
};

const TEXTAREA_WARNING_I18N: Record<TextAreaPreviewWarning, string> = {
  none: "sensd-textarea-group-basic",
  inside: "sensd-textarea-group-warningInside",
  outside: "sensd-textarea-group-warningOutside",
};

const TEXTAREA_WARNING_DEFAULT: Record<TextAreaPreviewWarning, string> = {
  none: "基础",
  inside: "框内标记",
  outside: "错误·警告",
};

const TEXTAREA_CONTENT_I18N: Record<TextAreaPreviewContent, string> = {
  empty: "sensd-input-content-empty",
  filled: "sensd-input-content-filled",
};

const TEXTAREA_CONTENT_DEFAULT: Record<TextAreaPreviewContent, string> = {
  empty: "未输入",
  filled: "已输入",
};

interface TextAreaPreviewStyleToken {
  hoverBorderColor: string;
  activeBorderColor: string;
  activeShadow: string;
  colorBorderDisabledHover: string;
  colorBgContainerDisabledHover: string;
  colorErrorHover: string;
  colorErrorActive: string;
  errorActiveShadow: string;
  colorTextPlaceholderDisabledHover: string;
}

function getTextAreaPreviewStyleToken(antdToken: ReturnType<typeof theme.useToken>["token"]): TextAreaPreviewStyleToken {
  return {
    hoverBorderColor: antdToken.colorPrimary,
    activeBorderColor: antdToken.colorPrimaryActive,
    activeShadow: `0 0 0 2px ${tokenRgba("component-active-shadow", 0.2)}`,
    colorBorderDisabledHover: tokenRgba("line-color-transparent", 0.06),
    colorBgContainerDisabledHover: tokenRgba("background-transparent-grey", 0.04),
    colorErrorHover: antdToken.colorErrorHover,
    colorErrorActive: antdToken.colorErrorActive,
    errorActiveShadow: `0 0 0 2px ${tokenRgba("warning-color-active-shadow", 0.2)}`,
    colorTextPlaceholderDisabledHover: tokenRgba("text-color-transparent-disable-hover", 0.24),
  };
}

function resolveTextAreaWarningPreviewVars(
  warning: TextAreaPreviewWarning,
  styleToken: TextAreaPreviewStyleToken,
): CSSProperties {
  const isWarning = warning !== "none";
  return {
    "--sens-input-preview-hover-border": isWarning ? styleToken.colorErrorHover : styleToken.hoverBorderColor,
    "--sens-input-preview-focus-border": isWarning ? styleToken.colorErrorActive : styleToken.activeBorderColor,
    "--sens-input-preview-focus-shadow": isWarning ? styleToken.errorActiveShadow : styleToken.activeShadow,
    "--sens-input-preview-disabled-hover-border": styleToken.colorBorderDisabledHover,
    "--sens-input-preview-disabled-hover-bg": styleToken.colorBgContainerDisabledHover,
    "--sens-input-preview-placeholder-disabled-hover": styleToken.colorTextPlaceholderDisabledHover,
  } as CSSProperties;
}

function useTextAreaMatrixPreviewVars(): CSSProperties {
  return {
    "--sens-input-matrix-space-2x": `${u["spacing/2x"]}px`,
    "--sens-input-matrix-space-5x": `${u["spacing/5x"]}px`,
    "--sens-input-matrix-space-6x": `${u["spacing/6x"]}px`,
    "--sens-input-matrix-cell-width": `${TEXTAREA_MATRIX_CELL_WIDTH}px`,
  } as CSSProperties;
}

function textAreaPreviewWrapperClass(state: TextAreaPreviewState): string {
  if (state === "hover") return "sens-textarea-matrix-preview--hover";
  if (state === "focus") return "sens-textarea-matrix-preview--focus";
  if (state === "disabledHover") return "sens-textarea-matrix-preview--disabled-hover";
  return "";
}

function buildPreviewTextAreaProps(
  state: TextAreaPreviewState,
  content: TextAreaPreviewContent,
  warning: TextAreaPreviewWarning,
  placeholder: string,
  filledValue: string,
): SensTextAreaProps {
  const props: SensTextAreaProps = {
    placeholder,
    style: { width: TEXTAREA_MATRIX_FIELD_WIDTH, minWidth: 128, maxWidth: 600 },
    defaultValue: content === "filled" ? filledValue : undefined,
  };

  if (warning === "inside") {
    props.warningPlacement = "inside";
    props.help = TEXTAREA_PREVIEW_WARNING_HELP;
  } else if (warning === "outside") {
    props.warningPlacement = "outside";
    props.help = TEXTAREA_PREVIEW_WARNING_HELP;
  }

  switch (state) {
    case "disabled":
    case "disabledHover":
      return { ...props, disabled: true };
    case "readOnlyFilled":
      return { ...props, readOnlyVariant: "filled" };
    case "readOnlyPlain":
      return { ...props, readOnlyVariant: "plain" };
    case "hover":
    case "focus":
      return { ...props, readOnly: true };
    default:
      return props;
  }
}

interface TextAreaMatrixRowProps {
  warning: TextAreaPreviewWarning;
  content: TextAreaPreviewContent;
  styleToken: TextAreaPreviewStyleToken;
  placeholder: string;
  filledValue: string;
  label: (key: string, defaultValue: string) => string;
}

function TextAreaMatrixRow({
  warning,
  content,
  styleToken,
  placeholder,
  filledValue,
  label,
}: TextAreaMatrixRowProps) {
  const states: TextAreaPreviewState[] = [
    "default",
    "hover",
    "focus",
    "disabled",
    "disabledHover",
    "readOnlyFilled",
    "readOnlyPlain",
  ];
  const rowTitle = [
    label(TEXTAREA_WARNING_I18N[warning], TEXTAREA_WARNING_DEFAULT[warning]),
    label(TEXTAREA_CONTENT_I18N[content], TEXTAREA_CONTENT_DEFAULT[content]),
  ].join(" / ");

  return (
    <div className="sens-input-matrix-row" style={resolveTextAreaWarningPreviewVars(warning, styleToken)}>
      <span className="sens-input-matrix-title">{rowTitle}</span>
      <div className="sens-input-matrix-states">
        {states.map((state) => (
          <div key={state} className="sens-input-matrix-cell">
            <span className="sens-input-matrix-label">
              {label(TEXTAREA_STATE_I18N[state], TEXTAREA_STATE_DEFAULT[state])}
            </span>
            <div className={textAreaPreviewWrapperClass(state)}>
              <SensTextArea {...buildPreviewTextAreaProps(state, content, warning, placeholder, filledValue)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export interface TextAreaStatesPreviewProps {
  title?: ReactNode;
  filledValue?: string;
}

/** §3.2 变体×状态矩阵：3 变体 × 7 状态 × 2 内容 = 42 格 */
export function TextAreaStatesPreview({
  title,
  filledValue = TEXTAREA_PREVIEW_FILLED_VALUE,
}: TextAreaStatesPreviewProps) {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const styleToken = getTextAreaPreviewStyleToken(token);
  const placeholder = t(`${I18N_NS}.sensd-input-placeholder`, { defaultValue: "请输入" });
  const label = (key: string, defaultValue: string) => t(`${I18N_NS}.${key}`, { defaultValue });

  const warnings: TextAreaPreviewWarning[] = ["none", "outside", "inside"];
  const contents: TextAreaPreviewContent[] = ["empty", "filled"];

  return (
    <div className="sens-input-matrix" style={useTextAreaMatrixPreviewVars()}>
      {title ? <div className="sens-input-matrix-title">{title}</div> : null}
      {warnings.map((warning) => (
        <div key={warning} className="sens-input-matrix-group">
          {contents.map((content) => (
            <TextAreaMatrixRow
              key={`${warning}-${content}`}
              warning={warning}
              content={content}
              styleToken={styleToken}
              placeholder={placeholder}
              filledValue={filledValue}
              label={label}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
