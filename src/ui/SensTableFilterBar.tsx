import { useState, type CSSProperties, type CompositionEvent, type ReactNode } from "react";
import { SensIcon } from "../design-system/icons";
import { tokenRgba } from "../design-system/color-utils";
import { getDividerColor, getDividerHairlineWidth } from "../design-system/divider";
import { getTypographyToken } from "../design-system/typography";
import { getUnitToken } from "../design-system/unit";
import { SearchInput, SearchTriggerInput, SEARCH_INPUT_DEFAULT_WIDTH } from "./SearchInput";
import { SensButton } from "./SensButton";
import { SensSelectDropdown } from "./SensSelectDropdown";
import "./table-filter.css";

/** 表格筛选触发框空态宽（Figma 698:22737；仅表格筛选上下文） */
export const TABLE_FILTER_TRIGGER_WIDTH = 148;
/**
 * 展开区可视高度：首行之外再露 2.5 行（整区三行半）
 * = 行1 32 + 行距 16 + 行2 32 + 行距 16 + 半行 16 → 112（Figma 761:69440 / 761:67515）
 */
export const TABLE_FILTER_EXPANDED_MAX_HEIGHT = 112;
/** 展开区细滚条宽；与 Select 展示型多行同一 6px 手法，非 unit token */
const TABLE_FILTER_SCROLLBAR_SIZE = 6;

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
    "--sens-table-filter-scrollbar-size": px(TABLE_FILTER_SCROLLBAR_SIZE),
    "--sens-table-filter-scrollbar-radius": px(getUnitToken("radius/s")),
    "--sens-table-filter-scrollbar-thumb": tokenRgba("outline-color-transparent", 0.35),
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
  /**
   * 传入即受控。单选空值用 `null`；多选空值用 `[]`。
   * 不要用 `undefined`（会变成非受控）。
   */
  value?: string | string[] | null;
  defaultValue?: string | string[];
  onChange?: (value: string | string[] | null) => void;
  placeholder?: string;
  /**
   * 表格筛选行多选走个数型（`multiDisplay="count"`），不要裸 `mode="multiple"`。
   * 搜索场景等单选筛选项不要开。
   */
  multiple?: boolean;
  /** 自定义控件（已自带宽度时，外层不再套表格筛选定宽） */
  control?: ReactNode;
}

export type SensTableFilterSearchMode = "realtime" | "trigger";

export interface SensTableFilterBarProps {
  /** 首行左侧搜索；传入 false 隐藏；默认展示 200px 实时搜索 */
  search?: ReactNode | false;
  /** 默认 realtime；trigger 为静态搜索（点按钮 / 回车才提交） */
  searchMode?: SensTableFilterSearchMode;
  searchValue?: string;
  defaultSearchValue?: string;
  searchPlaceholder?: string;
  /** 框内值变化（实时含输入法组字；触发型只改草稿） */
  onSearchChange?: (value: string) => void;
  /** 触发型：点搜索按钮或回车。清空按钮不提交 */
  onSearch?: (value: string) => void;
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

function isFieldControlled(field: SensTableFilterField): boolean {
  return Object.prototype.hasOwnProperty.call(field, "value");
}

function toMultipleValues(raw: SensTableFilterField["value"] | SensTableFilterField["defaultValue"]): string[] {
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === "string" && raw !== "") return [raw];
  return [];
}

function TableFilterSelectField({ field }: { field: SensTableFilterField }) {
  const isMultiple = Boolean(field.multiple);
  const [innerValue, setInnerValue] = useState<string | string[] | null>(
    field.defaultValue ?? (isMultiple ? [] : null),
  );
  const isControlled = isFieldControlled(field);
  const value = isControlled ? field.value : innerValue;

  const emitValue = (next: string | string[] | null) => {
    if (!isControlled) setInnerValue(next);
    field.onChange?.(next);
  };

  const selectValue = isMultiple ? toMultipleValues(value) : typeof value === "string" ? value : null;

  return (
    <div className="sens-table-filter-field">
      <span className="sens-table-filter-field__label">{field.label}</span>
      <div className="sens-table-filter-field__control">
        <SensSelectDropdown
          options={field.options}
          value={selectValue}
          placeholder={field.placeholder ?? "请选择"}
          clearable
          widthPreset="148"
          popupMatchSelectWidth={false}
          {...(isMultiple
            ? {
                multiDisplay: "count" as const,
                confirmMultiple: true,
                onClear: () => emitValue([]),
                onChange: (next: string | number | Array<string | number> | null) =>
                  emitValue(Array.isArray(next) ? next.map(String) : []),
              }
            : {
                onClear: () => emitValue(null),
                onChange: (next: string | number | Array<string | number> | null) =>
                  emitValue(typeof next === "string" ? next : null),
              })}
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
  const current = isFieldControlled(field) ? field.value : field.defaultValue;
  if (Array.isArray(current)) return current.length > 0;
  return current != null && current !== "";
}

/**
 * 复合表格 · 筛选区（Figma 复合表格 v2.1 · 筛选区域）
 * - 左标题右控件，间距 spacing/horizontal/2x
 * - 项间距 / 行距 spacing/horizontal/4x · spacing/vertical/4x
 * - 触发定宽 128 / 148 仅本组件上下文
 * - 展开/收起固定在首行筛选右侧；更多筛选项在第二行，点展开才出现
 */
export function SensTableFilterBar({
  search,
  searchMode = "realtime",
  searchValue,
  defaultSearchValue,
  searchPlaceholder,
  onSearchChange,
  onSearch,
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

  const emitSearchValue = (next: string) => {
    if (!searchControlled) setInnerSearch(next);
    onSearchChange?.(next);
  };

  const onCompositionValue = (event: CompositionEvent<HTMLInputElement>) => {
    emitSearchValue(event.currentTarget.value);
  };

  const searchNode =
    search === false
      ? null
      : (search ?? (
          <div className="sens-table-filter-bar__search">
            {searchMode === "trigger" ? (
              <SearchTriggerInput
                width={SEARCH_INPUT_DEFAULT_WIDTH}
                value={resolvedSearchValue}
                placeholder={searchPlaceholder}
                onChange={(event) => emitSearchValue(event.target.value)}
                onSearch={(value, _event, info) => {
                  if (info?.source === "clear") return;
                  onSearch?.(value);
                }}
              />
            ) : (
              <SearchInput
                width={SEARCH_INPUT_DEFAULT_WIDTH}
                value={resolvedSearchValue}
                placeholder={searchPlaceholder}
                onChange={(event) => emitSearchValue(event.target.value)}
                onCompositionUpdate={onCompositionValue}
                onCompositionEnd={onCompositionValue}
              />
            )}
          </div>
        ));

  return (
    <div
      className={["sens-table-filter-bar", className].filter(Boolean).join(" ")}
      style={{ ...buildTableFilterTokenVars(), ...style }}
    >
      <div className="sens-table-filter-bar__flow">
        <div className="sens-table-filter-bar__row">
          {searchNode}
          {primaryFields.map((field) => (
            <TableFilterFieldSlot key={field.key} field={field} />
          ))}
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
        {showToggle && isOpen ? (
          <div className="sens-table-filter-bar__more">
            {moreFields.map((field) => (
              <TableFilterFieldSlot key={field.key} field={field} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
