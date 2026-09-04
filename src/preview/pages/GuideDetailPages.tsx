import { ArrowRightOutlined } from "@ant-design/icons";
import { Card, Col, Layout, Row, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { getPreviewTokens } from "../previewTokens";

const { Content } = Layout;
const { Paragraph, Text, Title } = Typography;

type GuideRow = Record<string, string>;

interface GuideSection {
  title: string;
  description?: string;
  rows?: GuideRow[];
  columns?: ColumnsType<GuideRow>;
  content?: ReactNode;
}

interface GuidePageProps {
  eyebrow: string;
  title: string;
  description: string;
  sections: GuideSection[];
}

function GuidePage({ eyebrow, title, description, sections }: GuidePageProps) {
  const token = getPreviewTokens();

  return (
    <Layout style={{ height: "100%", background: token.colorBgLayout }}>
      <Content style={{ overflow: "auto", padding: token.paddingLG }}>
        <article style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <header style={{ maxWidth: 760 }}>
              <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
                {eyebrow}
              </Text>
              <Title level={2} style={{ margin: `${token.marginXS}px 0 ${token.marginSM}px` }}>
                {title}
              </Title>
              <Paragraph type="secondary" style={{ margin: 0, fontSize: token.fontSizeLG }}>
                {description}
              </Paragraph>
            </header>

            {sections.map((section) => (
              <section key={section.title}>
                <Space direction="vertical" size="small" style={{ width: "100%" }}>
                  <Title level={4} style={{ margin: 0 }}>
                    {section.title}
                  </Title>
                  {section.description ? <Text type="secondary">{section.description}</Text> : null}
                  {section.content}
                  {section.rows && section.columns ? (
                    <Card size="small" styles={{ body: { padding: 0, overflowX: "auto" } }}>
                      <Table
                        columns={section.columns}
                        dataSource={section.rows}
                        pagination={false}
                        rowKey={(row) => row.key}
                        size="small"
                      />
                    </Card>
                  ) : null}
                </Space>
              </section>
            ))}
          </Space>
        </article>
      </Content>
    </Layout>
  );
}

const assetColumns: ColumnsType<GuideRow> = [
  { title: "层级", dataIndex: "layer", key: "layer", width: 160 },
  { title: "解决的问题", dataIndex: "problem", key: "problem", width: 340 },
  { title: "主入口", dataIndex: "entry", key: "entry" },
];

const taskColumns: ColumnsType<GuideRow> = [
  { title: "任务", dataIndex: "task", key: "task", width: 260 },
  { title: "先读", dataIndex: "reading", key: "reading" },
];

export function DesignSystemGuidePage() {
  const token = getPreviewTokens();

  return (
    <GuidePage
      eyebrow="Design System"
      title="设计系统总览"
      description="Sens.Design 预览工程的正式入口：定位规则、组件、样板间与 AI 验证资产，不替代具体组件规范。"
      sections={[
        {
          title: "这个系统解决什么问题",
          content: (
            <Card size="small">
              <Paragraph style={{ margin: 0 }}>
                将 Figma、Token、组件规则、页面样板和验收方式组织为可执行资产，让 AI 和人按相同规则完成页面生成、评审与交接。
              </Paragraph>
            </Card>
          ),
        },
        {
          title: "资产地图",
          rows: [
            { key: "foundation", layer: "Foundation", problem: "色彩、字号、间距、布局等跨组件规则", entry: "/basic-styles" },
            { key: "base", layer: "基础组件", problem: "单个组件的边界、状态、Token 与验收", entry: "/components" },
            { key: "composite", layer: "复合组件", problem: "跨基础组件的稳定组合模式", entry: "/composite" },
            { key: "template", layer: "样板间", problem: "真实业务对象、流程和页面结构", entry: "/templates" },
            { key: "case", layer: "案例", problem: "已验证的设计决策与 AI 生成过程", entry: "/cases" },
            { key: "change", layer: "更新记录", problem: "已落地变更、待验项和欠账", entry: "/changelog" },
          ],
          columns: assetColumns,
        },
        {
          title: "开始一项任务前",
          rows: [
            { key: "foundation", task: "改 Foundation", reading: "对应 Foundation 文档" },
            { key: "component", task: "改组件", reading: "conventions → 对应组件规则 → 必要 Foundation" },
            { key: "composite", task: "改复合组件 / 样板间", reading: "对应 composite / template 文档 + 已有预览" },
            { key: "review", task: "生成或评审页面", reading: "AI 工作规则" },
            { key: "build", task: "从 PRD / Figma 开始搭建", reading: "AI 设计方法" },
          ],
          columns: taskColumns,
        },
        {
          title: "关联入口",
          content: (
            <Row gutter={[16, 16]}>
              {[
                { title: "AI 工作规则", description: "定义执行红线、页面评审与一致性要求。", href: "/guides/agent-rules" },
                { title: "AI 设计方法", description: "定义从输入到可验收前端骨架的标准流程。", href: "/guides/methodology" },
              ].map((item) => (
                <Col key={item.href} xs={24} md={12}>
                  <Link to={item.href} style={{ display: "block", color: "inherit" }}>
                    <Card hoverable size="small">
                      <Space direction="vertical" size="small">
                        <Text strong>{item.title}</Text>
                        <Text type="secondary">{item.description}</Text>
                        <Text style={{ color: token.colorPrimary }}>
                          查看 <ArrowRightOutlined />
                        </Text>
                      </Space>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          ),
        },
      ]}
    />
  );
}

export function AgentRulesGuidePage() {
  return (
    <GuidePage
      eyebrow="AI Working Rules"
      title="AI 工作规则"
      description="规定 AI 与人如何消费设计系统资产、避免视觉漂移，并完成页面验收。"
      sections={[
        {
          title: "工作原则",
          rows: [
            { key: "read", principle: "先读规则，再写页面", detail: "先判断是 Foundation、基础组件、复合组件还是样板间问题。" },
            { key: "token", principle: "Token 优先，不猜值", detail: "缺失时记录缺口，不临时硬编码。" },
            { key: "reuse", principle: "复用优先，不重造组件", detail: "优先复用已有 Sens 组件、Foundation helper 和稳定组合模式。" },
            { key: "state", principle: "真实状态用真实 props", detail: "禁用、加载、选中、错误等状态由组件行为承接。" },
            { key: "verify", principle: "页面完成必须验收", detail: "验证结构、层级、交互、Token 消费和边界；落地变更进入 changelog。" },
          ],
          columns: [
            { title: "原则", dataIndex: "principle", key: "principle", width: 260 },
            { title: "规则", dataIndex: "detail", key: "detail" },
          ],
        },
        {
          title: "必经检查",
          rows: [
            { key: "start", stage: "开始前", question: "这是哪个层级的问题？已有组件或样板吗？" },
            { key: "work", stage: "实现中", question: "是否使用了已有 Token、组件与规则？" },
            { key: "finish", stage: "完成后", question: "是否出现硬编码颜色/间距、私有 antd 覆盖或规则漂移？" },
            { key: "close", stage: "收口时", question: "是否更新 changelog？是否还有待验或 Missing？" },
          ],
          columns: [
            { title: "阶段", dataIndex: "stage", key: "stage", width: 160 },
            { title: "要回答的问题", dataIndex: "question", key: "question" },
          ],
        },
        {
          title: "深入阅读",
          content: (
            <Card size="small">
              <Space wrap size="small">
                <Tag>价值体验原则</Tag>
                <Tag>一致性流程规则</Tag>
                <Tag>文案规范</Tag>
                <Tag>页面评审清单</Tag>
              </Space>
              <Paragraph type="secondary" style={{ margin: "12px 0 0" }}>
                本页只说明工作入口；具体检查项以 <code>docs/agent-rules/</code> 下对应文档为准。
              </Paragraph>
            </Card>
          ),
        },
      ]}
    />
  );
}

export function AiDesignMethodologyGuidePage() {
  return (
    <GuidePage
      eyebrow="AI Design Methodology"
      title="AI 设计方法"
      description="从设计输入到可运行、可讨论、可验收页面的工作流；AI 负责抽取、生成和检查，人负责判断、校准和验收。"
      sections={[
        {
          title: "标准流程",
          content: (
            <Card size="small">
              <Text code>PRD / Figma / 旧页面 → 结构化输入 → 匹配系统资产 → 前端骨架 → 预览验收 → Changelog / 交接</Text>
            </Card>
          ),
        },
        {
          title: "每一步的产出",
          rows: [
            { key: "understand", stage: "理解输入", output: "页面目标、信息结构、状态和风险", avoid: "不直接照图写 CSS" },
            { key: "match", stage: "匹配系统资产", output: "可复用 Token、组件、组合模式", avoid: "不新造近似组件" },
            { key: "build", stage: "搭建骨架", output: "可交互的页面结构与真实状态", avoid: "不追求一次性像素完美" },
            { key: "review", stage: "验收校准", output: "差异、规则缺口、待确认决策", avoid: "不把猜测写成永久规则" },
            { key: "handoff", stage: "沉淀交接", output: "Changelog、组件/样板文档、后续项", avoid: "不把临时想法当成标准" },
          ],
          columns: [
            { title: "阶段", dataIndex: "stage", key: "stage", width: 150 },
            { title: "产出", dataIndex: "output", key: "output", width: 310 },
            { title: "不做什么", dataIndex: "avoid", key: "avoid" },
          ],
        },
        {
          title: "判断优先级",
          content: (
            <Card size="small">
              <Paragraph style={{ marginBottom: 8 }}>已有组件能解决？能则复用组件；不能则判断 Token / Foundation 是否缺口。</Paragraph>
              <Paragraph style={{ marginBottom: 8 }}>跨组件且稳定复用的模式进入 Composite；绑定业务对象或流程的模式进入 Template 或 Case。</Paragraph>
              <Paragraph type="secondary" style={{ margin: 0 }}>
                成功标准不是“页面看起来像”，而是规则可解释、Token 可追溯、组件可复用、页面可验收、决策可交接。
              </Paragraph>
            </Card>
          ),
        },
      ]}
    />
  );
}
