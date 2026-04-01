"use client";

import { useState } from "react";
import { useScrollSlideIn } from "@/lib/animations";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const leftRef = useScrollSlideIn<HTMLDivElement>("left");
  const rightRef = useScrollSlideIn<HTMLDivElement>("right", { delay: 0.15 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Something went wrong");
        setStatus("error");
        setTimeout(() => setStatus("idle"), 4000);
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <section id="contact" className="py-24 bg-light/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left side - Info */}
          <div ref={leftRef}>
            <p data-animate className="text-crimson font-semibold text-sm uppercase tracking-widest mb-3">
              Get in Touch
            </p>
            <h2 data-animate className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark mb-6">
              Contact <span className="text-crimson">Us</span>
            </h2>
            <p data-animate className="text-gray-600 text-lg leading-relaxed mb-8">
              Have a question about AgileForum 2026? Want to explore sponsorship
              or speaking opportunities? We&apos;d love to hear from you.
            </p>

            <div className="space-y-6">
              <div data-animate className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-crimson/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-crimson" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-dark">Email</h3>
                  <a href="mailto:info@agileforum.org" className="text-crimson hover:underline">
                    info@agileforum.org
                  </a>
                </div>
              </div>

              <div data-animate className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-crimson/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-crimson" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-dark">Location</h3>
                  <p className="text-gray-600">San Jos&eacute;, Costa Rica</p>
                </div>
              </div>

              <div data-animate className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-crimson/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-crimson" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-dark">LinkedIn</h3>
                  <a href="https://www.linkedin.com/company/agile-forum/" target="_blank" rel="noopener noreferrer" className="text-crimson hover:underline">
                    Follow AgileForum
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div ref={rightRef}>
            <div data-animate className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              {status === "success" ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-sage" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-dark mb-2">Message Sent!</h3>
                  <p className="text-gray-600">We&apos;ll get back to you as soon as possible.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-dark mb-2">Name</label>
                    <input type="text" id="name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-dark placeholder-gray-400 focus:border-crimson focus:ring-2 focus:ring-crimson/20 outline-none transition-all" placeholder="Your name" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-dark mb-2">Email</label>
                    <input type="email" id="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-dark placeholder-gray-400 focus:border-crimson focus:ring-2 focus:ring-crimson/20 outline-none transition-all" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-dark mb-2">Subject</label>
                    <input type="text" id="subject" required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-dark placeholder-gray-400 focus:border-crimson focus:ring-2 focus:ring-crimson/20 outline-none transition-all" placeholder="What's this about?" />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-dark mb-2">Message</label>
                    <textarea id="message" required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-dark placeholder-gray-400 focus:border-crimson focus:ring-2 focus:ring-crimson/20 outline-none transition-all resize-none" placeholder="Your message..." />
                  </div>
                  {status === "error" && (
                    <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{errorMsg}</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full rounded-full bg-crimson px-6 py-3.5 text-white font-semibold hover:bg-crimson-dark transition-all hover:shadow-lg hover:shadow-crimson/30 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === "sending" ? (
                      <span className="inline-flex items-center gap-2">
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending...
                      </span>
                    ) : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
