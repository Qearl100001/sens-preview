import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { getColorToken, tokenRgba } from "../../design-system/color-utils";
import { getDividerBorder } from "../../design-system/divider";
import { getTypographyToken } from "../../design-system/typography";
import {
  SensButton,
  SensDrawer,
  SensInput,
  SensSelectDropdown,
  SensTextArea,
  SensTitleBar,
} from "../../ui";
import tokens from "../../design-system/tokens.resolved.json";
import type { ConnectionFormFieldSpec, DataSourceSpec } from "./dataSourceTypes";

const u = tokens.unit as Record<string, number>;

export type CreateConnectionValues = Record<string, string>;

export interface CreateConnectionDrawerProps {
  spec: DataSourceSpec;
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CreateConnectionValues) => void;
}

function createEmptyValues(fields: ConnectionFormFieldSpec[]): CreateConnectionValues {
  return Object.fromEntries(fields.map((field) => [field.key, ""]));
}

function ConnectionFormField({
  label,
  required,
  helpText,
  children,
}: {
  label: string;
  required?: boolean;
  helpText?: string;
  children: ReactNode;
}) {
  const textPrimary = tokenRgba("text-color-transparent", 0.9);
  const textSecondary = tokenRgba("text-sub-color-transparent", 0.58);
  const errorColor = getColorToken("warning-color");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: u["spacing/1x"],
      }}
    >
      <label
        style={{
          color: textPrimary,
          fontSize: getTypographyToken("font-size/m"),
          lineHeight: `${getTypographyToken("line-height/m")}px`,
          fontWeight: getTypographyToken("font-weight/regular"),
        }}
      >
        {label}
        {required ? (
          <span style={{ color: errorColor, marginLeft: u["spacing/0․5x"] }} aria-hidden>
            *
          </span>
        ) : null}
      </label>
      {children}
      {helpText ? (
        <span
          style={{
            color: textSecondary,
            fontSize: getTypographyToken("font-size/s"),
            lineHeight: `${getTypographyToken("line-height/s")}px`,
          }}
        >
          {helpText}
        </span>
      ) : null}
    </div>
  );
}

export function CreateConnectionDrawer({ spec, open, onClose, onSubmit }: CreateConnectionDrawerProps) {
  const fields = spec.createConnection.fields;
  const mapping = spec.createConnection.accountMapping;
  const [values, setValues] = useState<CreateConnectionValues>(() => createEmptyValues(fields));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mappingSource, setMappingSource] = useState<string | undefined>();
  const [mappingTarget, setMappingTarget] = useState<string | undefined>();

  const textPrimary = tokenRgba("text-color-transparent", 0.9);
  const textSecondary = tokenRgba("text-sub-color-transparent", 0.58);
  const panelBorder = getDividerBorder("outline", "transparent");
  const panelBackground = tokenRgba("background-transparent-grey", 0.04);

  useEffect(() => {
    if (!open) return;
    setValues(createEmptyValues(fields));
    setErrors({});
    setMappingSource(undefined);
    setMappingTarget(undefined);
  }, [open, fields]);

  const setFieldValue = (key: string, nextValue: string) => {
    setValues((current) => ({ ...current, [key]: nextValue }));
    if (errors[key]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[key];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    fields.forEach((field) => {
      if (field.required && !values[field.key]?.trim()) {
        nextErrors[field.key] = `请输入${field.label}`;
      }
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(values);
    setValues(createEmptyValues(fields));
    setErrors({});
  };

  const renderFieldControl = (field: ConnectionFormFieldSpec) => {
    const fieldError = errors[field.key];
    const commonProps = {
      placeholder: field.placeholder,
      value: values[field.key] ?? "",
      warningPlacement: fieldError ? ("outside" as const) : undefined,
      help: fieldError,
    };

    if (field.type === "password") {
      return (
        <SensInput
          {...commonProps}
          type="password"
          autoComplete="new-password"
          onChange={(event) => setFieldValue(field.key, event.target.value)}
        />
      );
    }

    if (field.type === "textarea") {
      return (
        <SensTextArea
          {...commonProps}
          onChange={(event) => setFieldValue(field.key, event.target.value)}
        />
      );
    }

    if (field.type === "select") {
      return (
        <SensSelectDropdown
          {...commonProps}
          style={{ width: "100%" }}
          options={field.options?.map((option) => ({ label: option, value: option }))}
          onChange={(nextValue) => setFieldValue(field.key, String(nextValue ?? ""))}
        />
      );
    }

    return (
      <SensInput
        {...commonProps}
        onChange={(event) => setFieldValue(field.key, event.target.value)}
      />
    );
  };

  if (!open) return null;

  return (
    <SensDrawer
      open={open}
      onClose={onClose}
      size="medium"
      titleBar={
        <SensTitleBar
          title={spec.createConnection.title}
          onBack={onClose}
          actions={
            <>
              <SensButton tone="secondary" onClick={onClose}>
                取消
              </SensButton>
              <SensButton tone="primary" onClick={handleSubmit}>
                {spec.createConnection.submitLabel}
              </SensButton>
            </>
          }
        />
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: u["spacing/4x"],
        }}
      >
        {fields.map((field) => (
          <ConnectionFormField
            key={field.key}
            label={field.label}
            required={field.required}
            helpText={field.helpText}
          >
            {renderFieldControl(field)}
          </ConnectionFormField>
        ))}

        {mapping ? (
          <div
            style={{
              padding: u["spacing/4x"],
              border: panelBorder,
              borderRadius: u["radius/m"],
              background: panelBackground,
              display: "flex",
              flexDirection: "column",
              gap: u["spacing/3x"],
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: u["spacing/1x"] }}>
              <span
                style={{
                  color: textPrimary,
                  fontSize: getTypographyToken("font-size/m"),
                  lineHeight: `${getTypographyToken("line-height/m")}px`,
                  fontWeight: getTypographyToken("font-weight/medium"),
                }}
              >
                {mapping.title}
              </span>
              <span
                style={{
                  color: textSecondary,
                  fontSize: getTypographyToken("font-size/s"),
                  lineHeight: `${getTypographyToken("line-height/s")}px`,
                }}
              >
                {mapping.description}
              </span>
            </div>
            <div style={{ display: "flex", gap: u["spacing/2x"], width: "100%" }}>
              <SensSelectDropdown
                placeholder={mapping.sourceLabel}
                style={{ flex: 1, minWidth: 0 } as CSSProperties}
                value={mappingSource}
                options={mapping.sourceOptions.map((option) => ({ label: option, value: option }))}
                onChange={(nextValue) => setMappingSource(String(nextValue ?? ""))}
              />
              <SensSelectDropdown
                placeholder={mapping.targetLabel}
                style={{ flex: 1, minWidth: 0 } as CSSProperties}
                value={mappingTarget}
                options={mapping.targetOptions.map((option) => ({ label: option, value: option }))}
                onChange={(nextValue) => setMappingTarget(String(nextValue ?? ""))}
              />
            </div>
            <SensButton tone="link" onClick={() => { /* TODO: 增加账号映射行 */ }}>
              {mapping.addLabel}
            </SensButton>
          </div>
        ) : null}
      </div>
    </SensDrawer>
  );
}
