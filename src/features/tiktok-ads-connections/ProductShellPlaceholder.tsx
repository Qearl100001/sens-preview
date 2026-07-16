import { getColorToken } from "../../design-system/color-utils";
import { getThemeTopBackground } from "../../design-system/navigation-color";
import { getTypographyToken } from "../../design-system/typography";
import tokens from "../../design-system/tokens.resolved.json";

const u = tokens.unit as Record<string, number>;

const NAV_ITEMS = [
  "可视化",
  "分析",
  "数据融合",
  "指标平台",
  "场景商店",
  "项目设置",
] as const;

/** 产品壳可见高度（与白卡片衔接） */
const SHELL_VISIBLE_HEIGHT = 82;

const shellTextStyle = {
  color: getColorToken("theme-top-text"),
  fontSize: getTypographyToken("font-size/m"),
  lineHeight: `${getTypographyToken("line-height/m")}px`,
} as const;

export function ProductShellPlaceholder() {
  return (
    <header
      style={{
        height: SHELL_VISIBLE_HEIGHT,
        background: getThemeTopBackground("green"),
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
      }}
      aria-label="SensorsData 产品壳占位"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `${u["spacing/0․5x"]}px ${u["spacing/4x"]}px 0`,
          height: 36,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: u["spacing/6x"] }}>
          <span style={shellTextStyle}>SensorsData</span>
          <span style={shellTextStyle}>正式项目</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: u["spacing/4x"] }}>
          <span style={shellTextStyle}>搜索</span>
          <span style={shellTextStyle}>帮助</span>
          <span style={shellTextStyle}>通知</span>
          <span style={{ ...shellTextStyle, marginLeft: u["spacing/2x"] }}>卓越 · 分析师</span>
        </div>
      </div>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: u["spacing/4x"],
          padding: `${u["spacing/1x"]}px ${u["spacing/4x"]}px`,
          height: 46,
        }}
        aria-hidden
      >
        {NAV_ITEMS.map((item) => {
          const isActive = item === "数据融合";
          return (
            <span
              key={item}
              style={{
                padding: `${u["spacing/1x"]}px ${u["spacing/4x"]}px`,
                borderRadius: u["radius/circular"],
                fontSize: getTypographyToken("font-size/l"),
                lineHeight: `${getTypographyToken("line-height/l")}px`,
                color: isActive ? getColorToken("theme-top-text-active") : getColorToken("theme-top-text"),
                fontWeight: isActive
                  ? getTypographyToken("font-weight/semibold")
                  : getTypographyToken("font-weight/regular"),
                background: isActive ? getColorToken("theme-top-proMenu-background-active") : undefined,
              }}
            >
              {item}
            </span>
          );
        })}
      </nav>
    </header>
  );
}
