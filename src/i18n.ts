import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import zh from "./design-system/i18n/zh.json";
import en from "./design-system/i18n/en.json";

// 文案来自 Figma 的 Text 集合（zh-cn / en 两个 mode），键已跨语言对齐。
// 嵌套键用 '.' 访问，例如 t("导航.可视化")。
i18n.use(initReactI18next).init({
  resources: {
    "zh-cn": { translation: zh },
    en: { translation: en },
  },
  lng: "zh-cn",
  fallbackLng: "zh-cn",
  keySeparator: ".",
  interpolation: { escapeValue: false, prefix: "${", suffix: "}" },
});

export default i18n;
