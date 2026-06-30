"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import LeadershipCard from "@/components/LeadershipCard";
import LeadershipFilters from "@/components/LeadershipFilters";
import LeadershipGrid from "@/components/LeadershipGrid";
import LeadershipSearch from "@/components/LeadershipSearch";
import { gatesFontClassName } from "@/components/leadership/fonts";
import { mapCategoryGroup } from "@/components/leadership/mapLeader";
import styles from "@/components/leadership/leadership.module.css";
import type { Leader, LeadershipCategoryGroup } from "@/components/leadership/types";
import { isStandaloneCategory } from "@/components/leadership/types";
import type { LeadershipItem } from "@/src/lib/leadership";

type RawCategoryGroup = {
  slug: string;
  name: string;
  displayStyle: "carousel" | "grid";
  sortOrder: number;
  description?: string | null;
  members: LeadershipItem[];
};

type Props = {
  categories: RawCategoryGroup[];
  regions: string[];
  pageTitle?: string;
  introParagraphs?: string[];
  listSectionTitle?: string;
};

const CAROUSEL_MIN_MEMBERS = 4;
const AUTOPLAY_MS = 5000;

type CarouselHandle = {
  prev: () => void;
  next: () => void;
};

type CarouselScrollState = {
  canPrev: boolean;
  canNext: boolean;
};

const SCROLL_EDGE = 4;

function SectionHeading({ children }: { children: string }) {
  return <h2 className={styles.sectionHeading}>{children}</h2>;
}

function CarouselNav({
  categoryName,
  onPrev,
  onNext,
  canPrev,
  canNext,
}: {
  categoryName: string;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
}) {
  return (
    <div className={styles.carouselNav} aria-label={`${categoryName} carousel controls`}>
      <button
        type="button"
        className={styles.carouselBtn}
        onClick={onPrev}
        disabled={!canPrev}
        aria-label={`Previous ${categoryName} members`}
      >
        <ChevronLeft size={24} strokeWidth={1.5} aria-hidden />
      </button>
      <button
        type="button"
        className={styles.carouselBtn}
        onClick={onNext}
        disabled={!canNext}
        aria-label={`Next ${categoryName} members`}
      >
        <ChevronRight size={24} strokeWidth={1.5} aria-hidden />
      </button>
    </div>
  );
}

const LeadershipCarousel = forwardRef<
  CarouselHandle,
  {
    members: Leader[];
    autoplay: boolean;
    onScrollStateChange?: (state: CarouselScrollState) => void;
  }
>(function LeadershipCarousel({ members, autoplay, onScrollStateChange }, ref) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const [atEnd, setAtEnd] = useState(false);

  const readScrollState = useCallback((): CarouselScrollState => {
    const track = trackRef.current;
    if (!track) return { canPrev: false, canNext: false };

    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= SCROLL_EDGE) {
      return { canPrev: false, canNext: false };
    }

    const canPrev = track.scrollLeft > SCROLL_EDGE;
    const canNext = track.scrollLeft < maxScroll - SCROLL_EDGE;
    return { canPrev, canNext };
  }, []);

  const emitScrollState = useCallback(() => {
    const state = readScrollState();
    setAtEnd(!state.canNext);
    onScrollStateChange?.(state);
  }, [onScrollStateChange, readScrollState]);

  const getScrollAmount = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 405;
    const slide = track.querySelector<HTMLElement>("[data-slide]");
    if (!slide) return 405;
    return slide.offsetWidth + 30;
  }, []);

  const scroll = useCallback(
    (direction: "prev" | "next") => {
      const track = trackRef.current;
      if (!track) return;
      const amount = getScrollAmount();
      const maxScroll = track.scrollWidth - track.clientWidth;
      const atStart = track.scrollLeft <= SCROLL_EDGE;
      const isAtEnd = track.scrollLeft >= maxScroll - SCROLL_EDGE;

      if (direction === "next" && isAtEnd) return;
      if (direction === "prev" && atStart) return;

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
    const track = trackRef.current;
    if (!track) return;

    const handleScroll = () => emitScrollState();
    handleScroll();

    track.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      track.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [emitScrollState, members.length]);

  useEffect(() => {
    if (!autoplay) return;
    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      const track = trackRef.current;
      if (!track) return;
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - SCROLL_EDGE) return;
      scroll("next");
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [autoplay, scroll, members.length]);

  return (
    <div
      className={`${styles.carouselOuter} ${atEnd ? styles.carouselOuterAtEnd : ""}`}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      <div ref={trackRef} className={styles.carouselTrack}>
        {members.map((leader) => (
          <div key={leader.id} className={styles.carouselSlide} data-slide>
            <LeadershipCard leader={leader} />
          </div>
        ))}
      </div>
    </div>
  );
});

function CategorySection({ category }: { category: LeadershipCategoryGroup }) {
  const carouselRef = useRef<CarouselHandle>(null);
  const [scrollState, setScrollState] = useState<CarouselScrollState>({
    canPrev: false,
    canNext: true,
  });

  if (!category.members.length) return null;

  const showCarousel =
    category.displayStyle === "carousel" && category.members.length >= CAROUSEL_MIN_MEMBERS;

  return (
    <section className={styles.featuredSection}>
      <div className={styles.featuredHead}>
        <SectionHeading>{category.name}</SectionHeading>
        {showCarousel && (
          <>
            <div className={styles.featuredHeadRule} aria-hidden />
            <CarouselNav
              categoryName={category.name}
              canPrev={scrollState.canPrev}
              canNext={scrollState.canNext}
              onPrev={() => carouselRef.current?.prev()}
              onNext={() => carouselRef.current?.next()}
            />
          </>
        )}
      </div>
      {showCarousel ? (
        <LeadershipCarousel
          ref={carouselRef}
          members={category.members}
          autoplay
          onScrollStateChange={setScrollState}
        />
      ) : (
        <div className={styles.staticRow}>
          {category.members.map((leader) => (
            <LeadershipCard key={leader.id} leader={leader} />
          ))}
        </div>
      )}
    </section>
  );
}

function filterBySearch(leaders: Leader[], query: string): Leader[] {
  const q = query.trim().toLowerCase();
  if (!q) return leaders;

  return leaders.filter((leader) => {
    return (
      leader.name.toLowerCase().includes(q) ||
      leader.designation.toLowerCase().includes(q) ||
      (leader.short?.toLowerCase().includes(q) ?? false) ||
      (leader.categoryName?.toLowerCase().includes(q) ?? false) ||
      (leader.division?.toLowerCase().includes(q) ?? false) ||
      (leader.region?.toLowerCase().includes(q) ?? false)
    );
  });
}

export default function LeadershipPage({
  categories,
  regions,
  pageTitle = "Leadership",
  introParagraphs = [],
  listSectionTitle = "Meet our leaders",
}: Props) {
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");

  const mappedCategories = useMemo(
    () =>
      categories
        .map(mapCategoryGroup)
        .filter((c) => c.members.length > 0)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [categories],
  );

  const { carouselCategories, standaloneCategories } = useMemo(() => {
    const carousel = mappedCategories.filter((c) => c.displayStyle === "carousel");
    const grid = mappedCategories.filter((c) => c.displayStyle === "grid");
    const standalone = grid.filter(isStandaloneCategory);

    return {
      carouselCategories: carousel,
      standaloneCategories: standalone,
    };
  }, [mappedCategories]);

  const searchableCategories = useMemo(
    () => mappedCategories.filter((c) => !isStandaloneCategory(c)),
    [mappedCategories],
  );

  const allMembersList = useMemo(
    () => searchableCategories.flatMap((c) => c.members),
    [searchableCategories],
  );

  const showMeetSection = allMembersList.length > 0;

  const categoryOptions = useMemo(
    () => searchableCategories.map((c) => ({ slug: c.slug, name: c.name })),
    [searchableCategories],
  );

  const poolMembers = useMemo(() => {
    let list = categoryFilter
      ? allMembersList.filter((m) => m.category === categoryFilter)
      : allMembersList;

    if (regionFilter) {
      list = list.filter((m) => m.region === regionFilter);
    }

    return list;
  }, [allMembersList, categoryFilter, regionFilter]);

  const regionOptions = useMemo(() => {
    const scope = categoryFilter
      ? allMembersList.filter((m) => m.category === categoryFilter)
      : allMembersList;

    if (regions.length) {
      return regions.filter((r) => scope.some((m) => m.region === r));
    }

    const fromMembers = new Set(
      scope.map((m) => m.region).filter((r): r is string => Boolean(r)),
    );
    return Array.from(fromMembers).sort();
  }, [regions, allMembersList, categoryFilter]);

  const filteredMembers = useMemo(
    () => filterBySearch(poolMembers, appliedSearch),
    [poolMembers, appliedSearch],
  );

  const handleCategoryChange = useCallback((value: string) => {
    setCategoryFilter(value);
    setRegionFilter("");
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
    setAppliedSearch(value.trim());
  }, []);

  return (
    <div className={`${gatesFontClassName} ${styles.page}`}>
      {/* <nav className={styles.pageBreadcrumb} aria-label="Breadcrumb">
        <div className={styles.pageBreadcrumbInner}>
          <Link href="/about" className={styles.pageBreadcrumbLink}>
            About
          </Link>
        </div>
      </nav> */}

      <header className={styles.intro}>
        <div className={styles.introInner}>
          <div className={styles.pageTitleCol}>
            <h1 className={styles.pageTitle}>{pageTitle}</h1>
          </div>
          {introParagraphs.length > 0 && (
            <div className={styles.introText}>
              {introParagraphs.map((paragraph, index) => (
                <p key={`intro-${index}`}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>
      </header>

      {carouselCategories.map((category) => (
        <CategorySection key={category.slug} category={category} />
      ))}

      {showMeetSection && (
        <section id="meet-leaders" className={styles.meetSection}>
          <SectionHeading>{listSectionTitle}</SectionHeading>

          <LeadershipSearch value={searchInput} onChange={handleSearchChange} />

          <LeadershipFilters
            categories={categoryOptions}
            regions={regionOptions}
            category={categoryFilter}
            region={regionFilter}
            onCategoryChange={handleCategoryChange}
            onRegionChange={setRegionFilter}
          />

          {poolMembers.length > 0 && (
            <p className={styles.resultCount}>
              {filteredMembers.length} of {poolMembers.length}
            </p>
          )}

          {filteredMembers.length > 0 ? (
            <LeadershipGrid leaders={filteredMembers} />
          ) : (
            <p className={styles.empty}>
              {allMembersList.length === 0
                ? "No team members in these categories yet."
                : "No team members match your filters."}
            </p>
          )}
        </section>
      )}

      {standaloneCategories.map((category) => (
        <section key={category.slug} className={styles.standaloneSection}>
          <SectionHeading>{category.name}</SectionHeading>
          <LeadershipGrid leaders={category.members} />
        </section>
      ))}
    </div>
  );
}
