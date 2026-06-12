import React, { useEffect, useRef } from 'react';
import { useTransition } from '../context/TransitionContext.tsx';

interface Point {
  x: number;
  y: number;
  originX: number;
  originY: number;
  alpha: number;
  targetAlpha: number;
  delay: number;
}

export default function TextHeart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { phase } = useTransition();

  // Expose collapse progress to the canvas loop via ref
  const collapsingRef = useRef(false);
  const collapseStartRef = useRef<number | null>(null);
  const COLLAPSE_DURATION = 1400; // ms — matches T_HEART_COLLAPSE in PageTransition

  useEffect(() => {
    if (phase === 'heart-collapse' || phase === 'overlay-in' || phase === 'terminal' || phase === 'done') {
      collapsingRef.current = true;
      collapseStartRef.current = null; // will be set on next frame
    } else {
      collapsingRef.current = false;
      collapseStartRef.current = null;
    }
  }, [phase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let points: Point[] = [];

    const text = 'i love you';
    const fontSize = 14;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initPoints();
    };

    const initPoints = () => {
      points = [];
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = Math.min(canvas.width, canvas.height) / 45;

      // Outer heart
      for (let t = 0; t < Math.PI * 2; t += 0.05) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        const px = centerX + x * scale;
        const py = centerY + y * scale;
        points.push({ x: px, y: py, originX: px, originY: py, alpha: 0, targetAlpha: 0.85 + Math.random() * 0.15, delay: Math.random() * 1800 });
      }

      // Inner layers
      for (let s = 0.2; s < 1; s += 0.2) {
        for (let t = 0; t < Math.PI * 2; t += 0.1) {
          const x = 16 * Math.pow(Math.sin(t), 3);
          const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
          const px = centerX + x * scale * s;
          const py = centerY + y * scale * s;
          points.push({ x: px, y: py, originX: px, originY: py, alpha: 0, targetAlpha: 0.35 + Math.random() * 0.45, delay: Math.random() * 2500 });
        }
      }
    };

    let start: number | null = null;

    const draw = (time: number) => {
      if (!start) start = time;
      const elapsed = time - start;

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px "Fira Code", monospace`;
      const textW = ctx.measureText(text).width;

      const isCollapsing = collapsingRef.current;

      if (isCollapsing && collapseStartRef.current === null) {
        collapseStartRef.current = time;
      }

      const collapseElapsed = isCollapsing && collapseStartRef.current !== null
        ? time - collapseStartRef.current
        : 0;

      // easeInCubic for collapse — feels like particles being "sucked in"
      const rawProgress = Math.min(collapseElapsed / COLLAPSE_DURATION, 1);
      const collapseProgress = rawProgress * rawProgress * rawProgress;

      points.forEach((p) => {
        // Normal appear phase
        if (!isCollapsing && elapsed > p.delay) {
          p.alpha += (p.targetAlpha - p.alpha) * 0.02;
        }

        if (isCollapsing) {
          // Move toward center while fading out
          p.x = p.originX + (cx - p.originX) * collapseProgress;
          p.y = p.originY + (cy - p.originY) * collapseProgress;
          p.alpha = p.targetAlpha * (1 - collapseProgress * 1.2);
          if (p.alpha < 0) p.alpha = 0;
        }

        if (p.alpha <= 0) return;

        ctx.fillStyle = `rgba(255,77,109,${p.alpha})`;
        ctx.fillText(text, p.x - textW / 2, p.y);
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        // No CSS opacity/scale tricks — the canvas loop handles everything
      }}
    />
  );
}
