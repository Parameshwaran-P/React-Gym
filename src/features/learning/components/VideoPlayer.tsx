// ============================================
// DYNAMIC VIDEO PLAYER - Works with ALL content
// ============================================

// src/features/learning/components/VideoPlayer.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  X,
  SkipBack,
  SkipForward,
  Settings,
  Loader
} from 'lucide-react';

// ============================================
// VIDEO PLAYER PROPS - Universal for all platforms
// ============================================

interface VideoPlayerProps {
  // Required
  videoUrl: string;
  
  // Optional - Auto-detected from URL if not provided
  platform?: 'youtube' | 'vimeo' | 'direct' | 'auto';
  
  // Display options
  title?: string;
  thumbnail?: string;
  duration?: string;
  description?: string;
  
  // Layout options
  layout?: 'embedded' | 'modal' | 'fullpage' | 'split';
  autoPlay?: boolean;
  showControls?: boolean;
  
  // Callbacks
  onClose?: () => void;
  onComplete?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  
  // Advanced
  startTime?: number; // Start from specific time
  endTime?: number;   // Stop at specific time
  playbackSpeed?: number;
  quality?: 'auto' | '360p' | '480p' | '720p' | '1080p';
}

// ============================================
// AUTO-DETECT VIDEO PLATFORM
// ============================================

function detectPlatform(url: string): 'youtube' | 'vimeo' | 'direct' {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  }
  if (url.includes('vimeo.com')) {
    return 'vimeo';
  }
  return 'direct';
}

function extractVideoId(url: string, platform: string): string {
  if (platform === 'youtube') {
    // Handle both youtube.com/watch?v= and youtu.be/ formats
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : '';
  }
  
  if (platform === 'vimeo') {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : '';
  }
  
  return url; // Direct URL
}

function getEmbedUrl(url: string, platform: string, options: any = {}): string {
  const videoId = extractVideoId(url, platform);
  
  if (platform === 'youtube') {
    let embedUrl = `https://www.youtube.com/embed/${videoId}?`;
    const params = new URLSearchParams({
      autoplay: options.autoPlay ? '1' : '0',
      controls: options.showControls !== false ? '1' : '0',
      start: options.startTime || '0',
      end: options.endTime || '',
      rel: '0', // Don't show related videos
      modestbranding: '1'
    });
    return embedUrl + params.toString();
  }
  
  if (platform === 'vimeo') {
    let embedUrl = `https://player.vimeo.com/video/${videoId}?`;
    const params = new URLSearchParams({
      autoplay: options.autoPlay ? '1' : '0',
      controls: options.showControls !== false ? '1' : '0'
    });
    return embedUrl + params.toString();
  }
  
  return url; // Direct video URL
}

// ============================================
// MAIN VIDEO PLAYER COMPONENT
// ============================================

export function VideoPlayer({
  videoUrl,
  platform = 'auto',
  title,
  thumbnail,
  duration,
  description,
  layout = 'embedded',
  autoPlay = false,
  showControls = true,
  onClose,
  onComplete,
  onTimeUpdate,
  startTime = 0,
  endTime,
  playbackSpeed = 1,
  quality = 'auto'
}: VideoPlayerProps) {
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Detect platform if auto
  const detectedPlatform = platform === 'auto' ? detectPlatform(videoUrl) : platform;
  
  // Get appropriate embed URL
  const embedUrl = getEmbedUrl(videoUrl, detectedPlatform, {
    autoPlay,
    showControls,
    startTime,
    endTime
  });
  
  // Handle loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  
  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  
  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  // Render based on layout
  if (layout === 'modal') {
    return (
      <VideoModal 
        embedUrl={embedUrl}
        platform={detectedPlatform}
        title={title}
        duration={duration}
        description={description}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onClose={onClose}
        containerRef={containerRef}
      />
    );
  }
  
  if (layout === 'split') {
    return (
      <VideoSplitView
        embedUrl={embedUrl}
        platform={detectedPlatform}
        title={title}
        thumbnail={thumbnail}
        duration={duration}
        description={description}
        containerRef={containerRef}
      />
    );
  }
  
  // Default embedded layout
  return (
    <VideoEmbedded
      embedUrl={embedUrl}
      platform={detectedPlatform}
      title={title}
      thumbnail={thumbnail}
      duration={duration}
      description={description}
      isLoading={isLoading}
      containerRef={containerRef}
    />
  );
}

// ============================================
// VIDEO EMBEDDED - Simple embedded player
// ============================================

function VideoEmbedded({ 
  embedUrl, 
  platform, 
  title, 
  thumbnail,
  duration, 
  description,
  isLoading,
  containerRef
}: any) {
  return (
    <div ref={containerRef} className="w-full">
      {title && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-t-lg text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Play className="w-5 h-5" />
              <div>
                <h3 className="font-bold">{title}</h3>
                {duration && <p className="text-sm opacity-90">{duration}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="relative bg-black aspect-video">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
        
        {platform === 'direct' ? (
          <video
            src={embedUrl}
            controls
            className="w-full h-full"
            poster={thumbnail}
          />
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
        <div className="bg-purple-50 p-4 rounded-b-lg">
          <p className="text-gray-700 text-sm">{description}</p>
        </div>
      )}
    </div>
  );
}

// ============================================
// VIDEO MODAL - Popup modal player
// ============================================

function VideoModal({ 
  embedUrl, 
  platform,
  title, 
  duration, 
  description,
  isFullscreen,
  onToggleFullscreen,
  onClose,
  containerRef
}: any) {
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div 
        ref={containerRef}
        className={`bg-white rounded-lg overflow-hidden transition-all ${
          isFullscreen ? 'w-full h-full' : 'max-w-5xl w-full'
        }`}
      >
        {/* Header */}
        <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Play className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="font-bold">{title || 'Video'}</h3>
              {duration && <p className="text-xs text-gray-400">{duration}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleFullscreen}
              className="p-2 hover:bg-gray-800 rounded transition-colors"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video */}
        <div className={`bg-black ${isFullscreen ? 'h-[calc(100%-60px)]' : 'aspect-video'}`}>
          {platform === 'direct' ? (
            <video
              src={embedUrl}
              controls
              className="w-full h-full"
            />
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

        {/* Description */}
        {!isFullscreen && description && (
          <div className="p-4 bg-gray-50">
            <p className="text-gray-700 text-sm">{description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// VIDEO SPLIT VIEW - Side by side with content
// ============================================

function VideoSplitView({ 
  embedUrl, 
  platform,
  title,
  thumbnail,
  duration,
  description,
  containerRef 
}: any) {
  const [videoSize, setVideoSize] = useState<'normal' | 'large'>('normal');
  const [showVideo, setShowVideo] = useState(true);
  
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Video Panel */}
      {showVideo && (
        <div className={videoSize === 'large' ? 'col-span-2' : ''}>
          <div ref={containerRef} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Play className="w-5 h-5" />
                  <div>
                    <h3 className="font-bold">{title}</h3>
                    {duration && <p className="text-sm opacity-90">{duration}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setVideoSize(videoSize === 'large' ? 'normal' : 'large')}
                    className="p-2 hover:bg-white/20 rounded transition-colors"
                  >
                    {videoSize === 'large' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setShowVideo(false)}
                    className="p-2 hover:bg-white/20 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-black aspect-video">
              {platform === 'direct' ? (
                <video
                  src={embedUrl}
                  controls
                  className="w-full h-full"
                  poster={thumbnail}
                />
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
              <div className="p-4 bg-purple-50">
                <p className="text-gray-700 text-sm">{description}</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Content would go here */}
      {!showVideo && (
        <button
          onClick={() => setShowVideo(true)}
          className="col-span-2 bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" />
          Show Video Preview
        </button>
      )}
    </div>
  );
}

// ============================================
// USAGE EXAMPLES IN UNIT PLAYER
// ============================================

/*
// 1. EMBEDDED - Inside markdown step
<VideoPlayer
  videoUrl="https://www.youtube.com/watch?v=O6P86uwfdR0"
  title="useState Hook Tutorial"
  duration="8:45"
  description="Learn the basics of useState"
  layout="embedded"
/>

// 2. MODAL - Popup when user clicks button
const [showVideo, setShowVideo] = useState(false);

<button onClick={() => setShowVideo(true)}>
  Watch Preview
</button>

{showVideo && (
  <VideoPlayer
    videoUrl={unit.preview.videoUrl}
    title={unit.preview.title}
    duration={unit.preview.duration}
    layout="modal"
    onClose={() => setShowVideo(false)}
  />
)}

// 3. SPLIT VIEW - Side by side with content
<VideoPlayer
  videoUrl={unit.preview.videoUrl}
  title="useState Preview"
  layout="split"
/>

// 4. AUTO-DETECT - Works with any URL
<VideoPlayer
  videoUrl="https://vimeo.com/123456789"
  platform="auto"  // Auto-detects Vimeo
/>

<VideoPlayer
  videoUrl="/videos/lesson.mp4"
  platform="auto"  // Auto-detects direct video
/>

// 5. ADVANCED - With callbacks and options
<VideoPlayer
  videoUrl={unit.preview.videoUrl}
  startTime={30}  // Start at 30 seconds
  endTime={300}   // Stop at 5 minutes
  playbackSpeed={1.5}
  onComplete={() => {
    console.log('Video finished!');
    handleNext();
  }}
  onTimeUpdate={(current, duration) => {
    console.log(`${current}s / ${duration}s`);
  }}
/>
*/