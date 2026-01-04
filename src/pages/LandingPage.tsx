// src/pages/LandingPage.tsx
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';
import { Code, Zap, Bug, Trophy, Blocks, Gamepad2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🏋️</span>
              <span className="text-xl font-bold text-gray-900">React Gym</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/roadmap" className="text-gray-600 hover:text-gray-900">
                Roadmap
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Master React Through
            <span className="block text-primary-600 mt-2">Practice & Debugging</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Learn, debug, and build real-world skills with bite-sized interactive units.
            No fluff. Just practical mastery.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="group">
                Start Learning Free
                <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              See How It Works
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            No credit card required • 5-10 min per unit
          </p>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Traditional Tutorials Fail
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold mb-2">Scattered Resources</h3>
              <p className="text-gray-600">
                YouTube, docs, courses everywhere. You waste hours searching instead of learning.
              </p>
            </Card>
            <Card className="text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-2">Only Happy Paths</h3>
              <p className="text-gray-600">
                Tutorials show perfect code. But real projects break. You never learn debugging.
              </p>
            </Card>
            <Card className="text-center">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-bold mb-2">No Revision System</h3>
              <p className="text-gray-600">
                You forget everything after 2 months. Start from scratch every time.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            How React Gym Works
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Each concept is broken into a 5-step interactive unit. Complete in 5-10 minutes.
          </p>
          
          <div className="grid md:grid-cols-5 gap-4 mb-16">
            {[
              { num: '1', title: 'Refresher', desc: '1-min overview', icon: Zap },
              { num: '2', title: 'See It Work', desc: 'Positive case', icon: Code },
              { num: '3', title: 'Debug It', desc: 'Fix mistakes', icon: Bug },
              { num: '4', title: 'Build It', desc: 'Real task', icon: Blocks },
              { num: '5', title: 'Master It', desc: 'Challenge', icon: Trophy },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-2xl font-bold mx-auto mb-3">
                  {step.num}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Demo Preview */}
          <Card className="bg-gray-900 text-white max-w-4xl mx-auto p-8 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-4 text-sm text-gray-400">useState Hook - Live Preview</span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Code Side */}
              <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm">
                <div className="text-purple-400 mb-2">import &#123; useState &#125; from 'react';</div>
                <div className="text-blue-400 mb-2">function Counter() &#123;</div>
                <div className="ml-4 mb-2">
                  <span className="text-yellow-400">const</span>
                  <span className="text-blue-300"> [count, setCount] = </span>
                  <span className="text-yellow-400">useState</span>
                  <span className="text-gray-400">(</span>
                  <span className="text-green-400">0</span>
                  <span className="text-gray-400">);</span>
                </div>
                <div className="ml-4 mb-2 text-gray-500">// Click runs this →</div>
                <div className="ml-4 text-yellow-400">
                  setCount(count + 1);
                </div>
                <div className="text-blue-400 mt-2">&#125;</div>
              </div>
              
              {/* Preview Side */}
              <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center">
                <div className="text-6xl font-bold text-primary-600 mb-4 animate-pulse">
                  42
                </div>
                <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-all transform hover:scale-105">
                  Increment
                </button>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-green-400">✓ State updates correctly!</span>
              <Link to="/dashboard">
                <Button size="sm" variant="outline" className="border-gray-600 hover:bg-gray-800">
                  Try it yourself →
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Built for Real Developers
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Gamepad2, title: 'Gamified Learning', desc: 'Unlock topics, earn XP, track streaks' },
              { icon: Bug, title: 'Learn Debugging', desc: 'Common mistakes and how to fix them' },
              { icon: Zap, title: 'Quick Revision', desc: 'Come back anytime, refresh in minutes' },
              { icon: Trophy, title: 'Real Projects', desc: 'Build production-ready skills' },
            ].map((feature, idx) => (
              <Card key={idx} hover className="text-center">
                <feature.icon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Master React?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Start your first unit in under 5 minutes. No sign up required.
          </p>
          <Link to="/dashboard">
            <Button 
              size="lg" 
              className="bg-white text-primary-600 hover:bg-gray-100"
            >
              Start Free Today →
            </Button>
          </Link>
          <p className="text-sm text-blue-100 mt-4">
            No credit card • No time limits • No tricks
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <span className="text-2xl">🏋️</span>
              <span className="text-lg font-bold text-white">React Gym</span>
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white">About</a>
              <a href="#" className="hover:text-white">Blog</a>
              <Link to="/roadmap" className="hover:text-white">Roadmap</Link>
              <a href="#" className="hover:text-white">Discord</a>
            </div>
          </div>
          <div className="text-center mt-8 text-sm">
            © 2026 React Gym. Built with ❤️ for developers.
          </div>
        </div>
      </footer>
    </div>
  );
}