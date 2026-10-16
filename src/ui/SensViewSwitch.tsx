import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { useState } from "react";
import { getColorToken } from "../design-system/color-utils";
import { getDividerColor, getDividerHairlineWidth } from "../design-system/divider";
import { functionalCssVar, buildFunctionalActiveRingShadow } from "../design-system/functional-skin";
import { getTypographyToken } from "../design-system/typography";
import { getUnitToken } from "../design-system/unit";
import { SensIcon } from "../design-system/icons";
import { SensTips } from "./SensTips";
import "./view-switch.css";

export interface SensViewSwitchOption {
  value: string;
  label?: ReactNode;
  icon?: ReactNode;
  /** Accessible name for icon-only options or non-text labels. */
  ariaLabel?: string;
  /** Required by the design guidance for icon-only options. */
  tooltip?: ReactNode;
  disabled?: boolean;
}

export interface SensViewSwitchProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  options: SensViewSwitchOption[];
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

export type SensViewSwitchPreviewState =
  | "default"
  | "hover"
  | "click"
  | "selected"
  | "selectedHover"
  | "selectedClick"
  | "disabled"
  | "disabledHover"
  | "selectedDisabled"
  | "selectedDisabledHover";

type PreviewLayout = "icon-label" | "label" | "icon";

const VIEW_SWITCH_STATES: { value: SensViewSwitchPreviewState; label: string }[] = [
  { value: "default", label: "默认" },
  { value: "hover", label: "悬停" },
  { value: "click", label: "点击" },
  { value: "selected", label: "选中" },
  { value: "selectedHover", label: "选中悬停" },
  { value: "selectedClick", label: "选中点击" },
  { value: "disabled", label: "禁用" },
  { value: "disabledHover", label: "禁用悬停" },
  { value: "selectedDisabled", label: "选中禁用" },
  { value: "selectedDisabledHover", label: "选中禁用悬停" },
];

function px(value: number) {
  return `${value}px`;
}

function buildViewSwitchTokenVars(): CSSProperties {
  return {
    "--sens-view-switch-height": px(getUnitToken("size/component-height/m")),
    "--sens-view-switch-border-width": px(getDividerHairlineWidth()),
    "--sens-view-switch-radius": px(getUnitToken("radius/m")),
    "--sens-view-switch-padding-inline": px(getUnitToken("spacing/horizontal/3x")),
    "--sens-view-switch-icon-gap": px(getUnitToken("spacing/horizontal/1x")),
    "--sens-view-switch-font-size": px(getTypographyToken("font-size/m")),
    "--sens-view-switch-line-height": px(getTypographyToken("line-height/m")),
    "--sens-view-switch-font-weight": String(getTypographyToken("font-weight/regular")),
    "--sens-view-switch-selected-font-weight": String(getTypographyToken("font-weight/medium")),
    "--sens-view-switch-bg": getColorToken("white"),
    "--sens-view-switch-border": getDividerColor("deep", "transparent"),
    "--sens-view-switch-border-hover": functionalCssVar("--sens-skin-primary", "component-primary"),
    "--sens-view-switch-border-active": functionalCssVar("--sens-skin-active", "component-active"),
    "--sens-view-switch-text": getColorToken("text-sub-color-transparent"),
    "--sens-view-switch-text-hover": functionalCssVar("--sens-skin-primary", "component-primary"),
    "--sens-view-switch-text-active": functionalCssVar("--sens-skin-active", "component-active"),
    "--sens-view-switch-selected-bg": functionalCssVar("--sens-skin-active-bg", "component-active-background"),
    "--sens-view-switch-selected-hover-bg": functionalCssVar(
      "--sens-skin-active-hover-bg",
      "component-active-hover-background",
    ),
    "--sens-view-switch-selected-active-bg": functionalCssVar(
      "--sens-skin-active-click-bg",
      "component-active-click-background",
    ),
    "--sens-view-switch-selected-border": functionalCssVar("--sens-skin-primary", "component-primary"),
    "--sens-view-switch-selected-hover-border": functionalCssVar("--sens-skin-hover", "component-hover"),
    "--sens-view-switch-selected-active-border": functionalCssVar("--sens-skin-active", "component-active"),
    "--sens-view-switch-selected-text": functionalCssVar("--sens-skin-primary", "component-primary"),
    "--sens-view-switch-selected-hover-text": functionalCssVar("--sens-skin-hover", "component-hover"),
    "--sens-view-switch-selected-active-text": functionalCssVar("--sens-skin-active", "component-active"),
    "--sens-view-switch-disabled-bg": getColorToken("background-transparent-grey-hover"),
    "--sens-view-switch-disabled-hover-bg": getColorToken("background-transparent-grey"),
    "--sens-view-switch-disabled-border": getDividerColor("deep", "solid"),
    "--sens-view-switch-disabled-hover-border": getDividerColor("outline", "solid"),
    "--sens-view-switch-disabled-text": getColorToken("text-color-transparent-disable"),
    "--sens-view-switch-disabled-hover-text": getColorToken("text-color-transparent-disable-hover"),
    "--sens-view-switch-selected-disabled-border": functionalCssVar(
      "--sens-skin-disable",
      "component-disable",
    ),
    "--sens-view-switch-selected-disabled-hover-border": functionalCssVar(
      "--sens-skin-disable-hover",
      "component-disable-hover",
    ),
    "--sens-view-switch-selected-disabled-text": functionalCssVar("--sens-skin-disable", "component-disable"),
    "--sens-view-switch-selected-disabled-hover-text": functionalCssVar(
      "--sens-skin-disable",
      "component-disable",
    ),
    "--sens-view-switch-selected-disabled-bg": functionalCssVar(
      "--sens-skin-active-bg",
      "component-active-background",
    ),
    "--sens-view-switch-selected-disabled-hover-bg": functionalCssVar(
      "--sens-skin-active-hover-bg",
      "component-active-hover-background",
    ),
    "--sens-view-switch-active-ring": buildFunctionalActiveRingShadow(),
  } as CSSProperties;
}

function getAccessibleName(option: SensViewSwitchOption) {
  if (option.ariaLabel) return option.ariaLabel;
  return typeof option.label === "string" || typeof option.label === "number" ? String(option.label) : undefined;
}

export function SensViewSwitch({
  options,
  value,
  defaultValue,
  disabled = false,
  onChange,
  className,
  style,
  ...rootProps
}: SensViewSwitchProps) {
  const [innerValue, setInnerValue] = useState(
    defaultValue ?? options.find((option) => !option.disabled)?.value,
  );
  const selectedValue = value ?? innerValue;
  const rootClassName = ["sens-view-switch", className].filter(Boolean).join(" ");

  const selectOption = (nextValue: string) => {
    if (disabled || nextValue === selectedValue) return;
    if (value === undefined) setInnerValue(nextValue);
    onChange?.(nextValue);
  };

  return (
    <div
      {...rootProps}
      role="group"
      className={rootClassName}
      style={{ ...buildViewSwitchTokenVars(), ...style }}
    >
      {options.map((option, index) => {
        const selected = option.value === selectedValue;
        const optionDisabled = disabled || Boolean(option.disabled);
        const position = index === 0 ? "first" : index === options.length - 1 ? "last" : "middle";
        const button = (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            aria-label={getAccessibleName(option)}
            disabled={optionDisabled}
            className={`sens-view-switch__option sens-view-switch__option--${position}`}
            onClick={() => selectOption(option.value)}
          >
            {option.icon ? <span className="sens-view-switch__icon" aria-hidden="true">{option.icon}</span> : null}
            {option.label != null ? <span className="sens-view-switch__label">{option.label}</span> : null}
          </button>
        );

        return option.icon && option.label == null && option.tooltip != null ? (
          <SensTips key={option.value} title={option.tooltip} className="sens-view-switch__tip">
            {button}
          </SensTips>
        ) : (
          button
        );
      })}
    </div>
  );
}

function previewOptions(layout: PreviewLayout, state: SensViewSwitchPreviewState): SensViewSwitchOption[] {
  const content = [
    { value: "bar", label: "柱状图", icon: "chart-bar" },
    { value: "table", label: "条形图", icon: "list" },
    { value: "line", label: "折线图", icon: "chart-line" },
  ] as const;
  const isDisabled = state === "disabled" || state === "disabledHover" || state === "selectedDisabled" || state === "selectedDisabledHover";
  return content.map((item) => ({
    value: item.value,
    label: layout === "icon" ? undefined : item.label,
    icon: layout === "label" ? undefined : <SensIcon name={item.icon} sizeToken="size/icon/m" colorRole="inherit" />,
    ariaLabel: item.label,
    tooltip: layout === "icon" ? item.label : undefined,
    disabled: isDisabled,
  }));
}

function previewClass(state: SensViewSwitchPreviewState, index: number, selected: boolean) {
  const hover = state === "hover" || state === "selectedHover" || state === "disabledHover" || state === "selectedDisabledHover";
  const click = state === "click" || state === "selectedClick";
  const disabled = state === "disabled" || state === "disabledHover" || state === "selectedDisabled" || state === "selectedDisabledHover";
  return [
    "sens-view-switch__option",
    index === 0 ? "sens-view-switch__option--first" : index === 2 ? "sens-view-switch__option--last" : "sens-view-switch__option--middle",
    selected ? "sens-view-switch__option--preview-selected" : "",
    hover ? "sens-view-switch__option--preview-hover" : "",
    click ? "sens-view-switch__option--preview-click" : "",
    disabled ? "sens-view-switch__option--preview-disabled" : "",
    state === "disabledHover" || state === "selectedDisabledHover" ? "sens-view-switch__option--preview-disabled-hover" : "",
  ].filter(Boolean).join(" ");
}

export function SensViewSwitchStatesPreview() {
  const layouts: { key: PreviewLayout; title: string }[] = [
    { key: "icon-label", title: "图标 + 文字" },
    { key: "label", title: "纯文字" },
    { key: "icon", title: "纯图标 · 配 Tips" },
  ];
  const selectedValue = (state: SensViewSwitchPreviewState) =>
    state.startsWith("selected") ? "bar" : undefined;

  return (
    <div className="sens-view-switch-matrix" style={buildViewSwitchTokenVars()}>
      {layouts.map((layout) => (
        <section className="sens-view-switch-matrix__layout" key={layout.key}>
          <h3>{layout.title}</h3>
          <div className="sens-view-switch-matrix__rows">
            {VIEW_SWITCH_STATES.map((state) => {
              const selected = selectedValue(state.value);
              return (
                <div className="sens-view-switch-matrix__row" key={state.value}>
                  <span className="sens-view-switch-matrix__state">{state.label}</span>
                  <div className="sens-view-switch" role="group" aria-label={`${layout.title} ${state.label}`}>
                    {previewOptions(layout.key, state.value).map((option, index) => {
                      const checked = option.value === selected;
                      const optionNode = (
                        <button
                          key={option.value}
                          type="button"
                          aria-pressed={checked}
                          aria-label={option.ariaLabel}
                          disabled={option.disabled}
                          tabIndex={-1}
                          className={previewClass(state.value, index, checked)}
                        >
                          {option.icon ? <span className="sens-view-switch__icon" aria-hidden="true">{option.icon}</span> : null}
                          {option.label != null ? <span className="sens-view-switch__label">{option.label}</span> : null}
                        </button>
                      );
                      return layout.key === "icon" ? (
                        <SensTips key={option.value} title={option.tooltip} className="sens-view-switch__tip">
                          {optionNode}
                        </SensTips>
                      ) : optionNode;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
