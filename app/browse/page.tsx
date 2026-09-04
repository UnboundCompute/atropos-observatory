import Link from 'next/link';
import FacetExplorer from '../../components/FacetExplorer';
import catalog from '../../.generated/catalog.json';

export default function Browse() {
  const roles = [...new Set(catalog.map((entry) => entry.role))];
  const languages = [...new Set(catalog.map((entry) => entry.language))];
  return <main><section className="catalog-intro"><h1>Browse the model register.</h1><p>{catalog.length.toLocaleString()} model facts across {languages.join(', ')}. Combine filters when a role index is too broad, then open a symbol for its complete provenance.</p></section><FacetExplorer /><section className="role-directory">{roles.map((role) => <Link href={`/browse/${role}`} key={role}><span className={`role role-${role}`}>{role}</span><strong>{catalog.filter((entry) => entry.role === role).length.toLocaleString()}</strong><p>{role === 'sink' ? 'Consumes data at a sensitive operation.' : role === 'source' ? 'Introduces data into the analysis.' : role === 'sanitizer' ? 'Transforms data under stated constraints.' : 'Carries or transforms data between access paths.'}</p><span className="open-label">Open register</span></Link>)}</section><section className="taxonomy"><div><h2>Language index</h2><div className="taxonomy-links">{languages.map((language) => <Link href={`/browse/language/${language}`} key={language}><span>{language}</span><b>{catalog.filter((entry) => entry.language === language).length.toLocaleString()}</b></Link>)}</div></div><div><h2>Weakness index</h2><p className="taxonomy-note">CWE landing pages are generated from the same model facts and keep source IDs visible.</p><Link className="text-link" href="/browse/cwe/CWE-78">Open CWE-78 example</Link></div></section></main>;
}
