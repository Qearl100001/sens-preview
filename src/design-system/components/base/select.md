# 设计系统 skill · 基础组件：选择器 Select

> 基础层，对应 antd `Select` 的**触发框字段**（收起态），不是浮层面板。
> 样式走 `theme.ts` + 窄作用域 CSS 变量，**禁止硬编码 hex / rgba 字面量**；透明色一律 `tokenRgba(handle, α)`。
> 设计语义见 `select.design.md`。
> **R3**：单选触发框 + 与浮层串联。

> 浮层面板见 `dropdown-menu.md`。

## 范围（R3）

| R3 包含 | R3 不包含 |
|---|---|
| 单选 **触发框**（收起态字段） | 多选 tag/计数、分组、虚拟滚动 |
| 与 R1/R2 浮层串联（点框 → popup → 选中回填） | 浮层内部 token/样式重定义 |
| 触发框 **仅 32px**（`controlHeight`）、`clearable`、框内警告、disabled | Cascader/TreeSelect |
| `SelectTriggerStatesPreview` 触发框矩阵 | 修改 `buildAntdTheme` 换肤逻辑 |
| `useSensSelectTriggerProps`（与搜索分类 Select hook 分离） | `search.css`、只读两档 |

**原则**：触发框字段色与 `input.md` **同源**（`INPUT_FIELD_TOKENS` → `components.Select`）；浮层 token 见 `dropdown-menu.md`（`SELECT_OPTION_ROW_TOKENS`）。

## 与 input.md 的关系（R3）

| 主题 | 引用 |
|---|---|
| 边框/背景/placeholder/disabled | `INPUT_FIELD_TOKENS` spread 至 `components.Select` |
| 锁高 **32px** | `useSensInputHeightStyle()` + `select-trigger.css`（**无** `size="small"` / `controlHeightSM`） |
| 框内警告菱形 | `InsideErrorSuffix` + `ErrorDiamondIcon`（`input.md` §警告图标） |
| 聚焦外环 | `INPUT_ACTIVE_OUTLINE_COLOR`（= `buildInputActiveShadow` / `INPUT_ACTIVE_SHADOW` 同色分量） |
| 警告聚焦外环 | `warning-color-active-shadow` @20% → `colorError` 链（**非** `colorWarning`） |
| 透明色 α | 与 Input 同源采信，见下表 |

## 触发框 · 主题接线

```text
INPUT_FIELD_TOKENS（脚本层）→ components.Select 触发框子集
  colorBorder / hoverBorderColor / activeBorderColor
  activeOutlineColor ← INPUT_ACTIVE_OUTLINE_COLOR（与 INPUT_ACTIVE_SHADOW 同源）
  selectorBg / colorBgContainerDisabled / colorTextPlaceholder

antd Select genStyleHooks 不继承 components.Input → 必须显式 spread，否则会掉全局 colorBorder
```

浮层行 token（`SELECT_OPTION_ROW_TOKENS`）见 `dropdown-menu.md` §主题接线。

## 触发框 · 透明色 α（与 Input 同源采信）

| 用途 | Figma handle | α |
|---|---|---|
| 默认边框 | `divideline-color-transparent-dack` | 16% |
| 禁用边框 | `divideline-color-transparent-light` | 8% |
| 禁用悬停边框 | `line-color-transparent` | 6%（预览板） |
| 聚焦外环 | `component-active-shadow` | 20% |
| 警告聚焦外环 | `warning-color-active-shadow` | 20%（`colorError`） |
| 禁用底 | `background-transparent-grey-hover` | 6% |
| 禁用悬停底 | `background-transparent-grey` | 4%（预览板） |
| placeholder | `text-color-transparent-disable` | 30% |
| 箭头禁用 | `icon-color-transparent-disable` | 30% |
| 箭头禁用悬停 | `icon-color-transparent-disable-hover` | 24%（预览板） |

## 触发框 · 箭头

| 项 | 规格 |
|---|---|
| 图标 | `ChevronDownIcon` / `ChevronUpIcon`（Figma `804:78` / `804:79`）；`SensSelectTriggerArrow` 内 **双图标互斥**（与搜索分类 `SensSelectSuffix` 同模式），**非**单 SVG `rotate(180deg)` |
| 尺寸 | `size/icon/m`（16×16） |
| 默认/hover/点击 | `icon-color-transparent` · **不变主色** |
| 展开 | 收起 `down` / 展开 `up`，`display` 互斥切换 |
| 禁用 | `icon-color-transparent-disable` @30% |
| Hook | `useSensSelectTriggerSuffixProps`（**非** `useSensSelectSuffixProps`） |

## 触发框 · 清空

| 项 | 规格 |
|---|---|
| Prop | `clearable`（默认 `false`）→ `allowClear={{ clearIcon: <SelectClearIcon /> }}` |
| 图标 | `SelectClearIcon` 占位槽 |
| 出现 | 有选中值 + hover 触发框 |
| 行为 | `onChange(undefined)` + 关浮层 + `resetSearchOnClose` |
| 布局 | hover 时 × **盖住**右侧箭头（antd 默认同位） |

## 触发框 · antd 映射（R3）

| 能力 | antd | 说明 |
|---|---|---|
| 框体 | `className` + `variant="outlined"` | `.sens-select-trigger` |
| 高度 | 固定 **32px** | `controlHeight`；**不暴露**触发框 `size="small"` |
| 箭头 | `suffixIcon` | `SensSelectTriggerSuffix`（含 `SensSelectTriggerArrow`） |
| 清空 | `allowClear` | `clearable` 时启用 |
| 占位符 | `placeholder` | i18n `sensd-select-placeholder` |
| 警告框内 | `status="error"` + `suffixIcon` 内 `InsideErrorSuffix` | `SensSelectTriggerSuffix`：**箭头左、菱形右**，`spacing/1x`（4px） |
| 浮层 | 既有 `popupRender` / `classNames.popup` | R3 不改浮层逻辑 |

## 串联（R3）

点触发框 → `onOpenChange(true)` → R1/R2 `mergedPopupRender` → 选选项 → antd `onChange` 回填 label → 关浮层 → `resetSearch()`。`value` / `defaultValue` / `onChange` 透传 antd 受控/非受控语义。

## Props 摘要（R3 增补）

| Prop | 默认 | 说明 |
|---|---|---|
| `clearable` | `false` | 悬停显示清空 × |
| `warningPlacement` | — | `inside` / `outside`（R3 实现 inside；outside 框下 help 可透传 `help`） |
| `help` / `warningMessage` | — | 同 `SensInput` |

## 变体矩阵（R3）

```text
维度：警告（无/框内）× 内容（未选/已选）   ← 触发框仅 32px，无大/小两档
列：默认 / 悬停 / 聚焦 / 禁用 / 禁用悬停
```

`SelectTriggerStatesPreview` + `select-trigger-preview.css`。

## 工程落点（R3）

```
src/ui/SensSelectDropdown.tsx          # useSensSelectTriggerStyle + 触发框接线
src/ui/select-trigger.css
src/ui/select-trigger-preview.css
src/ui/FieldIcons.tsx                  # ChevronDown/Up、SelectClearIcon
src/ui/fieldIconProps.tsx              # useSensSelectTriggerProps / SensSelectTriggerSuffix
build-tokens.mjs                       # components.Select + INPUT_FIELD 子集
src/preview/pages/SelectShowcasePage.tsx   # 选择器（R3 demo + 矩阵）
```
