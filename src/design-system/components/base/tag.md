# 设计系统 skill · 基础组件：标签 Tag

> **状态：多色交互态、移除细态、内部帮助 / 警告热区已接。** `SensTag` + `/components/tag`；彩色为固定色板、不换肤；叠加标签为纯展示；内部提示统一消费 `SensTips`。
> 设计语义与取舍以本文为准。
> 与 **徽标 Badge**（`badge.md`）不是同一组件：Badge 是角标/数字/状态点；Tag 是内容标记与可操作标签。

## 来源

| 资料 | 链接 / 位置 | 用途 |
|---|---|---|
| Sens.Design 标签 v2.1 | [Figma · 校准版画布](https://www.figma.com/design/o4ik4AviECk4q8OcZmPjak/Sens.Design_%E6%A0%87%E7%AD%BE-v2.1_20230324?node-id=2237-27039&m=dev) | 组件规范正文（定义 / 原则 / 类型 / 视觉 / 边界） |
| 4.2 尺寸 / 4.3 间距 | [Figma · 画板 18–19](https://www.figma.com/design/o4ik4AviECk4q8OcZmPjak/Sens.Design_%E6%A0%87%E7%AD%BE-v2.1_20230324?node-id=2251-35736&m=dev) | 大/小高度与字号、文案 max、组间距 |
| 定制色 · 标签 | `tokens/source/figma/Color.json` → `定制色/标签/*` | 叠加标签 + 多色系背景 / 文字悬停点击 |
| Size Foundation | `docs/foundations/size.md` §5 | Tag 尺寸（已与 4.2 对齐） |

文档目录（Figma）：一、定义 · 二、原则 · 三、类型 · 四、视觉样式（4.1 色彩 / 4.2 尺寸 / 4.3 间距）· 五、边界情况 · 六、参考文档。

## 通则

- **一个组件 + 属性**：对外只提供 `SensTag`，不拆成「展示标签 / 操作标签」两个组件名。六种 Figma 类型用 `variant` + `clickable` + `closable` 组合表达。
- **状态标签单独一类**：`variant="status"`，不并入多色。结构为 **状态色圆点 + 中性色文案**（无底、无交互）。五语义固定；仅「进行中」圆点带 `link-color` @20% 外描边；**无**可点击、可移除、禁用。
- **尺寸两档**：`size="large" | "small"`，默认 `large`；数值以 Figma 4.2 / 4.3 为准（见下节）。样张组件常画在 2×，读实例时 ÷2 再对照正文。
- **实现方式遵循 `conventions.md`**：真实组件 props + token；预览对照板用 `previewState` 静态画悬停/点击。
- 颜色走 `getColorByPath` / 中性 handle；禁止业务页面临时硬写 hex。**彩色标签为固定色板，不参与 Functional 换肤**（无语义 `@handle` 属预期）。

## 已确认决策

| 决策 | 结论 | 日期 |
|---|---|---|
| 组件形态 | 一个 `SensTag` + props | 2026-07-10 |
| 状态标签 | 在 Tag 内，`variant="status"` 单独分类 | 2026-07-10 |
| 尺寸 | `size: "large" \| "small"`，默认 `large`；按 Figma 4.2 / 4.3 核对写入 | 2026-07-10 |
| P0 范围 | 组件 + 预览挂载；status 先圆点+文案；侧栏文案「标签」 | 2026-07-10 |
| 状态五语义 | `status` 固定五值；圆点状态色、文案中性色；仅进行中外描边；无 clickable / closable / disabled | 2026-07-10 |
| 多色交互 | 仅 `clickable` 切悬停/点击；接 `背景/02|03` + `文字&图标`；中性可点悬停/点击走冰绽蓝；彩色不换肤 | 2026-07-10 |
| 移除图标 | 独立热区；默认 `icon-color-transparent`；悬停 `warning-color`；点击 `warning-color-active`；禁用走 icon disable α | 2026-07-10 |
| 内部热区 | 帮助 / 警告是标签内部独立热区，不新增“报错标签”类型；`clickable` 标签中不触发主点击 | 2026-07-30 |
| 叠加标签边界 | `variant="overlay"` 为纯展示，不消费图标 / 帮助 / 警告 / 禁用 / 加载 / 点击 / 移除 | 2026-07-30 |
| 加载态 | Tag 暂不提供 `loading`；不能用刷新图标替代加载图标，未来需 SensD 正式加载图标与规则后再评估 | 2026-07-30 |

## 尺寸与间距（Figma 4.2 / 4.3）

正文口径：大 / 小两种；大高度 24px、文字 14px；小高度 20px、文字 12px。同组标签横排或竖排间距均为 4px。

| `size` | 高度 | 字号 | 左右 padding | 内部 gap | 文案 max-width | close | 前导 icon |
|---|---|---|---|---|---|---|---|
| `large` | 24 | 14 | 8 | 4 | 112 | 14 | 16 |
| `small` | 20 | 12 | 6 | 4 | 96 | 12 | 14 |

高度固定，**无上下 padding**；垂直居中。

| 规则 | 值 / token | 说明 |
|---|---|---|
| 圆角 | `radius/s = 3` | 两档共用 |
| 组间距（横 / 竖） | `spacing/1x = 4` | 4.3：无论大小尺寸 |
| 大高度 | `size/component-height/s = 24` | 对应 `large` |
| 小高度 | `size/component-height/xs = 20` | 对应 `small` |
| 大字号 | `font-size/m = 14` | 对应 `large` |
| 小字号 | `font-size/s = 12` | 对应 `small` |
| 左右 padding large | `spacing/horizontal/2x = 8` | |
| 左右 padding small | `spacing/horizontal/1.5x = 6` | |
| 关闭 large / small | `size/icon/s` / `size/icon/xs` | |
| 状态圆点 large / small | `size/mini` / `size/2xs` | |

使用提示（Figma）：

- **大**：需要标签文字为 14px 的场景。
- **小**：需要标签文字为 12px；同级其他元素为 12px；前置为标题、标签作辅助信息。
- **文案过长**：默认按上表 max-width（可视情况调整）；显示不全用「…」，悬停用 Tips 展示全文。

## 多色 / 操作交互色（固定色板 · 不换肤）

仅 `clickable && !disabled` 时切换；纯展示、仅可移除保持默认。默认文案一律 `tokenRgba("text-color-transparent", 0.9)`；默认前导图标 `icon-color-transparent`。禁用态不允许用整颗 `opacity` 变淡，必须按文字 / 图标 token 单独处理。

| `color` | 默认 | 悬停 | 点击 | 禁用 | 禁用悬停 |
|---|---|---|---|---|---|
| 六色 | `定制色/标签/{色}/背景/01_默认` + 主文字 | `…/02_悬停` + `…/文字&图标/01_悬停` | `…/03_点击` + `…/文字&图标/02_点击` | `…/背景/01_默认` + `text-color-transparent-disable` | `…/背景/02_悬停` + `text-color-transparent-disable-hover` |
| `neutral` | `background-01-transparent` @0.08 + 主文字 | **冰绽蓝** `02` + `01_悬停` | **冰绽蓝** `03` + `02_点击` | `background-01-transparent` @0.08 + `text-color-transparent-disable` | `background-01-transparent` @0.08 + `text-color-transparent-disable-hover`（底不换冰绽蓝） |

预览板用 `previewState="default"|"hover"|"active"|"disabled"|"disabledHover"` 静态套色，不伪造真实伪类。

## 内部热区 / 警告图标

来自 Figma 交互画板：多色 / 操作标签可以有独立热区，文字、帮助、警告分别承接不同提示含义。这里不新增“报错标签”类型，而是在同一个 `SensTag` 上用 props 表达。

| 能力 | props | 行为 |
|---|---|---|
| 帮助说明 | `helpMessage` | 显示 `SensIcon name="help"`；hover / focus 展示 `SensTips`；独立热区；不触发标签主点击；禁用标签中仍保持 `icon-color-transparent` |
| 警告 / 报错 | `errorMessage` | 显示 `SensIcon name="feedback-error"`；hover / focus 展示 `SensTips`；颜色走 `warning-color`；独立热区；不触发标签主点击 |

帮助 / 警告和长文案均使用 `SensTips`，不使用浏览器原生 `title`，也不再使用 antd Tooltip 视觉层。保留 `helpMessage` / `errorMessage` 语义，由 Tag 决定热区和图标状态，由 Tips 决定浮层视觉与出现/消失。

`variant="status"` 或 `variant="overlay"` 时忽略 `helpMessage` / `errorMessage`。

## 移除图标色（独立热区 · design token）

关闭钮与标签体悬停无关。大 `size/icon/s`、小 `size/icon/xs`。资产：`SensIcon name="close"`（Figma 805:58；旧手写小叉子已删）。

| 态 | token |
|---|---|
| 默认 | `icon-color-transparent`（叠加：`white`） |
| 悬停 | `warning-color` |
| 点击 | `warning-color-active` |
| 禁用 | `tokenRgba("icon-color-transparent-disable", 0.4)` |
| 禁用悬停 | `tokenRgba("icon-color-transparent-disable-hover", 0.3)` |

预览板用 `previewCloseState`。

## 状态标签语义（固定 · design token）

| `status` | 文案 | 圆点 fill | 外描边 |
|---|---|---|---|
| `success` | 成功 | `success-color` | 无 |
| `processing` | 进行中 | `link-color` | `0 0 0 2px` + `tokenRgba("link-color", 0.2)`（仅此项） |
| `exception` | 异常 | `info-color` | 无 |
| `error` | 失败 | `warning-color` | 无 |
| `invalid` | 失效 | `text-color-disable` | 无 |

- **文案色**：`large` → `tokenRgba("text-color-transparent", 0.9)`（中性色/文字/01_主要）；`small` → `tokenRgba("text-sub-color-transparent", 0.58)`（中性色/文字/03_辅助）
- **高度**：状态标签也跟随 `size` 高度，`large = 24`、`small = 20`；圆点与文案在固定高度内垂直居中。
- 圆点 / 文案均经 `getColorToken` / `tokenRgba`，禁止硬写 hex
- `variant="status"` 时忽略 `color` / `clickable` / `closable` / `disabled` / `icon` / `extra`
- `variant="overlay"` 时忽略 `color` / `clickable` / `closable` / `disabled` / `icon` / `extra` / `helpMessage` / `errorMessage`

padding / max-width 中 max-width 仍为组件专属数字；其余尺寸已挂 `unit.json` 通用 token。不手改生成物。

## 六种类型 → 属性对照

| Figma 类型 | `variant` | `color` / `status` | `clickable` | `closable` | `size` | 典型场景 |
|---|---|---|---|---|---|---|
| 3.1 多色标签 | `multicolor` | `color` 必选色系 | `false` | `false` | `large` / `small` | 卡片分类、beta、内容标记 |
| 3.2 叠加标签 | `overlay` | 叠加专用（深色半透明） | `false` | `false` | `large` / `small` | 压在图片上的说明 |
| 3.3 状态标签 | `status` | `status` 五语义 | 无 | 无 | `large` / `small` | 表格/详情页对象状态 |
| 3.4 可点击标签 | 多用 `multicolor` 或中性 | `color` | `true` | `false` | `large` / `small` | 筛选芯片、可点分类 |
| 3.5 可移除标签 | 多用中性 / 多色 | `color` | `false` | `true` | `large` / `small` | 输入框已选条件 |
| 3.6 可点击&可移除 | 同上 | `color` | `true` | `true` | `large` / `small` | 可点又可删 |

Figma 组件名对照：`展示/多色标签` · `展示/叠加标签` · `展示/状态标签` · `操作/可点击标签` · `操作/可移除标签` · `操作/可点击&可移除标签`；子件含 `【子组件】/移除图标` 等。

## SensTag API

```ts
type TagVariant = "multicolor" | "overlay" | "status";

type TagColor =
  | "neutral" | "red" | "yellow" | "green" | "cyan" | "blue" | "purple";

type TagStatus =
  | "success" | "processing" | "exception" | "error" | "invalid";

type TagSize = "large" | "small";

type SensTagProps = {
  variant: TagVariant;
  color?: TagColor;       // 非 status
  status?: TagStatus;     // 仅 status，默认 success
  size?: TagSize;
  clickable?: boolean;    // status / overlay 忽略
  closable?: boolean;     // status / overlay 忽略
  icon?: React.ReactNode; // status / overlay 忽略
  extra?: React.ReactNode;
  helpMessage?: React.ReactNode;  // status / overlay 忽略；帮助图标热区
  errorMessage?: React.ReactNode; // status / overlay 忽略；警告 / 报错图标热区
  onClick?: () => void;
  onClose?: () => void;
  disabled?: boolean;     // status / overlay 忽略
  children?: React.ReactNode;
};
```

### 属性说明

| 属性 | 含义 | 备注 |
|---|---|---|
| `variant` | 样子：多色 / 叠加 / 状态 | 状态必须单独取值 `status` |
| `color` | 多色色系 | status 勿用 |
| `status` | 五语义 | 仅 `variant="status"`；色固定 |
| `size` | `large` \| `small` | 默认 `large` |
| `clickable` | 整颗可点 | status / overlay 无；与 `closable` 可组合 → 3.4 / 3.6 |
| `closable` | 显示关闭并触发 `onClose` | status / overlay 无；对应 3.5 / 3.6 |
| `icon` / `extra` | 前导图标 / 补充内容 | status / overlay 不用 |
| `disabled` | 禁用 | status / overlay 无；多色禁用不使用整颗 opacity |
| `helpMessage` | 帮助图标热区 | status / overlay 无；真实 Tips 浮层待统一组件 |
| `errorMessage` | 警告 / 报错图标热区 | status / overlay 无；不是独立“报错标签”类型 |

## 与 Badge 的边界

| | Tag | Badge |
|---|---|---|
| 用途 | 内容标记、筛选条件、状态文案标签 | 角标数字、弱化数字、状态点 |
| 典型位置 | 卡片标题旁、列表字段、输入框内 | 导航项、Tab、按钮角上 |
| 组件 | `SensTag` | `SensBadge` |

业务 beta（如数据源入口卡）语义上属 **多色标签**（山水蓝），应使用 `SensTag variant="multicolor" color="cyan" size="small"`，不在业务页面内联样式。

## 色彩（仅登记）

| 分组 | 现状 | ready |
|---|---|---|
| 叠加标签 | `@tag-default-background` + 0.65 透明 | Half Ready |
| 多色系（含悬停/点击/禁用） | `定制色/标签/{色系}/背景/01|02|03` + `文字&图标/01|02`；禁用文字 / 图标走 `text-color-transparent-disable(-hover)`；固定色板 | Ready（固定，无 handle） |
| 中性底 / 可点交互 | 默认 `background-01-transparent` @0.08；可点悬停/点击走冰绽蓝 path | Ready（固定） |
| 状态五语义 | 圆点状态色；文案中性；进行中外描边 `link-color` @0.2 | Ready（固定） |
| 是否参与功能色换肤 | **彩色 / 中性标签不换肤**；状态不换肤；叠加 To Confirm | 否（彩色已确认） |

详细映射见 `docs/foundations/theme-skinning.md` §12.5。

## 待补

- [x] 核对 Figma **4.2 尺寸**、**4.3 间距**，写入 `size` 枚举
- [x] P0：实现 `SensTag` + 预览页 `/components/tag` + 侧栏「标签」
- [x] 状态五语义固定色；无点击/移除/禁用；Demo 切换语义
- [x] 多色交互：`背景/02|03` + `文字&图标`；中性可点走冰绽蓝；禁用 / 禁用悬停按 Figma token，不整颗 opacity；预览静态矩阵；彩色不换肤
- [x] 叠加标签边界：纯展示，不消费图标 / 帮助 / 警告 / 禁用 / 加载 / 点击 / 移除
- [x] 移除图标交互：默认 / 悬停警告红 / 点击深红 / 禁用细态（大+小）；资产 `SensIcon name="close"`
- [x] 内部热区：`helpMessage` / `errorMessage` 图标与点击阻断；真实 `SensTips` 浮层已接入
- [x] 替换 `DataSourceEntryCard` 内联 beta
- [ ] Tag 加载态：暂不提供；不能用刷新图标替代加载图标，等 SensD 正式加载规则后再评估
- [ ] 抽取 **一、定义 / 二、原则** 正文进本文
- [x] Tips 承载：帮助 / 警告图标 hover / focus 展示 `SensTips`；长文案不再使用原生 `title` 或 antd Tooltip

## 代码入口

```text
src/ui/SensTag.tsx
src/preview/pages/TagShowcasePage.tsx
src/design-system/components/base/tag.md   # 本文
```
