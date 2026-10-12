import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
function svgData(relative: string) {
  const file = path.resolve(root, 'public', relative.replace(/^\//, ''));
  if (!file.startsWith(path.join(root, 'public/icons') + path.sep)) throw new Error('Invalid icon path');
  return 'data:image/svg+xml;base64,' + readFileSync(file).toString('base64');
}

function brandSvgData(relative: string) {
  const file = path.resolve(root, 'public', relative.replace(/^\//, ''));
  if (!file.startsWith(path.join(root, 'public/brand') + path.sep)) throw new Error('Invalid brand asset path');
  return 'data:image/svg+xml;base64,' + readFileSync(file).toString('base64');
}

export default defineConfig({
  publicDir: false,
  plugins: [{
    name: 'sens-prototype-portable-icons', enforce: 'pre',
    transform(code, id) {
      if (!id.includes('/src/design-system/icons/') && !id.endsWith('/src/ui/SensTopNavLogo.tsx')) return;
      let result = code
        .replace(/(["'])(\/icons\/[^"']+\.svg)\1/g, (_, _quote, asset) => JSON.stringify(svgData(asset)))
        .replace(/(["'])(\/brand\/[^"']+\.svg)\1/g, (_, _quote, asset) => JSON.stringify(brandSvgData(asset)));
      if (id.endsWith('/colorful-icons.tsx')) {
        const assets = Object.fromEntries(readdirSync(path.join(root, 'public/icons/colorful')).filter(name => name.endsWith('.svg')).map(name => [name.slice(0, -4), svgData('/icons/colorful/' + name)]));
        const expression = '"/icons/colorful/" + name + ".svg"';
        if (!result.includes(expression)) throw new Error('Colorful icon registry changed; review packaging adapter');
        result = result.replace(expression, `(${JSON.stringify(assets)} as Record<string, string>)[name]`);
      }
      return { code: result, map: null };
    },
  }, react()],
  build: {
    emptyOutDir: false,
    lib: { entry: path.join(root, 'src/prototype-kit/index.ts'), formats: ['es'], fileName: () => 'index.js' },
    rollupOptions: {
      external: id => /^(react|react-dom|antd|i18next|react-i18next|pinyin-pro)(\/|$)/.test(id),
    },
  },
});
