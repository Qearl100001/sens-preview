import pageNotFound from "../assets/empty-state/page/not-found.png";
import pageNetworkError from "../assets/empty-state/page/network-error.png";
import pageSearchNoResult from "../assets/empty-state/page/search-no-result.png";
import pageNoData from "../assets/empty-state/page/no-data.png";
import pageNoPermission from "../assets/empty-state/page/no-permission.png";

import nonPageNetworkError from "../assets/empty-state/non-page/network-error.png";
import nonPageNoResult from "../assets/empty-state/non-page/no-result.png";
import nonPageNoPermission from "../assets/empty-state/non-page/no-permission.png";
import nonPageNoData from "../assets/empty-state/non-page/no-data.png";
import nonPageLoadFailed from "../assets/empty-state/non-page/load-failed.png";

import loadFailedSmall from "../assets/empty-state/non-page/load-failed-small.png";
import noDataSmall from "../assets/empty-state/non-page/no-data-small.png";
import noResultSmall from "../assets/empty-state/non-page/no-result-small.png";
import networkErrorSmall from "../assets/empty-state/non-page/network-error-small.png";
import noPermissionSmall from "../assets/empty-state/non-page/no-permission-small.png";

/** 页面级异常类型（Figma 4372:25723） */
export type PageEmptyType =
  | "notFound"
  | "networkError"
  | "searchNoResult"
  | "noData"
  | "noPermission";

/** 非页面级异常类型（Figma 4372:25735） */
export type NonPageEmptyType =
  | "networkError"
  | "noResult"
  | "noPermission"
  | "noData"
  | "loadFailed";

/**
 * @deprecated 兼容 Table / SelectDropdown；等同 `NonPageEmptyType` 的子集特殊尺寸映射。
 * 新代码优先用 `resolveEmptyStateIllustration`。
 */
export type NonPageEmptyIllustrationKey = Extract<NonPageEmptyType, "noResult" | "loadFailed" | "noData">;

export const PAGE_EMPTY_ILLUSTRATIONS: Record<PageEmptyType, string> = {
  notFound: pageNotFound,
  networkError: pageNetworkError,
  searchNoResult: pageSearchNoResult,
  noData: pageNoData,
  noPermission: pageNoPermission,
};

export const NON_PAGE_EMPTY_ILLUSTRATIONS: Record<NonPageEmptyType, string> = {
  networkError: nonPageNetworkError,
  noResult: nonPageNoResult,
  noPermission: nonPageNoPermission,
  noData: nonPageNoData,
  loadFailed: nonPageLoadFailed,
};

/** 特殊尺寸展示仍用 100px 源图，CSS 缩放到 50px */
export const NON_PAGE_EMPTY_ILLUSTRATIONS_SPECIAL: Record<NonPageEmptyType, string> = {
  networkError: networkErrorSmall,
  noResult: noResultSmall,
  noPermission: noPermissionSmall,
  noData: noDataSmall,
  loadFailed: loadFailedSmall,
};

/**
 * 兼容旧消费方（SelectDropdownEmpty / TableShell）。
 * 映射到非页面级特殊尺寸资产。
 */
export const EMPTY_STATE_ILLUSTRATIONS: Record<NonPageEmptyIllustrationKey, string> = {
  noResult: noResultSmall,
  loadFailed: loadFailedSmall,
  noData: noDataSmall,
};

export type EmptyStateScope = "page" | "non-page";
export type PageEmptySize = "large" | "small";
export type NonPageEmptySize = "base" | "special";

export function resolveEmptyStateIllustration(
  scope: "page",
  type: PageEmptyType,
  _size?: PageEmptySize,
): string;
export function resolveEmptyStateIllustration(
  scope: "non-page",
  type: NonPageEmptyType,
  size?: NonPageEmptySize,
): string;
export function resolveEmptyStateIllustration(
  scope: EmptyStateScope,
  type: PageEmptyType | NonPageEmptyType,
  size?: PageEmptySize | NonPageEmptySize,
): string {
  if (scope === "page") {
    return PAGE_EMPTY_ILLUSTRATIONS[type as PageEmptyType];
  }
  if (size === "special") {
    return NON_PAGE_EMPTY_ILLUSTRATIONS_SPECIAL[type as NonPageEmptyType];
  }
  return NON_PAGE_EMPTY_ILLUSTRATIONS[type as NonPageEmptyType];
}
