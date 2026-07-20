# 标题 Title

标题用于表单分组、配置块、卡片分组和业务组件内部标题。它是区块内容标题，不等于页面 / 抽屉 / 面包屑标题栏。

## 组件边界

- `SensSectionTitle` 负责区块标题、选填文案、辅助说明、帮助图标槽位和通用标题右侧操作。
- 页面标题、返回、面包屑、页面级按钮区继续使用 `TitleBar` / `PageTitleBar`。
- 表单只引用标题组件的分组标题能力，不把标题组件并入 Form。
- 营销云 / 分析云 / SDH 专用标题不能作为通用标题替代。

## 与表单分组 / 基础设计原则的关系

来源：`Sens.Design 表单组件 v2.1 221206` · 设计原则 · `64:55048`；分组 · `69:26542`。完整分组树见 `form.md`「分组规则」。

### 灰条 / 绿条仅用于当前分组树的最顶层

- **只有当前分组树最顶层**可以使用灰条（通用）或绿条（专用）；其下所有层级都不带灰条 / 绿条。
- 大表单页顶层默认使用**通用大尺寸**（`font-size/l` 16px + 灰底）。
- 白描边卡片内允许再次出现灰条标题，并 **重置** 一组分组树（新的最顶层再次 16px + 灰条）。
- 灰底卡片内标题 **仅支持 14px**；灰卡内 16px（含灰条）暂无场景。
- 通用小尺寸灰底标题存在，用于业务组件内部；**不得**充当表单分组第二 / 三层。
- 第二层（16px 无条）、第三层（14px 无条）、字段 label **不得**套用灰条 / 绿条。

### 顶层标题辅助文案基线对齐

- 辅助文案（`description`）与标题主文案**同一行**，按**基线对齐**。
- 不顶对齐，不把辅助文案换行堆到标题下方再垂直居中。
- 帮助图标仍在标题行内，图标槽位垂直居中于图标自身，不破坏标题与辅助文案的基线关系。
- 预览验收：`/components/title`「基线对齐 · 二级标题 + 辅助文案」样张。

## 变体

| 变体 | 尺寸 | 使用场景 | 规则 |
| --- | --- | --- | --- |
| 通用 | 大尺寸 | 表单分组树最顶层；白卡内重置后的顶层 | 16px + 灰背景，可带同行辅助文案与右侧操作 |
| 通用 | 小尺寸 | 业务组件内部轻量分组；**灰底卡内若需条样式时优先评估 14px 方案** | 灰背景；不得充当表单第二 / 三层；灰卡内 16px 暂无场景 |
| 营销云 / 分析云 / SDH 专用 | 大尺寸 | 指定产品线分组树最顶层 | 左侧绿色短条，无灰背景 |
| 营销云 / 分析云 / SDH 专用 | 小尺寸 | 指定产品线的业务组件内部标题 | 仅在业务组件内使用 |

## Token 映射

| 项 | SensD token | 状态 |
| --- | --- | --- |
| 通用标题背景 | `background-transparent-grey` @4% | Ready |
| 标题主文案 | `text-color-transparent` @90% | Ready |
| 辅助 / 选填文案 | `text-sub-color-transparent` @58% | Ready |
| 帮助图标颜色 | `icon-color-transparent` | Ready |
| 专用标题短条 | `component-primary` | Ready |
| 通用大尺寸高度 | `size/component-height/xxl` | Ready |
| 通用小尺寸高度 | `size/component-height/l` | Ready |
| 专用标题短条高度 | `size/icon/m` | Ready |
| 圆角 | `radius/m` | Ready |
| 标题与 meta / 辅助文案间距 | `spacing/horizontal/1x` | Ready |
| 右侧操作按钮间距 | `spacing/horizontal/4x` | Ready |
| 标题到右侧操作距离 | `spacing/10x + spacing/horizontal/6x` 推导 | To Confirm |
| 辅助文案对齐 | 标题行 `align-items: baseline` | Ready |

## 图标状态

- 帮助图标需要来自 SensD icon registry。
- 当前不使用错误图标替代，只暴露 `helpIcon` 槽位。
- 待 help asset 入库后，再把文档状态从 Missing 更新为 Ready。

## 验收记录

- 不新增源 token。
- 不手改 `tokens.resolved.json` / `theme.ts`。
- 组件视觉不依赖 antd 标题或 antd Form。
- 专用标题的产品线边界已写入文档。
- 辅助文案与标题主文案同一行且基线对齐；`/components/title` 有对照样张。
