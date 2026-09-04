import Link from 'next/link';

export default function SymbolNotFound() {
  return <main><section className="catalog-intro"><p className="edition">404 / model register</p><h1>No matching symbol.</h1><p>The requested route is not present in the current Atropos model pack. Try a broader search or return to the register.</p><Link className="text-link" href="/browse">Return to index</Link></section></main>;
}
