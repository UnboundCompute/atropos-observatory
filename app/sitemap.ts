import type { MetadataRoute } from 'next';
import catalog from '../.generated/catalog.json';
import editorial from '../content/editorial.json';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://atropos.unboundcompute.com';
  const symbols = [...new Set(catalog.map((entry) => entry.slug))].flatMap((slug) => {
    const facts = catalog.filter((entry) => entry.slug === slug);
    if (!facts.some((fact) => editorial[fact.id as keyof typeof editorial])) return [];
    return [{ url: `${base}/symbols/${slug}`, changeFrequency: 'weekly' as const, priority: 0.7 }];
  });
  return [{ url: base, changeFrequency: 'weekly', priority: 1 }, { url: `${base}/browse`, changeFrequency: 'weekly', priority: 0.8 }, ...symbols];
}
