export type ServiceStage = {
  number: string;
  name: string;
  statement: string;
  detail: string;
  signal: string;
};

export type Engagement = {
  id: 'discovery' | 'foundation' | 'vertical';
  number: 'A' | 'B' | 'C';
  name: string;
  description: string;
  includes: string[];
  investment: string;
  timing: string;
  deliverable: string;
  clientInputs: string;
  boundaries: string;
};

export type CommercialTerm = {
  title: string;
  body: string;
};

export const services: ServiceStage[] = [
  {
    number: '01',
    name: 'Conceive',
    statement: 'Find the clearest version of the business.',
    detail:
      'Customer discovery, competitive context, positioning, goals, and the plan for turning attention into action.',
    signal: 'Opportunity mapped',
  },
  {
    number: '02',
    name: 'Create',
    statement: 'Give the value a voice and a visual system.',
    detail:
      'Site architecture, persuasive copy, art direction, interface design, and calls to action that feel natural.',
    signal: 'System defined',
  },
  {
    number: '03',
    name: 'Build',
    statement: 'Engineer it to be fast, useful, and durable.',
    detail:
      'Custom commerce, virtual assistants, inventory-aware experiences, integrations, responsive engineering, analytics, and launch preparation.',
    signal: 'Environment online',
  },
  {
    number: '04',
    name: 'Operate',
    statement: 'Keep it useful after the launch.',
    detail:
      'Managed hosting, monitoring, customer communication, email routing, human handoff, updates, and measured improvement over time.',
    signal: 'Presence maintained',
  },
];

export const engagements: Engagement[] = [
  {
    id: 'discovery',
    number: 'A',
    name: 'Discovery',
    description:
      'Define the opportunity before prescribing the build: audience, business model, customer journey, technical needs, risks, and the clearest path forward.',
    includes: [
      'Research',
      'Positioning',
      'Requirements',
      'Architecture',
      'Build recommendation',
    ],
    investment: 'From $500',
    timing: '5–10 business days after kickoff',
    deliverable:
      'A written scope memo with audience and journey findings, recommended sitemap, technical requirements, build recommendation, and an estimate for Foundation or Full Vertical.',
    clientInputs:
      'Your current site, relevant competitors, available brand assets, business priorities, and the person who handles customer inquiries.',
    boundaries:
      'This is paid decision-making work—not a free sales call and not a finished website. The Discovery fee is credited to a Foundation or Full Vertical build started within 30 days.',
  },
  {
    id: 'foundation',
    number: 'B',
    name: 'Solid Foundation',
    description:
      'Create the premium digital foundation the business can confidently grow from—distinctive, fast, maintainable, and built around its real customer journey.',
    includes: [
      'Strategy',
      'Messaging',
      'Design system',
      'Core build',
      'Analytics',
      'Launch',
    ],
    investment: 'From $2,500 · typically $2,500–$7,500',
    timing: 'Usually 3–6 weeks from cleared deposit to launch',
    deliverable:
      'A custom, responsive presence of approximately 5–12 core pages with strategy, information architecture, a design system, edited or newly written copy as scoped, mobile QA, analytics, basic technical SEO, and a tested inquiry path.',
    clientInputs:
      'Timely access to brand materials, factual business information, existing accounts, and one decision-maker for checkpoint approvals.',
    boundaries:
      'Two consolidated design/content revision rounds are included. A simple editor may be included when useful; otherwise NextEleven handles changes. Custom commerce, inventory sync, virtual assistants, and multi-location operations are scoped as Full Vertical work.',
  },
  {
    id: 'vertical',
    number: 'C',
    name: 'Full Vertical Build',
    description:
      'Build the complete custom environment around the business—from public presence and product sales to intelligent assistance and private operating workflows.',
    includes: [
      'Commerce',
      'Inventory',
      'Virtual assistants',
      'Email routing',
      'Human handoff',
      'Automation',
    ],
    investment: 'Custom scope · from $7,500',
    timing: 'Discovery or a paid scoping week comes first',
    deliverable:
      'A purpose-built operating environment assembled from the modules the business actually needs. For example: a shop site, product catalog, booking flow, after-hours assistant, inventory connection, and inbox routing with human handoff.',
    clientInputs:
      'Access to the systems being connected, operating rules, product or service data, escalation owners, and a decision-maker empowered to approve workflows.',
    boundaries:
      'Commerce, inventory, assistants, email routing, human handoff, and automation are common modules—not assumed inclusions. Scope, integrations, acceptance criteria, runtime, and calendar are defined in writing before the build begins.',
  },
];

export const terms: CommercialTerm[] = [
  {
    title: 'Payment and start',
    body: 'NextEleven invoices by card or ACH. The project calendar begins when the deposit clears and required kickoff material is available. Applicable taxes, if any, are itemized rather than hidden in the fee.',
  },
  {
    title: 'Scope changes',
    body: 'Work outside the accepted scope is described and priced in a written change order before it begins. No surprise work and no surprise invoice.',
  },
  {
    title: 'If a project stops',
    body: 'The deposit reserves capacity and covers work begun. If the client cancels, completed work and committed third-party costs are reconciled through the stop date; no unperformed milestone is silently charged.',
  },
  {
    title: 'Files and accounts',
    body: 'After final payment, the client owns the project source code and final project-specific design files. The client owns the domain, analytics, email, commerce, and cloud accounts; NextEleven receives only the access needed to do the work.',
  },
  {
    title: 'Hosting and portability',
    body: 'The client may pay providers directly or ask NextEleven to manage them. Provider charges remain separate and pre-approved. The source and client-owned accounts can move to another suitable provider at any time.',
  },
  {
    title: 'DFW and remote work',
    body: 'Remote delivery is standard. On-site work in DFW or travel elsewhere is included only when written into the scope; otherwise travel is quoted separately before it is booked.',
  },
];
