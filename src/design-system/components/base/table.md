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
- `TableShell`、`LinkButton` 与表格适配 CSS 不读取 `theme.useToken()` 或 `token.color*`。颜色、尺寸、圆角和分割线全部直接读取 SensD helper；antd `Table` 仅承担 DOM 与排序、选择、滚动等交互能力。
- 生成文件 `tokens.resolved.json`、`theme.ts` 只能由 token 构建链路生成，不能手改。

## 组件边界
| 内容 | 是否由基础表格负责 |
|---|---|
| 表格信息区 | 是 |
| 表头、表体、选择列、固定列、排序 | 是 |
| 空状态、加载态 | 是 |
| 分页器 | 否，使用 `SensPagination` 独立组合 |
| 筛选区 | 否，属于「筛选表格」复合组件 |
| 录入型表格 | 否，属于「录入型表格」复合组件 |
| 树表格 | 否，属于「树表格」复合组件 |
| 嵌套 / 交叉表格 | 否，属于后续复合表格 |
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
| `infoActions` | 信息区批量操作，小号二级 / 三级按钮 |
| `infoExtra` | 信息区最右侧操作入口，例如列设置 icon |
| `infoContent` | 自定义信息区内容 |
| `footerBar` | 表格框内底部区域；复合表格可放分页器 |
| `showInfoBar={false}` | 隐藏信息区 |

信息区固定高度 40px，左右 padding 16px，底部分割线走 `divider/color/light/solid`。
批量操作不使用链接。常规动作默认 `secondary`，弱操作如「取消选择」使用 `tone: "tertiary"`。
刷新 icon 使用 SensD icon registry 的 `reload`；设置 icon 使用 `setting`。样张复用 `TableInfoRefreshableSummary`（文案后刷新）与 `TableInfoColumnSettingButton`（右侧 icon-only）。真实刷新请求与列设置面板不在基础表格里实现，进入后续「筛选表格」复合组件。

### 信息区场景

| 场景 | 展示 |
|---|---|
| 默认计数 | `共 n 条` |
| 筛选结果 | `已找到 n 条` |
| 批量操作 | `已找到 n 条，当页选中 n 条` + 小号二级 / 三级按钮 |
| 数据更新可刷新 | `共 n 条，数据更新于 yyyy-mm-dd hh:mm:ss` + 紧跟文案后的刷新 icon |

数据更新可刷新场景中，刷新入口是小号弱化链接按钮：默认中性色，hover / active 进入链接蓝；右侧列设置入口是 icon-only 小号弱化链接按钮，不展示“设置”文案。

### 表格框内底栏

`footerBar` 用于复合表格把分页器放进表格框内。底栏高度 56px，左右 padding 16px，左侧页码范围始终靠左，右侧 `SensPagination` 始终靠右；基础表格本身仍保持 `pagination={false}`，分页逻辑由复合表格组合。
当表格存在 `footerBar` 时，最后一行单元格底线不再绘制，避免与 footer 顶部分割线叠加成粗线。

## 列规则
- 文本列左对齐；数字、计数、金额右对齐。
- 操作列固定为最后一列，超宽时配置 `fixed: "right"`。
- 需要横向滚动时配置 `scroll={{ x: 1280 }}` 或更大的业务列宽。
- 简单排序使用 `sorter` + `sortDirections={["ascend", "descend", null]}`：默认 -> 升序 -> 降序 -> 默认；排序标题 hover 提示「点击排序」。
- 超过三种排序方式时使用「复杂排序」下拉菜单，菜单必须展示当前排序与可执行动作。当前未抽通用 API，按业务字段能力确认后再进入复合组件。
- 超长文本使用 `TableEllipsis`，hover 复用 Tooltip 展示完整内容；需要两行截断时由业务列渲染器定义。
- 单元格可复用文本、链接下钻、用户下钻、状态、行内编辑、Tag 等基础组件；表格不内置业务字段逻辑。
- 状态单元格优先复用 Tag / 状态分类；当前 `StatusBadge` 是旧组件，仍需纳入全组件 SensD token 审计，不在基础表格内私自定义状态色。

## 操作列
- 第一列可下钻主属性使用 `<LinkButton tone="weak" />`：默认中性文字，hover / active 进入链接蓝。
- `TableActions` 平铺前 2 个操作，使用常规蓝色 `<LinkButton tone="link" />`。
- 当操作总数超过 3 个时，第 3 个起进入「更多」下拉。
- 链接默认走中性色 `colorText`，hover / active 走链接蓝 `colorLink` / `colorLinkActive`。
- 「更多」必须使用按钮体系里的下拉按钮，不手写普通 Dropdown 文案。

## 选择态
- Checkbox 本体保持 Checkbox 组件选中态。
- 选中行背景保持 `white`，不使用绿色选中底。

## 空状态
| `emptyState` | 场景 |
|---|---|
| `noData` | 默认无数据 |
| `noResult` | 筛选无结果 |
| `loadFailed` | 加载失败 |

空态消费 `<SensEmptyState scope="non-page" size="base" />`；`emptyState` 映射 `noData` / `noResult` / `loadFailed`。表格壳保留区域 `padding` / `min-height`，插画与字阶由 Empty State Foundation 承接。

自定义 `emptyDescription` 时作为标题单行展示（兼容旧 API）；`emptyAction` 进入 `actions` 槽。

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
| 行分割线 | `divider/color/weak/solid` -> `line-color` | `--sens-table-row-border` | Ready |
| 行 hover | `background-grey-hover` | `--sens-table-row-hover-bg` | Ready |
| 排序图标 | `icon-color-transparent` / `link-color` | `--sens-table-sorter-*` | Ready |
| 下钻弱链接默认 / hover / active | `text-color` / `link-color` / `link-active-color` | `LinkButton tone="weak"` | Ready |
| 操作链接默认 / hover / active | `link-color` / `link-hover-color` / `link-active-color` | `LinkButton tone="link"` | Ready |
| 批量操作按钮 | Button 小号二级 / 三级 token | `SensButton size="small"` | Ready，依赖 Button |
| 选中行背景 | `white` | `--sens-table-row-selected-bg` | Ready |
| 信息区高度 | `size/component-height/xl` | `--sens-table-info-height` | Ready |
| 单元格行高 | `size/component-height/xxxl` | `--sens-table-row-height` | Ready |
| 信息区字号 / 行高 | `font-size/s` / `line-height/s` | `--sens-table-info-font-size` / `--sens-table-info-line-height` | Ready |
| 操作字号 / 行高 | `font-size/m` / `line-height/m` | `--sens-table-link-font-size` / `--sens-table-link-line-height` | Ready |
| 空态区域 | `SensEmptyState` non-page base + 壳 `padding` / `min-height` | `.sens-table-empty` | Ready |
| 信息区刷新 icon | Figma `803:278` | `SensIcon name="reload"` | Ready |
| 信息区右侧 setting icon | Figma `1650:7139` | `SensIcon name="setting"` | Ready |
| 加载 GIF | Figma 资产 | 表格 loading | Missing，暂不录入 |

## 后续复合表格
- 筛选表格：筛选区、表格信息区、表格、分页器、批量操作、列设置入口和复杂排序。
- 录入型表格：行内输入、校验、新增、删除和滚动承接。
- 树表格：层级展开、缩进、父子关系和树节点状态。
- 嵌套 / 交叉表格：复杂数据关系与横纵交叉阅读。

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
