# 设计系统 skill · 组件页结构规范 Showcase Page

> 预览工程里每个组件的展示页都按这套结构搭。目标：演示 + 核对 + 文档，三合一，自成闭环。

## 总体
- **每个组件独立一页**，左侧导航或路由切换（按钮 / 搜索 / 标签页 / 徽标 / 表格 …）。
- 一次只显示一个组件，互不干扰。
- 全程只用 `src/ui` 组件 + `theme` token，遵守 `conventions.md`，不手写 CSS 盖 antd。

## 每页三个区（从上到下）

### 区一 · 演示 Demo（看效果）
- 一个**真实可交互**的实例：鼠标 hover/点击能看到 hover/active 变化。
- 旁边放控制器：`disabled` / `loading` 开关、变体切换（分段控制或下拉，如 一级/二级/三级）、尺寸切换（大/小）。
- **真实交互态（hover/active）靠真实交互呈现，不要静态伪造**；disabled/loading 用真实 props。

### 区二 · 状态矩阵（核对）
- 变体 × 尺寸 × 状态全铺开的**静态矩阵**，和 Figma **一一对齐**：Figma 有几个状态/变体，这里就几个，不多（不冒出 Figma 没有的组合）不少（不砍列）。
- 静态样张从 token 取色（见 `conventions.md` 预览板规则）；互斥状态不叠加（disabledHover=disabled、loadingHover=loading）。
- 用途：逐格核对有没有漏、有没有错。

### 区三 · 文档 Doc（规则）
- 把该组件的 `.md`（如 `src/design-system/components/base/button.md`）**渲染成可阅读排版**。
- 技术做法（单一真相源）：
  - 用 `react-markdown`（配 `remark-gfm` 支持表格）渲染。
  - md 用 Vite 的 `?raw` 作为文本导入，**直接读 `src/design-system` 下那一份原文件**。
  - **绝不把 md 内容复制进组件**——保证文档和 skill 同源、改 md 页面自动更新。
- 标题、表格、代码块都要正常渲染。

## 验收（每页三条）
1. Demo 区的实例鼠标划过会真的变色（真交互，不是静态图）。
2. 状态矩阵列数/变体数与 Figma 对得上。
3. 文档区是排版好的内容（标题/表格清晰），不是 md 源码；且改对应 .md 后页面会变。
