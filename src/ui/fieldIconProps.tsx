import type { CSSProperties, ReactNode } from "react";
import tokens from "../design-system/tokens.resolved.json";
import { SearchIcon } from "./SearchIcon";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CloseCircleIcon,
  SelectClearIcon,
} from "./FieldIcons";
import { useSensIconTokens } from "./useSensIconTokens";

const u = tokens.unit as Record<string, number>;

/** Input / Select allowClear 清除图标（Figma 1430:4796） */
export function useSensAllowClear() {
  return { clearIcon: <CloseCircleIcon className="sens-clear-icon" /> };
}

/** Select 后缀：收起 down / 展开 up（Figma 804:78 / 804:79），互斥显示 */
export function SensSelectSuffix() {
  return (
    <span className="sens-select-suffix-icons" aria-hidden>
      <ChevronDownIcon className="sens-select-suffix-down" />
      <ChevronUpIcon className="sens-select-suffix-up" />
    </span>
  );
}

/** R3 主选择器触发框箭头（Figma 804:78 down / 804:79 up，互斥显示，中性色不变绿） */
export function SensSelectTriggerArrow() {
  return (
    <span className="sens-select-trigger-arrow-icons" aria-hidden>
      <ChevronDownIcon className="sens-select-trigger-arrow-down" />
      <ChevronUpIcon className="sens-select-trigger-arrow-up" />
    </span>
  );
}

/** Select 后缀箭头 props（搜索分类等；箭头中性，文案/描边走主色链） */
export function useSensSelectSuffixProps(extraStyle?: CSSProperties) {
  const icons = useSensIconTokens();
  return {
    suffixIcon: <SensSelectSuffix />,
    className: "sens-select-with-icons",
    style: {
      "--sens-search-icon-chevron": icons.default,
      "--sens-search-action-disabled-color": icons.disabled,
      "--sens-search-gap": `${u["spacing/1x"]}px`,
      ...extraStyle,
    } as CSSProperties,
  };
}

/** R3 触发框后缀：箭头在左、框内警告菱形在右（Figma 15474:49040） */
export function SensSelectTriggerSuffix({ insideWarning }: { insideWarning?: ReactNode }) {
  return (
    <span className="sens-select-trigger-suffix-group">
      <SensSelectTriggerArrow />
      {insideWarning ? (
        <span className="sens-select-inside-warning-slot">{insideWarning}</span>
      ) : null}
    </span>
  );
}

/** R3 触发框 suffix（中性箭头，与搜索分类 hook 分离） */
export function useSensSelectTriggerSuffixProps(
  extraStyle?: CSSProperties,
  insideWarning?: ReactNode,
) {
  return {
    suffixIcon: <SensSelectTriggerSuffix insideWarning={insideWarning} />,
    className: [
      "sens-select-trigger",
      "sens-select-with-trigger-arrow",
      insideWarning ? "sens-select-has-inside-warning" : "",
    ]
      .filter(Boolean)
      .join(" "),
    style: extraStyle,
  };
}

/** R3 触发框 props：箭头 + 可选 clearable + 可选框内警告 */
export function useSensSelectTriggerProps(
  clearable = false,
  extraStyle?: CSSProperties,
  insideWarning?: ReactNode,
) {
  const suffix = useSensSelectTriggerSuffixProps(extraStyle, insideWarning);
  if (!clearable) return suffix;
  return {
    ...suffix,
    allowClear: { clearIcon: <SelectClearIcon className="sens-select-clear-icon" /> },
  };
}

/** 带设计系统图标的 Select 通用 props（含 allowClear） */
export function useSensSelectProps() {
  const allowClear = useSensAllowClear();
  return {
    ...useSensSelectSuffixProps(),
    allowClear,
  };
}

/** 搜索前缀图标 + 图标/文字间距 CSS 变量（icons.md · spacing/1x） */
export function useSensSearchPrefix() {
  return <SearchIcon className="sens-search-prefix-icon" />;
}

/** 任意带搜索前缀的 Input：className + 图标色 CSS 变量 */
export function useSensSearchFieldProps(extraStyle?: CSSProperties) {
  const icons = useSensIconTokens();

  return {
    className: "sens-search-field",
    prefix: useSensSearchPrefix(),
    style: {
      "--sens-search-icon-muted": icons.default,
      "--sens-search-icon-hover": icons.hover,
      "--sens-search-action-disabled-color": icons.disabled,
      "--sens-search-gap": `${u["spacing/1x"]}px`,
      ...extraStyle,
    } as CSSProperties,
  };
}
