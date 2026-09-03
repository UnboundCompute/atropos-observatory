import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.env.ATROPOS_ROOT || '../atropos');
const files = fs.readdirSync(path.join(root, 'models'), { recursive: true }).filter((file) => file.endsWith('.json'));
const ids = new Set(files.flatMap((file) => {
  const parsed = JSON.parse(fs.readFileSync(path.join(root, 'models', file), 'utf8'));
  return (Array.isArray(parsed) ? parsed : (parsed.entries || [])).map((entry) => entry.id);
}));
const editorial = JSON.parse(fs.readFileSync('content/editorial.json', 'utf8'));
const errors = [];
for (const [id, record] of Object.entries(editorial)) {
  if (!ids.has(id)) errors.push(`${id}: not found in Atropos model pack`);
  if (!record.summary?.trim()) errors.push(`${id}: summary is required`);
  if (!record.safe_pattern?.trim()) errors.push(`${id}: safe_pattern is required`);
  if (!record.unsafe_example?.trim() || !record.safe_example?.trim()) errors.push(`${id}: unsafe_example and safe_example are required`);
  if (!Array.isArray(record.references) || record.references.length === 0) errors.push(`${id}: at least one reference is required`);
  for (const reference of record.references || []) { try { new URL(reference); } catch { errors.push(`${id}: invalid reference URL ${reference}`); } }
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Editorial check: ${Object.keys(editorial).length} records validated against ${ids.size} Atropos facts`);
