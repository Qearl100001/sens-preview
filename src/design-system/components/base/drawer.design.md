# 抽屉设计规则

来源：`Sens.Design 抽屉 v2.1 20230414`、设计系统 v2.1 抽屉组件。

## 使用范围

抽屉用于从页面右侧展开编辑、创建、详情等任务流。TikTok 数据源创建连接流程会使用右侧抽屉。

## 结构

| 区域 | 规则 |
| --- | --- |
| 方向 | 右侧进入 |
| 标题区 | 使用 `SensTitleBar` |
| 内容区 | 上 16px，左右 24px，下 24px |
| 外圆角 | 左上 / 左下 10px |
| 投影 | `shadow/drawer/right` |

## 尺寸

| 尺寸 | 值 | 说明 |
| --- | --- | --- |
| small | 432px | 常规轻量表单 |
| medium | 864px | TikTok 创建连接等中等复杂流程 |

## token 映射

| 属性 | token / 常量 | 说明 |
| --- | --- | --- |
| 面板背景 | `white` | 抽屉面板 |
| 遮罩 | `tokenRgba("mask-01-transparent", 0.45)` | 页面遮罩 |
| 圆角 | `radius/xl` | 10px |
| 投影 | `buildDrawerShadow("right")` / `shadow/drawer/right` | 右侧抽屉专用投影 |
| 内容内边距 | `spacing/4x` + `spacing/6x` | 16 / 24 |
| 宽度 | `SENS_DRAWER_WIDTH.small / medium` | 组件级尺寸，后续可沉淀为 component token |

## 待补充

- 动效、焦点回收、键盘关闭暂未完整收录。
- 多层抽屉、底部固定操作区需要在真实业务使用前补充。
