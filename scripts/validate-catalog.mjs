import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const catalog = JSON.parse(fs.readFileSync('.generated/catalog.json', 'utf8'));
const stats = JSON.parse(fs.readFileSync('.generated/stats.json', 'utf8'));
const atroposRoot = path.resolve(process.env.ATROPOS_ROOT || '../atropos');
const pack = JSON.parse(fs.readFileSync(path.join(atroposRoot, 'pack.json'), 'utf8'));
const sourceRevision = (() => {
  try { return execFileSync('git', ['-C', atroposRoot, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(); } catch { return ''; }
})();
if (!/^[0-9a-f]{40}$/i.test(stats.source_revision) || stats.source_revision !== sourceRevision) {
  console.error('Generated source revision is missing or does not match the Atropos checkout; run the data preparation step again');
  process.exit(1);
}
const missingSources = catalog.filter((entry) => !entry.source_file || !fs.existsSync(path.join(atroposRoot, 'models', entry.source_file)));
if (missingSources.length) {
  console.error(`Catalog contains ${missingSources.length} source file path(s) missing from the ingested Atropos checkout`);
  process.exit(1);
}
if (pack.format !== 'atropos-model-pack') {
  console.error(`Unexpected model pack format: ${pack.format || 'missing'}`);
  process.exit(1);
}
if (pack.schema_version !== 2) {
  console.error(`Unsupported model pack schema version: ${pack.schema_version ?? 'missing'}`);
  process.exit(1);
}
if (typeof pack.version !== 'string' || !pack.version.trim()) {
  console.error('Model pack is missing a usable version');
  process.exit(1);
}
if (Number.isInteger(pack.verified_entries) && pack.verified_entries !== catalog.length) {
  console.error(`Catalog contains ${catalog.length} facts but the model pack declares ${pack.verified_entries} verified entries`);
  process.exit(1);
}
const searchIndexPath = 'public/generated/search-index.json';
if (!fs.existsSync(searchIndexPath)) {
  console.error(`Missing ${searchIndexPath}; run the data preparation step first`);
  process.exit(1);
}
const searchIndex = JSON.parse(fs.readFileSync(searchIndexPath, 'utf8'));
if (!Array.isArray(searchIndex) || searchIndex.length !== catalog.length || searchIndex.some((entry, index) => !entry || !entry.id || !entry.slug || !entry.method || entry.id !== catalog[index]?.id || entry.slug !== catalog[index]?.slug)) {
  console.error(`${searchIndexPath} is missing required records or is out of sync with the catalog`);
  process.exit(1);
}
const bySlug = new Map();
for (const entry of catalog) {
  const rows = bySlug.get(entry.slug) || [];
  rows.push(entry);
  bySlug.set(entry.slug, rows);
}
const errors = [];
for (const [slug, rows] of bySlug) {
  const symbols = new Set(rows.map((entry) => [entry.language, entry.package || 'stdlib', entry.type || 'global', entry.method].join('\u0000')));
  if (symbols.size > 1) errors.push(`${slug}: collides across ${symbols.size} distinct symbols`);
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Catalog check: ${catalog.length} facts grouped into ${bySlug.size} collision-safe symbol routes; search index verified`);
