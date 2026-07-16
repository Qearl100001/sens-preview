# 侧边导航 Side Navigation · 设计规范

> 来源：Figma `设计系统 2.1 侧导航设计`，节点 `1777:110915` / `1777:111170`。
> 定位：产品壳专属导航组件。它不等同于页面内的锚点、目录或筛选侧栏。

## 1. 结构与尺寸

| 区域 | 规格 | 来源 |
|---|---:|---|
| 紧凑态 | `30px` 固定宽度 | Figma 收起效果 |
| 展开态 | `220px` 固定宽度 | Figma 展开效果 |
| 一级模块 | `62px` 高 | Figma 子组件 / 一级模块 |
| 二级模块 | `30px` 高 | Figma 子组件 / 二级模块 |
| 三级模块 | `36px` 高 | Figma 子组件 / 三级模块 |
| 外侧圆角 | 左上 `10px` | `radius/xl` |

侧导航宽度不随页面宽度变化。桌面端最小宽度仍是 `1280px`；小于该宽度时产品壳横向滚动，不压缩导航。

## 2. 状态与交互

| 状态 | 触发 | 侧导 | 内容区 |
|---|---|---|---|
| Normal | 默认或点击收起 | `30px` 紧凑态，无自身投影 | 使用完整宽度，内容面板带左向 D4 投影 |
| Overlay | 点击紧凑态展开图标 | 临时展开至 `220px`，带右向 D4 投影 | 不变，侧导覆盖内容 |
| Docked | 点击锁定按钮 | 固定 `220px`，无自身投影 | 使用剩余宽度，内容面板带左向 D4 投影 |

- Normal 显示展开图标；悬停整条紧凑态侧栏不进入 Overlay。仅悬停图标时显示“展开”提示，点击图标进入 Overlay。
- Overlay 的锁定按钮点击后进入 Docked，并替换为收起按钮；锁定按钮 hover 提示为“锁定”。
- Docked 的收起按钮点击后回到 Normal；收起按钮默认中性，hover / 按下使用绿色，hover 提示为“收起”。
- Normal / Docked 时，侧导本身不使用投影；右侧内容面板使用左向 `D4`，表达内容层覆盖在侧导边界之上。
- 未锁定 Overlay 在右侧使用 `D4` 投影，表达浮层覆盖内容；此时内容面板不再重复使用左向投影。
- 二级模块可独立展开 / 收起三级模块；多个分组可以同时展开，不是手风琴。
- 展开不等于选中：二级模块和“更多推荐”仅因展开 / 收起时，文字、箭头与链接图标都保持默认中性颜色。
- 只有直接三级模块被选中时，其父级二级模块或“更多推荐”的文字、箭头与链接图标才使用绿色选中态。
- 三级模块有默认、悬停、点击、选中状态；选中项由页面路由或产品状态决定。

## 3. 颜色映射

| 元素 | Token / Helper |
|---|---|
| 整体背景 | `getThemeSideBackground()` / `theme-side-background` |
| 二级默认文案 | `theme-side-subText` |
| 三级默认文案 | `theme-side-text` |
| 选中文字 | `theme-side-text-active` |
| 默认 / 辅助图标 | `theme-side-icon` / `theme-side-subIcon` |
| 选中图标 | `theme-side-icon-active` |
| 目录 hover / click / selected | `theme-side-background-hover/click/active` |
| Normal / Docked 内容面板左侧投影 | `buildShadow("D4", "left")` |
| 未锁定 Overlay 右侧投影 | `buildShadow("D4", "right")` |

目录默认背景保持透明，承接侧导航渐变背景；不得用 `component-primary` 或 Functional Skin 推导选中态。

## 4. 图标

侧导航图标进入 Icon Foundation 的 `navigation` 分类：

- `side-nav-down` / `side-nav-up`：二级模块展开收起。
- `side-nav-link`：更多推荐。
- `side-nav-expand` / `side-nav-collapse`：紧凑态展开与 Docked 收起，成对使用。
- `side-nav-unpin`：Overlay 中锁定入口。
- `side-nav-pin`：锁定状态图标资产。

SVG 必须使用 `currentColor`；颜色由 `theme-side-*` 在组件调用处传入。

## 5. 边界

- 产品壳侧导可以使用 Navigation Theme；页面内锚点、目录等 Context Side Panel 不自动复用它的颜色。
- 侧导负责模块和菜单层级，不负责页面内容的列数。内容区宽度变化后由 Layout / Grid 重新组织。
- 不在侧导航组件中手写内侧阴影；内容面板与 Overlay 侧导分别通过方向型 D4 helper 承接投影。
