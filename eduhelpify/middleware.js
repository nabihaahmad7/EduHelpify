import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

// These routes don't require authentication
const publicRoutes = ['/', '/auth', '/login', '/signup', '/reset-password'];

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Check if the user has a session
  const { data: { session } } = await supabase.auth.getSession();
  
  // Get the current path
  const path = req.nextUrl.pathname;

  // Allow public routes without authentication
  const isPublicRoute = publicRoutes.some(route => 
    path === route || path.startsWith(`${route}/`));
    
  // Also include static files and API routes as public
  const isStaticFile = path.match(/\.(jpg|jpeg|png|gif|svg|css|js)$/);
  const isApiRoute = path.startsWith('/api/');
  
  // If there's no session and the route is not public, redirect to landing
  if (!session && !isPublicRoute && !isStaticFile && !isApiRoute) {
    // Redirect to landing page
    const redirectUrl = new URL('/', req.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  // If session is expired, handle it
  if (session?.expires_at && new Date(session.expires_at * 1000) < new Date()) {
    // Redirect to auth page for re-authentication
    const redirectUrl = new URL('/auth', req.url);
    redirectUrl.searchParams.set('expired', 'true');
    return NextResponse.redirect(redirectUrl);
  }
  
  // Continue with the request
  return res;
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (public image files)
     * - fonts/ (public font files)
     */
    '/((?!_next/static|_next/image|favicon.ico|images|fonts).*)',
  ],
};