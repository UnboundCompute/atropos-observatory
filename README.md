# Atropos Observatory

Atropos Observatory is the searchable, human-readable reference for [Atropos](https://github.com/UnboundCompute/atropos) security semantics.

It turns model facts into crawlable symbol pages: the modeled role, watched access path, CWE mapping, attacker-oriented explanation, review checklist, provenance, and a handoff to [Lachesis](https://lachesis.unboundcompute.com/) for repository-level reachability analysis.

The Observatory is deliberately static. A modeled boundary is not automatically a vulnerability in every program; the surrounding code still needs review.

## Quick start

The catalog is generated from a sibling Atropos checkout:

```text
workspace/
├── atropos/
└── atropos-observatory/
```

```bash
git clone https://github.com/UnboundCompute/atropos.git
git clone https://github.com/UnboundCompute/atropos-observatory.git
cd atropos-observatory
npm ci
npm run dev
```

For a production static export:

```bash
npm run build
ATROPOS_ROOT=/path/to/atropos npm run build
```

The generated site is written to `out/` and validates the model schema, content overlays, routes, canonical URLs, sitemap, robots directive, and internal links.

## What is generated

- Collision-safe symbol routes from the current Atropos model pack
- Search index at `public/generated/search-index.json`
- Role, language, kind, and CWE browse facets
- Static `sitemap.xml` and `robots.txt`
- Reviewed overlays from `content/editorial.json`
- Per-kind attacker and reviewer templates from `content/kind-templates.json`
- CWE descriptions from `content/cwe.json`

Model facts remain authoritative. Editorial files add explanation and safer-direction guidance without duplicating model fields.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run lint` | Type-check the application |
| `npm run build` | Generate data, build, and validate the static export |
| `npm run check:catalog` | Validate generated model data |
| `npm run check:content` | Validate editorial content |
| `npm run check:output` | Validate generated HTML and links |

## Static hosting

Everything in `out/` is static and can be served by Vercel, Hostinger, or any CDN. To upload one archive instead of thousands of files:

```bash
(cd out && zip -qr ../atropos-observatory-static.zip .)
```

Extract the archive into the host's public web root.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Security reports are described in [SECURITY.md](SECURITY.md).

## License

Observatory application code is MIT licensed. Atropos model data remains under its upstream license; see the [Atropos repository](https://github.com/UnboundCompute/atropos) for those terms.

## Ecosystem

- [Atropos](https://github.com/UnboundCompute/atropos) — the model pack and analyzer
- [Lachesis](https://lachesis.unboundcompute.com/) — repository-level reachability analysis
- [Atropos Observatory](https://atropos.unboundcompute.com/) — this searchable reference
