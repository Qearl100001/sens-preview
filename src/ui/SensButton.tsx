import { Children, cloneElement, isValidElement, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Button, Dropdown, theme, type ButtonProps, type DropdownProps } from "antd";
import { useTranslation } from "react-i18next";
import { buildShadowD3, buildShadowD4, SHADOW_NONE } from "../design-system/color-utils";
import { getButtonPrimaryBorderColor } from "../design-system/theme";
import tokens from "../design-system/tokens.resolved.json";
import { ChevronDownIcon, ChevronUpIcon, EditorAddIcon, IconDefaultIcon, MoreIcon } from "./FieldIcons";
import {
  buildFabPreviewCellSnapshot,
  buildFabToneProps,
  fabColorTokens as c,
  getButtonShadowToken,
  getFabCssVars,
  getFabCrossAxisStyle,
  getFabPrimaryBorderStyle,
  getFabRadiusStyle,
  getFabSecondaryCssVars,
  getFabSinglePaddingStyle,
  isFabTone,
  resolveFabShape,
  type FabTone,
} from "./fabShared";
import { SensDropdownMenu, useSensDropdownMenuStyle } from "./SensDropdownMenu";
import { SensDropdownMenuItem, type SensDropdownMenuItemConfig } from "./SensDropdownMenuItem";

const u = tokens.unit as Record<string, number>;

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  const full = normalized.length === 3 ? normalized.split("").map((ch) => ch + ch).join("") : normalized;
  const int = Number.parseInt(full, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const I18N_NS = "组件库";

const LINK_TONES = new Set<SensButtonVariant>(["link", "linkWeak", "dangerLink", "dangerLinkWeak"]);

function isLinkTone(tone: SensButtonVariant): boolean {
  return LINK_TONES.has(tone);
}

function shouldInsertCnCharSpace(tone: SensButtonVariant, hasIcon: boolean): boolean {
  return !isLinkTone(tone) && !hasIcon;
}

function applyTwoCnCharSpacing(
  content: ReactNode,
  shouldInsert: boolean,
  noSpaceWords?: ReadonlySet<string>,
): ReactNode {
  if (!shouldInsert) return content;

  if (typeof content === "string") {
    const trimmed = content.trim();
    if (noSpaceWords?.has(trimmed)) return content;
    if (/^[\u4E00-\u9FFF]{2}$/.test(trimmed)) {
      return `${trimmed[0]} ${trimmed[1]}`;
    }
    return content;
  }

  if (Array.isArray(content)) {
    return Children.map(content, (item) => applyTwoCnCharSpacing(item, shouldInsert, noSpaceWords));
  }

  if (isValidElement(content)) {
    const nextChildren = applyTwoCnCharSpacing(content.props.children, shouldInsert, noSpaceWords);
    return cloneElement(content, content.props, nextChildren);
  }

  return content;
}

/** 常规无图标两字插空格；链接类 / 有图标保持紧凑。与 SensButton 同规则。 */
export function formatButtonText(
  content: ReactNode,
  options: { tone: SensButtonVariant; hasIcon: boolean; noSpaceWords?: ReadonlySet<string> },
): ReactNode {
  return applyTwoCnCharSpacing(
    content,
    shouldInsertCnCharSpace(options.tone, options.hasIcon),
    options.noSpaceWords,
  );
}

export type SensButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "link"
  | "linkWeak"
  | "dangerSecondary"
  | "dangerTertiary"
  | "dangerLink"
  | "dangerLinkWeak"
  | "dashed";

export type ButtonPreviewState =
  | "default"
  | "hover"
  | "active"
  | "disabled"
  | "disabledHover"
  | "loading"
  | "loadingHover";

/** 下拉按钮核心 4 态（Figma 1257:3688 / 3712 / 3722 / 1264:2830） */
export type DropdownButtonPreviewState = "default" | "hover" | "active" | "open";

const DROPDOWN_CORE_STATE_I18N: Record<DropdownButtonPreviewState, string> = {
  default: "sensd-button-state-default",
  hover: "sensd-button-state-hover",
  active: "sensd-button-state-active",
  open: "sensd-button-dropdown-active",
};

const DROPDOWN_CORE_STATE_DEFAULT: Record<DropdownButtonPreviewState, string> = {
  default: "默认",
  hover: "悬停",
  active: "点击",
  open: "激活",
};

/** 下拉按钮扩展态（展开后的悬停/点击/禁用/加载） */
type DropdownExtraState =
  | "activeHover"
  | "activeActive"
  | "disabled"
  | "disabledHover"
  | "loading"
  | "loadingHover";

const DROPDOWN_EXTRA_STATE_I18N: Record<DropdownExtraState, string> = {
  activeHover: "sensd-button-dropdown-activeHover",
  activeActive: "sensd-button-dropdown-activeActive",
  disabled: "sensd-button-state-disabled",
  disabledHover: "sensd-button-state-disabledHover",
  loading: "sensd-button-state-loading",
  loadingHover: "sensd-button-state-loadingHover",
};

const DROPDOWN_EXTRA_STATE_DEFAULT: Record<DropdownExtraState, string> = {
  activeHover: "激活悬停",
  activeActive: "激活点击",
  disabled: "禁用",
  disabledHover: "禁用悬停",
  loading: "加载",
  loadingHover: "加载悬停",
};

const LINK_NO_FILL: CSSProperties = { backgroundColor: "transparent", borderColor: "transparent" };

interface ButtonShadowToken {
  hover: string;
  floating: string;
}

function hasPersistentD4Shadow(_tone: SensButtonVariant, fab?: boolean): boolean {
  return !!fab;
}

function isHoverShadowTone(tone: SensButtonVariant): boolean {
  return tone === "primary" || tone === "secondary" || tone === "dangerSecondary";
}

function isDisabledPreviewState(state: ButtonPreviewState): boolean {
  return state === "disabled" || state === "loading" || state === "disabledHover" || state === "loadingHover";
}

function resolvePreviewShadow(
  tone: SensButtonVariant,
  state: ButtonPreviewState,
  shadows: ButtonShadowToken,
  fab?: boolean,
): string {
  if (hasPersistentD4Shadow(tone, fab)) return shadows.floating;
  if (isDisabledPreviewState(state)) return SHADOW_NONE;
  if (isHoverShadowTone(tone) && state === "hover") return shadows.hover;
  return SHADOW_NONE;
}

function resolveLiveShadow(
  tone: SensButtonVariant,
  { isHovered, isDisabled }: { isHovered: boolean; isDisabled: boolean },
  shadows: ButtonShadowToken,
  fab?: boolean,
): string {
  if (hasPersistentD4Shadow(tone, fab)) return shadows.floating;
  if (isDisabled) return SHADOW_NONE;
  if (isHoverShadowTone(tone) && isHovered) return shadows.hover;
  return SHADOW_NONE;
}

function mergePreviewStyle(
  tone: SensButtonVariant,
  state: ButtonPreviewState,
  style: CSSProperties | undefined,
  shadows: ButtonShadowToken,
): CSSProperties {
  return { ...style, boxShadow: resolvePreviewShadow(tone, state, shadows) };
}

function buildDropdownCoreSnapshot(
  state: DropdownButtonPreviewState,
  t: PreviewStyleToken,
): PreviewCellSnapshot {
  switch (state) {
    case "default":
      return { buttonProps: {}, icon: <ChevronDownIcon />, style: { ...LINK_NO_FILL, color: t.link, boxShadow: SHADOW_NONE } };
    case "hover":
      return { buttonProps: {}, icon: <ChevronDownIcon />, style: { ...LINK_NO_FILL, color: t.linkHover, boxShadow: SHADOW_NONE } };
    case "active":
      return { buttonProps: {}, icon: <ChevronDownIcon />, style: { ...LINK_NO_FILL, color: t.linkActive, boxShadow: SHADOW_NONE } };
    case "open":
      return { buttonProps: {}, icon: <ChevronUpIcon />, style: { ...LINK_NO_FILL, color: t.link, boxShadow: SHADOW_NONE } };
    default:
      return { buttonProps: {} };
  }
}

function buildDropdownExtraSnapshot(
  state: DropdownExtraState,
  t: PreviewStyleToken,
): PreviewCellSnapshot {
  switch (state) {
    case "activeHover":
      return {
        buttonProps: {},
        icon: <ChevronUpIcon />,
        style: { ...LINK_NO_FILL, color: t.linkHover, boxShadow: SHADOW_NONE },
      };
    case "activeActive":
      return {
        buttonProps: {},
        icon: <ChevronUpIcon />,
        style: { ...LINK_NO_FILL, color: t.linkActive, boxShadow: SHADOW_NONE },
      };
    case "disabled":
      return {
        buttonProps: {},
        icon: <ChevronDownIcon />,
        style: { ...LINK_NO_FILL, color: t.disabledText, boxShadow: SHADOW_NONE },
      };
    case "disabledHover":
      return {
        buttonProps: {},
        icon: <ChevronDownIcon />,
        style: { ...LINK_NO_FILL, color: t.disabledHoverText, boxShadow: SHADOW_NONE },
      };
    case "loading":
      return {
        buttonProps: {},
        icon: <LoadingOutlined spin />,
        style: { ...LINK_NO_FILL, color: t.disabledText, boxShadow: SHADOW_NONE },
      };
    case "loadingHover":
      return {
        buttonProps: {},
        icon: <LoadingOutlined spin />,
        style: { ...LINK_NO_FILL, color: t.disabledHoverText, boxShadow: SHADOW_NONE },
      };
    default:
      return { buttonProps: {} };
  }
}

const BUTTON_STATE_I18N: Record<ButtonPreviewState, string> = {
  default: "sensd-button-state-default",
  hover: "sensd-button-state-hover",
  active: "sensd-button-state-active",
  disabled: "sensd-button-state-disabled",
  disabledHover: "sensd-button-state-disabledHover",
  loading: "sensd-button-state-loading",
  loadingHover: "sensd-button-state-loadingHover",
};

function buildToneProps(variant: SensButtonVariant): ButtonProps {
  switch (variant) {
    case "primary":
      return { color: "primary", variant: "solid" };
    case "secondary":
      return { color: "default", variant: "outlined" };
    case "tertiary":
      return { color: "primary", variant: "text" };
    case "link":
      return { type: "link" };
    case "linkWeak":
      return { type: "link", className: "sens-btn-link-weak" };
    case "dangerSecondary":
      return { color: "danger", variant: "outlined" };
    case "dangerTertiary":
      return { color: "danger", variant: "text" };
    case "dangerLink":
      return { color: "danger", variant: "link" };
    case "dangerLinkWeak":
      return { type: "link", className: "sens-btn-danger-link-weak" };
    case "dashed":
      return { color: "default", variant: "dashed", icon: <EditorAddIcon /> };
    default:
      return {};
  }
}

type PreviewSize = "large" | "small";

interface PreviewEntry {
  key: string;
  titleKey: string;
  titleDefault: string;
  tone: SensButtonVariant;
  content: ReactNode;
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  shape?: ButtonProps["shape"];
}

interface FabPreviewEntry {
  key: string;
  titleKey: string;
  titleDefault: string;
  tone: FabTone;
  content: ReactNode;
  icon?: ReactNode;
  iconPosition?: "start" | "end";
}

interface PreviewStyleToken {
  primary: string;
  primaryHover: string;
  primaryActive: string;
  warning: string;
  warningHover: string;
  warningActive: string;
  link: string;
  linkHover: string;
  linkActive: string;
  textSecondary: string;
  textDisabled: string;
  /** 中性/文字/01_主要、中性/图标/01_主要（dangerLinkWeak 默认态） */
  textPrimary: string;
  iconPrimary: string;
  bgContainer: string;
  /** 一级常规实心描边 midnight-dark-04 */
  primarySolidBorder: string;
  dashedDefaultBorder: string;
  dashedDefaultText: string;
  /** Figma midnight-dark 禁用态 */
  disabledBg: string;
  disabledBorder: string;
  disabledText: string;
  disabledHoverBg: string;
  disabledHoverBorder: string;
  disabledHoverText: string;
}

function getPreviewStyleToken(antdToken: ReturnType<typeof theme.useToken>["token"]): PreviewStyleToken {
  return {
    primary: c["component-primary"],
    primaryHover: c["component-hover"],
    primaryActive: c["component-active"],
    warning: c["warning-color"],
    warningHover: c["warning-color-hover"],
    warningActive: c["warning-color-active"],
    link: antdToken.colorLink,
    linkHover: antdToken.colorLinkHover,
    linkActive: antdToken.colorLinkActive,
    textSecondary: c["text-sub-color"],
    textDisabled: c["text-color-disable"],
    textPrimary: c["text-color-transparent"],
    iconPrimary: c["icon-color-transparent"],
    bgContainer: c.white,
    primarySolidBorder: getButtonPrimaryBorderColor(),
    dashedDefaultBorder: hexToRgba(c["outline-color-transparent"], 0.16),
    dashedDefaultText: hexToRgba(c["text-color-transparent"], 0.9),
    disabledBg: hexToRgba(c["outline-color-transparent"], 0.06),
    disabledBorder: hexToRgba(c["outline-color-transparent"], 0.08),
    disabledText: hexToRgba(c["text-color-transparent-disable"], 0.3),
    disabledHoverBg: hexToRgba(c["background-transparent-grey"], 0.04),
    disabledHoverBorder: hexToRgba(c["outline-color-transparent"], 0.06),
    disabledHoverText: hexToRgba(c["text-color-transparent-disable"], 0.24),
  };
}

/** 默认态色样（仅 default 列使用） */
function getDefaultSnapshotStyle(tone: SensButtonVariant, t: PreviewStyleToken): CSSProperties {
  switch (tone) {
    case "primary":
      return { backgroundColor: t.primary, borderColor: t.primarySolidBorder, color: t.bgContainer };
    case "secondary":
      return { color: t.textPrimary, borderColor: t.dashedDefaultBorder, backgroundColor: t.bgContainer };
    case "tertiary":
      return { color: t.primary, backgroundColor: "transparent", borderColor: "transparent" };
    case "link":
      return { color: t.link, backgroundColor: "transparent", borderColor: "transparent" };
    case "linkWeak":
      return { color: t.textSecondary, backgroundColor: "transparent", borderColor: "transparent" };
    case "dangerLinkWeak":
      return { color: t.textPrimary, backgroundColor: "transparent", borderColor: "transparent" };
    case "dangerSecondary":
      return { color: t.warning, borderColor: t.warning, backgroundColor: t.bgContainer };
    case "dangerTertiary":
    case "dangerLink":
      return { color: t.warning, backgroundColor: "transparent", borderColor: "transparent" };
    case "dashed":
      return { color: t.dashedDefaultText, borderColor: t.dashedDefaultBorder, backgroundColor: t.bgContainer };
    default:
      return {};
  }
}

/** 二级/三级：任何状态都不加填充色（白底/透明底） */
function isNoFillTone(tone: SensButtonVariant): boolean {
  return (
    tone === "secondary" ||
    tone === "tertiary" ||
    tone === "dangerSecondary" ||
    tone === "dangerTertiary"
  );
}

/** 禁用态静态样张（loading 列复用） */
function getDisabledSnapshotStyle(tone: SensButtonVariant, t: PreviewStyleToken): CSSProperties {
  if (isNoFillTone(tone)) {
    if (tone === "tertiary" || tone === "dangerTertiary") {
      return { color: t.disabledText, backgroundColor: "transparent", borderColor: "transparent" };
    }
    return { backgroundColor: t.bgContainer, borderColor: t.disabledBorder, color: t.disabledText };
  }
  switch (tone) {
    case "primary":
    case "dashed":
      return { backgroundColor: t.disabledBg, borderColor: t.disabledBorder, color: t.disabledText };
    case "link":
    case "linkWeak":
    case "dangerLink":
    case "dangerLinkWeak":
      return { color: t.textDisabled, backgroundColor: "transparent", borderColor: "transparent" };
    default:
      return {};
  }
}

/** 禁用悬停 / 加载悬停静态样张 */
function getDisabledHoverSnapshotStyle(tone: SensButtonVariant, t: PreviewStyleToken): CSSProperties {
  if (isNoFillTone(tone)) {
    if (tone === "tertiary" || tone === "dangerTertiary") {
      return { color: t.disabledHoverText, backgroundColor: "transparent", borderColor: "transparent" };
    }
    return {
      backgroundColor: t.bgContainer,
      borderColor: t.disabledHoverBorder,
      color: t.disabledHoverText,
    };
  }
  switch (tone) {
    case "primary":
    case "dashed":
      return {
        backgroundColor: t.disabledHoverBg,
        borderColor: t.disabledHoverBorder,
        color: t.disabledHoverText,
      };
    case "link":
    case "linkWeak":
    case "dangerLink":
    case "dangerLinkWeak":
      return { color: t.textDisabled, backgroundColor: "transparent", borderColor: "transparent" };
    default:
      return {};
  }
}

function getHoverSnapshotStyle(tone: SensButtonVariant, t: PreviewStyleToken): CSSProperties {
  switch (tone) {
    case "primary":
      return { backgroundColor: t.primaryHover, borderColor: t.primarySolidBorder, color: t.bgContainer };
    case "secondary":
      return { color: t.primaryHover, borderColor: t.primaryHover, backgroundColor: t.bgContainer };
      case "tertiary":
        return { color: t.primaryHover, backgroundColor: "transparent", borderColor: "transparent" };
      case "link":
        return { color: t.linkHover, backgroundColor: "transparent" };
      case "linkWeak":
        return { color: t.link, backgroundColor: "transparent" };
      case "dangerLinkWeak":
        return { color: t.warning, backgroundColor: "transparent", borderColor: "transparent" };
      case "dangerSecondary":
        return { color: t.warningHover, borderColor: t.warningHover, backgroundColor: t.bgContainer };
      case "dangerTertiary":
      case "dangerLink":
        return { color: t.warningHover, backgroundColor: "transparent", borderColor: "transparent" };
      case "dashed":
        return { color: t.primary, borderColor: t.primary, backgroundColor: t.bgContainer };
      default:
        return {};
  }
}

function getActiveSnapshotStyle(tone: SensButtonVariant, t: PreviewStyleToken): CSSProperties {
  switch (tone) {
    case "primary":
      return { backgroundColor: t.primaryActive, borderColor: t.primarySolidBorder, color: t.bgContainer };
    case "secondary":
      return { color: t.primaryActive, borderColor: t.primaryActive, backgroundColor: t.bgContainer };
    case "tertiary":
      return { color: t.primaryActive, backgroundColor: "transparent", borderColor: "transparent" };
    case "link":
    case "linkWeak":
      return { color: t.linkActive, backgroundColor: "transparent" };
    case "dangerLinkWeak":
      return { color: t.warningActive, backgroundColor: "transparent", borderColor: "transparent" };
    case "dangerSecondary":
      return { color: t.warningActive, borderColor: t.warningActive, backgroundColor: t.bgContainer };
    case "dangerTertiary":
    case "dangerLink":
      return { color: t.warningActive, backgroundColor: "transparent", borderColor: "transparent" };
    case "dashed":
      return { color: t.primaryActive, borderColor: t.primaryActive, backgroundColor: t.bgContainer };
    default:
      return {};
  }
}

interface PreviewCellSnapshot {
  buttonProps: ButtonProps;
  style?: CSSProperties;
  icon?: ReactNode;
}

/**
 * 预览板状态模型：每格一个互斥静态样张，不叠加 props 模拟。
 * Figma v2.1：disabledHover === loadingHover；disabled === loading（灰中性色 + 转圈）。
 */
function buildPreviewCellSnapshot(
  tone: SensButtonVariant,
  state: ButtonPreviewState,
  styleToken: PreviewStyleToken,
  shadowToken: ButtonShadowToken,
): PreviewCellSnapshot {
  let snapshot: PreviewCellSnapshot;
  switch (state) {
    case "default":
      snapshot = { buttonProps: {} };
      break;
    case "hover":
      snapshot = { buttonProps: {}, style: getHoverSnapshotStyle(tone, styleToken) };
      break;
    case "active":
      snapshot = { buttonProps: {}, style: getActiveSnapshotStyle(tone, styleToken) };
      break;
    case "disabled":
      snapshot = { buttonProps: {}, style: getDisabledSnapshotStyle(tone, styleToken) };
      break;
    case "loading":
      snapshot = {
        buttonProps: {},
        icon: <LoadingOutlined spin />,
        style: getDisabledSnapshotStyle(tone, styleToken),
      };
      break;
    case "disabledHover":
    case "loadingHover":
      snapshot = {
        buttonProps: {},
        icon: state === "loadingHover" ? <LoadingOutlined spin /> : undefined,
        style: getDisabledHoverSnapshotStyle(tone, styleToken),
      };
      break;
    default:
      snapshot = { buttonProps: {} };
  }

  return {
    ...snapshot,
    style: mergePreviewStyle(tone, state, snapshot.style, shadowToken),
  };
}

function getDangerLinkWeakCssVars(): CSSProperties {
  return {
    "--sens-btn-danger-link-weak-text": c["text-color-transparent"],
    "--sens-btn-danger-link-weak-icon": c["icon-color-transparent"],
    "--sens-btn-danger-link-weak-warning": c["warning-color"],
    "--sens-btn-danger-link-weak-warning-active": c["warning-color-active"],
  } as CSSProperties;
}

function resolveDangerLinkWeakPreviewIcon(
  tone: SensButtonVariant,
  state: ButtonPreviewState,
  icon: ReactNode | undefined,
  t: PreviewStyleToken,
): ReactNode | undefined {
  if (tone !== "dangerLinkWeak" || !icon || !isValidElement(icon)) return icon;

  const color = (() => {
    switch (state) {
      case "default":
        return t.iconPrimary;
      case "hover":
        return t.warning;
      case "active":
        return t.warningActive;
      case "disabled":
      case "disabledHover":
      case "loading":
      case "loadingHover":
        return t.textDisabled;
      default:
        return undefined;
    }
  })();

  if (!color) return icon;
  return cloneElement(icon, {
    style: { ...(icon.props.style ?? {}), color },
  });
}

export interface SensButtonProps extends Omit<ButtonProps, "type" | "variant"> {
  tone?: SensButtonVariant;
  /** 横向单项 FAB：与 tone=primary|secondary 组合；圆角 999、恒 D4 投影、二级无描边白底 */
  fab?: boolean;
}

/** 按钮语义封装：仅通过 antd props + 主题 token 驱动样式。 */
export function SensButton({
  tone = "secondary",
  fab = false,
  className,
  children,
  loading,
  disabled,
  style,
  shape: shapeProp,
  size: sizeProp,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  ...rest
}: SensButtonProps) {
  const shadows = getButtonShadowToken();
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const isFab = fab && isFabTone(tone);
  const toneProps = isFab ? buildFabToneProps(tone) : buildToneProps(tone);
  const isLoading = !!loading;
  const isDisabled = disabled || isLoading;
  const resolvedIcon = rest.icon ?? toneProps.icon;
  const fabShape = isFab ? resolveFabShape(children, resolvedIcon, isLoading) : undefined;
  const mergedClassName = [toneProps.className, className].filter(Boolean).join(" ") || undefined;
  const { className: _toneClassName, icon: _toneIcon, ...restToneProps } = toneProps;
  const boxShadow = resolveLiveShadow(tone, { isHovered, isDisabled }, shadows, isFab);
  const primaryBorderStyle: CSSProperties =
    tone === "primary" && !isFab ? { borderColor: getButtonPrimaryBorderColor() } : {};
  const dangerLinkWeakStyle = tone === "dangerLinkWeak" ? getDangerLinkWeakCssVars() : {};
  const fabStyle: CSSProperties = isFab
    ? {
        ...getFabCssVars(),
        ...getFabRadiusStyle(),
        ...getFabCrossAxisStyle(children, resolvedIcon, isLoading),
        ...getFabSinglePaddingStyle(children, resolvedIcon, isLoading),
        ...(tone === "primary" ? getFabPrimaryBorderStyle() : {}),
        ...(tone === "secondary"
          ? {
              ...getFabSecondaryCssVars(),
              backgroundColor: c.white,
            }
          : {}),
      }
    : {};
  const hasIcon = Boolean(resolvedIcon) || isLoading;
  const buttonText = formatButtonText(children, { tone, hasIcon });

  useEffect(() => {
    if (!isFab || tone !== "secondary") return;
    const el = buttonRef.current;
    if (!el) return;
    if (isDisabled) {
      el.removeAttribute("data-fab-hover");
      el.removeAttribute("data-fab-active");
      return;
    }
    if (isPressed) {
      el.setAttribute("data-fab-active", "");
      el.removeAttribute("data-fab-hover");
      return;
    }
    if (isHovered) {
      el.setAttribute("data-fab-hover", "");
      el.removeAttribute("data-fab-active");
      return;
    }
    el.removeAttribute("data-fab-hover");
    el.removeAttribute("data-fab-active");
  }, [isFab, tone, isHovered, isPressed, isDisabled]);

  const handleMouseEnter: NonNullable<ButtonProps["onMouseEnter"]> = (event) => {
    setIsHovered(true);
    onMouseEnter?.(event);
  };

  const handleMouseLeave: NonNullable<ButtonProps["onMouseLeave"]> = (event) => {
    setIsHovered(false);
    setIsPressed(false);
    onMouseLeave?.(event);
  };

  const buttonNode = (
    <Button
      ref={buttonRef}
      {...restToneProps}
      {...rest}
      size={isFab ? undefined : sizeProp}
      shape={isFab ? fabShape : shapeProp}
      loading={loading}
      disabled={isDisabled}
      className={mergedClassName}
      style={{ ...dangerLinkWeakStyle, ...style, ...primaryBorderStyle, ...fabStyle, boxShadow }}
      onMouseEnter={isFab && tone === "secondary" ? undefined : handleMouseEnter}
      onMouseLeave={isFab && tone === "secondary" ? undefined : handleMouseLeave}
      onMouseDown={(event) => {
        if (isFab && tone === "secondary") setIsPressed(true);
        onMouseDown?.(event);
      }}
      onMouseUp={(event) => {
        if (isFab && tone === "secondary") setIsPressed(false);
        onMouseUp?.(event);
      }}
    >
      {buttonText}
    </Button>
  );

  if (isFab && tone === "secondary") {
    return (
      <span
        className="sens-btn-fab-wrap"
        style={{ display: "inline-flex" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseOver={() => setIsHovered(true)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
      >
        {buttonNode}
      </span>
    );
  }

  return buttonNode;
}

export type SensMoreButtonTone = Extract<SensButtonVariant, "primary" | "secondary" | "tertiary">;

export interface SensMoreButtonProps extends Omit<SensButtonProps, "tone" | "icon" | "iconPosition"> {
  /** 与同级别主/次/三级按钮一致；矩阵默认 secondary */
  tone?: SensMoreButtonTone;
}

/** 更多 ··· 按钮（Figma 矩阵「更多 / 大尺寸」；二级 + 横向省略号尾图标） */
export function SensMoreButton({ tone = "secondary", children, ...rest }: SensMoreButtonProps) {
  return (
    <SensButton tone={tone} icon={<MoreIcon />} iconPosition="end" {...rest}>
      {children}
    </SensButton>
  );
}

export type { SensDropdownMenuItemConfig } from "./SensDropdownMenuItem";

export interface SensDropdownButtonProps extends Omit<ButtonProps, "type" | "variant" | "color" | "icon" | "iconPosition"> {
  items: SensDropdownMenuItemConfig[];
  dropdownProps?: Omit<DropdownProps, "menu" | "children" | "dropdownRender" | "popupRender">;
}

/** 下拉链接按钮：收起 ▼，展开 ▲（Figma 1257:3688–3722 / 1264:2830）；默认 click 展开，非 antd hover */
export function SensDropdownButton({
  children,
  items,
  dropdownProps,
  className,
  loading,
  disabled,
  style,
  ...rest
}: SensDropdownButtonProps) {
  const isLoading = !!loading;
  const isDisabled = disabled || isLoading;
  const menuStyle = useSensDropdownMenuStyle();
  const {
    open,
    onOpenChange,
    overlayClassName: dropdownOverlayClassName,
    overlayStyle: dropdownOverlayStyle,
    trigger: dropdownTrigger,
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
  /** portal 根须注入 token 变量；内层 SensDropdownMenu 再挂一份，双保险继承到行 */
  const overlayStyle = { ...menuStyle, ...dropdownOverlayStyle };

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
      trigger={dropdownTrigger ?? ["click"]}
      overlayClassName={overlayClassName}
      overlayStyle={overlayStyle}
    >
      <SensButton
        tone="link"
        icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        iconPosition="end"
        loading={loading}
        disabled={disabled}
        className={["sens-dropdown-btn", className].filter(Boolean).join(" ")}
        style={style}
        {...rest}
      >
        {children}
      </SensButton>
    </Dropdown>
  );
}

function FabPreviewMatrixButton({
  tone,
  previewState,
  fabToneProps,
  fabShape,
  snapshot,
  resolvedIcon,
  iconPosition,
  cellContent,
  isLoadingState,
}: {
  tone: FabTone;
  previewState: ButtonPreviewState;
  fabToneProps: ButtonProps;
  fabShape: NonNullable<ButtonProps["shape"]>;
  snapshot: PreviewCellSnapshot;
  resolvedIcon: ReactNode | undefined;
  iconPosition?: "start" | "end";
  cellContent: ReactNode;
  isLoadingState: boolean;
}) {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

  return (
    <Button
      {...fabToneProps}
      ref={buttonRef}
      shape={fabShape}
      {...snapshot.buttonProps}
      icon={resolvedIcon}
      iconPosition={iconPosition}
      className={[
        fabToneProps.className,
        tone === "secondary" ? `sens-btn-fab-preview-${previewState}` : undefined,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        ...(tone === "secondary" ? getFabSecondaryCssVars() : {}),
        ...getFabCssVars(),
        ...getFabCrossAxisStyle(cellContent, resolvedIcon, isLoadingState),
        ...getFabSinglePaddingStyle(cellContent, resolvedIcon, isLoadingState),
        ...snapshot.style,
      }}
    >
      {cellContent}
    </Button>
  );
}

function FabPreviewRow({
  entry,
  styleToken,
  shadowToken,
  label,
  stateLabel,
  sizeLabel,
}: {
  entry: FabPreviewEntry;
  styleToken: PreviewStyleToken;
  shadowToken: ButtonShadowToken;
  label: (key: string, defaultValue: string) => string;
  stateLabel: (state: ButtonPreviewState) => string;
  sizeLabel: (size: PreviewSize) => string;
}) {
  const states: ButtonPreviewState[] = ["default", "hover", "active", "disabled", "disabledHover", "loading", "loadingHover"];

  return (
    <div className="sens-btn-matrix-row">
      <span className="sens-btn-matrix-title">
        {label(entry.titleKey, entry.titleDefault)} / {sizeLabel("large")}
      </span>
      <div className="sens-btn-matrix-states">
        {states.map((state) => {
          const snapshot = buildFabPreviewCellSnapshot(entry.tone, state, styleToken, shadowToken);
          const isLoadingState = state === "loading" || state === "loadingHover";
          const resolvedIcon = isLoadingState ? <LoadingOutlined spin /> : entry.icon;
          const hasIcon = Boolean(resolvedIcon);
          const cellContent = formatButtonText(entry.content, { tone: entry.tone, hasIcon });
          const fabShape = resolveFabShape(entry.content, resolvedIcon, isLoadingState);
          const fabToneProps = buildFabToneProps(entry.tone);
          return (
            <div key={state} className="sens-btn-matrix-cell">
              <span className="sens-btn-matrix-label">{stateLabel(state)}</span>
              <div className="sens-btn-preview">
                <FabPreviewMatrixButton
                  tone={entry.tone}
                  previewState={state}
                  fabToneProps={fabToneProps}
                  fabShape={fabShape}
                  snapshot={snapshot}
                  resolvedIcon={resolvedIcon}
                  iconPosition={entry.iconPosition}
                  cellContent={cellContent}
                  isLoadingState={isLoadingState}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface PreviewRowProps {
  entry: PreviewEntry;
  size: PreviewSize;
  styleToken: PreviewStyleToken;
  shadowToken: ButtonShadowToken;
  label: (key: string, defaultValue: string) => string;
  stateLabel: (state: ButtonPreviewState) => string;
  sizeLabel: (size: PreviewSize) => string;
}

function PreviewRow({ entry, size, styleToken, shadowToken, label, stateLabel, sizeLabel }: PreviewRowProps) {
  const states: ButtonPreviewState[] = ["default", "hover", "active", "disabled", "disabledHover", "loading", "loadingHover"];
  const sizeProps: ButtonProps = size === "small" ? { size: "small" } : {};
  const isMoreEntry = entry.key === "more";

  return (
    <div className="sens-btn-matrix-row">
      <span className="sens-btn-matrix-title">
        {label(entry.titleKey, entry.titleDefault)} / {sizeLabel(size)}
      </span>
      <div className="sens-btn-matrix-states">
        {states.map((state) => {
          const snapshot = buildPreviewCellSnapshot(entry.tone, state, styleToken, shadowToken);
          const previewIcon = resolveDangerLinkWeakPreviewIcon(
            entry.tone,
            state,
            snapshot.icon ?? entry.icon,
            styleToken,
          );
          const resolvedIcon = previewIcon ?? buildToneProps(entry.tone).icon;
          const hasIcon = Boolean(resolvedIcon);
          const cellContent = formatButtonText(entry.content, {
            tone: entry.tone,
            hasIcon: isMoreEntry ? true : hasIcon,
          });
          const previewStyle: CSSProperties = {
            ...snapshot.style,
            pointerEvents: "none",
          };
          const isDisabledState = state === "disabled" || state === "disabledHover";
          const isLoadingState = state === "loading" || state === "loadingHover";

          return (
          <div key={state} className="sens-btn-matrix-cell">
            <span className="sens-btn-matrix-label">{stateLabel(state)}</span>
            <div className="sens-btn-preview">
              {isMoreEntry ? (
                <SensMoreButton
                  tone="secondary"
                  {...sizeProps}
                  {...snapshot.buttonProps}
                  disabled={isDisabledState}
                  loading={isLoadingState}
                  style={previewStyle}
                >
                  {cellContent}
                </SensMoreButton>
              ) : (
                <Button
                  {...buildToneProps(entry.tone)}
                  {...sizeProps}
                  shape={entry.shape}
                  {...snapshot.buttonProps}
                  icon={previewIcon ?? buildToneProps(entry.tone).icon}
                  iconPosition={entry.iconPosition}
                  style={{
                    ...(entry.tone === "dangerLinkWeak" ? getDangerLinkWeakCssVars() : {}),
                    ...previewStyle,
                  }}
                >
                  {cellContent}
                </Button>
              )}
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}

interface DropdownCorePreviewProps {
  styleToken: PreviewStyleToken;
  label: (key: string, defaultValue: string) => string;
  moreLabel: ReactNode;
}

/** Figma 核心 4 态：默认 / 悬停 / 点击（▼）/ 激活（▲） */
function DropdownCorePreview({ styleToken, label, moreLabel }: DropdownCorePreviewProps) {
  const states: DropdownButtonPreviewState[] = ["default", "hover", "active", "open"];

  return (
    <div className="sens-btn-extra-row">
      {states.map((state) => {
        const snapshot = buildDropdownCoreSnapshot(state, styleToken);
        return (
          <div key={state} className="sens-btn-matrix-cell">
            <span className="sens-btn-matrix-label">
              {label(DROPDOWN_CORE_STATE_I18N[state], DROPDOWN_CORE_STATE_DEFAULT[state])}
            </span>
            <div className="sens-btn-preview">
              <Button
                type="link"
                icon={snapshot.icon}
                iconPosition="end"
                className="sens-dropdown-btn"
                style={snapshot.style}
              >
                {formatButtonText(moreLabel, { tone: "link", hasIcon: true })}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface DropdownExtraPreviewProps {
  styleToken: PreviewStyleToken;
  label: (key: string, defaultValue: string) => string;
  moreLabel: ReactNode;
}

/** 展开后的扩展态：激活悬停/激活点击/禁用/加载 */
function DropdownExtraPreview({ styleToken, label, moreLabel }: DropdownExtraPreviewProps) {
  const states: DropdownExtraState[] = [
    "activeHover",
    "activeActive",
    "disabled",
    "disabledHover",
    "loading",
    "loadingHover",
  ];

  return (
    <div className="sens-btn-extra-row">
      {states.map((state) => {
        const snapshot = buildDropdownExtraSnapshot(state, styleToken);
        return (
          <div key={state} className="sens-btn-matrix-cell">
            <span className="sens-btn-matrix-label">
              {label(DROPDOWN_EXTRA_STATE_I18N[state], DROPDOWN_EXTRA_STATE_DEFAULT[state])}
            </span>
            <div className="sens-btn-preview">
              <Button
                type="link"
                icon={snapshot.icon}
                iconPosition="end"
                className="sens-dropdown-btn"
                style={snapshot.style}
              >
                {formatButtonText(moreLabel, { tone: "link", hasIcon: true })}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function useButtonPreviewVars(): CSSProperties {
  return {
    "--sens-btn-space-2x": `${u["spacing/2x"]}px`,
    "--sens-btn-space-5x": `${u["spacing/5x"]}px`,
    "--sens-btn-space-6x": `${u["spacing/6x"]}px`,
    "--sens-btn-width-trigger": `${u["size/component-height/m"]}px`,
    ...getFabCssVars(),
    ...getDangerLinkWeakCssVars(),
  } as CSSProperties;
}

export interface ButtonStatesPreviewProps {
  title?: ReactNode;
  /** 插在「横向单项 FAB」与「下拉」之间的预览区（如组合 FAB） */
  afterFabSection?: ReactNode;
}

export function ButtonStatesPreview({ title, afterFabSection }: ButtonStatesPreviewProps) {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const styleToken = getPreviewStyleToken(token);
  const shadowToken = getButtonShadowToken();

  const label = (key: string, defaultValue: string) => t(`${I18N_NS}.${key}`, { defaultValue });
  const stateLabel = (state: ButtonPreviewState) => label(BUTTON_STATE_I18N[state], state);
  const sizeLabel = (size: PreviewSize) =>
    label(size === "large" ? "sensd-button-size-large" : "sensd-button-size-small", size === "large" ? "大尺寸" : "小尺寸");

  const moreWord = label("sensd-button-action-more", "更多");
  const buttonLabel = label("sensd-button-action-button", "按钮");
  const addLabel = label("sensd-button-action-add", "添加");
  const moreLabel = moreWord;
  const confirmDeleteLabel = label("sensd-button-action-confirmDelete", "确认删除");

  const baseEntries: PreviewEntry[] = [
    { key: "primary", titleKey: "sensd-button-group-primary", titleDefault: "常规 / 一级", tone: "primary", content: buttonLabel },
    { key: "secondary", titleKey: "sensd-button-group-secondary", titleDefault: "常规 / 二级", tone: "secondary", content: buttonLabel },
    { key: "tertiary", titleKey: "sensd-button-group-tertiary", titleDefault: "常规 / 三级", tone: "tertiary", content: buttonLabel },
    { key: "dashed", titleKey: "sensd-button-group-dashed", titleDefault: "虚线", tone: "dashed", content: addLabel },
    { key: "more", titleKey: "sensd-button-group-more", titleDefault: "更多", tone: "secondary", content: moreLabel },
  ];

  const linkEntries: PreviewEntry[] = [
    { key: "link-icon", titleKey: "sensd-button-link-icon", titleDefault: "链接 / 常规 / 纯图标", tone: "link", content: null, icon: <IconDefaultIcon /> },
    { key: "link-icon-text", titleKey: "sensd-button-link-iconText", titleDefault: "链接 / 常规 / 图标+文字", tone: "link", content: buttonLabel, icon: <IconDefaultIcon /> },
    { key: "link-text", titleKey: "sensd-button-link-text", titleDefault: "链接 / 常规 / 纯文字", tone: "link", content: buttonLabel },
    { key: "linkWeak-icon", titleKey: "sensd-button-linkWeak-icon", titleDefault: "链接 / 弱化 / 纯图标", tone: "linkWeak", content: null, icon: <IconDefaultIcon /> },
    { key: "linkWeak-icon-text", titleKey: "sensd-button-linkWeak-iconText", titleDefault: "链接 / 弱化 / 图标+文字", tone: "linkWeak", content: buttonLabel, icon: <IconDefaultIcon /> },
    { key: "linkWeak-text", titleKey: "sensd-button-linkWeak-text", titleDefault: "链接 / 弱化 / 纯文字", tone: "linkWeak", content: buttonLabel },
  ];

  const warningEntries: PreviewEntry[] = [
    { key: "danger-secondary-off", titleKey: "sensd-button-danger-secondaryOff", titleDefault: "警告 / 二级 / 二次确认关", tone: "dangerSecondary", content: buttonLabel },
    { key: "danger-secondary-on", titleKey: "sensd-button-danger-secondaryOn", titleDefault: "警告 / 二级 / 二次确认开", tone: "dangerSecondary", content: confirmDeleteLabel },
    { key: "danger-tertiary-off", titleKey: "sensd-button-danger-tertiaryOff", titleDefault: "警告 / 三级 / 二次确认关", tone: "dangerTertiary", content: buttonLabel },
    { key: "danger-tertiary-on", titleKey: "sensd-button-danger-tertiaryOn", titleDefault: "警告 / 三级 / 二次确认开", tone: "dangerTertiary", content: confirmDeleteLabel },
    { key: "danger-link-off", titleKey: "sensd-button-danger-linkOff", titleDefault: "警告 / 链接 / 二次确认关", tone: "dangerLink", content: buttonLabel },
    { key: "danger-link-on", titleKey: "sensd-button-danger-linkOn", titleDefault: "警告 / 链接 / 二次确认开", tone: "dangerLink", content: confirmDeleteLabel },
    { key: "dangerLinkWeak-icon", titleKey: "sensd-button-dangerLinkWeak-icon", titleDefault: "警告 / 链接弱化 / 纯图标", tone: "dangerLinkWeak", content: null, icon: <IconDefaultIcon /> },
    { key: "dangerLinkWeak-icon-text", titleKey: "sensd-button-dangerLinkWeak-iconText", titleDefault: "警告 / 链接弱化 / 图标+文字", tone: "dangerLinkWeak", content: buttonLabel, icon: <IconDefaultIcon /> },
    { key: "dangerLinkWeak-text", titleKey: "sensd-button-dangerLinkWeak-text", titleDefault: "警告 / 链接弱化 / 纯文字", tone: "dangerLinkWeak", content: buttonLabel },
  ];

  const fabEntries: FabPreviewEntry[] = [
    { key: "fab-primary-text", titleKey: "sensd-button-fab-primary-text", titleDefault: "FAB / 一级 / 纯文字", tone: "primary", content: buttonLabel },
    { key: "fab-primary-icon-text", titleKey: "sensd-button-fab-primary-iconText", titleDefault: "FAB / 一级 / 图标+文字", tone: "primary", content: buttonLabel, icon: <IconDefaultIcon /> },
    { key: "fab-primary-icon", titleKey: "sensd-button-fab-primary-icon", titleDefault: "FAB / 一级 / 纯图标", tone: "primary", content: null, icon: <IconDefaultIcon /> },
    { key: "fab-secondary-text", titleKey: "sensd-button-fab-secondary-text", titleDefault: "FAB / 二级 / 纯文字", tone: "secondary", content: buttonLabel },
    { key: "fab-secondary-icon-text", titleKey: "sensd-button-fab-secondary-iconText", titleDefault: "FAB / 二级 / 图标+文字", tone: "secondary", content: buttonLabel, icon: <IconDefaultIcon /> },
    { key: "fab-secondary-icon", titleKey: "sensd-button-fab-secondary-icon", titleDefault: "FAB / 二级 / 纯图标", tone: "secondary", content: null, icon: <IconDefaultIcon /> },
  ];

  const allEntries = [...baseEntries, ...linkEntries, ...warningEntries];

  return (
    <div className="sens-btn-matrix" style={useButtonPreviewVars()}>
      {title ? <div className="sens-btn-matrix-head">{title}</div> : null}
      {allEntries.map((entry) => (
        <div key={entry.key}>
          <PreviewRow entry={entry} size="large" styleToken={styleToken} shadowToken={shadowToken} label={label} stateLabel={stateLabel} sizeLabel={sizeLabel} />
          <PreviewRow entry={entry} size="small" styleToken={styleToken} shadowToken={shadowToken} label={label} stateLabel={stateLabel} sizeLabel={sizeLabel} />
        </div>
      ))}
      <div className="sens-btn-fab-section">
        <span className="sens-btn-matrix-title">
          {label("sensd-button-group-fab-horizontal", "横向单项 FAB")}
        </span>
        {fabEntries.map((entry) => (
          <FabPreviewRow
            key={entry.key}
            entry={entry}
            styleToken={styleToken}
            shadowToken={shadowToken}
            label={label}
            stateLabel={stateLabel}
            sizeLabel={sizeLabel}
          />
        ))}
        {afterFabSection}
      </div>
      <div className="sens-btn-dropdown-row">
        <span className="sens-btn-matrix-title">
          {label("sensd-button-group-dropdown", "下拉")}
        </span>
        <DropdownCorePreview styleToken={styleToken} label={label} moreLabel={moreLabel} />
      </div>
      <div className="sens-btn-dropdown-row">
        <span className="sens-btn-matrix-title">
          {label("sensd-button-dropdown-activeTitle", "下拉按钮 / 扩展状态")}
        </span>
        <DropdownExtraPreview styleToken={styleToken} label={label} moreLabel={moreLabel} />
      </div>
    </div>
  );
}
