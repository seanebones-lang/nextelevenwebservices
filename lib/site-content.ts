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
    signal: 'Launch path prepared',
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
    investment: 'Price confirmed in writing',
    timing: 'Set after kickoff inputs and access are confirmed',
    deliverable:
      'A written scope memo with audience and journey findings, recommended sitemap, technical requirements, build recommendation, and an estimate for a Foundation or Connected Build.',
    clientInputs:
      'Your current site, relevant competitors, available brand assets, business priorities, and the person who handles customer inquiries.',
    boundaries:
      'This is paid planning work, not a finished website. Any credit toward a later build is stated in the written proposal.',
  },
  {
    id: 'foundation',
    number: 'B',
    name: 'Solid Foundation',
    description:
      'Create a distinctive, fast, maintainable public foundation built around the business’s real customer journey.',
    includes: [
      'Strategy',
      'Messaging',
      'Design system',
      'Core build',
      'Analytics',
      'Launch',
    ],
    investment: 'Price confirmed after scope',
    timing: 'Set after scope, access, content, and approvals are known',
    deliverable:
      'A custom responsive website with the pages, strategy, information architecture, design system, copy support, mobile review, accessibility review, technical SEO, analytics, and inquiry-path testing expressly included in the proposal.',
    clientInputs:
      'Timely access to brand materials, factual business information, existing accounts, and one decision-maker for checkpoint approvals.',
    boundaries:
      'The proposal states the included review rounds, editing model, integrations, and launch responsibilities. Commerce, inventory synchronization, assistants, and multi-location workflows are separate modules unless expressly included.',
  },
  {
    id: 'vertical',
    number: 'C',
    name: 'Connected Build',
    description:
      'Connect the public presence to the specific commerce, inventory, assistance, communication, or internal-workflow modules the operation requires.',
    includes: [
      'Commerce',
      'Inventory',
      'Virtual assistants',
      'Email routing',
      'Human handoff',
      'Automation',
    ],
    investment: 'Quoted after discovery',
    timing: 'Discovery or a paid scoping week comes first',
    deliverable:
      'A purpose-built environment assembled from the modules the business actually needs—for example, a public site, product catalog, booking flow, inventory connection, guided assistant, client portal, or inquiry-routing workflow.',
    clientInputs:
      'Access to the systems being connected, operating rules, product or service data, escalation owners, and a decision-maker empowered to approve workflows.',
    boundaries:
      'No module is assumed. Integrations, data handling, security responsibilities, runtime, calendar, acceptance, and operating ownership are defined in writing before implementation begins.',
  },
];

export const terms: CommercialTerm[] = [
  {
    title: 'Payment and start',
    body: 'The signed proposal states the accepted payment method, deposit, milestone schedule, and conditions for starting work. The project calendar begins after the required payment and kickoff materials are received.',
  },
  {
    title: 'Scope changes',
    body: 'Work outside the accepted scope begins only after a written change order describing the impact on deliverables, fees, and schedule is approved.',
  },
  {
    title: 'If a project stops',
    body: 'Fees at cancellation are determined under the signed agreement, based on completed work, reserved capacity, and approved third-party commitments.',
  },
  {
    title: 'Files and accounts',
    body: 'The signed proposal identifies the deliverables that transfer after final payment. Pre-existing tools, open-source software, fonts, stock assets, hosted services, and other third-party materials remain subject to their existing licenses and terms.',
  },
  {
    title: 'Hosting and portability',
    body: 'The client may pay providers directly or authorize NextEleven to manage specified services. Provider charges remain separate. Portability depends on the selected platform, provider terms, licenses, and written scope.',
  },
  {
    title: 'DFW and remote work',
    body: 'Remote delivery is standard. On-site work in DFW or travel elsewhere is included only when written into the scope; otherwise travel is quoted separately before it is booked.',
  },
];
