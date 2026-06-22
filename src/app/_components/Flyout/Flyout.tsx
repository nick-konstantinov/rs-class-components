'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/storeHooks';
import { selectItems, selectItemsCount, unselectAll } from '@/store/slices/selectedItemsSlice';
import { generateCsvAction, type CsvState } from '@/app/[locale]/actions';
import styles from './Flyout.module.scss';

const initialState: CsvState = { base64: '', filename: '' };

export function Flyout() {
  const dispatch = useAppDispatch();
  const count = useAppSelector(selectItemsCount);
  const selected = useAppSelector(selectItems);
  const t = useTranslations('flyout');
  const [state, formAction, isPending] = useActionState(generateCsvAction, initialState);

  if (count === 0) {
    return null;
  }

  return (
    <aside data-flyout className={styles.flyout} role="region" aria-label={t('label')}>
      <span className={styles.count}>{t('selected', { count })}</span>

      <button type="button" className={styles.button} onClick={() => dispatch(unselectAll())}>
        {t('unselectAll')}
      </button>

      <form action={formAction}>
        <input type="hidden" name="items" value={JSON.stringify(selected)} />
        <button type="submit" className={styles.primary} disabled={isPending}>
          {isPending ? t('generating') : t('generate')}
        </button>
      </form>

      {state.base64 && (
        <a
          className={styles.download}
          download={state.filename}
          href={`data:text/csv;charset=utf-8;base64,${state.base64}`}
        >
          {t('download', { filename: state.filename })}
        </a>
      )}
    </aside>
  );
}
