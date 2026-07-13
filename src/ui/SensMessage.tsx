import type { CSSProperties, ReactNode } from "react";
import { Space, Typography } from "antd";
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
import { SensButton } from "./SensButton";

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
                    <SensButton tone="link" size="small">
                      查看详情
                    </SensButton>
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
