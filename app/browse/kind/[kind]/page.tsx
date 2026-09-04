import Link from 'next/link';
import type { Metadata } from 'next';
import catalog from '../../../../.generated/catalog.json';

export function generateStaticParams() { return [...new Set(catalog.map((entry) => entry.kind))].map((kind) => ({ kind })); }
export async function generateMetadata({ params }: { params: Promise<{ kind: string }> }): Promise<Metadata> { const { kind } = await params; return { title: `${kind} behavior facts — Atropos Observatory`, description: `Browse Atropos model facts classified as ${kind}, with access paths and provenance.` }; }
export default async function KindPage({ params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  const rows = catalog.filter((entry) => entry.kind === kind);
  return <main><section className="catalog-intro"><div className="crumb"><Link href="/browse">Index</Link><span>/</span><b>{kind}</b></div><h1>{kind} facts.</h1><p>{rows.length.toLocaleString()} model facts classified under this behavior kind. Follow a row to inspect its complete access path and provenance.</p></section><section className="entry-table catalog-table"><div className="entry-head"><span>Symbol</span><span>Language</span><span>Role</span><span>Access path</span></div>{rows.map((entry) => <Link href={`/symbols/${entry.slug}`} className="entry-row" key={entry.id}><code>{entry.method}</code><span>{entry.language} / {entry.package || 'stdlib'}</span><span className={`role role-${entry.role}`}>{entry.role}</span><code>{entry.access_path || entry.id}</code></Link>)}</section></main>;
}
