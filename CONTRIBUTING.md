# Contributing

Thanks for improving the Observatory. Start by reading [PRODUCT.md](PRODUCT.md), [DESIGN.md](DESIGN.md), and the handoff in [design/DOOR_A_HANDOFF.md](design/DOOR_A_HANDOFF.md).

## Local workflow

```bash
npm ci
npm run lint
npm run build
```

Builds need a sibling Atropos checkout, or `ATROPOS_ROOT=/path/to/atropos`.

## Data and content rules

- Treat Atropos model fields as the source of truth.
- Add reusable explanations to the per-kind templates rather than duplicating prose on every page.
- Editorial overrides must use stable model IDs and include source links where applicable.
- Keep CWE descriptions factual and link to authoritative references.
- Do not commit generated `out/`, `.next/`, or local secrets.

## Pull requests

Explain the user-facing result, include the validation commands you ran, and add screenshots for visual changes. Keep changes focused and preserve static-export compatibility.
