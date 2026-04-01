"use client";

const tickets = [
  {
    name: "Conference Pass",
    price: "$399",
    description: "Full access to Day 1 conference sessions",
    features: [
      "All keynote sessions",
      "Breakout sessions",
      "Networking events",
      "Lunch & refreshments",
      "Sponsor expo access",
    ],
    featured: false,
  },
  {
    name: "Full Access Pass",
    price: "$799",
    description: "Conference + Workshop certification courses",
    features: [
      "Everything in Conference Pass",
      "Day 2 workshop access",
      "Certification course",
      "Workshop materials",
      "Priority seating",
      "VIP networking reception",
    ],
    featured: true,
  },
  {
    name: "Corporate Package",
    price: "Custom",
    description: "For teams of 5+ attendees",
    features: [
      "Everything in Full Access",
      "Group discount pricing",
      "Dedicated account manager",
      "Custom invoice & billing",
      "Reserved team seating",
      "Post-event recordings",
    ],
    featured: false,
  },
];

export default function Tickets() {
  return (
    <section
      id="tickets"
      className="py-24 bg-gradient-to-br from-dark via-dark to-crimson text-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-3">
            Secure Your Spot
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Get Your <span className="text-gold">Tickets</span>
          </h2>
          <p className="mt-4 text-steel-blue/80 max-w-2xl mx-auto text-lg">
            Early bird pricing available for a limited time. Don&apos;t miss
            out!
          </p>
        </div>

        {/* Tickets grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tickets.map((ticket) => (
            <div
              key={ticket.name}
              className={`relative rounded-2xl p-8 transition-all hover:-translate-y-1 ${
                ticket.featured
                  ? "bg-white text-dark shadow-2xl shadow-white/10 scale-105"
                  : "bg-white/10 backdrop-blur-sm border border-white/20"
              }`}
            >
              {ticket.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-dark text-xs font-bold px-4 py-1 rounded-full">
                  BEST VALUE
                </div>
              )}
              <h3
                className={`text-lg font-bold mb-1 ${
                  ticket.featured ? "text-dark" : "text-white"
                }`}
              >
                {ticket.name}
              </h3>
              <p
                className={`text-sm mb-4 ${
                  ticket.featured ? "text-gray-500" : "text-steel-blue/60"
                }`}
              >
                {ticket.description}
              </p>
              <p
                className={`text-4xl font-extrabold mb-6 ${
                  ticket.featured ? "text-crimson" : "text-gold"
                }`}
              >
                {ticket.price}
              </p>

              <ul className="space-y-3 mb-8">
                {ticket.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <svg
                      className={`w-4 h-4 flex-shrink-0 ${
                        ticket.featured ? "text-crimson" : "text-gold"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    <span
                      className={`text-sm ${
                        ticket.featured ? "text-gray-600" : "text-white/80"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="mailto:info@agileforum.org?subject=Ticket%20Inquiry"
                className={`block w-full text-center rounded-full px-6 py-3 font-semibold text-sm transition-all ${
                  ticket.featured
                    ? "bg-crimson text-white hover:bg-crimson-dark shadow-lg shadow-crimson/30"
                    : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
                }`}
              >
                {ticket.price === "Custom"
                  ? "Contact Us"
                  : "Buy Now"}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
