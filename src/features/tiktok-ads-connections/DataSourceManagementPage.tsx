import { useState } from "react";
import { tokenRgba } from "../../design-system/color-utils";
import { getTypographyToken } from "../../design-system/typography";
import tokens from "../../design-system/tokens.resolved.json";
import { SensButton, SensLineTabs, SensPageTitleBar } from "../../ui";
import { DataSourceEntryCard } from "./DataSourceEntryCard";
import { DATA_SOURCE_INGESTION_SECTIONS } from "./dataSourceSpecs";
import type { DataSourceSectionSpec } from "./dataSourceTypes";

const u = tokens.unit as Record<string, number>;

export interface DataSourceManagementPageProps {
  onOpenSource: (sourceId: string) => void;
}

function DataSourceSectionBlock({
  section,
  onOpenSource,
}: {
  section: DataSourceSectionSpec;
  onOpenSource: (sourceId: string) => void;
}) {
  const textPrimary = tokenRgba("text-color-transparent", 0.9);

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: u["spacing/4x"],
        width: "100%",
      }}
    >
      <h2
        style={{
          margin: 0,
          color: textPrimary,
          fontSize: getTypographyToken("font-size/l"),
          lineHeight: `${getTypographyToken("line-height/l")}px`,
          fontWeight: getTypographyToken("font-weight/semibold"),
        }}
      >
        {section.title} ({section.count})
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: u["spacing/4x"],
        }}
      >
        {section.cards.map((card) => (
          <DataSourceEntryCard
            key={card.id}
            card={card}
            onClick={
              card.navigable && !card.disabled
                ? () => {
                    onOpenSource(card.id);
                  }
                : undefined
            }
          />
        ))}
      </div>
    </section>
  );
}

export function DataSourceManagementPage({ onOpenSource }: DataSourceManagementPageProps) {
  const [activeTab, setActiveTab] = useState("ingestion");

  return (
    <>
      <SensPageTitleBar
        title="数据源管理"
        actions={
          <SensButton tone="secondary" onClick={() => { /* TODO: Schema 管理 */ }}>
            Schema 管理
          </SensButton>
        }
      />

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
          padding: `0 ${u["spacing/6x"]}px ${u["spacing/6x"]}px`,
          display: "flex",
          flexDirection: "column",
          gap: u["spacing/4x"],
        }}
      >
        <SensLineTabs
          barOnly
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: "ingestion", label: "数据接入", badgeCount: 6 },
            { key: "sync-target", label: "同步目标", badgeCount: 4 },
          ]}
        />

        {activeTab === "ingestion" ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 28,
            }}
          >
            {DATA_SOURCE_INGESTION_SECTIONS.map((section) => (
              <DataSourceSectionBlock key={section.id} section={section} onOpenSource={onOpenSource} />
            ))}
          </div>
        ) : (
          <p
            style={{
              margin: 0,
              color: tokenRgba("text-sub-color-transparent", 0.58),
              fontSize: getTypographyToken("font-size/m"),
              lineHeight: `${getTypographyToken("line-height/m")}px`,
            }}
          >
            同步目标列表待后续接入。
          </p>
        )}
      </div>
    </>
  );
}
