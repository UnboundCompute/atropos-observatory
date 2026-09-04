import Link from 'next/link';
import catalog from '../../.generated/catalog.json';
import editorial from '../../content/editorial.json';
import { securityGuides } from '../../content/guides';

const reviewedIds = new Set(Object.keys(editorial));
const terms = [
  ['Source', 'Introduces data into the analysis.'],
  ['Sink', 'Consumes data at a security-sensitive boundary.'],
  ['Sanitizer', 'Constrains data under stated conditions; it is not universal proof of safety.'],
  ['Summary', 'Carries or transforms data between access paths.'],
  ['Access path', 'Names the argument, return value, property, or binding the model tracks.'],
  ['Model fact', 'An Atropos classification used as analysis evidence, not an application-specific verdict.'],
];

export const metadata = { title: 'Security guides — Atropos Observatory', description: 'Reviewed guidance for command execution, SQL queries, deserialization, dynamic evaluation, and memory bounds, grounded in Atropos model facts.', alternates: { canonical: '/guide' } };

export default function Guide() {
  const guides = securityGuides.map((guide) => ({ ...guide, entries: catalog.filter((entry) => reviewedIds.has(entry.id) && guide.kinds.includes(entry.kind)) }));
  const categorizedIds = new Set(guides.flatMap((guide) => guide.entries.map((entry) => entry.id)));
  const uncategorizedIds = [...reviewedIds].filter((id) => !categorizedIds.has(id));
  if (uncategorizedIds.length) throw new Error(`Editorial records missing a security guide: ${uncategorizedIds.join(', ')}`);
  return <main><section className="guide-hero"><nav className="crumb" aria-label="Breadcrumb"><Link href="/">Observatory</Link><span>/</span><b>Security guides</b></nav><h1>Read the risk before the record.</h1><p>These guides organize the reviewed layer of Observatory by security question. They explain what the model means, what the calling code still needs to prove, and which exact API records carry the evidence.</p><div className="guide-jump" aria-label="Guide topics">{guides.map((guide) => <a href={`#${guide.slug}`} key={guide.slug}><span>{guide.title}</span><b>{guide.entries.length}</b></a>)}</div></section><section className="guide-manual" aria-label="Security guidance">{guides.map((guide) => <article id={guide.slug} className="guide-topic" key={guide.slug}><header><div><h2>{guide.title}</h2><p>{guide.summary}</p></div><div className="guide-meta"><span>{guide.cwes.join(' · ')}</span><span>{guide.entries.length} reviewed records</span></div></header><div className="guide-topic-body"><div className="guide-reading"><h3>The question to answer</h3><p className="guide-question">{guide.question}</p><h3>What to verify</h3><ol>{guide.checks.map((check) => <li key={check}>{check}</li>)}</ol></div><div className="guide-evidence"><div className="guide-evidence-head"><h3>Reviewed model records</h3><Link href={`/browse?kind=${encodeURIComponent(guide.kinds[0])}&status=reviewed`}>Filter in reference</Link></div><div>{guide.entries.map((entry) => <Link href={`/symbols/${entry.slug}`} key={entry.id}><span><code>{entry.method}</code><small>{entry.language} / {entry.package || 'stdlib'}</small></span><span className={`role role-${entry.role}`}>{entry.role}</span></Link>)}</div></div></div></article>)}</section><section className="guide-foundation"><div><h2>Model vocabulary</h2><dl className="glossary">{terms.map(([term, definition]) => <div key={term}><dt>{term}</dt><dd>{definition}</dd></div>)}</dl></div><div><h2>How to use a record</h2><ol className="guide-steps"><li><div><strong>Locate the boundary.</strong><span>Read role, kind, and access path before drawing a conclusion.</span></div></li><li><div><strong>Check the authority label.</strong><span>Reviewed guidance and raw model facts make different promises.</span></div></li><li><div><strong>Open the evidence.</strong><span>Follow the immutable source link and verify the model ID upstream.</span></div></li><li><div><strong>Validate the call site.</strong><span>Confirm versions, argument constraints, and the actual data flow in your code.</span></div></li></ol><div className="scope-note"><h3>Scope boundary</h3><p>A missing record is not proof that an operation is safe. Atropos describes known API semantics; it does not execute your application or replace code review.</p><Link className="text-link" href="/coverage">Read the coverage statement</Link></div></div></section></main>;
}
