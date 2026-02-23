'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Play, Pause, Volume2, Maximize } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const WORKOUT_VIDEOS: Record<string, string> = {
  'w-002': 'j2ltCFY028zde21ibROrSknQFo1aIHKSHx01axNJzsKKY', // Core Strength video
  'w2': 'j2ltCFY028zde21ibROrSknQFo1aIHKSHx01axNJzsKKY', // Core Strength alternate ID
};

export default function WorkoutPlayerPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  
  const workoutId = searchParams.get('id');
  const workoutTitle = searchParams.get('title') || 'Core Strength for Racket Sports';
  const workoutDuration = searchParams.get('duration') || '30';
  const clubName = searchParams.get('club') || 'Your Club';

  const videoId = WORKOUT_VIDEOS[workoutId || 'w2'] || WORKOUT_VIDEOS['w2'];

  useEffect(() => {
    // Auto-play after component mounts
    const timer = setTimeout(() => setIsPlaying(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Workouts</span>
          </button>
          
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white">CourtBeat</span>
          </Link>
        </div>
      </div>

      {/* Video Player */}
      <div className="flex-1 flex items-center justify-center bg-black p-4">
        <div className="w-full max-w-2xl">
          {/* Video Title */}
          <div className="mb-4 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">{workoutTitle}</h1>
            <div className="flex items-center justify-center gap-4 text-gray-400 text-sm">
              <span className="flex items-center gap-1">
                <Play className="w-4 h-4" />
                {workoutDuration} min workout
              </span>
              <span>•</span>
              <span>{clubName}</span>
            </div>
          </div>

          {/* Mux Video Player */}
          <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
            <iframe
              src={`https://player.mux.com/${videoId}?metadata-video-title=${encodeURIComponent(workoutTitle)}&autoplay=1`}
              style={{ width: '100%', border: 'none', aspectRatio: '9/16' }}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen
              className="w-full"
            />
          </div>

          {/* Workout Info */}
          <div className="mt-6 bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-bold text-white mb-3">About This Workout</h3>
            <p className="text-gray-400 mb-4">
              Pilates-inspired core workout focusing on rotational strength and racket control. 
              Perfect for tennis, padel, and pickleball players looking to improve stability and power.
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
              <div>
                <div className="text-gray-500 text-sm">Difficulty</div>
                <div className="text-white font-semibold">Intermediate</div>
              </div>
              <div>
                <div className="text-gray-500 text-sm">Duration</div>
                <div className="text-white font-semibold">{workoutDuration} minutes</div>
              </div>
              <div>
                <div className="text-gray-500 text-sm">Equipment</div>
                <div className="text-white font-semibold">Mat only</div>
              </div>
              <div>
                <div className="text-gray-500 text-sm">Type</div>
                <div className="text-white font-semibold">Pilates Core</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => router.back()}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-colors"
            >
              View More Workouts
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Restart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
