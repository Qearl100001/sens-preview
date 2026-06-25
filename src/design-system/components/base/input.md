# 设计系统 skill · 基础组件：输入框 Input

> 基础层，直接用 antd `Input` + 主题 token，不硬编码颜色。
> 设计语义与取舍见 `input.design.md`；本文只写实现映射与约束。
> 规则源自 Sens.Design 输入框规范 v2.1 + Figma 变体矩阵 `2214:13286`。

## 范围（第一轮）

**只做「文本」单行输入框**（`Input`）。

| 本轮包含 | 本轮不包含 |
|---|---|
| 大/小尺寸、7 态、未输入/已输入、框内/框外警告 | **文本域**（见 `textarea.md`）；**数字输入框**（见 `inputnumber.md`） |
| 只读有背景 / 只读无背景 | **搜索**（独立规范，见 `search.md`） |
| 占位符、校验报错、清空（行为见 `input.design.md`） | 「组合」「密码」等类型（随 sensd 或后续轮次） |

## 通则

- **实现方式遵循 `conventions.md`**：真实组件 `SensInput` 仅用 props + token；预览对照板 `InputStatesPreview` 负责全量静态核对。
- **凡本规范没写明的点，agent 会沿用 antd 默认**；与 antd 不一样的地方必须在此写死。
- 状态矩阵分两层：真实组件（props + token，不伪造 hover）；预览板（变体 × 状态静态样张，互斥态不叠加）。
- **尺寸只有两种**：大 = 不传 `size`（`controlHeight` / `size/component-height/m` = 32）；小 = `size="small"`（`controlHeightSM` / `size/component-height/s` = 24）。不要用 antd `large`。
- **禁用悬停 = 禁用**；只读态不参与 hover 边框变化。
- 占位符走 i18n：`组件库.sensd-input-placeholder`（「请输入」），**禁止**把 Figma 图层名当 placeholder。
- 颜色分层见 `color-semantics.md`：边框 hover 走 `colorPrimary`（**随换肤**）；校验警告走 `colorError` 系（**状态色，不换肤**）。**禁止**把警告态误接到 `colorWarning`（那是 `info-color` 提醒琥珀色）。

## antd 映射

| 能力 | antd | 说明 |
|---|---|---|
| 基础输入 | `<Input />` | 大：默认；小：`size="small"` |
| 禁用 | `disabled` | 禁用悬停视觉 = 禁用 |
| 只读有背景 | `readOnlyVariant="filled"` | 自动 `readOnly`；灰底 `colorBgContainerDisabled`、无边框；空值 `sensd-input-unset` |
| 只读无背景 | `readOnlyVariant="plain"` | 无框纯文本行（Figma 只读_字段 `15525:49215`） |
| 只读 + 警告（有背景） | `readOnlyVariant="filled"` + `warningPlacement` | **无红框**；底 `warningReadonlyBg` ← `warning-light-background`（`49279` / `49269`） |
| 只读 + 警告（无背景·框内） | `plain` + `warningPlacement="inside"` | 文字与菱形图标横排（`49284` / `49317`），非 Input suffix |
| 只读 + 警告（无背景·框外） | `plain` + `warningPlacement="outside"` | 文本行 + 下方 help（`49274` / `49307`） |
| 校验失败（可编辑） | `status="error"` 或 `warningPlacement`（非只读） | sensd「警告」= antd `error` 红框 |
| 框内警告（可编辑） | `warningPlacement="inside"` | `status="error"` + `suffix` 菱形；悬停 Tooltip |
| 框外警告（可编辑） | `warningPlacement="outside"` + `help` | `status="error"` + 框下 help 行 |

## 与 search.md 的边界

- **本文件**：表单/筛选等通用单行文本录入。
- **search.md**：搜索专用变体（图标、实时/触发、带分类等）；**不在本矩阵复刻搜索行**。

## 变体矩阵（Figma `2214:13286`）

还原时**按稿分组并排**，不拍平、不合并、不砍列：

```
维度 A · 尺寸：大（32）/ 小（24）
维度 B · 警告：无 / 框内 / 框外
维度 C · 内容：未输入（placeholder）/ 已输入
维度 D · 状态：默认 / 悬停 / 聚焦 / 禁用 / 禁用悬停 / 只读有背景 / 只读无背景
```

- 行数 = 2 × 3 = **6 组**；每组 **7 状态 × 2 内容 = 14 格**。
- state → antd：默认 / `disabled` / `readOnly` / `status="error"`；悬停、聚焦、禁用悬停仅在预览板用 token 画静态样张。
- 框外警告：输入框下方 `help` 行（图标 + 文案，`colorError`）。

## 主题 token 映射（`build-tokens.mjs` → `theme.ts`，引用即可）

> **不要**用全局 `colorBorder` / `colorText` / `colorTextTertiary` 充当输入框默认边框、已输入字、占位符——全局接线与输入框语义不一致。输入框专属值走 **`components.Input`**（实现轮在 `build-tokens.mjs` 新增）。

### 边框（常规，无 `status="error"`）

| 视觉语义 | Figma handle | antd token |
|---|---|---|
| 默认边框 | `divideline-color-transparent-dack` @ **16%** | `components.Input.colorBorder` |
| 悬停边框 | `component-primary` | `components.Input.hoverBorderColor`（= `colorPrimary`） |
| 聚焦边框 | `component-active` | `components.Input.activeBorderColor`（= `colorPrimaryActive`） |
| 聚焦外环 | `component-active-shadow` @ **20%** | `components.Input.activeShadow` |
| 禁用边框 | `divideline-color-transparent-light` @ **8%** | `components.Input.colorBorderDisabled`（antd 禁用态仍复用 `colorBorder`，见下） |
| 禁用悬停边框 | `line-color-transparent` @ **6%** | `components.Input.colorBorderDisabledHover`（预览板） |
| 只读 | — | 无边框 |

### 背景

| 视觉语义 | Figma handle | antd token |
|---|---|---|
| 默认 / 悬停 / 聚焦 | `white` | `colorBgContainer` / `hoverBg` / `activeBg` |
| 禁用默认 / 只读有背景 | `background-transparent-grey-hover` @ **6%** | `colorBgContainerDisabled` |
| 只读 + 警告有背景 | `warning-light-background` | `components.Input.warningReadonlyBg` |
| 禁用悬停 | `background-transparent-grey` @ **4%** | `colorBgContainerDisabledHover`（预览板） |

> **antd 限制**：`genDisabledStyle` 禁用态边框复用 `colorBorder`（16% 深分割线），与禁用 8% 浅线稿面不一致；`colorBorderDisabled` / `colorBorderDisabledHover` 写入 `components.Input` 供预览板与后续 `SensInput` 读取，真实禁用边框待组件层或 antd 扩展。

透明色在 `build-tokens.mjs` 用 `alpha(C[handle], α)` 派生；业务层可用 `tokenRgba(handle, α)`。**禁止**手写 `rgba(...)` 字面量。

### 文字

| 视觉语义 | Figma handle | antd token |
|---|---|---|
| 已输入 | `text-color-transparent` | `components.Input` 文字色（勿用全局 `colorText`←`text-color`） |
| 只读文案 | `text-color-transparent` @ **90%** | `SensInput` `--sens-input-readonly-text`（`tokenRgba` 派生） |
| 只读空值 | — | i18n `组件库.sensd-input-unset`（「未设置」） |
| 占位符（默认 / 悬停 / 聚焦 / 禁用） | `text-color-transparent-disable` @ **30%** | `colorTextPlaceholder` |
| 占位符（禁用悬停） | `text-color-transparent-disable-hover` @ **24%** | 仅预览板静态样张 |

### 警告（框内 / 框外共用边框）

| 视觉语义 | Figma handle | antd token |
|---|---|---|
| 警告边框默认 | `warning-color` | `colorError` |
| 警告边框悬停 | `warning-color-hover` | `colorErrorHover` |
| 警告边框聚焦 | `warning-color-active` | `colorErrorActive` |
| 警告聚焦外环 | `warning-color-active-shadow` @ 20% | `components.Input.errorActiveShadow` |
| 警告文案 / 框内图标 | `warning-color` | `colorError` |

### 警告图标与间距（Figma `1536:5443` / `1499:5472`）

| 场景 | 图标尺寸 | 配对字号 | token |
|---|---|---|---|
| 大输入框 · 框内 | 16×16 | 14px | `size/icon/m` |
| 小输入框 · 框内 | 14×14 | 12px | `size/icon/s` |
| 框外 help 行 | 14×14 | 12px / 行高 18px | `size/icon/s` + `inputFontSizeSM` / `typography/line-height/s` |
| 框内图标与文字 | 间距 4px | — | `spacing/horizontal/1x` |
| 框外图标与文案 | 间距 4px | — | `spacing/horizontal/1x` |
| 输入框与框外 help | 间距 4px | — | `spacing/horizontal/1x`（`input.css` `--sens-input-help-gap`） |

实现：`FieldIcons.ErrorDiamondIcon`；`SensInput` `warningPlacement` + `help` / `warningMessage`。

### 尺寸与间距

| 视觉语义 | Figma handle | antd token |
|---|---|---|
| 控件高大 / 小 | `size/component-height/m`、`size/component-height/s` | `controlHeight`、`controlHeightSM`（`size="small"`） |
| 字号 / 行高大 / 小 | — | `inputFontSize` 14 / `inputFontSizeSM` 12；行高 22 / 18 |
| 水平内边距大 / 小 | `spacing/horizontal/3x`、`spacing/horizontal/2․5x` | `paddingInline`、`paddingInlineSM` |
| 垂直内边距 | — | `paddingBlock`、`paddingBlockSM` = 0 |
| 外框高度大 / 小 | `size/component-height/m`、`/s` | antd 主题无法锁高 → **`SensInput` + `input.css`** 设 `height: controlHeight` / `controlHeightSM`；行高 22 / 18 同 CSS 变量 |
| 圆角大 / 小 | `radius/m`、`radius/s` | 全局 `borderRadius`、`borderRadiusSM`（3） |
| 宽度 | — | 128–600px（`style` / `minWidth` / `maxWidth`） |

### 全局已有、输入框须单独接线

| 全局 token | 输入框能否直接用 |
|---|---|
| `colorError` / `colorErrorHover` / `colorErrorActive` | 警告可用；边框仍须 `components.Input` |
| `colorPrimary` / `colorPrimaryActive` | 悬停/聚焦边框；**悬停用 `colorPrimary`，不是 `colorPrimaryHover`** |
| `colorBgContainer` | 白底可用 |
| `controlHeight` = 32 | 大尺寸可用 |
| `colorBorder` / `colorText` / `colorTextTertiary` | **不能**当输入框默认边框 / 已输入字 / 占位符 |

## 清空 / 重置

- 默认不开启 `allowClear`；有预置值或高频修改场景建议开启（见 `input.design.md`）。
- 出现时机：**已有输入** + 悬停或聚焦；删除图标偏左、报错菱形偏右，图标间距 `spacing/1x`（4px）。

## 工程落点（实现轮）

```
src/ui/SensInput.tsx           # SensInput + InputStatesPreview
src/ui/input.css               # 极窄作用域（仅 antd 主题做不到时）
src/ui/index.ts
src/design-system/theme.ts     # components.Input（build-tokens 生成）
build-tokens.mjs               # 新增 Input 组件 token 块
```

## 后续轮次（仍在本文档扩展）

| 章节计划 | 类型 |
|---|---|
| 文本域 | 已拆至 `textarea.md` |
| 数字输入框 | 已拆至 `inputnumber.md`（`InputNumber` + 步进器） |
