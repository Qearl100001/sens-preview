import { useEffect, useState, type CSSProperties } from "react";
import type { PaginationProps, SelectProps } from "antd";
import { Pagination, Tooltip } from "antd";
import { buildActiveRingShadow, buildShadowD3, getColorToken, tokenRgba } from "../design-system/color-utils";
import { getDividerColor, getDividerHairlineWidth } from "../design-system/divider";
import { SensIcon } from "../design-system/icons";
import { getTypographyToken } from "../design-system/typography";
import { getUnitToken } from "../design-system/unit";
import { SELECT_CHECK_ICON_SIZE, SelectCheckIcon } from "./FieldIcons";
import { useSensSelectTriggerProps } from "./fieldIconProps";
import { SensInput } from "./SensInput";
import { SensSelectDropdown, useSensSelectDropdownStyle, useSensSelectTriggerStyle } from "./SensSelectDropdown";
import "./pagination.css";

export type SensPaginationProps = Omit<
  PaginationProps,
  "align" | "prevIcon" | "nextIcon" | "jumpPrevIcon" | "jumpNextIcon" | "showTitle"
>;

function PaginationArrowIcon({
  direction,
  disabled = false,
}: {
  direction: "prev" | "next";
  disabled?: boolean;
}) {
  const title = disabled ? (direction === "prev" ? "当前已在首页" : "当前已在尾页") : direction === "prev" ? "上一页" : "下一页";

  return (
    <Tooltip title={title} placement="top">
      <button
        aria-disabled={disabled}
        aria-label={title}
        className="ant-pagination-item-link sens-pagination-arrow"
        type="button"
        tabIndex={-1}
      >
        <SensIcon name={direction === "prev" ? "chevron-left" : "chevron-right"} sizeToken="size/icon/m" color="currentColor" />
      </button>
    </Tooltip>
  );
}

function PaginationJumpIcon({ direction }: { direction: "prev" | "next" }) {
  const title = direction === "prev" ? "向前 5 页" : "向后 5 页";

  return (
    <Tooltip title={title} placement="top">
      <span className="sens-pagination-jump-icon" aria-label={title}>
        <SensIcon name="more" sizeToken="size/icon/m" color="currentColor" className="sens-pagination-jump-more" />
        <SensIcon
          name={direction === "prev" ? "double-chevron-left" : "double-chevron-right"}
          sizeToken="size/icon/m"
          color="currentColor"
          className="sens-pagination-jump-arrow"
        />
      </span>
    </Tooltip>
  );
}

function PaginationSelectCheckSuffix() {
  return (
    <span className="sens-select-option-check">
      <SelectCheckIcon size={SELECT_CHECK_ICON_SIZE} />
    </span>
  );
}

function defaultShowTotal(total: number, range: [number, number]) {
  if (total === 0) return "本页显示第 0 条";
  return `本页显示第 ${range[0]}-${range[1]} 条`;
}

function calculatePageCount(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(total / pageSize));
}

function clampPage(page: number, pageCount: number): number {
  if (!Number.isFinite(page)) return 1;
  return Math.min(Math.max(Math.trunc(page), 1), pageCount);
}

function getDisplayRange(total: number, current: number, pageSize: number): [number, number] {
  if (total === 0) return [0, 0];
  return [(current - 1) * pageSize + 1, Math.min(current * pageSize, total)];
}

function getPageSizeOptions(
  pageSizeOptions: SensPaginationProps["pageSizeOptions"],
  currentPageSize: number,
) {
  const numericOptions = (pageSizeOptions ?? [10, 20, 50, 100])
    .map((option) => Number(option))
    .filter((option) => Number.isFinite(option) && option > 0);
  const options = Array.from(new Set([...numericOptions, currentPageSize])).sort((a, b) => a - b);

  return options.map((option) => ({
    label: `${option} 条/页`,
    value: option,
  }));
}

function px(value: number): string {
  return `${value}px`;
}

function buildPaginationTokenVars(): CSSProperties {
  return {
    "--sens-pagination-item-bg": getColorToken("white"),
    "--sens-pagination-item-border": getDividerColor("deep", "transparent"),
    "--sens-pagination-item-hover-bg": getColorToken("white"),
    "--sens-pagination-item-hover-border": getColorToken("component-primary"),
    "--sens-pagination-item-hover-text": getColorToken("component-primary"),
    "--sens-pagination-item-hover-shadow": buildShadowD3(),
    "--sens-pagination-item-pressed-bg": getColorToken("white"),
    "--sens-pagination-item-pressed-border": getColorToken("component-active"),
    "--sens-pagination-item-pressed-text": getColorToken("component-active"),
    "--sens-pagination-item-pressed-shadow": buildActiveRingShadow("component-active-shadow"),
    "--sens-pagination-item-selected-bg": getColorToken("component-primary"),
    "--sens-pagination-item-selected-hover-bg": getColorToken("component-hover"),
    "--sens-pagination-item-selected-text": getColorToken("white"),
    "--sens-pagination-item-selected-border": getDividerColor("light", "transparent"),
    "--sens-pagination-item-disabled-bg": tokenRgba("background-transparent-grey-hover", 0.06),
    "--sens-pagination-item-disabled-hover-bg": tokenRgba("background-transparent-grey", 0.04),
    "--sens-pagination-item-disabled-border": getDividerColor("light", "transparent"),
    "--sens-pagination-item-disabled-hover-border": getDividerColor("weak", "transparent"),
    "--sens-pagination-item-disabled-text": tokenRgba("text-color-transparent-disable", 0.3),
    "--sens-pagination-item-disabled-hover-text": tokenRgba("text-color-transparent-disable-hover", 0.24),
    "--sens-pagination-arrow-icon-color": getColorToken("icon-color-transparent"),
    "--sens-pagination-arrow-icon-disabled-color": getColorToken("icon-color-transparent-disable"),
    "--sens-pagination-arrow-icon-disabled-hover-color": getColorToken("icon-color-transparent-disable-hover"),
    "--sens-pagination-jump-icon-color": getColorToken("icon-color-transparent"),
    "--sens-pagination-jump-hover-icon-color": getColorToken("link-color"),
    "--sens-pagination-text-color": tokenRgba("text-color-transparent", 0.9),
    "--sens-pagination-range-text-color": tokenRgba("text-color-transparent", 0.9),
    "--sens-pagination-border-color": getColorToken("outline-color"),
    "--sens-pagination-input-hover-border": getColorToken("component-primary"),
    "--sens-pagination-input-focus-border": getColorToken("component-active"),
    "--sens-pagination-input-focus-shadow": buildActiveRingShadow("component-active-shadow"),
    "--sens-pagination-item-size": px(getUnitToken("size/component-height/m")),
    "--sens-pagination-item-size-sm": px(getUnitToken("size/component-height/s")),
    "--sens-pagination-item-radius": px(getUnitToken("radius/m")),
    "--sens-pagination-item-gap": px(getUnitToken("spacing/horizontal/2x")),
    "--sens-pagination-options-gap": px(getUnitToken("spacing/horizontal/2x")),
    "--sens-pagination-font-size": px(getTypographyToken("font-size/m")),
    "--sens-pagination-line-height": px(getTypographyToken("line-height/m")),
    "--sens-pagination-icon-size": px(getUnitToken("size/icon/m")),
    "--sens-pagination-divider-width": px(getDividerHairlineWidth()),
  } as CSSProperties;
}

function mergeClassName(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function usePaginationSizeChangerConfig(
  showSizeChanger: SensPaginationProps["showSizeChanger"],
  simple: boolean,
): PaginationProps["showSizeChanger"] {
  const triggerStyle = useSensSelectTriggerStyle();
  const dropdownStyle = useSensSelectDropdownStyle();
  const triggerProps = useSensSelectTriggerProps(false, triggerStyle);
  const mergedShowSizeChanger = showSizeChanger ?? !simple;

  if (mergedShowSizeChanger === false) return false;

  const selectProps: SelectProps =
    typeof mergedShowSizeChanger === "object" ? mergedShowSizeChanger : {};
  const popupRootClass = mergeClassName("sens-select-dropdown", selectProps.classNames?.popup?.root);

  return {
    ...selectProps,
    showSearch: false,
    filterOption: false,
    popupMatchSelectWidth: false,
    suffixIcon: selectProps.suffixIcon ?? triggerProps.suffixIcon,
    className: mergeClassName(triggerProps.className, "sens-pagination-size-changer", selectProps.className),
    style: { ...triggerProps.style, ...selectProps.style },
    classNames: {
      ...selectProps.classNames,
      popup: {
        ...selectProps.classNames?.popup,
        root: popupRootClass,
      },
    },
    styles: {
      ...selectProps.styles,
      popup: {
        ...selectProps.styles?.popup,
        root: { ...dropdownStyle, ...selectProps.styles?.popup?.root },
      },
    },
    menuItemSelectedIcon: selectProps.menuItemSelectedIcon ?? <PaginationSelectCheckSuffix />,
  };
}

function renderTotal(showTotal: SensPaginationProps["showTotal"], total: number, current: number, pageSize: number) {
  if (!showTotal) return null;

  return <span className="ant-pagination-total-text">{showTotal(total, getDisplayRange(total, current, pageSize))}</span>;
}

/** 基础分页器：独立于 Table，由筛选表格等复合组件按需组合。 */
export function SensPagination({
  showTotal = defaultShowTotal,
  showSizeChanger,
  showQuickJumper,
  pageSizeOptions = [10, 20, 50, 100],
  simple = false,
  className,
  style,
  total = 0,
  current,
  defaultCurrent = 1,
  pageSize,
  defaultPageSize = 10,
  disabled = false,
  hideOnSinglePage,
  onChange,
  onShowSizeChange,
  ...rest
}: SensPaginationProps) {
  const isSimple = Boolean(simple);
  const sizeChangerConfig = usePaginationSizeChangerConfig(showSizeChanger, isSimple);
  const [innerCurrent, setInnerCurrent] = useState(defaultCurrent);
  const [innerPageSize, setInnerPageSize] = useState(defaultPageSize);
  const [quickJumpValue, setQuickJumpValue] = useState("");
  const [simpleInputValue, setSimpleInputValue] = useState(String(defaultCurrent));
  const mergedPageSize = Math.max(1, pageSize ?? innerPageSize);
  const pageCount = calculatePageCount(total, mergedPageSize);
  const mergedCurrent = clampPage(current ?? innerCurrent, pageCount);
  const paginationClassName = [
    "sens-pagination",
    disabled ? "ant-pagination-disabled" : undefined,
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const sizeChangerProps = typeof sizeChangerConfig === "object" ? sizeChangerConfig : undefined;
  const mergedShowQuickJumper = showQuickJumper ?? !isSimple;
  const shouldShowSizeChanger = !isSimple && Boolean(sizeChangerProps);
  const shouldShowQuickJumper = !isSimple && Boolean(mergedShowQuickJumper) && pageCount > 1;

  useEffect(() => {
    setSimpleInputValue(String(mergedCurrent));
  }, [mergedCurrent]);

  const handlePageChange = (nextPage: number, nextPageSize = mergedPageSize) => {
    if (disabled) return;

    const nextPageCount = calculatePageCount(total, nextPageSize);
    const safePage = clampPage(nextPage, nextPageCount);

    if (safePage === mergedCurrent && nextPageSize === mergedPageSize) return;

    if (current === undefined) setInnerCurrent(safePage);
    onChange?.(safePage, nextPageSize);
  };

  const handlePageSizeChange = (nextPageSize: number) => {
    if (disabled) return;

    const nextPageCount = calculatePageCount(total, nextPageSize);
    const safePage = clampPage(mergedCurrent, nextPageCount);

    if (pageSize === undefined) setInnerPageSize(nextPageSize);
    if (current === undefined) setInnerCurrent(safePage);
    onShowSizeChange?.(mergedCurrent, nextPageSize);
    onChange?.(safePage, nextPageSize);
  };

  const handleQuickJump = () => {
    const parsedPage = Number(quickJumpValue);

    if (!quickJumpValue.trim() || !Number.isFinite(parsedPage)) {
      setQuickJumpValue("");
      return;
    }

    handlePageChange(parsedPage);
    setQuickJumpValue("");
  };

  const handleSimpleJump = () => {
    const parsedPage = Number(simpleInputValue);

    if (disabled || !simpleInputValue.trim() || !Number.isFinite(parsedPage)) {
      setSimpleInputValue(String(mergedCurrent));
      return;
    }

    const safePage = clampPage(parsedPage, pageCount);
    handlePageChange(safePage);
    setSimpleInputValue(String(safePage));
  };

  if (hideOnSinglePage && total <= mergedPageSize) {
    return null;
  }

  if (isSimple) {
    const prevDisabled = disabled || mergedCurrent <= 1;
    const nextDisabled = disabled || mergedCurrent >= pageCount;

    return (
      <div
        className={mergeClassName(paginationClassName, "sens-pagination-simple")}
        style={{ ...buildPaginationTokenVars(), ...style }}
      >
        <Tooltip title={prevDisabled ? "当前已在首页" : "上一页"} placement="top">
          <button
            aria-disabled={prevDisabled}
            aria-label={prevDisabled ? "当前已在首页" : "上一页"}
            className="sens-pagination-simple-arrow"
            type="button"
            onClick={() => handlePageChange(mergedCurrent - 1)}
          >
            <SensIcon name="chevron-left" sizeToken="size/icon/m" color="currentColor" />
          </button>
        </Tooltip>
        <Tooltip title="输入要跳转的页码" placement="top">
          <span className="sens-pagination-control-tooltip">
            <SensInput
              className="sens-pagination-simple-input"
              disabled={disabled}
              size="small"
              value={simpleInputValue}
              onBlur={handleSimpleJump}
              onChange={(event) => setSimpleInputValue(event.target.value.replace(/[^\d]/g, ""))}
              onPressEnter={handleSimpleJump}
            />
          </span>
        </Tooltip>
        <span className="sens-pagination-simple-total">/ {pageCount}</span>
        <Tooltip title={nextDisabled ? "当前已在尾页" : "下一页"} placement="top">
          <button
            aria-disabled={nextDisabled}
            aria-label={nextDisabled ? "当前已在尾页" : "下一页"}
            className="sens-pagination-simple-arrow"
            type="button"
            onClick={() => handlePageChange(mergedCurrent + 1)}
          >
            <SensIcon name="chevron-right" sizeToken="size/icon/m" color="currentColor" />
          </button>
        </Tooltip>
      </div>
    );
  }

  const paginationPages =
    pageCount <= 10 ? (
      <ul className="ant-pagination sens-pagination-pages">
        <li
          className={mergeClassName("ant-pagination-prev", mergedCurrent <= 1 || disabled ? "ant-pagination-disabled" : undefined)}
          onClick={() => handlePageChange(mergedCurrent - 1)}
        >
          <PaginationArrowIcon direction="prev" disabled={mergedCurrent <= 1 || disabled} />
        </li>
        {Array.from({ length: pageCount }, (_, index) => {
          const page = index + 1;
          const active = page === mergedCurrent;

          return (
            <li
              className={mergeClassName("ant-pagination-item", active ? "ant-pagination-item-active" : undefined)}
              key={page}
              onClick={() => handlePageChange(page)}
            >
              <a rel="nofollow">{page}</a>
            </li>
          );
        })}
        <li
          className={mergeClassName("ant-pagination-next", mergedCurrent >= pageCount || disabled ? "ant-pagination-disabled" : undefined)}
          onClick={() => handlePageChange(mergedCurrent + 1)}
        >
          <PaginationArrowIcon direction="next" disabled={mergedCurrent >= pageCount || disabled} />
        </li>
      </ul>
    ) : (
      <Pagination
        className="sens-pagination-pages"
        total={total}
        current={mergedCurrent}
        pageSize={mergedPageSize}
        disabled={disabled}
        hideOnSinglePage={hideOnSinglePage}
        onChange={handlePageChange}
        showTotal={undefined}
        showSizeChanger={false}
        showQuickJumper={false}
        pageSizeOptions={pageSizeOptions}
        {...rest}
        showTitle={false}
        prevIcon={<PaginationArrowIcon direction="prev" />}
        nextIcon={<PaginationArrowIcon direction="next" />}
        jumpPrevIcon={<PaginationJumpIcon direction="prev" />}
        jumpNextIcon={<PaginationJumpIcon direction="next" />}
      />
    );

  const optionsNode =
    shouldShowSizeChanger || shouldShowQuickJumper ? (
      <div className="ant-pagination-options">
        {shouldShowSizeChanger ? (
          <Tooltip title="切换每页条数" placement="top">
            <span className="sens-pagination-control-tooltip">
              <SensSelectDropdown
                {...sizeChangerProps}
                className={mergeClassName("sens-pagination-size-changer", sizeChangerProps?.className)}
                disabled={disabled || sizeChangerProps?.disabled}
                filterOption={false}
                menuItemSelectedIcon={sizeChangerProps?.menuItemSelectedIcon ?? <PaginationSelectCheckSuffix />}
                options={getPageSizeOptions(pageSizeOptions, mergedPageSize)}
                popupMatchSelectWidth={false}
                showSearch={false}
                value={mergedPageSize}
                onChange={(nextValue, option) => {
                  handlePageSizeChange(Number(nextValue));
                  sizeChangerProps?.onChange?.(nextValue, option);
                }}
              />
            </span>
          </Tooltip>
        ) : null}
        {shouldShowQuickJumper ? (
          <span className="ant-pagination-options-quick-jumper">
            跳至
            <Tooltip title="输入要跳转的页码" placement="top">
              <span className="sens-pagination-control-tooltip">
                <SensInput
                  className="sens-pagination-quick-input"
                  disabled={disabled}
                  value={quickJumpValue}
                  onBlur={handleQuickJump}
                  onChange={(event) => setQuickJumpValue(event.target.value.replace(/[^\d]/g, ""))}
                  onPressEnter={handleQuickJump}
                />
              </span>
            </Tooltip>
            页
          </span>
        ) : null}
      </div>
    ) : null;

  return (
    <div
      className={paginationClassName}
      style={{ ...buildPaginationTokenVars(), ...style }}
    >
      {renderTotal(showTotal, total, mergedCurrent, mergedPageSize)}
      {paginationPages}
      {optionsNode}
    </div>
  );
}
