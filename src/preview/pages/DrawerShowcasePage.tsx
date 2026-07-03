import { useState } from "react";
import { Space, Table, Typography } from "antd";
import drawerDesignDoc from "../../design-system/components/base/drawer.design.md?raw";
import drawerDevDoc from "../../design-system/components/base/drawer.md?raw";
import { SensButton, SensDrawer, SensTitleBar, type SensDrawerSize } from "../../ui";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";
import { getColorToken, tokenRgba } from "../../design-system/color-utils";
import tokens from "../../design-system/tokens.resolved.json";

const { Text } = Typography;
const u = tokens.unit as Record<string, number>;

const matrixRows = [
  { key: "small", item: "small 宽度", value: "432px", token: "SENS_DRAWER_WIDTH.small" },
  { key: "medium", item: "medium 宽度", value: "864px", token: "SENS_DRAWER_WIDTH.medium" },
  { key: "radius", item: "左侧外圆角", value: `${u["radius/xl"]}px`, token: "radius/xl" },
  { key: "shadow", item: "右侧投影", value: "drawer/right", token: 'buildDrawerShadow("right")' },
  { key: "padding", item: "内容内边距", value: "16 / 24 / 24", token: "spacing/4x + spacing/6x" },
  { key: "title", item: "标题区", value: "72px", token: "SensTitleBar" },
];

function DrawerContentBlock() {
  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Text>这里是抽屉内容区。TikTok 创建连接表单后续会放在这里。</Text>
      <div
        style={{
          height: 160,
          borderRadius: u["radius/m"],
          background: tokenRgba("background-transparent-grey", 0.04),
          border: `1px solid ${tokenRgba("divideline-color-transparent-light", 0.08)}`,
        }}
      />
      <div
        style={{
          height: 88,
          borderRadius: u["radius/m"],
          background: getColorToken("white"),
          border: `1px solid ${tokenRgba("outline-color-transparent", 0.12)}`,
        }}
      />
    </Space>
  );
}

function DrawerDemo() {
  const [openSize, setOpenSize] = useState<SensDrawerSize | null>(null);

  return (
    <>
      <Space direction="vertical" size="middle">
        <Space>
          <SensButton tone="primary" onClick={() => setOpenSize("medium")}>
            打开中抽屉
          </SensButton>
          <SensButton tone="secondary" onClick={() => setOpenSize("small")}>
            打开小抽屉
          </SensButton>
        </Space>
        <Text type="secondary">点击按钮查看真实抽屉交互、遮罩、右侧投影和标题栏。</Text>
      </Space>

      <SensDrawer
        open={openSize !== null}
        size={openSize ?? "medium"}
        onClose={() => setOpenSize(null)}
        titleBar={
          <SensTitleBar
            title={openSize === "small" ? "创建连接" : "创建 TikTok Ads 数据连接"}
            onBack={() => setOpenSize(null)}
            actions={
              <>
                <SensButton tone="secondary" onClick={() => setOpenSize(null)}>
                  取消
                </SensButton>
                <SensButton tone="primary">提交</SensButton>
              </>
            }
          />
        }
      >
        <DrawerContentBlock />
      </SensDrawer>
    </>
  );
}

function DrawerMatrix() {
  return (
    <Table
      size="small"
      pagination={false}
      rowKey="key"
      dataSource={matrixRows}
      columns={[
        { title: "项目", dataIndex: "item", key: "item", width: 140 },
        { title: "值", dataIndex: "value", key: "value", width: 180 },
        { title: "token / 代码入口", dataIndex: "token", key: "token" },
      ]}
    />
  );
}

export default function DrawerShowcasePage() {
  return (
    <ComponentShowcaseLayout
      title="抽屉 Drawer"
      demo={<DrawerDemo />}
      matrix={<DrawerMatrix />}
      designDocSource={drawerDesignDoc}
      devDocSource={drawerDevDoc}
    />
  );
}
