# 设计系统 skill · 基础组件：面包屑 Breadcrumb

> Agent 还原面包屑时读本篇。面包屑是独立基础组件；标题栏通过 props 组合，不内联实现样式。

## 黑盒约定

- 规则收口到 `src/ui/SensBreadcrumb` + `breadcrumb.css`。
- 颜色 / 字号 / 间距 / 省略图标必须走 Sens token；禁止业务硬写 12px / link hex / 文字 `...`。
- 省略下拉复用 `SensDropdownMenu` / `SensDropdownMenuItem`，不另造浮层样式。
- 标题栏内上下留白、与标题间距 → 见 `title-bar.md`，本组件不负责。

## API 使用

```tsx
<SensBreadcrumb
  items={[
    { key: "a", label: "一级", onClick: () => {} },
    { key: "b", label: "二级", onClick: () => {} },
    { key: "c", label: "当前" },
  ]}
/>

<SensBreadcrumb ellipsis items={longItems} />
```

## Props 约定

| Prop | 默认 | 说明 |
|---|---|---|
| `items` | 必填 | 最后一项为当前页 |
| `ellipsis` | `false` | 首项 / `more`+下拉 / 当前项 |

`SensBreadcrumbItem`：`key`、`label`、可选 `onClick`。

## 落地要求

- 字号组合 `font-size/s` + `line-height/s` + `font-weight/regular`。
- **全部层级默认色**（含当前项、分隔、`more`）：`text-sub-color-transparent` @0.58；当前项不加深。
- 可点祖先与 `more`：悬停 `link-color`，点击 `link-active-color`。
- 项间距 `spacing/1x`；分隔符 `/`。
- 省略态：`SensIcon name="more" sizeToken="size/icon/s"`；点击展开 `SensDropdownMenu`，选项为 `items.slice(1, -1)`。
- 当前项不可点，须挂 `aria-current="page"`；与默认同色。
- 下拉中有 `onClick` 的项点击后执行并关闭浮层；**无 `onClick` 的项仍可点，仅关闭浮层**（不导航）。
- 可点祖先与 `more` 须有 `:focus-visible` 可见焦点环。

## 与 TitleBar

- `SensPageTitleBar` 的 `breadcrumbItems` / `breadcrumbEllipsis` 透传本组件。
- 有面包屑时栏高、距顶、操作对齐 → 仅 `title-bar.md`。

## 预览入口

- `/components/breadcrumb`：普通态 / 省略态（含 more 下拉）Demo 与规则矩阵。
- 标题栏组合样张仍在 `/components/title-bar`。

## 当前边界

- 单项过长 `maxWidth: 160` 为组件内受控常量，尚未进 size token。
