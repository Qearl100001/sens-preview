import { useState } from "react";
import { Alert, Card, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { getColorToken } from "../../design-system/color-utils";
import { useNavigationTheme } from "../../design-system/appearance";
import {
  getNavigationColorToken,
  getThemePageBackground,
} from "../../design-system/navigation-color";
import { getTypographyToken } from "../../design-system/typography";
import {
  FunctionEntryMenuPanel,
  SensTopNavigation,
  FUNCTION_MENU_FLAT_SHORT,
  FUNCTION_MENU_FLAT_WRAP,
  FUNCTION_MENU_NINE_GRID,
  FUNCTION_MENU_TWO_LEVEL,
  type FunctionMenuSection,
} from "../../ui";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";
import { getPreviewTokens } from "../previewTokens";

const { Text, Title } = Typography;

const topNavigationDesignDoc = `
# 顶部导航 Top Navigation

> 顶部导航是产品壳专属组件，不等同于普通 \`Dropdown / Menu\`，也不等同于 Navigation Color 本身。

## 1. 定位

- 顶部导航负责产品壳的主导航结构、层级、状态和收纳规则。
- 颜色不在本组件页重复定义，统一归 \`Navigation Color\`。
- 圆角、阴影、间距等基础视觉能力继续引用 foundation token。

## 2. 结构

- 顶部导航实际结构：\`82px\`
- 上导航：\`36px\`，承载 logo、项目名切换（无胶囊）、工具 icon、账号名 + 角色 pill
- 下导航：\`46px\`，承载功能入口（仅九宫格 + 分割线）、主导航项、更多
- 主导航项字号 \`font-size/l\` / \`line-height/l\`；选中 \`font-weight/semibold\`，默认 \`regular\`
- 项目名 \`font-size/m\` / \`line-height/m\`；账号名 \`font-size/l\` · semibold；角色 \`font-size/s\` / \`line-height/s\`
- 下导项间距：\`1280\` → \`spacing/2x\`，\`1440+\` → \`spacing/4x\`
- 上/下导航水平 padding：\`spacing/4x\`；Logo↔项目 gap \`spacing/6x\`；工具 icon gap \`spacing/4x\`
- 顶导氛围层：设计稿需要时延展至 \`180px\`，只作为背景层，不推移正文
- 侧导与右侧内容面板从顶部 \`82px\` 开始叠在氛围层上；Overlay 侧导才临时覆盖内容面板

## 3. 组件拆分

- \`TopNavigation\`
- \`FunctionEntry\`
- \`NavItem\`
- \`ProjectSwitcher\`
- \`UtilityIconButton\`
- \`AccountRole\`
- \`ProductShellDropdown\`
- \`ProductSwitchPanel\`
- \`UserMenu\`

## 4. 响应式

- 顶导宽度始终跟随容器 / 浏览器拉伸，不以 \`1280px\` 画布锁死，组件内不做横向滚动。
- 上导航：左簇（Logo + 项目）与右簇（工具 + 账号）最小间距 \`spacing/4x\`（16）；到该间距后不再继续变窄（内容量宽为下限）。
- 下导航：「更多」永远最右；空间不足时从右往左将主导航收入「更多」。

## 5. 下拉边界

- 主导航下拉、产品切换、个人中心都属于产品壳专属浮层。
- 这些浮层和通用下拉菜单在颜色、结构、层级上不同，不应直接视为同一个组件。
- 但它们的圆角、投影、描边等基础视觉能力可以复用 foundation token。

## 6. 与 Navigation Color 的关系

- 顶导航背景、文字 / 图标、分割线、菜单线、功能入口菜单、项目菜单颜色统一归 \`Navigation Color\`。
- 导航图标的形状归 \`Icon / navigation\` 分类；颜色由顶部导航场景传入 Navigation Color token。
- 导航渐变是一种导航效果，可以进入 \`Navigation Color helper\`，但不代表所有导航都必须使用渐变。
- 九宫格功能入口默认使用 \`theme-top-text\`；右上工具图标三态（默认透明 / 悬停 / 选中）使用 \`theme-top-icon-*\` 背景；点击跳转功能页。
- 主导航选中使用 \`theme-top-text-active\` 的白色底部短线，不使用整项背景；带选择器时短线只位于文字下方。
- 项目切换、九宫格功能入口、账号角色和带下拉的主导航项是产品壳浮层；主浮层悬停即展开，离开触发器与浮层约 120ms 后收起，预览页可点击验证选中状态，但不承接真实业务跳转。
`;

const topNavigationDevDoc = `
# 开发约束

## 1. 承载边界

- 结构和状态归 \`TopNavigation\` 组件。
- 颜色与换肤归 \`Navigation Color\`。
- 圆角、投影、基础尺寸引用 foundation token 或 helper。

## 2. 当前口径

- 颜色不要回退到普通 \`component-* / text-* / link-*\` 语义，除非映射已确认。
- 下拉不是直接复用通用 \`Dropdown\` 规范，而是产品壳专属浮层体系。
- 顶导流体宽：无 \`1280\` minWidth、无组件内横向滚动；上栏左右簇最小间距 \`spacing/4x\`。
- 「更多」永远贴右；窄时从右往左收纳主导航进「更多」L1。

## 3. helper 使用

- 顶导航基础背景和氛围叠层分别通过 \`getThemeTopBackground()\`、\`getThemeTopAtmosphere()\` 承接。
- helper 表达的是“导航效果可复用的承载方式”，不是强制每个导航都用同一套渐变。
- 设计稿需要时由 \`atmosphere\` 显式开启氛围层；实际导航高度仍是 \`82px\`，页面正文不能因为 \`180px\` 视觉底板而下推。
- 侧导航 / 标题栏 / 页面背景仍继续由 \`Navigation Color\` 统一映射。
- 导航图标使用 \`SensIcon\` 注册图标，SVG 必须是 \`currentColor\`，调用处按场景传 \`theme-top-text*\` 或 \`theme-top-funcMenu-icon*\`。
- 产品壳主浮层同时只允许打开一个；悬停对应入口切换，选择菜单项或悬停其他业务入口后关闭当前业务浮层。

## 4. 当前不做的事

- 不在这页接入真实项目、账号或路由数据。
- 不在这页把所有导航色重新复制一遍。
- 顶导专属结构常量（角色 pill 12/3、两层列间距 7）不升 foundation；见状态矩阵「当前确认结论」。
`;

const structureRows = [
  { key: "container", item: "顶部导航实际结构", value: "82px", owner: "TopNavigation", source: "组件结构常量" },
  { key: "atmosphere", item: "顶导氛围底板", value: "180px", owner: "TopNavigation + Layout", source: "设计需要时显式开启，不占正文流" },
  { key: "workspace", item: "侧导 / 内容面板起点", value: "顶部 82px", owner: "Layout", source: "叠在顶导氛围层上" },
  { key: "top", item: "上导航", value: "36px", owner: "TopNavigation", source: "组件结构常量" },
  { key: "bottom", item: "下导航", value: "46px", owner: "TopNavigation", source: "组件结构常量" },
  { key: "upper-gap", item: "上栏左簇↔右簇最小间距", value: "16", owner: "TopNavigation", source: "spacing/4x；到此后 shellMinWidth 不再缩" },
  { key: "entry", item: "功能入口热区", value: "32 × 32", owner: "TopNavigation", source: "组件结构常量" },
  { key: "utility", item: "工具图标热区", value: "28 × 28", owner: "TopNavigation", source: "icon 18 + pad 5；Figma 14505" },
  {
    key: "func-menu-col",
    item: "两层单条 / 列间距",
    value: "193 / 7",
    owner: "FunctionEntryMenu",
    source: "Figma 226:30007；7 仅顶导结构常量，不升 foundation",
  },
  { key: "nav-item", item: "导航项高度", value: "40px", owner: "TopNavigation", source: "组件结构常量" },
  { key: "project-panel", item: "项目切换面板", value: "maxHeight 296", owner: "ProjectSwitcher", source: "产品壳浮层结构常量；列表可滚 + 隐形滚动条" },
  { key: "project-option", item: "项目切换选项", value: "262 × 36px", owner: "ProjectSwitcher", source: "超长省略 37:8320；截断出 SensTips" },
  { key: "role-pill", item: "角色 pill 圆角 / 竖直 pad", value: "12 / 3", owner: "TopNavigation", source: "仅顶导结构常量，不升 foundation" },
  { key: "fade", item: "页面过渡层", value: "98px", owner: "Navigation Color helper", source: "导航效果" },
];

const stateRows = [
  { key: "nav", name: "NavItem", variants: "默认 / 悬停 / 选中；选择器 True / False", note: "选中只显示文字下方的白色短线，不使用整项背景" },
  {
    key: "utility",
    name: "UtilityIconButton",
    variants: "默认 / 悬停 / 选中（14505:36662 / 37060 / 37068）",
    note: "热区 28×28；悬停 Tips（bottom）+ theme-top-icon-hover；仅平台/资源/审批可持久选中；点击跳转功能页",
  },
  { key: "dropdown", name: "DropdownItem", variants: "默认 / 悬停 / 点击 / 选中", note: "产品壳专属浮层项" },
  {
    key: "project",
    name: "ProjectSwitcher",
    variants: "关闭 / 打开 / 项目选中 / 超长省略",
    note: "列表隐形滚动 + 底遮罩；超长单行省略，截断悬停 SensTips 全文",
  },
  { key: "account", name: "AccountRole", variants: "关闭 / 悬停打开 / 菜单项悬停", note: "悬停账号角色胶囊打开预览账号菜单；角色 pill 圆角 12 / padY 3" },
  {
    key: "more",
    name: "更多",
    variants: "1～3 层级联 / 选中回填 / 按可用宽收纳",
    note: "距右 spacing/4x；最多 3 层（左展、顶对齐）；trailing 面性 right；叶子回填；从右往左收入 L1",
  },
  {
    key: "function-menu",
    name: "NavDropdown / FunctionEntryMenu",
    variants: "九宫格 最近浏览/热销产品（64:9830）/ 分析两层 / 智能运营单层自适应 / 单层>6 折列",
    note: "九宫格可带 SensTag hot/new；单层≤6 宽自适应；两层单条 193、列间距 7；默认与触发文字左对齐，溢出则与箭头右对齐",
  },
];

const tokenRows = [
  { key: "bg", item: "顶导航背景与氛围层", bucket: "Navigation Color", handle: "getThemeTopBackground() / getThemeTopAtmosphere()", note: "基础渐变与氛围叠层分开换肤" },
  { key: "nav-icon-shape", item: "导航图标形状", bucket: "Icon", handle: "Icon / navigation / nav-*；面性 filled/right", note: "右上工具、九宫格、展开箭头；更多/账号 trailing 用面性 right" },
  { key: "text", item: "顶导航文字 / 工具图标 / 箭头", bucket: "Navigation Color", handle: "theme-top-text*", note: "默认 80%，hover / 选中 100%" },
  { key: "function-entry", item: "功能入口九宫格 / 工具图标状态", bucket: "Navigation Color", handle: "theme-top-text* + theme-top-icon-*", note: "默认透明；hover / 选中使用黑色透明背景" },
  { key: "func-menu", item: "功能入口 / 主导航下拉菜单色", bucket: "Navigation Color", handle: "theme-top-funcMenu-text* / background-*", note: "白底菜单正文、悬停/选中底与字色" },
  { key: "func-icon", item: "功能入口菜单内图标", bucket: "Navigation Color", handle: "theme-top-funcMenu-icon*", note: "白底功能入口菜单中的默认 / hover / 选中图标色" },
  { key: "pro-menu", item: "项目切换菜单文字 / 底", bucket: "Navigation Color", handle: "theme-top-proMenu-*", note: "项目列表项默认 / 悬停 / 选中" },
  { key: "divider", item: "横线 / 竖线", bucket: "Navigation Color", handle: "theme-top-line-*", note: "黑色透明度线条；功能入口分区竖线用 light" },
  { key: "menu-line", item: "项目菜单描边 / 分割线", bucket: "Navigation Color", handle: "theme-top-menuLine-*", note: "项目菜单选中描边和分组分隔线，不用于顶导短线" },
  { key: "nav-selection", item: "主导航选中短线", bucket: "Navigation Color", handle: "theme-top-text-active", note: "白色 16 × 3 短线，带选择器时仅位于文字下方" },
  { key: "type", item: "字号 / 字重 / 行高", bucket: "Foundation", handle: "font-size|line-height|font-weight /*", note: "下导 l；项目名 m；账号 l·semibold；角色 s；菜单项 m" },
  { key: "spacing", item: "间距", bucket: "Foundation", handle: "spacing/1x|2x|3x|4x|5x|6x 等", note: "水平 pad 4x；Logo↔项目 6x；工具 4x；下导项 2x/4x；上栏簇间距下限 4x" },
  { key: "radius", item: "下拉圆角", bucket: "Foundation", handle: "radius/m", note: "面板与菜单项圆角复用基础 token" },
  { key: "shadow", item: "下拉投影", bucket: "Foundation", handle: "buildShadowD4() / D4↓", note: "浮层投影不在导航颜色里单独定义" },
  { key: "tag", item: "功能入口彩色标签", bucket: "Tag 组件", handle: "SensTag multicolor small", note: "hot→旭日红 / new→冰绽蓝；定制色标签，不进 Navigation Color" },
  { key: "tips", item: "工具悬停 / 项目超长提示", bucket: "Tips 组件", handle: "SensTips", note: "工具 bottom；项目截断 top；不自建 tip" },
];

const decisionRows = [
  { key: "independent", item: "顶部导航是否独立组件", value: "是", detail: "归入组件分组，不再当成基础样式口子" },
  { key: "nav-color", item: "第二套颜色 token 放哪里", value: "Navigation Color", detail: "颜色、换肤、helper 在导航颜色页收口" },
  {
    key: "fluid-width",
    item: "顶导宽度策略",
    value: "流体宽 + 上栏 16 下限",
    detail: "跟随浏览器拉伸；左项目↔右工具簇最小 spacing/4x；组件内无横向滚动",
  },
  {
    key: "more-threshold",
    item: "更多收纳",
    value: "永远贴右 / 按可用宽收纳",
    detail: "空间不足时从右往左收入「更多」L1，不设固定断点 px",
  },
  { key: "dropdown", item: "下拉菜单归属", value: "产品壳专属", detail: "样式和颜色独立，但圆角投影继续吃 foundation token" },
  { key: "gradient", item: "导航渐变 helper", value: "进入 Navigation Color", detail: "基础背景与氛围叠层分别沉淀，但不强制所有导航都使用渐变" },
  {
    key: "struct-const",
    item: "顶导结构常量是否升 foundation",
    value: "否",
    detail: "角色 pill 圆角 12 / padY 3、两层列间距 7、单条宽 193：仅顶导消费，不新增 radius/12 或 spacing/7 档",
  },
];

function StructureTable() {
  const columns: ColumnsType<(typeof structureRows)[number]> = [
    { title: "结构项", dataIndex: "item", key: "item", width: 160 },
    { title: "值", dataIndex: "value", key: "value", width: 120 },
    { title: "归属", dataIndex: "owner", key: "owner", width: 180 },
    { title: "承载方式", dataIndex: "source", key: "source" },
  ];

  return <Table size="small" pagination={false} rowKey="key" dataSource={structureRows} columns={columns} />;
}

function StateTable() {
  const columns: ColumnsType<(typeof stateRows)[number]> = [
    { title: "组件", dataIndex: "name", key: "name", width: 160 },
    { title: "状态 / 变体", dataIndex: "variants", key: "variants" },
    { title: "说明", dataIndex: "note", key: "note", width: 240 },
  ];

  return <Table size="small" pagination={false} rowKey="key" dataSource={stateRows} columns={columns} />;
}

function TokenTable() {
  const columns: ColumnsType<(typeof tokenRows)[number]> = [
    {
      title: "归属",
      dataIndex: "bucket",
      key: "bucket",
      width: 150,
      render: (value: string) => {
        const color =
          value === "Navigation Color"
            ? "green"
            : value === "Foundation"
              ? "blue"
              : value === "Icon"
                ? "geekblue"
                : value.includes("组件")
                  ? "purple"
                  : "default";
        return <Tag color={color}>{value}</Tag>;
      },
    },
    { title: "项目", dataIndex: "item", key: "item", width: 160 },
    { title: "token / helper", dataIndex: "handle", key: "handle", width: 220 },
    { title: "说明", dataIndex: "note", key: "note" },
  ];

  return <Table size="small" pagination={false} rowKey="key" dataSource={tokenRows} columns={columns} />;
}

function DecisionTable() {
  const columns: ColumnsType<(typeof decisionRows)[number]> = [
    { title: "决策项", dataIndex: "item", key: "item", width: 180 },
    {
      title: "当前结论",
      dataIndex: "value",
      key: "value",
      width: 150,
      render: (value: string) => (
        <Tag
          color={
            value === "是" ? "success" : value === "否" ? "default" : value.includes("待") ? "warning" : "processing"
          }
        >
          {value}
        </Tag>
      ),
    },
    { title: "说明", dataIndex: "detail", key: "detail" },
  ];

  return <Table size="small" pagination={false} rowKey="key" dataSource={decisionRows} columns={columns} />;
}

function MetricCard({ label, value, note }: { label: string; value: string; note: string }) {
  const token = getPreviewTokens();

  return (
    <Card
      size="small"
      style={{ height: "100%" }}
      styles={{
        body: {
          display: "flex",
          flexDirection: "column",
          gap: token.marginXS,
          minHeight: 124,
        },
      }}
    >
      <Text type="secondary">{label}</Text>
      <Title level={3} style={{ margin: 0 }}>
        {value}
      </Title>
      <Text type="secondary">{note}</Text>
    </Card>
  );
}

function TopNavigationDemo() {
  const token = getPreviewTokens();
  const navigationTheme = useNavigationTheme();
  const pageBackground = getThemePageBackground(navigationTheme);
  const [lastUtilityNavLabel, setLastUtilityNavLabel] = useState<string | null>(null);

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Alert
        type="info"
        showIcon
        message="这页看组件壳层，颜色去 Navigation Color"
        description="顶部导航组件只收结构、状态、收纳和浮层边界；颜色与换肤不在这里重复定义。"
      />

      <SensTopNavigation onUtilityNavigate={(item) => setLastUtilityNavLabel(item.label)} />

      <div
        style={{
          minHeight: 128,
          padding: "22px 24px",
          background: pageBackground,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 16,
        }}
      >
        <div
          data-utility-nav-destination
          style={{
            color: token.colorTextSecondary,
            fontSize: getTypographyToken("font-size/m"),
            lineHeight: `${getTypographyToken("line-height/m")}px`,
          }}
        >
          {lastUtilityNavLabel
            ? `已跳转功能页：${lastUtilityNavLabel}（演示；业务侧由 onUtilityNavigate 承接真实路由；仅平台/资源/审批可持久选中）`
            : "悬停左侧九宫格打开功能入口菜单；右上工具：悬停 Tips / 点击跳转"}
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          {["页面标题区", "筛选条件", "核心指标卡片"].map((item) => (
            <div
              key={item}
              style={{
                width: item === "页面标题区" ? 260 : 180,
                height: item === "页面标题区" ? 48 : 72,
                borderRadius: token.borderRadiusLG,
                background: getColorToken("white"),
                border: `1px solid ${token.colorBorderSecondary}`,
                padding: 14,
                color: token.colorTextSecondary,
                whiteSpace: "nowrap",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <Alert
        type="success"
        showIcon
        message="顶导流体宽：跟随浏览器拉伸"
        description="顶导不再锁 1280 画布、组件内无横向滚动。「更多」永远贴右；上栏左项目与右工具簇最小间距 16px，到达后不再继续变窄；下导空间不足时从右往左收入「更多」。"
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: token.marginMD,
        }}
      >
        <MetricCard label="宽度策略" value="流体宽" note="跟随容器拉伸；下限=左簇+16+右簇+左右 padding。" />
        <MetricCard label="组件分组" value="独立组件" note="放到组件导航，不再放到基础样式口子里。" />
        <MetricCard label="更多菜单" value="永远贴右" note="按可用宽度从右往左收纳主导航，不设固定断点。" />
        <MetricCard label="导航颜色" value="独立承载" note="颜色、换肤、helper 在 Navigation Color 收口。" />
      </div>
    </Space>
  );
}

function FunctionEntryMenuMatrix() {
  const navigationTheme = useNavigationTheme();
  const textColor = getColorToken("theme-top-funcMenu-text");
  const activeText = getNavigationColorToken("theme-top-funcMenu-text-active", navigationTheme);
  const hoverBg = getNavigationColorToken("theme-top-funcMenu-background-hover", navigationTheme);
  const activeBg = getNavigationColorToken("theme-top-funcMenu-background-active", navigationTheme);
  const dividerColor = getColorToken("theme-top-line-light");
  const demos: { key: string; title: string; sections: FunctionMenuSection[]; selected: string }[] = [
    {
      key: "nine-grid",
      title: "九宫格：最近浏览 / 热销产品 + 标签（64:9830）",
      sections: FUNCTION_MENU_NINE_GRID,
      selected: "事件分析",
    },
    {
      key: "grouped",
      title: "两层：二级分区 + 三级折列（226:29938）",
      sections: FUNCTION_MENU_TWO_LEVEL,
      selected: "事件分析",
    },
    {
      key: "flat-short",
      title: "单层 ≤6 自适应宽（3:773 / 226:30041）",
      sections: FUNCTION_MENU_FLAT_SHORT,
      selected: "运营计划",
    },
    {
      key: "flat-wrap",
      title: "单层 >6 自动折列（226:29988）",
      sections: FUNCTION_MENU_FLAT_WRAP,
      selected: "事件分析",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {demos.map((demo) => (
        <div key={demo.key} data-function-entry-matrix={demo.key}>
          <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
            {demo.title}
          </Text>
          <FunctionEntryMenuPanel
            sections={demo.sections}
            selectedLabel={demo.selected}
            textColor={textColor}
            hoverText={activeText}
            activeText={activeText}
            hoverBg={hoverBg}
            activeBg={activeBg}
            dividerColor={dividerColor}
          />
        </div>
      ))}
    </div>
  );
}

function TopNavigationMatrix() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginTop: 0 }}>
          功能入口菜单三态
        </Title>
        <FunctionEntryMenuMatrix />
      </div>

      <div>
        <Title level={5} style={{ marginTop: 0 }}>
          结构常量
        </Title>
        <StructureTable />
      </div>

      <div>
        <Title level={5} style={{ marginTop: 0 }}>
          状态矩阵
        </Title>
        <StateTable />
      </div>

      <div>
        <Title level={5} style={{ marginTop: 0 }}>
          token / helper 归属
        </Title>
        <TokenTable />
      </div>

      <div>
        <Title level={5} style={{ marginTop: 0 }}>
          当前确认结论
        </Title>
        <DecisionTable />
      </div>
    </Space>
  );
}

export default function TopNavigationShowcasePage() {
  return (
    <ComponentShowcaseLayout
      title="顶部导航 Top Navigation"
      demo={<TopNavigationDemo />}
      matrix={<TopNavigationMatrix />}
      designDocSource={topNavigationDesignDoc}
      devDocSource={topNavigationDevDoc}
    />
  );
}
