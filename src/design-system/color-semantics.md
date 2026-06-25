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

| 语义 | Figma handle | 典型基础色板来源 | antd 全局 token |
|---|---|---|---|
| 链接 | `link-color` / `link-hover-color` / `link-active-color` | 冰绽蓝 10 / 08 / 12 | `colorLink` / `colorLinkHover` / `colorLinkActive` |
| 成功 | `success-color` | 极光绿 10 | `colorSuccess` |
| 提醒 | `info-color` | 原野黄 10 | `colorWarning` ⚠️ |
| 警告（红） | `warning-color` / `warning-color-hover` / `warning-color-active` | 旭日红 10 / 08 / 12 | `colorError` / `colorErrorHover` / `colorErrorActive` ⚠️ |
| 涨 | `rise-color` | 极光绿 10 | （业务层用 handle，见 `tokens.resolved.json`） |
| 跌 | `fall-color` | 旭日红 10 | 同上 |
| 不变 | `flat-color` | — | 同上 |

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

**链接按钮不是功能色**：常规链接 / 下拉链接走 `variant="link"` + `colorLink`（状态色），**禁止** `color="primary"`。

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

1. 预览页切「绿 / 蓝」→ 主色按钮、描边按钮等功能色变，**链接仍蓝**
2. `link-color` 等状态色不随功能色换肤变
3. 产品**无暗色模式**；换肤仅指功能色（绿 ↔ 蓝）
