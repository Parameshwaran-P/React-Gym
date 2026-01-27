// src/pages/LandingPage.tsx
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../shared/components/Button';
import { Card } from '../shared/components/Card';
import { Code, Zap, Bug, Trophy, Blocks, Gamepad2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const heroRef = useRef(null);
  const problemCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const featuresRef = useRef<(HTMLDivElement | null)[]>([]);
  const demoRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section entrance - subtle and elegant
      gsap.from('.hero-content', {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power2.out',
      });

      gsap.from('.hero-title', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.2,
        ease: 'power2.out',
      });

      gsap.from('.hero-subtitle', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.4,
        ease: 'power2.out',
      });

      gsap.from('.hero-buttons > *', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      });

      // Problem cards - scroll triggered
      problemCardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: index * 0.15,
            ease: 'power2.out',
          });
        }
      });

      // Steps animation
      stepsRef.current.forEach((step, index) => {
        if (step) {
          gsap.from(step, {
            scrollTrigger: {
              trigger: step,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            opacity: 0,
            scale: 0.8,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'back.out(1.3)',
          });
        }
      });

      // Demo card
      if (demoRef.current) {
        gsap.from(demoRef.current, {
          scrollTrigger: {
            trigger: demoRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          y: 60,
          duration: 1,
          ease: 'power3.out',
        });
      }

      // Features cards
      featuresRef.current.forEach((feature, index) => {
        if (feature) {
          gsap.from(feature, {
            scrollTrigger: {
              trigger: feature,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            opacity: 0,
            y: 40,
            duration: 0.7,
            delay: index * 0.12,
            ease: 'power2.out',
          });
        }
      });

      // CTA section
      if (ctaRef.current) {
        gsap.from(ctaRef.current, {
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          scale: 0.95,
          duration: 0.8,
          ease: 'power2.out',
        });
      }

      // Floating animations
      gsap.to('.demo-counter', {
        y: -8,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Pulse effect
      gsap.to('.pulse-ring', {
        scale: 1.5,
        opacity: 0,
        duration: 2,
        repeat: -1,
        ease: 'power2.out',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 hover:shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 group cursor-pointer">
              <span className="text-3xl transition-transform group-hover:scale-110 duration-300">🏋️</span>
              <span className="text-xl font-bold text-gray-900">React Gym</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/roadmap" className="text-gray-600 hover:text-gray-900 transition-all duration-300 relative group">
                Roadmap
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="sm" className="hover:scale-105 transition-transform duration-200">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="hero-content text-center">
          <h1 className="hero-title text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Master React Through
            <span className="block text-primary-600 mt-2 relative inline-block">
              Practice & Debugging
              <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none">
                <path d="M2 10C50 2, 100 2, 150 6C200 10, 250 8, 298 4" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" className="animate-draw-line"/>
              </svg>
            </span>
          </h1>
          <p className="hero-subtitle text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Learn, debug, and build real-world skills with bite-sized interactive units.
            No fluff. Just practical mastery.
          </p>
          <div className="hero-buttons flex gap-4 justify-center flex-wrap">
            <Link to="/dashboard">
              <Button size="lg" className="group relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <span className="relative z-10 flex items-center gap-2">
                  Start Learning Free
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </span>
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              See How It Works
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4 opacity-75">
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
            {[
              {
                img: '/public/scattered_learn.png',
                title: 'Scattered Resources',
                desc: 'YouTube, docs, courses everywhere. You waste hours searching instead of learning.',
              },
              {
                img: '/public/happy_paths.png',
                title: 'Only Happy Paths',
                desc: 'Tutorials show perfect code. But real projects break. You never learn debugging.',
              },
              {
                img: '/public/revision_sys.png',
                title: 'No Revision System',
                desc: 'You forget everything after 2 months. Start from scratch every time.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                ref={(el) => (problemCardsRef.current[idx] = el)}
                className="group"
              >
                <Card className="text-center h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-primary-200">
                  <div className="overflow-hidden rounded-lg mb-4">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-50 h-50 mx-auto transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            How React Gym Works
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Each concept is broken into a 5-step interactive unit. Complete in 5-10 minutes.
          </p>
          
          <div className="grid md:grid-cols-5 gap-4 mb-16">
            {[
              { num: '1', title: 'Refresher', desc: '1-min overview', icon: Zap, color: 'from-yellow-400 to-orange-500' },
              { num: '2', title: 'See It Work', desc: 'Positive case', icon: Code, color: 'from-blue-400 to-cyan-500' },
              { num: '3', title: 'Debug It', desc: 'Fix mistakes', icon: Bug, color: 'from-red-400 to-pink-500' },
              { num: '4', title: 'Build It', desc: 'Real task', icon: Blocks, color: 'from-green-400 to-emerald-500' },
              { num: '5', title: 'Master It', desc: 'Challenge', icon: Trophy, color: 'from-purple-400 to-indigo-500' },
            ].map((step, idx) => (
              <div
                key={step.num}
                ref={(el) => (stepsRef.current[idx] = el)}
                className="text-center group"
              >
                <div className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${step.color} text-white flex items-center justify-center text-2xl font-bold mx-auto mb-3 cursor-pointer transition-all duration-500 hover:scale-125 hover:rotate-12 shadow-lg group-hover:shadow-2xl`}>
                  {step.num}
                  <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Demo Preview */}
          <div ref={demoRef}>
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white max-w-4xl mx-auto p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 border-2 border-gray-700 hover:border-primary-500">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 hover:scale-125 transition-transform cursor-pointer"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 hover:scale-125 transition-transform cursor-pointer"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500 hover:scale-125 transition-transform cursor-pointer"></div>
                </div>
                <span className="ml-4 text-sm text-gray-400">useState Hook - Live Preview</span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {/* Code Side */}
                <div className="bg-gray-800/50 backdrop-blur rounded-lg p-4 font-mono text-sm border border-gray-700 hover:border-gray-600 transition-colors">
                  <div className="text-purple-400 mb-2 hover:text-purple-300 transition-colors">
                    import &#123; useState &#125; from 'react';
                  </div>
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
                  <div className="ml-4 text-yellow-400 hover:text-yellow-300 transition-colors">
                    setCount(count + 1);
                  </div>
                  <div className="text-blue-400 mt-2">&#125;</div>
                </div>
                
                {/* Preview Side */}
                <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="pulse-ring absolute inset-0 bg-primary-600 opacity-20 rounded-full"></div>
                  <div className="demo-counter text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600 mb-4">
                    42
                  </div>
                  <button className="relative bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 overflow-hidden group">
                    <span className="relative z-10">Increment</span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  </button>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-green-400 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  State updates correctly!
                </span>
                <Link to="/dashboard">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-gray-600 hover:bg-gray-700 hover:border-primary-500 transition-all duration-300"
                  >
                    Try it yourself →
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
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
              { 
                icon: Gamepad2, 
                title: 'Gamified Learning', 
                desc: 'Unlock topics, earn XP, track streaks',
                gradient: 'from-purple-500 to-pink-500'
              },
              { 
                icon: Bug, 
                title: 'Learn Debugging', 
                desc: 'Common mistakes and how to fix them',
                gradient: 'from-red-500 to-orange-500'
              },
              { 
                icon: Zap, 
                title: 'Quick Revision', 
                desc: 'Come back anytime, refresh in minutes',
                gradient: 'from-yellow-500 to-green-500'
              },
              { 
                icon: Trophy, 
                title: 'Real Projects', 
                desc: 'Build production-ready skills',
                gradient: 'from-blue-500 to-cyan-500'
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                ref={(el) => (featuresRef.current[idx] = el)}
                className="group"
              >
                <Card className="text-center h-full cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 border-2 border-transparent hover:border-primary-200">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-3 mx-auto mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg`}>
                    <feature.icon className="w-full h-full text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        ref={ctaRef}
        className="py-20 bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to Master React?
          </h2>
          <p className="text-xl mb-8 text-blue-100 leading-relaxed">
            Start your first unit in under 5 minutes. No sign up required.
          </p>
          <Link to="/dashboard">
            <Button 
              size="lg" 
              className="bg-white text-primary-600 hover:bg-gray-50 transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95 text-lg px-8 py-4"
            >
              Start Free Today →
            </Button>
          </Link>
          <p className="text-sm text-blue-100 mt-4 opacity-90">
            No credit card • No time limits • No tricks
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0 group cursor-pointer">
              <span className="text-2xl transition-transform group-hover:scale-110 duration-300">🏋️</span>
              <span className="text-lg font-bold text-white">React Gym</span>
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-all duration-300 relative group">
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#" className="hover:text-white transition-all duration-300 relative group">
                Blog
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <Link to="/roadmap" className="hover:text-white transition-all duration-300 relative group">
                Roadmap
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <a href="#" className="hover:text-white transition-all duration-300 relative group">
                Discord
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>
          </div>
          <div className="text-center mt-8 text-sm">
            © 2026 React Gym. Built with ❤️ for developers.
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes draw-line {
          from {
            stroke-dasharray: 0 300;
          }
          to {
            stroke-dasharray: 300 0;
          }
        }
        
        .animate-draw-line {
          animation: draw-line 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}