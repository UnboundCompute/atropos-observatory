import './globals.css';
import Link from 'next/link';
import type { Metadata } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans, Source_Serif_4 } from 'next/font/google';

const plexSans = IBM_Plex_Sans({ subsets: ['latin'], variable: '--font-plex-sans', display: 'swap' });
const plexMono = IBM_Plex_Mono({ weight: ['400', '500'], subsets: ['latin'], variable: '--font-plex-mono', display: 'swap' });
const sourceSerif = Source_Serif_4({ subsets: ['latin'], variable: '--font-source-serif', display: 'swap' });

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://atropos.unboundcompute.com').replace(/\/+$/, '');
export const metadata: Metadata = { metadataBase: new URL(siteUrl), title: 'Atropos Observatory — Security Semantics Index', description: 'Search exact source, sink, sanitizer, and summary facts from the Atropos model pack.', alternates: { canonical: '/' }, openGraph: { type: 'website', siteName: 'Atropos Observatory', title: 'Atropos Observatory — Security Semantics Index', description: 'Search exact security semantics from the Atropos model pack.', url: siteUrl }, twitter: { card: 'summary', title: 'Atropos Observatory — Security Semantics Index', description: 'Search exact security semantics from the Atropos model pack.' } };
const structuredData = { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Atropos Observatory', url: siteUrl, description: 'Searchable security semantics index for the Atropos model pack.', potentialAction: { '@type': 'SearchAction', target: `${siteUrl}/search?q={search_term_string}`, 'query-input': 'required name=search_term_string' } };

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body className={`${plexSans.variable} ${plexMono.variable} ${sourceSerif.variable}`}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><a className="skip-link" href="#main-content">Skip to content</a><header className="site-header"><Link href="/" className="wordmark"><span className="monogram">AO</span><span><strong>Atropos</strong><small>Observatory</small></span></Link><nav aria-label="Primary navigation"><Link href="/guide">Security guides</Link><Link href="/browse">Model reference</Link><Link href="/coverage">Coverage</Link><a href="https://trace.unboundcompute.com/">Casefiles</a><a href="https://github.com/UnboundCompute/atropos">Source</a></nav></header><div id="main-content" tabIndex={-1}>{children}</div><footer><span>Atropos Core Models · CC-BY-4.0</span><span>UnboundCompute / Security semantics for static analysis</span></footer></body></html>;
}
