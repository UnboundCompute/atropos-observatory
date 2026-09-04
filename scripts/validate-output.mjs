import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('out');
if (!fs.existsSync(root)) {
  console.error('Missing out/; run the static build first');
  process.exit(1);
}

const htmlFiles = [];
const walk = (directory) => {
  for (const name of fs.readdirSync(directory)) {
    const file = path.join(directory, name);
    if (fs.statSync(file).isDirectory()) walk(file);
    else if (name.endsWith('.html')) htmlFiles.push(file);
  }
};
walk(root);

const links = new Set();
const missingCanonical = [];
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  if (!file.endsWith(`${path.sep}404${path.sep}index.html`) && !file.endsWith(`${path.sep}_not-found${path.sep}index.html`) && !html.includes('<link rel="canonical"')) missingCanonical.push(file);
  for (const match of html.matchAll(/href="(\/[^"#?]*)/g)) links.add(match[1]);
}

const missing = [...links].filter((href) => href !== '/' && ![
  path.join(root, href),
  path.join(root, href, 'index.html'),
  path.join(root, `${href}.html`),
].some(fs.existsSync));

if (missing.length || missingCanonical.length) {
  if (missing.length) console.error(`Output contains ${missing.length} broken internal links:\n${missing.join('\n')}`);
  if (missingCanonical.length) console.error(`Output contains ${missingCanonical.length} index pages without canonical tags:\n${missingCanonical.join('\n')}`);
  process.exit(1);
}
console.log(`Output check: ${htmlFiles.length} HTML pages, ${links.size} internal links, and canonical tags verified`);
