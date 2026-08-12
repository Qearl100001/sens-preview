import type { IconName, IconVariant } from "./icons";

/**
 * Product Shell 一级功能域导航模型。
 * 侧导为权威 IA；顶导同域下拉由其派生，禁止另写一套扁平菜单。
 */
export type ProductShellDomainNavGroup = {
  key: string;
  label: string;
  icon?: IconName;
  iconVariant?: IconVariant;
  items: Array<string | { key: string; label: string; icon?: IconName; iconVariant?: IconVariant }>;
  defaultExpanded?: boolean;
  recommended?: boolean;
};

export type ProductShellDomainNavFlatItem = {
  key: string;
  label: string;
  icon: IconName;
  iconVariant?: IconVariant;
};

export type ProductShellDomainNavEntry =
  | { kind: "primary"; label: string }
  | { kind: "utility"; icon: IconName };

export type ProductShellDomainNav = {
  /** 侧导 productName / 域显示名 */
  domainLabel: string;
  /** 顶导第二行或右上角工具入口 */
  entry: ProductShellDomainNavEntry;
  /** flat=单层带图标；groups=二级带图标 + 三级叶子 */
  layout: "flat" | "groups";
  items?: ProductShellDomainNavFlatItem[];
  groups?: ProductShellDomainNavGroup[];
};

/** 与顶导 FunctionMenuSection 结构兼容的派生结果 */
export type ProductShellDomainTopDropdownSection = {
  title: string;
  items: string[];
};

export type ProductShellDomainTopDropdownConfig =
  | { kind: "flat"; items: string[] }
  | { kind: "grouped"; sections: ProductShellDomainTopDropdownSection[] };

function leafLabel(item: ProductShellDomainNavGroup["items"][number]): string {
  return typeof item === "string" ? item : item.label;
}

/** 侧导二级分组 → 顶导两层下拉 sections */
export function domainNavToTopDropdownSections(
  groups: ProductShellDomainNavGroup[],
): ProductShellDomainTopDropdownSection[] {
  return groups.map((group) => ({
    title: group.label,
    items: group.items.map(leafLabel),
  }));
}

/** 域模型 → 顶导下拉配置（flat / grouped） */
export function domainNavToTopDropdownConfig(domain: ProductShellDomainNav): ProductShellDomainTopDropdownConfig {
  if (domain.layout === "flat") {
    return {
      kind: "flat",
      items: (domain.items ?? []).map((item) => item.label),
    };
  }
  return {
    kind: "grouped",
    sections: domainNavToTopDropdownSections(domain.groups ?? []),
  };
}

/** 取域内第一个叶子，作默认选中兜底 */
export function getDomainNavFirstLeaf(domain: ProductShellDomainNav): string | null {
  if (domain.layout === "flat") {
    return domain.items?.[0]?.label ?? null;
  }
  for (const group of domain.groups ?? []) {
    if (group.items.length > 0) return leafLabel(group.items[0]);
  }
  return null;
}

/** 判断叶子是否属于该域 IA */
export function domainNavHasLeaf(domain: ProductShellDomainNav, leaf: string): boolean {
  if (domain.layout === "flat") {
    return (domain.items ?? []).some((item) => item.label === leaf);
  }
  return (domain.groups ?? []).some((group) => group.items.some((item) => leafLabel(item) === leaf));
}

export function findDomainByPrimaryLabel(
  domains: ProductShellDomainNav[],
  label: string,
): ProductShellDomainNav | undefined {
  return domains.find((domain) => domain.entry.kind === "primary" && domain.entry.label === label);
}

export function findDomainByUtilityIcon(
  domains: ProductShellDomainNav[],
  icon: IconName,
): ProductShellDomainNav | undefined {
  return domains.find((domain) => domain.entry.kind === "utility" && domain.entry.icon === icon);
}
