import { useMemo, useState } from "react";
import { Flex, Segmented, Space, Switch, Typography } from "antd";
import { useTranslation } from "react-i18next";
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
import { getPreviewTokens } from "../previewTokens";

const { Text } = Typography;
const I18N_NS = "组件库";

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
      return <SensPillTabs size={size} withBadge={withBadge} itemCount={10} disabledLastItem />;
    default:
      return null;
  }
}

function TabsDemo() {
  const { t } = useTranslation();
  const token = getPreviewTokens();
  const [variant, setVariant] = useState<TabsDemoVariant>("basic");
  const [size, setSize] = useState<SensTabSize>("large");
  const [withBadge, setWithBadge] = useState(false);
  const editableCardDemoItems = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        key: `page-${index + 1}`,
        title: t(`${I18N_NS}.sensd-tabs-pageTitle-${index + 1}`, {
          defaultValue: `页面标题 ${index + 1}`,
        }),
      })),
    [t],
  );

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
              className="sens-tabs-demo-size-segmented"
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
        {variant === "editable-card" ? (
          <SensEditableCardTabs
            initialItems={editableCardDemoItems}
            defaultActiveKey="page-9"
            defaultMoreOpen
          />
        ) : (
          <TabsDemoInstance variant={variant} size={size} withBadge={withBadge} />
        )}
        <Text type="secondary">
          {variant === "editable-card"
            ? "默认展示稳定溢出场景；更多下拉初始展开，便于对照 Figma；点击可切换、收起、双击编辑"
            : variant === "pill"
              ? "对齐 Figma 4 变体：10项胶囊条（大/小 × 徽标开关）；最后一项保留 disabled 走查"
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
