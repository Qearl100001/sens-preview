import { useMemo, useState } from "react";
import type { TableColumnsType } from "antd";
import { Segmented, Space, Typography } from "antd";
import tableDesignDoc from "../../design-system/components/base/table.design.md?raw";
import tableDevDoc from "../../design-system/components/base/table.md?raw";
import { LinkButton, SensButton, StatusBadge, TableActions, TableShell, type RunStatus } from "../../ui";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";

const { Text } = Typography;

type TableDemoState = "normal" | "filtered" | "selected" | "empty" | "loading";

interface DataRecord {
  key: string;
  name: string;
  owner: string;
  dataSource: string;
  connection: string;
  status: RunStatus;
  count: number;
  createdAt: string;
  remark: string;
}

const TABLE_ROWS: DataRecord[] = [
  {
    key: "1",
    name: "Schema 名称 1",
    owner: "普拉提",
    dataSource: "HDFS",
    connection: "连接名称",
    status: "running",
    count: 12,
    createdAt: "2025-02-20 00:00:00",
    remark: "常规数据行",
  },
  {
    key: "2",
    name: "Schema 名称 02",
    owner: "钱佳仪",
    dataSource: "MySQL",
    connection: "生产库连接",
    status: "stopped",
    count: 4,
    createdAt: "2025-02-20 00:00:00",
    remark: "备注信息很长很长的信息很长很长",
  },
  {
    key: "3",
    name: "超长名称超长名称超长名称超长名称超长名称超长名称",
    owner: "李勇",
    dataSource: "HDFS",
    connection: "超级长连接名称超级长连接名称超级长连接名称",
    status: "failed",
    count: 2,
    createdAt: "2025-02-20 00:00:00",
    remark: "超长文本最多展示两行，超出后省略。",
  },
];

function useTableColumns(): TableColumnsType<DataRecord> {
  return useMemo(
    () => [
      {
        title: "Schema 名称",
        dataIndex: "name",
        key: "name",
        width: 280,
        fixed: "left",
        ellipsis: true,
        sorter: (a, b) => a.name.localeCompare(b.name, "zh-CN"),
        render: (name: string) => <LinkButton>{name}</LinkButton>,
      },
      { title: "负责人", dataIndex: "owner", key: "owner", width: 120 },
      { title: "数据源", dataIndex: "dataSource", key: "dataSource", width: 140 },
      { title: "数据连接", dataIndex: "connection", key: "connection", width: 240, ellipsis: true },
      { title: "运行状态", dataIndex: "status", key: "status", width: 150, render: (status: RunStatus) => <StatusBadge status={status} /> },
      {
        title: "关联任务",
        dataIndex: "count",
        key: "count",
        width: 120,
        align: "right",
        sorter: (a, b) => a.count - b.count,
      },
      {
        title: "创建时间",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 190,
      },
      { title: "备注", dataIndex: "remark", key: "remark", width: 220, ellipsis: true },
      {
        title: "操作",
        key: "action",
        width: 170,
        fixed: "right",
        render: () => (
          <TableActions
            items={[
              { key: "view", label: "查看" },
              { key: "edit", label: "编辑" },
              { key: "delete", label: "删除" },
              { key: "export", label: "导出" },
            ]}
          />
        ),
      },
    ],
    [],
  );
}

function TableDemo() {
  const [state, setState] = useState<TableDemoState>("normal");
  const columns = useTableColumns();
  const isSelected = state === "selected";
  const isEmpty = state === "empty";
  const isLoading = state === "loading";

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Space wrap align="end" size="middle">
        <Space direction="vertical" size={4}>
          <Text type="secondary">基础表格状态</Text>
          <Segmented
            value={state}
            onChange={(v) => setState(v as TableDemoState)}
            options={[
              { label: "常规", value: "normal" },
              { label: "筛选计数", value: "filtered" },
              { label: "批量操作", value: "selected" },
              { label: "空状态", value: "empty" },
              { label: "加载", value: "loading" },
            ]}
          />
        </Space>
      </Space>

      <TableShell<DataRecord>
        total={isEmpty ? 0 : 1000}
        foundTotal={state === "filtered" || isSelected ? 1000 : undefined}
        selectedCount={isSelected ? 9 : 0}
        infoActions={
          isSelected
            ? [
                { key: "hide", label: "隐藏" },
                { key: "show", label: "显示" },
                { key: "delete", label: "删除" },
                { key: "cancel", label: "取消选择", tone: "tertiary" },
              ]
            : undefined
        }
        infoExtra={<SensButton tone="tertiary" size="small">设置</SensButton>}
        rowKey="key"
        rowSelection={
          isSelected
            ? {
                selectedRowKeys: TABLE_ROWS.map((row) => row.key),
              }
            : undefined
        }
        columns={columns}
        dataSource={isEmpty ? [] : TABLE_ROWS}
        loading={isLoading}
        emptyState={state === "filtered" ? "noResult" : "noData"}
        emptyAction={isEmpty ? <LinkButton>刷新</LinkButton> : undefined}
        scroll={{ x: 1280 }}
        pagination={false}
      />

      <Text type="secondary">分页器已作为独立基础组件收录；筛选表格后续会组合 TableShell + 筛选区 + Pagination。</Text>
    </Space>
  );
}

function TableAuditBoard() {
  const columns = useTableColumns();

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Text strong>常规表格：信息区 + 横向滚动 + 右侧操作冻结</Text>
        <div style={{ marginTop: 8 }}>
          <TableShell<DataRecord>
            total={1000}
            rowKey="key"
            columns={columns}
            dataSource={TABLE_ROWS}
            scroll={{ x: 1280 }}
          />
        </div>
      </div>
      <div>
        <Text strong>批量操作信息区：已找到 + 当页选中 + 批量动作</Text>
        <div style={{ marginTop: 8 }}>
          <TableShell<DataRecord>
            total={1000}
            foundTotal={1000}
            selectedCount={9}
            infoActions={[
              { key: "hide", label: "隐藏" },
              { key: "show", label: "显示" },
              { key: "delete", label: "删除" },
              { key: "cancel", label: "取消选择", tone: "tertiary" },
            ]}
            infoExtra={<SensButton tone="tertiary" size="small">设置</SensButton>}
            rowKey="key"
            rowSelection={{ selectedRowKeys: TABLE_ROWS.map((row) => row.key) }}
            columns={columns}
            dataSource={TABLE_ROWS}
            scroll={{ x: 1280 }}
          />
        </div>
      </div>
      <div>
        <Text strong>空状态与加载：使用 SensD 非页面级空态插图</Text>
        <div style={{ marginTop: 8 }}>
          <TableShell<DataRecord>
            total={0}
            rowKey="key"
            columns={columns}
            dataSource={[]}
            emptyState="noResult"
            scroll={{ x: 1280 }}
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
