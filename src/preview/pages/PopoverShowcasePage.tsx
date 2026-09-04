import { useState } from "react";
import popoverDesignDoc from "../../design-system/components/base/popover.design.md?raw";
import popoverDevDoc from "../../design-system/components/base/popover.md?raw";
import { SensButton, SensPopover, type SensPopoverAlign, type SensPopoverPlacement, type SensPopoverSize } from "../../ui";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";

/** Figma 超长正文样张（孔雀东南飞节选），用于验证内容区滚动、标题/操作区钉住。 */
const LONG_POPOVER_BODY = (
  <>
    <p style={{ margin: 0 }}>正文文案</p>
    <p style={{ margin: "22px 0 0" }}>
      序曰：汉末建安中，庐江府小吏焦仲卿妻刘氏，为仲卿母所遣，自誓不嫁。其家逼之，乃投水而死。仲卿闻之，亦自缢于庭树。时人伤之，为诗云尔。
    </p>
    <p style={{ margin: "22px 0 0" }}>孔雀东南飞，五里一徘徊。</p>
    <p style={{ margin: "22px 0 0" }}>
      “十三能织素，十四学裁衣，十五弹箜篌，十六诵诗书。十七为君妇，心中常苦悲。君既为府吏，守节情不移，贱妾留空房，相见常日稀。鸡鸣入机织，夜夜不得息。三日断五匹，大人故嫌迟。非为织作迟，君家妇难为！妾不堪驱使，徒留无所施，便可白公姥，及时相遣归。”
    </p>
    <p style={{ margin: "22px 0 0" }}>
      府吏得闻之，堂上启阿母：“儿已薄禄相，幸复得此妇，结发同枕席，黄泉共为友。共事二三年，始尔未为久,女行无偏斜，何意致不厚？”
    </p>
    <p style={{ margin: "22px 0 0" }}>
      阿母谓府吏：“何乃太区区！此妇无礼节，举动自专由。吾意久怀忿，汝岂得自由！东家有贤女，自名秦罗敷，可怜体无比，阿母为汝求。便可速遣之，遣去慎莫留！”
    </p>
    <p style={{ margin: "22px 0 0" }}>府吏长跪告：“伏惟启阿母，今若遣此妇，终老不复取！”</p>
    <p style={{ margin: "22px 0 0" }}>
      阿母得闻之，槌床便大怒：“小子无所畏，何敢助妇语！吾已失恩义，会不相从许！”
    </p>
    <p style={{ margin: "22px 0 0" }}>
      府吏默无声，再拜还入户,举言谓新妇，哽咽不能语：“我自不驱卿，逼迫有阿母。卿但暂还家，吾今且报府。不久当归还，还必相迎取。以此下心意，慎勿违吾语。”
    </p>
    <p style={{ margin: "22px 0 0" }}>
      新妇谓府吏：“勿复重纷纭。往昔初阳岁，谢家来贵门。奉事循公姥，进止敢自专？昼夜勤作息，伶俜萦苦辛。谓言无罪过，供养卒大恩；仍更被驱遣，何言复来还！妾有绣腰襦，葳蕤自生光；红罗复斗帐，四角垂香囊；箱帘六七十，绿碧青丝绳，物物各自异，种种在其中。人贱物亦鄙，不足迎后人，留待作遗施，于今无会因。时时为安慰，久久莫相忘！”
    </p>
    <p style={{ margin: "22px 0 0" }}>
      鸡鸣外欲曙，新妇起严妆。著我绣夹裙，事事四五通。足下蹑丝履，头上玳瑁光。腰若流纨素，耳著明月珰。指如削葱根，口如含朱丹。纤纤作细步，精妙世无双。
    </p>
  </>
);

function LongPopoverActions({ size }: { size: SensPopoverSize }) {
  const actionSize = size === "small" ? "small" : "middle";
  return (
    <>
      <SensButton tone="secondary" size={actionSize}>
        二级按钮
      </SensButton>
      <SensButton size={actionSize}>一级按钮</SensButton>
    </>
  );
}

function PopoverDemo() {
  const [size, setSize] = useState<SensPopoverSize>("medium");
  const [placement, setPlacement] = useState<SensPopoverPlacement>("top");
  const [align, setAlign] = useState<SensPopoverAlign>("start");
  const [drill, setDrill] = useState(0);
  const actionSize = size === "small" ? "small" : "middle";

  return (
    <div className="sens-popover-demo">
      <div className="sens-popover-demo__controls" aria-label="气泡卡片尺寸">
        <div className="sens-popover-demo__control-group">
          <span className="sens-popover-demo__control-label">尺寸</span>
          {(["small", "medium", "large"] as const).map((option) => (
            <SensButton key={option} tone={size === option ? "primary" : "secondary"} size="small" onClick={() => setSize(option)}>
              {{ small: "小", medium: "中", large: "大" }[option]}
            </SensButton>
          ))}
        </div>
        <div className="sens-popover-demo__control-group">
          <span className="sens-popover-demo__control-label">方位</span>
          {(["top", "bottom", "left", "right"] as const).map((option) => (
            <SensButton key={option} tone={placement === option ? "primary" : "secondary"} size="small" onClick={() => setPlacement(option)}>
              {{ top: "上", bottom: "下", left: "左", right: "右" }[option]}
            </SensButton>
          ))}
        </div>
        <div className="sens-popover-demo__control-group">
          <span className="sens-popover-demo__control-label">箭头</span>
          {(["start", "center", "end"] as const).map((option) => (
            <SensButton key={option} tone={align === option ? "primary" : "secondary"} size="small" onClick={() => setAlign(option)}>
              {{ start: "起始", center: "居中", end: "末端" }[option]}
            </SensButton>
          ))}
        </div>
      </div>

      <div className="sens-popover-demo__stage">
        <SensPopover
          size={size}
          placement={placement}
          align={align}
          title={drill === 0 ? "标题" : "下钻详情"}
          content={
            drill === 0 ? (
              <div>
                正文文案。气泡卡片用于快速、轻量的浏览或操作；点击卡片外区域或按 Escape 关闭。
              </div>
            ) : (
              <div>当前是第 {drill + 1} 层内容。基础组件最多支持三层下钻。</div>
            )
          }
          actions={
            <>
              {drill > 0 ? (
                <SensButton tone="secondary" size={actionSize} onClick={() => setDrill(drill - 1)}>
                  返回
                </SensButton>
              ) : null}
              <SensButton tone="secondary" size={actionSize} onClick={() => setDrill(Math.min(2, drill + 1))}>
                下钻
              </SensButton>
              <SensButton size={actionSize}>确认</SensButton>
            </>
          }
        >
          <SensButton>打开气泡卡片</SensButton>
        </SensPopover>
      </div>

      <SensPopover
        variant="browse"
        size="small"
        title="浏览型卡片"
        content="浏览型气泡卡片不设主导操作，点击来源组件打开，点击外部关闭。"
      >
        <SensButton tone="secondary">浏览型示例</SensButton>
      </SensPopover>

      <div className="sens-popover-demo__long" aria-label="超长内容气泡卡片">
        <div className="sens-popover-demo__control-label">超长内容（标题 + 正文滚动 + 操作区钉住）</div>
        <div className="sens-popover-demo__long-row">
          {(["small", "medium", "large"] as const).map((option) => (
            <SensPopover
              key={option}
              size={option}
              placement="top"
              align="start"
              title="标题"
              content={<div>{LONG_POPOVER_BODY}</div>}
              actions={<LongPopoverActions size={option} />}
            >
              <SensButton tone="secondary">
                {{ small: "小 · 超长", medium: "中 · 超长", large: "大 · 超长" }[option]}
              </SensButton>
            </SensPopover>
          ))}
        </div>
      </div>

      <ConfirmPopoverDemo />
    </div>
  );
}

function ConfirmPopoverDemo() {
  const [size, setSize] = useState<"small" | "medium">("small");
  const [placement, setPlacement] = useState<SensPopoverPlacement>("top");
  const [align, setAlign] = useState<SensPopoverAlign>("start");
  const actionSize = size === "small" ? "small" : "middle";

  return (
    <div className="sens-popover-demo__long" aria-label="二次确认气泡卡片">
      <div className="sens-popover-demo__control-label">二次确认（警告标题 + 放弃 / 二级按钮；方位与普通型相同）</div>
      <div className="sens-popover-demo__controls" aria-label="二次确认尺寸与方位">
        <div className="sens-popover-demo__control-group">
          <span className="sens-popover-demo__control-label">尺寸</span>
          {(["small", "medium"] as const).map((option) => (
            <SensButton key={option} tone={size === option ? "primary" : "secondary"} size="small" onClick={() => setSize(option)}>
              {{ small: "小", medium: "中" }[option]}
            </SensButton>
          ))}
        </div>
        <div className="sens-popover-demo__control-group">
          <span className="sens-popover-demo__control-label">方位</span>
          {(["top", "bottom", "left", "right"] as const).map((option) => (
            <SensButton key={option} tone={placement === option ? "primary" : "secondary"} size="small" onClick={() => setPlacement(option)}>
              {{ top: "上", bottom: "下", left: "左", right: "右" }[option]}
            </SensButton>
          ))}
        </div>
        <div className="sens-popover-demo__control-group">
          <span className="sens-popover-demo__control-label">箭头</span>
          {(["start", "center", "end"] as const).map((option) => (
            <SensButton key={option} tone={align === option ? "primary" : "secondary"} size="small" onClick={() => setAlign(option)}>
              {{ start: "起始", center: "居中", end: "末端" }[option]}
            </SensButton>
          ))}
        </div>
      </div>
      <div className="sens-popover-demo__stage">
        <SensPopover
          variant="confirm"
          size={size}
          placement={placement}
          align={align}
          title="标题"
          content="正文文案"
          actions={
            <>
              <SensButton tone="dangerSecondary" size={actionSize}>
                放弃
              </SensButton>
              <SensButton tone="secondary" size={actionSize}>
                二级按钮
              </SensButton>
            </>
          }
        >
          <SensButton tone="secondary">打开二次确认</SensButton>
        </SensPopover>
      </div>
    </div>
  );
}

function PopoverMatrix({ variant = "action" }: { variant?: "action" | "confirm" }) {
  const placements: Array<{ key: SensPopoverPlacement; label: string }> = [
    { key: "top", label: "上方展开" },
    { key: "bottom", label: "下方展开" },
    { key: "left", label: "左侧展开" },
    { key: "right", label: "右侧展开" },
  ];
  const aligns: Array<{ key: SensPopoverAlign; label: string }> = [
    { key: "start", label: "起始" },
    { key: "center", label: "居中" },
    { key: "end", label: "末端" },
  ];
  return (
    <div className={["sens-popover-matrix", variant === "confirm" ? "sens-popover-matrix--confirm" : ""].filter(Boolean).join(" ")}>
      {placements.map(({ key: placement, label }) => (
        <div className="sens-popover-matrix__group" key={placement}>
          <div className="sens-popover-matrix__direction">{label}</div>
          {aligns.map(({ key: align, label: alignLabel }) => (
            <div className={`sens-popover-matrix__cell sens-popover-matrix__cell--${placement} sens-popover-matrix__cell--align-${align}`} key={align}>
              <SensPopover
                strategy="anchored"
                open
                variant={variant}
                size="small"
                placement={placement}
                align={align}
                title="标题"
                content="正文文案"
                actions={variant === "confirm" ? <><SensButton tone="dangerSecondary" size="small">放弃</SensButton><SensButton tone="secondary" size="small">二级按钮</SensButton></> : undefined}
              >
                <span className="sens-popover-matrix__trigger">
                  <SensButton tone="secondary" size="small">触发器</SensButton>
                  <span>箭头{alignLabel}</span>
                </span>
              </SensPopover>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function PopoverShowcasePage() {
  return (
    <ComponentShowcaseLayout
      title="气泡卡片 Popover"
      demo={<PopoverDemo />}
      matrix={<><PopoverMatrix /><div className="sens-popover-matrix__title">二次确认 · 方位矩阵</div><PopoverMatrix variant="confirm" /></>}
      designDocSource={popoverDesignDoc}
      devDocSource={popoverDevDoc}
    />
  );
}
