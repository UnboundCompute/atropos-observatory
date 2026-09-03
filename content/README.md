# Editorial overlays

Keys are Atropos model IDs. Values add explanation without copying factual model fields.

Supported fields:

- `summary`: why the boundary matters
- `safe_pattern`: safer implementation direction
- `unsafe_example` / `safe_example`: minimal illustrative shapes
- `limitations`: where the guidance can mislead
- `references`: authoritative documentation or CWE links
- `reviewed_at` / `applies_to`: editorial maintenance metadata

Run `npm run check:content` before publishing. It verifies every editorial key exists in the current sibling Atropos checkout, required guidance is present, and reference URLs are valid.
