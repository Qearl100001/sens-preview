import type { ThemeConfig } from "antd";
import { getFunctionalColors, type FunctionalSkin } from "./functional-skin";
import { buildAntdTheme } from "./theme";

/**
 * 用当前 Functional Skin 的 SensD 色覆盖 antd 承接层主色。
 * 设计来源仍是 SensD；antd 只被灌入，不当色板。
 * 字体由 buildAntdTheme 统一灌入 SENS_FONT_FAMILY，此处不再重复写。
 * Sens* 组件优先用 functionalCssVar(--sens-skin-*)；本函数覆盖仍走 antd 主色的承接层。
 */
export function buildAntdThemeForSkin(
  skin: FunctionalSkin,
  mode: "light" | "dark" = "light",
): ThemeConfig {
  const base = buildAntdTheme(mode);
  const functional = getFunctionalColors(skin);
  return {
    ...base,
    token: {
      ...base.token,
      colorPrimary: functional.primary,
      colorPrimaryHover: functional.hover,
      colorPrimaryActive: functional.active,
    },
    components: {
      ...base.components,
      Input: {
        ...base.components?.Input,
        hoverBorderColor: functional.primary,
        activeBorderColor: functional.active,
        activeShadow: `0 0 0 2px ${functional.activeShadow}`,
      },
      InputNumber: {
        ...base.components?.InputNumber,
        hoverBorderColor: functional.primary,
        activeBorderColor: functional.active,
        activeShadow: `0 0 0 2px ${functional.activeShadow}`,
      },
    },
  };
}
