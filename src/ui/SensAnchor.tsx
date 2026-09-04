import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { useFunctionalSkin } from "../design-system/appearance";
import { SensIcon } from "../design-system/icons";
import { buildShadowD4, getColorToken } from "../design-system/color-utils";
import { getFunctionalColors } from "../design-system/functional-skin";
import "./anchor.css";

export type SensAnchorItem = {
  key: string;
  label: ReactNode;
  level?: 0 | 1 | 2 | 3;
  disabled?: boolean;
};

/** 展开触发；`hover` 仅建议用于悬浮卡片模式（mode="popover"，与 SensPopover 无关）。 */
export type SensAnchorExpandTrigger = "click" | "hover";

const ANCHOR_ICON_DEFAULT = getColorToken("icon-color-transparent");
const ANCHOR_ICON_HOVER = getColorToken("link-color");
const ANCHOR_ICON_ACTIVE = getColorToken("link-active-color");

export interface SensAnchorProps {
  items: SensAnchorItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  expanded?: boolean;
  defaultExpanded?: boolean;
  fixed?: boolean;
  /** fixed 常驻 / push 点击挤压 / popover 悬浮卡片（命名历史遗留，不是气泡卡片组件） */
  mode?: "fixed" | "push" | "popover";
  /** 默认 click；悬浮卡片场景可用 hover：进入展开、离开收起 */
  expandTrigger?: SensAnchorExpandTrigger;
  onChange?: (key: string) => void;
  onExpandedChange?: (expanded: boolean) => void;
  missing?: boolean;
  className?: string;
  style?: CSSProperties;
}

function mergeClassName(...names: Array<string | undefined>) {
  return names.filter(Boolean).join(" ");
}

/** 纵向锚点：用于页面内分组导航，不承载路由和业务数据。 */
export function SensAnchor({
  items,
  activeKey,
  defaultActiveKey,
  expanded: controlledExpanded,
  defaultExpanded = true,
  fixed = false,
  mode = "push",
  expandTrigger = "click",
  onChange,
  onExpandedChange,
  missing = false,
  className,
  style,
}: SensAnchorProps) {
  const [innerActiveKey, setInnerActiveKey] = useState(defaultActiveKey ?? items[0]?.key);
  const [innerExpanded, setInnerExpanded] = useState(defaultExpanded);
  const [pressedKey, setPressedKey] = useState<string>();
  const [pressedToggle, setPressedToggle] = useState(false);
  const resolvedActiveKey = activeKey ?? innerActiveKey;
  const resolvedMode = fixed ? "fixed" : mode;
  const expanded = resolvedMode === "fixed" ? true : controlledExpanded ?? innerExpanded;
  const hoverExpand = expandTrigger === "hover" && resolvedMode !== "fixed";
  const functional = getFunctionalColors(useFunctionalSkin());
  const normalizedItems = useMemo(
    () => items.map((item) => ({ ...item, level: item.level ?? 0 })),
    [items],
  );
  const resolvedStyle = {
    ...style,
    "--sens-anchor-primary": functional.primary,
    "--sens-anchor-icon-default": ANCHOR_ICON_DEFAULT,
    "--sens-anchor-icon-hover": ANCHOR_ICON_HOVER,
    "--sens-anchor-icon-active": ANCHOR_ICON_ACTIVE,
    ...(resolvedMode === "popover"
      ? { "--sens-anchor-popover-shadow": buildShadowD4() }
      : null),
  } as CSSProperties;

  const setExpanded = (next: boolean) => {
    if (controlledExpanded === undefined) setInnerExpanded(next);
    onExpandedChange?.(next);
  };

  if (missing) {
    return (
      <div className={mergeClassName("sens-anchor", "sens-anchor-missing", className)} style={resolvedStyle} role="status">
        <SensIcon name="feedback-warning" sizeToken="size/icon/m" color="currentColor" />
        <span>无对应组件</span>
      </div>
    );
  }

  const rootClassName = mergeClassName(
    "sens-anchor",
    expanded ? "sens-anchor-expanded" : "sens-anchor-collapsed",
    `sens-anchor-mode-${resolvedMode}`,
    hoverExpand ? "sens-anchor-expand-hover" : undefined,
    className,
  );

  const hoverHandlers = hoverExpand
    ? {
        onMouseEnter: () => setExpanded(true),
        onMouseLeave: () => setExpanded(false),
      }
    : undefined;

  if (!expanded) {
    return (
      <div className={rootClassName} style={resolvedStyle} {...hoverHandlers}>
        <button
          type="button"
          className={mergeClassName(
            "sens-anchor-collapse-button",
            pressedToggle ? "sens-anchor-collapse-button-pressed" : undefined,
          )}
          aria-label="展开锚点"
          onMouseDown={() => setPressedToggle(true)}
          onMouseUp={() => setPressedToggle(false)}
          onMouseLeave={() => setPressedToggle(false)}
          onBlur={() => setPressedToggle(false)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") setPressedToggle(true);
          }}
          onKeyUp={() => setPressedToggle(false)}
          onClick={() => {
            if (!hoverExpand) setExpanded(true);
          }}
          onFocus={() => {
            if (hoverExpand) setExpanded(true);
          }}
        >
          <SensIcon name="expand-and-collapse-arrow-left" sizeToken="size/icon/m" color="currentColor" />
        </button>
      </div>
    );
  }

  return (
    <div className={rootClassName} style={resolvedStyle} {...hoverHandlers}>
      {resolvedMode === "fixed" ? null : (
        <button
          type="button"
          className={mergeClassName(
            "sens-anchor-collapse-button sens-anchor-collapse-button-floating",
            pressedToggle ? "sens-anchor-collapse-button-pressed" : undefined,
          )}
          aria-label="收起锚点"
          onMouseDown={() => setPressedToggle(true)}
          onMouseUp={() => setPressedToggle(false)}
          onMouseLeave={() => setPressedToggle(false)}
          onBlur={() => setPressedToggle(false)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") setPressedToggle(true);
          }}
          onKeyUp={() => setPressedToggle(false)}
          onClick={() => {
            if (!hoverExpand) setExpanded(false);
          }}
        >
          <SensIcon name="expand-and-collapse-arrow-right" sizeToken="size/icon/m" color="currentColor" />
        </button>
      )}
      <nav className={mergeClassName("sens-anchor-panel", resolvedMode === "popover" ? "sens-anchor-panel-popover" : undefined)} aria-label="页面锚点">
        <div className="sens-anchor-list">
          {resolvedMode === "popover" ? null : <div className="sens-anchor-rail" aria-hidden="true" />}
          {normalizedItems.map((item) => {
            const isActive = item.key === resolvedActiveKey;
            return (
              <button
                key={item.key}
                type="button"
                className={mergeClassName(
                  "sens-anchor-item",
                  isActive ? "sens-anchor-item-active" : undefined,
                  pressedKey === item.key ? "sens-anchor-item-pressed" : undefined,
                  item.disabled ? "sens-anchor-item-disabled" : undefined,
                )}
                style={{ "--sens-anchor-level": item.level } as CSSProperties}
                aria-current={isActive ? "location" : undefined}
                disabled={item.disabled}
                onMouseDown={() => {
                  if (!item.disabled) setPressedKey(item.key);
                }}
                onMouseUp={() => setPressedKey(undefined)}
                onMouseLeave={() => setPressedKey(undefined)}
                onBlur={() => setPressedKey(undefined)}
                onKeyDown={(event) => {
                  if (!item.disabled && (event.key === "Enter" || event.key === " ")) setPressedKey(item.key);
                }}
                onKeyUp={() => setPressedKey(undefined)}
                onClick={() => {
                  if (item.disabled) return;
                  setInnerActiveKey(item.key);
                  onChange?.(item.key);
                }}
              >
                <span className="sens-anchor-item-label">{item.label}</span>
                {isActive ? <span className="sens-anchor-active-mark" aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
