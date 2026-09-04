import { useState, type ReactNode } from "react";
import { Divider, Segmented, Space, Typography } from "antd";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dropdownMenuDesignDoc from "../../design-system/components/base/dropdown-menu.design.md?raw";
import dropdownMenuDevDoc from "../../design-system/components/base/dropdown-menu.md?raw";
import type { PreviewOutletContext } from "../previewOutletContext";
import { SensIcon } from "../../design-system/icons";
import {
  DropdownMenuStatesPreview,
  SensButton,
  SensRadioGroup,
  type SelectDropdownLoadMoreState,
} from "../../ui";
import {
  SELECT_DROPDOWN_DEMO_WIDTH,
  SelectDropdownContentStatesPreview,
  SelectDropdownStatesPreview,
  SelectMultipleOptionStatesPreview,
  type SensSelectOption,
  SensSelectDropdown,
} from "../../ui/SensSelectDropdown";
import { SelectDropdownEmptyStatesPreview } from "../../ui/SelectDropdownEmptyStatesPreview";
import { DropdownMenuUsageScenarios } from "../DropdownMenuUsageScenarios";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";

const { Text } = Typography;
const I18N_NS = "组件库";

const DEMO_OPTIONS = [
  { value: "a", label: "选项 A" },
  { value: "b", label: "选项 B" },
  { value: "c", label: "选项 C" },
];

const DESCRIPTIVE_SINGLE_OPTIONS = [
  { value: "a", label: "选项 A", description: "辅助文案 A" },
  { value: "b", label: "选项 B", description: "辅助文案 B" },
  { value: "c", label: "选项 C", description: "辅助文案 C" },
];

const ICON_SINGLE_OPTIONS: SensSelectOption[] = [
  { value: "a", label: "选项 A", description: "辅助文案 A" },
  { value: "b", label: "选项 B", description: "辅助文案 B" },
  { value: "c", label: "选项 C", description: "辅助文案 C" },
];

const DESCRIPTIVE_MULTIPLE_OPTIONS = [
  { value: "a", label: "选项 A", description: "辅助文案 A" },
  { value: "b", label: "选项 B", description: "辅助文案 B" },
  { value: "c", label: "选项 C", description: "辅助文案 C" },
];

const MULTIPLE_DEMO_OPTIONS = Array.from({ length: 20 }, (_, index) => ({
  value: String(index + 1),
  label: `选项 ${index + 1}`,
}));

const SEARCH_DEMO_OPTIONS = [
  { value: "1", label: "北京" },
  { value: "2", label: "上海" },
  { value: "3", label: "广州" },
  { value: "4", label: "深圳" },
  { value: "5", label: "杭州" },
  { value: "6", label: "成都" },
  { value: "7", label: "武汉" },
  { value: "8", label: "西安" },
  { value: "xm", label: "项目" },
  {
    value: "cq",
    label: "重庆市",
    searchText: "chongqing chong qing cq",
  },
];

const GROUP_TITLE = "分类名称";
const GROUPED_DEMO_LEAVES = [
  ...Array.from({ length: 17 }, (_, index) => ({
    value: `g-${index + 1}`,
    label: `选项 ${index + 1}`,
  })),
  { value: "poem-1", label: "我欲乘风归去" },
  { value: "poem-2", label: "我住长江头" },
  { value: "poem-3", label: "我见青山多妩媚" },
];
const GROUPED_DEMO_OPTIONS = [0, 1, 2, 3].map((groupIndex) => ({
  label: GROUP_TITLE,
  options: GROUPED_DEMO_LEAVES.slice(groupIndex * 5, groupIndex * 5 + 5),
}));
const GROUPED_STATIC_DEMO_OPTIONS = GROUPED_DEMO_OPTIONS.slice(0, 2).map((group) => ({
  ...group,
  options: group.options.slice(0, 3),
}));
const GROUPED_DESCRIPTIVE_DEMO_OPTIONS = GROUPED_DEMO_OPTIONS.map((group) => ({
  ...group,
  options: group.options.map((option) => ({
    ...option,
    description: `辅助文案 ${option.label}`,
  })),
}));

type DropdownMode = "single" | "multiple";
type DropdownContent = "plain" | "descriptive";
type DropdownSearch = "none" | "searchable";
type DropdownIcons = "none" | "file";
type DropdownGroupStyle = "none" | "title" | "divider";
type DropdownDataVolume = "static" | "scroll";
type DropdownOperation = "none" | "confirm";

const LOAD_MORE_OPTIONS = Array.from({ length: 150 }, (_, index) => ({
  value: `load-more-${index + 1}`,
  label: `选项 ${index + 1}`,
}));

function DropdownDemoControl({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Space direction="vertical" size={4}>
      <Text type="secondary">{label}</Text>
      {children}
    </Space>
  );
}

function SelectDropdownLoadMoreDemo({
  mode,
  functionalSkin,
}: {
  mode: "single" | "multiple";
  functionalSkin: PreviewOutletContext["skin"];
}) {
  const [visibleCount, setVisibleCount] = useState(50);
  const [loadMoreState, setLoadMoreState] = useState<SelectDropdownLoadMoreState>("more");
  const options = LOAD_MORE_OPTIONS.slice(0, visibleCount);
  const isMultiple = mode === "multiple";
  const defaultValue = isMultiple ? options.slice(0, 2).map((option) => option.value) : options[0]?.value;
  const hasMore = visibleCount < LOAD_MORE_OPTIONS.length;

  const appendNextPage = () => {
    if (loadMoreState === "loading" || visibleCount >= LOAD_MORE_OPTIONS.length) return;
    setLoadMoreState("loading");
    window.setTimeout(() => {
      setVisibleCount((current) => Math.min(current + 50, LOAD_MORE_OPTIONS.length));
      setLoadMoreState("more");
    }, 500);
  };

  const retryLoad = () => {
    if (loadMoreState === "loading") return;
    setLoadMoreState("loading");
    window.setTimeout(() => {
      setVisibleCount((current) => Math.min(current + 50, LOAD_MORE_OPTIONS.length));
      setLoadMoreState("more");
    }, 500);
  };

  const resetLoadMore = () => {
    setVisibleCount(50);
    setLoadMoreState("more");
  };

  return (
    <div style={{ minWidth: 320 }}>
      <Text strong>{isMultiple ? "多选" : "单选"} · 每次加载 50 条</Text>
      <div style={{ marginTop: 4 }}>
        <Segmented
          value={loadMoreState}
          onChange={(value) => setLoadMoreState(value as SelectDropdownLoadMoreState)}
          options={[
            { label: "加载更多", value: "more" },
            { label: "加载中", value: "loading" },
            { label: "加载失败", value: "error" },
          ]}
        />
      </div>
      <div style={{ marginTop: 8 }}>
        <SensSelectDropdown
          functionalSkin={functionalSkin}
          mode={isMultiple ? "multiple" : undefined}
          multiDisplay={isMultiple ? "count" : undefined}
          options={options}
          defaultValue={defaultValue}
          defaultOpen={mode === "single"}
          loadMoreState={hasMore ? loadMoreState : undefined}
          onLoadMore={appendNextPage}
          onLoadMoreRetry={retryLoad}
          style={{ width: isMultiple ? undefined : SELECT_DROPDOWN_DEMO_WIDTH }}
        />
      </div>
      <Space size={8} align="center">
        <Text type="secondary">已加载 {visibleCount} 条</Text>
        {!hasMore ? (
          <SensButton tone="link" size="small" onClick={resetLoadMore}>
            重置
          </SensButton>
        ) : null}
      </Space>
    </div>
  );
}

function SelectDropdownDemo() {
  const { skin } = useOutletContext<PreviewOutletContext>();
  const { t } = useTranslation();
  const placeholder = t(`${I18N_NS}.sensd-select-placeholder`, { defaultValue: "请选择" });

  const [mode, setMode] = useState<DropdownMode>("single");
  const [content, setContent] = useState<DropdownContent>("plain");
  const [icons, setIcons] = useState<DropdownIcons>("none");
  const [search, setSearch] = useState<DropdownSearch>("none");
  const [groupStyle, setGroupStyle] = useState<DropdownGroupStyle>("none");
  const [dataVolume, setDataVolume] = useState<DropdownDataVolume>("static");
  const [operation, setOperation] = useState<DropdownOperation>("none");

  const isMultiple = mode === "multiple";
  const isGrouped = groupStyle !== "none";
  const isDescriptive = content === "descriptive";
  const baseOptions = isGrouped
    ? dataVolume === "scroll"
      ? isDescriptive
        ? GROUPED_DESCRIPTIVE_DEMO_OPTIONS
        : GROUPED_DEMO_OPTIONS
      : isDescriptive
        ? GROUPED_DESCRIPTIVE_DEMO_OPTIONS.slice(0, 2).map((group) => ({
            ...group,
            options: group.options.slice(0, 3),
          }))
        : GROUPED_STATIC_DEMO_OPTIONS
    : dataVolume === "scroll"
      ? MULTIPLE_DEMO_OPTIONS
      : isDescriptive
        ? isMultiple
          ? DESCRIPTIVE_MULTIPLE_OPTIONS
          : icons === "file"
            ? ICON_SINGLE_OPTIONS
            : DESCRIPTIVE_SINGLE_OPTIONS
        : search === "searchable"
          ? SEARCH_DEMO_OPTIONS
          : DEMO_OPTIONS;
  const options = (icons === "file"
    ? baseOptions.map((option) => {
        if ("options" in option && option.options) {
          return {
            ...option,
            options: (option.options as SensSelectOption[]).map((child: SensSelectOption) => ({
              ...child,
              icon: <SensIcon name="file" variant="filled" sizeToken="size/icon/m" color="currentColor" />,
            })),
          };
        }
        return {
          ...option,
          icon: <SensIcon name="file" variant="filled" sizeToken="size/icon/m" color="currentColor" />,
        };
      })
    : baseOptions) as SensSelectOption[];
  const selectableOptions = options.flatMap((option) =>
    "options" in option ? option.options : [option],
  );
  const selectedOptions = selectableOptions.slice(0, isMultiple ? (dataVolume === "scroll" ? 4 : 2) : 1);
  const defaultValue = isMultiple
    ? selectedOptions.map((option) => option.value)
    : selectedOptions[0]?.value;
  const demoKey = [mode, content, icons, search, groupStyle, dataVolume, operation].join("-");

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <DropdownDemoControl label="类型">
        <SensRadioGroup
          name="dropdown-demo-mode"
          value={mode}
          onChange={(value) => {
            const next = value as DropdownMode;
            setMode(next);
            if (next === "single") setOperation("none");
          }}
          options={[
            { value: "single", label: "单选" },
            { value: "multiple", label: "多选" },
          ]}
        />
      </DropdownDemoControl>
      <Space wrap align="end" size="middle">
        <DropdownDemoControl label="内容">
          <Segmented
            value={content}
            onChange={(value) => setContent(value as DropdownContent)}
            options={[
              { label: "普通", value: "plain" },
              { label: "双行辅助文案", value: "descriptive" },
            ]}
          />
        </DropdownDemoControl>
        <DropdownDemoControl label="图标">
          <Segmented
            value={icons}
            onChange={(value) => setIcons(value as DropdownIcons)}
            options={[
              { label: "无", value: "none" },
              { label: "图标", value: "file" },
            ]}
          />
        </DropdownDemoControl>
        <DropdownDemoControl label="搜索">
          <Segmented
            value={search}
            onChange={(value) => setSearch(value as DropdownSearch)}
            options={[
              { label: "无", value: "none" },
              { label: "有", value: "searchable" },
            ]}
          />
        </DropdownDemoControl>
        <DropdownDemoControl label="分组">
          <Segmented
            value={groupStyle}
            onChange={(value) => setGroupStyle(value as DropdownGroupStyle)}
            options={[
              { label: "无", value: "none" },
              { label: "面性分割", value: "title" },
              { label: "线性分割", value: "divider" },
            ]}
          />
        </DropdownDemoControl>
        <DropdownDemoControl label="数据量">
          <Segmented
            value={dataVolume}
            onChange={(value) => setDataVolume(value as DropdownDataVolume)}
            options={[
              { label: "无滚动", value: "static" },
              { label: "滚动", value: "scroll" },
            ]}
          />
        </DropdownDemoControl>
        {isMultiple ? (
          <DropdownDemoControl label="操作区">
            <Segmented
              value={operation}
              onChange={(value) => setOperation(value as DropdownOperation)}
              options={[
                { label: "无", value: "none" },
                { label: "有", value: "confirm" },
              ]}
            />
          </DropdownDemoControl>
        ) : null}
      </Space>
      <div data-testid="r2-select-demo">
        <SensSelectDropdown
          key={demoKey}
          functionalSkin={skin}
          multiDisplay={isMultiple ? "count" : undefined}
          widthPreset={isMultiple ? "148" : undefined}
          placeholder={placeholder}
          style={isMultiple ? undefined : { width: SELECT_DROPDOWN_DEMO_WIDTH }}
          options={options}
          defaultValue={defaultValue}
          defaultOpen
          searchable={search === "searchable"}
          searchMode={search === "searchable" ? "local" : undefined}
          groupStyle={groupStyle === "none" ? undefined : groupStyle}
          confirmMultiple={isMultiple ? operation === "confirm" : undefined}
        />
      </div>
      <SelectDropdownEmptyStatesPreview />
      <section>
        <Text strong>异步加载更多</Text>
        <div style={{ marginTop: 8 }}>
          <Space wrap size="large" align="start">
            <SelectDropdownLoadMoreDemo mode="single" functionalSkin={skin} />
            <SelectDropdownLoadMoreDemo mode="multiple" functionalSkin={skin} />
          </Space>
        </div>
      </section>
      {isDescriptive ? (
        <Text type="secondary">双行选项用于同时展示主文案和辅助文案，单选、多选规则保持一致。</Text>
      ) : null}
      {isGrouped ? (
        <Text type="secondary">分组搜索时会按规则打平选项，分组样式仅用于未输入搜索词时的展示。</Text>
      ) : null}
      {!isMultiple ? (
        <section>
          <Text strong>更多 · 单独的悬停菜单</Text>
          <br />
          <Text type="secondary">更多菜单不是选择器浮层，放在单选演示之后单独验收悬停触发。</Text>
          <div style={{ marginTop: 8 }}>
            <DropdownMenuUsageScenarios />
          </div>
        </section>
      ) : null}
      {icons === "file" ? (
        <Text type="secondary">图标选项同时支持单选、多选及辅助文案，图标使用 SensIcon file。</Text>
      ) : null}
      <Divider style={{ margin: 0 }} />
    </Space>
  );
}

function SelectDropdownMatrix() {
  const { skin } = useOutletContext<PreviewOutletContext>();
  const { t } = useTranslation();
  const label = (key: string, defaultValue: string) => t(`${I18N_NS}.${key}`, { defaultValue });

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <SelectDropdownStatesPreview title="R1 · 选项行 2×5" functionalSkin={skin} />
      <SelectMultipleOptionStatesPreview
        title="多选复选行 · 未选 / 已选 × 5 态"
        functionalSkin={skin}
      />
      <SelectDropdownContentStatesPreview title="R2 · 内容区六面" functionalSkin={skin} />
      <DropdownMenuStatesPreview
        title={label("sensd-dropdown-menu-matrix-title", "下拉菜单 / 选项行")}
      />
    </Space>
  );
}

export default function SelectDropdownShowcasePage() {
  return (
    <ComponentShowcaseLayout
      title="下拉浮层 Select Dropdown"
      demo={<SelectDropdownDemo />}
      matrix={<SelectDropdownMatrix />}
      designDocSource={dropdownMenuDesignDoc}
      devDocSource={dropdownMenuDevDoc}
    />
  );
}
