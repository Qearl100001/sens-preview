import tokens from "../tokens.resolved.json";
import { getColorToken, tokenRgba } from "../color-utils";
import { getIconRegistryEntry } from "./registry";
import type { IconColorRole, IconSizeTokenName, SensIconProps } from "./types";

const unitTokens = tokens.unit as Record<string, number>;

const iconSizeTokenFallbacks: Record<IconSizeTokenName, number> = {
  "size/icon/mini": 8,
  "size/icon/s": 14,
  "size/icon/m": 16,
  "size/icon/l": 22,
};

/** InputNumber stepper 组件内部特殊尺寸，非通用 icon size token */
export const STEPPER_ICON_SIZE = 10;

export function getIconSizeToken(name: IconSizeTokenName): number {
  return unitTokens[name] ?? iconSizeTokenFallbacks[name];
}

export function resolveIconColor(role: IconColorRole): string {
  switch (role) {
    case "default":
      return tokenRgba("text-color-transparent", 0.9);
    case "subtle":
      return tokenRgba("text-sub-color-transparent", 0.58);
    case "disabled":
      return tokenRgba("text-color-transparent-disable", 0.3);
    case "link":
      return getColorToken("link-color");
    case "functional":
      return getColorToken("component-active");
    case "warning":
      return getColorToken("warning-color");
    case "inverse":
      return getColorToken("white");
    case "inherit":
      return "currentColor";
  }
}

function resolveIconPixelSize({
  name,
  size,
  sizeToken,
}: Pick<SensIconProps, "name" | "size" | "sizeToken">): number {
  if (size != null) {
    return size;
  }
  if (sizeToken) {
    return getIconSizeToken(sizeToken);
  }
  if (name === "stepper-up" || name === "stepper-down") {
    return STEPPER_ICON_SIZE;
  }
  return getIconSizeToken("size/icon/m");
}

function resolveIconRenderColor({
  color,
  colorRole,
}: Pick<SensIconProps, "color" | "colorRole">): string {
  if (color) {
    return color;
  }
  if (colorRole) {
    return resolveIconColor(colorRole);
  }
  return "currentColor";
}

/** 统一图标渲染入口；尺寸与颜色由使用场景传入，registry 不绑定默认值。 */
export function SensIcon({
  name,
  size,
  sizeToken,
  colorRole,
  color,
  className,
  style,
}: SensIconProps) {
  const entry = getIconRegistryEntry(name);
  const { Component } = entry;

  return (
    <Component
      size={resolveIconPixelSize({ name, size, sizeToken })}
      color={resolveIconRenderColor({ color, colorRole })}
      className={className}
      style={style}
    />
  );
}
