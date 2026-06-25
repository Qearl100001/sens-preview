import { useMemo } from "react";
import { message, Space, Typography } from "antd";
import { useTranslation } from "react-i18next";
import {
  SensButtonActionMenu,
  SensDropdownButton,
  SensMoreButton,
  type SensDropdownMenuItemConfig,
} from "../ui";

const { Text } = Typography;
const I18N_NS = "组件库";

/** 场景① · 链接更多菜单（Figma 17767:72631） */
export const MORE_LINK_MENU_DEMO_ITEMS: SensDropdownMenuItemConfig[] = [
  { key: "edit", label: "编辑", variant: "link" },
  { key: "copy", label: "复制", variant: "link" },
  { key: "delete", label: "删除", variant: "link" },
  { key: "archive", label: "归档", variant: "link", disabled: true },
  { key: "sync", label: "同步", variant: "link", loading: true },
];

const PRIMARY_SECONDARY_MENU_LABELS = [
  { key: "view", label: "查看详情" },
  { key: "export", label: "导出" },
  { key: "duplicate", label: "复制" },
] as const;

export type DropdownMenuUsageScenarioStatus = "ready" | "pending";

export interface DropdownMenuUsageScenario {
  id: string;
  title: string;
  whenToUse: string;
  status: DropdownMenuUsageScenarioStatus;
  Demo: () => JSX.Element;
}

function MoreLinkClickScenarioDemo() {
  const { t } = useTranslation();
  const moreLabel = t(`${I18N_NS}.sensd-button-action-more`, { defaultValue: "更多" });

  return (
    <SensDropdownButton items={MORE_LINK_MENU_DEMO_ITEMS} data-sens-demo="dropdown-more">
      {moreLabel}
    </SensDropdownButton>
  );
}

function MoreEllipsisHoverScenarioDemo() {
  const { t } = useTranslation();
  const moreLabel = t(`${I18N_NS}.sensd-button-action-more`, { defaultValue: "更多" });
  const items = useMemo<SensDropdownMenuItemConfig[]>(
    () =>
      PRIMARY_SECONDARY_MENU_LABELS.map((entry) => ({
        key: entry.key,
        label: entry.label,
        variant: "default" as const,
        onClick: () => {
          message.info(`已跳转：${entry.label}`);
        },
      })),
    [],
  );

  return (
    <SensButtonActionMenu trigger={["hover"]} items={items} data-sens-demo="dropdown-more-ellipsis-hover">
      <SensMoreButton>{moreLabel}</SensMoreButton>
    </SensButtonActionMenu>
  );
}

/** 加场景 = 往数组 push 一条；容器 map 渲染，不改结构 */
export const DROPDOWN_MENU_USAGE_SCENARIOS: DropdownMenuUsageScenario[] = [
  {
    id: "more-link-click",
    title: "更多 ▼ · 链接菜单",
    whenToUse: "表格/工具栏溢出操作用链接「更多」，点击展开。",
    status: "ready",
    Demo: MoreLinkClickScenarioDemo,
  },
  {
    id: "primary-secondary-hover",
    title: "更多 ··· · 悬停菜单",
    whenToUse: "操作 ≥4 个时收进「更多 ···」，悬停展开 default 黑字行，点项后收起并执行动作。",
    status: "ready",
    Demo: MoreEllipsisHoverScenarioDemo,
  },
];

export function DropdownMenuUsageScenarios() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {DROPDOWN_MENU_USAGE_SCENARIOS.map((scenario) => (
        <section key={scenario.id}>
          <Text strong>{scenario.title}</Text>
          <br />
          <Text type="secondary">{scenario.whenToUse}</Text>
          <div style={{ marginTop: 8 }}>
            {scenario.status === "pending" ? (
              <Text type="secondary">待建</Text>
            ) : (
              <scenario.Demo />
            )}
          </div>
        </section>
      ))}
    </Space>
  );
}
