"use client";

import { useState, useEffect, useCallback } from "react";
import type { SiteContent, EventItem, SpeakerItem, FAQItem } from "@/lib/content";

type Tab = "hero" | "events" | "speakers" | "faq" | "sections" | "messages";

interface MessageItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
  emailSent: boolean;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSetup, setIsSetup] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("hero");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Auth form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const checkAuth = useCallback(async () => {
    try {
      const setupRes = await fetch("/api/auth/setup");
      const setupData = await setupRes.json();
      setIsSetup(setupData.setup);

      const res = await fetch("/api/auth/check");
      if (res.ok) {
        setIsAuthenticated(true);
        await loadContent();
        await loadMessages();
      }
    } catch {
      // not authenticated
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  async function loadContent() {
    const res = await fetch("/api/content");
    if (res.ok) {
      const data = await res.json();
      setContent(data);
    }
  }

  async function loadMessages() {
    const res = await fetch("/api/messages");
    if (res.ok) {
      const data = await res.json();
      setMessages(data.messages);
      setUnreadCount(data.unread);
    }
  }

  async function handleMessageAction(id: string, action: "read" | "delete") {
    await fetch("/api/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    await loadMessages();
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");

    const endpoint = isSetup ? "/api/auth/login" : "/api/auth/setup";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      setIsAuthenticated(true);
      setIsSetup(true);
      await loadContent();
      await loadMessages();
    } else {
      const data = await res.json();
      setAuthError(data.error || "Authentication failed");
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setIsAuthenticated(false);
    setContent(null);
  }

  async function handleSave() {
    if (!content) return;
    setSaving(true);
    setSaveMessage("");

    const res = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });

    if (res.ok) {
      setSaveMessage("Changes saved successfully!");
    } else {
      setSaveMessage("Failed to save changes");
    }
    setSaving(false);
    setTimeout(() => setSaveMessage(""), 3000);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-crimson border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Login / Setup screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark to-crimson p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-crimson/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-crimson" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-dark">
              {isSetup ? "Admin Login" : "Setup Admin Account"}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {isSetup
                ? "Sign in to manage your site"
                : "Create your admin account to get started"}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-dark focus:border-crimson focus:ring-2 focus:ring-crimson/20 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-dark focus:border-crimson focus:ring-2 focus:ring-crimson/20 outline-none"
                required
                minLength={8}
              />
              {!isSetup && (
                <p className="text-gray-400 text-xs mt-1">
                  Minimum 8 characters
                </p>
              )}
            </div>
            {authError && (
              <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                {authError}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-crimson text-white font-semibold py-3 rounded-xl hover:bg-crimson-dark transition-colors"
            >
              {isSetup ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!content) return null;

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "sections", label: "Sections", icon: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" },
    { key: "hero", label: "Hero Texts", icon: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" },
    { key: "events", label: "Events", icon: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" },
    { key: "speakers", label: "Speakers", icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" },
    { key: "faq", label: "FAQ", icon: "M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" },
    { key: "messages", label: "Messages", icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-crimson rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">AF</span>
          </div>
          <h1 className="text-lg font-bold text-dark">AgileForum Admin</h1>
        </div>
        <div className="flex items-center gap-3">
          {saveMessage && (
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full ${
                saveMessage.includes("success")
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {saveMessage}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-crimson text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-crimson-dark transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <a
            href="/"
            target="_blank"
            className="text-gray-500 hover:text-dark text-sm px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            View Site
          </a>
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-500 text-sm px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-65px)] p-4 sticky top-[65px] self-start">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-crimson/10 text-crimson"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={tab.icon}
                  />
                </svg>
                {tab.label}
                {tab.key === "messages" && unreadCount > 0 && (
                  <span className="ml-auto bg-crimson text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8 max-w-4xl">
          {activeTab === "sections" && (
            <SectionsEditor content={content} setContent={setContent} />
          )}
          {activeTab === "hero" && (
            <HeroEditor content={content} setContent={setContent} />
          )}
          {activeTab === "events" && (
            <EventsEditor content={content} setContent={setContent} />
          )}
          {activeTab === "speakers" && (
            <SpeakersEditor content={content} setContent={setContent} />
          )}
          {activeTab === "faq" && (
            <FAQEditor content={content} setContent={setContent} />
          )}
          {activeTab === "messages" && (
            <MessagesViewer
              messages={messages}
              onAction={handleMessageAction}
            />
          )}
        </main>
      </div>
    </div>
  );
}

// ─── SECTION TOGGLES ────────────────────────────────────────

interface EditorProps {
  content: SiteContent;
  setContent: (c: SiteContent) => void;
}

const sectionLabels: Record<string, string> = {
  hero: "Hero / Header",
  events: "Upcoming Events",
  speakers: "Speakers",
  agenda: "Agenda",
  attendees: "Attendees & Stats",
  courses: "Courses",
  sponsors: "Sponsors",
  tickets: "Tickets / Pricing",
  faq: "FAQ",
  contact: "Contact Form",
};

function SectionsEditor({ content, setContent }: EditorProps) {
  function toggle(key: string) {
    setContent({
      ...content,
      sections: {
        ...content.sections,
        [key]: { active: !content.sections[key].active },
      },
    });
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-dark mb-2">Section Visibility</h2>
      <p className="text-gray-500 text-sm mb-8">
        Toggle which sections are visible on the public site.
      </p>
      <div className="space-y-3">
        {Object.keys(sectionLabels).map((key) => (
          <div
            key={key}
            className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4"
          >
            <div>
              <p className="font-semibold text-dark">{sectionLabels[key]}</p>
              <p className="text-gray-400 text-xs">
                /{key === "hero" ? "" : `#${key}`}
              </p>
            </div>
            <button
              onClick={() => toggle(key)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                content.sections[key]?.active
                  ? "bg-crimson"
                  : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${
                  content.sections[key]?.active
                    ? "translate-x-7"
                    : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── HERO EDITOR ────────────────────────────────────────────

function HeroEditor({ content, setContent }: EditorProps) {
  function update(field: string, value: string) {
    setContent({
      ...content,
      hero: { ...content.hero, [field]: value },
    });
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-dark mb-2">Hero Section</h2>
      <p className="text-gray-500 text-sm mb-8">
        Edit the main texts and logos displayed in the hero banner.
      </p>

      {/* Logo uploads */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-dark mb-4">Logos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <LogoUpload
            label="Hero Logo"
            hint="Large logo displayed in the center of the hero section."
            currentSrc={content.hero.heroLogo || "/logo.svg"}
            field="heroLogo"
            onUploaded={(url) => update("heroLogo", url)}
          />
          <LogoUpload
            label="Header Logo"
            hint="Small logo displayed in the top navigation bar."
            currentSrc={content.hero.headerLogo || "/logo.svg"}
            field="headerLogo"
            onUploaded={(url) => update("headerLogo", url)}
          />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-dark mb-4">Texts</h3>
      <div className="space-y-6">
        <Field
          label="Badge Text"
          value={content.hero.badge}
          onChange={(v) => update("badge", v)}
          placeholder="e.g. 2026 Edition — San José, Costa Rica"
        />
        <Field
          label="Main Heading"
          value={content.hero.heading}
          onChange={(v) => update("heading", v)}
          placeholder="Main headline text"
        />
        <Field
          label="Highlighted Word in Heading"
          value={content.hero.headingHighlight}
          onChange={(v) => update("headingHighlight", v)}
          placeholder="Word to highlight with gradient"
          hint="This word will appear with a gold-to-crimson gradient."
        />
        <Field
          label="Subheading"
          value={content.hero.subheading}
          onChange={(v) => update("subheading", v)}
          multiline
          placeholder="Descriptive text below the heading"
        />
        <Field
          label="Tagline"
          value={content.hero.tagline}
          onChange={(v) => update("tagline", v)}
          multiline
          placeholder="Italic tagline text"
        />
        <Field
          label="Get Your Tickets — Link"
          value={content.hero.ticketsLink || ""}
          onChange={(v) => update("ticketsLink", v)}
          placeholder="e.g. https://tickets.example.com or #tickets"
          hint="URL for the 'Get Your Tickets' button. Use a full URL (https://...) for external links or #tickets for on-page."
        />
      </div>
    </div>
  );
}

// ─── EVENTS EDITOR ──────────────────────────────────────────

function EventsEditor({ content, setContent }: EditorProps) {
  function updateEvent(index: number, field: string, value: string | boolean) {
    const events = [...content.events];
    events[index] = { ...events[index], [field]: value };
    setContent({ ...content, events });
  }

  function addEvent() {
    const newEvent: EventItem = {
      id: Date.now().toString(),
      title: "New Event",
      location: "",
      date: "Coming Soon",
      description: "",
      highlight: false,
      flag: "\ud83c\udf0d",
      link: "",
    };
    setContent({ ...content, events: [...content.events, newEvent] });
  }

  function removeEvent(index: number) {
    const events = content.events.filter((_, i) => i !== index);
    setContent({ ...content, events });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-dark">Upcoming Events</h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage the events shown on the site.
          </p>
        </div>
        <button
          onClick={addEvent}
          className="bg-crimson text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-crimson-dark transition-colors"
        >
          + Add Event
        </button>
      </div>
      <div className="space-y-6">
        {content.events.map((event, index) => (
          <div
            key={event.id}
            className="bg-white rounded-xl border border-gray-200 p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-dark">
                {event.title || "Untitled Event"}
              </h3>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-500">
                  <input
                    type="checkbox"
                    checked={event.highlight}
                    onChange={(e) =>
                      updateEvent(index, "highlight", e.target.checked)
                    }
                    className="accent-crimson w-4 h-4"
                  />
                  Featured
                </label>
                <button
                  onClick={() => removeEvent(index)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field
                label="Title"
                value={event.title}
                onChange={(v) => updateEvent(index, "title", v)}
              />
              <Field
                label="Location"
                value={event.location}
                onChange={(v) => updateEvent(index, "location", v)}
              />
              <Field
                label="Date"
                value={event.date}
                onChange={(v) => updateEvent(index, "date", v)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Flag Emoji"
                value={event.flag}
                onChange={(v) => updateEvent(index, "flag", v)}
              />
              <Field
                label="Learn More — Link"
                value={event.link || ""}
                onChange={(v) => updateEvent(index, "link", v)}
                placeholder="e.g. https://guatemala.agileforum.org"
                hint="URL for the Learn More button. Leave empty to link to tickets."
              />
            </div>
            <Field
              label="Description"
              value={event.description}
              onChange={(v) => updateEvent(index, "description", v)}
              multiline
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SPEAKERS EDITOR ────────────────────────────────────────

const colorOptions = [
  "from-crimson to-crimson-dark",
  "from-steel-blue to-accent-blue",
  "from-gold to-orange",
  "from-sage to-steel-blue",
  "from-orange to-crimson",
  "from-crimson to-gold",
];

function SpeakersEditor({ content, setContent }: EditorProps) {
  function updateSpeaker(index: number, field: string, value: string) {
    const speakers = [...content.speakers];
    speakers[index] = { ...speakers[index], [field]: value };
    // Auto-generate initials from name
    if (field === "name" && value) {
      const parts = value.split(" ").filter(Boolean);
      const initials =
        parts.length >= 2
          ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
          : value.slice(0, 2).toUpperCase();
      speakers[index].initials = initials;
    }
    setContent({ ...content, speakers });
  }

  function addSpeaker() {
    const newSpeaker: SpeakerItem = {
      id: Date.now().toString(),
      name: "",
      title: "",
      company: "",
      bio: "",
      initials: "??",
      color: colorOptions[content.speakers.length % colorOptions.length],
    };
    setContent({ ...content, speakers: [...content.speakers, newSpeaker] });
  }

  function removeSpeaker(index: number) {
    const speakers = content.speakers.filter((_, i) => i !== index);
    setContent({ ...content, speakers });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-dark">Speakers</h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage speakers displayed on the site.
          </p>
        </div>
        <button
          onClick={addSpeaker}
          className="bg-crimson text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-crimson-dark transition-colors"
        >
          + Add Speaker
        </button>
      </div>
      <div className="space-y-6">
        {content.speakers.map((speaker, index) => (
          <div
            key={speaker.id}
            className="bg-white rounded-xl border border-gray-200 p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${speaker.color} flex items-center justify-center text-white text-sm font-bold`}
                >
                  {speaker.initials}
                </div>
                <h3 className="font-bold text-dark">
                  {speaker.name || "New Speaker"}
                </h3>
              </div>
              <button
                onClick={() => removeSpeaker(index)}
                className="text-red-400 hover:text-red-600 text-sm"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field
                label="Name"
                value={speaker.name}
                onChange={(v) => updateSpeaker(index, "name", v)}
              />
              <Field
                label="Title / Role"
                value={speaker.title}
                onChange={(v) => updateSpeaker(index, "title", v)}
              />
              <Field
                label="Company"
                value={speaker.company}
                onChange={(v) => updateSpeaker(index, "company", v)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">
                Avatar Color
              </label>
              <div className="flex gap-2">
                {colorOptions.map((c) => (
                  <button
                    key={c}
                    onClick={() => updateSpeaker(index, "color", c)}
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c} ${
                      speaker.color === c
                        ? "ring-2 ring-offset-2 ring-crimson"
                        : ""
                    }`}
                  />
                ))}
              </div>
            </div>
            <Field
              label="Bio"
              value={speaker.bio}
              onChange={(v) => updateSpeaker(index, "bio", v)}
              multiline
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FAQ EDITOR ─────────────────────────────────────────────

function FAQEditor({ content, setContent }: EditorProps) {
  function updateFaq(index: number, field: string, value: string) {
    const faq = [...content.faq];
    faq[index] = { ...faq[index], [field]: value };
    setContent({ ...content, faq });
  }

  function addFaq() {
    const newFaq: FAQItem = {
      id: Date.now().toString(),
      question: "",
      answer: "",
    };
    setContent({ ...content, faq: [...content.faq, newFaq] });
  }

  function removeFaq(index: number) {
    const faq = content.faq.filter((_, i) => i !== index);
    setContent({ ...content, faq });
  }

  function moveFaq(index: number, direction: -1 | 1) {
    const faq = [...content.faq];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= faq.length) return;
    [faq[index], faq[newIndex]] = [faq[newIndex], faq[index]];
    setContent({ ...content, faq });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-dark">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage the FAQ section on the site.
          </p>
        </div>
        <button
          onClick={addFaq}
          className="bg-crimson text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-crimson-dark transition-colors"
        >
          + Add Question
        </button>
      </div>
      <div className="space-y-4">
        {content.faq.map((item, index) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-gray-200 p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400">
                Q{index + 1}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => moveFaq(index, -1)}
                  disabled={index === 0}
                  className="text-gray-400 hover:text-dark disabled:opacity-30 p-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                  </svg>
                </button>
                <button
                  onClick={() => moveFaq(index, 1)}
                  disabled={index === content.faq.length - 1}
                  className="text-gray-400 hover:text-dark disabled:opacity-30 p-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                <button
                  onClick={() => removeFaq(index)}
                  className="text-red-400 hover:text-red-600 text-sm ml-2"
                >
                  Remove
                </button>
              </div>
            </div>
            <Field
              label="Question"
              value={item.question}
              onChange={(v) => updateFaq(index, "question", v)}
              placeholder="e.g. What is AgileForum?"
            />
            <Field
              label="Answer"
              value={item.answer}
              onChange={(v) => updateFaq(index, "answer", v)}
              multiline
              placeholder="Full answer text..."
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MESSAGES VIEWER ────────────────────────────────────────

function MessagesViewer({
  messages,
  onAction,
}: {
  messages: MessageItem[];
  onAction: (id: string, action: "read" | "delete") => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggle(msg: MessageItem) {
    if (expandedId === msg.id) {
      setExpandedId(null);
    } else {
      setExpandedId(msg.id);
      if (!msg.read) {
        onAction(msg.id, "read");
      }
    }
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-dark">Messages</h2>
          <p className="text-gray-500 text-sm mt-1">
            Contact form submissions.{" "}
            {messages.length === 0
              ? "No messages yet."
              : `${messages.length} total`}
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No messages yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Messages from the contact form will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white rounded-xl border transition-all ${
                !msg.read
                  ? "border-crimson/30 shadow-sm"
                  : "border-gray-200"
              }`}
            >
              {/* Header row */}
              <button
                onClick={() => toggle(msg)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left"
              >
                {/* Unread dot */}
                <div className="flex-shrink-0 w-2.5 h-2.5">
                  {!msg.read && (
                    <div className="w-2.5 h-2.5 rounded-full bg-crimson" />
                  )}
                </div>

                {/* Sender info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm truncate ${!msg.read ? "font-bold text-dark" : "font-medium text-gray-700"}`}>
                      {msg.name}
                    </span>
                    <span className="text-xs text-gray-400 truncate">
                      &lt;{msg.email}&gt;
                    </span>
                  </div>
                  <p className={`text-sm truncate ${!msg.read ? "font-semibold text-dark" : "text-gray-600"}`}>
                    {msg.subject}
                  </p>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {msg.emailSent && (
                    <span className="text-xs text-green-500" title="Email sent">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                  )}
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {timeAgo(msg.createdAt)}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      expandedId === msg.id ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </button>

              {/* Expanded content */}
              {expandedId === msg.id && (
                <div className="px-5 pb-5 border-t border-gray-100">
                  <div className="pt-4 space-y-3">
                    <div className="flex gap-4 text-sm">
                      <span className="text-gray-400 w-16">From</span>
                      <span className="text-dark font-medium">{msg.name}</span>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className="text-gray-400 w-16">Email</span>
                      <a href={`mailto:${msg.email}`} className="text-crimson hover:underline">
                        {msg.email}
                      </a>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className="text-gray-400 w-16">Subject</span>
                      <span className="text-dark">{msg.subject}</span>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className="text-gray-400 w-16">Date</span>
                      <span className="text-gray-600">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <hr className="border-gray-100" />
                    <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {msg.message}
                    </div>
                    <hr className="border-gray-100" />
                    <div className="flex items-center gap-3 pt-1">
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-crimson text-white text-sm font-medium rounded-lg hover:bg-crimson-dark transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                        </svg>
                        Reply
                      </a>
                      <button
                        onClick={() => onAction(msg.id, "delete")}
                        className="inline-flex items-center gap-1 px-4 py-2 text-red-500 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                      {!msg.emailSent && (
                        <span className="text-xs text-amber-500 ml-auto">
                          Email not sent (Resend not configured)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── LOGO UPLOAD COMPONENT ──────────────────────────────────

function LogoUpload({
  label,
  hint,
  currentSrc,
  field,
  onUploaded,
}: {
  label: string;
  hint: string;
  currentSrc: string;
  field: string;
  onUploaded: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("field", field);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        onUploaded(data.url);
      } else {
        const data = await res.json();
        setError(data.error || "Upload failed");
      }
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
      // Reset the input so same file can be re-uploaded
      e.target.value = "";
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <label className="block text-sm font-medium text-dark mb-1">
        {label}
      </label>
      <p className="text-gray-400 text-xs mb-3">{hint}</p>

      {/* Preview */}
      <div className="mb-3 bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-[80px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentSrc}
          alt={label}
          className="max-h-16 max-w-full object-contain"
        />
      </div>

      {/* Upload button */}
      <label
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
          uploading
            ? "bg-gray-200 text-gray-500"
            : "bg-crimson/10 text-crimson hover:bg-crimson/20"
        }`}
      >
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
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
        {uploading ? "Uploading..." : "Upload New Logo"}
        <input
          type="file"
          accept="image/svg+xml,image/png,image/jpeg,image/webp,image/gif"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>

      <p className="text-gray-400 text-xs mt-2">
        SVG, PNG, JPG, WebP or GIF. Max 2MB.
      </p>

      {error && (
        <p className="text-red-500 text-xs mt-2 bg-red-50 p-2 rounded">
          {error}
        </p>
      )}
    </div>
  );
}

// ─── SHARED FIELD COMPONENT ─────────────────────────────────

function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  hint?: string;
}) {
  const cls =
    "w-full rounded-xl border border-gray-200 px-4 py-3 text-dark text-sm focus:border-crimson focus:ring-2 focus:ring-crimson/20 outline-none transition-all";

  return (
    <div>
      <label className="block text-sm font-medium text-dark mb-1">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${cls} resize-none`}
          rows={3}
          placeholder={placeholder}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
          placeholder={placeholder}
        />
      )}
      {hint && <p className="text-gray-400 text-xs mt-1">{hint}</p>}
    </div>
  );
}
