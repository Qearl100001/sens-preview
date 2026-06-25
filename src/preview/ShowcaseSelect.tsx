import { useOutletContext } from "react-router-dom";
import type { FunctionalSkin } from "../design-system/functional-skin";
import { SensSelectDropdown, type SensSelectDropdownProps } from "../ui/SensSelectDropdown";

type PreviewOutletContext = {
  skin: FunctionalSkin;
};

/** Showcase Demo 区控件：接顶部换肤 + R3 选择器触发框 */
export function ShowcaseSelect(props: SensSelectDropdownProps) {
  const { skin } = useOutletContext<PreviewOutletContext>();
  return <SensSelectDropdown functionalSkin={skin} {...props} />;
}
