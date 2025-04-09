'use client';

import { motion } from 'framer-motion';

interface StatsBarProps {
  watchedCount: number;
}

export default function StatsBar({ watchedCount }: StatsBarProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-md mb-8 w-full"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-gray-800">
          <h2 className="text-2xl font-semibold">{currentDate}</h2>
        </div>
        <div className="flex items-center gap-2 bg-primary bg-opacity-10 px-4 py-2 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <span className="text-primary font-semibold">
            {watchedCount} {watchedCount === 1 ? 'Movie' : 'Movies'} Watched
          </span>
        </div>
      </div>
    </motion.div>
  );
} 