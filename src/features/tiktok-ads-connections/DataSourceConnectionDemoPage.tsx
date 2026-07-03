import { useMemo, useState } from "react";
import { DataSourceConnectionPage } from "./DataSourceConnectionPage";
import { DataSourceManagementPage } from "./DataSourceManagementPage";
import { DataSourceManagementShell } from "./DataSourceManagementShell";
import { DATA_SOURCE_DEMO_USE_RECORDING_DATA } from "./dataSourceDemoConfig";
import { GOOGLE_ADS_SPEC, TIKTOK_ADS_SPEC } from "./dataSourceSpecs";
import type { DataSourceSpec } from "./dataSourceTypes";

const DEMO_DATA_SOURCE_SPECS: Record<string, DataSourceSpec> = {
  [TIKTOK_ADS_SPEC.id]: TIKTOK_ADS_SPEC,
  [GOOGLE_ADS_SPEC.id]: GOOGLE_ADS_SPEC,
};

export default function DataSourceConnectionDemoPage() {
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const selectedSpec = useMemo(
    () => (selectedSourceId ? DEMO_DATA_SOURCE_SPECS[selectedSourceId] ?? null : null),
    [selectedSourceId],
  );

  return (
    <DataSourceManagementShell showSideNav={!selectedSpec}>
      {selectedSpec ? (
        <DataSourceConnectionPage
          spec={selectedSpec}
          initialRecords={
            DATA_SOURCE_DEMO_USE_RECORDING_DATA ? selectedSpec.connectionList.mockData : []
          }
          onBack={() => setSelectedSourceId(null)}
        />
      ) : (
        <DataSourceManagementPage onOpenSource={setSelectedSourceId} />
      )}
    </DataSourceManagementShell>
  );
}
