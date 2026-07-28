# 设计系统 skill · 复合组件：复合表格

> 可复用的表格组合模式，不将筛选、录入、树表和嵌套 / 交叉表格塞进基础表格。<br>
> 成熟度：Pilot<br>
> 实现：Partial<br>
> 验证：Verified<br>
> 来源：Table、Pagination、`SensTableFilterBar` 与复合表格 Figma 规则。<br>
> 预览：`/composite/table`

## 组件边界

| 层级 | 负责内容 | 不负责内容 |
| --- | --- | --- |
| 基础表格 | 表格信息区、表头、表体、选择、排序、空态、加载、横向滚动 | 筛选区、分页器、录入校验、树层级、具体业务字段 |
| 复合表格 | 筛选区 + 表格 + 分页器 + 批量操作 + 列设置等稳定组合 | 具体业务对象、页面壳、真实跳转 |
| 业务样板间 | SDH 录入型表格、SDH 树表格等真实业务场景 | 重新定义基础组件状态 |

## 待收录结构

| 复合表格 | 状态 | 前置条件 |
| --- | --- | --- |
| 筛选表格 | ✅ 筛选区 + 信息区 + 框内分页首轮已浏览器验收；列设置面板 / 复杂排序 / 真实刷新仍待 | 列设置、复杂排序、筛选结果 ↔ `foundTotal` / 分页 |
| 录入型表格 | ✅ 首轮行内编辑样张已浏览器验收（单元格 56 / padding 12×8） | 校验、真实新增 / 删除和滚动规则待补 |
| 树表格 | 待收录 | 树节点展开、缩进、父子关系与选择规则 |
| 嵌套 / 交叉表格 | 待收录 | 横纵交叉阅读、嵌套层级和复杂数据关系 |

## 筛选区（`SensTableFilterBar`）

> Figma：`Sens.Design_复合表格-v2.1_20221118` · 筛选区域 `761:73313` 等。  
> 工程：`src/ui/SensTableFilterBar.tsx` + `table-filter.css`；预览 `/composite/table`。

### 结构

1. **筛选流**：可选搜索（默认 `SearchInput` 200px）+ 主筛选项 + 更多筛选项（展开态）+「重置」+「展开 / 收起」按钮。
2. **重置**：当任一筛选项有选中信息时出现，位置固定在「展开 / 收起」左侧；不受展开或收起状态影响。
3. **展开 / 收起**：有 `moreFields` 且筛选项存在折叠需求时出现；按钮是筛选流里的最后一个 inline item，不独占一行。
4. **换行规则**：筛选项不足一行时操作组跟在首行末尾；筛选项超过一行时，展开态操作组跟随最后一行；不能把操作组拆成独立操作行。
5. **单项**：左标题右控件；标题↔框 `spacing/horizontal/2x`（8）；项间距 / 行距 `spacing/horizontal/4x` · `spacing/vertical/4x`（16）。

复合表格不定义整页最小画布。产品电脑端 `1280px` 最小宽度属于 Layout / Product Shell 规则；小于 `1280px` 采用横向滚动，不让筛选区自行进入移动端压缩或换一套小屏结构。

### 表格筛选定宽（仅本上下文）

| 场景 | 宽 | 常量 / 组件接口 |
| --- | --- | --- |
| 表格筛选 Select | 148 | `TABLE_FILTER_TRIGGER_WIDTH` + `SensSelectDropdown widthPreset="148"` |

表格筛选使用固定宽选择器，空态 / 选中 / 可清空态宽度保持一致。全局 Select 宽度规则见 `select.md`：固定宽通用三档 128 / 148 / 600，自适应宽 min 128 / max 600；特殊固定宽遇到具体场景再确认。

### Token / 常量

| 语义 | 来源 |
| --- | --- |
| 标题↔框 | `spacing/horizontal/2x` |
| 项间距 / 行距 | `spacing/horizontal/4x` / `spacing/vertical/4x` |
| 重置↔展开收起 | 分割线左右各 `spacing/horizontal/2x` + `divider/color/light/transparent` |
| 展开可视高 | `TABLE_FILTER_EXPANDED_MAX_HEIGHT` = 112（推导，非 unit token） |
| 标题色 / 字号 | `text-color-transparent` @0.9 · `font-size/m` · `font-weight/medium` |
| 展开收起 | `SensButton tone="link"` + `filter-chevron-up` / `filter-chevron-down`；图标来源 Figma `804:83` / `804:82` |
| 筛选项清空 | `SensSelectDropdown clearable` + `SelectClearIcon`；图标来源 Figma `1430:4796` |

## 表格信息区

筛选表格的信息区复用 `TableShell`，允许以下稳定场景：

| 场景 | 展示 | 交互边界 |
| --- | --- | --- |
| 默认计数 | `共 n 条` | 无额外操作 |
| 批量操作 | `已找到 n 条，当页选中 n 条` + 小号二级 / 三级按钮 | 取消选择使用三级按钮，不用绿色文字 |
| 数据更新可刷新 | `共 n 条，数据更新于 yyyy-mm-dd hh:mm:ss` + 刷新 icon | 刷新是小号弱化链接按钮：默认中性色，hover / active 蓝色 |

右侧列设置入口使用 `setting` icon-only 小号弱化链接按钮，不展示“设置”文案。真实刷新请求和列设置面板仍标后续，不在首轮样张里做假交互。

## 框内分页

筛选表格的分页器放在表格框内底栏，不独立悬在表格外。底栏高度 56px，左右 padding 16px；左侧「本页显示第 1-20 条」始终靠左，右侧 `SensPagination` 始终靠右。

## 录入型表格（`EditableTableDemo`）

> Figma：`Sens.Design_复合表格-v2.1_20221118` · 录入型表格 `761:54455`。  
> 工程：`src/preview/pages/CompositeTablePage.tsx` + `form-templates.css`；预览 `/composite/table`。

### 结构

1. **表头**：高度 56px，背景使用 `background-grey`，表头文案使用主要文字色；有说明时复用 `help` icon。
2. **数据行**：单元格高度 56px；组件型单元格左右 padding 8px，上下 padding 12px；纯文字 / 链接文字单元格左右 padding 16px。
3. **行内控件**：输入框复用 `SensInput`，选择器复用 `SensSelectDropdown`，控件高度 32px。
4. **非组件单元格**：默认字号 14px，只支持 2 行以内文案；超过后省略，不撑高行。
5. **行操作**：删除、设置尺寸、添加选项、添加物料元素均使用小号链接按钮；距离由表格单元格控制，不由链接按钮 padding 控制。
6. **新增行**：最后一行是 `+ 添加物料元素` 链接按钮，用于新增一行。

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

- Figma 原稿中选择器列较窄，控件约 104px；工程首轮不新增 104px 特殊选择器规格，优先遵守 Select 已确认规则：固定宽通用 128 / 148 / 600，自适应 min 128 / max 600。
- 首轮只做组件样张，不做真实新增、删除、校验矩阵、横向滚动条样式、业务提交和右侧锚点。
- 完整「新增元事件 / 物料元素」页面属于业务样板间，不放进复合组件本体。

### 不做（本轮）

- 列设置面板、复杂排序菜单、真实刷新请求。
- 多选筛选浮层「全选 + 确定」完整矩阵（走后续 Select 多选还原）。
- 页面壳（顶导 / Tab / 面包屑）。

## 当前已确认

- `StatusBadge` 复用 Tag / 状态分类，但仍需作为旧组件纳入全组件 SensD token 审计。
- 刷新 icon 来自 Figma `803:278`，已录入 SensD icon registry 为 `reload`。
- 设置 icon 来自 Figma `1650:7139`，已录入 SensD icon registry 为 `setting`。
- 列设置、数据刷新入口可以在信息区展示，但真实列配置、刷新请求和复杂排序交互进入后续复合表格。

## 工程落点

```text
src/ui/SensTableFilterBar.tsx
src/ui/table-filter.css
src/ui/index.ts
src/preview/pages/CompositeTablePage.tsx
src/design-system/components/composite/table.md
```
