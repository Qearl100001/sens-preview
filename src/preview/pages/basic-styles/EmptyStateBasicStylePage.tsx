import type { ReactNode } from "react";
import { Space, Typography, message } from "antd";
import emptyStateDocSource from "../../../../docs/foundations/empty-state.md?raw";
import { getUnitToken } from "../../../design-system/unit";
import { tokenRgba } from "../../../design-system/color-utils";
import {
  SensEmptyState,
  PAGE_EMPTY_ILLUSTRATIONS,
  NON_PAGE_EMPTY_ILLUSTRATIONS,
  type PageEmptyType,
  type NonPageEmptyType,
} from "../../../ui";
import { BasicStylePageLayout } from "./BasicStylePageLayout";
import { getPreviewTokens } from "../../previewTokens";

const { Text, Title } = Typography;

const PAGE_TYPES: Array<{ type: PageEmptyType; label: string }> = [
  { type: "notFound", label: "404 页面" },
  { type: "networkError", label: "网络异常" },
  { type: "searchNoResult", label: "搜索无结果" },
  { type: "noData", label: "暂无数据" },
  { type: "noPermission", label: "暂无权限" },
];

const NON_PAGE_TYPES: Array<{ type: NonPageEmptyType; label: string }> = [
  { type: "networkError", label: "网络异常" },
  { type: "noResult", label: "暂无结果" },
  { type: "noData", label: "暂无数据" },
  { type: "loadFailed", label: "加载失败" },
  { type: "noPermission", label: "暂无权限" },
];

function SpecimenCard({
  label,
  note,
  children,
}: {
  label: string;
  note?: string;
  children: ReactNode;
}) {
  const token = getPreviewTokens();
  return (
    <div
      style={{
        padding: token.paddingMD,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadius,
        background: token.colorBgContainer,
        display: "flex",
        flexDirection: "column",
        gap: token.marginSM,
        minWidth: 0,
      }}
    >
      <div>
        <Text strong>{label}</Text>
        {note ? (
          <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
            {note}
          </Text>
        ) : null}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 120,
          background: tokenRgba("background-transparent-grey", 0.04),
          borderRadius: token.borderRadius,
          padding: getUnitToken("spacing/4x"),
        }}
      >
        {children}
      </div>
    </div>
  );
}

function EmptyStateSpecimen() {
  const token = getPreviewTokens();
  const onAction = () => message.info("触发空态操作");

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginTop: 0 }}>
          插画资产 · 页面级 266
        </Title>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: token.marginMD,
          }}
        >
          {PAGE_TYPES.map(({ type, label }) => (
            <SpecimenCard key={`page-art-${type}`} label={label} note="page/*.png">
              <img src={PAGE_EMPTY_ILLUSTRATIONS[type]} alt="" width={133} height={133} draggable={false} />
            </SpecimenCard>
          ))}
        </div>
      </div>

      <div>
        <Title level={5}>插画资产 · 非页面级 100</Title>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: token.marginMD,
          }}
        >
          {NON_PAGE_TYPES.map(({ type, label }) => (
            <SpecimenCard key={`non-page-art-${type}`} label={label} note="non-page/*.png">
              <img
                src={NON_PAGE_EMPTY_ILLUSTRATIONS[type]}
                alt=""
                width={100}
                height={100}
                draggable={false}
              />
            </SpecimenCard>
          ))}
        </div>
      </div>

      <div>
        <Title level={5}>页面级 · 大尺寸（266）</Title>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: token.marginMD,
          }}
        >
          {PAGE_TYPES.map(({ type, label }) => (
            <SpecimenCard key={`page-lg-${type}`} label={label} note="scope=page size=large">
              <SensEmptyState scope="page" type={type} size="large" onAction={onAction} />
            </SpecimenCard>
          ))}
        </div>
      </div>

      <div>
        <Title level={5}>页面级 · 小尺寸（192）</Title>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: token.marginMD,
          }}
        >
          {PAGE_TYPES.map(({ type, label }) => (
            <SpecimenCard key={`page-sm-${type}`} label={label} note="scope=page size=small">
              <SensEmptyState scope="page" type={type} size="small" onAction={onAction} />
            </SpecimenCard>
          ))}
        </div>
      </div>

      <div>
        <Title level={5}>非页面级 · 基础尺寸（100）</Title>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: token.marginMD,
          }}
        >
          {NON_PAGE_TYPES.map(({ type, label }) => (
            <SpecimenCard key={`np-base-${type}`} label={label} note="scope=non-page size=base">
              <SensEmptyState scope="non-page" type={type} size="base" onAction={onAction} />
            </SpecimenCard>
          ))}
        </div>
      </div>

      <div>
        <Title level={5}>非页面级 · 特殊尺寸（50）</Title>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: token.marginMD,
          }}
        >
          {NON_PAGE_TYPES.map(({ type, label }) => (
            <SpecimenCard key={`np-sp-${type}`} label={label} note="scope=non-page size=special">
              <SensEmptyState scope="non-page" type={type} size="special" onAction={onAction} />
            </SpecimenCard>
          ))}
        </div>
      </div>
    </Space>
  );
}

export default function EmptyStateBasicStylePage() {
  return (
    <BasicStylePageLayout
      title="异常状态"
      description="页面级 / 非页面级空态插画与 SensEmptyState 排版矩阵。插画不进入 Icon registry。"
      designDocSource={emptyStateDocSource}
      specimen={<EmptyStateSpecimen />}
      initialTab="specimen"
    />
  );
}
