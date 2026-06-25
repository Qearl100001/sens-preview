import { useCallback, useState, type ChangeEvent } from "react";
import type { InputProps } from "antd";

export interface UseMinimalSearchValueOptions {
  value?: InputProps["value"];
  defaultValue?: InputProps["defaultValue"];
  onChange?: InputProps["onChange"];
  onBack?: () => void;
}

export interface UseMinimalSearchValueResult {
  value: string;
  setValue: (next: string) => void;
  hasValue: boolean;
  resetValue: () => void;
  handleChange: InputProps["onChange"];
}

function normalizeInputValue(raw: InputProps["value"] | InputProps["defaultValue"]): string {
  if (raw === undefined || raw === null) return "";
  return String(raw);
}

/** 简约搜索受控/非受控值 + 返回清空（对齐 useSelectDropdownSearch.resetSearch） */
export function useMinimalSearchValue({
  value: valueProp,
  defaultValue,
  onChange,
  onBack,
}: UseMinimalSearchValueOptions): UseMinimalSearchValueResult {
  const [innerValue, setInnerValue] = useState(() => normalizeInputValue(defaultValue));
  const isControlled = valueProp !== undefined;
  const value = isControlled ? normalizeInputValue(valueProp) : innerValue;
  const hasValue = value.length > 0;

  const setValue = useCallback(
    (next: string) => {
      if (!isControlled) {
        setInnerValue(next);
      }
      onChange?.({
        target: { value: next },
        currentTarget: { value: next },
      } as ChangeEvent<HTMLInputElement>);
    },
    [isControlled, onChange],
  );

  const resetValue = useCallback(() => {
    setValue("");
    onBack?.();
  }, [onBack, setValue]);

  const handleChange: InputProps["onChange"] = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const next = event.target.value;
      if (!isControlled) {
        setInnerValue(next);
      }
      onChange?.(event);
    },
    [isControlled, onChange],
  );

  return { value, setValue, hasValue, resetValue, handleChange };
}
