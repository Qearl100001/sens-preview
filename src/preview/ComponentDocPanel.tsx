import { useState } from "react";
import { Tabs, theme } from "antd";
import { DesignSystemDoc } from "./DesignSystemDoc";

export interface ComponentDocPanelProps {
  designDocSource: string;
  devDocSource: string;
}

type DocTabKey = "design" | "dev";

/** 右栏文档区：设计规范 / 研发文档 双 tab，内容来自 ?raw 导入的 md 原文件 */
export function ComponentDocPanel({ designDocSource, devDocSource }: ComponentDocPanelProps) {
  const { token } = theme.useToken();
  const [activeTab, setActiveTab] = useState<DocTabKey>("design");

  const activeSource = activeTab === "design" ? designDocSource : devDocSource;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          flexShrink: 0,
          padding: `0 ${token.paddingSM}px`,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          background: token.colorBgContainer,
        }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as DocTabKey)}
          size="small"
          items={[
            { key: "design", label: "设计规范" },
            { key: "dev", label: "研发文档" },
          ]}
        />
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: token.paddingLG }}>
        <DesignSystemDoc source={activeSource} />
      </div>
    </div>
  );
}
