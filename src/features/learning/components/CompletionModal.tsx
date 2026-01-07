// src/features/learning/components/CompletionModal.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Button } from '../../../shared/components/Button';
import { Card } from '../../../shared/components/Card';
import { Trophy, Zap, ArrowRight } from 'lucide-react';
import { updateUnitProgress } from '../../../features/learning/store/progressStore';

interface CompletionModalProps {
  unitTitle: string;
  xpEarned: number;
  timeSpent: number;
  nextUnitId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CompletionModal({
  unitTitle,
  xpEarned,
  timeSpent,
  nextUnitId,
  isOpen,
  onClose,
}: CompletionModalProps) {
  const navigate = useNavigate();

  // Only run confetti when modal opens
  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent closing when clicking inside the modal content
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleNextUnit = () => {
    if (!nextUnitId) return;

    updateUnitProgress('react', nextUnitId, {
      currentStep: 0,
      stepsCompleted: [],
      completed: false,
      completedAt: undefined,
    });

    navigate(`/learn/react/${nextUnitId}`);
    onClose(); // Important: close the modal after navigating
  };

  const handleDashboard = () => {
    navigate('/dashboard');
    onClose();
  };

  const handleRoadmap = () => {
    navigate('/roadmap');
    onClose();
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick} // Close when clicking backdrop
    >
      <Card
        className="max-w-md w-full text-center animate-slide-up"
        onClick={(e: React.MouseEvent) => e.stopPropagation()} // Prevent closing when clicking inside
      >
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

        <div className="space-y-3">
          {nextUnitId ? (
            <Button size="lg" className="w-full" onClick={handleNextUnit}>
              Next Unit
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button size="lg" className="w-full" onClick={handleDashboard}>
              Back to Dashboard
            </Button>
          )}

          <Button variant="outline" size="lg" className="w-full" onClick={handleRoadmap}>
            View Roadmap
          </Button>
        </div>
      </Card>
    </div>
  );
}