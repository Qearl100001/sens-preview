# 标题 Title

标题用于表单分组、配置块、卡片分组和业务组件内部标题。它是区块内容标题，不等于页面 / 抽屉 / 面包屑标题栏。

## 组件边界

- `SensSectionTitle` 负责区块标题、选填文案、辅助说明、帮助图标 / `SensTips` 和通用大标题右侧操作。
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
- **灰底标题到下方同组内容的纵向间距固定为 `spacing/vertical/4x`（16px）**；组合灰底标题与内容时使用 `sens-form-section-block` / `form-templates-section-block` / `form-templates-table-block` 等 16px gap 容器，不得用 8px 或表单项 20px 间距替代。

### 顶层标题辅助文案基线对齐

- 辅助文案（`description`）与标题主文案**同一行**，按**基线对齐**。
- 不顶对齐，不把辅助文案换行堆到标题下方再垂直居中。
- 帮助图标仍在标题行内，图标槽位垂直居中于图标自身，不破坏标题与辅助文案的基线关系。
- 预览验收：`/components/title`「基线对齐组」样张。

## 变体

| 变体 | 尺寸 | 使用场景 | 规则 |
| --- | --- | --- | --- |
| 通用 | 大尺寸 | 表单分组树最顶层；白卡内重置后的顶层 | 16px + 灰背景，可带帮助 / 选填 / 辅助与右侧操作 |
| 通用 | 小尺寸 | 业务组件内部轻量分组；**灰底卡内若需条样式时优先评估 14px 方案** | 灰背景；可带帮助 / 选填 / 辅助；**不带**右侧按钮组 |
| 营销云 / 分析云 / SDH 专用 | 大尺寸 | 指定产品线分组树最顶层 | 左侧绿色短条，无灰背景；**不带**右侧按钮组 |
| 营销云 / 分析云 / SDH 专用 | 小尺寸 | 指定产品线的业务组件内部标题 | 仅在业务组件内使用；**不带**右侧按钮组 |

## 展示顺序

`标题 → 帮助 icon → 选填 → 辅助文案`

| 槽位 / prop | 规则 |
| --- | --- |
| `help` | 有值时渲染帮助 icon，hover / focus 出 Tips；默认 `SensIcon name="help"`、`size/icon/m`；光标仅悬停不可点 → 见 `docs/foundations/cursor.md`「默认 vs 可点击」（`--sens-cursor-default`） |
| `helpIcon` | 自定义帮助图标槽位；可与 `help` 组合（Tips 内容仍走 `help`） |
| `optional` | 选填文案，如 `(选填)`；色 `text-sub-color-transparent` @58%；字号/行高**跟标题同档**，字重 `font-weight/regular`（大 16/24，小 14/22） |
| `description` | 辅助说明；与标题同行、基线对齐；`font-size/s` + `line-height/s` + `font-weight/regular` |
| `actions` | 右侧操作；**仅** `variant="general" && size="large"` 渲染 |

## 右侧操作区

- 通用大标题条左右 padding：`spacing/horizontal/4x`（16px）。
- 通用小标题条左右 padding：`spacing/horizontal/2x`（8px）。
- 右侧按钮组内间距：`spacing/horizontal/4x`（16px）。
- 标题信息区与按钮组之间：Figma 最小分隔 **64px**（实现用 `spacing/10x + spacing/horizontal/6x` 凑出，**不是**「右侧 padding 推导」）。
- 通用大标题可带右侧按钮组（常见：更多 + 二级 + 一级）。
- 小标题、`productLine` 专用标题不展示按钮组（即使传入 `actions` 也不渲染）。

## Token 映射

| 项 | SensD token | 状态 |
| --- | --- | --- |
| 通用标题背景 | `background-transparent-grey` @4% | Ready |
| 标题主文案 | `text-color-transparent` @90% | Ready |
| 选填 / 辅助色 | `text-sub-color-transparent` @58%（Figma 子夜黑/09，代码用语义 handle） | Ready |
| 选填字号（通用大） | `font-size/l` + `line-height/l` + `font-weight/regular` | Ready |
| 选填字号（通用小） | `font-size/m` + `line-height/m` + `font-weight/regular` | Ready |
| 辅助文案字号 | `font-size/s` + `line-height/s` + `font-weight/regular` | Ready |
| 帮助图标颜色 | `icon-color-transparent` | Ready |
| 帮助光标 | `--sens-cursor-default`（规则见 cursor foundation） | Ready |
| 专用标题短条 | `component-primary` | Ready |
| 通用大尺寸高度 | `size/component-height/xxl`（48） | Ready |
| 通用小尺寸高度 | `size/component-height/l` | Ready |
| 专用标题短条高度 | `size/icon/m` | Ready |
| 圆角 | `radius/m` | Ready |
| 左右 padding（通用大） | `spacing/horizontal/4x` | Ready |
| 左右 padding（通用小） | `spacing/horizontal/2x` | Ready |
| 标题与 meta / 辅助间距 | `spacing/horizontal/1x` | Ready |
| 右侧操作按钮间距 | `spacing/horizontal/4x` | Ready |
| 主内容↔操作区最小分隔 | Figma 64；`spacing/10x + spacing/horizontal/6x` | Ready |
| 辅助文案对齐 | 标题行 `align-items: baseline` | Ready |
| 帮助图标资产 | `SensIcon name="help"` | Ready |

## 验收记录

- 不新增源 token；不手改 `tokens.resolved.json` / `theme.ts`。
- 组件视觉不依赖 antd 标题或 antd Form；帮助说明统一消费 `SensTips`，不使用 antd Tooltip 视觉层。
- 专用标题的产品线边界已写入文档。
- 辅助文案与标题主文案同一行且基线对齐；`/components/title` 有对照样张。
- 大标题可带帮助、选填、辅助文案、右侧操作。
- 小标题不带按钮组。
- productLine 不带按钮组。
- 帮助 icon hover / focus 有 Tips；光标为 `default`（仅悬停不可点）。
- 通用大左右 padding 16；通用小左右 padding 8；按钮组 gap 16。
- 验收对象：**真实 Demo** 与 **状态矩阵（规则摘要）** 均需过。
- Demo 分组：基线 / 通用大 / 通用小 / 专用大 / 专用小；组间距 `spacing/vertical/4x`，组内 `spacing/vertical/2x`。
- 选填跟标题同档字号（大 16/24、小 14/22），细体 400；辅助文案 12 档细体 400。
