import { useState } from "react";
import switchDesignDoc from "../../design-system/components/base/switch.design.md?raw";
import switchDevDoc from "../../design-system/components/base/switch.md?raw";
import { SensCheckbox, SensSwitch, SensSwitchStatesPreview } from "../../ui";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";

function SwitchDemo() {
  const [checked, setChecked] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  return (
    <div className="sens-switch-demo" style={{ padding: 0 }}>
      <div className="sens-switch-demo__main">
        <span className="sens-switch-demo__name">数据同步</span>
        <SensSwitch
          aria-label="数据同步"
          checked={checked}
          onChange={setChecked}
          disabled={disabled}
          loading={loading}
          readOnly={readOnly}
          showStatus
        />
      </div>
      <div className="sens-switch-demo__settings">
        <SensCheckbox checked={disabled} onChange={(event) => setDisabled(event.currentTarget.checked)}>禁用</SensCheckbox>
        <SensCheckbox checked={loading} onChange={(event) => setLoading(event.currentTarget.checked)}>加载</SensCheckbox>
        <SensCheckbox checked={readOnly} onChange={(event) => setReadOnly(event.currentTarget.checked)}>只读</SensCheckbox>
      </div>
      <p className="sens-switch-demo__hint">开关状态立即生效；只读时仅展示当前状态。</p>
    </div>
  );
}

export default function SwitchShowcasePage() {
  return (
    <ComponentShowcaseLayout
      title="开关 Switch"
      demo={<SwitchDemo />}
      matrix={<SensSwitchStatesPreview />}
      designDocSource={switchDesignDoc}
      devDocSource={switchDevDoc}
    />
  );
}
