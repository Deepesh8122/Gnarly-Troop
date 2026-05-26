"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./SummitSection2.module.css";

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
    subtitle: "",
  },
  {
    id: "ambassadors",
    title: "Ambassadors & Diplomats from partner nations",
    subtitle: "",
  },
  {
    id: "ceos",
    title: "CEOs, Cultural Icons and Youth Leaders",
    subtitle: "",
  },
  {
    id: "academicians",
    title: "Academicians, Entrepreneurs and Global Thinkers",
    subtitle: "",
  },
];

/* ---------------- CONTENT MAP ---------------- */

const contentMap: Record<SummitItemId, React.ReactNode> = {
  parliamentarians: (
    <div className={styles.modalContent}>
      <h3>Hon&apos;ble Parliamentarians &amp; Union Ministers</h3>

      <p>
        <strong>
          Theme:{" "}
          <em>
            Democratic Leadership, Cultural Sovereignty &amp; India&rsquo;s
            Global Responsibility
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
          To align legislative and executive perspectives with India&rsquo;s
          soft power strategy
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
          Hon&rsquo;ble Union Ministers (Culture, Tourism, External Affairs,
          Youth Affairs, Rural Development, Environment, Education)
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
      <br />
      <hr />
    </div>
  ),

  ambassadors: (
    <div className={styles.modalContent}>
      <h3>Ambassadors &amp; Diplomats</h3>
      <p>
        <strong>
          Theme:{" "}
          <em>
            Cultural Diplomacy, Global Friendship &amp; Shared Civilizational
            Values
          </em>
        </strong>
      </p>
      <p>
        <strong>Purpose &amp; Diplomatic Context</strong>
      </p>
      <p>
        This session shall serve as a platform for international dialogue,
        strengthening bilateral and multilateral cultural ties, and advancing
        people-to-people diplomacy through shared heritage and cooperation.
      </p>
      <p>
        <strong>Key Objectives</strong>
      </p>
      <ul>
        <li>To deepen diplomatic collaboration through cultural exchange</li>
        <li>To position India as a global cultural convenor</li>
        <li>To promote mutual respect, peace, and sustainable development</li>
      </ul>
      <p>
        <strong>Panel Composition</strong>
      </p>
      <ul>
        <li>Resident and Non-Resident Ambassadors</li>
        <li>High Commissioners and Heads of Diplomatic Missions</li>
        <li>Representatives from International Cultural Organizations</li>
      </ul>
      <p>
        <strong>Core Discussion Tracks</strong>
      </p>
      <ol>
        <li>
          <strong>Culture as the Foundation of Diplomacy</strong>
        </li>
        <li>
          <strong>India&rsquo;s Role in Global Cultural Dialogue</strong>
        </li>
        <li>
          <strong>Collaborative Youth &amp; Educational Exchanges</strong>
        </li>
        <li>
          <strong>Tourism, Heritage &amp; Sustainable Partnerships</strong>
        </li>
        <li>
          <strong>Strengthening Multilateral Cultural Platforms</strong>
        </li>
      </ol>
      <p>
        <strong>Expected Outcomes</strong>
      </p>
      <ul>
        <li>Bilateral and multilateral cooperation frameworks</li>
        <li>Cultural exchange agreements and MoUs</li>
        <li>Joint declarations reinforcing global cultural unity</li>
      </ul>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <br />
      <hr />
    </div>
  ),

  ceos: (
    <div className={styles.modalContent}>
      <h3>CEOs, Cultural Icons &amp; Youth Leaders</h3>
      <p>
        <strong>
          Theme:{" "}
          <em>Innovation, Influence &amp; Youth-Led Global Transformation</em>
        </strong>
      </p>
      <p>
        <strong>Purpose &amp; Strategic Context</strong>
      </p>
      <p>
        This session shall explore the convergence of enterprise, creativity,
        and youth leadership in shaping India&rsquo;s contemporary global
        identity and sustainable future.
      </p>
      <p>
        <strong>Key Objectives</strong>
      </p>
      <ul>
        <li>To integrate corporate leadership with cultural responsibility</li>
        <li>To empower youth as global ambassadors of India</li>
        <li>To promote innovation aligned with national values</li>
      </ul>
      <p>
        <strong>Panel Composition</strong>
      </p>
      <ul>
        <li>CEOs and Industry Leaders</li>
        <li>Renowned Cultural Icons (Art, Cinema, Literature, Sports)</li>
        <li>National &amp; International Youth Leaders</li>
      </ul>
      <p>
        <strong>Core Discussion Tracks</strong>
      </p>
      <ol>
        <li>
          <strong>Corporate Citizenship &amp; Cultural Stewardship</strong>
        </li>
        <li>
          <strong>Creative Industries as Global Ambassadors</strong>
        </li>
        <li>
          <strong>Youth Leadership in Nation Branding</strong>
        </li>
        <li>
          <strong>Innovation, Sustainability &amp; Inclusive Growth</strong>
        </li>
        <li>
          <strong>Public-Private Partnerships for Cultural Promotion</strong>
        </li>
      </ol>
      <p>
        <strong>Expected Outcomes</strong>
      </p>
      <ul>
        <li>Youth and industry-driven cultural initiatives</li>
        <li>Strategic partnerships supporting national flagship missions</li>
        <li>Action plans for global youth engagement and innovation</li>
      </ul>
      <br />
      <hr />
    </div>
  ),

  academicians: (
    <div className={styles.modalContent}>
      <h3>Academicians, Entrepreneurs &amp; Global Thinkers</h3>
      <p>
        <strong>
          Theme:{" "}
          <em>
            Knowledge Systems, Innovation &amp; Thought Leadership for a Global
            India
          </em>
        </strong>
      </p>
      <p>
        <strong>Purpose &amp; Intellectual Context</strong>
      </p>
      <p>
        This session shall highlight India&rsquo;s intellectual heritage and
        contemporary thought leadership, integrating traditional wisdom with
        modern innovation for global problem-solving.
      </p>
      <p>
        <strong>Key Objectives</strong>
      </p>
      <ul>
        <li>To showcase India&rsquo;s academic and intellectual leadership</li>
        <li>To promote research-based cultural and policy innovation</li>
        <li>To foster global knowledge partnerships</li>
      </ul>
      <p>
        <strong>Panel Composition</strong>
      </p>
      <ul>
        <li>Distinguished Academicians &amp; Chancellors</li>
        <li>Entrepreneurs &amp; Startup Founders</li>
        <li>Global Thinkers, Policy Experts &amp; Researchers</li>
      </ul>
      <p>
        <strong>Core Discussion Tracks</strong>
      </p>
      <ol>
        <li>
          <strong>
            India&rsquo;s Knowledge Traditions &amp; Modern Education
          </strong>
        </li>
        <li>
          <strong>Innovation Ecosystems &amp; Global Entrepreneurship</strong>
        </li>
        <li>
          <strong>Think Tanks &amp; Policy Influence</strong>
        </li>
        <li>
          <strong>Digital Knowledge, AI &amp; Cultural Preservation</strong>
        </li>
        <li>
          <strong>Future Leadership Models for Global Cooperation</strong>
        </li>
      </ol>
      <p>
        <strong>Expected Outcomes</strong>
      </p>
      <ul>
        <li>Academic and research collaboration frameworks</li>
        <li>Innovation-driven policy insights</li>
      </ul>
      <p>Global knowledge networks aligned with India&rsquo;s vision</p>
      <br />
      <hr />
    </div>
  ),
};

/* ---------------- MODAL ---------------- */

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  /* ESC CLOSE */
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  /* BACKGROUND SCROLL LOCK */
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  /* FOCUS TRAP */
  useEffect(() => {
    if (!dialogRef.current) return;

    const focusable = dialogRef.current.querySelectorAll<
      HTMLButtonElement | HTMLAnchorElement | HTMLInputElement | HTMLElement
    >(
      'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          (last as HTMLElement)?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          (first as HTMLElement)?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className={styles.modalOverlay}
        role="dialog"
        aria-modal="true"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          ref={dialogRef}
          className={styles.modalBody}
          onClick={(e) => e.stopPropagation()}
          initial={{ y: 40, scale: 0.97, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 40, scale: 0.97, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <button
            className={styles.modalClose}
            aria-label="Close dialog"
            onClick={onClose}
          >
            ×
          </button>

          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ---------------- MAIN COMPONENT ---------------- */

const SectionSummit: React.FC = () => {
  const [activeItem, setActiveItem] = useState<SummitItemId | null>(null);
  const router = useRouter();

  return (
    <>
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

      <AnimatePresence>
        {activeItem && (
          <Modal onClose={() => setActiveItem(null)}>
            {contentMap[activeItem]}
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default SectionSummit;
