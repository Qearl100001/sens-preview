import type { CSSProperties } from "react";
import { DATA_SOURCE_LOGO_ASSETS } from "./dataSourceLogos";

const LOGO_SIZE_DEFAULT = 48;

export interface DataSourceLogoProps {
  text: string;
  sourceId?: string;
  logoAssetId?: string;
  size?: number;
}

/** 数据源 Logo：优先 Figma 导出资产，缺省回退文字占位。 */
export function DataSourceLogo({
  sourceId,
  logoAssetId,
  text,
  size = LOGO_SIZE_DEFAULT,
}: DataSourceLogoProps) {
  const assetKey = logoAssetId ?? sourceId;
  const asset = assetKey ? DATA_SOURCE_LOGO_ASSETS[assetKey] : undefined;

  if (!asset) {
    return (
      <div
        aria-hidden
        style={{
          width: size,
          height: size,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 600,
          color: "rgba(8, 18, 38, 0.58)",
        }}
      >
        {text.slice(0, 2)}
      </div>
    );
  }

  return (
    <div
      aria-hidden
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <img
        src={asset.src}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
      {asset.overlays?.map((overlay) => (
        <img
          key={overlay.src}
          src={overlay.src}
          alt=""
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "contain",
            ...(overlay.style as CSSProperties),
          }}
        />
      ))}
    </div>
  );
}
