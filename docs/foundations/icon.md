# Icon Foundation

> 主要来源：Figma `校准版//Sens.Design_图标 v2.1_20230328`、`src/ui/FieldIcons.tsx`、`src/ui/SearchIcon.tsx`、`docs/foundations/size.md`、`docs/foundations/color.md`。  
> 当前状态：草稿校准中；第一阶段只收录项目已有自定义 SVG，不重画图标，不替换现有组件。

## 1. 定位

Icon Foundation 负责统一图标资产、命名、尺寸关系、颜色语义和消费规则。

Icon registry 只记录图标资产本身，不绑定唯一默认尺寸和默认颜色。图标的 size 和 color 必须由具体使用场景决定。

```text
Icon asset
  -> Icon usage rule
  -> SensIcon render API
  -> Button / Input / Select / Search / Card / DataSourceCard
```

## 2. 不纳入范围

以下内容不属于 Icon Foundation：

- 空态插画。
- 业务 logo。
- 图片资产。
- demo 文案字符。
- emoji。
- 临时字符图标。

这些内容可以在业务组件、Illustration Foundation 或资产管理规则中单独记录，不进入 Icon registry。

## 3. 图标库结构

| 层级 | 作用 | 第一阶段落点 |
|---|---|---|
| Asset Layer | 记录图标资产本身 | `src/design-system/icons/registry.tsx`（后续） |
| Usage Layer | 定义尺寸、颜色、状态规则 | 本文档 |
| Render Layer | 统一渲染 `<SensIcon />` | `src/design-system/icons/Icon.tsx`（后续） |
| Token Mapping Layer | 映射 size / color token | `types.ts` / `Icon.tsx`（后续） |
| Preview Layer | HTML 可视化验收 | `/basic-styles/icon`（后续） |
| Migration Layer | 逐组件迁移计划 | 本文档先记录 |

第一阶段只做“入库 + 文档 + 样张”，不一次性替换现有组件。

## 4. 图标使用原则

- 图标资产只描述图形，不描述业务状态。
- 图标尺寸跟随文字层级或组件场景，不跟随图标名称。
- 图标颜色跟随语义状态，不在图标本体内写死。
- 优先使用 `currentColor`，让图标继承外层文本或组件状态色。
- 可点击图标必须有 hover / active / disabled 规则。
- 不可点击图标不应因为 hover 改色。
- 状态型图标不能随意当操作型图标复用。
- 图标不得用字符临时模拟，除非明确标注为 demo 文案。

## 5. 图标分类

| 分类 | 说明 | 当前示例 |
|---|---|---|
| 操作型图标 | 触发操作、打开菜单、清除、添加、关闭 | `more`、`editor-add`、`close`、`close-circle` |
| 状态型图标 | 表达警告、错误、选中 | `error-diamond`、`select-check` |
| 导航型图标 | 返回、展开、收起 | `chevron-left`、`chevron-down`、`chevron-up` |
| 输入辅助图标 | 输入框、搜索、选择器辅助 | `search`、`chevron-down`（Select 箭头）、`close-circle`（Select 清空） |
| 组件内部图标 | 只服务特定组件内部结构 | `stepper-up`、`stepper-down` |

## 6. 命名规范

- 使用 kebab-case。
- 优先使用语义名称，不按视觉形状随意命名。
- 方向型图标使用方向后缀：`chevron-down`、`chevron-up`、`chevron-left`。
- 组件专属图标可带组件语义：`select-check`、`stepper-up`、`stepper-down`。
- 场景别名不单独入库：同一 SVG 在不同组件里可有过渡 wrapper（如 `SelectClearIcon` → `close-circle`），usage 记在资产条目或组件文档，registry 只保留一份资产 name。
- 不使用 Figma 图层名里的临时描述作为最终 name。
- 图标创建为组件后，应补中文备注名称，方便设计和研发检索。

## 7. 图标与文字尺寸关系

| 文字字号 | 图标尺寸 | 使用场景 |
|---:|---:|---|
| 12px | 14px | 辅助文字、小提示、表单警告 |
| 14px | 16px | 常规控件、按钮、选择器、搜索、卡片操作 |
| 16px | 18px | 较大标题旁图标、强调型入口 |
| 20px | 22px | 页面级标题、标题栏大图标 |

特殊场景：

| 场景 | 当前尺寸 | 说明 |
|---|---:|---|
| InputNumber stepper | 10px | 组件内部特殊尺寸，不是 stepper 图标本体默认尺寸 |
| 表单警告 | 14px | 跟随 12px 辅助提示关系 |
| Select / Button / Search 常规图标 | 16px | 跟随 14px 常规控件文字 |
| 跟文字走的图标 | inherit / 1em | 允许继承外层文字尺寸和颜色 |

图标本体不绑定默认 size。`size/icon/s = 14`、`size/icon/m = 16` 等只在使用场景里被选择。

## 8. 颜色规则

| 语义 | 来源 |
|---|---|
| default | `tokenRgba("text-color-transparent", 0.9)` |
| subtle | `tokenRgba("text-sub-color-transparent", 0.58)` |
| disabled | `tokenRgba("text-color-transparent-disable", 0.3)` |
| link | `link-color` |
| functional | `component-active` |
| warning | `warning-color` |
| inverse | `white` |
| inherit | `currentColor` |

图标颜色不在 SVG path 内硬编码。需要透明度时通过 `tokenRgba()` 派生。

## 9. 可点击 / 不可点击图标规则

| 类型 | hover | active | disabled |
|---|---|---|---|
| 可点击图标 | 需要明确 hover 色 | 需要明确 active 色 | 需要禁用色 |
| 不可点击图标 | 不因 hover 变化 | 无 active | 只在所属组件禁用时变化 |
| 跟随文字图标 | 跟随文字状态 | 跟随文字状态 | 跟随文字状态 |

操作型图标若与文字一起出现，优先使用 `currentColor` 继承文字色，不单独维护另一套颜色链。

## 10. 操作型图标和状态型图标

| 类型 | 规则 |
|---|---|
| 操作型图标 | 跟随操作文本色；有 hover / active / disabled；不能只改图标不改文字 |
| 状态型图标 | 跟随状态语义色；不承载点击；不伪造 hover |
| 组件内部图标 | 由组件规则控制尺寸、颜色和状态，不作为通用操作入口 |

状态型图标不能随意当操作型图标复用，除非对应组件文档明确允许。

## 11. 已入库图标资产草稿

| 入库名 | 原组件名 | 来源文件 | viewBox | 当前使用场景 | 场景尺寸 | 场景颜色 | 是否可复用其他尺寸 |
|---|---|---|---|---|---|---|---|
| `error-diamond` | `ErrorDiamondIcon` | `src/ui/FieldIcons.tsx` | `0 0 16 16` | Input / TextArea / InputNumber 表单警告 | 14 / 16，按表单尺寸 | warning / currentColor | 是 |
| `icon-default` | `IconDefaultIcon` | `src/ui/FieldIcons.tsx` | `0 0 16 16` | Button showcase 示例图标 | 16 | inherit | 是 |
| `select-check` | `SelectCheckIcon` | `src/ui/FieldIcons.tsx` | `0 0 16 16` | Select Dropdown 已选中勾选 | 16 | currentColor | 是 |
| `stepper-up` | `StepperUpIcon` | `src/ui/FieldIcons.tsx` | `0 0 10 10` | InputNumber stepper 上箭头 | 10 | currentColor | 有限制，优先仅用于 stepper |
| `stepper-down` | `StepperDownIcon` | `src/ui/FieldIcons.tsx` | `0 0 10 10` | InputNumber stepper 下箭头 | 10 | currentColor | 有限制，优先仅用于 stepper |
| `chevron-left` | `ChevronLeftIcon` | `src/ui/FieldIcons.tsx` | `0 0 16 16` | Minimal Search 返回箭头 | 16 | currentColor | 是 |
| `chevron-down` | `ChevronDownIcon` | `src/ui/FieldIcons.tsx` | `0 0 16 16` | Select 触发框 / Dropdown / Button 下箭头 | 16 | subtle / currentColor | 是 |
| `chevron-up` | `ChevronUpIcon` | `src/ui/FieldIcons.tsx` | `0 0 16 16` | Select / Dropdown / Button 上箭头 | 16 | currentColor | 是 |
| `close` | `CloseIcon` | `src/ui/FieldIcons.tsx` | `0 0 16 16` | Tag / Message / Alert 关闭 | 12 / 14 / 16 | subtle / warning / currentColor | 是 |
| `close-circle` | `CloseCircleIcon` | `src/ui/FieldIcons.tsx` | `0 0 16 16` | Input / Select / Search allowClear 清空 | 16 | subtle / currentColor | 是 |
| `check` | `CheckIcon` | `src/ui/FieldIcons.tsx` | `0 0 16 16` | Card / Checkbox 已选中勾选 | 16 | inverse / inherit | 是 |
| `rename` | `RenameIcon` | `src/ui/FieldIcons.tsx` | `0 0 16 16` | Card 标题区重命名 | 16 | subtle / inherit | 是 |
| `warning-filled` | `WarningFilledIcon` | `src/ui/FieldIcons.tsx` | `0 0 16 16` | Card 框外警告信息 | 14 / 16 | warning | 是 |
| `editor-add` | `EditorAddIcon` | `src/ui/FieldIcons.tsx` | `0 0 16 16` | 新建 / 添加按钮 | 16 | inherit | 是 |
| `drag-vertical` | `DragVerticalIcon` | `src/ui/FieldIcons.tsx` | `0 0 16 16` | Card 标题区拖拽把手 | 16 | subtle / currentColor | 是 |
| `more` | `MoreIcon` | `src/ui/FieldIcons.tsx` | `0 0 16 16` | 更多按钮 | 16 | subtle / currentColor | 是 |
| `search` | `SearchIcon` | `src/ui/SearchIcon.tsx` | `0 0 16 16` | Search / Input 搜索前缀、搜索按钮 | 16 | subtle / currentColor | 是 |

第一批只收当前项目自定义 SVG，不碰 antd 图标。`SelectArrowIcon` / `SelectClearIcon` 为过渡 wrapper，分别指向 `chevron-down` / `close-circle`，不单独入库。`close`（Figma 805:58）已入库，替换原 Tag/Message/Alert 手写小叉子。

## 12. 外部 antd 图标

第一阶段不迁移，只记录：

| 图标 | 当前用途 | 决策 |
|---|---|---|
| `LoadingOutlined` | Button / Dropdown / FAB loading | 外部依赖，待决策 |
| `ReadOutlined` | 文档入口 | 外部依赖，待决策 |
| `ArrowLeftOutlined` | 返回 | 外部依赖，待决策 |
| `InfoCircleOutlined` | 提示 | 外部依赖，待决策 |

## 13. 临时字符图标

Card 临时字符图标迁移状态：

| 字符 | 当前语义 | 处理 |
|---|---|---|
| `•••` | more | ✅已替换为 `more` |
| `⌄` | down | ✅已替换为 `chevron-down` |
| `✓` | checkbox-check | ✅已替换为 `check` |
| `!` | warning | ✅已替换为 `warning-filled` |
| `::` | drag | ✅已替换为 `drag-vertical` |
| `✎` | edit / rename | ✅已替换为 `rename`（Figma 标题区用 rename） |

demo 标题里的 `▼` / `▲` 属于文案说明，暂不入库。

## 14. 图片插画边界

空态插画不进入 Icon Foundation：

- `load-failed-small.png`
- `no-data-small.png`
- `no-result-small.png`
- antd `Empty.PRESENTED_IMAGE_SIMPLE`

## 15. Figma 自查表映射

从 Figma metadata 读取到的自查项：

| 自查项 | 落地规则 |
|---|---|
| 颜色 | 检查图标色值和透明度是否正确；代码侧使用 token / helper |
| 图层 | 删除多余图层，保持良好命名 |
| 路径 | 导出前轮廓化描边并拼合路径 |
| 锚点 | 水平和垂直锚点尽量为整数，对齐像素 |
| 重心 | 放入图标库后检查视觉重心一致 |
| 比例 | 放入图标库后检查比例和体积感一致 |
| 语义 | 再次检查图标传达语义是否准确 |
| 命名 | 检查图标命名是否符合规范 |
| 中文描述 | 图标组件添加中文备注，方便检索 |

## 16. 自查表

- 是否来自 Icon registry？
- 是否仍在业务里手写 SVG？
- 是否仍在业务里用字符模拟图标？
- 图标尺寸是否由场景决定？
- 图标颜色是否来自 token / currentColor？
- 是否误用 spacing 作为 icon size？
- 可点击图标是否有 hover / active / disabled？
- 状态图标是否误用为操作图标？
- 插画 / logo 是否误入 Icon Foundation？

## 17. 后续替换计划

1. Card：替换 `•••` / `⌄` / `✓` / `!` / `::` / `✎`。
2. Button：替换 `MoreIcon`、`ChevronDownIcon`、`ChevronUpIcon`、`EditorAddIcon`。
3. Input / TextArea / InputNumber：替换 `ErrorDiamondIcon`、`StepperUpIcon`、`StepperDownIcon`。
4. Select / Dropdown：替换 `SelectCheckIcon`、`SelectClearIcon`、`ChevronDownIcon`、`ChevronUpIcon`。
5. Search：替换 `SearchIcon`、`ChevronLeftIcon`、clear icon。
6. antd 外部图标是否迁移单独决策。
