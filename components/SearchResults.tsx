'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import catalog from '../.generated/catalog.json';

export default function SearchResults() {
  const [query, setQuery] = useState('');
  useEffect(() => { setQuery(new URLSearchParams(window.location.search).get('q') || ''); }, []);
  const normalized = query.trim().toLowerCase();
  const results = useMemo(() => catalog.filter((entry) => `${entry.id} ${entry.method} ${entry.package || ''} ${entry.type || ''} ${entry.language} ${entry.role} ${entry.kind} ${entry.access_path || ''}`.toLowerCase().includes(normalized)).slice(0, 100), [normalized]);
  return <section className="searchpage" aria-labelledby="search-heading"><div className="searchpage-head"><div><p className="edition">Atropos / model lookup</p><h1 id="search-heading">Results for <code>{query || 'your query'}</code></h1><p>Search matches model IDs, methods, packages, languages, roles, behaviors, and access paths.</p></div><Link className="text-link" href="/browse">Open advanced reference</Link></div>{normalized && results.length > 0 ? <><p className="resmeta">{results.length === 100 ? '100+' : results.length} matching model records</p><div className="reslist">{results.map((entry) => <Link className="resrow" href={`/symbols/${entry.slug}`} key={entry.id}><span className="rsym">{entry.method}</span><span className="renv">{entry.language} · {entry.package || 'stdlib'}</span><span className="rans">{entry.access_path || entry.kind}</span><span className={`roletag r-${entry.role}`}>{entry.role}</span></Link>)}</div></> : <div className="missing"><p className="edition">No exact model record</p><h2>Nothing in the current pack matches that query.</h2><p className="q"><code>{query || 'your query'}</code></p><p>That does not mean the API is safe or unmodeled everywhere. Choose the next useful action:</p><div className="missing-options"><div><h3>Try a broader lookup</h3><p>Search by method name, package, language, or behavior.</p><Link className="text-link" href="/browse">Browse the reference</Link></div><div><h3>Draft a model candidate</h3><p>Start from a nearby record and shape the fields for a contribution.</p><Link className="text-link" href="/guide">Read the modeling guide</Link></div></div></div>}</section>;
}
