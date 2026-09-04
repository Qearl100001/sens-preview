import { useState, type ReactNode } from "react";
import { Segmented, Space, Switch, Typography } from "antd";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import selectDesignDoc from "../../design-system/components/base/select.design.md?raw";
import selectDevDoc from "../../design-system/components/base/select.md?raw";
import type { PreviewOutletContext } from "../previewOutletContext";
import {
  SELECT_COUNT_MAX,
  SELECT_DROPDOWN_DEMO_WIDTH,
  SelectCountTriggerStatesPreview,
  SelectSimpleTriggerStatesPreview,
  SelectTagsTriggerStatesPreview,
  SelectTriggerStatesPreview,
  SensSelectDropdown,
} from "../../ui/SensSelectDropdown";
import { SensRadioGroup } from "../../ui";
import { SensInput } from "../../ui/SensInput";
import type { SensInputReadOnlyVariant } from "../../ui/SensInput";
import { SensLineTabs } from "../../ui/SensTabs";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";

const { Text } = Typography;
const I18N_NS = "组件库";

const DEMO_OPTIONS = [
  { value: "a", label: "选项 A" },
  { value: "b", label: "选项 B" },
  { value: "c", label: "选项 C" },
];

const ADAPTIVE_DEMO_OPTIONS = [
  { value: "a", label: "选项 A" },
  { value: "long", label: "已选择较长名称的配置项" },
];

const COUNT_DEMO_OPTIONS = [
  { value: "a", label: "选项 A" },
  { value: "b", label: "选项 B" },
  { value: "c", label: "选项 C" },
  { value: "d", label: "选项 D" },
  { value: "e", label: "选项 E" },
  { value: "f", label: "选项 F" },
];

const COUNT_OVERFLOW_OPTIONS = Array.from({ length: SELECT_COUNT_MAX + 1 }, (_, index) => ({
  value: index,
  label: `选项 ${index + 1}`,
}));
const COUNT_OVERFLOW_VALUES = COUNT_OVERFLOW_OPTIONS.map((item) => item.value);
const TAGS_CITY_OPTIONS = [
  { value: "beijing", label: "北京" },
  { value: "long", label: "名字很长很长很长很长" },
  { value: "guangzhou", label: "广州" },
  { value: "shenzhen", label: "深圳" },
  { value: "hangzhou", label: "杭州" },
  { value: "chengdu", label: "成都" },
  { value: "shanghai", label: "上海" },
  { value: "nanjing", label: "南京" },
  { value: "wuhan", label: "武汉" },
  { value: "xian", label: "西安" },
  { value: "chongqing", label: "重庆" },
  { value: "tianjin", label: "天津" },
  { value: "suzhou", label: "苏州" },
  { value: "changsha", label: "长沙" },
  { value: "zhengzhou", label: "郑州" },
  { value: "qingdao", label: "青岛" },
  { value: "ningbo", label: "宁波" },
  { value: "dongguan", label: "东莞" },
  { value: "hefei", label: "合肥" },
  { value: "foshan", label: "佛山" },
  { value: "urumqi", label: "乌鲁木齐" },
  { value: "hohhot", label: "呼和浩特" },
  { value: "harbin", label: "哈尔滨" },
  { value: "shijiazhuang", label: "石家庄" },
  { value: "long2", label: "名字也很长很长很长" },
  { value: "kunming", label: "昆明" },
  { value: "nanning", label: "南宁" },
  { value: "fuzhou", label: "福州" },
  { value: "xiamen", label: "厦门" },
  { value: "long3", label: "超长配置名称请截断" },
  { value: "nanchang", label: "南昌" },
  { value: "hefei2", label: "合肥高新" },
  { value: "taiyuan", label: "太原" },
  { value: "lanzhou", label: "兰州" },
  { value: "long4", label: "名字很长很长很长很长" },
  { value: "yinchuan", label: "银川" },
  { value: "xining", label: "西宁" },
  { value: "haikou", label: "海口" },
  { value: "lhasa", label: "拉萨" },
  { value: "long5", label: "再来一个超长标签名" },
];
const TAGS_CITY_VALUES = TAGS_CITY_OPTIONS.map((item) => item.value);

type DemoMode = "single" | "multiple";
type DemoSingleStyle = "basic" | "simple";
type DemoMultipleStyle = "count" | "tags";
type DemoContent = "empty" | "filled" | "overflow";
type DemoWarning = "none" | "inside" | "outside";
type DemoSingleWidth = "fixed" | "adaptive";
type DemoCountWidth = "128" | "148";
type DemoTagsWidth = "320" | "adaptive";
type DemoTagsLayout = "single" | "wrap";
type DemoReadOnly = "none" | "filled" | "plain";
type DemoPanel = "regular" | "readonly";
type DemoReadOnlyMode = "single" | "multiple";

function DemoControl({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Space direction="vertical" size={4}>
      <Text type="secondary">{label}</Text>
      {children}
    </Space>
  );
}

function SelectDemo() {
  const { skin } = useOutletContext<PreviewOutletContext>();
  const { t } = useTranslation();
  const placeholder = t(`${I18N_NS}.sensd-select-placeholder`, { defaultValue: "请选择" });

  const [demoPanel, setDemoPanel] = useState<DemoPanel>("regular");
  const [mode, setMode] = useState<DemoMode>("single");
  const [singleStyle, setSingleStyle] = useState<DemoSingleStyle>("basic");
  const [multipleStyle, setMultipleStyle] = useState<DemoMultipleStyle>("count");
  const [content, setContent] = useState<DemoContent>("filled");
  const [warning, setWarning] = useState<DemoWarning>("none");
  const [singleWidth, setSingleWidth] = useState<DemoSingleWidth>("fixed");
  const [countWidth, setCountWidth] = useState<DemoCountWidth>("148");
  const [tagsWidth, setTagsWidth] = useState<DemoTagsWidth>("320");
  const [tagsLayout, setTagsLayout] = useState<DemoTagsLayout>("single");
  const [readOnly, setReadOnly] = useState<DemoReadOnly>("none");
  const [confirmMultiple, setConfirmMultiple] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [clearable, setClearable] = useState(false);
  const [loading, setLoading] = useState(false);

  const isSingle = mode === "single";
  const isSimple = isSingle && singleStyle === "simple";
  const isBasic = isSingle && singleStyle === "basic";
  const isCount = !isSingle && multipleStyle === "count";
  const isTags = !isSingle && multipleStyle === "tags";
  const readOnlyVariant: SensInputReadOnlyVariant | undefined =
    isTags && readOnly !== "none" ? readOnly : undefined;

  const handleModeChange = (next: DemoMode) => {
    setMode(next);
    setClearable(false);
    setLoading(false);
    if (next === "multiple") {
      setMultipleStyle("count");
      setWarning("none");
      setReadOnly("none");
    } else if (content === "overflow") {
      setContent("filled");
    }
  };

  const handleSingleStyleChange = (next: DemoSingleStyle) => {
    setSingleStyle(next);
    setClearable(false);
    if (next === "simple" && warning === "inside") setWarning("outside");
  };

  const handleMultipleStyleChange = (next: DemoMultipleStyle) => {
    setMultipleStyle(next);
    setClearable(false);
    setReadOnly("none");
    if (next === "tags" && content === "overflow") setContent("filled");
  };

  const options = isCount
    ? content === "overflow"
      ? COUNT_OVERFLOW_OPTIONS
      : COUNT_DEMO_OPTIONS
    : isTags
      ? TAGS_CITY_OPTIONS
      : isBasic && singleWidth === "adaptive"
        ? ADAPTIVE_DEMO_OPTIONS
        : DEMO_OPTIONS;

  const defaultValue =
    content === "empty"
      ? undefined
      : content === "overflow"
        ? COUNT_OVERFLOW_VALUES
        : isCount
          ? ["a", "b"]
          : isTags
            ? TAGS_CITY_VALUES
            : isBasic && singleWidth === "adaptive"
            ? "long"
            : "b";

  const warningPlacement =
    warning === "none" || disabled
      ? undefined
      : warning === "inside" && isSimple
        ? "outside"
        : warning;

  const demoKey = [
    mode,
    singleStyle,
    multipleStyle,
    content,
    warning,
    singleWidth,
    countWidth,
    tagsWidth,
    tagsLayout,
    readOnly,
    confirmMultiple,
    disabled,
    clearable,
    loading,
  ].join("-");

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <SensLineTabs
        size="small"
        barOnly
        activeKey={demoPanel}
        onChange={(key) => setDemoPanel(key as DemoPanel)}
        items={[
          { key: "regular", label: "常规" },
          { key: "readonly", label: "只读" },
        ]}
      />
      {demoPanel === "regular" ? (
        <>
          <DemoControl label="类型">
            <SensRadioGroup
              name="select-regular-mode"
              value={mode}
              onChange={(value) => handleModeChange(value as DemoMode)}
              options={[
                { value: "single", label: "单选" },
                { value: "multiple", label: "多选" },
              ]}
            />
          </DemoControl>
          {isSingle ? (
            <Segmented
              value={singleStyle}
              onChange={(value) => handleSingleStyleChange(value as DemoSingleStyle)}
              options={[
                { label: "基础型", value: "basic" },
                { label: "简约型", value: "simple" },
              ]}
            />
          ) : (
            <Segmented
              value={multipleStyle}
              onChange={(value) => handleMultipleStyleChange(value as DemoMultipleStyle)}
              options={[
                { label: "个数型", value: "count" },
                { label: "展示型", value: "tags" },
              ]}
            />
          )}
          <Space wrap align="end" size="middle">
            <DemoControl label="内容">
              <Segmented
                value={content === "overflow" && !isCount ? "filled" : content}
                onChange={(value) => setContent(value as DemoContent)}
                options={
                  isCount
                    ? [
                        { label: "未选", value: "empty" },
                        { label: "已选", value: "filled" },
                        { label: "999+", value: "overflow" },
                      ]
                    : [
                        { label: "未选", value: "empty" },
                        { label: "已选", value: "filled" },
                      ]
                }
              />
            </DemoControl>
            {isSingle || isCount || isTags ? (
              <DemoControl label="警告">
                <Segmented
                  value={warning === "none" ? "none" : isSimple ? "outside" : warning}
                  disabled={disabled}
                  onChange={(value) =>
                    setWarning(value === "none" ? "none" : (value as DemoWarning))
                  }
                  options={
                    isSimple
                      ? [
                          { label: "无", value: "none" },
                          { label: "警告", value: "outside" },
                        ]
                      : [
                          { label: "无", value: "none" },
                          { label: "框内", value: "inside" },
                          { label: "框外", value: "outside" },
                        ]
                  }
                />
              </DemoControl>
            ) : null}
            {isBasic ? (
              <DemoControl label="宽度">
                <Segmented
                  value={singleWidth}
                  onChange={(value) => setSingleWidth(value as DemoSingleWidth)}
                  options={[
                    { label: "固定", value: "fixed" },
                    { label: "自适应", value: "adaptive" },
                  ]}
                />
              </DemoControl>
            ) : null}
            {isCount ? (
              <DemoControl label="宽度">
                <Segmented
                  value={countWidth}
                  onChange={(value) => setCountWidth(value as DemoCountWidth)}
                  options={[
                    { label: "128", value: "128" },
                    { label: "148", value: "148" },
                  ]}
                />
              </DemoControl>
            ) : null}
            {isTags ? (
              <DemoControl label="排法">
                <Segmented
                  value={tagsLayout}
                  onChange={(value) => setTagsLayout(value as DemoTagsLayout)}
                  options={[
                    { label: "单行", value: "single" },
                    { label: "多行", value: "wrap" },
                  ]}
                />
              </DemoControl>
            ) : null}
            {isTags && tagsLayout === "single" ? (
              <DemoControl label="宽度">
                <Segmented
                  value={tagsWidth}
                  onChange={(value) => setTagsWidth(value as DemoTagsWidth)}
                  options={[
                    { label: "320", value: "320" },
                    { label: "自适应", value: "adaptive" },
                  ]}
                />
              </DemoControl>
            ) : null}
            {isTags && !readOnlyVariant ? (
              <DemoControl label="上屏">
                <Segmented
                  value={confirmMultiple ? "confirm" : "live"}
                  onChange={(value) => setConfirmMultiple(value === "confirm")}
                  options={[
                    { label: "确认", value: "confirm" },
                    { label: "实时", value: "live" },
                  ]}
                />
              </DemoControl>
            ) : null}
            {isTags ? (
              <DemoControl label="只读">
                <Segmented
                  value={readOnly}
                  onChange={(value) => {
                    setReadOnly(value as DemoReadOnly);
                    if (value !== "none") {
                      setDisabled(false);
                      setLoading(false);
                    }
                  }}
                  options={[
                    { label: "无", value: "none" },
                    { label: "有背景", value: "filled" },
                    { label: "字段", value: "plain" },
                  ]}
                />
              </DemoControl>
            ) : null}
            {isBasic || isCount ? (
              <DemoControl label="清空">
                <Switch checked={clearable} disabled={disabled} onChange={setClearable} />
              </DemoControl>
            ) : null}
            <DemoControl label="禁用">
              <Switch
                checked={disabled}
                disabled={Boolean(readOnlyVariant)}
                onChange={(checked) => {
                  setDisabled(checked);
                  if (checked) setLoading(false);
                }}
              />
            </DemoControl>
            {isCount || isTags ? (
              <DemoControl label="加载">
                <Switch
                  checked={loading}
                  disabled={disabled || Boolean(readOnlyVariant)}
                  onChange={(checked) => {
                    setLoading(checked);
                    if (checked) setDisabled(false);
                  }}
                />
              </DemoControl>
            ) : null}
          </Space>

          <div data-testid="r3-select-demo">
            <SensSelectDropdown
              key={demoKey}
              functionalSkin={skin}
              appearance={isSimple ? "simple" : undefined}
              multiDisplay={isCount ? "count" : isTags ? "tags" : undefined}
              placeholder={placeholder}
              options={options}
              defaultValue={defaultValue}
              widthPreset={
                isCount
                  ? countWidth
                  : isTags && tagsLayout === "wrap"
                    ? "600"
                    : isTags && tagsWidth === "320"
                      ? "320"
                      : isBasic && singleWidth === "fixed"
                        ? "148"
                        : undefined
              }
              widthMode={
                (isBasic && singleWidth === "adaptive") ||
                (isTags && tagsLayout === "single" && tagsWidth === "adaptive")
                  ? "adaptive"
                  : undefined
              }
              warningPlacement={warningPlacement}
              help={(isBasic || isTags) && warningPlacement ? "警告文案" : undefined}
              clearable={isBasic || isCount ? clearable : false}
              disabled={disabled}
              loading={isCount || isTags ? loading : false}
              readOnlyVariant={readOnlyVariant}
              confirmMultiple={isTags ? confirmMultiple : undefined}
              tagsWrap={isTags && tagsLayout === "wrap"}
            />
          </div>
          <Text type="secondary">悬停 / 激活请用鼠标交互；全态见下方矩阵</Text>
        </>
      ) : (
        <SelectReadOnlyDemo />
      )}
    </Space>
  );
}

function SelectReadOnlyDemo() {
  const { t } = useTranslation();
  const placeholder = t(`${I18N_NS}.sensd-select-placeholder`, { defaultValue: "请选择" });
  const [readOnlyMode, setReadOnlyMode] = useState<DemoReadOnlyMode>("single");
  const isSingle = readOnlyMode === "single";
  const commonProps = isSingle
    ? {
        options: DEMO_OPTIONS,
        defaultValue: "b",
        placeholder,
        widthPreset: "148" as const,
      }
    : {
        options: TAGS_CITY_OPTIONS,
        defaultValue: TAGS_CITY_VALUES.slice(0, 6),
        placeholder,
        multiDisplay: "tags" as const,
        widthPreset: "320" as const,
      };

  const examples: Array<{
    key: string;
    label: string;
    description: string;
    variant: SensInputReadOnlyVariant;
  }> = [
    {
      key: "plain",
      label: "无背景",
      description: "无底色文本展示；空态显示「未设置」，长内容悬停显示 SensTips。",
      variant: "plain",
    },
    {
      key: "filled",
      label: "有背景",
      description: "灰底只读态；不出现箭头，不进入下拉选择。",
      variant: "filled",
    },
    {
      key: "field",
      label: "字段",
      description: "字段承载场景；当前复用只读无背景能力，后续如有独立规格再拆 token。",
      variant: "plain",
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <DemoControl label="类型">
        <SensRadioGroup
          name="select-readonly-mode"
          value={readOnlyMode}
          onChange={(value) => setReadOnlyMode(value as DemoReadOnlyMode)}
          options={[
            { value: "single", label: "单选只读" },
            { value: "multiple", label: "多选只读" },
          ]}
        />
      </DemoControl>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        {examples.map((example) => (
          <Space key={`${readOnlyMode}-${example.key}`} direction="vertical" size={6}>
            <Text strong>{isSingle ? "单选只读" : "多选只读"} / {example.label}</Text>
            <Text type="secondary">{example.description}</Text>
            <SensSelectDropdown
              {...commonProps}
              readOnlyVariant={example.variant}
            />
          </Space>
        ))}
      </Space>
    </Space>
  );
}

function SelectMatrix() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <SelectTriggerStatesPreview title="触发框 · 3 警告 × 2 内容 × 5 态（32px）" />
      <SelectSimpleTriggerStatesPreview title="简约型 · 无 / 警告 × 未选 / 已选 × 6 态（无边框；禁用+警告无对应）" />
      <SelectCountTriggerStatesPreview title="个数型 · 128 / 148 × 未选 / 已选 × 7 态（32px）" />
      <SelectTagsTriggerStatesPreview title="展示型 · 320 × 未选 / 已选 × 7 态 + 只读 / 只读警告" />
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
