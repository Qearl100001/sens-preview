# 设计系统复合组件：通知配置

> 成熟度：Pilot<br>
> 实现：Implemented<br>
> 验证：Verified（当前范围浏览器交互验收通过）<br>
> 来源：通知设置截图；Alert、Checkbox、Radio、Select、Button、对象选择器基础 / 复合组件规则<br>
> 预览：`/composite/notification`

## 组件边界

- `SensNotificationSettings` 组合通知渠道、通知对象范围、发件人 / 收件人和 Webhook 配置入口。
- 渠道可独立开启：站内通知、邮件通知、Webhook 通知。
- 站内通知接收范围支持全部成员、指定成员；选择对象时复用 `SensRecipientSelector`。
- 事件标题、业务说明、默认配置、选项数据、页面壳、保存 / 放弃流程属于样板间或调用方，不由本组件绑定。
- 发件箱与 Webhook 的实际配置流程由业务系统承接；本 Demo 只展示入口及本地状态提示，不模拟后端保存。

## 结构与交互

- 每个业务事件是一组独立设置，可带选填标记及说明。
- 通知渠道由 Sens Checkbox 控制；关闭后隐藏该渠道的配置区。
- 站内通知的通知范围由 Sens Radio 单选；「指定成员」展开对象摘要及对象选择入口。
- 邮件通知提供发件人选择、配置发件箱入口、收件人对象选择入口。
- Webhook 通知提供接收群选择及配置入口。
- 配置链接使用 Sens Button；选择器浮层的显隐、确认 / 取消遵循对应 Sens 组件规则。

## Token 与依赖

- 颜色、分割线、圆角、字体由 SensD color / divider / unit / typography helper 提供。
- 依赖 Sens Alert、Checkbox、Radio、SelectDropdown、Button 与 SensRecipientSelector。
- 不使用 antd 控件默认视觉；通知配置样式使用 Sens token。对象选择器为避免 Tabs 底线重叠保留一条有文档说明的局部 `.ant-tabs-nav::before` 规则，不扩展为全局覆盖。
- 抽屉标题与页面保存流程由业务样板间组合 `SensDrawer` 与 `SensTitleBar`。

## 验收

- 渠道可独立开关，关联配置显示 / 隐藏正确。
- 通知范围切换到指定对象时可选择并在摘要中回显成员、角色、职务。
- 邮件与 Webhook 下拉可操作；配置入口能给出明确的演示提示。
- 抽屉可打开、放弃关闭、保存给出演示结果；不宣称已持久化。
- 已通过浏览器逐项验收：渠道显隐、全部 / 指定成员切换、对象选择确认与放弃、邮件开关及 Webhook 演示提示均符合当前规则。
