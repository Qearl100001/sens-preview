import { Alert, Space, Table, Tag, Typography, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import tokens from "../../../design-system/tokens.resolved.json";
import sizeDocSource from "../../../../docs/foundations/size.md?raw";
import { BasicStylePageLayout } from "./BasicStylePageLayout";

const { Text, Title } = Typography;

const u = tokens.unit as Record<string, number>;
const typo = tokens.typography as Record<string, number>;
const TAG_PADDING_INLINE_S = 6;
const TAG_PADDING_BLOCK_S = 1;

interface SizeScaleItem {
  key: string;
  tokenName: string;
  value: number;
  usage: string;
}

const SIZE_SCALE: SizeScaleItem[] = [
  { key: "mini", tokenName: "size/mini", value: u["size/mini"], usage: "极小尺寸" },
  { key: "xxxs", tokenName: "size/xxxs", value: u["size/xxxs"], usage: "小图标、错误图标候选" },
  { key: "xxs", tokenName: "size/xxs", value: u["size/xxs"], usage: "常规图标" },
  { key: "xs", tokenName: "size/xs", value: u["size/xs"], usage: "小组件高度、标签高度候选" },
  { key: "s", tokenName: "size/s", value: u["size/s"], usage: "小控件高度" },
  { key: "m", tokenName: "size/m", value: u["size/m"], usage: "常规控件高度" },
  { key: "l", tokenName: "size/l", value: u["size/l"], usage: "中等控件高度 / FAB 交叉轴" },
  { key: "xl", tokenName: "size/xl", value: u["size/xl"], usage: "较大组件高度 / 信息区高度候选" },
  { key: "xxl", tokenName: "size/xxl", value: u["size/xxl"], usage: "logo / 缩略图候选" },
  { key: "xxxl", tokenName: "size/xxxl", value: u["size/xxxl"], usage: "表格行高候选" },
];

const ICON_SIZE_ROWS = [
  { key: "mini", tokenName: "size/icon/mini", value: u["size/icon/mini"], usage: "极小图标" },
  { key: "s", tokenName: "size/icon/s", value: u["size/icon/s"], usage: "错误提示图标、小状态图标" },
  { key: "m", tokenName: "size/icon/m", value: u["size/icon/m"], usage: "more、down、常规操作图标" },
];

const COMPONENT_HEIGHT_ROWS = [
  { key: "xs", tokenName: "size/component-height/xs", value: u["size/component-height/xs"], usage: "Tag 小尺寸高度候选" },
  { key: "s", tokenName: "size/component-height/s", value: u["size/component-height/s"], usage: "antd controlHeightSM，历史小尺寸输入类规则" },
  { key: "m", tokenName: "size/component-height/m", value: u["size/component-height/m"], usage: "antd controlHeight，常规输入框、按钮、搜索等" },
  { key: "l", tokenName: "size/component-height/l", value: u["size/component-height/l"], usage: "FAB 交叉轴、部分中等控件" },
  { key: "xl", tokenName: "size/component-height/xl", value: u["size/component-height/xl"], usage: "表格信息区、较大信息区候选" },
  { key: "xxl", tokenName: "size/component-height/xxl", value: u["size/component-height/xxl"], usage: "大尺寸组件候选" },
  { key: "xxxl", tokenName: "size/component-height/xxxl", value: u["size/component-height/xxxl"], usage: "表格行高" },
];

const TAG_SIZE_ROWS = [
  { key: "height", rule: "tag/height/s", value: "size/component-height/xs = 20", status: "候选", note: "小标签高度" },
  { key: "padding-inline", rule: "tag/padding-inline/s", value: "6", status: "待补", note: "组件专属 padding，不提升为全局 spacing" },
  { key: "padding-block", rule: "tag/padding-block/s", value: "1", status: "待补", note: "由 20 - line-height/s 18 推导" },
  { key: "gap", rule: "tag/gap", value: "spacing/1x = 4", status: "候选", note: "标签内部图文间距候选" },
  { key: "radius", rule: "tag/radius", value: "radius/s = 3", status: "候选", note: "小标签圆角" },
  { key: "font-size", rule: "tag/font-size", value: "font-size/s = 12", status: "候选", note: "标签文字字号" },
  { key: "line-height", rule: "tag/line-height", value: "line-height/s = 18", status: "候选", note: "标签文字行高" },
  { key: "font-weight", rule: "tag/font-weight", value: "font-weight/regular = 400", status: "候选", note: "标签文字字重" },
];

const CARD_SIZE_ROWS = [
  { key: "logo", scene: "logo / 缩略图样张", tokenName: "size/xxl", value: u["size/xxl"], note: "当前样张候选，业务线可调整" },
  { key: "icon", scene: "more / down 图标", tokenName: "size/icon/m", value: u["size/icon/m"], note: "图标库阶段继续收敛" },
  { key: "error", scene: "error 图标", tokenName: "size/icon/s", value: u["size/icon/s"], note: "图标库阶段继续收敛" },
  { key: "tag", scene: "tag 高度", tokenName: "size/component-height/xs", value: u["size/component-height/xs"], note: "Tag 组件候选规则" },
  { key: "table-row", scene: "表格行高", tokenName: "size/component-height/xxxl", value: u["size/component-height/xxxl"], note: "Table 行高候选" },
];

function SizeScaleBoard({ items }: { items: SizeScaleItem[] }) {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: token.marginMD,
      }}
    >
      {items.map((item) => (
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
                height: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: token.colorFillAlter,
                borderRadius: token.borderRadius,
              }}
            >
              <div
                style={{
                  width: item.value,
                  height: item.value,
                  borderRadius: token.borderRadiusSM,
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

function SimpleTable<T extends { key: string }>({ columns, data }: { columns: ColumnsType<T>; data: T[] }) {
  return <Table columns={columns} dataSource={data} pagination={false} size="small" />;
}

function TagRulePreview() {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: u["spacing/1x"],
        height: u["size/component-height/xs"],
        padding: `${TAG_PADDING_BLOCK_S}px ${TAG_PADDING_INLINE_S}px`,
        borderRadius: u["radius/s"],
        background: token.colorFillSecondary,
      }}
    >
      <Text style={{ fontSize: typo["font-size/s"], lineHeight: `${typo["line-height/s"]}px` }}>标签</Text>
    </div>
  );
}

function SizeSpecimen() {
  const tagColumns: ColumnsType<(typeof TAG_SIZE_ROWS)[number]> = [
    { title: "规则", dataIndex: "rule", key: "rule", width: 200 },
    { title: "值 / token", dataIndex: "value", key: "value", width: 240 },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (value: string) => <Tag color={value === "候选" ? "processing" : "warning"}>{value}</Tag>,
    },
    { title: "说明", dataIndex: "note", key: "note" },
  ];

  const cardColumns: ColumnsType<(typeof CARD_SIZE_ROWS)[number]> = [
    { title: "场景", dataIndex: "scene", key: "scene" },
    { title: "token", dataIndex: "tokenName", key: "tokenName", width: 220 },
    { title: "值", dataIndex: "value", key: "value", width: 100 },
    { title: "说明", dataIndex: "note", key: "note" },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginTop: 0 }}>
          尺寸数值样张
        </Title>
        <Text type="secondary">
          展示固定尺寸、图标尺寸、组件高度和 Tag 尺寸候选；Size 负责高度 / 宽度 / 图标尺寸，Spacing 只负责间距。
        </Text>
      </div>

      <section>
        <Title level={5}>基础 Size Scale</Title>
        <SizeScaleBoard items={SIZE_SCALE} />
      </section>

      <section>
        <Title level={5}>Icon Size</Title>
        <SizeScaleBoard items={ICON_SIZE_ROWS} />
      </section>

      <section>
        <Title level={5}>Component Height</Title>
        <SizeScaleBoard items={COMPONENT_HEIGHT_ROWS} />
      </section>

      <section>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Title level={5} style={{ margin: 0 }}>
            Tag 尺寸候选
          </Title>
          <TagRulePreview />
          <SimpleTable columns={tagColumns} data={TAG_SIZE_ROWS} />
        </Space>
      </section>

      <section>
        <Title level={5}>Card 相关 Size 使用</Title>
        <SimpleTable columns={cardColumns} data={CARD_SIZE_ROWS} />
      </section>

      <Alert
        type="warning"
        showIcon
        message="不要用 spacing 代替 size"
        description="例如 28px 即使等于 spacing/7x，也不能直接拿来作为输入框高度；需要新增组件高度 token 或组件专属尺寸规则。"
      />
    </Space>
  );
}

export default function SizeBasicStylePage() {
  return (
    <BasicStylePageLayout
      title="尺寸"
      description="统一固定宽高、图标尺寸、组件高度和组件专属尺寸规则。"
      designDocSource={sizeDocSource}
      specimen={<SizeSpecimen />}
    />
  );
}
