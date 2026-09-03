import './globals.css';
import Link from 'next/link';

export const metadata = { title: 'Atropos Observatory — security semantics, made legible', description: 'A searchable reference for security-relevant API semantics from Atropos.' };

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><header className="site-header"><Link href="/" className="wordmark"><span className="mark">A</span><span>Atropos <em>Observatory</em></span></Link><nav><a href="https://unboundcompute.com/">UnboundCompute</a><a href="https://security.unboundcompute.com/">Security blog</a><a href="https://trace.unboundcompute.com/">Casefiles</a><a href="https://lachesis.unboundcompute.com/">Explorer</a><a href="https://github.com/UnboundCompute/atropos">GitHub ↗</a></nav></header>{children}<footer><span>Atropos Core Models · CC-BY-4.0</span><span>Built for exact, inspectable security work.</span></footer></body></html>;
}
