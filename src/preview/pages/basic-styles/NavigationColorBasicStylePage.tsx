import { Alert, Space, Table, Tag, Typography, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import { getColorToken } from "../../../design-system/color-utils";
import navigationColorDocSource from "../../../../docs/foundations/navigation-color.md?raw";
import { BasicStylePageLayout } from "./BasicStylePageLayout";

const { Text, Title } = Typography;

const BOUNDARY_ROWS = [
  { key: "functional", type: "普通组件主色 / hover / active", owner: "color.md", note: "Button、Input、Select、选中态等" },
  { key: "status", type: "链接 / 成功 / 提醒 / 警告", owner: "color.md", note: "状态色不随功能色换肤变化" },
  { key: "neutral", type: "文本 / 边框 / 背景", owner: "color.md", note: "普通页面和组件中性色" },
  { key: "nav", type: "顶导航 / 侧导航 / 标题栏", owner: "navigation-color.md", note: "产品框架专属主题色" },
  { key: "page-bg", type: "页面主题背景", owner: "navigation-color.md", note: "跟随导航主题分支" },
  { key: "skin-map", type: "换肤映射表", owner: "navigation-color.md", note: "后续按 Figma / token 映射维护" },
];

const GROUP_ROWS = [
  { key: "top", group: "顶导航", scope: "背景、角色背景、功能入口菜单、项目菜单、logo、文字与图标、线、菜单线", status: "待映射" },
  { key: "side", group: "侧导航", scope: "背景、目录背景、文字、图标", status: "待映射" },
  { key: "title", group: "标题栏", scope: "标题栏背景", status: "已有代码方向" },
  { key: "page", group: "页面", scope: "页面主题背景", status: "已有代码方向" },
  { key: "skin", group: "导航换肤", scope: "导航主题色独立换肤矩阵；如复用功能色，必须通过映射表确认", status: "待补矩阵" },
];

const TOKEN_SAMPLE_ROWS = [
  { key: "title-bg", name: "标题栏背景", handle: "theme-title-background", note: "对应 Figma 标题栏背景方向" },
  { key: "body-bg", name: "页面主题背景", handle: "body-background", note: "对应 Figma 页面背景方向" },
  { key: "side-text-active", name: "侧导航选中文字", handle: "theme-side-text-active", note: "侧导航选中态可能复用功能色，后续需映射确认" },
  { key: "top-logo", name: "顶导航 logo", handle: "theme-top-logo", note: "顶导航 logo / 文案亮色方向" },
  { key: "component-primary", name: "功能主色参考", handle: "component-primary", note: "仅作复用关系参考，不在导航页重新定义功能色" },
];

const KEY_VALUE_ROWS = [
  { key: "top-bg", item: "顶导航背景", source: "Figma 已记录", code: "待建立 token / helper 映射", status: "待映射" },
  { key: "side-bg", item: "侧导航背景", source: "Figma 已记录", code: "待建立 token / helper 映射", status: "待映射" },
  { key: "title-bg", item: "标题栏背景", source: "Figma 已记录", code: "theme-title-background", status: "已有代码方向" },
  { key: "page-bg", item: "页面背景", source: "Figma 已记录", code: "body-background", status: "已有代码方向" },
  { key: "top-text-default", item: "顶导航文字&图标默认", source: "Figma 已记录", code: "待建立透明色 helper 映射", status: "待映射" },
  { key: "side-text", item: "侧导航主要 / 辅助文字", source: "Figma 已记录", code: "待确认 theme-side-* 映射", status: "待确认" },
  { key: "side-active", item: "侧导航选中文字", source: "Figma 已记录", code: "theme-side-text-active", status: "已有代码方向" },
];

const ISSUE_ROWS = [
  { key: "independent", issue: "导航主题色系统独立", status: "已拆出 Navigation Color Foundation", next: "做产品壳 / 导航前持续补充" },
  { key: "skin", issue: "全局换肤未完成", status: "先记录", next: "单独立项" },
  { key: "gradient", issue: "顶导航 / 侧导航渐变仍未 token 化", status: "暂不在样张代码硬写", next: "产品壳阶段建立 token / helper" },
  { key: "active-diff", issue: "Figma 与代码 component-active 存在 1 个 hex 差异", status: "记录差异，不直接修正", next: "换肤映射阶段确认来源" },
  { key: "mapping", issue: "缺少完整 Figma -> token 映射表", status: "待补", next: "导航实现前" },
];

function BoundaryTable() {
  const columns: ColumnsType<(typeof BOUNDARY_ROWS)[number]> = [
    { title: "类型", dataIndex: "type", key: "type" },
    { title: "归属", dataIndex: "owner", key: "owner", width: 190 },
    { title: "说明", dataIndex: "note", key: "note" },
  ];

  return <Table columns={columns} dataSource={BOUNDARY_ROWS} pagination={false} size="small" />;
}

function GroupTable() {
  const columns: ColumnsType<(typeof GROUP_ROWS)[number]> = [
    { title: "分组", dataIndex: "group", key: "group", width: 120 },
    { title: "范围", dataIndex: "scope", key: "scope" },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (value: string) => <Tag color={value.includes("已有") ? "success" : "warning"}>{value}</Tag>,
    },
  ];

  return <Table columns={columns} dataSource={GROUP_ROWS} pagination={false} size="small" />;
}

function TokenSampleBoard() {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: token.marginMD,
      }}
    >
      {TOKEN_SAMPLE_ROWS.map((item) => {
        const color = getColorToken(item.handle);

        return (
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
              <div
                style={{
                  height: 48,
                  borderRadius: token.borderRadius,
                  border: `1px solid ${token.colorBorderSecondary}`,
                  background: color,
                }}
              />
              <Text strong>{item.name}</Text>
              <Text code>{item.handle}</Text>
              <Text type="secondary">{item.note}</Text>
            </Space>
          </div>
        );
      })}
    </div>
  );
}

function KeyValueTable() {
  const columns: ColumnsType<(typeof KEY_VALUE_ROWS)[number]> = [
    { title: "导航项", dataIndex: "item", key: "item" },
    { title: "设计来源", dataIndex: "source", key: "source", width: 160 },
    { title: "当前代码方向", dataIndex: "code", key: "code" },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (value: string) => <Tag color={value.includes("已有") ? "success" : "warning"}>{value}</Tag>,
    },
  ];

  return <Table columns={columns} dataSource={KEY_VALUE_ROWS} pagination={false} size="small" />;
}

function IssueTable() {
  const columns: ColumnsType<(typeof ISSUE_ROWS)[number]> = [
    { title: "问题", dataIndex: "issue", key: "issue" },
    { title: "当前处理", dataIndex: "status", key: "status" },
    { title: "建议时机", dataIndex: "next", key: "next" },
  ];

  return <Table columns={columns} dataSource={ISSUE_ROWS} pagination={false} size="small" />;
}

function NavigationColorSpecimen() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginTop: 0 }}>
          导航颜色口子
        </Title>
        <Text type="secondary">
          这里先把导航颜色纳入基础样式工作流，展示边界、分组、已有代码方向和待补项；当前页面不是完整导航换肤矩阵，也不代表产品壳已实现。
        </Text>
      </div>

      <Alert
        type="info"
        showIcon
        message="本页是导航颜色入口，不是完整实现"
        description="顶导航、侧导航、标题栏、页面主题背景和换肤映射后续会继续扩展；当前不改 token / theme / 产品壳。"
      />

      <section>
        <Title level={5}>与 Color Foundation 的边界</Title>
        <BoundaryTable />
      </section>

      <section>
        <Title level={5}>导航颜色主要分组</Title>
        <GroupTable />
      </section>

      <section>
        <Title level={5}>已有代码方向样张</Title>
        <TokenSampleBoard />
      </section>

      <section>
        <Title level={5}>关键值与映射状态</Title>
        <KeyValueTable />
      </section>

      <Alert
        type="warning"
        showIcon
        message="未 token 化的导航渐变暂不做视觉样张"
        description="Figma 中已记录顶导航 / 侧导航渐变，但当前没有稳定 token / helper 承接；本页只记录待映射状态，避免在预览页代码里继续硬编码。"
      />

      <section>
        <Title level={5}>当前问题与待补</Title>
        <IssueTable />
      </section>
    </Space>
  );
}

export default function NavigationColorBasicStylePage() {
  return (
    <BasicStylePageLayout
      title="导航颜色"
      description="独立承接顶导航、侧导航、标题栏、页面主题背景和导航换肤映射。"
      designDocSource={navigationColorDocSource}
      specimen={<NavigationColorSpecimen />}
    />
  );
}
