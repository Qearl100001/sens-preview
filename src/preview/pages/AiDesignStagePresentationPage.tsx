import presentationHtmlSource from "../../../docs/presentations/ai-design-stage/index.html?raw";
import assetLibraryUrl from "../../../docs/presentations/ai-design-stage/assets/v2-ai-design-asset-library.svg";
import workflowUrl from "../../../docs/presentations/ai-design-stage/assets/v2-ai-design-workflow.svg";

const presentationHtml = presentationHtmlSource
  .replace("./assets/v2-ai-design-asset-library.svg", assetLibraryUrl)
  .replace("./assets/v2-ai-design-workflow.svg", workflowUrl);

/** 全屏 iframe 承载 AI 设计阶段演示稿。 */
export default function AiDesignStagePresentationPage() {
  return (
    <iframe
      srcDoc={presentationHtml}
      title="AI 驱动设计环节提效探索"
      style={{
        display: "block",
        width: "100vw",
        height: "100vh",
        border: "none",
        margin: 0,
        padding: 0,
      }}
    />
  );
}
