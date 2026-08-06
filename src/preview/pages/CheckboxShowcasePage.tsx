import { useState, type MouseEvent, type ReactNode } from "react";
import { Segmented, Space, Switch, Typography } from "antd";
import checkboxDesignDoc from "../../design-system/components/base/checkbox.design.md?raw";
import checkboxDevDoc from "../../design-system/components/base/checkbox.md?raw";
import { SensIcon } from "../../design-system/icons";
import { CheckboxStatesPreview, SensCheckbox, SensCheckboxGroup, SensTips } from "../../ui";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";

const { Text } = Typography;

/** 选项旁帮助：与 Form/Title 同源 `help`；阻止冒泡以免误切换勾选 */
function OptionHelpIcon({ tip }: { tip: string }) {
  const stopToggle = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <SensTips title={tip} placement="top">
      <span
        className="sens-cursor-default"
        tabIndex={0}
        aria-label="帮助说明"
        onClick={stopToggle}
        onMouseDown={stopToggle}
        style={{ display: "inline-flex", lineHeight: 0 }}
      >
        <SensIcon name="help" sizeToken="size/icon/m" color="currentColor" />
      </span>
    </SensTips>
  );
}

function CheckboxDemo() {
  const [checked, setChecked] = useState(true);
  const [indeterminate, setIndeterminate] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [withDescription, setWithDescription] = useState(true);
  const [groupValue, setGroupValue] = useState(["overview", "report"]);
  const [verticalValue, setVerticalValue] = useState(["a"]);
  const [linkedValue, setLinkedValue] = useState(["linked"]);
  const [controlOnlyChecked, setControlOnlyChecked] = useState(false);

  const helpIcon: ReactNode = (
    <OptionHelpIcon tip="说明该选项的含义、限制或推荐场景。" />
  );

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Space wrap align="end" size="middle">
        <Space direction="vertical" size={4}>
          <Text type="secondary">取值</Text>
          <Segmented
            value={indeterminate ? "indeterminate" : checked ? "checked" : "unchecked"}
            onChange={(value) => {
              setIndeterminate(value === "indeterminate");
              setChecked(value === "checked");
            }}
            options={[
              { label: "未选中", value: "unchecked" },
              { label: "已选中", value: "checked" },
              { label: "部分选中", value: "indeterminate" },
            ]}
          />
        </Space>
        <Space direction="vertical" size={4}>
          <Text type="secondary">辅助文案</Text>
          <Switch checked={withDescription} onChange={setWithDescription} />
        </Space>
        <Space direction="vertical" size={4}>
          <Text type="secondary">禁用</Text>
          <Switch checked={disabled} onChange={setDisabled} />
        </Space>
      </Space>

      <SensCheckbox
        checked={checked}
        indeterminate={indeterminate}
        disabled={disabled}
        helpIcon={helpIcon}
        onChange={(event) => {
          setChecked(event.target.checked);
          setIndeterminate(false);
        }}
        description={withDescription ? "用于说明选项含义、限制或推荐选择场景。" : undefined}
      >
        复选框选项
      </SensCheckbox>

      <div>
        <Text strong>复选框组 · 横向</Text>
        <div style={{ marginTop: 12 }}>
          <SensCheckboxGroup
            value={groupValue}
            disabled={disabled}
            aria-label="复选框组横向"
            onChange={setGroupValue}
            options={[
              {
                value: "overview",
                label: "概览",
                helpIcon,
                description: withDescription ? "用于进入整体概览与关键指标。" : undefined,
              },
              {
                value: "report",
                label: "报表",
                description: withDescription ? "用于进入报表配置与查看。" : undefined,
              },
              {
                value: "analysis",
                label: "分析",
                description: withDescription ? "用于进入分析模型与洞察。" : undefined,
              },
            ]}
          />
        </div>
      </div>

      <div>
        <Text strong>复选框组 · 纵向</Text>
        <div style={{ marginTop: 12 }}>
          <SensCheckboxGroup
            direction="vertical"
            value={verticalValue}
            disabled={disabled}
            aria-label="复选框组纵向"
            onChange={setVerticalValue}
            options={[
              { value: "a", label: "纵向选项 A" },
              { value: "b", label: "纵向选项 B" },
              { value: "c", label: "纵向选项 C", disabled: true },
            ]}
          />
        </div>
      </div>

      <div>
        <Text strong>只读</Text>
        <div style={{ marginTop: 12 }}>
          <Space direction="vertical" size="small">
            <SensCheckbox checked readOnly>
              只读已选（可聚焦，不可改）
            </SensCheckbox>
            <SensCheckbox checked={false} readOnly description="只读未选，仍保留键盘可达">
              只读未选
            </SensCheckbox>
          </Space>
        </div>
      </div>

      <div>
        <Text strong>无可见文案（须 aria-label）</Text>
        <div style={{ marginTop: 12 }}>
          <SensCheckbox
            checked={controlOnlyChecked}
            disabled={disabled}
            aria-label="表格行选择"
            onChange={(event) => setControlOnlyChecked(event.target.checked)}
          />
        </div>
      </div>

      <div>
        <Text strong>联动组 · itemHeight=&quot;content&quot;</Text>
        <div style={{ marginTop: 12 }}>
          <SensCheckboxGroup
            direction="vertical"
            itemHeight="content"
            value={linkedValue}
            disabled={disabled}
            aria-label="联动复选组"
            onChange={setLinkedValue}
            options={[{ value: "linked", label: "勾选后承接关联内容" }]}
          />
          {linkedValue.includes("linked") ? (
            <div style={{ marginTop: 8, marginLeft: 24 }}>
              <Text type="secondary">关联内容区（示意）：选项回到自然文字高度，不锁 32px。</Text>
            </div>
          ) : null}
        </div>
      </div>

      <Text type="secondary">
        键盘验收：Tab 聚焦见外环，Space 切换；帮助图标为 SensIcon name=&quot;help&quot;，点击不切换勾选。
      </Text>
      <Text type="secondary">复选框和复选框组是基础选择控件；表格多选、下拉多选等复合组件按场景组合它。</Text>
    </Space>
  );
}

export default function CheckboxShowcasePage() {
  return (
    <ComponentShowcaseLayout
      title="复选框 Checkbox"
      demo={<CheckboxDemo />}
      matrix={<CheckboxStatesPreview />}
      designDocSource={checkboxDesignDoc}
      devDocSource={checkboxDevDoc}
    />
  );
}
