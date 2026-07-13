# Navigation Color Foundation

> 主要来源：Figma `设计系统 2.0 导航设计`、`docs/foundations/color.md` 原导航颜色系统段落、`src/design-system/tokens.resolved.json`、`src/design-system/theme.ts`。  
> 当前状态：规则确认中；本文件先作为导航主题色 foundation，不等同于产品壳 / 导航实现已完成。

## 1. 定位

Navigation Color 负责统一顶导航、侧导航、标题栏、页面主题背景、功能入口菜单、项目菜单、logo / text / icon / line 等导航主题色。

它是独立的主题色分支，不应直接混进普通 `component-*` / `text-*` / `link-*` 颜色体系里。

## 2. 与 Color Foundation 的边界

| 类型 | 归属 | 说明 |
|---|---|---|
| 普通组件主色 / hover / active | `color.md` | Button、Input、Select、选中态等 |
| 链接 / 成功 / 提醒 / 警告 | `color.md` | 状态色不随功能色换肤变化 |
| 文本 / 边框 / 背景 | `color.md` | 普通页面和组件中性色 |
| 顶导航 / 侧导航 / 标题栏 | `navigation-color.md` | 产品框架专属主题色 |
| 页面主题背景 | `navigation-color.md` | 跟随导航主题分支 |
| 换肤映射表 | `navigation-color.md` | 后续按 Figma / token 映射维护 |

## 3. 来源

- Figma：`设计系统 2.0 导航设计`
- 页面节点：`83:12679`，`换肤 ⭐️⭐️⭐️`
- 色板节点：`2194:54928`，`神策绿 主题色`
- 表格节点：`2194:53497`，`神策绿 换肤`

## 4. 当前命名差异

| Figma 命名 | 当前代码方向 | 说明 |
|---|---|---|
| `主题色/顶导航/...` | `theme-top-*` | 顶部导航专用颜色 |
| `主题色/侧导航/...` | `theme-side-*` | 侧边导航专用颜色 |
| `主题色/标题栏/背景/01` | `theme-title-background` | 标题栏背景 |
| `主题色/页面/背景/01` | `body-background` | 页面背景 |

## 5. 导航颜色主要分组

- 顶导航：背景、角色背景、功能入口菜单背景 / 文字 / 图标、项目菜单背景 / 文字、logo、文字与图标、图标背景、线、菜单线。
- 侧导航：背景、目录背景、文字、图标。
- 标题栏：背景。
- 页面：背景。
- 导航换肤：导航主题色需要独立换肤矩阵；如复用功能色，必须通过映射表确认。

## 6. 已读到的关键值

| 名称 | 色值 | 说明 |
|---|---|---|
| `主题色/顶导航/背景/01` | `linear-gradient(135deg, #0F9670 0%, #0D826D 100%)` | 顶导航背景，跟随换肤 |
| `主题色/侧导航/背景/01` | `linear-gradient(180deg, #FAFCFC 0%, #F0F7F6 100%)` | 侧导航背景，跟随换肤 |
| `主题色/页面/背景/01` | `#F5FAFA` | 页面背景，跟随换肤 |
| `主题色/标题栏/背景/01` | `#F5FAFA` | 标题栏背景，跟随换肤 |
| `主题色/顶导航/文字&图标/01_默认` | `rgba(255, 255, 255, 0.8)` | 顶导航功能选择区域默认文字和图标 |
| `主题色/顶导航/文字&图标/02_悬停` | `#FFFFFF` | 顶导航功能选择区域悬停文字和图标 |
| `主题色/顶导航/文字&图标/03_选中` | `#FFFFFF` | 顶导航功能选择区域选中文字和图标 |
| `主题色/侧导航/文字/01_主要` | `rgba(23, 28, 38, 0.9)` | 侧导航主要文字 |
| `主题色/侧导航/文字/02_辅助` | `rgba(8, 18, 38, 0.58)` | 侧导航辅助文字 |
| `主题色/侧导航/文字/03_选中` | `#00B280` | 侧导航选中文字 |

## 7. 待确认差异

- Figma 表格里功能色点击值为 `#008C64`，当前代码 `theme.ts` / `tokens.resolved.json` 中 `component-active` 为 `#008C65`。后续处理换肤或导航 token 时必须确认来源差异，不能直接忽略。
- 当前 TikTok case 导航后置，但后续实现产品壳 / 导航时必须单独整理映射表：`Figma 名称 -> 当前代码 token -> 色值 -> 是否跟随换肤 -> 用途 -> 待确认`。

Navigation Color 预览页已补：`/basic-styles/navigation-color` 当前作为导航颜色入口，展示边界、分组、已有代码方向、关键映射状态和待补问题；它不是完整导航换肤矩阵，也不代表产品壳 / 导航实现已完成。

## 8. Navigation Color 录入映射表

> 这张表用于指导后续 token 录入：先判断现有 handle 是否足够，再决定补 source token、补 helper，还是只补组件接入。

| 分组 | Figma 名称 / 设计项 | 当前 token handle / helper | 当前值 / 代码方向 | 状态 | 需要动作 | 备注 |
|---|---|---|---|---|---|---|
| 顶导航 | 背景渐变 | `getThemeTopBackground()` | 绿：`#0F9670 -> #0D826D`；蓝：走 helper | 半 ready | 补正式背景 helper/token；补绿/蓝换肤矩阵 | 现在是 helper，不是完整 token 表 |
| 顶导航 | 角色背景 | `theme-top-role-background` | `#000000` + 组件侧透明度 | 半 ready | 补透明度语义 | 当前组件用 `tokenRgba(..., 0.14)` |
| 顶导航 | 功能入口菜单背景 | `theme-top-funcMenu-background-hover/active` | `#00B280` + 组件侧透明度 | 半 ready | 补默认态；补透明度语义 | 当前缺明确 default background handle |
| 顶导航 | 功能入口菜单文字 | `theme-top-funcMenu-text/hover/active` | `#171C26 / #00B280 / #00B280` | 已 ready | 组件按状态接入 | 用于产品壳专属下拉 |
| 顶导航 | 功能入口菜单图标 | `theme-top-funcMenu-icon/hover/active` | `#747E94 / #00B280 / #00B280` | 已 ready | 组件按状态接入 | 顶部导航产品切换图标已接 default |
| 顶导航 | 项目菜单背景 | `theme-top-proMenu-background-hover/active` | `#001540 / #00B280` | 半 ready | 补默认态；补透明度语义 | 当前 active 在 Figma 可能是主色透明度 |
| 顶导航 | 项目菜单文字 | `theme-top-proMenu-text/hover/active` | `#171C26 / #171C26 / #00B280` | 已 ready | 组件按状态接入 | 需要和项目切换浮层一起验收 |
| 顶导航 | logo | `theme-top-logo` | `#FFFFFF` | 已 ready | 组件接入 | 形状/品牌资产另归 Logo 边界 |
| 顶导航 | 文字&图标 | `theme-top-text/hover/active` | `#FFFFFF / #FFFFFF / #FFFFFF` + 组件侧透明度 | 半 ready | 补默认 80% 透明度语义 | 当前默认态靠 `tokenRgba("theme-top-text", 0.8)` |
| 顶导航 | 图标背景 | `theme-top-icon-hover/active` | `#000000 / #000000` + 组件侧透明度 | 半 ready | 补透明度语义 | 用于右上角工具图标 hover/active 背景 |
| 顶导航 | 横线 / 竖线 | `theme-top-line-dack/light` | `#000000 / #000000` + 组件侧透明度 | 半 ready | 补线条透明度语义 | 当前组件用 `0.06/0.08/0.12` |
| 顶导航 | 菜单线 | `theme-top-menuLine-outlined/divide/active` | `#001540 / #001540 / #00B280` | 已 ready | 组件接入 | 需确认 outlined/divide 的透明度是否在 token 层 |
| 侧导航 | 默认背景渐变 | 暂无完整 handle | Figma：`#FAFCFC -> #F0F7F6` | 待录入 | 补 `getThemeSideBackground()` 或 source token | 当前只在文档里记录 |
| 侧导航 | 目录背景 | 暂无完整 handle | 待确认 | 待录入 | 补目录背景 default/hover/active | 这是侧导航结构实现前必须补的项 |
| 侧导航 | 背景状态 | `theme-side-background-hover/click/active` | `#001540 / #001540 / #00B280` | 半 ready | 补默认态；补透明度语义 | hover/click 可能是黑色透明度 |
| 侧导航 | 文字 | `theme-side-text/subText/text-active` | `#171C26 / #081226 / #00B280` + 透明度待确认 | 半 ready | 补主要/辅助文字透明度语义 | Figma 记录为 90% / 58% |
| 侧导航 | 图标 | `theme-side-icon/subIcon/icon-active` | `#747E94 / #747E94 / #00B280` | 已 ready | 组件接入 | 需要侧导航组件验证 |
| 标题栏 | 背景 | `theme-title-background` | `#F5FAFA` | 已 ready | 组件接入 | 与页面背景同值但语义独立 |
| 页面 | 页面主题背景 | `body-background` | `#F5FAFA` | 已 ready | 组件接入 | 跟随导航主题分支 |
| 换肤 | 绿 / 蓝导航主题映射 | 部分 helper | 顶导航背景已有 helper；其他组不完整 | 待录入 | 补完整换肤矩阵 | 后续需要列出每个 handle 的绿/蓝值 |
| 全局 | Figma -> token 长期映射 | 本表初版 | 文档 + HTML 展示 | 半 ready | 后续补变量 ID、Figma node、接入组件 | 作为 token 录入工作台 |

## 9. 代码落地规则

- 导航颜色不能混用普通 `component-*` / `text-*` / `link-*` 语义，除非已经明确映射。
- 顶导航、侧导航、标题栏、页面主题背景应建立独立 token / helper / theme 映射。
- 渐变、rgba、换肤状态必须通过 token 或 helper 承接，不能在产品壳里继续硬编码。
- 做导航 / 产品壳前，必须先补映射表。
- `tokens.resolved.json` / `theme.ts` 是生成物，不能手改。

## 10. 当前问题与处理策略

| 问题 | 当前处理 | 建议时机 |
|---|---|---|
| 导航主题色系统独立 | 已拆出 Navigation Color Foundation | 做产品壳 / 导航前 |
| 全局换肤未完成 | 先记录，不纳入 TikTok 两周主验收 | 单独立项 |
| 顶导航 / 侧导航渐变仍可能硬编码 | 暂不改代码 | 产品壳阶段 |
| Figma 与代码 `component-active` 存在 1 个 hex 差异 | 记录差异，不直接修正 | 换肤映射阶段 |
| 缺少完整 Figma -> token 映射表 | 待补 | 导航实现前 |

## 11. 待补

- 按映射表逐项补 source token / helper / 组件接入状态。
- 按顶导航 / 侧导航 / 标题栏 / 页面背景拆分 token。
- Navigation Color 预览页已补，后续继续扩展完整映射表和换肤矩阵。
- 做产品壳 / 导航组件前，先完成换肤状态矩阵。
