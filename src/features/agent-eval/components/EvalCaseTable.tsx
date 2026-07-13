import { useMemo, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import { getColorToken, tokenRgba } from "../../../design-system/color-utils";
import { getTypographyToken } from "../../../design-system/typography";
import tokens from "../../../design-system/tokens.resolved.json";
import { LinkButton, SensSelectDropdown, TableShell } from "../../../ui";
import type { EvalCaseRecord, EvalChangeType } from "../evalDashboardTypes";
import { EvalScoreChip } from "./EvalBadges";
import { EvalCaseDetailDrawer } from "./EvalCaseDetailDrawer";
import { EvalSectionTitle } from "./EvalLayout";

const u = tokens.unit as Record<string, number>;

const CASE_FILTER_OPTIONS = [
  { value: "", label: "全部用例（9条）" },
  { value: "regression", label: "仅看引入问题（3条）" },
  { value: "fix", label: "仅看修复确认（4条）" },
  { value: "neutral", label: "仅看持平（2条）" },
];

export function EvalCaseTable({ cases }: { cases: EvalCaseRecord[] }) {
  const [filter, setFilter] = useState("");
  const [activeCase, setActiveCase] = useState<EvalCaseRecord | null>(null);

  const filtered = useMemo(() => {
    if (!filter) return cases;
    return cases.filter((item) => item.change === filter);
  }, [cases, filter]);

  const columns: ColumnsType<EvalCaseRecord> = [
    {
      title: "用例 ID",
      dataIndex: "id",
      width: 100,
      render: (value: string) => (
        <span
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 12,
            color: getColorToken("component-primary"),
          }}
        >
          {value}
        </span>
      ),
    },
    { title: "输入", dataIndex: "input", ellipsis: true },
    { title: "期望输出", dataIndex: "expected", ellipsis: true },
    { title: "实际输出", dataIndex: "output", ellipsis: true },
    { title: "意图", dataIndex: "intent", width: 160, ellipsis: true },
    {
      title: "Evaluator 均分",
      dataIndex: "avgScore",
      align: "right",
      width: 120,
      render: (_value, record) => {
        const avg = record.evals.reduce((sum, item) => sum + item.score, 0) / record.evals.length;
        return <EvalScoreChip score={avg} />;
      },
    },
    {
      title: "操作",
      key: "action",
      align: "center",
      width: 88,
      render: (_value, record) => (
        <LinkButton onClick={() => setActiveCase(record)}>详情</LinkButton>
      ),
    },
  ];

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: u["spacing/3x"] }}>
      <EvalSectionTitle
        title="用例明细"
        actions={
          <SensSelectDropdown
            style={{ width: 200 }}
            value={filter}
            options={CASE_FILTER_OPTIONS.map((o) => ({ label: o.label, value: o.value }))}
            onChange={(v) => setFilter(String(v ?? ""))}
          />
        }
      />
      <TableShell<EvalCaseRecord>
        total={filtered.length}
        columns={columns}
        dataSource={filtered}
        rowKey="key"
        pagination={false}
        scroll={{ x: 1100 }}
      />
      <EvalCaseDetailDrawer record={activeCase} onClose={() => setActiveCase(null)} />
    </section>
  );
}

export type { EvalChangeType };
