import tokens from "./tokens.resolved.json";

export type NavigationTheme = "green";

type NavigationThemeTokens = {
  top: { background: string; atmosphere: string };
  side: { background: string };
  title: { background: string };
  page: { background: string };
};

const NAVIGATION_THEMES = tokens.navigationTheme as Record<NavigationTheme, NavigationThemeTokens>;

export const DEFAULT_NAVIGATION_THEME: NavigationTheme = "green";

/** 产品壳主题与功能色主题独立。新增导航肤色时必须补齐顶导、侧导、标题栏和页面槽位。 */
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
