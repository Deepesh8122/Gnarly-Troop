"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "@/app/footer.module.css";
import SocialShare from "../SocialShare";
import DonateButton from "@/components/ui/DonateButton";

type NavItem = {
  id: string;
  label: string;
  url?: string;
  target?: string;
};

type FooterMeta = {
  copyright: string;
  donationUrl: string;
};

const FALLBACK_COL1: NavItem[] = [
  { id: "1", label: "Summit", url: "/registration/" },
  { id: "2", label: "Leadership", url: "/leadership/" },
  { id: "3", label: "Collaboration", url: "/collaboration/" },
  { id: "4", label: "Give", url: "/collaboration/donation/" },
];

const FALLBACK_COL2: NavItem[] = [
  { id: "5", label: "Contact", url: "/contact/" },
  { id: "6", label: "Help Center", url: "/help-center/" },
  { id: "7", label: "Registration", url: "/registration/" },
  { id: "8", label: "Sign In", url: "/admin/login/" },
];

function splitColumns(items: NavItem[]): [NavItem[], NavItem[]] {
  if (items.length === 0) return [FALLBACK_COL1, FALLBACK_COL2];
  const mid = Math.ceil(items.length / 2);
  return [items.slice(0, mid), items.slice(mid)];
}

function FooterLinkList({ items }: { items: NavItem[] }) {
  return (
    <ul>
      {items.map((item) => {
        const href = item.url ?? "#";
        const external = item.target === "_blank" || /^https?:\/\//i.test(href);
        return (
          <li key={item.id}>
            {external ? (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {item.label}
              </a>
            ) : (
              <Link href={href}>{item.label}</Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function Footer() {
  const [col1, setCol1] = useState<NavItem[]>(FALLBACK_COL1);
  const [col2, setCol2] = useState<NavItem[]>(FALLBACK_COL2);
  const [copyright, setCopyright] = useState(
    `© ${new Date().getFullYear()} Gnarly Troop Global Federation. All rights reserved.`,
  );

  useEffect(() => {
    fetch("/api/navigation?menu=footer-quick")
      .then((r) => r.json())
      .then((data: { items?: NavItem[] }) => {
        if (data.items?.length) {
          const [a, b] = splitColumns(data.items);
          setCol1(a);
          setCol2(b);
        }
      })
      .catch(() => {
        /* keep fallback */
      });

    fetch("/api/site/footer")
      .then((r) => r.json())
      .then((data: FooterMeta) => {
        if (data.copyright) setCopyright(data.copyright);
      })
      .catch(() => {
        /* keep default */
      });
  }, []);

  return (
    <div>
      <div style={{ textAlign: "center" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/sections/boat-camel-beach.png"
          alt=""
          style={{
            display: "block",
            margin: "0 auto",
            width: "30%",
            height: "auto",
            marginBottom: "-120px",
            position: "relative",
            zIndex: 2,
            WebkitMaskImage:
              "radial-gradient(circle at center, black 65%, transparent 100%)",
            maskImage: "radial-gradient(circle at center, black 65%, transparent 100%)",
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
                alt="Gnarly Troop Global Federation"
              />
            </div>
          </div>
          <SocialShare />

          <div className={styles.rightCol}>
            <FooterLinkList items={col1} />
            <FooterLinkList items={col2} />
          </div>
        </div>
        <div style={{ color: "white", textAlign: "center", marginTop: "20px" }}>
          <p>{copyright}</p>
        </div>
      </footer>
    </div>
  );
}
