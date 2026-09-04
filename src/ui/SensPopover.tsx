import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { buildShadow, buildShadowD4, getColorToken } from "../design-system/color-utils";
import { getDividerColor } from "../design-system/divider";
import { SensIcon } from "../design-system/icons";
import { getUnitToken } from "../design-system/unit";
import {
  SENS_TIPS_ARROW_CROSS_SIZE,
  SENS_TIPS_ARROW_DEPTH,
  SENS_TIPS_ARROW_EDGE_INSET_BLOCK,
  SENS_TIPS_ARROW_EDGE_INSET_INLINE,
} from "./SensTips";
import popoverArrow from "../assets/popover/popover-arrow.svg";
import "./popover.css";

export type SensPopoverPlacement = "top" | "bottom" | "left" | "right";
export type SensPopoverAlign = "start" | "center" | "end";
export type SensPopoverSize = "small" | "medium" | "large";
export type SensPopoverVariant = "browse" | "action" | "confirm";
export type SensPopoverStrategy = "portal" | "anchored";

const WIDTH_BY_SIZE: Record<SensPopoverSize, number> = { small: 360, medium: 560, large: 720 };
const GAP = getUnitToken("spacing/1x");
const VIEWPORT_MARGIN = getUnitToken("spacing/2x");
const Z_INDEX = 1060;
const PLACEMENT_FALLBACK_ORDER: SensPopoverPlacement[] = ["top", "left", "right", "bottom"];

type Coords = { top: number; left: number };
type PopupSize = { width: number; height: number };
type ScrollSnapshot = {
  top: number;
  left: number;
  parents: Array<{
    element: Element;
    scrollTop: number;
    scrollLeft: number;
  }>;
};

function findScrollParents(start: Element | null): Element[] {
  let cur: Element | null = start?.parentElement ?? null;
  const parents: Element[] = [];
  while (cur && cur !== document.body && cur !== document.documentElement) {
    const style = window.getComputedStyle(cur);
    const overflowY = style.overflowY;
    const overflowX = style.overflowX;
    const canScrollY =
      (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") &&
      cur.scrollHeight > cur.clientHeight + 1;
    const canScrollX =
      (overflowX === "auto" || overflowX === "scroll" || overflowX === "overlay") &&
      cur.scrollWidth > cur.clientWidth + 1;
    if (canScrollY || canScrollX) parents.push(cur);
    cur = cur.parentElement;
  }
  parents.push(document.scrollingElement ?? document.documentElement);
  return parents;
}

function tipCrossOffset(
  popupCrossSize: number,
  align: SensPopoverAlign,
  axis: "inline" | "block",
): number {
  if (align === "center") return popupCrossSize / 2;
  const inset = axis === "inline" ? SENS_TIPS_ARROW_EDGE_INSET_INLINE : SENS_TIPS_ARROW_EDGE_INSET_BLOCK;
  return align === "start" ? inset : popupCrossSize - inset;
}

export type SensPopoverProps = {
  children: ReactElement;
  title?: ReactNode;
  content: ReactNode;
  actions?: ReactNode;
  size?: SensPopoverSize;
  variant?: SensPopoverVariant;
  placement?: SensPopoverPlacement;
  align?: SensPopoverAlign;
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  autoAdjust?: boolean;
  /** `anchored` 仅供设计状态矩阵稳定展示 12 个箭头位；业务使用默认 portal。 */
  strategy?: SensPopoverStrategy;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  style?: CSSProperties;
};

function positionFor(
  trigger: DOMRect,
  popup: PopupSize,
  placement: SensPopoverPlacement,
  align: SensPopoverAlign,
): Coords {
  const horizontal = placement === "top" || placement === "bottom";
  const triggerCenter = horizontal
    ? trigger.left + trigger.width / 2
    : trigger.top + trigger.height / 2;
  const cross = triggerCenter - tipCrossOffset(
    horizontal ? popup.width : popup.height,
    align,
    horizontal ? "inline" : "block",
  );

  if (placement === "top") return { top: trigger.top - popup.height - GAP, left: cross };
  if (placement === "bottom") return { top: trigger.bottom + GAP, left: cross };
  if (placement === "left") return { top: cross, left: trigger.left - popup.width - GAP };
  return { top: cross, left: trigger.right + GAP };
}

function overflowFor(coords: Coords, popup: PopupSize): { horizontal: number; vertical: number } {
  return {
    horizontal: Math.max(0, VIEWPORT_MARGIN - coords.left) + Math.max(0, coords.left + popup.width - (window.innerWidth - VIEWPORT_MARGIN)),
    vertical: Math.max(0, VIEWPORT_MARGIN - coords.top) + Math.max(0, coords.top + popup.height - (window.innerHeight - VIEWPORT_MARGIN)),
  };
}

function clampCrossAxis(coords: Coords, popup: PopupSize, placement: SensPopoverPlacement): Coords {
  const clamp = (value: number, size: number, viewportSize: number) =>
    Math.max(VIEWPORT_MARGIN, Math.min(value, viewportSize - size - VIEWPORT_MARGIN));
  if (placement === "top" || placement === "bottom") {
    return { top: coords.top, left: clamp(coords.left, popup.width, window.innerWidth) };
  }
  return { top: clamp(coords.top, popup.height, window.innerHeight), left: coords.left };
}

function outerSizeFor(placement: SensPopoverPlacement, card: DOMRect): PopupSize {
  const arrow = SENS_TIPS_ARROW_DEPTH;
  return placement === "top" || placement === "bottom"
    ? { width: card.width, height: card.height + arrow }
    : { width: card.width + arrow, height: card.height };
}

function pickPlacement(
  preferred: SensPopoverPlacement,
  trigger: DOMRect,
  card: DOMRect,
  align: SensPopoverAlign,
): { placement: SensPopoverPlacement; coords: Coords; size: PopupSize } {
  const candidates = [preferred, ...PLACEMENT_FALLBACK_ORDER.filter((item) => item !== preferred)];
  return candidates
    .map((placement, index) => {
      const size = outerSizeFor(placement, card);
      const coords = positionFor(trigger, size, placement, align);
      const overflow = overflowFor(coords, size);
      const verticalPlacement = placement === "top" || placement === "bottom";
      return {
        placement,
        coords,
        size,
        index,
        mainOverflow: verticalPlacement ? overflow.vertical : overflow.horizontal,
        crossOverflow: verticalPlacement ? overflow.horizontal : overflow.vertical,
      };
    })
    .sort((a, b) =>
      a.mainOverflow - b.mainOverflow ||
      a.crossOverflow - b.crossOverflow ||
      a.index - b.index,
    )[0];
}

/**
 * 点击触发的轻量浮层。与悬停说明 `SensTips` 分属两种语义：前者承载浏览/操作，后者只承载短说明。
 */
export function SensPopover({
  children,
  title,
  content,
  actions,
  size = "medium",
  variant = "action",
  placement = "top",
  align = "start",
  open: openProp,
  defaultOpen = false,
  disabled = false,
  autoAdjust = true,
  strategy = "portal",
  onOpenChange,
  className,
  style,
}: SensPopoverProps) {
  const popoverId = useId();
  const triggerRef = useRef<HTMLElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const scrollSnapshotRef = useRef<ScrollSnapshot | null>(null);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [coords, setCoords] = useState<Coords>({ top: -9999, left: -9999 });
  const [resolvedPlacement, setResolvedPlacement] = useState(placement);
  const [viewportVersion, setViewportVersion] = useState(0);
  /** 内容已向下滚动时才给操作栏 D2↑，短内容 / 未滚动不出现 */
  const [actionsElevated, setActionsElevated] = useState(false);
  const controlled = openProp !== undefined;
  const open = !disabled && (controlled ? Boolean(openProp) : uncontrolledOpen);

  const setOpen = (next: boolean) => {
    if (!controlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (disabled && !controlled) setUncontrolledOpen(false);
  }, [disabled, controlled]);

  useEffect(() => {
    if (!open) {
      setActionsElevated(false);
      scrollSnapshotRef.current = null;
    }
  }, [open]);

  useEffect(() => {
    if (!open || !actions) return;
    const node = contentRef.current;
    if (!node) return;
    const sync = () => {
      setActionsElevated(node.scrollTop > 0);
    };
    sync();
    node.addEventListener("scroll", sync, { passive: true });
    const resize = typeof ResizeObserver !== "undefined" ? new ResizeObserver(sync) : null;
    resize?.observe(node);
    return () => {
      node.removeEventListener("scroll", sync);
      resize?.disconnect();
    };
  }, [open, actions, content, size, title]);

  useEffect(() => {
    if (!open || strategy === "anchored") return;
    const onMouseDown = (event: globalThis.MouseEvent) => {
      const target = event.target as Node;
      if (!triggerRef.current?.contains(target) && !popupRef.current?.contains(target)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, strategy]);

  /** 滚动容器位移补偿：不重读触发器，气泡随页面滚走，滚出视口即不可见 */
  useEffect(() => {
    if (!open || strategy === "anchored" || !triggerRef.current) return;
    const parents = findScrollParents(triggerRef.current);
    const onScroll = () => {
      const snap = scrollSnapshotRef.current;
      if (!snap) return;
      const offset = snap.parents.reduce(
        (total, parent) => ({
          top: total.top + (parent.element.scrollTop - parent.scrollTop),
          left: total.left + ((parent.element as HTMLElement).scrollLeft - parent.scrollLeft),
        }),
        { top: 0, left: 0 },
      );
      setCoords({
        top: snap.top - offset.top,
        left: snap.left - offset.left,
      });
    };
    parents.forEach((parent) => parent.addEventListener("scroll", onScroll, { passive: true }));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      parents.forEach((parent) => parent.removeEventListener("scroll", onScroll));
      window.removeEventListener("scroll", onScroll);
    };
  }, [open, strategy]);

  useEffect(() => {
    if (!open || strategy === "anchored") return;
    const onResize = () => setViewportVersion((version) => version + 1);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open, strategy]);

  useLayoutEffect(() => {
    if (!open || strategy === "anchored" || !triggerRef.current || !cardRef.current) return;
    const trigger = triggerRef.current.getBoundingClientRect();
    const card = cardRef.current.getBoundingClientRect();
    const preferredSize = outerSizeFor(placement, card);
    const preferredCoords = positionFor(trigger, preferredSize, placement, align);
    const resolved = autoAdjust ? pickPlacement(placement, trigger, card, align) : null;
    const nextPlacement = resolved?.placement ?? placement;
    const nextCoords = resolved
      ? clampCrossAxis(resolved.coords, resolved.size, resolved.placement)
      : {
          top: Math.max(VIEWPORT_MARGIN, Math.min(preferredCoords.top, window.innerHeight - preferredSize.height - VIEWPORT_MARGIN)),
          left: Math.max(VIEWPORT_MARGIN, Math.min(preferredCoords.left, window.innerWidth - preferredSize.width - VIEWPORT_MARGIN)),
        };
    setResolvedPlacement(nextPlacement);
    setCoords(nextCoords);
    scrollSnapshotRef.current = {
      top: nextCoords.top,
      left: nextCoords.left,
      parents: findScrollParents(triggerRef.current).map((element) => ({
        element,
        scrollTop: element.scrollTop,
        scrollLeft: (element as HTMLElement).scrollLeft ?? 0,
      })),
    };
  }, [open, placement, align, size, title, content, actions, autoAdjust, strategy, variant, viewportVersion]);

  if (!isValidElement(children)) return children;
  const child = children as ReactElement<{
    onMouseDown?: (event: MouseEvent) => void;
    "aria-expanded"?: boolean;
    "aria-controls"?: string;
    "aria-haspopup"?: "dialog";
  }>;

  const trigger = cloneElement(child, {
    "aria-haspopup": "dialog",
    "aria-expanded": open,
    "aria-controls": open ? popoverId : undefined,
    onMouseDown: (event: MouseEvent) => {
      child.props.onMouseDown?.(event);
      if (!disabled) setOpen(!open);
    },
  });

  const resolvedSize = variant === "confirm" && size === "large" ? "medium" : size;
  const isConfirm = variant === "confirm";

  const popup = open ? (
    <div
      ref={popupRef}
      id={popoverId}
      role="dialog"
      aria-label={typeof title === "string" ? title : "气泡卡片"}
      className={[
        "sens-popover",
        `sens-popover--${strategy}`,
        `sens-popover--${resolvedSize}`,
        `sens-popover--${resolvedPlacement}`,
        `sens-popover--align-${align}`,
        isConfirm ? "sens-popover--confirm" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        "--sens-popover-width": `${WIDTH_BY_SIZE[resolvedSize]}px`,
        "--sens-popover-z-index": Z_INDEX,
        "--sens-popover-surface": getColorToken("white"),
        "--sens-popover-shadow": buildShadowD4(),
        "--sens-popover-actions-shadow": buildShadow("D2", "up"),
        "--sens-popover-divider": getDividerColor("weak", "transparent"),
        "--sens-popover-scrollbar": getDividerColor("deep", "transparent"),
        "--sens-popover-arrow-depth": `${SENS_TIPS_ARROW_DEPTH}px`,
        "--sens-popover-arrow-cross": `${SENS_TIPS_ARROW_CROSS_SIZE}px`,
        "--sens-popover-arrow-edge-inset-inline": `${SENS_TIPS_ARROW_EDGE_INSET_INLINE}px`,
        "--sens-popover-arrow-edge-inset-block": `${SENS_TIPS_ARROW_EDGE_INSET_BLOCK}px`,
        "--sens-popover-title-color": getColorToken("text-color"),
        "--sens-popover-content-color": getColorToken("text-article-color"),
        ...(strategy === "portal" ? { top: coords.top, left: coords.left } : {}),
        ...style,
      } as CSSProperties}
    >
      <div ref={cardRef} className="sens-popover__card">
        {title ? (
          <div className={["sens-popover__title", isConfirm ? "sens-popover__title--confirm" : ""].filter(Boolean).join(" ")}>
            {isConfirm ? (
              <>
                <SensIcon
                  name="feedback-warning"
                  sizeToken="size/icon/m"
                  color={getColorToken("info-color")}
                />
                <span className="sens-popover__title-text">{title}</span>
              </>
            ) : (
              title
            )}
          </div>
        ) : null}
        {title && !isConfirm ? <div className="sens-popover__divider" /> : null}
        <div ref={contentRef} className="sens-popover__content">
          {content}
        </div>
        {actions ? (
          <div
            className={[
              "sens-popover__actions",
              `sens-popover__actions--${variant}`,
              actionsElevated ? "sens-popover__actions--elevated" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {actions}
          </div>
        ) : null}
      </div>
      <span className="sens-popover__arrow" aria-hidden="true">
        <img src={popoverArrow} alt="" />
      </span>
    </div>
  ) : null;

  return (
    <span
      ref={triggerRef}
      className="sens-popover-trigger"
    >
      {trigger}
      {popup
        ? strategy === "anchored"
          ? popup
          : typeof document !== "undefined"
            ? createPortal(popup, document.body)
            : null
        : null}
    </span>
  );
}
