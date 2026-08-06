# SensEntryCard

> 入口型卡片业务组件，建立在 `SensCard` 基础容器之上。
> 成熟度：Pilot
> 实现：Ready
> 验证：Pending
> 研发预览：`/components/card`

## 定位

`SensEntryCard` 用于功能入口、项目设置和配置入口等导航型场景。它是一个具备导航属性的整卡操作单元，不负责具体路由，也不把业务页面布局写入组件。

入口卡片固定承载三类内容：

- 彩色业务图标
- 不折行的入口标题
- 辅助说明文字

实际页面中的入口分组、标题层级和网格布局由样板间或页面宿主负责。

## API

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `size` | `large \| small` | `large` | 大号入口或小号入口 |
| `icon` | `ReactNode` | - | 彩色业务图标，必选 |
| `title` | `ReactNode` | - | 入口标题，必选且不折行 |
| `description` | `ReactNode` | - | 辅助说明，必选 |
| `interactive` | `boolean` | `true` | 是否启用入口交互 |
| `selected` | `boolean` | `false` | 选中视觉，不自动替代业务选择语义 |
| `disabled` | `boolean` | `false` | 禁用入口交互 |
| `onClick` | `function` | - | 由页面宿主处理导航或入口动作 |
| `onDoubleClick` | `function` | - | 由页面宿主处理双击入口动作；卡片不新增双击专属视觉状态 |

组件同时继承 `SensCard` 的 HTML 属性，可通过 `aria-current`、`aria-label` 等属性补充页面语义。

## 基础规格

| 使用点 | Token / 规则 | 数值 |
|---|---|---:|
| 外层内边距 | `spacing/3x` | 12px |
| 卡片圆角 | `radius/l` | 6px |
| 图文间距 | `spacing/3x` | 12px |
| 标题与辅助信息间距 | `spacing/1x` | 4px |
| 大号图标布局位 | `size/xxl + spacing/3x` | 60px；彩色图标在其中居中显示 48px |
| 小号图标布局位 | `size/xxl` | 48px；彩色图标显示 48px |
| 大号标题 | `font-size/l + line-height/l + font-weight/semibold` | 18 / 28 / 600 |
| 小号标题 | `font-size/m + line-height/m + font-weight/medium` | 14 / 22 / 500 |
| 辅助信息 | `font-size/s + line-height/s + font-weight/regular` | 12 / 18 / 400 |

Figma 中的固定宽度只用于样张对照；实现不设置固定最大宽度，卡片宽度由外部栅格和页面容器决定。

## 状态

| 状态 | 规则 |
|---|---|
| 默认 | 白底、浅描边、无投影 |
| 悬停 | 保持白底和描边，增加 `shadow/D3/down` |
| 点击 | 白底、`radius/m`（4px）、`component-active` 描边和 `shadow/active-ring/functional` 外环，不自动产生持久选中背景 |
| 选中 | 使用 `component-active-background`、`radius/l`（6px）和 active 描边，不带外环或投影 |
| 选中悬停 | 选中背景与描边不变，投影切换为 `shadow/D3/down` |
| 禁用 | 灰色浅底、浅描边和禁用文字层级，不能触发入口动作 |
| 禁用悬停 | 禁用内容层级不变，可保留 D3 投影用于对照 |

`selected` 只表达组件视觉状态。是否对应当前导航项、单选项或多选项，由页面宿主通过 `aria-current`、`aria-checked` 或其他业务语义承接。

## 图标规则

- 优先使用已注册的 `SensIcon` 彩色功能图标（`variant="colorful"`）；入口卡片示例使用 Figma「功能-彩色风格」中的业务资产。
- 图标资产必须来自项目图标注册表或已确认的 Figma 资产，不在页面中手写 SVG。
- 彩色功能图标固定使用 `size/xxl`（48px）；大号入口卡片只提供 60px 布局位，图标在其中居中，不将彩色资产放大到 60px。
- 图标与文字共同组成入口识别，不使用图标替代标题。

## 验收要求

- `/components/card` 同时展示大 / 小两种真实入口卡片。
- 状态矩阵使用真实 `SensEntryCard`，不能用静态色块替代组件。
- 点击状态、选中状态、禁用状态与 `SensCard` / Shadow / Color Foundation 一致。
- 入口卡片可以通过键盘 Enter / Space 触发 `onClick`。
- 入口卡片支持 `onDoubleClick`；双击行为由页面宿主处理，不改变卡片的选中规则。
- 标题不折行，辅助信息在空间不足时省略。
- 颜色、圆角、间距、字号、投影必须由 Token 或现有 helper 承接。
- 具体入口分组和页面布局放在卡片样板间，不反向扩展组件 API。
