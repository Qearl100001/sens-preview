# Empty State Foundation（异常状态）

> 页面级 / 非页面级空态插画、排版与可复用组件的规则源。
> 成熟度：Pilot
> 实现：Implemented · `SensEmptyState` + 插画资产登记
> 验证：Verified（2026-08-06：样张 20 实例；Table 三态；DataSource 下钻；下拉 special 样张 + `optionsLoadFailed` 打开态）
> 来源：Figma 资产 `IBBF40Lst6uPPJf70pi0bh` · `2214:13208`；规范画布 `ddSeu8LDLVKKkCQEyZpAxN` · `550:18213`
> 预览：`/basic-styles/empty-state`

## 1. 定位

Empty State Foundation 负责异常 / 空态插画资产、尺寸档位、文案层级和 `SensEmptyState` 消费契约。

空态插画**不进入** Icon registry（见 `icon.md`「不纳入范围」）。资产落在 `src/assets/empty-state/`，经 `EmptyStateIllustrations.ts` 映射。

```text
Illustration PNG
  -> EmptyStateIllustrations
  -> SensEmptyState
  -> 页面整页空态 / 表格 / 下拉浮层 / 业务壳
```

## 2. 范围分层

| 层级 | 场景 | 插画边长 | 类型 |
|---|---|---|---|
| 页面级 · 大 | 整页异常（404 / 网络 / 搜索无结果 / 暂无数据 / 暂无权限） | 266 | `notFound` `networkError` `searchNoResult` `noData` `noPermission` |
| 页面级 · 小 | 同类型、窄内容区 | 192 | 同上 |
| 非页面级 · 基础 | 卡片 / 面板 / 表格区 | 100 | `networkError` `noResult` `noPermission` `noData` `loadFailed` |
| 非页面级 · 特殊 | 下拉浮层等紧凑容器 | 50（源图 100 缩放） | 同上 |

页面级「搜索无结果」与非页面级「暂无结果」是不同 type（`searchNoResult` vs `noResult`），插画也不同。

## 3. 排版与间距

### 页面级

| 项 | 规则 | Token / 常量 |
|---|---|---|
| 插画 → 文案 | 32px | `spacing/vertical/8x`（= `spacing/8x`） |
| 标题 → 说明 | 16px | `spacing/vertical/4x` |
| 标题 | 16 / 24 / 600 | `font-size/l` + `line-height/l` + `font-weight/semibold` |
| 说明 | 14 / 22 / 400 | `font-size/m` + `line-height/m` + `font-weight/regular` |
| 标题色 | 主文 | `text-color-transparent` @0.9 |
| 说明色 | 辅助 | `text-sub-color-transparent` @0.58 |
| 内嵌链接 | 链接色 | `link-color` + `SensButton tone="link"` |
| 说明内联 gap | 4px | `spacing/horizontal/1x` |

### 非页面级

| 项 | 规则 | Token |
|---|---|---|
| 外层 padding | 20px | `spacing/5x` |
| 插画 → 文案 | 12px | `spacing/vertical/3x` |
| 标题 → 说明 | 4px | `spacing/vertical/1x` |
| 标题 | 14 / 22 / 400 | `font-size/m` + `line-height/m` + `font-weight/regular` |
| 说明 | 12 / 18 / 400 | `font-size/s` + `line-height/s` + `font-weight/regular` |
| 色 / 链接 | 同页面级 | 同上 |

## 4. 组件 API（摘要）

```tsx
<SensEmptyState
  scope="page" | "non-page"
  type={...}
  size="large" | "small" | "base" | "special"
  title?: ReactNode
  description?: ReactNode          // 完整自定义说明
  descriptionPrefix?: string       // 与 actionLabel 组合
  actionLabel?: string
  onAction?: () => void
  actions?: ReactNode              // 标题下额外操作区
/>
```

- `SelectDropdownEmpty` 内部已改为消费 `scope="non-page" size="special"`。
- `TableShell` 空态已改为消费 `scope="non-page" size="base"`（壳层保留 padding / min-height）。
- `DataSourceEmptyState`（TikTok 样板）已改为消费 `scope="non-page" size="base"`，主按钮走 `actions`。

## 5. 资产路径

| 范围 | 目录 |
|---|---|
| 页面级 | `src/assets/empty-state/page/*.png` |
| 非页面级 | `src/assets/empty-state/non-page/*.png`（含 `*-small` 别名） |
| 映射 | `src/ui/EmptyStateIllustrations.ts` |

## 6. 待确认

- [x] 是否补 foundation `spacing/8x = 32`，替换页面级受控常量（已补；`EMPTY_STATE_PAGE_STACK_GAP` 现等于 `spacing/vertical/8x`）。
- [ ] 页面级小尺寸（192）是否需要独立导出，还是始终缩放大图。
- [x] Table 空态是否统一迁到 `SensEmptyState`（已迁；尺寸改用非页面级 base 100，不再行高推导插画边长）。
- [ ] 默认中文文案是否全部进 i18n（下拉已走 i18n；组件默认文案仍硬编码中文）。
- [ ] DataSource 空态标题字重是否需从 Foundation regular 改回业务 medium（当前对齐 Foundation）。
