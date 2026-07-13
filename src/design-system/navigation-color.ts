import { getColorByPath } from "./color-utils";
import type { FunctionalSkin } from "./functional-skin";

/** 顶导航背景渐变（换肤绿/蓝），见 docs/foundations/navigation-color.md */
export function getThemeTopBackground(skin: FunctionalSkin = "green"): string {
  if (skin === "blue") {
    return `linear-gradient(135deg, ${getColorByPath("基础色板/冰绽蓝/11")} 0%, ${getColorByPath("基础色板/冰绽蓝/12")} 100%)`;
  }
  return `linear-gradient(135deg, ${getColorByPath("基础色板/神策绿/11")} 0%, ${getColorByPath("基础色板/神策绿/12")} 100%)`;
}
