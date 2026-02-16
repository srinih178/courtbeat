'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { ArrowLeft, Plus, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function SchedulesManagement() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [clubId, setClubId] = useState('');
  const [view, setView] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    fetchSchedules();
  }, [view]);

  const fetchSchedules = async () => {
    try {
      // Get club ID first
      const clubsResponse = await axios.get(`${API_URL}/clubs`);
      const club = clubsResponse.data[0];
      setClubId(club.id);

      // Fetch schedules
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
            <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              <Plus className="w-5 h-5" />
              Add Schedule
            </button>
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
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium">
                Add Schedule
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
