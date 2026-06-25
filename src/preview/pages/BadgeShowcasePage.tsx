import { useState } from "react";
import { InputNumber, Space, Switch, Typography } from "antd";
import badgeDesignDoc from "../../design-system/components/base/badge.design.md?raw";
import badgeDevDoc from "../../design-system/components/base/badge.md?raw";
import {
  BadgeStatesPreview,
  SensBadge,
  SensButton,
  type SensBadgeVariant,
  type SensStatusTone,
  type SensWeakBadgeState,
} from "../../ui";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";
import { ShowcaseSelect } from "../ShowcaseSelect";

const { Text } = Typography;

const VARIANT_OPTIONS: { value: SensBadgeVariant; label: string }[] = [
  { value: "count", label: "基础徽标（数字）" },
  { value: "weakCount", label: "弱化徽标" },
  { value: "status", label: "点徽标（状态）" },
];

const STATUS_OPTIONS: { value: SensStatusTone; label: string }[] = [
  { value: "error", label: "旭日红" },
  { value: "warning", label: "原野黄" },
  { value: "success", label: "极光绿" },
  { value: "processing", label: "冰绽蓝" },
  { value: "midnight", label: "子夜黑" },
  { value: "default", label: "默认" },
];

const WEAK_STATE_OPTIONS: { value: SensWeakBadgeState; label: string }[] = [
  { value: "default", label: "默认" },
  { value: "active", label: "选中" },
  { value: "disabled", label: "禁用" },
];

function BadgeDemo() {
  const [variant, setVariant] = useState<SensBadgeVariant>("count");
  const [count, setCount] = useState<number>(6);
  const [overflowCount, setOverflowCount] = useState<number>(99);
  const [status, setStatus] = useState<SensStatusTone>("error");
  const [weakState, setWeakState] = useState<SensWeakBadgeState>("default");
  const [showAnchor, setShowAnchor] = useState(true);
  const [showZero, setShowZero] = useState(false);

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Space wrap align="end" size="middle">
        <Space direction="vertical" size={4}>
          <Text type="secondary">类型</Text>
          <ShowcaseSelect
            value={variant}
            onChange={setVariant}
            options={VARIANT_OPTIONS}
            style={{ width: 190 }}
          />
        </Space>

        {variant !== "status" ? (
          <>
            <Space direction="vertical" size={4}>
              <Text type="secondary">数量</Text>
              <InputNumber value={count} min={0} onChange={(v) => setCount(Number(v ?? 0))} />
            </Space>
            <Space direction="vertical" size={4}>
              <Text type="secondary">封顶值</Text>
              <InputNumber value={overflowCount} min={1} onChange={(v) => setOverflowCount(Number(v ?? 99))} />
            </Space>
            <Space direction="vertical" size={4}>
              <Text type="secondary">状态</Text>
              <Space>
                <Switch checked={showZero} onChange={setShowZero} />
                <Text>showZero</Text>
              </Space>
            </Space>
          </>
        ) : (
          <Space direction="vertical" size={4}>
            <Text type="secondary">语义色</Text>
            <ShowcaseSelect value={status} onChange={setStatus} options={STATUS_OPTIONS} style={{ width: 150 }} />
          </Space>
        )}

        {variant === "weakCount" ? (
          <Space direction="vertical" size={4}>
            <Text type="secondary">弱化态</Text>
            <ShowcaseSelect value={weakState} onChange={setWeakState} options={WEAK_STATE_OPTIONS} style={{ width: 140 }} />
          </Space>
        ) : null}

        <Space direction="vertical" size={4}>
          <Text type="secondary">挂载对象</Text>
          <Space>
            <Switch checked={showAnchor} onChange={setShowAnchor} />
            <Text>附着到按钮</Text>
          </Space>
        </Space>
      </Space>

      <Space direction="vertical" size="small">
        {variant === "status" ? (
          <SensBadge variant="status" status={status} text="状态文本" />
        ) : (
          <SensBadge
            variant={variant}
            count={count}
            overflowCount={overflowCount}
            weakState={weakState}
            showZero={showZero}
          >
            {showAnchor ? <SensButton tone="secondary">业务入口</SensButton> : undefined}
          </SensBadge>
        )}
        <Text type="secondary">切换数量、弱化态和语义色，查看真实徽标表现</Text>
      </Space>
    </Space>
  );
}

export default function BadgeShowcasePage() {
  return (
    <ComponentShowcaseLayout
      title="徽标 Badge"
      demo={<BadgeDemo />}
      matrix={<BadgeStatesPreview />}
      designDocSource={badgeDesignDoc}
      devDocSource={badgeDevDoc}
    />
  );
}
