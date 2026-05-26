"use client";
import React, { useEffect, useRef, useState } from "react";

/*
  Single-file bundle of React components you asked for:
  - Header
  - Hero (client)
  - Events
  - Gallery
  - Team
  - Footer

  Usage: place this file under `src/components/SiteComponents.tsx` (or split into separate files),
  import and use the default `Page` component in `src/app/page.tsx`.

  NOTE: This file expects your global CSS (the <style> block you provided) to be in `src/app/globals.css`.
  Put static assets (PDFs/images) under `public/` (e.g. `/a6cd4240-....pdf`).
*/

const DICT = {
  en: {
    nav_about: "About",
    nav_programs: "Programs",
    nav_events: "Events",
    nav_gallery: "Gallery",
    nav_contact: "Contact",
    hero_title: "Welcome to My Country, India",
    hero_sub:
      "A global cultural & youth empowerment movement — Explore Bharat with Gnarly Troop.",
    hero_cta_events: "See Events",
    hero_cta_pdf: "Download Brochure",
    hero_quick:
      "Quick facts: 4C Vision — Climate · Community · Culture · Cooperation",
    hero2_title: "4C — Climate, Community, Culture, Cooperation",
    hero2_sub:
      "Youth leadership, village adoption, eco-initiatives and cultural exchanges shaping a sustainable future.",
    hero2_cta: "Programs",
    hero2_cta2: "Notify Me",
    hero3_title: "Cultural Exchange & Awards",
    hero3_sub:
      "Honoring young leaders across folk arts, sustainability and community impact.",
    hero3_cta: "Get Involved",
    about_title: "About the Initiative",
    about_text:
      "“Welcome to My Country, India (Padharo Mhare Desh Bharat)” is a youth-driven, cultural diplomacy program by Gnarly Troop Global Federation. It reintroduces India as a living mosaic of heritage, ecological consciousness, tribal wisdom and grassroots innovation.",
    vision: "Vision & Mission",
    vision_text:
      "Showcase India's civilizational legacy and empower young citizens through experiential learning, community outreach, and eco-tourism.",
    alignment: "National Alignment",
    alignment_text:
      "Aligned with government missions like Ek Bharat Shreshtha Bharat, Swachh Bharat, Know India Programme, NEP 2020 and more.",
    programs_title: "4C's Vision",
    c1: "Climate",
    c1_text: "Eco-tourism, tree plantation, clean-air initiatives & marathons.",
    c2: "Community",
    c2_text:
      "Village adoption, rural empowerment, health & education outreach programs.",
    c3: "Culture",
    c3_text: "Cultural exchanges, festivals, folk arts & awards.",
    c4: "Cooperation",
    c4_text:
      "International partnerships, youth leadership and diaspora engagement.",
    events_title: "Featured Events",
    ev1_title: "Explore Bharat — Summit & Exhibition",
    ev1_text:
      "Panel discussions, cultural showcases and National Recognition (example: 27–28 Sep 2025).",
    ev2_title: "Go Green Troops — Marathon",
    ev2_text:
      "21.5 km 'Clean Air & Blue Skies' marathon (example: 1st Dec 2025).",
    ev3_title: "Explore Bharat — Community Outreach",
    ev3_text:
      "Village camps, internships and volunteer programs supporting local livelihoods.",
    ev4_title: "Nationwide School Exchange",
    ev4_text:
      "Inter-school cultural exchange and environmental workshops for young learners.",
    gallery_title: "Gallery",
    gallery_sub:
      "Photos from past summits, marathons and outreach campaigns — click to enlarge.",
    team_title: "Leadership & Team",
    team_sub: "Selected executive members and program leads.",
    role_founder: "Founder",
    role_chair: "Chairman",
    contact_title: "Contact & Partners",
    contact_text:
      "Website, contacts and partners are listed in the brochure. Example:",
    contact_web: "Website: www.gnarlytroop.org",
    contact_phone: "Phone: +91 96544 51858",
    contact_email: "Email: president@gnarlytroop.org",
    contact_brochure: "Open Full Brochure (PDF)",
    contact_email_btn: "Email",
  },
  hi: {
    nav_about: "परिचय",
    nav_programs: "परियोजनाएँ",
    nav_events: "कार्यक्रम",
    nav_gallery: "गैलरी",
    nav_contact: "संपर्क",
    hero_title: "मेरे देश का स्वागत — भारत",
    hero_sub:
      "एक वैश्विक सांस्कृतिक और युवा सशक्तिकरण अभियान — Gnarly Troop के साथ भारत की खोज करें।",
    hero_cta_events: "कार्यक्रम देखें",
    hero_cta_pdf: "ब्रोशर डाउनलोड करें",
    hero_quick: "त्वरित तथ्य: 4C विजन — जलवायु · समुदाय · संस्कृति · सहयोग",
    hero2_title: "4C — जलवायु, समुदाय, संस्कृति, सहयोग",
    hero2_sub:
      "युवा नेतृत्व, गाँव अनुदान, इको-उद्यम और सांस्कृतिक आदान-प्रदान — सतत भविष्य के लिए।",
    hero2_cta: "कार्यक्रम",
    hero2_cta2: "सूचना दें",
    hero3_title: "सांस्कृतिक आदान-प्रदान और पुरस्कार",
    hero3_sub:
      "लोक कला, स्थिरता और सामुदायिक प्रभाव में युवा नेताओं का सम्मान।",
    hero3_cta: "शामिल हों",
    about_title: "अभियान के बारे में",
    about_text:
      "“Welcome to My Country, India (Padharo Mhare Desh Bharat)” एक युवा-चालित सांस्कृतिक कूटनीति कार्यक्रम है जो Gnarly Troop Global Federation द्वारा चलाया जाता है। यह भारत को धरोहर, पारिस्थितिक चेतना, जनजातीय ज्ञान और जमीनी नवाचार के रूप में पुनर्परिभाषित करता है।",
    vision: "विजन और मिशन",
    vision_text:
      "भारत की सभ्यतागत विरासत को प्रदर्शित करना और अनुभवात्मक शिक्षा, सामुदायिक पहुँच और इको-टूरिज्म के माध्यम से युवाओं को सशक्त बनाना।",
    alignment: "राष्ट्रीय संरेखण",
    alignment_text:
      "Ek Bharat Shreshtha Bharat, Swachh Bharat, Know India Programme, NEP 2020 सहित सरकारी मिशनों के साथ संरेखित।",
    programs_title: "4C का विजन",
    c1: "जलवायु",
    c1_text: "इको-टूरिज्म, वृक्षारोपण, स्वच्छ-हवा पहल और मैराथन।",
    c2: "समुदाय",
    c2_text: "ग्राम गोद लेना, ग्रामीण सशक्तिकरण, स्वास्थ्य और शिक्षा outreach।",
    c3: "संस्कृति",
    c3_text: "सांस्कृतिक आदान-प्रदाता, त्योहार, लोक कला और पुरस्कार।",
    c4: "सहयोग",
    c4_text: "अंतर्राष्ट्रीय भागीदारी, युवा नेतृत्व और प्रवासी जुड़ाव।",
    events_title: "विशेष कार्यक्रम",
    ev1_title: "Explore Bharat — सम्मिट और प्रदर्शनी",
    ev1_text:
      "पैनल चर्चा, सांस्कृतिक शोकेस और राष्ट्रीय मान्यता (उदा।: 27–28 सितम्बर 2025)।",
    ev2_title: "Go Green Troops — मैराथन",
    ev2_text:
      "21.5 किमी 'स्वच्छ हवा और नीले आकाश' मैराथन (उदा।: 1 दिसम्बर 2025)।",
    ev3_title: "Explore Bharat — सामुदायिक आउटरीच",
    ev3_text: "ग्राम शिविर, इंटर्नशिप और स्थायी स्थानीय कार्यक्रम।",
    ev4_title: "राष्ट्रीय स्कूल एक्सचेंज",
    ev4_text: "स्कूलों के बीच सांस्कृतिक आदान-प्रदान और पर्यावरण कार्यशालाएँ।",
    gallery_title: "गैलरी",
    gallery_sub:
      "पिछले सम्मिट, मैराथन और आउटरीच अभियान की तस्वीरें — बड़ा करने के लिए क्लिक करें।",
    team_title: "नेतृत्व और टीम",
    team_sub: "चुनी हुई कार्यकारी सदस्य और कार्यक्रम प्रमुख।",
    role_founder: "संस्थापक",
    role_chair: "अध्यक्ष",
    contact_title: "संपर्क और भागीदार",
    contact_text: "वेबसाइट, संपर्क और भागीदार ब्रोशर में सूचीबद्ध हैं। उदाहरण:",
    contact_web: "वेबसाइट: www.gnarlytroop.org",
    contact_phone: "फोन: +91 96544 51858",
    contact_email: "ईमेल: president@gnarlytroop.org",
    contact_brochure: "पूर्ण ब्रोशर खोलें (PDF)",
    contact_email_btn: "ईमेल",
  },
};

/* =====================
   Header
   ===================== */
export function Header({
  lang,
  setLang,
}: {
  lang: string;
  setLang: (l: string) => void;
}) {
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


const nav = DICT[lang as "en" | "hi"];

  return (
    <header
      id="siteHeader"
      className={stuck ? "stuck" : ""}
      aria-label="Main header"
    >
      <div className="wrap">
        <div className="nav" id="navWrap">
          <div className="brand" id="brand">
            <div className="logo">GT</div>
            <div>
              <h1 id="orgTitle" title="Gnarly Troop Global Federation">
                Gnarly Troop Global Federation
              </h1>
              <div className="sub" id="orgSubtitle">
                My Country · My Responsibility · My Pride
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <nav
              className="nav-links"
              id="navLinks"
              aria-label="Main navigation"
            >
              <a href="#about">{nav.nav_about}</a>
              <a href="#programs">{nav.nav_programs}</a>
              <a href="#events">{nav.nav_events}</a>
              <a href="#gallery">{nav.nav_gallery}</a>
              <a href="#contact">{nav.nav_contact}</a>
            </nav>

            <div
              className="lang-toggle"
              role="tablist"
              aria-label="Language selector"
            >
              <button
                id="enBtn"
                className={lang === "en" ? "active" : ""}
                aria-pressed={lang === "en"}
                onClick={() => setLang("en")}
              >
                EN
              </button>
              <button
                id="hiBtn"
                className={lang === "hi" ? "active" : ""}
                aria-pressed={lang === "hi"}
                onClick={() => setLang("hi")}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* =====================
   Hero (client) - autoplay slider, dots, CTA
   ===================== */
export function Hero({
  lang,
  onOpenModal,
  showToast,
}: {
  lang: string;
  onOpenModal: (src: string) => void;
  showToast: (msg: string) => void;
}) {
  const slidesRef = useRef<HTMLDivElement | null>(null);
  const [current, setCurrent] = useState(0);
  const slides = [0, 1, 2];
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const reset = () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = window.setInterval(
        () => setCurrent((c) => (c + 1) % slides.length),
        6000
      );
    };
    reset();
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const el = slidesRef.current;
    if (!el) return;
    el.style.transform = `translateX(-${current * 100}%)`;
  }, [current]);

  function goTo(i: number) {
    setCurrent((i + slides.length) % slides.length);
  }


  const D = DICT[lang as "en" | "hi"];

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      aria-label="Hero slides"
    >
      <div id="slides" ref={slidesRef} className="slides" tabIndex={0}>
        {/* Slide 1 */}
        <div className="slide" data-i="0">
          <div className="left">
            <h2 data-key="hero_title">{D.hero_title}</h2>
            <p data-key="hero_sub">{D.hero_sub}</p>
            <div className="cta">
              <button
                className="btn btn-primary"
                id="seeEventsBtn"
                onClick={() =>
                  document
                    .getElementById("events")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                {D.hero_cta_events}
              </button>
              <a
                className="btn btn-light"
                href="/a6cd4240-1449-463d-92b0-e5d210ce9a53.pdf"
                target="_blank"
                rel="noopener"
              >
                {D.hero_cta_pdf}
              </a>
            </div>
            <div
              style={{ marginTop: 12, color: "var(--muted)" }}
              data-key="hero_quick"
            >
              {D.hero_quick}
            </div>
          </div>
          <div
            className="hero-right"
            style={{
              backgroundImage: `url('/a6cd4240-1449-463d-92b0-e5d210ce9a53.pdf')`,
            }}
          >
            <div className="pdf-cta">
              <div>
                <div style={{ fontWeight: 700 }} data-key="hero_pdf_title">
                  Padharo Mhare Desh Bharat
                </div>
                <div
                  style={{ fontSize: 13, color: "var(--muted)" }}
                  data-key="hero_pdf_sub"
                >
                  Official initiative brochure
                </div>
              </div>
              <div>
                <a
                  className="btn btn-primary"
                  href="/a6cd4240-1449-463d-92b0-e5d210ce9a53.pdf"
                  target="_blank"
                >
                  Open PDF
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 2 */}
        <div className="slide" data-i="1">
          <div className="left">
            <h2 data-key="hero2_title">{D.hero2_title}</h2>
            <p data-key="hero2_sub">{D.hero2_sub}</p>
            <div className="cta">
              <button
                className="btn btn-primary"
                onClick={() =>
                  document
                    .getElementById("programs")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                {D.hero2_cta}
              </button>
              <button
                className="btn btn-light"
                onClick={() =>
                  showToast("Thank you — हमने आपकी रुचि दर्ज कर ली है")
                }
              >
                {D.hero2_cta2}
              </button>
            </div>
          </div>
          <div
            className="hero-right"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=60')`,
            }}
          >
            <div className="pdf-cta">
              <div>
                <div style={{ fontWeight: 700 }}>Explore Bharat Campaign</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>
                  Grassroots outreach & eco-tourism
                </div>
              </div>
              <div>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    onOpenModal(
                      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
                    )
                  }
                >
                  View
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 3 */}
        <div className="slide" data-i="2">
          <div className="left">
            <h2 data-key="hero3_title">{D.hero3_title}</h2>
            <p data-key="hero3_sub">{D.hero3_sub}</p>
            <div className="cta">
              <button
                className="btn btn-primary"
                onClick={() =>
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                {D.hero3_cta}
              </button>
              <a
                className="btn btn-light"
                href="/a6cd4240-1449-463d-92b0-e5d210ce9a53.pdf"
                target="_blank"
              >
                Brochure
              </a>
            </div>
          </div>
          <div
            className="hero-right"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=900&q=60')`,
            }}
          >
            <div className="pdf-cta">
              <div>
                <div style={{ fontWeight: 700 }}>Summit & Exhibition</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>
                  National recognition & showcase
                </div>
              </div>
              <div>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    onOpenModal(
                      "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=1200&q=80"
                    )
                  }
                >
                  Explore
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-controls" aria-hidden="false">
        {slides.map((_, i) => (
          <div
            key={i}
            className={"dot" + (i === current ? " active" : "")}
            onClick={() => {
              setCurrent(i);
            }}
          />
        ))}
      </div>
    </section>
  );
}

/* =====================
   Events
   ===================== */
export function Events({ lang }: { lang: string }) {
  const D = DICT[lang as "en" | "hi"];

  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const card = cardsRef.current[index];
    if (card) {
      track.style.transform = `translateX(-${card.offsetLeft}px)`;
    }
  }, [index]);

  function prev() {
    setIndex((i) => Math.max(0, i - 1));
  }
  function next() {
    setIndex((i) => Math.min(i + 1, (cardsRef.current.length || 1) - 1));
  }

  return (
    <section id="events" className="reveal" aria-labelledby="eventsTitle">
      <h3 id="eventsTitle" data-key="events_title">
        {D.events_title}
      </h3>

      <div className="events-wrapper" style={{ marginTop: 12 }}>
        <div className="events-nav">
          <button aria-label="Previous" className="icon-btn" onClick={prev}>
            ◀
          </button>
          <button aria-label="Next" className="icon-btn" onClick={next}>
            ▶
          </button>
        </div>

        <div
          id="eventsTrack"
          className="events-track"
          tabIndex={0}
          role="region"
          aria-label="Events carousel"
          ref={trackRef}
        >
          {[
            {
              tag: "SUMMIT",
              title: D.ev1_title,
              text: D.ev1_text,
              color: "var(--accent-2)",
            },
            {
              tag: "MARATHON",
              title: D.ev2_title,
              text: D.ev2_text,
              color: "var(--accent)",
            },
            {
              tag: "OUTREACH",
              title: D.ev3_title,
              text: D.ev3_text,
              color: "#6c6c6c",
            },
            {
              tag: "CAMPAIGN",
              title: D.ev4_title,
              text: D.ev4_text,
              color: "#7bba4a",
            },
          ].map((ev, i) => (
            <div
              key={i}
              className="event-card"
              ref={(el) => {
                if (el) cardsRef.current[i] = el;
              }}
              aria-roledescription="slide"
            >
              <div>
                <span
                  style={{
                    display: "inline-block",
                    padding: "6px 10px",
                    borderRadius: 999,
                    background: ev.color,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 12,
                  }}
                >
                  {ev.tag}
                </span>
              </div>
              <h4 style={{ margin: "10px 0 6px 0" }}>{ev.title}</h4>
              <div style={{ color: "var(--muted)" }}>{ev.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =====================
   Gallery
   ===================== */
export function Gallery({
  lang,
  onOpenModal,
}: {
  lang: string;
  onOpenModal: (src: string) => void;
}) {

const D = DICT[lang as "en" | "hi"];

  const items = [
    {
      src: "/a6cd4240-1449-463d-92b0-e5d210ce9a53.pdf",
      alt: "Brochure page 1",
    },
    {
      src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60",
      alt: "Event",
    },
    {
      src: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=800&q=60",
      alt: "Summit",
    },
    {
      src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=60",
      alt: "Volunteers",
    },
  ];

  return (
    <section id="gallery" className="reveal" aria-labelledby="galleryTitle">
      <h3 id="galleryTitle" data-key="gallery_title">
        {D.gallery_title}
      </h3>
      <p style={{ color: "var(--muted)", marginTop: 6 }}>{D.gallery_sub}</p>

      <div className="gallery-wrap">
        <div
          id="galleryTrack"
          className="gallery-track"
          style={{
            display: "flex",
            gap: 8,
            overflow: "auto",
            padding: "8px 0",
          }}
        >
          {items.map((it, i) => (
            <div
              key={i}
              className="gallery-item"
              tabIndex={0}
              role="button"
              aria-pressed="false"
              onClick={() => onOpenModal(it.src)}
            >
              <img src={it.src} alt={it.alt} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =====================
   Team
   ===================== */
export function Team({ lang }: { lang: string }) {
  const D = DICT[lang as "en" | "hi"];
  
  return (
    <section className="reveal" aria-labelledby="teamTitle">
      <h3 id="teamTitle" data-key="team_title">
        {D.team_title}
      </h3>
      <div style={{ color: "var(--muted)" }} data-key="team_sub">
        {D.team_sub}
      </div>

      <div className="team-row" id="teamRow" style={{ marginTop: 12 }}>
        <div className="member">
          <img src="https://via.placeholder.com/68" alt="Founder" />
          <div style={{ fontWeight: 700 }}>Mr. Amarjeet Gnarly</div>
          <div
            style={{ fontSize: 13, color: "var(--muted)" }}
            data-key="role_founder"
          >
            {D.role_founder}
          </div>
        </div>

        <div className="member">
          <img src="https://via.placeholder.com/68" alt="Chairman" />
          <div style={{ fontWeight: 700 }}>CA (Dr.) Gajanand Gupta</div>
          <div
            style={{ fontSize: 13, color: "var(--muted)" }}
            data-key="role_chair"
          >
            {D.role_chair}
          </div>
        </div>

        <div className="member">
          <img src="https://via.placeholder.com/68" alt="Director" />
          <div style={{ fontWeight: 700 }}>Mrs. Manisha Singh</div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            Executive Planning Director
          </div>
        </div>

        <div className="member">
          <img src="https://via.placeholder.com/68" alt="Head" />
          <div style={{ fontWeight: 700 }}>Mr. Sunil Kumar</div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            International Relations Head
          </div>
        </div>
      </div>
    </section>
  );
}

/* =====================
   Footer
   ===================== */
export function Footer() {
  return (
    <footer
      style={{
        padding: 22,
        textAlign: "center",
        color: "var(--muted)",
        fontSize: 14,
      }}
    >
      <div>
        © <strong>Gnarly Troop Global Federation</strong> — Explore Bharat · 4C
        Vision
      </div>
      <div style={{ marginTop: 8, fontSize: 13, color: "var(--muted)" }}>
        Brochure source: uploaded PDF (open using the Brochure button).
      </div>
    </footer>
  );
}

/* =====================
   Page - default export to place in app/page.tsx
   ===================== */
export default function Page() {
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [modalSrc, setModalSrc] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function openModal(src: string) {
    setModalSrc(src);
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    setModalSrc(null);
    document.body.style.overflow = "";
  }
  function showToast(msg: string, t = 3000) {
    setToast(msg);
    window.setTimeout(() => setToast(null), t);
  }

  // small reveal on scroll replicated from original
  useEffect(() => {
    function handleScroll() {
      document.querySelectorAll(".reveal").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight - 80) el.classList.add("show");
      });
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    // welcome toast on first load
    const id = window.setTimeout(
      () =>
        showToast(
          "Welcome! Try switching language to हिन्दी — हिन्दी के लिए क्लिक करें"
        ),
      800
    );
    return () => window.clearTimeout(id);
  }, []);

  return (
    <>
      <Header lang={lang} setLang={(l) => setLang(l as "en" | "hi")} />
      <main className="wrap">
        <Hero lang={lang} onOpenModal={openModal} showToast={showToast} />
        <section id="about" className="reveal" aria-labelledby="aboutTitle">
          <h3 id="aboutTitle" data-key="about_title">
            {DICT[lang].about_title}
          </h3>
          <p className="lead" data-key="about_text">
            {DICT[lang].about_text}
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 1, minWidth: 220 }}>
              <h4
                style={{ margin: "0 0 6px 0", color: "var(--accent)" }}
                data-key="vision"
              >
                {DICT[lang].vision}
              </h4>
              <p
                style={{ margin: 0, color: "var(--muted)" }}
                data-key="vision_text"
              >
                {DICT[lang].vision_text}
              </p>
            </div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <h4
                style={{ margin: "0 0 6px 0", color: "var(--accent)" }}
                data-key="alignment"
              >
                {DICT[lang].alignment}
              </h4>
              <p
                style={{ margin: 0, color: "var(--muted)" }}
                data-key="alignment_text"
              >
                {DICT[lang].alignment_text}
              </p>
            </div>
          </div>
        </section>

        <section
          id="programs"
          className="reveal"
          aria-labelledby="programsTitle"
        >
          <h3 id="programsTitle" data-key="programs_title">
            {DICT[lang].programs_title}
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 12,
              marginTop: 12,
            }}
          >
            <div
              className="card-small"
              style={{
                padding: 16,
                borderRadius: 10,
                background: "linear-gradient(180deg, #fff, #fcfcff)",
              }}
            >
              <h4 data-key="c1">{DICT[lang].c1}</h4>
              <div
                style={{ color: "var(--muted)", fontSize: 14 }}
                data-key="c1_text"
              >
                {DICT[lang].c1_text}
              </div>
            </div>

            <div
              className="card-small"
              style={{ padding: 16, borderRadius: 10 }}
            >
              <h4 data-key="c2">{DICT[lang].c2}</h4>
              <div
                style={{ color: "var(--muted)", fontSize: 14 }}
                data-key="c2_text"
              >
                {DICT[lang].c2_text}
              </div>
            </div>

            <div
              className="card-small"
              style={{ padding: 16, borderRadius: 10 }}
            >
              <h4 data-key="c3">{DICT[lang].c3}</h4>
              <div
                style={{ color: "var(--muted)", fontSize: 14 }}
                data-key="c3_text"
              >
                {DICT[lang].c3_text}
              </div>
            </div>

            <div
              className="card-small"
              style={{ padding: 16, borderRadius: 10 }}
            >
              <h4 data-key="c4">{DICT[lang].c4}</h4>
              <div
                style={{ color: "var(--muted)", fontSize: 14 }}
                data-key="c4_text"
              >
                {DICT[lang].c4_text}
              </div>
            </div>
          </div>
        </section>

        <Events lang={lang} />
        <Gallery lang={lang} onOpenModal={openModal} />
        <Team lang={lang} />

        <section id="contact" className="reveal" aria-labelledby="contactTitle">
          <h3 id="contactTitle" data-key="contact_title">
            {DICT[lang].contact_title}
          </h3>
          <p style={{ color: "var(--muted)" }} data-key="contact_text">
            {DICT[lang].contact_text}
          </p>
          <ul style={{ color: "var(--muted)" }}>
            <li data-key="contact_web">
              Website: <strong>www.gnarlytroop.org</strong>
            </li>
            <li data-key="contact_phone">
              Phone: <strong>+91 96544 51858</strong>
            </li>
            <li data-key="contact_email">
              Email: <strong>president@gnarlytroop.org</strong>
            </li>
          </ul>

          <div style={{ marginTop: 10 }}>
            <a
              className="btn btn-primary"
              href="/a6cd4240-1449-463d-92b0-e5d210ce9a53.pdf"
              target="_blank"
              data-key="contact_brochure"
            >
              {DICT[lang].contact_brochure}
            </a>
            <a
              className="btn btn-light"
              style={{ marginLeft: 8 }}
              href="mailto:president@gnarlytroop.org"
              data-key="contact_email_btn"
            >
              {DICT[lang].contact_email_btn}
            </a>
          </div>
        </section>
      </main>

      <Footer />

      {/* Modal */}
      <div
        id="modal"
        className={`modal ${modalSrc ? "show" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={modalSrc ? "false" : "true"}
        onClick={(e) => {
          if ((e.target as HTMLElement).id === "modal") closeModal();
        }}
      >
        <div
          className="modal-card"
          role="document"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontWeight: 800 }} id="modalTitle">
              Preview
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="icon-btn"
                onClick={() => {
                  if (modalSrc) window.open(modalSrc, "_blank");
                }}
              >
                ⬇ Save
              </button>
              <button
                className="icon-btn"
                onClick={closeModal}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="modal-grid" style={{ marginTop: 10 }}>
            <img id="modalImg" src={modalSrc ?? ""} alt="Large preview" />
            <div className="modal-info">
              <div id="modalDesc" style={{ color: "var(--muted)" }}>
                {modalSrc?.includes(".pdf")
                  ? "PDF preview — open or download using the button."
                  : "Image preview — use Save or Open."}
              </div>
              <div className="modal-actions">
                <a
                  id="modalOpenLink"
                  className="btn btn-primary"
                  href={modalSrc ?? "#"}
                  target="_blank"
                >
                  Open Original
                </a>
                <button
                  className="btn btn-light"
                  onClick={() => {
                    showToast("Sharing... (demo) — लिंक तैयार है");
                  }}
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div
        id="toast"
        className="toast"
        role="status"
        aria-live="polite"
        style={{ display: toast ? "block" : "none" }}
      >
        {toast}
      </div>
    </>
  );
}
