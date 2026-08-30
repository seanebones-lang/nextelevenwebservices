import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { InquiryForm } from '@/components/inquiry-form';
import {
  MarkerArrow,
  MarkerAsterisk,
  MarkerBox,
  MarkerCircle,
  MarkerEleven,
  MarkerScribble,
  MarkerStar,
  MarkerUnderline,
} from '@/components/marker-drawings';

const services = [
  {
    number: '01',
    name: 'Conceive',
    statement: 'Find the clearest version of the business.',
    detail:
      'Customer discovery, competitive context, positioning, goals, and the plan for turning attention into action.',
  },
  {
    number: '02',
    name: 'Create',
    statement: 'Give the value a voice and a visual system.',
    detail:
      'Site architecture, persuasive copy, art direction, interface design, and calls to action that feel natural.',
  },
  {
    number: '03',
    name: 'Build',
    statement: 'Engineer it to be fast, useful, and durable.',
    detail:
      'Custom commerce, virtual assistants, inventory-aware experiences, integrations, responsive engineering, analytics, and launch preparation.',
  },
  {
    number: '04',
    name: 'Operate',
    statement: 'Keep it useful after the launch.',
    detail:
      'Managed hosting, monitoring, customer communication, email routing, human handoff, updates, and measured improvement over time.',
  },
];

const engagements = [
  {
    number: 'A',
    name: 'Discovery',
    description:
      'Define the opportunity before prescribing the build: audience, business model, customer journey, technical needs, risks, and the clearest path forward.',
    includes:
      'Research · Positioning · Requirements · Architecture · Build recommendation',
    investment: 'From $500',
    mark: 'box' as const,
  },
  {
    number: 'B',
    name: 'Solid Foundation',
    description:
      'Create the premium digital foundation the business can confidently grow from—distinctive, fast, maintainable, and built around its real customer journey.',
    includes:
      'Strategy · Messaging · Design system · Core build · Analytics · Launch',
    investment: 'From $2,500 · typically $2,500–$7,500',
    mark: 'star' as const,
  },
  {
    number: 'C',
    name: 'Full Vertical Build',
    description:
      'Build the complete custom environment around the business—from public presence and product sales to intelligent assistance and private operating workflows.',
    includes:
      'Commerce · Inventory · Virtual assistants · Email routing · Human handoff · Automation',
    investment: 'Custom scope · from $7,500',
    mark: 'asterisk' as const,
  },
];

const packageDetails = [
  {
    number: 'A',
    name: 'Discovery',
    price: 'From $500',
    timing: '5–10 business days after kickoff',
    deliverable:
      'A written scope memo with audience and journey findings, recommended sitemap, technical requirements, build recommendation, and an estimate for Foundation or Full Vertical.',
    clientInputs:
      'Your current site, relevant competitors, available brand assets, business priorities, and the person who handles customer inquiries.',
    boundaries:
      'This is paid decision-making work—not a free sales call and not a finished website. The Discovery fee is credited to a Foundation or Full Vertical build started within 30 days.',
  },
  {
    number: 'B',
    name: 'Solid Foundation',
    price: 'Typically $2,500–$7,500',
    timing: 'Usually 3–6 weeks from cleared deposit to launch',
    deliverable:
      'A custom, responsive presence of approximately 5–12 core pages with strategy, information architecture, a design system, edited or newly written copy as scoped, mobile QA, analytics, basic technical SEO, and a tested inquiry path.',
    clientInputs:
      'Timely access to brand materials, factual business information, existing accounts, and one decision-maker for checkpoint approvals.',
    boundaries:
      'Two consolidated design/content revision rounds are included. A simple editor may be included when useful; otherwise NextEleven handles changes. Custom commerce, inventory sync, virtual assistants, and multi-location operations are scoped as Full Vertical work.',
  },
  {
    number: 'C',
    name: 'Full Vertical Build',
    price: 'Custom scope · from $7,500',
    timing: 'Discovery or a paid scoping week comes first',
    deliverable:
      'A purpose-built operating environment assembled from the modules the business actually needs. For example: a shop site, product catalog, booking flow, after-hours assistant, inventory connection, and inbox routing with human handoff.',
    clientInputs:
      'Access to the systems being connected, operating rules, product or service data, escalation owners, and a decision-maker empowered to approve workflows.',
    boundaries:
      'Commerce, inventory, assistants, email routing, human handoff, and automation are common modules—not assumed inclusions. Scope, integrations, acceptance criteria, runtime, and calendar are defined in writing before the build begins.',
  },
];

const terms = [
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

export default function Home() {
  return (
    <main>
      <header className="site-shell studio-header">
        <a
          className="flex items-center gap-3"
          href="#top"
          aria-label="NextEleven home"
        >
          <MarkerEleven className="marker-ink size-8 shrink-0" />
          <span className="wordmark">
            NEXT
            <br />
            ELEVEN
          </span>
        </a>
        <nav
          className="hidden items-center gap-8 text-sm md:flex"
          aria-label="Primary navigation"
        >
          <a className="nav-link" href="#approach">
            Approach
          </a>
          <a className="nav-link" href="#services">
            Services
          </a>
          <a className="nav-link" href="#details">
            What you get
          </a>
        </nav>
        <a href="#contact" className="header-contact">
          Start a project <ArrowUpRight />
        </a>
      </header>

      <section id="top" className="site-shell editorial-hero">
        <div className="hero-kicker">
          <span>Premium web systems studio</span>
          <span>Discovery → Full vertical</span>
        </div>
        <h1 className="editorial-title">
          <span>We build</span>
          <span className="hero-presence">
            presence
            <MarkerUnderline className="marker-accent hero-underline" />
          </span>
          <span>that works.</span>
        </h1>
        <div className="hero-brief">
          <p>
            NextEleven designs and engineers premium custom web
            environments—from a solid public foundation to full vertical systems
            that sell, assist, integrate, and operate.
          </p>
          <a href="#contact">
            Tell us what needs to change <ArrowDownRight />
          </a>
        </div>
        <div className="hero-index" aria-hidden="true">
          <MarkerCircle className="marker-accent hero-index-ring" />
          <span>N°11</span>
        </div>
        <MarkerScribble className="marker-ink hero-scribble" />
      </section>

      <section id="approach" className="site-shell editorial-statement">
        <div className="section-marker">
          <span>00</span>
          <span>The premise</span>
        </div>
        <div>
          <p className="statement-lead">
            Start with what the business actually needs.
          </p>
          <p className="statement-main">
            Discover the opportunity.{' '}
            <span className="marked-phrase">
              Establish the foundation.
              <MarkerUnderline className="marker-accent phrase-underline" />
            </span>{' '}
            Build the full vertical when it earns the right to exist.
          </p>
          <p className="statement-note">
            We do not begin with a template or a predetermined stack. We learn
            the business, map the customer journey, define the operating
            requirements, and engineer the right environment around them.
          </p>
        </div>
      </section>

      <section id="services" className="service-section">
        <div className="site-shell">
          <div className="section-intro">
            <div className="section-marker">
              <span>01</span>
              <span>The work</span>
            </div>
            <h2>
              Cutting edge.
              <br />
              Built on bedrock.
            </h2>
            <p>
              Advanced capability only creates value when the fundamentals are
              right. Strategy, experience, engineering, security, and operation
              remain one connected responsibility.
            </p>
          </div>
          <div className="service-ledger">
            {services.map((service) => (
              <article key={service.name} className="service-row">
                <span>{service.number}</span>
                <h3>{service.name}</h3>
                <p className="service-statement">{service.statement}</p>
                <p className="service-detail">{service.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="method-strip"
        aria-label="The complete NextEleven process"
      >
        <div className="method-track">
          <span>Conceive</span>
          <MarkerArrow className="marker-accent method-arrow" />
          <span>Create</span>
          <MarkerArrow className="marker-accent method-arrow" />
          <span>Build</span>
          <MarkerArrow className="marker-accent method-arrow" />
          <span>Operate</span>
        </div>
      </section>

      <section className="engagement-section">
        <div className="site-shell">
          <div className="section-intro compact">
            <div className="section-marker">
              <span>02</span>
              <span>The engagement</span>
            </div>
            <h2>Real numbers before the form.</h2>
            <p>
              You should not have to qualify for a sales call just to learn
              whether the investment is workable. These are honest starting
              points; discovery confirms the final scope before build work
              begins.
            </p>
          </div>
          <div className="engagement-list">
            {engagements.map((engagement) => (
              <article key={engagement.name} className="engagement-row">
                <span className="engagement-mark">
                  {engagement.mark === 'star' ? (
                    <MarkerStar className="marker-accent size-7" />
                  ) : engagement.mark === 'asterisk' ? (
                    <MarkerAsterisk className="marker-ink size-6" />
                  ) : (
                    <MarkerBox className="marker-ink size-7" />
                  )}
                  {engagement.number}
                </span>
                <h3>{engagement.name}</h3>
                <p>{engagement.description}</p>
                <small>
                  <strong>{engagement.investment}</strong>
                  {engagement.includes}
                </small>
              </article>
            ))}
          </div>
          <div className="payment-terms">
            <span>Standard build schedule</span>
            <p>
              <strong>30% deposit</strong> to reserve and begin ·{' '}
              <strong>40% milestone</strong> after the agreed build checkpoint ·{' '}
              <strong>30% completion</strong> after final acceptance
            </p>
          </div>
          <div className="payment-terms ownership-terms">
            <span>Ownership and hosting</span>
            <p>
              <strong>
                After the final payment, the client owns the project source
                code.
              </strong>{' '}
              Pay the hosting provider directly or have NextEleven manage it on
              your behalf. Either way, the source can move to another suitable
              provider at any time—no artificial lock-in. Provider charges are
              separate from NextEleven service fees and approved before they are
              incurred.
            </p>
          </div>
        </div>
      </section>

      <section id="details" className="definition-section">
        <div className="site-shell">
          <div className="section-intro compact definition-intro">
            <div className="section-marker">
              <span>03</span>
              <span>Definition of done</span>
            </div>
            <h2>Know what the engagement produces.</h2>
            <p>
              Every engagement has a written deliverable, a working calendar,
              clear client inputs, and an explicit boundary. The accepted
              proposal is the final source of truth for scope.
            </p>
          </div>
          <div className="package-details">
            {packageDetails.map((item) => (
              <article key={item.name} className="package-card">
                <header>
                  <span>{item.number}</span>
                  <div>
                    <h3>{item.name}</h3>
                    <strong>{item.price}</strong>
                  </div>
                </header>
                <dl>
                  <div>
                    <dt>Typical calendar</dt>
                    <dd>{item.timing}</dd>
                  </div>
                  <div>
                    <dt>What you receive</dt>
                    <dd>{item.deliverable}</dd>
                  </div>
                  <div>
                    <dt>What we need from you</dt>
                    <dd>{item.clientInputs}</dd>
                  </div>
                  <div>
                    <dt>Boundaries</dt>
                    <dd>{item.boundaries}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
          <div className="launch-standard">
            <span>Foundation launch standard</span>
            <p>
              Before launch: domain and DNS are prepared, redirects are mapped
              when relevant, forms are tested, analytics is live, mobile and
              accessibility checks are completed, and the approved production
              route is verified. Foundation and Full Vertical builds include 30
              days of post-launch defect support.
            </p>
          </div>
        </div>
      </section>

      <section className="operate-section">
        <div className="site-shell operate-layout">
          <div className="section-marker">
            <span>04</span>
            <span>After launch</span>
          </div>
          <div>
            <p className="operate-kicker">Operate · from $150/month</p>
            <h2>Keep one accountable partner.</h2>
            <p>
              After the included 30-day launch window, ongoing care is optional.
              A standard retainer can cover managed releases, uptime and form
              monitoring, routine dependency updates, small content changes, and
              a monthly health check. Higher-touch support, workflow operation,
              or continuous improvement is scoped around the actual system.
            </p>
            <small>
              Hosting and third-party provider bills remain separate. The client
              keeps the keys and can end managed service under the agreed notice
              period without surrendering the work.
            </small>
          </div>
        </div>
      </section>

      <section className="fit-section">
        <div className="site-shell fit-grid">
          <div>
            <div className="section-marker">
              <span>05</span>
              <span>Fit</span>
            </div>
            <h2>Built for businesses with real work behind them.</h2>
          </div>
          <div className="fit-copy">
            <p>
              NextEleven is a strong fit for automotive and skilled trades,
              professional services, industrial and B2B companies, retail and
              hospitality, and health or wellness businesses that need a clearer
              public presence or a connected operating environment.
            </p>
            <p>
              We are not the right shop for a template reskin, a standalone $300
              logo, or a request to “just make it pretty” without addressing the
              business problem.
            </p>
            <div className="proof-note">
              <strong>Proof should match the problem.</strong>
              <span>
                Relevant client work is shared privately when permission and fit
                allow. We do not substitute unrelated mobile-app credentials for
                web-presence proof or publish a client result without consent.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="terms-section">
        <div className="site-shell">
          <div className="section-intro compact terms-intro">
            <div className="section-marker">
              <span>06</span>
              <span>Working terms</span>
            </div>
            <h2>No surprises in the handoff.</h2>
            <p>
              These are the standard commercial principles. The signed proposal
              records the exact scope, acceptance points, support period, and
              any project-specific exceptions.
            </p>
          </div>
          <div className="terms-grid">
            {terms.map((term) => (
              <article key={term.title}>
                <h3>{term.title}</h3>
                <p>{term.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="counterparty-section">
        <div className="site-shell counterparty-grid">
          <div className="section-marker">
            <span>07</span>
            <span>Who you hire</span>
          </div>
          <div>
            <h2>NextEleven LLC</h2>
            <p>
              DFW, Texas · You work directly with Sean, the principal
              responsible for discovery, design direction, engineering, and
              delivery.
            </p>
            <p>
              Written reply within two business days. Prefer email? Reach
              NextEleven at{' '}
              <a href="mailto:nextelevenstudios@gmail.com">
                nextelevenstudios@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="site-shell contact-layout">
          <div className="contact-intro">
            <div className="section-marker">
              <span>08</span>
              <span>The conversation</span>
            </div>
            <h2>
              Tell us what
              <span className="contact-need">
                needs
                <MarkerUnderline className="marker-accent phrase-underline" />
              </span>
              to work.
            </h2>
            <p>
              The numbers are already above. This short form gives us enough
              context to respond intelligently—not another hoop between you and
              a price.
            </p>
            <div className="response-note">
              <MarkerEleven className="marker-paper size-9" />
              <p>
                Written reply within two business days.
                <br />
                No generic sales script.
              </p>
            </div>
          </div>
          <InquiryForm />
        </div>
      </section>

      <footer className="site-shell studio-footer">
        <span className="wordmark-lockup">
          <MarkerEleven className="marker-ink size-8" />
          <span className="wordmark">
            NEXT
            <br />
            ELEVEN
          </span>
        </span>
        <p>
          NextEleven LLC · DFW, Texas ·{' '}
          <a href="mailto:nextelevenstudios@gmail.com">
            nextelevenstudios@gmail.com
          </a>
        </p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
