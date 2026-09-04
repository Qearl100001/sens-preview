import { useState, type CSSProperties, type ReactNode } from "react";
import { getColorToken, tokenRgba } from "../design-system/color-utils";
import { functionalCssVar, getFunctionalColors } from "../design-system/functional-skin";
import { useSensAppearance } from "../design-system/appearance";
import { getTypographyToken } from "../design-system/typography";
import { getUnitToken } from "../design-system/unit";
import { SensIcon } from "../design-system/icons";
import "./steps.css";

export type SensStepsSize = "large" | "small";
export type SensStepStatus = "wait" | "current" | "process" | "finish" | "loading" | "disabled";

export interface SensStepItem {
  key: string;
  title: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  /**
   * 是否已通过「下一步」完成该步。
   * `false` 时即使下标小于 current 也保持等待（未改完就离开仍是红数字，不是红对勾）。
   * 未传时仍按 current 推导。
   */
  completed?: boolean;
  /** Marks the step as failed while preserving its lifecycle status. */
  error?: boolean;
  status?: SensStepStatus;
}

function resolveStepCompleted(item: SensStepItem, index: number, current: number): boolean {
  if (item.completed === true) return true;
  if (item.completed === false) return false;
  if (item.status === "finish") return true;
  if (item.status) return false;
  return index < current;
}

function resolveStepStatus(item: SensStepItem, index: number, current: number, completed: boolean): SensStepStatus {
  const raw = item.status ?? (index === current ? "current" : completed ? "finish" : "wait");
  return raw === "process" ? "current" : raw;
}

export interface SensStepsProps {
  items: SensStepItem[];
  current?: number;
  defaultCurrent?: number;
  size?: SensStepsSize;
  className?: string;
  onChange?: (current: number, item: SensStepItem) => void;
}

function buildStepVars(size: SensStepsSize, functionalSkin: ReturnType<typeof getFunctionalColors>): CSSProperties {
  const functional = functionalSkin;
  return {
    "--sens-steps-primary": functional.primary,
    "--sens-steps-primary-hover": functionalCssVar("--sens-skin-primary", "component-primary"),
    "--sens-steps-primary-active": functionalCssVar("--sens-skin-active", "component-active"),
    "--sens-steps-light-bg": functional.lightBackground,
    "--sens-steps-text": getColorToken("text-color"),
    "--sens-steps-text-strong": tokenRgba("text-color-transparent", 0.9),
    "--sens-steps-sub-text": getColorToken("text-sub-color-transparent"),
    "--sens-steps-muted": getColorToken("icon-color-transparent"),
    "--sens-steps-loading-icon": getColorToken("icon-color-transparent-disable"),
    "--sens-steps-loading-icon-hover": getColorToken("icon-color-transparent-disable-hover"),
    "--sens-steps-loading-text": getColorToken("text-color-transparent-disable"),
    "--sens-steps-loading-text-hover": getColorToken("text-color-transparent-disable-hover"),
    "--sens-steps-number-bg": getColorToken("background-transparent-grey"),
    "--sens-steps-border": getColorToken("outline-color"),
    "--sens-steps-line": tokenRgba("outline-color-transparent", 0.3),
    "--sens-steps-primary-text": getColorToken("white"),
    "--sens-steps-warning": getColorToken("warning-color"),
    "--sens-steps-warning-hover": getColorToken("warning-color-hover"),
    "--sens-steps-warning-active": getColorToken("warning-color-active"),
    "--sens-steps-warning-bg": getColorToken("warning-light-background"),
    "--sens-steps-warning-border": getColorToken("warning-color"),
    "--sens-steps-size": `${getUnitToken(size === "large" ? "size/component-height/m" : "size/component-height/s")}px`,
    "--sens-steps-number-size": `${getTypographyToken(size === "large" ? "font-size/l" : "font-size/s")}px`,
    "--sens-steps-number-line": `${getTypographyToken(size === "large" ? "line-height/l" : "line-height/s")}px`,
    "--sens-steps-title-size": `${getTypographyToken(size === "large" ? "font-size/l" : "font-size/s")}px`,
    "--sens-steps-title-line": `${getTypographyToken(size === "large" ? "line-height/l" : "line-height/s")}px`,
    "--sens-steps-title-weight": String(getTypographyToken("font-weight/regular")),
    "--sens-steps-title-weight-current": String(getTypographyToken("font-weight/semibold")),
    "--sens-steps-number-weight": String(getTypographyToken("font-weight/regular")),
    "--sens-steps-description-size": `${getTypographyToken("font-size/s")}px`,
    "--sens-steps-description-line": `${getTypographyToken("line-height/s")}px`,
    "--sens-steps-title-gap": `${getUnitToken("spacing/vertical/1x")}px`,
    "--sens-steps-item-gap": `${getUnitToken("spacing/horizontal/2x")}px`,
    "--sens-steps-number-radius": `${getUnitToken("radius/circular")}px`,
    "--sens-steps-focus-shadow": `0 0 0 2px ${functionalCssVar("--sens-skin-active", "component-active")}`,
  } as CSSProperties;
}

export function SensSteps({ items, current, defaultCurrent = 0, size = "large", className, onChange }: SensStepsProps) {
  const { functionalSkin } = useSensAppearance();
  const [innerCurrent, setInnerCurrent] = useState(defaultCurrent);
  const resolvedCurrent = Math.min(Math.max(current ?? innerCurrent, -1), Math.max(items.length - 1, 0));
  const functional = getFunctionalColors(functionalSkin);

  return (
    <nav
      className={["sens-steps", `sens-steps--${size}`, className].filter(Boolean).join(" ")}
      aria-label="步骤条"
      style={buildStepVars(size, functional)}
    >
      {items.map((item, index) => {
        const completed = resolveStepCompleted(item, index, resolvedCurrent);
        const status = resolveStepStatus(item, index, resolvedCurrent, completed);
        const disabled = item.disabled || status === "disabled";
        const error = Boolean(item.error);
        const interactive = Boolean(onChange) && !disabled && status !== "loading";
        const iconSize = size === "small" ? 16 : 18;
        const handleClick = () => {
          if (!interactive) return;
          if (current === undefined) setInnerCurrent(index);
          onChange?.(index, item);
        };
        return (
          <div className="sens-steps__item" key={item.key}>
            <button
              className={["sens-steps__title-wrap", `sens-steps__title-wrap--${status}`, error ? "sens-steps__title-wrap--error" : "", disabled ? "sens-steps__title-wrap--disabled" : ""].filter(Boolean).join(" ")}
              type="button"
              disabled={!interactive}
              aria-current={status === "current" ? "step" : undefined}
              onClick={handleClick}
            >
              <span className="sens-steps__row">
                <span className="sens-steps__number" aria-hidden>
                  {status === "loading" ? (
                    <SensIcon name="loading" size={iconSize} className="sens-steps__loading-icon" color="currentColor" />
                  ) : status === "finish" ? (
                    <SensIcon
                      name="check"
                      size={iconSize}
                      color={error ? "currentColor" : undefined}
                      colorRole={error ? undefined : "functional"}
                    />
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="sens-steps__text"><span className="sens-steps__title">{item.title}</span></span>
              </span>
              {item.description ? <span className="sens-steps__description">{item.description}</span> : null}
            </button>
            {index < items.length - 1 ? <span className={`sens-steps__line sens-steps__line--${completed ? "finish" : "wait"}`} aria-hidden /> : null}
          </div>
        );
      })}
    </nav>
  );
}
