"use client";

import Link from "next/link";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
const CAROUSEL_MIN_MEMBERS = 4;
const AUTOPLAY_MS = 5000;

type CarouselHandle = {
  prev: () => void;
  next: () => void;
};

function SectionHeading({ children }: { children: string }) {
  return <h2 className={styles.sectionHeading}>{children}</h2>;
}

function ProfileCard({ person }: { person: LeadershipItem }) {
  const shortText =
    person.short && person.short.length > 180
      ? `${person.short.slice(0, 180)}…`
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
      <span className={styles.bioLink}>View profile</span>
    </Link>
  );
}

function CarouselNav({
  categoryName,
  onPrev,
  onNext,
}: {
  categoryName: string;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className={styles.carouselNav}>
      <button
        type="button"
        className={styles.carouselBtn}
        onClick={onPrev}
        aria-label={`Previous ${categoryName} members`}
      >
        <ChevronLeft size={20} strokeWidth={1.5} />
      </button>
      <button
        type="button"
        className={styles.carouselBtn}
        onClick={onNext}
        aria-label={`Next ${categoryName} members`}
      >
        <ChevronRight size={20} strokeWidth={1.5} />
      </button>
    </div>
  );
}

const LeadershipCarousel = forwardRef<
  CarouselHandle,
  { members: LeadershipItem[]; autoplay: boolean }
>(function LeadershipCarousel({ members, autoplay }, ref) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  const getScrollAmount = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 360;
    const slide = track.querySelector<HTMLElement>(`[data-slide]`);
    if (!slide) return 360;
    const gap = 32;
    return slide.offsetWidth + gap;
  }, []);

  const scroll = useCallback(
    (direction: "prev" | "next") => {
      const track = trackRef.current;
      if (!track) return;
      const amount = getScrollAmount();
      const maxScroll = track.scrollWidth - track.clientWidth;
      const atEnd = track.scrollLeft >= maxScroll - 4;
      const atStart = track.scrollLeft <= 4;

      if (direction === "next" && atEnd) {
        track.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }
      if (direction === "prev" && atStart) {
        track.scrollTo({ left: maxScroll, behavior: "smooth" });
        return;
      }

      track.scrollBy({
        left: direction === "next" ? amount : -amount,
        behavior: "smooth",
      });
    },
    [getScrollAmount],
  );

  useImperativeHandle(ref, () => ({
    prev: () => scroll("prev"),
    next: () => scroll("next"),
  }));

  useEffect(() => {
    if (!autoplay) return;
    const id = window.setInterval(() => {
      if (!pausedRef.current) scroll("next");
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [autoplay, scroll, members.length]);

  return (
    <div
      className={styles.carouselOuter}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      <div ref={trackRef} className={styles.carouselTrack}>
        {members.map((p) => (
          <div key={p.slug} className={styles.carouselSlide} data-slide>
            <ProfileCard person={p} />
          </div>
        ))}
      </div>
    </div>
  );
});

function FeaturedSection({ category }: { category: LeadershipCategoryGroup }) {
  const carouselRef = useRef<CarouselHandle>(null);

  if (!category.members.length) return null;

  const showCarousel = category.members.length >= CAROUSEL_MIN_MEMBERS;

  return (
    <section className={styles.featuredSection}>
      <div className={styles.featuredHead}>
        <SectionHeading>{category.name}</SectionHeading>
        {showCarousel && (
          <CarouselNav
            categoryName={category.name}
            onPrev={() => carouselRef.current?.prev()}
            onNext={() => carouselRef.current?.next()}
          />
        )}
      </div>
      {showCarousel ? (
        <LeadershipCarousel ref={carouselRef} members={category.members} autoplay />
      ) : (
        <div className={styles.staticRow}>
          {category.members.map((p) => (
            <ProfileCard key={p.slug} person={p} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function SectionLeadershipListing({ categories, divisions, regions }: Props) {
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [regionFilter, setRegionFilter] = useState("All Regions");

  const { featured, listCategories } = useMemo(() => {
    const featuredCats = categories.filter((c) => FEATURED_SLUGS.has(c.slug));
    const rest = categories.filter((c) => !FEATURED_SLUGS.has(c.slug));
    return { featured: featuredCats, listCategories: rest };
  }, [categories]);

  const memberList = useMemo(
    () => listCategories.flatMap((c) => c.members),
    [listCategories],
  );

  const filterMember = useCallback(
    (p: LeadershipItem) => {
      const q = appliedSearch.trim().toLowerCase();
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
    [appliedSearch, categoryFilter, roleFilter, regionFilter],
  );

  const filteredMembers = useMemo(
    () => memberList.filter(filterMember),
    [memberList, filterMember],
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(searchInput.trim());
  };

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
        <FeaturedSection key={category.slug} category={category} />
      ))}

      <section id="meet-leaders" className={styles.meetSection}>
        <SectionHeading>Meet our leaders</SectionHeading>

        <form className={styles.searchBlock} onSubmit={handleSearch}>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search by name, title, or keywords"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Search leaders"
          />
          <div className={styles.searchActions}>
            <button type="submit" className={styles.searchBtn}>
              Search
            </button>
          </div>
        </form>

        <div className={styles.filters}>
          {listCategories.length > 0 && (
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel} htmlFor="leadership-category-filter">
                Categories
              </label>
              <select
                id="leadership-category-filter"
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
            </div>
          )}
          {divisions.length > 0 && (
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel} htmlFor="leadership-role-filter">
                Divisions
              </label>
              <select
                id="leadership-role-filter"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                aria-label="Filter by division"
              >
                <option>All Roles</option>
                {divisions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          )}
          {regions.length > 0 && (
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel} htmlFor="leadership-region-filter">
                Regions
              </label>
              <select
                id="leadership-region-filter"
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
          )}
        </div>

        {memberList.length > 0 && (
          <p className={styles.resultCount}>
            {filteredMembers.length} of {memberList.length}
          </p>
        )}

        {filteredMembers.length > 0 ? (
          <div className={styles.grid}>
            {filteredMembers.map((p) => (
              <ProfileCard key={p.slug} person={p} />
            ))}
          </div>
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
