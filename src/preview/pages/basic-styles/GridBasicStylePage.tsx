import { Alert, Space, Table, Tag, Typography, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import gridDocSource from "../../../../docs/foundations/grid.md?raw";
import { BasicStylePageLayout } from "./BasicStylePageLayout";

const { Text, Title } = Typography;

const GRID_LAYER_ROWS = [
  { key: "page", layer: "页面主栅格", rule: "20 栏", usage: "卡片区、筛选区、表格区、说明区等大区块", boundary: "不要求每个小组件显式占栏" },
  { key: "drawer", layer: "Drawer / Modal 内部", rule: "12 栏", usage: "表单、说明、辅助信息、分组内容", boundary: "不直接搬用整页 20 栏" },
  { key: "local", layer: "局部容器", rule: "按内容决定", usage: "卡片列表、左右双栏、映射配置区、筛选组合", boundary: "不新增一套独立 foundation token" },
];

const LOCAL_CONTAINER_ROWS = [
  { key: "cards", scene: "卡片列表", candidate: "4 或 5 列候选", decision: "由页面容器和可用内容宽度决定" },
  { key: "split", scene: "左右双栏", candidate: "按内容密度确定比例", decision: "不把比例固化到 Card Foundation" },
  { key: "filter", scene: "筛选 / 操作区", candidate: "局部组合", decision: "控件间距由 Spacing 负责，不当作栅格规则" },
  { key: "drawer-form", scene: "Drawer 表单", candidate: "单栏或说明 + 表单", decision: "先选阅读关系，再使用 12 栏细化分组" },
];

function ColumnCells({ count, color }: { count: number; color: string }) {
  const { token } = theme.useToken();
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`, gap: token.marginXXS }}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} style={{ minHeight: token.controlHeight, borderRadius: token.borderRadiusSM, background: color, border: `${token.lineWidth}px solid ${token.colorBorderSecondary}` }} />
      ))}
    </div>
  );
}

function GridBoards() {
  const { token } = theme.useToken();
  const cardStyle = {
    padding: token.paddingMD,
    border: `${token.lineWidth}px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
    background: token.colorBgContainer,
  } as const;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: token.marginMD }}>
      <div style={cardStyle}>
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <Text strong>页面主栅格</Text>
          <Text type="secondary">20 栏决定页面大区块之间的宽度关系。</Text>
          <ColumnCells count={20} color={token.colorFillSecondary} />
          <Text type="secondary">样张以完整 20 栏展示，不代表每个组件都要单独占栏。</Text>
        </Space>
      </div>
      <div style={cardStyle}>
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <Text strong>Drawer / Modal 内部栅格</Text>
          <Text type="secondary">12 栏适用于表单、说明和辅助信息。</Text>
          <ColumnCells count={12} color={token.colorFillQuaternary} />
          <Text type="secondary">抽屉尺寸由 Drawer 组件规则决定，栅格只组织内部内容。</Text>
        </Space>
      </div>
      <div style={cardStyle}>
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <Text strong>局部卡片容器</Text>
          <Text type="secondary">以可用内容宽度选择 4 或 5 列候选。</Text>
          <ColumnCells count={4} color={token.colorFillTertiary} />
          <Text type="secondary">侧导 Docked 或目录 Reflow 后，局部栅格应重新计算。</Text>
        </Space>
      </div>
    </div>
  );
}

const gridLayerColumns: ColumnsType<(typeof GRID_LAYER_ROWS)[number]> = [
  { title: "层级", dataIndex: "layer", key: "layer", width: 180 },
  { title: "规则", dataIndex: "rule", key: "rule", width: 150, render: (value: string) => <Tag>{value}</Tag> },
  { title: "适用内容", dataIndex: "usage", key: "usage", width: 300 },
  { title: "边界", dataIndex: "boundary", key: "boundary", width: 240 },
];

const localContainerColumns: ColumnsType<(typeof LOCAL_CONTAINER_ROWS)[number]> = [
  { title: "局部场景", dataIndex: "scene", key: "scene", width: 160 },
  { title: "排布候选", dataIndex: "candidate", key: "candidate", width: 210 },
  { title: "如何决定", dataIndex: "decision", key: "decision" },
];

function GridSpecimen() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginTop: 0 }}>栅格规则入口</Title>
        <Text type="secondary">栅格只在 Layout 已算出的可用内容区内决定列数与局部排布。</Text>
      </div>
      <Alert type="info" showIcon message="Grid 不决定左侧区域行为" description="产品壳侧导、锚点和目录是否展开属于 Layout；Grid 在内容宽度变化后重新计算列数和占栏关系。" />
      <section>
        <Title level={5}>20 栏、12 栏与局部容器样张</Title>
        <GridBoards />
      </section>
      <section>
        <Title level={5}>栅格层级说明</Title>
        <Table columns={gridLayerColumns} dataSource={GRID_LAYER_ROWS} pagination={false} size="small" scroll={{ x: 860 }} />
      </section>
      <section>
        <Title level={5}>局部容器选择</Title>
        <Table columns={localContainerColumns} dataSource={LOCAL_CONTAINER_ROWS} pagination={false} size="small" />
      </section>
      <Alert type="warning" showIcon message="暂不新增独立 Grid token" description="20 栏、12 栏和局部列数先以规则和容器实现消费；重复出现在多个真实模板的值，再评估进入布局 config / 常量。" />
    </Space>
  );
}

export default function GridBasicStylePage() {
  return <BasicStylePageLayout title="栅格" description="页面主栅格、抽屉内部栅格和局部容器的列数规则。" designDocSource={gridDocSource} specimen={<GridSpecimen />} />;
}
