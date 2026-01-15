// // src/features/learning/components/UnitPlayer.tsx
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '../../../shared/components/Button';
// import { Card } from '../../../shared/components/Card';
// import { useUnit } from '../../content/hooks/useUnit';
// import { 
//   getUnitProgress, 
//   updateUnitProgress, 
//   completeUnit 
// } from '../store/progressStore';
// import ReactMarkdown from 'react-markdown';
// import { InteractiveCodeEditor } from './InteractiveCodeEditor';
// import { CodeDisplay } from './CodeDisplay';
// import { CompletionModal } from './CompletionModal';
// import { GameRouter } from './games/GameRouter';
// import { 
//   CheckCircle2, 
//   Circle, 
//   Lightbulb, 
//   Eye, 
//   EyeOff,
//   Gamepad2
// } from 'lucide-react';

// interface UnitPlayerProps {
//   contentId: string;
//   unitId: string;
// }

// // Dynamic step detection
// const isGameStep = (type: string) => {
//   return ['game-intro', 'code-battle', 'code-puzzle', 'memory-game', 
//           'speed-typing-race', 'bug-hunt-shooter', 'tower-defense'].includes(type);
// };

// const isTraditionalStep = (type: string) => {
//   return ['markdown', 'interactive-code', 'debug-quiz', 'coding-task', 'coding-challenge'].includes(type);
// };

// export function UnitPlayer({ contentId, unitId }: UnitPlayerProps) {
//   const { unit, loading, error, retry } = useUnit(contentId, unitId);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [startTime] = useState(Date.now());
//   const [showCompletion, setShowCompletion] = useState(false);
//   const navigate = useNavigate();

//   // Get all step keys dynamically from unit.steps
//   const stepKeys = unit ? Object.keys(unit.steps) : [];
//   const totalSteps = stepKeys.length;

//   // Get step icons and titles dynamically
//   const getStepIcon = (stepData: any) => {
//     if (isGameStep(stepData.type)) {
//       switch (stepData.type) {
//         case 'game-intro': return '🎮';
//         case 'code-battle': return '⚔️';
//         case 'code-puzzle': return '🧩';
//         case 'memory-game': return '🧠';
//         case 'speed-typing-race': return '🏁';
//         case 'bug-hunt-shooter': return '🐛';
//         case 'tower-defense': return '🏰';
//         default: return '🎯';
//       }
//     }
//     // Traditional steps
//     return ['📚', '✅', '🐛', '🛠️', '🏆'][currentStep] || '📖';
//   };

//   const getStepTitle = (stepKey: string, stepData: any) => {
//     if (isGameStep(stepData.type)) {
//       return stepData.title || stepKey;
//     }
//     // Traditional steps
//     const titles: Record<string, string> = {
//       'refresher': 'Refresher',
//       'positive': 'See It Work',
//       'negative': 'Debug It',
//       'task': 'Build It',
//       'challenge': 'Master It',
//     };
//     return titles[stepKey] || stepKey;
//   };

//   // Load progress on mount
//   useEffect(() => {
//     if (unit) {
//       const progress = getUnitProgress(contentId, unitId);
//       if (progress) {
//         setCurrentStep(Math.min(progress.currentStep, totalSteps - 1));
//       } else {
//         updateUnitProgress(contentId, unitId, {
//           currentStep: 0,
//           stepsCompleted: [],
//         });
//       }
//     }
//   }, [unit, contentId, unitId, totalSteps]);

//   // Save progress when step changes
//   useEffect(() => {
//     if (unit) {
//       const elapsed = Math.floor((Date.now() - startTime) / 1000);
//       updateUnitProgress(contentId, unitId, {
//         currentStep,
//         timeSpent: elapsed,
//       });
//     }
//   }, [currentStep, unit, contentId, unitId, startTime]);

//   const handleNext = () => {
//     if (currentStep < totalSteps - 1) {
//       // Mark step as completed
//       const progress = getUnitProgress(contentId, unitId);
//       const completed = progress?.stepsCompleted || [];
//       if (!completed.includes(currentStep)) {
//         completed.push(currentStep);
//         updateUnitProgress(contentId, unitId, {
//           stepsCompleted: completed,
//         });
//       }
      
//       setCurrentStep(currentStep + 1);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     } else {
//       // Complete unit
//       const elapsed = Math.floor((Date.now() - startTime) / 1000);
//       completeUnit(contentId, unitId, unit.xp);
//       updateUnitProgress(contentId, unitId, {
//         timeSpent: elapsed,
//       });
//       setShowCompletion(true);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentStep > 0) {
//       setCurrentStep(currentStep - 1);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   const handleStepClick = (stepIndex: number) => {
//     const progress = getUnitProgress(contentId, unitId);
//     const completed = progress?.stepsCompleted || [];
    
//     // Can go to completed steps or current step + 1
//     if (stepIndex <= currentStep || completed.includes(stepIndex - 1)) {
//       setCurrentStep(stepIndex);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   const handleGameComplete = (score?: number) => {
//     // Award bonus XP for game completion
//     if (score) {
//       const progress = getUnitProgress(contentId, unitId);
//       updateUnitProgress(contentId, unitId, {
//         score: (progress?.score || 0) + score,
//       });
//     }
    
//     // Auto-advance after game completion
//     setTimeout(() => handleNext(), 1500);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading unit...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//         <Card className="text-center max-w-md">
//           <div className="text-6xl mb-4">
//             {error.code === 'NOT_FOUND' ? '🔍' : 
//              error.code === 'NETWORK_ERROR' ? '📡' : 
//              error.code === 'PARSE_ERROR' ? '⚠️' : '❌'}
//           </div>
          
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">
//             {error.code === 'NOT_FOUND' ? 'Unit Not Found' :
//              error.code === 'NETWORK_ERROR' ? 'Connection Error' :
//              error.code === 'PARSE_ERROR' ? 'Content Error' :
//              'Something Went Wrong'}
//           </h2>
          
//           <p className="text-gray-600 mb-6">{error.message}</p>
          
//           {import.meta.env.DEV && (
//             <details className="text-left mb-6 p-4 bg-gray-100 rounded text-sm">
//               <summary className="cursor-pointer font-medium mb-2">
//                 Technical Details
//               </summary>
//               <div className="space-y-1 text-xs font-mono text-gray-700">
//                 <p><strong>Code:</strong> {error.code}</p>
//                 <p><strong>Content ID:</strong> {error.contentId || 'N/A'}</p>
//                 <p><strong>Unit ID:</strong> {error.unitId || 'N/A'}</p>
//               </div>
//             </details>
//           )}
          
//           <div className="space-y-3">
//             {error.code === 'NETWORK_ERROR' && (
//               <Button onClick={retry} size="lg" className="w-full">
//                 Try Again
//               </Button>
//             )}
//             <Button 
//               onClick={() => navigate('/dashboard')}
//               variant={error.code === 'NETWORK_ERROR' ? 'outline' : 'primary'}
//               size="lg" 
//               className="w-full"
//             >
//               ← Back to Dashboard
//             </Button>
//           </div>
//         </Card>
//       </div>
//     );
//   }
  
//   if (!unit) return null;

//   const currentStepKey = stepKeys[currentStep];
//   const stepData = unit.steps[currentStepKey];
//   const progress = getUnitProgress(contentId, unitId);
//   const completedSteps = progress?.stepsCompleted || [];
  
//   const currentStepIcon = getStepIcon(stepData);
//   const currentStepTitle = getStepTitle(currentStepKey, stepData);

//   // Check if this is a gamified unit
//   const hasGames = stepKeys.some(key => isGameStep(unit.steps[key].type));

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Completion Modal */}
//       {showCompletion && (
//         <CompletionModal
//           unitTitle={unit.title}
//           xpEarned={unit.xp}
//           timeSpent={Math.floor((Date.now() - startTime) / 1000)}
//           nextUnitId={unit.unlocks?.[0]}
//           contentId={contentId}
//           isOpen={showCompletion}
//           onClose={() => {
//             setShowCompletion(false);
//             navigate('/dashboard');
//           }}
//         />
//       )}

//       {/* Progress Sidebar */}
//       <div className="fixed left-0 top-16 h-full w-16 bg-white border-r border-gray-200 hidden lg:block z-40">
//         <div className="flex flex-col items-center py-6 gap-4">
//           {stepKeys.map((key, index) => {
//             const step = unit.steps[key];
//             const icon = getStepIcon(step);
//             const isGame = isGameStep(step.type);
            
//             return (
//               <button
//                 key={key}
//                 onClick={() => handleStepClick(index)}
//                 className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
//                   index === currentStep
//                     ? isGame
//                       ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white scale-110 shadow-lg'
//                       : 'bg-primary-600 text-white scale-110'
//                     : completedSteps.includes(index)
//                     ? 'bg-green-100 text-green-600 hover:bg-green-200 cursor-pointer'
//                     : index < currentStep
//                     ? 'bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-pointer'
//                     : 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                 }`}
//                 disabled={index > currentStep && !completedSteps.includes(index - 1)}
//                 title={getStepTitle(key, step)}
//               >
//                 {completedSteps.includes(index) ? '✓' : icon}
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="lg:ml-16">
//         {/* Progress Bar */}
//         <div className={`bg-white border-b border-gray-200 sticky top-0 z-40 ${
//           isGameStep(stepData.type) ? 'bg-gradient-to-r from-purple-50 to-pink-50' : ''
//         }`}>
//           <div className="max-w-5xl mx-auto px-4 py-4">
//             <div className="flex items-center justify-between mb-2">
//               <div className="flex items-center gap-3">
//                 <span className="text-2xl">{currentStepIcon}</span>
//                 <div>
//                   <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                     Step {currentStep + 1} of {totalSteps}
//                     {isGameStep(stepData.type) && (
//                       <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
//                         <Gamepad2 className="w-3 h-3" />
//                         GAME
//                       </span>
//                     )}
//                   </div>
//                   <div className="text-xs text-gray-500">
//                     {currentStepTitle}
//                   </div>
//                 </div>
//               </div>
//               <span className="text-sm text-gray-600 font-medium">
//                 {unit.title}
//               </span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div 
//                 className={`h-2 rounded-full transition-all duration-300 ${
//                   hasGames 
//                     ? 'bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500'
//                     : 'bg-primary-600'
//                 }`}
//                 style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
//               ></div>
//             </div>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="max-w-5xl mx-auto px-4 py-8">
//           <div className="animate-fade-in">
//             {/* Step Content */}
//             <Card className={`mb-6 ${
//               isGameStep(stepData.type) 
//                 ? 'border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50' 
//                 : ''
//             }`}>
//               {!isGameStep(stepData.type) && (
//                 <div className="mb-6">
//                   <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                     {stepData.title}
//                   </h1>
//                   {stepData.description && (
//                     <p className="text-gray-600">{stepData.description}</p>
//                   )}
//                 </div>
//               )}

//               {/* Markdown Step */}
//               {stepData.type === 'markdown' && (
//                 <div className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
//                   <ReactMarkdown>{stepData.content}</ReactMarkdown>
//                 </div>
//               )}

//               {/* Interactive Code */}
//               {stepData.type === 'interactive-code' && (
//                 <PositiveCaseStep stepData={stepData} />
//               )}

//               {/* Debug Quiz */}
//               {stepData.type === 'debug-quiz' && (
//                 <DebugQuizStep stepData={stepData} />
//               )}

//               {/* Coding Task */}
//               {stepData.type === 'coding-task' && (
//                 <CodingTaskStep stepData={stepData} />
//               )}

//               {/* Coding Challenge */}
//               {stepData.type === 'coding-challenge' && (
//                 <CodingChallengeStep stepData={stepData} />
//               )}

//               {/* GAME TYPES - All handled by GameRouter */}
//               {isGameStep(stepData.type) && (
//                 <GameRouter 
//                   stepData={stepData} 
//                   onComplete={handleGameComplete}
//                 />
//               )}
//             </Card>

//             {/* Navigation */}
//             <div className="flex justify-between items-center">
//               <Button
//                 variant="outline"
//                 onClick={handlePrevious}
//                 disabled={currentStep === 0}
//                 size="lg"
//                 className="cursor-pointer"
//               >
//                 ← Previous
//               </Button>
              
//               <div className="text-sm text-gray-600">
//                 {currentStep + 1} / {totalSteps} steps
//               </div>

//               <Button 
//                 onClick={handleNext}
//                 size="lg"
//                 className="min-w-[150px] cursor-pointer"
//               >
//                 {currentStep === totalSteps - 1 ? (
//                   <>
//                     Complete Unit ✓
//                     <span className="ml-2">+{unit.xp} XP</span>
//                   </>
//                 ) : (
//                   'Next Step →'
//                 )}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Traditional step components remain the same
// function PositiveCaseStep({ stepData }: { stepData: any }) {
//   return (
//     <div className="space-y-6">
//       <InteractiveCodeEditor 
//         code={stepData.code}
//         readOnly={true}
//         showPreview={stepData.showPreview}
//       />
      
//       {stepData.explanation && (
//         <div className="prose max-w-none bg-blue-50 p-6 rounded-lg">
//           <ReactMarkdown>{stepData.explanation}</ReactMarkdown>
//         </div>
//       )}
//     </div>
//   );
// }

// function DebugQuizStep({ stepData }: { stepData: any }) {
//   const [selectedOption, setSelectedOption] = useState<string | null>(null);
//   const [showResult, setShowResult] = useState(false);

//   const handleSelect = (optionId: string) => {
//     setSelectedOption(optionId);
//     setShowResult(true);
//   };

//   const selectedAnswer = stepData.options.find((o: any) => o.id === selectedOption);

//   return (
//     <div className="space-y-6">
//       <div>
//         <h3 className="text-sm font-semibold text-gray-700 mb-2">🐛 Broken Code:</h3>
//         <CodeDisplay code={stepData.code} />
//       </div>

//       <div className="bg-orange-50 p-6 rounded-lg">
//         <p className="font-medium text-lg text-gray-900">{stepData.question}</p>
//       </div>

//       <div className="space-y-3">
//         {stepData.options.map((option: any) => (
//           <button
//             key={option.id}
//             onClick={() => handleSelect(option.id)}
//             disabled={showResult}
//             className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
//               selectedOption === option.id
//                 ? option.isCorrect
//                   ? 'border-green-500 bg-green-50'
//                   : 'border-red-500 bg-red-50'
//                 : showResult
//                 ? 'border-gray-200 opacity-50 cursor-not-allowed'
//                 : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50 cursor-pointer'
//             }`}
//           >
//             <div className="flex items-start gap-3">
//               <div className="mt-1">
//                 {selectedOption === option.id ? (
//                   option.isCorrect ? (
//                     <CheckCircle2 className="w-5 h-5 text-green-600" />
//                   ) : (
//                     <Circle className="w-5 h-5 text-red-600" />
//                   )
//                 ) : (
//                   <Circle className="w-5 h-5 text-gray-400" />
//                 )}
//               </div>
//               <span className="text-gray-900">{option.text}</span>
//             </div>
//           </button>
//         ))}
//       </div>

//       {showResult && selectedAnswer && (
//         <div className={`p-6 rounded-lg ${
//           selectedAnswer.isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-orange-50 border-2 border-orange-200'
//         }`}>
//           <p className="font-bold text-lg mb-2">
//             {selectedAnswer.isCorrect ? '✅ Correct!' : '❌ Not quite...'}
//           </p>
//           <p className="text-gray-700">{selectedAnswer.explanation}</p>
//         </div>
//       )}

//       {showResult && stepData.correctCode && (
//         <div className="space-y-3">
//           <h3 className="text-sm font-semibold text-gray-700">✅ Fixed Code:</h3>
//           <CodeDisplay code={stepData.correctCode} />
          
//           {stepData.lesson && (
//             <div className="bg-blue-50 p-6 rounded-lg">
//               <div className="prose max-w-none">
//                 <ReactMarkdown>{stepData.lesson}</ReactMarkdown>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// function CodingTaskStep({ stepData }: { stepData: any }) {
//   const [code, setCode] = useState(stepData.starterCode);
//   const [showHints, setShowHints] = useState(false);
//   const [showSolution, setShowSolution] = useState(false);

//   return (
//     <div className="space-y-6">
//       <div className="bg-blue-50 p-6 rounded-lg">
//         <h3 className="font-bold mb-3 flex items-center gap-2">
//           <span>📋</span> Requirements:
//         </h3>
//         <ul className="space-y-2">
//           {stepData.requirements.map((req: string, idx: number) => (
//             <li key={idx} className="flex items-start gap-2">
//               <span className="text-primary-600 mt-1">•</span>
//               <span className="text-gray-700">{req}</span>
//             </li>
//           ))}
//         </ul>
//       </div>

//       <div>
//         <h3 className="text-sm font-semibold text-gray-700 mb-2">Your Code:</h3>
//         <InteractiveCodeEditor 
//           code={code}
//           readOnly={false}
//           showPreview={true}
//           onCodeChange={setCode}
//         />
//       </div>

//       <div className="flex gap-3">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => setShowHints(!showHints)}
//           className="cursor-pointer"
//         >
//           <Lightbulb className="w-4 h-4 mr-2" />
//           {showHints ? 'Hide' : 'Show'} Hints
//         </Button>
        
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => setShowSolution(!showSolution)}
//           className="cursor-pointer"
//         >
//           {showSolution ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
//           {showSolution ? 'Hide' : 'Show'} Solution
//         </Button>
//       </div>

//       {showHints && (
//         <div className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-200">
//           <h4 className="font-bold mb-3 flex items-center gap-2">
//             <Lightbulb className="w-5 h-5 text-yellow-600" />
//             Hints:
//           </h4>
//           <ul className="space-y-2">
//             {stepData.hints.map((hint: string, idx: number) => (
//               <li key={idx} className="flex items-start gap-2">
//                 <span className="text-yellow-600 font-bold">{idx + 1}.</span>
//                 <span className="text-gray-700">{hint}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {showSolution && (
//         <div className="space-y-3">
//           <h3 className="text-sm font-semibold text-gray-700">✅ Solution:</h3>
//           <CodeDisplay code={stepData.solution} />
//         </div>
//       )}
//     </div>
//   );
// }

// function CodingChallengeStep({ stepData }: { stepData: any }) {
//   return <CodingTaskStep stepData={stepData} />;
// }
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
import { GameRouter } from './games/GameRouter';
import { VideoPreview } from './VideoPreview';
import { 
  CheckCircle2, 
  Circle, 
  Lightbulb, 
  Eye, 
  EyeOff,
  Gamepad2,
  Play,
  X,
  Maximize2
} from 'lucide-react';

interface UnitPlayerProps {
  contentId: string;
  unitId: string;
}

// Dynamic step detection
const isGameStep = (type: string) => {
  return ['game-intro', 'code-battle', 'code-puzzle', 'memory-game', 
          'speed-typing-race', 'bug-hunt-shooter', 'tower-defense'].includes(type);
};

const isTraditionalStep = (type: string) => {
  return ['markdown', 'interactive-code', 'debug-quiz', 'coding-task', 'coding-challenge'].includes(type);
};

export function UnitPlayer({ contentId, unitId }: UnitPlayerProps) {
  const { unit, loading, error, retry } = useUnit(contentId, unitId);
  const [currentStep, setCurrentStep] = useState(0);
  const [startTime] = useState(Date.now());
  const [showCompletion, setShowCompletion] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [videoFullscreen, setVideoFullscreen] = useState(false);
  const navigate = useNavigate();

  // Get all step keys dynamically from unit.steps
  const stepKeys = unit ? Object.keys(unit.steps) : [];
  const totalSteps = stepKeys.length;

  // Auto-show video preview on first visit to refresher step
  useEffect(() => {
    if (unit && unit.preview && currentStep === 0) {
      const progress = getUnitProgress(contentId, unitId);
      if (!progress || progress.currentStep === 0) {
        // First time visiting this unit, show video
        setShowVideoPreview(true);
      }
    }
  }, [unit, currentStep, contentId, unitId]);

  // Get step icons and titles dynamically
  const getStepIcon = (stepData: any) => {
    if (isGameStep(stepData.type)) {
      switch (stepData.type) {
        case 'game-intro': return '🎮';
        case 'code-battle': return '⚔️';
        case 'code-puzzle': return '🧩';
        case 'memory-game': return '🧠';
        case 'speed-typing-race': return '🏁';
        case 'bug-hunt-shooter': return '🐛';
        case 'tower-defense': return '🏰';
        default: return '🎯';
      }
    }
    return ['📚', '✅', '🐛', '🛠️', '🏆'][currentStep] || '📖';
  };

  const getStepTitle = (stepKey: string, stepData: any) => {
    if (isGameStep(stepData.type)) {
      return stepData.title || stepKey;
    }
    const titles: Record<string, string> = {
      'refresher': 'Refresher',
      'positive': 'See It Work',
      'negative': 'Debug It',
      'task': 'Build It',
      'challenge': 'Master It',
    };
    return titles[stepKey] || stepKey;
  };

  // Load progress on mount
  useEffect(() => {
    if (unit) {
      const progress = getUnitProgress(contentId, unitId);
      if (progress) {
        setCurrentStep(Math.min(progress.currentStep, totalSteps - 1));
      } else {
        updateUnitProgress(contentId, unitId, {
          currentStep: 0,
          stepsCompleted: [],
        });
      }
    }
  }, [unit, contentId, unitId, totalSteps]);

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
    if (currentStep < totalSteps - 1) {
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
    
    if (stepIndex <= currentStep || completed.includes(stepIndex - 1)) {
      setCurrentStep(stepIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGameComplete = (score?: number) => {
    if (score) {
      const progress = getUnitProgress(contentId, unitId);
      updateUnitProgress(contentId, unitId, {
        score: (progress?.score || 0) + score,
      });
    }
    setTimeout(() => handleNext(), 1500);
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
          <div className="text-6xl mb-4">
            {error.code === 'NOT_FOUND' ? '🔍' : 
             error.code === 'NETWORK_ERROR' ? '📡' : 
             error.code === 'PARSE_ERROR' ? '⚠️' : '❌'}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error.code === 'NOT_FOUND' ? 'Unit Not Found' :
             error.code === 'NETWORK_ERROR' ? 'Connection Error' :
             error.code === 'PARSE_ERROR' ? 'Content Error' :
             'Something Went Wrong'}
          </h2>
          
          <p className="text-gray-600 mb-6">{error.message}</p>
          
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
  
  if (!unit) return null;

  const currentStepKey = stepKeys[currentStep];
  const stepData = unit.steps[currentStepKey];
  const progress = getUnitProgress(contentId, unitId);
  const completedSteps = progress?.stepsCompleted || [];
  
  const currentStepIcon = getStepIcon(stepData);
  const currentStepTitle = getStepTitle(currentStepKey, stepData);
  const hasGames = stepKeys.some(key => isGameStep(unit.steps[key].type));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Completion Modal */}
      {showCompletion && (
        <CompletionModal
          unitTitle={unit.title}
          xpEarned={unit.xp}
          timeSpent={Math.floor((Date.now() - startTime) / 1000)}
          nextUnitId={unit.unlocks?.[0]}
          contentId={contentId}
          isOpen={showCompletion}
          onClose={() => {
            setShowCompletion(false);
            navigate('/dashboard');
          }}
        />
      )}

      {/* Video Preview Modal */}
      {showVideoPreview && unit.preview && (
        <VideoPreviewModal
          preview={unit.preview}
          isFullscreen={videoFullscreen}
          onToggleFullscreen={() => setVideoFullscreen(!videoFullscreen)}
          onClose={() => setShowVideoPreview(false)}
        />
      )}

      {/* Progress Sidebar */}
      <div className="fixed left-0 top-16 h-full w-16 bg-white border-r border-gray-200 hidden lg:block z-40">
        <div className="flex flex-col items-center py-6 gap-4">
          {/* Video Preview Button */}
          {unit.preview && (
            <button
              onClick={() => setShowVideoPreview(true)}
              className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition-all mb-2 shadow-lg"
              title="Watch Preview Video"
            >
              <Play className="w-5 h-5" />
            </button>
          )}

          {stepKeys.map((key, index) => {
            const step = unit.steps[key];
            const icon = getStepIcon(step);
            const isGame = isGameStep(step.type);
            
            return (
              <button
                key={key}
                onClick={() => handleStepClick(index)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  index === currentStep
                    ? isGame
                      ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white scale-110 shadow-lg'
                      : 'bg-primary-600 text-white scale-110'
                    : completedSteps.includes(index)
                    ? 'bg-green-100 text-green-600 hover:bg-green-200 cursor-pointer'
                    : index < currentStep
                    ? 'bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-pointer'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                disabled={index > currentStep && !completedSteps.includes(index - 1)}
                title={getStepTitle(key, step)}
              >
                {completedSteps.includes(index) ? '✓' : icon}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-16">
        {/* Progress Bar */}
        <div className={`bg-white border-b border-gray-200 sticky top-0 z-40 ${
          isGameStep(stepData.type) ? 'bg-gradient-to-r from-purple-50 to-pink-50' : ''
        }`}>
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{currentStepIcon}</span>
                <div>
                  <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    Step {currentStep + 1} of {totalSteps}
                    {isGameStep(stepData.type) && (
                      <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <Gamepad2 className="w-3 h-3" />
                        GAME
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {currentStepTitle}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Video Preview Button in Header */}
                {unit.preview && (
                  <button
                    onClick={() => setShowVideoPreview(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                  >
                    <Play className="w-4 h-4" />
                    Watch Preview
                  </button>
                )}
                <span className="text-sm text-gray-600 font-medium">
                  {unit.title}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  hasGames 
                    ? 'bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500'
                    : 'bg-primary-600'
                }`}
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="animate-fade-in">
            {/* Step Content */}
            <Card className={`mb-6 ${
              isGameStep(stepData.type) 
                ? 'border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50' 
                : ''
            }`}>
              {!isGameStep(stepData.type) && (
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {stepData.title}
                  </h1>
                  {stepData.description && (
                    <p className="text-gray-600">{stepData.description}</p>
                  )}
                </div>
              )}

              {/* Markdown Step */}
              {stepData.type === 'markdown' && (
                <div className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
                  <ReactMarkdown>{stepData.content}</ReactMarkdown>
                </div>
              )}

              {/* Interactive Code */}
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
              {isGameStep(stepData.type) && (
                <GameRouter 
                  stepData={stepData} 
                  onComplete={handleGameComplete}
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
                className="cursor-pointer"
              >
                ← Previous
              </Button>
              
              <div className="text-sm text-gray-600">
                {currentStep + 1} / {totalSteps} steps
              </div>

              <Button 
                onClick={handleNext}
                size="lg"
                className="min-w-[150px] cursor-pointer"
              >
                {currentStep === totalSteps - 1 ? (
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

// Video Preview Modal Component
function VideoPreviewModal({ 
  preview, 
  isFullscreen,
  onToggleFullscreen,
  onClose 
}: { 
  preview: any;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-lg overflow-hidden transition-all ${
        isFullscreen ? 'w-full h-full' : 'max-w-4xl w-full'
      }`}>
        {/* Header */}
        <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Play className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="font-bold">Preview Video</h3>
              {preview.duration && (
                <p className="text-xs text-gray-400">{preview.duration}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleFullscreen}
              className="p-2 hover:bg-gray-800 rounded transition-colors"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              <Maximize2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Container */}
        <div className={`bg-black ${isFullscreen ? 'h-[calc(100%-60px)]' : 'aspect-video'}`}>
          <iframe
            src={preview.videoUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Unit Preview Video"
          />
        </div>

        {/* Description */}
        {!isFullscreen && preview.description && (
          <div className="p-4 bg-gray-50">
            <p className="text-gray-700 text-sm">{preview.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Traditional step components remain the same
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
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">🐛 Broken Code:</h3>
        <CodeDisplay code={stepData.code} />
      </div>

      <div className="bg-orange-50 p-6 rounded-lg">
        <p className="font-medium text-lg text-gray-900">{stepData.question}</p>
      </div>

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

function CodingTaskStep({ stepData }: { stepData: any }) {
  const [code, setCode] = useState(stepData.starterCode);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="space-y-6">
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

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Your Code:</h3>
        <InteractiveCodeEditor 
          code={code}
          readOnly={false}
          showPreview={true}
          onCodeChange={setCode}
        />
      </div>

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

      {showSolution && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">✅ Solution:</h3>
          <CodeDisplay code={stepData.solution} />
        </div>
      )}
    </div>
  );
}

function CodingChallengeStep({ stepData }: { stepData: any }) {
  return <CodingTaskStep stepData={stepData} />;
}