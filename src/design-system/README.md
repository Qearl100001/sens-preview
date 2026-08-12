# Sens 设计系统知识库（src/design-system）

这套目录是「设计还原」产线的知识库：给 Cursor / Claude Code 读的规则 + 喂给 antd 的主题。
目标——让 AI 按这套规则把 Figma 稿还原成贴合生产的前端代码，而不是露出 antd 默认。

## 怎么用（一句话）
还原/优化任何组件前，让 AI 先读 `how-cursor-works.md` + `conventions.md` + 该组件的 `.md`，
样式只走 `theme.ts` 的 token，不允许手写 CSS 盖 antd。

## 文件清单

### 主题与数据（值）
| 文件 | 作用 | 何时更新 |
|---|---|---|
| `theme.ts` | antd 主题：种子 + 中性 + 图标 + 按钮态 + Table/Segmented 等组件 token。**AI 每次都读，必须最新。** | 由 `build-tokens.mjs` 生成；改了 token 就重新生成 |
| `../../build-tokens.mjs` | 生成工具：读取 `tokens/source/`，生成 `theme.ts` / `tokens.resolved.json` / i18n。**不是给 AI 读的。** | 修改 Token Source 或生成映射后运行 |
| `tokens.resolved.json` | 全量已解析 token（color handle→hex、unit→number），团队/AI 查阅用 | 跟随 build-tokens 重新生成 |
| `i18n/zh.json`·`en.json` | 中英文案表（来自 Figma Text 集合），文案走 key | 跟随 build-tokens 重新生成 |

> 注：Source、脚本和产物是一条链。改 token 的正确顺序是 **改 `tokens/source/` → 必要时改 `build-tokens.mjs` 映射 → `npm run tokens:build` → `npm run tokens:check`**；不要手改 `theme.ts`、`tokens.resolved.json` 或 i18n 生成物。

### 横切规范（所有组件通用，AI 每次都读，保持最新）
| 文件 | 作用 |
|---|---|
| `how-cursor-works.md` | **Cursor AI** 工作说明（三层样式模型等），**不是**鼠标光标文档 |
| `cursors.ts` | SensD 鼠标规则 registry（系统 `cursor` 关键字 + 语义文案）；样式见 `src/ui/cursors.css`；规则见 `docs/foundations/cursor.md` |
| `conventions.md` | 实现约定：用 token+props 驱动、不写 CSS 盖 `ant-*`、真实状态用 props、组件层 vs 预览板层 |
| `icons.md` | 全局图标规范：按角色取色、图标-文字间距、状态、搜索特例 |
| `color-semantics.md` | 功能色 / 状态色 / 基础色板三层；antd 故意交叉映射；链接禁止 primary |
| `functional-skin.ts` | 预览换肤：7 组功能色预设（读 token，非硬编码） |
| `color-utils.ts` | `tokenRgba(handle, alpha)` — 业务层从语义 handle 取透明色 |
| `color-audit-report.md` | 颜色硬编码审计清单（只报告、待人工确认） |
| `review-checklist.md` | 组件优化/验收检查单：6 条逐项核对 + 顺序 + 两条红线 + 代码级硬编码遗留清单 |

### 更新日志（changelog/ 子体系）
| 路径 | 作用 | 何时更新 |
|---|---|---|
| `changelog/README.md` | **写入纪律**：模板、触发阈值、责任方、DoD | 纪律变更时 |
| `changelog/YYYY-MM-DD.md` | 按日归档：落地、决策、坑、验收、待办 | 见 `changelog/README.md` 触发阈值 |
| `changelog-design-pipeline.md` | 兼容入口，指向 `changelog/` | 仅索引变更时 |
| `ChangelogPage.tsx`（`/changelog`） | `import.meta.glob` 自动扫 `changelog/20*.md`，倒序 Segmented | **每新增一天 md 即可**，无需改 tsx |

> 纪律全文：`changelog/README.md`。changelog 是**唯一**可在用户未点名时由 Cursor 主动更新的 markdown 目录（见 `review-checklist.md` · 收口必过项）。

### 组件规则

阅读顺序：`conventions.md` → 对应组件 `.md` → 该组件引用的 foundation。组件规则只写“和 antd 不同”或必须遵守的点；通用 token、颜色和间距回到 foundation。

| 路径 | 组件 | 规则重点 |
|---|---|---|
| `components/base/button.md` | Button | 变体、状态、操作优先级；二级 hover 无底、禁用与加载同色 |
| `components/base/input.md` · `textarea.md` · `inputnumber.md` | 输入 | 单行、文本域、数字输入的尺寸、边界与状态 |
| `components/base/search.md` · `select.md` · `select-dropdown.md` · `dropdown-menu.md` | 搜索与选择 | 触发框、选项面板、搜索和动作菜单边界 |
| `components/base/checkbox.md` · `radio.md` | 选择控件 | 控件尺寸、组选项、辅助说明与联动边界 |
| `components/base/form.md` · `title.md` | 表单与区块标题 | 表单布局、分组树、灰底标题和内容对齐 |
| `components/base/card.md` · `entry-card.md` | 卡片与入口卡片 | 自由容器、业务卡片与导航型入口卡片的边界 |
| `components/base/table.md` · `pagination.md` | 基础表格与分页 | 单元格、信息区、分页器和基础 Table 边界 |
| `components/base/tabs.md` · `badge.md` · `tag.md` | 导航与信息标记 | Tabs、徽标、标签的状态和规格 |
| `components/base/message.md` · `alert.md` · `tips.md` | 反馈与说明 | 轻提示、警告、便签（常规 Tips 为 Sens 自持浮层） |
| `components/base/title-bar.md` · `breadcrumb.md` · `drawer.md` | 标题栏、面包屑与抽屉 | 页面 / 抽屉标题、返回、面包屑、右侧操作与抽屉结构 |
| `components/base/top-navigation.md` | 顶部导航 | 产品壳主导航、专属浮层与 Navigation Color 关系 |
| `components/composite/product-shell.md` | 产品壳 | 顶部导航、侧边导航、标题栏、内容面板、浮层和回到顶部的组合关系 |
| `components/composite/form.md` | 复合表单 | 带表格、联动、卡片三类跨组件表单模式 |
| `components/composite/table.md` | 复合表格 | 筛选区、录入型表格、树表和嵌套 / 交叉表的组合边界 |
| `components/composite/side-navigation.md` | 侧边导航 | 产品壳侧导结构、状态和页面关系 |

### 样板间规则

| 路径 | 样板间 | 规则重点 |
|---|---|---|
| `templates/card/README.md` | 卡片样板间 | 以完整页面为还原单位，使用真实组件、Token 和页面交互验收 |
| `templates/sdh/editable-table.md` | SDH 录入型表格 | 真实业务页面、页面骨架与录入流程的组合边界 |

### 文档策略

- `.md` 是实现规则：token、组件 API / antd 映射、状态和验收入口。
- `.design.md` 是可选的设计评审说明：选型、使用场景、推荐与禁止；不存在不表示组件缺失。
- `SensBreadcrumb` 规则在 `components/base/breadcrumb.md`；标题栏只组合透传，不重复定义面包屑形态。
- 复合组件默认维护单篇 `.md`；只有存在独立设计评审材料时才增加 `.design.md`。

### 唯一规则源

- `tokens/source/` 是 Token 数值、别名和原始引用的唯一编辑源；`theme.ts`、`tokens.resolved.json` 与 i18n 是生成运行时产物，不是语义规则编辑入口。
- Foundation 正文维护跨组件规则；组件 / 复合组件 / 样板间正文只维护各自专属边界。索引、Preview、状态看板和 changelog 只引用、验证或记录历史。
- 三维状态的正式值维护在对应规则源文档头部。状态看板中的推进摘要不是正式状态，出现不一致时以规则源为准。
- 完整的来源对照与冲突裁决顺序见仓库根目录 `DESIGN.md` §3.6。

### 状态模型

组件、Foundation、复合组件和样板间必须将成熟度、实现和验证拆开描述；不得用单一状态词混合表达。

| 维度 | 可用值 | 含义 |
|---|---|---|
| 成熟度 | `Stable` / `Pilot` / `Planned` / `Deprecated` | 规则是否可作为团队默认方案 |
| 实现 | `Implemented` / `Partial` / `Missing` | 是否已有可复用实现 |
| 验证 | `Verified` / `Pending` / `Not Applicable` | 是否已按预览、状态矩阵或浏览器验收 |
| 优先级（可选） | `P0` / `P1` / `P2` | 仅表示建设顺序，不表示成熟度 |

状态解释：

- `Stable`：规则、实现和核心验收已完成，可作为默认方案。
- `Pilot`：已有可运行规则或样张，可试用，仍可能调整。
- `Planned`：方向已确认，但尚未形成可用资产。
- `Deprecated`：不再推荐新增使用，仅为兼容保留。
- `Partial`：已有首轮实现，但关键状态、流程或边界未完成。
- `Pending`：已落地但尚未完成对应验收。

旧状态迁移：

```text
Ready            → Stable + Implemented + Verified
初稿             → Pilot 或 Planned，按是否存在可用规则判断
首轮已收录       → Pilot + Implemented / Partial
待收录           → Planned + Missing
🔶待验           → 验证 Pending
⏳待做           → 实现 Partial / Missing，按实际情况判断
P0 / P1          → 只保留为优先级
```

### 规则源文档模板

Foundation、基础组件、复合组件和样板间的规则源文档，默认按以下结构组织；可按类型删减，但状态字段、边界、验收和缺口必须保留。

```md
# 名称

> 一句话定位
> 成熟度：...
> 实现：...
> 验证：...
> 来源：...
> 预览：...

## 边界
## 核心规则
## Token / 组件映射
## 验收
## 缺口与待确认
```

## 维护原则
- **现行规则正文勤更新；Token 先改 `tokens/source/`，再按需调整 `build-tokens.mjs` 映射并生成产物**。
- 通用的写进横切规范（越硬越好）；组件专属的只写进各自 `.md`（绝不外溢到横切规范）。
- 新组件先按现有规则裸跑暴露偏差，再针对偏差补规则；只写"和 antd 不同"的点，别矫枉过正。
- 装上 sensd 后，这些状态/颜色规则大多由库内置，知识库主要价值转为"和研发对齐 sensd 该怎么调"的清单。
- **更新日志**：有落地或决策则当轮补 `changelog/YYYY-MM-DD.md`，与代码**同一 commit**；`/changelog` 自动展示（纪律见 `changelog/README.md`）。
