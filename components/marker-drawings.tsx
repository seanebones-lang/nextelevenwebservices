type DrawingProps = {
  className?: string;
};

const filter = (
  <>
    <filter id="marker-grain" x="-8%" y="-8%" width="116%" height="116%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.9"
        numOctaves="2"
        seed="11"
        result="noise"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="noise"
        scale="1.6"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  </>
);

export function MarkerUnderline({ className }: DrawingProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 420 36"
      fill="none"
      aria-hidden="true"
    >
      <defs>{filter}</defs>
      <path
        filter="url(#marker-grain)"
        d="M6 22c38-8 76-4 114-6 41-2 81 5 122 2 34-2 68-9 104-5 18 2 42 8 68 4"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M18 27c48-3 96 2 145-1 39-2 79 4 118 1"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}

export function MarkerCircle({ className }: DrawingProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
    >
      <defs>{filter}</defs>
      <path
        filter="url(#marker-grain)"
        d="M22 58c2-24 22-42 48-44 27-2 50 16 54 42 4 28-16 52-44 55-26 3-52-16-56-40-1-8 2-16 6-22"
        stroke="currentColor"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      <path
        d="M30 50c8-18 28-28 46-24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}

export function MarkerArrow({ className }: DrawingProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 88 36"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 20c18-2 36-3 56-4 8 0 16 1 24 2"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M66 8c6 6 10 10 16 14-8 2-14 6-22 12"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MarkerStar({ className }: DrawingProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M32 6l5 18 18 4-14 12 5 18-14-10-14 10 5-18-14-12 18-4z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MarkerAsterisk({ className }: DrawingProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M24 4v40M8 14l32 20M40 14L8 34"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MarkerScribble({ className }: DrawingProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 220 70"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 36c18-18 32-20 46-8 14 12 24 14 38 2 16-14 30-14 44 2 14 16 28 16 44 2 12-11 24-12 36 4"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MarkerBox({ className }: DrawingProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 160"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M18 28c42-6 84-4 126 2-4 36-3 74 2 108-44 6-86 4-128-3 2-34 1-72-0-107z"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MarkerEleven({ className }: DrawingProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 72 72"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M22 14c1 14 0 28 2 44"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M48 16c0 14 1 28-1 42"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M16 18h14M42 20h14"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}
