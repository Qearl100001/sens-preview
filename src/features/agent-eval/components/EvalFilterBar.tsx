import { useState } from "react";
import { getColorToken, tokenRgba } from "../../../design-system/color-utils";
import { getDividerBorder } from "../../../design-system/divider";
import { getTypographyToken } from "../../../design-system/typography";
import tokens from "../../../design-system/tokens.resolved.json";
import { SensButton, SensSelectDropdown } from "../../../ui";
import type { EvalFilterOptions } from "../evalDashboardTypes";

const u = tokens.unit as Record<string, number>;

export interface EvalFilterBarProps {
  filterOptions: EvalFilterOptions;
  defaultAgent?: string;
  defaultExperiment?: string;
  defaultReportTime?: string;
  onApply?: () => void;
}

export function EvalFilterBar({
  filterOptions,
  defaultAgent,
  defaultExperiment,
  defaultReportTime = "2024-05",
  onApply,
}: EvalFilterBarProps) {
  const [agent, setAgent] = useState(defaultAgent ?? filterOptions.agents[0]?.value ?? "");
  const [experiment, setExperiment] = useState(
    defaultExperiment ?? filterOptions.experiments[0]?.value ?? "",
  );
  const [reportTime, setReportTime] = useState(defaultReportTime);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: u["spacing/3x"],
        padding: u["spacing/3x"],
        background: getColorToken("white"),
        border: getDividerBorder("outline", "transparent"),
        borderRadius: u["radius/l"],
        alignItems: "flex-end",
      }}
    >
      <FilterField label="被测 Agent">
        <SensSelectDropdown
          style={{ width: 180 }}
          value={agent}
          options={filterOptions.agents.map((o) => ({ label: o.label, value: o.value }))}
          onChange={(v: string | number) => setAgent(String(v ?? ""))}
        />
      </FilterField>
      <FilterField label="评测任务名称">
        <SensSelectDropdown
          style={{ width: 280 }}
          value={experiment}
          options={filterOptions.experiments.map((o) => ({ label: o.label, value: o.value }))}
          onChange={(v: string | number) => setExperiment(String(v ?? ""))}
        />
      </FilterField>
      <FilterField label="报告时间">
        <SensSelectDropdown
          style={{ width: 160 }}
          value={reportTime}
          options={filterOptions.reportTimes.map((o) => ({ label: o.label, value: o.value }))}
          onChange={(v: string | number) => setReportTime(String(v ?? ""))}
        />
      </FilterField>
      <SensButton tone="primary" style={{ marginLeft: "auto" }} onClick={onApply}>
        查询
      </SensButton>
    </div>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: u["spacing/1x"] }}>
      <span
        style={{
          color: tokenRgba("text-sub-color-transparent", 0.58),
          fontSize: getTypographyToken("font-size/s"),
          lineHeight: `${getTypographyToken("line-height/s")}px`,
          fontWeight: getTypographyToken("font-weight/medium"),
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}
