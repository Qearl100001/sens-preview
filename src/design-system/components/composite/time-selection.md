# 时间筛选

> 为产品和设计提供时间筛选的选型与展示规范，帮助页面表达固定时间、动态时间和单日选择。<br>
> 成熟度：Pilot<br>
> 原型级运行时：Implemented（`SensTimeSelection`，Prototype Kit `0.9.1`）<br>
> 生产级完整组件：Deferred（1.0 前不建设）<br>
> 验证：Verified（当前原型运行时范围）<br>
> 来源：[时间组件 Figma 规则](https://www.figma.com/design/0sW8EB0cmrAMMeeVRry706/%E6%97%B6%E9%97%B4%E7%BB%84%E4%BB%B6?node-id=2108-66567&m=dev)，[静态时间范围](https://www.figma.com/design/0sW8EB0cmrAMMeeVRry706/%E6%97%B6%E9%97%B4%E7%BB%84%E4%BB%B6?node-id=2361-52607&m=dev)，[动态时间范围](https://www.figma.com/design/0sW8EB0cmrAMMeeVRry706/%E6%97%B6%E9%97%B4%E7%BB%84%E4%BB%B6?node-id=2361-52744&m=dev)，[业务组件规则](https://www.figma.com/design/sFKCni60z2iXkP1cAOdsJ3/%F0%9F%90%9D-%E8%AE%BE%E8%AE%A1%E7%B3%BB%E7%BB%9F_%E4%B8%9A%E5%8A%A1%E7%BB%84%E4%BB%B6?node-id=990-23892&m=dev)，日期时间展示状态：[未选择](https://www.figma.com/design/sFKCni60z2iXkP1cAOdsJ3/%F0%9F%90%9D-%E8%AE%BE%E8%AE%A1%E7%B3%BB%E7%BB%9F_%E4%B8%9A%E5%8A%A1%E7%BB%84%E4%BB%B6?node-id=1629-47587&m=dev)、[单日期](https://www.figma.com/design/sFKCni60z2iXkP1cAOdsJ3/%F0%9F%90%9D-%E8%AE%BE%E8%AE%A1%E7%B3%BB%E7%BB%9F_%E4%B8%9A%E5%8A%A1%E7%BB%84%E4%BB%B6?node-id=1629-47584&m=dev)、[日期区间](https://www.figma.com/design/sFKCni60z2iXkP1cAOdsJ3/%F0%9F%90%9D-%E8%AE%BE%E8%AE%A1%E7%B3%BB%E7%BB%9F_%E4%B8%9A%E5%8A%A1%E7%BB%84%E4%BB%B6?node-id=1629-47374&m=dev)、[日期时间区间](https://www.figma.com/design/sFKCni60z2iXkP1cAOdsJ3/%F0%9F%90%9D-%E8%AE%BE%E8%AE%A1%E7%B3%BB%E7%BB%9F_%E4%B8%9A%E5%8A%A1%E7%BB%84%E4%BB%B6?node-id=2907-39951&m=dev)、[动态单日](https://www.figma.com/design/sFKCni60z2iXkP1cAOdsJ3/%F0%9F%90%9D-%E8%AE%BE%E8%AE%A1%E7%B3%BB%E7%BB%9F_%E4%B8%9A%E5%8A%A1%E7%BB%84%E4%BB%B6?node-id=1629-47432&m=dev)、[动态区间](https://www.figma.com/design/sFKCni60z2iXkP1cAOdsJ3/%F0%9F%90%9D-%E8%AE%BE%E8%AE%A1%E7%B3%BB%E7%BB%9F_%E4%B8%9A%E5%8A%A1%E7%BB%84%E4%BB%B6?node-id=1629-47472&m=dev)；[时分秒选择器](https://www.figma.com/design/sFKCni60z2iXkP1cAOdsJ3/%F0%9F%90%9D-%E8%AE%BE%E8%AE%A1%E7%B3%BB%E7%BB%9F_%E4%B8%9A%E5%8A%A1%E7%BB%84%E4%BB%B6?node-id=983-29468&m=dev)，[年月选择箭头](https://www.figma.com/design/sFKCni60z2iXkP1cAOdsJ3/%F0%9F%90%9D-%E8%AE%BE%E8%AE%A1%E7%B3%BB%E7%BB%9F_%E4%B8%9A%E5%8A%A1%E7%BB%84%E4%BB%B6?node-id=984-89564&m=dev)，[区间单元格状态](https://www.figma.com/design/sFKCni60z2iXkP1cAOdsJ3/%F0%9F%90%9D-%E8%AE%BE%E8%AE%A1%E7%B3%BB%E7%BB%9F_%E4%B8%9A%E5%8A%A1%E7%BB%84%E4%BB%B6?node-id=952-94881&m=dev)，[时间模式切换](https://www.figma.com/design/sFKCni60z2iXkP1cAOdsJ3/%F0%9F%90%9D-%E8%AE%BE%E8%AE%A1%E7%B3%BB%E7%BB%9F_%E4%B8%9A%E5%8A%A1%E7%BB%84%E4%BB%B6?node-id=1105-51394&m=dev)，[24px 按钮状态](https://www.figma.com/design/sFKCni60z2iXkP1cAOdsJ3/%F0%9F%90%9D-%E8%AE%BE%E8%AE%A1%E7%B3%BB%E7%BB%9F_%E4%B8%9A%E5%8A%A1%E7%BB%84%E4%BB%B6?node-id=1105-56036&m=dev)，[选择方式快捷选项](https://www.figma.com/design/sFKCni60z2iXkP1cAOdsJ3/%F0%9F%90%9D-%E8%AE%BE%E8%AE%A1%E7%B3%BB%E7%BB%9F_%E4%B8%9A%E5%8A%A1%E7%BB%84%E4%BB%B6?node-id=952-94765&m=dev)，[快捷选项布局](https://www.figma.com/design/sFKCni60z2iXkP1cAOdsJ3/%F0%9F%90%9D-%E8%AE%BE%E8%AE%A1%E7%B3%BB%E7%BB%9F_%E4%B8%9A%E5%8A%A1%E7%BB%84%E4%BB%B6?node-id=1127-33337&m=dev)，[动态自定义数字输入](https://www.figma.com/design/sFKCni60z2iXkP1cAOdsJ3/%F0%9F%90%9D-%E8%AE%BE%E8%AE%A1%E7%B3%BB%E7%BB%9F_%E4%B8%9A%E5%8A%A1%E7%BB%84%E4%BB%B6?node-id=984-24096&m=dev)<br>
> 预览：`/composite/time-selection`

## 定位与边界

本规范用于项目中的时间筛选选型、结果表达和高保真原型运行时。`SensTimeSelection` 从 `0.9.1` 起由 Prototype Kit 导出，让 `sens-prototype` 等下游可以直接调用当前已验证的静态范围、动态周期、单日、草稿提交、放弃和禁用状态。

它不是研发侧生产日期组件。完整日期计算、年月选择菜单、完整时分秒菜单、交易日、时区、国际化和极端日期边界继续延后；1.0 前不让这些能力阻塞原型验证。

## 公共 API

- `value` / `defaultValue`：受控或非受控的已提交值；`null` 展示「请选择」。
- `onChange`：只在点击「完成」后回传新值；关闭浮层或点击「放弃」不提交草稿。
- `open` / `defaultOpen` / `onOpenChange`：用于页面控制多个选择器浮层互斥。
- `defaultMode`：默认进入静态或动态模式。
- `granularity`：`range` 或 `single`；单日不重复展示起止日期。
- `disabled`：禁用入口不打开浮层。
- `staticPresets` / `dynamicPresets`：允许原型按业务传入快捷项、结果区间和动态标签表达。
- `calendarMonths`：允许替换原型双月历的代表性五周月份数据；不提供六周月历适配和完整年月导航算法。

## 选型规则

| 模式 | 使用场景 | 结果表达 |
| --- | --- | --- |
| 固定时间范围 | 需要查看一段明确、不会随当前日期变化的时间 | 直接展示起止日期；按时刻筛选时同时展示时分秒 |
| 动态时间范围 | 需要随当前日期滚动更新的周期 | 相对周期标签与当前解析出的日期范围并列展示 |
| 单日 | 只需查看某一个自然日 | 静态单日展示完整日期；动态单日展示相对标签与解析后的具体日期，不重复起止日期 |

- 默认使用日粒度；仅当业务判断确实依赖日内时间时，再使用小时、分钟或秒。
- 固定范围与动态范围的差别必须在结果文案中清楚可见，避免把滚动周期误读为固定日期。
- 快捷项只保留当前任务中高频且能减少操作的范围；没有明显收益时不展示。
- 交易日、对比时间等业务扩展，仅在对应业务确实使用时增加说明，不作为默认时间筛选能力。

## 展示规则

- 入口默认展示「请选择」；悬停时外框描边切换为功能色，按下 / 激活时增加功能色描边光晕。背景与日历图标保持默认状态，占位文字使用禁用色。
- 禁用入口不响应点击，不打开选择面板；默认禁用使用 `background-transparent-grey-hover`、`divider/color/light/transparent` 与禁用文字 / 图标色。禁用悬停改用 `background-transparent-grey`、`divider/color/weak/transparent` 与 `text-color-transparent-disable-hover` / `icon-color-transparent-disable-hover`，不使用功能色。动态周期标签的底色同步从 `background-01-transparent` 切换为 `background-transparent-grey-hover`。
- 静态与动态时间区间的可交互入口悬停时仅将外框描边切换为功能色；背景、日期文字和图标保持默认状态。只读展示示例不响应悬停。
- 展开面板以浮层覆盖内容，不参与页面布局；视口空间不足时调整展开方向并限制在视口内。
- 顶部操作区总高为 40px，包含上下各 8px 内距与 24px 高的模式切换；高度按外框计算。
- 日历月份标题在左右翻页区之间居中展示；左右翻页区各占 32px。年份与月份分别作为选择项，组间距 12px，选择项水平内边距 4px、垂直内边距 1px，文字为 12px/18px 中字重，文字后使用 14px 向下图标。
- 日期选择器入口上的时间值与日期绑定展示；采用本组件的正文 PingFang 字体，字号 14px、常规字重，不带下拉箭头、边框或底色，不单独响应点击，悬停也不变为功能色。
- 当业务需要选择时分秒时，在面板底部灰色摘要条中显示时间选择控件；字号 12px/18px、中字重，右侧 14px 向下 / 向上箭头。默认透明底，悬停使用 `component-active-click-background` 与 `component-primary`，按下 / 激活使用 `component-active`。示例仅呈现控件默认、悬停、点击和激活反馈，不复刻完整时分秒选项菜单；非选择型时间使用无箭头的只读文字。状态参考 [默认](https://www.figma.com/design/sFKCni60z2iXkP1cAOdsJ3/%F0%9F%90%9D-%E8%AE%BE%E8%AE%A1%E7%B3%BB%E7%BB%9F_%E4%B8%9A%E5%8A%A1%E7%BB%84%E4%BB%B6?node-id=983-29487&m=dev)、[悬停](https://www.figma.com/design/sFKCni60z2iXkP1cAOdsJ3/%F0%9F%90%9D-%E8%AE%BE%E8%AE%A1%E7%B3%BB%E7%BB%9F_%E4%B8%9A%E5%8A%A1%E7%BB%84%E4%BB%B6?node-id=983-29490&m=dev)、[点击](https://www.figma.com/design/sFKCni60z2iXkP1cAOdsJ3/%F0%9F%90%9D-%E8%AE%BE%E8%AE%A1%E7%B3%BB%E7%BB%9F_%E4%B8%9A%E5%8A%A1%E7%BB%84%E4%BB%B6?node-id=983-29493&m=dev)、[激活](https://www.figma.com/design/sFKCni60z2iXkP1cAOdsJ3/%F0%9F%90%9D-%E8%AE%BE%E8%AE%A1%E7%B3%BB%E7%BB%9F_%E4%B8%9A%E5%8A%A1%E7%BB%84%E4%BB%B6?node-id=983-29496&m=dev)和[只读](https://www.figma.com/design/sFKCni60z2iXkP1cAOdsJ3/%F0%9F%90%9D-%E8%AE%BE%E8%AE%A1%E7%B3%BB%E7%BB%9F_%E4%B8%9A%E5%8A%A1%E7%BB%84%E4%BB%B6?node-id=2948-42751&m=dev)状态。
- 静态 / 动态模式切换使用业务组件中的 24px 按钮组选项，不替代或复用视图切换组件语义。
- 左侧快捷项采用窄栏双列排布：父容器横向 4px、纵向 8px 内距，选项间距 4px，选项高 24px、横向 8px / 纵向 3px 内距；选中项整行使用功能色浅底与中号字重。
- 静态快捷项按 Figma 展示自定义时间、日 / 周 / 月 / 年、过去 7 / 14 / 30 / 60 / 90 / 180 天和上线至今；动态快捷项按业务需要独立配置。
- 静态范围入口直接展示确定的日期 / 时刻；展开面板由左侧快捷项和右侧双月历组成。
- 日历星期与日期数字均使用 12px / 18px 行高、常规字重；选中范围起止日期使用功能色底和白字，中间日期使用功能色浅底，端点保持 24px 单元格与 3px 外侧圆角。
- 日期区间单元格状态参考 [Figma 日历单元格](https://www.figma.com/design/sFKCni60z2iXkP1cAOdsJ3/%F0%9F%90%9D-%E8%AE%BE%E8%AE%A1%E7%B3%BB%E7%BB%9F_%E4%B8%9A%E5%8A%A1%E7%BB%84%E4%BB%B6?node-id=952-94855&m=dev)；范围中间单元格使用浅色底与上下描边，并分别呈现默认、悬停、点击状态。预览中首次点击设起点，悬停日期显示左右半包端点和中间范围，第二次点击设终点；反向选择时按时间顺序显示。
- 日期、快捷项和模式切换属于未提交草稿；点击「完成」后才更新入口，点击「放弃」或关闭浮层则丢弃本次草稿。入口未应用过选择时保持「请选择」。日期区间摘要灰条总高 28px，浮层不出现横向滚动条。
- 动态范围入口将相对周期标签与当前解析出的日期并列；展开面板右侧是相对的「起始 / 截止」配置，不复用静态双月历。
- 动态自定义范围按对应选项显示日期或数字输入；时间筛选内的数字输入按 Figma 示例使用 96×24 控件、15px 步进器区和 8px 步进图标。它是本预览场景的局部尺寸适配，不改变基础 `SensInputNumber` 的全局规格。
- 日期范围按 `YYYY-MM-DD 至 YYYY-MM-DD` 表达；单日按 `YYYY-MM-DD` 表达。
- 使用示意应同时给出模式名称、适用场景和结果样例，不能只展示一个日期输入框。

## 预览说明

预览页并列展示静态范围与动态范围入口；初始入口显示「请选择」，点击入口后以浮层展示对应结构，打开或关闭不改变卡片和页面高度。面板可切换模式并选择快捷项：静态模式联动选中范围、双月历高亮和结果值；点击日历日期可依次选择起点和终点，悬停显示区间草稿；点击「完成」才应用到入口，「放弃」或点浮层外关闭不应用草稿，未完成前入口继续显示「请选择」。动态模式联动快捷项、相对起止表达与结果示例，自定义项的数字输入可编辑。样例日期沿用 Figma 画板数据，只用于讲解静态 / 动态范围如何表达，不代表当前时间；输入数字不驱动真实日历计算。此处不实现完整日历导航、真实时间计算或交易日算法。单日规则在页面下方说明，并展示动态单日入口；不另行复刻完整面板。

## 验收

- 能根据“固定范围 / 滚动周期 / 单日”三类需求选出对应模式。
- 日粒度作为默认，细粒度和业务扩展有明确触发条件。
- 结果文案能区分固定日期和动态周期。
- 静态 / 动态快捷项的选中反馈、右侧示意和底部结果相互对应；动态自定义项可编辑对应数字。
- 禁用状态覆盖未选择、静态日期时间区间和动态日期区间；禁用与禁用悬停均不打开面板，禁用悬停保持中性反馈。
- 日历区间草稿仅在点击「完成」后应用；「放弃」与浮层外关闭不更改入口。范围中间和左右半包端点状态正确，端点悬停 / 按下保持实色功能底与白字，中间日期保持浅色区间反馈；横向溢出不产生滚动条，摘要灰条总高 28px。
- 预览页直接消费公共 `SensTimeSelection`，不维护第二套组件实现。
- 独立消费者只安装固定包后可以完成类型检查、构建和核心交互。

## 长期边界

- `SensTimeSelection` 在 1.0 前维持原型级运行时定位，可用于高保真页面和业务流程验证。
- 生产级完整日期时间选择器继续延后；只有未来出现明确研发接入需求，并能提供完整产品交互规则时才重新立项。
- 交易日、对比时间、真实日期计算和年月导航不属于当前资产；具体业务确有需要时另行评估，不作为本页待办。
- 日内时刻仅展示 Figma 的结果格式和代表性交互反馈，不实现小时、分钟、秒的完整选择菜单。
