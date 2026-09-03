import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.env.ATROPOS_ROOT || '../atropos');
const files = fs.readdirSync(path.join(root, 'models'), { recursive: true }).filter((f) => f.endsWith('.json'));
const entries = files.flatMap((file) => {
  const parsed = JSON.parse(fs.readFileSync(path.join(root, 'models', file), 'utf8'));
  const rows = Array.isArray(parsed) ? parsed : (parsed.entries || []);
  return rows.map((entry) => ({ ...entry, source_file: file }));
});
const slug = (e) => [e.language, e.package || 'stdlib', e.type || 'global', e.method].join('/').toLowerCase().replace(/[^a-z0-9/]+/g, '-');
const catalog = entries.map((e) => ({ ...e, slug: slug(e) })).sort((a, b) => a.id.localeCompare(b.id));
const out = path.resolve('.generated');
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
const publicGenerated = path.resolve('public/generated');
fs.rmSync(publicGenerated, { recursive: true, force: true }); fs.mkdirSync(publicGenerated, { recursive: true });
fs.writeFileSync(path.join(out, 'catalog.json'), JSON.stringify(catalog));
const searchIndex = catalog.map(({ id, language, package: pkg, type, method, role, kind, slug }) => ({ id, language, package: pkg, type, method, role, kind, slug }));
fs.writeFileSync(path.join(out, 'search-index.json'), JSON.stringify(searchIndex));
fs.writeFileSync(path.join(publicGenerated, 'search-index.json'), JSON.stringify(searchIndex));
fs.writeFileSync(path.join(out, 'stats.json'), JSON.stringify({ total: catalog.length, symbols: new Set(catalog.map((e) => `${e.language}:${e.package}:${e.type}:${e.method}`)).size, languages: [...new Set(catalog.map((e) => e.language))], version: '1.10.0' }));
console.log(`Atropos Observatory: generated ${catalog.length} facts from ${root}`);
