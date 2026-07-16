# Navigation Color Foundation

> 主要来源：Figma `设计系统 2.0 导航设计`，色板节点 `2194:54928`「神策绿 主题色」。
> 当前状态：神策绿产品壳主题已入库；其他导航主题必须按同一套槽位补齐，不得用功能色替代。

## 1. 定位与边界

`Navigation Color` 是 `Product Shell Theme` 的导航颜色子系统，统一承接顶部导航、侧边导航、标题栏、页面背景和产品壳专属菜单。

| 内容 | 归属 | 说明 |
|---|---|---|
| Button、Input、Switch、Tag 的功能表达 | Functional Skin | 使用 `component-*` 等功能色语义 |
| 顶导、侧导、标题栏、页面背景 | Product Shell Theme / Navigation Color | 使用产品壳主题 Token / helper |
| 普通文本、边框、卡片背景 | Color Foundation | 默认不参与换肤 |
| 阴影、圆角、普通分割线 | Foundation | 导航组件继续复用，不另造导航视觉值 |

`Product Shell Theme` 与 `Functional Skin` 可以独立组合。例如导航使用黄色主题，功能色使用蓝色主题。

### 1.1 不自动复用的范围

以下内容即使视觉上像“侧边导航”或“局部目录”，也**不自动复用** `theme-side-*`：

- 页面内锚点、目录、筛选栏等 Context Side Panel。
- 抽屉内局部导航、分组目录、配置页局部切换区。
- 表格左侧辅助筛选、树筛选、映射页局部结构栏。

这些内容如果需要复用产品壳导航规则，必须在对应组件或样板间文档中单独确认；默认只允许复用 `Layout / Reflow` 行为，不自动继承产品壳导航的尺寸、颜色和交互口径。

## 2. 产品壳主题槽位

每套 `Product Shell Theme` 的导航颜色子系统都必须同时定义以下槽位。只换顶导颜色、遗漏侧导或页面背景，不算完成一套产品壳主题。

| 产品壳区域 | Figma 语义 | 当前消费方式 | 神策绿基线 |
|---|---|---|---|
| 顶部导航基础背景 | `theme-top-background` | `getThemeTopBackground()` | `#0F9670 -> #0D826D` |
| 顶部导航氛围层 | `theme-top-atmosphere` | `getThemeTopAtmosphere()` | 三层产品壳氛围渐变 |
| 侧边导航 | `theme-side-background` | `getThemeSideBackground()` | `#FAFCFC -> #F0F7F6` |
| 标题栏 | `theme-title-background` | `getNavigationTheme().title.background` / `theme-title-background` | `#F5FAFA` |
| 页面背景 | `body-background` | `getNavigationTheme().page.background` / `body-background` | `#F5FAFA` |

Figma 的渐变并未随颜色变量 JSON 输出，因此顶导基础背景、顶导氛围层与侧导背景由 `tokens/source/foundations/navigation-theme.json` 补充录入；这是 Figma 色板的结构化补充，不是组件私有硬编码。

## 3. Token 来源与生成

```text
tokens/source/figma/Color.json
  └─ 顶导 / 侧导状态色、标题栏、页面背景及透明度
tokens/source/foundations/navigation-theme.json
  └─ 顶导基础 / 氛围渐变、侧导渐变与产品壳主题矩阵
        ↓ node build-tokens.mjs
src/design-system/tokens.resolved.json
  └─ color、navigationTheme
        ↓
src/design-system/navigation-color.ts
  └─ getThemeTopBackground() / getThemeTopAtmosphere() / getThemeSideBackground()
```

- `tokens.resolved.json` 和 `theme.ts` 都是生成物，禁止手改。
- Figma 颜色透明度保留为 CSS `#RRGGBBAA`，例如侧导悬停为 `#0015400F`。
- 直接使用已有语义色时，优先 `getColorToken(handle)`；只有需要派生新透明度的效果层才用 `tokenRgba(handle, alpha)`。

## 4. 顶导航颜色映射

| Figma 分组 | Token | 神策绿值 | 状态 |
|---|---|---|---|
| 基础背景 | `theme-top-background` | `linear-gradient(135deg, #0F9670, #0D826D)` | Ready |
| 氛围叠层 | `theme-top-atmosphere` | 三层 CSS gradient stack | Ready |
| 角色背景 | `theme-top-role-background` | `#0000000F` | Ready |
| 功能入口 / 账号菜单背景 | `theme-top-funcMenu-background-hover/active` | `#00B2801A` | Ready |
| 功能入口 / 账号菜单文字 / 图标 | `theme-top-funcMenu-text*` / `theme-top-funcMenu-icon*` | 默认中性，悬停 / 选中 `#00B280` | Ready |
| 项目菜单背景 | `theme-top-proMenu-background-hover/active` | `#0015400F` / `#00B2801A` | Ready |
| 项目菜单文字 | `theme-top-proMenu-text*` | 默认 `#171C26E5`，选中 `#00B280` | Ready |
| 顶导文字与图标 | `theme-top-text*` | 默认 `#FFFFFFCC`，悬停 / 选中 `#FFFFFF` | Ready |
| 工具图标背景 | `theme-top-icon-hover/active` | `#0000001A` / `#00000033` | Ready |
| 顶导线 | `theme-top-line-*` | 含 Figma 原始透明度 | Ready |
| 项目菜单线 | `theme-top-menuLine-*` | 描边、分割线、项目菜单选中描边 | Ready |
| 主导航选中短线 | `theme-top-text-active` | `#FFFFFF`，`16 × 3px` | Ready |

## 5. 侧导航颜色映射

| Figma 分组 | Token | 神策绿值 | 状态 |
|---|---|---|---|
| 整体背景 | `theme-side-background` | `linear-gradient(180deg, #FAFCFC, #F0F7F6)` | Ready |
| 目录默认态 | 无额外 Token | 透明，承接侧导整体背景 | Ready |
| 目录悬停 / 点击 / 选中 | `theme-side-background-hover/click/active` | `#0015400F` / `#00154014` / `#00B2801A` | Ready |
| 主要 / 辅助 / 选中文字 | `theme-side-text/subText/text-active` | `#171C26E5` / `#08122694` / `#00B280` | Ready |
| 主要 / 辅助 / 选中图标 | `theme-side-icon/subIcon/icon-active` | `#747E94` / `#747E94CC` / `#00B280` | Ready |

侧导航默认态不新增 `theme-side-background-default`。设计稿定义的是透明默认态与三种目录状态，默认背景由 `theme-side-background` 承接。

## 6. 换肤规则

- `NavigationTheme` 是独立类型，不复用 `FunctionalSkin`。
- 当前仅录入 `green` 神策绿产品壳主题；蓝、黄等导航主题要先从 Figma 读到完整色板后再录入。
- 新增导航主题时，必须补齐第 2 节的五个产品壳槽位，以及本页第 4、5 节所有状态 Token 的对应值。
- 组件不能根据 `component-primary` 推导侧导选中态；侧导必须消费 `theme-side-*`。
- 导航图标形状属于 Icon / navigation 分类，颜色由所在导航场景传入 `theme-top-*` 或 `theme-side-*`。
- `Navigation Color` 和 `Functional Skin` 是并列关系，不是上下级关系。位于产品壳里的功能组件，仍优先判断自己是否属于功能色消费对象，不能因为“在导航附近”就改用导航主题色。

## 7. 组件接入规则

- 顶导航、侧导航的结构、层级、收起展开归各自组件文档。
- 渐变、氛围层、文字、图标、目录状态必须通过 `Navigation Color` Token / helper 读取。
- 下拉面板的圆角、阴影、通用描边继续复用 Foundation；仅导航专属颜色进入本文件。
- 使用功能色的组件不因为位于产品壳中就改用 `theme-top-*` 或 `theme-side-*`。
- 页面样板间中如出现锚点、目录、筛选栏、抽屉内局部导航，应先按样板间和组件规则判断，不默认纳入本文件。

## 8. 当前范围与待补

- 已完成：神策绿顶导、侧导、标题栏、页面背景的主题基线；Figma 透明 Token 的生成与产品壳样张接入。
- 待补：蓝、黄等 `Product Shell Theme` 导航子系统的完整 Figma 色板与换肤矩阵。
- 待补：侧边导航组件的结构、层级、收起 / 展开、悬停与固定规则。
- 不在本页处理：功能色 `#008C64 / #008C65` 的来源差异、业务组件颜色和状态色换肤。
