# 设计系统 skill · 基础组件：选择器 Select

> 基础层，对应 antd `Select` 的**触发框字段**（收起态），不是浮层面板。
> 样式走 `theme.ts` + 窄作用域 CSS 变量，**禁止硬编码 hex / rgba 字面量**；透明色一律 `tokenRgba(handle, α)`。
> 设计语义见 `select.design.md`；本文只写实现映射与约束。

> 浮层面板见 `dropdown-menu.md`（行底色 / 六面 / 搜索等**单一来源**在 `dropdown-menu.md` §二 2.3，本文仅引用）。

## 范围

| 本文包含（对照 design ✅） | 本文不包含 |
|---|---|
| §一 概念 · 框体 / 占位符 / 下拉图标（已实现子集） | 多选 tag/计数、分组、虚拟滚动 |
| §二 1.1.1 基础型 · §二 1.1.3 复合型（工程 ⏳） | 浮层内部 token/样式重定义 |
| §三 重置 · 单选（`clearable` 工程实现） | Cascader / TreeSelect |
| 与浮层串联 | 修改 `buildAntdTheme` 换肤逻辑 |
| `SelectTriggerStatesPreview` 触发框矩阵 | `search.css`、只读两档 |

## 通则

- **实现方式遵循 `conventions.md`**：真实组件不伪造 hover/click；预览板静态画矩阵格。
- **触发框字段色与 `input.md` 同源**（`INPUT_FIELD_TOKENS` → `components.Select`）。
- **触发框仅 32px**；**不暴露** `size="small"` / `controlHeightSM`（预览与 Showcase 均不传小尺寸）。
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
| 控件高 | **32px** · `controlHeight` |
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
| placeholder | `text-color-transparent-disable` | 30% |
| 箭头禁用 | `icon-color-transparent-disable` | 30% |
| 箭头禁用悬停 | `icon-color-transparent-disable-hover` | 24%（预览板） |

**CSS 变量（`.sens-select-trigger`）**

`useSensSelectTriggerStyle` 注入：`--sens-select-hover-border-color`、`--sens-select-active-border-color`、`--sens-select-active-shadow`、`--sens-select-error-*`、`--sens-select-placeholder-color`、`--sens-select-border-disabled`、`--sens-select-arrow-color`、`--sens-select-icon-hover-color` 等（与 `SensInput` 字段色同源）。

**框内警告**

| 项 | 实现 |
|---|---|
| 组件 | `InsideErrorSuffix` 置于 `SensSelectTriggerSuffix` |
| 布局 | **箭头左、菱形右**，间距 `spacing/1x` = **4px** |
| 状态 | `warningPlacement="inside"` → `status="error"`；hover/focus 走 `colorError` 链 |

**框外警告**

`warningPlacement="outside"` + `help` → 框下 `InputHelpRow`（`sens-select-help`）。

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
维度：警告（无 / 框内）× 内容（未选 / 已选）
列：默认 / 悬停 / 聚焦 / 禁用 / 禁用悬停
→ 2 × 2 × 5 = 20 格（仅 32px，无小尺寸）
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
| 色 | `text-color-transparent-disable` @30% → `--sens-select-placeholder-color` |

#### 下拉图标 Icon ✅

设计规格见 `select.design.md` §一 1 · 下拉图标。

| 子项 | 状态 | 实现 |
|---|---|---|
| 箭头展开/收起 | ✅ | `ChevronDownIcon` / `ChevronUpIcon`（Figma `804:78` / `804:79`）；`SensSelectTriggerArrow` **双图标互斥**，**非** `rotate(180deg)` |
| 尺寸 | ✅ | **16×16** · `size/icon/m` |
| 色 | ✅ | `icon-color-transparent`；hover/展开**不变主色** |
| 禁用 | ✅ | `icon-color-transparent-disable` @30% |
| Hook | ✅ | `useSensSelectTriggerSuffixProps`（**非** `useSensSelectSuffixProps`） |
| 清空 × | ✅ | 见 §三 1 |
| 加载 | 🔶 | `loading` 透传 antd 默认 spinner；无显式「三角↔加载」切换 |
| 激活换搜索 | ⏳ | 未实现 |
| 预输入无三角 | ⏳ | 无预输入变体 |

### 2. 使用规则

设计规格见 `select.design.md` §一 2。工程：展开贴左 = antd `placement` 默认（未自定义）。

### 3. 边界限制

设计规格见 `select.design.md` §一 3。

**高度 ✅** — 见 §一 1 · 框体 · 尺寸。

**宽度 ⏳**

| 项 | 现状 |
|---|---|
| design 建议 | min **128px** / max **600px** |
| 组件 | `SensSelectDropdown` **无**内置 `minWidth`/`maxWidth` |
| 预览 | `SelectTriggerStatesPreview` inline `style` 含 128/600（**仅矩阵 demo**，非组件契约） |
| 业务 | 调用方 `style` / `minWidth` / `maxWidth`（同 `input.md` 惯例） |

**标签高度 / Tips / 穿梭框** — design ⏳，未实现。

---

## 二、选择器的搭配场景

设计规格见 `select.design.md` §二。

### 1. 下拉菜单

#### 1.1 单选（结果：文字）

##### 1.1.1 平铺 · 基础型 ✅

设计规格见 `select.design.md` §二 1.1.1 · 基础型。

工程：`SensSelectDropdown` 单选 + `dropdown-menu.md` §二 2.3 浮层；无左侧表意 Icon prop（业务勿擅自加）。

##### 1.1.1 平铺 · 简约型

设计规格见 `select.design.md` §二 1.1.1 · 简约型。**未实现**。

##### 1.1.1 平铺 · 复合型 🔶

设计规格见 `select.design.md` §二 1.1.1 · 复合型。

**工程 ⏳**：无独立「复合选择器」封装；组成件 `SensSelectDropdown` / `SensInput` / `SearchInput` 均已存在，由业务页面组合（前缀/后缀/前+后缀）。

##### 1.1.1 平铺 · 组合型

设计规格见 `select.design.md` §二 1.1.1 · 组合型。**未实现**。

##### 1.1.2 树结构

设计规格见 `select.design.md` §二 1.1.2。**未实现**。

#### 1.2 多选

设计规格见 `select.design.md` §二 1.2。**未实现**。

### 2. 级联菜单 · 3. 预输入

设计规格见 `select.design.md` §二 2–3。**未实现**。

---

## 三、重置机制

设计规格见 `select.design.md` §三。

### 1. 单选 ⏳（`clearable` 工程 ✅）

| 项 | 实现 |
|---|---|
| Prop | `clearable`（默认 `false`）→ `allowClear={{ clearIcon: <SelectClearIcon /> }}` |
| 图标 | `SelectClearIcon`（Figma `1430:4796` · 与 Input `CloseCircleIcon` 同源） |
| 出现 | 有选中值 + **hover 触发框** |
| 行为 | `onChange(undefined)` + 关浮层 + `resetSearchOnClose` 重置浮层搜索 |
| 布局 | hover 时 × **盖住**右侧箭头（antd 默认同位） |

官方「仅列表页筛选 · hover 三角变**重置图标** · 热区单选区+重置区 4px」— **未还原**。

### 2. 多选

设计规格见 `select.design.md` §三 2。**未实现**。

---

## 与《下拉菜单》的关系

设计规格见 `select.design.md` §与《下拉菜单》的关系。

### 串联

```text
点触发框 → onOpenChange(true)
  → dropdown-menu.md §二 2.1–2.3 / §三 3.1 mergedPopupRender
  → 选选项 → antd onChange 回填 label
  → 关浮层 → resetSearch()（resetSearchOnClose 默认 true）
```

`value` / `defaultValue` / `onChange` 透传 antd 受控/非受控语义。浮层 token 与选项行底色见 `dropdown-menu.md` §二 2.3（**不在此重复**）。

---

## Props 摘要

| Prop | 默认 | 说明 |
|---|---|---|
| `clearable` | `false` | 悬停显示清空 ×（§三 1） |
| `warningPlacement` | — | `inside` / `outside` |
| `help` / `warningMessage` | — | 同 `SensInput` |
| `searchable` 等浮层 props | — | 见 `dropdown-menu.md` §Props |

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
