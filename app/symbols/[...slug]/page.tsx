import Link from 'next/link';
import type { Metadata } from 'next';
import catalog from '../../../.generated/catalog.json';
import editorial from '../../../content/editorial.json';
import editorialMeta from '../../../content/editorial-meta.json';

type Editorial = { summary?: string; safe_pattern?: string; unsafe_example?: string; safe_example?: string; limitations?: string; references?: string[]; related_casefiles?: string[] };
const editorialRecords = editorial as Record<string, Editorial>;

export function generateStaticParams() { return [...new Set(catalog.map((entry) => entry.slug))].map((slug) => ({ slug: slug.split('/') })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const key = (await params).slug.join('/');
  const facts = catalog.filter((item) => item.slug === key);
  const entry = facts[0];
  if (!entry) return { title: 'Model not found — Atropos Observatory' };
  const enriched = facts.some((fact) => editorialRecords[fact.id]);
  return { title: `${entry.method} — Atropos Observatory`, description: `${entry.method} in ${entry.package || 'the standard library'} is classified as ${[...new Set(facts.map((fact) => fact.role))].join(', ')} by Atropos.`, alternates: { canonical: `/symbols/${entry.slug}` }, robots: enriched ? { index: true, follow: true } : { index: false, follow: true } };
}

export default async function SymbolPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const key = (await params).slug.join('/');
  const facts = catalog.filter((item) => item.slug === key);
  const entry = facts[0];
  if (!entry) return <main><section className="catalog-intro"><h1>No matching fact.</h1><Link className="text-link" href="/browse">Return to index</Link></section></main>;
  const notes = facts.map((fact) => editorialRecords[fact.id]).filter(Boolean);
  const reviewed = notes.length > 0;
  const summary = notes.find((note) => note?.summary) || { summary: 'Generated Atropos model fact. No editorial overlay is attached to this record yet; treat the fields below as model evidence, not a safety conclusion.' };
  const safePattern = notes.find((note) => note?.safe_pattern);
  const examples = notes.find((note) => note?.unsafe_example || note?.safe_example);
  const references = [...new Set(notes.flatMap((note) => note?.references || []))];
  const casefiles = [...new Set(notes.flatMap((note) => note?.related_casefiles || []))];
  const related = [...new Map(catalog.filter((item) => item.slug !== key && (item.package === entry.package || item.kind === entry.kind || (entry.cwe || []).some((cwe) => (item.cwe || []).includes(cwe)))).map((item) => [item.slug, item])).values()].slice(0, 4);
  const relatedLinks = related.map((item) => <Link href={`/symbols/${item.slug}`} key={item.slug}>Related: {item.method}</Link>);
  const traceLinks = casefiles.length ? casefiles.map((url) => <a href={url} key={url}>Open related Trace Casefile ↗</a>) : [<a href="https://trace.unboundcompute.com/" key="trace">Open Trace Casefiles ↗</a>];
  return <main><section className="detail"><nav className="crumb" aria-label="Breadcrumb"><Link href="/">Observatory</Link><span>/</span><Link href="/browse">Index</Link><span>/</span><b aria-current="page">{entry.method}</b></nav><div className="detail-grid"><article><div className={`role role-${entry.role}`}>{[...new Set(facts.map((fact) => fact.role))].join(' · ')}</div><h1>{entry.method}</h1><p className="detail-sub">{entry.package || 'standard library'}{entry.type ? ` · ${entry.type}` : ''}</p><div className={`authority ${reviewed ? 'authority-reviewed' : 'authority-model'}`}><strong>{reviewed ? 'Editorially reviewed overlay' : 'Model fact only'}</strong><span>{reviewed ? `${editorialMeta.applies_to} Reviewed ${editorialMeta.reviewed_at}.` : 'Generated from Atropos; no editorial safety conclusion is attached.'}</span></div><div className="callout"><span>{reviewed ? 'Why this is indexed' : 'Model boundary'}</span><p>{summary.summary}</p></div>{safePattern && <div className="callout safe"><span>Safer direction</span><p>{safePattern.safe_pattern}</p></div>}{examples && <div className="example-grid"><div><span>Unsafe shape</span><pre>{examples.unsafe_example || 'See the model boundary above.'}</pre></div><div><span>Safer shape</span><pre>{examples.safe_example || 'Use the constrained alternative described above.'}</pre></div></div>}<section className="fact-register" aria-labelledby="facts-heading"><h2 id="facts-heading">Model facts</h2><table><thead><tr><th scope="col">Role</th><th scope="col">Kind</th><th scope="col">Access path</th><th scope="col">Model ID</th></tr></thead><tbody>{facts.map((fact) => <tr key={fact.id}><td data-label="Role"><span className={`role role-${fact.role}`}>{fact.role}</span></td><td data-label="Kind">{fact.kind}</td><td data-label="Access path"><code>{fact.access_path || 'Not specified'}</code></td><td data-label="Model ID"><code>{fact.id}</code></td></tr>)}</tbody></table></section>{related.length > 0 && <section className="related"><h2>Adjacent model symbols</h2><div>{relatedLinks}</div></section>}{facts.filter((fact) => fact.notes).map((fact) => <div className="callout" key={`${fact.id}-note`}><span>Atropos note / {fact.id}</span><p>{fact.notes}</p></div>)}{notes.filter((note) => note?.limitations).map((note, index) => <div className="callout" key={`limitation-${index}`}><span>Limitation</span><p>{note.limitations}</p></div>)}{references.length > 0 && <div className="references"><span>References</span>{references.map((reference) => <a href={reference} key={reference}>{new URL(reference).hostname} ↗</a>)}</div>}</article><aside><div className="aside-label">Symbol record</div><dl><dt>Language</dt><dd>{entry.language}</dd><dt>Package</dt><dd>{entry.package || 'stdlib'}</dd><dt>Facts</dt><dd>{facts.length}</dd><dt>Confidence</dt><dd>{[...new Set(facts.map((fact) => fact.confidence || 'verified'))].join(', ')}</dd><dt>CWE</dt><dd>{[...new Set(facts.flatMap((fact) => fact.cwe || []))].join(', ') || '—'}</dd><dt>Source file</dt><dd>{entry.source_file}</dd></dl><a className="button" href={`https://github.com/UnboundCompute/atropos/blob/main/models/${entry.source_file}`}>Open exact source</a></aside></div><div className="detail-footer"><Link href="/browse">Return to index</Link>{traceLinks}</div></section></main>;
}
