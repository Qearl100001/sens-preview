import type { ReactNode } from "react";
import { buildShadow, getColorToken } from "../../design-system/color-utils";
import { getThemeSideBackground } from "../../design-system/navigation-color";
import { getTypographyToken } from "../../design-system/typography";
import tokens from "../../design-system/tokens.resolved.json";
import { ProductShellPlaceholder } from "../tiktok-ads-connections/ProductShellPlaceholder";

const u = tokens.unit as Record<string, number>;

export const AGENT_EVAL_SIDE_NAV_WIDTH = 220;

const SIDE_NAV_ITEMS = [
  { label: "评测报告", active: true },
  { label: "评测任务", active: false },
  { label: "标注工作台", active: false },
] as const;

function AgentEvalSideNav() {
  const sideText = getColorToken("theme-side-text");
  const sideActiveText = getColorToken("theme-side-text-active");
  const sideActiveBg = getColorToken("theme-side-background-active");

  return (
    <aside
      style={{
        width: AGENT_EVAL_SIDE_NAV_WIDTH,
        flexShrink: 0,
        background: getThemeSideBackground(),
        paddingBottom: u["spacing/6x"],
        borderTopLeftRadius: u["radius/xl"],
        overflow: "hidden",
      }}
      aria-label="Agent Analytics 侧导航"
    >
      <div
        style={{
          height: 62,
          display: "flex",
          alignItems: "center",
          padding: u["spacing/4x"],
          color: sideText,
          fontSize: getTypographyToken("font-size/xxl"),
          lineHeight: `${getTypographyToken("line-height/xxl")}px`,
          fontWeight: getTypographyToken("font-weight/semibold"),
        }}
      >
        Agent Analytics
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: u["spacing/1x"], paddingInline: u["spacing/2x"] }}>
        {SIDE_NAV_ITEMS.map((item) => (
          <div
            key={item.label}
            style={{
              height: 36,
              display: "flex",
              alignItems: "center",
              paddingLeft: 34,
              paddingRight: u["spacing/3x"],
              borderRadius: u["radius/m"],
              background: item.active ? sideActiveBg : undefined,
              color: item.active ? sideActiveText : sideText,
              fontSize: getTypographyToken("font-size/m"),
              lineHeight: `${getTypographyToken("line-height/m")}px`,
              fontWeight: item.active
                ? getTypographyToken("font-weight/medium")
                : getTypographyToken("font-weight/regular"),
              opacity: item.active ? 1 : 0.72,
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
    </aside>
  );
}

export interface AgentEvalShellProps {
  children: ReactNode;
}

export function AgentEvalShell({ children }: AgentEvalShellProps) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <ProductShellPlaceholder />
      <div
        style={{
          flex: 1,
          display: "flex",
          minHeight: 0,
          background: getColorToken("body-background"),
          borderTopLeftRadius: u["radius/xl"],
          borderTopRightRadius: u["radius/xl"],
          overflow: "hidden",
        }}
      >
        <AgentEvalSideNav />
        <main
          style={{
            flex: 1,
            minWidth: 0,
            background: getColorToken("white"),
            borderTopRightRadius: u["radius/xl"],
            boxShadow: buildShadow("D2", "left"),
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
