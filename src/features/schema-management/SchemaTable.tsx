import { useMemo } from "react";
import type { TableColumnsType } from "antd";
import { TableActions, TableShell } from "../../ui";

export interface SchemaTableRecord {
  key: string;
  name: string;
  tasks: number;
  dataSource: string;
  connection: string;
  creator: string;
  createdAt: string;
}

/** Figma「Schema 管理」占位数据 */
export const SCHEMA_TABLE_MOCK: SchemaTableRecord[] = [
  { key: "1", name: "Schema 名称 1", tasks: 1, dataSource: "HDFS", connection: "连接名称", creator: "普拉提", createdAt: "2025-02-20 00:00:00" },
  { key: "2", name: "Schema 名称 02", tasks: 4, dataSource: "HDFS", connection: "连接名称", creator: "普拉提", createdAt: "2025-02-20 00:00:00" },
  { key: "3", name: "Schema 名称 03", tasks: 5, dataSource: "HDFS", connection: "连接名称", creator: "普拉提", createdAt: "2025-02-20 00:00:00" },
  { key: "4", name: "Schema 名称 04", tasks: 6, dataSource: "HDFS", connection: "连接名称", creator: "普拉提", createdAt: "2025-02-20 00:00:00" },
  { key: "5", name: "Schema 名称 05", tasks: 1, dataSource: "HDFS", connection: "连接名称", creator: "普拉提", createdAt: "2025-02-20 00:00:00" },
  {
    key: "6",
    name: "超长名称超长名称超长名称超长名称超长名称超长名称超长名称超长名称超长名称超长名称超长名称超长名称超长名称超长名称",
    tasks: 2,
    dataSource: "HDFS",
    connection: "超级长连接名称超级长连接名称超级长连接名称超级长连接名称超级长连接名称超级长连接名称",
    creator: "普拉提",
    createdAt: "2025-02-20 00:00:00",
  },
  { key: "7", name: "Schema 名称 06", tasks: 1, dataSource: "HDFS", connection: "连接名称", creator: "普拉提", createdAt: "2025-02-20 00:00:00" },
  { key: "8", name: "Schema 名称 07", tasks: 1, dataSource: "HDFS", connection: "连接名称", creator: "普拉提", createdAt: "2025-02-20 00:00:00" },
  { key: "9", name: "Schema 名称 08", tasks: 2, dataSource: "HDFS", connection: "连接名称", creator: "普拉提", createdAt: "2025-02-20 00:00:00" },
  { key: "10", name: "Schema 名称 09", tasks: 1, dataSource: "HDFS", connection: "连接名称", creator: "普拉提", createdAt: "2025-02-20 00:00:00" },
];

const SCHEMA_TOTAL = 1000;

const ACTION_ITEMS = [
  { key: "view", label: "查看" },
  { key: "edit", label: "编辑" },
  { key: "delete", label: "删除" },
];

export function useSchemaTableColumns(): TableColumnsType<SchemaTableRecord> {
  return useMemo(
    () => [
      {
        title: "Schema 名称",
        dataIndex: "name",
        key: "name",
        width: 320,
        ellipsis: { rows: 2, showTitle: true },
      },
      {
        title: "关联任务",
        dataIndex: "tasks",
        key: "tasks",
        width: 148,
        align: "right",
      },
      {
        title: "数据源",
        dataIndex: "dataSource",
        key: "dataSource",
        width: 148,
      },
      {
        title: "数据连接",
        dataIndex: "connection",
        key: "connection",
        width: 280,
        ellipsis: { rows: 2, showTitle: true },
      },
      {
        title: "创建人",
        dataIndex: "creator",
        key: "creator",
        width: 148,
        sorter: (a, b) => a.creator.localeCompare(b.creator, "zh-CN"),
      },
      {
        title: "创建时间",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 194,
        sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
      },
      {
        title: "操作",
        key: "action",
        width: 168,
        fixed: "right",
        render: () => <TableActions items={ACTION_ITEMS} />,
      },
    ],
    []
  );
}

export default function SchemaTable() {
  const columns = useSchemaTableColumns();

  return (
    <TableShell<SchemaTableRecord>
      total={SCHEMA_TOTAL}
      columns={columns}
      dataSource={SCHEMA_TABLE_MOCK}
      rowKey="key"
      scroll={{ x: 1300 }}
    />
  );
}
