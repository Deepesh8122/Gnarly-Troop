"use client";

import styles from "@/components/leadership/leadership.module.css";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function LeadershipSearch({ value, onChange }: Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onChange(value.trim());
  };

  return (
    <div className={styles.searchBar}>
      <form
        className={`${styles.searchRow} ${styles.searchRowOpen}`}
        onSubmit={handleSubmit}
        role="search"
      >
        <div className={styles.searchPanel}>
          <label htmlFor="leadership-search" className="sr-only">
            Search leaders by name or title
          </label>
          <input
            id="leadership-search"
            type="search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search by name or title"
            className={styles.searchInput}
            autoComplete="off"
            enterKeyHint="search"
          />
        </div>
        <button type="submit" className={styles.searchBtn}>
          Search
        </button>
      </form>
    </div>
  );
}
