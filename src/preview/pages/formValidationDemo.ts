import { useLayoutEffect, useRef, useState } from "react";

/** 预览 Demo 用校验句；公式见 `docs/agent-rules/copywriting.md`。 */
export const REQUIRED_INPUT_ERROR = "不能为空，请输入";
export const REQUIRED_SELECT_ERROR = "不能为空，请选择";

export function requiredTextError(value: string | undefined): string | undefined {
  return String(value ?? "").trim() ? undefined : REQUIRED_INPUT_ERROR;
}

export function requiredSelectError(value: string | undefined): string | undefined {
  return String(value ?? "").trim() ? undefined : REQUIRED_SELECT_ERROR;
}

export function scrollToFirstFormError(root?: ParentNode | null): boolean {
  const item = (root ?? document).querySelector(".sens-form-item--error");
  if (!(item instanceof HTMLElement)) return false;
  item.scrollIntoView({ block: "start", inline: "nearest", behavior: "auto" });
  return true;
}

/**
 * 字段级预览控制器：默认失焦才报；开始修改立即去掉；提交时 `validateNow` 再验。
 * 不进入 `SensForm`；业务表单层自己接同样时序即可。
 */
export function useRequiredField(kind: "input" | "select", initial = "") {
  const [value, setValue] = useState(initial);
  const [error, setError] = useState<string | undefined>();
  const valueRef = useRef(initial);
  const validate = kind === "select" ? requiredSelectError : requiredTextError;

  return {
    value,
    error,
    status: error ? ("error" as const) : undefined,
    onChange(next: string) {
      valueRef.current = next;
      setValue(next);
      setError(undefined);
    },
    onBlur() {
      window.setTimeout(() => {
        setError(validate(valueRef.current));
      }, 0);
    },
    validateNow() {
      const next = validate(valueRef.current);
      setError(next);
      return next;
    },
  };
}

export function useScrollToFirstFormError(
  request: number,
  rootRef: { current: HTMLElement | null },
  extraKey?: unknown,
) {
  useLayoutEffect(() => {
    if (request === 0) return;
    scrollToFirstFormError(rootRef.current);
  }, [request, rootRef, extraKey]);
}

export function bindRequiredInput(field: ReturnType<typeof useRequiredField>) {
  return {
    value: field.value,
    status: field.status,
    onChange: (event: { target: { value: string } }) => field.onChange(event.target.value),
    onBlur: field.onBlur,
  };
}

export function bindRequiredSelect(field: ReturnType<typeof useRequiredField>) {
  return {
    value: field.value || undefined,
    status: field.status,
    onChange: (next: unknown) => field.onChange(String(next ?? "")),
    onBlur: field.onBlur,
    onOpenChange: (open: boolean) => {
      if (!open) field.onBlur();
    },
  };
}
