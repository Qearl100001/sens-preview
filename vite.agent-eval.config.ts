import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** AgentEval 独立交付包：相对路径资源，可解压后双击 agent-eval.html 预览（需同目录 assets/）。 */
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist-agent-eval",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        agentEval: path.resolve(__dirname, "agent-eval.html"),
      },
    },
  },
});
