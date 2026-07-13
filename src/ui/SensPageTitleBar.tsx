import type { CSSProperties, ReactNode } from "react";
import { getColorToken, tokenRgba } from "../design-system/color-utils";
import { SensIcon } from "../design-system/icons";
import { getTypographyToken } from "../design-system/typography";
import { getUnitToken } from "../design-system/unit";
import { SensBreadcrumb, type SensBreadcrumbItem } from "./SensBreadcrumb";
import { SensButton } from "./SensButton";

export const SENS_PAGE_TITLE_BAR_HEIGHT = getUnitToken("size/component-height/title-bar");
const SENS_PAGE_TITLE_BAR_DESCRIPTION_HEIGHT = getUnitToken("size/component-height/title-bar-with-description");

type SensPageTitleBarVariant = "landing" | "drilldown";

const pageTitleBarTokens = {
  height: SENS_PAGE_TITLE_BAR_HEIGHT,
  descriptionHeight: SENS_PAGE_TITLE_BAR_DESCRIPTION_HEIGHT,
  landingBackground: getColorToken("white"),
  drilldownBackground: getColorToken("theme-title-background"),
  text: tokenRgba("text-color-transparent", 0.9),
  subText: tokenRgba("text-sub-color-transparent", 0.58),
  paddingLeftWithBack: getUnitToken("spacing/0.5x"),
  paddingLeftLanding: getUnitToken("spacing/6x"),
  paddingRight: getUnitToken("spacing/6x"),
  actionGap: getUnitToken("spacing/4x"),
  actionTop: getUnitToken("spacing/5x"),
  backHitWidth: getUnitToken("spacing/6x"),
  backContentGap: getUnitToken("spacing/0.5x"),
  breadcrumbTitleGap: getUnitToken("spacing/0.5x"),
  titleDescriptionGap: getUnitToken("spacing/1x"),
  titleFontSize: getTypographyToken("font-size/xxl"),
  titleLineHeight: getTypographyToken("line-height/xxl"),
  titleFontWeight: getTypographyToken("font-weight/semibold"),
  descriptionFontSize: getTypographyToken("font-size/s"),
  descriptionLineHeight: getTypographyToken("line-height/s"),
  descriptionFontWeight: getTypographyToken("font-weight/regular"),
  breadcrumbVerticalInset:
    (SENS_PAGE_TITLE_BAR_HEIGHT -
      getTypographyToken("line-height/s") -
      getUnitToken("spacing/0.5x") -
      getTypographyToken("line-height/xxl")) /
    2,
  breadcrumbVerticalInsetWithDescription:
    (SENS_PAGE_TITLE_BAR_DESCRIPTION_HEIGHT -
      getTypographyToken("line-height/s") -
      getUnitToken("spacing/0.5x") -
      getTypographyToken("line-height/xxl") -
      getUnitToken("spacing/1x") -
      getTypographyToken("line-height/s")) /
    2,
};

export interface SensPageTitleBarProps {
  /** landing 用于落地页白底标题区；drilldown 用于带面包屑/返回的浅灰标题区。 */
  variant?: SensPageTitleBarVariant;
  title: ReactNode;
  description?: ReactNode;
  breadcrumbItems?: SensBreadcrumbItem[];
  breadcrumbEllipsis?: boolean;
  actions?: ReactNode;
  onBack?: () => void;
  className?: string;
  style?: CSSProperties;
}

/** 页面标题栏：不包含顶部导航，只承载返回、面包屑、页面标题和右侧操作。 */
export function SensPageTitleBar({
  variant,
  title,
  description,
  breadcrumbItems,
  breadcrumbEllipsis,
  actions,
  onBack,
  className,
  style,
}: SensPageTitleBarProps) {
  const showBreadcrumb = Boolean(breadcrumbItems?.length);
  const showDescription = Boolean(description);
  const showBack = Boolean(onBack);
  const resolvedVariant = variant ?? (showBreadcrumb || onBack ? "drilldown" : "landing");
  const height = showDescription ? pageTitleBarTokens.descriptionHeight : pageTitleBarTokens.height;
  const background =
    resolvedVariant === "landing"
      ? pageTitleBarTokens.landingBackground
      : pageTitleBarTokens.drilldownBackground;
  const contentGridTemplateRows = showBreadcrumb
    ? showDescription
      ? "1fr auto auto auto 1fr"
      : "1fr auto auto 1fr"
    : showDescription
      ? "1fr auto auto 1fr"
      : "1fr auto 1fr";
  const gridTemplateColumns = showBack
    ? actions
      ? `${pageTitleBarTokens.backHitWidth}px ${pageTitleBarTokens.backContentGap}px minmax(0, 1fr) ${pageTitleBarTokens.actionGap}px auto`
      : `${pageTitleBarTokens.backHitWidth}px ${pageTitleBarTokens.backContentGap}px minmax(0, 1fr)`
    : actions
      ? `minmax(0, 1fr) ${pageTitleBarTokens.actionGap}px auto`
      : "minmax(0, 1fr)";
  const contentColumn = showBack ? 3 : 1;
  const actionColumn = showBack ? 5 : 3;
  const titleRow = showBreadcrumb ? 3 : 2;
  const descriptionRow = showBreadcrumb ? 4 : 3;
  const paddingLeft = showBack ? pageTitleBarTokens.paddingLeftWithBack : pageTitleBarTokens.paddingLeftLanding;
  const useBreadcrumbFixedLayout = showBreadcrumb;
  const breadcrumbVerticalInset = showDescription
    ? pageTitleBarTokens.breadcrumbVerticalInsetWithDescription
    : pageTitleBarTokens.breadcrumbVerticalInset;

  const titleTextStyle: CSSProperties = {
    minWidth: 0,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    color: pageTitleBarTokens.text,
    fontSize: pageTitleBarTokens.titleFontSize,
    lineHeight: `${pageTitleBarTokens.titleLineHeight}px`,
    fontWeight: pageTitleBarTokens.titleFontWeight,
  };

  const descriptionTextStyle: CSSProperties = {
    minWidth: 0,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    color: pageTitleBarTokens.subText,
    fontSize: pageTitleBarTokens.descriptionFontSize,
    lineHeight: `${pageTitleBarTokens.descriptionLineHeight}px`,
    fontWeight: pageTitleBarTokens.descriptionFontWeight,
  };

  const containerStyle: CSSProperties = {
    height,
    minHeight: height,
    boxSizing: "border-box",
    paddingLeft,
    paddingRight: pageTitleBarTokens.paddingRight,
    background,
    ...style,
  };

  if (useBreadcrumbFixedLayout) {
    return (
      <div
        className={className}
        style={{
          ...containerStyle,
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            paddingTop: breadcrumbVerticalInset,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              minWidth: 0,
            }}
          >
            {showBack ? (
              <div style={{ width: pageTitleBarTokens.backHitWidth, flexShrink: 0 }} aria-hidden />
            ) : null}
            {showBack ? (
              <div style={{ width: pageTitleBarTokens.backContentGap, flexShrink: 0 }} aria-hidden />
            ) : null}
            <div style={{ minWidth: 0, flex: 1 }}>
              <SensBreadcrumb
                items={breadcrumbItems ?? []}
                ellipsis={breadcrumbEllipsis}
                style={{ marginBottom: 0 }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: pageTitleBarTokens.breadcrumbTitleGap,
              height: pageTitleBarTokens.titleLineHeight,
              minHeight: pageTitleBarTokens.titleLineHeight,
              minWidth: 0,
            }}
          >
            {showBack ? (
              <SensButton
                tone="linkWeak"
                aria-label="返回"
                onClick={onBack}
                icon={<SensIcon name="chevron-left" sizeToken="size/icon/l" color="currentColor" />}
                style={{
                  width: pageTitleBarTokens.backHitWidth,
                  minWidth: pageTitleBarTokens.backHitWidth,
                  height: pageTitleBarTokens.titleLineHeight,
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  flexShrink: 0,
                }}
              />
            ) : null}
            {showBack ? (
              <div style={{ width: pageTitleBarTokens.backContentGap, flexShrink: 0 }} aria-hidden />
            ) : null}
            <div style={{ ...titleTextStyle, flex: 1 }}>{title}</div>
          </div>

          {showDescription ? (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                marginTop: pageTitleBarTokens.titleDescriptionGap,
                minWidth: 0,
              }}
            >
              {showBack ? (
                <div style={{ width: pageTitleBarTokens.backHitWidth, flexShrink: 0 }} aria-hidden />
              ) : null}
              {showBack ? (
                <div style={{ width: pageTitleBarTokens.backContentGap, flexShrink: 0 }} aria-hidden />
              ) : null}
              <div style={{ ...descriptionTextStyle, flex: 1 }}>{description}</div>
            </div>
          ) : null}
        </div>

        {actions ? (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: pageTitleBarTokens.actionGap,
              marginTop: pageTitleBarTokens.actionTop,
              marginLeft: pageTitleBarTokens.actionGap,
              flexShrink: 0,
            }}
          >
            {actions}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        ...containerStyle,
        display: "grid",
        gridTemplateColumns,
        gridTemplateRows: contentGridTemplateRows,
        rowGap: showBreadcrumb || showDescription ? pageTitleBarTokens.titleDescriptionGap : 0,
        alignItems: "stretch",
        ...style,
      }}
    >
      {showBack ? (
        <div
          style={{
            gridColumn: 1,
            gridRow: "1 / -1",
            display: "flex",
            alignItems: "stretch",
          }}
        >
          <SensButton
            tone="linkWeak"
            aria-label="返回"
            onClick={onBack}
            icon={<SensIcon name="chevron-left" sizeToken="size/icon/l" color="currentColor" />}
            style={{
              width: pageTitleBarTokens.backHitWidth,
              minWidth: pageTitleBarTokens.backHitWidth,
              height: "100%",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              flexShrink: 0,
            }}
          />
        </div>
      ) : null}

      <div
        style={{
          gridColumn: contentColumn,
          gridRow: showBreadcrumb ? 2 : titleRow,
          minWidth: 0,
          display: "flex",
          justifySelf: "start",
          alignSelf: "end",
        }}
      >
        {showBreadcrumb ? (
          <SensBreadcrumb
            items={breadcrumbItems ?? []}
            ellipsis={breadcrumbEllipsis}
            style={{ marginBottom: 0 }}
          />
        ) : null}
      </div>

      <div
        style={{
          gridColumn: contentColumn,
          gridRow: titleRow,
          minWidth: 0,
          alignSelf: "center",
        }}
      >
        <div style={titleTextStyle}>
          {title}
        </div>
      </div>

      {showDescription ? (
        <div
          style={{
            gridColumn: contentColumn,
            gridRow: descriptionRow,
            minWidth: 0,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            color: pageTitleBarTokens.subText,
            fontSize: pageTitleBarTokens.descriptionFontSize,
            lineHeight: `${pageTitleBarTokens.descriptionLineHeight}px`,
            fontWeight: pageTitleBarTokens.descriptionFontWeight,
          }}
        >
          {description}
        </div>
      ) : null}

      {actions ? (
        <div
          style={{
            gridColumn: actionColumn,
            gridRow: titleRow,
            display: "flex",
            alignItems: "center",
            gap: pageTitleBarTokens.actionGap,
            flexShrink: 0,
          }}
        >
          {actions}
        </div>
      ) : null}
    </div>
  );
}
