"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Reusable scroll-triggered fade-up ──────────────────────
export function useScrollFadeUp<T extends HTMLElement>(
  options?: { delay?: number; duration?: number; y?: number; stagger?: number }
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const children = el.querySelectorAll("[data-animate]");
    const targets = children.length > 0 ? children : el;

    const ctx = gsap.context(() => {
      gsap.set(targets, { y: options?.y ?? 60, opacity: 0 });
      gsap.to(targets, {
        y: 0,
        opacity: 1,
        duration: options?.duration ?? 0.9,
        delay: options?.delay ?? 0,
        stagger: options?.stagger ?? 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
    });

    return () => ctx.revert();
  }, [options?.delay, options?.duration, options?.y, options?.stagger]);

  return ref;
}

// ─── Stagger children from left/right ───────────────────────
export function useScrollSlideIn<T extends HTMLElement>(
  direction: "left" | "right" = "left",
  options?: { delay?: number; stagger?: number }
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const children = el.querySelectorAll("[data-animate]");
    const targets = children.length > 0 ? children : el;

    const ctx = gsap.context(() => {
      gsap.set(targets, { x: direction === "left" ? -80 : 80, opacity: 0 });
      gsap.to(targets, {
        x: 0,
        opacity: 1,
        duration: 0.8,
        delay: options?.delay ?? 0,
        stagger: options?.stagger ?? 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
    });

    return () => ctx.revert();
  }, [direction, options?.delay, options?.stagger]);

  return ref;
}

// ─── Scale-in with rotation (for cards) ─────────────────────
export function useScrollPopIn<T extends HTMLElement>(
  options?: { delay?: number; stagger?: number }
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const children = el.querySelectorAll("[data-animate]");
    const targets = children.length > 0 ? children : el;

    const ctx = gsap.context(() => {
      gsap.set(targets, { scale: 0.85, opacity: 0, rotation: 2, y: 40 });
      gsap.to(targets, {
        scale: 1,
        opacity: 1,
        rotation: 0,
        y: 0,
        duration: 0.7,
        delay: options?.delay ?? 0,
        stagger: options?.stagger ?? 0.1,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
    });

    return () => ctx.revert();
  }, [options?.delay, options?.stagger]);

  return ref;
}

// ─── Counter animation ──────────────────────────────────────
export function useCountUp(
  endValue: number,
  options?: { duration?: number; suffix?: string }
) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const ctx = gsap.context(() => {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: endValue,
        duration: options?.duration ?? 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          el.textContent = Math.round(obj.val) + (options?.suffix ?? "");
        },
      });
    });

    return () => ctx.revert();
  }, [endValue, options?.duration, options?.suffix]);

  return ref;
}

// ─── Hero timeline (runs on mount, not scroll) ──────────────
export function useHeroTimeline<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const ctx = gsap.context(() => {
      const words = el.querySelectorAll("[data-hero-word]");
      const ctas = el.querySelectorAll("[data-hero-cta]");

      // Set initial hidden state for all animated elements
      gsap.set("[data-hero-logo]", { y: -60, opacity: 0, scale: 0.3 });
      gsap.set("[data-hero-badge]", { y: 20, opacity: 0 });
      gsap.set(words, { y: 80, opacity: 0, rotationX: 40 });
      gsap.set("[data-hero-sub]", { y: 30, opacity: 0 });
      gsap.set("[data-hero-tagline]", { y: 20, opacity: 0 });
      gsap.set(ctas, { y: 30, opacity: 0, scale: 0.9 });
      gsap.set("[data-hero-scroll]", { opacity: 0 });

      // Build the entrance timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Logo: fly in small → overshoot big → shrink back → settle at full size
      tl.to("[data-hero-logo]", {
        y: 0, opacity: 1, scale: 1.25, duration: 0.7,
        ease: "power2.out",
      });
      tl.to("[data-hero-logo]", {
        scale: 0.9, duration: 0.3,
        ease: "power2.inOut",
      });
      tl.to("[data-hero-logo]", {
        scale: 1.08, duration: 0.25,
        ease: "power1.out",
      });
      tl.to("[data-hero-logo]", {
        scale: 1, duration: 0.35,
        ease: "elastic.out(1, 0.5)",
      });

      tl.to("[data-hero-badge]",
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.4"
      );

      tl.to(words, {
        y: 0, opacity: 1, rotationX: 0, duration: 0.8, stagger: 0.08,
      }, "-=0.3");

      tl.to("[data-hero-sub]",
        { y: 0, opacity: 1, duration: 0.7 },
        "-=0.3"
      );

      tl.to("[data-hero-tagline]",
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.3"
      );

      tl.to(ctas, {
        y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.15,
      }, "-=0.2");

      tl.to("[data-hero-scroll]",
        { opacity: 1, duration: 0.8 },
        "-=0.2"
      );

      // After entrance: subtle floating pulse on the logo
      gsap.to("[data-hero-logo]", {
        scale: 1.03,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: tl.duration(),
      });

      // Parallax on hero decorative elements while scrolling
      gsap.to("[data-hero-orb-1]", {
        y: -100,
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
      gsap.to("[data-hero-orb-2]", {
        y: -150,
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
      gsap.to("[data-hero-content]", {
        y: 80,
        opacity: 0.3,
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "60% top",
          scrub: 1,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}
