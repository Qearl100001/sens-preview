import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { buildShadow, buildShadowD4, getColorToken, tokenRgba } from "../design-system/color-utils";
import { navigationCssVar } from "../design-system/navigation-color";
import { getUnitToken } from "../design-system/unit";
import {
  PRODUCT_SHELL_SIDE_NAV_EXPANDED_WIDTH,
  PRODUCT_SHELL_SIDE_NAV_COLLAPSED_WIDTH,
  type ProductShellSideNavigationMode,
} from "./ProductShellSideNavigation";
import { SensProductShellBackTop } from "./SensProductShellBackTop";
import { useSensProductShellScroll } from "./useSensProductShellScroll";
import "./sens-product-shell.css";

export type SensProductShellLayout = "t" | "vertical";

export interface SensProductShellProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  layout?: SensProductShellLayout;
  topNavigation: ReactNode;
  titleBar: ReactNode;
  sideNavigation?: ReactNode;
  sideNavigationMode?: ProductShellSideNavigationMode;
  collapsedSideWidth?: number;
  contentLabel: string;
  scrollClassName?: string;
  children: ReactNode;
}

function buildShellStyle({
  layout,
  sideNavigationMode,
  collapsedSideWidth,
}: {
  layout: SensProductShellLayout;
  sideNavigationMode: ProductShellSideNavigationMode;
  collapsedSideWidth: number;
}): CSSProperties {
  const sideWidth =
    sideNavigationMode === "docked" ? PRODUCT_SHELL_SIDE_NAV_EXPANDED_WIDTH : collapsedSideWidth;
  return {
    "--sens-product-shell-page-background": navigationCssVar("--sens-nav-page-bg", "body-background"),
    "--sens-product-shell-surface": getColorToken("white"),
    "--sens-product-shell-text": tokenRgba("text-color-transparent", 0.9),
    "--sens-product-shell-content-radius": `${getUnitToken("radius/xl")}px`,
    "--sens-product-shell-side-width": `${sideWidth}px`,
    "--sens-product-shell-content-shadow":
      layout === "t" && sideNavigationMode !== "overlay" ? buildShadow("D2", "left") : "none",
    "--sens-product-shell-title-shadow": buildShadowD4(),
  } as CSSProperties;
}

export function SensProductShell({
  layout = "t",
  topNavigation,
  titleBar,
  sideNavigation,
  sideNavigationMode = "docked",
  collapsedSideWidth = PRODUCT_SHELL_SIDE_NAV_COLLAPSED_WIDTH,
  contentLabel,
  scrollClassName,
  children,
  className,
  style,
  ...rest
}: SensProductShellProps) {
  const {
    scrollRef,
    contentRef,
    topNavCollapsed,
    titleBarElevated,
    showBackTop,
    backTopDocked,
    handleContentScroll,
    handleBackToTop,
    handleBackTopPointerEnter,
    handleBackTopPointerLeave,
  } = useSensProductShellScroll();

  const shellStyle = {
    ...buildShellStyle({ layout, sideNavigationMode, collapsedSideWidth }),
    ...style,
  } as CSSProperties;

  return (
    <main
      {...rest}
      className={[
        "sens-product-shell",
        `sens-product-shell--${layout}`,
        topNavCollapsed ? "sens-product-shell--top-nav-collapsed" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={shellStyle}
      data-sens-product-shell
      data-sens-product-shell-layout={layout}
      data-top-nav-collapsed={topNavCollapsed ? "true" : "false"}
    >
      <div
        className="sens-product-shell__navigation-layer"
        aria-hidden={topNavCollapsed || undefined}
        data-product-shell-top-nav
      >
        {topNavigation}
      </div>

      <div className="sens-product-shell__workspace">
        {layout === "t" ? sideNavigation : null}
        <section ref={contentRef} className="sens-product-shell__content" aria-label={contentLabel}>
          <div
            className={[
              "sens-product-shell__title-bar",
              titleBarElevated ? "sens-product-shell__title-bar--elevated" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            data-product-shell-title-elevated={titleBarElevated ? "true" : "false"}
          >
            {titleBar}
          </div>

          <div
            ref={scrollRef}
            className={["sens-product-shell__scroll", scrollClassName].filter(Boolean).join(" ")}
            data-product-shell-content-scroll
            onScroll={handleContentScroll}
          >
            {children}
          </div>

          <SensProductShellBackTop
            visible={showBackTop}
            docked={backTopDocked}
            anchorRef={contentRef}
            onBackToTop={handleBackToTop}
            onPointerEnter={handleBackTopPointerEnter}
            onPointerLeave={handleBackTopPointerLeave}
          />
        </section>
      </div>
    </main>
  );
}
