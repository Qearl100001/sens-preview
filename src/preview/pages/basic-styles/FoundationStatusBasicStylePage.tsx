import { Alert, Space, Table, Tag, Typography, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import { BasicStylePageLayout } from "./BasicStylePageLayout";

const { Text, Title } = Typography;

const DASHBOARD_DOC = `
# Foundation / Token 看板（内部工作台）

> 这页主要给内部推进和 \`DESIGN.md\` 取舍用，不是最终对外文档正文。

## 这页怎么用

- 先看哪些 foundation 已经足够稳定，可以直接写进 \`DESIGN.md\`。
- 再看哪些内容虽然有规则，但更适合只写摘要或边界。
- 最后看 token 缺口到底该走 \`token\`、\`config / 常量\`、\`helper\`，还是先保留为规则，不要一上来就全入库。

## 读表口径

- \`文档\`：是否已有 foundation 文档。
- \`HTML 样张\`：是否已有当前预览工程里的可视化入口。
- \`token / helper\`：是否已有稳定承接方式。
- \`当前成熟度\`：是内部推进判断，不是对外承诺。
- \`进 DESIGN.md\`：表示适合在最终文档里怎么写，不代表要原样搬整张表进去。
- \`建议承载方式\`：帮助判断这条缺口更适合进 token、config / 常量、helper，还是先保留规则。

## 当前总判断

- foundation 层已经有不少内容可以直接进 \`DESIGN.md\`。
- 真正高优缺口不是“全部重做”，而是“补映射、补边界、补承载方式判断”。
- \`Layout / Grid\` 现在更适合沉淀规则和页面骨架，不建议为了它单开一整套 token 生成链路。
`;

type Maturity = "高" | "中高" | "中" | "中偏低";
type DesignMdFit = "可直接写" | "可写摘要" | "只写 foundation 边界";
type TokenFit = "完整" | "部分" | "规则优先";
type Priority = "高" | "中" | "低";
type CarryType = "token" | "config / 常量" | "helper" | "规则优先，不入库";
type SprintFit = "是" | "先列缺口" | "否";

interface FoundationRow {
  key: string;
  name: string;
  doc: string;
  preview: string;
  tokenFit: TokenFit;
  maturity: Maturity;
  designMdFit: DesignMdFit;
  gap: string;
  next: string;
  priority: Priority;
}

interface TokenGapRow {
  key: string;
  item: string;
  owner: string;
  current: string;
  carry: CarryType;
  reason: string;
  priority: Priority;
  sprint: SprintFit;
}

const FOUNDATION_ROWS: FoundationRow[] = [
  {
    key: "color",
    name: "Color",
    doc: "已有",
    preview: "已有",
    tokenFit: "部分",
    maturity: "中",
    designMdFit: "可写摘要",
    gap: "换肤来源、导航边界和部分映射口径还没完全收口。",
    next: "保留 foundation 规则，后续配合 Token 缺口表收口。",
    priority: "中",
  },
  {
    key: "navigation-color",
    name: "Navigation Color",
    doc: "已有",
    preview: "已有",
    tokenFit: "部分",
    maturity: "中偏低",
    designMdFit: "可写摘要",
    gap: "缺完整 Figma -> token -> 用途映射表，渐变和换肤矩阵还没沉淀完。",
    next: "两周内高优先补映射表，不急着扩完整产品壳。",
    priority: "高",
  },
  {
    key: "theme-skinning",
    name: "Theme / Skinning",
    doc: "已有",
    preview: "已有",
    tokenFit: "部分",
    maturity: "中",
    designMdFit: "可写摘要",
    gap: "已明确导航主题和功能色主题独立，但功能色完整矩阵和组件映射表还没补齐。",
    next: "先作为 DESIGN.md 换肤机制章节来源，继续补组件换肤映射。",
    priority: "高",
  },
  {
    key: "typography",
    name: "Typography",
    doc: "已有",
    preview: "已有",
    tokenFit: "完整",
    maturity: "高",
    designMdFit: "可直接写",
    gap: "组件级消费迁移还没完全收口。",
    next: "后续只做接入检查，不重写规则。",
    priority: "低",
  },
  {
    key: "spacing",
    name: "Spacing",
    doc: "已有",
    preview: "已有",
    tokenFit: "完整",
    maturity: "中高",
    designMdFit: "可直接写",
    gap: "还缺统一绑定检查，Drawer / 局部组件 padding 仍有待确认项。",
    next: "进入 Token 缺口表和组件阶段时逐步收口。",
    priority: "中",
  },
  {
    key: "layout-grid",
    name: "Layout / Grid",
    doc: "已有",
    preview: "已有",
    tokenFit: "规则优先",
    maturity: "中",
    designMdFit: "可直接写",
    gap: "缺页面模板映射、max-width / page padding / double-panel 比例等配置口径。",
    next: "先沉淀规则，不单独开一整套 token 生成链路。",
    priority: "高",
  },
  {
    key: "size",
    name: "Size",
    doc: "已有",
    preview: "已有",
    tokenFit: "完整",
    maturity: "中",
    designMdFit: "可直接写",
    gap: "组件专属尺寸与全局 size 的边界还不够干净。",
    next: "后续重点收口 Tag、Input、TitleBar 这类专属尺寸。",
    priority: "中",
  },
  {
    key: "icon",
    name: "Icon",
    doc: "已有",
    preview: "已有",
    tokenFit: "完整",
    maturity: "中高",
    designMdFit: "可直接写",
    gap: "业务 logo 边界、antd icon 迁移和逐组件接入还没结束。",
    next: "维持 registry 方案，后续按组件逐步迁移。",
    priority: "中",
  },
  {
    key: "radius",
    name: "Radius",
    doc: "已有",
    preview: "已有",
    tokenFit: "部分",
    maturity: "中",
    designMdFit: "可直接写",
    gap: "统一 helper 和 antd 映射口径还没完全收口。",
    next: "后续配合组件接入一起收敛，不急着重做 foundation。",
    priority: "中",
  },
  {
    key: "shadow",
    name: "Shadow",
    doc: "已有",
    preview: "已有",
    tokenFit: "完整",
    maturity: "高",
    designMdFit: "可直接写",
    gap: "组件接入还没全部完成，但 foundation 本身已经稳定。",
    next: "后续只做组件消费迁移和局部验收。",
    priority: "低",
  },
  {
    key: "divider",
    name: "Divider",
    doc: "已有",
    preview: "已有",
    tokenFit: "完整",
    maturity: "高",
    designMdFit: "可直接写",
    gap: "仍有少量旧写法和旧 handle 迁移工作。",
    next: "后续在组件收口时顺带迁移。",
    priority: "低",
  },
  {
    key: "card",
    name: "Card",
    doc: "已有",
    preview: "已有",
    tokenFit: "部分",
    maturity: "中",
    designMdFit: "只写 foundation 边界",
    gap: "Foundation 已有，但正式组件 API 和 EntryCard / DataSourceCard 边界还没完全定。",
    next: "在最终文档里先写容器规则，不急着承诺完整组件 API。",
    priority: "中",
  },
];

const TOKEN_GAP_ROWS: TokenGapRow[] = [
  {
    key: "theme-skinning-map",
    item: "Theme / Skinning 双主题规则",
    owner: "Theme / Skinning",
    current: "已确认导航主题与功能色主题独立，但组件映射表未完整覆盖。",
    carry: "规则优先，不入库",
    reason: "这是换肤判断口径，不是单个 token 值。",
    priority: "高",
    sprint: "是",
  },
  {
    key: "nav-map",
    item: "Navigation Color 完整映射表",
    owner: "Navigation Color",
    current: "缺完整 Figma -> token -> 用途 -> 是否换肤 映射。",
    carry: "token",
    reason: "这是现在最影响 DESIGN.md 可信度的一块。",
    priority: "高",
    sprint: "是",
  },
  {
    key: "nav-gradient",
    item: "顶导航 / 侧导航渐变承接",
    owner: "Navigation Color",
    current: "有规则，无稳定代码承接。",
    carry: "helper",
    reason: "渐变先保证统一消费，比急着塞进 foundation token 更重要。",
    priority: "高",
    sprint: "是",
  },
  {
    key: "active-diff",
    item: "component-active 色值差异",
    owner: "Color / Navigation",
    current: "Figma 与代码存在 #008C64 / #008C65 差异。",
    carry: "规则优先，不入库",
    reason: "先确认真相源，比补 token 更重要。",
    priority: "高",
    sprint: "是",
  },
  {
    key: "layout-config",
    item: "页面边距 / 内容最大宽度 / 双栏比例",
    owner: "Layout / Grid",
    current: "有规则，无统一承载。",
    carry: "config / 常量",
    reason: "这些更像布局配置，不像 design token。",
    priority: "中",
    sprint: "先列缺口",
  },
  {
    key: "sider-width",
    item: "侧边导航宽度 200",
    owner: "Layout / Grid",
    current: "规则已定，未统一承载。",
    carry: "config / 常量",
    reason: "固定结构尺寸，配置化比 token 化更自然。",
    priority: "中",
    sprint: "先列缺口",
  },
  {
    key: "drawer-width",
    item: "Drawer 宽度 432 / 864",
    owner: "Drawer",
    current: "已有组件规则。",
    carry: "config / 常量",
    reason: "这是组件尺寸档位，不是 foundation token。",
    priority: "中",
    sprint: "先列缺口",
  },
  {
    key: "search-width",
    item: "Search 默认宽度 200",
    owner: "Search",
    current: "组件文档已标注尚无 token。",
    carry: "config / 常量",
    reason: "明显是组件专属，不该塞进全局 spacing。",
    priority: "中",
    sprint: "先列缺口",
  },
  {
    key: "search-create-width",
    item: "Search 带创建总宽 253",
    owner: "Search",
    current: "当前只有布局估算值。",
    carry: "规则优先，不入库",
    reason: "复用性不够，先别硬入库。",
    priority: "低",
    sprint: "否",
  },
  {
    key: "input-sm-height",
    item: "Input 小尺寸高度 28",
    owner: "Size / Input",
    current: "size.md 已标待确认。",
    carry: "token",
    reason: "更像输入类专属高度，不该混进通用 spacing。",
    priority: "高",
    sprint: "是",
  },
  {
    key: "tag-padding",
    item: "Tag padding-inline 6 / padding-block 1",
    owner: "Size / Tag",
    current: "已有候选，未入库。",
    carry: "token",
    reason: "明显是 Tag 专属尺寸，不该继续散落硬写。",
    priority: "高",
    sprint: "是",
  },
  {
    key: "table-padding",
    item: "TableShell 上下 padding 11",
    owner: "Table",
    current: "组件文档已标无 token。",
    carry: "token",
    reason: "复用性高，但属于 Table 专属。",
    priority: "中",
    sprint: "先列缺口",
  },
  {
    key: "textarea-padding",
    item: "TextArea 上下 padding 5",
    owner: "TextArea",
    current: "文档已标尚无 spacing token。",
    carry: "config / 常量",
    reason: "这是多行输入专属规则，不该硬塞全局 spacing。",
    priority: "中",
    sprint: "先列缺口",
  },
  {
    key: "radius-mapping",
    item: "radius/l / xl / circular 映射",
    owner: "Radius",
    current: "foundation 有值，消费映射未完全收口。",
    carry: "helper",
    reason: "问题不在缺值，在缺统一承接。",
    priority: "高",
    sprint: "是",
  },
];

const PRIORITY_ROWS = [
  {
    key: "theme-skinning",
    item: "Theme / Skinning 换肤规则",
    why: "不先拆清导航主题和功能色主题，后面组件会误以为所有换肤都跟导航同色。",
    avoid: "不是补完整换肤实现，也不是新增一堆 token。",
    action: "沉淀双主题规则，并继续补组件换肤映射表。",
  },
  {
    key: "nav-map",
    item: "Navigation Color 映射表",
    why: "这是最容易让 DESIGN.md 写虚的一块，规则和实现之间还差最后一层映射。",
    avoid: "不是做完整产品壳，不是重做导航。",
    action: "补 Figma -> token -> 用途 -> 是否换肤 的对照表。",
  },
  {
    key: "active-truth",
    item: "component-active 真相源确认",
    why: "当前 Figma 和代码有一位 hex 差异，不先定来源，后面所有 token 都会摇摆。",
    avoid: "不是顺手改 theme.ts 生成物。",
    action: "先定来源口径，再决定是否影响 token。",
  },
  {
    key: "input-tag",
    item: "Input 28 / Tag padding",
    why: "这两块都属于高频组件专属尺寸，最容易在页面里反复硬写。",
    avoid: "不是把所有组件尺寸体系一次补完。",
    action: "补组件级 token 或常量，并写清边界。",
  },
  {
    key: "radius",
    item: "Radius helper / theme 映射收口",
    why: "foundation 有值，但消费口径还没统一，影响组件复用稳定性。",
    avoid: "不是重做 radius foundation。",
    action: "补统一承接方式，优先 helper / theme mapping。",
  },
  {
    key: "layout-map",
    item: "Layout / Grid 与页面样板间挂钩",
    why: "规则已经有了，但还没和页面模板形成一眼能选的关系。",
    avoid: "不是给 Layout / Grid 新开整套 token。",
    action: "在页面样板间阶段补‘哪类页面用哪种骨架’。",
  },
];

const SUMMARY_ROWS = [
  { key: "direct", label: "可直接进 DESIGN.md", value: 7, note: "Typography、Spacing、Layout/Grid、Size、Icon、Shadow、Divider" },
  { key: "summary", label: "需写摘要 / 边界", value: 4, note: "Color、Theme/Skinning、Navigation Color、Card" },
  { key: "high-gap", label: "高优 token / 映射缺口", value: 7, note: "先补映射和承载方式判断，不是全部入库" },
  { key: "no-token", label: "暂不 token 化", value: 3, note: "Layout 配置、Search 253、component-active 真相源" },
];

function tagColorForMaturity(value: Maturity): string {
  if (value === "高") return "success";
  if (value === "中高") return "processing";
  if (value === "中") return "warning";
  return "orange";
}

function tagColorForToken(value: TokenFit): string {
  if (value === "完整") return "success";
  if (value === "部分") return "warning";
  return "blue";
}

function tagColorForDesignMd(value: DesignMdFit): string {
  if (value === "可直接写") return "success";
  if (value === "可写摘要") return "processing";
  return "gold";
}

function tagColorForPriority(value: Priority): string {
  if (value === "高") return "error";
  if (value === "中") return "warning";
  return "default";
}

function tagColorForCarry(value: CarryType): string {
  if (value === "token") return "success";
  if (value === "config / 常量") return "processing";
  if (value === "helper") return "blue";
  return "default";
}

function tagColorForSprint(value: SprintFit): string {
  if (value === "是") return "error";
  if (value === "先列缺口") return "warning";
  return "default";
}

function SummaryBoard() {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: token.marginMD,
      }}
    >
      {SUMMARY_ROWS.map((item) => (
        <div
          key={item.key}
          style={{
            padding: token.paddingMD,
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: token.borderRadiusLG,
            background: token.colorBgContainer,
          }}
        >
          <Space direction="vertical" size="small">
            <Text type="secondary">{item.label}</Text>
            <Title level={3} style={{ margin: 0 }}>
              {item.value}
            </Title>
            <Text type="secondary">{item.note}</Text>
          </Space>
        </div>
      ))}
    </div>
  );
}

function FoundationTable() {
  const columns: ColumnsType<FoundationRow> = [
    { title: "Foundation", dataIndex: "name", key: "name", width: 150, fixed: "left" },
    {
      title: "文档",
      dataIndex: "doc",
      key: "doc",
      width: 84,
      render: (value: string) => <Tag color="success">{value}</Tag>,
    },
    {
      title: "HTML 样张",
      dataIndex: "preview",
      key: "preview",
      width: 100,
      render: (value: string) => <Tag color="success">{value}</Tag>,
    },
    {
      title: "token / helper",
      dataIndex: "tokenFit",
      key: "tokenFit",
      width: 112,
      render: (value: TokenFit) => <Tag color={tagColorForToken(value)}>{value}</Tag>,
    },
    {
      title: "当前成熟度",
      dataIndex: "maturity",
      key: "maturity",
      width: 100,
      render: (value: Maturity) => <Tag color={tagColorForMaturity(value)}>{value}</Tag>,
    },
    {
      title: "进 DESIGN.md",
      dataIndex: "designMdFit",
      key: "designMdFit",
      width: 128,
      render: (value: DesignMdFit) => <Tag color={tagColorForDesignMd(value)}>{value}</Tag>,
    },
    { title: "主要缺口", dataIndex: "gap", key: "gap", width: 320 },
    { title: "下一步", dataIndex: "next", key: "next", width: 280 },
    {
      title: "优先级",
      dataIndex: "priority",
      key: "priority",
      width: 88,
      render: (value: Priority) => <Tag color={tagColorForPriority(value)}>{value}</Tag>,
    },
  ];

  return <Table columns={columns} dataSource={FOUNDATION_ROWS} pagination={false} size="small" scroll={{ x: 1480 }} />;
}

function TokenGapTable() {
  const columns: ColumnsType<TokenGapRow> = [
    { title: "条目", dataIndex: "item", key: "item", width: 220, fixed: "left" },
    { title: "归属", dataIndex: "owner", key: "owner", width: 150 },
    { title: "当前状态", dataIndex: "current", key: "current", width: 260 },
    {
      title: "建议承载方式",
      dataIndex: "carry",
      key: "carry",
      width: 140,
      render: (value: CarryType) => <Tag color={tagColorForCarry(value)}>{value}</Tag>,
    },
    { title: "为什么", dataIndex: "reason", key: "reason", width: 260 },
    {
      title: "优先级",
      dataIndex: "priority",
      key: "priority",
      width: 88,
      render: (value: Priority) => <Tag color={tagColorForPriority(value)}>{value}</Tag>,
    },
    {
      title: "两周内是否处理",
      dataIndex: "sprint",
      key: "sprint",
      width: 120,
      render: (value: SprintFit) => <Tag color={tagColorForSprint(value)}>{value}</Tag>,
    },
  ];

  return <Table columns={columns} dataSource={TOKEN_GAP_ROWS} pagination={false} size="small" scroll={{ x: 1520 }} />;
}

function PriorityTable() {
  const columns: ColumnsType<(typeof PRIORITY_ROWS)[number]> = [
    { title: "两周内优先项", dataIndex: "item", key: "item", width: 220 },
    { title: "为什么先做", dataIndex: "why", key: "why", width: 300 },
    { title: "不是做什么", dataIndex: "avoid", key: "avoid", width: 220 },
    { title: "建议动作", dataIndex: "action", key: "action", width: 260 },
  ];

  return <Table columns={columns} dataSource={PRIORITY_ROWS} pagination={false} size="small" scroll={{ x: 1000 }} />;
}

function FoundationStatusSpecimen() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginTop: 0 }}>
          Foundation / Token 看板
        </Title>
        <Text type="secondary">
          这页主要给你自己看，帮助判断 foundation 成熟度、token 缺口、承载方式选择，以及两周内最值得推进的收口项。
        </Text>
      </div>

      <Alert
        type="info"
        showIcon
        message="这不是最终 DESIGN.md 正文"
        description="这里保留的是内部推进视角；后面写 DESIGN.md 时，只需要抽一版压缩后的总览，不需要把整张看板原样塞进去。"
      />

      <section>
        <Title level={5}>当前总判断</Title>
        <SummaryBoard />
      </section>

      <section>
        <Title level={5}>Foundation 状态总表</Title>
        <FoundationTable />
      </section>

      <section>
        <Title level={5}>Token 缺口总表</Title>
        <TokenGapTable />
      </section>

      <Alert
        type="warning"
        showIcon
        message="Layout / Grid 先沉淀规则，不急着做独立 token"
        description="目前更重要的是页面骨架、断点、样板间映射和边界说明；像页面边距、最大宽度、侧导宽度、双栏比例这类值，更适合优先判断是否应放进 config / 常量，而不是直接进 token。"
      />

      <section>
        <Title level={5}>两周内最值得做的几件事</Title>
        <PriorityTable />
      </section>
    </Space>
  );
}

export default function FoundationStatusBasicStylePage() {
  return (
    <BasicStylePageLayout
      title="Foundation / Token 看板"
      description="内部工作台：同时看 foundation 成熟度、token 缺口和下一步最值得做的收口项。"
      designDocSource={DASHBOARD_DOC}
      specimen={<FoundationStatusSpecimen />}
    />
  );
}
