# Drawer 代码落地规则

## 组件入口

`SensDrawer` 暴露在 `src/ui`：

- `open`：是否打开
- `size`：`small | medium | large`（Figma 30% / 60% / 80%）
- `mask`：是否显示蒙层（默认 `true`）。有蒙层时点蒙层**不**关闭，须点返回 / 操作按钮（或 Esc）；无蒙层时可点面板外关闭
- `titleBar`：标题区，建议传入 `SensTitleBar`（抽屉会注入 `titleId` 并挂 `aria-labelledby`）
- `children`：内容区
- `onClose`：关闭回调（无蒙层点外、返回/按钮、**Esc**）

## 落地要求

- 抽屉标题区必须复用 `SensTitleBar`（同一套标题栏：字号/字重/高度 token、返回、操作、`heading` + `titleId`）；禁止业务自写标题条替代。
- 抽屉右侧投影必须使用 `buildDrawerShadow("right")`，不要手写 `box-shadow`。
- 抽屉圆角必须使用 `radius/xl`。
- 内容区 padding 必须使用 spacing token：上 `spacing/4x`，左右下 `spacing/6x`（**不**依赖 antd `paddingLG`）。
- 业务页面不得绕过组件自己写抽屉面板。
- **Esc** 关闭抽屉（调用 `onClose`）。
- 打开时焦点进入面板内首个可聚焦控件（若无则聚焦面板）；关闭后焦点回收到打开前元素。本轮**不做**完整 focus trap。
- 打开时锁定背景滚动（`document.body.style.overflow = "hidden"`），关闭后还原。
- 蒙层色使用 `getColorToken("mask-01-transparent")`（token 自带 alpha，禁止再 `tokenRgba(..., 0.45)`）。
- 宽度为视口比例动态值：`clamp(min@1440, Nvw, max@1920)`；`SENS_DRAWER_WIDTH` 仅作 1440 基对照。
- 浮层 `z-index` 使用组件常量 `SENS_DRAWER_Z_INDEX`（1000）；面板 `maxWidth: calc(100vw - 2×spacing/horizontal/6x)`。
- 开合动效：面板自右缘滑入（`translateX(100%) → 0`）；有蒙层时蒙层同步淡入淡出。时长 `SENS_DRAWER_MOTION_DURATION_MS`（240），曲线 `SENS_DRAWER_MOTION_EASING`（`cubic-bezier(0.42, 0, 0.58, 1)` 缓入缓出）。`prefers-reduced-motion: reduce` 时时长为 0（直接切态）。关闭先播退场，结束后再卸载。
- 退场期间组件内部冻结 `size`，避免父级在 `open=false` 时改掉档位造成宽度跳变。

## 尺寸

| size | 系数 | @1440 对照 | clamp |
| --- | ---: | ---: | --- |
| `small` | 30% | 432 | 432–576 |
| `medium` | 60% | 864 | 864–1152 |
| `large` | 80% | 1152 | 1152–1536 |

宽度契约常量（Ready，**不**进 `semantic-unit` 生成链路；`vw` / `clamp` 属布局机制）：

| 常量 | 含义 |
| --- | --- |
| `SENS_DRAWER_WIDTH_RATIO` | 0.3 / 0.6 / 0.8 |
| `SENS_DRAWER_WIDTH` | @1440 对照 px |
| `SENS_DRAWER_VIEWPORT_MIN` / `MAX` | clamp 视口 1440 / 1920 |
| `SENS_DRAWER_Z_INDEX` | 浮层层级 1000 |
| `SENS_DRAWER_MOTION_DURATION_MS` | 开合 240ms |
| `SENS_DRAWER_MOTION_EASING` | 缓入缓出 `cubic-bezier(0.42, 0, 0.58, 1)` |

## 交互

| 模式 | 规则 |
| --- | --- |
| 有蒙层 `mask` | 可见遮罩 `mask-01-transparent`；点蒙层**不**关闭，须返回 / 操作按钮 |
| 无蒙层 `mask={false}` | 透明点击层；点面板外关闭；`aria-modal={false}` |

## 当前边界

- 第一阶段先提供右侧抽屉。
- 完整焦点陷阱、多层抽屉仍待补充。

## 工程落点

```text
src/ui/SensDrawer.tsx
src/preview/pages/DrawerShowcasePage.tsx
src/design-system/components/base/drawer.md
src/design-system/components/base/drawer.design.md
```
