import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Test endpoint untuk memverifikasi koneksi database
export async function GET() {
  try {
    // Test 1: Cek koneksi Supabase
    const { data: heroData, error: heroError } = await supabase
      .from('hero_content')
      .select('*')
      .limit(1);

    const { data: imageData, error: imageError } = await supabase
      .from('bento_grid_images')
      .select('*')
      .limit(1);

    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      timestamp: new Date().toISOString(),
      tests: {
        hero_content: {
          connected: !heroError,
          error: heroError?.message || null,
          recordCount: heroData?.length || 0,
          sampleData: heroData?.[0] || null,
        },
        bento_grid_images: {
          connected: !imageError,
          error: imageError?.message || null,
          recordCount: imageData?.length || 0,
          sampleData: imageData?.[0] || null,
        },
      },
      supabaseConfig: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configured' : '❌ Missing',
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configured' : '❌ Missing',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Database connection failed',
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

