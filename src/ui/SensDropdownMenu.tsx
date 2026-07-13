import type { CSSProperties, ReactNode } from "react";
import { theme } from "antd";
import { useTranslation } from "react-i18next";
import { buildShadowD4, getColorToken, tokenRgba } from "../design-system/color-utils";
import {
  getLinkTextChain,
  getWarningTextChain,
  toDropdownMenuDangerColorAliases,
  toDropdownMenuLinkColorAliases,
  toTextChainCssVars,
  SENS_TEXT_LINK_VAR,
  SENS_TEXT_WARNING_VAR,
} from "../design-system/text-color-chains";
import { getUnitToken } from "../design-system/unit";
import {
  SensDropdownMenuItem,
  type SensDropdownMenuItemPreviewState,
  type SensDropdownMenuItemVariant,
} from "./SensDropdownMenuItem";
import "./dropdown-menu.css";
import "./dropdown-menu-preview.css";

const I18N_NS = "组件库";

/** Figma 链接菜单面板：8×34 + 上6 + 下10 = 288 */
export const DROPDOWN_MENU_ITEM_HEIGHT = 34;
export const DROPDOWN_MENU_MATRIX_CELL_WIDTH = 160;

function dropdownMenuSpacing() {
  const blockStart = getUnitToken("spacing/1.5x");
  return {
    popupPaddingBlockStart: blockStart,
    popupPaddingBlockEnd: getUnitToken("spacing/vertical/2.5x"),
    itemPaddingInline: getUnitToken("spacing/horizontal/3x"),
    itemPaddingBlock: blockStart,
  };
}

/**
 * 动作菜单浮层 CSS 变量（portaled overlay 须经 overlayStyle / SensDropdownMenu style 注入）。
 * SensDropdownButton 会把本 hook 返回值挂到 `.sens-dropdown-menu-overlay` portal 根。
 * M1/M2：未来 components.Menu token 或共享 PopupShell 只改此 hook + dropdown-menu.css 变量名。
 */
export function useSensDropdownMenuStyle(): CSSProperties {
  const { token } = theme.useToken();
  const spacing = dropdownMenuSpacing();
  const linkTextChain = getLinkTextChain(token);
  const warningTextChain = getWarningTextChain(token);

  return {
    "--sens-dropdown-menu-bg": token.colorBgContainer,
    "--sens-dropdown-menu-radius": `${token.borderRadius}px`,
    "--sens-dropdown-menu-shadow": buildShadowD4(),
    "--sens-dropdown-menu-padding-block-start": `${spacing.popupPaddingBlockStart}px`,
    "--sens-dropdown-menu-padding-block-end": `${spacing.popupPaddingBlockEnd}px`,
    "--sens-dropdown-menu-padding-inline": "0px",
    "--sens-dropdown-menu-item-height": `${DROPDOWN_MENU_ITEM_HEIGHT}px`,
    "--sens-dropdown-menu-item-padding-inline": `${spacing.itemPaddingInline}px`,
    "--sens-dropdown-menu-item-padding-block": `${spacing.itemPaddingBlock}px`,
    "--sens-dropdown-menu-item-bg": token.colorBgContainer,
    "--sens-dropdown-menu-item-hover-bg": tokenRgba("background-transparent-grey-hover", 0.06),
    "--sens-dropdown-menu-item-active-bg": tokenRgba("background-01-transparent", 0.08),
    "--sens-dropdown-menu-item-color-default": getColorToken("text-color"),
    ...toTextChainCssVars(SENS_TEXT_LINK_VAR, linkTextChain),
    ...toTextChainCssVars(SENS_TEXT_WARNING_VAR, warningTextChain),
    ...toDropdownMenuLinkColorAliases(),
    ...toDropdownMenuDangerColorAliases(),
    "--sens-dropdown-menu-item-color-disabled": token.colorTextDisabled,
    "--sens-dropdown-menu-item-color-loading": tokenRgba("text-color-transparent-disable", 0.3),
  } as CSSProperties;
}

function useDropdownMenuMatrixVars(): CSSProperties {
  return {
    "--sens-dropdown-menu-matrix-space-2x": `${getUnitToken("spacing/2x")}px`,
    "--sens-dropdown-menu-matrix-space-6x": `${getUnitToken("spacing/6x")}px`,
    "--sens-dropdown-menu-matrix-cell-width": `${DROPDOWN_MENU_MATRIX_CELL_WIDTH}px`,
  } as CSSProperties;
}

export interface SensDropdownMenuProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function SensDropdownMenu({ children, className, style }: SensDropdownMenuProps) {
  const menuStyle = useSensDropdownMenuStyle();
  const classNames = ["sens-dropdown-menu", className].filter(Boolean).join(" ");

  return (
    <div role="menu" className={classNames} style={{ ...menuStyle, ...style }}>
      {children}
    </div>
  );
}

const PREVIEW_STATE_I18N: Record<SensDropdownMenuItemPreviewState, string> = {
  default: "sensd-button-state-default",
  hover: "sensd-button-state-hover",
  active: "sensd-button-state-active",
  disabled: "sensd-input-state-disabled",
  disabledHover: "sensd-input-state-disabledHover",
  loading: "sensd-button-state-loading",
  loadingHover: "sensd-button-state-loadingHover",
};

const PREVIEW_STATE_DEFAULT: Record<SensDropdownMenuItemPreviewState, string> = {
  default: "默认",
  hover: "悬停",
  active: "点击",
  disabled: "禁用",
  disabledHover: "禁用悬停",
  loading: "加载",
  loadingHover: "加载悬停",
};

const VARIANT_I18N: Record<SensDropdownMenuItemVariant, string> = {
  default: "sensd-dropdown-menu-variant-default",
  link: "sensd-dropdown-menu-variant-link",
  danger: "sensd-dropdown-menu-variant-danger",
};

const VARIANT_DEFAULT: Record<SensDropdownMenuItemVariant, string> = {
  default: "中性",
  link: "链接",
  danger: "危险",
};

function matrixPreviewWrapperClass(state: SensDropdownMenuItemPreviewState): string {
  const classes: string[] = [];
  if (state === "hover") classes.push("sens-dropdown-menu-matrix-preview--hover");
  if (state === "active") classes.push("sens-dropdown-menu-matrix-preview--active");
  if (state === "disabledHover") classes.push("sens-dropdown-menu-matrix-preview--disabled-hover");
  if (state === "loadingHover") classes.push("sens-dropdown-menu-matrix-preview--loading-hover");
  return classes.join(" ");
}

function MatrixMenuItemCell({
  variant,
  state,
  label,
  menuStyle,
  stateLabel,
}: {
  variant: SensDropdownMenuItemVariant;
  state: SensDropdownMenuItemPreviewState;
  label: string;
  menuStyle: CSSProperties;
  stateLabel: string;
}) {
  const isDisabled = state === "disabled" || state === "disabledHover";
  const isLoading = state === "loading" || state === "loadingHover";

  return (
    <div className={`sens-dropdown-menu-matrix-cell ${matrixPreviewWrapperClass(state)}`}>
      <span className="sens-dropdown-menu-matrix-label">{stateLabel}</span>
      <div className="sens-dropdown-menu-matrix-shell sens-dropdown-menu" style={menuStyle}>
        <SensDropdownMenuItem variant={variant} disabled={isDisabled} loading={isLoading}>
          {label}
        </SensDropdownMenuItem>
      </div>
    </div>
  );
}

function DropdownMenuMatrixRow({
  variant,
  optionLabel,
  menuStyle,
  label,
  variantLabel,
}: {
  variant: SensDropdownMenuItemVariant;
  optionLabel: string;
  menuStyle: CSSProperties;
  label: (key: string, defaultValue: string) => string;
  variantLabel: string;
}) {
  const states: SensDropdownMenuItemPreviewState[] = [
    "default",
    "hover",
    "active",
    "disabled",
    "disabledHover",
    "loading",
    "loadingHover",
  ];

  return (
    <div className="sens-dropdown-menu-matrix-row">
      <span className="sens-dropdown-menu-matrix-variant-label">{variantLabel}</span>
      <div className="sens-dropdown-menu-matrix-states">
        {states.map((state) => (
          <MatrixMenuItemCell
            key={state}
            variant={variant}
            state={state}
            label={optionLabel}
            menuStyle={menuStyle}
            stateLabel={label(PREVIEW_STATE_I18N[state], PREVIEW_STATE_DEFAULT[state])}
          />
        ))}
      </div>
    </div>
  );
}

export interface DropdownMenuStatesPreviewProps {
  title?: ReactNode;
}

/** 3 variant × 7 态 = 21 格（对齐 Select R1 态列 + 加载） */
export function DropdownMenuStatesPreview({ title }: DropdownMenuStatesPreviewProps) {
  const { t } = useTranslation();
  const menuStyle = useSensDropdownMenuStyle();
  const optionLabel = t(`${I18N_NS}.sensd-dropdown-menu-option-label`, { defaultValue: "菜单项" });
  const label = (key: string, defaultValue: string) => t(`${I18N_NS}.${key}`, { defaultValue });

  const variants: SensDropdownMenuItemVariant[] = ["default", "link", "danger"];

  return (
    <div className="sens-dropdown-menu-matrix" style={useDropdownMenuMatrixVars()}>
      {title ? <div className="sens-dropdown-menu-matrix-title">{title}</div> : null}
      {variants.map((variant) => (
        <DropdownMenuMatrixRow
          key={variant}
          variant={variant}
          optionLabel={optionLabel}
          menuStyle={menuStyle}
          label={label}
          variantLabel={label(VARIANT_I18N[variant], VARIANT_DEFAULT[variant])}
        />
      ))}
    </div>
  );
}
