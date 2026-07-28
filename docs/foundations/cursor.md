# Cursor Foundation（鼠标指针）

> SensD 鼠标指针**使用规则** + 系统光标消费方式。
> 成熟度：Pilot
> 实现：Partial
> 验证：Pending
> 规则来源：《Sens.Design_鼠标指针 v2.1》`0bp7bkM0yiz8oVQm1XTsHj` / `1301:6804`
> 形态参考：Figma `IBBF40Lst6uPPJf70pi0bh`（示意；**不**作为运行时位图）
> 实现入口：`src/ui/cursors.css` · `src/design-system/cursors.ts`
> 预览：`/basic-styles/cursor`

> **易混**：`src/design-system/how-cursor-works.md` 是 **Cursor AI** 工作说明，不是鼠标光标文档。

## 1. 定位

| 层 | 做什么 |
|---|---|
| **规则（SensD）** | 何时用哪一态、中文名、描述、move vs grab |
| **实现（系统光标）** | CSS 关键字 `cursor: move` 等，原生观感，可直接使用 |
| **示意 PNG** | 仅走查页说明用（`public/cursors/*.png` 为 **64×64 @2x**，页面 CSS 显示 32px），**不**挂到真实 `cursor: url()` |

```text
SensD 规则语义
  -> CSS 系统关键字（--sens-cursor-* / .sens-cursor-*）
    -> 组件（如页签拖拽 move）
```

## 2. 本轮主验 8 态（规则）

| 类型 | 中文名 | CSS（系统） | 描述 |
|---|---|---|---|
| 默认 | 默认指针 | `default` | 标示指针处于待执行状态 |
| 状态 | 可点击 | `pointer` | 标示可点击交互的对象 |
| 选择 | 横向文字选择 | `text` | 标示可编辑或选择的水平文本或控件 |
| 选择 | 竖向文字选择 | `vertical-text` | 标示可编辑或选择的垂直文本或控件 |
| 选择 | 十字光标 | `crosshair` | 标示精准绘制或选取 |
| 移动 | 移动 | `move` | 标示对象可移动，改变的是对象的位置（坐标值） |
| 移动 | 可抓取 | `grab` | 标示对象视图中的内容可移动，当在固定视图（例如地图）中平移内容时 |
| 移动 | 抓取中 | `grabbing` | 标示对象视图中的内容正在平移 |

### move vs grab（易混）

| | `move` | `grab` → `grabbing` |
|---|---|---|
| 语义 | 改**对象位置**（坐标） | 改**视口 / 内容平移** |
| SensD 约定 | 页签排序等「换位」 | 地图、无限画布平移 |

## 3. 完整映射

| 语义 | CSS 类 / 变量 | 系统关键字 |
|---|---|---|
| 默认指针 | `.sens-cursor-default` | `default` |
| 可点击 | `.sens-cursor-pointer` | `pointer` |
| 禁用 | `.sens-cursor-not-allowed` | `not-allowed` |
| 横向文字 | `.sens-cursor-text` | `text` |
| 竖向文字 | `.sens-cursor-vertical-text` | `vertical-text` |
| 十字 | `.sens-cursor-crosshair` | `crosshair` |
| **移动** | `.sens-cursor-move` | `move` |
| 禁止放下 | `.sens-cursor-no-drop` | `no-drop` |
| 可抓取 | `.sens-cursor-grab` | `grab` |
| 抓取中 | `.sens-cursor-grabbing` | `grabbing` |
| 复制 | `.sens-cursor-copy` | `copy` |
| 调整尺寸族 | `.sens-cursor-*-resize` | 同名 |
| 调整列宽 | `.sens-cursor-col-resize` | `col-resize` |

## 4. 拖拽场景

| 场景 | 应用态 | 禁止 |
|---|---|---|
| 页签标签页拖拽排序（`SensEditableCardTabs`） | **系统 `move`** | `grab` / `grabbing` |
| 画布 / 地图平移 | `grab` → `grabbing` | 与页签「换位」混用 |

## 5. 热区原则（规则稿）

- 交互热区应足够大，避免「只有像素级可点」。
- 复选 / 标签等：热区覆盖可点范围；指针落在热区内用对应态（如 `pointer`）。
- 走查时看**系统光标**是否切换正确；卡片内 PNG 只是规则示意。

## 6. 消费方式

```css
.my-draggable {
  cursor: var(--sens-cursor-move); /* = move */
}
```

```ts
import { sensCursorValue, SENS_CURSOR_MOVE } from "../design-system/cursors";

style={{ cursor: sensCursorValue("move") }} // "move"
// 或 className={SENS_CURSOR_MOVE.className}
```

## 7. 已知限制

- 系统光标外形随 OS / 浏览器，与 Figma 示意不完全一致；**语义**以 SensD 规则为准。
- `vertical-text` 等在部分环境支持较弱，可能回退为相近态。
- 走查：`/basic-styles/cursor`；页签对照：`/components/tabs`。
