// src/features/learning/components/games/CodeMemoryGame.tsx
import { useState, useEffect } from 'react';
// import { Button } from '../../../../shared/components/Button';
// import { Card } from '../../../../shared/components/Card';

interface MemoryCard {
  id: string;
  content: string;
  type: 'concept' | 'code';
  pairId: string;
}

interface CodeMemoryGameProps {
  title: string;
  pairs: Array<{ concept: string; code: string }>;
  onComplete: (score: number) => void;
}

export function CodeMemoryGame({ title, pairs, onComplete }: CodeMemoryGameProps) {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameActive, setGameActive] = useState(true);

  // Initialize cards
  useEffect(() => {
    const gameCards: MemoryCard[] = [];
    pairs.forEach((pair, index) => {
      gameCards.push({
        id: `concept-${index}`,
        content: pair.concept,
        type: 'concept',
        pairId: `pair-${index}`,
      });
      gameCards.push({
        id: `code-${index}`,
        content: pair.code,
        type: 'code',
        pairId: `pair-${index}`,
      });
    });
    setCards(gameCards.sort(() => Math.random() - 0.5));
  }, [pairs]);

  // Timer
  useEffect(() => {
    if (!gameActive) return;
    
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameActive]);

  // Check for match
  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [first, second] = flippedCards;
      const firstCard = cards.find(c => c.id === first);
      const secondCard = cards.find(c => c.id === second);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // Match!
        setMatchedPairs(prev => [...prev, firstCard.pairId]);
        setFlippedCards([]);
      } else {
        // No match - flip back after delay
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  // Check win condition
  useEffect(() => {
    if (matchedPairs.length === pairs.length && matchedPairs.length > 0) {
      setGameActive(false);
      const score = Math.max(0, 1000 - moves * 10 - timer * 2);
      setTimeout(() => onComplete(score), 1000);
    }
  }, [matchedPairs, pairs.length, moves, timer, onComplete]);

  const handleCardClick = (cardId: string) => {
    if (!gameActive) return;
    if (flippedCards.length >= 2) return;
    if (flippedCards.includes(cardId)) return;
    if (matchedPairs.some(pair => {
      const card = cards.find(c => c.id === cardId);
      return card?.pairId === pair;
    })) return;

    setFlippedCards([...flippedCards, cardId]);
  };

  const isFlipped = (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    return flippedCards.includes(cardId) || matchedPairs.includes(card?.pairId || '');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white p-6 rounded-lg">
        <h3 className="text-2xl font-bold mb-2">🧠 {title}</h3>
        <p className="text-pink-100 mb-4">Match concepts with their code!</p>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <span>⏱️</span>
            <span className="font-bold">{formatTime(timer)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🎯</span>
            <span className="font-bold">{moves} moves</span>
          </div>
          <div className="flex items-center gap-2">
            <span>✓</span>
            <span className="font-bold">{matchedPairs.length}/{pairs.length} matched</span>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(card => {
          const flipped = isFlipped(card.id);
          const matched = matchedPairs.includes(card.pairId);

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={!gameActive || flipped}
              className={`h-32 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                matched
                  ? 'bg-green-100 border-green-400'
                  : flipped
                  ? card.type === 'concept'
                    ? 'bg-blue-100 border-blue-400'
                    : 'bg-purple-100 border-purple-400'
                  : 'bg-gray-100 border-gray-300 hover:border-pink-400 hover:scale-105'
              }`}
              style={{
                transform: flipped ? 'rotateY(0deg)' : 'rotateY(0deg)',
              }}
            >
              {flipped ? (
                <div className="p-3 h-full flex flex-col items-center justify-center">
                  <div className={`text-xs font-bold mb-2 ${
                    card.type === 'concept' ? 'text-blue-600' : 'text-purple-600'
                  }`}>
                    {card.type === 'concept' ? '📘 Concept' : '💻 Code'}
                  </div>
                  <div className={`font-mono text-xs text-center ${
                    card.type === 'code' ? 'text-purple-900' : 'text-blue-900'
                  }`}>
                    {card.content}
                  </div>
                </div>
              ) : (
                <div className="text-4xl">❓</div>
              )}
            </button>
          );
        })}
      </div>

      {/* Win Message */}
      {!gameActive && matchedPairs.length === pairs.length && (
        <div className="bg-green-50 border-2 border-green-300 p-6 rounded-lg text-center animate-slide-up">
          <div className="text-6xl mb-4">🎉</div>
          <h4 className="text-2xl font-bold text-green-700 mb-2">
            Congratulations!
          </h4>
          <p className="text-green-600">
            Completed in {formatTime(timer)} with {moves} moves!
          </p>
        </div>
      )}
    </div>
  );
}