import { useState, type CSSProperties, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { getColorToken, tokenRgba } from "../../design-system/color-utils";
import { getDividerColor, getDividerHairlineWidth } from "../../design-system/divider";
import { SensIcon } from "../../design-system/icons";
import { getTypographyToken } from "../../design-system/typography";
import { getUnitToken } from "../../design-system/unit";
import {
  SensButton,
  SensInput,
  SensPageTitleBar,
  SensSectionTitle,
  SensSelectDropdown,
  SensTopNavigation,
} from "../../ui";
import "./form-templates.css";

interface EditableScenarioRow {
  key: string;
  name: string;
  id: string;
  type: string;
  required: string;
  rule: string;
  hint: string;
  errors?: Partial<Record<"name" | "id" | "type" | "required" | "hint", string>>;
}

interface EditableScenario {
  key: string;
  variant?: "editable" | "dimension";
  title: string;
  description: string;
  rule: string;
  navActive: string;
  pageTitle: string;
  pageMeta: string;
  sectionTitle: string;
  sectionDescription: string;
  addLabel: string;
  baseFields: Array<{ label: string; placeholder: string; value?: string; help?: string }>;
  rows: EditableScenarioRow[];
}

type DimensionPreviewState = "loading-missing" | "failed" | "refreshing" | "empty";

interface DimensionRow {
  key: string;
  eventProperty: string;
  eventPropertyValue?: string;
  previewState: DimensionPreviewState;
  displayName: string;
  dimensionName: string;
  group?: string;
  dataType: string;
  dataTypeEnglish: string;
}

const typeOptions = [
  { label: "图片", value: "image" },
  { label: "文本", value: "text" },
  { label: "字符串", value: "string" },
  { label: "数值", value: "number" },
];

const requiredOptions = [
  { label: "是", value: "yes" },
  { label: "否", value: "no" },
];

const scenarios: EditableScenario[] = [
  {
    key: "event-scroll",
    title: "新增元事件 / 滚动",
    description: "用于新增元事件时配置属性字段。业务页可能包含右侧锚点和提交按钮，本轮先收录主体结构。",
    rule: "业务样板间消费录入型表格复合组件；滚动、锚点与提交流转后续再补。",
    navActive: "数据管理",
    pageTitle: "新增元事件",
    pageMeta: "事件模型 / 新增元事件",
    sectionTitle: "属性配置",
    sectionDescription: "在事件模型中维护属性字段。",
    addLabel: "添加属性",
    baseFields: [
      { label: "事件名称", value: "scroll", placeholder: "请输入事件名称", help: "以英文开头，仅支持字母、数字和下划线。" },
      { label: "事件显示名", value: "滚动", placeholder: "请输入事件显示名" },
      { label: "事件描述", placeholder: "请输入事件描述", help: "最多输入 200 个字符。" },
    ],
    rows: [
      { key: "time", name: "time", id: "event_time", type: "number", required: "yes", rule: "-", hint: "系统生成时间" },
      { key: "cost", name: "cost", id: "pay_cost", type: "number", required: "yes", rule: "设置范围", hint: "单位为元" },
      {
        key: "source",
        name: "",
        id: "",
        type: "",
        required: "",
        rule: "添加选项",
        hint: "",
        errors: {
          name: "请输入元素名称",
          id: "请输入元素 ID",
          type: "请选择元素类型",
          required: "请选择是否必填",
          hint: "请输入提示文案",
        },
      },
    ],
  },
  {
    key: "material-element",
    title: "物料元素录入",
    description: "用于在物料或资源配置中连续新增元素；最后一行提供新增入口。",
    rule: "最后一行是链接按钮入口；真实新增行、删除行和校验状态不在首轮样板间里模拟。",
    navActive: "内容管理",
    pageTitle: "物料元素录入",
    pageMeta: "资源配置 / 物料元素",
    sectionTitle: "物料元素",
    sectionDescription: "维护物料名称、ID、类型和提示文案。",
    addLabel: "添加物料元素",
    baseFields: [
      { label: "物料名称", value: "首页活动物料", placeholder: "请输入物料名称" },
      { label: "物料 ID", value: "homepage_material", placeholder: "请输入物料 ID", help: "用于资源配置和查询。" },
      { label: "使用说明", placeholder: "请输入使用说明" },
    ],
    rows: [
      { key: "cover", name: "封面图", id: "cover_image", type: "image", required: "yes", rule: "设置尺寸", hint: "建议 750x420" },
      { key: "title", name: "标题", id: "title", type: "text", required: "yes", rule: "-", hint: "用于前台展示" },
      { key: "tag", name: "标签", id: "material_tag", type: "string", required: "no", rule: "添加选项", hint: "" },
    ],
  },
  {
    key: "create-dimension-event-property",
    variant: "dimension",
    title: "创建维度（事件属性）",
    description: "维度从事件属性中创建；值预览支持加载缺口、失败重试和空结果三种业务状态。",
    rule: "值预览是创建维度页面的业务列，不回写为基础表格或基础选择器规则。",
    navActive: "指标平台",
    pageTitle: "创建维度（事件属性）",
    pageMeta: "指标平台 / 维度管理 / 创建维度",
    sectionTitle: "",
    sectionDescription: "",
    addLabel: "添加维度",
    baseFields: [],
    rows: [],
  },
];

const dimensionGroupOptions = [
  { label: "维度分组 1", value: "group-1" },
  { label: "维度分组 2", value: "group-2" },
];

const dimensionRows: DimensionRow[] = [
  {
    key: "city",
    eventProperty: "城市",
    eventPropertyValue: "city",
    previewState: "loading-missing",
    displayName: "城市",
    dimensionName: "city",
    group: "group-1",
    dataType: "字符串",
    dataTypeEnglish: "String",
  },
  {
    key: "long-label",
    eventProperty: "最长展示文字最长展示…",
    eventPropertyValue: "long-label",
    previewState: "failed",
    displayName: "最长展示文字最长展示…",
    dimensionName: "long_display_text",
    group: "group-1",
    dataType: "数值",
    dataTypeEnglish: "Number range",
  },
  {
    key: "period",
    eventProperty: "周期",
    eventPropertyValue: "period",
    previewState: "empty",
    displayName: "周期",
    dimensionName: "week",
    group: "group-1",
    dataType: "日期时间",
    dataTypeEnglish: "Datetime",
  },
];

function px(value: number): string {
  return `${value}px`;
}

function buildTemplateVars(): CSSProperties {
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
    "--editable-table-header-bg": getColorToken("background-grey"),
    "--editable-table-border": tokenRgba("outline-color-transparent", 0.12),
    "--editable-table-divider": getDividerColor("light", "transparent"),
    "--editable-table-muted-text": tokenRgba("text-sub-color-transparent", 0.58),
    "--editable-table-link": getColorToken("link-color"),
    "--dimension-table-width": "1392px",
    "--dimension-preview-warning": getColorToken("warning-color"),
    "--sdh-template-shell-bg": tokenRgba("background-transparent-grey", 0.04),
  } as CSSProperties;
}

function EditableTableHeader({ children, help }: { children: ReactNode; help?: boolean }) {
  return (
    <th>
      <span className="editable-table__header-title">
        {children}
        {help ? <SensIcon name="help" sizeToken="size/icon/m" color="currentColor" /> : null}
      </span>
    </th>
  );
}

function EditableScenarioTable({ scenario }: { scenario: EditableScenario }) {
  const [rows, setRows] = useState(scenario.rows);

  function updateRow<K extends keyof EditableScenarioRow>(
    rowKey: string,
    field: K,
    value: EditableScenarioRow[K],
  ) {
    setRows((currentRows) =>
      currentRows.map((row) => {
        if (row.key !== rowKey) return row;

        const nextErrors = row.errors ? { ...row.errors } : undefined;
        if (field in (nextErrors ?? {})) {
          delete nextErrors?.[field as keyof NonNullable<EditableScenarioRow["errors"]>];
        }

        return { ...row, [field]: value, errors: nextErrors };
      }),
    );
  }

  function addRow() {
    setRows((currentRows) => [
      ...currentRows,
      {
        key: `draft-${currentRows.length + 1}`,
        name: "",
        id: "",
        type: "",
        required: "",
        rule: "-",
        hint: "",
      },
    ]);
  }

  return (
    <div className="editable-table-shell" role="region" aria-label={scenario.title}>
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
              <td className="editable-table__cell editable-table__cell--control">
                <SensInput
                  value={row.name}
                  placeholder="请输入"
                  warningPlacement={row.errors?.name ? "inside" : undefined}
                  warningMessage={row.errors?.name}
                  onChange={(event) => updateRow(row.key, "name", event.target.value)}
                />
              </td>
              <td className="editable-table__cell editable-table__cell--control">
                <SensInput
                  value={row.id}
                  placeholder="请输入"
                  warningPlacement={row.errors?.id ? "inside" : undefined}
                  warningMessage={row.errors?.id}
                  onChange={(event) => updateRow(row.key, "id", event.target.value)}
                />
              </td>
              <td className="editable-table__cell editable-table__cell--control">
                <SensSelectDropdown
                  options={typeOptions}
                  value={row.type || undefined}
                  popupMatchSelectWidth={false}
                  warningPlacement={row.errors?.type ? "inside" : undefined}
                  warningMessage={row.errors?.type}
                  onChange={(value) => updateRow(row.key, "type", value ?? "")}
                />
              </td>
              <td className="editable-table__cell editable-table__cell--control">
                <SensSelectDropdown
                  options={requiredOptions}
                  value={row.required || undefined}
                  popupMatchSelectWidth={false}
                  warningPlacement={row.errors?.required ? "inside" : undefined}
                  warningMessage={row.errors?.required}
                  onChange={(value) => updateRow(row.key, "required", value ?? "")}
                />
              </td>
              <td className="editable-table__cell editable-table__cell--plain">
                {row.rule === "-" ? (
                  <span className="editable-table__plain-text">-</span>
                ) : (
                  <SensButton tone="link" size="small">
                    {row.rule}
                  </SensButton>
                )}
              </td>
              <td className="editable-table__cell editable-table__cell--with-count">
                <SensInput
                  value={row.hint}
                  placeholder="请输入"
                  warningPlacement={row.errors?.hint ? "inside" : undefined}
                  warningMessage={row.errors?.hint}
                  onChange={(event) => updateRow(row.key, "hint", event.target.value)}
                />
                <span className="editable-table__count">{row.hint.length}/20</span>
              </td>
              <td className="editable-table__cell editable-table__cell--plain">
                <SensButton tone="link" size="small">
                  删除
                </SensButton>
              </td>
            </tr>
          ))}
          <tr className="editable-table__add-row">
            <td colSpan={7}>
              <SensButton
                tone="link"
                size="small"
                icon={<SensIcon name="editor-add" sizeToken="size/icon/m" color="currentColor" />}
                onClick={addRow}
              >
                {scenario.addLabel}
              </SensButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const PRODUCT_NAV_ITEMS = [
  { label: "概览" },
  { label: "报表" },
  { label: "分析", arrow: true },
  { label: "指标平台", arrow: true },
  { label: "智能运营", arrow: true },
  { label: "渠道追踪" },
  { label: "用户分群" },
  { label: "用户管理", arrow: true },
  { label: "内容管理", arrow: true },
  { label: "数据管理", arrow: true },
  { label: "场景商店" },
  { label: "项目设置", arrow: true },
  { label: "更多", arrow: true },
];

function ScenarioBaseInfo({ scenario }: { scenario: EditableScenario }) {
  return (
    <section className="sdh-template-base-info" aria-label={`${scenario.pageTitle}基础信息`}>
      <SensSectionTitle title="基础信息" description={scenario.description} />
      <div className="sdh-template-field-list">
        {scenario.baseFields.map((field) => (
          <label key={field.label} className="sdh-template-field">
            <span>{field.label}</span>
            <SensInput defaultValue={field.value} placeholder={field.placeholder} />
            {field.help ? <small>{field.help}</small> : null}
          </label>
        ))}
      </div>
    </section>
  );
}

function DimensionValuePreview({ state, onRefresh }: { state: DimensionPreviewState; onRefresh: () => void }) {
  if (state === "loading-missing") {
    return <span className="dimension-table__preview-missing">Loading / Missing</span>;
  }

  if (state === "failed") {
    return (
      <span className="dimension-table__preview dimension-table__preview--failed">
        <SensIcon name="feedback-error" sizeToken="size/icon/s" color="var(--dimension-preview-warning)" />
        <span>加载失败</span>
        <SensButton tone="link" size="small" onClick={onRefresh}>
          刷新
        </SensButton>
      </span>
    );
  }

  if (state === "refreshing") {
    return (
      <span className="dimension-table__preview dimension-table__preview--refreshing" aria-live="polite">
        <SensIcon name="reload" sizeToken="size/icon/m" color="currentColor" />
        <span>刷新中</span>
      </span>
    );
  }

  return <span className="dimension-table__preview-empty">最新数据为空，暂无预览结果</span>;
}

function DimensionEventPropertyTable() {
  const [rows, setRows] = useState(dimensionRows);

  function refreshPreview(rowKey: string) {
    setRows((current) =>
      current.map((row) => (row.key === rowKey ? { ...row, previewState: "refreshing" } : row)),
    );
    window.setTimeout(() => {
      setRows((current) =>
        current.map((row) => (row.key === rowKey ? { ...row, previewState: "empty" } : row)),
      );
    }, 800);
  }

  function addDimension() {
    setRows((current) => [
      ...current,
      {
        key: `dimension-${current.length + 1}`,
        eventProperty: "",
        previewState: "empty",
        displayName: "",
        dimensionName: "",
        dataType: "",
        dataTypeEnglish: "",
      },
    ]);
  }

  return (
    <div className="editable-table-shell" role="region" aria-label="创建维度（事件属性）">
      <table className="editable-table dimension-table">
        <colgroup>
          <col style={{ width: 272 }} />
          <col style={{ width: 222 }} />
          <col style={{ width: 214 }} />
          <col style={{ width: 210 }} />
          <col style={{ width: 160 }} />
          <col style={{ width: 242 }} />
          <col style={{ width: 72 }} />
        </colgroup>
        <thead>
          <tr>
            <EditableTableHeader>事件属性</EditableTableHeader>
            <EditableTableHeader>值预览</EditableTableHeader>
            <EditableTableHeader>维度显示名</EditableTableHeader>
            <EditableTableHeader>维度名称</EditableTableHeader>
            <EditableTableHeader>维度分组</EditableTableHeader>
            <EditableTableHeader>数据类型</EditableTableHeader>
            <EditableTableHeader>操作</EditableTableHeader>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <td className="editable-table__cell editable-table__cell--control">
                <SensSelectDropdown
                  options={dimensionRows.map((option) => ({ label: option.eventProperty, value: option.key }))}
                  value={row.eventPropertyValue}
                  popupMatchSelectWidth={false}
                />
              </td>
              <td className="editable-table__cell editable-table__cell--plain dimension-table__preview-cell">
                <DimensionValuePreview state={row.previewState} onRefresh={() => refreshPreview(row.key)} />
              </td>
              <td className="editable-table__cell editable-table__cell--control">
                <SensInput defaultValue={row.displayName} />
              </td>
              <td className="editable-table__cell editable-table__cell--control">
                <SensInput defaultValue={row.dimensionName} />
              </td>
              <td className="editable-table__cell editable-table__cell--control">
                <SensSelectDropdown
                  options={dimensionGroupOptions}
                  value={row.group}
                  popupMatchSelectWidth={false}
                />
              </td>
              <td className="editable-table__cell editable-table__cell--plain">
                <span className="dimension-table__data-type">
                  <strong>{row.dataType}</strong>
                  <span>{row.dataTypeEnglish}</span>
                </span>
              </td>
              <td className="editable-table__cell editable-table__cell--plain">
                <SensButton tone="link" size="small">
                  删除
                </SensButton>
              </td>
            </tr>
          ))}
          <tr className="editable-table__add-row">
            <td colSpan={7}>
              <SensButton
                tone="link"
                size="small"
                icon={<SensIcon name="editor-add" sizeToken="size/icon/m" color="currentColor" />}
                onClick={addDimension}
              >
                添加维度
              </SensButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function SdhEditableTableTemplatePage() {
  const { scenarioKey } = useParams<{ scenarioKey: string }>();
  const scenario = scenarios.find((item) => item.key === scenarioKey) ?? scenarios[0];
  const isDimensionScenario = scenario.variant === "dimension";

  return (
    <main className="sdh-template-page" style={buildTemplateVars()}>
      <SensTopNavigation embedded activeNavLabel={scenario.navActive} items={PRODUCT_NAV_ITEMS} />
      <SensPageTitleBar
        variant="drilldown"
        title={scenario.pageTitle}
        breadcrumbItems={scenario.pageMeta.split(" / ").map((label, index) => ({ key: `${index}-${label}`, label }))}
        onBack={() => window.history.back()}
        actions={
          <div className="sdh-template-product-actions">
            <SensButton tone="secondary">{isDimensionScenario ? "放弃" : "取消"}</SensButton>
            {isDimensionScenario ? <SensButton tone="secondary">提交并分配权限</SensButton> : null}
            <SensButton tone="primary">提交</SensButton>
          </div>
        }
      />

      <div className={`sdh-template-product-body${isDimensionScenario ? " sdh-template-product-body--single" : ""}`}>
        <main className="sdh-template-product-content">
          {isDimensionScenario ? (
            <DimensionEventPropertyTable />
          ) : (
            <>
              <ScenarioBaseInfo scenario={scenario} />
              <section className="form-templates-table-block">
                <SensSectionTitle title={scenario.sectionTitle} description={scenario.sectionDescription} />
                <EditableScenarioTable key={scenario.key} scenario={scenario} />
              </section>
              <div className="form-templates-rule">{scenario.rule}</div>
            </>
          )}
        </main>
        {isDimensionScenario ? null : (
          <aside className="sdh-template-anchor-missing" aria-label="锚点组件缺口">
            <span>Anchor / Missing</span>
            <strong>锚点导航待补</strong>
            <p>锚点组件完成后，这里接入真实页面滚动定位；本轮不伪造锚点交互。</p>
          </aside>
        )}
      </div>
    </main>
  );
}
