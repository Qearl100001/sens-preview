import { getColorByPath, getColorToken, hexToRgba } from "../../design-system/color-utils";
import type { EvalDimensionTone } from "./evalDashboardTypes";

const PURPLE_PATH = "基础色板/兰花紫/10";

const TOKEN_HANDLE: Record<Exclude<EvalDimensionTone, "purple">, string> = {
  green: "success-color",
  blue: "link-color",
};

export function getDimensionColor(tone: EvalDimensionTone): string {
  if (tone === "purple") {
    return getColorByPath(PURPLE_PATH);
  }
  return getColorToken(TOKEN_HANDLE[tone]);
}

export function getDimensionColorRgba(tone: EvalDimensionTone, alpha: number): string {
  return hexToRgba(getDimensionColor(tone), alpha);
}
