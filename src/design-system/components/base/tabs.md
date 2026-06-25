# 设计系统 skill · 基础组件：标签页 Tabs

> 基础层，直接用 antd + 主题 token，不要硬编码颜色。
> 设计选型与交互原则见 `tabs.design.md`；本文只写实现映射与和 antd 不同的点。

## 通则
- **实现方式遵循 `conventions.md`**：真实组件 `Sens*` 用 props + token，不伪造 hover/选中 等伪类；预览对照板 `TabsStatesPreview` 把变体×状态静态画全，悬停/选中等用 token 内联着色（仅预览层）。
- **尺寸只有两种**：大（`Tabs` 传 `middle` / 默认）、小（`size="small"`）。不要用 antd `large`。
- 标题超长：≤8 字展示，超出 `…` + `Tooltip`（`ellipsisLabel`）。
- 文案走 i18n（`组件库` 命名空间），不要硬编码。

## 三类组件与 antd 映射

| 类型 | 组件 | antd |
|---|---|---|
| 基础标签页 | `SensBasicTabs` | `<Tabs items={…} />`（line）|
| 页签标签页 | `SensEditableCardTabs` | `<Tabs type="editable-card" onEdit={…} />` |
| 胶囊标签页 | `SensPillTabs` | `<Segmented options={…} />`（独立使用，不与其他 Tabs 混搭层级）|

## SensBasicTabs
- `size?: "large" \| "small"`，默认 `large`。
- `withBadge?: boolean`：第二项标题可配数字徽标（`6`）演示徽标组合；默认灰底灰字，选中态切换为浅绿底绿字。
- 选中态：绿字 + 底部 ink bar（主题 `Tabs` token）。

## SensEditableCardTabs
- 内置增删页签；**至少保留 1 个**页签（删到最后一个时不再删）。
- `onEdit`：`add` 追加新页签并激活；`remove` 过滤并修正 `activeKey`。
- **TODO（规范要求，antd 无原生）**：双击编辑标题、拖拽排序。

## SensPillTabs
- `size?: "large" \| "small"`；`withBadge?: boolean`（第三项演示数字徽标）。
- 选中：白底 + D1 投影 + 绿字（`component-primary`）；选中悬停字色 `component-hover`。
- 未选中悬停：文字切 `component-primary`；未选中点击：文字切 `component-active`。
- 徽标：默认灰底灰字；悬停/点击/选中切浅绿底+绿字；禁用/禁用悬停保持灰底，字色按禁用层级衰减。
- 演示数据最后一项 `disabled: true` 展示禁用胶囊项。

## 状态矩阵（Figma 2220:10665）
- 基础 / 胶囊：默认、悬停、点击、选中、选中悬停、禁用、禁用悬停 × 大/小 × 徽标有无。
- 页签：默认、悬停标题、悬停删除、编辑前、编辑中 × 当前项 True/False。
- 实现：`TabsStatesPreview`（`src/ui/SensTabs.tsx`），伪类态仅存在于预览板。

## 主题 token（`theme.ts` → `components.Tabs` / `Segmented`）
| 语义 | 典型 handle |
|---|---|
| 选中文字 / ink | `component-primary`（功能色变量，**随换肤**） |
| hover 绿 | `component-hover`（功能色变量，**随换肤**） |
| 点击绿 | `component-active`（功能色变量，**随换肤**） |
| 胶囊选中底 | `white`（`colorBgContainer`） |
| 胶囊选中投影 | `默认投影（向下）/D1` |
| 删除 hover 红 | `warning-color` |

**功能色取色约束（基础 / 胶囊标签页）：**
- 选中、悬停、点击三类绿色均走**主题变量**（`component-primary` / `component-hover` / `component-active`），不写死 hex，不写状态色；换肤时随 `theme.ts` 联动。
- 实现侧优先经 antd 主题 token（如 `colorPrimary`、`colorPrimaryHover`、`colorPrimaryActive`）或 `theme.useToken()` 读取，避免静态 `tokens.resolved.json` 硬绑单色值。

## 代码入口
```
src/ui/SensTabs.tsx    # SensBasicTabs / SensEditableCardTabs / SensPillTabs + TabsStatesPreview
src/ui/tabs.css        # 胶囊 label、预览板窄作用域样式
src/ui/index.ts
```
