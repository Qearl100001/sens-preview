import type { CSSProperties } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getColorToken } from "../design-system/color-utils";
import { getDividerColor } from "../design-system/divider";
import { buildFunctionalActiveRingShadow, functionalCssVar } from "../design-system/functional-skin";
import { SensIcon } from "../design-system/icons";
import { getTypographyToken } from "../design-system/typography";
import { getUnitToken } from "../design-system/unit";
import "./switch.css";

const I18N_NS = "组件库";

export interface SensSwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  loading?: boolean;
  readOnly?: boolean;
  /** 显示 Figma 定义的“已开启 / 已关闭”状态文案；只读态始终显示。 */
  showStatus?: boolean;
  /** 开关需要由调用方提供对象名称；状态文案本身不代替对象名称。 */
  "aria-label"?: string;
  className?: string;
  style?: CSSProperties;
}

export type SensSwitchPreviewState =
  | "default"
  | "hover"
  | "click"
  | "loading"
  | "loadingHover"
  | "disabled"
  | "disabledHover"
  | "readOnly";

function px(value: number) {
  return `${value}px`;
}

function buildSwitchTokenVars(): CSSProperties {
  return {
    "--sens-switch-status-gap": px(getUnitToken("spacing/horizontal/1x")),
    "--sens-switch-status-font-size": px(getTypographyToken("font-size/s")),
    "--sens-switch-status-line-height": px(getTypographyToken("line-height/s")),
    "--sens-switch-off-bg": getColorToken("switch-background"),
    "--sens-switch-off-hover-bg": getColorToken("switch-background-hover"),
    "--sens-switch-off-active-bg": getColorToken("switch-background-active"),
    "--sens-switch-off-disabled-bg": getColorToken("switch-background-disable"),
    "--sens-switch-off-disabled-hover-bg": getColorToken("switch-background-disable-hover"),
    "--sens-switch-on-bg": functionalCssVar("--sens-skin-primary", "component-primary"),
    "--sens-switch-on-hover-bg": functionalCssVar("--sens-skin-hover", "component-hover"),
    "--sens-switch-on-active-bg": functionalCssVar("--sens-skin-active", "component-active"),
    "--sens-switch-on-disabled-bg": functionalCssVar("--sens-skin-disable", "component-disable"),
    "--sens-switch-on-disabled-hover-bg": functionalCssVar("--sens-skin-disable-hover", "component-disable-hover"),
    "--sens-switch-thumb-bg": getColorToken("white"),
    "--sens-switch-status-color": getColorToken("text-sub-color-transparent"),
    "--sens-switch-status-disabled-color": getColorToken("text-color-transparent-disable"),
    "--sens-switch-readonly-off-dot": getColorToken("icon-color-transparent"),
    "--sens-switch-readonly-on-dot": functionalCssVar("--sens-skin-primary", "component-primary"),
    "--sens-switch-loading-off-icon": getColorToken("icon-color-transparent"),
    "--sens-switch-loading-size": px(getUnitToken("size/icon/xs")),
    "--sens-switch-active-ring": buildFunctionalActiveRingShadow(),
    "--sens-switch-warning": getColorToken("warning-color"),
    "--sens-switch-matrix-divider": getDividerColor("deep", "transparent"),
  } as CSSProperties;
}

interface SwitchControlProps {
  checked: boolean;
  disabled?: boolean;
  loading?: boolean;
  previewState?: SensSwitchPreviewState;
  ariaLabel?: string;
  onClick?: () => void;
}

function SwitchControl({ checked, disabled = false, loading = false, previewState, ariaLabel, onClick }: SwitchControlProps) {
  const previewClass = previewState ? `sens-switch__control--preview-${previewState}` : "";
  return (
    <button
      type="button"
      role="switch"
      aria-label={ariaLabel}
      aria-checked={checked}
      aria-busy={loading || undefined}
      aria-disabled={disabled || loading || Boolean(previewState) || undefined}
      disabled={!previewState && (disabled || loading)}
      tabIndex={previewState ? -1 : undefined}
      className={`sens-switch__control${checked ? " is-checked" : ""}${disabled ? " is-disabled" : ""}${loading ? " is-loading" : ""} ${previewClass}`}
      onClick={onClick}
    >
      <span className="sens-switch__thumb" aria-hidden="true">
        {loading ? (
          <span className="sens-switch__loading-icon">
            <SensIcon name="loading" size={getUnitToken("size/icon/xs")} color="currentColor" aria-hidden />
          </span>
        ) : null}
      </span>
    </button>
  );
}

function SwitchVisual({
  checked,
  disabled = false,
  loading = false,
  readOnly = false,
  showStatus = false,
  statusOn,
  statusOff,
  ariaLabel,
  previewState,
  unsupportedReadOnly = false,
  onClick,
}: SwitchControlProps & {
  readOnly?: boolean;
  showStatus?: boolean;
  statusOn: string;
  statusOff: string;
  unsupportedReadOnly?: boolean;
}) {
  const status = checked ? statusOn : statusOff;
  if (readOnly && unsupportedReadOnly) {
    return (
      <span className="sens-switch__unsupported" role="note">
        <SensIcon name="warning-filled" sizeToken="size/icon/s" colorRole="warning" aria-hidden />
        <span>无对应组件</span>
      </span>
    );
  }

  if (readOnly) {
    return (
      <span className="sens-switch__read-only" role="status" aria-label={`${ariaLabel ?? ""} ${status}`.trim()}>
        <span className={`sens-switch__status-dot${checked ? " is-checked" : ""}`} aria-hidden="true" />
        <span className="sens-switch__status-text">{status}</span>
      </span>
    );
  }

  const rootClass = ["sens-switch", checked ? "sens-switch--checked" : "", disabled ? "sens-switch--disabled" : "", loading ? "sens-switch--loading" : ""]
    .filter(Boolean).join(" ");
  return (
    <span className={rootClass}>
      <SwitchControl checked={checked} disabled={disabled} loading={loading} previewState={previewState} ariaLabel={ariaLabel} onClick={onClick} />
      {showStatus ? <span className={`sens-switch__status-text${disabled ? " is-disabled" : ""}`}>{status}</span> : null}
    </span>
  );
}

export function SensSwitch({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  loading = false,
  readOnly = false,
  showStatus = false,
  "aria-label": ariaLabel,
  className,
  style,
}: SensSwitchProps) {
  const { t } = useTranslation();
  const [innerChecked, setInnerChecked] = useState(defaultChecked);
  const currentChecked = checked ?? innerChecked;
  const isControlled = checked !== undefined;
  const statusOn = t(`${I18N_NS}.sensd-switch-checked`, { defaultValue: "已开启" });
  const statusOff = t(`${I18N_NS}.sensd-switch-unchecked`, { defaultValue: "已关闭" });
  const nextChecked = () => {
    if (disabled || loading || readOnly) return;
    const next = !currentChecked;
    if (!isControlled) setInnerChecked(next);
    onChange?.(next);
  };

  return (
    <span className={["sens-switch-host", className].filter(Boolean).join(" ")} style={{ ...buildSwitchTokenVars(), ...style }}>
      <SwitchVisual
        checked={currentChecked}
        disabled={disabled}
        loading={loading}
        readOnly={readOnly}
        showStatus={showStatus}
        statusOn={statusOn}
        statusOff={statusOff}
        ariaLabel={ariaLabel}
        onClick={nextChecked}
      />
    </span>
  );
}

const PREVIEW_STATES: { value: SensSwitchPreviewState; label: string }[] = [
  { value: "default", label: "默认" },
  { value: "hover", label: "悬停" },
  { value: "click", label: "点击" },
  { value: "loading", label: "加载" },
  { value: "loadingHover", label: "加载悬停" },
  { value: "disabled", label: "禁用" },
  { value: "disabledHover", label: "禁用悬停" },
  { value: "readOnly", label: "只读" },
];

function previewMode(state: SensSwitchPreviewState, checked: boolean) {
  return {
    checked,
    disabled: state === "disabled" || state === "disabledHover",
    loading: state === "loading" || state === "loadingHover",
    readOnly: state === "readOnly",
  };
}

export function SensSwitchStatesPreview() {
  const { t } = useTranslation();
  const statusOn = t(`${I18N_NS}.sensd-switch-checked`, { defaultValue: "已开启" });
  const statusOff = t(`${I18N_NS}.sensd-switch-unchecked`, { defaultValue: "已关闭" });

  return (
    <div className="sens-switch-matrix-wrap" style={buildSwitchTokenVars()}>
      <div className="sens-switch-matrix" role="table" aria-label="开关状态矩阵">
        <div className="sens-switch-matrix__header" role="row">
          <span role="columnheader">取值 / 状态</span>
          {PREVIEW_STATES.map((state) => <span key={state.value} role="columnheader">{state.label}</span>)}
        </div>
        {[false, true].flatMap((checked) => [false, true].map((showStatus) => (
          <div className="sens-switch-matrix__row" role="row" key={`${checked}-${showStatus}`}>
            <span className="sens-switch-matrix__row-label" role="rowheader">
              {checked ? "开启" : "关闭"}{showStatus ? " · 含状态文案" : " · 不含状态文案"}
            </span>
            {PREVIEW_STATES.map(({ value }) => {
              const mode = previewMode(value, checked);
              return (
                <span className="sens-switch-matrix__cell" role="cell" key={value}>
                  <SwitchVisual
                    {...mode}
                    showStatus={showStatus}
                    statusOn={statusOn}
                    statusOff={statusOff}
                    ariaLabel={checked ? statusOn : statusOff}
                    previewState={value}
                    unsupportedReadOnly={mode.readOnly && !showStatus}
                  />
                </span>
              );
            })}
          </div>
        )))}
      </div>
    </div>
  );
}
