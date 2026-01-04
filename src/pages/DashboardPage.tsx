// src/pages/DashboardPage.tsx
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '../shared/components/Button';
import { Card } from '../shared/components/Card';
import { getStats } from '../features/learning/store/progressStore';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalXP: 0,
    level: 1,
    streak: 0,
    unitsCompleted: 0,
  });

  useEffect(() => {
    setStats(getStats());
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🏋️</span>
              <span className="text-xl font-bold">React Gym</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/roadmap">
                <Button variant="ghost" size="sm">Roadmap</Button>
              </Link>
              <Link to="/">
                <Button variant="outline" size="sm">Logout</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600">
            Continue your learning journey
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <div className="text-sm text-gray-600 mb-1">Total XP</div>
            <div className="text-3xl font-bold text-primary-600">{stats.totalXP}</div>
          </Card>
          <Card>
            <div className="text-sm text-gray-600 mb-1">Current Streak</div>
            <div className="text-3xl font-bold text-orange-600">{stats.streak} 🔥</div>
          </Card>
          <Card>
            <div className="text-sm text-gray-600 mb-1">Units Completed</div>
            <div className="text-3xl font-bold text-green-600">{stats.unitsCompleted}</div>
          </Card>
          <Card>
            <div className="text-sm text-gray-600 mb-1">Current Level</div>
            <div className="text-3xl font-bold text-purple-600">{stats.level}</div>
          </Card>
        </div>

        {/* Quick Start */}
        <Card className="mb-8">
          <h2 className="text-xl font-bold mb-4">🚀 {stats.unitsCompleted === 0 ? 'Start Your First Unit' : 'Continue Learning'}</h2>
          <p className="text-gray-600 mb-6">
            {stats.unitsCompleted === 0 
              ? 'Begin with React fundamentals. Complete your first unit in 5 minutes!'
              : 'Keep the momentum going! Practice makes perfect.'}
          </p>
          <Link to="/learn/react/react-001-usestate">
            <Button>
              {stats.unitsCompleted === 0 ? 'Start: useState Hook →' : 'Continue Learning →'}
            </Button>
          </Link>
        </Card>

        {/* All Units */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Available Units</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card hover>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center text-xl font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-bold">useState Hook</h3>
                  <p className="text-sm text-gray-600">7 min • 50 XP</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Master state management in React functional components
              </p>
              <Link to="/learn/react/react-001-usestate">
                <Button size="sm" className="w-full">Start Unit →</Button>
              </Link>
            </Card>

            {/* Locked units */}
            {[
              { num: 2, title: 'useEffect Hook' },
              { num: 3, title: 'Props & Components' },
            ].map((unit) => (
              <Card key={unit.num} className="opacity-60">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-200 text-gray-400 flex items-center justify-center">
                    🔒
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-700">{unit.title}</h3>
                    <p className="text-sm text-gray-500">Locked</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Complete previous units to unlock
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}