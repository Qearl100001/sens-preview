import { SensButton } from "./SensButton";
import { SensEmptyState } from "./SensEmptyState";
import { useSensSelectDropdownStyle } from "./SensSelectDropdown";
import { useSensSearchPrefix } from "./fieldIconProps";
import "./select-dropdown-preview.css";

type EmptyStatePreviewProps = {
  label: string;
  count: string;
  searchable?: boolean;
  toolbar?: boolean;
};

function EmptyStateToolbar() {
  return (
    <div className="sens-select-empty-preview-toolbar">
      <div className="sens-select-empty-preview-toolbar-buttons">
        <SensButton tone="secondary" size="small">
          按钮
        </SensButton>
        <SensButton tone="primary" size="small" disabled>
          按钮
        </SensButton>
      </div>
    </div>
  );
}

function EmptyStatePreview({ label, count, searchable = false, toolbar = false }: EmptyStatePreviewProps) {
  return (
    <div className="sens-select-empty-preview-item">
      <span className="sens-select-empty-preview-label">{label}</span>
      <div className="sens-select-empty-preview-panel">
        {searchable ? (
          <div className="sens-select-empty-preview-search">
            {useSensSearchPrefix()}
            <span>搜索框</span>
          </div>
        ) : null}
        <div className="sens-select-empty-preview-count">{count}</div>
        <SensEmptyState
          scope="non-page"
          type="noData"
          size="special"
          title="暂无数据"
          descriptionPrefix="暂无数据，请"
          actionLabel="添加"
          className="sens-select-empty-preview-content"
        />
        {toolbar ? <EmptyStateToolbar /> : null}
      </div>
    </div>
  );
}

export function SelectDropdownEmptyStatesPreview() {
  const dropdownStyle = useSensSelectDropdownStyle();

  return (
    <section className="sens-select-empty-preview" aria-label="下拉菜单内容状态">
      <h3 className="sens-select-empty-preview-title">下拉菜单内容状态</h3>
      <div className="sens-select-empty-preview-grid">
        <div style={dropdownStyle}>
          <EmptyStatePreview label="无搜索 · 无操作区" count="共 0 条数据" />
        </div>
        <div style={dropdownStyle}>
          <EmptyStatePreview label="无搜索 · 有操作区" count="共 0 条数据" toolbar />
        </div>
        <div style={dropdownStyle}>
          <EmptyStatePreview label="有搜索 · 有操作区" count="共 0 条数据" searchable toolbar />
        </div>
        <div style={dropdownStyle}>
          <EmptyStatePreview label="有搜索 · 无操作区" count="共 20 条数据" searchable />
        </div>
      </div>
    </section>
  );
}
