import tokens from "./tokens.resolved.json";

const generatedTypography = (tokens.typography ?? {}) as Record<string, number>;

export const SENS_FONT_FAMILY =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';

const SENS_FONT_ROOT_STYLE_ID = "sens-font-family-root";

/**
 * 将 Sens 字体栈挂到 html/body/#root，保证非 antd 节点与文档根继承同一来源。
 * 字体主权在 Sens；antd 只通过 theme.token.fontFamily 承接，不定义字体。
 */
export function applySensFontFamilyToDocument(doc: Document = document): void {
  if (doc.getElementById(SENS_FONT_ROOT_STYLE_ID)) return;
  const style = doc.createElement("style");
  style.id = SENS_FONT_ROOT_STYLE_ID;
  style.textContent = `html, body, #root { font-family: ${SENS_FONT_FAMILY}; }`;
  doc.head.appendChild(style);
}

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
