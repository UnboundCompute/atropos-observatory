import Link from 'next/link';
import Search from '../components/Search';
import catalog from '../.generated/catalog.json';
import stats from '../.generated/stats.json';

const featured = ['javascript/child_process/global/exec', 'python/pickle/global/load', 'c/stdlib/global/system', 'javascript/shell-quote/global/quote'];
const pick = featured.map((key) => catalog.find((e) => e.slug === key)).filter(Boolean);

export default function Home() {
  return <main><section className="hero"><div className="eyebrow">ATROPOS CORE MODELS / v{stats.version}</div><h1>Security semantics<br /><i>for code search.</i></h1><p className="lede">A developer reference for sources, sinks, sanitizers, and summaries. Search the symbol. Inspect the exact access path. Follow the evidence.</p><Search /><div className="stats"><div><strong>{stats.symbols.toLocaleString()}</strong><span>symbols indexed</span></div><div><strong>{stats.total.toLocaleString()}</strong><span>verified model rows</span></div><div><strong>{stats.languages.join(' · ')}</strong><span>language coverage</span></div></div></section><section className="section"><div className="section-head"><div><div className="eyebrow">KNOWN BOUNDARIES</div><h2>Start with a symbol</h2></div><Link className="text-link" href="/browse">Browse catalog <span>↗</span></Link></div><div className="feature-grid">{pick.map((e) => e && <Link className="bezel" href={`/symbols/${e.slug}`} key={e.id}><div className="core"><div className={`role role-${e.role}`}>{e.role}</div><h3>{e.method}</h3><p>{e.package || 'standard library'}{e.type ? ` · ${e.type}` : ''}</p><code>{e.access_path || e.id}</code><span className="arrow">↗</span></div></Link>)}</div></section><section className="section bridge"><div><div className="eyebrow">PART OF UNBOUNDCOMPUTE</div><h2>One fact. Multiple ways to investigate.</h2></div><p>Read the model here, inspect a real vulnerability in <a href="https://trace.unboundcompute.com/">Trace Casefiles</a>, or map its propagation through a codebase with <a href="https://lachesis.unboundcompute.com/">Lachesis Explorer</a>.</p></section></main>;
}
