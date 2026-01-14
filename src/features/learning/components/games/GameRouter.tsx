// src/features/learning/components/games/GameRouter.tsx
import { CodeBattleGame } from './CodeBattleGame';
import { CodePuzzleGame } from './CodePuzzleGame';
import { CodeMemoryGame } from './CodeMemoryGame';
import { SpeedTypingRace } from './SpeedTypingRace';
import { BugHuntShooter } from './BugHuntShooter';
import { TowerDefenseGame } from './TowerDefenseGame';

interface GameRouterProps {
  stepData: any;
  onComplete: (score?: number) => void;
}

export function GameRouter({ stepData, onComplete }: GameRouterProps) {
  console.log('GameRouter - stepData.type:', stepData.type); // Debug log

  switch (stepData.type) {
    case 'game-intro':
      return (
        <div className="text-center space-y-6 py-12 animate-fade-in">
          <div className="text-8xl mb-6">{stepData.title?.includes('⚔️') ? '⚔️' : '🎮'}</div>
          <h2 className="text-4xl font-bold text-gray-900">{stepData.title}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {stepData.story}
          </p>
          <div className="bg-blue-50 p-6 rounded-lg max-w-md mx-auto">
            <p className="text-blue-900 font-medium">{stepData.preview}</p>
          </div>
          <p className="text-sm text-gray-500 mt-8">
            Click "Next Step →" to begin your adventure!
          </p>
        </div>
      );

    case 'code-battle':
      return (
        <CodeBattleGame
          challenge={{
            id: stepData.title || 'battle',
            title: stepData.title || 'Code Battle',
            description: stepData.description || 'Defeat the enemy!',
            starterCode: stepData.starterCode || '',
            solution: stepData.solution || '',
            hints: stepData.hints || [],
            tests: stepData.tests || [],
            enemy: stepData.enemy || {
              name: 'Enemy',
              avatar: '👾',
              health: 100,
              attack: 15
            },
          }}
          onComplete={onComplete}
        />
      );

    case 'code-puzzle':
      return (
        <CodePuzzleGame
          concept={stepData.concept || 'Code Puzzle'}
          description={stepData.description || 'Arrange the code blocks!'}
          availableBlocks={stepData.availableBlocks || []}
          correctSequence={stepData.correctSequence || []}
          onComplete={onComplete}
        />
      );

    case 'memory-game':
      return (
        <CodeMemoryGame
          title={stepData.title || 'Memory Match'}
          pairs={stepData.pairs || []}
          onComplete={onComplete}
        />
      );

    case 'speed-typing-race':
      return (
        <SpeedTypingRace
          targetCode={stepData.targetCode || ''}
          language={stepData.language || 'javascript'}
          rivals={stepData.rivals || []}
          onComplete={(wpm, accuracy) => onComplete(wpm * accuracy)}
        />
      );

    case 'bug-hunt-shooter':
      return (
        <BugHuntShooter
          code={stepData.code || ''}
          bugs={stepData.bugs || []}
          timeLimit={stepData.timeLimit || 60}
          onComplete={(bugsFound, timeLeft) => onComplete(bugsFound * 100 + timeLeft * 10)}
        />
      );

    case 'tower-defense':
      return (
        <TowerDefenseGame
          concepts={stepData.concepts || []}
          waves={stepData.waves || 3}
          onComplete={(survived) => onComplete(survived ? 1000 : 0)}
        />
      );

    default:
      return (
        <div className="text-center py-12 bg-red-50 border-2 border-red-200 rounded-lg">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-red-600 mb-2">
            Game type "{stepData.type}" not supported yet
          </h3>
          <p className="text-red-700 mb-4">
            This game is still being developed. Please check back later!
          </p>
          <div className="text-sm text-gray-600 bg-white p-4 rounded max-w-md mx-auto">
            <p className="font-bold mb-2">Supported game types:</p>
            <ul className="text-left space-y-1">
              <li>✅ game-intro</li>
              <li>✅ code-battle</li>
              <li>✅ code-puzzle</li>
              <li>✅ memory-game</li>
              <li>✅ speed-typing-race</li>
              <li>✅ bug-hunt-shooter</li>
              <li>✅ tower-defense</li>
            </ul>
          </div>
        </div>
      );
  }
}