import { useState, type CSSProperties, type ReactNode } from "react";
import tokens from "../design-system/tokens.resolved.json";
import { getColorToken, tokenRgba } from "../design-system/color-utils";
import { getTypographyToken } from "../design-system/typography";

const u = tokens.unit as Record<string, number>;

export interface SensBreadcrumbItem {
  key: string;
  label: ReactNode;
  onClick?: () => void;
}

export interface SensBreadcrumbProps {
  items: SensBreadcrumbItem[];
  ellipsis?: boolean;
  className?: string;
  style?: CSSProperties;
}

const breadcrumbTokens = {
  text: tokenRgba("text-sub-color-transparent", 0.58),
  current: tokenRgba("text-color-transparent", 0.9),
  hover: getColorToken("link-color"),
  active: getColorToken("link-active-color"),
  separator: tokenRgba("text-sub-color-transparent", 0.58),
  gap: u["spacing/1x"],
  fontSize: getTypographyToken("font-size/s"),
  lineHeight: getTypographyToken("line-height/s"),
  fontWeight: getTypographyToken("font-weight/regular"),
};

function getVisibleItems(items: SensBreadcrumbItem[], ellipsis: boolean): SensBreadcrumbItem[] {
  if (!ellipsis || items.length <= 2) return items;
  return [items[0], { key: "__ellipsis__", label: "..." }, items[items.length - 1]];
}

function BreadcrumbLink({
  item,
  current,
}: {
  item: SensBreadcrumbItem;
  current: boolean;
}) {
  const [state, setState] = useState<"default" | "hover" | "active">("default");
  const interactive = Boolean(item.onClick) && !current;
  const color = current
    ? breadcrumbTokens.current
    : state === "active"
      ? breadcrumbTokens.active
      : state === "hover"
        ? breadcrumbTokens.hover
        : breadcrumbTokens.text;

  if (!interactive) {
    return (
      <span
        style={{
          color,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: 160,
        }}
      >
        {item.label}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={item.onClick}
      onMouseEnter={() => setState("hover")}
      onMouseLeave={() => setState("default")}
      onMouseDown={() => setState("active")}
      onMouseUp={() => setState("hover")}
      onFocus={() => setState("hover")}
      onBlur={() => setState("default")}
      style={{
        border: 0,
        padding: 0,
        margin: 0,
        background: "transparent",
        color,
        font: "inherit",
        lineHeight: "inherit",
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {item.label}
    </button>
  );
}

export function SensBreadcrumb({ items, ellipsis = false, className, style }: SensBreadcrumbProps) {
  const visibleItems = getVisibleItems(items, ellipsis);

  return (
    <nav
      className={className}
      aria-label="面包屑"
      style={{
        minWidth: 0,
        display: "flex",
        alignItems: "center",
        gap: breadcrumbTokens.gap,
        color: breadcrumbTokens.text,
        fontSize: breadcrumbTokens.fontSize,
        lineHeight: `${breadcrumbTokens.lineHeight}px`,
        fontWeight: breadcrumbTokens.fontWeight,
        ...style,
      }}
    >
      {visibleItems.map((item, index) => {
        const current = index === visibleItems.length - 1;
        return (
          <span
            key={item.key}
            style={{
              minWidth: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: breadcrumbTokens.gap,
            }}
          >
            {index > 0 ? <span style={{ color: breadcrumbTokens.separator }}>/</span> : null}
            <BreadcrumbLink item={item} current={current} />
          </span>
        );
      })}
    </nav>
  );
}
