'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import catalog from '../.generated/catalog.json';

export default function FacetExplorer() {
  const [role, setRole] = useState('all');
  const [language, setLanguage] = useState('all');
  const [kind, setKind] = useState('all');
  const [cwe, setCwe] = useState('all');
  const [query, setQuery] = useState('');
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRole(params.get('role') || 'all'); setLanguage(params.get('language') || 'all'); setKind(params.get('kind') || 'all'); setCwe(params.get('cwe') || 'all'); setQuery(params.get('q') || '');
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    const params = new URLSearchParams();
    if (role !== 'all') params.set('role', role); if (language !== 'all') params.set('language', language); if (kind !== 'all') params.set('kind', kind); if (cwe !== 'all') params.set('cwe', cwe); if (query.trim()) params.set('q', query.trim());
    const next = params.toString();
    window.history.replaceState(null, '', next ? `/browse?${next}` : '/browse');
  }, [hydrated, role, language, kind, cwe, query]);
  const languages = useMemo(() => [...new Set(catalog.map((entry) => entry.language))].sort(), []);
  const kinds = useMemo(() => [...new Set(catalog.map((entry) => entry.kind))].sort(), []);
  const cwes = useMemo(() => [...new Set(catalog.flatMap((entry) => entry.cwe || []))].sort(), []);
  const rows = useMemo(() => catalog.filter((entry) => {
    const haystack = `${entry.method} ${entry.package || ''} ${entry.access_path || ''}`.toLowerCase();
    return (role === 'all' || entry.role === role) && (language === 'all' || entry.language === language) && (kind === 'all' || entry.kind === kind) && (cwe === 'all' || (entry.cwe || []).includes(cwe)) && (!query.trim() || haystack.includes(query.toLowerCase()));
  }), [role, language, kind, cwe, query]);
  return <section className="facet-explorer" aria-labelledby="facet-heading"><div className="section-head"><div><h2 id="facet-heading">Narrow the register</h2><p>Combine role, language, behavior, weakness, and symbol query.</p></div><span className="facet-count" role="status" aria-live="polite">{rows.length.toLocaleString()} matches</span></div><div className="facet-controls"><label>Role<select value={role} onChange={(event) => setRole(event.target.value)}><option value="all">All roles</option>{['sink', 'source', 'sanitizer', 'summary'].map((value) => <option key={value} value={value}>{value}</option>)}</select></label><label>Language<select value={language} onChange={(event) => setLanguage(event.target.value)}><option value="all">All languages</option>{languages.map((value) => <option key={value} value={value}>{value}</option>)}</select></label><label>Behavior<select value={kind} onChange={(event) => setKind(event.target.value)}><option value="all">All behaviors</option>{kinds.map((value) => <option key={value} value={value}>{value}</option>)}</select></label><label>Weakness<select value={cwe} onChange={(event) => setCwe(event.target.value)}><option value="all">All CWEs</option>{cwes.map((value) => <option key={value} value={value}>{value}</option>)}</select></label><label className="facet-query">Symbol or path<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="exec, pickle, queryRaw…" /></label></div>{rows.length === 0 ? <p className="search-status">No facts match these filters. Clear a filter or try a broader symbol query.</p> : <div className="entry-table facet-results"><div className="entry-head"><span>Symbol</span><span>Environment</span><span>Role</span><span>Kind</span></div>{rows.slice(0, 100).map((entry) => <Link href={`/symbols/${entry.slug}`} className="entry-row" key={entry.id}><code>{entry.method}</code><span>{entry.language} / {entry.package || 'stdlib'}</span><span className={`role role-${entry.role}`}>{entry.role}</span><span>{entry.kind}</span></Link>)}</div>}{rows.length > 100 && <p className="search-status">Showing the first 100 matches. Narrow the filters to continue.</p>}</section>;
}
