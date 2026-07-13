import { useState } from "react";
import { Space, Switch, Typography } from "antd";
import alertDevDoc from "../../design-system/components/base/alert.md?raw";
import {
  ALERT_TYPE_LABEL,
  AlertTypesPreview,
  SensAlert,
  SensButton,
  type AlertType,
} from "../../ui";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";
import { ShowcaseSelect } from "../ShowcaseSelect";

const { Text } = Typography;

const TYPE_OPTIONS: { value: AlertType; label: string }[] = (
  Object.keys(ALERT_TYPE_LABEL) as AlertType[]
).map((value) => ({ value, label: ALERT_TYPE_LABEL[value] }));

function AlertDemo() {
  const [type, setType] = useState<AlertType>("default");
  const [closable, setClosable] = useState(false);
  const [withLink, setWithLink] = useState(false);
  const [withDescription, setWithDescription] = useState(false);
  const [closed, setClosed] = useState(false);

  if (closed) {
    return (
      <Space direction="vertical" size="middle">
        <Text type="secondary">警告条已关闭</Text>
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
          <Text type="secondary">类型</Text>
          <ShowcaseSelect value={type} onChange={setType} options={TYPE_OPTIONS} style={{ width: 140 }} />
        </Space>
        <Space direction="vertical" size={4}>
          <Text type="secondary">辅助文案</Text>
          <Switch checked={withDescription} onChange={setWithDescription} />
        </Space>
        <Space direction="vertical" size={4}>
          <Text type="secondary">可关闭</Text>
          <Switch checked={closable} onChange={setClosable} />
        </Space>
        <Space direction="vertical" size={4}>
          <Text type="secondary">链接按钮</Text>
          <Switch checked={withLink} onChange={setWithLink} />
        </Space>
      </Space>

      <Space direction="vertical" size="small" style={{ width: "100%", maxWidth: 480 }}>
        <SensAlert
          type={type}
          closable={closable}
          onClose={() => setClosed(true)}
          description={
            withDescription ? "这是辅助说明文案，用于补充标题信息。" : undefined
          }
          link={
            withLink ? (
              <SensButton tone="link" size="small">
                查看详情
              </SensButton>
            ) : undefined
          }
        >
          {ALERT_TYPE_LABEL[type]}提示标题
        </SensAlert>
        <Text type="secondary">浅底 + 浅描边；常规走链接色链；关闭后可恢复</Text>
      </Space>
    </Space>
  );
}

export default function AlertShowcasePage() {
  return (
    <ComponentShowcaseLayout
      title="警告 Alert"
      demo={<AlertDemo />}
      matrix={<AlertTypesPreview />}
      designDocSource={alertDevDoc}
      devDocSource={alertDevDoc}
    />
  );
}
