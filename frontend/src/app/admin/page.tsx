'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { BarChart3, Calendar, Video, Users, ArrowRight, Zap, AlertCircle, RefreshCw } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [clubId, setClubId] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    
    try {
      const clubsResponse = await axios.get(`${API_URL}/clubs`);
      
      if (!clubsResponse.data || clubsResponse.data.length === 0) {
        setError('No clubs found. Please run database seed.');
        setLoading(false);
        return;
      }

      const club = clubsResponse.data[0];
      setClubId(club.id);

      const [statsResponse, analyticsResponse] = await Promise.all([
        axios.get(`${API_URL}/clubs/${club.id}/stats`),
        axios.get(`${API_URL}/analytics/club/${club.id}/stats`),
      ]);
      
      setStats({
        ...statsResponse.data,
        analytics: analyticsResponse.data,
      });
    } catch (error: any) {
      console.error('Failed to fetch stats:', error);
      setError(
        error.response?.data?.message || 
        'Failed to load dashboard. Please check if the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <RefreshCw className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Dashboard...</h3>
          <p className="text-gray-600 text-sm">Please wait</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">Dashboard Error</h3>
          <p className="text-gray-600 text-sm mb-4 text-center">{error}</p>
          <div className="space-y-2">
            <button
              onClick={fetchStats}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-all text-sm"
            >
              Retry
            </button>
            <a
              href="/"
              className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-lg transition-all text-sm"
            >
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
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg">
                <Zap className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{stats?.club?.name}</h1>
                <p className="text-sm text-gray-600">Club Admin Dashboard</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Access Code</div>
              <div className="font-mono font-bold text-primary-600">{stats?.club?.accessCode}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-medium text-gray-600">Total Workouts</h3>
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <Video className="w-4 h-4 text-primary-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.stats?.totalWorkouts || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Played this period</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-medium text-gray-600">Sessions</h3>
              <div className="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-secondary-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.analytics?.sessions || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Unique sessions</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-medium text-gray-600">Scheduled</h3>
              <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-accent-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.stats?.scheduledWorkouts || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Upcoming workouts</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-medium text-gray-600">Engagement</h3>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.analytics?.uniqueWorkouts || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Unique workouts played</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/admin/workouts" className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all group cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg">
                <Video className="w-5 h-5 text-primary-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Manage Workouts</h3>
            <p className="text-gray-600 text-sm">
              Create, edit, and organize workout content
            </p>
          </Link>

          <Link href="/admin/schedules" className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all group cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center justify-center w-10 h-10 bg-secondary-100 rounded-lg">
                <Calendar className="w-5 h-5 text-secondary-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Schedule Sessions</h3>
            <p className="text-gray-600 text-sm">
              Plan and schedule upcoming workout sessions
            </p>
          </Link>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm p-5 border border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-sm">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600 text-sm mb-3">
              Detailed analytics coming in Phase 2
            </p>
            <span className="inline-block text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full font-medium">
              Coming Soon
            </span>
          </div>
        </div>

        {/* Subscription Info */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Subscription Tier</h3>
              <p className="text-gray-600 text-sm">
                {stats?.club?.subscriptionTier === 'PREMIUM' ? (
                  <span className="text-secondary-600 font-semibold">
                    ✨ Premium - Full access to reformer Pilates and all features
                  </span>
                ) : (
                  <>Base - Standard workouts and features</>
                )}
              </p>
            </div>
            {stats?.club?.subscriptionTier === 'BASE' && (
              <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-lg transition-all text-sm">
                Upgrade to Premium
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
