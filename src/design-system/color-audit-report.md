# 颜色审计报告（只读清单 · 待人工确认）

> 生成方式：`rg` 扫描 `src/`（**排除** `tokens.resolved.json`）。**不自动批量替换**；确认后再逐项改。
>
> **勿误伤**：`tokens.resolved.json` / `colorByPath` 里出现 hex、基础色板路径是正常现象。
>
> **勿「纠正」**：`info-color` → `colorWarning`、`warning-color` → `colorError` 为**故意映射**（见 `color-semantics.md`）。

扫描日期：2026-06-17 · 更新：2026-06-17（第三轮）

---

## A. 链接绑了 `color="primary"`（应走状态色 `colorLink`）

| 文件 | 状态 |
|---|---|
| `src/ui/SensButton.tsx` | ✅ **已修**（`variant="link"`，无 `color="primary"`） |

---

## B. 业务代码硬编码 hex / rgba

### `src/design-system/theme.ts`

| 项 | 状态 |
|---|---|
| 状态色三处 + 图标 + 中性色 + Table | ✅ **已修**（走 `c["…"]` handle） |
| 功能色换肤 | ✅ **已修**（`functional-skin.ts` + `buildAntdTheme(skin)`） |
| `hexToRgba()` 工具 | ✅ 正常（从 token 计算） |

### `src/App.tsx`

| 项 | 状态 |
|---|---|
| 页面背景 | ✅ **已修**（`AppLayout` 用 `token.colorBgLayout`） |
| 换肤控件 | ✅ **已修**（绿/蓝功能色 Segmented，无暗色模式） |

### `src/components/SchemaManagementPage.tsx`

| 项 | 状态 |
|---|---|
| 浅色 palette | ✅ **已修**（`tokenRgba(...)` + 语义 handle） |
| 操作列链接色 | ✅ **已修**（`type="link"`） |
| 暗色分支 | ✅ **已删**（产品无暗色模式，不维护 dark palette） |

### `src/components/SensitiveDataDecryptDrawer.tsx`

| 项 | 状态 |
|---|---|
| 遮罩/阴影/文字/面板头 rgba | ✅ **已修**（`tokenRgba(...)`） |

### `src/ui/SensButton.tsx` · linkWeak

| 项 | 状态 |
|---|---|
| 弱化链接默认灰 + hover 变蓝 | ✅ **已修**（`sens-btn-link-weak`） |

---

## C. 基础色板路径出现在业务代码

| 文件 | 说明 |
|---|---|
| `functional-skin.ts` | ✅ 蓝肤预设读 `colorByPath["基础色板/冰绽蓝/…"]`，仅换肤层使用 |

---

## D. 工具函数（非问题）

- `theme.ts` / `color-utils.ts` / `SensButton.tsx` / `SensBadge.tsx` 中的 `hexToRgba` — 从 handle 计算，跳过。

---

## E. 已确认正确（勿改）

| 位置 | 说明 |
|---|---|
| `colorError` ← `warning-color` | sensd 警告红 → antd error，**故意** |
| `colorWarning` ← `info-color` | sensd 提醒黄 → antd warning，**故意** |

---

## 状态：本轮审计项已全部完成

- [x] 链接按钮 `colorLink`
- [x] `theme.ts` 状态色 + 图标/Table/中性色
- [x] `App.tsx` 页面背景 + 功能色换肤
- [x] `SensitiveDataDecryptDrawer` rgba
- [x] `SchemaManagementPage` 变量化（无暗色）
- [x] `linkWeak`
- [x] 移除误导性 light/dark 换肤
