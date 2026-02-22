// src/app/routes.tsxts
// import { createBrowserRouter } from 'react-router-dom';
// import LandingPage from '../pages/LandingPage';
// import DashboardPage from '../pages/DashboardPage';
// import UnitPage from '../pages/UnitPage';
// import RoadmapPage from '../pages/RoadmapPage';
// import HowItsWorksPage from '../pages/Howitworks';
// import Login from '../features/auth/Login';

// export const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <LandingPage />,
//   },
//   {
//     path: '/dashboard',
//     element: <DashboardPage />,
//   },
//   {
//     path: '/roadmap',
//     element: <RoadmapPage />,
//   },
//    {
//     path: '/how-it-works',
//     element: <HowItsWorksPage/>,
//   },
//    {
//     path: '/login',
//     element: <Login/>,
//   },
//   {
//     path: '/learn/:contentId/:unitId',
//     element: <UnitPage />,
//   },
//   {
//     path: '*',
//     element: (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
//           <p className="text-gray-600 mb-6">Page not found</p>
//           <a href="/" className="btn btn-primary">
//             Go Home
//           </a>
//         </div>
//       </div>
//     ),
//   },
// ]);

import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';
import Login from '../features/auth/Login';
import SignUp from '../features/auth/SignUp';
import ForgotModal from '../features/auth/ForgotModal';
import DashboardPage from '../pages/DashboardPage';
import UnitPage from '../pages/UnitPage';
import LandingPage from '../pages/LandingPage';
import RoadmapPage from '../pages/RoadmapPage';
import HowitworksPage from '../pages/Howitworks';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotModal />} />
      <Route path="/roadmap" element={<RoadmapPage />} />
      <Route path="/how-it-works" element={<HowitworksPage />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/unit/:slug"
        element={
          <ProtectedRoute>
            <UnitPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
