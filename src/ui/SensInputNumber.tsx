import { InputNumber, theme, type InputNumberProps } from "antd";
import type { CSSProperties, ReactNode } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { tokenRgba } from "../design-system/color-utils";
import tokens from "../design-system/tokens.resolved.json";
import {
  INPUT_ERROR_ICON_SIZE_M,
  INPUT_ERROR_ICON_SIZE_S,
  STEPPER_ICON_SIZE,
  StepperDownIcon,
  StepperUpIcon,
} from "./FieldIcons";
import "./input.css";
import {
  InsideErrorSuffix,
  InputHelpRow,
  useSensInputHeightStyle,
  type SensInputReadOnlyVariant,
  type SensInputWarningPlacement,
} from "./SensInput";
import "./input-preview.css";
import "./inputnumber.css";
import "./inputnumber-preview.css";

const u = tokens.unit as Record<string, number>;
const I18N_NS = "组件库";
const INPUT_NUMBER_HANDLE_WIDTH = 17;
const INPUT_NUMBER_DEFAULT_WIDTH = 188;
const INPUT_NUMBER_MIN_WIDTH = 108;
const INPUT_NUMBER_MAX_WIDTH = 600;

function isInputNumberEmpty(
  value: InputNumberProps["value"],
  defaultValue: InputNumberProps["defaultValue"],
): boolean {
  const current = value ?? defaultValue;
  return current === undefined || current === null || current === "";
}

function resolveReadOnlyText(
  showUnset: boolean,
  unsetLabel: string,
  value: InputNumberProps["value"],
  defaultValue: InputNumberProps["defaultValue"],
): string {
  if (showUnset) return unsetLabel;
  const current = value ?? defaultValue;
  return current == null ? "" : String(current);
}

/** 数字框专有 CSS 变量（字段色与 SensInput 同源） */
export function useSensInputNumberStyle(size?: InputNumberProps["size"]): CSSProperties {
  const { token } = theme.useToken();
  const fieldVars = useSensInputHeightStyle();
  const iconSize = size === "small" ? INPUT_ERROR_ICON_SIZE_S : INPUT_ERROR_ICON_SIZE_M;
  const iconGap = u["spacing/horizontal/1x"] ?? 4;
  const edgeInset = size === "small" ? 10 : (u["spacing/horizontal/3x"] ?? 12);
  const stepperVisibleEdge = INPUT_NUMBER_HANDLE_WIDTH + iconGap;

  return {
    ...fieldVars,
    "--sens-inputnumber-handle-width": `${INPUT_NUMBER_HANDLE_WIDTH}px`,
    "--sens-inputnumber-handler-bg": token.colorBgContainer,
    "--sens-inputnumber-handler-border-color": tokenRgba("divideline-color-transparent-dack", 0.16),
    "--sens-inputnumber-handler-default-color": token.colorIcon,
    "--sens-inputnumber-handler-hover-color": token.colorPrimary,
    "--sens-inputnumber-handler-active-color": token.colorPrimaryActive,
    "--sens-inputnumber-handler-disabled-color": tokenRgba("icon-color-transparent-disable", 0.3),
    "--sens-inputnumber-handler-disabled-hover-color": tokenRgba(
      "icon-color-transparent-disable-hover",
      0.24,
    ),
    "--sens-inputnumber-inside-warning-icon-size": `${iconSize}px`,
    "--sens-inputnumber-inside-warning-edge": `${edgeInset}px`,
    "--sens-inputnumber-inside-warning-edge-hover": `${stepperVisibleEdge}px`,
    "--sens-inputnumber-inside-warning-reserve": `${edgeInset + iconSize}px`,
    "--sens-inputnumber-inside-warning-reserve-hover": `${stepperVisibleEdge + iconSize}px`,
    "--sens-inputnumber-active-shadow": `0 0 0 2px ${tokenRgba("component-active-shadow", 0.2)}`,
  } as CSSProperties;
}

export type SensInputNumberWarningPlacement = SensInputWarningPlacement;
export type SensInputNumberReadOnlyVariant = SensInputReadOnlyVariant;

export interface SensInputNumberProps extends InputNumberProps {
  warningPlacement?: SensInputNumberWarningPlacement;
  help?: ReactNode;
  warningMessage?: ReactNode;
  readOnlyVariant?: SensInputNumberReadOnlyVariant;
}

function useStepperControls() {
  return useMemo(
    () => ({
      upIcon: (
        <span className="sens-inputnumber-stepper-icon">
          <StepperUpIcon size={STEPPER_ICON_SIZE} />
        </span>
      ),
      downIcon: (
        <span className="sens-inputnumber-stepper-icon">
          <StepperDownIcon size={STEPPER_ICON_SIZE} />
        </span>
      ),
    }),
    [],
  );
}

function InsideWarningIcon({
  size,
  message,
  className,
}: {
  size: InputNumberProps["size"];
  message?: ReactNode;
  className?: string;
}) {
  return (
    <span className={className}>
      <InsideErrorSuffix size={size} message={message} />
    </span>
  );
}

/** 数字输入框：锁高 + 步进器 token + 框内/框外警告 + 只读态 */
export function SensInputNumber({
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
  controls: controlsProp,
  ...props
}: SensInputNumberProps) {
  const { t } = useTranslation();
  const numberStyle = useSensInputNumberStyle(size);
  const stepperControls = useStepperControls();
  const readOnly = readOnlyProp ?? Boolean(readOnlyVariant);
  const unsetLabel = t(`${I18N_NS}.sensd-input-unset`, { defaultValue: "未设置" });
  const showUnset = Boolean(readOnly && readOnlyVariant && isInputNumberEmpty(value, defaultValue));
  const resolvedDefaultValue = showUnset ? undefined : defaultValue;
  const resolvedPlaceholder = readOnlyVariant ? undefined : placeholder;
  const readOnlyText = resolveReadOnlyText(showUnset, unsetLabel, value, defaultValue);
  const resolvedValue = showUnset ? null : value;

  const isWarning = warningPlacement === "inside" || warningPlacement === "outside";
  const isReadOnlyWarning = Boolean(readOnlyVariant && isWarning);
  const status = isReadOnlyWarning ? statusProp : isWarning ? "error" : statusProp;
  const tooltipMessage = warningMessage ?? help;

  const readOnlyClass =
    readOnlyVariant === "filled"
      ? "sens-inputnumber-readonly-filled"
      : readOnlyVariant === "plain"
        ? "sens-inputnumber-readonly-plain"
        : "";

  const warningClass = isReadOnlyWarning ? "sens-inputnumber-readonly-warning" : "";
  const mergedStyle = {
    ...numberStyle,
    width: INPUT_NUMBER_DEFAULT_WIDTH,
    minWidth: INPUT_NUMBER_MIN_WIDTH,
    maxWidth: INPUT_NUMBER_MAX_WIDTH,
    ...style,
  };
  const plainTextClass =
    size === "small"
      ? "sens-inputnumber-readonly-plain-text sens-inputnumber-readonly-plain-text-sm"
      : "sens-inputnumber-readonly-plain-text";

  if (readOnlyVariant === "plain" && isWarning) {
    const fieldClassName = ["sens-inputnumber-field", className].filter(Boolean).join(" ");

    if (warningPlacement === "inside") {
      return (
        <div className={fieldClassName} style={mergedStyle}>
          <div
            className={[
              "sens-inputnumber-readonly-plain-block",
              size === "small" ? "sens-inputnumber-sm" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <span className={plainTextClass}>{readOnlyText}</span>
            <InsideWarningIcon
              size={size}
              message={tooltipMessage}
              className="sens-inputnumber-inside-warning-icon"
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

  const mergedClassName = ["sens-inputnumber", readOnlyClass, warningClass, className]
    .filter(Boolean)
    .join(" ");
  const variant = readOnlyVariant === "plain" ? "borderless" : variantProp;
  const hasInsideWarning = warningPlacement === "inside";
  const controls = controlsProp === false ? false : controlsProp ?? stepperControls;
  const unsetFormatter =
    readOnlyVariant === "filled" && showUnset
      ? () => unsetLabel
      : undefined;

  const inputNumber = (
    <InputNumber
      className={mergedClassName}
      style={mergedStyle}
      size={size}
      status={status}
      variant={variant}
      readOnly={readOnly}
      value={resolvedValue}
      defaultValue={resolvedDefaultValue}
      placeholder={resolvedPlaceholder}
      controls={controls}
      formatter={unsetFormatter}
      {...props}
    />
  );

  const wrappedInputNumber =
    hasInsideWarning ? (
      <div
        className={[
          "sens-inputnumber-inside-warning-wrap",
          "sens-inputnumber-has-inside-warning",
          size === "small" ? "sens-inputnumber-sm" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={mergedStyle}
      >
        {inputNumber}
        <InsideWarningIcon
          size={size}
          message={tooltipMessage}
          className="sens-inputnumber-inside-warning-icon"
        />
      </div>
    ) : (
      inputNumber
    );

  if (warningPlacement !== "outside" || help == null || help === "") {
    return wrappedInputNumber;
  }

  return (
    <div className={["sens-inputnumber-field", className].filter(Boolean).join(" ")} style={mergedStyle}>
      {wrappedInputNumber}
      <InputHelpRow help={help} />
    </div>
  );
}

export type InputNumberPreviewState =
  | "default"
  | "hover"
  | "click"
  | "active"
  | "disabled"
  | "disabledHover"
  | "readOnlyFilled"
  | "readOnlyPlain";

type InputNumberPreviewWarning = "none" | "inside" | "outside";
type InputNumberPreviewContent = "empty" | "filled";

const INPUT_NUMBER_MATRIX_CELL_WIDTH = 108;
const INPUT_NUMBER_PREVIEW_FILLED_VALUE = 100;
const INPUT_NUMBER_PREVIEW_WARNING_HELP = "警告文案";

const INPUT_NUMBER_STATE_I18N: Record<InputNumberPreviewState, string> = {
  default: "sensd-input-state-default",
  hover: "sensd-input-state-hover",
  click: "sensd-inputnumber-state-click",
  active: "sensd-inputnumber-state-active",
  disabled: "sensd-input-state-disabled",
  disabledHover: "sensd-input-state-disabledHover",
  readOnlyFilled: "sensd-input-state-readOnlyFilled",
  readOnlyPlain: "sensd-input-state-readOnlyPlain",
};

const INPUT_NUMBER_STATE_DEFAULT: Record<InputNumberPreviewState, string> = {
  default: "默认",
  hover: "悬停",
  click: "点击",
  active: "激活",
  disabled: "禁用",
  disabledHover: "禁用悬停",
  readOnlyFilled: "只读有背景",
  readOnlyPlain: "只读无背景",
};

const INPUT_NUMBER_WARNING_I18N: Record<InputNumberPreviewWarning, string> = {
  none: "sensd-inputnumber-group-basic",
  inside: "sensd-inputnumber-group-warningInside",
  outside: "sensd-inputnumber-group-warningOutside",
};

const INPUT_NUMBER_WARNING_DEFAULT: Record<InputNumberPreviewWarning, string> = {
  none: "基础",
  inside: "框内标记",
  outside: "错误·警告",
};

const INPUT_NUMBER_CONTENT_I18N: Record<InputNumberPreviewContent, string> = {
  empty: "sensd-input-content-empty",
  filled: "sensd-input-content-filled",
};

const INPUT_NUMBER_CONTENT_DEFAULT: Record<InputNumberPreviewContent, string> = {
  empty: "未输入",
  filled: "已输入",
};

interface InputNumberPreviewStyleToken {
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

function getInputNumberPreviewStyleToken(
  antdToken: ReturnType<typeof theme.useToken>["token"],
): InputNumberPreviewStyleToken {
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

function resolveInputNumberWarningPreviewVars(
  warning: InputNumberPreviewWarning,
  styleToken: InputNumberPreviewStyleToken,
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

function useInputNumberMatrixPreviewVars(): CSSProperties {
  return {
    "--sens-input-matrix-space-2x": `${u["spacing/2x"]}px`,
    "--sens-input-matrix-space-5x": `${u["spacing/5x"]}px`,
    "--sens-input-matrix-space-6x": `${u["spacing/6x"]}px`,
    "--sens-input-matrix-cell-width": `${INPUT_NUMBER_MATRIX_CELL_WIDTH}px`,
  } as CSSProperties;
}

function inputNumberPreviewWrapperClass(state: InputNumberPreviewState): string {
  const classes: string[] = [];
  if (["hover", "click", "active", "disabledHover"].includes(state)) {
    classes.push("sens-inputnumber-matrix-preview--show-handlers");
  }
  if (state === "hover") classes.push("sens-inputnumber-matrix-preview--hover");
  if (state === "click") classes.push("sens-inputnumber-matrix-preview--click");
  if (state === "active") classes.push("sens-inputnumber-matrix-preview--active");
  if (state === "disabledHover") classes.push("sens-inputnumber-matrix-preview--disabled-hover");
  return classes.join(" ");
}

function buildPreviewInputNumberProps(
  state: InputNumberPreviewState,
  content: InputNumberPreviewContent,
  warning: InputNumberPreviewWarning,
  placeholder: string,
  filledValue: number,
): SensInputNumberProps {
  const props: SensInputNumberProps = {
    placeholder,
    style: {
      width: INPUT_NUMBER_MATRIX_CELL_WIDTH,
      minWidth: INPUT_NUMBER_MIN_WIDTH,
      maxWidth: INPUT_NUMBER_MAX_WIDTH,
    },
    defaultValue: content === "filled" ? filledValue : undefined,
  };

  if (warning === "inside") {
    props.warningPlacement = "inside";
    props.help = INPUT_NUMBER_PREVIEW_WARNING_HELP;
  } else if (warning === "outside") {
    props.warningPlacement = "outside";
    props.help = INPUT_NUMBER_PREVIEW_WARNING_HELP;
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
    case "click":
    case "active":
      return { ...props, readOnly: true };
    default:
      return props;
  }
}

interface InputNumberMatrixRowProps {
  warning: InputNumberPreviewWarning;
  content: InputNumberPreviewContent;
  styleToken: InputNumberPreviewStyleToken;
  placeholder: string;
  filledValue: number;
  label: (key: string, defaultValue: string) => string;
}

function InputNumberMatrixRow({
  warning,
  content,
  styleToken,
  placeholder,
  filledValue,
  label,
}: InputNumberMatrixRowProps) {
  const states: InputNumberPreviewState[] = [
    "default",
    "hover",
    "click",
    "active",
    "disabled",
    "readOnlyFilled",
    "readOnlyPlain",
    "disabledHover",
  ];
  const rowTitle = [
    label(INPUT_NUMBER_WARNING_I18N[warning], INPUT_NUMBER_WARNING_DEFAULT[warning]),
    label(INPUT_NUMBER_CONTENT_I18N[content], INPUT_NUMBER_CONTENT_DEFAULT[content]),
  ].join(" / ");

  return (
    <div
      className="sens-input-matrix-row"
      style={resolveInputNumberWarningPreviewVars(warning, styleToken)}
    >
      <span className="sens-input-matrix-title">{rowTitle}</span>
      <div className="sens-input-matrix-states">
        {states.map((state) => (
          <div key={state} className="sens-input-matrix-cell">
            <span className="sens-input-matrix-label">
              {label(INPUT_NUMBER_STATE_I18N[state], INPUT_NUMBER_STATE_DEFAULT[state])}
            </span>
            <div className={inputNumberPreviewWrapperClass(state)}>
              <SensInputNumber
                {...buildPreviewInputNumberProps(state, content, warning, placeholder, filledValue)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export interface InputNumberStatesPreviewProps {
  title?: ReactNode;
  filledValue?: number;
}

/** Figma 17465:62974：3 警告 × 8 状态 × 2 内容 = 48 格 */
export function InputNumberStatesPreview({
  title,
  filledValue = INPUT_NUMBER_PREVIEW_FILLED_VALUE,
}: InputNumberStatesPreviewProps) {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const styleToken = getInputNumberPreviewStyleToken(token);
  const placeholder = t(`${I18N_NS}.sensd-input-placeholder`, { defaultValue: "请输入" });
  const label = (key: string, defaultValue: string) => t(`${I18N_NS}.${key}`, { defaultValue });

  const warnings: InputNumberPreviewWarning[] = ["none", "outside", "inside"];
  const contents: InputNumberPreviewContent[] = ["empty", "filled"];

  return (
    <div className="sens-input-matrix" style={useInputNumberMatrixPreviewVars()}>
      {title ? <div className="sens-input-matrix-title">{title}</div> : null}
      {warnings.map((warning) => (
        <div key={warning} className="sens-input-matrix-group">
          {contents.map((content) => (
            <InputNumberMatrixRow
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
