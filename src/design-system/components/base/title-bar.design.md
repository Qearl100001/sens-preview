# 标题栏 / 面包屑设计规则

来源：`Sens.Design 标题栏 面包屑 v2.1 20221205`

## 使用范围

标题栏用于承载页面级或抽屉级标题，可带返回入口、面包屑与右侧操作。顶部导航不属于本组件范围，需单独实现。

## 结构

| 区域 | 规则 |
| --- | --- |
| 容器 | 高度 72px / 94px；背景按类型选择 |
| 类型：落地页 | `variant="landing"`，用于一级页面或无下钻语义的页面标题区，背景使用 `white` |
| 类型：下钻页 | `variant="drilldown"`，用于带面包屑 / 返回的标题区，背景使用 `theme-title-background` |
| 高度 | 无辅助文案为 72px；有辅助文案为 94px |
| 左侧 | 面包屑在上；返回热区单独占 24px 宽，图标距左侧 2px；标题、面包屑、辅助文案从同一竖线起始；标题单行截断 |
| 辅助文案 | 位于标题行下方，单行截断；不参与右侧按钮对齐 |
| 右侧 | 操作按钮组，右侧留 24px，操作间距 16px |
| 抽屉返回入口 | `SensButton tone="linkWeak"` 纯图标，图标使用 `chevron-left`；默认中性，hover / active 变链接色 |
| 页面返回入口 | `SensButton tone="linkWeak"` 纯图标，图标使用 `chevron-left`；默认中性，hover / active 变链接色 |
| 面包屑 | 小字号 12 / 18，支持普通态和省略态 |
| 对齐规则 | 右侧操作始终与大标题行对齐 |

## token 映射

| 属性 | token / 常量 | 说明 |
| --- | --- | --- |
| 落地页背景 | `white` | 一级页面标题区 |
| 下钻页背景 | `theme-title-background` | 属于导航换肤色系 |
| 标题文字 | `font-size/xxl + line-height/xxl + font-weight/semibold` | 20 / 30 / 600 |
| 标题颜色 | `tokenRgba("text-color-transparent", 0.9)` | 主文本 |
| 辅助文案 | `font-size/s + line-height/s + font-weight/regular` | 12 / 18 / 400 |
| 辅助文案颜色 | `tokenRgba("text-sub-color-transparent", 0.58)` | 次级说明 |
| 抽屉返回 | `SensButton tone="linkWeak"` + `size/icon/l` + `spacing/6x` | 弱化图标链接按钮，24px 热区 |
| 页面返回 | `SensButton tone="linkWeak"` + `size/icon/l` + `spacing/6x` | 弱化图标链接按钮，24px 热区 |
| 面包屑文字 | `font-size/s + line-height/s + font-weight/regular` | 12 / 18 / 400 |
| 面包屑颜色 | `text-sub-color-transparent` / `text-color-transparent` / `link-color` / `link-active-color` | 默认、当前项、悬停、点击 |
| 面包屑到标题 | `spacing/0․5x` | 2px |
| 标题到辅助文案 | `spacing/1x` | 4px |
| 右侧留白 | `spacing/6x` | 24px |
| 操作间距 | `spacing/4x` | 16px |
| 标题栏高度 | `size/component-height/title-bar` / `size/component-height/title-bar-with-description` | 72 / 94 |

## 待补充

- 面包屑当前只做普通态 / 省略态，不做下拉型面包屑。
- 标题栏背景属于导航色系，后续导航换肤整体整理时需要一起复核。
