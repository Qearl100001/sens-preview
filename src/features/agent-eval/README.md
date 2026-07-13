# AgentEval 独立静态页

构建后可在 `dist/agent-eval.html` 打开（需同目录 `assets/`）。

## 开发

- 场景页（sens-preview 内）：http://127.0.0.1:5173/scene/agent-eval-dashboard
- 独立入口 dev：http://127.0.0.1:5173/agent-eval.html

## 构建与预览

```bash
npm run build:agent-eval
# 产出 dist-agent-eval/，资源为相对路径，可解压后双击 agent-eval.html（需同目录 assets/）
```

也可走完整 build（与主站共用 dist/，资源为绝对路径，需 HTTP 静态服务）：

```bash
npm run build
npx serve dist
# 打开 /agent-eval.html
```

## 范围

- 离线实验 + 生产环境双 Tab
- 图表区域为占位外壳
- KPI 卡片激活后在下方内联展示详情（非抽屉）
- 用例「详情」走 `SensDrawer` 中号（864px），Evaluator 表用 `sens-table`
- 维度列色：绿 / 蓝 / 紫（`success-color` / `link-color` / 兰花紫 colorByPath）
- mock 数据见 `evalOfflineReportSpec.ts`、`evalProductionReportSpec.ts`
