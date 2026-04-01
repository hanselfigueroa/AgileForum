import { getContent } from "@/lib/content";
import AnimatedBackground from "@/components/AnimatedBackground";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Events from "@/components/Events";
import Speakers from "@/components/Speakers";
import Agenda from "@/components/Agenda";
import Attendees from "@/components/Attendees";
import Courses from "@/components/Courses";
import Sponsors from "@/components/Sponsors";
import Tickets from "@/components/Tickets";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default function Home() {
  const content = getContent();
  const s = content.sections;

  return (
    <>
      <AnimatedBackground />
      <Header
        logoSrc={content.hero.headerLogo || "/logo.svg"}
        activeSections={Object.entries(s)
          .filter(([, v]) => v.active)
          .map(([k]) => k)}
        ticketsLink={content.hero.ticketsLink || "#tickets"}
      />
      <main className="relative z-10">
        {s.hero?.active && (
          <Hero
            data={content.hero}
            showAgendaButton={!!s.agenda?.active}
          />
        )}
        {s.events?.active && <Events data={content.events} />}
        {s.speakers?.active && <Speakers data={content.speakers} />}
        {s.agenda?.active && <Agenda />}
        {s.attendees?.active && <Attendees />}
        {s.courses?.active && <Courses />}
        {s.sponsors?.active && <Sponsors />}
        {s.tickets?.active && <Tickets />}
        {s.faq?.active && <FAQ data={content.faq} />}
        {s.contact?.active && <Contact />}
      </main>
      <Footer className="relative z-10" />
    </>
  );
}
