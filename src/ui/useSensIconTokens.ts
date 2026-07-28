import { getColorToken } from "../design-system/color-utils";

/** 按 icons.md 角色直读 design token 图标色，禁止在组件里硬编码 hex 或读 antd runtime token */
export function useSensIconTokens() {
  return {
    default: getColorToken("icon-color-transparent"),
    secondary: getColorToken("icon-sub-color-transparent"),
    disabled: getColorToken("icon-color-transparent-disable"),
    hover: getColorToken("text-color"),
    active: getColorToken("component-primary"),
    onPrimary: getColorToken("white"),
  } as const;
}
