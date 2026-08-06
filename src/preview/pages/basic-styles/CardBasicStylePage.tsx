import { useState } from "react";
import type { ReactNode } from "react";
import { Alert, Space, Table, Tabs, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  buildShadowD3,
  getColorByPath,
  getColorToken,
  tokenRgba,
} from "../../../design-system/color-utils";
import { getDividerColor, getDividerHairlineWidth } from "../../../design-system/divider";
import tokens from "../../../design-system/tokens.resolved.json";
import { SensIcon, type ColorfulIconName } from "../../../design-system/icons";
import { getTypographyToken } from "../../../design-system/typography";
import cardDocSource from "../../../../docs/foundations/card.md?raw";
import { BasicStylePageLayout } from "./BasicStylePageLayout";
import { getPreviewTokens } from "../../previewTokens";
import { buildFunctionalActiveRingShadow, functionalCssVar } from "../../../design-system/functional-skin";
import {
  SensButton,
  SensButtonActionMenu,
  SensCard,
  SensCheckbox,
  SensEntryCard,
  SensTag,
} from "../../../ui";
import type { SensDropdownMenuItemConfig } from "../../../ui";

const { Paragraph, Text, Title } = Typography;

const unit = tokens.unit as Record<string, number>;

const cardTokens = {
  padding: unit["spacing/4x"],
  interactivePadding: unit["spacing/3x"],
  gap: unit["spacing/3x"],
  compactGap: unit["spacing/1x"],
  actionGap: unit["spacing/4x"],
  actionBarHeight: 40,
  actionBarPadding: 9,
  radius: unit["radius/l"],
  innerRadius: unit["radius/m"],
  iconSize: unit["size/icon/m"],
  mediaSize: unit["size/xxl"] + unit["spacing/1x"],
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
  activeBorder: functionalCssVar("--sens-skin-active", "component-active"),
  selectedBg: functionalCssVar("--sens-skin-active-bg", "component-active-background"),
  disabledBg: getColorToken("background-grey"),
  disabledText: tokenRgba("text-color-transparent-disable", 0.3),
  warning: getColorToken("warning-color"),
  warningBg: getColorToken("warning-light-background"),
  filledBg: tokenRgba("background-transparent-grey", 0.04),
  placeholder: getColorByPath("基础色板/兰花紫/02"),
  text: tokenRgba("text-color-transparent", 0.9),
  subText: tokenRgba("text-sub-color-transparent", 0.58),
  link: getColorToken("link-color"),
  divider: getDividerColor("light", "transparent"),
} as const;

type CardInteractionState = "default" | "hover" | "pressed";
type CardStatusState = "disabled" | "disabledHover" | "error";

const cardInteractionTokens = {
  divider: getDividerColor("light", "transparent"),
} as const;

const CARD_OPERATION_MENU_ITEMS: SensDropdownMenuItemConfig[] = [
  { key: "operation-3", label: "操作 3", variant: "link" },
  { key: "operation-4", label: "操作 4", variant: "link" },
  { key: "operation-5", label: "操作 5", variant: "link" },
];

const cardActionButtonStyle = {
  height: cardTokens.bodyLineHeight,
  minHeight: cardTokens.bodyLineHeight,
  paddingInline: 0,
  paddingBlock: 0,
  fontSize: cardTokens.bodyFontSize,
  fontWeight: cardTokens.bodyFontWeight,
  lineHeight: `${cardTokens.bodyLineHeight}px`,
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

const GENERIC_CARD_PLACEHOLDER_HEIGHT = 168;

const ENTRY_CARD_STATES = [
  { key: "default", label: "默认" },
  { key: "hover", label: "悬停" },
  { key: "pressed", label: "点击" },
  { key: "selected", label: "选中" },
  { key: "selectedHover", label: "选中悬停" },
  { key: "disabled", label: "禁用" },
  { key: "disabledHover", label: "禁用悬停" },
] as const;

type EntryCardState = (typeof ENTRY_CARD_STATES)[number]["key"];

const ENTRY_CARD_ICONS: ColorfulIconName[] = ["webhook-setting", "section-settings", "view-api", "api-key-manage"];

const GENERIC_CARD_STATES = [
  { key: "default", label: "默认" },
  { key: "hover", label: "悬停" },
  { key: "pressed", label: "点击" },
  { key: "selected", label: "选中" },
  { key: "selectedHover", label: "选中悬停" },
  { key: "disabled", label: "禁用" },
  { key: "disabledHover", label: "禁用悬停" },
] as const;

type GenericCardState = (typeof GENERIC_CARD_STATES)[number]["key"];

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
  "入口型卡片是建立在 SensCard 之上的业务组合：图标、标题和辅助信息必选，整卡具备导航属性。",
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
    code: 'functionalCssVar("--sens-skin-active-bg", "component-active-background")',
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

function PlaceholderBlock({ compact = false, fill = false, height }: { compact?: boolean; fill?: boolean; height?: number }) {
  return (
    <div
      style={{
        minHeight: height ?? (compact ? unit["size/component-height/xxl"] * 2 : cardTokens.placeholderMinHeight),
        height: fill ? "100%" : undefined,
        borderRadius: cardTokens.innerRadius,
        background: colorTokens.placeholder,
      }}
    />
  );
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
    <SensTag variant="multicolor" color="neutral" size="small">
      标签
    </SensTag>
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
  withMoreMenu = false,
  disabled = false,
  moreMenuOpen = false,
  onMoreMenuOpenChange,
}: {
  withMedia: boolean;
  withCheckbox?: boolean;
  checked?: boolean;
  iconColor?: string;
  withMoreMenu?: boolean;
  disabled?: boolean;
  moreMenuOpen?: boolean;
  onMoreMenuOpenChange?: (open: boolean) => void;
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
            <span aria-hidden="true" style={{ display: "inline-flex", flex: "0 0 auto", pointerEvents: "none" }}>
              <SensCheckbox checked={checked} readOnly tabIndex={-1} style={{ pointerEvents: "none" }} />
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
          {withMoreMenu ? (
            <SensButtonActionMenu
              tone={moreMenuOpen ? "link" : "linkWeak"}
              items={CARD_OPERATION_MENU_ITEMS}
              disabled={disabled}
              trigger={["click"]}
              dropdownProps={{
                open: moreMenuOpen,
                placement: "bottomRight",
                onOpenChange: onMoreMenuOpenChange,
              }}
            >
              <SensButton
                tone={moreMenuOpen ? "link" : "linkWeak"}
                disabled={disabled}
                aria-label="更多操作"
                aria-haspopup="menu"
                onClick={(event) => event.stopPropagation()}
                icon={<SensIcon name="more" sizeToken="size/icon/m" color="currentColor" />}
                style={{
                  width: cardTokens.iconSize + cardTokens.compactGap * 2,
                  height: cardTokens.iconSize + cardTokens.compactGap * 2,
                  minHeight: cardTokens.iconSize + cardTokens.compactGap * 2,
                  padding: 0,
                }}
              />
            </SensButtonActionMenu>
          ) : (
            <SensIcon name="more" sizeToken="size/icon/m" color={iconColor} />
          )}
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

function InteractiveCardActions({
  active = false,
  disabled = false,
  withMoreMenu = false,
  moreMenuOpen = false,
  onMoreMenuOpenChange,
}: {
  active?: boolean;
  disabled?: boolean;
  withMoreMenu?: boolean;
  moreMenuOpen?: boolean;
  onMoreMenuOpenChange?: (open: boolean) => void;
}) {
  return (
    <div
      onClick={(event) => event.stopPropagation()}
      style={{
        marginInline: -cardTokens.interactivePadding,
        marginTop: 0,
        marginBottom: -cardTokens.interactivePadding,
        borderTop: `1px solid ${cardInteractionTokens.divider}`,
        boxSizing: "border-box",
        height: cardTokens.actionBarHeight,
        flex: `0 0 ${cardTokens.actionBarHeight}px`,
        padding: `${cardTokens.actionBarPadding}px ${cardTokens.interactivePadding}px`,
        display: "flex",
        gap: cardTokens.actionGap,
        alignItems: "center",
      }}
    >
      {withMoreMenu ? (
        <>
          <SensButton
            tone="linkWeak"
            disabled={disabled}
            style={cardActionButtonStyle}
          >
            操作 1
          </SensButton>
          <SensButton
            tone="linkWeak"
            disabled={disabled}
            style={cardActionButtonStyle}
          >
            操作 2
          </SensButton>
          <SensButtonActionMenu
            tone={moreMenuOpen ? "link" : "linkWeak"}
            showChevron
            items={CARD_OPERATION_MENU_ITEMS}
            disabled={disabled}
            style={cardActionButtonStyle}
            dropdownProps={{
              open: moreMenuOpen,
              placement: "bottomLeft",
              onOpenChange: onMoreMenuOpenChange,
            }}
          >
            更多
          </SensButtonActionMenu>
        </>
      ) : (
        <>
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
        </>
      )}
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
  const interactive = state === "error";
  const { eventHandlers } = useCardInteractionState();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: cardTokens.compactGap }}>
      <SensCard
        {...(interactive ? eventHandlers : {})}
        data-card-demo={demo}
        data-card-state={state}
        interactive={interactive}
        pressable={false}
        disabled={state !== "error"}
        error={state === "error"}
        style={{
          padding: cardTokens.interactivePadding,
          ...(state === "disabledHover" ? { boxShadow: buildShadowD3() } : {}),
        }}
      >
        {children}
      </SensCard>
      {state === "error" ? <ErrorMessage /> : null}
    </div>
  );
}

function FreeStatusCardSample({ state }: { state: CardStatusState }) {
  const disabled = state === "disabled" || state === "disabledHover";

  return (
    <StatusSampleShell state={state} demo={`free-${state}`}>
      <div style={{ display: "flex", flexDirection: "column", gap: cardTokens.gap }}>
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
  const interactive = state === "error";
  const [openMenu, setOpenMenu] = useState<"bottom" | "top" | null>(null);

  const handleMenuOpenChange = (menu: "bottom" | "top") => (open: boolean) => {
    setOpenMenu(open ? menu : null);
  };

  return (
    <StatusSampleShell state={state} demo={`grid-${state}`}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: cardTokens.gap,
          overflow: "hidden",
        }}
      >
        <InteractiveCardHeader
          withMedia
          iconColor={disabled ? colorTokens.disabledText : colorTokens.subText}
          withMoreMenu
          disabled={disabled}
          moreMenuOpen={openMenu === "top"}
          onMoreMenuOpenChange={handleMenuOpenChange("top")}
        />
        <PlaceholderBlock />
        <InteractiveCardActions
          active={false}
          disabled={disabled}
          withMoreMenu
          moreMenuOpen={openMenu === "bottom"}
          onMoreMenuOpenChange={handleMenuOpenChange("bottom")}
        />
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

function GenericCardStateSample({ state }: { state: GenericCardState }) {
  const selected = state === "selected" || state === "selectedHover";
  const disabled = state === "disabled" || state === "disabledHover";
  const label = GENERIC_CARD_STATES.find((item) => item.key === state)?.label;
  const stateVisualStyle = {
    ...(state === "hover" ? { boxShadow: buildShadowD3() } : {}),
    ...(state === "pressed"
      ? {
          borderColor: colorTokens.activeBorder,
          boxShadow: buildFunctionalActiveRingShadow(),
        }
      : {}),
    ...(state === "selected"
      ? { borderColor: colorTokens.activeBorder, boxShadow: "none" }
      : {}),
    ...(state === "selectedHover"
      ? { borderColor: colorTokens.activeBorder, boxShadow: buildShadowD3() }
      : {}),
  };

  return (
    <Space direction="vertical" size="small" style={{ width: "100%" }}>
      <Text>{label}</Text>
      <SensCard
        data-card-demo={`generic-${state}`}
        data-card-state={state}
        interactive={!disabled}
        selected={selected}
        disabled={disabled}
        style={{
          padding: unit["spacing/3x"],
          ...(selected ? { background: colorTokens.cardBg } : {}),
          ...stateVisualStyle,
          ...(disabled
            ? {
                background: colorTokens.filledBg,
                borderColor: cardInteractionTokens.divider,
                ...(state === "disabledHover" ? { boxShadow: buildShadowD3() } : {}),
              }
            : {}),
        }}
      >
        <PlaceholderBlock height={GENERIC_CARD_PLACEHOLDER_HEIGHT} />
      </SensCard>
    </Space>
  );
}

function GenericCardStateMatrix() {
  return (
    <Space direction="vertical" size="small" style={{ width: "100%" }}>
      <Paragraph style={{ margin: 0, color: colorTokens.subText }}>
        通用卡片只展示容器状态；默认、悬停、点击和选中悬停支持真实鼠标走查，选中语义仍由宿主决定。
      </Paragraph>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(160px, 1fr))", gap: cardTokens.gap }}>
        {GENERIC_CARD_STATES.map((state) => (
          <GenericCardStateSample key={state.key} state={state.key} />
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
      <SensCard
        {...eventHandlers}
        data-card-demo="free"
        data-card-state={state}
        interactive
        style={{
          padding: cardTokens.interactivePadding,
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
      </SensCard>
      <TokenLabels labels={["default / hover / pressed", "radius/l", "spacing/3x", "shadow/D3/down"]} />
    </Space>
  );
}

function GridInteractiveCardExample() {
  const { state, eventHandlers } = useCardInteractionState();
  const [openMenu, setOpenMenu] = useState<"bottom" | "top" | null>(null);

  const handleMenuOpenChange = (menu: "bottom" | "top") => (open: boolean) => {
    setOpenMenu(open ? menu : null);
  };

  return (
    <Space direction="vertical" size="small" style={{ width: "100%" }}>
      <div>
        <Text strong>网格视图卡片 / 操作外露型 / 无选择功能</Text>
        <Paragraph style={{ marginTop: cardTokens.compactGap, marginBottom: 0, color: colorTokens.subText }}>
          卡片只承载打开、编辑等操作，不提供选中语义；操作区使用弱化链接按钮，更多操作通过下拉菜单收纳。
        </Paragraph>
      </div>
      <SensCard
        {...eventHandlers}
        data-card-demo="grid-operation-only"
        data-card-state={state}
        data-card-selectable="false"
        interactive
        pressable={false}
        style={{
          padding: cardTokens.interactivePadding,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: cardTokens.gap,
          overflow: "hidden",
        }}
      >
        <InteractiveCardHeader
          withMedia
          withMoreMenu
          moreMenuOpen={openMenu === "top"}
          onMoreMenuOpenChange={handleMenuOpenChange("top")}
        />
        <PlaceholderBlock />
        <InteractiveCardActions
          withMoreMenu
          moreMenuOpen={openMenu === "bottom"}
          onMoreMenuOpenChange={handleMenuOpenChange("bottom")}
        />
      </SensCard>
      <TokenLabels labels={["divider/color/light/transparent", "linkWeak", "dropdown-menu / variant=link", "无 selected"]} />
    </Space>
  );
}

function SelectableCardExample() {
  const [selected, setSelected] = useState(false);
  const { state, eventHandlers } = useCardInteractionState();
  const [openMenu, setOpenMenu] = useState<"bottom" | "top" | null>(null);

  const handleMenuOpenChange = (menu: "bottom" | "top") => (open: boolean) => {
    setOpenMenu(open ? menu : null);
  };

  return (
    <Space direction="vertical" size="small" style={{ width: "100%" }}>
      <div>
        <Text strong>选择型卡片 / 激活状态</Text>
        <Paragraph style={{ marginTop: cardTokens.compactGap, marginBottom: 0, color: colorTokens.subText }}>
          激活只属于带 checkbox 的选择型卡片：浅绿背景 + active 描边 + active 外环；悬停复用网格视图卡片的 D3 投影。
        </Paragraph>
      </div>
      <SensCard
        {...eventHandlers}
        role="checkbox"
        aria-checked={selected}
        tabIndex={0}
        data-card-demo="selectable"
        data-card-state={selected ? "checked" : state}
        interactive
        selected={selected}
        onClick={() => setSelected((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setSelected((value) => !value);
          }
        }}
        style={{
          padding: cardTokens.interactivePadding,
          display: "flex",
          flexDirection: "column",
          gap: cardTokens.gap,
          overflow: "hidden",
        }}
      >
        <InteractiveCardHeader
          withMedia={false}
          withCheckbox
          checked={selected}
          withMoreMenu
          moreMenuOpen={openMenu === "top"}
          onMoreMenuOpenChange={handleMenuOpenChange("top")}
        />
        <PlaceholderBlock />
        <InteractiveCardActions
          withMoreMenu
          moreMenuOpen={openMenu === "bottom"}
          onMoreMenuOpenChange={handleMenuOpenChange("bottom")}
        />
      </SensCard>
      <TokenLabels labels={["SensCheckbox", "component-primary / hover / active", "linkWeak default", "link-color on hover / open", "two dropdown menus"]} />
    </Space>
  );
}

function EntryCardIcon({ name }: { name: ColorfulIconName }) {
  return <SensIcon name={name} variant="colorful" size={unit["size/xxl"]} />;
}

function EntryCardStateSample({ state, size = "large" }: { state: EntryCardState; size?: "large" | "small" }) {
  const selected = state === "selected" || state === "selectedHover";
  const disabled = state === "disabled" || state === "disabledHover";
  const stateStyle = {
    ...(state === "hover" ? { boxShadow: buildShadowD3() } : {}),
    ...(state === "pressed"
      ? {
          borderColor: colorTokens.activeBorder,
          borderRadius: unit["radius/m"],
          boxShadow: buildFunctionalActiveRingShadow(),
        }
      : {}),
    ...(selected
      ? {
          borderColor: colorTokens.activeBorder,
          background: colorTokens.selectedBg,
          boxShadow: state === "selectedHover" ? buildShadowD3() : "none",
        }
      : {}),
    ...(disabled
      ? {
          background: colorTokens.filledBg,
          borderColor: cardInteractionTokens.divider,
          ...(state === "disabledHover" ? { boxShadow: buildShadowD3() } : {}),
        }
      : {}),
  };

  return (
    <Space direction="vertical" size="small" style={{ width: "100%" }}>
      <Text>{ENTRY_CARD_STATES.find((item) => item.key === state)?.label}</Text>
      <SensEntryCard
        data-card-demo={`entry-${size}-${state}`}
        data-card-state={state}
        size={size}
        icon={<EntryCardIcon name={ENTRY_CARD_ICONS[0]} />}
        title="入口标题"
        description="辅助信息"
        selected={selected}
        disabled={disabled}
        interactive={!disabled}
        style={stateStyle}
      />
    </Space>
  );
}

function EntryCardInteractiveExample() {
  const [selectedEntry, setSelectedEntry] = useState<"large" | "small" | null>(null);
  const [lastDoubleClickedEntry, setLastDoubleClickedEntry] = useState<"large" | "small" | null>(null);

  const toggleSelectedEntry = (entry: "large" | "small") => {
    setSelectedEntry((current) => (current === entry ? null : entry));
  };

  return (
    <Space direction="vertical" size="small" style={{ width: "100%" }}>
      <div>
        <Text strong>入口型卡片 / 可点击入口</Text>
        <Paragraph style={{ marginTop: cardTokens.compactGap, marginBottom: 0, color: colorTokens.subText }}>
          入口卡片是具备导航属性的按钮；图标、标题和辅助信息由业务宿主传入，卡片自身支持键盘激活和双击。
        </Paragraph>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: cardTokens.gap }}>
        <SensEntryCard
          data-card-demo="entry-large"
          size="large"
          icon={<EntryCardIcon name="webhook-setting" />}
          title="企业触达通道配置"
          description="配置企业内的触达方式"
          selected={selectedEntry === "large"}
          aria-current={selectedEntry === "large" ? "page" : undefined}
          onClick={() => toggleSelectedEntry("large")}
          onDoubleClick={() => setLastDoubleClickedEntry("large")}
        />
        <SensEntryCard
          data-card-demo="entry-small"
          size="small"
          icon={<EntryCardIcon name="section-settings" />}
          title="项目设置"
          description="管理项目基础配置"
          selected={selectedEntry === "small"}
          aria-current={selectedEntry === "small" ? "page" : undefined}
          onClick={() => toggleSelectedEntry("small")}
          onDoubleClick={() => setLastDoubleClickedEntry("small")}
        />
      </div>
      {lastDoubleClickedEntry ? (
        <Text style={{ color: colorTokens.subText }}>
          双击已触发：{lastDoubleClickedEntry === "large" ? "企业触达通道配置" : "项目设置"}
        </Text>
      ) : null}
      <TokenLabels
        labels={[
          "SensCard",
          "spacing/3x",
          "radius/m · 点击",
          "radius/l · 选中",
          "彩色图标 48px",
          "大号图标布局位 60px",
          "component-active",
          "shadow/active-ring/functional · 点击",
          "shadow/D3/down · 悬停",
          "component-active-background · 选中",
        ]}
      />
    </Space>
  );
}

function EntryCardMatrix() {
  return (
    <Space direction="vertical" size="small" style={{ width: "100%" }}>
      <Paragraph style={{ margin: 0, color: colorTokens.subText }}>
        入口型卡片的状态矩阵使用真实 SensEntryCard；实际场景中由业务宿主决定导航和选中语义。
      </Paragraph>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: cardTokens.gap }}>
        {ENTRY_CARD_STATES.map((state) => (
          <EntryCardStateSample key={state.key} state={state.key} />
        ))}
      </div>
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
      <SensCard
        variant={spec.key === "filled" ? "filled" : "outline"}
        style={{ padding: cardTokens.padding }}
      >
        <PlaceholderBlock />
      </SensCard>
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

      <SensCard style={{ padding: 0, overflow: "hidden" }}>
        <div
          style={{
            minHeight: unit["size/component-height/l"],
            padding: `0 ${cardTokens.padding}px`,
            display: "flex",
            alignItems: "center",
            gap: cardTokens.compactGap,
          }}
        >
          <SensButton
            tone="linkWeak"
            aria-label="拖拽标题区"
            icon={<SensIcon name="drag-vertical" sizeToken="size/icon/m" color="currentColor" />}
            style={{
              width: cardTokens.iconSize + cardTokens.compactGap * 2,
              height: cardTokens.iconSize + cardTokens.compactGap * 2,
              minHeight: cardTokens.iconSize + cardTokens.compactGap * 2,
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 0,
              cursor: "var(--sens-cursor-move)",
            }}
          />
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
          <SensButton
            tone="link"
            icon={<SensIcon name="rename" sizeToken="size/icon/m" color="currentColor" />}
            style={{ minWidth: 0, paddingInline: 0 }}
          >
            操作
          </SensButton>
        </div>
        <div style={{ height: getDividerHairlineWidth(), background: cardInteractionTokens.divider }} />
        <div style={{ padding: cardTokens.padding }}>
          <PlaceholderBlock compact />
        </div>
      </SensCard>
      <TokenLabels labels={["Typography 四级标题", "Typography 正文内容", "size/icon/m", "仅组合示例"]} />
    </Space>
  );
}

export function CardInteractiveShowcase() {
  const token = getPreviewTokens();

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <section>
        <Title level={5} style={{ marginTop: 0 }}>
          通用卡片 / 状态
        </Title>
        <GenericCardStateMatrix />
      </section>

      <section>
        <Title level={5} style={{ marginTop: 0 }}>
          组合示例
        </Title>
        <TitledCardExample />
      </section>

      <section>
        <Title level={5}>入口型卡片</Title>
        <EntryCardInteractiveExample />
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

export function CardMatrixPanel() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <CardStatusGroup
        title="自由卡片 / 状态矩阵"
        description="静态对照 default 之外的禁用、禁用悬停和报错状态。"
        kind="free"
      />
      <CardStatusGroup
        title="网格视图卡片 / 状态矩阵"
        description="网格结构复用同一套容器状态，内部标题区、分割线和操作区保持可见。"
        kind="grid"
      />
      <section>
        <Text strong>入口型卡片 / 状态矩阵</Text>
        <EntryCardMatrix />
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
        description="本轮收敛自由容器卡片、入口型卡片和标题区组合示例；业务页面中的入口卡片组合进入样板间。"
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
        description="selected / 激活只属于带 checkbox 的选择型卡片；入口型卡片的 selected 由业务宿主按导航场景决定。"
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

export function CardRulePanel() {
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

function CardFoundationSpecimen() {
  const token = getPreviewTokens();

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
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
        <Alert
          type="info"
          showIcon
          message="基础样式页边界"
          description="这里只展示 Card 容器的基础类型、尺寸和 token 映射；真实交互状态请前往 /components/card。"
        />
      </Space>
      <div
        style={{
          minWidth: 0,
          width: "100%",
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadius,
          padding: token.paddingMD,
          background: token.colorBgContainer,
          alignSelf: "start",
        }}
      >
        <Tabs
          size="small"
          defaultActiveKey="mapping"
          items={[{ key: "mapping", label: "数值与 Token 映射", children: <MappingPanel /> }]}
        />
      </div>
    </Space>
  );
}

export default function CardBasicStylePage() {
  return (
    <BasicStylePageLayout
      title="卡片"
      description="展示 Card 容器的基础类型、尺寸和 token 对照；交互状态请在基础组件页单独走查。"
      designDocSource={cardDocSource}
      specimen={<CardFoundationSpecimen />}
    />
  );
}
