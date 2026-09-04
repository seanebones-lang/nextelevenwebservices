'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

export function ExperienceRuntime() {
  const [showMobileAction, setShowMobileAction] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const revealItems = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]'),
    );
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.visible = 'true';
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    revealItems.forEach((item) => revealObserver.observe(item));

    let heroVisible = true;
    let contactVisible = false;
    const updateAction = () =>
      setShowMobileAction(!heroVisible && !contactVisible);
    const hero = document.querySelector('#top');
    const contact = document.querySelector('#contact');
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === hero) heroVisible = entry.isIntersecting;
          if (entry.target === contact) contactVisible = entry.isIntersecting;
        });
        updateAction();
      },
      { threshold: 0.04 },
    );
    if (hero) sectionObserver.observe(hero);
    if (contact) sectionObserver.observe(contact);

    function handlePointer(event: PointerEvent) {
      root.style.setProperty('--pointer-x', `${event.clientX}px`);
      root.style.setProperty('--pointer-y', `${event.clientY}px`);
    }

    if (!reducedMotion) {
      window.addEventListener('pointermove', handlePointer, { passive: true });
    }

    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
      window.removeEventListener('pointermove', handlePointer);
    };
  }, []);

  return (
    <a
      className="mobile-project-action"
      data-visible={showMobileAction}
      href="#contact"
      aria-hidden={!showMobileAction}
      tabIndex={showMobileAction ? 0 : -1}
    >
      <span>
        Discovery <small>price confirmed in writing</small>
      </span>
      <strong>
        Start a project <ArrowUpRight aria-hidden="true" />
      </strong>
    </a>
  );
}
