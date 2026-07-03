import { useState, type ReactNode } from "react";
import { Layout, Space, Tabs, Typography, theme } from "antd";
import { DesignSystemDoc } from "../../DesignSystemDoc";

const { Content } = Layout;
const { Paragraph, Title } = Typography;

type BasicStyleTabKey = "design" | "specimen";

export interface BasicStylePageLayoutProps {
  title: string;
  description: string;
  designDocSource: string;
  specimen: ReactNode;
}

export function BasicStylePageLayout({
  title,
  description,
  designDocSource,
  specimen,
}: BasicStylePageLayoutProps) {
  const { token } = theme.useToken();
  const [activeTab, setActiveTab] = useState<BasicStyleTabKey>("design");

  return (
    <Layout style={{ height: "100%", background: token.colorBgLayout }}>
      <Content style={{ overflow: "auto", padding: token.paddingLG }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div>
              <Title level={4} style={{ margin: 0 }}>
                {title}
              </Title>
              <Paragraph style={{ marginTop: token.marginXS, marginBottom: 0, color: token.colorTextSecondary }}>
                {description}
              </Paragraph>
            </div>

            <div
              style={{
                background: token.colorBgContainer,
                border: `1px solid ${token.colorBorderSecondary}`,
                borderRadius: token.borderRadius,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: `0 ${token.paddingSM}px`,
                  borderBottom: `1px solid ${token.colorBorderSecondary}`,
                }}
              >
                <Tabs
                  activeKey={activeTab}
                  onChange={(key) => setActiveTab(key as BasicStyleTabKey)}
                  size="small"
                  items={[
                    { key: "design", label: "设计说明" },
                    { key: "specimen", label: "数值样张" },
                  ]}
                />
              </div>
              <div style={{ padding: token.paddingLG }}>
                {activeTab === "design" ? <DesignSystemDoc source={designDocSource} /> : specimen}
              </div>
            </div>
          </Space>
        </div>
      </Content>
    </Layout>
  );
}
