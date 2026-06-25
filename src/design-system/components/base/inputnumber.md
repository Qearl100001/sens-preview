# 设计系统 skill · 基础组件：数字输入框 InputNumber

> 基础层，直接用 antd `InputNumber` + 主题 token，不硬编码颜色。
> 设计语义见 `input.design.md` §3.3；整框颜色/状态/警告规则**引用** `input.md`，本文只写数字框与步进器专有差异。
> Figma：`17465:62974`（状态矩阵）、`17464:62740`（步进器交互）、`17460:62565` / `17460:62566`（箭头图标，母版 `2535:10560` / `2535:10559`）。

## 范围（第三轮）

**只做带步进器的数字输入框**（`InputNumber` + `controls`）。

| 本轮包含 | 本轮不包含 |
|---|---|
| 大/小尺寸、默认宽 188px、框内/框外警告、7+1 态矩阵 | 单行 `Input`（`input.md`）、文本域（`textarea.md`） |
| 步进器箭头色链、分隔线、10×10 图标 | 组合 / 密码 / 搜索变体 |

## 与 input.md 的关系

| 主题 | 引用 |
|---|---|
| 通则、颜色分层、边框/背景/占位符/警告 token | `input.md` §通则 + §主题 token 映射 |
| 只读两档、框外 help、框内菱形 | `input.md` §antd 映射 |
| 透明色派生 | `tokenRgba(handle, α)` |
| 禁用边框 8% 已知限制 | `input.md` 脚注 |

**主题接线**：`InputNumber` **不继承** `components.Input`（antd 独立 `genStyleHooks('InputNumber')`）。`build-tokens.mjs` 用 **`INPUT_FIELD_TOKENS` 脚本层共享** + **`components.InputNumber` 独立块** 接线。

## 整框尺寸

| 项 | 值 |
|---|---|
| 默认宽度 | **188px**（`components.InputNumber.controlWidth`） |
| 范围 | **108–600px** |
| 控件高 | 大 32 / 小 24（`controlHeight` / `controlHeightSM`） |
| 数字对齐 | **左对齐**（antd `textAlign: start`） |

## 步进器专有（Figma `17464:62740`）

| 项 | 值 | 说明 |
|---|---|---|
| 步进器宽度 | **17px**（Figma 实测；`handleWidth`） | 占位曾用 22px，以稿为准 |
| 箭头图标 | **10×10** | `StepperUpIcon` / `StepperDownIcon`（`17460:62565` / `17460:62566`） |
| 常显策略 | **`handleVisible: 'auto'`** | 真实组件 hover/focus 才露出步进器 |
| 框内警告默认 | Figma `17471:64477` | 警告 icon 距右 **`spacing/horizontal/3x`（12px）**；无步进器 |
| 框内警告悬停 | Figma `17471:64485` | 步进器露出；icon 与步进器间距 **`spacing/horizontal/1x`（4px）**；icon **左移过渡** |
| 分隔线 | `divideline-color-transparent-dack @16%` | = Input 默认边框，复用 `handleBorderColor` / `colorBorder` |
| hover 底色 | **无** | `handleActiveBg: transparent` + CSS 去掉 handler `:active` 背景 |

### 箭头图标色

| 状态 | Token | 实现 |
|---|---|---|
| 默认 | `icon-color-transparent` | `colorIcon` / CSS 变量默认 |
| hover | `component-primary` | `handleHoverColor`（换肤） |
| 点击 | `component-active` | 窄作用域 CSS `:active` + `--sens-inputnumber-handler-active-color` |
| 禁用 | `icon-color-transparent-disable` | `tokenRgba` 派生 |
| 禁用悬停 | `icon-color-transparent-disable-hover` | 预览板静态样张 |

## 预览 vs 真实组件

- **SensInputNumber**：`handleVisible: 'auto'`，默认列无箭头。
- **InputNumberStatesPreview**：静态强制露出步进器（`inputnumber-preview.css`），步进器 hover/点击/禁用悬停列用 token 画样张；**不改真实组件**。

## 变体矩阵（Figma `17465:62974`）

```
维度 A · 警告：无 / 框外 / 框内
维度 B · 状态：默认 / 悬停 / 点击 / 激活 / 禁用 / 只读有背景 / 只读无背景 / 禁用悬停
维度 C · 内容：未输入 / 已输入（100）
```

格数 = **3 × 8 × 2 = 48**。

## 工程落点

```
src/ui/SensInputNumber.tsx
src/ui/inputnumber.css
src/ui/inputnumber-preview.css
build-tokens.mjs → components.InputNumber
```
