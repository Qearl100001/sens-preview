import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Divider,
  Form,
  Input,
  Select,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
  Typography,
} from "antd";
import { useTranslation } from "react-i18next";
import SensitiveDataDecryptDrawer from "../components/SensitiveDataDecryptDrawer";
import SchemaTable from "../features/schema-management/SchemaTable";
import TrackingPlanManagementPage from "../features/tracking-plan-management/TrackingPlanManagementPage";
import {
  BadgeStatesPreview,
  ButtonStatesPreview,
  SearchStatesPreview,
  SensBasicTabs,
  SensEditableCardTabs,
  SensPillTabs,
  TabsStatesPreview,
} from "../ui";
import tokens from "../design-system/tokens.resolved.json";

const { Title, Text } = Typography;

const c = tokens.color as Record<string, string>;

/** 旧版单页全量预览，保留矩阵与页面级 demo 供对照 */
export default function LegacyPreviewPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { t } = useTranslation();

  const navKeys = ["可视化", "报表", "概览", "业务集市", "管理中心", "分析"];

  const columns = [
    { title: t("导航.概览"), dataIndex: "name", key: "name" },
    { title: t("导航.分析"), dataIndex: "type", key: "type" },
    {
      title: t("导航.管理中心"),
      key: "on",
      render: () => <Switch defaultChecked />,
    },
  ];
  const data = [
    { key: 1, name: t("导航.可视化"), type: t("导航.报表") },
    { key: 2, name: t("导航.业务集市"), type: t("导航.分析") },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Card title="敏感数据解密（Figma 设计稿还原）" size="small">
        <Button type="primary" onClick={() => setDrawerOpen(true)}>
          打开「编辑敏感数据解密」抽屉
        </Button>
      </Card>

      <SensitiveDataDecryptDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSave={(fields) => console.log("保存解密字段:", fields)}
      />

      <Card
        title={t("组件库.sensd-button-previewTitle", { defaultValue: "按钮变体×状态矩阵" })}
        size="small"
        styles={{ body: { overflowX: "auto" } }}
      >
        <ButtonStatesPreview />
        <Divider style={{ margin: "16px 0" }} />
        <Space>
          <Button type="primary">主按钮</Button>
          <Button>描边按钮</Button>
        </Space>
      </Card>

      <Card title="搜索（Figma 2216:10655 · 变体×状态矩阵）" size="small" styles={{ body: { overflowX: "auto" } }}>
        <SearchStatesPreview />
      </Card>

      <Card title="标签页（Figma 2220:10665 · 变体×状态矩阵）" size="small" styles={{ body: { overflowX: "auto" } }}>
        <Tabs
          items={[
            { key: "basic", label: "基础标签页", children: <SensBasicTabs withBadge /> },
            { key: "editable", label: "页签标签页", children: <SensEditableCardTabs /> },
            { key: "pill", label: "胶囊标签页", children: <SensPillTabs withBadge /> },
          ]}
        />
        <Divider style={{ margin: "16px 0" }} />
        <TabsStatesPreview />
      </Card>

      <Card title="徽标（Figma 2222:10668 · 常规/状态/弱化）" size="small" styles={{ body: { overflowX: "auto" } }}>
        <BadgeStatesPreview />
      </Card>

      <Card title="状态色（核对 error/warning 语义对法）" size="small">
        <Space wrap>
          <Tag color="success">success {c["success-color"]}</Tag>
          <Tag color="warning">warning {c["info-color"]}</Tag>
          <Tag color="error">error {c["warning-color"]}</Tag>
          <Tag color="processing">info {c["link-color"]}</Tag>
        </Space>
        <Divider style={{ margin: "12px 0" }} />
        <Space direction="vertical" style={{ width: "100%" }}>
          <Alert type="success" showIcon message="成功 success" />
          <Alert type="warning" showIcon message="提醒 warning（你们的「提醒」=琥珀）" />
          <Alert type="error" showIcon message="警告 error（你们的「警告」=红）" />
          <Alert type="info" showIcon message="链接 info" />
        </Space>
      </Card>

      <Card title="表单 / 表格（复合层这里先用 antd 占位）" size="small">
        <Form layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item label={t("导航.可视化")}>
            <Input placeholder={t("导航.报表")} />
          </Form.Item>
          <Form.Item label={t("导航.分析")}>
            <Select
              style={{ width: 140 }}
              options={navKeys.map((k) => ({ label: t(`导航.${k}`), value: k }))}
              defaultValue="可视化"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary">{t("导航.概览")}</Button>
          </Form.Item>
        </Form>
        <Table columns={columns} dataSource={data} pagination={false} size="middle" />
      </Card>

      <Text type="secondary">
        切「功能色换肤」「中/EN」：绿/蓝只改主色按钮等功能色，链接等状态色保持冰绽蓝不变。
      </Text>

      <div>
        <Title level={4} style={{ marginBottom: 16 }}>
          Schema 管理列表（Figma 设计稿 · table.md 规范）
        </Title>
        <div style={{ overflow: "auto" }}>
          <SchemaTable />
        </div>
      </div>

      <div>
        <Title level={4} style={{ marginBottom: 16 }}>
          埋点方案管理（Figma 设计稿 · table.md 规范）
        </Title>
        <div style={{ overflow: "auto" }}>
          <TrackingPlanManagementPage />
        </div>
      </div>
    </Space>
  );
}
