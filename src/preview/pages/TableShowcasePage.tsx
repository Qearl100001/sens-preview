import { useMemo, useState } from "react";
import type { TableColumnsType } from "antd";
import { Segmented, Space, Switch } from "antd";
import tableDesignDoc from "../../design-system/components/base/table.design.md?raw";
import tableDevDoc from "../../design-system/components/base/table.md?raw";
import { getColorToken } from "../../design-system/color-utils";
import { getDividerColor } from "../../design-system/divider";
import { SensIcon } from "../../design-system/icons";
import { getTypographyToken } from "../../design-system/typography";
import { getUnitToken } from "../../design-system/unit";
import {
  LinkButton,
  SensCheckbox,
  SensPagination,
  SensTag,
  StatusBadge,
  TableActions,
  TableEllipsis,
  TableInfoColumnSettingButton,
  TableShell,
  type RunStatus,
} from "../../ui";
import { TableCellAsync, type TableCellAsyncState } from "../../ui/TableShell";
import { SensTips } from "../../ui/SensTips";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";

type TableDemoState =
  | "normal"
  | "filtered"
  | "noData"
  | "noResult"
  | "loadFailed"
  | "loading";

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

interface DataTableRecord {
  key: string;
  kind: "summary" | "detail";
  date: string;
  channel: string;
  channelId?: string;
  impressions: string;
  clicks: string;
  retention: string;
}

interface ColumnWidthStrategyRecord {
  key: string;
  status: string;
  name: string;
  createdAt: string;
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

const DATA_TABLE_ROWS: DataTableRecord[] = [
  {
    key: "summary",
    kind: "summary",
    date: "合计",
    channel: "-",
    impressions: "9,999,999,999",
    clicks: "9,999,999,999",
    retention: "2 人 / 0.09%",
  },
  {
    key: "2022-05-29-1",
    kind: "detail",
    date: "2022-05-29",
    channel: "快手用户 123430909…",
    channelId: "ID: kuaishou_tr…",
    impressions: "999,999",
    clicks: "3,400.09",
    retention: "0 人 / 0.00%",
  },
  {
    key: "2022-05-29-2",
    kind: "detail",
    date: "2022-05-29",
    channel: "快手用户 kuaishou123",
    channelId: "ID: 109099909…",
    impressions: "999,999",
    clicks: "30.09",
    retention: "2 人 / 0.30%",
  },
  {
    key: "2022-05-29-3",
    kind: "detail",
    date: "2022-05-29",
    channel: "账号名称最多展示两行…",
    channelId: "ID: 109099909…",
    impressions: "999,999",
    clicks: "1.90",
    retention: "1 人 / 0.01%",
  },
];

const COLUMN_WIDTH_STRATEGY_ROWS: ColumnWidthStrategyRecord[] = [
  { key: "1", status: "已启用", name: "新用户首日推荐策略", createdAt: "2025-02-20 10:30:00" },
  { key: "2", status: "已停用", name: "高价值用户召回策略（名称列会承接表格剩余宽度）", createdAt: "2025-02-19 18:20:00" },
  { key: "3", status: "已启用", name: "沉默用户唤醒策略", createdAt: "2025-02-18 09:00:00" },
];

const previewSubtextStyle = {
  color: getColorToken("text-sub-color"),
  fontSize: `${getTypographyToken("font-size/s")}px`,
  lineHeight: `${getTypographyToken("line-height/s")}px`,
};

const previewTitleStyle = {
  color: getColorToken("text-color"),
  fontSize: `${getTypographyToken("font-size/m")}px`,
  fontWeight: getTypographyToken("font-weight/semibold"),
  lineHeight: `${getTypographyToken("line-height/m")}px`,
};

const previewSectionGap = getUnitToken("spacing/4x");
const previewControlGap = getUnitToken("spacing/2x");
const previewItemGap = getUnitToken("spacing/1x");
const cellAuditBorder = getDividerColor("light", "transparent");

function useTableColumns(): TableColumnsType<DataRecord> {
  return useMemo(
    () => [
      {
        title: "Schema 名称",
        dataIndex: "name",
        key: "name",
        width: 280,
        fixed: "left",
        sorter: (a, b) => a.name.localeCompare(b.name, "zh-CN"),
        sortDirections: ["ascend", "descend", null],
        showSorterTooltip: { title: "点击排序" },
        render: (name: string) => (
          <TableEllipsis>
            <LinkButton tone="weak">{name}</LinkButton>
          </TableEllipsis>
        ),
      },
      { title: "负责人", dataIndex: "owner", key: "owner", width: 120 },
      { title: "数据源", dataIndex: "dataSource", key: "dataSource", width: 140 },
      {
        title: "数据连接",
        dataIndex: "connection",
        key: "connection",
        width: 240,
        render: (connection: string) => <TableEllipsis>{connection}</TableEllipsis>,
      },
      { title: "运行状态", dataIndex: "status", key: "status", width: 150, render: (status: RunStatus) => <StatusBadge status={status} /> },
      {
        title: "关联任务",
        dataIndex: "count",
        key: "count",
        width: 120,
        align: "right",
        sorter: (a, b) => a.count - b.count,
        sortDirections: ["ascend", "descend", null],
        showSorterTooltip: { title: "点击排序" },
      },
      {
        title: "创建时间",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 190,
      },
      {
        title: "备注",
        dataIndex: "remark",
        key: "remark",
        width: 220,
        render: (remark: string) => <TableEllipsis>{remark}</TableEllipsis>,
      },
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
  const isNoData = state === "noData";
  const isNoResult = state === "noResult";
  const isLoadFailed = state === "loadFailed";
  const isLoading = state === "loading";
  const isEmpty = isNoData || isNoResult || isLoadFailed;
  return (
    <Space direction="vertical" size={previewSectionGap} style={{ width: "100%" }}>
      <Space wrap align="end" size={previewControlGap}>
        <Space direction="vertical" size={previewItemGap}>
          <span style={previewSubtextStyle}>基础表格状态</span>
          <Segmented
            value={state}
            onChange={(v) => setState(v as TableDemoState)}
            options={[
              { label: "常规", value: "normal" },
              { label: "筛选计数", value: "filtered" },
              { label: "无数据", value: "noData" },
              { label: "筛选无结果", value: "noResult" },
              { label: "加载失败", value: "loadFailed" },
              { label: "加载", value: "loading" },
            ]}
          />
        </Space>
      </Space>

      <TableShell<DataRecord>
        total={isEmpty ? 0 : 1000}
        foundTotal={state === "filtered" ? 1000 : undefined}
        infoExtra={<TableInfoColumnSettingButton />}
        rowKey="key"
        columns={columns}
        dataSource={isEmpty ? [] : TABLE_ROWS}
        loading={isLoading}
        emptyState={isLoadFailed ? "loadFailed" : isNoResult ? "noResult" : "noData"}
        scroll={{ x: 1280 }}
        pagination={false}
      />

      <span style={previewSubtextStyle}>
        信息区展示常规总数、筛选计数与空态；列设置仅齿轮 icon-only。数据更新、批量操作与大数据下载归属复合表格。
      </span>
    </Space>
  );
}

function TableAuditBoard() {
  const columns = useTableColumns();

  return (
    <Space direction="vertical" size={previewSectionGap} style={{ width: "100%" }}>
      <div>
        <span style={previewTitleStyle}>常规表格：信息区 + 横向滚动 + 右侧操作冻结</span>
        <div style={{ marginTop: getUnitToken("spacing/2x") }}>
          <TableShell<DataRecord>
            total={1000}
            infoExtra={<TableInfoColumnSettingButton />}
            rowKey="key"
            columns={columns}
            dataSource={TABLE_ROWS}
            scroll={{ x: 1280 }}
          />
        </div>
      </div>
      <div>
        <span style={previewTitleStyle}>空状态与加载：使用 SensD 非页面级空态插图</span>
        <div style={{ marginTop: getUnitToken("spacing/2x") }}>
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
      <TableCellCarrierAuditBoard />
      <TableCellAsyncAuditBoard />
      <TableHeaderCompositionAuditBoard />
      <TableColumnWidthStrategyBoard />
      <DataTableAuditBoard />
    </Space>
  );
}

function TableCellAsyncAuditBoard() {
  const [state, setState] = useState<TableCellAsyncState>("failed");
  const columns = useMemo<TableColumnsType<{ key: string; name: string }>>(
    () => [
      { title: "任务名称", dataIndex: "name", key: "name", width: 240 },
      {
        title: "数据状态",
        key: "async",
        render: () => (
          <TableCellAsync
            state={state}
            onRefresh={() => {
              setState("loading");
              window.setTimeout(() => setState("content"), 720);
            }}
          >
            已加载数据
          </TableCellAsync>
        ),
      },
    ],
    [state],
  );

  return (
    <div>
      <span style={previewTitleStyle}>单元格加载与失败刷新</span>
      <p style={{ ...previewSubtextStyle, marginTop: `${getUnitToken("spacing/1x")}px` }}>
        单元格状态由业务控制：失败时可刷新，刷新后先展示加载，再回到内容；不替换整张表的状态。
      </p>
      <div style={{ marginTop: `${getUnitToken("spacing/2x")}px` }}>
        <Segmented
          value={state}
          onChange={(value) => setState(value as TableCellAsyncState)}
          options={[
            { label: "内容", value: "content" },
            { label: "加载", value: "loading" },
            { label: "加载失败", value: "failed" },
          ]}
        />
      </div>
      <div style={{ marginTop: `${getUnitToken("spacing/2x")}px` }}>
        <TableShell
          showInfoBar={false}
          pagination={false}
          rowKey="key"
          columns={columns}
          dataSource={[{ key: "cell-async", name: "推荐策略数据" }]}
        />
      </div>
    </div>
  );
}

function TableColumnWidthStrategyBoard() {
  const columns = useMemo<TableColumnsType<ColumnWidthStrategyRecord>>(
    () => [
      { title: "状态", dataIndex: "status", key: "status", width: 96 },
      {
        title: "名称",
        dataIndex: "name",
        key: "name",
        render: (name: string) => <TableEllipsis>{name}</TableEllipsis>,
      },
      { title: "创建时间", dataIndex: "createdAt", key: "createdAt", width: 168 },
      {
        title: "操作",
        key: "action",
        width: 96,
        render: () => <LinkButton tone="weak">查看</LinkButton>,
      },
    ],
    [],
  );

  return (
    <div>
      <span style={previewTitleStyle}>列宽策略：定宽与自适应</span>
      <p style={{ ...previewSubtextStyle, marginTop: `${getUnitToken("spacing/1x")}px` }}>
        状态、创建时间与操作列按设计标注使用定宽；名称列不设固定宽度，承接表格容器的剩余空间。同一张表格允许混用两种列宽策略。
      </p>
      <div style={{ marginTop: `${getUnitToken("spacing/2x")}px` }}>
        <TableShell<ColumnWidthStrategyRecord>
          showInfoBar={false}
          pagination={false}
          rowKey="key"
          columns={columns}
          dataSource={COLUMN_WIDTH_STRATEGY_ROWS}
        />
      </div>
    </div>
  );
}

function DataTableAuditBoard() {
  const [page, setPage] = useState(1);
  const columns = useMemo<TableColumnsType<DataTableRecord>>(
    () => [
      {
        title: "时间",
        dataIndex: "date",
        key: "date",
        width: 132,
        sorter: (a, b) => a.date.localeCompare(b.date, "zh-CN"),
      },
      {
        title: "渠道",
        dataIndex: "channel",
        key: "channel",
        width: 200,
        render: (channel: string, record) => (
          <div className="sens-table-data-grid-channel">
            {record.kind === "detail" ? <LinkButton tone="weak">{channel}</LinkButton> : <span>{channel}</span>}
            {record.channelId ? <span className="sens-table-data-grid-channel-id">{record.channelId}</span> : null}
          </div>
        ),
      },
      {
        title: "展示数",
        dataIndex: "impressions",
        key: "impressions",
        width: 160,
        align: "right",
        sorter: (a, b) => Number(a.impressions.split(",").join("")) - Number(b.impressions.split(",").join("")),
      },
      {
        title: "点击数",
        dataIndex: "clicks",
        key: "clicks",
        width: 148,
        align: "right",
        sorter: (a, b) => Number(a.clicks.split(",").join("")) - Number(b.clicks.split(",").join("")),
      },
      {
        title: "D2 留存 (111)",
        dataIndex: "retention",
        key: "retention",
        width: 184,
        align: "right",
        sorter: (a, b) => a.retention.localeCompare(b.retention, "zh-CN"),
        render: (retention: string, record) =>
          record.kind === "detail" && retention.startsWith("0") ? <LinkButton tone="weak">{retention}</LinkButton> : retention,
      },
    ],
    [],
  );

  return (
    <div>
      <span style={previewTitleStyle}>数据表格：文本列与数值列对齐</span>
      <p style={{ ...previewSubtextStyle, marginTop: `${getUnitToken("spacing/1x")}px` }}>
        文本列左对齐；数值列以标题文字右缘为对齐锚点。标题后的排序图标不改变数值列的对齐位置；三行数据使用 Padding 单元格，从顶部开始排布。
      </p>
      <div style={{ marginTop: `${getUnitToken("spacing/2x")}px` }}>
        <TableShell<DataTableRecord>
          className="sens-table-data-grid"
          showInfoBar={false}
          rowKey="key"
          rowClassName={(record) => (record.kind === "summary" ? "sens-table-data-grid-summary" : "")}
          columns={columns}
          dataSource={DATA_TABLE_ROWS}
          scroll={{ x: 824 }}
          footerBar={
            <>
              <span className="sens-table-footer-left">本页显示第 1-20 条</span>
              <div className="sens-table-footer-right">
                <SensPagination current={page} pageSize={20} total={80} onChange={setPage} />
              </div>
            </>
          }
        />
      </div>
    </div>
  );
}

function TableHeaderCompositionAuditBoard() {
  const headerCellStyle = {
    boxSizing: "border-box" as const,
    minHeight: `${getUnitToken("size/component-height/xxxl")}px`,
    padding: `0 ${getUnitToken("spacing/horizontal/4x")}px`,
    display: "flex",
    alignItems: "center",
    background: getColorToken("background-04"),
    borderBottom: `1px solid ${cellAuditBorder}`,
  };
  const headerTitleStyle = {
    color: getColorToken("text-color"),
    fontSize: `${getTypographyToken("font-size/m")}px`,
    fontWeight: getTypographyToken("font-weight/medium"),
    lineHeight: `${getTypographyToken("line-height/m")}px`,
  };
  const headerUnitStyle = {
    color: getColorToken("text-sub-color"),
    fontSize: `${getTypographyToken("font-size/s")}px`,
    lineHeight: `${getTypographyToken("line-height/s")}px`,
  };
  const headerGroupStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: `${getUnitToken("spacing/1x")}px`,
    minWidth: 0,
  };
  const helpIcon = (label: string) => (
    <SensTips title={label} placement="top">
      <span
        aria-label={label}
        tabIndex={0}
        style={{ display: "inline-flex", color: getColorToken("icon-color-transparent"), lineHeight: 0 }}
      >
        <SensIcon name="help" sizeToken="size/icon/m" color="currentColor" />
      </span>
    </SensTips>
  );
  const sorter = (
    active?: "ascend" | "descend",
    interaction: "default" | "hover" | "press" = "default",
  ) => {
    const defaultColor = getColorToken("icon-color-transparent");
    const hoverColor = getColorToken("component-primary");
    const activeColor = getColorToken("component-active");
    const upperColor = active === "ascend"
      ? activeColor
      : interaction === "hover"
        ? hoverColor
        : interaction === "press"
          ? activeColor
          : defaultColor;
    const lowerColor = active === "descend" ? activeColor : defaultColor;

    return (
      <span
        aria-label="排序"
        style={{
          width: "16px",
          height: "16px",
          boxSizing: "border-box",
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 0,
        }}
      >
        <span style={{ height: "8px", padding: "0 4px", display: "inline-flex", alignItems: "center", color: upperColor }}>
          <SensIcon name="up-mini" variant="filled" size={8} color="currentColor" />
        </span>
        <span style={{ height: "8px", padding: "0 4px", display: "inline-flex", alignItems: "center", color: lowerColor }}>
          <SensIcon name="down-mini" variant="filled" size={8} color="currentColor" />
        </span>
      </span>
    );
  };

  return (
    <div>
      <span style={previewTitleStyle}>表头内容组合</span>
      <p style={{ ...previewSubtextStyle, marginTop: `${getUnitToken("spacing/1x")}px` }}>
        标题、单位、帮助与排序按固定顺序组合；文本列左对齐，数字、日期与金额列整体右对齐。
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: `${getUnitToken("spacing/4x")}px`,
          marginTop: `${getUnitToken("spacing/2x")}px`,
          border: `1px solid ${cellAuditBorder}`,
          borderRadius: `${getUnitToken("radius/l")}px`,
          overflow: "hidden",
          background: getColorToken("white"),
        }}
      >
        <div style={headerCellStyle}>
          <span style={headerGroupStyle}>
            <span style={headerTitleStyle}>任务耗时</span>
            {helpIcon("任务耗时说明")}
            {sorter()}
          </span>
        </div>
        <div style={{ ...headerCellStyle, justifyContent: "flex-end" }}>
          <span style={headerGroupStyle}>
            <span style={headerTitleStyle}>05-09</span>
            {helpIcon("日期说明")}
            {sorter()}
          </span>
        </div>
        <div style={{ ...headerCellStyle, justifyContent: "flex-end" }}>
          <span style={headerGroupStyle}>
            <span style={headerTitleStyle}>任务耗时</span>
            <span style={headerUnitStyle}>(单位)</span>
            {helpIcon("任务耗时与单位说明")}
            {sorter()}
          </span>
        </div>
        <div style={headerCellStyle}>
          <span style={headerGroupStyle}>
            <span style={headerTitleStyle}>支付订单的总次数</span>
            <SensTag variant="multicolor" color="yellow" size="small">重要指标</SensTag>
            {helpIcon("重要指标说明")}
          </span>
        </div>
      </div>
      <div style={{ marginTop: `${getUnitToken("spacing/4x")}px` }}>
        <span style={previewTitleStyle}>排序交互</span>
        <p style={{ ...previewSubtextStyle, marginTop: `${getUnitToken("spacing/1x")}px` }}>
          默认图标使用中性色；悬停与按下仅改变图标颜色、不增加表头背景。升序 / 降序生效后，当前列表头与表体同步使用中性色悬停背景。
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: `${getUnitToken("spacing/4x")}px`,
            marginTop: `${getUnitToken("spacing/2x")}px`,
          }}
        >
          {([
            ["默认", undefined, "default"],
            ["上箭头悬停", undefined, "hover"],
            ["上箭头按下", undefined, "press"],
            ["升序选中", "ascend", "default"],
            ["降序选中", "descend", "default"],
          ] as const).map(([label, active, interaction]) => (
            <div key={label} style={{ border: `1px solid ${cellAuditBorder}`, borderRadius: `${getUnitToken("radius/l")}px`, overflow: "hidden" }}>
              <div style={{ ...headerCellStyle, background: active ? getColorToken("background-grey-hover") : getColorToken("background-04") }}>
                <span style={headerGroupStyle}>
                  <span style={headerTitleStyle}>任务耗时</span>
                  {sorter(active, interaction)}
                </span>
              </div>
              <div
                style={{
                  minHeight: `${getUnitToken("size/component-height/xxxl")}px`,
                  padding: `0 ${getUnitToken("spacing/horizontal/4x")}px`,
                  display: "flex",
                  alignItems: "center",
                  color: getColorToken("text-color"),
                  background: active ? getColorToken("background-grey-hover") : getColorToken("white"),
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TableCellCarrierAuditBoard() {
  const cardStyle = {
    border: `1px solid ${cellAuditBorder}`,
    borderRadius: `${getUnitToken("radius/l")}px`,
    overflow: "hidden" as const,
    background: getColorToken("white"),
  };
  const fixedCellStyle = {
    boxSizing: "border-box" as const,
    height: `${getUnitToken("size/component-height/xxxl")}px`,
    padding: "5px 16px",
    borderBottom: `1px solid ${cellAuditBorder}`,
    display: "flex",
    flexDirection: "column" as const,
    gap: "2px",
    justifyContent: "center",
  };
  const paddingCellStyle = {
    boxSizing: "border-box" as const,
    padding: "12px 16px",
    borderBottom: `1px solid ${cellAuditBorder}`,
  };
  const fixedPrimaryTextStyle = {
    color: getColorToken("text-color"),
    fontSize: `${getTypographyToken("font-size/m")}px`,
    lineHeight: `${getTypographyToken("line-height/m")}px`,
  };
  const fixedAuxiliaryStackStyle = {
    display: "flex",
    flexDirection: "column" as const,
    gap: "2px",
  };

  return (
    <div>
      <span style={previewTitleStyle}>单元格承载方式：定高与 Padding</span>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: `${getUnitToken("spacing/4x")}px`,
          marginTop: `${getUnitToken("spacing/2x")}px`,
        }}
      >
        <div>
          <p style={previewSubtextStyle}>定高表格 · 表头 / 表体固定 56px，左右 16px、上下 5px</p>
          <div style={{ ...cardStyle, marginTop: `${getUnitToken("spacing/2x")}px` }}>
            <div
              style={{
                height: `${getUnitToken("size/component-height/xxxl")}px`,
                padding: `0 ${getUnitToken("spacing/horizontal/4x")}px`,
                display: "flex",
                alignItems: "center",
                background: getColorToken("background-grey"),
                color: getColorToken("text-color"),
                fontSize: `${getTypographyToken("font-size/m")}px`,
                fontWeight: getTypographyToken("font-weight/semibold"),
              }}
            >
              表头固定高度
            </div>
            <div style={fixedCellStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: `${getUnitToken("spacing/2x")}px` }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: getColorToken("success-color"), flex: "0 0 auto" }} />
                <span style={fixedPrimaryTextStyle}>已开启</span>
                <LinkButton tone="link">设置</LinkButton>
              </div>
              <span style={previewSubtextStyle}>到期时间小于 30 天开始提醒全部成员</span>
            </div>
            <div style={fixedCellStyle}>
              <div style={fixedAuxiliaryStackStyle}>
                <span style={fixedPrimaryTextStyle}>28,500</span>
                <span style={previewSubtextStyle}>相对于对照组上升 5.3%</span>
              </div>
            </div>
            <div style={fixedCellStyle}>
              <div style={fixedAuxiliaryStackStyle}>
                <span style={fixedPrimaryTextStyle}>1011178787@163.com</span>
                <span style={{ display: "flex", alignItems: "center", gap: `${getUnitToken("spacing/1x")}px`, ...previewSubtextStyle }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: getColorToken("success-color"), flex: "0 0 auto" }} />
                  已启用
                </span>
              </div>
            </div>
            <div style={fixedCellStyle}>
              <div style={fixedAuxiliaryStackStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: `${getUnitToken("spacing/1x")}px` }}>
                  <SensTag variant="multicolor" color="neutral" size="small">实时</SensTag>
                  <span style={fixedPrimaryTextStyle}>活动分城市触达</span>
                </div>
                <span style={previewSubtextStyle}>12-22 00:04 至 12-24 06:08</span>
              </div>
            </div>
            <div style={fixedCellStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: `${getUnitToken("spacing/2x")}px` }}>
                <Switch size="small" checked aria-label="已开启" />
                <span style={previewSubtextStyle}>已开启</span>
              </div>
            </div>
            <div style={fixedCellStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: `${getUnitToken("spacing/2x")}px` }}>
                <span style={{ color: getColorToken("text-color"), fontSize: `${getTypographyToken("font-size/m")}px`, lineHeight: `${getTypographyToken("line-height/m")}px` }}>15,903</span>
                <span style={previewSubtextStyle}>(100.00%)</span>
                <span style={{ width: "108px", height: "4px", borderRadius: "2px", background: getColorToken("background-grey"), overflow: "hidden" }}>
                  <span style={{ display: "block", width: "72%", height: "100%", borderRadius: "inherit", background: getColorToken("component-primary") }} />
                </span>
              </div>
            </div>
            <div style={fixedCellStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: `${getUnitToken("spacing/2x")}px` }}>
                <SensCheckbox checked readOnly aria-label="选择树节点" style={{ alignItems: "center" }} />
                <span style={fixedPrimaryTextStyle}>树节点 / 录入项</span>
              </div>
            </div>
            <div style={{ display: "flex", height: `${getUnitToken("size/component-height/xxxl")}px`, borderBottom: 0 }}>
              <div
                style={{
                  boxSizing: "border-box",
                  width: "32px",
                  flex: "0 0 32px",
                  paddingLeft: "16px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <SensCheckbox checked readOnly aria-label="选择当前行" style={{ alignItems: "center" }} />
              </div>
              <div
                style={{
                  flex: 1,
                  padding: "5px 16px",
                  display: "flex",
                  alignItems: "center",
                  color: getColorToken("text-sub-color"),
                  fontSize: `${getTypographyToken("font-size/s")}px`,
                  lineHeight: `${getTypographyToken("line-height/s")}px`,
                }}
              >
                批量操作：独立选择列（32px）
              </div>
            </div>
          </div>
        </div>
        <div>
          <p style={previewSubtextStyle}>Padding 表格 · 左右 16px、上下 12px，内容可撑高</p>
          <div style={{ ...cardStyle, marginTop: `${getUnitToken("spacing/2x")}px` }}>
            <div style={{ ...paddingCellStyle, minHeight: "90px" }}>
              <div style={{ color: getColorToken("text-color"), fontSize: `${getTypographyToken("font-size/m")}px`, lineHeight: `${getTypographyToken("line-height/m")}px` }}>
                这是一段可换行的长文本；内容超过两行时，单元格随内容向下扩展，不截断为固定高度。
              </div>
            </div>
            <div style={{ ...paddingCellStyle, minHeight: "90px", display: "flex", alignItems: "flex-start", gap: `${getUnitToken("spacing/4x")}px` }}>
              <div style={{ width: "66px", height: "66px", borderRadius: `${getUnitToken("radius/s")}px`, background: getColorToken("background-grey"), flex: "0 0 auto" }} />
              <div>
                <div style={{ color: getColorToken("text-color"), fontSize: `${getTypographyToken("font-size/m")}px`, lineHeight: `${getTypographyToken("line-height/m")}px` }}>活动名称</div>
                <div style={previewSubtextStyle}>ID：000000000000000000</div>
              </div>
            </div>
            <div style={{ ...paddingCellStyle, minHeight: "78px", borderBottom: 0 }}>
              <span style={{ display: "inline-flex", padding: "1px 6px", borderRadius: `${getUnitToken("radius/s")}px`, background: getColorToken("background-grey"), ...previewSubtextStyle, color: getColorToken("text-color") }}>正向显著</span>
              <div style={{ height: "4px", maxWidth: "108px", marginTop: `${getUnitToken("spacing/1x")}px`, borderRadius: "2px", background: getColorToken("component-primary") }} />
              <div style={{ ...previewSubtextStyle, marginTop: `${getUnitToken("spacing/1x")}px` }}>[+6.3%, +9.7%]</div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
