export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    return NextResponse.json({ error: 'Failed to get session' }, { status: 500 });
  }

  if (session) {
    // Get additional user data from your custom User table
    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError);
    }

    // Return enhanced session with user data
    return NextResponse.json({
      session,
      user: userData || null,
      isAuthenticated: true
    });
  }

  // Return empty session info if not authenticated
  return NextResponse.json({
    session: null,
    user: null,
    isAuthenticated: false
  });
}