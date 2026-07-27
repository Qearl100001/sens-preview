import { useState, type CSSProperties } from "react";
import type { ColumnsType } from "antd/es/table";
import { getColorToken, tokenRgba } from "../../design-system/color-utils";
import { getDividerColor, getDividerHairlineWidth } from "../../design-system/divider";
import { getTypographyToken } from "../../design-system/typography";
import { getUnitToken } from "../../design-system/unit";
import {
  SensButton,
  SensCheckboxGroup,
  SensForm,
  SensFormActions,
  SensFormItem,
  SensInput,
  SensRadioGroup,
  SensSelectDropdown,
  SensSectionTitle,
  TableShell,
} from "../../ui";
import "./form-templates.css";

type TemplateKey = "table" | "linked" | "card";

interface AttributeRow {
  key: string;
  name: string;
  type: string;
  source: string;
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

function px(value: number): string {
  return `${value}px`;
}

function buildPageTokenVars(): CSSProperties {
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
    "--form-templates-table-form-padding-inline": px(getUnitToken("spacing/horizontal/4x")),
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
  } as CSSProperties;
}

function TemplateSwitch({ active, onChange }: { active: TemplateKey; onChange: (key: TemplateKey) => void }) {
  const items: Array<{ key: TemplateKey; label: string }> = [
    { key: "table", label: "带表格表单" },
    { key: "linked", label: "联动表单" },
    { key: "card", label: "卡片表单" },
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

  return (
    <section className="form-templates-board form-templates-board--table">
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
        <SensFormItem label="模型名称" optional="(选填)">
          <SensInput defaultValue="用户事件模型" />
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
        <SensButton tone="primary">提交</SensButton>
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

  return (
    <section className="form-templates-linked-layout">
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
                  { value: "once", label: "展示一次", description: "同一用户仅展示一次。" },
                  { value: "repeat", label: "展示多次", description: "按业务设置的频次继续展示。" },
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
                    { value: "all", label: "全部用户", description: "不需要额外选择范围。" },
                    { value: "specified", label: "指定用户", description: "选择一个用户分群作为触达范围。" },
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
                    <SensSectionTitle title="指定用户分群" />
                    <div className="sens-form-group-content">
                      <SensFormItem label="用户分群" layout={layout}>
                        <SensSelectDropdown
                          className="form-templates-select"
                          placeholder="请选择用户分群"
                          options={[
                            { value: "high-value", label: "高价值用户" },
                            { value: "recent", label: "最近活跃用户" },
                          ]}
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
                    { value: "push", label: "站内通知", description: "在产品内向用户展示通知。" },
                    { value: "email", label: "邮件通知", description: "通过已验证邮箱发送提醒。" },
                  ]}
                />
                {channels.includes("email") ? (
                  <div className="form-templates-muted-card form-templates-muted-card--stack">
                    <h4>邮件发送配置</h4>
                    <SensFormItem label="邮件主题" layout={layout}>
                      <SensInput placeholder="请输入邮件主题" />
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
                  <p className="form-templates-linked-result">已选择指定用户：后续操作仅对所选用户分群生效。</p>
                ) : null}
              </div>
            </SensFormItem>
          </SensForm>
        </article>
      </div>
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
  const [matchMode, setMatchMode] = useState("any");
  const [cardAudience, setCardAudience] = useState("specified");

  return (
    <section className="form-templates-board">
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
                <SensFormItem label="规则名称">
                  <SensInput placeholder="请输入规则名称" />
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
                <SensSectionTitle title="事件卡片" size="small" />
                <div className="sens-form-group-content">
                  <SensFormItem label="事件名称" layout="vertical">
                    <SensInput placeholder="请输入事件名称" />
                  </SensFormItem>
                  <SensFormItem label="事件类型" layout="vertical">
                    <SensSelectDropdown
                      className="form-templates-select"
                      placeholder="请选择事件类型"
                      options={[
                        { value: "track", label: "埋点事件" },
                        { value: "business", label: "业务事件" },
                      ]}
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
            <SensFormItem label="用户范围">
              <SensRadioGroup value={cardAudience} onChange={setCardAudience} options={audienceOptions} />
            </SensFormItem>
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
          </SensForm>
        </article>
      </div>
      <SensFormActions className="form-templates-actions">
        <SensButton tone="primary">保存规则</SensButton>
        <SensButton tone="secondary">取消</SensButton>
      </SensFormActions>
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
    </main>
  );
}
