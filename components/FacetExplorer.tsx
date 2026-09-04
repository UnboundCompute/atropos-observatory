'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import catalog from '../.generated/catalog.json';
import editorial from '../content/editorial.json';

export default function FacetExplorer() {
  const [role, setRole] = useState('all'); const [language, setLanguage] = useState('all'); const [kind, setKind] = useState('all'); const [cwe, setCwe] = useState('all'); const [status, setStatus] = useState('all'); const [query, setQuery] = useState(''); const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const applyUrlFilters = () => {
      const params = new URLSearchParams(window.location.search);
      setRole(params.get('role') || 'all');
      setLanguage(params.get('language') || 'all');
      setKind(params.get('kind') || 'all');
      setCwe(params.get('cwe') || 'all');
      setStatus(params.get('status') || 'all');
      setQuery(params.get('q') || '');
      setHydrated(true);
    };
    applyUrlFilters();
    window.addEventListener('popstate', applyUrlFilters);
    return () => window.removeEventListener('popstate', applyUrlFilters);
  }, []);
  useEffect(() => { if (!hydrated) return; const params = new URLSearchParams(); if (role !== 'all') params.set('role', role); if (language !== 'all') params.set('language', language); if (kind !== 'all') params.set('kind', kind); if (cwe !== 'all') params.set('cwe', cwe); if (status !== 'all') params.set('status', status); if (query.trim()) params.set('q', query.trim()); window.history.replaceState(null, '', params.toString() ? `/browse?${params}` : '/browse'); }, [hydrated, role, language, kind, cwe, status, query]);
  const languages = useMemo(() => [...new Set(catalog.map((entry) => entry.language))].sort(), []); const kinds = useMemo(() => [...new Set(catalog.map((entry) => entry.kind))].sort(), []); const cwes = useMemo(() => [...new Set(catalog.flatMap((entry) => entry.cwe || []))].sort(), []);
  const rows = useMemo(() => catalog.filter((entry) => { const haystack = `${entry.method} ${entry.package || ''} ${entry.access_path || ''}`.toLowerCase(); const reviewed = Object.prototype.hasOwnProperty.call(editorial, entry.id); return (role === 'all' || entry.role === role) && (language === 'all' || entry.language === language) && (kind === 'all' || entry.kind === kind) && (cwe === 'all' || (entry.cwe || []).includes(cwe)) && (status === 'all' || (status === 'reviewed' ? reviewed : !reviewed)) && (!query.trim() || haystack.includes(query.toLowerCase())); }), [role, language, kind, cwe, status, query]);
  const clearAll = () => { setRole('all'); setLanguage('all'); setKind('all'); setCwe('all'); setStatus('all'); setQuery(''); };
  return <section className="facet-explorer" aria-labelledby="facet-heading"><div className="section-head"><div><h2 id="facet-heading">Narrow the register</h2><p>Combine role, language, behavior, weakness, review status, and symbol query.</p></div><div className="facet-summary"><span className="facet-count" role="status" aria-live="polite">{rows.length.toLocaleString()} matches</span><button type="button" className="facet-clear" onClick={clearAll}>Clear all</button></div></div><div className="facet-controls"><label>Role<select value={role} onChange={(event) => setRole(event.target.value)}><option value="all">All roles</option>{['sink', 'source', 'sanitizer', 'summary'].map((value) => <option key={value} value={value}>{value}</option>)}</select></label><label>Language<select value={language} onChange={(event) => setLanguage(event.target.value)}><option value="all">All languages</option>{languages.map((value) => <option key={value} value={value}>{value}</option>)}</select></label><label>Behavior<select value={kind} onChange={(event) => setKind(event.target.value)}><option value="all">All behaviors</option>{kinds.map((value) => <option key={value} value={value}>{value}</option>)}</select></label><label>Weakness<select value={cwe} onChange={(event) => setCwe(event.target.value)}><option value="all">All CWEs</option>{cwes.map((value) => <option key={value} value={value}>{value}</option>)}</select></label><label>Status<select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All records</option><option value="reviewed">Editorially reviewed</option><option value="model">Model fact only</option></select></label><label className="facet-query">Symbol, package, or path<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="exec, pickle, queryRaw…" /></label></div>{rows.length === 0 ? <p className="search-status">No facts match these filters. Clear a filter or try a broader symbol query.</p> : <table className="entry-table facet-results"><thead><tr className="entry-head"><th scope="col">Symbol</th><th scope="col">Environment</th><th scope="col">Role</th><th scope="col">Kind</th><th scope="col">Status</th></tr></thead><tbody>{rows.slice(0, 100).map((entry) => { const reviewed = Object.prototype.hasOwnProperty.call(editorial, entry.id); return <tr className="entry-row" key={entry.id}><td data-label="Symbol"><Link href={`/symbols/${entry.slug}`}><code>{entry.method}</code></Link></td><td data-label="Environment">{entry.language} / {entry.package || 'stdlib'}</td><td data-label="Role"><span className={`role role-${entry.role}`}>{entry.role}</span></td><td data-label="Kind">{entry.kind}</td><td data-label="Status"><span className={reviewed ? 'reviewed-status' : 'model-status'}>{reviewed ? 'Reviewed' : 'Model fact'}</span></td></tr>;})}</tbody></table>}{rows.length > 100 && <p className="search-status">Showing the first 100 matches. Narrow the filters to continue.</p>}</section>;
}
