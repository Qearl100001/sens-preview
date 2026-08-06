import { LoadingOutlined } from "@ant-design/icons";
import { Alert, Segmented, Space, Table, Tabs, Tag, Typography } from "antd";
import { useState } from "react";
import type { ColumnsType } from "antd/es/table";
import iconDocSource from "../../../../docs/foundations/icon.md?raw";
import tokens from "../../../design-system/tokens.resolved.json";
import {
  ICON_NAMES,
  ICON_REGISTRY,
  FILLED_ICON_NAMES,
  FILLED_ICON_REGISTRY,
  COLORFUL_ICON_NAMES,
  COLORFUL_ICON_REGISTRY,
  SensIcon,
  resolveIconColor,
  type IconColorRole,
  type IconRegistryEntry,
  type IconName,
  type IconVariant,
} from "../../../design-system/icons";
import { BasicStylePageLayout } from "./BasicStylePageLayout";
import { getPreviewTokens } from "../../previewTokens";
import { getTypographyToken } from "../../../design-system/typography";

const { Text, Title } = Typography;

const u = tokens.unit as Record<string, number>;

const CATEGORY_LABEL: Record<(typeof ICON_REGISTRY)[IconName]["category"], string> = {
  operational: "操作型",
  status: "状态型",
  navigation: "导航型",
  "input-assist": "输入辅助",
  "component-internal": "组件内部",
  edit: "编辑",
  object: "对象",
  symbol: "符号",
  direction: "方向",
  brand: "品牌标识",
  chart: "图表",
  functional: "功能",
  file: "文件格式",
  business: "业务用语",
  "colorful-functional": "彩色功能图标",
};

const ICON_TEXT_SIZE_ROWS = [
  { key: "12-14", textSize: 12, iconSize: 14, usage: "辅助文字、小提示、表单警告" },
  { key: "14-16", textSize: 14, iconSize: 16, usage: "常规控件、按钮、选择器、搜索、卡片操作" },
  { key: "16-18", textSize: 16, iconSize: 18, usage: "较大标题旁图标、强调型入口" },
  { key: "20-22", textSize: 20, iconSize: 22, usage: "页面级标题、标题栏大图标" },
];

const SPECIAL_SIZE_ROWS = [
  { key: "stepper", scene: "InputNumber stepper", size: "10px", note: "组件内部特殊尺寸，不是 stepper 图标本体默认尺寸" },
  { key: "warning", scene: "表单警告", size: "14px · size/icon/s", note: "跟随 12px 辅助提示关系" },
  { key: "control", scene: "Select / Button / Search 常规图标", size: "16px · size/icon/m", note: "跟随 14px 常规控件文字" },
  { key: "inherit", scene: "跟文字走的图标", size: "inherit / 1em", note: "允许继承外层文字尺寸和颜色" },
];

const COLOR_ROLES: { role: IconColorRole; tokenRef: string }[] = [
  { role: "default", tokenRef: 'tokenRgba("text-color-transparent", 0.9)' },
  { role: "subtle", tokenRef: 'tokenRgba("text-sub-color-transparent", 0.58)' },
  { role: "disabled", tokenRef: 'tokenRgba("text-color-transparent-disable", 0.3)' },
  { role: "link", tokenRef: "link-color" },
  { role: "functional", tokenRef: "component-active" },
  { role: "warning", tokenRef: "warning-color" },
  { role: "inverse", tokenRef: "white" },
  { role: "inherit", tokenRef: "currentColor" },
];

const ANTD_ICON_ROWS = [
  { key: "loading", icon: "LoadingOutlined", usage: "Button / Dropdown / FAB loading", decision: "待替换为 SensIcon" },
];

const ILLUSTRATION_ROWS = [
  { key: "load-failed", asset: "load-failed-small.png", note: "空态插画，不进入 Icon registry" },
  { key: "no-data", asset: "no-data-small.png", note: "空态插画，不进入 Icon registry" },
  { key: "no-result", asset: "no-result-small.png", note: "空态插画，不进入 Icon registry" },
  { key: "antd-empty", asset: "Empty.PRESENTED_IMAGE_SIMPLE", note: "antd 空态，不进入 Icon registry" },
];

function resolvePreviewColorRole(entry: IconRegistryEntry): IconColorRole {
  return entry.usageScenes[0]?.typicalColorRoles[0] ?? "inherit";
}

function RegisteredIconCard({
  name,
  previewSize,
  variant,
  registry,
}: {
  name: IconName;
  previewSize: number;
  variant: IconVariant;
  registry: Record<string, IconRegistryEntry>;
}) {
  const token = getPreviewTokens();
  const entry = registry[name];
  const previewColorRole = resolvePreviewColorRole(entry);

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
            height: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: token.colorFillAlter,
            borderRadius: token.borderRadius,
          }}
        >
          <SensIcon name={name} variant={variant} size={previewSize} colorRole={previewColorRole} />
        </div>

        <Space wrap size={[4, 4]}>
          <Text strong code>
            {name}
          </Text>
          <Tag>{CATEGORY_LABEL[entry.category]}</Tag>
          {entry.dualTone ? <Tag color="processing">dualTone</Tag> : null}
        </Space>

        <Text type="secondary">{entry.labelZh ?? "中文语义待补充"}</Text>

        {entry.usageScenes.length > 0 ? (
          <Space direction="vertical" size={4} style={{ width: "100%" }}>
            {entry.usageScenes.map((scene) => (
              <div key={scene.scene}>
                <Text style={{ fontSize: getTypographyToken("font-size/s") }}>{scene.scene}</Text>
                <Text type="secondary" style={{ fontSize: getTypographyToken("font-size/s"), display: "block" }}>
                  场景尺寸 {scene.typicalSizes.join(" / ")}px · 场景颜色 {scene.typicalColorRoles.join(" / ")} ·{" "}
                  {scene.reusableAtOtherSizes ? "可复用其他尺寸" : "优先固定场景尺寸"}
                </Text>
              </div>
            ))}
          </Space>
        ) : null}
      </Space>
    </div>
  );
}

function IconGallery({
  names,
  registry,
  variant,
  previewSize,
}: {
  names: readonly IconName[];
  registry: Record<string, IconRegistryEntry>;
  variant: IconVariant;
  previewSize: number;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 16,
        marginTop: 16,
      }}
    >
      {names.map((name) => (
        <RegisteredIconCard key={name} name={name} previewSize={previewSize} variant={variant} registry={registry} />
      ))}
    </div>
  );
}

function ColorRolePreview() {
  const token = getPreviewTokens();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: token.marginMD,
      }}
    >
      {COLOR_ROLES.map(({ role, tokenRef }) => {
        const isInverse = role === "inverse";
        return (
          <div
            key={role}
            style={{
              padding: token.paddingMD,
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: token.borderRadius,
              background: isInverse ? token.colorPrimary : token.colorBgContainer,
            }}
          >
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              <div style={{ color: role === "inherit" ? resolveIconColor("default") : undefined }}>
                <SensIcon name="search" sizeToken="size/icon/m" colorRole={role} />
              </div>
              <Text strong style={{ color: isInverse ? token.colorBgContainer : undefined }}>
                {role}
              </Text>
              <Text
                type="secondary"
                style={{ fontSize: getTypographyToken("font-size/s"), color: isInverse ? token.colorBgContainer : undefined }}
              >
                {tokenRef}
              </Text>
            </Space>
          </div>
        );
      })}
    </div>
  );
}

function AntdIconPreview({ iconKey }: { iconKey: string }) {
  const token = getPreviewTokens();
  const iconSize = u["size/icon/m"];
  const iconColor = resolveIconColor("subtle");

  const iconMap = {
    loading: <LoadingOutlined spin style={{ fontSize: iconSize, color: iconColor }} />,
  } as const;

  return (
    <div
      style={{
        width: 48,
        height: 48,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: token.colorFillAlter,
        borderRadius: token.borderRadius,
      }}
    >
      {iconMap[iconKey as keyof typeof iconMap]}
    </div>
  );
}

function IconSpecimen() {
  const [iconSize, setIconSize] = useState<16 | 20 | 22>(16);
  const [iconVariant, setIconVariant] = useState<IconVariant>("linear");
  const isColorful = iconVariant === "colorful";
  const iconTextColumns: ColumnsType<(typeof ICON_TEXT_SIZE_ROWS)[number]> = [
    { title: "文字字号", dataIndex: "textSize", key: "textSize", width: 100, render: (v: number) => `${v}px` },
    { title: "图标尺寸", dataIndex: "iconSize", key: "iconSize", width: 100, render: (v: number) => `${v}px` },
    { title: "使用场景", dataIndex: "usage", key: "usage" },
  ];

  const specialSizeColumns: ColumnsType<(typeof SPECIAL_SIZE_ROWS)[number]> = [
    { title: "场景", dataIndex: "scene", key: "scene", width: 240 },
    { title: "尺寸", dataIndex: "size", key: "size", width: 180 },
    { title: "说明", dataIndex: "note", key: "note" },
  ];

  const antdColumns: ColumnsType<(typeof ANTD_ICON_ROWS)[number]> = [
    {
      title: "预览",
      dataIndex: "key",
      key: "preview",
      width: 80,
      render: (key: string) => <AntdIconPreview iconKey={key} />,
    },
    { title: "图标", dataIndex: "icon", key: "icon", width: 180 },
    { title: "当前用途", dataIndex: "usage", key: "usage" },
    {
      title: "决策",
      dataIndex: "decision",
      key: "decision",
      width: 160,
      render: (value: string) => <Tag color="warning">{value}</Tag>,
    },
  ];

  const illustrationColumns: ColumnsType<(typeof ILLUSTRATION_ROWS)[number]> = [
    { title: "资产", dataIndex: "asset", key: "asset", width: 280 },
    { title: "说明", dataIndex: "note", key: "note" },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginTop: 0 }}>
          图标数值样张
        </Title>
        <Text type="secondary">
          展示已入库 Sens 图标（线性 {ICON_NAMES.length} 个、面性 {FILLED_ICON_NAMES.length} 个、彩色功能 {COLORFUL_ICON_NAMES.length} 个）、分类、中文语义、尺寸关系、颜色 token 边界和迁移结果。
        </Text>
      </div>

      <Alert
        type="info"
        showIcon
        message="registry 只记录图标资产，不绑定唯一默认尺寸和颜色"
        description="线性与面性图标提供 16px、20px、22px 三档对照；彩色功能图标按功能资产规则固定为 48px。"
      />

      <section>
        <Space align="center" style={{ width: "100%", justifyContent: "space-between" }}>
          <Title level={5} style={{ margin: 0 }}>
            已入库图标（SensIcon）
          </Title>
          {isColorful ? (
            <Tag color="processing">彩色功能图标 · 固定 48px</Tag>
          ) : (
            <Segmented
              aria-label="图标预览尺寸"
              value={iconSize}
              options={[16, 20, 22].map((size) => ({ label: `${size}px`, value: size }))}
              onChange={(value) => setIconSize(value as 16 | 20 | 22)}
            />
          )}
        </Space>
        <Tabs
          activeKey={iconVariant}
          onChange={(key) => setIconVariant(key as IconVariant)}
          items={[
            {
              key: "linear",
              label: "线性图标",
              children: <IconGallery names={ICON_NAMES} registry={ICON_REGISTRY} variant="linear" previewSize={iconSize} />,
            },
            {
              key: "filled",
              label: "面性图标",
              children: (
                <IconGallery
                  names={FILLED_ICON_NAMES}
                  registry={FILLED_ICON_REGISTRY}
                  variant="filled"
                  previewSize={iconSize}
                />
              ),
            },
            {
              key: "colorful",
              label: "彩色功能图标",
              children: (
                <IconGallery
                  names={COLORFUL_ICON_NAMES}
                  registry={COLORFUL_ICON_REGISTRY}
                  variant="colorful"
                  previewSize={u["size/xxl"]}
                />
              ),
            },
          ]}
        />
      </section>

      <section>
        <Title level={5}>图标与文字尺寸关系</Title>
        <Table columns={iconTextColumns} dataSource={ICON_TEXT_SIZE_ROWS} pagination={false} size="small" />
        <div style={{ marginTop: 16 }}>
          <Table columns={specialSizeColumns} dataSource={SPECIAL_SIZE_ROWS} pagination={false} size="small" />
        </div>
      </section>

      <section>
        <Title level={5}>颜色语义角色</Title>
        <ColorRolePreview />
      </section>

      <section>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Title level={5} style={{ margin: 0 }}>
            外部 antd 图标（不纳入 registry）
          </Title>
          <Alert
            type="warning"
            showIcon
            message="antd 图标逐步迁移到 SensIcon"
            description="以下是当前仍存在的外部 antd 图标使用点；线性与面性图标已完成资产入库，宿主组件后续按组件批次替换。"
          />
          <Table columns={antdColumns} dataSource={ANTD_ICON_ROWS} pagination={false} size="small" />
        </Space>
      </section>

      <section>
        <Title level={5}>图片插画边界（不进入 Icon Foundation）</Title>
        <Table columns={illustrationColumns} dataSource={ILLUSTRATION_ROWS} pagination={false} size="small" />
      </section>
    </Space>
  );
}

export default function IconBasicStylePage() {
  return (
    <BasicStylePageLayout
      title="图标"
      description="统一图标资产、命名、尺寸关系、颜色语义和消费规则。"
      designDocSource={iconDocSource}
      specimen={<IconSpecimen />}
    />
  );
}
