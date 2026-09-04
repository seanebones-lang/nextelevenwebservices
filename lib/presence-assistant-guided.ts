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
        'Prices are confirmed in writing after the required depth and responsibilities are understood. Discovery is paid planning work. A Solid Foundation is priced after page, content, integration, and launch requirements are known. A Connected Build and optional ongoing care are quoted after their modules and operating responsibilities are defined.\n\nThe signed proposal controls the final scope, fees, schedule, ownership, and support.',
      section: 'Inspect engagement scope',
      href: '#details',
    };
  }

  if (
    /compare|difference|which|choose|right for|starting point/.test(normalized)
  ) {
    return {
      answer:
        'Choose by depth, not page count:\n\nA / Discovery defines the opportunity and produces a written build recommendation.\n\nB / Solid Foundation is for a distinctive public presence, clear messaging, and the analytics and inquiry paths expressly included in the proposal.\n\nC / Connected Build links the public experience to selected modules such as commerce, inventory, guided assistance, routing, human handoff, or automation. Those modules are scoped—not automatically included.\n\nIf the requirements are unclear, begin with Discovery.',
      section: 'Compare build depths',
      href: '#details',
    };
  }

  if (
    /own|source|code|host|hosting|lock|domain|account|portable/.test(normalized)
  ) {
    return {
      answer:
        'Ownership and license rights are stated in the signed proposal. Unless otherwise stated, project-specific deliverables transfer after final payment. Pre-existing tools, open-source software, fonts, stock assets, hosted services, and third-party materials remain subject to their existing terms.\n\nClient-owned accounts remain under client control. Source portability depends on the selected platform, provider terms, licenses, and written scope.',
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
        'Those are Connected Build capabilities. A purpose-built environment can include selected commerce, inventory, guided-assistance, email-routing, human-escalation, booking, or automation modules.\n\nNo module is assumed. Discovery or paid scoping defines the systems, rules, data handling, acceptance criteria, runtime, and calendar before implementation begins.',
      section: 'Explore Connected Build',
      href: '#details',
    };
  }

  if (/payment|deposit|milestone|invoice|cancel|stop/.test(normalized)) {
    return {
      answer:
        'The signed proposal states the deposit, milestone, and acceptance schedule. Work outside the accepted scope begins only after a written change order is approved.\n\nFees at cancellation are determined under the signed agreement, based on completed work, reserved capacity, and approved third-party commitments.',
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
        'The proposal states the calendar after scope, dependencies, access, content readiness, and approval timing are known. Any included post-launch support period is also stated there.\n\nOptional ongoing care is quoted after release work, monitoring, maintenance, response targets, and other operating responsibilities are defined.',
      section: 'Route a project brief',
      href: '#contact',
    };
  }

  return {
    answer:
      'NextEleven defines, designs, builds, and can operate custom web environments. The right starting point depends on what exists today, what must change, and whether the public presence needs to connect to commerce, inventory, guided assistance, routing, or other operating workflows.\n\nUse the focused project brief. NextEleven aims to reply within two business days after confirmed receipt.',
    section: 'Start the project brief',
    href: '#contact',
  };
}
