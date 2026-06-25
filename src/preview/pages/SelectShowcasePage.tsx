import { Space } from "antd";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import selectDesignDoc from "../../design-system/components/base/select.design.md?raw";
import selectDevDoc from "../../design-system/components/base/select.md?raw";
import type { FunctionalSkin } from "../../design-system/functional-skin";
import {
  SELECT_DROPDOWN_DEMO_WIDTH,
  SelectTriggerStatesPreview,
  SensSelectDropdown,
} from "../../ui/SensSelectDropdown";
import { SensInput } from "../../ui/SensInput";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";

const I18N_NS = "组件库";

const DEMO_OPTIONS = [
  { value: "a", label: "选项 A" },
  { value: "b", label: "选项 B" },
  { value: "c", label: "选项 C" },
];

type PreviewOutletContext = {
  skin: FunctionalSkin;
};

function SelectDemo() {
  const { skin } = useOutletContext<PreviewOutletContext>();
  const { t } = useTranslation();
  const placeholder = t(`${I18N_NS}.sensd-select-placeholder`, { defaultValue: "请选择" });

  return (
    <Space direction="vertical" size="large">
      <div data-testid="r3-select-default">
        <SensSelectDropdown
          functionalSkin={skin}
          placeholder={placeholder}
          style={{ width: SELECT_DROPDOWN_DEMO_WIDTH }}
          options={DEMO_OPTIONS}
          defaultValue="b"
        />
      </div>
      <div data-testid="r3-select-clearable">
        <SensSelectDropdown
          functionalSkin={skin}
          clearable
          placeholder={placeholder}
          style={{ width: SELECT_DROPDOWN_DEMO_WIDTH }}
          options={DEMO_OPTIONS}
          defaultValue="a"
        />
      </div>
      <div data-testid="r3-select-warning">
        <SensSelectDropdown
          functionalSkin={skin}
          warningPlacement="inside"
          help="警告文案"
          placeholder={placeholder}
          style={{ width: SELECT_DROPDOWN_DEMO_WIDTH }}
          options={DEMO_OPTIONS}
          defaultValue="c"
        />
      </div>
      <div data-testid="r3-select-disabled">
        <SensSelectDropdown
          functionalSkin={skin}
          disabled
          placeholder={placeholder}
          style={{ width: SELECT_DROPDOWN_DEMO_WIDTH }}
          options={DEMO_OPTIONS}
          defaultValue="b"
        />
      </div>
    </Space>
  );
}

function SelectMatrix() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <SelectTriggerStatesPreview title="触发框 · 2 警告 × 2 内容 × 5 态（32px）" />
      <div id="r3-token-compare-mount">
        <SelectInputCompareDemo />
      </div>
    </Space>
  );
}

/** R3 自检：与 Input 同源比对用 */
export function SelectInputCompareDemo() {
  const { t } = useTranslation();
  const placeholder = t(`${I18N_NS}.sensd-input-placeholder`, { defaultValue: "请输入" });
  const selectPlaceholder = t(`${I18N_NS}.sensd-select-placeholder`, { defaultValue: "请选择" });

  return (
    <Space direction="vertical" size="large" id="r3-token-compare-root">
      <div data-testid="r3-select-compare">
        <SensSelectDropdown
          placeholder={selectPlaceholder}
          style={{ width: SELECT_DROPDOWN_DEMO_WIDTH }}
          options={DEMO_OPTIONS}
        />
      </div>
      <div data-testid="r3-input-compare">
        <SensInput
          placeholder={placeholder}
          style={{ width: SELECT_DROPDOWN_DEMO_WIDTH, minWidth: 128, maxWidth: 600 }}
        />
      </div>
    </Space>
  );
}

export default function SelectShowcasePage() {
  return (
    <ComponentShowcaseLayout
      title="选择器 Select"
      demo={<SelectDemo />}
      matrix={<SelectMatrix />}
      designDocSource={selectDesignDoc}
      devDocSource={selectDevDoc}
    />
  );
}
