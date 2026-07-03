import { Alert, Space, Table, Tag, Typography, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  dividerColorTokenSpecs,
  dividerWidthTokens,
  getDividerBorder,
  getDividerColor,
  getDividerTokenName,
  type DividerColorMode,
  type DividerTone,
} from "../../../design-system/divider";
import tokens from "../../../design-system/tokens.resolved.json";
import dividerDocSource from "../../../../docs/foundations/divider.md?raw";
import { BasicStylePageLayout } from "./BasicStylePageLayout";

const { Text, Title } = Typography;

const u = tokens.unit as Record<string, number>;

const MODE_LABELS: Record<DividerColorMode, string> = {
  transparent: "透明版本",
  solid: "非透明版本",
};

const SCENE_ROWS = [
  {
    key: "input",
    scene: "输入类控件默认边框",
    tokenName: "divider/color/deep/transparent",
    note: "较明确的控件边界，后续和 Input / Select 校验",
  },
  {
    key: "card-outline",
    scene: "卡片外描边",
    tokenName: "divider/color/outline/transparent",
    note: "Card、容器边界",
  },
  {
    key: "card-inner",
    scene: "卡片内部横线",
    tokenName: "divider/color/light/transparent",
    note: "标题区、操作区、内容区之间",
  },
  {
    key: "table-row",
    scene: "表格行分割线",
    tokenName: "divider/color/weak/solid / divider/color/light/transparent",
    note: "具体等 Table 规则校验",
  },
  {
    key: "inline",
    scene: "信息项之间竖线",
    tokenName: "divider/color/light/transparent",
    note: "状态和时间、操作按钮之间",
  },
  {
    key: "weak",
    scene: "背景区弱边界",
    tokenName: "divider/color/weak/transparent",
    note: "最弱层级",
  },
];

function DividerColorCard({ tone, mode }: { tone: DividerTone; mode: DividerColorMode }) {
  const { token } = theme.useToken();
  const spec = dividerColorTokenSpecs.find((item) => item.tone === tone);
  if (!spec) return null;

  const color = getDividerColor(tone, mode);
  const tokenName = getDividerTokenName(tone, mode);
  const source = mode === "transparent" ? `${spec.transparent.handle} @${spec.transparent.alpha}` : spec.solid.handle;

  return (
    <div
      style={{
        padding: token.paddingMD,
        border: getDividerBorder("light"),
        borderRadius: u["radius/m"],
        background: token.colorBgContainer,
      }}
    >
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Text strong>{spec.figmaName}</Text>
          <Tag>{MODE_LABELS[mode]}</Tag>
        </Space>
        <div
          style={{
            height: u["size/component-height/s"],
            borderRadius: u["radius/s"],
            background: token.colorBgLayout,
            display: "flex",
            alignItems: "center",
            paddingInline: u["spacing/3x"],
          }}
        >
          <div
            style={{
              width: "100%",
              height: dividerWidthTokens["divider/width/hairline"],
              background: color,
            }}
          />
        </div>
        <Text code>{tokenName}</Text>
        <Text type="secondary">{source}</Text>
        <Text type="secondary">{spec.usage}</Text>
      </Space>
    </div>
  );
}

function ColorMatrix() {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: token.marginMD,
      }}
    >
      {dividerColorTokenSpecs.flatMap((spec) => [
        <DividerColorCard key={`${spec.tone}-transparent`} tone={spec.tone} mode="transparent" />,
        <DividerColorCard key={`${spec.tone}-solid`} tone={spec.tone} mode="solid" />,
      ])}
    </div>
  );
}

function DirectionSpecimen() {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: token.marginMD,
      }}
    >
      <div
        style={{
          padding: token.paddingMD,
          border: getDividerBorder("light"),
          borderRadius: u["radius/m"],
          background: token.colorBgContainer,
        }}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Text strong>横向分割线</Text>
          <div style={{ height: u["size/component-height/m"], display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "100%",
                height: dividerWidthTokens["divider/width/hairline"],
                background: getDividerColor("light"),
              }}
            />
          </div>
          <Text code>divider/width/hairline</Text>
        </Space>
      </div>

      <div
        style={{
          padding: token.paddingMD,
          border: getDividerBorder("light"),
          borderRadius: u["radius/m"],
          background: token.colorBgContainer,
        }}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Text strong>竖向分割线</Text>
          <div
            style={{
              height: u["size/component-height/xl"],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: u["spacing/4x"],
              background: token.colorBgLayout,
              borderRadius: u["radius/s"],
            }}
          >
            <Text type="secondary">状态</Text>
            <div
              style={{
                width: dividerWidthTokens["divider/width/hairline"],
                height: u["size/component-height/m"],
                background: getDividerColor("light"),
              }}
            />
            <Text type="secondary">2026-07-01</Text>
          </div>
          <Text code>divider/color/light/transparent</Text>
        </Space>
      </div>
    </div>
  );
}

function CardDividerSpecimen() {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        border: getDividerBorder("outline"),
        borderRadius: u["radius/l"],
        background: token.colorBgContainer,
        overflow: "hidden",
      }}
    >
      <div style={{ padding: token.paddingMD }}>
        <Text strong>卡片内部分割线</Text>
        <br />
        <Text type="secondary">外层描边使用 outline，内部横线使用 light。</Text>
      </div>
      <div style={{ height: dividerWidthTokens["divider/width/hairline"], background: getDividerColor("light") }} />
      <div style={{ padding: token.paddingMD }}>
        <Text>内容区</Text>
      </div>
      <div style={{ height: dividerWidthTokens["divider/width/hairline"], background: getDividerColor("light") }} />
      <div style={{ padding: token.paddingMD }}>
        <Space
          split={
            <div
              style={{
                width: dividerWidthTokens["divider/width/hairline"],
                height: u["size/component-height/xs"],
                background: getDividerColor("light"),
              }}
            />
          }
        >
          <Text>操作 1</Text>
          <Text>操作 2</Text>
          <Text>更多</Text>
        </Space>
      </div>
    </div>
  );
}

function MappingTable() {
  const columns: ColumnsType<(typeof dividerColorTokenSpecs)[number]> = [
    { title: "Figma 语义", dataIndex: "figmaName", key: "figmaName", width: 170 },
    {
      title: "透明版本",
      key: "transparent",
      render: (_, row) => (
        <Space direction="vertical" size={0}>
          <Text code>{row.transparent.tokenName}</Text>
          <Text type="secondary">
            {row.transparent.handle} @{row.transparent.alpha}
          </Text>
        </Space>
      ),
    },
    {
      title: "非透明版本",
      key: "solid",
      render: (_, row) => (
        <Space direction="vertical" size={0}>
          <Text code>{row.solid.tokenName}</Text>
          <Text type="secondary">{row.solid.handle}</Text>
        </Space>
      ),
    },
    { title: "推荐用途", dataIndex: "usage", key: "usage" },
  ];

  return <Table columns={columns} dataSource={dividerColorTokenSpecs} pagination={false} size="small" rowKey="tone" />;
}

function SceneTable() {
  const columns: ColumnsType<(typeof SCENE_ROWS)[number]> = [
    { title: "场景", dataIndex: "scene", key: "scene", width: 190 },
    { title: "推荐 token", dataIndex: "tokenName", key: "tokenName", width: 300, render: (value: string) => <Text code>{value}</Text> },
    { title: "说明", dataIndex: "note", key: "note" },
  ];

  return <Table columns={columns} dataSource={SCENE_ROWS} pagination={false} size="small" />;
}

function DividerSpecimen() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginTop: 0 }}>
          分割线数值样张
        </Title>
        <Text type="secondary">
          分割线统一使用 1px；四个线色均提供透明版本和非透明版本，当前先通过代码侧 helper 承接。
        </Text>
      </div>

      <section>
        <Title level={5}>四个线色</Title>
        <ColorMatrix />
      </section>

      <section>
        <Title level={5}>方向样张</Title>
        <DirectionSpecimen />
      </section>

      <section>
        <Title level={5}>卡片分割样张</Title>
        <CardDividerSpecimen />
      </section>

      <section>
        <Title level={5}>Token 映射</Title>
        <MappingTable />
      </section>

      <section>
        <Title level={5}>场景准入</Title>
        <SceneTable />
      </section>

      <Alert
        type="warning"
        showIcon
        message="生成链路待明天统一校验"
        description="当前 Divider token 是可消费入口；明天需要和 Typography 一起确认是否进入 build-tokens.mjs 的生成结构。"
      />
    </Space>
  );
}

export default function DividerBasicStylePage() {
  return (
    <BasicStylePageLayout
      title="分割线"
      description="统一横线、竖线、描边和弱边界的线色层级、1px 宽度和使用语义。"
      designDocSource={dividerDocSource}
      specimen={<DividerSpecimen />}
    />
  );
}
