import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  Zap, 
  Trophy, 
  Users, 
  Target, 
  BarChart3, 
  Shield, 
  Smartphone,
  ArrowRight,
  CheckCircle,
  Star,
  Menu,
  X
} from 'lucide-react';

export function LandingPage() {
  const { session, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Trophy,
      title: 'Level Up Your Life',
      description: 'Transform real-world activities into an RPG-style progression system with XP, levels, and achievements.'
    },
    {
      icon: Target,
      title: 'Task Management',
      description: 'Create and complete tasks across different life areas. Set required tasks and track your daily progress.'
    },
    {
      icon: BarChart3,
      title: 'Character Stats',
      description: 'Develop 13 different attributes including Strength, Intelligence, Charisma, and more through real activities.'
    },
    {
      icon: Users,
      title: 'Social Competition',
      description: 'Connect with friends, share achievements, and compete on global leaderboards.'
    },
    {
      icon: Smartphone,
      title: 'Cross-Platform',
      description: 'Access your progress anywhere with our responsive web platform that works on all devices.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security and customizable privacy controls.'
    }
  ];

  const testimonials = [
    {
      name: 'Alex Chen',
      role: 'Software Engineer',
      content: 'HXBIT transformed how I approach personal development. The gamification makes everything more engaging.',
      avatar: '👨‍💻'
    },
    {
      name: 'Sarah Johnson',
      role: 'Student',
      content: 'Finally, a way to track my extracurriculars that feels like playing a game. My productivity has skyrocketed.',
      avatar: '👩‍🎓'
    },
    {
      name: 'Mike Rodriguez',
      role: 'Entrepreneur',
      content: 'The social features keep me motivated. Competing with friends on the leaderboard is addictive.',
      avatar: '👨‍💼'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight">HXBIT</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#home" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </a>
                <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                  Features
                </a>
                {loading ? (
                  <div className="w-20 h-10 bg-gray-800 rounded-lg animate-pulse"></div>
                ) : session ? (
                  <a
                    href="/dashboard"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                  >
                    Open HXBIT
                  </a>
                ) : (
                  <a
                    href="/auth"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                  >
                    Login
                  </a>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-400 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#home" className="block px-3 py-2 text-gray-300 hover:text-white">
                Home
              </a>
              <a href="#features" className="block px-3 py-2 text-gray-300 hover:text-white">
                Features
              </a>
              <div className="px-3 py-2">
                {loading ? (
                  <div className="w-full h-10 bg-gray-800 rounded-lg animate-pulse"></div>
                ) : session ? (
                  <a
                    href="/dashboard"
                    className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Open HXBIT
                  </a>
                ) : (
                  <a
                    href="/auth"
                    className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Login
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-16 min-h-screen flex items-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
              Level Up Your Life
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your real-world activities into an engaging RPG experience. 
              Track progress, earn XP, compete with friends, and become the best version of yourself.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {session ? (
                <a
                  href="/dashboard"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 flex items-center"
                >
                  Continue Your Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              ) : (
                <>
                  <a
                    href="/auth"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 flex items-center"
                  >
                    Start Your Journey
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                  <a
                    href="#features"
                    className="border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200"
                  >
                    Learn More
                  </a>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">10K+</div>
                <div className="text-gray-400">Active Players</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">1M+</div>
                <div className="text-gray-400">Tasks Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">50K+</div>
                <div className="text-gray-400">Levels Gained</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Everything You Need to
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"> Level Up</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              HXBIT provides a comprehensive platform to gamify your personal development 
              and track your progress across all areas of life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Trusted by Players Worldwide
            </h2>
            <p className="text-xl text-gray-400">
              See what our community has to say about their HXBIT experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-black/50 border border-gray-800 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xl mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Life?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of players who are already leveling up their real-world skills 
            and achieving their goals with HXBIT.
          </p>
          
          {session ? (
            <a
              href="/dashboard"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105"
            >
              Continue Your Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          ) : (
            <a
              href="/auth"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105"
            >
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">HXBIT</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 HXBIT. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}