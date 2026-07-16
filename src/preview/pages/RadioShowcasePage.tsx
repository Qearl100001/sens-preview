import { useState } from "react";
import { Space, Switch, Typography } from "antd";
import radioDesignDoc from "../../design-system/components/base/radio.design.md?raw";
import radioDevDoc from "../../design-system/components/base/radio.md?raw";
import { RadioStatesPreview, SensRadio, SensRadioGroup } from "../../ui";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";

const { Text } = Typography;

function RadioDemo() {
  const [value, setValue] = useState("option-a");
  const [disabled, setDisabled] = useState(false);
  const [withDescription, setWithDescription] = useState(true);

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Space wrap align="end" size="middle">
        <Space direction="vertical" size={4}>
          <Text type="secondary">辅助文案</Text>
          <Switch checked={withDescription} onChange={setWithDescription} />
        </Space>
        <Space direction="vertical" size={4}>
          <Text type="secondary">禁用</Text>
          <Switch checked={disabled} onChange={setDisabled} />
        </Space>
      </Space>

      <Space direction="vertical" size="middle">
        <SensRadio
          name="sens-radio-demo"
          value="option-a"
          checked={value === "option-a"}
          disabled={disabled}
          onChange={(event) => setValue(String(event.target.value))}
          description={withDescription ? "单选项 A 的辅助说明，用于解释选项差异。" : undefined}
        >
          单选项 A
        </SensRadio>
        <SensRadio
          name="sens-radio-demo"
          value="option-b"
          checked={value === "option-b"}
          disabled={disabled}
          onChange={(event) => setValue(String(event.target.value))}
          description={withDescription ? "单选项 B 的辅助说明，用于解释选项差异。" : undefined}
        >
          单选项 B
        </SensRadio>
      </Space>
      <div>
        <Text strong>单选组</Text>
        <div style={{ marginTop: 12 }}>
          <SensRadioGroup
            name="sens-radio-group-demo"
            value={value}
            disabled={disabled}
            onChange={setValue}
            options={[
              {
                value: "option-a",
                label: "单选项 A",
                description: withDescription ? "单选项 A 的辅助说明，用于解释选项差异。" : undefined,
              },
              {
                value: "option-b",
                label: "单选项 B",
                description: withDescription ? "单选项 B 的辅助说明，用于解释选项差异。" : undefined,
              },
              {
                value: "option-c",
                label: "单选项 C",
                description: withDescription ? "单选项 C 的辅助说明，用于解释选项差异。" : undefined,
              },
            ]}
          />
        </div>
      </div>
      <Text type="secondary">单选框和单选组用于同一组选项中只允许选择一个的场景，常用于表单项。</Text>
    </Space>
  );
}

export default function RadioShowcasePage() {
  return (
    <ComponentShowcaseLayout
      title="单选框 Radio"
      demo={<RadioDemo />}
      matrix={<RadioStatesPreview />}
      designDocSource={radioDesignDoc}
      devDocSource={radioDevDoc}
    />
  );
}
