import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import {
  buildActiveRingShadow,
  buildShadowD4,
  getColorToken,
  tokenRgba,
} from "../design-system/color-utils";
import { getDividerColor, getDividerHairlineWidth } from "../design-system/divider";
import { SensIcon } from "../design-system/icons";
import { getTypographyToken } from "../design-system/typography";
import { getUnitToken } from "../design-system/unit";
import { SensButton } from "./SensButton";
import { SensInputNumber } from "./SensInputNumber";
import "./time-selection.css";

export type SensTimeSelectionMode = "static" | "dynamic";
export type SensTimeSelectionGranularity = "single" | "range";

export type SensTimeSelectionRange = {
  start: string;
  end: string;
  startTime?: string;
  endTime?: string;
};

export type SensTimeSelectionPreset = {
  key: string;
  label: string;
  range: SensTimeSelectionRange;
  tag?: string;
  startLabel?: string;
  endLabel?: string;
  startNumber?: number;
  endNumber?: number;
  suffix?: string;
  formatTag?: (numbers: Record<string, number>) => string;
};

export type SensTimeSelectionPresetRow = SensTimeSelectionPreset[];

export type SensTimeSelectionValue = {
  mode: SensTimeSelectionMode;
  presetKey: string;
  range: SensTimeSelectionRange;
  tag?: string;
  numbers?: Record<string, number>;
};

export type SensTimeSelectionCalendarMonth = {
  year: number;
  month: number;
};

export type SensTimeSelectionProps = {
  value?: SensTimeSelectionValue | null;
  defaultValue?: SensTimeSelectionValue | null;
  defaultMode?: SensTimeSelectionMode;
  granularity?: SensTimeSelectionGranularity;
  disabled?: boolean;
  placeholder?: string;
  staticPresets?: SensTimeSelectionPresetRow[];
  dynamicPresets?: SensTimeSelectionPresetRow[];
  calendarMonths?: [SensTimeSelectionCalendarMonth, SensTimeSelectionCalendarMonth];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onChange?: (value: SensTimeSelectionValue) => void;
  className?: string;
  style?: CSSProperties;
};

const DEFAULT_STATIC_PRESETS: SensTimeSelectionPresetRow[] = [
  [{ key: "custom", label: "自定义时间", range: { start: "2023-09-20", end: "2023-09-20", startTime: "00:00:00", endTime: "12:59:59" } }],
  [{ key: "today", label: "今天", range: { start: "2023-09-20", end: "2023-09-20" } }, { key: "yesterday", label: "昨天", range: { start: "2023-09-19", end: "2023-09-19" } }],
  [{ key: "this-week", label: "本周", range: { start: "2023-09-18", end: "2023-09-20" } }, { key: "last-week", label: "上周", range: { start: "2023-09-11", end: "2023-09-17" } }],
  [{ key: "this-month", label: "本月", range: { start: "2023-09-01", end: "2023-09-20" } }, { key: "last-month", label: "上月", range: { start: "2023-08-01", end: "2023-08-31" } }],
  [{ key: "this-year", label: "今年", range: { start: "2023-01-01", end: "2023-09-20" } }, { key: "last-year", label: "去年", range: { start: "2022-01-01", end: "2022-12-31" } }],
  [{ key: "past-7", label: "过去 7 天", range: { start: "2023-09-14", end: "2023-09-20" } }, { key: "past-14", label: "过去 14 天", range: { start: "2023-09-07", end: "2023-09-20" } }],
  [{ key: "past-30", label: "过去 30 天", range: { start: "2023-08-22", end: "2023-09-20" } }, { key: "past-60", label: "过去 60 天", range: { start: "2023-07-23", end: "2023-09-20" } }],
  [{ key: "past-90", label: "过去 90 天", range: { start: "2023-06-23", end: "2023-09-20" } }, { key: "past-180", label: "过去 180 天", range: { start: "2023-03-25", end: "2023-09-20" } }],
  [{ key: "online", label: "上线至今", range: { start: "2015-04-25", end: "2023-09-20" } }],
];

const DEFAULT_DYNAMIC_PRESETS: SensTimeSelectionPresetRow[] = [
  [{ key: "today", label: "今天", tag: "今天", range: { start: "2023-09-20", end: "2023-09-20" }, startLabel: "今天", endLabel: "今天" }, { key: "yesterday", label: "昨天", tag: "昨天", range: { start: "2023-09-19", end: "2023-09-19" }, startLabel: "昨天", endLabel: "昨天" }],
  [{ key: "this-week", label: "本周", tag: "本周", range: { start: "2023-09-18", end: "2023-09-20" }, startLabel: "本周一", endLabel: "今天" }, { key: "last-week", label: "上周", tag: "上周", range: { start: "2023-09-11", end: "2023-09-17" }, startLabel: "上周第 1 天", endLabel: "上周最后 1 天" }],
  [{ key: "this-month", label: "本月", tag: "本月", range: { start: "2023-09-01", end: "2023-09-20" }, startLabel: "本月第 1 天", endLabel: "今天" }, { key: "last-month", label: "上月", tag: "上月", range: { start: "2023-08-01", end: "2023-08-31" }, startLabel: "上月第 1 天", endLabel: "上月最后 1 天" }],
  [{ key: "this-year", label: "今年", tag: "今年", range: { start: "2023-01-01", end: "2023-09-20" }, startLabel: "今年第 1 天", endLabel: "今天" }, { key: "last-year", label: "去年", tag: "去年", range: { start: "2022-01-01", end: "2022-12-31" }, startLabel: "去年第 1 天", endLabel: "去年最后 1 天" }],
  [{ key: "past-7", label: "过去 7 天", tag: "过去 7 天", range: { start: "2023-09-13", end: "2023-09-19" }, startLabel: "过去第 7 天", endLabel: "昨天" }, { key: "past-14", label: "过去 14 天", tag: "过去 14 天", range: { start: "2023-09-06", end: "2023-09-19" }, startLabel: "过去第 14 天", endLabel: "昨天" }],
  [{ key: "past-30", label: "过去 30 天", tag: "过去 30 天", range: { start: "2023-08-21", end: "2023-09-19" }, startLabel: "过去第 30 天", endLabel: "昨天" }, { key: "past-60", label: "过去 60 天", tag: "过去 60 天", range: { start: "2023-07-22", end: "2023-09-19" }, startLabel: "过去第 60 天", endLabel: "昨天" }],
  [{ key: "past-90", label: "过去 90 天", tag: "过去 90 天", range: { start: "2023-06-22", end: "2023-09-19" }, startLabel: "过去第 90 天", endLabel: "昨天" }, { key: "past-180", label: "过去 180 天", tag: "过去 180 天", range: { start: "2023-03-24", end: "2023-09-19" }, startLabel: "过去第 180 天", endLabel: "昨天" }],
  [{ key: "online", label: "上线至今", tag: "上线至今", range: { start: "2015-04-25", end: "2023-09-20" }, startLabel: "上线日期", endLabel: "今天" }],
  [{ key: "specified-to-now", label: "指定日期至今", tag: "指定日期至今", range: { start: "2023-09-13", end: "2023-09-20" }, startLabel: "指定日期 · 2023-09-13", endLabel: "今天" }],
  [{ key: "past-n-to-now", label: "过去 N 天至今", range: { start: "2023-09-13", end: "2023-09-20" }, startLabel: "过去", endLabel: "今天", startNumber: 7, formatTag: (numbers) => `过去 ${numbers["past-n-to-now-start"] ?? 7} 天至今` }],
  [{ key: "specified-to-past-n", label: "指定日期至过去第 N 天", range: { start: "2023-09-13", end: "2023-09-19" }, startLabel: "指定日期 · 2023-09-13", endLabel: "过去第", endNumber: 1, formatTag: (numbers) => `指定日期至过去第 ${numbers["specified-to-past-n-end"] ?? 1} 天` }],
  [{ key: "past-n-to-m", label: "过去第 N 天至过去第 M 天", range: { start: "2023-09-13", end: "2023-09-19" }, startLabel: "过去第", endLabel: "过去第", startNumber: 7, endNumber: 1, formatTag: (numbers) => `过去第 ${numbers["past-n-to-m-start"] ?? 7} 天至过去第 ${numbers["past-n-to-m-end"] ?? 1} 天` }],
  [{ key: "past-business-days", label: "过去 N 个交易日", range: { start: "2026-04-14", end: "2026-04-17" }, startLabel: "过去", endLabel: "当前交易日", startNumber: 2, suffix: "个交易日", formatTag: (numbers) => `过去 ${numbers["past-business-days-start"] ?? 2} 个交易日至当前交易日` }],
];

const WEEKDAYS = ["一", "二", "三", "四", "五", "六", "日"];
const DEFAULT_MONTHS: [SensTimeSelectionCalendarMonth, SensTimeSelectionCalendarMonth] = [
  { year: 2023, month: 8 },
  { year: 2023, month: 9 },
];
const px = (value: number) => `${value}px`;

function flattenPresets(rows: SensTimeSelectionPresetRow[]) {
  return rows.flat();
}

function firstPreset(rows: SensTimeSelectionPresetRow[], fallbackKey: string) {
  return flattenPresets(rows)[0] ?? {
    key: fallbackKey,
    label: fallbackKey,
    range: { start: "2023-09-20", end: "2023-09-20" },
  };
}

function presetMap(rows: SensTimeSelectionPresetRow[]) {
  return new Map(flattenPresets(rows).map((preset) => [preset.key, preset]));
}

function tagFor(preset: SensTimeSelectionPreset, numbers: Record<string, number>) {
  return preset.formatTag?.(numbers) ?? preset.tag ?? preset.label;
}

function selectionVars(): CSSProperties {
  return {
    "--sens-time-bg": getColorToken("background-transparent-grey"),
    "--sens-time-white": getColorToken("white"),
    "--sens-time-text": tokenRgba("text-color-transparent", 0.9),
    "--sens-time-sub": tokenRgba("text-sub-color-transparent", 0.58),
    "--sens-time-disabled": tokenRgba("text-color-transparent-disable", 0.3),
    "--sens-time-disabled-hover-text": getColorToken("text-color-transparent-disable-hover"),
    "--sens-time-disabled-bg": getColorToken("background-transparent-grey-hover"),
    "--sens-time-disabled-hover-bg": getColorToken("background-transparent-grey"),
    "--sens-time-primary": getColorToken("component-primary"),
    "--sens-time-hover": getColorToken("component-hover"),
    "--sens-time-active": getColorToken("component-active"),
    "--sens-time-active-bg": getColorToken("component-active-background"),
    "--sens-time-active-hover-bg": getColorToken("component-active-hover-background"),
    "--sens-time-active-click-bg": getColorToken("component-active-click-background"),
    "--sens-time-tag-bg": getColorToken("background-01-transparent"),
    "--sens-time-input-bg": getColorToken("background-transparent-grey-hover"),
    "--sens-time-line": getDividerColor("light", "transparent"),
    "--sens-time-weak-line": getDividerColor("weak", "transparent"),
    "--sens-time-deep-line": getDividerColor("deep", "transparent"),
    "--sens-time-line-width": px(getDividerHairlineWidth()),
    "--sens-time-radius": px(getUnitToken("radius/l")),
    "--sens-time-control-radius": px(getUnitToken("radius/m")),
    "--sens-time-small-radius": px(getUnitToken("radius/s")),
    "--sens-time-viewport-gutter": px(getUnitToken("spacing/4x")),
    "--sens-time-small-size": px(getTypographyToken("font-size/s")),
    "--sens-time-small-line": px(getTypographyToken("line-height/s")),
    "--sens-time-body-size": px(getTypographyToken("font-size/m")),
    "--sens-time-body-line": px(getTypographyToken("line-height/m")),
    "--sens-time-medium-weight": getTypographyToken("font-weight/medium"),
    "--sens-time-regular-weight": getTypographyToken("font-weight/regular"),
    "--sens-time-control-height": px(getUnitToken("size/component-height/m")),
    "--sens-time-small-height": px(getUnitToken("size/component-height/s")),
    "--sens-time-shadow": buildShadowD4(),
    "--sens-time-active-ring": buildActiveRingShadow("component-active-shadow"),
  } as CSSProperties;
}

function TimeText({ value }: { value: string }) {
  return <span className="sens-time-selection__time-text">{value}</span>;
}

function TimeControl({ value, label, active, onClick }: { value: string; label: string; active: boolean; onClick: () => void }) {
  return <button className={`sens-time-selection__time-control${active ? " is-active" : ""}`} type="button" aria-label={`${label} ${value}`} aria-pressed={active} onClick={onClick}>
    {value}<SensIcon name={active ? "chevron-up" : "chevron-down"} size={14} />
  </button>;
}

function ModeSwitch({ value, onChange }: { value: SensTimeSelectionMode; onChange: (mode: SensTimeSelectionMode) => void }) {
  return <div className="sens-time-selection__mode-switch" role="group" aria-label="时间模式切换">
    {([ ["static", "静态时间"], ["dynamic", "动态时间"] ] as const).map(([mode, label]) => <button className={`sens-time-selection__mode-option${value === mode ? " is-selected" : ""}`} type="button" aria-pressed={value === mode} key={mode} onClick={() => onChange(mode)}>{label}</button>)}
  </div>;
}

function MonthPanel({ calendar, range, previewAnchor, previewDate, onDateClick, onDateHover, side }: {
  calendar: SensTimeSelectionCalendarMonth;
  range: SensTimeSelectionRange;
  previewAnchor: string | null;
  previewDate: string | null;
  onDateClick: (date: string) => void;
  onDateHover: (date: string) => void;
  side: "left" | "right";
}) {
  const days = new Date(Date.UTC(calendar.year, calendar.month, 0)).getUTCDate();
  const jsDay = new Date(Date.UTC(calendar.year, calendar.month - 1, 1)).getUTCDay();
  const firstDay = jsDay === 0 ? 6 : jsDay - 1;
  return <div className="sens-time-selection__month" aria-label={`${calendar.year} 年 ${calendar.month} 月日历示意`}>
    <div className="sens-time-selection__month-head">
      <span className="sens-time-selection__month-nav" aria-hidden="true">{side === "left" && <><SensIcon name="arrow-doubule-left" sizeToken="size/icon/s" /><SensIcon name="left" sizeToken="size/icon/s" /></>}</span>
      <span className="sens-time-selection__month-title">
        <span className="sens-time-selection__month-selector">{calendar.year}<SensIcon name="chevron-down" size={14} colorRole="subtle" /></span>
        <span className="sens-time-selection__month-selector">{String(calendar.month).padStart(2, "0")}<SensIcon name="chevron-down" size={14} colorRole="subtle" /></span>
      </span>
      <span className="sens-time-selection__month-nav sens-time-selection__month-nav--end" aria-hidden="true">{side === "right" && <SensIcon name="arrow-doubule-right" sizeToken="size/icon/s" />}</span>
    </div>
    <div className="sens-time-selection__calendar-grid" aria-label={`${calendar.month} 月日期`}>
      {WEEKDAYS.map((day) => <span className="sens-time-selection__weekday" key={day}>{day}</span>)}
      {Array.from({ length: 35 }, (_, index) => {
        const date = index - firstDay + 1;
        const visible = date > 0 && date <= days;
        if (!visible) return <span className="sens-time-selection__day sens-time-selection__day--placeholder" key={index} aria-hidden="true" />;
        const isoDate = `${calendar.year}-${String(calendar.month).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
        const selected = isoDate >= range.start && isoDate <= range.end;
        const isPreviewing = Boolean(previewAnchor && previewDate && previewAnchor !== previewDate);
        const isAnchor = selected && isPreviewing && isoDate === previewAnchor;
        const isStart = selected && !isPreviewing && isoDate === range.start;
        const isEnd = selected && !isPreviewing && isoDate === range.end;
        const isPreviewEdge = isPreviewing && isoDate === previewDate;
        const previewSide = isPreviewEdge && previewAnchor && previewDate ? (previewDate < previewAnchor ? "left" : "right") : null;
        return <button
          className={`sens-time-selection__day${selected && !isAnchor && !isPreviewEdge ? " is-in-range" : ""}${isStart ? " is-range-start" : ""}${isEnd ? " is-range-end" : ""}${isStart && isEnd ? " is-selected" : ""}${isAnchor ? " is-selected" : ""}${isPreviewEdge ? ` is-preview-edge is-preview-edge-${previewSide}` : ""}`}
          type="button"
          aria-label={`${calendar.year} 年 ${calendar.month} 月 ${date} 日${selected ? "，已在选择范围内" : ""}`}
          aria-pressed={selected}
          key={index}
          onClick={() => onDateClick(isoDate)}
          onMouseEnter={() => onDateHover(isoDate)}
        >{date}</button>;
      })}
    </div>
  </div>;
}

export function SensTimeSelection({
  value,
  defaultValue = null,
  defaultMode = "static",
  granularity = "range",
  disabled = false,
  placeholder = "请选择",
  staticPresets = DEFAULT_STATIC_PRESETS,
  dynamicPresets = DEFAULT_DYNAMIC_PRESETS,
  calendarMonths = DEFAULT_MONTHS,
  open,
  defaultOpen = false,
  onOpenChange,
  onChange,
  className,
  style,
}: SensTimeSelectionProps) {
  const staticMap = useMemo(() => presetMap(staticPresets), [staticPresets]);
  const dynamicMap = useMemo(() => presetMap(dynamicPresets), [dynamicPresets]);
  const firstStatic = firstPreset(staticPresets, "custom");
  const firstDynamic = firstPreset(dynamicPresets, "today");
  const [internalValue, setInternalValue] = useState<SensTimeSelectionValue | null>(defaultValue);
  const appliedValue = value === undefined ? internalValue : value;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = open === undefined ? internalOpen : open;
  const [mode, setMode] = useState<SensTimeSelectionMode>(appliedValue?.mode ?? defaultMode);
  const [staticPresetKey, setStaticPresetKey] = useState(appliedValue?.mode === "static" ? appliedValue.presetKey : firstStatic.key);
  const [dynamicPresetKey, setDynamicPresetKey] = useState(appliedValue?.mode === "dynamic" ? appliedValue.presetKey : firstDynamic.key);
  const [customRange, setCustomRange] = useState<SensTimeSelectionRange>(appliedValue?.mode === "static" ? appliedValue.range : firstStatic.range);
  const [numbers, setNumbers] = useState<Record<string, number>>(appliedValue?.numbers ?? {});
  const [rangeAnchor, setRangeAnchor] = useState<string | null>(null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [activeTime, setActiveTime] = useState<"start" | "end" | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  const setOpen = (next: boolean) => {
    if (disabled) return;
    if (open === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (!isOpen) return;
    setMode(appliedValue?.mode ?? defaultMode);
    setStaticPresetKey(appliedValue?.mode === "static" ? appliedValue.presetKey : firstStatic.key);
    setDynamicPresetKey(appliedValue?.mode === "dynamic" ? appliedValue.presetKey : firstDynamic.key);
    setCustomRange(appliedValue?.mode === "static" ? appliedValue.range : firstStatic.range);
    setNumbers(appliedValue?.numbers ?? {});
    setRangeAnchor(null);
    setHoveredDate(null);
    setActiveTime(null);
  }, [isOpen, appliedValue, defaultMode, firstStatic.key, firstDynamic.key]);

  const selectedStaticPreset = staticMap.get(staticPresetKey) ?? firstStatic;
  const staticRange = staticPresetKey === "custom" ? customRange : selectedStaticPreset.range;
  const selectedDynamicPreset = dynamicMap.get(dynamicPresetKey) ?? firstDynamic;
  const dynamicTag = tagFor(selectedDynamicPreset, numbers);
  const previewRange = rangeAnchor && hoveredDate
    ? { ...customRange, start: rangeAnchor < hoveredDate ? rangeAnchor : hoveredDate, end: rangeAnchor < hoveredDate ? hoveredDate : rangeAnchor }
    : staticRange;

  const selectCalendarDate = (date: string) => {
    setStaticPresetKey("custom");
    if (granularity === "single") {
      setCustomRange((current) => ({ ...current, start: date, end: date }));
      setRangeAnchor(null);
      setHoveredDate(null);
      return;
    }
    if (!rangeAnchor) {
      setCustomRange((current) => ({ ...current, start: date, end: date }));
      setRangeAnchor(date);
      return;
    }
    setCustomRange((current) => ({ ...current, start: rangeAnchor < date ? rangeAnchor : date, end: rangeAnchor < date ? date : rangeAnchor }));
    setRangeAnchor(null);
    setHoveredDate(null);
  };

  const applyAndClose = () => {
    const next = mode === "static"
      ? { mode, presetKey: staticPresetKey, range: staticRange }
      : { mode, presetKey: dynamicPresetKey, range: selectedDynamicPreset.range, tag: dynamicTag, numbers };
    if (value === undefined) setInternalValue(next);
    onChange?.(next);
    setOpen(false);
  };

  const renderDynamicEndpoint = (side: "start" | "end") => {
    const number = side === "start" ? selectedDynamicPreset.startNumber : selectedDynamicPreset.endNumber;
    const label = side === "start" ? selectedDynamicPreset.startLabel : selectedDynamicPreset.endLabel;
    if (number === undefined) return label ?? (side === "start" ? selectedDynamicPreset.range.start : selectedDynamicPreset.range.end);
    const numberKey = `${selectedDynamicPreset.key}-${side}`;
    return <span className="sens-time-selection__relative-expression">
      {label}<SensInputNumber
        className="sens-time-selection__relative-number"
        size="small"
        min={1}
        value={numbers[numberKey] ?? number}
        onChange={(nextValue) => {
          if (nextValue == null) return;
          const parsed = typeof nextValue === "number" ? nextValue : Number(nextValue);
          if (Number.isFinite(parsed)) setNumbers((current) => ({ ...current, [numberKey]: parsed }));
        }}
        style={{ width: 96, minWidth: 96, maxWidth: 96, "--sens-inputnumber-handle-width": "15px" } as CSSProperties}
      />{selectedDynamicPreset.suffix ?? "天"}
    </span>;
  };

  useLayoutEffect(() => {
    if (!isOpen) {
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
      const top = below + popup.height <= window.innerHeight - margin ? below : above >= margin ? above : Math.max(margin, Math.min(below, window.innerHeight - popup.height - margin));
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
  }, [isOpen, mode]);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!triggerRef.current?.contains(target) && !popupRef.current?.contains(target)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const popup = isOpen && typeof document !== "undefined" ? createPortal(
    <div className="sens-time-selection__picker" ref={popupRef} aria-label={`${mode === "static" ? "静态" : "动态"}时间选择器`} style={{ ...selectionVars(), top: position?.top ?? 0, left: position?.left ?? 0, visibility: position ? "visible" : "hidden" }}>
      <div className="sens-time-selection__head"><ModeSwitch value={mode} onChange={(nextMode) => { setMode(nextMode); setRangeAnchor(null); setHoveredDate(null); }} /><SensIcon name="more" sizeToken="size/icon/m" colorRole="subtle" /></div>
      <div className="sens-time-selection__body">
        <div className="sens-time-selection__presets" aria-label="快捷时间">
          {(mode === "static" ? staticPresets : dynamicPresets).map((row, rowIndex) => <div className="sens-time-selection__preset-row" key={rowIndex}>
            {row.map((preset) => {
              const selected = preset.key === (mode === "static" ? staticPresetKey : dynamicPresetKey);
              return <button className={`sens-time-selection__preset${selected ? " is-selected" : ""}`} type="button" aria-pressed={selected} key={preset.key} onClick={() => {
                setRangeAnchor(null);
                setHoveredDate(null);
                if (mode === "static") {
                  setStaticPresetKey(preset.key);
                  if (preset.key === "custom") setCustomRange(preset.range);
                } else setDynamicPresetKey(preset.key);
              }}>{preset.label}</button>;
            })}
          </div>)}
        </div>
        {mode === "static" ? <div className="sens-time-selection__calendar-pair" onMouseLeave={() => setHoveredDate(null)}>
          <MonthPanel calendar={calendarMonths[0]} range={previewRange} previewAnchor={rangeAnchor} previewDate={rangeAnchor && hoveredDate !== rangeAnchor ? hoveredDate : null} onDateClick={selectCalendarDate} onDateHover={setHoveredDate} side="left" />
          <MonthPanel calendar={calendarMonths[1]} range={previewRange} previewAnchor={rangeAnchor} previewDate={rangeAnchor && hoveredDate !== rangeAnchor ? hoveredDate : null} onDateClick={selectCalendarDate} onDateHover={setHoveredDate} side="right" />
        </div> : <div className="sens-time-selection__relative-fields">
          <div><span>起始</span><div className={`sens-time-selection__relative-field${selectedDynamicPreset.startNumber !== undefined ? " is-editable" : ""}`}>{renderDynamicEndpoint("start")}</div></div>
          <div><span>截止</span><div className={`sens-time-selection__relative-field${selectedDynamicPreset.endNumber !== undefined ? " is-editable" : ""}`}>{renderDynamicEndpoint("end")}</div></div>
        </div>}
      </div>
      <div className="sens-time-selection__bottom">
        <div className="sens-time-selection__summary">
          {mode === "dynamic" && <span className="sens-time-selection__selection-tag">{dynamicTag}</span>}
          {mode === "static" ? <>
            <span>{staticRange.start}</span>{staticRange.startTime && <TimeControl value={staticRange.startTime} label="开始时间" active={activeTime === "start"} onClick={() => setActiveTime(activeTime === "start" ? null : "start")} />}
            {granularity === "range" && <><SensIcon name="arrow-right" sizeToken="size/icon/m" colorRole="subtle" /><span>{staticRange.end}</span>{staticRange.endTime && <TimeControl value={staticRange.endTime} label="结束时间" active={activeTime === "end"} onClick={() => setActiveTime(activeTime === "end" ? null : "end")} />}</>}
          </> : <>
            <span>{selectedDynamicPreset.range.start}</span>{granularity === "range" && <><SensIcon name="arrow-right" sizeToken="size/icon/m" colorRole="subtle" /><span>{selectedDynamicPreset.range.end}</span></>}
          </>}
        </div>
        <div className="sens-time-selection__actions"><SensButton size="small" tone="secondary" onClick={() => setOpen(false)}>放弃</SensButton><SensButton size="small" tone="primary" onClick={applyAndClose}>完成</SensButton></div>
      </div>
    </div>,
    document.body,
  ) : null;

  const rootClassName = ["sens-time-selection", className].filter(Boolean).join(" ");
  const renderApplied = () => {
    if (!appliedValue) return <span className="sens-time-selection__placeholder">{placeholder}</span>;
    const appliedTag = appliedValue.tag ?? (appliedValue.mode === "dynamic" ? tagFor(dynamicMap.get(appliedValue.presetKey) ?? firstDynamic, appliedValue.numbers ?? {}) : undefined);
    if (appliedValue.mode === "dynamic") return <>
      {appliedTag && <span className="sens-time-selection__relative-tag">{appliedTag}</span>}
      <span>{appliedValue.range.start}</span>{granularity === "range" && <><SensIcon name="arrow-right" sizeToken="size/icon/m" colorRole={disabled ? "disabled" : "subtle"} /><span>{appliedValue.range.end}</span></>}
    </>;
    return <>
      <span>{appliedValue.range.start}</span>{appliedValue.range.startTime && <TimeText value={appliedValue.range.startTime} />}
      {granularity === "range" && <><SensIcon name="arrow-right" sizeToken="size/icon/m" colorRole={disabled ? "disabled" : "subtle"} /><span>{appliedValue.range.end}</span>{appliedValue.range.endTime && <TimeText value={appliedValue.range.endTime} />}</>}
    </>;
  };

  return <div className={rootClassName} style={{ ...selectionVars(), ...style }}>
    <button ref={triggerRef} className={`sens-time-selection__trigger${isOpen ? " is-open" : ""}`} type="button" disabled={disabled} aria-expanded={isOpen} onClick={() => setOpen(!isOpen)}>
      <SensIcon name="calendar" sizeToken="size/icon/m" colorRole={disabled ? "disabled" : "subtle"} />
      {renderApplied()}
    </button>
    {popup}
  </div>;
}

export const SENS_TIME_SELECTION_STATIC_PRESETS = DEFAULT_STATIC_PRESETS;
export const SENS_TIME_SELECTION_DYNAMIC_PRESETS = DEFAULT_DYNAMIC_PRESETS;
