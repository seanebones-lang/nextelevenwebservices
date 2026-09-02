'use client';

import { useEffect, useRef } from 'react';

type SignalFieldProps = {
  className?: string;
};

type Tone = 0 | 1 | 2;

type FieldNode = {
  x: number;
  y: number;
  radius: number;
  phase: number;
  rate: number;
  driftX: number;
  driftY: number;
  depth: number;
  energy: number;
  tone: Tone;
  beacon: boolean;
};

type FieldEdge = {
  from: number;
  to: number;
  bend: number;
  energy: number;
  tone: Tone;
  phase: number;
  pulseRate: number;
  carriesSignal: boolean;
};

type FieldScene = {
  nodes: FieldNode[];
  edges: FieldEdge[];
  positions: Float32Array;
};

const TAU = Math.PI * 2;
const FIELD_SEED = 11_110_731;
const MAX_BACKING_PIXELS = 5_000_000;
const MAX_BACKING_EDGE = 4_096;
const EDGE_RGB = ['72, 139, 255', '146, 101, 255', '224, 239, 255'];

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const amount = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return amount * amount * (3 - 2 * amount);
}

function halton(index: number, base: number) {
  let fraction = 1;
  let result = 0;
  let value = index;

  while (value > 0) {
    fraction /= base;
    result += fraction * (value % base);
    value = Math.floor(value / base);
  }

  return result;
}

function seededRandom(seed: number) {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function buildScene(width: number, height: number): FieldScene {
  const random = seededRandom(FIELD_SEED);
  const compact = width < 640;
  const area = width * height;
  const nodeCount = clamp(
    Math.round(area / (compact ? 14_000 : 18_000)),
    compact ? 28 : 42,
    compact ? 42 : 78,
  );
  const nodes: FieldNode[] = [];
  const offsetX = random();
  const offsetY = random();

  for (let index = 0; index < nodeCount; index += 1) {
    const sequenceIndex = index + 7;
    let x = (halton(sequenceIndex, 2) + offsetX) % 1;
    let y = (halton(sequenceIndex, 3) + offsetY) % 1;
    const lane = index % 5;

    x = clamp(x + (random() - 0.5) * 0.026, 0.025, 0.975);
    y +=
      Math.sin((x * 1.42 + lane * 0.085 + 0.08) * TAU) *
        (0.025 + random() * 0.022) +
      (random() - 0.5) * 0.02;
    y = clamp(y, 0.035, 0.965);

    const rightwardEnergy = smoothstep(0.04, 0.92, x);
    const energy = clamp(
      0.22 + rightwardEnergy * 0.62 + (random() - 0.5) * 0.16,
      0.16,
      1,
    );
    const toneRoll = random();
    const beacon = random() > 0.87 || index % 19 === 0;

    nodes.push({
      x,
      y,
      radius: beacon ? 1.45 + random() * 0.75 : 0.55 + random() * 0.9,
      phase: random() * TAU,
      rate: 0.000_075 + random() * 0.000_085,
      driftX: 1.5 + random() * 3.8,
      driftY: 1.2 + random() * 3.4,
      depth: 0.2 + random() * 0.8,
      energy,
      tone: toneRoll > 0.82 ? 2 : toneRoll > 0.44 ? 1 : 0,
      beacon,
    });
  }

  const edges: FieldEdge[] = [];
  const existingEdges = new Set<string>();
  const typicalSpacing = Math.sqrt(area / nodeCount);
  let signalCount = 0;

  for (let from = 0; from < nodes.length; from += 1) {
    const source = nodes[from];
    const nearest: Array<{ index: number; distance: number }> = [];

    for (let to = 0; to < nodes.length; to += 1) {
      if (from === to) continue;

      const target = nodes[to];
      const dx = (target.x - source.x) * width;
      const dy = (target.y - source.y) * height;
      nearest.push({ index: to, distance: Math.hypot(dx, dy) });
    }

    nearest.sort((a, b) => a.distance - b.distance);
    const connections = source.beacon ? 4 : from % 4 === 0 ? 3 : 2;

    for (const candidate of nearest.slice(0, connections)) {
      const distanceLimit = typicalSpacing * (source.beacon ? 2.7 : 2.05);
      if (candidate.distance > distanceLimit) continue;

      const low = Math.min(from, candidate.index);
      const high = Math.max(from, candidate.index);
      const key = `${low}:${high}`;
      if (existingEdges.has(key)) continue;

      existingEdges.add(key);
      const target = nodes[candidate.index];
      const energy = (source.energy + target.energy) / 2;
      const carriesSignal =
        signalCount < (compact ? 5 : 9) && energy > 0.58 && random() > 0.73;

      if (carriesSignal) signalCount += 1;

      edges.push({
        from,
        to: candidate.index,
        bend: (random() - 0.5) * Math.min(42, 8 + candidate.distance * 0.14),
        energy,
        tone:
          source.tone === target.tone
            ? source.tone
            : random() > 0.68
              ? 2
              : source.tone,
        phase: random(),
        pulseRate: 0.000_025 + random() * 0.000_035,
        carriesSignal,
      });
    }
  }

  return {
    nodes,
    edges,
    positions: new Float32Array(nodes.length * 2),
  };
}

function traceEdge(
  context: CanvasRenderingContext2D,
  edge: FieldEdge,
  positions: Float32Array,
) {
  const fromOffset = edge.from * 2;
  const toOffset = edge.to * 2;
  const fromX = positions[fromOffset];
  const fromY = positions[fromOffset + 1];
  const toX = positions[toOffset];
  const toY = positions[toOffset + 1];
  const deltaX = toX - fromX;
  const deltaY = toY - fromY;
  const distance = Math.max(1, Math.hypot(deltaX, deltaY));
  const controlX = (fromX + toX) / 2 - (deltaY / distance) * edge.bend;
  const controlY = (fromY + toY) / 2 + (deltaX / distance) * edge.bend;

  context.moveTo(fromX, fromY);
  context.quadraticCurveTo(controlX, controlY, toX, toY);
}

function pointOnEdge(edge: FieldEdge, positions: Float32Array, amount: number) {
  const fromOffset = edge.from * 2;
  const toOffset = edge.to * 2;
  const fromX = positions[fromOffset];
  const fromY = positions[fromOffset + 1];
  const toX = positions[toOffset];
  const toY = positions[toOffset + 1];
  const deltaX = toX - fromX;
  const deltaY = toY - fromY;
  const distance = Math.max(1, Math.hypot(deltaX, deltaY));
  const controlX = (fromX + toX) / 2 - (deltaY / distance) * edge.bend;
  const controlY = (fromY + toY) / 2 + (deltaX / distance) * edge.bend;
  const inverse = 1 - amount;

  return {
    x:
      inverse * inverse * fromX +
      2 * inverse * amount * controlX +
      amount * amount * toX,
    y:
      inverse * inverse * fromY +
      2 * inverse * amount * controlY +
      amount * amount * toY,
  };
}

export function SignalField({ className = '' }: SignalFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    const contextElement = canvasElement.getContext('2d', { alpha: true });
    if (!contextElement) return;

    const canvas: HTMLCanvasElement = canvasElement;
    const context: CanvasRenderingContext2D = contextElement;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = motionQuery.matches;
    let inViewport = true;
    let pageVisible = document.visibilityState === 'visible';
    let frameId: number | null = null;
    let scene: FieldScene | null = null;
    let width = 0;
    let height = 0;

    const pointer = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      strength: 0,
      targetStrength: 0,
      lastMovedAt: 0,
    };

    function cancelFrame() {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }
    }

    function drawContours(time: number) {
      if (!scene) return;

      context.save();
      context.globalCompositeOperation = 'source-over';
      context.lineWidth = 0.65;

      for (let band = 0; band < 6; band += 1) {
        const baseY = height * (0.12 + band * 0.155);
        context.beginPath();

        for (let step = 0; step <= 28; step += 1) {
          const progress = step / 28;
          const x = -40 + progress * (width + 80);
          const wave =
            Math.sin(progress * TAU * 1.35 + band * 0.82 + time * 0.000_025) *
              (10 + band * 1.8) +
            Math.sin(progress * TAU * 3.1 - band * 0.56) * 3.5;
          const pointerLift =
            pointer.strength *
            Math.exp(-Math.pow(progress - (pointer.x * 0.5 + 0.5), 2) * 18) *
            pointer.y *
            8;
          const y = baseY + wave + pointerLift;

          if (step === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }

        context.strokeStyle =
          band % 2 === 0
            ? 'rgba(73, 135, 255, 0.032)'
            : 'rgba(151, 103, 255, 0.026)';
        context.stroke();
      }

      context.restore();
    }

    function updatePositions(time: number) {
      if (!scene) return;

      const focusX = (pointer.x * 0.5 + 0.5) * width;
      const focusY = (pointer.y * 0.5 + 0.5) * height;
      const influenceRadius = Math.max(150, Math.min(width, height) * 0.36);

      for (let index = 0; index < scene.nodes.length; index += 1) {
        const node = scene.nodes[index];
        let x =
          node.x * width +
          Math.sin(time * node.rate + node.phase) * node.driftX +
          pointer.x * node.depth * pointer.strength * 6;
        let y =
          node.y * height +
          Math.cos(time * node.rate * 0.83 + node.phase) * node.driftY +
          pointer.y * node.depth * pointer.strength * 5;
        const deltaX = x - focusX;
        const deltaY = y - focusY;
        const distance = Math.max(1, Math.hypot(deltaX, deltaY));
        const influence =
          Math.pow(Math.max(0, 1 - distance / influenceRadius), 2) *
          pointer.strength;

        x += (deltaX / distance) * influence * (7 + node.depth * 9);
        y += (deltaY / distance) * influence * (7 + node.depth * 9);

        scene.positions[index * 2] = x;
        scene.positions[index * 2 + 1] = y;
      }
    }

    function drawEdges(time: number) {
      if (!scene) return;

      context.save();
      context.globalCompositeOperation = 'lighter';
      context.lineCap = 'round';

      for (const glowPass of [true, false]) {
        for (const edge of scene.edges) {
          const shimmer =
            0.82 + Math.sin(time * 0.000_24 + edge.phase * TAU) * 0.18;
          const opacity = edge.energy * shimmer * (glowPass ? 0.032 : 0.19);

          context.beginPath();
          traceEdge(context, edge, scene.positions);
          context.lineWidth = glowPass ? 3.2 : 0.72;
          context.strokeStyle = `rgba(${EDGE_RGB[edge.tone]}, ${opacity})`;
          context.stroke();
        }
      }

      for (const edge of scene.edges) {
        if (!edge.carriesSignal) continue;

        const progress = (edge.phase + time * edge.pulseRate) % 1;
        const point = pointOnEdge(edge, scene.positions, progress);
        const visibility = Math.sin(progress * Math.PI);
        const radius = 7 + edge.energy * 5;
        const glow = context.createRadialGradient(
          point.x,
          point.y,
          0,
          point.x,
          point.y,
          radius,
        );
        glow.addColorStop(
          0,
          `rgba(${EDGE_RGB[edge.tone]}, ${0.62 * visibility})`,
        );
        glow.addColorStop(0.16, `rgba(241, 247, 255, ${0.52 * visibility})`);
        glow.addColorStop(1, `rgba(${EDGE_RGB[edge.tone]}, 0)`);

        context.fillStyle = glow;
        context.fillRect(
          point.x - radius,
          point.y - radius,
          radius * 2,
          radius * 2,
        );
      }

      context.restore();
    }

    function drawNodes(time: number) {
      if (!scene) return;

      context.save();
      context.globalCompositeOperation = 'lighter';

      for (let index = 0; index < scene.nodes.length; index += 1) {
        const node = scene.nodes[index];
        const x = scene.positions[index * 2];
        const y = scene.positions[index * 2 + 1];
        const pulse =
          0.86 + Math.sin(time * node.rate * 1.7 + node.phase) * 0.14;

        if (node.beacon) {
          const glowRadius = 16 + node.energy * 11;
          const glow = context.createRadialGradient(x, y, 0, x, y, glowRadius);
          glow.addColorStop(
            0,
            `rgba(${EDGE_RGB[node.tone]}, ${0.17 * node.energy * pulse})`,
          );
          glow.addColorStop(1, `rgba(${EDGE_RGB[node.tone]}, 0)`);
          context.fillStyle = glow;
          context.fillRect(
            x - glowRadius,
            y - glowRadius,
            glowRadius * 2,
            glowRadius * 2,
          );

          context.beginPath();
          context.arc(
            x,
            y,
            node.radius * 4.1,
            node.phase + time * node.rate * 0.32,
            node.phase + time * node.rate * 0.32 + Math.PI * 1.18,
          );
          context.lineWidth = 0.65;
          context.strokeStyle = `rgba(${EDGE_RGB[node.tone]}, ${0.31 * node.energy})`;
          context.stroke();
        }

        context.beginPath();
        context.arc(x, y, node.radius * 2.2, 0, TAU);
        context.fillStyle = `rgba(${EDGE_RGB[node.tone]}, ${0.13 + node.energy * 0.18})`;
        context.fill();

        context.beginPath();
        context.arc(x, y, node.radius * pulse, 0, TAU);
        context.fillStyle = `rgba(238, 246, 255, ${0.5 + node.energy * 0.42})`;
        context.fill();
      }

      context.restore();
    }

    function draw(time: number) {
      if (!scene || width < 2 || height < 2) return;

      if (time - pointer.lastMovedAt > 1_350) pointer.targetStrength = 0;
      pointer.x += (pointer.targetX - pointer.x) * 0.055;
      pointer.y += (pointer.targetY - pointer.y) * 0.055;
      pointer.strength +=
        (pointer.targetStrength - pointer.strength) *
        (pointer.targetStrength > pointer.strength ? 0.065 : 0.04);

      context.clearRect(0, 0, width, height);

      const blueX = width * (0.76 + pointer.x * pointer.strength * 0.025);
      const blueY = height * (0.34 + pointer.y * pointer.strength * 0.02);
      const blueRadius = Math.max(width, height) * 0.58;
      const blueGlow = context.createRadialGradient(
        blueX,
        blueY,
        0,
        blueX,
        blueY,
        blueRadius,
      );
      blueGlow.addColorStop(0, 'rgba(32, 93, 255, 0.12)');
      blueGlow.addColorStop(0.38, 'rgba(28, 67, 210, 0.045)');
      blueGlow.addColorStop(1, 'rgba(7, 7, 7, 0)');
      context.fillStyle = blueGlow;
      context.fillRect(0, 0, width, height);

      const violetX = width * 0.62;
      const violetY = height * 0.78;
      const violetRadius = Math.max(width, height) * 0.44;
      const violetGlow = context.createRadialGradient(
        violetX,
        violetY,
        0,
        violetX,
        violetY,
        violetRadius,
      );
      violetGlow.addColorStop(0, 'rgba(117, 58, 255, 0.075)');
      violetGlow.addColorStop(1, 'rgba(7, 7, 7, 0)');
      context.fillStyle = violetGlow;
      context.fillRect(0, 0, width, height);

      updatePositions(time);
      drawContours(time);
      drawEdges(time);
      drawNodes(time);
    }

    function renderFrame(time: number) {
      frameId = null;
      if (!inViewport || !pageVisible || reducedMotion || !scene) return;

      draw(time);
      frameId = window.requestAnimationFrame(renderFrame);
    }

    function requestRender() {
      if (!inViewport || !pageVisible || !scene) return;

      if (reducedMotion) {
        cancelFrame();
        pointer.targetStrength = 0;
        pointer.strength = 0;
        draw(4_200);
        return;
      }

      if (frameId === null) frameId = window.requestAnimationFrame(renderFrame);
    }

    function resize() {
      const bounds = canvas.getBoundingClientRect();
      const nextWidth = Math.round(bounds.width * 10) / 10;
      const nextHeight = Math.round(bounds.height * 10) / 10;
      if (nextWidth < 2 || nextHeight < 2) return;
      if (nextWidth === width && nextHeight === height && scene) return;

      width = nextWidth;
      height = nextHeight;

      const requestedRatio = window.devicePixelRatio || 1;
      const areaRatio = Math.sqrt(MAX_BACKING_PIXELS / (width * height));
      const pixelRatio = Math.min(
        requestedRatio,
        2,
        areaRatio,
        MAX_BACKING_EDGE / width,
        MAX_BACKING_EDGE / height,
      );
      const backingWidth = Math.max(1, Math.floor(width * pixelRatio));
      const backingHeight = Math.max(1, Math.floor(height * pixelRatio));

      canvas.width = backingWidth;
      canvas.height = backingHeight;
      context.setTransform(
        backingWidth / width,
        0,
        0,
        backingHeight / height,
        0,
        0,
      );
      scene = buildScene(width, height);
      requestRender();
    }

    function handlePointerMove(event: PointerEvent) {
      if (reducedMotion) return;

      const bounds = canvas.getBoundingClientRect();
      const inside =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom;

      if (!inside) {
        pointer.targetStrength = 0;
        return;
      }

      pointer.targetX =
        ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      pointer.targetY =
        ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      pointer.targetStrength = event.pointerType === 'touch' ? 0.72 : 1;
      pointer.lastMovedAt = performance.now();
      requestRender();
    }

    function releasePointer(event: PointerEvent) {
      if (event.pointerType === 'touch') pointer.targetStrength = 0;
    }

    function resetPointer() {
      pointer.targetStrength = 0;
    }

    function handleVisibilityChange() {
      pageVisible = document.visibilityState === 'visible';
      if (pageVisible) requestRender();
      else cancelFrame();
    }

    function handleMotionPreference(event: MediaQueryListEvent) {
      reducedMotion = event.matches;
      if (reducedMotion) cancelFrame();
      requestRender();
    }

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry.isIntersecting;
        if (inViewport) requestRender();
        else cancelFrame();
      },
      { rootMargin: '120px 0px', threshold: 0.01 },
    );

    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    window.addEventListener('pointermove', handlePointerMove, {
      passive: true,
    });
    window.addEventListener('pointerup', releasePointer, { passive: true });
    window.addEventListener('pointercancel', releasePointer, { passive: true });
    window.addEventListener('blur', resetPointer);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    motionQuery.addEventListener('change', handleMotionPreference);

    resize();

    return () => {
      cancelFrame();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', releasePointer);
      window.removeEventListener('pointercancel', releasePointer);
      window.removeEventListener('blur', resetPointer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      motionQuery.removeEventListener('change', handleMotionPreference);
    };
  }, []);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        aria-hidden="true"
      />
    </div>
  );
}
