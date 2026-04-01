"use client";

import { useScrollFadeUp, useScrollPopIn, useCountUp } from "@/lib/animations";

function AnimatedStat({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const ref = useCountUp(value, { suffix, duration: 2.2 });

  return (
    <div className="text-center">
      <p
        ref={ref as React.RefObject<HTMLParagraphElement>}
        className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-gold to-orange bg-clip-text text-transparent"
      >
        0{suffix}
      </p>
      <p className="mt-2 text-steel-blue text-sm">{label}</p>
    </div>
  );
}

const stats = [
  { value: 500, suffix: "+", label: "Attendees Expected" },
  { value: 20, suffix: "+", label: "Countries Represented" },
  { value: 30, suffix: "+", label: "Expert Sessions" },
  { value: 50, suffix: "+", label: "Companies" },
];

const attendeeTypes = [
  {
    title: "Executives & C-Suite",
    description:
      "CEOs, CTOs, and VPs looking to drive organizational agility from the top.",
    icon: "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0",
  },
  {
    title: "Agile Coaches & Scrum Masters",
    description:
      "Practitioners advancing their craft and learning the latest methodologies.",
    icon: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
  },
  {
    title: "Product & Engineering Leaders",
    description:
      "Building better products through agile development and lean principles.",
    icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5",
  },
  {
    title: "Entrepreneurs & Innovators",
    description:
      "Startup founders and innovators seeking agile frameworks for rapid growth.",
    icon: "M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18",
  },
];

export default function Attendees() {
  const headerRef = useScrollFadeUp<HTMLDivElement>();
  const cardsRef = useScrollPopIn<HTMLDivElement>({ stagger: 0.15 });

  return (
    <section id="attendees" className="py-24 bg-dark/90 backdrop-blur-sm text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat) => (
            <AnimatedStat
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </div>

        {/* Section header */}
        <div ref={headerRef} className="text-center mb-16">
          <p data-animate className="text-gold font-semibold text-sm uppercase tracking-widest mb-3">
            Who Attends
          </p>
          <h2 data-animate className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Built for <span className="text-gold">Leaders</span> &{" "}
            <span className="text-crimson">Practitioners</span>
          </h2>
        </div>

        {/* Attendee types */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {attendeeTypes.map((type) => (
            <div
              key={type.title}
              data-animate
              className="group p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-crimson/30 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-crimson/20 flex items-center justify-center text-crimson mb-4 group-hover:bg-crimson group-hover:text-white transition-all">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={type.icon}
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {type.title}
              </h3>
              <p className="text-steel-blue text-sm leading-relaxed">
                {type.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
