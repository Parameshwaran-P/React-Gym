// src/pages/UnitPage.tsx
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../shared/components/Button';
import { UnitPlayer } from '../features/learning/components/UnitPlayer';
import { updateUnitProgress } from '../features/learning/store/progressStore';
import { Header } from '../features/components/Header';
import { Footer } from '../features/components/Footer';

export default function UnitPage() {
  const { contentId, unitId } = useParams();

    useEffect(() => {
    if (contentId && unitId) {
      updateUnitProgress(contentId, unitId, {
        currentStep: 0,
      });
    }
  }, [contentId, unitId]);

  if (!contentId || !unitId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid URL</h1>
          <Link to="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Simple Navbar */}
      {/* <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/dashboard" className="flex items-center gap-2">
              <span className="text-2xl">🏋️</span>
              <span className="text-xl font-bold">React Gym</span>
            </Link>
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">Exit Unit</Button>
            </Link>
          </div>
        </div>
      </nav> */}
<Header />
      {/* Unit Player */}
      <UnitPlayer contentId={contentId} unitId={unitId} />
      <Footer />
    </div>
  );
}