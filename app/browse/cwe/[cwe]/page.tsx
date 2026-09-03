import Link from 'next/link';
import catalog from '../../../../.generated/catalog.json';

export function generateStaticParams() { return [...new Set(catalog.flatMap((entry) => entry.cwe || []))].map((cwe) => ({ cwe })); }
export default async function CwePage({ params }: { params: Promise<{ cwe: string }> }) {
  const { cwe } = await params;
  const rows = catalog.filter((entry) => (entry.cwe || []).includes(cwe));
  return <main><section className="catalog-intro"><div className="crumb"><Link href="/browse">Index</Link><span>/</span><b>{cwe}</b></div><h1>{cwe} register.</h1><p>{rows.length.toLocaleString()} model facts reference this weakness class. CWE labels are carried through from the Atropos model pack without collapsing distinct symbols.</p></section><section className="entry-table catalog-table"><div className="entry-head"><span>Symbol</span><span>Language</span><span>Kind</span><span>Role</span></div>{rows.map((entry) => <Link href={`/symbols/${entry.slug}`} className="entry-row" key={entry.id}><code>{entry.method}</code><span>{entry.language} / {entry.package || 'stdlib'}</span><span>{entry.kind}</span><span className={`role role-${entry.role}`}>{entry.role}</span></Link>)}</section></main>;
}
