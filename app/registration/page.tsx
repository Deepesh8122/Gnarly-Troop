import Link from "next/link";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/SectionFooter";
import EventRegistrationForm from "@/components/registration/EventRegistrationForm";
import { getOpenRegistrationEvent } from "@/lib/services/events";
import styles from "./RegistrationPage.module.css";

export const metadata = {
  title: "Summit Registration — Gnarly Troop",
  description:
    "Register for the Padharo Mhare Desh Bharat Global Leadership Summit & Cultural Exchange 2026.",
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

  return (
    <>
      <Header />
      <main className={styles.page}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Global Leadership Summit 2026</p>
          <h1>Summit Registration</h1>
          {event ? (
            <div className={styles.meta}>
              <p className={styles.eventTitle}>{event.title}</p>
              {event.subtitle && <p>{event.subtitle}</p>}
              {dateRange && <p>{dateRange}</p>}
              {venue && <p>{venue}</p>}
              <p className={styles.intro}>
                Complete the form below to register. You will receive a confirmation email with
                your details and eligibility category.
              </p>
            </div>
          ) : (
            <p className={styles.closed}>
              Registration is not open at the moment. Please check back soon or contact{" "}
              <a href="mailto:president@gnarlytroop.org">president@gnarlytroop.org</a>.
            </p>
          )}
        </header>

        <div className={styles.formWrap}>
          {event ? (
            <EventRegistrationForm event={event} />
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
