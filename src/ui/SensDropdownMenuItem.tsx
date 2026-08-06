import type { CSSProperties, KeyboardEvent, MouseEvent, ReactNode } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import "./dropdown-menu.css";

export type SensDropdownMenuItemVariant = "default" | "link" | "danger";

export interface SensDropdownMenuItemConfig {
  key: string;
  label: ReactNode;
  variant?: SensDropdownMenuItemVariant;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export type SensDropdownMenuItemPreviewState =
  | "default"
  | "hover"
  | "active"
  | "disabled"
  | "disabledHover"
  | "loading"
  | "loadingHover";

export interface SensDropdownMenuItemProps {
  variant?: SensDropdownMenuItemVariant;
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => void;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const I18N_NS = "组件库";

export function SensDropdownMenuItem({
  variant = "default",
  disabled = false,
  loading = false,
  onClick,
  children,
  className,
  style,
}: SensDropdownMenuItemProps) {
  const { t } = useTranslation();
  const isNonInteractive = disabled || loading;

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (isNonInteractive) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (isNonInteractive) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onClick?.(event);
  };

  const loadingText = t(`${I18N_NS}.sensd-selectPanel-loadingText`, { defaultValue: "加载中" });

  const itemClassName = [
    "sens-dropdown-menu-item",
    `sens-dropdown-menu-item--${variant}`,
    disabled ? "sens-dropdown-menu-item--disabled" : "",
    loading ? "sens-dropdown-menu-item--loading" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      role="menuitem"
      aria-disabled={isNonInteractive || undefined}
      aria-busy={loading || undefined}
      tabIndex={isNonInteractive ? -1 : 0}
      className={itemClassName}
      style={style}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {loading ? (
        <span className="sens-dropdown-menu-item-loading">
          <LoadingOutlined spin className="sens-dropdown-menu-item-loading-icon" />
          <span>{loadingText}</span>
        </span>
      ) : (
        <span className="sens-dropdown-menu-item-label">{children}</span>
      )}
    </div>
  );
}
