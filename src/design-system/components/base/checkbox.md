# 复选框 Checkbox

复选框是基础选择控件，用于在一组选项中进行多选，也用于表格多选、下拉多选、树选择等复合组件中的选择入口。复选框组属于基础组件能力，常用于表单项。

## 组件边界

- 复选框单项负责单个选择项的视觉、语义和状态。
- 复选框组负责多个复选项的取值、方向与组间距。
- 表格批量选择、树节点级联关系、勾选后的关联结果属于复合组件或业务样板间。
- 复选框与单选框共用同一份 Figma 设计资料，但在代码、预览和文档中分开沉淀。
- 复选框不使用 antd 默认视觉；原生 `input[type="checkbox"]` 负责表单语义，SensD 自定义视觉层负责样式。

## 状态

| 取值 | 默认 | 悬停 | 点击 | 禁用 | 禁用悬停 |
| --- | --- | --- | --- | --- | --- |
| 未选中 | 白底 + 深分割线 | 白底 + 功能色描边 | 白底 + 点击描边 + 外环 | 灰底 + 浅分割线 | 灰底弱化 + 弱分割线 |
| 已选中 | 功能色底 + 白色勾 | hover 功能色底 | active 功能色底 + 外环 | 灰底 + 禁用图标色 | 灰底弱化 + 禁用悬停图标色 |
| 部分选中 | 功能色底 + 白色横线 | hover 功能色底 | active 功能色底 + 外环 | 灰底 + 禁用图标色 | 灰底弱化 + 禁用悬停图标色 |

## 内容结构

| 区块 | 说明 |
| --- | --- |
| 选择框 | 16px，自定义视觉层；勾选和半选横线由组件内部绘制 |
| 主文案 | 14 / 22，使用主要文字色 |
| 辅助文案 | 12 / 18，使用辅助文字色 |
| 前置图标 | 仅消费已录入 SensD 图标；无默认图标 |
| 帮助图标 | 当前 registry 未确认对应资产，先标 Missing，不使用错误图标替代 |
| 复选框组 | 多个复选项组成，支持横向 / 纵向排列 |

## 使用规则

- 控件与主文案之间固定 `spacing/horizontal/2x`。
- 主文案内的图标、帮助图标与文字之间固定 `spacing/horizontal/1x`。
- 选项自带辅助文案时，主文案到辅助文案之间使用 `spacing/vertical/1x`；辅助文案自然缩进到文字列下方。
- 复选框组横向选项间距固定为 `spacing/horizontal/6x`。
- 复选框组纵向选项间距固定为 `spacing/vertical/1x`。
- 无辅助文案的单行复选框组使用 `size/component-height/m` 作为选项对齐盒高度；选项内勾选框和文字垂直居中。
- 禁用时主文案和辅助文案都使用禁用文字色；禁用悬停时同步切到禁用悬停文字色。
- 带辅助文案或只读状态的组，不额外叠加 Figma 默认的上下 5px 组 padding；表单项里的垂直间距后续由表单基础规则接管。
- 表格表头全选、行多选可以复用本组件；批量操作信息区属于表格组件。
- 半选态用于父级汇总或“部分选择”的状态展示，不代表第三个业务值。

## Token 映射

| 项 | SensD token | 状态 |
| --- | --- | --- |
| 控件尺寸 | `size/icon/m` | Ready |
| 控件圆角 | `radius/s` | Ready |
| 控件与文字间距 | `spacing/horizontal/2x` | Ready |
| 内部图标与文字间距 | `spacing/horizontal/1x` | Ready |
| 主文案到辅助文案间距 | `spacing/vertical/1x` | Ready |
| 组内横向选项间距 | `spacing/horizontal/6x` | Ready |
| 组内纵向选项间距 | `spacing/vertical/1x` | Ready |
| 单行组选项高度 | `size/component-height/m` | Ready |
| 默认底色 | `white` | Ready |
| 默认描边 | `divider/color/deep/transparent` | Ready |
| hover 描边 | `component-primary` | Ready |
| 点击描边 | `component-active` | Ready |
| 点击外环 | `component-active-shadow` | Ready |
| 选中底色 | `component-primary` / `component-hover` / `component-active` | Ready |
| 选中标记 | `white` | Ready |
| 禁用底色 | `background-transparent-grey-hover` @6% | Ready |
| 禁用悬停底色 | `background-transparent-grey` @4% | Ready |
| 禁用描边 | `divider/color/light/transparent` | Ready |
| 禁用悬停描边 | `divider/color/weak/transparent` | Ready |
| 主文案 | `text-color-transparent` @90% + `font-size/m` + `line-height/m` | Ready |
| 辅助文案 | `text-sub-color-transparent` @58% + `font-size/s` + `line-height/s` | Ready |
| 禁用主文案 / 辅助文案 | `text-color-transparent-disable` @30% | Ready |
| 禁用悬停主文案 / 辅助文案 | `text-color-transparent-disable-hover` @24% | Ready |
| 帮助图标 | 待确认 SensD icon asset | Missing |

## 验收记录

- 不新增 hex。
- 不新增 rgba 字面量；透明度通过 `tokenRgba()` 派生。
- 不新增源 token。
- 不手改 `tokens.resolved.json` / `theme.ts`。
- 不使用 antd Checkbox 视觉层。
