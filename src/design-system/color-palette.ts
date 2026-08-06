import { getColorByPath } from "./color-utils";

export const COLOR_PALETTE_SPECS = [
  { name: "旭日红", steps: 16 },
  { name: "沙丘金", steps: 16 },
  { name: "原野黄", steps: 16 },
  { name: "青柠绿", steps: 16 },
  { name: "极光绿", steps: 16 },
  { name: "神策绿", steps: 16 },
  { name: "山水蓝", steps: 16 },
  { name: "冰绽蓝", steps: 16 },
  { name: "兰花紫", steps: 16 },
  { name: "波光紫", steps: 16 },
  { name: "云霞粉", steps: 16 },
  { name: "子夜黑", steps: 12 },
  { name: "象牙白", steps: 8 },
] as const;

export type ColorPaletteName = (typeof COLOR_PALETTE_SPECS)[number]["name"];

export function getColorPaletteValue(name: ColorPaletteName, step: number): string {
  return getColorByPath(`基础色板/${name}/${String(step).padStart(2, "0")}`);
}

export function getColorPaletteSteps(name: ColorPaletteName): number[] {
  const spec = COLOR_PALETTE_SPECS.find((item) => item.name === name);
  if (!spec) return [];
  return Array.from({ length: spec.steps }, (_, index) => spec.steps - index);
}

export function getRelativeLuminance(hex: string): number {
  const normalized = hex.replace("#", "").slice(0, 6);
  const channels = [0, 2, 4].map((offset) => Number.parseInt(normalized.slice(offset, offset + 2), 16) / 255);
  const linear = channels.map((channel) => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4));
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

export function getContrastRatio(foreground: string, background: string): number {
  const foregroundLuminance = getRelativeLuminance(foreground);
  const backgroundLuminance = getRelativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

