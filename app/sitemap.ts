import type { MetadataRoute } from 'next';
import catalog from '../.generated/catalog.json';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://atropos.unboundcompute.com').replace(/\/+$/, '');
  const languages = [...new Set(catalog.map((entry) => entry.language))].map((value) => ({ url: `${base}/browse/language/${value}`, changeFrequency: 'weekly' as const, priority: 0.5 }));
  const roles = [...new Set(catalog.map((entry) => entry.role))].map((value) => ({ url: `${base}/browse/${value}`, changeFrequency: 'weekly' as const, priority: 0.6 }));
  const kinds = [...new Set(catalog.map((entry) => entry.kind))].map((value) => ({ url: `${base}/browse/kind/${value}`, changeFrequency: 'weekly' as const, priority: 0.4 }));
  const cwes = [...new Set(catalog.flatMap((entry) => entry.cwe || []))].map((value) => ({ url: `${base}/browse/cwe/${value}`, changeFrequency: 'weekly' as const, priority: 0.4 }));
  const symbols = [...new Set(catalog.map((entry) => entry.slug))].map((slug) => ({ url: `${base}/symbols/${slug}`, changeFrequency: 'weekly' as const, priority: 0.7 }));
  return [{ url: base, changeFrequency: 'weekly', priority: 1 }, { url: `${base}/browse`, changeFrequency: 'weekly', priority: 0.8 }, { url: `${base}/search`, changeFrequency: 'weekly', priority: 0.6 }, { url: `${base}/guide`, changeFrequency: 'monthly', priority: 0.7 }, { url: `${base}/coverage`, changeFrequency: 'weekly', priority: 0.6 }, ...roles, ...languages, ...kinds, ...cwes, ...symbols];
}
