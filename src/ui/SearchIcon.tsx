import type { CSSProperties } from "react";

export interface SearchIconProps {
  size?: number;
  className?: string;
  style?: CSSProperties;
  /** 默认 currentColor，由父级或 style.color 控制 */
  color?: string;
}

/** Figma 803:171 · 设计系统搜索图标（16×16） */
export function SearchIcon({
  size = 16,
  className,
  style,
  color = "currentColor",
}: SearchIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        display: "inline-block",
        flexShrink: 0,
        ...(color !== "currentColor" ? { color } : {}),
        ...style,
      }}
      aria-hidden
    >
      <path
        d="M11.6181 10.675C11.4794 10.8586 11.3265 11.0349 11.1591 11.2022C11.0068 11.3545 10.847 11.495 10.6811 11.6236L10.1839 11.1264C9.92356 10.8661 9.92356 10.444 10.1839 10.1836C10.4443 9.92329 10.8664 9.92329 11.1267 10.1836L11.6181 10.675Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.567 11.6266C14.5641 9.13974 14.4091 5.49544 12.102 3.1883C9.62864 0.714983 5.61859 0.714983 3.14527 3.1883C0.671953 5.66162 0.671953 9.67167 3.14527 12.145C5.46718 14.4669 9.14341 14.609 11.6311 12.5714C11.641 12.5826 11.6512 12.5936 11.6619 12.6043L13.243 14.1854C13.5034 14.4458 13.9255 14.4458 14.1858 14.1854C14.4462 13.9251 14.4462 13.503 14.1858 13.2426L12.6047 11.6615C12.5925 11.6493 12.5799 11.6376 12.567 11.6266ZM11.1592 4.13111C13.1118 6.08373 13.1118 9.24956 11.1592 11.2022C9.20653 13.1548 6.0407 13.1548 4.08808 11.2022C2.13546 9.24956 2.13546 6.08373 4.08808 4.13111C6.0407 2.17849 9.20653 2.17849 11.1592 4.13111Z"
        fill="currentColor"
      />
    </svg>
  );
}
