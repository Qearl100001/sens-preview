# SensCard

> 基础卡片容器组件，承接 Card Foundation 的容器、状态和 token 规则。
> 成熟度：Pilot
> 实现：Ready
> 验证：Pending
> 研发预览：`/components/card`
> 基础数值：`/basic-styles/card`

## 定位

`SensCard` 是可复用的基础容器，不定义具体业务字段和信息架构。它可以承载自由内容、标题区、内容区和操作区；入口卡片使用 `SensEntryCard`，数据源卡片等业务卡片应在此基础上组合。

## API

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `variant` | `outline \| filled` | `outline` | 描边卡片或弱层级色块卡片 |
| `interactive` | `boolean` | `false` | 开启 hover / pressed 交互样式；点击语义由宿主提供 |
| `pressable` | `boolean` | `true` | 是否启用 interactive 卡片的 pressed / 激活投影；操作外露型卡片设为 `false` |
| `selected` | `boolean` | `false` | 选择型卡片的激活视觉，不替代宿主选择语义 |
| `disabled` | `boolean` | `false` | 禁用卡片交互和内容层级 |
| `error` | `boolean` | `false` | 错误状态 |
| `children` | `ReactNode` | - | 卡片内容 |

组件同时继承 `HTMLAttributes<HTMLDivElement>`，可通过 `className`、`style`、`role`、`aria-*` 和 `onClick` 接入页面语义。

## 基础规格

| 使用点 | Token | 数值 |
|---|---|---:|
| 内边距 | `spacing/4x` | 16px |
| 圆角 | `radius/l` | 6px |
| 描边卡片背景 | `white` | - |
| 色块卡片背景 | `background-transparent-grey @4%` | - |

通用卡片状态样张使用 `spacing/3x = 12px` 内边距和 `radius/l = 6px` 圆角；这是该组合样张的承载尺寸，不新增 Card 全局 padding 档位。

## 状态

- `interactive` 卡片：默认、hover、pressed；hover 使用 `shadow/D3/down`，pressed 使用功能色 active ring。操作外露型卡片通过 `pressable={false}` 关闭 pressed / 激活投影，仅保留 hover。
- 通用卡片状态样张补充 default / hover / pressed / selected / selected hover / disabled / disabled hover 七种状态；它们复用 `SensCard`，不新增 `SensGenericCard`。
- 通用卡片的 selected 只表达宿主传入的视觉状态，不自动产生选择业务语义；需要真实选择时，由宿主组合 `SensCheckbox`、`role` 和 `aria-checked`。
- `selected` 只用于选择型卡片：选择框复用 `SensCheckbox` 的 control-only 视觉和 checked 状态；卡片容器使用功能色 active 描边、active 浅背景和 `shadow/active-ring/functional` 外环，选中悬停时复用 `shadow/D3/down`。
- 选择型卡片的操作区与网格视图操作外露型卡片一致：默认使用 `linkWeak`，每个按钮只在自身 hover / active 时使用 `link-color`；下拉菜单打开时，底部“更多”和右上角更多图标保持链接色。两处“更多”均通过点击打开链接菜单。
- `disabled`：灰背景、浅描边和禁用文字；禁用悬停可以保留 D3 投影。
- 禁用状态样张中的操作区使用真实 `SensButton disabled` 和 `SensButtonActionMenu disabled`，保证禁用属性和菜单不可打开的行为与业务消费一致。
- `error`：警告浅底和警告描边；错误说明文案由宿主放在卡片外部或内容区下方。

标题区组合示例中的拖拽手柄使用 `SensButton tone="linkWeak"` 承接图标，默认图标使用 `icon-color-transparent`，hover / active 使用链接按钮的蓝色规则，并使用 `move` 鼠标手势。图标和标题文字在同一行的交叉轴上居中。标题区不额外放置展开箭头；真实拖拽排序仍由业务宿主负责。

## 入口型卡片

`SensEntryCard` 是建立在 `SensCard` 之上的业务组合组件，用于具备导航属性的功能入口。它的结构、尺寸和七种状态见 `entry-card.md` / `entry-card.design.md`；具体入口分组和页面布局进入卡片样板间。

## 操作外露型卡片

对于只能操作、不能选中的卡片，宿主组合内容区和操作区，不给 `SensCard` 添加 `selected` 或 checkbox 语义：

```tsx
<SensCard interactive pressable={false}>
  <CardContent />
  <SensButton tone="linkWeak">操作 1</SensButton>
  <SensButton tone="linkWeak">操作 2</SensButton>
  <SensButtonActionMenu
    tone="linkWeak"
    showChevron
    items={[
      { key: "operation-3", label: "操作 3", variant: "link" },
      { key: "operation-4", label: "操作 4", variant: "link" },
      { key: "operation-5", label: "操作 5", variant: "link" },
    ]}
  >
    更多
  </SensButtonActionMenu>
</SensCard>
```

右上角更多使用可聚焦的纯图标按钮，并复用同一套动作菜单。操作菜单由宿主负责业务动作、打开状态和菜单项内容；`SensCard` 只负责容器和 hover 外观，不产生 pressed / 激活投影。该卡片宽度由外部布局、栅格和页面容器决定，不设置固定最大宽度。

操作区分割线需要通栏铺满卡片宽度；内容区与分割线之间保留 `spacing/3x = 12px` 间距，40px 操作栏自身保持 `9px` 上下内边距。

## 边界

`SensCard` 不负责：

- DataSourceCard 等其他业务字段结构。
- 卡片列表布局、网格列数和响应式策略。
- 标题区必须存在、标题区图标或操作区布局。
- 拖拽、排序和复杂选择逻辑。
- 操作外露型卡片的业务动作和菜单项内容。

这些能力由业务组合组件或页面宿主负责。

## 消费示例

```tsx
<SensCard variant="outline" interactive onClick={handleOpen}>
  内容区域
</SensCard>
```

```tsx
<SensCard selected role="checkbox" aria-checked={selected}>
  选择型卡片
</SensCard>
```

## 验收要求

- 真实 Demo 和状态矩阵均应能看到 `radius/l = 6px`。
- 普通交互卡片的 `default / hover / pressed / disabled / error / selected` 状态与 Card Foundation 一致；操作外露型卡片额外验收 `pressable={false}`、无 pressed / 激活投影、宽度随容器自适应。
- 颜色、圆角、间距和投影必须来自 token / helper，不新增游离圆角值。
- 组件不应新增 `.ant-*` 强覆盖或 `!important`。
