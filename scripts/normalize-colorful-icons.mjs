import fs from "node:fs";
import path from "node:path";

const rawDir = process.argv[2] ?? "public/icons/colorful";
const manifestPath = process.argv[3] ?? "src/design-system/icons/colorful-icons.manifest.json";
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

function normalizeName(value) {
  return value.trim().toLowerCase().replace(/_/g, "-").replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function getAttribute(tag, name) {
  return tag.match(new RegExp("\\b" + name + '="([^"]*)"'))?.[1] ?? "";
}

function extractNamedGroup(svg, targetName) {
  const tags = [...svg.matchAll(/<\/?g\b[^>]*>/g)];
  const targetIndex = tags.findIndex((match) => {
    const tag = match[0];
    return tag.startsWith("<g") && normalizeName(getAttribute(tag, "id")) === normalizeName(targetName);
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

for (const item of manifest) {
  const sourcePath = path.join(rawDir, item.name + ".svg");
  const source = fs.readFileSync(sourcePath, "utf8");
  const group = extractNamedGroup(source, item.figmaName);
  if (!group) throw new Error("Unable to locate Figma symbol group: " + item.figmaName + " (" + item.nodeId + ")");
  const normalized = [
    '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">',
    group,
    "</svg>",
    ""
  ].join("\n");
  fs.writeFileSync(sourcePath, normalized);
}
console.log("Normalized " + manifest.length + " colorful Figma SVG icons in " + rawDir);

