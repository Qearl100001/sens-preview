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
| `build-tokens.mjs` | 生产工具：读 Figma 导出的 DTCG，生成 `theme.ts` / `tokens.resolved.json` / i18n。**不是给 AI 读的。** | 仅在重新从 Figma 导出 token、或要改 token 映射时跑 |
| `tokens.resolved.json` | 全量已解析 token（color handle→hex、unit→number），团队/AI 查阅用 | 跟随 build-tokens 重新生成 |
| `i18n/zh.json`·`en.json` | 中英文案表（来自 Figma Text 集合），文案走 key | 跟随 build-tokens 重新生成 |

> 注：脚本和产物是配套的一对。改 token 的正确姿势是 **改 `build-tokens.mjs` → 重跑 → 覆盖 `theme.ts`**，不要手改 `theme.ts`。

### 横切规范（所有组件通用，AI 每次都读，保持最新）
| 文件 | 作用 |
|---|---|
| `how-cursor-works.md` | 三层样式模型（去盲盒）+ 识破 AI 瞎搞的安全/危险词 + 别矫枉过正三原则 |
| `conventions.md` | 实现约定：用 token+props 驱动、不写 CSS 盖 `ant-*`、真实状态用 props、组件层 vs 预览板层 |
| `icons.md` | 全局图标规范：按角色取色、图标-文字间距、状态、搜索特例 |
| `color-semantics.md` | 功能色 / 状态色 / 基础色板三层；antd 故意交叉映射；链接禁止 primary |
| `functional-skin.ts` | 预览换肤：绿/蓝功能色预设（读 token，非硬编码） |
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

### 组件规则（各组件专属，只写"和 antd 不同"的点）
| 文件 | 组件 | antd 映射要点 |
|---|---|---|
| `components/base/button.md` | 按钮 | type/danger/ghost/size；二级 hover 无底、禁用=加载同色 |
| `components/base/search.md` | 搜索 | Input/Input.Search/AutoComplete；变体矩阵；禁用图层名当文案 |
| `components/base/input.md` | 输入框（单行） | Input 大/小；只读/警告；与 search / textarea 分工 |
| `components/base/textarea.md` | 文本域 | Input.TextArea；4.5 行、showCount；颜色规则引用 input.md |
| `components/base/inputnumber.md` | 数字输入框 | InputNumber + 步进器；188px 默认宽；components.InputNumber |
| `components/base/dropdown-menu.md` | 下拉菜单（浮层面板） | 选项行 34px + 搜索六面 + 动作菜单；`SELECT_OPTION_ROW_TOKENS`；components.Select popup |
| `components/base/select.md` | 选择器（触发框） | 32px 触发框 + clearable + 与 Input 同源字段色；串联 `dropdown-menu.md` |
| `components/composite/table.md` | 表格（复合） | 黑盒 antd Table；列→单元格类型；操作列=链接 |

## 维护原则
- **现行规则（`.md` + `theme.ts`）勤更新**；`build-tokens.mjs` 跟着 token 走。
- 通用的写进横切规范（越硬越好）；组件专属的只写进各自 `.md`（绝不外溢到横切规范）。
- 新组件先按现有规则裸跑暴露偏差，再针对偏差补规则；只写"和 antd 不同"的点，别矫枉过正。
- 装上 sensd 后，这些状态/颜色规则大多由库内置，知识库主要价值转为"和研发对齐 sensd 该怎么调"的清单。
- **更新日志**：有落地或决策则当轮补 `changelog/YYYY-MM-DD.md`，与代码**同一 commit**；`/changelog` 自动展示（纪律见 `changelog/README.md`）。
