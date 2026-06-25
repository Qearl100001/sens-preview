import { useMemo, useState } from "react";
import {
  Drawer,
  Button,
  Alert,
  Tabs,
  Input,
  Checkbox,
  Empty,
  Typography,
  Space,
  theme,
} from "antd";
import { ArrowLeftOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useSensAllowClear, useSensSearchFieldProps } from "../ui";
import { useSensIconTokens } from "../ui/useSensIconTokens";
import tokens from "../design-system/tokens.resolved.json";
import { tokenRgba } from "../design-system/color-utils";

const { Text } = Typography;

const c = tokens.color as Record<string, string>;

const EVENT_FIELDS = [
  "设备 ID",
  "登录 ID",
  "Birthday",
  "RegisterChannel",
  "d_ecpm_numbe2",
  "ad_ecpm_numbe2",
  "ad_ecpm_numbe23",
  "ad_ecpm_numbe24",
  "kongzifuchuan",
  "testufuhao1",
  "testufuhao2",
];

const USER_FIELDS = ["用户昵称", "手机号", "邮箱"];

type TabKey = "event" | "user";

export interface SensitiveDataDecryptDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave?: (selected: string[]) => void;
}

export default function SensitiveDataDecryptDrawer({
  open,
  onClose,
  onSave,
}: SensitiveDataDecryptDrawerProps) {
  const { token } = theme.useToken();
  const icons = useSensIconTokens();
  const allowClear = useSensAllowClear();
  const searchFieldProps = useSensSearchFieldProps();
  const [activeTab, setActiveTab] = useState<TabKey>("event");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const sourceFields = activeTab === "event" ? EVENT_FIELDS : USER_FIELDS;

  const filteredFields = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sourceFields;
    return sourceFields.filter((f) => f.toLowerCase().includes(q));
  }, [sourceFields, search]);

  const allFilteredSelected =
    filteredFields.length > 0 && filteredFields.every((f) => selected.includes(f));

  const someFilteredSelected =
    filteredFields.some((f) => selected.includes(f)) && !allFilteredSelected;

  const toggleField = (field: string, checked: boolean) => {
    setSelected((prev) =>
      checked ? [...prev, field] : prev.filter((f) => f !== field)
    );
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelected((prev) => [...new Set([...prev, ...filteredFields])]);
    } else {
      setSelected((prev) => prev.filter((f) => !filteredFields.includes(f)));
    }
  };

  const handleSave = () => {
    onSave?.(selected);
    onClose();
  };

  const panelStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    border: `1px solid ${c["outline-color"]}`,
    borderRadius: token.borderRadius,
    background: c.white,
    overflow: "hidden",
    minHeight: 0,
  };

  const panelHeaderStyle: React.CSSProperties = {
    padding: "7px 12px",
    background: tokenRgba("background-01-transparent", 0.04),
    borderRadius: `${token.borderRadius}px ${token.borderRadius}px 0 0`,
  };

  const panelFooterStyle: React.CSSProperties = {
    padding: "12px",
    borderTop: `1px solid ${c["outline-color"]}`,
    height: 46,
    display: "flex",
    alignItems: "center",
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="right"
      width={864}
      closable={false}
      maskStyle={{ background: tokenRgba("mask-01-transparent", 0.6) }}
      styles={{
        body: { padding: 0, background: c["theme-title-background"] },
        content: {
          borderRadius: "10px 0 0 10px",
          boxShadow: `-2px 0 12px ${tokenRgba("mask-01-transparent", 0.1)}, -4px 0 20px ${tokenRgba("mask-01-transparent", 0.08)}`,
        },
      }}
    >
      {/* 标题栏 */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "0 24px 0 0",
          background: c["theme-title-background"],
          borderRadius: "10px 0 0 0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 2, padding: "21px 0 21px 2px" }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined style={{ fontSize: 14, color: icons.default }} />}
            onClick={onClose}
            style={{ width: 22, height: 22, padding: 0 }}
          />
          <Text
            strong
            style={{
              fontSize: 20,
              lineHeight: "30px",
              color: tokenRgba("text-color-transparent", 0.9),
              marginLeft: 2,
            }}
          >
            编辑敏感数据解密
          </Text>
        </div>
        <Space size={16} style={{ paddingTop: 20 }}>
          <Button onClick={onClose}>放 弃</Button>
          <Button type="primary" disabled={selected.length === 0} onClick={handleSave}>
            保 存
          </Button>
        </Space>
      </div>

      {/* 内容区 */}
      <div style={{ padding: "16px 24px 24px", flex: 1 }}>
        <Alert
          type="info"
          showIcon
          icon={<InfoCircleOutlined style={{ color: token.colorInfo }} />}
          message="未解密前，敏感数据均已密文形式展示；选择左侧敏感数据列表中的数据申请解密后，对应敏感数据解密为明文，同时记录本次解密行为日志"
          style={{
            marginBottom: 16,
            background: c["link-light-background"],
            border: `1px solid ${c["link-light-outline"]}`,
          }}
        />

        <div style={{ display: "flex", gap: 8, height: 614 }}>
          {/* 左栏：敏感数据列表 */}
          <div style={panelStyle}>
            <div style={panelHeaderStyle}>
              <Text strong style={{ fontSize: 14, color: tokenRgba("text-color-transparent", 0.9) }}>
                敏感数据列表
              </Text>
            </div>

            <Tabs
              activeKey={activeTab}
              onChange={(k) => setActiveTab(k as TabKey)}
              items={[
                { key: "event", label: "事件属性" },
                { key: "user", label: "用户属性" },
              ]}
              style={{ padding: "0 12px" }}
              size="small"
            />

            <div style={{ padding: "0 12px", borderBottom: `1px solid ${c["outline-color"]}` }}>
              <Input
                placeholder="搜索"
                variant="borderless"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ height: 32, ...searchFieldProps.style }}
                className={searchFieldProps.className}
                prefix={searchFieldProps.prefix}
                allowClear={allowClear}
              />
            </div>

            <Text
              type="secondary"
              style={{ display: "block", padding: "6px 12px", fontSize: 12, lineHeight: "18px" }}
            >
              共 {filteredFields.length} 个
            </Text>

            <div style={{ flex: 1, overflow: "auto" }}>
              {filteredFields.map((field) => (
                <div
                  key={field}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 12px",
                  }}
                >
                  <Checkbox
                    checked={selected.includes(field)}
                    onChange={(e) => toggleField(field, e.target.checked)}
                  >
                    <Text style={{ fontSize: 14, color: tokenRgba("text-color-transparent", 0.9) }}>{field}</Text>
                  </Checkbox>
                </div>
              ))}
            </div>

            <div style={panelFooterStyle}>
              <Checkbox
                checked={allFilteredSelected}
                indeterminate={someFilteredSelected}
                onChange={(e) => toggleSelectAll(e.target.checked)}
              >
                全选
              </Checkbox>
            </div>
          </div>

          {/* 右栏：解密数据列表 */}
          <div style={{ ...panelStyle, border: `1px solid ${tokenRgba("outline-color-transparent", 0.12)}` }}>
            <div style={panelHeaderStyle}>
              <Text strong style={{ fontSize: 14, color: tokenRgba("text-color-transparent", 0.9) }}>
                解密数据列表
              </Text>
            </div>

            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "auto",
                padding: "6px 0",
              }}
            >
              {selected.length === 0 ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 14, color: tokenRgba("text-color-transparent", 0.9), marginBottom: 4 }}>
                        暂无数据
                      </div>
                      <div style={{ fontSize: 12, color: tokenRgba("text-sub-color-transparent", 0.58), lineHeight: "18px" }}>
                        暂无数据，请选择左侧的
                        <br />
                        敏感数据进行添加
                      </div>
                    </div>
                  }
                />
              ) : (
                <div style={{ width: "100%", padding: "0 12px" }}>
                  {selected.map((field) => (
                    <div
                      key={field}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "6px 0",
                      }}
                    >
                      <Text style={{ fontSize: 14 }}>{field}</Text>
                      <Button
                        type="link"
                        size="small"
                        onClick={() => toggleField(field, false)}
                        style={{ padding: 0, height: "auto" }}
                      >
                        移除
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={panelFooterStyle}>
              <Space size={4}>
                <Button
                  type="link"
                  disabled={selected.length === 0}
                  onClick={() => setSelected([])}
                  style={{ padding: 0, height: 22 }}
                >
                  清空
                </Button>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  已选 {selected.length} 个
                </Text>
              </Space>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
