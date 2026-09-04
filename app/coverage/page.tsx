import Link from 'next/link';
import catalog from '../../.generated/catalog.json';
import editorial from '../../content/editorial.json';
import stats from '../../.generated/stats.json';

export const metadata = { title: 'Coverage — Atropos Observatory', description: 'How Atropos Observatory separates generated model coverage from curated editorial review.' };

export default function Coverage() {
  const reviewedIds = new Set(Object.keys(editorial));
  const reviewedSymbols = new Set(catalog.filter((entry) => reviewedIds.has(entry.id)).map((entry) => entry.slug)).size;
  const percentage = ((reviewedSymbols / stats.symbols) * 100).toFixed(1);
  return <main><section className="catalog-intro guide-intro"><div className="crumb"><Link href="/">Observatory</Link><span>/</span><b>Coverage</b></div><h1>Know what the model covers.</h1><p>Atropos supplies the generated register. Observatory adds a smaller editorial layer where examples, safer directions, limitations, and references have been reviewed together.</p></section><section className="coverage-stats"><div><span>Model rows</span><strong>{stats.total.toLocaleString()}</strong><p>Facts carried from the current Atropos pack.</p></div><div><span>Unique symbols</span><strong>{stats.symbols.toLocaleString()}</strong><p>Collision-safe routes in the generated register.</p></div><div><span>Editorial symbols</span><strong>{reviewedSymbols.toLocaleString()} <small>({percentage}%)</small></strong><p>Curated records with paired examples and references.</p></div></section><section className="guide-note"><h2>How to interpret the gap</h2><p>A symbol without an editorial overlay is not marked safe or unsafe by Observatory. It is a model fact that still needs context from the source code, framework version, and data flow. Use the exact source link on each record, then validate the result in your own codebase.</p><Link className="text-link" href="/browse">Explore the full register</Link></section></main>;
}
