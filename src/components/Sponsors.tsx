"use client";

const sponsorTiers = [
  {
    tier: "Platinum",
    color: "from-gray-100 to-gray-200",
    borderColor: "border-gray-300",
    sponsors: [
      { name: "Scrum Inc.", initials: "SI" },
      { name: "Cognits", initials: "CG" },
    ],
  },
  {
    tier: "Gold",
    color: "from-gold/10 to-gold/20",
    borderColor: "border-gold/30",
    sponsors: [
      { name: "Agile Alliance", initials: "AA" },
      { name: "Scale Agile Partners", initials: "SA" },
      { name: "TechForward Inc.", initials: "TF" },
    ],
  },
  {
    tier: "Silver",
    color: "from-steel-blue/10 to-steel-blue/20",
    borderColor: "border-steel-blue/30",
    sponsors: [
      { name: "LatAm Digital Hub", initials: "LD" },
      { name: "Lean Institute", initials: "LI" },
      { name: "Global Enterprise Corp", initials: "GE" },
      { name: "Innovation Labs", initials: "IL" },
    ],
  },
];

export default function Sponsors() {
  return (
    <section id="sponsors" className="py-24 bg-light/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-crimson font-semibold text-sm uppercase tracking-widest mb-3">
            Our Partners
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark">
            Event <span className="text-crimson">Sponsors</span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
            We&apos;re grateful to our sponsors for making AgileForum possible.
          </p>
        </div>

        {/* Sponsor tiers */}
        <div className="space-y-12">
          {sponsorTiers.map((tierGroup) => (
            <div key={tierGroup.tier}>
              <h3 className="text-center text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">
                {tierGroup.tier} Sponsors
              </h3>
              <div className="flex flex-wrap justify-center gap-6">
                {tierGroup.sponsors.map((sponsor) => (
                  <div
                    key={sponsor.name}
                    className={`group bg-gradient-to-br ${tierGroup.color} border ${tierGroup.borderColor} rounded-2xl px-10 py-8 flex flex-col items-center justify-center transition-all hover:shadow-lg hover:-translate-y-1 ${
                      tierGroup.tier === "Platinum"
                        ? "min-w-[200px]"
                        : "min-w-[160px]"
                    }`}
                  >
                    <div
                      className={`${
                        tierGroup.tier === "Platinum"
                          ? "w-16 h-16 text-2xl"
                          : "w-12 h-12 text-lg"
                      } rounded-xl bg-white shadow-sm flex items-center justify-center font-bold text-dark mb-3 transition-transform group-hover:scale-110`}
                    >
                      {sponsor.initials}
                    </div>
                    <p
                      className={`font-semibold text-dark ${
                        tierGroup.tier === "Platinum" ? "text-base" : "text-sm"
                      }`}
                    >
                      {sponsor.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Become a sponsor CTA */}
        <div className="text-center mt-16">
          <div className="inline-block bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-dark mb-2">
              Become a Sponsor
            </h3>
            <p className="text-gray-600 text-sm mb-4 max-w-md">
              Showcase your brand to agile leaders worldwide. Contact us for
              sponsorship opportunities.
            </p>
            <a
              href="mailto:info@agileforum.org"
              className="inline-flex items-center rounded-full bg-crimson px-6 py-2.5 text-sm font-semibold text-white hover:bg-crimson-dark transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
