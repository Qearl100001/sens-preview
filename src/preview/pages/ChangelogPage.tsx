import { useMemo, useState } from "react";
import { Card, Layout, Segmented, Space, Typography, theme } from "antd";
import { DesignSystemDoc } from "../DesignSystemDoc";

const { Content } = Layout;
const { Text, Title } = Typography;

// eager glob 在 dev 启动时固定文件列表；新建 md 后需刷新页面（vite changelog-glob-reload 插件会整页 reload）
const changelogModules = import.meta.glob("../../design-system/changelog/20*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const DATE_RE = /(\d{4}-\d{2}-\d{2})\.md$/;

function formatChangelogLabel(iso: string): string {
  const [, month, day] = iso.split("-");
  return `${Number(month)}月${Number(day)}日`;
}

type ChangelogEntry = { key: string; label: string; source: string };

const CHANGELOG_ENTRIES: ChangelogEntry[] = Object.entries(changelogModules)
  .map(([path, source]) => {
    const key = path.match(DATE_RE)?.[1];
    return key ? { key, label: formatChangelogLabel(key), source } : null;
  })
  .filter((entry): entry is ChangelogEntry => entry !== null)
  .sort((a, b) => b.key.localeCompare(a.key));

function formatToday() {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date());
}

export default function ChangelogPage() {
  const { token } = theme.useToken();
  const [activeKey, setActiveKey] = useState<string>(() => CHANGELOG_ENTRIES[0]?.key ?? "");

  const activeEntry = useMemo(
    () => CHANGELOG_ENTRIES.find((entry) => entry.key === activeKey) ?? CHANGELOG_ENTRIES[0],
    [activeKey],
  );

  return (
    <Content style={{ padding: token.paddingLG }}>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Title level={4} style={{ margin: 0 }}>
          更新日志
        </Title>
        <Card size="small" title="今天时间">
          <Text>{formatToday()}</Text>
        </Card>
        {CHANGELOG_ENTRIES.length > 0 ? (
          <>
            <Card size="small" title="选择日期">
              <Segmented
                options={CHANGELOG_ENTRIES.map((entry) => ({
                  label: entry.label,
                  value: entry.key,
                }))}
                value={activeKey}
                onChange={(value) => setActiveKey(String(value))}
              />
            </Card>
            <Card size="small" title={`日志内容 · ${activeEntry?.label ?? ""}`}>
              <DesignSystemDoc source={activeEntry?.source ?? ""} />
            </Card>
          </>
        ) : (
          <Card size="small">
            <Text type="secondary">暂无日志。请在 changelog/ 新建 YYYY-MM-DD.md。</Text>
          </Card>
        )}
      </Space>
    </Content>
  );
}
