import { useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { getColorByPath, getColorToken, hexToRgba, tokenRgba } from "../design-system/color-utils";
import { SensIcon } from "../design-system/icons";
import { getTypographyToken } from "../design-system/typography";
import { getUnitToken } from "../design-system/unit";

export type TagVariant = "multicolor" | "overlay" | "status";
export type TagColor =
  | "neutral"
  | "red"
  | "yellow"
  | "green"
  | "cyan"
  | "blue"
  | "purple";
export type TagSize = "large" | "small";

/** 状态标签五语义；颜色固定，不可用多色色系替换 */
export type TagStatus = "success" | "processing" | "exception" | "error" | "invalid";

/** 多色/操作标签交互态；仅 clickable 时生效 */
export type TagInteractiveState = "default" | "hover" | "active";

/** 移除图标交互态（热区在关闭钮，与标签体悬停无关） */
export type TagCloseState = "default" | "hover" | "active" | "disabled" | "disabledHover";

export const TAG_STATUS_LABEL: Record<TagStatus, string> = {
  success: "成功",
  processing: "进行中",
  exception: "异常",
  error: "失败",
  invalid: "失效",
};

/** 状态圆点色（状态色 / 失效中性）；文案另用中性色 */
const STATUS_DOT_TOKEN: Record<TagStatus, string> = {
  success: "success-color",
  processing: "link-color",
  exception: "info-color",
  error: "warning-color",
  invalid: "text-color-disable",
};

export type SensTagProps = {
  variant: TagVariant;
  /** multicolor / 操作态；overlay 忽略；status 勿用，改传 status */
  color?: TagColor;
  /** 仅 variant="status"；默认 success */
  status?: TagStatus;
  /** 默认 large */
  size?: TagSize;
  /** status 下忽略 */
  clickable?: boolean;
  /** status 下忽略 */
  closable?: boolean;
  /** status 下忽略 */
  icon?: ReactNode;
  /** status 下忽略 */
  extra?: ReactNode;
  onClick?: () => void;
  onClose?: () => void;
  /** status 下忽略 */
  disabled?: boolean;
  /**
   * 仅预览板静态样张：强制套某交互态 token，不响应真实悬停。
   * 真实业务勿传。
   */
  previewState?: TagInteractiveState;
  /** 仅预览板：强制移除图标态 */
  previewCloseState?: TagCloseState;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

const COLOR_FIGMA: Record<Exclude<TagColor, "neutral">, string> = {
  red: "旭日红",
  yellow: "原野黄",
  green: "极光绿",
  cyan: "山水蓝",
  blue: "冰绽蓝",
  purple: "兰花紫",
};

/** 中性可点悬停/点击走冰绽蓝（Figma 画板 08；无独立中性悬停色） */
const NEUTRAL_INTERACTIVE_FIGMA = COLOR_FIGMA.blue;

type SizeSpec = {
  height: number;
  fontSize: number;
  paddingInline: number;
  gap: number;
  maxWidth: number;
  close: number;
  icon: number;
  statusDot: number;
  statusGap: number;
};

function sizeSpec(size: TagSize): SizeSpec {
  if (size === "small") {
    return {
      height: getUnitToken("size/component-height/xs"),
      fontSize: getTypographyToken("font-size/s"),
      paddingInline: getUnitToken("spacing/horizontal/1.5x"),
      gap: getUnitToken("spacing/1x"),
      maxWidth: 96,
      close: getUnitToken("size/icon/xs"),
      icon: getUnitToken("size/icon/s"),
      statusDot: getUnitToken("size/2xs"),
      statusGap: getUnitToken("spacing/1x"),
    };
  }
  return {
    height: getUnitToken("size/component-height/s"),
    fontSize: getTypographyToken("font-size/m"),
    paddingInline: getUnitToken("spacing/horizontal/2x"),
    gap: getUnitToken("spacing/1x"),
    maxWidth: 112,
    close: getUnitToken("size/icon/s"),
    icon: getUnitToken("size/icon/m"),
    statusDot: getUnitToken("size/mini"),
    statusGap: getUnitToken("spacing/2x"),
  };
}

const DEFAULT_LABEL = () => tokenRgba("text-color-transparent", 0.9);

function coloredPath(figmaName: string, leaf: string): string {
  return getColorByPath(`定制色/标签/${figmaName}/${leaf}`);
}

/**
 * 多色 / 中性表面色。固定色板，不参与功能色换肤。
 * 中性可点悬停/点击 → 冰绽蓝 02/03 + 文字&图标。
 */
export function resolveTagInteractiveSurface(
  color: TagColor,
  state: TagInteractiveState,
): { background: string; color: string } {
  const defaultLabel = DEFAULT_LABEL();

  if (color === "neutral") {
    if (state === "default") {
      return {
        background: tokenRgba("background-01-transparent", 0.08),
        color: defaultLabel,
      };
    }
    if (state === "hover") {
      return {
        background: coloredPath(NEUTRAL_INTERACTIVE_FIGMA, "背景/02_悬停"),
        color: coloredPath(NEUTRAL_INTERACTIVE_FIGMA, "文字&图标/01_悬停"),
      };
    }
    return {
      background: coloredPath(NEUTRAL_INTERACTIVE_FIGMA, "背景/03_点击"),
      color: coloredPath(NEUTRAL_INTERACTIVE_FIGMA, "文字&图标/02_点击"),
    };
  }

  const figma = COLOR_FIGMA[color];
  if (state === "default") {
    return {
      background: coloredPath(figma, "背景/01_默认"),
      color: defaultLabel,
    };
  }
  if (state === "hover") {
    return {
      background: coloredPath(figma, "背景/02_悬停"),
      color: coloredPath(figma, "文字&图标/01_悬停"),
    };
  }
  return {
    background: coloredPath(figma, "背景/03_点击"),
    color: coloredPath(figma, "文字&图标/02_点击"),
  };
}

function resolveSurface(
  variant: Exclude<TagVariant, "status">,
  color: TagColor,
  state: TagInteractiveState,
): { background: string; color: string } {
  if (variant === "overlay") {
    return {
      background: hexToRgba(getColorToken("tag-default-background"), 0.65),
      color: getColorToken("white"),
    };
  }
  return resolveTagInteractiveSurface(color, state);
}

/**
 * 移除图标色（Figma close 15018:40157）。
 * 默认中性图标；悬停/点击走警告红；禁用走 icon disable α。
 * 叠加默认白；悬停/点击仍警告红（删除反馈）。
 */
export function resolveTagCloseColor(
  state: TagCloseState,
  options?: { overlay?: boolean },
): string {
  if (state === "disabled") return tokenRgba("icon-color-transparent-disable", 0.4);
  if (state === "disabledHover") return tokenRgba("icon-color-transparent-disable-hover", 0.3);
  if (state === "hover") return getColorToken("warning-color");
  if (state === "active") return getColorToken("warning-color-active");
  if (options?.overlay) return getColorToken("white");
  return getColorToken("icon-color-transparent");
}

/**
 * Sens 标签。
 * status：五语义；圆点=状态色、文案=中性色；仅进行中圆点带 link-color @0.2 外描边；无点击/移除/禁用。
 * multicolor：固定色板；仅 clickable 时悬停/点击切 背景/02|03 + 文字&图标；中性可点走冰绽蓝。
 * closable：移除图标独立热区；默认 icon / 悬停 warning / 点击 warning-active；资产 `SensIcon name="close"`。
 */
export function SensTag({
  variant,
  color = "neutral",
  status = "success",
  size = "large",
  clickable = false,
  closable = false,
  icon,
  extra,
  onClick,
  onClose,
  disabled = false,
  previewState,
  previewCloseState,
  children,
  className,
  style,
}: SensTagProps) {
  const spec = sizeSpec(size);
  const isStatus = variant === "status";
  const effectiveClickable = isStatus ? false : clickable;
  const effectiveClosable = isStatus ? false : closable;
  const effectiveDisabled = isStatus ? false : disabled;
  const interactive = effectiveClickable && !effectiveDisabled && previewState === undefined;

  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [closeHovered, setCloseHovered] = useState(false);
  const [closePressed, setClosePressed] = useState(false);

  const liveState: TagInteractiveState = pressed ? "active" : hovered ? "hover" : "default";
  const surfaceState: TagInteractiveState =
    previewState ?? (interactive ? liveState : "default");

  const liveCloseState: TagCloseState = effectiveDisabled
    ? closeHovered
      ? "disabledHover"
      : "disabled"
    : closePressed
      ? "active"
      : closeHovered
        ? "hover"
        : "default";
  const closeState: TagCloseState =
    previewCloseState ?? (previewState !== undefined ? "default" : liveCloseState);

  const statusDotColor = getColorToken(STATUS_DOT_TOKEN[status]);
  /** large：主文字 @90%；small：辅助文字 @58%（中性色/文字/03） */
  const statusLabelColor =
    size === "small"
      ? tokenRgba("text-sub-color-transparent", 0.58)
      : tokenRgba("text-color-transparent", 0.9);
  const surface = isStatus
    ? { background: "transparent", color: statusLabelColor }
    : resolveSurface(variant, color, surfaceState);

  const radius = getUnitToken("radius/s");
  const closeColor = resolveTagCloseColor(closeState, { overlay: variant === "overlay" });
  /** 预览禁用细态时用 token α，不再叠整颗 opacity，避免双重变淡 */
  const useRootOpacity =
    effectiveDisabled && previewCloseState === undefined && previewState === undefined;

  const rootStyle: CSSProperties = isStatus
    ? {
        display: "inline-flex",
        alignItems: "center",
        gap: spec.statusGap,
        maxWidth: "100%",
        cursor: "default",
        verticalAlign: "middle",
        ...style,
      }
    : {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: spec.gap,
        boxSizing: "border-box",
        height: spec.height,
        paddingInline: spec.paddingInline,
        paddingBlock: 0,
        borderRadius: radius,
        background: surface.background,
        color: surface.color,
        maxWidth: "100%",
        opacity: useRootOpacity ? 0.4 : 1,
        cursor: effectiveDisabled
          ? "not-allowed"
          : interactive || previewState
            ? "pointer"
            : "default",
        verticalAlign: "middle",
        border: "none",
        ...style,
      };

  const labelStyle: CSSProperties = {
    fontSize: spec.fontSize,
    lineHeight: `${spec.fontSize + (size === "large" ? 8 : 6)}px`,
    fontWeight: getTypographyToken("font-weight/regular"),
    color: surface.color,
    maxWidth: spec.maxWidth,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const handleClick = () => {
    if (!interactive) return;
    onClick?.();
  };

  const handleClose = (event?: MouseEvent) => {
    event?.stopPropagation();
    if (effectiveDisabled) return;
    onClose?.();
  };

  const label = children ?? (isStatus ? TAG_STATUS_LABEL[status] : undefined);
  const labelText = typeof label === "string" ? label : undefined;

  /** 仅进行中：外描边用 link-color @20%，对齐控件 active ring 写法 */
  const processingRing =
    isStatus && status === "processing"
      ? (`0 0 0 2px ${tokenRgba("link-color", 0.2)}` as const)
      : undefined;

  const closeLive = effectiveClosable && previewCloseState === undefined;
  const closeMouseHandlers = closeLive
    ? {
        onMouseEnter: (event: MouseEvent) => {
          event.stopPropagation();
          setCloseHovered(true);
        },
        onMouseLeave: () => {
          setCloseHovered(false);
          setClosePressed(false);
        },
        onMouseDown: (event: MouseEvent) => {
          event.stopPropagation();
          setClosePressed(true);
        },
        onMouseUp: () => setClosePressed(false),
      }
    : undefined;

  /** 可点根是 button 时，关闭用 span，避免嵌套 button */
  const closeAsSpan = interactive;

  const closeNode = effectiveClosable ? (
    closeAsSpan ? (
      <span
        role="button"
        aria-label="移除"
        tabIndex={effectiveDisabled ? -1 : 0}
        onClick={(event) => handleClose(event)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleClose();
          }
        }}
        {...closeMouseHandlers}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          margin: 0,
          border: "none",
          background: "transparent",
          cursor: effectiveDisabled ? "not-allowed" : "pointer",
          lineHeight: 0,
          flexShrink: 0,
        }}
      >
        <SensIcon name="close" size={spec.close} color={closeColor} />
      </span>
    ) : (
      <button
        type="button"
        aria-label="移除"
        disabled={effectiveDisabled}
        onClick={handleClose}
        {...closeMouseHandlers}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          margin: 0,
          border: "none",
          background: "transparent",
          cursor: effectiveDisabled ? "not-allowed" : "pointer",
          lineHeight: 0,
          flexShrink: 0,
        }}
      >
        <SensIcon name="close" size={spec.close} color={closeColor} />
      </button>
    )
  ) : null;

  const content = (
    <>
      {isStatus ? (
        <span
          aria-hidden
          style={{
            width: spec.statusDot,
            height: spec.statusDot,
            borderRadius: "50%",
            background: statusDotColor,
            boxShadow: processingRing,
            flexShrink: 0,
          }}
        />
      ) : null}
      {!isStatus && icon ? (
        <span style={{ display: "inline-flex", flexShrink: 0, width: spec.icon, height: spec.icon }}>
          {icon}
        </span>
      ) : null}
      <span style={labelStyle} title={labelText}>
        {label}
      </span>
      {!isStatus && extra ? (
        <span style={{ display: "inline-flex", flexShrink: 0 }}>{extra}</span>
      ) : null}
      {closeNode}
    </>
  );

  const mouseHandlers = interactive
    ? {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => {
          setHovered(false);
          setPressed(false);
        },
        onMouseDown: () => setPressed(true),
        onMouseUp: () => setPressed(false),
      }
    : undefined;

  if (interactive || (effectiveClickable && previewState !== undefined && !effectiveDisabled)) {
    return (
      <button
        type="button"
        className={className}
        style={{ ...rootStyle, font: "inherit" }}
        disabled={effectiveDisabled}
        onClick={handleClick}
        {...mouseHandlers}
      >
        {content}
      </button>
    );
  }

  return (
    <span className={className} style={rootStyle} {...mouseHandlers}>
      {content}
    </span>
  );
}

const ALL_STATUSES: TagStatus[] = ["success", "processing", "exception", "error", "invalid"];
const ALL_COLORS: TagColor[] = ["neutral", "red", "yellow", "green", "cyan", "blue", "purple"];
const INTERACTIVE_STATES: { state: TagInteractiveState; label: string }[] = [
  { state: "default", label: "默认" },
  { state: "hover", label: "悬停" },
  { state: "active", label: "点击" },
];
const CLOSE_STATES: { state: TagCloseState; label: string; disabled?: boolean }[] = [
  { state: "default", label: "移除默认" },
  { state: "hover", label: "移除悬停" },
  { state: "active", label: "移除点击" },
  { state: "disabled", label: "移除禁用", disabled: true },
  { state: "disabledHover", label: "移除禁用悬停", disabled: true },
];

/** 预览页：六种类型 × 大/小；状态五语义；多色交互；移除图标态 */
export function TagTypesPreview() {
  const gap = getUnitToken("spacing/1x");
  const sectionGap = getUnitToken("spacing/4x");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: sectionGap }}>
      {(
        [
          { title: "3.1 多色", variant: "multicolor" as const, color: "cyan" as const },
          { title: "3.2 叠加", variant: "overlay" as const, color: "neutral" as const },
          {
            title: "3.4 可点击",
            variant: "multicolor" as const,
            color: "neutral" as const,
            clickable: true,
          },
          {
            title: "3.5 可移除",
            variant: "multicolor" as const,
            color: "neutral" as const,
            closable: true,
          },
          {
            title: "3.6 可点击&可移除",
            variant: "multicolor" as const,
            color: "red" as const,
            clickable: true,
            closable: true,
          },
        ] as const
      ).map((row) => (
        <div key={row.title}>
          <div style={{ marginBottom: gap, fontSize: 12, opacity: 0.65 }}>{row.title}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap, alignItems: "center" }}>
            <SensTag
              variant={row.variant}
              color={row.color}
              size="large"
              clickable={"clickable" in row ? row.clickable : false}
              closable={"closable" in row ? row.closable : false}
            >
              {row.variant === "overlay" ? "叠加标签" : "标签文案"}
            </SensTag>
            <SensTag
              variant={row.variant}
              color={row.color}
              size="small"
              clickable={"clickable" in row ? row.clickable : false}
              closable={"closable" in row ? row.closable : false}
            >
              {row.variant === "overlay" ? "叠加标签" : "标签文案"}
            </SensTag>
          </div>
        </div>
      ))}

      <div>
        <div style={{ marginBottom: gap, fontSize: 12, opacity: 0.65 }}>
          3.3 状态（五语义 · 大 / 小 · 无交互）
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap, alignItems: "center" }}>
            {ALL_STATUSES.map((s) => (
              <SensTag key={`l-${s}`} variant="status" status={s} size="large" />
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap, alignItems: "center" }}>
            {ALL_STATUSES.map((s) => (
              <SensTag key={`s-${s}`} variant="status" status={s} size="small" />
            ))}
          </div>
        </div>
      </div>

      <div>
        <div style={{ marginBottom: gap, fontSize: 12, opacity: 0.65 }}>
          多色交互态（可点 · 静态样张 · 中性悬停/点击=冰绽蓝）
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: sectionGap }}>
          {ALL_COLORS.map((c) => (
            <div key={c}>
              <div style={{ marginBottom: gap, fontSize: 12, opacity: 0.55 }}>{c}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap, alignItems: "center" }}>
                {INTERACTIVE_STATES.map(({ state, label }) => (
                  <div
                    key={state}
                    style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-start" }}
                  >
                    <span style={{ fontSize: 11, opacity: 0.5 }}>{label}</span>
                    <SensTag
                      variant="multicolor"
                      color={c}
                      size="large"
                      clickable
                      previewState={state}
                    >
                      标签
                    </SensTag>
                  </div>
                ))}
                <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 11, opacity: 0.5 }}>禁用</span>
                  <SensTag variant="multicolor" color={c} size="large" clickable disabled>
                    标签
                  </SensTag>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={{ marginBottom: gap, fontSize: 12, opacity: 0.65 }}>
          移除图标态（大 / 小 · 悬停 warning-color · 点击 warning-color-active）
        </div>
        {(["large", "small"] as TagSize[]).map((sz) => (
          <div key={sz} style={{ marginBottom: sectionGap }}>
            <div style={{ marginBottom: gap, fontSize: 12, opacity: 0.55 }}>{sz}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap, alignItems: "flex-end" }}>
              {CLOSE_STATES.map(({ state, label, disabled: isDisabled }) => (
                <div
                  key={state}
                  style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-start" }}
                >
                  <span style={{ fontSize: 11, opacity: 0.5 }}>{label}</span>
                  <SensTag
                    variant="multicolor"
                    color="neutral"
                    size={sz}
                    closable
                    disabled={isDisabled}
                    previewCloseState={state}
                  >
                    标签
                  </SensTag>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
