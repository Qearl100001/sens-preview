# Cursor 交接：复合表单新增带锚点表单场景

## 任务

在 `/composite/form` 新增一个“带锚点表单”场景，还原 Figma 节点 `53:14966`。

Figma：<https://www.figma.com/design/IBBF40Lst6uPPJf70pi0bh/设计系统_v2.1（神策绿）?node-id=53-14966&m=dev>

这是一个左右结构的页面级表单：左侧是多分组表单内容，右侧是纵向锚点。

## 先读这些文件

- `DESIGN.md`
- `docs/agent-rules/README.md`
- `docs/agent-rules/page-evaluation-checklist.md`
- `src/design-system/components/composite/form.md`
- `src/design-system/components/base/anchor.md`
- `src/preview/pages/FormTemplatesPage.tsx`
- `src/preview/pages/form-templates.css`
- `src/ui/SensAnchor.tsx`
- `src/ui/anchor.css`

## 建议修改范围

优先只修改：

- `src/preview/pages/FormTemplatesPage.tsx`
- `src/preview/pages/form-templates.css`

在 `FormTemplatesPage.tsx` 中：

1. 将 `TemplateKey` 增加为 `anchor`。
2. 在模板切换区增加“带锚点表单”。
3. 新增 `AnchorFormTemplate`，放置主内容和右侧 `SensAnchor`。
4. 复用已有 `SensForm`、`SensFormItem`、`SensInput`、`SensTextArea`、`SensSelectDropdown`、`SensRadioGroup`、`SensCheckbox`、`SensTag`、`SensButton`。
5. 锚点项至少对应以下分组：
   - 规则基本信息
   - 触发条件
   - 报警方式和疲劳度控制
6. 锚点点击只切换当前高亮和页面内定位演示，不接入真实路由、后端或业务提交。

在 `form-templates.css` 中：

- 增加仅用于新场景的布局类；
- 主内容区与锚点使用弹性布局；
- Demo 中锚点要完整可见，不能被浏览器边界裁切；
- 不覆盖 `SensAnchor` 的真实“最右侧锚定”规则；
- 使用现有表单 token，不复制 antd 默认视觉。

## 还原规则

- 标题字号、字段标签、辅助文案遵循 Form 基础组件规则；辅助文案默认 12px。
- 普通字段标题到控件间距 8px。
- 辅助文案与归属标题间距 4px。
- 卡片内边距 16px，分割线上下间距 16px。
- 单一内容组不增加灰色标题条；只有存在并列信息组时才使用灰条或更强标题。
- 链接按钮使用 SensD 弱化链接按钮，按钮高度与文字行高一致。
- 所有图标使用正式 Sens 图标，不自绘 SVG。

## 不要做

- 不重写 `SensAnchor`、`SensForm` 或基础组件。
- 不新增真实接口、后端数据、路由或复杂业务校验。
- 不修改现有抽屉表单、气泡卡片表单和锚点基础组件页面。
- 不为了 Demo 可见性修改 Anchor 的真实右侧定位规则。
- 不回滚现有工作区修改。

## 验收

- [ ] `/composite/form` 出现“带锚点表单”入口。
- [ ] 主内容和右侧锚点完整可见，无横向溢出。
- [ ] 锚点与分组名称对应，点击后当前项高亮变化。
- [ ] 锚点默认、悬停、点击、选中颜色遵循 Anchor 规则。
- [ ] 三个主要分组及其代表性字段可见。
- [ ] 辅助文案、字段间距、卡片内边距和分割线间距符合表单规则。
- [ ] `npm run typecheck` 通过。
- [ ] `git diff --check` 通过。
- [ ] 使用 `docs/agent-rules/page-evaluation-checklist.md` 完成页面验收。
