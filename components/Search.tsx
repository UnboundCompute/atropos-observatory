'use client';

import Link from 'next/link';
import { useEffect, useId, useState } from 'react';

type Item = { id: string; language: string; package?: string; type?: string; method: string; role: string; kind: string; slug: string };

export default function Search() {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState(false);
  const listId = useId();

  useEffect(() => {
    fetch('/generated/search-index.json')
      .then((response) => {
        if (!response.ok) throw new Error(`Search index returned ${response.status}`);
        return response.json();
      })
      .then(setItems)
      .catch(() => setError(true));
  }, []);

  const results = query.trim().length > 1
    ? items.filter((entry) => `${entry.method} ${entry.package || ''} ${entry.language} ${entry.role} ${entry.kind}`.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : [];

  return <div className="search-wrap"><label htmlFor="catalog-search">Search the model pack</label><div className="search-box"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg><input id="catalog-search" role="combobox" aria-expanded={results.length > 0} aria-controls={listId} aria-autocomplete="list" autoComplete="off" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try child_process.exec, pickle.load, memcpy…" /></div>{error && <p className="search-error" role="status">The local search index could not be loaded. Browse the catalog instead.</p>}{results.length > 0 && <div className="search-results" id={listId} role="listbox">{results.map((entry) => <Link href={`/symbols/${entry.slug}`} role="option" aria-selected="false" key={entry.id}><b>{entry.method}</b><small>{entry.language} · {entry.package || 'stdlib'}</small><span className={`role role-${entry.role}`}>{entry.role}</span></Link>)}</div>}</div>;
}
