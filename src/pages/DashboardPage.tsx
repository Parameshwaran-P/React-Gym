// src/pages/DashboardPage.tsx
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '../shared/components/Button';
import { Card } from '../shared/components/Card';
import { getStats } from '../features/learning/store/progressStore';
import { getNextUnlockedUnit } from '../features/learning/store/progressStore';
import { useRoadmap } from '../features/content/hooks/useRoadmap';
import { useUnitMetadata } from '../features/content/hooks/useUnitMetadata';
import { Lock, CheckCircle, Trophy } from 'lucide-react';
import { LoadingCard } from '../shared/components/LoadingStates';

export default function DashboardPage() {
  // Available tracks — just add new ones here when you create their folders!
  const tracks = [
    { id: 'react', name: 'React', icon: '⚛️' },
    { id: 'typescript', name: 'TypeScript', icon: 'TS' },
    { id: 'nextjs', name: 'Next.js', icon: '▲' },
    // Add more: { id: 'nodejs', name: 'Node.js', icon: '🟢' },
  ];

  const [selectedTrack, setSelectedTrack] = useState('react');

  const [stats, setStats] = useState({
    totalXP: 0,
    level: 1,
    streak: 0,
    unitsCompleted: 0,
  });

  const { roadmap, loading: roadmapLoading } = useRoadmap(selectedTrack);
  const unitIds = roadmap?.map((unit) => unit.id) || [];
  const { units: unitMetadata, loading: unitsLoading } = useUnitMetadata(selectedTrack, unitIds);

  useEffect(() => {
    setStats(getStats());
  }, []);

  const nextUnitId = roadmap ? getNextUnlockedUnit(selectedTrack, roadmap) : null;
  const nextUnit = nextUnitId ? unitMetadata[nextUnitId] : null;

  const displayUnits = roadmap?.map((roadmapUnit) => {
    const meta = unitMetadata[roadmapUnit.id] || {};
    const order = roadmap.indexOf(roadmapUnit) + 1;

    return {
      id: roadmapUnit.id,
      num: order,
      title: meta.title || 'Loading...',
      description: meta.description || '',
      duration: meta.duration || 0,
      xp: meta.xp || 0,
      prerequisites: roadmapUnit.prerequisites || [],
    };
  }) || [];

  const isLoading = roadmapLoading || unitsLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-3">
              <span className="text-3xl">🏋️</span>
              <span className="text-2xl font-bold text-gray-900">React Gym</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/roadmap">
                <Button variant="ghost" size="sm">Full Roadmap</Button>
              </Link>
              <Link to="/">
                <Button variant="outline" size="sm">Logout</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Track Selector Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 overflow-x-auto py-4">
            {tracks.map((track) => (
              <button
                key={track.id}
                onClick={() => setSelectedTrack(track.id)}
                className={`flex items-center gap-2 pb-4 border-b-2 font-medium transition-colors whitespace-nowrap ${
                  selectedTrack === track.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="text-xl">{track.icon}</span>
                <span>{track.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-lg text-gray-600">
            You're training in <strong className="capitalize">{selectedTrack.replace('js', '.js')}</strong>. Keep building those skills!
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
              <Card className="text-center">
                <div className="text-sm text-gray-600 mb-1">Total XP</div>
                <div className="text-3xl font-bold text-primary-600">{stats.totalXP}</div>
              </Card>
              <Card className="text-center">
                <div className="text-sm text-gray-600 mb-1">Current Streak</div>
                <div className="text-3xl font-bold text-orange-600">
                  {stats.streak} {stats.streak > 0 && '🔥'}
                </div>
              </Card>
              <Card className="text-center">
                <div className="text-sm text-gray-600 mb-1">Units Completed</div>
                <div className="text-3xl font-bold text-green-600">
                  {stats.unitsCompleted} / {displayUnits.length}
                </div>
              </Card>
              <Card className="text-center">
                <div className="text-sm text-gray-600 mb-1">Current Level</div>
                <div className="text-3xl font-bold text-purple-600">Level {stats.level}</div>
              </Card>
            </div>

            {/* Continue Learning Card */}
            {nextUnit && (
              <Card className="mb-12 bg-gradient-to-r from-primary-50 to-indigo-50 border-primary-200 p-8">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                  <div className="flex-1">
                    <div className="text-primary-600 font-semibold mb-2">
                      {stats.unitsCompleted === 0 ? '🚀 Start Your Journey' : '⚡ Continue Training'}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">{nextUnit.title}</h2>
                    <p className="text-gray-700 mb-6 max-w-2xl">{nextUnit.description}</p>
                    <div className="flex flex-wrap items-center gap-6 text-sm">
                      <span className="flex items-center gap-2">
                        ⏱️ {nextUnit.duration} minutes
                      </span>
                      <span className="flex items-center gap-2">
                        ⭐ {nextUnit.xp} XP reward
                      </span>
                      <span className="flex items-center gap-2">
                        #{displayUnits.find(u => u.id === nextUnitId)?.num}
                      </span>
                    </div>
                  </div>
                  <Link to={`/learn/${selectedTrack}/${nextUnit.id}`}>
                    <Button size="lg" className="px-8 py-4 text-lg">
                      {stats.unitsCompleted === 0 ? 'Start First Unit' : 'Continue Learning'} →
                    </Button>
                  </Link>
                </div>
              </Card>
            )}

            {/* All Units Grid */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                All Units ({displayUnits.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayUnits.map((unit) => {
                  const completed = stats.unitsCompleted >= unit.num;
                  const unlocked = displayUnits
                    .slice(0, unit.num - 1)
                    .every((prev) => stats.unitsCompleted >= prev.num);

                  return (
                    <Card
                      key={unit.id}
                      hover={unlocked && !completed}
                      className={`${!unlocked ? 'opacity-60' : ''} transition-opacity`}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold flex-shrink-0 ${
                            completed
                              ? 'bg-green-100 text-green-700'
                              : unlocked
                              ? 'bg-primary-100 text-primary-600'
                              : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          {completed ? (
                            <CheckCircle className="w-8 h-8" />
                          ) : unlocked ? (
                            unit.num
                          ) : (
                            <Lock className="w-7 h-7" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-gray-900 truncate">{unit.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {unlocked ? `${unit.duration} min • ${unit.xp} XP` : 'Locked'}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-6 line-clamp-3">
                        {unit.description}
                      </p>

                      {completed ? (
                        <Button size="sm" variant="outline" className="w-full" disabled>
                          ✓ Completed
                        </Button>
                      ) : unlocked ? (
                        <Link to={`/learn/${selectedTrack}/${unit.id}`} className="block">
                          <Button size="sm" className="w-full">
                            Start Unit →
                          </Button>
                        </Link>
                      ) : (
                        <p className="text-xs text-gray-500 text-center py-3">
                          Complete previous units to unlock
                        </p>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Achievement Celebration */}
            {stats.unitsCompleted > 0 && (
              <Card className="mt-16 bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 border-purple-200">
                <div className="text-center py-12 px-8">
                  <div className="text-8xl mb-6">
                    {stats.unitsCompleted >= 10 ? '🏆' : stats.unitsCompleted >= 5 ? '🥇' : stats.unitsCompleted >= 3 ? '🥈' : '🥉'}
                  </div>
                  <h3 className="text-3xl font-bold mb-4">
                    {stats.unitsCompleted >= 10
                      ? 'Master Developer!'
                      : stats.unitsCompleted >= 5
                      ? 'Advanced Pro!'
                      : stats.unitsCompleted >= 3
                      ? 'Strong Progress!'
                      : 'Great Start!'}
                  </h3>
                  <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                    You've completed <strong>{stats.unitsCompleted}</strong> unit{stats.unitsCompleted !== 1 ? 's' : ''} and earned{' '}
                    <strong>{stats.totalXP} XP</strong>. Your streak is <strong>{stats.streak} day{stats.streak !== 1 ? 's' : ''}</strong>.
                    <br />
                    <span className="block mt-4 font-medium">Keep training — you're becoming unstoppable! 💪</span>
                  </p>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}