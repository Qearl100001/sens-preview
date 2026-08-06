# Radius Foundation

> 控件、容器、卡片、胶囊与圆形按钮的圆角语义规则源。
> 成熟度：Pilot
> 实现：Partial
> 验证：Pending
> 来源：`tokens/source/figma/unit.json`、`tokens.resolved.json`、`theme.ts`
> 预览：`/basic-styles/radius`

## 1. 定位

Radius 负责统一基础控件、卡片、表格外边缘、大页面外圆角、抽屉、胶囊、圆形按钮等场景里的圆角语义。

后续页面和组件不应该散落硬写 `borderRadius: 6`、`border-radius: 10px` 这类值，而应该引用 radius token、antd token，或由组件封装统一消费。

## 2. 基础 Scale

| token | 值 | antd 映射 | 用途 |
|---|---:|---|---|
| `radius/none` | 0 | - | 无圆角、拼接控件中间段 |
| `radius/s` | 3 | `borderRadiusSM` | 小尺寸控件 |
| `radius/m` | 4 | `borderRadius` | 常规基础组件 |
| `radius/l` | 6 | 待补 | 卡片边缘、表格外边缘、部分容器边缘 |
| `radius/xl` | 10 | 待补 | 产品壳标题栏 / 内容面板上方外角、右侧内容面板与导航衔接、大页面外圆角、抽屉外圆角 |
| `radius/circular` | 999 | 待补 | 胶囊、圆形按钮、FAB 外端 |

## 3. 使用规则

- 基础表单控件、普通按钮、输入框、选择器、下拉菜单默认使用 `radius/m`。
- 小尺寸控件可使用 `radius/s`，但需要由组件尺寸规则决定，不能业务页面自行判断。
- 表格外层容器使用 `radius/l`，即 6px。
- 卡片边缘当前记录为 `radius/l`，具体卡片规则等 Card 组件阶段补充。
- 产品壳标题栏所在内容面板的左右上角、右侧内容面板与导航衔接处、大页面外圆角和抽屉外圆角使用 `radius/xl`，即 10px；顶部导航本体保持直角。
- 胶囊标签、圆形图标按钮、FAB 使用 `radius/circular`。
- 拼接控件、组合按钮、搜索组合等中间连接处使用 `radius/none`，只保留外端圆角。
- 页面和组件不得新增游离圆角值，例如 2、5、8、12，除非先记录来源并确认进入 token 或组件专属规则。

## 4. 关键场景

| 场景 | 圆角 | token | 说明 |
|---|---:|---|---|
| 常规基础组件 | 4 | `radius/m` | Button、Input、Select、Dropdown 等默认圆角 |
| 小尺寸控件 | 3 | `radius/s` | 小尺寸输入、紧凑组件，由组件尺寸规则决定 |
| 表格外边缘 | 6 | `radius/l` | 表格外层容器圆角，尤其是表格承载在页面内容区时 |
| 卡片边缘 | 6 | `radius/l` | 卡片规则后续单独补充，这里只记录基础圆角来源 |
| 产品壳标题栏与内容面板 | 10 | `radius/xl` | 无侧导页面的标题栏内容面板左右上角；右侧内容面板与导航衔接处的外角 |
| 大页面外圆角 | 10 | `radius/xl` | 整页外层容器等场景 |
| 抽屉外圆角 | 10 | `radius/xl` | 详细规则等 Drawer 组件阶段补充 |
| 胶囊 / 圆形按钮 | 999 | `radius/circular` | FAB、胶囊、圆形图标按钮 |

## 5. TikTok Case 使用规则

- 数据源入口卡片：暂按卡片边缘规则记录，候选 `radius/l`；详细规则等 DataSourceCard / Card 组件阶段确认。
- 表格外层容器：使用 `radius/l`，即 6px。
- 页面白色内容容器：如与产品壳导航衔接，使用 `radius/xl`，即 10px。
- 创建连接抽屉：候选 `radius/xl`，详细规则等 Drawer 组件阶段确认。
- logo 容器：如为方形图标底板，默认使用 `radius/m`；如原始 logo 为圆形，不强行改成圆角方形。

## 6. 代码落地规则

- `tokens.resolved.json` 是生成物，不能直接手改。
- `theme.ts` 是生成物，不能直接手改。
- 组件的圆角规则来源必须是 SensD Foundation，不以 antd 的 `SM` / `LG` 推导作为规则来源。
- antd token 只能作为实现承接层：只有当 `borderRadius` / `borderRadiusSM` 已经明确映射到 SensD token 时，组件才可以通过 antd token 消费。
- 非 antd 场景优先通过统一 radius helper 或 `u["radius/*"]` 消费。
- 后续应补一个统一 radius helper，避免每个组件各自读取 `tokens.resolved.json`。
- 如果组件需要 6 或 10，但 antd theme 暂无直接映射，应记录为 token helper / component token 缺口，而不是业务侧硬写。

## 7. 单组件圆角验收

后续每个组件进入实现或调整时，必须报告：

- 是否新增硬编码 `borderRadius` / `border-radius`。
- 圆角来自哪个 token。
- 是否使用 antd token。
- 是否存在拼接场景，拼接边是否正确归零。
- 是否出现未收敛的 2、5、8、12 等游离值。
- 如果使用 `50%`，说明它是圆形点 / 圆形头像 / 原始图形需要，还是应该改为 `radius/circular`。

## 8. 当前问题与处理策略

| 问题 | 当前处理 | 建议时机 |
|---|---|---|
| `radius/l`、`radius/xl` 暂未映射到 antd theme | 先记录，不手改生成文件 | 做 Card / Drawer / Modal 前补方案 |
| 表格外圆角需要确认是否已经使用 `radius/l` | 本轮先检查，确认后再改代码 | TableShell / 表格组件阶段 |
| 组件还没有统一绑定 radius foundation | 今天 foundation 录入完成后统一检查 | Foundation 收尾检查 |
| 代码里仍有散落圆角硬写 | 不在 foundation 阶段批量改 | 进入对应组件时逐个验收 |
| `50%` 与 `radius/circular` 边界未完全统一 | 先保留真实圆形点场景 | 做 Badge / Status / Icon 组件时确认 |
| TikTok 页面容器是否使用大页面外圆角 | 需要结合截图和页面结构确认 | 做 DataSource 页面验收时确认 |

## 9. 待补

| 项 | 状态 | 说明 |
|---|---|---|
| Drawer / Modal / Popover / EntryCard / TableShell 圆角语义 | 🔶 部分 | 已定：Drawer=`xl`；TableShell=`l`；EntryCard/Card=`l`（`card.md` §4.3）。**待补**：Modal / Popover 组件文档 |
| 散落圆角替换为 token | 🔶 进行中 | 本轮已收非零硬写：Breadcrumb `:focus-visible` 2→`radius/s`；Badge 样张 title/body 6/8→`radius/l`；EvalBadges pill/chip 10/4→`xl`/`m`。仍允许拼接 `0`（=`none`）与真圆 `50%`（§8）。其余随组件验收继续清 |
