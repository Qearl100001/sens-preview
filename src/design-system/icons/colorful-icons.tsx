import type { ComponentType } from "react";
import type { IconRegistryEntry } from "./registry";
import type { RegistryIconRenderProps } from "./types";
import { COLORFUL_ICON_NAMES, type ColorfulIconName } from "./colorful-icon-names";

const COLORFUL_ICON_ASSETS: Record<ColorfulIconName, string> = Object.fromEntries(
  COLORFUL_ICON_NAMES.map((name) => [name, "/icons/colorful/" + name + ".svg"]),
) as Record<ColorfulIconName, string>;

const COLORFUL_ICON_META: Record<ColorfulIconName, { figmaName: string; category: "colorful-functional"; labelZh: string }> = {
  "approval-process-custom": { figmaName: "approval-process-custom", category: "colorful-functional", labelZh: "Figma · approval-process-custom" },
  "approval-process-existing": { figmaName: "approval-process-existing", category: "colorful-functional", labelZh: "Figma · approval-process-existing" },
  "view-api": { figmaName: "view-api", category: "colorful-functional", labelZh: "Figma · view-api" },
  "reproduction-project": { figmaName: "reproduction-project", category: "colorful-functional", labelZh: "Figma · reproduction-project" },
  "sent-box-setting": { figmaName: "sent-box-setting", category: "colorful-functional", labelZh: "Figma · sent-box-setting" },
  "upgrade-online": { figmaName: "upgrade-online", category: "colorful-functional", labelZh: "Figma · upgrade-online" },
  "api-key-manage": { figmaName: "api-key-manage", category: "colorful-functional", labelZh: "Figma · api-key-manage" },
  "wecom-member-task": { figmaName: "wecom-member-task", category: "colorful-functional", labelZh: "Figma · wecom-member-task" },
  "wechat-service-template-msg": { figmaName: "wechat-service-template-msg", category: "colorful-functional", labelZh: "Figma · wechat-service-template-msg" },
  "wechat-broadcast": { figmaName: "wechat-broadcast", category: "colorful-functional", labelZh: "Figma · wechat-broadcast" },
  "wechat-active-push": { figmaName: "wechat-active-push", category: "colorful-functional", labelZh: "Figma · wechat-active-push" },
  "wechat-authorization-management": { figmaName: "wechat-authorization-management", category: "colorful-functional", labelZh: "Figma · wechat-authorization-management" },
  "line": { figmaName: "line", category: "colorful-functional", labelZh: "Figma · line" },
  "whatsapp": { figmaName: "whatsapp", category: "colorful-functional", labelZh: "Figma · whatsapp" },
  "time-zones-setting": { figmaName: "time-zones-setting", category: "colorful-functional", labelZh: "Figma · time-zones-setting" },
  "android-store-report-hand": { figmaName: "android-store-report-hand", category: "colorful-functional", labelZh: "Figma · android-store-report-hand" },
  "android-store-report-voluntarily": { figmaName: "android-store-report-voluntarily", category: "colorful-functional", labelZh: "Figma · android-store-report-voluntarily" },
  "mini-program-subscribe-message": { figmaName: "mini-program-subscribe-message", category: "colorful-functional", labelZh: "Figma · mini-program-subscribe-message" },
  "push-management": { figmaName: "push-management", category: "colorful-functional", labelZh: "Figma · push-management" },
  "global-reach-limit": { figmaName: "global-reach-limit", category: "colorful-functional", labelZh: "Figma · global-reach-limit" },
  "touch-channel-management": { figmaName: "touch-channel-management", category: "colorful-functional", labelZh: "Figma · touch-channel-management" },
  "online-service-address": { figmaName: "online-service-address", category: "colorful-functional", labelZh: "Figma · online-service-address" },
  "application-management": { figmaName: "application-management", category: "colorful-functional", labelZh: "Figma · application-management" },
  "promotion-android-store": { figmaName: "promotion-android-store", category: "colorful-functional", labelZh: "Figma · promotion-android-store" },
  "advertising-space-in-site": { figmaName: "advertising-space-in-site", category: "colorful-functional", labelZh: "Figma · advertising-space-in-site" },
  "return-deep-event": { figmaName: "return-deep-event", category: "colorful-functional", labelZh: "Figma · return-deep-event" },
  "promotion-advertising-platform": { figmaName: "promotion-advertising-platform", category: "colorful-functional", labelZh: "Figma · promotion-advertising-platform" },
  "promotion-offline": { figmaName: "promotion-offline", category: "colorful-functional", labelZh: "Figma · promotion-offline" },
  "promotion-advertiser-channel": { figmaName: "promotion-advertiser-channel", category: "colorful-functional", labelZh: "Figma · promotion-advertiser-channel" },
  "webhook": { figmaName: "webhook", category: "colorful-functional", labelZh: "Figma · webhook" },
  "edm": { figmaName: "edm", category: "colorful-functional", labelZh: "Figma · edm" },
  "text-msg": { figmaName: "text-msg", category: "colorful-functional", labelZh: "Figma · text-msg" },
  "app-push": { figmaName: "app-push", category: "colorful-functional", labelZh: "Figma · app-push" },
  "configure-advertising-account": { figmaName: "configure-advertising-account", category: "colorful-functional", labelZh: "Figma · configure-advertising-account" },
  "improve-user-experience": { figmaName: "improve-user-experience", category: "colorful-functional", labelZh: "Figma · improve-user-experience" },
  "restore-scenario-quickly": { figmaName: "restore-scenario-quickly", category: "colorful-functional", labelZh: "Figma · restore-scenario-quickly" },
  "instant-event-management": { figmaName: "instant-event-management", category: "colorful-functional", labelZh: "Figma · instant-event-management" },
  "audience-real-time-management": { figmaName: "audience-real-time-management", category: "colorful-functional", labelZh: "Figma · audience-real-time-management" },
  "business-event-management": { figmaName: "business-event-management", category: "colorful-functional", labelZh: "Figma · business-event-management" },
  "audience-group-cleaning": { figmaName: "audience-group-cleaning", category: "colorful-functional", labelZh: "Figma · audience-group-cleaning" },
  "blacklist-management": { figmaName: "blacklist-management", category: "colorful-functional", labelZh: "Figma · blacklist-management" },
  "intelligent-outbound-call": { figmaName: "intelligent-outbound-call", category: "colorful-functional", labelZh: "Figma · intelligent-outbound-call" },
  "section-settings": { figmaName: "section-settings", category: "colorful-functional", labelZh: "Figma · section-settings" },
  "not-disturb-setting": { figmaName: "not-disturb-setting", category: "colorful-functional", labelZh: "Figma · not-disturb-setting" },
  "pre-set-template": { figmaName: "pre-set-template", category: "colorful-functional", labelZh: "Figma · pre-set-template" },
  "metric-management": { figmaName: "metric-management", category: "colorful-functional", labelZh: "Figma · metric-management" },
  "channel-large-default": { figmaName: "channel-large-default", category: "colorful-functional", labelZh: "Figma · channel-large-default" },
  "download-resource-report": { figmaName: "download-resource-report", category: "colorful-functional", labelZh: "Figma · download-resource-report" },
  "webhook-setting": { figmaName: "webhook-setting", category: "colorful-functional", labelZh: "Figma · webhook-setting" },
  "analysis-model-setting": { figmaName: "analysis-model-setting", category: "colorful-functional", labelZh: "Figma · analysis-model-setting" },
  "user-group-portrait-template": { figmaName: "user-group-portrait-template", category: "colorful-functional", labelZh: "Figma · user-group-portrait-template" },
  "popup-gustomized": { figmaName: "popup-gustomized", category: "colorful-functional", labelZh: "Figma · popup-gustomized" },
  "programming-test": { figmaName: "programming-test", category: "colorful-functional", labelZh: "Figma · programming-test" },
  "test-multi-link": { figmaName: "test-multi-link", category: "colorful-functional", labelZh: "Figma · test-multi-link" },
  "visual-test": { figmaName: "visual-test", category: "colorful-functional", labelZh: "Figma · visual-test" },
  "popup-in-app": { figmaName: "popup-in-app", category: "colorful-functional", labelZh: "Figma · popup-in-app" },
  "popup-in-miniporgram": { figmaName: "popup-in-miniporgram", category: "colorful-functional", labelZh: "Figma · popup-in-miniporgram" },
  "popup-in-h5": { figmaName: "popup-in-h5", category: "colorful-functional", labelZh: "Figma · popup-in-h5" },
  "ftp-data-set": { figmaName: "ftp-data-set", category: "colorful-functional", labelZh: "Figma · ftp-data-set" },
  "logagent": { figmaName: "logagent", category: "colorful-functional", labelZh: "Figma · logagent" },
  "test-model-time": { figmaName: "test-model-time", category: "colorful-functional", labelZh: "Figma · test-model-time" },
  "test-model-people": { figmaName: "test-model-people", category: "colorful-functional", labelZh: "Figma · test-model-people" },
  "template-enter": { figmaName: "template-enter", category: "colorful-functional", labelZh: "Figma · template-enter" },
  "template-enter-target": { figmaName: "template-enter-target", category: "colorful-functional", labelZh: "Figma · template-enter-target" },
  "template-no-enter": { figmaName: "template-no-enter", category: "colorful-functional", labelZh: "Figma · template-no-enter" },
  "information-flow-report": { figmaName: "information-flow-report", category: "colorful-functional", labelZh: "Figma · information-flow-report" },
  "sem-report": { figmaName: "sem-report", category: "colorful-functional", labelZh: "Figma · sem-report" },
  "campaign-plan": { figmaName: "campaign-plan", category: "colorful-functional", labelZh: "Figma · campaign-plan" },
  "journey": { figmaName: "journey", category: "colorful-functional", labelZh: "Figma · journey" },
  "data-access": { figmaName: "data-access", category: "colorful-functional", labelZh: "Figma · data-access" },
  "similarity-label-feature-template": { figmaName: "similarity-label-feature-template", category: "colorful-functional", labelZh: "Figma · similarity-label-feature-template" },
  "data-source-management": { figmaName: "data-source-management", category: "colorful-functional", labelZh: "Figma · data-source-management" },
  "single-user-panoramic-view-template": { figmaName: "single-user-panoramic-view-template", category: "colorful-functional", labelZh: "Figma · single-user-panoramic-view-template" },
  "data-validation": { figmaName: "data-validation", category: "colorful-functional", labelZh: "Figma · data-validation" },
  "data-sheet-management": { figmaName: "data-sheet-management", category: "colorful-functional", labelZh: "Figma · data-sheet-management" },
  "reward-grant": { figmaName: "reward-grant", category: "colorful-functional", labelZh: "Figma · reward-grant" },
  "asa-report": { figmaName: "asa-report", category: "colorful-functional", labelZh: "Figma · asa-report" },
  "entity-set": { figmaName: "entity-set", category: "colorful-functional", labelZh: "Figma · entity-set" },
  "entity-filter-trait-template": { figmaName: "entity-filter-trait-template", category: "colorful-functional", labelZh: "Figma · entity-filter-trait-template" },
  "single-entity-panoramic-view-template": { figmaName: "single-entity-panoramic-view-template", category: "colorful-functional", labelZh: "Figma · single-entity-panoramic-view-template" },
  "information-catalog-management": { figmaName: "information-catalog-management", category: "colorful-functional", labelZh: "Figma · information-catalog-management" },
  "resource-management": { figmaName: "resource-management", category: "colorful-functional", labelZh: "Figma · resource-management" },
  "control-group-management": { figmaName: "control-group-management", category: "colorful-functional", labelZh: "Figma · control-group-management" },
  "exchange-rate-rule": { figmaName: "Exchange-rate-rule", category: "colorful-functional", labelZh: "Figma · Exchange-rate-rule" },
  "date-mark": { figmaName: "date-mark", category: "colorful-functional", labelZh: "Figma · date-mark" },
  "wiki": { figmaName: "wiki", category: "colorful-functional", labelZh: "Figma · wiki" },
  "webhook-sms": { figmaName: "webhook-sms", category: "colorful-functional", labelZh: "Figma · webhook-sms" },
  "webhook-whatsapp": { figmaName: "webhook-whatsapp", category: "colorful-functional", labelZh: "Figma · webhook-whatsapp" },
  "webhook-benefits": { figmaName: "webhook-benefits", category: "colorful-functional", labelZh: "Figma · webhook-benefits" },
  "webhook-push": { figmaName: "webhook-push", category: "colorful-functional", labelZh: "Figma · webhook-push" },
  "webhook-email": { figmaName: "webhook-email", category: "colorful-functional", labelZh: "Figma · webhook-email" },
  "webhook-waihu": { figmaName: "webhook-waihu", category: "colorful-functional", labelZh: "Figma · webhook-waihu" },
  "asset-label-management": { figmaName: "asset-label-management", category: "colorful-functional", labelZh: "Figma · asset-label-management" },
  "strategy-priority": { figmaName: "strategy-priority", category: "colorful-functional", labelZh: "Figma · strategy-priority" },
  "sensors-sms": { figmaName: "sensors_sms", category: "colorful-functional", labelZh: "Figma · sensors_sms" },
  "sensors-inter-sms": { figmaName: "sensors_inter_sms", category: "colorful-functional", labelZh: "Figma · sensors_inter_sms" },
  "agent-skill-management": { figmaName: "agent-skill-management", category: "colorful-functional", labelZh: "Figma · agent-skill-management" },
  "time-authorization-management": { figmaName: "time-authorization-management", category: "colorful-functional", labelZh: "Figma · time-authorization-management" },
  "sending-limit-management": { figmaName: "sending-limit-management", category: "colorful-functional", labelZh: "Figma · sending-limit-management" },
};

function createColorfulIcon(assetUrl: string): ComponentType<RegistryIconRenderProps> {
  return function ColorfulIcon({ size = 48, className, style }) {
    return <img src={assetUrl} alt="" aria-hidden="true" className={className} style={{ width: size, height: size, display: "block", flexShrink: 0, ...style }} />;
  };
}

const COLORFUL_ICON_COMPONENTS = Object.fromEntries(
  COLORFUL_ICON_NAMES.map((name) => [name, createColorfulIcon(COLORFUL_ICON_ASSETS[name])]),
) as Record<ColorfulIconName, ComponentType<RegistryIconRenderProps>>;

export const COLORFUL_ICON_REGISTRY = Object.fromEntries(
  COLORFUL_ICON_NAMES.map((name) => {
    const meta = COLORFUL_ICON_META[name];
    return [
      name,
      {
        name,
        figmaName: meta.figmaName,
        sourceComponent: "ColorfulFigmaIcon",
        sourceFile: "public/icons/colorful/" + name + ".svg",
        viewBox: "0 0 48 48",
        category: meta.category,
        labelZh: meta.labelZh,
        currentColor: false,
        dualTone: true,
        temporary: false,
        usageScenes: [{ scene: "SensEntryCard 彩色业务入口", typicalSizes: [48, 60], typicalColorRoles: ["inherit"], reusableAtOtherSizes: true }],
        Component: COLORFUL_ICON_COMPONENTS[name],
      },
    ];
  }),
) as unknown as Record<ColorfulIconName, IconRegistryEntry>;

export { COLORFUL_ICON_NAMES };
export type { ColorfulIconName };
