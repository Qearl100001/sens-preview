# Sens.Design 预览工程

最小的 Vite + React + antd 预览环境，已接好你从 Figma 导出的设计 token 和中英文文案。
用来一个人验证「设计还原」：颜色、圆角、控件高度、换肤、i18n 是否都对得上 Figma。

## 跑起来

```bash
npm install
npm run dev
```

打开终端给出的本地地址（默认 http://localhost:5173）。

## 这屏在验证什么

- 顶部「功能色换肤」：绿 / 蓝切换（功能色 `@component-primary` 系 ↔ 冰绽蓝阶；链接等状态色不变）。
- 顶部「中 / EN」：用你 Text 集合的 364 条真实文案切换，antd 自带组件文字也跟着切。
- 卡片里直接显示主色、圆角、控件高度、间距基准的真实值，方便和 Figma 对照。
- 状态色卡片：核对 error/warning 的语义对法（红→error、琥珀→warning），不满意去 `build-tokens.mjs` 改一行。

## 目录

```
src/
  App.tsx                      预览页
  i18n.ts                      i18n 初始化
  design-system/
    theme.ts                   antd 主题（由 build-tokens.mjs 生成）
    tokens.resolved.json       全量已解析 token（color handle→hex、unit→number）
    i18n/zh.json / en.json      文案资源
```

## 更新 token（每次从 Figma 重新导出后）

1. 在 Figma 重新导出 Color / .Unit / Text 的 DTCG JSON。
2. 用根目录的 `build-tokens.mjs` 重新生成：
   ```bash
   node build-tokens.mjs <导出文件目录> ./src/design-system
   ```
3. 产物自动覆盖更新，刷新页面即可。

> 注：当前 Color、.Unit 只导了单 mode。字号暂用 antd 默认（你们的字阶还没做成变量）。功能色换肤见 `functional-skin.ts`；`theme.ts` 在脚本产物基础上有手扩 Button token。
