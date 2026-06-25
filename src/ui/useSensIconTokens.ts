import { theme } from "antd";

type SensIconToken = {
  colorIconSecondary?: string;
  colorIconDisabled?: string;
};

/** 按 icons.md 角色从主题取图标色，禁止在组件里硬编码 hex */
export function useSensIconTokens() {
  const { token } = theme.useToken();
  const ext = token as typeof token & SensIconToken;

  return {
    default: token.colorIcon,
    secondary: ext.colorIconSecondary ?? token.colorIcon,
    disabled: ext.colorIconDisabled ?? token.colorTextTertiary,
    hover: token.colorIconHover,
    active: token.colorPrimary,
    onPrimary: token.colorBgContainer,
  } as const;
}
