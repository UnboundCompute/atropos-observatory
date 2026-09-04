import fs from 'node:fs';

const catalog = JSON.parse(fs.readFileSync('.generated/catalog.json', 'utf8'));
const searchIndexPath = 'public/generated/search-index.json';
if (!fs.existsSync(searchIndexPath)) {
  console.error(`Missing ${searchIndexPath}; run the data preparation step first`);
  process.exit(1);
}
const searchIndex = JSON.parse(fs.readFileSync(searchIndexPath, 'utf8'));
if (!Array.isArray(searchIndex) || searchIndex.length !== catalog.length || searchIndex.some((entry) => !entry.id || !entry.slug || !entry.method)) {
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
