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
  { key: "top-bg", item: "顶导航背景", source: "Figma 已记录", code: "getThemeTopBackground() + 待补完整映射", status: "已有 helper 方向" },
  { key: "side-bg", item: "侧导航背景", source: "Figma 已记录", code: "待建立 token / helper 映射", status: "待映射" },
  { key: "title-bg", item: "标题栏背景", source: "Figma 已记录", code: "theme-title-background", status: "已有代码方向" },
  { key: "page-bg", item: "页面背景", source: "Figma 已记录", code: "body-background", status: "已有代码方向" },
  { key: "gradient-helper", item: "导航渐变效果", source: "导航效果规则", code: "Navigation Color helper 承接", status: "已有代码方向" },
  { key: "top-text-default", item: "顶导航文字&图标默认", source: "Figma 已记录", code: "待建立透明色 helper 映射", status: "待映射" },
  { key: "side-text", item: "侧导航主要 / 辅助文字", source: "Figma 已记录", code: "待确认 theme-side-* 映射", status: "待确认" },
  { key: "side-active", item: "侧导航选中文字", source: "Figma 已记录", code: "theme-side-text-active", status: "已有代码方向" },
];

const MAPPING_ROWS = [
  {
    key: "top-bg",
    group: "顶导航",
    figma: "背景渐变",
    handle: "getThemeTopBackground()",
    value: "绿：#0F9670 -> #0D826D；蓝：helper",
    status: "半 ready",
    action: "补正式背景 helper/token；补绿/蓝换肤矩阵",
  },
  {
    key: "top-role-bg",
    group: "顶导航",
    figma: "角色背景",
    handle: "theme-top-role-background",
    value: "#000000 + 透明度",
    status: "半 ready",
    action: "补透明度语义",
  },
  {
    key: "top-func-bg",
    group: "顶导航",
    figma: "功能入口菜单背景",
    handle: "theme-top-funcMenu-background-hover/active",
    value: "#00B280 + 透明度",
    status: "半 ready",
    action: "补默认态；补透明度语义",
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
    value: "#001540 / #00B280",
    status: "半 ready",
    action: "补默认态；补透明度语义",
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
    value: "#FFFFFF + 默认态 80%",
    status: "半 ready",
    action: "补默认 80% 透明度语义",
  },
  {
    key: "top-icon-bg",
    group: "顶导航",
    figma: "图标背景",
    handle: "theme-top-icon-hover/active",
    value: "#000000 + 透明度",
    status: "半 ready",
    action: "补透明度语义",
  },
  {
    key: "top-line",
    group: "顶导航",
    figma: "横线 / 竖线",
    handle: "theme-top-line-dack/light",
    value: "#000000 + 透明度",
    status: "半 ready",
    action: "补线条透明度语义",
  },
  {
    key: "top-menu-line",
    group: "顶导航",
    figma: "菜单线",
    handle: "theme-top-menuLine-outlined/divide/active",
    value: "#001540 / #001540 / #00B280",
    status: "已 ready",
    action: "组件接入；确认透明度是否在 token 层",
  },
  {
    key: "side-bg",
    group: "侧导航",
    figma: "默认背景渐变",
    handle: "暂无完整 handle",
    value: "#FAFCFC -> #F0F7F6",
    status: "待录入",
    action: "补 getThemeSideBackground() 或 source token",
  },
  {
    key: "side-catalog-bg",
    group: "侧导航",
    figma: "目录背景",
    handle: "暂无完整 handle",
    value: "待确认",
    status: "待录入",
    action: "补目录背景 default/hover/active",
  },
  {
    key: "side-state-bg",
    group: "侧导航",
    figma: "背景状态",
    handle: "theme-side-background-hover/click/active",
    value: "#001540 / #001540 / #00B280",
    status: "半 ready",
    action: "补默认态；补透明度语义",
  },
  {
    key: "side-text",
    group: "侧导航",
    figma: "文字",
    handle: "theme-side-text/subText/text-active",
    value: "#171C26 / #081226 / #00B280",
    status: "半 ready",
    action: "补主要/辅助文字透明度语义",
  },
  {
    key: "side-icon",
    group: "侧导航",
    figma: "图标",
    handle: "theme-side-icon/subIcon/icon-active",
    value: "#747E94 / #747E94 / #00B280",
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
    figma: "绿 / 蓝导航主题映射",
    handle: "部分 helper",
    value: "顶导航背景已有 helper；其他组不完整",
    status: "待录入",
    action: "补完整换肤矩阵",
  },
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
        const color = value === "已 ready" ? "success" : value === "半 ready" ? "processing" : "warning";
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
          这里先把导航颜色纳入基础样式工作流，展示边界、分组、已有代码方向和待补项；当前页面不是完整导航换肤矩阵，也不代表产品壳已实现。
        </Text>
      </div>

      <Alert
        type="info"
        showIcon
        message="本页是导航颜色入口，不是完整实现"
        description="顶导航、侧导航、标题栏、页面主题背景和换肤映射后续会继续扩展；结构、状态和收纳规则请看组件页「顶部导航」。"
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
        message="导航渐变作为效果进入 helper，不等于所有导航都必须渐变"
        description="顶导航已有 helper 方向；侧导航和更多换肤映射仍待补。这里记录颜色和 helper 归属，不在本页承诺完整产品壳视觉。"
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
