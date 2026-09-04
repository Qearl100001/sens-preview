#!/usr/bin/env node
/**
 * Convert Figma-exported side-nav SVGs (60×60, #747E94 fills) into:
 * 1) cleaned SVG assets under src/design-system/icons/side-nav/
 * 2) React components in src/ui/SideNavProductIcons.tsx
 * 3) patch helpers printed for registry / types
 *
 * Usage: node scripts/codegen-sidenav-icons.mjs
 * Expects .tmp/sidenav-icons/*.svg (named by icon key)
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC_DIR = path.join(ROOT, ".tmp/sidenav-icons");
const OUT_SVG_DIR = path.join(ROOT, "src/design-system/icons/side-nav");
const OUT_TSX = path.join(ROOT, "src/ui/SideNavProductIcons.tsx");

const LABEL_ZH = {
  "sa-test-list": "试验列表",
  "sa-test-ceng": "试验层",
  "sa-debugging-equipment": "调试设备管理",
  "sa-test-indicator": "试验指标管理",
  "sa-report": "报表",
  "sa-dashboard": "概览",
  "sa-dataset": "业务集市",
  "sa-management": "管理中心",
  "sbp-approval-todo": "待办",
  "sbp-approval-finish": "已办",
  "sbp-approval-initiate": "已发起",
  "sbp-approval-data-manage": "审批数据管理",
  "sbp-approval-setting": "审批配置",
  "sbp-approval-switch": "审批开关",
  "sbp-workload-query-task": "查询任务",
  "sbp-workload-biz-assets": "业务资源",
  "sbp-overview": "全局信息",
  "sbp-security-setting": "平台设置",
  "sbp-email-manage": "发件箱管理",
  "sbp-operation-log": "操作日志",
  "scrm-marketing-tasks": "营销任务",
  "scrm-work-notify": "工作提醒",
  "scrm-customer-management": "客户管理",
  "scrm-marketing-customer": "营销获客",
  "scrm-community-operation": "社群运营",
  "scrm-material-management": "素材管理",
  "sf-active-marketing": "营销策略",
  "sf-section": "资源位运营",
  "sf-wechat": "微信互动配置",
  "sf-scene": "场景赋能",
  "scms-center": "内容中心",
  "scms-setting": "内容配置",
  "sat-dashboard": "概览",
  "sat-report": "报表",
  "sat-ad-promote": "推广",
  "sat-ad-assets": "资产",
  "sat-ad-management-config": "管理与配置",
  "sat-tools": "工具",
  "sdg-warehousing": "数据接入",
  "sdh-data-model-table-manage": "数据表",
  default: "默认图标",
  "default-2": "默认图标 2",
  "default-3": "默认图标 3",
};

function toComponentName(key) {
  return (
    key
      .split("-")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join("") + "SideNavIcon"
  );
}

function cleanSvg(svg) {
  return svg
    .replace(/\r\n/g, "\n")
    .replace(/fill="#747E94"\s*fill-opacity="0\.8"/g, 'fill="currentColor"')
    .replace(/fill="#747E94"/g, 'fill="currentColor"')
    .replace(/\s*fill-opacity="0\.8"/g, "")
    .replace(/width="60" height="60"/, 'width="20" height="20"')
    .trim();
}

/** Convert cleaned SVG inner markup to JSX children string */
function svgInnerToJsx(svg) {
  const match = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  if (!match) throw new Error("invalid svg");
  let inner = match[1].trim();
  inner = inner
    .replace(/fill-rule=/g, "fillRule=")
    .replace(/clip-rule=/g, "clipRule=")
    .replace(/style="mix-blend-mode:multiply"/g, 'style={{ mixBlendMode: "multiply" }}')
    .replace(/opacity="([^"]+)"/g, "opacity={$1}");
  // indent
  return inner
    .split("\n")
    .map((line) => (line.trim() ? `      ${line}` : ""))
    .join("\n");
}

fs.mkdirSync(OUT_SVG_DIR, { recursive: true });

const files = fs
  .readdirSync(SRC_DIR)
  .filter((f) => f.endsWith(".svg"))
  .sort();

if (files.length === 0) {
  console.error("No .svg files in", SRC_DIR);
  process.exit(1);
}

const entries = [];
for (const file of files) {
  const key = file.replace(/\.svg$/, "");
  const raw = fs.readFileSync(path.join(SRC_DIR, file), "utf8");
  const cleaned = cleanSvg(raw);
  fs.writeFileSync(path.join(OUT_SVG_DIR, `${key}.svg`), `${cleaned}\n`);
  entries.push({
    key,
    component: toComponentName(key),
    labelZh: LABEL_ZH[key] ?? key,
    jsx: svgInnerToJsx(cleaned),
  });
}

const header = `import type { ReactNode, CSSProperties } from "react";
import tokens from "../design-system/tokens.resolved.json";

const u = tokens.unit as Record<string, number>;
const ICON_SIZE_M = u["size/icon/m"];

export interface SideNavProductIconProps {
  size?: number;
  className?: string;
  style?: CSSProperties;
  color?: string;
}

function iconStyleProps(color: string | undefined, style?: CSSProperties): CSSProperties {
  return {
    flexShrink: 0,
    ...(color && color !== "currentColor" ? { color } : {}),
    ...style,
  };
}

function SideNavProductIconSvg({
  size = ICON_SIZE_M,
  className,
  style,
  color = "currentColor",
  children,
}: SideNavProductIconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={iconStyleProps(color, style)}
      aria-hidden
    >
      {children}
    </svg>
  );
}
`;

const components = entries
  .map(
    (e) => `/** Figma side-nav · ${e.labelZh} · \`${e.key}\` */
export function ${e.component}(props: SideNavProductIconProps) {
  return (
    <SideNavProductIconSvg {...props}>
${e.jsx}
    </SideNavProductIconSvg>
  );
}
`,
  )
  .join("\n");

fs.writeFileSync(OUT_TSX, `${header}\n${components}`);

const metaPath = path.join(SRC_DIR, "codegen-meta.json");
fs.writeFileSync(
  metaPath,
  JSON.stringify(
    entries.map((e) => ({ key: e.key, component: e.component, labelZh: e.labelZh })),
    null,
    2,
  ),
);

console.log(`Wrote ${entries.length} icons → ${OUT_TSX}`);
console.log(`Cleaned SVG → ${OUT_SVG_DIR}`);
console.log(`Meta → ${metaPath}`);
