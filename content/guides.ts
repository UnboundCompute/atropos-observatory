export type SecurityGuide = {
  slug: string;
  title: string;
  summary: string;
  cwes: string[];
  kinds: string[];
  question: string;
  checks: string[];
};

export const securityGuides: SecurityGuide[] = [
  {
    slug: 'command-execution',
    title: 'Command execution',
    summary: 'Keep untrusted values out of shell grammar and process selection.',
    cwes: ['CWE-78'],
    kinds: ['command-injection'],
    question: 'Can any value change the executable, argument boundaries, or shell syntax?',
    checks: ['Prefer a fixed executable with an argument array.', 'Keep shell mode disabled unless shell syntax is the explicit requirement.', 'Constrain executable selection and validate each argument for its domain.'],
  },
  {
    slug: 'sql-queries',
    title: 'SQL queries',
    summary: 'Keep query structure fixed and bind changing values as data.',
    cwes: ['CWE-89'],
    kinds: ['sql-injection'],
    question: 'Does caller-controlled text become part of the statement grammar?',
    checks: ['Use the driver’s parameterized or prepared-statement interface.', 'Do not build identifiers or clauses from unchecked input.', 'Review raw-query escape hatches separately from ordinary query APIs.'],
  },
  {
    slug: 'deserialization',
    title: 'Deserialization',
    summary: 'Treat formats that can construct objects or invoke code as executable boundaries.',
    cwes: ['CWE-502'],
    kinds: ['deserialization'],
    question: 'Can this loader construct more than plain data from the supplied bytes?',
    checks: ['Prefer a data-only format at trust boundaries.', 'Select a safe loader or restricted schema explicitly.', 'Bound document size and complexity before parsing.'],
  },
  {
    slug: 'dynamic-evaluation',
    title: 'Dynamic evaluation',
    summary: 'Keep source code and user-controlled data in different channels.',
    cwes: ['CWE-94', 'CWE-95'],
    kinds: ['code-injection'],
    question: 'Can input cross from data into the host language’s executable grammar?',
    checks: ['Replace evaluation with a parser for the intended data shape.', 'Expose an allow-listed operation set for dynamic behavior.', 'Bound size and nesting even when the accepted grammar is limited.'],
  },
  {
    slug: 'memory-bounds',
    title: 'Memory bounds',
    summary: 'Carry destination capacity with every copy, write, and formatted output.',
    cwes: ['CWE-120', 'CWE-787'],
    kinds: ['buffer-write', 'buffer-size'],
    question: 'Is the write length proven to fit the destination, including termination?',
    checks: ['Check the destination capacity before the operation.', 'Use length-aware APIs and handle truncation as an error.', 'Keep termination and integer-overflow behavior explicit.'],
  },
];
