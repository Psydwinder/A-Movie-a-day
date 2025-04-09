'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import MovieBox from '@/components/movies/MovieBox';
import { januaryMovies } from '@/data/january';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function JanuaryPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push('/');
    return null;
  }

  const userId = user.email || 'anonymous-user';

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar showUser={true} />
      
      {/* Back Button */}
      <Link 
        href="/"
        className="fixed left-8 top-24 bg-black rounded-full p-4 shadow-lg hover:bg-gray-900 transition-colors z-10"
      >
        <svg 
          className="w-6 h-6 text-white" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 19l-7-7 7-7" 
          />
        </svg>
      </Link>

      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">January</h1>
          <p className="text-lg text-gray-600">
            A new year, a new collection of movies to discover.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {januaryMovies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MovieBox 
                movie={movie}
                userId={userId}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 