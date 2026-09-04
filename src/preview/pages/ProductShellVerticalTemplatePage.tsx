import { useState, type CSSProperties } from "react";
import { buildShadowD4, getColorToken, tokenRgba } from "../../design-system/color-utils";
import { getDividerHairlineWidth } from "../../design-system/divider";
import { SensIcon } from "../../design-system/icons";
import { navigationCssVar } from "../../design-system/navigation-color";
import {
  getProductShellNavDropdownByLabel,
  getProductShellPrimaryNavItems,
} from "../../design-system/product-shell-nav-catalog";
import { getTypographyToken } from "../../design-system/typography";
import { getUnitToken } from "../../design-system/unit";
import {
  SensAlert,
  SensButton,
  SensCheckbox,
  SensForm,
  SensFormItem,
  SensInput,
  SensInputNumber,
  SensMessageProvider,
  SensPageTitleBar,
  SensRadioGroup,
  SensSectionTitle,
  SensSelectDropdown,
  SensTextArea,
  SensTopNavigation,
  type NavDropdownConfig,
  type SensTopNavigationItem,
  useSensMessage,
} from "../../ui";
import { ProductShellBackTop } from "./ProductShellBackTop";
import { useProductShellContentScroll } from "./useProductShellContentScroll";
import "./product-shell-template.css";

/** 顶导结构高度；收起时 translateY 与正文起点同步扣减。 */
const TOP_NAV_STRUCTURAL_HEIGHT = 82;
const CONTROL_MAX_WIDTH = getUnitToken("form/control/max-width");

const PRODUCT_NAV_ITEMS: SensTopNavigationItem[] = [
  ...getProductShellPrimaryNavItems(),
  { label: "更多", arrow: true },
];

const PRODUCT_SHELL_NAV_DROPDOWN_BY_LABEL: Record<string, NavDropdownConfig> =
  getProductShellNavDropdownByLabel() as Record<string, NavDropdownConfig>;

const ENTITY_OPTIONS = [
  { label: "用户实体", value: "user" },
  { label: "设备实体", value: "device" },
];

const GROUP_OPTIONS = [
  { label: "默认分组", value: "default" },
  { label: "营销活动", value: "campaign" },
];

const ENTITY_SCOPE_OPTIONS = [
  { label: "全部用户", value: "all" },
  { label: "指定分群", value: "cohort" },
];

const TIMEZONE_OPTIONS = [
  { label: "UTC+08:00（服务器时间）", value: "utc8" },
  { label: "UTC+00:00", value: "utc0" },
];

const UPDATE_MODE_OPTIONS = [
  {
    value: "routine",
    label: "例行更新",
    description: "按设定周期自动计算并刷新分群结果",
  },
  {
    value: "manual",
    label: "手动更新",
    description: "仅在手动触发时计算；适合低频或不稳定规则",
  },
];

function buildTemplateStyle(): CSSProperties {
  return {
    "--shell-page-background": navigationCssVar("--sens-nav-page-bg", "body-background"),
    "--shell-surface": getColorToken("white"),
    "--shell-muted-surface": tokenRgba("background-transparent-grey", 0.04),
    "--shell-text": tokenRgba("text-color-transparent", 0.9),
    "--shell-sub-text": tokenRgba("text-sub-color-transparent", 0.58),
    "--shell-article-text": tokenRgba("text-article-color-transparent", 0.74),
    "--shell-icon": getColorToken("icon-color-transparent"),
    "--shell-link": getColorToken("link-color"),
    "--shell-content-radius": `${getUnitToken("radius/xl")}px`,
    "--shell-card-radius": `${getUnitToken("radius/l")}px`,
    "--shell-card-body-radius": `${getUnitToken("radius/m")}px`,
    "--shell-card-border": getColorToken("outline-color-transparent"),
    "--shell-sep": getColorToken("divideline-color-dack"),
    "--shell-divider-width": `${getDividerHairlineWidth()}px`,
    "--shell-content-padding": `${getUnitToken("spacing/horizontal/6x")}px`,
    "--shell-body-padding-block": `${getUnitToken("spacing/vertical/4x")}px`,
    "--shell-section-gap": `${getUnitToken("spacing/vertical/4x")}px`,
    "--shell-card-inner-gap": `${getUnitToken("spacing/4x")}px`,
    "--shell-card-padding": `${getUnitToken("spacing/4x")}px`,
    "--shell-field-gap": `${getUnitToken("spacing/2x")}px`,
    /* 图标与文字：icons.md / spacing 默认 spacing/horizontal/1x = 4 */
    "--shell-icon-text-gap": `${getUnitToken("spacing/horizontal/1x")}px`,
    "--shell-addon-padding-inline": `${getUnitToken("spacing/horizontal/3x")}px`,
    "--shell-control-height": `${getUnitToken("size/component-height/m")}px`,
    "--shell-input-border": tokenRgba("divideline-color-transparent-dack", 0.16),
    /* 灰条标题下同组内容左右内缩 16，与 SensSectionTitle 大号灰条内文字对齐（form.md） */
    "--shell-form-group-padding-inline": `${getUnitToken("spacing/horizontal/4x")}px`,
    "--shell-tag-gap": `${getUnitToken("spacing/2x")}px`,
    "--shell-action-gap": `${getUnitToken("spacing/3x")}px`,
    "--shell-control-max-width": `${CONTROL_MAX_WIDTH}px`,
    "--shell-card-body-size": `${getTypographyToken("font-size/m")}px`,
    "--shell-card-body-line": `${getTypographyToken("line-height/m")}px`,
    "--shell-nav-structural-height": `${TOP_NAV_STRUCTURAL_HEIGHT}px`,
    "--shell-back-top-inset": `${getUnitToken("spacing/6x")}px`,
    "--shell-back-top-size": `${getUnitToken("size/component-height/l")}px`,
    "--shell-title-bar-shadow": buildShadowD4(),
  } as CSSProperties;
}

function ProductShellVerticalTemplateInner() {
  const message = useSensMessage();
  const {
    scrollRef,
    contentRef,
    topNavCollapsed,
    titleBarElevated,
    showBackTop,
    backTopDocked,
    handleContentScroll,
    handleBackToTop,
    handleBackTopPointerEnter,
    handleBackTopPointerLeave,
  } = useProductShellContentScroll();
  const [displayName, setDisplayName] = useState("");
  const [segmentName, setSegmentName] = useState("");
  const [remark, setRemark] = useState("");
  const [entity, setEntity] = useState("user");
  const [group, setGroup] = useState("default");
  const [entityScope, setEntityScope] = useState("all");
  const [timezone, setTimezone] = useState("utc8");
  const [limitEnabled, setLimitEnabled] = useState(false);
  const [updateMode, setUpdateMode] = useState("manual");
  const [retainCount, setRetainCount] = useState<number | null>(10);

  return (
    <main
      className={[
        "product-shell-template",
        "product-shell-template--vertical",
        topNavCollapsed ? "product-shell-template--collapsed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={buildTemplateStyle()}
      data-product-shell-template
      data-product-shell-layout="vertical"
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
          activeNavMenuByLabel={{ 数据加工: "分群管理" }}
        />
      </div>

      <div className="product-shell-template__workspace">
        <section ref={contentRef} className="product-shell-template__content" aria-label="创建分群">
          <div
            className={[
              "product-shell-template__title-bar",
              titleBarElevated ? "product-shell-template__title-bar--elevated" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            data-product-shell-title-elevated={titleBarElevated ? "true" : "false"}
          >
            <SensPageTitleBar
              variant="drilldown"
              title="创建分群"
              titleId="product-shell-vertical-heading"
              breadcrumbItems={[
                { key: "cohort", label: "分群" },
                { key: "create", label: "创建分群" },
              ]}
              description={
                <span className="product-shell-template__title-meta">
                  创建方式：规则创建
                  <SensButton tone="link" size="small" onClick={() => message.info("切换创建方式（预览）")}>
                    切换
                  </SensButton>
                </span>
              }
              onBack={() => message.info("返回上一页（预览）")}
              actions={
                <div className="product-shell-template__form-actions">
                  <SensButton tone="secondary" onClick={() => message.info("已放弃（预览）")}>
                    放 弃
                  </SensButton>
                  <SensButton tone="primary" onClick={() => message.success("创建成功")}>
                    提 交
                  </SensButton>
                </div>
              }
            />
          </div>

          <div
            ref={scrollRef}
            className="product-shell-template__scroll"
            data-product-shell-content-scroll
            onScroll={handleContentScroll}
          >
            <div className="product-shell-template__form">
              <section className="product-shell-template__form-section" aria-label="基础信息">
                <SensSectionTitle title="基础信息" />
                <div className="product-shell-template__form-body">
                  <SensForm layout="vertical">
                    <SensFormItem label="所属实体">
                      <SensSelectDropdown
                        options={ENTITY_OPTIONS}
                        value={entity}
                        onChange={(value) => setEntity(String(value))}
                        style={{ maxWidth: CONTROL_MAX_WIDTH }}
                      />
                    </SensFormItem>
                    <SensFormItem label="分群显示名" counter={`${displayName.length}/80`}>
                      <SensInput
                        value={displayName}
                        maxLength={80}
                        placeholder="请输入分群显示名"
                        onChange={(event) => setDisplayName(event.target.value)}
                      />
                    </SensFormItem>
                    <SensFormItem label="分群名称" counter={`${13 + segmentName.length}/40`}>
                      <div className="product-shell-template__name-field">
                        <SensInput
                          addonBefore="user_segment_"
                          value={segmentName}
                          maxLength={27}
                          placeholder="以字母或数字开头，可包含小写字母、数字、下划线"
                          onChange={(event) => setSegmentName(event.target.value)}
                        />
                      </div>
                    </SensFormItem>
                    <SensFormItem label="分组">
                      <SensSelectDropdown
                        options={GROUP_OPTIONS}
                        value={group}
                        onChange={(value) => setGroup(String(value))}
                        style={{ maxWidth: CONTROL_MAX_WIDTH }}
                      />
                    </SensFormItem>
                    <SensFormItem label="备注" optional="(选填)" counter={`${remark.length}/1024`}>
                      <SensTextArea
                        value={remark}
                        maxLength={1024}
                        placeholder="请输入备注"
                        rows={3}
                        onChange={(event) => setRemark(event.target.value)}
                      />
                    </SensFormItem>
                  </SensForm>
                </div>
              </section>

              <section className="product-shell-template__form-section" aria-label="分群规则">
                <SensSectionTitle title="分群规则" />
                <div className="product-shell-template__form-body">
                  <SensForm layout="vertical">
                    <SensFormItem
                      label="实体范围"
                      description="按所选实体范围计算分群结果"
                    >
                      <SensSelectDropdown
                        options={ENTITY_SCOPE_OPTIONS}
                        value={entityScope}
                        onChange={(value) => setEntityScope(String(value))}
                        style={{ maxWidth: CONTROL_MAX_WIDTH }}
                      />
                    </SensFormItem>
                    <SensFormItem className="product-shell-template__form-item--full" label="自定义规则">
                      <div className="product-shell-template__rule-card">
                        <SensFormItem label="时区" labelHelp="规则计算使用的时区">
                          <SensSelectDropdown
                            options={TIMEZONE_OPTIONS}
                            value={timezone}
                            onChange={(value) => setTimezone(String(value))}
                            style={{ maxWidth: CONTROL_MAX_WIDTH }}
                          />
                        </SensFormItem>
                        <SensFormItem className="product-shell-template__form-item--full" label="规则">
                          <div className="product-shell-template__rule-panel">
                            <SensButton
                              tone="link"
                              icon={<SensIcon name="add" sizeToken="size/icon/m" color="currentColor" />}
                              onClick={() => message.info("添加规则（预览）")}
                            >
                              添加规则
                            </SensButton>
                          </div>
                        </SensFormItem>
                      </div>
                    </SensFormItem>
                    <SensFormItem label="预估" labelHelp="预估当前规则覆盖人数">
                      <SensButton tone="secondary" onClick={() => message.info("已触发预估（预览）")}>
                        预 估
                      </SensButton>
                    </SensFormItem>
                    <SensFormItem label="筛选结果数量限制" optional="(选填)">
                      <SensCheckbox
                        checked={limitEnabled}
                        onChange={(event) => setLimitEnabled(event.target.checked)}
                      >
                        开启限制
                      </SensCheckbox>
                    </SensFormItem>
                  </SensForm>
                </div>
              </section>

              <section className="product-shell-template__form-section" aria-label="更新方式">
                <SensSectionTitle title="更新方式" />
                <div className="product-shell-template__form-body">
                  <SensAlert type="default">
                    例行更新会按计划自动重算；手动更新需在列表页触发
                  </SensAlert>
                  <SensRadioGroup
                    itemHeight="content"
                    options={UPDATE_MODE_OPTIONS}
                    value={updateMode}
                    onChange={setUpdateMode}
                  />
                </div>
              </section>

              <section className="product-shell-template__form-section" aria-label="计算结果存储设置">
                <SensSectionTitle title="计算结果存储设置" />
                <div className="product-shell-template__form-body">
                  <SensAlert type="default">
                    保留最近若干次历史计算结果，便于回溯对比；超出数量的历史版本将被清理
                  </SensAlert>
                  <div className="product-shell-template__retain-row">
                    <span>保留最近</span>
                    <SensInputNumber
                      value={retainCount ?? undefined}
                      min={1}
                      max={100}
                      onChange={(value) => setRetainCount(typeof value === "number" ? value : null)}
                      style={{ width: 120 }}
                    />
                    <span>个计算结果</span>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <ProductShellBackTop
            visible={showBackTop}
            docked={backTopDocked}
            anchorRef={contentRef}
            onBackToTop={handleBackToTop}
            onPointerEnter={handleBackTopPointerEnter}
            onPointerLeave={handleBackTopPointerLeave}
          />
        </section>
      </div>
    </main>
  );
}

export default function ProductShellVerticalTemplatePage() {
  return (
    <SensMessageProvider>
      <ProductShellVerticalTemplateInner />
    </SensMessageProvider>
  );
}
