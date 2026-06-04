import styles from './Pagination.module.scss';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

type Item = number | 'ellipsis';

function buildPageItems(current: number, total: number): Item[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const items: Item[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start === 3) {
    items.push(2);
  } else if (start > 3) {
    items.push('ellipsis');
  }

  for (let i = start; i <= end; i++) {
    items.push(i);
  }

  if (end === total - 2) {
    items.push(total - 1);
  } else if (end < total - 2) {
    items.push('ellipsis');
  }

  items.push(total);

  return items;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 0) return null;

  const items = buildPageItems(currentPage, totalPages);
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <button
        type="button"
        className={styles.nav}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canPrev}
        aria-label="Previous page"
      >
        «
      </button>

      {items.map((item, idx) =>
        item === 'ellipsis' ? (
          <span key={`ellipsis-${idx}`} className={styles.ellipsis} aria-hidden="true">
            …
          </span>
        ) : (
          <button
            type="button"
            key={item}
            className={styles.page}
            onClick={() => onPageChange(item)}
            aria-current={item === currentPage ? 'page' : undefined}
            disabled={item === currentPage}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        className={styles.nav}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canNext}
        aria-label="Next page"
      >
        »
      </button>
    </nav>
  );
}

export default Pagination;
