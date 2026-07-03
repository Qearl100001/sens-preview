import { getColorToken, tokenRgba } from "./color-utils";
import tokens from "./tokens.resolved.json";

export type DividerTone = "deep" | "outline" | "light" | "weak";
export type DividerColorMode = "transparent" | "solid";

export const dividerWidthTokens = {
  "divider/width/hairline": 1,
} as const;

const generatedDividerTokens =
  ((tokens as unknown as { divider?: Record<string, string | number> }).divider ?? {});

export interface DividerColorTokenSpec {
  tone: DividerTone;
  figmaName: string;
  usage: string;
  transparent: {
    tokenName: string;
    handle: string;
    alpha: number;
  };
  solid: {
    tokenName: string;
    handle: string;
  };
}

export const dividerColorTokenSpecs: DividerColorTokenSpec[] = [
  {
    tone: "deep",
    figmaName: "线/01_深分割线",
    usage: "控件默认边框、较强分隔",
    transparent: {
      tokenName: "divider/color/deep/transparent",
      handle: "divideline-color-transparent-dack",
      alpha: 0.16,
    },
    solid: {
      tokenName: "divider/color/deep/solid",
      handle: "divideline-color-dack",
    },
  },
  {
    tone: "outline",
    figmaName: "线/02_描边",
    usage: "卡片外描边、容器边界",
    transparent: {
      tokenName: "divider/color/outline/transparent",
      handle: "outline-color-transparent",
      alpha: 0.12,
    },
    solid: {
      tokenName: "divider/color/outline/solid",
      handle: "outline-color",
    },
  },
  {
    tone: "light",
    figmaName: "线/03_浅分割线",
    usage: "卡片内部、表格行、区块内分割",
    transparent: {
      tokenName: "divider/color/light/transparent",
      handle: "divideline-color-transparent-light",
      alpha: 0.08,
    },
    solid: {
      tokenName: "divider/color/light/solid",
      handle: "divideline-color-light",
    },
  },
  {
    tone: "weak",
    figmaName: "线/04",
    usage: "最弱层级线、背景区弱边界",
    transparent: {
      tokenName: "divider/color/weak/transparent",
      handle: "line-color-transparent",
      alpha: 0.06,
    },
    solid: {
      tokenName: "divider/color/weak/solid",
      handle: "line-color",
    },
  },
];

const dividerColorTokenSpecByTone = Object.fromEntries(
  dividerColorTokenSpecs.map((spec) => [spec.tone, spec]),
) as Record<DividerTone, DividerColorTokenSpec>;

export function getDividerColor(tone: DividerTone, mode: DividerColorMode = "transparent"): string {
  const spec = dividerColorTokenSpecByTone[tone];
  const generatedValue = generatedDividerTokens[getDividerTokenName(tone, mode).replace(/^divider\//, "")];

  if (typeof generatedValue === "string") {
    return generatedValue;
  }

  if (mode === "solid") {
    return getColorToken(spec.solid.handle);
  }

  return tokenRgba(spec.transparent.handle, spec.transparent.alpha);
}

export function getDividerTokenName(tone: DividerTone, mode: DividerColorMode = "transparent"): string {
  const spec = dividerColorTokenSpecByTone[tone];
  return mode === "solid" ? spec.solid.tokenName : spec.transparent.tokenName;
}

export function getDividerBorder(tone: DividerTone, mode: DividerColorMode = "transparent"): string {
  const generatedWidth = generatedDividerTokens["width/hairline"];
  const width = typeof generatedWidth === "number" ? generatedWidth : dividerWidthTokens["divider/width/hairline"];

  return `${width}px solid ${getDividerColor(tone, mode)}`;
}
