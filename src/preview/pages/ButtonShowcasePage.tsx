import { useMemo, useState } from "react";
import { Divider, Flex, Segmented, Space, Switch, Typography, theme } from "antd";
import { useTranslation } from "react-i18next";
import buttonDesignDoc from "../../design-system/components/base/button.design.md?raw";
import buttonDevDoc from "../../design-system/components/base/button.md?raw";
import {
  ButtonStatesPreview,
  FabGroupStatesPreview,
  FabVerticalGroupStatesPreview,
  IconDefaultIcon,
  SensButton,
  SensDropdownButton,
  SensFabGroup,
  type SensButtonVariant,
  type SensFabGroupItem,
  type SensFabVerticalGroupItem,
} from "../../ui";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";
import { ShowcaseSelect } from "../ShowcaseSelect";

const { Text } = Typography;

type ButtonSize = "large" | "small";
type FabDemoKind = "single" | "horizontal" | "vertical";
type FabTone = "primary" | "secondary";
type FabContentType = "text" | "iconText" | "icon";
type FabSegmentCount = 2 | 3;

const VARIANT_OPTIONS: { value: SensButtonVariant; label: string }[] = [
  { value: "primary", label: "一级（实心）" },
  { value: "secondary", label: "二级（描边）" },
  { value: "tertiary", label: "三级（文字）" },
  { value: "link", label: "链接" },
  { value: "linkWeak", label: "弱化链接" },
  { value: "dangerSecondary", label: "警告二级" },
  { value: "dangerTertiary", label: "警告三级" },
  { value: "dangerLink", label: "警告链接" },
  { value: "dangerLinkWeak", label: "弱化警告链接" },
  { value: "dashed", label: "虚线" },
];

const FAB_KIND_OPTIONS: { value: FabDemoKind; label: string }[] = [
  { value: "single", label: "单项" },
  { value: "horizontal", label: "横向组合" },
  { value: "vertical", label: "竖向组合" },
];

const FAB_TONE_OPTIONS: { value: FabTone; label: string }[] = [
  { value: "primary", label: "一级" },
  { value: "secondary", label: "二级" },
];

const FAB_CONTENT_OPTIONS: { value: FabContentType; label: string }[] = [
  { value: "text", label: "纯文字" },
  { value: "iconText", label: "图标+文字" },
  { value: "icon", label: "纯图标" },
];

/** 更多菜单 demo：link 行 + 真禁用 + 真加载（与下拉浮层页一致） */
const MORE_MENU_DEMO_ITEMS = [
  { key: "edit", label: "编辑", variant: "link" as const },
  { key: "copy", label: "复制", variant: "link" as const },
  { key: "delete", label: "删除", variant: "link" as const },
  { key: "archive", label: "归档", variant: "link" as const, disabled: true },
  { key: "sync", label: "同步", variant: "link" as const, loading: true },
];

function buildHorizontalFabItems(
  contentType: FabContentType,
  count: FabSegmentCount,
  buttonLabel: string,
  disabled: boolean,
  loading: boolean,
): SensFabGroupItem[] {
  const showIcon = contentType === "icon" || contentType === "iconText";
  const showLabel = contentType !== "icon";

  return Array.from({ length: count }, () => ({
    label: showLabel ? buttonLabel : undefined,
    icon: showIcon ? <IconDefaultIcon /> : undefined,
    disabled,
    loading,
  }));
}

function buildVerticalFabItems(count: FabSegmentCount): SensFabVerticalGroupItem[] {
  return Array.from({ length: count }, () => ({
    icon: <IconDefaultIcon />,
  }));
}

function FabDemoPreview({
  kind,
  tone,
  contentType,
  segmentCount,
  disabled,
  loading,
  actionLabel,
}: {
  kind: FabDemoKind;
  tone: FabTone;
  contentType: FabContentType;
  segmentCount: FabSegmentCount;
  disabled: boolean;
  loading: boolean;
  actionLabel: string;
}) {
  const horizontalItems = useMemo(
    () => buildHorizontalFabItems(contentType, segmentCount, actionLabel, disabled, loading),
    [actionLabel, contentType, disabled, loading, segmentCount],
  );
  const verticalItems = useMemo(() => buildVerticalFabItems(segmentCount), [segmentCount]);

  if (kind === "single") {
    const showIcon = contentType === "icon" || contentType === "iconText";
    const showLabel = contentType !== "icon";

    return (
      <SensButton
        fab
        tone={tone}
        disabled={disabled}
        loading={loading}
        icon={showIcon ? <IconDefaultIcon /> : undefined}
      >
        {showLabel ? actionLabel : null}
      </SensButton>
    );
  }

  if (kind === "horizontal") {
    return <SensFabGroup tone={tone} items={horizontalItems} />;
  }

  return <SensFabGroup direction="vertical" items={verticalItems} />;
}

function FabDemo() {
  const { token } = theme.useToken();
  const { t } = useTranslation();
  const actionLabel = t("组件库.sensd-button-action-button", { defaultValue: "按钮" });

  const [kind, setKind] = useState<FabDemoKind>("single");
  const [tone, setTone] = useState<FabTone>("primary");
  const [contentType, setContentType] = useState<FabContentType>("text");
  const [segmentCount, setSegmentCount] = useState<FabSegmentCount>(2);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const showTone = kind !== "vertical";
  const showContentType = kind !== "vertical";
  const showSegmentCount = kind !== "single";
  const showStateToggles = kind !== "vertical";

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Flex wrap gap={token.marginMD} align="flex-end">
        <Space direction="vertical" size={4}>
          <Text type="secondary">类型</Text>
          <Segmented
            value={kind}
            onChange={(value) => setKind(value as FabDemoKind)}
            options={FAB_KIND_OPTIONS}
          />
        </Space>
        {showTone ? (
          <Space direction="vertical" size={4}>
            <Text type="secondary">级别</Text>
            <Segmented
              value={tone}
              onChange={(value) => setTone(value as FabTone)}
              options={FAB_TONE_OPTIONS}
            />
          </Space>
        ) : null}
        {showContentType ? (
          <Space direction="vertical" size={4}>
            <Text type="secondary">形态</Text>
            <Segmented
              value={contentType}
              onChange={(value) => setContentType(value as FabContentType)}
              options={FAB_CONTENT_OPTIONS}
            />
          </Space>
        ) : null}
        {showSegmentCount ? (
          <Space direction="vertical" size={4}>
            <Text type="secondary">段数</Text>
            <Segmented
              value={segmentCount}
              onChange={(value) => setSegmentCount(value as FabSegmentCount)}
              options={[
                { label: "2个", value: 2 },
                { label: "3个", value: 3 },
              ]}
            />
          </Space>
        ) : null}
        {showStateToggles ? (
          <Space direction="vertical" size={4}>
            <Text type="secondary">状态</Text>
            <Space>
              <Switch
                checked={disabled}
                onChange={(checked) => {
                  setDisabled(checked);
                  if (checked) setLoading(false);
                }}
                disabled={loading}
              />
              <Text>disabled</Text>
              <Switch
                checked={loading}
                onChange={(checked) => {
                  setLoading(checked);
                  if (checked) setDisabled(false);
                }}
                disabled={disabled}
              />
              <Text>loading</Text>
            </Space>
          </Space>
        ) : null}
      </Flex>

      <Space size="large" wrap align="center">
        <FabDemoPreview
          kind={kind}
          tone={tone}
          contentType={contentType}
          segmentCount={segmentCount}
          disabled={disabled}
          loading={loading}
          actionLabel={actionLabel}
        />
        <Text type="secondary">
          {kind === "vertical"
            ? "竖向组合仅纯图标，悬停 / 点击查看 hover、active"
            : "鼠标悬停 / 点击查看 hover、active"}
        </Text>
      </Space>
    </Space>
  );
}

function ButtonDemo() {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const [variant, setVariant] = useState<SensButtonVariant>("primary");
  const [size, setSize] = useState<ButtonSize>("large");
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropdownDisabled, setDropdownDisabled] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState(false);

  const actionLabel = t("组件库.sensd-button-action-button", { defaultValue: "按钮" });
  const moreLabel = t("组件库.sensd-button-action-more", { defaultValue: "更多" });

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Flex wrap gap={token.marginMD} align="flex-end">
        <Space direction="vertical" size={4}>
          <Text type="secondary">变体</Text>
          <ShowcaseSelect
            value={variant}
            onChange={setVariant}
            options={VARIANT_OPTIONS}
            style={{ width: 180 }}
          />
        </Space>
        <Space direction="vertical" size={4}>
          <Text type="secondary">尺寸</Text>
          <Segmented
            value={size}
            onChange={(v) => setSize(v as ButtonSize)}
            options={[
              { label: "大", value: "large" },
              { label: "小", value: "small" },
            ]}
          />
        </Space>
        <Space direction="vertical" size={4}>
          <Text type="secondary">状态</Text>
          <Space>
            <Switch
              checked={disabled}
              onChange={(checked) => {
                setDisabled(checked);
                if (checked) setLoading(false);
              }}
              disabled={loading}
            />
            <Text>disabled</Text>
            <Switch
              checked={loading}
              onChange={(checked) => {
                setLoading(checked);
                if (checked) setDisabled(false);
              }}
              disabled={disabled}
            />
            <Text>loading</Text>
          </Space>
        </Space>
      </Flex>

      <Space size="large" wrap align="center">
        <SensButton
          tone={variant}
          size={size === "small" ? "small" : undefined}
          disabled={disabled}
          loading={loading}
        >
          {actionLabel}
        </SensButton>
        <Text type="secondary">鼠标悬停 / 点击查看 hover、active</Text>
      </Space>

      <Divider style={{ margin: 0 }} />

      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Text strong>FAB</Text>
        <FabDemo />
      </Space>

      <Divider style={{ margin: 0 }} />

      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Text strong>下拉按钮</Text>
        <Flex wrap gap={token.marginMD} align="flex-end">
          <Space direction="vertical" size={4}>
            <Text type="secondary">状态</Text>
            <Space>
              <Switch
                checked={dropdownDisabled}
                onChange={(checked) => {
                  setDropdownDisabled(checked);
                  if (checked) setDropdownLoading(false);
                }}
                disabled={dropdownLoading}
              />
              <Text>disabled</Text>
              <Switch
                checked={dropdownLoading}
                onChange={(checked) => {
                  setDropdownLoading(checked);
                  if (checked) setDropdownDisabled(false);
                }}
                disabled={dropdownDisabled}
              />
              <Text>loading</Text>
            </Space>
          </Space>
        </Flex>
        <SensDropdownButton
          items={MORE_MENU_DEMO_ITEMS}
          disabled={dropdownDisabled}
          loading={dropdownLoading}
          data-sens-demo="dropdown-more"
        >
          {moreLabel}
        </SensDropdownButton>
        <Text type="secondary">
          更多菜单：编辑/复制/删除 + 归档(disabled) + 加载中；点击展开（▲），非悬停
        </Text>
      </Space>
    </Space>
  );
}

export default function ButtonShowcasePage() {
  return (
    <ComponentShowcaseLayout
      title="按钮 Button"
      demo={<ButtonDemo />}
      matrix={
        <ButtonStatesPreview
          afterFabSection={
            <>
              <FabGroupStatesPreview />
              <FabVerticalGroupStatesPreview />
            </>
          }
        />
      }
      designDocSource={buttonDesignDoc}
      devDocSource={buttonDevDoc}
    />
  );
}
