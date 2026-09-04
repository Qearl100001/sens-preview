import { Alert, Card, Col, Row, Space, Table, Tag, Typography } from "antd";
import productShellDoc from "../../design-system/components/composite/product-shell.md?raw";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";
import { getPreviewTokens } from "../previewTokens";

const { Paragraph, Text } = Typography;

const layerColumns = [
  { title: "层级", dataIndex: "level", key: "level", width: 96 },
  { title: "区域", dataIndex: "area", key: "area", width: 180 },
  { title: "验收重点", dataIndex: "rule", key: "rule" },
];

const layerRows = [
  { key: "top", level: "1", area: "顶部导航 / 氛围层", rule: "顶导负责产品级入口与全局浮层；氛围层可延展但不占正文流。" },
  { key: "side", level: "2", area: "侧边导航", rule: "侧导从 82px 位置叠放，承接当前一级功能域下的页面目录。" },
  { key: "content", level: "3", area: "右侧内容区域", rule: "内容面板与标题栏承接页面主体，标题栏上沿使用 radius/xl 场景。" },
  { key: "panel", level: "4", area: "内容浮层", rule: "Drawer / Modal / Popover 等内容浮层压在内容面板之上。" },
  { key: "global", level: "5", area: "导航浮层", rule: "顶导浮层不得被标题栏、侧导、内容面板、卡片或表格遮盖。" },
];

const responsibilityColumns = [
  { title: "正式资产", dataIndex: "asset", key: "asset", width: 220 },
  { title: "Product Shell 中的职责", dataIndex: "responsibility", key: "responsibility" },
  { title: "验收入口", dataIndex: "entry", key: "entry", width: 260 },
];

const responsibilityRows = [
  {
    key: "top-navigation",
    asset: "SensTopNavigation",
    responsibility: "产品 / 项目 / 一级功能域 / 右上功能入口 / 顶导浮层。",
    entry: "/components/top-navigation",
  },
  {
    key: "side-navigation",
    asset: "ProductShellSideNavigation",
    responsibility: "当前一级功能域下的页面目录、收起 / 展开、滚动与侧导层级。",
    entry: "/components/side-navigation",
  },
  {
    key: "title-bar",
    asset: "SensPageTitleBar / SensTitleBar",
    responsibility: "当前页面标题、面包屑、返回、页面级操作。",
    entry: "/components/title-bar",
  },
    {
    key: "templates",
    asset: "样板间页面",
    responsibility: "真实业务页面验证产品壳组合关系，禁止复制局部导航壳。",
    entry: "/templates/product-shell/t · /templates/product-shell/vertical · /templates/card/entry-settings",
  },
];

function ShellRelationshipDemo() {
  const token = getPreviewTokens();

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Alert
        type="info"
        showIcon
        message="当前是产品壳组合规则页"
        description="Product Shell 先作为复合规则收录：它组织顶部导航、侧边导航、标题栏、内容区、全局浮层和回到顶部能力；当前不新增独立 React 组件。固定高度样板间见 /templates/product-shell/t（T型）与 /templates/product-shell/vertical（上下布局）。"
      />
      <Row gutter={[token.marginMD, token.marginMD]}>
        {[
          ["顶部导航", "全局产品入口、项目切换、业务入口、账号与功能浮层。"],
          ["侧边导航", "一级功能域内页面目录，负责展开、收起、悬浮和长菜单滚动。"],
          ["标题栏", "当前页面标题、面包屑、返回和页面级操作。"],
          ["内容面板", "承接表格、表单、卡片、空态和业务浮层。"],
        ].map(([title, description]) => (
          <Col key={title} xs={24} md={12}>
            <Card size="small" title={title}>
              <Paragraph style={{ margin: 0 }}>{description}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
      <Card size="small" title="核心关系">
        <Space wrap>
          <Tag color="green">内容从 82px 起叠放</Tag>
          <Tag color="green">标题栏上沿 radius/xl</Tag>
          <Tag color="green">顶导浮层不被遮盖</Tag>
          <Tag color="green">样板间调用基础组件</Tag>
          <Tag color="green">内容区滚动承接回到顶部</Tag>
        </Space>
      </Card>
    </Space>
  );
}

function ShellRuleMatrix() {
  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Table columns={layerColumns} dataSource={layerRows} pagination={false} size="small" />
      <Table columns={responsibilityColumns} dataSource={responsibilityRows} pagination={false} size="small" />
      <Text type="secondary">
        这里展示的是组合规则与验收入口；真实页面效果由样板间承接，具体组件能力仍回到对应基础组件页面验收。
      </Text>
    </Space>
  );
}

export default function ProductShellCompositePage() {
  return (
    <ComponentShowcaseLayout
      title="产品壳 Product Shell"
      demo={<ShellRelationshipDemo />}
      matrix={<ShellRuleMatrix />}
      designDocSource={productShellDoc}
      devDocSource={productShellDoc}
    />
  );
}
