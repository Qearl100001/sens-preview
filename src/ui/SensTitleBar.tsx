import type { CSSProperties, ReactNode } from "react";
import tokens from "../design-system/tokens.resolved.json";
import { getColorToken, tokenRgba } from "../design-system/color-utils";
import { SensIcon } from "../design-system/icons";
import { getTypographyToken } from "../design-system/typography";
import { SensButton } from "./SensButton";

const u = tokens.unit as Record<string, number>;

export const SENS_TITLE_BAR_HEIGHT = 72;
export const SENS_TITLE_BAR_BACK_HIT_SIZE = 22;

const titleBarTokens = {
  height: SENS_TITLE_BAR_HEIGHT,
  background: getColorToken("theme-title-background"),
  text: tokenRgba("text-color-transparent", 0.9),
  paddingRight: u["spacing/6x"],
  contentPaddingLeft: u["spacing/0․5x"],
  actionGap: u["spacing/4x"],
  actionTop: u["spacing/5x"],
  titleFontSize: getTypographyToken("font-size/xxl"),
  titleLineHeight: getTypographyToken("line-height/xxl"),
  titleFontWeight: getTypographyToken("font-weight/semibold"),
  backIconSize: u["size/icon/l"],
};

export interface SensTitleBarProps {
  title: ReactNode;
  actions?: ReactNode;
  onBack?: () => void;
  className?: string;
  style?: CSSProperties;
  titleStyle?: CSSProperties;
}

/** 标题栏 / 面包屑场景的标题区：背景跟随导航换肤 token。 */
export function SensTitleBar({
  title,
  actions,
  onBack,
  className,
  style,
  titleStyle,
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
            tone="link"
            aria-label="返回"
            onClick={onBack}
            icon={<SensIcon name="chevron-left" sizeToken="size/icon/l" color="currentColor" />}
            style={{
              width: SENS_TITLE_BAR_BACK_HIT_SIZE,
              height: SENS_TITLE_BAR_BACK_HIT_SIZE,
              padding: 0,
              minWidth: SENS_TITLE_BAR_BACK_HIT_SIZE,
              flexShrink: 0,
            }}
          />
        ) : null}

        <div
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
