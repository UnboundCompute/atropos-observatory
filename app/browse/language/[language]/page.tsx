import Link from 'next/link';
import catalog from '../../../../.generated/catalog.json';

export function generateStaticParams() { return [...new Set(catalog.map((entry) => entry.language))].map((language) => ({ language })); }
export default async function LanguagePage({ params }: { params: Promise<{ language: string }> }) {
  const { language } = await params;
  const rows = catalog.filter((entry) => entry.language === language);
  return <main><section className="catalog-intro"><div className="crumb"><Link href="/browse">Index</Link><span>/</span><b>{language}</b></div><h1>{language} register.</h1><p>{rows.length.toLocaleString()} exact model facts. These entries retain their Atropos IDs and source paths so the language slice can be audited independently.</p></section><section className="entry-table catalog-table"><div className="entry-head"><span>Symbol</span><span>Package</span><span>Role</span><span>Kind</span></div>{rows.map((entry) => <Link href={`/symbols/${entry.slug}`} className="entry-row" key={entry.id}><code>{entry.method}</code><span>{entry.package || 'stdlib'}</span><span className={`role role-${entry.role}`}>{entry.role}</span><span>{entry.kind}</span></Link>)}</section></main>;
}
