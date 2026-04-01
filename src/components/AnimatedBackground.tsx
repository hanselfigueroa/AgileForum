"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  radius: number;
  baseVx: number;
  baseVy: number;
  vx: number;
  vy: number;
  color: string;
  opacity: number;
  pulseSpeed: number;
  pulsePhase: number;
}

const COLORS = [
  "177, 41, 69",   // crimson
  "157, 184, 200", // steel-blue
  "204, 179, 99",  // gold
  "228, 141, 48",  // orange
  "169, 186, 157", // sage
  "205, 220, 235", // accent-blue
];

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;

    function resize() {
      if (!canvas) return;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    }

    function init() {
      const count = Math.max(14, Math.floor((w * h) / 50000));
      particlesRef.current = Array.from({ length: count }, () => {
        const vx = (Math.random() - 0.5) * 0.4;
        const vy = (Math.random() - 0.5) * 0.3;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          radius: 100 + Math.random() * 300,
          baseVx: vx,
          baseVy: vy,
          vx,
          vy,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          opacity: 0.06 + Math.random() * 0.10,
          pulseSpeed: 0.4 + Math.random() * 0.8,
          pulsePhase: Math.random() * Math.PI * 2,
        };
      });
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      const t = performance.now() * 0.001;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const p of particlesRef.current) {
        // Slow organic drift with sine wave wobble
        p.x += p.vx + Math.sin(t * 0.3 + p.pulsePhase) * 0.15;
        p.y += p.vy + Math.cos(t * 0.25 + p.pulsePhase) * 0.12;

        // Mouse interaction - orbs gently attracted then repelled
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 400 && dist > 0) {
          const push = ((400 - dist) / 400) * 0.12;
          p.vx += (dx / dist) * push;
          p.vy += (dy / dist) * push;
        }

        // Return to base velocity slowly
        p.vx += (p.baseVx - p.vx) * 0.005;
        p.vy += (p.baseVy - p.vy) * 0.005;

        // Dampen
        p.vx *= 0.998;
        p.vy *= 0.998;

        // Wrap around
        if (p.x < -p.radius * 1.5) p.x = w + p.radius;
        if (p.x > w + p.radius * 1.5) p.x = -p.radius;
        if (p.y < -p.radius * 1.5) p.y = h + p.radius;
        if (p.y > h + p.radius * 1.5) p.y = -p.radius;

        // Smooth pulse
        const pulse = Math.sin(t * p.pulseSpeed + p.pulsePhase) * 0.4 + 0.6;
        const alpha = p.opacity * pulse;
        const r = p.radius * (0.85 + pulse * 0.15);

        // Draw soft glowing orb
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        grad.addColorStop(0, `rgba(${p.color}, ${alpha})`);
        grad.addColorStop(0.3, `rgba(${p.color}, ${alpha * 0.6})`);
        grad.addColorStop(0.6, `rgba(${p.color}, ${alpha * 0.2})`);
        grad.addColorStop(1, `rgba(${p.color}, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Draw connecting lines between nearby particles
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const ddx = a.x - b.x;
          const ddy = a.y - b.y;
          const d = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d < 350) {
            const lineAlpha = (1 - d / 350) * 0.06;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${a.color}, ${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      frameRef.current = requestAnimationFrame(draw);
    }

    function onMouse(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }

    function onMouseLeave() {
      mouseRef.current = { x: -9999, y: -9999 };
    }

    resize();
    init();
    draw();

    window.addEventListener("resize", () => {
      resize();
      init();
    });
    window.addEventListener("mousemove", onMouse);
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[1]"
      aria-hidden="true"
    />
  );
}
