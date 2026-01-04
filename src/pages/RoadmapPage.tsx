// src/pages/RoadmapPage.tsx
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '../shared/components/Button';
import { Card } from '../shared/components/Card';
import { Lock, CheckCircle, Circle } from 'lucide-react';
import { getStats, isUnitUnlocked } from '../features/learning/store/progressStore';

const ROADMAP_DATA = [
  {
    category: 'React Fundamentals',
    units: [
      { 
        id: 'react-001-usestate', 
        num: 1,
        title: 'useState Hook', 
        prerequisites: [],
        duration: 7,
        xp: 50
      },
      { 
        id: 'react-002-useeffect', 
        num: 2,
        title: 'useEffect Hook', 
        prerequisites: ['react-001-usestate'],
        duration: 8,
        xp: 60
      },
      { 
        id: 'react-003-props', 
        num: 3,
        title: 'Props & Components', 
        prerequisites: ['react-001-usestate'],
        duration: 6,
        xp: 50
      },
    ],
  },
  {
    category: 'Advanced Hooks',
    units: [
      { 
        id: 'react-004-usecontext', 
        num: 4,
        title: 'useContext', 
        prerequisites: ['react-003-props'],
        duration: 7,
        xp: 60
      },
      { 
        id: 'react-005-usereducer', 
        num: 5,
        title: 'useReducer', 
        prerequisites: ['react-001-usestate'],
        duration: 9,
        xp: 70
      },
    ],
  },
];

export default function RoadmapPage() {
  const [stats, setStats] = useState({
    totalXP: 0,
    level: 1,
    streak: 0,
    unitsCompleted: 0,
  });

  useEffect(() => {
    setStats(getStats());
  }, []);

  const totalUnits = ROADMAP_DATA.reduce((acc, cat) => acc + cat.units.length, 0);
  const progressPercent = (stats.unitsCompleted / totalUnits) * 100;

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
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Your Learning Roadmap
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Master React step by step. Complete units to unlock new topics.
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm font-bold text-primary-600">
              {stats.unitsCompleted} / {totalUnits} units
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div 
              className="bg-gradient-to-r from-primary-600 to-blue-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>{Math.round(progressPercent)}% Complete</span>
            <span>{stats.totalXP} XP Earned</span>
          </div>
        </Card>

        {/* Roadmap Sections */}
        <div className="space-y-12">
          {ROADMAP_DATA.map((section, idx) => (
            <div key={idx}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {section.category}
                </h2>
              </div>
              
              <div className="space-y-4">
                {section.units.map((unit) => {
                  const unlocked = isUnitUnlocked(unit.id, unit.prerequisites);
                  const completed = stats.unitsCompleted >= unit.num;

                  return (
                    <Card
                      key={unit.id}
                      hover={unlocked}
                      className={`transition-all ${!unlocked ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        {/* Left Side */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          {/* Icon */}
                          <div className={`w-14 h-14 rounded-lg flex items-center justify-center text-xl font-bold flex-shrink-0 ${
                            completed 
                              ? 'bg-green-100 text-green-600' 
                              : unlocked 
                              ? 'bg-primary-100 text-primary-600' 
                              : 'bg-gray-200 text-gray-400'
                          }`}>
                            {completed ? (
                              <CheckCircle className="w-7 h-7" />
                            ) : unlocked ? (
                              unit.num
                            ) : (
                              <Lock className="w-6 h-6" />
                            )}
                          </div>
                          
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 mb-1">
                              {unit.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                              {unlocked ? (
                                <>
                                  <span className="flex items-center gap-1">
                                    ⏱️ {unit.duration} min
                                  </span>
                                  <span className="flex items-center gap-1">
                                    ⭐ {unit.xp} XP
                                  </span>
                                  {completed && (
                                    <span className="text-green-600 font-medium">
                                      ✓ Completed
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="text-gray-500">
                                  🔒 Complete previous units to unlock
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Right Side - Action */}
                        <div className="flex-shrink-0">
                          {completed ? (
                            <Link to={`/learn/react/${unit.id}`}>
                              <Button size="sm" variant="outline">
                                Review
                              </Button>
                            </Link>
                          ) : unlocked ? (
                            <Link to={`/learn/react/${unit.id}`}>
                              <Button size="sm">
                                Start →
                              </Button>
                            </Link>
                          ) : (
                            <Button size="sm" variant="ghost" disabled>
                              <Lock className="w-4 h-4 mr-1" />
                              Locked
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="text-center mt-16 py-12 border-t border-gray-200">
          <p className="text-gray-600 mb-2">📚 More topics coming soon</p>
          <p className="text-sm text-gray-500">Custom Hooks, Performance, Testing, and more...</p>
        </div>
      </div>
    </div>
  );
}