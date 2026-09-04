# 设计系统 skill · 基础组件：下拉菜单 Dropdown Menu

> 基础层：antd `Select` **浮层层**（`popupRender` / `styles.popup`）+ 动作菜单浮层（`SensDropdownMenu`）。
> 样式走 `theme.ts` + 窄作用域 CSS 变量，**禁止硬编码 hex / rgba 字面量**；透明色一律 `tokenRgba(handle, α)`。
> 设计语义见 `dropdown-menu.design.md`；本文只写实现映射与约束。

## 范围

| 本文包含（对照 design ✅） | 本文不包含 |
|---|---|
| §二 2.1 搜索条 · §二 2.2 统计区 · §二 2.3 内容模块（单选行 / 多选复选行 / 双行选项 / 带层级分组）· §二 2.4 操作条（全选 + 按钮组） | Select **触发框** → `select.md` |
| §三 3.1 交互（状态机 / 六面 / 高亮 / 过滤） · §四 4.3 带层级 · §五 5.2 复选收回 | 级联、树形；操作条左侧链接变体 |
| §四 4.1 常规（两条触发路径） | **统一异常状态组件**（页面级矩阵 — 整体滞后） |
| §五 5.2 单选收回 | **网络异常** Figma `4381:14801`（归未来异常状态规范） |
| `SensSelectDropdown` popup + `SensDropdownMenu` 动作菜单 | 修改 `buildAntdTheme` 换肤逻辑 |

> 当前待补：级联下拉菜单（级联/树形多级选择）尚未实现；本轮验收不纳入已完成范围。

## 通则

- **实现方式遵循 `conventions.md`**：真实组件不伪造 hover/click；预览板静态画矩阵格。
- **浮层仅单一尺寸**：`optionHeight: **34**`；**无** `size="small"` / `controlHeightSM`。
- **换肤**：不动 `buildAntdTheme`。浮层已选中三档行底走当前 Functional Skin（`useFunctionalSkin()`，可被 `functionalSkin` 覆盖）；未传 prop 不得回退神策绿。**勾选色固定中性图标，不换肤**。
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

> 实现侧：`searchable` 时统计恒显；多选是否展示搜索由 `searchable` 显式控制。与 design「≥9 条建议出现」差异以调用方传入值为准。

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
| 列表最大高度 | **9.5 行** · `SELECT_LIST_MAX_HEIGHT` = 34 × 9.5 = **323px**；超出滚动。不含搜索 / 统计 / 操作条 |
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

### 2.3.1 双行选项 ✅

单选和多选都支持在每个选项上提供 `description` 辅助文案。两行内容使用同一条选项行，不拆成第二个菜单项：

| 项 | Token / 实现 |
|---|---|
| 主文案 | `font-size/m` = 14px，`line-height/m` = 22px；已选中时使用选中强调字重 |
| 辅助文案 | `font-size/s` = 12px，`line-height/s` = 18px，颜色 `text-sub-color-transparent` @58% |
| 两行间距 | `spacing/0.5x` |
| 行内边距 | 与普通选项一致：左右 `spacing/horizontal/3x` = 12px，上下 `spacing/1.5x` = 6px |
| 单选已选中 | 继续使用单选右侧选中标记和 `component-active-background` 选中背景 |
| 多选已选中 | 继续使用左侧 `SensCheckbox`，辅助文案不改变复选交互 |

调用方只需在选项对象中传入 `description`；单选和多选不各自维护一套双行 DOM。辅助文案属于选项内容，不参与搜索关键词高亮。

### 2.3.2 多选复选行 ✅

设计规格见 `dropdown-menu.design.md` §二 2.3；视觉 Figma `17685:60706`。

| 项 | 实现 |
|---|---|
| Prop | `mode="multiple"` 或选择器 `multiDisplay="count"`。个数型触发框走选择器；浮层页 Demo 用 `multiDisplay="count"`，不用裸 `mode="multiple"`（会画出 antd 胶囊 tag） |
| 勾选 | 左侧 `SensCheckbox`（16px、`radius/s`、填充 `component-primary`）；整行可点 |
| 右侧对勾 | **不出现**（`menuItemSelectedIcon={null}`） |
| 行底 | 与单选同一套已选中 `component-active-background` 链 |
| 浮层最小宽 | **320px** · `SELECT_MULTIPLE_POPUP_MIN_WIDTH`；单选不套 |
| 草稿 | 打开后点选只改草稿；「完成」才 `onChange`；「放弃」/点空白还原 |

icon / 标签 / help / 选项链接本轮不做；增量加载行见 §二 2.3.3。

### 2.3.3 增量加载行 ✅

单选、多选共用浮层底部的异步状态行，每次由调用方追加一页数据（预览按 50 条一页）。

| 状态 | 展示 | 行为 |
|---|---|---|
| `more` | 居中「加载更多」链接，34px 高，左右 12px | 点击触发 `onLoadMore` |
| `loading` | 20px 加载图标 +「加载中」，间距 4px | 禁止重复触发 |
| `error` | 错误图标 +「加载失败，请」+「重试」链接 | 点击触发 `onLoadMoreRetry` |

多选确认模式下，增量加载行位于选项列表与操作区之间；搜索、统计和操作区规则不变。

### 2.3.4 带层级分组 ✅

设计规格见 `dropdown-menu.design.md` §二 2.3 / §四 4.3。原子 Figma `17691:63738`。

只做在 **下拉浮层**（`SensSelectDropdown`）；选择器页不另做一套。调用方传入 antd OptGroup：`{ label, options: [...] }`。

| 项 | 实现 |
|---|---|
| Prop | `groupStyle?: "title" \| "divider"`，默认 `title` |
| 面性 `title` | `.ant-select-item-group` 通栏灰底条；左右 12 / 上下 6；字 `font-size/s` + `line-height/s`；色 `text-sub-color-transparent` @58%；底 `background-transparent-grey` @4%；单行省略；`pointer-events: none` |
| 线性 `divider` | 组标题视觉隐藏，组与组之间 1px 通栏线 `getDividerColor("light", "transparent")`；第一组上方无线 |
| 滚动 | 组标题 / 分割线在可滚动选项列表内，与选项一起滚；搜索 / 统计 / 操作条仍钉在列表外 |
| 搜索打平 | `query` 非空时 `flattenSelectOptions`，丢掉组标题和分割线，命中项一条列表；高亮复用 `SearchHighlight` |
| 统计 | 按叶子选项计数，不是按组数 |
| 虚拟列表 | 展示分组时 `virtual={false}`，避免组标题 / 1px 线与固定 34 行高错位 |

Demo：`/components/select-dropdown` 面性×单选/多选、线性×单选/多选。搜索「我」可验打平（3 条诗句）。

### 2.4 操作条 ✅（全选 + 按钮组）

设计规格见 `dropdown-menu.design.md` §二 2.4。Figma `17691:63201`（复选+按钮组）/ 完整稿 `17728:81940`。

| 项 | Token / 实现 |
|---|---|
| 组件 | `SelectDropdownActionBar` |
| 高度 | `size/component-height/xl` = **40** |
| 左右 | `spacing/horizontal/3x` = **12** |
| 布局 | `justify-content: space-between` |
| 顶部分割 | `getDividerColor("light", "transparent")` · hairline |
| 全选 | 左侧 `SensCheckbox`；文案 i18n `sensd-selectPanel-selectAll`（「全选」，不照抄稿占位「选项」） |
| 全选语义 | 针对**当前列表**（搜索时用 `displayOptions`）：未全选 → 并入可选项；已全选 → 从草稿去掉当前可选项；跳过 disabled |
| 半选 | 勾了一部分 → `indeterminate`；无可选项 → checkbox disabled |
| 复选↔文案 | `spacing/horizontal/2x` = **8**（`SensCheckbox` `--sens-checkbox-gap`） |
| 按钮 | 小尺寸 `SensButton`：「放 弃」secondary +「完成 (N)」primary；gap **12** |
| 文案 | i18n `sensd-select-cancelText` / `sensd-select-okText`；计数半角括号 |
| 未做 | 左侧链接按钮；全选遇禁用 tips（`sensd-selectPanel-selectAllTip`） |

浮层有操作条时 `padding-block-end: 0`，条贴底。

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

滚动：选项列表 `listHeight` = 9.5 × 34 = **323px**，超出滚动；搜索 / 统计 / 操作条在列表外。

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

| variant | 字色链 | 行底 | 何时用 |
|---|---|---|---|
| `default` | 中性黑 `text-color` | hover 6% 灰 / active 8% 灰（§二 2.3 未选中数值） | 常规动作菜单；悬停「更多 ···」 |
| `link` | `--sens-text-link*` → `--sens-dropdown-menu-item-color-link*` | 同上 | **表格 / 工具栏溢出「更多」**；卡片等链接菜单行 |
| `danger` | `--sens-text-warning*` → `--sens-dropdown-menu-item-color-danger*` | 同上 | 删除等风险项 |

表格 / 工具栏溢出：触发器是链接「更多」+ 点击展开（`SensDropdownButton`）；**菜单项用 `link` 蓝字行，与平铺链接操作同色。**

| 状态 | 实现 |
|---|---|
| `disabled` | `not-allowed`；`colorTextDisabled` |
| `loading` | `not-allowed`；`text-color-transparent-disable` @30% |

`DropdownMenuStatesPreview` + `dropdown-menu-preview.css`。场景 demo：`DropdownMenuUsageScenarios` / `SelectDropdownShowcasePage`。

### 4.2 级联 · 4.5 树形

设计规格见 `dropdown-menu.design.md` §四。**未实现**。

### 4.3 带层级 ✅

设计规格见 `dropdown-menu.design.md` §四 4.3。实现见 §二 2.3.2（`groupStyle` 面性标题 / 线性分割线；搜索打平）。

---

## 五、场景说明

### 5.1 多选复选框禁用

设计规格见 `dropdown-menu.design.md` §五 5.1。**未实现**。

### 5.2 收回规则 · 单选 ✅ / 复选 ✅

设计规格见 `dropdown-menu.design.md` §五 5.2。

| 行为 | 实现 |
|---|---|
| 单选 · 选中 / 更改选项 | antd `onChange` → 关浮层 |
| 复选 · 点选 | 只改草稿，浮层保持打开 |
| 复选 · 「完成」 | 提交草稿 `onChange` 并关浮层 |
| 复选 · 「放弃」/ 点空白 | 还原打开时的值，不 `onChange` |
| 关浮层 | `resetSearchOnClose` 默认 `true` → `resetSearch()` |

### 5.3 后端请求 · 5.4 带新建

设计规格见 `dropdown-menu.design.md` §五 5.3–5.4。**未实现**（remote 接口见 §三 3.1）。

---

## 与《选择器》的关系

浮层由选择器触发框点击打开；触发框与串联见 `select.md` §串联。动作菜单触发见 §四 4.1。

---

## Props 摘要

| Prop | 默认 | 说明 |
|---|---|---|
| `searchable` | `false` | 启用浮层搜索 + 统计（§二 2.1–2.2）；多选、个数型同样由该值显式控制 |
| `searchMode` | `'local'` | `'local' \| 'remote'` |
| `searchDebounce` | `300` | 防抖 ms |
| `resetSearchOnClose` | `true` | 关浮层重置搜索 |
| `optionsLoadFailed` | — | 源加载失败 |
| `onEmptyAction` | — | 空态链接回调 |
| `onSearch` | — | remote 用 |
| `filterMatcher` | — | 覆盖本地匹配 |
| `mode` | — | `'multiple'` 启用复选行 + 操作条 + 最小宽 320 |

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
| `sensd-select-okText` / `sensd-select-cancelText` | 完成 / 放弃 |
| `sensd-selectPanel-selectAll` | 操作条全选 |
| `sensd-dropdown-menu-*` | 动作菜单矩阵 |

## 工程落点

```
src/ui/SensSelectDropdown.tsx
src/ui/SelectDropdownSearch.tsx
src/ui/SelectDropdownBody.tsx
src/ui/SelectDropdownActionBar.tsx
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
