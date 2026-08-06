import titleDesignDoc from "../../design-system/components/base/title.design.md?raw";
import titleDevDoc from "../../design-system/components/base/title.md?raw";
import { SensButton, SensMoreButton, SensSectionTitle } from "../../ui";
import { buildSectionTitleTokenVars } from "../../ui/SensSectionTitle";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";

function GeneralLargeActions() {
  return (
    <>
      <SensMoreButton>更多</SensMoreButton>
      <SensButton>取消</SensButton>
      <SensButton tone="primary">保存</SensButton>
    </>
  );
}

function TitleDemo() {
  return (
    <div className="sens-section-title-showcase" style={buildSectionTitleTokenVars()}>
      <div className="sens-section-title-demo-card">
        <div className="sens-section-title-demo-label">基线对齐组</div>
        <div className="sens-section-title-baseline-board">
          <p className="sens-section-title-baseline-note">
            辅助文案与标题主文案同一行，按基线对齐（非顶对齐 / 垂直居中）。绿线为预览对照辅助线。
          </p>
          <div className="sens-section-title-baseline-sample">
            <SensSectionTitle title="二级标题" description="辅助文案信息辅助文案信息" />
          </div>
          <div className="sens-section-title-baseline-sample">
            <SensSectionTitle
              size="small"
              title="二级标题"
              description="辅助文案信息辅助文案信息"
            />
          </div>
          <div className="sens-section-title-baseline-sample">
            <SensSectionTitle
              variant="productLine"
              title="二级标题"
              description="辅助文案信息辅助文案信息"
            />
          </div>
        </div>
      </div>

      <div className="sens-section-title-demo-card">
        <div className="sens-section-title-demo-label">通用 / 大尺寸</div>
        <div className="sens-section-title-demo-samples">
          <SensSectionTitle
            title="属性配置"
            description="用于表单分组说明"
            actions={
              <>
                <SensButton>取消</SensButton>
                <SensButton tone="primary">保存</SensButton>
              </>
            }
          />
          <SensSectionTitle
            title="标题"
            help="帮助说明"
            optional="(选填)"
            description="辅助文案信息"
            actions={<GeneralLargeActions />}
          />
        </div>
      </div>

      <div className="sens-section-title-demo-card">
        <div className="sens-section-title-demo-label">通用 / 小尺寸</div>
        <div className="sens-section-title-demo-samples">
          <SensSectionTitle size="small" title="基础信息" description="轻量分组辅助文案" />
          <SensSectionTitle
            size="small"
            title="标题"
            help="帮助说明"
            optional="(选填)"
            description="小标题不展示右侧按钮组"
            actions={<GeneralLargeActions />}
          />
        </div>
      </div>

      <div className="sens-section-title-demo-card">
        <div className="sens-section-title-demo-label">专用 / 大尺寸</div>
        <div className="sens-section-title-demo-samples">
          <SensSectionTitle variant="productLine" title="用量提醒" description="辅助文案信息" />
          <SensSectionTitle
            variant="productLine"
            title="标题"
            help="帮助说明"
            optional="(选填)"
            description="专用标题不展示右侧按钮组"
            actions={<GeneralLargeActions />}
          />
        </div>
      </div>

      <div className="sens-section-title-demo-card">
        <div className="sens-section-title-demo-label">专用 / 小尺寸</div>
        <div className="sens-section-title-demo-samples">
          <SensSectionTitle
            variant="productLine"
            size="small"
            title="设置提醒用量"
            description="辅助文案信息"
          />
        </div>
      </div>
    </div>
  );
}

function TitleMatrix() {
  const rows = [
    {
      title: "通用大尺寸",
      text: "灰背景容器，适合大表单页二级分组；可带帮助、选填、辅助文案与右侧操作（更多 + 二级 + 一级）。",
      token: "height/xxl + padding-inline 4x + actions gap 4x + min gap 64（10x+6x）",
    },
    {
      title: "通用小尺寸",
      text: "灰背景容器，适合业务组件内部轻量分组；可带帮助 / 选填 / 辅助，不展示右侧按钮组。",
      token: "height/l + padding-inline 2x + background-transparent-grey @4% + font-size/m；actions 不渲染",
    },
    {
      title: "专用大 / 小尺寸",
      text: "左侧绿色短条，无灰背景；仅营销云、分析云、SDH；不展示右侧按钮组。",
      token: "component-primary + size/icon/m；actions 不渲染",
    },
    {
      title: "帮助 + 选填",
      text: "顺序：标题 → 帮助 icon → 选填 → 辅助文案；选填跟标题同档字号细体；辅助 12 档细体；帮助 hover / focus 出 Tips（仅悬停 → cursor default）。",
      token: "optional 大 l/l/regular、小 m/m/regular；description s/s/regular；色 text-sub @58%；--sens-cursor-default",
    },
    {
      title: "辅助文案基线",
      text: "二级标题的辅助文案与标题主文案同一行，基线对齐；不顶对齐、不垂直居中堆叠到下一行。",
      token: "title-row align-items: baseline + text-sub-color-transparent @58% + font-size/s",
    },
  ];

  return (
    <div className="sens-section-title-matrix" style={buildSectionTitleTokenVars()}>
      <p className="sens-section-title-baseline-note" style={{ margin: 0 }}>
        本矩阵为规则摘要；与上方真实 Demo 同为验收对象。
      </p>
      {rows.map((row) => (
        <div className="sens-section-title-matrix-card" key={row.title}>
          <div className="sens-section-title-matrix-title">{row.title}</div>
          <div className="sens-section-title-matrix-text">{row.text}</div>
          <div className="sens-section-title-matrix-token">{row.token}</div>
        </div>
      ))}
    </div>
  );
}

export default function TitleShowcasePage() {
  return (
    <ComponentShowcaseLayout
      title="标题 Title"
      demo={<TitleDemo />}
      matrix={<TitleMatrix />}
      designDocSource={titleDesignDoc}
      devDocSource={titleDevDoc}
    />
  );
}
