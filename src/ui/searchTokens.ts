import { theme } from "antd";
import type { CSSProperties } from "react";
import { buildShadowD3, tokenRgba } from "../design-system/color-utils";
import { buildAntdTheme } from "../design-system/theme";
import tokens from "../design-system/tokens.resolved.json";
import { useSensIconTokens } from "./useSensIconTokens";

const u = tokens.unit as Record<string, number>;
const themeComponents = (buildAntdTheme().components ?? {}) as Record<string, Record<string, unknown>>;
const inputComponentToken = themeComponents.Input ?? {};
const selectComponentToken = themeComponents.Select ?? {};
const INPUT_FIELD_BORDER = String(inputComponentToken.colorBorder ?? "");
const SELECT_ACTIVE_OUTLINE = String(selectComponentToken.activeOutlineColor ?? "");
/** 大：14px 字 + 行高 22（与 SensInput / Figma 813:276 一致） */
const SEARCH_LINE_HEIGHT = 22;

export function useSearchTokens() {
  const { token } = theme.useToken();
  const icons = useSensIconTokens();
  return {
    token,
    previewVars: {
      "--sens-search-hover-border": token.colorPrimary,
      "--sens-search-focus-border": token.colorPrimaryActive,
      "--sens-search-focus-shadow": `0 0 0 2px ${tokenRgba("component-active-shadow", 0.2)}`,
      "--sens-search-primary": token.colorPrimary,
      "--sens-search-primary-hover": token.colorPrimaryHover,
      "--sens-search-primary-active": token.colorPrimaryActive,
      "--sens-search-active-outline": SELECT_ACTIVE_OUTLINE,
      "--sens-search-trigger-btn-bg": token.colorBgContainer,
      "--sens-search-trigger-btn-border": INPUT_FIELD_BORDER,
      "--sens-search-trigger-btn-hover-shadow": buildShadowD3(),
      "--sens-search-category-text": token.colorText,
      "--sens-search-icon-muted": icons.default,
      "--sens-search-icon-hover": icons.hover,
      "--sens-search-icon-chevron": icons.default,
      "--sens-search-gap": `${u["spacing/1x"]}px`,
      "--sens-search-space-1x": `${u["spacing/1x"]}px`,
      "--sens-search-space-2x": `${u["spacing/2x"]}px`,
      "--sens-search-space-3x": `${u["spacing/3x"]}px`,
      "--sens-search-space-6x": `${u["spacing/6x"]}px`,
      "--sens-search-space-vertical-half": `${u["spacing/vertical/0․5x"]}px`,
      "--sens-search-icon-size": `${u["size/icon/m"]}px`,
      "--sens-search-label-color": token.colorTextSecondary,
      "--sens-search-section-divider": token.colorBorderSecondary,
      "--sens-search-minimal-line": INPUT_FIELD_BORDER,
      "--sens-search-divider-color": INPUT_FIELD_BORDER,
      "--sens-search-radius": `${token.borderRadius}px`,
      "--sens-search-control-height": `${token.controlHeight}px`,
      "--sens-search-line-height": `${SEARCH_LINE_HEIGHT}px`,
      "--sens-search-link-color": token.colorLink,
      "--sens-search-link-active-color": token.colorLinkActive,
    } as CSSProperties,
  };
}

export function useSearchRootStyle(extra?: CSSProperties): CSSProperties {
  const { previewVars } = useSearchTokens();
  return { ...previewVars, ...extra };
}
