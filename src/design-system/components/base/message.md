# 设计系统 skill · 基础组件：轻提示 Message

> **状态：P0 已实现。** `SensMessage` + `/components/message`（侧栏「轻提示」）。
> 设计语义与取舍以本文为准。
> 与 **警告 Alert**（`alert.md`）不是同一组件：轻提示是浮层短反馈（白底+投影）；警告是页内条（浅底+浅描边）。
> 场景定义写在本文，**不**写入 `color-semantics.md`（颜色总则只作词典）。

## 来源

| 资料 | 链接 / 位置 | 用途 |
|---|---|---|
| Sens.Design 提示专档 | [Figma · 校准版](https://www.figma.com/design/dsN9p6XMfzPkWzsjZAHaRb/Sens.Design_%E6%8F%90%E7%A4%BA-v0.3_20220324?node-id=1417-2759&m=dev) | 提示族规范正文 |
| 轻提示 · 定义 / 类型 / 使用原则 | [Figma · 1434-5965](https://www.figma.com/design/dsN9p6XMfzPkWzsjZAHaRb/Sens.Design_%E6%8F%90%E7%A4%BA-v0.3_20220324?node-id=1434-5965&m=dev) | 轻提示定义、类型、3s 自动消失、堆叠规则 |
| 轻提示 · 典型 / 特殊场景 | [Figma · 1435-6981](https://www.figma.com/design/dsN9p6XMfzPkWzsjZAHaRb/Sens.Design_%E6%8F%90%E7%A4%BA-v0.3_20220324?node-id=1435-6981&m=dev) | 顶部居中、堆叠间距、长阅读可关闭 |
| 轻提示 · 引导操作场景 | [Figma · 1435-7164](https://www.figma.com/design/dsN9p6XMfzPkWzsjZAHaRb/Sens.Design_%E6%8F%90%E7%A4%BA-v0.3_20220324?node-id=1435-7164&m=dev) | 引导执行关键操作时取消自动消失并提供关闭 |
| 大库 · 轻提示 (Message) | [Figma · 3476-12401](https://www.figma.com/design/IBBF40Lst6uPPJf70pi0bh/%F0%9F%A6%84-%E8%AE%BE%E8%AE%A1%E7%B3%BB%E7%BB%9F_v2.1%EF%BC%88%E7%A5%9E%E7%AD%96%E7%BB%BF%EF%BC%89?node-id=3476-12401&m=dev) | 组件变体矩阵（类型 × 关闭 × 链接按钮） |
| 大库 · 链接按钮（常规） | [Figma · 1363-11431](https://www.figma.com/design/IBBF40Lst6uPPJf70pi0bh/%F0%9F%A6%84-%E8%AE%BE%E8%AE%A1%E7%B3%BB%E7%BB%9F_v2.1%EF%BC%88%E7%A5%9E%E7%AD%96%E7%BB%BF%EF%BC%89?node-id=1363-11431&m=dev) | Message 内 `link` 槽位的纯文字链接规格 |
| 状态图标 | 大库 · `1499:5473` / `1499:5470` / `1499:5471` / `1499:5472` | 常规 / 成功 / 提醒 / 警告的前置图标 |
| 状态色 / 浅底 | `tokens/source/figma/Color.json` → 状态色 `*-color` / `*-light-*` | 图标语义色 |
| 投影 | 默认投影（向下）/ **D4↓**；实现参考 `buildShadowD4` / `mask-01-transparent` | 容器投影 |

## 通则

- **一个组件 + 属性**：对外 `SensMessage`；侧栏文案 **「轻提示」**；预览独立路由（与警告分两页）。
- **形态**：白底浮层短条 + D4↓ 投影；典型用于操作后反馈（Toast / Message 感）。
- **出现位置**：前端获取交互结果后，在**当前页面顶部居中**出现；不跨页面、不替代全局通知。
- **类型五档**：常规 / 成功 / 提醒 / 警告 / **加载**（无「失效」）。
- **消失规则**：结果类轻提示默认 **3s 自动消失**；加载类在流程结束并拿到结果后立即消失。
- **堆叠规则**：3s 内连续出现多条时允许堆叠，**最新消息在上方**，垂直间距 **16px**；产品设计应避免短时间内堆叠过多消息。
- **结构开关**：`closable`（关闭）、`link`（链接按钮常规态）；可组合。
- **关闭规则**：`closable` 不是静态图标；点击关闭图标必须移除当前轻提示。悬停 / 点击态只改变关闭图标颜色，不触发关闭。
- **链接按钮**：`link` 槽位使用 `SensMessageLink`，表现为 14/22 的蓝色纯文字链接；不是 antd Button、三级按钮、二级按钮，也不是操作区按钮。
- **标准结构**：轻提示必须包含状态图标 + 文案；文案应简洁、准确、风格一致。
- **实现遵循 `conventions.md`**：props + design token；禁止硬写 hex。
- 状态色**不换肤**；文案中性色。

## 实施前评估与完成验收

> 来源：轻提示专档复盘。用于新增 Message 变体、特殊场景、队列/浮层能力前后做同一张卡验收。

- **组件语义**：轻提示只承载当前页面内的短反馈；不要把全局通知、页内 Alert、Tooltip 说明混进 Message。
- **承载方式**：基础 DOM / React 结构可自持；不要引入 `antd.message` 作为规则来源，也不要用 `.ant-*` / `!important` 压制成 Sens 外观；Message 内链接使用 `SensMessageLink`，不复用 `SensButton tone="link"`。
- **状态矩阵**：常规 / 成功 / 提醒 / 警告 / 加载五档齐全；结果类和过程类的消失逻辑分开。
- **浮层行为**：真实 Demo 必须覆盖顶部居中、连续堆叠、最新在上、16px 间距。
- **特殊场景**：长阅读场景必须可关闭且可延长停留；引导用户执行关键操作时取消自动消失，并提供关闭。
- **关闭闭环**：所有展示关闭图标的真实 Demo 都必须完成“点击关闭 → 当前轻提示消失”的验收；不能只画出关闭图标。
- **图标来源**：前置状态图标来自 SensD icon registry；loading 暂缺资产时必须记录为已知边界。
- **token 来源**：颜色、圆角、间距、尺寸、投影来自 Sens token / helper；Figma 的绝对坐标不沉为 token。
- **真实 Demo**：上方真实 Demo 与状态矩阵都要同步更新；不能只改静态矩阵。
- **文档一致**：`message.md`、真实 Demo、状态矩阵、实现边界必须一致。

## 场景规则

| 场景 | 规则 | 是否自动消失 |
|---|---|---|
| 常规结果反馈 | 创建成功、刷新成功、保存成功、删除失败等当前页面操作结果 | 默认 3s |
| 局部组件反馈 | 局部修改、单条数据操作、组件内异步结果 | 默认 3s |
| 加载中 | 流程正在执行，等待结果返回 | 结果返回后立即消失 |
| 长阅读提示 | 文案复杂、用户需要沉浸理解；非必要不使用 | 可延长，但必须可关闭 |
| 引导执行操作 | 需要用户点击关键操作才能继续 | 不自动消失，必须可关闭 |

## 堆叠 / 位置

- 轻提示容器归属于当前页面，不穿透到其他页面上下文。
- 默认出现在页面顶部居中。
- 短时间内多条并发时，最新轻提示排在最上方，旧消息向下排列。
- 消息之间垂直间距为 `spacing/vertical/4x`（16px）。
- 堆叠是兜底能力，不是鼓励产品连续触发多条提示。

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

关闭图标：资产 `SensIcon name="close"`（Figma 805:58）；默认 `icon-color-transparent`，悬停 `warning-color`，点击 `warning-color-active`；只变图标色，不加背景、描边或投影。

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
  link?: React.ReactNode;   // 链接按钮常规态（推荐 SensMessageLink）
  onClose?: () => void;
  children?: React.ReactNode;
};

type SensMessageLinkProps = {
  children?: React.ReactNode;
  href?: string;
  onClick?: () => void;
};

type SensMessageOpenOptions = {
  key?: string;
  type?: MessageType;
  content: React.ReactNode;
  link?: React.ReactNode;
  closable?: boolean;
  duration?: number | null; // 结果类默认 3000；loading 默认 null
  onClose?: () => void;
};
```

| 属性 | 含义 |
|---|---|
| `type` | 五语义之一 |
| `closable` | 显示关闭 |
| `link` | 右侧链接按钮常规态内容；不是三级 / 二级 / 操作区按钮 |
| `onClose` | 关闭回调 |
| `children` | 标题文案 |

## P1 运行时队列 API

> P1 只提供页面级运行时队列，不接 `antd.message`，不默认挂到全局 `App`。业务页面需要使用时，在当前页面或业务区域包 `SensMessageProvider`，再通过 `useSensMessage()` 调用。

```tsx
function Page() {
  return (
    <SensMessageProvider>
      <PageContent />
    </SensMessageProvider>
  );
}

function PageContent() {
  const message = useSensMessage();

  message.success("创建成功");
  message.warning("删除失败");

  const closeLoading = message.loading("加载中");
  closeLoading();

  message.open({
    type: "warning",
    content: "当前配置存在风险，请处理后继续",
    link: <SensMessageLink>去处理</SensMessageLink>,
    closable: true,
    duration: null,
  });
}
```

| API | 规则 |
|---|---|
| `message.open(options)` | 通用入口；返回关闭函数 |
| `message.default(content, options)` | 常规结果类，默认 3s 消失 |
| `message.success(content, options)` | 成功结果类，默认 3s 消失 |
| `message.info(content, options)` | 提醒结果类，默认 3s 消失 |
| `message.warning(content, options)` | 警告结果类，默认 3s 消失 |
| `message.loading(content, options)` | 加载过程类，默认不自动消失，必须由返回的关闭函数或 `destroy` 结束 |
| `message.destroy(key?)` | 不传 key 清空当前 Provider 内所有轻提示；传 key 关闭指定项 |

运行时规则：

- Host 由 `SensMessageProvider` 在当前页面上下文内创建，默认页面顶部居中。
- 不跨页面共享队列；不要把它当全局通知中心。
- 新消息插入队列顶部，旧消息向下排列。
- 消息之间垂直间距为 `spacing/vertical/4x`（16px）。
- 结果类默认 `duration = 3000`。
- `loading` 默认 `duration = null`，不自动消失。
- `duration = null` 且非 loading 时，默认补 `closable = true`，避免持久提示不可关闭。

## 尺寸 / 间距

| 项 | 规则 | token / 公式 |
|---|---|---|
| 整体高度 | **32** | `size/component-height/m` |
| 字号 / 行高 | 14 / 22 | `font-size/m`、`line-height/m` |
| 图标 | 16 | `size/icon/m` |
| 圆角 | 4 | `radius/m` |
| 水平 padding | 12 | `spacing/horizontal/3x` |
| 图标与文案 gap | 4 | `spacing/1x` |
| 文案与链接按钮 gap | 16 | `spacing/horizontal/4x`；实现中扣除容器基础 gap 后补足 |
| 链接按钮 | 14 / 22，padding 0，蓝色文字 | `SensMessageLink`：`font-size/m`、`line-height/m`、`link-color` |
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
- [x] 关闭悬停/点击警告红：默认 `icon-color-transparent`；悬停 `warning-color`；点击 `warning-color-active`
- [x] 关闭资产：`SensIcon name="close"`
- [x] 状态图标：`feedback-info` / `feedback-complete` / `feedback-warning` / `feedback-error`
- [ ] 加载状态资产：加载 GIF / 动效暂未录入 SensD，当前仍标 Missing
- [x] 链接按钮常规态：`SensMessageLink`，按 Figma `1363:11431` 从 `SensButton tone="link"` 拆出
- [x] 尺寸：整体高 `size/component-height/m`；无 `FEEDBACK_PAD_BLOCK`
- [x] 提示专档定义 / 原则 / 特殊场景正文：已收录当前页顶部居中、3s 自动消失、堆叠、长阅读、行动引导规则
- [x] P1 运行时队列 API：`SensMessageProvider` + `useSensMessage()` + `open/success/warning/loading/destroy`

## 代码入口

```text
src/ui/SensMessage.tsx
src/ui/SensMessageRuntime.tsx
src/ui/feedbackShared.tsx
src/preview/pages/MessageShowcasePage.tsx
src/design-system/components/base/message.md  # 本文
```
