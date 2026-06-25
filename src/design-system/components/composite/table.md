# 设计系统 skill · 复合组件：表格 Table

> 给 agent（Cursor / Claude Code）还原表格时读的规则。只收「会改变生成结果」的系统级约定；
> 具体某张表有哪些列、什么内容，看 Figma 选区。规则源自 Sens.Design 表格规范（以 v2.1 为准）。

## 黑盒约定（重要）
- 表格是**复合组件**。现阶段用 antd `Table` 作替身，**不要用 div 手写表格**。
- 外壳用 `src/ui/TableShell`（信息区 + 边框容器 + `Table`），操作列用 `src/ui/TableActions` / `LinkButton`。
- 布局细节在 `src/ui/table.css`，`Table` 加 `className="sens-table"`。
- 等内部库 `sensd` 进来后，只把 `columns` / `dataSource` 配置搬过去即可，列定义不会白费。
- 主题已在 `src/design-system/theme.ts` 配好（含 Table 组件 token），**不要硬编码任何颜色**。

## 页面区块（自上而下，缺一不可）
1. **标题区**：标题（二级标题）+ 右侧主操作按钮（如「创建 Schema」，type=primary）。
2. **筛选区**：搜索框固定最左 + 若干 `Select` 筛选项；占位文案「请+动作」（请选择/请输入）。
3. **信息区**：计数「共 N 条」，与表格联动（见下方尺寸）。
4. **表体**：`Table`（包在 `TableShell` 内）。
5. **分页器**：默认每页 20 条；左侧「本页显示第 n-m 条」。

> 分步还原时，可先做 3 + 4（`TableShell` + 列 + 占位数据），再补 1、2、5。

## 尺寸与间距（已落地，生成时必须遵守）

### 信息区
| 属性 | 值 |
|------|-----|
| 高度 | `spacing/10x`（`box-sizing: border-box`） |
| 内边距 | 上下 11（无 token，见 `TableShell`）、左右 `spacing/4x` |
| 字号 / 行高 | `fontSizeSM` / 18（辅色 `colorTextSecondary`） |
| 底部分割 | `colorBorderSecondary` + 内阴影 `inset 0 -1px` |

### 表头 & 内容行
| 属性 | 值 |
|------|-----|
| 行高 | `size/xxxl` / `size/component-height/xxxl`（`th` / `td` 均固定） |
| 单元格水平内边距 | `spacing/4x`（`Table.cellPaddingInline`） |
| 单元格垂直内边距 | `Table.cellPaddingBlock`（6；配合正文行高 × 最多 2 行 = `size/xxxl`） |
| 正文字号 / 行高 | `fontSize` / `lineHeight`（14 / 22） |

### 表头专项
- **无列间竖向弱分割线**：规范里没有。`Table.headerSplitColor` 与 `headerBg` 同色，且隐藏 `th::before`。
- **标题与排序图标间距**：`spacing/1x`（`.ant-table-column-sorters { gap: … }`）。
- 表头背景走 `Table.headerBg`（`colorFillAlter` / `background-04`），文字 `Table.headerColor`（`colorText`）。

## 列 → 单元格类型映射
| 类型 | 对齐 | 省略 | 示例列 |
|------|------|------|--------|
| 文本 | 左 | 超长时 2 行 + 省略号 | Schema 名称 |
| 数字（对比/计数） | **右** | 否 | 关联任务 |
| 文本 | 左 | 否 | 数据源 |
| 超长文本 | 左 | **2 行** + 省略号，hover tooltip | 数据连接 |
| 可排序文本 | 左 | 否 | 创建人、创建时间 |
| 操作 | 左 | — | 查看 / 编辑 / 删除 |

超长文本列配置示例：
```ts
ellipsis: { rows: 2, showTitle: true }
```

## 操作列（最常被做错）
- 用**链接按钮**（`Typography.Link` → `colorLink` 蓝色），**不要用普通深色文字**。
- 操作 ≤ 3 个：平铺展示；> 3 个：第 3 个起收进「更多」下拉。
- 固定为**最后一列**；表格超宽时 **冻结右侧**（`fixed: 'right'`）。
- 链接间距 `spacing/4x`；文案以动词为主（查看 / 编辑 / 删除）。

## 排序
- 一次只排一列；点其它列排序时，上一列回到默认。
- 循环：默认 → 升序 → 降序 → 默认；排序中高亮该列。
- 表头标题与排序控件间距 `spacing/1x`（见上）。

## 行高与省略
- **列表页默认场景**（如 Schema 管理）：固定行高 `size/xxxl`，超长文案 **最多 2 行**后 `…`，不再撑高行。
- **动态高度**：仅用于带缩略图或内嵌组件的表格（固定上下 padding，内容可超过 2 行）。
- 行分隔线走 `Table.borderColor`（`line-color`）；行 hover 走 `Table.rowHoverBg`（`colorFillSecondary`）。

## 冻结与吸顶（v0.2 补充）
- 表头吸顶：向上滚动时表头始终可见。
- 首尾冻结：水平滚动时，固定首列（主属性）+ 尾列（操作）。

## 信息区计数文案（i18n）
- 默认「共 n 条」；筛选后「已找到 n 条」；批量后「当页选中 n 条」；
  筛选+批量「已找到 n 条，当页选中 n 条」。

## 异常状态（必做）
- 数据为空 / 筛选为空：用**你们的空状态插图**（从 Figma 导出放进 `src/assets/`），
  不要用 antd 默认 Empty 插图。

## 主题 token（theme.ts → 引用即可，勿硬编码）

### 全局 token
| 用途 | antd token |
|------|------------|
| 主文字 | `colorText` |
| 辅文字 | `colorTextSecondary` |
| 链接 | `colorLink` |
| 外框描边 | `colorBorder` |
| 浅分割线 | `colorBorderSecondary` |
| 页面底 | `colorBgLayout` |
| 容器底 | `colorBgContainer` |
| 表头浅灰底 | `colorFillAlter` |
| 行 hover 底 | `colorFillSecondary` |

### Table 组件 token
| 属性 | 说明 |
|------|------|
| `headerBg` | 表头背景（= `colorFillAlter`） |
| `headerColor` | 表头文字 |
| `headerSplitColor` | **与 headerBg 同色**（隐藏列间弱线） |
| `borderColor` | 行底部分割线（`line-color`） |
| `rowHoverBg` | 行悬停背景 |
| `cellPaddingBlock` | 6（配合 `size/xxxl` 行高） |
| `cellPaddingInline` | `spacing/4x`（16） |

## 工程落点（当前仓库）
```
src/ui/TableShell.tsx      # 信息区 + 表格外壳
src/ui/table.css           # 行高、去弱线、排序间距、省略行高
src/ui/index.ts            # 导出 TableShell / TableActions / LinkButton
src/design-system/theme.ts # Table 组件 token
src/features/.../SchemaTable.tsx  # 列定义 + 占位数据（示例）
```
