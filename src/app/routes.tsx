// src/app/routes.tsxts
import { createBrowserRouter } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import DashboardPage from '@/pages/DashboardPage';
import UnitPage from '@/pages/UnitPage';
import RoadmapPage from '@/pages/RoadmapPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/roadmap',
    element: <RoadmapPage />,
  },
  {
    path: '/learn/:contentId/:unitId',
    element: <UnitPage />,
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600 mb-6">Page not found</p>
          <a href="/" className="btn btn-primary">
            Go Home
          </a>
        </div>
      </div>
    ),
  },
]);