import "../../ui/search-preview.css";
import { useState } from "react";
import { Flex, Segmented, Space, Switch, Typography, theme } from "antd";
import searchDesignDoc from "../../design-system/components/base/search.design.md?raw";
import searchDevDoc from "../../design-system/components/base/search.md?raw";
import {
  CategorySearchInput,
  CategorySearchTriggerInput,
  MinimalSearchWithCreate,
  SearchInput,
  SearchStatesPreview,
  SearchTriggerInput,
  type SearchVisualVariant,
} from "../../ui";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";
import { ShowcaseSelect } from "../ShowcaseSelect";

const { Text } = Typography;

type SearchDemoVariant =
  | "realtime"
  | "category"
  | "trigger"
  | "trigger-category"
  | "minimal-create";

const VARIANT_OPTIONS: { value: SearchDemoVariant; label: string }[] = [
  { value: "realtime", label: "基础搜索（实时型）" },
  { value: "category", label: "复合搜索（实时型 + 分类）" },
  { value: "trigger", label: "触发型搜索" },
  { value: "trigger-category", label: "触发型 + 分类" },
  { value: "minimal-create", label: "简约搜索 + 创建" },
];

const SUPPORTS_VISUAL_VARIANT = new Set<SearchDemoVariant>(["realtime", "category"]);

function SearchDemoInstance({
  variant,
  visualVariant,
  showCreate,
}: {
  variant: SearchDemoVariant;
  visualVariant: SearchVisualVariant;
  showCreate: boolean;
}) {
  switch (variant) {
    case "realtime":
      return <SearchInput visualVariant={visualVariant} />;
    case "category":
      return <CategorySearchInput visualVariant={visualVariant} />;
    case "trigger":
      return <SearchTriggerInput />;
    case "trigger-category":
      return <CategorySearchTriggerInput />;
    case "minimal-create":
      return <MinimalSearchWithCreate showCreate={showCreate} onCreate={() => undefined} />;
    default:
      return null;
  }
}

function SearchDemo() {
  const { token } = theme.useToken();
  const [variant, setVariant] = useState<SearchDemoVariant>("realtime");
  const [visualVariant, setVisualVariant] = useState<SearchVisualVariant>("default");
  const [showCreate, setShowCreate] = useState(true);

  const showVisualControl = SUPPORTS_VISUAL_VARIANT.has(variant);
  const showCreateControl = variant === "minimal-create";

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Flex wrap gap={token.marginMD} align="flex-end">
        <Space direction="vertical" size={4}>
          <Text type="secondary">变体</Text>
          <ShowcaseSelect
            value={variant}
            onChange={setVariant}
            options={VARIANT_OPTIONS}
            style={{ width: 220 }}
          />
        </Space>
        {showVisualControl ? (
          <Space direction="vertical" size={4}>
            <Text type="secondary">样式</Text>
            <Segmented
              value={visualVariant}
              onChange={(v) => setVisualVariant(v as SearchVisualVariant)}
              options={[
                { label: "常规", value: "default" },
                { label: "简约", value: "minimal" },
              ]}
            />
          </Space>
        ) : null}
        {showCreateControl ? (
          <Space direction="vertical" size={4}>
            <Text type="secondary">创建按钮</Text>
            <Switch checked={showCreate} onChange={setShowCreate} />
          </Space>
        ) : null}
      </Flex>

      <Space size="large" wrap align="center">
        <SearchDemoInstance variant={variant} visualVariant={visualVariant} showCreate={showCreate} />
        <Text type="secondary">悬停 / 聚焦 / 输入查看各态；简约有输入时出现返回与清空</Text>
      </Space>
    </Space>
  );
}

export default function SearchShowcasePage() {
  return (
    <ComponentShowcaseLayout
      title="搜索 Search"
      demo={<SearchDemo />}
      matrix={<SearchStatesPreview />}
      designDocSource={searchDesignDoc}
      devDocSource={searchDevDoc}
    />
  );
}
