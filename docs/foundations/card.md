# Card Foundation

> 主要来源：Figma `Sens.Design_卡片 v2.1_20230320`、`docs/foundations/color.md`、`docs/foundations/spacing.md`、`docs/foundations/radius.md`、`docs/foundations/size.md`、`docs/foundations/typography.md`。  
> 当前状态：基础样式收敛中；本文件先定义 Card 容器和组合示例的规则，不代表 `SensCard` 真实组件 API 已完成。

## 1. 定位

Card 是基础容器，不是单一 token scale。它由 Color、Spacing、Radius、Size、Typography、Shadow 等基础样式组合而成。

Card 负责定义可承载内容的外层容器样式，包括背景、边框、圆角、内边距和基础承载方式。它不负责决定具体业务字段，也不直接定义 DataSourceCard、EntryCard、审批卡片等业务组件的信息架构。

```text
Color / Spacing / Radius / Size / Typography / Shadow
  -> Card Foundation
  -> EntryCard / DataSourceCard / 业务卡片
```

## 2. 本轮范围

本轮优先收敛：

- 自由容器卡片：描边卡片、色块卡片。
- 标题区组合示例：用于说明 Card 可以承载标题区和内容区。
- Card 基础交互：自由卡片和网格视图卡片共用 default / hover / pressed。
- Card 异常与不可用状态：disabled / disabled hover / error 适用于所有 Card 类型。
- 选择型卡片激活态：仅在带 checkbox 的卡片中出现 selected / checked。

本轮暂不展开：

- EntryCard / DataSourceCard。
- 排序、拖拽、复杂操作区。
- 真实 `SensCard` API。

## 3. Figma 样张记录

| Figma 节点 | 名称 | 当前用途 |
|---|---|---|
| `1335:26192` | 自由容器卡片 | 描边 / 色块两种基础样式 |
| `1335:26193` | 序列关系型卡片 | 标题区 + 内容区组合示例 |
| `1335:26939` | 子组件标题区 | 标题区图标组合（drag / down / rename） |
| `1335:26176` | 自由容器卡片标题文字 | 样张标题文字参考 |
| `2117:66120` | Card 禁用 | 所有 Card 类型的 disabled 状态 |
| `2117:66121` | Card 禁用悬停 | 所有 Card 类型的 disabled hover 状态 |
| `2117:66577` | Card 报错 | 所有 Card 类型的 error 状态 |

`1335:26192` 是本轮最主要的依据。它展示了 Card 容器本体，而不是业务卡片。

## 4. 自由容器卡片

自由容器卡片只规定外层容器，不规定内部内容。

Card 不限制固定宽高：

- 宽度由外部布局、栅格和页面容器决定。
- 高度由内容、内部组件和业务场景自然撑开。
- Figma 中的 `384 × 216` 只是样张尺寸，不进入 Card 规则。

### 4.1 样式类型

| 类型 | 用途 | 规则 |
|---|---|---|
| 描边卡片 | 白底内容容器、信息面板、普通业务区块 | 白底 + 浅描边 |
| 色块卡片 | 弱层级区块、轻量承载区 | 灰色透明背景 + 无描边 |

### 4.2 数值与 Token 映射

| 使用点 | 设计语义 / Figma 变量 | Token 组合 / Handle | 数值 | 代码落地 | 状态 |
|---|---|---|---:|---|---|
| Card padding | Spacing Foundation | `spacing/4x` | 16 | `unit["spacing/4x"]` | 已映射 |
| Card 圆角 | Radius Foundation | `radius/l` | 6 | `unit["radius/l"]` | 已映射 |
| 描边 | `中性色/线/02_描边 @outline-color-transparent` | `outline-color-transparent @12%` | `rgba(0,21,64,0.12)` | `tokenRgba("outline-color-transparent", 0.12)` | 已映射 |
| 色块背景 | `中性色/背景/03_灰背景 @background-transparent-grey` | `background-transparent-grey @4%` | `rgba(0,34,102,0.04)` | `tokenRgba("background-transparent-grey", 0.04)` | 已映射 |
| 内容占位 | `基础色板/兰花紫/02` | `基础色板/兰花紫/02` | `#E7E0FF` | `getColorByPath("基础色板/兰花紫/02")` | 仅样张 |

紫色占位块只用于展示内容承载区域，不属于 Card 容器 token，也不代表业务内容必须使用兰花紫。

## 5. 标题区组合示例

标题区组合示例来自 `1335:26193`，用于说明 Card 内可以承载标题区和内容区。

它不是 Card 本体强制结构，也不代表 Card 必须内置标题、图标、操作或折叠能力。

| 使用点 | 设计语义 / Figma 变量 | Token 组合 / Handle | 数值 | 代码落地 | 状态 |
|---|---|---|---:|---|---|
| 标题 | Typography 四级标题 | `font-size/m + line-height/m + font-weight/medium` | `14 / 22 / 500` | `getTypographyToken(...)` | 已入库并由 helper 承接 |
| 操作文案 | Typography 正文内容 | `font-size/m + line-height/m + font-weight/regular` | `14 / 22 / 400` | `getTypographyToken(...)` | 已入库并由 helper 承接 |
| 标题区图标 | Size Foundation | `size/icon/m` | 16 | `SensIcon` + `size/icon/m` | 已映射 |
| 标题区高度 | Figma 样张 | 组件组合尺寸 | 36 | 当前仅样张 | 待确认是否进入组件规则 |
| 分割线 | `中性色/线/03_浅分割线 @divideline-color-transparent-light` | `divideline-color-transparent-light @8%` | `rgba(0,21,64,0.08)` | `tokenRgba("divideline-color-transparent-light", 0.08)` | 已映射 |

## 6. Typography 状态说明

Card 页面必须明确展示 Typography 语义和 token 组合，不能只展示代码 helper。

示例：

```text
Typography 正文内容
= font-size/m + line-height/m + font-weight/regular
= 14 / 22 / 400
```

当前状态：

- `font-size/s/m/l/xl/xxl/display`、`line-height/s/m/l/xl/xxl/display` 已进入 `tokens/source/foundations/typography.json`。
- `font-weight/regular/medium/semibold` 已进入 `tokens/source/foundations/typography.json`。
- `tokens.resolved.json` 已生成 `typography` 分组，Card 页面通过 `getTypographyToken(...)` 消费。

## 7. 状态边界

Card 基础交互规则适用于自由卡片和网格视图卡片。两者是结构差异，不是交互差异：

| 状态 | 背景 | 描边 | 投影 | 操作文案 | 来源 |
|---|---|---|---|---|---|
| default | `white` | `divider/color/outline/transparent` | 无 | `text-color-transparent` | Figma `2113:68064` |
| hover | `white` | `divider/color/outline/transparent` | `shadow/D3/down` | `link-color` | Figma `2117:66116` |
| pressed | `white` | `component-active` | `shadow/active-ring/functional` | `text-color-transparent` | Figma `2117:66117` |

交互规则：

- hover 不改变描边为主色，只加 D3 向下投影。
- pressed / 点击使用 `component-active` 描边和功能色 active ring。
- 普通自由卡片和网格视图卡片不定义 selected / 激活状态。
- `selected / checked` 只属于带 checkbox 的选择型卡片。

选择型卡片激活态：

| 状态 | 背景 | 描边 | 投影 | 适用场景 | 来源 |
|---|---|---|---|---|---|
| unchecked | `white` | `divider/color/outline/transparent` | 无 | 带 checkbox 的选择卡片未选中 | 推导自默认态 |
| checked | `component-active-background` | `component-active` | 无 | 带 checkbox 的选择卡片已选中 | Figma `2121:65389` |

选择型卡片 checked 不使用投影。它通过浅绿背景和 active 绿描边表达激活，不把普通 Card 变成 selected 容器。

异常与不可用状态适用于所有 Card 类型。自由卡片、网格视图卡片、选择型卡片都继承同一套容器状态规则，区别只在内部结构是否有标题区、分割线、操作区或 checkbox。

| 状态 | 背景 | 描边 | 投影 | 内部文字 / 操作 | 来源 |
|---|---|---|---|---|---|
| disabled | `background-grey` | `divider/color/light/transparent` | 无 | `text-color-transparent-disable @30%` | Figma `2117:66120` |
| disabled hover | `background-grey` | `divider/color/light/transparent` | `shadow/D3/down` | `text-color-transparent-disable @30%` | Figma `2117:66121` |
| error | `warning-light-background` | `warning-color` | 无 | 常规文字；框外警告文案使用 `warning-color` | Figma `2117:66577` |

报错状态的框外警告信息：

- 与 Card 容器间距为 `spacing/1x`。
- 警告图标使用 `warning-filled` + `size/icon/s` + `warning-color`。
- 警告文案使用 Typography 辅助文案：`font-size/s + line-height/s + font-weight/regular`。
- 警告文案颜色使用 `warning-color`。

后续进入真实组件阶段时，需要单独确认：

- 禁用态是否只影响容器，还是影响内部组件。
- `buildCardShadow` 或 Card 专属 shadow helper 是否需要存在。

## 8. 后续组件边界

后续如进入真实组件阶段，可以再拆：

| 组件 | 职责 | 当前状态 |
|---|---|---|
| `SensCard` | 基础容器，承接 padding / radius / border / background / shadow | 待定 |
| `SensCardTitle` | 标题区结构，承接标题、图标、操作 | 待定 |
| `SensCardGrid` | 卡片列表布局、列数、gap、响应式 | 待定 |
| `SensEntryCard` | 入口型卡片，用于数据源、应用、模板等入口 | 待定 |

## 9. 待补

- Icon Foundation 已承接 Card 标题区与报错图标；EntryCard / DataSourceCard 仍待后续。
- 标题区高度 36 是否需要进入组件规则。
- disabled 状态是否需要统一穿透到内部表单、按钮、菜单等子组件，需要在真实组件 API 阶段确认。
- EntryCard / DataSourceCard 是否继承 Card，或单独定义业务分支。
