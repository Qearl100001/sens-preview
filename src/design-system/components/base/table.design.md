# 表格 Table · 设计规范（给设计师）

> 基础组件层。表格只管理「表格信息区 + 表体 + 表格自身状态」，不包含页面标题、筛选区、分页器、右侧锚点或业务提交按钮。

## 组件定位
- **表格 Table**：承载结构化数据的基础展示组件。
- **表格信息区**：表格内部的 40px 信息栏，和表体一起归入基础表格。
- **不在本组件内**：筛选区、分页器、录入型表格、树表格、业务样板间。

## 结构
| 区块 | 是否属于基础表格 | 说明 |
|---|---|---|
| 表格信息区 | 是 | 默认计数、筛选计数、当页选中与批量操作 |
| 表头 | 是 | 列标题、排序、选择列、固定列 |
| 表体 | 是 | 文本、数字、状态、操作等单元格 |
| 空状态 / 加载 | 是 | 表格自身的数据状态 |
| 分页器 | 否 | 独立基础组件，由复合表格组合 |
| 筛选区 | 否 | 属于「筛选表格」复合组件 |
| 录入型表格 | 否 | 属于「录入型表格」复合组件 |
| 树表格 | 否 | 属于「树表格」复合组件 |
| 嵌套 / 交叉表格 | 否 | 属于后续复合表格 |

## 表格信息区
| 场景 | 文案 |
|---|---|
| 默认 | 共 n 条 |
| 筛选后 | 已找到 n 条 |
| 批量选择 | 共 n 条，当页选中 n 条 |
| 筛选 + 批量选择 | 已找到 n 条，当页选中 n 条 |

- 高度固定 40px。
- 批量操作放在信息区右侧，不单独漂浮。
- 批量选择口径是「当页选中」，不是全量选中。
- 批量操作使用按钮，不使用链接。常规批量动作使用小号二级按钮，弱操作如「取消选择」使用小号三级按钮。
- 信息区最右侧可放一个独立操作入口，例如刷新或列设置 icon；刷新使用 `reload`，设置使用 `setting`。
- 数据刷新入口与设置入口同属信息区右侧能力；真实数据请求和列配置面板进入复合表格。

## 列与单元格
| 类型 | 对齐 | 说明 |
|---|---|---|
| 文本 | 左对齐 | 超长内容截断并提供 hover 查看 |
| 数字 / 计数 | 右对齐 | 用于数量、比例、金额等可比较信息 |
| 状态 | 左对齐 | 状态点 + 文案，颜色按语义 |
| 操作 | 左对齐 | 常规蓝色链接按钮，固定为最后一列 |

- 简单排序固定为三态循环：默认、升序、降序、默认；hover 显示排序提示。
- 多于三种排序方式时使用复杂排序菜单，必须保留当前排序信息；该能力待业务字段规则稳定后进入复合组件。
- 可下钻主属性默认中性文字，hover / active 进入链接蓝；操作列默认即为蓝色链接按钮。
- 文本过长使用 `TableEllipsis` 省略并在 hover 通过 Tooltip 展示完整内容；行内编辑、用户下钻、状态和 Tag 作为单元格组合使用，不新增表格专属业务组件。
- `StatusBadge` 目前作为旧组件出现在表格示例里，后续需要纳入全组件 SensD token 审计；表格文档只定义状态单元格可复用 Tag / 状态分类。

## 操作列
- 操作 1-3 个时平铺展示。
- 操作超过 3 个时，第 3 个起收进「更多」。
- 「更多」使用按钮体系里的下拉按钮，不手写普通链接或普通 Dropdown 文案。
- 操作文案以动词为主，如「查看 / 编辑 / 删除」。
- 表格超宽时，操作列固定在右侧。

## 选择态
- 复选框本体按 Checkbox 组件选中态展示。
- 行被选中后，行背景保持白色，不使用绿色选中底。

## 滚动与固定
- 表格内容小于 1280px 时按容器展示。
- 表格内容超过可视宽度时使用表格内部横向滚动。
- 需要横向滚动的管理类表格，建议固定首列或主属性列，并固定右侧操作列。
- 表头吸顶属于表格能力，但是否启用取决于具体页面高度。

## 空状态与加载
- 数据为空、筛选无结果、加载失败必须使用 SensD 非页面级空态插图。
- 加载态使用表格自身 loading，不替换为页面级加载。
- Figma 精确加载 GIF 尚未入库，当前先使用组件 loading 状态。

## Token 映射状态
| 视觉项 | SensD token / handle | 组件消费 | 状态 |
|---|---|---|---|
| 表格容器背景 | `white` | `TableShell` 容器背景 | Ready |
| 容器描边 | `divider/color/outline/solid` -> `outline-color` | `TableShell` 容器描边 | Ready |
| 容器圆角 | `radius/l` | `TableShell` 容器圆角 | Ready |
| 信息区文字 | `text-sub-color` | 信息区文案 | Ready |
| 信息区分割线 | `divider/color/light/solid` -> `divideline-color-light` | 信息区底部分割线 | Ready |
| 表头背景 | `background-04` | 表头背景 | Ready |
| 表头文字 | `text-color` | 表头文字 | Ready |
| 行分割线 | `divider/color/weak/solid` -> `line-color` | 表体分割线 | Ready |
| 行 hover | `background-grey-hover` | 表体 hover | Ready |
| 排序图标 | `icon-color-transparent` / `link-color` | 默认 / 当前排序 | Ready |
| 下钻弱链接默认 / hover / active | `text-color` / `link-color` / `link-active-color` | `LinkButton tone="weak"` | Ready |
| 操作链接默认 / hover / active | `link-color` / `link-hover-color` / `link-active-color` | `LinkButton tone="link"` | Ready |
| 批量操作按钮 | Button 小号二级 / 三级 token | `SensButton size="small"` | Ready，依赖 Button |
| 选中行背景 | `white` | 选中行覆盖 | Ready |
| 信息区高度 | `size/component-height/xl` | 信息区高度 | Ready |
| 表格行高 | `size/component-height/xxxl` | 表头 / 表体单元格高度 | Ready |
| 信息区字号 / 行高 | `font-size/s` / `line-height/s` | 信息区文案 | Ready |
| 表格操作字号 / 行高 | `font-size/m` / `line-height/m` | 操作列链接 | Ready |
| 空态区域尺寸 | `size/component-height/xxxl` + `spacing/2x` 推导 | 表格空态容器 / 插图尺寸 | Ready，推导值 |
| 信息区刷新 icon | Figma `803:278` | `SensIcon name="reload"` | Ready |
| 信息区右侧 setting icon | Figma `1650:7139` | `SensIcon name="setting"` | Ready |
| 加载 GIF | Figma 资产 | 表格 loading | Missing，暂不录入 |

---
*实现方式、props 与代码落点见研发文档 `table.md`。*
