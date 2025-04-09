'use client';
import { useState } from 'react';
import Link from 'next/link';
import  MovieBox  from '@/components/movies/MovieBox';
import { januaryMovies } from '@/data/january';

export default function JanuaryPage() {
  const [currentDay, setCurrentDay] = useState(() => {
    // Set current day for January (1-31)
    const now = new Date();
    return now.getMonth() === 0 ? now.getDate() : 31; // If it's January, use current date, otherwise show all
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link 
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span className="mr-2">←</span> Back to Home
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">January Movies</h1>
          <div className="w-20"></div> {/* Spacer for alignment */}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
          {januaryMovies.map((movie) => (
            <MovieBox 
              key={movie.id} 
              movie={movie} 
              currentDay={currentDay}
              currentMonth={0} // January is month 0
              isClickable={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 