import tokens from "./tokens.resolved.json";

const generatedTypography = (tokens.typography ?? {}) as Record<string, number>;

export const TYPOGRAPHY_TOKEN_NAMES = [
  "font-size/s",
  "font-size/m",
  "font-size/l",
  "font-size/xl",
  "font-size/xxl",
  "font-size/display",
  "line-height/s",
  "line-height/m",
  "line-height/l",
  "line-height/xl",
  "line-height/xxl",
  "line-height/display",
  "font-weight/regular",
  "font-weight/medium",
  "font-weight/semibold",
] as const;

export type TypographyTokenName = (typeof TYPOGRAPHY_TOKEN_NAMES)[number];

const FALLBACK_TYPOGRAPHY_TOKEN: TypographyTokenName = "font-size/m";
const FALLBACK_TYPOGRAPHY_VALUE = 14;

function warnMissingTypographyToken(name: TypographyTokenName): void {
  if (import.meta.env.DEV) {
    console.warn(
      `[typography] missing token "${name}" in tokens.resolved.json; run node build-tokens.mjs`,
    );
  }
}

/** 读取 typography token；优先 tokens.resolved.json，缺失时 dev warn + 单条兜底。 */
export function getTypographyToken(name: TypographyTokenName): number {
  const value = generatedTypography[name];
  if (typeof value === "number") return value;

  warnMissingTypographyToken(name);
  return generatedTypography[FALLBACK_TYPOGRAPHY_TOKEN] ?? FALLBACK_TYPOGRAPHY_VALUE;
}
