import { useState } from "react";
import { Space, Switch, Table, Typography } from "antd";
import drawerDesignDoc from "../../design-system/components/base/drawer.design.md?raw";
import drawerDevDoc from "../../design-system/components/base/drawer.md?raw";
import { SensButton, SensDrawer, SensTitleBar, type SensDrawerSize } from "../../ui";
import { SENS_DRAWER_WIDTH, SENS_DRAWER_WIDTH_RATIO } from "../../ui/SensDrawer";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";
import { getColorToken, tokenRgba } from "../../design-system/color-utils";
import tokens from "../../design-system/tokens.resolved.json";

const { Text } = Typography;
const u = tokens.unit as Record<string, number>;

const SIZE_LABEL: Record<SensDrawerSize, string> = {
  small: "小 · 30%",
  medium: "中 · 60%",
  large: "大 · 80%",
};

const matrixRows = [
  {
    key: "small",
    item: "small 宽度",
    value: `30vw · 约 ${SENS_DRAWER_WIDTH.small}（@1440）`,
    token: `ratio ${SENS_DRAWER_WIDTH_RATIO.small} · clamp 432–576`,
  },
  {
    key: "medium",
    item: "medium 宽度",
    value: `60vw · 约 ${SENS_DRAWER_WIDTH.medium}（@1440）`,
    token: `ratio ${SENS_DRAWER_WIDTH_RATIO.medium} · clamp 864–1152`,
  },
  {
    key: "large",
    item: "large 宽度",
    value: `80vw · 约 ${SENS_DRAWER_WIDTH.large}（@1440）`,
    token: `ratio ${SENS_DRAWER_WIDTH_RATIO.large} · clamp 1152–1536`,
  },
  { key: "mask", item: "有蒙层", value: "mask-01-transparent；点蒙层不关，须返回/按钮", token: 'getColorToken("mask-01-transparent")' },
  { key: "no-mask", item: "无蒙层", value: "点面板外关闭", token: "mask={false}" },
  { key: "z-index", item: "浮层层级", value: "1000", token: "SENS_DRAWER_Z_INDEX" },
  { key: "max-width", item: "面板最大宽", value: "calc(100vw − 48)", token: "2×spacing/horizontal/6x" },
  { key: "scroll-lock", item: "背景滚动", value: "打开锁定 / 关闭还原", token: "body.overflow=hidden" },
  { key: "motion", item: "开合动效", value: "右缘滑入 + 蒙层淡入；240ms 缓入缓出", token: "SENS_DRAWER_MOTION_*" },
  { key: "aria", item: "标题关联", value: "aria-labelledby → TitleBar 标题", token: "titleId" },
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
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<SensDrawerSize>("medium");
  const [withMask, setWithMask] = useState(true);

  const openAt = (next: SensDrawerSize) => {
    setSize(next);
    setOpen(true);
  };

  return (
    <>
      <Space direction="vertical" size="middle">
        <Space wrap>
          <SensButton tone="secondary" onClick={() => openAt("small")}>
            打开小抽屉（30%）
          </SensButton>
          <SensButton tone="primary" onClick={() => openAt("medium")}>
            打开中抽屉（60%）
          </SensButton>
          <SensButton tone="secondary" onClick={() => openAt("large")}>
            打开大抽屉（80%）
          </SensButton>
        </Space>
        <Space align="center">
          <Switch checked={withMask} onChange={setWithMask} />
          <Text>{withMask ? "有蒙层（点蒙层不关，须返回/按钮）" : "无蒙层（点面板外关闭）"}</Text>
        </Space>
        <Text type="secondary">
          三档宽度为视口比例动态值（1440～1920 clamp）。矩阵为规则摘要，与 Demo 同为验收对象。
        </Text>
      </Space>

      <SensDrawer
        open={open}
        size={size}
        mask={withMask}
        onClose={() => setOpen(false)}
        titleBar={
          <SensTitleBar
            title={`${SIZE_LABEL[size]}抽屉`}
            onBack={() => setOpen(false)}
            actions={
              <>
                <SensButton tone="secondary" onClick={() => setOpen(false)}>
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
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Text type="secondary">本矩阵为规则摘要；与上方真实 Demo 同为验收对象。</Text>
      <Table
        size="small"
        pagination={false}
        rowKey="key"
        dataSource={matrixRows}
        columns={[
          { title: "项目", dataIndex: "item", key: "item", width: 140 },
          { title: "值", dataIndex: "value", key: "value", width: 220 },
          { title: "token / 代码入口", dataIndex: "token", key: "token" },
        ]}
      />
    </Space>
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
