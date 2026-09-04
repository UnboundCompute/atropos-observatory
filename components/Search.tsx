'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type Item = { id: string; language: string; package?: string; type?: string; method: string; role: string; kind: string; slug: string };

export default function Search() {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const router = useRouter();
  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if (event.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') { event.preventDefault(); inputRef.current?.focus(); }
    };
    window.addEventListener('keydown', onShortcut);
    return () => window.removeEventListener('keydown', onShortcut);
  }, []);

  const loadIndex = () => {
    if (loaded || loading) return;
    setLoading(true);
    fetch('/generated/search-index.json')
      .then((response) => {
        if (!response.ok) throw new Error(`Search index returned ${response.status}`);
        return response.json();
      })
      .then((data) => { setItems(data); setLoaded(true); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  const results = query.trim().length > 1
    ? items.filter((entry) => `${entry.method} ${entry.package || ''} ${entry.language} ${entry.role} ${entry.kind}`.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : [];

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') { setQuery(''); setActive(-1); return; }
    if (event.key === 'Enter' && query.trim().length > 1 && active < 0) { event.preventDefault(); router.push(`/browse?q=${encodeURIComponent(query.trim())}`); return; }
    if (!results.length) return;
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive((index) => Math.min(index + 1, results.length - 1)); }
    if (event.key === 'ArrowUp') { event.preventDefault(); setActive((index) => Math.max(index - 1, 0)); }
    if (event.key === 'Enter' && active >= 0) { event.preventDefault(); router.push(`/symbols/${results[active].slug}`); }
  };

  const hasQuery = query.trim().length > 1;
  return <div className="search-wrap"><label htmlFor="catalog-search">Search the model pack <kbd>/</kbd></label><div className="search-box"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg><input ref={inputRef} id="catalog-search" role="combobox" aria-expanded={results.length > 0} aria-controls={results.length > 0 ? listId : undefined} aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined} aria-autocomplete="list" aria-busy={loading} autoComplete="off" value={query} onFocus={loadIndex} onChange={(event) => { loadIndex(); setQuery(event.target.value); setActive(-1); }} onKeyDown={onKeyDown} placeholder="Try child_process.exec, pickle.load, memcpy…" />{query && <button className="search-clear" type="button" onClick={() => { setQuery(''); setActive(-1); }}>Clear</button>}</div>{loading && <p className="search-status" role="status">Loading the local model index…</p>}{error && <p className="search-error" role="status">The local search index could not be loaded. <Link href="/browse">Browse the catalog</Link>.</p>}{hasQuery && !loading && !error && results.length === 0 && <p className="search-status" role="status">No matching model facts. Try a method name, package, language, or role.</p>}{results.length > 0 && <div className="search-results" id={listId} role="listbox" aria-label="Model search results">{results.map((entry, index) => <Link href={`/symbols/${entry.slug}`} id={`${listId}-${index}`} role="option" aria-selected={active === index} key={entry.id}><b>{entry.method}</b><small>{entry.language} · {entry.package || 'stdlib'}</small><span className={`role role-${entry.role}`}>{entry.role}</span></Link>)}</div>}</div>;
}
