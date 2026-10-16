import { useLayoutEffect, useState, type CSSProperties, type RefObject } from "react";
import { SensIcon } from "../design-system/icons";
import { getUnitToken } from "../design-system/unit";
import { SensButton } from "./SensButton";
import { SensTips } from "./SensTips";

const BACK_TOP_INSET_PX = getUnitToken("spacing/6x");
const BACK_TOP_SIZE_PX = getUnitToken("size/component-height/l");

type VisibleBox = { left: number; top: number; right: number; bottom: number };

function clipsOverflow(style: CSSStyleDeclaration): boolean {
  return style.overflowX !== "visible" || style.overflowY !== "visible";
}

function clipToClientBox(box: VisibleBox, node: HTMLElement): VisibleBox {
  const rect = node.getBoundingClientRect();
  const style = getComputedStyle(node);
  const clientLeft = rect.left + (Number.parseFloat(style.borderLeftWidth) || 0);
  const clientTop = rect.top + (Number.parseFloat(style.borderTopWidth) || 0);
  return {
    left: Math.max(box.left, clientLeft),
    top: Math.max(box.top, clientTop),
    right: Math.min(box.right, clientLeft + node.clientWidth),
    bottom: Math.min(box.bottom, clientTop + node.clientHeight),
  };
}

function getVisibleBox(element: HTMLElement): VisibleBox {
  let box: VisibleBox = { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
  let node: HTMLElement | null = element;
  while (node) {
    if (clipsOverflow(getComputedStyle(node))) box = clipToClientBox(box, node);
    node = node.parentElement;
  }
  return clipToClientBox(box, element);
}

export interface SensProductShellBackTopProps {
  visible: boolean;
  docked: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  onBackToTop: () => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export function SensProductShellBackTop({
  visible,
  docked,
  anchorRef,
  onBackToTop,
  onPointerEnter,
  onPointerLeave,
}: SensProductShellBackTopProps) {
  const [style, setStyle] = useState<CSSProperties>({});

  useLayoutEffect(() => {
    if (!visible) return undefined;
    const anchor = anchorRef.current;
    if (!anchor) return undefined;

    const update = () => {
      const contentRect = anchor.getBoundingClientRect();
      const visibleBox = getVisibleBox(anchor);
      const insetRight = Math.max(0, contentRect.right - visibleBox.right);
      const insetBottom = Math.max(0, contentRect.bottom - visibleBox.bottom);
      setStyle({
        right: docked ? insetRight - BACK_TOP_SIZE_PX / 2 : insetRight + BACK_TOP_INSET_PX,
        bottom: insetBottom + BACK_TOP_INSET_PX,
      });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(anchor);
    window.addEventListener("resize", update);
    document.addEventListener("scroll", update, true);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
      document.removeEventListener("scroll", update, true);
    };
  }, [visible, docked, anchorRef]);

  if (!visible) return null;

  return (
    <div
      className={["sens-product-shell__back-top", docked ? "sens-product-shell__back-top--docked" : ""]
        .filter(Boolean)
        .join(" ")}
      style={style}
      data-sens-product-shell-back-top
      data-back-top-docked={docked ? "true" : "false"}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <SensTips title="回到顶部" placement="left">
        <span>
          <SensButton
            fab
            tone="secondary"
            aria-label="回到顶部"
            icon={<SensIcon name="to-top" sizeToken="size/icon/m" color="currentColor" />}
            onClick={onBackToTop}
          />
        </span>
      </SensTips>
    </div>
  );
}
