import { Suspense, lazy, useState, type ComponentType } from "react";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import enUS from "antd/locale/en_US";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SensAppearanceProvider } from "./design-system/appearance";
import { buildAntdThemeForSkin } from "./design-system/appearance-antd";
import type { FunctionalSkin } from "./design-system/functional-skin";
import type { NavigationTheme } from "./design-system/navigation-color";
import { PreviewShell } from "./preview/PreviewShell";
import "./ui/button.css";
import "./ui/cursors.css";
import "./ui/fab-group.css";

function lazyNamed<TModule extends Record<string, unknown>, TKey extends keyof TModule>(
  loader: () => Promise<TModule>,
  name: TKey,
) {
  return lazy(async () => {
    const mod = await loader();
    return { default: mod[name] as ComponentType };
  });
}

const SystemOverviewPage = lazyNamed(() => import("./preview/pages/ProductIndexPages"), "SystemOverviewPage");
const CompositeLibraryPage = lazyNamed(() => import("./preview/pages/ProductIndexPages"), "CompositeLibraryPage");
const TemplateLibraryPage = lazyNamed(() => import("./preview/pages/ProductIndexPages"), "TemplateLibraryPage");
const CaseLibraryPage = lazyNamed(() => import("./preview/pages/ProductIndexPages"), "CaseLibraryPage");
const GuidesHubPage = lazyNamed(() => import("./preview/pages/ProductIndexPages"), "GuidesHubPage");

const DesignSystemGuidePage = lazyNamed(() => import("./preview/pages/GuideDetailPages"), "DesignSystemGuidePage");
const AgentRulesGuidePage = lazyNamed(() => import("./preview/pages/GuideDetailPages"), "AgentRulesGuidePage");
const AiDesignMethodologyGuidePage = lazyNamed(
  () => import("./preview/pages/GuideDetailPages"),
  "AiDesignMethodologyGuidePage",
);

const FoundationStatusBasicStylePage = lazy(
  () => import("./preview/pages/basic-styles/FoundationStatusBasicStylePage"),
);
const ColorBasicStylePage = lazy(() => import("./preview/pages/basic-styles/ColorBasicStylePage"));
const ThemeSkinningBasicStylePage = lazy(() => import("./preview/pages/basic-styles/ThemeSkinningBasicStylePage"));
const NavigationColorBasicStylePage = lazy(
  () => import("./preview/pages/basic-styles/NavigationColorBasicStylePage"),
);
const TypographyBasicStylePage = lazy(() => import("./preview/pages/basic-styles/TypographyBasicStylePage"));
const SpacingBasicStylePage = lazy(() => import("./preview/pages/basic-styles/SpacingBasicStylePage"));
const LayoutBasicStylePage = lazy(() => import("./preview/pages/basic-styles/LayoutBasicStylePage"));
const GridBasicStylePage = lazy(() => import("./preview/pages/basic-styles/GridBasicStylePage"));
const SizeBasicStylePage = lazy(() => import("./preview/pages/basic-styles/SizeBasicStylePage"));
const IconBasicStylePage = lazy(() => import("./preview/pages/basic-styles/IconBasicStylePage"));
const EmptyStateBasicStylePage = lazy(
  () => import("./preview/pages/basic-styles/EmptyStateBasicStylePage"),
);
const CursorBasicStylePage = lazy(() => import("./preview/pages/basic-styles/CursorBasicStylePage"));
const RadiusBasicStylePage = lazy(() => import("./preview/pages/basic-styles/RadiusBasicStylePage"));
const ShadowBasicStylePage = lazy(() => import("./preview/pages/basic-styles/ShadowBasicStylePage"));
const DividerBasicStylePage = lazy(() => import("./preview/pages/basic-styles/DividerBasicStylePage"));
const CardBasicStylePage = lazy(() => import("./preview/pages/basic-styles/CardBasicStylePage"));

const CardShowcasePage = lazy(() => import("./preview/pages/CardShowcasePage"));
const ButtonShowcasePage = lazy(() => import("./preview/pages/ButtonShowcasePage"));
const InputShowcasePage = lazy(() => import("./preview/pages/InputShowcasePage"));
const TextAreaShowcasePage = lazy(() => import("./preview/pages/TextAreaShowcasePage"));
const InputNumberShowcasePage = lazy(() => import("./preview/pages/InputNumberShowcasePage"));
const SelectDropdownShowcasePage = lazy(() => import("./preview/pages/SelectDropdownShowcasePage"));
const SelectShowcasePage = lazy(() => import("./preview/pages/SelectShowcasePage"));
const SearchShowcasePage = lazy(() => import("./preview/pages/SearchShowcasePage"));
const CheckboxShowcasePage = lazy(() => import("./preview/pages/CheckboxShowcasePage"));
const RadioShowcasePage = lazy(() => import("./preview/pages/RadioShowcasePage"));
const FormShowcasePage = lazy(() => import("./preview/pages/FormShowcasePage"));
const TitleShowcasePage = lazy(() => import("./preview/pages/TitleShowcasePage"));
const TabsShowcasePage = lazy(() => import("./preview/pages/TabsShowcasePage"));
const BadgeShowcasePage = lazy(() => import("./preview/pages/BadgeShowcasePage"));
const TagShowcasePage = lazy(() => import("./preview/pages/TagShowcasePage"));
const MessageShowcasePage = lazy(() => import("./preview/pages/MessageShowcasePage"));
const AlertShowcasePage = lazy(() => import("./preview/pages/AlertShowcasePage"));
const TipsShowcasePage = lazy(() => import("./preview/pages/TipsShowcasePage"));
const PopoverShowcasePage = lazy(() => import("./preview/pages/PopoverShowcasePage"));
const TitleBarShowcasePage = lazy(() => import("./preview/pages/TitleBarShowcasePage"));
const BreadcrumbShowcasePage = lazy(() => import("./preview/pages/BreadcrumbShowcasePage"));
const TopNavigationShowcasePage = lazy(() => import("./preview/pages/TopNavigationShowcasePage"));
const SideNavigationShowcasePage = lazy(() => import("./preview/pages/SideNavigationShowcasePage"));
const DrawerShowcasePage = lazy(() => import("./preview/pages/DrawerShowcasePage"));
const TableShowcasePage = lazy(() => import("./preview/pages/TableShowcasePage"));
const PaginationShowcasePage = lazy(() => import("./preview/pages/PaginationShowcasePage"));
const AnchorShowcasePage = lazy(() => import("./preview/pages/AnchorShowcasePage"));
const StepsShowcasePage = lazy(() => import("./preview/pages/StepsShowcasePage"));

const FormTemplatesPage = lazy(() => import("./preview/pages/FormTemplatesPage"));
const CompositeTablePage = lazy(() => import("./preview/pages/CompositeTablePage"));
const ProductShellCompositePage = lazy(() => import("./preview/pages/ProductShellCompositePage"));
const SdhEditableTableTemplatePage = lazy(() => import("./preview/pages/SdhEditableTableTemplatePage"));
const CardEntryTemplatesPage = lazy(() => import("./preview/pages/CardEntryTemplatesPage"));
const ProductShellTemplatePage = lazy(() => import("./preview/pages/ProductShellTemplatePage"));
const ProductShellVerticalTemplatePage = lazy(
  () => import("./preview/pages/ProductShellVerticalTemplatePage"),
);
const ChangelogPage = lazy(() => import("./preview/pages/ChangelogPage"));
const AiDesignStagePresentationPage = lazy(() => import("./preview/pages/AiDesignStagePresentationPage"));
const SdhFeatureSegmentCreatePage = lazy(
  () => import("./preview/pages/cases/SdhFeatureSegmentCreatePage"),
);

const DataSourceConnectionDemoPage = lazy(
  () => import("./features/tiktok-ads-connections/DataSourceConnectionDemoPage"),
);
const TikTokAdsConnectionsPage = lazy(
  () => import("./features/tiktok-ads-connections/TikTokAdsConnectionsPage"),
);
const EvalDashboardPage = lazy(() => import("./features/agent-eval/EvalDashboardPage"));

function RouteFallback() {
  return <div style={{ padding: 24 }}>加载中…</div>;
}

function LazyOutlet() {
  const context = useOutletContext();
  return (
    <Suspense fallback={<RouteFallback />}>
      <Outlet context={context} />
    </Suspense>
  );
}

export default function App() {
  const [functionalSkin, setFunctionalSkin] = useState<FunctionalSkin>("green");
  const [navigationTheme, setNavigationTheme] = useState<NavigationTheme>("green");
  const { i18n } = useTranslation();
  const locale = i18n.language === "en" ? enUS : zhCN;

  return (
    <SensAppearanceProvider
      functionalSkin={functionalSkin}
      navigationTheme={navigationTheme}
      onFunctionalSkinChange={setFunctionalSkin}
      onNavigationThemeChange={setNavigationTheme}
    >
      <ConfigProvider
        theme={buildAntdThemeForSkin(functionalSkin)}
        locale={locale}
        button={{ autoInsertSpace: false }}
        wave={{ disabled: true }}
      >
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route element={<PreviewShell />}>
              <Route element={<LazyOutlet />}>
                <Route index element={<Navigate to="/overview" replace />} />
                <Route path="overview" element={<SystemOverviewPage />} />
                <Route path="basic-styles/foundation-status" element={<FoundationStatusBasicStylePage />} />
                <Route path="basic-styles/color" element={<ColorBasicStylePage />} />
                <Route path="basic-styles/theme-skinning" element={<ThemeSkinningBasicStylePage />} />
                <Route path="basic-styles/navigation-color" element={<NavigationColorBasicStylePage />} />
                <Route path="basic-styles/typography" element={<TypographyBasicStylePage />} />
                <Route path="basic-styles/spacing" element={<SpacingBasicStylePage />} />
                <Route path="basic-styles/layout" element={<LayoutBasicStylePage />} />
                <Route path="basic-styles/grid" element={<GridBasicStylePage />} />
                <Route path="basic-styles/size" element={<SizeBasicStylePage />} />
                <Route path="basic-styles/icon" element={<IconBasicStylePage />} />
                <Route path="basic-styles/empty-state" element={<EmptyStateBasicStylePage />} />
                <Route path="basic-styles/cursor" element={<CursorBasicStylePage />} />
                <Route path="basic-styles/radius" element={<RadiusBasicStylePage />} />
                <Route path="basic-styles/shadow" element={<ShadowBasicStylePage />} />
                <Route path="basic-styles/card" element={<CardBasicStylePage />} />
                <Route path="components/button" element={<ButtonShowcasePage />} />
                <Route path="components/card" element={<CardShowcasePage />} />
                <Route path="components/input" element={<InputShowcasePage />} />
                <Route path="components/textarea" element={<TextAreaShowcasePage />} />
                <Route path="components/inputnumber" element={<InputNumberShowcasePage />} />
                <Route path="components/select-dropdown" element={<SelectDropdownShowcasePage />} />
                <Route path="components/select" element={<SelectShowcasePage />} />
                <Route path="components/search" element={<SearchShowcasePage />} />
                <Route path="components/checkbox" element={<CheckboxShowcasePage />} />
                <Route path="components/radio" element={<RadioShowcasePage />} />
                <Route path="components/form" element={<FormShowcasePage />} />
                <Route path="components/title" element={<TitleShowcasePage />} />
                <Route path="components/tabs" element={<TabsShowcasePage />} />
                <Route path="components/badge" element={<BadgeShowcasePage />} />
                <Route path="components/tag" element={<TagShowcasePage />} />
                <Route path="components/message" element={<MessageShowcasePage />} />
                <Route path="components/alert" element={<AlertShowcasePage />} />
                <Route path="components/tips" element={<TipsShowcasePage />} />
                <Route path="components/popover" element={<PopoverShowcasePage />} />
                <Route path="components/title-bar" element={<TitleBarShowcasePage />} />
                <Route path="components/breadcrumb" element={<BreadcrumbShowcasePage />} />
                <Route path="components/top-navigation" element={<TopNavigationShowcasePage />} />
                <Route path="components/side-navigation" element={<SideNavigationShowcasePage />} />
                <Route path="components/drawer" element={<DrawerShowcasePage />} />
                <Route path="components/table" element={<TableShowcasePage />} />
                <Route path="components/pagination" element={<PaginationShowcasePage />} />
                <Route path="components/anchor" element={<AnchorShowcasePage />} />
                <Route path="components/steps" element={<StepsShowcasePage />} />
                <Route path="components/divider" element={<DividerBasicStylePage />} />
                <Route path="composite" element={<CompositeLibraryPage />} />
                <Route path="composite/form" element={<FormTemplatesPage />} />
                <Route path="composite/table" element={<CompositeTablePage />} />
                <Route path="composite/product-shell" element={<ProductShellCompositePage />} />
                <Route path="templates" element={<TemplateLibraryPage />} />
                <Route
                  path="templates/sdh-editable-table"
                  element={<Navigate to="/templates/sdh-editable-table/event-scroll" replace />}
                />
                <Route path="templates/sdh-editable-table/:scenarioKey" element={<SdhEditableTableTemplatePage />} />
                <Route path="templates/card/entry-settings" element={<CardEntryTemplatesPage />} />
                <Route
                  path="templates/product-shell"
                  element={<Navigate to="/templates/product-shell/t" replace />}
                />
                <Route path="templates/product-shell/t" element={<ProductShellTemplatePage />} />
                <Route
                  path="templates/product-shell/vertical"
                  element={<ProductShellVerticalTemplatePage />}
                />
                <Route path="cases" element={<CaseLibraryPage />} />
                <Route path="cases/data-source-connection" element={<DataSourceConnectionDemoPage />} />
                <Route path="cases/tiktok-ads-connections" element={<TikTokAdsConnectionsPage />} />
                <Route path="cases/agent-eval-dashboard" element={<EvalDashboardPage />} />
                <Route path="cases/ai-design-stage-ppt" element={<AiDesignStagePresentationPage />} />
                <Route path="cases/sdh-feature-segment-create" element={<SdhFeatureSegmentCreatePage />} />
                <Route path="guides" element={<GuidesHubPage />} />
                <Route path="guides/design-system" element={<DesignSystemGuidePage />} />
                <Route path="guides/agent-rules" element={<AgentRulesGuidePage />} />
                <Route path="guides/methodology" element={<AiDesignMethodologyGuidePage />} />
                <Route path="changelog" element={<ChangelogPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </SensAppearanceProvider>
  );
}
