# 设计系统 skill · 基础组件：警告 Alert

> **状态：P0 已实现。** `SensAlert` + `/components/alert`（侧栏「警告」）。
> 设计语义与取舍以本文为准。
> 与 **轻提示 Message**（`message.md`）不是同一组件：警告是页内条（浅底+浅描边）；轻提示是浮层短反馈（白底+投影）。
> 场景定义写在本文，**不**写入 `color-semantics.md`。

## 来源

| 资料 | 链接 / 位置 | 用途 |
|---|---|---|
| Sens.Design 提示专档 | [Figma · 校准版](https://www.figma.com/design/dsN9p6XMfzPkWzsjZAHaRb/Sens.Design_%E6%8F%90%E7%A4%BA-v0.3_20220324?node-id=1417-2759&m=dev) | 提示族规范正文（含警告条场景） |
| 大库 · 警告 (Alert) | [Figma · 3476-12400](https://www.figma.com/design/IBBF40Lst6uPPJf70pi0bh/%F0%9F%A6%84-%E8%AE%BE%E8%AE%A1%E7%B3%BB%E7%BB%9F_v2.1%EF%BC%88%E7%A5%9E%E7%AD%96%E7%BB%BF%EF%BC%89?node-id=3476-12400&m=dev) | 组件变体矩阵（类型 × 辅助文案 × 关闭 × 链接按钮） |
| 状态图标 | 大库 · `1499:5473` / `1499:5470` / `1499:5471` / `1499:5472` | 常规 / 成功 / 提醒 / 警告的前置图标 |
| 状态色 / 浅底 / 浅描边 | `Color.json` → `@link-light-*` / `@success-light-*` / `@info-light-*` / `@warning-light-*` 等 | 条背景与描边 |

## 通则

- **一个组件 + 属性**：对外 `SensAlert`；侧栏文案 **「警告」**；预览独立路由（与轻提示分两页）。
- **形态**：语义浅色底 + 浅色描边的页内提示条；可带辅助文案。
- **类型四档**：常规 / 成功 / 提醒 / 警告（**无加载、无失效**）。
- **结构开关**：`description`（辅助文案）、`closable`、`link`（链接按钮）。
- **实现遵循 `conventions.md`**：props + design token；禁止硬写 hex。
- 状态色**不换肤**；标题/辅助文案中性色。

## 已确认决策

| 决策 | 结论 | 日期 |
|---|---|---|
| 与轻提示拆分 | 两个组件、两份 md、两个预览页 | 2026-07-10 |
| 命名 | 组件 `SensAlert`；侧栏「警告」 | 2026-07-10 |
| `type` 枚举 | `default` \| `success` \| `info` \| `warning`（`info`=提醒，`warning`=警告红） | 2026-07-10 |
| 无 loading type | 加载仅属于轻提示 | 2026-07-10 |
| 常规色 | 图标 `link-color`；浅底 `link-light-background`；浅描边 `link-light-outline` | 2026-07-10 |
| P0 实现 | 组件 + 预览页；关闭细交互 / 尺寸定稿仍待补 | 2026-07-10 |

## 语义场景 × token

标题：`tokenRgba("text-color-transparent", 0.9)`。
辅助文案：色 `tokenRgba("text-sub-color-transparent", 0.58)`；字号/行高 `font-size/s` / `line-height/s`（Figma 4212:16045 · 中文/辅助信息 12/18）。

| `type` | 中文 | 图标色 | 浅底 | 浅描边 |
|---|---|---|---|---|
| `default` | 常规 | `link-color` | `link-light-background` | `link-light-outline` |
| `success` | 成功 | `success-color` | `success-light-background` | `success-light-outline` |
| `info` | 提醒 | `info-color` | `info-light-background` | `info-light-outline` |
| `warning` | 警告 | `warning-color` | `warning-light-background` | `warning-light-outline` |

四档浅底 / 描边 / 图标均走状态色 `*-color` / `*-light-background` / `*-light-outline`（常规 = 链接链）。

## 状态图标

| `type` | 图标 | Figma 节点 | 说明 |
|---|---|---|---|
| `default` | `SensIcon name="feedback-info"` | `1499:5473` | 常规信息图标，颜色走 `link-color` |
| `success` | `SensIcon name="feedback-complete"` | `1499:5470` | 完成图标，颜色走 `success-color` |
| `info` | `SensIcon name="feedback-warning"` | `1499:5471` | SensD「提醒」图标，颜色走 `info-color` |
| `warning` | `SensIcon name="feedback-error"` | `1499:5472` | SensD「警告红」图标，颜色走 `warning-color` |

Alert 前置状态图标必须来自 SensD icon registry，不使用 antd filled status icon。

## SensAlert API

```ts
type AlertType = "default" | "success" | "info" | "warning";

type SensAlertProps = {
  type?: AlertType;           // 默认 default
  description?: React.ReactNode; // 辅助文案
  closable?: boolean;
  link?: React.ReactNode;     // 链接按钮区（预览用 SensButton tone="link"）
  onClose?: () => void;
  children?: React.ReactNode; // 标题
};
```

| 属性 | 含义 |
|---|---|
| `type` | 四语义之一（无 `loading`） |
| `description` | 辅助文案；有则双行结构 |
| `closable` | 显示关闭 |
| `link` | 链接按钮区 |
| `onClose` | 关闭回调 |
| `children` | 标题 |

## 尺寸 / 间距

| 项 | 规则 | token / 公式 |
|---|---|---|
| 单行整体高度 | **36** | `size/component-height/l` |
| 有辅助文案 | 不锁高；上下 pad 公式 | `(size/component-height/l − line-height/m) / 2`（=7） |
| 字号 / 行高（标题） | 14 / 22 | `font-size/m`、`line-height/m` |
| 字号 / 行高（辅助） | 12 / 18 | `font-size/s`、`line-height/s` |
| 标题↔辅助 gap | 4 | `spacing/1x` |
| 图标 | 16 | `size/icon/m` |
| 圆角 | 4 | `radius/m` |
| 水平 padding | 12 | `spacing/horizontal/3x` |
| 图标与文案 gap | 4 | `spacing/1x` |
| 默认宽（样张） | 400 | 业务可覆写；是否默认宽 To Confirm |

无辅助：整体高度 + 垂直居中。有辅助：公式 pad + hug；**不**新增 5/7 spacing 档。

## 与相邻组件边界

| 组件 | 关系 |
|---|---|
| 轻提示 `SensMessage` | 浮层白底+投影；多 `loading` type |
| 标签 `SensTag` status | 无条容器；语义集合不同（含失效） |
| 表单框内警告 | Input / TextArea 的 `warningPlacement`，不是本条组件 |

## 待补

- [x] 常规色：`link-color` / `link-light-background` / `link-light-outline`
- [x] P0：`SensAlert` + `/components/alert` + 侧栏「警告」
- [x] 辅助文案色 `@0.58`；字号/行高 `font-size/s` / `line-height/s`
- [ ] 关闭悬停/点击警告红
- [x] 关闭资产：`SensIcon name="close"`
- [x] 状态图标：`feedback-info` / `feedback-complete` / `feedback-warning` / `feedback-error`
- [ ] 链接按钮细交互（现由调用方传入 `SensButton`）
- [x] 尺寸：单行 `size/component-height/l`；有辅助公式 pad + hug；标题↔辅助 `spacing/1x`
- [ ] 默认宽 400 To Confirm
- [ ] 抽取专档定义/原则正文（按需）

## 代码入口

```text
src/ui/SensAlert.tsx
src/ui/feedbackShared.tsx
src/preview/pages/AlertShowcasePage.tsx
src/design-system/components/base/alert.md  # 本文
```
