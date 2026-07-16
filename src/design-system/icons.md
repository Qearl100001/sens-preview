# 设计系统 skill · 全局图标规范 Icon（作用于所有组件）

> 全局规则：所有页面、所有组件的图标都按这套来。颜色一律走 token，绝不硬编码。
> 源自 Sens.Design 图标规范 v2.1 + Color 集合里的图标色。

## 怎么做到「全局生效」
1. antd/sensd **内建图标**（下拉箭头、清空 ×、Modal 关闭等）→ 由主题 token `colorIcon` /
   `colorIconHover` 全局控制，`theme.ts` 已配好。
2. 应用里**自己放的图标**（如 Input 前缀的 `SearchOutlined`）不会自动继承 `colorIcon`，
   需按下面「按角色取色」**显式从 token 取色**（别写死 hex）。
3. 装上 sensd 后，其组件内部图标已按这套上色，是最彻底的全局生效方式。

## 图标色：按角色取（全部来自 Color，已在 theme/tokens.resolved 里）
| 角色 | Figma handle | antd token |
|---|---|---|
| 默认图标 | `icon-color`（→ `colorIcon`） | `colorIcon` |
| 次级/辅助图标 | `icon-sub-color` | `colorIconSecondary` |
| 禁用图标 | `icon-color-disable` | `colorIconDisabled` |
| 激活 / 选中 / 可点 hover | `component-primary` | `colorPrimary` |
| 语义图标（成功/提醒/警告/链接）| 对应状态色 token，**不要用默认灰** |
| 主色按钮内的图标 | `white` | 白字 on `colorPrimary` |
| 通用 hover | `text-color` | `colorIconHover`（加深到文字色）|

## 图标与文本的关系
- 布局：图标在文字左侧，**垂直居中对齐**（光学对齐，必要时微调 `spacing/0․5x`）。
- 间距：图标与文字间**必须留间距**，走 spacing token（默认 `spacing/1x` 或 `spacing/2x`，按 Figma 实测）。
  **不要让图标贴住文字**（这是搜索组件踩过的坑）。
- 比例：图标尺寸与文字行高匹配（约等于字号，常用 `size/icon/s` / `size/icon/m`）。

## 尺寸
- 取 `.Unit` 的 `size/icon/*` 已有尺寸 token，不要随手定值。

## 状态
- 默认 / hover（加深或主色）/ 禁用（禁用色）。

## 特例（文档明确）
- 搜索组件里的图标**可不完全遵循通用规范**，按搜索组件稿单独定（见 `base/search.md`）。
  这正是之前搜索图标颜色/间距「不一样」的根源。
- **链接下拉「更多 ▼」**：`ChevronDown` / `ChevronUp` 固定在文字**右侧**（`iconPosition="end"`），见 `base/button.md` 下拉按钮。
- **`ChevronDown` / `ChevronUp`**：选择器后缀 + 链接下拉「更多」专用；普通链接按钮用业务图标或 `icon-default`（`1471:5057`），图标在左。

## 导航图标（产品壳）
- 分类：产品壳导航图标统一登记为 `navigation`；顶部导航使用 `nav-*`，侧导航使用 `side-nav-*`。
- 范围：右上角工具区图标、产品切换 / 功能入口图标、顶部导航展开收起箭头、侧导航分组与产品壳展开收起入口。
- 颜色：不走通用 `icon-color`，由 Navigation Color 语义 token 决定。
- 顶导航右上角工具区 / 导航项箭头：默认走 `theme-top-text`，hover / active 走 `theme-top-text-hover` / `theme-top-text-active`。
- 功能入口菜单图标：默认走 `theme-top-funcMenu-icon`，hover / active 走 `theme-top-funcMenu-icon-hover` / `theme-top-funcMenu-icon-active`。
- 实现：SVG 路径必须使用 `currentColor`，由 `SensIcon` 或组件调用方传入 token 解析后的颜色；不要把 Figma 导出的 `#747E94` 直接写死到组件里。
- 侧导航成对图标：`side-nav-expand` / `side-nav-collapse` 分别用于 Normal 紧凑态展开与 Docked 收起；均默认使用 `theme-side-icon`，hover / 按下使用 `theme-side-icon-active`。

## 命名 / 分类（沿用规范）
- 组件库分类：界面通用类 / 功能入口类。
- 类型：编辑、操作、对象、符号、方向、功能、品牌标识、图表、文件格式、业务用语等。
- 优先复用已有图标，缺失才新增；新增按规范命名。

## 工程落点（当前仓库）
```
src/design-system/icons.md     # 本文件
src/design-system/theme.ts     # colorIcon / colorIconHover 等
src/ui/useSensIconTokens.ts    # 按角色取色 hook
src/ui/fieldIconProps.tsx      # allowClear / Select suffix
src/ui/search.css              # 图标与文字间距 spacing/1x
```
