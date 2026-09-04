import type { MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { SensButton } from "./SensButton";
import { SensIcon } from "../design-system/icons";

const I18N_NS = "组件库";

export type SelectDropdownLoadMoreState = "more" | "loading" | "error";

export interface SelectDropdownLoadMoreProps {
  state: SelectDropdownLoadMoreState;
  interactive?: boolean;
  onLoadMore?: () => void;
  onRetry?: () => void;
}

export function SelectDropdownLoadMore({
  state,
  interactive = true,
  onLoadMore,
  onRetry,
}: SelectDropdownLoadMoreProps) {
  const { t } = useTranslation();
  const label = (key: string, defaultValue: string) => t(`${I18N_NS}.${key}`, { defaultValue });
  const stopOptionInteraction = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  if (state === "loading") {
    return (
      <div
        className="sens-select-dropdown-load-more"
        role="status"
        aria-live="polite"
        onMouseDown={stopOptionInteraction}
        onClick={(event) => event.stopPropagation()}
      >
        <span className="sens-select-dropdown-load-more-content">
          <SensIcon
            name="loading"
            sizeToken="size/icon/m"
            className="sens-select-dropdown-load-more-spinner"
            aria-hidden
          />
          <span>{label("sensd-selectPanel-loadMoreLoading", "加载中")}</span>
        </span>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div
        className="sens-select-dropdown-load-more"
        role="alert"
        onMouseDown={stopOptionInteraction}
        onClick={(event) => event.stopPropagation()}
      >
        <span className="sens-select-dropdown-load-more-content sens-select-dropdown-load-more-content--error">
          <SensIcon name="error" variant="filled" sizeToken="size/icon/m" aria-hidden />
          <span>{label("sensd-selectPanel-loadMoreFailed", "加载失败，请")}</span>
          {interactive ? (
            <SensButton
              tone="linkWeak"
              size="small"
              className="sens-select-dropdown-load-more-action"
              onMouseDown={stopOptionInteraction}
              onClick={onRetry}
            >
              {label("sensd-selectPanel-loadMoreRetry", "重试")}
            </SensButton>
          ) : (
            <span className="sens-select-dropdown-load-more-action">
              {label("sensd-selectPanel-loadMoreRetry", "重试")}
            </span>
          )}
        </span>
      </div>
    );
  }

  return (
    <div
      className="sens-select-dropdown-load-more"
      onMouseDown={stopOptionInteraction}
      onClick={(event) => event.stopPropagation()}
    >
      {interactive ? (
        <SensButton
          tone="linkWeak"
          size="small"
          className="sens-select-dropdown-load-more-action"
          onMouseDown={stopOptionInteraction}
          onClick={onLoadMore}
        >
          {label("sensd-selectPanel-loadMore", "加载更多")}
        </SensButton>
      ) : (
        <span className="sens-select-dropdown-load-more-action">
          {label("sensd-selectPanel-loadMore", "加载更多")}
        </span>
      )}
    </div>
  );
}
