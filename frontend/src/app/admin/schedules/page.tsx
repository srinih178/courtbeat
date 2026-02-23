'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { ArrowLeft, Plus, Calendar, Clock, CheckCircle, X, Home, Activity } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function SchedulesManagement() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [clubId, setClubId] = useState('');
  const [view, setView] = useState<'upcoming' | 'past'>('upcoming');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    workoutId: '',
    scheduledDate: '',
    scheduledTime: '',
    duration: 30,
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSchedules();
    fetchWorkouts();
  }, [view]);

  const fetchSchedules = async () => {
    try {
      const clubsResponse = await axios.get(`${API_URL}/clubs`);
      const club = clubsResponse.data[0];
      setClubId(club.id);

      const response = await axios.get(`${API_URL}/schedules/club/${club.id}`, {
        params: { upcoming: view === 'upcoming' }
      });
      setSchedules(response.data);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get(`${API_URL}/workouts`);
      setWorkouts(response.data);
    } catch (error) {
      console.error('Failed to fetch workouts:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const scheduledAt = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);
      
      await axios.post(`${API_URL}/schedules`, {
        clubId,
        workoutId: formData.workoutId,
        scheduledAt: scheduledAt.toISOString(),
        duration: formData.duration,
        notes: formData.notes || undefined
      });

      setShowModal(false);
      setFormData({ workoutId: '', scheduledDate: '', scheduledTime: '', duration: 30, notes: '' });
      fetchSchedules();
    } catch (error) {
      console.error('Failed to create schedule:', error);
      alert('Failed to create schedule. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading schedules...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Schedule Management</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors">
                <Home className="w-5 h-5" />
              </Link>
              <button 
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Schedule
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* View Toggle */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setView('upcoming')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              view === 'upcoming'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setView('past')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              view === 'past'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Past
          </button>
        </div>

        {/* Schedules List */}
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    <span className="font-semibold text-gray-900">
                      {format(parseISO(schedule.scheduledAt), 'MMMM d, yyyy')}
                    </span>
                    <span className="text-gray-500">at</span>
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-700">
                      {format(parseISO(schedule.scheduledAt), 'h:mm a')}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {schedule.workout.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {schedule.workout.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded font-medium">
                      {schedule.workout.type.replace('_', ' ')}
                    </span>
                    <span className="text-gray-500 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {schedule.duration} minutes
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {schedule.isCompleted ? (
                    <span className="flex items-center gap-1 text-green-600 font-medium text-sm">
                      <CheckCircle className="w-5 h-5" />
                      Completed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-yellow-600 font-medium text-sm">
                      <Clock className="w-5 h-5" />
                      Scheduled
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {schedules.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No {view} schedules
            </h3>
            <p className="text-gray-600 mb-4">
              {view === 'upcoming' 
                ? 'Schedule your first workout session to get started' 
                : 'No past schedules to display'}
            </p>
            {view === 'upcoming' && (
              <button 
                onClick={() => setShowModal(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Add Schedule
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">Add New Schedule</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Workout Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Workout *
                </label>
                <select
                  required
                  value={formData.workoutId}
                  onChange={(e) => {
                    const workout = workouts.find(w => w.id === e.target.value);
                    setFormData({
                      ...formData,
                      workoutId: e.target.value,
                      duration: workout?.duration || 30
                    });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                >
                  <option value="">Choose a workout...</option>
                  {workouts.map((workout) => (
                    <option key={workout.id} value={workout.id}>
                      {workout.title} ({workout.duration} min - {workout.type.replace('_', ' ')})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  min="10"
                  max="120"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                />
                <p className="mt-1 text-xs text-gray-500">Auto-filled from workout, can be adjusted</p>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Add any special instructions or notes..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
