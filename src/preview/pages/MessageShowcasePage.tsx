import { useState } from "react";
import { Space, Switch, Typography } from "antd";
import messageDevDoc from "../../design-system/components/base/message.md?raw";
import {
  MESSAGE_TYPE_LABEL,
  MessageTypesPreview,
  SensButton,
  SensMessage,
  type MessageType,
} from "../../ui";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";
import { ShowcaseSelect } from "../ShowcaseSelect";

const { Text } = Typography;

const TYPE_OPTIONS: { value: MessageType; label: string }[] = (
  Object.keys(MESSAGE_TYPE_LABEL) as MessageType[]
).map((value) => ({ value, label: MESSAGE_TYPE_LABEL[value] }));

function MessageDemo() {
  const [type, setType] = useState<MessageType>("default");
  const [closable, setClosable] = useState(false);
  const [withLink, setWithLink] = useState(false);
  const [closed, setClosed] = useState(false);

  if (closed) {
    return (
      <Space direction="vertical" size="middle">
        <Text type="secondary">轻提示已关闭</Text>
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
          <Text type="secondary">可关闭</Text>
          <Switch checked={closable} onChange={setClosable} />
        </Space>
        <Space direction="vertical" size={4}>
          <Text type="secondary">链接按钮</Text>
          <Switch checked={withLink} onChange={setWithLink} />
        </Space>
      </Space>

      <Space direction="vertical" size="small">
        <SensMessage
          type={type}
          closable={closable}
          onClose={() => setClosed(true)}
          link={
            withLink ? (
              <SensButton tone="link" size="small">
                查看详情
              </SensButton>
            ) : undefined
          }
        >
          {MESSAGE_TYPE_LABEL[type]}提示文案
        </SensMessage>
        <Text type="secondary">白底 + D4↓；切换类型查看图标色；关闭后可恢复</Text>
      </Space>
    </Space>
  );
}

export default function MessageShowcasePage() {
  return (
    <ComponentShowcaseLayout
      title="轻提示 Message"
      demo={<MessageDemo />}
      matrix={<MessageTypesPreview />}
      designDocSource={messageDevDoc}
      devDocSource={messageDevDoc}
    />
  );
}
