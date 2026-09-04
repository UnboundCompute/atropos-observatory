import Link from 'next/link';

const terms = [
  ['Source', 'An API or access path that introduces data into the analysis.'],
  ['Sink', 'An operation that consumes data at a security-sensitive boundary.'],
  ['Sanitizer', 'A transformation that constrains data under a stated condition; it is not a universal proof of safety.'],
  ['Summary', 'A model classification that carries or transforms data between access paths.'],
  ['Access path', 'The argument, property, or binding through which the model tracks data.'],
  ['Model fact', 'A generated Atropos observation. It is evidence for analysis, not a complete application-specific verdict.'],
];

export const metadata = { title: 'Field guide — Atropos Observatory', description: 'A concise guide to Atropos roles, model facts, provenance, and editorial guidance.' };

export default function Guide() {
  return <main><section className="catalog-intro guide-intro"><div className="crumb"><Link href="/">Observatory</Link><span>/</span><b>Field guide</b></div><h1>Read the register with confidence.</h1><p>Observatory separates generated model evidence from editorial interpretation. This guide defines the vocabulary before you use a record in a rule, review, or investigation.</p></section><section className="guide-grid"><div><h2>Vocabulary</h2><dl className="glossary">{terms.map(([term, definition]) => <div key={term}><dt>{term}</dt><dd>{definition}</dd></div>)}</dl></div><div><h2>How to read a record</h2><ol className="guide-steps"><li><strong>Locate the boundary.</strong><span>Start with role, kind, and access path. They describe what Atropos sees, not what your whole program does.</span></li><li><strong>Check provenance.</strong><span>Use the exact source link and model ID to inspect the upstream fact.</span></li><li><strong>Look for guidance.</strong><span>Editorial overlays add examples, safer directions, limitations, and references. Raw pages are intentionally marked “Model fact only.”</span></li><li><strong>Validate in context.</strong><span>Confirm framework versions, argument constraints, and data flow in the codebase before treating a classification as a finding.</span></li></ol></div></section><section className="guide-note"><h2>Scope and limits</h2><p>Atropos models security-relevant API semantics. It does not execute your application, infer every framework convention, or replace a code review. A missing record is not proof that an operation is safe; it may simply be outside the current model pack.</p><Link className="text-link" href="/browse">Open the model register</Link></section></main>;
}
