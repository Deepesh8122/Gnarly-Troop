"use client";

import { useEffect, useMemo, useState } from "react";
import LeadershipCard from "@/components/LeadershipCard";
import type { Leader } from "@/components/leadership/types";
import styles from "@/components/leadership/leadership.module.css";

const PAGE_SIZE = 12;

type Props = {
  leaders: Leader[];
};

export default function LeadershipGrid({ leaders }: Props) {
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(leaders.length / PAGE_SIZE));

  useEffect(() => {
    setPage(0);
  }, [leaders]);

  const safePage = Math.min(page, totalPages - 1);

  const pageLeaders = useMemo(
    () => leaders.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE),
    [leaders, safePage],
  );

  if (!leaders.length) return null;

  const showPagination = leaders.length > PAGE_SIZE;
  const rangeStart = safePage * PAGE_SIZE + 1;
  const rangeEnd = Math.min((safePage + 1) * PAGE_SIZE, leaders.length);

  return (
    <div className={styles.gridWrap}>
      <ul className={styles.grid}>
        {pageLeaders.map((leader) => (
          <li key={leader.id} className={styles.gridItem}>
            <LeadershipCard leader={leader} />
          </li>
        ))}
      </ul>

      {showPagination && (
        <nav className={styles.pagination} aria-label="Leadership results pages">
          <p className={styles.paginationInfo}>
            Showing {rangeStart}–{rangeEnd} of {leaders.length}
          </p>
          <div className={styles.paginationControls}>
            <button
              type="button"
              className={styles.paginationBtn}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              aria-label="Previous page"
            >
              Previous
            </button>
            <span className={styles.paginationStatus}>
              Page {safePage + 1} of {totalPages}
            </span>
            <button
              type="button"
              className={styles.paginationBtn}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={safePage >= totalPages - 1}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
