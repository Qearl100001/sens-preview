# Spacing Foundation

> 统一页面、组件、表单、表格、卡片、弹层里的间距、内边距、外边距和元素间距。<br>
> 成熟度：Stable<br>
> 实现：Implemented<br>
> 验证：Verified（2026-07-24：`/basic-styles/spacing` 设计说明与数值样张）
> 来源：`/Users/liyuwen/Desktop/Sens.Design_间距_v0.4_220505.pdf`、`tokens.resolved.json`。<br>
> 预览：`/basic-styles/spacing`

## 1. 定位

Spacing 负责统一页面、组件、表单、表格、卡片、弹层里的间距、内边距、外边距和元素间距。

组件和页面不应该散落硬写 `gap: 13px`、`padding: 17px` 这类不可解释数值，而应该引用 spacing token、size token、组件公式，或由组件封装统一消费。

## 2. 基础 Scale

当前 `tokens.resolved.json` 已有的 spacing scale：

| token | 值 |
|---|---:|
| `spacing/none` | 0 |
| `spacing/0.5x` | 2 |
| `spacing/1x` | 4 |
| `spacing/1.5x` | 6 |
| `spacing/2x` | 8 |
| `spacing/2.5x` | 10 |
| `spacing/3x` | 12 |
| `spacing/4x` | 16 |
| `spacing/5x` | 20 |
| `spacing/6x` | 24 |
| `spacing/7x` | 28 |
| `spacing/8x` | 32 |
| `spacing/10x` | 40 |

当前 `tokens.resolved.json` 已有水平 / 垂直 spacing：

| 类型 | token 范围 | 说明 |
|---|---|---|
| 水平间距 | `spacing/horizontal/*` | 用于左右 padding、横向 gap、图标与文字间距 |
| 垂直间距 | `spacing/vertical/*` | 用于上下 padding、纵向 gap、区块间距 |

代码中 `2.5x` 的 key 使用特殊半角点字符，例如 `spacing/2․5x`。文档书写可用普通 `2.5x`，代码实现时必须以 JSON key 为准。

Spacing 预览页已补：`/basic-styles/spacing` 当前用于展示基础 scale、水平 / 垂直 spacing、spacing 与 size 边界、常用场景和 TikTok case 使用对照；它是验收样张，不代表真实组件已全部接入 spacing token / helper。

## 3. Spacing 与 Size 的边界

Spacing 不负责所有尺寸。

| 类型 | 来源 | 用途 |
|---|---|---|
| spacing | `spacing/*` | padding、margin、gap、元素间距 |
| size | `size/*` | 图标底板、点状徽标、固定尺寸容器 |
| component height | `size/component-height/*` | 输入框、按钮、表格信息区等组件高度 |
| formula | 组件规则 | 垂直居中、行高推导、边框抵消等计算值 |

公式型值必须说明来源，例如垂直居中、行高推导、边框抵消，不应直接提升成全局 spacing token。

## 4. 常用场景

| 场景 | token / 规则 | 值 | 说明 |
|---|---|---:|---|
| 图标与文字间距 | `spacing/1x` | 4 | 输入、选择器、搜索、菜单等常见组合 |
| 紧凑控件内距 | `spacing/2x` / `spacing/2.5x` | 8 / 10 | 小尺寸或紧凑状态 |
| 输入类组件水平内距 | `spacing/horizontal/3x` | 12 | Input / Select 等基础组件常用 |
| 卡片 / 区块常规内距 | `spacing/4x` | 16 | 卡片、信息区、内容块候选 |
| 页面内容左右内距 | `spacing/6x` | 24 | 页面主内容区 |
| 页面级空态插画→文案 | `spacing/8x` / `spacing/vertical/8x` | 32 | 页面级 Empty State 等大内容块内间距 |
| 表格信息区高度 | `size/component-height/xl` 或组件规格 | 40 | 作为表格组件规格，不作为普通 spacing |
| 大区块间距 | `spacing/10x` | 40 | 大模块之间的纵向距离 |

## 5. 代码落地规则

- 所有组件和业务页面的间距规则必须绑定 Spacing Foundation，不允许长期硬写 padding / margin / gap。
- 缺少 spacing token 时，可以补充 token / helper / 组件语义规则，但不能在组件里直接硬写一个新值绕过去。
- antd token 只能作为实现承接层：只有当 antd spacing token 已明确映射到 SensD spacing 规则时，组件才可以通过 antd token 消费。
- spacing 和 size 不混用：高度、宽度、图标尺寸优先走 `size/*`、`size/component-height/*` 或组件规格。
- 公式型值必须在组件文档或代码注释里说明来源，不能伪装成全局 token。
- 组件实现需要报告间距来自哪个 spacing token / size token / helper / foundation 规则。

## 6. TikTok Case 使用规则

- 页面内容区左右 padding：优先 `spacing/6x`，即 24px。
- 数据源卡片列表 gap：优先 `spacing/4x`，即 16px。
- 数据源卡片内 padding：候选 `spacing/4x`，后续 DataSourceCard / Card 阶段确认。
- 表格信息区高度：40px，作为表格组件规格，不直接当作普通 spacing。
- 表格单元格 padding 和行高：进入 TableShell / Table 组件阶段单独确认。
- 抽屉 body / footer padding：映射 SensD `spacing/4x`（上 16）+ `spacing/6x`（左右下 24）；**禁止**依赖 antd `paddingLG`。规则以 `components/base/drawer.md` 为准。
- 表单项间距、label 与控件关系、错误提示距离：以 `components/base/form.md` 为唯一展开维护源；本篇只引用，不重复定义。

## 7. 当前问题与处理策略

| 问题 | 当前处理 | 建议时机 |
|---|---|---|
| 代码里存在硬写 padding / gap / margin | 按组件清单化收敛，不做全仓批量替换 | 组件维护时 |
| antd spacing token 未完全映射 SensD | 先记录规则，不手改生成文件 | 做 spacing helper / 组件 helper 时处理 |
| 表格有 11px / 6px 这类公式值 | 暂不升为全局 token | Table 组件阶段 |
| 表格单元格 padding 文档与实现待核对 | 不作为 Spacing Foundation v0.9 阻塞项 | Table 组件收口 |
| 间距 PDF 还没逐页结构化 | 先补核心规则 | 后续按模块细化 |

## 8. 单组件间距验收

后续每个组件进入实现或调整时，必须报告：

- 是否新增硬编码 padding / margin / gap。
- 间距来自哪个 spacing token。
- 尺寸来自哪个 size token 或组件规格。
- 是否使用 antd spacing token；如果使用，说明它映射到哪条 SensD 规则。
- 是否存在公式型值；如果存在，说明计算来源。
- 如果某个间距暂时不能 token 化，必须说明原因并暂停确认。

## 9. v0.9 边界与后续

- Spacing 预览页展示基础 scale、水平 / 垂直 spacing、spacing 与 size 边界和典型公式值提醒。
- 表单专属间距由 `components/base/form.md` 维护；卡片、Table、Drawer 等专属间距由对应组件规则维护。
- v0.9 不新增 `page.padding`、`card.padding`、`form.itemGap` 等 semantic spacing token。
- v0.9 不做全仓 padding / margin / gap 批量替换；组件进入维护时按本篇与 `conventions.md` 逐项收敛。
- 间距 PDF 的逐页结构化、Table 单元格 padding 作为后续组件阶段任务。抽屉 body padding 已收口，见 `components/base/drawer.md`。
