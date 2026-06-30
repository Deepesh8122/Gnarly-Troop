"use client";

import styles from "@/components/leadership/leadership.module.css";

type CategoryOption = {
  slug: string;
  name: string;
};

type Props = {
  categories: CategoryOption[];
  regions: string[];
  category: string;
  region: string;
  onCategoryChange: (value: string) => void;
  onRegionChange: (value: string) => void;
};

export default function LeadershipFilters({
  categories,
  regions,
  category,
  region,
  onCategoryChange,
  onRegionChange,
}: Props) {
  if (!categories.length && !regions.length) return null;

  return (
    <fieldset className={styles.filterBar}>
      <div className={styles.filterMenus}>
        {categories.length > 0 && (
          <div className={styles.filterGroup}>
            <label className="sr-only" htmlFor="leadership-category-filter">
              Filter by team category
            </label>
            <select
              id="leadership-category-filter"
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className={styles.filterSelect}
              aria-label="Filter by team category"
            >
              <option value="">All Team Members</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {regions.length > 0 && (
          <div className={styles.filterGroup}>
            <label className="sr-only" htmlFor="leadership-region-filter">
              Filter by region
            </label>
            <select
              id="leadership-region-filter"
              value={region}
              onChange={(e) => onRegionChange(e.target.value)}
              className={styles.filterSelect}
              aria-label="Filter by region"
            >
              <option value="">All Regions</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </fieldset>
  );
}
