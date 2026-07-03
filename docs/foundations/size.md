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
| `size/mini` | 8 | 极小尺寸 |
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

已有映射：

- 常规输入框高度：`size/component-height/m = 32`。
- 表格行高：`size/component-height/xxxl = 56`。
- 当前 antd 小尺寸输入历史映射为 `size/component-height/s = 24`。

待确认：

- 若后续设计明确“小输入框 = 28px”，不要复用 `spacing/7x`。建议新增输入类专属高度，例如 `size/component-height/input-sm = 28`，或在确认它适用于多个组件后再提升为通用 component height 档位。

## 5. Tag 尺寸候选

Tag 的高度、padding、gap 和字体属于组件专属尺寸规则，不应把专属 padding 硬塞进全局 spacing。

当前基于 Figma 卡片标题区样张，先记录候选：

| 规则 | 值 / token | 说明 |
|---|---|---|
| `tag/height/s` | `size/component-height/xs = 20` | 小标签高度 |
| `tag/padding-inline/s` | 6 | 组件专属 padding，待补 tag token |
| `tag/padding-block/s` | 1 | 由 `20 - line-height/s 18` 推导，待补 tag token |
| `tag/gap` | `spacing/1x = 4` | 标签内部图文间距候选 |
| `tag/radius` | `radius/s = 3` | 小标签圆角 |
| `tag/font-size` | `font-size/s = 12` | 标签文字 |
| `tag/line-height` | `line-height/s = 18` | 标签文字 |
| `tag/font-weight` | `font-weight/regular = 400` | 标签文字 |

后续进入 Tag 组件阶段时，应将这些候选转入 Tag 组件文档和组件 token，不在业务页面临时硬写。

## 6. Card 相关使用

Card 预览和后续 Card 组件可先消费：

| 场景 | token / 规则 |
|---|---|
| logo / 缩略图样张 | `size/xxl = 48` |
| more / down 图标 | `size/icon/m = 16` |
| error 图标 | `size/icon/s = 14` |
| tag 高度 | `size/component-height/xs = 20` |
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
- Tag 组件阶段将 `tag/height/s`、`tag/padding-inline/s`、`tag/padding-block/s` 等候选转为组件规则。
- 检查已有组件中散落的 `height` / `width` / icon size 是否可收敛到 Size Foundation。
