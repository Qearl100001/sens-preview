import { useMemo, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import { getColorToken, tokenRgba } from "../../../design-system/color-utils";
import { getDividerBorder } from "../../../design-system/divider";
import { getTypographyToken } from "../../../design-system/typography";
import tokens from "../../../design-system/tokens.resolved.json";
import { LinkButton, SensButton, SensSelectDropdown, TableShell } from "../../../ui";
import type {
  EvalKpiPanelKey,
  EvalProductionReportSpec,
  EvalProductionTraceRow,
} from "../evalDashboardTypes";
import {
  EvalAnnotationResultBadge,
  EvalHallucBadge,
  EvalTraceAnnotationBadge,
} from "./EvalBadges";
import { ChartPlaceholder, EvalChartLegend, EvalDimensionSection } from "./EvalDimensionSection";
import { EvalFilterBar } from "./EvalFilterBar";
import { EVAL_MODULE_STACK_GAP, EVAL_TOOLBAR_STACK_GAP, EvalPanel, EvalSectionTitle } from "./EvalLayout";

const u = tokens.unit as Record<string, number>;

export function EvalProductionSection({ spec }: { spec: EvalProductionReportSpec }) {
  const [activePanel, setActivePanel] = useState<EvalKpiPanelKey>("score");
  const [traceFilter, setTraceFilter] = useState("");

  const filteredTraces = useMemo(() => {
    if (!traceFilter) return spec.lowTraces;
    return spec.lowTraces.filter((row) => {
      if (traceFilter === "accuracy") return row.accuracy < 60;
      if (traceFilter === "halluc") return row.halluc === "fail";
      if (traceFilter === "relevance") return row.relevance < 60;
      return true;
    });
  }, [spec.lowTraces, traceFilter]);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: EVAL_TOOLBAR_STACK_GAP }}>
        <EvalFilterBar filterOptions={spec.filterOptions} defaultExperiment="prod_monthly" />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: u["spacing/3x"],
          }}
        >
          {spec.kpis.map((kpi) => (
            <KpiCard
              key={kpi.key}
              kpi={kpi}
              active={activePanel === kpi.key}
              onClick={() => setActivePanel(kpi.key)}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: EVAL_MODULE_STACK_GAP,
          marginTop: EVAL_MODULE_STACK_GAP,
        }}
      >
        {activePanel === "score" ? <ScorePanelContent spec={spec} /> : null}
        {activePanel === "coverage" ? <CoveragePanelContent spec={spec} /> : null}
        {activePanel === "lowscore" ? (
          <LowTracePanelContent
            traces={filteredTraces}
            traceFilter={traceFilter}
            onTraceFilterChange={setTraceFilter}
          />
        ) : null}
        {activePanel === "annotation" ? (
          <AnnotationPanelContent spec={spec} onStartAnnotate={() => undefined} />
        ) : null}
      </div>
    </>
  );
}

function KpiCard({
  kpi,
  active,
  onClick,
}: {
  kpi: EvalProductionReportSpec["kpis"][number];
  active: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const highlighted = active || hovered;

  const valueColor =
    kpi.valueTone === "danger"
      ? getColorToken("warning-color")
      : kpi.valueTone === "warning"
        ? getColorToken("info-color")
        : tokenRgba("text-color-transparent", 0.9);

  const deltaColor =
    kpi.deltaPositive === true
      ? getColorToken("success-color")
      : kpi.deltaPositive === false
        ? getColorToken("warning-color")
        : kpi.valueTone === "warning"
          ? getColorToken("info-color")
          : tokenRgba("text-sub-color-transparent", 0.58);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        textAlign: "left",
        cursor: "pointer",
        border: highlighted
          ? `1px solid ${getColorToken("component-primary")}`
          : getDividerBorder("outline", "transparent"),
        borderRadius: u["radius/l"],
        background: highlighted
          ? getColorToken("component-active-background")
          : getColorToken("white"),
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: u["spacing/1x"],
        boxShadow: active
          ? `0 0 0 2px ${tokenRgba("component-primary", 0.18)}`
          : undefined,
        transition: "border-color 0.15s, background 0.15s, box-shadow 0.15s",
        outline: "none",
      }}
    >
        <span
          style={{
            fontSize: getTypographyToken("font-size/s"),
            color: tokenRgba("text-sub-color-transparent", 0.58),
          }}
        >
          {kpi.label}
        </span>
        <span
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 30,
            fontWeight: 700,
            lineHeight: 1.1,
            color: valueColor,
          }}
        >
          {kpi.value}
        </span>
        <span style={{ fontSize: 11, color: tokenRgba("text-sub-color-transparent", 0.58) }}>{kpi.sub}</span>
        {kpi.delta ? (
          <span
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 12,
              color: deltaColor,
            }}
          >
            {kpi.delta}
          </span>
        ) : null}
        <span
          style={{
            fontSize: 11,
            marginTop: 2,
            color: active ? getColorToken("component-active") : getColorToken("component-primary"),
            fontWeight: active
              ? getTypographyToken("font-weight/semibold")
              : getTypographyToken("font-weight/regular"),
          }}
        >
        {kpi.indicator}
      </span>
    </button>
  );
}

function ScorePanelContent({ spec }: { spec: EvalProductionReportSpec }) {
  const { scoreDetail } = spec;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: u["spacing/4x"] }}>
      <EvalSectionTitle title="综合评分" subtitle={scoreDetail.headline} />
      <ChartPlaceholder
        title="综合评分趋势（近30天）"
        currentLabel="近30天"
        baselineLabel="上个月"
        height={200}
      />
      <EvalDimensionSection
        evaluators={scoreDetail.evaluators}
        formula={scoreDetail.formula}
        currentLabel={scoreDetail.currentLabel}
        baselineLabel={scoreDetail.baselineLabel}
        showEvaluatorWeight
        chartCurrentLabel="近30天"
        chartBaselineLabel="上个月"
        sectionTitle=""
      />
    </div>
  );
}

function CoveragePanelContent({ spec }: { spec: EvalProductionReportSpec }) {
  const { coverageDetail: detail } = spec;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: u["spacing/4x"] }}>
      <EvalSectionTitle title="评估覆盖率" subtitle={detail.headline} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: u["spacing/3x"] }}>
        <StatMiniCard value={detail.current} label="本月覆盖率" delta={detail.delta} accent />
        <StatMiniCard value={detail.previous} label="上个月覆盖率" />
        <StatMiniCard value={detail.target} label="目标阈值" note={detail.progress} warning />
      </div>
      <ChartPlaceholder
        title="评估覆盖率趋势（近30天）"
        currentLabel="近30天"
        baselineLabel="上个月"
        height={200}
        extraLegend={
          <EvalChartLegend currentLabel="近30天" baselineLabel="上个月" targetLabel="目标 50%" />
        }
      />
    </div>
  );
}

function LowTracePanelContent({
  traces,
  traceFilter,
  onTraceFilterChange,
}: {
  traces: EvalProductionTraceRow[];
  traceFilter: string;
  onTraceFilterChange: (value: string) => void;
}) {
  const columns: ColumnsType<EvalProductionTraceRow> = [
    {
      title: "Trace ID",
      dataIndex: "id",
      width: 110,
      render: (value: string) => (
        <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12, color: getColorToken("component-primary") }}>
          {value}
        </span>
      ),
    },
    { title: "时间", dataIndex: "time", width: 100 },
    { title: "Agent", dataIndex: "agent", width: 120, ellipsis: true },
    { title: "Input 摘要", dataIndex: "input", ellipsis: true },
    {
      title: "综合分",
      dataIndex: "overall",
      align: "right",
      width: 72,
      render: (value: number) => (
        <span
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontWeight: 600,
            color: value < 50 ? getColorToken("warning-color") : getColorToken("info-color"),
          }}
        >
          {value}
        </span>
      ),
    },
    { title: "准确性", dataIndex: "accuracy", align: "right", width: 72 },
    { title: "相关性", dataIndex: "relevance", align: "right", width: 72 },
    {
      title: "幻觉",
      dataIndex: "halluc",
      align: "center",
      width: 72,
      render: (value: EvalProductionTraceRow["halluc"]) => <EvalHallucBadge value={value} />,
    },
    {
      title: "标注状态",
      dataIndex: "annotation",
      align: "center",
      width: 88,
      render: (value: EvalProductionTraceRow["annotation"]) => (
        <EvalTraceAnnotationBadge status={value} />
      ),
    },
    {
      title: "操作",
      key: "action",
      align: "center",
      width: 72,
      render: () => <LinkButton onClick={() => undefined}>下钻</LinkButton>,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: u["spacing/4x"] }}>
      <EvalSectionTitle title="低分 Trace 队列" subtitle="综合分 < 75（共156条，↑8.3% vs 上个月）" />
      <EvalPanel
        title="综合分 < 75 的 Trace"
        extra={
          <div style={{ display: "flex", alignItems: "center", gap: u["spacing/2x"] }}>
            <SensSelectDropdown
              style={{ width: 140 }}
              value={traceFilter}
              options={[
                { value: "", label: "全部维度" },
                { value: "accuracy", label: "准确性低" },
                { value: "halluc", label: "有幻觉" },
                { value: "relevance", label: "不相关" },
              ]}
              onChange={(v) => onTraceFilterChange(String(v ?? ""))}
            />
            <SensButton tone="secondary" onClick={() => undefined}>
              推入标注队列
            </SensButton>
          </div>
        }
        padding={0}
      >
        <TableShell<EvalProductionTraceRow>
          borderless
          columns={columns}
          dataSource={traces}
          rowKey="key"
          pagination={false}
          scroll={{ x: 980 }}
        />
      </EvalPanel>
    </div>
  );
}

function AnnotationPanelContent({
  spec,
  onStartAnnotate,
}: {
  spec: EvalProductionReportSpec;
  onStartAnnotate: () => void;
}) {
  const { annotationDetail: detail } = spec;

  const columns: ColumnsType<(typeof detail.records)[number]> = [
    {
      title: "Session",
      dataIndex: "session",
      width: 100,
      render: (value: string) => (
        <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12, color: getColorToken("component-primary") }}>
          {value}
        </span>
      ),
    },
    { title: "Agent", dataIndex: "agent", width: 88 },
    { title: "用户问题摘要", dataIndex: "question", ellipsis: true },
    {
      title: "标注结果",
      dataIndex: "result",
      width: 100,
      render: (value) => <EvalAnnotationResultBadge result={value} />,
    },
    { title: "备注", dataIndex: "note", width: 120, ellipsis: true },
    { title: "标注员", dataIndex: "annotator", width: 72 },
    { title: "时间", dataIndex: "time", width: 72 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: u["spacing/4x"] }}>
      <EvalSectionTitle title={detail.headline} subtitle={detail.subtitle} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: u["spacing/3x"] }}>
        <div
          style={{
            borderRadius: u["radius/l"],
            border: `1px solid ${tokenRgba("info-color", 0.25)}`,
            background: getColorToken("info-light-background"),
            padding: "16px 18px",
            display: "flex",
            flexDirection: "column",
            gap: u["spacing/1x"],
          }}
        >
          <span style={{ fontSize: 12, color: getColorToken("info-color"), fontWeight: 500 }}>
            待标注（本周）
          </span>
          <span
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 28,
              fontWeight: 700,
              color: getColorToken("info-color"),
            }}
          >
            {detail.pendingWeek}
          </span>
          <SensButton tone="primary" style={{ alignSelf: "flex-start", marginTop: 4 }} onClick={onStartAnnotate}>
            开始标注 →
          </SensButton>
        </div>
        <StatMiniCard
          value={String(detail.completedWeek)}
          label="本周已完成"
          note={`共 ${detail.queueTotal} 条本周入队`}
        />
        <StatMiniCard
          value={detail.avgScore.toFixed(2)}
          label="事实准确性均分"
          note={detail.avgDelta}
          deltaPositive
        />
      </div>

      <EvalPanel
        title="近期标注记录"
        extra={
          <span style={{ fontSize: getTypographyToken("font-size/s"), color: tokenRgba("text-sub-color-transparent", 0.58) }}>
            最近 5 条已完成标注
          </span>
        }
        padding={0}
      >
        <TableShell
          borderless
          columns={columns}
          dataSource={detail.records}
          rowKey="key"
          pagination={false}
          scroll={{ x: 860 }}
        />
      </EvalPanel>
    </div>
  );
}

function StatMiniCard({
  value,
  label,
  delta,
  note,
  accent,
  warning,
  deltaPositive,
}: {
  value: string;
  label: string;
  delta?: string;
  note?: string;
  accent?: boolean;
  warning?: boolean;
  deltaPositive?: boolean;
}) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "16px 12px",
        borderRadius: u["radius/l"],
        border: warning
          ? `1px solid ${tokenRgba("warning-color", 0.25)}`
          : getDividerBorder("outline", "transparent"),
        background: warning ? getColorToken("warning-light-background") : getColorToken("white"),
      }}
    >
      <div
        style={{
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 30,
          fontWeight: 700,
          color: accent
            ? getColorToken("component-primary")
            : warning
              ? getColorToken("warning-color")
              : tokenRgba("text-color-transparent", 0.9),
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 12, color: tokenRgba("text-sub-color-transparent", 0.58), marginTop: 3 }}>{label}</div>
      {delta ? (
        <div
          style={{
            marginTop: 5,
            fontSize: 12,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            color: getColorToken("success-color"),
          }}
        >
          {delta}
        </div>
      ) : null}
      {note ? (
        <div
          style={{
            marginTop: 5,
            fontSize: 11,
            color: deltaPositive ? getColorToken("success-color") : warning ? getColorToken("warning-color") : tokenRgba("text-sub-color-transparent", 0.58),
            fontWeight: warning ? 600 : undefined,
          }}
        >
          {note}
        </div>
      ) : null}
    </div>
  );
}
