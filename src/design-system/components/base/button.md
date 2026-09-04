# 设计系统 skill · 基础组件：按钮 Button

> 基于 Sens 自有语义的基础按钮；颜色一律使用 token，不硬编码。<br>
> 成熟度：Stable<br>
> 实现：Implemented<br>
> 验证：Pending<br>
> 来源：Sens.Design 按钮规范 v2.1、Figma 变体矩阵。<br>
> 预览：`/components/button`

## 通则
- **重要前提**：按钮规则以 Sens 语义为准；对外只讨论一级、二级、三级、链接、警告、虚线、更多、下拉和 FAB。内部承载只能消费这些规则，不能反向定义按钮语义。
- **当前实现边界**：实现层可以复用第三方基础 button 能力（button 语义、disabled、loading、keyboard），但视觉状态、按钮类型、操作区排序和文案规则必须由 `SensButton` / `SensActionArea` 统一收口。
- 状态矩阵分两层：真实组件 `SensButton`（props+token，不伪造）；预览对照板（把每个变体×尺寸×每个状态画出来，悬停/点击等用 helper 从 token 取色做静态样张，只存在于预览板）。
- **尺寸只有两种**：大 `size/component-height/m`（默认 / 不传 `size`）、小 `size/component-height/s`（`size="small"`）。**不要引入第三种 large 尺寸**。
- 状态：默认 / 悬停 / 点击 / 禁用 / 禁用悬停 / 加载（`loading`）/ 加载悬停。
- **团队规则（区别于第三方默认，必须遵守）**：
  - **二级 / 三级 hover/点击：无背景填充**（含常规绿、警告红），只变边框/文字色。绿系 hover `component-hover`、点击 `component-active`；挽留警告 hover `warning-color-hover`、点击 `warning-color-active`；其他风险弱警告 hover `warning-color`、点击 `warning-color-active`。不要加任何浅绿底/浅红底。
  - **禁用 与 加载 视觉一致（同一套灰）**：这是团队规则；不要按第三方默认 loading 保留原色。loading 与 disabled 呈现同样的禁用灰 + 转圈。
  - 禁用悬停 = 禁用；加载悬停 = 加载（状态互斥，hover 不再叠加变化）。
- **变体矩阵还原**：按 type × size × state 矩阵并排渲染，保持稿里分组顺序，不要拍平、不要把图层名当文案。
- 图标：非必要不用；图标色与图标-文字间距遵循 `icons.md`。
- 文案以动词为主。组合排序按宿主位置执行：Header / Footer 默认右侧最重要，Body 默认左侧最重要，Floating 默认顶部最重要；常规操作区按钮总数 ≥5 时收进「更多」，表格操作列这类窄空间场景操作 ≥4 时收进「下拉 / 更多」。

## Figma 复盘收口（2026-07-29）

- **三级按钮无描边**：Figma `1359:5093`、`1359:5453` 显示三级按钮为透明底、透明边框，仅文字色进入功能色状态；不得因为默认描边习惯补描边。
- **添加 / 更多图标默认色**：虚线「+」和「更多 ···」默认图标使用 `中性色/图标/01_主要 @icon-color-transparent`，不是文字色；hover / active 再跟随功能色 `component-hover` / `component-active`。
- **虚线按钮默认描边**：使用 `中性色/线/01_深分割线 @divideline-color-transparent-dack`。`dack` 是当前 Figma / token 源里的既有 handle 拼写，项目中已存在该 token；不要新增一个 `dark` token 作为替代。
- **FAB 投影**：Figma `19361:79311`、`19361:79318`、`19361:79313`、`19361:79320`、`19361:79316`、`19361:79323` 的悬浮按钮全态使用 D4↓ 投影；普通按钮 active 的 2px 功能/警告外投影不叠加到 FAB。
- **Demo 与矩阵一致性**：顶部真实 demo 必须覆盖虚线添加、更多、三级和 FAB 样张；状态矩阵只作为静态对照板，不能维护另一套与 `SensButton` 冲突的视觉规则。
- **禁用 click wave**：Sens 不使用点击水波纹 / 扩散发光。点击反馈只允许来自本规范定义的文字色、描边色和投影 token。

## 实施前评估与完成验收

> 来源：Button 组件复盘。用于在新增按钮变体、操作区样张、FAB / 更多 / 下拉等组合能力前后做同一张卡验收。

- **组件语义**：按钮类型、优先级、风险等级、操作区排序必须来自 Sens，不来自第三方 `type` / `variant` / `danger` 等实现语义。
- **承载方式**：普通按钮可由第三方基础 button 承载；FAB Group、分段、强交互差异场景必须重新评估是否改为 Sens 自持交互壳。
- **状态边界**：不得出现 click wave；文字类 active 不得有外描边 / 外投影；实体按钮、描边按钮和虚线按钮 active 才允许 Sens 2px 外扩投影。
- **图标状态**：图标颜色必须跟随 Sens 状态 token，不通过第三方内部图标 class 魔改。
- **操作区**：不是 Button.Group / compact；按宿主位置验收排序、间距、更多收纳和主次关系。
- **风险按钮**：区分强警告和弱风险；弱风险默认中性，hover / active 才警告化。
- **FAB**：单项 FAB 和 FAB Group 分开验收；FAB Group 只允许整组投影，分段不独立投影。
- **真实 Demo**：上方真实 Demo 和状态矩阵必须同时通过，不能只改矩阵。
- **CSS 门禁**：不新增 `.ant-*`、`!important`、`var(--ant-*)`；如出现，必须暂停并重新评估承载方式。
- **文档一致**：`button.md`、真实实现、状态矩阵、操作区样张必须一致。

## 操作区 / Action Area 规则（P0）

> 来源：Figma `1906:21528` 操作区、`1906:21629`、`1906:21640`、`1906:21659`、`1906:21684` 按钮分类与使用原则。

- 操作区是集中放置一组相关操作的区域；一个页面可以有多个操作区，一个操作区可以有多个按钮。
- 操作区不是连体按钮组 / compact，不允许把按钮做成连体按钮。按钮彼此独立，间距由宿主布局或 spacing token 控制。
- 排序规则按宿主位置执行：Header / Footer 右侧最重要，Body 左侧最重要，Floating 顶部最重要；按钮优先级逻辑一致，但不要把「弱操作在左，主操作在右」当成所有布局的全局规则。
- 收纳型「更多」和普通二级、一级并列时，「更多」作为更弱的聚合操作放最左侧，后接普通二级操作，一级主操作仍在最右侧。
- 状态仍走 `SensButton`：不要 click wave；文字类 active 不加外描边；一级 / 二级 / 虚线 active 才有 Sens 的 2px 外扩投影。
- 操作区真实 demo 必须覆盖：页面标题右侧、对话框底部、实用尺寸大 / 小场景、表格操作列、更多聚合、虚线原位添加、警告场景、悬浮按钮 + Tips。

## 操作区布局 / Action Area Placement

> 来源：Figma `1906:23315`、`1906:23353`「操作区」的布局。

操作区在页面中的位置由宿主区域决定；按钮组件只定义按钮语义、排序和状态，宿主布局负责把操作区放进正确区域。

| 位置 | 布局规则 | 常见场景 | 示例操作 |
|---|---|---|---|
| 顶部 Header 右上角 | 操作区跟随页面 / 抽屉 / 对话框标题区，右对齐 | 全局性操作、页面级创建 / 编辑 / 保存 / 放弃 | 创建、编辑全局数据、保存、放弃 |
| 中部 Body 跟随内容左下角 | 操作区跟随相关内容，放在被操作内容的左下角 | 局部内容操作、步骤流程、当前内容块的添加 / 上一步 / 下一步 | 添加、上一步、下一步 |
| 底部 Footer 吸底右下角 | 操作区吸附在底部右下角，适合完成类全局操作 | 对话框、气泡卡片等局部浮层的完成 / 取消 | 保存、放弃 |
| 悬浮 Floating 页面右下角 | 操作区脱离正文流，固定在页面右下角 | 全局辅助类操作 | 回到顶部、帮助中心、页面视图缩放 / 还原 |

- Header / Footer / Body / Floating 是操作区的宿主位置，不改变按钮类型和状态边界；具体排列按下方「不同布局下的排序」执行。
- Header 和 Footer 通常承载页面级或浮层级操作；Body 通常承载与当前内容块强相关的局部操作；Floating 只承载全局辅助类操作。
- 表单、抽屉、对话框、Popover、Dropdown 等宿主只消费这些位置规则，不在各自文档里重新定义按钮排序和状态。
- Layout Foundation 只负责提供这些区域或插槽，不定义按钮的一级 / 二级 / 三级、更多收纳和状态矩阵。

## 按钮搭配规则 / Combination Rules

> 来源：Figma `1906:23498`、`1906:23569`、`1906:23645`、`1906:23685`、`1906:23748`。

按钮组合需要同时满足三类规则：搭配规则、排序规则和宿主布局规则。

### 使用个数限制

| 类型 | 个数限制 |
|---|---|
| 一级按钮 | 1 个操作区内最多 1 个；≥2 个同级主操作时，应使用同级「更多按钮」收纳 |
| 二级按钮 | 同一按钮区中不限制；按钮区按钮总数 ≥5 时，建议使用同级「更多按钮」 |
| 三级按钮 | 同一按钮区中不限制；不可单独使用，需和一级或二级按钮搭配；按钮区按钮总数 ≥5 时，建议使用同级「更多按钮」 |
| 更多按钮 | 同一按钮区中，同级最多 1 个 |
| 链接按钮 | 同一按钮区中不限制；表格操作列等窄空间操作总数 ≥4 时，建议使用「下拉按钮」 |
| 下拉按钮 | 同一按钮区中最多 1 个 |
| 虚线按钮 | 同一按钮区中不限制 |
| 警告按钮 | 跟随二级、三级、链接按钮规则 |
| 悬浮按钮 | 同一按钮区中不限制；≥2 个且关联度高时，建议使用组合型悬浮按钮 |

### 使用场景搭配

- 更多按钮：用于悬停选择因空间有限而收起的操作。
- 链接按钮：用于需要大量使用按钮的场景，例如表格操作列。
- 下拉按钮：用于点击选择因空间有限而收起的操作，例如表格中操作 ≥4 项时收进「更多」。
- 虚线按钮：用于引导用户在虚线框区域中添加内容。
- 警告按钮：用于强调当前操作存在风险的场景，例如删除。
- 悬浮按钮：用于按钮悬浮于页面之上的场景，例如回到顶部。

### 图标搭配

- 非必要不使用图标；含图标按钮必须有可解释的用户价值和产品价值。
- 同一组按钮的有无图标应保持一致，不要一部分带图标、一部分不带。
- 图标和文字同时存在时，图标只起辅助和修饰作用，不能替代文字。
- 例如「+ 标签」不合适；「+ 添加标签」才是完整语义。

### 排序规则

- 引导性设计：不同优先级的操作，应使用对应强调程度的按钮类型；同等优先级操作，根据使用频率或推荐性递增 / 递减排序。
- 方向性设计：对于明确有方向性的操作，排序应匹配方向性，例如「上一步 → 下一步」、「撤销 → 重做」。
- 对抗性设计：明确负面操作需要放在“拧巴”的位置，降低误触；负面操作不应作为一级按钮，优先使用二级 / 三级 / 链接警告按钮，并配合二次确认。

### 不同布局下的排序

| 宿主位置 | 排序规则 |
|---|---|
| Header 顶部右上角 | 右侧最重要，向左优先级依次递减；当操作数量很多时，最左侧可作为次重要 |
| Body 中部左下角 | 左侧最重要，向右优先级依次递减；如果是方向性按钮，优先服从方向性设计 |
| Footer 底部右下角 | 右侧最重要，向左优先级依次递减 |
| Floating 悬浮右下角 | 顶部最重要，向下优先级依次递减；当操作 ≥4 项时，最底部可作为次重要 |

## 按钮文案规则 / Copy Rules

> 来源：Figma `1906:23893`、`1906:23937`。跨组件书写规范（句号、空格、人称、全角标点）见 `docs/agent-rules/copywriting.md`。两字空格、特殊按钮不加空格、计数半角括号以本节为准。

### 简洁

- 中文按钮文案建议不超过 6 个字。
- 按钮文案不允许省略，不允许折行。
- 当按钮含义因精简而不清晰时，搭配 Tips 解释具体含义，不把长句塞进按钮内部。
- 例如「复制规则并创建用户标签」不适合作为按钮文案；可收敛为「复制」，并用 Tips 补充完整含义。

### 准确

- 优先使用动词，不只使用名词。
- 当业务对象较短时，可以带出关键对象。
- 避免使用「确定」「取消」这类含糊表达，应按动作后果写清楚。
- 删除确认场景中，推荐「确定删除」与「暂不删除」，而不是「确定」与「取消」。

### 空格

- 只有两个中文字的常规按钮，包括一级按钮、二级按钮、三级按钮，中文字中间应加 1 个空格。
- 特殊按钮不按此规则强行加空格，例如链接按钮、虚线添加按钮、更多按钮、下拉按钮、纯图标按钮、悬浮按钮。
- 例如常规按钮可写为「提 交」「取 消」「复 制」；虚线按钮仍写「添加」，不要写成「添 加」。

### 计数

- 用于下拉菜单操作栏等场景的计数按钮，计数括号使用英文半角括号 `()`。
- 计数与前方文字之间使用 1 个空格。
- 例如写作「完成 (2)」，不写作「完成（2）」。

## 实用尺寸 / Practical Size 规则

> 来源：Figma `1906:21755`、`1906:21848` 按钮尺寸场景。

- 常规实体、描边、三级、虚线、更多按钮只提供大、小 2 种实用尺寸：大尺寸高度 32px（`size/component-height/m`，默认不传 `size`），小尺寸高度 24px（`size/component-height/s`，`size="small"`）。
- **链接按钮不复用控件高度**：大号为 `font-size/m + line-height/m`，即 **14 / 22，按钮高度 22px**；小号为 `font-size/s + line-height/s`，即 **12 / 18，按钮高度 18px**。高度必须与文字行高相等，不能保留 antd 的 32 / 24px 点击框。
- 大尺寸用于空间充裕、主流程明确的场景，如页面标题右侧、页面内容区、抽屉和对话框。
- 小尺寸用于空间有限、按钮作为局部操作附着在宿主内容里的场景，如气泡卡片 / Popover、下拉菜单 / Dropdown 底部操作区。
- 小尺寸不是弱化语义；按钮优先级仍由一级 / 二级 / 三级 / 链接 / 更多决定。
- 同一个操作区原则上不混用大小，除非宿主组件文档明确规定。
- 禁止使用第三种 `large` 尺寸；如未来 Figma 出现更大尺寸，需先确认是否是按钮尺寸，还是页面 / FAB / 营销场景的专属例外。

## 按钮使用原则

- **一级按钮**：操作区中最核心、需要强调并引导用户点击的操作。原则上一个操作区最多 1 个；必须贴近主流程 / 主功能；一个页面 / 模态 / 操作区可以没有一级按钮，不要为了完整性强行添加；纯文字，不与图标搭配。
- **二级按钮**：强调程度低于一级按钮。一个操作区允许多个二级按钮；纯文字，不与图标搭配。
- **三级按钮**：强调程度低于一级 / 二级按钮。原则上不可单独使用，必须搭配一级 / 二级按钮，因为可点击感弱；一个操作区允许多个；纯文字，不与图标搭配。
- **常规操作区收纳**：一个操作区内常规按钮总数 ≥5 时，建议将同级按钮合并为「更多按钮」。
- **表格操作列收纳**：空间有限的操作列中，操作 ≥4 项时可收进「下拉按钮 / 更多」。
- **更多按钮**：聚合同类数量过多的常规按钮；被聚合操作应满足数量 ≥2、同级、关联度高；更多按钮本身不承载具体操作，悬停后展示菜单；样式可以对应一级 / 二级 / 三级。
- **链接按钮**：用于一个操作区内需要大量操作的场景，如表格操作列。推荐纯文本；特殊情况下可图标 + 文字或纯图标；纯图标必须搭配 Tips 解释含义。弱化链接默认使用 `text-color-transparent`，大号为 14 / 22 / 400、小号为 12 / 18 / 400；高度分别为 22 / 18，hover 才变链接蓝。
- **下拉按钮**：用于一个操作区内因空间有限而收起操作；点击触发菜单；样式类似常规链接按钮。
- **虚线按钮**：用于引导用户在虚线框区域中「原位」添加内容；图标必选，默认在文字左侧；位置引导性是必要条件。
- **悬浮按钮**：悬浮于页面之上的操作，如回到顶部；必须搭配 Tips 解释含义；当 ≥2 个操作且相关度高时，建议使用组合悬浮按钮。
- **警告按钮**：用于强调当前操作存在风险的场景（如删除 / 移除）。警告按钮不是简单等同默认红色危险态，必须按场景区分：
  - 「挽留」场景：默认态即为警告红。
  - 「其他风险」场景：默认保持原按钮色，hover 才变警告红。

## 常规按钮（按重要程度，绿）
| 类型 | 默认 | 悬停 | 点击 | 禁用 |
|---|---|---|---|---|
| 一级（实心） | 底 `component-primary` / 字 `white` | 底 `component-hover` | 底 `component-active` + 功能激活环 | 底 `component-disable` / 字 `white` |
| 二级（中性描边） | 边 `outline-color-transparent` / 字 `text-color-transparent` / 底 `white` | **边+字变 `component-hover`，底不变（无填充）** | **边+字变 `component-active`，底不变 + 功能激活环** | 边+字 `component-disable` |
| 三级（中性文字无边框） | 字 `text-color-transparent` / 透明底 | **字变 `component-hover`，无底、无外描边** | **字变 `component-active`，无底、无外描边** | 字 `text-color-disable` |

## 链接按钮（蓝）
| 类型 | 默认 | 悬停 | 点击 | 禁用 |
|---|---|---|---|---|
| 常规（纯文字 / 图标+文字 / 纯图标） | 字 `link-color` / 透明底 | 字 `link-hover-color` / **无底** | 字 `link-active-color` / **无底** | 字 `text-color-disable` |
| 弱化 | 字 `text-color-transparent`、图标 `icon-color-transparent` / 透明底 | 字+图标 `link-color` / **无底** | 字+图标 `link-active-color` / **无底** | 字 `text-color-disable`、图标 `icon-color-transparent-disable` |
| 风险强调（其他风险） | 字 `link-color` / 透明底 | 字 `warning-color` / **无底** | 字 `warning-color-active` / **无底** | 字 `text-color-disable` |

- **走状态色通道**：链接按钮只走链接色通道，禁止走功能主色通道。
- 三形态：纯图标 / 图标+文字 / 纯文字；**图标在文字左侧**（`icons.md`）。
- 链接按钮不带水平内边距；与相邻元素的距离由父级布局 gap 或图文间距 token 控制，不能吃内部默认 `padding-inline`。
- 链接按钮「图标 + 文字」时，图标与文字**视觉中线对齐**（`.ant-btn-icon` 用 inline-flex 居中，避免 16 图标在 22 行高盒内顶对齐偏上）。
- 预览示例图标用 Figma `icon-default`（`1471:5057`）；**不要用** `ChevronDown` / `ChevronUp`（下拉 / 选择器专用）。

## 警告按钮（红，作用在二级 / 三级 / 链接上）
| 类型 | 默认 | 悬停 | 点击 | 禁用 |
|---|---|---|---|---|
| 二级（红描边） | 边+字 `warning-color` / 底 `white` | **边+字变 `warning-color-hover`，底不变（无填充）** | **边+字变 `warning-color-active`，底不变 + 警告激活环** | 边+字 禁用灰 |
| 二级弱警告（其他风险） | 边 `outline-color-transparent` / 字 `text-color-transparent` / 底 `white` | **边+字变 `warning-color`，底不变（无填充）** | **边+字变 `warning-color-active`，底不变 + 警告激活环** | 边+字 禁用灰 |
| 三级（红文字） | 字 `warning-color` / 透明底 | **字变 `warning-color-hover`，无底、无外描边** | **字变 `warning-color-active`，无底、无外描边** | 字 禁用灰 |
| 三级弱警告（其他风险） | 字 `text-color-transparent` / 透明底 | **字变 `warning-color`，无底、无外描边** | **字变 `warning-color-active`，无底、无外描边** | 字 禁用灰 |
| 链接（红字） | 字 `warning-color` / 透明底 | 字 `warning-color-hover` / **无底、无外描边** | 字 `warning-color-active` / **无底、无外描边** | 字 `text-color-disable` |
| 链接强调弱警告（其他风险） | 字 `link-color` / 透明底 | 字 `warning-color` / **无底、无外描边** | 字 `warning-color-active` / **无底、无外描边** | 字 `text-color-disable` |
| 链接弱化 | 字 `text-color-transparent` / 图标 `icon-color-transparent` | 字+图标 `warning-color` / **无底、无外描边** | 字+图标 `warning-color-active` / **无底、无外描边** | 字 `text-color-disable` |

- 「挽留」或默认态即红的场景可以直接使用警告语义；「其他风险」场景不能默认变红。
- 可带「二次确认」：点击先 `Popconfirm` 再执行，常用于删除。
- 「其他风险」必须使用弱警告语义，让风险只在 hover / active 暴露。

## 虚线按钮
| 类型 | 默认 | 悬停 | 点击 | 禁用 |
|---|---|---|---|---|
| 虚线「+」 | 边 `divideline-color-transparent-dack` / 字 `text-color-transparent` / 底 `white` | 边+字保持中性默认 / 底 `component-active-hover-background` | 边+字保持中性默认 / 底 `component-active-click-background` + 功能激活环 | 边+字 禁用灰 |

- 用于虚线框区域「添加内容」；图标 `EditorAdd`。

## 无障碍与键盘

- 纯图标按钮、FAB 段必须提供 `aria-label`（FAB 组合项使用 `ariaLabel`）。
- 真实按钮加载时同时设置 `disabled` 与 `aria-busy="true"`；加载视觉与禁用视觉一致。
- 下拉菜单可用项使用 `role="menuitem"`、可 Tab 聚焦，并支持 Enter/Space 触发；禁用或加载项不可交互。

## 更多按钮（"按钮 ···"）
| 类型 | 默认 | 悬停 | 点击 | 禁用 |
|---|---|---|---|---|
| 主按钮 + `···` | **与同级别主按钮一致** | **与同级别主按钮一致** | **与同级别主按钮一致** | **与同级别主按钮一致** |

| 元素 | 默认 | 悬停 | 禁用 |
|---|---|---|---|
| 下拉菜单面板 | 底 `white` | — | — |
| 菜单项 | 字默认 / 底 `white` | 底 `background-transparent-grey-hover` @6% | 字灰 / 底 `white`；悬停底 `background-transparent-grey-hover` @6% |

- 常规操作区按钮总数 ≥5 时收纳进「更多」；表格操作列这类窄空间场景操作 ≥4 时收进「下拉 / 更多」。

## 下拉按钮（"更多 ▼"）
| 类型 | 默认 | 悬停 | 点击 | 禁用 |
|---|---|---|---|---|
| 链接 + `▼` | 字 `link-color` + `▼` / 透明底 | 字 `link-hover-color` / **无底** | 字 `link-active-color` / **无底** | 字 `text-color-disable` |

| 类型 | 激活（展开） | 激活悬停 | 激活点击 | 禁用 |
|---|---|---|---|---|
| 链接 + `▲` | 字 `link-color` + `▲` | 字 `link-hover-color` | 字 `link-active-color` | 字 `text-color-disable` |

- `▼` / `▲` 固定**文字右侧**（`iconPosition="end"`）；`ChevronDown` / `ChevronUp` **仅**用于本下拉与选择器。

## FAB（悬浮操作按钮）

| 类型 | 默认 | 悬停 | 点击 | 禁用 |
|---|---|---|---|---|
| 单项（一级 / 二级） | 一级绿底白字；二级白底黑字无描边 | 同上规范 | 同上规范 | 禁用灰 |
| 横向组合（2~3 段） | 整组 D4↓；配色与单项同源 | 同上 | 同上 | 同上 |
| 竖向组合（2~3 段，纯图标） | 整组 D4↓；白底 + `icon-color-transparent` 图标 | hover `component-primary` / active `component-active` | 同上 | — |

- 单项：`fab={true}` 与 `tone="primary"|"secondary"` 组合；纯图标时 `shape="circle"`；交叉轴 `size/component-height/l`；横向 padding `spacing/horizontal/5x`。
- 组合：不走 `fab={true}` 嵌套，走 `SensFabGroup` 容器 + 分段；整组一层 D4，子段无 per-button 投影。
- FAB **全状态恒有 D4↓ 投影**（含禁用/加载，颜色仍走 `mask-01-transparent` 派生）。

## 条件投影（variant × state）

投影分两类：hover / FAB 使用中性色 D3/D4；active 使用功能色或警告色激活环。全部从 token/helper 读取，禁止业务代码写死 rgba。

| variant | default | hover | active | disabled / loading / *Hover |
|---|---|---|---|---|
| 一级 `primary` | 无 | **D3↓** | **功能激活环** | 无 |
| 二级 `secondary` | 无 | **D3↓** | **功能激活环** | 无 |
| 警告二级 / 警告二级弱警告 | 无 | **D3↓** | **警告激活环** | 无 |
| 虚线 | 无 | 无 | **功能激活环** | 无 |
| 三级 / 链接 / 下拉 | 无 | 无 | 无（仅文字变色） | 无 |
| FAB `fab={true}` / `SensFabGroup` | **D4↓** | **D4↓** | **D4↓** | **D4↓**（含禁用/加载） |

> 一级/二级/警告二级：`disabled` / `loading` / `*Hover` **强制无投影**（不得残留 hover 影）。FAB 不受此限，禁用/加载仍保留 D4。

| 投影档 | 公式 | 用途 |
|---|---|---|
| D3↓ | `0 2px 6px @10%` + `0 4px 12px @4%` | 一级/二级（含警告二级）仅 hover |
| D4↓ | `0 2px 12px @10%` + `0 4px 20px @8%` | FAB 全状态 |
| 功能激活环 | `0 0 0 2px rgba(0,178,128,0.20)` | 一级、二级、虚线 active |
| 警告激活环 | `0 0 0 2px rgba(229,69,69,0.20)` | 警告二级 active |

实现：hover / FAB 读取 `components.Button.shadowHover/shadowFloating`；active 读取 `buildActiveRingShadow`；真实组件与预览板共用同一状态规则，**不在 Demo/CSS 写阴影**。FAB 保留自身 D4 全状态规则。

## 内部承载映射（当前实现备注，非规则源）

> 本表只说明当前实现如何把 Sens token 注入运行时，不定义按钮语义；设计规则以上文 Sens 类型与状态表为准。

| 视觉语义 | Figma handle | 当前内部映射 / 备注 |
|---|---|---|
| 主色 / 一级默认 | `component-primary` | `colorPrimary` |
| hover 绿 | `component-hover` | `colorPrimaryHover`、Button `defaultHoverColor` |
| 点击绿 | `component-active` | `colorPrimaryActive`、Button `defaultActiveColor` |
| 禁用绿 | `component-disable` | primary disabled |
| 警告红 | `warning-color` / `warning-color-hover` / `warning-color-active` | `colorError` / `colorErrorHover` / `colorErrorActive` |
| 链接蓝 | `link-color` / `link-hover-color` / `link-active-color` | `colorLink` / `colorLinkHover` / `colorLinkActive` |
| 禁用文字 | `text-color-disable` | `colorTextDisabled` |
| 辅助文字 | `text-sub-color` | `colorTextSecondary` |
| 二级描边 hover/点击（无底） | `component-hover` / `component-active` | Button `defaultHoverBorderColor` / `defaultActiveBorderColor` |
| 三级文字默认 / hover / 点击（无底） | `text-color-transparent` / `component-hover` / `component-active` | Button `defaultColor` / `defaultHoverColor` / `defaultActiveColor`；透明底（**仅 `components.Button` 级覆盖**，不动根 token） |
| 警告三级文字 hover/点击（无底） | `warning-color-hover` / `warning-color-active` | Button `colorErrorBg` / `colorErrorBgActive` → `transparent`（**仅 `components.Button` 级覆盖**） |
| 虚线浅绿底 | `component-active-hover-background` / `component-active-click-background` | 仅虚线按钮 |
| 菜单项行底（中性灰） | `background-transparent-grey-hover` @6% / `background-01-transparent` @8% | 下拉菜单项（对齐 Select 未选中行） |
| 尺寸大/小 | `size/component-height/m`、`size/component-height/s` | `controlHeight`、`controlHeightSM`（`size="small"`） |
| 圆角 | `radius/m` | `borderRadius` |
| FAB 圆角 | `radius/circular` | `fab={true}` 或 `SensFabGroup` 外端 |
| 一级/二级 hover 投影 | `mask-01-transparent` → D3 | `components.Button.shadowHover` |
| 普通按钮 active 激活环 | `component-active-shadow` → `0 0 0 2px @20%` | `buildActiveRingShadow("component-active-shadow")` |
| 警告按钮 active 激活环 | `warning-color-active-shadow` → `0 0 0 2px @20%` | `buildActiveRingShadow("warning-color-active-shadow")` |
| FAB 全态投影 | `mask-01-transparent` → D4 | `components.Button.shadowFloating` |
| 第三方默认投影 | — | `primaryShadow` / `defaultShadow` / `dangerShadow` → `none` |
