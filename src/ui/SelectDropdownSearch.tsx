import { useTranslation } from "react-i18next";
import { MinimalSearchField, type MinimalSearchFieldProps } from "./MinimalSearchField";

const I18N_NS = "组件库";

export interface SelectDropdownSearchProps
  extends Omit<MinimalSearchFieldProps, "showCreate" | "width"> {}

/** 浮层内搜索：薄封装 MinimalSearchField · 实时·简约 · 有输入显示返回 */
export function SelectDropdownSearch({
  placeholder,
  className,
  onBack,
  ...rest
}: SelectDropdownSearchProps) {
  const { t } = useTranslation();
  const resolvedPlaceholder =
    placeholder ??
    t(`${I18N_NS}.sensd-selectPanel-searchPlaceholder`, { defaultValue: "请输入搜索内容" });

  return (
    <div className="sens-select-dropdown-search">
      <MinimalSearchField
        showCreate={false}
        className={["sens-select-dropdown-search-input", className].filter(Boolean).join(" ") || undefined}
        placeholder={resolvedPlaceholder}
        onBack={onBack}
        {...rest}
      />
    </div>
  );
}
