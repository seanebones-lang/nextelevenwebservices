export type GuidedAnswer = {
  answer: string;
  section: string;
  href: string;
};

export function guidedPresenceAnswer(question: string): GuidedAnswer {
  const normalized = question.toLowerCase();

  if (/price|cost|rate|budget|how much|package/.test(normalized)) {
    return {
      answer:
        'The starting points are transparent:\n\n• Discovery — from $500\n• Solid Foundation — from $2,500, typically $2,500–$7,500\n• Full Vertical Build — custom scope from $7,500\n• Operate — optional ongoing care from $150/month\n\nDiscovery is the safest starting point when requirements or integrations are still unclear. A written scope confirms the final number before build work begins.',
      section: 'Inspect engagement scope',
      href: '#details',
    };
  }

  if (
    /compare|difference|which|choose|right for|starting point/.test(normalized)
  ) {
    return {
      answer:
        'Choose by depth, not page count:\n\nA / Discovery defines the opportunity and produces the written build recommendation.\n\nB / Solid Foundation is for a distinctive public presence, clear messaging, analytics, and a tested inquiry path.\n\nC / Full Vertical connects the public experience to modules such as commerce, inventory, assistants, routing, human handoff, or automation. Those modules are scoped—not automatically included.\n\nIf you are unsure, begin with Discovery.',
      section: 'Compare build depths',
      href: '#details',
    };
  }

  if (
    /own|source|code|host|hosting|lock|domain|account|portable/.test(normalized)
  ) {
    return {
      answer:
        'After final payment, the client owns the project source code and final project-specific design files. The client also owns the domain, analytics, email, commerce, and cloud accounts.\n\nYou can pay providers directly or ask NextEleven to manage them. Provider costs stay separate and pre-approved, and the source can move to another suitable provider at any time—no artificial lock-in.',
      section: 'See ownership terms',
      href: '#details',
    };
  }

  if (
    /assistant|chat|inventory|email|handoff|automation|commerce|sell/.test(
      normalized,
    )
  ) {
    return {
      answer:
        'Those are Full Vertical capabilities. A purpose-built environment can connect product sales, inventory-aware experiences, an after-hours assistant, email routing, human escalation, booking, or automation.\n\nThey are common modules—not assumed inclusions. Discovery or a paid scoping week defines the systems, rules, acceptance criteria, runtime, and calendar before the build begins.',
      section: 'Explore Full Vertical',
      href: '#details',
    };
  }

  if (/payment|deposit|milestone|invoice|cancel|stop/.test(normalized)) {
    return {
      answer:
        'The standard build schedule is 30% deposit to reserve and begin, 40% after the agreed build checkpoint, and 30% after final acceptance.\n\nWork outside the accepted scope is described and priced in a written change order first. If a project stops, completed work and committed third-party costs are reconciled through the stop date; unperformed milestones are not silently charged.',
      section: 'Review working terms',
      href: '#details',
    };
  }

  if (
    /timeline|how long|launch|support|after launch|operate|maintenance/.test(
      normalized,
    )
  ) {
    return {
      answer:
        'Discovery typically takes 5–10 business days after kickoff. A Solid Foundation usually takes 3–6 weeks from cleared deposit to launch. Full Vertical timing is defined after Discovery or a paid scoping week.\n\nFoundation and Full Vertical include 30 days of post-launch defect support. Optional Operate care starts at $150/month and can cover releases, monitoring, routine updates, small content changes, and a monthly health check.',
      section: 'Route a project brief',
      href: '#contact',
    };
  }

  return {
    answer:
      'NextEleven conceives, creates, builds, and can operate premium custom web environments. The right starting point depends on what exists today, what must change, and whether the public presence needs to connect to commerce, inventory, intelligent assistance, routing, or other operating workflows.\n\nUse the focused project brief for a written recommendation within two business days.',
    section: 'Start the project brief',
    href: '#contact',
  };
}
