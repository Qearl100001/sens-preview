# Sens.Design Design System Preview

`sens-preview` 是 Sens.Design 的规则源、实现、预览与验收项目，用来把设计 Token、Foundation、组件规则和页面样板沉淀成可读取、可构建、可验证的设计系统资产。

当前阶段为 **v0.9 Current Coverage Release**。它不是“全量组件库已经完成”，而是当前已覆盖能力的可追溯基线：已完成的资产可被验证和消费，未完成的能力必须明确列出状态与后续入口。

## 项目边界

- `sens-preview`：上游设计系统，维护 Token、Foundation、基础组件、复合组件、样板间和验收证据。
- `sens-prototype`：下游 PRD 原型项目，通过固定版本 Prototype Kit 消费正式资产；其原型收口与设计规格门槛在独立仓库维护。
- 业务原型里的临时 DOM 和样式不能直接当作正式 Sens.Design 资产。

## 正式入口

- [`DESIGN.md`](./DESIGN.md)：项目定位、规则层级、阅读路径和工作方式。
- [`AGENTS.md`](./AGENTS.md)：Agent 启动说明。
- [`docs/foundations/`](./docs/foundations/)：跨组件 Foundation 规则。
- [`src/design-system/components/`](./src/design-system/components/)：基础组件与复合组件规则。
- [`src/design-system/templates/`](./src/design-system/templates/)：页面样板规则。
- [`src/design-system/changelog/`](./src/design-system/changelog/)：已发生变更与验收历史。

本地预览的主要入口包括 `/overview`、`/basic-styles/*`、`/components/*`、`/composite/*`、`/templates/*`、`/cases/*`、`/guides` 和 `/changelog`。

## 本地运行

```bash
npm install
npm run dev
```

生产构建与项目门禁：

```bash
npm run build
```

## Token 更新

Token 数值与别名以 `tokens/source/` 为真相源。不要直接修改 `theme.ts`、`tokens.resolved.json` 等生成物。

从 Figma 导出 DTCG JSON 后，通过根目录的构建脚本重新生成：

```bash
node build-tokens.mjs <导出文件目录> ./src/design-system
```

## v0.9 当前边界

- Color、Typography、Spacing 已形成稳定规则和验证证据。
- Product Shell 已具备正式运行时出口，Prototype Kit `0.1.0-p0.9` 已生成可固定消费的本地包。
- p0.9 新增公开出口：Upload、View Switch、Switch、通知配置与对象选择器；通知配置样板间已登记到 catalog。
- Button、Form、Table 等部分能力仍需继续补齐状态矩阵或验收证据，但不阻止当前覆盖基线成立。
- TikTok 页面属于早期方法验证草稿，视觉还原与设计审核未完成，不属于 v0.9 正式案例或作品集成果。
- 时间选择当前只发布使用规范与交互示意，完整可复用组件长期延后且不进入 Prototype Kit。
- 上传网络传输、通知后端、权限和持久化仍由下游业务负责。

资产状态同时记录成熟度、实现状态与验证状态。具体口径和冲突裁决以 [`DESIGN.md`](./DESIGN.md) 为准。
