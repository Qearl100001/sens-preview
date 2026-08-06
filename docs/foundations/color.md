# Color Foundation

> 统一基础色板、语义 handle、antd theme token 与组件用色关系。<br>
> 成熟度：Stable<br>
> 实现：Implemented<br>
> 验证：Verified（2026-07-24：`/basic-styles/color` 设计说明与数值样张）
> 来源：`/Users/liyuwen/Desktop/colors.md`、`tokens.resolved.json`、`theme.ts`、`color-utils.ts`。<br>
> 预览：`/basic-styles/color`

## 1. 定位

Color 负责统一基础色板、语义 color handle、antd theme token、组件和业务页面之间的用色关系。

后续页面和组件不应该硬编码 hex / rgba，也不应该直接引用基础色板路径。业务实现必须优先使用语义 token、antd token 或 color helper。

## 2.1 基础色板与色阶

基础色板是设计源、审计源和换肤映射源，不是组件代码的直接消费层。当前基础色板包括 12 个主题色阶，以及子夜黑和象牙白中性色阶：

- 旭日红、沙丘金、原野黄、青柠绿、极光绿、神策绿。
- 山水蓝、冰绽蓝、兰花紫、波光紫、云霞粉、子夜黑。
- 象牙白作为浅色中性色阶，与子夜黑共同承接文本、边框和背景的中性关系。

彩色主题统一使用 16 阶，10 阶为基准色；子夜黑使用 12 阶，象牙白使用 8 阶。色彩定义以 HSB 为模型：深色区域保持色相、提高饱和度并降低明度；浅色区域保持色相、降低饱和度并提高明度。

基础色阶的默认角色映射如下：

| 角色 | 默认色阶 | 说明 |
|---|---:|---|
| 默认 | 10 | 默认品牌或功能表达 |
| 悬停 | 8 | 功能性 hover |
| 点击 | 12 | active / pressed |
| 禁用 | 6 | 功能色禁用态 |
| 禁用悬停 | 5 | 禁用控件的 hover 反馈 |
| 选中背景 | 衍生色 | 根据基准色生成浅色承载 |
| 浅色背景 | 01 或衍生色 | 标签、选中项和功能浅底 |

基础色板样张必须能看到完整色阶、基准色角色和至少一组文字对比度示例。组件仍然只引用语义 handle；基础色板路径只允许出现在基础样张、换肤映射和审计代码中。

## 2. 四层关系

```text
基础色板
  -> 语义 color handle
  -> antd theme token / color helper
  -> 组件和页面
```

| 层级 | 示例 | 代码能否直接用 | 说明 |
|---|---|---|---|
| 基础色板 | `基础色板/冰绽蓝/10` | 否 | 只作为设计源、审计源、换肤映射源 |
| 语义 handle | `component-primary` / `link-color` / `text-color` | 可以 | 推荐作为组件和 helper 的主要来源 |
| antd token | `colorPrimary` / `colorLink` / `colorText` | 可以 | 组件使用 antd 时优先消费 |
| helper 派生 | `tokenRgba("outline-color-transparent", 0.08)` | 可以 | 透明色、投影、特殊 alpha 场景使用 |

## 3. 当前代码入口

| 入口 | 用途 | 状态 |
|---|---|---|
| `src/design-system/tokens.resolved.json` | 当前已解析 token 值 | 生成物，不能手改 |
| `src/design-system/theme.ts` | antd theme token 与 components token | 生成物，不能手改 |
| `src/design-system/color-utils.ts` | `getColorToken` / `tokenRgba` / shadow helper | 可作为业务和组件取色入口 |
| `src/design-system/functional-skin.ts` | 功能色换肤映射 | 7 组功能色运行时映射；组件逐个完成消费验收 |

## 4. 功能色

功能色是可换肤的部分；默认以神策绿作为基线，其他功能色由换肤预览和组件验收逐步确认。

| 语义 | handle | 当前值 | antd |
|---|---|---:|---|
| 主色 | `component-primary` | `#00B280` | `colorPrimary` |
| 悬停 | `component-hover` | `#27C296` | `colorPrimaryHover` |
| 点击 | `component-active` | `#008C65` | `colorPrimaryActive` |
| 禁用 | `component-disable` | `#55D4B0` | 待组件映射 |
| 选中背景 | `component-active-background` | `#EBF7F4` | 待组件映射 |
| 选中 hover 背景 | `component-active-hover-background` | `#F2FAF8` | 待组件映射 |
| 选中 click 背景 | `component-active-click-background` | `#E4F5F1` | 待组件映射 |
| 浅色背景 | `component-light-background` | `#E1FAF3` | 待组件映射 |
| 点击投影源色 | `component-active-shadow` | `#00B280` | helper 派生 |

使用规则：

- 主按钮、功能性选中态、普通功能控件的聚焦边框、功能性 hover 使用功能色。
- 链接按钮、表格操作列、帮助文档链接不能用功能色冒充，必须使用链接状态色。
- 成功、提醒、上涨、下跌和不变是被动语义，不能因为组件可点击就自动套用功能色的 Hover / Active 映射；如果它们承载在可交互控件中，按控件职责选择功能色、链接色或危险操作色。
- v0.9 默认以神策绿作为功能色基线；运行时已支持 7 组 Functional Skin，组件是否完整消费仍以逐组件浏览器验收为准。

## 5. 状态色

状态色不随功能色换肤变化。

| 语义 | handle | 当前值 | 默认 | Hover | Active / Pressed | antd |
|---|---|---:|---|---|---|---|
| 链接 | `link-color` | `#3170EB` | `link-color` | `link-hover-color` | `link-active-color` | `colorLink` / `colorInfo` |
| 成功 | `success-color` | `#5CB838` | `success-color` | 通常无 | 通常无 | `colorSuccess` |
| 提醒黄 | `info-color` | `#FAB300` | `info-color` | 通常无 | 通常无 | `colorWarning` |
| 警告红 | `warning-color` | `#E54545` | `warning-color` | `warning-color-hover` | `warning-color-active` | `colorError` |
| 错误 | 复用警告红 | `#E54545` | `warning-color` | 被动错误通常无 | 被动错误通常无 | `colorError` |
| 危险操作 | 复用警告红 | `#E54545` | `warning-color` | `warning-color-hover` | `warning-color-active` | `colorError` / `Button danger` |
| 涨 | `rise-color` | 见 `color-semantics.md` | `rise-color` | 无 | 无 | 业务层 handle |
| 跌 | `fall-color` | 见 `color-semantics.md` | `fall-color` | 无 | 无 | 业务层 handle |
| 不变 | `flat-color` | 见 `color-semantics.md` | `flat-color` | 无 | 无 | 业务层 handle |

重要约束：

- Sens.Design 的“提醒黄”映射到 antd `colorWarning`。
- Sens.Design 的“警告红”映射到 antd `colorError`。
- 这两个语义和 antd 英文名存在交叉，不能因为看起来不一致就纠正。
- 删除、危险确认、错误态使用警告红，不使用链接蓝。
- 表格操作、普通跳转、帮助文档使用链接蓝，不使用功能绿。

### 5.1 交互状态归属

“默认 / Hover / Active”必须先判断颜色家族，再判断组件是否具有对应交互状态：

| 颜色家族 | 默认 | Hover | Active / Pressed | 聚焦外环 / 激活投影 |
|---|---|---|---|---|
| 功能色 | `component-primary` | `component-hover` | `component-active` | `component-active-shadow` |
| 链接色 | `link-color` | `link-hover-color` | `link-active-color` | 使用链接 active 指示；不回退成绿色功能投影 |
| 警告 / 危险 | `warning-color` | `warning-color-hover` | `warning-color-active` | `warning-color-active-shadow` |
| 被动状态 / 数据语义 | 各自默认色 | 无 | 无 | 不自动产生交互投影 |

聚焦外环用于键盘 `focus-visible`，激活投影用于按下或激活反馈。两者可以共享同一语义投影源和 alpha（当前通常为 20%），但触发时机和验收目标不同。普通功能色使用 `component-active-shadow`，警告 / 危险使用 `warning-color-active-shadow`。

当前没有独立的 `link-focus-shadow` handle：纯文字链接使用 `link-active-color` 的文字或下划线指示；链接若被承载为按钮或输入式控件，必须保持蓝色语义的 focus 指示，不能回退到绿色功能色外环。是否新增独立链接投影 token，另按组件验收结果决定。

### 5.2 Figma 组件应用矩阵

Figma「定制色_v2.1」节点定义的是语义颜色的组件应用层，不是基础色阶或全局交互状态层。它覆盖 Badge、Switch、标签 / 叠加标签、标签 / 多彩标签等组件，并进一步区分：

- 背景默认、悬停、点击、禁用、禁用悬停。
- 文字与图标的默认、悬停、点击。
- 多彩标签的不同语义色背景和文字组合。
- 这些定制语义色是否跟随换肤。

该 Figma 表格右侧“跟随换肤功能改变”对这些定制色标记为“否”。因此，组件应用矩阵必须保留在颜色基础和对应组件文档中；`docs/design-system.md` 只需要规定颜色家族和边界，不需要复制整张明细表。组件实现时应引用本 Foundation 的语义 handle，并在组件文档中记录自己的状态映射。

## 6. 中性色

| 场景 | 推荐来源 | 说明 |
|---|---|---|
| 主文本 | `text-color` / `colorText` | 标题、正文主信息 |
| 大段正文 | `text-article-color` | 长文本、信息说明 |
| 次级文本 | `text-sub-color` / `colorTextSecondary` | 描述、辅助说明 |
| 禁用文本 | `text-color-disable` / `colorTextTertiary` | 禁用、不可操作 |
| 默认边框 | `outline-color` / `colorBorder` | 输入框、卡片、容器边界 |
| 浅分割线 | `divideline-color-light` / `colorBorderSecondary` | 表格、分割线 |
| 页面灰底 | `background-grey` / `colorBgLayout` | 页面背景 |
| 容器白底 | `white` / `colorBgContainer` | 卡片、表格、抽屉内容 |

## 7. 透明色 / Alpha

`*-transparent` handle 在 JSON 里存的是 hex 基色，不是最终 rgba。

透明色必须通过 `tokenRgba(handle, alpha)` 派生：

```ts
tokenRgba("text-color-transparent", 0.9)
tokenRgba("text-sub-color-transparent", 0.58)
tokenRgba("outline-color-transparent", 0.08)
```

使用规则：

- 不直接在组件或页面里手写 `rgba(...)`。
- 有透明度的文字、边框、背景、投影都走 `tokenRgba`。
- 如果某个 alpha 是组件专属规则，写进对应组件文档，不提升成全局规则。

## 8. TikTok Case 用色准入

- 数据源管理页内容区：页面灰底 + 白色内容容器 + 中性色文字。
- 数据源卡片：白底、浅边框、hover 使用功能色边框和投影。
- TikTok 空态：白底容器，主文案使用主文本，辅助文案使用次级文本。
- 创建连接抽屉：表单正文使用主文本，提示说明使用辅助色，错误态使用警告红。
- 连接列表：表格操作链接使用 `colorLink`，状态点使用成功色 / 禁用色。
- 删除 / 危险行为：使用警告红，并结合一致性流程规则做挽留确认。
- 导航和产品壳涉及换肤，已明确后置；当前只记录，不纳入 TikTok 两周主验收。

## 9. 与导航颜色的边界

导航颜色是独立的 Product Shell Theme，不混入普通 `component-*` / `text-*` / `link-*` 颜色体系。顶导、侧导、标题栏和页面主题背景的 token、helper 与换肤矩阵统一维护在 [Navigation Color](./navigation-color.md)。

当前 Token Source 中 `component-active` 为 `#008C65`，v0.9 以该值作为绿色基线；历史 Figma 表格中的 `#008C64` 差异不在本轮回溯。

## 10. 代码落地规则

- 所有组件和业务页面的颜色必须绑定 Color Foundation，不允许直接硬写 hex / rgba。
- 缺少语义 token 时，可以补充 color token / helper / component token，但不能在组件里直接硬写颜色绕过去。
- antd token 只能作为实现承接层：只有当 antd token 已明确映射到 SensD color handle 时，组件才可以通过 antd token 消费。
- 透明色、投影色、alpha 场景必须通过 `tokenRgba` 或明确的 color helper 生成。
- 组件实现需要报告颜色来自哪个语义 handle、antd token 或 helper。

## 11. 禁止项

- 禁止业务页面直接硬编码 hex。
- 禁止业务页面直接硬编码 rgba。
- 禁止组件直接引用基础色板路径，除非是在换肤映射或 foundation 样张中。
- 禁止手改 `tokens.resolved.json`。
- 禁止手改 `theme.ts`。
- 禁止用 `colorPrimary` 冒充链接。
- 禁止用 `colorLink` 冒充主操作。
- 禁止把 `info-color` 和 `warning-color` 的 antd 映射“纠正”成另一套。

## 12. 当前问题与处理策略

这些问题后续必须解决，且越早解决，后续组件准入越快。

| 问题 | 当前处理 | 建议时机 |
|---|---|---|
| 组件级功能色换肤验收未完成 | 主题层已具备，组件仍需逐个确认 | 按组件验收轮次推进 |
| 导航主题色系统独立 | 已记录来源和差异，不混入普通 Color Foundation | 做产品壳 / 导航前优先整理映射表 |
| `theme.ts` 内有大量 hex | 生成文件正常现状，不能手改 | 找到 token 源或重建生成链路后处理 |
| 组件内仍有 fallback hex / rgba | 不在 Color Foundation 阶段批量改 | 进入对应组件时逐个解决 |
| `.ant-*` 覆盖和 `!important` 较多 | 不一刀切删除 | 单组件验收时说明必要性或替换为 token / props |
| TikTok 导航占位存在渐变硬编码 | 导航后置，只记录 | 做产品壳 / 导航时处理 |
| 基础色板完整样张 | 已补入 `/basic-styles/color` | 持续按 Figma 色板维护 |

## 13. 单组件颜色验收

后续每个组件进入实现或调整时，必须报告：

- 改了哪些文件。
- 是否新增 hex。
- 是否新增 rgba。
- 是否新增 `.ant-*` 覆盖。
- 是否新增 `!important`。
- 主色、链接色、状态色、中性色分别来自哪个 token / handle。
- 如果某个颜色暂时不能 token 化，必须说明原因并暂停确认。

## 14. 待补

- 建立 Color token / helper 的代码侧准入方案。
- ✅ 全局换肤绿/蓝：矩阵 + Appearance Context + 组件 `functionalCssVar` 接线（阶段 1–3）；黄肤与分控切换后置。
- ✅ 为导航主题色建立独立映射表（`navigation-theme.json` green/blue + `getNavigationColorToken`）。
- 在组件清单阶段优先审计 TikTok 必需组件的颜色来源。
- 持续维护色彩样张页，用于人工验收基础色、语义色、透明度、对比度和换肤差异。
