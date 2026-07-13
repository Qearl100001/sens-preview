import tokens from "./tokens.resolved.json";

const unitTokens = (tokens.unit ?? {}) as Record<string, number>;

/** Figma unit.json 中小数 key 使用 U+2024（如 spacing/0․5x），与 ASCII 句点不等价。 */
const FRACTIONAL_DOT = "\u2024";

/** 将 `spacing/0.5x` 等 ASCII 写法归一为 `spacing/0․5x`。 */
export function normalizeUnitTokenName(name: string): string {
  return name.replace(/(\d)\.(\d)/g, `$1${FRACTIONAL_DOT}$2`);
}

function warnMissingUnitToken(name: string): void {
  if (import.meta.env.DEV) {
    console.warn(
      `[unit] missing token "${name}" in tokens.resolved.json; run node build-tokens.mjs`,
    );
  }
}

/** 读取 spacing / size / radius 等 unit token；优先 tokens.resolved.json，缺失时 dev warn + 0 兜底。 */
export function getUnitToken(name: string): number {
  const candidates = [name, normalizeUnitTokenName(name)];

  for (const key of candidates) {
    const value = unitTokens[key];
    if (typeof value === "number") return value;
  }

  warnMissingUnitToken(name);
  return 0;
}
