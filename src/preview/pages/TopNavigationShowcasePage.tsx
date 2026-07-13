import { Alert, Card, Space, Table, Tag, Typography, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useOutletContext } from "react-router-dom";
import type { FunctionalSkin } from "../../design-system/functional-skin";
import { getColorToken, tokenRgba, buildShadowD4 } from "../../design-system/color-utils";
import { SensIcon, type IconName } from "../../design-system/icons";
import { getThemeTopBackground } from "../../design-system/navigation-color";
import tokens from "../../design-system/tokens.resolved.json";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";

const { Text, Title } = Typography;

const u = tokens.unit as Record<string, number>;

const topNavigationDesignDoc = `
# 顶部导航 Top Navigation

> 顶部导航是产品壳专属组件，不等同于普通 \`Dropdown / Menu\`，也不等同于 Navigation Color 本身。

## 1. 定位

- 顶部导航负责产品壳的主导航结构、层级、状态和收纳规则。
- 颜色不在本组件页重复定义，统一归 \`Navigation Color\`。
- 圆角、阴影、间距等基础视觉能力继续引用 foundation token。

## 2. 结构

- 顶部导航容器：\`180px\`
- 上导航：\`36px\`，承载 logo、项目切换、工具 icon、账号角色
- 下导航：\`46px\`，承载功能入口、主导航项、更多
- 页面过渡层：导航效果的一部分，可使用 \`Navigation Color helper\` 承接

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

- \`1280px\` 是电脑端最小使用宽度。
- 小于 \`1280px\` 时，当前策略不是继续压缩，而是横向滚动。
- “更多”不是固定断点规则，是否收纳取决于产品需求，当前只记录为待产品定义。

## 5. 下拉边界

- 主导航下拉、产品切换、个人中心都属于产品壳专属浮层。
- 这些浮层和通用下拉菜单在颜色、结构、层级上不同，不应直接视为同一个组件。
- 但它们的圆角、投影、描边等基础视觉能力可以复用 foundation token。

## 6. 与 Navigation Color 的关系

- 顶导航背景、文字 / 图标、分割线、菜单线、功能入口菜单、项目菜单颜色统一归 \`Navigation Color\`。
- 导航图标的形状归 \`Icon / navigation\` 分类；颜色由顶部导航场景传入 Navigation Color token。
- 导航渐变是一种导航效果，可以进入 \`Navigation Color helper\`，但不代表所有导航都必须使用渐变。
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
- 小于 \`1280px\` 时走横向滚动，不在本轮补新的自适应压缩规则。
- “更多”收纳阈值暂无固定规则，组件实现时应保留按产品需求配置的空间。

## 3. helper 使用

- 顶导航渐变优先通过 \`getThemeTopBackground()\` 这类 helper 承接。
- helper 表达的是“导航效果可复用的承载方式”，不是强制每个导航都用同一套渐变。
- 侧导航 / 标题栏 / 页面背景仍继续由 \`Navigation Color\` 统一映射。
- 导航图标使用 \`SensIcon\` 注册图标，SVG 必须是 \`currentColor\`，调用处按场景传 \`theme-top-text*\` 或 \`theme-top-funcMenu-icon*\`。

## 4. 当前不做的事

- 不在这页承诺完整产品壳实现。
- 不在这页确定“更多”的最终业务策略。
- 不在这页把所有导航色重新复制一遍。
`;

const structureRows = [
  { key: "container", item: "顶部导航容器", value: "180px", owner: "TopNavigation", source: "组件结构常量" },
  { key: "top", item: "上导航", value: "36px", owner: "TopNavigation", source: "组件结构常量" },
  { key: "bottom", item: "下导航", value: "46px", owner: "TopNavigation", source: "组件结构常量" },
  { key: "entry", item: "功能入口热区", value: "32 × 32", owner: "TopNavigation", source: "组件结构常量" },
  { key: "nav-item", item: "导航项高度", value: "40px", owner: "TopNavigation", source: "组件结构常量" },
  { key: "fade", item: "页面过渡层", value: "98px", owner: "Navigation Color helper", source: "导航效果" },
];

const stateRows = [
  { key: "nav", name: "NavItem", variants: "默认 / 悬停 / 选中；选择器 True / False", note: "主导航项基础变体" },
  { key: "dropdown", name: "DropdownItem", variants: "默认 / 悬停 / 点击 / 选中", note: "产品壳专属浮层项" },
  { key: "project", name: "ProjectSwitcher", variants: "多项目默认 / 多项目悬停 / 单项目默认", note: "项目入口独立规则" },
  { key: "account", name: "AccountRole", variants: "默认 / 悬停", note: "账号角色胶囊" },
  { key: "more", name: "更多", variants: "当前不写固定阈值", note: "等待产品需求定义收纳策略" },
];

const tokenRows = [
  { key: "bg", item: "顶导航背景", bucket: "Navigation Color", handle: "getThemeTopBackground()", note: "导航效果 helper，可随换肤变化" },
  { key: "nav-icon-shape", item: "导航图标形状", bucket: "Icon", handle: "Icon / navigation / nav-*", note: "右上角工具、产品切换、展开箭头" },
  { key: "text", item: "顶导航文字 / 工具图标 / 箭头", bucket: "Navigation Color", handle: "theme-top-text*", note: "默认 80%，hover / 选中 100%" },
  { key: "func-icon", item: "功能入口菜单图标", bucket: "Navigation Color", handle: "theme-top-funcMenu-icon*", note: "产品切换 / 功能入口图标颜色" },
  { key: "divider", item: "横线 / 竖线", bucket: "Navigation Color", handle: "theme-top-line-*", note: "黑色透明度线条" },
  { key: "menu-line", item: "菜单线", bucket: "Navigation Color", handle: "theme-top-menuLine-*", note: "选中与分组分隔线" },
  { key: "radius", item: "下拉圆角", bucket: "Foundation", handle: "radius/m", note: "面板圆角继续复用基础 token" },
  { key: "shadow", item: "下拉投影", bucket: "Foundation", handle: "buildShadow(D4) / popup shadow", note: "浮层投影不在导航颜色里单独定义" },
];

const decisionRows = [
  { key: "independent", item: "顶部导航是否独立组件", value: "是", detail: "归入组件分组，不再当成基础样式口子" },
  { key: "nav-color", item: "第二套颜色 token 放哪里", value: "Navigation Color", detail: "颜色、换肤、helper 在导航颜色页收口" },
  { key: "min-width", item: "1280 以下策略", value: "横向滚动", detail: "1280px 是电脑端最小宽度，不再继续压缩" },
  { key: "more-threshold", item: "更多菜单阈值", value: "待产品定义", detail: "当前不沉淀固定断点" },
  { key: "dropdown", item: "下拉菜单归属", value: "产品壳专属", detail: "样式和颜色独立，但圆角投影继续吃 foundation token" },
  { key: "gradient", item: "导航渐变 helper", value: "进入 Navigation Color", detail: "作为导航效果沉淀，但不强制所有导航都使用渐变" },
];

type PreviewOutletContext = {
  skin: FunctionalSkin;
};

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
      render: (value: string) => <Tag color={value === "Navigation Color" ? "green" : "blue"}>{value}</Tag>,
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
      render: (value: string) => <Tag color={value === "是" ? "success" : value.includes("待") ? "warning" : "processing"}>{value}</Tag>,
    },
    { title: "说明", dataIndex: "detail", key: "detail" },
  ];

  return <Table size="small" pagination={false} rowKey="key" dataSource={decisionRows} columns={columns} />;
}

function MetricCard({ label, value, note }: { label: string; value: string; note: string }) {
  const { token } = theme.useToken();

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

function NavigationIcon({
  name,
  label,
  color,
  size = 16,
}: {
  name: IconName;
  label: string;
  color: string;
  size?: number;
}) {
  return (
    <span
      role="img"
      aria-label={label}
      style={{
        width: size,
        height: size,
        display: "block",
        flexShrink: 0,
      }}
    >
      <SensIcon name={name} size={size} color={color} style={{ display: "block" }} />
    </span>
  );
}

function TopNavigationShellSpecimen() {
  const { token } = theme.useToken();
  const { skin } = useOutletContext<PreviewOutletContext>();
  const navRadius = u["radius/xl"] ?? token.borderRadius;
  const topText = tokenRgba("theme-top-text", 0.8);
  const panelText = tokenRgba("theme-top-funcMenu-text", 0.9);
  const panelStroke = tokenRgba("theme-top-line-dack", 0.08);
  const panelDivider = tokenRgba("theme-top-line-dack", 0.06);
  const activeBg = tokenRgba("theme-top-funcMenu-background-active", 0.12);
  const activeText = getColorToken("theme-top-funcMenu-text-active");
  const topIconColor = topText;
  const funcMenuIconColor = getColorToken("theme-top-funcMenu-icon");

  const canvasWidth = 1280;
  const navItems = [
    { label: "首页", active: false },
    { label: "数据看板", active: true },
    { label: "营销活动", active: false, arrow: true },
    { label: "人群资产", active: false },
    { label: "内容管理", active: false, arrow: true },
    { label: "自动化流程", active: false },
    { label: "投放分析", active: false },
    { label: "项目设置", active: false, arrow: true },
    { label: "更多", active: false, arrow: true },
  ];

  const utilityItems: Array<{ label: string; icon: IconName; nodeId: string }> = [
    { label: "帮助中心", icon: "nav-helpcenter", nodeId: "803:199" },
    { label: "通知", icon: "nav-notice", nodeId: "803:174" },
    { label: "平台", icon: "nav-platform", nodeId: "803:177" },
    { label: "资源管理", icon: "nav-workload-manager", nodeId: "4934:15929" },
    { label: "审批", icon: "nav-examine", nodeId: "4934:15931" },
    { label: "语言", icon: "nav-language", nodeId: "7576:28035" },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Alert
        type="info"
        showIcon
        message="这页看组件壳层，颜色去 Navigation Color"
        description="顶部导航组件只收结构、状态、收纳和浮层边界；颜色与换肤不在这里重复定义。"
      />

      <div
        data-top-navigation-scroll
        style={{
          width: "100%",
          overflowX: "auto",
          overflowY: "hidden",
          paddingBottom: token.paddingSM,
        }}
      >
        <div
          data-top-navigation-canvas
          style={{
            width: canvasWidth,
            minWidth: canvasWidth,
            borderRadius: navRadius,
            overflow: "hidden",
            background: getColorToken("white"),
            boxShadow: buildShadowD4(),
            border: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <div
            style={{
              position: "relative",
              height: 180,
              padding: 0,
              background: getThemeTopBackground(skin),
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: [
                  `radial-gradient(circle at 18% 62%, ${tokenRgba("white", 0.14)} 0, transparent 34%)`,
                  `radial-gradient(circle at 82% -8%, ${tokenRgba("white", 0.12)} 0, transparent 42%)`,
                  `linear-gradient(180deg, transparent 0%, ${tokenRgba("theme-top-line-dack", 0.12)} 100%)`,
                ].join(", "),
                pointerEvents: "none",
              }}
            />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div
                data-top-navigation-upper
                style={{
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 24px",
                  borderBottom: `1px solid ${panelDivider}`,
                  whiteSpace: "nowrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 20, minWidth: 0, flexShrink: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 76,
                        height: 20,
                        borderRadius: token.borderRadiusSM,
                        background: tokenRgba("white", 0.18),
                        color: getColorToken("white"),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: 0.5,
                        flexShrink: 0,
                      }}
                    >
                      SENS
                    </div>
                    <Text style={{ color: topText, whiteSpace: "nowrap" }}>零售增长项目</Text>
                  </div>

                  <div
                    style={{
                      height: 24,
                      padding: "0 10px",
                      borderRadius: token.borderRadius,
                      background: tokenRgba("white", 0.1),
                      color: topText,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      flexShrink: 0,
                    }}
                  >
                    <span>项目切换</span>
                    <NavigationIcon name="nav-down" label="展开项目切换" color={topIconColor} />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    flexShrink: 0,
                  }}
                >
                  {utilityItems.map((item) => (
                    <div
                      key={item.label}
                      title={item.label}
                      aria-label={item.label}
                      data-figma-node-id={item.nodeId}
                      style={{
                        width: 16,
                        height: 16,
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <NavigationIcon name={item.icon} label={item.label} color={topIconColor} />
                    </div>
                  ))}
                  <div style={{ width: 1, height: 16, background: panelStroke, flexShrink: 0 }} />
                  <div
                    style={{
                      height: 28,
                      padding: "0 12px",
                      borderRadius: 999,
                      background: tokenRgba("theme-top-role-background", 0.14),
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ color: topText, fontWeight: 600, whiteSpace: "nowrap" }}>卓越</div>
                    <div style={{ color: topText, fontSize: 12, whiteSpace: "nowrap" }}>分析师</div>
                  </div>
                </div>
              </div>

              <div
                data-top-navigation-lower
                style={{
                  height: 46,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 24px",
                  gap: 18,
                  whiteSpace: "nowrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: token.borderRadius,
                      background: tokenRgba("theme-top-line-dack", 0.1),
                      display: "grid",
                      placeItems: "center",
                      color: getColorToken("white"),
                      fontSize: 12,
                      flexShrink: 0,
                    }}
                  >
                    <NavigationIcon name="nav-product-navigation" label="产品导航" color={funcMenuIconColor} />
                  </div>
                  <div style={{ color: topText, fontWeight: 600, whiteSpace: "nowrap" }}>功能入口</div>
                  <div style={{ width: 1, height: 16, background: panelStroke, marginLeft: 6, flexShrink: 0 }} />
                </div>

                <div
                  data-top-navigation-items
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "nowrap",
                    overflow: "visible",
                    minWidth: 0,
                  }}
                >
                  {navItems.map((item) => (
                    <div
                      key={item.label}
                      style={{
                        height: 40,
                        padding: "0 16px",
                        borderRadius: token.borderRadius,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        color: item.active ? getColorToken("white") : topText,
                        background: item.active ? tokenRgba("white", 0.08) : "transparent",
                        border: item.active ? `1px solid ${tokenRgba("white", 0.08)}` : "1px solid transparent",
                        fontWeight: item.active ? 600 : 400,
                        flexShrink: 0,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>
                      {item.arrow ? (
                        <NavigationIcon
                          name="nav-down"
                          label={`${item.label} 展开`}
                          color={item.active ? getColorToken("theme-top-text-active") : topIconColor}
                        />
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: 98,
                background: `linear-gradient(180deg, ${tokenRgba("theme-title-background", 0)} 0%, ${getColorToken("theme-title-background")} 100%)`,
              }}
            />

            <div
              style={{
                position: "absolute",
                top: 78,
                left: 286,
                width: 260,
                padding: 10,
                borderRadius: token.borderRadius,
                background: getColorToken("white"),
                boxShadow: buildShadowD4(),
                border: `1px solid ${tokenRgba("theme-top-line-dack", 0.04)}`,
                zIndex: 2,
              }}
            >
              <div
                style={{
                  height: 36,
                  borderRadius: token.borderRadius,
                  background: activeBg,
                  color: activeText,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 12px",
                  fontWeight: 600,
                  marginBottom: 4,
                  whiteSpace: "nowrap",
                }}
              >
                营销活动总览
              </div>
              {["活动计划", "优惠券配置", "触达流程"].map((item) => (
                <div
                  key={item}
                  style={{
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 12px",
                    color: panelText,
                    whiteSpace: "nowrap",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              height: 128,
              padding: "22px 24px",
              background: getColorToken("theme-title-background"),
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
            }}
          >
            {["页面标题区", "筛选条件", "核心指标卡片"].map((item) => (
              <div
                key={item}
                style={{
                  width: item === "页面标题区" ? 260 : 180,
                  height: item === "页面标题区" ? 48 : 72,
                  borderRadius: navRadius,
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
      </div>

      <Alert
        type="success"
        showIcon
        message="样板间已按 1280px 画布承载"
        description="这个预览区域现在模拟电脑端最小宽度。外层容器不足 1280px 时，应该横向滚动查看，而不是压缩导航项或让文字换行。"
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: token.marginMD,
        }}
      >
        <MetricCard label="最小电脑宽度" value="1280px" note="小于 1280px 当前走横向滚动，不继续压缩。" />
        <MetricCard label="组件分组" value="独立组件" note="放到组件导航，不再放到基础样式口子里。" />
        <MetricCard label="更多菜单" value="待需求定义" note="现在先记录，不写固定收纳阈值。" />
        <MetricCard label="导航颜色" value="独立承载" note="颜色、换肤、helper 在 Navigation Color 收口。" />
      </div>
    </Space>
  );
}

function TopNavigationDemo() {
  return <TopNavigationShellSpecimen />;
}

function TopNavigationMatrix() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
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
