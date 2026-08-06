import { useOutletContext } from "react-router-dom";
import type { PreviewOutletContext } from "./previewOutletContext";
import { SensSelectDropdown, type SensSelectDropdownProps } from "../ui/SensSelectDropdown";

/** Showcase Demo 区控件：接顶部换肤 + R3 选择器触发框 */
export function ShowcaseSelect(props: SensSelectDropdownProps) {
  const { skin } = useOutletContext<PreviewOutletContext>();
  return <SensSelectDropdown functionalSkin={skin} {...props} />;
}
