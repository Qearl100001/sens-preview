import {
  isValidElement,
  useMemo,
  useState,
  type ChangeEventHandler,
  type CSSProperties,
  type MouseEventHandler,
  type ReactElement,
  type ReactNode,
} from "react";
import type { TableProps } from "antd";
import { Table } from "antd";
import type { ColumnGroupType, ColumnsType, ColumnType } from "antd/es/table";
import type { ColumnTitleProps } from "antd/es/table/interface";
import { getColorToken } from "../design-system/color-utils";
import { SensIcon } from "../design-system/icons";
import { getDividerBorder, getDividerColor, getDividerHairlineWidth } from "../design-system/divider";
import { getTypographyToken } from "../design-system/typography";
import { getUnitToken } from "../design-system/unit";
import type { NonPageEmptyIllustrationKey } from "./EmptyStateIllustrations";
import { SensButton, SensDropdownButton, type SensButtonVariant } from "./SensButton";
import { SensCheckbox } from "./SensCheckbox";
import type { SensDropdownMenuItemConfig } from "./SensDropdownMenuItem";
import { EMPTY_STATE_NON_PAGE_ILLUSTRATION_BASE, SensEmptyState } from "./SensEmptyState";
import { SensTips } from "./SensTips";
import "./table.css";

export interface TableActionItem {
  key: string;
  label: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export type TableInfoActionTone = Extract<
  SensButtonVariant,
  "secondary" | "tertiary" | "dangerSecondary" | "dangerSecondaryWeak" | "dangerTertiary" | "dangerTertiaryWeak"
>;

export interface TableInfoActionItem extends TableActionItem {
  /** 批量操作区使用小按钮；默认 secondary；删除等其他风险用 dangerSecondaryWeak；取消选择等弱操作用 tertiary */
  tone?: TableInfoActionTone;
}

/** 信息栏右侧设置列目前可追加的动作：仅小号链接按钮。 */
export interface TableInfoLinkAction extends TableActionItem {}

export interface TableInfoBarProps {
  /** 默认计数，展示为「共 N 条」 */
  total?: number;
  /** 筛选结果计数，传入后展示为「已找到 N 条」 */
  foundTotal?: number;
  /** 当前页选中数量，传入且大于 0 时追加「当页选中 N 条」 */
  selectedCount?: number;
  /** 信息区批量操作：小号二级 / 二级弱警告 / 三级按钮 */
  actions?: TableInfoActionItem[];
  /** 信息区右侧设置列目前的链接动作；仅渲染为小号链接按钮。 */
  linkActions?: TableInfoLinkAction[];
  /** 信息区最右侧操作入口，例如列设置 icon */
  extra?: ReactNode;
  /** 自定义信息区内容；传入后替代默认计数文案 */
  children?: ReactNode;
}

export interface TableShellProps<T extends object> extends TableProps<T> {
  /** 信息区计数，默认「共 N 条」；未传时取 dataSource.length */
  total?: number;
  /** 筛选结果计数，传入后展示为「已找到 N 条」 */
  foundTotal?: number;
  /** 当前页选中数量，传入且大于 0 时追加「当页选中 N 条」 */
  selectedCount?: number;
  /** 信息区批量操作：小号二级 / 二级弱警告 / 三级按钮 */
  infoActions?: TableInfoActionItem[];
  /** 信息区右侧设置列目前的链接动作；仅渲染为小号链接按钮。 */
  infoLinkActions?: TableInfoLinkAction[];
  /** 信息区最右侧操作入口，例如列设置 icon */
  infoExtra?: ReactNode;
  /** 自定义信息区内容 */
  infoContent?: ReactNode;
  /** 表格框内底部区域；复合表格可放分页器，不改变基础表格 pagination=false 的约定 */
  footerBar?: ReactNode;
  /** 是否展示信息区；高度来自 size/component-height/xl */
  showInfoBar?: boolean;
  /** 空状态插图类型 */
  emptyState?: NonPageEmptyIllustrationKey;
  /** 覆盖空态说明；不传则走 SensEmptyState 默认标题 + 说明（含添加 / 刷新链接） */
  emptyDescription?: ReactNode;
  /** 空状态额外操作；默认空态用说明内嵌链接，不必再塞三级按钮 */
  emptyAction?: ReactNode;
  /** 嵌套在卡片内时去掉外壳描边，避免双层边框 */
  borderless?: boolean;
  /**
   * 页面内容区滚动时，让表头跟随到内容区顶部；只用于没有表体内部纵向滚动的长表格页面。
   * 表头离开表格底部后必须随表格离场，不能成为全局固定导航。
   */
  stickyHeader?: "page";
}

function formatTableCount(value: number) {
  return value.toLocaleString();
}

function px(value: number): string {
  return `${value}px`;
}

/** Figma `799:77513` 插画区 316：插画 + 文案栈 + 空态 padding + 上下留白居中 */
function tableEmptyMinHeight(): number {
  return (
    EMPTY_STATE_NON_PAGE_ILLUSTRATION_BASE +
    getUnitToken("spacing/vertical/3x") +
    getTypographyToken("line-height/m") +
    getUnitToken("spacing/vertical/1x") +
    getTypographyToken("line-height/s") +
    getUnitToken("spacing/5x") * 2 +
    (getUnitToken("size/component-height/xxxl") + getUnitToken("spacing/1x")) * 2
  );
}

function asTipsTrigger(node: ReactNode): ReactElement {
  if (isValidElement(node)) return node;
  return <span className="sens-table-sorter-title">{node}</span>;
}

/**
 * antd 的列标题既可以是 ReactNode，也可以是接收列上下文的渲染函数。
 * 先把函数执行为节点，再交给 SensTips，避免把渲染函数直接塞入 React 子树。
 */
function resolveColumnTitle<T extends object>(
  title: ColumnType<T>["title"],
  context: ColumnTitleProps<T>,
): ReactNode {
  if (typeof title === "function") {
    return (title as (props: ColumnTitleProps<T>) => ReactNode)(context);
  }

  return title as ReactNode;
}

function resolveTipsTitle(title: unknown): ReactNode {
  if (typeof title === "function") {
    return (title as () => ReactNode)();
  }

  return title as ReactNode;
}

type SortOrder = "ascend" | "descend";

function nextSortOrder(sortOrder?: SortOrder): SortOrder | undefined {
  if (sortOrder === "ascend") return "descend";
  if (sortOrder === "descend") return undefined;
  return "ascend";
}

function SensTableSorterIcon({
  sortOrder,
  onSort,
}: {
  sortOrder?: SortOrder;
  onSort: () => void;
}) {
  return (
    <button
      type="button"
      className={`sens-table-sorter-icon is-${sortOrder ?? "default"}`}
      aria-label={sortOrder === "ascend" ? "当前为升序，再次点击切换为降序" : sortOrder === "descend" ? "当前为降序，再次点击取消排序" : "排序"}
      onClick={onSort}
      style={{ "--sens-table-sorter-default-color": getColorToken("icon-color-transparent") } as CSSProperties}
    >
      <span className="sens-table-sorter-arrow sens-table-sorter-arrow--up" aria-hidden="true">
        <SensIcon name="up-mini" variant="filled" size={8} color="currentColor" />
      </span>
      <span className="sens-table-sorter-arrow sens-table-sorter-arrow--down" aria-hidden="true">
        <SensIcon name="down-mini" variant="filled" size={8} color="currentColor" />
      </span>
    </button>
  );
}

function classNames(...names: Array<string | undefined | false>) {
  return names.filter(Boolean).join(" ");
}

function columnIdentity<T extends object>(column: ColumnType<T>) {
  const key = column.key ?? column.dataIndex;
  if (Array.isArray(key)) return key.join(".");
  return key == null ? undefined : String(key);
}

interface SortState {
  column?: string;
  order?: SortOrder;
}

function sorterState(sorter: unknown): SortState {
  if (!sorter || typeof sorter !== "object") return {};
  const result = sorter as { columnKey?: unknown; field?: unknown; order?: SortOrder };
  if (!result.order) return {};
  const key = result.columnKey ?? result.field;
  return {
    column: Array.isArray(key) ? key.join(".") : key == null ? undefined : String(key),
    order: result.order,
  };
}

function controlledSorterState<T extends object>(columns: ColumnsType<T> | undefined): SortState {
  if (!columns) return {};

  for (const column of columns) {
    if ("children" in column && column.children) {
      const childState = controlledSorterState(column.children);
      if (childState.column) return childState;
      continue;
    }

    const leaf = column as ColumnType<T>;
    if (leaf.sortOrder) return { column: columnIdentity(leaf), order: leaf.sortOrder };
  }

  return {};
}

function adaptTableSorterTips<T extends object>(
  columns: ColumnsType<T> | undefined,
  activeSort: SortState,
  onSort: (column: string) => void,
): ColumnsType<T> | undefined {
  if (!columns) return columns;

  return columns.map((column) => {
    if ("children" in column && column.children) {
      const group = column as ColumnGroupType<T>;
      return { ...group, children: adaptTableSorterTips(group.children, activeSort, onSort) ?? group.children };
    }

    const leaf = column as ColumnType<T>;
    if (!leaf.sorter) return leaf;

    const tooltip = leaf.showSorterTooltip;
    const showTips = tooltip !== false;
    const tipTitle =
      tooltip && typeof tooltip === "object" && "title" in tooltip && tooltip.title != null
        ? tooltip.title
        : "点击排序";
    const rawTitle = leaf.title;
    const identity = columnIdentity(leaf);
    const isNumericColumn = leaf.align === "right";
    // 只有升序或降序生效时才激活整列；第三次点击回到默认后，表头与单元格背景必须同时移除。
    const isActive = identity === activeSort.column && activeSort.order != null;
    const originalHeaderCell = leaf.onHeaderCell;
    const originalCell = leaf.onCell;
    const { sorter: _sorter, sortOrder: _sortOrder, showSorterTooltip: _showSorterTooltip, sortIcon: _sortIcon, ...plainLeaf } = leaf;

    return {
      ...plainLeaf,
      // 排序交互由 Sens 自己维护：不把 sorter、sortOrder 或 sortIcon 交给 antd，避免其注入表头 hover 与排序样式。
      title: (ctx) => {
        const inner = resolveColumnTitle(rawTitle, ctx);
        const sorterIcon = (
          <SensTableSorterIcon
            sortOrder={isActive ? activeSort.order : undefined}
            onSort={() => {
              if (identity) onSort(identity);
            }}
          />
        );
        const sorterTrigger = showTips ? (
          <SensTips title={resolveTipsTitle(tipTitle)} placement="top">{asTipsTrigger(sorterIcon)}</SensTips>
        ) : (
          sorterIcon
        );

        return (
          <span
            className={classNames(
              "sens-table-sorter-heading",
              isNumericColumn && "sens-table-number-sorter-heading",
            )}
          >
            {inner}
            {sorterTrigger}
          </span>
        );
      },
      onHeaderCell: (column) => {
        const attributes = originalHeaderCell?.(column) ?? {};
        return {
          ...attributes,
          style: {
            ...attributes.style,
            ...(isNumericColumn ? { textAlign: "right" } : {}),
          },
          className: classNames(
            attributes.className,
            "sens-table-sortable-header",
            isNumericColumn && "sens-table-number-header",
            isActive && "sens-table-sort-column-active",
          ),
        };
      },
      onCell: (record, index) => {
        const attributes = originalCell?.(record, index) ?? {};
        return {
          ...attributes,
          className: classNames(
            attributes.className,
            isNumericColumn && "sens-table-number-cell",
            isActive && "sens-table-sortable-cell",
          ),
        };
      },
    };
  });
}

function findSortableColumn<T extends object>(
  columns: ColumnsType<T> | undefined,
  identity?: string,
): ColumnType<T> | undefined {
  if (!columns || !identity) return undefined;

  for (const column of columns) {
    if ("children" in column && column.children) {
      const child = findSortableColumn(column.children, identity);
      if (child) return child;
      continue;
    }

    const leaf = column as ColumnType<T>;
    if (leaf.sorter && columnIdentity(leaf) === identity) return leaf;
  }

  return undefined;
}

function readRecordValue(record: object, dataIndex: ColumnType<object>["dataIndex"]): unknown {
  if (dataIndex == null) return undefined;
  const path = Array.isArray(dataIndex) ? dataIndex : [dataIndex];
  return path.reduce<unknown>((value, key) => (value && typeof value === "object" ? (value as Record<string, unknown>)[key] : undefined), record);
}

function defaultRecordCompare<T extends object>(recordA: T, recordB: T, column: ColumnType<T>): number {
  const valueA = readRecordValue(recordA, column.dataIndex as ColumnType<object>["dataIndex"]);
  const valueB = readRecordValue(recordB, column.dataIndex as ColumnType<object>["dataIndex"]);
  if (valueA == null && valueB == null) return 0;
  if (valueA == null) return -1;
  if (valueB == null) return 1;
  if (typeof valueA === "number" && typeof valueB === "number") return valueA - valueB;
  return String(valueA).localeCompare(String(valueB), "zh-CN");
}

function sortTableData<T extends object>(
  dataSource: readonly T[] | undefined,
  columns: ColumnsType<T> | undefined,
  sort: SortState,
): readonly T[] | undefined {
  if (!dataSource || !sort.column || !sort.order) return dataSource;
  const column = findSortableColumn(columns, sort.column);
  if (!column) return dataSource;
  const sorter = column.sorter;
  const compare =
    typeof sorter === "function"
      ? sorter
      : sorter && typeof sorter === "object" && "compare" in sorter && typeof sorter.compare === "function"
        ? sorter.compare
        : (recordA: T, recordB: T) => defaultRecordCompare(recordA, recordB, column);
  const direction = sort.order === "ascend" ? 1 : -1;
  return [...dataSource].sort((recordA, recordB) => compare(recordA, recordB) * direction);
}

type AntdCheckboxOriginProps = {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onClick?: MouseEventHandler<HTMLInputElement>;
  "aria-label"?: string;
};

function adaptAntdCheckboxNode(origin: ReactNode, fallbackAriaLabel: string): ReactNode {
  if (!isValidElement<AntdCheckboxOriginProps>(origin)) return origin;
  const { checked, indeterminate, disabled, onChange, onClick } = origin.props;

  return (
    <SensCheckbox
      className="sens-table-checkbox"
      checked={!!checked}
      indeterminate={!!indeterminate}
      disabled={disabled}
      onChange={onChange}
      onClick={onClick}
      aria-label={origin.props["aria-label"] ?? fallbackAriaLabel}
    />
  );
}

function adaptTableRowSelection<T extends object>(
  rowSelection: TableProps<T>["rowSelection"],
): TableProps<T>["rowSelection"] {
  if (!rowSelection || rowSelection.type === "radio") return rowSelection;

  const userColumnTitle = rowSelection.columnTitle;
  const userRenderCell = rowSelection.renderCell;

  return {
    ...rowSelection,
    columnWidth: getUnitToken("size/component-height/m"),
    columnTitle: (originNode) => {
      const checkbox = adaptAntdCheckboxNode(originNode, "全选当页");
      if (typeof userColumnTitle === "function") return userColumnTitle(checkbox);
      if (userColumnTitle != null) return userColumnTitle;
      return checkbox;
    },
    renderCell: (checked, record, index, originNode) => {
      const checkbox = adaptAntdCheckboxNode(originNode, "选择行");
      if (userRenderCell) return userRenderCell(checked, record, index, checkbox);
      return checkbox;
    },
  };
}

function buildTableTokenVars(): CSSProperties {
  const infoHeight = getUnitToken("size/component-height/xl");
  const infoLineHeight = getTypographyToken("line-height/s");
  const infoPaddingBlock = (infoHeight - infoLineHeight) / 2;
  const rowHeight = getUnitToken("size/component-height/xxxl");

  return {
    "--sens-table-info-height": px(infoHeight),
    "--sens-table-info-padding-block": px(infoPaddingBlock),
    "--sens-table-info-padding-inline": px(getUnitToken("spacing/horizontal/4x")),
    "--sens-table-info-gap": px(getUnitToken("spacing/horizontal/4x")),
    "--sens-table-info-main-gap": px(getUnitToken("spacing/horizontal/6x")),
    "--sens-table-info-action-gap": px(getUnitToken("spacing/horizontal/2x")),
    "--sens-table-info-font-size": px(getTypographyToken("font-size/s")),
    "--sens-table-info-line-height": px(infoLineHeight),
    "--sens-table-info-color": getColorToken("text-sub-color"),
    "--sens-table-info-border": getDividerColor("light", "solid"),
    "--sens-table-footer-height": px(getUnitToken("size/component-height/xxxl")),
    "--sens-table-footer-padding-block": px(getUnitToken("spacing/vertical/3x")),
    "--sens-table-footer-padding-inline": px(getUnitToken("spacing/horizontal/4x")),
    "--sens-table-footer-gap": px(getUnitToken("spacing/horizontal/4x")),
    "--sens-table-footer-bg": getColorToken("white"),
    "--sens-table-footer-text-color": getColorToken("text-sub-color"),
    "--sens-table-divider-width": px(getDividerHairlineWidth()),
    "--sens-table-shell-bg": getColorToken("white"),
    "--sens-table-shell-border": getDividerBorder("outline", "solid"),
    "--sens-table-shell-radius": px(getUnitToken("radius/l")),
    "--sens-table-header-bg": getColorToken("background-04"),
    "--sens-table-header-color": getColorToken("text-color"),
    "--sens-table-body-color": getColorToken("text-color"),
    "--sens-table-row-border": getDividerColor("weak", "solid"),
    "--sens-table-row-hover-bg": getColorToken("background-grey-hover"),
    "--sens-table-sorter-color": getColorToken("icon-color-transparent"),
    "--sens-table-sorter-hover-color": getColorToken("component-primary"),
    "--sens-table-sorter-pressed-color": getColorToken("component-active"),
    "--sens-table-sorter-active-color": getColorToken("component-primary"),
    "--sens-table-sort-column-bg": getColorToken("background-grey-hover"),
    "--sens-table-sort-cell-bg": getColorToken("background-04"),
    "--sens-table-row-selected-bg": getColorToken("white"),
    "--sens-table-row-height": px(rowHeight),
    "--sens-table-cell-padding-block": px(getUnitToken("spacing/1.5x")),
    "--sens-table-cell-padding-inline": px(getUnitToken("spacing/horizontal/4x")),
    "--sens-table-data-cell-padding-block": px(getUnitToken("spacing/vertical/3x")),
    "--sens-table-selection-column-width": px(getUnitToken("size/component-height/m")),
    "--sens-table-selection-checkbox-offset": px(getUnitToken("spacing/horizontal/4x")),
    "--sens-table-column-sorter-gap": px(getUnitToken("spacing/1x")),
    "--sens-table-column-sorter-reserve": px(getUnitToken("size/icon/m") + getUnitToken("spacing/1x")),
    "--sens-table-link-font-size": px(getTypographyToken("font-size/m")),
    "--sens-table-link-line-height": px(getTypographyToken("line-height/m")),
    "--sens-table-cell-loading-icon-color": getColorToken("icon-color-transparent"),
    "--sens-table-cell-error-color": getColorToken("warning-color"),
    "--sens-table-empty-min-height": px(tableEmptyMinHeight()),
  } as CSSProperties;
}

export function TableInfoBar({
  total = 0,
  foundTotal,
  selectedCount = 0,
  actions,
  linkActions,
  extra,
  children,
}: TableInfoBarProps) {
  const hasFoundTotal = typeof foundTotal === "number";
  const hasSelected = selectedCount > 0;
  const summary = hasFoundTotal ? `已找到 ${formatTableCount(foundTotal)} 条` : `共 ${formatTableCount(total)} 条`;
  const content = children ?? (
    <>
      {summary}
      {hasSelected ? `，当页选中 ${formatTableCount(selectedCount)} 条` : null}
    </>
  );

  return (
    <div
      className="sens-table-info"
      style={
        {
          ...buildTableTokenVars(),
        } as CSSProperties
      }
    >
      <div className="sens-table-info-main">
        <span className="sens-table-info-text">{content}</span>
        {actions?.length ? (
          <div className="sens-table-info-actions">
            {actions.map((item) => (
              <SensButton
                key={item.key}
                size="small"
                tone={item.tone ?? "secondary"}
                disabled={item.disabled}
                onClick={item.onClick}
              >
                {item.label}
              </SensButton>
            ))}
          </div>
        ) : null}
      </div>
      {linkActions?.length || extra ? (
        <div className="sens-table-info-extra">
          {linkActions?.length ? (
            <div className="sens-table-info-extra-links">
              {linkActions.map((item) => (
                <SensButton
                  key={item.key}
                  size="small"
                  tone="link"
                  disabled={item.disabled}
                  onClick={item.onClick}
                >
                  {item.label}
                </SensButton>
              ))}
            </div>
          ) : null}
          {extra}
        </div>
      ) : null}
    </div>
  );
}

/** 信息区右侧列设置：icon-only 小号弱化链接，不展示「设置」文案（table.md） */
export function TableInfoColumnSettingButton() {
  return (
    <SensTips title="设置列目" placement="top">
      <SensButton
        aria-label="设置列目"
        size="small"
        tone="linkWeak"
        icon={<SensIcon name="setting" size={14} color="currentColor" />}
      />
    </SensTips>
  );
}

export interface TableInfoRefreshableSummaryProps {
  /** 计数文案前缀默认「共」；筛选结果传「已找到」 */
  prefix?: "共" | "已找到";
  total: number;
  /** 展示为 yyyy-mm-dd hh:mm:ss */
  updatedAt: string;
  onRefresh?: () => void;
}

/**
 * 数据更新可刷新：文案后紧跟 reload 弱化链接按钮；与列设置（infoExtra）分离。
 */
export function TableInfoRefreshableSummary({
  prefix = "共",
  total,
  updatedAt,
  onRefresh,
}: TableInfoRefreshableSummaryProps) {
  return (
    <>
      <span>
        {prefix} {formatTableCount(total)} 条，数据更新于 {updatedAt}
      </span>
      <SensButton
        aria-label="刷新数据"
        size="small"
        tone="linkWeak"
        icon={<SensIcon name="reload" sizeToken="size/icon/m" color="currentColor" />}
        onClick={onRefresh}
      />
    </>
  );
}

interface TableEmptyStateProps {
  type?: NonPageEmptyIllustrationKey;
  description?: ReactNode;
  action?: ReactNode;
}

function TableEmptyState({ type = "noData", description, action }: TableEmptyStateProps) {
  const hasCustomDescription = description !== undefined;
  return (
    <div className="sens-table-empty">
      <SensEmptyState
        scope="non-page"
        type={type}
        size="base"
        className="sens-table-empty-state"
        {...(hasCustomDescription ? { description } : {})}
        actions={action}
      />
    </div>
  );
}

/**
 * 基础表格外壳：信息区 + 表体（见 components/base/table.md）
 * 所有视觉值都读取 SensD token；antd Table 只承担表格 DOM 与交互适配。
 */
export function TableShell<T extends object>({
  total,
  foundTotal,
  selectedCount,
  infoActions,
  infoLinkActions,
  infoExtra,
  infoContent,
  footerBar,
  showInfoBar = true,
  emptyState = "noData",
  emptyDescription,
  emptyAction,
  borderless = false,
  stickyHeader,
  columns,
  dataSource,
  className,
  locale,
  pagination = false,
  rowSelection,
  onChange,
  ...rest
}: TableShellProps<T>) {
  const [uncontrolledSort, setUncontrolledSort] = useState<SortState>({});
  const count = total ?? dataSource?.length ?? 0;
  const tableClassName = ["sens-table", className].filter(Boolean).join(" ");
  const shellClassName = [
    "sens-table-shell",
    footerBar && "sens-table-shell-has-footer",
    borderless && "sens-table-shell-borderless",
    stickyHeader === "page" && "sens-table-shell-page-sticky-header",
  ]
    .filter(Boolean)
    .join(" ");
  const tableTokenVars = buildTableTokenVars();
  const controlledSort = controlledSorterState(columns as ColumnsType<T> | undefined);
  const activeSort = controlledSort.column ? controlledSort : uncontrolledSort;
  const sortedDataSource = useMemo(
    () => sortTableData(dataSource, columns as ColumnsType<T> | undefined, activeSort),
    [dataSource, columns, activeSort],
  );
  const adaptedColumns = useMemo(
    () =>
      adaptTableSorterTips(columns as ColumnsType<T> | undefined, activeSort, (column) => {
        setUncontrolledSort((current) => ({
          column,
          order: current.column === column ? nextSortOrder(current.order) : "ascend",
        }));
      }),
    [columns, activeSort],
  );

  return (
    <div
      className={shellClassName}
      style={
        {
          ...tableTokenVars,
        } as CSSProperties
      }
    >
      {showInfoBar ? (
        <TableInfoBar
          total={count}
          foundTotal={foundTotal}
          selectedCount={selectedCount}
          actions={infoActions}
          linkActions={infoLinkActions}
          extra={infoExtra}
        >
          {infoContent}
        </TableInfoBar>
      ) : null}
      <Table<T>
        className={tableClassName}
        columns={adaptedColumns}
        dataSource={sortedDataSource}
        locale={{
          ...locale,
          emptyText: locale?.emptyText ?? (
            <TableEmptyState type={emptyState} description={emptyDescription} action={emptyAction} />
          ),
        }}
        pagination={pagination}
        rowSelection={adaptTableRowSelection(rowSelection)}
        onChange={(paginationConfig, filters, sorter, extra) => {
          onChange?.(paginationConfig, filters, sorter, extra);
        }}
        {...rest}
      />
      {footerBar ? <div className="sens-table-footer">{footerBar}</div> : null}
    </div>
  );
}

export interface LinkButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  /** weak 用于可下钻主属性；link 用于操作列。两者 hover 均进入链接蓝。 */
  tone?: "weak" | "link";
}

function buildTableLinkTokenVars(tone: NonNullable<LinkButtonProps["tone"]>): CSSProperties {
  return {
    "--sens-table-link-color": getColorToken(tone === "link" ? "link-color" : "text-color"),
    "--sens-table-link-hover-color": getColorToken(tone === "link" ? "link-hover-color" : "link-color"),
    "--sens-table-link-active-color": getColorToken("link-active-color"),
    "--sens-table-link-disabled-color": getColorToken("text-color-disable"),
    "--sens-table-link-height": px(getTypographyToken("line-height/m")),
  } as CSSProperties;
}

/** 链接按钮：弱链接用于可下钻主属性；常规链接用于操作列。 */
export function LinkButton({ children, onClick, disabled = false, tone = "weak" }: LinkButtonProps) {
  return (
    <button
      type="button"
      className="sens-table-link-button"
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      style={
        {
          ...buildTableLinkTokenVars(tone),
        } as CSSProperties
      }
    >
      {children}
    </button>
  );
}

export type TableCellAsyncState = "content" | "loading" | "failed";

export interface TableCellAsyncProps {
  /** `content` 由调用方提供内容；`loading` / `failed` 为单元格自身状态。 */
  state: TableCellAsyncState;
  /** 成功加载后的单元格内容。 */
  children?: ReactNode;
  /** 失败状态的刷新回调；由调用方负责发起请求并更新 `state`。 */
  onRefresh?: () => void;
  /** 失败文案，默认「加载失败」。 */
  failedText?: ReactNode;
  /** 刷新入口文案，默认「刷新」。 */
  refreshLabel?: ReactNode;
}

/**
 * 表格单元格异步状态：内容、加载、失败刷新。
 * 不接管请求：宿主通过 `state` 和 `onRefresh` 自行管理「失败 → 刷新 → 加载 → 内容」闭环。
 */
export function TableCellAsync({
  state,
  children,
  onRefresh,
  failedText = "加载失败",
  refreshLabel = "刷新",
}: TableCellAsyncProps) {
  if (state === "loading") {
    return (
      <span
        className="sens-table-cell-async sens-table-cell-async--loading"
        role="status"
        aria-label="加载中"
        aria-live="polite"
      >
        <SensIcon name="loading" sizeToken="size/icon/m" className="sens-table-cell-async__loading-icon" aria-hidden />
      </span>
    );
  }

  if (state === "failed") {
    return (
      <span className="sens-table-cell-async sens-table-cell-async--failed" role="alert">
        <SensIcon name="error" variant="filled" sizeToken="size/icon/m" aria-hidden />
        <span>{failedText}</span>
        {onRefresh ? (
          <LinkButton tone="link" onClick={onRefresh}>
            {refreshLabel}
          </LinkButton>
        ) : null}
      </span>
    );
  }

  return <>{children}</>;
}

export interface TableEllipsisProps {
  children: ReactNode;
}

/** 从单元格内容抽出纯文案，给常规便签用；不能把 LinkButton 整颗塞进深底浮层。 */
function tableEllipsisTipTitle(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(tableEllipsisTipTitle).join("");
  if (isValidElement<{ children?: ReactNode }>(node) && node.props.children != null) {
    return tableEllipsisTipTitle(node.props.children);
  }
  return "";
}

/** 表格长文本：省略显示，hover 时使用 SensTips 展示完整内容。 */
export function TableEllipsis({ children }: TableEllipsisProps) {
  return (
    <SensTips title={tableEllipsisTipTitle(children)} placement="top">
      <span className="sens-table-ellipsis">{children}</span>
    </SensTips>
  );
}

export interface TableActionsProps {
  items: TableActionItem[];
}

/** 操作列：≤3 个平铺；>3 个时第 3 个起收进「更多」 */
export function TableActions({ items }: TableActionsProps) {
  const visibleItems = items.length > 3 ? items.slice(0, 2) : items;
  const overflowItems = items.length > 3 ? items.slice(2) : [];
  const menuItems: SensDropdownMenuItemConfig[] = overflowItems.map((item) => ({
    key: item.key,
    label: item.label,
    variant: "link",
    disabled: item.disabled,
    onClick: item.onClick,
  }));

  return (
    <div className="sens-table-actions">
      {visibleItems.map((item) => (
        <LinkButton key={item.key} tone="link" onClick={item.onClick} disabled={item.disabled}>
          {item.label}
        </LinkButton>
      ))}
      {overflowItems.length ? (
        <SensDropdownButton items={menuItems}>
          更多
        </SensDropdownButton>
      ) : null}
    </div>
  );
}
