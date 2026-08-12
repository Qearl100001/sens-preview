# 侧边导航 Side Navigation · 开发规则

## 1. 组件边界

组件名为 `ProductShellSideNavigation`。它只承接产品壳的模块导航，不接管页面内侧栏。

与顶部导航、标题栏、右侧内容面板的组合关系见 `product-shell.md`。样板间或真实业务页使用侧导时，应调用 `ProductShellSideNavigation` 或 Product Shell 组合，不得复制一套局部侧导壳。

```ts
type ProductShellSideNavigationMode = "normal" | "overlay" | "docked";
```

- `normal`：固定 `30px` 紧凑态，鼠标进入侧导区域时展开。
- `normal` 在单层带图标、二级带图标分组场景中使用 `56px` 紧凑态，保留功能图标；无图标分组型侧导仍使用 `30px`。
- `overlay`：紧凑态悬停后临时展开；通过绝对定位覆盖主内容。
- `docked`：锁定展开；作为常规 flex 区域占用 `220px`。

## 2. 接入规则

- 页面外层必须根据 `mode` 区分 Overlay 与 Docked：Overlay 不改变内容宽度，Docked 改变。
- 在产品壳页面中，侧导与右侧内容面板从顶部导航下方 `82px` 开始；顶导氛围层只做底板，堆叠关系由 Layout 维护。
- 顶部导航决定当前一级功能域；侧导只展示该功能域内页面目录。侧导 `active` 叶子由路由或业务状态传入；在 Product Shell 中须与同域顶导下拉选中叶子双向对应，见 `product-shell.md` §4（权威 IA 为侧导 `groups`，顶导下拉由其派生）。
- 侧导本体是整体滚动容器：高度由浏览器可视范围或产品壳容器约束；当导航项超过可视高度时，标题区与菜单区作为一个整体滚动。滚动条不作为可见操作控件，用户通过鼠标滚轮或触控板滚动。
- 侧导滚动条默认不可见：实现需同时覆盖 Firefox / 旧 Edge 与 WebKit 浏览器，确保 Chrome 中也不显示系统滚动条，但保留滚轮与触控板滚动能力。
- 侧导左上角使用 `radius/xl = 10px`；这是产品壳面板圆角场景，不新增局部圆角值。
- `normal` 的整个 `30px` 侧导区域 hover 后进入 Overlay；展开图标保留键盘焦点与点击入口，作为非鼠标操作的补充。
- 菜单数据以分组传入；每组展开状态独立保存，不能默认实现为手风琴。样板间产品壳可传 `groupsCollapsible={false}`：全部分组常开、不展示开合箭头、点击分组标题不收起。
- 无层级的页面目录可传 `items` 进入扁平模式：不渲染分组标题、展开箭头或手风琴逻辑；仍复用产品壳的宽度、标题栏、收起 / 展开、菜单状态与 Navigation Color。项目设置等“同层页面目录”使用此模式。
- 单层带图标侧导的 `items` 使用 `{ key, label, icon }`：每个功能项必须有 `20px` 图标，展开态为图标 + 文案，紧凑态仅保留图标；该场景不出现虚拟父级或展开收起层级。
- 单层带图标展开态：功能项外层为 `220 × 36px`，内部选中块为 `204 × 36px`，项与项之间间距为 `4px`。
- 单层带图标紧凑态：侧导宽 `56px`，功能项外层为 `56 × 36px`，内部选中块为 `40 × 36px`，图标项之间间距为 `16px`。
- 二级带图标分组侧导的 `groups` 使用 `{ key, label, icon, items }`：二级是虚拟分组且必须有 `20px` 图标；三级是落地页且不带图标。该场景替代旧的“无图标分组”默认展示。
- 二级带图标分组展开态：二级行高 `36px`，内部宽 `204px`，虚拟二级内容起点距离侧导左边界 `12px`，图标与文字间距 `4px`，箭头仍在右侧；不同二级分组之间间距为 `16px`。
- 二级带图标分组的三级项：行高 `36px`，不展示图标，内容起点距离侧导左边界 `34px`，组内二级与三级、三级与三级之间间距为 `4px`。
- 二级带图标分组紧凑态：侧导宽 `56px`，只展示二级分组图标；选中块为 `40 × 36px`，二级图标项之间间距为 `16px`。
- 分析专属侧导的 `groups` 使用 `{ key, label, icon, items: Array<{ key, label, icon, iconVariant: "filled" }> }`：虚拟层级有专用 `sa-*` 图标，具体分析项使用对应业务面性图标。该场景目前仅用于「分析」大功能，不作为所有产品壳侧导的默认层级。
- 分析专属侧导展开态：虚拟层级行高 `36px`，内容起点距离侧导左边界 `12px`；具体分析项行高 `36px`，内容起点距离侧导左边界 `34px`；两者都使用 `20px` 图标，组内行间距为 `4px`。
- 分析专属侧导紧凑态：侧导宽 `56px`，不展示虚拟层级图标，只展示具体分析项图标；选中块为 `40 × 36px`，具体分析项组内间距为 `4px`，不同分析分组之间保留更明显的分隔。
- 三级项的选中状态由路由或业务状态传入 / 回调，不由组件猜测业务路径。
- 父级分组的绿色状态由 `group.items.includes(activeItem)` 派生，不能使用 `isOpen` 判断；“更多推荐”的链接图标也遵循同一规则。
- 产品壳展开 / 收起入口默认消费 `theme-side-icon`，hover / 按下消费 `theme-side-icon-active`；Docked 收起入口必须提供“收起”提示。
- 标题区控制图标（展开、收起、锁定 / 解锁）统一使用 `20px` 视觉尺寸；颜色仍由 `theme-side-icon` 与 `theme-side-icon-active` 驱动，不回退到通用 `icon-color-transparent`。
- 单层带图标场景当前已入库 `sbp-setting` / `sbp-member` / `sbp-role`，只作为项目设置类侧导功能项图标使用，颜色由 `theme-side-icon` / `theme-side-icon-active` 驱动。
- 二级带图标分组场景当前已入库 `sdi-warehousing-data-ingestion` / `sdh-warehousing-general-data-ingestion` / `sdh-data-model-user-entity-manage` / `sdh-entity-conf` / `sdg-dataquality`，只作为产品壳侧导二级虚拟分组图标使用，颜色由 `theme-side-subIcon` / `theme-side-icon-active` 驱动。
- 分析专属虚拟层级使用侧导专用图标：`sa-behavioranalysis` / `sa-useranalysis` / `sa-businessanalysis` / `sa-other`；具体落地分析项复用 Icon Foundation 已入库的面性业务图标，例如 `analysis-event` / `analysis-retention` / `analysis-funnel` / `analysis-distribution` / `analysis-ltv` / `analysis-session` / `analysis-user-path` / `analysis-web-page-thermal` / `analysis-app-click` / `analysis-interval` / `analysis-attribution` / `portrait-user-group` / `analysis-property` / `query-custom` / `bookmark` 等。颜色仍由 `theme-side-icon` / `theme-side-subIcon` / `theme-side-icon-active` 驱动。
- 桌面端容器最低按 `1280px` 处理；小于该宽度由产品壳横向滚动承接。

## 3. Token 规则

- 背景、文字、图标和目录状态只消费 `theme-side-*` 与 `getThemeSideBackground()`。
- Normal / Docked 的右侧内容面板消费 `buildShadow("D2", "left")`；侧导本身不消费投影。
- 未锁定 Overlay 的侧导本体消费 `buildShadow("D4", "right")`；此时内容面板不重复使用左向投影。
- 圆角使用 `radius/xl` 与 `radius/m`；字体使用 Typography token；图标通过 `SensIcon` 渲染，并在 registry 中登记使用场景。
- 紧凑宽度、展开宽度和菜单行高属于产品壳结构常量，不新增全局 token。
- `56px` 仅是带图标侧导的紧凑态结构常量；不得反向替换无图标分组型侧导的 `30px` 紧凑态。

## 4. 当前范围

- 当前预览页覆盖 Normal、Overlay、Docked、二级带图标 / 三级无图标和选中状态。
- 当前预览页已新增单层带图标项目设置场景，覆盖紧凑态、Overlay 与 Docked。
- 当前预览页已新增分析专属侧导场景，覆盖“虚拟层级 + 具体分析项均有图标”以及“收起态仅展示具体分析项图标”。
- 当前预览页已新增 `固定高度 800px / 长菜单滚动` 真实 Demo，用于验收侧导整体滚动与不可见滚动条。
- 旧“无图标分组”只保留组件兼容能力，不作为默认展示场景。
- 现有 TikTok 业务页面保留原侧导占位；后续单独评估是否迁移到本组件。
- 不在本组件定义锚点、目录、筛选栏等 Context Side Panel。
