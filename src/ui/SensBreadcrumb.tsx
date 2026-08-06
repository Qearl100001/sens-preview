import { useState, type CSSProperties, type ReactNode } from "react";
import { Dropdown } from "antd";
import tokens from "../design-system/tokens.resolved.json";
import { getColorToken, tokenRgba } from "../design-system/color-utils";
import { SensIcon } from "../design-system/icons";
import { getTypographyToken } from "../design-system/typography";
import { SensDropdownMenu, useSensDropdownMenuStyle } from "./SensDropdownMenu";
import { SensDropdownMenuItem } from "./SensDropdownMenuItem";
import "./breadcrumb.css";

const u = tokens.unit as Record<string, number>;

const ELLIPSIS_KEY = "__ellipsis__";

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

/** 全路径默认同色（含当前项）；可点祖先 / more 悬停、点击对齐 linkWeak */
const breadcrumbTokens = {
  text: tokenRgba("text-sub-color-transparent", 0.58),
  hover: getColorToken("link-color"),
  active: getColorToken("link-active-color"),
  gap: u["spacing/1x"],
  fontSize: getTypographyToken("font-size/s"),
  lineHeight: getTypographyToken("line-height/s"),
  fontWeight: getTypographyToken("font-weight/regular"),
};

function getHiddenItems(items: SensBreadcrumbItem[]): SensBreadcrumbItem[] {
  if (items.length <= 2) return [];
  return items.slice(1, -1);
}

function getVisibleItems(items: SensBreadcrumbItem[], ellipsis: boolean): SensBreadcrumbItem[] {
  if (!ellipsis || items.length <= 2) return items;
  return [items[0], { key: ELLIPSIS_KEY, label: null }, items[items.length - 1]];
}

function BreadcrumbLink({
  item,
  current,
}: {
  item: SensBreadcrumbItem;
  current: boolean;
}) {
  const interactive = Boolean(item.onClick) && !current;

  if (current || !interactive) {
    return (
      <span
        className={current ? "sens-breadcrumb-current" : "sens-breadcrumb-plain"}
        {...(current ? { "aria-current": "page" as const } : {})}
      >
        {item.label}
      </span>
    );
  }

  return (
    <button type="button" className="sens-breadcrumb-link" onClick={item.onClick}>
      {item.label}
    </button>
  );
}

function BreadcrumbEllipsis({ hiddenItems }: { hiddenItems: SensBreadcrumbItem[] }) {
  const [open, setOpen] = useState(false);
  const menuStyle = useSensDropdownMenuStyle();

  return (
    <Dropdown
      trigger={["click"]}
      open={open}
      onOpenChange={setOpen}
      popupRender={() => (
        <SensDropdownMenu>
          {hiddenItems.map((item) => (
            <SensDropdownMenuItem
              key={item.key}
              onClick={() => {
                item.onClick?.();
                setOpen(false);
              }}
            >
              {item.label}
            </SensDropdownMenuItem>
          ))}
        </SensDropdownMenu>
      )}
      overlayClassName="sens-dropdown-menu-overlay"
      overlayStyle={menuStyle}
    >
      <button type="button" className="sens-breadcrumb-ellipsis-trigger" aria-label="更多层级" aria-expanded={open}>
        <SensIcon name="more" sizeToken="size/icon/s" color="currentColor" />
      </button>
    </Dropdown>
  );
}

export function SensBreadcrumb({ items, ellipsis = false, className, style }: SensBreadcrumbProps) {
  const visibleItems = getVisibleItems(items, ellipsis);
  const hiddenItems = ellipsis ? getHiddenItems(items) : [];
  const cssVars = {
    "--sens-breadcrumb-text": breadcrumbTokens.text,
    "--sens-breadcrumb-hover": breadcrumbTokens.hover,
    "--sens-breadcrumb-active": breadcrumbTokens.active,
    "--sens-breadcrumb-gap": `${breadcrumbTokens.gap}px`,
    "--sens-breadcrumb-font-size": `${breadcrumbTokens.fontSize}px`,
    "--sens-breadcrumb-line-height": `${breadcrumbTokens.lineHeight}px`,
    "--sens-breadcrumb-font-weight": String(breadcrumbTokens.fontWeight),
    /** focus 环圆角：无 2px token，取最近档 radius/s */
    "--sens-breadcrumb-focus-radius": `${u["radius/s"]}px`,
  } as CSSProperties;

  return (
    <nav
      className={["sens-breadcrumb", className].filter(Boolean).join(" ")}
      aria-label="面包屑"
      style={{ ...cssVars, ...style }}
    >
      {visibleItems.map((item, index) => {
        const current = index === visibleItems.length - 1;
        const isEllipsis = item.key === ELLIPSIS_KEY;
        return (
          <span key={item.key} className="sens-breadcrumb-item">
            {index > 0 ? <span className="sens-breadcrumb-separator">/</span> : null}
            {isEllipsis ? (
              <BreadcrumbEllipsis hiddenItems={hiddenItems} />
            ) : (
              <BreadcrumbLink item={item} current={current} />
            )}
          </span>
        );
      })}
    </nav>
  );
}
