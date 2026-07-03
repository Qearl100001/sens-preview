# 设计资料源索引

> 这份索引记录原始设计资料。仓库优先沉淀“提炼后的规则”和“token 映射”，大体积 PDF / Figma 原件只做来源登记，避免把仓库变成资料归档盘。

## 资料分层

```text
原始资料源
  -> foundation 提炼
  -> token / 组件映射
  -> agent rules
  -> TikTok 数据源接入 case
```

## 本地 PDF / Markdown

| 资料 | 位置 | 用途 | 当前状态 |
|---|---|---|---|
| Sens.Design 间距 v0.4 | `/Users/liyuwen/Desktop/Sens.Design_间距_v0.4_220505.pdf` | 页面间距、标题栏、内容区、卡片、表格、下拉、模态等 spacing 规则 | 已读目录和部分关键页；待逐页提炼 |
| Sens.Design 字体 v0.4 | `/Users/liyuwen/Desktop/Sens.Design_字体_v0.4_220505.pdf` | 字体家族、字号、行高、字重、标题层级 | 已读关键页；待映射到 typography token |
| Sens.Design 卡片 v2.1 | `/Users/liyuwen/Desktop/Sens.Design_卡片 v2.1_20230320.pdf` | 卡片定义、类型、比例、网格视图、入口型、自由容器 | 已读目录和关键页；待提炼 `SensCard` / `SensEntryCard` |
| 色彩 Color · 基础样式 | `/Users/liyuwen/Desktop/colors.md` | 颜色三层关系、语义 handle、透明色、换肤现状 | 已作为 color foundation 的主要来源 |
| 卡片阴影截图 | `/Users/liyuwen/Desktop/227a34fe-7021-4e60-a49e-540a9a2485ca 1.png` | 一到四级卡片圆角和双层 shadow 参考 | 已读，待转成 shadow / card token |

## Figma 方法论文档

| 资料 | Figma | 用途 | 当前状态 |
|---|---|---|---|
| Sens.Design 价值体验设计原则 v2.1 | `https://www.figma.com/design/7wVu5fVLiRc3LVMoc1M7EV/Sens.Design_%E4%BB%B7%E5%80%BC%E4%BD%93%E9%AA%8C%E8%AE%BE%E8%AE%A1%E5%8E%9F%E5%88%99-v2.1_20230301?node-id=0-1&m=dev` | 准确性、高效率、无障碍、生机；页面体验判断标准 | 已抽取文字，沉淀到 `agent-rules/value-experience-principles.md` |
| Sens.Design 一致性流程规范 v2.1 | `https://www.figma.com/design/IzwAtvAHQ2gGomYlqzF9q3/Sens.Design_%E4%B8%80%E8%87%B4%E6%80%A7%E6%B5%81%E7%A8%8B%E8%A7%84%E8%8C%83-v2.1_20230216?node-id=1605-9592&m=dev` | 创建、添加、查看、更多、编辑、删除、放弃、挽留、移除、二次提示 | 已抽取文字，沉淀到 `agent-rules/consistency-flow-rules.md` |

## 当前资料缺口

- 缺少 Figma 导出的原始 token JSON：当前仓库只有 `tokens.resolved.json` / `theme.ts` 生成物，缺少可重新生成的源文件。
- 缺少数据源管理页四个关键页面的精确 Figma node 链接：目前主要靠截图和已有实现判断。
- 缺少真实数据源 logo / icon 资产：TikTok / Google Ads / Meta Ads 等入口卡片需要真实图标才能做到肉眼严谨。
- 缺少 Drawer / Form / Empty / Tag 的官方组件设计稿或规范文档：目前只能从已有业务抽屉和基础组件推导。

## 维护规则

- 新增资料先登记在本文件，再决定是否提炼进 foundation 或 agent rules。
- 大体积 PDF 不直接提交到普通 Git；如必须入库，优先考虑 Git LFS。
- 任何从资料源提炼出的规则，都要标明“已映射 / 待映射 / 待确认”。
