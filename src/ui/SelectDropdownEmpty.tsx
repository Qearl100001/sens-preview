import { Button, theme } from "antd";
import { useTranslation } from "react-i18next";
import { EMPTY_STATE_ILLUSTRATIONS } from "./EmptyStateIllustrations";
import "./select-dropdown.css";

const I18N_NS = "组件库";

export type SelectDropdownEmptyType = "noResult" | "loadFailed" | "noData";

export interface SelectDropdownEmptyProps {
  type: SelectDropdownEmptyType;
  /** loadFailed → 刷新；noData → 添加（R2 仅展示 + 可选回调） */
  onAction?: () => void;
  className?: string;
}

/**
 * 浮层空态薄封装。未来内部可替换为 <SensEmptyState scope="non-page" size="special" />，
 * 对外 type / onAction 保持不变。
 */
export function SelectDropdownEmpty({ type, onAction, className }: SelectDropdownEmptyProps) {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const label = (key: string, defaultValue: string) =>
    t(`${I18N_NS}.${key}`, { defaultValue });

  const titleKey: Record<SelectDropdownEmptyType, string> = {
    noResult: "sensd-selectPanel-noResult",
    loadFailed: "sensd-selectPanel-loadFailed",
    noData: "sensd-selectPanel-noData",
  };

  const titleDefault: Record<SelectDropdownEmptyType, string> = {
    noResult: "搜索无结果",
    loadFailed: "加载失败",
    noData: "暂无数据",
  };

  const rootClass = ["sens-select-dropdown-empty", className].filter(Boolean).join(" ");

  return (
    <div className={rootClass}>
      <img
        className="sens-select-dropdown-empty-illustration"
        src={EMPTY_STATE_ILLUSTRATIONS[type]}
        alt=""
        width={50}
        height={50}
        draggable={false}
      />
      <div className="sens-select-dropdown-empty-text">
        <p className="sens-select-dropdown-empty-title">{label(titleKey[type], titleDefault[type])}</p>
        {type === "noResult" ? (
          <p className="sens-select-dropdown-empty-desc">
            {label("sensd-selectPanel-noResultDesc", "未找到结果，请重新输入")}
          </p>
        ) : null}
        {type === "loadFailed" ? (
          <p className="sens-select-dropdown-empty-desc sens-select-dropdown-empty-desc--action">
            <span>{label("sensd-selectPanel-loadFailedDesc", "数据加载失败，请")}</span>
            <Button
              type="link"
              size="small"
              className="sens-select-dropdown-empty-action"
              style={{ color: token.colorLink, padding: 0, height: "auto" }}
              onClick={onAction}
            >
              {label("sensd-selectPanel-refresh", "刷新")}
            </Button>
          </p>
        ) : null}
        {type === "noData" ? (
          <p className="sens-select-dropdown-empty-desc sens-select-dropdown-empty-desc--action">
            <span>{label("sensd-selectPanel-noDataDesc", "暂无数据，请")}</span>
            <Button
              type="link"
              size="small"
              className="sens-select-dropdown-empty-action"
              style={{ color: token.colorLink, padding: 0, height: "auto" }}
              onClick={onAction}
            >
              {label("sensd-selectPanel-add", "添加")}
            </Button>
          </p>
        ) : null}
      </div>
    </div>
  );
}
