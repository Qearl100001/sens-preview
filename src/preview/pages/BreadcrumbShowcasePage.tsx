import type { CSSProperties } from "react";
import { Space, Table, Typography } from "antd";
import breadcrumbDesignDoc from "../../design-system/components/base/breadcrumb.design.md?raw";
import breadcrumbDevDoc from "../../design-system/components/base/breadcrumb.md?raw";
import { tokenRgba, getColorToken } from "../../design-system/color-utils";
import { SensBreadcrumb } from "../../ui";
import "../../ui/breadcrumb.css";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";

const { Text } = Typography;

const shortItems = [
  { key: "project", label: "项目设置", onClick: () => undefined },
  { key: "data", label: "数据融合", onClick: () => undefined },
  { key: "current", label: "数据源管理" },
];

const longItems = [
  { key: "a", label: "顶层层级", onClick: () => undefined },
  { key: "b", label: "二级层级", onClick: () => undefined },
  { key: "c", label: "三级层级", onClick: () => undefined },
  { key: "d", label: "四级层级", onClick: () => undefined },
  { key: "e", label: "当前层级" },
];

const truncateItems = [
  { key: "a", label: "项目设置", onClick: () => undefined },
  {
    key: "b",
    label: "这是一条非常非常长的面包屑中间层级名称用于验收单项截断",
    onClick: () => undefined,
  },
  { key: "c", label: "当前页面名称同样很长用于验收末项截断到一百六十像素" },
];

const matrixRows = [
  { key: "type", item: "字号 / 行高 / 字重", value: "12 / 18 / 400", token: "font-size/s + line-height/s + font-weight/regular" },
  { key: "gap", item: "项间距", value: "4px", token: "spacing/1x" },
  { key: "sep", item: "分隔符", value: "/", token: "text-sub-color-transparent @0.58" },
  { key: "default", item: "默认文字色（含当前项）", value: "次级文本", token: "text-sub-color-transparent @0.58" },
  { key: "hover", item: "可点祖先 / more 悬停", value: "链接色", token: "link-color（CSS :hover，对齐 linkWeak）" },
  { key: "active", item: "可点祖先 / more 点击", value: "链接点击色", token: "link-active-color（CSS :active）" },
  { key: "ellipsis", item: "省略态中间项", value: "more · 14px + 下拉", token: 'SensIcon name="more" · size/icon/s · SensDropdownMenu' },
  { key: "truncate", item: "单项过长截断", value: "maxWidth 160", token: "组件内受控常量" },
];

const stateSamples = [
  {
    key: "default",
    label: "默认（含当前项）",
    className: "sens-breadcrumb-current",
    color: tokenRgba("text-sub-color-transparent", 0.58),
  },
  {
    key: "hover",
    label: "可点 · 悬停",
    className: "sens-breadcrumb-link sens-breadcrumb-link--hover",
    color: getColorToken("link-color"),
  },
  {
    key: "active",
    label: "可点 · 点击",
    className: "sens-breadcrumb-link sens-breadcrumb-link--active",
    color: getColorToken("link-active-color"),
  },
];

function BreadcrumbDemo() {
  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Text strong>普通态</Text>
      <SensBreadcrumb items={shortItems} />
      <SensBreadcrumb items={longItems} />
      <Text strong>省略态</Text>
      <SensBreadcrumb ellipsis items={longItems} />
      <Text strong>单项过长截断</Text>
      <SensBreadcrumb items={truncateItems} />
      <Text type="secondary">
        全路径默认同为次级灰（当前项不加深）；可点祖先与 more 悬停变 link-color。省略 more 点击展开下拉；无
        onClick 的中间项仍可点以关闭浮层。
      </Text>
    </Space>
  );
}

function BreadcrumbMatrix() {
  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Text type="secondary">本矩阵为规则摘要；与上方真实 Demo 同为验收对象。</Text>
      <div>
        <Text strong>文字色样张</Text>
        <Space size="large" style={{ display: "flex", marginTop: 8, flexWrap: "wrap" }}>
          {stateSamples.map((sample) => (
            <span key={sample.key} style={{ display: "inline-flex", flexDirection: "column", gap: 4 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {sample.label}
              </Text>
              <span
                className={sample.className}
                style={
                  {
                    "--sens-breadcrumb-text": tokenRgba("text-sub-color-transparent", 0.58),
                    "--sens-breadcrumb-hover": getColorToken("link-color"),
                    "--sens-breadcrumb-active": getColorToken("link-active-color"),
                    fontSize: 12,
                    lineHeight: "18px",
                  } as CSSProperties
                }
              >
                示例文案
              </span>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {sample.color}
              </Text>
            </span>
          ))}
        </Space>
      </div>
      <Table
        size="small"
        pagination={false}
        rowKey="key"
        dataSource={matrixRows}
        columns={[
          { title: "项目", dataIndex: "item", key: "item", width: 180 },
          { title: "值", dataIndex: "value", key: "value", width: 160 },
          { title: "token / 代码入口", dataIndex: "token", key: "token" },
        ]}
      />
    </Space>
  );
}

export default function BreadcrumbShowcasePage() {
  return (
    <ComponentShowcaseLayout
      title="面包屑 Breadcrumb"
      demo={<BreadcrumbDemo />}
      matrix={<BreadcrumbMatrix />}
      designDocSource={breadcrumbDesignDoc}
      devDocSource={breadcrumbDevDoc}
    />
  );
}
