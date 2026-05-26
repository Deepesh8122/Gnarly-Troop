"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SectionSummit.module.css";

type SummitItemId =
  | "parliamentarians"
  | "ambassadors"
  | "ceos"
  | "academicians";

interface SummitItem {
  id: SummitItemId;
  title: string;
  subtitle: string;
}

const summitItems: SummitItem[] = [
  {
    id: "parliamentarians",
    title: "Hon'ble Parliamentarians & Union Ministers",
    subtitle: " ",
  },
  {
    id: "ambassadors",
    title: "Ambassadors & Diplomats from partner nations",
    subtitle: " ",
  },
  {
    id: "ceos",
    title: "CEOs, Cultural Icons and Youth Leaders",
    subtitle: " ",
  },
  {
    id: "academicians",
    title: "Academicians, Entrepreneurs and Global Thinkers",
    subtitle: " ",
  },
];

const SectionSummit: React.FC = () => {
  const [activeItem, setActiveItem] = useState<SummitItemId | null>(null);
  const router = useRouter();

  const handleRegistrationClick = () => {
    router.push("/registration");
  };

  return (
    <>
      <section className={styles.section}>
        <div className={styles.inner}>
          {/* TOP — BHARAT MANDAPAM IMAGE */}
          <div className={styles.mandapamWrapper}>
            <img
              src="/images/sections/bharat-mandapam.png"
              alt="Bharat Mandapam"
              className={styles.mandapamImage}
            />
          </div>

          {/* HEADING AREA */}
          <h1 className={styles.heading}>
            PADHARO MHARE DESH BHARAT GLOBAL LEADERSHIP SUMMIT
            <br />& CULTURAL EXCHANGE-2026
          </h1>
          <a
            href="/documents/Brochure.pdf"
            target="_blank"
            className={styles.dates}
          >
            Download Brochure
          </a>

          <p className={styles.dates}>21st - 22nd FEBRUARY, 2026</p>

          <button
            type="button"
            onClick={handleRegistrationClick}
            className={styles.registrationButton}
          >
            Register Now
          </button>

          <p className={styles.venue}>VENUE : BHARAT MANDAPAM</p>

          {/* PM IMAGE + QUOTE */}
          <div className={styles.bottomLayout}>
            <div className={styles.pmColumn}>
              <img
                src="/images/sections/pm-img.png"
                alt="Prime Minister of India"
                className={styles.pmImage}
              />
            </div>

            <div className={styles.textColumn}>
              <p className={styles.quote}>
                “Today,{" "}
                <span style={{ color: "#1155cc" }}>
                  across its streets and institutions
                </span>
                , in its villages and cities, anchored in equal respect for all
                faiths; and in the melody of hundreds of its languages and
                dialects, India lives as one; India grows as one;{" "}
                <span style={{ color: "#1155cc" }}>
                  India celebrates as one
                </span>
                .”
              </p>

              <p className={styles.quoteAttribution}>
                – Shri Narendra Modi, Hon&apos;ble Prime Minister of India
              </p>
            </div>
          </div>

          {/* POPUP BUTTONS – BELOW IMAGE & QUOTE */}
          <div className={styles.participantRow}>
            {summitItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <button
                  className={styles.participantCard}
                  onClick={() => setActiveItem(item.id)}
                >
                  <span className={styles.participantTitle}>{item.title}</span>
                  <span className={styles.participantSubtitle}>
                    {item.subtitle}
                  </span>
                </button>
                {index < summitItems.length - 1 && (
                  <span className={styles.participantSeparator}>//</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL */}
      {activeItem && (
        <Modal onClose={() => setActiveItem(null)}>
          {activeItem === "parliamentarians" && <ParliamentariansContent />}
          {activeItem === "ambassadors" && <AmbassadorsContent />}
          {activeItem === "ceos" && <CeosContent />}
          {activeItem === "academicians" && <AcademiciansContent />}
        </Modal>
      )}
    </>
  );
};

/* Modal & Content Components */

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => (
  <div className={styles.modalOverlay} onClick={onClose}>
    <div className={styles.modalBody} onClick={(e) => e.stopPropagation()}>
      <button className={styles.modalClose} onClick={onClose}>
        ×
      </button>
      {children}
    </div>
  </div>
);

const ParliamentariansContent: React.FC = () => (
  <div className={styles.modalContent}>
    <h3>Hon&apos;ble Parliamentarians &amp; Union Ministers</h3>
    <p>
      <strong>
        Theme:{" "}
        <em>
          Democratic Leadership, Cultural Sovereignty &amp; India&rsquo;s Global
          Responsibility
        </em>
      </strong>
    </p>
    <p>
      <strong>Purpose &amp; National Context</strong>
    </p>
    <p>
      This high-level panel shall deliberate on India&rsquo;s constitutional
      ethos, democratic traditions, and civilizational leadership in shaping a
      responsible global order. The session will reaffirm India&rsquo;s
      commitment to <strong>Vasudhaiva Kutumbakam</strong>, democratic
      diplomacy, and inclusive development.
    </p>
    <p>
      <strong>Key Objectives</strong>
    </p>
    <ul>
      <li>
        To articulate India&rsquo;s national vision for cultural diplomacy and
        global leadership
      </li>
      <li>
        To align legislative and executive perspectives with India&rsquo;s soft
        power strategy
      </li>
      <li>
        To strengthen India&rsquo;s role in global peace, sustainability, and
        cooperation
      </li>
    </ul>
    <p>
      <strong>Panel Composition</strong>
    </p>
    <ul>
      <li>Hon&rsquo;ble Members of Parliament</li>
      <li>
        Hon&rsquo;ble Union Ministers (Culture, Tourism, External Affairs, Youth
        Affairs, Rural Development, Environment, Education)
      </li>
      <li>Senior Parliamentary Committee Representatives</li>
    </ul>
    <p>
      <strong>Core Discussion Tracks</strong>
    </p>
    <ol>
      <li>
        <strong>
          India&rsquo;s Democratic Legacy &amp; Civilizational Ethos
        </strong>
      </li>
      <li>
        <strong>Cultural Nationalism as Soft Power</strong>
      </li>
      <li>
        <strong>Policy Frameworks for Global Cultural Engagement</strong>
      </li>
      <li>
        <strong>
          Youth-Driven Nation Branding &amp; Global Representation
        </strong>
      </li>
      <li>
        <strong>
          Legislative Support for Cultural &amp; Tourism Diplomacy
        </strong>
      </li>
    </ol>
    <p>
      <strong>Expected Outcomes</strong>
    </p>
    <ul>
      <li>
        Strategic policy recommendations for national and global cultural
        engagement
      </li>
      <li>
        Strengthened inter-ministerial convergence for flagship initiatives
      </li>
      <li>
        A formal communiqu&eacute; reinforcing India&rsquo;s democratic and
        cultural leadership
      </li>
    </ul>
  </div>
);

const AmbassadorsContent: React.FC = () => (
  <div className={styles.modalContent}>
    <h3>Ambassadors &amp; Diplomats</h3>
    <p>Strengthening global partnerships and cultural cooperation.</p>
  </div>
);

const CeosContent: React.FC = () => (
  <div className={styles.modalContent}>
    <h3>CEOs, Cultural Icons &amp; Youth Leaders</h3>
    <p>Innovation, leadership, and youth-driven transformation.</p>
  </div>
);

const AcademiciansContent: React.FC = () => (
  <div className={styles.modalContent}>
    <h3>Academicians, Entrepreneurs &amp; Global Thinkers</h3>
    <p>Ideas shaping the future of inclusive global growth.</p>
  </div>
);

export default SectionSummit;
