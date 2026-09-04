import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.env.ATROPOS_ROOT || '../atropos');
const pack = JSON.parse(fs.readFileSync(path.join(root, 'pack.json'), 'utf8'));
const files = fs.readdirSync(path.join(root, 'models'), { recursive: true }).filter((f) => f.endsWith('.json'));
const entries = files.flatMap((file) => {
  const parsed = JSON.parse(fs.readFileSync(path.join(root, 'models', file), 'utf8'));
  const rows = Array.isArray(parsed) ? parsed : (parsed.entries || []);
  return rows.map((entry) => ({ ...entry, source_file: file }));
});
const baseSlug = (e) => [e.language, e.package || 'stdlib', e.type || 'global', e.method].join('/').toLowerCase().replace(/[^a-z0-9/]+/g, '-');
const shortHash = (value) => { let hash = 5381; for (const char of value) hash = ((hash << 5) + hash) ^ char.charCodeAt(0); return (hash >>> 0).toString(36).slice(0, 6); };
const symbolKey = (entry) => [entry.language, entry.package || 'stdlib', entry.type || 'global', entry.method].join('\u0000');
const slugSymbols = entries.reduce((groups, entry) => { const slug = baseSlug(entry); const keys = groups.get(slug) || new Set(); keys.add(symbolKey(entry)); groups.set(slug, keys); return groups; }, new Map());
const catalog = entries.map((entry) => { const slug = baseSlug(entry); const keys = slugSymbols.get(slug); return { ...entry, slug: keys.size > 1 ? `${slug}--${shortHash(symbolKey(entry))}` : slug }; }).sort((a, b) => a.id.localeCompare(b.id));
const out = path.resolve('.generated');
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
const publicGenerated = path.resolve('public/generated');
fs.rmSync(publicGenerated, { recursive: true, force: true }); fs.mkdirSync(publicGenerated, { recursive: true });
fs.writeFileSync(path.join(out, 'catalog.json'), JSON.stringify(catalog));
const searchIndex = catalog.map(({ id, language, package: pkg, type, method, role, kind, access_path, slug }) => ({ id, language, package: pkg, type, method, role, kind, access_path, slug }));
fs.writeFileSync(path.join(out, 'search-index.json'), JSON.stringify(searchIndex));
fs.writeFileSync(path.join(publicGenerated, 'search-index.json'), JSON.stringify(searchIndex));
fs.writeFileSync(path.join(out, 'stats.json'), JSON.stringify({ total: catalog.length, symbols: new Set(catalog.map((e) => `${e.language}:${e.package}:${e.type}:${e.method}`)).size, languages: [...new Set(catalog.map((e) => e.language))], version: pack.version }));
console.log(`Atropos Observatory: generated ${catalog.length} facts from ${root}`);
