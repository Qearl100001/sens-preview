# 设计还原产线 · 数据源接入 Case · 两周 TODO

## 0. 工作规则

每个 TODO 都必须按 5 步推进：

1. 对齐范围  
   说明这次做什么、不做什么、影响哪些文件、需要哪些资料。

2. 只出草稿  
   先在对话里给草稿，不写进项目文件。

3. 确认后落库  
   用户确认后，才写入代码 / md / token / 组件。

4. 检查验收  
   检查文件、构建、页面、token、样式来源。

5. 暴露问题  
   未完成、资料不够、验收失败、视觉不准，都必须明说。

## 1. 两周目标

在两周内完成一个可以和产品 + 研发严肃对齐的案例：

```text
已有数据源 PRD / 描述
  -> AI 抽取 DataSourceSpec
  -> 使用 Sens.Design foundation / token / 组件 / agent rules
  -> 生成可运行的 TikTok Ads 数据源接入前端流程
```

这个 case 的目标不是粗糙 demo，而是：

- 视觉严谨
- 结构可解释
- token 可追溯
- 组件可复用
- 流程规则可说明
- 问题和边界可透明展示

## 2. DataSourceSpec 是什么

DataSourceSpec 是把 PRD / 数据源描述转成 AI 和前端都能读懂的结构化说明书。

它不是页面，也不是后端接口，而是页面生成的中间层。它至少应该描述：

- 数据源名称、分类、说明
- 创建连接需要哪些字段
- 连接列表展示哪些列
- 有哪些状态和操作
- 空态、帮助信息、注意事项

它的价值是证明：

```text
同一个页面模板
  + TikTok Ads Spec = TikTok Ads 页面
  + Google Ads / Facebook Spec = 另一个数据源页面骨架
```

两周内，TikTok Ads 是唯一严谨主样例；Google Ads 或 Facebook 只准备一个轻量 DataSourceSpec，用来证明流程可迁移，不做完整第二套页面。

## 3. 当前边界

两周内做：

- TikTok Ads 作为唯一严谨主样例
- TikTok 四个页面 / 状态：
  - 数据源管理页
  - TikTok 空态页
  - 创建连接抽屉
  - 连接列表页
- 一个轻量 Google Ads 或 Facebook DataSourceSpec，用来证明流程可迁移
- Foundation 校准：
  - Typography
  - Color
  - Spacing
  - Radius
  - Shadow
  - Card
  - Icon 管理方式
- TikTok case 必需组件都要具备：
  - 已有组件可复用则复用
  - 已有组件不 ready 则补齐
  - 缺失组件则新增
- 每天写轻量 changelog

两周内不做：

- 不做后端
- 不接真实接口
- 不做 OAuth
- 不做权限系统
- 不做完整第二套 Google Ads / Facebook 页面
- 不做完整复合表格体系
- 不做完整换肤和产品导航
- 不做正式 skill / agent 产品化

## 4. 已有内容状态

功能已跑通，但不等于视觉验收完成：

- 数据源管理页：功能有，视觉待严谨化
- TikTok 空态页：功能有，视觉待严谨化
- 创建连接抽屉：功能有，流程规则和视觉待补
- 连接列表页：功能有，表格 / 操作 / 状态待验收
- DataSourceSpec：TikTok 有第一版，Google Ads / Facebook 未准备
- Foundation 文档：已有草稿，全部标记为未校验
- Agent Rules 文档：已有草稿，全部标记为未校验
- 已生成 md 文件：全部按“工作区草稿”处理，未经确认不视为正式文档

## 4.1 当前进度 · 截至 7月1日

### ✅ 已完成

- ✅ 工作规则已落地：每个任务按「对齐范围 -> 草稿 -> 确认 -> 写入 -> 验收 -> 暴露问题」推进。
- ✅ TikTok Mini Flow 功能已跑通：数据源管理页、TikTok 空态页、创建连接抽屉、连接列表页、本地 mock 提交。
- ✅ 基础样式入口已搭建：颜色、导航颜色、字体、间距、尺寸、圆角、投影、分割线、卡片。
- ✅ Shadow 已补 helper：D1 / D2 / D3 / D4、四方向 shadow、active ring。
- ✅ Divider 已补可消费 token 入口：四个线色、透明 / 非透明版本、1px hairline、页面样张。
- ✅ Card 已重构为基础容器样张：明确 Card Foundation 和 DataSourceCard / EntryCard 的边界。
- ✅ 7月1日 changelog 已更新，并已在 `/changelog` 验收。

### 🔶 进行中 / 未完成

- 🔶 Typography token 目前还是 helper fallback，尚未完整进入生成链路。
- 🔶 Divider token 目前是代码侧可消费入口，尚未进入 `build-tokens.mjs` 输出结构。
- 🔶 已落地基础样式还没做统一 token 绑定检查。
- 🔶 Card 还没有 hover / active / focus / selected / disabled 交互状态。
- 🔶 DataSourceCard / EntryCard 尚未开始。
- 🔶 Icon 管理方式尚未确定。
- 🔶 TikTok 四页还没进入严谨视觉还原阶段。

## 5. 阶段一：路线与地基校准

### Task 1：确认 TODO

范围：

- 只校验本 TODO
- 不改页面
- 不改组件
- 不处理 Figma 大文档

验收：

- 两周目标清楚
- 暂缓项清楚
- 每天任务可控
- 用户确认后再写入文件

### Task 2：Foundation 校准

范围：

- 逐个校验 foundation
- 每次只处理一个 foundation，不批量生成
- 先出聊天草稿，确认后再写入文件

Foundation 清单：

- Typography
- Color
- Spacing
- Radius
- Shadow
- Card

每个 foundation 都必须说明：

- 资料来源是什么
- 当前代码里对应哪里
- token 是否已有
- 组件怎么引用
- TikTok case 会怎么用
- 缺口是什么
- 验收怎么判断

验收：

- 每个值说明来源
- 不新增手写样式
- 明确哪些可直接进 token，哪些待确认
- 如果出现硬编码 hex / px / ant-* 覆盖，必须说明原因并暂停确认

### Task 3：Icon 管理方案

范围：

- 只定 icon 管理方式
- 不一次性补完整 icon 库
- 但 TikTok case 需要的 icon 必须逐步补齐

建议方向：

- 业务 logo 和系统 icon 分开
- logo 保留品牌原色
- 系统 icon 走 token
- TikTok case 需要什么 icon，就逐个补什么 icon

可能结构：

- `src/assets/icons/raw/`
- `src/ui/icons/`
- docs 或组件文档里记录 icon 使用规则

验收：

- 组件不临时手画 icon
- icon 尺寸、颜色、状态有规则
- 不为了 demo 到处散落 svg

## 6. 阶段二：TikTok 组件完备

### Task 4：TikTok 必需组件清单

范围：

- 盘点 TikTok 四页会用到的全部组件
- 判断已有组件是否可复用
- 判断已有组件是否 token-ready
- 判断缺失组件是否需要新增
- 先列清单，不直接实现

组件清单至少包含：

- EntryCard / DataSourceCard
- Drawer
- Form / FormItem
- PageEmpty
- PageHeader / DrilldownTitleBar
- Table 基础状态
- Tag / StatusBadge
- Button
- Input
- Search
- Select / Dropdown
- Icon

关键原则：

- TikTok 用到的组件都必须具备
- 已有组件能复用就复用
- 不 ready 的组件要补齐
- 缺失的组件要进入新增计划
- 不做 TikTok 用不到的完整组件体系

验收：

- 每个组件说明来源：已有组件 / Figma / PDF / 截图 / 推导
- 每个组件说明是否需要 token 映射
- 每个组件说明当前状态：可用 / 需调整 / 缺失
- 用户确认后再进入单组件方案或实现

### Task 5：单组件方案与实现

范围：

- 每次只处理一个组件
- 先出组件方案草稿
- 用户确认后再实现

每个组件方案必须说明：

- 使用场景
- 结构
- 状态
- token 映射
- 是否依赖 antd
- 是否需要 CSS
- 哪些样式来自 token / Figma
- 哪些还不能确认

验收：

- 构建通过
- 组件在预览页可检查
- 无无理由手写 hex / px
- 无无理由 ant-* 覆盖
- 问题清单透明展示

## 7. 阶段三：TikTok 四页严谨还原

### Task 6：四页视觉拆解

范围：

- 每次只拆一个页面
- 只出差异分析，不改代码

页面顺序：

1. 数据源管理页
2. TikTok 空态页
3. 创建连接抽屉
4. 连接列表页

每页都要回答：

- 核心任务是什么
- 页面对象是什么
- 用到哪些组件
- 用到哪些 foundation
- 用到哪些 agent rule
- 当前实现哪里不像
- 缺哪些 Figma node / token / icon / 组件

### Task 7：四页逐页实现

范围：

- 每次只实现一个页面或一个页面内明确区域
- 实现前先给方案
- 用户确认后再改代码

验收：

- 页面可打开
- 关键交互可流转
- 视觉差异清单已处理或标记原因
- 使用组件和 token 可追溯
- 构建通过
- 未完成问题透明展示

## 8. 阶段四：轻量迁移演示

### Task 8：Google Ads 或 Facebook 最小 DataSourceSpec

范围：

- 只准备一个最小 spec
- 不做完整第二套页面

用途：

- 证明流程不是 TikTok 写死
- 演示 PRD / 描述 -> 结构化 spec
- 支持现场讲“未来可以扩展”

验收：

- spec 字段清楚
- 能说明 AI 抽取了什么
- 不抢 TikTok 主 case 的时间

## 9. 阶段五：验收和沟通材料

### Task 9：全流程验收

范围：

- 验收 TikTok 主流程
- 不新增功能

验收内容：

- 数据源管理页 -> TikTok 空态页 -> 创建连接抽屉 -> 连接列表页
- 组件使用是否完整
- token 来源是否清楚
- Foundation 是否可追溯
- Agent rules 是否能解释流程
- 未完成问题是否清楚

### Task 10：沟通材料

范围：

- 先准备结构，不急着做完整 PPT

材料包括：

- 背景
- 问题
- 方案
- Demo 路径
- 产品 / 设计 / 研发怎么配合
- 当前边界
- 未完成问题
- 8-9 月下一阶段计划

## 10. 两周节奏

Day 1（7月1日，已完成）：

- ✅ 确认两周目标和受控工作流。
- ✅ 跑通 TikTok Mini Flow 功能闭环。
- ✅ 建立基础样式页面入口。
- ✅ 完成 / 更新 Typography、Color、Navigation Color、Spacing、Size、Radius、Shadow、Card、Divider 的阶段性沉淀。
- ✅ 新增 Divider 可消费 token 入口和页面样张。
- ✅ 更新 7月1日 changelog。

Day 2（明天，高优）：

- Typography + Divider token 入库方案：
  - 读取 `build-tokens.mjs` 和现有 token 结构。
  - 判断哪些 token 应进入生成链路，哪些保留 helper。
  - 先给草稿，确认后再改。
- 基础样式 token 绑定检查：
  - 检查颜色、字体、圆角、间距、尺寸、投影、分割线、卡片。
  - 列出硬写值、helper fallback、antd 推导、生成链路缺口。
  - 不直接批量修，先出问题清单和建议顺序。
- Card 交互状态草稿：
  - 定义 default / hover / active / focus / selected / disabled。
  - 明确每个状态使用的 color / divider / shadow / cursor。
  - 确认后再实现。

Day 3（后天）：

- 实现 Card 交互状态样张。
- 出 DataSourceCard / EntryCard 组件草稿：
  - logo
  - 标题
  - 状态点
  - 连接数量
  - beta
  - hover / focus / disabled
  - 点击范围
- 出 Icon 管理方案：
  - 业务 logo 和系统 icon 分开。
  - TikTok case 需要的 icon 先逐个补。
  - 尺寸、颜色、状态必须走规则。

Day 4 起：

- 进入 TikTok 必需组件清单。
- 每次只做一个组件方案。
- 用户确认后再实现。
- 组件验收后再进入 TikTok 四页严谨还原。

组件补齐阶段：

- EntryCard / DataSourceCard 方案、实现与验收
- PageEmpty / PageHeader 方案、实现与验收
- Drawer / Form / FormItem 方案、实现与验收
- Table / Status / Action 规则确认与必要补齐

页面严谨化阶段：

- 数据源管理页视觉拆解与实现
- TikTok 空态页视觉拆解与实现
- 创建连接抽屉视觉严谨化
- 连接列表页视觉严谨化

收口阶段：

- Google Ads 或 Facebook 最小 DataSourceSpec
- 全流程验收
- 问题清单
- 沟通材料结构

## 11. 每日 Changelog 规则

每天只写轻量日志：

- 今天确认了什么
- 今天落库了什么
- 今天验收了什么
- 今天发现了什么问题
- 明天只做什么

不再一次性写大段方法论。
