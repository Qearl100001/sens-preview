import type { CSSProperties } from "react";
import tokens from "../design-system/tokens.resolved.json";

const u = tokens.unit as Record<string, number>;
const ICON_SIZE_M = u["size/icon/m"];
const ICON_SIZE_S = u["size/icon/s"];

export const INPUT_ERROR_ICON_SIZE_M = ICON_SIZE_M;
export const INPUT_ERROR_ICON_SIZE_S = ICON_SIZE_S;
export const INPUT_ERROR_HELP_ICON_SIZE = ICON_SIZE_S;
/** Figma 17694:64400 / 3729:15820 · 下拉已选勾选 */
export const SELECT_CHECK_ICON_SIZE = ICON_SIZE_M;
export const STEPPER_ICON_SIZE = 10;

export interface IconProps {
  size?: number;
  className?: string;
  style?: CSSProperties;
  color?: string;
}

function iconStyleProps(color: string | undefined, style?: CSSProperties): CSSProperties {
  // 默认 currentColor 时不写 inline color，让 CSS class / 父级 token 生效
  return {
    flexShrink: 0,
    ...(color && color !== "currentColor" ? { color } : {}),
    ...style,
  };
}

/** Figma 1536:5443 / 1499:5472 · 报错菱形（输入框警告） */
export function ErrorDiamondIcon({
  size = ICON_SIZE_M,
  className,
  style,
  color = "currentColor",
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={iconStyleProps(color, style)}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.97325 1.40313C8.43574 0.865622 7.56426 0.865622 7.02675 1.40313L1.40313 7.02675C0.865622 7.56426 0.865622 8.43574 1.40313 8.97325L7.02675 14.5969C7.56426 15.1344 8.43574 15.1344 8.97325 14.5969L14.5969 8.97325C15.1344 8.43574 15.1344 7.56426 14.5969 7.02675L8.97325 1.40313ZM8 4.52326C7.65589 4.52326 7.38044 4.80873 7.39273 5.15261L7.51083 8.45951C7.52024 8.72287 7.73647 8.93152 8 8.93152C8.26353 8.93152 8.47976 8.72287 8.48917 8.4595L8.60727 5.15261C8.61956 4.80873 8.34411 4.52326 8 4.52326ZM8 11.4505C8.43475 11.4505 8.78719 11.0981 8.78719 10.6633C8.78719 10.2286 8.43475 9.87614 8 9.87614C7.56525 9.87614 7.21281 10.2286 7.21281 10.6633C7.21281 11.0981 7.56525 11.4505 8 11.4505Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Figma 1471:5057 · icon-default（链接按钮示例图标，非选择器箭头） */
export function IconDefaultIcon({
  size = ICON_SIZE_M,
  className,
  style,
  color = "currentColor",
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={iconStyleProps(color, style)}
      aria-hidden
    >
      <path
        opacity={0.5}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.333 3.8C1.333 2.438 2.438 1.333 3.8 1.333H12.2C13.562 1.333 14.667 2.438 14.667 3.8V12.2C14.667 13.562 13.562 14.667 12.2 14.667H3.8C2.438 14.667 1.333 13.562 1.333 12.2V3.8ZM3.8 2.667C3.174 2.667 2.667 3.174 2.667 3.8V12.2C2.667 12.826 3.174 13.333 3.8 13.333H12.2C12.826 13.333 13.333 12.826 13.333 12.2V3.8C13.333 3.174 12.826 2.667 12.2 2.667H3.8Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.533 6.583H4.214V9.416H3.533V6.583ZM4.643 6.99C4.885 6.678 5.235 6.533 5.671 6.533C5.992 6.533 6.271 6.619 6.491 6.8C6.704 6.975 6.827 7.215 6.87 7.502L6.893 7.655H6.231L6.206 7.554C6.169 7.409 6.107 7.318 6.023 7.262C5.94 7.203 5.824 7.171 5.665 7.171C5.434 7.171 5.28 7.246 5.175 7.392C5.074 7.526 5.017 7.724 5.017 8.002C5.017 8.289 5.074 8.49 5.171 8.619C5.27 8.75 5.431 8.828 5.676 8.828C5.832 8.828 5.95 8.788 6.036 8.724C6.127 8.65 6.199 8.531 6.243 8.357L6.269 8.257H6.936L6.907 8.415C6.845 8.743 6.7 9.006 6.463 9.198C6.243 9.377 5.979 9.465 5.679 9.465C5.228 9.465 4.869 9.317 4.633 9.011C4.429 8.751 4.336 8.41 4.336 8.002C4.336 7.601 4.433 7.256 4.643 6.99ZM7.272 9.039C7.035 8.765 6.925 8.416 6.925 8.002C6.925 7.587 7.035 7.237 7.272 6.963C7.521 6.67 7.865 6.533 8.285 6.533C8.703 6.533 9.046 6.67 9.298 6.959C9.536 7.229 9.649 7.583 9.649 8.002C9.649 8.422 9.536 8.772 9.298 9.043C9.046 9.327 8.703 9.465 8.285 9.465C7.864 9.465 7.521 9.323 7.272 9.039ZM9.773 6.583H10.391L11.449 8.152V6.583H12.133V9.416H11.526L10.454 7.822V9.416H9.773V6.583ZM8.89 7.291C8.749 7.119 8.547 7.036 8.285 7.036C8.024 7.036 7.822 7.126 7.677 7.306C7.539 7.478 7.472 7.708 7.472 8.002C7.472 8.294 7.539 8.524 7.677 8.697C7.819 8.873 8.024 8.963 8.285 8.963C8.547 8.963 8.749 8.876 8.89 8.707C9.028 8.538 9.099 8.305 9.099 8.002C9.099 7.7 9.028 7.463 8.89 7.291Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Figma 804:78 · Select 触发框默认箭头（down） */
export const SELECT_ARROW_ICON_SIZE = ICON_SIZE_M;
/** Figma 1430:4796 · Select 触发框清空（16×16，与 Input allowClear 同源） */
export const SELECT_CLEAR_ICON_SIZE = ICON_SIZE_M;

/** Select 触发框默认箭头 · 复用 ChevronDownIcon（Figma 15474:48966 / 804:78） */
export function SelectArrowIcon(props: IconProps) {
  return <ChevronDownIcon {...props} />;
}

/** Figma 1430:4796 · Select 触发框清空（与 Input allowClear 同源） */
export function SelectClearIcon({
  size = SELECT_CLEAR_ICON_SIZE,
  className,
  style,
  color = "currentColor",
}: IconProps) {
  return <CloseCircleIcon size={size} className={className} style={style} color={color} />;
}

/** Figma 17694:64400 / 3729:15820 · 下拉浮层已选勾选（16×16 描边对勾） */
export function SelectCheckIcon({
  size = SELECT_CHECK_ICON_SIZE,
  className,
  style,
  color = "currentColor",
}: IconProps) {
  const stroke = color === "currentColor" ? "currentColor" : color;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={iconStyleProps(color, style)}
      aria-hidden
    >
      <path
        d="M3.5 8.5L6.75 11.75L12.75 4.75"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Figma 17460:62565 / 17460:62566 · 数字输入框步进器箭头 */
export function StepperUpIcon({
  size = STEPPER_ICON_SIZE,
  className,
  style,
  color = "currentColor",
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={iconStyleProps(color, style)}
      aria-hidden
    >
      <path
        d="M4.60718 3.21828C4.82414 3.00132 5.1759 3.00132 5.39286 3.21828L8.17064 5.99606C8.32952 6.15494 8.37705 6.3939 8.29107 6.60149C8.20508 6.80909 8.0025 6.94445 7.7778 6.94445H2.22224C1.99754 6.94445 1.79496 6.80909 1.70897 6.60149C1.62298 6.3939 1.67051 6.15494 1.8294 5.99606L4.60718 3.21828Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Figma 17460:62566 / 2535:10559 · 数字输入框步进器向下（10×10 容器内 6.67×3.89 圆角三角） */
export function StepperDownIcon({
  size = STEPPER_ICON_SIZE,
  className,
  style,
  color = "currentColor",
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={iconStyleProps(color, style)}
      aria-hidden
    >
      <path
        d="M1.70897 3.39851C1.79496 3.19092 1.99754 3.05556 2.22224 3.05556H7.7778C8.0025 3.05556 8.20508 3.19092 8.29107 3.39851C8.37705 3.60611 8.32952 3.84507 8.17064 4.00395L5.39286 6.78173C5.1759 6.99869 4.82414 6.99869 4.60718 6.78173L1.8294 4.00395C1.67051 3.84507 1.62298 3.60611 1.70897 3.39851Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Figma 804:81 · left 箭头向左（简约搜索返回 · 8116:29008 链接按钮） */
export function ChevronLeftIcon({
  size = ICON_SIZE_M,
  className,
  style,
  color = "currentColor",
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={iconStyleProps(color, style)}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.94171 7.30957C5.57477 7.6909 5.57477 8.30914 5.94171 8.69047L9.26381 12.1427C9.50844 12.3969 9.90506 12.3969 10.1497 12.1427C10.3943 11.8885 10.3943 11.4763 10.1497 11.2221L7.04908 8.00002L10.1497 4.77794C10.3943 4.52373 10.3943 4.11156 10.1497 3.85735C9.90506 3.60313 9.50844 3.60313 9.26381 3.85735L5.94171 7.30957Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Figma 804:78 · 箭头向下（选择器 / 更多下拉专用） */
export function ChevronDownIcon({
  size = ICON_SIZE_M,
  className,
  style,
  color = "currentColor",
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={iconStyleProps(color, style)}
      aria-hidden
    >
      <path
        d="M4.05077 6.07817C4.15395 5.82905 4.39704 5.66663 4.66669 5.66663H11.3334C11.603 5.66663 11.8461 5.82905 11.9493 6.07817C12.0525 6.32729 11.9954 6.61403 11.8048 6.8047L8.47142 10.138C8.21107 10.3984 7.78896 10.3984 7.52861 10.138L4.19528 6.8047C4.00462 6.61403 3.94758 6.32729 4.05077 6.07817Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Figma 804:79 · 箭头向上（选择器 / 更多下拉展开） */
export function ChevronUpIcon({
  size = ICON_SIZE_M,
  className,
  style,
  color = "currentColor",
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={iconStyleProps(color, style)}
      aria-hidden
    >
      <path
        d="M7.52861 5.86189C7.78896 5.60154 8.21107 5.60154 8.47142 5.86189L11.8048 9.19522C11.9954 9.38589 12.0525 9.67263 11.9493 9.92175C11.8461 10.1709 11.603 10.3333 11.3334 10.3333H4.66669C4.39704 10.3333 4.15395 10.1709 4.05077 9.92175C3.94758 9.67263 4.00462 9.38589 4.19528 9.19522L7.52861 5.86189Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Figma 1430:4796 · 一键清除 */
export function CloseCircleIcon({
  size = ICON_SIZE_M,
  className,
  style,
  color = "currentColor",
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={iconStyleProps(color, style)}
      aria-hidden
    >
      <path
        opacity={0.3}
        d="M0.666748 7.99996C0.666748 3.94987 3.94999 0.666626 8.00008 0.666626C12.0502 0.666626 15.3334 3.94987 15.3334 7.99996C15.3334 12.05 12.0502 15.3333 8.00008 15.3333C3.94999 15.3333 0.666748 12.05 0.666748 7.99996Z"
        fill="currentColor"
      />
      <path
        d="M5.19526 5.19526C5.45561 4.93491 5.87772 4.93491 6.13807 5.19526L8 7.05719L9.86193 5.19526C10.1223 4.93491 10.5444 4.93491 10.8047 5.19526C11.0651 5.45561 11.0651 5.87772 10.8047 6.13807L8.94281 8L10.8047 9.86193C11.0651 10.1223 11.0651 10.5444 10.8047 10.8047C10.5444 11.0651 10.1223 11.0651 9.86193 10.8047L8 8.94281L6.13807 10.8047C5.87772 11.0651 5.45561 11.0651 5.19526 10.8047C4.93491 10.5444 4.93491 10.1223 5.19526 9.86193L7.05719 8L5.19526 6.13807C4.93491 5.87772 4.93491 5.45561 5.19526 5.19526Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Figma 16211:56216 · 编辑器加号（editor-add） */
export function EditorAddIcon({
  size = ICON_SIZE_M,
  className,
  style,
  color = "currentColor",
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={iconStyleProps(color, style)}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.66675 3.33337C8.66675 2.96518 8.36827 2.66671 8.00008 2.66671C7.63189 2.66671 7.33341 2.96518 7.33341 3.33337V7.33337H3.33341C2.96522 7.33337 2.66675 7.63185 2.66675 8.00004C2.66675 8.36823 2.96522 8.66671 3.33341 8.66671H7.33341V12.6667C7.33341 13.0349 7.63189 13.3334 8.00008 13.3334C8.36827 13.3334 8.66675 13.0349 8.66675 12.6667V8.66671H12.6667C13.0349 8.66671 13.3334 8.36823 13.3334 8.00004C13.3334 7.63185 13.0349 7.33337 12.6667 7.33337H8.66675V3.33337Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Figma 803:276 · 更多（more） */
export function MoreIcon({
  size = ICON_SIZE_M,
  className,
  style,
  color = "currentColor",
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={iconStyleProps(color, style)}
      aria-hidden
    >
      <path
        d="M2.33341 9.66668C1.73797 9.66668 1.18776 9.34901 0.890039 8.83334C0.592318 8.31768 0.592318 7.68235 0.890039 7.16668C1.18776 6.65101 1.73797 6.33334 2.33341 6.33334C3.25389 6.33334 4.00008 7.07954 4.00008 8.00001C4.00008 8.92049 3.25389 9.66668 2.33341 9.66668Z"
        fill="currentColor"
      />
      <path
        d="M8.00008 9.66668C7.40464 9.66668 6.85443 9.34901 6.5567 8.83334C6.25898 8.31768 6.25898 7.68235 6.5567 7.16668C6.85443 6.65101 7.40464 6.33334 8.00008 6.33334C8.92056 6.33334 9.66675 7.07954 9.66675 8.00001C9.66675 8.92049 8.92056 9.66668 8.00008 9.66668Z"
        fill="currentColor"
      />
      <path
        d="M12.2234 8.83334C12.5211 9.34901 13.0713 9.66668 13.6667 9.66668C14.5872 9.66668 15.3334 8.92049 15.3334 8.00001C15.3334 7.07954 14.5872 6.33334 13.6667 6.33334C13.0713 6.33334 12.5211 6.65101 12.2234 7.16668C11.9257 7.68235 11.9257 8.31768 12.2234 8.83334Z"
        fill="currentColor"
      />
    </svg>
  );
}
