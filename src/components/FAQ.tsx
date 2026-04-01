"use client";

import { useState } from "react";
import type { FAQItem } from "@/lib/content";
import { useScrollFadeUp, useScrollSlideIn } from "@/lib/animations";

interface FAQProps {
  data: FAQItem[];
}

export default function FAQ({ data }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const headerRef = useScrollFadeUp<HTMLDivElement>();
  const listRef = useScrollSlideIn<HTMLDivElement>("left", { stagger: 0.08 });

  return (
    <section id="faq" className="py-24 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div ref={headerRef} className="text-center mb-16">
          <p data-animate className="text-crimson font-semibold text-sm uppercase tracking-widest mb-3">
            Have Questions?
          </p>
          <h2 data-animate className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark">
            Frequently Asked{" "}
            <span className="text-crimson">Questions</span>
          </h2>
        </div>

        {/* FAQ items */}
        <div ref={listRef} className="space-y-3">
          {data.map((faq, index) => (
            <div
              key={faq.id}
              data-animate
              className="rounded-xl border border-gray-200 overflow-hidden transition-all hover:border-crimson/30"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-semibold text-dark pr-4">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-crimson flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
              <div
                className={`transition-all duration-300 ${
                  openIndex === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                } overflow-hidden`}
              >
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
