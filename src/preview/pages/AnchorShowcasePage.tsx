import { useState } from "react";
import { Segmented, Space, Typography } from "antd";
import anchorDevDoc from "../../design-system/components/base/anchor.md?raw";
import { SensAnchor, type SensAnchorItem } from "../../ui";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";

const { Text } = Typography;

const ITEMS: SensAnchorItem[] = [
  { key: "title", label: "标题" },
  { key: "level1", label: "一级子标题", level: 1 },
  { key: "level2", label: "二级子标题", level: 2 },
  { key: "level3", label: "三级子标题", level: 3 },
  { key: "disabled", label: "禁用项", disabled: true },
];

function AnchorDemo() {
  const [activeKey, setActiveKey] = useState("title");
  const [expanded, setExpanded] = useState(true);
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Space align="center">
        <Text type="secondary">状态</Text>
        <Segmented
          value={expanded ? "展开" : "收起"}
          options={["展开", "收起"]}
          onChange={(value) => setExpanded(value === "展开")}
        />
        <Text type="secondary">当前项：{activeKey}</Text>
      </Space>
      <div className="sens-anchor-demo-align-right"><SensAnchor items={ITEMS} activeKey={activeKey} expanded={expanded} onChange={setActiveKey} onExpandedChange={setExpanded} /></div>
      <Text type="secondary">默认展开·固定展示</Text>
      <SensAnchor items={ITEMS} activeKey={activeKey} fixed onChange={setActiveKey} />
    </Space>
  );
}

const STATE_ITEMS: Array<{ key: string; label: string; className?: string; activeKey?: string }> = [
  { key: "default", label: "默认" },
  { key: "hover", label: "悬停", className: "sens-anchor-preview-hover" },
  { key: "pressed", label: "点击", className: "sens-anchor-preview-pressed" },
  { key: "selected", label: "选中", activeKey: "title" },
  { key: "selected-hover", label: "选中悬停", className: "sens-anchor-preview-selected-hover", activeKey: "title" },
];

function AnchorStateMatrix() {
  return (
    <div className="sens-anchor-state-matrix" aria-label="锚点状态矩阵">
      {STATE_ITEMS.map((state) => (
        <div className="sens-anchor-state-tile" key={state.key}>
          <Text type="secondary">{state.label}</Text>
          <SensAnchor
            items={[{ key: "title", label: "标题" }]}
            activeKey={state.activeKey ?? "none"}
            expanded
            className={state.className}
          />
        </div>
      ))}
    </div>
  );
}

function AnchorModeGallery() {
  const [activeKey, setActiveKey] = useState("title");
  const [pushExpanded, setPushExpanded] = useState(true);
  const [popoverExpanded, setPopoverExpanded] = useState(true);
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Text strong>最新纵向锚点模式</Text>
      <Space align="start" size="large" wrap>
        <Space direction="vertical" size="small">
          <Text type="secondary">常驻</Text>
          <div className="sens-anchor-mode-stage"><SensAnchor items={ITEMS} mode="fixed" activeKey={activeKey} onChange={setActiveKey} /></div>
        </Space>
        <Space direction="vertical" size="small">
          <Text type="secondary">点击展开后向左挤压</Text>
          <div className="sens-anchor-mode-stage"><SensAnchor items={ITEMS} mode="push" activeKey={activeKey} expanded={pushExpanded} onChange={setActiveKey} onExpandedChange={setPushExpanded} /></div>
        </Space>
        <Space direction="vertical" size="small">
          <Text type="secondary">点击展开悬浮卡片</Text>
          <div className="sens-anchor-mode-stage"><SensAnchor items={ITEMS} mode="popover" activeKey={activeKey} expanded={popoverExpanded} onChange={setActiveKey} onExpandedChange={setPopoverExpanded} /></div>
        </Space>
      </Space>
    </Space>
  );
}

function AnchorCollapseStateMatrix() {
  return (
    <Space direction="vertical" size="small">
      <Text strong>收起按钮状态</Text>
      <Space align="start" size="large">
        <Space direction="vertical" size="small"><Text type="secondary">默认</Text><SensAnchor items={ITEMS} expanded={false} /></Space>
        <Space direction="vertical" size="small"><Text type="secondary">悬停</Text><SensAnchor items={ITEMS} expanded={false} className="sens-anchor-preview-collapse-hover" /></Space>
        <Space direction="vertical" size="small"><Text type="secondary">点击</Text><SensAnchor items={ITEMS} expanded={false} className="sens-anchor-preview-collapse-pressed" /></Space>
      </Space>
    </Space>
  );
}

export default function AnchorShowcasePage() {
  return (
    <ComponentShowcaseLayout
      title="锚点 Anchor"
      demo={<AnchorDemo />}
      matrix={<Space direction="vertical" size="large" style={{ width: "100%" }}><AnchorModeGallery /><AnchorCollapseStateMatrix /><AnchorStateMatrix /></Space>}
      designDocSource={anchorDevDoc}
      devDocSource={anchorDevDoc}
    />
  );
}
