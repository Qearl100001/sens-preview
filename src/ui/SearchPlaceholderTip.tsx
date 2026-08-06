import {
  isValidElement,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { SensTips } from "./SensTips";

function measureTextWidth(text: string, font: string): number {
  if (typeof document === "undefined") return 0;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return 0;
  ctx.font = font;
  return ctx.measureText(text).width;
}

/**
 * 占位符过长截断时展示全文（search.md）。
 * 一律 `SensTips`（含 Space.Compact 带分类）；有输入后不展示 tip。
 */
export function SearchPlaceholderTip({
  placeholder,
  hasValue,
  children,
}: {
  placeholder: string;
  hasValue: boolean;
  children: ReactElement;
}): ReactNode {
  const hostRef = useRef<HTMLSpanElement | null>(null);
  const [truncated, setTruncated] = useState(false);

  useLayoutEffect(() => {
    if (hasValue || !placeholder) {
      setTruncated(false);
      return;
    }

    const input = hostRef.current?.querySelector("input") ?? null;
    if (!input) {
      setTruncated(false);
      return;
    }

    const update = () => {
      const style = window.getComputedStyle(input);
      const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} / ${style.lineHeight} ${style.fontFamily}`;
      const textWidth = measureTextWidth(placeholder, font);
      setTruncated(textWidth > input.clientWidth + 1);
    };

    update();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    ro?.observe(input);
    window.addEventListener("resize", update);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [placeholder, hasValue]);

  if (!isValidElement(children)) return children;

  const showTip = truncated && !hasValue;

  const body = (
    <span
      ref={hostRef as Ref<HTMLSpanElement>}
      className="sens-search-placeholder-measure"
      data-truncated={showTip ? "true" : "false"}
    >
      {children}
    </span>
  );

  if (!showTip) return body;

  return (
    <SensTips title={placeholder} placement="top" align="center">
      {body}
    </SensTips>
  );
}
