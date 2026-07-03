# Agent Rules

> Agent Rules 是给 AI 执行和评审页面时看的规则层。Foundation 解决“长什么样”，Agent Rules 解决“为什么这样交互”。

## 文档清单

| 文档 | 说明 |
|---|---|
| `value-experience-principles.md` | 价值体验设计原则：准确性、高效率、无障碍、生机 |
| `consistency-flow-rules.md` | 一致性流程：创建、添加、查看、更多、编辑、删除、放弃、挽留、移除、二次提示 |
| `page-evaluation-checklist.md` | 页面生成后的校验清单 |

## 使用方式

AI 生成页面时，应按顺序读取：

```text
1. 业务输入 / PRD
2. DataSourceSpec 或对应场景 Spec
3. foundation 文档
4. 组件文档
5. agent rules
6. 目标页面已有实现
```

任何页面生成后都要回答三个问题：

- 这个页面的核心任务是什么？
- 这个页面涉及哪些对象流程？
- 这个页面是否满足准确性、高效率、无障碍、生机的最低标准？
