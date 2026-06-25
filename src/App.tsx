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
import TableShowcasePage from "./preview/pages/TableShowcasePage";
import ChangelogPage from "./preview/pages/ChangelogPage";
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
          <Route element={<PreviewShell skin={skin} onSkinChange={setSkin} />}>
            <Route index element={<Navigate to="/components/button" replace />} />
            <Route path="components/button" element={<ButtonShowcasePage />} />
            <Route path="components/input" element={<InputShowcasePage />} />
            <Route path="components/textarea" element={<TextAreaShowcasePage />} />
            <Route path="components/inputnumber" element={<InputNumberShowcasePage />} />
            <Route path="components/select-dropdown" element={<SelectDropdownShowcasePage />} />
            <Route path="components/select" element={<SelectShowcasePage />} />
            <Route path="components/search" element={<SearchShowcasePage />} />
            <Route path="components/tabs" element={<TabsShowcasePage />} />
            <Route path="components/badge" element={<BadgeShowcasePage />} />
            <Route path="components/table" element={<TableShowcasePage />} />
            <Route path="changelog" element={<ChangelogPage />} />
            <Route path="legacy" element={<LegacyPreviewPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}
