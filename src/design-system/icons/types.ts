import type { CSSProperties } from "react";
import type { FigmaIconName } from "./figma-icon-names";
import type { FilledIconName } from "./filled-icon-names";
import type { ColorfulIconName } from "./colorful-icon-names";

/** 项目已入库的 Sens 图标名称；包括历史资产、Figma 线性资产和面性资产 */
export type IconName =
  | "error-diamond"
  | "feedback-info"
  | "feedback-complete"
  | "feedback-warning"
  | "feedback-error"
  | "help"
  | "icon-default"
  | "select-check"
  | "stepper-up"
  | "stepper-down"
  | "chevron-left"
  | "chevron-right"
  | "double-chevron-left"
  | "double-chevron-right"
  | "chevron-down"
  | "chevron-up"
  | "filter-chevron-down"
  | "filter-chevron-up"
  | "close"
  | "close-circle"
  | "check"
  | "checkbox-check"
  | "rename"
  | "warning-filled"
  | "editor-add"
  | "drag-vertical"
  | "reload"
  | "setting"
  | "more"
  | "search"
  | "nav-helpcenter"
  | "nav-notice"
  | "nav-platform"
  | "nav-workload-manager"
  | "nav-examine"
  | "nav-language"
  | "nav-product-navigation"
  | "nav-down"
  | "side-nav-down"
  | "side-nav-up"
  | "side-nav-link"
  | "side-nav-expand"
  | "side-nav-collapse"
  | "side-nav-unpin"
  | "side-nav-pin"
  | FigmaIconName
  | FilledIconName
  | ColorfulIconName;

export type IconVariant = "linear" | "filled" | "colorful";

export type IconCategory =
  | "operational"
  | "status"
  | "navigation"
  | "input-assist"
  | "component-internal"
  | "edit"
  | "object"
  | "symbol"
  | "direction"
  | "brand"
  | "chart"
  | "functional"
  | "file"
  | "business"
  | "colorful-functional";

/** registry 记录的图标使用场景，尺寸与颜色由场景决定，非图标本体默认值 */
export interface IconUsageScene {
  /** 场景描述 */
  scene: string;
  /** 当前常见尺寸（px），仅作文档/检索用途 */
  typicalSizes: number[];
  /** 当前常见颜色语义，仅作文档/检索用途 */
  typicalColorRoles: IconColorRole[];
  /** 是否允许在其他尺寸复用 */
  reusableAtOtherSizes: boolean;
}

export interface IconAssetMeta {
  name: IconName;
  /** 原 React 组件名 */
  sourceComponent: string;
  sourceFile: string;
  viewBox: string;
  category: IconCategory;
  /** 中文备注，方便设计与研发检索 */
  labelZh?: string;
  /** Figma 中的原始名称，仅用于资产追溯，不作为消费方 API */
  figmaName?: string;
  /** SVG 路径是否使用 currentColor */
  currentColor: boolean;
  /** 是否包含 opacity 分层或双色路径 */
  dualTone: boolean;
  /** 是否为临时/demo 资产 */
  temporary: boolean;
  /** 当前项目中的使用场景 */
  usageScenes: IconUsageScene[];
}

export type IconSizeTokenName = "size/icon/mini" | "size/icon/s" | "size/icon/m" | "size/icon/l";

/**
 * 图标颜色语义角色。
 * 具体色值由 Icon.tsx 通过 color token / tokenRgba 解析，不在 registry 绑定。
 */
export type IconColorRole =
  | "default"
  | "subtle"
  | "disabled"
  | "link"
  | "functional"
  | "warning"
  | "inverse"
  | "inherit";

/** registry 内 SVG 组件的统一 render props */
export interface RegistryIconRenderProps {
  size?: number;
  className?: string;
  style?: CSSProperties;
  color?: string;
}

export interface SensIconProps {
  name: IconName;
  /** 图标风格；默认使用线性图标，面性图标通过 filled 明确选择 */
  variant?: IconVariant;
  /** 显式像素尺寸；与 sizeToken 二选一，size 优先 */
  size?: number;
  /** 来自 size/icon/* token 的尺寸 */
  sizeToken?: IconSizeTokenName;
  /** 语义颜色角色；与 color 二选一，color 优先 */
  colorRole?: IconColorRole;
  /** 显式颜色值（token 解析结果或 currentColor） */
  color?: string;
  className?: string;
  style?: CSSProperties;
}
