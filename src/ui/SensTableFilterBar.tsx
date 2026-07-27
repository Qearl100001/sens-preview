import { useState, type CSSProperties, type ReactNode } from "react";
import { SensIcon } from "../design-system/icons";
import { tokenRgba } from "../design-system/color-utils";
import { getDividerColor, getDividerHairlineWidth } from "../design-system/divider";
import { getTypographyToken } from "../design-system/typography";
import { getUnitToken } from "../design-system/unit";
import { SearchInput, SEARCH_INPUT_DEFAULT_WIDTH } from "./SearchInput";
import { SensButton } from "./SensButton";
import { SensSelectDropdown } from "./SensSelectDropdown";
import "./table-filter.css";

/** 表格筛选触发框空态宽（Figma 698:22737；仅表格筛选上下文） */
export const TABLE_FILTER_TRIGGER_WIDTH = 148;
/**
 * 展开区可视高度：首行之外再露 2.5 行
 * = 2 × 32 + spacing/4x + 半行 16 → 112（Figma 761:69440）
 */
export const TABLE_FILTER_EXPANDED_MAX_HEIGHT = 112;

function px(value: number): string {
  return `${value}px`;
}

function buildTableFilterTokenVars(): CSSProperties {
  const rowGap = getUnitToken("spacing/vertical/4x");
  const itemGap = getUnitToken("spacing/horizontal/4x");
  const labelGap = getUnitToken("spacing/horizontal/2x");
  const actionGap = getUnitToken("spacing/horizontal/2x");

  return {
    "--sens-table-filter-row-gap": px(rowGap),
    "--sens-table-filter-item-gap": px(itemGap),
    "--sens-table-filter-label-gap": px(labelGap),
    "--sens-table-filter-action-gap": px(actionGap),
    "--sens-table-filter-divider-width": px(getDividerHairlineWidth()),
    "--sens-table-filter-action-divider-color": getDividerColor("light", "transparent"),
    "--sens-table-filter-control-height": px(getUnitToken("size/component-height/m")),
    "--sens-table-filter-expanded-max-height": px(TABLE_FILTER_EXPANDED_MAX_HEIGHT),
    "--sens-table-filter-trigger-width": px(TABLE_FILTER_TRIGGER_WIDTH),
    "--sens-table-filter-label-color": tokenRgba("text-color-transparent", 0.9),
    "--sens-table-filter-label-font-size": px(getTypographyToken("font-size/m")),
    "--sens-table-filter-label-line-height": px(getTypographyToken("line-height/m")),
    "--sens-table-filter-label-weight": getTypographyToken("font-weight/medium"),
  } as CSSProperties;
}

export interface SensTableFilterSelectOption {
  label: string;
  value: string;
}

export interface SensTableFilterField {
  key: string;
  label: ReactNode;
  /** 默认渲染 SensSelectDropdown；与 control 二选一 */
  options?: SensTableFilterSelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string | undefined) => void;
  placeholder?: string;
  /** 自定义控件（已自带宽度时，外层不再套表格筛选定宽） */
  control?: ReactNode;
}

export interface SensTableFilterBarProps {
  /** 首行左侧搜索；传入 false 隐藏；默认展示 200px 实时搜索 */
  search?: ReactNode | false;
  searchValue?: string;
  defaultSearchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  /** 首行筛选项（始终可见） */
  primaryFields: SensTableFilterField[];
  /** 展开后出现的更多筛选项；有内容时显示展开/收起 */
  moreFields?: SensTableFilterField[];
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  expandLabel?: string;
  collapseLabel?: string;
  /** 有筛选条件时展示在展开/收起左侧；不受展开状态影响 */
  showReset?: boolean;
  resetLabel?: string;
  onReset?: () => void;
  className?: string;
  style?: CSSProperties;
}

function TableFilterSelectField({ field }: { field: SensTableFilterField }) {
  const [innerValue, setInnerValue] = useState(field.defaultValue);
  const isControlled = field.value !== undefined;
  const value = isControlled ? field.value : innerValue;

  return (
    <div className="sens-table-filter-field">
      <span className="sens-table-filter-field__label">{field.label}</span>
      <div className="sens-table-filter-field__control">
        <SensSelectDropdown
          options={field.options}
          value={value ?? null}
          placeholder={field.placeholder ?? "请选择"}
          clearable
          widthPreset="148"
          popupMatchSelectWidth={false}
          onClear={() => {
            if (!isControlled) setInnerValue(undefined);
            field.onChange?.(undefined);
          }}
          onChange={(next) => {
            const nextValue = typeof next === "string" ? next : undefined;
            if (!isControlled) setInnerValue(nextValue);
            field.onChange?.(nextValue);
          }}
        />
      </div>
    </div>
  );
}

function TableFilterFieldSlot({ field }: { field: SensTableFilterField }) {
  if (field.control) {
    return (
      <div className="sens-table-filter-field">
        <span className="sens-table-filter-field__label">{field.label}</span>
        {field.control}
      </div>
    );
  }

  return <TableFilterSelectField field={field} />;
}

function hasFieldValue(field: SensTableFilterField): boolean {
  return Boolean(field.value ?? field.defaultValue);
}

/**
 * 复合表格 · 筛选区（Figma 复合表格 v2.1 · 筛选区域）
 * - 左标题右控件，间距 spacing/horizontal/2x
 * - 项间距 / 行距 spacing/horizontal/4x · spacing/vertical/4x
 * - 触发定宽 128 / 148 仅本组件上下文
 * - 展开/收起是筛选流里的最后一个 inline item，不独占一行
 */
export function SensTableFilterBar({
  search,
  searchValue,
  defaultSearchValue,
  searchPlaceholder,
  onSearchChange,
  primaryFields,
  moreFields = [],
  expanded,
  defaultExpanded = false,
  onExpandedChange,
  expandLabel = "展开",
  collapseLabel = "收起",
  showReset,
  resetLabel = "重置",
  onReset,
  className,
  style,
}: SensTableFilterBarProps) {
  const [innerExpanded, setInnerExpanded] = useState(defaultExpanded);
  const [innerSearch, setInnerSearch] = useState(defaultSearchValue ?? "");
  const isExpandedControlled = expanded !== undefined;
  const isOpen = isExpandedControlled ? expanded : innerExpanded;
  const showToggle = moreFields.length > 0;
  const searchControlled = searchValue !== undefined;
  const resolvedSearchValue = searchControlled ? searchValue : innerSearch;
  const inferredHasValue =
    Boolean(resolvedSearchValue) || primaryFields.some(hasFieldValue) || moreFields.some(hasFieldValue);
  const shouldShowReset = showReset ?? inferredHasValue;
  const showActions = shouldShowReset || showToggle;

  const setOpen = (next: boolean) => {
    if (!isExpandedControlled) setInnerExpanded(next);
    onExpandedChange?.(next);
  };

  const searchNode =
    search === false
      ? null
      : (search ?? (
          <div className="sens-table-filter-bar__search">
            <SearchInput
              width={SEARCH_INPUT_DEFAULT_WIDTH}
              value={resolvedSearchValue}
              placeholder={searchPlaceholder}
              onChange={(event) => {
                const next = event.target.value;
                if (!searchControlled) setInnerSearch(next);
                onSearchChange?.(next);
              }}
            />
          </div>
        ));

  return (
    <div
      className={["sens-table-filter-bar", className].filter(Boolean).join(" ")}
      style={{ ...buildTableFilterTokenVars(), ...style }}
    >
      <div
        className={[
          "sens-table-filter-bar__flow",
          showToggle && isOpen ? "sens-table-filter-bar__flow--expanded" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {searchNode}
        {primaryFields.map((field) => (
          <TableFilterFieldSlot key={field.key} field={field} />
        ))}
        {showToggle && isOpen
          ? moreFields.map((field) => (
              <TableFilterFieldSlot key={field.key} field={field} />
            ))
          : null}
        {showActions ? (
          <div className="sens-table-filter-bar__actions">
            {shouldShowReset ? (
              <SensButton tone="link" onClick={onReset}>
                {resetLabel}
              </SensButton>
            ) : null}
            {shouldShowReset && showToggle ? <span className="sens-table-filter-bar__action-divider" /> : null}
            {showToggle ? (
              <SensButton
                tone="link"
                icon={
                  <SensIcon
                    name={isOpen ? "filter-chevron-up" : "filter-chevron-down"}
                    sizeToken="size/icon/m"
                    color="currentColor"
                  />
                }
                iconPosition="end"
                onClick={() => setOpen(!isOpen)}
              >
                {isOpen ? collapseLabel : expandLabel}
              </SensButton>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
