import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { InquiryForm } from '@/components/inquiry-form';

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
    investment: '$2,500 fixed',
  },
  {
    number: 'B',
    name: 'Solid Foundation',
    description:
      'Create the premium digital foundation the business can confidently grow from—distinctive, fast, maintainable, and built around its real customer journey.',
    includes:
      'Strategy · Messaging · Design system · Core build · Analytics · Launch',
    investment: 'From $7,500',
  },
  {
    number: 'C',
    name: 'Full Vertical Build',
    description:
      'Build the complete custom environment around the business—from public presence and product sales to intelligent assistance and private operating workflows.',
    includes:
      'Commerce · Inventory · Virtual assistants · Email routing · Human handoff · Automation',
    investment: 'From $20,000',
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
          <span>presence</span>
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
          N°11
        </div>
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
            Discover the opportunity. Establish the foundation. Build the full
            vertical when it earns the right to exist.
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
          <i>→</i>
          <span>Create</span>
          <i>→</i>
          <span>Build</span>
          <i>→</i>
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
                <span>{engagement.number}</span>
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
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="site-shell contact-layout">
          <div className="contact-intro">
            <div className="section-marker">
              <span>03</span>
              <span>The conversation</span>
            </div>
            <h2>Tell us what needs to work.</h2>
            <p>
              The numbers are already above. This short form gives us enough
              context to respond intelligently—not another hoop between you and
              a price.
            </p>
            <div className="response-note">
              <span>11</span>
              <p>
                Thoughtful response from NextEleven.
                <br />
                No generic sales script.
              </p>
            </div>
          </div>
          <InquiryForm />
        </div>
      </section>

      <footer className="site-shell studio-footer">
        <span className="wordmark">
          NEXT
          <br />
          ELEVEN
        </span>
        <p>Complete web presence for established businesses.</p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
