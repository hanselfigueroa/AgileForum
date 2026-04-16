"use client";

import Image from "next/image";
import type { HeroContent } from "@/lib/content";
import { useHeroTimeline } from "@/lib/animations";

interface HeroProps {
  data: HeroContent;
  showAgendaButton?: boolean;
}

export default function Hero({ data, showAgendaButton = true }: HeroProps) {
  const sectionRef = useHeroTimeline<HTMLElement>();

  const ticketsHref = data.ticketsLink || "#tickets";

  // Split heading into words, marking the highlight word
  const words = data.heading.split(" ");
  const highlightWords = data.headingHighlight.split(" ");

  return (
    <section
      ref={sectionRef}
      id="info"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, #171616 20%, #B12945 100%)",
        }}
      />

      {/* Animated decorative orbs with parallax — hidden on mobile: stacked blur-3xl
          layers over an animating canvas starves rAF on iOS Safari and stretches GSAP
          tweens into slow-motion. */}
      <div className="absolute inset-0 overflow-hidden hidden md:block">
        <div
          data-hero-orb-1
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-crimson/10 rounded-full blur-3xl"
        />
        <div
          data-hero-orb-2
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/10 rounded-full blur-3xl"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-steel-blue/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div
        data-hero-content
        className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center"
      >
        {/* Logo */}
        <div data-hero-logo className="mb-8 flex justify-center">
          <Image
            src={data.heroLogo || "/logo.svg"}
            alt="AgileForum 2026"
            width={280}
            height={140}
            priority
            className="w-[240px] sm:w-[280px] md:w-[320px] h-auto md:drop-shadow-2xl"
          />
        </div>

        {/* Badge */}
        <div
          data-hero-badge
          className="mb-6 inline-flex items-center rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-sm text-gold"
        >
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-gold animate-pulse" />
          {data.badge}
        </div>

        {/* Heading - word by word */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight [perspective:600px]">
          {words.map((word, i) => {
            const isHighlight = highlightWords.includes(word);
            return (
              <span
                key={i}
                data-hero-word
                className={`inline-block mr-[0.25em] ${
                  isHighlight
                    ? "bg-gradient-to-r from-gold via-orange to-crimson bg-clip-text text-transparent"
                    : ""
                }`}
              >
                {word}
              </span>
            );
          })}
        </h1>

        {/* Subheading */}
        <p
          data-hero-sub
          className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-steel-blue/90 leading-relaxed"
        >
          {data.subheading}
        </p>

        {/* Tagline */}
        <p
          data-hero-tagline
          className="mt-4 text-white/60 text-base italic max-w-2xl mx-auto"
        >
          {data.tagline}
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            data-hero-cta
            href={ticketsHref}
            target={ticketsHref.startsWith("http") ? "_blank" : undefined}
            rel={
              ticketsHref.startsWith("http")
                ? "noopener noreferrer"
                : undefined
            }
            className="group inline-flex items-center rounded-full bg-crimson px-8 py-4 text-lg font-semibold text-white shadow-2xl shadow-crimson/30 transition-all hover:bg-white hover:text-crimson hover:shadow-white/20 hover:scale-105"
          >
            Get Your Tickets
            <svg
              className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </a>
          {showAgendaButton && (
            <a
              data-hero-cta
              href="#agenda"
              className="inline-flex items-center rounded-full border-2 border-white/30 px-8 py-4 text-lg font-semibold text-white transition-all hover:border-white hover:bg-white/10"
            >
              View Agenda
            </a>
          )}
        </div>

        {/* Scroll indicator */}
        <div data-hero-scroll className="mt-16 animate-bounce">
          <svg
            className="w-6 h-6 mx-auto text-white/40"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
