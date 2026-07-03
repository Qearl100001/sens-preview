import { getColorToken, tokenRgba } from "../../design-system/color-utils";
import { getTypographyToken } from "../../design-system/typography";
import tokens from "../../design-system/tokens.resolved.json";
import type { ConnectionStatus, ConnectionStatusSpec } from "./dataSourceTypes";

const u = tokens.unit as Record<string, number>;
const STATUS_DOT_SIZE = u["size/mini"] - 2;

export interface ConnectionStatusBadgeProps {
  status: ConnectionStatus;
  statuses: ConnectionStatusSpec[];
}

/** 连接启用/停用：圆点 + 文案（对齐 scene 表格状态列） */
export function ConnectionStatusBadge({ status, statuses }: ConnectionStatusBadgeProps) {
  const statusSpec = statuses.find((item) => item.value === status);
  const dotColor =
    statusSpec?.tone === "success"
      ? getColorToken("success-color")
      : tokenRgba("icon-color-transparent", 0.58);
  const textColor = tokenRgba("text-sub-color-transparent", 0.58);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: u["spacing/1x"] }}>
      <span
        aria-hidden
        style={{
          width: STATUS_DOT_SIZE,
          height: STATUS_DOT_SIZE,
          borderRadius: "50%",
          background: dotColor,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: getTypographyToken("font-size/m"),
          lineHeight: `${getTypographyToken("line-height/m")}px`,
          color: textColor,
        }}
      >
        {statusSpec?.label ?? status}
      </span>
    </div>
  );
}
