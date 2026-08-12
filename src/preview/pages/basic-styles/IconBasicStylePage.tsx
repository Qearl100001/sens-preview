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
  getIconRegistryEntry,
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
  { key: "page", asset: "empty-state/page/*.png", note: "页面级空态插画，见 /basic-styles/empty-state" },
  { key: "non-page", asset: "empty-state/non-page/*.png", note: "非页面级空态插画，不进入 Icon registry" },
  { key: "antd-empty", asset: "Empty.PRESENTED_IMAGE_SIMPLE", note: "antd 空态，不进入 Icon registry" },
];

type IconLibraryTab = IconVariant | "navigation-function";

/**
 * 导航功能图标分组：样张主展示在「导航功能图标」Tab。
 * 其中 variant=linear 的侧导资产不得再出现在「线性图标」Tab（见 docs/foundations/icon.md 样张 Tab 录入标准）。
 */
const NAVIGATION_FUNCTION_ICON_GROUPS: {
  title: string;
  description: string;
  icons: { name: IconName; variant: IconVariant; usage: string }[];
}[] = [
  {
    title: "侧导控制",
    description: "用于侧边导航展开、收起、锁定、二级模块开合与推荐入口。",
    icons: [
      { name: "side-nav-expand", variant: "linear", usage: "紧凑态展开" },
      { name: "side-nav-collapse", variant: "linear", usage: "锁定态收起" },
      { name: "side-nav-unpin", variant: "linear", usage: "悬停展开后锁定" },
      { name: "side-nav-pin", variant: "linear", usage: "锁定状态" },
      { name: "side-nav-down", variant: "linear", usage: "二级模块收起" },
      { name: "side-nav-up", variant: "linear", usage: "二级模块展开" },
      { name: "side-nav-link", variant: "linear", usage: "更多推荐" },
    ],
  },
  {
    title: "单层带图标 / 项目设置与平台",
    description: "用于只有一层功能项的项目设置、审批与平台类侧边导航。",
    icons: [
      { name: "sbp-setting", variant: "linear", usage: "基本设置" },
      { name: "sbp-member", variant: "linear", usage: "成员管理" },
      { name: "sbp-role", variant: "linear", usage: "角色管理" },
      { name: "sbp-approval-todo", variant: "linear", usage: "待办" },
      { name: "sbp-approval-finish", variant: "linear", usage: "已办" },
      { name: "sbp-approval-initiate", variant: "linear", usage: "已发起" },
      { name: "sbp-approval-data-manage", variant: "linear", usage: "审批数据管理" },
      { name: "sbp-approval-setting", variant: "linear", usage: "审批配置" },
      { name: "sbp-approval-switch", variant: "linear", usage: "审批开关" },
      { name: "sbp-workload-query-task", variant: "linear", usage: "查询任务" },
      { name: "sbp-workload-biz-assets", variant: "linear", usage: "业务资源" },
      { name: "sbp-overview", variant: "linear", usage: "全局信息" },
      { name: "sbp-security-setting", variant: "linear", usage: "平台设置" },
      { name: "sbp-email-manage", variant: "linear", usage: "发件箱管理" },
      { name: "sbp-operation-log", variant: "linear", usage: "操作日志" },
    ],
  },
  {
    title: "二级带图标 / 数据接入",
    description: "用于数据接入类虚拟二级分组；三级落地页不带图标。",
    icons: [
      { name: "sdi-warehousing-data-ingestion", variant: "linear", usage: "埋点数据接入" },
      { name: "sdh-warehousing-general-data-ingestion", variant: "linear", usage: "通用数据接入" },
      { name: "sdg-warehousing", variant: "linear", usage: "数据接入" },
      { name: "sdh-data-model-table-manage", variant: "linear", usage: "数据表" },
      { name: "sdh-data-model-user-entity-manage", variant: "linear", usage: "元数据管理" },
      { name: "sdh-entity-conf", variant: "linear", usage: "实体配置" },
      { name: "sdg-dataquality", variant: "linear", usage: "数据质量" },
    ],
  },
  {
    title: "分析专属虚拟层级",
    description: "仅用于分析大功能；虚拟层级带侧导专用图标。",
    icons: [
      { name: "sa-behavioranalysis", variant: "linear", usage: "行为分析" },
      { name: "sa-useranalysis", variant: "linear", usage: "用户分析" },
      { name: "sa-businessanalysis", variant: "linear", usage: "经营分析" },
      { name: "sa-other", variant: "linear", usage: "其他" },
      { name: "sa-test-list", variant: "linear", usage: "试验列表" },
      { name: "sa-test-ceng", variant: "linear", usage: "试验层" },
      { name: "sa-debugging-equipment", variant: "linear", usage: "调试设备管理" },
      { name: "sa-test-indicator", variant: "linear", usage: "试验指标管理" },
      { name: "sa-report", variant: "linear", usage: "报表" },
      { name: "sa-dashboard", variant: "linear", usage: "概览" },
      { name: "sa-dataset", variant: "linear", usage: "业务集市" },
      { name: "sa-management", variant: "linear", usage: "管理中心" },
    ],
  },
  {
    title: "智能运营 / SF",
    description: "智能运营产品壳侧导二级分组图标。",
    icons: [
      { name: "sf-active-marketing", variant: "linear", usage: "营销策略" },
      { name: "sf-section", variant: "linear", usage: "资源位运营" },
      { name: "sf-wechat", variant: "linear", usage: "微信互动配置" },
      { name: "sf-scene", variant: "linear", usage: "场景赋能" },
    ],
  },
  {
    title: "SCRM / 内容 / 广告 / 兜底",
    description: "SCRM、内容中台、广告分析侧导与默认兜底图标。",
    icons: [
      { name: "scrm-marketing-tasks", variant: "linear", usage: "营销任务" },
      { name: "scrm-work-notify", variant: "linear", usage: "工作提醒" },
      { name: "scrm-customer-management", variant: "linear", usage: "客户管理" },
      { name: "scrm-marketing-customer", variant: "linear", usage: "营销获客" },
      { name: "scrm-community-operation", variant: "linear", usage: "社群运营" },
      { name: "scrm-material-management", variant: "linear", usage: "素材管理" },
      { name: "scms-center", variant: "linear", usage: "内容中心" },
      { name: "scms-setting", variant: "linear", usage: "内容配置" },
      { name: "sat-dashboard", variant: "linear", usage: "概览" },
      { name: "sat-report", variant: "linear", usage: "报表" },
      { name: "sat-ad-promote", variant: "linear", usage: "推广" },
      { name: "sat-ad-assets", variant: "linear", usage: "资产" },
      { name: "sat-ad-management-config", variant: "linear", usage: "管理与配置" },
      { name: "sat-tools", variant: "linear", usage: "工具" },
      { name: "default", variant: "linear", usage: "默认图标" },
      { name: "default-2", variant: "linear", usage: "默认图标 2" },
      { name: "default-3", variant: "linear", usage: "默认图标 3" },
    ],
  },
  {
    title: "分析专属落地页",
    description: "分析具体功能项复用面性业务图标，收起后只展示二级图标。",
    icons: [
      { name: "analysis-event", variant: "filled", usage: "事件分析" },
      { name: "analysis-retention", variant: "filled", usage: "留存分析" },
      { name: "analysis-funnel", variant: "filled", usage: "漏斗分析" },
      { name: "analysis-distribution", variant: "filled", usage: "分布分析" },
      { name: "analysis-ltv", variant: "filled", usage: "LTV 分析" },
      { name: "analysis-session", variant: "filled", usage: "Session 分析" },
      { name: "analysis-user-path", variant: "filled", usage: "用户路径分析" },
      { name: "analysis-web-page-thermal", variant: "filled", usage: "网页热力分析" },
      { name: "analysis-app-click", variant: "filled", usage: "App 点击分析" },
      { name: "analysis-interval", variant: "filled", usage: "间隔分析" },
      { name: "analysis-attribution", variant: "filled", usage: "归因分析" },
      { name: "portrait-user-group", variant: "filled", usage: "用户群画像" },
      { name: "analysis-property", variant: "filled", usage: "属性分析" },
      { name: "query-custom", variant: "filled", usage: "自定义查询" },
      { name: "bookmark", variant: "filled", usage: "书签" },
    ],
  },
];

/** 侧导专用线性资产：只在「导航功能图标」Tab 展示，线性 Tab 排除 */
const NAVIGATION_FUNCTION_LINEAR_NAMES = new Set(
  NAVIGATION_FUNCTION_ICON_GROUPS.flatMap((group) =>
    group.icons.filter((icon) => icon.variant === "linear").map((icon) => icon.name),
  ),
);

const LINEAR_GALLERY_ICON_NAMES = ICON_NAMES.filter((name) => {
  if (NAVIGATION_FUNCTION_LINEAR_NAMES.has(name)) return false;
  const scenes = ICON_REGISTRY[name]?.usageScenes ?? [];
  return !scenes.some((scene) => scene.scene.startsWith("Product Shell Side Navigation"));
});

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

function NavigationFunctionIconGallery() {
  const token = getPreviewTokens();
  const navigationIconSize = u["size/icon/l"];

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%", marginTop: token.marginMD }}>
      <Alert
        type="info"
        showIcon
        message="导航功能图标是侧边导航专用资产"
        description="图标本体仍使用 currentColor，不在 SVG 里写死颜色；实际消费时由 ProductShellSideNavigation 注入侧导状态色：默认 theme-side-icon、虚拟层级 theme-side-subIcon、选中 / 激活 theme-side-icon-active。图标库仅按侧导场景固定展示 20px。"
      />

      {NAVIGATION_FUNCTION_ICON_GROUPS.map((group) => (
        <section key={group.title}>
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <div>
              <Title level={5} style={{ margin: 0 }}>
                {group.title}
              </Title>
              <Text type="secondary">{group.description}</Text>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: token.marginMD,
              }}
            >
              {group.icons.map(({ name, variant, usage }) => {
                const entry = getIconRegistryEntry(name, variant);

                return (
                  <div
                    key={`${group.title}-${name}`}
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
                          height: u["size/xxl"],
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: resolveIconColor("subtle"),
                          background: token.colorFillAlter,
                          borderRadius: token.borderRadius,
                        }}
                      >
                        <SensIcon name={name} variant={variant} size={navigationIconSize} color="currentColor" />
                      </div>
                      <Space wrap size={[4, 4]}>
                        <Text strong code>
                          {name}
                        </Text>
                        <Tag>{entry?.labelZh ?? usage}</Tag>
                        <Tag color="processing">20px</Tag>
                      </Space>
                      <Text type="secondary">{usage}</Text>
                    </Space>
                  </div>
                );
              })}
            </div>
          </Space>
        </section>
      ))}
    </Space>
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
  const [iconVariant, setIconVariant] = useState<IconLibraryTab>("linear");
  const isColorful = iconVariant === "colorful";
  const isNavigationFunction = iconVariant === "navigation-function";
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
          展示已入库 Sens 图标（线性 {LINEAR_GALLERY_ICON_NAMES.length} 个、面性 {FILLED_ICON_NAMES.length}{" "}
          个、彩色功能 {COLORFUL_ICON_NAMES.length} 个、导航功能 {NAVIGATION_FUNCTION_LINEAR_NAMES.size}{" "}
          个侧导线性资产）、分类、中文语义、尺寸关系、颜色 token 边界和迁移结果。侧导专用图标只在「导航功能图标」Tab
          展示，不进入线性 Tab。
        </Text>
      </div>

      <Alert
        type="info"
        showIcon
        message="registry 只记录图标资产，不绑定唯一默认尺寸和颜色"
        description="线性与面性图标提供 16px、20px、22px 三档对照；彩色功能图标按功能资产规则固定为 48px；导航功能图标（侧导专用）固定按 20px 场景展示。录入归属见 foundations/icon 样张 Tab 标准。"
      />

      <section>
        <Space align="center" style={{ width: "100%", justifyContent: "space-between" }}>
          <Title level={5} style={{ margin: 0 }}>
            已入库图标（SensIcon）
          </Title>
          {isNavigationFunction ? (
            <Tag color="processing">导航功能图标 · 侧导专用 20px</Tag>
          ) : isColorful ? (
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
          onChange={(key) => setIconVariant(key as IconLibraryTab)}
          items={[
            {
              key: "linear",
              label: "线性图标",
              children: (
                <IconGallery
                  names={LINEAR_GALLERY_ICON_NAMES}
                  registry={ICON_REGISTRY}
                  variant="linear"
                  previewSize={iconSize}
                />
              ),
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
            {
              key: "navigation-function",
              label: "导航功能图标",
              children: <NavigationFunctionIconGallery />,
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
