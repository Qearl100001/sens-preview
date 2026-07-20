import titleDesignDoc from "../../design-system/components/base/title.design.md?raw";
import titleDevDoc from "../../design-system/components/base/title.md?raw";
import { SensButton, SensSectionTitle } from "../../ui";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";

function TitleDemo() {
  return (
    <div className="sens-section-title-showcase">
      <div className="sens-section-title-demo-card">
        <div className="sens-section-title-demo-label">基线对齐 · 二级标题 + 辅助文案</div>
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
        <div className="sens-section-title-demo-label">通用 / 大尺寸（大表单页默认）</div>
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
      </div>
      <div className="sens-section-title-demo-card">
        <div className="sens-section-title-demo-label">通用 / 小尺寸（业务组件内部；大表单页默认不用）</div>
        <SensSectionTitle size="small" title="基础信息" description="轻量分组辅助文案" />
      </div>
      <div className="sens-section-title-demo-card">
        <div className="sens-section-title-demo-label">营销云 & 分析云 & SDH 专用 / 大尺寸</div>
        <SensSectionTitle variant="productLine" title="用量提醒" description="辅助文案信息" />
      </div>
      <div className="sens-section-title-demo-card">
        <div className="sens-section-title-demo-label">营销云 & 分析云 & SDH 专用 / 小尺寸</div>
        <SensSectionTitle
          variant="productLine"
          size="small"
          title="设置提醒用量"
          description="辅助文案信息"
        />
      </div>
    </div>
  );
}

function TitleMatrix() {
  const rows = [
    {
      title: "通用大尺寸",
      text: "灰背景容器，适合大表单页二级分组、配置块、卡片内主标题；可带同行辅助文案和右侧操作。",
      token: "height/xxl + background-transparent-grey @4% + font-size/l + line-height/l + font-weight/semibold",
    },
    {
      title: "通用小尺寸",
      text: "灰背景容器，适合业务组件内部轻量分组；大表单页默认不用。",
      token: "height/l + background-transparent-grey @4% + font-size/m + line-height/m + font-weight/medium",
    },
    {
      title: "专用大尺寸",
      text: "左侧绿色短条，无灰背景；仅营销云、分析云、SDH 的二级分组标题，其他产品线需先确认。",
      token: "component-primary + size/icon/m + font-size/xl + line-height/xl + font-weight/semibold",
    },
    {
      title: "专用小尺寸",
      text: "仅允许在业务组件内使用，不作为普通通用标题替代，也不用于大表单页二级分组。",
      token: "component-primary + size/icon/m + font-size/l + line-height/l + font-weight/semibold",
    },
    {
      title: "辅助文案基线",
      text: "二级标题的辅助文案与标题主文案同一行，基线对齐；不顶对齐、不垂直居中堆叠到下一行。",
      token: "title-row align-items: baseline + text-sub-color-transparent @58% + font-size/s",
    },
  ];

  return (
    <div className="sens-section-title-matrix">
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
