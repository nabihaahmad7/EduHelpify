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
      // Check if user settings exist for this user
      const { data: existingSettings, error: settingsError } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      // If no settings exist, create default settings
      if (!existingSettings && settingsError?.code === 'PGRST116') {
        try {
          await supabase
            .from('user_settings')
            .insert({
              user_id: session.user.id,
              bot_name: "MeetO by MLSense",
              bot_image_url: null,
              email_notifications: true,
              enable_auto_join: true
            });
          console.log('Created default user settings for new user:', session.user.id);
        } catch (error) {
          console.error('Error creating default user settings:', error);
        }
      }
    }

    // Redirect to dashboard after successful authentication
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If no code, redirect to login page
  return NextResponse.redirect(new URL('/login', request.url));
}