import { useMemo, useState, type CSSProperties } from "react";
import { buildShadow, buildShadowD4, getColorToken, tokenRgba } from "../../design-system/color-utils";
import { getDividerHairlineWidth } from "../../design-system/divider";
import { SensIcon, type IconName } from "../../design-system/icons";
import { navigationCssVar } from "../../design-system/navigation-color";
import {
  findDomainByPrimaryLabel,
  findDomainByUtilityIcon,
  getDomainNavFirstLeaf,
  type ProductShellDomainNav,
} from "../../design-system/product-shell-domain-nav";
import {
  PRODUCT_SHELL_TEMPLATE_DOMAINS,
  SMART_OPS_DOMAIN_NAV,
  getProductShellNavDropdownByLabel,
  getProductShellPrimaryNavItems,
} from "../../design-system/product-shell-nav-catalog";
import { getTypographyToken } from "../../design-system/typography";
import { getUnitToken } from "../../design-system/unit";
import {
  ProductShellSideNavigation,
  SearchInput,
  SensBadge,
  SensButton,
  SensMoreButton,
  SensPageTitleBar,
  SensPagination,
  SensTag,
  SensTips,
  SensTopNavigation,
  type NavDropdownConfig,
  type ProductShellSideNavigationMode,
  type SensTopNavigationItem,
  type SensTopNavigationUtilityItem,
} from "../../ui";
import {
  PRODUCT_SHELL_SIDE_NAV_EXPANDED_WIDTH,
  PRODUCT_SHELL_SIDE_NAV_ICON_COLLAPSED_WIDTH,
} from "../../ui/ProductShellSideNavigation";
import { ProductShellBackTop } from "./ProductShellBackTop";
import { useProductShellContentScroll } from "./useProductShellContentScroll";
import "./product-shell-template.css";

/** 顶导结构高度；收起时 translateY 与正文起点同步扣减。 */
const TOP_NAV_STRUCTURAL_HEIGHT = 82;

/** 与 SensTopNavigation 默认同源；样板间额外带「更多」供窄屏收纳 */
const PRODUCT_NAV_ITEMS: SensTopNavigationItem[] = [
  ...getProductShellPrimaryNavItems(),
  { label: "更多", arrow: true },
];

const PRODUCT_SHELL_NAV_DROPDOWN_BY_LABEL: Record<string, NavDropdownConfig> =
  getProductShellNavDropdownByLabel() as Record<string, NavDropdownConfig>;

const DEFAULT_DOMAIN = SMART_OPS_DOMAIN_NAV;
const DEFAULT_ACTIVE_LEAF = getDomainNavFirstLeaf(DEFAULT_DOMAIN) ?? "列表资源位";

/** Figma `3709:3196` 列表资源位卡片示意数据。 */
interface PlacementCardData {
  key: string;
  title: string;
  pendingStrategies: number;
  pendingItems: number;
  sceneType: string;
  relatedStrategyCount: number;
  onlineHint: string;
  itemRuleType: string;
  pinnedCount: number;
  lastOperatedAt: string;
  exposure: string;
  clicks: string;
  ctr: string;
}

const DEMO_CARDS: PlacementCardData[] = Array.from({ length: 8 }, (_, index) => ({
  key: `placement-${index + 1}`,
  title: "商城首页瀑布流推荐位",
  pendingStrategies: 3,
  pendingItems: 3,
  sceneType: "规则推荐",
  relatedStrategyCount: 6,
  onlineHint: "6 条已上线",
  itemRuleType: "资讯",
  pinnedCount: 3,
  lastOperatedAt: "2020-06-01 00:00:00",
  exposure: "-",
  clicks: "-",
  ctr: "45.02%",
}));

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
    "--shell-page-padding": `${getUnitToken("spacing/vertical/7x")}px`,
    /* Layout T 型：内容模块左右 padding = spacing/horizontal/6x = 24 */
    "--shell-content-padding": `${getUnitToken("spacing/horizontal/6x")}px`,
    "--shell-section-gap": `${getUnitToken("spacing/vertical/4x")}px`,
    "--shell-card-gap": `${getUnitToken("spacing/vertical/4x")}px`,
    "--shell-card-inner-gap": `${getUnitToken("spacing/4x")}px`,
    "--shell-card-padding": `${getUnitToken("spacing/4x")}px`,
    "--shell-field-gap": `${getUnitToken("spacing/2x")}px`,
    /* 图标与文字：icons.md / spacing 默认 spacing/horizontal/1x = 4 */
    "--shell-icon-text-gap": `${getUnitToken("spacing/horizontal/1x")}px`,
    "--shell-tag-gap": `${getUnitToken("spacing/2x")}px`,
    "--shell-action-gap": `${getUnitToken("spacing/3x")}px`,
    "--shell-metrics-width": "329px",
    "--shell-card-title-size": `${getTypographyToken("font-size/l")}px`,
    "--shell-card-title-line": `${getTypographyToken("line-height/l")}px`,
    "--shell-card-title-weight": getTypographyToken("font-weight/semibold"),
    "--shell-card-body-size": `${getTypographyToken("font-size/m")}px`,
    "--shell-card-body-line": `${getTypographyToken("line-height/m")}px`,
    "--shell-card-body-weight": getTypographyToken("font-weight/regular"),
    "--shell-nav-structural-height": `${TOP_NAV_STRUCTURAL_HEIGHT}px`,
    "--shell-back-top-inset": `${getUnitToken("spacing/6x")}px`,
    "--shell-back-top-size": `${getUnitToken("size/component-height/l")}px`,
    "--shell-title-bar-shadow": buildShadowD4(),
  } as CSSProperties;
}

function PendingTag({ count, subject }: { count: number; subject: string }) {
  return (
    <SensTag variant="multicolor" color="yellow" size="small">
      {count} 条{subject}待处理{" "}
      <span className="product-shell-placement-card__tag-link">详情</span>
    </SensTag>
  );
}

function FieldSep() {
  return <span className="product-shell-placement-card__sep" aria-hidden />;
}

function PlacementCard({ card }: { card: PlacementCardData }) {
  return (
    <article className="product-shell-placement-card" data-product-shell-placement-card>
      <div className="product-shell-placement-card__header">
        <div className="product-shell-placement-card__title-group">
          <h2 className="product-shell-placement-card__title">{card.title}</h2>
          <div className="product-shell-placement-card__tags">
            <PendingTag count={card.pendingStrategies} subject="策略" />
            <PendingTag count={card.pendingItems} subject="物品" />
          </div>
        </div>
        <div className="product-shell-placement-card__actions">
          <SensMoreButton size="small" tone="secondary">
            更多
          </SensMoreButton>
          <SensButton size="small" tone="secondary">
            物品规则
          </SensButton>
          <SensButton size="small" tone="secondary">
            统计分析
          </SensButton>
          <SensButton size="small" tone="secondary">
            删 除
          </SensButton>
        </div>
      </div>

      <div className="product-shell-placement-card__body">
        <div className="product-shell-placement-card__fields">
          <div className="product-shell-placement-card__field">
            <p className="product-shell-placement-card__label">场景类型</p>
            <p className="product-shell-placement-card__value">{card.sceneType}</p>
          </div>
          <div className="product-shell-placement-card__field">
            <div className="product-shell-placement-card__label-row">
              <p className="product-shell-placement-card__label">关联策略</p>
              <SensBadge variant="status" status="processing" text={card.onlineHint} />
            </div>
            <p className="product-shell-placement-card__value product-shell-placement-card__value--emphasis">
              {card.relatedStrategyCount} 条
            </p>
          </div>
          <div className="product-shell-placement-card__field">
            <p className="product-shell-placement-card__label">物品规则</p>
            <div className="product-shell-placement-card__value-row">
              <p className="product-shell-placement-card__value">{card.itemRuleType}</p>
              <FieldSep />
              <p className="product-shell-placement-card__value">{card.pinnedCount} 个置顶</p>
            </div>
          </div>
          <div className="product-shell-placement-card__field">
            <p className="product-shell-placement-card__label">最近操作时间</p>
            <p className="product-shell-placement-card__value">{card.lastOperatedAt}</p>
          </div>
        </div>

        <div className="product-shell-placement-card__metrics">
          <div className="product-shell-placement-card__label-row">
            <p className="product-shell-placement-card__label">近 7 日数据变化</p>
            <SensTips title="近 7 日曝光、点击与点击率变化" placement="top">
              <span className="product-shell-placement-card__help" aria-label="帮助说明">
                <SensIcon name="help" sizeToken="size/icon/m" color="currentColor" />
              </span>
            </SensTips>
          </div>
          <div className="product-shell-placement-card__metric-row">
            <p className="product-shell-placement-card__metric">曝光量：{card.exposure}</p>
            <FieldSep />
            <p className="product-shell-placement-card__metric">点击量：{card.clicks}</p>
            <FieldSep />
            <p className="product-shell-placement-card__metric">点击率：{card.ctr}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ProductShellTemplatePage() {
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
  const [activeDomain, setActiveDomain] = useState<ProductShellDomainNav>(DEFAULT_DOMAIN);
  const [activeSideItem, setActiveSideItem] = useState(DEFAULT_ACTIVE_LEAF);
  /** 各一级功能域上次选中的落地页；点击一级触发器不得刷回第一项 */
  const [domainLeafByLabel, setDomainLeafByLabel] = useState<Record<string, string>>(() => {
    const label =
      DEFAULT_DOMAIN.entry.kind === "primary" ? DEFAULT_DOMAIN.entry.label : DEFAULT_DOMAIN.domainLabel;
    return { [label]: DEFAULT_ACTIVE_LEAF };
  });
  const [activeUtilityIcon, setActiveUtilityIcon] = useState<IconName | null>(null);
  const [sideNavigationMode, setSideNavigationMode] = useState<ProductShellSideNavigationMode>("docked");
  const [page, setPage] = useState(4);
  const [keyword, setKeyword] = useState("");

  const activeNavLabel = activeUtilityIcon ? "" : activeDomain.entry.kind === "primary" ? activeDomain.entry.label : "";

  const activeNavMenuByLabel = useMemo(() => {
    if (activeUtilityIcon) return {};
    return domainLeafByLabel;
  }, [activeUtilityIcon, domainLeafByLabel]);

  function rememberLeaf(domain: ProductShellDomainNav, leaf: string) {
    const key = domain.entry.kind === "primary" ? domain.entry.label : domain.domainLabel;
    setDomainLeafByLabel((prev) => (prev[key] === leaf ? prev : { ...prev, [key]: leaf }));
  }

  function resolveLeaf(domain: ProductShellDomainNav, leaf?: string) {
    const key = domain.entry.kind === "primary" ? domain.entry.label : domain.domainLabel;
    return leaf ?? domainLeafByLabel[key] ?? getDomainNavFirstLeaf(domain) ?? domain.domainLabel;
  }

  function applyDomain(domain: ProductShellDomainNav, leaf?: string) {
    const nextLeaf = resolveLeaf(domain, leaf);
    setActiveDomain(domain);
    setActiveSideItem(nextLeaf);
    rememberLeaf(domain, nextLeaf);
  }

  function handleSideActiveItemChange(item: string) {
    setActiveSideItem(item);
    rememberLeaf(activeDomain, item);
  }

  function handleActiveNavLabelChange(navLabel: string) {
    const domain = findDomainByPrimaryLabel(PRODUCT_SHELL_TEMPLATE_DOMAINS, navLabel);
    if (!domain) return;
    setActiveUtilityIcon(null);
    const samePrimary =
      !activeUtilityIcon &&
      activeDomain.entry.kind === "primary" &&
      activeDomain.entry.label === navLabel;
    if (samePrimary) return;
    applyDomain(domain);
  }

  function handleTopNavMenuSelect(navLabel: string, menuLabel: string) {
    const domain = findDomainByPrimaryLabel(PRODUCT_SHELL_TEMPLATE_DOMAINS, navLabel);
    if (!domain) return;
    setActiveUtilityIcon(null);
    applyDomain(domain, menuLabel);
  }

  function handleUtilityNavigate(item: SensTopNavigationUtilityItem) {
    const domain = findDomainByUtilityIcon(PRODUCT_SHELL_TEMPLATE_DOMAINS, item.icon);
    if (!domain) return;
    setActiveUtilityIcon(item.icon);
    applyDomain(domain);
  }

  const templateStyle = {
    ...buildTemplateStyle(),
    "--shell-side-width": `${
      sideNavigationMode === "docked" ? PRODUCT_SHELL_SIDE_NAV_EXPANDED_WIDTH : PRODUCT_SHELL_SIDE_NAV_ICON_COLLAPSED_WIDTH
    }px`,
    "--shell-content-shadow": sideNavigationMode === "overlay" ? "none" : buildShadow("D2", "left"),
  } as CSSProperties;

  return (
    <main
      className={["product-shell-template", topNavCollapsed ? "product-shell-template--collapsed" : ""]
        .filter(Boolean)
        .join(" ")}
      style={templateStyle}
      data-product-shell-template
      data-top-nav-collapsed={topNavCollapsed ? "true" : "false"}
      data-active-domain={activeDomain.domainLabel}
    >
      <div
        className="product-shell-template__navigation-layer"
        aria-hidden={topNavCollapsed || undefined}
        data-product-shell-top-nav
      >
        <SensTopNavigation
          embedded
          atmosphere
          activeNavLabel={activeNavLabel}
          items={PRODUCT_NAV_ITEMS}
          navDropdownByLabel={PRODUCT_SHELL_NAV_DROPDOWN_BY_LABEL}
          activeNavMenuByLabel={activeNavMenuByLabel}
          onNavMenuSelect={handleTopNavMenuSelect}
          onActiveNavLabelChange={handleActiveNavLabelChange}
          activeUtilityIcon={activeUtilityIcon}
          onUtilityNavigate={handleUtilityNavigate}
        />
      </div>

      <div className="product-shell-template__workspace">
        <ProductShellSideNavigation
          mode={sideNavigationMode}
          onModeChange={setSideNavigationMode}
          productName={activeDomain.domainLabel}
          groups={activeDomain.layout === "groups" ? activeDomain.groups : undefined}
          items={activeDomain.layout === "flat" ? activeDomain.items : undefined}
          groupsCollapsible={false}
          activeItem={activeSideItem}
          onActiveItemChange={handleSideActiveItemChange}
        />

        <section ref={contentRef} className="product-shell-template__content" aria-label={activeSideItem}>
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
              variant="landing"
              title={activeSideItem}
              titleId="product-shell-template-heading"
              actions={
                <SensButton tone="primary" onClick={() => undefined}>
                  新建资源位
                </SensButton>
              }
            />
          </div>

          <div
            ref={scrollRef}
            className="product-shell-template__scroll"
            data-product-shell-content-scroll
            onScroll={handleContentScroll}
          >
            <div className="product-shell-template__toolbar">
              <SearchInput
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="搜索资源位"
              />
            </div>

            <div className="product-shell-template__card-list" role="list">
              {DEMO_CARDS.map((card) => (
                <div key={card.key} role="listitem">
                  <PlacementCard card={card} />
                </div>
              ))}
            </div>

            <div className="product-shell-template__pagination">
              <SensPagination
                current={page}
                pageSize={20}
                total={240}
                showSizeChanger={false}
                showQuickJumper
                onChange={(next) => setPage(next)}
              />
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
