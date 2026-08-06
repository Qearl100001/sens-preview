import { Alert, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigationTheme } from "../../../design-system/appearance";
import { getColorToken } from "../../../design-system/color-utils";
import {
  getNavigationAccent,
  getNavigationColorToken,
  getNavigationTheme,
  NAVIGATION_THEME_LABELS,
  getThemeTopAtmosphere,
  getThemeSideBackground,
  getThemeTopBackground,
  type NavigationTheme,
} from "../../../design-system/navigation-color";
import navigationColorDocSource from "../../../../docs/foundations/navigation-color.md?raw";
import { BasicStylePageLayout } from "./BasicStylePageLayout";
import { getPreviewTokens } from "../../previewTokens";

const { Text, Title } = Typography;

const NAVIGATION_THEME_KEYS = Object.keys(NAVIGATION_THEME_LABELS) as NavigationTheme[];

const FUNCTIONAL_THEME_BY_NAVIGATION: Record<NavigationTheme, string> = {
  green: "神策绿",
  blue: "冰绽蓝",
  wildYellow: "冰绽蓝",
  limeGreen: "青柠绿",
  duneGold: "冰绽蓝",
  sunriseRed: "冰绽蓝",
  auroraGreen: "极光绿",
  landscapeBlue: "山水蓝",
  orchidPurple: "兰花紫",
  wavePurple: "波光紫",
  cloudPink: "冰绽蓝",
  midnightBlack: "神策绿",
};

const BOUNDARY_ROWS = [
  { key: "functional", type: "普通组件主色 / hover / active", owner: "color.md", note: "Button、Input、Select、选中态等" },
  { key: "status", type: "链接 / 成功 / 提醒 / 警告", owner: "color.md", note: "状态色不随功能色换肤变化" },
  { key: "neutral", type: "文本 / 边框 / 背景", owner: "color.md", note: "普通页面和组件中性色" },
  { key: "nav", type: "顶导航 / 侧导航 / 标题栏", owner: "navigation-color.md", note: "产品框架专属主题色" },
  { key: "page-bg", type: "页面主题背景", owner: "navigation-color.md", note: "跟随导航主题分支" },
  { key: "skin-map", type: "换肤映射表", owner: "navigation-color.md", note: "后续按 Figma / token 映射维护" },
];

const GROUP_ROWS = [
  { key: "top", group: "顶导航", scope: "背景、角色背景、功能入口菜单、项目菜单、logo、文字与图标、线、菜单线", status: "12 套 ready" },
  { key: "side", group: "侧导航", scope: "背景、目录背景、文字、图标", status: "12 套 ready" },
  { key: "title", group: "标题栏", scope: "标题栏背景", status: "12 套 ready" },
  { key: "page", group: "页面", scope: "页面主题背景", status: "12 套 ready" },
  { key: "skin", group: "导航换肤", scope: "预览设置可独立选择 12 套 Navigation Theme", status: "12 套 ready" },
];

const TOKEN_SAMPLE_META = [
  { key: "top-bg", name: "顶导航背景", handle: "theme-top-background", note: "产品壳主题渐变，走 getThemeTopBackground(theme)" },
  { key: "side-bg", name: "侧导航背景", handle: "theme-side-background", note: "产品壳主题渐变，走 getThemeSideBackground(theme)" },
  { key: "title-bg", name: "标题栏背景", handle: "theme-title-background", note: "getNavigationTheme(theme).title / getNavigationColorToken" },
  { key: "body-bg", name: "页面主题背景", handle: "body-background", note: "getNavigationTheme(theme).page / getNavigationColorToken" },
  { key: "side-text-active", name: "侧导航选中文字", handle: "theme-side-text-active", note: "品牌态走 getNavigationColorToken(handle, theme)" },
  { key: "top-logo", name: "顶导航 logo", handle: "theme-top-logo", note: "中性亮色，不随品牌换肤" },
];

const KEY_VALUE_ROWS = [
  { key: "top-bg", item: "顶导航背景", source: "Figma 主题色", code: "navigationTheme.<theme>.top.background / getThemeTopBackground(theme)", status: "12 套 ready" },
  { key: "side-bg", item: "侧导航背景", source: "Figma 主题色", code: "navigationTheme.<theme>.side.background / getThemeSideBackground(theme)", status: "12 套 ready" },
  { key: "title-bg", item: "标题栏背景", source: "Figma 主题色", code: "getNavigationTheme(theme).title / getNavigationColorToken", status: "12 套 ready" },
  { key: "page-bg", item: "页面背景", source: "Figma 主题色", code: "getNavigationTheme(theme).page / getNavigationColorToken", status: "12 套 ready" },
  { key: "alpha", item: "导航透明状态", source: "Figma 颜色变量", code: "Token 生成保留 #RRGGBBAA", status: "已 ready" },
  { key: "independent", item: "导航主题与功能色主题", source: "换肤规则", code: "NavigationTheme 与 FunctionalSkin 分开；预览默认同步", status: "已拆分" },
];

const MAPPING_ROWS = [
  {
    key: "top-bg",
    group: "顶导航",
    figma: "背景渐变",
    handle: "theme-top-background / getThemeTopBackground()",
    value: "12 套主题渐变",
    status: "12 套 ready",
    action: "组件按当前 Navigation Theme 消费",
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
    value: "12 套主题渐变",
    status: "12 套 ready",
    action: "组件按当前 Navigation Theme 消费",
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
    value: "12 套标题栏背景",
    status: "12 套 ready",
    action: "组件接入",
  },
  {
    key: "page-bg",
    group: "页面",
    figma: "页面主题背景",
    handle: "body-background",
    value: "12 套页面背景",
    status: "12 套 ready",
    action: "组件接入",
  },
  {
    key: "skin-map",
    group: "换肤",
    figma: "Navigation Theme 映射",
    handle: "NavigationTheme",
    value: "12 套导航 + 7 组功能色映射",
    status: "12 套 ready",
    action: "组件阶段继续改读 getNavigationColorToken",
  },
];

const ISSUE_ROWS = [
  { key: "independent", issue: "导航主题与功能色主题独立", status: "已拆分；预览设置默认同步", next: "产品需要时再暴露分控" },
  { key: "skin", issue: "12 套导航主题矩阵", status: "12 套已 ready", next: "组件继续接入主题参数" },
  { key: "gradient", issue: "顶导航 / 侧导航渐变 Token", status: "12 套已入库并有 helper", next: "组件继续消费当前 theme 参数" },
  { key: "active-diff", issue: "Figma 与代码 component-active 存在 1 个 hex 差异", status: "记录差异，不直接修正", next: "跟现有 token #008C65" },
  { key: "mapping", issue: "Figma -> Token 映射表", status: "12 套已完成", next: "组件继续按槽位验收" },
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
  const token = getPreviewTokens();
  const navigationTheme = useNavigationTheme();
  const navigation = getNavigationTheme(navigationTheme);

  const samples = TOKEN_SAMPLE_META.map((item) => {
    let background: string;
    if (item.key === "top-bg") background = getThemeTopBackground(navigationTheme);
    else if (item.key === "side-bg") background = getThemeSideBackground(navigationTheme);
    else if (item.key === "title-bg") background = navigation.title.background;
    else if (item.key === "body-bg") background = navigation.page.background;
    else if (item.key === "side-text-active") background = getNavigationColorToken(item.handle, navigationTheme);
    else background = getColorToken(item.handle);
    return { ...item, background };
  });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: token.marginMD,
      }}
    >
      {samples.map((item) => {
        const color = item.background;

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
                  borderRadius: token.borderRadiusSM,
                  background: color,
                  border: `1px solid ${token.colorBorderSecondary}`,
                }}
              />
              <Text strong>{item.name}</Text>
              <Text code>{item.handle}</Text>
              <Text type="secondary">{item.note}</Text>
              <Text type="secondary">当前主题：{NAVIGATION_THEME_LABELS[navigationTheme]}</Text>
            </Space>
          </div>
        );
      })}
    </div>
  );
}

function ThemeSpecificationBoard() {
  const token = getPreviewTokens();

  return (
    <div style={{ display: "grid", gap: token.marginMD }}>
      {NAVIGATION_THEME_KEYS.map((theme) => {
        const navigation = getNavigationTheme(theme);
        const accent = getNavigationAccent(theme);
        const slots = [
          { key: "top", label: "顶导背景", background: getThemeTopBackground(theme) },
          { key: "atmosphere", label: "氛围层", background: `${getThemeTopAtmosphere(theme)}, ${getThemeTopBackground(theme)}` },
          { key: "side", label: "侧导背景", background: getThemeSideBackground(theme) },
          { key: "title", label: "标题栏背景", background: navigation.title.background },
          { key: "page", label: "页面背景", background: navigation.page.background },
          { key: "solid", label: "品牌实色", background: accent.solid },
          { key: "subtle", label: "品牌浅底", background: accent.subtle },
        ];

        return (
          <div
            key={theme}
            style={{
              padding: token.paddingMD,
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: token.borderRadius,
              background: token.colorBgContainer,
            }}
          >
            <Space style={{ marginBottom: token.marginSM }}>
              <Text strong>{NAVIGATION_THEME_LABELS[theme]}</Text>
              <Text code>{theme}</Text>
              <Tag color="success">12 套规格</Tag>
              <Text type="secondary">功能色：{FUNCTIONAL_THEME_BY_NAVIGATION[theme]}</Text>
            </Space>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: token.marginSM }}>
              {slots.map((slot) => (
                <div key={slot.key}>
                  <div
                    style={{
                      height: 40,
                      borderRadius: token.borderRadiusSM,
                      border: `1px solid ${token.colorBorderSecondary}`,
                      background: slot.background,
                    }}
                  />
                  <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>{slot.label}</Text>
                </div>
              ))}
            </div>
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
          这里展示产品壳主题的边界、12 套正式颜色槽位、Figma 到 Token 映射和当前主题样张；结构与交互规则仍归导航组件页。
        </Text>
      </div>

      <Alert
        type="info"
        showIcon
        message="12 套产品壳主题已入库"
        description="顶导、侧导、标题栏、页面背景和导航状态色已进入同一套 Navigation Theme。功能色另由 Functional Skin 管理；预览设置可独立切换两条链路。"
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
        <Title level={5}>12 套正式主题规格</Title>
        <Text type="secondary">
          每套产品壳主题必须同时具备七个槽位。氛围层统一复用三层叠层结构，子夜黑是常规主题，不代表暗色模式；功能色按照换肤映射独立维护。
        </Text>
        <div style={{ marginTop: 12 }}>
          <ThemeSpecificationBoard />
        </div>
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
        description="getThemeTopBackground(theme) / getThemeSideBackground(theme) 只读 NavigationTheme。功能色与导航主题是两条独立主题线，可组合验证。"
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
