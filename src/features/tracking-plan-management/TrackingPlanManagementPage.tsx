import { useMemo, useState } from "react";
import { Button, Input, Select, Space, Typography } from "antd";
import { EditorAddIcon, useSensAllowClear, useSensSearchFieldProps, useSensSelectSuffixProps } from "../../ui";
import TrackingPlanTable, {
  TRACKING_PLAN_MOCK,
  TRACKING_PLAN_PAGINATION,
  TRACKING_PLAN_TOTAL,
  type TrackingPlanRecord,
} from "./TrackingPlanTable";

const { Title } = Typography;

const PLATFORM_OPTIONS = [
  { label: "Android", value: "android" },
  { label: "iOS", value: "ios" },
  { label: "Web", value: "web" },
  { label: "小程序", value: "miniapp" },
];

const STATUS_OPTIONS = [
  { label: "正常运行", value: "running" },
  { label: "停止运行", value: "stopped" },
  { label: "运行失败", value: "failed" },
];

export default function TrackingPlanManagementPage() {
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState<string | undefined>();
  const [status, setStatus] = useState<string | undefined>();
  const allowClear = useSensAllowClear();
  const selectSuffixProps = useSensSelectSuffixProps();
  const searchFieldProps = useSensSearchFieldProps({ width: 240 });

  const filteredData = useMemo(() => {
    return TRACKING_PLAN_MOCK.filter((row) => {
      const matchSearch =
        !search ||
        row.eventName.toLowerCase().includes(search.toLowerCase()) ||
        row.displayName.includes(search);
      const matchPlatform = !platform || row.platforms.toLowerCase().includes(platform);
      const matchStatus = !status || row.status === status;
      return matchSearch && matchPlatform && matchStatus;
    });
  }, [search, platform, status]);

  const total = search || platform || status ? filteredData.length : TRACKING_PLAN_TOTAL;

  return (
    <div>
      {/* 标题区 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <Title level={5} style={{ margin: 0, fontWeight: 500 }}>
          埋点方案管理
        </Title>
        <Button type="primary" icon={<EditorAddIcon />}>
          创建埋点方案
        </Button>
      </div>

      {/* 筛选区 */}
      <div style={{ marginBottom: 12 }}>
        <Space wrap size={12}>
          <Input
            allowClear={allowClear}
            placeholder="请输入事件名/显示名"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            {...searchFieldProps}
          />
          <Select
            {...selectSuffixProps}
            allowClear={allowClear}
            placeholder="请选择应埋点平台"
            options={PLATFORM_OPTIONS}
            value={platform}
            onChange={setPlatform}
            style={{ width: 180 }}
          />
          <Select
            {...selectSuffixProps}
            allowClear={allowClear}
            placeholder="请选择运行状态"
            options={STATUS_OPTIONS}
            value={status}
            onChange={setStatus}
            style={{ width: 160 }}
          />
        </Space>
      </div>

      {/* 表格（含信息区 + 分页） */}
      <TrackingPlanTable
        dataSource={filteredData as TrackingPlanRecord[]}
        total={total}
        pagination={{
          ...TRACKING_PLAN_PAGINATION,
          total,
        }}
      />
    </div>
  );
}
