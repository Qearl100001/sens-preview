import type { CSSProperties } from "react";
import { buildShadowD3, getColorToken } from "../design-system/color-utils";
import { getDividerColor } from "../design-system/divider";
import tokens from "../design-system/tokens.resolved.json";
import { getTypographyToken } from "../design-system/typography";
import { useSensIconTokens } from "./useSensIconTokens";
import { functionalCssVar } from "../design-system/functional-skin";

const u = tokens.unit as Record<string, number>;
/** 输入框字段边框：与 Input / Select 触发框同源（Divider deep transparent） */
const INPUT_FIELD_BORDER = getDividerColor("deep", "transparent");

export function useSearchTokens() {
  const icons = useSensIconTokens();
  return {
    previewVars: {
      "--sens-search-hover-border": functionalCssVar("--sens-skin-primary", "component-primary"),
      "--sens-search-focus-border": functionalCssVar("--sens-skin-active", "component-active"),
      "--sens-search-focus-shadow": `0 0 0 2px ${functionalCssVar("--sens-skin-active-shadow", "component-active-shadow")}`,
      "--sens-search-primary": functionalCssVar("--sens-skin-primary", "component-primary"),
      "--sens-search-primary-hover": functionalCssVar("--sens-skin-hover", "component-hover"),
      "--sens-search-primary-active": functionalCssVar("--sens-skin-active", "component-active"),
      "--sens-search-active-outline": functionalCssVar("--sens-skin-active-shadow", "component-active-shadow"),
      "--sens-search-trigger-btn-bg": getColorToken("white"),
      "--sens-search-trigger-btn-border": INPUT_FIELD_BORDER,
      "--sens-search-trigger-btn-hover-shadow": buildShadowD3(),
      "--sens-search-category-text": getColorToken("text-color"),
      "--sens-search-icon-muted": icons.default,
      "--sens-search-icon-hover": icons.hover,
      /**
       * 清空悬停色：结构始终「浅灰圆+灰叉」，只换 color。
       * Figma 3813:7332 → `icon-sub-color-transparent`（01/02 同 hex，换 02 无可见差）。
       */
      "--sens-search-clear-hover": getColorToken("icon-sub-color-transparent"),
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
      "--sens-search-font-size": `${getTypographyToken("font-size/m")}px`,
      "--sens-search-line-height": `${getTypographyToken("line-height/m")}px`,
      "--sens-search-preview-font-size": `${getTypographyToken("font-size/s")}px`,
      "--sens-search-preview-line-height": `${getTypographyToken("line-height/s")}px`,
      "--sens-search-preview-title-weight": String(getTypographyToken("font-weight/medium")),
      "--sens-search-link-color": getColorToken("link-color"),
      "--sens-search-link-active-color": getColorToken("link-active-color"),
      /** 创建链接按钮默认：中性色/文字/01_主要 */
      "--sens-search-create-color": getColorToken("text-color-transparent"),
    } as CSSProperties,
  };
}

export function useSearchRootStyle(extra?: CSSProperties): CSSProperties {
  const { previewVars } = useSearchTokens();
  return { ...previewVars, ...extra };
}
