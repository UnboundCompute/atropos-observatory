import Link from 'next/link';
import catalog from '../../.generated/catalog.json';

export default function Browse() {
  const roles = [...new Set(catalog.map((entry) => entry.role))];
  const languages = [...new Set(catalog.map((entry) => entry.language))];
  return <main><section className="catalog-intro"><h1>Browse by semantic role.</h1><p>{catalog.length.toLocaleString()} model facts across {languages.join(', ')}. A role describes how data enters, moves through, or reaches a security boundary.</p></section><section className="role-directory">{roles.map((role) => <Link href={`/browse/${role}`} key={role}><span className={`role role-${role}`}>{role}</span><strong>{catalog.filter((entry) => entry.role === role).length.toLocaleString()}</strong><p>{role === 'sink' ? 'Consumes data at a sensitive operation.' : role === 'source' ? 'Introduces data into the analysis.' : role === 'sanitizer' ? 'Transforms data under stated constraints.' : 'Carries or transforms data between access paths.'}</p><span className="open-label">Open register</span></Link>)}</section></main>;
}
