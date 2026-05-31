"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import type { LeadershipItem } from "@/src/lib/leadership";
import styles from "./SectionLeadershipListing.module.css";

export type LeadershipCategoryGroup = {
  slug: string;
  name: string;
  displayStyle: "carousel" | "grid";
  members: LeadershipItem[];
};

type Props = {
  categories: LeadershipCategoryGroup[];
  divisions: string[];
  regions: string[];
};

const FEATURED_SLUGS = new Set(["executive", "board"]);

function SectionHeading({ children }: { children: string }) {
  return <h2 className={styles.sectionHeading}>{children}</h2>;
}

function ProfileCard({ person }: { person: LeadershipItem }) {
  const shortText =
    person.short && person.short.length > 200
      ? `${person.short.slice(0, 200)}…`
      : person.short;

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
      {shortText && <p className={styles.cardShort}>{shortText}</p>}
      <span className={styles.bioLink}>Bio</span>
    </Link>
  );
}

function CarouselSection({ category }: { category: LeadershipCategoryGroup }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "prev" | "next") => {
    const track = trackRef.current;
    if (!track) return;
    const amount = track.clientWidth * 0.85;
    track.scrollBy({ left: direction === "next" ? amount : -amount, behavior: "smooth" });
  };

  if (!category.members.length) return null;

  return (
    <section className={styles.featuredSection}>
      <div className={styles.featuredHead}>
        <SectionHeading>{category.name}</SectionHeading>
        {category.members.length > 3 && (
          <div className={styles.carouselNav}>
            <button
              type="button"
              className={styles.carouselBtn}
              onClick={() => scroll("prev")}
              aria-label={`Previous ${category.name} members`}
            >
              ←
            </button>
            <button
              type="button"
              className={styles.carouselBtn}
              onClick={() => scroll("next")}
              aria-label={`Next ${category.name} members`}
            >
              →
            </button>
          </div>
        )}
      </div>
      <div ref={trackRef} className={styles.carouselTrack}>
        {category.members.map((p) => (
          <div key={p.slug} className={styles.carouselItem}>
            <ProfileCard person={p} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function SectionLeadershipListing({ categories, divisions, regions }: Props) {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [regionFilter, setRegionFilter] = useState("All Regions");

  const { featured, listCategories } = useMemo(() => {
    const featuredCats = categories.filter((c) => FEATURED_SLUGS.has(c.slug));
    const rest = categories.filter((c) => !FEATURED_SLUGS.has(c.slug));

    return {
      featured: featuredCats,
      listCategories: rest,
    };
  }, [categories]);

  const filterMember = useCallback(
    (p: LeadershipItem) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        (p.short?.toLowerCase().includes(q) ?? false) ||
        (p.categoryName?.toLowerCase().includes(q) ?? false);
      const matchesCategory =
        categoryFilter === "All Categories" || p.section === categoryFilter;
      const matchesRole = roleFilter === "All Roles" || p.division === roleFilter;
      const matchesRegion = regionFilter === "All Regions" || p.region === regionFilter;
      return matchesQuery && matchesCategory && matchesRole && matchesRegion;
    },
    [query, categoryFilter, roleFilter, regionFilter],
  );

  const memberList = useMemo(
    () => listCategories.flatMap((c) => c.members),
    [listCategories],
  );

  const filteredByCategory = useMemo(() => {
    const hasActiveFilters =
      query.trim().length > 0 ||
      roleFilter !== "All Roles" ||
      regionFilter !== "All Regions";

    if (categoryFilter !== "All Categories") {
      const cat = listCategories.find((c) => c.slug === categoryFilter);
      if (!cat) return [];
      const members = cat.members.filter(filterMember);
      return members.length ? [{ ...cat, members }] : [];
    }

    const blocks = listCategories.map((c) => ({
      ...c,
      members: c.members.filter(filterMember),
    }));

    if (!hasActiveFilters) {
      return blocks;
    }

    return blocks.filter((c) => c.members.length > 0);
  }, [listCategories, filterMember, categoryFilter, query, roleFilter, regionFilter]);

  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <div className={styles.introInner}>
          <h1 className={styles.pageTitle}>Leadership</h1>
          <div className={styles.introText}>
            <p>
              Gnarly Troop Global Federation is guided by leaders committed to youth empowerment,
              cultural diplomacy, and measurable community impact across India and partner nations.
            </p>
            <p>
              Our councils and teams deliver the 4C vision—Climate, Community, Culture, and
              Cooperation—under the Troop Spirit: My Country, My Responsibility, My Pride.
            </p>
          </div>
        </div>
      </header>

      {featured.map((category) => (
        <CarouselSection key={category.slug} category={category} />
      ))}

      <section id="meet-leaders" className={styles.meetSection}>
        <SectionHeading>Meet our leaders</SectionHeading>
        <form className={styles.searchRow} onSubmit={(e) => e.preventDefault()}>
          <input
            type="search"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search leaders"
          />
          <button type="submit">Search</button>
        </form>
        <div className={styles.filters}>
          {listCategories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="All Categories">All Categories</option>
              {listCategories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
          {divisions.length > 0 && (
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
          )}
          {regions.length > 0 && (
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
          )}
        </div>

        {filteredByCategory.length > 0 ? (
          filteredByCategory.map((category) => (
            <div key={category.slug} className={styles.categoryBlock}>
              {categoryFilter === "All Categories" && (
                <h3 className={styles.categoryLabel}>{category.name}</h3>
              )}
              {category.members.length > 0 ? (
                <div className={styles.grid}>
                  {category.members.map((p) => (
                    <ProfileCard key={p.slug} person={p} />
                  ))}
                </div>
              ) : (
                <p className={styles.emptyCategory}>No members published in this category yet.</p>
              )}
            </div>
          ))
        ) : (
          <p className={styles.empty}>
            {memberList.length === 0
              ? "No team members in these categories yet."
              : "No team members match your search."}
          </p>
        )}
      </section>
    </div>
  );
}
