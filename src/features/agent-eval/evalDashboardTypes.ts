export type EvalDimensionTone = "green" | "blue" | "purple";

export type EvalChangeType = "regression" | "fix" | "neutral";

export type EvalStatusLabel = "improvement" | "watch" | "neutral";

export type EvalReportTab = "offline" | "production";

export type EvalKpiPanelKey = "score" | "coverage" | "lowscore" | "annotation";

export interface EvalFilterOptions {
  agents: { value: string; label: string }[];
  experiments: { value: string; label: string }[];
  reportTimes: { value: string; label: string }[];
}

export interface EvalMetaItem {
  label: string;
  value: string;
}

export interface EvalRegressionStats {
  regression: number;
  fix: number;
  neutral: number;
}

export interface EvalConclusionSpec {
  grade: string;
  summary: string;
  suggestions: string[];
}

export interface EvalScoreOverviewSpec {
  currentVersion: string;
  baselineVersion: string;
  currentScore: number;
  baselineScore: number;
  delta: number;
  regression: EvalRegressionStats;
  conclusion: EvalConclusionSpec;
}

export interface EvalEvaluatorRow {
  key: string;
  dimensionKey: string;
  dimensionLabel: string;
  dimensionWeight: string;
  dimensionTone: EvalDimensionTone;
  dimensionRowSpan: number;
  evaluator: string;
  currentScore: number;
  baselineScore: number;
  changeLabel: string;
  changePositive: boolean | null;
  scoreTone?: "success" | "warning" | "default";
  status: EvalStatusLabel;
  /** Evaluator 在维度内的权重，生产环境表头用 */
  evaluatorWeight?: string;
}

export interface EvalCaseEval {
  name: string;
  score: number;
  reason: string;
}

export interface EvalCaseRecord {
  key: string;
  id: string;
  input: string;
  expected: string;
  output: string;
  intent: string;
  change: EvalChangeType;
  evals: EvalCaseEval[];
}

export interface EvalFormulaSpec {
  expression: string;
  footnote: string;
}

export interface EvalOfflineReportSpec {
  meta: EvalMetaItem[];
  overview: EvalScoreOverviewSpec;
  evaluators: EvalEvaluatorRow[];
  formula: EvalFormulaSpec;
  cases: EvalCaseRecord[];
  filterOptions: EvalFilterOptions;
}

export interface EvalKpiCardSpec {
  key: EvalKpiPanelKey;
  label: string;
  value: string;
  sub: string;
  delta?: string;
  deltaPositive?: boolean | null;
  valueTone?: "default" | "warning" | "danger";
  indicator: string;
}

export interface EvalProductionTraceRow {
  key: string;
  id: string;
  time: string;
  agent: string;
  input: string;
  overall: number;
  accuracy: number;
  relevance: number;
  halluc: "pass" | "fail";
  annotation: "待标注" | "标注中" | "已完成";
}

export type EvalAnnotationResult = "accurate" | "partial" | "inaccurate";

export interface EvalAnnotationRecord {
  key: string;
  session: string;
  agent: string;
  question: string;
  result: EvalAnnotationResult;
  note: string;
  annotator: string;
  time: string;
}

export interface EvalProductionReportSpec {
  filterOptions: EvalFilterOptions;
  kpis: EvalKpiCardSpec[];
  scoreDetail: {
    headline: string;
    evaluators: EvalEvaluatorRow[];
    formula: EvalFormulaSpec;
    currentLabel: string;
    baselineLabel: string;
  };
  coverageDetail: {
    headline: string;
    current: string;
    previous: string;
    target: string;
    progress: string;
    delta: string;
  };
  lowTraces: EvalProductionTraceRow[];
  annotationDetail: {
    headline: string;
    subtitle: string;
    pendingWeek: number;
    completedWeek: number;
    queueTotal: number;
    avgScore: number;
    avgDelta: string;
    records: EvalAnnotationRecord[];
  };
}
