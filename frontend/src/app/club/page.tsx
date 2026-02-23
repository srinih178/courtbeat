'use client';

import { useState } from 'react';
import axios from 'axios';
import { Play, Clock, Dumbbell, ArrowLeft, Zap, AlertCircle, Sparkles, Home } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const WORKOUT_IMAGES: Record<string, string> = {
  PILATES:      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop',
  ZUMBA:        'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&h=400&fit=crop',
  CONDITIONING: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
  SPORT_SPECIFIC:'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop',
};

export default function ClubPage() {
  const router = useRouter();
  const [accessCode, setAccessCode] = useState('');
  const [club, setClub] = useState<any>(null);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAccessClub = async () => {
    if (!accessCode.trim()) { setError('Please enter an access code'); return; }
    setLoading(true); setError('');
    try {
      const res = await axios.get(`${API_URL}/clubs/access/${accessCode.trim().toUpperCase()}`);
      setClub(res.data);
      const w = await axios.get(`${API_URL}/workouts`);
      setWorkouts(w.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid access code. Please check and try again.');
    } finally { setLoading(false); }
  };

  const handleStartWorkout = (workout: any) => {
    router.push(`/workout?id=${workout.id}&title=${encodeURIComponent(workout.title)}&duration=${workout.duration}&club=${encodeURIComponent(club.name)}`);
  };

  if (!club) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-500 p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 2px 2px,white 1px,transparent 0)',backgroundSize:'40px 40px'}} />
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-2xl mb-4 relative hover:scale-105 transition-transform">
              <Zap className="w-9 h-9 text-primary-600" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-secondary-400 rounded-full border-2 border-white animate-pulse" />
            </Link>
            <h1 className="text-4xl font-bold text-white mb-1">CourtBeat</h1>
            <p className="text-white/80 flex items-center justify-center gap-1 text-base">
              <Sparkles className="w-4 h-4" /> Member Access
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome!</h2>
            <p className="text-gray-500 text-sm mb-6">Enter your club's access code to start your workout</p>

            <input
              type="text"
              placeholder="e.g. PADEL2024"
              value={accessCode}
              onChange={e => { setAccessCode(e.target.value.toUpperCase()); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleAccessClub()}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-center text-xl font-bold tracking-widest focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all uppercase bg-gray-50 mb-4"
              maxLength={12}
            />

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex gap-2 items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleAccessClub}
              disabled={!accessCode || loading}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-bold py-4 rounded-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? <><span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />Checking...</>
                : <><Play className="w-5 h-5" />Access Workouts</>}
            </button>

            <p className="text-xs text-gray-400 mt-4 text-center">
              No code? Contact your club administrator.
            </p>
          </div>

          <div className="mt-5 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-white bg-white/15 hover:bg-white/25 border border-white/30 px-5 py-2 rounded-full text-sm font-medium transition-all backdrop-blur-sm">
              <Home className="w-4 h-4" /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => { setClub(null); setWorkouts([]); setAccessCode(''); }} className="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors font-medium text-sm">
              <ArrowLeft className="w-4 h-4" /> Exit
            </button>
            <div className="h-5 w-px bg-gray-300" />
            <div>
              <h1 className="font-bold text-gray-900 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">{club.name}</h1>
              <p className="text-xs text-gray-500">Choose your workout</p>
            </div>
          </div>
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">CourtBeat</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {workouts.length === 0 ? (
          <div className="text-center py-16">
            <Dumbbell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No workouts available yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((w: any) => (
              <div key={w.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden group">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={WORKOUT_IMAGES[w.type] || WORKOUT_IMAGES.CONDITIONING}
                    alt={w.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-2.5 py-1 rounded-full">
                    {w.duration} min
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-1.5 line-clamp-1">{w.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{w.description}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2.5 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-semibold">{w.difficulty?.replace('_',' ')}</span>
                    <span className="px-2.5 py-1 bg-secondary-50 text-secondary-700 rounded-lg text-xs font-semibold">{w.type?.replace('_',' ')}</span>
                  </div>
                  <button 
                    onClick={() => handleStartWorkout(w)}
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg text-sm"
                  >
                    <Play className="w-4 h-4" /> Start Workout
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
