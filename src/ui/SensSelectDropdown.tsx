import { Select, type SelectProps } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import {
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import { buildShadowD4, getColorToken, tokenRgba } from "../design-system/color-utils";
import { getDividerColor, getDividerHairlineWidth } from "../design-system/divider";
import {
  functionalCssVar,
  getFunctionalColors,
  type FunctionalSkin,
} from "../design-system/functional-skin";
import { getUnitToken } from "../design-system/unit";
import { getTypographyToken } from "../design-system/typography";
import { useFunctionalSkin } from "../design-system/appearance";
import { useSensSelectTriggerProps } from "./fieldIconProps";
import {
  SELECT_CHECK_ICON_SIZE,
  SelectCheckIcon,
} from "./FieldIcons";
import {
  getOptionLabel,
  hasSelectOptionGroups,
  type SelectOptionFilterMatcher,
} from "./matchSelectOption";
import { SearchHighlight } from "./SearchHighlight";
import { SensTips } from "./SensTips";
import {
  InsideErrorSuffix,
  InputHelpRow,
  useSensInputHeightStyle,
  type SensInputReadOnlyVariant,
  type SensInputWarningPlacement,
} from "./SensInput";
import { SensCheckbox } from "./SensCheckbox";
import { SensTag } from "./SensTag";
import { SelectDropdownActionBar } from "./SelectDropdownActionBar";
import { SelectDropdownBody } from "./SelectDropdownBody";
import {
  SelectDropdownLoadMore,
  type SelectDropdownLoadMoreState,
} from "./SelectDropdownLoadMore";
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
/** 选项列表最多露出 9.5 行，超出滚动；不含搜索 / 统计 / 操作条 */
export const SELECT_OPTION_VISIBLE_ROWS = 9.5;
export const SELECT_LIST_MAX_HEIGHT = SELECT_OPTION_HEIGHT * SELECT_OPTION_VISIBLE_ROWS;
export const SELECT_DROPDOWN_MATRIX_CELL_WIDTH = 160;
export const SELECT_DROPDOWN_CONTENT_MATRIX_CELL_WIDTH = 200;
export const SELECT_DROPDOWN_DEMO_WIDTH = 200;
export const SELECT_TRIGGER_MATRIX_CELL_WIDTH = 200;
const SELECT_TRIGGER_FIELD_WIDTH = 200;
export const SELECT_ADAPTIVE_MIN_WIDTH = 148;
export const SELECT_ADAPTIVE_MAX_WIDTH = 600;
/** 多选浮层最小宽（Figma `17728:81940`）；单选不套这条 */
export const SELECT_MULTIPLE_POPUP_MIN_WIDTH = 320;
/** antd 默认浮层偏移；框外 help 再加 gap + 行高，避免盖住警告文案 */
const SELECT_POPUP_OFFSET = 4;

function selectOutsideHelpPlacements() {
  const offset =
    SELECT_POPUP_OFFSET + getUnitToken("spacing/vertical/1x") + getTypographyToken("line-height/s");
  const shared = {
    overflow: { adjustX: true, adjustY: true, shiftY: true },
    htmlRegion: "visible" as const,
    dynamicInset: true,
  };
  return {
    bottomLeft: { ...shared, points: ["tl", "bl"] as [string, string], offset: [0, offset] as [number, number] },
    bottomRight: { ...shared, points: ["tr", "br"] as [string, string], offset: [0, offset] as [number, number] },
    topLeft: { ...shared, points: ["bl", "tl"] as [string, string], offset: [0, -offset] as [number, number] },
    topRight: { ...shared, points: ["br", "tr"] as [string, string], offset: [0, -offset] as [number, number] },
  };
}
export const SELECT_FIXED_WIDTH_PRESETS = {
  "128": 128,
  "148": 148,
  "320": 320,
  "600": 600,
} as const;

export type SensSelectWidthPreset = keyof typeof SELECT_FIXED_WIDTH_PRESETS;
export type SensSelectWidthMode = "adaptive";
/** 个数型回显封顶 */
export const SELECT_COUNT_MAX = 999;
/** Hover 已选列表过长则不挂 Tips，避免 999+ 矩阵卡死 */
const SELECT_COUNT_TIPS_MAX = 30;
/** 展示型多行换行上限（Figma `15584:52788` / `15584:52911`）；单行仍锁 32 */
export const SELECT_TAGS_MAX_HEIGHT = 128;
/** 标签文案区最大宽（省略发生在文案上，Figma `15584:52711`） */
export const SELECT_TAG_LABEL_MAX_WIDTH = 112;
/**
 * 可移除标签整颗最大宽：左右 8 + 文案 112 + gap 4 + × 14 = 146
 * （Figma 长标实例宽 146；勿把 112 套在根节点上）
 */
export const SELECT_TAG_CHIP_MAX_WIDTH = 146;
export const SELECT_TAGS_MATRIX_CELL_WIDTH = 320;

export type SensSelectMultiDisplay = "count" | "tags";

/** 下拉选项可选的辅助文案；单选、多选共用同一套双行选项结构。 */
export type SensSelectOption = DefaultOptionType & {
  description?: ReactNode;
  icon?: ReactNode;
};

function hasOptionDescriptions(options?: SensSelectOption[]): boolean {
  return Boolean(
    options?.some((option) => {
      if (option.description != null && option.description !== "") return true;
      return hasOptionDescriptions(option.options as SensSelectOption[] | undefined);
    }),
  );
}

function hasOptionIcons(options?: SensSelectOption[]): boolean {
  return Boolean(
    options?.some((option) => {
      if (option.icon != null) return true;
      return hasOptionIcons(option.options as SensSelectOption[] | undefined);
    }),
  );
}

/** R3 触发框 CSS 变量（字段色与 SensInput 同源；视觉直读 design token） */
export function useSensSelectTriggerStyle(size?: SelectProps["size"]): CSSProperties {
  const fieldVars = useSensInputHeightStyle();

  return {
    ...fieldVars,
    "--sens-select-hover-border-color": functionalCssVar("--sens-skin-primary", "component-primary"),
    "--sens-select-active-border-color": functionalCssVar("--sens-skin-active", "component-active"),
    "--sens-select-active-shadow": `0 0 0 2px ${functionalCssVar("--sens-skin-active-shadow", "component-active-shadow")}`,
    "--sens-select-error-hover-border-color": getColorToken("warning-color-hover"),
    "--sens-select-error-active-border-color": getColorToken("warning-color-active"),
    "--sens-select-error-active-shadow": `0 0 0 2px ${tokenRgba("warning-color-active-shadow", 0.2)}`,
    "--sens-select-placeholder-color": getColorToken("text-color-transparent-disable"),
    "--sens-select-text-color": getColorToken("text-color-transparent"),
    "--sens-select-disabled-text-color": getColorToken("text-color-transparent-disable"),
    "--sens-select-disabled-bg": tokenRgba("background-transparent-grey-hover", 0.06),
    "--sens-select-border-disabled": getDividerColor("light", "transparent"),
    "--sens-select-arrow-color": getColorToken("icon-color-transparent"),
    "--sens-select-arrow-color-disabled": getColorToken("icon-color-transparent-disable"),
    "--sens-select-arrow-color-disabled-hover": getColorToken("icon-color-transparent-disable-hover"),
    "--sens-select-icon-hover-color": getColorToken("text-color"),
    "--sens-select-padding-inline": `${getUnitToken("spacing/horizontal/3x")}px`,
    "--sens-select-content-arrow-gap": `${getUnitToken("spacing/horizontal/2x")}px`,
    "--sens-select-tags-gap": `${getUnitToken("spacing/horizontal/1x")}px`,
    "--sens-select-tags-padding-block": `${getUnitToken("spacing/1x")}px`,
    "--sens-select-tag-height": `${getUnitToken("size/component-height/s")}px`,
    "--sens-select-tag-chip-max-width": `${SELECT_TAG_CHIP_MAX_WIDTH}px`,
    "--sens-select-tag-label-max-width": `${SELECT_TAG_LABEL_MAX_WIDTH}px`,
    "--sens-select-tags-max-height": `${SELECT_TAGS_MAX_HEIGHT}px`,
    "--sens-select-trigger-radius": `${getUnitToken("radius/m")}px`,
    "--sens-select-tags-scrollbar-size": "6px",
    "--sens-select-tags-scrollbar-radius": `${getUnitToken("radius/s")}px`,
    "--sens-select-tags-scrollbar-arrow-gap": `${getUnitToken("spacing/horizontal/2x")}px`,
    "--sens-select-tags-scrollbar-thumb": tokenRgba("outline-color-transparent", 0.35),
    "--sens-select-arrow-size": `${getUnitToken("size/icon/m")}px`,
    "--sens-select-simple-height": `${getTypographyToken("line-height/m")}px`,
    "--sens-select-simple-hover-color": functionalCssVar("--sens-skin-primary", "component-primary"),
    "--sens-select-simple-active-color": functionalCssVar("--sens-skin-active", "component-active"),
    "--sens-select-error-color": getColorToken("warning-color"),
    "--sens-select-load-more-link-color": getColorToken("link-color"),
    "--sens-select-simple-disabled-hover-color": getColorToken("text-color-transparent-disable-hover"),
  } as CSSProperties;
}

/** 勾选色：中性图标，不随功能色换肤 */
const SELECT_CHECK_COLOR = getColorToken("icon-color-transparent");
const SELECT_CHECK_COLOR_DISABLED = getColorToken("icon-color-transparent-disable");
const SELECT_CHECK_COLOR_DISABLED_HOVER = getColorToken("icon-color-transparent-disable-hover");
const LOAD_MORE_OPTION_VALUE = "__sens_select_load_more__";

/** 同一时刻只开一个 SensSelectDropdown 浮层；打开新的先关掉旧的（多选确认走放弃，不提交草稿） */
type SensSelectOpenGate = { close: () => void };
let activeSensSelectOpen: SensSelectOpenGate | null = null;

type LoadMoreOptionData = DefaultOptionType & {
  __sensSelectLoadMore: true;
};

function isLoadMoreOptionData(value: unknown): value is LoadMoreOptionData {
  return Boolean(value && typeof value === "object" && "__sensSelectLoadMore" in value);
}

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

/** 浮层 CSS 变量（portaled popup 须经 styles.popup 注入）。未传 skin 时跟 AppearanceProvider，无 Provider 回落绿。 */
export function useSensSelectDropdownStyle(skin?: FunctionalSkin): CSSProperties {
  const appearanceSkin = useFunctionalSkin();
  const functional = getFunctionalColors(skin ?? appearanceSkin);
  const spacing = selectDropdownSpacing();

  return {
    "--sens-skin-primary": functional.primary,
    "--sens-skin-hover": functional.hover,
    "--sens-skin-active": functional.active,
    "--sens-skin-disable": functional.disable,
    "--sens-skin-disable-hover": functional.disableHover,
    "--sens-skin-active-bg": functional.activeBackground,
    "--sens-skin-active-hover-bg": functional.activeHoverBackground,
    "--sens-skin-active-click-bg": functional.activeClickBackground,
    "--sens-skin-active-shadow": functional.activeShadow,
    "--sens-skin-light-bg": functional.lightBackground,
    "--sens-select-option-hover-bg": tokenRgba("background-transparent-grey-hover", 0.06),
    "--sens-select-option-click-bg": tokenRgba("background-01-transparent", 0.08),
    "--sens-select-option-selected-bg": functional.activeBackground,
    "--sens-select-option-selected-hover-bg": functional.activeHoverBackground,
    "--sens-select-option-selected-active-bg": functional.activeClickBackground,
    "--sens-select-option-disabled-color": getColorToken("text-color-transparent-disable"),
    "--sens-select-option-disabled-hover-color": getColorToken("text-color-transparent-disable-hover"),
    "--sens-select-option-check-color": SELECT_CHECK_COLOR,
    "--sens-select-option-check-color-disabled": SELECT_CHECK_COLOR_DISABLED,
    "--sens-select-option-check-color-disabled-hover": SELECT_CHECK_COLOR_DISABLED_HOVER,
    "--sens-select-popup-shadow": buildShadowD4(),
    "--sens-select-popup-radius": `${getUnitToken("radius/m")}px`,
    "--sens-select-option-height": `${SELECT_OPTION_HEIGHT}px`,
    "--sens-select-list-max-height": `${SELECT_LIST_MAX_HEIGHT}px`,
    "--sens-select-popup-padding-block-start": `${spacing.popupPaddingBlockStart}px`,
    "--sens-select-popup-padding-block-end": `${spacing.popupPaddingBlockEnd}px`,
    "--sens-select-option-padding-inline": `${spacing.optionPaddingInline}px`,
    "--sens-select-option-padding-block": `${spacing.optionPaddingBlock}px`,
    "--sens-select-option-selected-weight": String(getTypographyToken("font-weight/semibold")),
    "--sens-select-option-regular-weight": String(getTypographyToken("font-weight/regular")),
    "--sens-select-dropdown-font-size-s": `${getTypographyToken("font-size/s")}px`,
    "--sens-select-dropdown-line-height-s": `${getTypographyToken("line-height/s")}px`,
    "--sens-select-dropdown-font-size-m": `${getTypographyToken("font-size/m")}px`,
    "--sens-select-dropdown-line-height-m": `${getTypographyToken("line-height/m")}px`,
    "--sens-select-option-description-font-size": `${getTypographyToken("font-size/s")}px`,
    "--sens-select-option-description-line-height": `${getTypographyToken("line-height/s")}px`,
    "--sens-select-option-description-color": tokenRgba("text-sub-color-transparent", 0.58),
    "--sens-select-option-description-gap": `${getUnitToken("spacing/0.5x")}px`,
  /** 统计「共 n 条」· 中性色/文字/03_辅助 @text-sub-color-transparent @58% */
    "--sens-select-dropdown-stats-color": tokenRgba("text-sub-color-transparent", 0.58),
    /** 空态辅助文案 · 同上 */
    "--sens-select-dropdown-empty-desc-color": tokenRgba("text-sub-color-transparent", 0.58),
    /** 搜索分割线 → 统计「共 n 条」：6px = spacing/1.5x */
    "--sens-select-dropdown-stats-padding-block-start": `${spacing.popupPaddingBlockStart}px`,
    "--sens-select-multiple-popup-min-width": `${SELECT_MULTIPLE_POPUP_MIN_WIDTH}px`,
    "--sens-select-actionbar-height": `${getUnitToken("size/component-height/xl")}px`,
    "--sens-select-actionbar-padding-inline": `${getUnitToken("spacing/horizontal/3x")}px`,
    "--sens-select-actionbar-gap": `${getUnitToken("spacing/horizontal/3x")}px`,
    "--sens-select-actionbar-border-color": getDividerColor("light", "transparent"),
    "--sens-select-actionbar-border-width": `${getDividerHairlineWidth()}px`,
    "--sens-select-actionbar-bg": getColorToken("white"),
    /** 面性分组标题 · Figma 17691:63738 · midnight-dark-02 @4% / 辅助字 58% */
    "--sens-select-group-title-bg": tokenRgba("background-transparent-grey", 0.04),
    "--sens-select-group-title-color": tokenRgba("text-sub-color-transparent", 0.58),
    "--sens-select-group-title-min-height": `${
      getTypographyToken("line-height/s") + 2 * spacing.optionPaddingBlock
    }px`,
    /** 线性分组通栏线 · midnight-dark-04 ≈ divideline light transparent */
    "--sens-select-group-divider-color": getDividerColor("light", "transparent"),
    "--sens-select-group-divider-width": `${getDividerHairlineWidth()}px`,
  } as CSSProperties;
}

function useSelectDropdownMatrixVars(): CSSProperties {
  return {
    "--sens-select-matrix-space-2x": `${getUnitToken("spacing/2x")}px`,
    "--sens-select-matrix-space-6x": `${getUnitToken("spacing/6x")}px`,
    "--sens-select-matrix-cell-width": `${SELECT_DROPDOWN_MATRIX_CELL_WIDTH}px`,
    "--sens-select-content-matrix-cell-width": `${SELECT_DROPDOWN_CONTENT_MATRIX_CELL_WIDTH}px`,
    "--sens-select-matrix-font-size": `${getTypographyToken("font-size/s")}px`,
    "--sens-select-matrix-line-height": `${getTypographyToken("line-height/s")}px`,
    "--sens-select-matrix-title-weight": String(getTypographyToken("font-weight/medium")),
  } as CSSProperties;
}

function SelectCheckSuffix() {
  return (
    <span className="sens-select-option-check">
      <SelectCheckIcon size={SELECT_CHECK_ICON_SIZE} />
    </span>
  );
}

function formatSelectedCountLabel(count: number, template: string): string {
  const display = count > SELECT_COUNT_MAX ? `${SELECT_COUNT_MAX}+` : String(count);
  return template.replace(/\$\{count\}/g, display).replace(/\{\{count\}\}/g, display);
}

function collectOptionLabels(options: SelectProps["options"]): Map<string | number, string> {
  const map = new Map<string | number, string>();
  const walk = (list: DefaultOptionType[] | undefined) => {
    if (!list) return;
    for (const option of list) {
      if (option.options) {
        walk(option.options as DefaultOptionType[]);
        continue;
      }
      if (option.value != null) {
        map.set(option.value as string | number, getOptionLabel(option));
      }
    }
  };
  walk(options as DefaultOptionType[] | undefined);
  return map;
}

function pickOptionsByValues(
  options: SelectProps["options"],
  values: Array<string | number>,
): DefaultOptionType[] {
  const labels = new Map<string | number, DefaultOptionType>();
  const walk = (list: DefaultOptionType[] | undefined) => {
    if (!list) return;
    for (const option of list) {
      if (option.options) {
        walk(option.options as DefaultOptionType[]);
        continue;
      }
      if (option.value != null) labels.set(option.value as string | number, option);
    }
  };
  walk(options as DefaultOptionType[] | undefined);
  return values.flatMap((item) => {
    const option = labels.get(item);
    return option ? [option] : [];
  });
}

function collectEnabledOptionValues(
  options: SelectProps["options"],
): Array<string | number> {
  const values: Array<string | number> = [];
  const walk = (list: DefaultOptionType[] | undefined) => {
    if (!list) return;
    for (const option of list) {
      if (option.options) {
        walk(option.options as DefaultOptionType[]);
        continue;
      }
      if (option.value != null && !option.disabled) {
        values.push(option.value as string | number);
      }
    }
  };
  walk(options as DefaultOptionType[] | undefined);
  return values;
}

function toCountValues(raw: SelectProps["value"] | SelectProps["defaultValue"]): Array<string | number> {
  return Array.isArray(raw) ? (raw as Array<string | number>) : [];
}

/**
 * 确认上屏展示型：触发框只渲染已提交值（不跟草稿 / 不跟 antd tag 回显）。
 * 单行（Figma `15584:52706`）：只放整颗能放下的标签（单标 max 112）+ 放不下时「…共 N 项」；
 * 多行：换行滚动，展示全部、不用 rest。
 */
function TagsCommittedDisplay({
  values,
  options,
  tagsWrap,
  closable,
  disabled,
  closeDisabled,
  labelTipsDisabled,
  emptyLabel,
  restTemplate,
  restTipsTitle,
  restTipsSuppressTriggerOpen = false,
  onRemove,
}: {
  values: Array<string | number>;
  options: SelectProps["options"];
  tagsWrap: boolean;
  closable: boolean;
  disabled: boolean;
  closeDisabled: boolean;
  labelTipsDisabled: boolean;
  emptyLabel: ReactNode;
  restTemplate: string;
  restTipsTitle: string;
  restTipsSuppressTriggerOpen?: boolean;
  onRemove: (value: string | number) => void;
}) {
  const labels = useMemo(() => collectOptionLabels(options), [options]);
  const rootRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [visibleCount, setVisibleCount] = useState(values.length);
  const tagGap = getUnitToken("spacing/horizontal/1x");
  const restText = formatSelectedCountLabel(values.length, restTemplate);

  const renderChip = (item: string | number, interactive: boolean) => (
    <SensTag
      key={String(item)}
      className="sens-select-tags-chip"
      variant="multicolor"
      size="large"
      color="neutral"
      closable={closable}
      disabled={disabled}
      closeDisabled={closeDisabled}
      labelTipsDisabled={labelTipsDisabled}
      style={{ maxWidth: SELECT_TAG_CHIP_MAX_WIDTH }}
      onClose={interactive ? () => onRemove(item) : undefined}
    >
      {labels.get(item) ?? String(item)}
    </SensTag>
  );

  useLayoutEffect(() => {
    if (tagsWrap) {
      setVisibleCount(values.length);
      return;
    }
    const root = rootRef.current;
    const measure = measureRef.current;
    if (!root || !measure || values.length === 0) {
      setVisibleCount(0);
      return;
    }

    const recompute = () => {
      const available = root.clientWidth;
      const chipEls = Array.from(measure.querySelectorAll<HTMLElement>("[data-measure-chip]"));
      const restEl = measure.querySelector<HTMLElement>("[data-measure-rest]");
      const restWidth = restEl?.getBoundingClientRect().width ?? 0;
      if (chipEls.length === 0) {
        setVisibleCount(0);
        return;
      }

      let used = 0;
      let count = 0;
      for (let i = 0; i < chipEls.length; i++) {
        const width = chipEls[i].getBoundingClientRect().width;
        const nextUsed = used + (i > 0 ? tagGap : 0) + width;
        const remaining = chipEls.length - (i + 1);
        const need = remaining > 0 ? nextUsed + tagGap + restWidth : nextUsed;
        if (need <= available + 0.5) {
          used = nextUsed;
          count = i + 1;
        } else {
          break;
        }
      }

      if (count < chipEls.length) {
        used = 0;
        count = 0;
        for (let i = 0; i < chipEls.length; i++) {
          const width = chipEls[i].getBoundingClientRect().width;
          const nextUsed = used + (i > 0 ? tagGap : 0) + width;
          if (nextUsed + tagGap + restWidth <= available + 0.5) {
            used = nextUsed;
            count = i + 1;
          } else {
            break;
          }
        }
      }

      setVisibleCount(count);
    };

    recompute();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(recompute) : null;
    ro?.observe(root);
    return () => ro?.disconnect();
  }, [closable, disabled, labels, restText, tagGap, tagsWrap, values]);

  if (values.length === 0) {
    return <span className="sens-select-tags-empty-label">{emptyLabel}</span>;
  }

  if (tagsWrap) {
    return (
      <span className="sens-select-tags-committed sens-select-tags-committed--wrap">
        {values.map((item) => renderChip(item, true))}
      </span>
    );
  }

  const showRest = visibleCount < values.length;
  const visibleValues = values.slice(0, visibleCount);
  const restNode = <span className="sens-select-tags-rest">{restText}</span>;

  return (
    <span ref={rootRef} className="sens-select-tags-committed sens-select-tags-committed--single">
      <span ref={measureRef} className="sens-select-tags-committed-measure" aria-hidden>
        {values.map((item) => (
          <span key={`m-${String(item)}`} data-measure-chip="" className="sens-select-tags-committed-measure-chip">
            {renderChip(item, false)}
          </span>
        ))}
        <span data-measure-rest="" className="sens-select-tags-rest">
          {restText}
        </span>
      </span>
      <span className="sens-select-tags-committed-chips">
        {visibleValues.map((item) => renderChip(item, true))}
      </span>
      {showRest ? (
        restTipsTitle ? (
          <SensTips
            title={restTipsTitle}
            disabled={disabled}
            suppressTriggerOpen={restTipsSuppressTriggerOpen}
          >
            {restNode}
          </SensTips>
        ) : restNode
      ) : null}
    </span>
  );
}

export type SensSelectDropdownGroupStyle = "title" | "divider";

export interface SensSelectDropdownProps extends Omit<SelectProps, "options"> {
  /** 未传则跟当前 Functional Skin；勾选色固定中性图标，不换肤 */
  functionalSkin?: FunctionalSkin;
  /** 浮层内搜索（R2）。多选确认菜单默认开启，选择器调用即可 */
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
  /** 增量加载：列表底部的加载更多 / 加载中 / 加载失败状态。 */
  loadMoreState?: SelectDropdownLoadMoreState;
  onLoadMore?: () => void;
  onLoadMoreRetry?: () => void;
  /** 覆盖本地默认匹配（原文/全拼/首字母/searchText） */
  filterMatcher?: SelectOptionFilterMatcher;
  /** R3：悬停显示清空 × */
  clearable?: boolean;
  /** R3：框内/框外警告 */
  warningPlacement?: SensInputWarningPlacement;
  help?: ReactNode;
  warningMessage?: ReactNode;
  /** 固定宽三档：选中前后保持同宽；特殊宽度由具体场景另行确认 */
  widthPreset?: SensSelectWidthPreset;
  /** 自适应宽：min 148 / max 600，随内容增长 */
  widthMode?: SensSelectWidthMode;
  /** 多选回显：`count` 个数型；`tags` 展示型标签。默认浮层走复选确认 */
  multiDisplay?: SensSelectMultiDisplay;
  /**
   * 多选是否「完成才回显」。默认 true（有操作栏）。
   * 展示型确认：触发框只显示已提交；菜单改草稿；点「完成」收起后才上屏。
   * `false`：无操作栏，勾选即时写入触发框。
   */
  confirmMultiple?: boolean;
  /** 简约型：无边框触发框，仅单选；浮层仍走单选下拉 */
  appearance?: "simple";
  /**
   * 展示型标签是否多行换行。默认 false：单行 32px，放不下用「…共 N 项」（N=已选总数）。
   * true：换行，min 32 / max 128，超出滚动，展示全部标签。
   */
  tagsWrap?: boolean;
  /** 展示型只读：`filled` 只读_背景 / `plain` 只读_字段。表单详情用，不展开浮层 */
  readOnlyVariant?: SensInputReadOnlyVariant;
  /**
   * 带层级分组：`title` 灰底标题（面性），`divider` 组间通栏线（线性）。
   * 仅对 `options` 里带 `options` 的 OptGroup 生效；有搜索词时打平，不显示分组。
   */
  groupStyle?: SensSelectDropdownGroupStyle;
  /** 选项可提供 description，渲染为主文案下方的辅助文案。 */
  options?: SensSelectOption[];
}

function resolveSelectWidthStyle(
  widthPreset?: SensSelectWidthPreset,
  widthMode?: SensSelectWidthMode,
): CSSProperties {
  if (widthPreset) {
    return { width: SELECT_FIXED_WIDTH_PRESETS[widthPreset] };
  }

  if (widthMode === "adaptive") {
    return {
      width: "fit-content",
      minWidth: SELECT_ADAPTIVE_MIN_WIDTH,
      maxWidth: SELECT_ADAPTIVE_MAX_WIDTH,
      "--sens-select-adaptive-min-width": `${SELECT_ADAPTIVE_MIN_WIDTH}px`,
      "--sens-select-adaptive-max-width": `${SELECT_ADAPTIVE_MAX_WIDTH}px`,
    } as CSSProperties;
  }

  return {};
}

function pickBoxWidthStyle(style: CSSProperties): CSSProperties {
  const next: CSSProperties = {};
  if (style.width !== undefined) next.width = style.width;
  if (style.minWidth !== undefined) next.minWidth = style.minWidth;
  if (style.maxWidth !== undefined) next.maxWidth = style.maxWidth;
  const adaptiveMin = style["--sens-select-adaptive-min-width" as keyof CSSProperties];
  const adaptiveMax = style["--sens-select-adaptive-max-width" as keyof CSSProperties];
  if (adaptiveMin !== undefined) {
    (next as Record<string, unknown>)["--sens-select-adaptive-min-width"] = adaptiveMin;
  }
  if (adaptiveMax !== undefined) {
    (next as Record<string, unknown>)["--sens-select-adaptive-max-width"] = adaptiveMax;
  }
  return next;
}

/** 基础单选 Select + 浮层 token（R1 容器/行 + R2 搜索 + R3 触发框） */
export function SensSelectDropdown({
  functionalSkin,
  searchable: searchableProp = false,
  searchMode = "local",
  searchDebounce = 300,
  resetSearchOnClose = true,
  onSearch,
  optionsLoadFailed,
  onEmptyAction,
  loadMoreState,
  onLoadMore,
  onLoadMoreRetry,
  filterMatcher,
  clearable = false,
  warningPlacement,
  help,
  warningMessage,
  widthPreset,
  widthMode,
  multiDisplay,
  confirmMultiple = true,
  appearance,
  groupStyle = "title",
  tagsWrap = false,
  readOnlyVariant,
  tagRender,
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
  mode: modeProp,
  maxTagCount: maxTagCountProp,
  maxTagPlaceholder: maxTagPlaceholderProp,
  onChange,
  value,
  defaultValue,
  disabled,
  open: openProp,
  defaultOpen,
  popupMatchSelectWidth: popupMatchSelectWidthProp,
  placeholder,
  listHeight: listHeightProp,
  listItemHeight: listItemHeightProp,
  ...props
}: SensSelectDropdownProps) {
  const { t } = useTranslation();
  const isSimple = appearance === "simple";
  const isCountDisplay = !isSimple && multiDisplay === "count";
  const isTagDisplay = !isSimple && multiDisplay === "tags";
  const isMultipleMenu = !isSimple && (modeProp === "multiple" || isCountDisplay || isTagDisplay);
  const isMultipleConfirm = isMultipleMenu && confirmMultiple !== false;
  const searchable = searchableProp;
  const isCountControlled = value !== undefined;
  const [uncontrolledCountValues, setUncontrolledCountValues] = useState(() =>
    toCountValues(defaultValue),
  );
  const countValues = isCountControlled ? toCountValues(value) : uncontrolledCountValues;
  const committedMultipleValues = isCountControlled
    ? toCountValues(value)
    : uncontrolledCountValues;
  const [draftMultipleValues, setDraftMultipleValues] = useState(committedMultipleValues);
  const [innerOpen, setInnerOpen] = useState(Boolean(defaultOpen));
  const commitOnCloseRef = useRef(false);
  const multipleOpenRef = useRef(Boolean(defaultOpen));
  const resolvedOpen = loading ? false : (openProp ?? innerOpen);
  const openGateRef = useRef<SensSelectOpenGate>({ close: () => undefined });
  const countTemplate = t(`${I18N_NS}.sensd-select-selectedCount`, {
    defaultValue: "已选择 ${count} 项",
  });
  const triggerStyle = useSensSelectTriggerStyle(size);
  const tooltipMessage = warningMessage ?? help;
  const insideWarningSuffix =
    !isSimple && warningPlacement === "inside" ? (
      <InsideErrorSuffix size={size} message={tooltipMessage} />
    ) : undefined;
  const triggerProps = useSensSelectTriggerProps(
    isSimple || isTagDisplay ? false : clearable,
    triggerStyle,
    insideWarningSuffix,
    Boolean(loading),
  );
  const isWarning = warningPlacement === "inside" || warningPlacement === "outside";
  const status = isWarning ? "error" : statusProp;

  const isAdaptive = widthMode === "adaptive" && !widthPreset;
  const hasOutsideHelp =
    !isSimple && warningPlacement === "outside" && help != null && help !== "";
  const mergedClassName = [
    triggerProps.className,
    isCountDisplay ? "sens-select-count" : "",
    isCountDisplay && isMultipleConfirm ? "sens-select-count-confirm" : "",
    isTagDisplay ? "sens-select-tags" : "",
    isTagDisplay && tagsWrap ? "sens-select-tags-wrap" : "",
    isTagDisplay && isMultipleConfirm ? "sens-select-tags-confirm" : "",
    isTagDisplay && isMultipleConfirm && resolvedOpen ? "sens-select-tags-confirm-open" : "",
    isMultipleMenu ? "sens-select-multiple" : "",
    isAdaptive ? "sens-select-adaptive" : "",
    isSimple ? "sens-select-simple" : "",
    loading ? "sens-select-loading" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const widthStyle =
    isSimple && !widthPreset && !widthMode
      ? { width: "fit-content" as const }
      : resolveSelectWidthStyle(widthPreset, widthMode);
  const mergedStyle = { ...triggerProps.style, ...widthStyle, ...style };
  const mergedSuffixIcon = suffixIconProp ?? triggerProps.suffixIcon;
  const mergedAllowClear =
    allowClearProp ?? ("allowClear" in triggerProps ? triggerProps.allowClear : undefined);

  const dropdownStyle = useSensSelectDropdownStyle(functionalSkin);
  const popupRootStyle = {
    ...dropdownStyle,
    ...(isSimple
      ? {
          minWidth: SELECT_ADAPTIVE_MIN_WIDTH,
          "--sens-select-simple-popup-min-width": `${SELECT_ADAPTIVE_MIN_WIDTH}px`,
        }
      : {}),
    ...(isMultipleMenu
      ? {
          minWidth: SELECT_MULTIPLE_POPUP_MIN_WIDTH,
        }
      : {}),
    ...styles?.popup?.root,
  } as CSSProperties;

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

  const selectOptions = useMemo(() => {
    const baseOptions = searchable ? displayOptions : (options ?? []);
    if (!loadMoreState) return baseOptions;
    return [
      ...baseOptions,
      {
        value: LOAD_MORE_OPTION_VALUE,
        label: "加载更多",
        __sensSelectLoadMore: true,
      } satisfies LoadMoreOptionData,
    ];
  }, [displayOptions, loadMoreState, options, searchable]);

  const showingGroups = hasSelectOptionGroups(options) && !query.trim();
  const popupRootClass = [
    "sens-select-dropdown",
    searchable ? "sens-select-dropdown--searchable" : "",
    isSimple ? "sens-select-dropdown--simple" : "",
    isMultipleMenu ? "sens-select-dropdown--multiple" : "",
    showingGroups
      ? groupStyle === "divider"
        ? "sens-select-dropdown--group-divider"
        : "sens-select-dropdown--group-title"
      : "",
    classNames?.popup?.root,
  ]
    .filter(Boolean)
    .join(" ");

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (loading) return;
      if (open) {
        const previous = activeSensSelectOpen;
        activeSensSelectOpen = openGateRef.current;
        if (previous && previous !== openGateRef.current) previous.close();
        if (isMultipleConfirm) {
          multipleOpenRef.current = true;
          setDraftMultipleValues(committedMultipleValues);
        }
        if (openProp === undefined) setInnerOpen(true);
      } else {
        if (activeSensSelectOpen === openGateRef.current) activeSensSelectOpen = null;
        if (isMultipleConfirm) {
          if (!multipleOpenRef.current) {
            onOpenChange?.(open);
            return;
          }
          multipleOpenRef.current = false;
          if (commitOnCloseRef.current) {
            if (!isCountControlled) setUncontrolledCountValues(draftMultipleValues);
            onChange?.(draftMultipleValues, pickOptionsByValues(options, draftMultipleValues));
          } else {
            setDraftMultipleValues(committedMultipleValues);
          }
          commitOnCloseRef.current = false;
        }
        if (openProp === undefined) setInnerOpen(false);
        if (resetSearchOnClose) resetSearch();
      }
      onOpenChange?.(open);
    },
    [
      committedMultipleValues,
      draftMultipleValues,
      isCountControlled,
      isMultipleConfirm,
      loading,
      onChange,
      onOpenChange,
      openProp,
      options,
      resetSearch,
      resetSearchOnClose,
    ],
  );

  openGateRef.current.close = () => {
    commitOnCloseRef.current = false;
    handleOpenChange(false);
  };

  useEffect(
    () => () => {
      if (activeSensSelectOpen === openGateRef.current) activeSensSelectOpen = null;
    },
    [],
  );

  const closeMultiplePopup = useCallback(
    (commit: boolean) => {
      commitOnCloseRef.current = commit;
      handleOpenChange(false);
    },
    [handleOpenChange],
  );

  const selectAllTargets = useMemo(
    () => collectEnabledOptionValues(searchable ? displayOptions : options),
    [displayOptions, options, searchable],
  );
  const selectAllChecked =
    selectAllTargets.length > 0 &&
    selectAllTargets.every((item) => draftMultipleValues.includes(item));
  const selectAllIndeterminate =
    !selectAllChecked && selectAllTargets.some((item) => draftMultipleValues.includes(item));
  const selectAllDisabled = selectAllTargets.length === 0;

  const handleSelectAllChange = useCallback(
    (checked: boolean) => {
      const targets = collectEnabledOptionValues(searchable ? displayOptions : options);
      if (checked) {
        setDraftMultipleValues((prev) => {
          const existing = new Set(prev);
          const next = [...prev];
          for (const value of targets) {
            if (!existing.has(value)) next.push(value);
          }
          return next;
        });
        return;
      }
      const remove = new Set(targets);
      setDraftMultipleValues((prev) => prev.filter((value) => !remove.has(value)));
    },
    [displayOptions, options, searchable],
  );

  const handleChange = useCallback<NonNullable<SelectProps["onChange"]>>(
    (next, option) => {
      if (Array.isArray(next) ? next.includes(LOAD_MORE_OPTION_VALUE) : next === LOAD_MORE_OPTION_VALUE) {
        return;
      }
      if (isMultipleConfirm) {
        const nextValues = toCountValues(next);
        if (!multipleOpenRef.current) {
          if (!isCountControlled) setUncontrolledCountValues(nextValues);
          setDraftMultipleValues(nextValues);
          onChange?.(nextValues, option);
          return;
        }
        setDraftMultipleValues(nextValues);
        return;
      }
      if (isMultipleMenu && !isCountControlled) {
        setUncontrolledCountValues(toCountValues(next));
      }
      onChange?.(next, option);
    },
    [isCountControlled, isMultipleConfirm, isMultipleMenu, onChange],
  );

  const countTipsTitle = useMemo(() => {
    if (!isCountDisplay || countValues.length === 0 || countValues.length > SELECT_COUNT_TIPS_MAX) return "";
    const labels = collectOptionLabels(options);
    return countValues.map((item) => labels.get(item) ?? String(item)).join("、");
  }, [countValues, isCountDisplay, options]);

  const emptyTriggerLabel = placeholder ?? t(`${I18N_NS}.sensd-select-placeholder`, { defaultValue: "请选择" });

  const countMaxTagPlaceholder = useCallback(
    (omitted: { length: number }) => {
      const n = isMultipleConfirm ? committedMultipleValues.length : omitted.length;
      if (n === 0) {
        return <span className="sens-select-count-empty-label">{emptyTriggerLabel}</span>;
      }
      return formatSelectedCountLabel(n, countTemplate);
    },
    [committedMultipleValues.length, countTemplate, emptyTriggerLabel, isMultipleConfirm],
  );

  const multipleTriggerPlaceholder = useCallback(
    () =>
      committedMultipleValues.length === 0 ? (
        <span className="sens-select-count-empty-label">{emptyTriggerLabel}</span>
      ) : (
        formatSelectedCountLabel(committedMultipleValues.length, countTemplate)
      ),
    [committedMultipleValues.length, countTemplate, emptyTriggerLabel],
  );

  const tagsDisplayValues = isMultipleConfirm
    ? committedMultipleValues
    : isCountControlled
      ? toCountValues(value)
      : uncontrolledCountValues;
  const tagsRestTemplate = t(`${I18N_NS}.sensd-select-tagsRestCount`, {
    defaultValue: "…共 ${count} 项",
  });
  const tagsRestTipsTitle = useMemo(() => {
    if (!isTagDisplay || disabled || loading || tagsDisplayValues.length === 0) return "";
    const labels = collectOptionLabels(options);
    return tagsDisplayValues.map((item) => labels.get(item) ?? String(item)).join("、");
  }, [disabled, isTagDisplay, loading, options, tagsDisplayValues]);
  const tagsRestPlaceholder = useCallback(() => {
    const label = (
      <span className="sens-select-tags-rest">
        {formatSelectedCountLabel(tagsDisplayValues.length, tagsRestTemplate)}
      </span>
    );
    if (!tagsRestTipsTitle) return label;
    return (
      <SensTips
        title={tagsRestTipsTitle}
        disabled={disabled || loading}
        suppressTriggerOpen={resolvedOpen}
      >
        {label}
      </SensTips>
    );
  }, [disabled, loading, resolvedOpen, tagsDisplayValues.length, tagsRestTemplate, tagsRestTipsTitle]);

  /** 确认展示型：触发框永远只显示已提交（叠加层，不跟 antd/草稿空态） */
  const confirmTagsOwnDisplay = isTagDisplay && isMultipleConfirm;
  const tagsConfirmOpen = confirmTagsOwnDisplay && Boolean(resolvedOpen);

  const removeCommittedTag = useCallback(
    (item: string | number) => {
      if (disabled || loading || tagsConfirmOpen) return;
      const next = committedMultipleValues.filter((value) => value !== item);
      if (!isCountControlled) setUncontrolledCountValues(next);
      setDraftMultipleValues(next);
      onChange?.(next, pickOptionsByValues(options, next));
    },
    [
      committedMultipleValues,
      disabled,
      isCountControlled,
      loading,
      onChange,
      options,
      tagsConfirmOpen,
    ],
  );

  const tagsCommittedLayerRef = useRef<HTMLSpanElement>(null);
  const tagsCommittedPointerRef = useRef<{
    x: number;
    y: number;
    scrollLeft: number;
    scrollTop: number;
    scrolled: boolean;
  } | null>(null);
  const [confirmHostMinHeight, setConfirmHostMinHeight] = useState<number>(
    getUnitToken("size/component-height/m"),
  );

  useLayoutEffect(() => {
    /* 多行由标签层文档流撑高；单行仍用测量同步宿主 minHeight */
    if (!confirmTagsOwnDisplay || tagsWrap) return;
    const el = tagsCommittedLayerRef.current;
    if (!el) return;
    const inputHeight = getUnitToken("size/component-height/m");
    const sync = () => setConfirmHostMinHeight(Math.max(inputHeight, Math.ceil(el.getBoundingClientRect().height)));
    sync();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(sync) : null;
    ro?.observe(el);
    return () => ro?.disconnect();
  }, [committedMultipleValues, confirmTagsOwnDisplay, tagsConfirmOpen, tagsWrap]);

  const mergedTagRender = useCallback<NonNullable<SelectProps["tagRender"]>>(
    (tagProps) => {
      if (tagRender) return tagRender(tagProps);
      /* rest「…共 N 项」是 React 节点，再包 SensTag 会叠色 */
      if (isValidElement(tagProps.label)) return tagProps.label;
      /* 确认展示型不走 antd tag 回显 */
      if (confirmTagsOwnDisplay) return <></>;
      const closable = tagProps.closable && !disabled && !loading;
      return (
        <SensTag
          className="sens-select-tags-chip"
          variant="multicolor"
          size="large"
          color="neutral"
          closable={closable}
          disabled={Boolean(disabled || loading)}
          labelTipsDisabled={Boolean(resolvedOpen)}
          style={{ maxWidth: SELECT_TAG_CHIP_MAX_WIDTH }}
          onClose={() => tagProps.onClose()}
        >
          {tagProps.label}
        </SensTag>
      );
    },
    [confirmTagsOwnDisplay, disabled, loading, resolvedOpen, tagRender],
  );

  const mergedOptionRender = useCallback<NonNullable<SelectProps["optionRender"]>>(
    (option, info) => {
      if (isLoadMoreOptionData(option.data)) {
        return (
          <SelectDropdownLoadMore
            state={loadMoreState ?? "more"}
            interactive
            onLoadMore={onLoadMore}
            onRetry={onLoadMoreRetry}
          />
        );
      }
      if (optionRender) return optionRender(option, info);
      if (option.group) return option.label;

      const text = String(option.label ?? option.value ?? "");
      const highlighted = query.trim() ? <SearchHighlight text={text} keyword={query} /> : text;
      const optionData = option.data as SensSelectOption | undefined;
      const optionDescription = optionData?.description;
      const optionCopy = (
        <span className={optionDescription != null ? "sens-select-option-copy sens-select-option-copy--description" : "sens-select-option-copy"}>
          <span className="sens-select-option-primary">{highlighted}</span>
          {optionDescription != null && optionDescription !== "" ? (
            <span className="sens-select-option-description">{optionDescription}</span>
          ) : null}
        </span>
      );
      const optionContent = optionData?.icon ? (
        <span className="sens-select-option-with-icon">
          <span className="sens-select-option-icon" aria-hidden>
            {optionData.icon}
          </span>
          {optionCopy}
        </span>
      ) : optionCopy;
      if (!isMultipleMenu) return optionContent;

      const optionValue = option.value ?? (option.data as DefaultOptionType | undefined)?.value;
      const selectedValues = isMultipleConfirm
        ? draftMultipleValues
        : isCountControlled
          ? toCountValues(value)
          : uncontrolledCountValues;
      const selected =
        optionValue != null && selectedValues.some((item) => item === optionValue);
      const optionDisabled = Boolean((option.data as DefaultOptionType | undefined)?.disabled);

      return (
        <SensCheckbox
          checked={selected}
          disabled={optionDisabled}
          readOnly
          tabIndex={-1}
          aria-hidden
          className="sens-select-option-checkbox"
        >
          {optionContent}
        </SensCheckbox>
      );
    },
    [
      draftMultipleValues,
      isCountControlled,
      isMultipleConfirm,
      isMultipleMenu,
      loadMoreState,
      optionRender,
      onLoadMore,
      onLoadMoreRetry,
      query,
      uncontrolledCountValues,
      value,
    ],
  );

  const mergedPopupRender = useCallback<NonNullable<SelectProps["popupRender"]>>(
    (menu) => {
      const searchBody = searchable ? (
        <>
          <SelectDropdownSearch
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onBack={resetSearch}
            onKeyDown={(event) => event.stopPropagation()}
            disablePlaceholderTip
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

      const body = isMultipleConfirm ? (
        <>
          {searchBody}
          <SelectDropdownActionBar
            selectedCount={draftMultipleValues.length}
            selectAllChecked={selectAllChecked}
            selectAllIndeterminate={selectAllIndeterminate}
            selectAllDisabled={selectAllDisabled}
            onSelectAllChange={handleSelectAllChange}
            onDiscard={() => closeMultiplePopup(false)}
            onComplete={() => closeMultiplePopup(true)}
          />
        </>
      ) : (
        searchBody
      );

      const renderedPopup = popupRender ? popupRender(body) : body;
      return renderedPopup;
    },
    [
      closeMultiplePopup,
      contentPhase,
      draftMultipleValues.length,
      handleSelectAllChange,
      isMultipleConfirm,
      onEmptyAction,
      popupRender,
      query,
      resetSearch,
      resultCount,
      searchable,
      selectAllChecked,
      selectAllDisabled,
      selectAllIndeterminate,
      setQuery,
      showOptionList,
      sourceCount,
    ],
  );

  const usesPopupRender = searchable || isMultipleMenu;
  const usesOptionRender =
    isMultipleMenu ||
    Boolean(loadMoreState) ||
    hasOptionIcons(searchable ? (displayOptions as SensSelectOption[]) : options) ||
    hasOptionDescriptions(searchable ? (displayOptions as SensSelectOption[]) : options) ||
    (searchable && Boolean(query.trim()));

  const selectNode = (
    <Select
      className={mergedClassName}
      style={mergedStyle}
      size={size}
      status={status}
      variant={isSimple ? "borderless" : "outlined"}
      suffixIcon={mergedSuffixIcon}
      allowClear={mergedAllowClear}
      classNames={{
        ...classNames,
        popup: { ...classNames?.popup, root: popupRootClass },
      }}
      styles={{
        ...styles,
        popup: { root: popupRootStyle },
      }}
      menuItemSelectedIcon={isMultipleMenu ? null : selectedCheckIcon}
      options={selectOptions}
      loading={loading}
      showSearch={searchable || isCountDisplay || isMultipleMenu ? false : showSearch}
      filterOption={searchable ? false : filterOption}
      popupRender={usesPopupRender ? mergedPopupRender : popupRender}
      optionRender={usesOptionRender ? mergedOptionRender : optionRender}
      onOpenChange={handleOpenChange}
      open={resolvedOpen}
      mode={isSimple ? undefined : isCountDisplay || isMultipleMenu ? "multiple" : modeProp}
      maxTagCount={
        isTagDisplay
          ? confirmTagsOwnDisplay
            ? 0
            : tagsWrap
              ? maxTagCountProp
              : (maxTagCountProp ?? "responsive")
          : isCountDisplay || isMultipleConfirm
            ? 0
            : maxTagCountProp
      }
      maxTagPlaceholder={
        isCountDisplay
          ? (maxTagPlaceholderProp ?? countMaxTagPlaceholder)
          : confirmTagsOwnDisplay
            ? () => null
            : isTagDisplay
              ? (maxTagPlaceholderProp ?? tagsRestPlaceholder)
              : isMultipleConfirm
                ? (maxTagPlaceholderProp ?? multipleTriggerPlaceholder)
                : maxTagPlaceholderProp
      }
      tagRender={isTagDisplay ? mergedTagRender : tagRender}
      value={
        isMultipleConfirm
          ? draftMultipleValues
          : isMultipleMenu
            ? isCountControlled
              ? toCountValues(value)
              : uncontrolledCountValues
            : value
      }
      defaultValue={isMultipleMenu ? undefined : defaultValue}
      disabled={disabled}
      onChange={handleChange}
      placeholder={placeholder}
      listHeight={listHeightProp ?? SELECT_LIST_MAX_HEIGHT}
      listItemHeight={listItemHeightProp ?? SELECT_OPTION_HEIGHT}
      {...props}
      virtual={showingGroups ? false : props.virtual}
      popupMatchSelectWidth={
        popupMatchSelectWidthProp ??
        (isSimple ? SELECT_ADAPTIVE_MIN_WIDTH : isMultipleMenu ? false : undefined)
      }
      builtinPlacements={hasOutsideHelp ? selectOutsideHelpPlacements() : props.builtinPlacements}
    />
  );

  const tagsCommittedDisplay = confirmTagsOwnDisplay ? (
    <TagsCommittedDisplay
      values={committedMultipleValues}
      options={options}
      tagsWrap={tagsWrap}
      closable
      disabled={Boolean(disabled || loading)}
      closeDisabled={Boolean(disabled || loading || tagsConfirmOpen)}
      labelTipsDisabled={Boolean(resolvedOpen)}
      emptyLabel={emptyTriggerLabel}
      restTemplate={tagsRestTemplate}
      restTipsTitle={tagsRestTipsTitle}
      restTipsSuppressTriggerOpen={resolvedOpen}
      onRemove={removeCommittedTag}
    />
  ) : null;

  const confirmHostCssVars = Object.fromEntries(
    Object.entries(mergedStyle).filter(([key]) => key.startsWith("--")),
  ) as CSSProperties;
  const handleTagsCommittedLayerMouseDown = useCallback(
    (event: ReactMouseEvent<HTMLSpanElement>) => {
      if (!confirmTagsOwnDisplay || disabled || loading || resolvedOpen || event.button !== 0) return;
      const target = event.target;
      if (target instanceof Element && target.closest('[aria-label="移除"]')) return;
      tagsCommittedPointerRef.current = {
        x: event.clientX,
        y: event.clientY,
        scrollLeft: event.currentTarget.scrollLeft,
        scrollTop: event.currentTarget.scrollTop,
        scrolled: false,
      };
    },
    [confirmTagsOwnDisplay, disabled, loading, resolvedOpen],
  );
  const handleTagsCommittedLayerScroll = useCallback(() => {
    if (tagsCommittedPointerRef.current) {
      tagsCommittedPointerRef.current.scrolled = true;
    }
  }, []);
  const handleTagsCommittedLayerClick = useCallback(
    (event: ReactMouseEvent<HTMLSpanElement>) => {
      if (!confirmTagsOwnDisplay || disabled || loading || resolvedOpen || event.button !== 0) return;
      const target = event.target;
      if (target instanceof Element && target.closest('[aria-label="移除"]')) return;
      const pointer = tagsCommittedPointerRef.current;
      tagsCommittedPointerRef.current = null;
      if (!pointer) return;
      const moved = Math.abs(event.clientX - pointer.x) > 4 || Math.abs(event.clientY - pointer.y) > 4;
      const scrolled =
        pointer.scrolled ||
        event.currentTarget.scrollLeft !== pointer.scrollLeft ||
        event.currentTarget.scrollTop !== pointer.scrollTop;
      if (moved || scrolled) return;
      event.preventDefault();
      event.stopPropagation();
      handleOpenChange(true);
    },
    [confirmTagsOwnDisplay, disabled, handleOpenChange, loading, resolvedOpen],
  );

  const selectWithCommittedLayer = confirmTagsOwnDisplay ? (
    <span
      className={[
        "sens-select-tags-confirm-host",
        tagsWrap ? "sens-select-tags-confirm-host--wrap" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        ...confirmHostCssVars,
        width: isAdaptive ? "fit-content" : (mergedStyle.width ?? "100%"),
        minWidth: mergedStyle.minWidth,
        maxWidth: mergedStyle.maxWidth,
        minHeight: tagsWrap ? undefined : confirmHostMinHeight,
      }}
    >
      {selectNode}
      <span
        ref={tagsCommittedLayerRef}
        className="sens-select-tags-committed-layer"
        onMouseDownCapture={handleTagsCommittedLayerMouseDown}
        onScroll={handleTagsCommittedLayerScroll}
        onClickCapture={handleTagsCommittedLayerClick}
      >
        {tagsCommittedDisplay}
      </span>
    </span>
  ) : (
    selectNode
  );

  const countCommittedDisplay = isCountDisplay && isMultipleConfirm ? (
    <span className="sens-select-count-committed-layer" aria-hidden>
      {committedMultipleValues.length === 0 ? (
        <span className="sens-select-count-empty-label">{emptyTriggerLabel}</span>
      ) : (
        formatSelectedCountLabel(committedMultipleValues.length, countTemplate)
      )}
    </span>
  ) : null;

  const unsetLabel = t(`${I18N_NS}.sensd-input-unset`, { defaultValue: "未设置" });
  const readOnlyValues = useMemo(() => {
    if (!readOnlyVariant) return [];
    if (isMultipleMenu) return committedMultipleValues;
    const rawValue = value ?? defaultValue;
    if (rawValue == null || Array.isArray(rawValue)) return [];
    return [rawValue as string | number];
  }, [committedMultipleValues, defaultValue, isMultipleMenu, readOnlyVariant, value]);
  const readOnlyText = useMemo(() => {
    if (!readOnlyVariant) return "";
    const labels = collectOptionLabels(options);
    if (readOnlyValues.length === 0) return unsetLabel;
    return readOnlyValues.map((item) => labels.get(item) ?? String(item)).join("、");
  }, [options, readOnlyValues, readOnlyVariant, unsetLabel]);

  const handleCountTriggerMouseDown = useCallback(
    (event: ReactMouseEvent<HTMLSpanElement>) => {
      if (
        !isCountDisplay ||
        !isMultipleConfirm ||
        disabled ||
        loading ||
        resolvedOpen ||
        event.button !== 0
      ) {
        return;
      }
      const target = event.target;
      if (target instanceof Element && target.closest(".ant-select-clear")) return;
      event.preventDefault();
      event.stopPropagation();
      handleOpenChange(true);
    },
    [disabled, handleOpenChange, isCountDisplay, isMultipleConfirm, loading, resolvedOpen],
  );
  const countSelectHost = isCountDisplay ? (
    <span
      className="sens-select-count-host"
      onMouseDownCapture={handleCountTriggerMouseDown}
      style={{
        width: isAdaptive ? "fit-content" : (mergedStyle.width ?? "100%"),
        minWidth: mergedStyle.minWidth,
        maxWidth: mergedStyle.maxWidth,
      }}
    >
      <span
        className={isCountDisplay && isMultipleConfirm ? "sens-select-count-confirm-host" : undefined}
        style={isCountDisplay && isMultipleConfirm ? confirmHostCssVars : undefined}
      >
        {selectWithCommittedLayer}
        {countCommittedDisplay}
      </span>
    </span>
  ) : (
    selectWithCommittedLayer
  );
  const selectWithTips = countTipsTitle ? (
    <SensTips
      title={countTipsTitle}
      disabled={Boolean(disabled || loading)}
      suppressTriggerOpen={resolvedOpen}
    >
      {countSelectHost}
    </SensTips>
  ) : (
    countSelectHost
  );

  if (readOnlyVariant) {
    const isFilled = readOnlyVariant === "filled";
    const showInsideIcon = warningPlacement === "inside";
    const hasReadOnlyValue = readOnlyValues.length > 0;
    const readOnlyNode = (
      <div
        className={[
          isFilled ? "sens-select-readonly-filled" : "sens-select-readonly-plain",
          showInsideIcon ? "sens-select-readonly-warning" : "",
          isFilled && !isAdaptive ? "sens-select-readonly--fixed" : "",
          isAdaptive ? "sens-select-readonly--adaptive" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ ...triggerStyle, ...widthStyle, ...style }}
      >
        <span className="sens-select-readonly-text">
          {hasReadOnlyValue ? (
            <SensTips title={readOnlyText}>
              <span className="sens-select-readonly-text-inner">{readOnlyText}</span>
            </SensTips>
          ) : (
            readOnlyText
          )}
        </span>
        {showInsideIcon ? <InsideErrorSuffix size={size} message={tooltipMessage} /> : null}
      </div>
    );
    if (hasOutsideHelp) {
      return (
        <div
          className={[
            "sens-select-trigger-field",
            isAdaptive ? "sens-select-trigger-field--adaptive" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ ...triggerStyle, ...pickBoxWidthStyle(mergedStyle) }}
        >
          {readOnlyNode}
          <InputHelpRow help={help} />
        </div>
      );
    }
    return readOnlyNode;
  }

  if (hasOutsideHelp) {
    return (
      <div
        className={[
          "sens-select-trigger-field",
          isAdaptive ? "sens-select-trigger-field--adaptive" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ ...triggerStyle, ...pickBoxWidthStyle(mergedStyle) }}
      >
        {selectWithTips}
        <InputHelpRow help={help} />
      </div>
    );
  }

  return selectWithTips;
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
  multiple = false,
}: {
  label: string;
  selected: boolean;
  disabled: boolean;
  multiple?: boolean;
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
      <div className="ant-select-item-option-content">
        {multiple ? (
          <SensCheckbox
            checked={selected}
            disabled={disabled}
            readOnly
            tabIndex={-1}
            aria-hidden
            className="sens-select-option-checkbox"
          >
            {label}
          </SensCheckbox>
        ) : (
          label
        )}
      </div>
      {selected && !multiple ? (
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
  multiple = false,
}: {
  selection: SelectDropdownSelection;
  state: SelectDropdownPreviewState;
  optionLabel: string;
  dropdownStyle: CSSProperties;
  multiple?: boolean;
}) {
  const selected = selection === "selected";
  const disabled = state === "disabled" || state === "disabledHover";

  return (
    <div className={matrixPreviewWrapperClass(state)}>
      <div
        className={[
          "ant-select-dropdown",
          "sens-select-dropdown",
          multiple ? "sens-select-dropdown--multiple" : "",
          "sens-select-dropdown-matrix-shell",
          "css-var-root",
          "ant-select-dropdown-placement-bottomLeft",
        ]
          .filter(Boolean)
          .join(" ")}
        style={dropdownStyle}
      >
        <div>
          <div className="rc-virtual-list-holder-inner">
            <MatrixOptionRow
              label={optionLabel}
              selected={selected}
              disabled={disabled}
              multiple={multiple}
            />
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
  multiple?: boolean;
}

function SelectDropdownMatrixRow({
  selection,
  optionLabel,
  dropdownStyle,
  label,
  multiple = false,
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
              multiple={multiple}
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
  functionalSkin,
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

/** 多选复选行 2 行 × 5 态。Figma `17685:60706` */
export function SelectMultipleOptionStatesPreview({
  title,
  functionalSkin,
}: SelectDropdownStatesPreviewProps) {
  const { t } = useTranslation();
  const dropdownStyle = useSensSelectDropdownStyle(functionalSkin);
  const optionLabel = t(`${I18N_NS}.sensd-select-dropdown-option-label`, {
    defaultValue: "选项",
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
          multiple
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
  functionalSkin,
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
  | "disabledHover"
  | "loading"
  | "loadingHover";

type SelectTriggerPreviewWarning = "none" | "inside" | "outside";
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
  loading: "sensd-button-state-loading",
  loadingHover: "sensd-button-state-loadingHover",
};

const TRIGGER_STATE_DEFAULT: Record<SelectTriggerPreviewState, string> = {
  default: "默认",
  hover: "悬停",
  focus: "聚焦",
  disabled: "禁用",
  disabledHover: "禁用悬停",
  loading: "加载",
  loadingHover: "加载悬停",
};

const TRIGGER_WARNING_I18N: Record<SelectTriggerPreviewWarning, string> = {
  none: "sensd-select-trigger-group-none",
  inside: "sensd-select-trigger-group-warningInside",
  outside: "sensd-select-trigger-group-warningOutside",
};

const TRIGGER_WARNING_DEFAULT: Record<SelectTriggerPreviewWarning, string> = {
  none: "无警告",
  inside: "框内警告",
  outside: "框外警告",
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

function getSelectTriggerPreviewStyleToken(): SelectTriggerPreviewStyleToken {
  return {
    hoverBorderColor: functionalCssVar("--sens-skin-primary", "component-primary"),
    activeBorderColor: functionalCssVar("--sens-skin-active", "component-active"),
    activeShadow: `0 0 0 2px ${functionalCssVar("--sens-skin-active-shadow", "component-active-shadow")}`,
    colorBorderDisabledHover: tokenRgba("line-color-transparent", 0.06),
    colorBgContainerDisabledHover: tokenRgba("background-transparent-grey", 0.04),
    colorErrorHover: getColorToken("warning-color-hover"),
    colorErrorActive: getColorToken("warning-color-active"),
    errorActiveShadow: `0 0 0 2px ${tokenRgba("warning-color-active-shadow", 0.2)}`,
    colorTextPlaceholderDisabledHover: getColorToken("text-color-transparent-disable-hover"),
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
    "--sens-select-matrix-font-size": `${getTypographyToken("font-size/s")}px`,
    "--sens-select-matrix-line-height": `${getTypographyToken("line-height/s")}px`,
    "--sens-select-matrix-title-weight": String(getTypographyToken("font-weight/medium")),
  } as CSSProperties;
}

function triggerPreviewWrapperClass(state: SelectTriggerPreviewState): string {
  if (state === "hover") return "sens-select-trigger-matrix-preview--hover";
  if (state === "focus") return "sens-select-trigger-matrix-preview--focus";
  if (state === "disabledHover") return "sens-select-trigger-matrix-preview--disabled-hover";
  if (state === "loadingHover") return "sens-select-trigger-matrix-preview--loading-hover";
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

  if (warning === "outside") {
    props.warningPlacement = "outside";
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

/** R3：触发框 3 警告 × 2 内容 × 5 态（仅 32px，无小尺寸） */
export function SelectTriggerStatesPreview({ title }: SelectTriggerStatesPreviewProps) {
  const { t } = useTranslation();
  const styleToken = getSelectTriggerPreviewStyleToken();
  const placeholder = t(`${I18N_NS}.sensd-select-placeholder`, { defaultValue: "请选择" });
  const label = (key: string, defaultValue: string) => t(`${I18N_NS}.${key}`, { defaultValue });

  const warnings: SelectTriggerPreviewWarning[] = ["none", "inside", "outside"];
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

const COUNT_PREVIEW_VALUES_99 = Array.from({ length: 99 }, (_, index) => index);
const COUNT_PREVIEW_VALUES_OVERFLOW = Array.from({ length: SELECT_COUNT_MAX + 1 }, (_, index) => index);

function buildCountPreviewSelectProps(
  state: SelectTriggerPreviewState,
  content: SelectTriggerPreviewContent,
  warning: SelectTriggerPreviewWarning,
  widthPreset: Extract<SensSelectWidthPreset, "128" | "148">,
  placeholder: string,
): SensSelectDropdownProps {
  const props: SensSelectDropdownProps = {
    multiDisplay: "count",
    widthPreset,
    placeholder,
    options: SELECT_TRIGGER_PREVIEW_OPTIONS,
    defaultValue:
      content === "empty"
        ? undefined
        : widthPreset === "148"
          ? COUNT_PREVIEW_VALUES_OVERFLOW
          : COUNT_PREVIEW_VALUES_99,
    open: false,
  };

  if (warning === "inside") {
    props.warningPlacement = "inside";
    props.help = "警告文案";
  }

  if (warning === "outside") {
    props.warningPlacement = "outside";
    props.help = "警告文案";
  }

  if (state === "disabled" || state === "disabledHover") {
    props.disabled = true;
  }

  if (state === "loading" || state === "loadingHover") {
    props.loading = true;
  }

  return props;
}

function SelectCountTriggerMatrixRow({
  widthPreset,
  content,
  warning,
  styleToken,
  placeholder,
  label,
}: {
  widthPreset: Extract<SensSelectWidthPreset, "128" | "148">;
  content: SelectTriggerPreviewContent;
  warning: SelectTriggerPreviewWarning;
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
    "loading",
    "loadingHover",
  ];
  const rowTitle = [
    label(TRIGGER_WARNING_I18N[warning], TRIGGER_WARNING_DEFAULT[warning]),
    `${widthPreset}px`,
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
                {...buildCountPreviewSelectProps(state, content, warning, widthPreset, placeholder)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export interface SelectCountTriggerStatesPreviewProps {
  title?: ReactNode;
}

/** 多选个数型：无 / 框内警告 / 框外警告 × 128 / 148 × 未选 / 已选 × 7 态（含禁用 / 加载） */
export function SelectCountTriggerStatesPreview({ title }: SelectCountTriggerStatesPreviewProps) {
  const { t } = useTranslation();
  const styleToken = getSelectTriggerPreviewStyleToken();
  const placeholder = t(`${I18N_NS}.sensd-select-placeholder`, { defaultValue: "请选择" });
  const label = (key: string, defaultValue: string) => t(`${I18N_NS}.${key}`, { defaultValue });
  const warnings: SelectTriggerPreviewWarning[] = ["none", "inside", "outside"];
  const widths: Array<Extract<SensSelectWidthPreset, "128" | "148">> = ["128", "148"];
  const contents: SelectTriggerPreviewContent[] = ["empty", "filled"];

  return (
    <div className="sens-select-trigger-matrix" style={useSelectTriggerMatrixPreviewVars()}>
      {title ? <div className="sens-select-trigger-matrix-title">{title}</div> : null}
      {warnings.map((warning) => (
        <div key={warning} className="sens-select-trigger-matrix-group">
          {widths.map((widthPreset) =>
            contents.map((content) => (
              <SelectCountTriggerMatrixRow
                key={`${warning}-${widthPreset}-${content}`}
                widthPreset={widthPreset}
                content={content}
                warning={warning}
                styleToken={styleToken}
                placeholder={placeholder}
                label={label}
              />
            )),
          )}
        </div>
      ))}
    </div>
  );
}

type SelectSimplePreviewState =
  | "default"
  | "hover"
  | "click"
  | "open"
  | "disabled"
  | "disabledHover";

type SelectSimplePreviewWarning = "none" | "warning";

const SIMPLE_STATE_I18N: Record<SelectSimplePreviewState, string> = {
  default: "sensd-input-state-default",
  hover: "sensd-input-state-hover",
  click: "sensd-select-dropdown-state-click",
  open: "sensd-select-trigger-state-active",
  disabled: "sensd-input-state-disabled",
  disabledHover: "sensd-input-state-disabledHover",
};

const SIMPLE_STATE_DEFAULT: Record<SelectSimplePreviewState, string> = {
  default: "默认",
  hover: "悬停",
  click: "点击",
  open: "激活",
  disabled: "禁用",
  disabledHover: "禁用悬停",
};

const SIMPLE_WARNING_I18N: Record<SelectSimplePreviewWarning, string> = {
  none: "sensd-select-trigger-group-none",
  warning: "sensd-select-simple-group-warning",
};

const SIMPLE_WARNING_DEFAULT: Record<SelectSimplePreviewWarning, string> = {
  none: "无警告",
  warning: "警告",
};

function simplePreviewWrapperClass(state: SelectSimplePreviewState): string {
  if (state === "hover") return "sens-select-simple-matrix-preview--hover";
  if (state === "click") return "sens-select-simple-matrix-preview--click";
  if (state === "open") return "sens-select-simple-matrix-preview--open";
  if (state === "disabledHover") return "sens-select-simple-matrix-preview--disabled-hover";
  return "";
}

function buildSimplePreviewSelectProps(
  state: SelectSimplePreviewState,
  content: SelectTriggerPreviewContent,
  warning: SelectSimplePreviewWarning,
  placeholder: string,
): SensSelectDropdownProps {
  const props: SensSelectDropdownProps = {
    appearance: "simple",
    placeholder,
    options: SELECT_TRIGGER_PREVIEW_OPTIONS,
    defaultValue: content === "filled" ? "a" : undefined,
    open: false,
  };

  if (warning === "warning") {
    props.warningPlacement = "outside";
  }

  if (state === "disabled" || state === "disabledHover") {
    props.disabled = true;
  }

  return props;
}

function SelectSimpleTriggerMatrixRow({
  warning,
  content,
  placeholder,
  label,
}: {
  warning: SelectSimplePreviewWarning;
  content: SelectTriggerPreviewContent;
  placeholder: string;
  label: (key: string, defaultValue: string) => string;
}) {
  const states: SelectSimplePreviewState[] =
    warning === "warning"
      ? ["default", "hover", "click", "open"]
      : ["default", "hover", "click", "open", "disabled", "disabledHover"];
  const rowTitle = [
    label(SIMPLE_WARNING_I18N[warning], SIMPLE_WARNING_DEFAULT[warning]),
    label(TRIGGER_CONTENT_I18N[content], TRIGGER_CONTENT_DEFAULT[content]),
  ].join(" / ");

  return (
    <div className="sens-select-trigger-matrix-row">
      <span className="sens-select-trigger-matrix-title">{rowTitle}</span>
      <div className="sens-select-trigger-matrix-states">
        {states.map((state) => (
          <div key={state} className="sens-select-trigger-matrix-cell">
            <span className="sens-select-trigger-matrix-label">
              {label(SIMPLE_STATE_I18N[state], SIMPLE_STATE_DEFAULT[state])}
            </span>
            <div className={simplePreviewWrapperClass(state)}>
              <SensSelectDropdown
                {...buildSimplePreviewSelectProps(state, content, warning, placeholder)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export interface SelectSimpleTriggerStatesPreviewProps {
  title?: ReactNode;
}

/** 简约型：无 / 警告 × 未选 / 已选 × 6 态（禁用+警告无对应组件） */
export function SelectSimpleTriggerStatesPreview({ title }: SelectSimpleTriggerStatesPreviewProps) {
  const { t } = useTranslation();
  const placeholder = t(`${I18N_NS}.sensd-select-placeholder`, { defaultValue: "请选择" });
  const label = (key: string, defaultValue: string) => t(`${I18N_NS}.${key}`, { defaultValue });
  const warnings: SelectSimplePreviewWarning[] = ["none", "warning"];
  const contents: SelectTriggerPreviewContent[] = ["empty", "filled"];

  return (
    <div className="sens-select-trigger-matrix" style={useSelectTriggerMatrixPreviewVars()}>
      {title ? <div className="sens-select-trigger-matrix-title">{title}</div> : null}
      {warnings.map((warning) => (
        <div key={warning} className="sens-select-trigger-matrix-group">
          {contents.map((content) => (
            <SelectSimpleTriggerMatrixRow
              key={`${warning}-${content}`}
              warning={warning}
              content={content}
              placeholder={placeholder}
              label={label}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

const TAGS_PREVIEW_OPTIONS = [
  { value: "a", label: "选项 A" },
  { value: "b", label: "选项 B" },
  { value: "c", label: "选项 C" },
];
const TAGS_PREVIEW_VALUES = ["a", "b", "c"];

function buildTagsPreviewSelectProps(
  state: SelectTriggerPreviewState,
  content: SelectTriggerPreviewContent,
  placeholder: string,
): SensSelectDropdownProps {
  const props: SensSelectDropdownProps = {
    multiDisplay: "tags",
    widthPreset: "320",
    placeholder,
    options: TAGS_PREVIEW_OPTIONS,
    defaultValue: content === "empty" ? undefined : TAGS_PREVIEW_VALUES,
    open: false,
  };

  if (state === "disabled" || state === "disabledHover") {
    props.disabled = true;
  }

  if (state === "loading" || state === "loadingHover") {
    props.loading = true;
  }

  return props;
}

function SelectTagsTriggerMatrixRow({
  content,
  styleToken,
  placeholder,
  label,
}: {
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
    "loading",
    "loadingHover",
  ];
  const rowTitle = label(TRIGGER_CONTENT_I18N[content], TRIGGER_CONTENT_DEFAULT[content]);

  return (
    <div className="sens-select-trigger-matrix-row" style={resolveSelectTriggerPreviewVars("none", styleToken)}>
      <span className="sens-select-trigger-matrix-title">{rowTitle}</span>
      <div className="sens-select-trigger-matrix-states">
        {states.map((state) => (
          <div key={state} className="sens-select-trigger-matrix-cell">
            <span className="sens-select-trigger-matrix-label">
              {label(TRIGGER_STATE_I18N[state], TRIGGER_STATE_DEFAULT[state])}
            </span>
            <div className={triggerPreviewWrapperClass(state)}>
              <SensSelectDropdown {...buildTagsPreviewSelectProps(state, content, placeholder)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export interface SelectTagsTriggerStatesPreviewProps {
  title?: ReactNode;
}

/** 多选展示型：320 定宽 × 未选 / 已选 × 7 态 + 只读两档 */
export function SelectTagsTriggerStatesPreview({ title }: SelectTagsTriggerStatesPreviewProps) {
  const { t } = useTranslation();
  const styleToken = getSelectTriggerPreviewStyleToken();
  const placeholder = t(`${I18N_NS}.sensd-select-placeholder`, { defaultValue: "请选择" });
  const label = (key: string, defaultValue: string) => t(`${I18N_NS}.${key}`, { defaultValue });
  const contents: SelectTriggerPreviewContent[] = ["empty", "filled"];
  const matrixVars = {
    "--sens-select-matrix-space-2x": `${getUnitToken("spacing/2x")}px`,
    "--sens-select-matrix-space-6x": `${getUnitToken("spacing/6x")}px`,
    "--sens-select-trigger-matrix-cell-width": `${SELECT_TAGS_MATRIX_CELL_WIDTH}px`,
    "--sens-select-matrix-font-size": `${getTypographyToken("font-size/s")}px`,
    "--sens-select-matrix-line-height": `${getTypographyToken("line-height/s")}px`,
    "--sens-select-matrix-title-weight": String(getTypographyToken("font-weight/medium")),
  } as CSSProperties;

  return (
    <div className="sens-select-trigger-matrix" style={matrixVars}>
      {title ? <div className="sens-select-trigger-matrix-title">{title}</div> : null}
      {contents.map((content) => (
        <SelectTagsTriggerMatrixRow
          key={content}
          content={content}
          styleToken={styleToken}
          placeholder={placeholder}
          label={label}
        />
      ))}
      <div className="sens-select-trigger-matrix-group">
        <div className="sens-select-trigger-matrix-row">
          <span className="sens-select-trigger-matrix-title">只读</span>
          <div className="sens-select-trigger-matrix-states">
            {(
              [
                ["filled", "empty", "只读有背景 / 未选"],
                ["filled", "filled", "只读有背景 / 已选"],
                ["plain", "empty", "只读无背景 / 未选"],
                ["plain", "filled", "只读无背景 / 已选"],
              ] as const
            ).map(([variant, content, caption]) => (
              <div key={`${variant}-${content}`} className="sens-select-trigger-matrix-cell">
                <span className="sens-select-trigger-matrix-label">{caption}</span>
                <SensSelectDropdown
                  multiDisplay="tags"
                  widthPreset="320"
                  placeholder={placeholder}
                  options={TAGS_PREVIEW_OPTIONS}
                  defaultValue={content === "empty" ? undefined : TAGS_PREVIEW_VALUES}
                  readOnlyVariant={variant}
                  open={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="sens-select-trigger-matrix-group">
        <div className="sens-select-trigger-matrix-row">
          <span className="sens-select-trigger-matrix-title">只读 × 警告</span>
          <div className="sens-select-trigger-matrix-states">
            {(
              [
                ["filled", "inside", "有背景 / 框内"],
                ["filled", "outside", "有背景 / 框外"],
                ["plain", "inside", "字段 / 框内"],
                ["plain", "outside", "字段 / 框外"],
              ] as const
            ).map(([variant, placement, caption]) => (
              <div key={`${variant}-${placement}`} className="sens-select-trigger-matrix-cell">
                <span className="sens-select-trigger-matrix-label">{caption}</span>
                <SensSelectDropdown
                  multiDisplay="tags"
                  widthPreset="320"
                  placeholder={placeholder}
                  options={TAGS_PREVIEW_OPTIONS}
                  defaultValue={TAGS_PREVIEW_VALUES}
                  readOnlyVariant={variant}
                  warningPlacement={placement}
                  help="警告文案"
                  open={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
