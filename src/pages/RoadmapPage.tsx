// src/pages/RoadmapPage.tsx
import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '../shared/components/Button';
import { Card } from '../shared/components/Card';
import { Lock, CheckCircle } from 'lucide-react';
import { getStats, isUnitUnlocked, getUnitProgress } from '../features/learning/store/progressStore';
import { useRoadmap } from '../features/content/hooks/useRoadmap';
import { useUnitMetadata } from '../features/content/hooks/useUnitMetadata';
import { LoadingPage } from '../shared/components/LoadingStates';

// Group units by category based on naming convention
function categorizeUnits(units: any[]): Array<{ category: string; units: any[] }> {
  const categories: Record<string, any[]> = {};
  
  units.forEach(unit => {
    // Extract category from unit ID or use a default
    // Example: react-001-usestate -> "React Fundamentals"
    // Example: react-010-performance -> "Advanced Topics"
    
    const unitNumber = parseInt(unit.id.match(/\d+/)?.[0] || '0');
    let category = 'Other Topics';
    
    if (unitNumber <= 4) {
      category = 'React Fundamentals';
    } else if (unitNumber <= 9) {
      category = 'Advanced Hooks';
    } else if (unitNumber <= 12) {
      category = 'Advanced Patterns';
    } else {
      category = 'Expert Topics';
    }
    
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(unit);
  });
  
  return Object.entries(categories).map(([category, units]) => ({
    category,
    units: units.sort((a, b) => a.id.localeCompare(b.id)),
  }));
}

export default function RoadmapPage() {
  const [searchParams] = useSearchParams();
  const contentId = searchParams.get('content') || 'react'||'next';
  
  const [stats, setStats] = useState({
    totalXP: 0,
    level: 1,
    streak: 0,
    unitsCompleted: 0,
  });

  const { roadmap, loading: roadmapLoading, error: roadmapError, retry } = useRoadmap(contentId);
  const unitIds = roadmap?.map(unit => unit.id) || [];
  const { units: unitMetadata, loading: unitsLoading } = useUnitMetadata(contentId, unitIds);

  useEffect(() => {
    setStats(getStats());
  }, []);

  // Merge roadmap with unit metadata
  const enrichedUnits = roadmap?.map(roadmapUnit => ({
    ...roadmapUnit,
    ...(unitMetadata[roadmapUnit.id] || {}),
  })) || [];

  const categorizedUnits = categorizeUnits(enrichedUnits);
  const totalUnits = enrichedUnits.length;
  const progressPercent = totalUnits > 0 ? (stats.unitsCompleted / totalUnits) * 100 : 0;

  // Loading state
  if (roadmapLoading || unitsLoading) {
    return <LoadingPage message="Loading roadmap..." />;
  }

  // Error state
  if (roadmapError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="text-center max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Failed to Load Roadmap
          </h2>
          <p className="text-gray-600 mb-6">{roadmapError.message}</p>
          <div className="space-y-3">
            <Button onClick={retry} size="lg" className="w-full">
              Try Again
            </Button>
            <Link to="/dashboard">
              <Button variant="outline" size="lg" className="w-full">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

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
          {categorizedUnits.map((section, idx) => (
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
                  const unlocked = isUnitUnlocked(contentId, unit.id, unit.prerequisites || []);
                  const progress = getUnitProgress(contentId, unit.id);
                  const completed = progress?.completed || false;

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
                              '▶'
                            ) : (
                              <Lock className="w-6 h-6" />
                            )}
                          </div>
                          
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 mb-1">
                              {unit.title || unit.id}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                              {unlocked ? (
                                <>
                                  {unit.duration && (
                                    <span className="flex items-center gap-1">
                                      ⏱️ {unit.duration} min
                                    </span>
                                  )}
                                  {unit.xp && (
                                    <span className="flex items-center gap-1">
                                      ⭐ {unit.xp} XP
                                    </span>
                                  )}
                                  {completed && (
                                    <span className="text-green-600 font-medium">
                                      ✓ Completed
                                    </span>
                                  )}
                                  {progress && !completed && progress.currentStep > 0 && (
                                    <span className="text-blue-600 font-medium">
                                      📝 In Progress ({progress.currentStep}/5)
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
                            <Link to={`/learn/${contentId}/${unit.id}`}>
                              <Button size="sm" variant="outline">
                                Review
                              </Button>
                            </Link>
                          ) : unlocked ? (
                            <Link to={`/learn/${contentId}/${unit.id}`}>
                              <Button size="sm">
                                {progress && progress.currentStep > 0 ? 'Continue' : 'Start'} →
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

        {/* Empty State */}
        {enrichedUnits.length === 0 && (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Units Available
            </h3>
            <p className="text-gray-600 mb-6">
              Content is being prepared. Check back soon!
            </p>
            <Link to="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </Card>
        )}

        {/* Coming Soon */}
        {enrichedUnits.length > 0 && (
          <div className="text-center mt-16 py-12 border-t border-gray-200">
            <p className="text-gray-600 mb-2">📚 More topics coming soon</p>
            <p className="text-sm text-gray-500">
              Custom Hooks, Performance, Testing, and more...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}