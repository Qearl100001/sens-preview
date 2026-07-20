# 表单 Form

表单用于承载一组录入、选择、说明、校验和提交行为。当前先沉淀基础表单结构与间距规则，不把业务表单样板间直接混进基础组件。

## 组件边界

- 表单负责表单项布局、标题、选填文案、帮助入口、辅助说明、报错、字符限制和操作区骨架。
- 必填只作为语义和校验规则，不在标题前展示红色星号；视觉层只展示选填项。
- 输入框、数字输入框、选择器、单选组、复选框组等具体控件仍回到各自基础组件规则。
- 配置栏表单、分步表单、锚点表单、模态级表单、带表格的表单、联动表单、表单滚动、整页报错反馈属于“业务样板间 > 表单”。卡片嵌套的**分组规则**见下文；完整图 1/2/3 结构样张可后续进样板间。
- 标题组件已作为 `SensSectionTitle` 单独录入；表单页只引用“表单项标题 / 分组标题”的使用关系。
- 表单不使用 antd Form 视觉层；`SensForm` 只提供 SensD 表单骨架。

## 基础设计原则

> 来源：`Sens.Design 表单组件 v2.1 221206` · 设计原则 · `64:55048`。细则展开见下文与 `title.md`。

1. **只有当前分组树的最顶层标题可以使用灰条 / 绿条**  
   顶层用 `SensSectionTitle` 通用大尺寸（16px + 灰底）；营销云 / 分析云 / SDH 可用专用绿条大尺寸。其下所有分组标题都不带灰条 / 绿条。通用小尺寸灰条标题**不得**充当表单分组第二 / 三层，仅留给业务组件内部。字段 label 走表单项标题样式。完整层级见「分组规则」。

2. **顶层（带灰条）标题的辅助文案跟标题的基线对齐**  
   辅助文案与标题主文案同一行，按基线对齐（不是顶对齐，也不是整行垂直居中后换行堆叠）。规则与效果见 `title.md` 与 `/components/title`。

3. **不强制单个组件宽度对齐**  
   按界面选择合适宽度；不要求字段等宽，且不得小于对应基础组件最小值。详见下文「单个录入组件尺寸」。

4. **无特殊情况，表单中的组件都包 32px 高（除去联动表单）**  
   常规录入控件与左右布局标题对齐高度使用 `size/component-height/m`（32px）。控件级例外（文本域、带辅助文案 / 联动内容的单选复选等「不补 32」）见下文「左右布局标题对齐」。**联动表单**整块例外划入「业务样板间 > 表单」，不在基础 Form 展开。

5. **对齐规则**  
   - 上下结构的表单：组件跟标题进行对齐。  
   - 左右结构的表单：组件跟组件对齐（控件列互相对齐）；标题与控件的行内关系见「左右布局标题对齐」。

## 分组规则

> 来源：`Sens.Design 表单组件 v2.1 221206` · 分组 · `69:26542`。上下布局与左右布局共用本规则。

### 四条原则

1. **基础表单通过最顶层标题（16px + 灰条）进行分组**（Figma 如图 1）。
2. **分组逻辑从上到下**：先顶层，再第二层，再第三层；不跳层、不反向。
3. **三层标题仍不够时，用卡片拉开层级**；表单结构最多可理解为「三层标题 + 白描边卡 + 灰底卡」这一套组合（Figma 如图 3 / 五层结构口径）。
4. **组与组之间不强制对齐**（不同分组块不要求等宽或左右对齐）；与「单个字段不强制等宽」一致，但是组级约束。

### 标题层级（无卡片时最多三层）

| 层 | 字号 | 灰条 / 绿条 | 说明 |
| --- | --- | --- | --- |
| 1 · 顶层分组 | `font-size/l`（16） | **有**（灰条；产品线可用绿条） | `SensSectionTitle` 通用大尺寸；大表单页默认入口 |
| 2 · 第二层分组 | `font-size/l`（16） | **无** | 直接用 Typography token 排版，不套灰条组件 |
| 3 · 第三层分组 | `font-size/m`（14） | **无** | 纯标题文案层级 |
| 字段 label | `font-size/m`（14）+ medium | **无** | 表单项标题，挂在当前最内层分组下；不是灰条分组标题 |

### 卡片嵌套

| 规则 | 口径 |
| --- | --- |
| 何时用卡 | 三层标题仍无法把信息架构展清时，再引入卡片 |
| 最外层卡 | **白底 + 描边**；同一嵌套链上白描边卡只允许这一层 |
| 内层卡 | 白卡之内只允许再套 **灰底卡**；**禁止**再出现白描边卡 |
| 白卡内灰条 | 允许再出现灰条标题，并 **重置** 一组分组树（顶层再次 16px + 灰条，其下仍按 16 无条 → 14 无条） |
| 灰底卡内标题 | **目前仅支持 14px**；灰卡内 **16px 暂无场景**，不要用 16px 灰条 / 16px 无条当灰卡内标题 |
| 卡片样式 | 容器规则引用 `docs/foundations/card.md`（白描边 ≈ 描边卡片；灰底 ≈ 色块卡片） |

### 与间距表的关系

- 顶层分组之间、内容区到页脚：`spacing/vertical/10x`（40）
- 第三层（及同类）分组之间：`spacing/vertical/7x`（28）
- 普通表单项之间：`spacing/vertical/5x`（20）
- 其余仍按下文「间距规则」判断；分组规则只定层级与卡片，不改 token 档位。

## 基础结构

| 区块 | 说明 |
| --- | --- |
| 标题区 | 标题文字、帮助图标入口、选填文案 |
| 控件区 | 放置 Input / Select / RadioGroup / CheckboxGroup 等已录入控件 |
| 辅助说明 | 用于解释字段含义、限制或推荐场景 |
| 报错信息 | 用于字段级校验结果，跟随表单项展示 |
| 字符限制 | 用于输入长度反馈，属于表单项 meta |
| 操作区 | 提交、取消、重置等按钮组合 |

## 辅助信息与报错规则

- 辅助信息和字段报错共用同一个表单项信息槽。
- 正常状态展示辅助信息；出现字段报错时，报错信息替代辅助信息的位置，不与辅助信息叠加展示。
- 报错信息结构为 `SensIcon name="feedback-error"` + 报错文案。
- 报错图标尺寸使用 `size/icon/m`，颜色和报错文案都使用 `warning-color`。
- 报错文案使用辅助文案字号和行高：`font-size/s` + `line-height/s`。
- 报错出现后，表单项高度自适应向下撑开，后续表单项自然下移；不使用绝对定位或固定遮盖。
- 字符限制 `counter` 可继续作为独立 meta 展示；本规则只定义辅助信息与报错之间的替换关系。

## 布局规则

| 布局 | 使用场景 | 规则 |
| --- | --- | --- |
| 上下布局 | 字段说明较多、控件较宽、移动端或低密度表单 | 标题在上，控件在下；**组件跟标题对齐**（原则 5） |
| 左右布局 | 标题较短、字段密度较高、需要快速扫读的配置表单 | 标题在左，控件在右；**组件跟组件对齐**（原则 5），多控件时控件列互相对齐 |

## 标题规则

- 表单项标题必须使用四级标题或更高层级的文字语义，不使用比四级更弱的标题样式。
- 标题内容顺序固定为：标题文案 -> 帮助图标 -> 选填文案。
- 必填项不显示视觉标识；不要在标题前加红色星号。
- 选填项使用文案展示，推荐写作 `(选填)`。
- 帮助图标使用 `SensIcon name="help"`，尺寸 `size/icon/m`，颜色来自 `icon-color-transparent`。
- 标题文案使用四级标题样式：`text-color-transparent` @90% + `font-size/m` + `line-height/m` + `font-weight/medium`。
- 选填文案使用 `text-sub-color-transparent` @58% + `font-size/m` + `line-height/m` + `font-weight/regular`，并和标题保持同一行高。
- 左右布局中标题文字最大宽度为 112px（8 个中文字），由 `font-size/m * 8` 推导；超出时省略显示，悬停展示完整标题。
- 帮助图标、`(选填)` 和标题附加信息不允许折行，也不参与标题文字省略。

## 左右布局标题对齐

| 场景 | 标题对齐规则 | 组件对齐规则 |
| --- | --- | --- |
| 常规输入、选择器、数字输入等 | 标题区域按 `size/component-height/m` 形成 32px 对齐高度 | 控件顶部与标题区域居中对齐 |
| 无辅助文案、无嵌套内容的单选 / 复选 | 标题区域按 32px 对齐高度 | 整组选项包在 `size/component-height/m` 的 32px 对齐盒内，图标和文字垂直居中 |
| 选项自带辅助文案、联动内容、嵌套卡片的单选 / 复选 | 标题不额外补 32px | 标题和整组组件顶部对齐，单选 / 复选本体不使用 32px 对齐盒 |
| 文本域 | 标题不额外补 32px | 标题和文本域顶部对齐 |

## 间距规则

表单间距按“分组层级 > 内容区关系 > 表单项关系 > 基础表达式内部关系”判断。纵向和横向分别判断，不混用同名场景。

### 纵向间距

| 间距 | SensD token | 使用场景 |
| --- | --- | --- |
| 40px | `spacing/vertical/10x` | 二级标题分组之间；内容区到页脚按钮区 |
| 28px | `spacing/vertical/7x` | 三级标题分组之间 |
| 20px | `spacing/vertical/5x` | 表单项 / 组件和组件之间，排除基础表达式内部间距 |
| 16px | `spacing/vertical/4x` / `spacing/horizontal/4x` | 标题栏 tab、sub tab、表单标题、分割线、Alert 到内容区；左右布局标题到控件 |
| 8px | `spacing/vertical/2x` / `spacing/horizontal/2x` | 上下布局标题到控件；联动组件之间；组件多排；控件与单位 / 后缀内容 |
| 4px | `spacing/vertical/1x` / `spacing/horizontal/1x` | 辅助文案到关联内容；报错到关联内容；图标到文字 / 内容 |

### 横向间距

| 间距 | SensD token | 使用场景 |
| --- | --- | --- |
| 24px | `spacing/horizontal/6x` | 横向并列的独立组件或组件区块之间 |
| 16px | `spacing/horizontal/4x` | 四级标题到组件之间；按钮之间；卡片之间；分割线之间 |
| 8px | `spacing/horizontal/2x` | 辅助文案 / 正文到内容之间；同一字段内部的联动组件之间 |
| 4px | `spacing/horizontal/1x` | 图标到内容之间 |

注意：横向并列的独立组件区块使用 24px；同一字段内部的联动表达式使用 8px；图标、帮助入口、删除入口等贴近文字或内容时使用 4px。

## 单个录入组件尺寸

- 单个录入组件的宽度根据界面自由组合，不强制要求所有字段等宽。
- 组件宽度不得小于对应基础组件最小值。
- Input / Select / Search / NumberInput 等具体宽度范围与建议值，回到对应基础组件文档维护。
- Checkbox / Radio 无单独宽度约束；组内间距沿用 CheckboxGroup / RadioGroup。

## Token 映射

| 项 | SensD token | 状态 |
| --- | --- | --- |
| 二级分组 / 内容到页脚 | `spacing/vertical/10x` | Ready |
| 三级分组 | `spacing/vertical/7x` | Ready |
| 表单项默认间距 | `spacing/vertical/5x` | Ready |
| 内容区关系 | `spacing/vertical/4x` / `spacing/horizontal/4x` | Ready |
| 横向组件区块间距 | `spacing/horizontal/6x` | Ready |
| 上下布局标题到控件 | `spacing/vertical/2x` | Ready |
| 左右布局标题到控件 | `spacing/horizontal/4x` | Ready |
| 联动组件 / 控件到单位 | `spacing/horizontal/2x` | Ready |
| 标题内部间距 | `spacing/horizontal/1x` | Ready |
| 辅助 / 报错到关联内容 | `spacing/vertical/1x` | Ready |
| 单选 / 复选选项主文案到辅助文案 | `spacing/vertical/1x` | Ready |
| 操作区按钮间距 | `spacing/horizontal/4x` | Ready |
| 表单项标题 | `text-color-transparent` @90% + `font-size/m` + `line-height/m` + `font-weight/medium` | Ready |
| 选填文案 | `text-sub-color-transparent` @58% + `font-size/m` + `line-height/m` + `font-weight/regular` | Ready |
| 左右布局标题最大宽度 | `font-size/m * 8 = 112px` 推导 | To Confirm |
| 辅助文案 | `text-sub-color-transparent` @58% + `font-size/s` + `line-height/s` | Ready |
| 帮助图标 | `SensIcon name="help"` + `icon-color-transparent` + `size/icon/m` | Ready |
| 报错图标 | `SensIcon name="feedback-error"` + `warning-color` + `size/icon/m` | Ready |
| 报错文案 | `warning-color` + `font-size/s` + `line-height/s` | Ready |
| 左右布局标题对齐高度 | `size/component-height/m` | Ready |
| 单行单选 / 复选组选项高度 | `size/component-height/m` | Ready |
| 表单项标题默认列宽 | `spacing/10x * 3` 推导 | To Confirm |
| 分割 / 边框 | `divider/color/light/transparent` | Ready |

## 验收记录

- 不新增源 token。
- 不手改 `tokens.resolved.json` / `theme.ts`。
- 不使用 antd Form 视觉层。
- 帮助图标已按 Figma `803:196` 录入 SensD icon registry，表单标题统一使用 `SensIcon name="help"`。
