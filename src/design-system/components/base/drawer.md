# Drawer 代码落地规则

## 组件入口

`SensDrawer` 暴露在 `src/ui`：

- `open`：是否打开
- `size`：`small | medium`
- `titleBar`：标题区，建议传入 `SensTitleBar`
- `children`：内容区
- `onClose`：遮罩关闭回调

## 落地要求

- 抽屉标题区必须复用 `SensTitleBar`。
- 抽屉右侧投影必须使用 `buildDrawerShadow("right")`，不要手写 `box-shadow`。
- 抽屉圆角必须使用 `radius/xl`。
- 内容区 padding 必须使用 spacing token。
- 业务页面不得绕过组件自己写抽屉面板。

## 当前边界

- 第一阶段先提供右侧抽屉。
- 当前实现的是可交互容器，不迁移 TikTok 业务页面。
- 宽度 432 / 864 先作为组件常量，后续 token 入库时迁入统一源头。
