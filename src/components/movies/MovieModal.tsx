'use client';

import { Movie, UKRating } from '@/types/movie';
import { useMovieStore } from '@/store/movieStore';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
// Removed import of '@headlessui/react' due to missing module

interface MovieModalProps {
  movie: Movie;
  isOpen: boolean;
  // Removed duplicate 'onClose' declaration
  onClose: () => void;
}

export default function MovieModal({ movie, isOpen, onClose }: MovieModalProps) {
  const { 
    addWatched, 
    addFavorite, 
    addSaved, 
    removeWatched,
    removeFavorite,
    removeSaved,
    watchedMovies, 
    favoriteMovies, 
    savedMovies 
  } = useMovieStore();

  const isWatched = watchedMovies.includes(movie.id);
  const isFavorite = favoriteMovies.includes(movie.id);
  const isSaved = savedMovies.includes(movie.id);

  const handleWatched = () => {
    if (isWatched) {
      removeWatched(movie.id);
    } else {
      addWatched(movie.id);
    }
  };

  const handleFavorite = () => {
    if (isFavorite) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie.id);
    }
  };

  const handleSaved = () => {
    if (isSaved) {
      removeSaved(movie.id);
    } else {
      addSaved(movie.id);
    }
  };

  const getRatingImage = (rating: UKRating) => {
    const ratingMap: Record<UKRating, string> = {
      'U': 'Rating-01.png',
      'PG': 'Rating-02.png',
      '12': 'Rating-03.png',
      '15': 'Rating-04.png',
      '18': 'Rating-05.png',
      'NR': 'Rating-06.png'
    };
    return `/img/ratings/${ratingMap[rating]}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-semibold">{movie.title}</h3>
                <Image
                  src={getRatingImage(movie.ukRating)}
                  alt={`${movie.ukRating} rating`}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 -mt-2">
              {movie.releaseYear} • {movie.runtime} minutes
            </p>

            {movie.trailerUrl && (
              <div className="relative pt-[56.25%] bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${movie.trailerUrl}`}
                  title={`${movie.title} trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            <div className="flex gap-4 justify-center py-2">
              <button
                onClick={handleWatched}
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  isWatched ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title={isWatched ? "Remove from watched" : "Mark as watched"}
              >
                <svg className="w-5 h-5" fill={isWatched ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {isWatched ? 'Watched' : 'Mark as Watched'}
              </button>

              <button
                onClick={handleFavorite}
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  isFavorite ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {isFavorite ? 'Favorited' : 'Add to Favorites'}
              </button>

              <button
                onClick={handleSaved}
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  isSaved ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title={isSaved ? "Remove from saved" : "Save for later"}
              >
                <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                {isSaved ? 'Saved' : 'Save for Later'}
              </button>
            </div>

            <p className="text-gray-600">{movie.description}</p>

            <div className="flex flex-wrap gap-2">
              {movie.cast.map((actor) => (
                <span key={actor} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                  {actor}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 