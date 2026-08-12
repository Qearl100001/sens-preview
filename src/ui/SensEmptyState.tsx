import type { CSSProperties, ReactNode } from "react";
import { getColorToken, tokenRgba } from "../design-system/color-utils";
import { getTypographyToken } from "../design-system/typography";
import { getUnitToken } from "../design-system/unit";
import { SensButton } from "./SensButton";
import {
  resolveEmptyStateIllustration,
  type EmptyStateScope,
  type NonPageEmptySize,
  type NonPageEmptyType,
  type PageEmptySize,
  type PageEmptyType,
} from "./EmptyStateIllustrations";
import "./empty-state.css";

/** 页面级插画→文案间距；等同 `spacing/vertical/8x`（32） */
export const EMPTY_STATE_PAGE_STACK_GAP = getUnitToken("spacing/vertical/8x");

/** 页面级大插画边长（Figma 266） */
export const EMPTY_STATE_PAGE_ILLUSTRATION_LARGE = 266;

/** 页面级小插画边长（Figma 192） */
export const EMPTY_STATE_PAGE_ILLUSTRATION_SMALL = 192;

/** 非页面级基础插画边长（Figma 100） */
export const EMPTY_STATE_NON_PAGE_ILLUSTRATION_BASE = 100;

/** 非页面级特殊插画边长（Figma 50） */
export const EMPTY_STATE_NON_PAGE_ILLUSTRATION_SPECIAL = 50;

type PageDefaults = {
  title: string;
  description: string;
  actionLabel?: string;
  descriptionSuffix?: string;
};

const PAGE_DEFAULTS: Record<PageEmptyType, PageDefaults> = {
  notFound: {
    title: "404 页面",
    description: "当前页面可能被移除，请点击",
    actionLabel: "返回按钮",
    descriptionSuffix: "开启返回首页路线",
  },
  networkError: {
    title: "网络异常",
    description: "网络异常，请",
    actionLabel: "刷新",
  },
  searchNoResult: {
    title: "搜索无结果",
    description: "未找到结果，请重新输入",
  },
  noData: {
    title: "暂无数据",
    description: "暂无数据，请",
    actionLabel: "添加",
  },
  noPermission: {
    title: "暂无权限",
    description: "暂无权限，请联系管理员",
  },
};

const NON_PAGE_DEFAULTS: Record<NonPageEmptyType, PageDefaults> = {
  networkError: {
    title: "网络异常",
    description: "网络异常，请",
    actionLabel: "刷新",
  },
  noResult: {
    title: "暂无结果",
    description: "未找到结果，请重新输入",
  },
  noPermission: {
    title: "暂无权限",
    description: "暂无权限，请联系管理员",
  },
  noData: {
    title: "暂无数据",
    description: "暂无数据，请",
    actionLabel: "添加",
  },
  loadFailed: {
    title: "加载失败",
    description: "数据加载失败，请",
    actionLabel: "刷新",
  },
};

export type SensEmptyStatePageProps = {
  scope: "page";
  type: PageEmptyType;
  size?: PageEmptySize;
};

export type SensEmptyStateNonPageProps = {
  scope: "non-page";
  type: NonPageEmptyType;
  size?: NonPageEmptySize;
};

export type SensEmptyStateProps = (SensEmptyStatePageProps | SensEmptyStateNonPageProps) & {
  title?: ReactNode;
  /**
   * 完整自定义说明。传入后不再拼默认前缀 / 后缀 / 内嵌链接；
   * 需要链接时自行放进节点，或改用 `descriptionPrefix` + `actionLabel`。
   */
  description?: ReactNode;
  /** 覆盖默认说明前缀（与 actionLabel / descriptionSuffix 组合） */
  descriptionPrefix?: string;
  /** 内嵌链接文案；未传 description 时与前缀组合 */
  actionLabel?: string;
  onAction?: () => void;
  /** 标题下方额外操作区（如主按钮），与内嵌链接互不冲突 */
  actions?: ReactNode;
  illustrationSrc?: string;
  className?: string;
  style?: CSSProperties;
};

function resolveIllustrationSize(scope: EmptyStateScope, size?: PageEmptySize | NonPageEmptySize): number {
  if (scope === "page") {
    return size === "small" ? EMPTY_STATE_PAGE_ILLUSTRATION_SMALL : EMPTY_STATE_PAGE_ILLUSTRATION_LARGE;
  }
  return size === "special"
    ? EMPTY_STATE_NON_PAGE_ILLUSTRATION_SPECIAL
    : EMPTY_STATE_NON_PAGE_ILLUSTRATION_BASE;
}

function buildCssVars(scope: EmptyStateScope): CSSProperties {
  if (scope === "page") {
    return {
      ["--sens-empty-stack-gap" as string]: `${getUnitToken("spacing/vertical/8x")}px`,
      ["--sens-empty-text-gap" as string]: `${getUnitToken("spacing/vertical/4x")}px`,
      ["--sens-empty-padding" as string]: "0",
      ["--sens-empty-title-size" as string]: `${getTypographyToken("font-size/l")}px`,
      ["--sens-empty-title-line" as string]: `${getTypographyToken("line-height/l")}px`,
      ["--sens-empty-title-weight" as string]: String(getTypographyToken("font-weight/semibold")),
      ["--sens-empty-desc-size" as string]: `${getTypographyToken("font-size/m")}px`,
      ["--sens-empty-desc-line" as string]: `${getTypographyToken("line-height/m")}px`,
      ["--sens-empty-desc-weight" as string]: String(getTypographyToken("font-weight/regular")),
      ["--sens-empty-title-color" as string]: tokenRgba("text-color-transparent", 0.9),
      ["--sens-empty-desc-color" as string]: tokenRgba("text-sub-color-transparent", 0.58),
      ["--sens-empty-link-color" as string]: getColorToken("link-color"),
      ["--sens-empty-inline-gap" as string]: `${getUnitToken("spacing/horizontal/1x")}px`,
    };
  }

  return {
    ["--sens-empty-stack-gap" as string]: `${getUnitToken("spacing/vertical/3x")}px`,
    ["--sens-empty-text-gap" as string]: `${getUnitToken("spacing/vertical/1x")}px`,
    ["--sens-empty-padding" as string]: `${getUnitToken("spacing/5x")}px`,
    ["--sens-empty-title-size" as string]: `${getTypographyToken("font-size/m")}px`,
    ["--sens-empty-title-line" as string]: `${getTypographyToken("line-height/m")}px`,
    ["--sens-empty-title-weight" as string]: String(getTypographyToken("font-weight/regular")),
    ["--sens-empty-desc-size" as string]: `${getTypographyToken("font-size/s")}px`,
    ["--sens-empty-desc-line" as string]: `${getTypographyToken("line-height/s")}px`,
    ["--sens-empty-desc-weight" as string]: String(getTypographyToken("font-weight/regular")),
    ["--sens-empty-title-color" as string]: tokenRgba("text-color-transparent", 0.9),
    ["--sens-empty-desc-color" as string]: tokenRgba("text-sub-color-transparent", 0.58),
    ["--sens-empty-link-color" as string]: getColorToken("link-color"),
    ["--sens-empty-inline-gap" as string]: `${getUnitToken("spacing/horizontal/1x")}px`,
  };
}

function resolveDefaults(props: SensEmptyStatePageProps | SensEmptyStateNonPageProps): PageDefaults {
  if (props.scope === "page") {
    return PAGE_DEFAULTS[props.type];
  }
  return NON_PAGE_DEFAULTS[props.type];
}

/**
 * 异常状态 / 空态：页面级与非页面级插画 + 标题 + 说明（可内嵌链接）。
 * 资产来自 `EmptyStateIllustrations`；不进入 Icon registry。
 */
export function SensEmptyState(props: SensEmptyStateProps) {
  const {
    scope,
    type,
    size,
    title,
    description,
    descriptionPrefix,
    actionLabel,
    onAction,
    actions,
    illustrationSrc,
    className,
    style,
  } = props;

  const defaults = resolveDefaults(props);
  const illustrationSize = resolveIllustrationSize(scope, size);
  const src =
    illustrationSrc ??
    (scope === "page"
      ? resolveEmptyStateIllustration("page", type as PageEmptyType, size as PageEmptySize | undefined)
      : resolveEmptyStateIllustration(
          "non-page",
          type as NonPageEmptyType,
          (size as NonPageEmptySize | undefined) ?? "base",
        ));

  const resolvedActionLabel = actionLabel ?? defaults.actionLabel;
  const resolvedPrefix = descriptionPrefix ?? defaults.description;
  const showComposedDescription = description === undefined;
  const rootClass = ["sens-empty-state", `sens-empty-state--${scope}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={rootClass}
      style={{ ...buildCssVars(scope), ...style }}
      role="status"
      data-scope={scope}
      data-type={type}
      data-size={size ?? (scope === "page" ? "large" : "base")}
    >
      <img
        className="sens-empty-state-illustration"
        src={src}
        alt=""
        width={illustrationSize}
        height={illustrationSize}
        draggable={false}
      />
      <div className="sens-empty-state-body">
        <p className="sens-empty-state-title">{title ?? defaults.title}</p>
        {showComposedDescription ? (
          <p className="sens-empty-state-desc">
            <span>{resolvedPrefix}</span>
            {resolvedActionLabel ? (
              <>
                <SensButton
                  tone="link"
                  size="small"
                  className="sens-empty-state-action"
                  onClick={onAction}
                >
                  {resolvedActionLabel}
                </SensButton>
                {defaults.descriptionSuffix ? <span>{defaults.descriptionSuffix}</span> : null}
              </>
            ) : null}
          </p>
        ) : description ? (
          <div className="sens-empty-state-desc">{description}</div>
        ) : null}
        {actions ? <div className="sens-empty-state-actions">{actions}</div> : null}
      </div>
    </div>
  );
}
