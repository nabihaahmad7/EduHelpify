'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

// Define public routes that don't require authentication
const publicRoutes = ['/landing', '/auth', '/login', '/signup', '/reset-password'];

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Check if current route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`));

  useEffect(() => {
    // Only redirect if:
    // 1. Auth check is complete (not loading)
    // 2. No user exists
    // 3. Current route is not public
    if (!isLoading && !user && !isPublicRoute) {
      router.push('/landing');
    }
  }, [user, isLoading, router, pathname, isPublicRoute]);

  // Show loading indicator while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Always render children for public routes, otherwise only if user exists
  return isPublicRoute || user ? children : null;
}