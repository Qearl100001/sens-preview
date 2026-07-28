import { useCallback, useEffect, useState, type Dispatch, type RefObject, type SetStateAction } from "react";

export interface AnchoredOverflowMenuPosition {
  top: number;
  right: number;
}

interface UseAnchoredOverflowMenuOptions {
  popupSelector?: string;
  rootRef: RefObject<HTMLElement | null>;
  triggerSelector: string;
  defaultOpen?: boolean;
  offset?: number;
  resyncKey?: string | number | boolean | null;
  syncExpandedAria?: boolean;
}

interface UseAnchoredOverflowMenuResult {
  open: boolean;
  popupPosition: AnchoredOverflowMenuPosition | null;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setVisible: (open: boolean) => void;
  close: () => void;
}

function resolveAnchoredOverflowMenuPosition(
  root: HTMLElement | null,
  triggerSelector: string,
  offset: number,
): AnchoredOverflowMenuPosition | null {
  const trigger = root?.querySelector<HTMLElement>(triggerSelector);
  const rect = trigger?.getBoundingClientRect();
  if (!rect) return null;

  return {
    top: Math.round(rect.bottom + offset),
    right: Math.round(window.innerWidth - rect.right),
  };
}

export function useAnchoredOverflowMenu({
  popupSelector,
  rootRef,
  triggerSelector,
  defaultOpen = false,
  offset = 4,
  resyncKey = null,
  syncExpandedAria = false,
}: UseAnchoredOverflowMenuOptions): UseAnchoredOverflowMenuResult {
  const [open, setOpen] = useState(defaultOpen);
  const [popupPosition, setPopupPosition] = useState<AnchoredOverflowMenuPosition | null>(null);

  const applyPopupPosition = useCallback(
    (nextPosition: AnchoredOverflowMenuPosition | null) => {
      if (!popupSelector || !nextPosition) return;

      const popup = document.querySelector<HTMLElement>(popupSelector);
      if (!popup) return;

      popup.style.position = "fixed";
      popup.style.top = `${nextPosition.top}px`;
      popup.style.right = `${nextPosition.right}px`;
      popup.style.left = "auto";
      popup.style.inset = "unset";
    },
    [popupSelector],
  );

  const syncPopupPosition = useCallback(() => {
    const nextPosition = resolveAnchoredOverflowMenuPosition(rootRef.current, triggerSelector, offset);
    setPopupPosition(nextPosition);
    applyPopupPosition(nextPosition);
  }, [applyPopupPosition, offset, rootRef, triggerSelector]);

  const close = () => {
    setOpen(false);
    setPopupPosition(null);
  };

  const setVisible = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      syncPopupPosition();
      return;
    }
    setPopupPosition(null);
  };

  useEffect(() => {
    if (!syncExpandedAria) return;

    const trigger = rootRef.current?.querySelector<HTMLElement>(triggerSelector);
    if (!trigger) return;

    trigger.setAttribute("aria-expanded", open ? "true" : "false");
  }, [open, resyncKey, rootRef, syncExpandedAria, triggerSelector]);

  useEffect(() => {
    if (!open) return;

    let raf = 0;
    const runFrameSync = () => {
      let frames = 0;
      const tick = () => {
        syncPopupPosition();
        frames += 1;
        if (frames < 4) {
          raf = window.requestAnimationFrame(tick);
        }
      };
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(tick);
    };

    const root = rootRef.current;
    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            runFrameSync();
          })
        : null;
    const watchTrigger = () => {
      const trigger = rootRef.current?.querySelector<HTMLElement>(triggerSelector);
      if (trigger) resizeObserver?.observe(trigger);
    };
    const mutationObserver =
      root && typeof MutationObserver !== "undefined"
        ? new MutationObserver(() => {
            watchTrigger();
            runFrameSync();
          })
        : null;
    const popupObserver =
      popupSelector && typeof MutationObserver !== "undefined"
        ? new MutationObserver(() => {
            runFrameSync();
          })
        : null;

    runFrameSync();
    if (root) resizeObserver?.observe(root);
    watchTrigger();
    if (root) {
      mutationObserver?.observe(root, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class", "style"],
      });
    }
    popupObserver?.observe(document.body, {
      childList: true,
      subtree: true,
    });
    window.addEventListener("resize", runFrameSync);
    window.addEventListener("scroll", runFrameSync, true);

    return () => {
      window.cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      popupObserver?.disconnect();
      window.removeEventListener("resize", runFrameSync);
      window.removeEventListener("scroll", runFrameSync, true);
    };
  }, [open, popupSelector, resyncKey, rootRef, syncPopupPosition, triggerSelector]);

  return {
    open,
    popupPosition,
    setOpen,
    setVisible,
    close,
  };
}
