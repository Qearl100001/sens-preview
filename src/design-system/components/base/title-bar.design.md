# 标题栏 / 面包屑设计规则

来源：`Sens.Design 标题栏 面包屑 v2.1 20221205`

## 使用范围

标题栏用于承载页面级或抽屉级标题，可带返回入口、面包屑与右侧操作。顶部导航不属于本组件范围，需单独实现。

## 结构

| 区域 | 规则 |
| --- | --- |
| 容器 | 高度 72px，背景使用 `theme-title-background` |
| 左侧 | 返回按钮 + 标题，标题单行截断 |
| 右侧 | 操作按钮组，右侧留 24px，操作间距 16px |
| 抽屉返回入口 | `SensButton tone="link"` 纯图标，图标使用 `chevron-left` |
| 页面返回入口 | `SensButton tone="linkWeak" size="small"` 纯图标，图标使用 `chevron-left` |
| 面包屑 | 小字号 12 / 18，支持普通态和省略态 |

## token 映射

| 属性 | token / 常量 | 说明 |
| --- | --- | --- |
| 背景 | `theme-title-background` | 属于导航换肤色系 |
| 标题文字 | `font-size/xxl + line-height/xxl + font-weight/semibold` | 20 / 30 / 600 |
| 标题颜色 | `tokenRgba("text-color-transparent", 0.9)` | 主文本 |
| 抽屉返回 | `SensButton tone="link"` + `size/icon/l` | 状态由 Button 链接按钮规则接管 |
| 页面返回 | `SensButton tone="linkWeak" size="small"` + `size/icon/l` | 弱化图标链接按钮 |
| 面包屑文字 | `font-size/s + line-height/s + font-weight/regular` | 12 / 18 / 400 |
| 面包屑颜色 | `text-sub-color-transparent` / `text-color-transparent` / `link-color` / `link-active-color` | 默认、当前项、悬停、点击 |
| 右侧留白 | `spacing/6x` | 24px |
| 操作间距 | `spacing/4x` | 16px |
| 标题栏高度 | `SENS_TITLE_BAR_HEIGHT = 72` | 组件级尺寸，后续可沉淀为 component token |

## 待补充

- 面包屑当前只做普通态 / 省略态，不做下拉型面包屑。
- 标题栏背景属于导航色系，后续导航换肤整体整理时需要一起复核。
