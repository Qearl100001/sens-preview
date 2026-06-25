# 设计系统 skill · 基础组件：文本域 TextArea

> 基础层，直接用 antd `Input.TextArea` + 主题 token，不硬编码颜色。
> 设计语义见 `input.design.md` §3.2（待扩展）；与单行输入框**同源**，颜色/状态/警告规则**引用** `input.md`，本文只写文本域专有差异与实现映射。
> 规则源自 Sens.Design 输入框规范 v2.1 §3.2 + Figma 变体矩阵（§3.2 状态矩阵）。

## 范围（第二轮）

**只做「文本」多行输入框**（`Input.TextArea`）。

| 本轮包含 | 本轮不包含 |
|---|---|
| 大/小尺寸、默认 4.5 行、`showCount`、7 态 × 未输入/已输入、框内/框外警告 | 单行 `Input`（见 `input.md`） |
| 只读有背景 / 只读无背景、允许 `resize: vertical` | **搜索**（`search.md`） |
| 垂直 padding 5px、宽度 ≤600px | 数字输入框、组合、密码（后续轮） |

## 与 input.md 的关系（必读）

以下**整段引用 `input.md`，不在本文抄副本**：

| 主题 | 引用 |
|---|---|
| 通则（双层预览、禁用悬停=禁用、只读不参与 hover、i18n 占位符、禁止图层名） | `input.md` §通则 |
| 颜色分层（`colorPrimary` 换肤 vs `colorError` 警告） | `input.md` §通则 + `color-semantics.md` |
| 边框 / 背景 / 占位符 / 警告 token 映射表 | `input.md` §主题 token 映射（全文） |
| 聚焦光晕（`activeShadow` / `errorActiveShadow` 派生） | `input.md` §边框、§警告 |
| 只读两档 + 只读+警告（无红框 / 浅红底） | `input.md` §antd 映射 |
| 框外 help 行结构 | `input.md` §警告图标与间距 |
| 透明色派生 | `tokenRgba(handle, α)`；**禁止**手写 `rgba(...)` 字面量 |
| 禁用边框 8% 未落地（antd 限制） | `input.md` §背景 脚注 |
| 清空 / 重置行为原则 | `input.md` §清空 / 重置 + `input.design.md` |

**主题接线**：`Input.TextArea` 与 `Input` **共享** `components.Input`（`build-tokens.mjs` 已生成，`theme.ts` 已接）。**本轮不重接颜色 token**，只处理多行专有项。

**组件层灰底**：只读有背景须用 `tokenRgba("background-transparent-grey-hover", 0.06)`（或 `components.Input.colorBgContainerDisabled` 语义值），**禁止**用全局 `colorBgContainerDisabled`（会被 algorithm 压成 4% 黑）。与 `SensInput` 已验证做法一致。

**换肤**：`buildAntdTheme` 按 `FunctionalSkin` 重算 `colorPrimary` 为**横切待办**，本轮不动。

## 通则（文本域专有补充）

- **实现方式遵循 `conventions.md`**：真实组件 `SensTextArea` 仅用 props + token；预览对照板 `TextAreaStatesPreview` 负责静态核对（矩阵见下）。
- **凡本规范没写明的点，agent 会沿用 antd 默认**；与单行不一样处必须在此写死。
- **尺寸只有两种**：大 = 不传 `size`；小 = `size="small"`。不要用 antd `large`。
- 占位符走 i18n：`组件库.sensd-input-placeholder`（「请输入」），与单行共用 key。

## §3.2 专有规格（Figma 定稿）

### 高度与行数

| 项 | 值 | 说明 |
|---|---|---|
| 设计默认可见高度 | **4.5 行** | 视觉基准；**不是**单行 `controlHeight` 32/24 锁死 |
| `controlHeight` / `controlHeightSM` | 仅作 **minHeight 下限** | antd TextArea 默认 `minHeight: controlHeight` |
| `rows` | antd 仅支持整数 | 实现用 **`minHeight` 派生** 逼近 4.5 行，勿写 `rows={4.5}` |

**大（默认）minHeight 派生**（实现参考）：

```
minHeight = 4.5 × lineHeight(22) + paddingBlock×2(5×2) + border×2
         ≈ 99 + 10 + 2px 线宽 ≈ 111px（以组件层 CSS 为准）
```

**小（`size="small"`）**：行高 18，同公式替换 `lineHeightSM`。

- 内容超出默认高度时出现**纵向滚动**；`autoSize` 默认**不开启**（除非业务显式传入）。
- **`resize: vertical`**：允许用户拖拽改高（与 antd 默认一致，**不要** `resize: none`）。

### 内边距（文本域专有，单行 `paddingBlock=0` 不适用）

| 方向 | 值 | token / 说明 |
|---|---|---|
| 上下 | **5px** | §3.2 稿面值；**尚无 spacing token**，组件层 CSS 定值并注释；**不要**沿用单行 `paddingBlock=0` |
| 左右 | **12px** | `spacing/horizontal/3x` → `components.Input.paddingInline`（大）；小 → `paddingInlineSM` |

**禁止**把 `input.css` 单行锁高规则（`height: var(--sens-input-height)`）套到 `textarea`。

### 宽度

- 与单行一致：**128–600px**（`style` / `minWidth` / `maxWidth`）。
- 演示默认可用 200px 或接近 600px 通栏，以能展示 4.5 行占位符为准。

### 框内警告图标锚点（文本域专有）

- 菱形图标锚在框内 **右上角**，与 **首行文字垂直居中对齐**。
- **不是**单行 Input suffix 的「整框垂直居中」。
- 图标尺寸 / 颜色 / 与文字间距仍走 `input.md` §警告图标与间距（大 16、小 14、`spacing/horizontal/1x`）。
- 实现：`textarea.css` 覆盖 antd TextArea affix-wrapper suffix 默认 `top:0; bottom:0; align-items:center`。

### 警告聚焦光晕（组件层修补）

antd `initComponentToken` 会用 `colorErrorOutline` 盖掉 `components.Input.errorActiveShadow`。真实 `status="error"` 聚焦须在 **`SensTextArea` / `textarea.css` 窄作用域**补：

- CSS 变量 `--sens-input-error-active-shadow`：`0 0 0 2px` + `tokenRgba("warning-color-active-shadow", 0.2)`（与 `SensInput` 同源派生）。
- 选择器仅 `.sens-textarea` + `status-error` + `:focus` / `affix-wrapper-focused`。
- **严禁**全局污染、**严禁**手写 `rgba(...)` 字面量。

常规聚焦光晕仍走 `components.Input.activeShadow`（见 `input.md`）；若 TextArea 聚焦未吃到，同样在 `textarea.css` 用 `--sens-input-active-shadow` 窄作用域补（派生方式同 `SensInput`）。

## showCount（本轮包含）

| 项 | 规则 |
|---|---|
| 能力 | antd `showCount` / `count` prop，**本轮透传** |
| 默认 | **不默认开启**；表单需字数限制时由业务传入 `showCount` |
| 位置 | antd 默认：框内右下角（`ant-input-data-count`） |
| 字色 | 先用全局 **`colorTextDescription`**；稿面后续有独立 handle 再补 token |
| 超限 | antd `out-of-range` → `colorError`（与警告红一致） |
| 与 help 分工 | **限制信息**用 `showCount`；**校验错误**用框外 `help` 或框内菱形，不混用 |

**层叠**（`showCount` + `allowClear` + 框内警告）：三者同在 affix 区时，间距与 z-index 在 `textarea.css` 按 §3.2 稿面还原；清空图标 antd 默认 **右上**（`insetBlockStart: paddingXS`），与单行「清空偏左」描述不一致时**以文本域稿面为准**。

## antd 映射

| 能力 | antd | 说明 |
|---|---|---|
| 基础多行 | `<Input.TextArea />` | 大：默认；小：`size="small"` |
| 默认高度 | `style.minHeight` + 行高 CSS 变量 | 视觉 4.5 行；见 §3.2 专有规格 |
| 拖拽增高 | `resize: vertical`（默认） | 允许用户改高 |
| 字数统计 | `showCount` / `count` | 见上节 |
| 禁用 | `disabled` | 同 `input.md` |
| 只读有背景 | `readOnlyVariant="filled"` | 灰底 `tokenRgba(..., 0.06)`；空值 `sensd-input-unset` |
| 只读无背景 | `readOnlyVariant="plain"` | 多行纯文本块；警告框内为块级文本 + 右上图标 |
| 只读 + 警告 | 同 `input.md` 映射 | 有背景浅红底、无红框；无背景不走红框 |
| 框内警告 | `warningPlacement="inside"` | `status="error"` + suffix；图标右上/首行对齐 |
| 框外警告 | `warningPlacement="outside"` + `help` | 框下 help 行 |
| 校验失败 | `status="error"` 或 `warningPlacement` | sensd「警告」= antd `error` |

`warningPlacement` / `readOnlyVariant` / `help` / `warningMessage` API **与 `SensInput` 对齐**，便于共享 `InputHelpRow`、`ErrorDiamondIcon` 与 i18n。

## 与 input.md / search.md 的边界

| 场景 | 文档 |
|---|---|
| 单行文本 | `input.md` |
| 多行长文本 | **本文** |
| 搜索 | `search.md` |

## 变体矩阵（Figma §3.2 状态矩阵）

**不复制**单行 `2214:13286` 的 12×7 / 6 组 × 14 格。文本域矩阵维度：

```
维度 A · 变体行：基础（无警告）/ 错误·警告（框外为主）/ 框内标记
维度 B · 状态列：默认 / 悬停 / 聚焦 / 只读 / 禁用 / 只读·禁用-有背景 / 只读·禁用-无背景
维度 C · 内容：未输入（placeholder）/ 已输入
```

- 格数 = **3 × 7 × 2 = 42**（未输入块 21 格 + 已输入块 21 格）。
- 悬停、聚焦、禁用悬停：预览板用 token 静态样张（见 `input.md` §变体矩阵）。
- 框外警告：输入框下方 help（图标 + 文案，`colorError`）。
- 框内标记：红框 + 右上菱形，无下方 help。
- 还原时**按稿分组并排**，不拍平、不合并、不砍列。

> Figma node id 待设计稿标注后补入本文。

## 工程落点（实现轮）

```
src/ui/SensTextArea.tsx        # SensTextArea + TextAreaStatesPreview（矩阵可后置）
src/ui/textarea.css            # 4.5 行 minHeight、padding 5/12、右上警告、聚焦光晕；禁单行锁高
src/ui/index.ts
```

**共享、不复制**：

- 颜色变量派生：与 `SensInput` 同源（`useSensInputHeightStyle` 或抽 `useSensInputFieldVars` 仅输出 CSS 变量，**不含**单行 `height` 锁高）。
- `FieldIcons.ErrorDiamondIcon`、`InputHelpRow` 逻辑可 import 或最小复用。

**本轮不改**：

- `build-tokens.mjs` / `theme.ts` 的 `components.Input` 颜色块
- `buildAntdTheme` / `functional-skin.ts`（换肤横切）

## 预览与验收

- 真实组件：DevTools 抽检聚焦光晕（常规绿 / 警告红派生）、只读灰底 `rgba(0, 21, 64, 0.06)`。
- 预览板：`TextAreaStatesPreview` 待矩阵 node 确认后实现；结构 3 行 × 7 列 × 内容双块。
