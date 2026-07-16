import { Alert, Space, Table, Tag, Typography, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import { getColorToken } from "../../../design-system/color-utils";
import { getThemeSideBackground, getThemeTopBackground } from "../../../design-system/navigation-color";
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
  { key: "top", group: "顶导航", scope: "背景、角色背景、功能入口菜单、项目菜单、logo、文字与图标、线、菜单线", status: "绿肤 ready" },
  { key: "side", group: "侧导航", scope: "背景、目录背景、文字、图标", status: "绿肤 ready" },
  { key: "title", group: "标题栏", scope: "标题栏背景", status: "绿肤 ready" },
  { key: "page", group: "页面", scope: "页面主题背景", status: "绿肤 ready" },
  { key: "skin", group: "导航换肤", scope: "Navigation Theme 独立于 Functional Skin；蓝、黄等按同一组槽位补齐", status: "待补矩阵" },
];

const TOKEN_SAMPLE_ROWS = [
  { key: "top-bg", name: "顶导航背景", handle: "theme-top-background", note: "产品壳主题渐变，走 getThemeTopBackground()", background: getThemeTopBackground() },
  { key: "side-bg", name: "侧导航背景", handle: "theme-side-background", note: "产品壳主题渐变，走 getThemeSideBackground()", background: getThemeSideBackground() },
  { key: "title-bg", name: "标题栏背景", handle: "theme-title-background", note: "对应 Figma 标题栏背景方向" },
  { key: "body-bg", name: "页面主题背景", handle: "body-background", note: "对应 Figma 页面背景方向" },
  { key: "side-text-active", name: "侧导航选中文字", handle: "theme-side-text-active", note: "侧导航主题专属选中态，不复用功能主色" },
  { key: "top-logo", name: "顶导航 logo", handle: "theme-top-logo", note: "顶导航 logo / 文案亮色方向" },
];

const KEY_VALUE_ROWS = [
  { key: "top-bg", item: "顶导航背景", source: "Figma 主题色", code: "navigationTheme.green.top.background / getThemeTopBackground()", status: "绿肤 ready" },
  { key: "side-bg", item: "侧导航背景", source: "Figma 主题色", code: "navigationTheme.green.side.background / getThemeSideBackground()", status: "绿肤 ready" },
  { key: "title-bg", item: "标题栏背景", source: "Figma 主题色", code: "theme-title-background", status: "绿肤 ready" },
  { key: "page-bg", item: "页面背景", source: "Figma 主题色", code: "body-background", status: "绿肤 ready" },
  { key: "alpha", item: "导航透明状态", source: "Figma 颜色变量", code: "Token 生成保留 #RRGGBBAA", status: "已 ready" },
  { key: "independent", item: "导航主题与功能色主题", source: "换肤规则", code: "NavigationTheme 与 FunctionalSkin 分开", status: "已拆分" },
];

const MAPPING_ROWS = [
  {
    key: "top-bg",
    group: "顶导航",
    figma: "背景渐变",
    handle: "theme-top-background / getThemeTopBackground()",
    value: "绿：#0F9670 -> #0D826D",
    status: "绿肤 ready",
    action: "蓝、黄等主题按同一槽位补值",
  },
  {
    key: "top-role-bg",
    group: "顶导航",
    figma: "角色背景",
    handle: "theme-top-role-background",
    value: "#0000000F",
    status: "已 ready",
    action: "组件直接消费 Token",
  },
  {
    key: "top-func-bg",
    group: "顶导航",
    figma: "功能入口菜单背景",
    handle: "theme-top-funcMenu-background-hover/active",
    value: "#00B2801A",
    status: "已 ready",
    action: "组件直接消费 Token；默认态透明",
  },
  {
    key: "top-func-text",
    group: "顶导航",
    figma: "功能入口菜单文字",
    handle: "theme-top-funcMenu-text/hover/active",
    value: "#171C26 / #00B280 / #00B280",
    status: "已 ready",
    action: "组件按状态接入",
  },
  {
    key: "top-func-icon",
    group: "顶导航",
    figma: "功能入口菜单图标",
    handle: "theme-top-funcMenu-icon/hover/active",
    value: "#747E94 / #00B280 / #00B280",
    status: "已 ready",
    action: "组件按状态接入",
  },
  {
    key: "top-pro-bg",
    group: "顶导航",
    figma: "项目菜单背景",
    handle: "theme-top-proMenu-background-hover/active",
    value: "#0015400F / #00B2801A",
    status: "已 ready",
    action: "组件直接消费 Token；默认态透明",
  },
  {
    key: "top-pro-text",
    group: "顶导航",
    figma: "项目菜单文字",
    handle: "theme-top-proMenu-text/hover/active",
    value: "#171C26 / #171C26 / #00B280",
    status: "已 ready",
    action: "组件按状态接入",
  },
  {
    key: "top-logo",
    group: "顶导航",
    figma: "logo",
    handle: "theme-top-logo",
    value: "#FFFFFF",
    status: "已 ready",
    action: "组件接入",
  },
  {
    key: "top-text-icon",
    group: "顶导航",
    figma: "文字&图标",
    handle: "theme-top-text/hover/active",
    value: "#FFFFFFCC / #FFFFFF / #FFFFFF",
    status: "已 ready",
    action: "组件按状态接入",
  },
  {
    key: "top-icon-bg",
    group: "顶导航",
    figma: "图标背景",
    handle: "theme-top-icon-hover/active",
    value: "#0000001A / #00000033",
    status: "已 ready",
    action: "组件按状态接入",
  },
  {
    key: "top-line",
    group: "顶导航",
    figma: "横线 / 竖线",
    handle: "theme-top-line-dack/light",
    value: "#00000014 / #0000000F",
    status: "已 ready",
    action: "组件直接消费 Token",
  },
  {
    key: "top-menu-line",
    group: "顶导航",
    figma: "菜单线",
    handle: "theme-top-menuLine-outlined/divide/active",
    value: "#0015401F / #00154014 / #00B280",
    status: "已 ready",
    action: "组件接入；确认透明度是否在 token 层",
  },
  {
    key: "side-bg",
    group: "侧导航",
    figma: "默认背景渐变",
    handle: "theme-side-background / getThemeSideBackground()",
    value: "#FAFCFC -> #F0F7F6",
    status: "绿肤 ready",
    action: "蓝、黄等主题按同一槽位补值",
  },
  {
    key: "side-catalog-bg",
    group: "侧导航",
    figma: "目录默认背景",
    handle: "无额外 Token",
    value: "透明，承接 theme-side-background",
    status: "已 ready",
    action: "不新增 default Token",
  },
  {
    key: "side-state-bg",
    group: "侧导航",
    figma: "背景状态",
    handle: "theme-side-background-hover/click/active",
    value: "#0015400F / #00154014 / #00B2801A",
    status: "已 ready",
    action: "组件按状态接入",
  },
  {
    key: "side-text",
    group: "侧导航",
    figma: "文字",
    handle: "theme-side-text/subText/text-active",
    value: "#171C26E5 / #08122694 / #00B280",
    status: "已 ready",
    action: "组件按层级接入",
  },
  {
    key: "side-icon",
    group: "侧导航",
    figma: "图标",
    handle: "theme-side-icon/subIcon/icon-active",
    value: "#747E94 / #747E94CC / #00B280",
    status: "已 ready",
    action: "组件接入",
  },
  {
    key: "title-bg",
    group: "标题栏",
    figma: "背景",
    handle: "theme-title-background",
    value: "#F5FAFA",
    status: "已 ready",
    action: "组件接入",
  },
  {
    key: "page-bg",
    group: "页面",
    figma: "页面主题背景",
    handle: "body-background",
    value: "#F5FAFA",
    status: "已 ready",
    action: "组件接入",
  },
  {
    key: "skin-map",
    group: "换肤",
    figma: "Navigation Theme 映射",
    handle: "NavigationTheme",
    value: "绿肤完整；功能色主题独立",
    status: "绿肤 ready",
    action: "读到蓝、黄 Figma 色板后补完整矩阵",
  },
];

const ISSUE_ROWS = [
  { key: "independent", issue: "导航主题与功能色主题独立", status: "NavigationTheme 已从 FunctionalSkin 拆开", next: "新增主题时保持独立配置" },
  { key: "skin", issue: "蓝、黄等导航主题矩阵", status: "绿肤已 ready", next: "取得完整 Figma 色板后按同一槽位录入" },
  { key: "gradient", issue: "顶导航 / 侧导航渐变 Token", status: "绿肤已入库并有 helper", next: "组件实现时直接消费" },
  { key: "active-diff", issue: "Figma 与代码 component-active 存在 1 个 hex 差异", status: "记录差异，不直接修正", next: "换肤映射阶段确认来源" },
  { key: "mapping", issue: "Figma -> Token 映射表", status: "神策绿已完成", next: "每套新增导航主题复用本表" },
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
      render: (value: string) => <Tag color={value.includes("ready") || value.includes("已有") || value.includes("拆分") ? "success" : "warning"}>{value}</Tag>,
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
        const color = item.background ?? getColorToken(item.handle);

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

function MappingStatusTable() {
  const columns: ColumnsType<(typeof MAPPING_ROWS)[number]> = [
    { title: "分组", dataIndex: "group", key: "group", width: 90, fixed: "left" },
    { title: "Figma / 设计项", dataIndex: "figma", key: "figma", width: 160 },
    { title: "当前 handle / helper", dataIndex: "handle", key: "handle", width: 230 },
    { title: "当前值 / 代码方向", dataIndex: "value", key: "value", width: 220 },
    {
      title: "Ready",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (value: string) => {
        const color = value === "已 ready" || value === "绿肤 ready" ? "success" : value === "半 ready" ? "processing" : "warning";
        return <Tag color={color}>{value}</Tag>;
      },
    },
    { title: "需要动作", dataIndex: "action", key: "action", width: 260 },
  ];

  return (
    <Table
      columns={columns}
      dataSource={MAPPING_ROWS}
      pagination={false}
      size="small"
      scroll={{ x: 1070 }}
    />
  );
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
          这里展示产品壳主题的边界、神策绿基线、Figma 到 Token 映射和后续换肤缺口；结构与交互规则仍归导航组件页。
        </Text>
      </div>

      <Alert
        type="info"
        showIcon
        message="神策绿产品壳主题已入库"
        description="顶导、侧导、标题栏、页面背景和导航状态色已进入同一套 Navigation Theme。蓝、黄等主题需补完整 Figma 色板；结构、状态和收纳规则请看导航组件页。"
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

      <section>
        <Title level={5}>Navigation Color 录入映射表</Title>
        <Text type="secondary">
          这张表用于指导后续 token 录入：先判断现有 handle 是否足够，再决定补 source token、补 helper，还是只补组件接入。
        </Text>
        <div style={{ marginTop: 12 }}>
          <MappingStatusTable />
        </div>
      </section>

      <Alert
        type="warning"
        showIcon
        message="导航渐变是产品壳主题 Token，不是功能色"
        description="getThemeTopBackground() 和 getThemeSideBackground() 只读取 NavigationTheme；它们不再跟随功能色切换。"
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
      description="独立承接顶导航、侧导航、标题栏、页面主题背景、导航渐变 helper 和换肤映射。"
      designDocSource={navigationColorDocSource}
      specimen={<NavigationColorSpecimen />}
    />
  );
}
