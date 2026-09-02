import { ArrowDownRight, ArrowUpRight, Check, MoveDown } from 'lucide-react';
import type { CSSProperties } from 'react';
import { ExperienceRuntime } from '@/components/experience-runtime';
import { InquiryForm } from '@/components/inquiry-form';
import { PackageExplorer } from '@/components/package-explorer';
import { PresenceAssistant } from '@/components/presence-assistant';
import { ProcessSignal } from '@/components/process-signal';
import { SignalField } from '@/components/signal-field';
import { engagements, services, terms } from '@/lib/site-content';

function ElevenMark() {
  return (
    <span className="eleven-mark" aria-hidden="true">
      {Array.from({ length: 11 }, (_, index) => (
        <i key={index} />
      ))}
    </span>
  );
}

function SectionSignal({ index, label }: { index: string; label: string }) {
  return (
    <div className="section-signal">
      <span>{index}/11</span>
      <i aria-hidden="true" />
      <small>{label}</small>
    </div>
  );
}

export default function Home() {
  return (
    <main className="experience">
      <ExperienceRuntime />
      <PresenceAssistant />
      <div className="eleven-grid" aria-hidden="true" />
      <div className="pointer-aura" aria-hidden="true" />
      <div className="noise-field" aria-hidden="true" />

      <header className="site-header">
        <a className="brand-lockup" href="#top" aria-label="NextEleven home">
          <ElevenMark />
          <span className="brand-name">
            NEXT
            <br />
            ELEVEN
          </span>
        </a>
        <p className="header-location">DFW / TEXAS</p>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#engagements">Engagements</a>
          <a href="#system">System</a>
          <a href="#details">Scope</a>
        </nav>
        <a className="header-action" href="#contact" data-magnetic>
          Route a brief <ArrowUpRight aria-hidden="true" />
        </a>
      </header>

      <section id="top" className="signal-hero">
        <div className="hero-copy">
          <div className="hero-meta hero-reveal-1">
            <span>Premium web systems studio</span>
            <span>Conceive / Create / Build / Operate</span>
          </div>

          <h1
            className="signal-title"
            aria-label="We build presence that works."
          >
            <span className="hero-reveal-2">We build</span>
            <span className="title-spectrum hero-reveal-3">presence</span>
            <span className="hero-reveal-4">that works.</span>
          </h1>

          <div className="hero-bottom hero-reveal-5">
            <p>
              NextEleven designs and engineers premium custom web
              environments—from a solid public foundation to full vertical
              systems that sell, assist, integrate, and operate.
            </p>
            <div className="hero-actions">
              <a className="primary-action" href="#contact" data-magnetic>
                Start a project
                <ArrowUpRight aria-hidden="true" />
              </a>
              <a className="text-action" href="#engagements">
                See the numbers
                <ArrowDownRight aria-hidden="true" />
              </a>
            </div>
            <div className="hero-proofline">
              <span>Discovery from $500</span>
              <i aria-hidden="true" />
              <span>Written reply within two business days</span>
            </div>
          </div>
        </div>

        <div className="hero-visual hero-reveal-3">
          <SignalField />
          <div className="visual-chrome" aria-hidden="true">
            <span className="visual-index">N°11 / LIVE SYSTEM</span>
            <span className="visual-coordinates">32.7767° N / 96.7970° W</span>
            <div className="visual-stage visual-stage-a">
              <i />
              <span>Discover</span>
            </div>
            <div className="visual-stage visual-stage-b">
              <i />
              <span>Foundation</span>
            </div>
            <div className="visual-stage visual-stage-c">
              <i />
              <span>Full vertical</span>
            </div>
            <div className="visual-stage visual-stage-d">
              <i />
              <span>Operate</span>
            </div>
            <svg
              className="visual-route"
              viewBox="0 0 500 760"
              preserveAspectRatio="none"
            >
              <path d="M88 96C88 240 412 178 412 340C412 458 170 430 170 574C170 650 338 650 410 704" />
            </svg>
          </div>
          <div className="visual-pulse" aria-hidden="true">
            <span>Input</span>
            <strong>Business signal</strong>
            <i />
            <span>Output</span>
            <strong>Working presence</strong>
          </div>
        </div>

        <a
          className="hero-scroll"
          href="#engagements"
          aria-label="Scroll to engagements"
        >
          <span>Explore the system</span>
          <MoveDown aria-hidden="true" />
        </a>
      </section>

      <section id="engagements" className="engagements-section">
        <div className="section-shell rate-intro" data-reveal>
          <SectionSignal index="01" label="Choose the depth" />
          <h2>
            Real numbers.
            <br />
            Before the form.
          </h2>
          <div className="rate-premise">
            <p>
              Start with what the business actually needs. Discover the
              opportunity. Establish the foundation. Build the full vertical
              when it earns the right to exist.
            </p>
            <small>
              These are honest starting points. Discovery confirms the final
              scope before build work begins.
            </small>
          </div>
        </div>

        <div className="engagement-bands">
          {engagements.map((engagement, index) => (
            <a
              key={engagement.id}
              className="engagement-band"
              href="#details"
              data-reveal
              style={{ '--band-index': index } as CSSProperties}
            >
              <span className="engagement-code">{engagement.number}</span>
              <div className="engagement-name">
                <small>Build depth {String(index + 1).padStart(2, '0')}</small>
                <h3>{engagement.name}</h3>
              </div>
              <p>{engagement.description}</p>
              <div className="engagement-price">
                <strong>{engagement.investment}</strong>
                <span>{engagement.includes.join(' / ')}</span>
              </div>
              <ArrowUpRight aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>

      <section id="system" className="system-section">
        <div className="section-shell system-heading" data-reveal>
          <SectionSignal index="02" label="The build system" />
          <h2>
            Cutting edge.
            <span>Built on bedrock.</span>
          </h2>
          <p>
            Advanced capability only creates value when the fundamentals are
            right. Strategy, experience, engineering, security, and operation
            remain one connected responsibility.
          </p>
        </div>
        <div className="section-shell">
          <ProcessSignal services={services} />
        </div>
      </section>

      <section id="details" className="details-section">
        <div className="section-shell details-heading" data-reveal>
          <SectionSignal index="03" label="Definition of done" />
          <h2>
            Inspect the build
            <br />
            before you buy it.
          </h2>
          <p>
            Every engagement has a written deliverable, a working calendar,
            clear client inputs, and an explicit boundary. The accepted proposal
            is the final source of truth for scope.
          </p>
        </div>
        <div className="section-shell" data-reveal>
          <PackageExplorer engagements={engagements} />
          <div className="launch-standard-new">
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

      <section className="relationship-section">
        <div className="section-shell relationship-heading" data-reveal>
          <SectionSignal index="04" label="Working relationship" />
          <h2>
            Clear milestones.
            <br />
            Clean handoff.
          </h2>
          <p>
            The operating model is designed to protect both sides: visible
            checkpoints, client-controlled accounts, and no artificial lock-in.
          </p>
        </div>

        <div className="section-shell relationship-grid">
          <article className="payment-system" data-reveal>
            <div className="system-card-label">
              <span>Payment route</span>
              <small>Standard build schedule</small>
            </div>
            <div
              className="payment-route"
              aria-label="30 percent deposit, 40 percent milestone, 30 percent completion"
            >
              <div>
                <strong>30</strong>
                <sup>%</sup>
                <span>Deposit</span>
                <small>Reserve + begin</small>
              </div>
              <i aria-hidden="true">
                <span />
              </i>
              <div>
                <strong>40</strong>
                <sup>%</sup>
                <span>Milestone</span>
                <small>Agreed checkpoint</small>
              </div>
              <i aria-hidden="true">
                <span />
              </i>
              <div>
                <strong>30</strong>
                <sup>%</sup>
                <span>Completion</span>
                <small>Final acceptance</small>
              </div>
            </div>
          </article>

          <article className="ownership-system" data-reveal>
            <div className="system-card-label">
              <span>Ownership route</span>
              <small>After final payment</small>
            </div>
            <div
              className="ownership-map"
              aria-label="Client-owned project assets"
            >
              <div className="asset-nodes">
                {[
                  'Source',
                  'Domain',
                  'Analytics',
                  'Email',
                  'Commerce',
                  'Cloud',
                ].map((asset) => (
                  <span key={asset}>{asset}</span>
                ))}
              </div>
              <div className="ownership-lines" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="client-owned">
                <small>Final destination</small>
                <strong>
                  CLIENT
                  <br />
                  OWNED
                </strong>
              </div>
            </div>
            <p>
              Pay the hosting provider directly or have NextEleven manage it.
              Either way, the source and accounts can move to another suitable
              provider at any time. Provider charges stay separate and
              pre-approved.
            </p>
          </article>

          <article className="operate-system" data-reveal>
            <div className="operate-orbit" aria-hidden="true">
              <span>11</span>
              <i />
              <i />
              <i />
            </div>
            <div>
              <p className="system-label">Optional continuity</p>
              <h3>Operate</h3>
              <strong>From $150/month</strong>
              <p>
                After the included 30-day launch window, a standard retainer can
                cover managed releases, uptime and form monitoring, routine
                dependency updates, small content changes, and a monthly health
                check. Higher-touch support, workflow operation, or continuous
                improvement is scoped around the actual system.
              </p>
              <small>
                Hosting and third-party provider bills remain separate. The
                client keeps the keys and can end managed service under the
                agreed notice period without surrendering the work.
              </small>
            </div>
          </article>
        </div>
      </section>

      <section className="principal-section">
        <div className="section-shell principal-grid">
          <div className="principal-dossier" data-reveal>
            <SectionSignal index="05" label="Who you hire" />
            <div className="principal-monogram" aria-hidden="true">
              <span>S</span>
              <i />
              <span>11</span>
            </div>
            <p className="system-label">Principal / DFW, Texas</p>
            <h2>
              Sean.
              <br />
              <span>Accountable end to end.</span>
            </h2>
            <p>
              You work directly with the principal responsible for discovery,
              design direction, engineering, and delivery at NextEleven LLC.
            </p>
            <div className="principal-response">
              <span>Response protocol</span>
              <strong>Written reply within two business days.</strong>
              <a href="mailto:nextelevenstudios@gmail.com">
                nextelevenstudios@gmail.com
              </a>
            </div>
          </div>

          <div className="fit-dossier" data-reveal>
            <p className="system-label">Where the work fits</p>
            <h3>Built for businesses with real work behind them.</h3>
            <p>
              NextEleven is a strong fit for automotive and skilled trades,
              professional services, industrial and B2B companies, retail and
              hospitality, and health or wellness businesses that need a clearer
              public presence or a connected operating environment.
            </p>
            <div className="fit-checks">
              {[
                'A business problem worth solving',
                'One decision-maker at checkpoints',
                'A custom result—not a template reskin',
              ].map((item) => (
                <span key={item}>
                  <Check aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>
            <p className="fit-exclusion">
              We are not the right shop for a template reskin, a standalone $300
              logo, or a request to “just make it pretty” without addressing the
              business problem.
            </p>
            <div className="proof-policy">
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

      <section id="contact" className="contact-section-new">
        <div className="contact-signal" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="section-shell contact-grid">
          <div className="contact-intro-new" data-reveal>
            <SectionSignal index="06" label="Route the brief" />
            <p className="contact-overline">
              No gatekeeping. No mystery pricing.
            </p>
            <h2>
              Tell us what
              <br />
              needs to work.
            </h2>
            <p>
              The numbers are already above. This focused brief gives us enough
              context to respond intelligently—not another hoop between you and
              a price.
            </p>
            <div className="response-beacon">
              <span>
                <i />
              </span>
              <p>
                <strong>Intake channel open</strong>
                Written response within two business days.
              </p>
            </div>
          </div>
          <div className="brief-console" data-reveal>
            <div className="console-header">
              <span>PROJECT BRIEF / SECURE INTAKE</span>
              <div aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
            </div>
            <InquiryForm />
          </div>
        </div>
      </section>

      <section className="terms-section-new">
        <div className="section-shell terms-heading" data-reveal>
          <SectionSignal index="07" label="Commercial principles" />
          <h2>
            No surprises
            <br />
            in the handoff.
          </h2>
          <p>
            The signed proposal records the exact scope, acceptance points,
            support period, and project-specific exceptions. These are the
            standard principles beneath it.
          </p>
        </div>
        <div className="section-shell terms-ledger" data-reveal>
          {terms.map((term, index) => (
            <details key={term.title} open={index === 3 || undefined}>
              <summary>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{term.title}</strong>
                <i aria-hidden="true" />
              </summary>
              <p>{term.body}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-signal" aria-hidden="true">
          <ElevenMark />
          <span>SYSTEM COMPLETE</span>
        </div>
        <p className="footer-statement">
          Conceive clearly. Create deliberately.
          <br />
          Build properly. Operate responsibly.
        </p>
        <div className="footer-bottom">
          <span>NextEleven LLC · DFW, Texas</span>
          <a href="mailto:nextelevenstudios@gmail.com">
            nextelevenstudios@gmail.com
          </a>
          <a href="#top">Return to signal ↑</a>
        </div>
      </footer>
    </main>
  );
}
