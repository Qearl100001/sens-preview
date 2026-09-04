# 锚点 Anchor

> 用于页面内分组导航和当前位置提示。<br>
> 成熟度：Pilot<br>
> 实现：Implemented<br>
> 预览：`/components/anchor`

## 组件边界

- 锚点只承载页面内导航结构、层级、当前项和展开 / 收起状态，不负责路由、滚动容器或业务数据。
- 纵向锚点用于长页面或分组内容；需要跨页面导航时交由路由和页面壳承载。
- 长表单中与灰标题的顶对齐、左右 16、主列让位、叠层 vs 占位由复合表单 `form.md`「带锚点表单」收口，不在本组件重复定义。
- 正式图标使用 Sens icon registry 的 `expand-and-collapse-arrow-left`、`expand-and-collapse-arrow-right` 和 `feedback-warning`，不在业务页面重画图标。

## 视觉规则

- 单项高度 36px，文字使用 14px / 22px。
- 层级每级增加 16px 左内缩；项之间间距 4px。
- 默认文字使用辅助文字色；hover 使用浅背景。
- 选中项使用当前功能主色、Medium 字重，并在左侧显示 2px、14px 高标记。portal 到 `document.body` 时组件根必须写入当前 Functional Skin 主色，不能靠继承 `--sens-skin-primary`（会回落神策绿）。
- 列表左侧使用 2px 纵向分割线。
- 展开面板为白底圆角卡片，顶部 16px、底部 24px，使用 D4 投影；悬浮卡片展开态仅左侧圆角 6px（贴白板右缘时右侧直角），选中竖线贴卡片左缘（Figma `16305:56584`）。
- 锚点支持三种纵向模式：`fixed` 常驻、`push` 展开后向左挤压、`popover` 展开为悬浮卡片；固定模式不使用背景、边框或投影。
- `push` / `popover` 模式的收起态使用 24px 宽的左侧收起按钮；展开态使用右向展开图标。
- `mode="popover"` 是锚点自身的「悬浮卡片」模式命名（历史遗留），**不是**气泡卡片 `SensPopover`。
- 展开触发默认 `expandTrigger="click"`；可选 `hover`（进入展开、离开收起）。复合表单「点击悬浮」场景使用 click：展开后常驻，再点收起。
- 无对应组件时使用提醒背景和 `feedback-warning` 图标。

## API

| 属性 | 说明 |
| --- | --- |
| `items` | 锚点项，支持 `key`、`label`、`level`、`disabled` |
| `activeKey` / `defaultActiveKey` | 当前项，受控 / 非受控 |
| `expanded` / `defaultExpanded` | 展开状态，受控 / 非受控 |
| `mode` | `fixed` 常驻、`push` 向左挤压或 `popover` 悬浮卡片；默认为 `push` |
| `expandTrigger` | `click`（默认）或 `hover`；`hover` 用于悬浮卡片：进入展开、离开收起 |
| `fixed` | `mode="fixed"` 的兼容写法，固定展开 |
| `onChange` | 选中项变化回调 |
| `onExpandedChange` | 展开状态变化回调 |
| `missing` | 无对应组件提醒态 |

## 验收

- [ ] 层级缩进、36px 项高、4px 项间距和左侧分割线正确。
- [ ] 默认、hover、选中、禁用和无对应组件状态可查看。
- [ ] 选中项左侧标记与文字使用当前功能色。
- [ ] 展开 / 收起按钮可操作，图标方向正确。
- [ ] 常驻、向左挤压、悬浮卡片三种模式与 Figma 结构一致。
- [ ] 长表单组合定位（贴边 / 16 / 顶齐 / 占位 vs 叠层）在 `/composite/form`「带锚点表单」按清单 5.3.3 验收，不在本页用静态矩阵替代。
- [ ] 锚点不截断页面内容，不越出容器边界。
- [ ] 换肤后选中标记、文字和 hover 状态跟随功能色。
- [ ] 使用正式 Sens 图标，不新增自绘 SVG。
