import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button, InputNumber, Space, Typography } from "antd";
import { buildSensUploadTokenVars, SensUpload, type SensUploadFile, type SensUploadMode } from "../../ui/SensUpload";
import { SensSwitch, SensViewSwitch } from "../../ui";
import { SensIcon } from "../../design-system/icons";
import previewImage01 from "../assets/upload/preview/preview-image-01.jpg";
import previewImage02 from "../assets/upload/preview/preview-image-02.jpg";
import previewImage03 from "../assets/upload/preview/preview-image-03.jpg";
import previewImage04 from "../assets/upload/preview/preview-image-04.jpg";
import previewImage05 from "../assets/upload/preview/preview-image-05.jpg";
import singleDragSampleImage from "../assets/upload/figma-single-drag-complete.png";
import uploadDesignDoc from "../../design-system/components/base/upload.design.md?raw";
import uploadDevDoc from "../../design-system/components/base/upload.md?raw";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";

const { Text } = Typography;

const previewImages = [previewImage01, previewImage02, previewImage03, previewImage04, previewImage05];
const uploadSampleImage = previewImage01;

function createPreviewImageFiles(): SensUploadFile[] {
  return previewImages.map((url, index) => ({
    uid: `upload-preview-image-${index + 1}`,
    name: `图片预览示例-${index + 1}.jpg`,
    type: "image/jpeg",
    size: 248000 + index * 17300,
    status: "done" as const,
    url,
  }));
}

function advanceDemoProgress(files: SensUploadFile[]) {
  return files.map((file) => {
    if (file.status !== "uploading") return file;
    const percent = Math.min(100, (file.percent ?? 0) + 4);
    return {
      ...file,
      status: percent === 100 ? "done" as const : "uploading" as const,
      percent,
      uploadedSize: Math.round((file.size ?? 0) * percent / 100),
    };
  });
}

function ImagePreviewOverlay({
  files,
  activeIndex,
  onSelect,
  onClose,
}: {
  files: SensUploadFile[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}) {
  const [startIndex, setStartIndex] = useState(() => Math.min(Math.floor(activeIndex / 4) * 4, Math.max(0, files.length - 4)));
  const activeFile = files[activeIndex];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    setStartIndex(Math.min(Math.floor(activeIndex / 4) * 4, Math.max(0, files.length - 4)));
  }, [activeIndex, files.length]);

  if (!activeFile?.url) return null;
  const visibleFiles = files.slice(startIndex, startIndex + 4);
  const canNavigate = files.length > 4;
  const movePage = (direction: -1 | 1) => {
    const nextStart = Math.max(0, Math.min(files.length - 4, startIndex + direction * 4));
    setStartIndex(nextStart);
    const nextSelection = direction > 0 && nextStart === files.length - 4 ? files.length - 1 : nextStart;
    onSelect(nextSelection);
  };

  return createPortal(
    <div className="sens-upload-preview" style={buildSensUploadTokenVars()} role="dialog" aria-modal="true" aria-label={`图片预览：${activeFile.name}`}>
      <div className="sens-upload-preview__content">
        <figure className="sens-upload-preview__figure">
          <img className="sens-upload-preview__main-image" src={activeFile.url} alt={activeFile.name} />
          <figcaption>图片上传于：2020-08-04 16:43:45</figcaption>
        </figure>
        <div className="sens-upload-preview__carousel" aria-label="图片缩略图轮播">
          {canNavigate ? <button type="button" className="sens-upload-preview__arrow" onClick={() => movePage(-1)} disabled={startIndex === 0} aria-label="上一组图片"><SensUploadPreviewIcon name="left" /></button> : <span className="sens-upload-preview__arrow-placeholder" />}
          <div className="sens-upload-preview__thumbnails">
            {visibleFiles.map((file) => {
              const index = files.findIndex((entry) => entry.uid === file.uid);
              return <button key={file.uid} type="button" className={`sens-upload-preview__thumbnail${index === activeIndex ? " is-selected" : ""}`} onClick={() => onSelect(index)} aria-label={`查看第 ${index + 1} 张：${file.name}`} aria-current={index === activeIndex ? "true" : undefined}>
                <img src={file.url} alt="" />
              </button>;
            })}
          </div>
          {canNavigate ? <button type="button" className="sens-upload-preview__arrow" onClick={() => movePage(1)} disabled={startIndex >= files.length - 4} aria-label="下一组图片"><SensUploadPreviewIcon name="right" /></button> : <span className="sens-upload-preview__arrow-placeholder" />}
        </div>
        <Text className="sens-upload-preview__counter"><span>{activeIndex + 1}</span>/{files.length}</Text>
      </div>
      <button type="button" className="sens-upload-preview__close" onClick={onClose} aria-label="关闭图片预览"><SensUploadPreviewIcon name="close" /></button>
    </div>,
    document.body,
  );
}

function SensUploadPreviewIcon({ name }: { name: "left" | "right" | "close" }) {
  return <span className={`sens-upload-preview__icon sens-upload-preview__icon--${name}`} aria-hidden="true"><SensIcon name={name} size={16} colorRole="inherit" /></span>;
}

const initialFiles: SensUploadFile[] = [
  { uid: "upload-demo-1", name: "交易日历导入模板_2026.xlsx", size: 24800, status: "done" },
  { uid: "upload-demo-2", name: "字段映射与配置说明.pdf", size: 143800, status: "uploading", percent: 56, uploadedSize: 80400 },
  { uid: "upload-demo-3", name: "历史记录导入.csv", size: 4800, status: "error", percent: 100, errorMessage: "文件格式错误" },
  { uid: "upload-demo-4", name: "2026-10-13 日历截图.png", size: 68000, status: "done" },
];

const figmaFileStates: Array<{ label: string; file: SensUploadFile; readOnly?: boolean }> = [
  { label: "完成", file: { uid: "upload-figma-done", name: "文件名称.docx", size: Math.round(4.86 * 1024 * 1024), status: "done" } },
  { label: "上传中", file: { uid: "upload-figma-progress", name: "文件名称.docx", size: Math.round(4.86 * 1024 * 1024), uploadedSize: Math.round(3.35 * 1024 * 1024), percent: 69, status: "uploading" } },
  { label: "只读 / 下载", readOnly: true, file: { uid: "upload-figma-readonly", name: "文件名称.docx", size: Math.round(4.86 * 1024 * 1024), status: "done" } },
  { label: "失败 / 续传", file: { uid: "upload-figma-resume", name: "文件名称.docx", size: Math.round(4.86 * 1024 * 1024), percent: 69, status: "error", errorMessage: "上传失败", retryLabel: "续传" } },
  { label: "失败 / 重试", file: { uid: "upload-figma-retry", name: "文件名称.docx", size: Math.round(4.86 * 1024 * 1024), percent: 100, status: "error", errorMessage: "上传失败", retryLabel: "重试" } },
  { label: "文件过大", file: { uid: "upload-figma-size-error", name: "文件名称.docx", size: Math.round(4.86 * 1024 * 1024), percent: 100, status: "error", errorMessage: "文件大小超过限制" } },
  { label: "格式错误", file: { uid: "upload-figma-format-error", name: "文件名称.docx", size: Math.round(4.86 * 1024 * 1024), percent: 100, status: "error", errorMessage: "文件格式错误" } },
];

const figmaImageFileStates: Array<{ label: string; file: SensUploadFile; readOnly?: boolean }> = [
  { label: "图片完成 / 缩略图", file: { uid: "upload-image-done", name: "图片名称.png", size: 1.25 * 1024 * 1024, type: "image/png", status: "done", url: uploadSampleImage } },
  { label: "图片上传中", file: { uid: "upload-image-progress", name: "图片名称.png", size: 1.25 * 1024 * 1024, type: "image/png", uploadedSize: 0.86 * 1024 * 1024, percent: 69, status: "uploading" } },
  { label: "图片只读 / 预览", readOnly: true, file: { uid: "upload-image-readonly", name: "图片名称.png", size: 1.25 * 1024 * 1024, type: "image/png", status: "done", url: uploadSampleImage } },
  { label: "失败 / 续传", file: { uid: "upload-image-resume", name: "图片名称.png", size: 1.25 * 1024 * 1024, type: "image/png", percent: 69, status: "error", errorMessage: "上传失败", retryLabel: "续传" } },
  { label: "失败 / 重试", file: { uid: "upload-image-retry", name: "图片名称.png", size: 1.25 * 1024 * 1024, type: "image/png", percent: 100, status: "error", errorMessage: "上传失败", retryLabel: "重试" } },
  { label: "文件过大", file: { uid: "upload-image-size-error", name: "图片名称.png", size: 1.25 * 1024 * 1024, percent: 100, status: "error", errorMessage: "文件大小超过限制" } },
  { label: "格式错误", file: { uid: "upload-image-format-error", name: "图片名称.png", size: 1.25 * 1024 * 1024, percent: 100, status: "error", errorMessage: "文件格式错误" } },
];

const figmaUploadedImageStates: Array<{ label: string; file: SensUploadFile; readOnly?: boolean }> = [
  { label: "上传完成", file: { uid: "uploaded-image-done", name: "猫咪图片.png", type: "image/png", status: "done", url: uploadSampleImage } },
  { label: "只读", readOnly: true, file: { uid: "uploaded-image-readonly", name: "猫咪图片.png", type: "image/png", status: "done", url: uploadSampleImage } },
  { label: "上传失败 / 续传", file: { uid: "uploaded-image-resume", name: "猫咪图片.png", type: "image/png", status: "error", errorMessage: "上传失败", retryLabel: "续传" } },
  { label: "上传失败 / 重试", file: { uid: "uploaded-image-retry", name: "猫咪图片.png", type: "image/png", status: "error", errorMessage: "上传失败", retryLabel: "重试" } },
  { label: "图片过大", file: { uid: "uploaded-image-too-large", name: "猫咪图片.png", type: "image/png", status: "error", errorMessage: "图片过大" } },
  { label: "格式错误", file: { uid: "uploaded-image-format-error", name: "猫咪图片.png", type: "image/png", status: "error", errorMessage: "格式错误" } },
];

const figmaMultipleUploadedImages: SensUploadFile[] = createPreviewImageFiles();

const figmaMultiDragFileItems: SensUploadFile[] = [
  { uid: "multi-drag-file-1", name: "文件名称.docx", size: Math.round(4.86 * 1024 * 1024), status: "done" },
  { uid: "multi-drag-file-2", name: "文件名称.docx", size: Math.round(4.86 * 1024 * 1024), status: "done" },
];

const figmaMultiDragImageItems: SensUploadFile[] = [
  { uid: "multi-drag-image-1", name: "猫咪图片-1.png", type: "image/png", status: "done", url: uploadSampleImage },
  { uid: "multi-drag-image-2", name: "猫咪图片-2.png", type: "image/png", status: "done", url: uploadSampleImage },
];

const figmaMultiDragStates: Array<{ label: string; mode: SensUploadMode; files: SensUploadFile[]; readOnly?: boolean }> = [
  { label: "文件 / 默认", mode: "file", files: [] },
  { label: "文件 / 多个已完成", mode: "file", files: figmaMultiDragFileItems },
  { label: "文件 / 只读", mode: "file", files: figmaMultiDragFileItems, readOnly: true },
  { label: "图片 / 默认", mode: "image", files: [] },
  { label: "图片 / 多个已完成", mode: "image", files: figmaMultiDragImageItems },
  { label: "图片 / 只读", mode: "image", files: figmaMultiDragImageItems, readOnly: true },
];

type FigmaSingleDragState = {
  label: string;
  files?: SensUploadFile[];
  disabled?: boolean;
  readOnly?: boolean;
  requiredError?: string;
  demoClass?: string;
};

const singleDragCompletedFile: SensUploadFile = {
  uid: "single-drag-complete",
  name: "猫咪图片.png",
  size: 24800,
  type: "image/png",
  status: "done",
  url: singleDragSampleImage,
};

const singleDragSize = Math.round(4.86 * 1024 * 1024);
const figmaSingleDragStates: FigmaSingleDragState[] = [
  { label: "默认" },
  { label: "悬停", demoClass: "is-demo-hover" },
  { label: "点击 / 拖拽中", demoClass: "is-demo-active" },
  { label: "禁用", disabled: true },
  { label: "禁用悬停", disabled: true, demoClass: "is-demo-disabled-hover" },
  { label: "上传中", files: [{ uid: "single-drag-uploading", name: "猫咪图片.png", size: singleDragSize, uploadedSize: Math.round(3.2 * 1024 * 1024), percent: 66, status: "uploading" }] },
  { label: "上传完成", files: [singleDragCompletedFile] },
  { label: "上传完成悬停", files: [singleDragCompletedFile], demoClass: "is-demo-complete-hover" },
  { label: "只读", files: [singleDragCompletedFile], readOnly: true },
  { label: "只读悬停", files: [singleDragCompletedFile], readOnly: true, demoClass: "is-demo-readonly-hover" },
  { label: "上传失败 / 续传", files: [{ uid: "single-drag-resume", name: "猫咪图片.png", size: singleDragSize, percent: 66, status: "error", errorMessage: "上传失败", retryLabel: "续传" }] },
  { label: "上传失败 / 重试", files: [{ uid: "single-drag-retry", name: "猫咪图片.png", size: singleDragSize, percent: 100, status: "error", errorMessage: "上传失败", retryLabel: "重试" }] },
  { label: "漏填", requiredError: "请上传" },
  { label: "漏填悬停", requiredError: "请上传", demoClass: "is-demo-required-hover" },
  { label: "漏填点击 / 拖拽中", requiredError: "请上传", demoClass: "is-demo-required-active" },
];

function UploadDemo() {
  const [mode, setMode] = useState<SensUploadMode>("file");
  const [dragEnabled, setDragEnabled] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [showRequiredError, setShowRequiredError] = useState(false);
  const [fileFiles, setFileFiles] = useState<SensUploadFile[]>(initialFiles.slice(0, 1));
  const [imageFiles, setImageFiles] = useState<SensUploadFile[]>(createPreviewImageFiles());
  const [singleFiles, setSingleFiles] = useState<SensUploadFile[]>([]);
  const [maxCount, setMaxCount] = useState(6);
  const [preview, setPreview] = useState<{ files: SensUploadFile[]; activeIndex: number } | null>(null);
  const files = mode === "image" ? imageFiles : fileFiles;
  const setFiles = mode === "image" ? setImageFiles : setFileFiles;

  useEffect(() => {
    if (![...fileFiles, ...singleFiles].some((file) => file.status === "uploading" && (file.percent ?? 0) < 100)) return;
    const timer = window.setInterval(() => {
      setFileFiles((current) => advanceDemoProgress(current));
      setSingleFiles((current) => advanceDemoProgress(current));
    }, 120);
    return () => window.clearInterval(timer);
  }, [fileFiles, singleFiles]);

  const openPreview = (file: SensUploadFile) => {
    const previewableFiles = [...imageFiles, ...fileFiles, ...singleFiles].filter((entry, index, all) => entry.url && (entry.status === "done" || entry.status === undefined) && all.findIndex((candidate) => candidate.uid === entry.uid) === index);
    const activeIndex = previewableFiles.findIndex((entry) => entry.uid === file.uid);
    setPreview({ files: previewableFiles.length ? previewableFiles : [file], activeIndex: Math.max(0, activeIndex) });
  };
  const closePreview = () => setPreview(null);

  const resumeOrRetry = (file: SensUploadFile, update: (next: SensUploadFile[]) => void, current: SensUploadFile[]) => {
    const fromPercent = file.retryLabel === "续传" ? file.percent ?? 0 : 0;
    update(current.map((entry) => entry.uid === file.uid ? {
      ...entry,
      status: "uploading",
      percent: fromPercent,
      uploadedSize: Math.round((entry.size ?? 0) * fromPercent / 100),
    } : entry));
  };
  const addRetrySample = (retryLabel: "续传" | "重试") => {
    if (files.length >= maxCount) return;
    setFiles([...files, {
      uid: `upload-demo-${retryLabel}-${Date.now()}`,
      name: `${retryLabel}演示图片.jpg`,
      type: "image/jpeg",
      size: 248000,
      status: "error",
      percent: retryLabel === "续传" ? 56 : 100,
      uploadedSize: retryLabel === "续传" ? 138880 : 248000,
      url: previewImage01,
      errorMessage: "上传失败",
      retryLabel,
    }]);
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Space wrap align="center">
        <SensViewSwitch aria-label="上传演示样式" value={mode} onChange={(value) => setMode(value as SensUploadMode)} options={[{ label: "文件样式", value: "file" }, { label: "图片样式", value: "image" }]} />
        <Space><Text>业务数量上限</Text><InputNumber min={1} value={maxCount} onChange={(value) => { if (typeof value === "number") setMaxCount(value); }} aria-label="业务上传数量上限" /></Space>
        <Space><SensSwitch aria-label="拖拽上传" checked={dragEnabled} onChange={setDragEnabled} /><Text>拖拽上传</Text></Space>
        <Space><SensSwitch aria-label="禁用" checked={disabled} onChange={setDisabled} /><Text>禁用</Text></Space>
        <Space><SensSwitch aria-label="只读" checked={readOnly} onChange={setReadOnly} /><Text>只读</Text></Space>
        <Space><SensSwitch aria-label="必填错误" checked={showRequiredError} onChange={setShowRequiredError} /><Text>必填错误</Text></Space>
      </Space>
      <Space wrap>
        <Button size="small" disabled={files.length >= maxCount} onClick={() => addRetrySample("续传")}>添加续传示例</Button>
        <Button size="small" disabled={files.length >= maxCount} onClick={() => addRetrySample("重试")}>添加重试示例</Button>
      </Space>
      <SensUpload
        mode={mode}
        dragEnabled={dragEnabled}
        disabled={disabled}
        readOnly={readOnly}
        files={files}
        onChange={setFiles}
        onCancel={(file) => setFiles((current) => current.filter((entry) => entry.uid !== file.uid))}
        onDownload={() => undefined}
        maxCount={maxCount}
        accept={mode === "image" ? "image/png,image/jpeg,image/gif" : undefined}
        help={dragEnabled ? "支持单张和批量上传，文件大小不能超过 20 MB" : mode === "file" ? "支持 xlsx、csv、pdf，单个文件不超过 20 MB" : undefined}
        requiredError={showRequiredError && files.length === 0 ? "请上传文件" : undefined}
        onRetry={(file) => resumeOrRetry(file, setFiles, files)}
        onPreview={openPreview}
      />
      <div>
        <Text strong>单文件拖拽上传 Demo</Text>
        <div style={{ marginTop: 12 }}>
          <SensUpload
            mode="file"
            dragEnabled
            multiple={false}
            maxCount={1}
            disabled={disabled}
            readOnly={readOnly}
            files={singleFiles}
            onChange={setSingleFiles}
            onCancel={(file) => setSingleFiles((current) => current.filter((entry) => entry.uid !== file.uid))}
            onRetry={(file) => resumeOrRetry(file, setSingleFiles, singleFiles)}
            onPreview={openPreview}
            requiredError={showRequiredError && singleFiles.length === 0 ? "请上传" : undefined}
            help="支持单张和批量上传，文件大小不能超过 20 MB"
          />
        </div>
      </div>
      <Text type="secondary">数量上限由业务设置；达到上限时按组件规则展示禁用入口或隐藏图片新增入口。示例进度仅用于演示续传/重试回调，真实传输由调用方更新。</Text>
      {preview ? <ImagePreviewOverlay files={preview.files} activeIndex={preview.activeIndex} onSelect={(activeIndex) => setPreview((current) => current ? { ...current, activeIndex } : current)} onClose={closePreview} /> : null}
    </Space>
  );
}

function UploadMatrix() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Text strong>文件样式 · Figma 状态（7）</Text>
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 432px), 1fr))", marginTop: 12 }}>
          {figmaFileStates.map(({ label, file, readOnly }) => (
            <div key={file.uid}>
              <Text type="secondary">{label}</Text>
              <div style={{ marginTop: 8 }}>
                <SensUpload files={[file]} readOnly={readOnly} showFileControls={false} onCancel={() => undefined} onDownload={() => undefined} onRetry={() => undefined} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Text strong>多文件拖拽上传 · Figma 状态（6）</Text>
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 432px), 1fr))", marginTop: 12 }}>
          {figmaMultiDragStates.map(({ label, mode, files, readOnly }) => (
            <div key={label}>
              <Text type="secondary">{label}</Text>
              <div style={{ marginTop: 8 }}>
                <SensUpload
                  mode={mode}
                  dragEnabled
                  files={files}
                  maxCount={mode === "image" ? 6 : 5}
                  readOnly={readOnly}
                  help="支持单张和批量上传，文件大小不能超过 20 MB"
                  onChange={() => undefined}
                  onDownload={() => undefined}
                  onPreview={() => undefined}
                />
              </div>
            </div>
          ))}
        </div>
        <Text type="secondary">文件与图片样式均支持多文件拖入；只读状态仅展示已上传内容。</Text>
      </div>
      <div>
        <Text strong>单文件拖拽上传 · Figma 状态（15）</Text>
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 432px), 1fr))", marginTop: 12 }}>
          {figmaSingleDragStates.map(({ label, files, disabled, readOnly, requiredError, demoClass }) => (
            <div key={label}>
              <Text type="secondary">{label}</Text>
              <div style={{ marginTop: 8 }}>
                <SensUpload
                  mode="file"
                  dragEnabled
                  multiple={false}
                  maxCount={1}
                  files={files ?? []}
                  disabled={disabled}
                  readOnly={readOnly}
                  requiredError={requiredError}
                  help="支持单张和批量上传，文件大小不能超过 20 MB"
                  className={demoClass}
                  onChange={() => undefined}
                  onCancel={() => undefined}
                  onRetry={() => undefined}
                  onPreview={() => undefined}
                />
              </div>
            </div>
          ))}
        </div>
        <Text type="secondary">状态矩阵用于对照；上方单文件 Demo 可实际选择或拖入文件。</Text>
      </div>
      <div>
        <Text strong>图片文件列表 · Figma 状态（7）</Text>
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 432px), 1fr))", marginTop: 12 }}>
          {figmaImageFileStates.map(({ label, file, readOnly }) => (
            <div key={file.uid}>
              <Text type="secondary">{label}</Text>
              <div style={{ marginTop: 8 }}>
                <SensUpload files={[file]} readOnly={readOnly} showFileControls={false} onCancel={() => undefined} onDownload={() => undefined} onRetry={() => undefined} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div><Text strong>文件样式 · 必填错误</Text><div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginTop: 12 }}><SensUpload requiredError="请上传文件" /></div></div>
      <div>
        <Text strong>图片上传入口 · Figma 状态（9）</Text>
        <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", marginTop: 12 }}>
          <div><Text type="secondary">默认 / 悬停 / 按下</Text><div style={{ marginTop: 8 }}><SensUpload mode="image" maxCount={1} /></div></div>
          <div><Text type="secondary">禁用 / 禁用悬停</Text><div style={{ marginTop: 8 }}><SensUpload mode="image" disabled maxCount={1} /></div></div>
          <div><Text type="secondary">加载中 / 取消</Text><div style={{ marginTop: 8 }}><SensUpload mode="image" maxCount={1} files={[{ uid: "image-entry-loading", name: "上传中.png", type: "image/png", status: "uploading", percent: 42 }]} onCancel={() => undefined} /></div></div>
          <div><Text type="secondary">必填错误 / 悬停 / 按下</Text><div style={{ marginTop: 8 }}><SensUpload mode="image" maxCount={1} requiredError="请上传" /></div></div>
        </div>
        <Text type="secondary">悬停和按下状态请直接操作入口；禁用项保持可见但不可点击。加载态“取消”由调用方回调处理。</Text>
      </div>
      <div>
        <Text strong>图片已上传项 · Figma 状态（6）</Text>
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, 104px)", marginTop: 12 }}>
          {figmaUploadedImageStates.map(({ label, file, readOnly }) => (
            <div key={file.uid}>
              <Text type="secondary">{label}</Text>
              <div style={{ marginTop: 8 }}>
                <SensUpload mode="image" files={[file]} readOnly={readOnly} maxCount={1} onRetry={() => undefined} onPreview={() => undefined} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Text strong>多图上传顺序 · 已上传图片后显示上传入口</Text>
        <div style={{ marginTop: 12 }}>
          <SensUpload mode="image" files={figmaMultipleUploadedImages} maxCount={6} onPreview={() => undefined} />
        </div>
      </div>
    </Space>
  );
}

export default function UploadShowcasePage() {
  return <ComponentShowcaseLayout title="文件上传 Upload" demo={<UploadDemo />} matrix={<UploadMatrix />} designDocSource={uploadDesignDoc} devDocSource={uploadDevDoc} />;
}
