# 设计系统 skill · 基础组件：按钮 Button

> 基础层，直接用 antd。**颜色一律用 token，不要硬编码。**
> 源自 Sens.Design 按钮规范 v2.1 + Figma 变体矩阵。

## 通则
- **重要前提**：本套用 antd 当底座 + 本规范去改它。**凡本规范没写明的点，agent 会沿用 antd 默认**。所以"和 antd 不一样的地方"必须在此写死，否则会露出 antd 行为。
- **实现方式遵循 `conventions.md`**：用主题 token + antd props 驱动，不写 CSS 盖 `ant-btn-*`；真实组件不伪造 hover/loading 等状态。
- 状态矩阵分两层：真实组件 `SensButton`（props+token，不伪造）；预览对照板（把每个变体×尺寸×每个状态画出来，悬停/点击等用 helper 从 token 取色做静态样张，只存在于预览板）。
- **尺寸只有两种**：大 `size/component-height/m`（`controlHeight`，antd 默认 / 不传 size）、小 `size/component-height/s`（`controlHeightSM`，`size="small"`）。**不要用 antd 的 large（`size/component-height/xl`）**。
- 状态：默认 / 悬停 / 点击 / 禁用 / 禁用悬停 / 加载（`loading`）/ 加载悬停。
- **团队规则（区别于 antd 默认，必须遵守）**：
  - **二级 / 三级 hover/点击：无背景填充**（含常规绿、警告红），只变边框/文字色。绿系 hover `component-hover`、点击 `component-active`；红系 hover `warning-color-hover`、点击 `warning-color-active`。不要加任何浅绿底/浅红底。
  - **禁用 与 加载 视觉一致（同一套灰）**：这是团队规则；不要按 antd 默认（antd 的 loading 会保留按钮原色）。loading 与 disabled 呈现同样的禁用灰 + 转圈。
  - 禁用悬停 = 禁用；加载悬停 = 加载（状态互斥，hover 不再叠加变化）。
- **变体矩阵还原**：按 type × size × state 矩阵并排渲染，保持稿里分组顺序，不要拍平、不要把图层名当文案。
- 图标：非必要不用；图标色与图标-文字间距遵循 `icons.md`。
- 文案以动词为主。组合排序：操作区按优先级**从右到左**，主按钮最显眼；**操作 ≥4 个收进「更多」**（与表格操作列一致）。

## 常规按钮（按重要程度，绿）
| 类型 | antd | 默认 | 悬停 | 点击 | 禁用 |
|---|---|---|---|---|---|
| 一级（实心）| `type="primary"` | 底 `component-primary` / 字 `white` | 底 `component-hover` | 底 `component-active` | 底 `component-disable` / 字 `white` |
| 二级（绿描边）| `<Button>` 描边主色 | 边+字 `component-primary` / 底 `white` | **边+字变 `component-hover`，底不变（无填充）** | **边+字变 `component-active`，底不变** | 边+字 `component-disable` |
| 三级（绿文字无边框）| `type="text"` 主色字 | 字 `component-primary` / 透明底 | **字变 `component-hover`，无底** | **字变 `component-active`，无底** | 字 `component-disable` |

## 链接按钮（蓝）
| 类型 | antd | 默认 | 悬停 | 点击 | 禁用 |
|---|---|---|---|---|---|
| 常规（纯文字 / 图标+文字 / 纯图标）| `variant="link"`（`colorLink`）| 字 `link-color` / 透明底 | 字 `link-hover-color` / **无底** | 字 `link-active-color` / **无底** | 字 `text-color-disable` |
| 弱化 | `variant="link"` + `sens-btn-link-weak` | 字 `text-sub-color` / 透明底 | 字 `link-color` / **无底** | 字 `link-active-color` / **无底** | 字 `text-color-disable` |

- **走状态色通道**：**禁止** `color="primary"`（那是功能色绿，会随换肤变）。
- 三形态：纯图标 / 图标+文字 / 纯文字；**图标在文字左侧**（`icons.md`）。
- 预览示例图标用 Figma `icon-default`（`1471:5057`）；**不要用** `ChevronDown` / `ChevronUp`（下拉 / 选择器专用）。

## 警告按钮（红，作用在二级 / 三级 / 链接上）
| 类型 | antd | 默认 | 悬停 | 点击 | 禁用 |
|---|---|---|---|---|---|
| 二级（红描边）| `danger` + `outlined` | 边+字 `warning-color` / 底 `white` | **边+字变 `warning-color-hover`，底不变（无填充）** | **边+字变 `warning-color-active`，底不变** | 边+字 禁用灰 |
| 三级（红文字）| `danger` + `text` | 字 `warning-color` / 透明底 | **字变 `warning-color-hover`，无底** | **字变 `warning-color-active`，无底** | 字 禁用灰 |
| 链接（红字）| `danger` + `link` | 字 `warning-color` / 透明底 | 字 `warning-color-hover` / **无底** | 字 `warning-color-active` / **无底** | 字 `text-color-disable` |
| 链接弱化 | `type="link"` + `sens-btn-danger-link-weak`（**不用** `danger`）| 字 `text-color-transparent` / 图标 `icon-color-transparent` | 字+图标 `warning-color` / **无底** | 字+图标 `warning-color-active` / **无底** | 字 `text-color-disable` |

- antd 统一用 `danger` 修饰（`<Button danger>`、`type="link" danger` 等）。
- 可带「二次确认」：点击先 `Popconfirm` 再执行，常用于删除。

## 虚线按钮
| 类型 | antd | 默认 | 悬停 | 点击 | 禁用 |
|---|---|---|---|---|---|
| 虚线「+」| `variant="dashed"` | 边+字 `component-primary` / 底 `white` | 边+字 `component-primary` / 底 `component-active-hover-background` | 边+字 `component-primary` / 底 `component-active-click-background` | 边+字 禁用灰 |

- 用于虚线框区域「添加内容」；图标 `EditorAdd`。

## 更多按钮（"按钮 ···"）
| 类型 | antd | 默认 | 悬停 | 点击 | 禁用 |
|---|---|---|---|---|---|
| 主按钮 + `···` | `Dropdown` 包一级 / 二级 / 三级 | **与同级别主按钮一致** | **与同级别主按钮一致** | **与同级别主按钮一致** | **与同级别主按钮一致** |

| 元素 | 默认 | 悬停 | 禁用 |
|---|---|---|---|
| 下拉菜单面板 | 底 `white` | — | — |
| 菜单项 | 字默认 / 底 `white` | 底 `background-transparent-grey-hover` @6% | 字灰 / 底 `white`；悬停底 `background-transparent-grey-hover` @6% |

- 操作 ≥ 4 个时收纳进「更多」。

## 下拉按钮（"更多 ▼"）
| 类型 | antd | 默认 | 悬停 | 点击 | 禁用 |
|---|---|---|---|---|---|
| 链接 + `▼` | `Dropdown` + `variant="link"` | 字 `link-color` + `▼` / 透明底 | 字 `link-hover-color` / **无底** | 字 `link-active-color` / **无底** | 字 `text-color-disable` |

| 类型 | antd | 激活（展开） | 激活悬停 | 激活点击 | 禁用 |
|---|---|---|---|---|---|
| 链接 + `▲` | 同上，`open` 态 | 字 `link-color` + `▲` | 字 `link-hover-color` | 字 `link-active-color` | 字 `text-color-disable` |

- `▼` / `▲` 固定**文字右侧**（`iconPosition="end"`）；`ChevronDown` / `ChevronUp` **仅**用于本下拉与选择器。

## FAB（悬浮操作按钮）

| 类型 | antd | 默认 | 悬停 | 点击 | 禁用 |
|---|---|---|---|---|---|
| 单项（一级 / 二级）| `fab={true}` + `tone="primary"` / `"secondary"` | 一级绿底白字；二级白底黑字无描边 | 同上规范 | 同上规范 | 禁用灰 |
| 横向组合（2~3 段）| `SensFabGroup` `direction="horizontal"` | 整组 D4↓；配色与单项同源 | 同上 | 同上 | 同上 |
| 竖向组合（2~3 段，纯图标）| `SensFabGroup` `direction="vertical"` | 整组 D4↓；白底 + `icon-color-transparent` 图标 | hover `component-primary` / active `component-active` | 同上 | — |

- 单项：`fab={true}` 与 `tone="primary"|"secondary"` 组合；纯图标时 `shape="circle"`；交叉轴 `size/component-height/l`；横向 padding `spacing/horizontal/5x`。
- 组合：不走 `fab={true}` 嵌套，走 `SensFabGroup` 容器 + 分段；整组一层 D4，子段无 per-button 投影。
- FAB **全状态恒有 D4↓ 投影**（含禁用/加载，颜色仍走 `mask-01-transparent` 派生）。

## 条件投影（variant × state）

投影色统一：`mask-01-transparent` + 透明度派生（`color-utils.buildShadowD3/D4`），禁止业务代码写死 `rgba(11,12,13,…)`。

| variant | default | hover | active | disabled / loading / *Hover |
|---|---|---|---|---|
| 一级 `primary` | 无 | **D3↓** | 无 | 无 |
| 二级 `secondary` | 无 | **D3↓** | 无 | 无 |
| 警告二级 `dangerSecondary` | 无 | **D3↓** | 无 | 无 |
| 三级 / 虚线 / 链接 / 下拉 | 无 | 无 | 无 | 无 |
| FAB `fab={true}` / `SensFabGroup` | **D4↓** | **D4↓** | **D4↓** | **D4↓**（含禁用/加载） |

> 一级/二级/警告二级：`disabled` / `loading` / `*Hover` **强制无投影**（不得残留 hover 影）。FAB 不受此限，禁用/加载仍保留 D4。

| 投影档 | 公式 | 用途 |
|---|---|---|
| D3↓ | `0 2px 6px @10%` + `0 4px 12px @4%` | 一级/二级（含警告二级）仅 hover |
| D4↓ | `0 2px 12px @10%` + `0 4px 20px @8%` | FAB 全状态 |

实现：`build-tokens.mjs` → `components.Button.shadowHover/shadowFloating`；真实组件 `SensButton` 按 `tone` + hover/disabled 写 `style.boxShadow`；预览板 `ButtonStatesPreview` 静态样张内联同色值，**不在 Demo/CSS 写阴影**。

## 主题 token 映射（`build-tokens.mjs` → `theme.ts`，引用即可）
| 视觉语义 | Figma handle | antd token |
|---|---|---|
| 主色 / 一级默认 | `component-primary` | `colorPrimary` |
| hover 绿 | `component-hover` | `colorPrimaryHover`、Button `defaultHoverColor` |
| 点击绿 | `component-active` | `colorPrimaryActive`、Button `defaultActiveColor` |
| 禁用绿 | `component-disable` | primary disabled |
| 警告红 | `warning-color` / `warning-color-hover` / `warning-color-active` | `colorError` / `colorErrorHover` / `colorErrorActive` |
| 链接蓝 | `link-color` / `link-hover-color` / `link-active-color` | `colorLink` / `colorLinkHover` / `colorLinkActive` |
| 禁用文字 | `text-color-disable` | `colorTextDisabled` |
| 辅助文字 | `text-sub-color` | `colorTextSecondary` |
| 二级描边 hover/点击（无底） | `component-hover` / `component-active` | Button `defaultHoverBorderColor` / `defaultActiveBorderColor` |
| 三级文字 hover/点击（无底） | `component-hover` / `component-active` | Button `colorPrimaryTextHover` / `colorPrimaryTextActive`；背景 `colorPrimaryBg` / `colorPrimaryBorder` → `transparent`（**仅 `components.Button` 级覆盖**，不动根 token） |
| 警告三级文字 hover/点击（无底） | `warning-color-hover` / `warning-color-active` | Button `colorErrorBg` / `colorErrorBgActive` → `transparent`（**仅 `components.Button` 级覆盖**） |
| 虚线浅绿底 | `component-active-hover-background` / `component-active-click-background` | 仅虚线按钮 |
| 菜单项行底（中性灰） | `background-transparent-grey-hover` @6% / `background-01-transparent` @8% | 下拉菜单项（对齐 Select 未选中行） |
| 尺寸大/小 | `size/component-height/m`、`size/component-height/s` | `controlHeight`、`controlHeightSM`（`size="small"`） |
| 圆角 | `radius/m` | `borderRadius` |
| FAB 圆角 | `radius/circular` | `fab={true}` 或 `SensFabGroup` 外端 |
| 一级/二级 hover 投影 | `mask-01-transparent` → D3 | `components.Button.shadowHover` |
| FAB 全态投影 | `mask-01-transparent` → D4 | `components.Button.shadowFloating` |
| antd 默认投影 | — | `primaryShadow` / `defaultShadow` / `dangerShadow` → `none` |
