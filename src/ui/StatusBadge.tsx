import { Space } from "antd";
import { getColorToken } from "../design-system/color-utils";

export type RunStatus = "running" | "stopped" | "failed";

const STATUS_LABEL: Record<RunStatus, string> = {
  running: "正常运行",
  stopped: "停止运行",
  failed: "运行失败",
};

/** 状态圆点色：状态色 / 失效中性，与 SensTag 状态圆点同一批 handle */
const STATUS_DOT_TOKEN: Record<RunStatus, string> = {
  running: "success-color",
  stopped: "text-color-disable",
  failed: "warning-color",
};

export interface StatusBadgeProps {
  status: RunStatus;
}

/** 运行状态：圆点 + 文案（颜色直读 design token） */
export function StatusBadge({ status }: StatusBadgeProps) {
  const dotColor = getColorToken(STATUS_DOT_TOKEN[status]);

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
      <span style={{ fontSize: 14, lineHeight: "22px", color: getColorToken("text-color") }}>
        {STATUS_LABEL[status]}
      </span>
    </Space>
  );
}
