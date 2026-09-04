#!/usr/bin/env node
/** Decode batch JSON {key,b64|svg}[] into .tmp/sidenav-icons/*.svg */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIR = path.join(ROOT, ".tmp/sidenav-icons");
const input = process.argv[2];
if (!input) {
  console.error("Usage: node scripts/decode-sidenav-batch.mjs <batch.json>");
  process.exit(1);
}
const items = JSON.parse(fs.readFileSync(input, "utf8"));
fs.mkdirSync(DIR, { recursive: true });
for (const item of items) {
  const svg = item.svg ?? Buffer.from(item.b64, "base64").toString("utf8");
  fs.writeFileSync(path.join(DIR, `${item.key}.svg`), svg);
  console.log("wrote", item.key, svg.length);
}
