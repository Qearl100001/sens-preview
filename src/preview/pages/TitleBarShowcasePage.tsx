import { Space, Table, Typography } from "antd";
import titleBarDesignDoc from "../../design-system/components/base/title-bar.design.md?raw";
import titleBarDevDoc from "../../design-system/components/base/title-bar.md?raw";
import { SensBreadcrumb, SensButton, SensPageTitleBar, SensTitleBar } from "../../ui";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";

const { Text } = Typography;

const matrixRows = [
  { key: "drawer-height", item: "抽屉标题栏高度", value: "72px", token: "SENS_TITLE_BAR_HEIGHT" },
  { key: "page-height", item: "页面标题栏高度", value: "72px / 94px", token: "SENS_PAGE_TITLE_BAR_HEIGHT / descriptionHeight" },
  { key: "landing-bg", item: "落地页背景", value: "white", token: 'getColorToken("white")' },
  { key: "drilldown-bg", item: "下钻页背景", value: "theme-title-background", token: 'getColorToken("theme-title-background")' },
  { key: "title", item: "标题字体", value: "20 / 30 / 600", token: "font-size/xxl + line-height/xxl + font-weight/semibold" },
  { key: "desc", item: "辅助文案", value: "12 / 18 / 400", token: "font-size/s + line-height/s + font-weight/regular" },
  { key: "breadcrumb-gap", item: "面包屑到标题", value: "2px", token: "spacing/0․5x" },
  { key: "breadcrumb-top", item: "面包屑距顶（有面包屑）", value: "11px", token: "breadcrumbVerticalInset / breadcrumbVerticalInsetWithDescription" },
  { key: "title-band", item: "一级标题行高（有面包屑）", value: "30px", token: "line-height/xxl" },
  { key: "icon-top", item: "返回 icon 顶边距顶（有面包屑）", value: "35px", token: "breadcrumbVerticalInset + line-height/s + spacing/0․5x + (line-height/xxl − size/icon/l)/2" },
  { key: "action-top", item: "右侧操作距顶（有面包屑）", value: "20px", token: "spacing/5x" },
  { key: "description-gap", item: "标题到辅助文案", value: "4px", token: "spacing/1x" },
  { key: "left-back", item: "左侧留白（有返回）", value: "2px", token: "spacing/0․5x" },
  { key: "left-landing", item: "左侧留白（落地页无返回）", value: "24px", token: "spacing/6x" },
  { key: "right", item: "右侧留白", value: "24px", token: "spacing/6x" },
  { key: "gap", item: "操作间距", value: "16px", token: "spacing/4x" },
  { key: "drawer-back", item: "抽屉返回", value: "链接 / 弱化 / 纯图标 / 24px 热区", token: 'SensButton tone="linkWeak" + size/icon/l + spacing/6x' },
  { key: "page-back", item: "页面返回", value: "链接 / 弱化 / 纯图标 / 24px 热区", token: 'SensButton tone="linkWeak" + size/icon/l + spacing/6x' },
  { key: "breadcrumb", item: "面包屑", value: "12 / 18 / 400", token: "font-size/s + line-height/s + font-weight/regular" },
];

const breadcrumbItems = [
  { key: "project", label: "项目设置", onClick: () => undefined },
  { key: "data", label: "数据融合", onClick: () => undefined },
  { key: "current", label: "数据源管理" },
];

const longBreadcrumbItems = [
  { key: "project", label: "广告投放分析", onClick: () => undefined },
  { key: "config", label: "管理与配置", onClick: () => undefined },
  { key: "channel", label: "渠道管理", onClick: () => undefined },
  { key: "strategy", label: "渠道归因设置", onClick: () => undefined },
  { key: "current", label: "设备白名单" },
];

function TitleBarDemo() {
  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Text strong>页面标题栏</Text>
      <SensPageTitleBar
        variant="landing"
        title="数据源管理"
        actions={<SensButton tone="secondary">Schema 管理</SensButton>}
      />
      <SensPageTitleBar
        variant="landing"
        title="设备白名单"
        description="白名单中的设备在激活保护期内重装激活时，可多次触发广告归因并进行转化回传。"
        actions={<SensButton tone="primary">添加设备</SensButton>}
      />
      <SensPageTitleBar
        variant="drilldown"
        title="渠道归因设置"
        breadcrumbItems={longBreadcrumbItems}
        breadcrumbEllipsis
        onBack={() => undefined}
        actions={<SensButton tone="secondary">设备白名单</SensButton>}
      />
      <SensPageTitleBar
        variant="drilldown"
        title="设备白名单"
        description="白名单中的设备在激活保护期内重装激活时，可多次触发广告归因并进行转化回传，适合在媒体平台转化联调时使用。"
        breadcrumbItems={longBreadcrumbItems}
        breadcrumbEllipsis
        onBack={() => undefined}
        actions={<SensButton tone="primary">添加设备</SensButton>}
      />

      <Text strong>抽屉标题栏</Text>
      <SensTitleBar
        title="创建运营策略"
        onBack={() => undefined}
        actions={
          <>
            <SensButton tone="secondary">取消</SensButton>
            <SensButton tone="primary">保存</SensButton>
          </>
        }
      />
      <SensTitleBar title="复制运营策略" onBack={() => undefined} />

      <Text strong>面包屑</Text>
      <Space direction="vertical" size="small">
        <SensBreadcrumb items={breadcrumbItems} />
        <SensBreadcrumb
          ellipsis
          items={[
            { key: "a", label: "一级目录", onClick: () => undefined },
            { key: "b", label: "二级目录", onClick: () => undefined },
            { key: "c", label: "三级目录", onClick: () => undefined },
            { key: "d", label: "当前页面" },
          ]}
        />
      </Space>
      <Text type="secondary">
        右侧操作始终和大标题行对齐；返回入口使用 24px 热区，图标距左侧 2px。
      </Text>
    </Space>
  );
}

function TitleBarMatrix() {
  return (
    <Table
      size="small"
      pagination={false}
      rowKey="key"
      dataSource={matrixRows}
      columns={[
        { title: "项目", dataIndex: "item", key: "item", width: 140 },
        { title: "值", dataIndex: "value", key: "value", width: 180 },
        { title: "token / 代码入口", dataIndex: "token", key: "token" },
      ]}
    />
  );
}

export default function TitleBarShowcasePage() {
  return (
    <ComponentShowcaseLayout
      title="标题栏 TitleBar"
      demo={<TitleBarDemo />}
      matrix={<TitleBarMatrix />}
      designDocSource={titleBarDesignDoc}
      devDocSource={titleBarDevDoc}
    />
  );
}
