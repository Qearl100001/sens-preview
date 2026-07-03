# Typography Foundation

> 主要来源：`/Users/liyuwen/Desktop/Sens.Design_字体_v0.4_220505.pdf`。  
> 当前状态：规则确认中；本文件先作为 foundation 文档，不直接等同于代码 token 已完成。

## 1. 定位

Typography 负责统一页面、组件、业务样板间里的字体家族、字号、行高、字重和使用场景。

后续页面和组件不应该散落硬写 `fontSize: 20`、`lineHeight: "30px"` 这类值，而应该引用 typography token 或 typography helper。

## 2. 字体家族

设计稿主要使用苹方简体。代码侧使用系统字体栈：

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
  "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial,
  sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
```

## 3. 字体层级

| 语义 | 字号 / 行高 | 字重 | 用途 | 状态 |
|---|---:|---:|---|---|
| 超大标题 | 28 / 42 | 600 | 阅读类型纯文本标题 | 入 foundation，当前少用但保留 |
| 一级标题 | 20 / 30 | 600 | 页面级大标题 | 入 foundation，TikTok case 会用 |
| 二级标题 | 18 / 28 | 600 | 页面内嵌通栏卡片标题 | 入 foundation，后期会用 |
| 三级标题 | 16 / 24 | 600 | 通栏卡片内嵌标题 | 入 foundation，TikTok case 会用 |
| 三级标题细体 | 16 / 24 | 400 | 通栏卡片内嵌标题弱化版 | 入 foundation |
| 四级标题 | 14 / 22 | 500 | 图表组件、小卡片标题 | 入 foundation，TikTok case 会用 |
| 正文内容 | 14 / 22 | 400 | 正文信息文案、表单、表格内容 | 入 foundation，TikTok case 会用 |
| 辅助信息加粗 | 12 / 18 | 500 | 组件内辅助标题、弱层级强调 | 入 foundation |
| 辅助文案 | 12 / 18 | 400 | 说明、提示、统计、面包屑 | 入 foundation，TikTok case 会用 |

## 4. 当前代码状态

当前 `tokens.resolved.json` 里 typography 只显式包含：

| token | 值 |
|---|---:|
| `font-size/s` | 12 |
| `line-height/s` | 18 |

当前先补充以下 typography token 口径，作为组件和样张收敛散落字体值的目标：

| token | 值 | 来源 / 用途 | 状态 |
|---|---:|---|---|
| `font-size/s` | 12 | 辅助文案、标签文字、弱层级说明 | 已在 `tokens.resolved.json` |
| `line-height/s` | 18 | 辅助文案、标签文字、弱层级说明 | 已在 `tokens.resolved.json` |
| `font-size/m` | 14 | 正文、表单、表格、卡片标题、操作文字 | 待补 token / helper |
| `line-height/m` | 22 | 正文、表单、表格、卡片标题、操作文字 | 待补 token / helper |
| `font-size/l` | 16 | 三级标题、通栏卡片内嵌标题 | 待补 token / helper |
| `line-height/l` | 24 | 三级标题、通栏卡片内嵌标题 | 待补 token / helper |
| `font-size/xl` | 18 | 二级标题 | 待补 token / helper |
| `line-height/xl` | 28 | 二级标题 | 待补 token / helper |
| `font-size/xxl` | 20 | 一级标题、页面级标题 | 待补 token / helper |
| `line-height/xxl` | 30 | 一级标题、页面级标题 | 待补 token / helper |
| `font-size/display` | 28 | 超大标题、阅读型纯文本标题 | 待补 token / helper |
| `line-height/display` | 42 | 超大标题、阅读型纯文本标题 | 待补 token / helper |
| `font-weight/regular` | 400 | 正文、操作、辅助文案 | 待补 token / helper |
| `font-weight/medium` | 500 | 四级标题、组件内强调 | 待补 token / helper |
| `font-weight/semibold` | 600 | 页面标题、区块标题 | 待补 token / helper |

字体层级与 token 组合关系：

| 语义 | token 组合 |
|---|---|
| 超大标题 | `font-size/display` + `line-height/display` + `font-weight/semibold` |
| 一级标题 | `font-size/xxl` + `line-height/xxl` + `font-weight/semibold` |
| 二级标题 | `font-size/xl` + `line-height/xl` + `font-weight/semibold` |
| 三级标题 | `font-size/l` + `line-height/l` + `font-weight/semibold` |
| 三级标题细体 | `font-size/l` + `line-height/l` + `font-weight/regular` |
| 四级标题 | `font-size/m` + `line-height/m` + `font-weight/medium` |
| 正文内容 | `font-size/m` + `line-height/m` + `font-weight/regular` |
| 辅助信息加粗 | `font-size/s` + `line-height/s` + `font-weight/medium` |
| 辅助文案 | `font-size/s` + `line-height/s` + `font-weight/regular` |

现有代码里已经大量出现这些组合：

- `28 / 42`
- `20 / 30`
- `18 / 28`
- `16 / 24`
- `14 / 22`
- `12 / 18`

这些值与设计规则方向一致，但很多仍然散落在页面或组件实现里。后续需要补 typography token / helper，把这些硬写值收敛起来。

Typography 预览页已补：`/basic-styles/typography` 当前用于展示字体层级、token 状态和 TikTok case 使用对照；它是验收样张，不代表真实组件已全部接入 typography token / helper。

## 5. TikTok Case 使用规则

- 数据源管理页标题：一级标题 `20 / 30 / 600`。
- 下钻页标题：一级标题 `20 / 30 / 600`。
- 信息面板标题：三级标题 `16 / 24 / 600`。
- 数据源卡片标题：四级标题 `14 / 22 / 500`，如卡片规范要求更强可再确认是否使用 600。
- 表格正文、表单正文、普通说明：正文内容 `14 / 22 / 400`。
- 卡片描述、状态补充、面包屑、辅助说明：辅助文案 `12 / 18 / 400`。
- 组件内部弱层级强调：辅助信息加粗 `12 / 18 / 500`。

## 6. Token 落地规则

- 所有组件和业务页面的字体规则必须绑定 Typography Foundation，不允许长期硬写字号、行高、字重。
- 缺少 typography token 时，可以补充 token / helper / 组件语义规则，但不能在组件里直接硬写一个新值绕过去。
- antd token 只能作为实现承接层：只有当 antd 字体 token 已明确映射到 SensD typography 规则时，组件才可以通过 antd token 消费。
- 页面和组件不得随手新增游离字号，例如 13、15、17。
- 页面和组件不得随手新增游离行高，例如 20、21、26，除非先记录为组件公式值或补 typography token。
- 页面和组件不得长期硬写字体值；临时发现缺口时，应先记录缺口，再补 typography token / helper。
- `tokens.resolved.json` 是生成物，不能直接手改。
- 在找到完整 token 生成源之前，可以先建立受控的 typography token/helper 入口，再逐步替换散落硬写值。
- 后续改组件时需要报告：字体值来自哪个 typography token / helper / foundation 规则，还是哪个待确认规则。
- `font-weight/*` 也属于 typography token，不应在组件里长期散落硬写 400 / 500 / 600。

## 7. 待补

- 补 `font-size/m/l/xl/xxl/display`、`line-height/m/l/xl/xxl/display`、`font-weight/regular/medium/semibold` 的 token / helper 方案。
- 将现有页面和组件中的散落字体值逐步替换为 token 引用。
- Typography 预览页已补，后续继续作为字号、行高、字重的验收基准。
- 后续校验二级标题、超大标题在真实页面中的使用边界，避免企业应用页面局部字号过大。
