'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Setting up auth listener...');
    
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        console.log('Auth state changed:', user ? `User: ${user.email}` : 'No user');
        setUser(user);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Auth error:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    // Cleanup subscription
    return () => {
      console.log('Cleaning up auth listener...');
      unsubscribe();
    };
  }, []);

  // Debug render
  console.log('AuthProvider render:', { user: user?.email, loading, error });

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="min-h-screen flex items-center justify-center text-red-500">
          Error: {error}
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
} 