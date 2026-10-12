import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import { createInstance } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { SensAppearanceProvider } from '../design-system/appearance';
import { buildAntdThemeForSkin } from '../design-system/appearance-antd';
import type { FunctionalSkin } from '../design-system/functional-skin';
import type { NavigationTheme } from '../design-system/navigation-color';
import { applySensFontFamilyToDocument } from '../design-system/typography';
import zh from '../design-system/i18n/zh.json';
import en from '../design-system/i18n/en.json';
import { SensMessageProvider } from '../ui/SensMessageRuntime';

export interface SensPrototypeProviderProps {
  children: ReactNode;
  locale?: 'zh-cn' | 'en';
  initialFunctionalSkin?: FunctionalSkin;
  initialNavigationTheme?: NavigationTheme;
}

/** Client-side prototype bootstrap; owns an isolated translation instance. */
export function SensPrototypeProvider({ children, locale = 'zh-cn', initialFunctionalSkin = 'green', initialNavigationTheme = 'green' }: SensPrototypeProviderProps) {
  const [functionalSkin, setFunctionalSkin] = useState(initialFunctionalSkin);
  const [navigationTheme, setNavigationTheme] = useState(initialNavigationTheme);
  const i18n = useMemo(() => {
    const instance = createInstance();
    void instance.init({
      resources: { 'zh-cn': { translation: zh }, en: { translation: en } },
      lng: locale, fallbackLng: 'zh-cn', initImmediate: false,
      keySeparator: '.', interpolation: { escapeValue: false, prefix: '${', suffix: '}' },
      react: { useSuspense: false },
    });
    return instance;
  }, [locale]);
  useEffect(() => { applySensFontFamilyToDocument(); }, []);
  return (
    <I18nextProvider i18n={i18n}>
      <SensAppearanceProvider functionalSkin={functionalSkin} navigationTheme={navigationTheme}
        onFunctionalSkinChange={setFunctionalSkin} onNavigationThemeChange={setNavigationTheme}>
        <ConfigProvider theme={buildAntdThemeForSkin(functionalSkin)} locale={locale === 'en' ? enUS : zhCN}
          button={{ autoInsertSpace: false }} wave={{ disabled: true }}>
          <SensMessageProvider>{children}</SensMessageProvider>
        </ConfigProvider>
      </SensAppearanceProvider>
    </I18nextProvider>
  );
}
