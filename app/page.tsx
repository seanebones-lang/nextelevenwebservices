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
      'Responsive development, accessible interactions, search foundations, analytics, forms, and launch preparation.',
  },
  {
    number: '04',
    name: 'Operate',
    statement: 'Keep it healthy after the applause.',
    detail:
      'Managed hosting, monitoring, security, updates, content changes, and measured improvement over time.',
  },
];

const engagements = [
  {
    number: 'A',
    name: 'Presence Blueprint',
    description:
      'Clarify the audience, story, priorities, pages, and launch path before committing to a full build.',
    includes: 'Discovery · Positioning · Content plan · Recommended scope',
  },
  {
    number: 'B',
    name: 'Presence Launch',
    description:
      'Turn the strategy into a polished, responsive, launch-ready presence built around the business.',
    includes: 'Messaging · Design · Development · QA · Hosting · Launch',
  },
  {
    number: 'C',
    name: 'Presence Care',
    description:
      'Protect the investment and keep the site useful with one partner responsible for its health.',
    includes: 'Managed hosting · Monitoring · Updates · Content · Improvement',
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
          <span>Independent creative engineering studio</span>
          <span>Strategy → Operation</span>
        </div>
        <h1 className="editorial-title">
          <span>We build</span>
          <span>presence</span>
          <span>that works.</span>
        </h1>
        <div className="hero-brief">
          <p>
            NextEleven turns the real substance of an established business into
            a clear, distinctive, professionally operated presence online.
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
            Your business already has a reputation.
          </p>
          <p className="statement-main">
            The web presence should carry the same weight as the work behind it.
          </p>
          <p className="statement-note">
            We learn how the business earns trust, then connect the strategy,
            words, design, technology, and care required to express it properly.
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
              One relationship.
              <br />
              Every layer.
            </h2>
            <p>
              No relay race between strategist, copywriter, designer, developer,
              host, and support desk. One line of accountability from the first
              question through daily operation.
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
            <h2>Start where the business is.</h2>
          </div>
          <div className="engagement-list">
            {engagements.map((engagement) => (
              <article key={engagement.name} className="engagement-row">
                <span>{engagement.number}</span>
                <h3>{engagement.name}</h3>
                <p>{engagement.description}</p>
                <small>{engagement.includes}</small>
              </article>
            ))}
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
            <h2>What needs to change?</h2>
            <p>
              Give us the useful context. We’ll review the business, the current
              presence, and what a successful result would need to accomplish
              before responding.
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
