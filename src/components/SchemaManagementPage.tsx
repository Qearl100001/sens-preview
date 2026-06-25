import { useMemo, useState, type CSSProperties } from "react";
import type { TableColumnsType, ThemeConfig } from "antd";
import {
  Breadcrumb,
  Button,
  ConfigProvider,
  Input,
  Select,
  Space,
  Table,
  Typography,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { EditorAddIcon, useSensAllowClear, useSensSearchFieldProps, useSensSelectSuffixProps } from "../ui";
import { buildAntdTheme } from "../design-system/theme";
import { tokenRgba } from "../design-system/color-utils";
import tokens from "../design-system/tokens.resolved.json";

const { Text } = Typography;
const c = tokens.color as Record<string, string>;

export interface SchemaRecord {
  key: string;
  name: string;
  tasks: number;
  dataSource: string;
  connection: string;
  creator: string;
  createdAt: string;
}

const MOCK_DATA: SchemaRecord[] = [
  { key: "1", name: "Schema 名称 1", tasks: 1, dataSource: "HDFS", connection: "连接名称", creator: "普拉提", createdAt: "2025-02-20 00:00:00" },
  { key: "2", name: "Schema 名称 02", tasks: 4, dataSource: "HDFS", connection: "连接名称", creator: "普拉提", createdAt: "2025-02-20 00:00:00" },
  { key: "3", name: "Schema 名称 03", tasks: 5, dataSource: "HDFS", connection: "连接名称", creator: "普拉提", createdAt: "2025-02-20 00:00:00" },
  { key: "4", name: "Schema 名称 04", tasks: 6, dataSource: "HDFS", connection: "连接名称", creator: "普拉提", createdAt: "2025-02-20 00:00:00" },
  { key: "5", name: "Schema 名称 05", tasks: 1, dataSource: "HDFS", connection: "连接名称", creator: "普拉提", createdAt: "2025-02-20 00:00:00" },
  {
    key: "6",
    name: "超长名称超长名称超长名称超长名称超长名称超长名称超长名称超长名称超长名称超长名称超长名称超长名称超长名称超长名称",
    tasks: 2,
    dataSource: "HDFS",
    connection: "超级长连接名称超级长连接名称超级长连接名称超级长连接名称超级长连接名称超级长连接名称",
    creator: "普拉提",
    createdAt: "2025-02-20 00:00:00",
  },
  { key: "7", name: "Schema 名称 06", tasks: 1, dataSource: "HDFS", connection: "连接名称", creator: "普拉提", createdAt: "2025-02-20 00:00:00" },
  { key: "8", name: "Schema 名称 07", tasks: 1, dataSource: "HDFS", connection: "连接名称", creator: "普拉提", createdAt: "2025-02-20 00:00:00" },
  { key: "9", name: "Schema 名称 08", tasks: 2, dataSource: "HDFS", connection: "连接名称", creator: "普拉提", createdAt: "2025-02-20 00:00:00" },
  { key: "10", name: "Schema 名称 09", tasks: 1, dataSource: "HDFS", connection: "连接名称", creator: "普拉提", createdAt: "2025-02-20 00:00:00" },
];

const TOTAL = 1000;

type SchemaPalette = {
  pageBg: string;
  titleBg: string;
  contentBg: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textPlaceholder: string;
  icon: string;
  tableHeaderBg: string;
  tableRowBg: string;
  tableRowHoverBg: string;
  tableDivider: string;
  link: string;
  infoBarBorder: string;
};

function getSchemaPalette(): SchemaPalette {
  return {
    pageBg: c["body-background"],
    titleBg: c["theme-title-background"],
    contentBg: c.white,
    border: c["outline-color"],
    textPrimary: tokenRgba("text-color-transparent", 0.9),
    textSecondary: tokenRgba("text-sub-color-transparent", 0.58),
    textPlaceholder: tokenRgba("text-color-transparent-disable", 0.3),
    icon: c["icon-color-transparent"],
    tableHeaderBg: c["background-grey"],
    tableRowBg: c.white,
    tableRowHoverBg: tokenRgba("outline-color-transparent", 0.02),
    tableDivider: c["background-grey"],
    link: c["link-color"],
    infoBarBorder: tokenRgba("outline-color-transparent", 0.08),
  };
}

function buildSchemaTheme(): ThemeConfig {
  const p = getSchemaPalette();
  return {
    ...buildAntdTheme(),
    components: {
      Table: {
        headerBg: p.tableHeaderBg,
        headerColor: p.textPrimary,
        borderColor: p.tableDivider,
        rowHoverBg: p.tableRowHoverBg,
        colorBgContainer: p.tableRowBg,
        colorText: p.textPrimary,
      },
      Pagination: {
        itemSize: 32,
        itemActiveBg: c["component-primary"],
        colorBgContainer: p.contentBg,
        colorText: p.textPrimary,
        colorPrimary: c["component-primary"],
      },
      Input: {
        colorBgContainer: p.contentBg,
        colorText: p.textPrimary,
        colorBorder: p.border,
        colorTextPlaceholder: p.textPlaceholder,
      },
      Select: {
        colorBgContainer: p.contentBg,
        colorText: p.textPrimary,
        colorBorder: p.border,
        colorTextPlaceholder: p.textPlaceholder,
      },
      Button: {
        colorPrimary: c["component-primary"],
      },
    },
  };
}

function ActionLinks() {
  const linkStyle: CSSProperties = {
    padding: 0,
    height: 22,
    fontSize: 14,
    lineHeight: "22px",
  };
  return (
    <Space size={16}>
      <Button type="link" style={linkStyle}>查看</Button>
      <Button type="link" style={linkStyle}>编辑</Button>
      <Button type="link" style={linkStyle}>删除</Button>
    </Space>
  );
}

export interface SchemaManagementPageProps {
  embedded?: boolean;
}

export default function SchemaManagementPage({ embedded = false }: SchemaManagementPageProps) {
  const [search, setSearch] = useState("");
  const allowClear = useSensAllowClear();
  const selectSuffixProps = useSensSelectSuffixProps();
  const searchFieldProps = useSensSearchFieldProps({ width: 200 });
  const palette = getSchemaPalette();
  const schemaTheme = buildSchemaTheme();

  const headerCellStyle: CSSProperties = {
    background: palette.tableHeaderBg,
    fontWeight: 500,
    fontSize: 14,
    color: palette.textPrimary,
    padding: "17px 16px",
    borderBottom: `1px solid ${palette.tableDivider}`,
  };

  const bodyCellStyle: CSSProperties = {
    background: palette.tableRowBg,
    fontSize: 14,
    color: palette.textPrimary,
    padding: "17px 16px",
    borderBottom: `1px solid ${palette.tableDivider}`,
  };

  const columns: TableColumnsType<SchemaRecord> = useMemo(
    () => [
      {
        title: "Schema 名称",
        dataIndex: "name",
        key: "name",
        width: 320,
        ellipsis: { showTitle: true },
        onHeaderCell: () => ({ style: headerCellStyle }),
        onCell: () => ({ style: bodyCellStyle }),
        render: (text: string) => (
          <Text style={{ fontSize: 14, color: palette.textPrimary, wordBreak: "break-word" }}>{text}</Text>
        ),
      },
      {
        title: "关联任务",
        dataIndex: "tasks",
        key: "tasks",
        width: 148,
        onHeaderCell: () => ({ style: headerCellStyle }),
        onCell: () => ({ style: bodyCellStyle }),
      },
      {
        title: "数据源",
        dataIndex: "dataSource",
        key: "dataSource",
        width: 148,
        onHeaderCell: () => ({ style: headerCellStyle }),
        onCell: () => ({ style: bodyCellStyle }),
      },
      {
        title: "数据连接",
        dataIndex: "connection",
        key: "connection",
        width: 280,
        ellipsis: { showTitle: true },
        onHeaderCell: () => ({ style: headerCellStyle }),
        onCell: () => ({ style: bodyCellStyle }),
        render: (text: string) => (
          <Text style={{ fontSize: 14, color: palette.textPrimary, wordBreak: "break-word" }}>{text}</Text>
        ),
      },
      {
        title: "创建人",
        dataIndex: "creator",
        key: "creator",
        width: 148,
        sorter: (a, b) => a.creator.localeCompare(b.creator),
        onHeaderCell: () => ({ style: headerCellStyle }),
        onCell: () => ({ style: bodyCellStyle }),
      },
      {
        title: "创建时间",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 194,
        sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
        onHeaderCell: () => ({ style: headerCellStyle }),
        onCell: () => ({ style: bodyCellStyle }),
      },
      {
        title: "操作",
        key: "action",
        width: 168,
        fixed: "right",
        onHeaderCell: () => ({ style: headerCellStyle }),
        onCell: () => ({ style: bodyCellStyle }),
        render: () => <ActionLinks />,
      },
    ],
    [palette.textPrimary]
  );

  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return MOCK_DATA;
    return MOCK_DATA.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.connection.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <ConfigProvider theme={schemaTheme} button={{ autoInsertSpace: false }}>
      <div
        style={{
          minHeight: embedded ? undefined : "100vh",
          background: palette.pageBg,
          borderRadius: embedded ? 6 : undefined,
          overflow: embedded ? "hidden" : undefined,
          border: embedded ? `1px solid ${palette.border}` : undefined,
          transition: "background 0.2s",
        }}
      >
        {/* 顶部标题栏 */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            padding: embedded ? "0 16px 0 0" : "0 24px 0 0",
            background: palette.titleBg,
            borderRadius: embedded ? "6px 6px 0 0" : "10px 10px 0 0",
            minHeight: 72,
          }}
        >
          <div style={{ padding: embedded ? "11px 0 11px 16px" : "11px 0 11px 24px" }}>
            <Breadcrumb
              separator="/"
              items={[
                { title: <span style={{ fontSize: 12, color: palette.textSecondary }}>数据源管理</span> },
                { title: <span style={{ fontSize: 12, color: palette.textSecondary }}>Schema 管理</span> },
              ]}
              style={{ marginBottom: 2 }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 2, paddingLeft: 2 }}>
              <Button
                type="text"
                icon={<ArrowLeftOutlined style={{ fontSize: 14, color: palette.icon }} />}
                style={{ width: 22, height: 22, padding: 0, color: palette.icon }}
              />
              <Text strong style={{ fontSize: 20, lineHeight: "30px", color: palette.textPrimary }}>
                Schema 管理
              </Text>
            </div>
          </div>
          <Button type="primary" icon={<EditorAddIcon />} style={{ marginTop: 20 }}>
            创建 Schema
          </Button>
        </div>

        {/* 内容区 */}
        <div
          style={{
            background: palette.contentBg,
            padding: embedded ? "16px" : "16px 24px 24px",
            transition: "background 0.2s",
          }}
        >
          <Space size={16} wrap style={{ marginBottom: 16 }}>
            <Input
              placeholder="搜索连接名称/服务器地址"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear={allowClear}
              {...searchFieldProps}
            />
            <Space size={8}>
              <Text strong style={{ fontSize: 14, color: palette.textPrimary }}>数据源</Text>
              <Select {...selectSuffixProps} placeholder="请选择" style={{ width: 148 }} allowClear={allowClear} options={[]} />
            </Space>
            <Space size={8}>
              <Text strong style={{ fontSize: 14, color: palette.textPrimary }}>数据连接状态</Text>
              <Select {...selectSuffixProps} placeholder="请选择" style={{ width: 148 }} allowClear={allowClear} options={[]} />
            </Space>
            <Space size={8}>
              <Text strong style={{ fontSize: 14, color: palette.textPrimary }}>创建人</Text>
              <Select {...selectSuffixProps} placeholder="请选择" style={{ width: 148 }} allowClear={allowClear} options={[]} />
            </Space>
          </Space>

          <div
            style={{
              border: `1px solid ${palette.border}`,
              borderRadius: 6,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: 40,
                padding: "11px 16px",
                fontSize: 12,
                color: palette.textSecondary,
                background: palette.contentBg,
                borderBottom: `1px solid ${palette.infoBarBorder}`,
              }}
            >
              共 {TOTAL.toLocaleString()} 条
            </div>

            <Table<SchemaRecord>
              columns={columns}
              dataSource={filteredData}
              onRow={() => ({ style: { background: palette.tableRowBg } })}
              pagination={{
                total: TOTAL,
                defaultCurrent: 1,
                defaultPageSize: 10,
                pageSizeOptions: [10, 20, 50],
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (_, range) => (
                  <span style={{ fontSize: 12, color: palette.textSecondary }}>
                    本页显示第 {range[0]}-{range[1]} 条
                  </span>
                ),
                style: { padding: "12px 16px", margin: 0 },
              }}
              scroll={{ x: 1300 }}
              size="middle"
              rowKey="key"
              style={{ background: palette.contentBg }}
            />
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
