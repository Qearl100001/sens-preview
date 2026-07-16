# 设计系统 skill · 基础组件：表格 Table

> 给 agent 还原基础表格时读的规则。只收「表格信息区 + 表体 + 表格自身状态」；筛选区、分页器、录入型表格、树表格与业务样板间另行读取对应文档。

## 黑盒约定
- 当前用 antd `Table` 作底座，统一通过 `src/ui/TableShell` 包装。
- 表格操作列使用 `src/ui/TableActions` / `LinkButton`；批量操作使用 `TableShell.infoActions` 的小按钮配置。
- 布局细节在 `src/ui/table.css`，真实 Table 必须带 `className="sens-table"`。
- 颜色与尺寸必须能追溯到 SensD design token；antd token 只是底层消费层，不作为设计来源。
- 生成文件 `tokens.resolved.json`、`theme.ts` 只能由 token 构建链路生成，不能手改。

## 组件边界
| 内容 | 是否由基础表格负责 |
|---|---|
| 表格信息区 | 是 |
| 表头、表体、选择列、固定列、排序 | 是 |
| 空状态、加载态 | 是 |
| 分页器 | 否，使用 `SensPagination` 独立组合 |
| 筛选区 | 否，属于「筛选表格」复合组件 |
| 页面标题、面包屑、提交按钮、右侧锚点 | 否，属于业务样板间 |

## API 使用
```tsx
<TableShell
  total={1000}
  rowKey="key"
  columns={columns}
  dataSource={rows}
  scroll={{ x: 1280 }}
  pagination={false}
/>
```

批量操作信息区：

```tsx
<TableShell
  foundTotal={1000}
  selectedCount={9}
  infoActions={[
    { key: "hide", label: "隐藏" },
    { key: "show", label: "显示" },
    { key: "delete", label: "删除" },
    { key: "cancel", label: "取消选择", tone: "tertiary" },
  ]}
  infoExtra={<ColumnSettingButton />}
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
| `infoActions` | 信息区批量操作，小号二级 / 三级按钮 |
| `infoExtra` | 信息区最右侧操作入口，例如列设置 icon |
| `infoContent` | 自定义信息区内容 |
| `showInfoBar={false}` | 隐藏信息区 |

信息区固定高度 40px，左右 padding 16px，底部分割线走 `colorBorderSecondary`。
批量操作不使用链接。常规动作默认 `secondary`，弱操作如「取消选择」使用 `tone: "tertiary"`。
如果 setting icon 尚未进入 SensD 图标库，不要用错误图标替代。

## 列规则
- 文本列左对齐；数字、计数、金额右对齐。
- 操作列固定为最后一列，超宽时配置 `fixed: "right"`。
- 需要横向滚动时配置 `scroll={{ x: 1280 }}` 或更大的业务列宽。
- 可排序列使用 antd `sorter`；一次只排序一列的交互交给 Table 自身。
- 超长文本优先使用列 `ellipsis` 或单元格内 `Typography.Paragraph`，具体几行截断由业务列定义控制。

## 操作列
- `TableActions` 平铺前 2 个操作。
- 当操作总数超过 3 个时，第 3 个起进入「更多」下拉。
- 链接默认走中性色 `colorText`，hover / active 走链接蓝 `colorLink` / `colorLinkActive`。
- 「更多」必须使用按钮体系里的下拉按钮，不手写普通 Dropdown 文案。

## 选择态
- Checkbox 本体保持 Checkbox 组件选中态。
- 选中行背景保持 `colorBgContainer`，不使用绿色选中底。

## 空状态
| `emptyState` | 场景 |
|---|---|
| `noData` | 默认无数据 |
| `noResult` | 筛选无结果 |
| `loadFailed` | 加载失败 |

空态插图来自 `src/assets/empty-state/non-page/`，通过 `EMPTY_STATE_ILLUSTRATIONS` 映射。

## Token 映射
| 视觉语义 | SensD token / handle | antd alias / 组件消费 | 状态 |
|---|---|---|---|
| 容器背景 | `white` | `colorBgContainer` | Ready |
| 外框描边 | `outline-color` | `colorBorder` | Ready |
| 信息区文字 | `text-sub-color` | `colorTextSecondary` | Ready |
| 信息区分割线 | `divider/color/light/solid` -> `divideline-color-light` | `colorBorderSecondary` / `--sens-table-info-border` | Ready |
| 表头背景 | `background-04` | `Table.headerBg` / `colorFillAlter` | Ready |
| 表头文字 | `text-color` | `Table.headerColor` / `colorText` | Ready |
| 行分割线 | `divider/color/weak/solid` -> `line-color` | `Table.borderColor` | Ready |
| 行 hover | `background-grey-hover` | `Table.rowHoverBg` / `colorFillSecondary` | Ready |
| 操作链接默认 | `text-color` | `--sens-table-link-color` / `colorText` | Ready |
| 操作链接 hover / active | `link-color` / `link-active-color` | `colorLink` / `colorLinkActive` | Ready |
| 批量操作按钮 | Button 小号二级 / 三级 token | `SensButton size="small"` | Ready，依赖 Button |
| 选中行背景 | `white` | `--sens-table-row-selected-bg` / `colorBgContainer` | Ready |
| 信息区高度 | `size/component-height/xl` | `--sens-table-info-height` | Ready |
| 单元格行高 | `size/component-height/xxxl` | `--sens-table-row-height` | Ready |
| 信息区字号 / 行高 | `font-size/s` / `line-height/s` | `--sens-table-info-font-size` / `--sens-table-info-line-height` | Ready |
| 操作字号 / 行高 | `font-size/m` / `line-height/m` | `--sens-table-link-font-size` / `--sens-table-link-line-height` | Ready |
| 空态区域尺寸 | `size/component-height/xxxl` + `spacing/2x` 推导 | `--sens-table-empty-*` | Ready，推导值 |
| 信息区右侧 setting icon | Figma `1650:7132` | SensD icon registry | To Confirm，待单独确认落库 |
| 加载 GIF | Figma 资产 | 表格 loading | Missing，暂不录入 |

## 工程落点
```text
src/ui/TableShell.tsx
src/ui/table.css
src/ui/index.ts
src/preview/pages/TableShowcasePage.tsx
src/design-system/components/base/table.md
src/design-system/components/base/table.design.md
```
