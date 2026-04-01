"use client";

import type { SpeakerItem } from "@/lib/content";
import { useScrollFadeUp, useScrollPopIn } from "@/lib/animations";

interface SpeakersProps {
  data: SpeakerItem[];
}

export default function Speakers({ data }: SpeakersProps) {
  const headerRef = useScrollFadeUp<HTMLDivElement>();
  const gridRef = useScrollPopIn<HTMLDivElement>({ stagger: 0.12 });

  return (
    <section id="speakers" className="py-24 bg-light/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div ref={headerRef} className="text-center mb-16">
          <p data-animate className="text-crimson font-semibold text-sm uppercase tracking-widest mb-3">
            World-Class Experts
          </p>
          <h2 data-animate className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark">
            Meet Our <span className="text-crimson">Speakers</span>
          </h2>
          <p data-animate className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
            Learn from the brightest minds in agile, lean, and organizational
            transformation.
          </p>
        </div>

        {/* Speakers grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((speaker) => (
            <div
              key={speaker.id}
              data-animate
              className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div
                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${speaker.color} flex items-center justify-center text-white text-2xl font-bold mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3`}
              >
                {speaker.initials}
              </div>
              <h3 className="text-xl font-bold text-dark mb-1">
                {speaker.name}
              </h3>
              <p className="text-crimson font-medium text-sm mb-1">
                {speaker.title}
              </p>
              <p className="text-gray-400 text-sm mb-4">{speaker.company}</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                {speaker.bio}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            More speakers to be announced soon.{" "}
            <a href="#contact" className="text-crimson font-medium hover:underline">
              Stay updated
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
