import Link from 'next/link';
import type { Metadata } from 'next';
import catalog from '../../../.generated/catalog.json';

export function generateStaticParams() { return [...new Set(catalog.map((entry) => entry.role))].map((role) => ({ role })); }
export async function generateMetadata({ params }: { params: Promise<{ role: string }> }): Promise<Metadata> { const { role } = await params; return { title: `${role} register — Atropos Observatory`, description: `Browse Atropos model facts classified as ${role}, with access paths and source provenance.` }; }

export default async function RolePage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;
  const rows = catalog.filter((entry) => entry.role === role);
  return <main><section className="catalog-intro"><h1>{role} register.</h1><p>{rows.length.toLocaleString()} exact model facts. Select a row to inspect access paths, confidence, corroboration, and available editorial guidance.</p></section><section className="entry-table catalog-table"><div className="entry-head"><span>Symbol</span><span>Environment</span><span>Kind</span><span>Access path</span></div>{rows.map((entry) => <Link href={`/symbols/${entry.slug}`} className="entry-row" key={entry.id}><code>{entry.method}</code><span>{entry.language} / {entry.package || 'stdlib'}</span><span>{entry.kind}</span><code>{entry.access_path || entry.id}</code></Link>)}</section></main>;
}
