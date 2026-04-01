import fs from "fs";
import path from "path";

export interface SectionVisibility {
  active: boolean;
}

export interface HeroContent {
  badge: string;
  heading: string;
  headingHighlight: string;
  subheading: string;
  tagline: string;
  ticketsLink: string;
  heroLogo: string;
  headerLogo: string;
}

export interface EventItem {
  id: string;
  title: string;
  location: string;
  date: string;
  description: string;
  highlight: boolean;
  flag: string;
  link: string;
}

export interface SpeakerItem {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  initials: string;
  color: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface SiteContent {
  sections: Record<string, SectionVisibility>;
  hero: HeroContent;
  events: EventItem[];
  speakers: SpeakerItem[];
  faq: FAQItem[];
}

const CONTENT_PATH = path.join(process.cwd(), "src/data/content.json");

export function getContent(): SiteContent {
  const raw = fs.readFileSync(CONTENT_PATH, "utf-8");
  return JSON.parse(raw);
}

export function saveContent(content: SiteContent): void {
  fs.writeFileSync(CONTENT_PATH, JSON.stringify(content, null, 2), "utf-8");
}
