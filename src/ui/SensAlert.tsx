import type { CSSProperties, ReactNode } from "react";
import { Space, Typography } from "antd";
import {
  ALERT_TYPE_LABEL,
  FeedbackCloseButton,
  FeedbackLinkSlot,
  FeedbackStatusIcon,
  alertContainerStyle,
  feedbackDescriptionColor,
  feedbackLayoutTokens,
  feedbackTextBlockStyle,
  feedbackTitleColor,
  resolveFeedbackIconColor,
  type AlertType,
} from "./feedbackShared";
import { SensButton } from "./SensButton";

export type { AlertType } from "./feedbackShared";
export { ALERT_TYPE_LABEL } from "./feedbackShared";

export type SensAlertProps = {
  type?: AlertType;
  description?: ReactNode;
  closable?: boolean;
  link?: ReactNode;
  onClose?: () => void;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/**
 * 警告 Alert：语义浅底 + 浅描边页内条。
 * type 四档（无 loading）；状态色不换肤。
 */
export function SensAlert({
  type = "default",
  description,
  closable = false,
  link,
  onClose,
  children,
  className,
  style,
}: SensAlertProps) {
  const t = feedbackLayoutTokens();
  const iconColor = resolveFeedbackIconColor(type);
  const hasDescription = description != null && description !== false && description !== "";

  return (
    <div
      role="alert"
      className={className}
      style={{
        ...alertContainerStyle(type, { withDescription: hasDescription }),
        ...style,
      }}
    >
      <span
        style={{
          display: "inline-flex",
          flexShrink: 0,
          lineHeight: 0,
          marginTop: hasDescription ? Math.max(0, (t.lineHeight - t.iconSize) / 2) : 0,
        }}
      >
        <FeedbackStatusIcon type={type} color={iconColor} size={t.iconSize} />
      </span>
      <div style={feedbackTextBlockStyle({ description: hasDescription })}>
        <span
          style={{
            color: feedbackTitleColor(),
            fontSize: t.fontSize,
            lineHeight: `${t.lineHeight}px`,
          }}
        >
          {children}
        </span>
        {hasDescription ? (
          <span
            style={{
              color: feedbackDescriptionColor(),
              fontSize: t.descriptionFontSize,
              lineHeight: `${t.descriptionLineHeight}px`,
            }}
          >
            {description}
          </span>
        ) : null}
      </div>
      <FeedbackLinkSlot>{link}</FeedbackLinkSlot>
      {closable ? <FeedbackCloseButton onClose={onClose} /> : null}
    </div>
  );
}

const MATRIX_TYPES: AlertType[] = ["default", "success", "info", "warning"];

/** 预览矩阵：type × 基础 / +辅助 / +关闭 / +链接 */
export function AlertTypesPreview() {
  const { Text } = Typography;
  return (
    <Space direction="vertical" size="large" style={{ width: "100%", maxWidth: 480 }}>
      {(
        [
          { key: "基础", description: false, closable: false, link: false },
          { key: "辅助文案", description: true, closable: false, link: false },
          { key: "可关闭", description: false, closable: true, link: false },
          { key: "带链接", description: false, closable: false, link: true },
        ] as const
      ).map((row) => (
        <Space key={row.key} direction="vertical" size="small" style={{ width: "100%" }}>
          <Text type="secondary">{row.key}</Text>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            {MATRIX_TYPES.map((type) => (
              <SensAlert
                key={`${row.key}-${type}`}
                type={type}
                closable={row.closable}
                description={row.description ? "这是辅助说明文案，用于补充标题信息。" : undefined}
                link={
                  row.link ? (
                    <SensButton tone="link" size="small">
                      查看详情
                    </SensButton>
                  ) : undefined
                }
              >
                {ALERT_TYPE_LABEL[type]}提示标题
              </SensAlert>
            ))}
          </Space>
        </Space>
      ))}
    </Space>
  );
}
