import type { MetadataRoute } from 'next';
import catalog from '../.generated/catalog.json';
import editorial from '../content/editorial.json';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://atropos.unboundcompute.com';
  const languages = [...new Set(catalog.map((entry) => entry.language))].map((value) => ({ url: `${base}/browse/language/${value}`, changeFrequency: 'weekly' as const, priority: 0.5 }));
  const kinds = [...new Set(catalog.map((entry) => entry.kind))].map((value) => ({ url: `${base}/browse/kind/${value}`, changeFrequency: 'weekly' as const, priority: 0.4 }));
  const cwes = [...new Set(catalog.flatMap((entry) => entry.cwe || []))].map((value) => ({ url: `${base}/browse/cwe/${value}`, changeFrequency: 'weekly' as const, priority: 0.4 }));
  const symbols = [...new Set(catalog.map((entry) => entry.slug))].flatMap((slug) => {
    const facts = catalog.filter((entry) => entry.slug === slug);
    if (!facts.some((fact) => editorial[fact.id as keyof typeof editorial])) return [];
    return [{ url: `${base}/symbols/${slug}`, changeFrequency: 'weekly' as const, priority: 0.7 }];
  });
  return [{ url: base, changeFrequency: 'weekly', priority: 1 }, { url: `${base}/browse`, changeFrequency: 'weekly', priority: 0.8 }, { url: `${base}/guide`, changeFrequency: 'monthly', priority: 0.7 }, { url: `${base}/coverage`, changeFrequency: 'weekly', priority: 0.6 }, ...languages, ...kinds, ...cwes, ...symbols];
}
