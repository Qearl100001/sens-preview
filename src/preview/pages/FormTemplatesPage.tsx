import { useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { getColorToken, tokenRgba } from "../../design-system/color-utils";
import { getDividerColor, getDividerHairlineWidth } from "../../design-system/divider";
import { functionalCssVar } from "../../design-system/functional-skin";
import { SensIcon } from "../../design-system/icons";
import { getTypographyToken } from "../../design-system/typography";
import { getUnitToken } from "../../design-system/unit";
import andOrBottomCapSrc from "../../assets/form-connectors/and-or-bottom-cap.svg";
import andOrBottomStemSrc from "../../assets/form-connectors/and-or-bottom-stem.svg";
import andOrStemSrc from "../../assets/form-connectors/and-or-stem.svg";
import andOrTopCapSrc from "../../assets/form-connectors/and-or-top-cap.svg";
import {
  SensAnchor,
  SensButton,
  SensCheckbox,
  SensCheckboxGroup,
  SensForm,
  SensFormActions,
  SensFormItem,
  SensDrawer,
  SensInput,
  SensPagination,
  SensPopover,
  SensRadioGroup,
  SensSelectDropdown,
  SensSectionTitle,
  SensSteps,
  SensTag,
  SensTips,
  SensTitleBar,
  SensTextArea,
  LinkButton,
  TableShell,
  type SensAnchorItem,
  type SensStepItem,
} from "../../ui";
import { useRequiredField, useScrollToFirstFormError, bindRequiredInput, bindRequiredSelect } from "./formValidationDemo";
import "./form-templates.css";

type TemplateKey = "table" | "linked" | "card" | "drawer" | "popover" | "anchor" | "steps";

const ANCHOR_FORM_ITEMS: SensAnchorItem[] = [
  { key: "basic", label: "规则基本信息" },
  { key: "trigger", label: "触发条件" },
  { key: "alarm", label: "报警方式和疲劳度控制" },
];

interface AttributeRow {
  key: string;
  name: string;
  type: string;
  source: string;
}

interface AppParameterRow {
  key: string;
  strategyName: string;
  configuredStep: string;
}

const tableColumns: ColumnsType<AttributeRow> = [
  { title: "字段名称", dataIndex: "name", key: "name" },
  { title: "数据类型", dataIndex: "type", key: "type" },
  { title: "数据来源", dataIndex: "source", key: "source" },
];

const tableRows: AttributeRow[] = [
  { key: "event", name: "事件名称", type: "字符串", source: "埋点导入" },
  { key: "time", name: "发生时间", type: "日期时间", source: "系统生成" },
  { key: "amount", name: "订单金额", type: "数值", source: "业务字段" },
];

const appParameterColumns: ColumnsType<AppParameterRow> = [
  { title: "推荐策略名称", dataIndex: "strategyName", key: "strategyName", width: "54%" },
  { title: "当前已配置步骤", dataIndex: "configuredStep", key: "configuredStep", width: "36%" },
  {
    title: "操作",
    key: "action",
    width: "10%",
    render: () => <LinkButton tone="link">查看</LinkButton>,
  },
];

const appParameterRows: AppParameterRow[] = [
  { key: "1", strategyName: "新用户首日推荐策略", configuredStep: "步骤 1" },
  { key: "2", strategyName: "高价值用户召回策略", configuredStep: "步骤 2" },
  { key: "3", strategyName: "沉默用户唤醒策略", configuredStep: "步骤 3" },
  { key: "4", strategyName: "活动转化提升策略", configuredStep: "步骤 4" },
  { key: "5", strategyName: "长期留存运营策略", configuredStep: "步骤 5" },
  { key: "6", strategyName: "新客首购激励策略", configuredStep: "步骤 6" },
  { key: "7", strategyName: "会员续费提醒策略", configuredStep: "步骤 7" },
  { key: "8", strategyName: "内容偏好推荐策略", configuredStep: "步骤 8" },
  { key: "9", strategyName: "异常流失拦截策略", configuredStep: "步骤 9" },
  { key: "10", strategyName: "节日活动触达策略", configuredStep: "步骤 10" },
];

function FieldHelpIcon({ tip, stopToggle = false }: { tip: string; stopToggle?: boolean }) {
  const onStop = (event: MouseEvent) => {
    if (!stopToggle) return;
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <SensTips title={tip} placement="top">
      <span
        className="form-templates-field-help sens-cursor-default"
        tabIndex={0}
        aria-label="帮助说明"
        onClick={onStop}
        onMouseDown={onStop}
      >
        <SensIcon name="help" sizeToken="size/icon/m" color="currentColor" />
      </span>
    </SensTips>
  );
}

function AndOrConnector() {
  return (
    <div
      className="form-templates-and-or-connector"
      aria-label="且或条件"
      style={{
        "--form-templates-and-or-and-bg": functionalCssVar("--sens-skin-primary", "component-primary"),
        "--form-templates-and-or-or-bg": getColorToken("background-01-transparent"),
        "--form-templates-and-or-or-text": getColorToken("text-sub-color-transparent"),
        "--form-templates-and-or-and-text": getColorToken("white"),
      } as CSSProperties}
    >
      <div className="form-templates-and-or-connector-segment form-templates-and-or-connector-segment--top" aria-hidden="true">
        <span className="form-templates-and-or-connector-line">
          <img src={andOrTopCapSrc} alt="" />
          <img src={andOrStemSrc} alt="" />
        </span>
      </div>
      {/* Glyph paths from and-or-label.svg; fills must stay CSS vars so 「且」 follows Functional Skin. */}
      <svg
        className="form-templates-and-or-connector-label"
        width="18"
        height="36"
        viewBox="0 0 18 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        preserveAspectRatio="none"
        overflow="visible"
      >
        <path d="M0 2C0 0.89543 0.895431 0 2 0H16C17.1046 0 18 0.895431 18 2V18H0V2Z" fill="var(--form-templates-and-or-and-bg)" />
        <path d="M0 18H18V34C18 35.1046 17.1046 36 16 36H2C0.89543 36 0 35.1046 0 34V18Z" fill="var(--form-templates-and-or-or-bg)" />
        <path d="M4.61202 24.636V28.296H9.01602V24.636H4.61202ZM8.16402 27.516H5.47602V25.44H8.16402V27.516ZM9.38802 28.98C7.66002 29.472 5.87202 29.832 4.00002 30.072L4.21602 30.924C6.06402 30.624 7.79202 30.252 9.38802 29.82V28.98ZM13.432 31.956C14.032 31.956 14.5 31.116 14.824 29.46L14.08 28.968C13.876 30.336 13.624 31.02 13.336 31.02C13 31.02 12.628 30.708 12.208 30.084C12.076 29.868 11.956 29.616 11.836 29.34C12.676 28.116 13.372 26.604 13.936 24.792L13.18 24.384C12.724 25.896 12.16 27.204 11.488 28.308C11.392 27.984 11.32 27.636 11.248 27.264C11.044 26.136 10.936 24.84 10.912 23.376H14.668V22.536H13.504C13.3 22.032 13.084 21.588 12.868 21.192L11.992 21.336C12.232 21.696 12.46 22.104 12.664 22.536H10.9V21H10.036V22.536H4.00002V23.376H10.036C10.048 25.032 10.192 26.472 10.468 27.696C10.588 28.224 10.72 28.716 10.888 29.172C10.216 30.06 9.44802 30.756 8.59602 31.272L9.06402 32.016C9.86802 31.536 10.612 30.888 11.284 30.072C11.404 30.324 11.548 30.564 11.716 30.792C12.268 31.56 12.832 31.944 13.432 31.956Z" fill="var(--form-templates-and-or-or-text)" />
        <path d="M6.724 7.80422H11.956V10.0962H6.724V7.80422ZM11.956 6.97622H6.724V4.80422H11.956V6.97622ZM6.724 10.9122H11.956V13.2642H6.724V10.9122ZM4 13.2642V14.1162H14.668V13.2642H12.832V4.00022H5.848V13.2642H4Z" fill="var(--form-templates-and-or-and-text)" />
      </svg>
      <div className="form-templates-and-or-connector-segment form-templates-and-or-connector-segment--bottom" aria-hidden="true">
        <span className="form-templates-and-or-connector-line">
          <img src={andOrBottomStemSrc} alt="" />
          <img src={andOrBottomCapSrc} alt="" />
        </span>
      </div>
    </div>
  );
}

function px(value: number): string {
  return `${value}px`;
}

function buildPageTokenVars(): CSSProperties {
  return {
    "--form-templates-page-bg": tokenRgba("background-transparent-grey", 0.04),
    "--form-templates-surface": getColorToken("white"),
    "--form-templates-text": tokenRgba("text-color-transparent", 0.9),
    "--form-templates-sub-text": tokenRgba("text-sub-color-transparent", 0.58),
    "--form-templates-icon": getColorToken("icon-color-transparent"),
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
    "--form-templates-table-form-padding-inline": px(getUnitToken("spacing/horizontal/4x")),
    "--form-templates-title-size": px(getTypographyToken("font-size/xxl")),
    "--form-templates-title-line": px(getTypographyToken("line-height/xxl")),
    "--form-templates-title-weight": getTypographyToken("font-weight/semibold"),
    "--form-templates-heading-size": px(getTypographyToken("font-size/l")),
    "--form-templates-heading-line": px(getTypographyToken("line-height/l")),
    "--form-templates-body-size": px(getTypographyToken("font-size/m")),
    "--form-templates-body-line": px(getTypographyToken("line-height/m")),
    "--form-templates-body-weight": getTypographyToken("font-weight/medium"),
    "--form-templates-help-size": px(getTypographyToken("font-size/s")),
    "--form-templates-help-line": px(getTypographyToken("line-height/s")),
    "--form-templates-help-gap": px(getUnitToken("spacing/vertical/1x")),
    "--form-templates-control-max-width": px(getUnitToken("form/control/max-width")),
    /* 10x × 10 = 400；中抽屉左右结构输入宽 */
    "--form-templates-drawer-input-width": px(getUnitToken("spacing/10x") * 10),
    /* 10x × 10 + 5x = 420；SQL 文本域高度 */
    "--form-templates-sql-height": px(getUnitToken("spacing/10x") * 10 + getUnitToken("spacing/vertical/5x")),
    /* 6x × 5 = 120；Figma 补齐规则窄选择器 / 截取数字框 */
    "--form-templates-control-sm": px(getUnitToken("spacing/horizontal/6x") * 5),
    /* 8x × 6 − 1px 拼缝 = 191；Figma 组合框右侧数字宽度 */
    "--form-templates-combo-value-width": px(getUnitToken("spacing/8x") * 6 - getDividerHairlineWidth()),
  } as CSSProperties;
}

function TemplateSwitch({ active, onChange }: { active: TemplateKey; onChange: (key: TemplateKey) => void }) {
  const items: Array<{ key: TemplateKey; label: string }> = [
    { key: "table", label: "带表格表单" },
    { key: "linked", label: "联动表单" },
    { key: "card", label: "卡片表单" },
    { key: "drawer", label: "抽屉表单" },
    { key: "popover", label: "气泡卡片表单" },
    { key: "anchor", label: "带锚点表单" },
    { key: "steps", label: "分步表单" },
  ];

  return (
    <div className="form-templates-switch" aria-label="选择复合表单">
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

function TableFormTemplate() {
  const [layout, setLayout] = useState<"vertical" | "horizontal">("horizontal");
  const [source, setSource] = useState("import");
  const [scrollRequest, setScrollRequest] = useState(0);
  const formRootRef = useRef<HTMLDivElement>(null);
  const modelName = useRequiredField("input");
  const modelType = useRequiredField("select");
  useScrollToFirstFormError(scrollRequest, formRootRef);

  const submitForm = () => {
    modelName.validateNow();
    modelType.validateNow();
    setScrollRequest((count) => count + 1);
  };

  return (
    <section className="form-templates-board form-templates-board--table" ref={formRootRef}>
      <TemplateIntro
        title="带表格表单"
        description="用于在普通配置字段之外录入结构化多行数据。切换上、左右布局时，表格始终保持在所属标题下方。"
        rule="表格不受 Form 布局影响，始终使用上下结构。"
      />
      <div className="form-templates-toolbar">
        <span>外层表单布局</span>
        <div className="form-templates-layout-actions">
          <SensButton size="small" tone={layout === "vertical" ? "primary" : "secondary"} onClick={() => setLayout("vertical")}>
            上下布局
          </SensButton>
          <SensButton size="small" tone={layout === "horizontal" ? "primary" : "secondary"} onClick={() => setLayout("horizontal")}>
            左右布局
          </SensButton>
        </div>
      </div>
      <SensForm layout={layout} className="form-templates-form">
        <SensFormItem label="模型名称" required error={modelName.error}>
          <SensInput
            value={modelName.value}
            onChange={(event) => modelName.onChange(event.target.value)}
            onBlur={modelName.onBlur}
            placeholder="请输入"
            status={modelName.status}
          />
        </SensFormItem>
        <SensFormItem label="模型类型" required error={modelType.error}>
          <SensSelectDropdown
            className="form-templates-select"
            value={modelType.value || undefined}
            onChange={(next) => modelType.onChange(String(next ?? ""))}
            onBlur={modelType.onBlur}
            onOpenChange={(open) => {
              if (!open) modelType.onBlur();
            }}
            placeholder="请选择"
            status={modelType.status}
            options={[
              { value: "event", label: "事件模型" },
              { value: "user", label: "用户模型" },
            ]}
          />
        </SensFormItem>
        <SensFormItem label="数据来源" labelHelp="说明数据的采集来源">
          <SensRadioGroup
            value={source}
            onChange={setSource}
            options={[
              { value: "import", label: "批量导入" },
              { value: "stream", label: "实时写入" },
            ]}
          />
        </SensFormItem>
      </SensForm>
      <div className="form-templates-table-block">
        <SensSectionTitle title="属性配置" description="表格在标题下独立展开" />
        <TableShell columns={tableColumns} dataSource={tableRows} total={tableRows.length} />
      </div>
      <SensFormActions className="form-templates-actions">
        <SensButton tone="primary" onClick={submitForm}>提交</SensButton>
        <SensButton tone="secondary">取消</SensButton>
      </SensFormActions>
    </section>
  );
}

type LinkedLayout = "vertical" | "horizontal";

const audienceOptions = [
  { value: "all", label: "全部用户" },
  { value: "specified", label: "指定用户" },
];

function LinkedLayoutSample({ layout, title }: { layout: LinkedLayout; title: string }) {
  const [followUpAudience, setFollowUpAudience] = useState("specified");
  const [relatedAudience, setRelatedAudience] = useState("specified");
  const [channels, setChannels] = useState(["email"]);
  const [summaryAudience, setSummaryAudience] = useState("specified");
  const [scrollRequest, setScrollRequest] = useState(0);
  const rootRef = useRef<HTMLElement>(null);
  const mailSubject = useRequiredField("input");
  const cohort = useRequiredField("select");
  useScrollToFirstFormError(scrollRequest, rootRef);

  const submitForm = () => {
    mailSubject.validateNow();
    if (relatedAudience === "specified") cohort.validateNow();
    setScrollRequest((count) => count + 1);
  };

  return (
    <section className="form-templates-linked-layout" ref={rootRef}>
      <div className="form-templates-sample-heading">
        <h3>{title}</h3>
        <p>{layout === "horizontal" ? "标题列与关联内容顶部对齐。" : "标题在上，关联内容按字段向下自然展开。"}</p>
      </div>

      <div className="form-templates-linked-case-list">
        <article className="form-templates-linked-case">
          <div className="form-templates-case-heading">
            <h4>第一种：选项自带辅助文案</h4>
            <p>辅助说明始终外露，不因选中状态改变。</p>
          </div>
          <SensForm layout={layout} className="form-templates-form">
            <SensFormItem label="频控限制" optional="(选填)" labelAlign="top">
              <SensRadioGroup
                value="once"
                options={[
                  { value: "once", label: "展示一次", description: "同一用户仅展示一次" },
                  { value: "repeat", label: "展示多次", description: "按业务设置的频次继续展示" },
                ]}
                onChange={() => undefined}
              />
            </SensFormItem>
          </SensForm>
        </article>

        <article className="form-templates-linked-case">
          <div className="form-templates-case-heading">
            <h4>第二种：选项下跟随单个控件</h4>
            <p>控件只跟随被选中的选项出现，位置紧贴该选项说明。</p>
          </div>
          <SensForm layout={layout} className="form-templates-form">
            <SensFormItem label="用户范围" labelAlign="top">
              <div className="form-templates-linked-content">
                <SensRadioGroup
                  value={followUpAudience}
                  onChange={setFollowUpAudience}
                  itemHeight="content"
                  options={[
                    { value: "all", label: "全部用户", description: "不需要额外选择范围" },
                    { value: "specified", label: "指定用户", description: "选择一个用户分群作为触达范围" },
                  ]}
                />
                {followUpAudience === "specified" ? (
                  <SensSelectDropdown
                    className="form-templates-select"
                    placeholder="请选择用户分群"
                    options={[
                      { value: "new", label: "新注册用户" },
                      { value: "active", label: "高活跃用户" },
                    ]}
                  />
                ) : null}
              </div>
            </SensFormItem>
          </SensForm>
        </article>

        <article className="form-templates-linked-case">
          <div className="form-templates-case-heading">
            <h4>第三种：选中后展开关联内容区</h4>
            <p>适用于需要承接多个录入控件或局部配置卡的关联结果。</p>
          </div>
          <SensForm layout={layout} className="form-templates-form">
            <SensFormItem
              className="form-templates-linked-item"
              label="中奖用户范围"
              labelHelp="选择后展示对应配置"
              labelAlign="top"
            >
              <div className="form-templates-linked-content">
                <SensRadioGroup
                  value={relatedAudience}
                  onChange={setRelatedAudience}
                  options={audienceOptions}
                  itemHeight="content"
                />
                {relatedAudience === "specified" ? (
                  <div className="form-templates-outline-card">
                    <h4 className="form-templates-card-group-title">指定用户分群</h4>
                    <div className="sens-form-group-content">
                      <SensFormItem label="用户分群" layout={layout} error={cohort.error}>
                        <SensSelectDropdown
                          className="form-templates-select"
                          placeholder="请选择用户分群"
                          options={[
                            { value: "high-value", label: "高价值用户" },
                            { value: "recent", label: "最近活跃用户" },
                          ]}
                          {...bindRequiredSelect(cohort)}
                        />
                      </SensFormItem>
                      <SensFormItem label="补充说明" layout={layout}>
                        <SensInput placeholder="请输入补充说明" />
                      </SensFormItem>
                    </div>
                  </div>
                ) : null}
              </div>
            </SensFormItem>
            <SensFormItem className="form-templates-linked-item" label="触达渠道" labelAlign="top">
              <div className="form-templates-linked-content">
                <SensCheckboxGroup
                  value={channels}
                  onChange={setChannels}
                  itemHeight="content"
                  options={[
                    { value: "push", label: "站内通知", description: "在产品内向用户展示通知" },
                    { value: "email", label: "邮件通知", description: "通过已验证邮箱发送提醒" },
                  ]}
                />
                {channels.includes("email") ? (
                  <div className="form-templates-muted-card form-templates-muted-card--stack">
                    <h4>邮件发送配置</h4>
                    <SensFormItem label="邮件主题" layout={layout} required error={mailSubject.error}>
                      <SensInput placeholder="请输入邮件主题" {...bindRequiredInput(mailSubject)} />
                    </SensFormItem>
                  </div>
                ) : null}
              </div>
            </SensFormItem>
          </SensForm>
        </article>

        <article className="form-templates-linked-case">
          <div className="form-templates-case-heading">
            <h4>第四种：选中后展示关联结果文案</h4>
            <p>关联结果只是一段反馈或说明时，不需要额外包裹卡片。</p>
          </div>
          <SensForm layout={layout} className="form-templates-form">
            <SensFormItem label="展示策略" labelAlign="top">
              <div className="form-templates-linked-content">
                <SensRadioGroup
                  value={summaryAudience}
                  onChange={setSummaryAudience}
                  options={audienceOptions}
                  itemHeight="content"
                />
                {summaryAudience === "specified" ? (
                  <p className="form-templates-linked-result">已选择指定用户：后续操作仅对所选用户分群生效</p>
                ) : null}
              </div>
            </SensFormItem>
          </SensForm>
        </article>
      </div>
      <SensFormActions className="form-templates-actions">
        <SensButton tone="primary" onClick={submitForm}>提交</SensButton>
        <SensButton tone="secondary">取消</SensButton>
      </SensFormActions>
    </section>
  );
}

function LinkedFormTemplate() {
  return (
    <section className="form-templates-board">
      <TemplateIntro
        title="联动表单"
        description="覆盖选项辅助说明、选项下控件、关联内容区和关联结果文案四种结构；每种结构均提供左右、上下布局。"
        rule="选中项下承接控件、卡片或关联结果时，标题与整组顶部对齐，不为 Radio / Checkbox 额外补 32px 外框；触发选项到关联内容间距为 8px。"
      />
      <div className="form-templates-linked-layout-list">
        <LinkedLayoutSample layout="horizontal" title="左右布局" />
        <LinkedLayoutSample layout="vertical" title="上下布局" />
      </div>
    </section>
  );
}

function CardFormTemplate() {
  const [cardAudience, setCardAudience] = useState("specified");
  const [scrollRequest, setScrollRequest] = useState(0);
  const rootRef = useRef<HTMLElement>(null);
  const ruleName = useRequiredField("input");
  const eventType = useRequiredField("select");
  useScrollToFirstFormError(scrollRequest, rootRef);

  const submitForm = () => {
    ruleName.validateNow();
    eventType.validateNow();
    setScrollRequest((count) => count + 1);
  };

  return (
    <section className="form-templates-board" ref={rootRef}>
      <TemplateIntro
        title="卡片表单"
        description="三种卡片样张分别用于灰条分组、左右布局卡和关联结果卡。每张样张独立验证，不在同一业务页面中混用超过两种卡片样式。"
        rule="灰色大标题下的同组内容使用 16px 左右内缩，与标题文案左边对齐，不与灰色容器边缘对齐。"
      />
      <div className="form-templates-card-case-list">
        <article className="form-templates-card-case">
          <div className="form-templates-case-heading">
            <h3>样式一：灰条标题下的分组内容</h3>
            <p>用于顶层表单分组；内容区域与灰条标题文字左对齐。</p>
          </div>
          <SensForm className="form-templates-form">
            <div className="form-templates-section-block">
              <SensSectionTitle title="基础信息" description="标题与辅助文案在同一灰条中" />
              <div className="sens-form-group-content">
                <SensFormItem label="规则名称" required error={ruleName.error}>
                  <SensInput placeholder="请输入规则名称" {...bindRequiredInput(ruleName)} />
                </SensFormItem>
                <SensFormItem label="规则说明" optional="(选填)">
                  <SensInput placeholder="请输入规则说明" />
                </SensFormItem>
              </div>
            </div>
          </SensForm>
        </article>

        <article className="form-templates-card-case">
          <div className="form-templates-case-heading">
            <h3>样式二：左右布局中的独立配置卡</h3>
            <p>表单项标题在左，卡片作为右侧完整控件区；卡内内容仍与标题文字对齐。</p>
          </div>
          <SensForm layout="horizontal" className="form-templates-form">
            <SensFormItem label="事件配置" optional="(选填)" labelAlign="top">
              <div className="form-templates-outline-card">
                <h4 className="form-templates-card-group-title">事件卡片</h4>
                <div className="sens-form-group-content">
                  <SensFormItem label="事件名称" layout="vertical">
                    <SensInput placeholder="请输入事件名称" />
                  </SensFormItem>
                  <SensFormItem label="事件类型" layout="vertical" error={eventType.error}>
                    <SensSelectDropdown
                      className="form-templates-select"
                      placeholder="请选择事件类型"
                      options={[
                        { value: "track", label: "埋点事件" },
                        { value: "business", label: "业务事件" },
                      ]}
                      {...bindRequiredSelect(eventType)}
                    />
                  </SensFormItem>
                </div>
              </div>
            </SensFormItem>
          </SensForm>
        </article>

        <article className="form-templates-card-case">
          <div className="form-templates-case-heading">
            <h3>样式三：普通字段后的关联灰底卡</h3>
            <p>选择关联范围后承接局部配置；灰底卡内仅使用 14px 标题，不再嵌套白描边卡。</p>
          </div>
          <SensForm className="form-templates-form">
            <SensFormItem className="form-templates-linked-item" label="用户范围" labelAlign="top">
              <div className="form-templates-linked-content">
                <SensRadioGroup value={cardAudience} onChange={setCardAudience} options={audienceOptions} />
                {cardAudience === "specified" ? (
                  <div className="form-templates-muted-card form-templates-muted-card--stack">
                    <h4>关联用户配置</h4>
                    <SensFormItem label="用户分群" layout="vertical">
                      <SensSelectDropdown
                        className="form-templates-select"
                        placeholder="请选择用户分群"
                        options={[
                          { value: "new", label: "新注册用户" },
                          { value: "active", label: "高活跃用户" },
                        ]}
                      />
                    </SensFormItem>
                    <SensFormItem label="配置说明" layout="vertical">
                      <SensInput placeholder="请输入配置说明" />
                    </SensFormItem>
                  </div>
                ) : null}
              </div>
            </SensFormItem>
          </SensForm>
        </article>
      </div>
      <SensFormActions className="form-templates-actions">
        <SensButton tone="primary" onClick={submitForm}>保存规则</SensButton>
        <SensButton tone="secondary">取消</SensButton>
      </SensFormActions>
    </section>
  );
}

function DrawerFormTemplate() {
  const [open, setOpen] = useState(false);
  const [variant, setVariant] = useState<"vertical" | "horizontal">("vertical");
  const [scrollRequest, setScrollRequest] = useState(0);
  const formRootRef = useRef<HTMLDivElement>(null);
  const sqlExpr = useRequiredField("input");
  const metricName = useRequiredField("input");
  const isVertical = variant === "vertical";
  useScrollToFirstFormError(scrollRequest, formRootRef);

  const submitDrawer = () => {
    const invalid = isVertical ? sqlExpr.validateNow() : metricName.validateNow();
    if (invalid) setScrollRequest((count) => count + 1);
    else setOpen(false);
  };

  return (
    <section className="form-templates-board form-templates-board--drawer">
      <TemplateIntro
        title="抽屉表单"
        description="同一抽屉容器支持上下结构与左右结构，分别对应不同的信息密度和字段组织方式。"
        rule="标题栏固定，内容区独立滚动；上下结构强调分组层级，左右结构强调字段密度。"
      />
      <div className="form-templates-drawer-actions">
        <SensButton tone={isVertical ? "primary" : "secondary"} onClick={() => { setVariant("vertical"); setOpen(true); }}>
          上下结构
        </SensButton>
        <SensButton tone={!isVertical ? "primary" : "secondary"} onClick={() => { setVariant("horizontal"); setOpen(true); }}>
          左右结构
        </SensButton>
      </div>
      <SensDrawer
        open={open}
        size="medium"
        onClose={() => setOpen(false)}
        titleBar={
          <SensTitleBar
            title={isVertical ? "编辑虚拟属性计算逻辑" : "编辑指标"}
            onBack={() => setOpen(false)}
            actions={
              <>
                <SensButton tone="secondary" onClick={() => setOpen(false)}>放弃</SensButton>
                <SensButton tone="primary" onClick={submitDrawer}>{isVertical ? "提交" : "提交保存"}</SensButton>
              </>
            }
          />
        }
      >
        <div ref={formRootRef}>
        <SensForm
          layout={isVertical ? "vertical" : "horizontal"}
          labelWidth={isVertical ? undefined : 70}
          className={`form-templates-drawer-form ${isVertical ? "" : "form-templates-drawer-form--horizontal"}`}
        >
          {isVertical ? (
            <div className="form-templates-drawer-vertical-groups">
              <section className="form-templates-drawer-vertical-group">
                <SensSectionTitle title="确定虚拟属性的值" />
                <div className="form-templates-drawer-vertical-group-content form-templates-drawer-vertical-fields">
                  <SensFormItem label="创建方式">
                    <div className="form-templates-drawer-create-method">
                      <SensRadioGroup itemHeight="content" value="sql" options={[{ value: "sql", label: "使用 SQL 确定虚拟属性的值" }, { value: "copy", label: "从普通属性复制一个值" }]} />
                      <div className="form-templates-drawer-inline-help">详细 SQL 表达式的校验规则请参照 <SensButton tone="link">帮助文档</SensButton></div>
                    </div>
                  </SensFormItem>
                  <SensFormItem label="属性引用语法" error={sqlExpr.error}>
                    <div className="form-templates-drawer-syntax-content">
                      <ol className="form-templates-drawer-list">
                        <li>引用当前模型下的普通属性，格式必须是「模型名.模型属性名」</li>
                        <li>不支持引用跨模型间的普通属性</li>
                        <li>如需引用维度表的属性创建虚拟属性，格式必须是「维度表表名，维度表属性名」</li>
                        <li>不支持虚拟属性再嵌套虚拟属性</li>
                        <li>SQL 表达式最大的输入长度是 4096 个字符</li>
                      </ol>
                      <SensTextArea
                        className="form-templates-drawer-sql-textarea"
                        placeholder="请输入"
                        {...bindRequiredInput(sqlExpr)}
                      />
                    </div>
                  </SensFormItem>
                </div>
              </section>
              <section className="form-templates-drawer-vertical-group">
                <SensSectionTitle title="通过字典将原值进行替换" optional="(选填)" />
                <div className="form-templates-drawer-vertical-group-content">
                  <SensFormItem className="form-templates-drawer-dictionary-item" label="字典文件">
                    <div className="form-templates-drawer-upload">
                      <div className="form-templates-drawer-upload-copy">
                        <span>请上传 XLSX 格式的文件，模板需符合上传的要求，请先点击下载</span>
                        <SensButton tone="link" size="small">维度字典模板.xlsx</SensButton>
                      </div>
                      <SensButton tone="secondary">上传文件</SensButton>
                    </div>
                  </SensFormItem>
                </div>
              </section>
            </div>
          ) : (
            <>
              <SensFormItem label="指标名称" required error={metricName.error}>
                <SensInput placeholder="请输入" {...bindRequiredInput(metricName)} />
              </SensFormItem>
              <SensFormItem label="描述" optional="(选填)">
                <SensTextArea rows={3} defaultValue="这里显示的是描述相关信息" />
              </SensFormItem>
              <div className="form-templates-drawer-production-data-group">
                <SensFormItem label="生产方式" labelAlign="top">
                  <div className="form-templates-drawer-production">
                    <div>目前所选为「业务类指标」且所有计算口径为进组用户数</div>
                    <SensRadioGroup value="retention" options={[{ value: "conversion", label: "转化率" }, { value: "average", label: "人均值" }, { value: "eventAverage", label: "人均事件均值" }, { value: "propertyAverage", label: "人均事件比值" }, { value: "analysis", label: "事件分析" }, { value: "retention", label: "留存分析" }]} />
                    <p className="form-templates-drawer-production-help">业务指标将会在试验业务报告里全部展示</p>
                  </div>
                </SensFormItem>
                <SensFormItem label={null} className="form-templates-drawer-data-panel-item">
                <div className="form-templates-drawer-data-panel">
                <div className="form-templates-drawer-subheading"><span>数据口径</span></div>
                <SensForm layout="horizontal" labelWidth={256} className="form-templates-drawer-retrace-form">
                  <SensFormItem label="分析类型">
                    <SensRadioGroup value="retention" options={[{ value: "retention", label: "留存" }, { value: "churn", label: "流失" }]} />
                  </SensFormItem>
                  <SensFormItem label="维度统计">
                    <SensRadioGroup value="users" options={[{ value: "users", label: "用户数" }, { value: "rate", label: "留存率" }]} />
                  </SensFormItem>
                  <SensFormItem label="事件颗粒度">
                    <Space size={8} align="center"><SensSelectDropdown widthMode="adaptive" options={[{ value: "day", label: "按天" }, { value: "week", label: "按周" }]} defaultValue="day" /><span>第</span><SensInput style={{ width: 72 }} defaultValue="7" /><span>天</span></Space>
                  </SensFormItem>
                  <SensFormItem label="初始行为">
                    <div className="form-templates-drawer-event-control"><SensSelectDropdown widthMode="adaptive" options={[{ value: "trial", label: "试验进组事件" }]} defaultValue="trial" /><SensButton tone="linkWeak" icon={<SensIcon name="add" sizeToken="size/icon/m" color="currentColor" />}>添加筛选</SensButton></div>
                  </SensFormItem>
                  <SensFormItem label="后续行为">
                    <div className="form-templates-drawer-event-control"><SensSelectDropdown widthMode="adaptive" options={[{ value: "search", label: "搜索请求" }]} defaultValue="search" /><SensButton tone="linkWeak" icon={<SensIcon name="add" sizeToken="size/icon/m" color="currentColor" />}>添加筛选</SensButton></div>
                  </SensFormItem>
                </SensForm>
                <div className="form-templates-drawer-filter-lines">
                  <div className="form-templates-drawer-filter-expression">
                    <AndOrConnector />
                    <div className="form-templates-drawer-filter-content">
                      <div className="form-templates-drawer-filter-stack">
                        <div className="form-templates-drawer-filter-row"><SensSelectDropdown widthMode="adaptive" className="form-templates-filter-key" options={[{ value: "country", label: "国家" }]} defaultValue="country" /><SensSelectDropdown widthMode="adaptive" className="form-templates-filter-operator" options={[{ value: "neq", label: "正则不匹配" }]} defaultValue="neq" /><SensSelectDropdown className="form-templates-filter-values" multiDisplay="tags" confirmMultiple={false} options={[{ value: "jp", label: "日本" }, { value: "us", label: "美国" }, { value: "sg", label: "新加坡" }, { value: "kr", label: "韩国" }]} defaultValue={["jp", "us", "sg", "kr"]} /></div>
                        <div className="form-templates-drawer-filter-row"><SensSelectDropdown widthMode="adaptive" className="form-templates-filter-key" options={[{ value: "version", label: "埋点版本" }]} defaultValue="version" /><SensSelectDropdown widthMode="adaptive" className="form-templates-filter-operator" options={[{ value: "eq", label: "等于" }]} defaultValue="eq" /><SensSelectDropdown className="form-templates-filter-values" multiDisplay="tags" confirmMultiple={false} options={[{ value: "v101", label: "1.01" }, { value: "v152", label: "1.52" }, { value: "v179", label: "1.79" }]} defaultValue={["v101", "v152", "v179"]} /></div>
                        <div className="form-templates-drawer-filter-row"><SensSelectDropdown widthMode="adaptive" className="form-templates-filter-key" options={[{ value: "company", label: "企业中文名" }]} defaultValue="company" /><SensSelectDropdown widthMode="adaptive" className="form-templates-filter-operator" options={[{ value: "eq2", label: "等于" }]} defaultValue="eq2" /><SensSelectDropdown className="form-templates-filter-values" multiDisplay="tags" confirmMultiple={false} options={[{ value: "alibaba", label: "阿里巴巴" }, { value: "tencent", label: "腾讯" }, { value: "netease", label: "网易" }]} defaultValue={["alibaba", "tencent", "netease"]} /></div>
                      </div>
                      <div className="form-templates-drawer-filter-global-action">
                        <SensButton tone="linkWeak" icon={<SensIcon name="add" sizeToken="size/icon/m" color="currentColor" />}>添加全局筛选</SensButton>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </SensFormItem>
              </div>
              <SensFormItem label="重要指标" labelAlign="top">
                <div className="form-templates-drawer-important-metric">
                  <div className="form-templates-drawer-important-metric-checkbox">
                    <SensCheckbox aria-label="标记为重要指标" />
                  </div>
                  <div className="form-templates-drawer-important-metric-copy">
                    <div className="form-templates-drawer-important-metric-heading">
                      <span>标记为重要指标</span>
                      <SensTag variant="multicolor" color="yellow" size="small">重要指标</SensTag>
                    </div>
                    <p>当前已有 1 个重要指标，最多允许添加 5 个</p>
                  </div>
                </div>
              </SensFormItem>
            </>
          )}
        </SensForm>
        </div>
      </SensDrawer>
    </section>
  );
}

function PopoverFormTemplate() {
  const [pathOpen, setPathOpen] = useState(false);
  const [parameterOpen, setParameterOpen] = useState(false);
  const [scrollRequest, setScrollRequest] = useState(0);
  const pathFormRef = useRef<HTMLDivElement>(null);
  const pathLink = useRequiredField("input");
  useScrollToFirstFormError(scrollRequest, pathFormRef);

  const submitPath = () => {
    const invalid = pathLink.validateNow();
    if (invalid) setScrollRequest((count) => count + 1);
    else setPathOpen(false);
  };

  return (
    <section className="form-templates-board form-templates-board--popover">
      <TemplateIntro
        title="气泡卡片表单"
        description="用于当前页面内可快速完成的局部配置。中尺寸承载短表单，大尺寸可承载固定标题和可滚动的长内容。"
        rule="表单字段复用基础 Form；浮层只负责点击打开、定位、滚动与轻量操作，不替代抽屉或对话框。"
      />
      <div className="form-templates-popover-form-grid">
        <article className="form-templates-popover-form-case">
          <h3>页面路径编辑</h3>
          <p>中尺寸 · 向下展开 · 错误态与联动字段</p>
          <SensPopover
            size="medium"
            placement="bottom"
            align="start"
            title="页面路径"
            open={pathOpen}
            onOpenChange={setPathOpen}
            style={buildPageTokenVars()}
            content={
              <div ref={pathFormRef}>
              <SensForm className="form-templates-popover-path-form">
                <SensFormItem
                  label="小程序基础链接"
                  labelAlign="top"
                  description="路径支持数字、大小写英文以及部分特殊字符：!#$&'()*+,/:;=?@-._~"
                  error={pathLink.error}
                >
                  <SensInput placeholder="请输入" {...bindRequiredInput(pathLink)} />
                </SensFormItem>
                <SensFormItem className="form-templates-popover-web-item" label="内嵌网页" optional="(选填)" labelAlign="top">
                  <div className="form-templates-popover-web-field">
                    <p>推广小程序内嵌网页时使用，请确保小程序已开发内嵌网页功能、完成神策 SDK 集成与配置，并在下方同时填写内嵌网页参数名称与地址，详见 <SensButton className="form-templates-popover-helper-link" tone="link" size="small">帮助中心</SensButton></p>
                    <div className="form-templates-popover-web-inputs">
                      <SensInput placeholder="请输入参数" />
                      <SensInput placeholder="请输入地址" />
                    </div>
                  </div>
                </SensFormItem>
              </SensForm>
              </div>
            }
            actions={<><SensButton tone="secondary" onClick={() => setPathOpen(false)}>放弃</SensButton><SensButton tone="primary" onClick={submitPath}>提交</SensButton></>}
          >
            <SensButton tone="secondary">编辑页面路径</SensButton>
          </SensPopover>
        </article>
        <article className="form-templates-popover-form-case">
          <h3>App 内参数查看</h3>
          <p>大尺寸 · 向上展开 · 表格内容区滚动</p>
          <SensPopover
            size="large"
            className="form-templates-popover-parameter"
            placement="top"
            align="end"
            style={{ "--sens-popover-width": "726px", ...buildPageTokenVars() } as CSSProperties}
            title="配置步骤"
            open={parameterOpen}
            onOpenChange={setParameterOpen}
            content={
              <div className="form-templates-popover-parameter-content">
                <div className="form-templates-popover-parameter-heading">
                  <div className="form-templates-popover-parameter-title">App 内参数</div>
                  <p className="form-templates-popover-parameter-help">该物品属性在以下策略中正在使用，请解除使用后再删除</p>
                </div>
                <TableShell
                  total={5}
                  className="form-templates-popover-parameter-table"
                  columns={appParameterColumns}
                  dataSource={appParameterRows}
                  pagination={false}
                  tableLayout="fixed"
                  scroll={{ y: 292 }}
                  footerBar={
                    <>
                      <span className="sens-table-footer-left">本页显示第 1-10 条</span>
                      <div className="sens-table-footer-right">
                        <SensPagination
                          current={1}
                          pageSize={10}
                          total={20}
                          showSizeChanger
                          aria-label="App 内参数分页"
                        />
                      </div>
                    </>
                  }
                />
              </div>
            }
          >
            <SensButton tone="secondary">查看 App 内参数</SensButton>
          </SensPopover>
        </article>
      </div>
    </section>
  );
}

function findScrollParents(start: HTMLElement | null): Array<HTMLElement | Window> {
  const parents: Array<HTMLElement | Window> = [window];
  let node: HTMLElement | null = start;
  while (node && node !== document.body) {
    const style = getComputedStyle(node);
    const overflowY = style.overflowY;
    if (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") {
      parents.push(node);
    }
    node = node.parentElement;
  }
  return parents;
}

/** 通栏灰条 / 通栏卡右缘 → 锚点视觉左缘固定 16；扣掉白板右内边距和描边，避免量到 17。 */
function syncAnchorFormReserve(
  board: HTMLElement,
  displayMode: "fixed" | "float" | "push",
  anchorExpanded: boolean,
) {
  if (displayMode === "float" && anchorExpanded) {
    board.style.setProperty("--form-templates-anchor-reserve", "0px");
    return;
  }
  const side = document.querySelector(".form-templates-anchor-side--portal");
  if (!(side instanceof HTMLElement)) return;
  const inlineGap = getUnitToken("spacing/horizontal/4x");
  const sideRect = side.getBoundingClientRect();
  const sideW = sideRect.width || 24;
  const visual =
    side.querySelector(".sens-anchor-rail") ||
    side.querySelector(".sens-anchor-active-mark") ||
    side.querySelector(".sens-anchor-collapse-button") ||
    side;
  const visualInset = Math.max(0, visual.getBoundingClientRect().left - sideRect.left);
  const boardStyle = getComputedStyle(board);
  const boardPadRight = Number.parseFloat(boardStyle.paddingRight) || 0;
  const boardBorderRight = Number.parseFloat(boardStyle.borderRightWidth) || 0;
  board.style.setProperty(
    "--form-templates-anchor-reserve",
    `${Math.max(0, sideW - visualInset + inlineGap - boardPadRight - boardBorderRight)}px`,
  );
}

function AnchorFormTemplate() {
  const [activeKey, setActiveKey] = useState("basic");
  const [displayMode, setDisplayMode] = useState<"fixed" | "float" | "push">("fixed");
  const [anchorExpanded, setAnchorExpanded] = useState(false);
  const [anchorPinStyle, setAnchorPinStyle] = useState<CSSProperties | undefined>();
  const [triggerMode, setTriggerMode] = useState("event");
  const [channels, setChannels] = useState<string[]>(["email", "webhook"]);
  const [scrollRequest, setScrollRequest] = useState(0);
  const formRootRef = useRef<HTMLDivElement>(null);
  const ruleName = useRequiredField("input", "DAU 异常波动告警");
  useScrollToFirstFormError(scrollRequest, formRootRef);

  const submitForm = () => {
    ruleName.validateNow();
    setScrollRequest((count) => count + 1);
  };

  useLayoutEffect(() => {
    const content = document.querySelector(".ant-layout-content");
    const board = document.querySelector(".form-templates-board--anchor");
    if (!(content instanceof HTMLElement) || !(board instanceof HTMLElement)) return;

    const pinGap = getUnitToken("spacing/vertical/4x");

    const sync = () => {
      const contentRect = content.getBoundingClientRect();
      const boardRect = board.getBoundingClientRect();
      const grayTitle = document.querySelector(
        ".form-templates-board--anchor #form-templates-anchor-basic .sens-section-title",
      );
      const grayRect = grayTitle?.getBoundingClientRect();
      // 与灰背景标题顶对齐；滚出后夹在内容区顶 + 16
      const alignedTop = grayRect?.top ?? contentRect.top + pinGap;
      const top = Math.max(contentRect.top + pinGap, alignedTop);
      const viewportWidth = document.documentElement.clientWidth;
      // 右对齐贴白板：右边距 0
      setAnchorPinStyle({
        position: "fixed",
        top,
        right: Math.max(0, viewportWidth - boardRect.right),
        left: "auto",
        zIndex: 900,
        width: "max-content",
        pointerEvents: "none",
      });

      syncAnchorFormReserve(board, displayMode, anchorExpanded);
    };

    sync();
    const raf = window.requestAnimationFrame(sync);

    const scrollParents = findScrollParents(content);
    for (const parent of scrollParents) {
      parent.addEventListener("scroll", sync, { passive: true });
    }
    window.addEventListener("resize", sync);
    const observer = new ResizeObserver(sync);
    observer.observe(content);
    observer.observe(board);
    const grayTitle = document.querySelector(
      ".form-templates-board--anchor #form-templates-anchor-basic .sens-section-title",
    );
    if (grayTitle instanceof HTMLElement) observer.observe(grayTitle);

    return () => {
      window.cancelAnimationFrame(raf);
      for (const parent of scrollParents) {
        parent.removeEventListener("scroll", sync);
      }
      window.removeEventListener("resize", sync);
      observer.disconnect();
      board.style.removeProperty("--form-templates-anchor-reserve");
    };
  }, [displayMode, anchorExpanded]);

  useLayoutEffect(() => {
    const board = document.querySelector(".form-templates-board--anchor");
    const side = document.querySelector(".form-templates-anchor-side--portal");
    if (!(board instanceof HTMLElement) || !(side instanceof HTMLElement)) return;
    const syncReserve = () => syncAnchorFormReserve(board, displayMode, anchorExpanded);
    syncReserve();
    const observer = new ResizeObserver(syncReserve);
    observer.observe(side);
    return () => observer.disconnect();
  }, [displayMode, anchorExpanded, anchorPinStyle]);

  const handleAnchorChange = (key: string) => {
    setActiveKey(key);
    const target = document.getElementById(`form-templates-anchor-${key}`);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDisplayModeChange = (next: "fixed" | "float" | "push") => {
    setDisplayMode(next);
    setAnchorExpanded(false);
  };

  const layoutClass = [
    "form-templates-anchor-layout",
    displayMode === "float" ? "form-templates-anchor-layout--float" : "",
    displayMode === "fixed" ? "form-templates-anchor-layout--fixed" : "",
    displayMode === "push" ? "form-templates-anchor-layout--push" : "",
    displayMode === "float" && anchorExpanded ? "is-expanded" : "",
    displayMode === "float" && !anchorExpanded ? "is-collapsed" : "",
    displayMode === "push" && anchorExpanded ? "is-expanded" : "",
    displayMode === "push" && !anchorExpanded ? "is-collapsed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const portalAnchor =
    anchorPinStyle && typeof document !== "undefined"
      ? createPortal(
          <aside
            className="form-templates-anchor-side form-templates-anchor-side--portal"
            aria-label="表单分组锚点"
            style={anchorPinStyle}
          >
            {displayMode === "fixed" ? (
              <SensAnchor items={ANCHOR_FORM_ITEMS} mode="fixed" activeKey={activeKey} onChange={handleAnchorChange} />
            ) : null}
            {displayMode === "float" ? (
              <SensAnchor
                items={ANCHOR_FORM_ITEMS}
                mode="popover"
                defaultExpanded={false}
                expanded={anchorExpanded}
                activeKey={activeKey}
                onChange={handleAnchorChange}
                onExpandedChange={setAnchorExpanded}
              />
            ) : null}
            {displayMode === "push" ? (
              <SensAnchor
                items={ANCHOR_FORM_ITEMS}
                mode="push"
                defaultExpanded={false}
                expanded={anchorExpanded}
                activeKey={activeKey}
                onChange={handleAnchorChange}
                onExpandedChange={setAnchorExpanded}
              />
            ) : null}
          </aside>,
          document.body,
        )
      : null;

  return (
    <section className="form-templates-board form-templates-board--anchor">
      <TemplateIntro
        title="带锚点表单"
        description="页面级长表单用右侧纵向锚点做分组导航。支持常驻、点击悬浮、点击挤压三种展示；点击锚点项只切换高亮并滚动，不接入路由或业务提交。"
        rule="常驻/挤压占位：灰标题↔锚点视觉左缘 16，右边距 0。点击悬浮展开为叠层遮盖（不挤主列）；收起条仍让位。与灰标题顶对齐；portal 防滚走。"
      />
      <div className="form-templates-toolbar">
        <span>锚点展示</span>
        <div className="form-templates-layout-actions">
          {(
            [
              { key: "fixed", label: "常驻" },
              { key: "float", label: "点击悬浮" },
              { key: "push", label: "点击挤压" },
            ] as const
          ).map((option) => (
            <SensButton
              key={option.key}
              size="small"
              tone={displayMode === option.key ? "primary" : "secondary"}
              onClick={() => handleDisplayModeChange(option.key)}
            >
              {option.label}
            </SensButton>
          ))}
        </div>
      </div>
      <div className={layoutClass}>
        <div className="form-templates-anchor-main" ref={formRootRef}>
          <SensForm className="form-templates-form form-templates-anchor-form">
            <div className="form-templates-section-block" id="form-templates-anchor-basic">
              <SensSectionTitle title="规则基本信息" description="用于标识规则身份与可读说明" />
              <div className="sens-form-group-content">
                <SensFormItem label="规则名称" labelHelp="展示在报警通知与规则列表中" required error={ruleName.error}>
                  <SensInput placeholder="请输入" {...bindRequiredInput(ruleName)} />
                </SensFormItem>
                <SensFormItem label="规则说明" optional="(选填)" description="建议写清监控对象、阈值与响应预期">
                  <SensTextArea rows={3} defaultValue="当核心指标连续异常时通知值班同学，便于快速确认是否需要扩容或回滚。" />
                </SensFormItem>
                <SensFormItem label="规则标签" optional="(选填)">
                  <div className="form-templates-anchor-tags">
                    <SensTag variant="multicolor" color="blue" size="small">
                      核心业务
                    </SensTag>
                    <SensTag variant="multicolor" color="yellow" size="small">
                      P1
                    </SensTag>
                    <SensButton tone="linkWeak" icon={<SensIcon name="add" sizeToken="size/icon/m" color="currentColor" />}>
                      添加标签
                    </SensButton>
                  </div>
                </SensFormItem>
              </div>
            </div>

            <div className="form-templates-section-block" id="form-templates-anchor-trigger">
              <SensSectionTitle title="触发条件" description="配置何时进入报警判定" />
              <div className="sens-form-group-content">
                <SensFormItem label="触发方式" labelAlign="top">
                  <SensRadioGroup
                    value={triggerMode}
                    onChange={setTriggerMode}
                    itemHeight="content"
                    options={[
                      { value: "event", label: "事件触发", description: "基于指定埋点事件及筛选条件判定" },
                      { value: "metric", label: "指标触发", description: "基于指标阈值与时间窗口判定" },
                    ]}
                  />
                </SensFormItem>
                <SensFormItem label="条件配置" labelAlign="top" className="form-templates-full-bleed-item">
                  <div className="form-templates-outline-card">
                    <div className="form-templates-anchor-card-heading">
                      <h4 className="form-templates-anchor-card-title">事件条件</h4>
                      <p className="form-templates-anchor-card-help">单一内容组使用 14px 组标题，不再套灰条</p>
                    </div>
                    <div className="form-templates-drawer-event-control">
                      <SensSelectDropdown
                        widthMode="adaptive"
                        options={[
                          { value: "dau", label: "日活跃用户数波动" },
                          { value: "crash", label: "崩溃率超阈值" },
                        ]}
                        defaultValue="dau"
                      />
                      <SensButton tone="linkWeak" icon={<SensIcon name="add" sizeToken="size/icon/m" color="currentColor" />}>
                        添加筛选
                      </SensButton>
                    </div>
                    <div className="form-templates-anchor-divider" />
                    <SensFormItem label="判定窗口" layout="vertical" description="连续异常达到窗口长度后触发">
                      <SensSelectDropdown
                        className="form-templates-select"
                        options={[
                          { value: "5m", label: "近 5 分钟" },
                          { value: "15m", label: "近 15 分钟" },
                          { value: "1h", label: "近 1 小时" },
                        ]}
                        defaultValue="15m"
                      />
                    </SensFormItem>
                  </div>
                </SensFormItem>
              </div>
            </div>

            <div className="form-templates-section-block" id="form-templates-anchor-alarm">
              <SensSectionTitle title="报警方式和疲劳度控制" description="控制通知渠道与重复打扰频率" />
              <div className="sens-form-group-content">
                <SensFormItem label="报警方式" labelAlign="top" description="至少选择一种通知渠道">
                  <SensCheckboxGroup
                    value={channels}
                    onChange={setChannels}
                    options={[
                      { value: "email", label: "邮件" },
                      { value: "webhook", label: "Webhook" },
                      { value: "sms", label: "短信" },
                    ]}
                  />
                </SensFormItem>
                <SensFormItem label="疲劳度" labelAlign="top" className="form-templates-full-bleed-item">
                  <div className="form-templates-muted-card form-templates-muted-card--stack">
                    <h4 className="form-templates-anchor-card-title">静默与合并</h4>
                    <SensFormItem label="静默时长" layout="vertical" description="同一规则在静默期内不再重复发送">
                      <SensSelectDropdown
                        className="form-templates-select"
                        options={[
                          { value: "30m", label: "30 分钟" },
                          { value: "2h", label: "2 小时" },
                          { value: "1d", label: "1 天" },
                        ]}
                        defaultValue="2h"
                      />
                    </SensFormItem>
                    <SensFormItem label="合并通知" layout="vertical">
                      <div className="form-templates-anchor-inline-check">
                        <SensCheckbox defaultChecked aria-label="合并同类通知" />
                        <span>将同类报警合并为一条通知</span>
                      </div>
                    </SensFormItem>
                  </div>
                </SensFormItem>
              </div>
            </div>
          </SensForm>
          <SensFormActions className="form-templates-actions">
            <SensButton tone="secondary">取消</SensButton>
            <SensButton tone="primary" onClick={submitForm}>保存规则</SensButton>
          </SensFormActions>
        </div>
      </div>
      {portalAnchor}
    </section>
  );
}

function StepFormTemplate() {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState([false, false, false, false]);
  const [errors, setErrors] = useState([false, false, false, false]);
  const [scrollRequest, setScrollRequest] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const ruleName = useRequiredField("input");
  const strategy = useRequiredField("select");
  useScrollToFirstFormError(scrollRequest, panelRef, step);
  const stepMeta = [
    { key: "basic", title: "基本信息" },
    { key: "recall", title: "召回规则" },
    { key: "sort", title: "排序规则" },
    { key: "exclude", title: "排除规则" },
  ];
  const lastIndex = stepMeta.length - 1;
  const stepItems: SensStepItem[] = stepMeta.map((item, index) => ({
    ...item,
    error: errors[index],
    completed: completed[index],
  }));

  const validateStepZero = () => {
    const nameErr = ruleName.validateNow();
    const strategyErr = strategy.validateNow();
    return Boolean(nameErr || strategyErr);
  };

  const markStepZeroError = (invalid: boolean) => {
    setErrors((prev) => prev.map((value, index) => (index === 0 ? invalid : value)));
  };

  const goNext = () => {
    if (step === 0) {
      const invalid = validateStepZero();
      markStepZeroError(invalid);
      if (!invalid) {
        setCompleted((prev) => prev.map((value, index) => (index === 0 ? true : value)));
      }
    } else if (!errors[step]) {
      setCompleted((prev) => prev.map((value, index) => (index === step ? true : value)));
    }
    setStep((prev) => Math.min(prev + 1, lastIndex));
  };

  const goPrev = () => {
    if (step === 0) markStepZeroError(validateStepZero());
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const changeStep = (nextStep: number) => {
    if (step === 0) markStepZeroError(validateStepZero());
    setStep(nextStep);
  };

  const submitForm = () => {
    const stepZeroInvalid = validateStepZero();
    const nextErrors = errors.map((value, index) => {
      if (index === 0) return stepZeroInvalid;
      return completed[index] ? true : value;
    });
    setErrors(nextErrors);
    const firstErrorStep = nextErrors.findIndex(Boolean);
    if (firstErrorStep >= 0) {
      setStep(firstErrorStep);
      setScrollRequest((count) => count + 1);
    }
  };

  return (
    <section className="form-templates-board form-templates-board--steps">
      <TemplateIntro
        title="分步表单"
        description="将长表单拆分为连续步骤，每一步独立承载字段和校验结果。"
        rule="步骤条、下一步、上一步都能换步。未完成带着错误离开：等待 + 红色数字。整表提交打回已完成步骤：已完成 + 红色对勾。"
      />
      <div className="form-templates-steps-preview">
        <SensSteps items={stepItems} current={step} onChange={changeStep} />
      </div>
      {step === 0 ? (
        <div className="form-templates-steps-panel" ref={panelRef}>
          <SensForm layout="vertical">
            <SensFormItem label="规则名称" required error={ruleName.error}>
              <SensInput
                value={ruleName.value}
                onChange={(event) => ruleName.onChange(event.target.value)}
                onBlur={ruleName.onBlur}
                placeholder="请输入"
                status={ruleName.status}
              />
            </SensFormItem>
            <SensFormItem label="备注">
              <SensInput placeholder="请输入" />
            </SensFormItem>
            <SensFormItem label="策略类型" required error={strategy.error}>
              <SensSelectDropdown
                widthMode="adaptive"
                value={strategy.value || undefined}
                onChange={(next) => strategy.onChange(String(next ?? ""))}
                onBlur={strategy.onBlur}
                onOpenChange={(open) => {
                  if (!open) strategy.onBlur();
                }}
                placeholder="请选择"
                status={strategy.status}
                options={[
                  { value: "strategy", label: "推荐策略" },
                  { value: "experiment", label: "实验策略" },
                ]}
              />
            </SensFormItem>
            <SensFormItem label="说明">
              <SensInput placeholder="请输入" />
            </SensFormItem>
          </SensForm>
          <SensFormActions className="form-templates-steps-actions">
            <SensButton tone="secondary">取消</SensButton>
            <SensButton tone="primary" onClick={goNext}>下一步</SensButton>
          </SensFormActions>
        </div>
      ) : (
        <div className="form-templates-steps-panel form-templates-steps-panel--recall" ref={panelRef}>
          <div className="form-templates-steps-heading">
            <SensSectionTitle
              variant="productLine"
              title="选择可推物品"
              description="添加物品属性筛选条件和截取方式，确定可推物品范围"
            />
          </div>
          <div className="form-templates-steps-condition-card">
            <div className="form-templates-steps-condition-title">可推物品的物品属性满足</div>
            <SensRadioGroup value="custom" options={[{ value: "custom", label: "自定义筛选" }, { value: "all", label: "全部物品" }]} />
            <div className="form-templates-steps-condition-list">
              <AndOrConnector />
              {[
                ["国家", "等于", ["日本", "美国"]],
                ["埋点版本", "等于", ["1.01", "1.52", "1.79"]],
              ].map(([field, operator, values]) => (
                <div className="form-templates-steps-condition-row" key={String(field)}>
                  <SensSelectDropdown widthMode="adaptive" options={[{ value: String(field), label: String(field) }]} defaultValue={String(field)} />
                  <SensSelectDropdown widthMode="adaptive" options={[{ value: String(operator), label: String(operator) }]} defaultValue={String(operator)} />
                  <SensSelectDropdown multiDisplay="tags" confirmMultiple={false} options={(values as string[]).map((value) => ({ value, label: value }))} defaultValue={values as string[]} />
                </div>
              ))}
            </div>
            <SensButton tone="linkWeak" icon={<SensIcon name="add" sizeToken="size/icon/m" color="currentColor" />}>添加物品属性</SensButton>
          </div>
          <div className="form-templates-steps-heading form-templates-steps-heading--backfill">
            <SensSectionTitle
              variant="productLine"
              title="补齐规则"
              optional="(选填)"
              description="如按以上筛选条件选出的物品数，仍不满足推荐结果数的要求，则按以下规则对推荐结果补齐"
            />
          </div>
          <div className="form-templates-steps-backfill-body">
            <div className="form-templates-steps-condition-card form-templates-steps-backfill-card">
              <div className="form-templates-steps-backfill-section">
                <div className="form-templates-steps-condition-title">可推物品的物品属性满足</div>
                <SensRadioGroup value="custom" options={[{ value: "custom", label: "自定义筛选" }, { value: "all", label: "全部物品" }]} />
                <div className="form-templates-steps-condition-list">
                  <AndOrConnector />
                  {["backfill-1", "backfill-2"].map((rowKey) => (
                    <div className="form-templates-steps-condition-row form-templates-steps-condition-row--backfill" key={rowKey}>
                      <div className="form-templates-steps-control-sm">
                        <SensSelectDropdown options={[{ value: "fund_type", label: "fund_type" }]} defaultValue="fund_type" />
                      </div>
                      <SensSelectDropdown widthMode="adaptive" options={[{ value: "eq", label: "等于" }]} defaultValue="eq" />
                      <div className="form-templates-combo-field">
                        <SensSelectDropdown options={[{ value: "attr", label: "物品属性值" }]} defaultValue="attr" />
                        <SensInput defaultValue="2" aria-label="物品属性数值" />
                      </div>
                    </div>
                  ))}
                </div>
                <SensButton tone="linkWeak" icon={<SensIcon name="add" sizeToken="size/icon/m" color="currentColor" />}>添加物品条件</SensButton>
              </div>
              <div className="form-templates-steps-backfill-section">
                <div className="form-templates-steps-condition-title-row">
                  <div className="form-templates-steps-condition-title">截取及排序方式</div>
                  <FieldHelpIcon tip="按指定物品属性排序后，截取固定条数作为补齐结果" />
                </div>
                <div className="form-templates-steps-sort-row">
                  <div className="form-templates-steps-control-sm">
                    <SensSelectDropdown options={[{ value: "fund_type", label: "fund_type" }]} defaultValue="fund_type" />
                  </div>
                  <div className="form-templates-steps-control-sm">
                    <SensSelectDropdown options={[{ value: "desc", label: "从大到小" }]} defaultValue="desc" />
                  </div>
                  <span>截取</span>
                  <div className="form-templates-steps-control-sm">
                    <SensInput defaultValue="100" aria-label="截取条数" />
                  </div>
                  <span>条</span>
                </div>
              </div>
            </div>
            <SensCheckbox
              defaultChecked
              helpIcon={<FieldHelpIcon tip="开启后，当补齐规则仍无法凑满推荐结果数时，用随机物品补齐" stopToggle />}
            >
              满足以上条件推荐结果仍不足时，出随机推荐结果
            </SensCheckbox>
          </div>
          <SensFormActions className="form-templates-steps-actions">
            <SensButton tone="secondary" onClick={goPrev}>上一步</SensButton>
            {step < lastIndex ? (
              <SensButton tone="primary" onClick={goNext}>下一步</SensButton>
            ) : (
              <SensButton tone="primary" onClick={submitForm}>提交</SensButton>
            )}
          </SensFormActions>
        </div>
      )}
    </section>
  );
}

export default function FormTemplatesPage() {
  const [active, setActive] = useState<TemplateKey>("table");

  return (
    <main className="form-templates-page" style={buildPageTokenVars()}>
      <header className="form-templates-header">
        <span>Composite Form / P1</span>
        <h1>复合表单</h1>
        <p>沉淀可跨业务复用的表单组合模式。基础组件规则仍回到 Form、Table、Radio、Checkbox、Title 等组件页维护。</p>
      </header>
      <TemplateSwitch active={active} onChange={setActive} />
      {active === "table" ? <TableFormTemplate /> : null}
      {active === "linked" ? <LinkedFormTemplate /> : null}
      {active === "card" ? <CardFormTemplate /> : null}
      {active === "drawer" ? <DrawerFormTemplate /> : null}
      {active === "popover" ? <PopoverFormTemplate /> : null}
      {active === "anchor" ? <AnchorFormTemplate /> : null}
      {active === "steps" ? <StepFormTemplate /> : null}
    </main>
  );
}
