export const dynamic = 'force-dynamic';

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Exchange code for session
    const { data: { session } } = await supabase.auth.exchangeCodeForSession(code);

    if (session) {
      // Check if user already exists in our custom User table
      const { data: existingUser, error: userError } = await supabase
        .from('User')
        .select('id')
        .eq('id', session.user.id)
        .maybeSingle();

      // If user doesn't exist in our custom table, create one
      if (!existingUser) {
        try {
          // Create user in our custom User table
          await supabase
            .from('User')
            .insert({
              id: session.user.id, // Use the same ID as auth.users
              email: session.user.email,
              username: session.user.email.split('@')[0], // Default username from email
              password: crypto.randomUUID(), // Generate a random password since we don't need it for OAuth
              role: 'user'
            });
          console.log('Created new user in database:', session.user.id);
        } catch (error) {
          console.error('Error creating user in database:', error);
        }
      }
    }

    // ✅ Use origin-based redirect
  const origin = request.headers.get('origin') || 'https://eduhelpify.netlify.app';
  return NextResponse.redirect(new URL('/dashboard', origin));
  }

  // If no code, redirect to login page
  return NextResponse.redirect(new URL('/login', request.url));
}