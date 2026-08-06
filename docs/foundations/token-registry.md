# Token 对照

> Token 的统一索引：说明来源、生成链路、语义边界与当前录入状态。<br>
> 成熟度：Pilot<br>
> 实现：Partial<br>
> 验证：Pending（生成物同步已验；语义覆盖与消费边界待验）<br>
> 来源：`tokens/source/`<br>
> 生成：`build-tokens.mjs`<br>
> 预览：对应 Foundation 的 `/basic-styles/*` 样张

## 1. 目的与边界

本篇不复制全部原始 token 值，也不替代各 Foundation 的详细规则。它只回答：

- token 从哪个源文件来；
- 生成到哪些运行时产物；
- 哪一篇文档维护其语义和使用场景；
- 是否属于可换肤层；
- 当前是否已纳入 v0.9。

真实数值以 `tokens/source/` 与生成物 `src/design-system/tokens.resolved.json` 为准；禁止手改生成物。

## 2. 生成链路

```text
tokens/source/figma + tokens/source/foundations
  -> build-tokens.mjs
  -> theme.ts + tokens.resolved.json + i18n/zh.json + i18n/en.json
  -> antd theme / helper / 组件 / Preview
```

| 命令 | 作用 | 是否修改工作树 |
|---|---|---|
| `npm run tokens:build` | 根据源文件重建正式生成物 | 是 |
| `npm run tokens:check` | 在临时目录重建并逐字比对正式生成物 | 否 |
| `npm run build` | 先执行 `tokens:check`，再 typecheck 与 Vite build | 否 |

## 3. Token 分类对照

| 分类 | 主要 token / 语义 | 适用场景 | 换肤关系 | 来源 | 语义维护源 | v0.9 状态 |
|---|---|---|---|---|---|---|
| 功能色 | `component-primary`、`component-hover`、`component-active` | 主操作、选中、聚焦 | Functional Skin 可局部消费；全局基线为绿色 | `figma/Color.json` | `color.md` | 已录入 |
| 链接与状态色 | `link-*`、`success-color`、`info-color`、`warning-color` | 链接、成功、提醒、危险 | 固定，不随 Functional Skin 变化 | `figma/Color.json` | `color.md`、`color-semantics.md` | 已录入 |
| 中性色 | `text-*`、`outline-*`、`background-*`、`white` | 文本、边框、容器、页面背景 | 不参与功能色换肤 | `figma/Color.json` | `color.md` | 已录入 |
| 基础间距 | `spacing/*`、`spacing/horizontal/*`、`spacing/vertical/*` | padding、margin、gap | 不适用 | `figma/unit.json` | `spacing.md` | 已录入 |
| 尺寸 scale | `size/*`、`size/icon/*`、`size/component-height/*` | 图标、组件高度、固定尺寸 | 不适用 | `figma/unit.json` | `size.md`、`icon.md` | 首轮录入 |
| 圆角 scale | `radius/*` | 控件、容器、卡片、胶囊圆角 | 不适用 | `figma/unit.json` | `radius.md` | 首轮录入 |
| 语义间距 | `form/control/max-width` 等组件专属单位 | 组件或模板专属布局 | 不适用 | `foundations/semantic-unit.json` | `components/base/form.md` | 首轮录入 |
| 字体 | `font-size/*`、`line-height/*`、`font-weight/*` | 标题、正文、辅助文案 | 不适用 | `foundations/typography.json` | `typography.md` | 已录入 |
| 分割线 | `divider/width/*`、`divider/color/*` | 容器与内容层级分隔 | 不适用 | `foundations/divider.json` | `divider.md` / 组件文档 | 已录入 |
| 阴影 | `shadow/*`、`active-ring/*` | 浮层、卡片、聚焦外环 | 中性层不换肤；功能态由语义色派生 | `foundations/shadow.json` | `shadow.md` | 已录入 |
| 导航颜色 handle | `theme-top-*`、`theme-side-*`、`body-background` | 顶导、侧导、标题栏、页面背景 | Product Shell Theme，独立于 Functional Skin | `figma/Color.json` | `navigation-color.md` | 首轮录入 |
| 导航主题氛围 | `navigationTheme` | 导航渐变、氛围层、accent、品牌 handles | Product Shell Theme，独立于 Functional Skin | `foundations/navigation-theme.json` | `navigation-color.md` | green / blue 已录入 |
| 功能色换肤矩阵 | `functionalSkin` | 功能色 01–10 绿/蓝 | Functional Skin | `foundations/functional-skin.json` | `theme-skinning.md` | green / blue 已录入 |
| antd 组件主题映射 | `components.*` | antd 承接层的组件默认值 | 不直接作为业务取值入口 | `build-tokens.mjs` | `theme.ts`、对应组件文档 | 脚本层 |
| 脚本层公式常量 | 输入框、选择器等公式值 | 无法由通用 token 表达的组件公式 | 不适用 | `build-tokens.mjs` | 对应组件文档 | 脚本层 |
| 文案 | `zh-cn.tokens.json`、`en.tokens.json` | i18n 文案承接 | 不适用 | `figma/*.tokens.json` | `src/design-system/i18n/` | 已录入 |

## 4. Source 与生成物结构

`tokens/source/figma/` 是 Figma 导出源，包含 `Color.json`、`unit.json`、`zh-cn.tokens.json`、`en.tokens.json`；其中 `unit.json` 同时承载 spacing、size 与 radius。

`tokens/source/foundations/` 是仓库维护的补充源，包含 Typography、Divider、Shadow、Navigation Theme、Functional Skin 与 Semantic Unit。它们与 Figma 导出共同进入同一生成链。

`tokens.resolved.json` 的顶层结构为 `color`、`colorByPath`、`unit`、`typography`、`divider`、`shadow`、`navigationTheme`、`functionalSkin`。antd 的组件级 `components.*` 映射只在 `theme.ts` 中，不应误以为可从 `tokens.resolved.json` 查询。

## 5. 检查边界

`npm run tokens:check` 只验证源文件重新生成后与正式生成物一致，并检查生成结果不存在未解析引用。它不验证：

- 所有 token 的语义是否正确；
- 每个组件是否已经消费对应 token；
- Foundation 文档是否已完成浏览器验收；
- 脚本层公式常量是否应该升级为 token。

## 6. 变更准入

1. 先修改 `tokens/source/` 的对应源文件；不得直接修改 `theme.ts`、`tokens.resolved.json` 或 `i18n/*.json`。
2. 为新增 token 指定分类、语义、适用场景、换肤关系和唯一维护文档。
3. 执行 `npm run tokens:build`，再执行 `npm run tokens:check`。
4. 执行 `npm run build`；失败时不得提交生成物。
5. 若影响现有规则或组件，补对应 Foundation / 组件文档和当天 changelog。

## 7. 当前缺口

- 组件级 semantic token 尚未覆盖全部组件；新增前应先判断是否属于 Foundation、组件专属规则或公式值。
- Navigation Color 与 Functional Skin 仍是两个独立主题系统；不得跨层临时复用 token。绿/蓝矩阵已录入；组件接线与 Context 见换肤流程阶段 2–3。
- 本篇是索引，不取代 `tokens.resolved.json` 的完整键值清单。
