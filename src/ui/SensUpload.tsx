import { useEffect, useId, useRef, useState, type ChangeEvent, type CSSProperties, type DragEvent, type ReactNode } from "react";
import { getColorToken, tokenRgba } from "../design-system/color-utils";
import { SensIcon } from "../design-system/icons";
import { getTypographyToken } from "../design-system/typography";
import { getUnitToken } from "../design-system/unit";
import { SensButton } from "./SensButton";
import "./upload.css";

export type SensUploadMode = "file" | "image";
export type SensUploadStatus = "uploading" | "done" | "error";

export interface SensUploadFile {
  uid: string;
  name: string;
  size?: number;
  type?: string;
  status?: SensUploadStatus;
  percent?: number;
  url?: string;
  errorMessage?: string;
}

export interface SensUploadProps {
  mode?: SensUploadMode;
  files?: SensUploadFile[];
  defaultFiles?: SensUploadFile[];
  onChange?: (files: SensUploadFile[]) => void;
  onRetry?: (file: SensUploadFile) => void;
  onPreview?: (file: SensUploadFile) => void;
  accept?: string;
  multiple?: boolean;
  maxCount?: number;
  disabled?: boolean;
  readOnly?: boolean;
  dragEnabled?: boolean;
  requiredError?: string;
  help?: ReactNode;
  action?: ReactNode;
  className?: string;
  "aria-label"?: string;
}

export function buildSensUploadTokenVars() {
  return {
    "--sens-upload-text": tokenRgba("text-color-transparent", 0.9),
    "--sens-upload-subtle": tokenRgba("text-sub-color-transparent", 0.58),
    "--sens-upload-disabled": tokenRgba("text-color-transparent-disable", 0.3),
    "--sens-upload-border": tokenRgba("divideline-color-transparent-light", 0.16),
    "--sens-upload-soft-border": tokenRgba("divideline-color-transparent-light", 0.12),
    "--sens-upload-disabled-border": tokenRgba("divideline-color-transparent-light", 0.08),
    "--sens-upload-surface": getColorToken("white"),
    "--sens-upload-hover": tokenRgba("background-transparent-grey", 0.04),
    "--sens-upload-drop": tokenRgba("background-transparent-grey", 0.04),
    "--sens-upload-primary": getColorToken("component-primary"),
    "--sens-upload-link": getColorToken("link-color"),
    "--sens-upload-warning": getColorToken("warning-color"),
    "--sens-upload-warning-bg": getColorToken("warning-light-background"),
    "--sens-upload-radius": `${getUnitToken("radius/m")}px`,
    "--sens-upload-space-1": `${getUnitToken("spacing/1x")}px`,
    "--sens-upload-space-2": `${getUnitToken("spacing/2x")}px`,
    "--sens-upload-space-3": `${getUnitToken("spacing/3x")}px`,
    "--sens-upload-space-4": `${getUnitToken("spacing/4x")}px`,
    "--sens-upload-font": `${getTypographyToken("font-size/m")}px`,
    "--sens-upload-font-sm": `${getTypographyToken("font-size/s")}px`,
    "--sens-upload-line": `${getTypographyToken("line-height/m")}px`,
    "--sens-upload-line-sm": `${getTypographyToken("line-height/s")}px`,
  } as CSSProperties;
}

function formatFileSize(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function makeUploadFile(file: File): SensUploadFile {
  return {
    uid: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
    name: file.name,
    size: file.size,
    type: file.type,
    status: "done",
    url: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
  };
}

export function SensUpload({
  mode = "file",
  files: filesProp,
  defaultFiles = [],
  onChange,
  onRetry,
  onPreview,
  accept,
  multiple = true,
  maxCount,
  disabled = false,
  readOnly = false,
  dragEnabled = false,
  requiredError,
  help,
  action,
  className,
  "aria-label": ariaLabel,
}: SensUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const localFilesRef = useRef(defaultFiles);
  const [localFiles, setLocalFiles] = useState(defaultFiles);
  const [dragOver, setDragOver] = useState(false);
  const controlled = filesProp !== undefined;
  const files = filesProp ?? localFiles;
  const locked = disabled || readOnly;
  const atLimit = (maxCount !== undefined && files.length >= maxCount) || (!multiple && files.length >= 1);
  const canAdd = !locked && !atLimit;
  const tokenVars = buildSensUploadTokenVars();

  useEffect(() => { localFilesRef.current = localFiles; }, [localFiles]);
  useEffect(() => () => {
    localFilesRef.current.forEach((file) => {
      if (file.url?.startsWith("blob:")) URL.revokeObjectURL(file.url);
    });
  }, []);

  const updateFiles = (next: SensUploadFile[]) => {
    if (!controlled) setLocalFiles(next);
    onChange?.(next);
  };

  const addFiles = (incoming: FileList | File[]) => {
    if (!canAdd) return;
    const remaining = maxCount === undefined ? Number.POSITIVE_INFINITY : Math.max(0, maxCount - files.length);
    const selected = Array.from(incoming).slice(0, remaining);
    const additions = selected.slice(0, multiple ? selected.length : Math.max(0, 1 - files.length)).map(makeUploadFile);
    if (additions.length) updateFiles(multiple ? [...files, ...additions] : additions);
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) addFiles(event.currentTarget.files);
    event.currentTarget.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    setDragOver(false);
    if (event.dataTransfer.files) addFiles(event.dataTransfer.files);
  };

  const removeFile = (file: SensUploadFile) => {
    if (locked) return;
    if (file.url?.startsWith("blob:")) URL.revokeObjectURL(file.url);
    updateFiles(files.filter((entry) => entry.uid !== file.uid));
  };

  const openPicker = () => {
    if (canAdd) inputRef.current?.click();
  };

  const renderAddControl = (drag = false) => (
    <button
      type="button"
      className={`sens-upload__add${drag ? " sens-upload__add--drag" : ""}${dragOver ? " is-drag-over" : ""}`}
      onClick={openPicker}
      onDragEnter={(event) => { if (dragEnabled) { event.preventDefault(); setDragOver(true); } }}
      onDragOver={(event) => { if (dragEnabled) event.preventDefault(); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      disabled={!canAdd}
      aria-label={ariaLabel ?? (mode === "image" ? "上传图片" : "上传文件")}
    >
      <SensIcon name="upload" size={drag ? 24 : mode === "image" ? 20 : 16} colorRole={locked ? "disabled" : "subtle"} />
      {drag ? <><span className="sens-upload__drag-title">点击或拖拽文件到此处上传</span><span className="sens-upload__helper-text">{help ?? "支持单张和批量上传"}</span></> : mode === "image" ? <span className="sens-upload__helper-text">上传图片</span> : <span>上传文件</span>}
    </button>
  );

  return (
    <div className={`sens-upload sens-upload--${mode}${dragEnabled ? " sens-upload--drag" : ""}${disabled ? " is-disabled" : ""}${readOnly ? " is-readonly" : ""}${className ? ` ${className}` : ""}`} style={tokenVars}>
      <input ref={inputRef} id={inputId} className="sens-upload__input" type="file" accept={accept} multiple={multiple} disabled={!canAdd} onChange={handleInput} aria-label={ariaLabel ?? "选择上传文件"} />
      {mode === "file" && dragEnabled ? <div className="sens-upload__file-drop">{renderAddControl(true)}</div> : null}
      {mode === "file" && !dragEnabled ? (
        <div className="sens-upload__toolbar">
          {canAdd ? <SensButton tone="secondary" onClick={openPicker}>上传文件</SensButton> : null}
          <div className="sens-upload__toolbar-meta">{help ? <span>{help}</span> : null}{action}</div>
        </div>
      ) : null}
      {mode === "image" ? <div className={`sens-upload__image-grid${dragOver ? " is-drag-over" : ""}`} onDragEnter={(event) => { if (dragEnabled && canAdd) { event.preventDefault(); setDragOver(true); } }} onDragOver={(event) => { if (dragEnabled && canAdd) event.preventDefault(); }} onDragLeave={() => setDragOver(false)} onDrop={dragEnabled ? handleDrop : undefined}>{files.map((file) => (
        <div key={file.uid} className={`sens-upload__image-item${file.status === "error" ? " is-error" : ""}`}>
          {file.url ? <img src={file.url} alt={file.name} /> : <SensIcon name="attachment" sizeToken="size/icon/l" colorRole="subtle" />}
          {file.status === "uploading" ? <div className="sens-upload__image-progress" role="progressbar" aria-valuenow={file.percent ?? 0} /> : null}
          {file.status === "error" ? <div className="sens-upload__image-error"><SensIcon name="error" variant="filled" colorRole="inverse" /><span>{file.errorMessage ?? "上传失败"}</span></div> : null}
          {!locked ? <div className="sens-upload__image-actions">
            {file.status === "error" ? <button type="button" onClick={() => onRetry?.(file)} aria-label={`重试${file.name}`}><SensIcon name="reload" colorRole="inverse" /></button> : <button type="button" onClick={() => onPreview?.(file)} aria-label={`预览${file.name}`}><SensIcon name="visible" colorRole="inverse" /></button>}
            <button type="button" onClick={() => removeFile(file)} aria-label={`删除${file.name}`}><SensIcon name="delete" colorRole="inverse" /></button>
          </div> : null}
        </div>
      ))}{canAdd && !atLimit ? renderAddControl() : null}</div> : null}
      {mode === "file" && files.length ? <ul className="sens-upload__file-list">{files.map((file) => (
        <li key={file.uid} className={`sens-upload__file${file.status === "error" ? " is-error" : ""}${locked ? " is-readonly" : ""}`}>
          <SensIcon name="attachment" sizeToken="size/icon/m" colorRole={file.status === "error" ? "warning" : "subtle"} />
          <span className="sens-upload__file-name" title={file.name}>{file.name}</span>
          <span className="sens-upload__file-size">{file.status === "uploading" ? `${file.percent ?? 0}%` : file.status === "error" ? file.errorMessage ?? "上传失败" : formatFileSize(file.size)}</span>
          {file.status === "uploading" ? <div className="sens-upload__progress" style={{ "--sens-upload-progress": `${file.percent ?? 0}%` } as CSSProperties} role="progressbar" aria-valuenow={file.percent ?? 0} /> : null}
          {file.status === "error" && !locked ? <SensButton tone="link" size="small" onClick={() => onRetry?.(file)}>重试</SensButton> : null}
          {!locked ? <button type="button" className="sens-upload__remove" onClick={() => removeFile(file)} aria-label={`删除${file.name}`}><SensIcon name="delete" sizeToken="size/icon/s" colorRole="subtle" /></button> : null}
        </li>
      ))}</ul> : null}
      {requiredError ? <div className="sens-upload__required-error"><SensIcon name="error" variant="filled" colorRole="warning" />{requiredError}</div> : null}
      {mode === "file" && !dragEnabled && files.length ? <div className="sens-upload__after-list">{canAdd ? <SensButton tone="link" size="small" onClick={openPicker}>继续上传</SensButton> : null}{maxCount ? <span>{files.length}/{maxCount}</span> : null}</div> : null}
      {mode === "image" && maxCount ? <div className="sens-upload__count">{files.length}/{maxCount}</div> : null}
    </div>
  );
}
