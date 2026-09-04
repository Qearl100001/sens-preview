import { useCallback, useEffect, useRef, useState, type UIEvent } from "react";

/** 内容区 scrollTop 超过该值后收起顶导、显示回到顶部。临时口径，待 Figma 精准确认。 */
export const PRODUCT_SHELL_SCROLL_THRESHOLD = 300;

/** 停滚且未点击、未悬停后，收起到半圆的闲置时长。 */
export const PRODUCT_SHELL_BACK_TOP_IDLE_MS = 3000;

export function useProductShellContentScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  const dockTimerRef = useRef<number | null>(null);
  const hoveredRef = useRef(false);
  const visibleRef = useRef(false);

  const [topNavCollapsed, setTopNavCollapsed] = useState(false);
  const [titleBarElevated, setTitleBarElevated] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);
  const [backTopDocked, setBackTopDocked] = useState(false);

  const clearDockTimer = useCallback(() => {
    if (dockTimerRef.current == null) return;
    window.clearTimeout(dockTimerRef.current);
    dockTimerRef.current = null;
  }, []);

  const scheduleDock = useCallback(() => {
    clearDockTimer();
    dockTimerRef.current = window.setTimeout(() => {
      dockTimerRef.current = null;
      if (visibleRef.current && !hoveredRef.current) {
        setBackTopDocked(true);
      }
    }, PRODUCT_SHELL_BACK_TOP_IDLE_MS);
  }, [clearDockTimer]);

  const handleContentScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const scrollTop = event.currentTarget.scrollTop;
      const nextCollapsed = scrollTop > PRODUCT_SHELL_SCROLL_THRESHOLD;
      const nextShowBackTop = scrollTop > PRODUCT_SHELL_SCROLL_THRESHOLD;
      const nextElevated = scrollTop > 0;
      visibleRef.current = nextShowBackTop;

      setTopNavCollapsed((prev) => (prev === nextCollapsed ? prev : nextCollapsed));
      setShowBackTop((prev) => (prev === nextShowBackTop ? prev : nextShowBackTop));
      setTitleBarElevated((prev) => (prev === nextElevated ? prev : nextElevated));

      if (nextShowBackTop) {
        setBackTopDocked(false);
        if (!hoveredRef.current) scheduleDock();
        else clearDockTimer();
      } else {
        setBackTopDocked(false);
        clearDockTimer();
      }
    },
    [clearDockTimer, scheduleDock],
  );

  const handleBackToTop = useCallback(() => {
    hoveredRef.current = false;
    setBackTopDocked(false);
    clearDockTimer();
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [clearDockTimer]);

  const handleBackTopPointerEnter = useCallback(() => {
    hoveredRef.current = true;
    setBackTopDocked(false);
    clearDockTimer();
  }, [clearDockTimer]);

  const handleBackTopPointerLeave = useCallback(() => {
    hoveredRef.current = false;
    if (visibleRef.current) scheduleDock();
  }, [scheduleDock]);

  useEffect(() => () => clearDockTimer(), [clearDockTimer]);

  return {
    scrollRef,
    contentRef,
    topNavCollapsed,
    titleBarElevated,
    showBackTop,
    backTopDocked,
    handleContentScroll,
    handleBackToTop,
    handleBackTopPointerEnter,
    handleBackTopPointerLeave,
  };
}
