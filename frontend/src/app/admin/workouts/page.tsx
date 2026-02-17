'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { ArrowLeft, Plus, Edit, Trash2, Video, Clock, Users, Filter } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function WorkoutsManagement() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

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

  const filteredWorkouts = filter === 'ALL' 
    ? workouts 
    : workouts.filter(w => w.type === filter);

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
              <h1 className="text-2xl font-bold text-gray-900">Workout Management</h1>
            </div>
            <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              <Plus className="w-5 h-5" />
              Add Workout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto">
          {['ALL', 'CONDITIONING', 'PILATES', 'ZUMBA', 'SPORT_SPECIFIC'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                filter === type
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Workouts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map((workout) => (
            <div key={workout.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              {/* Workout Image */}
              <div className="aspect-video bg-gradient-to-br from-primary-500 to-primary-700 relative">
                <img
                  src={
                    workout.type === 'PILATES' 
                      ? 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop'
                      : workout.type === 'ZUMBA'
                      ? 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&h=400&fit=crop'
                      : workout.type === 'CONDITIONING' || workout.type === 'SPORT_SPECIFIC'
                      ? 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop'
                      : 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop'
                  }
                  alt={workout.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button className="p-2 bg-white/90 hover:bg-white rounded-lg transition-colors">
                    <Edit className="w-4 h-4 text-gray-700" />
                  </button>
                  <button className="p-2 bg-white/90 hover:bg-white rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Workout Info */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                    {workout.type.replace('_', ' ')}
                  </span>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                    {workout.difficulty.replace('_', ' ')}
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{workout.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{workout.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {workout.duration} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Video className="w-4 h-4" />
                    {workout.videos?.length || 0} videos
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredWorkouts.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Video className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No workouts found</h3>
            <p className="text-gray-600 mb-4">Create your first workout to get started</p>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium">
              Add Workout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
