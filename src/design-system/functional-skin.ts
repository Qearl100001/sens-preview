import tokens from "./tokens.resolved.json";

const c = tokens.color as Record<string, string>;
const p = tokens.colorByPath as Record<string, string>;

/** 预览换肤：仅切换功能色（绿 ↔ 蓝），状态色（链接蓝等）不变 */
export type FunctionalSkin = "green" | "blue";

export type FunctionalColorSet = {
  primary: string;
  hover: string;
  active: string;
  disable: string;
  activeBackground: string;
  activeHoverBackground: string;
  activeClickBackground: string;
};

const GREEN: FunctionalColorSet = {
  primary: c["component-primary"],
  hover: c["component-hover"],
  active: c["component-active"],
  disable: c["component-disable"],
  activeBackground: c["component-active-background"],
  activeHoverBackground: c["component-active-hover-background"],
  activeClickBackground: c["component-active-click-background"],
};

/** 蓝肤：功能色走冰绽蓝阶，自 tokens 基础色板读取（非业务硬编码） */
const BLUE: FunctionalColorSet = {
  primary: p["基础色板/冰绽蓝/10"],
  hover: p["基础色板/冰绽蓝/08"],
  active: p["基础色板/冰绽蓝/12"],
  disable: p["基础色板/冰绽蓝/06"],
  activeBackground: p["基础色板/冰绽蓝/01"],
  activeHoverBackground: p["基础色板/冰绽蓝/02"],
  activeClickBackground: p["基础色板/冰绽蓝/03"],
};

export function getFunctionalColors(skin: FunctionalSkin): FunctionalColorSet {
  return skin === "blue" ? BLUE : GREEN;
}
