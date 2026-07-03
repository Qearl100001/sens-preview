import { DataSourceConnectionPage } from "./DataSourceConnectionPage";
import { ProductShellPlaceholder } from "./ProductShellPlaceholder";
import { TIKTOK_ADS_SPEC } from "./dataSourceSpecs";

export default function TikTokAdsConnectionsPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <ProductShellPlaceholder />
      <DataSourceConnectionPage spec={TIKTOK_ADS_SPEC} />
    </div>
  );
}
