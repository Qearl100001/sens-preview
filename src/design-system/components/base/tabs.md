# 设计系统 skill · 基础组件：标签页 Tabs

> 基础层；基础标签页和页签标签页仍基于 antd 宿主，胶囊标签页改为自持交互壳；不要硬编码颜色。
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
| 胶囊标签页 | `SensPillTabs` | 自持 button 组（独立使用，不与其他 Tabs 混搭层级）|

## SensBasicTabs
- `size?: "large" \| "small"`，默认 `large`。
- `withBadge?: boolean`：第二项标题可配数字徽标（`6`）演示徽标组合；默认灰底灰字，选中态切换为浅绿底绿字。
- 选中态：绿字 + 底部 ink bar（主题 `Tabs` token）。

## SensEditableCardTabs
- 内置增删页签；**至少保留 1 个**页签（删到最后一个时不再删）。
- `onEdit`：`add` 追加新页签并激活；`remove` 过滤并修正 `activeKey`（删当前时激活上一个）。
- **编辑标题（已落地）**：双击标题先进入 `编辑前` 过渡态（`component-primary` 底 + `white` 字），再切到 `编辑中` 输入态；失焦 / Enter 保存，Esc 取消；编辑中锁标题槽宽，不撑开页签。细则见 `tabs.design.md`「编辑 / 拖拽」。
- **键盘删除约束（已落地）**：`Delete` / `Backspace` 不作为删页签捷径；仅在标题输入框内保留正常删字。
- **过长标题**：≤8 字展示，超出 `…`；悬停展示完整标题（深色 tooltip）。未截断时：当前项提示「双击编辑/按住拖动排序」，其他项「按住拖拽排序」。
- **拖拽排序（已落地）**：标题区 Pointer 拖拽；位移超阈值后开始拖并选中该页签；X 位移超邻页半宽则换位；按下后强制关闭 tooltip。关闭 / 加号 / 更多不参与拖拽。鼠标态按 SensD「移动」规则，实现为系统 **`move`**（`--sens-cursor-move`），悬停可拖与拖中一致；**不用** `grab` / `grabbing`。见 `docs/foundations/cursor.md`。
- **更多溢出（已落地）**：页签超过条宽时显示 `More` 触发器；菜单固定 `188px`，锚在箭头下方偏左，列出当前整组页签且不提供删除；当前页签在菜单内按单选下拉语义展示为浅绿底 + 深色 semibold + 右侧勾选，未选中悬停为灰底中性色。展示页默认用 12 个页签 + 初始展开态做稳定验收。
- **最小复用边界（已收敛）**：`More` 的展开/关闭、fixed 锚定定位、窗口变化后的重同步，统一走内部 `useAnchoredOverflowMenu` + `.sens-anchored-overflow-dropdown`；这层只解决弹层怎么开和怎么放，**不**负责 `rc-tabs` 的可见页签分配。

### 组件边界（页签标签页）

| 层 | 承接 | 不承接 |
|---|---|---|
| 基础 · 页签标签页 | 增删、加号、关闭、双击改标题、更多溢出、与内容区缝合、拖拽排序 | 整页壳、业务对象、跨组件工作台套路 |
| 复合 | 仅当出现可复用的「页签 + 其它基础组件」稳定组合（如页签 + 筛选 + 表） | 重新定义页签本体交互 |
| 样板间 | 带业务对象的多页签整页 | 把页签 chrome 规则写进业务页 |

## SensPillTabs
- `size?: "large" \| "small"`；`withBadge?: boolean`（第三项演示数字徽标）。
- 实现：自持按钮条，不再依赖 `antd Segmented` 的 DOM、状态类和默认交互。
- 未选中：整条标签带共用连续灰底；单项自身透明，悬停/点击不换背景，仅字色切到 `component-primary` / `component-active`。
- 选中：白底 + D1 投影 + 绿字（`component-primary`）；选中悬停保持白底，仅字色切到 `component-hover`。
- 禁用：延续标签带灰底，单项自身透明；字色切到 `text-color-transparent-disable`，禁用悬停切到 `text-color-transparent-disable-hover`。
- 徽标：默认灰底灰字；悬停/点击/选中切浅绿底+绿字；禁用/禁用悬停保持灰底，字色按禁用层级衰减。
- 展示页最后一项固定 `disabled: true`，用于真实态走查。

## 状态矩阵（Figma 2220:10665）
- 基础 / 胶囊：默认、悬停、点击、选中、选中悬停、禁用、禁用悬停 × 大/小 × 徽标有无。
- 页签：默认、悬停标题、悬停删除、编辑前、编辑中 × 当前项 True/False。
- 实现：`TabsStatesPreview`（`src/ui/SensTabs.tsx`），伪类态仅存在于预览板。

## 主题 token（同源 handle）
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
- 基础 / 页签标签页可继续复用 antd 主题映射；胶囊标签页优先直读 design token handle，自持交互结构，不再绑定 `Segmented` 运行时类名。

## 代码入口
```
src/ui/SensTabs.tsx    # SensBasicTabs / SensEditableCardTabs / SensPillTabs + TabsStatesPreview
src/ui/tabs.css        # 胶囊 label、预览板窄作用域样式
src/ui/index.ts
```

## 实现复盘：高交互 Tabs

### 为什么这次反复调整

Tabs 表面上只是几种标签样式，实际包含三套不同复杂度的交互模型：

- 基础标签页与 antd 默认模型接近，适合继续使用主题和 props 承载。
- 页签标签页包含增删、编辑、拖拽、键盘、溢出和内容区缝合，属于高交互组件。
- 胶囊标签页视觉简单，但背景归属和各状态规则与 antd Segmented 明显不同。

本轮反复对齐的根本原因，是一度把"交互模型不同"当成了"antd 外观换肤"。当第三方组件的默认状态不断漏出时，继续增加覆盖只会把问题推迟到下一个状态。

### 主要问题与解决策略

| 问题 | 原因 | 策略 |
|---|---|---|
| More 箭头出现但菜单不按预期展开 | rc-tabs 默认浮层与自定义展开状态互相影响 | 接管展开状态，隐藏默认浮层，通过 Portal 渲染项目自己的菜单 |
| 菜单容易被裁切或定位漂移 | 父容器 `overflow` 和定位上下文影响浮层 | 使用 fixed 锚定定位，并用 `useAnchoredOverflowMenu` 统一展开、关闭和重同步 |
| 菜单样式与 SensD 选择器不一致 | 直接沿用 antd Tabs 默认菜单 | 复用 SensD 下拉菜单 token、阴影、选中底色和勾选语义 |
| 点击菜单项没有形成完整切换 | 浮层展示与页签 activeKey 没有闭环 | 选择菜单项时更新 activeKey、关闭菜单并同步当前项 |
| 编辑状态与 Figma 不一致 | 直接出现输入框，缺少"编辑前"状态 | 建立普通 → 编辑前选区 → 编辑中的明确状态链 |
| 编辑时页签宽度跳动 | 输入框自然宽度改变标题槽位 | 进入编辑前记录并锁定标题槽宽 |
| Delete、拖拽和 Tooltip 相互干扰 | 同一区域同时承担选择、提示、编辑和拖拽 | 分层处理键盘事件，增加拖拽阈值，拖拽开始后关闭 Tooltip |
| 拖拽换位容易抖动 | 指针移动缺少稳定边界 | 越过相邻页签中线并增加迟滞后再换位 |
| 胶囊项出现多余 hover / disabled 背景 | Segmented 默认状态与 Figma 不同 | 去掉 Segmented，改为自持 button 组 |
| 灰底被拆成多个小块 | 把轨道背景误认为单项背景 | 灰底归整条标签带；未选中各态单项透明，只有选中项为白底 |
| 灰色轨道延伸到内容后方 | 外层 block 和内层最小宽度强制铺满 | 外层内容自适应，内层使用 max-content，超出容器后再滚动 |
| 换肤后状态色可能失效 | 直接依赖固定值或 antd 运行时 token | 统一使用 SensD handle / helper 作为设计来源 |

### 形成的承载边界

- `SensLineTabs`：继续使用 antd Tabs，项目负责 token 和轻量结构封装。
- `SensPillTabs`：自持按钮条，项目负责全部状态和背景结构。
- `SensEditableCardTabs`：当前为混合承载；rc-tabs 负责基础布局和可见项计算，项目负责编辑、拖拽、键盘、More 菜单及定位。

### 后续遇到类似问题时

1. 先列状态矩阵和事件路径，再选择基础组件。
2. 明确背景、选中、焦点、浮层和键盘事件分别由哪一层负责。
3. 将浮层问题拆成触发、状态、渲染、定位、关闭和内容分配。
4. 同时保留真实 Demo 与静态状态矩阵；前者验行为，后者验视觉覆盖。
5. 如果持续增加 `.ant-*`、`!important` 和事件拦截，停止继续补丁并重新评估自持交互壳。
6. 实现结束后同步检查设计规范、研发文档、Demo 和已知边界。

### 当前已知边界

页签标签页的 More 菜单、展开状态和定位已经由项目接管，但"哪些页签保持可见、哪些进入 More"仍由 rc-tabs 默认溢出算法决定。当前需求不需要继续扩；只有未来要求不同宽度下的可见页签分配也完全自定义时，才需要进一步自持整个页签条。
