# 颜色语义层 · 功能色 / 状态色 / 基础色板

> sensd 基于 antd，但色板语义是自家的。**业务代码只引用语义 handle（`@link-color` 等），不直接引用基础色板路径。**

## 三层关系

```
基础色板（原料，仅设计/Foundation）  →  语义 token（@handle，代码用这层）  →  antd / 组件
```

| 层级 | 示例 | 换肤 | 代码能否直接用 |
|---|---|---|---|
| 基础色板 | `基础色板/冰绽蓝/10` | — | **禁止**（仅 `tokens.resolved.json` 的 `colorByPath` 审计用） |
| 功能色 | `@component-primary` | **可换** | `c["component-primary"]` / `colorPrimary` |
| 状态色 | `@link-color`、`@warning-color` | **固定** | `c["link-color"]` / `colorLink` 等 |
| 中性色 | `@text-color`、`@outline-color` | 随模式 | `c["text-color"]` 等 |

## 状态色（不随换肤变）

| 语义 | Figma handle | 典型基础色板来源 | 默认 | Hover | Active / Pressed | antd 全局 token |
|---|---|---|---|---|---|---|
| 链接 | `link-color` / `link-hover-color` / `link-active-color` | 冰绽蓝 10 / 08 / 12 | `link-color` | `link-hover-color` | `link-active-color` | `colorLink` / `colorLinkHover` / `colorLinkActive` |
| 成功 | `success-color` | 极光绿 10 | `success-color` | 通常无 | 通常无 | `colorSuccess` |
| 提醒 | `info-color` | 原野黄 10 | `info-color` | 通常无 | 通常无 | `colorWarning` ⚠️ |
| 警告（红） | `warning-color` / `warning-color-hover` / `warning-color-active` | 旭日红 10 / 08 / 12 | `warning-color` | `warning-color-hover` | `warning-color-active` | `colorError` / `colorErrorHover` / `colorErrorActive` ⚠️ |
| 错误 | 复用 `warning-color` 链 | 旭日红 | `warning-color` | 被动错误通常无 | 被动错误通常无 | `colorError` ⚠️ |
| 危险操作 | 复用 `warning-color` 链 | 旭日红 10 / 08 / 12 | `warning-color` | `warning-color-hover` | `warning-color-active` | `colorError` / `Button danger` |
| 涨 | `rise-color` | 极光绿 10 | `rise-color` | 无 | 无 | 业务层 handle |
| 跌 | `fall-color` | 旭日红 10 | `fall-color` | 无 | 无 | 同上 |
| 不变 | `flat-color` | — | `flat-color` | 无 | 无 | 同上 |

### ⚠️ 故意的 antd 名↔语义名交叉（不要「纠正」）

sensd 中文语义与 antd 默认英文名不一致，**`build-tokens.mjs` / `theme.ts` 已按下面映射，审计时保持现状**：

| sensd 语义 | handle | antd token | 说明 |
|---|---|---|---|
| **提醒**（琥珀黄） | `info-color` | `colorWarning` | antd `Alert type="warning"`、`Tag color="warning"` |
| **警告**（红） | `warning-color` | `colorError` | antd `Alert type="error"`、`Button danger` |

## 功能色（可换肤）

| 语义 | handle | antd |
|---|---|---|
| 主色 / 一级按钮 | `component-primary` / `component-hover` / `component-active` | `colorPrimary` / `colorPrimaryHover` / `colorPrimaryActive` |
| 二级描边 hover | `component-hover` | Button `defaultHoverColor` 等 |

功能色的默认 / Hover / Active 映射只适用于使用主题功能色的功能性控件，不是所有组件的全局状态规则。

**链接按钮不是功能色**：常规链接 / 下拉链接走 `variant="link"` + `colorLink`（状态色），**禁止** `color="primary"`。链接按钮必须使用 `link-color` / `link-hover-color` / `link-active-color`，不能因为处于换肤环境就变成绿色。

成功、提醒、涨跌和不变是被动语义，不自动生成 Hover / Active。它们如果承载在可交互控件中，应按控件职责使用功能色或危险操作色；警告 / 错误 / 危险当前共用旭日红语义链，但错误状态通常是被动展示，危险操作才使用完整交互链。

## 聚焦外环与激活投影

| 控件语义 | 聚焦外环 | 激活投影 | 说明 |
|---|---|---|---|
| 普通功能控件 | `component-active-shadow` | `component-active-shadow` | 跟随当前功能色，当前 alpha 通常为 20% |
| 警告 / 危险控件 | `warning-color-active-shadow` | `warning-color-active-shadow` | 固定使用旭日红语义 |
| 链接 | `link-active-color` 的文字、下划线或蓝色 focus 指示 | 不默认产生投影 | 不得回退到绿色功能投影 |
| 被动状态标识 | 无 | 无 | 状态标识本身不因展示而增加交互反馈 |

聚焦外环服务于键盘 `focus-visible`，激活投影服务于按下或激活反馈。两者可以共享同一语义源，但不是同一个交互状态。当前没有独立的 `link-focus-shadow` handle；是否增加，留到具体组件验收时决定。

## 组件应用矩阵

Figma「定制色_v2.1」属于语义颜色的组件应用层，覆盖 Badge、Switch、标签 / 叠加标签、标签 / 多彩标签等组件。它在语义 handle 之上继续细分背景、文字、图标的默认 / 悬停 / 点击 / 禁用状态，并记录这些定制色是否跟随换肤。

这类明细应进入 Color Foundation 与对应组件文档，不应被压缩成一条全局“默认 / Hover / Active”规则；实现时必须以组件自身的应用矩阵为准。

## 组件怎么用

| 场景 | 正确 | 错误 |
|---|---|---|
| 链接按钮、表格操作列 | `variant="link"` 或 `colorLink` | `color="primary" variant="link"` |
| 一级绿按钮 | `color="primary" variant="solid"` | `colorLink` |
| 涨跌停 | `rise-color` / `fall-color` / `flat-color` | 直接用 `极光绿/10` 或 `success-color` 冒充 |
| 读色值 | `tokens.color["link-color"]`、`theme.useToken().colorLink` | `colorByPath["基础色板/…"]`、硬编码 `#3170EB` |

## 审计命令（只报告，不自动改）

见 `color-audit-report.md`。扫出清单后人工确认再改。

## 换肤验收

1. v0.9 起预览通过 `SensAppearanceProvider` 默认同步绿/蓝；组件功能色用 `functionalCssVar("--sens-skin-*")`（无 Provider 回落绿 handle）；antd 主色由 `buildAntdThemeForSkin` 灌入。
2. `link-color` 等状态色不随功能色换肤变化，链接始终保持蓝色状态链。
3. 产品**无暗色模式**。
