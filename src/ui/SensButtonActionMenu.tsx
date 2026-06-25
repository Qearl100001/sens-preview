import { cloneElement, isValidElement, useState } from "react";
import { Dropdown, type ButtonProps, type DropdownProps } from "antd";
import { ChevronDownIcon, ChevronUpIcon } from "./FieldIcons";
import { SensButton, type SensButtonVariant } from "./SensButton";
import { SensDropdownMenu, useSensDropdownMenuStyle } from "./SensDropdownMenu";
import {
  SensDropdownMenuItem,
  type SensDropdownMenuItemConfig,
} from "./SensDropdownMenuItem";

export interface SensButtonActionMenuProps
  extends Omit<ButtonProps, "type" | "variant" | "color" | "icon" | "iconPosition"> {
  items: SensDropdownMenuItemConfig[];
  tone?: SensButtonVariant;
  trigger?: DropdownProps["trigger"];
  showChevron?: boolean;
  dropdownProps?: Omit<DropdownProps, "menu" | "children" | "dropdownRender" | "popupRender">;
}

/**
 * 按钮 + 动作菜单浮层薄封装：antd Dropdown + SensDropdownMenu。
 * 与 SensDropdownButton（链接更多 ▼ 专用）并列；SensDropdownButton 收口到此组件为单独一轮。
 */
export function SensButtonActionMenu({
  children,
  items,
  tone = "secondary",
  trigger = ["click"],
  showChevron = false,
  dropdownProps,
  className,
  loading,
  disabled,
  style,
  ...rest
}: SensButtonActionMenuProps) {
  const isLoading = !!loading;
  const isDisabled = disabled || isLoading;
  const menuStyle = useSensDropdownMenuStyle();
  const {
    open,
    onOpenChange,
    overlayClassName: dropdownOverlayClassName,
    overlayStyle: dropdownOverlayStyle,
    trigger: dropdownTriggerOverride,
    ...restDropdownProps
  } = dropdownProps ?? {};
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open ?? internalOpen;

  const handleOpenChange: NonNullable<DropdownProps["onOpenChange"]> = (nextOpen, info) => {
    if (open === undefined) setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen, info);
  };

  const closeMenu = () => {
    handleOpenChange(false, { source: "menu" });
  };

  const handleItemClick = (item: SensDropdownMenuItemConfig) => {
    if (item.disabled || item.loading) return;
    item.onClick?.();
    closeMenu();
  };

  const overlayClassName = ["sens-dropdown-menu-overlay", dropdownOverlayClassName].filter(Boolean).join(" ");
  const overlayStyle = { ...menuStyle, ...dropdownOverlayStyle };
  const resolvedTrigger = dropdownTriggerOverride ?? trigger;
  const chevronIcon = showChevron ? (isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />) : undefined;
  const mergedClassName = [showChevron ? "sens-dropdown-btn" : undefined, className].filter(Boolean).join(" ") || undefined;

  const defaultTrigger = (
    <SensButton
      tone={tone}
      icon={chevronIcon}
      iconPosition={chevronIcon ? "end" : undefined}
      loading={loading}
      disabled={disabled}
      className={mergedClassName}
      style={style}
      {...rest}
    >
      {children}
    </SensButton>
  );

  const triggerNode =
    isValidElement(children) && !showChevron
      ? cloneElement(children, {
          className: [children.props.className, mergedClassName].filter(Boolean).join(" ") || undefined,
          disabled: children.props.disabled ?? disabled,
          loading: children.props.loading ?? loading,
          style: { ...children.props.style, ...style },
          ...rest,
        })
      : defaultTrigger;

  return (
    <Dropdown
      disabled={isDisabled}
      open={isOpen}
      onOpenChange={handleOpenChange}
      popupRender={() => (
        <SensDropdownMenu>
          {items.map((item) => (
            <SensDropdownMenuItem
              key={item.key}
              variant={item.variant}
              disabled={item.disabled}
              loading={item.loading}
              onClick={() => handleItemClick(item)}
            >
              {item.label}
            </SensDropdownMenuItem>
          ))}
        </SensDropdownMenu>
      )}
      {...restDropdownProps}
      trigger={resolvedTrigger}
      overlayClassName={overlayClassName}
      overlayStyle={overlayStyle}
    >
      {triggerNode}
    </Dropdown>
  );
}
