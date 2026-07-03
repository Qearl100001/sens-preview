import type { CSSProperties, ReactNode } from "react";
import tokens from "../design-system/tokens.resolved.json";
import { buildDrawerShadow, getColorToken, tokenRgba } from "../design-system/color-utils";

const u = tokens.unit as Record<string, number>;

export type SensDrawerSize = "small" | "medium";

export const SENS_DRAWER_WIDTH: Record<SensDrawerSize, number> = {
  small: 432,
  medium: 864,
};

const drawerTokens = {
  background: getColorToken("white"),
  mask: tokenRgba("mask-01-transparent", 0.45),
  radius: u["radius/xl"],
  shadow: buildDrawerShadow("right"),
  bodyPaddingTop: u["spacing/4x"],
  bodyPaddingInline: u["spacing/6x"],
  bodyPaddingBottom: u["spacing/6x"],
};

export interface SensDrawerProps {
  open: boolean;
  titleBar: ReactNode;
  children: ReactNode;
  size?: SensDrawerSize;
  mask?: boolean;
  onClose?: () => void;
  className?: string;
  style?: CSSProperties;
  bodyStyle?: CSSProperties;
}

/** 右侧抽屉容器：标题区由 SensTitleBar 承担（含右侧操作），面板尺寸和投影遵循抽屉组件规则。 */
export function SensDrawer({
  open,
  titleBar,
  children,
  size = "medium",
  mask = true,
  onClose,
  className,
  style,
  bodyStyle,
}: SensDrawerProps) {
  if (!open) return null;

  return (
    <div
      role="presentation"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        pointerEvents: "auto",
      }}
    >
      {mask ? (
        <button
          type="button"
          aria-label="关闭抽屉遮罩"
          onClick={onClose}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: 0,
            padding: 0,
            margin: 0,
            background: drawerTokens.mask,
            cursor: "default",
          }}
        />
      ) : null}

      <section
        role="dialog"
        aria-modal={mask}
        className={className}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: SENS_DRAWER_WIDTH[size],
          maxWidth: "calc(100vw - 48px)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxSizing: "border-box",
          background: drawerTokens.background,
          borderRadius: `${drawerTokens.radius}px 0 0 ${drawerTokens.radius}px`,
          boxShadow: drawerTokens.shadow,
          ...style,
        }}
      >
        {titleBar}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "auto",
            boxSizing: "border-box",
            padding: `${drawerTokens.bodyPaddingTop}px ${drawerTokens.bodyPaddingInline}px ${drawerTokens.bodyPaddingBottom}px`,
            ...bodyStyle,
          }}
        >
          {children}
        </div>
      </section>
    </div>
  );
}
