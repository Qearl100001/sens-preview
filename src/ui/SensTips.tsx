import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { createPortal } from "react-dom";
import { getColorToken, tokenRgba } from "../design-system/color-utils";
import { getTypographyToken } from "../design-system/typography";
import { getUnitToken } from "../design-system/unit";
import "./tips.css";

export type SensTipsPlacement = "top" | "bottom" | "left" | "right";

/** 箭头在气泡边上的对齐：组成 12 向（上左…右下） */
export type SensTipsAlign = "start" | "center" | "end";

/** 箭头指向深度（Figma 三角 16×6 的短边）；组件契约 */
export const SENS_TIPS_ARROW_DEPTH = 6;

/** 箭头横向展开（Figma 三角 16×6 的长边）；组件契约 */
export const SENS_TIPS_ARROW_CROSS_SIZE = 16;

/**
 * 边对齐时三角距气泡圆角一侧的空隙（Figma：上下槽 28=6+16+6；左右槽 22=6+16）。
 * 左上/左下/右上/右下均有，避免三角与气泡顶/底连成一体。
 */
export const SENS_TIPS_ARROW_EDGE_GAP = 6;

/**
 * 上下边对齐时箭头槽宽（Figma 28 = 6+16+6）；槽贴气泡边，三角在槽内居中 → 尖端距边 14。
 */
export const SENS_TIPS_ARROW_EDGE_SLOT_INLINE =
  SENS_TIPS_ARROW_CROSS_SIZE + 2 * SENS_TIPS_ARROW_EDGE_GAP;

/**
 * 左右边对齐时箭头槽高（Figma 22 = 6+16）；三角距角 6 → 尖端距边 14。
 */
export const SENS_TIPS_ARROW_EDGE_SLOT_BLOCK =
  SENS_TIPS_ARROW_CROSS_SIZE + SENS_TIPS_ARROW_EDGE_GAP;

/** 上下边对齐：尖端距气泡边（= 槽宽/2 = 14） */
export const SENS_TIPS_ARROW_EDGE_INSET_INLINE = SENS_TIPS_ARROW_EDGE_SLOT_INLINE / 2;

/** 左右边对齐：尖端距气泡边（= 角空隙 6 + 展开/2 = 14） */
export const SENS_TIPS_ARROW_EDGE_INSET_BLOCK =
  SENS_TIPS_ARROW_EDGE_GAP + SENS_TIPS_ARROW_CROSS_SIZE / 2;

/** 便签相对触发源的间距（不含箭头） */
export const SENS_TIPS_GAP = getUnitToken("spacing/1x");

/** 便签相对触发源的偏移 = gap + 箭头深度（portal 定位用） */
export const SENS_TIPS_OFFSET = SENS_TIPS_GAP + SENS_TIPS_ARROW_DEPTH;

/** 悬停出现延迟（ms）；专档 0.1s */
export const SENS_TIPS_ENTER_DELAY_MS = 100;

/** 桥接 trigger 与 portal 浮层热区，保证鼠标能进入便签选中文案 */
export const SENS_TIPS_LEAVE_GRACE_MS = 80;

/** 浮层层级；组件契约，暂不升全局 z-index token */
export const SENS_TIPS_Z_INDEX = 1060;

/** 最大宽度（Figma `6613:32568` / `6613:32687` 外框 300）；不足则随文案变窄 */
export const SENS_TIPS_MAX_WIDTH = 300;

/** 触发源宽 ≥ 此值时按前/中/后 1/3 就近对齐（与最大宽同值，组件契约） */
export const SENS_TIPS_WIDE_TRIGGER = 300;

/** 自动避让试探顺序（优先于调用方 placement 装不下时） */
export const SENS_TIPS_FLIP_ORDER: SensTipsPlacement[] = ["top", "left", "right", "bottom"];

/** 视口避让边距（px）；贴边时提前换向，组件契约 */
export const SENS_TIPS_VIEWPORT_MARGIN = 8;

/** 正文最大行数；超出内滚（10.5 × line-height/m ≈ 231） */
export const SENS_TIPS_MAX_LINES = 10.5;

/** 滚动条拇指宽；组件契约（Figma 6） */
export const SENS_TIPS_SCROLLBAR_SIZE = 6;

/**
 * Figma `1172:218` 三角 path（viewBox 0 0 16 6，尖朝下）。
 * 软肩曲线；不落 raster 资源，fill 走 currentColor → tooltip-background。
 */
export const SENS_TIPS_ARROW_PATH =
  "M3.46777 1.70906L5.83264 4.93184C6.87773 6.35605 9.12227 6.35606 10.1674 4.93184L12.5322 1.70906C13.3173 0.639184 14.6142 0 16 0H0C1.38576 0 2.6827 0.639182 3.46777 1.70906Z";

export type SensTipsProps = {
  /** 便签正文；常规便签仅纯文案 */
  title: ReactNode;
  /** 触发源；需为单个可承接事件的 React 元素 */
  children: ReactElement;
  placement?: SensTipsPlacement;
  /** 箭头在边上的对齐；默认 center；与 placement 组成 12 向 */
  align?: SensTipsAlign;
  /** 受控显隐；矩阵静态样张用 `open` */
  open?: boolean;
  defaultOpen?: boolean;
  /** 悬停出现延迟，默认 100ms */
  mouseEnterDelay?: number;
  /**
   * `portal`：挂到 body，fixed 跟随（默认，Demo 悬停用）。
   * `anchored`：相对触发源 absolute（矩阵静态样张用，避免布局变化后跑偏）。
   */
  strategy?: "portal" | "anchored";
  /**
   * 是否自动避让 + 宽触发源分段对齐；默认 true。
   * 仅 `portal` 生效；矩阵 `anchored` 忽略。
   */
  autoAdjust?: boolean;
  className?: string;
  style?: CSSProperties;
};

export function buildSensTipsTokenVars(): CSSProperties {
  return {
    "--sens-tips-bg": getColorToken("tooltip-background"),
    "--sens-tips-color": getColorToken("white"),
    "--sens-tips-radius": `${getUnitToken("radius/m")}px`,
    "--sens-tips-padding-block": `${getUnitToken("spacing/vertical/1.5x")}px`,
    "--sens-tips-padding-inline": `${getUnitToken("spacing/horizontal/2.5x")}px`,
    "--sens-tips-font-size": `${getTypographyToken("font-size/m")}px`,
    "--sens-tips-line-height": `${getTypographyToken("line-height/m")}px`,
    "--sens-tips-max-width": `${SENS_TIPS_MAX_WIDTH}px`,
    "--sens-tips-max-lines": String(SENS_TIPS_MAX_LINES),
    "--sens-tips-scrollbar-thumb": tokenRgba("white", 0.8),
    "--sens-tips-scrollbar-size": `${SENS_TIPS_SCROLLBAR_SIZE}px`,
    "--sens-tips-scrollbar-radius": `${getUnitToken("radius/s")}px`,
    "--sens-tips-arrow-depth": `${SENS_TIPS_ARROW_DEPTH}px`,
    "--sens-tips-arrow-cross": `${SENS_TIPS_ARROW_CROSS_SIZE}px`,
    "--sens-tips-arrow-edge-slot-inline": `${SENS_TIPS_ARROW_EDGE_SLOT_INLINE}px`,
    "--sens-tips-arrow-edge-slot-block": `${SENS_TIPS_ARROW_EDGE_SLOT_BLOCK}px`,
    "--sens-tips-arrow-edge-gap": `${SENS_TIPS_ARROW_EDGE_GAP}px`,
    "--sens-tips-arrow-edge-inset-inline": `${SENS_TIPS_ARROW_EDGE_INSET_INLINE}px`,
    "--sens-tips-arrow-edge-inset-block": `${SENS_TIPS_ARROW_EDGE_INSET_BLOCK}px`,
    "--sens-tips-gap": `${SENS_TIPS_GAP}px`,
    "--sens-tips-z-index": String(SENS_TIPS_Z_INDEX),
    "--sens-tips-demo-label-color": getColorToken("text-sub-color-transparent"),
    "--sens-tips-demo-label-size": `${getTypographyToken("font-size/s")}px`,
    "--sens-tips-demo-label-line": `${getTypographyToken("line-height/s")}px`,
    "--sens-tips-demo-gap-xl": `${getUnitToken("spacing/6x")}px`,
    "--sens-tips-demo-gap-l": `${getUnitToken("spacing/4x")}px`,
    "--sens-tips-demo-gap-m": `${getUnitToken("spacing/3x")}px`,
    "--sens-tips-demo-gap-s": `${getUnitToken("spacing/1x")}px`,
    "--sens-tips-demo-matrix-row-gap": `${getUnitToken("spacing/vertical/10x")}px`,
    "--sens-tips-demo-matrix-col-gap": `${getUnitToken("spacing/horizontal/6x")}px`,
    "--sens-tips-demo-trigger-padding-block": `${getUnitToken("spacing/vertical/1x")}px`,
    "--sens-tips-demo-trigger-padding-inline": `${getUnitToken("spacing/horizontal/2x")}px`,
  } as CSSProperties;
}

type PopupCoords = { top: number; left: number };

type PopupSize = { width: number; height: number };

/** 尖端相对弹层交叉轴起点的偏移（用于对准触发源中心） */
function tipCrossOffset(popupCrossSize: number, align: SensTipsAlign, axis: "inline" | "block"): number {
  if (align === "center") return popupCrossSize / 2;
  const inset =
    axis === "inline" ? SENS_TIPS_ARROW_EDGE_INSET_INLINE : SENS_TIPS_ARROW_EDGE_INSET_BLOCK;
  return align === "start" ? inset : popupCrossSize - inset;
}

function outerSizeForPlacement(
  placement: SensTipsPlacement,
  content: PopupSize,
): PopupSize {
  if (placement === "left" || placement === "right") {
    return {
      width: content.width + SENS_TIPS_ARROW_DEPTH,
      height: content.height,
    };
  }
  return {
    width: content.width,
    height: content.height + SENS_TIPS_ARROW_DEPTH,
  };
}

function computePopupPosition(
  trigger: DOMRect,
  popup: PopupSize,
  placement: SensTipsPlacement,
  align: SensTipsAlign,
): PopupCoords {
  const gap = SENS_TIPS_OFFSET;
  const triggerCenterX = trigger.left + trigger.width / 2;
  const triggerCenterY = trigger.top + trigger.height / 2;

  switch (placement) {
    case "bottom":
      return {
        top: trigger.bottom + gap - SENS_TIPS_ARROW_DEPTH,
        left: triggerCenterX - tipCrossOffset(popup.width, align, "inline"),
      };
    case "left":
      return {
        top: triggerCenterY - tipCrossOffset(popup.height, align, "block"),
        left: trigger.left - gap - popup.width + SENS_TIPS_ARROW_DEPTH,
      };
    case "right":
      return {
        top: triggerCenterY - tipCrossOffset(popup.height, align, "block"),
        left: trigger.right + gap - SENS_TIPS_ARROW_DEPTH,
      };
    case "top":
    default:
      return {
        top: trigger.top - gap - popup.height + SENS_TIPS_ARROW_DEPTH,
        left: triggerCenterX - tipCrossOffset(popup.width, align, "inline"),
      };
  }
}

function fitsViewport(coords: PopupCoords, size: PopupSize, margin = SENS_TIPS_VIEWPORT_MARGIN): boolean {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return (
    coords.left >= margin &&
    coords.top >= margin &&
    coords.left + size.width <= vw - margin &&
    coords.top + size.height <= vh - margin
  );
}

/** 先试 preferred，再按 上 > 左 > 右 > 下 */
function pickPlacement(
  preferred: SensTipsPlacement,
  trigger: DOMRect,
  content: PopupSize,
  align: SensTipsAlign,
): SensTipsPlacement {
  const order: SensTipsPlacement[] = [
    preferred,
    ...SENS_TIPS_FLIP_ORDER.filter((item) => item !== preferred),
  ];
  for (const candidate of order) {
    const size = outerSizeForPlacement(candidate, content);
    const coords = computePopupPosition(trigger, size, candidate, align);
    if (fitsViewport(coords, size)) return candidate;
  }
  return preferred;
}

function alignFromPointer(
  trigger: DOMRect,
  placement: SensTipsPlacement,
  clientX: number,
  clientY: number,
): SensTipsAlign {
  const ratio =
    placement === "left" || placement === "right"
      ? (clientY - trigger.top) / Math.max(trigger.height, 1)
      : (clientX - trigger.left) / Math.max(trigger.width, 1);
  if (ratio < 1 / 3) return "start";
  if (ratio < 2 / 3) return "center";
  return "end";
}

function TipsArrow({
  placement,
  align,
}: {
  placement: SensTipsPlacement;
  align: SensTipsAlign;
}) {
  return (
    <span
      className={[
        "sens-tips-arrow",
        `sens-tips-arrow--${placement}`,
        `sens-tips-arrow--align-${align}`,
      ].join(" ")}
      aria-hidden
    >
      <span className="sens-tips-arrow-tip">
        <svg
          className="sens-tips-arrow-svg"
          width={SENS_TIPS_ARROW_CROSS_SIZE}
          height={SENS_TIPS_ARROW_DEPTH}
          viewBox="0 0 16 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          focusable="false"
        >
          <path d={SENS_TIPS_ARROW_PATH} fill="currentColor" />
        </svg>
      </span>
    </span>
  );
}

/**
 * 便签 Tips（常规）：深底白字 + 箭头，悬停/聚焦出现。
 * Sens 自持浮层；高级便签不在本组件范围。
 */
export function SensTips({
  title,
  children,
  placement = "top",
  align = "center",
  open: openProp,
  defaultOpen = false,
  mouseEnterDelay = SENS_TIPS_ENTER_DELAY_MS,
  strategy = "portal",
  autoAdjust = true,
  className,
  style,
}: SensTipsProps) {
  const tipId = useId();
  const triggerRef = useRef<HTMLElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const enterTimerRef = useRef<number | null>(null);
  const leaveTimerRef = useRef<number | null>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [coords, setCoords] = useState<PopupCoords>({ top: -9999, left: -9999 });
  const [resolvedPlacement, setResolvedPlacement] = useState(placement);
  const [resolvedAlign, setResolvedAlign] = useState(align);
  const isControlled = openProp !== undefined;
  const open = isControlled ? Boolean(openProp) : uncontrolledOpen;
  const anchored = strategy === "anchored";
  const canAutoAdjust = autoAdjust && !anchored;

  const setOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
  };

  const clearEnterTimer = () => {
    if (enterTimerRef.current != null) {
      window.clearTimeout(enterTimerRef.current);
      enterTimerRef.current = null;
    }
  };

  const clearLeaveTimer = () => {
    if (leaveTimerRef.current != null) {
      window.clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  };

  const scheduleOpen = () => {
    clearEnterTimer();
    clearLeaveTimer();
    enterTimerRef.current = window.setTimeout(() => {
      setOpen(true);
      enterTimerRef.current = null;
    }, mouseEnterDelay);
  };

  const closeNow = () => {
    clearEnterTimer();
    clearLeaveTimer();
    setOpen(false);
  };

  const scheduleClose = () => {
    clearEnterTimer();
    clearLeaveTimer();
    leaveTimerRef.current = window.setTimeout(() => {
      setOpen(false);
      leaveTimerRef.current = null;
    }, SENS_TIPS_LEAVE_GRACE_MS);
  };

  useEffect(
    () => () => {
      clearEnterTimer();
      clearLeaveTimer();
    },
    [],
  );

  useEffect(() => {
    if (!open) {
      setResolvedPlacement(placement);
      setResolvedAlign(align);
    }
  }, [open, placement, align]);

  useLayoutEffect(() => {
    if (!open || anchored) return;
    const triggerEl = triggerRef.current;
    const popupEl = popupRef.current;
    const contentEl = contentRef.current;
    if (!triggerEl || !popupEl || !contentEl) return;

    let frame = 0;
    let lastKey = "";

    const update = () => {
      const tr = triggerEl.getBoundingClientRect();
      const contentSize: PopupSize = {
        width: contentEl.offsetWidth,
        height: contentEl.offsetHeight,
      };

      let nextPlacement = placement;
      let nextAlign = align;

      if (canAutoAdjust) {
        const pointer = pointerRef.current;
        const wide = tr.width >= SENS_TIPS_WIDE_TRIGGER;
        if (wide && pointer) {
          nextAlign = alignFromPointer(tr, placement, pointer.x, pointer.y);
        }
        nextPlacement = pickPlacement(placement, tr, contentSize, nextAlign);
        if (wide && pointer) {
          nextAlign = alignFromPointer(tr, nextPlacement, pointer.x, pointer.y);
        }
      }

      const size = outerSizeForPlacement(nextPlacement, contentSize);
      const nextCoords = computePopupPosition(tr, size, nextPlacement, nextAlign);
      const key = [
        tr.top,
        tr.left,
        tr.width,
        tr.height,
        contentSize.width,
        contentSize.height,
        nextPlacement,
        nextAlign,
        nextCoords.top,
        nextCoords.left,
      ].join(",");
      if (key === lastKey) return;
      lastKey = key;
      setResolvedPlacement(nextPlacement);
      setResolvedAlign(nextAlign);
      setCoords(nextCoords);
    };

    const tick = () => {
      update();
      frame = window.requestAnimationFrame(tick);
    };

    update();
    frame = window.requestAnimationFrame(tick);
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, placement, align, title, anchored, canAutoAdjust]);

  if (!isValidElement(children)) {
    return children;
  }

  const child = children as ReactElement<{
    onMouseEnter?: (event: MouseEvent) => void;
    onMouseLeave?: (event: MouseEvent) => void;
    onMouseMove?: (event: MouseEvent) => void;
    onFocus?: (event: FocusEvent) => void;
    onBlur?: (event: FocusEvent) => void;
    "aria-describedby"?: string;
    ref?: Ref<HTMLElement>;
  }>;

  const recordPointer = (event: MouseEvent) => {
    pointerRef.current = { x: event.clientX, y: event.clientY };
  };

  const trigger = cloneElement(child, {
    ref: (node: HTMLElement | null) => {
      triggerRef.current = node;
      const { ref } = child as { ref?: Ref<HTMLElement> | undefined };
      if (typeof ref === "function") ref(node);
      else if (ref && typeof ref === "object") {
        (ref as { current: HTMLElement | null }).current = node;
      }
    },
    "aria-describedby": open ? tipId : child.props["aria-describedby"],
    onMouseEnter: (event: MouseEvent) => {
      child.props.onMouseEnter?.(event);
      recordPointer(event);
      if (!isControlled) scheduleOpen();
    },
    onMouseMove: (event: MouseEvent) => {
      child.props.onMouseMove?.(event);
      recordPointer(event);
    },
    onMouseLeave: (event: MouseEvent) => {
      child.props.onMouseLeave?.(event);
      if (!isControlled) scheduleClose();
    },
    onFocus: (event: FocusEvent) => {
      child.props.onFocus?.(event);
      pointerRef.current = null;
      if (!isControlled) scheduleOpen();
    },
    onBlur: (event: FocusEvent) => {
      child.props.onBlur?.(event);
      if (!isControlled) closeNow();
    },
  });

  const activePlacement = anchored ? placement : resolvedPlacement;
  const activeAlign = anchored ? align : resolvedAlign;

  const popupNode =
    open ? (
      <div
        ref={popupRef}
        id={tipId}
        role="tooltip"
        className={[
          "sens-tips-popup",
          `sens-tips-popup--${activePlacement}`,
          `sens-tips-popup--align-${activeAlign}`,
          anchored ? "sens-tips-popup--anchored" : "sens-tips-popup--portal",
        ].join(" ")}
        onMouseEnter={() => {
          if (!isControlled) clearLeaveTimer();
        }}
        onMouseLeave={() => {
          if (!isControlled) scheduleClose();
        }}
        style={{
          ...buildSensTipsTokenVars(),
          ...(anchored ? {} : { top: coords.top, left: coords.left }),
          ...style,
        }}
      >
        <div ref={contentRef} className="sens-tips-content">
          {title}
        </div>
        <TipsArrow placement={activePlacement} align={activeAlign} />
      </div>
    ) : null;

  const popup =
    popupNode && !anchored && typeof document !== "undefined"
      ? createPortal(popupNode, document.body)
      : popupNode;

  return (
    <span className={["sens-tips-trigger", className].filter(Boolean).join(" ")}>
      {trigger}
      {popup}
    </span>
  );
}

type MatrixItem = {
  placement: SensTipsPlacement;
  align: SensTipsAlign;
  label: string;
};

const MATRIX_ITEMS: MatrixItem[] = [
  { placement: "top", align: "start", label: "上左" },
  { placement: "top", align: "center", label: "上中" },
  { placement: "top", align: "end", label: "上右" },
  { placement: "bottom", align: "start", label: "下左" },
  { placement: "bottom", align: "center", label: "下中" },
  { placement: "bottom", align: "end", label: "下右" },
  { placement: "left", align: "start", label: "左上" },
  { placement: "left", align: "center", label: "左中" },
  { placement: "left", align: "end", label: "左下" },
  { placement: "right", align: "start", label: "右上" },
  { placement: "right", align: "center", label: "右中" },
  { placement: "right", align: "end", label: "右下" },
];

/** 状态矩阵：12 向静态展开（受控 open + anchored，避免文档栏布局变化后跑偏） */
export function TipsStatesPreview() {
  return (
    <div className="sens-tips-matrix" style={buildSensTipsTokenVars()}>
      {MATRIX_ITEMS.map((item) => (
        <div key={item.label} className="sens-tips-matrix-cell">
          <SensTips
            title="这是一段帮助信息"
            placement={item.placement}
            align={item.align}
            open
            strategy="anchored"
          >
            <button type="button" className="sens-cursor-default sens-tips-matrix-trigger">
              {item.label}
            </button>
          </SensTips>
          <span className="sens-tips-matrix-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
