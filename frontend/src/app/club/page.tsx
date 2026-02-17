'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Clock, Dumbbell, ArrowLeft, Zap, AlertCircle, Sparkles } from 'lucide-react';
import VideoPlayer from '@/components/VideoPlayer';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const getWorkoutImage = (type: string, sportType: string) => {
  const images: Record<string, string> = {
    'PILATES': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop',
    'ZUMBA': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&h=400&fit=crop',
    'CONDITIONING': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
    'SPORT_SPECIFIC': 'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=600&h=400&fit=crop',
  };
  return images[type] || images['CONDITIONING'];
};

export default function ClubPage() {
  const [accessCode, setAccessCode] = useState('');
  const [club, setClub] = useState<any>(null);
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAccessClub = async () => {
    if (!accessCode.trim()) {
      setError('Please enter an access code');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`${API_URL}/clubs/access/${accessCode.trim()}`);
      setClub(response.data);
      
      const workoutsResponse = await axios.get(`${API_URL}/workouts`, {
        params: { hasReformerAccess: response.data.hasReformer },
      });
      setWorkouts(workoutsResponse.data);
      
      await axios.post(`${API_URL}/analytics/track`, {
        clubId: response.data.id,
        eventType: 'club_accessed',
      }).catch(() => {});
    } catch (err: any) {
      console.error('Access error:', err);
      setError(err.response?.data?.message || 'Invalid access code. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayWorkout = async (workout: any) => {
    setSelectedWorkout(workout);
    if (club) {
      await axios.post(`${API_URL}/analytics/track`, {
        clubId: club.id,
        workoutId: workout.id,
        eventType: 'workout_played',
      }).catch(() => {});
    }
  };

  const handleBack = () => {
    setClub(null);
    setWorkouts([]);
    setAccessCode('');
    setError('');
  };

  if (selectedWorkout) {
    return (
      <div className="min-h-screen bg-black">
        <VideoPlayer workout={selectedWorkout} onBack={() => setSelectedWorkout(null)} />
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 p-4 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-2xl mb-4 relative">
              <Zap className="w-9 h-9 text-primary-600" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-secondary-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">CourtBeat</h1>
            <p className="text-white/90 text-lg flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Member Access
            </p>
          </div>

          {/* Access Code Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome!</h2>
            <p className="text-gray-600 mb-6">
              Enter your club's access code to start your workout
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Club Access Code
              </label>
              <input
                type="text"
                placeholder="e.g., PADEL2024"
                value={accessCode}
                onChange={(e) => {
                  setAccessCode(e.target.value.toUpperCase());
                  setError('');
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleAccessClub()}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-center text-xl font-bold tracking-wider focus:border-primary-500 focus:ring-4 focus:ring-primary-200 outline-none transition-all uppercase bg-gray-50"
                maxLength={12}
              />
            </div>
            
            {error && (
              <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
            )}
            
            <button
              onClick={handleAccessClub}
              disabled={!accessCode || loading}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-bold py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Accessing...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  Access Workouts
                </span>
              )}
            </button>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
              Don't have an access code? Contact your club administrator.
            </p>
          </div>

          {/* Back Link with high visibility */}
          <div className="mt-6 text-center">
            <a 
              href="/" 
              className="inline-flex items-center gap-2 text-white hover:text-white/90 transition-colors bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/20 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Exit</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">{club.name}</h1>
                <p className="text-xs text-gray-600">Choose a workout to get started</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">CourtBeat</span>
            </div>
          </div>
        </div>
      </div>

      {/* Workouts Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {workouts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full mb-4">
              <Dumbbell className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Workouts Available</h3>
            <p className="text-gray-600">Check back soon for new content!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((workout: any) => (
              <div key={workout.id} className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all border border-gray-100 overflow-hidden group">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={getWorkoutImage(workout.type, workout.sportType)}
                    alt={workout.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-primary-600">
                      {workout.duration} min
                    </span>
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{workout.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {workout.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-primary-100 to-primary-200 text-primary-700 rounded-lg text-xs font-semibold">
                      {workout.difficulty.replace('_', ' ')}
                    </span>
                    {workout.requiresReformer && (
                      <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-lg text-xs font-semibold">
                        ⚡ Reformer
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handlePlayWorkout(workout)}
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    <Play className="w-5 h-5" />
                    Start Workout
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
