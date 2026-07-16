import { useState } from "react";
import { Alert, Segmented, Space, Table, Tag, Typography, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import layoutDocSource from "../../../../docs/foundations/layout.md?raw";
import { BasicStylePageLayout } from "./BasicStylePageLayout";

const { Text, Title } = Typography;

// Fixed expanded width from the product side-navigation Figma and current shell implementation.
const PRODUCT_SIDER_EXPANDED_WIDTH = 220;

const PAGE_LAYOUT_ROWS = [
  { key: "t", layout: "T 型布局", scene: "三级落地页、带产品壳导航的管理页", structure: "顶部导航 + 左侧产品壳导航 + 主内容区", note: "侧导展开宽度固定 220px，主内容使用剩余宽度" },
  { key: "vertical", layout: "上下布局", scene: "独立管理页、下钻详情页", structure: "顶部标题 / 操作区 + 下方内容区", note: "标题区不承担复杂分栏，内容区再选择局部结构" },
  { key: "context", layout: "上下 + 上下文侧栏", scene: "锚点、目录、详情辅助区", structure: "页面内辅助侧栏 + 主内容区", note: "展开或收起后，主内容和内部栅格重新计算" },
];

const PANEL_BEHAVIOR_ROWS = [
  { key: "overlay", type: "产品壳侧导", behavior: "Overlay", trigger: "鼠标悬停临时展开", content: "主内容不变，侧导覆盖在内容上", color: "Navigation Theme" },
  { key: "docked", type: "产品壳侧导", behavior: "Docked", trigger: "用户锁定展开", content: "主内容使用剩余宽度", color: "Navigation Theme" },
  { key: "reflow", type: "锚点 / 目录等上下文侧栏", behavior: "Reflow", trigger: "页面内展开或收起", content: "主内容和内部栅格重新计算", color: "Foundation / 组件语义" },
];

const BREAKPOINT_ROWS = [
  { key: "xs", breakpoint: "XS", width: "1280", strategy: "静态布局", note: "内容保持固定结构，必要时横向滚动" },
  { key: "sm", breakpoint: "SM", width: "1366", strategy: "响应式布局", note: "进入桌面端常规验收区间" },
  { key: "md", breakpoint: "MD", width: "1440", strategy: "响应式布局", note: "设计画布默认宽度" },
  { key: "lg", breakpoint: "LG", width: "1600", strategy: "响应式布局", note: "大桌面内容更舒展" },
  { key: "xl", breakpoint: "XL", width: "1920", strategy: "大屏优化", note: "保留更宽的内容展开空间" },
];

type PanelMode = "overlay" | "docked" | "reflow";

function ContentPlaceholder({ dense = false }: { dense?: boolean }) {
  const { token } = theme.useToken();
  const count = dense ? 4 : 3;

  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`, gap: token.marginSM }}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          style={{
            minHeight: token.controlHeightLG * 2,
            border: `${token.lineWidth}px solid ${token.colorBorderSecondary}`,
            borderRadius: token.borderRadius,
            background: token.colorFillQuaternary,
          }}
        />
      ))}
    </div>
  );
}

function LayoutSkeletons() {
  const { token } = theme.useToken();
  const cardStyle = {
    padding: token.paddingMD,
    border: `${token.lineWidth}px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
    background: token.colorBgContainer,
  } as const;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: token.marginMD }}>
      <div style={cardStyle}>
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <Text strong>T 型布局</Text>
          <Text type="secondary">适合有产品壳导航的三级落地页。</Text>
          <div style={{ display: "flex", minHeight: token.controlHeightLG * 5 }}>
            <div style={{ flex: `0 0 ${PRODUCT_SIDER_EXPANDED_WIDTH}px`, padding: token.paddingSM, background: token.colorFillTertiary, borderRight: `${token.lineWidth}px solid ${token.colorBorderSecondary}` }}>
              <Tag color="green">产品壳侧导</Tag>
            </div>
            <div style={{ flex: 1, padding: token.paddingSM, minWidth: 0 }}>
              <ContentPlaceholder dense />
            </div>
          </div>
        </Space>
      </div>
      <div style={cardStyle}>
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <Text strong>上下布局</Text>
          <Text type="secondary">适合独立管理页或下钻详情页。</Text>
          <div style={{ padding: token.paddingSM, background: token.colorFillTertiary, borderRadius: token.borderRadius }}>
            <Text type="secondary">标题 / 操作区</Text>
          </div>
          <ContentPlaceholder />
        </Space>
      </div>
    </div>
  );
}

function LeftPanelBehaviorBoard() {
  const { token } = theme.useToken();
  const [mode, setMode] = useState<PanelMode>("overlay");
  const isOverlay = mode === "overlay";
  const isContext = mode === "reflow";
  const panelLabel = isContext ? "页面内目录" : "产品壳侧导";
  const panelDescription = isOverlay ? "临时展开：覆盖内容，不改变内容宽度" : isContext ? "页面内展开：内容和栅格重新计算" : "锁定展开：内容使用剩余宽度";

  const panel = (
    <div
      style={{
        width: PRODUCT_SIDER_EXPANDED_WIDTH,
        flex: `0 0 ${PRODUCT_SIDER_EXPANDED_WIDTH}px`,
        padding: token.paddingSM,
        background: isContext ? token.colorFillTertiary : token.colorFillSecondary,
        borderRight: `${token.lineWidth}px solid ${token.colorBorderSecondary}`,
        boxShadow: isOverlay ? token.boxShadowSecondary : undefined,
      }}
    >
      <Space direction="vertical" size="small">
        <Text strong>{panelLabel}</Text>
        <Text type="secondary">{panelDescription}</Text>
        <Tag color={isContext ? "blue" : "green"}>{mode === "overlay" ? "Overlay" : mode === "docked" ? "Docked" : "Reflow"}</Tag>
      </Space>
    </div>
  );

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Segmented
        value={mode}
        onChange={(value) => setMode(value as PanelMode)}
        options={[
          { label: "临时覆盖", value: "overlay" },
          { label: "锁定侧导", value: "docked" },
          { label: "页面内目录", value: "reflow" },
        ]}
      />
      <div style={{ position: "relative", display: "flex", minHeight: token.controlHeightLG * 7, overflow: "hidden", border: `${token.lineWidth}px solid ${token.colorBorderSecondary}`, borderRadius: token.borderRadiusLG, background: token.colorBgContainer }}>
        {isOverlay ? <div style={{ position: "absolute", insetBlock: 0, insetInlineStart: 0, zIndex: 1 }}>{panel}</div> : panel}
        <div style={{ flex: 1, minWidth: 0, padding: token.paddingMD }}>
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Text strong>主内容区</Text>
            <Text type="secondary">{isOverlay ? "仍使用整块内容宽度" : "按剩余内容宽度组织"}</Text>
            <ContentPlaceholder dense={!isOverlay} />
          </Space>
        </div>
      </div>
    </Space>
  );
}

function LayoutSpecimen() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginTop: 0 }}>布局规则入口</Title>
        <Text type="secondary">页面骨架先决定区域关系，再把内容交给栅格组织。</Text>
      </div>
      <Alert type="info" showIcon message="Layout 不等于 Grid" description="这里查看骨架、断点和左侧区域行为；20 栏、12 栏及局部列数已移到独立的“栅格”页。" />
      <section>
        <Title level={5}>页面骨架样张</Title>
        <LayoutSkeletons />
      </section>
      <section>
        <Title level={5}>左侧区域展开 / 收起行为</Title>
        <LeftPanelBehaviorBoard />
      </section>
      <section>
        <Title level={5}>页面级布局类型</Title>
        <Table columns={layoutColumns} dataSource={PAGE_LAYOUT_ROWS} pagination={false} size="small" scroll={{ x: 900 }} />
      </section>
      <section>
        <Title level={5}>行为边界</Title>
        <Table columns={behaviorColumns} dataSource={PANEL_BEHAVIOR_ROWS} pagination={false} size="small" scroll={{ x: 860 }} />
      </section>
      <section>
        <Title level={5}>断点与适配</Title>
        <Table columns={breakpointColumns} dataSource={BREAKPOINT_ROWS} pagination={false} size="small" />
      </section>
      <Alert type="warning" showIcon message="侧导紧凑态宽度仍待从图标资产与交互稿确认" description="本页只使用 Figma 已明确且产品壳已消费的 220px 展开宽度；紧凑 rail 宽度不在这里推导成全局规则。" />
    </Space>
  );
}

const layoutColumns: ColumnsType<(typeof PAGE_LAYOUT_ROWS)[number]> = [
  { title: "布局类型", dataIndex: "layout", key: "layout", width: 160 },
  { title: "适用场景", dataIndex: "scene", key: "scene", width: 220 },
  { title: "结构", dataIndex: "structure", key: "structure", width: 300 },
  { title: "说明", dataIndex: "note", key: "note", width: 280 },
];

const behaviorColumns: ColumnsType<(typeof PANEL_BEHAVIOR_ROWS)[number]> = [
  { title: "区域类型", dataIndex: "type", key: "type", width: 180 },
  { title: "行为", dataIndex: "behavior", key: "behavior", width: 110, render: (value: string) => <Tag>{value}</Tag> },
  { title: "触发方式", dataIndex: "trigger", key: "trigger", width: 190 },
  { title: "主内容", dataIndex: "content", key: "content", width: 220 },
  { title: "颜色归属", dataIndex: "color", key: "color", width: 160 },
];

const breakpointColumns: ColumnsType<(typeof BREAKPOINT_ROWS)[number]> = [
  { title: "断点", dataIndex: "breakpoint", key: "breakpoint", width: 100 },
  { title: "宽度", dataIndex: "width", key: "width", width: 110, render: (value: string) => `${value}px` },
  { title: "布局策略", dataIndex: "strategy", key: "strategy", width: 170 },
  { title: "说明", dataIndex: "note", key: "note" },
];

export default function LayoutBasicStylePage() {
  return <BasicStylePageLayout title="布局" description="页面骨架、断点与可展开左侧区域的行为规则。" designDocSource={layoutDocSource} specimen={<LayoutSpecimen />} />;
}
