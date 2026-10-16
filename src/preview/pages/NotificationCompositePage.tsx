import { type CSSProperties } from "react";
import { getColorToken, tokenRgba } from "../../design-system/color-utils";
import { getDividerColor, getDividerHairlineWidth } from "../../design-system/divider";
import { getTypographyToken } from "../../design-system/typography";
import { getUnitToken } from "../../design-system/unit";
import { SensButton, SensNotificationSettings, type SensRecipientOption } from "../../ui";
import "./form-templates.css";

const options: SensRecipientOption[] = [
  { value: "member-admin", label: "admin", description: "admin", kind: "member" },
  { value: "member-lj", label: "刘锦波", description: "liujinbo", kind: "member" },
  { value: "member-zj", label: "张俊峰", description: "zhangjunfeng", kind: "member" },
  { value: "member-fjj", label: "冯佳捷", description: "fengjiajie", kind: "member" },
  { value: "member-swf", label: "桑文锋", description: "sangwenfeng", kind: "member" },
  { value: "member-zag", label: "张奥呵", description: "zhangaohe", kind: "member" },
  { value: "member-yyy", label: "于璎妍", description: "yuyanyan", kind: "member" },
  { value: "member-ylq", label: "杨岚钦", description: "yanglanqin", kind: "member" },
  { value: "member-dsj", label: "戴世杰", description: "daishijie", kind: "member" },
  { value: "member-ztx", label: "张天晓", description: "zhangtianxiao", kind: "member" },
  { value: "role-admin", label: "管理员", kind: "role" },
  { value: "role-analyst", label: "分析师", kind: "role" },
  { value: "role-sales", label: "销售", kind: "role" },
  { value: "position-product", label: "产品", kind: "position" },
  { value: "position-qa", label: "QA", kind: "position" },
  { value: "position-pm", label: "项目经理", kind: "position" },
  { value: "position-rd", label: "RD", kind: "position" },
];

const senderOptions = [
  { value: "sender-default", label: "请选择" },
  { value: "sender-notice", label: "系统通知邮箱" },
];

const webhookOptions = [
  { value: "webhook-default", label: "webhooktest" },
  { value: "webhook-ops", label: "运营通知群" },
];

function px(value: number): string {
  return `${value}px`;
}

function buildPageTokenVars(): CSSProperties {
  return {
    "--form-templates-page-bg": tokenRgba("background-transparent-grey", 0.04),
    "--form-templates-surface": getColorToken("white"),
    "--form-templates-text": tokenRgba("text-color-transparent", 0.9),
    "--form-templates-sub-text": tokenRgba("text-sub-color-transparent", 0.58),
    "--form-templates-divider": getDividerColor("light", "transparent"),
    "--form-templates-divider-width": px(getDividerHairlineWidth()),
    "--form-templates-muted-surface": tokenRgba("background-transparent-grey", 0.04),
    "--form-templates-radius": px(getUnitToken("radius/l")),
    "--form-templates-page-padding": px(getUnitToken("spacing/vertical/7x")),
    "--form-templates-section-gap": px(getUnitToken("spacing/vertical/10x")),
    "--form-templates-block-gap": px(getUnitToken("spacing/vertical/7x")),
    "--form-templates-content-gap": px(getUnitToken("spacing/vertical/4x")),
    "--form-templates-tight-gap": px(getUnitToken("spacing/vertical/2x")),
    "--form-templates-inline-gap": px(getUnitToken("spacing/horizontal/4x")),
    "--form-templates-title-size": px(getTypographyToken("font-size/xxl")),
    "--form-templates-title-line": px(getTypographyToken("line-height/xxl")),
    "--form-templates-title-weight": getTypographyToken("font-weight/semibold"),
    "--form-templates-heading-size": px(getTypographyToken("font-size/l")),
    "--form-templates-heading-line": px(getTypographyToken("line-height/l")),
    "--form-templates-body-size": px(getTypographyToken("font-size/m")),
    "--form-templates-body-line": px(getTypographyToken("line-height/m")),
    "--form-templates-help-size": px(getTypographyToken("font-size/s")),
    "--form-templates-help-line": px(getTypographyToken("line-height/s")),
    "--form-templates-control-max-width": px(getUnitToken("form/control/max-width")),
  } as CSSProperties;
}

export default function NotificationCompositePage() {
  return (
    <main className="form-templates-page" style={buildPageTokenVars()}>
      <header className="form-templates-header">
        <span>Notification / P0</span>
        <h1>通知系统</h1>
        <p>按可复用模式组织通知组合。对象选择留在对应项里，不单独拆开。业务标题、说明和保存流程由样板间承接。</p>
      </header>
      <div className="form-templates-switch" aria-label="选择通知组合">
        <SensButton size="small" tone="primary" aria-pressed="true">
          通知配置与对象选择
        </SensButton>
      </div>
      <section className="form-templates-board" aria-label="通知配置与对象选择">
        <div className="form-templates-intro">
          <div>
            <h2>通知配置与对象选择</h2>
            <p>在同一项里配置通知渠道。选择指定成员后，直接在这项里选择成员、角色和职务。</p>
          </div>
          <div className="form-templates-rule">对象选择属于通知配置的一部分，指定成员时在同一项内完成选择和回显。</div>
        </div>
        <SensNotificationSettings
          sections={[{ key: "demo", title: "通知方式" }]}
          recipientOptions={options}
          initialChannels={{ demo: ["inApp", "webhook"] }}
          initialRecipientMode={{ demo: "specified" }}
          initialRecipientIds={{ demo: ["member-admin", "role-admin", "position-product"] }}
          senderOptions={senderOptions}
          webhookOptions={webhookOptions}
        />
      </section>
    </main>
  );
}
