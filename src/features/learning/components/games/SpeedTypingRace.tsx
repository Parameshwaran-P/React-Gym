// src/features/learning/components/games/SpeedTypingRace.tsx
import { useState, useEffect, useRef } from 'react';
import { Button } from '../../../../shared/components/Button';

interface SpeedTypingRaceProps {
  targetCode: string;
  language: string;
  rivals: Array<{ name: string; avatar: string; speed: number }>;
  onComplete: (wpm: number, accuracy: number) => void;
}

export function SpeedTypingRace({ targetCode, language, rivals, onComplete }: SpeedTypingRaceProps) {
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [errors, setErrors] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rivalProgress, setRivalProgress] = useState<Record<string, number>>({});
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Countdown before race starts
  useEffect(() => {
    if (showCountdown && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (showCountdown && countdown === 0) {
      setIsStarted(true);
      setStartTime(Date.now());
      setShowCountdown(false);
      inputRef.current?.focus();
    }
  }, [showCountdown, countdown]);

  // Rival racers progress simulation
  useEffect(() => {
    if (!isStarted || isFinished) return;

    const interval = setInterval(() => {
      setRivalProgress(prev => {
        const updated = { ...prev };
        rivals.forEach(rival => {
          const current = updated[rival.name] || 0;
          if (current < 100) {
            // Random progress based on rival speed
            updated[rival.name] = Math.min(100, current + (rival.speed * Math.random()));
          }
        });
        return updated;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isStarted, isFinished, rivals]);

  // Handle typing
  const handleInputChange = (value: string) => {
    if (!isStarted || isFinished) return;

    setUserInput(value);
    const newIndex = value.length;
    setCurrentIndex(newIndex);

    // Check for errors
    if (value[newIndex - 1] !== targetCode[newIndex - 1]) {
      setErrors(prev => prev + 1);
    }

    // Check if finished
    if (value === targetCode) {
      finishRace();
    }
  };

  const finishRace = () => {
    setIsFinished(true);
    const endTime = Date.now();
    const timeInMinutes = ((endTime - (startTime || 0)) / 1000) / 60;
    const words = targetCode.split(' ').length;
    const wpm = Math.round(words / timeInMinutes);
    const accuracy = Math.round(((targetCode.length - errors) / targetCode.length) * 100);
    
    setTimeout(() => onComplete(wpm, accuracy), 2000);
  };

  const startRace = () => {
    setShowCountdown(true);
    setCountdown(3);
  };

  const userProgress = (currentIndex / targetCode.length) * 100;

  // Render code with highlighting
  const renderCode = () => {
    return targetCode.split('').map((char, idx) => {
      let className = 'inline-block';
      
      if (idx < currentIndex) {
        if (userInput[idx] === char) {
          className += ' text-green-600 bg-green-100';
        } else {
          className += ' text-red-600 bg-red-100';
        }
      } else if (idx === currentIndex) {
        className += ' bg-yellow-200 animate-pulse';
      }

      return (
        <span key={idx} className={className}>
          {char === ' ' ? '␣' : char === '\n' ? '⏎\n' : char}
        </span>
      );
    });
  };

  if (showCountdown) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] animate-fade-in">
        <div className="text-9xl font-bold text-primary-600 animate-bounce">
          {countdown}
        </div>
        <p className="text-2xl text-gray-600 mt-6">Get Ready!</p>
      </div>
    );
  }

  if (isFinished) {
    const won = Object.values(rivalProgress).every(progress => userProgress > progress);
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] animate-slide-up">
        <div className="text-8xl mb-6">
          {won ? '🏆' : '🥈'}
        </div>
        <h2 className="text-4xl font-bold mb-4">
          {won ? 'Victory!' : 'Good Try!'}
        </h2>
        <div className="text-xl text-gray-600 space-y-2 text-center">
          <p>Your Progress: <span className="font-bold text-primary-600">{Math.round(userProgress)}%</span></p>
          <p>Errors: <span className="font-bold text-red-600">{errors}</span></p>
          <p>Accuracy: <span className="font-bold text-green-600">
            {Math.round(((targetCode.length - errors) / targetCode.length) * 100)}%
          </span></p>
        </div>
      </div>
    );
  }

  if (!isStarted && !showCountdown) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-4">🏁 Code Typing Race</h2>
          <p className="text-blue-100 mb-6">
            Type the code as fast and accurately as you can! Race against AI rivals!
          </p>
          <div className="bg-white/20 rounded-lg p-4 mb-6 text-left max-w-2xl mx-auto">
            <p className="text-sm mb-2 text-blue-100">Your rivals:</p>
            <div className="flex gap-4 justify-center flex-wrap">
              {rivals.map(rival => (
                <div key={rival.name} className="text-center">
                  <div className="text-3xl mb-1">{rival.avatar}</div>
                  <div className="text-xs font-bold">{rival.name}</div>
                  <div className="text-xs text-blue-200">Speed: {rival.speed}x</div>
                </div>
              ))}
            </div>
          </div>
          <Button size="lg" onClick={startRace} className="bg-white text-blue-600 hover:bg-blue-50 cursor-pointer">
            🏁 Start Race!
          </Button>
        </div>

        {/* Preview */}
        <div className="bg-gray-900 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">Code to type ({language}):</p>
          <pre className="text-green-400 font-mono text-sm overflow-x-auto">
            {targetCode}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Race Track */}
      <div className="bg-gradient-to-b from-blue-900 to-purple-900 text-white p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">🏁 Race Progress</h3>
        
        {/* User Lane */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold">👤 You</span>
            <span className="text-sm">{Math.round(userProgress)}%</span>
          </div>
          <div className="relative bg-white/20 rounded-full h-8">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-8 rounded-full transition-all duration-200 flex items-center justify-end pr-2"
              style={{ width: `${userProgress}%` }}
            >
              <span className="text-2xl">🏃</span>
            </div>
          </div>
        </div>

        {/* Rival Lanes */}
        {rivals.map(rival => {
          const progress = rivalProgress[rival.name] || 0;
          return (
            <div key={rival.name} className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold">{rival.avatar} {rival.name}</span>
                <span className="text-sm">{Math.round(progress)}%</span>
              </div>
              <div className="relative bg-white/20 rounded-full h-8">
                <div 
                  className="bg-gradient-to-r from-red-400 to-orange-500 h-8 rounded-full transition-all duration-200 flex items-center justify-end pr-2"
                  style={{ width: `${progress}%` }}
                >
                  <span className="text-2xl">{rival.avatar}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Code Display */}
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-400 text-sm">Type this code:</span>
          <div className="flex gap-4 text-sm">
            <span className="text-yellow-400">⚡ {currentIndex}/{targetCode.length}</span>
            <span className="text-red-400">❌ {errors} errors</span>
          </div>
        </div>
        <pre className="font-mono text-base leading-relaxed">
          {renderCode()}
        </pre>
      </div>

      {/* Input Area */}
      <div className="relative">
        <textarea
          ref={inputRef}
          value={userInput}
          onChange={(e) => handleInputChange(e.target.value)}
          className="w-full h-32 p-4 bg-white border-4 border-primary-400 rounded-lg font-mono text-base focus:outline-none focus:border-primary-600"
          placeholder="Start typing here..."
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
        <div className="absolute bottom-4 right-4 text-sm text-gray-500">
          Press exactly what you see above
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">
            {Math.round(((targetCode.length - errors) / targetCode.length) * 100)}%
          </div>
          <div className="text-sm text-gray-600">Accuracy</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(userProgress)}%
          </div>
          <div className="text-sm text-gray-600">Progress</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-600">
            {startTime ? Math.round((Date.now() - startTime) / 1000) : 0}s
          </div>
          <div className="text-sm text-gray-600">Time</div>
        </div>
      </div>
    </div>
  );
}