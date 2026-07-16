import { useState } from "react";
import { Segmented, Space, Switch, Typography } from "antd";
import checkboxDesignDoc from "../../design-system/components/base/checkbox.design.md?raw";
import checkboxDevDoc from "../../design-system/components/base/checkbox.md?raw";
import { CheckboxStatesPreview, SensCheckbox, SensCheckboxGroup } from "../../ui";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";

const { Text } = Typography;

function CheckboxDemo() {
  const [checked, setChecked] = useState(true);
  const [indeterminate, setIndeterminate] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [withDescription, setWithDescription] = useState(true);
  const [groupValue, setGroupValue] = useState(["overview", "report"]);

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
        onChange={(event) => {
          setChecked(event.target.checked);
          setIndeterminate(false);
        }}
        description={withDescription ? "用于说明选项含义、限制或推荐选择场景。" : undefined}
      >
        复选框选项
      </SensCheckbox>
      <div>
        <Text strong>复选框组</Text>
        <div style={{ marginTop: 12 }}>
          <SensCheckboxGroup
            value={groupValue}
            disabled={disabled}
            onChange={setGroupValue}
            options={[
              {
                value: "overview",
                label: "概览",
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
