import type { CSSProperties, ReactNode } from "react";
import { Badge, theme, type BadgeProps } from "antd";
import { tokenRgba } from "../design-system/color-utils";
import tokens from "../design-system/tokens.resolved.json";
import "./badge.css";

const c = tokens.color as Record<string, string>;
const u = tokens.unit as Record<string, number>;

type AntdStatus = NonNullable<BadgeProps["status"]>;

export type SensBadgeVariant = "count" | "status" | "weakCount";
export type SensWeakBadgeState = "default" | "active" | "disabled";
/** 弱化徽标默认/禁用灰底：透明（标签页行内）| 实心（按钮角标） */
export type SensWeakBadgeSurface = "transparent" | "solid";
export type SensStatusTone = "error" | "warning" | "success" | "processing" | "default" | "midnight";

const STATUS_TO_ANTD: Record<Exclude<SensStatusTone, "midnight">, AntdStatus> = {
  error: "error",
  warning: "warning",
  success: "success",
  processing: "processing",
  default: "default",
};

function resolveWeakSurface(
  weakSurface: SensWeakBadgeSurface | undefined,
  hasChildren: boolean,
): SensWeakBadgeSurface {
  if (weakSurface) return weakSurface;
  return hasChildren ? "solid" : "transparent";
}

function weakBadgeVars(surface: SensWeakBadgeSurface, colorPrimary: string): CSSProperties {
  const neutralBg =
    surface === "solid"
      ? c["background-01"]
      : tokenRgba("background-transparent-grey", 0.08);

  return {
    "--sens-badge-weak-bg-default": neutralBg,
    "--sens-badge-weak-text-default": tokenRgba("text-article-color-transparent", 0.58),
    "--sens-badge-weak-bg-active": c["component-light-background"],
    "--sens-badge-weak-text-active": colorPrimary,
    "--sens-badge-weak-bg-disabled": neutralBg,
    "--sens-badge-weak-text-disabled": tokenRgba("text-color-transparent-disable", 0.3),
    "--sens-badge-weak-height": `${u["size/xxs"]}px`,
    "--sens-badge-weak-min-width": `${u["size/xxs"]}px`,
    "--sens-badge-weak-padding-inline-compact": `${u["spacing/0․5x"]}px`,
    "--sens-badge-weak-padding-inline-overflow": `${u["spacing/horizontal/1x"] + u["spacing/0․5x"]}px`,
    "--sens-badge-weak-radius-compact": `${u["radius/xl"]}px`,
    "--sens-badge-weak-radius-overflow": `${u["spacing/2x"]}px`,
    "--sens-badge-text-default": c["text-color"],
    "--sens-badge-text-active": colorPrimary,
    "--sens-badge-text-disabled": c["text-color-disable"],
  } as CSSProperties;
}

function resolveDisplayCount(count: SensBadgeProps["count"], overflowCount: number): string {
  if (typeof count !== "number") return "";
  return count > overflowCount ? `${overflowCount}+` : String(count);
}

/** 点徽标圆点尺寸 · size/mini → components.Badge.dotSize / statusSize */
function statusDotVars(color: string): CSSProperties {
  return {
    "--sens-badge-dot-size": `${u["size/mini"]}px`,
    "--sens-badge-dot-color": color,
  } as CSSProperties;
}

function MidnightStatusBadge({ text }: { text?: ReactNode }) {
  const dotVars = statusDotVars(c["icon-color-transparent"]);

  return (
    <span className="sens-badge-status sens-badge-status--midnight" style={dotVars}>
      <span className="sens-badge-status-dot" aria-hidden />
      {text ? <span className="sens-badge-status-text">{text}</span> : null}
    </span>
  );
}

function useCountBadgeVars(): CSSProperties {
  return {
    "--sens-badge-count-bg": c["warning-color"],
    "--sens-badge-count-text": c.white,
    "--sens-badge-count-height": `${u["size/xxs"]}px`,
    "--sens-badge-count-min-width": `${u["size/xxs"]}px`,
    "--sens-badge-count-padding-inline-compact": `${u["spacing/0․5x"]}px`,
    "--sens-badge-count-padding-inline-overflow": `${u["spacing/horizontal/1x"] + u["spacing/0․5x"]}px`,
    "--sens-badge-count-radius-compact": `${u["radius/circular"]}px`,
    "--sens-badge-count-radius-overflow": `${u["spacing/2x"]}px`,
  } as CSSProperties;
}

function useBadgePreviewPanelVars(colorPrimary: string): CSSProperties {
  return {
    "--sens-badge-preview-panel-bg": c.white,
    "--sens-badge-preview-panel-radius": `${u["radius/xl"]}px`,
    "--sens-badge-preview-panel-width": "486px",
    "--sens-badge-preview-panel-height": "860px",
    "--sens-badge-preview-panel-padding": `${u["spacing/4x"]}px`,
    "--sens-badge-text-default": c["text-color"],
    "--sens-badge-text-active": colorPrimary,
    "--sens-badge-title-border": c["warning-color"],
    "--sens-badge-panel-border": c["link-light-outline"],
  } as CSSProperties;
}

export interface SensBadgeProps {
  variant?: SensBadgeVariant;
  count?: number;
  overflowCount?: number;
  showZero?: boolean;
  offset?: [number, number];
  children?: ReactNode;
  status?: SensStatusTone;
  text?: ReactNode;
  dot?: boolean;
  weakState?: SensWeakBadgeState;
  /** 弱化默认/禁用灰底；未传时：有 children → solid，无 children → transparent */
  weakSurface?: SensWeakBadgeSurface;
}

/**
 * 徽标封装：
 * - count：常规数字徽标（红底白字，沿用 antd 语义）
 * - status：状态徽标（含子夜黑 midnight 扩展）
 * - weakCount：弱化型数字徽标（灰/绿系，常用于 tab 辅助计数）
 */
export function SensBadge({
  variant = "count",
  count,
  overflowCount = 99,
  showZero = false,
  offset,
  children,
  status = "default",
  text,
  dot,
  weakState = "default",
  weakSurface,
}: SensBadgeProps) {
  const { token } = theme.useToken();
  const displayCount = resolveDisplayCount(count, overflowCount);
  const shouldRenderCount = Boolean(dot) || showZero || (typeof count === "number" && count > 0);
  const isOverflowLike = displayCount.length > 1;
  const resolvedWeakSurface = resolveWeakSurface(weakSurface, Boolean(children));

  if (variant === "status") {
    if (status === "midnight") {
      return <MidnightStatusBadge text={text} />;
    }
    return <Badge status={STATUS_TO_ANTD[status]} text={text} />;
  }

  if (variant === "weakCount") {
    const weakCountNode = (
      <span
        className={[
          "sens-badge-weak-count",
          `sens-badge-weak--${weakState}`,
          isOverflowLike ? "sens-badge-weak--overflow" : "sens-badge-weak--compact",
        ].join(" ")}
        style={
          {
            ...weakBadgeVars(resolvedWeakSurface, token.colorPrimary),
            "--sens-badge-weak-font-size": `${token.fontSizeSM}px`,
            "--sens-badge-weak-line-height": `${u["size/xxs"] + u["spacing/0․5x"]}px`,
          } as CSSProperties
        }
      >
        {displayCount}
      </span>
    );

    if (!children) return weakCountNode;

    return (
      <Badge
        count={weakCountNode}
        showZero={showZero}
        offset={offset}
        className="sens-badge-weak-anchor"
      >
        {children}
      </Badge>
    );
  }

  if (variant === "count" && !dot) {
    if (!shouldRenderCount) return children ? <>{children}</> : null;
    const countNode = (
      <span
        className={[
          "sens-badge-count",
          isOverflowLike ? "sens-badge-count--overflow" : "sens-badge-count--compact",
        ].join(" ")}
        style={
          {
            ...useCountBadgeVars(),
            "--sens-badge-count-font-size": `${token.fontSizeSM}px`,
            "--sens-badge-count-line-height": `${u["size/xxs"] + u["spacing/0․5x"]}px`,
          } as CSSProperties
        }
      >
        {displayCount}
      </span>
    );
    if (!children) return countNode;
    return (
      <Badge count={countNode} offset={offset} className="sens-badge-count-anchor">
        {children}
      </Badge>
    );
  }

  return (
    <Badge count={count} overflowCount={overflowCount} showZero={showZero} offset={offset} dot={dot}>
      {children}
    </Badge>
  );
}

export function BadgeStatesPreview() {
  const { token } = theme.useToken();
  return (
    <div className="sens-badge-preview-panel" style={useBadgePreviewPanelVars(token.colorPrimary)}>
      <div className="sens-badge-section">
        <div className="sens-badge-section-title">徽标 / 基础徽标</div>
        <div className="sens-badge-section-body sens-badge-section-body--basic">
          <div className="sens-badge-row">
            <span className="sens-badge-row-label">个位数</span>
            <SensBadge variant="count" count={6} />
          </div>
          <div className="sens-badge-row">
            <span className="sens-badge-row-label">99+</span>
            <SensBadge variant="count" count={108} overflowCount={99} />
          </div>
        </div>
      </div>

      <div className="sens-badge-section">
        <div className="sens-badge-section-title">徽标 / 弱化徽标 · 实心（按钮角标）</div>
        <div className="sens-badge-section-body">
          <div className="sens-badge-independent-matrix">
            <div className="sens-badge-independent-head">
              <span className="sens-badge-independent-head-spacer" aria-hidden="true" />
              <span className="sens-badge-state-label sens-badge-state-label--default">默认</span>
              <span className="sens-badge-state-label sens-badge-state-label--active">选中</span>
              <span className="sens-badge-state-label sens-badge-state-label--disabled">禁用</span>
            </div>
            <div className="sens-badge-independent-row">
              <span className="sens-badge-independent-label">个位数</span>
              <SensBadge variant="weakCount" count={6} weakState="default" weakSurface="solid" />
              <SensBadge variant="weakCount" count={6} weakState="active" weakSurface="solid" />
              <SensBadge variant="weakCount" count={6} weakState="disabled" weakSurface="solid" />
            </div>
            <div className="sens-badge-independent-row">
              <span className="sens-badge-independent-label">99+</span>
              <SensBadge variant="weakCount" count={108} overflowCount={99} weakState="default" weakSurface="solid" />
              <SensBadge variant="weakCount" count={108} overflowCount={99} weakState="active" weakSurface="solid" />
              <SensBadge variant="weakCount" count={108} overflowCount={99} weakState="disabled" weakSurface="solid" />
            </div>
          </div>
        </div>
      </div>

      <div className="sens-badge-section">
        <div className="sens-badge-section-title">徽标 / 弱化徽标 · 透明（标签页）</div>
        <div className="sens-badge-section-body">
          <div className="sens-badge-independent-matrix">
            <div className="sens-badge-independent-head">
              <span className="sens-badge-independent-head-spacer" aria-hidden="true" />
              <span className="sens-badge-state-label sens-badge-state-label--default">默认</span>
              <span className="sens-badge-state-label sens-badge-state-label--active">选中</span>
              <span className="sens-badge-state-label sens-badge-state-label--disabled">禁用</span>
            </div>
            <div className="sens-badge-independent-row">
              <span className="sens-badge-independent-label">个位数</span>
              <SensBadge variant="weakCount" count={6} weakState="default" weakSurface="transparent" />
              <SensBadge variant="weakCount" count={6} weakState="active" weakSurface="transparent" />
              <SensBadge variant="weakCount" count={6} weakState="disabled" weakSurface="transparent" />
            </div>
            <div className="sens-badge-independent-row">
              <span className="sens-badge-independent-label">99+</span>
              <SensBadge variant="weakCount" count={108} overflowCount={99} weakState="default" weakSurface="transparent" />
              <SensBadge variant="weakCount" count={108} overflowCount={99} weakState="active" weakSurface="transparent" />
              <SensBadge variant="weakCount" count={108} overflowCount={99} weakState="disabled" weakSurface="transparent" />
            </div>
          </div>
        </div>
      </div>

      <div className="sens-badge-section">
        <div className="sens-badge-section-title">徽标 / 点徽标</div>
        <div className="sens-badge-section-body">
          <div className="sens-badge-dot-head">
            <span>旭日红</span>
            <span>原野黄</span>
            <span>极光绿</span>
            <span>冰绽蓝</span>
            <span>子夜黑</span>
          </div>
          <div className="sens-badge-dot-row">
            <SensBadge variant="status" status="error" />
            <SensBadge variant="status" status="warning" />
            <SensBadge variant="status" status="success" />
            <SensBadge variant="status" status="processing" />
            <SensBadge variant="status" status="midnight" />
          </div>
        </div>
      </div>
    </div>
  );
}
