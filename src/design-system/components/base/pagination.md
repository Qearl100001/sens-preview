# 设计系统 skill · 基础组件：分页器 Pagination

> 给 agent 还原分页器时读的规则。分页器是独立基础组件，不写进 `TableShell` 内部；复合表格按场景组合。

## 黑盒约定
- 分页器规则统一收口到 `src/ui/SensPagination`；antd 只作为局部底层能力，不作为规则来源。
- 常规模式默认展示总数范围、每页条数和跳页。
- 简版模式使用 `simple`，默认隐藏总数范围、每页条数和跳页；视觉由 SensD 自定义组合承接，不复用 antd `simple` 默认视觉。
- 颜色、字号、圆角、输入框和选择器状态必须追溯到 SensD design token；antd Pagination token 只是底层消费层。
- 每页条数选择器和跳页输入必须复用 SensD Select / Input，不直接暴露 antd 默认控件。
- 分页器组件自身不负责整体靠右或占满容器；靠左、靠右、横向滚动由外层布局或复合组件决定。

## API 使用
```tsx
<SensPagination
  current={page}
  pageSize={pageSize}
  total={1000}
  onChange={(nextPage, nextPageSize) => {
    setPage(nextPage);
    setPageSize(nextPageSize);
  }}
/>
```

简约型：

```tsx
<SensPagination simple current={3} pageSize={20} total={1000} />
```

## Props 约定
| Prop | 默认 | 说明 |
|---|---|---|
| `showTotal` | `本页显示第 n-m 条` | 简版下默认隐藏 |
| `showSizeChanger` | 常规 true / 简版 false | 每页条数 |
| `showQuickJumper` | 常规 true / 简版 false | 跳页 |
| `pageSizeOptions` | `10 / 20 / 50 / 100` | 每页条数选项 |

## 常规场景
| 场景 | 页码规则 | 数量控制 | 快速跳转 |
|---|---|---|---|
| 总页数 ≤ 10 / 无数量控制 | 单屏范围内显示全部页码 | 不展示 | 一般不提供 |
| 总页数 ≤ 10 / 有数量控制 | 单屏范围内显示全部页码 | 展示 | 一般不提供 |
| 总页数 > 10 / 无数量控制 | 使用折叠页码 | 不展示 | 建议提供 |
| 总页数 > 10 / 有数量控制 | 使用折叠页码 | 展示 | 建议提供 |

## 行为规则
- 点击页码后更新当前页。
- 上一页 / 下一页在边界页禁用。
- 上一页 / 下一页使用 SensD `chevron-left` / `chevron-right` 图标；默认颜色为 `icon-color-transparent`，禁用态走 icon disable，不混用页码文字色。
- 分页器不支持折行展示；可视宽度不足时由外层容器承接横向溢出，分页器内部不换行。
- 分页器默认自适应内容宽度，不写死 `width: 100%`，不在组件内部做整体靠右。
- 分页器内部相邻控件间距固定为 `spacing/horizontal/2x`（8px）。
- 简约型结构为「上一页 icon + 小输入框 + / 总页数 + 下一页 icon」；前后 icon 无外框、无按钮底，输入框使用 SensD `Input size="small"`。
- 总页数 ≤ 10 时单屏范围内显示全部页码，不出现 `more` / 折叠页码。
- 总页数 > 10 时使用折叠页码。
- 折叠页码遵循 antd 行为，向前或向后跳 5 页。
- 折叠页码默认显示 `more` 中性图标；hover 时切换为 `double-chevron-left` / `double-chevron-right`，颜色走固定 `link-color`，不跟 Functional Skin 换肤。
- 折叠页码 hover 箭头必须显示 Tooltip，文案为「向前 5 页」/「向后 5 页」；关闭 Pagination 原生 `title`，避免双提示。
- 上一页 / 下一页 hover 显示 Tooltip：「上一页」/「下一页」；禁用 hover 显示「当前已在首页」/「当前已在尾页」。
- 每页条数选择器 hover 显示 Tooltip：「切换每页条数」。
- 跳页输入 hover 显示 Tooltip：「输入要跳转的页码」。
- 每页条数选择器使用 SensD Select 触发框与 `SensSelectDropdown` 浮层 token；只展示页数选项，不展示搜索输入。
- 每页条数选择器默认自适应内容宽度；不要给分页器内选择器固定宽度。
- 跳页输入使用 SensD Input；输入合法页码后跳转，非法输入清空。
- 每页条数改变后的页码重置策略由业务状态管理决定。

## 与表格组合
```tsx
<TableShell pagination={false} {...tableProps} />
<SensPagination {...paginationProps} />
```

- 不使用 antd Table 内置 `pagination` 作为设计系统默认组合。
- `筛选表格` 后续会固定组合：筛选区 + `TableShell` + `SensPagination`。
- `录入型表格`、`树表格` 默认不组合分页器。

## Token 映射
| 视觉语义 | SensD token / handle | antd alias / 组件消费 | 状态 |
|---|---|---|---|
| 页码背景 | `white` | `--sens-pagination-item-bg` | Ready |
| 页码文字 | `text-color-transparent` @90% | `--sens-pagination-text-color` | Ready |
| 页码默认描边 | `divider/color/deep/transparent` -> `divideline-color-transparent-dack` @16% | `--sens-pagination-item-border` | Ready |
| 总数 / 范围文字 | `text-color-transparent` @90% | `--sens-pagination-range-text-color` | Ready |
| 页码 hover | `white` + `component-primary` + `shadow/D3/down` | `--sens-pagination-item-hover-*` | Ready |
| 页码点击 | `white` + `component-active` + `shadow/active-ring/functional` | `--sens-pagination-item-pressed-*` | Ready |
| 上一页 / 下一页按钮 | 同页码默认 / hover / 点击 / 禁用状态 token | `prevIcon` / `nextIcon` 外层按钮 | Ready |
| 上一页 / 下一页图标 | `chevron-left` / `chevron-right` + `icon-color-transparent` | SensD icon registry / `--sens-pagination-arrow-icon-color` | Ready |
| 上一页 / 下一页禁用图标 | `icon-color-transparent-disable` / `icon-color-transparent-disable-hover` | `--sens-pagination-arrow-icon-disabled-*` | Ready |
| 折叠页码默认图标 | `more` + `icon-color-transparent` | `jumpPrevIcon` / `jumpNextIcon` 默认态 | Ready |
| 折叠页码 hover 图标 | `double-chevron-left` / `double-chevron-right` + `link-color` | hover 后向前 / 向后跳 5 页；固定状态色，不换肤 | Ready |
| 当前页选中 | `component-primary` + `white` + `divider/color/light/transparent` | `--sens-pagination-item-selected-*` | Ready |
| 当前页选中 hover | `component-hover` + `white` + `divider/color/light/transparent` | `--sens-pagination-item-selected-hover-bg` | Ready |
| 禁用 | `background-transparent-grey-hover` @6% + `text-color-transparent-disable` @30% + `divider/color/light/transparent` | disabled page item | Ready |
| 禁用 hover | `background-transparent-grey` @4% + `text-color-transparent-disable-hover` @24% + `divider/color/weak/transparent` | disabled page item hover | Ready |
| 输入聚焦 | `component-active` / `component-active-shadow` | `--sens-pagination-input-focus-*` | Ready |
| 通用描边 | `outline-color` | `--sens-pagination-border-color` | Ready |
| 常规页码尺寸 | `size/component-height/m` | `--sens-pagination-item-size` | Ready |
| 小号页码尺寸 | `size/component-height/s` | `--sens-pagination-item-size-sm` | Ready |
| 圆角 | `radius/m` | `borderRadius` / `--sens-pagination-item-radius` | Ready |
| 控件间距 | `spacing/horizontal/2x` | 页码、翻页、选择器、跳页输入之间的 8px 间距 | Ready |
| 字号 / 行高 | `font-size/m` / `line-height/m` | `--sens-pagination-font-size` / `--sens-pagination-line-height` | Ready |
| 简约型前后 icon | `chevron-left` / `chevron-right` + `icon-color-transparent` | `.sens-pagination-simple-arrow`，无外框 | Ready |
| 简约型输入框 | Input 小号组件 | `SensInput size="small"` | Ready，依赖 Input |
| 每页条数选择器触发框 | Select 基础组件 token | `Pagination` size changer 注入 `sens-select-trigger` | Ready，依赖 Select |
| 每页条数下拉菜单 | Dropdown Menu / `SensSelectDropdown` token | `Pagination` size changer popup 注入 `sens-select-dropdown` | Ready，依赖 Dropdown Menu |
| 跳页输入框 | Input 基础组件 token | `Pagination` quick jumper | Ready，依赖 Input |
| 悬停提示 | Tooltip 基础组件 token | 翻页按钮、折叠页码、选择器、跳页输入提示 | Ready，依赖 Tooltip |
| 状态矩阵辅助说明 | `text-sub-color-transparent` @58% | 预览页说明文案，不属于分页器本体 | Ready |

## 后续记录
- 文案 token：Figma 变量中已有分页器文案（上一页、下一页、向前 5 页、切换每页条数等），当前组件仍用中文常量；等多组件文案策略统一后接入，不在本轮单点改造。
- 派生尺寸：快速跳页输入与简约型输入宽度当前由页码高度 token 推导（如 `item-size * 2`）；如果该宽度在多个组件复用或 Figma 给出明确变量名，再提升为独立 design token。

## 工程落点
```text
src/ui/SensPagination.tsx
src/ui/pagination.css
src/ui/index.ts
src/preview/pages/TableShowcasePage.tsx
src/design-system/components/base/pagination.md
src/design-system/components/base/pagination.design.md
```
