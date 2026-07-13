import { Alert, Space, Table, Tag, Typography, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import tokens from "../../../design-system/tokens.resolved.json";
import layoutGridDocSource from "../../../../docs/foundations/layout-grid.md?raw";
import { BasicStylePageLayout } from "./BasicStylePageLayout";

const { Text, Title } = Typography;

const u = tokens.unit as Record<string, number>;

const BREAKPOINT_ROWS = [
  { key: "xs", breakpoint: "XS", width: "1280", strategy: "静态布局", note: "内容保持固定结构，必要时出现横向滚动" },
  { key: "sm", breakpoint: "SM", width: "1366", strategy: "响应式布局", note: "进入桌面端常规验收区间" },
  { key: "md", breakpoint: "MD", width: "1440", strategy: "响应式布局", note: "设计画布默认宽度" },
  { key: "lg", breakpoint: "LG", width: "1600", strategy: "响应式布局", note: "大桌面内容更舒展" },
  { key: "xl", breakpoint: "XL", width: "1920", strategy: "大屏优化", note: "保留更宽的内容展开空间" },
];

const PAGE_LAYOUT_ROWS = [
  { key: "t", layout: "T 型布局", scene: "三级落地页、管理页", structure: "左侧导航 + 右侧主内容区", note: "侧导展开时固定 200px，内容区再继续拆分" },
  { key: "vertical", layout: "上下布局", scene: "四级页面、下钻详情页", structure: "顶部标题 / 操作区 + 下方内容区", note: "标题区不承担复杂分栏，内容区再做局部结构" },
];

const GRID_LAYER_ROWS = [
  { key: "page", layer: "页面主栅格", rule: "20 栏", usage: "决定大区块宽度关系", status: "已定规则" },
  { key: "drawer", layer: "Drawer / Modal 内部", rule: "12 栏", usage: "表单、说明、辅助信息、分组内容排布", status: "已定规则" },
  { key: "local", layer: "局部容器栅格", rule: "按内容结构决定", usage: "卡片列表、左右双栏、映射配置区、筛选组合", status: "已定规则" },
  { key: "token", layer: "Layout / Grid token", rule: "暂无独立生成链路", usage: "后续视重复出现的规则再评估入库", status: "待补" },
];

const BOUNDARY_ROWS = [
  { key: "page", type: "整页布局层", scope: "是否有侧边导航、标题区和内容区关系、页面是单栏还是双栏", owner: "Layout / Grid" },
  { key: "local", type: "局部容器层", scope: "卡片每行几列、左右面板比例、筛选区局部排布", owner: "Layout / Grid" },
  { key: "space", type: "组件间距层", scope: "padding / margin / gap 数值", owner: "Spacing" },
  { key: "card", type: "卡片容器层", scope: "卡片背景、边框、圆角、内边距", owner: "Card" },
  { key: "title", type: "标题区内部结构层", scope: "返回、面包屑、标题、右侧操作的内部排布", owner: "TitleBar" },
];

const PROJECT_ROWS = [
  { key: "title", item: "SensPageTitleBar", status: "已有", note: "标题区内部布局规则已较稳定，但不负责整页骨架选择" },
  { key: "management", item: "DataSourceManagementPage", status: "已有", note: "当前使用卡片网格，示例为每行 4 列" },
  { key: "drawer", item: "SensDrawer / drawer.design.md", status: "已有", note: "抽屉宽度、圆角、投影、内容区 padding 已有组件级规则" },
  { key: "foundation", item: "Layout / Grid Foundation 文档", status: "已补第一版", note: "之前没有统一入口，现在已沉淀成 foundation 文档" },
  { key: "preview", item: "Layout / Grid 预览页", status: "本轮新增", note: "作为当前 HTML 里的直观入口，不改业务页面" },
];

const ISSUE_ROWS = [
  { key: "preview", issue: "缺布局样张页", current: "本轮补基础样式页", next: "后续视需要再加更细的页面模板样张" },
  { key: "token", issue: "缺独立 Layout / Grid token 生成链路", current: "先用规则文档承接", next: "做 Token 缺口表时统一评估" },
  { key: "mapping", issue: "缺 20 栏映射典型页面的例图", current: "先用文字和表格描述", next: "页面样板间阶段再补图示" },
  { key: "adoption", issue: "项目页面仍有分散布局写法", current: "先不批量改页面", next: "进入页面样板间或组件阶段再逐步收敛" },
];

function MiniSkeleton({
  type,
  title,
  description,
}: {
  type: "t" | "vertical";
  title: string;
  description: string;
}) {
  const { token } = theme.useToken();

  if (type === "t") {
    return (
      <div
        style={{
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadiusLG,
          background: token.colorBgContainer,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 44,
            background: token.colorFillQuaternary,
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            display: "flex",
            alignItems: "center",
            paddingInline: token.paddingSM,
          }}
        >
          <Text strong>{title}</Text>
        </div>
        <div style={{ display: "flex", minHeight: 168 }}>
          <div
            style={{
              width: 120,
              borderRight: `1px solid ${token.colorBorderSecondary}`,
              background: token.colorFillTertiary,
              padding: token.paddingSM,
            }}
          >
            <Tag color="green">侧导</Tag>
          </div>
          <div style={{ flex: 1, padding: token.paddingSM }}>
            <div
              style={{
                height: 36,
                borderRadius: token.borderRadius,
                background: token.colorFillQuaternary,
                marginBottom: token.marginSM,
                display: "flex",
                alignItems: "center",
                paddingInline: token.paddingSM,
              }}
            >
              <Text type="secondary">标题区</Text>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: token.marginSM }}>
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  style={{
                    height: 84,
                    borderRadius: token.borderRadius,
                    background: token.colorFillSecondary,
                    border: `1px solid ${token.colorBorderSecondary}`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <div style={{ padding: token.paddingSM, borderTop: `1px solid ${token.colorBorderSecondary}` }}>
          <Text type="secondary">{description}</Text>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        background: token.colorBgContainer,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 44,
          background: token.colorFillQuaternary,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingInline: token.paddingSM,
        }}
      >
        <Text strong>{title}</Text>
        <Tag color="blue">上下</Tag>
      </div>
      <div style={{ padding: token.paddingSM }}>
        <div
          style={{
            height: 48,
            borderRadius: token.borderRadius,
            background: token.colorFillTertiary,
            border: `1px solid ${token.colorBorderSecondary}`,
            marginBottom: token.marginSM,
            display: "flex",
            alignItems: "center",
            paddingInline: token.paddingSM,
          }}
        >
          <Text type="secondary">标题 / 操作区</Text>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: token.marginSM }}>
          <div
            style={{
              height: 112,
              borderRadius: token.borderRadius,
              background: token.colorFillSecondary,
              border: `1px solid ${token.colorBorderSecondary}`,
            }}
          />
          <div
            style={{
              height: 112,
              borderRadius: token.borderRadius,
              background: token.colorFillQuaternary,
              border: `1px solid ${token.colorBorderSecondary}`,
            }}
          />
        </div>
      </div>
      <div style={{ padding: token.paddingSM, borderTop: `1px solid ${token.colorBorderSecondary}` }}>
        <Text type="secondary">{description}</Text>
      </div>
    </div>
  );
}

function SkeletonBoard() {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: token.marginMD,
      }}
    >
      <MiniSkeleton type="t" title="T 型布局" description="适合三级落地页或带侧边导航的管理页。" />
      <MiniSkeleton type="vertical" title="上下布局" description="适合下钻详情页、独立管理页或列表 + 详情结构。" />
    </div>
  );
}

function GridLayerBoard() {
  const { token } = theme.useToken();

  const cardStyle = {
    padding: token.paddingMD,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
    background: token.colorBgContainer,
  } as const;

  const makeColumns = (count: number, color: string) =>
    Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        style={{
          height: 32,
          borderRadius: token.borderRadiusSM,
          background: color,
          border: `1px solid ${token.colorBorderSecondary}`,
        }}
      />
    ));

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: token.marginMD }}>
      <div style={cardStyle}>
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <Text strong>页面主栅格</Text>
          <Text type="secondary">20 栏，用于决定大区块宽度关系。</Text>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(10, minmax(0, 1fr))", gap: 4 }}>
            {makeColumns(10, token.colorFillSecondary)}
          </div>
          <Text type="secondary">样张中压缩展示为 10 组，表示 20 栏关系的页面级密度。</Text>
        </Space>
      </div>

      <div style={cardStyle}>
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <Text strong>Drawer / Modal 内部栅格</Text>
          <Text type="secondary">12 栏，更适合表单、说明、辅助信息和分组内容。</Text>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: 4 }}>
            {makeColumns(6, token.colorFillQuaternary)}
          </div>
          <Text type="secondary">样张中压缩展示为 6 组，表示 12 栏的内部结构密度。</Text>
        </Space>
      </div>

      <div style={cardStyle}>
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <Text strong>局部容器栅格</Text>
          <Text type="secondary">按内容决定列数，例如卡片列表、左右双栏或映射配置区。</Text>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: token.marginSM }}>
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                style={{
                  height: 64,
                  borderRadius: token.borderRadius,
                  background: token.colorFillSecondary,
                  border: `1px solid ${token.colorBorderSecondary}`,
                }}
              />
            ))}
          </div>
          <Text type="secondary">当前 TikTok 管理页就是局部容器 4 列卡片网格。</Text>
        </Space>
      </div>
    </div>
  );
}

function BreakpointTable() {
  const columns: ColumnsType<(typeof BREAKPOINT_ROWS)[number]> = [
    { title: "断点", dataIndex: "breakpoint", key: "breakpoint", width: 88 },
    { title: "宽度", dataIndex: "width", key: "width", width: 96, render: (value: string) => `${value}px` },
    { title: "布局策略", dataIndex: "strategy", key: "strategy", width: 160 },
    { title: "说明", dataIndex: "note", key: "note" },
  ];

  return <Table columns={columns} dataSource={BREAKPOINT_ROWS} pagination={false} size="small" />;
}

function PageLayoutTable() {
  const columns: ColumnsType<(typeof PAGE_LAYOUT_ROWS)[number]> = [
    { title: "布局类型", dataIndex: "layout", key: "layout", width: 110 },
    { title: "适用场景", dataIndex: "scene", key: "scene", width: 180 },
    { title: "结构", dataIndex: "structure", key: "structure", width: 220 },
    { title: "说明", dataIndex: "note", key: "note" },
  ];

  return <Table columns={columns} dataSource={PAGE_LAYOUT_ROWS} pagination={false} size="small" />;
}

function GridLayerTable() {
  const columns: ColumnsType<(typeof GRID_LAYER_ROWS)[number]> = [
    { title: "层级", dataIndex: "layer", key: "layer", width: 160 },
    { title: "规则", dataIndex: "rule", key: "rule", width: 160, render: (value: string) => <Tag>{value}</Tag> },
    { title: "用途", dataIndex: "usage", key: "usage" },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (value: string) => <Tag color={value.includes("待补") ? "warning" : "success"}>{value}</Tag>,
    },
  ];

  return <Table columns={columns} dataSource={GRID_LAYER_ROWS} pagination={false} size="small" />;
}

function BoundaryTable() {
  const columns: ColumnsType<(typeof BOUNDARY_ROWS)[number]> = [
    { title: "层级类型", dataIndex: "type", key: "type", width: 140 },
    { title: "负责内容", dataIndex: "scope", key: "scope" },
    { title: "归属", dataIndex: "owner", key: "owner", width: 140 },
  ];

  return <Table columns={columns} dataSource={BOUNDARY_ROWS} pagination={false} size="small" />;
}

function ProjectTable() {
  const columns: ColumnsType<(typeof PROJECT_ROWS)[number]> = [
    { title: "落点", dataIndex: "item", key: "item", width: 220 },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (value: string) => <Tag color={value.includes("新增") || value.includes("补") ? "processing" : "success"}>{value}</Tag>,
    },
    { title: "说明", dataIndex: "note", key: "note" },
  ];

  return <Table columns={columns} dataSource={PROJECT_ROWS} pagination={false} size="small" />;
}

function IssueTable() {
  const columns: ColumnsType<(typeof ISSUE_ROWS)[number]> = [
    { title: "问题", dataIndex: "issue", key: "issue" },
    { title: "当前处理", dataIndex: "current", key: "current" },
    { title: "下一步", dataIndex: "next", key: "next" },
  ];

  return <Table columns={columns} dataSource={ISSUE_ROWS} pagination={false} size="small" />;
}

function LayoutGridSpecimen() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginTop: 0 }}>
          布局 / 栅格规则入口
        </Title>
        <Text type="secondary">
          这一页把页面级骨架、栅格层级、断点行为和当前项目落点统一放进基础样式工作流，方便你直接在 HTML 里看。
        </Text>
      </div>

      <Alert
        type="info"
        showIcon
        message="这是 Layout / Grid Foundation 的第一版 HTML 入口"
        description="当前先解决页面骨架和规则可视化，不改业务页面、不新增 token、不一次性扩成完整页面模板系统。"
      />

      <section>
        <Title level={5}>两种页面骨架</Title>
        <SkeletonBoard />
      </section>

      <section>
        <Title level={5}>断点与布局行为</Title>
        <BreakpointTable />
      </section>

      <section>
        <Title level={5}>页面级布局类型</Title>
        <PageLayoutTable />
      </section>

      <section>
        <Title level={5}>栅格层级样张</Title>
        <GridLayerBoard />
      </section>

      <section>
        <Title level={5}>栅格层级说明</Title>
        <GridLayerTable />
      </section>

      <section>
        <Title level={5}>整页布局和局部容器的边界</Title>
        <BoundaryTable />
      </section>

      <section>
        <Title level={5}>当前项目里的落点</Title>
        <ProjectTable />
      </section>

      <Alert
        type="warning"
        showIcon
        message="当前 TikTok 页面仍保留局部实现写法"
        description={`比如管理页当前示例为每行 4 列卡片网格，页面 padding 仍由现有页面容器承接；本轮先让规则进 HTML，不在这里直接回改业务页。基础 spacing 仍以 ${u["spacing/6x"]} / ${u["spacing/4x"]} 等现有单位承接。`}
      />

      <section>
        <Title level={5}>当前问题与待补</Title>
        <IssueTable />
      </section>
    </Space>
  );
}

export default function LayoutGridBasicStylePage() {
  return (
    <BasicStylePageLayout
      title="布局 / 栅格"
      description="统一页面级布局、栅格列数、断点行为、整页骨架和局部容器边界。"
      designDocSource={layoutGridDocSource}
      specimen={<LayoutGridSpecimen />}
    />
  );
}
