// src/features/learning/components/games/GameRouter.tsx
import { CodeBattleGame } from './CodeBattleGame';
import { CodePuzzleGame } from './CodePuzzleGame';
import { CodeMemoryGame } from './CodeMemoryGame';

interface GameRouterProps {
  stepData: any;
  onComplete: (score?: number) => void;
}

export function GameRouter({ stepData, onComplete }: GameRouterProps) {
  switch (stepData.type) {
    case 'code-battle':
      return (
        <CodeBattleGame
          challenge={{
            id: stepData.title,
            title: stepData.title,
            description: stepData.description,
            starterCode: stepData.starterCode,
            solution: stepData.solution || '',
            hints: stepData.hints || [],
            tests: stepData.tests || [],
            enemy: stepData.enemy,
          }}
          onComplete={onComplete}
        />
      );

    case 'code-puzzle':
      return (
        <CodePuzzleGame
          concept={stepData.concept}
          description={stepData.description}
          availableBlocks={stepData.availableBlocks}
          correctSequence={stepData.correctSequence}
          onComplete={onComplete}
        />
      );

    case 'memory-game':
      return (
        <CodeMemoryGame
          title={stepData.title}
          pairs={stepData.pairs}
          onComplete={onComplete}
        />
      );

    case 'game-intro':
      return (
        <div className="text-center space-y-6 py-12 animate-fade-in">
          <div className="text-8xl mb-6">⚔️</div>
          <h2 className="text-4xl font-bold text-gray-900">{stepData.title}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {stepData.story}
          </p>
          <div className="bg-blue-50 p-6 rounded-lg max-w-md mx-auto">
            <p className="text-blue-900 font-medium">{stepData.preview}</p>
          </div>
        </div>
      );

    default:
      return (
        <div className="text-center py-12">
          <p className="text-gray-600">Game type not supported yet</p>
        </div>
      );
  }
}