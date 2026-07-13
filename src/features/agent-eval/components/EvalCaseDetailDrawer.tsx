import type { ColumnsType } from "antd/es/table";
import { Table } from "antd";
import { getColorToken, tokenRgba } from "../../../design-system/color-utils";
import { getDividerBorder } from "../../../design-system/divider";
import { getTypographyToken } from "../../../design-system/typography";
import tokens from "../../../design-system/tokens.resolved.json";
import { SensDrawer, SensTitleBar } from "../../../ui";
import "../../../ui/table.css";
import type { EvalCaseRecord } from "../evalDashboardTypes";
import { EvalScoreChip } from "./EvalBadges";

const u = tokens.unit as Record<string, number>;

export interface EvalCaseDetailDrawerProps {
  record: EvalCaseRecord | null;
  onClose: () => void;
}

export function EvalCaseDetailDrawer({ record, onClose }: EvalCaseDetailDrawerProps) {
  return (
    <SensDrawer
      open={record != null}
      size="medium"
      onClose={onClose}
      titleBar={
        <SensTitleBar
          title={record ? `用例 ${record.id}` : "用例详情"}
          onBack={onClose}
        />
      }
    >
      {record ? <EvalCaseDetailContent record={record} /> : null}
    </SensDrawer>
  );
}

export function EvalCaseDetailContent({ record }: { record: EvalCaseRecord }) {
  const columns: ColumnsType<(typeof record.evals)[number]> = [
    {
      title: "Evaluator",
      dataIndex: "name",
      width: 160,
      render: (value: string) => <strong>{value}</strong>,
    },
    {
      title: "得分",
      dataIndex: "score",
      align: "center",
      width: 88,
      render: (value: number) => <EvalScoreChip score={value} />,
    },
    {
      title: "得分理由",
      dataIndex: "reason",
      ellipsis: true,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: u["spacing/5x"] }}>
      <DetailField label="输入" value={record.input} />
      <DetailField label="期望输出" value={record.expected} />
      <DetailField label="实际输出" value={record.output} />
      <DetailField label="意图" value={record.intent} />

      <div>
        <div
          style={{
            fontSize: getTypographyToken("font-size/m"),
            fontWeight: getTypographyToken("font-weight/semibold"),
            color: tokenRgba("text-color-transparent", 0.9),
            marginBottom: u["spacing/3x"],
          }}
        >
          Evaluator 得分
        </div>
        <div
          style={{
            border: getDividerBorder("outline", "transparent"),
            borderRadius: u["radius/l"],
            overflow: "hidden",
            background: getColorToken("white"),
          }}
        >
          <Table
            className="sens-table"
            columns={columns}
            dataSource={record.evals.map((item) => ({ ...item, key: item.name }))}
            rowKey="name"
            pagination={false}
            size="middle"
          />
        </div>
      </div>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: getTypographyToken("font-size/s"),
          color: tokenRgba("text-sub-color-transparent", 0.58),
          marginBottom: u["spacing/1x"],
          fontWeight: getTypographyToken("font-weight/medium"),
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: getTypographyToken("font-size/m"),
          lineHeight: `${getTypographyToken("line-height/m")}px`,
          color: tokenRgba("text-color-transparent", 0.9),
        }}
      >
        {value}
      </div>
    </div>
  );
}
