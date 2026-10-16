import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { getColorToken, tokenRgba } from "../design-system/color-utils";
import { getDividerColor } from "../design-system/divider";
import { getTypographyToken } from "../design-system/typography";
import { getUnitToken } from "../design-system/unit";
import { SensAlert } from "./SensAlert";
import { SensCheckbox } from "./SensCheckbox";
import { SensRadioGroup } from "./SensRadio";
import { SensRecipientSelector, type SensRecipientOption } from "./SensRecipientSelector";
import { SensSelectDropdown } from "./SensSelectDropdown";
import { SensButton } from "./SensButton";
import "./notification-settings.css";

export type SensNotificationChannel = "inApp" | "email" | "webhook";
export type SensNotificationRecipientMode = "all" | "specified";

export interface SensNotificationSection {
  key: string;
  title: string;
  optional?: boolean;
  description?: string;
}

export interface SensNotificationSettingsProps {
  sections: SensNotificationSection[];
  recipientOptions: SensRecipientOption[];
  infoText?: ReactNode;
  initialChannels?: Record<string, SensNotificationChannel[]>;
  initialRecipientMode?: Record<string, SensNotificationRecipientMode>;
  initialRecipientIds?: Record<string, string[]>;
  senderOptions?: Array<{ value: string; label: string }>;
  webhookOptions?: Array<{ value: string; label: string }>;
}

const CHANNELS: Array<{ key: SensNotificationChannel; label: string }> = [
  { key: "inApp", label: "站内通知" },
  { key: "email", label: "邮件通知" },
  { key: "webhook", label: "Webhook 通知" },
];

const RECIPIENT_MODES: Array<{ value: string; label: string }> = [
  { value: "all", label: "全部成员" },
  { value: "specified", label: "指定成员" },
];

function vars(): CSSProperties {
  return {
    "--sens-notification-surface": getColorToken("white"),
    "--sens-notification-muted": tokenRgba("background-transparent-grey", 0.04),
    "--sens-notification-border": getDividerColor("weak", "transparent"),
    "--sens-notification-text": tokenRgba("text-color-transparent", 0.9),
    "--sens-notification-subtext": tokenRgba("text-sub-color-transparent", 0.58),
    "--sens-notification-article": getColorToken("text-article-color"),
    "--sens-notification-link": getColorToken("link-color"),
    "--sens-notification-primary": getColorToken("component-primary"),
    "--sens-notification-radius": `${getUnitToken("radius/l")}px`,
    "--sens-notification-radius-small": `${getUnitToken("radius/m")}px`,
    "--sens-notification-gap-xs": `${getUnitToken("spacing/1x")}px`,
    "--sens-notification-gap-s": `${getUnitToken("spacing/2x")}px`,
    "--sens-notification-gap-m": `${getUnitToken("spacing/3x")}px`,
    "--sens-notification-gap-l": `${getUnitToken("spacing/4x")}px`,
    "--sens-notification-gap-xl": `${getUnitToken("spacing/5x")}px`,
    "--sens-notification-gap-2xl": `${getUnitToken("spacing/10x")}px`,
    "--sens-notification-gap-3xl": `${getUnitToken("spacing/6x")}px`,
    "--sens-notification-size-title": `${getUnitToken("size/component-height/xxl")}px`,
    "--sens-notification-size-control": `${getUnitToken("size/component-height/l")}px`,
    "--sens-notification-font-title": `${getTypographyToken("font-size/l")}px`,
    "--sens-notification-line-title": `${getTypographyToken("line-height/l")}px`,
    "--sens-notification-font": `${getTypographyToken("font-size/m")}px`,
    "--sens-notification-line": `${getTypographyToken("line-height/m")}px`,
    "--sens-notification-weight-medium": String(getTypographyToken("font-weight/medium")),
    "--sens-notification-weight-semibold": String(getTypographyToken("font-weight/semibold")),
    "--sens-notification-weight-regular": String(getTypographyToken("font-weight/regular")),
  } as CSSProperties;
}

function ObjectSummary({ options, value }: { options: SensRecipientOption[]; value: string[] }) {
  const selected = useMemo(() => options.filter((option) => value.includes(option.value)), [options, value]);
  const groups = ["member", "role", "position"] as const;
  return (
    <div className="sens-notification-summary">
      <div className="sens-notification-summary__body">
        {groups.map((kind) => {
          const items = selected.filter((item) => item.kind === kind);
          return (
            <div className="sens-notification-summary__row" key={kind}>
              <strong>{{ member: "成员", role: "角色", position: "职务" }[kind]}：</strong>
              <span>{items.length ? items.map((item) => item.label).join("、") : "—"}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** 通知方式与接收对象的通用组合；事件名称与业务策略由样板间传入。 */
export function SensNotificationSettings({
  sections,
  recipientOptions,
  infoText,
  initialChannels = {},
  initialRecipientMode = {},
  initialRecipientIds = {},
  senderOptions = [{ value: "sender-default", label: "请选择" }],
  webhookOptions = [{ value: "webhook-default", label: "请选择需要发送的企业群" }],
}: SensNotificationSettingsProps) {
  const [channels, setChannels] = useState<Record<string, SensNotificationChannel[]>>(() =>
    Object.fromEntries(sections.map((section) => [section.key, initialChannels[section.key] ?? ["inApp"]])),
  );
  const [recipientModes, setRecipientModes] = useState<Record<string, SensNotificationRecipientMode>>(() =>
    Object.fromEntries(sections.map((section) => [section.key, initialRecipientMode[section.key] ?? "specified"])),
  );
  const [recipientIds, setRecipientIds] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(sections.map((section) => [section.key, initialRecipientIds[section.key] ?? []])),
  );
  const [senderValues, setSenderValues] = useState<Record<string, string>>({});
  const [webhookValues, setWebhookValues] = useState<Record<string, string>>({});
  const [configMessage, setConfigMessage] = useState("");

  const hasChannel = (sectionKey: string, channel: SensNotificationChannel) => (channels[sectionKey] ?? []).includes(channel);
  const toggleChannel = (sectionKey: string, channel: SensNotificationChannel, checked: boolean) => {
    setChannels((current) => {
      const existing = current[sectionKey] ?? [];
      return { ...current, [sectionKey]: checked ? [...new Set([...existing, channel])] : existing.filter((item) => item !== channel) };
    });
  };

  return (
    <div className="sens-notification-settings" style={vars()}>
      {infoText ? <SensAlert type="info">{infoText}</SensAlert> : null}
      {sections.map((section) => (
        <section className="sens-notification-section" key={section.key}>
          <header className="sens-notification-section__title">
            <strong>{section.title}</strong>{section.optional ? <span>选填</span> : null}
          </header>
          {section.description ? <SensAlert type="info">{section.description}</SensAlert> : null}
          <strong className="sens-notification-section__channels-title">通知方式</strong>
          <div className="sens-notification-section__content">
            {CHANNELS.map((channel) => {
              const checked = hasChannel(section.key, channel.key);
              return (
                <div className="sens-notification-channel" key={channel.key}>
                  <SensCheckbox checked={checked} onChange={(event) => toggleChannel(section.key, channel.key, event.target.checked)}>
                    {channel.label}
                  </SensCheckbox>
                  {checked && channel.key === "inApp" ? (
                    <div className="sens-notification-panel sens-notification-panel--recipient">
                      <div className="sens-notification-recipient-mode">
                        <strong>通知人</strong>
                        <SensRadioGroup
                          aria-label="通知接收范围"
                          options={RECIPIENT_MODES}
                          value={recipientModes[section.key] ?? "specified"}
                          direction="horizontal"
                          itemHeight="content"
                          onChange={(value) => setRecipientModes((current) => ({ ...current, [section.key]: value as SensNotificationRecipientMode }))}
                        />
                      </div>
                      {(recipientModes[section.key] ?? "specified") === "specified" ? (
                        <div className="sens-notification-recipient-picker">
                          <div className="sens-notification-recipient-picker__header">
                            <strong>指定对象</strong>
                            <SensRecipientSelector
                              options={recipientOptions}
                              value={recipientIds[section.key] ?? []}
                              onChange={(value) => setRecipientIds((current) => ({ ...current, [section.key]: value }))}
                            />
                          </div>
                          <ObjectSummary options={recipientOptions} value={recipientIds[section.key] ?? []} />
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                  {checked && channel.key === "email" ? (
                    <div className="sens-notification-panel sens-notification-panel--email">
                      <div className="sens-notification-field-row">
                        <strong>发件人</strong>
                        <SensSelectDropdown
                          aria-label="发件人"
                          placeholder="请选择"
                          options={senderOptions}
                          value={senderValues[section.key]}
                          onChange={(value) => setSenderValues((current) => ({ ...current, [section.key]: String(value) }))}
                          widthPreset="320"
                        />
                        <SensButton tone="link" onClick={() => setConfigMessage("发件箱配置由业务系统承接")}>配置发件箱</SensButton>
                      </div>
                      <div className="sens-notification-field-row">
                        <strong>收件人</strong>
                        <SensRecipientSelector
                          options={recipientOptions}
                          value={recipientIds[`${section.key}-email`] ?? []}
                          onChange={(value) => setRecipientIds((current) => ({ ...current, [`${section.key}-email`]: value }))}
                          triggerLabel="选择"
                        />
                      </div>
                    </div>
                  ) : null}
                  {checked && channel.key === "webhook" ? (
                    <div className="sens-notification-panel sens-notification-field-row">
                      <strong>webhook</strong>
                      <SensSelectDropdown
                        aria-label="Webhook 接收群"
                        placeholder="请选择需要发送的企业群"
                        options={webhookOptions}
                        value={webhookValues[section.key]}
                        onChange={(value) => setWebhookValues((current) => ({ ...current, [section.key]: String(value) }))}
                        widthMode="adaptive"
                      />
                      <SensButton tone="link" onClick={() => setConfigMessage("Webhook 配置由业务系统承接")}>配置 Webhook</SensButton>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ))}
      {configMessage ? <div className="sens-notification-settings__status" role="status">{configMessage}</div> : null}
    </div>
  );
}
