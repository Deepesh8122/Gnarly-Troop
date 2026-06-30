import Link from "next/link";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/SectionFooter";
import GsceRegistrationForm from "@/components/registration/GsceRegistrationForm";
import { getOpenRegistrationEvent } from "@/lib/services/events";
import { getPhonePeConfig } from "@/src/lib/phonepe";
import styles from "./RegistrationPage.module.css";

export const metadata = {
  title: "GSCE Delegate Registration — Gnarly Troop",
  description:
    "Official Delegate Registration, Accreditation & Protocol Clearance Portal — Global Leadership & Cultural Exchange Summit 2026.",
};

function formatDates(starts: string | null, ends: string | null) {
  if (!starts) return null;
  const start = new Date(starts);
  const end = ends ? new Date(ends) : null;
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
  if (end) {
    return `${start.toLocaleDateString("en-IN", opts)} – ${end.toLocaleDateString("en-IN", opts)}`;
  }
  return start.toLocaleDateString("en-IN", opts);
}

export default async function RegistrationPage() {
  const event = await getOpenRegistrationEvent();
  const dateRange = event ? formatDates(event.starts_at, event.ends_at) : null;
  const venue = event?.location;
  const phonePeReady = Boolean(getPhonePeConfig());

  return (
    <>
      <Header />
      <main className={styles.page}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>GSCE 2026 — Official Portal</p>
          <h1>Delegate Registration &amp; Accreditation</h1>
          {event ? (
            <div className={styles.meta}>
              <p className={styles.eventTitle}>{event.title}</p>
              {event.subtitle && <p>{event.subtitle}</p>}
              {dateRange && <p>{dateRange}</p>}
              {venue && <p>{venue}</p>}
              <p className={styles.intro}>
                Complete all sections to register. Complimentary categories receive an immediate
                official pass by email. Paid categories complete payment via PhonePe before
                accreditation is issued.
              </p>
            </div>
          ) : (
            <p className={styles.closed}>
              Registration is not open at the moment. Please contact{" "}
              <a href="mailto:president@gnarlytroop.org">president@gnarlytroop.org</a>.
            </p>
          )}
        </header>

        <div className={styles.formWrap}>
          {event ? (
            <GsceRegistrationForm event={event} phonePeReady={phonePeReady} />
          ) : (
            <div className={styles.closedCard}>
              <p>No event is accepting registrations right now.</p>
              <Link href="/">← Back to homepage</Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
