import type { CSSProperties, ImgHTMLAttributes } from "react";

/** Figma 18530:73096 · Sensors Data 顶导 logo；白标，需放在顶导绿/蓝底上 */
export const SENS_TOP_NAV_LOGO_SRC = "/brand/sensors-data-logo.svg";
export const SENS_TOP_NAV_LOGO_WIDTH = 58;
export const SENS_TOP_NAV_LOGO_HEIGHT = 20;

export interface SensTopNavLogoProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "width" | "height"> {
  style?: CSSProperties;
}

/**
 * 顶部导航左上角品牌 logo（Sensors Data）。
 * 尺寸固定 58×20，与 Figma logo 节点一致；颜色随 SVG 白填充。
 */
export function SensTopNavLogo({ style, ...rest }: SensTopNavLogoProps) {
  return (
    <img
      src={SENS_TOP_NAV_LOGO_SRC}
      alt="Sensors Data"
      width={SENS_TOP_NAV_LOGO_WIDTH}
      height={SENS_TOP_NAV_LOGO_HEIGHT}
      draggable={false}
      style={{
        display: "block",
        width: SENS_TOP_NAV_LOGO_WIDTH,
        height: SENS_TOP_NAV_LOGO_HEIGHT,
        flexShrink: 0,
        ...style,
      }}
      {...rest}
    />
  );
}
