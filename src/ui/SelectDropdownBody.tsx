import { Spin } from "antd";
import { useTranslation } from "react-i18next";
import { SelectDropdownEmpty } from "./SelectDropdownEmpty";
import type { SelectDropdownContentPhase } from "./useSelectDropdownSearch";

const I18N_NS = "组件库";

export interface SelectDropdownBodyProps {
  phase: SelectDropdownContentPhase;
  sourceCount: number;
  resultCount: number;
  onEmptyAction?: () => void;
}

export function SelectDropdownBody({
  phase,
  sourceCount,
  resultCount,
  onEmptyAction,
}: SelectDropdownBodyProps) {
  const { t } = useTranslation();
  const label = (key: string, defaultValue: string, params?: Record<string, unknown>) =>
    t(`${I18N_NS}.${key}`, { defaultValue, ...params });

  const showStats = phase === "fullList" || phase === "hasResults";
  const statsText =
    phase === "fullList"
      ? label("sensd-selectPanel-totalCount", "共 ${count} 条数据", { count: sourceCount })
      : label("sensd-selectPanel-searchCount", "共找到 ${count} 条", { count: resultCount });

  return (
    <div className="sens-select-dropdown-body">
      {showStats ? (
        <div className="sens-select-dropdown-stats" aria-live="polite">
          {statsText}
        </div>
      ) : null}

      {phase === "searching" || phase === "dataLoading" ? (
        <div className="sens-select-dropdown-loading" role="status">
          <Spin size="small" />
          {phase === "dataLoading" ? (
            <span className="sens-select-dropdown-loading-text">
              {label("sensd-selectPanel-loadingText", "加载中")}
            </span>
          ) : null}
        </div>
      ) : null}

      {phase === "noResults" ? <SelectDropdownEmpty type="noResult" /> : null}
      {phase === "emptyData" ? (
        <SelectDropdownEmpty type="noData" onAction={onEmptyAction} />
      ) : null}
      {phase === "loadFailed" ? (
        <SelectDropdownEmpty type="loadFailed" onAction={onEmptyAction} />
      ) : null}
    </div>
  );
}
