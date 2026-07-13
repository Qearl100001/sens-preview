import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Alert, Space, Table, Tabs, Tag, Typography, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  getColorByPath,
  getColorToken,
  tokenRgba,
} from "../../../design-system/color-utils";
import { getDividerColor, getDividerHairlineWidth } from "../../../design-system/divider";
import tokens from "../../../design-system/tokens.resolved.json";
import { SensIcon } from "../../../design-system/icons";
import { getTypographyToken } from "../../../design-system/typography";
import cardDocSource from "../../../../docs/foundations/card.md?raw";
import { BasicStylePageLayout } from "./BasicStylePageLayout";

const { Paragraph, Text, Title } = Typography;

const unit = tokens.unit as Record<string, number>;
const shadowTokens = tokens.shadow as Record<string, string>;

const cardTokens = {
  padding: unit["spacing/4x"],
  interactivePadding: unit["spacing/3x"],
  gap: unit["spacing/3x"],
  compactGap: unit["spacing/1x"],
  actionGap: unit["spacing/4x"],
  radius: unit["radius/l"],
  checkboxRadius: unit["radius/s"],
  innerRadius: unit["radius/m"],
  iconSize: unit["size/icon/m"],
  mediaSize: unit["size/xxl"] + unit["spacing/1x"],
  tagHeight: unit["size/component-height/xs"],
  placeholderMinHeight: unit["size/component-height/xxxl"] * 2,
  titleFontSize: getTypographyToken("font-size/m"),
  titleLineHeight: getTypographyToken("line-height/m"),
  titleFontWeight: getTypographyToken("font-weight/medium"),
  bodyFontSize: getTypographyToken("font-size/m"),
  bodyLineHeight: getTypographyToken("line-height/m"),
  bodyFontWeight: getTypographyToken("font-weight/regular"),
  captionFontSize: getTypographyToken("font-size/s"),
  captionLineHeight: getTypographyToken("line-height/s"),
} as const;

const colorTokens = {
  cardBg: getColorToken("white"),
  outline: getDividerColor("outline", "transparent"),
  activeBorder: getColorToken("component-active"),
  selectedBg: getColorToken("component-active-background"),
  disabledBg: getColorToken("background-grey"),
  disabledText: tokenRgba("text-color-transparent-disable", 0.3),
  warning: getColorToken("warning-color"),
  warningBg: getColorToken("warning-light-background"),
  filledBg: tokenRgba("background-transparent-grey", 0.04),
  tagBg: tokenRgba("background-01-transparent", 0.08),
  placeholder: getColorByPath("基础色板/兰花紫/02"),
  text: tokenRgba("text-color-transparent", 0.9),
  subText: tokenRgba("text-sub-color-transparent", 0.58),
  link: getColorToken("link-color"),
  divider: getDividerColor("light", "transparent"),
} as const;

type CardInteractionState = "default" | "hover" | "pressed";
type CardStatusState = "disabled" | "disabledHover" | "error";

const cardInteractionTokens = {
  defaultBorder: getDividerColor("outline", "transparent"),
  divider: getDividerColor("light", "transparent"),
  disabledBorder: getDividerColor("light", "transparent"),
  hoverShadow: shadowTokens["D3/down"],
  pressedShadow: shadowTokens["active-ring/functional"],
} as const;

const CARD_STATUS_SPECS: Array<{
  key: CardStatusState;
  label: string;
  description: string;
  tokens: string[];
}> = [
  {
    key: "disabled",
    label: "禁用",
    description: "灰背景、浅分割线描边，操作文字禁用。",
    tokens: ["background-grey", "divider/color/light/transparent", "text-color-transparent-disable"],
  },
  {
    key: "disabledHover",
    label: "禁用悬停",
    description: "禁用背景不变，悬停仍可出现 D3 投影。",
    tokens: ["background-grey", "shadow/D3/down", "text-color-transparent-disable"],
  },
  {
    key: "error",
    label: "报错",
    description: "警告浅色背景、警告描边，并带框外警告文案。",
    tokens: ["warning-light-background", "warning-color", "Typography 辅助文案"],
  },
];

interface CardSurfaceSpec {
  key: string;
  title: string;
  description: string;
  background: string;
  border: string;
  labels: string[];
}

const CARD_SURFACES: CardSurfaceSpec[] = [
  {
    key: "outline",
    title: "自由容器卡片 · 描边",
    description: "白底 + 浅描边，适合普通内容容器、信息面板和业务区块。",
    background: colorTokens.cardBg,
    border: `1px solid ${colorTokens.outline}`,
    labels: ["spacing/4x", "radius/l", "outline-color-transparent @12%"],
  },
  {
    key: "filled",
    title: "自由容器卡片 · 色块",
    description: "弱层级灰底，无描边，适合轻量承载区。",
    background: colorTokens.filledBg,
    border: "1px solid transparent",
    labels: ["spacing/4x", "radius/l", "background-transparent-grey @4%"],
  },
];

const DESIGN_RULES = [
  "Card 是基础容器，不限制固定宽高；宽度由布局决定，高度由内容撑开。",
  "本轮正式收敛描边卡片和色块卡片两种基础样式类型。",
  "自由卡片和网格视图卡片共用 default / hover / pressed 交互规则。",
  "禁用、禁用悬停、报错状态适用于所有 Card 类型。",
  "selected / 激活只属于带 checkbox 的选择型卡片，普通 Card 不定义 selected。",
  "自由容器只规定外层容器，不定义内部业务结构。",
  "紫色块只作为内容占位，帮助验收 padding 和承载区域，不属于 Card 容器规则。",
  "标题区是组合示例，不代表 Card 必须内置标题区。",
];

const MAPPING_ROWS = [
  {
    key: "padding",
    usage: "Card padding",
    source: "Spacing Foundation",
    token: "spacing/4x",
    value: "16",
    code: 'unit["spacing/4x"]',
    status: "已映射",
  },
  {
    key: "radius",
    usage: "Card 圆角",
    source: "Radius Foundation",
    token: "radius/l",
    value: "6",
    code: 'unit["radius/l"]',
    status: "已映射",
  },
  {
    key: "outline",
    usage: "描边",
    source: "Divider Foundation · outline",
    token: "divider/color/outline/transparent",
    value: getDividerColor("outline", "transparent"),
    code: 'getDividerColor("outline", "transparent")',
    status: "已映射",
  },
  {
    key: "filled-bg",
    usage: "色块背景",
    source: "中性色/背景/03_灰背景 @background-transparent-grey",
    token: "background-transparent-grey @4%",
    value: "rgba(0,34,102,0.04)",
    code: 'tokenRgba("background-transparent-grey", 0.04)',
    status: "已映射",
  },
  {
    key: "placeholder",
    usage: "内容占位",
    source: "基础色板/兰花紫/02",
    token: "基础色板/兰花紫/02",
    value: "#E7E0FF",
    code: 'getColorByPath("基础色板/兰花紫/02")',
    status: "仅样张",
  },
  {
    key: "title",
    usage: "标题",
    source: "Typography 四级标题",
    token: "font-size/m + line-height/m + font-weight/medium",
    value: "14 / 22 / 500",
    code: "getTypographyToken(...)",
    status: "已入库并由 helper 承接",
  },
  {
    key: "action",
    usage: "操作文案",
    source: "Typography 正文内容",
    token: "font-size/m + line-height/m + font-weight/regular",
    value: "14 / 22 / 400",
    code: "getTypographyToken(...)",
    status: "已入库并由 helper 承接",
  },
  {
    key: "divider",
    usage: "分割线",
    source: "Divider Foundation · light",
    token: "divider/color/light/transparent",
    value: getDividerColor("light", "transparent"),
    code: 'getDividerColor("light", "transparent")',
    status: "已映射",
  },
  {
    key: "hover-shadow",
    usage: "悬停投影",
    source: "Shadow Foundation",
    token: "shadow/D3/down",
    value: "D3↓",
    code: 'tokens.shadow["D3/down"]',
    status: "已映射",
  },
  {
    key: "pressed-ring",
    usage: "点击外环",
    source: "Shadow Foundation",
    token: "shadow/active-ring/functional",
    value: "2px functional ring",
    code: 'tokens.shadow["active-ring/functional"]',
    status: "已映射",
  },
  {
    key: "selected-bg",
    usage: "选择型卡片激活背景",
    source: "功能色/06_选中背景默认",
    token: "component-active-background",
    value: "#EBF7F4",
    code: 'getColorToken("component-active-background")',
    status: "已映射，仅 checkbox 场景",
  },
  {
    key: "disabled-bg",
    usage: "禁用背景",
    source: "中性色（非透明度）/背景/03_灰背景",
    token: "background-grey",
    value: "#F5F6F9",
    code: 'getColorToken("background-grey")',
    status: "已映射",
  },
  {
    key: "disabled-text",
    usage: "禁用操作文案",
    source: "中性色/文字/04_禁用",
    token: "text-color-transparent-disable @30%",
    value: "rgba(0,13,38,0.3)",
    code: 'tokenRgba("text-color-transparent-disable", 0.3)',
    status: "已映射",
  },
  {
    key: "error-bg",
    usage: "报错背景",
    source: "状态色/警告/05_浅色背景",
    token: "warning-light-background",
    value: "#FCEBEB",
    code: 'getColorToken("warning-light-background")',
    status: "已映射",
  },
  {
    key: "error-border",
    usage: "报错描边 / 文案",
    source: "状态色/警告/01_默认",
    token: "warning-color",
    value: "#E54545",
    code: 'getColorToken("warning-color")',
    status: "已映射",
  },
  {
    key: "icon",
    usage: "标题区图标",
    source: "Size Foundation",
    token: "size/icon/m",
    value: "16",
    code: 'unit["size/icon/m"]',
    status: "尺寸已映射，图标资产待补",
  },
  {
    key: "tag",
    usage: "Tag 高度",
    source: "Size Foundation",
    token: "size/component-height/xs",
    value: "20",
    code: 'unit["size/component-height/xs"]',
    status: "已映射",
  },
];

function TokenLabels({ labels }: { labels: string[] }) {
  return (
    <Space size={[cardTokens.compactGap, cardTokens.compactGap]} wrap>
      {labels.map((label) => (
        <Tag key={label}>{label}</Tag>
      ))}
    </Space>
  );
}

function PlaceholderBlock({ compact = false }: { compact?: boolean }) {
  return (
    <div
      style={{
        minHeight: compact ? unit["size/component-height/xxl"] * 2 : cardTokens.placeholderMinHeight,
        borderRadius: cardTokens.innerRadius,
        background: colorTokens.placeholder,
      }}
    />
  );
}

function getInteractiveCardStyle(state: CardInteractionState, selected = false): CSSProperties {
  return {
    padding: cardTokens.interactivePadding,
    borderRadius: cardTokens.radius,
    border: `1px solid ${state === "pressed" || selected ? colorTokens.activeBorder : cardInteractionTokens.defaultBorder}`,
    background: selected ? colorTokens.selectedBg : colorTokens.cardBg,
    boxShadow: selected ? "none" : state === "hover" ? cardInteractionTokens.hoverShadow : state === "pressed" ? cardInteractionTokens.pressedShadow : "none",
    transition: "border-color 0.16s ease, box-shadow 0.16s ease, background-color 0.16s ease",
    cursor: "pointer",
  };
}

function getStatusCardStyle(state: CardStatusState): CSSProperties {
  if (state === "error") {
    return {
      padding: cardTokens.interactivePadding,
      borderRadius: cardTokens.radius,
      border: `1px solid ${colorTokens.warning}`,
      background: colorTokens.warningBg,
      boxShadow: "none",
      cursor: "default",
    };
  }

  return {
    padding: cardTokens.interactivePadding,
    borderRadius: cardTokens.radius,
    border: `1px solid ${cardInteractionTokens.disabledBorder}`,
    background: colorTokens.disabledBg,
    boxShadow: state === "disabledHover" ? cardInteractionTokens.hoverShadow : "none",
    cursor: "not-allowed",
  };
}

function useCardInteractionState() {
  const [state, setState] = useState<CardInteractionState>("default");

  return {
    state,
    eventHandlers: {
      onMouseEnter: () => setState((current) => (current === "pressed" ? current : "hover")),
      onMouseLeave: () => setState("default"),
      onMouseDown: () => setState("pressed"),
      onMouseUp: () => setState("hover"),
    },
  };
}

function CardTag() {
  return (
    <span
      style={{
        height: cardTokens.tagHeight,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        paddingInline: cardTokens.gap / 2,
        borderRadius: cardTokens.checkboxRadius,
        background: colorTokens.tagBg,
        color: colorTokens.text,
        fontSize: cardTokens.captionFontSize,
        lineHeight: `${cardTokens.captionLineHeight}px`,
        fontWeight: cardTokens.bodyFontWeight,
      }}
    >
      标签
    </span>
  );
}

function CardActionText({ children, active = false, disabled = false }: { children: string; active?: boolean; disabled?: boolean }) {
  return (
    <span
      style={{
        color: disabled ? colorTokens.disabledText : active ? colorTokens.link : colorTokens.text,
        fontSize: cardTokens.bodyFontSize,
        lineHeight: `${cardTokens.bodyLineHeight}px`,
        fontWeight: cardTokens.bodyFontWeight,
        display: "inline-flex",
        alignItems: "center",
        height: cardTokens.bodyLineHeight,
      }}
    >
      {children}
    </span>
  );
}

function InteractiveCardHeader({
  withMedia,
  withCheckbox = false,
  checked = false,
  iconColor = colorTokens.subText,
}: {
  withMedia: boolean;
  withCheckbox?: boolean;
  checked?: boolean;
  iconColor?: string;
}) {
  return (
    <div style={{ display: "flex", gap: cardTokens.gap, alignItems: "center", width: "100%" }}>
      {withMedia ? (
        <div
          aria-hidden
          style={{
            width: cardTokens.mediaSize,
            height: cardTokens.mediaSize,
            borderRadius: cardTokens.innerRadius,
            background: colorTokens.placeholder,
            flex: "0 0 auto",
          }}
        />
      ) : null}
      <div style={{ minWidth: 0, flex: 1, display: "flex", flexDirection: "column", gap: cardTokens.compactGap }}>
        <div style={{ display: "flex", alignItems: "center", gap: cardTokens.compactGap, minWidth: 0 }}>
          {withCheckbox ? (
            <span
              aria-hidden
              style={{
                width: cardTokens.iconSize,
                height: cardTokens.iconSize,
                borderRadius: cardTokens.checkboxRadius,
                border: `1px solid ${checked ? colorTokens.activeBorder : getDividerColor("deep", "transparent")}`,
                background: checked ? colorTokens.activeBorder : colorTokens.cardBg,
                color: colorTokens.cardBg,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: cardTokens.captionFontSize,
                lineHeight: `${cardTokens.captionLineHeight}px`,
                flex: "0 0 auto",
              }}
            >
              {checked ? (
                <SensIcon name="check" sizeToken="size/icon/m" color={colorTokens.cardBg} />
              ) : null}
            </span>
          ) : null}
          <Text
            ellipsis
            style={{
              minWidth: 0,
              flex: 1,
              color: colorTokens.text,
              fontSize: cardTokens.titleFontSize,
              lineHeight: `${cardTokens.titleLineHeight}px`,
              fontWeight: cardTokens.titleFontWeight,
            }}
          >
            卡片标题
          </Text>
          <SensIcon name="more" sizeToken="size/icon/m" color={iconColor} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: cardTokens.compactGap, minWidth: 0 }}>
          <CardTag />
          <Text
            ellipsis
            style={{
              minWidth: 0,
              flex: 1,
              color: colorTokens.subText,
              fontSize: cardTokens.captionFontSize,
              lineHeight: `${cardTokens.captionLineHeight}px`,
              fontWeight: cardTokens.bodyFontWeight,
            }}
          >
            辅助说明性文字
          </Text>
        </div>
      </div>
    </div>
  );
}

function InteractiveCardActions({ active, disabled = false }: { active: boolean; disabled?: boolean }) {
  return (
    <div style={{ display: "flex", gap: cardTokens.actionGap, alignItems: "center", minHeight: cardTokens.bodyLineHeight }}>
      <CardActionText active={active} disabled={disabled}>操作 1</CardActionText>
      <CardActionText active={active} disabled={disabled}>操作 2</CardActionText>
      <span style={{ display: "inline-flex", gap: cardTokens.compactGap, alignItems: "center" }}>
        <CardActionText active={active} disabled={disabled}>更多</CardActionText>
        <SensIcon
          name="chevron-down"
          sizeToken="size/icon/m"
          color={disabled ? colorTokens.disabledText : active ? colorTokens.link : colorTokens.subText}
        />
      </span>
    </div>
  );
}

function ErrorMessage() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: cardTokens.compactGap }}>
      <SensIcon name="warning-filled" sizeToken="size/icon/s" colorRole="warning" />
      <Text
        style={{
          color: colorTokens.warning,
          fontSize: cardTokens.captionFontSize,
          lineHeight: `${cardTokens.captionLineHeight}px`,
          fontWeight: cardTokens.bodyFontWeight,
        }}
      >
        警告文案
      </Text>
    </div>
  );
}

function StatusSampleShell({
  state,
  demo,
  children,
}: {
  state: CardStatusState;
  demo: string;
  children: ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: cardTokens.compactGap }}>
      <div data-card-demo={demo} data-card-state={state} style={getStatusCardStyle(state)}>
        {children}
      </div>
      {state === "error" ? <ErrorMessage /> : null}
    </div>
  );
}

function FreeStatusCardSample({ state }: { state: CardStatusState }) {
  const disabled = state === "disabled" || state === "disabledHover";

  return (
    <StatusSampleShell state={state} demo={`free-${state}`}>
      <div style={{ display: "flex", flexDirection: "column", gap: cardTokens.gap, minHeight: 170 }}>
        <PlaceholderBlock compact />
        <Text
          style={{
            color: disabled ? colorTokens.disabledText : colorTokens.text,
            fontSize: cardTokens.bodyFontSize,
            lineHeight: `${cardTokens.bodyLineHeight}px`,
            fontWeight: cardTokens.bodyFontWeight,
          }}
        >
          自由内容区域
        </Text>
      </div>
    </StatusSampleShell>
  );
}

function GridStatusCardSample({ state }: { state: CardStatusState }) {
  const disabled = state === "disabled" || state === "disabledHover";

  return (
    <StatusSampleShell state={state} demo={`grid-${state}`}>
      <div
        style={{
          minHeight: unit["size/m"] * 9 + cardTokens.gap + 2,
          display: "flex",
          flexDirection: "column",
          gap: cardTokens.gap,
          overflow: "hidden",
        }}
      >
        <InteractiveCardHeader withMedia iconColor={disabled ? colorTokens.disabledText : colorTokens.subText} />
        <PlaceholderBlock />
        <div style={{ marginInline: -cardTokens.interactivePadding, borderTop: `1px solid ${cardInteractionTokens.divider}` }} />
        <InteractiveCardActions active={false} disabled={disabled} />
      </div>
    </StatusSampleShell>
  );
}

function CardStatusGroup({ title, description, kind }: { title: string; description: string; kind: "free" | "grid" }) {
  return (
    <Space direction="vertical" size="small" style={{ width: "100%" }}>
      <div>
        <Text strong>{title}</Text>
        <Paragraph style={{ marginTop: cardTokens.compactGap, marginBottom: 0, color: colorTokens.subText }}>
          {description}
        </Paragraph>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(180px, 1fr))", gap: cardTokens.gap }}>
        {CARD_STATUS_SPECS.map((spec) => (
          <Space key={spec.key} direction="vertical" size="small" style={{ width: "100%" }}>
            <div>
              <Text>{spec.label}</Text>
              <Paragraph style={{ marginTop: cardTokens.compactGap, marginBottom: 0, color: colorTokens.subText }}>
                {spec.description}
              </Paragraph>
            </div>
            {kind === "free" ? <FreeStatusCardSample state={spec.key} /> : <GridStatusCardSample state={spec.key} />}
            <TokenLabels labels={spec.tokens} />
          </Space>
        ))}
      </div>
    </Space>
  );
}

function FreeInteractiveCardExample() {
  const { state, eventHandlers } = useCardInteractionState();

  return (
    <Space direction="vertical" size="small" style={{ width: "100%" }}>
      <div>
        <Text strong>自由卡片 / 交互状态</Text>
        <Paragraph style={{ marginTop: cardTokens.compactGap, marginBottom: 0, color: colorTokens.subText }}>
          自由卡片与网格视图卡片共用 default / hover / pressed 状态，不带分割线。
        </Paragraph>
      </div>
      <div
        {...eventHandlers}
        data-card-demo="free"
        data-card-state={state}
        style={{
          ...getInteractiveCardStyle(state),
          minHeight: cardTokens.placeholderMinHeight + cardTokens.bodyLineHeight + cardTokens.gap * 3,
          display: "flex",
          flexDirection: "column",
          gap: cardTokens.gap,
        }}
      >
        <PlaceholderBlock compact />
        <Text
          style={{
            color: colorTokens.text,
            fontSize: cardTokens.bodyFontSize,
            lineHeight: `${cardTokens.bodyLineHeight}px`,
            fontWeight: cardTokens.bodyFontWeight,
          }}
        >
          自由内容区域
        </Text>
      </div>
      <TokenLabels labels={["default / hover / pressed", "radius/l", "spacing/3x", "shadow/D3/down"]} />
    </Space>
  );
}

function GridInteractiveCardExample() {
  const { state, eventHandlers } = useCardInteractionState();
  const actionActive = state === "hover";

  return (
    <Space direction="vertical" size="small" style={{ width: "100%" }}>
      <div>
        <Text strong>网格视图卡片 / 交互状态</Text>
        <Paragraph style={{ marginTop: cardTokens.compactGap, marginBottom: 0, color: colorTokens.subText }}>
          带标题区、内容区、操作区和分割线；交互状态与自由卡片共用。
        </Paragraph>
      </div>
      <div
        {...eventHandlers}
        data-card-demo="grid"
        data-card-state={state}
        style={{
          ...getInteractiveCardStyle(state),
          width: "100%",
          maxWidth: unit["size/m"] * 10 + unit["spacing/1x"],
          minHeight: unit["size/m"] * 9 + cardTokens.gap + 2,
          display: "flex",
          flexDirection: "column",
          gap: cardTokens.gap,
          overflow: "hidden",
        }}
      >
        <InteractiveCardHeader withMedia />
        <PlaceholderBlock />
        <div style={{ marginInline: -cardTokens.interactivePadding, borderTop: `1px solid ${cardInteractionTokens.divider}` }} />
        <InteractiveCardActions active={actionActive} />
      </div>
      <TokenLabels labels={["divider/color/light/transparent", "Typography 正文内容", "link-color on hover"]} />
    </Space>
  );
}

function SelectableCardExample() {
  const [selected, setSelected] = useState(false);

  return (
    <Space direction="vertical" size="small" style={{ width: "100%" }}>
      <div>
        <Text strong>选择型卡片 / 激活状态</Text>
        <Paragraph style={{ marginTop: cardTokens.compactGap, marginBottom: 0, color: colorTokens.subText }}>
          激活只属于带 checkbox 的选择型卡片：浅绿背景 + active 描边 + 无投影。
        </Paragraph>
      </div>
      <div
        role="checkbox"
        aria-checked={selected}
        tabIndex={0}
        data-card-demo="selectable"
        data-card-state={selected ? "checked" : "unchecked"}
        onClick={() => setSelected((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setSelected((value) => !value);
          }
        }}
        style={{
          ...getInteractiveCardStyle("default", selected),
          minHeight: cardTokens.placeholderMinHeight + cardTokens.tagHeight + cardTokens.bodyLineHeight + cardTokens.gap * 6,
          display: "flex",
          flexDirection: "column",
          gap: cardTokens.gap,
          overflow: "hidden",
        }}
      >
        <InteractiveCardHeader withMedia={false} withCheckbox checked={selected} />
        <PlaceholderBlock />
        <div style={{ marginInline: -cardTokens.interactivePadding, borderTop: `1px solid ${cardInteractionTokens.divider}` }} />
        <InteractiveCardActions active={false} />
      </div>
      <TokenLabels labels={["component-active-background", "component-active", "no shadow", "checkbox only"]} />
    </Space>
  );
}

function FreeContainerCard({ spec }: { spec: CardSurfaceSpec }) {
  return (
    <Space direction="vertical" size="small" style={{ width: "100%" }}>
      <div>
        <Text strong>{spec.title}</Text>
        <Paragraph style={{ marginTop: cardTokens.compactGap, marginBottom: 0, color: colorTokens.subText }}>
          {spec.description}
        </Paragraph>
      </div>
      <div
        style={{
          padding: cardTokens.padding,
          borderRadius: cardTokens.radius,
          border: spec.border,
          background: spec.background,
        }}
      >
        <PlaceholderBlock />
      </div>
      <TokenLabels labels={spec.labels} />
    </Space>
  );
}

function TitledCardExample() {
  return (
    <Space direction="vertical" size="small" style={{ width: "100%" }}>
      <div>
        <Text strong>带标题区组合示例</Text>
        <Paragraph style={{ marginTop: cardTokens.compactGap, marginBottom: 0, color: colorTokens.subText }}>
          标题区来自 Figma `1335:26939` / `1335:26937`，用于说明 Card 可承载标题区和内容区。
        </Paragraph>
      </div>

      <div
        style={{
          borderRadius: cardTokens.radius,
          border: `1px solid ${colorTokens.outline}`,
          background: colorTokens.cardBg,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            minHeight: unit["size/component-height/l"],
            padding: `0 ${cardTokens.padding}px`,
            display: "flex",
            alignItems: "center",
            gap: cardTokens.compactGap,
          }}
        >
          <SensIcon name="drag-vertical" sizeToken="size/icon/m" colorRole="subtle" />
          <SensIcon name="chevron-down" sizeToken="size/icon/m" colorRole="subtle" />
          <Text
            style={{
              flex: 1,
              minWidth: 0,
              color: colorTokens.text,
              fontSize: cardTokens.titleFontSize,
              lineHeight: `${cardTokens.titleLineHeight}px`,
              fontWeight: cardTokens.titleFontWeight,
            }}
            ellipsis
          >
            标题区
          </Text>
          <SensIcon name="rename" sizeToken="size/icon/m" colorRole="subtle" />
          <Text
            style={{
              color: colorTokens.link,
              fontSize: cardTokens.bodyFontSize,
              lineHeight: `${cardTokens.bodyLineHeight}px`,
              fontWeight: cardTokens.bodyFontWeight,
            }}
          >
            操作
          </Text>
        </div>
        <div style={{ height: getDividerHairlineWidth(), background: cardInteractionTokens.divider }} />
        <div style={{ padding: cardTokens.padding }}>
          <PlaceholderBlock compact />
        </div>
      </div>
      <TokenLabels labels={["Typography 四级标题", "Typography 正文内容", "size/icon/m", "仅组合示例"]} />
    </Space>
  );
}

function CardShowcase() {
  const { token } = theme.useToken();

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <section>
        <Title level={5} style={{ marginTop: 0 }}>
          自由容器卡片
        </Title>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(260px, 1fr))", gap: token.marginLG }}>
          {CARD_SURFACES.map((spec) => (
            <FreeContainerCard key={spec.key} spec={spec} />
          ))}
        </div>
      </section>

      <section>
        <Title level={5}>组合示例</Title>
        <TitledCardExample />
      </section>

      <section>
        <Title level={5}>交互状态</Title>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(280px, 1fr))", gap: token.marginLG }}>
          <FreeInteractiveCardExample />
          <GridInteractiveCardExample />
          <SelectableCardExample />
        </div>
      </section>

      <section>
        <Title level={5}>异常与不可用状态</Title>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <CardStatusGroup
            title="自由卡片 / 异常与不可用状态"
            description="禁用、禁用悬停和报错状态同样作用在自由容器卡片上。"
            kind="free"
          />
          <CardStatusGroup
            title="网格视图卡片 / 异常与不可用状态"
            description="网格视图卡片沿用同一套状态规则，区别在于内部有标题区、分割线和操作区。"
            kind="grid"
          />
        </Space>
      </section>
    </Space>
  );
}

function DesignRulesPanel() {
  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Alert
        type="info"
        showIcon
        message="Card 本轮边界"
        description="本轮只收敛自由容器卡片和一个标题区组合示例，不进入 EntryCard / DataSourceCard / 复杂拖拽场景。"
      />
      <ul style={{ margin: 0, paddingInlineStart: 20 }}>
        {DESIGN_RULES.map((rule) => (
          <li key={rule} style={{ marginBottom: cardTokens.compactGap }}>
            {rule}
          </li>
        ))}
      </ul>
      <Alert
        type="warning"
        showIcon
        message="状态边界"
        description="selected / 激活只属于带 checkbox 的选择型卡片，普通自由卡片和网格视图卡片只定义 default / hover / pressed。"
      />
    </Space>
  );
}

function MappingPanel() {
  const columns: ColumnsType<(typeof MAPPING_ROWS)[number]> = [
    { title: "使用点", dataIndex: "usage", key: "usage", width: 96 },
    { title: "设计语义 / Figma 变量", dataIndex: "source", key: "source", width: 210 },
    { title: "Token 组合 / Handle", dataIndex: "token", key: "token", width: 240 },
    { title: "数值", dataIndex: "value", key: "value", width: 130 },
    { title: "代码落地", dataIndex: "code", key: "code", width: 240 },
    { title: "状态", dataIndex: "status", key: "status", width: 150 },
  ];

  return (
    <Table
      columns={columns}
      dataSource={MAPPING_ROWS}
      pagination={false}
      rowKey="key"
      size="small"
      scroll={{ x: 1066 }}
    />
  );
}

function CardRulePanel() {
  return (
    <Tabs
      size="small"
      defaultActiveKey="rules"
      items={[
        { key: "rules", label: "设计规则", children: <DesignRulesPanel /> },
        { key: "mapping", label: "数值与 Token 映射", children: <MappingPanel /> },
      ]}
    />
  );
}

function CardSpecimen() {
  const { token } = theme.useToken();

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(420px, 0.8fr)", gap: token.marginLG }}>
      <CardShowcase />
      <div
        style={{
          minWidth: 0,
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadius,
          padding: token.paddingMD,
          background: token.colorBgContainer,
          alignSelf: "start",
        }}
      >
        <CardRulePanel />
      </div>
    </div>
  );
}

export default function CardBasicStylePage() {
  return (
    <BasicStylePageLayout
      title="卡片"
      description="展示 Card 自由容器基础样式、标题区组合示例，以及设计规则和 token 映射。"
      designDocSource={cardDocSource}
      specimen={<CardSpecimen />}
    />
  );
}
