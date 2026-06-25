import type { CSSProperties, ReactNode } from "react";
import type { ButtonProps } from "antd";
import { buildShadowD3, buildShadowD4, SHADOW_NONE } from "../design-system/color-utils";
import tokens from "../design-system/tokens.resolved.json";

const c = tokens.color as Record<string, string>;
const u = tokens.unit as Record<string, number>;

/** spacing/horizontal/2․5x — key 使用 U+2024 点号，与 tokens.resolved.json 一致 */
const SP_H_2_5_KEY = "spacing/horizontal/2\u20245x";

export const FAB_RADIUS_PX = u["radius/circular"];
export const FAB_RADIUS = `${FAB_RADIUS_PX}px`;
/** FAB 交叉轴高度：size/component-height/l（常规 Button 仍用 m=32） */
export const FAB_COMPONENT_HEIGHT_PX = u["size/component-height/l"];
export const FAB_COMPONENT_HEIGHT = `${FAB_COMPONENT_HEIGHT_PX}px`;
export const FAB_GROUP_PADDING_OUTER = u["spacing/horizontal/5x"];
export const FAB_GROUP_PADDING_INNER = u[SP_H_2_5_KEY];
/** 竖向组合段内图标：size/icon/m（Figma 16×16） */
export const FAB_ICON_SIZE_PX = u["size/icon/m"];
export const FAB_ICON_SIZE = `${FAB_ICON_SIZE_PX}px`;
/** 单项 FAB 文字/图文横向 padding；与 spacing/horizontal/5x 同源，仅作用于 sens-btn-fab（非组合分段） */
export const FAB_SINGLE_PADDING_HORIZONTAL = FAB_GROUP_PADDING_OUTER;

export type FabTone = "primary" | "secondary";

export type FabPreviewState =
  | "default"
  | "hover"
  | "active"
  | "disabled"
  | "disabledHover"
  | "loading"
  | "loadingHover";

export type FabGroupDirection = "horizontal" | "vertical";

export type FabGroupSegmentPosition = "first" | "mid" | "last";

export interface FabStyleToken {
  primary: string;
  primaryHover: string;
  primaryActive: string;
  bgContainer: string;
  disabledBg: string;
  disabledBorder: string;
  disabledText: string;
  disabledHoverBg: string;
  disabledHoverBorder: string;
  disabledHoverText: string;
}

export interface ButtonShadowToken {
  hover: string;
  floating: string;
}

export function getButtonShadowToken(): ButtonShadowToken {
  return {
    hover: buildShadowD3(),
    floating: buildShadowD4(),
  };
}

export function isFabTone(tone: string): tone is FabTone {
  return tone === "primary" || tone === "secondary";
}

/** 单项 FAB：带 sens-btn-fab class */
export function buildFabToneProps(tone: FabTone): ButtonProps {
  if (tone === "primary") {
    return { color: "primary", variant: "solid", className: "sens-btn-fab sens-btn-fab-primary" };
  }
  return { color: "default", variant: "text", className: "sens-btn-fab sens-btn-fab-secondary" };
}

/** 组合 FAB 分段：独立 class，不带 per-button D4 */
export function buildFabGroupSegmentAntdProps(tone: FabTone): ButtonProps {
  if (tone === "primary") {
    return { color: "primary", variant: "solid", className: "sens-fab-group-segment sens-fab-group-segment--primary" };
  }
  return { color: "default", variant: "text", className: "sens-fab-group-segment sens-fab-group-segment--secondary" };
}

/** 竖向组合 FAB 分段：锁 secondary 结构 + 竖向配色作用域 */
export function buildFabVerticalGroupSegmentAntdProps(): ButtonProps {
  return {
    color: "default",
    variant: "text",
    className: "sens-fab-group-segment sens-fab-group-segment--secondary sens-fab-group-segment--vertical",
  };
}

export function getFabGroupSegmentPosition(index: number, count: number): FabGroupSegmentPosition {
  if (index === 0) return "first";
  if (index === count - 1) return "last";
  return "mid";
}

export function getFabGroupSegmentBorderRadius(
  direction: FabGroupDirection,
  index: number,
  count: number,
): string {
  if (direction === "vertical") {
    if (count <= 1) return FAB_RADIUS;
    if (count === 2) {
      return index === 0 ? `${FAB_RADIUS} ${FAB_RADIUS} 0 0` : `0 0 ${FAB_RADIUS} ${FAB_RADIUS}`;
    }
    if (index === 0) return `${FAB_RADIUS} ${FAB_RADIUS} 0 0`;
    if (index === count - 1) return `0 0 ${FAB_RADIUS} ${FAB_RADIUS}`;
    return "0";
  }
  if (count <= 1) return FAB_RADIUS;
  if (count === 2) {
    return index === 0 ? `${FAB_RADIUS} 0 0 ${FAB_RADIUS}` : `0 ${FAB_RADIUS} ${FAB_RADIUS} 0`;
  }
  if (index === 0) return `${FAB_RADIUS} 0 0 ${FAB_RADIUS}`;
  if (index === count - 1) return `0 ${FAB_RADIUS} ${FAB_RADIUS} 0`;
  return "0";
}

export interface FabGroupSegmentPaddingHorizontal {
  paddingLeft: number;
  paddingRight: number;
}

export interface FabGroupSegmentPaddingVertical {
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
}

/**
 * 横向组合分段 padding：必须用 `paddingInline` 压 antd 主题 `paddingInline:12`，
 * 只设 paddingLeft/Right 会被盖回。竖向仍走 top/bottom/left/right。
 * icon-only 与文字/图文共用外20/内10 分段规则（`isFabIconOnly` 仅用于识别形态，不改 padding 数值）。
 */
export function getFabGroupSegmentPaddingStyle(
  direction: FabGroupDirection,
  index: number,
  count: number,
  content?: ReactNode,
  icon?: ReactNode,
  loading = false,
): CSSProperties {
  const padding = getFabGroupSegmentPadding(direction, index, count);

  if (direction === "vertical") {
    const p = padding as FabGroupSegmentPaddingVertical;
    return {
      paddingTop: p.paddingTop,
      paddingBottom: p.paddingBottom,
      paddingLeft: p.paddingLeft,
      paddingRight: p.paddingRight,
    };
  }

  const { paddingLeft, paddingRight } = padding as FabGroupSegmentPaddingHorizontal;
  return {
    paddingInline: `${paddingLeft}px ${paddingRight}px`,
  };
}

export function getFabGroupSegmentPadding(
  direction: FabGroupDirection,
  index: number,
  count: number,
): FabGroupSegmentPaddingHorizontal | FabGroupSegmentPaddingVertical {
  const outer = FAB_GROUP_PADDING_OUTER;
  const inner = FAB_GROUP_PADDING_INNER;
  const zero = u["spacing/horizontal/none"] ?? 0;

  if (direction === "vertical") {
    if (count === 2) {
      if (index === 0) {
        return { paddingTop: outer, paddingBottom: inner, paddingLeft: zero, paddingRight: zero };
      }
      return { paddingTop: inner, paddingBottom: outer, paddingLeft: zero, paddingRight: zero };
    }
    if (index === 0) {
      return { paddingTop: outer, paddingBottom: inner, paddingLeft: zero, paddingRight: zero };
    }
    if (index === count - 1) {
      return { paddingTop: inner, paddingBottom: outer, paddingLeft: zero, paddingRight: zero };
    }
    return { paddingTop: inner, paddingBottom: inner, paddingLeft: zero, paddingRight: zero };
  }

  if (count === 2) {
    if (index === 0) return { paddingLeft: outer, paddingRight: inner };
    return { paddingLeft: inner, paddingRight: outer };
  }
  if (index === 0) return { paddingLeft: outer, paddingRight: inner };
  if (index === count - 1) return { paddingLeft: inner, paddingRight: outer };
  return { paddingLeft: inner, paddingRight: inner };
}

export function isFabIconOnly(content: ReactNode, icon: ReactNode | undefined, loading: boolean): boolean {
  if (loading || !icon) return false;
  if (content == null) return true;
  if (typeof content === "string" && !content.trim()) return true;
  if (Array.isArray(content) && content.length === 0) return true;
  return false;
}

export function resolveFabShape(
  content: ReactNode,
  icon: ReactNode | undefined,
  loading: boolean,
): NonNullable<ButtonProps["shape"]> {
  return isFabIconOnly(content, icon, loading) ? "circle" : "round";
}

export function getFabRadiusStyle(): CSSProperties {
  return { borderRadius: FAB_RADIUS };
}

/** 一级 FAB 无描边：inline 压 antd css-in-js，保留 1px border-width 盒模型 */
export function getFabPrimaryBorderStyle(): CSSProperties {
  return { borderColor: "transparent" };
}

/** 注入 FAB 高度/图标尺寸 CSS 变量 */
export function getFabCssVars(): CSSProperties {
  return {
    "--sens-fab-height": FAB_COMPONENT_HEIGHT,
    "--sens-fab-icon-size": FAB_ICON_SIZE,
  } as CSSProperties;
}

/** 单项/组合 FAB 交叉轴：文字图文 height=l；纯图标 circle 为 l×l、padding 0 */
export function getFabCrossAxisStyle(
  content: ReactNode,
  icon: ReactNode | undefined,
  loading: boolean,
): CSSProperties {
  if (isFabIconOnly(content, icon, loading)) {
    return {
      width: FAB_COMPONENT_HEIGHT,
      height: FAB_COMPONENT_HEIGHT,
      minWidth: FAB_COMPONENT_HEIGHT,
      minHeight: FAB_COMPONENT_HEIGHT,
      padding: 0,
      paddingInline: 0,
    };
  }
  return {
    height: FAB_COMPONENT_HEIGHT,
    minHeight: FAB_COMPONENT_HEIGHT,
  };
}

/** 横向组合 FAB 分段固定交叉轴高度；纯图标段须 `width:auto` 解开 antd `icon-only` 定宽，否则 padding 20/10 无法撑开 */
export function getFabGroupSegmentCrossAxisStyle(
  direction: FabGroupDirection = "horizontal",
  content?: ReactNode,
  icon?: ReactNode,
  loading = false,
): CSSProperties {
  if (direction === "vertical") {
    return {
      width: FAB_COMPONENT_HEIGHT,
      minWidth: FAB_COMPONENT_HEIGHT,
      maxWidth: FAB_COMPONENT_HEIGHT,
      height: "auto",
      minHeight: 0,
    };
  }
  if (isFabIconOnly(content, icon, loading)) {
    return {
      height: FAB_COMPONENT_HEIGHT,
      minHeight: FAB_COMPONENT_HEIGHT,
      width: "auto",
    };
  }
  return {
    height: FAB_COMPONENT_HEIGHT,
    minHeight: FAB_COMPONENT_HEIGHT,
  };
}

/** 单项 FAB 文字/图文：左右各 spacing/horizontal/5x；纯图标 circle 不设 padding（走 l×l） */
export function getFabSinglePaddingStyle(
  content: ReactNode,
  icon: ReactNode | undefined,
  loading: boolean,
): CSSProperties {
  if (isFabIconOnly(content, icon, loading)) return {};
  return {
    paddingInline: FAB_SINGLE_PADDING_HORIZONTAL,
  };
}

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  const full = normalized.length === 3 ? normalized.split("").map((ch) => ch + ch).join("") : normalized;
  const int = Number.parseInt(full, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getFabSecondaryCssVars(): CSSProperties {
  return {
    "--sens-btn-fab-secondary-text": c["text-color-transparent"],
    "--sens-btn-fab-secondary-text-hover": c["component-hover"],
    "--sens-btn-fab-secondary-text-active": c["component-active"],
    "--sens-btn-fab-secondary-text-disabled": hexToRgba(c["text-color-transparent-disable"], 0.3),
    "--sens-btn-fab-secondary-text-disabled-hover": hexToRgba(c["text-color-transparent-disable"], 0.24),
    "--sens-btn-fab-secondary-bg": c.white,
    "--sens-fab-group-secondary-bg": c.white,
  } as CSSProperties;
}

/** 竖向组合 FAB：图标色阶独立（不走横向二级 text-color / component-hover） */
export function getFabVerticalIconCssVars(): CSSProperties {
  return {
    "--sens-fab-vertical-icon-default": c["icon-color-transparent"],
    "--sens-fab-vertical-icon-hover": c["component-primary"],
    "--sens-fab-vertical-icon-active": c["component-active"],
    "--sens-fab-vertical-bg": c.white,
    "--sens-fab-group-vertical-bg": c.white,
  } as CSSProperties;
}

export type FabVerticalPreviewState = "default" | "hover" | "active";

export const FAB_VERTICAL_PREVIEW_ICON_COLOR: Record<FabVerticalPreviewState, string> = {
  default: c["icon-color-transparent"],
  hover: c["component-primary"],
  active: c["component-active"],
};

export function getFabVerticalIconColor(isHovered: boolean, isPressed: boolean): string {
  if (isPressed) return c["component-active"];
  if (isHovered) return c["component-primary"];
  return c["icon-color-transparent"];
}

export function applyFabVerticalPreviewIconColor(node: HTMLElement | null, state: FabVerticalPreviewState) {
  const color = FAB_VERTICAL_PREVIEW_ICON_COLOR[state];
  if (!node || !color) return;
  node.style.setProperty("color", color, "important");
}

export function getFabVerticalGroupSegmentBaseStyle(index: number, count: number): CSSProperties {
  const padding = getFabGroupSegmentPadding("vertical", index, count) as FabGroupSegmentPaddingVertical;
  return {
    ...getFabVerticalIconCssVars(),
    ...getFabGroupSegmentCrossAxisStyle("vertical"),
    backgroundColor: c.white,
    borderRadius: getFabGroupSegmentBorderRadius("vertical", index, count),
    paddingTop: padding.paddingTop,
    paddingBottom: padding.paddingBottom,
    paddingLeft: padding.paddingLeft,
    paddingRight: padding.paddingRight,
    boxShadow: SHADOW_NONE,
  };
}

export function getFabVerticalGroupSegmentPreviewStyle(
  state: FabVerticalPreviewState,
  index: number,
  count: number,
): CSSProperties {
  const color = FAB_VERTICAL_PREVIEW_ICON_COLOR[state];
  return {
    ...getFabVerticalGroupSegmentBaseStyle(index, count),
    color,
  };
}

export function getFabDefaultSnapshotStyle(tone: FabTone, t: FabStyleToken): CSSProperties {
  if (tone === "primary") {
    return {
      backgroundColor: t.primary,
      borderColor: "transparent",
      color: t.bgContainer,
    };
  }
  return {
    backgroundColor: t.bgContainer,
    borderColor: "transparent",
  };
}

export function getFabHoverSnapshotStyle(tone: FabTone, t: FabStyleToken): CSSProperties {
  if (tone === "primary") {
    return {
      backgroundColor: t.primaryHover,
      borderColor: "transparent",
      color: t.bgContainer,
    };
  }
  return {
    backgroundColor: t.bgContainer,
    borderColor: "transparent",
  };
}

export function getFabActiveSnapshotStyle(tone: FabTone, t: FabStyleToken): CSSProperties {
  if (tone === "primary") {
    return {
      backgroundColor: t.primaryActive,
      borderColor: "transparent",
      color: t.bgContainer,
    };
  }
  return {
    backgroundColor: t.bgContainer,
    borderColor: "transparent",
  };
}

export function getFabDisabledSnapshotStyle(tone: FabTone, t: FabStyleToken): CSSProperties {
  if (tone === "primary") {
    return {
      backgroundColor: t.disabledBg,
      borderColor: "transparent",
      color: t.disabledText,
    };
  }
  return {
    backgroundColor: t.bgContainer,
    borderColor: "transparent",
  };
}

export const FAB_PREVIEW_STATE_COLOR: Partial<Record<FabPreviewState, string>> = {
  default: c["text-color-transparent"],
  hover: c["component-hover"],
  active: c["component-active"],
  disabled: hexToRgba(c["text-color-transparent-disable"], 0.3),
  loading: hexToRgba(c["text-color-transparent-disable"], 0.3),
  disabledHover: hexToRgba(c["text-color-transparent-disable"], 0.24),
  loadingHover: hexToRgba(c["text-color-transparent-disable"], 0.24),
};

export function applyFabPreviewSecondaryColor(node: HTMLElement | null, state: FabPreviewState) {
  const color = FAB_PREVIEW_STATE_COLOR[state];
  if (!node || !color) return;
  node.style.setProperty("color", color, "important");
}

export function getFabSnapshotStyleForState(
  tone: FabTone,
  state: FabPreviewState,
  t: FabStyleToken,
): CSSProperties {
  switch (state) {
    case "default":
      return getFabDefaultSnapshotStyle(tone, t);
    case "hover":
      return getFabHoverSnapshotStyle(tone, t);
    case "active":
      return getFabActiveSnapshotStyle(tone, t);
    case "disabled":
    case "loading":
      return getFabDisabledSnapshotStyle(tone, t);
    case "disabledHover":
    case "loadingHover":
      if (tone === "primary") {
        return {
          backgroundColor: t.disabledHoverBg,
          borderColor: "transparent",
          color: t.disabledHoverText,
        };
      }
      return {
        backgroundColor: t.bgContainer,
        borderColor: "transparent",
      };
    default:
      return {};
  }
}

export function getFabGroupSegmentPreviewStyle(
  tone: FabTone,
  state: FabPreviewState,
  index: number,
  count: number,
  t: FabStyleToken,
  content?: ReactNode,
  icon?: ReactNode,
  loading = false,
): CSSProperties {
  return {
    ...getFabSnapshotStyleForState(tone, state, t),
    borderRadius: getFabGroupSegmentBorderRadius("horizontal", index, count),
    ...getFabGroupSegmentCrossAxisStyle("horizontal", content, icon, loading),
    ...getFabGroupSegmentPaddingStyle("horizontal", index, count, content, icon, loading),
    boxShadow: SHADOW_NONE,
  };
}

export function getFabSinglePreviewStyle(
  tone: FabTone,
  state: FabPreviewState,
  t: FabStyleToken,
  shadowToken: ButtonShadowToken,
): CSSProperties {
  return {
    ...getFabSnapshotStyleForState(tone, state, t),
    borderRadius: FAB_RADIUS,
    boxShadow: shadowToken.floating,
  };
}

export interface FabPreviewCellSnapshot {
  buttonProps: ButtonProps;
  style?: CSSProperties;
  icon?: ReactNode;
}

export function buildFabPreviewCellSnapshot(
  tone: FabTone,
  state: FabPreviewState,
  styleToken: FabStyleToken,
  shadowToken: ButtonShadowToken,
): FabPreviewCellSnapshot {
  let snapshot: FabPreviewCellSnapshot;
  switch (state) {
    case "loading":
      snapshot = {
        buttonProps: {},
        style: getFabDisabledSnapshotStyle(tone, styleToken),
      };
      break;
    case "disabledHover":
    case "loadingHover":
      snapshot = {
        buttonProps: {},
        style: getFabSnapshotStyleForState(tone, state, styleToken),
      };
      break;
    default:
      snapshot = { buttonProps: {}, style: getFabSnapshotStyleForState(tone, state, styleToken) };
  }

  return {
    ...snapshot,
    style: {
      ...snapshot.style,
      borderRadius: FAB_RADIUS,
      boxShadow: shadowToken.floating,
    },
  };
}

export { c as fabColorTokens, u as fabUnitTokens };
