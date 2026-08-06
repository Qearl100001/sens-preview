import type { CSSProperties, ReactNode } from "react";
import { tokenRgba } from "../design-system/color-utils";
import { SensIcon } from "../design-system/icons";
import { navigationCssVar } from "../design-system/navigation-color";
import { getTypographyToken } from "../design-system/typography";
import { getUnitToken } from "../design-system/unit";
import { SensButton } from "./SensButton";

export const SENS_TITLE_BAR_HEIGHT = getUnitToken("size/component-height/title-bar");
export const SENS_TITLE_BAR_BACK_HIT_SIZE = getUnitToken("spacing/6x");

const titleBarTokens = {
  height: SENS_TITLE_BAR_HEIGHT,
  /** 导航换肤：theme-title-background → --sens-nav-title-bg */
  background: navigationCssVar("--sens-nav-title-bg", "theme-title-background"),
  text: tokenRgba("text-color-transparent", 0.9),
  paddingRight: getUnitToken("spacing/6x"),
  contentPaddingLeft: getUnitToken("spacing/0.5x"),
  actionGap: getUnitToken("spacing/4x"),
  actionTop: getUnitToken("spacing/5x"),
  titleFontSize: getTypographyToken("font-size/xxl"),
  titleLineHeight: getTypographyToken("line-height/xxl"),
  titleFontWeight: getTypographyToken("font-weight/semibold"),
  backIconSize: getUnitToken("size/icon/l"),
};

export interface SensTitleBarProps {
  title: ReactNode;
  actions?: ReactNode;
  onBack?: () => void;
  className?: string;
  style?: CSSProperties;
  titleStyle?: CSSProperties;
  /** 供抽屉等 dialog 挂 `aria-labelledby`；由 SensDrawer 注入时可省略 */
  titleId?: string;
}

/** 标题栏 / 面包屑场景的标题区：背景跟随导航换肤 token。 */
export function SensTitleBar({
  title,
  actions,
  onBack,
  className,
  style,
  titleStyle,
  titleId,
}: SensTitleBarProps) {
  return (
    <div
      className={className}
      style={{
        height: titleBarTokens.height,
        minHeight: titleBarTokens.height,
        background: titleBarTokens.background,
        display: "flex",
        justifyContent: "space-between",
        boxSizing: "border-box",
        paddingRight: titleBarTokens.paddingRight,
        ...style,
      }}
    >
      <div
        style={{
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          paddingLeft: titleBarTokens.contentPaddingLeft,
        }}
      >
        {onBack ? (
          <SensButton
            tone="linkWeak"
            aria-label="返回"
            onClick={onBack}
            icon={<SensIcon name="chevron-left" sizeToken="size/icon/l" color="currentColor" />}
            style={{
              width: SENS_TITLE_BAR_BACK_HIT_SIZE,
              height: titleBarTokens.height,
              padding: 0,
              minWidth: SENS_TITLE_BAR_BACK_HIT_SIZE,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              flexShrink: 0,
            }}
          />
        ) : null}

        <div
          id={titleId}
          role="heading"
          aria-level={1}
          style={{
            minWidth: 0,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            color: titleBarTokens.text,
            fontSize: titleBarTokens.titleFontSize,
            lineHeight: `${titleBarTokens.titleLineHeight}px`,
            fontWeight: titleBarTokens.titleFontWeight,
            ...titleStyle,
          }}
        >
          {title}
        </div>
      </div>

      {actions ? (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: titleBarTokens.actionGap,
            marginTop: titleBarTokens.actionTop,
            flexShrink: 0,
          }}
        >
          {actions}
        </div>
      ) : null}
    </div>
  );
}
