import type { CSSProperties, HTMLAttributes, InputHTMLAttributes, MouseEvent, ReactNode } from "react";
import { useId, useState } from "react";
import { buildActiveRingShadow, getColorToken, tokenRgba } from "../design-system/color-utils";
import { getDividerColor, getDividerHairlineWidth } from "../design-system/divider";
import { getTypographyToken } from "../design-system/typography";
import { getUnitToken } from "../design-system/unit";
import "./radio.css";

export interface SensRadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "type"> {
  children?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  helpIcon?: ReactNode;
}

function px(value: number): string {
  return `${value}px`;
}

function buildRadioTokenVars(): CSSProperties {
  return {
    "--sens-radio-control-size": px(getUnitToken("size/icon/m")),
    "--sens-radio-radius": px(getUnitToken("radius/circular")),
    "--sens-radio-gap": px(getUnitToken("spacing/horizontal/2x")),
    "--sens-radio-inline-gap": px(getUnitToken("spacing/horizontal/1x")),
    "--sens-radio-border-width": px(getDividerHairlineWidth()),
    "--sens-radio-bg": getColorToken("white"),
    "--sens-radio-border": getDividerColor("deep", "transparent"),
    "--sens-radio-hover-border": getColorToken("component-primary"),
    "--sens-radio-active-border": getColorToken("component-active"),
    "--sens-radio-active-shadow": buildActiveRingShadow("component-active-shadow"),
    "--sens-radio-checked-bg": getColorToken("component-primary"),
    "--sens-radio-checked-hover-bg": getColorToken("component-hover"),
    "--sens-radio-checked-active-bg": getColorToken("component-active"),
    "--sens-radio-mark": getColorToken("white"),
    "--sens-radio-mark-disabled": getColorToken("icon-color-transparent-disable"),
    "--sens-radio-disabled-bg": tokenRgba("background-transparent-grey-hover", 0.06),
    "--sens-radio-disabled-hover-bg": tokenRgba("background-transparent-grey", 0.04),
    "--sens-radio-disabled-border": getDividerColor("light", "transparent"),
    "--sens-radio-disabled-hover-border": getDividerColor("weak", "transparent"),
    "--sens-radio-text": tokenRgba("text-color-transparent", 0.9),
    "--sens-radio-sub-text": tokenRgba("text-sub-color-transparent", 0.58),
    "--sens-radio-disabled-text": tokenRgba("text-color-transparent-disable", 0.3),
    "--sens-radio-disabled-hover-text": tokenRgba("text-color-transparent-disable-hover", 0.24),
    "--sens-radio-icon": getColorToken("icon-color-transparent"),
    "--sens-radio-icon-disabled": getColorToken("icon-color-transparent-disable"),
    "--sens-radio-icon-disabled-hover": getColorToken("icon-color-transparent-disable-hover"),
    "--sens-radio-font-size": px(getTypographyToken("font-size/m")),
    "--sens-radio-line-height": px(getTypographyToken("line-height/m")),
    "--sens-radio-description-font-size": px(getTypographyToken("font-size/s")),
    "--sens-radio-description-line-height": px(getTypographyToken("line-height/s")),
    "--sens-radio-description-gap": px(getUnitToken("spacing/vertical/1x")),
    "--sens-radio-option-height": px(getUnitToken("size/component-height/m")),
    "--sens-radio-group-column-gap": px(getUnitToken("spacing/horizontal/6x")),
    "--sens-radio-group-row-gap": px(getUnitToken("spacing/vertical/1x")),
  } as CSSProperties;
}

function mergeClassName(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

export function SensRadio({
  className,
  style,
  children,
  description,
  icon,
  helpIcon,
  disabled,
  readOnly,
  checked,
  defaultChecked,
  onClick,
  onChange,
  ...inputProps
}: SensRadioProps) {
  const hasBody = children != null || description != null || icon != null || helpIcon != null;

  const handleClick = (event: MouseEvent<HTMLInputElement>) => {
    onClick?.(event);
    if (readOnly) event.preventDefault();
  };

  const mergedClassName = mergeClassName(
    "sens-radio",
    disabled && "sens-radio--disabled",
    readOnly && "sens-radio--readonly",
    !hasBody && "sens-radio--control-only",
    className,
  );

  return (
    <label className={mergedClassName} style={{ ...buildRadioTokenVars(), ...style }}>
      <input
        {...inputProps}
        type="radio"
        className="sens-radio-input"
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        readOnly={readOnly}
        onClick={handleClick}
        onChange={readOnly ? undefined : onChange}
      />
      <span className="sens-radio-control" aria-hidden="true">
        <span className="sens-radio-dot" />
      </span>
      {hasBody ? (
        <span className="sens-radio-body">
          <span className="sens-radio-main">
            {icon ? <span className="sens-radio-icon">{icon}</span> : null}
            {children != null ? <span className="sens-radio-label">{children}</span> : null}
            {helpIcon ? <span className="sens-radio-help">{helpIcon}</span> : null}
          </span>
          {description != null ? <span className="sens-radio-description">{description}</span> : null}
        </span>
      ) : null}
    </label>
  );
}

export interface SensRadioGroupOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
  icon?: ReactNode;
  helpIcon?: ReactNode;
}

export interface SensRadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  options: SensRadioGroupOption[];
  value?: string;
  defaultValue?: string;
  name?: string;
  disabled?: boolean;
  readOnly?: boolean;
  direction?: "horizontal" | "vertical";
  onChange?: (value: string) => void;
}

export function SensRadioGroup({
  options,
  value,
  defaultValue,
  name,
  disabled = false,
  readOnly = false,
  direction = "horizontal",
  className,
  style,
  onChange,
  ...rootProps
}: SensRadioGroupProps) {
  const generatedName = useId();
  const [innerValue, setInnerValue] = useState(defaultValue);
  const mergedValue = value ?? innerValue;
  const groupName = name ?? `sens-radio-group-${generatedName}`;
  const hasDescription = options.some((option) => option.description != null);

  const handleOptionChange = (optionValue: string) => {
    if (readOnly) return;
    if (value === undefined) setInnerValue(optionValue);
    onChange?.(optionValue);
  };

  return (
    <div
      {...rootProps}
      role={rootProps.role ?? "radiogroup"}
      className={mergeClassName(
        "sens-radio-group",
        direction === "vertical" && "sens-radio-group--vertical",
        hasDescription && "sens-radio-group--with-description",
        !hasDescription && "sens-radio-group--single-line",
        disabled && "sens-radio-group--disabled",
        className,
      )}
      style={{ ...buildRadioTokenVars(), ...style }}
    >
      <div className="sens-radio-group-options">
        {options.map((option) => (
          <SensRadio
            key={option.value}
            name={groupName}
            value={option.value}
            checked={mergedValue === option.value}
            disabled={disabled || option.disabled}
            readOnly={readOnly || option.readOnly}
            icon={option.icon}
            helpIcon={option.helpIcon}
            description={option.description}
            onChange={() => handleOptionChange(option.value)}
          >
            {option.label}
          </SensRadio>
        ))}
      </div>
    </div>
  );
}

export type RadioPreviewState = "default" | "hover" | "active" | "disabled" | "disabledHover";
export type RadioPreviewValue = "unchecked" | "checked";

const RADIO_VALUE_LABEL: Record<RadioPreviewValue, string> = {
  unchecked: "未选中",
  checked: "已选中",
};

const RADIO_STATE_LABEL: Record<RadioPreviewState, string> = {
  default: "默认",
  hover: "悬停",
  active: "点击",
  disabled: "禁用",
  disabledHover: "禁用悬停",
};

function buildRadioPreviewProps(value: RadioPreviewValue, state: RadioPreviewState): SensRadioProps {
  return {
    checked: value === "checked",
    disabled: state === "disabled" || state === "disabledHover",
    readOnly: true,
    children: "选项文案",
    description: "辅助说明文字",
  };
}

function radioPreviewClassName(state: RadioPreviewState) {
  if (state === "hover") return "sens-radio-preview--hover";
  if (state === "active") return "sens-radio-preview--active";
  if (state === "disabledHover") return "sens-radio-preview--disabled-hover";
  return "";
}

export function RadioStatesPreview() {
  const values: RadioPreviewValue[] = ["unchecked", "checked"];
  const states: RadioPreviewState[] = ["default", "hover", "active", "disabled", "disabledHover"];

  return (
    <div className="sens-radio-matrix" style={buildRadioTokenVars()}>
      <div className="sens-radio-matrix-head">
        <span>状态</span>
        {states.map((state) => (
          <span key={state}>{RADIO_STATE_LABEL[state]}</span>
        ))}
      </div>
      {values.map((value) => (
        <div key={value} className="sens-radio-matrix-row">
          <span className="sens-radio-matrix-title">{RADIO_VALUE_LABEL[value]}</span>
          {states.map((state) => (
            <div key={state} className={mergeClassName("sens-radio-matrix-cell", radioPreviewClassName(state))}>
              <SensRadio {...buildRadioPreviewProps(value, state)} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
