// src/features/learning/components/UnitPlayer.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components/Button';
import { Card } from '../../../shared/components/Card';
import { useUnit } from '../../content/hooks/useUnit';
import { 
  getUnitProgress, 
  updateUnitProgress, 
  completeUnit 
} from '../store/progressStore';
import ReactMarkdown from 'react-markdown';
import { InteractiveCodeEditor } from './InteractiveCodeEditor';
import { CodeDisplay } from './CodeDisplay';
import { CompletionModal } from './CompletionModal';
import { 
  CheckCircle2, 
  Circle, 
  Lightbulb, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import { GameRouter } from './games/GameRouter';

interface UnitPlayerProps {
  contentId: string;
  unitId: string;
}

const STEP_NAMES = ['refresher', 'positive', 'negative', 'task', 'challenge'];
const STEP_ICONS = ['📚', '✅', '🐛', '🛠️', '🏆'];
const STEP_TITLES = ['Refresher', 'See It Work', 'Debug It', 'Build It', 'Master It'];

export function UnitPlayer({ contentId, unitId }: UnitPlayerProps) {
  const { unit, loading, error, retry } = useUnit(contentId, unitId);
  const [currentStep, setCurrentStep] = useState(0);
  const [startTime] = useState(Date.now());
  const [showCompletion, setShowCompletion] = useState(false);
  const navigate = useNavigate();

  // Load progress on mount
  useEffect(() => {
    if (unit) {
      const progress = getUnitProgress(contentId, unitId);
      if (progress) {
        setCurrentStep(progress.currentStep);
      } else {
        updateUnitProgress(contentId, unitId, {
          currentStep: 0,
          stepsCompleted: [],
        });
      }
    }
  }, [unit, contentId, unitId]);

  // Save progress when step changes
  useEffect(() => {
    if (unit) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      updateUnitProgress(contentId, unitId, {
        currentStep,
        timeSpent: elapsed,
      });
    }
  }, [currentStep, unit, contentId, unitId, startTime]);

  const handleNext = () => {
    if (currentStep < 4) {
      // Mark step as completed
      const progress = getUnitProgress(contentId, unitId);
      const completed = progress?.stepsCompleted || [];
      if (!completed.includes(currentStep)) {
        completed.push(currentStep);
        updateUnitProgress(contentId, unitId, {
          stepsCompleted: completed,
        });
      }
      
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Complete unit
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      completeUnit(contentId, unitId, unit.xp);
      updateUnitProgress(contentId, unitId, {
        timeSpent: elapsed,
      });
      setShowCompletion(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStepClick = (stepIndex: number) => {
    const progress = getUnitProgress(contentId, unitId);
    const completed = progress?.stepsCompleted || [];
    
    // Can only go to completed steps or current step + 1
    if (stepIndex <= currentStep || completed.includes(stepIndex - 1)) {
      setCurrentStep(stepIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading unit...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="text-center max-w-md">
          {/* Error Icon Based on Type */}
          <div className="text-6xl mb-4">
            {error.code === 'NOT_FOUND' ? '🔍' : 
             error.code === 'NETWORK_ERROR' ? '📡' : 
             error.code === 'PARSE_ERROR' ? '⚠️' : '❌'}
          </div>
          
          {/* Error Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error.code === 'NOT_FOUND' ? 'Unit Not Found' :
             error.code === 'NETWORK_ERROR' ? 'Connection Error' :
             error.code === 'PARSE_ERROR' ? 'Content Error' :
             'Something Went Wrong'}
          </h2>
          
          {/* Error Message */}
          <p className="text-gray-600 mb-6">
            {error.message}
          </p>
          
          {/* Error Details (Development) */}
          {import.meta.env.DEV && (
            <details className="text-left mb-6 p-4 bg-gray-100 rounded text-sm">
              <summary className="cursor-pointer font-medium mb-2">
                Technical Details
              </summary>
              <div className="space-y-1 text-xs font-mono text-gray-700">
                <p><strong>Code:</strong> {error.code}</p>
                <p><strong>Content ID:</strong> {error.contentId || 'N/A'}</p>
                <p><strong>Unit ID:</strong> {error.unitId || 'N/A'}</p>
                <p><strong>Stack:</strong></p>
                <pre className="bg-white p-2 rounded overflow-auto max-h-32">
                  {error.stack}
                </pre>
              </div>
            </details>
          )}
          
          {/* Actions */}
          <div className="space-y-3">
            {error.code === 'NETWORK_ERROR' && (
              <Button onClick={retry} size="lg" className="w-full">
                Try Again
              </Button>
            )}
            <Button 
              onClick={() => navigate('/dashboard')}
              variant={error.code === 'NETWORK_ERROR' ? 'outline' : 'primary'}
              size="lg" 
              className="w-full"
            >
              ← Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  
  if (!unit) {
    return null; // Should not happen if loading/error are handled
  }

  const stepName = STEP_NAMES[currentStep];
  const stepData = unit.steps[stepName];
  const progress = getUnitProgress(contentId, unitId);
  const completedSteps = progress?.stepsCompleted || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Completion Modal */}
      {showCompletion && (
        <CompletionModal
          unitTitle={unit.title}
          xpEarned={unit.xp}
          timeSpent={Math.floor((Date.now() - startTime) / 1000)}
          nextUnitId={unit.unlocks[0]}
          contentId={contentId}
          isOpen={showCompletion}
          onClose={() => {
            setShowCompletion(false);
            navigate('/dashboard');
          }}
        />
      )}

      {/* Progress Sidebar */}
      <div className="fixed left-0 top-16 h-full w-16 bg-white border-r border-gray-200 hidden lg:block">
        <div className="flex flex-col items-center py-6 gap-6">
          {STEP_NAMES.map((_, index) => (
            <button
              key={index}
              onClick={() => handleStepClick(index)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                index === currentStep
                  ? 'bg-primary-600 text-white scale-110'
                  : completedSteps.includes(index)
                  ? 'bg-green-100 text-green-600 hover:bg-green-200 cursor-pointer'
                  : index < currentStep
                  ? 'bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-pointer'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              disabled={index > currentStep && !completedSteps.includes(index - 1)}
              title={STEP_TITLES[index]}
            >
              {completedSteps.includes(index) ? '✓' : STEP_ICONS[index]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-16">
        {/* Progress Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{STEP_ICONS[currentStep]}</span>
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    Step {currentStep + 1} of 5
                  </div>
                  <div className="text-xs text-gray-500">
                    {STEP_TITLES[currentStep]}
                  </div>
                </div>
              </div>
              <span className="text-sm text-gray-600 font-medium">
                {unit.title}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[110rem] mx-auto px-4 py-8">
          <div className="animate-fade-in">
            {/* Step Content */}
            <Card className="mb-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {stepData.title}
                </h1>
                {stepData.description && (
                  <p className="text-gray-600">{stepData.description}</p>
                )}
              </div>

              {/* Refresher Step */}
              {stepData.type === 'markdown' && (
                <div className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
                  <ReactMarkdown>{stepData.content}</ReactMarkdown>
                </div>
              )}

              {/* Positive Case */}
              {stepData.type === 'interactive-code' && (
                <PositiveCaseStep stepData={stepData} />
              )}

              {/* Debug Quiz */}
              {stepData.type === 'debug-quiz' && (
                <DebugQuizStep stepData={stepData} />
              )}

              {/* Coding Task */}
              {stepData.type === 'coding-task' && (
                <CodingTaskStep stepData={stepData} />
              )}

              {/* Coding Challenge */}
              {stepData.type === 'coding-challenge' && (
                <CodingChallengeStep stepData={stepData} />
              )}

               {/* GAME TYPES */}
              {(stepData.type === 'game-intro' || 
                stepData.type === 'code-battle' ||
                stepData.type === 'code-puzzle' ||
                stepData.type === 'memory-game' ||
                stepData.type === 'speed-typing-race' ||
                stepData.type === 'bug-hunt-shooter' ||
                stepData.type === 'tower-defense') && (
                <GameRouter 
                  stepData={stepData} 
                  onComplete={(score) => {
                    // Award bonus XP for game completion
                    if (score) {
                      updateUnitProgress(contentId, unitId, {
                        score: (getUnitProgress(contentId, unitId)?.score || 0) + score,
                      });
                    }
                    // Auto-advance after game completion
                    setTimeout(() => handleNext(), 1500);
                  }}
                />
              )}
            </Card>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                size="lg"
              >
                ← Previous
              </Button>
              
              <div className="text-sm text-gray-600">
                {currentStep + 1} / 5 steps
              </div>

              <Button 
                onClick={handleNext}
                size="lg"
                className="min-w-[150px]"
              >
                {currentStep === 4 ? (
                  <>
                    Complete Unit ✓
                    <span className="ml-2">+{unit.xp} XP</span>
                  </>
                ) : (
                  'Next Step →'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Positive Case Component
function PositiveCaseStep({ stepData }: { stepData: any }) {
  return (
    <div className="space-y-6">
      <InteractiveCodeEditor 
        code={stepData.code}
        readOnly={true}
        showPreview={stepData.showPreview}
      />
      
      {stepData.explanation && (
        <div className="prose max-w-none bg-blue-50 p-6 rounded-lg">
          <ReactMarkdown>{stepData.explanation}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

// Debug Quiz Component
function DebugQuizStep({ stepData }: { stepData: any }) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (optionId: string) => {
    setSelectedOption(optionId);
    setShowResult(true);
  };

  const selectedAnswer = stepData.options.find((o: any) => o.id === selectedOption);

  return (
    <div className="space-y-6">
      {/* Broken Code */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">🐛 Broken Code:</h3>
        <CodeDisplay code={stepData.code} />
      </div>

      {/* Question */}
      <div className="bg-orange-50 p-6 rounded-lg">
        <p className="font-medium text-lg text-gray-900">{stepData.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {stepData.options.map((option: any) => (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            disabled={showResult}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedOption === option.id
                ? option.isCorrect
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
                : showResult
                ? 'border-gray-200 opacity-50 cursor-not-allowed'
                : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50 cursor-pointer'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {selectedOption === option.id ? (
                  option.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-red-600" />
                  )
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <span className="text-gray-900">{option.text}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Result */}
      {showResult && selectedAnswer && (
        <div className={`p-6 rounded-lg ${
          selectedAnswer.isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-orange-50 border-2 border-orange-200'
        }`}>
          <p className="font-bold text-lg mb-2">
            {selectedAnswer.isCorrect ? '✅ Correct!' : '❌ Not quite...'}
          </p>
          <p className="text-gray-700">{selectedAnswer.explanation}</p>
        </div>
      )}

      {/* Correct Code */}
      {showResult && stepData.correctCode && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">✅ Fixed Code:</h3>
          <CodeDisplay code={stepData.correctCode} />
          
          {stepData.lesson && (
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="prose max-w-none">
                <ReactMarkdown>{stepData.lesson}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Coding Task Component
function CodingTaskStep({ stepData }: { stepData: any }) {
  const [code, setCode] = useState(stepData.starterCode);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="space-y-6">
      {/* Requirements */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <span>📋</span> Requirements:
        </h3>
        <ul className="space-y-2">
          {stepData.requirements.map((req: string, idx: number) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-primary-600 mt-1">•</span>
              <span className="text-gray-700">{req}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Code Editor */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Your Code:</h3>
        <InteractiveCodeEditor 
          code={code}
          readOnly={false}
          showPreview={true}
          onCodeChange={setCode}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowHints(!showHints)}
          className="cursor-pointer"
        >
          <Lightbulb className="w-4 h-4 mr-2" />
          {showHints ? 'Hide' : 'Show'} Hints
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSolution(!showSolution)}
          className="cursor-pointer"
        >
          {showSolution ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
          {showSolution ? 'Hide' : 'Show'} Solution
        </Button>
      </div>

      {/* Hints */}
      {showHints && (
        <div className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-200">
          <h4 className="font-bold mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Hints:
          </h4>
          <ul className="space-y-2">
            {stepData.hints.map((hint: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold">{idx + 1}.</span>
                <span className="text-gray-700">{hint}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Solution */}
      {showSolution && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">✅ Solution:</h3>
          <CodeDisplay code={stepData.solution} />
        </div>
      )}
    </div>
  );
}

// Coding Challenge Component
function CodingChallengeStep({ stepData }: { stepData: any }) {
  return <CodingTaskStep stepData={stepData} />;
}