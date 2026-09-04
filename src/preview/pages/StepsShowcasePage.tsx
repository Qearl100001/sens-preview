import { useState } from "react";
import { Segmented, Space, Typography } from "antd";
import stepsDoc from "../../design-system/components/base/steps.md?raw";
import { SensSteps, type SensStepItem, type SensStepsSize } from "../../ui";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";

const { Text } = Typography;

const ITEMS_PLAIN: SensStepItem[] = [
  { key: "one", title: "步骤一" },
  { key: "two", title: "步骤二" },
  { key: "three", title: "步骤三" },
  { key: "four", title: "步骤四" },
];

const ITEMS_WITH_HELPER: SensStepItem[] = ITEMS_PLAIN.map((item) => ({
  ...item,
  description: "辅助文案",
}));

function StepsDemo() {
  const [current, setCurrent] = useState(1);
  const [size, setSize] = useState<SensStepsSize>("large");
  const [withHelper, setWithHelper] = useState(false);
  const demoItems = withHelper ? ITEMS_WITH_HELPER : ITEMS_PLAIN;
  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Space wrap align="center">
        <Text type="secondary">尺寸</Text>
        <Segmented
          value={size}
          options={[{ label: "大", value: "large" }, { label: "小", value: "small" }]}
          onChange={(value) => setSize(value as SensStepsSize)}
        />
        <Text type="secondary">辅助文案</Text>
        <Segmented
          value={withHelper ? "有" : "无"}
          options={["无", "有"]}
          onChange={(value) => setWithHelper(value === "有")}
        />
      </Space>
      <Text type="secondary">点击步骤可切换当前步骤，验证真实交互；下方状态分区为固定视觉验收样例。</Text>
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <Text strong>基础交互 Demo</Text>
        <SensSteps size={size} items={demoItems} current={current} onChange={setCurrent} />
      </Space>
      <Text type="secondary">禁用项不响应点击；固定状态样例请在下方状态矩阵中逐项核对。</Text>
    </Space>
  );
}

function StepsStateMatrix() {
  const unfinished = ["默认", "悬停", "点击", "加载", "加载悬停", "禁用", "禁用悬停"];
  const currentStates = ["默认", "悬停"];
  const finishedStates = ["默认", "悬停", "点击"];
  const previewClass = (label: string) => ({ "悬停": "sens-steps-preview-hover", "点击": "sens-steps-preview-pressed", "加载悬停": "sens-steps-preview-loading-hover", "禁用悬停": "sens-steps-preview-disabled-hover" }[label]);
  const renderState = (label: string, status: "wait" | "current" | "finish" | "loading" | "disabled", helper = false, error = false, size: "large" | "small" = "large") => (
    <Space direction="vertical" size="small" key={`${size}-${helper ? "helper" : "plain"}-${label}`}>
      <Text type="secondary">{label}</Text>
      <SensSteps
        size={size}
        items={[{ key: "one", title: "标题", description: helper ? "辅助文案" : undefined, status, error }]}
        onChange={() => undefined}
        className={[previewClass(label), error ? "sens-steps-preview-error" : ""].filter(Boolean).join(" ")}
      />
    </Space>
  );
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Text strong>状态矩阵 · 大尺寸</Text>
      <Space direction="vertical" size="small"><Text strong>无辅助文案 · 未完成步骤</Text><Space wrap>{unfinished.map((label) => renderState(label, label.includes("加载") ? "loading" : label.includes("禁用") ? "disabled" : "wait"))}</Space></Space>
      <Space direction="vertical" size="small"><Text strong>无辅助文案 · 当前项</Text><Space wrap>{currentStates.map((label) => renderState(label, "current"))}</Space></Space>
      <Space direction="vertical" size="small"><Text strong>无辅助文案 · 已完成步骤</Text><Space wrap>{finishedStates.map((label) => renderState(label, "finish"))}</Space></Space>
      <Space direction="vertical" size="small"><Text strong>有辅助文案 · 未完成步骤</Text><Space wrap>{unfinished.map((label) => renderState(label, label.includes("加载") ? "loading" : label.includes("禁用") ? "disabled" : "wait", true))}</Space></Space>
      <Space direction="vertical" size="small"><Text strong>有辅助文案 · 当前项</Text><Space wrap>{currentStates.map((label) => renderState(label, "current", true))}</Space></Space>
      <Space direction="vertical" size="small"><Text strong>有辅助文案 · 已完成步骤</Text><Space wrap>{finishedStates.map((label) => renderState(label, "finish", true))}</Space></Space>
      <Space direction="vertical" size="small"><Text strong>无辅助文案 · 未完成报错</Text><Space wrap>{unfinished.slice(0, 5).map((label) => renderState(label, label.includes("加载") ? "loading" : "wait", false, true))}</Space></Space>
      <Space direction="vertical" size="small"><Text strong>无辅助文案 · 当前项报错</Text><Space wrap>{currentStates.map((label) => renderState(label, "current", false, true))}</Space></Space>
      <Space direction="vertical" size="small"><Text strong>无辅助文案 · 已完成报错</Text><Space wrap>{finishedStates.map((label) => renderState(label, "finish", false, true))}</Space></Space>
      <Space direction="vertical" size="small"><Text strong>有辅助文案 · 未完成报错</Text><Space wrap>{unfinished.slice(0, 5).map((label) => renderState(label, label.includes("加载") ? "loading" : "wait", true, true))}</Space></Space>
      <Space direction="vertical" size="small"><Text strong>有辅助文案 · 当前项报错</Text><Space wrap>{currentStates.map((label) => renderState(label, "current", true, true))}</Space></Space>
      <Space direction="vertical" size="small"><Text strong>有辅助文案 · 已完成报错</Text><Space wrap>{finishedStates.map((label) => renderState(label, "finish", true, true))}</Space></Space>
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <Text strong>状态矩阵 · 小尺寸 · 无辅助文案</Text>
        <Space wrap>{unfinished.map((label) => renderState(label, label.includes("加载") ? "loading" : label.includes("禁用") ? "disabled" : "wait", false, false, "small"))}</Space>
      </Space>
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <Text strong>状态矩阵 · 小尺寸 · 有辅助文案</Text>
        <Space wrap>{unfinished.map((label) => renderState(label, label.includes("加载") ? "loading" : label.includes("禁用") ? "disabled" : "wait", true, false, "small"))}</Space>
      </Space>
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <Text type="secondary">禁用</Text>
        <SensSteps items={ITEMS_PLAIN.map((item, index) => ({ ...item, disabled: index === 2 }))} current={1} />
      </Space>
    </Space>
  );
}

export default function StepsShowcasePage() {
  return (
    <ComponentShowcaseLayout
      title="步骤条 Steps"
      demo={<StepsDemo />}
      matrix={<StepsStateMatrix />}
      designDocSource={stepsDoc}
      devDocSource={stepsDoc}
    />
  );
}
