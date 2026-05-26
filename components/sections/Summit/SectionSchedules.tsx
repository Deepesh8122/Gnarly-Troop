"use client";

import React, { useState } from "react";
import defaultStyles from "@/app/schedule2.module.css";
import schedule1 from "./SectionSchedules.module.css";
import BrocherDownload from "@/components/ui/BrocherDownload";

export default function SectionSchedules() {
  const [day, setDay] = useState<1 | 2>(1);

  return (
    <section className={defaultStyles.container}>
      {/* PAGE TITLE */}
      <h2 id="schedules-title" className={schedule1.title}>
        Padharo Mhare Desh Bharat - Schedule 2026
      </h2>
      {/* HEADER */}
      <header className={defaultStyles.header}>
        <div className={defaultStyles.headerInner}>
          <div className={defaultStyles.titleWrap}>
            <h1 className={defaultStyles.title}>
              EXPLORE BHARAT WITH GNARLYTROOP
            </h1>

            <div className={defaultStyles.subtitle}>
              <strong>
                <span style={{ color: "var(--accent-2)" }}>Theme: </span>
                <span style={{ color: "var(--accent)" }}>
                  Explore Bharat — Ancient Traditions in Modern Times
                </span>
              </strong>

              <BrocherDownload />

              {/* DAY SWITCHER */}
              <div className={defaultStyles.daySwitcher}>
                <button
                  onClick={() => setDay(1)}
                  className={`${defaultStyles.switchBtn}  ${
                    day === 1 ? defaultStyles.active : ""
                  }`}
                >
                  Day-1
                  {/* <span className={defaultStyles.date}>
                    Day-1 - 21ᵗʰ FEBRUARY 2026 (SATURDAY)
                  </span> */}
                  {/* <span>21ᵗʰ FEBRUARY 2026 (SATURDAY)</span> */}
                </button>

                <button
                  onClick={() => setDay(2)}
                  className={`${defaultStyles.switchBtn} ${
                    day === 2 ? defaultStyles.active : ""
                  }`}
                >
                  Day-2
                  {/* <span>22ⁿᵈ FEBRUARY 2026 (SUNDAY)</span> */}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ------------------ DAY 1 CONTENT ------------------ */}
      {day === 1 && (
        <>
          <div style={{ textAlign: "center" }}>
            <span className={defaultStyles.date}>
              Day-1 - 21ᵗʰ FEBRUARY 2026 (SATURDAY)
            </span>
          </div>
          {/* ------------------ FULL DAY 1 SCHEDULE ------------------ */}
          <div className={defaultStyles.timelineWrap}>
            {/* LEFT COLUMN */}
            <div className={defaultStyles.colLeft}>
              {/* 09:00 AM */}
              <article
                className={`${defaultStyles.card} ${defaultStyles.blue}`}
              >
                <time className={defaultStyles.time}>09:00 AM — 10:00 AM</time>
                <h3 className={defaultStyles.cardTitle}>
                  Delegate Registration & Traditional Welcome
                </h3>

                <ul className={defaultStyles.cardBody}>
                  <li>
                    Guard of Honour by Sainik School Cadets | Tilak & Turban
                    Ceremony.
                  </li>
                  <li>
                    Live Folk Instrumental Ensemble • Cultural Souvenir
                    Distribution & Networking Tea.
                  </li>
                </ul>

                <h3 className={defaultStyles.cardTitle}>
                  CEREMONIAL HIGHLIGHTS
                </h3>

                <ul className={defaultStyles.cardBody}>
                  <li>
                    <b>Invocation:</b> Vande Mataram by School Choir
                  </li>
                  <li>
                    <b>Welcome Address:</b> President, Gnarly Troop Global
                    Federation
                  </li>
                  <li>
                    <b>Guest Address:</b> Hon'ble Prime Minister of India
                  </li>
                  <li>
                    <b>Keynote Address:</b> Hon'ble Union Minister of Culture
                  </li>
                  <li>
                    <b>Special Address:</b> UN Cultural Envoy / Ambassador
                  </li>
                  <li>
                    <b>Vote of Thanks:</b> Chief Adviser, Gnarly Troop Global
                    Federation
                  </li>
                </ul>
              </article>

              {/* 10:00 AM */}
              <article
                className={`${defaultStyles.card} ${defaultStyles.orange}`}
              >
                <time className={defaultStyles.time}>10:00 AM — 10:45 AM</time>
                <h3 className={defaultStyles.cardTitle}>
                  Inaugural Ceremony & Lamp Lighting
                </h3>

                <p className={defaultStyles.cardBody}>
                  <span style={{ color: "var(--accent)" }}>
                    <b>Invited Dignitaries:</b>
                  </span>{" "}
                  <b>
                    Hon'ble Prime Minister of India (Chief Guest) | Union
                    Minister of Culture | Parliamentarians | Ambassadors |
                    Cultural Leaders
                  </b>
                </p>
              </article>

              {/* 10:45 AM */}
              <article
                className={`${defaultStyles.card} ${defaultStyles.cyan}`}
              >
                <time className={defaultStyles.time}>10:45 AM — 11:45 AM</time>
                <h3 className={defaultStyles.cardTitle}>Parliamentary Talk</h3>

                <ul className={defaultStyles.cardBody}>
                  <li>
                    <b>Theme:</b> Policy and Parliament: Preserving Heritage
                  </li>
                  <li>
                    <b>Focus:</b> Strengthening heritage tourism & youth
                    participation
                  </li>
                  <li>
                    <b>Panelists:</b> MPs | Think Tank Experts | Advisors
                  </li>
                </ul>
              </article>

              {/* 11:45 AM */}
              <article
                className={`${defaultStyles.card} ${defaultStyles.cyan}`}
              >
                <time className={defaultStyles.time}>11:45 AM — 12:45 AM</time>
                <h3 className={defaultStyles.cardTitle}>LEADERS TALK</h3>

                <ul className={defaultStyles.cardBody}>
                  <li>
                    <b>Topic:</b> Reimagining Bharat – Ancient Traditions
                    Through a Modern Lens
                  </li>
                  <li>
                    <b>Focus:</b> Cultural wisdom with innovation
                  </li>
                  <li>
                    <b>Speakers:</b> Cultural Entrepreneurs | Tourism Heads |
                    Thought Leaders
                  </li>
                </ul>
              </article>
            </div>

            {/* TIMELINE CENTER */}
            <div className={defaultStyles.timelineCenter}>
              <div className={defaultStyles.centerLine} />
              <div className={defaultStyles.centerDots}>
                <span className={defaultStyles.dot} style={{ top: "18%" }} />
                <span className={defaultStyles.dot} style={{ top: "32%" }} />
                <span className={defaultStyles.dot} style={{ top: "46%" }} />
                <span className={defaultStyles.dot} style={{ top: "66%" }} />
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className={defaultStyles.colRight}>
              {/* 12:45 PM */}
              <article
                className={`${defaultStyles.card} ${defaultStyles.green}`}
              >
                <time className={defaultStyles.time}>12:45 PM — 1:30 PM</time>
                <h3 className={defaultStyles.cardTitle}>
                  Networking High Tea & Lunch Break
                </h3>
                <p className={defaultStyles.cardBody}>
                  • Live Folk Music • Exhibition Visit • Media Interaction
                </p>
              </article>

              {/* 1:30 PM */}
              <article
                className={`${defaultStyles.card} ${defaultStyles.lightBlue}`}
              >
                <time className={defaultStyles.time}>1:30 PM — 2:45 PM</time>
                <h3 className={defaultStyles.cardTitle}>Ambassadors Talk</h3>

                <ul className={defaultStyles.cardBody}>
                  <li>
                    <b>Topic:</b> Youth Leadership & Rural Empowerment
                  </li>
                  <li>
                    <b>Focus:</b> Global exchanges & diplomacy
                  </li>
                  <li>
                    <b>Speakers:</b> Youth Ambassadors | NGO Leaders
                  </li>
                </ul>

                <h3 className={defaultStyles.cardTitle}>HONOURING</h3>
                <ul className={defaultStyles.cardBody}>
                  <li>Distinguished Ambassadors</li>
                  <li>Rural Innovators</li>
                  <li>Youth & Women Leaders</li>
                  <li>
                    <b>Chief Guest:</b> Minister of External Affairs
                  </li>
                  <li>
                    <b>Presentation:</b> Mementoes & Certificates
                  </li>
                </ul>
              </article>

              {/* 3PM */}
              <article
                className={`${defaultStyles.card} ${defaultStyles.purple}`}
              >
                <time className={defaultStyles.time}>3:00 PM — 4:30 PM</time>
                <h3 className={defaultStyles.cardTitle}>Ministers Talk</h3>
                <p className={defaultStyles.cardBody}>
                  National Recognition & Leadership Awards Ceremony
                </p>
              </article>

              {/* 4:30 PM */}
              <article
                className={`${defaultStyles.card} ${defaultStyles.green}`}
              >
                <time className={defaultStyles.time}>4:30 PM — 6:30 PM</time>
                <h3 className={defaultStyles.cardTitle}>Rangilo Bharat</h3>
                <p className={defaultStyles.cardBody}>
                  • Tribal & Folk Performances <br />
                  • Poetry Recitals <br />
                  • Spiritual Harmony Talk <br />• Artisan Handicraft Exhibition
                </p>
              </article>

              {/* 6:30 PM */}
              <article
                className={`${defaultStyles.card} ${defaultStyles.dark}`}
              >
                <time className={defaultStyles.time}>6:30 PM — 7:30 PM</time>
                <h3 className={defaultStyles.cardTitle}>
                  Gala Networking Dinner
                </h3>
                <p className={defaultStyles.cardBody}>
                  <b>Guests:</b> Diplomats | Delegates | Media | Artists
                </p>
              </article>
            </div>
          </div>

          {/* FOOTER */}
          <footer className={schedule1.footer}>
            <div className={schedule1.footerCard}>
              <div className={schedule1.leftCol}>
                <strong>Exhibition & Networking Pavilion</strong>
                <p className={schedule1.meta}>
                  Official Hashtag:
                  <span className={schedule1.tag}> #ExploreBharat2026</span>
                </p>
                <p className={schedule1.small}>
                  Dress Code: Ethnic / Formal | Entry: Registration Only
                </p>
              </div>

              <div className={schedule1.imageWrap}>
                <img
                  src={"/images/sections/bharat-mandapam.png"}
                  className={schedule1.inlineImage}
                  alt="Mandapam"
                />
              </div>

              <div className={schedule1.rightCol}>
                <p className={schedule1.highlight}>SPECIAL HIGHLIGHT</p>
                <h4 className={schedule1.flagOff}>
                  Flag-Off Ceremony - Explore Bharat Campaign
                </h4>
                <p className={schedule1.small}>
                  By Hon'ble Vice President of India & Youth Leaders
                </p>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* ------------------ DAY 2 CONTENT ------------------ */}
      {day === 2 && (
        <div className={defaultStyles.day2Wrap}>
          <>
            <div style={{ textAlign: "center" }}>
              <span className={defaultStyles.date}>
                Day-2 - 22ⁿᵈ FEBRUARY 2026 (SUNDAY)
              </span>
            </div>
            {/* ------------------ FULL DAY 1 SCHEDULE ------------------ */}
            <div className={defaultStyles.timelineWrap}>
              {/* LEFT COLUMN */}
              <div className={defaultStyles.colLeft}>
                {/* 09:00 AM */}
                <article
                  className={`${defaultStyles.card} ${defaultStyles.blue}`}
                >
                  <time className={defaultStyles.time}>
                    09:00 AM — 10:00 AM
                  </time>
                  <h3 className={defaultStyles.cardTitle}>
                    REGISTRATION & MORNING TEA
                  </h3>

                  <p className={defaultStyles.cardBody}>
                    Musical Prelude by National Youth Orchestra
                  </p>
                </article>

                {/* 10:00 AM */}
                <article
                  className={`${defaultStyles.card} ${defaultStyles.orange}`}
                >
                  <time className={defaultStyles.time}>
                    10:00 AM — 10:45 AM
                  </time>
                  <h3 className={defaultStyles.cardTitle}>
                    YOUTH DIALOGUE FORUM
                  </h3>

                  <p className={defaultStyles.cardBody}>
                    <b>Theme: </b>Empowering Young Minds for Troop Spirit,
                    Unity, and Sustainability Interactive dialogue between
                    students, eco-volunteers, and entrepreneurs <br />
                    <b>Special Launch: </b>
                    Motto by Chief Guest Hon'ble Union Minister of Defence
                    (invited) – “My Country, My Responsibility, My Pride”
                  </p>
                </article>

                {/* 10:45 AM */}
                <article
                  className={`${defaultStyles.card} ${defaultStyles.cyan}`}
                >
                  <time className={defaultStyles.time}>
                    10:45 AM — 11:45 AM
                  </time>
                  <h3 className={defaultStyles.cardTitle}>
                    PARLIAMENTARY TALK
                  </h3>

                  <p className={defaultStyles.cardBody}>
                    <b>Topic:</b> Youth Leadership in Driving Sustainability &
                    Cultural Tourism
                    <br />
                    <b>Panelists:</b> MPs | Youth Icons | Sustainability Experts
                  </p>
                </article>

                {/* 11:45 AM */}
                <article
                  className={`${defaultStyles.card} ${defaultStyles.cyan}`}
                >
                  <time className={defaultStyles.time}>
                    11:45 AM — 12:30 PM
                  </time>
                  <h3 className={defaultStyles.cardTitle}>AWARDS CEREMONY</h3>

                  <p className={defaultStyles.cardBody}>
                    <b>Recognizing:</b>
                    <br />• Cultural Changemakers | Youth Ambassadors
                    <br />• Sustainable Development Leaders <br />
                    <b>Chief Guest: </b> Hon'ble Minister of Youth Affairs &
                    Sports
                  </p>
                </article>

                {/* 12:30 PM */}
                <article
                  className={`${defaultStyles.card} ${defaultStyles.green}`}
                >
                  <time className={defaultStyles.time}>12:30 PM — 2:00 PM</time>
                  <h3 className={defaultStyles.cardTitle}>AMBASSADORS FORUM</h3>
                  <p className={defaultStyles.cardBody}>
                    <b>Theme: </b>Voices of Tomorrow – Youth for Global India
                    Presentations by 10 Youth Ambassadors from Indian States &
                    Partner Nations Networking Lunch & Interaction
                  </p>
                </article>
              </div>

              {/* TIMELINE CENTER */}
              <div className={defaultStyles.timelineCenter}>
                <div className={defaultStyles.centerLine} />
                <div className={defaultStyles.centerDots}>
                  <span className={defaultStyles.dot} style={{ top: "18%" }} />
                  <span className={defaultStyles.dot} style={{ top: "32%" }} />
                  <span className={defaultStyles.dot} style={{ top: "46%" }} />
                  <span className={defaultStyles.dot} style={{ top: "66%" }} />
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className={defaultStyles.colRight}>
                {/* 2:00 PM */}
                <article
                  className={`${defaultStyles.card} ${defaultStyles.lightBlue}`}
                >
                  <time className={defaultStyles.time}>2:00 PM — 3:00 PM</time>
                  <h3 className={defaultStyles.cardTitle}>LEADERS TALK</h3>

                  <p className={defaultStyles.cardBody}>
                    <b>Topic: </b>Heritage & Business: CSR and Innovation for
                    Cultural Preservation
                    <br />
                    <b>Focus: </b>Integrating sustainability and business
                    innovation for cultural continuity
                    <br />
                    <b>Speakers: </b>CEOs | CSR Heads | Cultural Policy Experts
                  </p>
                </article>

                {/* 3PM */}
                <article
                  className={`${defaultStyles.card} ${defaultStyles.purple}`}
                >
                  <time className={defaultStyles.time}>3:00 PM — 3:30 PM</time>
                  <h3 className={defaultStyles.cardTitle}>
                    GRAND FLAG-OFF CEREMONY
                  </h3>
                  <p className={defaultStyles.cardBody}>
                    <b>Flag-Off By: </b>Hon'ble Vice President of India
                    <br />
                    <b>With:</b>
                    Cultural Icons | Youth Delegates | Diplomats
                    <br />
                    <b>Highlights: </b>• Launch of Explore Bharat Cultural Bus
                    Campaign • National Anthem & Cultural Parade • Release of
                    Official Hashtag: #ExploreBharat2026 • Group Photo & Media
                    Interaction
                  </p>
                </article>

                {/* 3:30 PM */}
                <article
                  className={`${defaultStyles.card} ${defaultStyles.green}`}
                >
                  <time className={defaultStyles.time}>3:30 PM — 5:00 PM</time>
                  <h3 className={defaultStyles.cardTitle}>
                    CULTURAL EXCHANGE DIALOGUES
                  </h3>
                  <p className={defaultStyles.cardBody}>
                    <b>Theme: </b>Harmony Beyond Borders – India's Cultural
                    Diplomacy in Action
                    <br />
                    <b>Speakers: </b>Ambassadors | Ministers | Spiritual Leaders
                    <br />
                    <b>Keynotes: </b>H.E. Ambassadors & Spiritual Luminaries
                    <br />
                    <b>Closing Remarks: </b>Executive Chair of Governance
                    (Padharo Mhare Desh Bharat Committee)
                  </p>
                </article>

                {/* 5:00 PM */}
                <article
                  className={`${defaultStyles.card} ${defaultStyles.dark}`}
                >
                  <time className={defaultStyles.time}>5:00 PM Onwards</time>
                  <h3 className={defaultStyles.cardTitle}>
                    INTER-CULTURAL EVENING
                  </h3>
                  <p className={defaultStyles.cardBody}>
                    Inter-Cultural Evening & Closing Networking Reception
                    <br />
                    <b>Highlights: </b>Gala Celebration | Farewell Music |
                    Cultural Souvenir |Distribution | Diplomatic Photo Session
                  </p>
                </article>
              </div>
            </div>

            {/* FOOTER */}
            <footer className={schedule1.footer}>
              <div className={schedule1.footerCard}>
                <div className={schedule1.leftCol}>
                  <strong>Exhibition & Networking Pavilion</strong>
                  <p className={schedule1.meta}>
                    Official Hashtag:
                    <span className={schedule1.tag}> #ExploreBharat2026</span>
                  </p>
                  <p className={schedule1.small}>
                    Dress Code: Ethnic / Formal | Entry: Registration Only
                  </p>
                </div>

                <div className={schedule1.imageWrap}>
                  <img
                    src={"/images/sections/bharat-mandapam.png"}
                    className={schedule1.inlineImage}
                    alt="Mandapam"
                  />
                </div>

                <div className={schedule1.rightCol}>
                  <p className={schedule1.highlight}>SPECIAL HIGHLIGHT</p>
                  <h4 className={schedule1.flagOff}>
                    Flag-Off Ceremony - Explore Bharat Campaign
                  </h4>
                  <p className={schedule1.small}>
                    By Hon'ble Vice President of India & Youth Leaders
                  </p>
                </div>
              </div>
            </footer>
          </>
        </div>
      )}
    </section>
  );
}
