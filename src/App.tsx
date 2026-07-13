import { Suspense, lazy, useState } from "react";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import enUS from "antd/locale/en_US";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { buildAntdTheme } from "./design-system/theme";
import type { FunctionalSkin } from "./design-system/functional-skin";
import { PreviewShell } from "./preview/PreviewShell";
import LegacyPreviewPage from "./preview/LegacyPreviewPage";
import ButtonShowcasePage from "./preview/pages/ButtonShowcasePage";
import InputShowcasePage from "./preview/pages/InputShowcasePage";
import TextAreaShowcasePage from "./preview/pages/TextAreaShowcasePage";
import InputNumberShowcasePage from "./preview/pages/InputNumberShowcasePage";
import SelectDropdownShowcasePage from "./preview/pages/SelectDropdownShowcasePage";
import SelectShowcasePage from "./preview/pages/SelectShowcasePage";
import SearchShowcasePage from "./preview/pages/SearchShowcasePage";
import TabsShowcasePage from "./preview/pages/TabsShowcasePage";
import BadgeShowcasePage from "./preview/pages/BadgeShowcasePage";
import TagShowcasePage from "./preview/pages/TagShowcasePage";
import MessageShowcasePage from "./preview/pages/MessageShowcasePage";
import AlertShowcasePage from "./preview/pages/AlertShowcasePage";
import TitleBarShowcasePage from "./preview/pages/TitleBarShowcasePage";
import TopNavigationShowcasePage from "./preview/pages/TopNavigationShowcasePage";
import DrawerShowcasePage from "./preview/pages/DrawerShowcasePage";
import TableShowcasePage from "./preview/pages/TableShowcasePage";
import ChangelogPage from "./preview/pages/ChangelogPage";
import {
  CaseLibraryPage,
  GuidesHubPage,
  SystemOverviewPage,
  TemplateLibraryPage,
} from "./preview/pages/ProductIndexPages";
import FoundationStatusBasicStylePage from "./preview/pages/basic-styles/FoundationStatusBasicStylePage";
import ColorBasicStylePage from "./preview/pages/basic-styles/ColorBasicStylePage";
import ThemeSkinningBasicStylePage from "./preview/pages/basic-styles/ThemeSkinningBasicStylePage";
import NavigationColorBasicStylePage from "./preview/pages/basic-styles/NavigationColorBasicStylePage";
import TypographyBasicStylePage from "./preview/pages/basic-styles/TypographyBasicStylePage";
import SpacingBasicStylePage from "./preview/pages/basic-styles/SpacingBasicStylePage";
import LayoutGridBasicStylePage from "./preview/pages/basic-styles/LayoutGridBasicStylePage";
import SizeBasicStylePage from "./preview/pages/basic-styles/SizeBasicStylePage";
import IconBasicStylePage from "./preview/pages/basic-styles/IconBasicStylePage";
import RadiusBasicStylePage from "./preview/pages/basic-styles/RadiusBasicStylePage";
import ShadowBasicStylePage from "./preview/pages/basic-styles/ShadowBasicStylePage";
import DividerBasicStylePage from "./preview/pages/basic-styles/DividerBasicStylePage";
import CardBasicStylePage from "./preview/pages/basic-styles/CardBasicStylePage";
import DataSourceConnectionDemoPage from "./features/tiktok-ads-connections/DataSourceConnectionDemoPage";
import TikTokAdsConnectionsPage from "./features/tiktok-ads-connections/TikTokAdsConnectionsPage";
import EvalDashboardPage from "./features/agent-eval/EvalDashboardPage";
import "./ui/button.css";
import "./ui/fab-group.css";

const AiDesignStagePresentationPage = lazy(
  () => import("./preview/pages/AiDesignStagePresentationPage"),
);

export default function App() {
  const [skin, setSkin] = useState<FunctionalSkin>("green");
  const { i18n } = useTranslation();
  const locale = i18n.language === "en" ? enUS : zhCN;

  return (
    <ConfigProvider theme={buildAntdTheme()} locale={locale} button={{ autoInsertSpace: false }}>
      <BrowserRouter>
        <Routes>
          <Route element={<PreviewShell skin={skin} onSkinChange={setSkin} />}>
            <Route index element={<Navigate to="/overview" replace />} />
            <Route path="overview" element={<SystemOverviewPage />} />
            <Route path="basic-styles/foundation-status" element={<FoundationStatusBasicStylePage />} />
            <Route path="basic-styles/color" element={<ColorBasicStylePage />} />
            <Route path="basic-styles/theme-skinning" element={<ThemeSkinningBasicStylePage />} />
            <Route path="basic-styles/navigation-color" element={<NavigationColorBasicStylePage />} />
            <Route path="basic-styles/typography" element={<TypographyBasicStylePage />} />
            <Route path="basic-styles/spacing" element={<SpacingBasicStylePage />} />
            <Route path="basic-styles/layout-grid" element={<LayoutGridBasicStylePage />} />
            <Route path="basic-styles/size" element={<SizeBasicStylePage />} />
            <Route path="basic-styles/icon" element={<IconBasicStylePage />} />
            <Route path="basic-styles/radius" element={<RadiusBasicStylePage />} />
            <Route path="basic-styles/shadow" element={<ShadowBasicStylePage />} />
            <Route path="basic-styles/divider" element={<Navigate to="/components/divider" replace />} />
            <Route path="basic-styles/card" element={<CardBasicStylePage />} />
            <Route path="components/button" element={<ButtonShowcasePage />} />
            <Route path="components/input" element={<InputShowcasePage />} />
            <Route path="components/textarea" element={<TextAreaShowcasePage />} />
            <Route path="components/inputnumber" element={<InputNumberShowcasePage />} />
            <Route path="components/select-dropdown" element={<SelectDropdownShowcasePage />} />
            <Route path="components/select" element={<SelectShowcasePage />} />
            <Route path="components/search" element={<SearchShowcasePage />} />
            <Route path="components/tabs" element={<TabsShowcasePage />} />
            <Route path="components/badge" element={<BadgeShowcasePage />} />
            <Route path="components/tag" element={<TagShowcasePage />} />
            <Route path="components/message" element={<MessageShowcasePage />} />
            <Route path="components/alert" element={<AlertShowcasePage />} />
            <Route path="components/title-bar" element={<TitleBarShowcasePage />} />
            <Route path="components/top-navigation" element={<TopNavigationShowcasePage />} />
            <Route path="components/drawer" element={<DrawerShowcasePage />} />
            <Route path="components/table" element={<TableShowcasePage />} />
            <Route path="components/divider" element={<DividerBasicStylePage />} />
            <Route path="templates" element={<TemplateLibraryPage />} />
            <Route path="cases" element={<CaseLibraryPage />} />
            <Route path="cases/data-source-connection" element={<DataSourceConnectionDemoPage />} />
            <Route path="cases/tiktok-ads-connections" element={<TikTokAdsConnectionsPage />} />
            <Route path="cases/agent-eval-dashboard" element={<EvalDashboardPage />} />
            <Route
              path="cases/ai-design-stage-ppt"
              element={
                <Suspense fallback={null}>
                  <AiDesignStagePresentationPage />
                </Suspense>
              }
            />
            <Route path="guides" element={<GuidesHubPage />} />
            <Route path="changelog" element={<ChangelogPage />} />
            <Route path="pages/data-source-demo" element={<Navigate to="/cases/data-source-connection" replace />} />
            <Route path="pages/tiktok-ads-connections" element={<Navigate to="/cases/tiktok-ads-connections" replace />} />
            <Route path="scene/data-source-demo" element={<Navigate to="/cases/data-source-connection" replace />} />
            <Route path="scene/tiktok-ads-connections" element={<Navigate to="/cases/tiktok-ads-connections" replace />} />
            <Route path="scene/agent-eval-dashboard" element={<Navigate to="/cases/agent-eval-dashboard" replace />} />
            <Route path="scene/ai-design-stage-ppt" element={<Navigate to="/cases/ai-design-stage-ppt" replace />} />
            <Route path="legacy" element={<LegacyPreviewPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}
