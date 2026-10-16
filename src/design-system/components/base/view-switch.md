# 视图切换 View Switch

> 基础组件；在同一组数据或模块内切换视角。
> 成熟度：Pilot<br>
> 实现：Implemented<br>
> 验证：Verified（当前范围浏览器交互验收通过）<br>
> 来源：Sens.Design 视图切换 v2.1（2023-04-20）及 Figma 组件变体。<br>
> 预览：`/components/view-switch`

## 边界

- 自持单选交互壳；不依赖 antd Radio / Segmented 的视觉或交互默认值。
- 负责互斥选中、禁用与选项外观；不承接页面导航、数据请求、视图渲染或业务权限。
- 支持 2–6 个选项；建议优先控制在 2–3 个，超过 6 个时由调用方改用选择器。

## API 与行为

- `options`：选项数组，含 `value`、`label?`、`icon?`、`ariaLabel?`、`tooltip?`、`disabled?`。
- `value` / `defaultValue`：受控 / 非受控选中值；未提供初值时选中首个可用项。
- `onChange(value)`：用户切换到另一个可用项时触发；重复点击当前项不触发。
- `disabled`：禁用整组；单项也可通过 `options[].disabled` 禁用。
- 设计支持上限为 6 项；组件不截断调用方传入的选项，超过上限属于不支持的用法。
- 使用 `role="group"`、`aria-pressed` 表达当前视角；组必须提供可访问名称。图标-only 选项须提供 `ariaLabel` 与 `tooltip`。

## 状态与 Token

- 未选中默认 / hover / active：白底；边框与文字分别使用深分割线 / `text-sub-color-transparent`、`component-primary`、`component-active`；active 使用功能色 2px 外环。
- 选中默认 / hover / active：使用 `component-active-background` / `component-active-hover-background` / `component-active-click-background`，边框与文字分别跟随 primary / hover / active。
- 未选中禁用 / 禁用悬停：使用 `background-transparent-grey-hover` / `background-transparent-grey`、`divider/color/deep/solid` / `divider/color/outline/solid`、禁用文字色。
- 选中禁用 / 禁用悬停：保留选中背景，边框与文字分别使用 `component-disable` / `component-disable-hover`（文字按 Figma 维持 component-disable）。
- 结构使用 `size/component-height/m`、`radius/m`、`spacing/horizontal/3x`、`spacing/horizontal/1x`；字样使用 `font-size/m`、`line-height/m`、`font-weight/regular|medium`。
- 功能色通过 Functional Skin CSS 变量跟随预览换肤；不新增 Token，不消费 `--ant-*`。

## 实现入口

- 组件：`src/ui/SensViewSwitch.tsx`
- 样式：`src/ui/view-switch.css`
- 状态预览：`SensViewSwitchStatesPreview`，仅预览矩阵使用静态 hover / active / disabled-hover 样式；真实组件不伪造伪类状态。

## 验收结论

- 已有真实 Demo 与 10 态 × 3 种内容组合状态矩阵；选择切换、重复点击与禁用行为已通过浏览器验收。
- Demo 展示 2、3、4、5、6 项五种分段布局；对应 Figma 示例节点 `15323:45260`、`15323:45220`、`15323:45160`、`15323:45022`、`15316:44004`。
- 图标由调用方传入；当前 Demo 使用 SensIcon 样例，不把图表图标限定为组件内置资产。
