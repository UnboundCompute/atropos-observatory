import Link from 'next/link';
import type { Metadata } from 'next';
import catalog from '../../../.generated/catalog.json';
import editorial from '../../../content/editorial.json';

type Editorial = { summary?: string; safe_pattern?: string; unsafe_example?: string; safe_example?: string; limitations?: string; references?: string[] };
const editorialRecords = editorial as Record<string, Editorial>;

export function generateStaticParams() {
  return [...new Set(catalog.map((entry) => entry.slug))].map((slug) => ({ slug: slug.split('/') }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const key = (await params).slug.join('/');
  const facts = catalog.filter((item) => item.slug === key);
  const entry = facts[0];
  if (!entry) return { title: 'Model not found — Atropos Observatory' };
  const description = `${entry.method} in ${entry.package || 'the standard library'} is classified as ${[...new Set(facts.map((fact) => fact.role))].join(', ')} by Atropos.`;
  const enriched = facts.some((fact) => editorialRecords[fact.id]);
  return { title: `${entry.method} — Atropos Observatory`, description, alternates: { canonical: `/symbols/${entry.slug}` }, robots: enriched ? { index: true, follow: true } : { index: false, follow: true } };
}

export default async function SymbolPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const key = (await params).slug.join('/');
  const facts = catalog.filter((item) => item.slug === key);
  const entry = facts[0];
  if (!entry) return <main><section className="catalog-intro"><h1>No matching fact.</h1><Link className="text-link" href="/browse">Return to index</Link></section></main>;
  const notes = facts.map((fact) => editorialRecords[fact.id]).filter(Boolean);
  const summary = notes.find((note) => note?.summary);
  const safePattern = notes.find((note) => note?.safe_pattern);
  const examples = notes.find((note) => note?.unsafe_example || note?.safe_example);
  const references = [...new Set(notes.flatMap((note) => note?.references || []))];

  return <main><section className="detail"><div className="crumb"><Link href="/">Observatory</Link><span>/</span><Link href="/browse">Index</Link><span>/</span><b>{entry.language}</b></div><div className="detail-grid"><article><div className={`role role-${entry.role}`}>{[...new Set(facts.map((fact) => fact.role))].join(' · ')}</div><h1>{entry.method}</h1><p className="detail-sub">{entry.package || 'standard library'}{entry.type ? ` · ${entry.type}` : ''}</p>{summary && <div className="callout"><span>Why this is indexed</span><p>{summary.summary}</p></div>}{safePattern && <div className="callout safe"><span>Safer direction</span><p>{safePattern.safe_pattern}</p></div>}{examples && <div className="example-grid"><div><span>Unsafe shape</span><pre>{examples.unsafe_example || 'See the model boundary above.'}</pre></div><div><span>Safer shape</span><pre>{examples.safe_example || 'Use the constrained alternative described above.'}</pre></div></div>}<section className="fact-register"><h2>Model facts</h2><div className="fact-register-head"><span>Role</span><span>Kind</span><span>Access path</span><span>Model ID</span></div>{facts.map((fact) => <div className="fact-register-row" key={fact.id}><span className={`role role-${fact.role}`}>{fact.role}</span><span>{fact.kind}</span><code>{fact.access_path || 'Not specified'}</code><code>{fact.id}</code></div>)}</section>{facts.filter((fact) => fact.notes).map((fact) => <div className="callout" key={`${fact.id}-note`}><span>Atropos note / {fact.id}</span><p>{fact.notes}</p></div>)}{notes.filter((note) => note?.limitations).map((note, index) => <div className="callout" key={`limitation-${index}`}><span>Limitation</span><p>{note.limitations}</p></div>)}{references.length > 0 && <div className="references"><span>References</span>{references.map((reference) => <a href={reference} key={reference}>{new URL(reference).hostname} ↗</a>)}</div>}</article><aside><div className="aside-label">Symbol record</div><dl><dt>Language</dt><dd>{entry.language}</dd><dt>Package</dt><dd>{entry.package || 'stdlib'}</dd><dt>Facts</dt><dd>{facts.length}</dd><dt>Confidence</dt><dd>{[...new Set(facts.map((fact) => fact.confidence || 'verified'))].join(', ')}</dd><dt>CWE</dt><dd>{[...new Set(facts.flatMap((fact) => fact.cwe || []))].join(', ') || '—'}</dd><dt>Source file</dt><dd>{entry.source_file}</dd></dl><a className="button" href={`https://github.com/UnboundCompute/atropos/blob/main/models/${entry.source_file}`}>Open exact source</a></aside></div><div className="detail-footer"><Link href="/browse">Return to index</Link><a href="https://trace.unboundcompute.com/">Trace a concrete case</a></div></section></main>;
}
