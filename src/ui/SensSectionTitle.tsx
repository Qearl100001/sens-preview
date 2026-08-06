import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { getColorToken, tokenRgba } from "../design-system/color-utils";
import { SensIcon } from "../design-system/icons";
import { getTypographyToken } from "../design-system/typography";
import { getUnitToken } from "../design-system/unit";
import { SensTips } from "./SensTips";
import "./section-title.css";
import { functionalCssVar } from "../design-system/functional-skin";

export type SensSectionTitleVariant = "general" | "productLine";
export type SensSectionTitleSize = "large" | "small";

export interface SensSectionTitleProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  children?: ReactNode;
  variant?: SensSectionTitleVariant;
  size?: SensSectionTitleSize;
  /** 辅助说明文案，与标题同一行、基线对齐 */
  description?: ReactNode;
  /** 选填文案，如 `(选填)` */
  optional?: ReactNode;
  /**
   * 帮助 Tips 内容。有值时渲染帮助 icon，hover / focus 出 Tips。
   * 自定义图标仍可通过 `helpIcon` 槽位覆盖。
   */
  help?: ReactNode;
  /** 帮助图标槽位；未传且有 `help` 时默认 `SensIcon name="help"` */
  helpIcon?: ReactNode;
  /** 右侧操作区；仅 `general` + `large` 展示 */
  actions?: ReactNode;
}

function px(value: number): string {
  return `${value}px`;
}

function mergeClassName(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

/** Preview / Demo 容器也可挂同一套 CSS 变量（gap 等写在父级，不能指望子标题继承上来） */
export function buildSectionTitleTokenVars(): CSSProperties {
  return {
    "--sens-section-title-bg": tokenRgba("background-transparent-grey", 0.04),
    "--sens-section-title-text": tokenRgba("text-color-transparent", 0.9),
    "--sens-section-title-sub-text": tokenRgba("text-sub-color-transparent", 0.58),
    "--sens-section-title-icon": getColorToken("icon-color-transparent"),
    "--sens-section-title-accent": functionalCssVar("--sens-skin-primary", "component-primary"),
    "--sens-section-title-surface": getColorToken("white"),
    "--sens-section-title-radius": px(getUnitToken("radius/m")),
    "--sens-section-title-inline-gap": px(getUnitToken("spacing/horizontal/1x")),
    "--sens-section-title-block-gap": px(getUnitToken("spacing/horizontal/2x")),
    "--sens-section-title-actions-gap": px(getUnitToken("spacing/horizontal/4x")),
    /** 主内容与操作区最小分隔（Figma 64；用既有 spacing 相加，非右侧 padding） */
    "--sens-section-title-actions-min-gap": px(
      getUnitToken("spacing/10x") + getUnitToken("spacing/horizontal/6x"),
    ),
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
    /** 选填 / 辅助：细体 400；选填字号跟标题档，辅助仍 s */
    "--sens-section-title-meta-weight": getTypographyToken("font-weight/regular"),
    "--sens-section-title-accent-width": px(getUnitToken("spacing/horizontal/1x")),
    "--sens-section-title-accent-height": px(getUnitToken("size/icon/m")),
    "--sens-section-title-preview-gap": px(getUnitToken("spacing/vertical/4x")),
    "--sens-section-title-preview-card-gap": px(getUnitToken("spacing/vertical/2x")),
    "--sens-section-title-preview-card-padding": px(getUnitToken("spacing/horizontal/4x")),
    "--sens-section-title-preview-card-radius": px(getUnitToken("radius/l")),
  } as CSSProperties;
}

function SectionTitleHelp({
  help,
  helpIcon,
}: {
  help?: ReactNode;
  helpIcon?: ReactNode;
}) {
  const icon = helpIcon ?? (
    <SensIcon name="help" sizeToken="size/icon/m" color="currentColor" />
  );

  if (help == null) {
    if (helpIcon == null) return null;
    return <span className="sens-section-title-help">{helpIcon}</span>;
  }

  return (
    <SensTips title={help} placement="top">
      <span className="sens-section-title-help" tabIndex={0} aria-label="帮助说明">
        {icon}
      </span>
    </SensTips>
  );
}

export function SensSectionTitle({
  title,
  children,
  variant = "general",
  size = "large",
  description,
  optional,
  help,
  helpIcon,
  actions,
  className,
  style,
  ...rootProps
}: SensSectionTitleProps) {
  const titleContent = title ?? children;
  const hasHelp = help != null || helpIcon != null;
  const hasOptional = optional != null;
  const hasDescription = description != null;
  const hasTitleMeta = hasHelp || hasOptional;
  const showActions = variant === "general" && size === "large" && actions != null;

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
              {hasHelp ? <SectionTitleHelp help={help} helpIcon={helpIcon} /> : null}
              {hasOptional ? <span className="sens-section-title-optional">{optional}</span> : null}
            </span>
          ) : null}
          {hasDescription ? <span className="sens-section-title-description">{description}</span> : null}
        </div>
      </div>
      {showActions ? <div className="sens-section-title-actions">{actions}</div> : null}
    </div>
  );
}
