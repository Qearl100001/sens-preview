import type { CSSProperties, ReactNode } from "react";
import { getColorToken, tokenRgba } from "../../../design-system/color-utils";
import { getDividerBorder } from "../../../design-system/divider";
import { getTypographyToken } from "../../../design-system/typography";
import tokens from "../../../design-system/tokens.resolved.json";

const u = tokens.unit as Record<string, number>;

/** Tab / 筛选 / Meta 等工具区栈内间距 */
export const EVAL_TOOLBAR_STACK_GAP = u["spacing/4x"];
/** 任务概况 / 维度对比 / 用例明细等大模块栈间距 */
export const EVAL_MODULE_STACK_GAP = u["spacing/10x"];

export interface EvalPanelProps {
  title?: ReactNode;
  extra?: ReactNode;
  padding?: number;
  children: ReactNode;
  style?: CSSProperties;
  /** 嵌套表格时去掉面板外描边 */
  borderless?: boolean;
}

export function EvalPanel({ title, extra, padding, children, style, borderless = false }: EvalPanelProps) {
  const hasHeader = title != null || extra != null;

  return (
    <section
      style={{
        background: getColorToken("white"),
        border: borderless ? "none" : getDividerBorder("outline", "transparent"),
        borderRadius: u["radius/l"],
        overflow: "hidden",
        ...style,
      }}
    >
      {hasHeader ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: `${u["spacing/3x"]}px ${u["spacing/4x"]}px`,
            borderBottom: getDividerBorder("outline", "transparent"),
          }}
        >
          {title ? (
            <span
              style={{
                color: tokenRgba("text-color-transparent", 0.9),
                fontSize: getTypographyToken("font-size/m"),
                lineHeight: `${getTypographyToken("line-height/m")}px`,
                fontWeight: getTypographyToken("font-weight/semibold"),
              }}
            >
              {title}
            </span>
          ) : (
            <span />
          )}
          {extra}
        </div>
      ) : null}
      <div style={{ padding: padding ?? u["spacing/4x"] }}>{children}</div>
    </section>
  );
}

export interface EvalSectionTitleProps {
  title: string;
  /** 标题下方辅助文案，与标题间距 spacing/1x（4px） */
  subtitle?: string;
  actions?: ReactNode;
}

export function EvalSectionTitle({ title, subtitle, actions }: EvalSectionTitleProps) {
  const titleBlock = (
    <div
      style={{
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: subtitle ? u["spacing/1x"] : undefined,
      }}
    >
      <span
        style={{
          color: tokenRgba("text-color-transparent", 0.9),
          fontSize: getTypographyToken("font-size/l"),
          lineHeight: `${getTypographyToken("line-height/l")}px`,
          fontWeight: getTypographyToken("font-weight/semibold"),
        }}
      >
        {title}
      </span>
      {subtitle ? (
        <span
          style={{
            fontSize: getTypographyToken("font-size/s"),
            lineHeight: `${getTypographyToken("line-height/s")}px`,
            color: tokenRgba("text-sub-color-transparent", 0.58),
          }}
        >
          {subtitle}
        </span>
      ) : null}
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: subtitle ? "flex-start" : "center",
        justifyContent: "space-between",
        gap: u["spacing/3x"],
        marginBottom: subtitle ? undefined : u["spacing/1x"],
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: u["spacing/2x"], minWidth: 0 }}>
        <span
          aria-hidden
          style={{
            width: 3,
            height: 18,
            borderRadius: u["radius/s"],
            background: getColorToken("component-primary"),
            flexShrink: 0,
            marginTop: subtitle ? (getTypographyToken("line-height/l") - 18) / 2 : undefined,
          }}
        />
        {titleBlock}
      </div>
      {actions}
    </div>
  );
}
