import { useState } from "react";
import { Typography } from "antd";
import tipsDesignDoc from "../../design-system/components/base/tips.design.md?raw";
import tipsDevDoc from "../../design-system/components/base/tips.md?raw";
import { SensIcon } from "../../design-system/icons";
import {
  buildSensTipsTokenVars,
  SensButton,
  SensTips,
  TipsStatesPreview,
  type SensTipsAlign,
  type SensTipsPlacement,
} from "../../ui";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";
import { ShowcaseSelect } from "../ShowcaseSelect";

const { Text } = Typography;

const PLACEMENT_OPTIONS: { value: SensTipsPlacement; label: string }[] = [
  { value: "top", label: "上" },
  { value: "bottom", label: "下" },
  { value: "left", label: "左" },
  { value: "right", label: "右" },
];

const ALIGN_OPTIONS_HORIZONTAL: { value: SensTipsAlign; label: string }[] = [
  { value: "start", label: "左" },
  { value: "center", label: "中" },
  { value: "end", label: "右" },
];

const ALIGN_OPTIONS_VERTICAL: { value: SensTipsAlign; label: string }[] = [
  { value: "start", label: "上" },
  { value: "center", label: "中" },
  { value: "end", label: "下" },
];

const TIP_SHORT = "短文案";
const TIP_MAX_WIDTH =
  "这是一段需要撑满最大宽度 300 的说明文案，用于验收横向换行与自适应宽度上限；不足 300 时应随文案变窄。";
const TIP_OVERFLOW =
  "第1行：超高便签验收用长文案。\n第2行：最高 10.5 行（行高 22），超出内滚。\n第3行：滚动条拇指宽 6、圆角 radius/s、白 80%。\n第4行：保持横向排版，不竖排。\n第5行：内容区随文案增高直至上限。\n第6行：外框最大宽 300。\n第7行：左右 padding 10。\n第8行：上下 padding 6。\n第9行：背景 tooltip-background。\n第10行：字色 white。\n第11行：本行起应出现滚动。\n第12行：继续向下滚动可见。\n第13行：末行确认可滚到底。";

function TipsDemo() {
  const [placement, setPlacement] = useState<SensTipsPlacement>("top");
  const [align, setAlign] = useState<SensTipsAlign>("center");
  const isSide = placement === "left" || placement === "right";
  const alignOptions = isSide ? ALIGN_OPTIONS_VERTICAL : ALIGN_OPTIONS_HORIZONTAL;

  return (
    <div className="sens-tips-demo" style={buildSensTipsTokenVars()}>
      <div className="sens-tips-demo-controls">
        <label className="sens-tips-demo-field">
          <span className="sens-tips-demo-label">方向</span>
          <ShowcaseSelect
            value={placement}
            onChange={setPlacement}
            options={PLACEMENT_OPTIONS}
            style={{ width: 120 }}
          />
        </label>
        <label className="sens-tips-demo-field">
          <span className="sens-tips-demo-label">箭头对齐</span>
          <ShowcaseSelect
            value={align}
            onChange={setAlign}
            options={alignOptions}
            style={{ width: 120 }}
          />
        </label>
      </div>

      <div className="sens-tips-demo-stage">
        <SensTips title="这是一段帮助信息" placement={placement} align={align}>
          <span
            className="sens-cursor-default sens-tips-demo-help-trigger"
            tabIndex={0}
            aria-label="帮助说明"
          >
            <SensIcon name="help" sizeToken="size/icon/m" color="currentColor" />
          </span>
        </SensTips>

        <SensTips title="下载用户列表" placement={placement} align={align}>
          <span className="sens-tips-demo-help-trigger">
            <SensButton tone="secondary">下载</SensButton>
          </span>
        </SensTips>

        <SensTips title="最多只能创建 500 个标签" placement={placement} align={align}>
          <span
            className="sens-tips-demo-disabled-trigger"
            tabIndex={0}
            aria-label="创建不可用：最多只能创建 500 个标签"
          >
            <SensButton tone="secondary" disabled>
              创建
            </SensButton>
          </span>
        </SensTips>

        <SensTips title={TIP_SHORT} placement={placement} align={align}>
          <span className="sens-tips-demo-help-trigger">
            <SensButton tone="secondary">短文</SensButton>
          </span>
        </SensTips>

        <SensTips title={TIP_MAX_WIDTH} placement={placement} align={align}>
          <span className="sens-tips-demo-help-trigger">
            <SensButton tone="secondary">满宽</SensButton>
          </span>
        </SensTips>

        <SensTips title={TIP_OVERFLOW} placement={placement} align={align}>
          <span className="sens-tips-demo-help-trigger">
            <SensButton tone="secondary">超高可滚</SensButton>
          </span>
        </SensTips>

        <SensTips title={TIP_MAX_WIDTH} placement={placement} align={align}>
          <span className="sens-tips-demo-ellipsis">
            最近一个月下单时间过长截断示例
          </span>
        </SensTips>

        <SensTips title="宽触发源：悬左段→上左，悬中→上中，悬右→上右" placement="top">
          <button
            type="button"
            className="sens-cursor-default sens-tips-demo-wide-trigger"
            data-testid="tips-wide-trigger"
          >
            宽触发源（≥300）· 悬停前 / 中 / 后 1/3 验收分段对齐
          </button>
        </SensTips>
      </div>

      <div className="sens-tips-demo-edge-row" data-testid="tips-edge-row">
        <SensTips title="贴顶应换向（上装不下 → 下/左/右）" placement="top" align="center">
          <button
            type="button"
            className="sens-cursor-default sens-tips-demo-edge-trigger"
            data-testid="tips-edge-trigger"
          >
            贴顶避让
          </button>
        </SensTips>
        <Text className="sens-tips-demo-note">
          将本行滚到视口顶附近再悬停：优先试上，装不下则按上→左→右→下换向。
        </Text>
      </div>

      <Text className="sens-tips-demo-note">
        悬停 / 聚焦触发源：延迟 0.1s 出现；离开立即消失。placement × align = 12
        向。portal 默认自动避让（先试所选方向，再上→左→右→下）；触发源宽 ≥300
        按指针前/中/后 1/3 就近对齐。最大宽 300（不足随文案变窄）；最高 10.5
        行，超出内滚。常规便签仅纯文案；Sens 自持浮层。
      </Text>
    </div>
  );
}

export default function TipsShowcasePage() {
  return (
    <ComponentShowcaseLayout
      title="便签 Tips"
      demo={<TipsDemo />}
      matrix={<TipsStatesPreview />}
      designDocSource={tipsDesignDoc}
      devDocSource={tipsDevDoc}
    />
  );
}
