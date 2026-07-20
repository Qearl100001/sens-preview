import { useState, type CSSProperties } from "react";
import { Segmented, Space, Switch, Typography } from "antd";
import { tokenRgba } from "../../design-system/color-utils";
import formDesignDoc from "../../design-system/components/base/form.design.md?raw";
import formDevDoc from "../../design-system/components/base/form.md?raw";
import { getTypographyToken } from "../../design-system/typography";
import { getUnitToken } from "../../design-system/unit";
import {
  SensButton,
  SensCheckboxGroup,
  SensForm,
  SensFormActions,
  SensFormItem,
  SensInput,
  SensInputNumber,
  SensRadioGroup,
  SensSectionTitle,
  SensTextArea,
  type SensFormLayout,
} from "../../ui";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";

const { Text } = Typography;

function px(value: number): string {
  return `${value}px`;
}

function buildGroupingPreviewVars(): CSSProperties {
  return {
    "--sens-form-group-title-l-size": px(getTypographyToken("font-size/l")),
    "--sens-form-group-title-l-line": px(getTypographyToken("line-height/l")),
    "--sens-form-group-title-l-weight": getTypographyToken("font-weight/semibold"),
    "--sens-form-card-outline": tokenRgba("outline-color-transparent", 0.12),
  } as CSSProperties;
}
const verticalSpacingRules = [
  {
    value: "40px",
    token: "spacing/vertical/10x",
    title: "二级标题分组之间；内容区到页脚按钮区",
    description: "用于拉开大分组或表单主体与底部操作区，是表单页面最大的纵向节奏。",
  },
  {
    value: "28px",
    token: "spacing/vertical/7x",
    title: "三级标题分组之间",
    description: "用于同一二级分组内的三级分组切换，弱于 40px，但大于普通表单项。",
  },
  {
    value: "20px",
    token: "spacing/vertical/5x",
    title: "表单项 / 组件和组件之间",
    description: "用于普通表单项之间；不覆盖辅助文案、报错、联动控件等基础表达式内部间距。",
  },
  {
    value: "16px",
    token: "spacing/vertical/4x / spacing/horizontal/4x",
    title: "标题栏、tab、分割线、Alert 到内容区；左右布局标题到控件",
    description: "用于内容区和上层结构之间的默认距离，也用于左右布局的标题列到控件列。",
  },
  {
    value: "8px",
    token: "spacing/vertical/2x / spacing/horizontal/2x",
    title: "上下布局标题到控件；联动组件之间；组件多排",
    description: "用于字段内部的组件级关系，比如选择器与输入框、控件与单位、上下标题与控件。",
  },
  {
    value: "4px",
    token: "spacing/vertical/1x / spacing/horizontal/1x",
    title: "辅助文案 / 报错到关联内容；图标到文字",
    description: "用于最小表达式内部的贴近关系，不用于两个独立组件之间。",
  },
];

const horizontalSpacingRules = [
  {
    value: "24px",
    token: "spacing/horizontal/6x",
    title: "组件与组件之间",
    description: "用于横向并列的独立组件或组件区块之间，不用于同一字段内部的联动表达式。",
  },
  {
    value: "16px",
    token: "spacing/horizontal/4x",
    title: "四级标题到组件；按钮之间；卡片之间；分割线之间",
    description: "用于表单横向结构里的主要关系，也作为表单操作区按钮之间的默认间距。",
  },
  {
    value: "8px",
    token: "spacing/horizontal/2x",
    title: "辅助文案 / 正文到内容；联动组件之间",
    description: "用于同一字段内部的近邻关系，例如选择器 + 输入框、控件 + 单位。",
  },
  {
    value: "4px",
    token: "spacing/horizontal/1x",
    title: "图标到内容",
    description: "用于 help、delete、error 等图标与文字或控件之间的贴近关系。",
  },
];

function FormGroupingPreview() {
  return (
    <SensForm className="sens-form-grouping-board" style={buildGroupingPreviewVars()}>
      <div className="sens-form-rule-card-title">分组规则 · 层级示意</div>
      <p className="sens-form-grouping-note">
        来源 Figma `69:26542`。顶层 16px + 灰条用 `SensSectionTitle`；第二层 16px 无灰条、第三层 14px
        直接用 `font-size/l` / `font-size/m` token。白描边卡内可再套灰底卡；灰卡内标题仅 14px。
      </p>
      <div className="sens-form-grouping-token-row">
        <span>{`font-size/l = ${getTypographyToken("font-size/l")}`}</span>
        <span>{`font-size/m = ${getTypographyToken("font-size/m")}`}</span>
        <span>{`spacing/vertical/10x = ${getUnitToken("spacing/vertical/10x")}`}</span>
        <span>{`spacing/vertical/7x = ${getUnitToken("spacing/vertical/7x")}`}</span>
      </div>

      <div className="sens-form-grouping-stack">
        <SensSectionTitle title="顶层分组标题" description="16px + 灰条 · font-size/l" />

        <div className="sens-form-grouping-block">
          <h3 className="sens-form-grouping-level2">第二层分组标题</h3>
          <div className="sens-form-grouping-fields">
            <SensFormItem label="字段标题">
              <SensInput placeholder="挂在第二层下的字段" style={{ width: "100%" }} />
            </SensFormItem>
          </div>
        </div>

        <div className="sens-form-grouping-block">
          <h4 className="sens-form-grouping-level3">第三层分组标题</h4>
          <div className="sens-form-grouping-fields">
            <SensFormItem label="字段标题">
              <SensInput placeholder="挂在第三层下的字段" style={{ width: "100%" }} />
            </SensFormItem>
          </div>
        </div>

        <div className="sens-form-grouping-card-outline">
          <SensSectionTitle title="白卡内重置 · 顶层" description="灰条可重置分组树" />
          <h3 className="sens-form-grouping-level2">白卡内第二层（16 · font-size/l）</h3>
          <div className="sens-form-grouping-card-muted">
            <h4 className="sens-form-grouping-level3">灰底卡内标题（仅 14 · font-size/m）</h4>
            <SensFormItem label="字段标题">
              <SensInput placeholder="灰卡内字段；不可再套白描边卡" style={{ width: "100%" }} />
            </SensFormItem>
          </div>
        </div>
      </div>
    </SensForm>
  );
}

function FormDemo() {
  const [layout, setLayout] = useState<SensFormLayout>("vertical");
  const [showError, setShowError] = useState(true);
  const [radioValue, setRadioValue] = useState("all");
  const [checkboxValue, setCheckboxValue] = useState(["overview", "report"]);

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <FormGroupingPreview />

      <Space wrap align="end" size="middle">
        <Space direction="vertical" size={4}>
          <Text type="secondary">布局</Text>
          <Segmented
            value={layout}
            onChange={(value) => setLayout(value as SensFormLayout)}
            options={[
              { label: "上下布局", value: "vertical" },
              { label: "左右布局", value: "horizontal" },
            ]}
          />
        </Space>
        <Space direction="vertical" size={4}>
          <Text type="secondary">报错</Text>
          <Switch checked={showError} onChange={setShowError} />
        </Space>
      </Space>

      <SensForm layout={layout}>
        <SensFormItem
          label="规则名称"
          required
          description="名称用于识别当前规则，建议保持业务语义清晰。"
          error={showError ? "请输入规则名称" : undefined}
          counter="8/60"
        >
          <SensInput
            defaultValue={showError ? "" : "智能运营计划"}
            placeholder="请输入"
            status={showError ? "error" : undefined}
            style={{ width: "100%" }}
          />
        </SensFormItem>
        <SensFormItem label="执行次数" controlExtra="次">
          <SensInputNumber defaultValue={10} style={{ width: "100%" }} />
        </SensFormItem>
        <SensFormItem label="推送范围" labelHelp="选择用户生效范围" optional="(选填)" description="表单内的单选组直接复用基础单选组件。">
          <SensRadioGroup
            value={radioValue}
            onChange={setRadioValue}
            options={[
              { value: "all", label: "全部用户" },
              { value: "target", label: "指定用户" },
              { value: "rule", label: "规则圈选" },
            ]}
          />
        </SensFormItem>
        <SensFormItem label="可见模块" description="表单内的复选组直接复用基础复选框组件。">
          <SensCheckboxGroup
            value={checkboxValue}
            onChange={setCheckboxValue}
            options={[
              { value: "overview", label: "概览" },
              { value: "report", label: "报表" },
              { value: "analysis", label: "分析" },
            ]}
          />
        </SensFormItem>
        <SensFormActions alignWithControl={layout === "horizontal"}>
          <SensButton tone="primary">提交</SensButton>
          <SensButton>取消</SensButton>
        </SensFormActions>
      </SensForm>

      <Text type="secondary">表单页只沉淀布局、间距、标题和校验骨架；具体录入控件仍回到各基础组件规则。</Text>
    </Space>
  );
}

function FormRulesPreview() {
  return (
    <SensForm className="sens-form-rules-board">
      <div className="sens-form-rule-card">
        <FormGroupingPreview />
      </div>
      <div className="sens-form-rule-card sens-form-rule-card--muted">
        <div className="sens-form-rule-card-title">纵向间距层级</div>
        <div className="sens-form-rule-card-text">
          来源于 Figma `1.3 间距` 的纵向表单间距：先判断分组层级，再判断内容区关系，最后判断表单项和基础表达式内部关系。
        </div>
        <div className="sens-form-spacing-ladder">
          {verticalSpacingRules.map((rule) => (
            <div className="sens-form-spacing-row" key={rule.value}>
              <div className="sens-form-spacing-value">{rule.value}</div>
              <div className="sens-form-spacing-rule">
                <div className="sens-form-rule-card-title">{rule.title}</div>
                <div className="sens-form-spacing-token">{rule.token}</div>
                <div className="sens-form-rule-card-text">{rule.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="sens-form-rule-card">
        <div className="sens-form-rule-card-title">横向间距层级</div>
        <div className="sens-form-rule-card-text">
          来源于 Figma `横向间距（不包含基础表达式）`：先判断是否为独立组件区块，再判断标题、按钮、联动组件和图标贴近关系。
        </div>
        <div className="sens-form-spacing-ladder">
          {horizontalSpacingRules.map((rule) => (
            <div className="sens-form-spacing-row" key={rule.value}>
              <div className="sens-form-spacing-value">{rule.value}</div>
              <div className="sens-form-spacing-rule">
                <div className="sens-form-rule-card-title">{rule.title}</div>
                <div className="sens-form-spacing-token">{rule.token}</div>
                <div className="sens-form-rule-card-text">{rule.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="sens-form-rule-card">
        <div className="sens-form-rule-card-title">上下布局</div>
        <div className="sens-form-rule-card-text">标题在上，控件在下；标题到控件使用 `spacing/vertical/2x`。</div>
        <SensForm layout="vertical">
          <SensFormItem label="表单项标题" labelHelp="标题帮助说明" optional="(选填)" required description="辅助说明跟随表单项，不改变控件本体。">
            <SensInput placeholder="请输入" style={{ width: "100%" }} />
          </SensFormItem>
        </SensForm>
      </div>
      <div className="sens-form-rule-card">
        <div className="sens-form-rule-card-title">左右布局</div>
        <div className="sens-form-rule-card-text">
          标题在左，控件在右；常规控件按 32px 高度居中对齐。联动单选 / 复选、文本域等复杂内容使用顶部对齐，不额外补 32px。
        </div>
        <SensForm layout="horizontal">
          <SensFormItem label="常规输入" labelHelp="常规控件按 32px 对齐" required description="左右布局用于字段密度更高、标题较短的表单。">
            <SensInput placeholder="请输入" style={{ width: "100%" }} />
          </SensFormItem>
          <SensFormItem label="表单项标题过长需要省略" labelHelp="表单项标题全称" optional="(选填)">
            <SensInput placeholder="请输入" style={{ width: "100%" }} />
          </SensFormItem>
          <SensFormItem label="单选选择" optional="(选填)">
            <SensRadioGroup
              defaultValue="a"
              options={[
                { value: "a", label: "单项选择 1" },
                { value: "b", label: "单项选择 2" },
              ]}
            />
          </SensFormItem>
          <SensFormItem label="复选选择" optional="(选填)">
            <SensCheckboxGroup
              defaultValue={["a"]}
              options={[
                { value: "a", label: "复选项 1" },
                { value: "b", label: "复选项 2" },
              ]}
            />
          </SensFormItem>
          <SensFormItem label="带说明单选" labelHelp="每个选项带辅助文案时顶部对齐" optional="(选填)" labelAlign="top">
            <SensRadioGroup
              defaultValue="a"
              options={[
                { value: "a", label: "单项选择 1", description: "辅助说明" },
                { value: "b", label: "单项选择 2", description: "辅助说明" },
                { value: "c", label: "单项选择 3", description: "辅助说明" },
              ]}
            />
          </SensFormItem>
          <SensFormItem label="带说明复选" labelHelp="每个选项带辅助文案时顶部对齐" optional="(选填)" labelAlign="top">
            <SensCheckboxGroup
              defaultValue={["a"]}
              options={[
                { value: "a", label: "复选项 1", description: "辅助说明" },
                { value: "b", label: "复选项 2", description: "辅助说明" },
                { value: "c", label: "复选项 3", description: "辅助说明" },
              ]}
            />
          </SensFormItem>
          <SensFormItem label="联动组件" labelHelp="选项下方有更多信息时顶部对齐" optional="(选填)" labelAlign="top">
            <div className="sens-form-linked-field">
              <SensRadioGroup
                defaultValue="a"
                options={[
                  { value: "a", label: "单项选择 1" },
                  { value: "b", label: "单项选择 2" },
                ]}
              />
              <div className="sens-form-linked-inputs">
                <SensInput placeholder="请输入" />
                <SensInput placeholder="请输入" />
                <SensInput placeholder="请输入" />
              </div>
            </div>
          </SensFormItem>
          <SensFormItem label="文本域" labelHelp="文本域不补 32px 标题高度" optional="(选填)" labelAlign="top">
            <SensTextArea placeholder="请输入" />
          </SensFormItem>
        </SensForm>
      </div>
      <div className="sens-form-rule-card">
        <div className="sens-form-rule-card-title">报错信息</div>
        <div className="sens-form-rule-card-text">
          报错和辅助信息共用同一行信息槽；当字段出现报错时，报错会替代辅助信息的位置，并自然撑开表单项高度。
        </div>
        <div className="sens-form-validation-demos">
          <div className="sens-form-validation-card">
            <div className="sens-form-rule-card-title">上下布局报错</div>
            <SensForm layout="vertical">
              <SensFormItem
                label="规则名称"
                description="名称用于识别当前规则，建议保持业务语义清晰。"
                error="请输入规则名称"
              >
                <SensInput placeholder="请输入" status="error" style={{ width: "100%" }} />
              </SensFormItem>
              <SensFormItem label="执行次数" description="上一项报错后，本项会随表单高度自然下移。" controlExtra="次">
                <SensInputNumber defaultValue={10} style={{ width: "100%" }} />
              </SensFormItem>
            </SensForm>
          </div>
          <div className="sens-form-validation-card">
            <div className="sens-form-rule-card-title">左右布局报错</div>
            <SensForm layout="horizontal">
              <SensFormItem
                label="任务名称"
                labelHelp="用于识别当前任务"
                optional="(选填)"
                description="辅助信息在正常状态下展示。"
                error="请输入任务名称"
              >
                <SensInput placeholder="请输入" status="error" style={{ width: "100%" }} />
              </SensFormItem>
              <SensFormItem label="通知范围" description="错误信息消失后才显示字段辅助信息。">
                <SensRadioGroup
                  defaultValue="all"
                  options={[
                    { value: "all", label: "全部用户" },
                    { value: "target", label: "指定用户" },
                  ]}
                />
              </SensFormItem>
            </SensForm>
          </div>
        </div>
      </div>
      <div className="sens-form-rule-card sens-form-rule-card--muted">
        <div className="sens-form-rule-card-title">尺寸附录</div>
        <div className="sens-form-rule-card-text">
          单个录入组件宽度根据界面自由组合，不强制齐宽，但不能小于组件最小值；Input、Select、Search、NumberInput 等尺寸仍回到对应基础组件文档验收。
        </div>
      </div>
    </SensForm>
  );
}

export default function FormShowcasePage() {
  return (
    <ComponentShowcaseLayout
      title="表单 Form"
      demo={<FormDemo />}
      matrix={<FormRulesPreview />}
      designDocSource={formDesignDoc}
      devDocSource={formDevDoc}
    />
  );
}
