import tokens from "./tokens.resolved.json";

const generatedTypography = tokens.typography as Record<string, number>;

export const typographyTokenFallbacks = {
  "font-size/s": 12,
  "line-height/s": 18,
  "font-size/m": 14,
  "line-height/m": 22,
  "font-size/l": 16,
  "line-height/l": 24,
  "font-size/xl": 18,
  "line-height/xl": 28,
  "font-size/xxl": 20,
  "line-height/xxl": 30,
  "font-size/display": 28,
  "line-height/display": 42,
  "font-weight/regular": 400,
  "font-weight/medium": 500,
  "font-weight/semibold": 600,
} as const;

export type TypographyTokenName = keyof typeof typographyTokenFallbacks;

export function getTypographyToken(name: TypographyTokenName): number {
  return generatedTypography[name] ?? typographyTokenFallbacks[name];
}
