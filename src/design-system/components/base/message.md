# 设计系统 skill · 基础组件：轻提示 Message

> **状态：P0 已实现。** `SensMessage` + `/components/message`（侧栏「轻提示」）。
> 设计语义与取舍以本文为准。
> 与 **警告 Alert**（`alert.md`）不是同一组件：轻提示是浮层短反馈（白底+投影）；警告是页内条（浅底+浅描边）。
> 场景定义写在本文，**不**写入 `color-semantics.md`（颜色总则只作词典）。

## 来源

| 资料 | 链接 / 位置 | 用途 |
|---|---|---|
| Sens.Design 提示专档 | [Figma · 校准版](https://www.figma.com/design/dsN9p6XMfzPkWzsjZAHaRb/Sens.Design_%E6%8F%90%E7%A4%BA-v0.3_20220324?node-id=1417-2759&m=dev) | 提示族规范正文 |
| 大库 · 轻提示 (Message) | [Figma · 3476-12401](https://www.figma.com/design/IBBF40Lst6uPPJf70pi0bh/%F0%9F%A6%84-%E8%AE%BE%E8%AE%A1%E7%B3%BB%E7%BB%9F_v2.1%EF%BC%88%E7%A5%9E%E7%AD%96%E7%BB%BF%EF%BC%89?node-id=3476-12401&m=dev) | 组件变体矩阵（类型 × 关闭 × 链接按钮） |
| 状态图标 | 大库 · `1499:5473` / `1499:5470` / `1499:5471` / `1499:5472` | 常规 / 成功 / 提醒 / 警告的前置图标 |
| 状态色 / 浅底 | `tokens/source/figma/Color.json` → 状态色 `*-color` / `*-light-*` | 图标语义色 |
| 投影 | 默认投影（向下）/ **D4↓**；实现参考 `buildShadowD4` / `mask-01-transparent` | 容器投影 |

## 通则

- **一个组件 + 属性**：对外 `SensMessage`；侧栏文案 **「轻提示」**；预览独立路由（与警告分两页）。
- **形态**：白底浮层短条 + D4↓ 投影；典型用于操作后反馈（Toast / Message 感）。
- **类型五档**：常规 / 成功 / 提醒 / 警告 / **加载**（无「失效」）。
- **结构开关**：`closable`（关闭）、`link`（链接按钮）；可组合。
- **实现遵循 `conventions.md`**：props + design token；禁止硬写 hex。
- 状态色**不换肤**；文案中性色。

## 已确认决策

| 决策 | 结论 | 日期 |
|---|---|---|
| 与警告拆分 | 两个组件、两份 md、两个预览页 | 2026-07-10 |
| 命名 | 组件 `SensMessage`；侧栏「轻提示」 | 2026-07-10 |
| `type` 枚举 | `default` \| `success` \| `info` \| `warning` \| `loading`（`info`=提醒，`warning`=警告红） | 2026-07-10 |
| 加载色 | 不新增 `@loading-color`；图标走中性 icon token | 2026-07-10 |
| 常规图标色 | `link-color`（容器仍白底+D4，不用浅底/描边） | 2026-07-10 |
| P0 实现 | 组件 + 预览页；关闭细交互 / 尺寸定稿仍待补 | 2026-07-10 |

## 语义场景 × token

标题文案：`tokenRgba("text-color-transparent", 0.9)`。
容器底：`white`。投影：D4↓（`mask-01-transparent` 派生，禁止手写 rgba）。

| `type` | 中文 | 图标色 | 容器 | 备注 |
|---|---|---|---|---|
| `default` | 常规 | `link-color` | `white` + D4↓ | 与警告常规同源图标；不用 `link-light-*` |
| `success` | 成功 | `success-color` | 同上 | |
| `info` | 提醒 | `info-color` | 同上 | 对齐 color-semantics「提醒」 |
| `warning` | 警告 | `warning-color` | 同上 | 对齐「警告红」；非 antd `colorWarning` |
| `loading` | 加载 | `icon-color-transparent`（或稿面指定中性） | 同上 | **无独立加载色** |

关闭图标：资产 `SensIcon name="close"`（Figma 805:58）；P0 默认中性 `icon-color-transparent`；悬停/点击警告红 → 待补（可参考 Tag 移除规则）。

## 状态图标

| `type` | 图标 | Figma 节点 | 说明 |
|---|---|---|---|
| `default` | `SensIcon name="feedback-info"` | `1499:5473` | 常规信息图标，颜色走 `link-color` |
| `success` | `SensIcon name="feedback-complete"` | `1499:5470` | 完成图标，颜色走 `success-color` |
| `info` | `SensIcon name="feedback-warning"` | `1499:5471` | SensD「提醒」图标，颜色走 `info-color` |
| `warning` | `SensIcon name="feedback-error"` | `1499:5472` | SensD「警告红」图标，颜色走 `warning-color` |
| `loading` | 暂用加载 spinner | Missing | 加载 GIF / 动效资产暂未录入 SensD |

Message 前置状态图标必须来自 SensD icon registry；除 loading 临时态外，不使用 antd filled status icon。

## SensMessage API

```ts
type MessageType = "default" | "success" | "info" | "warning" | "loading";

type SensMessageProps = {
  type?: MessageType;       // 默认 default
  closable?: boolean;
  link?: React.ReactNode;   // 链接按钮区（预览用 SensButton tone="link"）
  onClose?: () => void;
  children?: React.ReactNode;
};
```

| 属性 | 含义 |
|---|---|
| `type` | 五语义之一 |
| `closable` | 显示关闭 |
| `link` | 右侧链接按钮内容 |
| `onClose` | 关闭回调 |
| `children` | 标题文案 |

## 尺寸 / 间距

| 项 | 规则 | token / 公式 |
|---|---|---|
| 整体高度 | **32** | `size/component-height/m` |
| 字号 / 行高 | 14 / 22 | `font-size/m`、`line-height/m` |
| 图标 | 16 | `size/icon/m` |
| 圆角 | 4 | `radius/m` |
| 水平 padding | 12 | `spacing/horizontal/3x` |
| 图标与文案 gap | 4 | `spacing/1x` |
| 投影 | D4↓ | `buildShadowD4` |

单行用整体高度 + 垂直居中；**不**单独录入上下 pad 5。

## 与相邻组件边界

| 组件 | 关系 |
|---|---|
| 警告 `SensAlert` | 页内条、浅底描边；**无** `loading` type |
| 标签 `SensTag` status | 圆点+文案，无浮层容器；有失效、无加载 |
| 便签 Tooltip | 深色小浮层说明，非状态反馈条 |

## 待补

- [x] 常规图标色：`link-color`
- [x] P0：`SensMessage` + `/components/message` + 侧栏「轻提示」
- [ ] 关闭悬停/点击警告红
- [x] 关闭资产：`SensIcon name="close"`
- [x] 状态图标：`feedback-info` / `feedback-complete` / `feedback-warning` / `feedback-error`
- [ ] 加载状态资产：加载 GIF / 动效暂未录入 SensD，当前仍标 Missing
- [ ] 链接按钮细交互（现由调用方传入 `SensButton`）
- [x] 尺寸：整体高 `size/component-height/m`；无 `FEEDBACK_PAD_BLOCK`
- [ ] 抽取提示专档定义/原则正文（按需）

## 代码入口

```text
src/ui/SensMessage.tsx
src/ui/feedbackShared.tsx
src/preview/pages/MessageShowcasePage.tsx
src/design-system/components/base/message.md  # 本文
```
