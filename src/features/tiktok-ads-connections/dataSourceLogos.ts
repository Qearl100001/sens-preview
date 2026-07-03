import type { CSSProperties } from "react";
import getuiLogo from "./assets/logos/getui.png";
import googleAdsFrame from "./assets/logos/google-ads.svg";
import googleVector1 from "./assets/logos/google-v1.svg";
import googleVector2 from "./assets/logos/google-v2.svg";
import googleVector3 from "./assets/logos/google-v3.svg";
import jiguangLogo from "./assets/logos/jiguang.png";
import metaAdsLogo from "./assets/logos/meta-ads.svg";
import tiktokLogo from "./assets/logos/tiktok.png";
import xiaomiLogo from "./assets/logos/xiaomi.png";

export interface DataSourceLogoAsset {
  src: string;
  overlays?: { src: string; style?: CSSProperties }[];
}

export const DATA_SOURCE_LOGO_ASSETS: Record<string, DataSourceLogoAsset> = {
  "tiktok-ads": { src: tiktokLogo },
  "facebook-ads": { src: metaAdsLogo },
  "google-ads": {
    src: googleAdsFrame,
    overlays: [
      { src: googleVector1, style: { inset: "16.23% 36.72% 15.3% 5.58%" } },
      { src: googleVector2, style: { inset: "8.71% 4% 8.69% 34.56%" } },
      { src: googleVector3, style: { inset: "61.37% 65.38% 8.69% 3.9%" } },
    ],
  },
  xiaomi: { src: xiaomiLogo },
  getui: { src: getuiLogo },
  jiguang: { src: jiguangLogo },
};
