import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Space, Switch, Typography } from "antd";
import messageDevDoc from "../../design-system/components/base/message.md?raw";
import { getUnitToken } from "../../design-system/unit";
import {
  MESSAGE_TYPE_LABEL,
  MessageTypesPreview,
  SensButton,
  SensMessage,
  SensMessageLink,
  SensMessageProvider,
  useSensMessage,
  type MessageType,
} from "../../ui";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";
import { getPreviewTokens } from "../previewTokens";
import { ShowcaseSelect } from "../ShowcaseSelect";

const { Text } = Typography;

const TYPE_OPTIONS: { value: MessageType; label: string }[] = (
  Object.keys(MESSAGE_TYPE_LABEL) as MessageType[]
).map((value) => ({ value, label: MESSAGE_TYPE_LABEL[value] }));

const stackGap = getUnitToken("spacing/vertical/4x");

function messageDemoPanelStyle(): CSSProperties {
  const token = getPreviewTokens();
  return {
    position: "relative",
    minHeight: 136,
    overflow: "hidden",
    padding: token.padding,
    borderRadius: token.borderRadiusLG,
    border: `${token.lineWidth}px solid ${token.colorBorderSecondary}`,
    background: token.colorBgLayout,
  };
}

function RuleSample({
  title,
  description,
  children,
}: {
  title: string;
  description: ReactNode;
  children: ReactNode;
}) {
  const token = getPreviewTokens();
  return (
    <Space direction="vertical" size="small" style={{ width: "100%" }}>
      <Space direction="vertical" size={2}>
        <Text strong>{title}</Text>
        <Text type="secondary">{description}</Text>
      </Space>
      {children}
      <div
        style={{
          height: token.lineWidth,
          background: token.colorBorderSecondary,
        }}
      />
    </Space>
  );
}

function MessageAutoDismissDemo() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) return undefined;
    const timer = window.setTimeout(() => setVisible(false), 3000);
    return () => window.clearTimeout(timer);
  }, [visible]);

  return (
    <Space direction="vertical" size="small">
      <Space align="center" size="small">
        {visible ? (
          <SensMessage type="success">创建成功，轻提示将在 3 秒后自动消失</SensMessage>
        ) : (
          <Text type="secondary">结果类轻提示已按 3s 规则消失</Text>
        )}
      </Space>
      <SensButton tone="tertiary" size="small" onClick={() => setVisible(true)}>
        重新触发
      </SensButton>
    </Space>
  );
}

function MessageStackDemo() {
  const token = getPreviewTokens();

  return (
    <div style={messageDemoPanelStyle()} aria-label="轻提示顶部居中堆叠样张">
      <div
        style={{
          position: "absolute",
          insetBlockStart: token.padding,
          insetInline: token.padding,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: stackGap,
        }}
      >
        <SensMessage type="success">最新：刷新成功</SensMessage>
        <SensMessage type="default">上一条：创建计划成功</SensMessage>
      </div>
    </div>
  );
}

function MessageSpecialSceneDemo() {
  const [showLongReading, setShowLongReading] = useState(true);
  const [showActionGuide, setShowActionGuide] = useState(true);
  const closedAll = !showLongReading && !showActionGuide;

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      {showLongReading ? (
        <SensMessage type="info" closable onClose={() => setShowLongReading(false)}>
          文案复杂、需要用户阅读理解时，可延长停留时间，但必须提供关闭入口
        </SensMessage>
      ) : null}
      {showActionGuide ? (
        <SensMessage
          type="warning"
          closable
          onClose={() => setShowActionGuide(false)}
          link={
            <SensMessageLink>去处理</SensMessageLink>
          }
        >
          当前配置存在风险，请完成关键操作后再继续
        </SensMessage>
      ) : null}
      {closedAll ? (
        <Space direction="vertical" size={4}>
          <Text type="secondary">特殊场景轻提示已关闭</Text>
          <SensButton
            tone="tertiary"
            size="small"
            onClick={() => {
              setShowLongReading(true);
              setShowActionGuide(true);
            }}
          >
            恢复特殊场景
          </SensButton>
        </Space>
      ) : null}
    </Space>
  );
}

function RuntimeQueueActions() {
  const message = useSensMessage();
  const loadingCloseRef = useRef<(() => void) | null>(null);

  return (
    <Space wrap size="small">
      <SensButton
        tone="secondary"
        size="small"
        onClick={() => message.success("运行时：创建成功")}
      >
        成功
      </SensButton>
      <SensButton
        tone="secondary"
        size="small"
        onClick={() => message.warning("运行时：删除失败")}
      >
        警告
      </SensButton>
      <SensButton
        tone="secondary"
        size="small"
        onClick={() => {
          loadingCloseRef.current?.();
          loadingCloseRef.current = message.loading("运行时：加载中");
        }}
      >
        加载
      </SensButton>
      <SensButton
        tone="secondary"
        size="small"
        onClick={() => {
          loadingCloseRef.current?.();
          loadingCloseRef.current = null;
          message.success("运行时：加载完成");
        }}
      >
        结束加载
      </SensButton>
      <SensButton
        tone="secondary"
        size="small"
        onClick={() =>
          message.open({
            type: "warning",
            content: "运行时：当前配置存在风险，请处理后继续",
            link: <SensMessageLink>去处理</SensMessageLink>,
            closable: true,
            duration: null,
          })
        }
      >
        持久提示
      </SensButton>
      <SensButton tone="tertiary" size="small" onClick={() => message.destroy()}>
        清空
      </SensButton>
    </Space>
  );
}

function MessageRuntimeQueueDemo() {
  return (
    <SensMessageProvider>
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <RuntimeQueueActions />
        <Text type="secondary">
          点击后在当前页面顶部居中出现；结果类默认 3s 消失，加载态需手动结束，持久提示必须可关闭。
        </Text>
      </Space>
    </SensMessageProvider>
  );
}

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
      <RuleSample
        title="标准轻提示"
        description="状态图标 + 文案；结果类默认 3 秒自动消失；这里保留可切换样张，方便核对五种类型。"
      >
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
              <Text type="secondary">链接按钮（常规）</Text>
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
                  <SensMessageLink>查看详情</SensMessageLink>
                ) : undefined
              }
            >
              {MESSAGE_TYPE_LABEL[type]}提示文案
            </SensMessage>
            <Text type="secondary">白底 + D4↓；切换类型查看图标色；关闭后可恢复</Text>
          </Space>
        </Space>
      </RuleSample>

      <RuleSample
        title="3 秒消失规则"
        description="结果类轻提示默认自动消失；加载类应在流程结束并拿到结果后消失。"
      >
        <MessageAutoDismissDemo />
      </RuleSample>

      <RuleSample
        title="顶部居中 + 堆叠规则"
        description="短时间内多条消息允许堆叠，最新在上方，消息间距 16px。"
      >
        <MessageStackDemo />
      </RuleSample>

      <RuleSample
        title="特殊场景"
        description="长阅读提示必须可关闭；引导用户执行关键操作时取消自动消失，并提供关闭入口。"
      >
        <MessageSpecialSceneDemo />
      </RuleSample>

      <RuleSample
        title="P1 运行时队列"
        description="页面级 Provider / hook 调用，不接 antd.message，不跨页面挂全局。"
      >
        <MessageRuntimeQueueDemo />
      </RuleSample>
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
