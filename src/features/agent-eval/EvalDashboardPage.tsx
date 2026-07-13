import { useState } from "react";
import tokens from "../../design-system/tokens.resolved.json";
import { SensLineTabs } from "../../ui";
import { AgentEvalShell } from "./AgentEvalShell";
import { EvalCaseTable } from "./components/EvalCaseTable";
import { EvalDimensionSection } from "./components/EvalDimensionSection";
import { EvalFilterBar } from "./components/EvalFilterBar";
import { EVAL_MODULE_STACK_GAP, EVAL_TOOLBAR_STACK_GAP } from "./components/EvalLayout";
import { EvalMetaBar } from "./components/EvalMetaBar";
import { EvalOverviewSection } from "./components/EvalOverviewSection";
import { EvalPageHeader } from "./components/EvalPageHeader";
import { EvalProductionSection } from "./components/EvalProductionSection";
import type { EvalReportTab } from "./evalDashboardTypes";
import { EVAL_OFFLINE_REPORT_SPEC } from "./evalOfflineReportSpec";
import { EVAL_PRODUCTION_REPORT_SPEC } from "./evalProductionReportSpec";

const u = tokens.unit as Record<string, number>;

const TAB_DESCRIPTION: Record<EvalReportTab, string> = {
  offline: "查看离线实验评测报告 · 按 Agent、任务与报告时间筛选 · 综合分与回归结果一屏对比",
  production:
    "查看生产环境与离线实验两类评测报告 · 按 Agent、任务与报告时间筛选 · 综合分、覆盖率与回归结果一屏对比",
};

export default function EvalDashboardPage() {
  const [activeTab, setActiveTab] = useState<EvalReportTab>("offline");
  const offlineSpec = EVAL_OFFLINE_REPORT_SPEC;

  return (
    <AgentEvalShell>
      <EvalPageHeader title="评测报告" description={TAB_DESCRIPTION[activeTab]} />

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
          padding: `0 ${u["spacing/6x"]}px ${u["spacing/6x"]}px`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <SensLineTabs
          barOnly
          size="large"
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as EvalReportTab)}
          items={[
            { key: "offline", label: "离线实验" },
            { key: "production", label: "生产环境" },
          ]}
        />

        {activeTab === "offline" ? (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: EVAL_TOOLBAR_STACK_GAP,
                marginTop: EVAL_TOOLBAR_STACK_GAP,
              }}
            >
              <EvalFilterBar filterOptions={offlineSpec.filterOptions} defaultAgent="analysis" />
              <EvalMetaBar items={offlineSpec.meta} />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: EVAL_MODULE_STACK_GAP,
                marginTop: EVAL_MODULE_STACK_GAP,
              }}
            >
              <EvalOverviewSection overview={offlineSpec.overview} />
              <EvalDimensionSection evaluators={offlineSpec.evaluators} formula={offlineSpec.formula} />
              <EvalCaseTable cases={offlineSpec.cases} />
            </div>
          </>
        ) : (
          <div style={{ marginTop: EVAL_TOOLBAR_STACK_GAP }}>
            <EvalProductionSection spec={EVAL_PRODUCTION_REPORT_SPEC} />
          </div>
        )}
      </div>
    </AgentEvalShell>
  );
}
