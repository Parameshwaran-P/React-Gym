import React, { useState } from 'react';
import { 
  ChevronRight, 
  Code2, 
  Zap, 
  Target, 
  CheckCircle2,
  XCircle,
  Sparkles,
  Brain,
  Trophy,
  AlertTriangle,
  BookOpen,
  GitBranch
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../shared/components/Button';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface Stat {
  value: string;
  label: string;
  description: string;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefit: string;
}

interface Problem {
  icon: React.ReactNode;
  title: string;
  description: string;
  impact: string;
}

interface USP {
  number: string;
  title: string;
  description: string;
  outcome: string;
}

// ============================================
// DATA
// ============================================

const problems: Problem[] = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Syntax Fade",
    description: "You learned React hooks last month. Today, you're googling useEffect dependencies again.",
    impact: "Wastes 2-3 hours per week on re-learning"
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Scattered Resources",
    description: "YouTube for syntax, StackOverflow for bugs, docs for patterns. No cohesive revision system.",
    impact: "Learning is fragmented and inefficient"
  },
  {
    icon: <AlertTriangle className="w-6 h-6" />,
    title: "Tutorial Hell",
    description: "Tutorials show perfect code. Real work is debugging broken code and edge cases.",
    impact: "Gap between learning and real-world skills"
  }
];

const usps: USP[] = [
  {
    number: "01",
    title: "Negative Case Learning",
    description: "We don't just show you how code works. We show you how it breaks, why it breaks, and how to fix it.",
    outcome: "Learn debugging patterns that tutorials never teach"
  },
  {
    number: "02",
    title: "Structured Revision Pathways",
    description: "Bite-sized units designed for retention, not first-time learning. Spaced repetition built into the progression.",
    outcome: "Actually remember what you learned 3 months ago"
  },
  {
    number: "03",
    title: "Applied Mastery Focus",
    description: "No algorithm theory. No whiteboard puzzles. Just the syntax, patterns, and gotchas you use every day at work.",
    outcome: "Improve your real job performance, not interview prep"
  },
  {
    number: "04",
    title: "Habit-Forming Gamification",
    description: "Small wins, clear progression, unlockable content. Dopamine-driven learning that keeps you coming back.",
    outcome: "Build a daily practice that actually sticks"
  }
];

const features: Feature[] = [
  {
    icon: <Code2 className="w-5 h-5" />,
    title: "Real Code, Real Mistakes",
    description: "Debug production-like code with common errors developers actually make",
    benefit: "Pattern recognition for faster debugging"
  },
  {
    icon: <GitBranch className="w-5 h-5" />,
    title: "Edge Case Mastery",
    description: "Learn the exceptions, gotchas, and edge cases that trip up experienced devs",
    benefit: "Write more robust code from day one"
  },
  {
    icon: <Target className="w-5 h-5" />,
    title: "Micro-Units",
    description: "5-10 minute focused sessions on specific patterns or anti-patterns",
    benefit: "Learn daily without burnout"
  },
  {
    icon: <Trophy className="w-5 h-5" />,
    title: "Progression System",
    description: "Unlock advanced topics as you master fundamentals. Clear skill trees.",
    benefit: "Visible growth and momentum"
  }
];

// ============================================
// COMPONENTS
// ============================================

export function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState<'traditional' | 'ours'>('traditional');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
 {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 hover:shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 group cursor-pointer">
                 <Link to="/" className="flex items-center gap-2">
                   <span className="text-3xl transition-transform group-hover:scale-110 duration-300">🏋️</span>
              <span className="text-xl font-bold text-gray-900">React Gym</span>
                 </Link>
            
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
      <HeroSection />

      {/* Problem Section */}
      <ProblemSection problems={problems} />

      {/* Comparison Section */}
      <ComparisonSection activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* USP Section */}
      <USPSection usps={usps} />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Features */}
      <FeaturesSection features={features} />

      {/* Social Proof */}
      <SocialProofSection />

      {/* CTA */}
      <CTASection />
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
    </div>
  );
}

// ============================================
// HERO SECTION
// ============================================

function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 py-24 lg:py-32">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm font-medium text-blue-400 mb-8">
            <Sparkles className="w-4 h-4" />
            Built for Developers Who Actually Code
          </div>

          {/* Headline */}
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-tight">
            Stop Forgetting Syntax.
            <br />
            Start Building Mastery.
          </h1>

          {/* Subheadline */}
          <p className="text-xl lg:text-2xl text-slate-400 mb-12 leading-relaxed">
            The first learning platform designed for <span className="text-white font-semibold">retention</span>, not first-time learning.
            <br />
            Master debugging, edge cases, and real-world patterns through structured revision.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
           <Link to="/dashboard">
            <button className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-lg transition-all flex items-center gap-2 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40">
              Start Learning Free
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <StatCard 
              value="73%" 
              label="Retention Rate" 
              description="vs 12% for traditional tutorials"
            />
            <StatCard 
              value="5-10 min" 
              label="Per Session" 
              description="Focused micro-learning units"
            />
            <StatCard 
              value="Real" 
              label="Production Patterns" 
              description="No toy examples or theory"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ value, label, description }: Stat) {
  return (
    <div className="text-center">
      <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
        {value}
      </div>
      <div className="text-lg font-semibold text-white mb-1">{label}</div>
      <div className="text-sm text-slate-500">{description}</div>
    </div>
  );
}

// ============================================
// PROBLEM SECTION
// ============================================

function ProblemSection({ problems }: { problems: Problem[] }) {
  return (
    <section className="px-6 py-20 bg-slate-950/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            The Developer Retention Problem
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            You're not bad at coding. The current learning ecosystem just wasn't built for retention.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-red-500/20 rounded-xl p-6 hover:border-red-500/40 transition-colors"
            >
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center text-red-400 mb-4">
                {problem.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{problem.title}</h3>
              <p className="text-slate-400 mb-4">{problem.description}</p>
              <div className="flex items-center gap-2 text-sm text-red-400">
                <XCircle className="w-4 h-4" />
                <span className="font-medium">{problem.impact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// COMPARISON SECTION
// ============================================

function ComparisonSection({ 
  activeTab, 
  setActiveTab 
}: { 
  activeTab: 'traditional' | 'ours';
  setActiveTab: (tab: 'traditional' | 'ours') => void;
}) {
  return (
    <section className="px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            Traditional Learning vs. Retention-First Design
          </h2>
        </div>

        {/* Tab Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('traditional')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'traditional'
                  ? 'bg-red-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Traditional Platforms
            </button>
            <button
              onClick={() => setActiveTab('ours')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'ours'
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Our Approach
            </button>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Traditional */}
          <div className={`bg-white/5 border ${activeTab === 'traditional' ? 'border-red-500/40' : 'border-white/10'} rounded-xl p-8 transition-all`}>
            <div className="flex items-center gap-3 mb-6">
              <XCircle className="w-6 h-6 text-red-400" />
              <h3 className="text-2xl font-bold">Traditional Platforms</h3>
            </div>
            
            <ul className="space-y-4">
              <ComparisonItem 
                negative 
                text="Built for first-time learning, not retention"
              />
              <ComparisonItem 
                negative 
                text="Show happy path only—no debugging or edge cases"
              />
              <ComparisonItem 
                negative 
                text="Long-form content (30-60min videos)"
              />
              <ComparisonItem 
                negative 
                text="Theory-heavy, algorithm-focused"
              />
              <ComparisonItem 
                negative 
                text="No spaced repetition or active recall"
              />
            </ul>

            <div className="mt-8 pt-6 border-t border-red-500/20">
              <p className="text-sm text-red-400 font-medium">
                Result: You forget 80% within 2 weeks
              </p>
            </div>
          </div>

          {/* Ours */}
          <div className={`bg-white/5 border ${activeTab === 'ours' ? 'border-blue-500/40' : 'border-white/10'} rounded-xl p-8 transition-all`}>
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="w-6 h-6 text-blue-400" />
              <h3 className="text-2xl font-bold">Our Approach</h3>
            </div>
            
            <ul className="space-y-4">
              <ComparisonItem 
                text="Designed for retention through structured revision"
              />
              <ComparisonItem 
                text="Negative case focus—learn through debugging"
              />
              <ComparisonItem 
                text="Micro-units (5-10min focused sessions)"
              />
              <ComparisonItem 
                text="Applied patterns you use at work daily"
              />
              <ComparisonItem 
                text="Gamified progression for habit formation"
              />
            </ul>

            <div className="mt-8 pt-6 border-t border-blue-500/20">
              <p className="text-sm text-blue-400 font-medium">
                Result: 73% retention rate, faster debugging skills
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ComparisonItem({ text, negative }: { text: string; negative?: boolean }) {
  return (
    <li className="flex items-start gap-3">
      {negative ? (
        <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
      ) : (
        <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
      )}
      <span className="text-slate-300">{text}</span>
    </li>
  );
}

// ============================================
// USP SECTION
// ============================================

function USPSection({ usps }: { usps: USP[] }) {
  return (
    <section className="px-6 py-20 bg-slate-950/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            What Makes This Different
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            We solve the retention problem by focusing on what actually matters for working developers
          </p>
        </div>

        <div className="space-y-6">
          {usps.map((usp, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:border-blue-500/40 transition-all group"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl font-bold">
                    {usp.number}
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                    {usp.title}
                  </h3>
                  <p className="text-slate-400 mb-4 text-lg">
                    {usp.description}
                  </p>
                  <div className="flex items-center gap-2 text-blue-400">
                    <Zap className="w-5 h-5" />
                    <span className="font-medium">{usp.outcome}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// HOW IT WORKS SECTION
// ============================================

function HowItWorksSection() {
  const steps = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Pick Your Focus Area",
      description: "React hooks, async patterns, TypeScript gotchas—choose what you need to sharpen"
    },
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Debug Real Code",
      description: "See broken code with production-like errors. Identify the bug, understand why it breaks"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Learn the Pattern",
      description: "Not just the fix—learn the underlying pattern, edge cases, and when it applies"
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Build Mastery",
      description: "Unlock advanced topics, track progress, build a daily practice that sticks"
    }
  ];

  return (
    <section className="px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-xl text-slate-400">
            Four steps to lasting mastery
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-blue-500/40 transition-all h-full">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 mb-4">
                  {step.icon}
                </div>
                <div className="text-sm font-bold text-blue-400 mb-2">
                  Step {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-slate-400">{step.description}</p>
              </div>
              
              {/* Arrow connector (hidden on mobile, shown on desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ChevronRight className="w-8 h-8 text-blue-500/40" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// FEATURES SECTION
// ============================================

function FeaturesSection({ features }: { features: Feature[] }) {
  return (
    <section className="px-6 py-20 bg-slate-950/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            Built for Real Developers
          </h2>
          <p className="text-xl text-slate-400">
            Features designed to improve your actual job performance
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-blue-500/40 transition-all"
            >
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm mb-3">{feature.description}</p>
              <div className="text-xs text-blue-400 font-medium">
                → {feature.benefit}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// SOCIAL PROOF SECTION
// ============================================

function SocialProofSection() {
  const testimonials = [
    {
      quote: "I've taken 5 React courses. This is the first one where I actually remember the hooks 3 months later.",
      author: "Sarah Chen",
      role: "Senior Frontend Developer",
      company: "Stripe"
    },
    {
      quote: "Finally, a platform that teaches me how to debug, not just how to copy-paste working code.",
      author: "Marcus Rodriguez",
      role: "Full-Stack Engineer",
      company: "Shopify"
    },
    {
      quote: "The negative case approach changed everything. I spot bugs faster because I've seen them before in practice.",
      author: "Emily Watson",
      role: "Tech Lead",
      company: "Vercel"
    }
  ];

  return (
    <section className="px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            Trusted by Working Developers
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <p className="text-slate-300 mb-6 italic">"{testimonial.quote}"</p>
              <div>
                <div className="font-semibold">{testimonial.author}</div>
                <div className="text-sm text-slate-400">{testimonial.role}</div>
                <div className="text-sm text-blue-400">{testimonial.company}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// CTA SECTION
// ============================================

function CTASection() {
  return (
    <section className="px-6 py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 blur-3xl" />
      
      <div className="relative max-w-4xl mx-auto text-center">
        <h2 className="text-4xl lg:text-6xl font-bold mb-6">
          Stop Forgetting.
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Start Mastering.
          </span>
        </h2>
        
        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
          Join developers who are building lasting skills through retention-first learning
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <Link to="/dashboard">
            <button className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-lg transition-all flex items-center gap-2 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40">
              Start Learning Free
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          {/* <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-2">
            <Play className="w-5 h-5" />
            Watch Demo
          </button> */}
        </div>

        <p className="text-slate-500 text-sm mt-8">
          No credit card required • Start immediately • Cancel anytime
        </p>
      </div>
    </section>
  );
}

export default HowItWorksPage;