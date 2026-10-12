// Run: node scripts/build-prototype-kit.mjs
// Generates an isolated local package in a fresh temporary directory. Never publishes.
import { mkdtemp, mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { build } from 'vite';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workspace = await mkdtemp(path.join(tmpdir(), 'sens-prototype-kit-'));
const output = path.join(workspace, 'package');
await mkdir(output);
execFileSync(process.execPath, ['scripts/check-tokens.mjs'], { cwd: root, stdio: 'inherit' });
const catalog = JSON.parse(await readFile(path.join(root, 'src/prototype-kit/catalog.json'), 'utf8'));
const source = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const lock = JSON.parse(await readFile(path.join(root, 'package-lock.json'), 'utf8'));
await build({ configFile: path.join(root, 'vite.prototype-kit.config.ts'), build: { outDir: output } });

// Emit types only for the public entry's dependency graph, not the preview application.
const config = ts.readConfigFile(path.join(root, 'tsconfig.json'), ts.sys.readFile);
if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, '\n'));
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
const program = ts.createProgram([path.join(root, 'src/prototype-kit/index.ts')], {
  ...parsed.options, types: ['vite/client'], noEmit: false, declaration: true, emitDeclarationOnly: true,
  rootDir: path.join(root, 'src'), outDir: path.join(output, 'types'),
});
const diagnostics = [...ts.getPreEmitDiagnostics(program)];
if (diagnostics.length) throw new Error(ts.formatDiagnosticsWithColorAndContext(diagnostics, {
  getCurrentDirectory: () => root, getCanonicalFileName: x => x, getNewLine: () => '\n',
}));
// JSON is copied below; emitting declarations for JSON reports emitSkipped.
for (const file of program.getSourceFiles()) {
  if (!file.fileName.startsWith(path.join(root, 'src') + path.sep) || file.isDeclarationFile || file.fileName.endsWith('.json')) continue;
  const emit = program.emit(file);
  if (emit.emitSkipped || emit.diagnostics.length) throw new Error(`Declaration emission failed: ${file.fileName}\n` + ts.formatDiagnosticsWithColorAndContext(emit.diagnostics, {
    getCurrentDirectory: () => root, getCanonicalFileName: x => x, getNewLine: () => '\n',
  }));
}

const hashes = {};
for (const file of program.getSourceFiles()) {
  if (!file.fileName.startsWith(path.join(root, 'src') + path.sep)) continue;
  const relative = path.relative(root, file.fileName);
  hashes[relative] = createHash('sha256').update(await readFile(file.fileName)).digest('hex');
  if (file.fileName.endsWith('.json')) {
    const target = path.join(output, 'types', path.relative(path.join(root, 'src'), file.fileName));
    await mkdir(path.dirname(target), { recursive: true });
    await copyFile(file.fileName, target);
  }
}
const registryItems = [
  ...catalog.capabilities,
  ...(catalog.composites ?? []),
  ...(catalog.templates ?? []),
];
const rules = new Set(registryItems.map(item => item.rule));
for (const rule of rules) {
  if (!existsSync(path.join(root, rule))) throw new Error(`Missing rule: ${rule}`);
  const target = path.join(output, 'rules', rule);
  await mkdir(path.dirname(target), { recursive: true });
  await copyFile(path.join(root, rule), target);
}
const publicEntry = await readFile(path.join(root, 'src/prototype-kit/index.ts'), 'utf8');
const registeredExports = new Set([
  ...catalog.capabilities.map(item => item.exportName),
  ...(catalog.composites ?? []).flatMap(item => item.exportNames ?? []),
  ...(catalog.templates ?? []).flatMap(item => item.requiredExports ?? []),
]);
for (const exportName of registeredExports) {
  const exportPattern = new RegExp(`\\b${exportName}\\b`);
  if (!exportPattern.test(publicEntry)) throw new Error(`Catalog export is not public: ${exportName}`);
}
const dependencies = Object.fromEntries(['antd', 'i18next', 'react-i18next', 'pinyin-pro'].map(name => {
  const version = lock.packages?.[`node_modules/${name}`]?.version;
  if (!version) throw new Error(`No locked dependency version: ${name}`);
  return [name, version];
}));
const browserStatuses = registryItems.map(item => item.verification.browser);
const browserVerification = browserStatuses.every(status => status === 'playwright_pass')
  ? 'playwright_pass'
  : browserStatuses.some(status => status === 'playwright_pass')
    ? 'partial_playwright_pass'
    : 'not_run';
await writeFile(path.join(output, 'package.json'), JSON.stringify({
  name: catalog.packageName, version: catalog.version, private: true, type: 'module',
  main: './index.js', types: './types/prototype-kit/index.d.ts',
  exports: { '.': { types: './types/prototype-kit/index.d.ts', import: './index.js' }, './style.css': './style.css', './catalog.json': './catalog.json' },
  files: ['index.js', '*.css', 'types', 'rules', 'catalog.json', 'provenance.json'],
  sideEffects: ['*.css'], dependencies,
  peerDependencies: { react: source.dependencies.react, 'react-dom': source.dependencies['react-dom'] },
}, null, 2));
for (const item of catalog.capabilities) item.verification.packaging = 'build_and_types_pass';
for (const item of catalog.composites ?? []) item.verification.packaging = 'build_and_types_pass';
await writeFile(path.join(output, 'catalog.json'), JSON.stringify(catalog, null, 2));
await writeFile(path.join(output, 'provenance.json'), JSON.stringify({
  builtAt: new Date().toISOString(), sourceHashes: hashes,
  browserVerification, sourceVersion: source.version,
}, null, 2));
const packed = execFileSync('npm', ['pack', output, '--pack-destination', workspace, '--cache', path.join(workspace, 'npm-cache'), '--ignore-scripts', '--json'], { cwd: workspace, encoding: 'utf8' });
console.log(JSON.stringify({ packageDirectory: output, archive: path.join(workspace, JSON.parse(packed)[0].filename), browserVerification }, null, 2));
