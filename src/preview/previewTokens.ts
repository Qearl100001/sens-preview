/**
 * Preview 层样式 token：对齐 antd ThemeToken 常用属性名，
 * 值直读 Sens design token（不经 antd runtime hook）。
 *
 * 视觉目标：与 `src/design-system/theme.ts` 注入 ConfigProvider 的 seed 等价；
 * 未在 seed 中声明、由 antd 算法派生的项（如 borderRadiusLG）按当前派生结果写死数值。
 */
import { getColorToken } from "../design-system/color-utils";
import { functionalCssVar } from "../design-system/functional-skin";
import { getTypographyToken } from "../design-system/typography";
import { getUnitToken } from "../design-system/unit";

export type PreviewTokens = {
  colorPrimary: string;
  colorPrimaryBg: string;
  colorLink: string;
  colorText: string;
  colorTextSecondary: string;
  colorTextTertiary: string;
  colorBorder: string;
  colorBorderSecondary: string;
  colorBgContainer: string;
  colorBgLayout: string;
  colorFillAlter: string;
  colorFillSecondary: string;
  colorFillTertiary: string;
  colorFillQuaternary: string;
  colorWhite: string;
  borderRadius: number;
  borderRadiusSM: number;
  /** antd 派生：seed borderRadius(4) → LG=8；非 radius/l(6) */
  borderRadiusLG: number;
  controlHeight: number;
  /** antd 派生：controlHeight(32)+8 → 40；对齐 size/component-height/xl */
  controlHeightLG: number;
  lineWidth: number;
  fontSize: number;
  fontSizeSM: number;
  fontSizeLG: number;
  fontWeightStrong: number;
  fontFamilyCode: string;
  marginXXS: number;
  marginXS: number;
  marginSM: number;
  margin: number;
  marginMD: number;
  marginLG: number;
  paddingXXS: number;
  paddingXS: number;
  paddingSM: number;
  padding: number;
  paddingMD: number;
  paddingLG: number;
};

let cached: PreviewTokens | null = null;

export function getPreviewTokens(): PreviewTokens {
  if (cached) return cached;

  const spacing1 = getUnitToken("spacing/1x");
  const spacing2 = getUnitToken("spacing/2x");
  const spacing3 = getUnitToken("spacing/3x");
  const spacing4 = getUnitToken("spacing/4x");
  const spacing5 = getUnitToken("spacing/5x");
  const spacing6 = getUnitToken("spacing/6x");

  cached = {
    colorPrimary: functionalCssVar("--sens-skin-primary", "component-primary"),
    colorPrimaryBg: functionalCssVar("--sens-skin-light-bg", "component-light-background"),
    colorLink: getColorToken("link-color"),
    colorText: getColorToken("text-color"),
    colorTextSecondary: getColorToken("text-sub-color"),
    colorTextTertiary: getColorToken("text-color-disable"),
    colorBorder: getColorToken("outline-color"),
    colorBorderSecondary: getColorToken("background-01"),
    colorBgContainer: getColorToken("white"),
    colorBgLayout: getColorToken("background-grey"),
    colorFillAlter: getColorToken("background-04"),
    colorFillSecondary: getColorToken("background-grey-hover"),
    colorFillTertiary: getColorToken("background-01"),
    colorFillQuaternary: getColorToken("background-grey"),
    colorWhite: getColorToken("white"),
    borderRadius: getUnitToken("radius/m"),
    borderRadiusSM: getUnitToken("radius/s"),
    borderRadiusLG: 8,
    controlHeight: getUnitToken("size/component-height/m"),
    controlHeightLG: getUnitToken("size/component-height/xl"),
    lineWidth: 1,
    fontSize: getTypographyToken("font-size/m"),
    fontSizeSM: getTypographyToken("font-size/s"),
    fontSizeLG: getTypographyToken("font-size/l"),
    fontWeightStrong: getTypographyToken("font-weight/semibold"),
    fontFamilyCode: "SFMono-Regular, Consolas, Menlo, monospace",
    marginXXS: spacing1,
    marginXS: spacing2,
    marginSM: spacing3,
    margin: spacing4,
    marginMD: spacing5,
    marginLG: spacing6,
    paddingXXS: spacing1,
    paddingXS: spacing2,
    paddingSM: spacing3,
    padding: spacing4,
    paddingMD: spacing5,
    paddingLG: spacing6,
  };

  return cached;
}
