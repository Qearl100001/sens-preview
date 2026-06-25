import { useState, type ReactNode } from "react";
import { ReadOutlined } from "@ant-design/icons";
import { Button, Card, Drawer, Grid, Layout, Space, Typography, theme } from "antd";
import { ComponentDocPanel } from "./ComponentDocPanel";

const { Title } = Typography;
const { Content } = Layout;

/** 中栏 : 右栏（文档）= 6 : 4 */
const MAIN_COLUMN_FLEX = 6;
const DOC_COLUMN_FLEX = 4;

export interface ComponentShowcaseLayoutProps {
  title: string;
  demo: ReactNode;
  matrix: ReactNode;
  designDocSource: string;
  devDocSource: string;
}

/**
 * 组件展示页三栏布局（左栏导航在 PreviewShell）：
 * 中栏 Demo + 状态矩阵（6，独立滚动）｜右栏文档（4，独立滚动；窄屏抽屉）
 */
export function ComponentShowcaseLayout({
  title,
  demo,
  matrix,
  designDocSource,
  devDocSource,
}: ComponentShowcaseLayoutProps) {
  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();
  const showDocPanel = screens.lg === true;
  const [docDrawerOpen, setDocDrawerOpen] = useState(false);

  const docPanel = (
    <ComponentDocPanel designDocSource={designDocSource} devDocSource={devDocSource} />
  );

  const drawerWidth =
    typeof window !== "undefined" ? Math.min(Math.round(window.innerWidth * 0.9), 560) : 560;

  return (
    <Layout style={{ height: "100%", display: "flex", flexDirection: "row", background: token.colorBgLayout }}>
      <Content
        style={{
          flex: showDocPanel ? `${MAIN_COLUMN_FLEX} 1 0` : "1 1 0",
          minWidth: 0,
          overflow: "auto",
          padding: token.paddingLG,
        }}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Title level={4} style={{ margin: 0 }}>
            {title}
          </Title>

          <Card title="演示 Demo" size="small">
            {demo}
          </Card>

          <Card title="状态矩阵" size="small" styles={{ body: { overflowX: "auto" } }}>
            {matrix}
          </Card>
        </Space>
      </Content>

      {showDocPanel ? (
        <div
          style={{
            flex: `${DOC_COLUMN_FLEX} 1 0`,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            borderLeft: `1px solid ${token.colorBorderSecondary}`,
            background: token.colorBgContainer,
            overflow: "hidden",
            height: "100%",
          }}
        >
          {docPanel}
        </div>
      ) : (
        <>
          <Button
            type="primary"
            icon={<ReadOutlined />}
            aria-label="打开规范文档"
            onClick={() => setDocDrawerOpen(true)}
            style={{
              position: "fixed",
              right: token.marginLG,
              bottom: token.marginLG,
              zIndex: 10,
            }}
          >
            规范
          </Button>
          <Drawer
            title="组件文档"
            placement="right"
            width={drawerWidth}
            open={docDrawerOpen}
            onClose={() => setDocDrawerOpen(false)}
            styles={{
              body: {
                padding: 0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              },
            }}
          >
            <div style={{ flex: 1, minHeight: 0 }}>{docPanel}</div>
          </Drawer>
        </>
      )}
    </Layout>
  );
}
