import SearchResults from '../../components/SearchResults';

export const metadata = { title: 'Search model records — Atropos Observatory', description: 'Search Atropos model IDs, methods, packages, roles, behaviors, and access paths.', alternates: { canonical: '/search' } };

export default function SearchPage() { return <main><SearchResults /></main>; }
