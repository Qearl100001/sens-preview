import { Space, Table, Typography } from "antd";
import titleBarDesignDoc from "../../design-system/components/base/title-bar.design.md?raw";
import titleBarDevDoc from "../../design-system/components/base/title-bar.md?raw";
import { SensBreadcrumb, SensButton, SensMoreButton, SensPageTitleBar, SensTitleBar } from "../../ui";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";

const { Text } = Typography;

const matrixRows = [
  { key: "drawer-height", item: "抽屉标题栏高度", value: "72px", token: "SENS_TITLE_BAR_HEIGHT" },
  { key: "page-height", item: "页面标题栏高度", value: "72px", token: "SENS_PAGE_TITLE_BAR_HEIGHT" },
  { key: "bg", item: "背景", value: "theme-title-background", token: 'getColorToken("theme-title-background")' },
  { key: "title", item: "标题字体", value: "20 / 30 / 600", token: "font-size/xxl + line-height/xxl + font-weight/semibold" },
  { key: "right", item: "右侧留白", value: "24px", token: "spacing/6x" },
  { key: "gap", item: "操作间距", value: "16px", token: "spacing/4x" },
  { key: "drawer-back", item: "抽屉返回", value: "链接 / 常规 / 纯图标", token: 'SensButton tone="link" + size/icon/l' },
  { key: "page-back", item: "页面返回", value: "链接 / 弱化 / 纯图标 / 小尺寸", token: 'SensButton tone="linkWeak" size="small" + size/icon/l' },
  { key: "breadcrumb", item: "面包屑", value: "12 / 18 / 400", token: "font-size/s + line-height/s + font-weight/regular" },
];

const breadcrumbItems = [
  { key: "project", label: "项目设置", onClick: () => undefined },
  { key: "data", label: "数据融合", onClick: () => undefined },
  { key: "current", label: "数据源管理" },
];

function TitleBarDemo() {
  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
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
      <SensTitleBar
        title="运营策略名称"
        actions={
          <>
            <SensButton tone="link">编辑</SensButton>
            <SensMoreButton tone="tertiary">更多</SensMoreButton>
          </>
        }
      />
      <SensTitleBar title="复制运营策略" onBack={() => undefined} />

      <Text strong>页面标题栏</Text>
      <SensPageTitleBar
        title="数据源管理"
        breadcrumbItems={breadcrumbItems}
        onBack={() => undefined}
        actions={
          <>
            <SensButton tone="secondary">取消</SensButton>
            <SensButton tone="primary">新建</SensButton>
          </>
        }
      />
      <SensPageTitleBar
        title="设备白名单"
        breadcrumbItems={[
          { key: "project", label: "项目设置", onClick: () => undefined },
          { key: "channel", label: "渠道管理", onClick: () => undefined },
          { key: "strategy", label: "运营策略", onClick: () => undefined },
          { key: "current", label: "设备白名单" },
        ]}
        breadcrumbEllipsis
        onBack={() => undefined}
      />

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
      <Text type="secondary">背景来自导航换肤色 `theme-title-background`，这里故意不使用普通页面背景。</Text>
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
