import { useState } from "react";
import { Segmented, Space, Switch, Typography } from "antd";
import paginationDesignDoc from "../../design-system/components/base/pagination.design.md?raw";
import paginationDevDoc from "../../design-system/components/base/pagination.md?raw";
import { tokenRgba } from "../../design-system/color-utils";
import { SensPagination } from "../../ui";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";

const { Text } = Typography;
const AUDIT_HELP_TEXT_STYLE = { color: tokenRgba("text-sub-color-transparent", 0.58) };

type PaginationTotalPreset = "empty" | "short" | "long";

const TOTAL_PRESETS: Record<PaginationTotalPreset, { label: string; total: number }> = {
  empty: { label: "0 条", total: 0 },
  short: { label: "25 条", total: 25 },
  long: { label: "1,000 条", total: 1000 },
};

function PaginationDemo() {
  const [totalPreset, setTotalPreset] = useState<PaginationTotalPreset>("long");
  const [page, setPage] = useState(3);
  const [pageSize, setPageSize] = useState(20);
  const [simple, setSimple] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const total = TOTAL_PRESETS[totalPreset].total;
  const maxPage = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, maxPage);

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Space wrap align="end" size="middle">
        <Space direction="vertical" size={4}>
          <Text type="secondary">总数</Text>
          <Segmented
            value={totalPreset}
            onChange={(value) => {
              setTotalPreset(value as PaginationTotalPreset);
              setPage(1);
            }}
            options={Object.entries(TOTAL_PRESETS).map(([value, preset]) => ({
              label: preset.label,
              value,
            }))}
          />
        </Space>
        <Space direction="vertical" size={4}>
          <Text type="secondary">模式</Text>
          <Space>
            <Switch checked={simple} onChange={setSimple} />
            <Text>简版</Text>
            <Switch checked={disabled} onChange={setDisabled} />
            <Text>禁用</Text>
          </Space>
        </Space>
      </Space>

      <SensPagination
        current={current}
        pageSize={pageSize}
        total={total}
        simple={simple}
        disabled={disabled}
        onChange={(nextPage, nextPageSize) => {
          setPage(nextPage);
          setPageSize(nextPageSize);
        }}
      />
      <Text type="secondary">分页器是基础组件；表格、筛选表格等按场景组合它。</Text>
    </Space>
  );
}

function PaginationAuditBoard() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Text strong>总页数 ≤ 10 / 无数量控制</Text>
        <div>
          <Text style={AUDIT_HELP_TEXT_STYLE}>单屏范围内显示全部页码，一般不提供快速跳转。</Text>
        </div>
        <div style={{ marginTop: 8 }}>
          <SensPagination defaultCurrent={1} defaultPageSize={20} total={200} showSizeChanger={false} showQuickJumper={false} />
        </div>
      </div>
      <div>
        <Text strong>总页数 ≤ 10 / 有数量控制</Text>
        <div>
          <Text style={AUDIT_HELP_TEXT_STYLE}>页码全部展示，允许调整每页条数；仍不需要快速跳转。</Text>
        </div>
        <div style={{ marginTop: 8 }}>
          <SensPagination defaultCurrent={1} defaultPageSize={20} total={200} showSizeChanger showQuickJumper={false} />
        </div>
      </div>
      <div>
        <Text strong>总页数 &gt; 10 / 无数量控制</Text>
        <div>
          <Text style={AUDIT_HELP_TEXT_STYLE}>超过 10 页时使用折叠页码，通常提供快速跳转。</Text>
        </div>
        <div style={{ marginTop: 8 }}>
          <SensPagination defaultCurrent={3} defaultPageSize={20} total={1000} showSizeChanger={false} showQuickJumper />
        </div>
      </div>
      <div>
        <Text strong>总页数 &gt; 10 / 有数量控制</Text>
        <div>
          <Text style={AUDIT_HELP_TEXT_STYLE}>折叠页码 + 每页条数选择器 + 快速跳转，是普通列表表格最常见组合。</Text>
        </div>
        <div style={{ marginTop: 8 }}>
          <SensPagination defaultCurrent={3} defaultPageSize={20} total={1000} showSizeChanger showQuickJumper />
        </div>
      </div>
    </Space>
  );
}

export default function PaginationShowcasePage() {
  return (
    <ComponentShowcaseLayout
      title="分页器 Pagination"
      demo={<PaginationDemo />}
      matrix={<PaginationAuditBoard />}
      designDocSource={paginationDesignDoc}
      devDocSource={paginationDevDoc}
    />
  );
}
