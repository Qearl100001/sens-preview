# Divider Foundation

> 主要来源：Figma `Sens.Design_分割线 v2.1_20230315`、`src/design-system/tokens.resolved.json`、`src/design-system/color-utils.ts`。  
> 当前状态：已接入 `build-tokens.mjs` → `tokens.resolved.json`；运行时通过 `getDividerColor()` / `getDividerBorder()` 消费。

## 1. 定位

Divider 是基础样式，不只是颜色。它由线色、透明度、宽度、方向和使用场景共同决定。

分割线统一使用 1px 线宽：

```text
divider/width/hairline = 1px
```

## 2. 四个线色

分割线有四个颜色层级，每个层级都有透明版本和非透明版本。

| 语义 | 透明版本 | Alpha | 非透明版本 | 推荐用途 |
|---|---|---:|---|---|
| 线/01_深分割线 | `divider/color/deep/transparent` -> `divideline-color-transparent-dack` | 16% | `divider/color/deep/solid` -> `divideline-color-dack` | 控件默认边框、较强分隔 |
| 线/02_描边 | `divider/color/outline/transparent` -> `outline-color-transparent` | 12% | `divider/color/outline/solid` -> `outline-color` | 卡片外描边、容器边界 |
| 线/03_浅分割线 | `divider/color/light/transparent` -> `divideline-color-transparent-light` | 8% | `divider/color/light/solid` -> `divideline-color-light` | 卡片内部、表格行、区块内分割 |
| 线/04 | `divider/color/weak/transparent` -> `line-color-transparent` | 6% | `divider/color/weak/solid` -> `line-color` | 最弱层级线、背景区弱边界 |

## 3. 代码入口

**推荐**（Divider Foundation 入库后）：

```ts
import { getDividerBorder, getDividerColor } from "../design-system/divider";

getDividerColor("light", "transparent");
getDividerColor("light", "solid");
getDividerBorder("light");
```

**迁移对照**（旧颜色 handle → 新 API）见 `DIVIDER_HANDLE_MAPPINGS`（`src/design-system/divider.ts`）：

| 新 token | tone / mode | 透明 handle | 推荐 API | 旧写法（勿新增） |
|---|---|---|---|---|
| `divider/color/deep/transparent` | deep / transparent | `divideline-color-transparent-dack` | `getDividerColor("deep", "transparent")` | `tokenRgba("divideline-color-transparent-dack", 0.16)` |
| `divider/color/outline/transparent` | outline / transparent | `outline-color-transparent` | `getDividerColor("outline", "transparent")` | `tokenRgba("outline-color-transparent", 0.12)` |
| `divider/color/light/transparent` | light / transparent | `divideline-color-transparent-light` | `getDividerColor("light", "transparent")` | `tokenRgba("divideline-color-transparent-light", 0.08)` |
| `divider/color/weak/transparent` | weak / transparent | `line-color-transparent` | `getDividerColor("weak", "transparent")` | `tokenRgba("line-color-transparent", 0.06)` |

非透明版本：`getDividerColor(tone, "solid")` 等价于 `getColorToken("<solidHandle>")`（如 `divideline-color-light`、`outline-color`）。

`resolveDividerFromColorHandle(handle)` 可从旧 handle 反查 tone/mode，供批量迁移审计。

## 4. 使用规则

- 组件和页面里不直接硬写 `#EBEDF0`。
- 组件和页面里不直接硬写 `rgba(0, 21, 64, 0.08)`。
- 使用 antd `colorBorderSecondary` 时，必须说明它对应的是 `divideline-color-light`，不能只写 antd 名称。
- 需要先判断当前线是外轮廓描边，还是内容内部分割。
- 导航专用菜单线仍归属 Navigation Color，不直接混入普通 Divider。

## 5. 场景映射

| 场景 | 推荐 token | 说明 |
|---|---|---|
| 输入类控件默认边框 | `divider/color/deep/transparent` | 常见默认边框强度 |
| 卡片外描边 | `divider/color/outline/transparent` | Card、容器边界 |
| 卡片内部横线 | `divider/color/light/transparent` | 标题区 / 操作区 / 内容区之间 |
| 表格行分割线 | `divider/color/weak/solid` 或 `divider/color/light/transparent` | 具体跟 Table 规则校验 |
| 信息项之间竖线 | `divider/color/light/transparent` | 状态和时间、操作按钮之间 |
| 背景区弱边界 | `divider/color/weak/transparent` | 最弱层级 |

## 6. 待补

- 组件内遗留 `tokenRgba("divideline-*")` / `tokenRgba("outline-color-transparent")` 按上表逐个改为 `getDividerColor` / `getDividerBorder`（Card 样张已迁移）。
- 导航专用菜单线仍归属 Navigation Color。
