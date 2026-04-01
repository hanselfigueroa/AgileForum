"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
const allNavItems = [
  { label: "Info", href: "#info", section: "hero" },
  { label: "Events", href: "#events", section: "events" },
  { label: "Speakers", href: "#speakers", section: "speakers" },
  { label: "Agenda", href: "#agenda", section: "agenda" },
  { label: "Attendees", href: "#attendees", section: "attendees" },
  { label: "Courses", href: "#courses", section: "courses" },
  { label: "Sponsors", href: "#sponsors", section: "sponsors" },
  { label: "FAQ", href: "#faq", section: "faq" },
  { label: "Contact", href: "#contact", section: "contact" },
];

interface HeaderProps {
  logoSrc?: string;
  activeSections?: string[];
  ticketsLink?: string;
}

export default function Header({ logoSrc = "/logo.svg", activeSections, ticketsLink = "#tickets" }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = useMemo(() => {
    if (!activeSections) return allNavItems;
    return allNavItems.filter((item) => activeSections.includes(item.section));
  }, [activeSections]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div
              className={`transition-all duration-300 ${
                isScrolled ? "brightness-0" : ""
              }`}
            >
              <Image
                src={logoSrc}
                alt="AgileForum"
                width={120}
                height={48}
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium transition-colors rounded-md hover:text-crimson ${
                  isScrolled ? "text-dark" : "text-white"
                }`}
              >
                {item.label}
              </a>
            ))}
            <a
              href={ticketsLink}
              target={ticketsLink.startsWith("http") ? "_blank" : undefined}
              rel={ticketsLink.startsWith("http") ? "noopener noreferrer" : undefined}
              className="ml-4 inline-flex items-center rounded-full bg-crimson px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-crimson-dark hover:shadow-xl hover:scale-105"
            >
              Buy Tickets
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-md ${
              isScrolled ? "text-dark" : "text-white"
            }`}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-base font-medium text-dark rounded-lg hover:bg-light hover:text-crimson transition-colors"
            >
              {item.label}
            </a>
          ))}
          <a
            href={ticketsLink}
            target={ticketsLink.startsWith("http") ? "_blank" : undefined}
            rel={ticketsLink.startsWith("http") ? "noopener noreferrer" : undefined}
            onClick={() => setIsMobileMenuOpen(false)}
            className="block mx-4 mt-4 text-center rounded-full bg-crimson px-6 py-3 text-base font-semibold text-white hover:bg-crimson-dark transition-colors"
          >
            Buy Tickets
          </a>
        </div>
      </div>
    </header>
  );
}
