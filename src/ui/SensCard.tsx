import type { CSSProperties, HTMLAttributes, MouseEvent, ReactNode } from "react";
import {
  buildShadowD3,
  getColorToken,
  tokenRgba,
} from "../design-system/color-utils";
import { getDividerColor, getDividerHairlineWidth } from "../design-system/divider";
import { buildFunctionalActiveRingShadow, functionalCssVar } from "../design-system/functional-skin";
import { getUnitToken } from "../design-system/unit";
import "./card.css";

export type SensCardVariant = "outline" | "filled";

export interface SensCardProps extends HTMLAttributes<HTMLDivElement> {
  /** 白底描边卡片或弱层级色块卡片。 */
  variant?: SensCardVariant;
  /** 启用 hover / pressed 的交互样式；点击语义由宿主通过 onClick / role 提供。 */
  interactive?: boolean;
  /** 是否启用 interactive 卡片的 pressed / 激活投影；操作外露型卡片通常关闭。 */
  pressable?: boolean;
  /** 仅用于选择型卡片的激活视觉，不替代宿主的选择语义。 */
  selected?: boolean;
  /** 禁用卡片交互和内容层级。 */
  disabled?: boolean;
  /** 错误状态卡片。 */
  error?: boolean;
  children?: ReactNode;
}

type SensCardStyle = CSSProperties & Record<`--sens-card-${string}`, string>;

function mergeClassName(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

function buildCardStyle(style?: CSSProperties): SensCardStyle {
  return {
    "--sens-card-radius": `${getUnitToken("radius/l")}px`,
    "--sens-card-padding": `${getUnitToken("spacing/4x")}px`,
    "--sens-card-background": getColorToken("white"),
    "--sens-card-filled-background": tokenRgba("background-transparent-grey", 0.04),
    "--sens-card-border-width": `${getDividerHairlineWidth()}px`,
    "--sens-card-border": getDividerColor("outline", "transparent"),
    "--sens-card-disabled-background": getColorToken("background-grey"),
    "--sens-card-disabled-border": getDividerColor("light", "transparent"),
    "--sens-card-disabled-text": tokenRgba("text-color-transparent-disable", 0.3),
    "--sens-card-error-background": getColorToken("warning-light-background"),
    "--sens-card-error-border": getColorToken("warning-color"),
    "--sens-card-active": functionalCssVar("--sens-skin-active", "component-active"),
    "--sens-card-active-background": functionalCssVar(
      "--sens-skin-active-bg",
      "component-active-background",
    ),
    "--sens-card-hover-shadow": buildShadowD3(),
    "--sens-card-pressed-shadow": buildFunctionalActiveRingShadow(),
    ...style,
  } as SensCardStyle;
}

export function SensCard({
  variant = "outline",
  interactive = false,
  pressable = true,
  selected = false,
  disabled = false,
  error = false,
  className,
  style,
  onClick,
  children,
  ...rootProps
}: SensCardProps) {
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  };

  return (
    <div
      {...rootProps}
      className={mergeClassName(
        "sens-card",
        `sens-card--${variant}`,
        interactive && "sens-card--interactive",
        interactive && pressable && "sens-card--pressable",
        selected && "sens-card--selected",
        disabled && "sens-card--disabled",
        error && "sens-card--error",
        className,
      )}
      data-sens-card
      data-sens-card-state={disabled ? "disabled" : error ? "error" : selected ? "selected" : "default"}
      aria-disabled={disabled || undefined}
      style={buildCardStyle(style)}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}
