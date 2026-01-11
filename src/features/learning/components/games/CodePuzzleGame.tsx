// src/features/learning/components/games/CodePuzzleGame.tsx
import { useState } from 'react';
import { Button } from '../../../../shared/components/Button';
import { Sparkles, RotateCcw } from 'lucide-react';

interface CodeBlock {
  id: string;
  code: string;
  type: 'correct' | 'wrong' | 'distractor';
}

interface CodePuzzleGameProps {
  concept: string;
  description: string;
  availableBlocks: CodeBlock[];
  correctSequence: string[]; // IDs in correct order
  onComplete: () => void;
}

export function CodePuzzleGame({
  concept,
  description,
  availableBlocks,
  correctSequence,
  onComplete
}: CodePuzzleGameProps) {
  const [placedBlocks, setPlacedBlocks] = useState<CodeBlock[]>([]);
  const [remainingBlocks, setRemainingBlocks] = useState<CodeBlock[]>(
    [...availableBlocks].sort(() => Math.random() - 0.5) // Shuffle
  );
  const [score, setScore] = useState(100);
  const [attempts, setAttempts] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleDrop = (block: CodeBlock) => {
    setPlacedBlocks([...placedBlocks, block]);
    setRemainingBlocks(remainingBlocks.filter(b => b.id !== block.id));
  };

  const handleRemove = (blockId: string) => {
    const block = placedBlocks.find(b => b.id === blockId);
    if (block) {
      setPlacedBlocks(placedBlocks.filter(b => b.id !== blockId));
      setRemainingBlocks([...remainingBlocks, block]);
    }
  };

  const checkSolution = () => {
    setAttempts(prev => prev + 1);
    
    const placedIds = placedBlocks.map(b => b.id);
    const correct = JSON.stringify(placedIds) === JSON.stringify(correctSequence);
    
    setIsCorrect(correct);
    setShowResult(true);
    
    if (!correct) {
      setScore(prev => Math.max(0, prev - 10));
    }
    
    if (correct) {
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  const reset = () => {
    setPlacedBlocks([]);
    setRemainingBlocks([...availableBlocks].sort(() => Math.random() - 0.5));
    setShowResult(false);
    setScore(prev => Math.max(0, prev - 5));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg">
        <h3 className="text-2xl font-bold mb-2">🧩 {concept}</h3>
        <p className="text-indigo-100">{description}</p>
        <div className="flex gap-6 mt-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-bold">Score: {score}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🎯</span>
            <span>Attempts: {attempts}</span>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Available Blocks */}
        <div>
          <h4 className="font-bold mb-3 text-lg">📦 Available Code Blocks</h4>
          <div className="bg-gray-50 p-4 rounded-lg min-h-[300px] space-y-2">
            {remainingBlocks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                All blocks placed! ✓
              </p>
            ) : (
              remainingBlocks.map(block => (
                <button
                  key={block.id}
                  onClick={() => handleDrop(block)}
                  className="w-full bg-white p-3 rounded-lg border-2 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer text-left font-mono text-sm"
                >
                  {block.code}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Solution Area */}
        <div>
          <h4 className="font-bold mb-3 text-lg">🎯 Build Your Code Here</h4>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg min-h-[300px] border-2 border-dashed border-indigo-300">
            {placedBlocks.length === 0 ? (
              <p className="text-gray-500 text-center py-12">
                👆 Click blocks to build your code
              </p>
            ) : (
              <div className="space-y-1">
                {placedBlocks.map((block, index) => (
                  <div
                    key={`${block.id}-${index}`}
                    className="bg-white p-3 rounded-lg border-2 border-indigo-300 flex justify-between items-center group hover:bg-red-50 transition-all"
                  >
                    <code className="font-mono text-sm">{block.code}</code>
                    <button
                      onClick={() => handleRemove(block.id)}
                      className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-4">
            <Button
              onClick={checkSolution}
              disabled={placedBlocks.length === 0}
              className="flex-1 cursor-pointer"
            >
              ✓ Check Solution
            </Button>
            <Button
              onClick={reset}
              variant="outline"
              className="cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Result */}
      {showResult && (
        <div className={`p-6 rounded-lg border-2 animate-slide-up ${
          isCorrect
            ? 'bg-green-50 border-green-300'
            : 'bg-orange-50 border-orange-300'
        }`}>
          {isCorrect ? (
            <>
              <div className="text-6xl text-center mb-4">🎉</div>
              <h4 className="text-2xl font-bold text-green-700 text-center mb-2">
                Perfect! You got it!
              </h4>
              <p className="text-green-600 text-center">
                Moving to next challenge...
              </p>
            </>
          ) : (
            <>
              <h4 className="text-xl font-bold text-orange-700 mb-2">
                Not quite right! Try again 🤔
              </h4>
              <p className="text-orange-600 text-sm">
                Hint: Check the order of your code blocks. Remember the correct React Hook flow!
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}