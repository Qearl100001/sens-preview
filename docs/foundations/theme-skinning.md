# Theme / Skinning

> Theme / Skinning 定义设计系统中的换肤模型。当前规则将换肤拆成两条独立主题线：导航主题和功能色主题。两者可以独立选择、独立组合，不要求同色系。

## 1. 定义

换肤是指在不改变组件结构、交互逻辑和信息层级的前提下，通过主题 token 或 helper 改变界面视觉表现。

换肤不等于重新设计组件。组件应保持一致的布局、尺寸、状态和可访问性，只允许颜色、背景、阴影、透明度等视觉变量在规则内变化。

## 2. 两套独立主题

设计系统的换肤分为两套独立配置：

| 主题 | 控制范围 | 是否独立选择 | 说明 |
|---|---|---|---|
| Navigation Theme | 顶部导航、侧边导航、标题栏、页面背景、产品壳菜单 | 是 | 控制产品壳气质 |
| Functional Color Theme | 主操作、链接、选中态、开关、标签、功能反馈色 | 是 | 控制组件行为反馈和功能表达 |

导航主题不决定功能色主题，功能色主题也不反向影响导航主题。例如导航可以使用黄色主题，同时功能色选择蓝色主题。

## 3. 换肤判断标准

组件是否参与换肤，不按“是不是导航组件”判断，而按是否使用功能色或导航主题色判断。

| 判断项 | 是否参与换肤 | 说明 |
|---|---|---|
| 使用 Navigation Theme | 是 | 如顶导航、侧导航、标题栏、页面背景 |
| 使用 Functional Color Theme | 是 | 如主按钮、选中态、开关、标签、功能性 hover |
| 只使用中性色 | 否 | 如普通文本、普通边框、普通卡片背景 |
| 使用状态色 | 默认否 | 成功、提醒、警告等状态色是否换肤需要单独确认 |
| 使用业务自定义色 | 默认否 | 业务色不自动纳入设计系统换肤 |

## 4. Navigation Theme

Navigation Theme 是产品壳专属主题，当前优先覆盖：

- 顶部导航：背景、文字、图标、分割线、功能菜单入口。
- 侧边导航：背景、目录区、文字、图标、选中态、悬浮态。
- 标题栏：标题背景、标题文字、辅助信息。
- 页面背景：应用底色、内容承载背景。
- 产品壳菜单：下拉菜单、产品导航、更多菜单等导航专属浮层。

导航颜色的详细 token、helper 和待录入项，应维护在 `navigation-color.md` 和 Navigation Color HTML 页面中。

## 5. Functional Color Theme

Functional Color Theme 是组件功能表达的主题，当前优先覆盖：

- 主操作色：默认、悬停、点击、禁用。
- 选中背景：默认、悬停、点击。
- 链接色：默认、悬停、点击、浅色背景、浅色描边。
- 开关、标签、便签等组件背景功能色。
- 需要表达功能状态的组件局部颜色。

功能色可以自由选择一套配置使用，不需要跟随导航主题。例如 Navigation Theme 使用绿色，Functional Color Theme 可以使用蓝色。

## 6. 不参与换肤的默认范围

以下内容默认不参与换肤：

- 基础中性色：文本、图标、线、背景、遮罩。
- 普通容器背景和普通卡片背景。
- 普通表单、表格、抽屉内容区的中性色。
- 业务自定义色。
- 未明确接入主题语义 token 的组件局部颜色。

如果这些颜色需要参与换肤，必须单独定义语义 token，不能临时复用导航 token 或功能色 token。

## 7. Token 分层

换肤 token 分为三层：

| 层级 | 作用 | 示例 |
|---|---|---|
| 基础色板 | 提供原始颜色，不直接给组件使用 | 神策绿、冰绽蓝、原野黄 |
| 语义 token / helper | 表达颜色用途，是换肤入口 | `component-primary`、`theme-top-text`、`getThemeTopBackground()` |
| 组件映射 | 组件内部引用语义 token，不写死颜色 | Button 使用功能色，Top Navigation 使用导航色 |

组件只能使用语义 token、antd token 或经过确认的 helper，不能直接写 hex、rgba 或临时颜色。

## 8. 组件接入规则

组件接入换肤时，需要满足：

- 组件结构不因换肤改变。
- 组件尺寸不因换肤改变。
- 组件状态不因换肤减少。
- 组件只消费 token 或 helper，不自行生成颜色。
- 组件文档中必须说明使用了哪一套主题。
- 如果 token 缺失，组件页面应标记为“待补 token”，而不是写死样式。

## 9. 缺口标注规则

所有换肤相关内容需要标注状态：

| 状态 | 含义 |
|---|---|
| Ready | token 已存在，组件已使用，规则明确 |
| Half Ready | 有视觉方向或临时实现，但 token、状态或语义不完整 |
| Missing | 设计稿或实现中需要，但 token 尚未录入 |
| To Confirm | 需要设计、产品或研发确认后才能定稿 |

## 10. 验证方式

换肤规则需要通过以下方式验证：

- 组件页面能说明每个关键颜色来自 Navigation Theme 还是 Functional Color Theme。
- 使用功能色的组件有功能色主题切换验证。
- 使用导航色的组件有导航主题映射说明。
- HTML 预览中能看到默认态、悬浮态、选中态等关键状态。
- 不新增未经确认的 hex、rgba、px、组件私有颜色。
- 最终 `DESIGN.md` 只保留规则摘要，详细映射表保留在 Foundation / Navigation Color / Component Theme Mapping 页面中。

## 11. Token 来源与生成链路

换肤相关颜色**禁止手改**生成物。真相源与产物关系：

```text
tokens/source/figma/Color.json     ← 颜色真相源（含 @handle）
tokens/source/figma/unit.json
tokens/source/foundations/*.json   ← typography / divider / shadow
        ↓
  node build-tokens.mjs
        ↓
src/design-system/tokens.resolved.json   ← 生成物（禁手改）
src/design-system/theme.ts               ← antd 承接层（禁手改）
src/design-system/i18n/*.json
```

消费层（可演进，但本轮只列映射、不实现全局换肤）：

| 入口 | 作用 | 换肤完整度 |
|---|---|---|
| `getColorToken(handle)` | 读语义 handle | Ready（读默认绿肤值） |
| `tokenRgba(handle, α)` | 透明派生 | Ready |
| `getColorByPath(path)` | 读基础色板 / 无 handle 路径 | Half Ready（蓝肤预览在用） |
| `getFunctionalColors(skin)` | 绿 / 蓝局部预览 | Half Ready（只覆盖主操作 + 选中背景） |
| `getThemeTopBackground(skin)` | 顶导渐变 | Navigation Theme |

## 12. Functional Color Token Mapping

> 本表只做映射与缺口标注，**不录入新 token、不改生成物、不实现换肤**。
> 字段：Figma 分组 · Figma 名称 · 语义 · 当前 token / helper · 是否参与功能色换肤 · ready · 待确认项。

状态口径：

| 状态 | 含义 |
|---|---|
| Ready | 源里有 `@handle`，已进 `tokens.resolved.json`，语义清楚；组件可直接读（不等于全局换肤已实现） |
| Half Ready | 有值 / 有路径，但语义不全、透明丢失、或只在预览 helper 里临时拼 |
| Missing | 设计需要，但无独立语义 handle / 无换肤配置位 |
| To Confirm | 归属或是否参与功能色换肤未定 |

### 12.1 主操作

| Figma 分组 | Figma 名称 | 语义 | 当前 token / helper | 参与功能色换肤 | ready | 待确认项 |
|---|---|---|---|---|---|---|
| 功能色 | `01_默认 @component-primary` | 主色默认 | `component-primary` → antd `colorPrimary`；`getFunctionalColors().primary` | 是 | Ready | 蓝肤目前走 `基础色板/冰绽蓝/10`，未形成第二套语义 handle |
| 功能色 | `02_悬停 @component-hover` | 主色 hover | `component-hover` → `colorPrimaryHover` | 是 | Ready | 同上 |
| 功能色 | `03_点击 @component-active` | 主色 active | `component-active` → `colorPrimaryActive` | 是 | Ready | Figma 换肤表曾见 `#008C64`，代码为 `#008C65` |
| 功能色 | `04_禁用 @component-disable` | 主色 disable | `component-disable`；antd **未完整映射** | 是 | Half Ready | 组件侧是否统一用该 handle |
| 功能色 | `05_禁用悬停 @component-disable-hover` | 主色 disable hover | `component-disable-hover`；`getFunctionalColors` **未收录** | 是 | Half Ready | 是否纳入 Functional ColorSet |

### 12.2 选中背景 / 投影 / 浅色背景

| Figma 分组 | Figma 名称 | 语义 | 当前 token / helper | 参与功能色换肤 | ready | 待确认项 |
|---|---|---|---|---|---|---|
| 功能色 | `06_选中背景默认 @component-active-background` | 选中底 | `component-active-background`；蓝肤预览用冰绽蓝/01 | 是 | Ready | 绿肤源是实色 hex，非色板引用；蓝肤是否应对齐同结构 |
| 功能色 | `07_选中背景悬停 @component-active-hover-background` | 选中 hover 底 | `component-active-hover-background` | 是 | Ready | 同上 |
| 功能色 | `08_选中背景点击 @component-active-click-background` | 选中 click 底 | `component-active-click-background` | 是 | Ready | 同上 |
| 功能色 | `09_点击投影 @component-active-shadow` | active ring 源色 | `component-active-shadow` + `buildActiveRingShadow()` / `tokenRgba(..., 0.2)` | 是 | Half Ready | resolved 只存 hex，α 在 helper；`getFunctionalColors` 未收录 |
| 功能色 | `10_浅色背景 @component-light-background` | 浅功能底 | `component-light-background` | 是 | Half Ready | `getFunctionalColors` 未收录；antd 无直接映射 |

### 12.3 链接

链接先**列入** Functional Color Mapping 表；换肤列标 To Confirm。确认前，`getFunctionalColors` **不要**自动改链接色。

| Figma 分组 | Figma 名称 | 语义 | 当前 token / helper | 参与功能色换肤 | ready | 待确认项 |
|---|---|---|---|---|---|---|
| 状态色/链接 | `01_默认 @link-color` | 链接默认 | `link-color` → `colorLink` / `colorInfo` | To Confirm | Ready | Figma 在「状态色」下；是否改归 Functional Color Theme |
| 状态色/链接 | `02_悬停 @link-hover-color` | 链接 hover | `link-hover-color` → `colorLinkHover` | To Confirm | Ready | 同上 |
| 状态色/链接 | `03_点击 @link-active-color` | 链接 active | `link-active-color` → `colorLinkActive` | To Confirm | Ready | 同上 |
| 状态色/链接 | `04_浅色背景 @link-light-background` | 链接浅底 | `link-light-background` | To Confirm | Ready | 组件消费面少 |
| 状态色/链接 | `05_浅色描边 @link-light-outline` | 链接浅描边 | `link-light-outline` | To Confirm | Ready | 同上 |

### 12.4 开关背景

| Figma 分组 | Figma 名称 | 语义 | 当前 token / helper | 参与功能色换肤 | ready | 待确认项 |
|---|---|---|---|---|---|---|
| 定制色/开关/背景 | `01_关闭默认 @switch-background` | 关·默认 | `switch-background` | To Confirm（关态偏中性） | Half Ready | resolved 多档都落成同一基色，疑似透明 α 丢失 |
| 定制色/开关/背景 | `02_关闭悬停 @switch-background-hover` | 关·hover | `switch-background-hover` | To Confirm | Half Ready | 同上 |
| 定制色/开关/背景 | `03_关闭点击 @switch-background-active` | 关·active | `switch-background-active` | To Confirm | Half Ready | 源带 α，生成链路是否应输出 rgba |
| 定制色/开关/背景 | `04_关闭禁用 @switch-background-disable` | 关·disable | `switch-background-disable` | To Confirm | Half Ready | 同上 |
| 定制色/开关/背景 | `05_关闭禁用悬停 @switch-background-disable-hover` | 关·disable hover | `switch-background-disable-hover` | To Confirm | Half Ready | 同上 |
| （推导） | 开·默认 / hover / active | 开态功能色 | **无独立 handle**；实践上常复用 `component-primary` 链 | 是 | Missing | 是否新增 `switch-on-*`，还是直接绑主操作色 |

### 12.5 标签背景

| Figma 分组 | Figma 名称 | 语义 | 当前 token / helper | 参与功能色换肤 | ready | 待确认项 |
|---|---|---|---|---|---|---|
| 定制色/标签/叠加标签 | `背景/01 @tag-default-background` | 叠加标签底 | `tag-default-background` | To Confirm | Half Ready | 偏中性深色；是否算 Functional |
| 定制色/标签/*色系 | `背景/01_默认` / `02_悬停` / `03_点击`；`文字&图标/01_悬停` / `02_点击` | 彩色标签底与交互字色 | **仅 `getColorByPath`**，无 `@handle` | **否** | Ready（固定色板） | 已确认不换肤；中性可点悬停/点击复用冰绽蓝 path |
| 中性色/背景 | `01 @background-01-transparent` @0.08 | 中性标签默认底 | `tokenRgba` | 否 | Ready | 可点交互不跟中性加深，走冰绽蓝 |

### 12.6 便签背景

| Figma 分组 | Figma 名称 | 语义 | 当前 token / helper | 参与功能色换肤 | ready | 待确认项 |
|---|---|---|---|---|---|---|
| 定制色/便签/背景 | `01 @tooltip-background` | 便签 / Tooltip 底 | `tooltip-background` | 默认否 / To Confirm | Ready | 命名是 tooltip，是否=便签；是否永不换肤 |

### 12.7 状态色（默认不纳入功能色换肤）

| Figma 分组 | 示例 handle | 参与功能色换肤 | ready | 说明 |
|---|---|---|---|---|
| 状态色/成功 | `success-color` 等 | 否（默认） | Ready | 标 To Confirm：是否未来允许主题化 |
| 状态色/提醒 | `info-color` 等 | 否（默认） | Ready | 同上；antd 映射为 `colorWarning`，勿「纠正」 |
| 状态色/警告 | `warning-color` 等 | 否（默认） | Ready | 同上；antd 映射为 `colorError` |
| 错误（若与警告同链） | `warning-*` | 否（默认） | To Confirm | 产品语义「错误」是否单独 handle |

### 12.8 汇总

| 状态 | 条目 |
|---|---|
| Ready | 主操作 01–03；选中背景 06–08；链接 5 档 handle 本身；便签 `tooltip-background`；多数状态色 handle |
| Half Ready | disable / disable-hover；点击投影；浅色背景；开关关态 5 档（α / 生成异常）；叠加标签；`getFunctionalColors` 矩阵不完整；antd 对 disable / 浅底映射不全 |
| Missing | 开关「开」态独立 token；第二套功能色主题（蓝 / 黄）的完整语义层（现靠色板 path 临时拼） |
| To Confirm | 链接是否算功能色换肤；状态色是否永远不换肤；开关关态是否算中性；叠加标签 / 便签是否进 Functional；`#008C64` vs `#008C65` |

## 13. 与 Navigation Theme 的边界

Navigation 继续走 `navigation-color.md`，**不要写进 Functional Color 表**：

| 已有 | 缺口（仍属 Navigation） |
|---|---|
| 大量 `theme-top-*`、`theme-side-text/icon*`、`theme-title-background`、`body-background` | 顶导 / 侧导**背景渐变**无独立 handle（靠 `getThemeTopBackground` / 硬编码侧导渐变） |
| 侧导目录状态底 `theme-side-background-hover/click/active` | 侧导整体背景、完整换肤矩阵、导航图标全态、标题栏是否跟换肤 |

两套可独立组合（例如黄导航 + 蓝功能色）。当前代码**还做不到完整组合**，规则与映射先沉淀在本页与 `/basic-styles/theme-skinning`。

## 14. 当前待补

- ✅ Functional Color Token Mapping 表已落库（§12）；确认 To Confirm 项后再决定是否补源 / 重跑生成。
- 补 Navigation Theme 的完整换肤矩阵，尤其是侧导航背景、标题栏、导航渐变 helper。
- 建立组件换肤映射表：组件 → 使用主题 → token / helper → Ready / Half Ready / Missing / To Confirm。
- 确认状态色是否允许跟随功能色主题变化；当前默认不跟随。
- 确认链接、开关开态、便签三类 To Confirm 后再扩展 `getFunctionalColors`（彩色标签已确认不换肤）。
- **禁止**手改 `tokens.resolved.json` / `theme.ts`；要改就改 `tokens/source` + 重跑 `build-tokens.mjs`。
