import type { EvalDimensionTone } from "../evalDashboardTypes";
import { getColorToken, tokenRgba } from "../../../design-system/color-utils";
import { SensBadge } from "../../../ui";
import { getDimensionColor, getDimensionColorRgba } from "../evalDimensionColors";

export function EvalDimensionCell({
  label,
  weight,
  tone,
}: {
  label: string;
  weight: string;
  tone: EvalDimensionTone;
}) {
  const color = getDimensionColor(tone);

  return (
    <div
      style={{
        borderLeft: `3px solid ${color}`,
        background: getDimensionColorRgba(tone, 0.08),
        padding: "10px 14px",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          color,
          fontSize: 12,
          fontWeight: 600,
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <span
        style={{
          display: "inline-block",
          fontSize: 10,
          fontWeight: 700,
          padding: "1px 7px",
          borderRadius: 10,
          background: getDimensionColorRgba(tone, 0.12),
          color,
        }}
      >
        {weight}
      </span>
    </div>
  );
}

export function EvalStatusPill({ status }: { status: "improvement" | "watch" | "neutral" }) {
  const map = {
    improvement: { tone: "success" as const, label: "改善" },
    watch: { tone: "warning" as const, label: "关注" },
    neutral: { tone: "default" as const, label: "持平" },
  };
  const item = map[status];
  return <SensBadge variant="status" status={item.tone} text={item.label} />;
}

export function EvalScoreChip({ score }: { score: number }) {
  const color =
    score >= 0.9
      ? getColorToken("success-color")
      : score >= 0.7
        ? getColorToken("warning-color")
        : getColorToken("warning-color-active");

  return (
    <span
      style={{
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: 12,
        fontWeight: 700,
        padding: "1px 6px",
        borderRadius: 4,
        background: tokenRgba("background-transparent-grey", 0.04),
        color,
      }}
    >
      {score.toFixed(2)}
    </span>
  );
}

export function EvalAnnotationResultBadge({ result }: { result: "accurate" | "partial" | "inaccurate" }) {
  const map = {
    accurate: { tone: "success" as const, label: "准确" },
    partial: { tone: "warning" as const, label: "部分准确" },
    inaccurate: { tone: "error" as const, label: "不准确" },
  };
  const item = map[result];
  return <SensBadge variant="status" status={item.tone} text={item.label} />;
}

export function EvalHallucBadge({ value }: { value: "pass" | "fail" }) {
  return (
    <SensBadge
      variant="status"
      status={value === "pass" ? "success" : "error"}
      text={value === "pass" ? "pass" : "fail"}
    />
  );
}

export function EvalTraceAnnotationBadge({
  status,
}: {
  status: "待标注" | "标注中" | "已完成";
}) {
  const map = {
    待标注: { tone: "default" as const, label: "待标注" },
    标注中: { tone: "warning" as const, label: "标注中" },
    已完成: { tone: "success" as const, label: "已完成" },
  };
  const item = map[status];
  return <SensBadge variant="status" status={item.tone} text={item.label} />;
}
