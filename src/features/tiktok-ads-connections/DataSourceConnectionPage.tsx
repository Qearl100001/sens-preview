import { useMemo, useState } from "react";
import { tokenRgba } from "../../design-system/color-utils";
import { getDividerBorder, getDividerHairlineWidth } from "../../design-system/divider";
import tokens from "../../design-system/tokens.resolved.json";
import {
  SEARCH_INPUT_DEFAULT_WIDTH,
  SearchInput,
  SensButton,
  SensPageTitleBar,
  type SensBreadcrumbItem,
} from "../../ui";
import ConnectionTable from "./ConnectionTable";
import { CreateConnectionDrawer, type CreateConnectionValues } from "./CreateConnectionDrawer";
import { DataSourceEmptyState } from "./DataSourceEmptyState";
import { DataSourceInfoPanel } from "./DataSourceInfoPanel";
import type { ConnectionActionSpec, ConnectionRecord, DataSourceSpec } from "./dataSourceTypes";

const u = tokens.unit as Record<string, number>;
const INFO_PANEL_WIDTH = 290;
const BODY_PADDING_INLINE = u["spacing/6x"];
const COLUMN_GUTTER = u["spacing/4x"];

export interface DataSourceConnectionPageProps {
  spec: DataSourceSpec;
  initialRecords?: ConnectionRecord[];
  onBack?: () => void;
}

function toBreadcrumbItems(labels: string[], onBack?: () => void): SensBreadcrumbItem[] {
  return labels.map((label, index) => {
    const isLast = index === labels.length - 1;
    const isManagementCrumb = index === labels.length - 2;

    return {
      key: `crumb-${index}`,
      label,
      ...(!isLast && isManagementCrumb && onBack ? { onClick: onBack } : {}),
    };
  });
}

function nextConnectionId(records: ConnectionRecord[]): number {
  return records.reduce((max, record) => Math.max(max, record.connectionId), 0) + 1;
}

function createRecordFromValues(
  spec: DataSourceSpec,
  values: CreateConnectionValues,
  nextIndex: number,
): ConnectionRecord {
  const fallbackName = `${spec.name}_Connection_${nextIndex}`;

  return {
    key: String(Date.now()),
    connectionId: nextIndex,
    name: values.connectionName || fallbackName,
    status: "disabled",
    adAccountCount: 1,
    creator: "李郁文",
    createdAt: "2026-06-30 00:00:00",
  };
}

export function DataSourceConnectionPage({
  spec,
  initialRecords = spec.connectionList.mockData,
  onBack,
}: DataSourceConnectionPageProps) {
  const [records, setRecords] = useState<ConnectionRecord[]>(initialRecords);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return records;
    return records.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        String(row.connectionId).includes(q),
    );
  }, [records, search]);

  const showInitialEmpty = records.length === 0 && search.trim() === "";
  const showSearchEmpty = records.length > 0 && filteredData.length === 0;

  const handleTableAction = (action: ConnectionActionSpec, record: ConnectionRecord) => {
    if (action.key === "toggleStatus") {
      setRecords((current) =>
        current.map((item) =>
          item.key === record.key
            ? { ...item, status: item.status === "enabled" ? "disabled" : "enabled" }
            : item,
        ),
      );
      return;
    }

    if (action.key === "delete") {
      setRecords((current) => current.filter((item) => item.key !== record.key));
    }
  };

  const verticalDividerStyle = {
    width: getDividerHairlineWidth(),
    flexShrink: 0,
    alignSelf: "stretch",
    background: tokenRgba("divideline-color-transparent-light", 0.08),
  } as const;

  return (
    <>
      <SensPageTitleBar
        variant="drilldown"
        title={spec.name}
        breadcrumbItems={toBreadcrumbItems(spec.breadcrumbs, onBack)}
        onBack={onBack}
        actions={
          <SensButton tone="primary" onClick={() => setDrawerOpen(true)}>
            创建
          </SensButton>
        }
      />

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          alignItems: "stretch",
          paddingInline: BODY_PADDING_INLINE,
          paddingBottom: BODY_PADDING_INLINE,
        }}
      >
        <DataSourceInfoPanel spec={spec} width={INFO_PANEL_WIDTH} />

        <div style={{ width: COLUMN_GUTTER, flexShrink: 0 }} aria-hidden />

        <div aria-hidden style={verticalDividerStyle} />

        <div style={{ width: COLUMN_GUTTER, flexShrink: 0 }} aria-hidden />

        <main
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            gap: u["spacing/4x"],
            paddingTop: u["spacing/6x"],
          }}
        >
          {showInitialEmpty ? null : (
            <div style={{ display: "flex", justifyContent: "flex-start", width: "100%" }}>
              <SearchInput
                width={SEARCH_INPUT_DEFAULT_WIDTH}
                placeholder={spec.connectionList.searchPlaceholder}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          )}

          <div
            style={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {showInitialEmpty ? (
              <DataSourceEmptyState spec={spec} type="empty" onCreate={() => setDrawerOpen(true)} />
            ) : showSearchEmpty ? (
              <DataSourceEmptyState spec={spec} type="search" />
            ) : (
              <ConnectionTable spec={spec} dataSource={filteredData} onAction={handleTableAction} />
            )}
          </div>
        </main>
      </div>

      <CreateConnectionDrawer
        spec={spec}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={(values) => {
          const nextRecord = createRecordFromValues(spec, values, nextConnectionId(records));
          setRecords((current) => [nextRecord, ...current]);
          setDrawerOpen(false);
          setSearch("");
        }}
      />
    </>
  );
}
