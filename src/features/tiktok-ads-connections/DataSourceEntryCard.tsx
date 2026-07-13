import { useState, type CSSProperties } from "react";
import {
  buildActiveRingShadow,
  buildShadowD3,
  getColorByPath,
  getColorToken,
  tokenRgba,
} from "../../design-system/color-utils";
import { getDividerBorder, getDividerHairlineWidth } from "../../design-system/divider";
import { getTypographyToken } from "../../design-system/typography";
import tokens from "../../design-system/tokens.resolved.json";
import { DataSourceLogo } from "./DataSourceLogo";
import type { DataSourceCardSpec, DataSourceCountUnit } from "./dataSourceTypes";

const u = tokens.unit as Record<string, number>;
const LOGO_SIZE = u["spacing/6x"] * 2;
const STATUS_DOT_SIZE = u["size/mini"] - 2;

function formatCountLabel(count: number, unit: DataSourceCountUnit): string {
  const noun = unit === "applications" ? "应用" : "连接";
  return `${count} 个${noun}`;
}

function BetaTag({ muted }: { muted?: boolean }) {
  return (
    <span
      style={{
        flexShrink: 0,
        height: 20,
        paddingInline: 6,
        borderRadius: u["radius/circular"],
        background: getColorByPath("定制色/标签/山水蓝/背景/01_默认"),
        color: muted
          ? tokenRgba("text-color-transparent-disable", 0.3)
          : tokenRgba("text-color-transparent", 0.9),
        fontSize: getTypographyToken("font-size/s"),
        lineHeight: `${getTypographyToken("line-height/s")}px`,
        fontWeight: getTypographyToken("font-weight/regular"),
      }}
    >
      beta
    </span>
  );
}

function ConnectionStatusRow({ card, muted }: { card: DataSourceCardSpec; muted?: boolean }) {
  const textSecondary = muted
    ? tokenRgba("text-color-transparent-disable", 0.3)
    : tokenRgba("text-sub-color-transparent", 0.58);
  const dotColor = card.connected
    ? muted
      ? tokenRgba("text-color-transparent-disable", 0.3)
      : getColorToken("success-color")
    : tokenRgba("icon-color-transparent", 0.58);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: u["spacing/2x"],
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: u["spacing/1x"],
        }}
      >
        <span
          aria-hidden
          style={{
            width: STATUS_DOT_SIZE,
            height: STATUS_DOT_SIZE,
            borderRadius: "50%",
            background: dotColor,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: getTypographyToken("font-size/s"),
            lineHeight: `${getTypographyToken("line-height/s")}px`,
            color: textSecondary,
          }}
        >
          {card.connected ? "已接入" : "未接入"}
        </span>
      </span>
      {card.connected && card.connectionCount != null ? (
        <span
          style={{
            fontSize: getTypographyToken("font-size/s"),
            lineHeight: `${getTypographyToken("line-height/s")}px`,
            color: textSecondary,
          }}
        >
          {formatCountLabel(card.connectionCount, card.countUnit ?? "connections")}
        </span>
      ) : null}
    </div>
  );
}

export interface DataSourceEntryCardProps {
  card: DataSourceCardSpec;
  onClick?: () => void;
}

/** Figma 入口类卡片：48 logo + 标题 + 圆点状态行；交互遵循 Card Foundation default / hover / pressed。 */
export function DataSourceEntryCard({ card, onClick }: DataSourceEntryCardProps) {
  const isDisabled = Boolean(card.disabled);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const textPrimary = isDisabled
    ? tokenRgba("text-color-transparent-disable", 0.3)
    : tokenRgba("text-color-transparent", 0.9);
  const titleColor =
    !isDisabled && hovered && !pressed ? getColorToken("link-color") : textPrimary;

  const outlineBorder = getDividerBorder("outline", "transparent");
  const lightBorder = getDividerBorder("light", "transparent");

  let border = isDisabled ? lightBorder : outlineBorder;
  let boxShadow: string | undefined;
  let background = isDisabled ? getColorToken("background-grey") : getColorToken("white");

  if (!isDisabled && pressed) {
    border = `${getDividerHairlineWidth()}px solid ${getColorToken("component-active")}`;
    boxShadow = buildActiveRingShadow("component-active-shadow");
  } else if (hovered) {
    boxShadow = buildShadowD3();
  }

  const cardStyle: CSSProperties = {
    width: "100%",
    padding: u["spacing/3x"],
    margin: 0,
    border,
    borderRadius: u["radius/l"],
    background,
    textAlign: "left",
    cursor: isDisabled ? "not-allowed" : "pointer",
    transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s, color 0.2s",
    boxShadow,
    boxSizing: "border-box",
    font: "inherit",
    color: "inherit",
    appearance: "none",
    WebkitAppearance: "none",
  };

  const body = (
    <div style={{ display: "flex", alignItems: "center", gap: u["spacing/3x"] }}>
      <DataSourceLogo
        sourceId={card.id}
        logoAssetId={card.logoAssetId}
        text={card.logoText}
        size={LOGO_SIZE}
      />
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: u["spacing/1x"],
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: u["spacing/1x"],
            minWidth: 0,
          }}
        >
          <span
            style={{
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              color: titleColor,
              fontSize: getTypographyToken("font-size/m"),
              lineHeight: `${getTypographyToken("line-height/m")}px`,
              fontWeight: getTypographyToken("font-weight/medium"),
              transition: "color 0.2s",
            }}
          >
            {card.name}
          </span>
          {card.beta ? <BetaTag muted={isDisabled} /> : null}
        </div>
        <ConnectionStatusRow card={card} muted={isDisabled} />
      </div>
    </div>
  );

  return (
    <button
      type="button"
      aria-label={card.name}
      disabled={isDisabled}
      onClick={onClick}
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => {
        if (!isDisabled) setPressed(true);
      }}
      onMouseUp={() => setPressed(false)}
    >
      {body}
    </button>
  );
}
