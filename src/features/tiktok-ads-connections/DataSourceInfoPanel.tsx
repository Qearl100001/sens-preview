import { LinkButton } from "../../ui";
import { tokenRgba } from "../../design-system/color-utils";
import { getTypographyToken } from "../../design-system/typography";
import tokens from "../../design-system/tokens.resolved.json";
import type { DataSourceSpec } from "./dataSourceTypes";
import { DataSourceLogo } from "./DataSourceLogo";

const u = tokens.unit as Record<string, number>;
const LOGO_SIZE = u["spacing/6x"] * 2;

export interface DataSourceInfoPanelProps {
  spec: DataSourceSpec;
  width?: number;
}

export function DataSourceInfoPanel({ spec, width = 290 }: DataSourceInfoPanelProps) {
  const textPrimary = tokenRgba("text-color-transparent", 0.9);
  const textSecondary = tokenRgba("text-sub-color-transparent", 0.58);

  return (
    <aside
      style={{
        width,
        flexShrink: 0,
        alignSelf: "stretch",
        paddingTop: u["spacing/6x"],
        paddingBottom: u["spacing/6x"],
        display: "flex",
        flexDirection: "column",
        gap: u["spacing/10x"],
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: u["spacing/2x"] }}>
        <div style={{ display: "flex", gap: u["spacing/3x"], alignItems: "center" }}>
          <DataSourceLogo
            sourceId={spec.id}
            logoAssetId={spec.logoAssetId ?? spec.id}
            text={spec.logoText}
            size={LOGO_SIZE}
          />
          <h2
            style={{
              margin: 0,
              color: textPrimary,
              fontSize: getTypographyToken("font-size/l"),
              lineHeight: `${getTypographyToken("line-height/l")}px`,
              fontWeight: getTypographyToken("font-weight/semibold"),
            }}
          >
            {spec.name}
          </h2>
        </div>
        <LinkButton onClick={() => { /* TODO: 帮助文档外链 */ }}>
          {spec.infoPanel.helpDocLabel}
        </LinkButton>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: u["spacing/2x"] }}>
        <span
          style={{
            color: textPrimary,
            fontSize: getTypographyToken("font-size/l"),
            lineHeight: `${getTypographyToken("line-height/l")}px`,
            fontWeight: getTypographyToken("font-weight/semibold"),
          }}
        >
          {spec.infoPanel.sectionTitle}
        </span>
        <ul
          style={{
            margin: 0,
            paddingLeft: u["spacing/5x"],
            fontSize: getTypographyToken("font-size/m"),
            lineHeight: `${getTypographyToken("line-height/m")}px`,
            color: tokenRgba("text-article-color-transparent", 0.74),
          }}
        >
          {spec.infoPanel.requiredInfo.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <span
          style={{
            color: textSecondary,
            fontSize: getTypographyToken("font-size/s"),
            lineHeight: `${getTypographyToken("line-height/s")}px`,
          }}
        >
          {spec.infoPanel.footnote}
        </span>
      </div>
    </aside>
  );
}
