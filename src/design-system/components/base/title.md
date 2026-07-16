# 标题 Title

标题用于表单分组、配置块、卡片分组和业务组件内部标题。它是区块内容标题，不等于页面 / 抽屉 / 面包屑标题栏。

## 组件边界

- `SensSectionTitle` 负责区块标题、选填文案、辅助说明、帮助图标槽位和通用标题右侧操作。
- 页面标题、返回、面包屑、页面级按钮区继续使用 `TitleBar` / `PageTitleBar`。
- 表单只引用标题组件的分组标题能力，不把标题组件并入 Form。
- 营销云 / 分析云 / SDH 专用标题不能作为通用标题替代。

## 变体

| 变体 | 尺寸 | 使用场景 | 规则 |
| --- | --- | --- | --- |
| 通用 | 大尺寸 | 表单分组、配置块、卡片内主标题 | 灰背景，可带说明与右侧操作 |
| 通用 | 小尺寸 | 业务组件内部轻量分组标题 | 灰背景，信息密度更高 |
| 营销云 / 分析云 / SDH 专用 | 大尺寸 | 指定产品线的大块业务标题 | 左侧绿色短条，无灰背景 |
| 营销云 / 分析云 / SDH 专用 | 小尺寸 | 指定产品线的业务组件内部标题 | 仅在业务组件内使用 |

## Token 映射

| 项 | SensD token | 状态 |
| --- | --- | --- |
| 通用标题背景 | `background-transparent-grey` @4% | Ready |
| 标题主文案 | `text-color-transparent` @90% | Ready |
| 辅助 / 选填文案 | `text-sub-color-transparent` @58% | Ready |
| 帮助图标颜色 | `icon-color-transparent` | Ready |
| 专用标题短条 | `component-primary` | Ready |
| 通用大尺寸高度 | `size/component-height/xxl` | Ready |
| 通用小尺寸高度 | `size/component-height/l` | Ready |
| 专用标题短条高度 | `size/icon/m` | Ready |
| 圆角 | `radius/m` | Ready |
| 标题与 meta 间距 | `spacing/horizontal/1x` | Ready |
| 标题与说明间距 | `spacing/horizontal/2x` | Ready |
| 右侧操作按钮间距 | `spacing/horizontal/4x` | Ready |
| 标题到右侧操作距离 | `spacing/10x + spacing/horizontal/6x` 推导 | To Confirm |

## 图标状态

- 帮助图标需要来自 SensD icon registry。
- 当前不使用错误图标替代，只暴露 `helpIcon` 槽位。
- 待 help asset 入库后，再把文档状态从 Missing 更新为 Ready。

## 验收记录

- 不新增源 token。
- 不手改 `tokens.resolved.json` / `theme.ts`。
- 组件视觉不依赖 antd 标题或 antd Form。
- 专用标题的产品线边界已写入文档。
