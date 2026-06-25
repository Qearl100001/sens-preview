import { Space, theme } from "antd";

export type RunStatus = "running" | "stopped" | "failed";

const STATUS_LABEL: Record<RunStatus, string> = {
  running: "正常运行",
  stopped: "停止运行",
  failed: "运行失败",
};

export interface StatusBadgeProps {
  status: RunStatus;
}

/** 运行状态：圆点 + 文案（颜色走 theme token） */
export function StatusBadge({ status }: StatusBadgeProps) {
  const { token } = theme.useToken();
  const dotColor =
    status === "running"
      ? token.colorSuccess
      : status === "failed"
        ? token.colorError
        : token.colorTextTertiary;

  return (
    <Space size={8} align="center">
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: dotColor,
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: 14, lineHeight: "22px", color: token.colorText }}>
        {STATUS_LABEL[status]}
      </span>
    </Space>
  );
}
