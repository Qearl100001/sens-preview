# 对象选择器

> 状态：Pilot<br>
> 实现：Implemented<br>
> 验证：Verified（当前范围浏览器交互验收通过）<br>
> 设计来源：通知样板间 Figma，节点 `512:26823`<br>
> 预览：`/composite/notification`

## 组件边界

- 提供成员、角色、职务的分类搜索、勾选、分组回看、移除、清空和确认。
- 对象数据、远程搜索 / 分页、权限与持久化由调用方负责；组件只管理选择草稿。
- 「放弃」、Popover 外部关闭或 Escape 不提交草稿；「完成选择」才提交。

## 展示与交互

- 使用 720px Sens Popover；窄视口下按可用宽度收缩，左右面板纵向排列。
- 左侧为 Sens 线型 Tabs、搜索、结果数、候选项和可选加载状态；已选候选项使用当前主题的选中背景。
- 右侧按成员 / 角色 / 职务汇总数量，分组可折叠，已选项可逐个移除；底部显示清空和已选总数。
- 分组成员 / 角色 / 职务使用四级标题：`font-size/m`、`line-height/m`、`font-weight/medium`。
- 已选项移除按钮使用 Sens `dangerLinkWeak` 图标按钮：默认无底、图标弱化；悬停无底并变为 `warning-color`，按下变为 `warning-color-active`。
- `totalCount` 用于显示业务提供的总数；仅当前分类总数超过 100 且调用方传入 `loading` 时，在候选列表底部显示旋转加载图标；数据分页与加载时机由调用方负责。`maxVisible` 默认 500，只限制当前候选项展示数量，不额外展示上限提示。

## 依赖与验证

- 复用 Sens Popover、Tabs、Input、Checkbox、Button、Icon 与设计 token，不使用 antd 组件作为视觉承载。为避免 Tabs 默认底线与全宽分割线重叠，仅在选择器 Tabs 容器内透明化 `.ant-tabs-nav::before`，并由组件自己的伪元素绘制分割线；该局部规则不扩展为全局 antd 覆盖。
- 已运行构建与类型检查；浏览器验收覆盖打开、搜索候选、暂存选择、放弃不提交、完成后回显与关闭。
