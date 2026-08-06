import fs from "node:fs";

const sourcePath = "src/design-system/icons/figma-icons.tsx";
const manifestPath = "src/design-system/icons/figma-icons.manifest.json";
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
let source = fs.readFileSync(sourcePath, "utf8");

source = source
  .split("\n")
  .filter((line) => !line.startsWith("import svg"))
  .join("\n");

const assetMap = [
  "const FIGMA_ICON_ASSETS: Record<FigmaIconName, string> = {",
  ...manifest.map((item) => '  "' + item.name + '": "/icons/' + item.name + '.svg",'),
  "};",
].join("\n");

const start = source.indexOf("const FIGMA_ICON_ASSETS");
const end = source.indexOf("const FIGMA_ICON_META");
source = source.slice(0, start) + assetMap + "\n\n" + source.slice(end);
source = source.replaceAll("src/design-system/icons/assets", "public/icons");
fs.writeFileSync(sourcePath, source);
