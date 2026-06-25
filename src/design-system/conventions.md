# 设计系统 skill · 全局实现约定 Conventions（所有组件通用）

> agent 生成/还原任何组件前先读这条。它解决"CSS 级联打架、状态被覆盖、要么砍列"这类问题。

## 1. 用主题驱动，不要对抗 antd
- 样式与变体一律通过 **antd 主题 token**（全局 token + `components.X`）+ **antd props / variant** 表达。
- **禁止写一层平行的全局 CSS 去覆盖 antd 的 `ant-*` class**（如再写一套 `sens-btn-*` 盖 `ant-btn-*`）。
  这会因为组合爆炸（类型×尺寸×状态×danger×loading…）盖不全，漏掉的组合回退成 antd 默认，产生"幽灵样式"。
- 某个像素 antd 主题确实做不到时，才加**一条窄作用域**覆盖并写注释；不要成片覆盖。
- 颜色永远从 token 取，不硬编码 hex。

### 无描边写法（判据：要不要保留那 1px 盒模型）
- **保留盒模型 / 与邻居对齐**（实心按钮、FAB、组合分段等 antd `Button` 仍占 1px 边框位）：用 `border-color: transparent`；**各态都设**（含 `hover` / `active` / `disabled` / `loading`），**不动 `border-width`**。在**原处**改色，勿另加一条竞争 CSS 盖回去。
- **彻底去掉嵌套 / 包裹层边框占位**（Input / TextArea / InputNumber / Search 内层、affix、handler 等）：用 `border: none`（必要时 `!important`；此场景为 conventions §1 既定的窄域例外）。

## 2. 状态：真实状态用 props，伪类不要伪造
- `disabled` / `loading` / 选中 等是 antd **真实 props**：用 props 渲染，antd 会算好样式，**不要手动重定义**
  （否则会出现"禁用和加载本该相近却长得不一样"这类问题）。
- `hover` / `active` 是**伪类**，只在真实交互时存在，**无法静态强制**。真实组件里不要伪造。

## 3. 组件层 vs 预览板层（关键，避免"要么打架、要么砍列"）
两层职责不同，别混：
- **真实组件**（`Sens*`，要上线的）：props + token 驱动，**不伪造任何状态**，保持干净。
- **预览 / 对照板**（文档展示层）：职责就是把**每个变体 × 尺寸 × 每个状态**都静态画出来，和 Figma 一一对应，**不要省略行/列**。
  - 默认/禁用/加载：用 antd 真实 props。
  - 悬停/点击/禁用悬停/加载悬停：用一个 helper 把"该状态对应的 **token 颜色**"显式套到**那一个单元格**做成静态样张。
  - 这段画状态的逻辑**只存在于预览板**，从 token 取色，**不进真实组件、不做成全局 CSS**——所以不会引发级联打架。

## 4. 复合 / 多状态组件优先用 sensd
- 这类状态组合，sensd（= antd + 你们主题）里研发已调好。能装 sensd（切 `ui.ts`）就用真实组件，别手工重造。

## 5. 还原态度
- 超大状态矩阵先让**结构 / 颜色 / 尺寸**对（token 已配好），交互态样张大致对即可，不逐格抠像素。

## 相关文档
- 按钮（变体矩阵、预览板示例）：`src/design-system/components/base/button.md`
