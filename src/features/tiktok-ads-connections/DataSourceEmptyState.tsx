import { getColorToken, tokenRgba } from "../../design-system/color-utils";
import { getTypographyToken } from "../../design-system/typography";
import tokens from "../../design-system/tokens.resolved.json";
import { EMPTY_STATE_ILLUSTRATIONS, SensButton } from "../../ui";
import type { DataSourceSpec } from "./dataSourceTypes";

const u = tokens.unit as Record<string, number>;
const EMPTY_ILLUSTRATION_SIZE = u["size/icon/m"] * 2 + u["spacing/2x"];

export interface DataSourceEmptyStateProps {
  spec: DataSourceSpec;
  type: "empty" | "search";
  onCreate?: () => void;
}

export function DataSourceEmptyState({ spec, type, onCreate }: DataSourceEmptyStateProps) {
  const textPrimary = tokenRgba("text-color-transparent", 0.9);
  const textSecondary = tokenRgba("text-sub-color-transparent", 0.58);
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: u["spacing/3x"],
        }}
      >
        <img
          src={EMPTY_STATE_ILLUSTRATIONS[type === "empty" ? "noData" : "noResult"]}
          alt=""
          width={EMPTY_ILLUSTRATION_SIZE}
          height={EMPTY_ILLUSTRATION_SIZE}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: u["spacing/1x"],
          }}
        >
          <span
            style={{
              color: textPrimary,
              fontSize: getTypographyToken("font-size/m"),
              lineHeight: `${getTypographyToken("line-height/m")}px`,
              fontWeight: getTypographyToken("font-weight/medium"),
            }}
          >
            {content.title}
          </span>
          <span
            style={{
              color: textSecondary,
              fontSize: getTypographyToken("font-size/s"),
              lineHeight: `${getTypographyToken("line-height/s")}px`,
              textAlign: "center",
              maxWidth: u["spacing/6x"] * 10,
            }}
          >
            {content.description}
          </span>
        </div>
        {type === "empty" && onCreate ? (
          <SensButton tone="primary" onClick={onCreate}>
            {spec.connectionList.emptyState.actionLabel}
          </SensButton>
        ) : null}
      </div>
    </div>
  );
}
