import { Alert, Space, Table, Tag, Typography, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import { getUnitToken } from "../../../design-system/unit";
import spacingDocSource from "../../../../docs/foundations/spacing.md?raw";
import { BasicStylePageLayout } from "./BasicStylePageLayout";

const { Text, Title } = Typography;

interface SpacingScaleItem {
  key: string;
  tokenName: string;
  value: number;
  usage: string;
}

const SPACING_SCALE: SpacingScaleItem[] = [
  { key: "none", tokenName: "spacing/none", value: getUnitToken("spacing/none"), usage: "无间距" },
  { key: "0.5x", tokenName: "spacing/0.5x", value: getUnitToken("spacing/0.5x"), usage: "极小分隔" },
  { key: "1x", tokenName: "spacing/1x", value: getUnitToken("spacing/1x"), usage: "图标与文字间距" },
  { key: "1.5x", tokenName: "spacing/1.5x", value: getUnitToken("spacing/1.5x"), usage: "标签左右 padding small、浮层上内边距" },
  { key: "2x", tokenName: "spacing/2x", value: getUnitToken("spacing/2x"), usage: "紧凑控件内距" },
  { key: "2.5x", tokenName: "spacing/2.5x", value: getUnitToken("spacing/2.5x"), usage: "紧凑控件候选内距" },
  { key: "3x", tokenName: "spacing/3x", value: getUnitToken("spacing/3x"), usage: "输入类组件水平内距候选" },
  { key: "4x", tokenName: "spacing/4x", value: getUnitToken("spacing/4x"), usage: "卡片 / 区块常规内距" },
  { key: "5x", tokenName: "spacing/5x", value: getUnitToken("spacing/5x"), usage: "中等区块间距" },
  { key: "6x", tokenName: "spacing/6x", value: getUnitToken("spacing/6x"), usage: "页面内容左右内距" },
  { key: "7x", tokenName: "spacing/7x", value: getUnitToken("spacing/7x"), usage: "较大区块间距" },
  { key: "10x", tokenName: "spacing/10x", value: getUnitToken("spacing/10x"), usage: "大模块纵向间距" },
];

const HORIZONTAL_SPACING = [
  { key: "none", tokenName: "spacing/horizontal/none", value: getUnitToken("spacing/horizontal/none") },
  { key: "1x", tokenName: "spacing/horizontal/1x", value: getUnitToken("spacing/horizontal/1x") },
  { key: "1.5x", tokenName: "spacing/horizontal/1.5x", value: getUnitToken("spacing/horizontal/1.5x") },
  { key: "2x", tokenName: "spacing/horizontal/2x", value: getUnitToken("spacing/horizontal/2x") },
  { key: "2.5x", tokenName: "spacing/horizontal/2.5x", value: getUnitToken("spacing/horizontal/2.5x") },
  { key: "3x", tokenName: "spacing/horizontal/3x", value: getUnitToken("spacing/horizontal/3x") },
  { key: "4x", tokenName: "spacing/horizontal/4x", value: getUnitToken("spacing/horizontal/4x") },
  { key: "5x", tokenName: "spacing/horizontal/5x", value: getUnitToken("spacing/horizontal/5x") },
  { key: "6x", tokenName: "spacing/horizontal/6x", value: getUnitToken("spacing/horizontal/6x") },
];

const VERTICAL_SPACING = [
  { key: "none", tokenName: "spacing/vertical/none", value: getUnitToken("spacing/vertical/none") },
  { key: "0.5x", tokenName: "spacing/vertical/0.5x", value: getUnitToken("spacing/vertical/0.5x") },
  { key: "1x", tokenName: "spacing/vertical/1x", value: getUnitToken("spacing/vertical/1x") },
  { key: "1.5x", tokenName: "spacing/vertical/1.5x", value: getUnitToken("spacing/vertical/1.5x") },
  { key: "2x", tokenName: "spacing/vertical/2x", value: getUnitToken("spacing/vertical/2x") },
  { key: "2.5x", tokenName: "spacing/vertical/2.5x", value: getUnitToken("spacing/vertical/2.5x") },
  { key: "3x", tokenName: "spacing/vertical/3x", value: getUnitToken("spacing/vertical/3x") },
  { key: "4x", tokenName: "spacing/vertical/4x", value: getUnitToken("spacing/vertical/4x") },
  { key: "5x", tokenName: "spacing/vertical/5x", value: getUnitToken("spacing/vertical/5x") },
  { key: "6x", tokenName: "spacing/vertical/6x", value: getUnitToken("spacing/vertical/6x") },
  { key: "7x", tokenName: "spacing/vertical/7x", value: getUnitToken("spacing/vertical/7x") },
  { key: "10x", tokenName: "spacing/vertical/10x", value: getUnitToken("spacing/vertical/10x") },
];

const BOUNDARY_ROWS = [
  { key: "spacing", type: "spacing", source: "spacing/*", usage: "padding、margin、gap、元素间距" },
  { key: "size", type: "size", source: "size/*", usage: "图标底板、点状徽标、固定尺寸容器" },
  {
    key: "component-height",
    type: "component height",
    source: "size/component-height/*",
    usage: "输入框、按钮、表格信息区等组件高度",
  },
  { key: "formula", type: "formula", source: "组件规则", usage: "垂直居中、行高推导、边框抵消等计算值" },
];

const SCENE_ROWS = [
  { key: "icon-text", scene: "图标与文字间距", rule: "spacing/1x", value: getUnitToken("spacing/1x"), note: "输入、选择器、搜索、菜单等常见组合" },
  {
    key: "compact-control",
    scene: "紧凑控件内距",
    rule: "spacing/2x / spacing/2.5x",
    value: `${getUnitToken("spacing/2x")} / ${getUnitToken("spacing/2.5x")}`,
    note: "小尺寸或紧凑状态",
  },
  {
    key: "input-horizontal",
    scene: "输入类组件水平内距",
    rule: "spacing/horizontal/3x",
    value: getUnitToken("spacing/horizontal/3x"),
    note: "Input / Select 等基础组件常用",
  },
  {
    key: "card-padding",
    scene: "卡片 / 区块常规内距",
    rule: "spacing/4x",
    value: getUnitToken("spacing/4x"),
    note: "卡片、信息区、内容块候选",
  },
  {
    key: "page-padding",
    scene: "页面内容左右内距",
    rule: "spacing/6x",
    value: getUnitToken("spacing/6x"),
    note: "页面主内容区",
  },
  {
    key: "table-height",
    scene: "表格信息区高度",
    rule: "size/component-height/xl",
    value: getUnitToken("size/component-height/xl"),
    note: "组件规格，不作为普通 spacing",
  },
  {
    key: "large-section",
    scene: "大区块间距",
    rule: "spacing/10x",
    value: getUnitToken("spacing/10x"),
    note: "大模块之间的纵向距离",
  },
];

const TIKTOK_ROWS = [
  { key: "page-padding", scene: "页面内容区左右 padding", rule: "spacing/6x", value: "24", status: "已明确" },
  { key: "card-gap", scene: "数据源卡片列表 gap", rule: "spacing/4x", value: "16", status: "已明确" },
  { key: "card-padding", scene: "数据源卡片内 padding", rule: "spacing/4x", value: "16", status: "Card 阶段确认" },
  { key: "table-height", scene: "表格信息区高度", rule: "size/component-height/xl", value: "40", status: "组件规格" },
  { key: "drawer-padding", scene: "抽屉 body / footer padding", rule: "Drawer spacing", value: "待定", status: "Drawer 阶段确认" },
  { key: "form-gap", scene: "表单项间距", rule: "Form / FormItem spacing", value: "待定", status: "表单阶段确认" },
];

const ISSUE_ROWS = [
  { key: "hardcoded", issue: "代码里存在硬写 padding / gap / margin", status: "记录中", next: "Foundation 收尾检查" },
  { key: "antd", issue: "antd spacing token 未完全映射 SensD", status: "待补", next: "Spacing helper / 组件 helper 阶段" },
  { key: "formula", issue: "表格有 11px / 6px 这类公式值", status: "不升全局 token", next: "Table 组件阶段" },
  { key: "drawer", issue: "抽屉 padding 仍依赖 antd token", status: "待校准", next: "Drawer 组件阶段" },
  { key: "form", issue: "表单 spacing 规则尚未校准", status: "待校准", next: "Form / FormItem 阶段" },
  { key: "semantic", issue: "semantic spacing 尚未建立", status: "待补", next: "page.padding / card.padding / form.itemGap / section.gap" },
];

function ScaleBoard() {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: token.marginMD,
      }}
    >
      {SPACING_SCALE.map((item) => (
        <div
          key={item.key}
          style={{
            padding: token.paddingMD,
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: token.borderRadius,
            background: token.colorBgContainer,
          }}
        >
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <Text strong>{item.tokenName}</Text>
              <Text code>{item.value}px</Text>
            </Space>
            <div
              style={{
                width: "100%",
                height: 32,
                display: "flex",
                alignItems: "center",
                background: token.colorFillAlter,
                borderRadius: token.borderRadius,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: item.value,
                  height: "100%",
                  background: token.colorPrimary,
                }}
              />
            </div>
            <Text type="secondary">{item.usage}</Text>
          </Space>
        </div>
      ))}
    </div>
  );
}

function DirectionSpacingPreview({
  title,
  items,
  direction,
}: {
  title: string;
  items: Array<{ key: string; tokenName: string; value: number }>;
  direction: "horizontal" | "vertical";
}) {
  const { token } = theme.useToken();
  const isHorizontal = direction === "horizontal";

  return (
    <div
      style={{
        padding: token.paddingMD,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadius,
        background: token.colorBgContainer,
      }}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Title level={5} style={{ margin: 0 }}>
          {title}
        </Title>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: token.marginSM,
          }}
        >
          {items.map((item) => (
            <div
              key={item.key}
              style={{
                padding: token.paddingSM,
                background: token.colorFillAlter,
                borderRadius: token.borderRadius,
              }}
            >
              <Space direction="vertical" size="small" style={{ width: "100%" }}>
                <Space style={{ width: "100%", justifyContent: "space-between" }}>
                  <Text>{item.tokenName}</Text>
                  <Text code>{item.value}px</Text>
                </Space>
                <div
                  style={{
                    minHeight: isHorizontal ? 32 : 72,
                    display: "flex",
                    flexDirection: isHorizontal ? "row" : "column",
                    alignItems: isHorizontal ? "center" : "stretch",
                    justifyContent: "center",
                    gap: item.value,
                  }}
                >
                  <div
                    style={{
                      width: isHorizontal ? 36 : "100%",
                      height: 24,
                      borderRadius: token.borderRadiusSM,
                      background: token.colorPrimary,
                    }}
                  />
                  <div
                    style={{
                      width: isHorizontal ? 36 : "100%",
                      height: 24,
                      borderRadius: token.borderRadiusSM,
                      background: token.colorPrimaryBg,
                    }}
                  />
                </div>
              </Space>
            </div>
          ))}
        </div>
      </Space>
    </div>
  );
}

function BoundaryTable() {
  const columns: ColumnsType<(typeof BOUNDARY_ROWS)[number]> = [
    { title: "类型", dataIndex: "type", key: "type", width: 160 },
    { title: "来源", dataIndex: "source", key: "source", width: 220 },
    { title: "用途", dataIndex: "usage", key: "usage" },
  ];

  return <Table columns={columns} dataSource={BOUNDARY_ROWS} pagination={false} size="small" />;
}

function SceneTable() {
  const columns: ColumnsType<(typeof SCENE_ROWS)[number]> = [
    { title: "场景", dataIndex: "scene", key: "scene" },
    { title: "token / 规则", dataIndex: "rule", key: "rule", width: 220 },
    { title: "值", dataIndex: "value", key: "value", width: 100, render: (value: number | string) => `${value}px` },
    { title: "说明", dataIndex: "note", key: "note" },
  ];

  return <Table columns={columns} dataSource={SCENE_ROWS} pagination={false} size="small" />;
}

function TikTokUsageTable() {
  const columns: ColumnsType<(typeof TIKTOK_ROWS)[number]> = [
    { title: "场景", dataIndex: "scene", key: "scene" },
    { title: "规则", dataIndex: "rule", key: "rule", width: 220 },
    { title: "值", dataIndex: "value", key: "value", width: 100, render: (value: string) => (value === "待定" ? value : `${value}px`) },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (value: string) => <Tag color={value === "已明确" ? "success" : "warning"}>{value}</Tag>,
    },
  ];

  return <Table columns={columns} dataSource={TIKTOK_ROWS} pagination={false} size="small" />;
}

function IssueTable() {
  const columns: ColumnsType<(typeof ISSUE_ROWS)[number]> = [
    { title: "问题", dataIndex: "issue", key: "issue" },
    {
      title: "当前处理",
      dataIndex: "status",
      key: "status",
      width: 160,
      render: (value: string) => <Tag color={value === "不升全局 token" ? "processing" : "warning"}>{value}</Tag>,
    },
    { title: "建议时机", dataIndex: "next", key: "next" },
  ];

  return <Table columns={columns} dataSource={ISSUE_ROWS} pagination={false} size="small" />;
}

function SpacingSpecimen() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginTop: 0 }}>
          间距数值样张
        </Title>
        <Text type="secondary">
          这里展示 Spacing Foundation 的基础 scale、水平 / 垂直间距、spacing 与 size 边界和 TikTok case 使用对照；当前页面只做验收样张，不改真实组件样式。
        </Text>
      </div>

      <section>
        <Title level={5}>基础 Scale</Title>
        <ScaleBoard />
      </section>

      <section>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <DirectionSpacingPreview title="水平 Spacing" items={HORIZONTAL_SPACING} direction="horizontal" />
          <DirectionSpacingPreview title="垂直 Spacing" items={VERTICAL_SPACING} direction="vertical" />
        </Space>
      </section>

      <section>
        <Title level={5}>Spacing 与 Size 边界</Title>
        <BoundaryTable />
      </section>

      <section>
        <Title level={5}>常用场景</Title>
        <SceneTable />
      </section>

      <section>
        <Title level={5}>TikTok Case 对照</Title>
        <TikTokUsageTable />
      </section>

      <section>
        <Title level={5}>当前问题与待补</Title>
        <IssueTable />
      </section>

      <Alert
        type="warning"
        showIcon
        message="公式型值不升全局 spacing token"
        description="表格 11px / 6px、垂直居中、边框抵消等值必须说明组件规则来源；高度、宽度、图标尺寸优先走 size 或组件规格。"
      />
    </Space>
  );
}

export default function SpacingBasicStylePage() {
  return (
    <BasicStylePageLayout
      title="间距"
      description="统一页面、组件、表单、表格、卡片、弹层里的 padding、margin、gap 和元素间距。"
      designDocSource={spacingDocSource}
      specimen={<SpacingSpecimen />}
    />
  );
}
