# TitleBar 代码落地规则

## 组件入口

抽屉标题栏 `SensTitleBar` 暴露在 `src/ui`：

- `title`：标题内容
- `onBack`：传入后显示返回图标
- `actions`：右侧操作区

页面标题栏 `SensPageTitleBar` 暴露在 `src/ui`：

- `title`：页面标题
- `breadcrumbItems`：面包屑项目
- `breadcrumbEllipsis`：是否展示省略态
- `onBack`：传入后显示弱化返回图标按钮
- `actions`：右侧操作区

面包屑 `SensBreadcrumb` 暴露在 `src/ui`：

- `items`：面包屑项目，最后一项为当前页
- `ellipsis`：显示首项 / 省略 / 当前页

## 落地要求

- 背景必须使用 `theme-title-background`，不要写成普通页面背景。
- 标题字体必须使用 typography token 组合，不允许在业务里硬写 `20px / 30px / 600`。
- 抽屉返回入口必须复用 `SensButton tone="link"` 纯图标。
- 页面返回入口必须复用 `SensButton tone="linkWeak" size="small"` 纯图标。
- 返回图标必须走 `SensIcon name="chevron-left" sizeToken="size/icon/l"`。
- 右侧操作推荐使用 `SensButton`，按钮自身状态由按钮组件负责。
- 顶部导航不属于 `SensPageTitleBar`，不要塞进同一个组件。

## 当前边界

- 当前只实现页面标题栏下钻区，不实现顶部导航。
- 面包屑只实现普通态 / 省略态，不实现下拉型折叠。
- `72px` 标题栏高度先作为组件常量记录；返回图标尺寸使用 `size/icon/l = 22`。
