import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Typography, theme } from "antd";

const { Title, Paragraph, Text } = Typography;

export interface DesignSystemDocProps {
  source: string;
}

export function DesignSystemDoc({ source }: DesignSystemDocProps) {
  const { token } = theme.useToken();

  const components: Components = {
    h1: ({ children }) => (
      <Title level={3} style={{ marginTop: token.marginLG, marginBottom: token.marginSM }}>
        {children}
      </Title>
    ),
    h2: ({ children }) => (
      <Title level={4} style={{ marginTop: token.marginMD, marginBottom: token.marginXS }}>
        {children}
      </Title>
    ),
    h3: ({ children }) => (
      <Title level={5} style={{ marginTop: token.marginSM, marginBottom: token.marginXS }}>
        {children}
      </Title>
    ),
    p: ({ children }) => (
      <Paragraph style={{ marginBottom: token.marginSM, color: token.colorText }}>
        {children}
      </Paragraph>
    ),
    ul: ({ children }) => (
      <ul style={{ margin: `0 0 ${token.marginSM}px`, paddingLeft: token.paddingLG, color: token.colorText }}>
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol style={{ margin: `0 0 ${token.marginSM}px`, paddingLeft: token.paddingLG, color: token.colorText }}>
        {children}
      </ol>
    ),
    li: ({ children }) => <li style={{ marginBottom: token.marginXXS }}>{children}</li>,
    blockquote: ({ children }) => (
      <blockquote
        style={{
          margin: `0 0 ${token.marginSM}px`,
          padding: `${token.paddingXS}px ${token.paddingMD}px`,
          borderLeft: `3px solid ${token.colorPrimary}`,
          background: token.colorFillAlter,
          color: token.colorTextSecondary,
        }}
      >
        {children}
      </blockquote>
    ),
    code: ({ className, children }) => {
      const isBlock = className?.includes("language-");
      if (isBlock) {
        return (
          <pre
            style={{
              margin: `0 0 ${token.marginSM}px`,
              padding: token.paddingSM,
              background: token.colorFillQuaternary,
              borderRadius: token.borderRadius,
              overflow: "auto",
              fontSize: token.fontSizeSM,
            }}
          >
            <code style={{ fontFamily: token.fontFamilyCode, color: token.colorText }}>{children}</code>
          </pre>
        );
      }
      return (
        <Text
          code
          style={{
            fontSize: token.fontSizeSM,
            background: token.colorFillQuaternary,
            padding: `0 ${token.paddingXXS}px`,
          }}
        >
          {children}
        </Text>
      );
    },
    table: ({ children }) => (
      <div style={{ overflowX: "auto", marginBottom: token.marginSM }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: token.fontSizeSM,
            color: token.colorText,
          }}
        >
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => <thead style={{ background: token.colorFillAlter }}>{children}</thead>,
    th: ({ children }) => (
      <th
        style={{
          border: `1px solid ${token.colorBorderSecondary}`,
          padding: `${token.paddingXS}px ${token.paddingSM}px`,
          textAlign: "left",
          fontWeight: token.fontWeightStrong,
        }}
      >
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td
        style={{
          border: `1px solid ${token.colorBorderSecondary}`,
          padding: `${token.paddingXS}px ${token.paddingSM}px`,
          verticalAlign: "top",
        }}
      >
        {children}
      </td>
    ),
    hr: () => (
      <hr
        style={{
          border: "none",
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          margin: `${token.marginMD}px 0`,
        }}
      />
    ),
    strong: ({ children }) => <Text strong>{children}</Text>,
  };

  return (
    <div style={{ maxWidth: "100%" }}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {source}
      </ReactMarkdown>
    </div>
  );
}
