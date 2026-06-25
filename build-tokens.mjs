// build-tokens.mjs
// 把 Figma 导出的 DTCG JSON 转成可用产物：
//   - design-system/theme.ts            (antd 主题：种子 + 中性 + Table 组件 token)
//   - design-system/tokens.resolved.json(全部 color handle→hex、unit→number)
//   - design-system/i18n/zh.json / en.json
// 用法：  node build-tokens.mjs <导出文件目录> [输出目录]
// 重新从 Figma 导出后原地再跑一次，产物全部覆盖更新。

import fs from "node:fs";
import path from "node:path";

const IN  = process.argv[2] || ".";
const OUT = process.argv[3] || "./design-system";
const FILES = { color: "Color.json", unit: "unit.json", zh: "zh-cn_tokens.json", en: "en_tokens.json" };
const load = (f) => JSON.parse(fs.readFileSync(path.join(IN, f), "utf8").replace(/^\uFEFF/, ""));

function resolve(value, root, depth = 0) {
  if (depth > 12) return null;
  if (value && typeof value === "object" && "hex" in value) return value.hex;
  if (typeof value === "string" && value.startsWith("{") && value.endsWith("}")) {
    let node = root;
    for (const seg of value.slice(1, -1).split(".")) { if (node == null) break; node = node[seg]; }
    if (node && "$value" in node) return resolve(node.$value, root, depth + 1);
    return `UNRESOLVED(${value})`;
  }
  return value;
}
function walk(node, root, cb, trail = []) {
  if (node && typeof node === "object") {
    if ("$value" in node) { cb(trail, node, root); return; }
    for (const [k, v] of Object.entries(node)) { if (k.startsWith("$")) continue; walk(v, root, cb, [...trail, k]); }
  }
}

const colorDoc = load(FILES.color);
const byHandle = {}, colorByPath = {};
walk(colorDoc, colorDoc, (trail, leaf, root) => {
  const full = trail.join("/"); const hex = resolve(leaf.$value, root);
  colorByPath[full] = hex;
  const m = full.match(/@([\w-]+)\s*$/); if (m) byHandle[m[1]] = hex;
});
const unitDoc = load(FILES.unit);
const unitByPath = {};
walk(unitDoc, unitDoc, (trail, leaf, root) => { unitByPath[trail.join("/")] = resolve(leaf.$value, root); });

const C = byHandle, U = unitByPath;

// 把不透明 hex + alpha 转成 rgba（透明语义色用）
function alpha(hex, a) {
  const h = String(hex || "").replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(n.slice(0, 2), 16), g = parseInt(n.slice(2, 4), 16), b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
// 这两个 unit key 用的是特殊点号 U+2024（不是普通句点）
const DOT = "\u2024";
const SP_0_5    = `spacing/0${DOT}5x`;            // 2
const SP_H_2_5  = `spacing/horizontal/2${DOT}5x`; // 10
// 中性黑投影色：mask-01-transparent + 透明度派生（禁止写死 rgba(11,12,13)）
const SHADOW_NEUTRAL = C["mask-01-transparent"];
function buildShadowD1() {
  return `0 0 1px 0 ${alpha(SHADOW_NEUTRAL, 0.2)}, 0 1px 2px 0 ${alpha(SHADOW_NEUTRAL, 0.1)}`;
}
function buildShadowD3() {
  return `0 2px 6px 0 ${alpha(SHADOW_NEUTRAL, 0.1)}, 0 4px 12px 0 ${alpha(SHADOW_NEUTRAL, 0.04)}`;
}
function buildShadowD4() {
  return `0 2px 12px 0 ${alpha(SHADOW_NEUTRAL, 0.1)}, 0 4px 20px 0 ${alpha(SHADOW_NEUTRAL, 0.08)}`;
}
const SHADOW_D1 = buildShadowD1();
const SHADOW_D3 = buildShadowD3();
const SHADOW_D4 = buildShadowD4();
// 关掉 antd Button 默认彩色投影（比 "none" 更不易被 prepareComponentToken 默认值盖回）
const ANT_BUTTON_SHADOW_OFF = "0 0 0 0 transparent";
// antd PresetColors → ${color}ShadowColor（genPresetColorStyle 消费）
const PRESET_COLORS = [
  "blue", "purple", "cyan", "green", "magenta", "pink", "red",
  "orange", "yellow", "volcano", "geekblue", "lime", "gold",
];
const PRESET_BUTTON_SHADOW_TOKENS = Object.fromEntries(
  PRESET_COLORS.map((c) => [`${c}ShadowColor`, ANT_BUTTON_SHADOW_OFF]),
);

// 字阶（unit 未导出 typography 时与设计稿对齐；导出后改为 U["typography/..."]）
const TYPO_FONT_SIZE_SM = U["typography/font-size/s"] ?? 12;
const TYPO_LINE_HEIGHT_SM = U["typography/line-height/s"] ?? 18;
// midnight-dark-04：outline-color-transparent @ 0.08（不换肤中性层）
const MIDNIGHT_DARK_04 = alpha(C["outline-color-transparent"], 0.08);
// Input 聚焦光晕：从语义 handle 派生 α，禁止写死 rgba 字面量
const INPUT_ACTIVE_OUTLINE_COLOR = alpha(C["component-active-shadow"], 0.2);
function buildInputActiveShadow() {
  return `0 0 0 2px ${INPUT_ACTIVE_OUTLINE_COLOR}`;
}
function buildInputErrorActiveShadow() {
  return `0 0 0 2px ${alpha(C["warning-color-active-shadow"], 0.2)}`;
}
const INPUT_ACTIVE_SHADOW = buildInputActiveShadow();
const INPUT_ERROR_ACTIVE_SHADOW = buildInputErrorActiveShadow();
const INPUT_DIVIDER_BORDER = alpha(C["divideline-color-transparent-dack"], 0.16);

/** Input / InputNumber 共享字段色（脚本层 DRY；InputNumber 不自动继承 components.Input） */
function buildInputFieldTokens() {
  return {
    colorBorder:            INPUT_DIVIDER_BORDER,
    hoverBorderColor:       C["component-primary"],
    activeBorderColor:      C["component-active"],
    activeShadow:           INPUT_ACTIVE_SHADOW,
    errorActiveShadow:      INPUT_ERROR_ACTIVE_SHADOW,
    colorBorderDisabled:    alpha(C["divideline-color-transparent-light"], 0.08),
    colorBorderDisabledHover: alpha(C["line-color-transparent"], 0.06),
    hoverBg:                C["white"],
    activeBg:               C["white"],
    colorBgContainerDisabled: alpha(C["background-transparent-grey-hover"], 0.06),
    colorBgContainerDisabledHover: alpha(C["background-transparent-grey"], 0.04),
    colorTextPlaceholder:   alpha(C["text-color-transparent-disable"], 0.30),
    warningReadonlyBg:      C["warning-light-background"],
    paddingInline:          U["spacing/horizontal/3x"],
    paddingInlineSM:        U[SP_H_2_5],
    paddingBlock:           0,
    paddingBlockSM:         0,
    inputFontSize:          14,
    inputFontSizeSM:        TYPO_FONT_SIZE_SM,
  };
}

const INPUT_FIELD_TOKENS = buildInputFieldTokens();
// Figma 17464:62740 步进器列宽 17px；箭头 10×10（2535:10559/10560）
const INPUT_NUMBER_HANDLE_WIDTH = 17;
const INPUT_NUMBER_CONTROL_WIDTH = 188;
const SELECT_OPTION_HEIGHT = 34;
// Figma 17767:72632 · 浮层上 6 / 下 10；6 = spacing/1x + spacing/0.5x（尚无 spacing/1.5x）
const SP_V_2_5 = `spacing/vertical/2${DOT}5x`;
const SP_H_3 = "spacing/horizontal/3x";
const SELECT_POPUP_PADDING_TOP = U[SP_0_5] + U["spacing/1x"];
const SELECT_POPUP_PADDING_BOTTOM = U[SP_V_2_5];
const SELECT_OPTION_PADDING_INLINE = U[SP_H_3];
const SELECT_OPTION_PADDING_BLOCK = SELECT_POPUP_PADDING_TOP;

/** Select 浮层选项行色（脚本层 DRY；不继承 Input/Button） */
function buildSelectOptionRowTokens() {
  return {
    optionHeight:             SELECT_OPTION_HEIGHT,
    optionActiveBg:           alpha(C["background-transparent-grey-hover"], 0.06),
    optionSelectedBg:         C["component-active-background"],
    optionHoverBg:            alpha(C["background-transparent-grey-hover"], 0.06),
    optionClickBg:            alpha(C["background-01-transparent"], 0.08),
    optionSelectedHoverBg:    C["component-active-hover-background"],
    optionSelectedActiveBg:   C["component-active-click-background"],
    popupShadow:              SHADOW_D4,
    popupPaddingBlockStart:   SELECT_POPUP_PADDING_TOP,
    popupPaddingBlockEnd:     SELECT_POPUP_PADDING_BOTTOM,
    optionPaddingInline:      SELECT_OPTION_PADDING_INLINE,
    optionPaddingBlock:       SELECT_OPTION_PADDING_BLOCK,
    optionPadding:            `${SELECT_OPTION_PADDING_BLOCK}px ${SELECT_OPTION_PADDING_INLINE}px`,
  };
}

const SELECT_OPTION_ROW_TOKENS = buildSelectOptionRowTokens();

// 全局 token（颜色按视觉语义对到 antd；中性色撑起一整屏的观感）
const token = {
  colorPrimary: C["component-primary"],
  colorSuccess: C["success-color"],
  colorError:   C["warning-color"],   // 你们「警告」=红 → antd error
  colorWarning: C["info-color"],      // 你们「提醒」=琥珀 → antd warning
  colorInfo:    C["link-color"],
  colorLink:    C["link-color"],
  colorLinkHover: C["link-hover-color"],
  colorPrimaryHover:  C["component-hover"],     // 一级按钮 hover #27C296
  colorPrimaryActive: C["component-active"],    // 一级按钮 点击 #008C65
  colorErrorHover:    C["warning-color-hover"], // 警告 hover #EB6767
  colorErrorActive:   C["warning-color-active"],// 警告 点击 #B22B2B
  colorLinkActive:    C["link-active-color"],   // 链接 点击 #1F53B8
  colorText:          C["text-color"],
  colorTextSecondary: C["text-sub-color"],
  colorTextTertiary:  C["text-color-disable"],
  colorBorder:          C["outline-color"],
  colorBorderSecondary: C["divideline-color-light"],
  colorIcon:      C["icon-color-transparent"],   // 默认图标色 #747E94
  colorIconHover: C["text-color"],               // 图标 hover 加深到文字色
  colorBgContainer: C["white"],
  colorBgLayout:    C["background-grey"],
  colorFillAlter:     C["background-04"],       // 表头浅灰底
  colorFillSecondary: C["background-grey-hover"],// 行 hover 底
  borderRadius:  U["radius/m"],
  borderRadiusSM: U["radius/s"],
  controlHeight: U["size/component-height/m"],
  controlHeightSM: U["size/component-height/s"],
  sizeUnit:      U["spacing/1x"],
};

// 组件级 token（表格的精确观感大头在这里）
const components = {
  Table: {
    headerBg:        C["background-04"],
    headerColor:     C["text-color"],
    headerSplitColor:C["divideline-color-light"],
    borderColor:     C["line-color"],
    rowHoverBg:      C["background-grey-hover"],
    cellPaddingBlock: U["spacing/3x"],
  },
  Tabs: {
    itemColor:            C["text-color"],
    itemHoverColor:       C["component-hover"],
    itemActiveColor:      C["component-primary"],
    itemSelectedColor:    C["component-primary"],
    inkBarColor:          C["component-primary"],
    itemDisabledColor:    C["text-color-disable"],
    horizontalItemGutter: U["spacing/6x"],
    cardHeight:           U["size/component-height/m"],
    cardHeightSM:         U["size/component-height/s"],
    cardPaddingInline:    U["spacing/horizontal/3x"],
    cardPaddingInlineSM:  U[SP_H_2_5],
    titleFontSize:        14,
    titleFontSizeSM:      12,
  },
  // 胶囊：选中=白底 + D1 投影 + 绿字（已对 Figma：选中 Fill = @white）
  Segmented: {
    trackBg:               alpha(C["background-01-transparent"], 0.04),
    trackPadding:          U["spacing/1x"],
    itemColor:             alpha(C["text-color-transparent"], 0.58),
    itemHoverColor:        C["component-primary"],
    itemActiveColor:       C["component-active"],
    itemSelectedColor:     C["component-primary"],
    itemDisabledColor:     alpha(C["text-color-transparent-disable"], 0.30),
    itemDisabledHoverColor:alpha(C["text-color-transparent-disable-hover"], 0.24),
    itemSelectedBg:        C["white"],
    itemSelectedShadow:    SHADOW_D1,
    itemSelectedBorderColor:alpha(C["outline-color-transparent"], 0.06),
    itemBorderRadius:      U["radius/m"],
    itemBorderRadiusSM:    U["radius/s"],
    itemPaddingInline:     U["spacing/horizontal/3x"],
    itemPaddingInlineSM:   U[SP_H_2_5],
    itemFontSize:          14,
    itemFontSizeSM:        12,
    itemLineHeight:        22,
    itemLineHeightSM:      18,
    itemGap:               U["spacing/1x"],
    // 胶囊上的徽标（与 badge 组件同源）
    badgeBg:               alpha(C["background-transparent-grey"], 0.08),
    badgeText:             alpha(C["text-color-transparent"], 0.58),
    badgeActiveBg:         C["component-light-background"],
    badgeActiveText:       C["component-primary"],
    badgeDisabledText:     alpha(C["text-color-transparent-disable"], 0.30),
    badgeDisabledHoverText:alpha(C["text-color-transparent-disable-hover"], 0.24),
    badgeHeight:           U["size/xxs"],
    badgeRadius:           U["radius/xl"],
    badgePaddingInline:    U[SP_0_5],
    badgeFontSize:         12,
    badgeLineHeight:       18,
  },
  Badge: {
    dotSize:    U["size/mini"],
    statusSize: U["size/mini"],
  },
  Input: {
    ...INPUT_FIELD_TOKENS,
  },
  InputNumber: {
    ...INPUT_FIELD_TOKENS,
    controlWidth:           INPUT_NUMBER_CONTROL_WIDTH,
    handleWidth:            INPUT_NUMBER_HANDLE_WIDTH,
    handleFontSize:         10,
    handleVisible:          "auto",
    handleBg:               C["white"],
    handleActiveBg:         "transparent",
    handleHoverColor:       C["component-primary"],
    handleBorderColor:      INPUT_DIVIDER_BORDER,
    filledHandleBg:         C["white"],
  },
  Select: {
    ...SELECT_OPTION_ROW_TOKENS,
    // —— 触发框（R3）：与 Input 同源字段色；浮层行见 SELECT_OPTION_ROW_TOKENS ——
    colorBorder: INPUT_FIELD_TOKENS.colorBorder,
    hoverBorderColor: INPUT_FIELD_TOKENS.hoverBorderColor,
    activeBorderColor: INPUT_FIELD_TOKENS.activeBorderColor,
    activeOutlineColor: INPUT_ACTIVE_OUTLINE_COLOR,
    selectorBg: INPUT_FIELD_TOKENS.hoverBg,
    colorBgContainerDisabled: INPUT_FIELD_TOKENS.colorBgContainerDisabled,
    colorTextPlaceholder: INPUT_FIELD_TOKENS.colorTextPlaceholder,
  },
  Button: {
    // 关掉 antd 默认投影；条件投影由 SensButton 按 variant×state 驱动
    primaryShadow:            ANT_BUTTON_SHADOW_OFF,
    defaultShadow:            ANT_BUTTON_SHADOW_OFF,
    dangerShadow:             ANT_BUTTON_SHADOW_OFF,
    ...PRESET_BUTTON_SHADOW_TOKENS,
    shadowD1:                 SHADOW_D1,
    shadowHover:              SHADOW_D3,
    shadowFloating:           SHADOW_D4,
    // 一级常规实心描边 midnight-dark-04（SensButton primary 专用；剥离后不注入 antd）
    primarySolidBorderColor:  MIDNIGHT_DARK_04,
    // 二级 default（color=default+outlined）：中性不换肤；hover/active 仍走下方 defaultHover*
    defaultColor:             C["text-color-transparent"],
    defaultBorderColor:       INPUT_DIVIDER_BORDER,
    contentFontSizeSM:        TYPO_FONT_SIZE_SM,
    contentLineHeightSM:      TYPO_LINE_HEIGHT_SM,
    paddingInline:            U[SP_H_3],
    paddingInlineSM:          U[SP_H_2_5],
    iconGap:                  U["spacing/1x"],
    // 二级（描边）hover/点击：只变边框+文字色，【无背景填充】（团队规则，区别于 antd 默认）
    defaultHoverColor:        C["component-hover"],   // #27C296
    defaultActiveColor:       C["component-active"],  // #008C65
    defaultHoverBorderColor:  C["component-hover"],
    defaultActiveBorderColor: C["component-active"],
    // 三级（primary+text）hover/点击：无底；仅 Button 组件级别名覆盖，不改根 token
    colorPrimaryBg:           "transparent",
    colorPrimaryBorder:       "transparent",
    colorPrimaryTextHover:    C["component-hover"],
    colorPrimaryTextActive:   C["component-active"],
    // 警告三级（danger+text）hover/点击：无底；仅 Button 组件级别名覆盖
    colorErrorBg:             "transparent",
    colorErrorBgActive:       "transparent",
  },
};

const themeTs = `// 由 build-tokens.mjs 自动生成，请勿手改。重新从 Figma 导出后重跑脚本。
import { theme as antdTheme, type ThemeConfig } from "antd";

const token = ${JSON.stringify(token, null, 2)} as const;
const components = ${JSON.stringify(components, null, 2)} as const;

const { primarySolidBorderColor: buttonPrimaryBorderColor, ...buttonComponentForAntd } = components.Button;

/** 一级常规实心描边（midnight-dark-04）；仅 SensButton tone=primary */
export function getButtonPrimaryBorderColor(): string {
  return buttonPrimaryBorderColor;
}

export function buildAntdTheme(mode: "light" | "dark" = "light"): ThemeConfig {
  return {
    algorithm: mode === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: { ...token },
    components: {
      ...components,
      Button: buttonComponentForAntd,
    } as unknown as ThemeConfig["components"],
  };
}
`;

function toI18n(doc) {
  const out = {};
  walk(doc, doc, (trail, leaf) => {
    let cur = out;
    trail.forEach((seg, i) => { if (i === trail.length - 1) cur[seg] = leaf.$value; else cur = (cur[seg] ??= {}); });
  });
  return out;
}

fs.mkdirSync(path.join(OUT, "i18n"), { recursive: true });
fs.writeFileSync(path.join(OUT, "theme.ts"), themeTs);
fs.writeFileSync(
  path.join(OUT, "tokens.resolved.json"),
  JSON.stringify(
    {
      color: byHandle,
      colorByPath,
      unit: unitByPath,
      typography: {
        "font-size/s": TYPO_FONT_SIZE_SM,
        "line-height/s": TYPO_LINE_HEIGHT_SM,
      },
    },
    null,
    2,
  ),
);
fs.writeFileSync(path.join(OUT, "i18n/zh.json"), JSON.stringify(toI18n(load(FILES.zh)), null, 2));
fs.writeFileSync(path.join(OUT, "i18n/en.json"), JSON.stringify(toI18n(load(FILES.en)), null, 2));
console.log("token keys:", Object.keys(token).length, "| Table tokens:", Object.keys(components.Table).length);
