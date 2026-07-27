# 设计系统 skill · 复合组件：复合表单

> 可跨业务复用的表单组合模式，不替代 Form、Table、Radio、Checkbox、Title 等基础组件规则。<br>
> 成熟度：Pilot<br>
> 实现：Implemented<br>
> 验证：Pending<br>
> 来源：Form、Table、Title、Radio、Checkbox 等基础组件规则。<br>
> 预览：`/composite/form`

## 当前收录

| 复合表单 | 适用场景 | 关键规则 | 依赖 |
| --- | --- | --- | --- |
| 带表格表单 | 需要在一张表单中录入或配置结构化多行数据 | 表格永远位于所属标题下方，不受表单上下 / 左右布局影响；灰底标题通栏拉满；标题到表格固定 16px；仅表格外框内缩 16px，与标题文案左边对齐 | Form、Title、Table、Button |
| 联动表单 | 单选或复选的选择结果决定后续字段、卡片或提示是否出现 | 四类联动结构均覆盖上下、左右布局；选中项下有控件、卡片或结果时，标题与整组顶部对齐，Radio / Checkbox 不补 32px 对齐外框；触发选项到关联内容间距为 8px | Form、Radio、Checkbox、Input、Select |
| 卡片表单 | 信息层级较深，需要使用白描边卡与灰底卡建立分组 | 覆盖灰条分组、左右布局卡、关联灰底卡；灰条下内容以 16px 与标题文字对齐 | Form、Title、Card Foundation |

## 不在本轮收录

| 项目 | 原因 | 后续前置条件 |
| --- | --- | --- |
| 分步表单 | 依赖步骤条基础组件 | 补齐 Steps 组件与状态规则 |
| 锚点表单 | 依赖锚点 / Context Side Panel 基础组件和当前产品壳高度 | 先完成 Layout P0 待收口项与 Anchor 组件 |
| 模态表单 | 依赖 Modal 基础组件；当前仅有 Drawer | 完成 Modal 组件与关闭、校验、离开保护规则 |
| 页面滚动表单 | 属于 Layout / Product Shell 行为 | 见 Layout Foundation 的 P0 待收口清单 |

## 录入边界

- 复合表单只组合已 Ready 的基础组件与 token。遇到缺失的基础组件、图标或语义 token，先标记 `Missing / To Confirm`。
- 页面级滚动、产品壳、锚点等跨页面行为由 Layout 负责，不能在单个复合表单内模拟为私有规则。
- 真实业务对象、默认值、字段数量、权限和提交流程进入样板间或案例，不写进复合组件。
- 带表格表单中，外层板块先使用 `spacing/horizontal/4x`（16px）左右 padding；灰底标题通栏拉满内容区（宽度自适应），标题文案再使用其自身 `spacing/horizontal/4x`（16px）内边距。灰底标题到表格纵向固定 `spacing/vertical/4x`（16px）。仅表格外框额外缩进 `spacing/horizontal/4x`（16px），与灰底标题文案共用对齐线，不得把灰底标题容器一起缩进。
- 联动表单中，选项到其关联控件、关联卡片或关联结果使用 `spacing/vertical/2x`（8px）；关联 Radio / Checkbox 使用 `itemHeight="content"`，不保留 32px 对齐盒。
- 关联卡片填满当前 Form 控件区，不受 `form/control/max-width` 的常规字段上限约束；卡片内的 Form 布局继承外层 Form，外层左右则卡内左右，外层上下则卡内上下。
- 常规关联卡片使用大标题；灰底小标题仅用于明确的局部配置分组，不能作为默认卡片标题。
