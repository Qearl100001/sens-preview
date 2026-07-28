import type { CSSProperties } from "react";
import { buildShadowD3, getColorToken, tokenRgba } from "../design-system/color-utils";
import { getDividerColor } from "../design-system/divider";
import tokens from "../design-system/tokens.resolved.json";
import { useSensIconTokens } from "./useSensIconTokens";

const u = tokens.unit as Record<string, number>;
/** 输入框字段边框：与 Input / Select 触发框同源（Divider deep transparent） */
const INPUT_FIELD_BORDER = getDividerColor("deep", "transparent");
/** 大：14px 字 + 行高 22（与 SensInput / Figma 813:276 一致） */
const SEARCH_LINE_HEIGHT = 22;

export function useSearchTokens() {
  const icons = useSensIconTokens();
  return {
    previewVars: {
      "--sens-search-hover-border": getColorToken("component-primary"),
      "--sens-search-focus-border": getColorToken("component-active"),
      "--sens-search-focus-shadow": `0 0 0 2px ${tokenRgba("component-active-shadow", 0.2)}`,
      "--sens-search-primary": getColorToken("component-primary"),
      "--sens-search-primary-hover": getColorToken("component-hover"),
      "--sens-search-primary-active": getColorToken("component-active"),
      "--sens-search-active-outline": tokenRgba("component-active-shadow", 0.2),
      "--sens-search-trigger-btn-bg": getColorToken("white"),
      "--sens-search-trigger-btn-border": INPUT_FIELD_BORDER,
      "--sens-search-trigger-btn-hover-shadow": buildShadowD3(),
      "--sens-search-category-text": getColorToken("text-color"),
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
      "--sens-search-label-color": getColorToken("text-sub-color"),
      "--sens-search-section-divider": getDividerColor("light", "solid"),
      "--sens-search-minimal-line": INPUT_FIELD_BORDER,
      "--sens-search-divider-color": INPUT_FIELD_BORDER,
      "--sens-search-radius": `${u["radius/m"]}px`,
      "--sens-search-control-height": `${u["size/component-height/m"]}px`,
      "--sens-search-line-height": `${SEARCH_LINE_HEIGHT}px`,
      "--sens-search-link-color": getColorToken("link-color"),
      "--sens-search-link-active-color": getColorToken("link-active-color"),
    } as CSSProperties,
  };
}

export function useSearchRootStyle(extra?: CSSProperties): CSSProperties {
  const { previewVars } = useSearchTokens();
  return { ...previewVars, ...extra };
}
