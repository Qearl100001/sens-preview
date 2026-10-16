import { useEffect, useId, useRef, useState, type ChangeEvent, type CSSProperties, type DragEvent, type ReactElement, type ReactNode } from "react";
import { getColorToken, tokenRgba } from "../design-system/color-utils";
import { SensIcon } from "../design-system/icons";
import { buildFunctionalActiveRingShadow, functionalCssVar } from "../design-system/functional-skin";
import { getTypographyToken } from "../design-system/typography";
import { getUnitToken } from "../design-system/unit";
import { SensButton } from "./SensButton";
import { SensTips } from "./SensTips";
import uploadFailedSpinner from "./assets/upload-failed-spinner.svg";
import "./upload.css";

export type SensUploadMode = "file" | "image";
export type SensUploadStatus = "uploading" | "done" | "error";
export type SensUploadRetryLabel = "续传" | "重试";

export interface SensUploadFile {
  uid: string;
  name: string;
  size?: number;
  type?: string;
  status?: SensUploadStatus;
  percent?: number;
  uploadedSize?: number;
  url?: string;
  errorMessage?: string;
  retryLabel?: SensUploadRetryLabel;
}

export interface SensUploadProps {
  mode?: SensUploadMode;
  files?: SensUploadFile[];
  defaultFiles?: SensUploadFile[];
  onChange?: (files: SensUploadFile[]) => void;
  onCancel?: (file: SensUploadFile) => void;
  onDownload?: (file: SensUploadFile) => void;
  onRetry?: (file: SensUploadFile) => void;
  onPreview?: (file: SensUploadFile) => void;
  accept?: string;
  multiple?: boolean;
  maxCount?: number;
  disabled?: boolean;
  readOnly?: boolean;
  dragEnabled?: boolean;
  showFileControls?: boolean;
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
    "--sens-upload-primary": functionalCssVar("--sens-skin-primary", "component-primary"),
    "--sens-upload-warning": getColorToken("warning-color"),
    "--sens-upload-warning-hover": getColorToken("warning-color-hover"),
    "--sens-upload-warning-active": getColorToken("warning-color-active"),
    "--sens-upload-warning-active-shadow": getColorToken("warning-color-active-shadow"),
    "--sens-upload-warning-bg": getColorToken("warning-light-background"),
    "--sens-upload-image-mask": getColorToken("mask-01-transparent"),
    "--sens-upload-preview-white": getColorToken("white"),
    "--sens-upload-preview-close": getColorToken("text-color-transparent"),
    "--sens-upload-preview-arrow": getColorToken("text-article-color-transparent"),
    "--sens-upload-preview-selected-bg": functionalCssVar("--sens-skin-light-bg", "component-active-background"),
    "--sens-upload-image-action-hover": getColorToken("link-color"),
    "--sens-upload-image-action-active": getColorToken("link-active-color"),
    "--sens-upload-image-add-bg": getColorToken("background-transparent-grey"),
    "--sens-upload-image-add-hover-bg": getColorToken("background-transparent-grey"),
    "--sens-upload-image-add-border": getColorToken("divideline-color-transparent-dack"),
    "--sens-upload-image-add-disabled-bg": getColorToken("background-04-transparent"),
    "--sens-upload-image-add-disabled-hover-bg": getColorToken("background-04-transparent"),
    "--sens-upload-image-add-disabled-border": getColorToken("line-color-transparent"),
    "--sens-upload-image-add-disabled-hover-border": getColorToken("line-color-transparent"),
    "--sens-upload-image-add-disabled-hover-text": getColorToken("text-color-transparent-disable-hover"),
    "--sens-upload-image-add-active": functionalCssVar("--sens-skin-active", "component-active"),
    "--sens-upload-image-add-active-shadow": buildFunctionalActiveRingShadow(),
    "--sens-upload-readonly": getColorToken("background-transparent-grey-hover"),
    "--sens-upload-track": getColorToken("divideline-color-transparent-light"),
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
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
}

function isImageFile(file: Pick<SensUploadFile, "name" | "type">) {
  return file.type?.startsWith("image/") || /\.(apng|avif|gif|jpe?g|png|svg|webp)$/i.test(file.name);
}

function makeUploadFile(file: File): SensUploadFile {
  return {
    uid: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
    name: file.name,
    size: file.size,
    type: file.type,
    url: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
  };
}

function splitFileName(name: string) {
  const extensionStart = name.lastIndexOf(".");
  if (extensionStart <= 0) return { stem: name, extension: "" };
  return { stem: name.slice(0, extensionStart), extension: name.slice(extensionStart) };
}

function MiddleEllipsizedFileName({ name }: { name: string }) {
  const nameRef = useRef<HTMLSpanElement>(null);
  const [displayName, setDisplayName] = useState(name);

  useEffect(() => {
    const element = nameRef.current;
    if (!element) return;

    const update = () => {
      const availableWidth = element.clientWidth;
      if (!availableWidth) return;

      const { stem, extension } = splitFileName(name);
      const characters = Array.from(stem);
      const context = document.createElement("canvas").getContext("2d");
      if (!context) return;
      context.font = getComputedStyle(element).font;

      const measure = (value: string) => context.measureText(value).width;
      if (measure(name) <= availableWidth) {
        setDisplayName(name);
        return;
      }

      const fits = (keptCharacters: number) => {
        const prefixCount = Math.ceil(keptCharacters * 0.65);
        const suffixCount = keptCharacters - prefixCount;
        const prefix = characters.slice(0, prefixCount).join("");
        const suffix = suffixCount ? characters.slice(-suffixCount).join("") : "";
        return measure(`${prefix}…${suffix}${extension}`) <= availableWidth;
      };

      let low = 0;
      let high = characters.length;
      while (low < high) {
        const middle = Math.ceil((low + high) / 2);
        if (fits(middle)) low = middle;
        else high = middle - 1;
      }

      const prefixCount = Math.ceil(low * 0.65);
      const suffixCount = low - prefixCount;
      const prefix = characters.slice(0, prefixCount).join("");
      const suffix = suffixCount ? characters.slice(-suffixCount).join("") : "";
      setDisplayName(`${prefix}…${suffix}${extension}`);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [name]);

  return <span ref={nameRef} className="sens-upload__file-name" title={name}>{displayName}</span>;
}

export function SensUpload({
  mode = "file",
  files: filesProp,
  defaultFiles = [],
  onChange,
  onCancel,
  onDownload,
  onRetry,
  onPreview,
  accept,
  multiple = true,
  maxCount,
  disabled = false,
  readOnly = false,
  dragEnabled = false,
  showFileControls = true,
  requiredError,
  help,
  action,
  className,
  "aria-label": ariaLabel,
}: SensUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef(new Set<string>());
  const [localFiles, setLocalFiles] = useState(defaultFiles);
  const [dragOver, setDragOver] = useState(false);
  const controlled = filesProp !== undefined;
  const files = filesProp ?? localFiles;
  const locked = disabled || readOnly;
  const atLimit = (maxCount !== undefined && files.length >= maxCount) || (!multiple && files.length >= 1);
  const canAdd = !locked && !atLimit;
  const withLimitTip = (control: ReactElement, drag = false) => {
    if (!atLimit || locked) return control;
    return (
      <SensTips title={`最多可上传 ${maxCount ?? 1} 个文件`} placement="top" className={drag ? "sens-upload__limit-tip--drag" : undefined}>
        <span className={`sens-upload__limit-tip-target${drag ? " sens-upload__limit-tip-target--drag" : ""}`}>{control}</span>
      </SensTips>
    );
  };
  const singleDropMode = mode === "file" && dragEnabled && !multiple;
  const singleDropFile = singleDropMode ? files[0] : undefined;
  const singleDropStatus = singleDropFile?.status ?? "done";
  const singleDropImage = singleDropFile && singleDropStatus === "done" && isImageFile(singleDropFile) && singleDropFile.url ? singleDropFile : undefined;
  const singleDropStatusFile = singleDropFile && (singleDropStatus === "uploading" || singleDropStatus === "error") ? singleDropFile : undefined;
  const showRegularFileList = mode === "file" && files.length > 0 && (!singleDropMode || (!singleDropImage && !singleDropStatusFile));
  const tokenVars = buildSensUploadTokenVars();

  useEffect(() => () => {
    objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrlsRef.current.clear();
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
    additions.forEach((file) => { if (file.url?.startsWith("blob:")) objectUrlsRef.current.add(file.url); });
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
    if (file.url?.startsWith("blob:")) {
      URL.revokeObjectURL(file.url);
      objectUrlsRef.current.delete(file.url);
    }
    updateFiles(files.filter((entry) => entry.uid !== file.uid));
  };

  const openPicker = () => {
    if (canAdd) inputRef.current?.click();
  };

  const renderAddControl = (drag = false) => withLimitTip((
    <button
      type="button"
      className={`sens-upload__add${mode === "image" ? " sens-upload__add--image" : ""}${drag ? " sens-upload__add--drag" : ""}${dragOver ? " is-drag-over" : ""}${(mode === "image" || singleDropMode) && requiredError && files.length === 0 ? " is-required-error" : ""}`}
      onClick={openPicker}
      onDragEnter={(event) => { if (dragEnabled) { event.preventDefault(); setDragOver(true); } }}
      onDragOver={(event) => { if (dragEnabled) event.preventDefault(); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      disabled={!canAdd}
      aria-label={ariaLabel ?? (mode === "image" ? "上传图片" : "上传文件")}
    >
      <SensIcon name="upload" size={drag ? 24 : mode === "image" ? 20 : 16} color={mode === "image" ? "currentColor" : undefined} colorRole={mode === "image" ? undefined : locked ? "disabled" : "subtle"} />
      {drag ? <><span className="sens-upload__drag-title">点击或拖拽文件到此处上传</span><span className="sens-upload__helper-text">{help ?? "支持单张和批量上传"}</span></> : mode === "image" ? <span className="sens-upload__helper-text">{requiredError && files.length === 0 ? "请上传" : "上传图片"}</span> : <span>上传文件</span>}
    </button>
  ), drag);

  return (
    <div className={`sens-upload sens-upload--${mode}${dragEnabled ? " sens-upload--drag" : ""}${singleDropMode ? " sens-upload--single-dropzone" : ""}${disabled ? " is-disabled" : ""}${readOnly ? " is-readonly" : ""}${className ? ` ${className}` : ""}`} style={tokenVars}>
      <input ref={inputRef} id={inputId} className="sens-upload__input" type="file" accept={accept} multiple={multiple} disabled={!canAdd} onChange={handleInput} aria-label={ariaLabel ?? "选择上传文件"} />
      {mode === "file" && showFileControls && dragEnabled && !readOnly && !(singleDropMode && files.length > 0) ? <div className="sens-upload__file-drop">{renderAddControl(true)}</div> : null}
      {mode === "image" && showFileControls && dragEnabled && !readOnly ? <div className="sens-upload__file-drop">{renderAddControl(true)}</div> : null}
      {mode === "file" && showFileControls && !dragEnabled ? (
        <div className="sens-upload__toolbar">
          {!readOnly ? withLimitTip(<SensButton tone="secondary" disabled={!canAdd} onClick={openPicker}>上传文件</SensButton>) : null}
          <div className="sens-upload__toolbar-meta">{help ? <span>{help}</span> : null}{action}</div>
        </div>
      ) : null}
      {mode === "image" ? <div className="sens-upload__image-grid">{files.map((file) => (
        <div key={file.uid} className={`sens-upload__image-item${file.status === "error" ? " is-error" : ""}${file.status === "uploading" ? " is-uploading" : ""}`}>
          {file.status !== "uploading" && file.status !== "error" ? file.url ? <img src={file.url} alt={file.name} /> : <SensIcon name="attachment" sizeToken="size/icon/l" colorRole="subtle" /> : null}
          {file.status === "uploading" ? <div className="sens-upload__image-progress" role="progressbar" aria-valuenow={file.percent ?? 0} aria-valuemin={0} aria-valuemax={100} aria-label="图片上传进度"><span className="sens-upload__image-spinner" aria-hidden="true" />{onCancel && !locked ? <SensTips title="取消上传文件" placement="top"><SensButton className="sens-upload__image-cancel" tone="linkWeak" restingColorToken="link-color" size="small" onClick={() => onCancel(file)}>取消</SensButton></SensTips> : null}</div> : null}
          {file.status === "error" ? <div className="sens-upload__image-error">{file.retryLabel === "续传" ? <img className="sens-upload__image-error-icon" src={uploadFailedSpinner} alt="" /> : <SensIcon name="error" variant="filled" size={20} colorRole="warning" />}<span>{file.errorMessage ?? "上传失败"}</span></div> : null}
          {!disabled && file.status !== "uploading" && (!readOnly || file.status === "done" || file.status === undefined) ? <div className="sens-upload__image-actions">
            {file.status === "done" || file.status === undefined ? <button className="sens-upload__image-action sens-upload__image-action--primary" type="button" onClick={() => onPreview?.(file)} aria-label={`预览${file.name}`}><SensIcon name="visible" colorRole="inherit" /></button> : null}
            {file.status === "error" && file.retryLabel ? <button className="sens-upload__image-action sens-upload__image-action--primary" type="button" onClick={() => onRetry?.(file)} aria-label={`${file.retryLabel}${file.name}`}><SensIcon name="reload" colorRole="inherit" /></button> : null}
            {!readOnly ? <button className="sens-upload__image-action sens-upload__image-action--danger" type="button" onClick={() => removeFile(file)} aria-label={`删除${file.name}`}><SensIcon name="delete" colorRole="inherit" /></button> : null}
          </div> : null}
        </div>
      ))}{!dragEnabled && !readOnly && !atLimit ? renderAddControl() : null}</div> : null}
      {singleDropStatusFile ? (() => {
        const progress = Math.max(0, Math.min(100, singleDropStatusFile.percent ?? (singleDropStatus === "error" ? 100 : 0)));
        const uploadedSize = singleDropStatusFile.uploadedSize ?? Math.round((singleDropStatusFile.size ?? 0) * progress / 100);
        return (
          <div key={singleDropStatusFile.uid} className={`sens-upload__single-status${singleDropStatus === "error" ? " is-error" : ""}`}>
            <div className="sens-upload__single-status-content">
              <div className="sens-upload__single-status-row">
                {singleDropStatus === "uploading" ? (
                  <div className="sens-upload__single-upload-meta"><span>上传中</span><span>{formatFileSize(uploadedSize)} / {formatFileSize(singleDropStatusFile.size)}</span></div>
                ) : (
                  <div className="sens-upload__single-error-meta"><SensIcon name="error" variant="filled" size={14} colorRole="warning" /><span>{singleDropStatusFile.errorMessage ?? "上传失败"}</span></div>
                )}
                <div className="sens-upload__single-actions">
                  {singleDropStatus === "uploading" && onCancel && !locked ? <SensTips title="取消上传文件" placement="top"><SensButton tone="linkWeak" restingColorToken="link-color" size="small" onClick={() => onCancel(singleDropStatusFile)}>取消</SensButton></SensTips> : null}
                  {singleDropStatus === "error" && singleDropStatusFile.retryLabel && !locked ? <SensButton tone="linkWeak" restingColorToken="link-color" size="small" onClick={() => onRetry?.(singleDropStatusFile)}>{singleDropStatusFile.retryLabel}</SensButton> : null}
                  {singleDropStatus === "error" && !locked ? <SensButton tone="dangerLinkWeak" restingColorToken="link-color" size="small" onClick={() => removeFile(singleDropStatusFile)}>删除</SensButton> : null}
                </div>
              </div>
              <div className="sens-upload__progress-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={singleDropStatus === "uploading" ? "上传进度" : "失败时已完成的进度"}>
                <div className={`sens-upload__progress${singleDropStatus === "error" ? " is-error" : ""}`} style={{ "--sens-upload-progress": `${progress}%` } as CSSProperties} />
              </div>
            </div>
          </div>
        );
      })() : null}
      {singleDropImage ? (
        <div className="sens-upload__single-image">
          <img className="sens-upload__single-image-content" src={singleDropImage.url} alt={singleDropImage.name} />
          {!disabled ? <div className="sens-upload__single-image-actions">
            <button className="sens-upload__image-action sens-upload__image-action--primary" type="button" onClick={() => onPreview?.(singleDropImage)} aria-label={`预览${singleDropImage.name}`}><SensIcon name="visible" size={16} colorRole="inherit" /></button>
            {!readOnly ? <button className="sens-upload__image-action sens-upload__image-action--danger" type="button" onClick={() => removeFile(singleDropImage)} aria-label={`删除${singleDropImage.name}`}><SensIcon name="delete" size={16} colorRole="inherit" /></button> : null}
          </div> : null}
        </div>
      ) : null}
      {showRegularFileList ? <ul className="sens-upload__file-list">{files.map((file) => {
        const status = file.status ?? "done";
        const showImageThumbnail = status === "done" && isImageFile(file) && Boolean(file.url);
        const progress = Math.max(0, Math.min(100, file.percent ?? (status === "error" ? 100 : 0)));
        const uploadedSize = file.uploadedSize ?? Math.round((file.size ?? 0) * progress / 100);
        return (
          <li key={file.uid} className={`sens-upload__file${status === "error" ? " is-error" : ""}${readOnly ? " is-readonly" : ""}${showImageThumbnail ? " is-image-preview" : ""}`}>
            <div className="sens-upload__file-main">
              {showImageThumbnail ? <img className="sens-upload__file-thumbnail" src={file.url} alt={file.name} /> : null}
              <div className="sens-upload__file-heading">
                {!showImageThumbnail ? <SensIcon name="attachment" sizeToken="size/icon/m" colorRole="subtle" /> : null}
                <MiddleEllipsizedFileName name={file.name} />
                {status === "done" || readOnly ? <span className="sens-upload__file-size">{formatFileSize(file.size)}</span> : null}
                {readOnly && onDownload ? <SensButton className="sens-upload__action-button" tone="linkWeak" restingColorToken="link-color" size="small" onClick={() => onDownload(file)}>下载</SensButton> : null}
                {status === "done" && !locked ? <SensButton className="sens-upload__action-button" tone="dangerLinkWeak" restingColorToken="link-color" size="small" onClick={() => removeFile(file)}>删除</SensButton> : null}
              </div>
              {status === "uploading" || status === "error" ? (
                <div className="sens-upload__file-detail">
                  <div className="sens-upload__file-detail-row">
                    {status === "uploading" ? (
                      <div className="sens-upload__upload-meta"><span>上传中</span><span>{formatFileSize(uploadedSize)} / {formatFileSize(file.size)}</span></div>
                    ) : (
                      <div className="sens-upload__error-meta"><SensIcon name="error" variant="filled" colorRole="warning" /><span>{file.errorMessage ?? "上传失败"}</span></div>
                    )}
                    <div className="sens-upload__file-actions">
                      {status === "uploading" && onCancel && !locked ? <SensTips title="取消上传文件" placement="top"><SensButton className="sens-upload__action-button" tone="linkWeak" restingColorToken="link-color" size="small" onClick={() => onCancel(file)}>取消</SensButton></SensTips> : null}
                      {status === "error" && file.retryLabel && !locked ? <SensButton className="sens-upload__action-button" tone="linkWeak" restingColorToken="link-color" size="small" onClick={() => onRetry?.(file)}>{file.retryLabel}</SensButton> : null}
                      {status === "error" && !locked ? <SensButton className="sens-upload__action-button" tone="dangerLinkWeak" restingColorToken="link-color" size="small" onClick={() => removeFile(file)}>删除</SensButton> : null}
                    </div>
                  </div>
                  <div className="sens-upload__progress-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={status === "uploading" ? "上传进度" : "失败时已完成的进度"}>
                    <div className={`sens-upload__progress${status === "error" ? " is-error" : ""}`} style={{ "--sens-upload-progress": `${progress}%` } as CSSProperties} />
                  </div>
                </div>
              ) : null}
            </div>
          </li>
        );
      })}</ul> : null}
      {requiredError && mode !== "image" ? <div className="sens-upload__required-error"><SensIcon name="error" variant="filled" colorRole="warning" />{requiredError}</div> : null}
    </div>
  );
}
