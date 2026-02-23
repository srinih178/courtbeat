'use client';

import Link from 'next/link';
import { Play, Settings, Activity, TrendingUp, Users, Zap } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Activity className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">CourtBeat</span>
                <div className="text-[10px] text-gray-500 -mt-0.5">AI Fitness Platform</div>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <Link href="/club" className="text-gray-600 hover:text-primary-600 font-medium text-sm transition-colors">
                Member Access
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-primary-600 font-medium text-sm transition-colors">
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Image */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-5 border border-white/30">
                <Zap className="w-4 h-4" />
                <span>Next-Gen Fitness Platform</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Transform Your Club with AI-Powered Workouts
              </h1>
              <p className="text-lg text-white/90 mb-8">
                Professional fitness content for padel, pickleball, and tennis clubs. No instructors needed.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/club"
                  className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Play className="w-5 h-5" />
                  Start Workout Now
                </Link>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 bg-primary-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-900 transition-all border-2 border-white/20"
                >
                  <Settings className="w-5 h-5" />
                  Club Admin
                </Link>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                <img
                  src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&h=700&fit=crop"
                  alt="Athletes training at fitness club"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 to-transparent"></div>
                
                {/* Floating Stats Card */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-primary-600">10+</div>
                      <div className="text-sm text-gray-600">Workout Types</div>
                    </div>
                    <div className="h-10 w-px bg-gray-300"></div>
                    <div>
                      <div className="text-2xl font-bold text-secondary-600">100+</div>
                      <div className="text-sm text-gray-600">Happy Clubs</div>
                    </div>
                    <div className="h-10 w-px bg-gray-300"></div>
                    <div>
                      <div className="text-2xl font-bold text-coral-600">24/7</div>
                      <div className="text-sm text-gray-600">Access</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-secondary-400 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-400 rounded-full blur-3xl opacity-20"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-3">
              Everything Your Club Needs
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Professional workout content, scheduling tools, and analytics—all in one platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100 group">
              <div className="w-14 h-14 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">AI-Powered Content</h3>
              <p className="text-gray-600 text-sm">
                Professional AI avatars with dynamic music overlays and modifications for all fitness levels
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100 group">
              <div className="w-14 h-14 bg-gradient-to-br from-coral-400 to-coral-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Easy Access</h3>
              <p className="text-gray-600 text-sm">
                No login required. Members enter a club code and start working out immediately
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100 group">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Track Engagement</h3>
              <p className="text-gray-600 text-sm">
                Real-time analytics to measure ROI and member engagement across workouts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Workout Types Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-3">
              Diverse Workout Library
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From sport-specific conditioning to dance cardio—content that keeps members engaged
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Workout Type 1 */}
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all">
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=280&fit=crop"
                alt="Conditioning"
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-600/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-lg mb-1">Sport-Specific</h3>
                <p className="text-white/90 text-sm">Conditioning & drills</p>
              </div>
            </div>

            {/* Workout Type 2 */}
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all">
              <img
                src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=280&fit=crop"
                alt="Pilates"
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/90 via-secondary-600/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-lg mb-1">Pilates</h3>
                <p className="text-white/90 text-sm">Core & flexibility</p>
              </div>
            </div>

            {/* Workout Type 3 */}
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all">
              <img
                src="https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&h=280&fit=crop"
                alt="Zumba"
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-coral-900/90 via-coral-600/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-lg mb-1">Zumba</h3>
                <p className="text-white/90 text-sm">Dance cardio</p>
              </div>
            </div>

            {/* Workout Type 4 */}
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all">
              <img
                src="https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=400&h=280&fit=crop"
                alt="Recovery"
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-600/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-lg mb-1">Recovery</h3>
                <p className="text-white/90 text-sm">Stretching & mobility</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-14 bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Club?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join leading clubs using CourtBeat to deliver professional fitness content
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/club"
              className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-lg"
            >
              Try Member Access
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 bg-primary-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-900 transition-all border-2 border-white/20"
            >
              View Admin Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white">CourtBeat</span>
            </div>
            <p className="text-sm text-center">
              CourtBeat &copy; 2024 - Professional Fitness for Racket Sports Clubs
            </p>
            <div className="flex gap-4">
              <Link href="/club" className="text-sm hover:text-white transition-colors">Member Access</Link>
              <Link href="/admin" className="text-sm hover:text-white transition-colors">Admin</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
