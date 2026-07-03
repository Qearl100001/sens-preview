import type { ReactNode } from "react";
import { SensPageTitleBar, type SensBreadcrumbItem } from "../../ui";

export interface DrilldownTitleBarProps {
  breadcrumbs: string[];
  title: string;
  action?: ReactNode;
  onBack?: () => void;
}

function toBreadcrumbItems(labels: string[], onBack?: () => void): SensBreadcrumbItem[] {
  return labels.map((label, index) => {
    const isLast = index === labels.length - 1;
    const isManagementCrumb = index === labels.length - 2;

    return {
      key: `crumb-${index}`,
      label,
      ...(!isLast && isManagementCrumb && onBack ? { onClick: onBack } : {}),
    };
  });
}

/** @deprecated 请改用 SensPageTitleBar；保留兼容旧引用。 */
export function DrilldownTitleBar({ breadcrumbs, title, action, onBack }: DrilldownTitleBarProps) {
  return (
    <SensPageTitleBar
      title={title}
      breadcrumbItems={toBreadcrumbItems(breadcrumbs, onBack)}
      onBack={onBack}
      actions={action}
    />
  );
}
