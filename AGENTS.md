# sens-preview Codex 入口

这是真实 `sens-preview` 仓库根目录使用的 Codex 说明文件。

开始处理这个项目之前，先读取 YuwenAI 记忆：

- `/Users/liyuwen/Documents/Codex/YuwenAI/Memory/Identity.md`
- `/Users/liyuwen/Documents/Codex/YuwenAI/Memory/Long-Term-Vision.md`
- `/Users/liyuwen/Documents/Codex/YuwenAI/Memory/Career-Positioning.md`
- `/Users/liyuwen/Documents/Codex/YuwenAI/Memory/Portfolio-Strategy.md`
- `/Users/liyuwen/Documents/Codex/YuwenAI/Memory/Principles.md`
- `/Users/liyuwen/Documents/Codex/YuwenAI/Memory/Preferences.md`
- `/Users/liyuwen/Documents/Codex/YuwenAI/Memory/Permanent-Memory.md`
- `/Users/liyuwen/Documents/Codex/YuwenAI/Projects/sens-preview/Context.md`
- `/Users/liyuwen/Documents/Codex/YuwenAI/Projects/sens-preview/Roadmap.md`
- `/Users/liyuwen/Documents/Codex/YuwenAI/Projects/sens-preview/Handoff.md`
- `/Users/liyuwen/Documents/Codex/YuwenAI/Projects/sens-preview/Cursor-Worklog.md`
- `/Users/liyuwen/Documents/Codex/YuwenAI/Projects/sens-preview/Decisions.md`

然后读取本仓库正式总入口：

- `DESIGN.md`

只有在具体任务需要时，再按 `DESIGN.md` 指引补读：

- `docs/agent-rules/*`
- `docs/foundations/*`
- `src/design-system/README.md`
- 对应组件、复合组件、样板间文档

## 项目原则

- 尊重现有 Vite + React + antd 架构。
- 优先使用现有设计系统 token、foundation、helper 和组件，再添加自定义样式。
- 不要手改生成的 token 输出，除非任务明确要求，并且已经理解源文件和生成链路。
- UI 工作完成后，用 `docs/agent-rules/page-evaluation-checklist.md` 做评审。
- 如果 Cursor 已经推进过相关需求，先读取 YuwenAI 中的 `Cursor-Worklog.md` 和 `Handoff.md`，再判断是否接手。
- 长期项目决策记录到 `/Users/liyuwen/Documents/Codex/YuwenAI/Projects/sens-preview/Decisions.md`。
- 个人长期记忆候选写入 `/Users/liyuwen/Documents/Codex/YuwenAI/Memory/Inbox.md`。
