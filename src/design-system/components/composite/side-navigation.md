# 侧边导航 Side Navigation · 开发规则

## 1. 组件边界

组件名为 `ProductShellSideNavigation`。它只承接产品壳的模块导航，不接管页面内侧栏。

```ts
type ProductShellSideNavigationMode = "normal" | "overlay" | "docked";
```

- `normal`：固定 `30px` 紧凑态，鼠标进入侧导区域时展开。
- `overlay`：紧凑态悬停后临时展开；通过绝对定位覆盖主内容。
- `docked`：锁定展开；作为常规 flex 区域占用 `220px`。

## 2. 接入规则

- 页面外层必须根据 `mode` 区分 Overlay 与 Docked：Overlay 不改变内容宽度，Docked 改变。
- 在产品壳页面中，侧导与右侧内容面板从顶部导航下方 `82px` 开始；顶导氛围层只做底板，堆叠关系由 Layout 维护。
- `normal` 的整个 `30px` 侧导区域 hover 后进入 Overlay；展开图标保留键盘焦点与点击入口，作为非鼠标操作的补充。
- 菜单数据以分组传入；每组展开状态独立保存，不能默认实现为手风琴。
- 无层级的页面目录可传 `items` 进入扁平模式：不渲染分组标题、展开箭头或手风琴逻辑；仍复用产品壳的宽度、标题栏、收起 / 展开、菜单状态与 Navigation Color。项目设置等“同层页面目录”使用此模式。
- 三级项的选中状态由路由或业务状态传入 / 回调，不由组件猜测业务路径。
- 父级分组的绿色状态由 `group.items.includes(activeItem)` 派生，不能使用 `isOpen` 判断；“更多推荐”的链接图标也遵循同一规则。
- 产品壳展开 / 收起入口默认消费 `theme-side-icon`，hover / 按下消费 `theme-side-icon-active`；Docked 收起入口必须提供“收起”提示。
- 桌面端容器最低按 `1280px` 处理；小于该宽度由产品壳横向滚动承接。

## 3. Token 规则

- 背景、文字、图标和目录状态只消费 `theme-side-*` 与 `getThemeSideBackground()`。
- Normal / Docked 的右侧内容面板消费 `buildShadow("D2", "left")`；侧导本身不消费投影。
- 未锁定 Overlay 的侧导本体消费 `buildShadow("D4", "right")`；此时内容面板不重复使用左向投影。
- 圆角使用 `radius/xl` 与 `radius/m`；字体使用 Typography token；图标通过 `SensIcon` 渲染，并在 registry 中登记使用场景。
- 紧凑宽度、展开宽度和菜单行高属于产品壳结构常量，不新增全局 token。

## 4. 当前范围

- 当前预览页完整覆盖 Normal、Overlay、Docked、二级 / 三级、更多推荐和选中状态。
- 现有 TikTok 业务页面保留原侧导占位；后续单独评估是否迁移到本组件。
- 不在本组件定义锚点、目录、筛选栏等 Context Side Panel。
