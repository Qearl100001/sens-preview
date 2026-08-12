import { useMemo, useState, type CSSProperties } from "react";
import { getColorToken, tokenRgba } from "../../design-system/color-utils";
import { SensIcon } from "../../design-system/icons";
import { getDividerColor, getDividerHairlineWidth } from "../../design-system/divider";
import { getTypographyToken } from "../../design-system/typography";
import { getUnitToken } from "../../design-system/unit";
import {
  SensButton,
  SensInput,
  SensPagination,
  SensSelectDropdown,
  SensTableFilterBar,
  TableInfoColumnSettingButton,
  TableInfoRefreshableSummary,
  TableShell,
  type SensTableFilterField,
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
  } as CSSProperties;
}

const SELECT_OPTIONS = [
  { label: "选项 A", value: "a" },
  { label: "选项 B", value: "b" },
  { label: "对最多六个字示例", value: "long" },
];

const PRIMARY_FIELDS: SensTableFilterField[] = [
  { key: "module", label: "任务模块", options: SELECT_OPTIONS },
  { key: "type", label: "任务类型", options: SELECT_OPTIONS },
  { key: "speed", label: "速度评估", options: SELECT_OPTIONS },
  { key: "more-1", label: "更多筛选", options: SELECT_OPTIONS },
  { key: "more-2", label: "更多筛选", options: SELECT_OPTIONS },
];

const MORE_FIELDS: SensTableFilterField[] = Array.from({ length: 2 }, (_, index) => ({
  key: `extra-${index + 1}`,
  label: index % 3 === 0 ? "更多筛选" : "内容",
  options: SELECT_OPTIONS,
  defaultValue: index === 0 ? "long" : undefined,
}));

const roadmapRows = [
  { key: "filter", pattern: "筛选表格", status: "筛选区 ✅", boundary: "筛选区已样张；列设置 / 复杂排序 / 分页闭环仍待" },
  { key: "editable", pattern: "录入型表格", status: "首轮样张", boundary: "行内输入、两行文本、新增行入口已落地；校验和真实删除待补" },
  { key: "tree", pattern: "树表格", status: "待收录", boundary: "层级展开、树节点缩进、父子关系和树状态" },
  { key: "nested", pattern: "嵌套 / 交叉表格", status: "待收录", boundary: "嵌套结构、横纵交叉阅读和复杂数据关系" },
];

const roadmapColumns = [
  { title: "复合表格", dataIndex: "pattern", key: "pattern", width: 180 },
  { title: "状态", dataIndex: "status", key: "status", width: 120 },
  { title: "边界", dataIndex: "boundary", key: "boundary" },
];

const demoColumns = [
  { title: "任务模块", dataIndex: "module", key: "module", width: 140 },
  { title: "任务类型", dataIndex: "type", key: "type", width: 120 },
  { title: "状态", dataIndex: "status", key: "status", width: 100 },
  { title: "任务 ID", dataIndex: "id", key: "id", width: 160 },
];

const demoRows = [
  { key: "1", module: "采集", type: "定时", status: "成功", id: "task-1001" },
  { key: "2", module: "计算", type: "实时", status: "异常", id: "task-1002" },
  { key: "3", module: "导出", type: "手动", status: "成功", id: "task-1003" },
];

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

function TablePaginationFooter({ page, onChange }: { page: number; onChange: (page: number) => void }) {
  return (
    <>
      <span className="sens-table-footer-left">本页显示第 1-20 条</span>
      <div className="sens-table-footer-right">
        <SensPagination current={page} pageSize={20} total={1000} onChange={onChange} />
      </div>
    </>
  );
}

function FilterTableDemo() {
  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(1);
  const [moduleFilter, setModuleFilter] = useState<string | undefined>("a");
  const fields = useMemo(
    () =>
      PRIMARY_FIELDS.map((field) =>
        field.key === "module"
          ? {
              ...field,
              value: moduleFilter,
              onChange: setModuleFilter,
            }
          : field,
      ),
    [moduleFilter],
  );
  const moreFields = useMemo(() => MORE_FIELDS, []);
  const hasSelectedFilter = Boolean(moduleFilter);

  return (
    <div className="form-templates-stack">
      <SensTableFilterBar
        primaryFields={fields}
        moreFields={moreFields}
        expanded={expanded}
        onExpandedChange={setExpanded}
        showReset={hasSelectedFilter}
        onReset={() => setModuleFilter(undefined)}
        searchPlaceholder="请输入"
      />
      <TableShell
        total={1000}
        infoContent={<TableInfoRefreshableSummary total={1000} updatedAt="2022-10-31 20:33:22" />}
        infoExtra={<TableInfoColumnSettingButton />}
        rowKey="key"
        columns={demoColumns}
        dataSource={demoRows}
        pagination={false}
        footerBar={<TablePaginationFooter page={page} onChange={setPage} />}
      />
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
  value: string;
  options: { label: string; value: string }[];
}) {
  return (
    <td className="editable-table__cell editable-table__cell--control">
      <SensSelectDropdown options={options} value={value} popupMatchSelectWidth={false} />
    </td>
  );
}

function EditablePlainCell({ children, link = false }: { children: string; link?: boolean }) {
  return (
    <td className="editable-table__cell editable-table__cell--plain">
      {link ? (
        <SensButton tone="link" size="small">
          {children}
        </SensButton>
      ) : (
        <span className="editable-table__plain-text">{children}</span>
      )}
    </td>
  );
}

function EditableTableDemo() {
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
          {editableRows.map((row) => (
            <tr key={row.key}>
              <EditableTextCell />
              <EditableTextCell />
              <EditableSelectCell value={row.type} options={EDITABLE_TYPE_OPTIONS} />
              <EditableSelectCell value={row.required} options={EDITABLE_REQUIRED_OPTIONS} />
              <EditablePlainCell link={row.rule !== "-"}>{row.rule}</EditablePlainCell>
              <td className="editable-table__cell editable-table__cell--with-count">
                <SensInput placeholder="请输入" />
                <span className="editable-table__count">0/20</span>
              </td>
              <EditablePlainCell link>删除</EditablePlainCell>
            </tr>
          ))}
          <tr className="editable-table__add-row">
            <td colSpan={7}>
              <SensButton
                tone="link"
                size="small"
                icon={<SensIcon name="editor-add" sizeToken="size/icon/m" color="currentColor" />}
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
  return (
    <main className="form-templates-page" style={buildCompositeTableVars()}>
      <header className="form-templates-header">
        <span>Composite Table / P0</span>
        <h1>复合表格</h1>
        <p>复合表格只收可跨业务复用的组合模式。筛选区、录入型、树表格、嵌套和交叉表格不继续塞进基础表格。</p>
      </header>

      <section className="form-templates-board">
        <div className="form-templates-intro">
          <div>
            <h2>筛选表格 · 筛选区</h2>
            <p>
              左标题右控件（8px）；项间距 16px；展开最多再露 2.5 行（max-height 112）并滚动；右侧展开/收起。触发定宽 128/148
              仅表格筛选生效。
            </p>
          </div>
          <div className="form-templates-rule">
            列设置面板、复杂排序、筛选结果与分页的真实数据闭环仍待后续轮次。
          </div>
        </div>

        <FilterTableDemo />
      </section>

      <section className="form-templates-board">
        <div className="form-templates-intro">
          <div>
            <h2>录入型表格 · 行内编辑</h2>
            <p>
              单元格高 56px，左右 padding 8px，上下 padding 12px；控件复用基础输入框 / 选择器。非组件文本单元格最多支持 2
              行以内文案。
            </p>
          </div>
          <div className="form-templates-rule">
            录入型表格属于复合组件；完整「新增元事件 / 物料元素」页面、右侧锚点和提交流转进入业务样板间。
          </div>
        </div>

        <EditableTableDemo />
      </section>

      <section className="form-templates-board">
        <div className="form-templates-intro">
          <div>
            <h2>复合表格边界</h2>
            <p>基础表格只负责表格信息区、表头、表体、选择、排序、空态和加载。筛选、分页、列设置和业务操作由复合表格组合。</p>
          </div>
        </div>

        <TableShell
          total={roadmapRows.length}
          infoExtra={<TableInfoColumnSettingButton />}
          rowKey="key"
          columns={roadmapColumns}
          dataSource={roadmapRows}
          pagination={false}
        />
      </section>
    </main>
  );
}
