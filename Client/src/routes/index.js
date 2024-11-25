import { lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

// project-imports
import CommonLayout from 'layout/CommonLayout';
import Loadable from 'components/Loadable';
import ComponentsRoutes from './ComponentsRoutes';
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';

// render - landing page
const PagesLanding = Loadable(lazy(() => import('pages/landing')));

// ==============================|| ROUTES RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([
    {
      path: '/',
      element: <CommonLayout layout="landing" />,
      children: [
        {
          path: '/',
          element: <Navigate to='/login'/>
        }
      ]
    },
    LoginRoutes,
    ComponentsRoutes,
    MainRoutes
  ]);
}
