import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { getColorToken, tokenRgba } from "../design-system/color-utils";
import { getTypographyToken } from "../design-system/typography";
import { getUnitToken } from "../design-system/unit";
import "./section-title.css";

export type SensSectionTitleVariant = "general" | "productLine";
export type SensSectionTitleSize = "large" | "small";

export interface SensSectionTitleProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  children?: ReactNode;
  variant?: SensSectionTitleVariant;
  size?: SensSectionTitleSize;
  description?: ReactNode;
  helpIcon?: ReactNode;
  actions?: ReactNode;
}

function px(value: number): string {
  return `${value}px`;
}

function mergeClassName(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

function buildSectionTitleTokenVars(): CSSProperties {
  return {
    "--sens-section-title-bg": tokenRgba("background-transparent-grey", 0.04),
    "--sens-section-title-text": tokenRgba("text-color-transparent", 0.9),
    "--sens-section-title-sub-text": tokenRgba("text-sub-color-transparent", 0.58),
    "--sens-section-title-icon": getColorToken("icon-color-transparent"),
    "--sens-section-title-accent": getColorToken("component-primary"),
    "--sens-section-title-surface": getColorToken("white"),
    "--sens-section-title-radius": px(getUnitToken("radius/m")),
    "--sens-section-title-inline-gap": px(getUnitToken("spacing/horizontal/1x")),
    "--sens-section-title-block-gap": px(getUnitToken("spacing/horizontal/2x")),
    "--sens-section-title-actions-gap": px(getUnitToken("spacing/horizontal/4x")),
    "--sens-section-title-actions-offset": px(getUnitToken("spacing/10x") + getUnitToken("spacing/horizontal/6x")),
    "--sens-section-title-large-height": px(getUnitToken("size/component-height/xxl")),
    "--sens-section-title-small-height": px(getUnitToken("size/component-height/l")),
    "--sens-section-title-large-padding-inline": px(getUnitToken("spacing/horizontal/4x")),
    "--sens-section-title-small-padding-inline": px(getUnitToken("spacing/horizontal/2x")),
    "--sens-section-title-large-padding-block": px(getUnitToken("spacing/vertical/3x")),
    "--sens-section-title-small-padding-block": px(getUnitToken("spacing/vertical/1.5x")),
    "--sens-section-title-large-title-size": px(getTypographyToken("font-size/l")),
    "--sens-section-title-large-title-line": px(getTypographyToken("line-height/l")),
    "--sens-section-title-large-title-weight": getTypographyToken("font-weight/semibold"),
    "--sens-section-title-small-title-size": px(getTypographyToken("font-size/m")),
    "--sens-section-title-small-title-line": px(getTypographyToken("line-height/m")),
    "--sens-section-title-small-title-weight": getTypographyToken("font-weight/medium"),
    "--sens-section-title-product-large-title-size": px(getTypographyToken("font-size/xl")),
    "--sens-section-title-product-large-title-line": px(getTypographyToken("line-height/xl")),
    "--sens-section-title-product-large-title-weight": getTypographyToken("font-weight/semibold"),
    "--sens-section-title-product-small-title-size": px(getTypographyToken("font-size/l")),
    "--sens-section-title-product-small-title-line": px(getTypographyToken("line-height/l")),
    "--sens-section-title-product-small-title-weight": getTypographyToken("font-weight/semibold"),
    "--sens-section-title-description-size": px(getTypographyToken("font-size/s")),
    "--sens-section-title-description-line": px(getTypographyToken("line-height/s")),
    "--sens-section-title-accent-width": px(getUnitToken("spacing/horizontal/1x")),
    "--sens-section-title-accent-height": px(getUnitToken("size/icon/m")),
    "--sens-section-title-preview-gap": px(getUnitToken("spacing/vertical/4x")),
    "--sens-section-title-preview-card-gap": px(getUnitToken("spacing/vertical/2x")),
    "--sens-section-title-preview-card-padding": px(getUnitToken("spacing/horizontal/4x")),
    "--sens-section-title-preview-card-radius": px(getUnitToken("radius/l")),
  } as CSSProperties;
}

export function SensSectionTitle({
  title,
  children,
  variant = "general",
  size = "large",
  description,
  helpIcon,
  actions,
  className,
  style,
  ...rootProps
}: SensSectionTitleProps) {
  const titleContent = title ?? children;
  const hasTitleMeta = helpIcon != null;
  const hasDescription = description != null;
  const showActions = variant === "general" && actions != null;

  return (
    <div
      {...rootProps}
      className={mergeClassName(
        "sens-section-title",
        `sens-section-title--${variant}`,
        `sens-section-title--${size}`,
        className,
      )}
      style={{ ...buildSectionTitleTokenVars(), ...style }}
    >
      {variant === "productLine" ? <span className="sens-section-title-accent" aria-hidden="true" /> : null}
      <div className="sens-section-title-main">
        <div className="sens-section-title-title-row">
          <span className="sens-section-title-text">{titleContent}</span>
          {hasTitleMeta ? (
            <span className="sens-section-title-meta">
              {helpIcon != null ? <span className="sens-section-title-help">{helpIcon}</span> : null}
            </span>
          ) : null}
          {hasDescription ? <span className="sens-section-title-description">{description}</span> : null}
        </div>
      </div>
      {showActions ? <div className="sens-section-title-actions">{actions}</div> : null}
    </div>
  );
}
