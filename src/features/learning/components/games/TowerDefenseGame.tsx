// src/features/learning/components/games/TowerDefenseGame.tsx
import { useState, useEffect } from 'react';
import { Button } from '../../../../shared/components/Button';
import { Shield, Swords, Heart } from 'lucide-react';

interface Enemy {
  id: string;
  type: 'bug' | 'error' | 'crash';
  health: number;
  maxHealth: number;
  position: number; // 0-100
  speed: number;
  damage: number;
}

interface Tower {
  type: 'function' | 'class' | 'hook';
  power: number;
  range: number;
  cooldown: number;
  lastFired: number;
}

interface TowerDefenseGameProps {
  concepts: Array<{
    question: string;
    code: string;
    options: string[];
    correct: number;
  }>;
  waves: number;
  onComplete: (survived: boolean) => void;
}

export function TowerDefenseGame({ concepts, waves, onComplete }: TowerDefenseGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'building' | 'wave' | 'won' | 'lost'>('intro');
  const [currentWave, setCurrentWave] = useState(1);
  const [towerHealth, setTowerHealth] = useState(100);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [towers, setTowers] = useState<Tower[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [resources, setResources] = useState(100);

  // Start building phase
  const startBuilding = () => {
    setGameState('building');
  };

  // Answer question to build tower
  const answerQuestion = (optionIndex: number) => {
    const concept = concepts[currentQuestion];
    const correct = optionIndex === concept.correct;

    if (correct) {
      // Build tower
      const newTower: Tower = {
        type: ['function', 'class', 'hook'][Math.floor(Math.random() * 3)] as any,
        power: 20,
        range: 30,
        cooldown: 1000,
        lastFired: 0,
      };
      setTowers([...towers, newTower]);
      setScore(prev => prev + 100);
      setResources(prev => prev + 50);
    } else {
      setResources(prev => Math.max(0, prev - 20));
    }

    if (currentQuestion < concepts.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Start wave
      startWave();
    }
  };

  // Start enemy wave
  const startWave = () => {
    setGameState('wave');
    const enemyCount = currentWave * 3;
    const newEnemies: Enemy[] = [];

    for (let i = 0; i < enemyCount; i++) {
      newEnemies.push({
        id: `enemy-${currentWave}-${i}`,
        type: ['bug', 'error', 'crash'][Math.floor(Math.random() * 3)] as any,
        health: 50 + currentWave * 10,
        maxHealth: 50 + currentWave * 10,
        position: 0,
        speed: 0.5 + Math.random() * 0.5,
        damage: 10 + currentWave * 2,
      });
    }

    setEnemies(newEnemies);
  };

  // Game loop
  useEffect(() => {
    if (gameState !== 'wave') return;

    const interval = setInterval(() => {
      // Move enemies
      setEnemies(prev => prev.map(enemy => ({
        ...enemy,
        position: enemy.position + enemy.speed,
      })));

      // Towers attack
      const now = Date.now();
      setEnemies(prev => {
        let updated = [...prev];
        
        towers.forEach((tower, towerIdx) => {
          if (now - tower.lastFired > tower.cooldown) {
            // Find enemy in range
            const target = updated.find(e => 
              e.position < tower.range && e.health > 0
            );

            if (target) {
              const index = updated.indexOf(target);
              updated[index] = {
                ...target,
                health: target.health - tower.power,
              };

              // Update tower cooldown
              towers[towerIdx].lastFired = now;
            }
          }
        });

        // Remove dead enemies
        return updated.filter(e => e.health > 0);
      });

      // Check for enemies reaching tower
      enemies.forEach(enemy => {
        if (enemy.position >= 100) {
          setTowerHealth(prev => Math.max(0, prev - enemy.damage));
          setEnemies(prev => prev.filter(e => e.id !== enemy.id));
        }
      });
    }, 50);

    return () => clearInterval(interval);
  }, [gameState, enemies, towers]);

  // Check win/lose
  useEffect(() => {
    if (towerHealth <= 0) {
      setGameState('lost');
      onComplete(false);
    }
  }, [towerHealth, onComplete]);

  useEffect(() => {
    if (gameState === 'wave' && enemies.length === 0) {
      if (currentWave < waves) {
        setCurrentWave(prev => prev + 1);
        setGameState('building');
        setCurrentQuestion(0);
      } else {
        setGameState('won');
        onComplete(true);
      }
    }
  }, [gameState, enemies.length, currentWave, waves, onComplete]);

  if (gameState === 'intro') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-lg text-center">
          <div className="text-6xl mb-4">🏰</div>
          <h2 className="text-3xl font-bold mb-4">Tower Defense: Code Edition</h2>
          <p className="text-purple-100 mb-6 text-lg">
            Build towers by answering code questions! Defend against {waves} waves of bugs!
          </p>
          
          <div className="bg-white/20 rounded-lg p-6 mb-6 max-w-2xl mx-auto text-left">
            <h3 className="font-bold mb-3">How to Play:</h3>
            <ol className="space-y-2 text-sm">
              <li>1️⃣ Answer coding questions to build defensive towers</li>
              <li>2️⃣ Towers automatically shoot enemies in range</li>
              <li>3️⃣ Prevent enemies from reaching your base</li>
              <li>4️⃣ Survive all {waves} waves to win!</li>
            </ol>
          </div>

          <Button 
            size="lg" 
            onClick={startBuilding}
            className="bg-white text-purple-600 hover:bg-purple-50 cursor-pointer text-xl px-8"
          >
            🛠️ Start Building!
          </Button>
        </div>
      </div>
    );
  }

  if (gameState === 'building') {
    const concept = concepts[currentQuestion];

    return (
      <div className="space-y-6">
        <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-blue-900">
              🛠️ Building Phase - Wave {currentWave}
            </h3>
            <div className="text-sm text-blue-700">
              Question {currentQuestion + 1}/{concepts.length}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg mb-4">
            <p className="text-lg font-medium text-gray-900 mb-4">
              {concept.question}
            </p>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg mb-4 text-sm overflow-x-auto">
              {concept.code}
            </pre>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {concept.options.map((option, idx) => (
              <Button
                key={idx}
                onClick={() => answerQuestion(idx)}
                className="w-full text-left p-4 cursor-pointer"
                variant={idx === concept.correct ? 'primary' : 'outline'}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>

        {/* Current Towers */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-bold mb-3">🗼 Your Towers ({towers.length})</h4>
          <div className="flex gap-2 flex-wrap">
            {towers.map((tower, idx) => (
              <div key={idx} className="bg-white px-4 py-2 rounded-lg border-2 border-purple-300">
                <div className="text-sm">
                  {tower.type === 'function' ? '⚡' : tower.type === 'class' ? '🏛️' : '🪝'}
                  {' '}{tower.type}
                </div>
                <div className="text-xs text-gray-600">
                  Power: {tower.power} | Range: {tower.range}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'wave') {
    return (
      <div className="space-y-4">
        {/* HUD */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <Heart className="w-6 h-6 mx-auto mb-1" />
              <div className="text-2xl font-bold">{towerHealth}/100</div>
              <div className="text-xs">Base Health</div>
            </div>
            <div>
              <Swords className="w-6 h-6 mx-auto mb-1" />
              <div className="text-2xl font-bold">Wave {currentWave}</div>
              <div className="text-xs">{enemies.length} enemies</div>
            </div>
            <div>
              <Shield className="w-6 h-6 mx-auto mb-1" />
              <div className="text-2xl font-bold">{towers.length}</div>
              <div className="text-xs">Towers</div>
            </div>
          </div>
        </div>

        {/* Battle Field */}
        <div className="bg-gradient-to-r from-green-900 to-blue-900 p-6 rounded-lg min-h-[400px] relative overflow-hidden">
          {/* Path */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-4 bg-yellow-600/30 border-y-2 border-yellow-400"></div>
          </div>

          {/* Tower (right side) */}
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <div className="text-6xl">🏰</div>
            <div className="bg-white/90 px-2 py-1 rounded text-xs font-bold text-center mt-2">
              {towerHealth} HP
            </div>
          </div>

          {/* Towers (scattered) */}
          {towers.map((tower, idx) => (
            <div
              key={idx}
              className="absolute text-3xl transform -translate-y-1/2"
              style={{
                left: `${20 + idx * 15}%`,
                top: `${30 + (idx % 2) * 40}%`,
              }}
            >
              {tower.type === 'function' ? '⚡' : tower.type === 'class' ? '🏛️' : '🪝'}
            </div>
          ))}

          {/* Enemies */}
          {enemies.map(enemy => (
            <div
              key={enemy.id}
              className="absolute transition-all duration-100 transform -translate-y-1/2"
              style={{
                left: `${enemy.position}%`,
                top: '50%',
              }}
            >
              <div className="text-2xl animate-pulse">
                {enemy.type === 'bug' ? '🐛' : enemy.type === 'error' ? '⚠️' : '💥'}
              </div>
              <div className="bg-white/90 px-2 py-0.5 rounded text-xs text-center font-bold mt-1">
                <div className="w-12 bg-gray-300 rounded-full h-1.5 mb-0.5">
                  <div 
                    className="bg-red-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${(enemy.health / enemy.maxHealth) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Wave Info */}
        <div className="bg-orange-50 p-4 rounded-lg text-center">
          <p className="text-orange-900 font-bold">
            ⚔️ Defend your base! {enemies.length} enemies approaching!
          </p>
        </div>
      </div>
    );
  }

  if (gameState === 'won') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] animate-slide-up">
        <div className="text-8xl mb-6">🏆</div>
        <h2 className="text-4xl font-bold text-green-600 mb-4">Victory!</h2>
        <p className="text-xl text-gray-600">You defended against all {waves} waves!</p>
        <p className="text-3xl font-bold text-primary-600 mt-4">{score} points</p>
      </div>
    );
  }

  if (gameState === 'lost') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <div className="text-8xl mb-6">💔</div>
        <h2 className="text-4xl font-bold text-red-600 mb-4">Base Destroyed!</h2>
        <p className="text-xl text-gray-600 mb-4">You survived {currentWave - 1} wave(s)</p>
        <Button onClick={() => window.location.reload()} className="cursor-pointer">
          🔄 Try Again
        </Button>
      </div>
    );
  }

  return null;
}