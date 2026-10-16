import { useState, type CSSProperties } from "react";
import { getColorToken } from "../../design-system/color-utils";
import { SensButton, SensDrawer, SensNotificationSettings, SensTitleBar, type SensRecipientOption } from "../../ui";
import "./notification-settings-template.css";

const options: SensRecipientOption[] = [
  { value: "member-admin", label: "admin", description: "admin", kind: "member" },
  { value: "member-liu", label: "刘锦波", description: "liujinbo", kind: "member" },
  { value: "member-zhang", label: "张俊峰", description: "zhangjunfeng", kind: "member" },
  { value: "member-feng", label: "冯佳捷", description: "fengjiajie", kind: "member" },
  { value: "role-admin", label: "管理员", kind: "role" },
  { value: "position-product", label: "产品", kind: "position" },
  { value: "position-analyst", label: "分析师", kind: "position" },
  { value: "position-sales", label: "销售", kind: "position" },
  { value: "position-qa", label: "QA", kind: "position" },
  { value: "position-pm", label: "项目经理", kind: "position" },
];

const sections = [
  {
    key: "missing-calendar",
    title: "交易日未上传提醒",
    description: "当未来 30 天内交易日历缺失时触发提醒；当次年交易日历未上传，将于 12 月 15 日起触发提醒。",
  },
  { key: "calendar-change", title: "交易日状态变更提醒", optional: true },
];

const senderOptions = [
  { value: "sender-placeholder", label: "请选择" },
  { value: "sender-system", label: "系统通知邮箱" },
  { value: "sender-service", label: "服务通知邮箱" },
];

const webhookOptions = [
  { value: "webhook-test", label: "webhooktest" },
  { value: "webhook-ops", label: "运营通知群" },
];

export default function NotificationSettingsTemplatePage() {
  const [open, setOpen] = useState(true);
  const [saved, setSaved] = useState(false);
  const templateStyle = {
    "--notification-template-page-bg": getColorToken("background-grey"),
    "--notification-template-text": getColorToken("text-color"),
  } as CSSProperties;

  return (
    <div className="notification-settings-template" style={templateStyle}>
      <div className="notification-settings-template__underlay">
        <h1>通知配置样板</h1>
        <p>此页面展示交易日历场景如何组合 Sens 通知配置与对象选择器。</p>
        {saved ? <p role="status">配置已保存（演示）</p> : null}
        <SensButton onClick={() => setOpen(true)}>打开通知配置</SensButton>
      </div>
      <SensDrawer
        open={open}
        size="large"
        onClose={() => setOpen(false)}
        titleBar={
          <SensTitleBar
            title="通知配置"
            onBack={() => setOpen(false)}
            actions={
              <>
                <SensButton tone="secondary" onClick={() => setOpen(false)}>放 弃</SensButton>
                <SensButton onClick={() => { setSaved(true); setOpen(false); }}>保 存</SensButton>
              </>
            }
          />
        }
      >
        <div className="notification-settings-template__content">
          <SensNotificationSettings
            sections={sections}
            recipientOptions={options}
            initialChannels={{
              "missing-calendar": ["inApp", "webhook"],
              "calendar-change": ["inApp", "email", "webhook"],
            }}
            initialRecipientMode={{ "missing-calendar": "specified", "calendar-change": "specified" }}
            initialRecipientIds={{ "missing-calendar": ["member-admin", "role-admin", "position-product", "position-analyst", "position-sales", "position-qa", "position-pm"], "calendar-change": [] }}
            senderOptions={senderOptions}
            webhookOptions={webhookOptions}
          />
        </div>
      </SensDrawer>
    </div>
  );
}
