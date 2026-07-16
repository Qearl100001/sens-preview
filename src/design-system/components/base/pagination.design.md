# 分页器 Pagination · 设计规范（给设计师）

> 基础组件层。分页器独立于表格，表格不内置分页器；筛选表格等复合组件按页面需要组合使用。

## 什么时候使用
- 数据列表跨页展示时使用分页器。
- 大多数普通列表表格需要分页器。
- 录入型表格、树表格通常不使用分页器，按业务结构滚动或分组展示。

## 组件结构
| 区块 | 说明 |
|---|---|
| 总数 / 范围 | 如「本页显示第 41-60 条」 |
| 页码 | 默认、hover、点击、选中、禁用 |
| 上一页 / 下一页 | 首页或尾页时禁用 |
| 折叠页码 | 点击后向前或向后跳 5 页 |
| 每页条数 | 常用 10 / 20 / 50 / 100 |
| 跳页输入 | 输入页码后跳转 |

## 类型
| 类型 | 使用场景 |
|---|---|
| 常规分页器 | 管理类列表、表格、结果页 |
| 简约型分页器 | 空间紧张、只需前后翻页和当前页反馈；由 SensD icon + 小输入框组成 |

## 常规分页器场景
| 场景 | 展示规则 | 使用建议 |
|---|---|---|
| 总页数 ≤ 10 / 无数量控制 | 单屏范围内展示全部页码 | 简单列表，通常不需要快速跳转 |
| 总页数 ≤ 10 / 有数量控制 | 全部页码 + 每页条数选择器 | 需要用户切换每页条数，但总页数仍少 |
| 总页数 > 10 / 无数量控制 | 折叠页码 + 快速跳转 | 页码需要缩略显示，建议提供快速跳转 |
| 总页数 > 10 / 有数量控制 | 折叠页码 + 每页条数选择器 + 快速跳转 | 普通列表表格的常见组合 |

## 行为
- 页码点击后进入选中态。
- hover 只表达可点击，不改变数据。
- 上一页 / 下一页使用 SensD `chevron-left` / `chevron-right`；默认颜色为 `icon-color-transparent`，禁用态走 icon disable，不混用页码文字色。
- 分页器不支持折行展示；页面宽度不足时由外层容器处理横向溢出。
- 分页器默认自适应内容宽度，不负责整体靠右或占满容器；靠左、靠右、滚动由页面布局或复合组件决定。
- 分页器内部相邻控件间距固定为 `spacing/horizontal/2x`（8px）。
- 简约型结构为「上一页 icon + 小输入框 + / 总页数 + 下一页 icon」；前后 icon 无外框，输入框使用小号输入框。
- 输入合法页码后跳转。
- 输入非法页码后失焦清空或回到当前页。
- 总页数 ≤ 10 时，单屏范围内显示全部页码，不出现 `more` / 折叠页码。
- 总页数 > 10 时，默认使用折叠页码缩略显示。
- 折叠页码向前 / 向后移动 5 页。
- 折叠页码默认显示 `more` 中性图标；hover 时切换为 `double-chevron-left` / `double-chevron-right`，颜色走固定 `link-color`，不跟 Functional Skin 换肤。
- 折叠页码 hover 箭头必须显示 Tooltip，文案为「向前 5 页」/「向后 5 页」；不使用浏览器原生 title。
- Tooltip 在分页器里是高频反馈：上一页 / 下一页 hover 显示「上一页」/「下一页」；禁用 hover 显示「当前已在首页」/「当前已在尾页」。
- 每页条数选择器 hover 显示「切换每页条数」；跳页输入 hover 显示「输入要跳转的页码」。
- 每页条数改变后，当前页由业务决定是否回到第一页。
- 每页条数选择器复用 SensD 选择器触发框，展开后复用 SensD 下拉菜单；点击后只展示页数选项，不出现搜索。
- 每页条数选择器默认自适应内容宽度，不在分页器内固定宽度。

## 与表格的关系
- 分页器不是表格内部结构。
- 普通「筛选表格」由筛选区、表格、分页器组合。
- 录入型表格、树表格不默认带分页器。

## Token 映射状态
| 视觉项 | SensD token / handle | 组件消费 | 状态 |
|---|---|---|---|
| 页码背景 | `white` | 页码底色变量 | Ready |
| 页码文字 | `text-color-transparent` @90% | 页码默认文字 | Ready |
| 页码默认描边 | `divideline-color-transparent-dack` @16% | 默认边框 | Ready |
| 总数 / 范围文字 | `text-color-transparent` @90% | 左侧范围文案 | Ready |
| 页码 hover | `white` + `component-primary` + `shadow/D3/down` | 白底、绿描边、绿字、D3 | Ready |
| 页码点击 | `white` + `component-active` + `shadow/active-ring/functional` | 白底、active 描边、active 字、active ring 光晕 | Ready |
| 上一页 / 下一页按钮 | 同页码默认 / hover / 点击 / 禁用状态 token | 翻页按钮 | Ready |
| 上一页 / 下一页图标 | `chevron-left` / `chevron-right` + `icon-color-transparent` | SensD 图标资产 | Ready |
| 上一页 / 下一页禁用图标 | `icon-color-transparent-disable` / `icon-color-transparent-disable-hover` | 翻页按钮禁用图标 | Ready |
| 折叠页码默认图标 | `more` + `icon-color-transparent` | 默认省略号 | Ready |
| 折叠页码 hover 图标 | `double-chevron-left` / `double-chevron-right` + `link-color` | 向前 / 向后跳 5 页；固定状态色，不换肤 | Ready |
| 当前页选中 | `component-primary` + `white` + `divideline-color-transparent-light` @8% | 绿底白字 | Ready |
| 当前页选中 hover | `component-hover` + `white` + `divideline-color-transparent-light` @8% | hover 绿底白字 | Ready |
| 禁用 | `background-transparent-grey-hover` @6% + `text-color-transparent-disable` @30% | 灰底禁用 | Ready |
| 禁用 hover | `background-transparent-grey` @4% + `text-color-transparent-disable-hover` @24% | 禁用悬停 | Ready |
| 输入聚焦 | `component-active` / `component-active-shadow` | 跳页输入聚焦 | Ready |
| 描边 | `outline-color` | 页码与输入框边界 | Ready |
| 常规页码尺寸 | `size/component-height/m` | 常规页码高度 | Ready |
| 小号页码尺寸 | `size/component-height/s` | 小号页码高度 | Ready |
| 圆角 | `radius/m` | 页码圆角 | Ready |
| 控件间距 | `spacing/horizontal/2x` | 页码、翻页、选择器、跳页输入之间的 8px 间距 | Ready |
| 字号 / 行高 | `font-size/m` / `line-height/m` | 页码与范围文字 | Ready |
| 简约型前后 icon | `chevron-left` / `chevron-right` + `icon-color-transparent` | 无外框 icon 按钮 | Ready |
| 简约型输入框 | Input 小号组件 | 当前页输入框 | Ready，依赖 Input |
| 每页条数选择器触发框 | Select 基础组件 token | size changer 触发框 | Ready，依赖 Select |
| 每页条数下拉菜单 | Dropdown Menu / `SensSelectDropdown` token | size changer 下拉菜单 | Ready，依赖 Dropdown Menu |
| 跳页输入框 | Input 基础组件 token | quick jumper | Ready，依赖 Input |
| 悬停提示 | Tooltip 基础组件 token | 翻页按钮、折叠页码、选择器、跳页输入提示 | Ready，依赖 Tooltip |
| 状态矩阵辅助说明 | `text-sub-color-transparent` @58% | 预览页说明文案，不属于分页器本体 | Ready |

## 后续记录
- 分页器文案已有 Figma 变量来源，当前先不单点接入；等基础组件文案策略统一后再处理。
- 输入框宽度等派生尺寸当前由基础尺寸 token 推导；若后续多个组件复用或 Figma 明确命名，再提升为独立 design token。

---
*实现方式、props 与代码落点见研发文档 `pagination.md`。*
