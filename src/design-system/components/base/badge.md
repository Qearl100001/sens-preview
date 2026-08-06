# 设计系统 skill · 基础组件：徽标 Badge

> 基础层，允许消费 antd Badge 的结构能力，但颜色、尺寸、圆角等视觉规则以 Sens token 为准，不把 antd 变量作为视觉来源。
> 设计语义与取舍见 `badge.design.md`；本文只写实现映射与约束。

## 通则
- **实现方式遵循 `conventions.md`**：真实组件 `SensBadge` 仅用 props + token；预览对照板 `BadgeStatesPreview` 负责全量静态核对。
- 徽标是配合型信息提示，优先依附宿主组件（导航项、标签项、入口按钮），不单独常驻。
- 文案/数字以最小必要信息为主；数字过大使用封顶（如 99+）。

## 变体与承载方式

| 变体 | 组件参数 | 承载方式 |
|---|---|---|
| 基础数字徽标 | `variant="count"` | antd `Badge count` 只承载角标定位；数字节点由 Sens 自绘 |
| 状态点徽标 | `variant="status"` + `status` | Sens 自绘点；不消费 antd `Badge status` 的颜色或状态语义 |
| 弱化数字徽标 | `variant="weakCount"` + `weakState` | antd `Badge count` 只承载角标定位；弱化数字节点由 Sens 自绘 |

## SensBadge API 要点
- `count?: number`、`overflowCount?: number`：数字与封顶阈值。
- `showZero?: boolean`：0 也显示。
- `variant="status"`：`status` 支持 `error/warning/success/processing/default/midnight`。
- `variant="weakCount"`：`weakState` 支持 `default/active/disabled`；`weakSurface` 支持 `transparent` / `solid`（见下）。
- `children` 可选：有 children 时徽标挂载宿主；无 children 时返回独立徽标节点。独立节点只用于状态矩阵 / 规格验收，不推荐作为业务常驻用法。

### 弱化徽标 · 双灰底（`weakSurface`）

| 承载面 | 默认/禁用底 | 典型场景 | Figma |
|---|---|---|---|
| `transparent` | `background-transparent-grey` @8%（与 Segmented `badgeBg` 同源） | 标签页标题右侧 | — |
| `solid` | `background-01` `#EBEDF0`（**无透明度**） | 带色/描边按钮右上角 | `3418:12064/12062` 默认 · `3713:15432/15430` 禁用 |

- **未传 `weakSurface`**：有 `children`（挂宿主）→ `solid`；无 `children` → `transparent`。
- 选中态两套共用：`component-light-background` + `component-primary`（随换肤）。
- 标签页内徽标由 `SensTabs` / `tabs.css` 走透明路线，**不**改用 `background-01`。

## 主题与语义
| 语义 | token / handle |
|---|---|
| 基础数字底色 | `warning-color` |
| 基础数字文字 | `white` |
| 弱化默认文本 | `text-article-color-transparent` @58% |
| 弱化默认/禁用底（透明） | `background-transparent-grey` @8% |
| 弱化默认/禁用底（实心） | `background-01` |
| 弱化选中文本 | `component-primary`（功能色，**随换肤**） |
| 弱化选中背景 | `component-light-background`（功能色浅色背景变量，**随换肤**） |
| 弱化禁用文本 | `text-color-transparent-disable`（透明度） |

### 点徽标 · 五色语义

| 稿面名 | `status` | handle | 实现 |
|---|---|---|---|
| 旭日红 | `error` | `warning-color` | Sens 自绘点 |
| 原野黄 | `warning` | `info-color` | Sens 自绘点 |
| 极光绿 | `success` | `success-color` | Sens 自绘点 |
| 冰绽蓝 | `processing` | `link-color` | Sens 自绘点 |
| **子夜黑** | `midnight` | `icon-color-transparent` | **徽标独有** · 自定义圆点（中性图标色，非 antd status） |
| 兼容默认 | `default` | `icon-color-transparent` | API 兼容态；设计矩阵仍以子夜黑作为中性点展示 |

交叉映射见 `color-semantics.md`（提醒→`colorWarning`、警告红→`colorError`）。

| 点徽标圆点尺寸 | `size/mini` → `components.Badge.dotSize` / `statusSize`（**8px**） |

**独立徽标（`weakCount`）选中态取色约束：**
- 文字、背景均走 Sens token，不写死 hex，不写状态色；换肤时随 token 链路联动。
- 文字：`component-primary`（功能色）。
- 背景：`component-light-background`（功能色浅底，与 Segmented 胶囊徽标同源）。

## 状态矩阵（Figma 2222:10668）
- 基础数字：个位数、封顶值（99+）。
- 弱化数字：默认/选中/禁用 × 个位数/99+ × **透明 / 实心** 两套灰底。
- 点徽标：旭日红/原野黄/极光绿/冰绽蓝/子夜黑。
- 实现：`BadgeStatesPreview`（`src/ui/SensBadge.tsx`）。

## 代码入口
```
src/ui/SensBadge.tsx   # SensBadge + BadgeStatesPreview
src/ui/badge.css       # 徽标窄作用域样式
src/ui/index.ts
```
