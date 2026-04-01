"use client";

const courses = [
  {
    title: "Scrum@Scale Practitioner",
    duration: "2 Days",
    level: "Intermediate",
    instructor: "Dr. Jeff Sutherland",
    description:
      "Learn how to scale Scrum across your entire organization. This certification course covers the Scrum@Scale framework for achieving business agility.",
    topics: [
      "Scrum@Scale Framework",
      "Executive Action Team",
      "Scaling the Scrum Master",
      "Organizational Transformation",
    ],
    featured: true,
  },
  {
    title: "Agile Leadership Essentials",
    duration: "1 Day",
    level: "All Levels",
    instructor: "Maria Rodriguez",
    description:
      "Develop the mindset and skills needed to lead agile teams and drive organizational change effectively.",
    topics: [
      "Servant Leadership",
      "Change Management",
      "Team Empowerment",
      "Metrics That Matter",
    ],
    featured: false,
  },
  {
    title: "Product Owner Masterclass",
    duration: "1 Day",
    level: "Advanced",
    instructor: "Sarah Chen",
    description:
      "Master the art of product ownership with advanced techniques for backlog management, stakeholder alignment, and value delivery.",
    topics: [
      "Value-Driven Development",
      "Stakeholder Management",
      "Release Planning",
      "Product Metrics",
    ],
    featured: false,
  },
];

export default function Courses() {
  return (
    <section id="courses" className="py-24 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-crimson font-semibold text-sm uppercase tracking-widest mb-3">
            Level Up Your Skills
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark">
            Certification <span className="text-crimson">Courses</span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
            Hands-on workshops and certification courses taught by world-class
            instructors.
          </p>
        </div>

        {/* Courses */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div
              key={index}
              className={`relative rounded-2xl overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 ${
                course.featured
                  ? "bg-gradient-to-br from-crimson to-crimson-dark text-white ring-2 ring-crimson/20"
                  : "bg-light border border-gray-200"
              }`}
            >
              {course.featured && (
                <div className="absolute top-4 right-4 bg-gold text-dark text-xs font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              <div className="p-8">
                {/* Meta */}
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      course.featured
                        ? "bg-white/20 text-white"
                        : "bg-crimson/10 text-crimson"
                    }`}
                  >
                    {course.duration}
                  </span>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      course.featured
                        ? "bg-white/20 text-white"
                        : "bg-gold/10 text-gold"
                    }`}
                  >
                    {course.level}
                  </span>
                </div>

                <h3
                  className={`text-xl font-bold mb-2 ${
                    course.featured ? "text-white" : "text-dark"
                  }`}
                >
                  {course.title}
                </h3>
                <p
                  className={`text-sm mb-1 font-medium ${
                    course.featured ? "text-gold" : "text-crimson"
                  }`}
                >
                  {course.instructor}
                </p>
                <p
                  className={`text-sm leading-relaxed mb-6 ${
                    course.featured ? "text-white/80" : "text-gray-600"
                  }`}
                >
                  {course.description}
                </p>

                {/* Topics */}
                <div className="space-y-2 mb-8">
                  {course.topics.map((topic) => (
                    <div key={topic} className="flex items-center gap-2">
                      <svg
                        className={`w-4 h-4 flex-shrink-0 ${
                          course.featured ? "text-gold" : "text-crimson"
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
                          course.featured ? "text-white/80" : "text-gray-600"
                        }`}
                      >
                        {topic}
                      </span>
                    </div>
                  ))}
                </div>

                <a
                  href="#tickets"
                  className={`block w-full text-center rounded-full px-6 py-3 font-semibold text-sm transition-all ${
                    course.featured
                      ? "bg-white text-crimson hover:bg-gold hover:text-dark"
                      : "bg-crimson text-white hover:bg-crimson-dark"
                  }`}
                >
                  Enroll Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
