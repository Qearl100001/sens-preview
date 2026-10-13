import { useState } from "react";
import { Segmented, Space, Switch, Typography } from "antd";
import { SensUpload, type SensUploadFile, type SensUploadMode } from "../../ui/SensUpload";
import uploadDesignDoc from "../../design-system/components/base/upload.design.md?raw";
import uploadDevDoc from "../../design-system/components/base/upload.md?raw";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";

const { Text } = Typography;

const initialFiles: SensUploadFile[] = [
  { uid: "upload-demo-1", name: "交易日历导入模板_2026.xlsx", size: 24800, status: "done" },
  { uid: "upload-demo-2", name: "字段映射与配置说明.pdf", size: 143800, status: "uploading", percent: 56 },
  { uid: "upload-demo-3", name: "历史记录导入.csv", size: 4800, status: "error", errorMessage: "格式错误" },
  { uid: "upload-demo-4", name: "2026-10-13 日历截图.png", size: 68000, status: "done" },
];

function UploadDemo() {
  const [mode, setMode] = useState<SensUploadMode>("file");
  const [dragEnabled, setDragEnabled] = useState(false);
  const [showRequiredError, setShowRequiredError] = useState(false);
  const [files, setFiles] = useState<SensUploadFile[]>(initialFiles.slice(0, 1));

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Space wrap align="center">
        <Segmented value={mode} onChange={(value) => setMode(value as SensUploadMode)} options={[{ label: "文件样式", value: "file" }, { label: "图片样式", value: "image" }]} />
        <Space><Switch checked={dragEnabled} onChange={setDragEnabled} /><Text>拖拽上传</Text></Space>
        <Space><Switch checked={showRequiredError} onChange={setShowRequiredError} /><Text>必填错误</Text></Space>
      </Space>
      <SensUpload
        mode={mode}
        dragEnabled={dragEnabled}
        files={files}
        onChange={setFiles}
        maxCount={mode === "image" ? 6 : 5}
        accept={mode === "image" ? "image/png,image/jpeg,image/gif" : undefined}
        help={mode === "file" ? "支持 xlsx、csv、pdf，单个文件不超过 20 MB" : undefined}
        requiredError={showRequiredError && files.length === 0 ? "请上传文件" : undefined}
        onRetry={(file) => setFiles((current) => current.map((entry) => entry.uid === file.uid ? { ...entry, status: "uploading", percent: 0 } : entry))}
        onPreview={() => undefined}
      />
      <Text type="secondary">文件选择与拖入支持本地交互；上传传输、模板下载和内容校验由调用方接入。</Text>
    </Space>
  );
}

function UploadMatrix() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div><Text strong>文件样式 · 默认 / 上传中 / 失败 / 只读</Text><div style={{ display: "grid", gap: 12, marginTop: 12 }}><SensUpload files={initialFiles.slice(0, 3)} onRetry={() => undefined} /><SensUpload files={initialFiles.slice(0, 1)} readOnly /></div></div>
      <div><Text strong>文件样式 · 必填错误 / 禁用 / 拖拽</Text><div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginTop: 12 }}><SensUpload requiredError="请上传文件" /><SensUpload files={initialFiles.slice(0, 1)} disabled /><SensUpload dragEnabled help="支持单张和批量上传" /></div></div>
      <div><Text strong>图片样式 · 默认 / 上传中 / 完成 / 失败 / 只读</Text><div style={{ display: "grid", gap: 16, marginTop: 12 }}><SensUpload mode="image" files={[{ uid: "image-loading", name: "loading.png", status: "uploading", percent: 62 }, { ...initialFiles[3], status: "done" }, { uid: "image-error", name: "invalid-image.gif", status: "error", errorMessage: "格式错误" }]} onRetry={() => undefined} maxCount={4} /><SensUpload mode="image" files={[{ ...initialFiles[3], status: "done" }]} readOnly /></div></div>
      <div><Text strong>图片样式 · 禁用</Text><div style={{ marginTop: 12 }}><SensUpload mode="image" files={[{ ...initialFiles[3], status: "done" }]} disabled /></div></div>
    </Space>
  );
}

export default function UploadShowcasePage() {
  return <ComponentShowcaseLayout title="文件上传 Upload" demo={<UploadDemo />} matrix={<UploadMatrix />} designDocSource={uploadDesignDoc} devDocSource={uploadDevDoc} />;
}
