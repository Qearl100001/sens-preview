import type { DefaultOptionType } from "antd/es/select";
import { useEffect, useMemo, useState } from "react";
import {
  buildOptionSearchIndex,
  defaultSelectOptionMatcher,
  getOptionLabel,
  getOptionSearchText,
  matchSelectOptionByKeys,
  normalizeSelectQuery,
  type OptionSearchIndexEntry,
  type SelectOptionFilterMatcher,
} from "./matchSelectOption";

export type SelectDropdownSearchMode = "local" | "remote";
export type SelectDropdownDataStatus = "idle" | "loading" | "ready" | "failed";
export type SelectDropdownSearchStatus = "idle" | "debouncing" | "searching" | "done";

export type SelectDropdownContentPhase =
  | "fullList"
  | "searching"
  | "hasResults"
  | "noResults"
  | "dataLoading"
  | "emptyData"
  | "loadFailed";

export interface UseSelectDropdownSearchOptions {
  searchable: boolean;
  searchMode: SelectDropdownSearchMode;
  searchDebounce: number;
  options?: DefaultOptionType[];
  loading?: boolean;
  optionsLoadFailed?: boolean;
  onSearch?: (query: string) => void;
  filterMatcher?: SelectOptionFilterMatcher;
}

export interface UseSelectDropdownSearchResult {
  query: string;
  setQuery: (value: string) => void;
  resetSearch: () => void;
  dataStatus: SelectDropdownDataStatus;
  searchStatus: SelectDropdownSearchStatus;
  contentPhase: SelectDropdownContentPhase;
  displayOptions: DefaultOptionType[];
  resultCount: number;
  sourceCount: number;
  showOptionList: boolean;
  /** 与 sourceOptions 同步的预计算索引（供性能验收） */
  searchIndex: OptionSearchIndexEntry[];
}

function filterOptionsLocal(
  searchIndex: OptionSearchIndexEntry[],
  query: string,
  filterMatcher?: SelectOptionFilterMatcher,
): DefaultOptionType[] {
  const normalized = normalizeSelectQuery(query);
  if (!normalized) {
    return searchIndex.map((entry) => entry.option);
  }

  if (filterMatcher) {
    return searchIndex
      .filter((entry) => filterMatcher(entry.label, normalized, entry.searchText))
      .map((entry) => entry.option);
  }

  return searchIndex
    .filter((entry) => matchSelectOptionByKeys(entry.keys, normalized))
    .map((entry) => entry.option);
}

export function resolveSelectDropdownContentPhase(params: {
  dataStatus: SelectDropdownDataStatus;
  query: string;
  searchStatus: SelectDropdownSearchStatus;
  resultCount: number;
  sourceEmpty: boolean;
}): SelectDropdownContentPhase {
  const { dataStatus, query, searchStatus, resultCount, sourceEmpty } = params;
  const trimmedQuery = query.trim();

  if (dataStatus === "loading") return "dataLoading";
  if (dataStatus === "failed") return "loadFailed";
  if (dataStatus === "ready" && !trimmedQuery && sourceEmpty) return "emptyData";
  if (trimmedQuery && (searchStatus === "debouncing" || searchStatus === "searching")) {
    return "searching";
  }
  if (trimmedQuery && searchStatus === "done" && resultCount === 0) return "noResults";
  if (trimmedQuery && searchStatus === "done" && resultCount > 0) return "hasResults";
  return "fullList";
}

export function useSelectDropdownSearch({
  searchable,
  searchMode,
  searchDebounce,
  options,
  loading,
  optionsLoadFailed,
  onSearch,
  filterMatcher,
}: UseSelectDropdownSearchOptions): UseSelectDropdownSearchResult {
  const [query, setQuery] = useState("");
  const [searchStatus, setSearchStatus] = useState<SelectDropdownSearchStatus>("idle");

  const sourceOptions = options ?? [];
  const sourceCount = sourceOptions.length;
  const sourceEmpty = sourceCount === 0;

  const searchIndex = useMemo(
    () => buildOptionSearchIndex(sourceOptions),
    [sourceOptions],
  );

  const dataStatus: SelectDropdownDataStatus = useMemo(() => {
    if (optionsLoadFailed) return "failed";
    if (loading) return "loading";
    return "ready";
  }, [loading, optionsLoadFailed]);

  const resetSearch = () => {
    setQuery("");
    setSearchStatus("idle");
  };

  useEffect(() => {
    if (!searchable) {
      setSearchStatus("idle");
      return;
    }

    const trimmed = query.trim();
    if (!trimmed) {
      setSearchStatus("idle");
      return;
    }

    setSearchStatus("debouncing");
    const timer = window.setTimeout(() => {
      setSearchStatus("searching");
      if (searchMode === "remote") {
        onSearch?.(trimmed);
      } else {
        setSearchStatus("done");
      }
    }, searchDebounce);

    return () => window.clearTimeout(timer);
  }, [query, searchDebounce, searchable, searchMode, onSearch]);

  useEffect(() => {
    if (!searchable || searchMode !== "remote") return;
    if (!query.trim()) return;
    if (!loading && searchStatus === "searching") {
      setSearchStatus("done");
    }
  }, [loading, query, searchMode, searchable, searchStatus]);

  const displayOptions = useMemo(() => {
    if (!searchable) return sourceOptions;

    const trimmed = query.trim();
    if (!trimmed) return sourceOptions;
    if (searchStatus !== "done") return [];

    if (searchMode === "remote") return sourceOptions;
    return filterOptionsLocal(searchIndex, trimmed, filterMatcher);
  }, [searchable, sourceOptions, query, searchStatus, searchMode, searchIndex, filterMatcher]);

  const resultCount = displayOptions.length;

  const contentPhase = resolveSelectDropdownContentPhase({
    dataStatus,
    query,
    searchStatus,
    resultCount,
    sourceEmpty,
  });

  const showOptionList = contentPhase === "fullList" || contentPhase === "hasResults";

  return {
    query,
    setQuery,
    resetSearch,
    dataStatus,
    searchStatus,
    contentPhase,
    displayOptions,
    resultCount,
    sourceCount,
    showOptionList,
    searchIndex,
  };
}

// Re-export for tests / custom matchers built on defaults
export { defaultSelectOptionMatcher, getOptionLabel, getOptionSearchText };
