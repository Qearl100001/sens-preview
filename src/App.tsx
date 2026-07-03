import { useState } from "react";
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
import TitleBarShowcasePage from "./preview/pages/TitleBarShowcasePage";
import DrawerShowcasePage from "./preview/pages/DrawerShowcasePage";
import TableShowcasePage from "./preview/pages/TableShowcasePage";
import ChangelogPage from "./preview/pages/ChangelogPage";
import ColorBasicStylePage from "./preview/pages/basic-styles/ColorBasicStylePage";
import NavigationColorBasicStylePage from "./preview/pages/basic-styles/NavigationColorBasicStylePage";
import TypographyBasicStylePage from "./preview/pages/basic-styles/TypographyBasicStylePage";
import SpacingBasicStylePage from "./preview/pages/basic-styles/SpacingBasicStylePage";
import SizeBasicStylePage from "./preview/pages/basic-styles/SizeBasicStylePage";
import IconBasicStylePage from "./preview/pages/basic-styles/IconBasicStylePage";
import RadiusBasicStylePage from "./preview/pages/basic-styles/RadiusBasicStylePage";
import ShadowBasicStylePage from "./preview/pages/basic-styles/ShadowBasicStylePage";
import DividerBasicStylePage from "./preview/pages/basic-styles/DividerBasicStylePage";
import CardBasicStylePage from "./preview/pages/basic-styles/CardBasicStylePage";
import DataSourceConnectionDemoPage from "./features/tiktok-ads-connections/DataSourceConnectionDemoPage";
import TikTokAdsConnectionsPage from "./features/tiktok-ads-connections/TikTokAdsConnectionsPage";
import "./ui/button.css";
import "./ui/fab-group.css";

export default function App() {
  const [skin, setSkin] = useState<FunctionalSkin>("green");
  const { i18n } = useTranslation();
  const locale = i18n.language === "en" ? enUS : zhCN;

  return (
    <ConfigProvider theme={buildAntdTheme()} locale={locale} button={{ autoInsertSpace: false }}>
      <BrowserRouter>
        <Routes>
          <Route path="scene/data-source-demo" element={<DataSourceConnectionDemoPage />} />
          <Route path="scene/tiktok-ads-connections" element={<TikTokAdsConnectionsPage />} />
          <Route element={<PreviewShell skin={skin} onSkinChange={setSkin} />}>
            <Route index element={<Navigate to="/components/button" replace />} />
            <Route path="basic-styles/color" element={<ColorBasicStylePage />} />
            <Route path="basic-styles/navigation-color" element={<NavigationColorBasicStylePage />} />
            <Route path="basic-styles/typography" element={<TypographyBasicStylePage />} />
            <Route path="basic-styles/spacing" element={<SpacingBasicStylePage />} />
            <Route path="basic-styles/size" element={<SizeBasicStylePage />} />
            <Route path="basic-styles/icon" element={<IconBasicStylePage />} />
            <Route path="basic-styles/radius" element={<RadiusBasicStylePage />} />
            <Route path="basic-styles/shadow" element={<ShadowBasicStylePage />} />
            <Route path="basic-styles/divider" element={<DividerBasicStylePage />} />
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
            <Route path="components/title-bar" element={<TitleBarShowcasePage />} />
            <Route path="components/drawer" element={<DrawerShowcasePage />} />
            <Route path="components/table" element={<TableShowcasePage />} />
            <Route path="changelog" element={<ChangelogPage />} />
            <Route path="pages/data-source-demo" element={<DataSourceConnectionDemoPage />} />
            <Route path="pages/tiktok-ads-connections" element={<TikTokAdsConnectionsPage />} />
            <Route path="legacy" element={<LegacyPreviewPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}
