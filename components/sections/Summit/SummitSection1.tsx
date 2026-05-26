"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SummitSection1.module.css";
import SectionSummit2 from "@/components/sections/Summit/SummitSection2";
import BrocherDownload from "@/components/ui/BrocherDownload";

const SectionSummit: React.FC = () => {
  const router = useRouter();

  const handleRegistrationClick = () => {
    router.push("/registration");
  };

  return (
    <>
      <section className={styles.section} id="sectionSummit">
        <div className={styles.inner}>
          {/* TOP — BHARAT MANDAPAM IMAGE */}
          <div className={styles.mandapamWrapper}>
            <img
              src="/images/sections/bharat-mandapam-g20-summit-icon.png"
              alt="Bharat Mandapam"
              className={styles.mandapamImage}
            />
          </div>

          {/* HEADING AREA */}
          <h1 className={styles.heading}>
            PADHARO MHARE DESH BHARAT GLOBAL LEADERSHIP SUMMIT
            <br />& CULTURAL EXCHANGE-2026
          </h1>

          <p className={styles.dates}>21st - 22nd FEBRUARY, 2026</p>
          <div>
            <ul
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              <li>
                <button
                  type="button"
                  onClick={handleRegistrationClick}
                  className={styles.registrationButton}
                >
                  Register Now
                </button>
              </li>
              <li
                style={{
                  marginBottom: "16px",
                }}
              >
                <BrocherDownload />
              </li>
            </ul>
          </div>

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
          <SectionSummit2 />
        </div>
      </section>
    </>
  );
};

export default SectionSummit;
