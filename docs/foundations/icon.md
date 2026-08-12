# Icon Foundation

> 图标资产、命名、尺寸关系、颜色语义与消费边界的规则源。
> 成熟度：Pilot
> 实现：Implemented · Figma 线性、面性与彩色功能图标已入库
> 验证：Pending · 宿主组件交互仍需逐项验收
> 来源：Figma `设计系统 v2.1（神策绿）`、`src/design-system/icons/registry.tsx`、`size.md`、`color.md`
> 预览：`/basic-styles/icon`

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
| Asset Layer | 记录图标资产本身 | `public/icons/`、`public/icons/filled/` + Figma manifests |
| Usage Layer | 定义尺寸、颜色、状态规则 | 本文档 |
| Render Layer | 统一渲染 `<SensIcon />` | `src/design-system/icons/Icon.tsx` |
| Token Mapping Layer | 映射 size / color token | `types.ts` / `Icon.tsx`（后续） |
| Preview Layer | HTML 可视化验收 | `/basic-styles/icon` |
| Migration Layer | 逐组件迁移计划 | 本文档先记录 |

当前阶段完成“入库 + 文档 + 样张”。业务宿主中的 antd 图标和历史图标按组件批次迁移，不在本轮批量改动。

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
| 导航型图标 | 返回、展开、收起、产品壳导航交互 | `chevron-left`、`chevron-down`、`chevron-up`、`side-nav-*` |
| 输入辅助图标 | 输入框、搜索、选择器辅助 | `search`、`chevron-down`（Select 箭头）、`close-circle`（Select 清空） |
| 组件内部图标 | 只服务特定组件内部结构 | `stepper-up`、`stepper-down` |

Figma 线性资产另外按设计稿分为：编辑、操作、对象、符号、方向、品牌标识、图表、功能、文件格式和业务用语。分类用于样张检索，不改变图标在宿主组件中的交互归属。

面性资产沿用相同的分类体系，当前来自 9 个 Figma 分组，共 74 个节点。线性与面性可以使用相同的语义名称，但通过 `SensIcon` 的 `variant` 明确选择，不在同一风格内静默覆盖。

## 6. 命名规范

- 使用 kebab-case。
- Figma 原始名称统一转换为 kebab-case；保留原始语义，不按视觉形状重新命名。
- 优先使用语义名称，不按视觉形状随意命名。
- 方向型图标使用方向后缀：`chevron-down`、`chevron-up`、`chevron-left`。
- 组件专属图标可带组件语义：`select-check`、`stepper-up`、`stepper-down`。
- 场景别名不单独入库：同一 SVG 在不同组件里可有过渡 wrapper（如 `SelectClearIcon` → `close-circle`），usage 记在资产条目或组件文档，registry 只保留一份资产 name。
- 不使用 Figma 图层名里的临时描述作为最终 name。
- 图标创建为组件后，应补中文备注名称，方便设计和研发检索。
- 同名资产不得静默覆盖；当前 `newchat` 的第二个节点登记为 `newchat-2`。
- 线性与面性允许共享语义名称；同一名称的不同风格通过 `variant="linear"` / `variant="filled"` 区分。

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
| 面性 InputNumber 上下箭头 | 12px | Figma 面性资产中的 `up-number-input` / `down-number-input` |
| 表单警告 | 14px | 跟随 12px 辅助提示关系 |
| Select / Button / Search 常规图标 | 16px | 跟随 14px 常规控件文字 |
| 跟文字走的图标 | inherit / 1em | 允许继承外层文字尺寸和颜色 |

图标本体不绑定默认 size。`size/icon/s = 14`、`size/icon/m = 16` 等只在使用场景里被选择。

`/basic-styles/icon` 样张提供 16px、20px、22px 三档切换。16px 是默认验收尺寸，20px 和 22px 用于检查放大后的视觉重量与清晰度，不代表所有组件都应改用大尺寸。

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

### 10.1 交互验收归属

Icon Foundation 只验收图标资产、尺寸、颜色语义和命名，不单独为所有图标建立点击状态矩阵。图标是否可点击、可拖拽，以及 `hover / active / disabled / focus` 的具体表现，由承载它的宿主组件验收：

- `more`、`chevron-down`、`rename`：由 Button、Dropdown、Select、Tabs 或 Card 等宿主验收。
- `drag-vertical`：由 Card、Tabs 等拖拽宿主验收。
- `checkbox-check`、`warning-filled`：作为状态型图标验收，不默认建立点击交互。
- 图标基础样张只展示 registry 资产，不把宿主交互误记为 Icon Foundation 的缺口。

## 11. 已入库图标资产

当前已从 Figma 10 组线性图标节点导入 340 个 SVG symbol，规范化后为 339 个唯一名称；另从 9 组面性图标节点导入 74 个 SVG symbol，并从 Figma「功能-彩色风格（106）」节点实际读取并导入 99 个彩色功能组件。另有 Product Shell 侧导专用双色导航功能图标（`side-nav-*` / `sbp-*` / `sa-*` / `sf-*` 等）单独归入样张「导航功能图标」Tab。线性、面性、彩色功能与导航功能分别维护样张归属；使用方统一通过 `SensIcon` 调用，不能直接依赖 antd 图标或字符图标。画板标题中的“106”与当前节点可读取的 99 个子组件不一致，本项目以实际可读取资产为准。

### 11.1 样张 Tab 录入标准（必守）

`/basic-styles/icon`「已入库图标」按 Tab 分开展示。入库时必须先判定样张归属；**侧导专用资产不得进入「线性图标」Tab**。

| 样张 Tab | 录入条件 | 场景尺寸 | 示例 |
|---|---|---|---|
| 线性图标 | 通用线性资产；可多尺寸对照；**排除** Product Shell 侧导专用图标 | 16 / 20 / 22 | `more`、`search`、`chevron-*`、顶导工具条 `nav-*` |
| 面性图标 | Figma 面性集合 | 16 / 20 / 22 | `analysis-event` 等面性业务图标 |
| 彩色功能图标 | Figma「功能-彩色风格」多色资产 | 固定 48px | 入口卡片业务彩标 |
| 导航功能图标 | Product Shell **侧导专用**：控制件 + 单层/二级/分析虚拟层/产品域业务图标；本体 `currentColor`（可 dualTone），由侧导注入状态色 | 固定 20px 场景 | `side-nav-*`、`sbp-*`、`sa-*`、`sf-*`、`sdh-*`、`scrm-*`、`sat-*` 等 |

规则：

- 样张归属 ≠ `SensIcon` 的 `variant` 名：侧导资产技术上多为 `variant="linear"`，但样张只进「导航功能图标」。
- 新增侧导图标：写入 registry + 挂到「导航功能图标」分组；线性 Tab 自动排除（按分组名或 usageScenes 以 `Product Shell Side Navigation` 开头）。
- 顶导交互/工具图标（如 `nav-help`、`nav-down`）进「线性图标」，不进「导航功能图标」。
- 分析落地页面性图标可同时在「面性图标」与「导航功能图标」出现（资产属面性，场景属侧导）；侧导线性/双色业务图标则只在「导航功能图标」。

### 11.2 图标风格

| 风格 | `SensIcon` 用法 | 规则 |
|---|---|---|
| 线性 | 默认，或 `variant="linear"` | 适合常规操作、导航和辅助图标；继续作为默认风格 |
| 面性 | `variant="filled"` | 作为独立图标集合展示和消费；适合需要更强识别度或状态强调的场景 |
| 彩色功能 | `variant="colorful"` | 来自 Figma「功能-彩色风格」；保留多色资产，主要用于入口型卡片和业务功能入口 |

图标预览页在「数值样张」内分为「线性图标」「面性图标」「彩色功能图标」和「导航功能图标」四个 Tab。线性与面性图标提供 16px / 20px / 22px 尺寸切换；彩色功能图标固定展示 48px；导航功能图标按侧导场景固定 20px。彩色功能图标保留 Figma 资产中的多色关系，不接受 `colorRole` 改色；宿主交互仍由入口卡片等组件负责。

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
| 彩色功能图标 | Figma 彩色功能组件 | `public/icons/colorful/` | `0 0 48 48` | SensEntryCard 彩色业务入口 | 48；大号入口使用 60px 布局位居中承载 | Figma 多色资产 | 否，按固定 48px 规则使用 |
| `search` | `SearchIcon` | `src/ui/SearchIcon.tsx` | `0 0 16 16` | Search / Input 搜索前缀、搜索按钮 | 16 | subtle / currentColor | 是 |
| `side-nav-down` | `SideNavDownIcon` | `src/ui/FieldIcons.tsx` | `0 0 14 14` | 产品壳侧导二级模块收起 | 14 | theme-side-icon / currentColor | 否 |
| `side-nav-up` | `SideNavUpIcon` | `src/ui/FieldIcons.tsx` | `0 0 14 14` | 产品壳侧导二级模块展开 | 14 | theme-side-icon / currentColor | 否 |
| `side-nav-link` | `SideNavLinkIcon` | `src/ui/FieldIcons.tsx` | `0 0 16 16` | 产品壳侧导更多推荐 | 16 | theme-side-subIcon / currentColor | 否 |
| `side-nav-expand` | `SideNavExpandIcon` | `src/ui/FieldIcons.tsx` | `0 0 18 18` | 产品壳侧导标题区紧凑态展开 | 20 | theme-side-icon / currentColor | 否 |
| `side-nav-collapse` | `SideNavCollapseIcon` | `src/ui/FieldIcons.tsx` | `0 0 18 18` | 产品壳侧导标题区锁定态收起 | 20 | theme-side-icon / currentColor | 否 |
| `side-nav-unpin` | `SideNavUnpinIcon` | `src/ui/FieldIcons.tsx` | `0 0 16 16` | 产品壳侧导标题区锁定入口 | 20 | theme-side-icon / currentColor | 否 |
| `side-nav-pin` | `SideNavPinIcon` | `src/ui/FieldIcons.tsx` | `0 0 12.2838 12.2838` | 产品壳侧导标题区锁定图标状态 | 20 | theme-side-icon-active / currentColor | 否 |
| `sbp-setting` | `SbpSettingSideNavIcon` | `src/ui/FieldIcons.tsx` | `0 0 20 20` | 产品壳单层带图标侧导 / 基本设置 | 20 | theme-side-icon / currentColor | 否 |
| `sbp-member` | `SbpMemberSideNavIcon` | `src/ui/FieldIcons.tsx` | `0 0 20 20` | 产品壳单层带图标侧导 / 成员管理 | 20 | theme-side-icon / currentColor | 否 |
| `sbp-role` | `SbpRoleSideNavIcon` | `src/ui/FieldIcons.tsx` | `0 0 20 20` | 产品壳单层带图标侧导 / 角色管理 | 20 | theme-side-icon / currentColor | 否 |

已有 Sens 图标的语义、场景和宿主规则继续保留；Figma 新资产在 registry 中统一使用 `currentColor`，具体尺寸和颜色仍由场景决定。`SelectArrowIcon` / `SelectClearIcon` 为过渡 wrapper，分别指向 `chevron-down` / `close-circle`，不单独入库。

## 12. 外部 antd 图标

目前仍存在的 antd 图标使用点只做迁移清单记录；后续不再新增：

| 图标 | 当前用途 | 决策 |
|---|---|---|
| `LoadingOutlined` | Button / Dropdown / FAB loading | 待替换为 Sens 图标 |
| `ReadOutlined` | 文档入口 | 待替换为 Sens 图标 |
| `ArrowLeftOutlined` | 返回 | 待替换为 Sens 图标 |
| `InfoCircleOutlined` | 提示 | 待替换为 Sens 图标 |

## 13. 字符图标迁移结果

当前项目样张和已收录的 Card 组合示例已使用 registry 图标，不再把以下字符作为真实图标实现：

| 原字符语义 | registry 图标 | 交互归属 |
|---|---|---|
| more | `more` | Button / Dropdown / Tabs 宿主 |
| down | `chevron-down` | Select / Dropdown / Button 宿主 |
| checkbox-check | `checkbox-check` | Checkbox / Card 状态 |
| warning | `warning-filled` | Card / 状态提示 |
| drag | `drag-vertical` | Card / Tabs 拖拽宿主 |
| edit / rename | `rename` | Card 标题区宿主 |

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

1. Button、Select、Dropdown、Tabs、Card 等宿主分别验收其消费的 registry 图标和交互状态。
2. Input / TextArea / InputNumber：继续验收 `ErrorDiamondIcon`、`StepperUpIcon`、`StepperDownIcon` 的场景尺寸和状态承载。
3. Search：继续验收 `SearchIcon`、`ChevronLeftIcon` 和 clear icon 的宿主交互。
4. 按宿主组件逐步替换剩余 antd 图标；新增代码不得继续引入 antd 图标。
