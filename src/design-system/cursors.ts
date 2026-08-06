/**
 * SensD 鼠标态 registry
 *
 * 实现：系统 CSS `cursor` 关键字（原生观感）。
 * 规则：SensD《鼠标指针》语义（labelZh / description / 分组 / 场景约定）。
 * `illustration`：走查页可选示意 PNG，不参与真实光标。
 *
 * 页签拖拽等「换位」用 `move`（对齐规则「移动」），不要用 grab/grabbing。
 * 注意：`how-cursor-works.md` 是 Cursor AI 工作说明，与本 registry 无关。
 */

export type SensCursorName =
  | "default"
  | "pointer"
  | "not-allowed"
  | "text"
  | "vertical-text"
  | "crosshair"
  | "move"
  | "no-drop"
  | "grab"
  | "grabbing"
  | "copy"
  | "n-resize"
  | "e-resize"
  | "s-resize"
  | "w-resize"
  | "ne-resize"
  | "nw-resize"
  | "se-resize"
  | "sw-resize"
  | "ns-resize"
  | "ew-resize"
  | "nesw-resize"
  | "nwse-resize"
  | "col-resize";

export type SensCursorDef = {
  /** CSS 类名，如 `sens-cursor-move` */
  className: string;
  /** CSS 变量名，如 `--sens-cursor-move` */
  cssVar: string;
  /** 系统 `cursor` 关键字（真实生效值） */
  cssValue: string;
  /** 走查页示意图（可选；不参与 cursor） */
  illustration?: string;
  /** Figma / 规则来源 */
  figma: string;
  /** 分组：默认 / 状态 / 选择 / 移动 / 调整尺寸 */
  group: "default" | "state" | "select" | "move" | "resize";
  /** 规则稿中文名 */
  labelZh: string;
  /** 规则稿描述（统一用「标示」） */
  description: string;
  /** 主验（规则优先 8 态） */
  primary?: boolean;
};

const illust = (name: string) => `/cursors/${name}.png`;

export const SENS_CURSORS: Record<SensCursorName, SensCursorDef> = {
  default: {
    className: "sens-cursor-default",
    cssVar: "--sens-cursor-default",
    cssValue: "default",
    illustration: illust("default"),
    figma: "1123:157",
    group: "default",
    labelZh: "默认指针",
    description: "标示指针处于待执行状态",
    primary: true,
  },
  pointer: {
    className: "sens-cursor-pointer",
    cssVar: "--sens-cursor-pointer",
    cssValue: "pointer",
    illustration: illust("pointer"),
    figma: "1123:160",
    group: "state",
    labelZh: "可点击",
    description: "标示可点击交互的对象",
    primary: true,
  },
  "not-allowed": {
    className: "sens-cursor-not-allowed",
    cssVar: "--sens-cursor-not-allowed",
    cssValue: "not-allowed",
    illustration: illust("not-allowed"),
    figma: "1119:2819",
    group: "state",
    labelZh: "禁用",
    description: "标示请求的操作不允许被执行",
  },
  text: {
    className: "sens-cursor-text",
    cssVar: "--sens-cursor-text",
    cssValue: "text",
    illustration: illust("text"),
    figma: "1123:163",
    group: "select",
    labelZh: "横向文字选择",
    description: "标示可编辑或选择的水平文本或控件",
    primary: true,
  },
  "vertical-text": {
    className: "sens-cursor-vertical-text",
    cssVar: "--sens-cursor-vertical-text",
    cssValue: "vertical-text",
    illustration: illust("vertical-text"),
    figma: "1123:161",
    group: "select",
    labelZh: "竖向文字选择",
    description: "标示可编辑或选择的垂直文本或控件",
    primary: true,
  },
  crosshair: {
    className: "sens-cursor-crosshair",
    cssVar: "--sens-cursor-crosshair",
    cssValue: "crosshair",
    illustration: illust("crosshair"),
    figma: "1123:164",
    group: "select",
    labelZh: "十字光标",
    description: "标示精准绘制或选取",
    primary: true,
  },
  move: {
    className: "sens-cursor-move",
    cssVar: "--sens-cursor-move",
    cssValue: "move",
    illustration: illust("move"),
    figma: "1145:160",
    group: "move",
    labelZh: "移动",
    description: "标示对象可移动，改变的是对象的位置（坐标值）",
    primary: true,
  },
  "no-drop": {
    className: "sens-cursor-no-drop",
    cssVar: "--sens-cursor-no-drop",
    cssValue: "no-drop",
    illustration: illust("no-drop"),
    /** 与 copy 同帧（规则稿移动次要态区 `1119:2856`），非笔误 */
    figma: "1119:2856",
    group: "move",
    labelZh: "禁止放下",
    description: "标示被移动的对象不允许在光标的当前位置被放下",
  },
  grab: {
    className: "sens-cursor-grab",
    cssVar: "--sens-cursor-grab",
    cssValue: "grab",
    illustration: illust("grab"),
    figma: "1123:155",
    group: "move",
    labelZh: "可抓取",
    description:
      "标示对象视图中的内容可移动，当在固定视图（例如地图）中平移内容时",
    primary: true,
  },
  grabbing: {
    className: "sens-cursor-grabbing",
    cssVar: "--sens-cursor-grabbing",
    cssValue: "grabbing",
    illustration: illust("grabbing"),
    figma: "1123:171",
    group: "move",
    labelZh: "抓取中",
    description: "标示对象视图中的内容正在平移",
    primary: true,
  },
  copy: {
    className: "sens-cursor-copy",
    cssVar: "--sens-cursor-copy",
    cssValue: "copy",
    illustration: illust("copy"),
    /** 与 no-drop 同帧（规则稿移动次要态区 `1119:2856`），非笔误 */
    figma: "1119:2856",
    group: "move",
    labelZh: "复制",
    description: "标示对象可复制",
  },
  "n-resize": {
    className: "sens-cursor-n-resize",
    cssVar: "--sens-cursor-n-resize",
    cssValue: "n-resize",
    illustration: illust("n-resize"),
    figma: "1119:3007",
    group: "resize",
    labelZh: "北方向调整",
    description: "标示对象可以在北方向改变尺寸",
  },
  "e-resize": {
    className: "sens-cursor-e-resize",
    cssVar: "--sens-cursor-e-resize",
    cssValue: "e-resize",
    illustration: illust("e-resize"),
    figma: "1119:3007",
    group: "resize",
    labelZh: "东方向调整",
    description: "标示对象可以在东方向改变尺寸",
  },
  "s-resize": {
    className: "sens-cursor-s-resize",
    cssVar: "--sens-cursor-s-resize",
    cssValue: "s-resize",
    illustration: illust("s-resize"),
    figma: "1119:3007",
    group: "resize",
    labelZh: "南方向调整",
    description: "标示对象可以在南方向改变尺寸",
  },
  "w-resize": {
    className: "sens-cursor-w-resize",
    cssVar: "--sens-cursor-w-resize",
    cssValue: "w-resize",
    illustration: illust("w-resize"),
    figma: "1119:3007",
    group: "resize",
    labelZh: "西方向调整",
    description: "标示对象可以在西方向改变尺寸",
  },
  "ne-resize": {
    className: "sens-cursor-ne-resize",
    cssVar: "--sens-cursor-ne-resize",
    cssValue: "ne-resize",
    illustration: illust("ne-resize"),
    figma: "1119:3007",
    group: "resize",
    labelZh: "东北方向调整",
    description: "标示对象可以在东北方向改变尺寸",
  },
  "nw-resize": {
    className: "sens-cursor-nw-resize",
    cssVar: "--sens-cursor-nw-resize",
    cssValue: "nw-resize",
    illustration: illust("nw-resize"),
    figma: "1119:3007",
    group: "resize",
    labelZh: "西北方向调整",
    description: "标示对象可以在西北方向改变尺寸",
  },
  "se-resize": {
    className: "sens-cursor-se-resize",
    cssVar: "--sens-cursor-se-resize",
    cssValue: "se-resize",
    illustration: illust("se-resize"),
    figma: "1119:3007",
    group: "resize",
    labelZh: "东南方向调整",
    description: "标示对象可以在东南方向改变尺寸",
  },
  "sw-resize": {
    className: "sens-cursor-sw-resize",
    cssVar: "--sens-cursor-sw-resize",
    cssValue: "sw-resize",
    illustration: illust("sw-resize"),
    figma: "1119:3007",
    group: "resize",
    labelZh: "西南方向调整",
    description: "标示对象可以在西南方向改变尺寸",
  },
  "ns-resize": {
    className: "sens-cursor-ns-resize",
    cssVar: "--sens-cursor-ns-resize",
    cssValue: "ns-resize",
    illustration: illust("ns-resize"),
    figma: "1119:3007",
    group: "resize",
    labelZh: "垂直调整",
    description: "标示对象可以在垂直方向改变尺寸",
  },
  "ew-resize": {
    className: "sens-cursor-ew-resize",
    cssVar: "--sens-cursor-ew-resize",
    cssValue: "ew-resize",
    illustration: illust("ew-resize"),
    figma: "1119:3007",
    group: "resize",
    labelZh: "水平调整",
    description: "标示对象可以在水平方向改变尺寸",
  },
  "nesw-resize": {
    className: "sens-cursor-nesw-resize",
    cssVar: "--sens-cursor-nesw-resize",
    cssValue: "nesw-resize",
    illustration: illust("nesw-resize"),
    figma: "1119:3007",
    group: "resize",
    labelZh: "东北&西南对角线调整",
    description: "标示对象可以在东北和西南方向改变尺寸",
  },
  "nwse-resize": {
    className: "sens-cursor-nwse-resize",
    cssVar: "--sens-cursor-nwse-resize",
    cssValue: "nwse-resize",
    illustration: illust("nwse-resize"),
    figma: "1119:3007",
    group: "resize",
    labelZh: "西北东南对角线调整",
    description: "标示对象可以在西北和东南方向改变尺寸",
  },
  "col-resize": {
    className: "sens-cursor-col-resize",
    cssVar: "--sens-cursor-col-resize",
    cssValue: "col-resize",
    illustration: illust("col-resize"),
    figma: "1119:3007",
    group: "resize",
    labelZh: "调整列宽",
    description: "标示对象可以在水平方向改变尺寸（列宽）",
  },
};

/** 规则优先主验 8 态 */
export const SENS_CURSOR_PRIMARY: SensCursorName[] = (
  Object.keys(SENS_CURSORS) as SensCursorName[]
).filter((name) => SENS_CURSORS[name].primary);

/** 真实生效的 `cursor` 值（系统关键字） */
export function sensCursorValue(name: SensCursorName): string {
  return SENS_CURSORS[name].cssValue;
}

/** 页签拖拽等「移动」场景统一入口 */
export const SENS_CURSOR_MOVE = SENS_CURSORS.move;
