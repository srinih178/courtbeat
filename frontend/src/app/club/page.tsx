'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Clock, Dumbbell, ArrowLeft, Zap, AlertCircle } from 'lucide-react';
import VideoPlayer from '@/components/VideoPlayer';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Workout images mapping
const getWorkoutImage = (type: string, sportType: string) => {
  const images: Record<string, string> = {
    'PILATES': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop',
    'ZUMBA': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop',
    'CONDITIONING': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
    'SPORT_SPECIFIC': 'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=600&h=400&fit=crop',
    'PADEL': 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop',
    'TENNIS': 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop',
  };
  
  return images[type] || images[sportType] || images['CONDITIONING'];
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
        params: {
          hasReformerAccess: response.data.hasReformer,
        },
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
        <VideoPlayer
          workout={selectedWorkout}
          onBack={() => setSelectedWorkout(null)}
        />
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-primary-900 p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-xl shadow-lg mb-4">
              <Zap className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">CourtBeat</h1>
            <p className="text-white/70 text-base">Member Access</p>
          </div>

          {/* Access Code Card */}
          <div className="bg-white rounded-xl shadow-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Welcome!</h2>
            <p className="text-gray-600 text-sm mb-4">
              Enter your club's access code to start your workout
            </p>
            
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-2">
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-center text-lg font-mono tracking-wider focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all uppercase"
                maxLength={12}
              />
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
            
            <button
              onClick={handleAccessClub}
              disabled={!accessCode || loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 text-sm"
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
                'Access Workouts'
              )}
            </button>
            
            <p className="text-xs text-gray-500 mt-3 text-center">
              Don't have an access code? Contact your club administrator.
            </p>
          </div>

          {/* Back Link */}
          <div className="mt-4 text-center">
            <a href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium text-sm">Exit</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{club.name}</h1>
                <p className="text-xs text-gray-600">Choose a workout to get started</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary-600" />
              <span className="font-bold text-primary-600 text-sm">CourtBeat</span>
            </div>
          </div>
        </div>
      </div>

      {/* Workouts Grid */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {workouts.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-full mb-4">
              <Dumbbell className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Workouts Available</h3>
            <p className="text-gray-600 text-sm">Check back soon for new content!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workouts.map((workout: any) => (
              <div key={workout.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 overflow-hidden group">
                <div className="aspect-video bg-gradient-to-br from-primary-500 to-primary-700 relative overflow-hidden">
                  <img
                    src={getWorkoutImage(workout.type, workout.sportType)}
                    alt={workout.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute inset-0 bg-primary-900/0 group-hover:bg-primary-900/10 transition-all"></div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-1">{workout.title}</h3>
                  <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                    {workout.description}
                  </p>
                  
                  <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {workout.duration} min
                    </span>
                    <span className="capitalize px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium">
                      {workout.difficulty.replace('_', ' ').toLowerCase()}
                    </span>
                  </div>
                  
                  {workout.requiresReformer && (
                    <div className="bg-accent-50 text-accent-700 px-3 py-1.5 rounded-lg text-xs mb-3 font-medium">
                      ⚡ Requires Reformer Equipment
                    </div>
                  )}
                  
                  <button
                    onClick={() => handlePlayWorkout(workout)}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 text-sm"
                  >
                    <Play className="w-4 h-4" />
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
