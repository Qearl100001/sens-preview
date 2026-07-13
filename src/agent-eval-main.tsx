import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import EvalDashboardPage from "./features/agent-eval/EvalDashboardPage";
import { buildAntdTheme } from "./design-system/theme";
import "./ui/button.css";
import "./ui/fab-group.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider theme={buildAntdTheme()} locale={zhCN} button={{ autoInsertSpace: false }}>
      <EvalDashboardPage />
    </ConfigProvider>
  </StrictMode>,
);
