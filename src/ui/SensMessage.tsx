import { useState, type CSSProperties, type ReactNode } from "react";
import { Space, Typography } from "antd";
import { getColorToken } from "../design-system/color-utils";
import { sensCursorValue } from "../design-system/cursors";
import {
  FeedbackCloseButton,
  FeedbackLinkSlot,
  FeedbackStatusIcon,
  MESSAGE_TYPE_LABEL,
  feedbackLayoutTokens,
  feedbackTextBlockStyle,
  feedbackTitleColor,
  messageContainerStyle,
  resolveFeedbackIconColor,
  type MessageType,
} from "./feedbackShared";

export type { MessageType } from "./feedbackShared";
export { MESSAGE_TYPE_LABEL } from "./feedbackShared";

export type SensMessageProps = {
  type?: MessageType;
  closable?: boolean;
  link?: ReactNode;
  onClose?: () => void;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export type SensMessageLinkProps = {
  children?: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
};

function resolveMessageLinkColor(state: "default" | "hover" | "active") {
  if (state === "hover") return getColorToken("link-hover-color");
  if (state === "active") return getColorToken("link-active-color");
  return getColorToken("link-color");
}

/**
 * 轻提示内的链接按钮（常规）：Figma 1363:11431。
 * 纯文字 14/22，0 padding；不是 antd Button / 三级按钮。
 */
export function SensMessageLink({
  children,
  href,
  onClick,
  className,
  style,
  "aria-label": ariaLabel,
}: SensMessageLinkProps) {
  const t = feedbackLayoutTokens();
  const [state, setState] = useState<"default" | "hover" | "active">("default");
  const linkStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    height: t.lineHeight,
    margin: 0,
    padding: 0,
    border: "none",
    background: "transparent",
    color: resolveMessageLinkColor(state),
    font: "inherit",
    fontSize: t.fontSize,
    lineHeight: `${t.lineHeight}px`,
    textDecoration: "none",
    whiteSpace: "nowrap",
    cursor: sensCursorValue("pointer"),
    ...style,
  };

  const interactiveProps = {
    className,
    style: linkStyle,
    "aria-label": ariaLabel,
    onMouseEnter: () => setState("hover" as const),
    onMouseLeave: () => setState("default" as const),
    onMouseDown: () => setState("active" as const),
    onMouseUp: () => setState("hover" as const),
    onFocus: () => setState("hover" as const),
    onBlur: () => setState("default" as const),
  };

  if (href) {
    return (
      <a href={href} onClick={onClick} {...interactiveProps}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} {...interactiveProps}>
      {children}
    </button>
  );
}

/**
 * 轻提示 Message：白底 + D4↓ 浮层短反馈。
 * type 五档含 loading；状态色不换肤。
 */
export function SensMessage({
  type = "default",
  closable = false,
  link,
  onClose,
  children,
  className,
  style,
}: SensMessageProps) {
  const t = feedbackLayoutTokens();
  const iconColor = resolveFeedbackIconColor(type);

  return (
    <div
      role="status"
      className={className}
      style={{ ...messageContainerStyle(), ...style }}
    >
      <span style={{ display: "inline-flex", flexShrink: 0, lineHeight: 0 }}>
        <FeedbackStatusIcon type={type} color={iconColor} size={t.iconSize} />
      </span>
      <div style={feedbackTextBlockStyle()}>
        <span
          style={{
            color: feedbackTitleColor(),
            fontSize: t.fontSize,
            lineHeight: `${t.lineHeight}px`,
          }}
        >
          {children}
        </span>
      </div>
      <FeedbackLinkSlot>{link}</FeedbackLinkSlot>
      {closable ? <FeedbackCloseButton onClose={onClose} /> : null}
    </div>
  );
}

const MATRIX_TYPES: MessageType[] = ["default", "success", "info", "warning", "loading"];

/** 预览矩阵：type × 基础 / +关闭 / +链接 */
export function MessageTypesPreview() {
  const { Text } = Typography;
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {(["基础", "可关闭", "带链接"] as const).map((row) => (
        <Space key={row} direction="vertical" size="small" style={{ width: "100%" }}>
          <Text type="secondary">{row}</Text>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            {MATRIX_TYPES.map((type) => (
              <SensMessage
                key={`${row}-${type}`}
                type={type}
                closable={row === "可关闭"}
                link={
                  row === "带链接" ? (
                    <SensMessageLink>查看详情</SensMessageLink>
                  ) : undefined
                }
              >
                {MESSAGE_TYPE_LABEL[type]}提示文案
              </SensMessage>
            ))}
          </Space>
        </Space>
      ))}
    </Space>
  );
}
