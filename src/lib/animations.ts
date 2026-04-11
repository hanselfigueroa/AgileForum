"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Helpers ───────────────────────────────────────────────
function prefersReducedMotion() {
  return typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isMobile() {
  return typeof window !== "undefined" && window.innerWidth < 768;
}

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

    if (prefersReducedMotion()) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    const mobile = isMobile();
    const ctx = gsap.context(() => {
      gsap.set(targets, { y: mobile ? 30 : (options?.y ?? 60), opacity: 0 });
      gsap.to(targets, {
        y: 0,
        opacity: 1,
        duration: mobile ? 0.5 : (options?.duration ?? 0.9),
        delay: options?.delay ?? 0,
        stagger: mobile ? 0.08 : (options?.stagger ?? 0.15),
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 92%",
          toggleActions: "play none none none",
        },
      });
    });

    // Refresh ScrollTrigger after layout settles (fixes mobile viewport issues)
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
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

    if (prefersReducedMotion()) {
      gsap.set(targets, { opacity: 1, x: 0 });
      return;
    }

    const mobile = isMobile();
    const xOffset = mobile ? 40 : 80;
    const ctx = gsap.context(() => {
      gsap.set(targets, { x: direction === "left" ? -xOffset : xOffset, opacity: 0 });
      gsap.to(targets, {
        x: 0,
        opacity: 1,
        duration: mobile ? 0.5 : 0.8,
        delay: options?.delay ?? 0,
        stagger: mobile ? 0.06 : (options?.stagger ?? 0.12),
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 92%",
          toggleActions: "play none none none",
        },
      });
    });

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
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

    if (prefersReducedMotion()) {
      gsap.set(targets, { opacity: 1, scale: 1, rotation: 0, y: 0 });
      return;
    }

    const mobile = isMobile();
    const ctx = gsap.context(() => {
      gsap.set(targets, {
        scale: mobile ? 0.95 : 0.85,
        opacity: 0,
        rotation: mobile ? 0 : 2,
        y: mobile ? 20 : 40,
      });
      gsap.to(targets, {
        scale: 1,
        opacity: 1,
        rotation: 0,
        y: 0,
        duration: mobile ? 0.5 : 0.7,
        delay: options?.delay ?? 0,
        stagger: mobile ? 0.06 : (options?.stagger ?? 0.1),
        ease: mobile ? "power3.out" : "back.out(1.4)",
        scrollTrigger: {
          trigger: el,
          start: "top 92%",
          toggleActions: "play none none none",
        },
      });
    });

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
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

    if (prefersReducedMotion()) {
      el.textContent = endValue + (options?.suffix ?? "");
      return;
    }

    const ctx = gsap.context(() => {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: endValue,
        duration: isMobile() ? 1.2 : (options?.duration ?? 2),
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 92%",
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          el.textContent = Math.round(obj.val) + (options?.suffix ?? "");
        },
      });
    });

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [endValue, options?.duration, options?.suffix]);

  return ref;
}

// ─── Hero timeline (runs on mount, not scroll) ──────────────
export function useHeroTimeline<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    // Query all targets scoped to the hero section
    const logo = el.querySelector("[data-hero-logo]");
    const badge = el.querySelector("[data-hero-badge]");
    const words = el.querySelectorAll("[data-hero-word]");
    const sub = el.querySelector("[data-hero-sub]");
    const tagline = el.querySelector("[data-hero-tagline]");
    const ctas = el.querySelectorAll("[data-hero-cta]");
    const scroll = el.querySelector("[data-hero-scroll]");
    const orb1 = el.querySelector("[data-hero-orb-1]");
    const orb2 = el.querySelector("[data-hero-orb-2]");
    const content = el.querySelector("[data-hero-content]");

    if (prefersReducedMotion()) {
      // Show everything immediately
      gsap.set([logo, badge, sub, tagline, scroll], { opacity: 1, y: 0, scale: 1 });
      gsap.set(words, { opacity: 1, y: 0, rotationX: 0 });
      gsap.set(ctas, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    const mobile = isMobile();

    const ctx = gsap.context(() => {
      // Set initial hidden state — scoped selectors
      gsap.set(logo, { y: mobile ? -30 : -60, opacity: 0, scale: mobile ? 0.7 : 0.3 });
      gsap.set(badge, { y: 15, opacity: 0 });
      gsap.set(words, { y: mobile ? 30 : 80, opacity: 0, rotationX: mobile ? 0 : 40 });
      gsap.set(sub, { y: 20, opacity: 0 });
      gsap.set(tagline, { y: 15, opacity: 0 });
      gsap.set(ctas, { y: 20, opacity: 0, scale: 0.95 });
      gsap.set(scroll, { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (mobile) {
        // Simplified logo animation for mobile — no multi-step bounce
        tl.to(logo, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" });
      } else {
        // Logo: fly in small → overshoot big → shrink back → settle at full size
        tl.to(logo, { y: 0, opacity: 1, scale: 1.25, duration: 0.7, ease: "power2.out" });
        tl.to(logo, { scale: 0.9, duration: 0.3, ease: "power2.inOut" });
        tl.to(logo, { scale: 1.08, duration: 0.25, ease: "power1.out" });
        tl.to(logo, { scale: 1, duration: 0.35, ease: "elastic.out(1, 0.5)" });
      }

      tl.to(badge, { y: 0, opacity: 1, duration: mobile ? 0.4 : 0.6 }, "-=0.3");

      tl.to(words, {
        y: 0, opacity: 1, rotationX: 0,
        duration: mobile ? 0.5 : 0.8,
        stagger: mobile ? 0.04 : 0.08,
      }, "-=0.3");

      tl.to(sub, { y: 0, opacity: 1, duration: mobile ? 0.4 : 0.7 }, "-=0.3");
      tl.to(tagline, { y: 0, opacity: 1, duration: mobile ? 0.3 : 0.6 }, "-=0.3");

      tl.to(ctas, {
        y: 0, opacity: 1, scale: 1,
        duration: mobile ? 0.4 : 0.6,
        stagger: mobile ? 0.08 : 0.15,
      }, "-=0.2");

      tl.to(scroll, { opacity: 1, duration: 0.5 }, "-=0.2");

      // After entrance: subtle floating pulse on the logo (skip on mobile for perf)
      if (!mobile) {
        gsap.to(logo, {
          scale: 1.03,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: tl.duration(),
        });
      }

      // Parallax effects (skip on mobile — scrub animations cause jank with momentum scroll)
      if (!mobile) {
        gsap.to(orb1, {
          y: -100,
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 1 },
        });
        gsap.to(orb2, {
          y: -150,
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 1 },
        });
        gsap.to(content, {
          y: 80, opacity: 0.3,
          scrollTrigger: { trigger: el, start: "top top", end: "60% top", scrub: 1 },
        });
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}
