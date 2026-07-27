import { useState } from "react";
import { Alert, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import layoutDocSource from "../../../../docs/foundations/layout.md?raw";
import { buildShadow, getColorToken, tokenRgba } from "../../../design-system/color-utils";
import { getDividerColor, getDividerHairlineWidth } from "../../../design-system/divider";
import { getThemeTopBackground } from "../../../design-system/navigation-color";
import { getTypographyToken } from "../../../design-system/typography";
import { getUnitToken } from "../../../design-system/unit";
import { BasicStylePageLayout } from "./BasicStylePageLayout";

const { Text, Title } = Typography;

// Fixed expanded width from the product side-navigation Figma and current shell implementation.
const PRODUCT_SIDER_EXPANDED_WIDTH = 220;
const px = (value: number) => `${value}px`;

const layoutTokens = {
  cardPadding: getUnitToken("spacing/4x"),
  sectionGap: getUnitToken("spacing/6x"),
  contentGap: getUnitToken("spacing/2x"),
  contentBlockPadding: getUnitToken("spacing/vertical/4x"),
  contentInlinePadding: getUnitToken("spacing/horizontal/6x"),
  compactGap: getUnitToken("spacing/1x"),
  demoHeight: getUnitToken("spacing/10x") * 5,
  chromeHeight: getUnitToken("spacing/10x"),
  radius: getUnitToken("radius/l"),
  innerRadius: getUnitToken("radius/m"),
  titleSize: getTypographyToken("font-size/m"),
  titleLine: getTypographyToken("line-height/m"),
  titleWeight: getTypographyToken("font-weight/medium"),
  bodySize: getTypographyToken("font-size/m"),
  bodyLine: getTypographyToken("line-height/m"),
  captionSize: getTypographyToken("font-size/s"),
  captionLine: getTypographyToken("line-height/s"),
  dividerWidth: getDividerHairlineWidth(),
} as const;

const layoutColors = {
  page: getColorToken("background-grey"),
  surface: getColorToken("white"),
  fill: tokenRgba("background-transparent-grey", 0.04),
  fillStrong: tokenRgba("background-transparent-grey", 0.08),
  border: getDividerColor("outline", "transparent"),
  divider: getDividerColor("light", "transparent"),
  text: tokenRgba("text-color-transparent", 0.9),
  subText: tokenRgba("text-sub-color-transparent", 0.58),
  chromeText: getColorToken("theme-top-text"),
  topBackground: getThemeTopBackground(),
} as const;

const PAGE_LAYOUT_ROWS = [
  { key: "t", layout: "T 型布局", scene: "三级落地页、带产品壳导航的管理页", structure: "顶部导航 + 左侧产品壳导航 + 主内容区", note: "右侧标题栏贴合顶部；标题栏与首个工具区间距为 0px，内容模块左右 24px" },
  { key: "vertical", layout: "上下布局", scene: "独立管理页、下钻详情页", structure: "顶部标题 / 操作区 + 下方内容区", note: "白色正文区上下 16px、左右 24px；标题区不承担复杂分栏" },
  { key: "context", layout: "上下 + 上下文侧栏", scene: "锚点、目录、详情辅助区", structure: "页面内辅助侧栏 + 主内容区", note: "展开或收起后，主内容和内部栅格重新计算" },
];

const PANEL_BEHAVIOR_ROWS = [
  { key: "overlay", type: "产品壳侧导", behavior: "Overlay", trigger: "鼠标悬停临时展开", content: "主内容不变，侧导覆盖在内容上", color: "Navigation Theme" },
  { key: "docked", type: "产品壳侧导", behavior: "Docked", trigger: "用户锁定展开", content: "主内容使用剩余宽度", color: "Navigation Theme" },
  { key: "reflow", type: "锚点 / 目录等上下文侧栏", behavior: "Reflow", trigger: "页面内展开或收起", content: "主内容和内部栅格重新计算", color: "Foundation / 组件语义" },
];

const BREAKPOINT_ROWS = [
  { key: "xs", breakpoint: "XS", width: "1280", strategy: "静态布局", note: "内容保持固定结构，必要时横向滚动" },
  { key: "sm", breakpoint: "SM", width: "1366", strategy: "响应式布局", note: "进入桌面端常规验收区间" },
  { key: "md", breakpoint: "MD", width: "1440", strategy: "响应式布局", note: "设计画布默认宽度" },
  { key: "lg", breakpoint: "LG", width: "1600", strategy: "响应式布局", note: "大桌面内容更舒展" },
  { key: "xl", breakpoint: "XL", width: "1920", strategy: "大屏优化", note: "保留更宽的内容展开空间" },
];

type PanelMode = "overlay" | "docked" | "reflow";

function ContentPlaceholder({ dense = false }: { dense?: boolean }) {
  const count = dense ? 4 : 3;

  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`, gap: px(layoutTokens.contentGap) }}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          style={{
            minHeight: px(layoutTokens.chromeHeight * 2),
            border: `${layoutTokens.dividerWidth}px solid ${layoutColors.border}`,
            borderRadius: px(layoutTokens.innerRadius),
            background: layoutColors.fill,
          }}
        />
      ))}
    </div>
  );
}

function LayoutSkeletons() {
  const cardStyle = {
    padding: px(layoutTokens.cardPadding),
    border: `${layoutTokens.dividerWidth}px solid ${layoutColors.border}`,
    borderRadius: px(layoutTokens.radius),
    background: layoutColors.surface,
  } as const;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: px(layoutTokens.cardPadding) }}>
      <div style={cardStyle}>
        <Space direction="vertical" size={layoutTokens.contentGap} style={{ width: "100%" }}>
          <Text strong style={{ color: layoutColors.text }}>T 型布局</Text>
          <Text style={{ color: layoutColors.subText }}>适合有产品壳导航的三级落地页。</Text>
          <div style={{ display: "flex", minHeight: px(layoutTokens.demoHeight) }}>
            <div style={{ flex: `0 0 ${PRODUCT_SIDER_EXPANDED_WIDTH}px`, padding: px(layoutTokens.contentGap), background: layoutColors.fillStrong, borderRight: `${layoutTokens.dividerWidth}px solid ${layoutColors.border}` }}>
              <Tag color="green">产品壳侧导</Tag>
            </div>
            <div style={{ display: "flex", flex: 1, minWidth: 0, flexDirection: "column" }}>
              <div style={{ padding: `${px(layoutTokens.contentBlockPadding)} ${px(layoutTokens.contentInlinePadding)}`, background: layoutColors.fill, color: layoutColors.text, fontSize: px(layoutTokens.captionSize), lineHeight: px(layoutTokens.captionLine) }}>
                右侧页面标题栏 · 顶部贴合
              </div>
              <div style={{ paddingInline: px(layoutTokens.contentInlinePadding), paddingBlock: 0 }}>
                <div style={{ minHeight: px(getUnitToken("size/component-height/m")), display: "flex", alignItems: "center", color: layoutColors.subText, fontSize: px(layoutTokens.captionSize), lineHeight: px(layoutTokens.captionLine) }}>
                  首个工具区 · 与标题栏 0px 间距
                </div>
                <div style={{ paddingTop: px(layoutTokens.contentBlockPadding) }}>
                  <ContentPlaceholder dense />
                </div>
              </div>
            </div>
          </div>
        </Space>
      </div>
      <div style={cardStyle}>
        <Space direction="vertical" size={layoutTokens.contentGap} style={{ width: "100%" }}>
          <Text strong style={{ color: layoutColors.text }}>上下布局</Text>
          <Text style={{ color: layoutColors.subText }}>适合独立管理页或下钻详情页。</Text>
          <div style={{ padding: px(layoutTokens.contentGap), background: layoutColors.fillStrong, borderRadius: px(layoutTokens.innerRadius) }}>
            <Text style={{ color: layoutColors.subText }}>标题 / 操作区</Text>
          </div>
          <div style={{ padding: `${px(layoutTokens.contentBlockPadding)} ${px(layoutTokens.contentInlinePadding)}`, background: layoutColors.surface, border: `${layoutTokens.dividerWidth}px solid ${layoutColors.border}`, borderRadius: px(layoutTokens.innerRadius) }}>
            <ContentPlaceholder />
          </div>
        </Space>
      </div>
    </div>
  );
}

function LeftPanelBehaviorBoard() {
  const [mode, setMode] = useState<PanelMode>("overlay");
  const isOverlay = mode === "overlay";
  const isContext = mode === "reflow";
  const panelLabel = isContext ? "页面内目录" : "产品壳侧导";
  const panelDescription = isOverlay ? "临时展开：覆盖内容，不改变内容宽度" : isContext ? "页面内展开：内容和栅格重新计算" : "锁定展开：内容使用剩余宽度";

  const panel = (
    <div
      style={{
        width: PRODUCT_SIDER_EXPANDED_WIDTH,
        flex: `0 0 ${PRODUCT_SIDER_EXPANDED_WIDTH}px`,
        padding: px(layoutTokens.contentGap),
        background: isContext ? layoutColors.fillStrong : layoutColors.surface,
        borderRight: `${layoutTokens.dividerWidth}px solid ${layoutColors.border}`,
        boxShadow: isOverlay ? buildShadow("D3") : undefined,
      }}
    >
      <Space direction="vertical" size={layoutTokens.compactGap}>
        <Text strong style={{ color: layoutColors.text }}>{panelLabel}</Text>
        <Text style={{ color: layoutColors.subText }}>{panelDescription}</Text>
        <Tag color={isContext ? "blue" : "green"}>{mode === "overlay" ? "Overlay" : mode === "docked" ? "Docked" : "Reflow"}</Tag>
      </Space>
    </div>
  );

  return (
    <Space direction="vertical" size={layoutTokens.cardPadding} style={{ width: "100%" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: px(layoutTokens.contentGap) }}>
        {([
          ["overlay", "临时覆盖"],
          ["docked", "锁定侧导"],
          ["reflow", "页面内目录"],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            style={{
              height: px(getUnitToken("size/component-height/m")),
              paddingInline: px(layoutTokens.cardPadding),
              border: `${layoutTokens.dividerWidth}px solid ${mode === value ? getColorToken("component-primary") : layoutColors.border}`,
              borderRadius: px(layoutTokens.innerRadius),
              background: mode === value ? tokenRgba("component-active-background", 1) : layoutColors.surface,
              color: mode === value ? getColorToken("component-active") : layoutColors.text,
              fontSize: px(layoutTokens.bodySize),
              lineHeight: px(layoutTokens.bodyLine),
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div style={{ position: "relative", display: "flex", minHeight: px(layoutTokens.demoHeight + layoutTokens.chromeHeight * 2), overflow: "hidden", border: `${layoutTokens.dividerWidth}px solid ${layoutColors.border}`, borderRadius: px(layoutTokens.radius), background: layoutColors.surface }}>
        {isOverlay ? <div style={{ position: "absolute", insetBlock: 0, insetInlineStart: 0, zIndex: 1 }}>{panel}</div> : panel}
        <div style={{ flex: 1, minWidth: 0, padding: px(layoutTokens.cardPadding) }}>
          <Space direction="vertical" size={layoutTokens.contentGap} style={{ width: "100%" }}>
            <Text strong style={{ color: layoutColors.text }}>主内容区</Text>
            <Text style={{ color: layoutColors.subText }}>{isOverlay ? "仍使用整块内容宽度" : "按剩余内容宽度组织"}</Text>
            <ContentPlaceholder dense={!isOverlay} />
          </Space>
        </div>
      </div>
    </Space>
  );
}

function ScrollChromeBoard() {
  const [chromeState, setChromeState] = useState<"expanded" | "collapsed">("expanded");
  const isCollapsed = chromeState === "collapsed";

  return (
    <Space direction="vertical" size={layoutTokens.cardPadding} style={{ width: "100%" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: px(layoutTokens.contentGap) }}>
        {([
          ["expanded", "产品顶导展开"],
          ["collapsed", "产品顶导收起"],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setChromeState(value)}
            style={{
              height: px(getUnitToken("size/component-height/m")),
              paddingInline: px(layoutTokens.cardPadding),
              border: `${layoutTokens.dividerWidth}px solid ${chromeState === value ? getColorToken("component-primary") : layoutColors.border}`,
              borderRadius: px(layoutTokens.innerRadius),
              background: chromeState === value ? tokenRgba("component-active-background", 1) : layoutColors.surface,
              color: chromeState === value ? getColorToken("component-active") : layoutColors.text,
              fontSize: px(layoutTokens.bodySize),
              lineHeight: px(layoutTokens.bodyLine),
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div style={{ overflow: "hidden", border: `${layoutTokens.dividerWidth}px solid ${layoutColors.border}`, borderRadius: px(layoutTokens.radius), background: layoutColors.surface }}>
        <div
          style={{
            height: isCollapsed ? 0 : px(layoutTokens.chromeHeight),
            overflow: "hidden",
            paddingInline: isCollapsed ? 0 : px(layoutTokens.cardPadding),
            display: "flex",
            alignItems: "center",
            background: layoutColors.topBackground,
            color: layoutColors.chromeText,
          }}
        >
          <span style={{ fontSize: px(layoutTokens.captionSize), lineHeight: px(layoutTokens.captionLine) }}>产品壳顶部导航 · 行为示意，不表示最终导航尺寸</span>
        </div>
        <div style={{ padding: px(layoutTokens.cardPadding), display: "grid", gap: px(layoutTokens.contentGap) }}>
          <div style={{ padding: px(layoutTokens.contentGap), borderRadius: px(layoutTokens.innerRadius), background: layoutColors.fillStrong, color: layoutColors.text, fontSize: px(layoutTokens.titleSize), lineHeight: px(layoutTokens.titleLine), fontWeight: layoutTokens.titleWeight }}>
            页面标题栏保持当前规则；P0 不默认让它随产品顶导收起。
          </div>
          <ContentPlaceholder dense />
          <div style={{ color: layoutColors.subText, fontSize: px(layoutTokens.captionSize), lineHeight: px(layoutTokens.captionLine) }}>
            {isCollapsed ? "收起态仅增加主内容可用高度；内容宽度和内部栅格不改变。" : "展开态由页面唯一的主内容滚动容器承载滚动行为。"}
          </div>
        </div>
      </div>
      <Alert
        type="warning"
        showIcon
        message="阈值、滞回区间、动效时长和标题栏联动待 Figma 补读"
        description="本样张验证归属和两态边界，不把未稳定的计算值升级为 Design Token。"
      />
    </Space>
  );
}

function LayoutSpecimen() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginTop: 0, color: layoutColors.text }}>布局规则入口</Title>
        <Text style={{ color: layoutColors.subText }}>页面骨架先决定区域关系，再把内容交给栅格组织。</Text>
      </div>
      <Alert type="info" showIcon message="Layout 不等于 Grid" description="这里查看骨架、断点和左侧区域行为；20 栏、12 栏及局部列数已移到独立的“栅格”页。" />
      <section>
        <Title level={5} style={{ color: layoutColors.text }}>页面骨架样张</Title>
        <LayoutSkeletons />
      </section>
      <section>
        <Title level={5} style={{ color: layoutColors.text }}>左侧区域展开 / 收起行为</Title>
        <LeftPanelBehaviorBoard />
      </section>
      <section>
        <Title level={5} style={{ color: layoutColors.text }}>内容区滚动与产品壳收起</Title>
        <ScrollChromeBoard />
      </section>
      <section>
        <Title level={5} style={{ color: layoutColors.text }}>页面级布局类型</Title>
        <Table columns={layoutColumns} dataSource={PAGE_LAYOUT_ROWS} pagination={false} size="small" scroll={{ x: 900 }} />
      </section>
      <section>
        <Title level={5} style={{ color: layoutColors.text }}>行为边界</Title>
        <Table columns={behaviorColumns} dataSource={PANEL_BEHAVIOR_ROWS} pagination={false} size="small" scroll={{ x: 860 }} />
      </section>
      <section>
        <Title level={5} style={{ color: layoutColors.text }}>断点与适配</Title>
        <Table columns={breakpointColumns} dataSource={BREAKPOINT_ROWS} pagination={false} size="small" />
      </section>
      <Alert type="warning" showIcon message="侧导紧凑态宽度仍待从图标资产与交互稿确认" description="本页只使用 Figma 已明确且产品壳已消费的 220px 展开宽度；紧凑 rail 宽度不在这里推导成全局规则。" />
    </Space>
  );
}

const layoutColumns: ColumnsType<(typeof PAGE_LAYOUT_ROWS)[number]> = [
  { title: "布局类型", dataIndex: "layout", key: "layout", width: 160 },
  { title: "适用场景", dataIndex: "scene", key: "scene", width: 220 },
  { title: "结构", dataIndex: "structure", key: "structure", width: 300 },
  { title: "说明", dataIndex: "note", key: "note", width: 280 },
];

const behaviorColumns: ColumnsType<(typeof PANEL_BEHAVIOR_ROWS)[number]> = [
  { title: "区域类型", dataIndex: "type", key: "type", width: 180 },
  { title: "行为", dataIndex: "behavior", key: "behavior", width: 110, render: (value: string) => <Tag>{value}</Tag> },
  { title: "触发方式", dataIndex: "trigger", key: "trigger", width: 190 },
  { title: "主内容", dataIndex: "content", key: "content", width: 220 },
  { title: "颜色归属", dataIndex: "color", key: "color", width: 160 },
];

const breakpointColumns: ColumnsType<(typeof BREAKPOINT_ROWS)[number]> = [
  { title: "断点", dataIndex: "breakpoint", key: "breakpoint", width: 100 },
  { title: "宽度", dataIndex: "width", key: "width", width: 110, render: (value: string) => `${value}px` },
  { title: "布局策略", dataIndex: "strategy", key: "strategy", width: 170 },
  { title: "说明", dataIndex: "note", key: "note" },
];

export default function LayoutBasicStylePage() {
  return <BasicStylePageLayout title="布局" description="页面骨架、断点与可展开左侧区域的行为规则。" designDocSource={layoutDocSource} specimen={<LayoutSpecimen />} />;
}
