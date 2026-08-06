# Navigation Color Foundation

> Product Shell Theme 的导航颜色子系统；不以组件功能色替代导航槽位。
> 成熟度：Stable
> 实现：Implemented
> 验证：Verified（12 套主题槽位已录入；主题预览已验，组件级消费仍按组件验收推进）
> 来源：Figma `设计系统 2.0 导航设计`、`tokens/source/figma/Color.json`、`tokens/source/foundations/navigation-theme.json`
> 预览：`/components/top-navigation`

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

| 产品壳区域 | Figma 语义 | 当前消费方式 | 规则 |
|---|---|---|---|
| 顶部导航基础背景 | `theme-top-background` | `getThemeTopBackground(theme)` | 12 套主题各自定义 135° 渐变 |
| 顶部导航氛围层 | `theme-top-atmosphere` | `getThemeTopAtmosphere(theme)` | 统一三层结构：两层白色 radial 叠层 + 中性底线，叠加在主题顶导背景上 |
| 侧边导航 | `theme-side-background` | `getThemeSideBackground(theme)` | 12 套主题各自定义 180° 浅色渐变 |
| 标题栏 | `theme-title-background` | `getThemeTitleBackground(theme)` / `navigationCssVar("--sens-nav-title-bg", …)` / `getNavigationColorToken` | 每套主题独立定义 |
| 页面背景 | `body-background` | `getThemePageBackground(theme)` / `navigationCssVar("--sens-nav-page-bg", …)` / `getNavigationColorToken` | 每套主题独立定义 |
| 品牌实色 | `accent.solid` | `getNavigationAccent(theme).solid` | 选中文字、图标、短线等品牌强调 |
| 品牌浅底 | `accent.subtle` | `getNavigationAccent(theme).subtle` | 选中 / 悬停菜单浅底 |

### 2.1 12 套正式主题规格

下表是产品壳主题的正式颜色规格。所有主题均为常规浅色主题；子夜黑是常规主题名称，不代表暗色模式。氛围层没有为每套主题另设颜色值时，统一复用三层结构，只替换主题基础背景。

| 主题 | 顶导背景 | 侧导背景 | 标题栏 / 页面背景 | 品牌实色 | 品牌浅底 | 默认功能色 |
|---|---|---|---|---|---|---|
| 神策绿 | `#0F9670 → #0D826D` | `#FAFCFC → #F0F7F6` | `#F5FAFA` / `#F2F7F7` | 神策绿 10 | `#00B280 @ 0.1` | 神策绿 |
| 冰绽蓝 | `#3B78C9 → #305BB0` | `#FAFBFC → #F0F2F7` | `#F5F7FA` | 冰绽蓝 10 | `#3170EB @ 0.1` | 冰绽蓝 |
| 原野黄 | `#F0C400 → #F0AC00` | `#FCFCFA → #F7F6F2` | `#FAF8F5` | `#EA9B02` | `#FAB300 @ 0.12` | 冰绽蓝 |
| 青柠绿 | `#99CC00 → #76B500` | `#FCFCFA → #F6F7F2` | `#F9FAF5` | `#88B500` | `#99CC00 @ 0.12` | 青柠绿 |
| 沙丘金 | `#E0860F → #D4690C` | `#FCFBFA → #F7F3F0` | `#FAF8F5` | `#F57D14` | `#F57D14 @ 0.1` | 冰绽蓝 |
| 旭日红 | `#CC4F41 → #B23D3D` | `#FCFAFA → #F7F2F2` | `#FAF8F8` | `#E54545` | `#E54545 @ 0.1` | 冰绽蓝 |
| 极光绿 | `#4F9931 → #3D852D` | `#FBFCFA → #F3F7F2` | `#F9FAF5` | `#5CB838` | `#5CB838 @ 0.1` | 极光绿 |
| 山水蓝 | `#119ABF → #0D77A8` | `#FAFCFC → #F0F5F7` | `#F5F9FA` | `#15ACD6` | `#15ACD6 @ 0.1` | 山水蓝 |
| 兰花紫 | `#7E58D1 → #5F46B8` | `#FBFAFC → #F2F0F7` | `#F6F5FA` | `#7554EB` | `#7554EB @ 0.1` | 兰花紫 |
| 波光紫 | `#A947BF → #8939A8` | `#FCFAFC → #F5F0F7` | `#F8F5FA` | `#AE43D9` | `#AE43D9 @ 0.1` | 波光紫 |
| 云霞粉 | `#D63A8E → #BD2E6C` | `#FCFAFB → #F7F2F5` | `#FAF7F9` | `#E5459A` | `#E5459A @ 0.1` | 冰绽蓝 |
| 子夜黑 | `#48505E → #2E333C` | `#F9FAFC → #F2F4F7` | `#F5F6F9` | 神策绿 | `#00B280 @ 0.1` | 神策绿 |

每套主题还必须补齐其产品壳品牌态 handles：顶导功能入口、项目菜单、侧导选中背景、选中文字、选中图标、标题栏和页面背景。未列出的中性文字、图标、边框和分割线继续复用 Color Foundation，不因主题名称改变。

Figma 的渐变并未随颜色变量 JSON 输出，因此顶导基础背景、顶导氛围层与侧导背景由 `tokens/source/foundations/navigation-theme.json` 补充录入；12 套主题的品牌态 handle 覆盖也写在同文件的 `handles`。来源：神策绿 `207:54358`、冰绽蓝 `207:54681`，以及原野黄、青柠绿、沙丘金、旭日红、极光绿、山水蓝、兰花紫、波光紫、云霞粉、子夜黑对应节点。

## 3. Token 来源与生成

```text
tokens/source/figma/Color.json
  └─ 绿基线顶导 / 侧导状态色、标题栏、页面背景及透明度
tokens/source/foundations/navigation-theme.json
  └─ 12 套主题：渐变、氛围、title/page、accent、品牌 handles
        ↓ node build-tokens.mjs
src/design-system/tokens.resolved.json
  └─ color、navigationTheme
        ↓
src/design-system/navigation-color.ts
  └─ getThemeTopBackground(theme) / getThemeSideBackground(theme)
  └─ getThemeTitleBackground(theme) / getThemePageBackground(theme)
  └─ navigationCssVar(--sens-nav-title-bg|--sens-nav-page-bg, handle)
  └─ getNavigationAccent(theme) / getNavigationColorToken(handle, theme)
```

- `tokens.resolved.json` 和 `theme.ts` 都是生成物，禁止手改。
- Figma 颜色透明度保留为 CSS `#RRGGBBAA`，例如侧导悬停为 `#0015400F`。
- 中性态与默认 handle 继续 `getColorToken`；各主题品牌态优先 `getNavigationColorToken(handle, theme)`。
- 只有需要派生新透明度的效果层才用 `tokenRgba(handle, alpha)`。

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

- `NavigationTheme` 是独立类型（12 套常规浅色主题），不复用 `FunctionalSkin`。
- 12 套导航主题矩阵已录入 `navigation-theme.json`；导航品牌色与功能色保持独立。
- 新增导航主题时，必须补齐第 2 节槽位 + `accent` + 品牌态 `handles`，以及本页第 4、5 节中性态 Token（中性态可与绿共用 Color.json）。
- 组件不能根据 `component-primary` 推导侧导选中态；侧导必须消费 `theme-side-*` / `getNavigationColorToken`。
- 导航图标形状属于 Icon / navigation 分类，颜色由所在导航场景传入 `theme-top-*` 或 `theme-side-*`。
- `Navigation Color` 和 `Functional Skin` 是并列关系，不是上下级关系。位于产品壳里的功能组件，仍优先判断自己是否属于功能色消费对象，不能因为“在导航附近”就改用导航主题色。

## 7. 组件接入规则

- 顶导航、侧导航的结构、层级、收起展开归各自组件文档。
- 渐变、氛围层、文字、图标、目录状态必须通过 `Navigation Color` Token / helper 读取；换肤场景传 `theme`，品牌态用 `getNavigationColorToken`。
- 下拉面板的圆角、阴影、通用描边继续复用 Foundation；仅导航专属颜色进入本文件。
- 使用功能色的组件不因为位于产品壳中就改用 `theme-top-*` 或 `theme-side-*`。
- 页面样板间中如出现锚点、目录、筛选栏、抽屉内局部导航，应先按样板间和组件规则判断，不默认纳入本文件。
- **主题层**：12 套槽位、主题 helper 和预览规格已就绪；组件是否完整消费当前主题，继续按组件验收。

## 8. 当前范围与待补

- ✅ 12 套主题：顶导/侧导渐变、氛围、标题栏、页面底、accent、品牌态 handles 已录入；神策绿 / 冰绽蓝来源为 Figma `207:54358` / `207:54681`，其余主题对应节点已完成同结构整理。
- 氛围层当前统一复用三层叠层结构；如果后续 Figma 为某套主题提供独立氛围值，再单独覆盖该主题。
- 待补：侧边导航组件结构规则；组件侧改读 `getNavigationColorToken(theme)`（阶段 3）。
- 不在本页处理：功能色点击绿表 `#008C64` vs token `#008C65`（跟现有色板 / handle）；业务组件颜色和状态色换肤。
