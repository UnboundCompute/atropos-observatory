# Door A redesign — implementation handoff

`design/door-a-mock.html` is a self-contained, clickable mock of the redesigned
Observatory (the "Door A" content/SEO reference funnel). Open it in a browser and
use the top nav to switch screens: **Home / search**, **Symbol · raw**,
**Symbol · reviewed**, **Results / missing**, **Mobile**. The dark bands under each
screen are design rationale — do NOT ship them; they explain intent only.

Your job: rebuild the real Next.js app to match the mock. The mock's own CSS is the
source of truth for layout and spacing; the visual tokens already exist in the app.

## Ground rules
- **Read `AGENTS.md` first.** This is a modified Next.js — read the relevant guide in
  `node_modules/next/dist/docs/` before writing framework code. The site is a static
  export; every screen must build as a static page (no server runtime).
- **Reuse the existing design system.** `app/globals.css` already defines the paper/ink/
  red tokens and the three fonts (Source Serif 4 / IBM Plex Sans / IBM Plex Mono). Match
  the mock's tokens to the existing ones; don't fork a second palette. Square geometry,
  1px hairline rules, no shadows/gradients, rows lift on hover, focus is red.
- **All content is DERIVED from the model pack** — do not hand-write per-symbol prose.
  The whole point is that every one of the 1,449 symbols gets a dense page from its fields.

## Screen → file mapping
| Mock screen | Real file |
|---|---|
| Home / search | `app/page.tsx` |
| Symbol · raw / reviewed | `app/symbols/[...slug]/page.tsx` |
| Results / missing | search route + `components/Search.tsx` |
| Metadata / noindex | `generateMetadata` in the symbol page |

## The symbol page — how each derived section is built
Each record carries: `id, language, package, type, method, arity, signature,
access_path, role, kind, cwe[], confidence, corroboration, notes, source_file, slug`.

1. **Fact strip** — direct field render: role, `cwe`, `access_path` (+ arg name parsed
   from `signature`), `kind`, `confidence`, `corroboration`.
2. **Argument map** — parse `signature` into parameters; mark the one whose position
   matches `access_path` (`Argument[n]` → nth param) as the watched slot. Per-arg
   "purpose" text is optional; the watched flag + access path are the required part.
3. **Weakness cards** — look up each `cwe[]` id in a static CWE table (name + one-line
   definition, from MITRE's public CWE list). Ship this table as a JSON in the repo.
4. **Attacker's-eye view** and **5. Reviewer checklist** — these are **per-KIND
   templates**, NOT per-symbol. Write one template per `kind` (~32 total); every symbol
   of that kind inherits it. Store as `content/kind-templates.json`
   keyed by kind → { danger_sentence, attack_sketch, checklist[] }.
6. **Handoff to Lachesis** — static block; the CTA links to Lachesis with the symbol as
   context. This block appears on EVERY symbol page.
7. **Family** — aggregate the catalog: other symbols with the same `kind` (same weakness),
   same weakness in other `language`s (cross-language), and `role: sanitizer` records whose
   `kind` matches (what neutralizes it). All computed at build time from the catalog.
8. **Reviewed tier** — if an `editorial.json` overlay exists for a fact id, insert the
   "Reviewed guidance" band (safer direction + unsafe/safe code) after the handoff, and
   flip the tier badge to the green reviewed state. Otherwise the derived page stands alone.

Indexing: a page is dense enough to index once it has the derived sections above, so drop
the old `robots: noindex` on unreviewed pages — the derived precision is real content now.

## The home page
- Hero: search-intent headline + `<Search/>` + the Atropos→Lachesis thesis line; pack
  register (version, counts, revision) beside it.
- **Browse by weakness**: grid of weakness classes, each = an aggregation over `kind`/`cwe`
  (label, CWE, count of symbols, languages present). Links to a filtered browse view.
- **By language**: four tiles with symbol counts per `language` + top packages.
- **How a record reads**: one real derived card (memcpy).
- **Two questions, two tools**: the static Atropos-vs-Lachesis seam split.
- Ecosystem footer: Observatory / Casefiles / Lachesis + source link.

All home figures (weakness counts, language splits) are build-time aggregations — no
hardcoded numbers in the final version (the mock's numbers are placeholders).

## Definition of done
Every screen matches the mock's layout and the existing token system; symbol pages render
the six derived sections for ANY record from fields alone; home aggregates are computed,
not hardcoded; the build still produces a clean static export.
