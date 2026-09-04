# DESIGN

> 这是 `sens-preview` 的正式总入口。项目定位、阅读路径、文档分层、AI 工作方式和当前阶段重点以这里为准。
>
> 旧 `docs/ai-design-system-methodology.md` 仅保留为历史别名和迁移说明，不再作为主入口。

## 1. 项目一句话

`sens-preview` 是 Sens.Design 预览工程，也是当前用于验证「AI 辅助设计系统工作流」的主项目。

它要证明的不是单个页面能不能被还原，而是：

- 设计规则能不能变成 AI 可执行的文档
- token、组件、样板间能不能形成稳定工作流
- PRD / 结构化输入能不能更快生成可讨论、可验收、可交接的前端骨架

## 2. 当前唯一入口

处理这个仓库时，默认按下面顺序进入：

1. `AGENTS.md`
2. `DESIGN.md`
3. `/Users/liyuwen/Documents/Codex/YuwenAI/Projects/sens-preview/Handoff.md`
4. `/Users/liyuwen/Documents/Codex/YuwenAI/Projects/sens-preview/Cursor-Worklog.md`

如果任务是具体 UI / 设计系统工作，再按类型补读下面对应资料。

## 3. 信息分层

### 3.1 项目总纲

- `DESIGN.md`

职责：

- 解释项目是什么
- 解释现行结构和入口
- 解释什么文件才是 source of truth
- 解释 AI / Cursor / Codex 应该怎么协作

### 3.2 项目事实与协作状态

外部 YuwenAI 项目记忆：

- `Context.md`：稳定项目事实
- `Roadmap.md`：阶段目标和案例方向
- `Handoff.md`：当前接手事项
- `Cursor-Worklog.md`：历史流水账
- `Decisions.md`：已确认决策

边界：

- `Context.md` 不写临时待办
- `Handoff.md` 不承担完整历史记录
- `Cursor-Worklog.md` 只追加，不重写

### 3.3 设计系统规则层

- `docs/foundations/`：跨组件通用规则
- `src/design-system/components/`：基础组件、复合组件、样板间规则
- `docs/agent-rules/`：流程、价值体验、文案规范和验收规则
- `src/design-system/README.md`：设计系统知识库索引

### 3.4 实现历史

- `src/design-system/changelog/`

职责：

- 记录已落地实现
- 记录已发生决策
- 记录待验项

它是历史记录，不是当前总入口。

### 3.5 规则源、派生物与验证载体

设计系统资产按以下链路维护：

```text
Token Source
  → Foundation
    → 基础组件
      → 复合组件 / 样板间
        → 团队手册 / AI Context
          → Preview / Changelog
```

职责边界：

- **Token、Foundation、基础组件、复合组件、样板间**是现行规则源。
- **团队手册**面向设计、产品、研发协作；**AI Context**面向 Stitch、Cursor 与代码 Agent。两者均从规则源派生，不单独创造规则。
- **Preview**是规则的可视化与交互验证载体，不是唯一规则源。
- **Changelog**记录历史变更、决策与待验项，不承担现行规则。
- 同一条规则只能有一个“展开维护源”；其他文档只能引用、概述或链接，不复制完整细则。

### 3.6 规则真相源与冲突裁决

规则不要求只出现一次，但每类规则只能有一个可展开维护、可裁决冲突的来源：

| 资产 / 问题类型 | 唯一维护源 | 派生物或引用位置 |
|---|---|---|
| Token 数值、别名与原始引用 | `tokens/source/` | `theme.ts`、`tokens.resolved.json`、i18n 生成物 |
| 跨组件视觉与交互规则 | 对应 `docs/foundations/*.md` | Foundation 索引、组件文档、样板间 |
| 基础 / 复合组件 API、状态与边界 | 对应 `src/design-system/components/**/*.md` | Preview、团队手册、AI Context |
| 样板间的组合方式和场景约束 | 对应 `src/design-system/templates/**/*.md` | Preview、案例文档 |
| 页面文案书写与提示公式 | `docs/agent-rules/copywriting.md` | 清单 §4、组件文档例外 |
| 项目定位、阅读路径和来源层级 | `DESIGN.md` | `AGENTS.md`、README、交接文件 |
| 验收证据、推进摘要和历史 | Preview、状态看板、changelog | 不反向定义上述规则 |

冲突裁决顺序：

1. Token 数值或映射冲突时，以 `tokens/source/` 为准；生成物不可手改。
2. 通用规则冲突时，以对应 Foundation 正文为准；组件或样板间只记录其专属例外。
3. 组件或样板间边界冲突时，以对应 `.md` 正文为准。
4. `DESIGN.md`、README、状态看板、Preview 或 changelog 与规则源不一致时，先修正派生物；不得通过修改派生物重新定义规则。

### 3.7 跨层组合规则

当一条规则同时涉及组件语义、页面位置和业务场景时，不把完整规则塞进单个组件或样板间。

- 基础组件文档定义组件语义、状态、排序和能力边界。
- Foundation 定义跨组件区域、插槽、页面骨架和布局归属。
- 复合组件与样板间只声明如何消费这些规则，不重新定义完整状态矩阵或排序逻辑。
- Preview 负责展示真实样张和验收状态，不反向创造规则。

例如「操作区」由 Button 定义按钮优先级、更多收纳和状态边界，由 Layout 定义 Header / Body / Footer / Floating 等宿主位置，Form、Drawer、Dialog、Popover 等场景只消费对应位置和按钮规则。

## 4. 任务阅读路径

### 4.1 改页面或对象流程

先读：

- `docs/agent-rules/README.md`
- `docs/agent-rules/value-experience-principles.md`
- `docs/agent-rules/consistency-flow-rules.md`
- `docs/agent-rules/copywriting.md`
- `docs/agent-rules/page-evaluation-checklist.md`

### 4.2 改 foundation

先读：

- `docs/foundations/README.md`
- 对应 foundation 文档

### 4.3 改基础组件或复合组件

先读：

- `src/design-system/README.md`
- `src/design-system/how-cursor-works.md`
- `src/design-system/conventions.md`
- 对应组件或复合组件文档

### 4.4 改样板间或案例

先读：

- 对应 `src/design-system/templates/` 文档
- 对应案例 / 预览页已有实现
- 相关 `changelog` 与 `Handoff`
- 收尾必须过 `page-evaluation-checklist.md`（含 §4 文案，对照 `copywriting.md`）

## 5. 现行产品结构

当前现行入口保留为：

- `/overview`
- `/basic-styles/*`
- `/components/*`
- `/composite/*`
- `/templates/*`
- `/cases/*`
- `/guides`
- `/changelog`

已经退休或不再推荐继续扩写的旧入口：

- `legacy` 单页全量预览
- 旧方法论文档作为主入口的用法
- 让多个文件各自维护一套“先读什么”的重复说明

## 6. 工作原则

- 尊重现有 Vite + React + antd 架构
- 优先复用 token、foundation、helper、组件规则
- 不手改生成产物，如 `theme.ts`、`tokens.resolved.json`
- UI 工作完成后，用 `docs/agent-rules/page-evaluation-checklist.md` 做评审；§4 文案项对照 `copywriting.md`，不得因任务被分类为视觉还原而跳过
- 设计系统规则优先沉淀到对应层，不把所有信息都塞进 `Context.md`

### 6.1 组件承载策略

本项目继续尊重 `Vite + React + antd` 架构，但不默认把 `antd` 作为所有组件的最终交互层。

判断原则：

1. 低交互组件优先复用 `antd`
2. 如果需求主要是 token、尺寸、排版、颜色或轻量结构调整，可以保留 `antd` 交互
3. 如果需求已经进入“交互规则自定义”而不是“视觉换皮”，应优先自持交互壳，而不是持续覆盖 `antd`

可继续保留 `antd` 交互层的场景：

- 基础展示型组件
- 表单控件的常规使用
- Figma 与 `antd` 默认行为大体一致，只需轻量换肤
- 不需要重写 hover、active、focus、keyboard、overflow、editing 等核心状态

应优先去掉 `antd` 交互层、改为自持交互壳的场景：

- 溢出分配逻辑需要自定义
- 下拉触发、定位或选中反馈不按 `antd` 默认规则
- 存在页签编辑、局部选区、拖拽排序等复合交互
- Delete / Backspace / Enter / Escape 等键盘规则需要精确控制
- Figma 对 hover、click、disabled、selected、selected-hover 有完整状态矩阵，且与 `antd` 默认态差异明显
- 为了还原设计而持续增加 `.ant-*` 覆盖、`!important`、事件拦截或额外兼容逻辑

实现判断口径：

- 如果一个组件已经反复出现“保留什么、去掉什么”的讨论，说明它不再适合继续挂在 `antd` 交互层上
- 这类组件应把 `antd` 退回为参考实现或直接移除，只保留项目自己的 token、DOM 结构和交互规则
- 组件是否去 `antd`，优先按长期维护成本判断，而不是按当前改动量判断

当前项目的第一批明确对象：

- `SensPillTabs`：不再长期依赖 `Segmented` 作为最终交互层
- `SensEditableCardTabs`：不再长期依赖 `Tabs type="editable-card"` 作为最终交互层

说明：

- `SensLineTabs` 这类与 `antd` 默认行为接近的组件，可以继续保留 `antd` 交互层
- 以上策略是当前项目的实现边界规则，用于减少后续逐状态反复对齐的成本

## 7. AI 设计系统方法论摘要

### 7.1 两层资产

设计系统专属层：

- token
- 组件
- 视觉规则
- 工程映射
- 场景样板

通用方法论层：

- token 作为设计与代码共同真相源
- 组件规则用 AI 可读文档表达
- 预览页、状态矩阵、真实场景三种验收方式并存
- AI 负责抽取、生成、检查，人负责判断、校准、验收

### 7.2 标准工作流

`PRD / Figma / 旧页面` -> `结构化抽取` -> `Spec` -> `模板 / 设计系统规则` -> `前端骨架` -> `预览验收` -> `研发交接` -> `规则沉淀`

核心原则：

- 先生成结构化 Spec，再生成页面
- 不让 AI 每次从零猜页面

## 8. 当前阶段重点

- 用 `DESIGN.md` 收敛项目入口，减少重复说明
- 继续补稳 foundation、基础组件、复合组件、样板间之间的边界
- 让案例、样板间、组件库和方法论文档逐步对齐

## 9. 本轮收敛结果

这一轮收敛之后，建议默认遵守：

- `AGENTS.md` 只做启动器
- `DESIGN.md` 做本仓库唯一总入口
- `docs/ai-design-system-methodology.md` 退为历史别名
- 隐藏旧预览页不再保留
