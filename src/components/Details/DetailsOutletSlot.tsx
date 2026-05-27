import { useSearchParams } from 'react-router-dom';
import Details from './Details';

function DetailsOutletSlot() {
  const [searchParams, setSearchParams] = useSearchParams();
  const detailsName = searchParams.get('details');

  if (!detailsName) return null;

  const handleClose = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('details');
    setSearchParams(next, { replace: true });
  };

  return <Details name={detailsName} onClose={handleClose} />;
}

export default DetailsOutletSlot;
