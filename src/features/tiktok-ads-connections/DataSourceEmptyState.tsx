import { getColorToken } from "../../design-system/color-utils";
import { SensButton, SensEmptyState } from "../../ui";
import type { DataSourceSpec } from "./dataSourceTypes";

export interface DataSourceEmptyStateProps {
  spec: DataSourceSpec;
  type: "empty" | "search";
  onCreate?: () => void;
}

export function DataSourceEmptyState({ spec, type, onCreate }: DataSourceEmptyStateProps) {
  const content =
    type === "empty" ? spec.connectionList.emptyState : spec.connectionList.searchEmptyState;

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: getColorToken("white"),
      }}
    >
      <SensEmptyState
        scope="non-page"
        type={type === "empty" ? "noData" : "noResult"}
        size="base"
        title={content.title}
        description={content.description}
        actions={
          type === "empty" && onCreate ? (
            <SensButton tone="primary" onClick={onCreate}>
              {spec.connectionList.emptyState.actionLabel}
            </SensButton>
          ) : null
        }
      />
    </div>
  );
}
