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
              status: "Foundation 规则库",
              href: "/basic-styles/color",
            },
            {
              title: "基础组件",
              description: "查看已收录基础组件的 Demo、状态矩阵与设计、研发说明。",
              status: "持续完善",
              href: "/components/button",
            },
            {
              title: "复合组件",
              description: "沉淀跨基础组件复用的表单、表格等稳定组合模式。",
              status: "新增入口",
              href: "/composite",
            },
          ],
        },
        {
          title: "下一步沉淀",
          description: "这些内容会继续补入当前 DESIGN.md 和对应规则层。",
          items: [
            {
              title: "Token 对照",
              description: "汇总 Token 名称、语义、适用场景、换肤关系、来源与当前录入状态。",
              status: "下一步",
            },
            {
              title: "真实样板间",
              description: "把业务配置页、管理页等真实场景收敛为可验证页面样板。",
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

export function CompositeLibraryPage() {
  return (
    <ProductIndexPage
      eyebrow="Composite Components"
      title="复合组件"
      description="复合组件沉淀的是可复用的组件组合模式。它不绑定具体业务对象，但会规定基础组件之间的结构、边界、状态和 token 依赖。"
      sections={[
        {
          title: "已收录",
          description: "先承接已经完成基础组件验证、且能跨业务复用的组合模式。",
          items: [
            {
              title: "复合表单",
              description: "带表格、联动和卡片三类表单组合；步骤条、锚点和模态表单等待基础组件补齐。",
              status: "P1 已录入",
              href: "/composite/form",
            },
            {
              title: "复合表格",
              description: "筛选区与录入型表格已完成首轮样张；树表格、嵌套 / 交叉表格继续按复合模式收录。",
              status: "首轮已收录",
              href: "/composite/table",
            },
          ],
        },
        {
          title: "与样板间的关系",
          description: "复合组件讲通用模式，样板间讲业务场景；真实业务对象、流程和页面壳由样板间承接。",
          items: [
            {
              title: "筛选表格",
              description: "筛选区、表格信息区、表格、分页器、批量操作和列设置入口的标准组合。",
              status: "首轮已收录 / 待验",
            },
            {
              title: "录入型表格",
              description: "首轮行内编辑样张已收录；真实校验、增删和滚动规则待补。",
              status: "首轮已收录 / 待补交互",
            },
            {
              title: "树表格",
              description: "层级展开、树节点缩进和父子选择关系；后续服务 SDH 树表格场景。",
              status: "待收录",
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
      description="样板间沉淀真实业务场景中的页面结构、对象流程和使用边界；通用组合模式进入复合组件。"
      sections={[
        {
          title: "已收录",
          description: "样板间只放绑定真实业务对象的页面样板；通用组合模式仍在复合组件维护。",
          items: [
            {
              title: "SDH / 录入型表格场景",
              description: "基于录入型表格复合组件，承接新增元事件、物料元素和属性配置三类录入场景。",
              status: "首轮收录",
              href: "/templates/sdh-editable-table",
            },
          ],
        },
        {
          title: "计划收录",
          description: "先以页面骨架、组件组合和适用边界为核心，而不是只展示一张静态页面。",
          items: [
            {
              title: "SDH / 树表格场景",
              description: "基于树表格复合组件，承接真实层级数据治理场景。",
              status: "待收录",
            },
            {
              title: "业务配置表单",
              description: "基于复合表单，补充具体业务对象、流程、默认值、校验和离开保护。",
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
          description: "当前已经以一份结构化 DESIGN.md 汇总基础规则、组件边界、样板间与验证方式，并持续更新。",
          items: [
            {
              title: "设计系统总览",
              description: "正式总入口：从设计基础、组件、样板间到验证方式的一份可读总览。",
              status: "正式入口",
              href: "/guides/design-system",
            },
            {
              title: "AI 工作规则",
              description: "价值体验原则、一致性流程和页面生成后的校验清单。",
              status: "已沉淀",
              href: "/guides/agent-rules",
            },
            {
              title: "AI 设计方法",
              description: "从 PRD、Spec、模板到前端骨架和人工验收的标准工作流。",
              status: "已沉淀",
              href: "/guides/methodology",
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
