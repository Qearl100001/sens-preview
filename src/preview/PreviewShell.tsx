import type { ReactNode } from "react";
import { Divider, Layout, Menu, Segmented, Space, Typography, theme } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { FunctionalSkin } from "../design-system/functional-skin";
import { getFunctionalColors } from "../design-system/functional-skin";
import tokens from "../design-system/tokens.resolved.json";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { useToken } = theme;

const u = tokens.unit as Record<string, number>;

export const BASIC_STYLE_NAV = [
  { key: "/basic-styles/color", label: "颜色" },
  { key: "/basic-styles/navigation-color", label: "导航颜色" },
  { key: "/basic-styles/typography", label: "字体" },
  { key: "/basic-styles/spacing", label: "间距" },
  { key: "/basic-styles/size", label: "尺寸" },
  { key: "/basic-styles/icon", label: "图标" },
  { key: "/basic-styles/radius", label: "圆角" },
  { key: "/basic-styles/shadow", label: "投影" },
  { key: "/basic-styles/divider", label: "分割线" },
  { key: "/basic-styles/card", label: "卡片" },
] as const;

export const COMPONENT_NAV = [
  { key: "/components/button", label: "按钮" },
  { key: "/components/input", label: "输入框" },
  { key: "/components/textarea", label: "文本域" },
  { key: "/components/inputnumber", label: "数字输入框" },
  { key: "/components/select-dropdown", label: "下拉浮层" },
  { key: "/components/select", label: "选择器" },
  { key: "/components/search", label: "搜索" },
  { key: "/components/tabs", label: "标签页" },
  { key: "/components/badge", label: "徽标" },
  { key: "/components/title-bar", label: "标题栏" },
  { key: "/components/drawer", label: "抽屉" },
  { key: "/components/table", label: "表格" },
] as const;

const SCENE_NAV = [
  { key: "/pages/data-source-demo", label: "数据源接入 Demo" },
  { key: "/pages/tiktok-ads-connections", label: "TikTok Ads 连接列表" },
] as const;

const EXTRA_NAV = [{ key: "/changelog", label: "更新日志" }] as const;

/** 开发态顶栏显示当前端口，避免多开 Vite 看错 bundle */
function DevPortHint() {
  if (!import.meta.env.DEV || typeof window === "undefined") return null;
  const port = window.location.port;
  if (!port) return null;
  return (
    <Text type="secondary">
      端口 <Text strong>{port}</Text>
    </Text>
  );
}

export interface PreviewShellProps {
  skin: FunctionalSkin;
  onSkinChange: (skin: FunctionalSkin) => void;
  headerExtra?: ReactNode;
}

export function PreviewShell({ skin, onSkinChange, headerExtra }: PreviewShellProps) {
  const { token } = useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const functional = getFunctionalColors(skin);

  const isComponentPage = location.pathname.startsWith("/components/");
  const isBasicStylePage = location.pathname.startsWith("/basic-styles/");
  const isScenePage = location.pathname.startsWith("/pages/");

  const selectedKey =
    BASIC_STYLE_NAV.some((item) => item.key === location.pathname) ||
    COMPONENT_NAV.some((item) => item.key === location.pathname) ||
    SCENE_NAV.some((item) => item.key === location.pathname) ||
    EXTRA_NAV.some((item) => item.key === location.pathname)
      ? location.pathname
      : location.pathname.startsWith("/legacy")
        ? "/legacy"
        : "/components/button";

  return (
    <Layout style={{ height: "100vh", overflow: "hidden", background: token.colorBgLayout }}>
      <Sider
        width={200}
        theme="light"
        style={{
          borderRight: `1px solid ${token.colorBorderSecondary}`,
          background: token.colorBgContainer,
          overflow: "auto",
          flexShrink: 0,
        }}
      >
        <div style={{ padding: `${token.paddingMD}px ${token.paddingLG}px` }}>
          <Text strong>Sens.Design</Text>
          <br />
          <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
            组件预览
          </Text>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={[
            {
              type: "group" as const,
              label: "基础样式",
              children: BASIC_STYLE_NAV.map((item) => ({ key: item.key, label: item.label })),
            },
            { type: "divider" as const },
            {
              type: "group" as const,
              label: "组件",
              children: COMPONENT_NAV.map((item) => ({
                key: item.key,
                label: item.label,
                disabled: Boolean((item as { disabled?: boolean }).disabled),
              })),
            },
            { type: "divider" as const },
            {
              type: "group" as const,
              label: "场景页面",
              children: SCENE_NAV.map((item) => ({ key: item.key, label: item.label })),
            },
            { type: "divider" as const },
            { key: "/legacy", label: "旧版全量预览" },
            ...EXTRA_NAV,
          ]}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout style={{ minWidth: 0, display: "flex", flexDirection: "column" }}>
        <Header
          style={{
            flexShrink: 0,
            padding: `0 ${token.paddingLG}px`,
            background: token.colorBgContainer,
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            height: "auto",
            lineHeight: "normal",
          }}
        >
          <Space
            style={{ width: "100%", justifyContent: "space-between", padding: `${token.paddingSM}px 0` }}
            wrap
          >
            <Title level={4} style={{ margin: 0 }}>
              预览工程
            </Title>
            <Space size="large" wrap>
              <DevPortHint />
              <Space wrap split={<Divider type="vertical" />}>
                <Text type="secondary">
                  主色 <Text strong>{functional.primary}</Text>
                </Text>
                <Text type="secondary">
                  圆角 <Text strong>{u["radius/m"]}</Text>
                </Text>
                <Text type="secondary">
                  控件高 <Text strong>{u["size/component-height/m"]}</Text>
                </Text>
              </Space>
              <Space>
                <Text type="secondary">中 / EN</Text>
                <Segmented
                  value={lang === "en" ? "en" : "zh-cn"}
                  onChange={(v) => i18n.changeLanguage(String(v))}
                  options={[
                    { label: "中文", value: "zh-cn" },
                    { label: "English", value: "en" },
                  ]}
                />
              </Space>
              <Space>
                <Text type="secondary">功能色换肤</Text>
                <Segmented
                  value={skin}
                  onChange={(v) => onSkinChange(v as FunctionalSkin)}
                  options={[
                    { label: "绿", value: "green" },
                    { label: "蓝", value: "blue" },
                  ]}
                />
              </Space>
              {headerExtra}
            </Space>
          </Space>
        </Header>

        <Content
          style={{
            flex: 1,
            minHeight: 0,
            overflow: isComponentPage || isBasicStylePage ? "hidden" : "auto",
            padding: isComponentPage || isBasicStylePage || isScenePage ? 0 : token.paddingLG,
          }}
        >
          {isComponentPage || isBasicStylePage ? (
            <Outlet context={{ skin }} />
          ) : isScenePage ? (
            <Outlet context={{ skin }} />
          ) : (
            <div style={{ maxWidth: 1440, width: "100%", margin: "0 auto" }}>
              <Outlet />
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}
