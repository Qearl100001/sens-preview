import type { CSSProperties, ReactNode } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { buildShadowD4, getColorToken, tokenRgba } from "../design-system/color-utils";
import { SensIcon } from "../design-system/icons";
import type { IconName } from "../design-system/icons";
import { getTypographyToken } from "../design-system/typography";
import { getUnitToken } from "../design-system/unit";

/** 轻提示 / 警告共用 type（Alert 不含 loading） */
export type FeedbackTone = "default" | "success" | "info" | "warning";
export type MessageType = FeedbackTone | "loading";
export type AlertType = FeedbackTone;

export const MESSAGE_TYPE_LABEL: Record<MessageType, string> = {
  default: "常规",
  success: "成功",
  info: "提醒",
  warning: "警告",
  loading: "加载",
};

export const ALERT_TYPE_LABEL: Record<AlertType, string> = {
  default: "常规",
  success: "成功",
  info: "提醒",
  warning: "警告",
};

const ICON_COLOR: Record<MessageType, string> = {
  default: "link-color",
  success: "success-color",
  info: "info-color",
  warning: "warning-color",
  loading: "icon-color-transparent",
};

const ALERT_SURFACE: Record<
  AlertType,
  { background: string; border: string }
> = {
  default: {
    background: "link-light-background",
    border: "link-light-outline",
  },
  success: {
    background: "success-light-background",
    border: "success-light-outline",
  },
  info: {
    background: "info-light-background",
    border: "info-light-outline",
  },
  warning: {
    background: "warning-light-background",
    border: "warning-light-outline",
  },
};

const FEEDBACK_ICON: Record<FeedbackTone, IconName> = {
  default: "feedback-info",
  success: "feedback-complete",
  info: "feedback-warning",
  warning: "feedback-error",
};

/** 有辅助文案时上下 pad = (单行高度 − 标题行高) / 2；不新增 5/7 spacing 档 */
export function feedbackDerivedPadBlock(componentHeight: number, titleLineHeight: number): number {
  return Math.max(0, (componentHeight - titleLineHeight) / 2);
}

export function feedbackLayoutTokens() {
  const fontSize = getTypographyToken("font-size/m");
  const lineHeight = getTypographyToken("line-height/m");
  const messageHeight = getUnitToken("size/component-height/m");
  const alertHeight = getUnitToken("size/component-height/l");
  return {
    iconSize: getUnitToken("size/icon/m"),
    fontSize,
    lineHeight,
    /** Figma 4212:16045 · 中文/辅助信息 12/18 */
    descriptionFontSize: getTypographyToken("font-size/s"),
    descriptionLineHeight: getTypographyToken("line-height/s"),
    /** 标题↔辅助 gap · Figma 4 */
    descriptionGap: getUnitToken("spacing/1x"),
    radius: getUnitToken("radius/m"),
    padInline: getUnitToken("spacing/horizontal/3x"),
    gap: getUnitToken("spacing/1x"),
    /** 轻提示单行整体高 32 */
    messageHeight,
    /** 警告单行整体高 36；有辅助时不锁高，复用由此推导的 pad */
    alertHeight,
    alertPadBlockWithDescription: feedbackDerivedPadBlock(alertHeight, lineHeight),
  };
}

export function resolveFeedbackIconColor(type: MessageType): string {
  return getColorToken(ICON_COLOR[type]);
}

export function resolveAlertSurface(type: AlertType): {
  background: string;
  borderColor: string;
} {
  const surface = ALERT_SURFACE[type];
  return {
    background: getColorToken(surface.background),
    borderColor: getColorToken(surface.border),
  };
}

export function feedbackTitleColor(): string {
  return tokenRgba("text-color-transparent", 0.9);
}

export function feedbackDescriptionColor(): string {
  return tokenRgba("text-sub-color-transparent", 0.58);
}

export function feedbackCloseColor(): string {
  return getColorToken("icon-color-transparent");
}

export function FeedbackStatusIcon({
  type,
  color,
  size,
}: {
  type: MessageType;
  color: string;
  size: number;
}) {
  const style: CSSProperties = { fontSize: size, color };
  if (type === "loading") {
    return <LoadingOutlined spin style={style} aria-hidden />;
  }
  return <SensIcon name={FEEDBACK_ICON[type]} size={size} color={color} />;
}

/** 轻提示：整体高 `size/component-height/m`（32），内容垂直居中 */
export function messageContainerStyle(): CSSProperties {
  const t = feedbackLayoutTokens();
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: t.gap,
    boxSizing: "border-box",
    maxWidth: "100%",
    height: t.messageHeight,
    paddingInline: t.padInline,
    borderRadius: t.radius,
    background: getColorToken("white"),
    boxShadow: buildShadowD4(),
  };
}

/** 警告：单行锁 `size/component-height/l`（36）；有辅助文案 hug + 公式 pad */
export function alertContainerStyle(
  type: AlertType,
  options?: { withDescription?: boolean },
): CSSProperties {
  const t = feedbackLayoutTokens();
  const surface = resolveAlertSurface(type);
  const withDescription = Boolean(options?.withDescription);
  return {
    display: "flex",
    alignItems: withDescription ? "flex-start" : "center",
    gap: t.gap,
    boxSizing: "border-box",
    width: "100%",
    ...(withDescription
      ? { padding: `${t.alertPadBlockWithDescription}px ${t.padInline}px` }
      : { height: t.alertHeight, paddingInline: t.padInline }),
    borderRadius: t.radius,
    background: surface.background,
    border: `1px solid ${surface.borderColor}`,
  };
}

export function feedbackTextBlockStyle(options?: {
  description?: boolean;
}): CSSProperties {
  const t = feedbackLayoutTokens();
  return {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: options?.description ? t.descriptionGap : 0,
    fontSize: t.fontSize,
    lineHeight: `${t.lineHeight}px`,
  };
}

export type FeedbackCloseButtonProps = {
  onClose?: () => void;
  label?: string;
};

export function FeedbackCloseButton({ onClose, label = "关闭" }: FeedbackCloseButtonProps) {
  const t = feedbackLayoutTokens();
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClose}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        margin: 0,
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        flexShrink: 0,
        lineHeight: 0,
      }}
    >
      <SensIcon name="close" size={t.iconSize} color={feedbackCloseColor()} />
    </button>
  );
}

export function FeedbackLinkSlot({ children }: { children?: ReactNode }) {
  if (children == null || children === false) return null;
  return (
    <span style={{ flexShrink: 0, display: "inline-flex", alignItems: "center" }}>{children}</span>
  );
}
