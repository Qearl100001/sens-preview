import tokens from "./tokens.resolved.json";
import { getColorToken } from "./color-utils";

export type NavigationTheme =
  | "green"
  | "blue"
  | "wildYellow"
  | "limeGreen"
  | "duneGold"
  | "sunriseRed"
  | "auroraGreen"
  | "landscapeBlue"
  | "orchidPurple"
  | "wavePurple"
  | "cloudPink"
  | "midnightBlack";

export const NAVIGATION_THEME_LABELS: Record<NavigationTheme, string> = {
  green: "神策绿",
  blue: "冰绽蓝",
  wildYellow: "原野黄",
  limeGreen: "青柠绿",
  duneGold: "沙丘金",
  sunriseRed: "旭日红",
  auroraGreen: "极光绿",
  landscapeBlue: "山水蓝",
  orchidPurple: "兰花紫",
  wavePurple: "波光紫",
  cloudPink: "云霞粉",
  midnightBlack: "子夜黑",
};

type NavigationThemeTokens = {
  top: { background: string; atmosphere: string };
  side: { background: string };
  title: { background: string };
  page: { background: string };
  accent: { solid: string; subtle: string };
  /** 品牌态 handle 覆盖；绿肤为空时回落 Color.json */
  handles: Record<string, string>;
};

const NAVIGATION_THEMES = tokens.navigationTheme as Record<NavigationTheme, NavigationThemeTokens>;

export const DEFAULT_NAVIGATION_THEME: NavigationTheme = "green";

/** 产品壳主题与功能色主题独立。新增导航肤色时必须补齐顶导、侧导、标题栏、页面、accent 与品牌 handles。 */
export function getNavigationTheme(theme: NavigationTheme = DEFAULT_NAVIGATION_THEME): NavigationThemeTokens {
  return NAVIGATION_THEMES[theme];
}

/** 顶导航背景渐变，来自 NavigationTheme Token。 */
export function getThemeTopBackground(theme: NavigationTheme = DEFAULT_NAVIGATION_THEME): string {
  return getNavigationTheme(theme).top.background;
}

/** 顶导航氛围叠层，独立于基础背景渐变，随产品壳主题变化。 */
export function getThemeTopAtmosphere(theme: NavigationTheme = DEFAULT_NAVIGATION_THEME): string {
  return getNavigationTheme(theme).top.atmosphere;
}

/** 侧导航背景渐变，来自 NavigationTheme Token。 */
export function getThemeSideBackground(theme: NavigationTheme = DEFAULT_NAVIGATION_THEME): string {
  return getNavigationTheme(theme).side.background;
}

/** 标题栏背景（drilldown / 抽屉标题区），来自 NavigationTheme Token。 */
export function getThemeTitleBackground(theme: NavigationTheme = DEFAULT_NAVIGATION_THEME): string {
  return getNavigationTheme(theme).title.background;
}

/** 顶导下页面背景，来自 NavigationTheme Token。 */
export function getThemePageBackground(theme: NavigationTheme = DEFAULT_NAVIGATION_THEME): string {
  return getNavigationTheme(theme).page.background;
}

type NavigationCssVar = "--sens-nav-title-bg" | "--sens-nav-page-bg";
type NavigationFallbackHandle = "theme-title-background" | "body-background";

/**
 * Appearance 注入的导航 CSS 变量；无 Provider 时回落 Color.json 绿基线 handle。
 * 标题栏 / 页面底换肤须走此入口或 getThemeTitle/PageBackground，禁止裸 getColorToken。
 */
export function navigationCssVar(cssVar: NavigationCssVar, fallbackHandle: NavigationFallbackHandle): string {
  return `var(${cssVar}, ${getColorToken(fallbackHandle)})`;
}

/** 导航品牌实色 / 浅底（选中强调）；与 Functional Skin 独立。 */
export function getNavigationAccent(theme: NavigationTheme = DEFAULT_NAVIGATION_THEME): {
  solid: string;
  subtle: string;
} {
  return getNavigationTheme(theme).accent;
}

/**
 * 读导航语义色：当前主题优先用 navigationTheme.handles 覆盖品牌态；
 * 未覆盖的中性态回落 Color.json handle。
 */
export function getNavigationColorToken(
  handle: string,
  theme: NavigationTheme = DEFAULT_NAVIGATION_THEME,
): string {
  const override = getNavigationTheme(theme).handles?.[handle];
  if (override) return override;
  return getColorToken(handle);
}
