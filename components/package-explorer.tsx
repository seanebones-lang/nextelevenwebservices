'use client';

import { useRef, useState, type CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Engagement } from '@/lib/site-content';

type PackageExplorerProps = {
  engagements: Engagement[];
};

const modules = [
  'Commerce',
  'Inventory',
  'Assistant',
  'Email routing',
  'Human handoff',
  'Automation',
];

export function PackageExplorer({ engagements }: PackageExplorerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const active = engagements[activeIndex];

  function selectAndFocus(index: number) {
    const normalized = (index + engagements.length) % engagements.length;
    setActiveIndex(normalized);
    tabRefs.current[normalized]?.focus();
  }

  return (
    <div className="package-explorer">
      <div
        className="package-tabs"
        role="tablist"
        aria-label="Choose an engagement depth"
      >
        {engagements.map((engagement, index) => (
          <button
            key={engagement.id}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            id={`package-tab-${engagement.id}`}
            className="package-tab"
            type="button"
            role="tab"
            aria-selected={activeIndex === index}
            aria-controls={`package-panel-${engagement.id}`}
            tabIndex={activeIndex === index ? 0 : -1}
            onClick={() => setActiveIndex(index)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                event.preventDefault();
                selectAndFocus(activeIndex + 1);
              }
              if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                event.preventDefault();
                selectAndFocus(activeIndex - 1);
              }
              if (event.key === 'Home') {
                event.preventDefault();
                selectAndFocus(0);
              }
              if (event.key === 'End') {
                event.preventDefault();
                selectAndFocus(engagements.length - 1);
              }
            }}
          >
            <span>{engagement.number}</span>
            <span>{engagement.name}</span>
            <small>{engagement.investment}</small>
          </button>
        ))}
      </div>

      <div
        key={active.id}
        id={`package-panel-${active.id}`}
        className="package-panel"
        role="tabpanel"
        aria-labelledby={`package-tab-${active.id}`}
        tabIndex={0}
      >
        <header className="package-panel-head">
          <div>
            <p className="system-label">
              Selected build depth / {active.number}
            </p>
            <h3>{active.name}</h3>
          </div>
          <strong>{active.investment}</strong>
        </header>

        <p className="package-description">{active.description}</p>

        <div className="package-output-line" aria-label="Included disciplines">
          {active.includes.map((item, index) => (
            <span key={item}>
              <i aria-hidden="true">{String(index + 1).padStart(2, '0')}</i>
              {item}
            </span>
          ))}
        </div>

        {active.id === 'vertical' && (
          <div className="module-topology" aria-label="Common custom modules">
            <div className="module-core">
              <span>N°11</span>
              <strong>Custom core</strong>
            </div>
            {modules.map((module, index) => (
              <div
                key={module}
                className="module-node"
                style={{ '--node-index': index } as CSSProperties}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                {module}
              </div>
            ))}
          </div>
        )}

        <dl className="package-specs">
          <div>
            <dt>Typical calendar</dt>
            <dd>{active.timing}</dd>
          </div>
          <div>
            <dt>What you receive</dt>
            <dd>{active.deliverable}</dd>
          </div>
          <div>
            <dt>What we need from you</dt>
            <dd>{active.clientInputs}</dd>
          </div>
          <div>
            <dt>Boundaries</dt>
            <dd>{active.boundaries}</dd>
          </div>
        </dl>

        <a className="package-action" href="#contact" data-magnetic>
          Start with {active.name}
          <ArrowUpRight aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
