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
    { id: 'next', name: 'Next.js', icon: '▲' },
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
    console.log("meta for unit", roadmapUnit.id, meta);
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
    <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 py-3 sm:h-16">
        
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl">🏋️</span>
          <span className="text-xl sm:text-2xl font-bold text-gray-900">
            React Gym
          </span>
        </Link>

        <div className="flex items-center gap-3">
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

  {/* Track Selector */}
  <div className="bg-white border-b border-gray-200">
    <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex gap-6 overflow-x-auto py-3 scrollbar-hide">
        {tracks.map((track) => (
          <button
            key={track.id}
            onClick={() => setSelectedTrack(track.id)}
            className={`flex items-center gap-2 pb-3 border-b-2 font-medium transition-colors whitespace-nowrap
              ${
                selectedTrack === track.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
          >
            <span className="text-lg">{track.icon}</span>
            <span className="text-sm sm:text-base">{track.name}</span>
          </button>
        ))}
      </div>
    </div>
  </div>

  {/* Main Content */}
  <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
    
    {/* Heading */}
    <div className="mb-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
        Welcome back! 👋
      </h1>
      <p className="text-base sm:text-lg text-gray-600">
        You're training in{' '}
        <strong className="capitalize">
          {selectedTrack.replace('js', '.js')}
        </strong>
        . Keep building those skills!
      </p>
    </div>

    {isLoading ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </div>
    ) : (
      <>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          <Card className="text-center">
            <div className="text-sm text-gray-600">Total XP</div>
            <div className="text-2xl sm:text-3xl font-bold text-primary-600">
              {stats.totalXP}
            </div>
          </Card>

          <Card className="text-center">
            <div className="text-sm text-gray-600">Current Streak</div>
            <div className="text-2xl sm:text-3xl font-bold text-orange-600">
              {stats.streak} {stats.streak > 0 && '🔥'}
            </div>
          </Card>

          <Card className="text-center">
            <div className="text-sm text-gray-600">Units Completed</div>
            <div className="text-2xl sm:text-3xl font-bold text-green-600">
              {stats.unitsCompleted} / {displayUnits.length}
            </div>
          </Card>

          <Card className="text-center">
            <div className="text-sm text-gray-600">Current Level</div>
            <div className="text-2xl sm:text-3xl font-bold text-purple-600">
              Level {stats.level}
            </div>
          </Card>
        </div>

        {/* Continue Learning */}
        {nextUnit && (
          <Card className="mb-12 bg-gradient-to-r from-primary-50 to-indigo-50 border-primary-200 p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
              
              <div className="flex-1">
                <div className="text-primary-600 font-semibold mb-2">
                  {stats.unitsCompleted === 0 ? '🚀 Start Your Journey' : '⚡ Continue Training'}
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3">
                  {nextUnit.title}
                </h2>

                <p className="text-gray-700 mb-4 max-w-2xl">
                  {nextUnit.description}
                </p>

                <div className="flex flex-wrap gap-4 text-sm">
                  <span>⏱️ {nextUnit.duration} min</span>
                  <span>⭐ {nextUnit.xp} XP</span>
                  <span>#{displayUnits.find(u => u.id === nextUnitId)?.num}</span>
                </div>
              </div>

              <Link
                to={`/learn/${selectedTrack}/${nextUnit.id}`}
                className="w-full lg:w-auto"
              >
                <Button size="lg" className="w-full lg:w-auto px-8 py-4 text-lg">
                  {stats.unitsCompleted === 0 ? 'Start First Unit' : 'Continue Learning'} →
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Units Grid */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            All Units ({displayUnits.length})
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayUnits.map((unit) => {
              const completed = stats.unitsCompleted >= unit.num;
              const unlocked = displayUnits
                .slice(0, unit.num - 1)
                .every((prev) => stats.unitsCompleted >= prev.num);

              return (
                <Card
                  key={unit.id}
                  hover={unlocked && !completed}
                  className={!unlocked ? 'opacity-60' : ''}
                >
                  <div className="flex gap-4 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${
                        completed
                          ? 'bg-green-100 text-green-700'
                          : unlocked
                          ? 'bg-primary-100 text-primary-600'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {completed ? <CheckCircle /> : unlocked ? unit.num : <Lock />}
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-bold text-lg truncate">{unit.title}</h3>
                      <p className="text-sm text-gray-600">
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
                    <Link to={`/learn/${selectedTrack}/${unit.id}`}>
                      <Button size="sm" className="w-full">Start Unit →</Button>
                    </Link>
                  ) : (
                    <p className="text-xs text-gray-500 text-center">
                      Complete previous units to unlock
                    </p>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </>
    )}
  </div>
</div>

  );
}