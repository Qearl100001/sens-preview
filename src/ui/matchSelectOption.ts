import type { DefaultOptionType } from "antd/es/select";
import { pinyin } from "pinyin-pro";

export type SelectOptionFilterMatcher = (
  label: string,
  query: string,
  searchText?: string,
) => boolean;

/** 业务可选：多音字 / 专有名词搜索兜底 */
export type SensSelectDropdownOption = DefaultOptionType & {
  searchText?: string;
};

export interface OptionSearchKeys {
  labelLower: string;
  fullPinyin: string;
  initials: string;
  searchTextLower?: string;
  searchTextFullPinyin?: string;
  searchTextInitials?: string;
}

/** 按 label + searchText 缓存；不做淘汰，依赖 options 集合有界 */
const keysCache = new Map<string, OptionSearchKeys>();

function cacheKey(label: string, searchText?: string): string {
  return `${label}\0${searchText ?? ""}`;
}

function toFullPinyin(text: string): string {
  return pinyin(text, { toneType: "none", type: "array" }).join("").toLowerCase();
}

function toInitials(text: string): string {
  return pinyin(text, { pattern: "first", toneType: "none", type: "array" }).join("").toLowerCase();
}

export function normalizeSelectQuery(query: string): string {
  return query.trim().toLowerCase();
}

export function buildOptionSearchKeys(label: string, searchText?: string): OptionSearchKeys {
  const key = cacheKey(label, searchText);
  const cached = keysCache.get(key);
  if (cached) return cached;

  const keys: OptionSearchKeys = {
    labelLower: label.toLowerCase(),
    fullPinyin: toFullPinyin(label),
    initials: toInitials(label),
  };

  if (searchText) {
    keys.searchTextLower = searchText.toLowerCase();
    keys.searchTextFullPinyin = toFullPinyin(searchText);
    keys.searchTextInitials = toInitials(searchText);
  }

  keysCache.set(key, keys);
  return keys;
}

export function getOptionSearchText(option: DefaultOptionType): string | undefined {
  return (option as SensSelectDropdownOption).searchText;
}

export function getOptionLabel(option: DefaultOptionType): string {
  return String(option.label ?? option.value ?? "");
}

export function matchSelectOptionByKeys(keys: OptionSearchKeys, query: string): boolean {
  const normalized = normalizeSelectQuery(query);
  if (!normalized) return true;

  if (keys.labelLower.includes(normalized)) return true;
  if (keys.fullPinyin.includes(normalized)) return true;
  if (keys.initials.includes(normalized)) return true;
  if (keys.searchTextLower?.includes(normalized)) return true;
  if (keys.searchTextFullPinyin?.includes(normalized)) return true;
  if (keys.searchTextInitials?.includes(normalized)) return true;

  return false;
}

export function defaultSelectOptionMatcher(
  label: string,
  query: string,
  searchText?: string,
): boolean {
  return matchSelectOptionByKeys(buildOptionSearchKeys(label, searchText), query);
}

export interface OptionSearchIndexEntry {
  option: DefaultOptionType;
  label: string;
  searchText?: string;
  keys: OptionSearchKeys;
}

export function buildOptionSearchIndex(options: DefaultOptionType[]): OptionSearchIndexEntry[] {
  return options.map((option) => {
    const label = getOptionLabel(option);
    const searchText = getOptionSearchText(option);
    return {
      option,
      label,
      searchText,
      keys: buildOptionSearchKeys(label, searchText),
    };
  });
}
