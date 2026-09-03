import Link from 'next/link';
import Search from '../components/Search';
import catalog from '../.generated/catalog.json';
import stats from '../.generated/stats.json';

const featured = ['javascript/child_process/global/exec', 'python/pickle/global/load', 'c/stdlib/global/system', 'javascript/shell-quote/global/quote'];
const pick = featured.map((key) => catalog.find((e) => e.slug === key)).filter(Boolean);

export default function Home() {
  return <main><section className="hero"><div className="eyebrow">ATROPOS / REFERENCE INSTRUMENT</div><h1>Dangerous APIs,<br /><i>made legible.</i></h1><p className="lede">A calm, searchable index of security semantics: what a symbol receives, returns, transforms, and why it matters.</p><Search /><div className="stats"><div><strong>{stats.symbols.toLocaleString()}</strong><span>unique symbols</span></div><div><strong>{stats.total.toLocaleString()}</strong><span>verified facts</span></div><div><strong>{stats.languages.length}</strong><span>languages</span></div></div></section><section className="section"><div className="section-head"><div><div className="eyebrow">START WITH SIGNAL</div><h2>Frequently investigated</h2></div><Link className="text-link" href="/browse">Browse all facts <span>↗</span></Link></div><div className="feature-grid">{pick.map((e) => e && <Link className="bezel" href={`/symbols/${e.slug}`} key={e.id}><div className="core"><div className={`role role-${e.role}`}>{e.role}</div><h3>{e.method}</h3><p>{e.package || 'standard library'}{e.type ? ` · ${e.type}` : ''}</p><code>{e.access_path || e.id}</code><span className="arrow">↗</span></div></Link>)}</div></section><section className="section bridge"><div><div className="eyebrow">FROM FACT TO TRACE</div><h2>Semantics are the beginning of the investigation.</h2></div><p>Use Observatory to understand a symbol, then follow the evidence through <a href="https://trace.unboundcompute.com/">Trace Casefiles</a> or map an entire codebase in <a href="https://lachesis.unboundcompute.com/">Lachesis Explorer</a>.</p></section></main>;
}
