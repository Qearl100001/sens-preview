import type { FunctionalSkin } from "../design-system/functional-skin";
import type { NavigationTheme } from "../design-system/navigation-color";

/** PreviewShell → Outlet 透传；与 SensAppearanceProvider 同步 */
export type PreviewOutletContext = {
  skin: FunctionalSkin;
  navigationTheme: NavigationTheme;
};
