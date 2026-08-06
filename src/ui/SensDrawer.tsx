import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  type TransitionEvent,
} from "react";
import tokens from "../design-system/tokens.resolved.json";
import { buildDrawerShadow, getColorToken } from "../design-system/color-utils";
import { sensCursorValue } from "../design-system/cursors";
import { getUnitToken } from "../design-system/unit";

const u = tokens.unit as Record<string, number>;

export type SensDrawerSize = "small" | "medium" | "large";

/**
 * 1440 基宽对照值（Figma 30% / 60% / 80%）。
 * 运行时宽度为比例动态：`clamp(min@1440, Nvw, max@1920)`。
 * 比例动态宽属布局机制，不进 semantic-unit 生成链路；本常量为组件契约 Ready。
 */
export const SENS_DRAWER_WIDTH: Record<SensDrawerSize, number> = {
  small: 432,
  medium: 864,
  large: 1152,
};

/** Figma 宽度系数；视口介于 1440～1920 时随屏宽变化 */
export const SENS_DRAWER_WIDTH_RATIO: Record<SensDrawerSize, number> = {
  small: 0.3,
  medium: 0.6,
  large: 0.8,
};

/** 宽度 clamp 视口下界 / 上界（px） */
export const SENS_DRAWER_VIEWPORT_MIN = 1440;
export const SENS_DRAWER_VIEWPORT_MAX = 1920;

/** 抽屉浮层层级（组件契约；暂不升全局 z-index token） */
export const SENS_DRAWER_Z_INDEX = 1000;

/** 开合动效时长（ms）；组件契约，暂不升 motion token */
export const SENS_DRAWER_MOTION_DURATION_MS = 240;

/** 开合缓入缓出；等价 CSS `ease-in-out` */
export const SENS_DRAWER_MOTION_EASING = "cubic-bezier(0.42, 0, 0.58, 1)";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function resolveMotionDurationMs(): number {
  return prefersReducedMotion() ? 0 : SENS_DRAWER_MOTION_DURATION_MS;
}

function buildDrawerWidthCss(size: SensDrawerSize): string {
  const ratio = SENS_DRAWER_WIDTH_RATIO[size];
  const minPx = Math.round(SENS_DRAWER_VIEWPORT_MIN * ratio);
  const maxPx = Math.round(SENS_DRAWER_VIEWPORT_MAX * ratio);
  const vw = `${ratio * 100}vw`;
  return `clamp(${minPx}px, ${vw}, ${maxPx}px)`;
}

const drawerTokens = {
  background: getColorToken("white"),
  /** 中性色/遮罩/01，token 自带 alpha，勿再 tokenRgba 二次压透明度 */
  mask: getColorToken("mask-01-transparent"),
  radius: u["radius/xl"],
  shadow: buildDrawerShadow("right"),
  bodyPaddingTop: u["spacing/4x"],
  bodyPaddingInline: u["spacing/6x"],
  bodyPaddingBottom: u["spacing/6x"],
  /** 面板距视口对侧最小留白：2 × spacing/horizontal/6x → maxWidth calc */
  edgeGap: getUnitToken("spacing/horizontal/6x") * 2,
  zIndex: SENS_DRAWER_Z_INDEX,
};

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface SensDrawerProps {
  open: boolean;
  titleBar: ReactNode;
  children: ReactNode;
  size?: SensDrawerSize;
  /** 有蒙层（默认）/ 无蒙层；无蒙层时点面板外仍关闭 */
  mask?: boolean;
  onClose?: () => void;
  className?: string;
  style?: CSSProperties;
  bodyStyle?: CSSProperties;
}

type TitleBarWithId = { titleId?: string };

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
  const panelRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const [rendered, setRendered] = useState(open);
  const [entered, setEntered] = useState(false);
  const [motionMs, setMotionMs] = useState(SENS_DRAWER_MOTION_DURATION_MS);
  /** 退场期间冻结 size，避免父级在 close 时改掉档位导致「先变大再滑出」 */
  const [displaySize, setDisplaySize] = useState(size);

  useEffect(() => {
    if (open) setDisplaySize(size);
  }, [open, size]);

  useEffect(() => {
    setMotionMs(resolveMotionDurationMs());
  }, [open, rendered]);

  useEffect(() => {
    if (open) {
      setRendered(true);
      const frame = window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setEntered(true));
      });
      return () => window.cancelAnimationFrame(frame);
    }
    setEntered(false);
    return undefined;
  }, [open]);

  useEffect(() => {
    if (open || !rendered || entered) return;
    if (motionMs === 0) {
      setRendered(false);
      return;
    }
    const timer = window.setTimeout(() => setRendered(false), motionMs + 32);
    return () => window.clearTimeout(timer);
  }, [open, rendered, entered, motionMs]);

  useEffect(() => {
    if (!rendered) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [rendered]);

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }, [open]);

  useEffect(() => {
    if (!open || !rendered) return;

    const focusFrame = window.requestAnimationFrame(() => {
      const panel = panelRef.current;
      const focusTarget =
        panel?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ?? panel ?? null;
      focusTarget?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      onClose?.();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, rendered, onClose]);

  useEffect(() => {
    if (rendered) return;
    const previous = previousFocusRef.current;
    previousFocusRef.current = null;
    if (previous && document.contains(previous)) {
      requestAnimationFrame(() => previous.focus());
    }
  }, [rendered]);

  const onPanelTransitionEnd = (event: TransitionEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.propertyName !== "transform") return;
    if (!open) setRendered(false);
  };

  if (!rendered) return null;

  const explicitTitleId =
    isValidElement(titleBar) && typeof (titleBar as ReactElement<TitleBarWithId>).props.titleId === "string"
      ? (titleBar as ReactElement<TitleBarWithId>).props.titleId
      : undefined;
  const labelledById = explicitTitleId ?? titleId;
  const titledBar =
    isValidElement(titleBar) && explicitTitleId == null
      ? cloneElement(titleBar as ReactElement<TitleBarWithId>, { titleId: labelledById })
      : titleBar;

  const transition =
    motionMs === 0 ? "none" : `${motionMs}ms ${SENS_DRAWER_MOTION_EASING}`;

  return (
    <div
      role="presentation"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: drawerTokens.zIndex,
        pointerEvents: "auto",
      }}
    >
      {/* 有蒙层：仅视觉遮罩，点蒙层不关闭（须返回/操作按钮）。无蒙层：透明点击层，点面板外关闭。 */}
      {mask ? (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            background: drawerTokens.mask,
            pointerEvents: "auto",
            opacity: entered ? 1 : 0,
            transition: transition === "none" ? "none" : `opacity ${transition}`,
          }}
        />
      ) : (
        <button
          type="button"
          aria-label="关闭抽屉"
          onClick={onClose}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: 0,
            padding: 0,
            margin: 0,
            background: "transparent",
            cursor: sensCursorValue("default"),
          }}
        />
      )}

      <section
        ref={panelRef}
        role="dialog"
        aria-modal={mask}
        aria-labelledby={labelledById}
        tabIndex={-1}
        className={className}
        onTransitionEnd={onPanelTransitionEnd}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: buildDrawerWidthCss(displaySize),
          maxWidth: `calc(100vw - ${drawerTokens.edgeGap}px)`,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxSizing: "border-box",
          background: drawerTokens.background,
          borderRadius: `${drawerTokens.radius}px 0 0 ${drawerTokens.radius}px`,
          boxShadow: drawerTokens.shadow,
          outline: "none",
          transform: entered ? "translateX(0)" : "translateX(100%)",
          transition: transition === "none" ? "none" : `transform ${transition}`,
          willChange: "transform",
          ...style,
        }}
      >
        {titledBar}
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
