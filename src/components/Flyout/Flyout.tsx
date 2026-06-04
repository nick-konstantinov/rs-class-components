import styles from './Flyout.module.scss';
import Button from '../Button/Button';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectSelectedCount,
  selectSelectedList,
  unselectAll,
} from '../../store/slices/selectedItemsSlice';
import { downloadCsv } from '../../utils/csv';

function Flyout() {
  const dispatch = useAppDispatch();
  const count = useAppSelector(selectSelectedCount);
  const selected = useAppSelector(selectSelectedList);

  if (count === 0) return null;

  const handleUnselectAll = () => {
    dispatch(unselectAll());
  };

  const handleDownload = () => {
    downloadCsv(selected);
  };

  return (
    <aside className={styles.flyout} role="region" aria-label="Selection">
      <span className={styles.count}>
        <span className={styles.countNumber}>{count}</span> {count === 1 ? 'item is' : 'items are'}{' '}
        selected
      </span>
      <Button onClick={handleUnselectAll}>Unselect all</Button>
      <Button variant="primary" onClick={handleDownload}>
        Download
      </Button>
    </aside>
  );
}

export default Flyout;
