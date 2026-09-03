import Link from 'next/link';
import catalog from '../../../.generated/catalog.json';
import editorial from '../../../content/editorial.json';

export function generateStaticParams() { return catalog.map((entry) => ({ slug: entry.slug.split('/') })); }

export default async function SymbolPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const key = (await params).slug.join('/');
  const entry = catalog.find((item) => item.slug === key);
  if (!entry) return <main><section className="section"><div className="eyebrow">404 / MODEL NOT FOUND</div><h1 className="page-title">No matching fact.</h1><Link className="text-link" href="/browse">Return to catalog ↗</Link></section></main>;
  const note = editorial[entry.id as keyof typeof editorial];
  return <main><section className="detail"><div className="crumb"><Link href="/">Observatory</Link><span>/</span><Link href="/browse">Catalog</Link><span>/</span><b>{entry.language}</b></div><div className="detail-grid"><article><div className={`role role-${entry.role}`}>{entry.role}</div><h1>{entry.method}</h1><p className="detail-sub">{entry.package || 'standard library'}{entry.type ? ` · ${entry.type}` : ''}</p>{note?.summary && <div className="callout"><span>WHY THIS IS INDEXED</span><p>{note.summary}</p></div>}{note?.safe_pattern && <div className="callout safe"><span>SAFER DIRECTION</span><p>{note.safe_pattern}</p></div>}<div className="fact-block"><span>ACCESS PATH</span><code>{entry.access_path || 'Not specified'}</code></div><div className="fact-block"><span>MODEL ID</span><code>{entry.id}</code></div>{entry.notes && <div className="callout"><span>ATROPOS NOTE</span><p>{entry.notes}</p></div>}</article><aside><div className="aside-label">MODEL RECORD</div><dl><dt>Role</dt><dd>{entry.role}</dd><dt>Kind</dt><dd>{entry.kind}</dd><dt>Confidence</dt><dd>{entry.confidence || 'verified'}</dd><dt>Corroboration</dt><dd>{entry.corroboration || 'recorded'}</dd>{entry.cwe && <><dt>CWE</dt><dd>{entry.cwe}</dd></>}</dl><a className="button" href="https://github.com/UnboundCompute/atropos">Open Atropos source <span>↗</span></a></aside></div><div className="detail-footer"><Link href="/browse">← Browse catalog</Link><a href="https://trace.unboundcompute.com/">Trace a concrete case ↗</a></div></section></main>;
}
