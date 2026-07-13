import type { ReactNode } from "react";
import type { ColumnsType } from "antd/es/table";
import { getColorToken, tokenRgba } from "../../../design-system/color-utils";
import { getDividerBorder } from "../../../design-system/divider";
import { getTypographyToken } from "../../../design-system/typography";
import tokens from "../../../design-system/tokens.resolved.json";
import { TableShell } from "../../../ui";
import type { EvalEvaluatorRow, EvalFormulaSpec } from "../evalDashboardTypes";
import { EvalDimensionCell, EvalStatusPill } from "./EvalBadges";
import { EvalPanel, EvalSectionTitle } from "./EvalLayout";

const u = tokens.unit as Record<string, number>;

export interface ChartPlaceholderProps {
  title: string;
  currentLabel?: string;
  baselineLabel?: string;
  height?: number;
  extraLegend?: ReactNode;
}

export function ChartPlaceholder({
  title,
  currentLabel = "v1.4",
  baselineLabel = "v1.3",
  height = 260,
  extraLegend,
}: ChartPlaceholderProps) {
  return (
    <EvalPanel
      title={title}
      extra={
        extraLegend ?? (
          <EvalChartLegend currentLabel={currentLabel} baselineLabel={baselineLabel} />
        )
      }
      padding={0}
    >
      <div
        style={{
          height,
          margin: u["spacing/4x"],
          borderRadius: u["radius/l"],
          border: getDividerBorder("outline", "transparent"),
          background: tokenRgba("background-transparent-grey", 0.04),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: tokenRgba("text-sub-color-transparent", 0.58),
          fontSize: getTypographyToken("font-size/s"),
        }}
      >
        图表占位
      </div>
    </EvalPanel>
  );
}

export function EvalChartLegend({
  currentLabel,
  baselineLabel,
  targetLabel,
}: {
  currentLabel: string;
  baselineLabel: string;
  targetLabel?: string;
}) {
  return (
    <div style={{ display: "flex", gap: u["spacing/4x"], fontSize: getTypographyToken("font-size/s"), flexWrap: "wrap" }}>
      <LegendLine color={getColorToken("component-primary")} dashed={false} label={currentLabel} />
      <LegendLine color={tokenRgba("text-sub-color-transparent", 0.58)} dashed label={baselineLabel} />
      {targetLabel ? (
        <LegendLine color={getColorToken("warning-color")} dashed label={targetLabel} />
      ) : null}
    </div>
  );
}

function LegendLine({ color, dashed, label }: { color: string; dashed?: boolean; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: tokenRgba("text-sub-color-transparent", 0.58) }}>
      <svg width={18} height={3} aria-hidden>
        <line
          x1={0}
          y1={1.5}
          x2={18}
          y2={1.5}
          stroke={color}
          strokeWidth={dashed ? 1.5 : 2}
          strokeDasharray={dashed ? "4,3" : undefined}
        />
      </svg>
      {label}
    </span>
  );
}

export interface EvalDimensionSectionProps {
  evaluators: EvalEvaluatorRow[];
  formula: EvalFormulaSpec;
  currentLabel?: string;
  baselineLabel?: string;
  showEvaluatorWeight?: boolean;
  chartCurrentLabel?: string;
  chartBaselineLabel?: string;
  sectionTitle?: string;
}

export function EvalDimensionSection({
  evaluators,
  formula,
  currentLabel = "v1.4",
  baselineLabel = "v1.3",
  showEvaluatorWeight = false,
  chartCurrentLabel,
  chartBaselineLabel,
  sectionTitle = "各维度得分对比",
}: EvalDimensionSectionProps) {
  const columns: ColumnsType<EvalEvaluatorRow> = [
    {
      title: "评估维度",
      dataIndex: "dimensionLabel",
      width: 140,
      onCell: (record) => ({
        rowSpan: record.dimensionRowSpan,
        style: { padding: 0, verticalAlign: "middle" },
      }),
      render: (_value, record) =>
        record.dimensionRowSpan > 0 ? (
          <EvalDimensionCell
            label={record.dimensionLabel}
            weight={record.dimensionWeight}
            tone={record.dimensionTone}
          />
        ) : null,
    },
    {
      title: "Evaluator",
      dataIndex: "evaluator",
      render: (value: string) => <strong>{value}</strong>,
    },
    {
      title: currentLabel,
      dataIndex: "currentScore",
      align: "right",
      render: (value: number, record) => (
        <span
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontWeight: 700,
            color:
              record.scoreTone === "success"
                ? getColorToken("success-color")
                : record.scoreTone === "warning"
                  ? getColorToken("warning-color")
                  : tokenRgba("text-color-transparent", 0.9),
          }}
        >
          {value.toFixed(2)}
        </span>
      ),
    },
    {
      title: baselineLabel,
      dataIndex: "baselineScore",
      align: "right",
      render: (value: number) => (
        <span
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            color: tokenRgba("text-sub-color-transparent", 0.58),
          }}
        >
          {value.toFixed(2)}
        </span>
      ),
    },
    {
      title: "变化",
      dataIndex: "changeLabel",
      align: "right",
      render: (value: string, record) => (
        <span
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            color:
              record.changePositive === true
                ? getColorToken("success-color")
                : record.changePositive === false
                  ? getColorToken("warning-color")
                  : tokenRgba("text-sub-color-transparent", 0.58),
          }}
        >
          {value}
        </span>
      ),
    },
    ...(showEvaluatorWeight
      ? [
          {
            title: "维度权重",
            dataIndex: "evaluatorWeight",
            align: "right" as const,
            render: (value: string) => (
              <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>{value}</span>
            ),
          },
        ]
      : []),
    {
      title: "状态",
      dataIndex: "status",
      align: "center",
      render: (status: EvalEvaluatorRow["status"]) => <EvalStatusPill status={status} />,
    },
  ];

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: u["spacing/4x"] }}>
      {sectionTitle ? <EvalSectionTitle title={sectionTitle} /> : null}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 3fr", gap: u["spacing/4x"] }}>
        <ChartPlaceholder
          title="各维度得分"
          currentLabel={chartCurrentLabel ?? currentLabel}
          baselineLabel={chartBaselineLabel ?? baselineLabel}
        />
        <EvalPanel
          title="Evaluator 得分"
          extra={
            <span style={{ fontSize: getTypographyToken("font-size/s"), color: tokenRgba("text-sub-color-transparent", 0.58) }}>
              原始分 0–1
            </span>
          }
          padding={0}
        >
          <TableShell<EvalEvaluatorRow>
            borderless
            columns={columns}
            dataSource={evaluators}
            rowKey="key"
            pagination={false}
            scroll={{ x: 720 }}
          />
        </EvalPanel>
      </div>
      <EvalFormulaBar formula={formula} />
    </section>
  );
}

export function EvalFormulaBar({ formula }: { formula: EvalFormulaSpec }) {
  return (
    <div
      style={{
        padding: "8px 12px",
        borderRadius: u["radius/l"],
        border: getDividerBorder("outline", "transparent"),
        background: tokenRgba("background-transparent-grey", 0.04),
        fontSize: getTypographyToken("font-size/s"),
        lineHeight: `${getTypographyToken("line-height/s")}px`,
        color: tokenRgba("text-sub-color-transparent", 0.58),
      }}
    >
      <strong style={{ color: tokenRgba("text-color-transparent", 0.9) }}>{formula.expression}</strong>
      <span style={{ marginLeft: u["spacing/3x"] }}>{formula.footnote}</span>
    </div>
  );
}
