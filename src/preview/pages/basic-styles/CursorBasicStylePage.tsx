import { Alert, Space, Tag, Typography } from "antd";
import cursorDocSource from "../../../../docs/foundations/cursor.md?raw";
import {
  SENS_CURSOR_PRIMARY,
  SENS_CURSORS,
  type SensCursorName,
} from "../../../design-system/cursors";
import { BasicStylePageLayout } from "./BasicStylePageLayout";
import { getPreviewTokens } from "../../previewTokens";

const { Text, Title } = Typography;

type CursorGroup = (typeof SENS_CURSORS)[SensCursorName]["group"];

const GROUP_ORDER: CursorGroup[] = ["default", "state", "select", "move", "resize"];

const GROUP_LABEL: Record<CursorGroup, string> = {
  default: "默认",
  state: "状态",
  select: "选择",
  move: "移动",
  resize: "调整尺寸",
};

function cursorsInGroup(group: CursorGroup, primaryOnly: boolean): SensCursorName[] {
  return (Object.keys(SENS_CURSORS) as SensCursorName[]).filter((name) => {
    const def = SENS_CURSORS[name];
    if (def.group !== group) return false;
    if (primaryOnly && !def.primary) return false;
    return true;
  });
}

function CursorHotspot({ name }: { name: SensCursorName }) {
  const token = getPreviewTokens();
  const def = SENS_CURSORS[name];
  const isMove = name === "move";

  return (
    <div
      className={def.className}
      style={{
        minHeight: 148,
        padding: token.paddingMD,
        border: `1px solid ${isMove ? token.colorPrimary : token.colorBorderSecondary}`,
        borderRadius: token.borderRadius,
        background: token.colorBgContainer,
        display: "flex",
        flexDirection: "column",
        gap: token.marginSM,
        outline: isMove ? `1px solid ${token.colorPrimary}` : undefined,
      }}
    >
      <div
        style={{
          flex: 1,
          minHeight: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: token.marginSM,
          /* 示意热区不铺底，避免图标后出现浅色白块 */
          userSelect: "none",
        }}
      >
        {def.illustration ? (
          <img
            src={def.illustration}
            alt=""
            width={32}
            height={32}
            draggable={false}
            style={{
              // 资源为 64@2x，CSS 显示 32；WebKit 用 optimize-contrast 略锐化
              imageRendering: "-webkit-optimize-contrast" as "auto",
              pointerEvents: "none",
            }}
          />
        ) : null}
        <Text style={{ fontSize: 13, color: token.colorText }}>
          移入本卡 → 系统光标 {def.cssValue}
        </Text>
      </div>
      <Space direction="vertical" size={2} style={{ width: "100%" }}>
        <Space wrap size={[4, 4]}>
          <Text strong>{def.labelZh}</Text>
          {def.primary ? <Tag>主验</Tag> : <Tag>次要</Tag>}
          {isMove ? <Tag color="green">页签拖拽使用</Tag> : null}
        </Space>
        <Text style={{ fontSize: 12, lineHeight: 1.5, color: token.colorTextSecondary }}>
          {def.description}
        </Text>
        <Text code>cursor: {def.cssValue}</Text>
        <Text style={{ fontSize: 12, color: token.colorTextSecondary }}>
          .{def.className} · {def.cssVar}
        </Text>
        <Text style={{ fontSize: 12, color: token.colorTextSecondary }}>
          规则参考 {def.figma} · 左图 64@2x 示意，非真实光标
        </Text>
      </Space>
    </div>
  );
}

function CursorGroupSection({
  group,
  primaryOnly,
}: {
  group: CursorGroup;
  primaryOnly: boolean;
}) {
  const token = getPreviewTokens();
  const names = cursorsInGroup(group, primaryOnly);
  if (names.length === 0) return null;

  return (
    <div>
      <Title level={5} style={{ marginTop: 0, marginBottom: token.marginSM }}>
        {GROUP_LABEL[group]}
        <Text type="secondary" style={{ marginLeft: token.marginSM, fontSize: 13, fontWeight: 400 }}>
          {names.length} 态
        </Text>
      </Title>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: token.marginMD,
        }}
      >
        {names.map((name) => (
          <CursorHotspot key={name} name={name} />
        ))}
      </div>
    </div>
  );
}

function CursorSpecimen() {
  const primaryCount = SENS_CURSOR_PRIMARY.length;

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginTop: 0 }}>
          鼠标态走查矩阵
        </Title>
        <Text type="secondary">
          规则按 SensD；实现为<strong>系统光标</strong>。移入热区验收 OS
          原生指针（不应出现自定义 PNG 贴图感）。卡片左侧图仅为规则示意。
        </Text>
      </div>

      <Alert
        type="info"
        showIcon
        message="走查要点"
        description={
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li>
              hover 后应为系统 <Text code>cursor</Text> 关键字（如{" "}
              <Text code>move</Text>），外形随操作系统。
            </li>
            <li>
              <Text code>move</Text> ≠ <Text code>grab</Text>：换位用 move，视图平移用
              grab / grabbing。
            </li>
            <li>
              <Text code>move</Text> 标「页签拖拽使用」；对照{" "}
              <Text code>/components/tabs</Text>。
            </li>
            <li>主验优先下面 {primaryCount} 态；次要态语义同样用系统关键字。</li>
          </ul>
        }
      />

      <div>
        <Title level={4} style={{ marginTop: 0 }}>
          主验 8 态
        </Title>
        {GROUP_ORDER.map((group) => (
          <div key={`primary-${group}`} style={{ marginBottom: 24 }}>
            <CursorGroupSection group={group} primaryOnly />
          </div>
        ))}
      </div>

      <div>
        <Title level={4} style={{ marginTop: 0 }}>
          次要态
        </Title>
        {GROUP_ORDER.map((group) => {
          const secondary = cursorsInGroup(group, false).filter(
            (n) => !SENS_CURSORS[n].primary,
          );
          if (secondary.length === 0) return null;
          return (
            <div key={`secondary-${group}`} style={{ marginBottom: 24 }}>
              <Title level={5} style={{ marginTop: 0 }}>
                {GROUP_LABEL[group]}
                <Text type="secondary" style={{ marginLeft: 8, fontSize: 13, fontWeight: 400 }}>
                  {secondary.length} 态
                </Text>
              </Title>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: 16,
                }}
              >
                {secondary.map((name) => (
                  <CursorHotspot key={name} name={name} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Space>
  );
}

export default function CursorBasicStylePage() {
  return (
    <BasicStylePageLayout
      title="鼠标 / Cursor"
      description="SensD 鼠标使用规则 + 系统光标实现。hover 热区切换原生 cursor；示意 PNG 不参与真实指针。"
      designDocSource={cursorDocSource}
      specimen={<CursorSpecimen />}
    />
  );
}
