import type { CSSProperties, HTMLAttributes, InputHTMLAttributes, MouseEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { buildActiveRingShadow, getColorToken, tokenRgba } from "../design-system/color-utils";
import { getDividerColor, getDividerHairlineWidth } from "../design-system/divider";
import { SensIcon } from "../design-system/icons";
import { getTypographyToken } from "../design-system/typography";
import { getUnitToken } from "../design-system/unit";
import "./checkbox.css";

export interface SensCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "type"> {
  children?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  helpIcon?: ReactNode;
  indeterminate?: boolean;
}

function px(value: number): string {
  return `${value}px`;
}

function buildCheckboxTokenVars(): CSSProperties {
  return {
    "--sens-checkbox-control-size": px(getUnitToken("size/icon/m")),
    "--sens-checkbox-radius": px(getUnitToken("radius/s")),
    "--sens-checkbox-gap": px(getUnitToken("spacing/horizontal/2x")),
    "--sens-checkbox-inline-gap": px(getUnitToken("spacing/horizontal/1x")),
    "--sens-checkbox-border-width": px(getDividerHairlineWidth()),
    "--sens-checkbox-bg": getColorToken("white"),
    "--sens-checkbox-border": getDividerColor("deep", "transparent"),
    "--sens-checkbox-hover-border": getColorToken("component-primary"),
    "--sens-checkbox-active-border": getColorToken("component-active"),
    "--sens-checkbox-active-shadow": buildActiveRingShadow("component-active-shadow"),
    "--sens-checkbox-checked-bg": getColorToken("component-primary"),
    "--sens-checkbox-checked-hover-bg": getColorToken("component-hover"),
    "--sens-checkbox-checked-active-bg": getColorToken("component-active"),
    "--sens-checkbox-mark": getColorToken("white"),
    "--sens-checkbox-mark-disabled": getColorToken("icon-color-transparent-disable"),
    "--sens-checkbox-disabled-bg": tokenRgba("background-transparent-grey-hover", 0.06),
    "--sens-checkbox-disabled-hover-bg": tokenRgba("background-transparent-grey", 0.04),
    "--sens-checkbox-disabled-border": getDividerColor("light", "transparent"),
    "--sens-checkbox-disabled-hover-border": getDividerColor("weak", "transparent"),
    "--sens-checkbox-text": tokenRgba("text-color-transparent", 0.9),
    "--sens-checkbox-sub-text": tokenRgba("text-sub-color-transparent", 0.58),
    "--sens-checkbox-disabled-text": tokenRgba("text-color-transparent-disable", 0.3),
    "--sens-checkbox-disabled-hover-text": tokenRgba("text-color-transparent-disable-hover", 0.24),
    "--sens-checkbox-icon": getColorToken("icon-color-transparent"),
    "--sens-checkbox-icon-disabled": getColorToken("icon-color-transparent-disable"),
    "--sens-checkbox-icon-disabled-hover": getColorToken("icon-color-transparent-disable-hover"),
    "--sens-checkbox-font-size": px(getTypographyToken("font-size/m")),
    "--sens-checkbox-line-height": px(getTypographyToken("line-height/m")),
    "--sens-checkbox-description-font-size": px(getTypographyToken("font-size/s")),
    "--sens-checkbox-description-line-height": px(getTypographyToken("line-height/s")),
    "--sens-checkbox-description-gap": px(getUnitToken("spacing/vertical/1x")),
    "--sens-checkbox-option-height": px(getUnitToken("size/component-height/m")),
    "--sens-checkbox-group-column-gap": px(getUnitToken("spacing/horizontal/6x")),
    "--sens-checkbox-group-row-gap": px(getUnitToken("spacing/vertical/1x")),
  } as CSSProperties;
}

function mergeClassName(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

export function SensCheckbox({
  className,
  style,
  children,
  description,
  icon,
  helpIcon,
  indeterminate = false,
  disabled,
  readOnly,
  checked,
  defaultChecked,
  onClick,
  onChange,
  ...inputProps
}: SensCheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasBody = children != null || description != null || icon != null || helpIcon != null;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const handleClick = (event: MouseEvent<HTMLInputElement>) => {
    onClick?.(event);
    if (readOnly) event.preventDefault();
  };

  const mergedClassName = mergeClassName(
    "sens-checkbox",
    disabled && "sens-checkbox--disabled",
    readOnly && "sens-checkbox--readonly",
    indeterminate && "sens-checkbox--indeterminate",
    !hasBody && "sens-checkbox--control-only",
    className,
  );

  return (
    <label className={mergedClassName} style={{ ...buildCheckboxTokenVars(), ...style }}>
      <input
        {...inputProps}
        ref={inputRef}
        type="checkbox"
        className="sens-checkbox-input"
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        readOnly={readOnly}
        aria-checked={indeterminate ? "mixed" : inputProps["aria-checked"]}
        onClick={handleClick}
        onChange={readOnly ? undefined : onChange}
      />
      <span className="sens-checkbox-control" aria-hidden="true">
        <SensIcon name="check" sizeToken="size/icon/m" color="currentColor" className="sens-checkbox-check" />
        <span className="sens-checkbox-line" />
      </span>
      {hasBody ? (
        <span className="sens-checkbox-body">
          <span className="sens-checkbox-main">
            {icon ? <span className="sens-checkbox-icon">{icon}</span> : null}
            {children != null ? <span className="sens-checkbox-label">{children}</span> : null}
            {helpIcon ? <span className="sens-checkbox-help">{helpIcon}</span> : null}
          </span>
          {description != null ? <span className="sens-checkbox-description">{description}</span> : null}
        </span>
      ) : null}
    </label>
  );
}

export interface SensCheckboxGroupOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
  icon?: ReactNode;
  helpIcon?: ReactNode;
  indeterminate?: boolean;
}

export interface SensCheckboxGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  options: SensCheckboxGroupOption[];
  value?: string[];
  defaultValue?: string[];
  name?: string;
  disabled?: boolean;
  readOnly?: boolean;
  direction?: "horizontal" | "vertical";
  onChange?: (value: string[]) => void;
}

export function SensCheckboxGroup({
  options,
  value,
  defaultValue = [],
  name,
  disabled = false,
  readOnly = false,
  direction = "horizontal",
  className,
  style,
  onChange,
  ...rootProps
}: SensCheckboxGroupProps) {
  const [innerValue, setInnerValue] = useState(defaultValue);
  const mergedValue = value ?? innerValue;
  const mergedValueSet = new Set(mergedValue);
  const hasDescription = options.some((option) => option.description != null);

  const handleOptionChange = (optionValue: string, checked: boolean) => {
    if (readOnly) return;

    const nextValue = checked
      ? Array.from(new Set([...mergedValue, optionValue]))
      : mergedValue.filter((item) => item !== optionValue);

    if (value === undefined) setInnerValue(nextValue);
    onChange?.(nextValue);
  };

  return (
    <div
      {...rootProps}
      role={rootProps.role ?? "group"}
      className={mergeClassName(
        "sens-checkbox-group",
        direction === "vertical" && "sens-checkbox-group--vertical",
        hasDescription && "sens-checkbox-group--with-description",
        !hasDescription && "sens-checkbox-group--single-line",
        disabled && "sens-checkbox-group--disabled",
        className,
      )}
      style={{ ...buildCheckboxTokenVars(), ...style }}
    >
      <div className="sens-checkbox-group-options">
        {options.map((option) => (
          <SensCheckbox
            key={option.value}
            name={name}
            value={option.value}
            checked={mergedValueSet.has(option.value)}
            disabled={disabled || option.disabled}
            readOnly={readOnly || option.readOnly}
            indeterminate={option.indeterminate}
            icon={option.icon}
            helpIcon={option.helpIcon}
            description={option.description}
            onChange={(event) => handleOptionChange(option.value, event.target.checked)}
          >
            {option.label}
          </SensCheckbox>
        ))}
      </div>
    </div>
  );
}

export type CheckboxPreviewState = "default" | "hover" | "active" | "disabled" | "disabledHover";
export type CheckboxPreviewValue = "unchecked" | "checked" | "indeterminate";

const CHECKBOX_VALUE_LABEL: Record<CheckboxPreviewValue, string> = {
  unchecked: "未选中",
  checked: "已选中",
  indeterminate: "部分选中",
};

const CHECKBOX_STATE_LABEL: Record<CheckboxPreviewState, string> = {
  default: "默认",
  hover: "悬停",
  active: "点击",
  disabled: "禁用",
  disabledHover: "禁用悬停",
};

function buildCheckboxPreviewProps(
  value: CheckboxPreviewValue,
  state: CheckboxPreviewState,
): SensCheckboxProps {
  return {
    checked: value === "checked",
    indeterminate: value === "indeterminate",
    disabled: state === "disabled" || state === "disabledHover",
    readOnly: true,
    children: "选项文案",
    description: "辅助说明文字",
  };
}

function checkboxPreviewClassName(state: CheckboxPreviewState) {
  if (state === "hover") return "sens-checkbox-preview--hover";
  if (state === "active") return "sens-checkbox-preview--active";
  if (state === "disabledHover") return "sens-checkbox-preview--disabled-hover";
  return "";
}

export function CheckboxStatesPreview() {
  const values: CheckboxPreviewValue[] = ["unchecked", "checked", "indeterminate"];
  const states: CheckboxPreviewState[] = ["default", "hover", "active", "disabled", "disabledHover"];

  return (
    <div className="sens-checkbox-matrix" style={buildCheckboxTokenVars()}>
      <div className="sens-checkbox-matrix-head">
        <span>状态</span>
        {states.map((state) => (
          <span key={state}>{CHECKBOX_STATE_LABEL[state]}</span>
        ))}
      </div>
      {values.map((value) => (
        <div key={value} className="sens-checkbox-matrix-row">
          <span className="sens-checkbox-matrix-title">{CHECKBOX_VALUE_LABEL[value]}</span>
          {states.map((state) => (
            <div key={state} className={mergeClassName("sens-checkbox-matrix-cell", checkboxPreviewClassName(state))}>
              <SensCheckbox {...buildCheckboxPreviewProps(value, state)} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
