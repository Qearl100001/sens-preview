import tokens from "./tokens.resolved.json";

const c = tokens.color as Record<string, string>;
const colorByPath = tokens.colorByPath as Record<string, string>;
const generatedShadowTokens = (tokens as unknown as { shadow?: Record<string, string> }).shadow ?? {};

export function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  const full = normalized.length === 3 ? normalized.split("").map((ch) => ch + ch).join("") : normalized;
  const int = Number.parseInt(full, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** 从语义 handle 取色并带透明度（禁止在业务里手写 rgba 字面量） */
export function tokenRgba(handle: string, alpha: number): string {
  return hexToRgba(c[handle], alpha);
}

export function getColorToken(handle: string): string {
  return c[handle];
}

/** 从 Figma 变量路径取色，用于基础色板、定制色等尚未抽成语义 handle 的色值 */
export function getColorByPath(path: string): string {
  return colorByPath[path];
}

const SHADOW_NEUTRAL_HANDLE = "mask-01-transparent";

export type ShadowLevel = "D1" | "D2" | "D3" | "D4";
export type ShadowDirection = "down" | "up" | "left" | "right";
export type DrawerShadowDirection = "right";
export type ActiveRingShadowHandle = "component-active-shadow" | "warning-color-active-shadow";

interface ShadowLayer {
  alpha: number;
  blur: number;
}

interface ShadowLevelSpec {
  first: ShadowLayer;
  second: ShadowLayer;
}

const SHADOW_LEVEL_SPECS: Record<ShadowLevel, ShadowLevelSpec> = {
  D1: {
    first: { alpha: 0.2, blur: 1 },
    second: { alpha: 0.1, blur: 2 },
  },
  D2: {
    first: { alpha: 0.08, blur: 4 },
    second: { alpha: 0.04, blur: 8 },
  },
  D3: {
    first: { alpha: 0.1, blur: 6 },
    second: { alpha: 0.04, blur: 12 },
  },
  D4: {
    first: { alpha: 0.1, blur: 12 },
    second: { alpha: 0.08, blur: 20 },
  },
};

const SHADOW_DIRECTION_OFFSETS: Record<ShadowLevel, Record<ShadowDirection, [[number, number], [number, number]]>> = {
  D1: {
    down: [[0, 0], [0, 1]],
    up: [[0, 0], [0, -1]],
    left: [[0, 0], [-1, 0]],
    right: [[0, 0], [1, 0]],
  },
  D2: {
    down: [[0, 1], [0, 2]],
    up: [[0, -1], [0, -2]],
    left: [[-1, 0], [-2, 0]],
    right: [[1, 0], [2, 0]],
  },
  D3: {
    down: [[0, 2], [0, 4]],
    up: [[0, -2], [0, -4]],
    left: [[-2, 0], [-4, 0]],
    right: [[2, 0], [4, 0]],
  },
  D4: {
    down: [[0, 2], [0, 4]],
    up: [[0, -2], [0, -4]],
    left: [[-2, 0], [-4, 0]],
    right: [[2, 0], [4, 0]],
  },
};

export function buildShadow(level: ShadowLevel, direction: ShadowDirection = "down"): string {
  const generatedValue = generatedShadowTokens[`${level}/${direction}`];
  if (generatedValue) return generatedValue;

  const spec = SHADOW_LEVEL_SPECS[level];
  const [firstOffset, secondOffset] = SHADOW_DIRECTION_OFFSETS[level][direction];

  return [
    `${firstOffset[0]}px ${firstOffset[1]}px ${spec.first.blur}px 0 ${tokenRgba(SHADOW_NEUTRAL_HANDLE, spec.first.alpha)}`,
    `${secondOffset[0]}px ${secondOffset[1]}px ${spec.second.blur}px 0 ${tokenRgba(SHADOW_NEUTRAL_HANDLE, spec.second.alpha)}`,
  ].join(", ");
}

/** D1↓：胶囊等选中投影（本次按钮不改引用，供后续 Segmented 等接入） */
export function buildShadowD1(): string {
  return buildShadow("D1");
}

/** D2↓：中低层级容器 / 轻量浮层 */
export function buildShadowD2(): string {
  return buildShadow("D2");
}

/** D3↓：一级/二级（含 dangerSecondary）仅 hover */
export function buildShadowD3(): string {
  return buildShadow("D3");
}

/** D4↓：悬浮按钮全状态恒有 */
export function buildShadowD4(): string {
  return buildShadow("D4");
}

/** 右侧 Drawer 专用侧向投影，来源 Sens.Design 抽屉组件。 */
export function buildDrawerShadow(direction: DrawerShadowDirection = "right"): string {
  const generatedValue = generatedShadowTokens[`drawer/${direction}`];
  if (generatedValue) return generatedValue;

  return [
    `-4px 0 20px 0 ${tokenRgba(SHADOW_NEUTRAL_HANDLE, 0.08)}`,
    `-2px 0 12px 0 ${tokenRgba(SHADOW_NEUTRAL_HANDLE, 0.1)}`,
  ].join(", ");
}

export function buildActiveRingShadow(handle: ActiveRingShadowHandle): string {
  if (handle === "component-active-shadow" && generatedShadowTokens["active-ring/functional"]) {
    return generatedShadowTokens["active-ring/functional"];
  }

  if (handle === "warning-color-active-shadow" && generatedShadowTokens["active-ring/warning"]) {
    return generatedShadowTokens["active-ring/warning"];
  }

  return `0 0 0 2px ${tokenRgba(handle, 0.2)}`;
}

export const SHADOW_NONE = "none" as const;
