import type { IconName } from "./icons";
import {
  domainNavToTopDropdownConfig,
  type ProductShellDomainNav,
  type ProductShellDomainTopDropdownConfig,
} from "./product-shell-domain-nav";

/**
 * Product Shell 域导航目录（顶导 + 侧导唯一 IA 源）。
 * - SensTopNavigation 默认一级项 / 下拉由此派生
 * - `/templates/product-shell/t` 侧导与顶导同源消费
 * - `/templates/product-shell/vertical` 上下布局下钻页复用顶导 IA（无侧导）
 * 禁止在顶导组件内再硬编码另一套扁平业务菜单。
 */

const flat = (
  domainLabel: string,
  primaryLabel: string,
  items: Array<{ label: string; icon: IconName }>,
): ProductShellDomainNav => ({
  domainLabel,
  entry: { kind: "primary", label: primaryLabel },
  layout: "flat",
  items: items.map((item) => ({ key: item.label, label: item.label, icon: item.icon })),
});

const utilityFlat = (
  domainLabel: string,
  icon: IconName,
  items: Array<{ label: string; icon: IconName }>,
): ProductShellDomainNav => ({
  domainLabel,
  entry: { kind: "utility", icon },
  layout: "flat",
  items: items.map((item) => ({ key: item.label, label: item.label, icon: item.icon })),
});

/** 概览顶导已去掉；可视化内「概览」叶子、广告/资源管理内同名叶子仍保留。 */

/** Figma 可视化侧导 */
export const VISUALIZATION_DOMAIN_NAV = flat("可视化", "可视化", [
  { label: "报表", icon: "sa-report" },
  { label: "概览", icon: "sa-dashboard" },
  { label: "业务集市", icon: "sa-dataset" },
  { label: "管理中心", icon: "sa-management" },
]);

/** 分析专属：虚拟二级 + 面性落地项 */
export const ANALYSIS_DOMAIN_NAV: ProductShellDomainNav = {
  domainLabel: "分析",
  entry: { kind: "primary", label: "分析" },
  layout: "groups",
  groups: [
    {
      key: "behavior-analysis",
      label: "行为分析",
      icon: "sa-behavioranalysis",
      defaultExpanded: true,
      items: [
        { key: "event-analysis", label: "事件分析", icon: "analysis-event", iconVariant: "filled" },
        { key: "retention-analysis", label: "留存分析", icon: "analysis-retention", iconVariant: "filled" },
        { key: "funnel-analysis", label: "漏斗分析", icon: "analysis-funnel", iconVariant: "filled" },
        { key: "distribution-analysis", label: "分布分析", icon: "analysis-distribution", iconVariant: "filled" },
        { key: "ltv-analysis", label: "LTV 分析", icon: "analysis-ltv", iconVariant: "filled" },
        { key: "session-analysis", label: "Session 分析", icon: "analysis-session", iconVariant: "filled" },
        { key: "user-path-analysis", label: "用户路径分析", icon: "analysis-user-path", iconVariant: "filled" },
        { key: "web-heatmap-analysis", label: "网页热力分析", icon: "analysis-web-page-thermal", iconVariant: "filled" },
        { key: "app-click-analysis", label: "App 点击分析", icon: "analysis-app-click", iconVariant: "filled" },
        { key: "interval-analysis", label: "间隔分析", icon: "analysis-interval", iconVariant: "filled" },
        { key: "attribution-analysis", label: "归因分析", icon: "analysis-attribution", iconVariant: "filled" },
      ],
    },
    {
      key: "user-analysis",
      label: "用户分析",
      icon: "sa-useranalysis",
      defaultExpanded: true,
      items: [
        { key: "portrait-analysis", label: "用户群画像", icon: "portrait-user-group", iconVariant: "filled" },
        { key: "property-analysis", label: "属性分析", icon: "analysis-property", iconVariant: "filled" },
      ],
    },
    {
      key: "other-analysis",
      label: "其他",
      icon: "sa-other",
      defaultExpanded: true,
      items: [
        { key: "custom-query", label: "自定义查询", icon: "query-custom", iconVariant: "filled" },
        { key: "bookmark", label: "书签", icon: "bookmark", iconVariant: "filled" },
      ],
    },
  ],
};

/** Figma A/B 测试 */
export const AB_TEST_DOMAIN_NAV = flat("AB 测试", "AB 测试", [
  { label: "试验列表", icon: "sa-test-list" },
  { label: "试验层", icon: "sa-test-ceng" },
  { label: "调试设备管理", icon: "sa-debugging-equipment" },
  { label: "试验指标管理", icon: "sa-test-indicator" },
]);

/** Figma 智能运营 `3709:3989` */
export const SMART_OPS_DOMAIN_NAV: ProductShellDomainNav = {
  domainLabel: "智能运营",
  entry: { kind: "primary", label: "智能运营" },
  layout: "groups",
  groups: [
    {
      key: "marketing-strategy",
      label: "营销策略",
      icon: "sf-active-marketing",
      items: ["运营计划", "流程画布"],
      defaultExpanded: true,
    },
    {
      key: "resource-ops",
      label: "资源位运营",
      icon: "sf-section",
      items: ["列表资源位", "轮播资源位", "弹窗资源位", "推荐策略", "物品库"],
      defaultExpanded: true,
    },
    {
      key: "wechat-config",
      label: "微信互动配置",
      icon: "sf-wechat",
      items: ["智能互动", "粉丝管理", "渠道运营"],
      defaultExpanded: true,
    },
    {
      key: "scene-enablement",
      label: "场景赋能",
      icon: "sf-scene",
      items: ["内容管理", "营销模版库"],
      defaultExpanded: true,
    },
  ],
};

/** Figma 内容管理 */
export const CONTENT_DOMAIN_NAV: ProductShellDomainNav = {
  domainLabel: "内容管理",
  entry: { kind: "primary", label: "内容管理" },
  layout: "groups",
  groups: [
    {
      key: "content-center",
      label: "内容中心",
      icon: "scms-center",
      defaultExpanded: true,
      items: ["作品管理", "权益管理", "素材库"],
    },
    {
      key: "content-config",
      label: "内容配置",
      icon: "scms-setting",
      defaultExpanded: true,
      items: ["模板管理", "权益模板管理", "内容标签"],
    },
  ],
};

/** Figma 营销助手 */
export const MARKETING_ASSISTANT_DOMAIN_NAV: ProductShellDomainNav = {
  domainLabel: "营销助手",
  entry: { kind: "primary", label: "营销助手" },
  layout: "groups",
  groups: [
    {
      key: "marketing-tasks",
      label: "营销任务",
      icon: "scrm-marketing-tasks",
      defaultExpanded: true,
      items: ["群发客户", "群发客户群", "朋友圈任务"],
    },
    {
      key: "work-notify",
      label: "工作提醒",
      icon: "scrm-work-notify",
      defaultExpanded: true,
      items: ["客户提醒", "客户群提醒"],
    },
    {
      key: "customer-management",
      label: "客户管理",
      icon: "scrm-customer-management",
      defaultExpanded: true,
      items: ["客户列表", "自动标签", "客情卡"],
    },
    {
      key: "marketing-customer",
      label: "营销获客",
      icon: "scrm-marketing-customer",
      defaultExpanded: true,
      items: ["员工活码", "群组活码", "门店活码", "员工欢迎语"],
    },
    {
      key: "community-operation",
      label: "社群运营",
      icon: "scrm-community-operation",
      defaultExpanded: true,
      items: ["标签拉群"],
    },
    {
      key: "material-management",
      label: "素材管理",
      icon: "scrm-material-management",
      defaultExpanded: true,
      items: ["基础素材库", "员工素材中心"],
    },
  ],
};

/** Figma 广告投放分析（替代渠道追踪） */
export const AD_ANALYSIS_DOMAIN_NAV: ProductShellDomainNav = {
  domainLabel: "广告投放分析",
  entry: { kind: "primary", label: "广告投放分析" },
  layout: "groups",
  groups: [
    {
      key: "ad-overview",
      label: "概览",
      icon: "sat-dashboard",
      defaultExpanded: true,
      items: ["广告概览"],
    },
    {
      key: "ad-report",
      label: "报表",
      icon: "sat-report",
      defaultExpanded: true,
      items: ["广告投放报表", "SLink 报表", "广告素材报表"],
    },
    {
      key: "ad-promote",
      label: "推广",
      icon: "sat-ad-promote",
      defaultExpanded: true,
      items: ["监测追踪", "SLink"],
    },
    {
      key: "ad-assets",
      label: "资产",
      icon: "sat-ad-assets",
      defaultExpanded: true,
      items: ["推广内容", "广告素材库"],
    },
    {
      key: "ad-config",
      label: "管理与配置",
      icon: "sat-ad-management-config",
      defaultExpanded: true,
      items: ["渠道管理", "常用参数管理", "报表配置", "素材标签管理", "广告授权管理"],
    },
    {
      key: "ad-tools",
      label: "工具",
      icon: "sat-tools",
      defaultExpanded: true,
      items: ["海外归因", "广告诊断工具"],
    },
  ],
};

/** 场景库占位 */
export const SCENE_LIBRARY_DOMAIN_NAV = flat("场景库", "场景库", [
  { label: "场景库", icon: "sf-scene" },
]);

/** Figma 数据融合（独立入口，不与数据加工合并）— 优先 22269 */
export const DATA_FUSION_DOMAIN_NAV: ProductShellDomainNav = {
  domainLabel: "数据融合",
  entry: { kind: "primary", label: "数据融合" },
  layout: "groups",
  groups: [
    {
      key: "tracking-ingestion",
      label: "埋点数据接入",
      icon: "sdi-warehousing-data-ingestion",
      defaultExpanded: true,
      items: ["数据接入引导", "入库校验规则设置", "实时导入数据查询", "Debug 实时数据查询"],
    },
    {
      key: "general-ingestion",
      label: "通用数据接入",
      icon: "sdh-warehousing-general-data-ingestion",
      defaultExpanded: true,
      items: ["数据源查询", "数据表管理", "数据同步"],
    },
    {
      key: "metadata",
      label: "元数据管理",
      icon: "sdh-data-model-user-entity-manage",
      defaultExpanded: true,
      items: ["用户表", "事件表", "明细表"],
    },
    {
      key: "entity-conf",
      label: "实体配置",
      icon: "sdh-entity-conf",
      defaultExpanded: true,
      items: ["实体定义", "实体间关系"],
    },
    {
      key: "data-quality",
      label: "数据质量",
      icon: "sdg-dataquality",
      defaultExpanded: true,
      items: ["埋点数据查询", "数据校验", "用户关联校验"],
    },
  ],
};

/**
 * Figma 数据加工（独立入口）。
 * 含原先在外层的分群 / 标签。
 */
export const DATA_PROCESS_DOMAIN_NAV = flat("数据加工", "数据加工", [
  { label: "数据资产视图", icon: "default" },
  { label: "信息目录管理", icon: "default" },
  { label: "分群管理", icon: "default" },
  { label: "标签管理", icon: "default" },
]);

/** 右上角审批 → 审批中心 */
export const APPROVAL_DOMAIN_NAV = utilityFlat("审批中心", "nav-examine", [
  { label: "待办", icon: "sbp-approval-todo" },
  { label: "已办", icon: "sbp-approval-finish" },
  { label: "已发起", icon: "sbp-approval-initiate" },
  { label: "审批数据管理", icon: "sbp-approval-data-manage" },
  { label: "审批配置", icon: "sbp-approval-setting" },
  { label: "审批开关", icon: "sbp-approval-switch" },
]);

/** 右上角资源管理 */
export const WORKLOAD_DOMAIN_NAV: ProductShellDomainNav = {
  domainLabel: "资源管理",
  entry: { kind: "utility", icon: "nav-workload-manager" },
  layout: "groups",
  groups: [
    {
      key: "query-task",
      label: "查询任务",
      icon: "sbp-workload-query-task",
      defaultExpanded: true,
      items: ["查询任务统计", "查询任务详情"],
    },
    {
      key: "biz-assets",
      label: "业务资源",
      icon: "sbp-workload-biz-assets",
      defaultExpanded: true,
      items: ["事件表", "用户表", "标签", "分群", "概览", "书签"],
    },
  ],
};

/** 右上角平台 → 平台管理（22269 完整版） */
export const PLATFORM_DOMAIN_NAV: ProductShellDomainNav = {
  domainLabel: "平台管理",
  entry: { kind: "utility", icon: "nav-platform" },
  layout: "groups",
  groups: [
    {
      key: "global-info",
      label: "全局信息",
      icon: "sbp-overview",
      defaultExpanded: true,
      items: ["授权信息"],
    },
    {
      key: "members-roles",
      label: "成员与角色",
      icon: "sbp-member",
      defaultExpanded: true,
      items: ["平台账号管理", "成员管理", "角色管理"],
    },
    {
      key: "project-settings",
      label: "项目设置",
      icon: "sbp-setting",
      defaultExpanded: true,
      items: ["基本设置"],
    },
    {
      key: "general-settings",
      label: "通用设置",
      icon: "sbp-security-setting",
      defaultExpanded: true,
      items: ["安全设置", "发件箱设置", "品牌信息设置", "全局文案设置", "第三方登录设置", "配置项设置"],
    },
    {
      key: "ops-management",
      label: "运维管理",
      icon: "sbp-operation-log",
      defaultExpanded: true,
      items: ["触达通道管理", "报警管理", "操作日志", "在线升级"],
    },
  ],
};

/** 全部域（侧导切换 + 顶导派生目录） */
export const PRODUCT_SHELL_TEMPLATE_DOMAINS: ProductShellDomainNav[] = [
  VISUALIZATION_DOMAIN_NAV,
  ANALYSIS_DOMAIN_NAV,
  AB_TEST_DOMAIN_NAV,
  SMART_OPS_DOMAIN_NAV,
  CONTENT_DOMAIN_NAV,
  MARKETING_ASSISTANT_DOMAIN_NAV,
  AD_ANALYSIS_DOMAIN_NAV,
  SCENE_LIBRARY_DOMAIN_NAV,
  DATA_FUSION_DOMAIN_NAV,
  DATA_PROCESS_DOMAIN_NAV,
  APPROVAL_DOMAIN_NAV,
  WORKLOAD_DOMAIN_NAV,
  PLATFORM_DOMAIN_NAV,
];

/** 仅主导航第一层入口（不含右上角 utility 域） */
export const PRODUCT_SHELL_PRIMARY_DOMAINS: ProductShellDomainNav[] =
  PRODUCT_SHELL_TEMPLATE_DOMAINS.filter((domain) => domain.entry.kind === "primary");

export type ProductShellPrimaryNavItem = {
  label: string;
  arrow?: boolean;
};

function primaryDomainHasMenu(domain: ProductShellDomainNav): boolean {
  if (domain.layout === "flat") return (domain.items?.length ?? 0) > 1;
  return (domain.groups?.length ?? 0) > 0;
}

/** 顶导第二行默认 items（唯一源；组件与样板间共用） */
export function getProductShellPrimaryNavItems(): ProductShellPrimaryNavItem[] {
  return PRODUCT_SHELL_PRIMARY_DOMAINS.map((domain) => {
    const label = domain.entry.kind === "primary" ? domain.entry.label : domain.domainLabel;
    return primaryDomainHasMenu(domain) ? { label, arrow: true } : { label };
  });
}

/** 顶导下拉默认配置（唯一源；有侧导的域为 flat/grouped 派生结果） */
export function getProductShellNavDropdownByLabel(): Record<string, ProductShellDomainTopDropdownConfig> {
  return Object.fromEntries(
    PRODUCT_SHELL_PRIMARY_DOMAINS.map((domain) => {
      const label = domain.entry.kind === "primary" ? domain.entry.label : domain.domainLabel;
      return [label, domainNavToTopDropdownConfig(domain)];
    }),
  );
}

/** 各域默认落地页（第一叶子），供顶导非受控初始选中 */
export function getProductShellDefaultNavMenuByLabel(): Record<string, string> {
  const result: Record<string, string> = {};
  for (const domain of PRODUCT_SHELL_PRIMARY_DOMAINS) {
    const label = domain.entry.kind === "primary" ? domain.entry.label : domain.domainLabel;
    const first =
      domain.layout === "flat"
        ? domain.items?.[0]?.label
        : (() => {
            const item = domain.groups?.[0]?.items?.[0];
            return typeof item === "string" ? item : item?.label;
          })();
    if (first) result[label] = first;
  }
  return result;
}
