import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  getFunctionalColors,
  type FunctionalColorSet,
  type FunctionalSkin,
} from "./functional-skin";
import {
  getNavigationTheme,
  type NavigationTheme,
} from "./navigation-color";

/**
 * 预览 / 应用层换肤入口。
 * FunctionalSkin 与 NavigationTheme 默认同步设置保留给快捷入口；规则上两套始终可独立组合。
 */
export type SensAppearanceValue = {
  functionalSkin: FunctionalSkin;
  navigationTheme: NavigationTheme;
  /** 默认同步设置两套主题；需要验证品牌色/功能色差异时使用独立 setter。 */
  setAppearance: (skin: FunctionalSkin) => void;
  setFunctionalSkin: (skin: FunctionalSkin) => void;
  setNavigationTheme: (theme: NavigationTheme) => void;
};

const SensAppearanceContext = createContext<SensAppearanceValue | null>(null);

export type SensAppearanceProviderProps = {
  functionalSkin: FunctionalSkin;
  navigationTheme: NavigationTheme;
  onFunctionalSkinChange: (skin: FunctionalSkin) => void;
  onNavigationThemeChange: (theme: NavigationTheme) => void;
  children: ReactNode;
};

/** 注入当前肤色 CSS 变量，供组件消费。 */
export function appearanceCssVars(
  functionalSkin: FunctionalSkin,
  navigationTheme: NavigationTheme,
): CSSProperties {
  const functional = getFunctionalColors(functionalSkin);
  const navigation = getNavigationTheme(navigationTheme);
  return {
    "--sens-skin-primary": functional.primary,
    "--sens-skin-hover": functional.hover,
    "--sens-skin-active": functional.active,
    "--sens-skin-disable": functional.disable,
    "--sens-skin-disable-hover": functional.disableHover,
    "--sens-skin-active-bg": functional.activeBackground,
    "--sens-skin-active-hover-bg": functional.activeHoverBackground,
    "--sens-skin-active-click-bg": functional.activeClickBackground,
    "--sens-skin-active-shadow": functional.activeShadow,
    "--sens-skin-light-bg": functional.lightBackground,
    "--sens-nav-top-bg": navigation.top.background,
    "--sens-nav-top-atmosphere": navigation.top.atmosphere,
    "--sens-nav-side-bg": navigation.side.background,
    "--sens-nav-title-bg": navigation.title.background,
    "--sens-nav-page-bg": navigation.page.background,
    "--sens-nav-accent": navigation.accent.solid,
    "--sens-nav-accent-subtle": navigation.accent.subtle,
  } as CSSProperties;
}

export function SensAppearanceProvider({
  functionalSkin,
  navigationTheme,
  onFunctionalSkinChange,
  onNavigationThemeChange,
  children,
}: SensAppearanceProviderProps) {
  const setAppearance = useCallback(
    (skin: FunctionalSkin) => {
      onFunctionalSkinChange(skin);
      onNavigationThemeChange(skin);
    },
    [onFunctionalSkinChange, onNavigationThemeChange],
  );

  const value = useMemo<SensAppearanceValue>(
    () => ({
      functionalSkin,
      navigationTheme,
      setAppearance,
      setFunctionalSkin: onFunctionalSkinChange,
      setNavigationTheme: onNavigationThemeChange,
    }),
    [functionalSkin, navigationTheme, setAppearance, onFunctionalSkinChange, onNavigationThemeChange],
  );

  return (
    <SensAppearanceContext.Provider value={value}>
      <div
        data-sens-functional-skin={functionalSkin}
        data-sens-navigation-theme={navigationTheme}
        style={{
          ...appearanceCssVars(functionalSkin, navigationTheme),
          height: "100%",
          minHeight: "100%",
        }}
      >
        {children}
      </div>
    </SensAppearanceContext.Provider>
  );
}

export function useSensAppearance(): SensAppearanceValue {
  const ctx = useContext(SensAppearanceContext);
  if (!ctx) {
    throw new Error("useSensAppearance must be used within SensAppearanceProvider");
  }
  return ctx;
}

/** 预览壳外或测试：无 Provider 时回落绿基线 */
export function useFunctionalSkin(): FunctionalSkin {
  const ctx = useContext(SensAppearanceContext);
  return ctx?.functionalSkin ?? "green";
}

export function useNavigationTheme(): NavigationTheme {
  const ctx = useContext(SensAppearanceContext);
  return ctx?.navigationTheme ?? "green";
}

export function useFunctionalColorSet(): FunctionalColorSet {
  return getFunctionalColors(useFunctionalSkin());
}
