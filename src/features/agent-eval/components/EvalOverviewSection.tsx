import { getColorToken, tokenRgba } from "../../../design-system/color-utils";
import { getDividerBorder } from "../../../design-system/divider";
import { getTypographyToken } from "../../../design-system/typography";
import tokens from "../../../design-system/tokens.resolved.json";
import { SensBadge } from "../../../ui";
import type { EvalScoreOverviewSpec } from "../evalDashboardTypes";
import { EvalPanel, EvalSectionTitle } from "./EvalLayout";

const u = tokens.unit as Record<string, number>;

export function EvalOverviewSection({ overview }: { overview: EvalScoreOverviewSpec }) {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: u["spacing/4x"] }}>
      <EvalSectionTitle title="任务概况" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: u["spacing/4x"],
          alignItems: "stretch",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: u["spacing/3x"] }}>
          <EvalScoreCompare overview={overview} />
          <EvalRegressionSummary stats={overview.regression} />
        </div>
        <EvalConclusionCard conclusion={overview.conclusion} delta={overview.delta} />
      </div>
    </section>
  );
}

function EvalScoreCompare({ overview }: { overview: EvalScoreOverviewSpec }) {
  const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";

  return (
    <EvalPanel
      title="综合评分"
      extra={
        <span
          style={{
            fontSize: getTypographyToken("font-size/s"),
            color: tokenRgba("text-sub-color-transparent", 0.58),
            background: tokenRgba("background-transparent-grey", 0.04),
            padding: "2px 8px",
            borderRadius: u["radius/circular"],
            border: getDividerBorder("outline", "transparent"),
          }}
        >
          满分 100
        </span>
      }
      padding={20}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ScoreColumn
          version={overview.currentVersion}
          score={overview.currentScore}
          tag="当前"
          tagActive
          scoreColor={getColorToken("success-color")}
        />
        <div style={{ textAlign: "center", paddingInline: u["spacing/4x"] }}>
          <div
            style={{
              fontFamily: mono,
              fontSize: 18,
              fontWeight: 700,
              color: getColorToken("success-color"),
            }}
          >
            ↑ +{overview.delta}
          </div>
          <div
            style={{
              fontSize: 10,
              color: tokenRgba("text-sub-color-transparent", 0.58),
            }}
          >
            vs 基线
          </div>
        </div>
        <ScoreColumn
          version={overview.baselineVersion}
          score={overview.baselineScore}
          tag="基线"
          scoreColor={getColorToken("text-color-disable")}
        />
      </div>
    </EvalPanel>
  );
}

function ScoreColumn({
  version,
  score,
  tag,
  tagActive,
  scoreColor,
}: {
  version: string;
  score: number;
  tag: string;
  tagActive?: boolean;
  scoreColor: string;
}) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
      <div style={{ fontSize: 11, color: tokenRgba("text-sub-color-transparent", 0.58) }}>
        {version}{" "}
        <span
          style={{
            padding: "1px 6px",
            borderRadius: u["radius/s"],
            fontSize: 10,
            fontWeight: 600,
            background: tagActive
              ? tokenRgba("component-primary", 0.1)
              : tokenRgba("background-transparent-grey", 0.04),
            color: tagActive ? getColorToken("component-primary") : tokenRgba("text-sub-color-transparent", 0.58),
            border: tagActive ? undefined : getDividerBorder("outline", "transparent"),
          }}
        >
          {tag}
        </span>
      </div>
      <div
        style={{
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 48,
          fontWeight: 700,
          lineHeight: 1.1,
          color: scoreColor,
        }}
      >
        {score}
      </div>
    </div>
  );
}

function EvalRegressionSummary({ stats }: { stats: EvalScoreOverviewSpec["regression"] }) {
  const cards = [
    { key: "regression", value: stats.regression, label: "引入问题", tone: "error" as const },
    { key: "fix", value: stats.fix, label: "修复确认", tone: "success" as const },
    { key: "neutral", value: stats.neutral, label: "持平", tone: "neutral" as const },
  ];

  return (
    <EvalPanel title="回归摘要" padding={20} style={{ flex: 1 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: u["spacing/3x"] }}>
        {cards.map((card) => (
          <div
            key={card.key}
            style={{
              textAlign: "center",
              padding: "10px 12px",
              borderRadius: u["radius/l"],
              border: getDividerBorder("outline", "transparent"),
              background:
                card.tone === "error"
                  ? tokenRgba("warning-color", 0.08)
                  : card.tone === "success"
                    ? tokenRgba("success-color", 0.08)
                    : tokenRgba("background-transparent-grey", 0.04),
            }}
          >
            <div
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 22,
                fontWeight: 700,
                color:
                  card.tone === "error"
                    ? getColorToken("warning-color")
                    : card.tone === "success"
                      ? getColorToken("success-color")
                      : tokenRgba("text-sub-color-transparent", 0.58),
              }}
            >
              {card.value}
            </div>
            <div style={{ fontSize: 10, marginTop: 2, color: tokenRgba("text-sub-color-transparent", 0.58) }}>
              个用例
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                marginTop: 4,
                color: tokenRgba("text-color-transparent", 0.9),
              }}
            >
              {card.label}
            </div>
          </div>
        ))}
      </div>
    </EvalPanel>
  );
}

function EvalConclusionCard({
  conclusion,
  delta,
}: {
  conclusion: EvalScoreOverviewSpec["conclusion"];
  delta: number;
}) {
  const gradient = `linear-gradient(180deg, ${getColorToken("component-active-click-background")} 0%, ${getColorToken("white")} 100%)`;

  return (
    <EvalPanel
      title={<span style={{ color: getColorToken("component-active") }}>报告结论</span>}
      extra={<SensBadge variant="status" status="success" text={conclusion.grade} />}
      padding={20}
      style={{
        background: gradient,
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: u["spacing/4x"] }}>
        <p
          style={{
            margin: 0,
            fontSize: getTypographyToken("font-size/m"),
            lineHeight: `${getTypographyToken("line-height/m")}px`,
            color: tokenRgba("text-color-transparent", 0.9),
          }}
        >
          v1.4 综合分提升 <strong>{delta} 分</strong>（81→85），各维度均正向，修复确认（4）&gt; 引入问题（3），
          <span style={{ color: getColorToken("warning-color"), fontWeight: 600 }}>任务完成度小幅下滑</span>
          ，整体质量改善，建议发布。
        </p>

        <div
          style={{
            background: tokenRgba("white", 0.65),
            borderRadius: u["radius/l"],
            padding: "12px 14px",
            display: "flex",
            flexDirection: "column",
            gap: u["spacing/2x"],
          }}
        >
          <div
            style={{
              fontSize: getTypographyToken("font-size/m"),
              lineHeight: `${getTypographyToken("line-height/m")}px`,
              fontWeight: getTypographyToken("font-weight/semibold"),
              color: getColorToken("component-active"),
              letterSpacing: "0.04em",
            }}
          >
            优化建议
          </div>
          {conclusion.suggestions.map((item, index) => (
            <div
              key={item}
              style={{
                display: "flex",
                gap: u["spacing/2x"],
                fontSize: getTypographyToken("font-size/m"),
                lineHeight: `${getTypographyToken("line-height/m")}px`,
                color: tokenRgba("text-color-transparent", 0.9),
              }}
            >
              <span
                style={{
                  color: getColorToken("component-primary"),
                  fontWeight: getTypographyToken("font-weight/semibold"),
                  flexShrink: 0,
                }}
              >
                {index + 1}.
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </EvalPanel>
  );
}
