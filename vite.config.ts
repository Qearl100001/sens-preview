import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/** 新建 changelog/20*.md 后触发整页刷新，否则 eager glob 不会收录新文件 */
function changelogGlobReload(): Plugin {
  let root = "";
  return {
    name: "changelog-glob-reload",
    configResolved(config) {
      root = config.root;
    },
    configureServer(server) {
      const changelogDir = path.join(root, "src/design-system/changelog");
      server.watcher.add(changelogDir);
      const onChangelogChange = (file: string) => {
        if (!file.startsWith(changelogDir)) return;
        if (!/^20\d{2}-\d{2}-\d{2}\.md$/.test(path.basename(file))) return;
        const pageId = path.join(root, "src/preview/pages/ChangelogPage.tsx");
        const mod = server.moduleGraph.getModuleById(pageId);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.on("add", onChangelogChange);
      server.watcher.on("unlink", onChangelogChange);
    },
  };
}

export default defineConfig({
  plugins: [react(), changelogGlobReload()],
});
