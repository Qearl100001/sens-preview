import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "tokens/source");
const temporaryOutput = fs.mkdtempSync(path.join(os.tmpdir(), "sens-preview-tokens-"));
const outputs = [
  "theme.ts",
  "tokens.resolved.json",
  "i18n/zh.json",
  "i18n/en.json",
];

try {
  execFileSync(
    process.execPath,
    [path.join(root, "build-tokens.mjs"), source, temporaryOutput],
    { cwd: root, stdio: "inherit" },
  );

  const outdatedOutputs = outputs.filter((output) => {
    const generated = fs.readFileSync(path.join(temporaryOutput, output));
    const committed = fs.readFileSync(path.join(root, "src/design-system", output));
    return !generated.equals(committed);
  });
  const unresolvedOutputs = outputs.filter((output) =>
    fs.readFileSync(path.join(temporaryOutput, output), "utf8").includes("UNRESOLVED("),
  );

  if (outdatedOutputs.length > 0 || unresolvedOutputs.length > 0) {
    if (outdatedOutputs.length > 0) {
      console.error(
        `Token generated outputs are outdated: ${outdatedOutputs.join(", ")}.\nRun: npm run tokens:build`,
      );
    }
    if (unresolvedOutputs.length > 0) {
      console.error(`Token generated outputs contain unresolved references: ${unresolvedOutputs.join(", ")}.`);
    }
    process.exitCode = 1;
  } else {
    console.log("Token generated outputs are current.");
  }
} finally {
  fs.rmSync(temporaryOutput, { recursive: true, force: true });
}
