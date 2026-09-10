# 设计系统 skill · 复合组件：复合表格

> 可复用的表格组合模式，不将筛选、录入、树表和嵌套 / 交叉表格塞进基础表格。<br>
> 成熟度：Pilot<br>
> 实现：Partial<br>
> 验证：Verified<br>
> 来源：Table、Pagination、Search、`SensTableFilterBar` 与复合表格 Figma 规则。<br>
> 预览：`/composite/table`

## 当前收录

预览与复合表单相同：顶部切换分类，一次只看一块。树表格、嵌套表格仍待收录，不进切换器；交叉表格已独立收录。

| 复合表格 | 适用场景 | 关键规则 | 依赖 |
| --- | --- | --- | --- |
| 筛选场景 | 筛选项展开 / 收起、重置、个数型多选接表体、分页条数切行数；三行半展开锁 112 | 左侧搜索固定 200px；选择器固定 148px；标题与控件间距 8px、项 / 行距 16px；展开最多再露 2.5 行；筛选项走个数型多选，勾选后点「完成」才过滤。左侧搜索框在，但不接表体过滤 | `SensTableFilterBar`、Table、Pagination |
| 搜索场景 | 筛选表格里用搜索命中表体 | 实时：输入法出字即加载。静态：点按钮 / 回车才加载。命中范围 = 允许搜的列；拼音可命中中文，只高亮字面子串 | Search 实时 / 触发、`SearchHighlight`、`matchSelectOption`、Table 加载 / 空态 |
| 页面组合 | 筛选栏上方叠提示条或基础标签页 | Alert / 标签页到筛选栏 16px；切 tab 不改表数据；不搬产品壳 | `SensAlert`、`SensLineTabs`、筛选场景同一套表 |
| 录入型表格 | 行内编辑多列表格 | 单元格高 56、组件格 padding 8×12；完整业务页进样板间 | Input、Select、Button |
| 交叉表格 | 表头分类汇总（表头分组）+ 合并单元格 | 原生 `<table>` + `rowSpan` / `colSpan`；合并区完整逻辑单元格；悬停：组悬停整组 + 明细加重。表头上下居中、单行 56；表体顶对齐上/左 12；数字列锚点=标题「指标」右缘。不接筛选 / 分页 / 复选 / 操作 | 局部 `.cross-table-*` |

## 组件边界

| 层级 | 负责内容 | 不负责内容 |
| --- | --- | --- |
| 基础表格 | 表格信息区、表头、表体、选择、排序、空态、加载、横向滚动 | 筛选区、分页器、录入校验、树层级、具体业务字段 |
| 复合表格 | 筛选区 + 表格 + 分页器 + 批量操作 + 列设置等稳定组合 | 具体业务对象、页面壳、真实跳转；不单独演示页面滚动吸顶 |
| 业务样板间 | SDH 录入型表格、SDH 树表格等真实业务场景 | 重新定义基础组件状态 |

长表格页面如需要随页面内容滚动吸顶，只组合基础 `TableShell stickyHeader="page"`；复合表格不额外包一层纵向滚动容器，也不重复搭建产品壳。完整的「顶导收起 → 标题栏滚走 → 表头吸顶 → 表格底部离场」验证只放产品壳样板间；标题栏与表头不得同时吸顶。

## 待收录结构

| 复合表格 | 状态 | 前置条件 |
| --- | --- | --- |
| 筛选表格 | ✅ Demo 已接个数型多选过滤、`foundTotal`、分页条数切表体；列设置面板 / 复杂排序 / 真实刷新仍待 | 列设置、复杂排序 |
| 搜索场景 | ✅ 实时 / 静态 Demo 已接表体过滤、加载、高亮、「已找到 n 条」 | 表格加载 GIF 仍 Missing；筛选控件与搜索的联合过滤待补 |
| 录入型表格 | ✅ 行内编辑与新增 / 删除样张已浏览器验收（单元格 56 / padding 12×8） | 字段校验与滚动规则待补 |
| 交叉表格 | ✅ 原生合并 + 共享关系悬停（Figma `8171:33248`）；分组 / 明细 ID 驱动，已覆盖异规模重排验证 | 排序后悬停缺少设计依据，暂不实现 |
| 树表格 | 待收录 | Figma `724:29088`；依赖树节点展开、缩进、父子关系与选择规则 |
| 树表格局部加载 | 待收录 | Figma `2649:75062`；作为树表格子能力，需定义节点级加载、失败刷新与局部更新边界 |
| 嵌套表格 | 待收录 | Figma `724:29087`；需定义父表 / 子表展开关系、缩进、边框与信息继承 |

## 筛选区（`SensTableFilterBar`）

> Figma：`Sens.Design_复合表格-v2.1_20221118` · 筛选区域 `761:73313` 等。  
> 工程：`src/ui/SensTableFilterBar.tsx` + `table-filter.css`；预览 `/composite/table`。

### 结构

1. **筛选流**：可选搜索（默认 200px；`searchMode="realtime"` 用 `SearchInput`，`searchMode="trigger"` 用 `SearchTriggerInput`）+ 主筛选项 + 更多筛选项（展开态）+「重置」+「展开 / 收起」按钮。
2. **重置**：当任一筛选项有选中信息时出现，位置固定在「展开 / 收起」左侧；不受展开或收起状态影响。
3. **展开 / 收起**：有 `moreFields` 且筛选项存在折叠需求时出现；「重置」和「展开 / 收起」固定在首行筛选右侧，不独占一行。
4. **换行规则**：默认只展示首行（搜索 + `primaryFields` + 重置 / 展开）。第二行起只放 `moreFields`，必须点「展开」才出现；展开区最多再露 2.5 行（max-height 112）并滚动。不能把操作组拆成独立操作行。
5. **单项**：左标题右控件；标题↔框 `spacing/horizontal/2x`（8）；项间距 / 行距 `spacing/horizontal/4x` · `spacing/vertical/4x`（16）。

复合表格不定义整页最小画布。产品电脑端 `1280px` 最小宽度属于 Layout / Product Shell 规则；小于 `1280px` 采用横向滚动，不让筛选区自行进入移动端压缩或换一套小屏结构。

### 表格筛选定宽（仅本上下文）

| 场景 | 宽 | 常量 / 组件接口 |
| --- | --- | --- |
| 表格筛选 Select | 148 | `TABLE_FILTER_TRIGGER_WIDTH` + `SensSelectDropdown widthPreset="148"` |

表格筛选使用固定宽选择器，空态 / 选中 / 可清空态宽度保持一致。表格筛选行多选必须走 `SensTableFilterField.multiple` + `multiDisplay="count"`（回显「已选择 N 项」，浮层复选 + 全选 + 放弃 / 完成），不要裸 `mode="multiple"`，也不要用展示型 `tags`。勾选只改草稿，「完成」才 `onChange` 并过滤表体；「放弃」或点空白还原；触发框 × 立即清空已提交值。全局 Select 宽度规则见 `select.md`：固定宽通用三档 128 / 148 / 600，自适应宽 min 148 / max 600；特殊固定宽遇到具体场景再确认。

### Token / 常量

| 语义 | 来源 |
| --- | --- |
| 标题↔框 | `spacing/horizontal/2x` |
| 项间距 / 行距 | `spacing/horizontal/4x` / `spacing/vertical/4x` |
| 重置↔展开收起 | 分割线左右各 `spacing/horizontal/2x` + `divider/color/light/transparent` |
| 展开可视高 | `TABLE_FILTER_EXPANDED_MAX_HEIGHT` = 112（推导，非 unit token；Figma `761:69440` / `761:67515`） |
| 展开区滚条 | 宽 6px（与 Select 展示型多行同一手法，非 unit token）；滑块 `outline-color-transparent` @0.35 · `radius/s` |
| 标题色 / 字号 | `text-color-transparent` @0.9 · `font-size/m` · `font-weight/medium` |
| 展开收起 | `SensButton tone="link"` + `filter-chevron-up` / `filter-chevron-down`；图标来源 Figma `804:83` / `804:82` |
| 筛选项清空 | `SensSelectDropdown clearable` + `SelectClearIcon`；图标来源 Figma `1430:4796`。单选空值用 `null`，多选空值用 `[]`，不要传 `undefined`（会从受控掉成非受控，框里还留着上次选项） |

## 表格信息区

筛选表格的信息区复用 `TableShell`，允许以下稳定场景：

| 场景 | 展示 | 交互边界 |
| --- | --- | --- |
| 默认计数 | `共 n 条` | 无额外操作 |
| 批量操作 | `已找到 n 条，当页选中 n 条` + 小号二级 / 三级按钮 | 取消选择使用三级按钮，不用绿色文字；删除用二级弱警告，悬停 / 点击才红 |
| 数据更新可刷新 | `共 n 条，数据更新于 yyyy-mm-dd hh:mm:ss` + 刷新 icon | 刷新是小号弱化链接按钮：默认中性色，hover / active 蓝色 |

右侧列设置入口使用 `setting` icon-only 小号弱化链接按钮，不展示“设置”文案。真实刷新请求和列设置面板仍标后续，不在首轮样张里做假交互。

## 框内分页

筛选表格的分页器放在表格框内底栏，不独立悬在表格外。底栏高度 56px，左右 padding 16px；左侧「本页显示第 1-20 条」始终靠左，右侧 `SensPagination` 始终靠右。`pageSize` 跟分页器（默认 10 / 20 / 50 / 100）；表体只渲染当前页切片，条数选择器改多少，当前页就展示多少行（不够一页则展示剩余行）。筛选后 `total` 用过滤后条数，并回到第 1 页。

## 筛选闭环（Demo）

- **首行**：任务类型（定时 / 实时 / 手动 / 一次性 / 周期）、速度评估（快 / 中 / 慢）。
- **展开**：负责人、状态、创建人。任务模块、创建时间只做列，不做筛选项。
- **数据**：20 条任务行；列含任务名称 / 模块 / 类型 / 状态 / 速度评估 / 负责人 / 创建人 / 创建时间 / 任务 ID。
- **过滤**：同一字段多选是或，不同字段是且；空字段不限制。有筛选时信息区「已找到 n 条」；0 条走表格 `noResult`。重置和选择器清空都回到全表。
- **搜索框**：筛选场景左侧搜索框仍在，本轮不接表体过滤。
- **三行半展开**：Demo 可切「常规筛选 / 三行半展开」。后者默认展开，展开项加到能看出裁切（负责人 / 状态 / 创建人 + 15 个不滤表的筛选项）；展开区锁 112、细滚条 6px。Figma `761:67515`。

## 页面组合

> Figma：提示信息位置 `706:33692` · 三级模块页面 / tab `761:58115`。
> 不搬顶导 / 侧导 / 标题栏。预览独立分类，不塞进筛选场景。

| 布局 | 结构 | 规则 |
| --- | --- | --- |
| 提示条 | `SensAlert type="default"`「常规提示」→ 筛选栏 → 表 | Alert 到筛选栏 `spacing/vertical/4x`（16）；可关不在本 Demo |
| 标签页 | 左 `SensLineTabs` 大号 `barOnly`（全部 / 成功 / 异常）+ 右操作区 → 筛选栏 → 表 | 工具栏底线**通栏**（含按钮下方）。右侧按 Header 操作区规则：**从右到左由强到弱**；最右一级「操作三」，中二级「操作一 / 二」，最左 `SensButtonActionMenu` + `SensMoreButton`「更多···」，**悬停**展开动作菜单（菜单项 `default` 中性行）。默认大号（32）。标签栏到筛选栏 16；切 tab **不改表数据** |

间距复用 `.form-templates-stack` 的 `spacing/vertical/4x`，与 Form「Alert / tab 到内容区」同口径。筛选闭环与筛选场景相同。

## 搜索场景

> Figma：`Sens.Design_复合表格-v2.1_20221118` · 动态搜索 `692:5775` 等 · 静态搜索 `1949:89992` 等。
> 工程：`SensTableFilterBar` `searchMode` + `/composite/table`「搜索场景」。

- **实时搜索**：框体无搜索按钮。输入法只要能输出文字（含 composing）就开始加载，再展示命中行。
- **静态搜索**：框体为触发型（右侧搜索按钮）。改框不过滤；点按钮或回车才加载。清空按钮只清框，不提交。
- **搜索范围**：由调用方指定可搜列。Demo 扫任务名称 / 任务模块 / 任务类型，不扫状态和任务 ID。
- **命中规则**：复用 `defaultSelectOptionMatcher`（原文 / 全拼 / 首字母）。英文可打中中文。
- **高亮**：命中列用 `SearchHighlight`；只高亮字面子串，拼音命中不高亮。
- **信息区**：有已提交查询时「已找到 n 条」；无查询回「共 n 条」。无命中走表格 `noResult` 空态。
- **加载**：表体 `loading`，预览用 400ms 模拟请求。正式加载 GIF 仍 Missing。

框体规则仍归 `search.md`。不要把整页产品壳（顶导 / 侧导 / 操作区）搬进本页。

## 录入型表格（`EditableTableDemo`）

> Figma：`Sens.Design_复合表格-v2.1_20221118` · 录入型表格 `761:54455`。  
> 工程：`src/preview/pages/CompositeTablePage.tsx` + `form-templates.css`；预览 `/composite/table`。

### 结构

1. **表头**：高度 56px，背景使用 `background-grey`，表头文案使用主要文字色；有说明时复用 `help` icon。
2. **数据行**：单元格高度 56px；组件型单元格左右 padding 8px，上下 padding 12px；纯文字 / 链接文字单元格左右 padding 16px。
3. **行内控件**：输入框复用 `SensInput`，选择器复用 `SensSelectDropdown`，控件高度 32px。带字数限制的输入框传入 `maxLength` + `showCount`，计数由 Input 内部承载，不在表格单元格手写或绝对定位。
4. **非组件单元格**：默认字号 14px，只支持 2 行以内文案；超过后省略，不撑高行。
5. **行操作**：删除、设置尺寸、添加选项、添加物料元素均使用常规链接按钮（14px 字号、22px 高度）；距离由表格单元格控制，不由链接按钮 padding 控制。
6. **新增行**：最后一行是 `+ 添加物料元素` 链接按钮；点击后在入口上方新增一行空白输入项，入口始终保留在最后一行，可连续新增。
7. **删除行**：每一行的 `删除` 链接按钮仅移除当前行；不影响其余行顺序或最后一行新增入口。
8. **空白新增行**：元素类型、必填等选择器未选择时显示默认文案 `请选择`，不得以空白触发框替代。

### Token / 常量

| 语义 | 来源 |
| --- | --- |
| 行高 | `size/component-height/m` + `spacing/vertical/6x` = 56 |
| 组件型单元格左右 padding | `spacing/horizontal/2x` = 8 |
| 纯文字单元格左右 padding | `spacing/horizontal/4x` = 16 |
| 单元格上下 padding | `spacing/vertical/3x` = 12 |
| 非组件文本字号 | `font-size/m` = 14 |
| 表头左右 padding | `spacing/horizontal/4x` = 16 |
| 表头背景 | `background-grey` |
| 表格边框 | `outline-color-transparent` @0.12 |
| 分割线 | `divider/color/light/transparent` |
| 添加 icon | `editor-add` |

### 本轮取舍

- Figma 原稿中选择器列较窄，控件约 104px；工程首轮不新增 104px 特殊选择器规格，优先遵守 Select 已确认规则：固定宽通用 128 / 148 / 600，自适应 min 148 / max 600。
- 首轮只做组件样张，不做真实新增、删除、校验矩阵、横向滚动条样式、业务提交和右侧锚点。
- 完整「新增元事件 / 物料元素」页面属于业务样板间，不放进复合组件本体。

### 不做（本轮）

- 列设置面板、复杂排序菜单、真实刷新请求。
- 筛选与搜索的联合过滤。
- 页面壳（顶导 / Tab / 面包屑）。

## 交叉表格（`CrossTableDemo`）

> Figma：结构 [`800:58264`](https://www.figma.com/design/6IvghX6MDshOlaJ48xBMDc/Sens.Design_%E5%A4%8D%E5%90%88%E8%A1%A8%E6%A0%BC-v2.1_20221118?node-id=800-58264&m=dev) · 悬停两态 [`26063:12256`](https://www.figma.com/design/IBBF40Lst6uPPJf70pi0bh/%F0%9F%A6%84-%E8%AE%BE%E8%AE%A1%E7%B3%BB%E7%BB%9F_v2.1%EF%BC%88%E7%A5%9E%E7%AD%96%E7%BB%BF%EF%BC%89?node-id=26063-12256&m=dev)。
> 工程：`CompositeTablePage.tsx` + `form-templates.css`（`.cross-table-*`）；预览 `/composite/table` → 交叉表格。

### 结构

1. **载体**：原生语义化 `<table>`，用 `rowSpan` / `colSpan` 合并；不走 antd Table，不加 `.ant-*`。
2. **表头两行**：第一行分组 `colSpan`；单列头 `rowSpan={2}`。单行头高 `size/component-height/xxxl`（56）；跨两行头高 112。文案左对齐，**上下居中**；左右 padding `spacing/horizontal/4x`（16）。数值列「指标」+ 单位组合整体靠右；**右对齐锚点是标题「指标」右缘**，单位跟随其后（基础 `table.md`）。背景 `background-grey`。
3. **表体分组**：`rowSpan` 必须取 `details.length`，不可写死为 3。维度 / 状态 / 备注列跨当前分组全部明细；指标列每条明细独立一行（高 46）。**顶对齐**；内容距上 / 左 `spacing/vertical/3x` · `spacing/horizontal/3x`（12）；文案左对齐；指标数值与标题右缘对齐（表体用同宽不可见单位 trailing 预留；本样张无排序，不预留排序热区）。
4. **悬停（组 + 明细加重）**：不用 `tr:hover`。每组以稳定 `groupId`、每条明细以稳定 `detailId` 派生状态，严禁使用数组下标或 DOM 位置。悬停合并格 → 同组全部合并格 + **全部明细** 组悬停（`background-grey-hover`）。悬停任一明细 → 组悬停保留，**当前 detailId 对应明细**加重（在组悬停底上再叠 `background-transparent-grey-hover` @6%）。
5. **样张边界**：无信息区、复选、筛选、分页、操作按钮、排序。

### Token / 常量

| 语义 | 来源 |
| --- | --- |
| 单行表头高 | `size/component-height/xxxl` = 56 |
| 跨行表头高 | 单行 × 2 = 112 |
| 表头左右 padding | `spacing/horizontal/4x` = 16 |
| 明细行高 | `spacing/vertical/3x`×2 + `line-height/m` = 46（Figma 推导） |
| 合并行高 | 明细行高 × 3 = 138 |
| 表体 padding | 上 / 左右 `spacing/vertical/3x` · `spacing/horizontal/3x` = 12 |
| 表头背景 | `background-grey` |
| 表头对齐 | 文案左对齐；内容上下居中（`vertical-align: middle`）；数值列组合靠右，锚点=标题右缘 |
| 表体对齐 | 顶对齐；文案左；指标数值与标题右缘对齐（单位 trailing 预留；数值列右 padding 与表头同为 16） |
| 组悬停背景 | `background-grey-hover` |
| 明细加重背景 | 组悬停底 + `background-transparent-grey-hover` @0.06 叠层 |
| 外框 | `outline-color-transparent` @0.12 |
| 横竖分割线 | `divider/color/light/transparent` |
| 主 / 辅文案 | `text-color` / `text-sub-color` · `font-size/m|s` |

### 与基础表格差异

- 悬停是**组悬停 + 明细加重**（合并整块保留，单行可再加重），不是整行 `tr:hover`。
- 表头底用 `background-grey`（同录入型），不是基础表的 `background-04`。
- 表头上下居中；表体顶对齐（上/左 12）；文案左；指标与标题右缘对齐（不跟单位）；有竖向分割线（最右列用 `cross-table__cell--trail` 去右边框，不用 `:last-child`，避免 rowSpan 行误伤）。

### 本轮不做

- 排序后悬停：Figma `26063:12256`、`8171:33248`、`7617:41019` 仅提供默认箭头与组 / 明细悬停，未提供排序生效后的悬停视觉；缺少设计依据，不自行推断或实现。
- 复选列、信息区、分页器、操作链接。

## 当前已确认

- `StatusBadge` 复用 Tag / 状态分类，但仍需作为旧组件纳入全组件 SensD token 审计。
- 刷新 icon 来自 Figma `803:278`，已录入 SensD icon registry 为 `reload`。
- 设置 icon 来自 Figma `1650:7139`，已录入 SensD icon registry 为 `setting`。
- 列设置、数据刷新入口可以在信息区展示，但真实列配置、刷新请求和复杂排序交互进入后续复合表格。

## 工程落点

```text
src/ui/SensTableFilterBar.tsx
src/ui/table-filter.css
src/ui/SearchInput.tsx
src/ui/SearchHighlight.tsx
src/ui/index.ts
src/preview/pages/CompositeTablePage.tsx
src/design-system/components/composite/table.md
```
