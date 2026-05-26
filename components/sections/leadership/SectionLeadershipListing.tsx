"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { LeadershipItem } from "@/src/lib/leadership";
import styles from "./SectionLeadershipListing.module.css";

type Props = {
  executive: LeadershipItem[];
  board: LeadershipItem[];
  advisory: LeadershipItem[];
  leaders: LeadershipItem[];
  historical: LeadershipItem[];
  divisions: string[];
  regions: string[];
};

function SectionHeading({ children }: { children: string }) {
  return <h2 className={styles.sectionHeading}>{children}</h2>;
}

function ProfileCard({ person }: { person: LeadershipItem }) {
  return (
    <Link href={`/leadership/${person.slug}`} className={styles.card}>
      <div className={styles.cardImageWrap}>
        <img
          src={person.src}
          alt={person.alt}
          className={styles.cardImage}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/logos/logo-2.png";
          }}
        />
      </div>
      <h3 className={styles.cardName}>{person.name}</h3>
      <p className={styles.cardTitle}>{person.title}</p>
      {person.short && <p className={styles.cardShort}>{person.short}</p>}
      <span className={styles.readMore}>Read more</span>
    </Link>
  );
}

function CarouselRow({
  title,
  people,
}: {
  title: string;
  people: LeadershipItem[];
}) {
  if (!people.length) return null;
  return (
    <section className={styles.carouselSection}>
      <SectionHeading>{title}</SectionHeading>
      <div className={styles.carouselTrack}>
        {people.map((p) => (
          <div key={p.slug} className={styles.carouselItem}>
            <ProfileCard person={p} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function SectionLeadershipListing({
  executive,
  board,
  advisory,
  leaders,
  historical,
  divisions,
  regions,
}: Props) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [regionFilter, setRegionFilter] = useState("All Regions");

  const filteredLeaders = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leaders.filter((p) => {
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        (p.short?.toLowerCase().includes(q) ?? false);
      const matchesRole =
        roleFilter === "All Roles" || p.division === roleFilter;
      const matchesRegion =
        regionFilter === "All Regions" || p.region === regionFilter;
      return matchesQuery && matchesRole && matchesRegion;
    });
  }, [leaders, query, roleFilter, regionFilter]);

  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <div className={styles.introInner}>
          <h1 className={styles.pageTitle}>Leadership</h1>
          <div className={styles.introText}>
            <p>
              Gnarly Troop Global Federation is guided by leaders committed to
              youth empowerment, cultural diplomacy, and measurable community
              impact across India and partner nations.
            </p>
            <p>
              Our executive team and governing board set strategy; program leaders
              and advisors deliver the 4C vision—Climate, Community, Culture, and
              Cooperation—on the ground.
            </p>
          </div>
        </div>
      </header>

      <CarouselRow title="Executive team" people={executive} />
      <CarouselRow title="Chair and governing board" people={board} />

      <section className={styles.advisorySection}>
        <div className={styles.advisoryHead}>
          <div>
            <SectionHeading>Scientific advisory committee</SectionHeading>
            <p className={styles.advisoryDesc}>
              Advisors review evidence frameworks for climate, health, and
              education programs across the federation.
            </p>
          </div>
          <Link href="#meet-leaders" className={styles.viewAll}>
            View all
          </Link>
        </div>
        {advisory.length > 0 && (
          <div className={styles.advisoryGrid}>
            {advisory.map((p) => (
              <ProfileCard key={p.slug} person={p} />
            ))}
          </div>
        )}
      </section>

      <section id="meet-leaders" className={styles.meetSection}>
        <SectionHeading>Meet our leaders</SectionHeading>
        <form
          className={styles.searchRow}
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="search"
            placeholder="Search by name or title"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search leaders"
          />
          <button type="submit">Search</button>
        </form>
        <div className={styles.filters}>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            aria-label="Filter by role"
          >
            <option>All Roles</option>
            {divisions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            aria-label="Filter by region"
          >
            <option>All Regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.grid}>
          {filteredLeaders.map((p) => (
            <ProfileCard key={p.slug} person={p} />
          ))}
        </div>
        {filteredLeaders.length === 0 && (
          <p className={styles.empty}>No leaders match your search.</p>
        )}
      </section>

      <section className={styles.historicalSection}>
        <SectionHeading>Historical leadership</SectionHeading>
        <div className={styles.grid}>
          {historical.map((p) => (
            <ProfileCard key={p.slug} person={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
