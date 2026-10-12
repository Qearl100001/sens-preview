import { useCallback, useEffect, useRef, useState, type UIEvent } from "react";

/** 内容区超过该阈值后收起顶导并显示回到顶部。 */
export const SENS_PRODUCT_SHELL_SCROLL_THRESHOLD = 300;

/** 停滚且未悬停后，回到顶部按钮收起到半圆的闲置时长。 */
export const SENS_PRODUCT_SHELL_BACK_TOP_IDLE_MS = 3000;

export function useSensProductShellScroll() {
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
      if (visibleRef.current && !hoveredRef.current) setBackTopDocked(true);
    }, SENS_PRODUCT_SHELL_BACK_TOP_IDLE_MS);
  }, [clearDockTimer]);

  const handleContentScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const scrollTop = event.currentTarget.scrollTop;
      const nextCollapsed = scrollTop > SENS_PRODUCT_SHELL_SCROLL_THRESHOLD;
      const nextElevated = scrollTop > 0;
      visibleRef.current = nextCollapsed;

      setTopNavCollapsed((previous) => (previous === nextCollapsed ? previous : nextCollapsed));
      setShowBackTop((previous) => (previous === nextCollapsed ? previous : nextCollapsed));
      setTitleBarElevated((previous) => (previous === nextElevated ? previous : nextElevated));

      if (nextCollapsed) {
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
