import { useMemo, useState, type CSSProperties } from "react";
import { Divider, Flex, Segmented, Space, Switch, Typography } from "antd";
import { useTranslation } from "react-i18next";
import buttonDesignDoc from "../../design-system/components/base/button.design.md?raw";
import buttonDevDoc from "../../design-system/components/base/button.md?raw";
import {
  ButtonStatesPreview,
  FabGroupStatesPreview,
  FabVerticalGroupStatesPreview,
  IconDefaultIcon,
  SensActionArea,
  SensButton,
  SensButtonActionMenu,
  SensDropdownButton,
  SensFabGroup,
  SensMoreButton,
  SensTips,
  type SensButtonVariant,
  type SensFabGroupItem,
  type SensFabVerticalGroupItem,
} from "../../ui";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";
import { ShowcaseSelect } from "../ShowcaseSelect";
import { getPreviewTokens } from "../previewTokens";

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
  { value: "dangerSecondaryWeak", label: "风险二级（hover 警告）" },
  { value: "dangerTertiary", label: "警告三级" },
  { value: "dangerTertiaryWeak", label: "风险三级（hover 警告）" },
  { value: "dangerLink", label: "警告链接" },
  { value: "dangerLinkEmphasis", label: "风险链接强调" },
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

/** 更多 ▼ demo：触发器是链接「更多」；菜单项 link 蓝字行 + 真禁用 + 真加载 */
const MORE_MENU_DEMO_ITEMS = [
  { key: "edit", label: "编辑", variant: "link" as const },
  { key: "copy", label: "复制", variant: "link" as const },
  { key: "delete", label: "删除", variant: "link" as const },
  { key: "archive", label: "归档", variant: "link" as const, disabled: true },
  { key: "sync", label: "同步", variant: "link" as const, loading: true },
];

const MORE_AGGREGATION_ITEMS = [
  { key: "blank", label: "创建空白画布", variant: "default" as const },
  { key: "template", label: "使用模板创建", variant: "default" as const },
];

const TABLE_DROPDOWN_ITEMS = [
  { key: "download", label: "下载", variant: "default" as const },
  { key: "copy", label: "复制", variant: "default" as const },
  { key: "delete", label: "删除", variant: "danger" as const },
];

function ActionAreaDemo() {
  const token = getPreviewTokens();
  const panelStyle: CSSProperties = {
    border: `${token.lineWidth}px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
    padding: token.padding,
    background: token.colorBgContainer,
  };
  const mutedPanelStyle: CSSProperties = {
    ...panelStyle,
    background: token.colorFillQuaternary,
  };

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Text strong>操作区 / Action Area 验收样张</Text>

      <div style={panelStyle}>
        <Flex align="center" justify="space-between" gap={token.margin} wrap>
          <Space direction="vertical" size={0}>
            <Text strong>页面标题</Text>
            <Text type="secondary">标题右侧操作区：弱操作在左，主操作在右</Text>
          </Space>
          <SensActionArea placement="header">
            <SensButton tone="tertiary">查看记录</SensButton>
            <SensButton tone="secondary">保存草稿</SensButton>
            <SensButton tone="primary">发布</SensButton>
          </SensActionArea>
        </Flex>
      </div>

      <Flex gap={token.margin} wrap>
        <div style={{ ...panelStyle, flex: "1 1 320px" }}>
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Text strong>实用尺寸 / 大尺寸 32</Text>
            <Text type="secondary">页面、抽屉、对话框等空间充裕场景</Text>
            <SensActionArea placement="footer">
              <SensButton tone="tertiary">取消</SensButton>
              <SensButton tone="secondary">保存草稿</SensButton>
              <SensButton tone="primary">提交</SensButton>
            </SensActionArea>
          </Space>
        </div>
        <div style={{ ...panelStyle, flex: "1 1 320px" }}>
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Text strong>实用尺寸 / 小尺寸 24</Text>
            <Text type="secondary">Popover、Dropdown 底部等空间有限场景</Text>
            <SensActionArea placement="footer" style={{ gap: token.marginSM }}>
              <SensButton tone="tertiary" size="small">
                取消
              </SensButton>
              <SensButton tone="secondary" size="small">
                二级按钮
              </SensButton>
              <SensButton tone="primary" size="small">
                一级按钮
              </SensButton>
            </SensActionArea>
          </Space>
        </div>
      </Flex>

      <div style={mutedPanelStyle}>
        <Flex vertical gap={token.margin}>
          <Text strong>对话框底部操作区</Text>
          <Text type="secondary">不同宿主位置不同，但优先级仍保持：三级 → 二级 → 一级</Text>
          <SensActionArea placement="footer">
            <SensButton tone="tertiary">取消</SensButton>
            <SensButton tone="secondary">上一步</SensButton>
            <SensButton tone="primary">确认提交</SensButton>
          </SensActionArea>
        </Flex>
      </div>

      <div style={panelStyle}>
        <Flex vertical gap={token.marginSM}>
          <Text strong>大量操作 / 收纳规则</Text>
          <Flex align="center" justify="space-between" gap={token.margin} wrap>
            <Text type="secondary">常规按钮 ≥5：同级高相关操作收进「更多」</Text>
            <SensActionArea placement="header">
              <SensButtonActionMenu items={MORE_AGGREGATION_ITEMS} tone="secondary" trigger={["hover"]}>
                <SensMoreButton tone="secondary">创建计划</SensMoreButton>
              </SensButtonActionMenu>
              <SensButton tone="secondary">导入</SensButton>
              <SensButton tone="primary">新建</SensButton>
            </SensActionArea>
          </Flex>
          <Flex align="center" justify="space-between" gap={token.margin} wrap>
            <Text type="secondary">表格操作列 ≥4：用链接按钮 + 下拉收起</Text>
            <SensActionArea placement="header">
              <SensButton tone="link">编辑</SensButton>
              <SensButton tone="linkWeak">复制</SensButton>
              <SensDropdownButton items={TABLE_DROPDOWN_ITEMS}>更多</SensDropdownButton>
            </SensActionArea>
          </Flex>
        </Flex>
      </div>

      <Flex gap={token.margin} wrap>
        <div style={{ ...panelStyle, flex: "1 1 280px" }}>
          <Space direction="vertical" size="small">
            <Text strong>虚线原位添加</Text>
            <Text type="secondary">必须有位置引导，图标必选且在文字左侧</Text>
            <SensButton tone="dashed">添加账号信息</SensButton>
          </Space>
        </div>
        <div style={{ ...panelStyle, flex: "1 1 320px" }}>
          <Space direction="vertical" size="small">
            <Text strong>警告场景</Text>
            <Text type="secondary">挽留默认红；其他风险默认不红，hover 才红</Text>
            <Space wrap>
              <SensButton tone="dangerSecondary">确认删除</SensButton>
              <SensButton tone="dangerSecondaryWeak">移除成员</SensButton>
              <SensButton tone="dangerLinkWeak">解绑</SensButton>
            </Space>
          </Space>
        </div>
        <div style={{ ...panelStyle, flex: "1 1 260px" }}>
          <Space direction="vertical" size="small">
            <Text strong>悬浮按钮 + Tips</Text>
            <Text type="secondary">FAB 必须解释操作含义</Text>
            <SensActionArea placement="floating">
              <SensTips title="回到顶部" placement="left">
                <span>
                  <SensButton fab tone="secondary" icon={<IconDefaultIcon />} aria-label="回到顶部" />
                </span>
              </SensTips>
            </SensActionArea>
          </Space>
        </div>
      </Flex>
    </Space>
  );
}

function buildHorizontalFabItems(
  contentType: FabContentType,
  count: FabSegmentCount,
  buttonLabel: string,
  disabled: boolean,
  loading: boolean,
): SensFabGroupItem[] {
  const showIcon = contentType === "icon" || contentType === "iconText";
  const showLabel = contentType !== "icon";

  return Array.from({ length: count }, (_, index) => ({
    label: showLabel ? buttonLabel : undefined,
    icon: showIcon ? <IconDefaultIcon /> : undefined,
    ariaLabel: showLabel ? undefined : `${buttonLabel}${index + 1}`,
    disabled,
    loading,
  }));
}

function buildVerticalFabItems(count: FabSegmentCount): SensFabVerticalGroupItem[] {
  return Array.from({ length: count }, (_, index) => ({
    icon: <IconDefaultIcon />,
    ariaLabel: `竖向 FAB 第${index + 1}段`,
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
        aria-label={showLabel ? undefined : actionLabel}
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
  const token = getPreviewTokens();
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
  const token = getPreviewTokens();
  const [variant, setVariant] = useState<SensButtonVariant>("primary");
  const [size, setSize] = useState<ButtonSize>("large");
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropdownDisabled, setDropdownDisabled] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState(false);

  const actionLabel = t("组件库.sensd-button-action-button", { defaultValue: "按钮" });
  const addLabel = t("组件库.sensd-button-action-add", { defaultValue: "添加" });
  const moreLabel = t("组件库.sensd-button-action-more", { defaultValue: "更多" });

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <ActionAreaDemo />

      <Divider style={{ margin: 0 }} />

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

      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <Text strong>Figma 验收样张</Text>
        <Space size="large" wrap align="center">
          <SensButton tone="dashed" size={size === "small" ? "small" : undefined}>
            {addLabel}
          </SensButton>
          <SensMoreButton tone="secondary" size={size === "small" ? "small" : undefined}>
            {moreLabel}
          </SensMoreButton>
          <SensButton tone="tertiary" size={size === "small" ? "small" : undefined}>
            {actionLabel}
          </SensButton>
          <SensButton fab tone="primary">
            {actionLabel}
          </SensButton>
          <SensButton fab tone="secondary" icon={<IconDefaultIcon />}>
            {actionLabel}
          </SensButton>
        </Space>
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
          更多菜单：编辑/复制/删除为链接蓝字行 + 归档(disabled) + 加载中；点击展开（▲），非悬停
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
