# 设计系统 skill · 基础组件：表格 Table

> 维护表格信息区、表体与自身状态；筛选、分页、录入、树表和业务样板间另读对应规则。<br>
> 成熟度：Pilot<br>
> 实现：Implemented<br>
> 验证：Pending<br>
> 来源：`TableShell`、`table.css`、Sens.Design Table 规则。<br>
> 预览：`/components/table`

## 黑盒约定
- 当前用 antd `Table` 作底座，统一通过 `src/ui/TableShell` 包装。
- 表格操作列使用 `src/ui/TableActions` / `LinkButton`；批量操作使用 `TableShell.infoActions` 的小按钮配置。
- 布局细节在 `src/ui/table.css`，`TableShell` 会自动添加 `className="sens-table"`。
- `TableShell`、`LinkButton` 与表格适配 CSS 不读取 `theme.useToken()` 或 `token.color*`。颜色、尺寸、圆角和分割线全部直接读取 SensD helper；antd `Table` 仅承担 DOM、选择与滚动等底层能力，排序 icon、循环、状态和数据排序均由 Sens 自持，不依赖 antd 排序容器或 class。
- 生成文件 `tokens.resolved.json`、`theme.ts` 只能由 token 构建链路生成，不能手改。

## 组件边界
| 内容 | 是否由基础表格负责 |
|---|---|
| 表格信息区 | 是 |
| 表头、表体、选择列、固定列、排序 | 是 |
| 空状态、加载态 | 是 |
| 单元格加载、失败刷新 | 是 |
| 页面滚动时表头吸顶 | 是，提供可选能力 |
| 分页器 | 否，使用 `SensPagination` 独立组合 |
| 筛选区 | 否，属于「筛选表格」复合组件 |
| 录入型表格 | 否，属于「录入型表格」复合组件 |
| 树表格 | 否，属于「树表格」复合组件 |
| 嵌套表格 | 否，属于后续复合表格 |
| 交叉表格 | 否，属于「交叉表格」复合组件 |
| 页面标题、面包屑、提交按钮、右侧锚点 | 否，属于业务样板间 |

## API 使用
```tsx
<TableShell
  total={1000}
  infoContent={<TableInfoRefreshableSummary total={1000} updatedAt="2022-10-31 20:33:22" />}
  infoExtra={<TableInfoColumnSettingButton />}
  rowKey="key"
  columns={columns}
  dataSource={rows}
  scroll={{ x: 1280 }}
  pagination={false}
/>
```

页面滚动吸顶（仅长表格页面）：

```tsx
<TableShell
  stickyHeader="page"
  columns={columns}
  dataSource={rows}
  pagination={false}
/>
```

`stickyHeader="page"` 只适用于页面 / 产品壳内容区的单一纵向滚动：顶部导航先按页面规则收起；表头到达内容区顶端后吸顶；表格底部离开时表头随表格离场。页面选择它作为吸顶对象时，标题栏必须进入同一内容滚动流并随正文滚走，不能同时吸顶。它不替代全局导航吸顶，也不与表体内部纵向滚动叠加。

批量操作信息区：

```tsx
<TableShell
  foundTotal={1000}
  selectedCount={9}
  infoActions={[
    { key: "hide", label: "隐藏" },
    { key: "show", label: "显示" },
    { key: "delete", label: "删除", tone: "dangerSecondaryWeak" },
    { key: "cancel", label: "取消选择", tone: "tertiary" },
  ]}
  infoExtra={<TableInfoColumnSettingButton />}
  rowSelection={{ selectedRowKeys }}
  columns={columns}
  dataSource={rows}
/>
```

## 信息区规则
| Props | 展示 |
|---|---|
| `total` | 共 n 条 |
| `foundTotal` | 已找到 n 条 |
| `selectedCount` | 追加：当页选中 n 条 |
| `infoActions` | 信息区批量操作，小号二级 / 二级弱警告 / 三级按钮 |
| `infoExtra` | 信息区最右侧操作入口，例如列设置 icon |
| `infoContent` | 自定义信息区内容 |
| `footerBar` | 表格框内底部区域；复合表格可放分页器 |
| `showInfoBar={false}` | 隐藏信息区 |

信息区固定高度 40px，左右 padding 16px，底部分割线走 `divider/color/light/solid`。
批量操作不使用链接。常规动作默认 `secondary`；删除等其他风险使用 `tone: "dangerSecondaryWeak"`（默认与二级同色，悬停 / 点击才变警告红）；弱操作如「取消选择」使用 `tone: "tertiary"`。
刷新 icon 使用 SensD icon registry 的 `reload`；设置 icon 使用 `setting`。样张复用 `TableInfoRefreshableSummary`（文案后刷新）与 `TableInfoColumnSettingButton`（右侧 icon-only）。真实刷新请求与列设置面板不在基础表格里实现，进入后续「筛选表格」复合组件。

### 信息区场景

| 场景 | 展示 |
|---|---|
| 默认计数 | `共 n 条` |
| 筛选结果 | `已找到 n 条` |
| 批量操作 | `已找到 n 条，当页选中 n 条` + 小号二级 / 二级弱警告 / 三级按钮 |
| 数据更新可刷新 | `共 n 条，数据更新于 yyyy-mm-dd hh:mm:ss` + 紧跟文案后的刷新 icon |

数据更新可刷新场景中，刷新入口是小号弱化链接按钮：默认中性色，hover / active 进入链接蓝；右侧列设置入口是 icon-only 小号弱化链接按钮，不展示“设置”文案。

### 表格框内底栏

`footerBar` 用于复合表格把分页器放进表格框内。底栏高度 56px，左右 padding 16px，左侧页码范围始终靠左，右侧 `SensPagination` 始终靠右；基础表格本身仍保持 `pagination={false}`，分页逻辑由复合表格组合。
当表格存在 `footerBar` 时，最后一行单元格底线不再绘制，避免与 footer 顶部分割线叠加成粗线。

## 列规则
- 文本列左对齐；数字、计数、金额右对齐。
- 表头组合顺序为「标题（可带单位）→ 帮助 icon → 排序 icon」，相邻元素间距 4px。文本列组合靠左；数字、计数、金额、日期等可比较字段组合整体靠右。
- 数值列的右对齐锚点是**标题文字的右缘**，不是整组表头的最右缘。单位、帮助与排序 icon 跟随在标题之后；若有排序 icon，数值单元格要为 16px 图标热区和 4px 间距预留同等右侧空间，使数值仍与标题文字对齐。
- 表头标题使用 14px / 22px 中等字重，永不折行；单位使用辅助文字 12px / 18px；帮助 icon 16px，排序使用 SensD `up-mini` + `down-mini`（视觉尺寸 8px + 8px，各自独立点击热区）。排序默认使用可换肤 `icon-color-transparent`；仅悬停的箭头使用 `component-primary`，按下与已选方向使用 `component-active`。
- 业务标记（例如「重要指标」）紧跟标题、位于帮助 icon 之前，复用 `SensTag`。前置独立选择列产生的额外左侧空隙由列结构承担，不写入表头通用 padding。
- 操作列固定为最后一列，超宽时配置 `fixed: "right"`。
- 需要横向滚动时配置 `scroll={{ x: 1280 }}` 或更大的业务列宽。
- **列宽策略由设计逐列标注**：定宽列必须在列定义中声明 `width`，适用于选择列、状态、时间、数字、操作等宽度稳定的字段；自适应列不声明固定 `width`，用于名称、描述等承接容器剩余宽度的主信息。两种策略可在同一张表格中混用。
- 表格可用宽度不足以承载各列定宽与必要内容宽度时，才使用表格内部横向滚动；不要以给所有列任意定宽的方式替代自适应列。
- 页面视口窄于 `1280px` 时，基础表格消费 Layout / Product Shell 提供的 `1280px` 产品最小画布，由页面承接横向滚动；表格不得因视口变窄自行压缩列或以内部横向滚动替代页面横向滚动。在该最小画布内仍超宽时，才保留表格自身横向滚动。
- 复合表格只消费基础表格的列宽策略；具体业务列的定宽 / 自适应标注仍在对应复合场景中声明，不复制一套列宽实现。
- 简单排序使用 `sorter` + `sortDirections={["ascend", "descend", null]}`：默认 -> 升序 -> 降序 -> 默认；仅紧跟标题的上下排序箭头 hover、提示「点击排序」并触发排序，标题与表头其余区域不触发排序。排序视觉由 `sens-table-sortable-*` 语义类与 Sens `up-mini` / `down-mini` 自持，不依赖 antd 排序容器的 class；antd 仅提供数据排序状态机。默认双箭头为 `icon-color-transparent`；仅悬停的箭头为 `component-primary`，按下和已选方向为 `component-active`。无排序或仅悬停箭头时不加表头/列背景；升序、降序生效后，当前列表头使用 `background-grey-hover`，同列单元格使用 `background-04`。
- 超过三种排序方式时使用「复杂排序」下拉菜单，菜单必须展示当前排序与可执行动作。当前未抽通用 API，按业务字段能力确认后再进入复合组件。
- 超长文本使用 `TableEllipsis`：单行省略号 + hover `SensTips` 展示完整纯文案。不要叠 antd `ellipsis`，也不要把 `LinkButton` 整颗当作便签 `title`（深底会被弱链接字色盖掉）。需要两行截断时由业务列渲染器定义。
- 单元格可复用文本、链接下钻、用户下钻、状态、行内编辑、Tag 等基础组件；表格不内置业务字段逻辑。
- 状态单元格优先复用 Tag / 状态分类；当前 `StatusBadge` 是旧组件，仍需纳入全组件 SensD token 审计，不在基础表格内私自定义状态色。

### 单元格承载方式

- 内容区以单元格边线内侧为边界；测量 padding 时以边线到内容区为准。
- **定高表格**：`TableShell` 的默认表头 / 展示型表体使用固定高 `--sens-table-row-height`，单元格 padding 为水平 16px、垂直 5px。固定高单元格不得由内容自然撑高；需要两行截断时由列渲染器明确处理。
- **录入型表格**：Input、Select 等控件所在单元格使用水平 8px、垂直 12px。它不由基础 `TableShell` 自动推断，归录入型复合表格显式声明和实现。
- **Padding 表格**：三行及以上文本、图文或复杂内容使用水平 16px、垂直 12px，并允许内容撑高；内容从顶部排布，不以裁切或横向滚动替代纵向扩展。文本仍左对齐，数值仍按数值列锚点右对齐。
- 同一张表格若混用承载方式，业务列 / 行必须显式标注模式；禁止用全局 `--sens-table-row-height` 覆盖所有类型。

| 承载方式 | 典型内容 | 实现归属 |
|---|---|---|
| 定高表格 | 主 / 辅助文案、状态、数值同比、标签、开关、进度条、选择框 | 基础 `TableShell`；按 56px 固定行高承载。 |
| 录入型表格 | Input、Select、带计数输入框、带图标 / 标签的选择器 | 录入型复合表格；复用正式 Sens 输入和选择组件，不由 `TableShell` 猜测控件布局。 |
| Padding 表格 | 长文本、图文信息、置信区间 / 趋势图等复杂内容 | 对应复合表格列渲染器；显式允许行高自适应。 |

### 单元格加载与失败刷新

- `TableCellAsync` 是基础表格的受控单元格状态组件，状态仅有 `content`、`loading`、`failed`；它不管理请求，也不替换整张表的 loading / 空态。
- `loading` 在固定高单元格内仅展示旋转 loading icon，不展示「加载中」文字；icon 使用 `icon-color-transparent`。视觉上不额外占文字宽度；无障碍语义仍需提供「加载中」。
- `failed` 展示 `error` icon +「加载失败」+ 常规 14px 链接按钮「刷新」；失败 icon 与文案使用 `warning-color`。传入 `onRefresh` 后，由业务在回调内启动请求并把 `state` 切到 `loading`，完成后再切回 `content` 或 `failed`。
- 预览页提供完整「失败 → 刷新 → 加载 → 内容」闭环；真实请求、重试次数与错误归因仍由业务或复合表格负责。

## 操作列
- 第一列可下钻主属性使用 `<LinkButton tone="weak" />`：默认中性文字，hover / active 进入链接蓝。
- `TableActions` 平铺前 2 个操作，使用常规蓝色 `<LinkButton tone="link" />`。
- 当操作总数超过 3 个时，第 3 个起进入「更多」下拉。
- 链接默认走中性色 `colorText`，hover / active 走链接蓝 `colorLink` / `colorLinkActive`。
- 「更多」必须使用 `SensDropdownButton`（链接「更多」，点击展开），不手写普通 Dropdown。浮层菜单项用 `variant="link"` 蓝字行，与平铺操作同色；删除等风险项可用 `danger`。字号与平铺操作同为 `font-size/m`（14 / 22），不要用链接小号 `font-size/s`。

## 选择态
- 表头全选、行多选复用 `SensCheckbox`（无可见文案，`aria-label` 为「全选当页」/「选择行」）。antd Table 只保留勾选状态机，不使用 antd Checkbox 视觉层。
- 复选框单元格有两种承载：树表格、录入型表格等需要解释选择对象的场景使用「复选框 + 文案」，间距 8px；批量操作使用无文案的独立选择列，列宽 32px，16px 复选框左距列边 16px、右侧贴列边。
- 半选是功能色底 + 白色横线，不是 antd 默认的框内小方块。
- 选中行背景保持 `white`，不使用绿色选中底。
- 可排序列表头悬停走 `SensTips`「点击排序」，不用 antd Tooltip。

## 空状态
| `emptyState` | 场景 |
|---|---|
| `noData` | 默认无数据 |
| `noResult` | 筛选无结果 |
| `loadFailed` | 加载失败 |

空态消费 `<SensEmptyState scope="non-page" size="base" />`；`emptyState` 映射 `noData` / `noResult` / `loadFailed`。默认展示标题 + 说明（`noData`「暂无数据，请添加」、`noResult`「未找到结果，请重新输入」、`loadFailed`「数据加载失败，请刷新」；添加 / 刷新为说明内嵌链接）。空态区高度对齐 Figma `799:77513` 插画区 316，块内 padding 走 Empty State `spacing/5x`，表格壳只负责居中。三态走 antd `tr.ant-table-placeholder`，不是数据行，悬停不加 `background-grey-hover`。

`emptyDescription` 覆盖说明；`emptyAction` 进入 `actions` 槽。默认三态不必再塞三级按钮。

## Token 映射
| 视觉语义 | SensD token / handle | antd alias / 组件消费 | 状态 |
|---|---|---|---|
| 容器背景 | `white` | `--sens-table-shell-bg` | Ready |
| 外框描边 | `divider/color/outline/solid` -> `outline-color` | `--sens-table-shell-border` | Ready |
| 容器圆角 | `radius/l` | `--sens-table-shell-radius` | Ready |
| 信息区文字 | `text-sub-color` | `--sens-table-info-color` | Ready |
| 信息区分割线 | `divider/color/light/solid` -> `divideline-color-light` | `--sens-table-info-border` | Ready |
| 表格框内底栏高度 | `size/component-height/xxxl` | `--sens-table-footer-height` | Ready |
| 表格框内底栏间距 | `spacing/vertical/3x` / `spacing/horizontal/4x` | `--sens-table-footer-*` | Ready |
| 表头背景 | `background-04` | `--sens-table-header-bg` | Ready |
| 表头文字 | `text-color` | `--sens-table-header-color` | Ready |
| 表头帮助 / 默认排序 icon | `icon-color-transparent` | `SensIcon name="help"` / `up-mini` / `down-mini` | Ready |
| 排序悬停 / 按下 / 当前方向 / 列背景 | `component-primary` / `component-active` / `component-primary` / `background-grey-hover` | sorter interaction / 当前排序列 | Ready |
| 行分割线 | `divider/color/weak/solid` -> `line-color` | `--sens-table-row-border` | Ready |
| 行 hover | `background-grey-hover`（仅数据行；三态 placeholder 不加） | `--sens-table-row-hover-bg` | Ready |
| 排序图标 | `icon-color-transparent` / `component-primary` / `component-active` | `--sens-table-sorter-*` | Ready |
| 下钻弱链接默认 / hover / active | `text-color` / `link-color` / `link-active-color` | `LinkButton tone="weak"` | Ready |
| 操作链接默认 / hover / active | `link-color` / `link-hover-color` / `link-active-color` | `LinkButton tone="link"` | Ready |
| 批量操作按钮 | Button 小号二级 / 二级弱警告 / 三级 token | `SensButton size="small"` | Ready，依赖 Button |
| 选中行背景 | `white` | `--sens-table-row-selected-bg` | Ready |
| 选择列复选框 | `SensCheckbox`（`size/icon/m` · `radius/s` · `component-primary`） | 表头全选 / 行选 / 半选白横线 | Ready |
| 批量操作独立选择列 | 列宽 32px；复选框左距 16px、右侧贴列边；无可见文案 | 批量操作的表头全选 / 行选 | Rule Ready |
| 信息区高度 | `size/component-height/xl` | `--sens-table-info-height` | Ready |
| 表头 / 定高单元格高度 | `size/component-height/xxxl` | `--sens-table-row-height` | Ready |
| 定高单元格 padding | 水平 16px / 垂直 5px | 固定展示型表体 | Rule Ready |
| 录入型单元格 padding | 水平 8px / 垂直 12px | 录入型复合表格显式消费 | Rule Ready |
| Padding 单元格 padding | 水平 16px / 垂直 12px | 多行 / 图文 / 复杂内容 | Rule Ready |
| 信息区字号 / 行高 | `font-size/s` / `line-height/s` | `--sens-table-info-font-size` / `--sens-table-info-line-height` | Ready |
| 操作字号 / 行高 | `font-size/m` / `line-height/m` | `--sens-table-link-font-size` / `--sens-table-link-line-height` | Ready |
| 空态区域 | `SensEmptyState` non-page base；区高 316（插画 100 + 文案栈 + `spacing/5x`×2 + 上下留白） | `.sens-table-empty` | Ready |
| 信息区刷新 icon | Figma `803:278` | `SensIcon name="reload"` | Ready |
| 信息区右侧 setting icon | Figma `1650:7139` | `SensIcon name="setting"` | Ready |
| 单元格 loading icon | `icon-color-transparent` | `TableCellAsync state="loading"` | Ready |
| 单元格失败 icon / 文案 | `warning-color` | `TableCellAsync state="failed"` | Ready |
| 加载 GIF | Figma 资产 | 表格 loading | Missing，暂不录入 |

## 待收录能力

以下能力不阻塞基础 Table 的当前规则发布；未形成完整状态与数据语义前，不用静态样张冒充已支持能力。

| 能力 | 归属 | 状态与前置条件 |
| --- | --- | --- |
| 缩略图表格 | 基础 Table 的单元格内容模式 | 待补独立可见样张（Figma `800:58263`）；复用 Padding 单元格的「缩略图 + 标题 + 辅助信息」结构，不另造业务表格。 |
| 横向 / 纵向拖拽 | 基础 Table 的进阶交互 | 待收录（Figma `774:43065`）；需先定义列 / 行拖拽对象、拖拽反馈、落点、取消和键盘可访问性。 |
| 树表格 | 复合表格 | 待收录（Figma `724:29088`）；依赖树数据结构、展开收起、层级缩进、父子选择和树节点状态。 |
| 树表格局部加载 | 树表格子能力 | 待收录（Figma `2649:75062`）；需定义节点加载、失败刷新、局部更新与不影响其余节点的边界。 |
| 嵌套表格 | 复合表格 | 待收录（Figma `724:29087`）；需定义父表 / 子表展开关系、缩进、边框和信息继承。 |
| 交叉表格 | 复合表格 | 已收录；合并单元格与组悬停规则见 `components/composite/table.md`。 |

## 工程落点
```text
src/ui/TableShell.tsx
src/ui/table.css
src/ui/index.ts
src/preview/pages/TableShowcasePage.tsx
src/design-system/components/base/table.md
src/design-system/components/base/table.design.md
```

信息区入口组件：`TableInfoRefreshableSummary`、`TableInfoColumnSettingButton`（与复合筛选表格样张共用）。
