'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { ArrowLeft, Video, Clock, TrendingUp, Home } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const WORKOUT_IMAGES: Record<string, string> = {
  PILATES:      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop',
  ZUMBA:        'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&h=400&fit=crop',
  CONDITIONING: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
  SPORT_SPECIFIC:'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop',
};

export default function WorkoutsManagement() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get(`${API_URL}/workouts`);
      setWorkouts(response.data);
    } catch (error) {
      console.error('Failed to fetch workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWorkouts = filter === 'all' 
    ? workouts 
    : workouts.filter(w => w.type === filter);

  const workoutTypes = ['all', 'PILATES', 'ZUMBA', 'CONDITIONING', 'SPORT_SPECIFIC'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workouts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Workout Library</h1>
            </div>
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors">
              <Home className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {workoutTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                filter === type
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {type === 'all' ? 'All Workouts' : type.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Workouts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map((workout) => (
            <div key={workout.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden group">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={WORKOUT_IMAGES[workout.type] || WORKOUT_IMAGES.CONDITIONING}
                  alt={workout.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-2.5 py-1 rounded-full">
                  {workout.duration} min
                </span>
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="inline-block px-2.5 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold rounded-full">
                    {workout.type.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-900 mb-1.5 line-clamp-1">{workout.title}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{workout.description}</p>
                
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Difficulty</div>
                    <div className="text-xs font-semibold text-gray-900">{workout.difficulty.replace('_', ' ')}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Sport</div>
                    <div className="text-xs font-semibold text-gray-900">{workout.sportType}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Status</div>
                    <div className="flex items-center gap-1">
                      {workout.isActive ? (
                        <span className="text-xs font-semibold text-green-600">Active</span>
                      ) : (
                        <span className="text-xs font-semibold text-gray-400">Inactive</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredWorkouts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Video className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No workouts found
            </h3>
            <p className="text-gray-600">
              Try selecting a different filter or add new workouts
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
