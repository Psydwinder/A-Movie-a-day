'use client';

import { Movie } from '@/types/movie';
import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import MovieModal from './MovieModal';
import Image from 'next/image';
import confetti from 'canvas-confetti';

interface MovieBoxProps {
  movie: Movie;
  isClickable?: boolean;
  userId: string;
}

// Array of vibrant background colors
const bgColors = [
  'bg-rose-500',
  'bg-pink-500',
  'bg-fuchsia-500',
  'bg-purple-500',
  'bg-violet-500',
  'bg-indigo-500',
  'bg-blue-500',
  'bg-sky-500',
  'bg-cyan-500',
  'bg-teal-500',
  'bg-emerald-500',
  'bg-green-500',
  'bg-lime-500',
  'bg-yellow-500',
  'bg-amber-500',
  'bg-orange-500',
  'bg-red-500',
];

export default function MovieBox({ movie, isClickable = true, userId }: MovieBoxProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth(); // 0 = January

  const canOpen = isClickable && (currentMonth === 0 ? currentDay >= movie.day : true);

  // Update storage key to be user-specific
  const getStorageKey = () => `openedMovies_${userId}`;

  // Check if the movie has been opened before
  useEffect(() => {
    const openedMovies = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
    setHasBeenOpened(openedMovies.includes(movie.id));
  }, [movie.id, userId]);

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
      });
    }, 250);
  };

  const handleClick = () => {
    if (canOpen) {
      setIsModalOpen(true);
      if (!hasBeenOpened) {
        const openedMovies = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
        localStorage.setItem(getStorageKey(), JSON.stringify([...openedMovies, movie.id]));
        setHasBeenOpened(true);
        
        // Trigger initial burst
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
        });
        
        // Start the continuous confetti
        setTimeout(triggerConfetti, 250);
      }
    }
  };

  // Generate a random color based on the movie ID (will stay consistent)
  const randomColor = useMemo(() => {
    const index = Math.abs(movie.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % bgColors.length;
    return bgColors[index];
  }, [movie.id]);

  // Log the poster URL when the component mounts
  useEffect(() => {
    console.log(`Movie: ${movie.title}, Poster Path:`, movie.posterPath);
  }, [movie.title, movie.posterPath]);

  const handleImageError = () => {
    console.error(`Failed to load image for ${movie.title}`);
    setImageError(true);
  };

  const posterUrl = movie.posterPath
    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
    : null;

  const shouldShowColor = !hasBeenOpened || !posterUrl || imageError;

  // Log the full poster URL
  useEffect(() => {
    console.log(`Full poster URL for ${movie.title}:`, posterUrl);
  }, [posterUrl, movie.title]);

  return (
    <>
      <motion.div
        whileHover={canOpen ? { scale: 1.05 } : {}}
        className={`relative w-full h-[400px] rounded-lg overflow-hidden shadow-lg ${
          shouldShowColor ? randomColor : ''
        } ${canOpen ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
        onClick={handleClick}
      >
        {shouldShowColor ? (
          <div className="absolute inset-0">
            {/* Only show day number on unopened cards */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="text-white text-2xl font-bold drop-shadow-lg">
                Day {movie.day}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <Image
              src={posterUrl!}
              alt={`${movie.title} poster`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={true}
              onError={handleImageError}
              unoptimized={true}
            />
          </div>
        )}
      </motion.div>

      <MovieModal
        movie={movie}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
} 