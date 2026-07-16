import titleDesignDoc from "../../design-system/components/base/title.design.md?raw";
import titleDevDoc from "../../design-system/components/base/title.md?raw";
import { SensButton, SensSectionTitle } from "../../ui";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";

function TitleDemo() {
  return (
    <div className="sens-section-title-showcase">
      <div className="sens-section-title-demo-card">
        <div className="sens-section-title-demo-label">通用 / 大尺寸</div>
        <SensSectionTitle
          title="属性配置"
          description="用于表单分组、卡片分组、配置块标题，可带辅助说明和右侧操作。"
          actions={
            <>
              <SensButton>取消</SensButton>
              <SensButton tone="primary">
                保存
              </SensButton>
            </>
          }
        />
      </div>
      <div className="sens-section-title-demo-card">
        <div className="sens-section-title-demo-label">通用 / 小尺寸</div>
        <SensSectionTitle size="small" title="基础信息" description="小尺寸用于业务组件内部的轻量标题。" />
      </div>
      <div className="sens-section-title-demo-card">
        <div className="sens-section-title-demo-label">营销云 & 分析云 & SDH 专用 / 大尺寸</div>
        <SensSectionTitle variant="productLine" title="用量提醒" />
      </div>
      <div className="sens-section-title-demo-card">
        <div className="sens-section-title-demo-label">营销云 & 分析云 & SDH 专用 / 小尺寸</div>
        <SensSectionTitle variant="productLine" size="small" title="设置提醒用量" />
      </div>
    </div>
  );
}

function TitleMatrix() {
  const rows = [
    {
      title: "通用大尺寸",
      text: "灰背景容器，适合表单分组、配置块、卡片内主标题；可带辅助说明和右侧操作。",
      token: "height/xxl + background-transparent-grey @4% + font-size/l + line-height/l + font-weight/semibold",
    },
    {
      title: "通用小尺寸",
      text: "灰背景容器，适合业务组件内部的轻量分组标题；默认不承担页面级标题职责。",
      token: "height/l + background-transparent-grey @4% + font-size/m + line-height/m + font-weight/medium",
    },
    {
      title: "专用大尺寸",
      text: "左侧绿色短条，无灰背景；仅营销云、分析云、SDH 专用，其他产品线需要先确认。",
      token: "component-primary + size/icon/m + font-size/xl + line-height/xl + font-weight/semibold",
    },
    {
      title: "专用小尺寸",
      text: "仅允许在业务组件内使用，不作为普通通用标题替代。",
      token: "component-primary + size/icon/m + font-size/l + line-height/l + font-weight/semibold",
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
