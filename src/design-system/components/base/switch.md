# 开关 Switch

> 成熟度：Pilot
> 实现：Implemented
> 验证：Verified（当前范围浏览器交互验收通过）
> 预览：`/components/switch`
> 设计说明：`switch.design.md`

## 边界

`SensSwitch` 表示立即生效的二元状态；不替代表单复选框，也不负责保存流程。

## API

- `checked` / `defaultChecked`：受控 / 非受控当前值。
- `onChange(checked)`：状态改变后回调。
- `disabled`：不可操作状态。
- `loading`：状态处理中，不可重复操作。
- `readOnly`：只读状态，仅展示状态点和“已开启 / 已关闭”。
- `showStatus`：在可操作开关旁显示当前状态文案。
- `aria-label`：开关对象名称；不可只依赖状态文案作为名称。

## Token 与状态

关闭轨道使用 `switch-background*` 专属颜色 token；开启轨道、悬停、点击及禁用色使用功能色，跟随 Preview 换肤。状态文字、图标和间距使用已有颜色、字号与间距 token。轨道尺寸依据 Figma 固定为 32×20px，滑块 14px。

加载图标为 12px 并在滑块内居中；关闭态使用 `icon-color-transparent`，开启态跟随当前功能色。

## 验收

- 预览状态矩阵覆盖开启 / 关闭、可选状态文案、悬停、点击、加载、禁用及只读。
- 开关点击后立即变更；禁用、加载、只读均不可触发变更。
- 开启色可随功能色换肤，关闭状态颜色保持开关专属 token。
- 只读态必须显示“已开启 / 已关闭”。

## 验收结论

当前范围的点击切换、禁用、加载与只读行为已通过浏览器验收；业务持久化仍由调用方负责。
