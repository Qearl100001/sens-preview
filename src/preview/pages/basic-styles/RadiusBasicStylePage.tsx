import { Space, Table, Tag, Typography, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import tokens from "../../../design-system/tokens.resolved.json";
import radiusDocSource from "../../../../docs/foundations/radius.md?raw";
import { BasicStylePageLayout } from "./BasicStylePageLayout";

const { Text, Title } = Typography;

const u = tokens.unit as Record<string, number>;

interface RadiusScaleItem {
  key: string;
  name: string;
  tokenName: string;
  value: number;
  usage: string;
}

const RADIUS_SCALE: RadiusScaleItem[] = [
  {
    key: "none",
    name: "无圆角",
    tokenName: "radius/none",
    value: u["radius/none"],
    usage: "无圆角、拼接控件中间段",
  },
  {
    key: "s",
    name: "小尺寸",
    tokenName: "radius/s",
    value: u["radius/s"],
    usage: "小尺寸控件",
  },
  {
    key: "m",
    name: "常规基础组件",
    tokenName: "radius/m",
    value: u["radius/m"],
    usage: "Button、Input、Select、Dropdown 等默认圆角",
  },
  {
    key: "l",
    name: "表格与卡片边缘",
    tokenName: "radius/l",
    value: u["radius/l"],
    usage: "表格外边缘、卡片边缘、部分容器边缘",
  },
  {
    key: "xl",
    name: "大页面外圆角",
    tokenName: "radius/xl",
    value: u["radius/xl"],
    usage: "大页面外圆角、页面与导航衔接处、抽屉外圆角",
  },
  {
    key: "circular",
    name: "圆形 / 胶囊",
    tokenName: "radius/circular",
    value: u["radius/circular"],
    usage: "胶囊、圆形按钮、FAB 外端",
  },
];

const SCENE_ROWS = [
  { key: "form", scene: "Input / Select / Button", tokenName: "radius/m", value: u["radius/m"], note: "常规基础组件" },
  { key: "table", scene: "TableShell 外边缘", tokenName: "radius/l", value: u["radius/l"], note: "表格外圆角是 6px" },
  { key: "card", scene: "Card / EntryCard 边缘", tokenName: "radius/l", value: u["radius/l"], note: "卡片规则后续单独补充" },
  { key: "page", scene: "大页面外圆角", tokenName: "radius/xl", value: u["radius/xl"], note: "页面与导航衔接处" },
  { key: "drawer", scene: "Drawer 外圆角", tokenName: "radius/xl", value: u["radius/xl"], note: "Drawer 阶段校准" },
  { key: "fab", scene: "FAB / 胶囊", tokenName: "radius/circular", value: u["radius/circular"], note: "圆形或胶囊场景" },
];

function RadiusPreviewBlock({ item }: { item: RadiusScaleItem }) {
  const { token } = theme.useToken();
  const isCircular = item.tokenName === "radius/circular";
  const width = isCircular ? 56 : 112;
  const height = 56;

  return (
    <div
      style={{
        width,
        height,
        borderRadius: item.value,
        border: `1px solid ${token.colorBorder}`,
        background: token.colorBgContainer,
        boxShadow: `inset 0 0 0 1px ${token.colorFillSecondary}`,
      }}
    />
  );
}

function RadiusScaleBoard() {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: token.marginMD,
      }}
    >
      {RADIUS_SCALE.map((item) => (
        <div
          key={item.key}
          style={{
            minHeight: 180,
            padding: token.paddingMD,
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: u["radius/l"],
            background: token.colorBgContainer,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: token.marginSM,
          }}
        >
          <RadiusPreviewBlock item={item} />
          <Space direction="vertical" size={2}>
            <Text strong>{item.name}</Text>
            <Text code>{item.tokenName}</Text>
            <Text type="secondary">{item.value}px</Text>
            <Text type="secondary">{item.usage}</Text>
          </Space>
        </div>
      ))}
    </div>
  );
}

function RadiusTokenTable() {
  const columns: ColumnsType<(typeof SCENE_ROWS)[number]> = [
    { title: "场景", dataIndex: "scene", key: "scene", width: 220 },
    {
      title: "规则来源",
      dataIndex: "tokenName",
      key: "tokenName",
      width: 180,
      render: (value: string) => <Tag>{value}</Tag>,
    },
    {
      title: "数值",
      dataIndex: "value",
      key: "value",
      width: 96,
      render: (value: number) => `${value}px`,
    },
    { title: "说明", dataIndex: "note", key: "note" },
  ];

  return <Table columns={columns} dataSource={SCENE_ROWS} pagination={false} size="small" />;
}

function RadiusSpecimen() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginTop: 0 }}>
          圆角数值样张
        </Title>
        <Text type="secondary">
          这里展示同一份圆角规则里的 token、数值和典型用途，后续组件验收时优先对照这一页。
        </Text>
      </div>
      <RadiusScaleBoard />
      <div>
        <Title level={5}>场景对照</Title>
        <RadiusTokenTable />
      </div>
    </Space>
  );
}

export default function RadiusBasicStylePage() {
  return (
    <BasicStylePageLayout
      title="圆角"
      description="统一基础控件、表格外边缘、卡片、大页面外圆角、抽屉和圆形控件的圆角规则。"
      designDocSource={radiusDocSource}
      specimen={<RadiusSpecimen />}
    />
  );
}
