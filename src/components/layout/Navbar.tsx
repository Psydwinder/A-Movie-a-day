'use client';

import { useAuth } from '@/providers/AuthProvider';
import LoginButton from '../auth/LoginButton';
import UserMenu from '../auth/UserMenu';

export default function Navbar() {
  const { user, loading } = useAuth();

  console.log('Navbar render:', { user: user?.email, loading }); // Debug log

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-800">Movie-a-Day</h1>
          </div>
          <div className="ml-4">
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-900"></div>
            ) : user ? (
              <UserMenu />
            ) : (
              <LoginButton />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 