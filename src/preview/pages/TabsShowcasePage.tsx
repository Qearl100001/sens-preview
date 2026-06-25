import { useState } from "react";
import { Flex, Segmented, Space, Switch, Typography, theme } from "antd";
import tabsDesignDoc from "../../design-system/components/base/tabs.design.md?raw";
import tabsDevDoc from "../../design-system/components/base/tabs.md?raw";
import {
  SensBasicTabs,
  SensEditableCardTabs,
  SensPillTabs,
  TabsStatesPreview,
  type SensTabSize,
} from "../../ui";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";
import { ShowcaseSelect } from "../ShowcaseSelect";

const { Text } = Typography;

type TabsDemoVariant = "basic" | "editable-card" | "pill";

const VARIANT_OPTIONS: { value: TabsDemoVariant; label: string }[] = [
  { value: "basic", label: "基础标签页" },
  { value: "editable-card", label: "页签标签页" },
  { value: "pill", label: "胶囊标签页" },
];

const SUPPORTS_SIZE = new Set<TabsDemoVariant>(["basic", "pill"]);
const SUPPORTS_BADGE = new Set<TabsDemoVariant>(["basic", "pill"]);

function TabsDemoInstance({
  variant,
  size,
  withBadge,
}: {
  variant: TabsDemoVariant;
  size: SensTabSize;
  withBadge: boolean;
}) {
  switch (variant) {
    case "basic":
      return <SensBasicTabs size={size} withBadge={withBadge} />;
    case "editable-card":
      return <SensEditableCardTabs />;
    case "pill":
      return <SensPillTabs size={size} withBadge={withBadge} itemCount={10} />;
    default:
      return null;
  }
}

function TabsDemo() {
  const { token } = theme.useToken();
  const [variant, setVariant] = useState<TabsDemoVariant>("basic");
  const [size, setSize] = useState<SensTabSize>("large");
  const [withBadge, setWithBadge] = useState(false);

  const showSize = SUPPORTS_SIZE.has(variant);
  const showBadge = SUPPORTS_BADGE.has(variant);

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Flex wrap gap={token.marginMD} align="flex-end">
        <Space direction="vertical" size={4}>
          <Text type="secondary">类型</Text>
          <ShowcaseSelect
            value={variant}
            onChange={setVariant}
            options={VARIANT_OPTIONS}
            style={{ width: 180 }}
          />
        </Space>
        {showSize ? (
          <Space direction="vertical" size={4}>
            <Text type="secondary">尺寸</Text>
            <Segmented
              value={size}
              onChange={(v) => setSize(v as SensTabSize)}
              options={[
                { label: "大", value: "large" },
                { label: "小", value: "small" },
              ]}
            />
          </Space>
        ) : null}
        {showBadge ? (
          <Space direction="vertical" size={4}>
            <Text type="secondary">徽标</Text>
            <Space>
              <Switch checked={withBadge} onChange={setWithBadge} />
              <Text>withBadge</Text>
            </Space>
          </Space>
        ) : null}
      </Flex>

      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <TabsDemoInstance variant={variant} size={size} withBadge={withBadge} />
        <Text type="secondary">
          {variant === "editable-card"
            ? "点击切换页签、添加/关闭；悬停标题与删除图标查看交互"
            : variant === "pill"
              ? "对齐 Figma 4 变体：10项胶囊条（大/小 × 徽标开关）"
              : "点击切换选中项；悬停未选中/已选中标签查看 hover"}
        </Text>
      </Space>

    </Space>
  );
}

export default function TabsShowcasePage() {
  return (
    <ComponentShowcaseLayout
      title="标签页 Tabs"
      demo={<TabsDemo />}
      matrix={<TabsStatesPreview />}
      designDocSource={tabsDesignDoc}
      devDocSource={tabsDevDoc}
    />
  );
}
