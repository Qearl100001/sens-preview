import type { CSSProperties } from "react";
import type { ColumnsType } from "antd/es/table";
import { buildShadowD4, getColorToken, tokenRgba } from "../../design-system/color-utils";
import { getDividerHairlineWidth } from "../../design-system/divider";
import {
  getProductShellNavDropdownByLabel,
  getProductShellPrimaryNavItems,
} from "../../design-system/product-shell-nav-catalog";
import { getUnitToken } from "../../design-system/unit";
import {
  LinkButton,
  SensButton,
  SensSelectDropdown,
  SensTableFilterBar,
  SensTopNavigation,
  SensTips,
  TableActions,
  TableShell,
  type NavDropdownConfig,
  type SensTopNavigationItem,
} from "../../ui";
import { SearchInput } from "../../ui/SearchInput";
import { SensIcon } from "../../design-system/icons";
import { useProductShellContentScroll } from "./useProductShellContentScroll";
import "./product-shell-template.css";

const TOP_NAV_STRUCTURAL_HEIGHT = 82;

const PRODUCT_NAV_ITEMS: SensTopNavigationItem[] = [
  ...getProductShellPrimaryNavItems(),
  { label: "更多", arrow: true },
];

const PRODUCT_SHELL_NAV_DROPDOWN_BY_LABEL: Record<string, NavDropdownConfig> =
  getProductShellNavDropdownByLabel() as Record<string, NavDropdownConfig>;

interface TaskRow {
  key: string;
  name: string;
  owner: string;
  status: string;
  updatedAt: string;
}

const TABLE_ROWS: TaskRow[] = Array.from({ length: 36 }, (_, index) => ({
  key: `${index + 1}`,
  name: `用户行为采集任务 ${String(index + 1).padStart(2, "0")}`,
  owner: ["普拉提", "钱佳仪", "李勇", "陈思远"][index % 4],
  status: index % 5 === 0 ? "异常" : "成功",
  updatedAt: `2026-09-${String((index % 8) + 1).padStart(2, "0")} 10:${String((index * 7) % 60).padStart(2, "0")}`,
}));

const TABLE_COLUMNS: ColumnsType<TaskRow> = [
  {
    title: "任务名称",
    dataIndex: "name",
    key: "name",
    width: 360,
    render: (value: string) => <LinkButton tone="weak">{value}</LinkButton>,
  },
  { title: "负责人", dataIndex: "owner", key: "owner", width: 180 },
  { title: "状态", dataIndex: "status", key: "status", width: 160 },
  { title: "更新时间", dataIndex: "updatedAt", key: "updatedAt", width: 220 },
  {
    title: "操作",
    key: "actions",
    width: 180,
    render: () => <TableActions items={[{ key: "view", label: "查看" }, { key: "edit", label: "编辑" }]} />,
  },
];

const ENTITY_FILTER_OPTIONS = [
  { label: "选项一", value: "option-1" },
  { label: "选项二", value: "option-2" },
];

const ENTITY_FILTER_FIELDS = [
  { key: "category", label: "分类" },
  { key: "dataType", label: "数据类型" },
  { key: "tag", label: "标签" },
] as const;

function buildTemplateStyle(): CSSProperties {
  return {
    "--shell-page-background": getColorToken("body-background"),
    "--shell-surface": getColorToken("white"),
    "--shell-text": tokenRgba("text-color-transparent", 0.9),
    "--shell-sub-text": tokenRgba("text-sub-color-transparent", 0.58),
    "--shell-content-radius": `${getUnitToken("radius/xl")}px`,
    "--shell-content-shadow": "none",
    "--shell-table-filter-border": getColorToken("outline-color-transparent"),
    "--shell-content-padding": `${getUnitToken("spacing/horizontal/6x")}px`,
    "--shell-section-gap": `${getUnitToken("spacing/vertical/4x")}px`,
    "--shell-nav-structural-height": `${TOP_NAV_STRUCTURAL_HEIGHT}px`,
    "--shell-title-bar-shadow": buildShadowD4(),
    "--shell-divider-width": `${getDividerHairlineWidth()}px`,
  } as CSSProperties;
}

export default function ProductShellTableTemplatePage() {
  const {
    scrollRef,
    contentRef,
    topNavCollapsed,
    handleContentScroll,
  } = useProductShellContentScroll();

  return (
    <main
      className={[
        "product-shell-template",
        "product-shell-template--vertical",
        "product-shell-template--standalone",
        "product-shell-table-template",
        topNavCollapsed ? "product-shell-template--collapsed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={buildTemplateStyle()}
      data-product-shell-template
      data-product-shell-layout="table-scroll"
      data-top-nav-collapsed={topNavCollapsed ? "true" : "false"}
    >
      <div
        className="product-shell-template__navigation-layer"
        aria-hidden={topNavCollapsed || undefined}
        data-product-shell-top-nav
      >
        <SensTopNavigation
          embedded
          atmosphere
          activeNavLabel="数据加工"
          items={PRODUCT_NAV_ITEMS}
          navDropdownByLabel={PRODUCT_SHELL_NAV_DROPDOWN_BY_LABEL}
          activeNavMenuByLabel={{ 数据加工: "任务管理" }}
        />
      </div>

      <div className="product-shell-template__workspace">
        <section ref={contentRef} className="product-shell-template__content" aria-label="长表格表头吸顶">
          <div
            ref={scrollRef}
            className="product-shell-template__scroll product-shell-table-template__scroll"
            data-product-shell-content-scroll
            data-sticky-owner="table-header"
            onScroll={handleContentScroll}
          >
            <div className="product-shell-template__title-bar product-shell-table-template__title-bar">
              <h1 id="product-shell-table-heading" className="product-shell-table-template__title">
                实体信息目录管理
              </h1>
              <div className="product-shell-table-template__title-actions">
                <label className="product-shell-table-template__entity-field">
                  <span>实体选择</span>
                  <SensSelectDropdown
                    aria-label="实体选择"
                    options={[{ value: "student", label: "学生" }]}
                    defaultValue="student"
                    style={{ width: 108 }}
                  />
                </label>
                <SensButton tone="secondary" style={{ width: 80 }}>设置目录</SensButton>
              </div>
            </div>

            <section className="product-shell-table-template__filter-section" aria-label="实体信息筛选">
              <SensTableFilterBar
                className="product-shell-table-template__filter-bar"
                search={<SearchInput width={200} placeholder="搜索显示名/名称/备注" />}
                primaryFields={[
                  ...ENTITY_FILTER_FIELDS.map((field) => ({
                    ...field,
                    control: (
                      <SensSelectDropdown
                        aria-label={`按${field.label}筛选`}
                        options={ENTITY_FILTER_OPTIONS}
                        placeholder="请选择"
                        style={{ width: 148 }}
                      />
                    ),
                  })),
                  {
                    key: "enabled",
                    label: (
                      <span className="product-shell-table-template__filter-label-with-help">
                        启用/禁用状态
                        <SensTips title="按启用或禁用状态筛选" placement="top">
                          <span className="product-shell-table-template__filter-help" aria-label="启用/禁用状态说明">
                            <SensIcon name="help" sizeToken="size/icon/m" color="currentColor" />
                          </span>
                        </SensTips>
                      </span>
                    ),
                    control: (
                      <SensSelectDropdown
                        aria-label="按启用或禁用状态筛选"
                        options={[
                          { label: "启用", value: "enabled" },
                          { label: "禁用", value: "disabled" },
                        ]}
                        placeholder="请选择"
                        style={{ width: 148 }}
                      />
                    ),
                  },
                ]}
                moreFields={[
                  {
                    key: "createdAt",
                    label: "创建时间",
                    options: ENTITY_FILTER_OPTIONS,
                  },
                ]}
              />
            </section>

            <section className="product-shell-table-template__table-section" aria-label="任务列表">
              <TableShell<TaskRow>
                stickyHeader="page"
                total={TABLE_ROWS.length}
                columns={TABLE_COLUMNS}
                dataSource={TABLE_ROWS}
                rowKey="key"
                pagination={false}
              />
            </section>

            <section className="product-shell-table-template__outro" aria-label="表格后的页面内容">
              <h2>后续内容</h2>
              <p>继续向上滚动，表头会在任务列表结束后随表格离开内容区。</p>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
