'use client';

import Link from 'next/link';
import { Play, Settings, Activity, TrendingUp, Users, Shield } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-secondary-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">CourtBeat</span>
            </div>
            <div className="text-sm text-gray-600">AI-Powered Fitness</div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&h=800&fit=crop"
            alt="Court workout"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/95 via-primary-800/90 to-primary-700/85"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-3xl">
            <div className="inline-block px-3 py-1 bg-secondary-500/20 backdrop-blur-sm rounded-full text-secondary-200 text-sm font-medium mb-6 border border-secondary-400/30">
              Next-Generation Fitness Platform
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Transform Your Club with AI-Powered Workouts
            </h1>
            <p className="text-lg text-gray-200 mb-8 max-w-2xl">
              Professional fitness content for padel, pickleball, and tennis clubs. No instructors needed.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/club"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg"
              >
                <Play className="w-5 h-5" />
                Member Access
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 bg-secondary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary-700 transition-all"
              >
                <Settings className="w-5 h-5" />
                Club Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Everything Your Club Needs
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Professional workout content, scheduling tools, and analytics—all in one platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-secondary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Content</h3>
              <p className="text-gray-600 text-sm">
                Professional AI avatars with dynamic music overlays and verbal modifications for all fitness levels
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Member Access</h3>
              <p className="text-gray-600 text-sm">
                No login required. Members simply enter a club code and start working out immediately
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Engagement</h3>
              <p className="text-gray-600 text-sm">
                Real-time analytics dashboard to measure ROI and member engagement across all workouts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Workout Types Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Diverse Workout Library
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From sport-specific conditioning to Zumba with rackets—content that keeps members engaged
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Workout Type 1 */}
            <div className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all">
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
                alt="Conditioning"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold text-base">Sport-Specific</h3>
                <p className="text-gray-200 text-xs">Conditioning & drills</p>
              </div>
            </div>

            {/* Workout Type 2 */}
            <div className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all">
              <img
                src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop"
                alt="Pilates"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold text-base">Pilates</h3>
                <p className="text-gray-200 text-xs">Core & flexibility</p>
              </div>
            </div>

            {/* Workout Type 3 */}
            <div className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all">
              <img
                src="https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&h=300&fit=crop"
                alt="Zumba"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold text-base">Zumba</h3>
                <p className="text-gray-200 text-xs">Dance cardio with rackets</p>
              </div>
            </div>

            {/* Workout Type 4 */}
            <div className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all">
              <img
                src="https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=400&h=300&fit=crop"
                alt="Recovery"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold text-base">Recovery</h3>
                <p className="text-gray-200 text-xs">Stretching & mobility</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Transform Your Club?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join leading clubs using CourtBeat to deliver professional fitness content without the overhead
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/club"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
            >
              Try Member Access
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 bg-secondary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary-700 transition-all border border-secondary-500"
            >
              View Admin Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-600">
            CourtBeat &copy; 2024 - Professional Fitness for Racket Sports Clubs
          </p>
        </div>
      </footer>
    </main>
  );
}
