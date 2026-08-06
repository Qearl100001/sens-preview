import { Children, cloneElement, Fragment, isValidElement, useId, type CSSProperties, type HTMLAttributes, type ReactElement, type ReactNode } from "react";
import { getColorToken, tokenRgba } from "../design-system/color-utils";
import { getDividerColor, getDividerHairlineWidth } from "../design-system/divider";
import { SensIcon } from "../design-system/icons";
import { getTypographyToken } from "../design-system/typography";
import { getUnitToken } from "../design-system/unit";
import { SensTips } from "./SensTips";
import "./form.css";

export type SensFormLayout = "vertical" | "horizontal";
export type SensFormLabelAlign = "control" | "top";

export interface SensFormProps extends HTMLAttributes<HTMLDivElement> {
  layout?: SensFormLayout;
  labelWidth?: number | string;
}

export interface SensFormItemProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode;
  /** DOM id used to associate the label and field. Generated when omitted for a direct control child. */
  controlId?: string;
  /** Submission key forwarded to a direct control child; do not derive it from the visible label. */
  name?: string;
  required?: boolean;
  optional?: ReactNode;
  labelHelp?: ReactNode;
  labelExtra?: ReactNode;
  labelAlign?: SensFormLabelAlign;
  description?: ReactNode;
  error?: ReactNode;
  counter?: ReactNode;
  layout?: SensFormLayout;
  labelWidth?: number | string;
  controlExtra?: ReactNode;
}

export interface SensFormActionsProps extends HTMLAttributes<HTMLDivElement> {
  alignWithControl?: boolean;
  labelWidth?: number | string;
}

function px(value: number): string {
  return `${value}px`;
}

function toCssSize(value: number | string): string {
  return typeof value === "number" ? px(value) : value;
}

function mergeClassName(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

function buildFormTokenVars(labelWidth?: number | string): CSSProperties {
  const resolvedLabelWidth = labelWidth ?? getUnitToken("spacing/10x") * 3;
  const labelFontSize = getTypographyToken("font-size/m");

  return {
    "--sens-form-label-width": toCssSize(resolvedLabelWidth),
    "--sens-form-control-max-width": px(getUnitToken("form/control/max-width")),
    "--sens-form-section-gap": px(getUnitToken("spacing/vertical/10x")),
    "--sens-form-subsection-gap": px(getUnitToken("spacing/vertical/7x")),
    "--sens-form-row-gap": px(getUnitToken("spacing/vertical/5x")),
    "--sens-form-content-gap": px(getUnitToken("spacing/vertical/4x")),
    "--sens-form-label-stack-gap": px(getUnitToken("spacing/vertical/2x")),
    "--sens-form-component-gap": px(getUnitToken("spacing/horizontal/6x")),
    "--sens-form-label-control-gap": px(getUnitToken("spacing/horizontal/4x")),
    "--sens-form-field-gap": px(getUnitToken("spacing/horizontal/2x")),
    "--sens-form-label-inline-gap": px(getUnitToken("spacing/horizontal/1x")),
    "--sens-form-group-content-padding-inline": px(getUnitToken("spacing/horizontal/4x")),
    "--sens-form-message-gap": px(getUnitToken("spacing/vertical/1x")),
    "--sens-form-actions-gap": px(getUnitToken("spacing/horizontal/4x")),
    "--sens-form-text": tokenRgba("text-color-transparent", 0.9),
    "--sens-form-sub-text": tokenRgba("text-sub-color-transparent", 0.58),
    "--sens-form-error": getColorToken("warning-color"),
    "--sens-form-icon": getColorToken("icon-color-transparent"),
    "--sens-form-surface": getColorToken("white"),
    "--sens-form-muted-surface": tokenRgba("background-transparent-grey", 0.04),
    "--sens-form-divider": getDividerColor("light", "transparent"),
    "--sens-form-divider-width": px(getDividerHairlineWidth()),
    "--sens-form-card-radius": px(getUnitToken("radius/l")),
    "--sens-form-control-height": px(getUnitToken("size/component-height/m")),
    "--sens-form-label-font-size": px(labelFontSize),
    "--sens-form-label-line-height": px(getTypographyToken("line-height/m")),
    "--sens-form-label-font-weight": getTypographyToken("font-weight/medium"),
    "--sens-form-label-text-max-width": px(labelFontSize * 8),
    "--sens-form-optional-font-weight": getTypographyToken("font-weight/regular"),
    "--sens-form-help-font-size": px(getTypographyToken("font-size/s")),
    "--sens-form-help-line-height": px(getTypographyToken("line-height/s")),
    "--sens-form-error-icon-size": px(getUnitToken("size/icon/m")),
  } as CSSProperties;
}

function shouldShowLabelTooltip(label: ReactNode): boolean {
  return typeof label === "string" && Array.from(label).length > 8;
}

type FormControlElement = ReactElement<Record<string, unknown>>;

function mergeAriaIds(...values: Array<unknown>): string | undefined {
  const ids = values.flatMap((value) => (typeof value === "string" ? value.split(/\s+/) : []));
  const merged = Array.from(new Set(ids.filter(Boolean)));
  return merged.length > 0 ? merged.join(" ") : undefined;
}

function isDirectControlElement(value: ReactNode): value is FormControlElement {
  return isValidElement(value) && value.type !== Fragment;
}

function getElementTypeName(element: FormControlElement): string | undefined {
  if (typeof element.type === "string") return element.type;
  const type = element.type as { displayName?: string; name?: string };
  return type.displayName ?? type.name;
}

function isGroupControl(element: FormControlElement): boolean {
  const role = element.props.role;
  if (role === "group" || role === "radiogroup") return true;
  return /(?:Radio|Checkbox)Group$/.test(getElementTypeName(element) ?? "");
}

function getControlId(element: FormControlElement | undefined, fallback: string): string {
  const elementId = element?.props.id;
  return typeof elementId === "string" && elementId.length > 0 ? elementId : fallback;
}

export function SensForm({
  layout = "vertical",
  labelWidth,
  className,
  style,
  children,
  ...rootProps
}: SensFormProps) {
  return (
    <div
      {...rootProps}
      className={mergeClassName("sens-form", `sens-form--${layout}`, className)}
      style={{ ...buildFormTokenVars(labelWidth), ...style }}
    >
      {children}
    </div>
  );
}

export function SensFormItem({
  label,
  controlId,
  name,
  required = false,
  optional,
  labelHelp,
  labelExtra,
  labelAlign = "control",
  description,
  error,
  counter,
  layout,
  labelWidth,
  controlExtra,
  className,
  style,
  children,
  ...rootProps
}: SensFormItemProps) {
  const layoutClassName = layout ? `sens-form-item--${layout}` : undefined;
  const metaNode =
    error != null ? (
      <div className="sens-form-item-error" role="alert">
        <span className="sens-form-item-error-icon">
          <SensIcon name="feedback-error" sizeToken="size/icon/m" color="currentColor" />
        </span>
        <span className="sens-form-item-error-text">{error}</span>
      </div>
    ) : description != null ? (
      <div className="sens-form-item-description">{description}</div>
    ) : null;
  const hasMeta = metaNode != null || counter != null;
  const generatedId = useId().replace(/:/g, "");
  const directChild = Children.count(children) === 1 && isDirectControlElement(children) ? children : undefined;
  const resolvedControlId = getControlId(directChild, controlId ?? `sens-form-control-${generatedId}`);
  const labelId = label != null ? `${resolvedControlId}-label` : undefined;
  const metaId = metaNode != null || counter != null ? `${resolvedControlId}-meta` : undefined;
  const groupControl = directChild ? isGroupControl(directChild) : false;
  const enhancedChild = directChild
    ? cloneElement(directChild, {
        id: directChild.props.id ?? resolvedControlId,
        name: directChild.props.name ?? name,
        "aria-labelledby": groupControl
          ? mergeAriaIds(directChild.props["aria-labelledby"], labelId)
          : directChild.props["aria-labelledby"],
        "aria-describedby": mergeAriaIds(directChild.props["aria-describedby"], metaId),
        "aria-required": required ? "true" : directChild.props["aria-required"],
      })
    : children;
  const labelTextTitle = typeof label === "string" && shouldShowLabelTooltip(label) ? label : undefined;
  const labelHelpTitle = typeof labelHelp === "string" ? labelHelp : undefined;

  const labelNode =
    label != null ? (
      <label className="sens-form-item-label-row" id={labelId} htmlFor={!groupControl ? resolvedControlId : undefined}>
        {labelTextTitle ? (
          <SensTips title={labelTextTitle} placement="top">
            <span className="sens-form-item-label-text">{label}</span>
          </SensTips>
        ) : (
          <span className="sens-form-item-label-text">{label}</span>
        )}
        {labelHelp != null ? (
          <SensTips title={labelHelp} placement="top">
            <span
              className="sens-form-item-label-help sens-cursor-default"
              tabIndex={0}
              aria-label={labelHelpTitle ?? "帮助说明"}
            >
              <SensIcon name="help" sizeToken="size/icon/m" color="currentColor" />
            </span>
          </SensTips>
        ) : null}
        {labelExtra != null ? <span className="sens-form-item-label-extra">{labelExtra}</span> : null}
        {optional != null ? <span className="sens-form-item-optional">{optional}</span> : null}
      </label>
    ) : null;

  return (
    <div
      {...rootProps}
      className={mergeClassName(
        "sens-form-item",
        layoutClassName,
        labelAlign === "top" && "sens-form-item--label-top",
        error != null && "sens-form-item--error",
        className,
      )}
      data-required={required ? "true" : undefined}
      style={{ ...buildFormTokenVars(labelWidth), ...style }}
    >
      <div className="sens-form-item-label">{labelNode}</div>
      <div className="sens-form-item-control">
        <div className="sens-form-item-field">
          {enhancedChild}
          {controlExtra != null ? <span className="sens-form-item-control-extra">{controlExtra}</span> : null}
        </div>
        {hasMeta ? (
          <div className="sens-form-item-meta-row" id={metaId}>
            <div className="sens-form-item-meta-content">{metaNode}</div>
            {counter != null ? <div className="sens-form-item-counter">{counter}</div> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function SensFormActions({
  alignWithControl = false,
  labelWidth,
  className,
  style,
  children,
  ...rootProps
}: SensFormActionsProps) {
  return (
    <div
      {...rootProps}
      className={mergeClassName("sens-form-actions", alignWithControl && "sens-form-actions--aligned", className)}
      style={{ ...buildFormTokenVars(labelWidth), ...style }}
    >
      {children}
    </div>
  );
}
