// src/features/learning/components/games/CodeBattleGame.tsx
import { useState, useEffect } from 'react';
import { Button } from '../../../../shared/components/Button';
import { Sandpack } from '@codesandbox/sandpack-react';
import { Heart, Star, Zap, Trophy, Target } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  solution: string;
  hints: string[];
  tests: Array<{ input: any; expected: any; description: string }>;
  enemy: {
    name: string;
    avatar: string;
    health: number;
    attack: number;
  };
}

interface CodeBattleGameProps {
  challenge: Challenge;
  onComplete: (score: number) => void;
}

export function CodeBattleGame({ challenge, onComplete }: CodeBattleGameProps) {
  const [playerHealth, setPlayerHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(challenge.enemy.health);
  const [currentCode, setCurrentCode] = useState(challenge.starterCode);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [testsPassed, setTestsPassed] = useState(0);

  // Auto-attack enemy every 5 seconds if player doesn't act
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      if (playerHealth > 0) {
        setPlayerHealth(prev => Math.max(0, prev - challenge.enemy.attack));
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [gameState, playerHealth, challenge.enemy.attack]);

  // Check if player is defeated
  useEffect(() => {
    if (playerHealth <= 0) {
      setGameState('lost');
    }
  }, [playerHealth]);

  // Check if enemy is defeated
  useEffect(() => {
    if (enemyHealth <= 0) {
      setGameState('won');
      const finalScore = score + (100 - hintsUsed * 10) + combo * 10;
      onComplete(finalScore);
    }
  }, [enemyHealth, score, hintsUsed, combo, onComplete]);

  const runTests = () => {
    try {
      // Simple test runner (in real app, use sandboxed eval)
      let passed = 0;
      
      challenge.tests.forEach(test => {
        try {
          // Mock test execution
          passed++;
        } catch (e) {
          console.error('Test failed:', e);
        }
      });

      setTestsPassed(passed);

      if (passed === challenge.tests.length) {
        // Perfect! Deal damage to enemy
        const damage = 30 + combo * 5;
        setEnemyHealth(prev => Math.max(0, prev - damage));
        setCombo(prev => prev + 1);
        setScore(prev => prev + 50);
        
        // Heal player
        setPlayerHealth(prev => Math.min(100, prev + 10));
      } else if (passed > 0) {
        // Partial success
        const damage = 15;
        setEnemyHealth(prev => Math.max(0, prev - damage));
        setCombo(0);
        setScore(prev => prev + 20);
      } else {
        // Failed - enemy attacks
        setCombo(0);
        setPlayerHealth(prev => Math.max(0, prev - challenge.enemy.attack));
      }
    } catch (error) {
      console.error('Code error:', error);
      setPlayerHealth(prev => Math.max(0, prev - challenge.enemy.attack));
      setCombo(0);
    }
  };

  const useHint = () => {
    setShowHint(true);
    setHintsUsed(prev => prev + 1);
  };

  if (gameState === 'won') {
    return (
      <div className="flex flex-col items-center justify-center p-8 animate-fade-in">
        <div className="text-6xl mb-4 animate-bounce">🏆</div>
        <h2 className="text-3xl font-bold text-green-600 mb-2">Victory!</h2>
        <p className="text-gray-600 mb-4">You defeated {challenge.enemy.name}!</p>
        <div className="flex gap-4 text-lg">
          <span>⭐ Score: {score}</span>
          <span>🔥 Max Combo: {combo}</span>
        </div>
      </div>
    );
  }

  if (gameState === 'lost') {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="text-6xl mb-4">💀</div>
        <h2 className="text-3xl font-bold text-red-600 mb-2">Defeated!</h2>
        <p className="text-gray-600 mb-4">Don't give up! Try again!</p>
        <Button onClick={() => window.location.reload()}>Retry Battle</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Battle Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-2xl font-bold mb-1">⚔️ {challenge.title}</h3>
            <p className="text-purple-100">{challenge.description}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5" />
              <span className="text-xl font-bold">Combo: x{combo}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              <span className="text-xl font-bold">{score} pts</span>
            </div>
          </div>
        </div>

        {/* Health Bars */}
        <div className="grid grid-cols-2 gap-6">
          {/* Player Health */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold">👤 You</span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {playerHealth}/100
              </span>
            </div>
            <div className="bg-white/20 rounded-full h-3">
              <div 
                className="bg-green-400 h-3 rounded-full transition-all duration-300"
                style={{ width: `${playerHealth}%` }}
              ></div>
            </div>
          </div>

          {/* Enemy Health */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold">{challenge.enemy.avatar} {challenge.enemy.name}</span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {enemyHealth}/{challenge.enemy.health}
              </span>
            </div>
            <div className="bg-white/20 rounded-full h-3">
              <div 
                className="bg-red-400 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(enemyHealth / challenge.enemy.health) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Editor Arena */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Left: Editor */}
        <div>
          <div className="bg-gray-800 text-white p-3 rounded-t-lg font-bold">
            ⚔️ Your Code Weapon
          </div>
          <Sandpack
            template="react"
            theme="dark"
            files={{
              '/App.js': {
                code: currentCode,
                active: true,
              },
            }}
            options={{
              showNavigator: false,
              showTabs: false,
              showLineNumbers: true,
              editorHeight: 400,
            }}
          />
          
          <div className="flex gap-2 mt-3">
            <Button 
              onClick={runTests} 
              size="lg"
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Target className="w-5 h-5 mr-2" />
              Attack! (Run Tests)
            </Button>
            <Button 
              onClick={useHint}
              variant="outline"
              disabled={hintsUsed >= challenge.hints.length}
            >
              💡 Hint ({hintsUsed}/{challenge.hints.length})
            </Button>
          </div>
        </div>

        {/* Right: Battle Info */}
        <div className="space-y-4">
          {/* Mission */}
          <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Mission
            </h4>
            <p className="text-sm text-blue-800">{challenge.description}</p>
          </div>

          {/* Tests */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold mb-3">🎯 Test Results</h4>
            <div className="space-y-2">
              {challenge.tests.map((test, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    idx < testsPassed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {idx < testsPassed ? '✓' : idx + 1}
                  </div>
                  <span className="text-gray-700">{test.description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hint */}
          {showHint && hintsUsed > 0 && (
            <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200 animate-slide-up">
              <h4 className="font-bold text-yellow-900 mb-2">💡 Hint {hintsUsed}:</h4>
              <p className="text-sm text-yellow-800">
                {challenge.hints[hintsUsed - 1]}
              </p>
            </div>
          )}

          {/* Combo Meter */}
          {combo > 0 && (
            <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
              <h4 className="font-bold text-orange-900 mb-2">🔥 COMBO x{combo}!</h4>
              <p className="text-sm text-orange-800">
                Keep passing tests to deal massive damage!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Warning when health low */}
      {playerHealth < 30 && (
        <div className="bg-red-50 border-2 border-red-300 p-4 rounded-lg text-center animate-pulse">
          <p className="text-red-700 font-bold">⚠️ Your health is critical! Fix your code fast!</p>
        </div>
      )}
    </div>
  );
}