// src/features/learning/components/games/BugHuntShooter.tsx
import { useState, useEffect } from 'react';
import { Button } from '../../../../shared/components/Button';
import { Crosshair, Heart, Target, Zap } from 'lucide-react';

interface Bug {
  id: string;
  line: number;
  type: 'syntax' | 'logic' | 'runtime';
  description: string;
  fix: string;
}

interface BugHuntShooterProps {
  code: string;
  bugs: Bug[];
  timeLimit: number; // seconds
  onComplete: (bugsFound: number, timeLeft: number) => void;
}

export function BugHuntShooter({ code, bugs, timeLimit, onComplete }: BugHuntShooterProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'won' | 'lost'>('intro');
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [lives, setLives] = useState(3);
  const [foundBugs, setFoundBugs] = useState<string[]>([]);
  const [_missedShots, setMissedShots] = useState(0);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<{ type: 'hit' | 'miss'; text: string } | null>(null);
  const [activeBugs, setActiveBugs] = useState<Bug[]>([]);

  const codeLines = code.split('\n');

  // Start game
  const startGame = () => {
    setGameState('playing');
    setActiveBugs([...bugs].sort(() => Math.random() - 0.5));
  };

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('lost');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState]);

  // Check win condition
  useEffect(() => {
    if (foundBugs.length === bugs.length && bugs.length > 0 && gameState === 'playing') {
      setGameState('won');
      onComplete(foundBugs.length, timeLeft);
    }
  }, [foundBugs, bugs.length, timeLeft, gameState, onComplete]);

  // Check lose condition
  useEffect(() => {
    if (lives <= 0) {
      setGameState('lost');
    }
  }, [lives]);

  const shootBug = (line: number) => {
    if (gameState !== 'playing') return;

    const bugAtLine = activeBugs.find(b => b.line === line && !foundBugs.includes(b.id));

    if (bugAtLine) {
      // Hit!
      setFoundBugs([...foundBugs, bugAtLine.id]);
      setCombo(prev => prev + 1);
      const points = 100 + (combo * 10);
      setScore(prev => prev + points);
      
      setShowFeedback({
        type: 'hit',
        text: `🎯 HIT! +${points} (${bugAtLine.type})`
      });

      // Remove bug from active list
      setActiveBugs(activeBugs.filter(b => b.id !== bugAtLine.id));
    } else {
      // Miss!
      setCombo(0);
      setMissedShots(prev => prev + 1);
      setLives(prev => prev - 1);
      
      setShowFeedback({
        type: 'miss',
        text: '❌ MISS! -1 life'
      });
    }

    setSelectedLine(line);
    setTimeout(() => {
      setShowFeedback(null);
      setSelectedLine(null);
    }, 1000);
  };

  if (gameState === 'intro') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-8 rounded-lg text-center">
          <div className="text-6xl mb-4">🐛🔫</div>
          <h2 className="text-3xl font-bold mb-4">Bug Hunt Shooter!</h2>
          <p className="text-red-100 mb-6 text-lg">
            {bugs.length} bugs are hiding in the code! Shoot them before time runs out!
          </p>
          
          <div className="grid grid-cols-3 gap-4 mb-6 max-w-xl mx-auto text-left">
            <div className="bg-white/20 rounded-lg p-4">
              <Heart className="w-6 h-6 mb-2" />
              <div className="font-bold">3 Lives</div>
              <div className="text-sm text-red-100">Don't miss!</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <Target className="w-6 h-6 mb-2" />
              <div className="font-bold">{bugs.length} Bugs</div>
              <div className="text-sm text-red-100">Find them all</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <Zap className="w-6 h-6 mb-2" />
              <div className="font-bold">{timeLimit}s</div>
              <div className="text-sm text-red-100">Beat the clock</div>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-4 mb-6 text-left max-w-xl mx-auto">
            <p className="text-sm font-bold mb-2">Bug Types:</p>
            <div className="space-y-1 text-sm">
              <div>🔴 <span className="font-bold">Syntax Errors</span> - Typos, missing brackets</div>
              <div>🟡 <span className="font-bold">Logic Errors</span> - Wrong logic flow</div>
              <div>🟢 <span className="font-bold">Runtime Errors</span> - Crashes at runtime</div>
            </div>
          </div>

          <Button 
            size="lg" 
            onClick={startGame}
            className="bg-white text-red-600 hover:bg-red-50 cursor-pointer text-xl px-8 py-4"
          >
            🎯 Start Hunting!
          </Button>
        </div>
      </div>
    );
  }

  if (gameState === 'won') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] animate-slide-up">
        <div className="text-8xl mb-6">🏆</div>
        <h2 className="text-4xl font-bold text-green-600 mb-4">All Bugs Eliminated!</h2>
        <div className="text-xl space-y-2 text-center">
          <p>Score: <span className="font-bold text-primary-600">{score}</span></p>
          <p>Max Combo: <span className="font-bold text-orange-600">x{combo}</span></p>
          <p>Time Bonus: <span className="font-bold text-green-600">+{timeLeft * 10}</span></p>
        </div>
      </div>
    );
  }

  if (gameState === 'lost') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <div className="text-8xl mb-6">💀</div>
        <h2 className="text-4xl font-bold text-red-600 mb-4">Game Over!</h2>
        <p className="text-xl text-gray-600 mb-4">
          Found {foundBugs.length}/{bugs.length} bugs
        </p>
        <Button onClick={() => window.location.reload()} className="cursor-pointer">
          🔄 Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Game HUD */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4 rounded-lg">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <Heart className="w-6 h-6 mx-auto mb-1" />
            <div className="font-bold">
              {Array(lives).fill('❤️').join('')}
              {Array(3 - lives).fill('🖤').join('')}
            </div>
            <div className="text-xs text-red-100">Lives</div>
          </div>
          <div>
            <Target className="w-6 h-6 mx-auto mb-1" />
            <div className="text-2xl font-bold">{foundBugs.length}/{bugs.length}</div>
            <div className="text-xs text-red-100">Bugs Found</div>
          </div>
          <div>
            <Zap className="w-6 h-6 mx-auto mb-1" />
            <div className="text-2xl font-bold animate-pulse">{timeLeft}s</div>
            <div className="text-xs text-red-100">Time Left</div>
          </div>
          <div>
            <Crosshair className="w-6 h-6 mx-auto mb-1" />
            <div className="text-2xl font-bold">x{combo}</div>
            <div className="text-xs text-red-100">Combo</div>
          </div>
        </div>
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className={`text-center p-4 rounded-lg animate-bounce ${
          showFeedback.type === 'hit' 
            ? 'bg-green-100 text-green-700 border-2 border-green-400' 
            : 'bg-red-100 text-red-700 border-2 border-red-400'
        }`}>
          <div className="text-2xl font-bold">{showFeedback.text}</div>
        </div>
      )}

      {/* Code with Bugs */}
      <div className="bg-gray-900 rounded-lg p-6 font-mono text-sm overflow-auto max-h-[500px]">
        <div className="flex">
          {/* Line Numbers */}
          <div className="text-gray-600 pr-4 select-none">
            {codeLines.map((_, idx) => (
              <div key={idx} className="leading-6">{idx + 1}</div>
            ))}
          </div>

          {/* Code */}
          <div className="flex-1">
            {codeLines.map((line, idx) => {
              const hasBug = activeBugs.some(b => b.line === idx + 1 && !foundBugs.includes(b.id));
              const bugFound = bugs.some(b => b.line === idx + 1 && foundBugs.includes(b.id));
              const isSelected = selectedLine === idx + 1;

              return (
                <div
                  key={idx}
                  onClick={() => shootBug(idx + 1)}
                  className={`leading-6 px-2 cursor-crosshair transition-all ${
                    bugFound
                      ? 'bg-green-500/20 line-through'
                      : hasBug
                      ? 'bg-red-500/20 animate-pulse'
                      : isSelected
                      ? 'bg-yellow-500/20'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <span className="text-gray-300">{line}</span>
                  {hasBug && (
                    <span className="ml-2 text-red-400 animate-bounce">🐛</span>
                  )}
                  {bugFound && (
                    <span className="ml-2 text-green-400">✅</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg text-center">
        <p className="text-blue-900 font-medium">
          🎯 Click on the lines with bugs to shoot them! 
          {activeBugs.length > 0 && ` ${activeBugs.length} bugs remaining...`}
        </p>
      </div>

      {/* Score */}
      <div className="text-center">
        <div className="text-4xl font-bold text-primary-600">{score}</div>
        <div className="text-sm text-gray-600">Score</div>
      </div>
    </div>
  );
}