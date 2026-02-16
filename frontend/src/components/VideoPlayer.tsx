'use client';

import { useEffect, useRef } from 'react';
import { ArrowLeft, Maximize } from 'lucide-react';

interface VideoPlayerProps {
  workout: any;
  onBack: () => void;
}

export default function VideoPlayer({ workout, onBack }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // In production, initialize Video.js or HLS.js here
    // For POC, using native HTML5 video
    if (videoRef.current && workout.videos?.[0]?.streamUrl) {
      videoRef.current.src = workout.videos[0].streamUrl;
    }
  }, [workout]);

  const handleFullscreen = () => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div className="relative w-full h-screen bg-black">
      {/* Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-primary-400 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-lg font-semibold">Back to Workouts</span>
          </button>
          
          <button
            onClick={handleFullscreen}
            className="flex items-center gap-2 text-white hover:text-primary-400 transition-colors"
          >
            <Maximize className="w-6 h-6" />
          </button>
        </div>
        
        <div className="mt-4">
          <h1 className="text-3xl font-bold text-white mb-2">{workout.title}</h1>
          <p className="text-white/80">{workout.description}</p>
        </div>
      </div>

      {/* Video Player */}
      <div className="w-full h-full flex items-center justify-center">
        {workout.videos?.[0]?.streamUrl ? (
          <video
            ref={videoRef}
            controls
            autoPlay
            className="w-full h-full"
            poster={workout.thumbnailUrl}
          >
            <source src={workout.videos[0].streamUrl} type="application/x-mpegURL" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="text-center">
            <div className="bg-gray-800 rounded-full p-8 mb-4 inline-block">
              <svg className="w-16 h-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Video Not Available</h3>
            <p className="text-gray-400">This workout video is being processed. Please check back later.</p>
          </div>
        )}
      </div>

      {/* Workout Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-6">
        <div className="flex items-center gap-6 text-white text-sm">
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {workout.duration} minutes
          </span>
          
          <span className="capitalize px-3 py-1 bg-white/20 rounded-full">
            {workout.difficulty.replace('_', ' ')}
          </span>
          
          <span className="capitalize px-3 py-1 bg-primary-500/30 rounded-full">
            {workout.type.replace('_', ' ')}
          </span>
          
          {workout.hasVerbalCues && (
            <span className="px-3 py-1 bg-green-500/30 rounded-full">
              Verbal Cues Included
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
