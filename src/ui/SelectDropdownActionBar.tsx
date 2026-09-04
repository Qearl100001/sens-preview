import { useTranslation } from "react-i18next";
import { SensButton } from "./SensButton";
import { SensCheckbox } from "./SensCheckbox";

const I18N_NS = "组件库";

export interface SelectDropdownActionBarProps {
  selectedCount: number;
  selectAllChecked: boolean;
  selectAllIndeterminate: boolean;
  selectAllDisabled?: boolean;
  onSelectAllChange: (checked: boolean) => void;
  onDiscard: () => void;
  onComplete: () => void;
}

/** 多选浮层底部操作条：全选 + 放弃 + 完成 (N)。Figma `17691:63201`。 */
export function SelectDropdownActionBar({
  selectedCount,
  selectAllChecked,
  selectAllIndeterminate,
  selectAllDisabled = false,
  onSelectAllChange,
  onDiscard,
  onComplete,
}: SelectDropdownActionBarProps) {
  const { t } = useTranslation();
  const cancelText = t(`${I18N_NS}.sensd-select-cancelText`, { defaultValue: "放弃" });
  const okText = t(`${I18N_NS}.sensd-select-okText`, { defaultValue: "完成" });
  const selectAllText = t(`${I18N_NS}.sensd-selectPanel-selectAll`, { defaultValue: "全选" });

  const toggleSelectAll = () => {
    if (selectAllDisabled) return;
    onSelectAllChange(!selectAllChecked);
  };

  return (
    <div
      className="sens-select-dropdown-actionbar"
      data-select-all={selectAllChecked ? "all" : selectAllIndeterminate ? "mixed" : "none"}
      onMouseDown={(event) => event.preventDefault()}
    >
      <div
        className="sens-select-dropdown-actionbar-select-hit"
        role="checkbox"
        aria-checked={selectAllIndeterminate ? "mixed" : selectAllChecked}
        aria-disabled={selectAllDisabled || undefined}
        aria-label={selectAllText}
        tabIndex={selectAllDisabled ? -1 : 0}
        onClick={toggleSelectAll}
        onKeyDown={(event) => {
          if (event.key === " " || event.key === "Enter") {
            event.preventDefault();
            toggleSelectAll();
          }
        }}
      >
        <SensCheckbox
          className="sens-select-dropdown-actionbar-select"
          checked={selectAllChecked}
          indeterminate={selectAllIndeterminate}
          disabled={selectAllDisabled}
          readOnly
          tabIndex={-1}
          aria-hidden
        >
          {selectAllText}
        </SensCheckbox>
      </div>
      <div className="sens-select-dropdown-actionbar-buttons">
        <SensButton tone="secondary" size="small" onClick={onDiscard}>
          {cancelText}
        </SensButton>
        <SensButton tone="primary" size="small" onClick={onComplete}>
          {`${okText} (${selectedCount})`}
        </SensButton>
      </div>
    </div>
  );
}
