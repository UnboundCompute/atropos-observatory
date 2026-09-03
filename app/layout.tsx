import './globals.css';
import Link from 'next/link';

export const metadata = { title: 'Atropos Observatory — Security Semantics Index', description: 'Search exact source, sink, sanitizer, and summary facts from the Atropos model pack.' };

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><header className="site-header"><Link href="/" className="wordmark"><span className="monogram">AO</span><span><strong>Atropos</strong><small>Observatory</small></span></Link><nav aria-label="UnboundCompute network"><Link href="/browse">Index</Link><a href="https://trace.unboundcompute.com/">Casefiles</a><a href="https://security.unboundcompute.com/">Journal</a><a href="https://lachesis.unboundcompute.com/">Explorer</a><a href="https://github.com/UnboundCompute/atropos">Source</a></nav></header>{children}<footer><span>Atropos Core Models · CC-BY-4.0</span><span>UnboundCompute / Security semantics for static analysis</span></footer></body></html>;
}
