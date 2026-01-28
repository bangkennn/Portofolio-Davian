import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Ambil sidebar profile
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('sidebar_profile')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      // Jika tidak ada data, return default
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          data: {
            id: 1,
            name: 'Davian Putra',
            job_title: 'Web Developer',
            profile_image_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        });
      }
      throw error;
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch sidebar profile' },
      { status: 500 }
    );
  }
}

// PUT - Update sidebar profile
export async function PUT(request: Request) {
  try {
    const { name, job_title, profile_image_url } = await request.json();

    if (!name || !job_title) {
      return NextResponse.json(
        { error: 'Name and job_title are required' },
        { status: 400 }
      );
    }

    // Cek apakah sudah ada data
    const { data: existing } = await supabase
      .from('sidebar_profile')
      .select('id')
      .limit(1)
      .single();

    let result;
    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('sidebar_profile')
        .update({
          name,
          job_title,
          profile_image_url: profile_image_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Insert new
      const { data, error } = await supabase
        .from('sidebar_profile')
        .insert({
          name,
          job_title,
          profile_image_url: profile_image_url || null,
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json({ data: result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update sidebar profile' },
      { status: 500 }
    );
  }
}

