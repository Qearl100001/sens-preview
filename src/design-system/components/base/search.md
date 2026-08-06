# 设计系统 skill · 基础组件：搜索 Search

> 基础层组件，直接复用 antd，不要手写。skill 只记 antd 不替你保证的「变体 / 行为 / 文案」规则。
> 样式走 src/design-system/theme.ts，不要硬编码颜色。规则源自 Sens.Design 搜索规范 v2.1。

## antd 映射
- 实时型搜索（推荐）：`<Input prefix={<SearchIcon/>} allowClear />`，onChange 即时过滤，**无搜索按钮**。
- 触发型搜索：`<Input.Search enterButton={<SearchIcon/>} allowClear />`，或回车触发。
- 带建议/联想：`<AutoComplete>` 包 Input。
- 一律基础层直接用 antd 组件，sensd 进来后同名替换即可。
- 图标：`SearchIcon` 803:171 · `ChevronDown/Up` 804:78/79（互斥）· `CloseCircleIcon` 1430:4796（清除）。

## 基本构成
- 框体 Input + 前缀「搜索」icon（`SearchIcon`）+ 占位符 placeholder。

## 框体规则
- 宽度：建议定宽，**默认 `SEARCH_INPUT_DEFAULT_WIDTH`（200，尚无 spacing token）**，范围 108–600；定宽时尽量让占位符完整展示。
- **带分类（常规/触发）**：左侧分类 Select **内容自适应**（文案 + `spacing/1x` + `size/icon/m` 箭头 + 左右 `spacing/3x` 内边距）；右侧搜索输入区 **固定 `searchWidth`**（默认 `SEARCH_INPUT_DEFAULT_WIDTH`）。**不要**再给整块 `Space.Compact` 传总宽，总宽 = 左自适应 + 右搜索定宽（触发型另加绿色按钮宽）。
- 带分类简约 / 带创建：简约带分类同「左自适应 + 右搜索定宽」；带创建总宽为布局估算值（**`SEARCH_MINIMAL_CREATE_DEFAULT_WIDTH` = 253，无 spacing token，勿升 foundation**）。
- 有有效输入时**必须有清空/重置**，且默认展示（antd：`allowClear`）。
- 图标与文案间距：**`spacing/1x`**。
- **高度**：仅 **32px**（`size/component-height/m` · `controlHeight`），**不提供** `size="small"`（24px）。

## 占位符规则
- 文案要准确、精简：「搜索用户名称/用户ID」优于「搜索关键词」；最精简为「搜索」。
- 显示不下时用「…」截断；悬停一律出 `SensTips`（含 `Space.Compact` 带分类）；有输入后不展示 tip。
- 发生输入时占位符消失（antd 默认行为）。
- 文案走 i18n key（`组件库` 命名空间），不要硬编码。

## 交互类型（在指令里说清用哪种）
- 实时型：输入即动态搜索，命中内容**高亮**（高亮在下拉浮层 `SearchHighlight`，不在 Search 输入框内）。
- 触发型：输入后点按钮 / 回车才搜索。

## 组件变体（看 Figma 选区是哪种）
- 基础搜索：单框体。
- 复合搜索：搜索框 + 范围选择（如左侧 Select 选搜索维度）组合。
- **简约**：弱化视觉（仅底部分割线 / 无描边），**高度仍 32px**，用于次要位置；**不是** antd 小尺寸（24px）。

## 变体矩阵还原（重要：避免把矩阵拍平、避免图层名漏成内容）

这类稿常是「变体矩阵」：variant（如 实时·常规 / 触发 / 触发·带分类 / 实时·简约·带创建）× state（默认 / hover / 聚焦 / 有输入带清空 / 禁用）。还原时：

- **按「每个 variant 一组、组内每个 state 一列」并排渲染**，保持稿里的分组与顺序，不要自己重新归类或合并 variant/state。
- **绝不要把 Figma 图层名 / 组件引用名（如 `组件库.sensd-input-searchCategory`）当作占位符或任何可见文案**。占位符一律用「搜索」或指令给定的文案，走 i18n key。
- state 对到 antd：默认 / hover / 聚焦(focus) / 有输入(`allowClear` 显示清空 icon)。**搜索无禁用态**：对外 API **Omit `disabled`**，矩阵与 Showcase 不提供 disabled 列；仅「创建」可有 `createDisabled`。
- 复合变体**点名成组件组合**，不要照外观摆：
  - 带分类：`Select`(分类) + `Input`(搜索) 左右相接（用 `Space.Compact`）；分类浮层 class `sens-select-dropdown`（与 SensSelectDropdown 同源）。
  - 带创建：`Input` + 右侧链接按钮「创建」（默认 `text-color-transparent`），中间用分隔线。
  - 简约：无边框 / 仅底部下划线的弱样式（**32px 行高，与常规同档**）。
- 若框上标着 `sensd-input-*`，说明 sensd 里已有此组件；装上 sensd 后优先用真实组件，别让 agent 拼变体。
- 矩阵「激活选择器」：用真实 `categorySelectOpen`，不用仅 CSS 伪造展开。

当前预览矩阵 variant 行（Figma 813:276 / 2216:10655）：

| variant | 组件组合 |
|---------|----------|
| 搜索 / 实时 · 常规 | `Input(搜索)` |
| 搜索 / 实时 · 带分类 · 常规 | `Select(分类)` + `Input(搜索)` |
| 搜索 / 触发 | `Input.Search` |
| 搜索 / 触发 · 带分类 | `Select(分类)` + `Input.Search` |
| 搜索 / 实时 · 简约 · 带创建 | `Input(搜索)` + 文字按钮「创建」 |
| 搜索 / 实时 · 简约 · 带分类 | `Select(分类)` + `Input(搜索)`（双线底线，Figma 1601:10979） |

简约矩阵（Figma 1601:10979）：未输入/已输入 × 默认 / 悬停搜索 / 点击搜索 / 激活搜索；带分类另加悬停选择器 / 点击选择器 / 激活选择器。

## 图标颜色（走 Sens handle，经 `searchTokens` / `useSensIconTokens`）

| 位置 | Sens handle |
|------|-------------|
| 搜索前缀图标 | `icon-color-transparent` |
| 返回（简约已输入） | 默认 `icon-color-transparent`；悬停 `link-color`；点击 `link-active-color`（Figma `804:81` · 8116:29008） |
| 分类箭头（默认） | `icon-color-transparent` |
| 分类箭头（悬停选择器 / 展开） | `component-primary`；点击 / 激活选择器 `component-active` |
| 触发型按钮内搜索图标 | `icon-color-transparent`（白底描边按钮；描边悬停 `component-primary`、点击 `component-active`） |
| 清空图标 | 始终「浅灰圆+灰叉」；默认 `icon-color-transparent`；悬停**只换色** `icon-sub-color-transparent`；点击同默认。不做实心圆+白叉 |
| 创建链接 | 默认 `text-color-transparent`；悬停 `link-color`；点击 `link-active-color` |

图标与文字间距：`spacing/1x`，见 `search.css` · `.sens-search-field .ant-input-prefix`。

## 结果与异常（若该场景含结果展示）
- 结果区准确展示「条目数 + 命中条目」，命中关键词高亮。
- 搜索为空 / 异常：用你们的空状态插图（从 Figma 导出），准确告知"发生了什么、该做什么"，不要用 antd 默认 Empty。

## 主题 token（已配好，引用即可）
- 边框 / 简约底线默认：`line-color`（Divider deep transparent）
- 悬停描边 / 简约悬停底线：`component-primary`
- 聚焦描边 / 激活底线：`component-active`；外环 `component-active-shadow` @0.2
- 占位 / 次文：走 antd 主题承接（对应中性文字）；控件高 `size/component-height/m`；圆角 `radius/m`
- 链接 / 创建 / 返回交互色：`link-color` / `link-active-color`
- 命中高亮（浮层，非本框）：`component-primary` 链

## 简约变体规格（Figma 8099:27068 / 8116:29015 / **1601:10979**）

- **行高**：**32px**（`size/component-height/m` · 与常规同档，非 24px 小尺寸）；底部分割线另计 1px
- **实现**：`MinimalSearchField` + `search.css` · `.sens-search-minimal-field`
- **有输入**：左侧出现返回键（`ChevronLeftIcon` · Figma `804:81` · 16×16），点击清空并 `onBack`
- **带创建**：`showCreate`（默认 true）；创建为链接按钮：默认 `text-color-transparent`，悬停 `link-color`，点击 `link-active-color`
- **间距**（spacing token）：
  - 未输入左内边距 `spacing/3x`（12px）；已输入左 `spacing/2x`（8px）
  - 返回 → 竖线 `spacing/2x`（8px）；竖线 → 搜索 icon `spacing/3x`（12px）；icon → 文字 `spacing/1x`（4px）
  - 有创建：清空 → 竖线 `spacing/3x`；竖线 → 创建 `spacing/3x`；创建 → 右缘 `spacing/3x`
- **底线颜色**（换肤）：
  - **分类区横线**（`sens-search-category-zone-line`）：**始终** `line-color`，不随选择器交互变色（Figma `3876:13525`）
  - **搜索区横线**（`MinimalSearchField` · `data-line-tone`）：
    - 默认：`line-color`
    - 悬停搜索 / 悬停创建：`component-primary`
    - 聚焦 / 点击搜索 / 激活搜索：`component-active`
  - **分类文案/箭头**（`data-line-tone` on select-zone，仅字色）：
    - 悬停选择器：`component-primary`
    - 点击选择器 / 激活选择器：`component-active`
- **投影**：触发型按钮 hover 用 `buildShadowD3()`；聚焦外环 `tokenRgba("component-active-shadow", 0.2)`
- **无禁用态**：搜索全变体不提供 disabled 样式与矩阵列；对外 API Omit `disabled`（仅创建可有 `createDisabled`）

## 工程落点（当前仓库）

```
src/ui/MinimalSearchField.tsx   # 简约搜索核心布局 + 底线状态机
src/ui/useMinimalSearchValue.ts # 受控值 + reset（对齐下拉 resetSearch）
src/ui/searchTokens.ts          # CSS 变量 / color-utils 派生
src/ui/SearchInput.tsx            # 各 variant + SearchStatesPreview 矩阵
src/ui/SearchPlaceholderTip.tsx   # 占位符截断 + SensTips
src/ui/SearchIcon.tsx             # Figma 803:171
src/ui/FieldIcons.tsx             # ChevronLeft 804:81、ChevronDown/Up、CloseCircle
src/ui/useSensIconTokens.ts       # icons.md 按角色取色
src/ui/fieldIconProps.tsx         # allowClear / Select suffix / 搜索前缀
src/ui/search.css
src/ui/search-preview.css         # 预览板（Showcase 引入，不进业务包路径亦可）
```

## 嵌入浮层（dropdown-menu §二 2.1）

- **变体**：实时·简约 · 交互行高 **32px** · **有输入显示返回**（`onBack` → `resetSearch`）
- **封装**：`SelectDropdownSearch` 薄包 `MinimalSearchField`（`showCreate={false}`）；**通栏** 100%
- **职责**：仅输入/清空/聚焦；过滤、六面切换、高亮在 `dropdown-menu.md` §三 3.1
- **过滤**：默认原文 + 全拼 + 首字母（`pinyin-pro` 词组模式）；`option.searchText` 可选兜底多音字/专有名词
- **高亮**：浮层选项文案用 `SearchHighlight`（`component-primary` 链）；**不在** SearchInput 内实现；**拼音命中不高亮**，仅字面子串高亮
- **统计 / 空态**：浮层专有 `SelectDropdownBody` + `SelectDropdownEmpty`；统计色 `text-sub-color-transparent` @58%；搜索→统计 **6px**、统计→首条 **0px**；可搜索浮层顶 **0px**
- **底部分隔**：minimal 自有底线；浮层内**不**再加横线
