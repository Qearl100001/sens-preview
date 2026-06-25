import type { CSSProperties, ReactNode } from "react";
import { Input, Select, Space, type InputProps, type SelectProps } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MinimalSearchField, resolveMinimalSelectorLineTone } from "./MinimalSearchField";
import { useSensAllowClear, useSensSearchPrefix, useSensSelectSuffixProps } from "./fieldIconProps";
import { SearchIcon } from "./SearchIcon";
import { useSearchRootStyle, useSearchTokens } from "./searchTokens";
import "./search.css";

export const SEARCH_INPUT_DEFAULT_WIDTH = 200;
/** @deprecated 不再作为组件总宽；仅预览矩阵列宽估算（分类自适应 + 搜索 200px） */
export const SEARCH_CATEGORY_DEFAULT_WIDTH = 280;
export const SEARCH_TRIGGER_CATEGORY_PREVIEW_WIDTH = 312;
export const SEARCH_CATEGORY_MINIMAL_WIDTH = 272;
export const SEARCH_MINIMAL_CREATE_DEFAULT_WIDTH = 253;

/** i18n 文案在 zh.json 的「组件库」命名空间下 */
const I18N_NS = "组件库";

export type SearchVisualVariant = "default" | "minimal";

export type SearchPreviewState = "default" | "hover" | "focus" | "filled";

const PREVIEW_STATE_LABELS: Record<SearchPreviewState, string> = {
  default: "默认",
  hover: "Hover",
  focus: "聚焦",
  filled: "有输入（带清空）",
};

/** Figma 1601:10979 · 简约搜索预览态 */
export type MinimalSearchPreviewState =
  | "default"
  | "hoverSearch"
  | "clickSearch"
  | "activeSearch"
  | "hoverSelector"
  | "clickSelector"
  | "activeSelector";

const MINIMAL_SEARCH_PREVIEW_LABELS: Record<MinimalSearchPreviewState, string> = {
  default: "默认",
  hoverSearch: "悬停搜索",
  clickSearch: "点击搜索",
  activeSearch: "激活搜索",
  hoverSelector: "悬停选择器",
  clickSelector: "点击选择器",
  activeSelector: "激活选择器",
};

const MINIMAL_ONLY_PREVIEW_STATES: MinimalSearchPreviewState[] = [
  "default",
  "hoverSearch",
  "clickSearch",
  "activeSearch",
];

const MINIMAL_CATEGORY_PREVIEW_STATES: MinimalSearchPreviewState[] = [
  "default",
  "hoverSelector",
  "hoverSearch",
  "clickSelector",
  "clickSearch",
  "activeSelector",
  "activeSearch",
];

const FALLBACK_CATEGORY_OPTIONS = [
  { label: "用户名称", value: "name" },
  { label: "用户 ID", value: "id" },
] as NonNullable<SelectProps["options"]>;

function useCategoryOptions(options?: SelectProps["options"]) {
  const { t } = useTranslation();
  if (options) return options;
  return [
    {
      label: t(`${I18N_NS}.sensd-input-searchCategory`, { defaultValue: "分类" }),
      value: "category",
    },
    ...FALLBACK_CATEGORY_OPTIONS,
  ] as NonNullable<SelectProps["options"]>;
}

function useSearchPlaceholder(override?: string) {
  const { t } = useTranslation();
  return override ?? t(`${I18N_NS}.sensd-input-searchPlaceholder`, { defaultValue: "搜索" });
}

/** 输入框内搜索图标（Figma 803:171 · colorIcon） */
function SearchPrefix() {
  return useSensSearchPrefix();
}

/** 触发型按钮内搜索图标（白底描边按钮 · Figma 1574:12626 等） */
function SearchTriggerButtonIcon() {
  return <SearchIcon className="sens-search-trigger-btn-icon" />;
}

function useSearchAllowClear() {
  return useSensAllowClear();
}

function useCategorySelectProps(extraClassName?: string) {
  const selectSuffix = useSensSelectSuffixProps();
  return {
    ...selectSuffix,
    className: [extraClassName, selectSuffix.className].filter(Boolean).join(" "),
    style: { width: "auto", flex: "0 0 auto" } as CSSProperties,
    popupMatchSelectWidth: false,
  };
}

export interface SearchInputProps
  extends Omit<InputProps, "prefix" | "allowClear" | "variant" | "size"> {
  /** 定宽，默认 200px（规范 108–600px） */
  width?: number;
  /** 常规（描边）或简约（仅底部分割线）；均为 32px 高，无 small 尺寸 */
  visualVariant?: SearchVisualVariant;
  /** 简约：点返回清空后回调 */
  onBack?: () => void;
}

/** 实时型搜索：前缀图标 + allowClear，无搜索按钮（search.md） */
export function SearchInput({
  width = SEARCH_INPUT_DEFAULT_WIDTH,
  visualVariant = "default",
  style,
  className,
  placeholder,
  onBack,
  ...rest
}: SearchInputProps) {
  const allowClear = useSearchAllowClear();
  const rootStyle = useSearchRootStyle(style);
  const isMinimal = visualVariant === "minimal";
  const resolvedPlaceholder = useSearchPlaceholder(placeholder);

  if (isMinimal) {
    return (
      <MinimalSearchField
        width={width}
        className={className}
        style={rootStyle}
        placeholder={resolvedPlaceholder}
        onBack={onBack}
        {...rest}
      />
    );
  }

  return (
    <Input
      allowClear={allowClear}
      variant="outlined"
      prefix={<SearchPrefix />}
      placeholder={resolvedPlaceholder}
      style={{ width, ...rootStyle }}
      className={["sens-search-field", className].filter(Boolean).join(" ") || undefined}
      {...rest}
    />
  );
}

export interface CategorySearchInputProps
  extends Omit<InputProps, "prefix" | "allowClear" | "variant" | "size"> {
  searchWidth?: number;
  visualVariant?: SearchVisualVariant;
  categoryOptions?: SelectProps["options"];
  categoryValue?: string;
  defaultCategoryValue?: string;
  onCategoryChange?: (value: string) => void;
  onBack?: () => void;
  /** 预览板：强制分类 Select 展开（激活选择器） */
  categorySelectOpen?: boolean;
}

/** 实时型 + 左侧分类选择：Select(分类) + Input(搜索) 左右相接 */
export function CategorySearchInput({
  searchWidth = SEARCH_INPUT_DEFAULT_WIDTH,
  visualVariant = "default",
  categoryOptions,
  categoryValue,
  defaultCategoryValue = "category",
  onCategoryChange,
  style,
  className,
  disabled,
  placeholder,
  onBack,
  categorySelectOpen,
  ...rest
}: CategorySearchInputProps) {
  const allowClear = useSearchAllowClear();
  const rootStyle = useSearchRootStyle({
    "--sens-search-input-width": `${searchWidth}px`,
    ...style,
  } as CSSProperties);
  const categorySelectProps = useCategorySelectProps("sens-search-category-select");
  const resolvedCategoryOptions = useCategoryOptions(categoryOptions);
  const resolvedPlaceholder = useSearchPlaceholder(placeholder);

  const [selectorHovered, setSelectorHovered] = useState(false);
  const [selectorPressed, setSelectorPressed] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);

  const selectorLineTone = resolveMinimalSelectorLineTone({
    hovered: selectorHovered,
    pressed: selectorPressed,
    open: categorySelectOpen ?? selectorOpen,
  });

  const categorySelectOpenProps =
    categorySelectOpen === undefined
      ? { onOpenChange: setSelectorOpen }
      : { open: categorySelectOpen };

  const selectMinimal = (
    <Select
      {...categorySelectProps}
      {...categorySelectOpenProps}
      options={resolvedCategoryOptions}
      value={categoryValue}
      defaultValue={categoryValue === undefined ? defaultCategoryValue : undefined}
      onChange={onCategoryChange}
      variant="borderless"
    />
  );

  if (visualVariant === "minimal") {
    const input = (
      <MinimalSearchField
        width="100%"
        className="sens-search-minimal-category-input"
        placeholder={resolvedPlaceholder}
        onBack={onBack}
        style={rootStyle}
        {...rest}
      />
    );

    return (
      <div className={`sens-search-category--minimal ${className ?? ""}`} style={rootStyle}>
        <div
          className="sens-search-category-select-zone"
          data-line-tone={selectorLineTone}
          onMouseEnter={() => setSelectorHovered(true)}
          onMouseLeave={() => {
            setSelectorHovered(false);
            setSelectorPressed(false);
          }}
          onMouseDown={() => setSelectorPressed(true)}
          onMouseUp={() => setSelectorPressed(false)}
        >
          {selectMinimal}
          <span className="sens-search-category-zone-line" aria-hidden />
        </div>
        <span className="sens-search-category-divider" aria-hidden />
        <div className="sens-search-category-input-wrap">{input}</div>
      </div>
    );
  }

  const selectDefault = (
    <Select
      {...categorySelectProps}
      options={resolvedCategoryOptions}
      value={categoryValue}
      defaultValue={categoryValue === undefined ? defaultCategoryValue : undefined}
      onChange={onCategoryChange}
      variant="outlined"
    />
  );

  const input = (
    <Input
      allowClear={allowClear}
      className="sens-search-field sens-search-category-input"
      variant="outlined"
      prefix={<SearchPrefix />}
      placeholder={resolvedPlaceholder}
      disabled={disabled}
      style={rootStyle}
      {...rest}
    />
  );

  return (
    <Space.Compact className={`sens-search-category--default ${className ?? ""}`} style={rootStyle}>
      {selectDefault}
      {input}
    </Space.Compact>
  );
}

export interface SearchTriggerInputProps extends Omit<InputProps, "addonAfter" | "size"> {
  width?: number;
}

/** 触发型搜索：Input.Search，点击按钮 / 回车触发 */
export function SearchTriggerInput({
  width = SEARCH_INPUT_DEFAULT_WIDTH,
  style,
  disabled,
  placeholder,
  ...rest
}: SearchTriggerInputProps) {
  const allowClear = useSearchAllowClear();
  const rootStyle = useSearchRootStyle(style);
  const resolvedPlaceholder = useSearchPlaceholder(placeholder);

  return (
    <Input.Search
      allowClear={allowClear}
      className="sens-search-trigger"
      placeholder={resolvedPlaceholder}
      enterButton={<SearchTriggerButtonIcon />}
      disabled={disabled}
      style={{ width, ...rootStyle }}
      {...rest}
    />
  );
}

export interface CategorySearchTriggerInputProps extends SearchTriggerInputProps {
  searchWidth?: number;
  categoryOptions?: SelectProps["options"];
  categoryValue?: string;
  defaultCategoryValue?: string;
  onCategoryChange?: (value: string) => void;
}

/** 触发型 + 左侧分类选择 */
export function CategorySearchTriggerInput({
  searchWidth = SEARCH_INPUT_DEFAULT_WIDTH,
  categoryOptions,
  categoryValue,
  defaultCategoryValue = "category",
  onCategoryChange,
  style,
  className,
  disabled,
  placeholder,
  ...rest
}: CategorySearchTriggerInputProps) {
  const allowClear = useSearchAllowClear();
  const rootStyle = useSearchRootStyle({
    "--sens-search-trigger-block-width": `${searchWidth}px`,
    ...style,
  } as CSSProperties);
  const categorySelectProps = useCategorySelectProps("sens-search-category-select");
  const resolvedCategoryOptions = useCategoryOptions(categoryOptions);
  const resolvedPlaceholder = useSearchPlaceholder(placeholder);

  return (
    <Space.Compact className={`sens-search-trigger-category ${className ?? ""}`} style={rootStyle}>
      <Select
        {...categorySelectProps}
        options={resolvedCategoryOptions}
        value={categoryValue}
        defaultValue={categoryValue === undefined ? defaultCategoryValue : undefined}
        onChange={onCategoryChange}
        disabled={disabled}
      />
      <Input.Search
        allowClear={allowClear}
        className="sens-search-trigger"
        placeholder={resolvedPlaceholder}
        enterButton={<SearchTriggerButtonIcon />}
        disabled={disabled}
        {...rest}
      />
    </Space.Compact>
  );
}

export interface MinimalSearchWithCreateProps extends SearchInputProps {
  /** 是否显示右侧「创建」；默认 true */
  showCreate?: boolean;
  createLabel?: string;
  onCreate?: () => void;
  createDisabled?: boolean;
}

/** 简约实时搜索 + 可选右侧文字按钮「创建」 */
export function MinimalSearchWithCreate({
  width = SEARCH_MINIMAL_CREATE_DEFAULT_WIDTH,
  showCreate = true,
  createLabel,
  onCreate,
  createDisabled,
  className,
  style,
  disabled,
  onBack,
  ...rest
}: MinimalSearchWithCreateProps) {
  const rootStyle = useSearchRootStyle(style);

  return (
    <MinimalSearchField
      width={width}
      showCreate={showCreate}
      createLabel={createLabel}
      onCreate={onCreate}
      createDisabled={createDisabled}
      className={className}
      style={rootStyle}
      disabled={disabled}
      onBack={onBack}
      {...rest}
    />
  );
}

function previewWrapperClass(state: SearchPreviewState, extra?: string) {
  const simulated =
    state === "hover"
      ? "sens-search-preview--hover"
      : state === "focus"
        ? "sens-search-preview--focus"
        : "";
  return [simulated, extra].filter(Boolean).join(" ");
}

function previewInputProps(state: SearchPreviewState, filledValue: string) {
  return {
    defaultValue: state === "filled" ? filledValue : undefined,
    readOnly: state === "hover" || state === "focus",
  };
}

function minimalPreviewWrapperClass(state: MinimalSearchPreviewState): string {
  const map: Record<MinimalSearchPreviewState, string> = {
    default: "",
    hoverSearch: "sens-search-preview--minimal-hover-search",
    clickSearch: "sens-search-preview--minimal-click-search",
    activeSearch: "sens-search-preview--minimal-active-search",
    hoverSelector: "sens-search-preview--minimal-hover-selector",
    clickSelector: "sens-search-preview--minimal-click-selector",
    activeSelector: "sens-search-preview--minimal-active-selector",
  };
  return map[state];
}

function minimalPreviewInputProps(filled: boolean, filledValue: string) {
  return {
    defaultValue: filled ? filledValue : undefined,
  };
}

interface StateRowProps {
  filledValue: string;
  itemWidth: number;
  render: (state: SearchPreviewState, props: ReturnType<typeof previewInputProps>) => ReactNode;
}

function SearchStateRow({ filledValue, itemWidth, render }: StateRowProps) {
  const states: SearchPreviewState[] = ["default", "hover", "focus", "filled"];

  return (
    <div className="sens-search-matrix-states">
      {states.map((state) => (
        <div key={state} className="sens-search-matrix-cell" style={{ width: itemWidth }}>
          <span className="sens-search-preview-label">{PREVIEW_STATE_LABELS[state]}</span>
          <div className={previewWrapperClass(state)}>
            {render(state, previewInputProps(state, filledValue))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface VariantMatrixRowProps {
  title: string;
  filledValue: string;
  itemWidth: number;
  render: (state: SearchPreviewState, props: ReturnType<typeof previewInputProps>) => ReactNode;
}

function VariantMatrixRow({ title, filledValue, itemWidth, render }: VariantMatrixRowProps) {
  return (
    <div className="sens-search-matrix-row">
      <span className="sens-search-matrix-variant-title">{title}</span>
      <SearchStateRow filledValue={filledValue} itemWidth={itemWidth} render={render} />
    </div>
  );
}

interface MinimalStateRowProps {
  filled: boolean;
  filledValue: string;
  itemWidth: number;
  states: MinimalSearchPreviewState[];
  render: (
    state: MinimalSearchPreviewState,
    props: ReturnType<typeof minimalPreviewInputProps>,
  ) => ReactNode;
}

function MinimalSearchStateRow({ filled, filledValue, itemWidth, states, render }: MinimalStateRowProps) {
  return (
    <div className="sens-search-matrix-states">
      {states.map((state) => (
        <div key={state} className="sens-search-matrix-cell" style={{ width: itemWidth }}>
          <span className="sens-search-preview-label">{MINIMAL_SEARCH_PREVIEW_LABELS[state]}</span>
          <div className={minimalPreviewWrapperClass(state)}>
            {render(state, minimalPreviewInputProps(filled, filledValue))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface MinimalVariantMatrixRowProps {
  title: string;
  filledValue: string;
  itemWidth: number;
  states: MinimalSearchPreviewState[];
  render: (
    state: MinimalSearchPreviewState,
    props: ReturnType<typeof minimalPreviewInputProps>,
  ) => ReactNode;
}

function MinimalVariantMatrixRow({
  title,
  filledValue,
  itemWidth,
  states,
  render,
}: MinimalVariantMatrixRowProps) {
  return (
    <div className="sens-search-matrix-row">
      <span className="sens-search-matrix-variant-title">{title}</span>
      <MinimalSearchStateRow
        filled={title.includes("已输入")}
        filledValue={filledValue}
        itemWidth={itemWidth}
        states={states}
        render={render}
      />
    </div>
  );
}

export interface SearchStatesPreviewProps {
  filledValue?: string;
}

/** Figma 813:276 / 2216:10655 变体×状态矩阵 */
export function SearchStatesPreview({ filledValue = "用户名称" }: SearchStatesPreviewProps) {
  const { t } = useTranslation();
  const { previewVars } = useSearchTokens();
  const placeholder = t(`${I18N_NS}.sensd-input-searchPlaceholder`, { defaultValue: "搜索" });
  const categoryOnlyOptions: SelectProps["options"] = [
    { label: t(`${I18N_NS}.sensd-input-searchCategory`, { defaultValue: "分类" }), value: "category" },
  ];

  return (
    <div className="sens-search-matrix" style={previewVars}>
      <VariantMatrixRow
        title="搜索 / 实时 · 常规"
        filledValue={filledValue}
        itemWidth={SEARCH_INPUT_DEFAULT_WIDTH}
        render={(_state, props) => (
          <SearchInput visualVariant="default" placeholder={placeholder} {...props} />
        )}
      />

      <VariantMatrixRow
        title="搜索 / 实时 · 带分类 · 常规"
        filledValue={filledValue}
        itemWidth={SEARCH_CATEGORY_DEFAULT_WIDTH}
        render={(_state, props) => (
          <CategorySearchInput
            visualVariant="default"
            placeholder={placeholder}
            categoryOptions={categoryOnlyOptions}
            {...props}
          />
        )}
      />

      <VariantMatrixRow
        title="搜索 / 触发"
        filledValue={filledValue}
        itemWidth={SEARCH_INPUT_DEFAULT_WIDTH}
        render={(_state, props) => <SearchTriggerInput placeholder={placeholder} {...props} />}
      />

      <VariantMatrixRow
        title="搜索 / 触发 · 带分类"
        filledValue={filledValue}
        itemWidth={SEARCH_TRIGGER_CATEGORY_PREVIEW_WIDTH}
        render={(_state, props) => (
          <CategorySearchTriggerInput
            placeholder={placeholder}
            categoryOptions={categoryOnlyOptions}
            {...props}
          />
        )}
      />

      <MinimalVariantMatrixRow
        title="搜索 / 实时 · 简约（未输入）"
        filledValue={filledValue}
        itemWidth={SEARCH_INPUT_DEFAULT_WIDTH}
        states={MINIMAL_ONLY_PREVIEW_STATES}
        render={(_state, props) => (
          <SearchInput visualVariant="minimal" placeholder={placeholder} {...props} />
        )}
      />

      <MinimalVariantMatrixRow
        title="搜索 / 实时 · 简约（已输入）"
        filledValue={filledValue}
        itemWidth={SEARCH_INPUT_DEFAULT_WIDTH}
        states={MINIMAL_ONLY_PREVIEW_STATES}
        render={(_state, props) => (
          <SearchInput visualVariant="minimal" placeholder={placeholder} {...props} />
        )}
      />

      <MinimalVariantMatrixRow
        title="搜索 / 实时 · 简约 · 带分类（未输入）"
        filledValue={filledValue}
        itemWidth={SEARCH_CATEGORY_MINIMAL_WIDTH}
        states={MINIMAL_CATEGORY_PREVIEW_STATES}
        render={(state, props) => (
          <CategorySearchInput
            visualVariant="minimal"
            placeholder={placeholder}
            categoryOptions={categoryOnlyOptions}
            {...props}
          />
        )}
      />

      <MinimalVariantMatrixRow
        title="搜索 / 实时 · 简约 · 带分类（已输入）"
        filledValue={filledValue}
        itemWidth={SEARCH_CATEGORY_MINIMAL_WIDTH}
        states={MINIMAL_CATEGORY_PREVIEW_STATES}
        render={(state, props) => (
          <CategorySearchInput
            visualVariant="minimal"
            placeholder={placeholder}
            categoryOptions={categoryOnlyOptions}
            {...props}
          />
        )}
      />

      <MinimalVariantMatrixRow
        title="搜索 / 实时 · 简约 · 带创建（未输入）"
        filledValue={filledValue}
        itemWidth={SEARCH_MINIMAL_CREATE_DEFAULT_WIDTH}
        states={MINIMAL_ONLY_PREVIEW_STATES}
        render={(_state, props) => (
          <MinimalSearchWithCreate placeholder={placeholder} {...props} />
        )}
      />

      <MinimalVariantMatrixRow
        title="搜索 / 实时 · 简约 · 带创建（已输入）"
        filledValue={filledValue}
        itemWidth={SEARCH_MINIMAL_CREATE_DEFAULT_WIDTH}
        states={MINIMAL_ONLY_PREVIEW_STATES}
        render={(_state, props) => (
          <MinimalSearchWithCreate placeholder={placeholder} {...props} />
        )}
      />
    </div>
  );
}

export { useSearchTokens, useSearchRootStyle } from "./searchTokens";
