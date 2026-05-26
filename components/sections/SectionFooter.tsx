import Image from "next/image";
import styles from "@/app/footer.module.css";
import SocialShare from "../SocialShare";
import DonateButton from "@/components/ui/DonateButton";
import { color } from "framer-motion";

export default function Footer() {
  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <img
          src="/images/sections/boat-camel-beach.png"
          style={{
            display: "block",
            margin: "0 auto",
            width: "30%",
            height: "auto",
            marginBottom: "-120px", // overlaps the footer
            position: "relative",
            zIndex: 2,

            /* Soft borders */
            WebkitMaskImage:
              "radial-gradient(circle at center, black 65%, transparent 100%)",
            maskImage:
              "radial-gradient(circle at center, black 65%, transparent 100%)",
            filter: "drop-shadow(0 20px 35px rgba(0,0,0,0.25))",
          }}
        />
      </div>

      <footer className={styles.footerWrapper}>
        <div className={styles.footerDonateBtn}>
          <DonateButton />
        </div>

        <div className={styles.footerContent}>
          <div className={styles.leftCol}>
            <div className={styles.logoBox}>
              <Image
                src="/images/logos/logo-2.png"
                width={350}
                height={180}
                alt="Logo"
              />
            </div>
          </div>
          <SocialShare />

          <div className={styles.rightCol}>
            <ul>
              <li>SUMMIT</li>
              <li>LEADER RESOURCES</li>
              <li>WHO WE ARE</li>
              <li>GIVE</li>
              <li>CAREERS</li>
            </ul>

            <ul>
              <li>CONTACT</li>
              <li>HELP CENTER</li>
              <li>INTERNATIONAL SITE</li>
              <li>SIGN IN</li>
            </ul>
          </div>
        </div>
        <div style={{ color: "white", textAlign: "center", marginTop: "20px" }}>
          {/* <p>© 2026 Gnarly Troop Global Federation. All rights reserved.</p> */}
        </div>
        <div style={{ color: "white", textAlign: "center", marginTop: "20px" }}>
          <p>
            Design and Developed by Technology Partner{" "}
            <a
              target="_blank"
              href="http://itdivine.com/"
              style={{ color: "yellow" }}
            >
              IT Divine Private Limited
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
