import tokens from "./tokens.resolved.json";

const c = tokens.color as Record<string, string>;

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

const SHADOW_NEUTRAL_HANDLE = "mask-01-transparent";

/** D1↓：胶囊等选中投影（本次按钮不改引用，供后续 Segmented 等接入） */
export function buildShadowD1(): string {
  return `0 0 1px 0 ${tokenRgba(SHADOW_NEUTRAL_HANDLE, 0.2)}, 0 1px 2px 0 ${tokenRgba(SHADOW_NEUTRAL_HANDLE, 0.1)}`;
}

/** D3↓：一级/二级（含 dangerSecondary）仅 hover */
export function buildShadowD3(): string {
  return `0 2px 6px 0 ${tokenRgba(SHADOW_NEUTRAL_HANDLE, 0.1)}, 0 4px 12px 0 ${tokenRgba(SHADOW_NEUTRAL_HANDLE, 0.04)}`;
}

/** D4↓：悬浮按钮全状态恒有 */
export function buildShadowD4(): string {
  return `0 2px 12px 0 ${tokenRgba(SHADOW_NEUTRAL_HANDLE, 0.1)}, 0 4px 20px 0 ${tokenRgba(SHADOW_NEUTRAL_HANDLE, 0.08)}`;
}

export const SHADOW_NONE = "none" as const;
