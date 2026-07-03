# Shadow Foundation

> 主要来源：Figma `Sens.Design 投影 v2.1 20230313`、`src/design-system/color-utils.ts`、`src/design-system/theme.ts`、输入框激活态 Figma 示例。  
> 当前状态：规则确认中；本文件先作为 foundation 文档，不直接等同于所有组件已完成 token 映射。

## 1. 定位

Shadow 负责统一组件状态反馈、浮层、卡片层级、抽屉、表格内部线等场景里的投影语义。

组件和页面不应该直接硬写 `box-shadow` 或 `rgba(...)`。需要投影时，必须先判断它属于哪一类 shadow，再通过 shadow helper、color helper 或组件封装消费。

## 2. Shadow 类型

| 类型 | 用途 | 示例 |
|---|---|---|
| active ring | 控件点击 / 聚焦外环 | Input / Select / Search 激活态 |
| action shadow | 动作反馈 | Button hover、触发型搜索按钮 hover |
| floating shadow | 浮层 / 悬浮操作 | FAB、Dropdown、Popover |
| elevation shadow | 容器层级 | 卡片、页面外层容器、抽屉 |
| inset shadow | 内部分割 / 边界强调 | 表格信息区底部分割线 |

这些类型不能混用。按钮 hover 的 D3 不应直接当作卡片层级；active ring 也不应当作容器投影。

## 3. 基础 Shadow Scale

Shadow scale 由两个维度组成：

- 层级：D1 / D2 / D3 / D4
- 方向：下 / 上 / 左 / 右

当前代码里的 `buildShadow(level, direction)` 已覆盖 D1 / D2 / D3 / D4 与下 / 上 / 左 / 右四方向；`buildShadowD1()`、`buildShadowD2()`、`buildShadowD3()`、`buildShadowD4()` 保留为默认下方向的便捷入口。

## 4. D1-D4 参数

| 层级 | 第一层 | 第二层 | 说明 |
|---|---|---|---|
| D1 | `#0B0C0D` 20%, blur 1, spread 0 | `#0B0C0D` 10%, blur 2, spread 0 | 低层级选中 / 轻微浮起 |
| D2 | `#0B0C0D` 8%, blur 4, spread 0 | `#0B0C0D` 4%, blur 8, spread 0 | 中低层级容器 / 轻量浮层 |
| D3 | `#0B0C0D` 10%, blur 6, spread 0 | `#0B0C0D` 4%, blur 12, spread 0 | Button hover、轻量动作反馈 |
| D4 | `#0B0C0D` 10%, blur 12, spread 0 | `#0B0C0D` 8%, blur 20, spread 0 | FAB、Dropdown、Popover 等浮层 |

## 5. D1-D4 方向规则

| 层级 | 方向 | 第一层偏移 | 第二层偏移 |
|---|---|---|---|
| D1 | 下 | `0, 0` | `0, 1` |
| D1 | 上 | `0, 0` | `0, -1` |
| D1 | 左 | `0, 0` | `-1, 0` |
| D1 | 右 | `0, 0` | `1, 0` |
| D2 | 下 | `0, 1` | `0, 2` |
| D2 | 上 | `0, -1` | `0, -2` |
| D2 | 左 | `-1, 0` | `-2, 0` |
| D2 | 右 | `1, 0` | `2, 0` |
| D3 | 下 | `0, 2` | `0, 4` |
| D3 | 上 | `0, -2` | `0, -4` |
| D3 | 左 | `-2, 0` | `-4, 0` |
| D3 | 右 | `2, 0` | `4, 0` |
| D4 | 下 | `0, 2` | `0, 4` |
| D4 | 上 | `0, -2` | `0, -4` |
| D4 | 左 | `-2, 0` | `-4, 0` |
| D4 | 右 | `2, 0` | `4, 0` |

## 6. 控件 Active Ring

| 语义 | shadow | token 来源 | 用途 |
|---|---|---|---|
| 控件 / 点击 / 功能 | `0 0 0 2px rgba(0, 178, 128, 0.20)` | `component-active-shadow @20%` | Input / Select / Search 等激活态，可换肤 |
| 控件 / 点击 / 警告 | `0 0 0 2px rgba(229, 69, 69, 0.20)` | `warning-color-active-shadow @20%` | 警告 / 错误状态激活态 |

## 7. 组件语义 Shadow

部分组件有明确的语义投影，不能强行套用 D1-D4 的通用方向版。

| 语义 | shadow token | 参数 | 来源 | 用途 |
|---|---|---|---|---|
| 右侧 Drawer | `shadow/drawer/right` | `-4px 0 20px rgba(11, 12, 13, 0.08)` + `-2px 0 12px rgba(11, 12, 13, 0.10)` | Figma 抽屉组件 `2219:10662` | 右侧抽屉外层侧向投影 |

Drawer 侧向投影已进入 `tokens/source/foundations/shadow.json` 的 `semantic.drawer.right`，生成后通过 `tokens.resolved.json` 的 `shadow["drawer/right"]` 消费。

## 8. 当前代码入口

| helper / token | 当前用途 | 状态 |
|---|---|---|
| `tokenRgba(handle, alpha)` | 从 color handle 派生透明色 | 已有 |
| `buildShadowD1()` | D1 下 | 已有 |
| `buildShadowD2()` | D2 下 | 已有 |
| `buildShadowD3()` | D3 下 | 已有 |
| `buildShadowD4()` | D4 下 | 已有 |
| `buildShadow(level, direction)` | D1-D4 + 方向 | 已有 |
| `buildDrawerShadow("right")` | Drawer 右侧侧向投影 | 已补 |
| `buildActiveRingShadow(handle)` | 控件 active ring | 已有 |
| `component-active-shadow` | 功能 active ring 源色 | 已有 |
| `warning-color-active-shadow` | 警告 active ring 源色 | 已有 |
| `mask-01-transparent` | 中性投影源色 | 已有 |

## 9. 代码落地规则

- 所有组件和业务页面的投影规则必须绑定 Shadow Foundation，不允许直接硬写 `box-shadow`。
- 缺少 shadow helper 时，可以补充 helper 或组件语义规则，但不能在组件里直接硬写投影绕过去。
- D1 / D2 / D3 / D4 必须同时表达 level 和 direction。
- 如果组件需要左 / 右 / 上方向 shadow，应通过 `buildShadow(level, direction)` 消费，不能在组件里临时手拼。
- 如果组件已有专属语义 shadow，如 Drawer，应通过组件语义 helper 消费，不能为了方便硬套 D4。
- active ring 必须通过 `tokenRgba("component-active-shadow", 0.2)` 或 `tokenRgba("warning-color-active-shadow", 0.2)` 派生。
- `rgba(...)` 不允许直接出现在业务组件里；必须从 color handle 派生。
- antd shadow token 只能作为实现承接层：只有当 antd token 已明确映射到 SensD shadow 规则时，组件才可以通过 antd token 消费。
- `theme.ts` 是生成物，不能直接手改。
- action shadow、floating shadow、elevation shadow、active ring、inset shadow 必须分开命名和验收。

## 10. TikTok Case 使用规则

- 数据源卡片 hover：候选使用 action shadow，即 D3 下；后续 DataSourceCard 阶段确认。
- 表格信息区底部分割：属于 inset shadow / 内部分割线，不作为 elevation shadow。
- 创建连接抽屉：外层 shadow 使用 `shadow/drawer/right`。
- Dropdown / Select popup：使用 floating shadow，当前为 D4 下。
- 表单控件激活态：使用 active ring，不使用 D3 / D4。
- 页面外层容器如需要投影，按 elevation shadow 处理，不复用按钮 hover shadow。

## 11. 当前问题与处理策略

| 问题 | 当前处理 | 建议时机 |
|---|---|---|
| D2 helper 已补 | `buildShadowD2()` 承接 D2 下方向 | 后续组件接入时按场景使用 |
| 方向型 helper 已补 | `buildShadow(level, direction)` 承接四方向样张 | Drawer / Popover 阶段继续校准使用场景 |
| D1 / D3 / D4 便捷 helper 保持默认下方向 | 通过 `buildShadow()` 覆盖方向扩展 | 后续组件迁移时按需替换 |
| DataSourceCard hover 手拼 D3 | 暂不改代码 | DataSourceCard 阶段 |
| Drawer 侧向 shadow 已语义化 | `shadow/drawer/right` / `buildDrawerShadow("right")` | Drawer 组件阶段接入 |
| 表格 inset shadow 需要和边框规则一起确认 | 暂不改代码 | Table 阶段 |
| `theme.ts` 中有 rgba shadow | 生成物，不手改 | token 生成链路阶段 |

## 12. 单组件 Shadow 验收

后续每个组件进入实现或调整时，必须报告：

- 是否新增硬编码 `box-shadow`。
- 是否新增硬编码 `rgba(...)`。
- shadow 属于 active ring / action / floating / elevation / inset 哪一类。
- shadow 使用 D1 / D2 / D3 / D4 哪个层级。
- shadow 使用下 / 上 / 左 / 右哪个方向。
- shadow 来自哪个 helper 或 token。
- 是否使用 antd shadow token；如果使用，说明它映射到哪条 SensD 规则。
- 如果某个 shadow 暂时不能 token 化，必须说明原因并暂停确认。

## 13. 待补

- `buildShadowD2()` 已补，后续进入组件时接入。
- 方向型 shadow helper `buildShadow(level, direction)` 已补，后续 Popover 阶段校准侧向投影使用场景。
- 明确 `buildCardShadow(level)` / `buildElevationShadow(level)` 是否需要存在。
- 做 Card、Drawer、Table、DataSourceCard 时逐个校准 shadow 规则。
- Shadow 预览页已补，当前展示 D1 / D2 / D3 / D4、四方向、active ring、Drawer 侧向投影。
