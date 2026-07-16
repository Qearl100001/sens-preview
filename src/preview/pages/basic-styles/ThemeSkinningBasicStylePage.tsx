import { Alert, Space, Table, Tag, Typography, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useOutletContext } from "react-router-dom";
import { getColorToken } from "../../../design-system/color-utils";
import type { FunctionalSkin } from "../../../design-system/functional-skin";
import { getFunctionalColors } from "../../../design-system/functional-skin";
import { getThemeTopBackground } from "../../../design-system/navigation-color";
import themeSkinningDocSource from "../../../../docs/foundations/theme-skinning.md?raw";
import { BasicStylePageLayout } from "./BasicStylePageLayout";

const { Text, Title } = Typography;

interface PreviewOutletContext {
  skin: FunctionalSkin;
}

type ThemeTrack = "Navigation Theme" | "Functional Color Theme";
type ThemeStatus = "已拆分" | "部分 ready" | "绿肤 ready" | "待补矩阵" | "默认不参与";

const THEME_MODEL_ROWS = [
  {
    key: "navigation",
    track: "Navigation Theme",
    scope: "顶部导航、侧边导航、标题栏、页面背景、产品壳菜单",
    config: "独立选择",
    example: "导航可以是绿色、蓝色或黄色，不要求跟随功能色",
    owner: "Navigation Color",
    status: "绿肤 ready",
  },
  {
    key: "functional",
    track: "Functional Color Theme",
    scope: "主操作、选中态、开关、标签、功能性 hover / active",
    config: "独立选择",
    example: "功能色可以自由选择一套配置，如绿色导航 + 蓝色功能色",
    owner: "Color / Functional Color",
    status: "部分 ready",
  },
] satisfies Array<{
  key: string;
  track: ThemeTrack;
  scope: string;
  config: string;
  example: string;
  owner: string;
  status: ThemeStatus;
}>;

const DECISION_ROWS = [
  {
    key: "nav",
    condition: "使用 Navigation Theme",
    result: "参与换肤",
    example: "Top Navigation、Side Navigation、Title Bar、Page Background",
    note: "走 navigation-color.md，不混入 component-*",
  },
  {
    key: "functional",
    condition: "使用 Functional Color Theme",
    result: "参与换肤",
    example: "Button 主按钮、选中背景、Switch、Tag",
    note: "功能色可以独立选择一套配置",
  },
  {
    key: "neutral",
    condition: "只使用中性色",
    result: "默认不参与",
    example: "普通文本、边框、卡片、表格背景",
    note: "除非另行定义主题语义 token",
  },
  {
    key: "status",
    condition: "使用状态色",
    result: "待确认",
    example: "成功、提醒、警告、错误",
    note: "当前默认不跟随功能色主题变化",
  },
  {
    key: "business",
    condition: "业务自定义色",
    result: "默认不参与",
    example: "业务标识色、图表色、活动色",
    note: "不自动进入设计系统换肤",
  },
];

const COMPONENT_MAPPING_ROWS = [
  {
    key: "top-navigation",
    component: "Top Navigation",
    theme: "Navigation Theme",
    token: "getThemeTopBackground() / theme-top-*",
    status: "部分 ready",
    next: "后续蓝、黄等导航主题按同一组槽位补齐",
  },
  {
    key: "button",
    component: "Button 主按钮",
    theme: "Functional Color Theme",
    token: "component-primary / component-hover / component-active",
    status: "部分 ready",
    next: "补完整功能色配置矩阵和组件验收表",
  },
  {
    key: "link",
    component: "Link / 表格操作",
    theme: "Functional Color Theme",
    token: "link-color / link-hover-color / link-active-color",
    status: "待补矩阵",
    next: "确认链接色是否作为功能色主题配置的一部分",
  },
  {
    key: "switch",
    component: "Switch",
    theme: "Functional Color Theme",
    token: "背景/开关/*",
    status: "待补矩阵",
    next: "从色彩文档抽取开关功能色 token",
  },
  {
    key: "tag",
    component: "Tag",
    theme: "Functional Color Theme",
    token: "背景/标签/*",
    status: "待补矩阵",
    next: "区分叠加标签和彩色标签",
  },
  {
    key: "table",
    component: "Table 普通容器",
    theme: "不参与",
    token: "text-* / outline-* / background-*",
    status: "默认不参与",
    next: "只做中性色规范，不接入换肤",
  },
];

type MappingReady = "Ready" | "Half Ready" | "Missing" | "To Confirm";

const FUNCTIONAL_COLOR_MAPPING_ROWS = [
  {
    key: "primary",
    group: "功能色 · 主操作",
    figma: "01_默认 @component-primary",
    semantic: "主色默认",
    token: "component-primary → colorPrimary；getFunctionalColors().primary",
    skinning: "是",
    ready: "Ready",
    note: "蓝肤暂走基础色板/冰绽蓝/10，无第二套语义 handle",
  },
  {
    key: "hover",
    group: "功能色 · 主操作",
    figma: "02_悬停 @component-hover",
    semantic: "主色 hover",
    token: "component-hover → colorPrimaryHover",
    skinning: "是",
    ready: "Ready",
    note: "同上",
  },
  {
    key: "active",
    group: "功能色 · 主操作",
    figma: "03_点击 @component-active",
    semantic: "主色 active",
    token: "component-active → colorPrimaryActive",
    skinning: "是",
    ready: "Ready",
    note: "Figma 换肤表曾见 #008C64，代码为 #008C65",
  },
  {
    key: "disable",
    group: "功能色 · 主操作",
    figma: "04_禁用 @component-disable",
    semantic: "主色 disable",
    token: "component-disable；antd 未完整映射",
    skinning: "是",
    ready: "Half Ready",
    note: "组件侧是否统一用该 handle",
  },
  {
    key: "disable-hover",
    group: "功能色 · 主操作",
    figma: "05_禁用悬停 @component-disable-hover",
    semantic: "主色 disable hover",
    token: "component-disable-hover；getFunctionalColors 未收录",
    skinning: "是",
    ready: "Half Ready",
    note: "是否纳入 Functional ColorSet",
  },
  {
    key: "active-bg",
    group: "功能色 · 选中 / 投影 / 浅底",
    figma: "06_选中背景默认 @component-active-background",
    semantic: "选中底",
    token: "component-active-background",
    skinning: "是",
    ready: "Ready",
    note: "绿肤源是实色 hex；蓝肤是否对齐同结构",
  },
  {
    key: "active-bg-hover",
    group: "功能色 · 选中 / 投影 / 浅底",
    figma: "07_选中背景悬停 @component-active-hover-background",
    semantic: "选中 hover 底",
    token: "component-active-hover-background",
    skinning: "是",
    ready: "Ready",
    note: "同上",
  },
  {
    key: "active-bg-click",
    group: "功能色 · 选中 / 投影 / 浅底",
    figma: "08_选中背景点击 @component-active-click-background",
    semantic: "选中 click 底",
    token: "component-active-click-background",
    skinning: "是",
    ready: "Ready",
    note: "同上",
  },
  {
    key: "active-shadow",
    group: "功能色 · 选中 / 投影 / 浅底",
    figma: "09_点击投影 @component-active-shadow",
    semantic: "active ring 源色",
    token: "component-active-shadow + buildActiveRingShadow / tokenRgba",
    skinning: "是",
    ready: "Half Ready",
    note: "resolved 只存 hex，α 在 helper；ColorSet 未收录",
  },
  {
    key: "light-bg",
    group: "功能色 · 选中 / 投影 / 浅底",
    figma: "10_浅色背景 @component-light-background",
    semantic: "浅功能底",
    token: "component-light-background",
    skinning: "是",
    ready: "Half Ready",
    note: "getFunctionalColors 未收录；antd 无直接映射",
  },
  {
    key: "link",
    group: "状态色/链接",
    figma: "01_默认 @link-color",
    semantic: "链接默认",
    token: "link-color → colorLink / colorInfo",
    skinning: "To Confirm",
    ready: "Ready",
    note: "先列入功能色表；确认前不要自动换肤",
  },
  {
    key: "link-hover",
    group: "状态色/链接",
    figma: "02_悬停 @link-hover-color",
    semantic: "链接 hover",
    token: "link-hover-color → colorLinkHover",
    skinning: "To Confirm",
    ready: "Ready",
    note: "同上",
  },
  {
    key: "link-active",
    group: "状态色/链接",
    figma: "03_点击 @link-active-color",
    semantic: "链接 active",
    token: "link-active-color → colorLinkActive",
    skinning: "To Confirm",
    ready: "Ready",
    note: "同上",
  },
  {
    key: "link-light-bg",
    group: "状态色/链接",
    figma: "04_浅色背景 @link-light-background",
    semantic: "链接浅底",
    token: "link-light-background",
    skinning: "To Confirm",
    ready: "Ready",
    note: "组件消费面少",
  },
  {
    key: "link-light-outline",
    group: "状态色/链接",
    figma: "05_浅色描边 @link-light-outline",
    semantic: "链接浅描边",
    token: "link-light-outline",
    skinning: "To Confirm",
    ready: "Ready",
    note: "同上",
  },
  {
    key: "switch-off",
    group: "定制色/开关",
    figma: "01–05_关闭* @switch-background*",
    semantic: "关态背景 5 档",
    token: "switch-background / -hover / -active / -disable / -disable-hover",
    skinning: "To Confirm",
    ready: "Half Ready",
    note: "疑似透明 α 丢失；关态是否算中性",
  },
  {
    key: "switch-on",
    group: "定制色/开关",
    figma: "开·默认 / hover / active（推导）",
    semantic: "开态功能色",
    token: "无独立 handle；常复用 component-primary 链",
    skinning: "是",
    ready: "Missing",
    note: "是否新增 switch-on-*，还是绑主操作色",
  },
  {
    key: "tag-default",
    group: "定制色/标签",
    figma: "叠加标签/背景/01 @tag-default-background",
    semantic: "叠加标签底",
    token: "tag-default-background",
    skinning: "To Confirm",
    ready: "Half Ready",
    note: "偏中性深色；是否算 Functional",
  },
  {
    key: "tag-color",
    group: "定制色/标签",
    figma: "各色系 背景/文字&图标（无 @handle）",
    semantic: "彩色标签",
    token: "仅 colorByPath",
    skinning: "To Confirm",
    ready: "Missing",
    note: "固定色板还是跟随功能色；beta 现用山水蓝 path",
  },
  {
    key: "tooltip",
    group: "定制色/便签",
    figma: "背景/01 @tooltip-background",
    semantic: "便签 / Tooltip 底",
    token: "tooltip-background",
    skinning: "默认否 / To Confirm",
    ready: "Ready",
    note: "命名是 tooltip，是否=便签；是否永不换肤",
  },
  {
    key: "status-success",
    group: "状态色",
    figma: "成功 / 提醒 / 警告",
    semantic: "状态反馈",
    token: "success-color / info-color / warning-color 等",
    skinning: "否（默认）",
    ready: "To Confirm",
    note: "默认不跟随功能色；错误是否单独 handle",
  },
] satisfies Array<{
  key: string;
  group: string;
  figma: string;
  semantic: string;
  token: string;
  skinning: string;
  ready: MappingReady;
  note: string;
}>;

const MAPPING_SUMMARY_ROWS = [
  {
    key: "ready",
    status: "Ready",
    items: "主操作 01–03；选中背景 06–08；链接 5 档 handle；便签 tooltip-background；多数状态色 handle",
  },
  {
    key: "half",
    status: "Half Ready",
    items: "disable 链；点击投影；浅色背景；开关关态；叠加标签；getFunctionalColors 不完整",
  },
  {
    key: "missing",
    status: "Missing",
    items: "开关开态独立 token；彩色标签语义 handle；第二套功能色主题完整语义层",
  },
  {
    key: "confirm",
    status: "To Confirm",
    items: "链接是否换肤；状态色；开关关态；彩色标签 / 便签；#008C64 vs #008C65",
  },
];

const GAP_ROWS = [
  {
    key: "functional-matrix",
    item: "Functional Color Token Mapping",
    current: "§12 映射表已落库；To Confirm 项待设计收口",
    action: "确认链接 / 开关开态 / 标签 / 便签后再扩展 ColorSet",
    priority: "高",
  },
  {
    key: "nav-matrix",
    item: "Navigation Theme 完整矩阵",
    current: "顶导航已有 helper 方向，侧导航 / 标题栏仍不完整",
    action: "继续补 Navigation Color 映射表与渐变 helper",
    priority: "高",
  },
  {
    key: "component-map",
    item: "组件换肤映射表",
    current: "只有局部判断，尚未覆盖所有组件",
    action: "按组件逐步标注使用哪一套主题",
    priority: "高",
  },
  {
    key: "status-color",
    item: "状态色是否跟随换肤",
    current: "当前默认不跟随功能色主题",
    action: "后续单独确认成功 / 提醒 / 警告是否需要主题化",
    priority: "中",
  },
];

function statusColor(value: string): string {
  if (value === "Ready" || value.includes("ready") || value === "已拆分") return "success";
  if (value === "Half Ready" || value.includes("部分")) return "processing";
  if (value === "Missing" || value.includes("待补")) return "error";
  if (value === "To Confirm" || value.includes("待") || value.includes("To Confirm")) return "warning";
  if (value.includes("默认") || value === "否（默认）") return "default";
  return "default";
}

function ThemeModelTable() {
  const columns: ColumnsType<(typeof THEME_MODEL_ROWS)[number]> = [
    { title: "主题线", dataIndex: "track", key: "track", width: 180, fixed: "left" },
    { title: "控制范围", dataIndex: "scope", key: "scope", width: 300 },
    { title: "配置方式", dataIndex: "config", key: "config", width: 120 },
    { title: "组合示例", dataIndex: "example", key: "example", width: 320 },
    { title: "归属文档", dataIndex: "owner", key: "owner", width: 180 },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (value: ThemeStatus) => <Tag color={statusColor(value)}>{value}</Tag>,
    },
  ];

  return <Table columns={columns} dataSource={THEME_MODEL_ROWS} pagination={false} size="small" scroll={{ x: 1220 }} />;
}

function DecisionTable() {
  const columns: ColumnsType<(typeof DECISION_ROWS)[number]> = [
    { title: "判断条件", dataIndex: "condition", key: "condition", width: 200 },
    {
      title: "结论",
      dataIndex: "result",
      key: "result",
      width: 120,
      render: (value: string) => <Tag color={value === "参与换肤" ? "success" : value === "待确认" ? "warning" : "default"}>{value}</Tag>,
    },
    { title: "例子", dataIndex: "example", key: "example", width: 300 },
    { title: "说明", dataIndex: "note", key: "note", width: 320 },
  ];

  return <Table columns={columns} dataSource={DECISION_ROWS} pagination={false} size="small" scroll={{ x: 940 }} />;
}

function ComponentMappingTable() {
  const columns: ColumnsType<(typeof COMPONENT_MAPPING_ROWS)[number]> = [
    { title: "组件 / 区域", dataIndex: "component", key: "component", width: 180, fixed: "left" },
    { title: "主题线", dataIndex: "theme", key: "theme", width: 180 },
    { title: "token / helper 方向", dataIndex: "token", key: "token", width: 300 },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (value: ThemeStatus) => <Tag color={statusColor(value)}>{value}</Tag>,
    },
    { title: "下一步", dataIndex: "next", key: "next", width: 320 },
  ];

  return (
    <Table
      columns={columns}
      dataSource={COMPONENT_MAPPING_ROWS}
      pagination={false}
      size="small"
      scroll={{ x: 1100 }}
    />
  );
}

function GapTable() {
  const columns: ColumnsType<(typeof GAP_ROWS)[number]> = [
    { title: "缺口", dataIndex: "item", key: "item", width: 220 },
    { title: "当前状态", dataIndex: "current", key: "current", width: 320 },
    { title: "建议动作", dataIndex: "action", key: "action", width: 320 },
    {
      title: "优先级",
      dataIndex: "priority",
      key: "priority",
      width: 100,
      render: (value: string) => <Tag color={value === "高" ? "error" : "warning"}>{value}</Tag>,
    },
  ];

  return <Table columns={columns} dataSource={GAP_ROWS} pagination={false} size="small" scroll={{ x: 960 }} />;
}

function FunctionalColorMappingTable() {
  const columns: ColumnsType<(typeof FUNCTIONAL_COLOR_MAPPING_ROWS)[number]> = [
    { title: "Figma 分组", dataIndex: "group", key: "group", width: 160, fixed: "left" },
    { title: "Figma 名称", dataIndex: "figma", key: "figma", width: 280 },
    { title: "语义", dataIndex: "semantic", key: "semantic", width: 140 },
    { title: "当前 token / helper", dataIndex: "token", key: "token", width: 320 },
    {
      title: "参与功能色换肤",
      dataIndex: "skinning",
      key: "skinning",
      width: 140,
      render: (value: string) => <Tag color={statusColor(value)}>{value}</Tag>,
    },
    {
      title: "ready",
      dataIndex: "ready",
      key: "ready",
      width: 120,
      render: (value: MappingReady) => <Tag color={statusColor(value)}>{value}</Tag>,
    },
    { title: "待确认项", dataIndex: "note", key: "note", width: 280 },
  ];

  return (
    <Table
      columns={columns}
      dataSource={FUNCTIONAL_COLOR_MAPPING_ROWS}
      pagination={false}
      size="small"
      scroll={{ x: 1440 }}
    />
  );
}

function MappingSummaryTable() {
  const columns: ColumnsType<(typeof MAPPING_SUMMARY_ROWS)[number]> = [
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (value: string) => <Tag color={statusColor(value)}>{value}</Tag>,
    },
    { title: "条目", dataIndex: "items", key: "items" },
  ];

  return <Table columns={columns} dataSource={MAPPING_SUMMARY_ROWS} pagination={false} size="small" />;
}

function ThemeCombinationSpecimen() {
  const { token } = theme.useToken();
  const functionalGreen = getFunctionalColors("green");
  const functionalBlue = getFunctionalColors("blue");
  const combinations = [
    {
      key: "green-green",
      title: "组合 A",
      nav: "绿色导航主题",
      func: "绿色功能色",
      navBg: getThemeTopBackground("green"),
      funcColor: functionalGreen.primary,
    },
    {
      key: "green-blue",
      title: "组合 B",
      nav: "绿色导航主题",
      func: "蓝色功能色",
      navBg: getThemeTopBackground("green"),
      funcColor: functionalBlue.primary,
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: token.marginMD,
      }}
    >
      {combinations.map((item) => (
        <div
          key={item.key}
          style={{
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: token.borderRadiusLG,
            background: token.colorBgContainer,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: 56,
              padding: token.paddingMD,
              background: item.navBg,
              color: getColorToken("theme-top-text-active"),
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontWeight: token.fontWeightStrong,
            }}
          >
            <span>{item.nav}</span>
            <span>Nav</span>
          </div>
          <div style={{ padding: token.paddingMD }}>
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              <Text strong>{item.title}</Text>
              <Text type="secondary">{item.func}</Text>
              <div
                style={{
                  height: 36,
                  borderRadius: token.borderRadius,
                  background: item.funcColor,
                  color: token.colorWhite,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: token.fontWeightStrong,
                }}
              >
                功能操作
              </div>
            </Space>
          </div>
        </div>
      ))}
    </div>
  );
}

function CurrentFunctionalSkinCard() {
  const { token } = theme.useToken();
  const { skin } = useOutletContext<PreviewOutletContext>();
  const functional = getFunctionalColors(skin);

  return (
    <div
      style={{
        padding: token.paddingMD,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        background: token.colorBgContainer,
      }}
    >
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <Text type="secondary">当前顶部切换器只切功能色，不切导航主题</Text>
        <Space wrap>
          <Tag color="processing">Functional Skin: {skin}</Tag>
          <Text code>{functional.primary}</Text>
        </Space>
        <div
          style={{
            height: 40,
            borderRadius: token.borderRadius,
            background: functional.primary,
            color: token.colorWhite,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: token.fontWeightStrong,
          }}
        >
          当前功能色预览
        </div>
      </Space>
    </div>
  );
}

function ThemeSkinningSpecimen() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginTop: 0 }}>
          Theme / Skinning 换肤模型
        </Title>
        <Text type="secondary">
          本页用于说明换肤不是单一主题色，而是 Navigation Theme 与 Functional Color Theme 两套独立配置。
        </Text>
      </div>

      <Alert
        type="info"
        showIcon
        message="核心规则：导航换肤和功能色换肤分开"
        description="导航可以是黄色、绿色或蓝色；功能色可以独立选择一套配置。组件是否参与换肤，取决于它是否使用导航主题色或功能色。"
      />

      <section>
        <Title level={5}>两套独立主题线</Title>
        <ThemeModelTable />
      </section>

      <section>
        <Title level={5}>独立组合示例</Title>
        <ThemeCombinationSpecimen />
      </section>

      <CurrentFunctionalSkinCard />

      <section>
        <Title level={5}>组件是否参与换肤的判断</Title>
        <DecisionTable />
      </section>

      <section>
        <Title level={5}>Functional Color Token Mapping</Title>
        <Text type="secondary" style={{ display: "block", marginBottom: 12 }}>
          只列映射与缺口，不改 tokens.resolved.json / theme.ts，不实现换肤。链接先列入表，换肤列标 To Confirm。
        </Text>
        <FunctionalColorMappingTable />
      </section>

      <section>
        <Title level={5}>映射汇总</Title>
        <MappingSummaryTable />
      </section>

      <section>
        <Title level={5}>组件换肤映射草表</Title>
        <ComponentMappingTable />
      </section>

      <section>
        <Title level={5}>当前待补</Title>
        <GapTable />
      </section>
    </Space>
  );
}

export default function ThemeSkinningBasicStylePage() {
  return (
    <BasicStylePageLayout
      title="Theme / Skinning 换肤规则"
      description="定义导航主题与功能色主题的独立关系，并给出组件是否参与换肤的判断口径。"
      designDocSource={themeSkinningDocSource}
      specimen={<ThemeSkinningSpecimen />}
    />
  );
}
