import { Alert, Space, Table, Tag, Typography, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import { getColorToken, tokenRgba } from "../../../design-system/color-utils";
import colorDocSource from "../../../../docs/foundations/color.md?raw";
import { BasicStylePageLayout } from "./BasicStylePageLayout";

const { Text, Title } = Typography;

interface ColorItem {
  key: string;
  name: string;
  handle: string;
  antd: string;
  usage: string;
}

const LAYER_ROWS = [
  { key: "palette", layer: "基础色板", example: "基础色板/冰绽蓝/10", usage: "只作为设计源、审计源、换肤映射源", direct: "否" },
  { key: "semantic", layer: "语义 handle", example: "component-primary / link-color / text-color", usage: "组件和 helper 的主要来源", direct: "可以" },
  { key: "antd", layer: "antd token", example: "colorPrimary / colorLink / colorText", usage: "antd 组件实现承接层", direct: "可以" },
  { key: "helper", layer: "helper 派生", example: "tokenRgba(handle, alpha)", usage: "透明色、投影、特殊 alpha 场景", direct: "可以" },
];

const FUNCTIONAL_COLORS: ColorItem[] = [
  { key: "primary", name: "主色", handle: "component-primary", antd: "colorPrimary", usage: "主按钮、主操作、选中态" },
  { key: "hover", name: "悬停", handle: "component-hover", antd: "colorPrimaryHover", usage: "功能性 hover" },
  { key: "active", name: "点击", handle: "component-active", antd: "colorPrimaryActive", usage: "点击态、激活态" },
  { key: "disable", name: "禁用", handle: "component-disable", antd: "待组件映射", usage: "功能色禁用态" },
  { key: "active-bg", name: "选中背景", handle: "component-active-background", antd: "待组件映射", usage: "选中项背景" },
  { key: "active-hover-bg", name: "选中 hover 背景", handle: "component-active-hover-background", antd: "待组件映射", usage: "选中项 hover 背景" },
  { key: "active-click-bg", name: "选中 click 背景", handle: "component-active-click-background", antd: "待组件映射", usage: "选中项点击背景" },
  { key: "light-bg", name: "浅色背景", handle: "component-light-background", antd: "待组件映射", usage: "功能浅底" },
  { key: "shadow", name: "点击投影源色", handle: "component-active-shadow", antd: "helper 派生", usage: "active ring / 点击投影源色" },
];

const STATUS_COLORS: ColorItem[] = [
  { key: "link", name: "链接", handle: "link-color", antd: "colorLink / colorInfo", usage: "表格操作、普通跳转、帮助文档" },
  { key: "link-hover", name: "链接 hover", handle: "link-hover-color", antd: "colorLinkHover", usage: "链接悬停" },
  { key: "link-active", name: "链接 active", handle: "link-active-color", antd: "colorLinkActive", usage: "链接点击" },
  { key: "success", name: "成功", handle: "success-color", antd: "colorSuccess", usage: "成功状态点、成功反馈" },
  { key: "info", name: "提醒黄", handle: "info-color", antd: "colorWarning", usage: "提醒、注意，不等同于 antd info" },
  { key: "warning", name: "警告红", handle: "warning-color", antd: "colorError", usage: "删除、危险确认、错误态" },
  { key: "warning-hover", name: "警告 hover", handle: "warning-color-hover", antd: "colorErrorHover", usage: "危险操作悬停" },
  { key: "warning-active", name: "警告 active", handle: "warning-color-active", antd: "colorErrorActive", usage: "危险操作点击" },
];

const NEUTRAL_COLORS: ColorItem[] = [
  { key: "text", name: "主文本", handle: "text-color", antd: "colorText", usage: "标题、正文主信息" },
  { key: "article", name: "大段正文", handle: "text-article-color", antd: "待映射", usage: "长文本、信息说明" },
  { key: "sub", name: "次级文本", handle: "text-sub-color", antd: "colorTextSecondary", usage: "描述、辅助说明" },
  { key: "disabled", name: "禁用文本", handle: "text-color-disable", antd: "colorTextTertiary", usage: "禁用、不可操作" },
  { key: "outline", name: "默认边框", handle: "outline-color", antd: "colorBorder", usage: "输入框、卡片、容器边界" },
  { key: "divider", name: "浅分割线", handle: "divideline-color-light", antd: "colorBorderSecondary", usage: "表格、分割线" },
  { key: "layout-bg", name: "页面灰底", handle: "background-grey", antd: "colorBgLayout", usage: "页面背景" },
  { key: "container-bg", name: "容器白底", handle: "white", antd: "colorBgContainer", usage: "卡片、表格、抽屉内容" },
];

const ALPHA_ROWS = [
  { key: "text-90", label: "主文本透明", handle: "text-color-transparent", alpha: 0.9, usage: "高强调文字透明派生" },
  { key: "sub-58", label: "辅助文字透明", handle: "text-sub-color-transparent", alpha: 0.58, usage: "辅助文字透明派生" },
  { key: "outline-08", label: "透明边框", handle: "outline-color-transparent", alpha: 0.08, usage: "透明边框 / 弱边界" },
];

const TIKTOK_ROWS = [
  { key: "management", scene: "数据源管理页", rule: "页面灰底 + 白色内容容器 + 中性色文字", status: "通用颜色" },
  { key: "card", scene: "数据源卡片", rule: "白底、浅边框，hover 使用功能色边框和投影", status: "功能色 + 中性色" },
  { key: "empty", scene: "TikTok 空态", rule: "主文案用主文本，辅助文案用次级文本", status: "中性色" },
  { key: "drawer", scene: "创建连接抽屉", rule: "表单正文主文本，提示辅助色，错误态警告红", status: "中性色 + 状态色" },
  { key: "table", scene: "连接列表", rule: "操作链接用 colorLink，状态点用成功 / 禁用", status: "状态色" },
  { key: "danger", scene: "删除 / 危险行为", rule: "警告红 + 一致性流程规则做挽留确认", status: "状态色" },
];

const ISSUE_ROWS = [
  { key: "skin", issue: "全局功能色换肤未完成", status: "先记录", next: "单独立项，尽早排期" },
  { key: "navigation", issue: "导航主题色系统独立", status: "已拆分", next: "见 navigation-color.md" },
  { key: "generated", issue: "theme.ts 内有大量 hex", status: "生成文件现状", next: "找到 token 源或重建生成链路后处理" },
  { key: "fallback", issue: "组件内仍有 fallback hex / rgba", status: "不批量改", next: "进入对应组件时逐个解决" },
  { key: "ant-overrides", issue: ".ant-* 覆盖和 !important 较多", status: "不一刀切", next: "单组件验收时说明必要性或替换为 token / props" },
  { key: "palette", issue: "基础色板完整样张缺失", status: "暂不影响 TikTok case", next: "Foundation 展示页阶段补" },
];

function ColorCard({ item, extra }: { item: ColorItem; extra?: string }) {
  const { token } = theme.useToken();
  const color = getColorToken(item.handle);

  return (
    <div
      style={{
        padding: token.paddingMD,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadius,
        background: token.colorBgContainer,
      }}
    >
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <div
          style={{
            height: 48,
            borderRadius: token.borderRadius,
            border: `1px solid ${token.colorBorderSecondary}`,
            background: color,
          }}
        />
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Text strong>{item.name}</Text>
          <Text code>{color}</Text>
        </Space>
        <Text code>{item.handle}</Text>
        <Text type="secondary">antd：{item.antd}</Text>
        <Text type="secondary">{item.usage}</Text>
        {extra ? <Tag color="processing">{extra}</Tag> : null}
      </Space>
    </div>
  );
}

function ColorGrid({ items, extra }: { items: ColorItem[]; extra?: string }) {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: token.marginMD,
      }}
    >
      {items.map((item) => (
        <ColorCard key={item.key} item={item} extra={extra} />
      ))}
    </div>
  );
}

function LayerTable() {
  const columns: ColumnsType<(typeof LAYER_ROWS)[number]> = [
    { title: "层级", dataIndex: "layer", key: "layer", width: 140 },
    { title: "示例", dataIndex: "example", key: "example" },
    { title: "代码能否直接用", dataIndex: "direct", key: "direct", width: 150 },
    { title: "说明", dataIndex: "usage", key: "usage" },
  ];

  return <Table columns={columns} dataSource={LAYER_ROWS} pagination={false} size="small" />;
}

function AlphaBoard() {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: token.marginMD,
      }}
    >
      {ALPHA_ROWS.map((item) => {
        const color = tokenRgba(item.handle, item.alpha);

        return (
          <div
            key={item.key}
            style={{
              padding: token.paddingMD,
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: token.borderRadius,
              background: token.colorBgContainer,
            }}
          >
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              <div
                style={{
                  height: 48,
                  borderRadius: token.borderRadius,
                  border: `1px solid ${token.colorBorderSecondary}`,
                  background: `linear-gradient(90deg, ${color} 0 50%, ${token.colorBgLayout} 50% 100%)`,
                }}
              />
              <Text strong>{item.label}</Text>
              <Text code>
                {item.handle} @{item.alpha}
              </Text>
              <Text code>{color}</Text>
              <Text type="secondary">{item.usage}</Text>
            </Space>
          </div>
        );
      })}
    </div>
  );
}

function TikTokUsageTable() {
  const columns: ColumnsType<(typeof TIKTOK_ROWS)[number]> = [
    { title: "场景", dataIndex: "scene", key: "scene", width: 180 },
    { title: "规则", dataIndex: "rule", key: "rule" },
    {
      title: "类型",
      dataIndex: "status",
      key: "status",
      width: 160,
      render: (value: string) => <Tag color={value.includes("功能色") ? "processing" : "success"}>{value}</Tag>,
    },
  ];

  return <Table columns={columns} dataSource={TIKTOK_ROWS} pagination={false} size="small" />;
}

function IssueTable() {
  const columns: ColumnsType<(typeof ISSUE_ROWS)[number]> = [
    { title: "问题", dataIndex: "issue", key: "issue" },
    { title: "当前处理", dataIndex: "status", key: "status", width: 160 },
    { title: "建议时机", dataIndex: "next", key: "next" },
  ];

  return <Table columns={columns} dataSource={ISSUE_ROWS} pagination={false} size="small" />;
}

function ColorSpecimen() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginTop: 0 }}>
          颜色语义样张
        </Title>
        <Text type="secondary">
          这里展示 Color Foundation 的语义 handle、antd 承接关系、透明色派生和 TikTok case 用色准入；当前页面只做验收样张，不改真实组件颜色。
        </Text>
      </div>

      <section>
        <Title level={5}>四层关系</Title>
        <LayerTable />
      </section>

      <section>
        <Title level={5}>功能色（可换肤语义色）</Title>
        <ColorGrid items={FUNCTIONAL_COLORS} extra="当前展示绿色基线" />
      </section>

      <Alert
        type="info"
        showIcon
        message="功能色涉及换肤"
        description="本页展示的是当前绿色功能色基线；业务代码应使用 component-* / antd token / helper，不应把绿色 hex 当作不可变业务色。"
      />

      <section>
        <Title level={5}>状态色</Title>
        <ColorGrid items={STATUS_COLORS} />
      </section>

      <Alert
        type="warning"
        showIcon
        message="状态色映射不可随意纠正"
        description="Sens.Design 的提醒黄映射到 antd colorWarning，警告红映射到 antd colorError；表格操作和帮助链接使用链接蓝，删除和危险确认使用警告红。"
      />

      <section>
        <Title level={5}>中性色</Title>
        <ColorGrid items={NEUTRAL_COLORS} />
      </section>

      <section>
        <Title level={5}>透明色 / Alpha</Title>
        <AlphaBoard />
      </section>

      <section>
        <Title level={5}>TikTok Case 用色准入</Title>
        <TikTokUsageTable />
      </section>

      <Alert
        type="info"
        showIcon
        message="导航颜色已拆分"
        description="顶导航、侧导航、标题栏、页面主题背景和导航换肤映射不在本页验收，后续进入 Navigation Color Foundation。"
      />

      <section>
        <Title level={5}>当前问题与处理策略</Title>
        <IssueTable />
      </section>
    </Space>
  );
}

export default function ColorBasicStylePage() {
  return (
    <BasicStylePageLayout
      title="颜色"
      description="统一基础色板、语义 color handle、antd theme token、helper 和组件页面之间的用色关系。"
      designDocSource={colorDocSource}
      specimen={<ColorSpecimen />}
    />
  );
}
