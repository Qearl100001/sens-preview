import type { CSSProperties, ReactNode } from "react";
import type { TableProps } from "antd";
import { Space, Table, theme, Typography } from "antd";
import { getDividerBorder, getDividerHairlineWidth } from "../design-system/divider";
import { getTypographyToken } from "../design-system/typography";
import { getUnitToken } from "../design-system/unit";
import { EMPTY_STATE_ILLUSTRATIONS, type NonPageEmptyIllustrationKey } from "./EmptyStateIllustrations";
import { SensButton, type SensButtonVariant } from "./SensButton";
import { SensButtonActionMenu } from "./SensButtonActionMenu";
import type { SensDropdownMenuItemConfig } from "./SensDropdownMenuItem";
import "./table.css";

export interface TableActionItem {
  key: string;
  label: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export type TableInfoActionTone = Extract<
  SensButtonVariant,
  "secondary" | "tertiary" | "dangerSecondary" | "dangerTertiary"
>;

export interface TableInfoActionItem extends TableActionItem {
  /** 批量操作区使用小按钮；默认 secondary，取消选择等弱操作可用 tertiary */
  tone?: TableInfoActionTone;
}

export interface TableInfoBarProps {
  /** 默认计数，展示为「共 N 条」 */
  total?: number;
  /** 筛选结果计数，传入后展示为「已找到 N 条」 */
  foundTotal?: number;
  /** 当前页选中数量，传入且大于 0 时追加「当页选中 N 条」 */
  selectedCount?: number;
  /** 信息区批量操作：小号二级 / 三级按钮 */
  actions?: TableInfoActionItem[];
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
  /** 信息区批量操作：小号二级 / 三级按钮 */
  infoActions?: TableInfoActionItem[];
  /** 信息区最右侧操作入口，例如列设置 icon */
  infoExtra?: ReactNode;
  /** 自定义信息区内容 */
  infoContent?: ReactNode;
  /** 是否展示信息区；高度来自 size/component-height/xl */
  showInfoBar?: boolean;
  /** 空状态插图类型 */
  emptyState?: NonPageEmptyIllustrationKey;
  /** 空状态文案 */
  emptyDescription?: ReactNode;
  /** 空状态操作 */
  emptyAction?: ReactNode;
  /** 嵌套在卡片内时去掉外壳描边，避免双层边框 */
  borderless?: boolean;
}

function formatTableCount(value: number) {
  return value.toLocaleString();
}

function px(value: number): string {
  return `${value}px`;
}

function buildTableTokenVars(token: ReturnType<typeof theme.useToken>["token"]): CSSProperties {
  const infoHeight = getUnitToken("size/component-height/xl");
  const infoLineHeight = getTypographyToken("line-height/s");
  const infoPaddingBlock = (infoHeight - infoLineHeight) / 2;
  const rowHeight = getUnitToken("size/component-height/xxxl");
  const emptyGap = getUnitToken("spacing/2x");

  return {
    "--sens-table-info-height": px(infoHeight),
    "--sens-table-info-padding-block": px(infoPaddingBlock),
    "--sens-table-info-padding-inline": px(getUnitToken("spacing/horizontal/4x")),
    "--sens-table-info-gap": px(getUnitToken("spacing/horizontal/4x")),
    "--sens-table-info-main-gap": px(getUnitToken("spacing/horizontal/6x")),
    "--sens-table-info-action-gap": px(getUnitToken("spacing/horizontal/2x")),
    "--sens-table-info-font-size": px(getTypographyToken("font-size/s")),
    "--sens-table-info-line-height": px(infoLineHeight),
    "--sens-table-info-color": token.colorTextSecondary,
    "--sens-table-info-border": token.colorBorderSecondary,
    "--sens-table-divider-width": px(getDividerHairlineWidth()),
    "--sens-table-row-height": px(rowHeight),
    "--sens-table-cell-padding-block": px(getUnitToken("spacing/1.5x")),
    "--sens-table-cell-padding-inline": px(getUnitToken("spacing/horizontal/4x")),
    "--sens-table-column-sorter-gap": px(getUnitToken("spacing/1x")),
    "--sens-table-link-font-size": px(getTypographyToken("font-size/m")),
    "--sens-table-link-line-height": px(getTypographyToken("line-height/m")),
    "--sens-table-empty-padding-block": px(getUnitToken("size/component-height/m")),
    "--sens-table-empty-padding-inline": px(getUnitToken("spacing/horizontal/4x")),
    "--sens-table-empty-gap": px(emptyGap),
    "--sens-table-empty-action-margin-top": px(getUnitToken("spacing/1x")),
    "--sens-table-empty-min-height": px(rowHeight * 3 + emptyGap),
    "--sens-table-empty-image-size": px(rowHeight * 2 + emptyGap),
  } as CSSProperties;
}

export function TableInfoBar({
  total = 0,
  foundTotal,
  selectedCount = 0,
  actions,
  extra,
  children,
}: TableInfoBarProps) {
  const { token } = theme.useToken();
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
          ...buildTableTokenVars(token),
        } as CSSProperties
      }
    >
      <div className="sens-table-info-main">
        <Typography.Text className="sens-table-info-text" type="secondary">
          {content}
        </Typography.Text>
        {actions?.length ? (
          <Space size={getUnitToken("spacing/horizontal/2x")} className="sens-table-info-actions">
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
          </Space>
        ) : null}
      </div>
      {extra ? <div className="sens-table-info-extra">{extra}</div> : null}
    </div>
  );
}

interface TableEmptyStateProps {
  type?: NonPageEmptyIllustrationKey;
  description?: ReactNode;
  action?: ReactNode;
}

const TABLE_EMPTY_DESCRIPTION: Record<NonPageEmptyIllustrationKey, string> = {
  noData: "暂无数据",
  noResult: "暂无搜索结果",
  loadFailed: "数据加载失败，请重试",
};

function TableEmptyState({ type = "noData", description, action }: TableEmptyStateProps) {
  return (
    <div className="sens-table-empty">
      <img src={EMPTY_STATE_ILLUSTRATIONS[type]} alt="" className="sens-table-empty-image" />
      <Typography.Text type="secondary">{description ?? TABLE_EMPTY_DESCRIPTION[type]}</Typography.Text>
      {action ? <div className="sens-table-empty-action">{action}</div> : null}
    </div>
  );
}

/**
 * 基础表格外壳：信息区 + 表体（见 components/base/table.md）
 * 颜色全部走 ConfigProvider / theme token，不在此硬编码。
 */
export function TableShell<T extends object>({
  total,
  foundTotal,
  selectedCount,
  infoActions,
  infoExtra,
  infoContent,
  showInfoBar = true,
  emptyState = "noData",
  emptyDescription,
  emptyAction,
  borderless = false,
  columns,
  dataSource,
  className,
  locale,
  pagination = false,
  ...rest
}: TableShellProps<T>) {
  const { token } = theme.useToken();
  const count = total ?? dataSource?.length ?? 0;
  const tableClassName = ["sens-table", className].filter(Boolean).join(" ");
  const tableTokenVars = buildTableTokenVars(token);

  return (
    <div
      className="sens-table-shell"
      style={
        {
          border: borderless ? undefined : getDividerBorder("outline", "solid"),
          borderRadius: borderless ? undefined : token.borderRadiusLG ?? token.borderRadius,
          overflow: "hidden",
          background: token.colorBgContainer,
          ...tableTokenVars,
          "--sens-table-row-selected-bg": token.colorBgContainer,
        } as CSSProperties
      }
    >
      {showInfoBar ? (
        <TableInfoBar
          total={count}
          foundTotal={foundTotal}
          selectedCount={selectedCount}
          actions={infoActions}
          extra={infoExtra}
        >
          {infoContent}
        </TableInfoBar>
      ) : null}
      <Table<T>
        className={tableClassName}
        columns={columns}
        dataSource={dataSource}
        locale={{
          ...locale,
          emptyText: locale?.emptyText ?? (
            <TableEmptyState type={emptyState} description={emptyDescription} action={emptyAction} />
          ),
        }}
        pagination={pagination}
        {...rest}
      />
    </div>
  );
}

export interface LinkButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

/** 操作列链接按钮：默认中性色，hover/active 进入链接蓝 */
export function LinkButton({ children, onClick, disabled = false }: LinkButtonProps) {
  const { token } = theme.useToken();

  return (
    <button
      type="button"
      className="sens-table-link-button"
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      style={
        {
          "--sens-table-link-color": token.colorText,
          "--sens-table-link-hover-color": token.colorLink,
          "--sens-table-link-active-color": token.colorLinkActive,
          "--sens-table-link-disabled-color": token.colorTextDisabled,
        } as CSSProperties
      }
    >
      {children}
    </button>
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
    disabled: item.disabled,
    onClick: item.onClick,
  }));

  return (
    <Space size={getUnitToken("spacing/horizontal/4x")}>
      {visibleItems.map((item) => (
        <LinkButton key={item.key} onClick={item.onClick} disabled={item.disabled}>
          {item.label}
        </LinkButton>
      ))}
      {overflowItems.length ? (
        <SensButtonActionMenu tone="linkWeak" size="small" showChevron items={menuItems}>
          更多
        </SensButtonActionMenu>
      ) : null}
    </Space>
  );
}
