import type { CSSProperties } from "react";

/** 第一批已入库自定义 SVG 名称 */
export type IconName =
  | "error-diamond"
  | "icon-default"
  | "select-check"
  | "stepper-up"
  | "stepper-down"
  | "chevron-left"
  | "chevron-down"
  | "chevron-up"
  | "close"
  | "close-circle"
  | "check"
  | "rename"
  | "warning-filled"
  | "editor-add"
  | "drag-vertical"
  | "more"
  | "search"
  | "nav-helpcenter"
  | "nav-notice"
  | "nav-platform"
  | "nav-workload-manager"
  | "nav-examine"
  | "nav-language"
  | "nav-product-navigation"
  | "nav-down";

export type IconCategory =
  | "operational"
  | "status"
  | "navigation"
  | "input-assist"
  | "component-internal";

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
  labelZh: string;
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
