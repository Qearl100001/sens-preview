import type { GlobalToken } from "antd/es/theme/interface";
import type { CSSProperties } from "react";

/** 三态字色链：default / hover / active */
export interface TextColorChain {
  default: string;
  hover: string;
  active: string;
}

/** 共享语义前缀：链接蓝（状态色 link-color 链） */
export const SENS_TEXT_LINK_VAR = "--sens-text-link";

/** 共享语义前缀：警告红（sensd warning-color → antd colorError 链） */
export const SENS_TEXT_WARNING_VAR = "--sens-text-warning";

/** 从 antd 全局 token 取链接字色链（与 variant="link" / colorLink 同源） */
export function getLinkTextChain(token: GlobalToken): TextColorChain {
  return {
    default: token.colorLink,
    hover: token.colorLinkHover,
    active: token.colorLinkActive,
  };
}

/** 从 antd 全局 token 取警告字色链（与 Button danger 链同源） */
export function getWarningTextChain(token: GlobalToken): TextColorChain {
  return {
    default: token.colorError,
    hover: token.colorErrorHover,
    active: token.colorErrorActive,
  };
}

/**
 * 将字色链注入为 CSS 自定义属性。
 * @param prefix 如 `--sens-text-link` → `--sens-text-link` / `-hover` / `-active`
 */
export function toTextChainCssVars(prefix: string, chain: TextColorChain): CSSProperties {
  return {
    [prefix]: chain.default,
    [`${prefix}-hover`]: chain.hover,
    [`${prefix}-active`]: chain.active,
  } as CSSProperties;
}

/** 菜单项字色别名：共享链 → dropdown-menu scoped 变量（换源不换值） */
export function toDropdownMenuLinkColorAliases(): CSSProperties {
  return {
    "--sens-dropdown-menu-item-color-link": `var(${SENS_TEXT_LINK_VAR})`,
    "--sens-dropdown-menu-item-color-link-hover": `var(${SENS_TEXT_LINK_VAR}-hover)`,
    "--sens-dropdown-menu-item-color-link-active": `var(${SENS_TEXT_LINK_VAR}-active)`,
  } as CSSProperties;
}

export function toDropdownMenuDangerColorAliases(): CSSProperties {
  return {
    "--sens-dropdown-menu-item-color-danger": `var(${SENS_TEXT_WARNING_VAR})`,
    "--sens-dropdown-menu-item-color-danger-hover": `var(${SENS_TEXT_WARNING_VAR}-hover)`,
    "--sens-dropdown-menu-item-color-danger-active": `var(${SENS_TEXT_WARNING_VAR}-active)`,
  } as CSSProperties;
}
