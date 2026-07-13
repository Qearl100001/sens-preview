import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Card, Col, Layout, Row, Space, Tag, Typography, theme } from "antd";
import { Link } from "react-router-dom";

const { Content } = Layout;
const { Paragraph, Text, Title } = Typography;

interface IndexItem {
  title: string;
  description: string;
  status: string;
  href?: string;
}

interface IndexSection {
  title: string;
  description: string;
  items: IndexItem[];
}

interface ProductIndexPageProps {
  eyebrow: string;
  title: string;
  description: string;
  sections: IndexSection[];
}

function IndexCard({ item }: { item: IndexItem }) {
  const { token } = theme.useToken();
  const content = (
    <Card
      hoverable={Boolean(item.href)}
      size="small"
      style={{ height: "100%", borderColor: token.colorBorderSecondary }}
      styles={{ body: { minHeight: 156, display: "flex", flexDirection: "column" } }}
    >
      <Space direction="vertical" size="small" style={{ width: "100%", height: "100%" }}>
        <Tag bordered={false} color="default" style={{ alignSelf: "flex-start", marginInlineEnd: 0 }}>
          {item.status}
        </Tag>
        <Text strong style={{ fontSize: token.fontSizeLG }}>
          {item.title}
        </Text>
        <Paragraph type="secondary" style={{ margin: 0, flex: 1 }}>
          {item.description}
        </Paragraph>
        {item.href ? (
          <Text style={{ color: token.colorPrimary }}>
            查看 <ArrowRightOutlined />
          </Text>
        ) : null}
      </Space>
    </Card>
  );

  return item.href ? (
    <Link to={item.href} style={{ color: "inherit", display: "block", height: "100%" }}>
      {content}
    </Link>
  ) : (
    content
  );
}

function ProductIndexPage({ eyebrow, title, description, sections }: ProductIndexPageProps) {
  const { token } = theme.useToken();

  return (
    <Layout style={{ height: "100%", background: token.colorBgLayout }}>
      <Content style={{ overflow: "auto", padding: token.paddingLG }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div style={{ maxWidth: 760 }}>
              <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
                {eyebrow}
              </Text>
              <Title level={2} style={{ margin: `${token.marginXS}px 0 ${token.marginSM}px` }}>
                {title}
              </Title>
              <Paragraph type="secondary" style={{ margin: 0, fontSize: token.fontSizeLG }}>
                {description}
              </Paragraph>
            </div>

            {sections.map((section) => (
              <section key={section.title}>
                <Space direction="vertical" size="small" style={{ width: "100%", marginBottom: token.marginMD }}>
                  <Title level={4} style={{ margin: 0 }}>
                    {section.title}
                  </Title>
                  <Text type="secondary">{section.description}</Text>
                </Space>
                <Row gutter={[token.marginMD, token.marginMD]}>
                  {section.items.map((item) => (
                    <Col key={item.title} xs={24} sm={12} xl={8}>
                      <IndexCard item={item} />
                    </Col>
                  ))}
                </Row>
              </section>
            ))}
          </Space>
        </div>
      </Content>
    </Layout>
  );
}

export function SystemOverviewPage() {
  return (
    <ProductIndexPage
      eyebrow="Sens.Design"
      title="设计系统概览"
      description="这里是设计基础、组件、页面样板与 AI 验证案例的统一入口。系统状态用于管理建设进度，正式规范则沉淀在对应栏目中。"
      sections={[
        {
          title: "当前工作入口",
          description: "从规则、组件和系统状态三个方向继续推进设计系统。",
          items: [
            {
              title: "系统状态",
              description: "查看 Foundation、Token 和组件的录入状态、缺口与下一步优先级。",
              status: "内部看板",
              href: "/basic-styles/foundation-status",
            },
            {
              title: "基础样式",
              description: "颜色、换肤、栅格、图标与卡片等跨组件的通用规则。",
              status: "11 项规则",
              href: "/basic-styles/color",
            },
            {
              title: "组件库",
              description: "查看已收录组件的 Demo、状态矩阵与设计、研发说明。",
              status: "持续完善",
              href: "/components/button",
            },
          ],
        },
        {
          title: "下一步沉淀",
          description: "这些内容会直接服务于两周后的 DESIGN.md 交付。",
          items: [
            {
              title: "Token 对照",
              description: "汇总 Token 名称、语义、适用场景、换肤关系、来源与当前录入状态。",
              status: "下一步",
            },
            {
              title: "真实样板间",
              description: "把管理列表、创建抽屉、配置表单等可复用页面结构收敛为标准模板。",
              status: "筹备中",
              href: "/templates",
            },
            {
              title: "案例沉淀",
              description: "把现有交互预览转成能说明设计决策、验证过程与系统缺口的案例文章。",
              status: "持续整理",
              href: "/cases",
            },
          ],
        },
      ]}
    />
  );
}

export function TemplateLibraryPage() {
  return (
    <ProductIndexPage
      eyebrow="Page Templates"
      title="样板间"
      description="样板间沉淀的是可复用的页面结构，不绑定具体业务名称。案例验证过的结构达到稳定程度后，再进入这里。"
      sections={[
        {
          title: "计划收录",
          description: "先以页面骨架、组件组合和适用边界为核心，而不是只展示一张静态页面。",
          items: [
            {
              title: "管理列表",
              description: "页面标题、筛选区、工具栏、表格、空态与批量操作的标准组合。",
              status: "待收录",
            },
            {
              title: "创建与编辑抽屉",
              description: "基础信息、字段校验、帮助说明、保存与离开的通用交互结构。",
              status: "待收录",
            },
            {
              title: "详情与配置页",
              description: "信息概览、分组配置、状态反馈和二级操作的页面级骨架。",
              status: "待收录",
            },
          ],
        },
      ]}
    />
  );
}

export function CaseLibraryPage() {
  return (
    <ProductIndexPage
      eyebrow="Cases & AI Validation"
      title="案例"
      description="这里保留与业务、老板和团队对齐过的真实验证。当前先提供可交互预览，后续每个案例会补齐背景、决策、验证结果和设计系统沉淀。"
      sections={[
        {
          title: "已有预览",
          description: "案例与样板间分开管理：案例解释为什么这样做，样板间沉淀可复用的页面结构。",
          items: [
            {
              title: "数据源接入",
              description: "从数据源管理入口到创建连接抽屉的第一阶段 AI 生成验证。",
              status: "已有预览",
              href: "/cases/data-source-connection",
            },
            {
              title: "TikTok Ads 连接列表",
              description: "以数据源接入为基准样例，验证列表、状态、操作与创建流程。",
              status: "已有预览",
              href: "/cases/tiktok-ads-connections",
            },
            {
              title: "AgentEval 评测报告",
              description: "AI 评测数据的报告表达、信息层级与分析交互验证。",
              status: "已有预览",
              href: "/cases/agent-eval-dashboard",
            },
            {
              title: "AI 设计环节 PPT",
              description: "把设计环节 AI 化的工作方式、边界和阶段成果组织为对齐材料。",
              status: "已有预览",
              href: "/cases/ai-design-stage-ppt",
            },
          ],
        },
      ]}
    />
  );
}

export function GuidesHubPage() {
  return (
    <ProductIndexPage
      eyebrow="Standards & Methods"
      title="规范与方法"
      description="这里收纳可执行的设计系统规则、AI 工作方法与交付记录。它不是普通资料库，而是后续页面生成和人工验收都要引用的依据。"
      sections={[
        {
          title: "设计系统交付",
          description: "最终会以一份结构化 DESIGN.md 汇总基础规则、组件边界、样板间与验证方式。",
          items: [
            {
              title: "设计系统总览",
              description: "两周目标交付物：从设计基础、组件、样板间到验证方式的一份可读总览。",
              status: "建设中",
            },
            {
              title: "AI 工作规则",
              description: "价值体验原则、一致性流程和页面生成后的校验清单。",
              status: "已沉淀",
            },
            {
              title: "AI 设计方法",
              description: "从 PRD、Spec、模板到前端骨架和人工验收的标准工作流。",
              status: "已沉淀",
            },
          ],
        },
        {
          title: "工作记录",
          description: "用于回看本轮设计系统建设中已经完成和仍待确认的事项。",
          items: [
            {
              title: "更新记录",
              description: "按日期记录组件、基础规则、Token 与预览工程的重要变化。",
              status: "持续记录",
              href: "/changelog",
            },
          ],
        },
      ]}
    />
  );
}
