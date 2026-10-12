import { getUnitToken } from "../../design-system/unit";
import { SensAlert } from "../../ui";

export function TikTokDraftNotice() {
  return (
    <div
      style={{
        flexShrink: 0,
        padding: `${getUnitToken("spacing/3x")}px ${getUnitToken("spacing/6x")}px 0`,
      }}
    >
      <SensAlert
        type="info"
        description="该页面用于早期验证 DataSourceSpec、对象流程与 SensD 组件组合。当前视觉还原和设计审核未完成，不属于 v0.9 当前覆盖范围，也不作为正式样板或作品集案例。"
      >
        历史验证草稿 · 未完成
      </SensAlert>
    </div>
  );
}
