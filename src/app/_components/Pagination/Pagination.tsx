import clsx from 'clsx';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import styles from './Pagination.module.scss';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  query: string;
  details?: string;
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

function pageHref(page: number, query: string, details?: string) {
  const search: Record<string, string | number> = { q: query, page };
  if (details) {
    search.details = details;
  }
  return { pathname: '/', query: search };
}

export async function Pagination({ currentPage, totalPages, query, details }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const t = await getTranslations('pagination');
  const items = buildPageItems(currentPage, totalPages);
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <nav className={styles.pagination} aria-label={t('label')}>
      {canPrev ? (
        <Link
          className={styles.nav}
          href={pageHref(currentPage - 1, query, details)}
          aria-label={t('previous')}
        >
          «
        </Link>
      ) : (
        <span
          className={clsx(styles.nav, styles.disabled)}
          aria-disabled="true"
          aria-label={t('previous')}
        >
          «
        </span>
      )}

      {items.map((item, idx) =>
        item === 'ellipsis' ? (
          <span key={`ellipsis-${idx}`} className={styles.ellipsis} aria-hidden="true">
            …
          </span>
        ) : item === currentPage ? (
          <span key={item} className={clsx(styles.page, styles.current)} aria-current="page">
            {item}
          </span>
        ) : (
          <Link key={item} className={styles.page} href={pageHref(item, query, details)}>
            {item}
          </Link>
        ),
      )}

      {canNext ? (
        <Link
          className={styles.nav}
          href={pageHref(currentPage + 1, query, details)}
          aria-label={t('next')}
        >
          »
        </Link>
      ) : (
        <span
          className={clsx(styles.nav, styles.disabled)}
          aria-disabled="true"
          aria-label={t('next')}
        >
          »
        </span>
      )}
    </nav>
  );
}
