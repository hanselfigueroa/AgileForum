"use client";

import { useState } from "react";

const days = [
  {
    label: "Day 1",
    date: "Conference Day",
    sessions: [
      {
        time: "8:00 AM",
        title: "Registration & Welcome Coffee",
        speaker: "",
        type: "break",
        description: "Check-in, badge pickup, and networking breakfast.",
      },
      {
        time: "9:00 AM",
        title: "Opening Keynote: The Future of Agile Organizations",
        speaker: "Dr. Jeff Sutherland",
        type: "keynote",
        description:
          "A visionary look at how agile principles are reshaping businesses for the next decade.",
      },
      {
        time: "10:15 AM",
        title: "Scaling Agile Across the Enterprise",
        speaker: "Emma Williams",
        type: "session",
        description:
          "Practical strategies for implementing agile practices at scale in complex organizational structures.",
      },
      {
        time: "11:15 AM",
        title: "Lean-Agile: Bridging Manufacturing and Tech",
        speaker: "Takeshi Yamamoto",
        type: "session",
        description:
          "How lean principles from manufacturing enhance modern agile software development practices.",
      },
      {
        time: "12:15 PM",
        title: "Networking Lunch",
        speaker: "",
        type: "break",
        description:
          "Connect with fellow attendees, speakers, and sponsors over a curated lunch experience.",
      },
      {
        time: "1:30 PM",
        title: "Innovation Through Agile Product Development",
        speaker: "Sarah Chen",
        type: "session",
        description:
          "Driving product innovation using agile methodologies and customer-centric development approaches.",
      },
      {
        time: "2:30 PM",
        title: "Agile Transformation in Latin America",
        speaker: "Carlos Mendez",
        type: "session",
        description:
          "Success stories and lessons learned from agile adoption across Latin American enterprises.",
      },
      {
        time: "3:30 PM",
        title: "Afternoon Break & Expo",
        speaker: "",
        type: "break",
        description: "Visit sponsor booths and explore the latest agile tools.",
      },
      {
        time: "4:00 PM",
        title: "Panel: Leading Organizational Change",
        speaker: "Maria Rodriguez & Panel",
        type: "keynote",
        description:
          "An interactive panel discussion on driving cultural change in traditional organizations.",
      },
      {
        time: "5:30 PM",
        title: "Closing Remarks & Evening Reception",
        speaker: "",
        type: "break",
        description:
          "Wrap-up of the day's learnings followed by a cocktail reception and networking.",
      },
    ],
  },
  {
    label: "Day 2",
    date: "Workshop Day",
    sessions: [
      {
        time: "8:30 AM",
        title: "Morning Coffee & Networking",
        speaker: "",
        type: "break",
        description: "Start the day connecting with peers.",
      },
      {
        time: "9:00 AM",
        title: "Workshop: Scrum@Scale Practitioner",
        speaker: "Dr. Jeff Sutherland",
        type: "keynote",
        description:
          "A hands-on workshop on implementing Scrum@Scale for organizational agility.",
      },
      {
        time: "12:00 PM",
        title: "Lunch Break",
        speaker: "",
        type: "break",
        description: "Refuel and network.",
      },
      {
        time: "1:00 PM",
        title: "Workshop: Agile Leadership Masterclass",
        speaker: "Maria Rodriguez",
        type: "session",
        description:
          "Develop the leadership skills needed to drive and sustain agile transformations.",
      },
      {
        time: "4:00 PM",
        title: "Certificates & Closing Ceremony",
        speaker: "",
        type: "break",
        description:
          "Workshop certificates ceremony and farewell gathering.",
      },
    ],
  },
];

const typeStyles: Record<string, string> = {
  keynote: "border-l-crimson bg-crimson/5",
  session: "border-l-gold bg-gold/5",
  break: "border-l-steel-blue bg-steel-blue/5",
};

const typeBadge: Record<string, { label: string; style: string }> = {
  keynote: {
    label: "Keynote",
    style: "bg-crimson/10 text-crimson",
  },
  session: {
    label: "Session",
    style: "bg-gold/10 text-gold",
  },
  break: {
    label: "Break",
    style: "bg-steel-blue/10 text-steel-blue",
  },
};

export default function Agenda() {
  const [activeDay, setActiveDay] = useState(0);

  return (
    <section id="agenda" className="py-24 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-crimson font-semibold text-sm uppercase tracking-widest mb-3">
            Event Schedule
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark">
            Conference <span className="text-crimson">Agenda</span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
            Two days packed with insights, workshops, and networking
            opportunities.
          </p>
        </div>

        {/* Day tabs */}
        <div className="flex justify-center gap-4 mb-12">
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => setActiveDay(index)}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                activeDay === index
                  ? "bg-crimson text-white shadow-lg shadow-crimson/30"
                  : "bg-light text-gray-600 hover:bg-gray-200"
              }`}
            >
              {day.label}
              <span className="hidden sm:inline"> &mdash; {day.date}</span>
            </button>
          ))}
        </div>

        {/* Sessions */}
        <div className="space-y-4">
          {days[activeDay].sessions.map((session, index) => (
            <div
              key={index}
              className={`rounded-xl border-l-4 p-6 transition-all hover:shadow-md ${
                typeStyles[session.type]
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="sm:w-24 flex-shrink-0">
                  <span className="text-sm font-bold text-dark">
                    {session.time}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-dark">
                      {session.title}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        typeBadge[session.type].style
                      }`}
                    >
                      {typeBadge[session.type].label}
                    </span>
                  </div>
                  {session.speaker && (
                    <p className="text-crimson text-sm font-medium mb-2">
                      {session.speaker}
                    </p>
                  )}
                  <p className="text-gray-600 text-sm">{session.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
