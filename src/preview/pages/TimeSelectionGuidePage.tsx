import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { buildActiveRingShadow, buildShadowD4, getColorToken, tokenRgba } from "../../design-system/color-utils";
import { getDividerColor, getDividerHairlineWidth } from "../../design-system/divider";
import { SensIcon } from "../../design-system/icons";
import { getTypographyToken } from "../../design-system/typography";
import { getUnitToken } from "../../design-system/unit";
import { SensButton, SensInputNumber } from "../../ui";
import "./time-selection-guide.css";

type Mode = "static" | "dynamic";
const STATIC_PRESETS = [
  [{ key: "custom", label: "自定义时间" }],
  [{ key: "today", label: "今天" }, { key: "yesterday", label: "昨天" }],
  [{ key: "this-week", label: "本周" }, { key: "last-week", label: "上周" }],
  [{ key: "this-month", label: "本月" }, { key: "last-month", label: "上月" }],
  [{ key: "this-year", label: "今年" }, { key: "last-year", label: "去年" }],
  [{ key: "past-7", label: "过去 7 天" }, { key: "past-14", label: "过去 14 天" }],
  [{ key: "past-30", label: "过去 30 天" }, { key: "past-60", label: "过去 60 天" }],
  [{ key: "past-90", label: "过去 90 天" }, { key: "past-180", label: "过去 180 天" }],
  [{ key: "online", label: "上线至今" }],
];
const DYNAMIC_PRESETS = [
  [{ key: "today", label: "今天" }, { key: "yesterday", label: "昨天" }],
  [{ key: "this-week", label: "本周" }, { key: "last-week", label: "上周" }],
  [{ key: "this-month", label: "本月" }, { key: "last-month", label: "上月" }],
  [{ key: "this-year", label: "今年" }, { key: "last-year", label: "去年" }],
  [{ key: "past-7", label: "过去 7 天" }, { key: "past-14", label: "过去 14 天" }],
  [{ key: "past-30", label: "过去 30 天" }, { key: "past-60", label: "过去 60 天" }],
  [{ key: "past-90", label: "过去 90 天" }, { key: "past-180", label: "过去 180 天" }],
  [{ key: "online", label: "上线至今" }],
  [{ key: "specified-to-now", label: "指定日期至今" }],
  [{ key: "past-n-to-now", label: "过去 N 天至今" }],
  [{ key: "specified-to-past-n", label: "指定日期至过去第 N 天" }],
  [{ key: "past-n-to-m", label: "过去第 N 天至过去第 M 天" }],
  [{ key: "past-business-days", label: "过去 N 个交易日" }],
];
const WEEKDAYS = ["一", "二", "三", "四", "五", "六", "日"];
const px = (value: number) => `${value}px`;

type TimeRange = { start: string; end: string; startTime?: string; endTime?: string };

const STATIC_RANGES: Record<string, TimeRange> = {
  custom: { start: "2023-09-20", end: "2023-09-20", startTime: "00:00:00", endTime: "12:59:59" },
  today: { start: "2023-09-20", end: "2023-09-20" },
  yesterday: { start: "2023-09-19", end: "2023-09-19" },
  "this-week": { start: "2023-09-18", end: "2023-09-20" },
  "last-week": { start: "2023-09-11", end: "2023-09-17" },
  "this-month": { start: "2023-09-01", end: "2023-09-20" },
  "last-month": { start: "2023-08-01", end: "2023-08-31" },
  "this-year": { start: "2023-01-01", end: "2023-09-20" },
  "last-year": { start: "2022-01-01", end: "2022-12-31" },
  "past-7": { start: "2023-09-14", end: "2023-09-20" },
  "past-14": { start: "2023-09-07", end: "2023-09-20" },
  "past-30": { start: "2023-08-22", end: "2023-09-20" },
  "past-60": { start: "2023-07-23", end: "2023-09-20" },
  "past-90": { start: "2023-06-23", end: "2023-09-20" },
  "past-180": { start: "2023-03-25", end: "2023-09-20" },
  online: { start: "2015-04-25", end: "2023-09-20" },
};

type DynamicRange = TimeRange & {
  tag: string;
  startLabel: string;
  endLabel: string;
  startNumber?: number;
  endNumber?: number;
  suffix?: string;
};

const INITIAL_RELATIVE_NUMBERS: Record<string, number> = {
  "past-n-to-now-start": 7,
  "specified-to-past-n-end": 1,
  "past-n-to-m-start": 7,
  "past-n-to-m-end": 1,
  "past-business-days-start": 2,
};

function dynamicTagFor(key: string, numbers: Record<string, number>) {
  const range = DYNAMIC_RANGES[key];
  const startNumber = numbers[`${key}-start`] ?? range.startNumber;
  const endNumber = numbers[`${key}-end`] ?? range.endNumber;
  if (key === "past-n-to-now") return `过去 ${startNumber} 天至今`;
  if (key === "specified-to-past-n") return `指定日期至过去第 ${endNumber} 天`;
  if (key === "past-n-to-m") return `过去第 ${startNumber} 天至过去第 ${endNumber} 天`;
  if (key === "past-business-days") return `过去 ${startNumber} 个交易日至当前交易日`;
  return range.tag;
}

const DYNAMIC_RANGES: Record<string, DynamicRange> = {
  today: { start: "2023-09-20", end: "2023-09-20", tag: "今天", startLabel: "今天", endLabel: "今天" },
  yesterday: { start: "2023-09-19", end: "2023-09-19", tag: "昨天", startLabel: "昨天", endLabel: "昨天" },
  "this-week": { start: "2023-09-18", end: "2023-09-20", tag: "本周", startLabel: "本周一", endLabel: "今天" },
  "last-week": { start: "2023-09-11", end: "2023-09-17", tag: "上周", startLabel: "上周第 1 天", endLabel: "上周最后 1 天" },
  "this-month": { start: "2023-09-01", end: "2023-09-20", tag: "本月", startLabel: "本月第 1 天", endLabel: "今天" },
  "last-month": { start: "2023-08-01", end: "2023-08-31", tag: "上月", startLabel: "上月第 1 天", endLabel: "上月最后 1 天" },
  "this-year": { start: "2023-01-01", end: "2023-09-20", tag: "今年", startLabel: "今年第 1 天", endLabel: "今天" },
  "last-year": { start: "2022-01-01", end: "2022-12-31", tag: "去年", startLabel: "去年第 1 天", endLabel: "去年最后 1 天" },
  "past-7": { start: "2023-09-13", end: "2023-09-19", tag: "过去 7 天", startLabel: "过去第 7 天", endLabel: "昨天" },
  "past-14": { start: "2023-09-06", end: "2023-09-19", tag: "过去 14 天", startLabel: "过去第 14 天", endLabel: "昨天" },
  "past-30": { start: "2023-08-21", end: "2023-09-19", tag: "过去 30 天", startLabel: "过去第 30 天", endLabel: "昨天" },
  "past-60": { start: "2023-07-22", end: "2023-09-19", tag: "过去 60 天", startLabel: "过去第 60 天", endLabel: "昨天" },
  "past-90": { start: "2023-06-22", end: "2023-09-19", tag: "过去 90 天", startLabel: "过去第 90 天", endLabel: "昨天" },
  "past-180": { start: "2023-03-24", end: "2023-09-19", tag: "过去 180 天", startLabel: "过去第 180 天", endLabel: "昨天" },
  online: { start: "2015-04-25", end: "2023-09-20", tag: "上线至今", startLabel: "上线日期", endLabel: "今天" },
  "specified-to-now": { start: "2023-09-13", end: "2023-09-20", tag: "指定日期至今", startLabel: "指定日期 · 2023-09-13", endLabel: "今天" },
  "past-n-to-now": { start: "2023-09-13", end: "2023-09-20", tag: "过去 7 天至今", startLabel: "过去", endLabel: "今天", startNumber: 7 },
  "specified-to-past-n": { start: "2023-09-13", end: "2023-09-19", tag: "指定日期至过去第 1 天", startLabel: "指定日期 · 2023-09-13", endLabel: "过去第", endNumber: 1 },
  "past-n-to-m": { start: "2023-09-13", end: "2023-09-19", tag: "过去第 7 天至过去第 1 天", startLabel: "过去第", endLabel: "过去第", startNumber: 7, endNumber: 1 },
  "past-business-days": { start: "2026-04-14", end: "2026-04-17", tag: "过去 2 个交易日", startLabel: "过去", endLabel: "当前交易日", startNumber: 2, suffix: "个交易日" },
};

function TimeSelector({ value }: { value: string }) {
  return <span className="tg-time-selector" onClick={(event) => event.stopPropagation()}>
    {value}
  </span>;
}

function TimePrecisionControl({
  value,
  label,
  active,
  onClick,
}: {
  value: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return <button
    className={`tg-time-control${active ? " tg-time-control--active" : ""}`}
    type="button"
    aria-label={`${label} ${value}`}
    aria-pressed={active}
    onClick={onClick}
  >
    {value}
    <SensIcon name={active ? "chevron-up" : "chevron-down"} size={14} />
  </button>;
}

function TimePrecisionPreview({ value, label }: { value: string; label: string }) {
  const [active, setActive] = useState(false);
  return <TimePrecisionControl value={value} label={label} active={active} onClick={() => setActive((current) => !current)} />;
}

type DisabledTriggerVariant = "placeholder" | "static-range" | "dynamic-range";

function DisabledTriggerSample({ variant, hover = false }: { variant: DisabledTriggerVariant; hover?: boolean }) {
  const iconColor = hover ? getColorToken("icon-color-transparent-disable-hover") : undefined;
  const iconRole = hover ? undefined : "disabled";
  return <button
    className={`tg-trigger tg-trigger--disabled${hover ? " tg-trigger--disabled-hover" : ""}`}
    type="button"
    disabled
    aria-label={`${variant === "placeholder" ? "未选择" : variant === "static-range" ? "静态日期时间区间" : "动态日期区间"}，禁用${hover ? "悬停" : ""}`}
  >
    <SensIcon name="calendar" sizeToken="size/icon/m" colorRole={iconRole} color={iconColor} />
    {variant === "placeholder" ? <span className="tg-trigger-placeholder">请选择</span> : variant === "static-range" ? <>
      <span>2023-09-20 00:00:00</span>
      <SensIcon name="arrow-right" sizeToken="size/icon/m" colorRole={iconRole} color={iconColor} />
      <span>2023-09-20 23:59:59</span>
    </> : <>
      <span className="tg-relative-tag">过去 7 天</span>
      <span>2023-09-13</span>
      <SensIcon name="arrow-right" sizeToken="size/icon/m" colorRole={iconRole} color={iconColor} />
      <span>2023-09-19</span>
    </>}
  </button>;
}

function DisabledTriggerExamples() {
  const examples: Array<{ variant: DisabledTriggerVariant; label: string }> = [
    { variant: "placeholder", label: "未选择" },
    { variant: "static-range", label: "静态日期时间区间" },
    { variant: "dynamic-range", label: "动态日期区间" },
  ];
  return <section className="tg-section" aria-labelledby="tg-disabled-title">
    <div className="tg-section-heading">
      <h2 id="tg-disabled-title">禁用状态</h2>
      <p>禁用入口不可打开面板；悬停时只呈现中性禁用反馈。</p>
    </div>
    <div className="tg-disabled-examples">
      {examples.map(({ variant, label }) => <article className="tg-disabled-example" key={variant}>
        <h3>{label}</h3>
        <div className="tg-disabled-state">
          <span>禁用</span>
          <DisabledTriggerSample variant={variant} />
        </div>
        <div className="tg-disabled-state">
          <span>禁用悬停</span>
          <DisabledTriggerSample variant={variant} hover />
        </div>
      </article>)}
    </div>
  </section>;
}

function guideVars(): CSSProperties {
  return {
    "--tg-bg": getColorToken("background-transparent-grey"),
    "--tg-white": getColorToken("white"),
    "--tg-text": tokenRgba("text-color-transparent", 0.9),
    "--tg-sub": tokenRgba("text-sub-color-transparent", 0.58),
    "--tg-disabled": tokenRgba("text-color-transparent-disable", 0.3),
    "--tg-disabled-hover-text": getColorToken("text-color-transparent-disable-hover"),
    "--tg-disabled-bg": getColorToken("background-transparent-grey-hover"),
    "--tg-disabled-hover-bg": getColorToken("background-transparent-grey"),
    "--tg-icon": getColorToken("icon-color-transparent"),
    "--tg-link": getColorToken("link-color"),
    "--tg-primary": getColorToken("component-primary"),
    "--tg-hover": getColorToken("component-hover"),
    "--tg-active": getColorToken("component-active"),
    "--tg-active-bg": getColorToken("component-active-background"),
    "--tg-active-hover-bg": getColorToken("component-active-hover-background"),
    "--tg-active-click-bg": getColorToken("component-active-click-background"),
    "--tg-tag-bg": getColorToken("background-01-transparent"),
    "--tg-input-bg": getColorToken("background-transparent-grey-hover"),
    "--tg-line": getDividerColor("light", "transparent"),
    "--tg-weak-line": getDividerColor("weak", "transparent"),
    "--tg-deep-line": getDividerColor("deep", "transparent"),
    "--tg-line-width": px(getDividerHairlineWidth()),
    "--tg-radius": px(getUnitToken("radius/l")),
    "--tg-control-radius": px(getUnitToken("radius/m")),
    "--tg-small-radius": px(getUnitToken("radius/s")),
    "--tg-padding": px(getUnitToken("spacing/vertical/7x")),
    "--tg-gap": px(getUnitToken("spacing/vertical/4x")),
    "--tg-viewport-margin": px(getUnitToken("spacing/2x")),
    "--tg-viewport-gutter": px(getUnitToken("spacing/4x")),
    "--tg-shortcut-gap": px(getUnitToken("spacing/1x")),
    "--tg-shortcut-padding-block": px(getUnitToken("spacing/2x")),
    "--tg-shortcut-padding-inline": px(getUnitToken("spacing/1x")),
    "--tg-shortcut-item-padding-inline": px(getUnitToken("spacing/2x")),
    "--tg-title-size": px(getTypographyToken("font-size/xxl")),
    "--tg-title-line": px(getTypographyToken("line-height/xxl")),
    "--tg-heading-size": px(getTypographyToken("font-size/l")),
    "--tg-heading-line": px(getTypographyToken("line-height/l")),
    "--tg-body-size": px(getTypographyToken("font-size/m")),
    "--tg-body-line": px(getTypographyToken("line-height/m")),
    "--tg-small-size": px(getTypographyToken("font-size/s")),
    "--tg-small-line": px(getTypographyToken("line-height/s")),
    "--tg-weight": getTypographyToken("font-weight/semibold"),
    "--tg-medium-weight": getTypographyToken("font-weight/medium"),
    "--tg-regular-weight": getTypographyToken("font-weight/regular"),
    "--tg-control-height": px(getUnitToken("size/component-height/m")),
    "--tg-small-height": px(getUnitToken("size/component-height/s")),
    "--tg-shadow": buildShadowD4(),
    "--tg-active-ring": buildActiveRingShadow("component-active-shadow"),
  } as CSSProperties;
}

function MonthPreview({
  month,
  range,
  previewAnchor,
  previewDate,
  onDateClick,
  onDateHover,
}: {
  month: 8 | 9;
  range: TimeRange;
  previewAnchor: string | null;
  previewDate: string | null;
  onDateClick: (date: string) => void;
  onDateHover: (date: string) => void;
}) {
  const firstDay = month === 8 ? 1 : 4;
  const days = month === 8 ? 31 : 30;
  return (
    <div className="tg-month" aria-label={`2023 年 ${month} 月日历示意`}>
      <div className="tg-month-head">
        <span className="tg-month-nav" aria-hidden="true">{month === 8 && <><SensIcon name="arrow-doubule-left" sizeToken="size/icon/s" /><SensIcon name="left" sizeToken="size/icon/s" /></>}</span>
        <span className="tg-month-title">
          <span className="tg-month-selector">2023<SensIcon name="chevron-down" size={14} colorRole="subtle" /></span>
          <span className="tg-month-selector">{String(month).padStart(2, "0")}<SensIcon name="chevron-down" size={14} colorRole="subtle" /></span>
        </span>
        <span className="tg-month-nav" aria-hidden="true">{month === 9 && <SensIcon name="arrow-doubule-right" sizeToken="size/icon/s" />}</span>
      </div>
      <div className="tg-calendar-grid" aria-label={`${month} 月日期`}>
        {WEEKDAYS.map((day) => <span className="tg-weekday" key={day}>{day}</span>)}
        {Array.from({ length: 35 }, (_, index) => {
          const date = index - firstDay + 1;
          const visible = date > 0 && date <= days;
          const isoDate = `2023-${String(month).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
          const selected = visible && isoDate >= range.start && isoDate <= range.end;
          const isPreviewing = Boolean(previewAnchor && previewDate && previewAnchor !== previewDate);
          const isAnchor = selected && isPreviewing && isoDate === previewAnchor;
          const isStart = selected && !isPreviewing && isoDate === range.start;
          const isEnd = selected && !isPreviewing && isoDate === range.end;
          const isPreviewEdge = isPreviewing && isoDate === previewDate;
          const previewSide = isPreviewEdge && previewAnchor && previewDate
            ? (previewDate < previewAnchor ? "left" : "right")
            : null;
          if (!visible) return <span className="tg-day tg-day--placeholder" key={index} aria-hidden="true" />;
          return <button
            className={`tg-day${selected && !isAnchor && !isPreviewEdge ? " tg-day--in-range" : ""}${isStart ? " tg-day--range-start" : ""}${isEnd ? " tg-day--range-end" : ""}${isStart && isEnd ? " tg-day--selected" : ""}${isAnchor ? " tg-day--selected" : ""}${isPreviewEdge ? ` tg-day--preview-edge tg-day--preview-edge-${previewSide}` : ""}`}
            type="button"
            aria-label={`2023 年 ${month} 月 ${date} 日${selected ? "，已在选择范围内" : ""}`}
            aria-pressed={selected}
            key={index}
            onClick={() => onDateClick(isoDate)}
            onMouseEnter={() => onDateHover(isoDate)}
          >{date}</button>;
        })}
      </div>
    </div>
  );
}

type PopupPosition = { top: number; left: number };
type AppliedSelection = {
  mode: Mode;
  staticPreset: string;
  customRange: TimeRange;
  dynamicPreset: string;
  relativeNumbers: Record<string, number>;
};

function TimeModeSwitch({ value, onChange }: { value: Mode; onChange: (mode: Mode) => void }) {
  return <div className="tg-mode-switch" role="group" aria-label="时间模式示意切换">
    {([ ["static", "静态时间"], ["dynamic", "动态时间"] ] as const).map(([mode, label]) => <button
      className={`tg-mode-option${value === mode ? " tg-mode-option--selected" : ""}`}
      type="button"
      aria-pressed={value === mode}
      key={mode}
      onClick={() => onChange(mode)}
    >{label}</button>)}
  </div>;
}

function PickerExample({
  initialMode,
  open,
  onOpenChange,
}: {
  initialMode: Mode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [appliedSelection, setAppliedSelection] = useState<AppliedSelection>({
    mode: initialMode,
    staticPreset: "custom",
    customRange: STATIC_RANGES.custom,
    dynamicPreset: "this-week",
    relativeNumbers: INITIAL_RELATIVE_NUMBERS,
  });
  const [hasAppliedSelection, setHasAppliedSelection] = useState(false);
  const [mode, setMode] = useState<Mode>(initialMode);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<PopupPosition | null>(null);
  const [selectedStatic, setSelectedStatic] = useState("custom");
  const [customRange, setCustomRange] = useState<TimeRange>(STATIC_RANGES.custom);
  const [rangeAnchor, setRangeAnchor] = useState<string | null>(null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [selectedDynamic, setSelectedDynamic] = useState("this-week");
  const [relativeNumbers, setRelativeNumbers] = useState<Record<string, number>>(INITIAL_RELATIVE_NUMBERS);
  const [activeTime, setActiveTime] = useState<"start" | "end" | null>(null);
  const isStatic = mode === "static";
  const staticRange = selectedStatic === "custom" ? customRange : STATIC_RANGES[selectedStatic];
  const previewRange = rangeAnchor && hoveredDate
    ? { start: rangeAnchor < hoveredDate ? rangeAnchor : hoveredDate, end: rangeAnchor < hoveredDate ? hoveredDate : rangeAnchor }
    : staticRange;
  const dynamicRange = DYNAMIC_RANGES[selectedDynamic];
  const dynamicStartNumber = relativeNumbers[`${selectedDynamic}-start`] ?? dynamicRange.startNumber;
  const dynamicEndNumber = relativeNumbers[`${selectedDynamic}-end`] ?? dynamicRange.endNumber;
  const dynamicTag = dynamicTagFor(selectedDynamic, relativeNumbers);
  const appliedStaticRange = appliedSelection.staticPreset === "custom"
    ? appliedSelection.customRange
    : STATIC_RANGES[appliedSelection.staticPreset];
  const appliedDynamicRange = DYNAMIC_RANGES[appliedSelection.dynamicPreset];
  const appliedDynamicTag = dynamicTagFor(appliedSelection.dynamicPreset, appliedSelection.relativeNumbers);
  const appliedIsStatic = appliedSelection.mode === "static";

  useEffect(() => {
    if (!open) return;
    setMode(appliedSelection.mode);
    setSelectedStatic(appliedSelection.staticPreset);
    setCustomRange(appliedSelection.customRange);
    setSelectedDynamic(appliedSelection.dynamicPreset);
    setRelativeNumbers(appliedSelection.relativeNumbers);
    setActiveTime(null);
    setRangeAnchor(null);
    setHoveredDate(null);
  }, [open, appliedSelection]);

  const applyAndClose = () => {
    setAppliedSelection({
      mode,
      staticPreset: selectedStatic,
      customRange,
      dynamicPreset: selectedDynamic,
      relativeNumbers,
    });
    setHasAppliedSelection(true);
    onOpenChange(false);
  };
  const changeMode = (value: Mode) => {
    setMode(value);
    setRangeAnchor(null);
    setHoveredDate(null);
  };

  const selectCalendarDate = (date: string) => {
    setSelectedStatic("custom");
    if (!rangeAnchor) {
      setCustomRange((current) => ({ ...current, start: date, end: date }));
      setRangeAnchor(date);
      return;
    }
    setCustomRange((current) => ({
      ...current,
      start: rangeAnchor < date ? rangeAnchor : date,
      end: rangeAnchor < date ? date : rangeAnchor,
    }));
    setRangeAnchor(null);
    setHoveredDate(null);
  };

  const renderDynamicEndpoint = (side: "start" | "end") => {
    const label = side === "start" ? dynamicRange.startLabel : dynamicRange.endLabel;
    const number = side === "start" ? dynamicStartNumber : dynamicEndNumber;
    const supportsNumber = number !== undefined;
    const numberKey = `${selectedDynamic}-${side}`;
    const suffix = dynamicRange.suffix ?? "天";
    const style = {
      width: 96,
      minWidth: 96,
      maxWidth: 96,
      "--sens-inputnumber-handle-width": "15px",
    } as CSSProperties;
    if (!supportsNumber) return label;
    return <span className="tg-relative-expression">
      {label}<SensInputNumber
        className="tg-relative-number"
        size="small"
        min={1}
        value={number}
        onChange={(value) => {
          if (value == null) return;
          const parsed = typeof value === "number" ? value : Number(value);
          if (Number.isFinite(parsed)) setRelativeNumbers((current) => ({ ...current, [numberKey]: parsed }));
        }}
        style={style}
      />{suffix}
    </span>;
  };

  useLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }
    const updatePosition = () => {
      const trigger = triggerRef.current?.getBoundingClientRect();
      const popup = popupRef.current?.getBoundingClientRect();
      if (!trigger || !popup) return;

      const margin = getUnitToken("spacing/2x");
      const gap = getUnitToken("spacing/1x");
      const left = Math.max(margin, Math.min(trigger.left, window.innerWidth - popup.width - margin));
      const below = trigger.bottom + gap;
      const above = trigger.top - popup.height - gap;
      const top = below + popup.height <= window.innerHeight - margin
        ? below
        : above >= margin
          ? above
          : Math.max(margin, Math.min(below, window.innerHeight - popup.height - margin));
      setPosition({ top, left });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(updatePosition);
    if (triggerRef.current) observer?.observe(triggerRef.current);
    if (popupRef.current) observer?.observe(popupRef.current);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      observer?.disconnect();
    };
  }, [open, mode]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!triggerRef.current?.contains(target) && !popupRef.current?.contains(target)) onOpenChange(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onOpenChange]);

  const popup = open && typeof document !== "undefined" ? createPortal(
    <div
      className="tg-picker tg-picker--floating"
      ref={popupRef}
      aria-label={`${isStatic ? "静态" : "动态"}时间选择器结构示意`}
      style={{ ...guideVars(), top: position?.top ?? 0, left: position?.left ?? 0, visibility: position ? "visible" : "hidden" }}
    >
      <div className="tg-picker-head">
        <TimeModeSwitch value={mode} onChange={changeMode} />
        <SensIcon name="more" sizeToken="size/icon/m" colorRole="subtle" />
      </div>
      <div className="tg-picker-body">
        <div className="tg-presets" aria-label="快捷时间示意">
          {(isStatic ? STATIC_PRESETS : DYNAMIC_PRESETS).map((row, index) => <div className="tg-preset-row" key={index}>
            {row.map((item) => {
              const selected = item.key === (isStatic ? selectedStatic : selectedDynamic);
              return <button
                className={`tg-preset${selected ? " tg-preset--selected" : ""}`}
                type="button"
                aria-pressed={selected}
                key={item.key}
                onClick={() => {
                  setRangeAnchor(null);
                  setHoveredDate(null);
                  if (isStatic) setSelectedStatic(item.key);
                  else setSelectedDynamic(item.key);
                }}
              >{item.label}</button>;
            })}
          </div>)}
        </div>
        {isStatic ? <div className="tg-calendar-pair" onMouseLeave={() => setHoveredDate(null)}>
          <MonthPreview month={8} range={previewRange} previewAnchor={rangeAnchor} previewDate={rangeAnchor && hoveredDate !== rangeAnchor ? hoveredDate : null} onDateClick={selectCalendarDate} onDateHover={setHoveredDate} />
          <MonthPreview month={9} range={previewRange} previewAnchor={rangeAnchor} previewDate={rangeAnchor && hoveredDate !== rangeAnchor ? hoveredDate : null} onDateClick={selectCalendarDate} onDateHover={setHoveredDate} />
        </div> : <div className="tg-relative-fields">
          <div><span>起始</span><div className={`tg-relative-field${dynamicStartNumber !== undefined ? " tg-relative-field--editable" : ""}`}>{renderDynamicEndpoint("start")}</div></div>
          <div><span>截止</span><div className={`tg-relative-field${dynamicEndNumber !== undefined ? " tg-relative-field--editable" : ""}`}>{renderDynamicEndpoint("end")}</div></div>
        </div>}
      </div>
      <div className="tg-picker-bottom">
        <div className="tg-selection">
          {!isStatic && <span className="tg-selection-tag">{dynamicTag}</span>}
          {isStatic ? <>
            <span>{staticRange.start}</span>
            {staticRange.startTime && <TimePrecisionControl value={staticRange.startTime} label="开始时间" active={activeTime === "start"} onClick={() => setActiveTime(activeTime === "start" ? null : "start")} />}
            <SensIcon name="arrow-right" sizeToken="size/icon/m" colorRole="subtle" />
            <span>{staticRange.end}</span>
            {staticRange.endTime && <TimePrecisionControl value={staticRange.endTime} label="结束时间" active={activeTime === "end"} onClick={() => setActiveTime(activeTime === "end" ? null : "end")} />}
          </> : <>
            <span>{dynamicRange.start}</span><SensIcon name="arrow-right" sizeToken="size/icon/m" colorRole="subtle" /><span>{dynamicRange.end}</span>
          </>}
        </div>
        <div className="tg-actions">
          <SensButton size="small" tone="secondary" onClick={() => onOpenChange(false)}>放弃</SensButton>
          <SensButton size="small" tone="primary" onClick={applyAndClose}>完成</SensButton>
        </div>
      </div>
    </div>,
    document.body,
  ) : null;

  return (
    <div className="tg-picker-demo">
      <button ref={triggerRef} className={`tg-trigger tg-trigger--interactive${open ? " tg-trigger--open" : ""}`} type="button" aria-expanded={open} onClick={() => onOpenChange(!open)}>
        <SensIcon name="calendar" sizeToken="size/icon/m" colorRole="subtle" />
        {!hasAppliedSelection ? <span className="tg-trigger-placeholder">请选择</span> : appliedIsStatic ? <>
          <span>{appliedStaticRange.start}</span><TimeSelector value={appliedStaticRange.startTime ?? "00:00:00"} /><SensIcon name="arrow-right" sizeToken="size/icon/m" colorRole="subtle" /><span>{appliedStaticRange.end}</span><TimeSelector value={appliedStaticRange.endTime ?? "23:59:59"} />
        </> : <>
          <span className="tg-relative-tag">{appliedDynamicTag}</span><span>{appliedDynamicRange.start}</span><SensIcon name="arrow-right" sizeToken="size/icon/m" colorRole="subtle" /><span>{appliedDynamicRange.end}</span>
        </>}
      </button>
      {popup}
    </div>
  );
}

export default function TimeSelectionGuidePage() {
  const [openPicker, setOpenPicker] = useState<Mode | null>(null);
  const setPickerOpen = (mode: Mode) => (open: boolean) => setOpenPicker(open ? mode : null);
  return <main className="tg-page" style={guideVars()}>
    <header className="tg-header">
      <span>Composite / Usage guide</span>
      <h1>时间筛选</h1>
      <p>先判断时间是否随当前日期变化，再选择静态时间或动态时间；以下用设计稿样例展示两者的结构差异。</p>
    <div className="tg-status">选择器结构示意 · 日历支持鼠标选择日期区间</div>
    </header>
    <section className="tg-section" aria-labelledby="tg-examples-title">
      <div className="tg-section-heading"><h2 id="tg-examples-title">静态时间与动态时间</h2><p>日期取自设计稿，仅用于说明展示形式，不代表当前实时日期。</p></div>
      <div className="tg-examples">
        <article className="tg-example">
          <div className="tg-example-heading"><span>01</span><h3>静态时间 · 固定范围</h3></div>
          <p>入口直接展示确定的起止日期与时刻；展开后通过左侧快捷项和双月历选择固定范围。</p>
          <div className="tg-demo-scroll"><PickerExample initialMode="static" open={openPicker === "static"} onOpenChange={setPickerOpen("static")} /></div>
        </article>
        <article className="tg-example">
          <div className="tg-example-heading"><span>02</span><h3>动态时间 · 相对范围</h3></div>
          <p>入口同时展示相对周期标签和当前对应日期；展开后配置相对的起始与截止时间。</p>
          <div className="tg-demo-scroll"><PickerExample initialMode="dynamic" open={openPicker === "dynamic"} onOpenChange={setPickerOpen("dynamic")} /></div>
        </article>
      </div>
    </section>
    <section className="tg-section" aria-labelledby="tg-display-states-title">
      <div className="tg-section-heading"><h2 id="tg-display-states-title">日期与时间展示状态</h2><p>按业务粒度选择日期、区间、动态周期或时刻；灰色摘要条统一为 28px 高。</p></div>
      <div className="tg-display-states">
        <article><h3>未选择 · 时分秒</h3><div className="tg-display-sample"><span className="tg-display-placeholder">日期未选择</span><TimePrecisionPreview value="00:00:00" label="时间" /></div></article>
        <article><h3>单日期 · 时分秒</h3><div className="tg-display-sample"><span>2023-09-20</span><TimePrecisionPreview value="00:00:00" label="时间" /></div></article>
        <article><h3>固定日期区间</h3><div className="tg-display-sample"><span>2023-08-11</span><SensIcon name="arrow-right" sizeToken="size/icon/m" colorRole="subtle" /><span>2023-09-20</span></div></article>
        <article><h3>固定日期时间区间</h3><div className="tg-display-sample"><span>2023-08-11</span><TimePrecisionPreview value="00:00:00" label="开始时间" /><SensIcon name="arrow-right" sizeToken="size/icon/m" colorRole="subtle" /><span>2023-09-20</span><TimePrecisionPreview value="12:59:59" label="结束时间" /></div></article>
        <article><h3>动态单日</h3><div className="tg-display-sample"><span className="tg-relative-tag">今天</span><span>2023-09-20</span></div></article>
        <article><h3>动态日期区间</h3><div className="tg-display-sample"><span className="tg-relative-tag">过去 7 天</span><span>2023-09-13</span><SensIcon name="arrow-right" sizeToken="size/icon/m" colorRole="subtle" /><span>2023-09-19</span></div></article>
      </div>
    </section>
    <DisabledTriggerExamples />
    <section className="tg-rules" aria-label="使用建议">
      <article>
        <h2>单日</h2>
        <p>仅选择一个自然日时，不重复展示相同的起止日期；动态单日仍同时展示相对标签与具体日期。</p>
        <div className="tg-trigger tg-single-day-trigger" aria-label="动态单日示例：今天，2023-09-20">
          <SensIcon name="calendar" sizeToken="size/icon/m" colorRole="subtle" />
          <span className="tg-relative-tag">今天</span>
          <span>2023-09-20</span>
        </div>
      </article>
      <article><h2>时间精度</h2><p>默认按天筛选。只有业务判断依赖日内时刻时，才进一步选择小时、分钟或秒；控件沿用正文文字样式。</p><div className="tg-time-examples" aria-label="时间精度示意"><TimeSelector value="00:00" /><TimeSelector value="00:00:00" /></div></article>
      <article><h2>业务扩展</h2><p>交易日、对比时间等内容按具体业务需要补充，不默认加入所有时间筛选。</p></article>
    </section>
    <footer className="tg-footer">完整交互规则参考 <a href="https://www.figma.com/design/0sW8EB0cmrAMMeeVRry706/%E6%97%B6%E9%97%B4%E7%BB%84%E4%BB%B6?node-id=2108-66567&m=dev" target="_blank" rel="noreferrer">时间组件 Figma 文档</a></footer>
  </main>;
}
