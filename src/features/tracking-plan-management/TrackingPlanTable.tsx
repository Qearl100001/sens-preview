import { useMemo } from "react";
import type { TableColumnsType, TablePaginationConfig } from "antd";
import { Typography } from "antd";
import { LinkButton, StatusBadge, TableActions, TableShell, type RunStatus } from "../../ui";

const { Text } = Typography;

export interface TrackingPlanRecord {
  key: string;
  eventName: string;
  displayName: string;
  platforms: string;
  sampleRate: number;
  status: RunStatus;
  creator: string;
  createdAt: string;
  remark: string;
}

/** Figma「埋点方案管理」占位数据 */
export const TRACKING_PLAN_MOCK: TrackingPlanRecord[] = [
  {
    key: "1",
    eventName: "sendTrade",
    displayName: "注册结果",
    platforms: "Android、iOS",
    sampleRate: 30,
    status: "running",
    creator: "钱佳仪",
    createdAt: "2022-05-23 17:02:07",
    remark: "备注信息很长很长的信息",
  },
  {
    key: "2",
    eventName: "sendTradesendTradesendTradesendTradesendTrade",
    displayName: "搜索结果",
    platforms: "Android、iOS",
    sampleRate: 30,
    status: "stopped",
    creator: "李勇",
    createdAt: "2022-05-21 18:49:32",
    remark: "备注信息很长很长的信息很长很长",
  },
  {
    key: "3",
    eventName: "sendTradesendTradesendTradesendTradesendTrade",
    displayName: "访问小程序",
    platforms: "Android、iOS",
    sampleRate: 30,
    status: "running",
    creator: "赵鹃",
    createdAt: "2022-05-19 18:40:10",
    remark: "备注信息很长很长的信息很长最多展示两行信息备注信息很长很长的信息",
  },
  {
    key: "4",
    eventName: "sendTrade",
    displayName: "访问小程序",
    platforms: "Android、iOS",
    sampleRate: 30,
    status: "running",
    creator: "王婧懿懿",
    createdAt: "2022-05-17 19:18:44",
    remark: "访问小程序",
  },
  {
    key: "5",
    eventName: "sendTrade",
    displayName: "访问小程序",
    platforms: "Android、iOS",
    sampleRate: 30,
    status: "stopped",
    creator: "周莱来",
    createdAt: "2022-05-17 17:51:08",
    remark: "访问小程序",
  },
  {
    key: "6",
    eventName: "sendTrade",
    displayName: "访问小程序",
    platforms: "Android、iOS",
    sampleRate: 30,
    status: "stopped",
    creator: "李琳",
    createdAt: "2022-05-17 17:51:08",
    remark: "访问小程序",
  },
  {
    key: "7",
    eventName: "sendTrade",
    displayName: "访问小程序",
    platforms: "Android、iOS",
    sampleRate: 30,
    status: "running",
    creator: "李金颖",
    createdAt: "2022-05-17 17:51:08",
    remark: "访问小程序",
  },
  {
    key: "8",
    eventName: "sendTrade",
    displayName: "访问小程序",
    platforms: "Android、iOS",
    sampleRate: 30,
    status: "running",
    creator: "冯云",
    createdAt: "2022-05-17 17:51:08",
    remark: "访问小程序",
  },
  {
    key: "9",
    eventName: "sendTrade",
    displayName: "访问小程序",
    platforms: "Android、iOS",
    sampleRate: 30,
    status: "failed",
    creator: "李广文",
    createdAt: "2022-05-17 17:51:08",
    remark: "访问小程序",
  },
  {
    key: "10",
    eventName: "sendTrade",
    displayName: "访问小程序",
    platforms: "Android、iOS",
    sampleRate: 30,
    status: "running",
    creator: "钱佳仪",
    createdAt: "2022-05-17 17:51:08",
    remark: "访问小程序",
  },
];

export const TRACKING_PLAN_TOTAL = 25;

const ACTION_ITEMS = [
  { key: "view", label: "查看" },
  { key: "edit", label: "编辑" },
  { key: "delete", label: "删除" },
];

function SampleRateTitle() {
  return (
    <span style={{ display: "inline-flex", alignItems: "flex-end", gap: 4 }}>
      <span>采样率</span>
      <Text type="secondary" style={{ fontSize: 12, lineHeight: "18px" }}>
        (%)
      </Text>
    </span>
  );
}

export function useTrackingPlanColumns(): TableColumnsType<TrackingPlanRecord> {
  return useMemo(
    () => [
      {
        title: "事件名",
        dataIndex: "eventName",
        key: "eventName",
        width: 238,
        ellipsis: true,
        sorter: (a, b) => a.eventName.localeCompare(b.eventName),
        render: (name: string) => <LinkButton>{name}</LinkButton>,
      },
      {
        title: "事件显示名",
        dataIndex: "displayName",
        key: "displayName",
        width: 200,
        sorter: (a, b) => a.displayName.localeCompare(b.displayName, "zh-CN"),
      },
      {
        title: "应埋点平台",
        dataIndex: "platforms",
        key: "platforms",
        width: 180,
      },
      {
        title: <SampleRateTitle />,
        dataIndex: "sampleRate",
        key: "sampleRate",
        width: 148,
        align: "right",
        sorter: (a, b) => a.sampleRate - b.sampleRate,
        render: (rate: number) => `${rate}%`,
      },
      {
        title: "运行状态",
        dataIndex: "status",
        key: "status",
        width: 148,
        render: (status: RunStatus) => <StatusBadge status={status} />,
      },
      {
        title: "创建人",
        dataIndex: "creator",
        key: "creator",
        width: 120,
        sorter: (a, b) => a.creator.localeCompare(b.creator, "zh-CN"),
      },
      {
        title: "创建时间",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 187,
        sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
      },
      {
        title: "备注",
        dataIndex: "remark",
        key: "remark",
        width: 200,
        ellipsis: { rows: 2, showTitle: true },
      },
      {
        title: "操作",
        key: "action",
        width: 184,
        fixed: "right",
        render: () => <TableActions items={ACTION_ITEMS} />,
      },
    ],
    []
  );
}

export const TRACKING_PLAN_PAGINATION: TablePaginationConfig = {
  total: TRACKING_PLAN_TOTAL,
  pageSize: 10,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "50"],
  showQuickJumper: true,
  showTotal: (_, range) => `本页显示，第 ${range[0]}-${range[1]} 条`,
};

export interface TrackingPlanTableProps {
  dataSource?: TrackingPlanRecord[];
  total?: number;
  pagination?: TablePaginationConfig | false;
}

export default function TrackingPlanTable({
  dataSource = TRACKING_PLAN_MOCK,
  total = TRACKING_PLAN_TOTAL,
  pagination = TRACKING_PLAN_PAGINATION,
}: TrackingPlanTableProps) {
  const columns = useTrackingPlanColumns();

  return (
    <TableShell<TrackingPlanRecord>
      total={total}
      columns={columns}
      dataSource={dataSource}
      rowKey="key"
      scroll={{ x: 1600 }}
      pagination={pagination}
    />
  );
}
