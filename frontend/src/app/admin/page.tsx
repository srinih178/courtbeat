'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { BarChart3, Calendar, Video, Users, ArrowRight, Zap, AlertCircle, RefreshCw, Home, Activity } from 'lucide-react';

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-3">
              <button
                onClick={fetchStats}
                className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Retry
              </button>
              <Link
                href="/"
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Home className="w-5 h-5" />
                Go Home
              </Link>
            </div>
          </div>
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
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">CourtBeat</span>
                  <div className="text-[10px] text-gray-500 -mt-0.5">Admin Dashboard</div>
                </div>
              </Link>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium text-sm">Home</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
          </div>
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                  <Zap className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </div>
                <h1 className="text-3xl font-bold mb-2">{stats.clubName || "Diego's Padel Club"}</h1>
                <p className="text-white/90">Manage your workouts, schedules, and track member engagement</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Video className="w-6 h-6 text-primary-600" />
              </div>
              <span className="text-sm font-semibold text-primary-600">↑ 12%</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.workoutCount || 0}</div>
            <div className="text-sm text-gray-600">Total Workouts</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-secondary-600" />
              </div>
              <span className="text-sm font-semibold text-secondary-600">↑ 8%</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.scheduleCount || 0}</div>
            <div className="text-sm text-gray-600">Scheduled Sessions</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-semibold text-green-600">↑ 24%</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.analytics?.totalViews || 0}</div>
            <div className="text-sm text-gray-600">Member Views</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-sm font-semibold text-amber-600">↑ 32%</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.analytics?.averageEngagement || '0'}%</div>
            <div className="text-sm text-gray-600">Avg Engagement</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/workouts"
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-primary-200 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6 text-primary-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Workout Library</h3>
            <p className="text-sm text-gray-600 mb-4">Browse and manage your workout content library</p>
            <div className="text-sm font-semibold text-primary-600">{stats.workoutCount} workouts available</div>
          </Link>

          <Link
            href="/admin/schedules"
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-secondary-200 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-secondary-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-secondary-600 transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Schedule Sessions</h3>
            <p className="text-sm text-gray-600 mb-4">Plan and organize your workout schedule</p>
            <div className="text-sm font-semibold text-secondary-600">{stats.scheduleCount} sessions scheduled</div>
          </Link>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all group opacity-75">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-gray-400" />
              </div>
              <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Coming Soon</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Analytics</h3>
            <p className="text-sm text-gray-600 mb-4">Track member engagement and performance metrics</p>
            <div className="text-sm font-semibold text-gray-500">{stats.analytics?.totalViews || 0} total views</div>
          </div>
        </div>
      </div>
    </div>
  );
}
