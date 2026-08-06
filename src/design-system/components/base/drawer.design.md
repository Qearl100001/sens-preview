# 抽屉设计规则

来源：`Sens.Design 抽屉 v2.1 20230414`（尺寸规范 `1007:5633`；有蒙层 / 无蒙层交互节点）。

## 使用范围

抽屉用于从页面右侧展开编辑、创建、详情等任务流。TikTok 数据源创建连接流程会使用右侧抽屉。

## 结构

| 区域 | 规则 |
| --- | --- |
| 方向 | 右侧进入 |
| 标题区 | 使用 `SensTitleBar`（与页面标题栏同属 TitleBar；dialog `aria-labelledby` 挂标题 `heading`） |
| 内容区 | 上 16px，左右 24px，下 24px（`spacing/4x` + `spacing/6x`） |
| 外圆角 | 左上 / 左下 10px |
| 投影 | `shadow/drawer/right` |
| 高度 | 与被叠加页面等高；内容超高在内容区纵向滚动 |
| 背景 | 打开时锁定页面滚动 |

## 尺寸

基于「抽屉 = 模态 mini 页面」，宽度随屏自适应。建议三档系数（最大宽以 1920 为基数，最小宽以 1440 为基数）：

| 尺寸 | 系数 | @1440 对照 | 说明 |
| --- | ---: | ---: | --- |
| small | 30%（最小） | 432 | 常规轻量表单 |
| medium | 60%（推荐） | 864 | 中等复杂流程（如 TikTok 创建连接） |
| large | 80%（最大） | 1152 | 更重的编辑 / 对照场景 |

实现：`clamp(min@1440, Nvw, max@1920)`；Demo 可标注 1440 对照 px。  
宽度契约见 `SENS_DRAWER_WIDTH*` / `SENS_DRAWER_VIEWPORT_*`（组件常量 Ready；比例动态宽不进 unit 生成物）。

## 与页面的交互

| 模式 | 规则 |
| --- | --- |
| 有蒙层 | 蒙层色：中性色/遮罩/01 `@mask-01-transparent`；点蒙层**不**关闭，须点返回或操作按钮退出 |
| 无蒙层 | 无可见遮罩；点面板外（页面区域）可关闭 |

## token 映射

| 属性 | token / 常量 | 说明 |
| --- | --- | --- |
| 面板背景 | `white` | 抽屉面板 |
| 遮罩 | `mask-01-transparent`（直读，勿二次压 alpha） | 有蒙层模式 |
| 圆角 | `radius/xl` | 10px |
| 投影 | `buildDrawerShadow("right")` / `shadow/drawer/right` | 右侧抽屉专用投影 |
| 内容内边距 | `spacing/4x` + `spacing/6x` | 上 16 / 左右下 24；已脱离 antd `paddingLG` |
| 宽度 | `SENS_DRAWER_WIDTH_RATIO` + clamp；`SENS_DRAWER_WIDTH` 为 @1440 对照 | 三档 30/60/80 |
| 最大宽度 | `calc(100vw − 2×spacing/horizontal/6x)` | 两侧各留约 24 |
| 浮层层级 | `SENS_DRAWER_Z_INDEX` = 1000 | 组件契约，暂不升全局 z-index token |
| 动效时长 | `SENS_DRAWER_MOTION_DURATION_MS` = 240 | 组件契约；`prefers-reduced-motion` 时为 0 |
| 动效曲线 | `SENS_DRAWER_MOTION_EASING` | 缓入缓出 `cubic-bezier(0.42, 0, 0.58, 1)` |

## 交互契约

- **Esc** 关闭抽屉。
- 打开时焦点进入面板（优先首个可聚焦控件）；关闭退场结束后焦点回收到打开前元素。
- 打开时锁定背景滚动；关闭退场结束后还原。
- `aria-labelledby` 指向 `SensTitleBar` 标题节点。
- 开合：面板自右缘滑入 / 滑出；有蒙层时蒙层淡入淡出；缓入缓出 240ms。
- 完整 focus trap 仍待补充。

## 待补充

- 完整焦点陷阱暂未完整收录。
- 多层抽屉、底部固定操作区需要在真实业务使用前补充。
