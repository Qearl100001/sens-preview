import { Fragment } from "react";
import { Space, Table, Tag, Typography, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  buildActiveRingShadow,
  buildDrawerShadow,
  buildShadow,
  getColorToken,
  type ActiveRingShadowHandle,
  type ShadowDirection,
  type ShadowLevel,
} from "../../../design-system/color-utils";
import tokens from "../../../design-system/tokens.resolved.json";
import shadowDocSource from "../../../../docs/foundations/shadow.md?raw";
import { BasicStylePageLayout } from "./BasicStylePageLayout";

const { Text, Title } = Typography;

const shadowTokens = tokens.shadow as Record<string, string>;

interface ShadowLevelSpec {
  level: ShadowLevel;
  label: string;
  usage: string;
}

const SHADOW_LEVELS: ShadowLevelSpec[] = [
  {
    level: "D1",
    label: "低层级选中",
    usage: "低层级选中 / 轻微浮起",
  },
  {
    level: "D2",
    label: "中低层级",
    usage: "中低层级容器 / 轻量浮层",
  },
  {
    level: "D3",
    label: "动作反馈",
    usage: "Button hover、轻量动作反馈",
  },
  {
    level: "D4",
    label: "高层浮层",
    usage: "FAB、Dropdown、Popover 等浮层",
  },
];

const DIRECTIONS: Array<{ key: ShadowDirection; label: string }> = [
  { key: "down", label: "下" },
  { key: "up", label: "上" },
  { key: "left", label: "左" },
  { key: "right", label: "右" },
];

const HELPER_ROWS = [
  { key: "resolved", item: "tokens.shadow", status: "已入库", note: "build-tokens.mjs 从 shadow.json 生成；helper 优先读此表" },
  { key: "d1", item: "D1 helper", status: "已有", note: "buildShadowD1() 兼容默认下方向" },
  { key: "d2", item: "D2 helper", status: "已补", note: "buildShadowD2() 兼容默认下方向" },
  { key: "d3", item: "D3 helper", status: "已有", note: "buildShadowD3() 兼容默认下方向" },
  { key: "d4", item: "D4 helper", status: "已有", note: "buildShadowD4() 兼容默认下方向" },
  { key: "direction", item: "方向型 helper", status: "已补", note: "buildShadow(level, direction) 表达上 / 下 / 左 / 右" },
  { key: "active-ring", item: "active ring", status: "已补", note: "buildActiveRingShadow(handle) 统一控件外环" },
  { key: "drawer", item: "Drawer 侧向投影", status: "已补", note: "buildDrawerShadow(\"right\") 承接右侧抽屉外层投影" },
];

function ShadowCard({ level, direction = "down" }: { level: ShadowLevel; direction?: ShadowDirection }) {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        height: 72,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: token.paddingSM,
        background: token.colorFillAlter,
        borderRadius: token.borderRadius,
      }}
    >
      <div
        style={{
          width: 72,
          height: 40,
          borderRadius: token.borderRadius,
          border: `1px solid ${token.colorBorderSecondary}`,
          background: token.colorBgContainer,
          boxShadow: buildShadow(level, direction),
        }}
      />
    </div>
  );
}

function ShadowScaleBoard() {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: token.marginMD,
      }}
    >
      {SHADOW_LEVELS.map((item) => (
        <div
          key={item.level}
          style={{
            padding: token.paddingMD,
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: token.borderRadius,
            background: token.colorBgContainer,
            display: "flex",
            flexDirection: "column",
            gap: token.marginSM,
          }}
        >
          <ShadowCard level={item.level} />
          <Space direction="vertical" size={2}>
            <Text strong>{item.level}</Text>
            <Text>{item.label}</Text>
            <Text type="secondary">{item.usage}</Text>
            <Text code style={{ fontSize: 11, wordBreak: "break-all" }}>
              {shadowTokens[`${item.level}/down`]}
            </Text>
          </Space>
        </div>
      ))}
    </div>
  );
}

function ShadowDirectionMatrix() {
  const { token } = theme.useToken();

  return (
    <div style={{ overflowX: "auto" }}>
      <div
        style={{
          minWidth: 760,
          display: "grid",
          gridTemplateColumns: "96px repeat(4, 1fr)",
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadius,
          overflow: "hidden",
          background: token.colorBgContainer,
        }}
      >
        <div style={{ padding: token.paddingSM, background: token.colorFillAlter }} />
        {DIRECTIONS.map((direction) => (
          <div
            key={direction.key}
            style={{
              padding: token.paddingSM,
              background: token.colorFillAlter,
              borderLeft: `1px solid ${token.colorBorderSecondary}`,
            }}
          >
            <Text strong>{direction.label}</Text>
          </div>
        ))}
        {SHADOW_LEVELS.map((level) => (
          <Fragment key={level.level}>
            <div
              style={{
                padding: token.paddingSM,
                borderTop: `1px solid ${token.colorBorderSecondary}`,
                background: token.colorFillAlter,
              }}
            >
              <Text strong>{level.level}</Text>
            </div>
            {DIRECTIONS.map((direction) => (
              <div
                key={`${level.level}-${direction.key}`}
                style={{
                  padding: token.paddingSM,
                  borderTop: `1px solid ${token.colorBorderSecondary}`,
                  borderLeft: `1px solid ${token.colorBorderSecondary}`,
                }}
              >
                <ShadowCard level={level.level} direction={direction.key} />
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function ActiveRingPreview({
  title,
  handle,
  borderHandle,
  description,
}: {
  title: string;
  handle: ActiveRingShadowHandle;
  borderHandle: "component-active" | "warning-color";
  description: string;
}) {
  const { token } = theme.useToken();

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
        <div
          style={{
            width: "100%",
            maxWidth: 360,
            height: 40,
            display: "flex",
            alignItems: "center",
            paddingInline: token.paddingSM,
            border: `1px solid ${getColorToken(borderHandle)}`,
            borderRadius: token.borderRadius,
            boxShadow: buildActiveRingShadow(handle),
            color: token.colorTextTertiary,
            background: token.colorBgContainer,
          }}
        >
          请输入
        </div>
        <Space direction="vertical" size={2}>
          <Text strong>{title}</Text>
          <Text code>{handle} @20%</Text>
          <Text type="secondary">{description}</Text>
        </Space>
      </Space>
    </div>
  );
}

function ActiveRingBoard() {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: token.marginMD,
      }}
    >
      <ActiveRingPreview
        title="控件 / 点击 / 功能"
        handle="component-active-shadow"
        borderHandle="component-active"
        description="Input / Select / Search 等激活态，可换肤。"
      />
      <ActiveRingPreview
        title="控件 / 点击 / 警告"
        handle="warning-color-active-shadow"
        borderHandle="warning-color"
        description="警告 / 错误状态激活态。"
      />
    </div>
  );
}

function DrawerShadowBoard() {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        padding: token.paddingLG,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadius,
        background: token.colorFillAlter,
        overflow: "hidden",
      }}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <div
          style={{
            height: 160,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              width: 192,
              borderRadius: `${token.borderRadiusLG}px 0 0 ${token.borderRadiusLG}px`,
              background: token.colorBgContainer,
              boxShadow: buildDrawerShadow("right"),
            }}
          />
        </div>
        <Space direction="vertical" size={2}>
          <Text strong>Drawer / right</Text>
          <Text code>shadow/drawer/right</Text>
          <Text type="secondary">右侧抽屉外层侧向投影，来源 Figma 抽屉组件 2219:10662。</Text>
        </Space>
      </Space>
    </div>
  );
}

function HelperStatusTable() {
  const columns: ColumnsType<(typeof HELPER_ROWS)[number]> = [
    { title: "项", dataIndex: "item", key: "item", width: 180 },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (value: string) => <Tag color={value === "已补" ? "processing" : "success"}>{value}</Tag>,
    },
    { title: "说明", dataIndex: "note", key: "note" },
  ];

  return <Table columns={columns} dataSource={HELPER_ROWS} pagination={false} size="small" />;
}

function ShadowSpecimen() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginTop: 0 }}>
          投影数值样张
        </Title>
        <Text type="secondary">
          这里展示 D1-D4、四方向和控件 active ring，后续组件验收时优先对照这一页。
        </Text>
      </div>

      <section>
        <Title level={5}>Shadow Scale</Title>
        <ShadowScaleBoard />
      </section>

      <section>
        <Title level={5}>四方向</Title>
        <ShadowDirectionMatrix />
      </section>

      <section>
        <Title level={5}>控件 Active Ring</Title>
        <ActiveRingBoard />
      </section>

      <section>
        <Title level={5}>组件语义投影</Title>
        <DrawerShadowBoard />
      </section>

      <section>
        <Title level={5}>当前代码状态</Title>
        <HelperStatusTable />
      </section>
    </Space>
  );
}

export default function ShadowBasicStylePage() {
  return (
    <BasicStylePageLayout
      title="投影"
      description="统一组件状态反馈、浮层、卡片层级、抽屉和内部边界强调的投影规则。"
      designDocSource={shadowDocSource}
      specimen={<ShadowSpecimen />}
    />
  );
}
