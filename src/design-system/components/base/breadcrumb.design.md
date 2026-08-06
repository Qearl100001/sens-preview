# 面包屑设计规则

来源：
- 组件库：`🦄 设计系统_v2.1` · `1505:6166`（省略=False）/ `1505:6165`（省略=True）
- 省略下拉：标题栏面包屑稿 `1027:16259`（下拉菜单 / 1单行）
- 场景说明：`Sens.Design 标题栏 面包屑 v2.1`

## 使用范围

面包屑用于展示当前位置在信息架构中的路径，支持回退到祖先层级。
可独立使用，也可组合进页面标题栏（`SensPageTitleBar`）；**布局间距（距顶 11px、到标题 2px 等）属标题栏规则，不属本组件**。

## 结构

| 区域 | 规则 |
| --- | --- |
| 形态 | 单行横向；项与项之间用 `/` 分隔 |
| 普通态 | 完整路径；祖先可点，最后一项为当前页纯文本 |
| 省略态 | `ellipsis`：首项 + `more`（14）+ 当前项；点击 `more` 下拉列出被藏中间层级 |
| 截断 | 单项过长 ellipsis；默认 `maxWidth: 160`（组件内受控常量） |

## token 映射

| 属性 | token | 说明 |
| --- | --- | --- |
| 字号 / 行高 / 字重 | `font-size/s` + `line-height/s` + `font-weight/regular` | 12 / 18 / 400 |
| 项间距 | `spacing/1x` | 4px |
| 默认文字（祖先 / 当前 / 分隔 / more） | `text-sub-color-transparent` @0.58 | 当前项**不加深**，与前面同色 |
| 可点祖先 / more 悬停 | `link-color` | CSS `:hover`；对齐 linkWeak |
| 可点祖先 / more 点击 | `link-active-color` | CSS `:active` |
| 省略图标尺寸 | `size/icon/s` | 14px |
| 省略下拉 | `SensDropdownMenu` + `SensDropdownMenuItem` | 动作菜单浮层 |
| 光标 | `--sens-cursor-pointer` | 可点祖先与 more |

## 行为

- 最后一项为当前页：与默认同色、不可点、无悬停变色；`aria-current="page"`。
- 祖先有 `onClick` 才可交互（路径上变链接色）；可点项与 more 须有键盘可见焦点。
- `ellipsis` 且 `items.length > 2`：展示首 / more / 末；中间项进下拉；有 `onClick` 则执行并关浮层，无则仅关浮层。
- 容器：`nav` + `aria-label="面包屑"`；more 按钮 `aria-label="更多层级"`。

## 待补充

- 单项 `maxWidth: 160` 是否进 size token。
