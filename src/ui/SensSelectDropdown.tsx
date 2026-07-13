import { Select, theme, type SelectProps } from "antd";
import { useCallback, useMemo, type CSSProperties, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { buildShadowD4, getColorToken, tokenRgba } from "../design-system/color-utils";
import { getDividerColor } from "../design-system/divider";
import {
  getFunctionalColors,
  type FunctionalSkin,
} from "../design-system/functional-skin";
import { getUnitToken } from "../design-system/unit";
import { useSensSelectTriggerProps } from "./fieldIconProps";
import {
  SELECT_CHECK_ICON_SIZE,
  SelectCheckIcon,
} from "./FieldIcons";
import type { SelectOptionFilterMatcher } from "./matchSelectOption";
import { SearchHighlight } from "./SearchHighlight";
import {
  InsideErrorSuffix,
  InputHelpRow,
  useSensInputHeightStyle,
  type SensInputWarningPlacement,
} from "./SensInput";
import { SelectDropdownBody } from "./SelectDropdownBody";
import { SelectDropdownSearch } from "./SelectDropdownSearch";
import {
  type SelectDropdownContentPhase,
  type SelectDropdownSearchMode,
  useSelectDropdownSearch,
} from "./useSelectDropdownSearch";
import "./select-dropdown.css";
import "./select-dropdown-preview.css";
import "./select-trigger.css";
import "./select-trigger-preview.css";

const I18N_NS = "组件库";

export const SELECT_OPTION_HEIGHT = 34;
export const SELECT_DROPDOWN_MATRIX_CELL_WIDTH = 160;
export const SELECT_DROPDOWN_CONTENT_MATRIX_CELL_WIDTH = 200;
export const SELECT_DROPDOWN_DEMO_WIDTH = 200;
export const SELECT_TRIGGER_MATRIX_CELL_WIDTH = 200;
const SELECT_TRIGGER_FIELD_WIDTH = 200;

/** R3 触发框 CSS 变量（字段色与 SensInput 同源） */
export function useSensSelectTriggerStyle(size?: SelectProps["size"]): CSSProperties {
  const { token } = theme.useToken();
  const fieldVars = useSensInputHeightStyle();

  return {
    ...fieldVars,
    "--sens-select-hover-border-color": token.colorPrimary,
    "--sens-select-active-border-color": token.colorPrimaryActive,
    "--sens-select-active-shadow": `0 0 0 2px ${tokenRgba("component-active-shadow", 0.2)}`,
    "--sens-select-error-hover-border-color": token.colorErrorHover,
    "--sens-select-error-active-border-color": token.colorErrorActive,
    "--sens-select-error-active-shadow": `0 0 0 2px ${tokenRgba("warning-color-active-shadow", 0.2)}`,
    "--sens-select-placeholder-color": tokenRgba("text-color-transparent-disable", 0.3),
    "--sens-select-border-disabled": getDividerColor("light", "transparent"),
    "--sens-select-arrow-color": getColorToken("icon-color-transparent"),
    "--sens-select-arrow-color-disabled": tokenRgba("icon-color-transparent-disable", 0.3),
    "--sens-select-icon-hover-color": token.colorIconHover,
  } as CSSProperties;
}

/** 勾选色：中性图标，不随功能色换肤 */
const SELECT_CHECK_COLOR = getColorToken("icon-color-transparent");
const SELECT_CHECK_COLOR_DISABLED = tokenRgba("icon-color-transparent-disable", 0.3);
const SELECT_CHECK_COLOR_DISABLED_HOVER = tokenRgba("icon-color-transparent-disable-hover", 0.24);

/** Figma 17767:72632 · 上 6 = spacing/1.5x；下 10 = spacing/vertical/2.5x */
function selectDropdownSpacing() {
  const blockStart = getUnitToken("spacing/1.5x");
  return {
    popupPaddingBlockStart: blockStart,
    popupPaddingBlockEnd: getUnitToken("spacing/vertical/2.5x"),
    optionPaddingInline: getUnitToken("spacing/horizontal/3x"),
    optionPaddingBlock: blockStart,
  };
}

/** 浮层 CSS 变量（portaled popup 须经 styles.popup 注入） */
export function useSensSelectDropdownStyle(skin: FunctionalSkin = "green"): CSSProperties {
  const { token } = theme.useToken();
  const functional = getFunctionalColors(skin);
  const spacing = selectDropdownSpacing();

  return {
    "--sens-select-option-hover-bg": tokenRgba("background-transparent-grey-hover", 0.06),
    "--sens-select-option-click-bg": tokenRgba("background-01-transparent", 0.08),
    "--sens-select-option-selected-bg": functional.activeBackground,
    "--sens-select-option-selected-hover-bg": functional.activeHoverBackground,
    "--sens-select-option-selected-active-bg": functional.activeClickBackground,
    "--sens-select-option-disabled-color": tokenRgba("text-color-transparent-disable", 0.3),
    "--sens-select-option-disabled-hover-color": tokenRgba("text-color-transparent-disable-hover", 0.24),
    "--sens-select-option-check-color": SELECT_CHECK_COLOR,
    "--sens-select-option-check-color-disabled": SELECT_CHECK_COLOR_DISABLED,
    "--sens-select-option-check-color-disabled-hover": SELECT_CHECK_COLOR_DISABLED_HOVER,
    "--sens-select-popup-shadow": buildShadowD4(),
    "--sens-select-popup-radius": `${token.borderRadius}px`,
    "--sens-select-option-height": `${SELECT_OPTION_HEIGHT}px`,
    "--sens-select-popup-padding-block-start": `${spacing.popupPaddingBlockStart}px`,
    "--sens-select-popup-padding-block-end": `${spacing.popupPaddingBlockEnd}px`,
    "--sens-select-option-padding-inline": `${spacing.optionPaddingInline}px`,
    "--sens-select-option-padding-block": `${spacing.optionPaddingBlock}px`,
  /** 统计「共 n 条」· 中性色/文字/03_辅助 @text-sub-color-transparent @58% */
    "--sens-select-dropdown-stats-color": tokenRgba("text-sub-color-transparent", 0.58),
    /** 空态辅助文案 · 同上 */
    "--sens-select-dropdown-empty-desc-color": tokenRgba("text-sub-color-transparent", 0.58),
    /** 搜索分割线 → 统计「共 n 条」：6px = spacing/1.5x */
    "--sens-select-dropdown-stats-padding-block-start": `${spacing.popupPaddingBlockStart}px`,
  } as CSSProperties;
}

function useSelectDropdownMatrixVars(): CSSProperties {
  return {
    "--sens-select-matrix-space-2x": `${getUnitToken("spacing/2x")}px`,
    "--sens-select-matrix-space-6x": `${getUnitToken("spacing/6x")}px`,
    "--sens-select-matrix-cell-width": `${SELECT_DROPDOWN_MATRIX_CELL_WIDTH}px`,
    "--sens-select-content-matrix-cell-width": `${SELECT_DROPDOWN_CONTENT_MATRIX_CELL_WIDTH}px`,
  } as CSSProperties;
}

function SelectCheckSuffix() {
  return (
    <span className="sens-select-option-check">
      <SelectCheckIcon size={SELECT_CHECK_ICON_SIZE} />
    </span>
  );
}

export interface SensSelectDropdownProps extends SelectProps {
  /** 预览换肤：已选中三档行底（勾选色固定中性图标，不换肤） */
  functionalSkin?: FunctionalSkin;
  /** 浮层内搜索（R2） */
  searchable?: boolean;
  searchMode?: SelectDropdownSearchMode;
  searchDebounce?: number;
  /** 预留：触发型搜索，R2 不实现 */
  searchTrigger?: "realtime" | "enter";
  resetSearchOnClose?: boolean;
  /** remote：空 query 不调用 */
  onSearch?: (query: string) => void;
  /** 源数据加载失败（打开浮层未拉到选项） */
  optionsLoadFailed?: boolean;
  onEmptyAction?: () => void;
  /** 覆盖本地默认匹配（原文/全拼/首字母/searchText） */
  filterMatcher?: SelectOptionFilterMatcher;
  /** R3：悬停显示清空 × */
  clearable?: boolean;
  /** R3：框内/框外警告 */
  warningPlacement?: SensInputWarningPlacement;
  help?: ReactNode;
  warningMessage?: ReactNode;
}

/** 基础单选 Select + 浮层 token（R1 容器/行 + R2 搜索 + R3 触发框） */
export function SensSelectDropdown({
  functionalSkin = "green",
  searchable = false,
  searchMode = "local",
  searchDebounce = 300,
  resetSearchOnClose = true,
  onSearch,
  optionsLoadFailed,
  onEmptyAction,
  filterMatcher,
  clearable = false,
  warningPlacement,
  help,
  warningMessage,
  className,
  style,
  size,
  status: statusProp,
  classNames,
  styles,
  menuItemSelectedIcon,
  options,
  loading,
  popupRender,
  optionRender,
  onOpenChange,
  showSearch,
  filterOption,
  suffixIcon: suffixIconProp,
  allowClear: allowClearProp,
  ...props
}: SensSelectDropdownProps) {
  const triggerStyle = useSensSelectTriggerStyle(size);
  const tooltipMessage = warningMessage ?? help;
  const insideWarningSuffix =
    warningPlacement === "inside" ? (
      <InsideErrorSuffix size={size} message={tooltipMessage} />
    ) : undefined;
  const triggerProps = useSensSelectTriggerProps(clearable, triggerStyle, insideWarningSuffix);
  const isWarning = warningPlacement === "inside" || warningPlacement === "outside";
  const status = isWarning ? "error" : statusProp;

  const mergedClassName = [triggerProps.className, className].filter(Boolean).join(" ");

  const mergedStyle = { ...triggerProps.style, ...style };
  const mergedSuffixIcon = suffixIconProp ?? triggerProps.suffixIcon;
  const mergedAllowClear =
    allowClearProp ?? ("allowClear" in triggerProps ? triggerProps.allowClear : undefined);

  const dropdownStyle = useSensSelectDropdownStyle(functionalSkin);
  const popupRootClass = [
    "sens-select-dropdown",
    searchable ? "sens-select-dropdown--searchable" : "",
    classNames?.popup?.root,
  ]
    .filter(Boolean)
    .join(" ");

  const search = useSelectDropdownSearch({
    searchable,
    searchMode,
    searchDebounce,
    options,
    loading,
    optionsLoadFailed,
    onSearch,
    filterMatcher,
  });

  const selectedCheckIcon = useMemo(
    () => menuItemSelectedIcon ?? <SelectCheckSuffix />,
    [menuItemSelectedIcon],
  );

  const {
    query,
    setQuery,
    resetSearch,
    contentPhase,
    displayOptions,
    resultCount,
    sourceCount,
    showOptionList,
  } = search;

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open && resetSearchOnClose) {
        resetSearch();
      }
      onOpenChange?.(open);
    },
    [onOpenChange, resetSearchOnClose, resetSearch],
  );

  const mergedOptionRender = useCallback<NonNullable<SelectProps["optionRender"]>>(
    (option, info) => {
      if (optionRender) return optionRender(option, info);

      const text = String(option.label ?? option.value ?? "");
      return <SearchHighlight text={text} keyword={query} />;
    },
    [optionRender, query],
  );

  const mergedPopupRender = useCallback<NonNullable<SelectProps["popupRender"]>>(
    (menu) => {
      const body = searchable ? (
        <>
          <SelectDropdownSearch
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onBack={resetSearch}
            onKeyDown={(event) => event.stopPropagation()}
          />
          <SelectDropdownBody
            phase={contentPhase}
            sourceCount={sourceCount}
            resultCount={resultCount}
            onEmptyAction={onEmptyAction}
          />
          {showOptionList ? menu : null}
        </>
      ) : (
        menu
      );

      return popupRender ? popupRender(body) : body;
    },
    [
      contentPhase,
      onEmptyAction,
      popupRender,
      query,
      resultCount,
      searchable,
      setQuery,
      showOptionList,
      sourceCount,
    ],
  );

  const selectNode = (
    <Select
      className={mergedClassName}
      style={mergedStyle}
      size={size}
      status={status}
      variant="outlined"
      suffixIcon={mergedSuffixIcon}
      allowClear={mergedAllowClear}
      classNames={{
        ...classNames,
        popup: { ...classNames?.popup, root: popupRootClass },
      }}
      styles={{
        ...styles,
        popup: { root: { ...dropdownStyle, ...styles?.popup?.root } },
      }}
      menuItemSelectedIcon={selectedCheckIcon}
      options={searchable ? displayOptions : options}
      loading={loading}
      showSearch={searchable ? false : showSearch}
      filterOption={searchable ? false : filterOption}
      popupRender={searchable ? mergedPopupRender : popupRender}
      optionRender={searchable && query.trim() ? mergedOptionRender : optionRender}
      onOpenChange={handleOpenChange}
      {...props}
    />
  );

  if (warningPlacement === "outside" && help != null && help !== "") {
    return (
      <div className="sens-select-trigger-field" style={mergedStyle}>
        {selectNode}
        <InputHelpRow help={help} />
      </div>
    );
  }

  return selectNode;
}

export type SelectDropdownPreviewState =
  | "default"
  | "hover"
  | "click"
  | "disabled"
  | "disabledHover";

type SelectDropdownSelection = "unselected" | "selected";

const PREVIEW_STATE_I18N: Record<SelectDropdownPreviewState, string> = {
  default: "sensd-select-dropdown-state-default",
  hover: "sensd-select-dropdown-state-hover",
  click: "sensd-select-dropdown-state-click",
  disabled: "sensd-input-state-disabled",
  disabledHover: "sensd-input-state-disabledHover",
};

const PREVIEW_STATE_DEFAULT: Record<SelectDropdownPreviewState, string> = {
  default: "默认",
  hover: "悬停",
  click: "点击",
  disabled: "禁用",
  disabledHover: "禁用悬停",
};

const SELECTION_I18N: Record<SelectDropdownSelection, string> = {
  unselected: "sensd-select-dropdown-selection-unselected",
  selected: "sensd-select-dropdown-selection-selected",
};

const SELECTION_DEFAULT: Record<SelectDropdownSelection, string> = {
  unselected: "未选中",
  selected: "已选中",
};

function matrixPreviewWrapperClass(state: SelectDropdownPreviewState): string {
  const classes: string[] = [];
  if (state === "hover") classes.push("sens-select-dropdown-matrix-preview--hover");
  if (state === "click") classes.push("sens-select-dropdown-matrix-preview--click");
  if (state === "disabledHover") classes.push("sens-select-dropdown-matrix-preview--disabled-hover");
  return classes.join(" ");
}

function MatrixOptionRow({
  label,
  selected,
  disabled,
}: {
  label: string;
  selected: boolean;
  disabled: boolean;
}) {
  const optionClass = [
    "ant-select-item",
    "ant-select-item-option",
    selected ? "ant-select-item-option-selected" : "",
    disabled ? "ant-select-item-option-disabled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={optionClass} role="option" aria-selected={selected} aria-disabled={disabled}>
      <div className="ant-select-item-option-content">{label}</div>
      {selected ? (
        <span className="ant-select-item-option-state">
          <span className="sens-select-option-check">
            <SelectCheckIcon size={SELECT_CHECK_ICON_SIZE} color="currentColor" />
          </span>
        </span>
      ) : null}
    </div>
  );
}

function MatrixDropdownCell({
  selection,
  state,
  optionLabel,
  dropdownStyle,
}: {
  selection: SelectDropdownSelection;
  state: SelectDropdownPreviewState;
  optionLabel: string;
  dropdownStyle: CSSProperties;
}) {
  const selected = selection === "selected";
  const disabled = state === "disabled" || state === "disabledHover";

  return (
    <div className={matrixPreviewWrapperClass(state)}>
      <div
        className="ant-select-dropdown sens-select-dropdown sens-select-dropdown-matrix-shell css-var-root ant-select-dropdown-placement-bottomLeft"
        style={dropdownStyle}
      >
        <div>
          <div className="rc-virtual-list-holder-inner">
            <MatrixOptionRow label={optionLabel} selected={selected} disabled={disabled} />
          </div>
        </div>
      </div>
    </div>
  );
}

interface SelectDropdownMatrixRowProps {
  selection: SelectDropdownSelection;
  optionLabel: string;
  dropdownStyle: CSSProperties;
  label: (key: string, defaultValue: string) => string;
}

function SelectDropdownMatrixRow({
  selection,
  optionLabel,
  dropdownStyle,
  label,
}: SelectDropdownMatrixRowProps) {
  const states: SelectDropdownPreviewState[] = [
    "default",
    "hover",
    "click",
    "disabled",
    "disabledHover",
  ];
  const rowTitle = label(SELECTION_I18N[selection], SELECTION_DEFAULT[selection]);

  return (
    <div className="sens-select-dropdown-matrix-row">
      <span className="sens-select-dropdown-matrix-title">{rowTitle}</span>
      <div className="sens-select-dropdown-matrix-states">
        {states.map((state) => (
          <div key={state} className="sens-select-dropdown-matrix-cell">
            <span className="sens-select-dropdown-matrix-label">
              {label(PREVIEW_STATE_I18N[state], PREVIEW_STATE_DEFAULT[state])}
            </span>
            <MatrixDropdownCell
              selection={selection}
              state={state}
              optionLabel={optionLabel}
              dropdownStyle={dropdownStyle}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export interface SelectDropdownStatesPreviewProps {
  title?: ReactNode;
  functionalSkin?: FunctionalSkin;
}

/** 2 行 × 5 态 = 10 格 */
export function SelectDropdownStatesPreview({
  title,
  functionalSkin = "green",
}: SelectDropdownStatesPreviewProps) {
  const { t } = useTranslation();
  const dropdownStyle = useSensSelectDropdownStyle(functionalSkin);
  const optionLabel = t(`${I18N_NS}.sensd-select-dropdown-option-label`, {
    defaultValue: "选项文案",
  });
  const label = (key: string, defaultValue: string) => t(`${I18N_NS}.${key}`, { defaultValue });

  const selections: SelectDropdownSelection[] = ["unselected", "selected"];

  return (
    <div className="sens-select-dropdown-matrix" style={useSelectDropdownMatrixVars()}>
      {title ? <div className="sens-select-dropdown-matrix-title">{title}</div> : null}
      {selections.map((selection) => (
        <SelectDropdownMatrixRow
          key={selection}
          selection={selection}
          optionLabel={optionLabel}
          dropdownStyle={dropdownStyle}
          label={label}
        />
      ))}
    </div>
  );
}

export type SelectDropdownContentPreviewPhase =
  | "fullList"
  | "searching"
  | "hasResults"
  | "noResults"
  | "dataLoading"
  | "emptyData";

const CONTENT_PHASE_I18N: Record<SelectDropdownContentPreviewPhase, string> = {
  fullList: "sensd-select-dropdown-content-fullList",
  searching: "sensd-select-dropdown-content-searching",
  hasResults: "sensd-select-dropdown-content-hasResults",
  noResults: "sensd-select-dropdown-content-noResults",
  dataLoading: "sensd-select-dropdown-content-dataLoading",
  emptyData: "sensd-select-dropdown-content-emptyData",
};

const CONTENT_PHASE_DEFAULT: Record<SelectDropdownContentPreviewPhase, string> = {
  fullList: "未搜索",
  searching: "搜索中",
  hasResults: "有结果",
  noResults: "无结果",
  dataLoading: "加载中",
  emptyData: "暂无数据",
};

function ContentPreviewOptionRows({
  labels,
  keyword,
  selectedValue,
}: {
  labels: string[];
  keyword?: string;
  selectedValue?: string;
}) {
  return (
    <div className="rc-virtual-list-holder-inner">
      {labels.map((label) => {
        const selected = label === selectedValue;
        return (
          <div
            key={label}
            className={[
              "ant-select-item",
              "ant-select-item-option",
              selected ? "ant-select-item-option-selected" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            role="option"
            aria-selected={selected}
          >
            <div className="ant-select-item-option-content">
              {keyword ? <SearchHighlight text={label} keyword={keyword} /> : label}
            </div>
            {selected ? (
              <span className="ant-select-item-option-state">
                <span className="sens-select-option-check">
                  <SelectCheckIcon size={SELECT_CHECK_ICON_SIZE} />
                </span>
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function ContentPreviewDropdownCell({
  phase,
  dropdownStyle,
  optionLabels,
}: {
  phase: SelectDropdownContentPreviewPhase;
  dropdownStyle: CSSProperties;
  optionLabels: string[];
}) {
  const sourceCount = optionLabels.length;
  const keyword = phase === "hasResults" ? "选项" : "";
  const filteredLabels =
    phase === "hasResults" ? optionLabels.filter((item) => item.includes("选项")) : optionLabels;

  return (
    <div
      className="ant-select-dropdown sens-select-dropdown sens-select-dropdown--searchable sens-select-dropdown-matrix-shell css-var-root ant-select-dropdown-placement-bottomLeft"
      style={dropdownStyle}
    >
      <SelectDropdownSearch
        value={phase === "fullList" ? "" : phase === "hasResults" ? "选项" : "关键词"}
        readOnly
      />
      <SelectDropdownBody
        phase={phase as SelectDropdownContentPhase}
        sourceCount={sourceCount}
        resultCount={filteredLabels.length}
      />
      {phase === "fullList" || phase === "hasResults" ? (
        <ContentPreviewOptionRows
          labels={phase === "hasResults" ? filteredLabels : optionLabels}
          keyword={phase === "hasResults" ? keyword : undefined}
          selectedValue={phase === "hasResults" ? filteredLabels[0] : optionLabels[1]}
        />
      ) : null}
    </div>
  );
}

export interface SelectDropdownContentStatesPreviewProps {
  title?: ReactNode;
  functionalSkin?: FunctionalSkin;
}

/** R2：内容区六面静态矩阵 */
export function SelectDropdownContentStatesPreview({
  title,
  functionalSkin = "green",
}: SelectDropdownContentStatesPreviewProps) {
  const { t } = useTranslation();
  const dropdownStyle = useSensSelectDropdownStyle(functionalSkin);
  const label = (key: string, defaultValue: string) => t(`${I18N_NS}.${key}`, { defaultValue });
  const optionLabels = ["选项 A", "选项 B", "选项 C", "选项 D"];

  const phases: SelectDropdownContentPreviewPhase[] = [
    "fullList",
    "searching",
    "hasResults",
    "noResults",
    "dataLoading",
    "emptyData",
  ];

  return (
    <div className="sens-select-dropdown-content-matrix" style={useSelectDropdownMatrixVars()}>
      {title ? <div className="sens-select-dropdown-matrix-title">{title}</div> : null}
      <div className="sens-select-dropdown-content-matrix-states">
        {phases.map((phase) => (
          <div key={phase} className="sens-select-dropdown-content-matrix-cell">
            <span className="sens-select-dropdown-matrix-label">
              {label(CONTENT_PHASE_I18N[phase], CONTENT_PHASE_DEFAULT[phase])}
            </span>
            <ContentPreviewDropdownCell
              phase={phase}
              dropdownStyle={dropdownStyle}
              optionLabels={optionLabels}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export type SelectTriggerPreviewState =
  | "default"
  | "hover"
  | "focus"
  | "disabled"
  | "disabledHover";

type SelectTriggerPreviewWarning = "none" | "inside";
type SelectTriggerPreviewContent = "empty" | "filled";

const SELECT_TRIGGER_PREVIEW_OPTIONS = [
  { value: "a", label: "选项 A" },
  { value: "b", label: "选项 B" },
];

const TRIGGER_STATE_I18N: Record<SelectTriggerPreviewState, string> = {
  default: "sensd-input-state-default",
  hover: "sensd-input-state-hover",
  focus: "sensd-input-state-focus",
  disabled: "sensd-input-state-disabled",
  disabledHover: "sensd-input-state-disabledHover",
};

const TRIGGER_STATE_DEFAULT: Record<SelectTriggerPreviewState, string> = {
  default: "默认",
  hover: "悬停",
  focus: "聚焦",
  disabled: "禁用",
  disabledHover: "禁用悬停",
};

const TRIGGER_WARNING_I18N: Record<SelectTriggerPreviewWarning, string> = {
  none: "sensd-select-trigger-group-none",
  inside: "sensd-select-trigger-group-warningInside",
};

const TRIGGER_WARNING_DEFAULT: Record<SelectTriggerPreviewWarning, string> = {
  none: "无警告",
  inside: "框内警告",
};

const TRIGGER_CONTENT_I18N: Record<SelectTriggerPreviewContent, string> = {
  empty: "sensd-select-trigger-content-empty",
  filled: "sensd-select-trigger-content-filled",
};

const TRIGGER_CONTENT_DEFAULT: Record<SelectTriggerPreviewContent, string> = {
  empty: "未选",
  filled: "已选",
};

interface SelectTriggerPreviewStyleToken {
  hoverBorderColor: string;
  activeBorderColor: string;
  activeShadow: string;
  colorBorderDisabledHover: string;
  colorBgContainerDisabledHover: string;
  colorErrorHover: string;
  colorErrorActive: string;
  errorActiveShadow: string;
  colorTextPlaceholderDisabledHover: string;
}

function getSelectTriggerPreviewStyleToken(
  antdToken: ReturnType<typeof theme.useToken>["token"],
): SelectTriggerPreviewStyleToken {
  return {
    hoverBorderColor: antdToken.colorPrimary,
    activeBorderColor: antdToken.colorPrimaryActive,
    activeShadow: `0 0 0 2px ${tokenRgba("component-active-shadow", 0.2)}`,
    colorBorderDisabledHover: tokenRgba("line-color-transparent", 0.06),
    colorBgContainerDisabledHover: tokenRgba("background-transparent-grey", 0.04),
    colorErrorHover: antdToken.colorErrorHover,
    colorErrorActive: antdToken.colorErrorActive,
    errorActiveShadow: `0 0 0 2px ${tokenRgba("warning-color-active-shadow", 0.2)}`,
    colorTextPlaceholderDisabledHover: tokenRgba("text-color-transparent-disable-hover", 0.24),
  };
}

function resolveSelectTriggerPreviewVars(
  warning: SelectTriggerPreviewWarning,
  styleToken: SelectTriggerPreviewStyleToken,
): CSSProperties {
  const isWarning = warning !== "none";
  return {
    "--sens-select-trigger-preview-hover-border": isWarning
      ? styleToken.colorErrorHover
      : styleToken.hoverBorderColor,
    "--sens-select-trigger-preview-focus-border": isWarning
      ? styleToken.colorErrorActive
      : styleToken.activeBorderColor,
    "--sens-select-trigger-preview-focus-shadow": isWarning
      ? styleToken.errorActiveShadow
      : styleToken.activeShadow,
    "--sens-select-trigger-preview-disabled-hover-border": styleToken.colorBorderDisabledHover,
    "--sens-select-trigger-preview-disabled-hover-bg": styleToken.colorBgContainerDisabledHover,
    "--sens-select-trigger-preview-placeholder-disabled-hover":
      styleToken.colorTextPlaceholderDisabledHover,
  } as CSSProperties;
}

function useSelectTriggerMatrixPreviewVars(): CSSProperties {
  return {
    "--sens-select-matrix-space-2x": `${getUnitToken("spacing/2x")}px`,
    "--sens-select-matrix-space-6x": `${getUnitToken("spacing/6x")}px`,
    "--sens-select-trigger-matrix-cell-width": `${SELECT_TRIGGER_MATRIX_CELL_WIDTH}px`,
  } as CSSProperties;
}

function triggerPreviewWrapperClass(state: SelectTriggerPreviewState): string {
  if (state === "hover") return "sens-select-trigger-matrix-preview--hover";
  if (state === "focus") return "sens-select-trigger-matrix-preview--focus";
  if (state === "disabledHover") return "sens-select-trigger-matrix-preview--disabled-hover";
  return "";
}

function buildTriggerPreviewSelectProps(
  state: SelectTriggerPreviewState,
  content: SelectTriggerPreviewContent,
  warning: SelectTriggerPreviewWarning,
  placeholder: string,
): SensSelectDropdownProps {
  const props: SensSelectDropdownProps = {
    placeholder,
    options: SELECT_TRIGGER_PREVIEW_OPTIONS,
    style: { width: SELECT_TRIGGER_FIELD_WIDTH, minWidth: 128, maxWidth: 600 },
    defaultValue: content === "filled" ? "a" : undefined,
    open: state === "focus" ? false : undefined,
  };

  if (warning === "inside") {
    props.warningPlacement = "inside";
    props.help = "警告文案";
  }

  if (state === "disabled" || state === "disabledHover") {
    props.disabled = true;
  }

  return props;
}

function SelectTriggerMatrixRow({
  warning,
  content,
  styleToken,
  placeholder,
  label,
}: {
  warning: SelectTriggerPreviewWarning;
  content: SelectTriggerPreviewContent;
  styleToken: SelectTriggerPreviewStyleToken;
  placeholder: string;
  label: (key: string, defaultValue: string) => string;
}) {
  const states: SelectTriggerPreviewState[] = [
    "default",
    "hover",
    "focus",
    "disabled",
    "disabledHover",
  ];
  const rowTitle = [
    label(TRIGGER_WARNING_I18N[warning], TRIGGER_WARNING_DEFAULT[warning]),
    label(TRIGGER_CONTENT_I18N[content], TRIGGER_CONTENT_DEFAULT[content]),
  ].join(" / ");

  return (
    <div
      className="sens-select-trigger-matrix-row"
      style={resolveSelectTriggerPreviewVars(warning, styleToken)}
    >
      <span className="sens-select-trigger-matrix-title">{rowTitle}</span>
      <div className="sens-select-trigger-matrix-states">
        {states.map((state) => (
          <div key={state} className="sens-select-trigger-matrix-cell">
            <span className="sens-select-trigger-matrix-label">
              {label(TRIGGER_STATE_I18N[state], TRIGGER_STATE_DEFAULT[state])}
            </span>
            <div className={triggerPreviewWrapperClass(state)}>
              <SensSelectDropdown
                {...buildTriggerPreviewSelectProps(state, content, warning, placeholder)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export interface SelectTriggerStatesPreviewProps {
  title?: ReactNode;
}

/** R3：触发框 2 警告 × 2 内容 × 5 态（仅 32px，无小尺寸） */
export function SelectTriggerStatesPreview({ title }: SelectTriggerStatesPreviewProps) {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const styleToken = getSelectTriggerPreviewStyleToken(token);
  const placeholder = t(`${I18N_NS}.sensd-select-placeholder`, { defaultValue: "请选择" });
  const label = (key: string, defaultValue: string) => t(`${I18N_NS}.${key}`, { defaultValue });

  const warnings: SelectTriggerPreviewWarning[] = ["none", "inside"];
  const contents: SelectTriggerPreviewContent[] = ["empty", "filled"];

  return (
    <div className="sens-select-trigger-matrix" style={useSelectTriggerMatrixPreviewVars()}>
      {title ? <div className="sens-select-trigger-matrix-title">{title}</div> : null}
      {warnings.map((warning) => (
        <div key={warning} className="sens-select-trigger-matrix-group">
          {contents.map((content) => (
            <SelectTriggerMatrixRow
              key={`${warning}-${content}`}
              warning={warning}
              content={content}
              styleToken={styleToken}
              placeholder={placeholder}
              label={label}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
