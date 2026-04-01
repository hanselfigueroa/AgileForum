"use client";

import type { EventItem } from "@/lib/content";
import { useScrollFadeUp, useScrollPopIn } from "@/lib/animations";

interface EventsProps {
  data: EventItem[];
}

export default function Events({ data }: EventsProps) {
  const headerRef = useScrollFadeUp<HTMLDivElement>();
  const gridRef = useScrollPopIn<HTMLDivElement>({ stagger: 0.2 });

  return (
    <section id="events" className="py-24 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div ref={headerRef} className="text-center mb-16">
          <p data-animate className="text-crimson font-semibold text-sm uppercase tracking-widest mb-3">
            Global Events
          </p>
          <h2 data-animate className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark">
            Participate in an Upcoming{" "}
            <span className="text-crimson">AgileForum</span>
          </h2>
          <p data-animate className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
            Join thought leaders and practitioners from around the world at our
            upcoming events.
          </p>
        </div>

        {/* Events grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.map((event) => (
            <div
              key={event.id}
              data-animate
              className={`group relative rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                event.highlight
                  ? "md:col-span-2 bg-gradient-to-br from-dark via-dark to-crimson text-white"
                  : "bg-light border border-gray-200"
              }`}
            >
              {event.highlight && (
                <div className="absolute top-4 right-4 bg-gold text-dark text-xs font-bold px-3 py-1 rounded-full">
                  FEATURED
                </div>
              )}
              <div className="p-8 sm:p-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{event.flag}</span>
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        event.highlight ? "text-gold" : "text-crimson"
                      }`}
                    >
                      {event.date}
                    </p>
                    <p
                      className={`text-sm ${
                        event.highlight ? "text-steel-blue" : "text-gray-500"
                      }`}
                    >
                      {event.location}
                    </p>
                  </div>
                </div>
                <h3
                  className={`text-2xl sm:text-3xl font-bold mb-4 ${
                    event.highlight ? "text-white" : "text-dark"
                  }`}
                >
                  {event.title}
                </h3>
                <p
                  className={`leading-relaxed mb-6 ${
                    event.highlight ? "text-steel-blue/80" : "text-gray-600"
                  }`}
                >
                  {event.description}
                </p>
                <a
                  href={event.link || "#tickets"}
                  target={event.link?.startsWith("http") ? "_blank" : undefined}
                  rel={event.link?.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`inline-flex items-center gap-2 font-semibold text-sm transition-all group-hover:gap-3 ${
                    event.highlight
                      ? "text-gold hover:text-white"
                      : "text-crimson hover:text-crimson-dark"
                  }`}
                >
                  Learn More
                  <svg
                    className="w-4 h-4"
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
