import { Fragment, useEffect, useMemo, useRef, useState, type CSSProperties, type Key } from "react";
import type { ColumnsType } from "antd/es/table";
import { getColorToken, tokenRgba } from "../../design-system/color-utils";
import { SensIcon } from "../../design-system/icons";
import { getDividerColor, getDividerHairlineWidth } from "../../design-system/divider";
import { getTypographyToken } from "../../design-system/typography";
import { getUnitToken } from "../../design-system/unit";
import {
  SensAlert,
  SensButton,
  SensButtonActionMenu,
  SensInput,
  SensLineTabs,
  SensMoreButton,
  SensPagination,
  SensSelectDropdown,
  SensTableFilterBar,
  SearchHighlight,
  TableInfoColumnSettingButton,
  TableInfoRefreshableSummary,
  TableShell,
  defaultSelectOptionMatcher,
  type SensDropdownMenuItemConfig,
  type SensTableFilterField,
  type SensTableFilterSearchMode,
} from "../../ui";
import "./form-templates.css";

function px(value: number): string {
  return `${value}px`;
}

function buildCompositeTableVars(): CSSProperties {
  return {
    "--form-templates-page-bg": tokenRgba("background-transparent-grey", 0.04),
    "--form-templates-surface": getColorToken("white"),
    "--form-templates-text": tokenRgba("text-color-transparent", 0.9),
    "--form-templates-sub-text": tokenRgba("text-sub-color-transparent", 0.58),
    "--form-templates-divider": getDividerColor("light", "transparent"),
    "--form-templates-divider-width": px(getDividerHairlineWidth()),
    "--form-templates-outline": tokenRgba("outline-color-transparent", 0.12),
    "--form-templates-muted-surface": tokenRgba("background-transparent-grey", 0.04),
    "--form-templates-radius": px(getUnitToken("radius/l")),
    "--form-templates-page-padding": px(getUnitToken("spacing/vertical/7x")),
    "--form-templates-section-gap": px(getUnitToken("spacing/vertical/10x")),
    "--form-templates-block-gap": px(getUnitToken("spacing/vertical/7x")),
    "--form-templates-field-gap": px(getUnitToken("spacing/vertical/5x")),
    "--form-templates-content-gap": px(getUnitToken("spacing/vertical/4x")),
    "--form-templates-tight-gap": px(getUnitToken("spacing/vertical/2x")),
    "--form-templates-inline-gap": px(getUnitToken("spacing/horizontal/4x")),
    "--form-templates-title-size": px(getTypographyToken("font-size/xxl")),
    "--form-templates-title-line": px(getTypographyToken("line-height/xxl")),
    "--form-templates-title-weight": getTypographyToken("font-weight/semibold"),
    "--form-templates-heading-size": px(getTypographyToken("font-size/l")),
    "--form-templates-heading-line": px(getTypographyToken("line-height/l")),
    "--form-templates-body-size": px(getTypographyToken("font-size/m")),
    "--form-templates-body-line": px(getTypographyToken("line-height/m")),
    "--form-templates-help-size": px(getTypographyToken("font-size/s")),
    "--form-templates-help-line": px(getTypographyToken("line-height/s")),
    "--form-templates-control-max-width": px(getUnitToken("form/control/max-width")),
    "--editable-table-width": "1248px",
    "--editable-table-header-height": px(getUnitToken("size/component-height/l") + getUnitToken("spacing/vertical/3x")),
    "--editable-table-row-height": px(getUnitToken("size/component-height/m") + getUnitToken("spacing/vertical/6x")),
    "--editable-table-cell-padding-inline": px(getUnitToken("spacing/horizontal/2x")),
    "--editable-table-cell-padding-block": px(getUnitToken("spacing/vertical/3x")),
    "--editable-table-header-padding-inline": px(getUnitToken("spacing/horizontal/4x")),
    "--editable-table-control-height": px(getUnitToken("size/component-height/m")),
    "--editable-table-header-bg": getColorToken("background-grey"),
    "--editable-table-border": tokenRgba("outline-color-transparent", 0.12),
    "--editable-table-divider": getDividerColor("light", "transparent"),
    "--editable-table-muted-text": tokenRgba("text-sub-color-transparent", 0.58),
    "--editable-table-link": getColorToken("link-color"),
    /* 交叉表格：明细行高 = 上下 padding 12 + line-height/m 22 = 46（Figma 推导，非 unit token） */
    "--cross-table-header-height": px(getUnitToken("size/component-height/xxxl")),
    "--cross-table-header-span-height": px(getUnitToken("size/component-height/xxxl") * 2),
    "--cross-table-detail-row-height": px(
      getUnitToken("spacing/vertical/3x") * 2 + getTypographyToken("line-height/m"),
    ),
    "--cross-table-merged-row-height": px(
      (getUnitToken("spacing/vertical/3x") * 2 + getTypographyToken("line-height/m")) * 3,
    ),
    "--cross-table-header-padding-inline": px(getUnitToken("spacing/horizontal/4x")),
    "--cross-table-cell-padding-inline": px(getUnitToken("spacing/horizontal/3x")),
    "--cross-table-cell-padding-block": px(getUnitToken("spacing/vertical/3x")),
    "--cross-table-header-bg": getColorToken("background-grey"),
    "--cross-table-hover-bg": getColorToken("background-grey-hover"),
    /* 明细加重：Figma 26063:12256 rgba(0,21,64,0.06) */
    "--cross-table-hover-intensify-bg": tokenRgba("background-transparent-grey-hover", 0.06),
    "--cross-table-border": tokenRgba("outline-color-transparent", 0.12),
    "--cross-table-divider": getDividerColor("light", "transparent"),
    "--cross-table-header-weight": getTypographyToken("font-weight/medium"),
    "--cross-table-text-stack-gap": px(getUnitToken("spacing/0.5x")),
  } as CSSProperties;
}

const SELECT_OPTIONS = [
  { label: "选项 A", value: "a" },
  { label: "选项 B", value: "b" },
  { label: "对最多六个字示例", value: "long" },
];

function filterOptions(...labels: string[]): Array<{ label: string; value: string }> {
  return labels.map((label) => ({ label, value: label }));
}

const FILTER_TYPE_OPTIONS = filterOptions("定时", "实时", "手动", "一次性", "周期");
const FILTER_SPEED_OPTIONS = filterOptions("快", "中", "慢");
const FILTER_STATUS_OPTIONS = filterOptions("成功", "异常");
const FILTER_OWNER_OPTIONS = filterOptions("张三", "李四", "王五", "赵六");
const FILTER_CREATOR_OPTIONS = filterOptions("陈晨", "刘洋", "周敏");

const PRIMARY_FIELDS: SensTableFilterField[] = [
  { key: "type", label: "任务类型", options: FILTER_TYPE_OPTIONS, multiple: true },
  { key: "speed", label: "速度评估", options: FILTER_SPEED_OPTIONS, multiple: true },
];

const MORE_FIELDS: SensTableFilterField[] = [
  { key: "owner", label: "负责人", options: FILTER_OWNER_OPTIONS, multiple: true },
  { key: "status", label: "状态", options: FILTER_STATUS_OPTIONS, multiple: true },
  { key: "creator", label: "创建人", options: FILTER_CREATOR_OPTIONS, multiple: true },
];

/** 三行半展开 Demo 用；不接表体过滤 */
const OVERFLOW_EXTRA_FIELDS: SensTableFilterField[] = Array.from({ length: 15 }, (_, index) => ({
  key: `extra-${index + 1}`,
  label: `筛选项 ${index + 1}`,
  options: SELECT_OPTIONS,
  multiple: true,
}));

const FILTER_INITIAL: Record<string, string[]> = {
  type: [],
  speed: [],
  owner: [],
  status: [],
  creator: [],
};

const SEARCH_PRIMARY_FIELDS: SensTableFilterField[] = [
  { key: "module", label: "任务模块", options: SELECT_OPTIONS },
  { key: "type", label: "任务类型", options: SELECT_OPTIONS },
  { key: "speed", label: "速度评估", options: SELECT_OPTIONS },
];

/** 预览模拟请求耗时，非 spacing token */
const TABLE_SEARCH_LOAD_MS = 400;

type TemplateKey = "filter" | "search" | "info" | "layout" | "editable" | "cross";
type SearchSceneMode = SensTableFilterSearchMode;
type FilterLayoutChrome = "alert" | "tabs";
type FilterExpandMode = "regular" | "overflow";

/** 交叉表格样张：无筛选 / 分页 / 复选 / 操作按钮。明细用稳定 detailId，不依赖渲染下标。 */
type CrossTableDetail = {
  detailId: string;
  value: string;
};

type CrossTableGroup = {
  groupId: string;
  dimA: { primary: string; secondary: string };
  dimB: { primary: string; secondary: string };
  metrics: [string, string, string];
  details: CrossTableDetail[];
  note: string;
};

const CROSS_TABLE_GROUPS: CrossTableGroup[] = [
  {
    groupId: "g1",
    dimA: { primary: "这是一段文本这是一段文本这是一段文本这是一段文本", secondary: "辅助文案" },
    dimB: { primary: "华北区 · 零售", secondary: "渠道汇总" },
    metrics: ["完成", "进行中", "待启动"],
    details: [
      { detailId: "g1-actual", value: "1,000.00" },
      { detailId: "g1-target", value: "860.50" },
      { detailId: "g1-forecast", value: "420.00" },
    ],
    note: "分组备注",
  },
  {
    groupId: "g2",
    dimA: { primary: "这是一段文本这是一段文本这是一段文本这是一段文本", secondary: "辅助文案" },
    dimB: { primary: "华东区 · 电商", secondary: "渠道汇总" },
    metrics: ["完成", "完成", "异常"],
    details: [
      { detailId: "g2-actual", value: "2,140.00" },
      { detailId: "g2-target", value: "1,980.00" },
      { detailId: "g2-forecast", value: "315.20" },
    ],
    note: "分组备注",
  },
  {
    groupId: "g3",
    dimA: { primary: "这是一段文本这是一段文本这是一段文本这是一段文本", secondary: "辅助文案" },
    dimB: { primary: "华南区 · 门店", secondary: "渠道汇总" },
    metrics: ["进行中", "待启动", "完成"],
    details: [
      { detailId: "g3-actual", value: "640.00" },
      { detailId: "g3-target", value: "128.00" },
      { detailId: "g3-forecast", value: "3,050.00" },
    ],
    note: "分组备注",
  },
];

/**
 * 仅供自动化验证的异规模数据，不进入常规预览或设计规则。
 * 用 URL `?crossScenario=variable` 选择，验证排序 / 重排后悬停仍以稳定 ID 关联。
 */
const CROSS_TABLE_VARIABLE_GROUPS: CrossTableGroup[] = [
  {
    ...CROSS_TABLE_GROUPS[0],
    groupId: "g2-details",
    details: [
      { detailId: "g2-details-actual", value: "1,000.00" },
      { detailId: "g2-details-target", value: "860.50" },
    ],
  },
  {
    ...CROSS_TABLE_GROUPS[1],
    groupId: "g4-details",
    details: [
      { detailId: "g4-details-actual", value: "2,140.00" },
      { detailId: "g4-details-target", value: "1,980.00" },
      { detailId: "g4-details-forecast", value: "315.20" },
      { detailId: "g4-details-revised", value: "288.10" },
    ],
  },
];

function resolveCrossTableGroups(): CrossTableGroup[] {
  const params = new URLSearchParams(window.location.search);
  const source = params.get("crossScenario") === "variable" ? CROSS_TABLE_VARIABLE_GROUPS : CROSS_TABLE_GROUPS;

  /** 排序只重排 group，不重建 ID；排序后悬停视觉尚无 Figma 依据，故不定义额外视觉状态。 */
  if (params.get("crossOrder") === "value-desc") {
    return [...source].sort((left, right) => Number.parseFloat(right.details[0].value.replace(/,/g, "")) - Number.parseFloat(left.details[0].value.replace(/,/g, "")));
  }

  return source;
}

const FILTER_LAYOUT_TABS = [
  { key: "all", label: "全部" },
  { key: "success", label: "成功" },
  { key: "error", label: "异常" },
];

/** 页面组合 · 更多按钮悬停菜单（default 中性行，非表格链接溢出） */
const LAYOUT_MORE_MENU_ITEMS: SensDropdownMenuItemConfig[] = [
  { key: "view", label: "查看详情" },
  { key: "export", label: "导出" },
  { key: "duplicate", label: "复制" },
];

interface SearchTaskRow {
  key: string;
  name: string;
  module: string;
  type: string;
  status: string;
  id: string;
}

const SEARCH_SCOPE: Array<keyof SearchTaskRow> = ["name", "module", "type"];

const SEARCH_TASK_ROWS: SearchTaskRow[] = [
  { key: "1", name: "用户行为采集任务", module: "采集", type: "定时", status: "成功", id: "task-1001" },
  { key: "2", name: "实时计算任务", module: "计算", type: "实时", status: "异常", id: "task-1002" },
  { key: "3", name: "数据导出任务", module: "导出", type: "手动", status: "成功", id: "task-1003" },
  { key: "4", name: "埋点采集校验", module: "采集", type: "实时", status: "成功", id: "task-1004" },
  { key: "5", name: "标签计算任务", module: "计算", type: "定时", status: "成功", id: "task-1005" },
  { key: "6", name: "分群导出任务", module: "导出", type: "定时", status: "异常", id: "task-1006" },
  { key: "7", name: "采集失败重试", module: "采集", type: "手动", status: "成功", id: "task-1007" },
  { key: "8", name: "实时监控任务", module: "计算", type: "实时", status: "成功", id: "task-1008" },
  { key: "9", name: "报表导出任务", module: "导出", type: "实时", status: "成功", id: "task-1009" },
  { key: "10", name: "日志采集任务", module: "采集", type: "定时", status: "异常", id: "task-1010" },
];

interface FilterTaskRow {
  key: string;
  name: string;
  module: string;
  type: string;
  status: string;
  speed: string;
  owner: string;
  creator: string;
  createdAt: string;
  id: string;
}

const FILTER_TASK_ROWS: FilterTaskRow[] = [
  { key: "1", name: "用户行为采集任务", module: "采集", type: "定时", status: "成功", speed: "快", owner: "张三", creator: "陈晨", createdAt: "2026-08-01 09:12:00", id: "task-1001" },
  { key: "2", name: "实时计算任务", module: "计算", type: "实时", status: "异常", speed: "中", owner: "李四", creator: "刘洋", createdAt: "2026-08-02 10:20:00", id: "task-1002" },
  { key: "3", name: "数据导出任务", module: "导出", type: "手动", status: "成功", speed: "慢", owner: "王五", creator: "周敏", createdAt: "2026-08-03 11:30:00", id: "task-1003" },
  { key: "4", name: "埋点采集校验", module: "采集", type: "实时", status: "成功", speed: "快", owner: "赵六", creator: "陈晨", createdAt: "2026-08-04 14:00:00", id: "task-1004" },
  { key: "5", name: "标签计算任务", module: "计算", type: "定时", status: "成功", speed: "中", owner: "张三", creator: "刘洋", createdAt: "2026-08-05 08:15:00", id: "task-1005" },
  { key: "6", name: "分群导出任务", module: "导出", type: "定时", status: "异常", speed: "慢", owner: "李四", creator: "周敏", createdAt: "2026-08-06 16:40:00", id: "task-1006" },
  { key: "7", name: "采集失败重试", module: "采集", type: "手动", status: "成功", speed: "快", owner: "王五", creator: "陈晨", createdAt: "2026-08-07 09:05:00", id: "task-1007" },
  { key: "8", name: "实时监控任务", module: "计算", type: "实时", status: "成功", speed: "中", owner: "赵六", creator: "刘洋", createdAt: "2026-08-08 13:22:00", id: "task-1008" },
  { key: "9", name: "报表导出任务", module: "导出", type: "实时", status: "成功", speed: "快", owner: "张三", creator: "周敏", createdAt: "2026-08-09 18:10:00", id: "task-1009" },
  { key: "10", name: "日志采集任务", module: "采集", type: "定时", status: "异常", speed: "慢", owner: "李四", creator: "陈晨", createdAt: "2026-08-10 07:50:00", id: "task-1010" },
  { key: "11", name: "一次性补数任务", module: "计算", type: "一次性", status: "成功", speed: "快", owner: "王五", creator: "刘洋", createdAt: "2026-08-11 12:00:00", id: "task-1011" },
  { key: "12", name: "周期归档任务", module: "导出", type: "周期", status: "成功", speed: "中", owner: "赵六", creator: "周敏", createdAt: "2026-08-12 15:33:00", id: "task-1012" },
  { key: "13", name: "一次性全量同步", module: "采集", type: "一次性", status: "异常", speed: "慢", owner: "张三", creator: "陈晨", createdAt: "2026-08-13 10:08:00", id: "task-1013" },
  { key: "14", name: "周期画像更新", module: "计算", type: "周期", status: "成功", speed: "快", owner: "李四", creator: "刘洋", createdAt: "2026-08-14 19:45:00", id: "task-1014" },
  { key: "15", name: "手动回刷任务", module: "导出", type: "手动", status: "异常", speed: "中", owner: "王五", creator: "周敏", createdAt: "2026-08-15 08:28:00", id: "task-1015" },
  { key: "16", name: "实时告警推送", module: "计算", type: "实时", status: "成功", speed: "快", owner: "赵六", creator: "陈晨", createdAt: "2026-08-16 21:11:00", id: "task-1016" },
  { key: "17", name: "定时质量巡检", module: "采集", type: "定时", status: "成功", speed: "中", owner: "张三", creator: "刘洋", createdAt: "2026-08-17 06:40:00", id: "task-1017" },
  { key: "18", name: "周期报表汇总", module: "导出", type: "周期", status: "异常", speed: "慢", owner: "李四", creator: "周敏", createdAt: "2026-08-18 11:55:00", id: "task-1018" },
  { key: "19", name: "一次性迁移任务", module: "计算", type: "一次性", status: "成功", speed: "中", owner: "王五", creator: "陈晨", createdAt: "2026-08-19 14:17:00", id: "task-1019" },
  { key: "20", name: "手动排查任务", module: "采集", type: "手动", status: "成功", speed: "慢", owner: "赵六", creator: "刘洋", createdAt: "2026-08-20 09:36:00", id: "task-1020" },
];

const FILTER_COLUMNS: ColumnsType<FilterTaskRow> = [
  { title: "任务名称", dataIndex: "name", key: "name", width: 180 },
  { title: "任务模块", dataIndex: "module", key: "module", width: 100 },
  { title: "任务类型", dataIndex: "type", key: "type", width: 100 },
  { title: "状态", dataIndex: "status", key: "status", width: 80 },
  { title: "速度评估", dataIndex: "speed", key: "speed", width: 100 },
  { title: "负责人", dataIndex: "owner", key: "owner", width: 90 },
  { title: "创建人", dataIndex: "creator", key: "creator", width: 90 },
  { title: "创建时间", dataIndex: "createdAt", key: "createdAt", width: 180 },
  { title: "任务 ID", dataIndex: "id", key: "id", width: 120 },
];

const FILTER_TABLE_SCROLL_X = FILTER_COLUMNS.reduce((sum, column) => sum + (Number(column.width) || 0), 0);

const EDITABLE_TYPE_OPTIONS = [
  { label: "图片", value: "image" },
  { label: "文本", value: "text" },
  { label: "字符串", value: "string" },
];

const EDITABLE_REQUIRED_OPTIONS = [
  { label: "是", value: "yes" },
  { label: "否", value: "no" },
];

const editableRows = [
  { key: "1", type: "image", required: "yes", rule: "设置尺寸", hint: "" },
  { key: "2", type: "text", required: "yes", rule: "-", hint: "" },
  { key: "3", type: "string", required: "yes", rule: "添加选项", hint: "" },
];

const DEFAULT_PAGE_SIZE = 10;

function TablePaginationFooter({
  page,
  pageSize,
  total,
  onChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
}) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  return (
    <>
      <span className="sens-table-footer-left">
        {total === 0 ? "本页显示第 0-0 条" : `本页显示第 ${start}-${end} 条`}
      </span>
      <div className="sens-table-footer-right">
        <SensPagination current={page} pageSize={pageSize} total={total} onChange={onChange} />
      </div>
    </>
  );
}

function paginateRows<T>(rows: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return rows.slice(start, start + pageSize);
}

function matchesFilterRow(row: FilterTaskRow, filters: Record<string, string[]>): boolean {
  return (Object.entries(filters) as Array<[keyof FilterTaskRow, string[]]>).every(([key, selected]) => {
    if (!selected.length) return true;
    return selected.includes(String(row[key]));
  });
}

function hasActiveFilters(filters: Record<string, string[]>): boolean {
  return Object.values(filters).some((values) => values.length > 0);
}

function matchSearchRow(row: SearchTaskRow, query: string): boolean {
  return SEARCH_SCOPE.some((key) => defaultSelectOptionMatcher(String(row[key]), query));
}

function useSearchTaskColumns(keyword: string): ColumnsType<SearchTaskRow> {
  return useMemo(
    () => [
      {
        title: "任务名称",
        dataIndex: "name",
        key: "name",
        width: 220,
        render: (text: string) => <SearchHighlight text={text} keyword={keyword} />,
      },
      {
        title: "任务模块",
        dataIndex: "module",
        key: "module",
        width: 140,
        render: (text: string) => <SearchHighlight text={text} keyword={keyword} />,
      },
      {
        title: "任务类型",
        dataIndex: "type",
        key: "type",
        width: 120,
        render: (text: string) => <SearchHighlight text={text} keyword={keyword} />,
      },
      { title: "状态", dataIndex: "status", key: "status", width: 100 },
      { title: "任务 ID", dataIndex: "id", key: "id", width: 160 },
    ],
    [keyword],
  );
}

function TemplateSwitch({ active, onChange }: { active: TemplateKey; onChange: (key: TemplateKey) => void }) {
  const items: Array<{ key: TemplateKey; label: string }> = [
    { key: "filter", label: "筛选场景" },
    { key: "search", label: "搜索场景" },
    { key: "info", label: "信息栏" },
    { key: "layout", label: "页面组合" },
    { key: "editable", label: "录入型表格" },
    { key: "cross", label: "交叉表格" },
  ];

  return (
    <div className="form-templates-switch" aria-label="选择复合表格" data-sens-demo="composite-table-switch">
      {items.map((item) => (
        <SensButton
          key={item.key}
          size="small"
          tone={active === item.key ? "primary" : "secondary"}
          onClick={() => onChange(item.key)}
        >
          {item.label}
        </SensButton>
      ))}
    </div>
  );
}

function InfoBarSceneTemplate() {
  const [mode, setMode] = useState<"default" | "filtered" | "updated" | "largeData">("default");
  const [rightAction, setRightAction] = useState<"none" | "operation" | "button">("none");
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const showFiltered = mode === "filtered";
  const filteredRows = showFiltered ? FILTER_TASK_ROWS.filter((row) => row.status === "成功") : FILTER_TASK_ROWS;
  const hasSelection = selectedRowKeys.length > 0;
  const changeMode = (next: "default" | "filtered" | "updated" | "largeData") => {
    setMode(next);
    setSelectedRowKeys([]);
  };
  const infoContent = hasSelection
    ? undefined
    : mode === "updated"
      ? <TableInfoRefreshableSummary total={1000} updatedAt="2022-10-31 20:33:22" />
      : mode === "largeData"
        ? (
            <>
              <span>共找到 999,000 条</span>
              <SensButton size="small" tone="link">导出列表</SensButton>
              <span>，当前表格仅展示前 10,000 条数据</span>
            </>
          )
        : undefined;
  const infoLinkActions = rightAction === "none"
    ? undefined
    : [{ key: rightAction, label: rightAction === "operation" ? "操作" : "按钮" }];

  return (
    <section className="form-templates-board">
      <TemplateIntro
        title="信息栏"
        description="默认显示稳定的总条目数；筛选结果、数据更新时间与大数据下载提示分别替换普通信息。勾选行后进入批量操作信息。"
        rule="动态信息覆盖静态信息；批量选择优先于普通信息栏上下文。数据量过大时仅提示当前展示范围，并提供导出列表入口。"
      />
      <div className="form-templates-switch" aria-label="切换信息栏上下文" data-sens-demo="table-info-mode">
        <SensButton size="small" tone={mode === "default" ? "primary" : "secondary"} onClick={() => changeMode("default")}>
          默认信息
        </SensButton>
        <SensButton size="small" tone={mode === "filtered" ? "primary" : "secondary"} onClick={() => changeMode("filtered")}>
          筛选结果
        </SensButton>
        <SensButton size="small" tone={mode === "updated" ? "primary" : "secondary"} onClick={() => changeMode("updated")}>
          数据更新
        </SensButton>
        <SensButton size="small" tone={mode === "largeData" ? "primary" : "secondary"} onClick={() => changeMode("largeData")}>
          数据量过大
        </SensButton>
      </div>
      <div className="form-templates-switch" aria-label="切换信息栏右侧链接" data-sens-demo="table-info-right-actions">
        <SensButton size="small" tone={rightAction === "none" ? "primary" : "secondary"} onClick={() => setRightAction("none")}>
          仅设置列目
        </SensButton>
        <SensButton size="small" tone={rightAction === "operation" ? "primary" : "secondary"} onClick={() => setRightAction("operation")}>
          操作链接
        </SensButton>
        <SensButton size="small" tone={rightAction === "button" ? "primary" : "secondary"} onClick={() => setRightAction("button")}>
          按钮链接
        </SensButton>
      </div>
      <TableShell<FilterTaskRow>
        total={FILTER_TASK_ROWS.length}
        foundTotal={showFiltered ? filteredRows.length : undefined}
        selectedCount={selectedRowKeys.length}
        infoContent={infoContent}
        infoLinkActions={infoLinkActions}
        infoExtra={<TableInfoColumnSettingButton />}
        infoActions={
          hasSelection
            ? [
                { key: "hide", label: "隐藏" },
                { key: "show", label: "显示" },
                { key: "delete", label: "删除", tone: "dangerSecondaryWeak" },
                { key: "cancel", label: "取消选择", tone: "tertiary", onClick: () => setSelectedRowKeys([]) },
              ]
            : undefined
        }
        rowKey="key"
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys, fixed: true }}
        columns={FILTER_COLUMNS}
        dataSource={filteredRows}
        pagination={false}
        scroll={{ x: FILTER_TABLE_SCROLL_X }}
      />
    </section>
  );
}

function TemplateIntro({ title, description, rule }: { title: string; description: string; rule: string }) {
  return (
    <div className="form-templates-intro">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="form-templates-rule">{rule}</div>
    </div>
  );
}

function FilterTableDemo({
  chrome,
  overflow = false,
}: {
  chrome?: FilterLayoutChrome;
  overflow?: boolean;
}) {
  const [expanded, setExpanded] = useState(overflow);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [filters, setFilters] = useState<Record<string, string[]>>(FILTER_INITIAL);
  const [tabKey, setTabKey] = useState(FILTER_LAYOUT_TABS[0].key);

  const bindField = (field: SensTableFilterField): SensTableFilterField => ({
    ...field,
    value: filters[field.key] ?? [],
    onChange: (next) => {
      const values = Array.isArray(next) ? next : [];
      setFilters((prev) => ({ ...prev, [field.key]: values }));
      setPage(1);
    },
  });
  const fields = PRIMARY_FIELDS.map(bindField);
  const moreFields = overflow
    ? [...MORE_FIELDS.map(bindField), ...OVERFLOW_EXTRA_FIELDS]
    : MORE_FIELDS.map(bindField);
  const filtered = FILTER_TASK_ROWS.filter((row) => matchesFilterRow(row, filters));
  const paged = paginateRows(filtered, page, pageSize);
  const hasSelectedFilter = hasActiveFilters(filters);
  const noResult = hasSelectedFilter && filtered.length === 0;

  return (
    <div
      className="form-templates-stack"
      data-sens-demo="table-filter-demo"
      data-filter-layout={chrome ?? "none"}
      data-filter-overflow={overflow ? "true" : "false"}
    >
      {chrome === "alert" ? <SensAlert type="default">常规提示</SensAlert> : null}
      {chrome === "tabs" ? (
        <div className="composite-table-tabs-toolbar">
          <SensLineTabs
            barOnly
            size="large"
            items={FILTER_LAYOUT_TABS}
            activeKey={tabKey}
            onChange={setTabKey}
          />
          <div className="composite-table-tabs-toolbar__actions" aria-label="标签页操作">
            <SensButtonActionMenu
              tone="secondary"
              trigger={["hover"]}
              items={LAYOUT_MORE_MENU_ITEMS}
              data-sens-demo="composite-table-more-menu"
            >
              <SensMoreButton tone="secondary">更多</SensMoreButton>
            </SensButtonActionMenu>
            <SensButton tone="secondary">操作一</SensButton>
            <SensButton tone="secondary">操作二</SensButton>
            <SensButton tone="primary">操作三</SensButton>
          </div>
        </div>
      ) : null}
      <SensTableFilterBar
        primaryFields={fields}
        moreFields={moreFields}
        expanded={expanded}
        onExpandedChange={setExpanded}
        showReset={hasSelectedFilter}
        onReset={() => {
          setFilters(FILTER_INITIAL);
          setPage(1);
        }}
        searchPlaceholder="请输入"
      />
      <TableShell<FilterTaskRow>
        total={FILTER_TASK_ROWS.length}
        infoContent={
          <TableInfoRefreshableSummary
            prefix={hasSelectedFilter ? "已找到" : "共"}
            total={hasSelectedFilter ? filtered.length : FILTER_TASK_ROWS.length}
            updatedAt="2022-10-31 20:33:22"
          />
        }
        infoExtra={<TableInfoColumnSettingButton />}
        rowKey="key"
        columns={FILTER_COLUMNS}
        dataSource={paged}
        emptyState={noResult ? "noResult" : "noData"}
        pagination={false}
        scroll={{ x: FILTER_TABLE_SCROLL_X }}
        footerBar={
          <TablePaginationFooter
            page={page}
            pageSize={pageSize}
            total={filtered.length}
            onChange={(nextPage, nextPageSize) => {
              setPage(nextPage);
              setPageSize(nextPageSize);
            }}
          />
        }
      />
    </div>
  );
}

function SearchTableDemo({ mode }: { mode: SearchSceneMode }) {
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [filtered, setFiltered] = useState(SEARCH_TASK_ROWS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const timerRef = useRef<number | undefined>(undefined);
  const columns = useSearchTaskColumns(query);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const runSearch = (value: string) => {
    window.clearTimeout(timerRef.current);
    const trimmed = value.trim();
    if (!trimmed) {
      setQuery("");
      setFiltered(SEARCH_TASK_ROWS);
      setLoading(false);
      setPage(1);
      return;
    }
    setLoading(true);
    timerRef.current = window.setTimeout(() => {
      setQuery(value);
      setFiltered(SEARCH_TASK_ROWS.filter((row) => matchSearchRow(row, value)));
      setLoading(false);
      setPage(1);
    }, TABLE_SEARCH_LOAD_MS);
  };

  const hasQuery = query.trim().length > 0;
  const noResult = hasQuery && !loading && filtered.length === 0;
  const paged = paginateRows(filtered, page, pageSize);

  return (
    <div className="form-templates-stack" data-sens-demo="table-search-demo" data-search-mode={mode}>
      <SensTableFilterBar
        searchMode={mode}
        searchValue={draft}
        searchPlaceholder="请输入"
        onSearchChange={(next) => {
          setDraft(next);
          if (mode === "realtime") runSearch(next);
        }}
        onSearch={(value) => {
          setDraft(value);
          runSearch(value);
        }}
        primaryFields={SEARCH_PRIMARY_FIELDS}
        showReset={Boolean(draft)}
        onReset={() => {
          window.clearTimeout(timerRef.current);
          setDraft("");
          setQuery("");
          setFiltered(SEARCH_TASK_ROWS);
          setLoading(false);
          setPage(1);
        }}
      />
      <TableShell<SearchTaskRow>
        total={SEARCH_TASK_ROWS.length}
        foundTotal={hasQuery ? filtered.length : undefined}
        infoExtra={<TableInfoColumnSettingButton />}
        rowKey="key"
        columns={columns}
        dataSource={paged}
        loading={loading}
        emptyState={noResult ? "noResult" : "noData"}
        pagination={false}
        footerBar={
          <TablePaginationFooter
            page={page}
            pageSize={pageSize}
            total={filtered.length}
            onChange={(nextPage, nextPageSize) => {
              setPage(nextPage);
              setPageSize(nextPageSize);
            }}
          />
        }
      />
    </div>
  );
}

function SearchSceneTemplate() {
  const [mode, setMode] = useState<SearchSceneMode>("realtime");

  return (
    <section className="form-templates-board">
      <TemplateIntro
        title="搜索场景"
        description="实时搜索：输入法出字即加载命中行。静态搜索：先改框，点搜索按钮或回车才加载。搜索范围是任务名称、任务模块、任务类型；英文 / 拼音可命中中文，只高亮字面子串。"
        rule="框体复用 Search 实时型 / 触发型。表体加载、命中高亮和「已找到 n 条」由复合表格组合，不写进基础表格或 Search 框。"
      />
      <div className="form-templates-switch" aria-label="选择搜索方式" data-sens-demo="table-search-mode">
        <SensButton
          size="small"
          tone={mode === "realtime" ? "primary" : "secondary"}
          onClick={() => setMode("realtime")}
        >
          实时搜索
        </SensButton>
        <SensButton
          size="small"
          tone={mode === "trigger" ? "primary" : "secondary"}
          onClick={() => setMode("trigger")}
        >
          静态搜索
        </SensButton>
      </div>
      <SearchTableDemo key={mode} mode={mode} />
    </section>
  );
}

function FilterSceneTemplate() {
  const [mode, setMode] = useState<FilterExpandMode>("regular");
  const modeItems: Array<{ key: FilterExpandMode; label: string }> = [
    { key: "regular", label: "常规筛选" },
    { key: "overflow", label: "三行半展开" },
  ];

  return (
    <section className="form-templates-board">
      <TemplateIntro
        title="筛选场景"
        description="首行任务类型 / 速度评估是个数型多选；展开后是负责人、状态、创建人。勾选后点「完成」才过滤表体。任务模块只做列，不做筛选项。创建时间只做列。三行半展开默认打开展开区，锁 112 高并可滚。"
        rule="同一字段多选是或，不同字段是且。空字段不限制。有筛选出「已找到 n 条」，0 条走无结果空态。分页器改每页条数，表体按当前页切片展示。展开区最多再露 2.5 行；多出来的筛选项不接表体。"
      />
      <div className="form-templates-switch" aria-label="选择筛选展开" data-sens-demo="table-filter-expand">
        {modeItems.map((item) => (
          <SensButton
            key={item.key}
            size="small"
            tone={mode === item.key ? "primary" : "secondary"}
            onClick={() => setMode(item.key)}
          >
            {item.label}
          </SensButton>
        ))}
      </div>
      <FilterTableDemo key={mode} overflow={mode === "overflow"} />
    </section>
  );
}

function LayoutSceneTemplate() {
  const [chrome, setChrome] = useState<FilterLayoutChrome>("alert");
  const chromeItems: Array<{ key: FilterLayoutChrome; label: string }> = [
    { key: "alert", label: "提示条" },
    { key: "tabs", label: "标签页" },
  ];

  return (
    <section className="form-templates-board">
      <TemplateIntro
        title="页面组合"
        description="筛选栏上方可叠常规提示条，或叠基础标签页。不搬顶导、侧导和标题栏。"
        rule="提示条 / 标签页到筛选栏 16px。切 tab 不改表数据。筛选闭环与筛选场景相同。"
      />
      <div className="form-templates-switch" aria-label="选择页面组合" data-sens-demo="table-layout-switch">
        {chromeItems.map((item) => (
          <SensButton
            key={item.key}
            size="small"
            tone={chrome === item.key ? "primary" : "secondary"}
            onClick={() => setChrome(item.key)}
          >
            {item.label}
          </SensButton>
        ))}
      </div>
      <FilterTableDemo key={chrome} chrome={chrome} />
    </section>
  );
}

function EditableSceneTemplate() {
  return (
    <section className="form-templates-board">
      <TemplateIntro
        title="录入型表格"
        description="单元格高 56px，左右 padding 8px、上下 padding 12px；下方先并列展示输入框、选择器、带计数输入框、带图标 / 标签的选择器，再展示完整录入型表格。"
        rule="录入型表格属于复合组件；完整「新增元事件 / 物料元素」页面、右侧锚点和提交流转进入业务样板间。"
      />
      <EditableCellCarrierExamples />
      <EditableTableDemo />
    </section>
  );
}

function CrossTextStack({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <div className="cross-table__text-stack">
      <span className="cross-table__primary">{primary}</span>
      <span className="cross-table__secondary">{secondary}</span>
    </div>
  );
}

/** 指标列单位文案；表体用同结构不可见 trailing 预留，使数值对齐标题右缘 */
const CROSS_TABLE_METRIC_UNIT = "(单位)";

function CrossNumericTrailing({ hidden = false }: { hidden?: boolean }) {
  return (
    <span className="cross-table__numeric-trailing" aria-hidden={hidden || undefined}>
      <span className="cross-table__unit">{CROSS_TABLE_METRIC_UNIT}</span>
    </span>
  );
}

function CrossNumericHeading() {
  return (
    <span className="cross-table__numeric-heading">
      <span className="cross-table__numeric-title">指标</span>
      <CrossNumericTrailing />
    </span>
  );
}

function CrossNumericValue({ value }: { value: string }) {
  return (
    <span className="cross-table__numeric-cell">
      <span className="cross-table__numeric-value">{value}</span>
      <CrossNumericTrailing hidden />
    </span>
  );
}

function crossCellClass(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function CrossTableDemo() {
  /** Figma 26063:12256：组悬停整组；明细悬停则组悬停保留 + 当前明细加重 */
  const [hoverGroup, setHoverGroup] = useState<string | null>(null);
  const [hoverDetail, setHoverDetail] = useState<string | null>(null);
  const groups = useMemo(resolveCrossTableGroups, []);

  function enterGroup(groupId: string, detailId: string | null) {
    setHoverGroup(groupId);
    setHoverDetail(detailId);
  }

  function leaveGroup() {
    setHoverGroup(null);
    setHoverDetail(null);
  }

  function isGroupHot(groupId: string): boolean {
    return hoverGroup === groupId;
  }

  function isDetailIntensify(groupId: string, detailId: string): boolean {
    return hoverGroup === groupId && hoverDetail === detailId;
  }

  return (
    <div className="cross-table-shell" role="region" aria-label="交叉表格">
      <table className="cross-table" data-sens-demo="cross-table" data-cross-order={new URLSearchParams(window.location.search).get("crossOrder") ?? "default"} onMouseLeave={leaveGroup}>
        <colgroup>
          <col style={{ width: 200 }} />
          <col style={{ width: 200 }} />
          <col style={{ width: 130 }} />
          <col style={{ width: 130 }} />
          <col style={{ width: 130 }} />
          <col style={{ width: 388 }} />
          <col style={{ width: 168 }} />
        </colgroup>
        <thead>
          <tr>
            <th className="cross-table__th" colSpan={2} scope="colgroup">
              维度分组 A
            </th>
            <th className="cross-table__th" colSpan={3} scope="colgroup">
              维度分组 B
            </th>
            <th className="cross-table__th cross-table__th--span cross-table__th--numeric" rowSpan={2} scope="col">
              <CrossNumericHeading />
            </th>
            <th className="cross-table__th cross-table__th--span cross-table__cell--trail" rowSpan={2} scope="col">
              备注
            </th>
          </tr>
          <tr>
            <th className="cross-table__th" scope="col">
              主维度
            </th>
            <th className="cross-table__th" scope="col">
              渠道
            </th>
            <th className="cross-table__th" scope="col">
              状态一
            </th>
            <th className="cross-table__th" scope="col">
              状态二
            </th>
            <th className="cross-table__th" scope="col">
              状态三
            </th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) =>
            group.details.map((detail, detailIndex) => (
              <Fragment key={detail.detailId}>
                <tr data-cross-group-id={group.groupId} data-cross-detail-id={detail.detailId}>
                  {detailIndex === 0 ? (
                    <>
                <td
                  className={crossCellClass(
                    "cross-table__td",
                    "cross-table__td--merged",
                    isGroupHot(group.groupId) && "cross-table__td--shared-hover",
                  )}
                  rowSpan={group.details.length}
                  data-cross-role="merged"
                  onMouseEnter={() => enterGroup(group.groupId, null)}
                >
                  <CrossTextStack primary={group.dimA.primary} secondary={group.dimA.secondary} />
                </td>
                <td
                  className={crossCellClass(
                    "cross-table__td",
                    "cross-table__td--merged",
                    isGroupHot(group.groupId) && "cross-table__td--shared-hover",
                  )}
                  rowSpan={group.details.length}
                  data-cross-role="merged"
                  onMouseEnter={() => enterGroup(group.groupId, null)}
                >
                  <CrossTextStack primary={group.dimB.primary} secondary={group.dimB.secondary} />
                </td>
                <td
                  className={crossCellClass(
                    "cross-table__td",
                    "cross-table__td--merged",
                    isGroupHot(group.groupId) && "cross-table__td--shared-hover",
                  )}
                  rowSpan={group.details.length}
                  data-cross-role="merged"
                  onMouseEnter={() => enterGroup(group.groupId, null)}
                >
                  {group.metrics[0]}
                </td>
                <td
                  className={crossCellClass(
                    "cross-table__td",
                    "cross-table__td--merged",
                    isGroupHot(group.groupId) && "cross-table__td--shared-hover",
                  )}
                  rowSpan={group.details.length}
                  data-cross-role="merged"
                  onMouseEnter={() => enterGroup(group.groupId, null)}
                >
                  {group.metrics[1]}
                </td>
                <td
                  className={crossCellClass(
                    "cross-table__td",
                    "cross-table__td--merged",
                    isGroupHot(group.groupId) && "cross-table__td--shared-hover",
                  )}
                  rowSpan={group.details.length}
                  data-cross-role="merged"
                  onMouseEnter={() => enterGroup(group.groupId, null)}
                >
                  {group.metrics[2]}
                </td>
                <td
                  className={crossCellClass(
                    "cross-table__td",
                    "cross-table__td--merged",
                    "cross-table__cell--trail",
                    isGroupHot(group.groupId) && "cross-table__td--shared-hover",
                  )}
                  rowSpan={group.details.length}
                  data-cross-role="merged"
                  onMouseEnter={() => enterGroup(group.groupId, null)}
                >
                  {group.note}
                </td>
                    </>
                  ) : null}
                  <td
                  className={crossCellClass(
                    "cross-table__td",
                    "cross-table__td--numeric",
                    "cross-table__td--detail",
                    isGroupHot(group.groupId) && "cross-table__td--shared-hover",
                    isDetailIntensify(group.groupId, detail.detailId) && "cross-table__td--intensify-hover",
                  )}
                  data-cross-role="detail"
                  onMouseEnter={() => enterGroup(group.groupId, detail.detailId)}
                >
                  <CrossNumericValue value={detail.value} />
                </td>
              </tr>
              </Fragment>
            )),
          )}
        </tbody>
      </table>
    </div>
  );
}

function CrossTableSceneTemplate() {
  return (
    <section className="form-templates-board">
      <TemplateIntro
        title="交叉表格"
        description="表头有分类汇总（表头分组）时用交叉表格。原生 table 用 rowSpan / colSpan 做合并；合并区是完整逻辑单元格。"
        rule="悬停：合并格 → 整组（合并+全部明细）组悬停；明细格 → 组悬停保留 + 当前明细加重（Figma 26063:12256）。表头上下居中、单行 56；表体顶对齐，内容距上/左 12；数字列与标题「指标」右缘对齐。不接筛选、分页、复选与操作按钮。"
      />
      <CrossTableDemo />
    </section>
  );
}

function EditableCellCarrierExamples() {
  const cellStyle: CSSProperties = {
    minHeight: getUnitToken("size/component-height/xxxl"),
    boxSizing: "border-box",
    padding: `${getUnitToken("spacing/vertical/3x")}px ${getUnitToken("spacing/horizontal/2x")}px`,
    border: `${getDividerHairlineWidth()}px solid ${tokenRgba("outline-color-transparent", 0.12)}`,
    borderRadius: getUnitToken("radius/l"),
    background: getColorToken("white"),
  };
  const captionStyle: CSSProperties = {
    margin: `0 0 ${getUnitToken("spacing/1x")}px`,
    color: tokenRgba("text-sub-color-transparent", 0.58),
    fontSize: getTypographyToken("font-size/s"),
    lineHeight: `${getTypographyToken("line-height/s")}px`,
  };

  return (
    <div
      aria-label="录入型单元格示例"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: getUnitToken("spacing/4x"),
      }}
    >
      <div>
        <p style={captionStyle}>输入框</p>
        <div style={cellStyle}><SensInput placeholder="请输入" /></div>
      </div>
      <div>
        <p style={captionStyle}>选择器</p>
        <div style={cellStyle}><SensSelectDropdown options={EDITABLE_TYPE_OPTIONS} value="图片" popupMatchSelectWidth={false} style={{ width: "100%" }} /></div>
      </div>
      <div>
        <p style={captionStyle}>带计数输入框</p>
        <div style={cellStyle}><SensInput placeholder="请输入" maxLength={20} showCount /></div>
      </div>
      <div>
        <p style={captionStyle}>带图标 / 标签的选择器</p>
        <div style={cellStyle}>
          <SensSelectDropdown
            mode="multiple"
            multiDisplay="tags"
            confirmMultiple={false}
            options={filterOptions("最长展示文字最…", "数据分桶")}
            value={["最长展示文字最…", "数据分桶"]}
            popupMatchSelectWidth={false}
            style={{ width: "100%" }}
            tagRender={({ label, value }) => (
              <span style={{ display: "inline-flex", alignItems: "center", gap: `${getUnitToken("spacing/1x")}px` }}>
                <SensIcon name={value === "数据分桶" ? "setting" : "event-propertie"} sizeToken="size/icon/m" color="currentColor" />
                {label}
              </span>
            )}
          />
        </div>
      </div>
    </div>
  );
}

function EditableTableHeader({
  children,
  help,
}: {
  children: string;
  help?: boolean;
}) {
  return (
    <th>
      <span className="editable-table__header-title">
        {children}
        {help ? <SensIcon name="help" sizeToken="size/icon/m" color="currentColor" /> : null}
      </span>
    </th>
  );
}

function EditableTextCell({ placeholder = "请输入" }: { placeholder?: string }) {
  return (
    <td className="editable-table__cell editable-table__cell--control">
      <SensInput placeholder={placeholder} />
    </td>
  );
}

function EditableSelectCell({
  value,
  options,
}: {
  value?: string;
  options: { label: string; value: string }[];
}) {
  return (
    <td className="editable-table__cell editable-table__cell--control">
      <SensSelectDropdown
        options={options}
        value={value || undefined}
        placeholder="请选择"
        popupMatchSelectWidth={false}
      />
    </td>
  );
}

function EditablePlainCell({ children, link = false }: { children: string; link?: boolean }) {
  return (
    <td className="editable-table__cell editable-table__cell--plain">
      {link ? (
        <SensButton tone="link">
          {children}
        </SensButton>
      ) : (
        <span className="editable-table__plain-text">{children}</span>
      )}
    </td>
  );
}

function EditableTableDemo() {
  const [rows, setRows] = useState(editableRows);

  function removeMaterialElement(rowKey: string) {
    setRows((currentRows) => currentRows.filter((row) => row.key !== rowKey));
  }

  function addMaterialElement() {
    setRows((currentRows) => [
      ...currentRows,
      {
        key: `draft-${currentRows.length + 1}`,
        type: "",
        required: "",
        rule: "-",
        hint: "",
      },
    ]);
  }

  return (
    <div className="editable-table-shell" role="region" aria-label="录入型表格">
      <table className="editable-table">
        <colgroup>
          <col style={{ width: 240 }} />
          <col style={{ width: 240 }} />
          <col style={{ width: 144 }} />
          <col style={{ width: 144 }} />
          <col style={{ width: 168 }} />
          <col style={{ width: 240 }} />
          <col style={{ width: 72 }} />
        </colgroup>
        <thead>
          <tr>
            <EditableTableHeader>元素名称</EditableTableHeader>
            <EditableTableHeader>元素 ID</EditableTableHeader>
            <EditableTableHeader>元素类型</EditableTableHeader>
            <EditableTableHeader>必填</EditableTableHeader>
            <EditableTableHeader>限制条件</EditableTableHeader>
            <EditableTableHeader help>提示文案</EditableTableHeader>
            <EditableTableHeader>操作</EditableTableHeader>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <EditableTextCell />
              <EditableTextCell />
              <EditableSelectCell value={row.type || undefined} options={EDITABLE_TYPE_OPTIONS} />
              <EditableSelectCell value={row.required || undefined} options={EDITABLE_REQUIRED_OPTIONS} />
              <EditablePlainCell link={row.rule !== "-"}>{row.rule}</EditablePlainCell>
              <td className="editable-table__cell editable-table__cell--with-count">
                <SensInput placeholder="请输入" maxLength={20} showCount />
              </td>
              <td className="editable-table__cell editable-table__cell--plain">
                <SensButton tone="link" onClick={() => removeMaterialElement(row.key)}>
                  删除
                </SensButton>
              </td>
            </tr>
          ))}
          <tr className="editable-table__add-row">
            <td colSpan={7}>
              <SensButton
                tone="link"
                icon={<SensIcon name="editor-add" sizeToken="size/icon/m" color="currentColor" />}
                onClick={addMaterialElement}
              >
                添加物料元素
              </SensButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function CompositeTablePage() {
  const [active, setActive] = useState<TemplateKey>("filter");

  return (
    <main className="form-templates-page" style={buildCompositeTableVars()}>
      <header className="form-templates-header">
        <span>Composite Table / P0</span>
        <h1>复合表格</h1>
        <p>复合表格只收可跨业务复用的组合模式。筛选区、录入型、交叉表格、树表格和嵌套表格不继续塞进基础表格。</p>
      </header>
      <TemplateSwitch active={active} onChange={setActive} />
      {active === "filter" ? <FilterSceneTemplate /> : null}
      {active === "search" ? <SearchSceneTemplate /> : null}
      {active === "info" ? <InfoBarSceneTemplate /> : null}
      {active === "layout" ? <LayoutSceneTemplate /> : null}
      {active === "editable" ? <EditableSceneTemplate /> : null}
      {active === "cross" ? <CrossTableSceneTemplate /> : null}
    </main>
  );
}
