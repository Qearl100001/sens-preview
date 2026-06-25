import loadFailedSmall from "../assets/empty-state/non-page/load-failed-small.png";
import noDataSmall from "../assets/empty-state/non-page/no-data-small.png";
import noResultSmall from "../assets/empty-state/non-page/no-result-small.png";

/** 非页面级 · 特殊尺寸空态插图（Figma 4372:25735） */
export type NonPageEmptyIllustrationKey = "noResult" | "loadFailed" | "noData";

export const EMPTY_STATE_ILLUSTRATIONS: Record<NonPageEmptyIllustrationKey, string> = {
  noResult: noResultSmall,
  loadFailed: loadFailedSmall,
  noData: noDataSmall,
};
