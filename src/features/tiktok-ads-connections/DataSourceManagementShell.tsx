import type { ReactNode } from "react";
import { buildShadow, getColorToken } from "../../design-system/color-utils";
import { getThemeSideBackground } from "../../design-system/navigation-color";
import { getTypographyToken } from "../../design-system/typography";
import tokens from "../../design-system/tokens.resolved.json";
import { ProductShellPlaceholder } from "./ProductShellPlaceholder";

const u = tokens.unit as Record<string, number>;

export const DATA_SOURCE_SIDE_NAV_WIDTH = 220;

const SIDE_NAV_GROUPS = [
  {
    title: "埋点数据接入",
    expanded: false,
    items: ["数据接入引导", "入库校验规则设置", "实时导入数据查询", "Debug 实时数据查询"],
  },
  {
    title: "通用数据接入",
    expanded: true,
    activeItem: "数据源管理",
    items: ["数据源管理", "数据表管理", "字段映射", "接入任务"],
  },
] as const;

function SideNavPlaceholder() {
  const sideText = getColorToken("theme-side-text");
  const sideSubText = getColorToken("theme-side-subText");
  const sideActiveText = getColorToken("theme-side-text-active");
  const sideActiveBg = getColorToken("theme-side-background-active");

  return (
    <aside
      style={{
        width: DATA_SOURCE_SIDE_NAV_WIDTH,
        flexShrink: 0,
        background: getThemeSideBackground(),
        paddingBottom: u["spacing/6x"],
        borderTopLeftRadius: u["radius/xl"],
        overflow: "hidden",
      }}
      aria-label="侧导航占位"
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
        数据融合
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: u["spacing/4x"] }}>
        {SIDE_NAV_GROUPS.map((group) => (
          <div key={group.title} style={{ display: "flex", flexDirection: "column", gap: u["spacing/1x"] }}>
            <div
              style={{
                height: 36,
                display: "flex",
                alignItems: "center",
                padding: `7px ${u["spacing/3x"]}px 7px ${u["spacing/3x"]}px`,
                marginInline: u["spacing/2x"],
                color: group.expanded ? sideActiveText : sideSubText,
                fontSize: getTypographyToken("font-size/m"),
                lineHeight: `${getTypographyToken("line-height/m")}px`,
              }}
            >
              {group.title}
            </div>
            {group.expanded
              ? group.items.map((item) => {
                  const isActive = "activeItem" in group && group.activeItem === item;
                  return (
                    <div
                      key={item}
                      style={{
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        marginInline: u["spacing/2x"],
                        paddingLeft: 34,
                        paddingRight: u["spacing/3x"],
                        borderRadius: u["radius/m"],
                        background: isActive ? sideActiveBg : undefined,
                        color: isActive ? sideActiveText : sideText,
                        fontSize: getTypographyToken("font-size/m"),
                        lineHeight: `${getTypographyToken("line-height/m")}px`,
                        fontWeight: isActive
                          ? getTypographyToken("font-weight/medium")
                          : getTypographyToken("font-weight/regular"),
                      }}
                    >
                      {item}
                    </div>
                  );
                })
              : null}
          </div>
        ))}
      </div>
    </aside>
  );
}

export interface DataSourceManagementShellProps {
  children: ReactNode;
  /** 管理页 true；下钻页 false（仅顶导 + 全宽内容区） */
  showSideNav?: boolean;
}

/** 产品壳：顶导 + 可选 220px 侧导 + 白内容区。 */
export function DataSourceManagementShell({
  children,
  showSideNav = true,
}: DataSourceManagementShellProps) {
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
        {showSideNav ? <SideNavPlaceholder /> : null}
        <main
          style={{
            flex: 1,
            minWidth: 0,
            background: getColorToken("white"),
            borderTopRightRadius: u["radius/xl"],
            ...(showSideNav
              ? { boxShadow: buildShadow("D2", "left") }
              : { borderTopLeftRadius: u["radius/xl"] }),
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
