import { useMemo } from "react";
import { TableShell, type TableShellProps } from "../../ui";
import { ConnectionStatusBadge } from "./ConnectionStatusBadge";
import { ConnectionTableActions } from "./ConnectionTableActions";
import type { ConnectionActionSpec, ConnectionColumnSpec, ConnectionRecord, DataSourceSpec } from "./dataSourceTypes";

type ConnectionTableColumns = NonNullable<TableShellProps<ConnectionRecord>["columns"]>;

function buildSorter(column: ConnectionColumnSpec) {
  if (!column.sortable || !column.dataIndex) return undefined;
  const dataIndex = column.dataIndex;

  return (a: ConnectionRecord, b: ConnectionRecord) => {
    const left = a[dataIndex];
    const right = b[dataIndex];
    if (typeof left === "number" && typeof right === "number") return left - right;
    return String(left).localeCompare(String(right), "zh-CN");
  };
}

export function useConnectionColumns(
  spec: DataSourceSpec,
  onAction?: (action: ConnectionActionSpec, record: ConnectionRecord) => void,
): ConnectionTableColumns {
  return useMemo(
    () =>
      spec.connectionList.columns.map((column) => {
        const baseColumn = {
          title: column.title,
          dataIndex: column.dataIndex,
          key: column.key,
          width: column.width,
          align: column.align,
          ellipsis: column.ellipsis,
          sorter: buildSorter(column),
        };

        if (column.type === "status") {
          return {
            ...baseColumn,
            render: (status: ConnectionRecord["status"]) => (
              <ConnectionStatusBadge status={status} statuses={spec.connectionList.statuses} />
            ),
          };
        }

        if (column.type === "actions") {
          return {
            ...baseColumn,
            fixed: "right" as const,
            render: (_value: unknown, record: ConnectionRecord) => (
              <ConnectionTableActions
                status={record.status}
                actions={spec.connectionList.actions}
                onAction={(action) => onAction?.(action, record)}
              />
            ),
          };
        }

        return baseColumn;
      }),
    [onAction, spec]
  );
}

export interface ConnectionTableProps {
  spec: DataSourceSpec;
  dataSource: ConnectionRecord[];
  onAction?: (action: ConnectionActionSpec, record: ConnectionRecord) => void;
}

export default function ConnectionTable({ spec, dataSource, onAction }: ConnectionTableProps) {
  const columns = useConnectionColumns(spec, onAction);
  const total = dataSource.length;

  return (
    <TableShell<ConnectionRecord>
      total={total}
      columns={columns}
      dataSource={dataSource}
      rowKey="key"
      pagination={false}
      scroll={{ x: 1100 }}
    />
  );
}
