'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useMovieStore } from '@/store/movieStore';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const auth = useAuth();
  const router = useRouter();
  const { watchedMovies, favoriteMovies, savedMovies } = useMovieStore();
  const [showFutureMonthModal, setShowFutureMonthModal] = useState(false);

  // Handle sign in
  const handleSignIn = async () => {
    try {
      await auth.signIn();
    } catch (error) {
      console.error('Failed to sign in:', error);
    }
  };

  const months = [
    { name: 'January', path: '/month/january', color: 'bg-blue-500' },
    { name: 'February', path: '/month/february', color: 'bg-pink-500' },
    { name: 'March', path: '/month/march', color: 'bg-green-500' },
    { name: 'April', path: '/month/april', color: 'bg-yellow-500' },
    { name: 'May', path: '/month/may', color: 'bg-purple-500' },
    { name: 'June', path: '/month/june', color: 'bg-red-500' },
    { name: 'July', path: '/month/july', color: 'bg-indigo-500' },
    { name: 'August', path: '/month/august', color: 'bg-orange-500' },
    { name: 'September', path: '/month/september', color: 'bg-teal-500' },
    { name: 'October', path: '/month/october', color: 'bg-cyan-500' },
    { name: 'November', path: '/month/november', color: 'bg-rose-500' },
    { name: 'December', path: '/month/december', color: 'bg-emerald-500' }
  ];

  if (auth.isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!auth.user) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar showUser={false} />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Movie-a-Day</h1>
              <p className="text-gray-600 mb-8">Sign in to start your movie journey</p>
              <button
                onClick={handleSignIn}
                className="flex items-center justify-center w-full px-8 py-3 rounded-lg bg-white border-2 border-gray-300 hover:bg-gray-50 transition-colors transform hover:scale-105 duration-200 mb-4"
              >
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentMonth = new Date().getMonth(); // 0-11
  const currentMonthColor = months[currentMonth].color.replace('bg-', 'text-'); // Convert bg-color to text-color

  // Function to get watched movies count for a specific month
  const getWatchedMoviesForMonth = (monthIndex: number) => {
    return watchedMovies.filter(movieId => {
      const movieDay = parseInt(movieId.split('-')[1]); // Assuming ID format: "january-1"
      const movieMonth = movieId.split('-')[0].toLowerCase();
      return movieMonth === months[monthIndex].name.toLowerCase();
    }).length;
  };

  const handleMonthClick = (index: number) => {
    if (index > currentMonth) {
      setShowFutureMonthModal(true);
    } else {
      router.push(months[index].path);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar showUser={true} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Date Container */}
        <div className={`${months[currentMonth].color} rounded-lg shadow-lg p-6 mb-6 transform transition-all duration-200 hover:scale-105 hover:shadow-2xl`}>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              }).replace(/,/g, '')}
            </h2>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Watched Movies */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 text-primary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Watched Movies</h3>
              <p className="text-3xl font-bold text-primary">{watchedMovies.length}</p>
            </div>
          </div>

          {/* Favorite Movies */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Favorite Movies</h3>
              <p className="text-3xl font-bold text-red-500">{favoriteMovies.length}</p>
            </div>
          </div>

          {/* Saved Movies */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 text-yellow-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Saved Movies</h3>
              <p className="text-3xl font-bold text-yellow-500">{savedMovies.length}</p>
            </div>
          </div>

          {/* My Profile */}
          <Link 
            href="/profile"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex flex-col items-center">
              {auth.user.photoURL ? (
                <img 
                  src={auth.user.photoURL} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full mb-2"
                />
              ) : (
                <svg className="w-8 h-8 text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
              <h3 className="text-xl font-semibold text-gray-900 mb-1">My Profile</h3>
              <p className="text-gray-600 text-center truncate max-w-full">
                {auth.user.displayName || auth.user.email}
              </p>
            </div>
          </Link>
        </div>

        {/* Months Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {months.map((month, index) => (
            <button 
              key={month.name}
              onClick={() => handleMonthClick(index)}
              className={`
                ${month.color}
                rounded-lg shadow-lg p-6 text-white
                transform transition-all duration-200
                hover:scale-105 hover:shadow-2xl
                ${index > currentMonth ? 'opacity-80' : ''}
              `}
            >
              <div className="flex flex-col items-center">
                <h3 className="text-2xl font-bold">{month.name}</h3>
              </div>
            </button>
          ))}
        </div>

        {/* Future Month Modal */}
        {showFutureMonthModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-8 max-w-sm w-full shadow-xl transform transition-all">
              <div className="text-center">
                <div className="mb-4">
                  <svg className="w-12 h-12 text-yellow-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Have Patience!
                </h3>
                <p className="text-gray-600 mb-6">
                  That month is still a few days away. Good things come to those who wait!
                </p>
                <button
                  onClick={() => setShowFutureMonthModal(false)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 