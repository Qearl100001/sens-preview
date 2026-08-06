# Foundations

> Foundation 是组件和页面生成的底层规则。组件不应该各自解释颜色、字体、间距、圆角、阴影；它们应该引用这一层。

## 分层关系

```text
设计原始资料
  -> foundation 文档
  -> token / helper / antd theme
  -> 基础组件
  -> 业务样板间
```

## 文档清单

| 文档 | 说明 | 当前状态 |
|---|---|---|
| `token-registry.md` | Token 来源、生成链路、语义维护源与检查边界 | Pilot · Partial · Pending |
| `color.md` | 颜色语义、透明色、绿色基线与换肤边界 | Stable · Implemented · Verified |
| `theme-skinning.md` | 导航主题与功能色主题的独立换肤规则；含 Functional Color Token Mapping | Pilot · Partial · Pending |
| `navigation-color.md` | 顶导航、侧导航、标题栏、页面主题背景、换肤映射 | Pilot · Partial · Pending |
| `typography.md` | 字体家族、字号、行高、标题层级 | Stable · Implemented · Verified |
| `spacing.md` | 间距 scale、页面 / 表单 / 卡片 / 组件间距 | Stable · Implemented · Verified |
| `layout.md` | 页面骨架、断点和可展开左侧区域行为 | Pilot · Partial · Pending |
| `grid.md` | `20` 栏、`12` 栏和局部容器排布 | Pilot · Partial · Pending |
| `size.md` | 固定尺寸、图标尺寸、组件高度、组件专属尺寸候选 | Pilot · Partial · Pending |
| `icon.md` | 图标资产、命名、尺寸关系、颜色语义和消费规则 | Pilot · Partial · Pending |
| `cursor.md` | SensD 鼠标规则与系统光标关键字；示意 PNG 不参与运行时；拖拽换位用 `move` | Pilot · Partial · Verified |
| `radius.md` | 圆角 scale 和使用场景 | Pilot · Partial · Pending |
| `shadow.md` | 投影层级、D1-D4、卡片阴影 | Pilot · Implemented · Pending |
| `divider.md` | 分割线宽度、层级、透明度与消费 helper | Pilot · Implemented · Pending |
| `card.md` | 卡片定义、类型、入口卡片、网格卡片 | Pilot · Missing · Pending |

## 使用原则

- 本索引只维护 Foundation 的入口、状态汇总和阅读关系；具体规则只在对应 Foundation 正文展开维护。
- 索引状态与 Foundation 正文不一致时，以正文头部的成熟度、实现和验证字段为准，并回写本索引。
- 业务页面优先引用组件；组件优先引用 foundation token。
- 改 token 前先读 `token-registry.md`，再定位对应 Token Source 与唯一语义维护文档。
- 遇到视觉不一致时，先判断是 foundation 缺口、组件缺口，还是业务特殊场景。
- 不直接把 PDF 文案复制成规则；要提炼成 AI 可执行的结构。
- 每条规则尽量包含：来源、语义、token 映射、使用场景、待确认点。
