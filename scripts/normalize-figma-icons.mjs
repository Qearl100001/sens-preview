import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const rawDir = process.argv[2] ?? "/private/tmp/sens-figma-icons/raw";
const outputDir = process.argv[3] ?? path.join(projectRoot, "public/icons");
const manifestPath = process.argv[4] ?? path.join(projectRoot, "src/design-system/icons/figma-icons.manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

function normalizeName(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getAttribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1] ?? "";
}

function extractNamedGroup(svg, targetName) {
  const tags = [...svg.matchAll(/<\/?g\b[^>]*>/g)];
  const targetIndex = tags.findIndex((match) => {
    const tag = match[0];
    if (!tag.startsWith("<g")) return false;
    return normalizeName(getAttribute(tag, "id")) === normalizeName(targetName);
  });

  if (targetIndex < 0) return null;

  const start = tags[targetIndex].index;
  let depth = 0;
  for (let index = targetIndex; index < tags.length; index += 1) {
    if (tags[index][0].startsWith("<g")) depth += 1;
    else depth -= 1;
    if (depth === 0) {
      const end = tags[index].index + tags[index][0].length;
      return svg.slice(start, end);
    }
  }
  return null;
}

fs.mkdirSync(outputDir, { recursive: true });

for (const item of manifest) {
  const sourcePath = path.join(rawDir, `${item.name}.svg`);
  const targetPath = path.join(outputDir, `${item.name}.svg`);
  const source = fs.readFileSync(sourcePath, "utf8");
  const group = extractNamedGroup(source, item.figmaName);
  if (!group) {
    throw new Error(`Unable to locate Figma symbol group: ${item.figmaName} (${item.nodeId})`);
  }

  const normalized = [
    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">',
    group
      .replace(/\s(?:fill|stroke)="(?!none"|currentColor")[^"]*"/gi, (attribute) => {
        const leading = attribute.match(/^\s*/)?.[0] ?? " ";
        const property = attribute.trim().split("=")[0];
        return `${leading}${property}="currentColor"`;
      })
      .replace(/\s(?:width|height)="[^"]*"/gi, ""),
    "</svg>",
    "",
  ].join("\n");

  fs.writeFileSync(targetPath, normalized);
}

console.log(`Normalized ${manifest.length} Figma SVG icons into ${outputDir}`);
