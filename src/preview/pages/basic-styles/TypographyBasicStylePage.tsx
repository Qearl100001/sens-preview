import { Alert, Space, Table, Tag, Typography, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import typographyDocSource from "../../../../docs/foundations/typography.md?raw";
import { BasicStylePageLayout } from "./BasicStylePageLayout";

const { Text, Title } = Typography;

interface TypographyLevel {
  key: string;
  name: string;
  sample: string;
  fontSizeToken: string;
  lineHeightToken: string;
  fontWeightToken: string;
  fontSize: number;
  lineHeight: number;
  fontWeight: number;
  usage: string;
}

const TYPOGRAPHY_LEVELS: TypographyLevel[] = [
  {
    key: "display",
    name: "超大标题",
    sample: "阅读型纯文本标题",
    fontSizeToken: "font-size/display",
    lineHeightToken: "line-height/display",
    fontWeightToken: "font-weight/semibold",
    fontSize: 28,
    lineHeight: 42,
    fontWeight: 600,
    usage: "阅读类型纯文本标题，当前少用但保留。",
  },
  {
    key: "heading-1",
    name: "一级标题",
    sample: "数据源管理",
    fontSizeToken: "font-size/xxl",
    lineHeightToken: "line-height/xxl",
    fontWeightToken: "font-weight/semibold",
    fontSize: 20,
    lineHeight: 30,
    fontWeight: 600,
    usage: "页面级大标题、下钻页标题。",
  },
  {
    key: "heading-2",
    name: "二级标题",
    sample: "页面内嵌通栏卡片标题",
    fontSizeToken: "font-size/xl",
    lineHeightToken: "line-height/xl",
    fontWeightToken: "font-weight/semibold",
    fontSize: 18,
    lineHeight: 28,
    fontWeight: 600,
    usage: "页面内嵌通栏卡片标题，后期按真实页面校验边界。",
  },
  {
    key: "heading-3",
    name: "三级标题",
    sample: "连接信息",
    fontSizeToken: "font-size/l",
    lineHeightToken: "line-height/l",
    fontWeightToken: "font-weight/semibold",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 600,
    usage: "通栏卡片内嵌标题、信息面板标题。",
  },
  {
    key: "heading-3-regular",
    name: "三级标题细体",
    sample: "弱化的内嵌标题",
    fontSizeToken: "font-size/l",
    lineHeightToken: "line-height/l",
    fontWeightToken: "font-weight/regular",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 400,
    usage: "通栏卡片内嵌标题弱化版。",
  },
  {
    key: "heading-4",
    name: "四级标题",
    sample: "TikTok Ads",
    fontSizeToken: "font-size/m",
    lineHeightToken: "line-height/m",
    fontWeightToken: "font-weight/medium",
    fontSize: 14,
    lineHeight: 22,
    fontWeight: 500,
    usage: "图表组件、小卡片标题、数据源卡片标题候选。",
  },
  {
    key: "body",
    name: "正文内容",
    sample: "用于表格正文、表单正文和普通说明。",
    fontSizeToken: "font-size/m",
    lineHeightToken: "line-height/m",
    fontWeightToken: "font-weight/regular",
    fontSize: 14,
    lineHeight: 22,
    fontWeight: 400,
    usage: "正文信息文案、表单、表格内容。",
  },
  {
    key: "caption-strong",
    name: "辅助信息加粗",
    sample: "辅助标题",
    fontSizeToken: "font-size/s",
    lineHeightToken: "line-height/s",
    fontWeightToken: "font-weight/medium",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: 500,
    usage: "组件内辅助标题、弱层级强调。",
  },
  {
    key: "caption",
    name: "辅助文案",
    sample: "说明、提示、统计、面包屑",
    fontSizeToken: "font-size/s",
    lineHeightToken: "line-height/s",
    fontWeightToken: "font-weight/regular",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: 400,
    usage: "卡片描述、状态补充、面包屑、辅助说明。",
  },
];

const TOKEN_ROWS = [
  { key: "font-size-s", item: "font-size/s", status: "已有", note: "当前显式 token，值为 12。" },
  { key: "line-height-s", item: "line-height/s", status: "已有", note: "当前显式 token，值为 18。" },
  { key: "font-size-m", item: "font-size/m", status: "待补", note: "目标值 14；正文、表单、表格、卡片标题、操作文字。" },
  { key: "line-height-m", item: "line-height/m", status: "待补", note: "目标值 22；正文、表单、表格、卡片标题、操作文字。" },
  { key: "font-size-l", item: "font-size/l", status: "待补", note: "目标值 16；三级标题、通栏卡片内嵌标题。" },
  { key: "line-height-l", item: "line-height/l", status: "待补", note: "目标值 24；三级标题、通栏卡片内嵌标题。" },
  { key: "font-size-xl", item: "font-size/xl", status: "待补", note: "目标值 18；二级标题。" },
  { key: "line-height-xl", item: "line-height/xl", status: "待补", note: "目标值 28；二级标题。" },
  { key: "font-size-xxl", item: "font-size/xxl", status: "待补", note: "目标值 20；一级标题、页面级标题。" },
  { key: "line-height-xxl", item: "line-height/xxl", status: "待补", note: "目标值 30；一级标题、页面级标题。" },
  { key: "font-size-display", item: "font-size/display", status: "待补", note: "目标值 28；超大标题、阅读型纯文本标题。" },
  { key: "line-height-display", item: "line-height/display", status: "待补", note: "目标值 42；超大标题、阅读型纯文本标题。" },
  { key: "font-weight-regular", item: "font-weight/regular", status: "待补", note: "目标值 400；正文、操作、辅助文案。" },
  { key: "font-weight-medium", item: "font-weight/medium", status: "待补", note: "目标值 500；四级标题、组件内强调。" },
  { key: "font-weight-semibold", item: "font-weight/semibold", status: "待补", note: "目标值 600；页面标题、区块标题。" },
];

const TIKTOK_ROWS = [
  { key: "management-title", scene: "数据源管理页标题", rule: "一级标题", value: "20 / 30 / 600" },
  { key: "drilldown-title", scene: "下钻页标题", rule: "一级标题", value: "20 / 30 / 600" },
  { key: "info-panel-title", scene: "信息面板标题", rule: "三级标题", value: "16 / 24 / 600" },
  { key: "source-card-title", scene: "数据源卡片标题", rule: "四级标题", value: "14 / 22 / 500" },
  { key: "body", scene: "表格 / 表单 / 普通说明", rule: "正文内容", value: "14 / 22 / 400" },
  { key: "caption", scene: "卡片描述 / 面包屑 / 辅助说明", rule: "辅助文案", value: "12 / 18 / 400" },
];

function TypographyLevelBoard() {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: token.marginMD,
      }}
    >
      {TYPOGRAPHY_LEVELS.map((item) => (
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
            <Text type="secondary">{item.name}</Text>
            <div
              style={{
                fontSize: item.fontSize,
                lineHeight: `${item.lineHeight}px`,
                fontWeight: item.fontWeight,
                color: token.colorText,
              }}
            >
              {item.sample}
            </div>
            <Text code>
              {item.fontSize} / {item.lineHeight} / {item.fontWeight}
            </Text>
            <Text type="secondary">
              {item.fontSizeToken} · {item.lineHeightToken} · {item.fontWeightToken}
            </Text>
            <Text type="secondary">{item.usage}</Text>
          </Space>
        </div>
      ))}
    </div>
  );
}

function TokenStatusTable() {
  const columns: ColumnsType<(typeof TOKEN_ROWS)[number]> = [
    { title: "项", dataIndex: "item", key: "item", width: 160 },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (value: string) => <Tag color={value === "已有" ? "success" : "warning"}>{value}</Tag>,
    },
    { title: "说明", dataIndex: "note", key: "note" },
  ];

  return <Table columns={columns} dataSource={TOKEN_ROWS} pagination={false} size="small" />;
}

function TikTokUsageTable() {
  const columns: ColumnsType<(typeof TIKTOK_ROWS)[number]> = [
    { title: "场景", dataIndex: "scene", key: "scene" },
    { title: "规则", dataIndex: "rule", key: "rule", width: 140 },
    { title: "字号 / 行高 / 字重", dataIndex: "value", key: "value", width: 180 },
  ];

  return <Table columns={columns} dataSource={TIKTOK_ROWS} pagination={false} size="small" />;
}

function TypographySpecimen() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginTop: 0 }}>
          字体数值样张
        </Title>
        <Text type="secondary">
          这里展示 Typography Foundation 的字号、行高、字重和业务使用场景；当前页面只做验收样张，不改真实组件样式。
        </Text>
      </div>

      <section>
        <Title level={5}>字体层级</Title>
        <TypographyLevelBoard />
      </section>

      <section>
        <Title level={5}>当前 Token 状态</Title>
        <TokenStatusTable />
      </section>

      <section>
        <Title level={5}>TikTok Case 对照</Title>
        <TikTokUsageTable />
      </section>

      <Alert
        type="warning"
        showIcon
        message="禁止游离字号"
        description="页面和组件不得随手新增 13 / 15 / 17 等游离字号，也不得新增 20 / 21 / 26 等游离行高；临时发现缺口时，应先记录缺口，再补 typography token / helper。"
      />
    </Space>
  );
}

export default function TypographyBasicStylePage() {
  return (
    <BasicStylePageLayout
      title="字体"
      description="统一页面、组件和业务样板间里的字体家族、字号、行高、字重和使用场景。"
      designDocSource={typographyDocSource}
      specimen={<TypographySpecimen />}
    />
  );
}
