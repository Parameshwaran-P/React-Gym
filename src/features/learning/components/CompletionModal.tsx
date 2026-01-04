// src/features/learning/components/CompletionModal.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Button } from '../../../shared/components/Button';
import { Card } from '../../../shared/components/Card';
import { Trophy, Zap, ArrowRight } from 'lucide-react';

interface CompletionModalProps {
  unitTitle: string;
  xpEarned: number;
  timeSpent: number;
  nextUnitId?: string;
}

export function CompletionModal({ 
  unitTitle, 
  xpEarned, 
  timeSpent,
  nextUnitId 
}: CompletionModalProps) {
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444'],
      });
      
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full text-center animate-slide-up">
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Unit Complete! 🎉
          </h2>
          <p className="text-gray-600">
            You've mastered <span className="font-semibold">{unitTitle}</span>
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-primary-50 rounded-lg p-4">
            <Zap className="w-6 h-6 text-primary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary-600">+{xpEarned}</div>
            <div className="text-sm text-gray-600">XP Earned</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600 mb-1">⏱️</div>
            <div className="text-2xl font-bold text-green-600">{formatTime(timeSpent)}</div>
            <div className="text-sm text-gray-600">Time Spent</div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {nextUnitId ? (
            <Button 
              size="lg" 
              className="w-full"
              onClick={() => navigate(`/learn/react/${nextUnitId}`)}
            >
              Next Unit
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button 
              size="lg" 
              className="w-full"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="lg"
            className="w-full"
            onClick={() => navigate('/roadmap')}
          >
            View Roadmap
          </Button>
        </div>
      </Card>
    </div>
  );
}