import { useState } from "react";
import { Space, Switch, Typography } from "antd";
import tagDevDoc from "../../design-system/components/base/tag.md?raw";
import {
  IconDefaultIcon,
  SensTag,
  TAG_STATUS_LABEL,
  TagTypesPreview,
  type TagColor,
  type TagSize,
  type TagStatus,
  type TagVariant,
} from "../../ui";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";
import { ShowcaseSelect } from "../ShowcaseSelect";

const { Text } = Typography;

const VARIANT_OPTIONS: { value: TagVariant; label: string }[] = [
  { value: "multicolor", label: "多色" },
  { value: "overlay", label: "叠加" },
  { value: "status", label: "状态" },
];

const COLOR_OPTIONS: { value: TagColor; label: string }[] = [
  { value: "neutral", label: "子夜灰" },
  { value: "red", label: "旭日红" },
  { value: "yellow", label: "原野黄" },
  { value: "green", label: "极光绿" },
  { value: "cyan", label: "山水蓝" },
  { value: "blue", label: "冰绽蓝" },
  { value: "purple", label: "兰花紫" },
];

const STATUS_OPTIONS: { value: TagStatus; label: string }[] = [
  { value: "success", label: "成功" },
  { value: "processing", label: "进行中" },
  { value: "exception", label: "异常" },
  { value: "error", label: "失败" },
  { value: "invalid", label: "失效" },
];

const SIZE_OPTIONS: { value: TagSize; label: string }[] = [
  { value: "large", label: "大" },
  { value: "small", label: "小" },
];

function TagDemo() {
  const [variant, setVariant] = useState<TagVariant>("multicolor");
  const [color, setColor] = useState<TagColor>("cyan");
  const [status, setStatus] = useState<TagStatus>("success");
  const [size, setSize] = useState<TagSize>("large");
  const [clickable, setClickable] = useState(false);
  const [closable, setClosable] = useState(false);
  const [withIcon, setWithIcon] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [closed, setClosed] = useState(false);

  const isStatus = variant === "status";

  if (closed && !isStatus) {
    return (
      <Space direction="vertical" size="middle">
        <Text type="secondary">标签已移除</Text>
        <a
          href="#restore"
          onClick={(e) => {
            e.preventDefault();
            setClosed(false);
          }}
        >
          恢复演示
        </a>
      </Space>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Space wrap align="end" size="middle">
        <Space direction="vertical" size={4}>
          <Text type="secondary">样子</Text>
          <ShowcaseSelect value={variant} onChange={setVariant} options={VARIANT_OPTIONS} style={{ width: 140 }} />
        </Space>
        {isStatus ? (
          <Space direction="vertical" size={4}>
            <Text type="secondary">语义</Text>
            <ShowcaseSelect value={status} onChange={setStatus} options={STATUS_OPTIONS} style={{ width: 140 }} />
          </Space>
        ) : (
          <Space direction="vertical" size={4}>
            <Text type="secondary">色系</Text>
            <ShowcaseSelect value={color} onChange={setColor} options={COLOR_OPTIONS} style={{ width: 140 }} />
          </Space>
        )}
        <Space direction="vertical" size={4}>
          <Text type="secondary">尺寸</Text>
          <ShowcaseSelect value={size} onChange={setSize} options={SIZE_OPTIONS} style={{ width: 100 }} />
        </Space>
        {!isStatus ? (
          <>
            <Space direction="vertical" size={4}>
              <Text type="secondary">可点击</Text>
              <Switch checked={clickable} onChange={setClickable} />
            </Space>
            <Space direction="vertical" size={4}>
              <Text type="secondary">可移除</Text>
              <Switch checked={closable} onChange={setClosable} />
            </Space>
            <Space direction="vertical" size={4}>
              <Text type="secondary">前导图标</Text>
              <Switch checked={withIcon} onChange={setWithIcon} />
            </Space>
            <Space direction="vertical" size={4}>
              <Text type="secondary">禁用</Text>
              <Switch checked={disabled} onChange={setDisabled} />
            </Space>
          </>
        ) : null}
      </Space>

      <Space direction="vertical" size="small">
        <div
          style={{
            padding: variant === "overlay" ? 24 : 0,
            background:
              variant === "overlay"
                ? "linear-gradient(135deg, #1a3a5c 0%, #0d1b2a 100%)"
                : undefined,
            borderRadius: 8,
            display: "inline-flex",
          }}
        >
          {isStatus ? (
            <SensTag variant="status" status={status} size={size}>
              {TAG_STATUS_LABEL[status]}
            </SensTag>
          ) : (
            <SensTag
              variant={variant}
              color={color}
              size={size}
              clickable={clickable}
              closable={closable}
              disabled={disabled}
              icon={withIcon ? <IconDefaultIcon /> : undefined}
              onClick={() => setClicks((n) => n + 1)}
              onClose={() => setClosed(true)}
            >
              标签文案
            </SensTag>
          )}
        </div>
        <Text type="secondary">
          {isStatus
            ? "状态标签：文案中性色、圆点状态色；仅进行中有外描边；无点击 / 移除 / 禁用"
            : clickable
              ? `点击次数 ${clicks}；悬停/点击切色（中性可点走冰绽蓝）`
              : "切换属性查看真实标签；可移除会从演示中拿掉"}
        </Text>
      </Space>
    </Space>
  );
}

export default function TagShowcasePage() {
  return (
    <ComponentShowcaseLayout
      title="标签 Tag"
      demo={<TagDemo />}
      matrix={<TagTypesPreview />}
      designDocSource={tagDevDoc}
      devDocSource={tagDevDoc}
    />
  );
}
