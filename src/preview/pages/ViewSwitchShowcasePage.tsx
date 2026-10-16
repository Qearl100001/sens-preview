import { useState, type ReactNode } from "react";
import { Space, Typography } from "antd";
import viewSwitchDesignDoc from "../../design-system/components/base/view-switch.design.md?raw";
import viewSwitchDevDoc from "../../design-system/components/base/view-switch.md?raw";
import { SensIcon } from "../../design-system/icons";
import { SensSwitch, SensViewSwitch, SensViewSwitchStatesPreview, type SensViewSwitchOption } from "../../ui";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";

const { Text } = Typography;

const CHART_OPTIONS: SensViewSwitchOption[] = [
  {
    value: "bar",
    label: "柱状图",
    icon: <SensIcon name="chart-bar" sizeToken="size/icon/m" colorRole="inherit" />,
  },
  {
    value: "table",
    label: "条形图",
    icon: <SensIcon name="list" sizeToken="size/icon/m" colorRole="inherit" />,
  },
  {
    value: "line",
    label: "折线图",
    icon: <SensIcon name="chart-line" sizeToken="size/icon/m" colorRole="inherit" />,
  },
];

const TEXT_OPTIONS: SensViewSwitchOption[] = [
  { value: "trend", label: "趋势" },
  { value: "change", label: "变化" },
];

const OPTION_COUNT_EXAMPLES = [2, 3, 4, 5, 6].map((count) => ({
  count,
  options: Array.from({ length: count }, (_, index) => ({
    value: `option-${index + 1}`,
    label: "选项",
    icon: <SensIcon name="icon-default" sizeToken="size/icon/m" colorRole="inherit" />,
  })),
}));

const ICON_OPTIONS: SensViewSwitchOption[] = [
  { value: "bar", ariaLabel: "柱状图", tooltip: "柱状图", icon: CHART_OPTIONS[0].icon as ReactNode },
  { value: "table", ariaLabel: "条形图", tooltip: "条形图", icon: CHART_OPTIONS[1].icon as ReactNode },
  { value: "line", ariaLabel: "折线图", tooltip: "折线图", icon: CHART_OPTIONS[2].icon as ReactNode },
];

function ViewSwitchDemo() {
  const [chart, setChart] = useState("bar");
  const [textMode, setTextMode] = useState("trend");
  const [iconMode, setIconMode] = useState("bar");
  const [disabled, setDisabled] = useState(false);

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Space wrap align="center" size="large">
        <Space direction="vertical" size={4}>
          <Text type="secondary">图标 + 文字</Text>
          <SensViewSwitch
            aria-label="图表视图"
            options={CHART_OPTIONS}
            value={chart}
            onChange={setChart}
            disabled={disabled}
          />
        </Space>
        <Space direction="vertical" size={4}>
          <Text type="secondary">纯文字</Text>
          <SensViewSwitch
            aria-label="数据视角"
            options={TEXT_OPTIONS}
            value={textMode}
            onChange={setTextMode}
            disabled={disabled}
          />
        </Space>
        <Space direction="vertical" size={4}>
          <Text type="secondary">纯图标 · 配 Tips</Text>
          <SensViewSwitch
            aria-label="图表类型"
            options={ICON_OPTIONS}
            value={iconMode}
            onChange={setIconMode}
            disabled={disabled}
          />
        </Space>
        <Space size={8}>
          <SensSwitch aria-label="禁用" checked={disabled} onChange={setDisabled} />
          <Text>禁用</Text>
        </Space>
      </Space>
      <Text type="secondary">
        点击选项可切换。支持 2–6 项，实际业务中建议优先控制在 2–3 项；超过 6 项请使用选择器。
      </Text>
      <Space direction="vertical" size="middle">
        <Text strong>选项数量示例（2–6 项）</Text>
        {OPTION_COUNT_EXAMPLES.map(({ count, options }) => (
          <Space key={count} align="center" size="middle">
            <Text type="secondary">{count} 项</Text>
            <SensViewSwitch
              aria-label={`${count} 个选项的视图切换示例`}
              options={options}
              defaultValue="option-1"
            />
          </Space>
        ))}
      </Space>
    </Space>
  );
}

export default function ViewSwitchShowcasePage() {
  return (
    <ComponentShowcaseLayout
      title="视图切换 View Switch"
      demo={<ViewSwitchDemo />}
      matrix={<SensViewSwitchStatesPreview />}
      designDocSource={viewSwitchDesignDoc}
      devDocSource={viewSwitchDevDoc}
    />
  );
}
