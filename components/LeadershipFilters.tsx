"use client";

import styles from "@/components/leadership/leadership.module.css";

type Props = {
  divisions: string[];
  regions: string[];
  division: string;
  region: string;
  onDivisionChange: (value: string) => void;
  onRegionChange: (value: string) => void;
};

export default function LeadershipFilters({
  divisions,
  regions,
  division,
  region,
  onDivisionChange,
  onRegionChange,
}: Props) {
  if (!divisions.length && !regions.length) return null;

  return (
    <fieldset className={styles.filterBar}>
      <div className={styles.filterMenus}>
        {divisions.length > 0 && (
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel} htmlFor="leadership-division-filter">
              Divisions
            </label>
            <select
              id="leadership-division-filter"
              value={division}
              onChange={(e) => onDivisionChange(e.target.value)}
              className={styles.filterSelect}
              aria-label="Filter by division"
            >
              <option value="">All Divisions</option>
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
            <label className={styles.filterLabel} htmlFor="leadership-program-filter">
              Program strategies
            </label>
            <select
              id="leadership-program-filter"
              value={region}
              onChange={(e) => onRegionChange(e.target.value)}
              className={styles.filterSelect}
              aria-label="Filter by program"
            >
              <option value="">All program strategies</option>
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
