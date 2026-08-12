import { useState } from "react";
import { Alert, Segmented, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { buildShadow, getColorToken } from "../../design-system/color-utils";
import { useNavigationTheme } from "../../design-system/appearance";
import { getNavigationColorToken, getThemeSideBackground, getThemeTopBackground } from "../../design-system/navigation-color";
import tokens from "../../design-system/tokens.resolved.json";
import {
  PRODUCT_SHELL_SIDE_NAV_COLLAPSED_WIDTH,
  PRODUCT_SHELL_SIDE_NAV_EXPANDED_WIDTH,
  PRODUCT_SHELL_SIDE_NAV_ICON_COLLAPSED_WIDTH,
  ProductShellSideNavigation,
  type ProductShellSideNavigationGroup,
  type ProductShellSideNavigationItem,
  type ProductShellSideNavigationMode,
} from "../../ui/ProductShellSideNavigation";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";
import sideNavigationDesignDoc from "../../design-system/components/composite/side-navigation.design.md?raw";
import sideNavigationDevDoc from "../../design-system/components/composite/side-navigation.md?raw";
import { getPreviewTokens } from "../previewTokens";

const { Text, Title } = Typography;
const u = tokens.unit as Record<string, number>;

const structureRows = [
  { key: "normal", item: "紧凑态", value: `${PRODUCT_SHELL_SIDE_NAV_COLLAPSED_WIDTH}px / ${PRODUCT_SHELL_SIDE_NAV_ICON_COLLAPSED_WIDTH}px`, note: "无图标分组为 30px；带图标侧导为 56px" },
  { key: "icon-normal", item: "单层带图标紧凑态", value: `${PRODUCT_SHELL_SIDE_NAV_ICON_COLLAPSED_WIDTH}px`, note: "项目设置类侧导：保留标题区展开入口与 20px 功能图标" },
  { key: "expanded", item: "展开态", value: `${PRODUCT_SHELL_SIDE_NAV_EXPANDED_WIDTH}px`, note: "未锁定 Overlay 与锁定态都使用固定宽度" },
  { key: "header", item: "一级模块", value: "62px", note: "产品模块名称与锁定 / 收起入口" },
  { key: "group", item: "二级模块", value: "36px / icon 20px", note: "二级虚拟分组带图标；分组之间间距 16px，组内二级与三级间距 4px" },
  { key: "item", item: "三级模块", value: "36px / 无图标", note: "页面入口，左缩进 34px，支持 hover / click / selected" },
  { key: "icon-item", item: "单层带图标功能项", value: "36px / icon 20px", note: "无虚拟父级；展开态文字 + 图标，紧凑态仅图标" },
  { key: "analysis-item", item: "分析专属功能项", value: "36px / icon 20px", note: "虚拟层级和具体分析项都有图标；紧凑态仅展示具体分析项图标" },
];

const behaviorRows = [
  { key: "normal", state: "Normal", trigger: "默认 / 点击收起或离开 Overlay", navigation: "30px / 56px 紧凑态；整区 hover 进入 Overlay", content: "内容面板左侧 D2" },
  { key: "overlay", state: "Overlay", trigger: "鼠标进入紧凑态整区", navigation: "临时展开为 220px，右侧 D4 投影", content: "不变，侧导覆盖内容，不加左投影" },
  { key: "docked", state: "Docked", trigger: "点击锁定入口", navigation: "固定 220px，无自身投影", content: "使用剩余宽度，内容面板左侧 D2" },
];

const tokenRows = [
  { key: "background", element: "整体背景", handle: "getThemeSideBackground() / theme-side-background" },
  { key: "catalog", element: "目录背景", handle: "theme-side-background-hover/click/active" },
  { key: "text", element: "目录文字", handle: "theme-side-text / subText / text-active" },
  { key: "icon", element: "导航图标", handle: "theme-side-icon / subIcon / icon-active" },
  { key: "content-shadow", element: "Normal / Docked 内容面板左侧投影", handle: 'buildShadow("D2", "left")' },
  { key: "overlay-shadow", element: "未锁定 Overlay 右侧投影", handle: 'buildShadow("D4", "right")' },
];

const stateRuleRows = [
  { key: "group", element: "二级带图标模块", defaultState: "二级虚拟分组显示 20px 图标，未选中时使用 theme-side-subText / subIcon", selectedState: "直接三级项选中：父级文字、图标、箭头使用 theme-side-*-active；三级项无图标" },
  { key: "single-level-icon", element: "单层带图标侧导", defaultState: "无分组标题；每个功能项都有 20px 图标；紧凑态宽 56px", selectedState: "选中项使用 theme-side-background-active，文字 / 图标使用 theme-side-*-active" },
  { key: "analysis-icon", element: "分析专属侧导", defaultState: "展开态：虚拟分组和具体分析项均带 20px 图标；收起态只展示具体分析项图标", selectedState: "具体分析项选中后，父级虚拟分组与自身均使用 theme-side-*-active" },
  { key: "shell-toggle", element: "产品壳展开 / 收起", defaultState: "Normal 整区 hover 进入 Overlay；展开图标保留提示与键盘 / 点击入口", selectedState: "Overlay 点击锁定进入 Docked；按钮 hover / 按下使用 theme-side-icon-active；Docked 提示“收起”" },
  { key: "overlay-shadow", element: "侧导航与内容面板投影", defaultState: "Normal / Docked：内容面板使用左向 D2，侧导本身无阴影", selectedState: "Overlay：侧导使用右向 D4，内容面板不加左投影" },
];

const projectSettingItems: ProductShellSideNavigationItem[] = [
  { key: "basic", label: "基本设置", icon: "sbp-setting" },
  { key: "member", label: "成员管理", icon: "sbp-member" },
  { key: "role", label: "角色管理", icon: "sbp-role" },
];

const dataAccessGroups: ProductShellSideNavigationGroup[] = [
  {
    key: "sdi-warehousing",
    label: "埋点数据接入",
    icon: "sdi-warehousing-data-ingestion",
    items: ["数据接入引导", "入库校验规则设置", "实时导入数据查询", "Debug 实时数据查询"],
    defaultExpanded: true,
  },
  {
    key: "sdh-warehousing",
    label: "通用数据接入",
    icon: "sdh-warehousing-general-data-ingestion",
    items: ["数据源管理", "数据表管理", "任务管理"],
    defaultExpanded: true,
  },
  {
    key: "metadata",
    label: "元数据管理",
    icon: "sdh-data-model-user-entity-manage",
    items: ["用户表", "事件表", "明细表"],
    defaultExpanded: false,
  },
  {
    key: "entity-conf",
    label: "实体配置",
    icon: "sdh-entity-conf",
    items: ["实体定义", "实体间关系"],
    defaultExpanded: false,
  },
  {
    key: "data-quality",
    label: "数据质量",
    icon: "sdg-dataquality",
    items: ["埋点数据查询", "数据校验", "用户关联校验"],
    defaultExpanded: false,
  },
];

const longScrollGroups: ProductShellSideNavigationGroup[] = [
  {
    key: "long-data-access",
    label: "埋点数据接入",
    icon: "sdi-warehousing-data-ingestion",
    items: ["数据接入引导", "入库校验规则设置", "实时导入数据查询", "Debug 实时数据查询", "导入任务监控", "异常数据修复"],
    defaultExpanded: true,
  },
  {
    key: "long-general-access",
    label: "通用数据接入",
    icon: "sdh-warehousing-general-data-ingestion",
    items: ["数据源管理", "数据表管理", "字段映射", "接入任务", "同步策略", "任务运行日志"],
    defaultExpanded: true,
  },
  {
    key: "long-metadata",
    label: "元数据管理",
    icon: "sdh-data-model-user-entity-manage",
    items: ["用户表", "事件表", "明细表", "实体表", "属性管理", "枚举管理"],
    defaultExpanded: true,
  },
  {
    key: "long-entity",
    label: "实体配置",
    icon: "sdh-entity-conf",
    items: ["实体定义", "实体关系", "实体权限", "实体同步", "实体任务"],
    defaultExpanded: true,
  },
  {
    key: "long-quality",
    label: "数据质量",
    icon: "sdg-dataquality",
    items: ["埋点数据查询", "数据校验", "用户关联校验", "质量报告", "质量规则", "质量告警"],
    defaultExpanded: true,
  },
];

const analysisGroups: ProductShellSideNavigationGroup[] = [
  {
    key: "behavior-analysis",
    label: "行为分析",
    icon: "sa-behavioranalysis",
    items: [
      { key: "event-analysis", label: "事件分析", icon: "analysis-event", iconVariant: "filled" },
      { key: "retention-analysis", label: "留存分析", icon: "analysis-retention", iconVariant: "filled" },
      { key: "funnel-analysis", label: "漏斗分析", icon: "analysis-funnel", iconVariant: "filled" },
      { key: "distribution-analysis", label: "分布分析", icon: "analysis-distribution", iconVariant: "filled" },
      { key: "ltv-analysis", label: "LTV 分析", icon: "analysis-ltv", iconVariant: "filled" },
      { key: "session-analysis", label: "Session 分析", icon: "analysis-session", iconVariant: "filled" },
      { key: "user-path-analysis", label: "用户路径分析", icon: "analysis-user-path", iconVariant: "filled" },
      { key: "web-heatmap-analysis", label: "网页热力分析", icon: "analysis-web-page-thermal", iconVariant: "filled" },
      { key: "app-click-analysis", label: "APP 点击分析", icon: "analysis-app-click", iconVariant: "filled" },
      { key: "interval-analysis", label: "间隔分析", icon: "analysis-interval", iconVariant: "filled" },
      { key: "attribution-analysis", label: "归因分析", icon: "analysis-attribution", iconVariant: "filled" },
    ],
    defaultExpanded: true,
  },
  {
    key: "user-analysis",
    label: "用户分析",
    icon: "sa-useranalysis",
    items: [
      { key: "portrait-analysis", label: "用户群画像", icon: "portrait-user-group", iconVariant: "filled" },
      { key: "property-analysis", label: "属性分析", icon: "analysis-property", iconVariant: "filled" },
      { key: "user-detail", label: "用户细查", icon: "user-profiling", iconVariant: "filled" },
      { key: "rfm-analysis", label: "RFM", icon: "rfm", iconVariant: "filled" },
    ],
    defaultExpanded: true,
  },
  {
    key: "business-analysis",
    label: "经营分析",
    icon: "sa-businessanalysis",
    items: [
      { key: "custom-query", label: "自定义查询", icon: "query-custom", iconVariant: "filled" },
      { key: "custom-business-analysis", label: "自定义业务分析", icon: "analysis-customize-service", iconVariant: "filled" },
    ],
    defaultExpanded: true,
  },
  {
    key: "other-analysis",
    label: "其他",
    icon: "sa-other",
    items: [
      { key: "bookmark", label: "书签", icon: "bookmark", iconVariant: "filled" },
      { key: "overview", label: "概览", icon: "overview", iconVariant: "filled" },
      { key: "warning-analysis", label: "智能预警分析", icon: "analysis-intelligent-early-warning", iconVariant: "filled" },
    ],
    defaultExpanded: true,
  },
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
  const token = getPreviewTokens();

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
  const token = getPreviewTokens();
  const navigationTheme = useNavigationTheme();
  const [mode, setMode] = useState<ProductShellSideNavigationMode>("normal");
  const [activeItem, setActiveItem] = useState("数据接入引导");
  const [singleLevelMode, setSingleLevelMode] = useState<ProductShellSideNavigationMode>("normal");
  const [singleLevelActiveItem, setSingleLevelActiveItem] = useState("基本设置");
  const [analysisMode, setAnalysisMode] = useState<ProductShellSideNavigationMode>("normal");
  const [analysisActiveItem, setAnalysisActiveItem] = useState("事件分析");
  const [scrollActiveItem, setScrollActiveItem] = useState("实时导入数据查询");
  const canvasWidth = 1280;
  const pageBg = getNavigationColorToken("body-background", navigationTheme);

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Alert
        type="info"
        showIcon
        message="悬停展开，再试锁定"
        description="鼠标进入紧凑态整区会临时 Overlay 展开并带右侧 D4 投影；展开图标保留“展开”提示与键盘 / 点击入口。点右上锁定入口后进入 Docked。预览换肤会驱动顶/侧导背景。"
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
            background: pageBg,
          }}
        >
          <div style={{ height: 82, paddingInline: u["spacing/4x"], display: "flex", alignItems: "center", color: getColorToken("theme-top-text"), background: getThemeTopBackground(navigationTheme) }}>
            <Text strong style={{ color: "inherit" }}>产品壳顶部导航</Text>
          </div>
          <div style={{ position: "relative", display: "flex", minHeight: 500, background: getThemeTopBackground(navigationTheme) }}>
            <ProductShellSideNavigation
              mode={mode}
              onModeChange={setMode}
              productName="数据接入"
              groups={dataAccessGroups}
              activeItem={activeItem}
              onActiveItemChange={setActiveItem}
            />
            <main
              style={{
                flex: 1,
                minWidth: 0,
                padding: u["spacing/6x"],
                background: getColorToken("white"),
                borderTopRightRadius: u["radius/xl"],
                boxShadow: mode === "overlay" ? undefined : buildShadow("D2", "left"),
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
      <section>
        <Title level={5}>单层带图标 / 项目设置</Title>
        <Text type="secondary">只有一层功能项，没有虚拟展开层级；每项均带 20px 侧导图标。</Text>
      </section>
      <Segmented
        value={singleLevelMode}
        onChange={(value) => setSingleLevelMode(value as ProductShellSideNavigationMode)}
        options={[
          { label: "紧凑态", value: "normal" },
          { label: "未锁定展开", value: "overlay" },
          { label: "锁定展开", value: "docked" },
        ]}
      />
      <div style={{ overflowX: "auto", paddingBottom: token.paddingSM }}>
        <div
          style={{
            width: 520,
            minWidth: 520,
            overflow: "hidden",
            border: `${token.lineWidth}px solid ${token.colorBorderSecondary}`,
            borderRadius: u["radius/xl"],
            background: pageBg,
          }}
        >
          <div style={{ position: "relative", display: "flex", minHeight: 300, background: pageBg }}>
            <ProductShellSideNavigation
              mode={singleLevelMode}
              onModeChange={setSingleLevelMode}
              productName="项目设置"
              items={projectSettingItems}
              activeItem={singleLevelActiveItem}
              onActiveItemChange={setSingleLevelActiveItem}
            />
            <main
              style={{
                flex: 1,
                minWidth: 0,
                padding: u["spacing/6x"],
                background: getColorToken("white"),
                borderTopRightRadius: u["radius/xl"],
                boxShadow: singleLevelMode === "overlay" ? undefined : buildShadow("D2", "left"),
                position: "relative",
                zIndex: 1,
              }}
            >
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <div>
                  <Title level={4} style={{ margin: 0 }}>{singleLevelActiveItem}</Title>
                  <Text type="secondary">当前选中：{singleLevelActiveItem}</Text>
                </div>
                <ContentPlaceholder />
              </Space>
            </main>
          </div>
        </div>
      </div>
      <section>
        <Title level={5}>分析专属 / 虚拟层级 + 二级带图标</Title>
        <Text type="secondary">仅用于「分析」大功能：展开态虚拟层级和具体分析项均带图标；紧凑态只展示具体分析项图标。</Text>
      </section>
      <Segmented
        value={analysisMode}
        onChange={(value) => setAnalysisMode(value as ProductShellSideNavigationMode)}
        options={[
          { label: "紧凑态", value: "normal" },
          { label: "未锁定展开", value: "overlay" },
          { label: "锁定展开", value: "docked" },
        ]}
      />
      <div style={{ overflowX: "auto", paddingBottom: token.paddingSM }}>
        <div
          style={{
            width: 640,
            minWidth: 640,
            overflow: "hidden",
            border: `${token.lineWidth}px solid ${token.colorBorderSecondary}`,
            borderRadius: u["radius/xl"],
            background: pageBg,
          }}
        >
          <div style={{ position: "relative", display: "flex", minHeight: 520, background: pageBg }}>
            <ProductShellSideNavigation
              mode={analysisMode}
              onModeChange={setAnalysisMode}
              productName="分析"
              groups={analysisGroups}
              activeItem={analysisActiveItem}
              onActiveItemChange={setAnalysisActiveItem}
            />
            <main
              style={{
                flex: 1,
                minWidth: 0,
                padding: u["spacing/6x"],
                background: getColorToken("white"),
                borderTopRightRadius: u["radius/xl"],
                boxShadow: analysisMode === "overlay" ? undefined : buildShadow("D2", "left"),
                position: "relative",
                zIndex: 1,
              }}
            >
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <div>
                  <Title level={4} style={{ margin: 0 }}>{analysisActiveItem}</Title>
                  <Text type="secondary">当前选中：{analysisActiveItem}</Text>
                </div>
                <ContentPlaceholder />
              </Space>
            </main>
          </div>
        </div>
      </div>
      <section>
        <Title level={5}>固定高度 800px / 长菜单滚动</Title>
        <Text type="secondary">用于验收侧导整体滚动：标题区、分组和三级菜单处于同一个滚动上下文；滚动条不作为可见操作控件。</Text>
      </section>
      <div style={{ overflowX: "auto", paddingBottom: token.paddingSM }}>
        <div
          style={{
            width: 760,
            minWidth: 760,
            height: 800,
            overflow: "hidden",
            border: `${token.lineWidth}px solid ${token.colorBorderSecondary}`,
            borderRadius: u["radius/xl"],
            background: pageBg,
          }}
        >
          <div style={{ position: "relative", display: "flex", height: 800, background: pageBg }}>
            <ProductShellSideNavigation
              mode="docked"
              productName="数据接入"
              groups={longScrollGroups}
              activeItem={scrollActiveItem}
              onActiveItemChange={setScrollActiveItem}
            />
            <main
              style={{
                flex: 1,
                minWidth: 0,
                padding: u["spacing/6x"],
                background: getColorToken("white"),
                borderTopRightRadius: u["radius/xl"],
                boxShadow: buildShadow("D2", "left"),
                position: "relative",
                zIndex: 1,
              }}
            >
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <div>
                  <Title level={4} style={{ margin: 0 }}>{scrollActiveItem}</Title>
                  <Text type="secondary">固定 800px 高度；请在左侧侧导区域滚轮向下滚动。</Text>
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
      <Alert type="info" showIcon message="旧无图标分组仅兼容保留" description="后续默认样张以单层带图标、二级带图标 / 三级无图标、分析专属三类为准；旧无图标分组不作为默认录入场景。" />
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
