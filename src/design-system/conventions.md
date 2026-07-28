# 设计系统 skill · 全局实现约定 Conventions（所有组件通用）

> agent 生成/还原任何组件前先读这条。它解决"CSS 级联打架、状态被覆盖、要么砍列"这类问题。

## 1. 先判断承载方式，再用主题驱动
- 开始实现前先判断组件属于 **antd 承载 / 自持交互壳 / 混合承载**，不要默认所有组件都必须挂在 antd 交互层上。
- 选择 antd 承载时，样式与变体优先通过 **SensD token → antd 主题映射** + **antd props / variant** 表达。
- **禁止写一层平行的全局 CSS 去覆盖 antd 的 `ant-*` class**（如再写一套 `sens-btn-*` 盖 `ant-btn-*`）。
  这会因为组合爆炸（类型×尺寸×状态×danger×loading…）盖不全，漏掉的组合回退成 antd 默认，产生"幽灵样式"。
- 某个像素 antd 主题确实做不到时，才加**一条窄作用域**覆盖并写注释；不要成片覆盖。
- 如果需要重写 `hover`、`active`、`focus`、键盘、溢出、浮层、编辑或拖拽等核心交互，应暂停继续覆盖，重新评估自持交互壳或混合承载。
- 颜色永远从 SensD token / helper 取，不硬编码 hex。

### 无描边写法（判据：要不要保留那 1px 盒模型）
- **保留盒模型 / 与邻居对齐**（实心按钮、FAB、组合分段等 antd `Button` 仍占 1px 边框位）：用 `border-color: transparent`；**各态都设**（含 `hover` / `active` / `disabled` / `loading`），**不动 `border-width`**。在**原处**改色，勿另加一条竞争 CSS 盖回去。
- **彻底去掉嵌套 / 包裹层边框占位**（Input / TextArea / InputNumber / Search 内层、affix、handler 等）：用 `border: none`（必要时 `!important`；此场景为 conventions §1 既定的窄域例外）。

## 2. 状态：真实状态用 props，伪类不要伪造
- `disabled` / `loading` / 选中 / 展开 / 编辑等必须由组件的**真实 props 或内部状态**驱动，不用只为视觉展示而添加的 class 冒充真实状态。
- antd 承载时优先使用其真实 props，让组件计算对应结构和语义；自持交互壳则使用受控 / 非受控状态与正确的语义属性。
- `hover` / `active` 是**伪类**，只在真实交互时存在，**无法静态强制**。真实组件里不要伪造。

## 3. 组件层 vs 预览板层（关键，避免"要么打架、要么砍列"）
两层职责不同，别混：
- **真实组件**（`Sens*`，要上线的）：真实 props / 状态 + token 驱动，**不伪造任何状态**，保持干净。
- **预览 / 对照板**（文档展示层）：职责就是把**每个变体 × 尺寸 × 每个状态**都静态画出来，和 Figma 一一对应，**不要省略行/列**。
  - 默认/禁用/加载：使用真实组件 props / 状态。
  - 悬停/点击/禁用悬停/加载悬停：用一个 helper 把"该状态对应的 **token 颜色**"显式套到**那一个单元格**做成静态样张。
  - 这段画状态的逻辑**只存在于预览板**，从 token 取色，**不进真实组件、不做成全局 CSS**——所以不会引发级联打架。

## 4. 复合 / 多状态组件先比对交互模型
- 如果 SensD（= antd + 主题）已经覆盖目标结构和交互，优先使用真实组件，不手工重造。
- 如果 Figma / 产品规则与 antd 在核心状态上明显不同，不能仅因为已有 antd 组件就继续叠加覆盖。
- 允许使用混合承载，但组件文档必须写清：antd 保留什么、自持层接管什么、哪些默认行为被明确移除。
- 如果一个组件反复出现"哪些 antd 行为保留、哪些去掉"的讨论，视为重新评估承载方式的信号。

## 5. 还原与验收优先级
- 超大状态矩阵先保证**结构 / 颜色 / 尺寸 / token 来源**正确，再处理细节像素。
- 预览板中的交互态可以使用静态样张，但状态语义、背景归属、文字 / 图标 / 阴影变化必须与规则一致，不能用"大致相似"替代。
- 涉及编辑、键盘、拖拽、浮层、溢出或响应式的组件，必须另有真实 Demo 验证行为闭环；静态状态矩阵不能替代真实交互验收。

## 6. Design Token 准入

### 6.1 基础原则
- 组件实现必须显式消费 SensD token / helper / 已确认组件 token；底层可以使用 antd 组件，但 **antd token 不能作为设计来源**。
- `theme.ts` 中的 antd token 只是实现承接层，用于喂给 antd；真实组件和预览板若需要取色、取尺寸，应优先读 SensD handle、unit、typography、divider、shadow 或组件封装 helper。
- 缺少 token 时，先记录缺口和来源，再决定补 token、补 helper、写组件内受控常量，不能直接硬写一个无法解释的值绕过去。
- 生成文件 `tokens.resolved.json` / `theme.ts` 只能通过 `build-tokens.mjs` 生成，不手改。

### 6.2 尺寸 / 间距 token 命名
- 组件语义尺寸 token 采用 `<scope>/<object>/<property>` 命名，例如 `form/control/max-width`、`input-number/handle/width`。
- 只有满足以下条件时才新增组件级尺寸 token：它是稳定设计规则；会被组件实现、文档、样板间或 AI 生成规则反复消费；不能被现有 spacing / size / radius / typography token 准确表达；来源清楚。
- `0`、`100%`、`auto`、`1fr`、`min-width: 0`、`calc(...)` 等布局机制不沉为 design token。
- 图标 path、SVG viewBox、一次性预览矩阵宽高不沉为 design token。
- 未确认适用范围的特殊结构值，先写成组件内受控常量，并在组件文档标记 `To Confirm`；例如数字输入框步进器列宽这类内部结构值，不自动提升为全局 token。

### 6.3 颜色 token 命名与分层
- 颜色按 Foundation Color、Semantic Color、Component Color、Theme / Skin 分层判断；不要把基础色板路径直接当业务语义使用。
- 组件实现优先消费已有 Figma handle / SensD semantic handle，例如 `component-primary`、`component-hover`、`component-active`、`warning-color`、`text-color-transparent`、`text-sub-color-transparent`、`icon-color-transparent`、`link-color`。
- 透明色、投影色、active ring 等 alpha 场景通过 `tokenRgba(handle, alpha)` 或明确 helper 派生；不得手写 `rgba(...)` 字面量。
- 功能色组件才跟随 Functional Skin；状态色、链接色、警告色不因功能色换肤自动变化。
- 产品壳导航颜色走 Product Shell Theme / Navigation Color，不复用 Functional Skin。
- 如果只是 antd 需要某个别名，不新增设计 token；应在生成链路里把 antd token 映射到 SensD token。

### 6.4 组件级 token 判断
- 组件级 token 有必要，但只用于稳定的组件契约，不用于收纳所有不通用值。
- 应新增：组件规范的一部分；会被实现、文档、样板间、AI 生成规则共同引用；后续可能被主题或产品线调整；写死后容易漏改。
- 不新增：只在组件内部出现一次且不太可能被外部消费；结构几何；布局机制；预览页面临时排版；尚未确认适用范围的稿面值。
- 通用不等于必须跨所有组件；只要它在某个组件族内长期稳定，也可以录入，例如 `form/control/max-width`。
- 建议状态标记：`Ready` 表示已确认可长期消费；`To Confirm` 表示规则明确但范围未确认；`Missing` 表示 Figma / 规则要求存在但 token 未录入。

### 6.5 antd token 使用边界
- 禁止在组件实现中直接用 `token.colorPrimary`、`token.colorIcon`、`token.colorBgContainer`、`token.colorErrorHover` 等 antd token 作为样式来源。
- 需要这些语义时，改用明确的 SensD 来源，例如 `getColorToken("component-primary")`、`getColorToken("icon-color-transparent")`、`getColorToken("white")`、`getColorToken("warning-color-hover")`。
- 预览板静态样张同样遵守本规则：可以画 hover / active / disabledHover，但颜色必须从 SensD token/helper 来，不从 antd token 反查。
- 仅允许在 `build-tokens.mjs` / `theme.ts` 生成链路中出现 antd token 映射；组件文档需要说明 antd alias 对应的 SensD token，而不是把 antd alias 当设计规范。

## 7. 组件风险预检与完成验收

### 7.1 实施前评估卡

开始修改组件前，agent 必须先在对话中给出以下评估，等待范围确认后再写代码：

```md
## 组件实施前评估

- 组件类型：低交互 / 高交互
- 基础承载：antd / 自持交互壳 / 混合
- antd 保留能力：
- antd 明确移除能力：
- 状态矩阵：
- 鼠标交互：
- 键盘交互：
- 背景与容器所有权：
- 浮层 / 溢出策略：
- token 来源：
- 真实 Demo 验收范围：
- 已知边界：
```

评估卡必须回答"谁负责什么"，尤其是：

- 背景属于整组容器还是单项。
- 选中、编辑、展开等状态由谁维护。
- 浮层由谁触发、渲染、定位和关闭。
- 鼠标与键盘事件在哪一层生效。
- 第三方组件的默认行为哪些被保留、哪些被移除。

### 7.2 承载方式判断

- 主要修改颜色、尺寸、间距、排版、圆角：优先保留 antd。
- 需要精确控制键盘、溢出、浮层、编辑、拖拽等核心行为：优先自持交互壳。
- antd 只满足基础布局，但部分交互需自定义：允许混合承载，并记录清晰边界。
- 持续增加 `.ant-*`、`!important`、事件拦截或默认浮层兼容逻辑：暂停横向补丁，重新评估承载方式。

### 7.3 浮层与溢出拆分

遇到下拉、Tooltip、More、Popover 等问题时，至少拆开判断：

1. 谁触发展开。
2. 谁维护展开状态。
3. 浮层渲染到哪里。
4. 浮层如何定位、关闭和随容器 / 窗口变化重算。
5. 谁决定哪些内容可见、哪些进入溢出区。

定位能力与内容分配能力不是同一层；只抽取已经出现两个以上消费者的稳定能力，不提前泛化整个交互模型。

### 7.4 完成验收

组件完成后，必须按实施前评估卡逐项回验，并报告：

- 默认、hover、active、selected、disabled 及组件专属状态是否完整。
- 鼠标、键盘、编辑、关闭和取消路径是否闭环。
- 窄容器、宽容器、滚动、溢出和浮层是否稳定。
- 颜色、间距、字体、圆角、阴影是否来自 SensD token / helper。
- 功能色组件换肤后是否仍然正确。
- 是否同时具备真实 Demo 和必要的静态状态矩阵。
- 组件文档、设计规范和实现是否保持同一口径。
- 哪些第三方组件行为仍是已知边界，而不是包装成"已完成"。

### 7.5 经验提升规则

- 第一次出现的问题：记录在对应组件文档。
- 同类问题在第二个组件再次出现：提炼后提升到本文件。
- 至少两个组件需要相同代码能力：再考虑抽为 helper / hook / 基础能力。
- `DESIGN.md` 只维护项目入口、层级和总原则，不复制本文件的完整检查细则。

## 相关文档
- 按钮（变体矩阵、预览板示例）：`src/design-system/components/base/button.md`
- 标签页（高交互、浮层、编辑、拖拽与自持交互案例）：`src/design-system/components/base/tabs.md`
