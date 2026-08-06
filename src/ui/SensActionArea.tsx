import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { getUnitToken } from "../design-system/unit";

export type SensActionAreaPlacement = "header" | "body" | "footer" | "floating";

export interface SensActionAreaProps extends HTMLAttributes<HTMLDivElement> {
  /** 宿主位置只影响排列方向和对齐；按钮语义、状态和收纳规则仍由 SensButton 承载。 */
  placement?: SensActionAreaPlacement;
  children?: ReactNode;
}

function mergeClassName(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

function resolvePlacementStyle(placement: SensActionAreaPlacement): CSSProperties {
  if (placement === "floating") {
    return {
      alignItems: "flex-end",
      flexDirection: "column",
      flexWrap: "nowrap",
      justifyContent: "flex-end",
    };
  }

  return {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: placement === "body" ? "flex-start" : "flex-end",
  };
}

/** 操作区薄布局容器：不等同 antd Button.Group，不改变子按钮自身状态。 */
export function SensActionArea({
  placement = "body",
  className,
  style,
  children,
  ...rootProps
}: SensActionAreaProps) {
  return (
    <div
      {...rootProps}
      className={mergeClassName("sens-action-area", `sens-action-area--${placement}`, className)}
      data-placement={placement}
      style={{
        display: "flex",
        minWidth: 0,
        gap: getUnitToken("spacing/horizontal/4x"),
        ...resolvePlacementStyle(placement),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
