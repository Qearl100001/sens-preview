import { getColorToken } from "./color-utils";
import tokens from "./tokens.resolved.json";

/** 预览换肤：仅切换功能色，状态色（链接蓝等）不变。 */
export type FunctionalSkin = "green" | "blue" | "limeGreen" | "auroraGreen" | "landscapeBlue" | "orchidPurple" | "wavePurple";

export const FUNCTIONAL_SKIN_LABELS: Record<FunctionalSkin, string> = {
  green: "神策绿",
  blue: "冰绽蓝",
  limeGreen: "青柠绿",
  auroraGreen: "极光绿",
  landscapeBlue: "山水蓝",
  orchidPurple: "兰花紫",
  wavePurple: "波光紫",
};

/** 功能色 01–10；对应 Figma 换肤表下半区 */
export type FunctionalColorSet = {
  primary: string;
  hover: string;
  active: string;
  disable: string;
  disableHover: string;
  activeBackground: string;
  activeHoverBackground: string;
  activeClickBackground: string;
  activeShadow: string;
  lightBackground: string;
};

/** 与 appearanceCssVars 注入的 --sens-skin-* 对齐 */
export type FunctionalCssVar =
  | "--sens-skin-primary"
  | "--sens-skin-hover"
  | "--sens-skin-active"
  | "--sens-skin-disable"
  | "--sens-skin-disable-hover"
  | "--sens-skin-active-bg"
  | "--sens-skin-active-hover-bg"
  | "--sens-skin-active-click-bg"
  | "--sens-skin-active-shadow"
  | "--sens-skin-light-bg";

type FunctionalFallbackHandle =
  | "component-primary"
  | "component-hover"
  | "component-active"
  | "component-disable"
  | "component-disable-hover"
  | "component-active-background"
  | "component-active-hover-background"
  | "component-active-click-background"
  | "component-active-shadow"
  | "component-light-background";

const FUNCTIONAL_SKINS = tokens.functionalSkin as Record<FunctionalSkin, FunctionalColorSet>;

export function getFunctionalColors(skin: FunctionalSkin = "green"): FunctionalColorSet {
  return FUNCTIONAL_SKINS[skin];
}

/**
 * 组件样式取功能色：有 AppearanceProvider 时跟肤，否则回落绿基线 handle。
 * 返回值可直接用于 inline style / CSS 自定义属性。
 */
export function functionalCssVar(cssVar: FunctionalCssVar, fallbackHandle: FunctionalFallbackHandle): string {
  return `var(${cssVar}, ${getColorToken(fallbackHandle)})`;
}

/** 功能色点击投影环；随 --sens-skin-active-shadow */
export function buildFunctionalActiveRingShadow(functional?: FunctionalColorSet): string {
  if (functional) return `0 0 0 2px ${functional.activeShadow}`;
  return `0 0 0 2px ${functionalCssVar("--sens-skin-active-shadow", "component-active-shadow")}`;
}
