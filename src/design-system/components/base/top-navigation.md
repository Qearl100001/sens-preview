# 顶部导航 Top Navigation

> 产品壳主导航，不等同于通用 Menu / Dropdown 或 Navigation Color。<br>
> 成熟度：Pilot<br>
> 实现：Partial<br>
> 验证：Pending<br>
> 来源：`SensTopNavigation`、Navigation Color、产品壳导航规则。<br>
> 预览：`/components/top-navigation`

## 边界

| 管 | 不管 |
| --- | --- |
| 产品壳主导航、功能入口、项目切换、工具入口和账号角色 | 页面标题与返回 → `title-bar.md` |
| 产品壳专属浮层的开关和互斥关系 | 通用下拉菜单的选项规则 → `dropdown-menu.md` |
| 顶部导航结构与状态、是否展示氛围层 | 颜色 / 换肤 / 氛围颜色 → `docs/foundations/navigation-color.md`；侧导与内容面板的堆叠关系 → `docs/foundations/layout.md` |

## 关键规则

1. 顶部导航是产品壳专属组件，不复用为普通 `Dropdown` / `Menu`。
2. 顶导航背景、文字、图标、分隔线和选中短线全部消费 Navigation Color 语义；不得回退为普通 `component-*`、`text-*` 或 `link-*` 色。
3. 主导航选中只显示文字下方短线，不使用整项背景。
4. 产品切换、账号角色和带下拉的主导航项属于产品壳浮层；同一时间只允许打开一个。
5. `1280px` 是桌面端最小使用宽度；低于该宽度横向滚动，不在组件内定义压缩布局。
6. “更多”收纳没有固定阈值，按产品信息架构配置，不升为全局断点规则。
7. 顶导实际结构高度为 `82px`。设计稿需要产品壳氛围时，可显式开启 `atmosphere`，延展至 `180px` 的视觉背景层；该层不占正文流。
8. 页面接入顶导后，侧导与右侧内容面板仍从顶部 `82px` 开始覆盖在氛围层之上；具体堆叠关系由 Layout 维护。

## 结构与状态

| 区域 | 规则 |
| --- | --- |
| 上导航 | Logo、项目切换、工具入口、账号角色 |
| 下导航 | 功能入口、主导航项、更多入口 |
| 主导航项 | 默认 / 悬停 / 选中；选中短线位于文字下方 |
| 工具入口 | 默认 / 悬停 / 持续选中（仅特定入口） |
| 产品切换、账号角色 | 关闭 / 打开 / 菜单项状态；打开其他入口时关闭当前浮层 |
| 氛围层 | 关闭 / 开启；开启时只延展顶导背景，不改变页面正文起点 |

## Token 与依赖

| 项 | 来源 | 说明 |
| --- | --- | --- |
| 背景与氛围层 | `getThemeTopBackground()` / `getThemeTopAtmosphere()` | 基础背景与氛围叠层分开换肤 |
| 文本、图标、分隔线、选中短线 | Navigation Color `theme-top-*` | 顶部导航专属色系 |
| 图标形状 | `SensIcon` / Icon Foundation | SVG 使用 `currentColor` |
| 圆角与投影 | Radius / Shadow Foundation | 产品壳浮层复用基础 token |

## 验收

- `/components/top-navigation`：主导航选中短线、功能入口、项目切换和账号角色浮层互斥；氛围层开启时验证其不推移正文。
- 切换导航主题后：顶导航背景、文字、图标、线条与菜单色同步变化；普通页面内容保持 Neutral Foundation。
