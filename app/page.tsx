import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  Circle,
  Compass,
  DraftingCompass,
  Gauge,
  ShieldCheck,
} from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const phases = ['Conceive', 'Create', 'Build', 'Operate'];

export default function Home() {
  return (
    <main>
      <header className="site-shell flex h-20 items-center justify-between border-b border-ink/15">
        <a className="flex items-center gap-3" href="#top" aria-label="NextEleven home">
          <span className="brand-mark">11</span>
          <span className="text-sm font-semibold tracking-[-0.02em]">NextEleven</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm md:flex" aria-label="Primary navigation">
          <a className="nav-link" href="#approach">Approach</a>
          <a className="nav-link" href="#services">Services</a>
          <a className="nav-link" href="#proof">Proof</a>
        </nav>
        <a href="#contact" className={cn(buttonVariants({ variant: 'default' }), 'h-10 rounded-full px-5')}>
          Discuss your business <ArrowUpRight />
        </a>
      </header>

      <section id="top" className="site-shell hero-grid relative overflow-hidden border-b border-ink/15 py-16 lg:py-24">
        <div className="relative z-10 max-w-5xl">
          <p className="eyebrow mb-7"><Circle className="size-2 fill-current" /> Complete web presence, one accountable partner</p>
          <h1 className="display-title max-w-[13ch]">
            Your business is established. <span>Your web presence should make that obvious.</span>
          </h1>
          <div className="mt-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <p className="max-w-2xl text-lg leading-8 text-ink/70 md:text-xl">
              NextEleven turns the real value of your business into a clear, credible presence online—from strategy and story through design, development, hosting, and ongoing care.
            </p>
            <a href="#contact" className={cn(buttonVariants({ variant: 'default' }), 'h-14 w-fit rounded-full px-7 text-base')}>
              Plan my web presence <ArrowDownRight />
            </a>
          </div>
        </div>

        <div className="mt-16 grid border-y border-ink/15 sm:grid-cols-2 lg:grid-cols-4">
          {phases.map((phase, index) => (
            <div className="phase-card" key={phase}>
              <span>0{index + 1}</span>
              <strong>{phase}</strong>
              <Check className="size-4" />
            </div>
          ))}
        </div>
      </section>

      <section id="approach" className="site-shell grid gap-10 py-16 lg:grid-cols-[0.7fr_1.3fr] lg:py-24">
        <p className="eyebrow self-start">A better kind of web partner</p>
        <div>
          <h2 className="section-title">Not another website project to manage.</h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-ink/70">
            We learn how your business earns trust, then build the digital presence to carry that trust forward. You get strategy, words, design, technology, and care in one relationship—with a partner who stays accountable after launch.
          </p>
        </div>
      </section>

      <section id="services" className="bg-ink text-paper">
        <div className="site-shell py-16 lg:py-24">
          <div className="grid gap-8 border-b border-paper/20 pb-12 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="eyebrow mb-5 !text-paper/55">The whole presence</p>
              <h2 className="section-title max-w-[11ch]">One relationship. Every layer.</h2>
            </div>
            <p className="max-w-md text-base leading-7 text-paper/65">
              No handoffs between disconnected vendors. We connect the business thinking to the words, the design, the build, and what happens after launch.
            </p>
          </div>

          <div className="grid lg:grid-cols-2">
            <article className="service-panel">
              <Compass />
              <span>01 / Conceive</span>
              <h3>Find the clearest version of the business.</h3>
              <p>Customer discovery, competitive context, positioning, goals, and the plan for turning attention into action.</p>
            </article>
            <article className="service-panel">
              <DraftingCompass />
              <span>02 / Create</span>
              <h3>Give the value a voice and a visual system.</h3>
              <p>Site architecture, persuasive copy, art direction, interface design, and calls to action that feel natural.</p>
            </article>
            <article className="service-panel">
              <Gauge />
              <span>03 / Build</span>
              <h3>Engineer it to be fast, useful, and durable.</h3>
              <p>Responsive development, accessible interactions, search foundations, analytics, forms, and careful launch preparation.</p>
            </article>
            <article className="service-panel">
              <ShieldCheck />
              <span>04 / Operate</span>
              <h3>Keep it healthy after the applause.</h3>
              <p>Managed hosting, monitoring, security, updates, content changes, and measured improvement over time.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="proof" className="site-shell py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="eyebrow mb-5">Built by people who ship</p>
            <h2 className="section-title">Ideas only matter when they become real.</h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-ink/15 bg-ink/15 sm:grid-cols-2">
            <div className="proof-card sm:col-span-2">
              <strong>12</strong>
              <p>applications published on Apple’s App Store through NextEleven.</p>
            </div>
            <div className="proof-card">
              <strong>1</strong>
              <p>accountable partner from first conversation through ongoing operation.</p>
            </div>
            <div className="proof-card">
              <strong>4</strong>
              <p>connected disciplines: strategy, creation, engineering, and care.</p>
            </div>
          </div>
        </div>
        <p className="mt-8 max-w-2xl text-sm leading-6 text-ink/55">
          Publishing is evidence of repeated completion—not a claim about downloads, revenue, or adoption. We believe proof should be specific enough to trust.
        </p>
      </section>

      <section className="border-y border-ink/15 bg-card">
        <div className="site-shell py-16 lg:py-24">
          <p className="eyebrow mb-5">Ways to work together</p>
          <div className="grid gap-5 lg:grid-cols-3">
            <article className="offer-card">
              <span>01</span>
              <h3>Presence Blueprint</h3>
              <p>Clarify the audience, story, priorities, pages, and launch path before committing to a full build.</p>
              <ul><li>Business discovery</li><li>Positioning direction</li><li>Page and content plan</li><li>Recommended scope</li></ul>
            </article>
            <article className="offer-card featured">
              <span>02</span>
              <h3>Presence Launch</h3>
              <p>Turn the blueprint into a polished, responsive, launch-ready presence built around the business.</p>
              <ul><li>Messaging and copy</li><li>Custom design</li><li>Development and QA</li><li>Hosting and launch</li></ul>
            </article>
            <article className="offer-card">
              <span>03</span>
              <h3>Presence Care</h3>
              <p>Protect the investment and keep the site useful with one partner responsible for its health.</p>
              <ul><li>Managed hosting</li><li>Monitoring and updates</li><li>Content changes</li><li>Ongoing improvement</li></ul>
            </article>
          </div>
        </div>
      </section>

      <section id="contact" className="site-shell py-16 lg:py-28">
        <div className="contact-block relative overflow-hidden rounded-[2rem] bg-signal p-7 text-white sm:p-12 lg:p-16">
          <p className="eyebrow mb-7 !text-white/70">The first step is a conversation</p>
          <h2 className="section-title max-w-[12ch]">Let’s make the online version match the real business.</h2>
          <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
            <a
              href="mailto:nextelevenstudios@gmail.com?subject=Web%20presence%20conversation"
              className={cn(buttonVariants({ variant: 'default' }), 'h-14 w-fit rounded-full bg-white px-7 text-base text-ink hover:bg-white/85')}
            >
              Discuss your business <ArrowRight />
            </a>
            <p className="max-w-sm text-sm leading-6 text-white/75">Tell us what your business does, what exists today, and what you wish worked better.</p>
          </div>
        </div>
      </section>

      <footer className="site-shell flex flex-col gap-5 border-t border-ink/15 py-8 text-sm text-ink/60 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3"><span className="brand-mark">11</span><span>NextEleven LLC</span></div>
        <p>Complete web presence for established businesses.</p>
        <a className="nav-link" href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
