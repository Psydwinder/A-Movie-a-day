'use client';

import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { useState, useEffect } from 'react';

export default function LoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check if Firebase Auth is initialized
    const checkAuth = async () => {
      try {
        await new Promise((resolve, reject) => {
          const unsubscribe = auth.onAuthStateChanged(
            (user) => {
              unsubscribe();
              resolve(user);
            },
            (error) => {
              unsubscribe();
              reject(error);
            }
          );
        });
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setError('Failed to initialize authentication');
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async () => {
    if (!isInitialized) {
      setError('Authentication is not initialized yet');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('Starting Google sign in...');
      
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, provider);
      console.log('Sign in successful:', result.user.email);
    } catch (error: any) {
      console.error('Error signing in with Google:', {
        code: error.code,
        message: error.message,
        fullError: error
      });
      
      // More user-friendly error messages
      if (error.code === 'auth/configuration-not-found') {
        setError('Please make sure you have enabled Google Sign-in in your Firebase Console.');
      } else if (error.code === 'auth/popup-blocked') {
        setError('Popup was blocked. Please allow popups for this site.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign in was cancelled. Please try again.');
      } else if (error.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized. Please add it to your Firebase Console.');
      } else {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className="flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-lg shadow-md hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-900"></div>
        ) : (
          <FcGoogle className="text-2xl" />
        )}
        <span>{isLoading ? 'Signing in...' : 'Sign in with Google'}</span>
      </button>
      {error && (
        <p className="text-red-500 text-sm mt-2 text-center max-w-sm">{error}</p>
      )}
    </div>
  );
} 