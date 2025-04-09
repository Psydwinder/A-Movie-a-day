import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MovieState {
  watchedMovies: string[];
  favoriteMovies: string[];
  savedMovies: string[];
  addWatched: (movieId: string) => void;
  removeWatched: (movieId: string) => void;
  addFavorite: (movieId: string) => void;
  removeFavorite: (movieId: string) => void;
  addSaved: (movieId: string) => void;
  removeSaved: (movieId: string) => void;
}

export const useMovieStore = create<MovieState>()(
  persist(
    (set) => ({
      watchedMovies: [],
      favoriteMovies: [],
      savedMovies: [],
      addWatched: (movieId) =>
        set((state) => ({
          watchedMovies: [...new Set([...state.watchedMovies, movieId])],
        })),
      removeWatched: (movieId) =>
        set((state) => ({
          watchedMovies: state.watchedMovies.filter((id) => id !== movieId),
        })),
      addFavorite: (movieId) =>
        set((state) => ({
          favoriteMovies: [...new Set([...state.favoriteMovies, movieId])],
        })),
      removeFavorite: (movieId) =>
        set((state) => ({
          favoriteMovies: state.favoriteMovies.filter((id) => id !== movieId),
        })),
      addSaved: (movieId) =>
        set((state) => ({
          savedMovies: [...new Set([...state.savedMovies, movieId])],
        })),
      removeSaved: (movieId) =>
        set((state) => ({
          savedMovies: state.savedMovies.filter((id) => id !== movieId),
        })),
    }),
    {
      name: 'movie-storage',
    }
  )
); 