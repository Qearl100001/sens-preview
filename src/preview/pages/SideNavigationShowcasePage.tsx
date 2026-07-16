import { useState } from "react";
import { Alert, Segmented, Space, Table, Tag, Typography, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import { buildShadow, getColorToken } from "../../design-system/color-utils";
import { getThemeSideBackground, getThemeTopBackground } from "../../design-system/navigation-color";
import tokens from "../../design-system/tokens.resolved.json";
import {
  PRODUCT_SHELL_SIDE_NAV_COLLAPSED_WIDTH,
  PRODUCT_SHELL_SIDE_NAV_EXPANDED_WIDTH,
  ProductShellSideNavigation,
  type ProductShellSideNavigationMode,
} from "../../ui/ProductShellSideNavigation";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";
import sideNavigationDesignDoc from "../../design-system/components/composite/side-navigation.design.md?raw";
import sideNavigationDevDoc from "../../design-system/components/composite/side-navigation.md?raw";

const { Text, Title } = Typography;
const u = tokens.unit as Record<string, number>;

const structureRows = [
  { key: "normal", item: "紧凑态", value: `${PRODUCT_SHELL_SIDE_NAV_COLLAPSED_WIDTH}px`, note: "产品壳默认态，显示展开图标，不随页面宽度伸缩" },
  { key: "expanded", item: "展开态", value: `${PRODUCT_SHELL_SIDE_NAV_EXPANDED_WIDTH}px`, note: "未锁定 Overlay 与锁定态都使用固定宽度" },
  { key: "header", item: "一级模块", value: "62px", note: "产品模块名称与锁定 / 收起入口" },
  { key: "group", item: "二级模块", value: "30px", note: "分组开关，支持多个同时展开" },
  { key: "item", item: "三级模块", value: "36px", note: "页面入口，支持 hover / click / selected" },
];

const behaviorRows = [
  { key: "normal", state: "Normal", trigger: "默认 / 点击收起", navigation: "30px 紧凑态；仅图标 hover 显示“展开”", content: "内容面板左侧 D4" },
  { key: "overlay", state: "Overlay", trigger: "点击紧凑态展开图标", navigation: "临时展开为 220px，右侧 D4 投影", content: "不变，侧导覆盖内容，不加左投影" },
  { key: "docked", state: "Docked", trigger: "点击锁定入口", navigation: "固定 220px，无自身投影", content: "使用剩余宽度，内容面板左侧 D4" },
];

const tokenRows = [
  { key: "background", element: "整体背景", handle: "getThemeSideBackground() / theme-side-background" },
  { key: "catalog", element: "目录背景", handle: "theme-side-background-hover/click/active" },
  { key: "text", element: "目录文字", handle: "theme-side-text / subText / text-active" },
  { key: "icon", element: "导航图标", handle: "theme-side-icon / subIcon / icon-active" },
  { key: "content-shadow", element: "Normal / Docked 内容面板左侧投影", handle: 'buildShadow("D4", "left")' },
  { key: "overlay-shadow", element: "未锁定 Overlay 右侧投影", handle: 'buildShadow("D4", "right")' },
];

const stateRuleRows = [
  { key: "group", element: "二级模块 / 更多推荐", defaultState: "仅展开或收起：文字与图标保持中性", selectedState: "直接三级项选中：文字、箭头与链接图标使用 theme-side-*-active" },
  { key: "shell-toggle", element: "产品壳展开 / 收起", defaultState: "Normal 整区 hover 不展开；图标 hover 显示“展开”", selectedState: "点击图标进入 Overlay；按钮 hover / 按下使用 theme-side-icon-active；Docked 提示“收起”" },
  { key: "overlay-shadow", element: "侧导航与内容面板投影", defaultState: "Normal / Docked：内容面板使用左向 D4，侧导本身无阴影", selectedState: "Overlay：侧导使用右向 D4，内容面板不加左投影" },
];

const structureColumns: ColumnsType<(typeof structureRows)[number]> = [
  { title: "结构项", dataIndex: "item", key: "item", width: 150 },
  { title: "规格", dataIndex: "value", key: "value", width: 120, render: (value: string) => <Tag>{value}</Tag> },
  { title: "说明", dataIndex: "note", key: "note" },
];

const behaviorColumns: ColumnsType<(typeof behaviorRows)[number]> = [
  { title: "状态", dataIndex: "state", key: "state", width: 110, render: (value: string) => <Tag color={value === "Docked" ? "processing" : value === "Overlay" ? "success" : "default"}>{value}</Tag> },
  { title: "触发", dataIndex: "trigger", key: "trigger", width: 160 },
  { title: "侧导", dataIndex: "navigation", key: "navigation", width: 180 },
  { title: "内容区", dataIndex: "content", key: "content" },
];

const tokenColumns: ColumnsType<(typeof tokenRows)[number]> = [
  { title: "元素", dataIndex: "element", key: "element", width: 160 },
  { title: "Token / Helper", dataIndex: "handle", key: "handle" },
];

const stateRuleColumns: ColumnsType<(typeof stateRuleRows)[number]> = [
  { title: "元素", dataIndex: "element", key: "element", width: 190 },
  { title: "非选中状态", dataIndex: "defaultState", key: "defaultState", width: 280 },
  { title: "选中 / 交互状态", dataIndex: "selectedState", key: "selectedState" },
];

function ContentPlaceholder() {
  const { token } = theme.useToken();

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: token.marginMD }}>
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          style={{
            minHeight: token.controlHeightLG * 3,
            border: `${token.lineWidth}px solid ${token.colorBorderSecondary}`,
            borderRadius: token.borderRadiusLG,
            background: index < 2 ? token.colorFillQuaternary : token.colorBgContainer,
          }}
        />
      ))}
    </div>
  );
}

function SideNavigationDemo() {
  const { token } = theme.useToken();
  const [mode, setMode] = useState<ProductShellSideNavigationMode>("normal");
  const [activeItem, setActiveItem] = useState("数据源管理");
  const canvasWidth = 1280;

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Alert
        type="info"
        showIcon
        message="先点展开，再试锁定"
        description="紧凑态整区悬停不会展开；悬停展开图标会显示“展开”，点击后临时 Overlay 展开并带右侧 D4 投影。点右上锁定入口后进入 Docked。"
      />
      <Segmented
        value={mode}
        onChange={(value) => setMode(value as ProductShellSideNavigationMode)}
        options={[
          { label: "紧凑态", value: "normal" },
          { label: "未锁定展开", value: "overlay" },
          { label: "锁定展开", value: "docked" },
        ]}
      />
      <div style={{ overflowX: "auto", paddingBottom: token.paddingSM }}>
        <div
          style={{
            width: canvasWidth,
            minWidth: canvasWidth,
            overflow: "hidden",
            border: `${token.lineWidth}px solid ${token.colorBorderSecondary}`,
            borderRadius: u["radius/xl"],
            background: getColorToken("body-background"),
          }}
        >
          <div style={{ height: 82, paddingInline: u["spacing/4x"], display: "flex", alignItems: "center", color: getColorToken("theme-top-text"), background: getThemeTopBackground() }}>
            <Text strong style={{ color: "inherit" }}>产品壳顶部导航</Text>
          </div>
          <div style={{ position: "relative", display: "flex", minHeight: 500, background: getColorToken("body-background") }}>
            <ProductShellSideNavigation mode={mode} onModeChange={setMode} activeItem={activeItem} onActiveItemChange={setActiveItem} />
            <main
              style={{
                flex: 1,
                minWidth: 0,
                padding: u["spacing/6x"],
                background: getColorToken("white"),
                borderTopRightRadius: u["radius/xl"],
                boxShadow: mode === "overlay" ? undefined : buildShadow("D4", "left"),
                position: "relative",
                zIndex: 1,
              }}
            >
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <div>
                  <Title level={4} style={{ margin: 0 }}>{activeItem}</Title>
                  <Text type="secondary">当前选中：{activeItem}</Text>
                </div>
                <ContentPlaceholder />
              </Space>
            </main>
          </div>
        </div>
      </div>
    </Space>
  );
}

function SideNavigationMatrix() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <section>
        <Title level={5}>结构规格</Title>
        <Table size="small" pagination={false} dataSource={structureRows} columns={structureColumns} />
      </section>
      <section>
        <Title level={5}>行为状态</Title>
        <Table size="small" pagination={false} dataSource={behaviorRows} columns={behaviorColumns} />
      </section>
      <section>
        <Title level={5}>导航主题颜色映射</Title>
        <Table size="small" pagination={false} dataSource={tokenRows} columns={tokenColumns} />
      </section>
      <section>
        <Title level={5}>选中与展开规则</Title>
        <Table size="small" pagination={false} dataSource={stateRuleRows} columns={stateRuleColumns} />
      </section>
      <Alert type="warning" showIcon message="这不是页面内目录组件" description="锚点、目录、筛选栏等 Context Side Panel 可使用 Reflow，但不会自动复用产品壳侧导的 30 / 220px 尺寸与 theme-side-* 颜色。" />
    </Space>
  );
}

export default function SideNavigationShowcasePage() {
  return (
    <ComponentShowcaseLayout
      title="侧边导航"
      demo={<SideNavigationDemo />}
      matrix={<SideNavigationMatrix />}
      designDocSource={sideNavigationDesignDoc}
      devDocSource={sideNavigationDevDoc}
    />
  );
}
