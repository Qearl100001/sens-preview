import { Input, Tooltip, theme, type InputProps } from "antd";
import type { CSSProperties, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { getColorToken, tokenRgba } from "../design-system/color-utils";
import tokens from "../design-system/tokens.resolved.json";
import {
  ErrorDiamondIcon,
  INPUT_ERROR_HELP_ICON_SIZE,
  INPUT_ERROR_ICON_SIZE_M,
  INPUT_ERROR_ICON_SIZE_S,
} from "./FieldIcons";
import "./input.css";
import "./input-preview.css";

const typography = tokens.typography as Record<string, number>;
const u = tokens.unit as Record<string, number>;
const I18N_NS = "组件库";

/** 大：14px 字 + 行高 22（与 antd getLineHeight(14) 行盒一致） */
const INPUT_LINE_HEIGHT = 22;
/** 小：typography/line-height/s */
const INPUT_LINE_HEIGHT_SM = typography["line-height/s"] ?? 18;
const INPUT_HELP_GAP = u["spacing/horizontal/1x"];

export type SensInputWarningPlacement = "inside" | "outside";
export type SensInputReadOnlyVariant = "filled" | "plain";

function isInputEmpty(value: InputProps["value"], defaultValue: InputProps["defaultValue"]): boolean {
  const current = value ?? defaultValue;
  return current === undefined || current === null || current === "";
}

/** 锁高 + 警告/只读 CSS 变量（paddingBlock=0 时由组件层补足 controlHeight） */
export function useSensInputHeightStyle(): CSSProperties {
  const { token } = theme.useToken();

  return {
    "--sens-input-height": `${token.controlHeight}px`,
    "--sens-input-height-sm": `${token.controlHeightSM}px`,
    "--sens-input-line-height": `${INPUT_LINE_HEIGHT}px`,
    "--sens-input-line-height-sm": `${INPUT_LINE_HEIGHT_SM}px`,
    "--sens-input-error-color": token.colorError,
    "--sens-input-error-active-shadow": `0 0 0 2px ${tokenRgba("warning-color-active-shadow", 0.2)}`,
    "--sens-input-help-gap": `${INPUT_HELP_GAP}px`,
    "--sens-input-icon-gap": `${INPUT_HELP_GAP}px`,
    "--sens-input-readonly-bg": tokenRgba("background-transparent-grey-hover", 0.06),
    "--sens-input-readonly-warning-bg": getColorToken("warning-light-background"),
    "--sens-input-readonly-text": tokenRgba("text-color-transparent", 0.9),
  } as CSSProperties;
}

export interface SensInputProps extends InputProps {
  /** 框内 / 框外警告；可编辑态自动 `status="error"`，只读态走浅红底/纯文本（无红框） */
  warningPlacement?: SensInputWarningPlacement;
  /** 框外警告文案；框内时兼作 Tooltip 默认文案 */
  help?: ReactNode;
  /** 框内悬停图标时的 Tooltip；缺省用 `help` */
  warningMessage?: ReactNode;
  /** 只读有背景 `filled`（Figma 只读_背景）/ 只读无背景 `plain`（只读_字段）；设后自动 `readOnly` */
  readOnlyVariant?: SensInputReadOnlyVariant;
}

export function InsideErrorSuffix({
  size,
  message,
}: {
  size: InputProps["size"];
  message?: ReactNode;
}) {
  const iconSize = size === "small" ? INPUT_ERROR_ICON_SIZE_S : INPUT_ERROR_ICON_SIZE_M;
  const icon = (
    <span className="sens-input-error-suffix" tabIndex={message ? 0 : undefined}>
      <ErrorDiamondIcon size={iconSize} className="sens-input-error-icon" />
    </span>
  );

  if (message == null || message === "") return icon;

  return <Tooltip title={message}>{icon}</Tooltip>;
}

export function InputHelpRow({ help }: { help: ReactNode }) {
  return (
    <div className="sens-input-help" role="alert">
      <span className="sens-input-help-icon">
        <ErrorDiamondIcon size={INPUT_ERROR_HELP_ICON_SIZE} className="sens-input-error-icon" />
      </span>
      <span className="sens-input-help-text">{help}</span>
    </div>
  );
}

function resolveReadOnlyText(
  showUnset: boolean,
  unsetLabel: string,
  value: InputProps["value"],
  defaultValue: InputProps["defaultValue"],
): string {
  if (showUnset) return unsetLabel;
  const current = value ?? defaultValue;
  return current == null ? "" : String(current);
}

/** 单行文本输入框：主题 token + 锁高（32 / 24）+ 框内/框外警告 + 只读态 */
export function SensInput({
  className,
  style,
  size,
  status: statusProp,
  suffix,
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
}: SensInputProps) {
  const { t } = useTranslation();
  const heightStyle = useSensInputHeightStyle();
  const readOnly = readOnlyProp ?? Boolean(readOnlyVariant);
  const unsetLabel = t(`${I18N_NS}.sensd-input-unset`, { defaultValue: "未设置" });
  const showUnset = Boolean(readOnly && readOnlyVariant && isInputEmpty(value, defaultValue));
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
      ? "sens-input-readonly-filled"
      : readOnlyVariant === "plain"
        ? "sens-input-readonly-plain"
        : "";

  const warningClass = isReadOnlyWarning ? "sens-input-readonly-warning" : "";
  const mergedStyle = { ...heightStyle, ...style };
  const plainTextClass =
    size === "small" ? "sens-input-readonly-plain-text sens-input-readonly-plain-text-sm" : "sens-input-readonly-plain-text";

  /* 只读_字段 + 警告：不走 Input 红框（Figma 49284 / 49317 / 49274 / 49307） */
  if (readOnlyVariant === "plain" && isWarning) {
    const fieldClassName = ["sens-input-field", className].filter(Boolean).join(" ");

    if (warningPlacement === "inside") {
      return (
        <div className={fieldClassName} style={mergedStyle}>
          <div className="sens-input-readonly-plain-inline">
            <span className={plainTextClass}>{readOnlyText}</span>
            <InsideErrorSuffix size={size} message={tooltipMessage} />
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

  const mergedClassName = ["sens-input", readOnlyClass, warningClass, className].filter(Boolean).join(" ");
  const variant = readOnlyVariant === "plain" ? "borderless" : variantProp;

  const insideSuffix =
    warningPlacement === "inside" ? (
      <InsideErrorSuffix size={size} message={tooltipMessage} />
    ) : undefined;

  const mergedSuffix =
    insideSuffix && suffix ? (
      <span className="sens-input-suffix-group">
        {suffix}
        {insideSuffix}
      </span>
    ) : (
      insideSuffix ?? suffix
    );

  const input = (
    <Input
      className={mergedClassName}
      style={mergedStyle}
      size={size}
      status={status}
      variant={variant}
      suffix={mergedSuffix}
      readOnly={readOnly}
      value={resolvedValue}
      defaultValue={resolvedDefaultValue}
      placeholder={resolvedPlaceholder}
      {...props}
    />
  );

  if (warningPlacement !== "outside" || help == null || help === "") {
    return input;
  }

  return (
    <div className={["sens-input-field", className].filter(Boolean).join(" ")} style={mergedStyle}>
      {input}
      <InputHelpRow help={help} />
    </div>
  );
}

/** Figma 2214:13286 预览态：默认 / 悬停 / 聚焦 / 禁用 / 禁用悬停 / 只读有背景 / 只读无背景 */
export type InputPreviewState =
  | "default"
  | "hover"
  | "focus"
  | "disabled"
  | "disabledHover"
  | "readOnlyFilled"
  | "readOnlyPlain";

type InputPreviewWarning = "none" | "inside" | "outside";
type InputPreviewContent = "empty" | "filled";
type InputPreviewSize = "middle" | "small";

const INPUT_MATRIX_FIELD_WIDTH = 200;
const INPUT_MATRIX_CELL_WIDTH = 200;
const INPUT_PREVIEW_FILLED_VALUE = "已输入";
const INPUT_PREVIEW_WARNING_HELP = "警告文案";

const INPUT_STATE_I18N: Record<InputPreviewState, string> = {
  default: "sensd-input-state-default",
  hover: "sensd-input-state-hover",
  focus: "sensd-input-state-focus",
  disabled: "sensd-input-state-disabled",
  disabledHover: "sensd-input-state-disabledHover",
  readOnlyFilled: "sensd-input-state-readOnlyFilled",
  readOnlyPlain: "sensd-input-state-readOnlyPlain",
};

const INPUT_STATE_DEFAULT: Record<InputPreviewState, string> = {
  default: "默认",
  hover: "悬停",
  focus: "聚焦",
  disabled: "禁用",
  disabledHover: "禁用悬停",
  readOnlyFilled: "只读有背景",
  readOnlyPlain: "只读无背景",
};

const INPUT_WARNING_I18N: Record<InputPreviewWarning, string> = {
  none: "sensd-input-group-none",
  inside: "sensd-input-group-warningInside",
  outside: "sensd-input-group-warningOutside",
};

const INPUT_WARNING_DEFAULT: Record<InputPreviewWarning, string> = {
  none: "无警告",
  inside: "框内警告",
  outside: "框外警告",
};

const INPUT_CONTENT_I18N: Record<InputPreviewContent, string> = {
  empty: "sensd-input-content-empty",
  filled: "sensd-input-content-filled",
};

const INPUT_CONTENT_DEFAULT: Record<InputPreviewContent, string> = {
  empty: "未输入",
  filled: "已输入",
};

interface InputPreviewStyleToken {
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

function getInputPreviewStyleToken(antdToken: ReturnType<typeof theme.useToken>["token"]): InputPreviewStyleToken {
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

function resolveWarningPreviewVars(
  warning: InputPreviewWarning,
  styleToken: InputPreviewStyleToken,
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

function useInputMatrixPreviewVars(): CSSProperties {
  return {
    "--sens-input-matrix-space-2x": `${u["spacing/2x"]}px`,
    "--sens-input-matrix-space-5x": `${u["spacing/5x"]}px`,
    "--sens-input-matrix-space-6x": `${u["spacing/6x"]}px`,
    "--sens-input-matrix-cell-width": `${INPUT_MATRIX_CELL_WIDTH}px`,
  } as CSSProperties;
}

function previewWrapperClass(state: InputPreviewState): string {
  if (state === "hover") return "sens-input-matrix-preview--hover";
  if (state === "focus") return "sens-input-matrix-preview--focus";
  if (state === "disabledHover") return "sens-input-matrix-preview--disabled-hover";
  return "";
}

function buildPreviewInputProps(
  state: InputPreviewState,
  content: InputPreviewContent,
  warning: InputPreviewWarning,
  placeholder: string,
  filledValue: string,
): SensInputProps {
  const props: SensInputProps = {
    placeholder,
    size: undefined,
    style: { width: INPUT_MATRIX_FIELD_WIDTH, minWidth: 128, maxWidth: 600 },
    defaultValue: content === "filled" ? filledValue : undefined,
  };

  if (warning === "inside") {
    props.warningPlacement = "inside";
    props.help = INPUT_PREVIEW_WARNING_HELP;
  } else if (warning === "outside") {
    props.warningPlacement = "outside";
    props.help = INPUT_PREVIEW_WARNING_HELP;
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

interface InputMatrixRowProps {
  warning: InputPreviewWarning;
  size: InputPreviewSize;
  content: InputPreviewContent;
  styleToken: InputPreviewStyleToken;
  placeholder: string;
  filledValue: string;
  label: (key: string, defaultValue: string) => string;
}

function InputMatrixRow({
  warning,
  size,
  content,
  styleToken,
  placeholder,
  filledValue,
  label,
}: InputMatrixRowProps) {
  const states: InputPreviewState[] = [
    "default",
    "hover",
    "focus",
    "disabled",
    "disabledHover",
    "readOnlyFilled",
    "readOnlyPlain",
  ];
  const sizeLabel = label(size === "middle" ? "sensd-input-size-middle" : "sensd-input-size-small", size === "middle" ? "大 32" : "小 24");
  const rowTitle = [
    label(INPUT_WARNING_I18N[warning], INPUT_WARNING_DEFAULT[warning]),
    sizeLabel,
    label(INPUT_CONTENT_I18N[content], INPUT_CONTENT_DEFAULT[content]),
  ].join(" / ");

  return (
    <div className="sens-input-matrix-row" style={resolveWarningPreviewVars(warning, styleToken)}>
      <span className="sens-input-matrix-title">{rowTitle}</span>
      <div className="sens-input-matrix-states">
        {states.map((state) => (
          <div key={state} className="sens-input-matrix-cell">
            <span className="sens-input-matrix-label">
              {label(INPUT_STATE_I18N[state], INPUT_STATE_DEFAULT[state])}
            </span>
            <div className={previewWrapperClass(state)}>
              <SensInput
                {...buildPreviewInputProps(state, content, warning, placeholder, filledValue)}
                size={size === "small" ? "small" : undefined}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export interface InputStatesPreviewProps {
  title?: ReactNode;
  filledValue?: string;
}

/**
 * Figma 2214:13286 变体×状态矩阵。
 * 12 行（3 警告 × 2 尺寸 × 2 内容）× 7 列状态；内容未输入/已输入成对双行，排版对齐按钮矩阵。
 */
export function InputStatesPreview({ title, filledValue = INPUT_PREVIEW_FILLED_VALUE }: InputStatesPreviewProps) {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const styleToken = getInputPreviewStyleToken(token);
  const placeholder = t(`${I18N_NS}.sensd-input-placeholder`, { defaultValue: "请输入" });
  const label = (key: string, defaultValue: string) => t(`${I18N_NS}.${key}`, { defaultValue });

  const warnings: InputPreviewWarning[] = ["none", "inside", "outside"];
  const sizes: InputPreviewSize[] = ["middle", "small"];
  const contents: InputPreviewContent[] = ["empty", "filled"];

  return (
    <div className="sens-input-matrix" style={useInputMatrixPreviewVars()}>
      {title ? <div className="sens-input-matrix-title">{title}</div> : null}
      {warnings.map((warning) => (
        <div key={warning} className="sens-input-matrix-group">
          {sizes.map((size) => (
            <div key={size} className="sens-input-matrix-size-pair">
              {contents.map((content) => (
                <InputMatrixRow
                  key={`${warning}-${size}-${content}`}
                  warning={warning}
                  size={size}
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
      ))}
    </div>
  );
}
