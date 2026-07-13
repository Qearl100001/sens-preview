import { getColorToken } from "./color-utils";
import tokens from "./tokens.resolved.json";

export type DividerTone = "deep" | "outline" | "light" | "weak";
export type DividerColorMode = "transparent" | "solid";

/** 颜色 handle ↔ Divider Foundation token 权威对照；样张与迁移审计用。 */
export interface DividerHandleMapping {
  tokenName: string;
  tone: DividerTone;
  mode: DividerColorMode;
  transparentHandle: string;
  solidHandle: string;
  alpha: number;
  figmaName: string;
  recommendedApi: string;
  legacyTransparentApi: string;
}

export const DIVIDER_HANDLE_MAPPINGS: DividerHandleMapping[] = [
  {
    tokenName: "divider/color/deep/transparent",
    tone: "deep",
    mode: "transparent",
    transparentHandle: "divideline-color-transparent-dack",
    solidHandle: "divideline-color-dack",
    alpha: 0.16,
    figmaName: "线/01_深分割线",
    recommendedApi: 'getDividerColor("deep", "transparent")',
    legacyTransparentApi: 'tokenRgba("divideline-color-transparent-dack", 0.16)',
  },
  {
    tokenName: "divider/color/outline/transparent",
    tone: "outline",
    mode: "transparent",
    transparentHandle: "outline-color-transparent",
    solidHandle: "outline-color",
    alpha: 0.12,
    figmaName: "线/02_描边",
    recommendedApi: 'getDividerColor("outline", "transparent")',
    legacyTransparentApi: 'tokenRgba("outline-color-transparent", 0.12)',
  },
  {
    tokenName: "divider/color/light/transparent",
    tone: "light",
    mode: "transparent",
    transparentHandle: "divideline-color-transparent-light",
    solidHandle: "divideline-color-light",
    alpha: 0.08,
    figmaName: "线/03_浅分割线",
    recommendedApi: 'getDividerColor("light", "transparent")',
    legacyTransparentApi: 'tokenRgba("divideline-color-transparent-light", 0.08)',
  },
  {
    tokenName: "divider/color/weak/transparent",
    tone: "weak",
    mode: "transparent",
    transparentHandle: "line-color-transparent",
    solidHandle: "line-color",
    alpha: 0.06,
    figmaName: "线/04",
    recommendedApi: 'getDividerColor("weak", "transparent")',
    legacyTransparentApi: 'tokenRgba("line-color-transparent", 0.06)',
  },
];

const dividerHandleLookup = new Map<string, { tone: DividerTone; mode: DividerColorMode }>();

for (const mapping of DIVIDER_HANDLE_MAPPINGS) {
  dividerHandleLookup.set(mapping.transparentHandle, { tone: mapping.tone, mode: "transparent" });
  dividerHandleLookup.set(mapping.solidHandle, { tone: mapping.tone, mode: "solid" });
}

/** 从旧颜色 handle 解析 divider tone/mode；未知 handle 返回 null。 */
export function resolveDividerFromColorHandle(
  handle: string,
): { tone: DividerTone; mode: DividerColorMode } | null {
  return dividerHandleLookup.get(handle) ?? null;
}

const generatedDividerTokens =
  ((tokens as unknown as { divider?: Record<string, string | number> }).divider ?? {});

const FALLBACK_DIVIDER_COLOR_HANDLE = "outline-color";
const FALLBACK_DIVIDER_HAIRLINE_WIDTH = 1;

function dividerResolvedColorKey(tone: DividerTone, mode: DividerColorMode): string {
  return `color/${tone}/${mode}`;
}

function warnMissingDividerToken(tokenName: string): void {
  if (import.meta.env.DEV) {
    console.warn(
      `[divider] missing token "${tokenName}" in tokens.resolved.json; run node build-tokens.mjs`,
    );
  }
}

export function getDividerTokenName(tone: DividerTone, mode: DividerColorMode = "transparent"): string {
  return `divider/${dividerResolvedColorKey(tone, mode)}`;
}

/** 读取分割线色；优先 tokens.resolved.json，缺失时 dev warn + outline 单色兜底。 */
export function getDividerColor(tone: DividerTone, mode: DividerColorMode = "transparent"): string {
  const resolvedKey = dividerResolvedColorKey(tone, mode);
  const generatedValue = generatedDividerTokens[resolvedKey];

  if (typeof generatedValue === "string") {
    return generatedValue;
  }

  warnMissingDividerToken(getDividerTokenName(tone, mode));
  return getColorToken(FALLBACK_DIVIDER_COLOR_HANDLE);
}

/** 读取 hairline 线宽；优先 tokens.resolved.json，缺失时 dev warn + 1px 兜底。 */
export function getDividerHairlineWidth(): number {
  const generatedWidth = generatedDividerTokens["width/hairline"];
  if (typeof generatedWidth === "number") return generatedWidth;

  warnMissingDividerToken("divider/width/hairline");
  return FALLBACK_DIVIDER_HAIRLINE_WIDTH;
}

export function getDividerBorder(tone: DividerTone, mode: DividerColorMode = "transparent"): string {
  return `${getDividerHairlineWidth()}px solid ${getDividerColor(tone, mode)}`;
}
