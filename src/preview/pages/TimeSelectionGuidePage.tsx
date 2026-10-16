import { useState, type CSSProperties, type ReactNode } from "react";
import { buildActiveRingShadow, getColorToken, tokenRgba } from "../../design-system/color-utils";
import { getDividerColor, getDividerHairlineWidth } from "../../design-system/divider";
import { SensIcon } from "../../design-system/icons";
import { getTypographyToken } from "../../design-system/typography";
import { getUnitToken } from "../../design-system/unit";
import {
  SensTimeSelection,
  type SensTimeSelectionMode,
  type SensTimeSelectionValue,
} from "../../ui";
import "./time-selection-guide.css";

const px = (value: number) => `${value}px`;

const STATIC_SAMPLE: SensTimeSelectionValue = {
  mode: "static",
  presetKey: "custom",
  range: { start: "2023-08-11", end: "2023-09-20", startTime: "00:00:00", endTime: "12:59:59" },
};

const DYNAMIC_SAMPLE: SensTimeSelectionValue = {
  mode: "dynamic",
  presetKey: "past-7",
  tag: "过去 7 天",
  range: { start: "2023-09-13", end: "2023-09-19" },
};

function guideVars(): CSSProperties {
  return {
    "--tg-bg": getColorToken("background-transparent-grey"),
    "--tg-white": getColorToken("white"),
    "--tg-text": tokenRgba("text-color-transparent", 0.9),
    "--tg-sub": tokenRgba("text-sub-color-transparent", 0.58),
    "--tg-disabled": tokenRgba("text-color-transparent-disable", 0.3),
    "--tg-link": getColorToken("link-color"),
    "--tg-active": getColorToken("component-active"),
    "--tg-tag-bg": getColorToken("background-01-transparent"),
    "--tg-line": getDividerColor("light", "transparent"),
    "--tg-line-width": px(getDividerHairlineWidth()),
    "--tg-radius": px(getUnitToken("radius/l")),
    "--tg-small-radius": px(getUnitToken("radius/s")),
    "--tg-padding": px(getUnitToken("spacing/vertical/7x")),
    "--tg-gap": px(getUnitToken("spacing/vertical/4x")),
    "--tg-title-size": px(getTypographyToken("font-size/xxl")),
    "--tg-title-line": px(getTypographyToken("line-height/xxl")),
    "--tg-heading-size": px(getTypographyToken("font-size/l")),
    "--tg-heading-line": px(getTypographyToken("line-height/l")),
    "--tg-body-size": px(getTypographyToken("font-size/m")),
    "--tg-body-line": px(getTypographyToken("line-height/m")),
    "--tg-small-size": px(getTypographyToken("font-size/s")),
    "--tg-small-line": px(getTypographyToken("line-height/s")),
    "--tg-weight": getTypographyToken("font-weight/semibold"),
    "--tg-medium-weight": getTypographyToken("font-weight/medium"),
    "--tg-small-height": px(getUnitToken("size/component-height/s")),
    "--tg-active-ring": buildActiveRingShadow("component-active-shadow"),
  } as CSSProperties;
}

function DisplaySample({ children }: { children: ReactNode }) {
  return <div className="tg-display-sample">{children}</div>;
}

function TimeText({ children }: { children: string }) {
  return <span className="tg-time-text">{children}</span>;
}

function DisabledExamples() {
  return <section className="tg-section" aria-labelledby="tg-disabled-title">
    <div className="tg-section-heading">
      <h2 id="tg-disabled-title">禁用状态</h2>
      <p>禁用入口不可打开面板；悬停时只呈现中性禁用反馈。</p>
    </div>
    <div className="tg-disabled-examples">
      <article><h3>未选择</h3><SensTimeSelection disabled /></article>
      <article><h3>静态日期时间区间</h3><SensTimeSelection disabled value={STATIC_SAMPLE} /></article>
      <article><h3>动态日期区间</h3><SensTimeSelection disabled value={DYNAMIC_SAMPLE} /></article>
    </div>
  </section>;
}

export default function TimeSelectionGuidePage() {
  const [openPicker, setOpenPicker] = useState<SensTimeSelectionMode | null>(null);
  const setPickerOpen = (mode: SensTimeSelectionMode) => (open: boolean) => setOpenPicker(open ? mode : null);

  return <main className="tg-page" style={guideVars()}>
    <header className="tg-header">
      <span>Composite / Time Selection</span>
      <h1>时间选择</h1>
      <p>用于高保真原型中的固定时间、动态周期和单日选择。当前为原型级运行时组件，不替代研发侧生产日期组件。</p>
    </header>
    <div className="tg-status">Prototype Kit 0.9.1 · Pilot · Implemented · Verified</div>

    <section className="tg-section" aria-labelledby="tg-examples-title">
      <div className="tg-section-heading"><h2 id="tg-examples-title">静态时间与动态时间</h2><p>日期取自设计稿，只用于说明交互和展示形式，不代表当前实时日期。</p></div>
      <div className="tg-examples">
        <article className="tg-example">
          <div className="tg-example-heading"><span>01</span><h3>静态时间 · 固定范围</h3></div>
          <p>适合不会随当前日期滚动的明确区间；草稿只有点击「完成」后才会上屏。</p>
          <div className="tg-component-demo"><SensTimeSelection defaultMode="static" open={openPicker === "static"} onOpenChange={setPickerOpen("static")} /></div>
        </article>
        <article className="tg-example">
          <div className="tg-example-heading"><span>02</span><h3>动态时间 · 相对范围</h3></div>
          <p>适合会随当前日期变化的周期；结果同时展示相对标签和解析日期。</p>
          <div className="tg-component-demo"><SensTimeSelection defaultMode="dynamic" open={openPicker === "dynamic"} onOpenChange={setPickerOpen("dynamic")} /></div>
        </article>
      </div>
    </section>

    <section className="tg-section" aria-labelledby="tg-display-states-title">
      <div className="tg-section-heading"><h2 id="tg-display-states-title">日期与时间展示状态</h2><p>按业务粒度选择日期、区间、动态周期或时刻；灰色摘要条统一为 28px 高。</p></div>
      <div className="tg-display-states">
        <article><h3>未选择 · 时分秒</h3><DisplaySample><span className="tg-display-placeholder">日期未选择</span><TimeText>00:00:00</TimeText></DisplaySample></article>
        <article><h3>单日期 · 时分秒</h3><DisplaySample><span>2023-09-20</span><TimeText>00:00:00</TimeText></DisplaySample></article>
        <article><h3>固定日期区间</h3><DisplaySample><span>2023-08-11</span><SensIcon name="arrow-right" sizeToken="size/icon/m" colorRole="subtle" /><span>2023-09-20</span></DisplaySample></article>
        <article><h3>固定日期时间区间</h3><DisplaySample><span>2023-08-11</span><TimeText>00:00:00</TimeText><SensIcon name="arrow-right" sizeToken="size/icon/m" colorRole="subtle" /><span>2023-09-20</span><TimeText>12:59:59</TimeText></DisplaySample></article>
        <article><h3>动态单日</h3><DisplaySample><span className="tg-relative-tag">今天</span><span>2023-09-20</span></DisplaySample></article>
        <article><h3>动态日期区间</h3><DisplaySample><span className="tg-relative-tag">过去 7 天</span><span>2023-09-13</span><SensIcon name="arrow-right" sizeToken="size/icon/m" colorRole="subtle" /><span>2023-09-19</span></DisplaySample></article>
      </div>
    </section>

    <section className="tg-rules" aria-label="使用建议">
      <article><h2>单日</h2><p>只需要一个自然日时使用单日粒度，不重复展示起止日期。</p><SensTimeSelection granularity="single" defaultMode="dynamic" defaultValue={{ mode: "dynamic", presetKey: "today", tag: "今天", range: { start: "2023-09-20", end: "2023-09-20" } }} /></article>
      <article><h2>时间精度</h2><p>默认按天筛选。只有业务判断依赖日内时刻时，才进一步选择小时、分钟或秒；入口上的时分秒与日期绑定展示。</p><div className="tg-time-examples"><TimeText>00:00</TimeText><TimeText>00:00:00</TimeText></div></article>
      <article><h2>能力边界</h2><p>0.9.1 支持原型中的选择、草稿、完成、放弃和禁用状态；不承诺生产级日期算法、完整年月菜单、完整时分秒菜单或交易日计算。</p></article>
    </section>

    <DisabledExamples />

    <footer className="tg-footer">完整交互规则参考 <a href="https://www.figma.com/design/0sW8EB0cmrAMMeeVRry706/%E6%97%B6%E9%97%B4%E7%BB%84%E4%BB%B6?node-id=2108-66567&m=dev" target="_blank" rel="noreferrer">时间组件 Figma 文档</a></footer>
  </main>;
}
