import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Button, Dropdown, type ButtonProps, type DropdownProps } from "antd";
import { useTranslation } from "react-i18next";
import { buildActiveRingShadow, buildShadowD3, buildShadowD4, SHADOW_NONE } from "../design-system/color-utils";
import { getDividerColor } from "../design-system/divider";
import {
  buildFunctionalActiveRingShadow,
  functionalCssVar,
} from "../design-system/functional-skin";
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

const LINK_TONES = new Set<SensButtonVariant>([
  "link",
  "linkWeak",
  "dangerLink",
  "dangerLinkEmphasis",
  "dangerLinkWeak",
]);

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
  | "dangerSecondaryWeak"
  | "dangerTertiary"
  | "dangerTertiaryWeak"
  | "dangerLink"
  | "dangerLinkEmphasis"
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
  return tone === "primary" || tone === "secondary" || tone === "dangerSecondary" || tone === "dangerSecondaryWeak";
}

function isWarningTone(tone: SensButtonVariant): boolean {
  return (
    tone === "dangerSecondary" ||
    tone === "dangerSecondaryWeak" ||
    tone === "dangerTertiary" ||
    tone === "dangerTertiaryWeak" ||
    tone === "dangerLink" ||
    tone === "dangerLinkEmphasis" ||
    tone === "dangerLinkWeak"
  );
}

function resolveActiveRingShadow(tone: SensButtonVariant): string {
  if (isWarningTone(tone)) return buildActiveRingShadow("warning-color-active-shadow");
  return buildFunctionalActiveRingShadow();
}

function isActiveRingTone(tone: SensButtonVariant): boolean {
  return (
    tone === "primary" ||
    tone === "secondary" ||
    tone === "dangerSecondary" ||
    tone === "dangerSecondaryWeak" ||
    tone === "dashed"
  );
}

function isNeutralActionIconTone(tone: SensButtonVariant): boolean {
  return (
    tone === "secondary" ||
    tone === "tertiary" ||
    tone === "dangerSecondaryWeak" ||
    tone === "dangerTertiaryWeak" ||
    tone === "dashed"
  );
}

function resolveNeutralActionIconColor(tone: SensButtonVariant, state: ButtonPreviewState): string | undefined {
  if (!isNeutralActionIconTone(tone)) return undefined;

  switch (state) {
    case "hover":
      return functionalCssVar("--sens-skin-hover", "component-hover");
    case "active":
      return functionalCssVar("--sens-skin-active", "component-active");
    case "disabled":
    case "disabledHover":
    case "loading":
    case "loadingHover":
      return c["icon-color-transparent-disable"];
    default:
      return c["icon-color-transparent"];
  }
}

function withIconColor(icon: ReactNode | undefined, color: string | undefined): ReactNode | undefined {
  if (!icon || !color || !isValidElement(icon)) return icon;
  const element = icon as ReactElement<{ style?: CSSProperties }>;
  return cloneElement(element, {
    style: { ...(element.props.style ?? {}), color },
  });
}

function resolveButtonIconForState(
  tone: SensButtonVariant,
  icon: ReactNode | undefined,
  state: ButtonPreviewState,
): ReactNode | undefined {
  if (tone === "dangerLinkWeak") {
    const color = (() => {
      switch (state) {
        case "hover":
          return c["warning-color"];
        case "active":
          return c["warning-color-active"];
        case "disabled":
        case "disabledHover":
        case "loading":
        case "loadingHover":
          return c["icon-color-transparent-disable"];
        default:
          return c["icon-color-transparent"];
      }
    })();
    return withIconColor(icon, color);
  }

  if (tone === "dangerSecondaryWeak" || tone === "dangerTertiaryWeak" || tone === "dangerLinkEmphasis") {
    const color = (() => {
      switch (state) {
        case "hover":
          return c["warning-color"];
        case "active":
          return c["warning-color-active"];
        case "disabled":
        case "disabledHover":
        case "loading":
        case "loadingHover":
          return c["icon-color-transparent-disable"];
        default:
          return tone === "dangerLinkEmphasis" ? c["link-color"] : c["icon-color-transparent"];
      }
    })();
    return withIconColor(icon, color);
  }

  if (tone === "linkWeak") {
    const color = (() => {
      switch (state) {
        case "hover":
          return c["link-color"];
        case "active":
          return c["link-active-color"];
        case "disabled":
        case "disabledHover":
        case "loading":
        case "loadingHover":
          return c["icon-color-transparent-disable"];
        default:
          return c["icon-color-transparent"];
      }
    })();
    return withIconColor(icon, color);
  }

  return withIconColor(icon, resolveNeutralActionIconColor(tone, state));
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
  if (state === "active" && isActiveRingTone(tone)) return resolveActiveRingShadow(tone);
  if (isHoverShadowTone(tone) && state === "hover") return shadows.hover;
  return SHADOW_NONE;
}

function resolveLiveShadow(
  tone: SensButtonVariant,
  { isHovered, isPressed, isDisabled }: { isHovered: boolean; isPressed: boolean; isDisabled: boolean },
  shadows: ButtonShadowToken,
  fab?: boolean,
): string {
  if (isDisabled) return SHADOW_NONE;
  if (!fab && isPressed && isActiveRingTone(tone)) return resolveActiveRingShadow(tone);
  if (hasPersistentD4Shadow(tone, fab)) return shadows.floating;
  if (isHoverShadowTone(tone) && isHovered) return shadows.hover;
  return SHADOW_NONE;
}

function getLiveStateStyle(tone: SensButtonVariant, state: ButtonPreviewState, isFab: boolean): CSSProperties {
  if (isFab) {
    if (tone !== "secondary") return {};
    if (state === "hover") return { color: functionalCssVar("--sens-skin-hover", "component-hover"), backgroundColor: c.white, borderColor: "transparent" };
    if (state === "active") return { color: functionalCssVar("--sens-skin-active", "component-active"), backgroundColor: c.white, borderColor: "transparent" };
    return {};
  }

  if (state === "default") return {};

  switch (tone) {
    case "secondary":
      if (state === "hover") return { color: functionalCssVar("--sens-skin-hover", "component-hover"), borderColor: functionalCssVar("--sens-skin-hover", "component-hover"), backgroundColor: c.white };
      if (state === "active") return { color: functionalCssVar("--sens-skin-active", "component-active"), borderColor: functionalCssVar("--sens-skin-active", "component-active"), backgroundColor: c.white };
      return {};
    case "dashed":
      if (state === "hover") return { color: functionalCssVar("--sens-skin-hover", "component-hover"), borderColor: functionalCssVar("--sens-skin-hover", "component-hover"), backgroundColor: c.white };
      if (state === "active") return { color: functionalCssVar("--sens-skin-active", "component-active"), borderColor: functionalCssVar("--sens-skin-active", "component-active"), backgroundColor: c.white };
      return {};
    case "tertiary":
      if (state === "hover") return { color: functionalCssVar("--sens-skin-hover", "component-hover"), backgroundColor: "transparent", borderColor: "transparent" };
      if (state === "active") return { color: functionalCssVar("--sens-skin-active", "component-active"), backgroundColor: "transparent", borderColor: "transparent" };
      return {};
    case "dangerSecondary":
      if (state === "hover") return { color: c["warning-color-hover"], borderColor: c["warning-color-hover"], backgroundColor: c.white };
      if (state === "active") return { color: c["warning-color-active"], borderColor: c["warning-color-active"], backgroundColor: c.white };
      return {};
    case "dangerSecondaryWeak":
      if (state === "hover") return { color: c["warning-color"], borderColor: c["warning-color"], backgroundColor: c.white };
      if (state === "active") return { color: c["warning-color-active"], borderColor: c["warning-color-active"], backgroundColor: c.white };
      return {};
    case "dangerTertiary":
      if (state === "hover") return { color: c["warning-color-hover"], backgroundColor: "transparent", borderColor: "transparent" };
      if (state === "active") return { color: c["warning-color-active"], backgroundColor: "transparent", borderColor: "transparent" };
      return {};
    case "dangerTertiaryWeak":
      if (state === "hover") return { color: c["warning-color"], backgroundColor: "transparent", borderColor: "transparent" };
      if (state === "active") return { color: c["warning-color-active"], backgroundColor: "transparent", borderColor: "transparent" };
      return {};
    case "link":
      if (state === "hover") return { color: c["link-hover-color"], backgroundColor: "transparent", borderColor: "transparent" };
      if (state === "active") return { color: c["link-active-color"], backgroundColor: "transparent", borderColor: "transparent" };
      return {};
    case "linkWeak":
      if (state === "hover") return { color: c["link-color"], backgroundColor: "transparent", borderColor: "transparent" };
      if (state === "active") return { color: c["link-active-color"], backgroundColor: "transparent", borderColor: "transparent" };
      return {};
    case "dangerLink":
      if (state === "hover") return { color: c["warning-color-hover"], backgroundColor: "transparent", borderColor: "transparent" };
      if (state === "active") return { color: c["warning-color-active"], backgroundColor: "transparent", borderColor: "transparent" };
      return {};
    case "dangerLinkEmphasis":
      if (state === "hover") return { color: c["warning-color"], backgroundColor: "transparent", borderColor: "transparent" };
      if (state === "active") return { color: c["warning-color-active"], backgroundColor: "transparent", borderColor: "transparent" };
      return {};
    case "dangerLinkWeak":
      if (state === "hover") return { color: c["warning-color"], backgroundColor: "transparent", borderColor: "transparent" };
      if (state === "active") return { color: c["warning-color-active"], backgroundColor: "transparent", borderColor: "transparent" };
      return {};
    default:
      return {};
  }
}

function getBaseToneStyle(tone: SensButtonVariant, isFab: boolean): CSSProperties {
  if (isFab && tone === "secondary") {
    return { color: c["text-color-transparent"], backgroundColor: c.white, borderColor: "transparent" };
  }

  switch (tone) {
    case "link":
      return { ...LINK_NO_FILL, color: c["link-color"], minWidth: 0, paddingInline: 0 };
    case "linkWeak":
      return { ...LINK_NO_FILL, color: c["text-color-transparent"], minWidth: 0, paddingInline: 0 };
    case "dangerLink":
      return { ...LINK_NO_FILL, color: c["warning-color"], minWidth: 0, paddingInline: 0 };
    case "dangerLinkEmphasis":
      return { ...LINK_NO_FILL, color: c["link-color"], minWidth: 0, paddingInline: 0 };
    case "dangerLinkWeak":
      return { ...LINK_NO_FILL, color: c["text-color-transparent"], minWidth: 0, paddingInline: 0 };
    default:
      return {};
  }
}

function resolveFabSecondaryColor(state: ButtonPreviewState): string {
  switch (state) {
    case "hover":
      return functionalCssVar("--sens-skin-hover", "component-hover");
    case "active":
      return functionalCssVar("--sens-skin-active", "component-active");
    case "disabled":
    case "loading":
      return hexToRgba(c["text-color-transparent-disable"], 0.3);
    case "disabledHover":
    case "loadingHover":
      return hexToRgba(c["text-color-transparent-disable"], 0.24);
    default:
      return c["text-color-transparent"];
  }
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
      // 三级按钮默认是中性文字；由 Button 的 defaultHover/Active token 进入功能色状态。
      return { color: "default", variant: "text" };
    case "link":
      return { type: "link" };
    case "linkWeak":
      return { type: "link", className: "sens-btn-link-weak" };
    case "dangerSecondary":
      return { color: "danger", variant: "outlined" };
    case "dangerSecondaryWeak":
      return { color: "default", variant: "outlined" };
    case "dangerTertiary":
      return { color: "danger", variant: "text" };
    case "dangerTertiaryWeak":
      return { color: "default", variant: "text" };
    case "dangerLink":
      return { color: "danger", variant: "link" };
    case "dangerLinkEmphasis":
      return { type: "link" };
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

function getPreviewStyleToken(): PreviewStyleToken {
  return {
    primary: functionalCssVar("--sens-skin-primary", "component-primary"),
    primaryHover: functionalCssVar("--sens-skin-hover", "component-hover"),
    primaryActive: functionalCssVar("--sens-skin-active", "component-active"),
    warning: c["warning-color"],
    warningHover: c["warning-color-hover"],
    warningActive: c["warning-color-active"],
    link: c["link-color"],
    linkHover: c["link-hover-color"],
    linkActive: c["link-active-color"],
    textSecondary: c["text-sub-color"],
    textDisabled: c["text-color-disable"],
    textPrimary: c["text-color-transparent"],
    iconPrimary: c["icon-color-transparent"],
    bgContainer: c.white,
    primarySolidBorder: getButtonPrimaryBorderColor(),
    dashedDefaultBorder: getDividerColor("deep", "transparent"),
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
      return { color: t.textPrimary, backgroundColor: "transparent", borderColor: "transparent" };
    case "link":
      return { color: t.link, backgroundColor: "transparent", borderColor: "transparent" };
    case "linkWeak":
      return { color: t.textPrimary, backgroundColor: "transparent", borderColor: "transparent" };
    case "dangerLinkWeak":
      return { color: t.textPrimary, backgroundColor: "transparent", borderColor: "transparent" };
    case "dangerSecondaryWeak":
      return { color: t.textPrimary, borderColor: t.dashedDefaultBorder, backgroundColor: t.bgContainer };
    case "dangerTertiaryWeak":
      return { color: t.textPrimary, backgroundColor: "transparent", borderColor: "transparent" };
    case "dangerLinkEmphasis":
      return { color: t.link, backgroundColor: "transparent", borderColor: "transparent" };
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
    tone === "dangerSecondaryWeak" ||
    tone === "dangerTertiary" ||
    tone === "dangerTertiaryWeak"
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
    case "dangerLinkEmphasis":
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
    case "dangerLinkEmphasis":
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
      case "dangerSecondaryWeak":
        return { color: t.warning, borderColor: t.warning, backgroundColor: t.bgContainer };
      case "dangerTertiaryWeak":
      case "dangerLinkEmphasis":
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
    case "dangerSecondaryWeak":
      return { color: t.warningActive, borderColor: t.warningActive, backgroundColor: t.bgContainer };
    case "dangerTertiaryWeak":
    case "dangerLinkEmphasis":
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

function resolveRiskPreviewIcon(
  tone: SensButtonVariant,
  state: ButtonPreviewState,
  icon: ReactNode | undefined,
  t: PreviewStyleToken,
): ReactNode | undefined {
  if (
    (tone !== "dangerSecondaryWeak" &&
      tone !== "dangerTertiaryWeak" &&
      tone !== "dangerLinkEmphasis" &&
      tone !== "dangerLinkWeak") ||
    !icon ||
    !isValidElement(icon)
  ) {
    return icon;
  }

  const color = (() => {
    switch (state) {
      case "default":
        return tone === "dangerLinkEmphasis" ? t.link : t.iconPrimary;
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

export type SensButtonRef = HTMLButtonElement | HTMLAnchorElement;

export interface SensButtonProps extends Omit<ButtonProps, "type" | "variant"> {
  tone?: SensButtonVariant;
  /** 横向单项 FAB：与 tone=primary|secondary 组合；圆角 999、恒 D4 投影、二级无描边白底 */
  fab?: boolean;
}

/** 按钮语义封装：仅通过 antd props + 主题 token 驱动样式。 */
export const SensButton = forwardRef<SensButtonRef, SensButtonProps>(function SensButton({
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
  onKeyDown,
  onKeyUp,
  ...rest
}, forwardedRef) {
  const shadows = getButtonShadowToken();
  const setButtonRef = (node: SensButtonRef | null) => {
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) {
      (forwardedRef as { current: SensButtonRef | null }).current = node;
    }
  };
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const isFab = fab && isFabTone(tone);
  const toneProps = isFab ? buildFabToneProps(tone) : buildToneProps(tone);
  const isLoading = !!loading;
  const isDisabled = disabled || isLoading;
  const resolvedIcon = rest.icon ?? toneProps.icon;
  const iconState: ButtonPreviewState = isLoading
    ? "loading"
    : isDisabled
      ? "disabled"
      : isPressed
        ? "active"
        : isHovered
          ? "hover"
          : "default";
  const themedIcon = resolveButtonIconForState(tone, resolvedIcon, iconState);
  const fabShape = isFab ? resolveFabShape(children, resolvedIcon, isLoading) : undefined;
  const mergedClassName =
    [isLinkTone(tone) ? "sens-btn-link" : "", toneProps.className, className].filter(Boolean).join(" ") ||
    undefined;
  const { className: _toneClassName, icon: _toneIcon, ...restToneProps } = toneProps;
  const boxShadow = resolveLiveShadow(tone, { isHovered, isPressed, isDisabled }, shadows, isFab);
  const baseToneStyle = getBaseToneStyle(tone, isFab);
  const liveStateStyle = isDisabled ? {} : getLiveStateStyle(tone, iconState, isFab);
  const primaryBorderStyle: CSSProperties =
    tone === "primary" && !isFab ? { borderColor: getButtonPrimaryBorderColor() } : {};
  const textVariantTransparentStyle: CSSProperties =
    !isFab && (tone === "tertiary" || tone === "dangerTertiary" || tone === "dangerTertiaryWeak")
      ? { backgroundColor: "transparent", borderColor: "transparent" }
      : {};
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
              color: c["text-color-transparent"],
              borderColor: "transparent",
            }
          : {}),
      }
    : {};
  const hasIcon = Boolean(resolvedIcon) || isLoading;
  const buttonText = formatButtonText(children, { tone, hasIcon });

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
      ref={setButtonRef}
      {...restToneProps}
      {...rest}
      size={isFab ? undefined : sizeProp}
      shape={isFab ? fabShape : shapeProp}
      loading={loading}
      disabled={isDisabled}
      aria-busy={isLoading ? true : undefined}
      className={mergedClassName}
      icon={themedIcon}
      style={{
        ...baseToneStyle,
        ...primaryBorderStyle,
        ...textVariantTransparentStyle,
        ...fabStyle,
        ...liveStateStyle,
        boxShadow,
        ...style,
      }}
      onMouseEnter={isFab && tone === "secondary" ? undefined : handleMouseEnter}
      onMouseLeave={isFab && tone === "secondary" ? undefined : handleMouseLeave}
      onMouseDown={(event) => {
        setIsPressed(true);
        onMouseDown?.(event);
      }}
      onMouseUp={(event) => {
        setIsPressed(false);
        onMouseUp?.(event);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") setIsPressed(true);
        onKeyDown?.(event);
      }}
      onKeyUp={(event) => {
        if (event.key === "Enter" || event.key === " ") setIsPressed(false);
        onKeyUp?.(event);
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
});
SensButton.displayName = "SensButton";

export type SensMoreButtonTone = Extract<SensButtonVariant, "primary" | "secondary" | "tertiary">;

export interface SensMoreButtonProps extends Omit<SensButtonProps, "tone" | "icon" | "iconPosition"> {
  /** 与同级别主/次/三级按钮一致；矩阵默认 secondary */
  tone?: SensMoreButtonTone;
}

/** 更多 ··· 按钮（Figma 矩阵「更多 / 大尺寸」；二级 + 横向省略号尾图标） */
export const SensMoreButton = forwardRef<SensButtonRef, SensMoreButtonProps>(function SensMoreButton(
  { tone = "secondary", children, ...rest },
  ref,
) {
  return (
    <SensButton ref={ref} tone={tone} icon={<MoreIcon />} iconPosition="end" {...rest}>
      {children}
    </SensButton>
  );
});
SensMoreButton.displayName = "SensMoreButton";

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
  const dropdownIcon = <span className="sens-dropdown-btn-icon">{isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}</span>;

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
        icon={dropdownIcon}
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
  ariaLabel,
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
  ariaLabel?: string;
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
      className={["sens-btn-preview-button", fabToneProps.className].filter(Boolean).join(" ")}
      style={{
        ...(tone === "secondary" ? getFabSecondaryCssVars() : {}),
        ...(tone === "secondary" ? { color: resolveFabSecondaryColor(previewState) } : {}),
        ...getFabCssVars(),
        ...getFabCrossAxisStyle(cellContent, resolvedIcon, isLoadingState),
        ...getFabSinglePaddingStyle(cellContent, resolvedIcon, isLoadingState),
        ...snapshot.style,
      }}
      aria-label={ariaLabel}
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
                  ariaLabel={entry.content == null ? label(entry.titleKey, entry.titleDefault) : undefined}
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
          const previewIcon = resolveRiskPreviewIcon(
            entry.tone,
            state,
            snapshot.icon ?? entry.icon,
            styleToken,
          );
          const resolvedIcon = resolveButtonIconForState(
            entry.tone,
            previewIcon ?? buildToneProps(entry.tone).icon,
            state,
          );
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
                <Button
                  {...buildToneProps("secondary")}
                  {...sizeProps}
                  {...snapshot.buttonProps}
                  disabled={isDisabledState}
                  loading={isLoadingState}
                  icon={resolveButtonIconForState("secondary", <MoreIcon />, state)}
                  iconPosition="end"
                  className={["sens-btn-preview-button", buildToneProps("secondary").className].filter(Boolean).join(" ")}
                  style={{
                    ...previewStyle,
                  }}
                >
                  {cellContent}
                </Button>
              ) : (
                <Button
                  {...buildToneProps(entry.tone)}
                  {...sizeProps}
                  shape={entry.shape}
                  {...snapshot.buttonProps}
                  icon={resolvedIcon}
                  iconPosition={entry.iconPosition}
                  aria-label={entry.content == null ? label(entry.titleKey, entry.titleDefault) : undefined}
                  className={
                    [
                      "sens-btn-preview-button",
                      buildToneProps(entry.tone).className,
                      isLinkTone(entry.tone) ? "sens-btn-link" : undefined,
                    ]
                      .filter(Boolean)
                      .join(" ") || undefined
                  }
                  style={{
                    ...(isLinkTone(entry.tone) ? { minWidth: 0, paddingInline: 0 } : {}),
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
                icon={<span className="sens-dropdown-btn-icon">{snapshot.icon}</span>}
                iconPosition="end"
                className="sens-btn-preview-button sens-dropdown-btn"
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
                icon={<span className="sens-dropdown-btn-icon">{snapshot.icon}</span>}
                iconPosition="end"
                className="sens-btn-preview-button sens-dropdown-btn"
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
    "--sens-btn-preview-text-secondary": c["text-color-transparent"],
    ...getFabCssVars(),
  } as CSSProperties;
}

export interface ButtonStatesPreviewProps {
  title?: ReactNode;
  /** 插在「横向单项 FAB」与「下拉」之间的预览区（如组合 FAB） */
  afterFabSection?: ReactNode;
}

export function ButtonStatesPreview({ title, afterFabSection }: ButtonStatesPreviewProps) {
  const { t } = useTranslation();
  const styleToken = getPreviewStyleToken();
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
    { key: "danger-secondary-weak", titleKey: "sensd-button-danger-secondaryWeak", titleDefault: "警告 / 二级 / 其他风险", tone: "dangerSecondaryWeak", content: buttonLabel },
    { key: "danger-tertiary-off", titleKey: "sensd-button-danger-tertiaryOff", titleDefault: "警告 / 三级 / 二次确认关", tone: "dangerTertiary", content: buttonLabel },
    { key: "danger-tertiary-on", titleKey: "sensd-button-danger-tertiaryOn", titleDefault: "警告 / 三级 / 二次确认开", tone: "dangerTertiary", content: confirmDeleteLabel },
    { key: "danger-tertiary-weak", titleKey: "sensd-button-danger-tertiaryWeak", titleDefault: "警告 / 三级 / 其他风险", tone: "dangerTertiaryWeak", content: buttonLabel },
    { key: "danger-link-off", titleKey: "sensd-button-danger-linkOff", titleDefault: "警告 / 链接 / 二次确认关", tone: "dangerLink", content: buttonLabel },
    { key: "danger-link-on", titleKey: "sensd-button-danger-linkOn", titleDefault: "警告 / 链接 / 二次确认开", tone: "dangerLink", content: confirmDeleteLabel },
    { key: "danger-link-emphasis", titleKey: "sensd-button-danger-linkEmphasis", titleDefault: "警告 / 链接强调 / 其他风险", tone: "dangerLinkEmphasis", content: buttonLabel },
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
