# Size Foundation

> 主要来源：`/Users/liyuwen/Downloads/Mode 1.tokens 2.json`、`src/design-system/tokens.resolved.json`、已实现组件文档。  
> 当前状态：草稿校准中；本文件先记录尺寸、图标尺寸、组件高度和少量组件专属尺寸候选，不代表所有组件已完成 token 接入。

## 1. 定位

Size 负责统一固定宽高、图标尺寸、组件高度和组件专属尺寸规则。

Spacing 只负责 padding、margin、gap、元素间距；高度、宽度、图标尺寸不应借用 spacing token。比如 `28px` 即使等于 `spacing/7x`，也不能因为数值相同就把它当作控件高度 token。

## 2. 基础 Size Scale

当前 `tokens.resolved.json` 已有：

| token | 值 | 用途 |
|---|---:|---|
| `size/2xs` | 6 | 极小尺寸（状态标签小圆点） |
| `size/mini` | 8 | 极小尺寸（状态标签大圆点等） |
| `size/xxxs` | 14 | 小图标、错误图标等候选 |
| `size/xxs` | 16 | 常规图标 |
| `size/xs` | 20 | 小组件高度、标签高度候选 |
| `size/s` | 24 | 小控件高度 |
| `size/m` | 32 | 常规控件高度 |
| `size/l` | 36 | 中等控件高度 / FAB 交叉轴 |
| `size/xl` | 40 | 较大组件高度 / 信息区高度候选 |
| `size/xxl` | 48 | logo / 缩略图候选 |
| `size/xxxl` | 56 | 表格行高候选 |

## 3. Icon Size

当前 `tokens.resolved.json` 已有：

| token | 值 | 用途 |
|---|---:|---|
| `size/icon/mini` | 8 | 极小图标 |
| `size/icon/xs` | 12 | 小关闭图标等 |
| `size/icon/s` | 14 | 错误提示图标、小状态图标 |
| `size/icon/m` | 16 | more、down、常规操作图标 |

Icon / Logo 仍需要后续单独做图标库规则。Size Foundation 只记录尺寸 token，不定义图标资产、绘制规则、命名或语义。

## 4. Component Height

当前 `tokens.resolved.json` 已有：

| token | 值 | 当前用途 / 候选用途 |
|---|---:|---|
| `size/component-height/xs` | 20 | Tag 小尺寸高度候选 |
| `size/component-height/s` | 24 | antd `controlHeightSM`，小尺寸输入类历史规则 |
| `size/component-height/m` | 32 | antd `controlHeight`，常规输入框、按钮、搜索等 |
| `size/component-height/l` | 36 | FAB 交叉轴、部分中等控件 |
| `size/component-height/xl` | 40 | 表格信息区、较大信息区候选 |
| `size/component-height/xxl` | 48 | 大尺寸组件候选 |
| `size/component-height/xxxl` | 56 | 表格行高 |
| `size/component-height/title-bar` | 72 | 页面标题栏默认高度 |
| `size/component-height/title-bar-with-description` | 94 | 页面标题栏带辅助文案高度 |

已有映射：

- 常规输入框高度：`size/component-height/m = 32`。
- 表格行高：`size/component-height/xxxl = 56`。
- 页面标题栏默认高度：`size/component-height/title-bar = 72`。
- 页面标题栏带辅助文案高度：`size/component-height/title-bar-with-description = 94`。
- 当前 antd 小尺寸输入历史映射为 `size/component-height/s = 24`。

待确认：

- 若后续设计明确“小输入框 = 28px”，不要复用 `spacing/7x`。建议新增输入类专属高度，例如 `size/component-height/input-sm = 28`，或在确认它适用于多个组件后再提升为通用 component height 档位。
- 标题栏高度虽然进入 `size/component-height/*`，但仍属于组件专属尺寸，不建议反推回基础 `size/*` 档位。

## 5. Tag 尺寸（Figma 4.2 / 4.3 已核对）

Tag 的高度、padding、gap 和字体属于组件专属尺寸规则，不应把专属 padding 硬塞进全局 spacing。

口径来自 Sens.Design 标签 v2.1 · 4.2 / 4.3；组件 API 用 `size="large" | "small"`（默认 `large`），详见 `src/design-system/components/base/tag.md`。样张常为 2×，读实例时 ÷2。

| 规则 | 值 / token | 说明 |
|---|---|---|
| `tag/height/l` | `size/component-height/s = 24` | `large` 高度（固定，无上下 padding） |
| `tag/height/s` | `size/component-height/xs = 20` | `small` 高度（固定，无上下 padding） |
| `tag/font-size/l` | `font-size/m = 14` | `large` 文字 |
| `tag/font-size/s` | `font-size/s = 12` | `small` 文字 |
| `tag/padding-inline/l` | `spacing/horizontal/2x = 8` | `large` 左右 padding |
| `tag/padding-inline/s` | `spacing/horizontal/1.5x = 6` | `small` 左右 padding |
| `tag/gap` | `spacing/1x = 4` | 标签内部图文间距；亦为同组横/竖间距（4.3） |
| `tag/max-width/l` | 112 | 大尺寸文案默认最大宽度，可视情况调整 |
| `tag/max-width/s` | 96 | 小尺寸文案默认最大宽度，可视情况调整 |
| `tag/icon/l` | `size/icon/m = 16` | `large` 前导图标 |
| `tag/icon/s` | `size/icon/s = 14` | `small` 前导图标 |
| `tag/close/l` | `size/icon/s = 14` | `large` 关闭图标 |
| `tag/close/s` | `size/icon/xs = 12` | `small` 关闭图标 |
| `tag/status-dot/l` | `size/mini = 8` | `large` 状态圆点 |
| `tag/status-dot/s` | `size/2xs = 6` | `small` 状态圆点 |
| `tag/radius` | `radius/s = 3` | 两档共用 |
| `tag/font-weight` | `font-weight/regular = 400` | 标签文字 |

后续实现 `SensTag` 时，将上表专属项转入组件 token，不在业务页面临时硬写。

## 6. Card 相关使用

Card 预览和后续 Card 组件可先消费：

| 场景 | token / 规则 |
|---|---|
| logo / 缩略图样张 | `size/xxl = 48` |
| more / down 图标 | `size/icon/m = 16` |
| error 图标 | `size/icon/s = 14` |
| tag 高度（小 / 大） | `size/component-height/xs = 20` / `size/component-height/s = 24` |
| 表格行高参考 | `size/component-height/xxxl = 56` |

Logo 大小会随业务线调整，`size/xxl = 48` 只作为当前样张候选，不作为所有业务 logo 的固定规则。

## 7. 代码落地规则

- 高度、宽度、图标尺寸优先使用 `size/*`、`size/icon/*`、`size/component-height/*` 或组件专属 size token。
- 不用 `spacing/*` 代替高度或宽度，即使数值相同。
- 缺少尺寸 token 时，先记录是通用 size 缺口，还是组件专属 size 缺口。
- `tokens.resolved.json` 和 `theme.ts` 是生成物，不能直接手改。
- 组件实现需要报告：尺寸来自哪个 size token、component height token、组件专属 token，还是待确认规则。

## 8. 待补

- 确认小输入框 `28px` 是否为输入类专属高度，并补对应 token / helper 方案。
- 后续建立 Icon Foundation / 图标库规则，承接图标资产、图标尺寸、颜色和状态。
- Tag 组件阶段将 `tag/height/*`、`tag/padding-*`、`tag/max-width/*`、`tag/close/*` 等专属项转为组件 token。
- 检查已有组件中散落的 `height` / `width` / icon size 是否可收敛到 Size Foundation。
