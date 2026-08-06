import type { CSSProperties, KeyboardEvent, ReactNode } from "react";
import { getColorToken, tokenRgba } from "../design-system/color-utils";
import { getTypographyToken } from "../design-system/typography";
import { getUnitToken } from "../design-system/unit";
import { SensCard, type SensCardProps } from "./SensCard";
import "./entry-card.css";

export type SensEntryCardSize = "large" | "small";

export interface SensEntryCardProps extends Omit<SensCardProps, "children" | "title"> {
  /** 入口卡片中的彩色业务图标或 SensIcon。 */
  icon: ReactNode;
  /** 入口名称；入口卡片标题不允许折行。 */
  title: ReactNode;
  /** 用于解释入口能力的辅助信息。 */
  description: ReactNode;
  /** 大号入口或小号入口。 */
  size?: SensEntryCardSize;
}

type SensEntryCardStyle = CSSProperties & Record<`--sens-entry-card-${string}`, string>;

function mergeClassName(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

function buildEntryCardStyle(size: SensEntryCardSize, style?: CSSProperties): SensEntryCardStyle {
  const spacing = getUnitToken("spacing/3x");
  const iconSize = size === "large" ? getUnitToken("size/xxl") + spacing : getUnitToken("size/xxl");

  return {
    "--sens-entry-card-padding": `${spacing}px`,
    "--sens-entry-card-gap": `${spacing}px`,
    "--sens-entry-card-text-gap": `${getUnitToken("spacing/1x")}px`,
    "--sens-entry-card-icon-size": `${iconSize}px`,
    "--sens-entry-card-pressed-radius": `${getUnitToken("radius/m")}px`,
    "--sens-entry-card-title-size": `${getTypographyToken(size === "large" ? "font-size/l" : "font-size/m")}px`,
    "--sens-entry-card-title-line": `${getTypographyToken(size === "large" ? "line-height/l" : "line-height/m")}px`,
    "--sens-entry-card-title-weight": `${getTypographyToken(size === "large" ? "font-weight/semibold" : "font-weight/medium")}`,
    "--sens-entry-card-description-size": `${getTypographyToken("font-size/s")}px`,
    "--sens-entry-card-description-line": `${getTypographyToken("line-height/s")}px`,
    "--sens-entry-card-title-color": tokenRgba("text-color-transparent", 0.9),
    "--sens-entry-card-description-color": tokenRgba("text-sub-color-transparent", 0.58),
    "--sens-entry-card-icon-color": getColorToken("icon-color-transparent"),
    ...style,
  } as SensEntryCardStyle;
}

export function SensEntryCard({
  size = "large",
  icon,
  title,
  description,
  className,
  style,
  interactive = true,
  pressable = true,
  disabled = false,
  onKeyDown,
  tabIndex,
  role,
  ...cardProps
}: SensEntryCardProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled || !interactive) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.currentTarget.click();
    }
  };

  return (
    <SensCard
      {...cardProps}
      className={mergeClassName("sens-entry-card", `sens-entry-card--${size}`, className)}
      style={buildEntryCardStyle(size, style)}
      interactive={interactive}
      pressable={pressable}
      disabled={disabled}
      role={role ?? (interactive ? "button" : undefined)}
      tabIndex={tabIndex ?? (interactive && !disabled ? 0 : -1)}
      onKeyDown={handleKeyDown}
    >
      <span className="sens-entry-card__icon" aria-hidden="true">
        {icon}
      </span>
      <span className="sens-entry-card__text">
        <span className="sens-entry-card__title">{title}</span>
        <span className="sens-entry-card__description">{description}</span>
      </span>
    </SensCard>
  );
}
