'use client';

import { useEffect, useRef, useState } from 'react';
import type { ServiceStage } from '@/lib/site-content';

type ProcessSignalProps = {
  services: ServiceStage[];
};

export function ProcessSignal({ services }: ProcessSignalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = Number((visible.target as HTMLElement).dataset.stage);
        setActiveIndex(index);
      },
      { rootMargin: '-34% 0px -42% 0px', threshold: [0.1, 0.35, 0.65] },
    );

    itemRefs.current.forEach((item) => item && observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="process-composition">
      <div className="process-visual" aria-hidden="true">
        <div className="process-orbit" data-active={activeIndex}>
          <svg viewBox="0 0 620 620" role="presentation">
            <defs>
              <linearGradient id="signal-spectrum" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="#6ee7ff" />
                <stop offset="0.48" stopColor="#7c5cff" />
                <stop offset="1" stopColor="#dd7cff" />
              </linearGradient>
              <filter
                id="signal-glow"
                x="-100%"
                y="-100%"
                width="300%"
                height="300%"
              >
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle className="orbit-outer" cx="310" cy="310" r="236" />
            <circle className="orbit-inner" cx="310" cy="310" r="150" />
            <path className="orbit-axis" d="M74 310H546M310 74V546" />
            <path
              className="orbit-route"
              d="M120 310C120 178 204 108 310 108C440 108 512 212 512 310C512 432 418 512 310 512C188 512 108 424 108 310C108 222 170 156 246 156C350 156 424 224 424 310C424 386 368 440 310 440C226 440 184 380 184 310C184 244 236 206 292 206"
            />
            {[
              [120, 310],
              [310, 108],
              [512, 310],
              [310, 512],
            ].map(([cx, cy], index) => (
              <g
                key={`${cx}-${cy}`}
                className="orbit-node"
                data-current={activeIndex === index}
              >
                <circle cx={cx} cy={cy} r="18" />
                <circle cx={cx} cy={cy} r="4" />
              </g>
            ))}
            <circle className="orbit-core" cx="310" cy="310" r="34" />
            <text x="310" y="306" textAnchor="middle">
              N°11
            </text>
            <text x="310" y="325" textAnchor="middle">
              SYSTEM
            </text>
          </svg>
          <div className="process-status">
            <span>Active signal</span>
            <strong>{services[activeIndex].signal}</strong>
          </div>
        </div>
      </div>

      <div className="process-stages">
        {services.map((service, index) => (
          <article
            key={service.name}
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
            className="process-stage"
            data-stage={index}
            data-active={activeIndex === index}
          >
            <div className="stage-index">
              <span>{service.number}</span>
              <i aria-hidden="true" />
              <small>{service.signal}</small>
            </div>
            <h3>{service.name}</h3>
            <p className="stage-statement">{service.statement}</p>
            <p className="stage-detail">{service.detail}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
