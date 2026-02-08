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
// REPLACE THIS:
// import { UniversalPracticeEditor } from '../components/UniversalPracticeEditor';
// WITH THIS:
import { CodePlayground } from './code-playground/CodePlayground';
import type { FileMap } from './code-playground';
import { CompletionModal } from './CompletionModal';
import { GameRouter } from './games/GameRouter';
import { 
  CheckCircle2, 
  Circle, 
  Lightbulb, 
  Eye,
  EyeOff,
  Play,
  Video as VideoIcon,
  X,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Code2,
  Target,
  Trophy,
  Clock,
  AlertCircle
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

export function UnitPlayer({ contentId, unitId }: UnitPlayerProps) {
  const { unit, loading, error, retry } = useUnit(contentId, unitId);
  const [currentStep, setCurrentStep] = useState(0);
  const [startTime] = useState(Date.now());
  const [showCompletion, setShowCompletion] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [videoFullscreen, setVideoFullscreen] = useState(false);
  const [showStepVideo, setShowStepVideo] = useState(false);
  const [showHelpVideo, setShowHelpVideo] = useState(false);
  const navigate = useNavigate();

  const stepKeys = unit ? Object.keys(unit.steps) : [];
  const totalSteps = stepKeys.length;

  const currentStepKey = stepKeys[currentStep];
  const stepData = unit?.steps[currentStepKey];

  const hasUnitVideo = !!unit?.preview?.videoUrl;
  const hasStepVideo = !!stepData?.video?.videoUrl;
  // const hasHelpVideo = !!stepData?.helpVideo?.videoUrl;

  // Auto-show video preview on first visit
  useEffect(() => {
    if (unit && unit.preview && currentStep === 0) {
      const progress = getUnitProgress(contentId, unitId);
      if (!progress || progress.currentStep === 0) {
        setShowVideoPreview(true);
      }
    }
  }, [unit, currentStep, contentId, unitId]);

  // Auto-show step video if configured
  useEffect(() => {
    if (stepData?.video?.autoShow) {
      setShowStepVideo(true);
    } else {
      setShowStepVideo(false);
    }
    setShowHelpVideo(false);
  }, [currentStep, stepData]);

  // Get step metadata
  const getStepMetadata = (stepKey: string, stepData: any) => {
    const metadata: Record<string, { icon: any; title: string; color: string }> = {
      'refresher': { 
        icon: BookOpen, 
        title: 'Learn the Concept',
        color: 'blue'
      },
      'positive': { 
        icon: CheckCircle2, 
        title: 'Working Example',
        color: 'green'
      },
      'negative': { 
        icon: AlertCircle, 
        title: 'Debug Challenge',
        color: 'orange'
      },
      'task': { 
        icon: Code2, 
        title: 'Coding Exercise',
        color: 'purple'
      },
      'challenge': { 
        icon: Trophy, 
        title: 'Advanced Challenge',
        color: 'yellow'
      },
    };

    // Game steps
    if (isGameStep(stepData.type)) {
      return {
        icon: Target,
        title: stepData.title || 'Interactive Challenge',
        color: 'pink'
      };
    }

    return metadata[stepKey] || { icon: BookOpen, title: stepKey, color: 'gray' };
  };

  // Load and save progress
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-primary-600 mx-auto mb-4"></div>
            <BookOpen className="w-6 h-6 text-primary-600 absolute top-5 left-1/2 transform -translate-x-1/2" />
          </div>
          <p className="text-gray-700 font-medium">Loading your lesson...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <Card className="text-center max-w-md shadow-xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error.code === 'NOT_FOUND' ? 'Lesson Not Found' :
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
              variant="outline"
              size="lg" 
              className="w-full"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  
  if (!unit) return null;

  const progress = getUnitProgress(contentId, unitId);
  const completedSteps = progress?.stepsCompleted || [];
  const stepMeta = getStepMetadata(currentStepKey, stepData);
  const StepIcon = stepMeta.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Completion Modal */}
      {showCompletion && (
        <CompletionModal
          unitTitle={unit.title}
          xpEarned={unit.xp}
          timeSpent={Math.floor((Date.now() - startTime) / 1000)}
          nextUnitId={unit.unlocks?.[0]}
          isOpen={showCompletion}
          onClose={() => {
            setShowCompletion(false);
            navigate('/dashboard');
          }}
        />
      )}

      {/* Unit Preview Video Modal */}
      {showVideoPreview && hasUnitVideo && (
        <VideoPlayerModal
          videoUrl={unit.preview.videoUrl}
          title={unit.preview.title || unit.title}
          duration={unit.preview.duration}
          description={unit.preview.description}
          platform={unit.preview.platform}
          isFullscreen={videoFullscreen}
          onToggleFullscreen={() => setVideoFullscreen(!videoFullscreen)}
          onClose={() => setShowVideoPreview(false)}
        />
      )}

      {/* Modern Progress Sidebar */}
      <div className="fixed left-0 top-0 h-full w-20 bg-white border-r border-gray-200 hidden lg:flex flex-col z-40 shadow-sm">
        {/* Logo/Home */}
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center hover:bg-primary-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="flex-1 flex flex-col items-center py-6 gap-3 overflow-y-auto">
          {/* Unit Video Preview */}
          {hasUnitVideo && (
            <button
              onClick={() => setShowVideoPreview(true)}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center hover:shadow-lg transition-all shadow-md mb-2"
              title="Watch Unit Overview"
            >
              <Play className="w-5 h-5" />
            </button>
          )}

          {stepKeys.map((key, index) => {
            const step = unit.steps[key];
            const meta = getStepMetadata(key, step);
            const Icon = meta.icon;
            const isCompleted = completedSteps.includes(index);
            const isCurrent = index === currentStep;
            const isLocked = index > currentStep && !completedSteps.includes(index - 1);
            
            return (
              <div key={key} className="relative">
                <button
                  onClick={() => handleStepClick(index)}
                  disabled={isLocked}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all relative ${
                    isCurrent
                      ? 'bg-primary-600 text-white shadow-lg scale-110 ring-4 ring-primary-100'
                      : isCompleted
                      ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer shadow-md'
                      : isLocked
                      ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-pointer'
                  }`}
                  title={meta.title}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </button>
                
                {/* Connection line */}
                {index < stepKeys.length - 1 && (
                  <div className={`absolute left-1/2 top-12 w-0.5 h-3 -translate-x-1/2 ${
                    isCompleted ? 'bg-green-300' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress indicator */}
        <div className="h-16 flex items-center justify-center border-t border-gray-200">
          <div className="text-center">
            <div className="text-xs font-bold text-primary-600">
              {Math.round(((currentStep + 1) / totalSteps) * 100)}%
            </div>
            <div className="text-xs text-gray-500">Complete</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-20">
        {/* Modern Header */}
       <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
    
    {/* Top row */}
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
      
      {/* Left: Step info */}
      <div className="flex items-start sm:items-center gap-3">
        <div
          className={`w-10 h-10 shrink-0 rounded-lg bg-${stepMeta.color}-100 flex items-center justify-center`}
        >
          <StepIcon className={`w-5 h-5 text-${stepMeta.color}-600`} />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              {stepMeta.title}
            </h2>

            {hasStepVideo && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                <VideoIcon className="w-3 h-3" />
                Video
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-gray-600">
            Step {currentStep + 1} of {totalSteps} • {unit.title}
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex flex-wrap items-center gap-2">
        {hasUnitVideo && (
          <button
            onClick={() => setShowVideoPreview(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors font-medium text-sm"
          >
            <Play className="w-4 h-4" />
            Overview
          </button>
        )}

        {hasStepVideo && (
          <button
            onClick={() => setShowStepVideo(!showStepVideo)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
          >
            <VideoIcon className="w-4 h-4" />
            {showStepVideo ? 'Hide' : 'Show'} Video
          </button>
        )}

        <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 rounded-lg">
          <Clock className="w-4 h-4 text-gray-600" />
          <span className="text-xs sm:text-sm font-medium text-gray-700">
            {unit.duration} min
          </span>
        </div>
      </div>
    </div>

    {/* Progress bar */}
    <div className="relative">
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        >
          <div className="h-full w-full bg-white/20 animate-pulse" />
        </div>
      </div>
    </div>

  </div>
</div>


        {/* Content Area */}
        <div className="max-w-[100rem] mx-auto px-6 py-8">
          {/* Step Content Card */}
          <Card className="mb-6 shadow-lg border-0">
            {/* Step Title */}
           {stepData.title && (
  <div className="mb-8 pb-8 border-b border-gray-200">
    <h1 className="text-4xl font-semibold tracking-tight text-gray-900 leading-tight mb-3 font-sans">
      {stepData.title}
    </h1>

    {stepData.description && (
      <p className="text-lg leading-relaxed text-gray-600 max-w-3xl font-normal">
        {stepData.description}
      </p>
    )}
  </div>
)}

            {/* Step Video */}
            {showStepVideo && hasStepVideo && (
              <div className="mb-8">
                <VideoPlayerEmbedded
                  videoUrl={stepData.video.videoUrl}
                  title={stepData.video.title}
                  duration={stepData.video.duration}
                  description={stepData.video.description}
                  platform={stepData.video.platform}
                  thumbnail={stepData.video.thumbnail}
                />
              </div>
            )}

           {/* Step Content */}
{stepData.type === 'markdown' && (
  <div className="
    prose prose-xl max-w-none
    prose-headings:font-semibold
    prose-headings:tracking-tight
    prose-headings:text-gray-900

    prose-p:text-gray-700
    prose-p:leading-relaxed

    prose-li:text-gray-700
    prose-li:leading-relaxed

    prose-strong:text-gray-900

    prose-hr:my-10

    prose-code:bg-gray-100
    prose-code:px-2
    prose-code:py-1
    prose-code:rounded-md
    prose-code:text-sm

    prose-pre:bg-gray-900
    prose-pre:text-gray-100
    prose-pre:rounded-xl
    prose-pre:p-4

    prose-blockquote:border-l-4
    prose-blockquote:border-blue-500
    prose-blockquote:bg-blue-50
    prose-blockquote:px-4
    prose-blockquote:py-2
    prose-blockquote:text-blue-900
    prose-blockquote:rounded-r-lg
  ">
    <ReactMarkdown>{stepData.content}</ReactMarkdown>
  </div>
)}


            {stepData.type === 'interactive-code' && (
              <PositiveCaseStep stepData={stepData} />
            )}

            {stepData.type === 'debug-quiz' && (
              <DebugQuizStep stepData={stepData} />
            )}

            {stepData.type === 'coding-task' && (
              <CodingTaskStep 
                stepData={stepData}
                showHelpVideo={showHelpVideo}
                onToggleHelpVideo={() => setShowHelpVideo(!showHelpVideo)}
              />
            )}

            {stepData.type === 'coding-challenge' && (
              <CodingChallengeStep 
                stepData={stepData}
                showHelpVideo={showHelpVideo}
                onToggleHelpVideo={() => setShowHelpVideo(!showHelpVideo)}
              />
            )}

            {isGameStep(stepData.type) && (
              <GameRouter 
                stepData={stepData} 
                onComplete={handleGameComplete}
              />
            )}
          </Card>

          {/* Navigation */}
          <div className="
  bg-white rounded-xl shadow-lg p-4 sm:p-6
  flex flex-col gap-4
  sm:flex-row sm:items-center sm:justify-between
">
  {/* Previous Button */}
 <Button
  variant="outline"
  onClick={handlePrevious}
  disabled={currentStep === 0}
  size="lg"
  className="w-full sm:w-auto min-w-[140px] flex items-center justify-center gap-2"
>
  <ChevronLeft className="w-4 h-4" />
  <span>Previous</span>
</Button>

  {/* Step Info */}
  <div className="text-center order-first sm:order-none">
    <div className="text-sm font-medium text-gray-700">
      Step {currentStep + 1} of {totalSteps}
    </div>
    <div className="text-xs text-gray-500 mt-1">
      {completedSteps.length} completed
    </div>
  </div>

  {/* Next / Complete Button */}
<Button
  onClick={handleNext}
  size="lg"
  className="
    w-full sm:w-auto min-w-[140px]
    flex items-center justify-center gap-2
    bg-gradient-to-r from-primary-600 to-primary-700
    hover:from-primary-700 hover:to-primary-800
  "
>
  {currentStep === totalSteps - 1 ? (
    <>
      <span>Complete</span>
      <Trophy className="w-4 h-4" />
    </>
  ) : (
    <>
      <span>Next</span>
      <ChevronRight className="w-4 h-4" />
    </>
  )}
</Button>
</div>

        </div>
      </div>
    </div>
  );
}

// ============================================
// VIDEO PLAYER COMPONENTS
// ============================================

function getVideoEmbedUrl(url: string, platform?: string): string {
  const detectedPlatform = platform || detectPlatform(url);
  
  if (detectedPlatform === 'youtube') {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1` : url;
  }
  
  if (detectedPlatform === 'vimeo') {
    const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
    return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
  }
  
  return url;
}

function detectPlatform(url: string): 'youtube' | 'vimeo' | 'direct' {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('vimeo.com')) return 'vimeo';
  return 'direct';
}

function VideoPlayerModal({ 
  videoUrl, 
  title, 
  duration, 
  description,
  platform,
  isFullscreen,
  onToggleFullscreen,
  onClose 
}: any) {
  const embedUrl = getVideoEmbedUrl(videoUrl, platform);
  const platformType = platform || detectPlatform(videoUrl);

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className={`bg-white rounded-2xl overflow-hidden transition-all shadow-2xl ${
        isFullscreen ? 'w-full h-full' : 'max-w-5xl w-full'
      }`}>
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold">{title || 'Video'}</h3>
              {duration && <p className="text-xs text-gray-400">{duration}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleFullscreen}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className={`bg-black ${isFullscreen ? 'h-[calc(100%-60px)]' : 'aspect-video'}`}>
          {platformType === 'direct' ? (
            <video src={embedUrl} controls className="w-full h-full" />
          ) : (
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={title || "Video Player"}
            />
          )}
        </div>

        {!isFullscreen && description && (
          <div className="p-6 bg-gray-50">
            <p className="text-gray-700">{description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function VideoPlayerEmbedded({ 
  videoUrl, 
  title, 
  duration, 
  description,
  platform,
  thumbnail
}: any) {
  const embedUrl = getVideoEmbedUrl(videoUrl, platform);
  const platformType = platform || detectPlatform(videoUrl);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      {title && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold">{title}</h3>
              {duration && <p className="text-sm opacity-90">{duration}</p>}
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-black aspect-video">
        {platformType === 'direct' ? (
          <video src={embedUrl} controls className="w-full h-full" poster={thumbnail} />
        ) : (
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title || "Video Player"}
          />
        )}
      </div>
      
      {description && (
        <div className="p-4 bg-blue-50 border-t border-blue-100">
          <p className="text-gray-700 text-sm">{description}</p>
        </div>
      )}
    </div>
  );
}

// ============================================
// STEP COMPONENTS WITH CODE PLAYGROUND
// ============================================

/**
 * Utility: Convert your existing step data format to CodePlayground format
 */
function convertStepDataToPlaygroundFiles(stepData: any): { files: FileMap; language: any } {
  // Detect language from code content or use provided language
  const detectLanguage = (code: string): 'html' | 'react' | 'javascript' => {
    const trimmedCode = code.trim();
    
    if (
      trimmedCode.includes('<!DOCTYPE') || 
      trimmedCode.includes('<html>') ||
      trimmedCode.includes('<head>') ||
      trimmedCode.includes('<body>')
    ) {
      return 'html';
    }
    
    if (
      code.includes('import React') || 
      code.includes('export default') || 
      code.includes('useState') ||
      code.includes('useEffect')
    ) {
      return 'react';
    }
    
    return 'javascript';
  };

  const language = stepData.language || detectLanguage(stepData.code || stepData.starterCode || '');
  
  // Determine the main file path based on language
  const getMainFilePath = (lang: string): string => {
    const paths: Record<string, string> = {
      html: 'index.html',
      css: 'styles.css',
      javascript: 'script.js',
      react: 'App.jsx',
    };
    return paths[lang] || 'App.jsx';
  };

  const mainFilePath = getMainFilePath(language);
  const code = stepData.code || stepData.starterCode || '';

  // Build files object
  const files: FileMap = {
    [mainFilePath]: {
      language: language === 'react' ? 'javascript' : language,
      code: code,
    },
  };

  // Add CSS file if it exists
  if (stepData.css) {
    files['styles.css'] = {
      language: 'css',
      code: stepData.css,
    };
  }

  // Add HTML wrapper for JavaScript if needed
  if (language === 'javascript' && !stepData.code?.includes('<!DOCTYPE')) {
    files['index.html'] = {
      language: 'html',
      code: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Code Preview</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="app"></div>
  <script src="${mainFilePath}"></script>
</body>
</html>`,
    };
  }

  return { files, language };
}

function PositiveCaseStep({ stepData }: { stepData: any }) {
  const { files, language } = convertStepDataToPlaygroundFiles(stepData);

  return (
    <div className="space-y-6">
      <CodePlayground
        config={{
          language: language,
          files: files,
          showPreview: stepData.showPreview ?? true,
          showConsole: stepData.showConsole ?? false,
          readOnly: true, // Read-only for positive examples
          theme: 'dark',
          height: '600px',
        }}
      />
     
      {stepData.explanation && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
          <div className="prose prose-blue max-w-none">
            <ReactMarkdown>{stepData.explanation}</ReactMarkdown>
          </div>
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
  const { files: brokenFiles, language } = convertStepDataToPlaygroundFiles({ 
    code: stepData.code, 
    language: stepData.language 
  });

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-orange-600" />
          <h3 className="font-bold text-gray-900">Broken Code</h3>
        </div>
        <CodePlayground
          config={{
            language: language,
            files: brokenFiles,
            showPreview: true,
            showConsole: true,
            readOnly: true,
            theme: 'dark',
            height: '400px',
          }}
        />
      </div>

      <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg">
        <p className="font-medium text-lg text-gray-900">{stepData.question}</p>
      </div>

      <div className="space-y-3">
        {stepData.options.map((option: any) => (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            disabled={showResult}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
              selectedOption === option.id
                ? option.isCorrect
                  ? 'border-green-500 bg-green-50 shadow-md'
                  : 'border-red-500 bg-red-50 shadow-md'
                : showResult
                ? 'border-gray-200 opacity-50 cursor-not-allowed'
                : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50 cursor-pointer shadow-sm hover:shadow-md'
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
              <span className="text-gray-900 font-medium">{option.text}</span>
            </div>
          </button>
        ))}
      </div>

      {showResult && selectedAnswer && (
        <div className={`p-6 rounded-xl border-2 ${
          selectedAnswer.isCorrect 
            ? 'bg-green-50 border-green-200' 
            : 'bg-orange-50 border-orange-200'
        }`}>
          <div className="flex items-start gap-3">
            {selectedAnswer.isCorrect ? (
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            ) : (
              <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
            )}
            <div>
              <p className="font-bold text-lg mb-2">
                {selectedAnswer.isCorrect ? 'Correct!' : 'Not quite right'}
              </p>
              <p className="text-gray-700">{selectedAnswer.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {showResult && stepData.correctCode && (
        <div className="space-y-4">
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <h3 className="font-bold text-gray-900">Fixed Code</h3>
            </div>
            <CodePlayground
              config={{
                language: language,
                files: convertStepDataToPlaygroundFiles({ 
                  code: stepData.correctCode, 
                  language: stepData.language 
                }).files,
                showPreview: true,
                showConsole: true,
                readOnly: true,
                theme: 'dark',
                height: '400px',
              }}
            />
          </div>
          
          {stepData.lesson && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
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

function CodingTaskStep({ stepData, showHelpVideo, onToggleHelpVideo }: any) {
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [userFiles, setUserFiles] = useState<FileMap>(() => {
    const { files } = convertStepDataToPlaygroundFiles(stepData);
    return files;
  });

  const hasHelpVideo = !!stepData.helpVideo?.videoUrl;
  const { language } = convertStepDataToPlaygroundFiles(stepData);

  const handleCodeChange = (files: FileMap) => {
    setUserFiles(files);
    // Optional: Save progress to localStorage or backend
    // localStorage.setItem(`task-${stepData.id}`, JSON.stringify(files));
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-gray-900">Your Mission</h3>
        </div>
        <ul className="space-y-3">
          {stepData.requirements?.map((req: string, idx: number) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-sm">
                {idx + 1}
              </div>
              <span className="text-gray-700">{req}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary-600" />
            Your Code
          </h3>
        </div>
        
        <CodePlayground
          config={{
            language: language,
            files: userFiles,
            showPreview: true,
            showConsole: true,
            readOnly: false, // Editable
            theme: 'dark',
            height: '600px',
          }}
          onChange={handleCodeChange}
        />
      </div>

      <div className="flex gap-3 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowHints(!showHints)}
          className="flex items-center gap-2"
        >
          <Lightbulb className="w-4 h-4" />
          {showHints ? 'Hide' : 'Show'} Hints
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSolution(!showSolution)}
          className="flex items-center gap-2"
        >
          {showSolution ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showSolution ? 'Hide' : 'Show'} Solution
        </Button>

        {hasHelpVideo && (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleHelpVideo}
            className="flex items-center gap-2 bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100"
          >
            <VideoIcon className="w-4 h-4" />
            {showHelpVideo ? 'Hide' : 'Watch'} Walkthrough
          </Button>
        )}
      </div>

      {showHints && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            <h4 className="font-bold text-gray-900">Hints</h4>
          </div>
          <ul className="space-y-3">
            {stepData.hints?.map((hint: string, idx: number) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-amber-600 font-bold text-sm flex-shrink-0">{idx + 1}.</span>
                <span className="text-gray-700">{hint}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showSolution && stepData.solution && (
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-gray-900">Solution</h3>
          </div>
          <CodePlayground
            config={{
              language: language,
              files: convertStepDataToPlaygroundFiles({ 
                code: stepData.solution, 
                language: stepData.language 
              }).files,
              showPreview: true,
              showConsole: true,
              readOnly: true,
              theme: 'dark',
              height: '500px',
            }}
          />
        </div>
      )}

      {showHelpVideo && hasHelpVideo && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Need Help?</h4>
              <p className="text-sm text-gray-700 mb-4">
                Watch this step-by-step walkthrough of the solution
              </p>
            </div>
          </div>
          <VideoPlayerEmbedded
            videoUrl={stepData.helpVideo.videoUrl}
            title={stepData.helpVideo.title}
            duration={stepData.helpVideo.duration}
            description={stepData.helpVideo.description}
            platform={stepData.helpVideo.platform}
          />
        </div>
      )}
    </div>
  );
}

function CodingChallengeStep({ stepData, showHelpVideo, onToggleHelpVideo }: any) {
  return (
    <CodingTaskStep 
      stepData={stepData} 
      showHelpVideo={showHelpVideo}
      onToggleHelpVideo={onToggleHelpVideo}
    />
  );
}