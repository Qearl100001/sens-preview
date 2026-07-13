import { getColorToken, tokenRgba } from "../../../design-system/color-utils";
import { getDividerBorder } from "../../../design-system/divider";
import { getTypographyToken } from "../../../design-system/typography";
import tokens from "../../../design-system/tokens.resolved.json";
import type { EvalMetaItem } from "../evalDashboardTypes";

const u = tokens.unit as Record<string, number>;

export function EvalMetaBar({ items }: { items: EvalMetaItem[] }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: u["spacing/4x"],
        padding: `${u["spacing/2x"]}px 0 ${u["spacing/1x"]}px`,
      }}
    >
      <span
        style={{
          fontSize: getTypographyToken("font-size/s"),
          fontWeight: getTypographyToken("font-weight/semibold"),
          color: tokenRgba("text-sub-color-transparent", 0.58),
          whiteSpace: "nowrap",
        }}
      >
        基础信息
      </span>
      <div style={{ display: "flex", flexWrap: "wrap", fontSize: getTypographyToken("font-size/s") }}>
        {items.map((item, index) => (
          <span
            key={item.label}
            style={{
              paddingRight: u["spacing/4x"],
              marginRight: u["spacing/4x"],
              borderRight: index < items.length - 1 ? getDividerBorder("outline", "transparent") : undefined,
              color: tokenRgba("text-sub-color-transparent", 0.58),
            }}
          >
            <span
              style={{
                fontWeight: getTypographyToken("font-weight/semibold"),
                color: tokenRgba("text-color-transparent", 0.9),
                marginRight: u["spacing/1x"],
              }}
            >
              {item.label}
            </span>
            {item.value}
          </span>
        ))}
      </div>
    </div>
  );
}
