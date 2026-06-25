import { Input, type InputProps } from "antd";
import {
  useCallback,
  useMemo,
  useState,
  type CSSProperties,
  type FocusEvent,
  type MouseEvent,
} from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeftIcon } from "./FieldIcons";
import { useSensAllowClear, useSensSearchPrefix } from "./fieldIconProps";
import { SensButton } from "./SensButton";
import { useSearchRootStyle } from "./searchTokens";
import { useMinimalSearchValue } from "./useMinimalSearchValue";

const I18N_NS = "组件库";

export type MinimalSearchLineTone = "default" | "primary" | "active";

export interface MinimalSearchFieldProps
  extends Omit<InputProps, "prefix" | "allowClear" | "variant" | "width" | "size"> {
  width?: number | string;
  /** 右侧「创建」链接；默认 false */
  showCreate?: boolean;
  createLabel?: string;
  onCreate?: () => void;
  createDisabled?: boolean;
  onBack?: () => void;
  showBackWhenFilled?: boolean;
  className?: string;
  style?: CSSProperties;
}

function SearchPrefixIcon() {
  return useSensSearchPrefix();
}

/** Figma 1601:10979 · 搜索区底线：悬停 primary，聚焦/点击 active */
export function resolveMinimalSearchLineTone(params: {
  searchFocused: boolean;
  searchPressed: boolean;
  createPressed: boolean;
  hoverZone: "search" | "create" | null;
  showCreate: boolean;
}): MinimalSearchLineTone {
  const { searchFocused, searchPressed, createPressed, hoverZone, showCreate } = params;
  if (searchFocused || searchPressed) return "active";
  if (hoverZone === "search") return "primary";
  if (showCreate && (hoverZone === "create" || createPressed)) return "primary";
  return "default";
}

/** Figma 1601:10979 / 3876:13525 · 分类区文案/箭头色（底线不变灰） */
export function resolveMinimalSelectorLineTone(params: {
  hovered: boolean;
  pressed: boolean;
  open: boolean;
}): MinimalSearchLineTone {
  if (params.open || params.pressed) return "active";
  if (params.hovered) return "primary";
  return "default";
}

/**
 * 简约搜索：底部分割线 + 有输入时返回键（Figma 8099:27068 / 8116:29015）。
 */
export function MinimalSearchField({
  width,
  showCreate = false,
  createLabel,
  onCreate,
  createDisabled,
  onBack,
  showBackWhenFilled = true,
  className,
  style,
  disabled,
  placeholder,
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  ...rest
}: MinimalSearchFieldProps) {
  const { t } = useTranslation();
  const allowClear = useSensAllowClear();
  const rootStyle = useSearchRootStyle(style);

  const { value: currentValue, hasValue, resetValue, handleChange } = useMinimalSearchValue({
    value,
    defaultValue,
    onChange,
    onBack,
  });

  const [hoverZone, setHoverZone] = useState<"search" | "create" | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchPressed, setSearchPressed] = useState(false);
  const [createPressed, setCreatePressed] = useState(false);

  const showBack = showBackWhenFilled && hasValue;

  const lineTone = useMemo(
    () =>
      resolveMinimalSearchLineTone({
        searchFocused,
        searchPressed,
        createPressed,
        hoverZone,
        showCreate,
      }),
    [createPressed, hoverZone, searchFocused, searchPressed, showCreate],
  );

  const handleSearchMouseEnter = useCallback(() => setHoverZone("search"), []);
  const handleSearchMouseLeave = useCallback(() => {
    setHoverZone((zone) => (zone === "search" ? null : zone));
    setSearchPressed(false);
  }, []);
  const handleCreateMouseEnter = useCallback(() => setHoverZone("create"), []);
  const handleCreateMouseLeave = useCallback(() => {
    setHoverZone((zone) => (zone === "create" ? null : zone));
    setCreatePressed(false);
  }, []);

  const handleSearchMouseDown = useCallback((event: MouseEvent) => {
    if (event.button === 0) setSearchPressed(true);
  }, []);
  const handleSearchMouseUp = useCallback(() => setSearchPressed(false), []);

  const handleCreateMouseDown = useCallback((event: MouseEvent) => {
    if (event.button === 0) setCreatePressed(true);
  }, []);
  const handleCreateMouseUp = useCallback(() => setCreatePressed(false), []);

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      setSearchFocused(true);
      onFocus?.(event);
    },
    [onFocus],
  );

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      setSearchFocused(false);
      setSearchPressed(false);
      onBlur?.(event);
    },
    [onBlur],
  );

  const resolvedPlaceholder =
    placeholder ?? t(`${I18N_NS}.sensd-input-searchPlaceholder`, { defaultValue: "搜索" });

  const resolvedCreateLabel =
    createLabel ?? t(`${I18N_NS}.sensd-input-searchCreate`, { defaultValue: "创建" });

  const backLabel = t(`${I18N_NS}.sensd-input-searchBack`, { defaultValue: "返回" });

  const fieldClassName = [
    "sens-search-minimal-field",
    showCreate ? "sens-search-minimal-field--with-create" : null,
    showBack ? "sens-search-minimal-field--filled" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const widthStyle =
    width === undefined
      ? undefined
      : ({ width: typeof width === "number" ? `${width}px` : width } as CSSProperties);

  return (
    <div
      className={fieldClassName}
      style={{ ...widthStyle, ...rootStyle }}
      data-filled={showBack ? "true" : "false"}
      data-line-tone={lineTone}
    >
      <div
        className="sens-search-minimal-field-search"
        onMouseEnter={handleSearchMouseEnter}
        onMouseLeave={handleSearchMouseLeave}
        onMouseDown={handleSearchMouseDown}
        onMouseUp={handleSearchMouseUp}
      >
        {showBack ? (
          <div className="sens-search-minimal-back-group">
            <button
              type="button"
              className="sens-search-minimal-back"
              onClick={resetValue}
              disabled={disabled}
              aria-label={backLabel}
            >
              <ChevronLeftIcon className="sens-search-minimal-back-icon" />
            </button>
            <span className="sens-search-minimal-vdivider" aria-hidden />
          </div>
        ) : null}

        <div className="sens-search-minimal-input-wrap">
          <Input
            allowClear={allowClear}
            variant="borderless"
            prefix={<SearchPrefixIcon />}
            placeholder={resolvedPlaceholder}
            disabled={disabled}
            value={currentValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="sens-search-field sens-search-minimal-input"
            {...rest}
          />
        </div>
      </div>

      {showCreate ? (
        <div
          className="sens-search-minimal-field-create"
          onMouseEnter={handleCreateMouseEnter}
          onMouseLeave={handleCreateMouseLeave}
          onMouseDown={handleCreateMouseDown}
          onMouseUp={handleCreateMouseUp}
        >
          <span className="sens-search-minimal-vdivider sens-search-minimal-create-vdivider" aria-hidden />
          <SensButton
            tone="linkWeak"
            className="sens-search-minimal-create-action"
            onClick={onCreate}
            disabled={disabled || createDisabled}
          >
            {resolvedCreateLabel}
          </SensButton>
        </div>
      ) : null}
    </div>
  );
}
