import { useState, type CSSProperties } from "react";
import { buildShadow, getColorToken, tokenRgba } from "../../design-system/color-utils";
import { getDividerColor, getDividerHairlineWidth } from "../../design-system/divider";
import { SensIcon, type ColorfulIconName } from "../../design-system/icons";
import { navigationCssVar } from "../../design-system/navigation-color";
import { getTypographyToken } from "../../design-system/typography";
import { getUnitToken } from "../../design-system/unit";
import {
  SensButton,
  SensEntryCard,
  ProductShellSideNavigation,
  SensMessageProvider,
  SensPageTitleBar,
  SensSectionTitle,
  useSensMessage,
  type ProductShellSideNavigationMode,
} from "../../ui";
import {
  SensTopNavigation,
  type SensTopNavigationItem,
} from "../../ui";
import {
  PRODUCT_SHELL_SIDE_NAV_EXPANDED_WIDTH,
  PRODUCT_SHELL_SIDE_NAV_ICON_COLLAPSED_WIDTH,
  type ProductShellSideNavigationItem,
} from "../../ui/ProductShellSideNavigation";
import "./card-entry-templates.css";

interface EntrySceneItem {
  key: string;
  icon: ColorfulIconName;
  title: string;
  description: string;
}

interface EntrySceneGroup {
  title: string;
  items: EntrySceneItem[];
}

/** 复制到剪贴板的版本信息文案（与 package.json version 对齐）。 */
const VERSION_COPY_TEXT = "sens-preview@0.1.0";

const PRODUCT_NAV_ITEMS: SensTopNavigationItem[] = [
  { label: "概览" },
  { label: "报表" },
  { label: "分析", arrow: true },
  { label: "AB 测试", arrow: true },
  { label: "用户管理", arrow: true },
  { label: "智能运营", arrow: true },
  { label: "内容管理", arrow: true },
  { label: "渠道追踪" },
  { label: "场景库" },
  { label: "数据治理", arrow: true },
  { label: "项目设置", arrow: true },
];

const SIDE_NAV_ITEMS: ProductShellSideNavigationItem[] = [
  { key: "basic", label: "基本设置", icon: "sbp-setting" },
  { key: "member", label: "成员管理", icon: "sbp-member" },
  { key: "role", label: "角色管理", icon: "sbp-role" },
];

const ENTRY_SCENE_GROUPS: EntrySceneGroup[] = [
  {
    title: "通用设置",
    items: [
      {
        key: "view-api",
        icon: "view-api",
        title: "查看 API Secret",
        description: "修改 admin 密码会导致 API Secret 发生变化",
      },
      {
        key: "reset-project",
        icon: "reproduction-project",
        title: "重置项目",
        description: "清空项目中所有数据，该操作不可逆，请谨慎操作",
      },
      {
        key: "mail-settings",
        icon: "sent-box-setting",
        title: "发件箱设置",
        description: "设置的发件箱将用于系统内发送邮件时使用",
      },
      {
        key: "online-upgrade",
        icon: "upgrade-online",
        title: "在线升级",
        description: "可进行不中断系统使用的版本升级",
      },
    ],
  },
  {
    title: "分析",
    items: [
      {
        key: "resource-report",
        icon: "download-resource-report",
        title: "下载资源报告",
        description: "近期神策环境的使用情况",
      },
      {
        key: "touch-channel",
        icon: "webhook-setting",
        title: "企业内部触达通道配置",
        description:
          "用于配置企业内部触达通道与回调地址，辅助说明过长时应单行省略，悬停后通过 SensTips 展示完整文案以便核对",
      },
      {
        key: "analysis-model",
        icon: "analysis-model-setting",
        title: "分析模型配置",
        description: "对应的文案信息对应的文案信息",
      },
      {
        key: "push-management",
        icon: "push-management",
        title: "推送管理",
        description: "对应的文案信息对应的文案信息",
      },
    ],
  },
  {
    title: "用户管理",
    items: [
      {
        key: "user-group-portrait",
        icon: "user-group-portrait-template",
        title: "用户群画像模板",
        description: "对应的文案信息对应的文案信息",
      },
      {
        key: "similarity-label",
        icon: "similarity-label-feature-template",
        title: "相似度标签特征模板",
        description: "对应的文案信息对应的文案信息",
      },
      {
        key: "single-user-panoramic",
        icon: "single-user-panoramic-view-template",
        title: "单用户全景视图模板",
        description: "对应的文案信息对应的文案信息",
      },
    ],
  },
];

const PROJECT_STATS = [
  ["已用事件量", "1.68亿/不限"],
  ["元事件量", "10,000.00"],
  ["事件属性数量", "10,000.00"],
  ["用户属性数量", "10,000.00"],
  ["成员数量", "10,000.00"],
  ["到期时间", "2021–02–24"],
];

function buildTemplateStyle(): CSSProperties {
  return {
    "--entry-template-page-background": navigationCssVar("--sens-nav-page-bg", "body-background"),
    "--entry-template-surface": getColorToken("white"),
    "--entry-template-text": tokenRgba("text-color-transparent", 0.9),
    "--entry-template-sub-text": tokenRgba("text-sub-color-transparent", 0.58),
    "--entry-template-muted-surface": tokenRgba("background-transparent-grey", 0.04),
    "--entry-template-title-bar-height": `${getUnitToken("size/component-height/title-bar")}px`,
    "--entry-template-title-bar-padding-inline": `${getUnitToken("spacing/horizontal/6x")}px`,
    "--entry-template-content-radius": `${getUnitToken("radius/xl")}px`,
    "--entry-template-divider": getDividerColor("light", "transparent"),
    "--entry-template-divider-width": `${getDividerHairlineWidth()}px`,
    "--entry-template-radius": `${getUnitToken("radius/l")}px`,
    "--entry-template-small-radius": `${getUnitToken("radius/m")}px`,
    "--entry-template-page-padding": `${getUnitToken("spacing/vertical/7x")}px`,
    "--entry-template-content-padding": `${getUnitToken("spacing/10x")}px`,
    "--entry-template-section-gap": `${getUnitToken("spacing/vertical/4x")}px`,
    "--entry-template-group-gap": `${getUnitToken("spacing/vertical/7x")}px`,
    "--entry-template-card-gap": `${getUnitToken("spacing/horizontal/4x")}px`,
    "--entry-template-title-size": `${getTypographyToken("font-size/xxl")}px`,
    "--entry-template-title-line": `${getTypographyToken("line-height/xxl")}px`,
    "--entry-template-title-weight": getTypographyToken("font-weight/semibold"),
    "--entry-template-heading-size": `${getTypographyToken("font-size/m")}px`,
    "--entry-template-heading-line": `${getTypographyToken("line-height/m")}px`,
    "--entry-template-stats-label-size": `${getTypographyToken("font-size/m")}px`,
    "--entry-template-stats-label-line": `${getTypographyToken("line-height/m")}px`,
    "--entry-template-stats-label-weight": getTypographyToken("font-weight/medium"),
    "--entry-template-stats-value-size": `${getTypographyToken("font-size/m")}px`,
    "--entry-template-stats-value-line": `${getTypographyToken("line-height/m")}px`,
    "--entry-template-stats-value-weight": getTypographyToken("font-weight/regular"),
  } as CSSProperties;
}

async function writeClipboardText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(textarea);
  if (!ok) {
    throw new Error("clipboard unavailable");
  }
}

function SceneEntryCard({ item, onActivate }: { item: EntrySceneItem; onActivate: () => void }) {
  return (
    <SensEntryCard
      icon={<SensIcon name={item.icon} variant="colorful" size={getUnitToken("size/xxl")} />}
      title={item.title}
      description={item.description}
      size="small"
      onClick={onActivate}
      onDoubleClick={onActivate}
      aria-label={`${item.title}：${item.description}`}
    />
  );
}

function CardEntryTemplatesContent() {
  const message = useSensMessage();
  const [activeSideItem, setActiveSideItem] = useState("基本设置");
  const [sideNavigationMode, setSideNavigationMode] = useState<ProductShellSideNavigationMode>("docked");
  const [copying, setCopying] = useState(false);
  const templateStyle = {
    ...buildTemplateStyle(),
    "--entry-template-side-width": `${sideNavigationMode === "docked" ? PRODUCT_SHELL_SIDE_NAV_EXPANDED_WIDTH : PRODUCT_SHELL_SIDE_NAV_ICON_COLLAPSED_WIDTH}px`,
    "--entry-template-content-shadow": sideNavigationMode === "overlay" ? "none" : buildShadow("D2", "left"),
  } as CSSProperties;

  async function handleCopyVersion() {
    if (copying) return;
    setCopying(true);
    try {
      await writeClipboardText(VERSION_COPY_TEXT);
      message.success("版本信息已复制");
    } catch {
      message.warning("无法复制版本信息，请手动复制");
    } finally {
      setCopying(false);
    }
  }

  function handleEntryActivate(item: EntrySceneItem) {
    message.info(`进入「${item.title}」`);
  }

  return (
    <main className="card-entry-template" style={templateStyle}>
      <div className="card-entry-template__navigation-layer">
        <SensTopNavigation embedded atmosphere activeNavLabel="项目设置" items={PRODUCT_NAV_ITEMS} />
      </div>
      <div className="card-entry-template__workspace">
        <ProductShellSideNavigation
          mode={sideNavigationMode}
          onModeChange={setSideNavigationMode}
          productName="项目设置"
          items={SIDE_NAV_ITEMS}
          activeItem={activeSideItem}
          onActiveItemChange={setActiveSideItem}
        />

        <section className="card-entry-template__content" aria-label="基本设置">
          {/* Figma「页面标题栏」：落地页白底，不是灰底 SensSectionTitle。 */}
          <SensPageTitleBar
            variant="landing"
            title="基本设置"
            titleId="entry-template-heading"
            actions={
              <SensButton tone="secondary" loading={copying} onClick={() => void handleCopyVersion()}>
                复制版本信息
              </SensButton>
            }
          />

          <div className="card-entry-template__body">
            <section className="card-entry-template__project-summary" aria-label="项目信息">
              {/* Figma「标题」灰底分组标题：仅分组用 SensSectionTitle。 */}
              <SensSectionTitle
                title="测试项目"
                size="large"
                description={
                  <span className="card-entry-template__project-title-icon" aria-label="可重命名项目">
                    <SensIcon name="rename" sizeToken="size/icon/m" color="currentColor" />
                  </span>
                }
              />
              <div className="card-entry-template__stats">
                {PROJECT_STATS.map(([label, value]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </section>

            <div className="card-entry-template__groups">
              {ENTRY_SCENE_GROUPS.map((group) => (
                <section key={group.title} className="card-entry-template__group" aria-labelledby={`entry-group-${group.title}`}>
                  <SensSectionTitle id={`entry-group-${group.title}`} title={group.title} size="large" />
                  <div className="card-entry-template__grid">
                    {group.items.map((item) => (
                      <SceneEntryCard key={item.key} item={item} onActivate={() => handleEntryActivate(item)} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function CardEntryTemplatesPage() {
  return (
    <SensMessageProvider>
      <CardEntryTemplatesContent />
    </SensMessageProvider>
  );
}
