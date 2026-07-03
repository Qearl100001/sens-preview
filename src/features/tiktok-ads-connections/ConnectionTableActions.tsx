import { tokenRgba } from "../../design-system/color-utils";
import { getTypographyToken } from "../../design-system/typography";
import tokens from "../../design-system/tokens.resolved.json";
import { LinkButton } from "../../ui";
import type { ConnectionActionSpec, ConnectionStatus } from "./dataSourceTypes";

const u = tokens.unit as Record<string, number>;

export interface ConnectionTableActionsProps {
  status: ConnectionStatus;
  actions: ConnectionActionSpec[];
  onAction?: (action: ConnectionActionSpec) => void;
}

function getActionLabel(action: ConnectionActionSpec, status: ConnectionStatus): string {
  if (action.key !== "toggleStatus") return action.label;
  return status === "enabled"
    ? action.enabledLabel ?? action.label
    : action.disabledLabel ?? action.label;
}

/** 操作列：启用态删除禁用；停用态删除可点 */
export function ConnectionTableActions({ status, actions, onAction }: ConnectionTableActionsProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: u["spacing/4x"] }}>
      {actions.map((action) => {
        const disabled = action.disabledWhenStatus?.includes(status) ?? false;
        const label = getActionLabel(action, status);

        return disabled ? (
          <span
            key={action.key}
            style={{
              fontSize: getTypographyToken("font-size/m"),
              lineHeight: `${getTypographyToken("line-height/m")}px`,
              color: tokenRgba("text-color-transparent-disable", 0.3),
              cursor: "not-allowed",
            }}
          >
            {label}
          </span>
        ) : (
          <LinkButton key={action.key} onClick={() => onAction?.(action)}>
            {label}
          </LinkButton>
        );
      })}
    </div>
  );
}
