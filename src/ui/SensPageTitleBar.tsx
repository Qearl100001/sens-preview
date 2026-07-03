import type { CSSProperties, ReactNode } from "react";
import tokens from "../design-system/tokens.resolved.json";
import { getColorToken, tokenRgba } from "../design-system/color-utils";
import { SensIcon } from "../design-system/icons";
import { getTypographyToken } from "../design-system/typography";
import { SensBreadcrumb, type SensBreadcrumbItem } from "./SensBreadcrumb";
import { SensButton } from "./SensButton";

const u = tokens.unit as Record<string, number>;

export const SENS_PAGE_TITLE_BAR_HEIGHT = 72;

const pageTitleBarTokens = {
  height: SENS_PAGE_TITLE_BAR_HEIGHT,
  background: getColorToken("theme-title-background"),
  text: tokenRgba("text-color-transparent", 0.9),
  paddingInline: u["spacing/6x"],
  actionGap: u["spacing/4x"],
  contentGap: u["spacing/2x"],
  titleFontSize: getTypographyToken("font-size/xxl"),
  titleLineHeight: getTypographyToken("line-height/xxl"),
  titleFontWeight: getTypographyToken("font-weight/semibold"),
};

export interface SensPageTitleBarProps {
  title: ReactNode;
  breadcrumbItems?: SensBreadcrumbItem[];
  breadcrumbEllipsis?: boolean;
  actions?: ReactNode;
  onBack?: () => void;
  className?: string;
  style?: CSSProperties;
}

/** 页面标题栏：不包含顶部导航，只承载返回、面包屑、页面标题和右侧操作。 */
export function SensPageTitleBar({
  title,
  breadcrumbItems,
  breadcrumbEllipsis,
  actions,
  onBack,
  className,
  style,
}: SensPageTitleBarProps) {
  const showBreadcrumb = Boolean(breadcrumbItems?.length);

  return (
    <div
      className={className}
      style={{
        height: pageTitleBarTokens.height,
        minHeight: pageTitleBarTokens.height,
        boxSizing: "border-box",
        paddingInline: pageTitleBarTokens.paddingInline,
        background: pageTitleBarTokens.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: pageTitleBarTokens.actionGap,
        ...style,
      }}
    >
      <div
        style={{
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          gap: pageTitleBarTokens.contentGap,
        }}
      >
        {onBack ? (
          <SensButton
            tone="linkWeak"
            size="small"
            aria-label="返回"
            onClick={onBack}
            icon={<SensIcon name="chevron-left" sizeToken="size/icon/l" color="currentColor" />}
            style={{
              width: u["size/component-height/s"],
              minWidth: u["size/component-height/s"],
              padding: 0,
              flexShrink: 0,
            }}
          />
        ) : null}

        <div style={{ minWidth: 0, display: "flex", flexDirection: "column" }}>
          {showBreadcrumb ? (
            <SensBreadcrumb
              items={breadcrumbItems ?? []}
              ellipsis={breadcrumbEllipsis}
              style={{ marginBottom: 0 }}
            />
          ) : null}
          <div
            style={{
              minWidth: 0,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              color: pageTitleBarTokens.text,
              fontSize: pageTitleBarTokens.titleFontSize,
              lineHeight: `${pageTitleBarTokens.titleLineHeight}px`,
              fontWeight: pageTitleBarTokens.titleFontWeight,
            }}
          >
            {title}
          </div>
        </div>
      </div>

      {actions ? (
        <div
          style={{
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
