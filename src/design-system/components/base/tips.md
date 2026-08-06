# 设计系统 skill · 基础组件：便签 Tips

> **状态：P0 已实现（常规）。** `SensTips` + `/components/tips`（侧栏「便签」）。
> 设计语义与取舍以本文为准。
> 与 **轻提示 Message**、**警告 Alert** 不同：便签依附触发源、悬停/聚焦出现，不是页面反馈条。
> **高级便签**属业务组件，不在基础组件范围。

## 来源

| 资料 | 链接 / 位置 | 用途 |
|---|---|---|
| Sens.Design 便签专档 | [Figma · 校准版](https://www.figma.com/design/lCQghHNcFr1Dj026sOuyFn/Sens.Design_%E4%BE%BF%E7%AD%BE-v2.1_20230426?node-id=1901-10240&m=dev) | 定义 / 原则 / 类型 / 场景 / 常规交互与 UI |
| 常规 · 交互 | 专档 `06`–`08` | 悬停延迟、消失、点击无反馈、自动出现边界 |
| 常规 · UI | 专档 `09`–`10` | 尺寸、箭头、间距、最大宽 |
| 背景色 | `Color.json` → `tooltip-background`（定制色/便签/背景/01） | 深色底 |

## 通则

- **一个组件 + 属性**：对外 `SensTips`；侧栏文案 **「便签」**；预览独立路由。
- **形态（常规）**：深底 + 白字 + 三角箭头；指向触发源。
- **主交互**：鼠标悬停出现（延迟 **0.1s**）；离开触发源或便签区域立即消失；点击便签本身无反馈。
- **内容**：常规便签原则上只承载**纯文案**。
- **承载**：**Sens 自持**浮层（`createPortal`），不使用 antd Tooltip 视觉层。
- **实现遵循 `conventions.md`**：props + design token；禁止硬写 hex。

## 组件边界

- 负责：常规便签的出现/消失、四向定位、箭头与视觉 token。
- 不负责：高级便签（可嵌自定义内容 / 复杂业务卡片）——业务组件另立。
- 不负责：Message / Alert / 抽屉说明文案。
- 触发源仍属各业务组件；Tips 只提供浮层契约。
- 同一触发源多便签碰撞时，不允许同时展示多条；优先级见专档（禁用原因 > 截断说明 > 操作引导）。P0 组件层不实现冲突仲裁，由调用方保证单一 `title`。

## 已确认决策

| 决策 | 结论 | 日期 |
|---|---|---|
| 命名 | 组件 `SensTips`；侧栏「便签」 | 2026-07-31 |
| 承载 | Sens 自持浮层，不用 antd Tooltip 视觉 | 2026-07-31 |
| P0 范围 | 仅常规便签 | 2026-07-31 |
| 高级便签 | 业务组件，不进基础组件 | 2026-07-31 |
| 箭头 | 常规中置箭头用组件常量：指向深度 6、横向展开 16；暂不升全局 token | 2026-07-31 |
| 热区 | 触发源与便签区域需短暂连通，允许鼠标移入便签并选中文案 | 2026-07-31 |
| 12 向 | `placement` × `align`（start/center/end）组成上左…右下；尖端对准触发源中心 | 2026-07-31 |
| 自动避让 | portal 默认 `autoAdjust`：先试传入 `placement`，再上→左→右→下 | 2026-07-31 |
| 宽触发源对齐 | 触发源宽 ≥300 时按指针前/中/后 1/3 推导 `align`；无指针回退 prop | 2026-07-31 |

## SensTips API

```ts
type SensTipsPlacement = "top" | "bottom" | "left" | "right";
type SensTipsAlign = "start" | "center" | "end";

type SensTipsProps = {
  title: React.ReactNode;       // 便签正文
  children: React.ReactElement; // 触发源
  placement?: SensTipsPlacement; // 默认 top
  align?: SensTipsAlign;         // 默认 center；与 placement 组成 12 向
  open?: boolean;               // 受控；矩阵静态样张用
  defaultOpen?: boolean;
  mouseEnterDelay?: number;     // 默认 100
  strategy?: "portal" | "anchored"; // 默认 portal；矩阵用 anchored
  autoAdjust?: boolean;         // 默认 true；仅 portal；避让 + 宽触发源分段
};
```

| 属性 | 含义 |
|---|---|
| `title` | 便签文案 |
| `children` | 单个触发元素 |
| `placement` | 上 / 下 / 左 / 右 |
| `align` | 上下方向为左 / 中 / 右；左右方向为上 / 中 / 下 |
| `open` | 受控显隐 |
| `mouseEnterDelay` | 悬停出现延迟（ms） |
| `autoAdjust` | 自动避让与宽触发源分段对齐；`anchored` 忽略 |

## 尺寸 / Token

| 项 | 规则 | token / 常量 |
|---|---|---|
| 背景 | 深灰 | `tooltip-background` |
| 文案色 | 白 | `white` |
| 字号 / 行高 | 14 / 22 | `font-size/m` / `line-height/m` |
| 水平 padding | 10 | `spacing/horizontal/2.5x` |
| 垂直 padding | 6 | `spacing/vertical/1.5x` |
| 圆角 | 4 | `radius/m` |
| 最大宽 | 300（不足随文案变窄；横向排版） | `SENS_TIPS_MAX_WIDTH`（组件契约；Figma `6613:32568`） |
| 最大高 | 10.5 行文字区；气泡 `max-height` = 行高合计 + 上下 pad；超出内滚 | `SENS_TIPS_MAX_LINES` × `line-height/m` + 2×`spacing/vertical/1.5x`（Figma `6613:32687`） |
| 滚动条 | 拇指宽 6、圆角 3、白 80% | `SENS_TIPS_SCROLLBAR_SIZE`；`radius/s`；`tokenRgba(white, 0.8)` |
| 箭头深度 / 展开 | 6 / 16 | `SENS_TIPS_ARROW_DEPTH` / `SENS_TIPS_ARROW_CROSS_SIZE`；path=`SENS_TIPS_ARROW_PATH`（Figma 1172:218） |
| 边对齐箭头槽 | 上下 28（6+16+6）/ 左右 22（6+16） | `SENS_TIPS_ARROW_EDGE_SLOT_INLINE` / `BLOCK`；角空隙 `SENS_TIPS_ARROW_EDGE_GAP` |
| 边对齐尖端距边 | 上下 / 左右均为 14 | `SENS_TIPS_ARROW_EDGE_INSET_INLINE` / `BLOCK`（左上左下右上右下距角 6） |
| 与触发源间距 | 4 | `spacing/1x`（`SENS_TIPS_GAP`） |
| 出现延迟 | 100ms | `SENS_TIPS_ENTER_DELAY_MS` |
| 离开热区缓冲 | 80ms | `SENS_TIPS_LEAVE_GRACE_MS`（仅桥接浮层热区） |
| z-index | 1060 | `SENS_TIPS_Z_INDEX` |
| 定位策略 | `portal`（默认）/ `anchored`（矩阵） | `strategy` |
| 自动避让 | 先试 `placement`，再上→左→右→下；仅 portal；视口边距 8 | `autoAdjust`；`SENS_TIPS_VIEWPORT_MARGIN` |
| 宽触发源分段 | 宽 ≥300 按指针前/中/后 1/3 推导 align | `SENS_TIPS_WIDE_TRIGGER` |
## 适用场景（摘要）

推荐：帮助 icon 说明、短按钮补充、截断全文、禁用/加载原因、操作建议。  
不推荐：把关键必读信息只藏在便签里（应常驻展示）。

## 验收规则

- 常规视觉：深底白字、14 / 22、水平 10、垂直 6、圆角 4、最大宽 300（不足随文案变窄）、最高 10.5 行超出内滚。
- 矩阵 12 向：上左 / 上中 / 上右 / 下左 / 下中 / 下右 / 左上 / 左中 / 左下 / 右上 / 右中 / 右下；箭头尖端对准触发源中心。
- portal 贴边时自动换向（先试传入方向，再上→左→右→下）；触发源宽 ≥300 时悬左段→上左、悬中→上中、悬右→上右（左右向同理上中下）。
- 箭头必须指向触发源；不能退回浏览器原生 `title` 或 antd Tooltip 视觉。
- 悬停 0.1s 出现；离开触发源和便签区域后消失；点击便签本身不触发反馈。
- 触发源到便签之间要有可通过热区，便签正文可被鼠标选中/复制。
- 禁用态触发源如果需要说明原因，应由外层可交互容器承接 `SensTips`，不要依赖 disabled 控件自身事件。
- 单个触发源同一时间只展示一个便签；禁用原因优先于截断说明，截断说明优先于操作引导。

## 与相邻组件边界

| 组件 | 关系 |
|---|---|
| 轻提示 `SensMessage` | 页面顶部短反馈，非依附触发源 |
| 警告 `SensAlert` | 页内通栏提示条 |
| Tag / Title / Form 等 | 帮助 / 截断文案已换 `SensTips`；Table `showSorterTooltip` 仍走 antd 内置 |

## 待补

- [x] P0：常规 `SensTips` + `/components/tips` + 侧栏「便签」
- [x] 四向 placement + 悬停延迟 / 热区可移入 / 文案可选中
- [x] 12 向：`placement` × `align`（矩阵 4×3）
- [x] 消费方替换（Tag / Title / Form / Pagination / Input / Tabs / TableEllipsis / SideNav + Checkbox/Radio/Button 样张）
- [x] 自动方向避让 / 碰撞处理：优先上 > 左 > 右 > 下（`autoAdjust`，仅 portal）
- [x] 触发源宽度 ≥300 时，按前 / 中 / 后分段就近定位
- [x] 长文案：最大宽 300 + 最高 10.5 行内滚（滚动条白 80% / 宽 6 / `radius/s`）
- [ ] 「自动出现的单次稳定」便签（特殊引导）后置
- [ ] Table `showSorterTooltip`（antd Table 内置）另议

## 代码入口

```text
src/ui/SensTips.tsx
src/ui/tips.css
src/preview/pages/TipsShowcasePage.tsx
src/design-system/components/base/tips.md  # 本文
src/design-system/components/base/tips.design.md
```
