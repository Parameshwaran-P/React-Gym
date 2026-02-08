import { useState } from 'react';
import { Play, Maximize2, Minimize2, X, BookOpen } from 'lucide-react';

// Example unit data with preview
const exampleUnit = {
  title: "useState Hook - Master React State",
  difficulty: "beginner",
  duration: "7 min",
  xp: 50,
  preview: {
    videoUrl: "https://www.youtube.com/embed/O6P86uwfdR0",
    thumbnail: "https://img.youtube.com/vi/O6P86uwfdR0/maxresdefault.jpg",
    duration: "8:45",
    description: "Watch this quick introduction to useState before diving into the interactive lessons"
  },
  refresherContent: `# 🏋️ Real-Life Story: React Gym Counter

Imagine you're running **React Gym** 🏋️‍♂️.

At the entrance, there's a digital screen that shows:

> **Members inside: 0**

Each time a member enters, the number should increase.

But there's a problem 👇

- A member enters → count becomes **1**
- Screen refreshes
- Count resets back to **0** ❌

## 🧠 The Problem React Solves

React components re-render frequently. Without memory, a component **forgets everything** on every render.

This is where **state** comes in.

## ✅ What is useState?

\`useState\` allows a React component to **remember values between renders**.

It gives your UI **memory**.

## 🔧 Basic Syntax

\`\`\`javascript
const [value, setValue] = useState(initialValue);
\`\`\`

- \`value\` → current memory
- \`setValue\` → updates memory
- \`initialValue\` → starting value`
};

export default function SplitScreenVideoPreview() {
  const [showVideo, setShowVideo] = useState(true);
  const [videoSize, setVideoSize] = useState<'normal' | 'large' | 'fullscreen'>('normal');
  const [layout, setLayout] = useState<'split' | 'video-only' | 'content-only'>('split');

  const getLayoutClass = () => {
    if (layout === 'video-only') return 'grid-cols-1';
    if (layout === 'content-only') return 'grid-cols-1';
    if (videoSize === 'large') return 'grid-cols-3';
    return 'grid-cols-2';
  };

  const shouldShowVideo = layout !== 'content-only' && showVideo;
  const shouldShowContent = layout !== 'video-only';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{exampleUnit.title}</h1>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-sm px-2 py-1 bg-green-100 text-green-700 rounded font-medium">
                  {exampleUnit.difficulty}
                </span>
                <span className="text-sm text-gray-600">⏱️ {exampleUnit.duration}</span>
                <span className="text-sm text-gray-600">✨ +{exampleUnit.xp} XP</span>
              </div>
            </div>

            {/* Layout Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLayout('split')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  layout === 'split'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title="Split View"
              >
                📺📖
              </button>
              <button
                onClick={() => setLayout('video-only')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  layout === 'video-only'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title="Video Only"
              >
                <Play className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayout('content-only')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  layout === 'content-only'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title="Content Only"
              >
                <BookOpen className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className={`grid ${getLayoutClass()} gap-6`}>
          {/* Video Panel */}
          {shouldShowVideo && (
            <div className={`${videoSize === 'large' ? 'col-span-2' : ''} space-y-4`}>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                {/* Video Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <Play className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold">Preview Video</h3>
                        <p className="text-sm opacity-90">{exampleUnit.preview.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setVideoSize(videoSize === 'large' ? 'normal' : 'large')}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        title={videoSize === 'large' ? 'Make smaller' : 'Make larger'}
                      >
                        {videoSize === 'large' ? (
                          <Minimize2 className="w-4 h-4" />
                        ) : (
                          <Maximize2 className="w-4 h-4" />
                        )}
                      </button>
                      {layout === 'split' && (
                        <button
                          onClick={() => setShowVideo(false)}
                          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                          title="Hide video"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Video Embed */}
                <div className="bg-black aspect-video">
                  <iframe
                    src={exampleUnit.preview.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Unit Preview Video"
                  />
                </div>

                {/* Video Description */}
                <div className="p-4 bg-purple-50">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {exampleUnit.preview.description}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 divide-x border-t">
                  <div className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">8:45</div>
                    <div className="text-xs text-gray-600 mt-1">Duration</div>
                  </div>
                  <div className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">Easy</div>
                    <div className="text-xs text-gray-600 mt-1">Level</div>
                  </div>
                  <div className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">50 XP</div>
                    <div className="text-xs text-gray-600 mt-1">Reward</div>
                  </div>
                </div>
              </div>

              {/* Video Controls Hint */}
              {layout === 'split' && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">💡</div>
                    <div>
                      <h4 className="font-semibold text-purple-900 mb-1">Pro Tip</h4>
                      <p className="text-sm text-purple-700">
                        Watch the video first for a quick overview, then read the detailed content on the right. 
                        You can expand the video or hide it anytime!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Content Panel */}
          {shouldShowContent && (
            <div className={`${!shouldShowVideo || videoSize === 'large' ? 'col-span-1' : ''}`}>
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                {/* Content Header */}
                <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Refresher Content</h2>
                    <p className="text-sm text-gray-600">Read and understand the concept</p>
                  </div>
                </div>

                {/* Markdown Content */}
                <div className="prose prose-lg max-w-none">
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        🏋️ Real-Life Story: React Gym Counter
                      </h1>
                      <p className="text-gray-700 leading-relaxed">
                        Imagine you're running <strong>React Gym</strong> 🏋️‍♂️.
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        At the entrance, there's a digital screen that shows:
                      </p>
                      <blockquote className="border-l-4 border-blue-500 bg-blue-50 p-4 my-4">
                        <p className="text-gray-900 font-semibold">Members inside: 0</p>
                      </blockquote>
                      <p className="text-gray-700 leading-relaxed">
                        Each time a member enters, the number should increase.
                      </p>
                      <p className="text-gray-700 leading-relaxed">But there's a problem 👇</p>
                      <ul className="space-y-2 my-4">
                        <li>A member enters → count becomes <strong>1</strong></li>
                        <li>Screen refreshes</li>
                        <li>Count resets back to <strong>0</strong> ❌</li>
                      </ul>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg">
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        🧠 The Problem React Solves
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        React components re-render frequently. Without memory, a component{' '}
                        <strong>forgets everything</strong> on every render.
                      </p>
                      <p className="text-gray-700 leading-relaxed mt-2">
                        This is where <strong>state</strong> comes in.
                      </p>
                    </div>

                    <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        ✅ What is useState?
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        <code className="bg-gray-900 text-green-400 px-2 py-1 rounded">useState</code> allows a React component to{' '}
                        <strong>remember values between renders</strong>.
                      </p>
                      <p className="text-gray-700 leading-relaxed mt-2">
                        It gives your UI <strong>memory</strong>.
                      </p>
                    </div>

                    <div className="bg-gray-900 text-white p-6 rounded-lg">
                      <h3 className="text-xl font-bold mb-3 text-purple-400">🔧 Basic Syntax</h3>
                      <pre className="bg-gray-800 p-4 rounded overflow-x-auto">
                        <code className="text-green-400">
                          const [value, setValue] = useState(initialValue);
                        </code>
                      </pre>
                      <ul className="mt-4 space-y-2 text-sm">
                        <li>
                          <code className="text-blue-400">value</code> → current memory
                        </li>
                        <li>
                          <code className="text-blue-400">setValue</code> → updates memory
                        </li>
                        <li>
                          <code className="text-blue-400">initialValue</code> → starting value
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Next Step Button */}
                <div className="mt-8 pt-6 border-t">
                  <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-[1.02] shadow-lg">
                    Continue to Examples →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Show Video Button (when hidden) */}
        {!showVideo && layout === 'split' && (
          <div className="mt-6">
            <button
              onClick={() => setShowVideo(true)}
              className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Show Preview Video
            </button>
          </div>
        )}
      </div>
    </div>
  );
}