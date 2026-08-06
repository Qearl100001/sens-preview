import { useState } from "react";
import { Segmented, Space, Switch, Typography } from "antd";
import { useTranslation } from "react-i18next";
import textareaDevDoc from "../../design-system/components/base/textarea.md?raw";
import inputDesignDoc from "../../design-system/components/base/input.design.md?raw";
import {
  formatSensTextAreaCount,
  SensTextArea,
  TextAreaStatesPreview,
} from "../../ui/SensTextArea";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";

const { Text } = Typography;
const I18N_NS = "组件库";
const TEXTAREA_COUNT_LIMIT = 100;
const TEXTAREA_COUNT_VALUE = "这里是文字".repeat(200);
const TEXTAREA_TRUNCATED_VALUE = TEXTAREA_COUNT_VALUE.slice(0, TEXTAREA_COUNT_LIMIT);

function TextAreaDemo() {
  const { t } = useTranslation();
  const [size, setSize] = useState<"middle" | "small">("middle");
  const [disabled, setDisabled] = useState(false);
  const [showCount, setShowCount] = useState(false);
  const [warningPlacement, setWarningPlacement] = useState<"" | "inside" | "outside">("");
  const [readOnlyVariant, setReadOnlyVariant] = useState<"" | "filled" | "plain">("");
  const [clearDemoValue, setClearDemoValue] = useState("已输入文本域内容");

  const placeholder = t(`${I18N_NS}.sensd-input-placeholder`, { defaultValue: "请输入" });
  const isReadOnly = readOnlyVariant !== "";

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Space wrap align="end" size="middle">
        <Space direction="vertical" size={4}>
          <Text type="secondary">尺寸</Text>
          <Segmented
            value={size}
            onChange={(v) => setSize(v as "middle" | "small")}
            options={[
              { label: "大", value: "middle" },
              { label: "小", value: "small" },
            ]}
          />
        </Space>
        <Space direction="vertical" size={4}>
          <Text type="secondary">只读</Text>
          <Segmented
            value={readOnlyVariant || "none"}
            onChange={(v) => {
              const next = v === "none" ? "" : (v as "filled" | "plain");
              setReadOnlyVariant(next);
              if (next) setDisabled(false);
            }}
            options={[
              { label: "无", value: "none" },
              { label: "有背景", value: "filled" },
              { label: "无背景", value: "plain" },
            ]}
          />
        </Space>
        <Space direction="vertical" size={4}>
          <Text type="secondary">禁用</Text>
          <Switch
            checked={disabled}
            disabled={isReadOnly}
            onChange={(checked) => {
              setDisabled(checked);
              if (checked) setReadOnlyVariant("");
            }}
          />
        </Space>
        <Space direction="vertical" size={4}>
          <Text type="secondary">字数统计</Text>
          <Switch checked={showCount} disabled={isReadOnly} onChange={setShowCount} />
        </Space>
        <Space direction="vertical" size={4}>
          <Text type="secondary">警告</Text>
          <Segmented
            value={warningPlacement || "none"}
            disabled={disabled}
            onChange={(v) => setWarningPlacement(v === "none" ? "" : (v as "inside" | "outside"))}
            options={[
              { label: "无", value: "none" },
              { label: "框内", value: "inside" },
              { label: "框外", value: "outside" },
            ]}
          />
        </Space>
      </Space>

      <SensTextArea
        placeholder={placeholder}
        size={size === "small" ? "small" : undefined}
        disabled={disabled}
        showCount={showCount}
        maxLength={showCount ? 200 : undefined}
        readOnlyVariant={readOnlyVariant || undefined}
        warningPlacement={warningPlacement || undefined}
        help={warningPlacement ? "警告文案" : undefined}
        defaultValue={isReadOnly && warningPlacement ? "已输入\n第二行" : undefined}
        style={{ width: 280, minWidth: 128, maxWidth: 600 }}
      />
      <Text type="secondary">默认 4.5 行高度；可纵向拖拽增高；框内警告图标锚定首行右侧</Text>
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <Text strong>字数统计 + 清空 + 框内警告</Text>
        <SensTextArea
          data-testid="textarea-count-clear-warning-demo"
          value={clearDemoValue}
          onChange={(event) => setClearDemoValue(event.target.value)}
          allowClear
          showCount
          maxLength={200}
          warningPlacement="inside"
          warningMessage="警告文案"
          style={{ width: 280, minWidth: 128, maxWidth: 600 }}
        />
        <Text type="secondary">清空图标、右下字数统计、右上框内警告同时存在时检查层叠关系</Text>
      </Space>
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <Text strong>超限策略</Text>
        <SensTextArea
          data-testid="textarea-over-limit-demo"
          defaultValue={TEXTAREA_COUNT_VALUE}
          count={{ max: TEXTAREA_COUNT_LIMIT, show: formatSensTextAreaCount }}
          warningPlacement="outside"
          help="出错提示信息"
          style={{ width: 280, minWidth: 128, maxWidth: 600 }}
        />
        <Text type="secondary">允许继续输入：1000 为错误色，/100 保持中性色，框体和框外错误变红</Text>
        <SensTextArea
          data-testid="textarea-truncated-demo"
          defaultValue={TEXTAREA_TRUNCATED_VALUE}
          showCount={{ formatter: formatSensTextAreaCount }}
          maxLength={TEXTAREA_COUNT_LIMIT}
          style={{ width: 280, minWidth: 128, maxWidth: 600 }}
        />
        <Text type="secondary">达到上限后截断：100/100 保持中性色，框体不报错</Text>
      </Space>
    </Space>
  );
}

export default function TextAreaShowcasePage() {
  return (
    <ComponentShowcaseLayout
      title="文本域 TextArea"
      demo={<TextAreaDemo />}
      matrix={<TextAreaStatesPreview />}
      designDocSource={inputDesignDoc}
      devDocSource={textareaDevDoc}
    />
  );
}
