# Atropos Observatory

## Platform
Web reference product, desktop-first and fully usable on mobile.

## Purpose
Make security-relevant API semantics searchable, explainable, and linkable. Observatory is the reading and discovery surface for the Atropos model pack, not a second source of truth.

## Users
Security engineers, CodeQL/Semgrep rule authors, application developers, and maintainers investigating a risky symbol.

## Launch shape
Next.js App Router with static export. The build ingests `../atropos/models/**/*.json`; generated catalog files are disposable build artifacts. Curated editorial overlays add explanation, examples, caveats, and links without copying model facts.

## Design direction
Read mode presented as a maintained security field manual: warm archival paper, near-black ink, safety red for action, and sparse semantic colors for model roles. Typography, rules, registers, and tables carry the hierarchy. The surface deliberately avoids SaaS glass, gradients, bento cards, decorative texture, and dashboard theatre.

## Constraints
No backend, auth, or database. Canonical URL is configurable (default `https://atropos.unboundcompute.com`). Raw catalog pages are discoverable; only enriched pages are intended for broad SEO indexing at launch.

## Product principles
1. Exactness before confidence theatre.
2. Every claim has a visible boundary and provenance.
3. Search should feel immediate; reading should feel calm.
4. Interlink the UnboundCompute ecosystem at the moment of relevance.
