import { useTranslation } from "react-i18next";
import { SensEmptyState } from "./SensEmptyState";
import type { NonPageEmptyType } from "./EmptyStateIllustrations";

const I18N_NS = "组件库";

export type SelectDropdownEmptyType = Extract<NonPageEmptyType, "noResult" | "loadFailed" | "noData">;

export interface SelectDropdownEmptyProps {
  type: SelectDropdownEmptyType;
  /** loadFailed → 刷新；noData → 添加（R2 仅展示 + 可选回调） */
  onAction?: () => void;
  className?: string;
}

/**
 * 浮层空态薄封装。内部消费 `<SensEmptyState scope="non-page" size="special" />`，
 * 对外 type / onAction 保持不变。
 */
export function SelectDropdownEmpty({ type, onAction, className }: SelectDropdownEmptyProps) {
  const { t } = useTranslation();
  const label = (key: string, defaultValue: string) =>
    t(`${I18N_NS}.${key}`, { defaultValue });

  const title = label(
    type === "noResult"
      ? "sensd-selectPanel-noResult"
      : type === "loadFailed"
        ? "sensd-selectPanel-loadFailed"
        : "sensd-selectPanel-noData",
    type === "noResult" ? "搜索无结果" : type === "loadFailed" ? "加载失败" : "暂无数据",
  );

  if (type === "noResult") {
    return (
      <SensEmptyState
        scope="non-page"
        type="noResult"
        size="special"
        className={className}
        title={title}
        description={label("sensd-selectPanel-noResultDesc", "未找到结果，请重新输入")}
      />
    );
  }

  return (
    <SensEmptyState
      scope="non-page"
      type={type}
      size="special"
      className={className}
      title={title}
      descriptionPrefix={
        type === "loadFailed"
          ? label("sensd-selectPanel-loadFailedDesc", "数据加载失败，请")
          : label("sensd-selectPanel-noDataDesc", "暂无数据，请")
      }
      actionLabel={
        type === "loadFailed"
          ? label("sensd-selectPanel-refresh", "刷新")
          : label("sensd-selectPanel-add", "添加")
      }
      onAction={onAction}
    />
  );
}
