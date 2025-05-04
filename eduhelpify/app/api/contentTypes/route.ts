import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  try {
    const { data: contentTypes, error } = await supabase
      .from('contenttype')
      .select('*')
      .in('id', [
        'c0a80101-0000-0000-0000-000000000001', // PDF
        'c0a80101-0000-0000-0000-000000000002', // DOCX
        'c0a80101-0000-0000-0000-000000000003', // TXT
        'c0a80101-0000-0000-0000-000000000011'  // PPTX
      ]);
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to get content types', details: error },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      contentTypes,
    });
    
  } catch (error) {
    console.error('Error getting content types:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
}