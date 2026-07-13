import type { ReactNode } from "react";
import { SettingOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, Popover, Segmented, Space, Typography, theme } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { FunctionalSkin } from "../design-system/functional-skin";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const { useToken } = theme;

export const BASIC_STYLE_NAV = [
  { key: "/basic-styles/color", label: "颜色" },
  { key: "/basic-styles/theme-skinning", label: "换肤规则" },
  { key: "/basic-styles/navigation-color", label: "导航颜色" },
  { key: "/basic-styles/typography", label: "字体" },
  { key: "/basic-styles/spacing", label: "间距" },
  { key: "/basic-styles/layout-grid", label: "布局 / 栅格" },
  { key: "/basic-styles/size", label: "尺寸" },
  { key: "/basic-styles/icon", label: "图标" },
  { key: "/basic-styles/radius", label: "圆角" },
  { key: "/basic-styles/shadow", label: "投影" },
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
  { key: "/components/tag", label: "标签" },
  { key: "/components/message", label: "轻提示" },
  { key: "/components/alert", label: "警告" },
  { key: "/components/title-bar", label: "标题栏" },
  { key: "/components/top-navigation", label: "顶部导航" },
  { key: "/components/drawer", label: "抽屉" },
  { key: "/components/table", label: "表格" },
  { key: "/components/divider", label: "分割线" },
] as const;

const CASE_NAV = [
  { key: "/cases", label: "案例总览" },
  { key: "/cases/data-source-connection", label: "数据源接入" },
  { key: "/cases/tiktok-ads-connections", label: "TikTok Ads 连接列表" },
  { key: "/cases/agent-eval-dashboard", label: "AgentEval 评测报告" },
  { key: "/cases/ai-design-stage-ppt", label: "AI 设计环节 PPT" },
] as const;

type ProductSection = "overview" | "foundation" | "components" | "templates" | "cases" | "guides";

const SECTION_META: Record<ProductSection, { label: string; description: string; href: string }> = {
  overview: { label: "系统概览", description: "设计系统建设状态与当前工作入口", href: "/overview" },
  foundation: { label: "基础样式", description: "跨组件复用的视觉与布局规则", href: "/basic-styles/color" },
  components: { label: "组件", description: "组件 Demo、状态矩阵与使用说明", href: "/components/button" },
  templates: { label: "样板间", description: "可复用的页面结构与组件组合", href: "/templates" },
  cases: { label: "案例", description: "真实业务与 AI 验证的沉淀", href: "/cases" },
  guides: { label: "规范与方法", description: "设计系统交付、AI 工作规则与方法论", href: "/guides" },
};

const TOP_NAV: { key: ProductSection; label: string; href: string }[] = [
  { key: "overview", label: "系统概览", href: "/overview" },
  { key: "foundation", label: "基础样式", href: "/basic-styles/color" },
  { key: "components", label: "组件", href: "/components/button" },
  { key: "templates", label: "样板间", href: "/templates" },
  { key: "cases", label: "案例", href: "/cases" },
  { key: "guides", label: "规范与方法", href: "/guides" },
];

function getProductSection(pathname: string): ProductSection {
  if (pathname.startsWith("/components/")) return "components";
  if (pathname.startsWith("/basic-styles/foundation-status") || pathname === "/overview") return "overview";
  if (pathname.startsWith("/basic-styles/")) return "foundation";
  if (pathname.startsWith("/templates")) return "templates";
  if (pathname.startsWith("/cases/") || pathname === "/cases") return "cases";
  if (pathname.startsWith("/guides") || pathname === "/changelog") return "guides";
  return "overview";
}

function getSectionMenuItems(section: ProductSection) {
  if (section === "overview") {
    return [
      { key: "/overview", label: "系统概览" },
      { key: "/basic-styles/foundation-status", label: "系统状态" },
    ];
  }

  if (section === "foundation") {
    return BASIC_STYLE_NAV.map((item) => ({ key: item.key, label: item.label }));
  }

  if (section === "components") {
    return [
      {
        type: "group" as const,
        label: "导航",
        children: COMPONENT_NAV.filter((item) => ["/components/top-navigation", "/components/title-bar", "/components/tabs"].includes(item.key)).map(
          (item) => ({ key: item.key, label: item.label }),
        ),
      },
      {
        type: "group" as const,
        label: "输入与选择",
        children: COMPONENT_NAV.filter((item) =>
          ["/components/input", "/components/textarea", "/components/inputnumber", "/components/select-dropdown", "/components/select", "/components/search"].includes(item.key),
        ).map((item) => ({ key: item.key, label: item.label })),
      },
      {
        type: "group" as const,
        label: "操作与反馈",
        children: COMPONENT_NAV.filter((item) => ["/components/button", "/components/drawer", "/components/message", "/components/alert"].includes(item.key)).map(
          (item) => ({ key: item.key, label: item.label }),
        ),
      },
      {
        type: "group" as const,
        label: "内容与数据展示",
        children: COMPONENT_NAV.filter((item) => ["/components/badge", "/components/tag", "/components/table", "/components/divider"].includes(item.key)).map(
          (item) => ({ key: item.key, label: item.label }),
        ),
      },
    ];
  }

  if (section === "cases") return CASE_NAV.map((item) => ({ key: item.key, label: item.label }));
  if (section === "guides") {
    return [
      { key: "/guides", label: "规范与方法总览" },
      { key: "/changelog", label: "更新记录" },
    ];
  }

  return [];
}

function getSelectedMenuKey(section: ProductSection, pathname: string) {
  if (section === "overview") {
    return ["/overview", "/basic-styles/foundation-status"].includes(pathname) ? pathname : "/overview";
  }

  if (section === "foundation") {
    return BASIC_STYLE_NAV.some((item) => item.key === pathname) ? pathname : SECTION_META.foundation.href;
  }

  if (section === "components") {
    return COMPONENT_NAV.some((item) => item.key === pathname) ? pathname : SECTION_META.components.href;
  }

  if (section === "cases") {
    return CASE_NAV.some((item) => item.key === pathname) ? pathname : SECTION_META.cases.href;
  }

  if (section === "guides") return pathname === "/changelog" ? "/changelog" : "/guides";
  return SECTION_META[section].href;
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

  const isComponentPage = location.pathname.startsWith("/components/");
  const isBasicStylePage = location.pathname.startsWith("/basic-styles/");
  const isCasePage = location.pathname.startsWith("/cases/");
  const section = getProductSection(location.pathname);
  const sectionMeta = SECTION_META[section];
  const sectionMenuItems = getSectionMenuItems(section);
  const showSectionMenu = sectionMenuItems.length > 0;
  const selectedKey = getSelectedMenuKey(section, location.pathname);

  const previewSettings = (
    <Space direction="vertical" size="middle" style={{ width: 248 }}>
      <div>
        <Text strong>语言</Text>
        <Segmented
          block
          value={lang === "en" ? "en" : "zh-cn"}
          onChange={(value) => i18n.changeLanguage(String(value))}
          options={[
            { label: "中文", value: "zh-cn" },
            { label: "English", value: "en" },
          ]}
          style={{ marginTop: token.marginXS }}
        />
      </div>
      <div>
        <Text strong>功能色预览</Text>
        <Text type="secondary" style={{ display: "block", marginTop: token.marginXXS, fontSize: token.fontSizeSM }}>
          仅切换功能色，不影响导航主题。
        </Text>
        <Segmented
          block
          value={skin}
          onChange={(value) => onSkinChange(value as FunctionalSkin)}
          options={[
            { label: "绿", value: "green" },
            { label: "蓝", value: "blue" },
          ]}
          style={{ marginTop: token.marginXS }}
        />
      </div>
    </Space>
  );

  return (
    <Layout style={{ height: "100vh", overflow: "hidden", background: token.colorBgLayout }}>
      <Header
        style={{
          flexShrink: 0,
          padding: `0 ${token.paddingLG}px`,
          background: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          height: 56,
          lineHeight: "normal",
          display: "flex",
          alignItems: "center",
          gap: token.marginLG,
        }}
      >
        <div style={{ width: 200, flexShrink: 0 }}>
          <Text strong style={{ fontSize: token.fontSizeLG }}>
            Sens.Design
          </Text>
          <Text type="secondary" style={{ marginLeft: token.marginXS, fontSize: token.fontSizeSM }}>
            Design System
          </Text>
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={[section]}
          items={TOP_NAV.map((item) => ({ key: item.key, label: item.label }))}
          onClick={({ key }) => navigate(TOP_NAV.find((item) => item.key === key)?.href ?? "/overview")}
          style={{ flex: 1, minWidth: 0, borderBottom: 0, background: "transparent" }}
        />
        <Space size="small" style={{ flexShrink: 0 }}>
          <Popover title="预览设置" content={previewSettings} trigger="click" placement="bottomRight">
            <Button type="text" icon={<SettingOutlined />}>
              预览设置
            </Button>
          </Popover>
          {headerExtra}
        </Space>
      </Header>

      <Layout style={{ minWidth: 0, minHeight: 0, display: "flex", flex: 1 }}>
        {showSectionMenu ? (
          <Sider
            width={224}
            theme="light"
            style={{
              borderRight: `1px solid ${token.colorBorderSecondary}`,
              background: token.colorBgContainer,
              overflow: "auto",
              flexShrink: 0,
            }}
          >
            <div style={{ padding: `${token.paddingLG}px ${token.paddingLG}px ${token.paddingSM}px` }}>
              <Text strong>{sectionMeta.label}</Text>
              <Text type="secondary" style={{ display: "block", marginTop: token.marginXXS, fontSize: token.fontSizeSM }}>
                {sectionMeta.description}
              </Text>
            </div>
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              items={sectionMenuItems}
              onClick={({ key }) => navigate(key)}
              style={{ borderInlineEnd: 0, paddingBottom: token.paddingMD }}
            />
            {section === "components" ? (
              <div
                style={{
                  borderTop: `1px solid ${token.colorBorderSecondary}`,
                  margin: `${token.marginXS}px ${token.marginMD} 0`,
                  padding: `${token.paddingMD}px ${token.paddingXS}px`,
                }}
              >
                <Text strong style={{ fontSize: token.fontSizeSM }}>
                  业务组件
                </Text>
                <Text type="secondary" style={{ display: "block", marginTop: token.marginXXS, fontSize: token.fontSizeSM }}>
                  在两个或更多样板间稳定复用后，再收录到这里。
                </Text>
              </div>
            ) : null}
          </Sider>
        ) : null}
        <Content
          style={{
            flex: 1,
            minHeight: 0,
            overflow: isComponentPage || isBasicStylePage ? "hidden" : "auto",
            padding: 0,
          }}
        >
          {isComponentPage || isBasicStylePage ? (
            <Outlet context={{ skin }} />
          ) : isCasePage ? (
            <Outlet context={{ skin }} />
          ) : (
            <Outlet />
          )}
        </Content>
      </Layout>
    </Layout>
  );
}
