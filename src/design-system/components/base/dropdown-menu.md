# 设计系统 skill · 基础组件：下拉浮层 Dropdown Menu

> 基础层，对应 antd `Select` 的**浮层层**（`popupClassName` / `styles.popup` / `popupRender`），不是触发框字段。
> 样式走 `theme.ts` + 窄作用域 CSS 变量，**禁止硬编码 hex / rgba 字面量**；透明色一律 `tokenRgba(handle, α)`。
> 设计语义见 `dropdown-menu.design.md`。
> **R1**：浮层容器 + 选项行 10 格。**R2**：浮层内搜索 + 内容区六面 + 关键词高亮。

## 范围（R1）

| R1 包含 | R1 不包含 |
|---|---|
| 浮层容器（白底、`radius/m`、**D4↓**） | Select **触发框** → 见 `select.md` |
| 选项行：**未选中 / 已选中** × **5 态** = **10 格** + 已选勾选 | 多选、分组、Cascader/TreeSelect |
| `SensSelectDropdown` + `SelectDropdownStatesPreview` | 修改 `buildAntdTheme` 换肤逻辑 |

## 术语（禁止混淆）

| 说法 | 含义 |
|---|---|
| **已选中** | `ant-select-item-option-selected`；行默认静止态底 = `component-active-background` + 右侧勾选 |
| **点击** | 鼠标按下瞬间 = CSS **`:active`**，**不是** `option-active` |
| `option-active` | antd/rc 键盘聚焦类；R1 底色与**未选中悬停**同源（6% 灰），不单独占矩阵列 |

## 通则

- **实现方式遵循 `conventions.md`**：真实组件不伪造 hover/click；预览板静态画 10 格。
- **浮层仅单一尺寸**：`optionHeight: **34**`；**无** `size="small"` / `controlHeightSM`。
- **换肤**：不动 `buildAntdTheme`。已选中三档行底走 `getFunctionalColors(skin)`；**勾选色固定中性图标，不换肤**。

## antd 映射（R1）

| 能力 | antd | 说明 |
|---|---|---|
| 浮层样式 | `classNames.popup` + `styles.popup` | 注入 CSS 变量（portaled，勿依赖父级继承） |
| 已选中行 | `.ant-select-item-option-selected` | 默认底 `optionSelectedBg` |
| 未选中悬停 | `:hover` | 自定义 `--sens-select-option-hover-bg` |
| 未选中点击 | `:active` | 自定义 `--sens-select-option-click-bg` |
| 键盘聚焦 | `.ant-select-item-option-active` | `optionActiveBg` = 未选中 hover 同色 |
| 勾选 | `optionRender` + `SelectCheckIcon` | Figma `17694:64400` / `3729:15820`；**永远最右**，距浮层右缘 **12px**（= 行 `padding-inline`） |
| 演示载体 | `<Select options={...} />` | R1 可用假触发框仅承载浮层 |

## 浮层容器

| 属性 | Token / 实现 |
|---|---|
| 背景 | `white` → `colorBgContainer` |
| 圆角 | `radius/m` → `borderRadius`（4px） |
| 投影 | **`SHADOW_D4`** = `buildShadowD4()`；与 `components.Button.shadowFloating` 同源，**禁止新建 D4** |
| 上内边距 | **6px** = `spacing/1x` + `spacing/0.5x` → `popupPaddingBlockStart` |
| 下内边距 | **10px** = `spacing/vertical/2.5x` → `popupPaddingBlockEnd` |
| 左右内边距 | **0**（通栏） | `padding-inline: 0` 覆盖 antd `paddingXXS` |

Figma `17767:72632`。

## 选项行 · 底色（Figma 实测 α）

> **行底 token**：`SELECT_OPTION_ROW_TOKENS`（共享层）；动作菜单选项行同源、各自实现。

### 未选中

| 状态 | 背景 | 实现 |
|---|---|---|
| 默认 | `white` | `colorBgContainer` |
| 悬停 | `background-transparent-grey-hover` @ **6%** | `tokenRgba("background-transparent-grey-hover", 0.06)` |
| 点击 | `background-01-transparent` @ **8%** | `tokenRgba("background-01-transparent", 0.08)` |
| 禁用 · 默认 | `white` | 字 `colorTextDisabled` |
| 禁用 · 悬停 | `background-transparent-grey-hover` @ **6%** | 同上 |

### 已选中

| 状态 | 背景 | 实现 |
|---|---|---|
| 默认 | `component-active-background` | `optionSelectedBg` + CSS 变量（换肤） |
| 悬停 | `component-active-hover-background` | `optionSelectedHoverBg` |
| 点击 | `component-active-click-background` | `optionSelectedActiveBg` |
| 禁用 · 默认 | `white` | 覆盖 antd 选中禁用灰底 |
| 禁用 · 悬停 | `background-transparent-grey-hover` @ **6%** | `tokenRgba(..., 0.06)` |

### 行高与内边距

| 项 | 值 |
|---|---|
| `optionHeight` | **34**（`components.Select`，不复用 `controlHeight` 32） |
| `optionPadding` | **`6px 12px`** = `optionPaddingBlock` + `spacing/horizontal/3x` |
| 通栏 | 浮层 `padding-inline: 0`；行 `width: 100%`，hover/选中底到边 |

## 勾选标记

| 项 | 值 |
|---|---|
| 图标 | `SelectCheckIcon` · `FieldIcons.tsx` |
| Figma | `17694:64400` / `3729:15820` |
| 尺寸 | `size/icon/m`（16px） |
| 颜色 | `icon-color-transparent` → `--sens-select-option-check-color`（**不换肤**） |
| 禁用色 | `icon-color-transparent-disable` → `--sens-select-option-check-color-disabled` |

## 主题接线

`Select` **不继承** `components.Input` / `Button`。脚本层 **`SELECT_OPTION_ROW_TOKENS`** + **`components.Select` 独立块**（同 `INPUT_FIELD_TOKENS` 思路）。

```text
SELECT_OPTION_ROW_TOKENS → components.Select
  optionHeight: 34
  optionActiveBg:      tokenRgba(background-transparent-grey-hover, 0.06)
  optionSelectedBg:    component-active-background
  optionHoverBg:       …6%   (CSS 扩展)
  optionClickBg:       …8%   (CSS 扩展)
  optionSelectedHoverBg / optionSelectedActiveBg (CSS 扩展)
  popupShadow:         SHADOW_D4
  popupPaddingBlockStart: spacing/1x + spacing/0.5x (=6)
  popupPaddingBlockEnd:   spacing/vertical/2.5x (=10)
  optionPadding:       6px 12px
```

## 换肤 CSS 变量（`.sens-select-dropdown`）

```text
--sens-select-option-selected-bg / -hover-bg / -active-bg  ← getFunctionalColors(skin)
--sens-select-option-check-color                           ← icon-color-transparent（不换肤）
--sens-select-option-check-color-disabled                  ← icon-color-transparent-disable
--sens-select-option-hover-bg / -click-bg                  ← tokenRgba（不换肤）
--sens-select-popup-shadow                                 ← buildShadowD4()
--sens-select-popup-padding-block-start / -end             ← 6px / 10px
--sens-select-option-padding-inline / -block               ← 12px / 6px
```

## 变体矩阵（R1）

```
行：未选中 / 已选中
列：默认 / 悬停 / 点击 / 禁用 / 禁用悬停
```

**10 格**。`SelectDropdownStatesPreview` + `select-dropdown-preview.css`（不污染全局 `.ant-select-dropdown`）。

## 预览 vs 真实组件（R1）

| 层 | 职责 |
|---|---|
| `SensSelectDropdown` | `Select` + `popup` 样式/变量 + `optionRender` 勾选 |
| `SelectDropdownStatesPreview` | 10 格静态样张 |
| `select-dropdown-preview.css` | 仅预览强制态 |

---

## 范围（R2）

| R2 包含 | R2 不包含 |
|---|---|
| `SelectDropdownSearch`（薄封装 `SearchInput` · 实时·简约） | Select **触发框** → 见 `select.md` |
| 内容区六面 + 统计文案 + `SelectDropdownEmpty` × 3 | 多选、分组、Cascader/TreeSelect |
| `SearchHighlight`（`colorPrimary`） | 省略段内高亮 |
| 搜索状态机（`searchMode: 'local' \| 'remote'`） | **remote 完整实现**（仅预留接口） |
| `EmptyStateIllustrations` 资源引用 | **统一异常状态组件**（整体滞后） |
| `SelectDropdownContentStatesPreview`（6 面矩阵） | 触发型搜索（`searchTrigger` 预留） |
| Showcase Demo（**local**） | **网络异常**（`4381:14801`） |
| | 修改 `buildAntdTheme` 换肤逻辑 |

**原则**：基础组件默认最简；业务差异 **prop 覆盖**。

## 术语（R2 增补）

| 说法 | 含义 |
|---|---|
| **未搜索** | `query === ""`；展示源数据全量 |
| **搜索中** | `query !== ""` 且检索进行中（含 debounce 窗） |
| **加载中** | 源数据尚未就绪（与 query 无关） |
| **有结果 / 无结果** | 搜索完成且 `results.length > 0 / === 0` |
| **暂无数据** | 源就绪、源为空、且未搜索 |
| **加载失败** | 源数据请求失败（`optionsLoadFailed`） |
| `SelectDropdownEmpty` | 浮层空态薄封装；**非**统一异常状态组件 |

## 搜索框 · SelectDropdownSearch

复用 `search.md` **实时·简约**；不重做样式。详见 `search.md`「嵌入浮层」。

| 项 | 规格 |
|---|---|
| 底层 | `SearchInput` · `visualVariant="minimal"` · `allowClear` |
| 宽度 | 浮层内 **100% 通栏**（外框/分割线铺满；文案与图标内缩 `spacing/3x` = 12px，走 `search.css` minimal） |
| 行高 | **32px**（简约搜索交互区；底部分割线另计 1px） |
| 统计间距 | 搜索底部分割线 →「共 n 条」**6px**（`spacing/1x + spacing/0.5x`）；统计 → 首条选项 **0px** |
| 浮层上内边距（可搜索） | **0px**（搜索贴顶；非搜索浮层仍 6px） |
| 底部分隔 | **不额外加线**（minimal 自有底线） |
| 占位符 | `sensd-selectPanel-searchPlaceholder` |

## 搜索触发与数据源

### 默认（local · R2 完整实现）

| 项 | 默认 |
|---|---|
| `searchMode` | `'local'` |
| 触发 | 实时 + 防抖；`searchDebounce` **300ms** |
| Enter | 不特殊处理 |
| 过滤 | 原文子串 **或** 全拼包含 **或** 首字母包含（大小写不敏感）；默认匹配 `label`；`option.searchText` 可选一并参与 |
| `filterMatcher` | `(label, query, searchText?) => boolean`；传入则**整体覆盖**内置逻辑，`searchText` 作第三参由业务决定是否使用 |

> **Note**：拼音为子串**包含**（非仅前缀），中段拼音 / 单字母首字母会宽匹配，属预期。`keysCache` 不做淘汰，依赖 label 集合有界。

### remote（R2 仅接口）

| 项 | 约定 |
|---|---|
| Props | `onSearch(query)` + 受控 `options` + `loading` |
| 空 query | **禁止请求**；展示全量 |
| 搜索失败 | 归 **无结果**（`noResult`） |
| 源加载失败 | `optionsLoadFailed` → **loadFailed** |

### 预留

- `searchTrigger?: 'realtime' \| 'enter'` — R2 不实现

## 状态机

### 变量

```text
dataStatus:   'idle' | 'loading' | 'ready' | 'failed'
query:        string
searchStatus: 'idle' | 'debouncing' | 'searching' | 'done'
```

### UI 面优先级

| # | 条件 | UI 面 | 渲染 |
|---|---|---|---|
| 1 | `dataStatus === 'loading'` | **加载中** | Spin |
| 2 | `dataStatus === 'failed'` | **加载失败** | `SelectDropdownEmpty loadFailed` |
| 3 | `ready && query==="" && sourceEmpty` | **暂无数据** | `SelectDropdownEmpty noData` |
| 4 | `query && searchStatus ∈ {debouncing, searching}` | **搜索中** | Spin |
| 5 | `query && done && results===0` | **无结果** | `SelectDropdownEmpty noResult` |
| 6 | `query && done && results>0` | **有结果** | 列表 + 高亮 + 统计 |
| 7 | `query==="" && !sourceEmpty` | **未搜索** | 全量 + 统计 |

### 关键转移

- debounce 窗内亦展示 **搜索中** Spin，不跳过
- 清空 / 关浮层 → 重置 `query`（`resetSearchOnClose` 默认 `true`）

## 空态 · SelectDropdownEmpty

> 未来内部可替换为 `<SensEmptyState scope="non-page" size="special" />`；**对外 `type` / `onAction` 不变**。

| type | Figma | 资源 |
|---|---|---|
| `noResult` | `4381:14824` | `empty-state/non-page/no-result-small.png` |
| `loadFailed` | `4381:14891` | `…/load-failed-small.png` |
| `noData` | `4381:14868` | `…/no-data-small.png` |

布局：插图 **50×50** · 文案区 **140px** · gap **12/4** · padding **20**。

- 主标题 14px · `colorText`
- 辅助文案 **12px** · `text-sub-color-transparent` @58%（`--sens-select-dropdown-empty-desc-color`）
- 操作链接 `colorLink` · 12px

`noData` / `loadFailed` 副文案含链接（`colorLink`）；`onEmptyAction` 可选，R2 不接业务逻辑。

## 关键词高亮 · SearchHighlight

| 项 | 规则 |
|---|---|
| 匹配 | **仅 label 字面子串**连续、大小写不敏感、全部命中 |
| 拼音过滤 | 全拼/首字母/`searchText` 命中但 query 非 label 字面 → **不高亮** |
| 特殊字符 | escape 字面量 |
| 实现 | `[plain, mark, …]`；禁 `dangerouslySetInnerHTML` |
| 样式 | 仅 `color: colorPrimary`（引用 token 链；换肤待 `buildAntdTheme` 欠账修复） |

> 高亮口径自 R2 初版收窄：过滤可拼音命中，高亮仍只字面。**拼音命中不高亮。**

## antd 映射（R2）

| 能力 | antd | 说明 |
|---|---|---|
| 顶栏搜索 | `popupRender` | 不用内置 `showSearch` input |
| 本地过滤 | 外部 filter 后传 `options` | `filterOption={false}` |
| 远程 | `onSearch` + 受控 `options` + `loading` | R2 仅接口 |
| 高亮 | `optionRender` + `SearchHighlight` | 有 query 时启用 |

## Props 摘要（R2）

| Prop | 默认 | 说明 |
|---|---|---|
| `searchable` | `false` | 启用浮层搜索 |
| `searchMode` | `'local'` | 数据源模式 |
| `searchDebounce` | `300` | 防抖 ms |
| `resetSearchOnClose` | `true` | 关浮层重置搜索 |
| `optionsLoadFailed` | — | 源加载失败 |
| `onEmptyAction` | — | 空态链接回调 |
| `onSearch` | — | remote 用 |
| `filterMatcher` | — | 覆盖本地默认匹配；签名 `(label, query, searchText?) => boolean` |

## 变体矩阵（R2）

```text
列：未搜索 / 搜索中 / 有结果 / 无结果 / 加载中 / 暂无数据
```

`SelectDropdownContentStatesPreview`。

## i18n

| Key | 用途 |
|---|---|
| `sensd-selectPanel-totalCount` | 未搜索统计（色 `text-sub-color-transparent` @58%） |
| `sensd-selectPanel-searchCount` | 有结果统计（同色） |
| `sensd-selectPanel-noResult` / `noResultDesc` | 无结果 |
| `sensd-selectPanel-noData` / `noDataDesc` / `add` | 暂无数据 |
| `sensd-selectPanel-loadFailed` / `loadFailedDesc` / `refresh` | 加载失败 |
| `sensd-selectPanel-loadingText` | 加载中 Spin 旁 |

## 工程落点（R1/R2）

```
src/ui/SensSelectDropdown.tsx
src/ui/SelectDropdownSearch.tsx
src/ui/SelectDropdownBody.tsx
src/ui/SelectDropdownEmpty.tsx
src/ui/SearchHighlight.tsx
src/ui/useSelectDropdownSearch.ts
src/ui/matchSelectOption.ts
src/ui/EmptyStateIllustrations.ts
src/assets/empty-state/non-page/*.png
src/ui/select-dropdown.css
src/ui/select-dropdown-preview.css
src/preview/pages/SelectDropdownShowcasePage.tsx
build-tokens.mjs → SELECT_OPTION_ROW_TOKENS + components.Select
```

---

由选择器触发，见 `select.md` §串联（R3）。
