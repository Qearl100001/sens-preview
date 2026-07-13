import { tokenRgba } from "../../../design-system/color-utils";
import { getTypographyToken } from "../../../design-system/typography";
import tokens from "../../../design-system/tokens.resolved.json";

const u = tokens.unit as Record<string, number>;

/** AgentEval 专用页头：72px 内标题 + 4px 辅助文案，不扩展 sensd SensPageTitleBar。 */
export const EVAL_PAGE_HEADER_HEIGHT = 72;

export interface EvalPageHeaderProps {
  title: string;
  description: string;
}

export function EvalPageHeader({ title, description }: EvalPageHeaderProps) {
  return (
    <header
      style={{
        height: EVAL_PAGE_HEADER_HEIGHT,
        minHeight: EVAL_PAGE_HEADER_HEIGHT,
        boxSizing: "border-box",
        flexShrink: 0,
        paddingInline: u["spacing/6x"],
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: u["spacing/1x"],
        }}
      >
        <div
          style={{
            minWidth: 0,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            color: tokenRgba("text-color-transparent", 0.9),
            fontSize: getTypographyToken("font-size/xxl"),
            lineHeight: `${getTypographyToken("line-height/xxl")}px`,
            fontWeight: getTypographyToken("font-weight/semibold"),
          }}
        >
          {title}
        </div>
        <div
          style={{
            minWidth: 0,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            color: tokenRgba("text-sub-color-transparent", 0.58),
            fontSize: getTypographyToken("font-size/s"),
            lineHeight: `${getTypographyToken("line-height/s")}px`,
          }}
        >
          {description}
        </div>
      </div>
    </header>
  );
}
