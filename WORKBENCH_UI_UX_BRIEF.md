# Atropos Observatory: Product and UI/UX Exploration Brief

## Why this document exists

We should not continue implementing Atropos Observatory until its product value and interaction model are convincing in low-fidelity UI/UX mocks.

The current implementation is visually competent, but the product still feels thin. It exposes Atropos model data, adds a small reviewed editorial layer, and groups selected records into security guides. That is not yet enough reason for a security engineer, application developer, or AI agent to return to it instead of using the Atropos repository, CWE, OWASP, or official API documentation directly.

This document is a brief for exploring a sharper direction before further code is written.

## The honest problem

The existing Observatory tries to be several things at once:

- A searchable browser for the Atropos model pack.
- A human-readable security reference.
- A collection of short security guides.
- An entry point into the wider UnboundCompute ecosystem.

None of those jobs is currently deep enough to make the product indispensable.

For an AI agent, the source repository and JSON model files are more complete and easier to process. For a human, OWASP, CWE, and official API documentation usually provide deeper explanations. A polished presentation layer does not solve this value gap.

The interface also inherits the complexity of the source model too early. Terms such as source, sink, sanitizer, summary, access path, kind, and CWE appear before a first-time visitor has a concrete task. This creates the feeling of navigating an internal taxonomy rather than using a tool.

## Proposed product direction

The strongest direction is to turn Observatory into an **Atropos Model Workbench**.

Its primary promise would be:

> I am building, reviewing, or debugging static analysis. Show me how an API is modeled, why it is modeled that way, and what I should do next.

This is different from a general security encyclopedia. It is an operational companion to the Atropos model pack.

The working name can remain **Atropos Observatory**. “Model Workbench” describes the product function, not necessarily the final brand name.

## Primary users

### 1. Static-analysis rule author

They know an API is security-relevant and need to determine:

- Whether Atropos already models it.
- Which argument, return value, property, or receiver is tracked.
- Whether it is a source, sink, sanitizer, or summary.
- Which weakness and behavior category it belongs to.
- How to express the same model for a missing or adjacent API.
- Whether an existing model looks incorrect or overly broad.

### 2. Security engineer reviewing a finding

They encounter an unfamiliar modeled API and need to determine:

- Why the analyzer treats it as security-relevant.
- What conditions make the call dangerous.
- What the model proves and does not prove.
- Which safer patterns apply.
- Where the model came from and when it was ingested.

### 3. Atropos maintainer

They need to:

- Search the complete model surface quickly.
- Find duplicates, inconsistencies, and suspiciously broad models.
- Compare related records across languages and packages.
- inspect coverage gaps.
- Copy a stable model ID or source link into an issue or review.

### 4. AI coding or security agent

It needs predictable, structured access to:

- Exact model facts.
- Stable identifiers and immutable provenance.
- Machine-readable related records.
- Clear distinctions between source data and human interpretation.
- A canonical URL that can be cited in a report or code review.

## Jobs the product must support

The UI should be designed around tasks, not around the source taxonomy.

### Job A: Look up an API

Input examples:

- `child_process.exec`
- `pickle.load`
- `mysql_query`
- `Argument[0]`
- A full Atropos model ID

Expected outcome:

- See the best matching symbol immediately.
- Understand its security role in one sentence.
- See the exact tracked access path.
- Open the immutable source record.
- Copy the model ID or model declaration.

### Job B: Understand why a model exists

Expected outcome:

- Read the model rationale without decoding internal fields first.
- See the dangerous call shape and a safer call shape where reviewed guidance exists.
- Understand limitations and context requirements.
- Follow authoritative references.
- Distinguish clearly between reviewed guidance and raw model facts.

### Job C: Model a similar or missing API

Expected outcome:

- Start from an existing record.
- See the model expressed in a copyable declaration or schema shape.
- Compare neighboring APIs with the same role or behavior.
- Change language, package, type, method, role, and access path in a controlled draft.
- Validate the draft against the Atropos schema.
- Export or copy the proposed model.

This can initially be a client-side drafting tool. It does not need authentication or automatic repository writes.

### Job D: Review or challenge an existing model

Expected outcome:

- See confidence, corroboration, notes, weakness mapping, and source revision.
- Compare the model with related records.
- Identify whether a model is unusually broad, duplicated, or missing type/package constraints.
- Generate a stable link suitable for an issue or pull request.

### Job E: Explore coverage

Expected outcome:

- Answer a specific question such as “Which Python deserializers are modeled?”
- Move between language, behavior, role, and package without facing every filter simultaneously.
- Understand the difference between model coverage and editorial review coverage.

## What the product should not become

- A generic cybersecurity content site.
- A thin SEO page for every model row.
- A second manually maintained copy of Atropos facts.
- A dashboard full of counts without a user decision attached to them.
- A vulnerability database competing with Trace Casefiles.
- A codebase explorer competing with Lachesis.
- A static glossary where visitors must learn the ontology before they can act.
- A model editor that silently writes to the Atropos repository.

## Relationship to other UnboundCompute products

The products should have distinct jobs:

- **Atropos Observatory / Model Workbench:** understand, inspect, compare, and draft security models for APIs.
- **Trace Casefiles:** study security behavior inside real vulnerabilities and incidents.
- **Lachesis:** inspect how behavior and data flow appear inside a codebase.

Links between them should appear only when the relationship is concrete. Observatory should not show a generic “open Trace” action when no casefile is mapped to the current model.

## Existing data and technical constraints

The product is a Next.js App Router application with static export.

The build ingests the existing Atropos model pack from:

```text
../atropos/models/**/*.json
```

Current source data includes approximately:

- 1,617 model facts.
- 1,449 unique symbol routes.
- Four languages: C, JavaScript, Python, and TypeScript.
- Roles such as source, sink, sanitizer, and summary.
- Model fields including language, package, type, method, access path, kind, CWE, confidence, corroboration, notes, and stable ID.

There are currently 26 human-reviewed editorial overlays. They cover five practical topics:

- Command execution.
- SQL queries.
- Deserialization.
- Dynamic evaluation.
- Memory bounds.

The Atropos model data should remain the source of truth. The product may derive views, relationships, comparisons, indexes, or draft output from it. It should not manually rewrite all model facts into a second content system.

The deployed product has no backend, authentication, or database. Useful first versions must work as static pages and client-side interactions.

## Information architecture to explore

Do not treat this as a prescribed sitemap. It is a starting hypothesis to test through mocks.

```text
Atropos Observatory
├── Search / command entry point
├── Model record
│   ├── Plain-language meaning
│   ├── Exact model facts
│   ├── Evidence and provenance
│   ├── Copyable model declaration
│   ├── Related and comparable models
│   └── Start a model draft
├── Model Workbench
│   ├── Draft a model
│   ├── Validate fields
│   └── Copy/export result
├── Explore
│   ├── Guided question-based discovery
│   └── Advanced reference filters
├── Security guides
└── Coverage and methodology
```

The design exploration should test whether some of these belong on one integrated screen instead of separate routes.

## Critical UX questions

### Entry point

- What should a first-time visitor do in the first ten seconds?
- Should the home screen begin with one dominant API/model search field?
- Can visitors paste a model ID, API name, or partial declaration into the same command entry point?
- How should example queries teach the product without adding onboarding cards?

### Model record

- What is the smallest first viewport that answers “what is this, why does it matter, and what is modeled?”
- Should internal model fields be progressively disclosed after a plain-language summary?
- How should multiple facts attached to one symbol be represented without becoming a dense table immediately?
- How should reviewed guidance differ visually from generated facts?
- Where should copy actions live for model ID, access path, source URL, and model declaration?

### Workbench

- Should drafting open beside the source record, below it, or on a dedicated route?
- Is the best interaction a structured form, a code editor, or a synchronized split view?
- How does a user start from an existing model and modify only the relevant fields?
- What validation feedback is possible entirely in the browser?
- How should draft output be copied or exported without implying it was submitted upstream?

### Exploration

- Can the product ask human questions such as “What does this API do with untrusted data?” before exposing role/kind/CWE filters?
- Which filters deserve permanent visibility, and which belong under advanced controls?
- How should zero results distinguish “not in Atropos” from “filtered out”? 
- Can related-model comparison replace some browsing and taxonomy pages?

### AI-agent use

- What canonical machine-readable representation should accompany each model page?
- Should the site publish static JSON endpoints, embedded JSON-LD, an `llms.txt`, or all three?
- What information would let an agent cite Observatory instead of reopening the repository?
- How should the distinction between generated evidence and editorial interpretation appear in structured output?

### Trust

- How prominently should the ingested Atropos version and Git revision appear?
- How should stale data be communicated?
- Should every factual field link to its exact source line or only to its containing source file?
- How should confidence and corroboration be explained without creating false certainty?

## Content requirements for the mocks

Mocks should use realistic content, not placeholder copy. At minimum, use these representative cases:

### Reviewed sink: `child_process.exec`

- Language: JavaScript.
- Package: `child_process`.
- Role: sink.
- Kind: command injection.
- Access path: `Argument[0]`.
- CWE: CWE-78.
- Core message: the command is executed through the host shell, so caller-controlled text can become shell syntax.
- Safer direction: prefer a fixed executable and explicit argument array through an API such as `execFile` with shell mode disabled.

### Reviewed sanitizer: `shell-quote.quote`

- Language: JavaScript.
- Package: `shell-quote`.
- Role: sanitizer.
- Kind: command injection.
- Core limitation: quoting for one shell grammar is not proof that the complete command is safe.

### Reviewed deserializer: `pickle.load`

- Language: Python.
- Role: sink.
- Kind: deserialization.
- CWE: CWE-502.
- Core message: object reconstruction can execute code.
- Safer direction: use a data-only format when the payload is not fully trusted.

### Raw model-only record

Include at least one record without editorial guidance. The mock must make it impossible to confuse a generated model fact with a reviewed security conclusion.

### Missing model

Include a search for a plausible API that is not in Atropos. Explore whether the product should offer a model draft, nearby matches, or instructions for contributing.

## Visual direction

The current visual world is a maintained technical field manual:

- Warm archival paper.
- Near-black ink.
- Safety red for actions and warnings.
- Sparse semantic colors for model roles.
- Serif editorial headings and prose.
- Sans-serif interface labels.
- Monospace only for code, IDs, paths, and measurements.
- Flat, precise surfaces with strong typographic hierarchy.

The current design deliberately avoids generic SaaS gradients, glass effects, decorative bento cards, excessive pills, and dashboard theatre.

Claude should challenge this direction if another visual system makes the workbench substantially easier to understand. The result should still feel authored for security-model analysis rather than transferable to any developer tool.

## Mock set requested

Please propose and explain at least two materially different UX concepts before selecting one.

For the recommended concept, create or describe mocks for:

1. Desktop home / universal model search.
2. Search results, including ambiguous and missing-model states.
3. Desktop reviewed model record.
4. Desktop raw model-only record.
5. Model drafting or “model a similar API” workflow.
6. Related-model comparison.
7. Mobile home and model record.

Low- or medium-fidelity wireframes are preferred initially. We need to validate hierarchy, tasks, states, and navigation before visual polish.

## Evaluation criteria

A concept is successful only if:

- A first-time visitor can explain the product after one screen.
- A rule author can reach an exact model fact faster than by browsing repository JSON.
- A reviewed record provides meaningful context beyond the raw model.
- A raw record remains useful without pretending to contain reviewed guidance.
- A user can begin modeling an adjacent API from an existing record.
- Advanced terminology appears when useful, not as an entrance requirement.
- Every evidence claim has visible provenance.
- The mobile flow remains task-complete rather than becoming a compressed desktop table.
- The interface has a recognizable Atropos-specific character.
- An AI agent can retrieve and cite stable structured evidence.

## Questions for Claude

Please respond as a skeptical product designer, information architect, and security-tool UX specialist.

1. Is the Model Workbench direction strong enough to justify a separate product? If not, recommend removing or merging it rather than forcing a UI concept.
2. Which single recurring workflow should define the product?
3. What is unnecessary or still confused in this brief?
4. Propose two substantially different information architectures and interaction models.
5. Show the key screens as low- or medium-fidelity wireframes using realistic content from this document.
6. Walk through the experience for a first-time application developer, an experienced rule author, and an AI coding agent.
7. Identify what the mocks still cannot validate without speaking to real Atropos users.
8. End with a clear recommendation: proceed, narrow the concept further, merge it into Atropos documentation, or discontinue it.

Do not optimize for preserving the existing implementation. The objective is to determine whether a useful product exists and what its workflow should be before more engineering effort is spent.
