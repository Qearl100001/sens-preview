# TitleBar 代码落地规则

## 组件入口

抽屉标题栏 `SensTitleBar` 暴露在 `src/ui`：

- `title`：标题内容
- `onBack`：传入后显示返回图标
- `actions`：右侧操作区

页面标题栏 `SensPageTitleBar` 暴露在 `src/ui`：

- `variant`：`landing` / `drilldown`；不传时会按是否有面包屑或返回入口推断，业务页建议显式传入
- `title`：页面标题
- `description`：辅助说明文案；传入后标题栏高度从 `size/component-height/title-bar` 切换为 `size/component-height/title-bar-with-description`
- `breadcrumbItems`：面包屑项目
- `breadcrumbEllipsis`：是否展示省略态
- `onBack`：传入后显示弱化返回图标按钮
- `actions`：右侧操作区

面包屑 `SensBreadcrumb` 暴露在 `src/ui`：

- `items`：面包屑项目，最后一项为当前页
- `ellipsis`：显示首项 / 省略 / 当前页

## 落地要求

- `landing` 用于落地页 / 一级页面标题区，背景必须使用 `white`。
- `drilldown` 用于下钻页 / 带面包屑或返回的标题区，背景必须使用 `theme-title-background`。
- 高度只有两档：无辅助文案走 `size/component-height/title-bar = 72`；有 `description` 辅助文案走 `size/component-height/title-bar-with-description = 94`。
- 右侧操作必须始终和大标题行对齐；面包屑和辅助文案都不参与按钮对齐。
- 标题字体必须使用 typography token 组合，不允许在业务里硬写 `20px / 30px / 600`。
- 辅助文案必须使用 typography token 组合，不允许在业务里硬写 `12px / 18px / 400`。
- 抽屉返回入口必须复用 `SensButton tone="linkWeak"` 纯图标，默认中性、悬停/点击进入链接色，图标颜色继承 `currentColor`。
- 页面返回入口必须复用 `SensButton tone="linkWeak"` 纯图标，默认中性、悬停/点击进入链接色，图标颜色继承 `currentColor`。
- 返回图标必须走 `SensIcon name="chevron-left" sizeToken="size/icon/l"`。
- 页面和抽屉返回热区宽度固定 24px，图标距标题栏左侧 2px；标题、面包屑、辅助文案都必须从返回热区后同一条竖线开始。
- 页面标题栏水平内距不对称：有 `onBack` 时 `paddingLeft` 走 `spacing/0․5x`（2px），无返回的 landing 走 `spacing/6x`（24px，与页面内容区对齐）；`paddingRight` 固定 `spacing/6x`（24px）。
- 有面包屑（72px / 94px）时走固定布局：面包屑距顶 `breadcrumbVerticalInset`（11px，由栏高减去内容区后平分推导）；面包屑到标题 `spacing/0․5x`（2px）；返回图标与一级标题同在 `line-height/xxl`（30px）标题行内垂直居中（icon 顶边距顶 35px）；面包屑、一级标题、辅助文案从返回热区后同一条竖线起始；有辅助文案时标题到辅助文案 `spacing/1x`（4px）；右侧操作距标题栏顶 `spacing/5x`（20px），不与标题行 flex 居中绑定；底部留白同 `breadcrumbVerticalInset`。
- 右侧操作推荐使用 `SensButton`，按钮自身状态由按钮组件负责。
- 顶部导航不属于 `SensPageTitleBar`，不要塞进同一个组件。

## 当前边界

- 当前只实现页面标题栏下钻区，不实现顶部导航。
- 面包屑只实现普通态 / 省略态，不实现下拉型折叠。
- 标题栏高度已进入 `size/component-height/title-bar` / `title-bar-with-description`；返回图标尺寸使用 `size/icon/l = 22`，返回热区使用 `spacing/6x = 24`，左侧图标贴边间距使用 `spacing/0․5x = 2`。
