import type { RouteObject } from 'react-router-dom';
import Main from '@/components/Main/Main';
import DetailsOutletSlot from '@/components/Details/DetailsOutletSlot';
import About from '@/pages/About/About';
import NotFound from '@/pages/NotFound/NotFound';
import { ROUTES } from './paths';

export function getRouteConfig(searchTerm: string): RouteObject[] {
  return [
    {
      path: ROUTES.home,
      element: <Main searchTerm={searchTerm} />,
      children: [{ index: true, element: <DetailsOutletSlot /> }],
    },
    { path: ROUTES.about, element: <About /> },
    { path: ROUTES.notFound, element: <NotFound /> },
  ];
}
