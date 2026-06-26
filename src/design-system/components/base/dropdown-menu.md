# 设计系统 skill · 基础组件：下拉菜单 Dropdown Menu

> 基础层：antd `Select` **浮层层**（`popupRender` / `styles.popup`）+ 动作菜单浮层（`SensDropdownMenu`）。
> 样式走 `theme.ts` + 窄作用域 CSS 变量，**禁止硬编码 hex / rgba 字面量**；透明色一律 `tokenRgba(handle, α)`。
> 设计语义见 `dropdown-menu.design.md`；本文只写实现映射与约束。

## 范围

| 本文包含（对照 design ✅） | 本文不包含 |
|---|---|
| §二 2.1 搜索条 · §二 2.2 统计区 · §二 2.3 内容模块（选择器浮层选项行） | Select **触发框** → `select.md` |
| §三 3.1 交互（状态机 / 六面 / 高亮 / 过滤） | 多选、分组、级联、树形（design ⏳） |
| §四 4.1 常规（两条触发路径） | **统一异常状态组件**（页面级矩阵 — 整体滞后） |
| §五 5.2 单选收回 | **网络异常** Figma `4381:14801`（归未来异常状态规范） |
| `SensSelectDropdown` popup + `SensDropdownMenu` 动作菜单 | 修改 `buildAntdTheme` 换肤逻辑 |

## 通则

- **实现方式遵循 `conventions.md`**：真实组件不伪造 hover/click；预览板静态画矩阵格。
- **浮层仅单一尺寸**：`optionHeight: **34**`；**无** `size="small"` / `controlHeightSM`。
- **换肤**：不动 `buildAntdTheme`。选择器浮层已选中三档行底走 `getFunctionalColors(skin)`；**勾选色固定中性图标，不换肤**。
- **凡本规范没写明的点，agent 沿用 antd 默认**；与 antd 不一样处必须在此写死。

## 与 search.md 的边界

- **本文件**：浮层内搜索编排、六面、统计、空态、选项过滤与高亮。
- **search.md**：搜索框本体（实时·简约 minimal）；浮层内职责分界见 §二 2.1。

## 与 select.md 的边界

- **本文件**：浮层面板 token / 选项行 / 搜索六面。
- **select.md**：触发框字段、清空、与浮层串联；见 `select.md` §串联。

---

## 一、定义

设计规格见 `dropdown-menu.design.md` §一。

工程载体：`SensSelectDropdown` 的 portaled popup（`.sens-select-dropdown`）+ 动作菜单 `SensDropdownMenu`（`.sens-dropdown-menu-overlay`，非 `.ant-select-dropdown` 内）。

---

## 二、基础构成

设计规格见 `dropdown-menu.design.md` §二。

### 2.1 搜索条 ✅

设计规格见 `dropdown-menu.design.md` §二 2.1。

| 项 | Token / 实现 |
|---|---|
| 组件 | `SelectDropdownSearch` → 薄封装 `MinimalSearchField`（`showCreate={false}`） |
| 变体 | 实时·简约 · 见 `search.md` §嵌入浮层 |
| 行高 | **32px**（简约搜索交互区；底部分割线另计 1px） |
| 宽度 | 浮层内 **100% 通栏**；文案/图标内缩 `spacing/horizontal/3x` = **12px**（`search.css` minimal） |
| 防抖 | **300ms** · `searchDebounce` 默认 |
| 浮层顶（可搜索） | **0px** · `.sens-select-dropdown--searchable` 覆盖上内边距 |
| 统计间距 | 搜索底部分割线 →「共 n 条」**6px**（`spacing/1x + spacing/0.5x`）；统计 → 首条 **0px** |
| 底部分隔 | minimal **自有**底线；浮层内**不**再加横线 |
| 占位符 | i18n `sensd-selectPanel-searchPlaceholder` |
| 返回 | 有有效输入时 `onBack` → `resetSearch` |

**antd 映射（R2）**

| 能力 | antd | 说明 |
|---|---|---|
| 顶栏搜索 | `popupRender` | **不用**内置 `showSearch` input |
| 本地过滤 | 外部 filter 后传 `options` | `filterOption={false}`；`showSearch={false}` when `searchable` |
| 远程 | `onSearch` + 受控 `options` + `loading` | 见 §三 3.1 remote |

### 2.2 统计区 ✅

设计规格见 `dropdown-menu.design.md` §二 2.2。

| 场景 | 文案 key | 实现 |
|---|---|---|
| 未搜索 | `sensd-selectPanel-totalCount` | 「共 **N** 条数据」 |
| 有结果 | `sensd-selectPanel-searchCount` | 「共找到 **N** 条」 |

| 项 | 值 |
|---|---|
| 色 | `text-sub-color-transparent` @ **58%** → `--sens-select-dropdown-stats-color` |
| 间距 | 见 §二 2.1 统计间距 |

> 实现侧：`searchable` 时统计恒显；与 design「≥9 条建议出现」差异以 design 为准。

### 2.3 内容模块（单选行）✅

设计规格见 `dropdown-menu.design.md` §二 2.3。

#### 术语（工程）

| 说法 | 含义 |
|---|---|
| **已选中** | `ant-select-item-option-selected`；行默认静止态底 = `component-active-background` + 右侧勾选 |
| **点击** | 鼠标按下瞬间 = CSS **`:active`**，**不是** `option-active` |
| `option-active` | antd/rc 键盘聚焦类；底色与**未选中悬停**同源（6% 灰），不单独占矩阵列 |

#### 浮层容器

| 属性 | Token / 实现 |
|---|---|
| 背景 | `white` → `colorBgContainer` |
| 圆角 | `radius/m` → `borderRadius`（**4px**） |
| 投影 | **`SHADOW_D4`** = `buildShadowD4()`；与 `components.Button.shadowFloating` 同源 |
| 上内边距 | **6px** = `spacing/1x` + `spacing/0.5x` → `popupPaddingBlockStart` |
| 下内边距 | **10px** = `spacing/vertical/2.5x` → `popupPaddingBlockEnd` |
| 左右内边距 | **0**（通栏） | `padding-inline: 0` 覆盖 antd `paddingXXS` |

Figma `17767:72632`。

#### 选项行

| 项 | 值 |
|---|---|
| 行高 | **34px** · `optionHeight: 34`（浮层专有，与触发框 32px 无关） |
| 尺寸 | **仅单一尺寸**，浮层无大/小两档 |
| 布局 | **通栏**；文案/勾选行内水平缩进 **12px** |
| 行内上下内边距 | **6px**（配合 14px/22px 正文凑满 34px） |
| `optionPadding` | **`6px 12px`** |

#### 选项底色（10 格矩阵）

> **行底 token**：`SELECT_OPTION_ROW_TOKENS`（共享层）；动作菜单行底**同源数值、独立 CSS 变量**，见 §四 4.1。

**未选中**

| 状态 | 背景 | 实现 |
|---|---|---|
| 默认 | `white` | `colorBgContainer` |
| 悬停 | `background-transparent-grey-hover` @ **6%** | `tokenRgba(..., 0.06)` → `--sens-select-option-hover-bg` |
| 点击 | `background-01-transparent` @ **8%** | `tokenRgba(..., 0.08)` → `--sens-select-option-click-bg` |
| 禁用 · 默认 | `white` | 字 `colorTextDisabled` |
| 禁用 · 悬停 | `background-transparent-grey-hover` @ **6%** | 同上 |

**已选中（浅功能色底 · 随主题色换肤 · 右侧勾选）**

| 状态 | 背景 | 实现 |
|---|---|---|
| 默认 | `component-active-background` | `optionSelectedBg` + CSS 变量（换肤） |
| 悬停 | `component-active-hover-background` | `optionSelectedHoverBg` |
| 点击 | `component-active-click-background` | `optionSelectedActiveBg` |
| 禁用 · 默认 | `white` | 覆盖 antd 选中禁用灰底 |
| 禁用 · 悬停 | `background-transparent-grey-hover` @ **6%** | `tokenRgba(..., 0.06)` |

#### 文字与勾选

| 元素 | 颜色 |
|---|---|
| 选项文字（未禁用） | 正文色 |
| 选项文字（禁用） | 禁用灰 |
| 勾选（已选中 · 默认/悬停/点击） | `icon-color-transparent` → `--sens-select-option-check-color`（**不换肤**） |
| 勾选（已选中 · 禁用/禁用悬停） | `icon-color-transparent-disable` → `--sens-select-option-check-color-disabled` |

#### 勾选标记

| 项 | 值 |
|---|---|
| 图标 | `SelectCheckIcon` · `FieldIcons.tsx` |
| Figma | `17694:64400` / `3729:15820` |
| 尺寸 | `size/icon/m`（**16×16**） |
| 位置 | **永远最右**，距浮层右缘 **12px**（= 行 `padding-inline`） |

#### antd 映射（选项行）

| 能力 | antd | 说明 |
|---|---|---|
| 浮层样式 | `classNames.popup` + `styles.popup` | 注入 CSS 变量（portaled） |
| 已选中行 | `.ant-select-item-option-selected` | 默认底 `optionSelectedBg` |
| 未选中悬停 | `:hover` | `--sens-select-option-hover-bg` |
| 未选中点击 | `:active` | `--sens-select-option-click-bg` |
| 键盘聚焦 | `.ant-select-item-option-active` | `optionActiveBg` = 未选中 hover 同色 |
| 勾选 | `optionRender` + `SelectCheckIcon` | 见上表 |
| 演示载体 | `<Select options={...} />` | 矩阵可用假触发框仅承载浮层 |

#### 主题接线

`Select` **不继承** `components.Input` / `Button`。脚本层 **`SELECT_OPTION_ROW_TOKENS`** + **`components.Select` 独立块**。

```text
SELECT_OPTION_ROW_TOKENS → components.Select
  optionHeight: 34
  optionActiveBg:      tokenRgba(background-transparent-grey-hover, 0.06)
  optionSelectedBg:    component-active-background
  optionHoverBg / optionClickBg / optionSelectedHoverBg / optionSelectedActiveBg (CSS 扩展)
  popupShadow:         SHADOW_D4
  popupPaddingBlockStart: 6px
  popupPaddingBlockEnd:   10px
  optionPadding:       6px 12px
```

#### CSS 变量（`.sens-select-dropdown`）

```text
--sens-select-option-selected-bg / -hover-bg / -active-bg  ← getFunctionalColors(skin)
--sens-select-option-check-color / -disabled               ← 中性图标（不换肤）
--sens-select-option-hover-bg / -click-bg
--sens-select-popup-shadow / -radius
--sens-select-popup-padding-block-start / -end             ← 6px / 10px
--sens-select-option-padding-inline / -block               ← 12px / 6px
--sens-select-dropdown-stats-color / -empty-desc-color     ← text-sub @58%
--sens-select-dropdown-stats-padding-block-start           ← 6px
```

#### 变体矩阵（选项行）

```text
行：未选中 / 已选中
列：默认 / 悬停 / 点击 / 禁用 / 禁用悬停
→ 2 × 5 = 10 格
```

`SelectDropdownStatesPreview` + `select-dropdown-preview.css`（不污染全局 `.ant-select-dropdown`）。

#### 预览 vs 真实组件

| 层 | 职责 |
|---|---|
| `SensSelectDropdown` | `Select` + `popup` 样式/变量 + `optionRender` 勾选 |
| `SelectDropdownStatesPreview` | 10 格静态样张 |
| `select-dropdown-preview.css` | 仅预览强制态 |

#### 共享行底层（动作菜单复用）

动作菜单与选择器浮层**共用**行高 34px、内边距 6×12、容器上 6 / 下 10 / 左右 0、D4 投影、未选中 hover 6% / active 8% 灰底数值；动作菜单通过 `useSensDropdownMenuStyle` + `dropdown-menu.css` 独立 scoped 变量实现，**不**挂 `.sens-select-dropdown`。

### 2.4 操作条

设计规格见 `dropdown-menu.design.md` §二 2.4。**未实现**（依赖多选 ⏳）。

---

## 三、设计原则

### 3.1 交互规则（已实现子集）✅

设计规格见 `dropdown-menu.design.md` §三 3.1。

弹出方向：antd `placement` 自适应（未自定义覆盖）。

#### 状态机术语

| 说法 | 含义 |
|---|---|
| **未搜索** | `query === ""`；展示源数据全量 |
| **搜索中** | `query !== ""` 且检索进行中（含 debounce 窗） |
| **加载中** | 源数据尚未就绪（与 query 无关） |
| **有结果 / 无结果** | 搜索完成且 `results.length > 0 / === 0` |
| **暂无数据** | 源就绪、源为空、且未搜索 |
| **加载失败** | `optionsLoadFailed`（非搜索失败） |

#### 内容区状态机

```text
dataStatus:   'idle' | 'loading' | 'ready' | 'failed'
query:        string
searchStatus: 'idle' | 'debouncing' | 'searching' | 'done'
```

| # | 条件 | UI 面 | 渲染 |
|---|---|---|---|
| 1 | `dataStatus === 'loading'` | **加载中** | Spin |
| 2 | `dataStatus === 'failed'` | **加载失败** | `SelectDropdownEmpty loadFailed` |
| 3 | `ready && query==="" && sourceEmpty` | **暂无数据** | `SelectDropdownEmpty noData` |
| 4 | `query && searchStatus ∈ {debouncing, searching}` | **搜索中** | Spin |
| 5 | `query && done && results===0` | **无结果** | `SelectDropdownEmpty noResult` |
| 6 | `query && done && results>0` | **有结果** | 列表 + 高亮 + 统计 |
| 7 | `query==="" && !sourceEmpty` | **未搜索** | 全量 + 统计 |

- debounce 窗内亦展示 **搜索中** Spin
- 清空 / 关浮层 → 重置 `query`（`resetSearchOnClose` 默认 `true`）
- 选中 → 关浮层并重置搜索

#### 变体矩阵（内容区六面）

```text
列：未搜索 / 搜索中 / 有结果 / 无结果 / 加载中 / 暂无数据
```

`SelectDropdownContentStatesPreview`。加载失败面不进六面矩阵。

#### 本地过滤

| 项 | 默认 |
|---|---|
| `searchMode` | `'local'` |
| 匹配 | 原文子串 **或** 全拼 **或** 首字母（`pinyin-pro`）；`option.searchText` 可选 |
| `filterMatcher` | `(label, query, searchText?) => boolean` 传入则**整体覆盖**内置逻辑 |

> 拼音为子串**包含**；`keysCache` 不做淘汰。

#### remote（仅接口）

| 项 | 约定 |
|---|---|
| Props | `onSearch(query)` + 受控 `options` + `loading` |
| 空 query | **禁止请求** |
| 搜索失败 | 归 **无结果** |
| 源加载失败 | `optionsLoadFailed` → **loadFailed** |

`searchTrigger?: 'realtime' | 'enter'` — **未实现**。

#### 关键词高亮 · SearchHighlight

| 项 | 规则 |
|---|---|
| 匹配 | **仅 label 字面子串**；大小写不敏感；全部命中 |
| 拼音过滤命中 | **不高亮** |
| 样式 | 仅 `color: colorPrimary` |
| 实现 | `[plain, mark, …]`；禁 `dangerouslySetInnerHTML` |

#### 空态 · SelectDropdownEmpty

| type | Figma | 资源 |
|---|---|---|
| `noResult` | `4381:14824` | `empty-state/non-page/no-result-small.png` |
| `loadFailed` | `4381:14891` | `…/load-failed-small.png` |
| `noData` | `4381:14868` | `…/no-data-small.png` |

| 项 | 值 |
|---|---|
| 插图 | **50×50** |
| 文案区宽 | **140px** |
| gap | **12 / 4** |
| padding | **20** |
| 主标题 | 14px · `colorText` |
| 辅助文案 | **12px** · `text-sub-color-transparent` @58% → `--sens-select-dropdown-empty-desc-color` |
| 操作链接 | `colorLink` · 12px |

> 未来可替换为 `<SensEmptyState scope="non-page" size="special" />`；对外 `type` / `onAction` 不变。

### 3.2 视觉样式

设计规格见 `dropdown-menu.design.md` §三 3.2（官方暂定）。容器 / 行底色 token 见 §二 2.3。

---

## 四、类型

### 4.1 常规 ✅

设计规格见 `dropdown-menu.design.md` §四 4.1。

#### 选择器点击触发

点 `SensSelectDropdown` 触发框 → popup → 选项行规格**仅**见 §二 2.3；串联见 `select.md` §串联。

滚动：antd 列表区原生滚动；「9 条半」精确裁切 **🔶 待核**。

#### 更多按钮 · 动作菜单触发

行底层数值见 §二 2.3「共享行底层」；本节只写动作菜单**专有条目**。

| 项 | 实现 |
|---|---|
| 组件 | `SensDropdownMenu` + `SensDropdownMenuItem` |
| 封装 | `SensButtonActionMenu`（antd `Dropdown` + `overlayClassName="sens-dropdown-menu-overlay"`） |
| 触发 | **click** 展开（`SensDropdownButton` / 更多 ▼；非 antd 默认 hover） |
| 浮层根 | `.sens-dropdown-menu-overlay` portaled；**不在** `.ant-select-dropdown` 内 |
| 行高 / 内边距 | 同 §二 2.3 数值 · `--sens-dropdown-menu-item-height` 34 · padding 6×12 |
| 容器 | 上 6 / 下 10 / 左右 0 · D4 · `radius/m` · Figma 面板语境 `17767:72632` 同档 |

**菜单项 variant**

| variant | 字色链 | 行底 |
|---|---|---|
| `default` | 中性黑 `text-color` | hover 6% 灰 / active 8% 灰（§二 2.3 未选中数值） |
| `link` | `--sens-text-link*` → `--sens-dropdown-menu-item-color-link*` | 同上 |
| `danger` | `--sens-text-warning*` → `--sens-dropdown-menu-item-color-danger*` | 同上 |

| 状态 | 实现 |
|---|---|
| `disabled` | `not-allowed`；`colorTextDisabled` |
| `loading` | `not-allowed`；`text-color-transparent-disable` @30% |

`DropdownMenuStatesPreview` + `dropdown-menu-preview.css`。场景 demo：`DropdownMenuUsageScenarios` / `SelectDropdownShowcasePage`。

### 4.2 级联 · 4.3 带层级 · 4.4 双行 · 4.5 树形

设计规格见 `dropdown-menu.design.md` §四。**未实现**。

---

## 五、场景说明

### 5.1 多选复选框禁用

设计规格见 `dropdown-menu.design.md` §五 5.1。**未实现**。

### 5.2 收回规则 · 单选 ✅

设计规格见 `dropdown-menu.design.md` §五 5.2（单选 bullet）。

| 行为 | 实现 |
|---|---|
| 选中 / 更改选项 | antd `onChange` → 关浮层 |
| 关浮层 | `resetSearchOnClose` 默认 `true` → `resetSearch()` |
| 点空白 | antd 默认关浮层（未选中变更不保存 — antd 受控语义） |

### 5.3 后端请求 · 5.4 带新建

设计规格见 `dropdown-menu.design.md` §五 5.3–5.4。**未实现**（remote 接口见 §三 3.1）。

---

## 与《选择器》的关系

浮层由选择器触发框点击打开；触发框与串联见 `select.md` §串联。动作菜单触发见 §四 4.1。

---

## Props 摘要

| Prop | 默认 | 说明 |
|---|---|---|
| `searchable` | `false` | 启用浮层搜索（§二 2.1） |
| `searchMode` | `'local'` | `'local' \| 'remote'` |
| `searchDebounce` | `300` | 防抖 ms |
| `resetSearchOnClose` | `true` | 关浮层重置搜索 |
| `optionsLoadFailed` | — | 源加载失败 |
| `onEmptyAction` | — | 空态链接回调 |
| `onSearch` | — | remote 用 |
| `filterMatcher` | — | 覆盖本地匹配 |
| `functionalSkin` | `'green'` | 已选中行底换肤 |

完整 props 见 `SensSelectDropdown` 类型定义。

## i18n

| Key | 用途 |
|---|---|
| `sensd-selectPanel-totalCount` | 未搜索统计 |
| `sensd-selectPanel-searchCount` | 有结果统计 |
| `sensd-selectPanel-searchPlaceholder` | 搜索占位 |
| `sensd-selectPanel-noResult` / `noResultDesc` | 无结果 |
| `sensd-selectPanel-noData` / `noDataDesc` / `add` | 暂无数据 |
| `sensd-selectPanel-loadFailed` / `loadFailedDesc` / `refresh` | 加载失败 |
| `sensd-selectPanel-loadingText` | 加载中 |
| `sensd-dropdown-menu-*` | 动作菜单矩阵 |

## 工程落点

```
src/ui/SensSelectDropdown.tsx
src/ui/SelectDropdownSearch.tsx
src/ui/SelectDropdownBody.tsx
src/ui/SelectDropdownEmpty.tsx
src/ui/SearchHighlight.tsx
src/ui/useSelectDropdownSearch.ts
src/ui/matchSelectOption.ts
src/ui/EmptyStateIllustrations.ts
src/ui/select-dropdown.css
src/ui/select-dropdown-preview.css
src/ui/SensDropdownMenu.tsx
src/ui/SensDropdownMenuItem.tsx
src/ui/SensButtonActionMenu.tsx
src/ui/dropdown-menu.css
src/ui/dropdown-menu-preview.css
src/design-system/text-color-chains.ts
src/assets/empty-state/non-page/*.png
src/preview/pages/SelectDropdownShowcasePage.tsx
src/preview/DropdownMenuUsageScenarios.tsx
build-tokens.mjs → SELECT_OPTION_ROW_TOKENS + components.Select
```
