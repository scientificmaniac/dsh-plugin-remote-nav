/**
 * build.mjs — 生成 DSH Web UI 客户端插件 client.js
 *
 * 唯一产物：client.js
 *   window.__ModuleLoader__ 工厂，供 DSH 客户端插件加载器直接执行。
 *
 * 拼接顺序：核心引擎（remote-nav.js）→ 页面侧引导（dsh-autostart.js）→
 * 客户端插件入口（dsh-client.js）。三者共享同一个工厂作用域，因此不需要打包器。
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8'));

/** 去模块化：删除 import / export，使源码能拼进同一个作用域 */
function toScript(file) {
  const src = readFileSync(resolve(ROOT, file), 'utf8');
  const lines = [];
  for (const line of src.split(/\r?\n/)) {
    if (/^\s*import\s.+from\s+['"].+['"];?\s*$/.test(line)) continue; // import ... from '...'
    if (/^\s*import\s+['"].+['"];?\s*$/.test(line)) continue; // import '...'
    if (/^\s*export\s+default\s+/.test(line)) continue; // export default x;
    if (/^\s*export\s*\{/.test(line)) continue; // export { ... }
    lines.push(line.replace(/^(\s*)export\s+(?=(const|let|var|function|class|async)\b)/, '$1'));
  }
  return lines.join('\n').replace(/\n{3,}/g, '\n\n');
}

/** 整体缩进，便于塞进工厂函数 */
function indent(code, spaces) {
  const pad = ' '.repeat(spaces);
  return code
    .split('\n')
    .map((line) => (line.trim() === '' ? '' : pad + line))
    .join('\n');
}

const css = readFileSync(resolve(ROOT, 'src/remote-nav.css'), 'utf8');
const core = toScript('src/remote-nav.js');
const autostart = toScript('src/dsh-autostart.js');
const clientEntry = toScript('src/dsh-client.js');

const banner = `/*! dsh-plugin-remote-nav v${pkg.version} — 遥控器/方向键空间导航 · 自动生成，勿手改（源文件在 src/） */`;

const clientBody = `${banner}
window.__ModuleLoader__.load({
  id: ${JSON.stringify(pkg.name)},
  factory(require) {
    const React = require('react');
    const __CSS__ = ${JSON.stringify(css)};

${indent(core, 4)}

${indent(autostart, 4)}

${indent(clientEntry, 4)}

    return createClientPlugin(React);
  },
});
`;

writeFileSync(resolve(ROOT, 'client.js'), clientBody, 'utf8');
console.log('[build] client.js ✓ DSH 客户端插件（唯一产物）');
