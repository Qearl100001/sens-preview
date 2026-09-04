# 设计系统 skill · 基础组件：选择器 Select

> 基础层，对应 antd `Select` 的**触发框字段**（收起态），不是浮层面板。
> 样式走 `theme.ts` + 窄作用域 CSS 变量，**禁止硬编码 hex / rgba 字面量**；透明色一律 `tokenRgba(handle, α)`。
> 设计语义见 `select.design.md`；本文只写实现映射与约束。

> 浮层面板见 `dropdown-menu.md`（行底色 / 六面 / 搜索等**单一来源**在 `dropdown-menu.md` §二 2.3，本文仅引用）。

## 范围

| 本文包含（对照 design ✅） | 本文不包含 |
|---|---|
| §一 概念 · 框体 / 占位符 / 下拉图标（已实现子集） | 分组、虚拟滚动 |
| §二 1.1.1 基础型 · §二 1.2.1 个数型 · §二 1.1.3 复合型（工程 ⏳） | 浮层内部 token/样式重定义 |
| §三 重置 · 单选（`clearable` 工程实现） | Cascader / TreeSelect |
| 与浮层串联 | 修改 `buildAntdTheme` 换肤逻辑 |
| `SelectTriggerStatesPreview` / `SelectCountTriggerStatesPreview` | `search.css`、只读两档 |

## 通则

- **实现方式遵循 `conventions.md`**：真实组件不伪造 hover/click；预览板静态画矩阵格。
- **触发框字段色与 `input.md` 同源**（`INPUT_FIELD_TOKENS` → `components.Select`）。
- **触发框默认 32px**（单选 / 个数型 / 展示型单行）；展示型 `tagsWrap` 可长到 **128px**。**不暴露** `size="small"` / `controlHeightSM`（预览与 Showcase 均不传小尺寸）。
- **凡本规范没写明的点，agent 沿用 antd 默认**。

## 与 input.md 的关系

| 主题 | 引用 |
|---|---|
| 边框/背景/placeholder/disabled | `INPUT_FIELD_TOKENS` spread 至 `components.Select` |
| 锁高 **32px** | `useSensInputHeightStyle()` + `select-trigger.css` |
| 框内警告菱形 | `InsideErrorSuffix` + `ErrorDiamondIcon`（`input.md` §警告图标） |
| 聚焦外环 | `INPUT_ACTIVE_OUTLINE_COLOR` |
| 警告聚焦外环 | `warning-color-active-shadow` @20% → `colorError` 链 |

## 与 dropdown-menu.md 的边界

- **本文件**：触发框字段、`clearable`、警告、与浮层串联。
- **dropdown-menu.md**：浮层容器 / 选项行 10 格 / 六面 / 搜索；**行底色唯一定义**见 `dropdown-menu.md` §二 2.3。

---

## 一、概念

设计规格见 `select.design.md` §一。

### 1. 基础构成

#### 框体 Select Box ✅

设计规格见 `select.design.md` §一 1 · 框体。

**尺寸**

| 属性 | 值 |
|---|---|
| 控件高 | **32px** · `controlHeight`（展示型 `tagsWrap` 可长到 128） |
| 圆角 | **4px** · 与 `Input` 一致（`borderRadius`） |
| 小尺寸 | **不暴露**触发框 `size="small"` |

**主题接线**

```text
INPUT_FIELD_TOKENS（脚本层）→ components.Select 触发框子集
  colorBorder / hoverBorderColor / activeBorderColor
  activeOutlineColor ← INPUT_ACTIVE_OUTLINE_COLOR
  selectorBg / colorBgContainerDisabled / colorTextPlaceholder

antd Select genStyleHooks 不继承 components.Input → 必须显式 spread
```

浮层行 token（`SELECT_OPTION_ROW_TOKENS`）见 `dropdown-menu.md` §二 2.3 · 主题接线。

**透明色 α（与 Input 同源）**

| 用途 | Figma handle | α |
|---|---|---|
| 默认边框 | `divideline-color-transparent-dack` | 16% |
| 禁用边框 | `divideline-color-transparent-light` | 8% |
| 禁用悬停边框 | `line-color-transparent` | 6%（预览板） |
| 聚焦外环 | `component-active-shadow` | 20% |
| 警告聚焦外环 | `warning-color-active-shadow` | 20% |
| 禁用底 | `background-transparent-grey-hover` | 6% |
| 禁用悬停底 | `background-transparent-grey` | 4%（预览板） |
| placeholder | `text-color-transparent-disable` | 直读 handle（token 已含 α） |
| 禁用已选文字 | `text-color-transparent-disable` | 覆盖 antd `colorTextDisabled` |
| 已选文字（含激活/展开） | `text-color-transparent` | 覆盖 antd 展开改 placeholder 色 |
| 箭头禁用 | `icon-color-transparent-disable` | 直读 handle，禁止二次 `tokenRgba` |
| 箭头禁用悬停 | `icon-color-transparent-disable-hover` | 24%（预览板） |

**CSS 变量（`.sens-select-trigger`）**

`useSensSelectTriggerStyle` 注入：`--sens-select-hover-border-color`、`--sens-select-active-border-color`、`--sens-select-active-shadow`、`--sens-select-error-*`、`--sens-select-placeholder-color`、`--sens-select-disabled-text-color`、`--sens-select-border-disabled`、`--sens-select-arrow-color`、`--sens-select-arrow-color-disabled`、`--sens-select-icon-hover-color` 等（与 `SensInput` 字段色同源）。

**框内警告**

| 项 | 实现 |
|---|---|
| 组件 | `InsideErrorSuffix` 置于 `SensSelectTriggerSuffix` |
| 布局 | **箭头左、菱形右**，间距 `spacing/1x` = **4px** |
| 状态 | `warningPlacement="inside"` → `status="error"`；hover/focus 走 `colorError` 链 |

**框外警告**

`warningPlacement="outside"` + `help` → 框下 `InputHelpRow`（`.sens-input-help`）。包层 `.sens-select-trigger-field` 跟触发框同宽：定宽用 `widthPreset`；自适应 `width: fit-content` + min 148 / max 600。help 左对齐挂在框下，不反向撑开触发框。框与 help 间距 `spacing/vertical/1x` = **4px**；文案 12 / 行高 18。

**antd 映射**

| 能力 | antd | 说明 |
|---|---|---|
| 框体 | `className` + `variant="outlined"` | `.sens-select-trigger` |
| 高度 | 固定 **32px** | `controlHeight` |
| 箭头 | `suffixIcon` | `SensSelectTriggerSuffix` |
| 清空 | `allowClear` | `clearable` 时启用（§三 1） |
| 占位符 | `placeholder` | i18n `sensd-select-placeholder` |
| 浮层 | `popupRender` / `classNames.popup` | 逻辑不改；token 见 `dropdown-menu.md` |

**变体矩阵（触发框）**

```text
维度：警告（无 / 框内 / 框外）× 内容（未选 / 已选）
列：默认 / 悬停 / 聚焦 / 禁用 / 禁用悬停
→ 3 × 2 × 5 = 30 格（仅 32px，无小尺寸）
```

`SelectTriggerStatesPreview` + `select-trigger-preview.css`。

**预览 vs 真实组件**

| 层 | 职责 |
|---|---|
| `SensSelectDropdown` | 真实 `Select` + 触发框 props |
| `SelectTriggerStatesPreview` | 静态强制态矩阵 |
| `select-trigger-preview.css` | 仅预览 |

**与 Input 同源验收**

`SelectInputCompareDemo`（`r3-select-compare` / `r3-input-compare`）并排比对 Select 与 Input 字段色链。

#### 占位符 ✅

设计规格见 `select.design.md` §一 1 · 占位符。

| 项 | 实现 |
|---|---|
| 默认文案 | i18n `sensd-select-placeholder`（「请选择」） |
| 色 | 直读 `text-color-transparent-disable`（token 已含 α）→ `--sens-select-placeholder-color`；个数型确认空态画在触发框外层，同样走这条，不要用主文字色 |

#### 下拉图标 Icon ✅

设计规格见 `select.design.md` §一 1 · 下拉图标。

| 子项 | 状态 | 实现 |
|---|---|---|
| 箭头展开/收起 | ✅ | `ChevronDownIcon` / `ChevronUpIcon`（Figma `804:78` / `804:79`）；`SensSelectTriggerArrow` **双图标互斥**，**非** `rotate(180deg)` |
| 尺寸 | ✅ | **16×16** · `size/icon/m` |
| 色 | ✅ | `icon-color-transparent`；hover/展开**不变主色** |
| 禁用 | ✅ | `icon-color-transparent-disable`（直读，禁止二次 alpha） |
| Hook | ✅ | `useSensSelectTriggerSuffixProps`（**非** `useSensSelectSuffixProps`） |
| 清空 × | ✅ | 见 §三 1 |
| 加载 | ✅ | `loading` 时三角换成 `LoadingOutlined`（16，Figma `1227:8989`）；框体与禁用同一套灰；加载中不展开浮层 |
| 激活换搜索 | ⏳ | 未实现 |
| 预输入无三角 | ⏳ | 无预输入变体 |

### 2. 使用规则

设计规格见 `select.design.md` §一 2。工程：展开贴左 = antd `placement` 默认（未自定义）。同一时刻只允许一个 `SensSelectDropdown` 浮层打开；点开下一个会先关掉上一个（多选确认视为放弃，不提交草稿）。个数型确认会拦住 mousedown，不能指望 antd 点外关闭来互斥。

### 3. 边界限制

设计规格见 `select.design.md` §一 3。

**高度 ✅** — 见 §一 1 · 框体 · 尺寸。

**宽度 ✅**

| 类型 | 规则 |
|---|---|
| 固定宽 | 通用三档：**128px / 148px / 600px**；选中前后宽度保持一致 |
| 自适应宽 | `min-width: 148px`，`max-width: 600px`，根据内容宽度自适应 |
| 特殊固定宽 | 不提前泛化；遇到具体业务或组件场景时单独确认 |

**工程接口**

| 场景 | 实现 |
|---|---|
| 固定宽 | `SensSelectDropdown widthPreset="128" / "148" / "600"` |
| 自适应宽 | `SensSelectDropdown widthMode="adaptive"` |
| 表格筛选 | 固定 `148px`，避免空态 / 选中 / 可清空态宽度跳变 |
| 表单 | 通常使用自适应宽，或长配置项使用 `600px` 固定宽 |

**标签高度 / Tips / 穿梭框** — design ⏳，未实现。

---

## 二、选择器的搭配场景

设计规格见 `select.design.md` §二。

### 1. 下拉菜单

#### 1.1 单选（结果：文字）

##### 1.1.1 平铺 · 基础型 ✅

设计规格见 `select.design.md` §二 1.1.1 · 基础型。

工程：`SensSelectDropdown` 单选 + `dropdown-menu.md` §二 2.3 浮层；无左侧表意 Icon prop（业务勿擅自加）。

##### 1.1.1 平铺 · 简约型 ✅

设计规格见 `select.design.md` §二 1.1.1 · 简约型。

| 项 | 实现 |
|---|---|
| Prop | `appearance="simple"` |
| 框体 | 无边框、无填充；高 **22px**（`line-height/m`）；文案与箭头 gap `spacing/horizontal/1x` |
| 宽度 | 默认随内容 `fit-content` |
| 图标 | **不支持**左侧表意 Icon、框内警告菱形、清空 × |
| 文字/箭头色 | 同行同色。未选默认 `text-color-transparent-disable`；已选默认 `text-color-transparent`；悬停 `component-primary`；点击/激活 `component-active`；禁用同未选灰；禁用悬停 `text-color-transparent-disable-hover` |
| 警告 | 默认/悬停/点击走 `warning-color` 链；**激活（打开）改回 `component-active`**，箭头朝上。无框内菱形、无框外 help。**禁用 + 警告无对应组件** |
| 箭头 | 关闭 down / 激活 up，与基础型同一对图标；叠在文字右侧内边距上，**文字和箭头都可点开** |
| 浮层 | 单选下拉（无操作区），与基础型同一套 `sens-select-dropdown`；**最小宽 128px**，不跟触发框变窄 |
| 场景 | 配置面板、单元格内；**不可**用于列表页筛选行，不建议表单内 |

`SelectSimpleTriggerStatesPreview`：无 / 警告 × 未选 / 已选 × 默认 / 悬停 / 点击 / 激活 / 禁用 / 禁用悬停（警告行无禁用两列）。

##### 1.1.1 平铺 · 复合型 🔶

设计规格见 `select.design.md` §二 1.1.1 · 复合型。

**工程 ⏳**：无独立「复合选择器」封装；组成件 `SensSelectDropdown` / `SensInput` / `SearchInput` 均已存在，由业务页面组合（前缀/后缀/前+后缀）。

##### 1.1.1 平铺 · 组合型

设计规格见 `select.design.md` §二 1.1.1 · 组合型。**未实现**。

##### 1.1.2 树结构

设计规格见 `select.design.md` §二 1.1.2。**未实现**。

#### 1.2 多选

设计规格见 `select.design.md` §二 1.2。

##### 1.2.1 平铺 · 个数型 ✅

设计规格见 `select.design.md` §二 1.2.1 · 个数型。

| 项 | 实现 |
|---|---|
| Prop | `multiDisplay="count"`（不再用裸 `mode="multiple"` 当个数型） |
| 回显 | 「已选择 N 项」；`N > 999` 为「已选择 999+ 项」；点「完成」才写入 |
| i18n | `sensd-select-selectedCount`（Figma `${count}`，组件内替换） |
| 空态 | 「请选择」 |
| 宽度 | 表格筛选 / 狭小筛选区：`widthPreset="128"` / `"148"`；浮层最小 **320** |
| 高度 | **32px** 单行；不展示 tag |
| 左右内边距 | **12px** · `spacing/horizontal/3x`（覆盖 antd multiple 默认 3px） |
| 文案与箭头 | gap `spacing/horizontal/1x`；箭头距右缘同 12px |
| 图标 | **不支持**左侧表意 Icon |
| Hover Tips | 只在鼠标悬停触发框时出现；已选 ≤ 30 项时 `SensTips` 顿号连接 label，更长不挂，避免 999+ 卡死；下拉菜单打开不主动触发 Tips |
| 禁用 | `disabled`：灰底 / 浅边 / 禁用字色；回显仍为「已选择 N 项」 |
| 加载 | `loading`：与禁用同一套灰，右侧三角换成转圈；不展开浮层 |
| 重置 | 默认不开启（仅表格筛选行可用，本轮不做三角变重置） |
| 全选 / 完成 | 确认上屏模式中，点「全选」只改变浮层草稿；必须点「完成」才写入触发框和触发 `onChange`；「放弃」/点空白还原已提交值 |
| 浮层 | 复选行 + 全选操作条 +（可选）搜索 + 统计；选项列表最多 9.5 行；「放弃」/点空白还原，「完成」才 `onChange` |

`SelectCountTriggerStatesPreview`：128 / 148 × 未选 / 已选 × 7 态（默认 / 悬停 / 聚焦 / 禁用 / 禁用悬停 / 加载 / 加载悬停）。

##### 1.2.1 平铺 · 展示型 ✅

设计规格见 `select.design.md` §二 1.2.1 · 展示型。Figma `15533:56794`。

| 项 | 实现 |
|---|---|
| Prop | `multiDisplay="tags"` |
| 回显 | 框内 `SensTag` 可移除（`size="large"` 24px、中性底）；标签间距 `spacing/horizontal/1x` |
| 删标签 | 浮层关闭：立刻改已提交。浮层打开（确认）：触发框只显示已提交，标签仍保留关闭 Icon，但关闭能力禁用；菜单改草稿；点「完成」收起后上屏，「放弃」/点空白还原。浮层打开（实时）：标签关闭 Icon 可用，删除即时上屏 |
| 上屏 | 确认：点选择器 → 勾选 →「完成」收起 → 选择器才显示/更新。实时 `confirmMultiple={false}`：无操作栏、勾选即时上屏 |
| 空态 | 「请选择」 |
| 宽度 | 表单定宽单行 `widthPreset="320"`；多行 `widthPreset="600"`；也可 `widthMode="adaptive"`（min 148 / max 600） |
| 高度 | 默认 **32px** 单行：能放下的标签照常展示，长标签**文案**最大 **112px** 截断（整颗含 × 约 **146px**），放不下末尾 **`…共 N 项`**（N=已选总数，不是 `+N` 剩余数）。悬停 rest / 截断标签出 `SensTips`。`tagsWrap`：换行，min 32 / max **128**（Figma `15584:52911`），超出滚动，展示全部，不用 rest；箭头钉首行。框内警告须加宽右侧预留（箭头+菱形），避免 rest 叠菱形。Figma `15584:52705` / `15584:52711` / `15584:52788` |
| Tips | 只在鼠标悬停触发框、被截断标签或 rest 计数时出现；下拉菜单打开不主动触发 Tips，避免激活浮层时额外遮挡 |
| 禁用 / 加载 | 已选标签和关闭 Icon 都保留展示，但关闭 Icon 使用禁用视觉且不可操作；加载态不展开浮层 |
| 滚动与箭头 | 多行标签滚动区域只属于标签内容区，不占用右侧 suffix 区；箭头 / 警告图标固定在右侧，不因全选、滚动或标签数量变化而位移 |
| 图标 / 重置 | **不支持**（`clearable` 对展示型关闭） |
| 只读 | `readOnlyVariant="filled"` / `"plain"`。`filled` = 有背景只读；`plain` = 无背景 / 无边框 / 无箭头 / 不展开浮层的纯文本只读。当前 Demo 中「字段」场景复用 `plain` 能力，只表示字段承载场景暂未拆独立视觉，不代表「字段」是新的样式 token。空态「未设置」。截断时悬停 `SensTips` 展示全部顿号文案。可叠 `warningPlacement`：框内菱形 + 有背景粉底 `warning-light-background`；框外 help 在盒下，有背景保持只读灰底、不涂粉底。字色不改红。Figma `15533:58499` 等；有背景×框外稿面 `15533:58470` 为「无对应组件」占位，实现按框外语义对齐 Input |
| 浮层 | 确认模式：搜索 / 统计 / 复选 / 全选 / 放弃 / 完成。实时模式：无操作栏 |

###### 多选标签交互验收口径

- **确认上屏**：触发框展示已提交值；浮层打开后，搜索、勾选、取消、全选都只修改草稿；点「完成」才提交，点「放弃」或关闭浮层回到已提交值。
- **实时上屏**：无底部操作栏；勾选、取消、标签关闭 Icon 都即时修改已提交值。
- **禁用 / 加载**：标签仍可见，关闭 Icon 仍可见但不可点击；整体按禁用 / 加载视觉处理。
- **Tips**：只由触发框 hover、截断标签 hover、rest 计数 hover 触发；浮层打开不等于 Tips 打开。
- **滚动与箭头**：标签区滚动时，右侧箭头、加载图标和警告图标保持固定；滚动条位于标签内容区，不覆盖 suffix。

###### antd 承载边界

- Select 当前仍可由 antd Select 承载底层选择、搜索、虚拟列表和基础弹层能力。
- Sens 负责可见视觉、状态映射、`SensTag` 回显、`SensTips`、确认上屏、全选完成、滚动与 suffix 预留等规则。
- 禁止依赖 antd 默认颜色、间距、字号、圆角和 focus 投影作为最终视觉；这些必须走 Sens token / Sens 组件。
- `.ant-*` 覆盖必须限制在 `SensSelectDropdown` 私有作用域或状态矩阵预览作用域内；新增覆盖前先判断是否能通过 Sens token、组件 slot 或 wrapper class 解决。
- `!important` 只作为历史兼容债务保留，不作为新增实现手段；后续清理时需区分「生产必要覆盖」「状态矩阵强制态」「可删除债务」。
- 若后续出现树选择、级联、多列复杂选择、复杂键盘模型或弹层行为明显脱离 antd 默认能力，应重新评估是否拆成 Sens 自持组件。
- 树选择、级联、预输入不默认继续硬压当前 `SensSelectDropdown`：树选择需评估 `SensTreeSelect`，级联需评估 `SensCascader`，预输入需评估 `SensPreInputSelect` / `SensCreatableSelect`。只有当交互模型仍与 antd Select 基本一致、只是视觉换肤时，才可继续复用现有承载。

`SelectTagsTriggerStatesPreview`：320 × 未选 / 已选 × 7 态 + 只读两档 + 只读×警告四格。

##### 1.2.2 树结构

设计规格见 `select.design.md` §二 1.2.2。**未实现**。

### 2. 级联菜单 · 3. 预输入

设计规格见 `select.design.md` §二 2–3。**未实现**。

---

## 三、重置机制

设计规格见 `select.design.md` §三。

### 1. 单选 ⏳（`clearable` 工程 ✅）

`clearable` 是可选能力，不是所有 Select 默认开启。表单场景默认不启用，除非业务明确允许快速清空；列表 / 表格筛选等临时筛选条件场景可以启用。

| 项 | 实现 |
|---|---|
| Prop | `clearable`（默认 `false`）→ `allowClear={{ clearIcon: <SelectClearIcon /> }}` |
| 图标 | `SelectClearIcon`（Figma `1430:4796` · 与 Input `CloseCircleIcon` 同源） |
| 出现 | 有选中值 + **hover 触发框** |
| 行为 | `onChange(undefined)` + 关浮层 + `resetSearchOnClose` 重置浮层搜索 |
| 布局 | hover 时 × **盖住**右侧箭头（antd 默认同位） |

官方「仅列表页筛选 · hover 三角变**重置图标** · 热区单选区+重置区 4px」— **未还原**。

### 2. 多选

个数型可开 `clearable`：已提交值时 hover 触发框，× 盖箭头，立即清空已提交（不走草稿确认）。展示型不提供重置；标签 × 是逐项删除。表格筛选三角变重置仍 ⏳。

---

## 与《下拉菜单》的关系

设计规格见 `select.design.md` §与《下拉菜单》的关系。

### 串联

```text
点触发框 → onOpenChange(true)
  → dropdown-menu.md §二 2.1–2.3 / §三 3.1 mergedPopupRender
  → 单选：选选项 → antd onChange 回填 label → 关浮层
  → 多选个数型：草稿勾选；「完成」才 onChange / 回显；「放弃」或点空白还原
  → 多选展示型（确认）：触发框只绑已提交；点「完成」收起后才上屏；关闭时点标签 × 立刻改已提交
  → 多选展示型（实时 `confirmMultiple={false}`）：无操作栏，勾选即时上屏
  → 关浮层 → resetSearch()（resetSearchOnClose 默认 true）
```

`value` / `defaultValue` / `onChange` 透传 antd 受控/非受控语义。浮层 token 与选项行底色见 `dropdown-menu.md` §二 2.3（**不在此重复**）。

---

## Props 摘要

| Prop | 默认 | 说明 |
|---|---|---|
| `clearable` | `false` | 悬停显示清空 ×（§三 1） |
| `appearance` | — | `"simple"` 简约型（无边框，仅单选） |
| `multiDisplay` | — | `"count"` 个数型；`"tags"` 展示型标签。见 `dropdown-menu.md` |
| `confirmMultiple` | `true` | 多选完成才上屏（触发框只显示已提交）。`false`：无操作栏、即时上屏 |
| `tagsWrap` | `false` | 展示型多行换行（min 32 / max 128）。默认单行 + `…共 N 项` |
| `readOnlyVariant` | — | 展示型只读：`"filled"` / `"plain"`，对齐 Input；可叠警告 |
| `widthPreset` | — | `"128"` / `"148"` / `"320"` / `"600"` |
| `widthMode` | — | `"adaptive"`（min 148 / max 600） |
| `warningPlacement` | — | `inside` / `outside` |
| `help` / `warningMessage` | — | 同 `SensInput` |
| `searchable` 等浮层 props | `searchable` 默认 `false`，多选不再自动开启 | 见 `dropdown-menu.md` §Props |

## 工程落点

```
src/ui/SensSelectDropdown.tsx          # useSensSelectTriggerStyle + 触发框 + 浮层接线
src/ui/select-trigger.css
src/ui/select-trigger-preview.css
src/ui/FieldIcons.tsx                  # ChevronDown/Up、SelectClearIcon
src/ui/fieldIconProps.tsx              # useSensSelectTriggerProps / SensSelectTriggerSuffix
build-tokens.mjs                       # components.Select + INPUT_FIELD 子集
src/preview/pages/SelectShowcasePage.tsx
```
