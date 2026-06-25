import { useMemo, useState } from "react";
import type { TableColumnsType } from "antd";
import { Segmented, Space, Switch, Typography } from "antd";
import tableDesignDoc from "../../design-system/components/composite/table.design.md?raw";
import tableDevDoc from "../../design-system/components/composite/table.md?raw";
import { LinkButton, StatusBadge, TableActions, TableShell, type RunStatus } from "../../ui";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";

const { Text } = Typography;

type TableDemoVariant = "schema" | "tracking";

interface SchemaRecord {
  key: string;
  name: string;
  tasks: number;
  dataSource: string;
  connection: string;
  creator: string;
  createdAt: string;
}

interface TrackingRecord {
  key: string;
  eventName: string;
  sampleRate: number;
  status: RunStatus;
  creator: string;
  createdAt: string;
  remark: string;
}

const SCHEMA_ROWS: SchemaRecord[] = [
  { key: "1", name: "Schema 名称 1", tasks: 1, dataSource: "HDFS", connection: "连接名称", creator: "普拉提", createdAt: "2025-02-20 00:00:00" },
  { key: "2", name: "Schema 名称 02", tasks: 4, dataSource: "HDFS", connection: "连接名称", creator: "普拉提", createdAt: "2025-02-20 00:00:00" },
  {
    key: "3",
    name: "超长名称超长名称超长名称超长名称超长名称超长名称",
    tasks: 2,
    dataSource: "HDFS",
    connection: "超级长连接名称超级长连接名称超级长连接名称",
    creator: "普拉提",
    createdAt: "2025-02-20 00:00:00",
  },
];

const TRACKING_ROWS: TrackingRecord[] = [
  { key: "1", eventName: "sendTrade", sampleRate: 30, status: "running", creator: "钱佳仪", createdAt: "2022-05-23 17:02:07", remark: "备注信息很长很长的信息" },
  { key: "2", eventName: "sendTradeSubmit", sampleRate: 30, status: "stopped", creator: "李勇", createdAt: "2022-05-21 18:49:32", remark: "备注信息很长很长的信息很长很长" },
  { key: "3", eventName: "sendTradeSearch", sampleRate: 15, status: "failed", creator: "赵鹃", createdAt: "2022-05-19 18:40:10", remark: "备注信息最多展示两行，超出省略。" },
];

function useSchemaColumns(withSort: boolean): TableColumnsType<SchemaRecord> {
  return useMemo(
    () => [
      { title: "Schema 名称", dataIndex: "name", key: "name", width: 280, ellipsis: { rows: 2, showTitle: true } },
      { title: "关联任务", dataIndex: "tasks", key: "tasks", width: 120, align: "right" },
      { title: "数据源", dataIndex: "dataSource", key: "dataSource", width: 140 },
      { title: "数据连接", dataIndex: "connection", key: "connection", width: 240, ellipsis: { rows: 2, showTitle: true } },
      {
        title: "创建人",
        dataIndex: "creator",
        key: "creator",
        width: 140,
        sorter: withSort ? (a, b) => a.creator.localeCompare(b.creator, "zh-CN") : undefined,
      },
      {
        title: "创建时间",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 190,
        sorter: withSort ? (a, b) => a.createdAt.localeCompare(b.createdAt) : undefined,
      },
      {
        title: "操作",
        key: "action",
        width: 170,
        fixed: "right",
        render: () => <TableActions items={[{ key: "view", label: "查看" }, { key: "edit", label: "编辑" }, { key: "delete", label: "删除" }]} />,
      },
    ],
    [withSort],
  );
}

function useTrackingColumns(withSort: boolean): TableColumnsType<TrackingRecord> {
  return useMemo(
    () => [
      {
        title: "事件名",
        dataIndex: "eventName",
        key: "eventName",
        width: 240,
        ellipsis: true,
        sorter: withSort ? (a, b) => a.eventName.localeCompare(b.eventName) : undefined,
        render: (name: string) => <LinkButton>{name}</LinkButton>,
      },
      {
        title: "采样率(%)",
        dataIndex: "sampleRate",
        key: "sampleRate",
        width: 130,
        align: "right",
        sorter: withSort ? (a, b) => a.sampleRate - b.sampleRate : undefined,
        render: (rate: number) => `${rate}%`,
      },
      { title: "运行状态", dataIndex: "status", key: "status", width: 160, render: (status: RunStatus) => <StatusBadge status={status} /> },
      { title: "创建人", dataIndex: "creator", key: "creator", width: 120 },
      { title: "创建时间", dataIndex: "createdAt", key: "createdAt", width: 190 },
      { title: "备注", dataIndex: "remark", key: "remark", width: 220, ellipsis: { rows: 2, showTitle: true } },
      {
        title: "操作",
        key: "action",
        width: 170,
        fixed: "right",
        render: () => <TableActions items={[{ key: "view", label: "查看" }, { key: "edit", label: "编辑" }, { key: "delete", label: "删除" }]} />,
      },
    ],
    [withSort],
  );
}

function TableDemo() {
  const [variant, setVariant] = useState<TableDemoVariant>("schema");
  const [withSort, setWithSort] = useState(true);
  const [withPagination, setWithPagination] = useState(false);

  const schemaColumns = useSchemaColumns(withSort);
  const trackingColumns = useTrackingColumns(withSort);

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Space wrap align="end" size="middle">
        <Space direction="vertical" size={4}>
          <Text type="secondary">类型</Text>
          <Segmented
            value={variant}
            onChange={(v) => setVariant(v as TableDemoVariant)}
            options={[
              { label: "Schema 管理表", value: "schema" },
              { label: "埋点方案表", value: "tracking" },
            ]}
          />
        </Space>
        <Space direction="vertical" size={4}>
          <Text type="secondary">开关</Text>
          <Space>
            <Switch checked={withSort} onChange={setWithSort} />
            <Text>排序</Text>
            <Switch checked={withPagination} onChange={setWithPagination} />
            <Text>分页</Text>
          </Space>
        </Space>
      </Space>

      {variant === "schema" ? (
        <TableShell<SchemaRecord>
          total={1000}
          rowKey="key"
          columns={schemaColumns}
          dataSource={SCHEMA_ROWS}
          scroll={{ x: 1280 }}
          pagination={
            withPagination
              ? { total: 1000, pageSize: 10, showSizeChanger: true, showQuickJumper: true, showTotal: (_, range) => `本页显示，第 ${range[0]}-${range[1]} 条` }
              : false
          }
        />
      ) : (
        <TableShell<TrackingRecord>
          total={25}
          rowKey="key"
          columns={trackingColumns}
          dataSource={TRACKING_ROWS}
          scroll={{ x: 1320 }}
          pagination={
            withPagination
              ? { total: 25, pageSize: 10, showSizeChanger: true, showQuickJumper: true, showTotal: (_, range) => `本页显示，第 ${range[0]}-${range[1]} 条` }
              : false
          }
        />
      )}
      <Text type="secondary">可切换两种真实表格形态；横向滚动可看到右侧固定操作列</Text>
    </Space>
  );
}

function TableAuditBoard() {
  const schemaColumns = useSchemaColumns(true);
  const trackingColumns = useTrackingColumns(true);

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Text strong>Schema 管理（全量对照）</Text>
        <div style={{ marginTop: 8 }}>
          <TableShell<SchemaRecord>
            total={1000}
            rowKey="key"
            columns={schemaColumns}
            dataSource={SCHEMA_ROWS}
            scroll={{ x: 1280 }}
          />
        </div>
      </div>
      <div>
        <Text strong>埋点方案管理（全量对照）</Text>
        <div style={{ marginTop: 8 }}>
          <TableShell<TrackingRecord>
            total={25}
            rowKey="key"
            columns={trackingColumns}
            dataSource={TRACKING_ROWS}
            scroll={{ x: 1320 }}
          />
        </div>
      </div>
    </Space>
  );
}

export default function TableShowcasePage() {
  return (
    <ComponentShowcaseLayout
      title="表格 Table"
      demo={<TableDemo />}
      matrix={<TableAuditBoard />}
      designDocSource={tableDesignDoc}
      devDocSource={tableDevDoc}
    />
  );
}
