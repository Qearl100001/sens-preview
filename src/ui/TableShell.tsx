import type { ReactNode } from "react";
import type { TableProps } from "antd";
import { Space, Table, theme, Typography } from "antd";
import "./table.css";

export interface TableShellProps<T extends object> extends TableProps<T> {
  /** 信息区计数，默认「共 N 条」 */
  total?: number;
  /** 嵌套在卡片内时去掉外壳描边，避免双层边框 */
  borderless?: boolean;
}

/**
 * 复合表格外壳：信息区 + 表体（见 composite/table.md）
 * 颜色全部走 ConfigProvider / theme token，不在此硬编码。
 */
export function TableShell<T extends object>({
  total,
  borderless = false,
  columns,
  dataSource,
  pagination = false,
  ...rest
}: TableShellProps<T>) {
  const { token } = theme.useToken();
  const count = total ?? dataSource?.length ?? 0;

  return (
    <div
      style={{
        border: borderless ? undefined : `1px solid ${token.colorBorder}`,
        borderRadius: borderless ? undefined : token.borderRadiusLG ?? token.borderRadius,
        overflow: "hidden",
        background: token.colorBgContainer,
      }}
    >
      <div
        style={{
          height: 40,
          boxSizing: "border-box",
          padding: "11px 16px",
          display: "flex",
          alignItems: "center",
          fontSize: token.fontSizeSM,
          lineHeight: "18px",
          color: token.colorTextSecondary,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          boxShadow: `inset 0 -1px 0 0 ${token.colorBorderSecondary}`,
        }}
      >
        共 {count.toLocaleString()} 条
      </div>
      <Table<T>
        className="sens-table"
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        {...rest}
      />
    </div>
  );
}

export interface LinkButtonProps {
  children: ReactNode;
  onClick?: () => void;
}

/** 操作列链接按钮（Typography.Link，走 colorLink） */
export function LinkButton({ children, onClick }: LinkButtonProps) {
  return (
    <Typography.Link onClick={onClick} style={{ fontSize: 14, lineHeight: "22px" }}>
      {children}
    </Typography.Link>
  );
}

export interface TableActionsProps {
  items: Array<{ key: string; label: string; onClick?: () => void }>;
}

/** 操作列：≤3 个平铺链接按钮 */
export function TableActions({ items }: TableActionsProps) {
  return (
    <Space size={16}>
      {items.map((item) => (
        <LinkButton key={item.key} onClick={item.onClick}>
          {item.label}
        </LinkButton>
      ))}
    </Space>
  );
}
